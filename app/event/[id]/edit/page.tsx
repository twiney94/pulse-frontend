"use client";

import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import Layout from "@/app/components/Layout";
import LocationPicker from "@/app/components/LocationPicker";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { uploadImage } from "@/app/utils/upload_image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { httpRequest } from "@/app/utils/http";
import { convertDollarsToCents } from "@/app/utils/pricing";
import { tagOptions } from "@/app/components/TagOptions";
import { Event } from "@/app/types/d";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  timestamp: Yup.date().required("Date and time are required"),
  place: Yup.string().required("Location is required"),
  overview: Yup.string().required("Overview is required"),
  tags: Yup.array().of(Yup.string()).min(1, "Select at least 1"),
  capacity: Yup.number().when("unlimited", {
    is: false,
    then: (schema) =>
      schema
        .required("Capacity is required when not unlimited")
        .min(1, "Capacity must be at least 1"),
  }),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be non-negative"),
});

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [initialValues, setInitialValues] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (status === "authenticated") {
        try {
          const response = await httpRequest<Event>(`/events/${id}`, "GET");
          if (response.organizer.id !== session?.user.id) {
            toast({
              title: "Unauthorized",
              description: "You are not authorized to edit this event.",
              variant: "destructive",
            });
            router.push(`/event/${id}`);
            return;
          }
          setInitialValues({
            title: response.title,
            timestamp: new Date(response.timestamp),
            place: response.place,
            lat: response.lat,
            long: response.long,
            overview: response.overview,
            tags: response.tags,
            capacity: response.capacity,
            unlimited: response.unlimited,
            price: response.price / 100,
          });
          setSelectedTags(response.tags);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load event data.",
            variant: "destructive",
          });
        }
      }
    };
    if (id) fetchEventData();
  }, [status]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setIsSubmitting(true);
      const updatedValues = { ...values, tags: selectedTags };
      if (thumbnail) updatedValues.thumbnail = await uploadImage(thumbnail);
      updatedValues.price = convertDollarsToCents(values.price);
      await httpRequest(`/events/${eventId}`, "PATCH", updatedValues, {
        "Content-Type": "application/ld+json",
      });
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated",
        variant: "default",
      });
      router.push(`/events/${eventId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!initialValues) return <div>Loading event data...</div>;
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty, setFieldValue, values }) => (
            <Form className="space-y-6">
              <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

              {/* Event Title */}
              <div>
                <Label htmlFor="title">Event Title*</Label>
                <Field name="title" as={Input} id="title" />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Event Thumbnail */}
              <div>
                <Label htmlFor="thumbnail">Event Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0])
                      setThumbnail(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </div>

              {/* Event Date and Time */}
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Event Date and Time*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(values.timestamp, "PPP p")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={values.timestamp}
                      onSelect={(date) => setFieldValue("timestamp", date)}
                      disabled={{ before: new Date() }}
                    />
                    <Input
                      type="time"
                      value={format(values.timestamp, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = set(values.timestamp, {
                          hours,
                          minutes,
                        });
                        setFieldValue("timestamp", newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <ErrorMessage
                  name="timestamp"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Location Picker */}
              <LocationPicker
                setFieldValue={setFieldValue}
                place={values.place}
                lat={values.lat}
                long={values.long}
              />

              {/* Event Overview */}
              <div>
                <Label htmlFor="overview" className="font-bold">
                  Event Overview*
                </Label>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    placeholder: "Type or paste your content here!",
                    toolbar: [
                      "undo",
                      "redo",
                      "|",
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "|",
                      "link",
                    ],
                  }}
                  data={values.overview}
                  onChange={(event, editor) =>
                    setFieldValue("overview", editor.getData())
                  }
                />
                <ErrorMessage
                  name="overview"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Event Tags */}
              <div>
                <Label htmlFor="tags">Event Tags*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedTags.length > 0
                        ? selectedTags.join(", ")
                        : "Select tags..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                          {tagOptions.map((tag) => (
                            <CommandItem
                              key={tag.value}
                              onSelect={() => {
                                const isSelected = values.tags.includes(
                                  tag.value
                                );
                                const newTags = isSelected
                                  ? values.tags.filter((t) => t !== tag.value)
                                  : [...values.tags, tag.value];
                                setFieldValue("tags", newTags);
                                setSelectedTags(newTags);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {tag.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <ErrorMessage
                  name="tags"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Capacity */}
              <div className="flex items-center">
                <Label htmlFor="capacity">Capacity*</Label>
                <Field
                  name="capacity"
                  as={Input}
                  type="number"
                  disabled={values.unlimited}
                  className="ml-4"
                />
                <ErrorMessage
                  name="capacity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="mt-4"
              >
                {isSubmitting ? "Updating..." : "Update Event"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

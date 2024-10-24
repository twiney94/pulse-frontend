"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
import { CalendarIcon, XIcon, ChevronsUpDown, Check } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/app/components/Layout";
import LocationPicker from "@/app/components/LocationPicker";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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

// Define available tag options
const tagOptions = [
  { value: "workshop", label: "Workshop" },
  { value: "conference", label: "Conference" },
  { value: "webinar", label: "Webinar" },
  { value: "meetup", label: "Meetup" },
];

// Validation schema for the form
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  timestamp: Yup.date().required("Date and time are required"),
  place: Yup.string().required("Location is required"),
  overview: Yup.string().required("Overview is required"),
  tags: Yup.array().of(Yup.string()).required("At least one tag is required"),
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

export default function CreateEventPage() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Selected tags

  const { toast } = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "Authentication Required",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [status, router]);

  const initialValues = {
    title: "Event Title",
    timestamp: new Date(),
    place: "",
    lat: 0,
    long: 0,
    overview: "",
    tags: [],
    capacity: 0,
    unlimited: false,
    price: 0,
    submitType: "",
  };

  const handleSubmit = async (
    values: { submitType: any; thumbnail?: string },
    { setSubmitting }: any
  ) => {
    if (thumbnail) {
      const imageUrl = await uploadImage(thumbnail);
      values.thumbnail = imageUrl;
    }
    console.log({ ...values, tags: selectedTags });
    setSubmitting(false);
  };

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
              <h1 className="text-3xl font-bold mb-6">{values.title}</h1>
              {/* Event Title */}
              <div>
                <Label htmlFor="title">Event Title</Label>
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
                    if (e.target.files && e.target.files[0]) {
                      setThumbnail(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                />
              </div>

              {/* Event Date and Time */}
              <div className="flex flex-col gap-2">
                <Label>Event Date and Time</Label>
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
                      initialFocus
                    />
                    <div className="mt-2 p-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={format(values.timestamp, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(values.timestamp);
                          newDate.setHours(parseInt(hours, 10));
                          newDate.setMinutes(parseInt(minutes, 10));
                          setFieldValue("timestamp", newDate);
                        }}
                      />
                    </div>
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
                <Label htmlFor="overview">Event Overview</Label>
                <CKEditor
                  editor={ClassicEditor}
                  data={values.overview}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFieldValue("overview", data);
                  }}
                />
                <ErrorMessage
                  name="overview"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Event Tags - Custom Combobox using Popover and Command */}
              <div>
                <Label htmlFor="tags">Event Tags</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={false}
                      className="w-full justify-between"
                    >
                      {selectedTags.length > 0
                        ? selectedTags.join(", ")
                        : "Select tags..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                setSelectedTags((prev) =>
                                  prev.includes(tag.value)
                                    ? prev.filter((t) => t !== tag.value)
                                    : [...prev, tag.value]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTags.includes(tag.value)
                                    ? "opacity-100"
                                    : "opacity-0"
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

              {/* Unlimited Capacity Toggle */}
              <div className="flex items-center space-x-2">
                <Field
                  name="unlimited"
                  as={Switch}
                  id="unlimited"
                  checked={values.unlimited}
                  onCheckedChange={(checked: any) =>
                    setFieldValue("unlimited", checked)
                  }
                />
                <Label htmlFor="unlimited">Unlimited Capacity</Label>
              </div>

              {/* Capacity */}
              {!values.unlimited && (
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Field
                    name="capacity"
                    as={Input}
                    id="capacity"
                    type="number"
                    min="1"
                  />
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {/* Event Price */}
              <div>
                <Label htmlFor="price">Event Price</Label>
                <Field name="price" as={Input} id="price" type="number" />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                disabled={!dirty || !isValid}
              >
                Create Event
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

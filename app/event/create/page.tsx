"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import type { tags } from "@/app/types/d";
import {
  CalendarIcon,
  ChevronsUpDown,
  Check,
  Volleyball,
  Music,
  Palette,
  Utensils,
  Beer,
  PartyPopper,
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tagOptions: Array<{ label: string; value: tags; icon: JSX.Element }> = [
  {
    label: "Sport",
    value: "sport",
    icon: <Volleyball className="mr-2 h-4 w-4" />,
  },
  {
    label: "Culture",
    value: "culture",
    icon: <Palette className="mr-2 h-4 w-4" />,
  },
  { label: "Music", value: "music", icon: <Music className="mr-2 h-4 w-4" /> },
  { label: "Art", value: "art", icon: <Palette className="mr-2 h-4 w-4" /> },
  { label: "Food", value: "food", icon: <Utensils className="mr-2 h-4 w-4" /> },
  { label: "Drink", value: "drink", icon: <Beer className="mr-2 h-4 w-4" /> },
  {
    label: "Party",
    value: "party",
    icon: <PartyPopper className="mr-2 h-4 w-4" />,
  },
  {
    label: "Education",
    value: "education",
    icon: <GraduationCap className="mr-2 h-4 w-4" />,
  },
  {
    label: "Business",
    value: "business",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
  {
    label: "Charity",
    value: "charity",
    icon: <Heart className="mr-2 h-4 w-4" />,
  },
  {
    label: "Family",
    value: "family",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    label: "Friends",
    value: "friends",
    icon: <User className="mr-2 h-4 w-4" />,
  },
  {
    label: "Other",
    value: "other",
    icon: <MoreHorizontal className="mr-2 h-4 w-4" />,
  },
];

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
  const [selectedTags, setSelectedTags] = useState<tags[]>([]); // Selected tags

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
    capacity: 1,
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
              {thumbnail && (
                <div className="w-full relative h-64 rounded-lg">
                  <Image
                    src={URL.createObjectURL(thumbnail)}
                    alt={values.title}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-lg"
                  />
                </div>
              )}
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
                              {tag.icon}
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
                  <div className="flex">
                    <Field
                      name="capacity"
                      as={Input}
                      id="capacity"
                      type="number"
                      min="1"
                    />
                  </div>

                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {/* Event Price */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Label htmlFor="price">Event Price ($)</Label>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    0 for free
                  </kbd>
                </div>
                <Field name="price" as={Input} id="price" type="number" />
                {values.price === 0 ? (
                  <Badge
                    variant="default"
                    className=" bg-green-600 hover:bg-green-700 place-self-start"
                  >
                    Free
                  </Badge>
                ) : (
                  <Badge
                    variant="default"
                    className=" bg-red-600 hover:bg-red-700 place-self-start"
                  >
                    Pay-to-attend
                  </Badge>
                )}
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

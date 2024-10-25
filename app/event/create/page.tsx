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
import { getSession, useSession } from "next-auth/react";
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
import { CalendarIcon, ChevronsUpDown, Check } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  Underline,
  Undo,
} from "ckeditor5";
import { tagOptions } from "@/app/components/TagOptions";

import "ckeditor5/ckeditor5.css";

import { Badge } from "@/components/ui/badge";
import { httpRequest } from "@/app/utils/http";
import { convertDollarsToCents } from "@/app/utils/pricing";

const editorConfig = {
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "link",
      "insertTable",
      "blockQuote",
      "|",
      "outdent",
      "indent",
    ],
    shouldNotGroupWhenFull: false,
  },
  plugins: [
    AccessibilityHelp,
    Autoformat,
    Autosave,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    SelectAll,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline,
    Undo,
  ],
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
    decorators: {
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
    },
  },
  placeholder: "Type or paste your content here!",
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
    ],
  },
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  timestamp: Yup.date().required("Date and time are required"),
  place: Yup.string().required("Location is required"),
  overview: Yup.string().required("Overview is required"),
  tags: Yup.array().of(Yup.string()).required("Tags are required").min(1, "Select at least 1"),
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
  const initialValues = {
    title: "Event Title",
    timestamp: new Date(),
    place: "",
    lat: 0,
    long: 0,
    overview: "",
    tags: [] as string[],
    capacity: 1,
    unlimited: false,
    price: 0,
    submitType: "",
  };

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialValues.tags
  );
  const [ isSubmitting, setIsSubmitting ] = useState(false);

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

  const handleSubmit = async (
    values: { submitType: any; thumbnail?: string; price: number },
    { setSubmitting }: any
  ) => {
    try {
      setIsSubmitting(true);
      if (thumbnail) {
        values.thumbnail = await uploadImage(thumbnail);
      }

      const session = await getSession();
      const userId = session?.user?._id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await httpRequest(
        "/events",
        "POST",
        {
          ...values,
          price: convertDollarsToCents(values.price),
          tags: selectedTags,
          status: values.submitType === "publish" ? "published" : "draft",
          organizer: `users/${userId}`,
        },
        { "Content-Type": "application/ld+json" }
      );

      if (!response) {
        setIsSubmitting(false);
        throw new Error("Failed to create event");
      }

      setIsSubmitting(false);
      toast({
        title: "Event created",
        description: "Your event has been successfully created",
        variant: "default",
      });
      router.push(`/`);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Label htmlFor="title" className="font-bold">
                  Event Title*
                </Label>
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
                <Label htmlFor="overview" className="font-bold">
                  Event Overview*
                </Label>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
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
                <Label htmlFor="tags" className="font-bold">
                  Event Tags*
                </Label>
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
                  <Label htmlFor="price" className="font-bold">
                    Event Price ($)*
                  </Label>
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

              {/* Submit Button, either create as draft or create and publish */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="ghost"
                  disabled={!isValid || !dirty || isSubmitting}
                  onClick={() => setFieldValue("submitType", "draft")}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                  onClick={() => setFieldValue("submitType", "publish")}
                >
                  Save and Publish
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

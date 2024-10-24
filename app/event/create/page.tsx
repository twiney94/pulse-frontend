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
import { CalendarIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/app/components/Layout";
import LocationPicker from "@/app/components/LocationPicker";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  timestamp: Yup.date().required("Date and time are required"),
  place: Yup.string().required("Location is required"),
  overview: Yup.string().required("Overview is required"),
  tags: Yup.array().of(Yup.string()),
  capacity: Yup.number().when("unlimited", {
    is: false,
    then: (schema) =>
      schema
        .required("Capacity is required when not unlimited")
        .positive("Capacity must be positive"),
  }),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be non-negative"),
});

export default function CreateEventPage() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [inputTag, setInputTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

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

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const newTag = value.replace(",", "").trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
        setInputTag("");
      }
    } else {
      setInputTag(value);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputTag === "") {
      setTags((prevTags) => prevTags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (
    values: { submitType: any },
    { setSubmitting }: any
  ) => {
    const status = values.submitType;
    console.log({ ...values, status, thumbnail, tags });
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
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Field name="title" as={Input} id="title" />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

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

                <LocationPicker
                setFieldValue={setFieldValue}
                place={values.place}
                lat={values.lat}
                long={values.long}
                />

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

              {/* Tags Field */}
              <div>
                <Label htmlFor="tags">Event Tags</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(tag)}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={inputTag}
                  onChange={handleTagInput}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type and press ',' to add a tag"
                />
              </div>

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

              {!values.unlimited && (
                <div>
                  <Label htmlFor="capacity">Event Capacity</Label>
                  <Field
                    name="capacity"
                    as={Input}
                    id="capacity"
                    type="number"
                  />
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="price">Event Price</Label>
                <Field
                  name="price"
                  as={Input}
                  id="price"
                  type="number"
                  min="0"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={!isValid || !dirty}
                  onClick={() => setFieldValue("submitType", "draft")}
                >
                  Create as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || !dirty}
                  onClick={() => setFieldValue("submitType", "published")}
                >
                  Create and Publish
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

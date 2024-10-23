"use client";

import { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/app/components/Layout";
import LocationPicker from "@/app/components/LocationPicker";

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

  const handleSubmit = (
    values: { submitType: any },
    { setSubmitting }: any
  ) => {
    const status = values.submitType;
    console.log({ ...values, status, thumbnail });
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

              <div>
                <Label>Event Date and Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(values.timestamp, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={values.timestamp}
                      onSelect={(date) => setFieldValue("timestamp", date)}
                      initialFocus
                    />
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

              <div>
                <Label htmlFor="tags">Event Tags (comma-separated)</Label>
                <Field
                  name="tags"
                  as={Input}
                  id="tags"
                  onChange={(e: { target: { value: string; }; }) => {
                    const tags = e.target.value
                      .split(",")
                      .map((tag) => tag.trim());
                    setFieldValue("tags", tags);
                  }}
                />
                <ErrorMessage
                  name="tags"
                  component="div"
                  className="text-red-500 text-sm"
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

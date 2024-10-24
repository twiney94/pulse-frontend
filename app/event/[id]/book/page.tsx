"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackToHome from "@/app/components/BackToHome";
import { useParams } from "next/navigation";
import { httpRequest } from "@/app/utils/http";
import { Alert } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

const validationSchema = Yup.object().shape({
  ticketQuantity: Yup.number()
    .required("Ticket quantity is required")
    .positive("Ticket quantity must be positive")
    .integer("Ticket quantity must be a whole number"),
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
  expirationMonth: Yup.string().required("Expiration month is required"),
  expirationYear: Yup.string().required("Expiration year is required"),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
});

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const userId = useSession().data?.user?.id;

  const initialValues = {
    ticketQuantity: 1,
    fullName: "",
    phoneNumber: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setIsSubmitting(true);
    try {
      const response = await httpRequest(`/bookings`);
      setIsSubmitting(false);
    } catch (error: any) {
      setError(error.message);
      setIsSubmitting(false);
    }
    console.log(values);
    setIsSubmitting(false);
    setSubmitting(false);
    resetForm();
    alert("Booking successful!");
  };

  return (
    <div className="container flex justify-center items-center mx-auto min-h-screen p-6">
      <BackToHome to={`/event/${id}`} corner="top-left" />(
      {error && (
        <Alert variant="default" className="w-full mb-6">
          {error}
        </Alert>
      )}
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Book Your Tickets</CardTitle>
          <CardDescription>
            Fill in the details to complete your booking
          </CardDescription>
        </CardHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ticketQuantity">Number of Tickets</Label>
                  <Field
                    name="ticketQuantity"
                    as={Input}
                    type="number"
                    min="1"
                  />
                  <ErrorMessage
                    name="ticketQuantity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Field name="fullName" as={Input} />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Field name="phoneNumber" as={Input} type="tel" />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Field
                    name="cardNumber"
                    as={Input}
                    placeholder="1234 5678 9012 3456"
                  />
                  <ErrorMessage
                    name="cardNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="expirationMonth">Expiration Month</Label>
                    <Field name="expirationMonth">
                      {({ field }) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("expirationMonth", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <SelectItem
                                  key={month}
                                  value={month.toString().padStart(2, "0")}
                                >
                                  {month.toString().padStart(2, "0")}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="expirationMonth"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="expirationYear">Expiration Year</Label>
                    <Field name="expirationYear">
                      {({ field }) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("expirationYear", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 10 },
                              (_, i) => new Date().getFullYear() + i
                            ).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="expirationYear"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="cvv">CVV</Label>
                    <Field
                      name="cvv"
                      as={Input}
                      type="password"
                      maxLength="4"
                    />
                    <ErrorMessage
                      name="cvv"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

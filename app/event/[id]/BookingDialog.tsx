"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { httpRequest } from "@/app/utils/http";
import { EventDetails } from "@/app/types/d";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { convertDate } from "@/app/utils/datetime";
import { useRouter } from "next/navigation";
import { convertCentsToDollars } from "@/app/utils/pricing";

export default function BookingDialog({
  eventDetails,
}: {
  eventDetails: EventDetails;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(eventDetails?.price ?? 0);
  const router = useRouter();

  const initialValues = {
    ticketQuantity: 1,
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  };

  useEffect(() => {
    setFinalPrice(ticketQuantity * eventDetails.price); // Calculate final price whenever ticket quantity changes
  }, [ticketQuantity, eventDetails.price]);

  const validationSchema = Yup.object().shape({
    ticketQuantity: Yup.number()
      .required("Ticket quantity is required")
      .positive("Ticket quantity must be positive")
      .max(
        eventDetails?.remaining ?? 0,
        `Only ${eventDetails?.remaining} tickets available`
      )
      .integer("Ticket quantity must be a whole number"),

    cardNumber: Yup.string().when([], {
      is: () => eventDetails?.price !== 0,
      then: (schema) =>
        schema
          .required("Card number is required")
          .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
      otherwise: () => Yup.string(),
    }),
    expirationMonth: Yup.string().when([], {
      is: () => eventDetails?.price !== 0,
      then: (schema) => schema.required("Expiration month is required"),
      otherwise: () => Yup.string(),
    }),
    expirationYear: Yup.string().when([], {
      is: () => eventDetails?.price !== 0,
      then: (schema) => schema.required("Expiration year is required"),
      otherwise: () => Yup.string(),
    }),
    cvv: Yup.string().when([], {
      is: () => eventDetails?.price !== 0,
      then: (schema) =>
        schema
          .required("CVV is required")
          .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
      otherwise: () => Yup.string(),
    }),
  });

  const handleSubmit = async (
    values: { ticketQuantity: any },
    { setSubmitting, resetForm }: any
  ) => {
    setIsSubmitting(true);
    const userId = session?.user?._id;
    try {
      await httpRequest(
        `/bookings`,
        "POST",
        {
          units: values.ticketQuantity,
          event: `${eventDetails.id}`,
        },
        {
          "Content-Type": "application/ld+json",
        }
      );
      setIsSubmitting(false);
      setIsOpen(false);
      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully",
        variant: "default",
      });
      router.push("/account/tickets");
    } catch (error: unknown) {
      toast({
        title: "Booking Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
    resetForm();
    setSubmitting(false);
  };

  const ticketButtonPhrase = () => {
    if (eventDetails?.unlimited) {
      return eventDetails?.price === 0 ? "Get Ticket" : "Buy Tickets";
    } else if ((eventDetails?.remaining ?? 0) > 0) {
      return eventDetails?.price === 0 ? "Get Ticket for Free" : "Buy Tickets";
    } else {
      return "Sold Out";
    }
  };

  const convertedDate = convertDate(eventDetails?.timestamp, "long");
  const date =
    typeof convertedDate === "string" ? convertedDate : convertedDate.date;
  const time = typeof convertedDate === "string" ? "" : convertedDate.time;

  const handleButtonClick = () => {
    if (status === "authenticated") {
      setIsOpen(true);
    } else {
      toast({
        title: "Authentication Required",
        description: "You must authenticate to book tickets",
        variant: "destructive",
      });
      router.push("/login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleButtonClick}
          className="w-full"
          disabled={eventDetails?.remaining === 0 && !eventDetails?.unlimited}
        >
          {ticketButtonPhrase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle>{eventDetails?.title}</DialogTitle>
        <DialogDescription>
          {date} at {time}
        </DialogDescription>
        <Card className="w-full mx-auto my-4">
          <CardHeader>
            <CardTitle>Book Your Tickets</CardTitle>
            <CardDescription>
              Fill in the details to complete your booking for{" "}
              {eventDetails?.title}
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
                  {/* Number of Tickets */}
                  <div>
                    <Label htmlFor="ticketQuantity">Number of Tickets</Label>
                    <Field
                      name="ticketQuantity"
                      as={Input}
                      type="number"
                      min="1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const quantity = parseInt(e.target.value, 10);
                        setTicketQuantity(parseInt(e.target.value));
                        setFieldValue("ticketQuantity", quantity);
                      }}
                    />
                    <ErrorMessage
                      name="ticketQuantity"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Payment details only if price is non-zero */}
                  {eventDetails?.price !== 0 && (
                    <>
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
                      {/* Expiration date and CVV fields */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Expiration Month */}
                        <div>
                          <Label htmlFor="expirationMonth">Exp. Month</Label>
                          <Field name="expirationMonth">
                            {() => (
                              <Select
                                onValueChange={(value) =>
                                  setFieldValue("expirationMonth", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1
                                  ).map((month) => (
                                    <SelectItem
                                      key={month}
                                      value={month.toString().padStart(2, "0")}
                                    >
                                      {month.toString().padStart(2, "0")}
                                    </SelectItem>
                                  ))}
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
                        {/* Expiration Year */}
                        <div>
                          <Label htmlFor="expirationYear">Exp. Year</Label>
                          <Field name="expirationYear">
                            {() => (
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
                                    <SelectItem
                                      key={year}
                                      value={year.toString()}
                                    >
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
                        {/* CVV */}
                        <div>
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
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                  >
                    {isSubmitting ? "Processing..." : "Complete Booking"}
                    {finalPrice > 0 &&
                      ` - ${convertCentsToDollars(finalPrice)}`}
                  </Button>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

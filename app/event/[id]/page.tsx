"use client";

import Image from "next/legacy/image";
import { CalendarIcon, Flag, MapPinIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import Layout from "@/app/components/Layout";
import { useEffect, useState } from "react";
import { httpRequest } from "@/app/utils/http";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { convertDate } from "@/app/utils/datetime";
import { convertCentsToDollars } from "@/app/utils/pricing";
import MapBox from "@/app/components/MapBox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TagOptions from "@/app/components/TagOptions";
import type { EventDetails } from "@/app/types/d";
import BookingDialog from "./BookingDialog";

export default function EventDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await httpRequest<EventDetails>(`/events/${id}`);
        setEventDetails(response);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchEventDetails();
  }, [id]);

  const isItFree = () => {
    const price = convertCentsToDollars(eventDetails?.price ?? 0);
    if (price === "$0.00") {
      return true;
    }
  };

  return (
    <Layout>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src={
              eventDetails?.thumbnail ||
              `/event${Math.floor(Math.random() * 5) + 1}.jpg`
            }
            alt={eventDetails?.title || "Event thumbnail"}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Event Date and Title */}
              <div className="flex items-center justify-between">
                <p className="mb-2 text-sm text-muted-foreground">
                  {eventDetails?.timestamp && (
                    <>{convertDate(eventDetails.timestamp, "short")}</>
                  )}
                </p>
                {session?.user &&
                  session.user.email === eventDetails?.organizer.email && (
                    <Badge variant="secondary">Your event</Badge>
                  )}
                <Button variant="ghost">
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </Button>
              </div>
              <h1 className="mb-6 text-4xl font-bold">{eventDetails?.title}</h1>

              {/* Organizer Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`mailto:${eventDetails?.organizer.email}`}>
                    {" "}
                    {eventDetails?.organizer.email}
                  </a>
                </CardContent>
              </Card>

              {/* Date and Time */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Date and Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventDetails?.timestamp && (
                    <>
                      {/* @ts-ignore */}
                      <p>{convertDate(eventDetails.timestamp).date}</p>
                      {/* @ts-ignore */}
                      <p>{convertDate(eventDetails.timestamp).time}</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{eventDetails?.place}</p>
                  <Button
                    variant="link"
                    className="mt-2 p-0"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? "Hide map" : "Show map"}
                  </Button>
                  {showMap && (
                    <div className="mt-4 h-[200px] w-full bg-muted">
                      <MapBox
                        locations={[
                          {
                            lat: eventDetails?.lat || 0,
                            lng: eventDetails?.long || 0,
                            place: eventDetails?.place || "",
                            price: eventDetails?.price || 0,
                            id: eventDetails?.id || "",
                          },
                        ]}
                        hoveredLocation={null}
                        mode="event"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Description */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Event Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: eventDetails?.overview || "",
                    }}
                  />
                </CardContent>
              </Card>

              {/* Event Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {eventDetails?.tags && <TagOptions tags={eventDetails?.tags} />}
              </div>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-2xl font-bold">
                    {isItFree()
                      ? "Free"
                      : convertCentsToDollars(eventDetails?.price || 0)}
                  </p>
                  {eventDetails &&
                    (session ? (
                      <BookingDialog eventDetails={eventDetails} />
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => router.push("/login")}
                      >
                        Login to book
                      </Button>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

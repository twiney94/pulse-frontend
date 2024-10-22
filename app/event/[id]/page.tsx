"use client";

import Image from "next/legacy/image";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import Layout from "@/app/components/Layout";
import { useEffect, useState } from "react";
import { httpRequest } from "@/app/utils/http";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { convertDate } from "@/app/utils/datetime";
import { convertCentsToDollars } from "@/app/utils/pricing";
import MapBox from "@/app/components/MapBox";
import LoadingScreen from "@/app/components/LoadingScreen";
interface EventDetails {
  "@context": string;
  "@id": string;
  "@type": string;
  id: string;
  thumbnail: string;
  title: string;
  timestamp: string;
  place: string;
  lat: number;
  long: number;
  overview: string;
  tags: [string];
  status: string;
  capacity: number;
  remaining: number;
  unlimited: boolean;
  price: number;
  organizer: string;
  bookings: string[];
  reports: string[];
}

export default function EventDetailsPage() {
  const [showMap, setShowMap] = useState(false);
  const { id } = useParams();

  const [eventDetails, setEventDetails] = useState<EventDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await httpRequest<EventDetails>(`/events/${id}`);
        setEventDetails(response);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (eventDetails) {
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
            {error || loading ? (
              <Skeleton className="absolute inset-0" />
            ) : (
              <Image
                src={eventDetails?.thumbnail || "/placeholder.svg"}
                alt={eventDetails?.title || "Event thumbnail"}
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                {/* Event Date and Title */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-8 w-1/2" />
                ) : (
                  <p className="mb-2 text-sm text-muted-foreground">
                    {eventDetails?.timestamp && (
                      <>{convertDate(eventDetails.timestamp, "short")}</>
                    )}
                  </p>
                )}
                {error || loading ? (
                  <Skeleton className="mb-6 h-8 w-full" />
                ) : (
                  <h1 className="mb-6 text-4xl font-bold">
                    {eventDetails?.title}
                  </h1>
                )}

                {/* Organizer Info */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-28 w-full" />
                ) : (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5" />
                        Organizer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{eventDetails?.organizer}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Date and Time */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-20 w-full" />
                ) : (
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
                          <p>{convertDate(eventDetails.timestamp).date}</p>
                          <p>{convertDate(eventDetails.timestamp).time}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Location */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-32 w-full" />
                ) : (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPinIcon className="mr-2 h-5 w-5" />
                        Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold">Tech Convention Center</p>
                      <p className="text-sm text-muted-foreground">
                        123 Innovation Street, Silicon Valley, CA 94000
                      </p>
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
                                lat: eventDetails.lat,
                                lng: eventDetails.long,
                                place: eventDetails.place,
                                price: eventDetails.price,
                                id: eventDetails.id,
                              },
                            ]}
                            hoveredLocation={null}
                            mode="event"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Event Description */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-48 w-full" />
                ) : (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Event Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{eventDetails?.overview}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Event Tags */}
                {error || loading ? (
                  <Skeleton className="mb-6 h-8 w-full" />
                ) : (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {eventDetails?.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Ticket Price and Buy Button */}
              {error || loading ? (
                <Skeleton className="md:col-span-1" />
              ) : (
                <div className="md:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle>Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-2xl font-bold">
                        {eventDetails
                          ? convertCentsToDollars(eventDetails.price)
                          : "N/A"}
                      </p>
                      <Button className="w-full">Buy Tickets</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  } else {
    return <LoadingScreen />;
  }
}

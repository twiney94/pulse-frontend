"use client";

import Image from "next/legacy/image";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import Layout from "@/app/components/Layout";

export default function EventDetailsPage() {
  const [showMap, setShowMap] = useState(false);
  const { id } = useParams();
  
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src="/unsplash.jpg"
            alt="Event banner"
            layout="fill"
            objectFit="cover"
            className="brightness-75 rounded-lg"
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Event Date and Title */}
              <p className="mb-2 text-sm text-muted-foreground">
                Tuesday, November 4th
              </p>
              <h1 className="mb-6 text-4xl font-bold">
                Annual Tech Conference 2023
              </h1>

              {/* Organizer Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    Organizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Tech Events Inc.</p>
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
                  <p>Tuesday, November 4th, 2023</p>
                  <p>9:00 AM - 5:00 PM EST</p>
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
                      <Image
                        src="/placeholder.svg?height=200&width=600"
                        alt="Map placeholder"
                        width={600}
                        height={200}
                        className="h-full w-full object-cover"
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
                  <p>
                    Join us for the Annual Tech Conference 2023, where industry
                    leaders and innovators come together to share insights,
                    showcase cutting-edge technologies, and network with peers.
                    This year's conference will feature keynote speeches,
                    interactive workshops, and panel discussions on topics
                    ranging from artificial intelligence and blockchain to
                    cybersecurity and the future of work.
                  </p>
                </CardContent>
              </Card>

              {/* Event Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Technology</Badge>
                <Badge variant="secondary">Innovation</Badge>
                <Badge variant="secondary">Networking</Badge>
                <Badge variant="secondary">AI</Badge>
                <Badge variant="secondary">Blockchain</Badge>
              </div>
            </div>

            {/* Ticket Price and Buy Button */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-2xl font-bold">$299.99</p>
                  <Button className="w-full">Buy Tickets</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Layout from "@/app/components/Layout";
import QRCodeDialog from "./QRCode";
import Cancel from "./Cancel";
import { httpRequest } from "@/app/utils/http";

const mockTickets = [
  {
    id: "1",
    eventName: "Summer Music Festival",
    date: new Date("2023-07-15"),
    time: "14:00",
    location: "Central Park, New York",
    numberOfTickets: 2,
    price: 150,
    imageUrl: "/event1.jpg",
  },
  {
    id: "2",
    eventName: "Tech Conference 2023",
    date: new Date("2023-08-22"),
    time: "09:00",
    location: "Convention Center, San Francisco",
    numberOfTickets: 1,
    price: 75,
    imageUrl: "/event2.jpg",
  },
  {
    id: "3",
    eventName: "Food & Wine Expo",
    date: new Date("2023-09-10"),
    time: "11:00",
    location: "Expo Hall, Chicago",
    numberOfTickets: 3,
    price: 50,
    imageUrl: "/event4.jpg",
  },
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [showQRCode, setShowQRCode] = useState(false);

  // FIXME: Add booking informations on the tickets route
  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     const response = await httpRequest("/bookings");
  //     const data = response as { "hydra:member": any[] };
  //     if (data["hydra:member"]) {
  //       setTickets(data["hydra:member"]);
  //     } else {
  //       setTickets([]);
  //     }
  //   };

  //   fetchTickets();
  // }, []);

  if (mockTickets.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            You don't have any tickets yet.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="flex flex-col">
            <CardHeader className="p-0 pb-4">
              <Image
                src={ticket.imageUrl}
                alt={ticket.eventName}
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="flex flex-col px-4 gap-2">
                <CardTitle className="mt-4">{ticket.eventName}</CardTitle>
                <CardDescription>
                  <Badge variant="default">tags</Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(ticket.date, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{ticket.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{ticket.location}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    {ticket.numberOfTickets} person
                    {ticket.numberOfTickets > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                ${ticket.price.toFixed(2)}
              </span>
              <div className="flex gap-2">
                <Cancel />
                <QRCodeDialog />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            You don't have any tickets yet.
          </p>
        </div>
      )}
    </Layout>
  );
}

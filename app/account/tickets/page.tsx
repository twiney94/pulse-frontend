"use client";

import { useState } from "react";
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

// Mock data for tickets
const mockTickets = [
  {
    id: "1",
    eventName: "Summer Music Festival",
    date: new Date("2023-07-15"),
    time: "14:00",
    location: "Central Park, New York",
    ticketType: "VIP",
    price: 150,
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "2",
    eventName: "Tech Conference 2023",
    date: new Date("2023-08-22"),
    time: "09:00",
    location: "Convention Center, San Francisco",
    ticketType: "General Admission",
    price: 75,
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "3",
    eventName: "Food & Wine Expo",
    date: new Date("2023-09-10"),
    time: "11:00",
    location: "Expo Hall, Chicago",
    ticketType: "Early Bird",
    price: 50,
    imageUrl: "/placeholder.svg?height=100&width=200",
  },
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="flex flex-col">
            <CardHeader>
              <Image
                src={ticket.imageUrl}
                alt={ticket.eventName}
                width={200}
                height={100}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-4">{ticket.eventName}</CardTitle>
              <CardDescription>
                <Badge variant="secondary">{ticket.ticketType}</Badge>
              </CardDescription>
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
                  <span>{ticket.ticketType}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                ${ticket.price.toFixed(2)}
              </span>
              <Button variant="outline">View Details</Button>
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

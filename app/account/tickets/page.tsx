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
import { Ticket } from "@/app/types/d";
import TagOptions from "@/app/components/TagOptions";
import { convertCentsToDollars } from "@/app/utils/pricing";
import { convertDate } from "@/app/utils/datetime";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pastTickets, setPastTickets] = useState<Ticket[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await httpRequest("/bookings");
      const data = response as { "hydra:member": any[] };
      if (data["hydra:member"]) {
        const upcomingTickets = data["hydra:member"].filter(
          (ticket) => new Date(ticket.event.timestamp) > new Date()
        );
        const pastTickets = data["hydra:member"].filter(
          (ticket) => new Date(ticket.event.timestamp) < new Date()
        );
        upcomingTickets.forEach((ticket) => {
          if (ticket.status === "cancelled") {
            const index = upcomingTickets.indexOf(ticket);
            if (index > -1) {
              upcomingTickets.splice(index, 1);
            }
            pastTickets.push(ticket);
          }
        });

        setTickets(upcomingTickets);
        setPastTickets(pastTickets);
      } else {
        setTickets([]);
      }
    };

    fetchTickets();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      {tickets.length > 0 && (
        <>
          <h2 className="text-xl font-light">Upcoming Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="flex flex-col">
                <CardHeader className="p-0 pb-4">
                  <Image
                    src={ticket.event.thumbnail || "/event1.jpg"}
                    alt={ticket.event.title}
                    width={400}
                    height={200}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="flex flex-col px-4 gap-2">
                    <CardTitle className="mt-4">
                      <a
                        href={`/event/${ticket.event.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ticket.event.title}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      <TagOptions tags={ticket.event.tags} />
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {/* @ts-ignore */}
                      {convertDate(ticket.event.timestamp, "long").date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {/* @ts-ignore */}
                      {convertDate(ticket.event.timestamp, "long").time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{ticket.event.place}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>
                        {ticket.units} person
                        {ticket.units > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {convertCentsToDollars(ticket.event.price * ticket.units)}
                  </span>
                  <div className="flex gap-2">
                    <Cancel bookingId={ticket["@id"]} />
                    <QRCodeDialog />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      {pastTickets.length > 0 && (
        <>
          <h2 className="text-2xl font-light">Past Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTickets.map((ticket) => (
              <Card key={ticket.id} className="flex flex-col">
                <CardHeader className="p-0 pb-4">
                  <Image
                    src={ticket.event.thumbnail || "/event1.jpg"}
                    alt={ticket.event.title}
                    width={400}
                    height={200}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="flex flex-col px-4 gap-2">
                    <CardTitle className="mt-4">
                      <a
                        href={`/event/${ticket.event.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ticket.event.title}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      <TagOptions tags={ticket.event.tags} />
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {/* @ts-ignore */}
                      {convertDate(ticket.event.timestamp, "long").date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {/* @ts-ignore */}
                      {convertDate(ticket.event.timestamp, "long").time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{ticket.event.place}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>
                        {ticket.units} person
                        {ticket.units > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {convertCentsToDollars(ticket.event.price * ticket.units)}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="default" className="capitalize">
                      {ticket.status === "confirmed"
                        ? "attended"
                        : ticket.status}
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
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

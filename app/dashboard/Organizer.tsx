"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { httpRequest } from "../utils/http";
import { Event } from "../types/d";
import { convertDate } from "../utils/datetime";
import { useRouter } from "next/navigation";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await httpRequest("/events?myevents");
    setEvents(response["hydra:member"]);
  };

  const publishedEvents = events.filter(
    (event) => event.status === "published"
  ).length;
  const draftEvents = events.filter((event) => event.status === "draft").length;

  const changeEventStatus = async (
    id: string,
    newStatus: "published" | "draft"
  ) => {
    await httpRequest(
      `/events/${id}`,
      "PATCH",
      {
        status: newStatus,
      },
      { "Content-Type": "application/merge-patch+json" }
    );
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: newStatus } : event
      )
    );
  };

  const cancelEvent = async (id: string) => {
    await httpRequest(`/events/${id}/cancel`, "POST");
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "canceled" } : event
      )
    );
  };

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={() => router.push("/event/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@username" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">username</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Attendees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce(
                  (sum, event) => sum + event.capacity - event.remaining,
                  0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Draft Events
              </CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftEvents}</div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="all-events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-events">All Events</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          <TabsContent value="all-events" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Events</h2>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        {convertDate(event.timestamp, "short")}
                      </TableCell>
                      <TableCell>{event.capacity - event.remaining}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      {event.status !== "canceled" && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/event/${event.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/event/${event.id}/edit`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeEventStatus(
                                    event.id,
                                    event.status === "published"
                                      ? "draft"
                                      : "published"
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {event.status === "published"
                                  ? "Unpublish"
                                  : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => cancelEvent(event.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Cancel Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="published" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Published Events</AlertTitle>
              <AlertDescription>
                These events are visible to the public and can be booked by
                attendees.
              </AlertDescription>
            </Alert>
            {/* Add a table or list of published events here */}
            {publishedEvents === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No published events</AlertTitle>
                <AlertDescription>
                  You have not published any events yet. Click the "Create
                  Event" button above to get started.
                </AlertDescription>
              </Alert>
            )}
            {publishedEvents > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={events.filter((event) => event.status === "published")}
                >
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Bar dataKey="capacity" fill="#8884d8" />
                  <Bar dataKey="remaining" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          <TabsContent value="drafts" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Draft Events</AlertTitle>
              <AlertDescription>
                These events are not yet visible to the public. Publish them
                when they're ready.
              </AlertDescription>
            </Alert>
            {draftEvents === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No draft events</AlertTitle>
                <AlertDescription>
                  You have no draft events. Click the "Create Event" button
                  above to get started.
                </AlertDescription>
              </Alert>
            )}
            {draftEvents > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events
                      .filter((event) => event.status === "draft")
                      .map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell>
                            {convertDate(event.timestamp, "short")}
                          </TableCell>
                          <TableCell>
                            {event.capacity - event.remaining}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{event.status}</Badge>
                          </TableCell>
                          {event.status !== "canceled" && (
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      changeEventStatus(event.id, "published")
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Publish
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => cancelEvent(event.id)}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Cancel Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CircleUser,
  Music,
  Film,
  Coffee,
  Utensils,
  Palette,
  CalendarPlus,
  Ticket,
} from "lucide-react";
import Image from "next/legacy/image";
import { Button } from "@/components/ui/button";
import pulseLogo from "@/public/pulse@2x.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventSearchBar from "@/app/components/EventSearchBar";

export function Logo() {
  return <Image src={pulseLogo} alt="Pulse" className="object-cover" />;
}

const categories = [
  { name: "Music", icon: Music },
  { name: "Movies", icon: Film },
  { name: "Food", icon: Utensils },
  { name: "Art", icon: Palette },
  { name: "Nightlife", icon: Coffee },
];

const accordionImages = [
  { src: "/event1.jpg", alt: "Event 1", title: "Music Festival" },
  { src: "/event2.jpg", alt: "Event 2", title: "Art Exhibition" },
  { src: "/event3.jpg", alt: "Event 3", title: "Food Fair" },
  { src: "/event4.jpg", alt: "Event 4", title: "Movie Premiere" },
  { src: "/event5.jpg", alt: "Event 5", title: "Night Club Party" },
];

const trendingEvents = [
  {
    title: "Summer Music Fest",
    description: "Annual outdoor music festival",
    image: "/event1.jpg",
  },
  {
    title: "Modern Art Showcase",
    description: "Exhibition of contemporary artists",
    image: "/event2.jpg",
  },
  {
    title: "Gourmet Food Festival",
    description: "Culinary delights from around the world",
    image: "/event3.jpg",
  },
  {
    title: "Blockbuster Movie Night",
    description: "Premiere of the latest blockbuster",
    image: "/event4.jpg",
  },
];

function ImageAccordion() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <div className="flex h-96 w-full overflow-hidden">
      {accordionImages.map((image, index) => (
        <div
          key={index}
          className={`relative cursor-pointer transition-all duration-500 ${
            index === expandedIndex ? "w-3/4" : "w-1/4"
          }`}
          onClick={() => setExpandedIndex(index)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white text-xl font-bold">{image.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg
            className="w-32 h-32 mx-auto animate-pulse"
            viewBox="0 0 226.7 265.33"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_1-2" data-name="Layer_1">
              <g>
                <path
                  className="fill-[#f95454]"
                  d="M226.7,120.32c0,11.72-1.89,22.65-5.66,32.8-3.78,10.15-9.5,18.94-17.15,26.37-7.66,7.43-17.2,13.29-28.63,17.58-11.44,4.29-24.81,6.43-40.12,6.43h-27.38c-2.1,0-3.88.74-5.35,2.2-1.47,1.47-2.2,3.25-2.2,5.34v46.77c0,2.09-.73,3.87-2.19,5.34-1.46,1.47-3.23,2.2-5.31,2.2h-47.16c-2.08,0-3.85-.73-5.31-2.2-1.46-1.46-2.18-3.24-2.18-5.34V43.1c0-2.09.73-3.87,2.2-5.34,1.46-1.46,3.24-2.2,5.34-2.2h96.05c11.72,0,22.76,2.2,33.11,6.59,10.36,4.39,19.35,10.47,26.99,18.21,7.64,7.74,13.7,16.74,18.21,26.99,4.5,10.26,6.75,21.24,6.75,32.96"
                />
                <path
                  className="fill-white"
                  d="M107.02,175.8h-27.38c-2.1,0-3.88.74-5.35,2.2-1.47,1.47-2.2,3.25-2.2,5.34v46.77c0,2.09-.73,3.87-2.19,5.34-1.46,1.47-3.23,2.2-5.31,2.2H17.44c-2.08,0-3.85-.73-5.31-2.2-1.46-1.46-2.18-3.24-2.18-5.34V15.4c0-2.09.73-3.87,2.2-5.34,1.46-1.46,3.24-2.2,5.34-2.2h96.05c11.72,0,22.76,2.2,33.11,6.59,10.36,4.39,19.35,10.47,26.99,18.21,7.64,7.74,13.7,16.74,18.21,26.99,4.5,10.26,6.75,21.24,6.75,32.96s-1.89,22.65-5.66,32.8c-3.78,10.15-9.5,18.94-17.15,26.37-7.66,7.43-17.2,13.29-28.63,17.58-11.44,4.29-24.81,6.43-40.12,6.43ZM109.31,65.63h-29.65c-2.11,0-3.89.73-5.37,2.19-1.47,1.46-2.21,3.22-2.21,5.3v36.81c0,2.08.74,3.85,2.21,5.31,1.47,1.46,3.26,2.18,5.37,2.18h33.75c7.99,0,13.83-2.55,17.5-7.64s5.52-10.87,5.52-17.32c0-3.32-.58-6.6-1.74-9.83-1.16-3.22-2.89-6.08-5.2-8.58s-5.15-4.53-8.51-6.09-7.26-2.34-11.67-2.34Z"
                />
                <path
                  className="fill-black"
                  d="M97.08,167.93h-27.38c-2.1,0-3.88.74-5.35,2.2-1.47,1.47-2.2,3.25-2.2,5.34v46.77c0,2.09-.73,3.87-2.19,5.34-1.46,1.47-3.23,2.2-5.31,2.2H7.49c-2.08,0-3.85-.73-5.31-2.2-1.46-1.46-2.18-3.24-2.18-5.34V7.53c0-2.09.73-3.87,2.2-5.34C3.66.74,5.44,0,7.53,0h96.05c11.72,0,22.76,2.2,33.11,6.59,10.36,4.39,19.35,10.47,26.99,18.21,7.64,7.74,13.7,16.74,18.21,26.99,4.5,10.26,6.75,21.24,6.75,32.96s-1.89,22.65-5.66,32.8c-3.78,10.15-9.5,18.94-17.15,26.37-7.66,7.43-17.2,13.29-28.63,17.58-11.44,4.29-24.81,6.43-40.12,6.43ZM99.37,57.76h-29.65c-2.11,0-3.89.73-5.37,2.19-1.47,1.46-2.21,3.22-2.21,5.3v36.81c0,2.08.74,3.85,2.21,5.31,1.47,1.46,3.26,2.18,5.37,2.18h33.75c7.99,0,13.83-2.55,17.5-7.64s5.52-10.87,5.52-17.32c0-3.32-.58-6.6-1.74-9.83-1.16-3.22-2.89-6.08-5.2-8.58s-5.15-4.53-8.51-6.09-7.26-2.34-11.67-2.34Z"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base w-28"
        >
          <Logo />
        </Link>
        <EventSearchBar />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
          >
            <Ticket className="h-4 w-4" />
            <span>Tickets</span>
          </Button>
        </div>
        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-6xl">
          <ImageAccordion />
          <div className="mt-8 flex justify-center space-x-4">
            {categories.map((category) => (
              <div key={category.name} className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-full"
                >
                  <category.icon className="h-8 w-8" />
                  <span className="sr-only">{category.name}</span>
                </Button>
                <span className="mt-2 text-sm font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <h2 className="mt-12 mb-6 text-2xl font-bold">Trending Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

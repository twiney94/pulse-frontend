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
import LogoMini from "@/public/pulse-mini.svg";

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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
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
                <CardHeader>
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="h-32 w-full object-cover"
                    width={300}
                    height={200}
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleUser, CalendarPlus, Ticket } from "lucide-react";
import Image from "next/legacy/image";
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
import EventSearchBar from "@/app/components/EventSearchBar";

export function Logo() {
  return <Image src={pulseLogo} alt="Pulse" className="object-cover" />;
}

export default function NavBar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base w-28"
      >
        <Logo />
      </Link>
      <EventSearchBar />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="hidden sm:flex items-center gap-2"
          onClick={() => router.push("/event/create")}
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Create Event</span>
        </Button>
        <Button
          variant="outline"
          className="hidden sm:flex items-center gap-2"
          onClick={() => router.push("/account/tickets")}
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
            <DropdownMenuItem onClick={() => router.push("/account")}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
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
  );
}

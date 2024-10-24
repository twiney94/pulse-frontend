"use client";

import Navbar from "./NavBar";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Toaster />
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

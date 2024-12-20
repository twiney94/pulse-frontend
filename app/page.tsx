"use client";

import { useState } from "react";
import Image from "next/legacy/image";
import { Button } from "@/components/ui/button";
import pulseLogo from "@/public/pulse@2x.png";
import Layout from "./components/Layout";
import { tagOptions } from "./components/TagOptions";
import React from "react";
import { useRouter } from "next/navigation";

export function Logo() {
  return <Image src={pulseLogo} alt="Pulse" className="object-cover" />;
}

const accordionImages = [
  { src: "/event1.jpg", alt: "Event 1", title: "Music Festival" },
  { src: "/event2.jpg", alt: "Event 2", title: "Art Exhibition" },
  { src: "/event3.jpg", alt: "Event 3", title: "Food Fair" },
  { src: "/event4.jpg", alt: "Event 4", title: "Movie Premiere" },
  { src: "/event5.jpg", alt: "Event 5", title: "Night Club Party" },
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
  const router = useRouter();

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl">
        <ImageAccordion />
        <div className="mt-8 flex justify-center space-x-4">
          {tagOptions.map((tag) => (
            <div key={tag.label} className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={() => router.push(`/search?tags[]=${tag.value}`)}
              >
                {React.cloneElement(tag.icon, { className: "h-6 w-6" })}
                <span className="sr-only">{tag.label}</span>
              </Button>
              <span className="mt-2 text-sm font-medium">{tag.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

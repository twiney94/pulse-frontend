"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "../components/Layout";
import MapBox from "../components/MapBox";
import { useState } from "react";
import { Badge } from "../components/Badge";
import Link from "next/link";

type Location = {
  lat: number;
  lng: number;
  place: string;
  price: number;
  id: number;
};

const searchResults = [
  {
    id: 1,
    title: "Coffee Shop",
    description: "A cozy place with great espresso",
    timestamp: Date.now() + 1 * 24 * 60 * 60 * 1000,
    location: {
      lat: 48.8655, // Near Palais Garnier
      lng: 2.3324,
      place: "Café de la Paix, Paris",
    },
    price: 300, // 3.00 EUR
  },
  {
    id: 2,
    title: "Pizza Restaurant",
    description: "Authentic Italian pizzas",  
    location: {
      lat: 48.8651, // Near Palais Garnier
      lng: 2.3342,
      place: "Pizza Pino, Paris",
    },
    price: 1500, // 15.00 EUR
  },
  {
    id: 3,
    title: "Bookstore",
    description: "Wide selection of books and cozy reading nooks",
    location: {
      lat: 48.8566, // Near Notre-Dame
      lng: 2.3522,
      place: "Shakespeare and Company, Paris",
    },
    price: 0, // Free
  },
  {
    id: 4,
    title: "Park",
    description: "Large green space with walking trails",
    location: {
      lat: 48.8534, // Near Île de la Cité
      lng: 2.3499,
      place: "Jardin des Tuileries, Paris",
    },
    price: 0, // Free
  },
  {
    id: 5,
    title: "Museum",
    description: "Interactive exhibits on local history",
    location: {
      lat: 48.8611, // Near Louvre
      lng: 2.3355,
      place: "Louvre Museum, Paris",
    },
    price: 1500, // 15.00 EUR
  },
  {
    id: 6,
    title: "Gym",
    description: "Modern equipment and group classes",
    location: {
      lat: 48.8423, // Near Gare de Lyon
      lng: 2.3743,
      place: "Club Med Gym, Paris",
    },
    price: 2000, // 20.00 EUR
  },
  {
    id: 7,
    title: "Movie Theater",
    description: "Latest releases and comfortable seating",
    location: {
      lat: 48.8618, // Near Opéra
      lng: 2.332,
      place: "UGC Ciné Cité, Paris",
    },
    price: 1200, // 12.00 EUR
  },
  {
    id: 8,
    title: "Art Gallery",
    description: "Rotating exhibits of local artists",
    location: {
      lat: 48.8845, // Near Montmartre
      lng: 2.3431,
      place: "Galerie Art Concept, Paris",
    },
    price: 0, // Free
  },
];

export default function SearchPage() {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);

  const locations = searchResults.map((result) => ({
    ...result.location,
    price: result.price ?? 0,
    id: result.id,
  }));

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:pr-4">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 mr-8">
              {searchResults.map((result) => (
                <Link
                  href={`/event/${result.id}`}
                  key={result.id}
                  className="block"
                >
                  <Card
                    className="flex transition-shadow hover:shadow-md"
                    onMouseEnter={() => setHoveredLocation({ ...result.location, price: result.price, id: result.id })}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    <div className="flex-grow">
                      <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription>{result.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {result.price === 0 ? (
                          <Badge className="bg-green-100 text-green-800 border-green-800">
                            Free
                          </Badge>
                        ) : (
                          <Badge className="bg-background border-primary text-primary">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 2,
                            }).format(result.price / 100)}
                          </Badge>
                        )}
                      </CardContent>
                    </div>
                    <div className="w-24 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="hidden md:block">
          <div className="bg-muted h-[calc(100vh-8rem)] rounded-lg flex items-center justify-center">
            <MapBox locations={locations} hoveredLocation={hoveredLocation} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

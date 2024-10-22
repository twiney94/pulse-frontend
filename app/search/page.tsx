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
import { useEffect, useState } from "react";
import { Badge } from "../components/Badge";
import Link from "next/link";
import { httpRequest } from "../utils/http";
import type { Event, Location } from "@/app/types/d";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SearchPage() {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpRequest<Event[]>("/events");
        const results = response["hydra:member"];
        setSearchResults(results);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setSearchResults([]);
        setLoading(false);
      }

    };

    fetchEvents();
  }, []);

  const locations = searchResults.map((result) => ({
    lat: result.lat,
    lng: result.long,
    place: result.place,
    price: result.price ?? 0,
    id: result.id,
  }));

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>  
      )}
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
                    onMouseEnter={() =>
                      setHoveredLocation({
                        lat: result.lat,
                        lng: result.long,
                        place: result.place,
                        price: result.price,
                        id: result.id,
                      })
                    }
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    <div className="flex-grow">
                      <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription>{result.overview}</CardDescription>
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

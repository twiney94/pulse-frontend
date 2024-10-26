"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "../components/Layout";
import MapBox from "../components/MapBox";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { httpRequest } from "../utils/http";
import type { Event, Location } from "@/app/types/d";
import LoadingScreen from "../components/LoadingScreen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { convertCentsToDollars } from "../utils/pricing";
import { convertDate } from "../utils/datetime";
import TagOptions, { tagOptions } from "../components/TagOptions";
import { useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function SearchPage() {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const params = useSearchParams();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpRequest<Event[]>(
          `/events?${params.toString()}`
        );
        const results: Event[] = (response as unknown as { "hydra:member": Event[] })["hydra:member"];
        setSearchResults(results);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setSearchResults([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [params.toString()]);

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
      <ToggleGroup
        type="multiple"
        className="mb-8"
        defaultValue={params.get("tags")?.split(",")}
        onValueChange={(value) => {
          const newParams = new URLSearchParams(params.toString());
          newParams.set("tags", value.join(","));
          window.history.replaceState(null, "", `?${newParams.toString()}`);
        }}
      >
        {tagOptions.map((tag) => (
          <ToggleGroupItem key={tag.value} value={tag.value}>
            {tag.icon}
            {tag.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {searchResults.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center min-h-80 bg-background text-foreground">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-2xl font-bold tracking-tight">
              No events found
            </h1>
            <p className="text-muted-foreground">
              It looks like no event that matches your criteria has been found.
            </p>
          </div>
        </div>
      ) : (
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
                          <CardDescription>
                            {/* @ts-ignore */}
                            {convertDate(result.timestamp, "short")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {result.price === 0 ? (
                            <Badge className="bg-green-100 text-green-800 border-green-800">
                              Free
                            </Badge>
                          ) : (
                            <Badge className="bg-background border-primary text-primary">
                              {convertCentsToDollars(result.price)}
                            </Badge>
                          )}
                        </CardContent>
                        {result.tags && (
                          <CardFooter>
                            <CardDescription>
                              <TagOptions tags={result.tags} />
                            </CardDescription>
                          </CardFooter>
                        )}
                      </div>
                      <div className="w-24 bg-muted flex items-center justify-center">
                        {(result.thumbnail && (
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="object-cover h-full rounded-lg"
                          />
                        )) || (
                          <div className="w-24 h-full rounded-lg bg-background" />
                        )}
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
      )}
    </Layout>
  );
}

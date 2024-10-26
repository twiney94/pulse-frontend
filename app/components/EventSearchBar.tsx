import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const EventSearchBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [event, setEvent] = useState(params.get("title") || "");
  const [location, setLocation] = useState(params.get("place") || "");

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation && !location) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
          fetch(url, {
            method: "GET",
          })
            .then((response) => response.json())
            .then((data) => {
              setLocation(data.features[0].properties.context.place.name);
            });
        });
      }
    };

    fetchLocation();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (location) queryParams.append("place", location);
    if (event) queryParams.append("title", event);
    // if already on search page, just update the query params
    if (pathname === "/search") {
      router.replace(`/search?${queryParams.toString()}`);
      return;
    }
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-1 w-full mx-8 items-center space-x-1 rounded-md border bg-white shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={event}
          placeholder="Search events"
          onChange={(e) => setEvent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full rounded-l-md border-0 pl-9 focus-visible:ring-0"
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-none border-0 border-l border-gray-200 pl-9 focus-visible:ring-0"
        />
      </div>
      <Button
        type="button"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-r-md bg-gradient-to-br from-red-500 to-blue-500 hover:from-blue-500 hover:to-green-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        onClick={handleSearch}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
};

export default EventSearchBar;

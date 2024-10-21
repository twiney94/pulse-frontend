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

const searchResults = [
    {
        id: 1,
        title: "Coffee Shop",
        description: "A cozy place with great espresso",
        location: {
                lat: 37.7749,
                lng: -122.4194,
                place: "San Francisco, CA",
        },
        rating: 4.5,
    },
    {
        id: 2,
        title: "Pizza Restaurant",
        description: "Authentic Italian pizzas",
        location: {
                lat: 40.7128,
                lng: -74.0060,
                place: "New York, NY",
        },
        rating: 4.2,
    },
    {
        id: 3,
        title: "Bookstore",
        description: "Wide selection of books and cozy reading nooks",
        location: {
                lat: 34.0522,
                lng: -118.2437,
                place: "Los Angeles, CA",
        },
        rating: 4.8,
    },
    {
        id: 4,
        title: "Park",
        description: "Large green space with walking trails",
        location: {
                lat: 51.5074,
                lng: -0.1278,
                place: "London, UK",
        },
        rating: 4.6,
    },
    {
        id: 5,
        title: "Museum",
        description: "Interactive exhibits on local history",
        location: {
                lat: 48.8566,
                lng: 2.3522,
                place: "Paris, France",
        },
        rating: 4.3,
    },
    {
        id: 6,
        title: "Gym",
        description: "Modern equipment and group classes",
        location: {
                lat: 35.6895,
                lng: 139.6917,
                place: "Tokyo, Japan",
        },
        rating: 4.1,
    },
    {
        id: 7,
        title: "Movie Theater",
        description: "Latest releases and comfortable seating",
        location: {
                lat: 55.7558,
                lng: 37.6173,
                place: "Moscow, Russia",
        },
        rating: 4.4,
    },
    {
        id: 8,
        title: "Art Gallery",
        description: "Rotating exhibits of local artists",
        location: {
                lat: -33.8688,
                lng: 151.2093,
                place: "Sydney, Australia",
        },
        rating: 4.7,
    },
];

export default function SearchPage() {
  return (
    <Layout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:pr-4">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-4 mr-8">
                {searchResults.map((result) => (
                  <Card key={result.id} className="flex">
                    <div className="flex-grow">
                      <CardHeader>
                        <CardTitle>{result.title}</CardTitle>
                        <CardDescription>{result.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Rating: {result.rating}/5</p>
                      </CardContent>
                    </div>
                    <div className="w-24 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image</span>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="hidden md:block">
            <div className="bg-muted h-[calc(100vh-8rem)] rounded-lg flex items-center justify-center">
                <MapBox locations={searchResults.map((result) => result.location)} />
            </div>
          </div>
        </div>
    </Layout>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/app/components/Layout";

export default function EventDetailsLoading() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Image Skeleton */}
        <div className="relative h-[300px] md:h-[400px]">
          <Skeleton className="absolute inset-0" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Event Date and Title Skeleton */}
              <Skeleton className="mb-6 h-8 w-1/2" />
              <Skeleton className="mb-6 h-8 w-full" />

              {/* Organizer Info Skeleton */}
              <Skeleton className="mb-6 h-28 w-full" />

              {/* Date and Time Skeleton */}
              <Skeleton className="mb-6 h-20 w-full" />

              {/* Location Skeleton */}
              <Skeleton className="mb-6 h-32 w-full" />

              {/* Event Description Skeleton */}
              <Skeleton className="mb-6 h-48 w-full" />

              {/* Event Tags Skeleton */}
              <Skeleton className="mb-6 h-8 w-full" />
            </div>

            {/* Ticket Sidebar Skeleton */}
            <Skeleton className="md:col-span-1" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

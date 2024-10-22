import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export default function EventSearchBar() {
  const handleSearch = () => {
    window.location.href = "/search";
  };

  return (
    <div className="flex flex-1 w-full mx-8 items-center space-x-1 rounded-md border bg-white shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search events"
          className="w-full rounded-l-md border-0 pl-9 focus-visible:ring-0"
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Location"
          className="w-full rounded-none border-0 border-l border-gray-200 pl-9 focus-visible:ring-0"
        />
      </div>
      <Button
        type="button" 
        size="icon" 
        className="h-10 w-10 shrink-0 rounded-r-md bg-red-500 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        onClick={handleSearch}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  )
}
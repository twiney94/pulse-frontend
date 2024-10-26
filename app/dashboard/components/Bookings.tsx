"use client"

import * as React from "react"
import { CalendarIcon, MoreHorizontal, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

// Sample booking data (this can be replaced with actual data fetching)
const sampleBookings = [
  { id: 1, eventName: "Tech Conference 2024", userName: "Alice Johnson", ticketsBought: 2, status: "confirmed", bookingDate: "2024-03-15T10:30:00Z" },
  { id: 2, eventName: "Music Festival", userName: "Bob Smith", ticketsBought: 4, status: "pending", bookingDate: "2024-03-16T14:45:00Z" },
  { id: 3, eventName: "Art Exhibition", userName: "Charlie Brown", ticketsBought: 1, status: "confirmed", bookingDate: "2024-03-17T09:15:00Z" },
  { id: 4, eventName: "Food & Wine Tasting", userName: "Diana Prince", ticketsBought: 3, status: "cancelled", bookingDate: "2024-03-18T11:00:00Z" },
]

type Booking = {
  id: number
  eventName: string
  userName: string
  ticketsBought: number
  status: "confirmed" | "pending" | "cancelled"
  bookingDate: string
}

export function Bookings() {
  const [bookings, setBookings] = React.useState<Booking[]>(sampleBookings)
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false)

  const handleCancelBooking = (bookingId: number) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    )
    setIsCancelDialogOpen(false)
    toast({
      title: "Booking cancelled",
      description: "The booking has been successfully cancelled.",
      variant: "destructive",
    })
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsCancelDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Bookings Management</CardTitle>
          <CardDescription>View and manage event bookings on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                  <TableCell>{booking.ticketsBought}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(booking.bookingDate).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openCancelDialog(booking)}
                          disabled={booking.status === "cancelled"}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Event:</span>
              <span className="col-span-3">{selectedBooking?.eventName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">User:</span>
              <span className="col-span-3">{selectedBooking?.userName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Tickets:</span>
              <span className="col-span-3">{selectedBooking?.ticketsBought}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedBooking && handleCancelBooking(selectedBooking.id)}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
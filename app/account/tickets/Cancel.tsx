import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { httpRequest } from "@/app/utils/http";
import { toast } from "@/hooks/use-toast";

interface CancelDialogProps { 
  bookingId: string;
}

const CancelDialog: React.FC<CancelDialogProps> = ({ bookingId }) => {
  const handleConfirm = async () => {
    const bookingIdWOIRI = bookingId.split("/").pop();
    await httpRequest(
      `/bookings/${bookingIdWOIRI}/cancel`,
      "POST",
      {},
      { "Content-Type": "application/ld+json" }
    );
    toast({
      title: "Booking cancelled successfully",
      variant: "default",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-400 text-red-400 hover:text-red-500 hover:border-red-500"
        >
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you really want to cancel your booking? This process cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default">No</Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            variant="outline"
            autoFocus
            className="border-red-400 text-red-400 hover:text-red-500 hover:border-red-500"
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;

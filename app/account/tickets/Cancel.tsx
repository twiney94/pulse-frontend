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

const CancelDialog: React.FC = () => {
  const handleConfirm = () => {
    // Add your cancel logic here
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

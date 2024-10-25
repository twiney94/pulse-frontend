import React from "react";
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
import QRCode from "react-qr-code";

const QRCodeDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Show QR</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your QR Code</DialogTitle>
          <DialogDescription>
            Scan this code at the entrance to the event.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          {" "}
          <div className="flex justify-center">
            <QRCode value="hey" />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;

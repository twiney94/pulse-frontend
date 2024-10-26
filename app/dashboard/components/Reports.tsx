"use client";

import * as React from "react";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { httpRequest } from "@/app/utils/http";

// Define the structure of a report
type Report = {
  id: number;
  status: string;
  comment: string;
  userId: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  event: {
    id: string;
    title: string;
    timestamp: string; // Added to capture event timestamp
  };
};

const API_URL = "/reports";

export function Reports() {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch reports from the backend
  const fetchReports = async () => {
    try {
      const response = (await httpRequest(API_URL)) as Response;
      if (!response) {
        throw new Error("Failed to fetch reports");
      }
      const data = response as any;
      setReports(
        data["hydra:member"].map((report) => ({
          id: report["@id"].split("/").pop(), // Extracting report ID from @id
          status: report.status,
          comment: report.comment,
          userId: report.userId,
          event: {
            id: report.event["@id"].split("/").pop(), // Extracting event ID
            title: report.event.title,
            timestamp: report.event.timestamp,
          },
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the marking of a report as treated
  const handleMarkAsTreated = async (id: number) => {
    try {
      const response = await httpRequest(`${API_URL}/${id}/resolve`, "POST", {
        action: "false_report",
      });
      if (!response) {
        throw new Error("Failed to mark report as treated");
      }
      // Update local state to reflect the change
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: "resolved" } : report
        )
      );
      toast({
        title: "Report marked as treated",
        description: "The report has been successfully marked as resolved.",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle the cancellation of an event
  const handleCancelEvent = async (name: string, id: number) => {
    const response = await httpRequest(`${API_URL}/${id}/resolve`, "POST", {
      action: "cancel_event",
    });
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, status: "resolved" } : report
      )
    );
    toast({
      title: "Event cancelled",
      description: `The event "${name}" has been cancelled due to the report.`,
      variant: "destructive",
    });
  };

  // Load reports on component mount
  React.useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Reports Management</CardTitle>
          <CardDescription>
            View and manage reports for events on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.event.title}
                  </TableCell>
                  <TableCell>{report.comment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "pending" ? "outline" : "default"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{`${report.userId.firstName} ${report.userId.lastName}`}</TableCell>
                  <TableCell>
                    {new Date(report.event.timestamp).toLocaleString()}
                  </TableCell>
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
                          onClick={() => handleMarkAsTreated(report.id)}
                          disabled={report.status === "resolved"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Treated
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={
                            () =>
                              handleCancelEvent(report.event.title, report.id) // Use event title for cancellation
                          }
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Event
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
    </div>
  );
}

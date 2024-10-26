"use client";

import * as React from "react";
import { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CalendarDaysIcon,
  PartyPopper,
  User,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "./components/Dashboard";
import { Events } from "./components/Events";
import { UsersComponent } from "./components/Users";
import { Bookings } from "./components/Bookings";
import { Reports } from "./components/Reports";
import { useRouter } from "next/navigation";
import { httpRequest } from "../utils/http";
import { set } from "date-fns";
import { convertCentsToDollars } from "../utils/pricing";

// Sample dashboard component (to be replaced with your actual components)
const sampleData = [
  { name: "Jan", total: 12 },
  { name: "Feb", total: 18 },
  { name: "Mar", total: 25 },
  { name: "Apr", total: 32 },
  { name: "May", total: 45 },
  { name: "Jun", total: 38 },
];

// interfface kpis {userCount: 5, eventCount: 5, totalRevenue: 141, reportCount: 5, totalUnitsSold: 3}
interface kpis {
  userCount: number;
  eventCount: number;
  totalRevenue: number;
  reportCount: number;
  totalUnitsSold: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard"); // Default to "dashboard"
  const [kpis, setKpis] = useState<kpis>({
    userCount: 0,
    eventCount: 0,
    totalRevenue: 0,
    reportCount: 0,
    totalUnitsSold: 0,
  });
  const router = useRouter();

  const fetchKpis = async () => {
    const response = await httpRequest("/dashboard/admin");
    setKpis(response);
  };

  React.useEffect(() => {
    fetchKpis();
  }, []);

  const renderContent = () => {
    const dollarRevenue = convertCentsToDollars(kpis.totalRevenue);
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            totalAttendees={kpis.userCount}
            totalEvents={kpis.eventCount}
            totalUsers={kpis.reportCount}
            activeUsers={dollarRevenue}
            kpiData={sampleData}
          />
        );
      case "events":
        return <Events />;
      case "users":
        return <UsersComponent />;
      case "bookings":
        return <Bookings />;
      case "reports":
        return <Reports />;
      default:
        return (
          <Dashboard
            totalAttendees={100}
            totalEvents={50}
            totalUsers={200}
            activeUsers={150}
            kpiData={sampleData}
            revenueData={sampleData}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" onClick={() => router.push("/")}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-primary-foreground">
                    <img src="/pulse-mini.svg" alt="Logo" className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Admin Dashboard</span>
                    <span className="text-xs">Back to Home</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("bookings")}>
                      <PartyPopper className="mr-2 h-4 w-4" />
                      Bookings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("events")}>
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      Events
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("users")}>
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("reports")}>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Reports
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>{/* Optional Footer Content */}</SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </header>
          <main className="flex-1 overflow-auto p-4">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

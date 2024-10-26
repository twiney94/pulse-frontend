"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import Admin from "./Admin";
import Organizer from "./Organizer";
import { useSession } from "next-auth/react";
import { decode } from "jsonwebtoken";
import { Toaster } from "@/components/ui/toaster";

const DashboardPage = () => {
  const router = useRouter();
  const { data: Session, status } = useSession();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!Session) {
      router.push("/login");
    } else {
      if (status === "authenticated") {
        const decoded = decode(Session.user.token);
        const roles = decoded?.roles;
        //   Roles are ROLE_ADMIN, ROLE_ORGANIZER
        if (roles.includes("ROLE_ADMIN")) {
          setRole("admin");
        } else if (roles.includes("ROLE_ORGANIZER")) {
          setRole("organizer");
        } else router.push("/");
      }
    }
  }, [Session]);

  return (
    <>
      <Toaster />
      {role === "admin" && <Admin />}
      {role === "organizer" && <Organizer />}
    </>
  );
};

export default DashboardPage;

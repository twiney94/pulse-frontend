"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { httpRequest } from "../utils/http";
import Layout from "../components/Layout";

// Define validation schema
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters.")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters.")
      .optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmNewPassword,
    {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

export function UpdateProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange", // Ensure validation on every change
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userId = session?.user?._id;
        if (!userId) return;

        const response = await httpRequest(`/users/${userId}`);
        const { firstName, lastName } = response;
        setInitialFirstName(firstName);
        setInitialLastName(lastName);

        form.reset({ firstName, lastName });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [session?.user?._id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userId = session?.user?._id;
    const updatedData: Partial<z.infer<typeof formSchema>> = {};

    if (values.firstName !== initialFirstName)
      updatedData.firstName = values.firstName;
    if (values.lastName !== initialLastName)
      updatedData.lastName = values.lastName;
    if (values.newPassword) updatedData.password = values.newPassword;

    if (Object.keys(updatedData).length === 0) {
      toast({
        title: "No changes detected",
        description: "Please update fields to save changes.",
      });
      return;
    }

    try {
      await httpRequest(`/users/${userId}`, "PATCH", updatedData, {
        "Content-Type": "application/merge-patch+json",
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
      <p className="mb-8">
        Make changes to your profile below and click save when you're done.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (Optional)</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={!form.formState.isDirty || !form.formState.isValid || loading}
          >
            Save Changes
          </Button>
        </form>
      </Form>
    </Layout>
  );
}

export default UpdateProfilePage;

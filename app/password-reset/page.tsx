"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import BackToHome from "@/app/components/BackToHome";
import { httpRequest } from "@/app/utils/http";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);

    try {
      const response = (await httpRequest(
        "/auth/forgot-password",
        "POST",
        values
      )) as { message: string };

      toast({
        title: "Password reset link sent",
        description: "Check your email for the password reset link",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Password reset failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />
      <BackToHome corner="top-left" to="/login" />
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? "Sending..."
                      : "Reset Password"}
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}

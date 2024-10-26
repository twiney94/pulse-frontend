// pages/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import BackToHome from "../components/BackToHome";
import { httpRequest } from "@/app/utils/http";

// Validation schema
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  passwordVerification: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
  first_name: Yup.string().required("Required").max(50, "First name is too long"),
  last_name: Yup.string().required("Required").max(50, "Last name is too long"),
});

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false); // New state for the switch
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (values: { email: string; password: string; first_name: string; last_name: string }) => {
    setIsLoading(true);
    setError("");

    // Set the URI based on the organizer switch
    const signUpUri = isOrganizer ? "/auth/register/organizer" : "/auth/register";

    try {
      await httpRequest(signUpUri, "POST", {
        email: values.email,
        password: values.password,
        firstName: values.first_name,
        lastName: values.last_name,
      });

      router.push("/login");
    } catch (error: any) {
      setError(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <BackToHome corner="top-right" />
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-200">
        <div className="relative flex w-full h-full justify-center">
          <div className="flex flex-col items-center justify-center z-10 gap-4 select-none">
            <Image
              src="/pulse.svg"
              alt="Sign-up illustration"
              className="self-center"
              width={512}
              height={64}
            />
          </div>
          <Image
            src="/unsplash-2.jpg"
            alt="Sign-up illustration"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Sign up to get started with our platform
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={{ email: "", password: "", passwordVerification: "", first_name: "", last_name: "" }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit} // Pass handleSubmit to Formik
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {/* Organizer Switch */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="organizer">I am an event organizer</Label>
                    <Switch
                      id="organizer"
                      checked={isOrganizer}
                      onCheckedChange={(checked) => setIsOrganizer(checked)}
                    />
                  </div>

                  {/* Form fields */}
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Field
                      as={Input}
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      className={`${
                        errors.first_name && touched.first_name ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Field
                      as={Input}
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      className={`${
                        errors.last_name && touched.last_name ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className={`${
                        errors.password && touched.password ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordVerification">Verify Password</Label>
                    <Field
                      as={Input}
                      id="passwordVerification"
                      name="passwordVerification"
                      type="password"
                      placeholder="Verify your password"
                      className={`${
                        errors.passwordVerification && touched.passwordVerification
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="passwordVerification"
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
                    {isSubmitting || isLoading ? "Signing up..." : "Sign up"}
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
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

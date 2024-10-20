"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import BackToHome from "../components/BackToHome";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  passwordVerification: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
});

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
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
            initialValues={{ email: "", password: "", passwordVerification: "" }}
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
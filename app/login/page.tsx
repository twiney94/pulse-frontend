"use client";

import { useRouter } from "next/navigation";
import Image from "next/legacy/image";
import Link from "next/link";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export const TextGradient = () => {
  const [text] = useState("Vibe the city, feel the pulse.");
  const [background] = useState(
    "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)"
  );
  return (
    <div>
      <div className="transition rounded-md bg-gradient-to-br">
        <div className="text-center w-full">
          <div
            className="font-sans inline-block text-4xl font-black !bg-clip-text text-transparent !bg-cover !bg-center transition-all"
            style={{ background }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

export default function EnhancedLoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle className="font-bold">Login Error</AlertTitle>
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
                      placeholder="Enter your password"
                      className={`${
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="text-sm">
                    <Link
                      href="/password-reset"
                      className="text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Logging in..." : "Log in"}
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-200">
        <div className="relative flex w-full h-full justify-center">
          <div className="flex flex-col items-center justify-center z-10 gap-4 select-none">
          <Image
              src="/pulse.svg"
              alt="Login Illustration"
              className="self-center"
              width={512}
              height={128}
            />
            <TextGradient />
          </div>
          <Image
            src="/unsplash.jpg"
            alt="Login illustration"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

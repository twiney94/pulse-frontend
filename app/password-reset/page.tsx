"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import BackToHome from "../components/BackToHome"

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
})

export default function ForgotPasswordPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: { email: string }) => {
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <BackToHome corner="top-left" />
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
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
                  {error && (
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="default" className="border-green-500 bg-green-50">
                      <CheckCircledIcon className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        Password reset link sent. Check your email.
                      </AlertDescription>
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
                        errors.email && touched.email ? 'border-red-500' : ''
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
                    disabled={isSubmitting || isLoading || success}
                  >
                    {isSubmitting || isLoading ? "Sending..." : "Reset Password"}
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Remember your password?{" "}
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
  )
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AuthError } from "@/features/auth/utils/auth-error";
import { ApiError } from "@/shared/api/api-error";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants";
import { applyFieldErrors } from "@/shared/utils/form";

const LOGIN_FIELDS = ["email", "password"] as const;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
      router.replace(ROUTES.dashboard);
    } catch (error) {
      if (error instanceof ApiError) {
        const unmatched = applyFieldErrors<LoginFormValues>(error.fieldErrors, LOGIN_FIELDS, setError);
        setServerError([error.message, ...unmatched.map((item) => item.message)].join(" "));
      } else if (error instanceof AuthError) {
        setServerError(error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Access the Assignment Management System with your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError ? (
          <p className="mb-4 rounded-md bg-danger-container px-3 py-2 text-body-sm text-on-danger-container">
            {serverError}
          </p>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? <p className="text-caption text-error">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? <p className="text-caption text-error">{errors.password.message}</p> : null}
          </div>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
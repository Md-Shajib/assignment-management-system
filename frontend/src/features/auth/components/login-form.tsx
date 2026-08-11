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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants";
import { applyFieldErrors } from "@/shared/utils/form";

const LOGIN_FIELDS = ["email", "password"] as const;

export function LoginForm() {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
      {serverError ? (
        <p
          role="alert"
          className="mb-6 rounded-md bg-danger-container px-3 py-2 text-body-sm text-on-danger-container"
        >
          {serverError}
        </p>
      ) : null}

      <div className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            variant="underline"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-caption text-error">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            variant="underline"
            autoComplete="current-password"
            invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p id="password-error" className="text-caption text-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* No password-reset endpoint exists yet (docs/04-API-DESIGN.md §8.1). */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled
          title="Password reset is not available yet"
          className="text-caption font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="mt-4 w-full" loading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}

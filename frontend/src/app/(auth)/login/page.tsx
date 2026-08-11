import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { AuthShowcase } from "@/features/auth/components/auth-showcase";
import { LoginForm } from "@/features/auth/components/login-form";
import { GoogleIcon } from "@/shared/components/ui/icons/google-icon";
import { APP_NAME } from "@/shared/constants";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthShowcase />

      <section className="flex items-center justify-center bg-surface-container-lowest px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-body-sm font-bold uppercase tracking-widest text-on-surface">
              {APP_NAME}
            </span>
            <GraduationCap className="h-5 w-5 shrink-0 text-on-surface" aria-hidden />
          </div>

          <h1 className="mt-10 text-center text-h2 text-balance">Welcome to {APP_NAME}</h1>

          <LoginForm />

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-divider" />
            <span className="text-caption text-on-surface-subtle">or</span>
            <span className="h-px flex-1 bg-divider" />
          </div>

          {/* Federated sign-in has no API support yet (docs/04-API-DESIGN.md §8.1). */}
          <button
            type="button"
            disabled
            title="Google sign-in is not available yet"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-md py-2 text-body-sm text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Sign in with Google
          </button>

          {/* Accounts are created by an administrator (docs/IMPLEMENTED.md: register is Admin-only). */}
          <p className="mt-8 text-center text-body-sm text-on-surface-subtle">
            Are you new?{" "}
            <button
              type="button"
              disabled
              title="Accounts are created by an administrator"
              className="font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create an Account
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

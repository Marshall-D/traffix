// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context/AuthContext";
import ROUTES from "../utils/routes";

type ProtectedRouteProps = {
  children: React.ReactNode;
  /** optional path to redirect to when unauthenticated */
  redirectTo?: string;
  /** optional: whether to require the user to be verified (if you use isVerified) */
  requireVerified?: boolean;
};

/**
 * Client-side protection wrapper.
 * Usage: wrap page contents in <ProtectedRoute>...</ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  redirectTo = ROUTES.LOGIN_PAGE,
  requireVerified = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If still restoring auth, do nothing (wait)
    if (loading) return;

    // If not authenticated, redirect
    if (!user) {
      // Avoid redirect loop if already on login
      if (router.pathname !== redirectTo) {
        router.replace(redirectTo);
      }
    } else if (requireVerified && user && user.isVerified === false) {
      // Optional: handle unverified users
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo, requireVerified]);

  // While auth is being restored, show a simple loading state to avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white2">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
              strokeOpacity="0.25"
            />
            <path
              d="M22 12a10 10 0 00-10-10"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary-light"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-sm text-gray-500">Checking your session…</div>
        </div>
      </div>
    );
  }

  // If not authenticated we already triggered a redirect — render null to avoid flashing protected UI
  if (!user) return null;

  // Otherwise render children
  return <>{children}</>;
}

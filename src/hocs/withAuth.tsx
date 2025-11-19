// src/hocs/withAuth.tsx
import React from "react";
import { NextPage } from "next";
import ProtectedRoute from "@/src/components/ProtectedRoute";

/**
 * HOC wrapper to protect pages.
 * Usage:
 *   export default withAuth(MyPage);
 *
 * Accepts optional options: redirectTo, requireVerified
 */

type WithAuthOptions = {
  redirectTo?: string;
  requireVerified?: boolean;
};

// Constrain P so TypeScript knows it is valid props for a React component
export default function withAuth<P extends Record<string, unknown>>(
  Component: NextPage<P>,
  options?: WithAuthOptions
): NextPage<P> {
  const { redirectTo = "/login", requireVerified = false } = options || {};

  const Wrapped: NextPage<P> = (props: P) => {
    return (
      <ProtectedRoute redirectTo={redirectTo} requireVerified={requireVerified}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  // Preserve Next.js data-fetching methods if they exist on the original component
  // We must use `any` here because the static properties are not typed on NextPage<P>.
  if ((Component as any).getServerSideProps) {
    (Wrapped as any).getServerSideProps = (Component as any).getServerSideProps;
  }
  if ((Component as any).getStaticProps) {
    (Wrapped as any).getStaticProps = (Component as any).getStaticProps;
  }
  if ((Component as any).getInitialProps) {
    (Wrapped as any).getInitialProps = (Component as any).getInitialProps;
  }

  return Wrapped;
}

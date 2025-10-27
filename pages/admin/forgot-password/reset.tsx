// pages/admin/forgot-password/reset.tsx
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { mdiKey, mdiCheck } from "@mdi/js";
import ROUTES from "@/src/utils/routes";

/**
 * Create New Password / Reset screen
 *
 * Reuses the same layout + assets as your other forgot-password pages.
 * - Two password inputs
 * - Live validation: length, letters, numbers
 * - Checklist with check icons
 * - Proceed button (disabled until valid & matching)
 * - Back to login link
 */

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const allValid = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch = password !== "" && password === confirm;
  const canProceed = allValid && passwordsMatch;

  const checklist = useMemo(
    () => [
      { ok: hasMinLength, label: "Must be 8 characters" },
      { ok: hasLetter, label: "Must include letters (A–Z)" },
      { ok: hasNumber, label: "Must include numbers (0–9)" },
    ],
    [hasMinLength, hasLetter, hasNumber]
  );

  const handleProceed = () => {
    if (!canProceed) return;
    // TODO: call reset API here
    // on success:
    router.push(ROUTES.LOGIN_PAGE);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left gradient/illustration - hidden on mobile */}
      <div className="hidden md:block bg-primary-light w-1/2" />

      {/* Right panel */}
      <div className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-12 md:my-5">
          <div className="hidden md:block w-[131px] h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>
          <div className="md:hidden w-[77px] h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-[420px] px-6 py-8 bg-white">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
            Create New Password
          </h1>
          <p className="text-center text-grey-2 mb-6">Secure your account</p>

          {/* Password inputs */}
          <div className="space-y-4">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              preppendIcon={mdiKey}
            />

            <Input
              type={showConfirm ? "text" : "password"}
              label="Password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              preppendIcon={mdiKey}
            />
          </div>

          {/* Checklist */}
          <div className="mt-6 space-y-3">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    item.ok ? "bg-primary" : "border border-grey-3"
                  }`}
                >
                  {item.ok ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-white"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M9 12.5l2 2 4-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-grey-4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#E6E6E6"
                        strokeWidth="1.25"
                      />
                    </svg>
                  )}
                </div>
                <div
                  className={`text-sm ${
                    item.ok ? "text-black" : "text-grey-2"
                  }`}
                >
                  {item.label}
                </div>
              </div>
            ))}

            {/* mismatch message */}
            {confirm !== "" && !passwordsMatch && (
              <div className="text-red-500 text-sm mt-2">
                Passwords do not match
              </div>
            )}
          </div>

          {/* Proceed button */}
          <div className="mt-8">
            <Button
              className={`w-full rounded-md py-3 ${
                canProceed ? "bg-primary" : "bg-grey-3 cursor-not-allowed"
              }`}
              onClick={handleProceed}
              disabled={!canProceed}
              type="button"
            >
              Proceed
            </Button>
          </div>

          {/* Back to login */}
          <div className="w-full mt-6 text-center">
            <a
              className="underline cursor-pointer hover:text-primary"
              onClick={() => router.push(ROUTES.LOGIN_PAGE)}
            >
              Back to Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

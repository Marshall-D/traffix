// pages/admin/forgot-password/reset.tsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";
import useForgotPassword from "@/src/hooks/useForgotPassword";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const {
    password,
    confirm,
    setPassword,
    setConfirm,
    hasMinLength,
    hasLetter,
    hasNumber,
    passwordsMatch,
    canReset,
    resetPassword,
    resetError,
  } = useForgotPassword();

  const checklist = [
    { ok: hasMinLength, label: "Must be 8 characters" },
    { ok: hasLetter, label: "Must include letters (A–Z)" },
    { ok: hasNumber, label: "Must include numbers (0–9)" },
  ];

  const handleProceed = async () => {
    const res = await resetPassword();
    if (res.success) {
      router.push(ROUTES.LOGIN_PAGE);
    } else {
      // TODO: show toast / show inline error. For now we console.warn
      console.warn("Reset failed:", res.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:block bg-primary-light w-1/2" />

      <div className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-12 md:my-5">
          <div className="hidden md:block w-[131px] h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>
          <div className="md:hidden w-[77px] h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
        </div>

        <div className="w-full max-w-[420px] px-6 py-8 bg-white">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
            Create New Password
          </h1>
          <p className="text-center text-grey-2 mb-6">Secure your account</p>

          <div className="space-y-4">
            <Input
              type="password"
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              preppendIcon={undefined}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              preppendIcon={undefined}
            />
          </div>

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

            {confirm !== "" && !passwordsMatch && (
              <div className="text-red-500 text-sm mt-2">
                Passwords do not match
              </div>
            )}
            {resetError && (
              <div className="text-red-500 text-sm mt-2">{resetError}</div>
            )}
          </div>

          <div className="mt-8">
            <Button
              className={`w-full rounded-md py-3 ${
                canReset ? "bg-primary" : "bg-grey-3 cursor-not-allowed"
              }`}
              onClick={handleProceed}
              disabled={!canReset}
              type="button"
            >
              Proceed
            </Button>
          </div>

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

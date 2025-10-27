// pages/admin/forgot-password/verify.tsx
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";

const OTP_LENGTH = 4; // change to 6 if you want 6 digits

const VerifyOTP: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]); // typed array of nullable inputs

  const isComplete = otp.every((c) => c !== "");

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const val = e.target.value;
    const char = val.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[i] = char ?? "";
    setOtp(newOtp);
    if (char && i < OTP_LENGTH - 1) focusInput(i + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    const key = e.key;
    if (key === "Backspace") {
      if (otp[i]) {
        const newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        focusInput(i - 1);
        const newOtp = [...otp];
        newOtp[i - 1] = "";
        setOtp(newOtp);
      }
    } else if (key === "ArrowLeft" && i > 0) {
      focusInput(i - 1);
    } else if (key === "ArrowRight" && i < OTP_LENGTH - 1) {
      focusInput(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("Text").replace(/\s/g, "");
    const digits = paste.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (digits.length === 0) return;
    const newOtp = Array(OTP_LENGTH)
      .fill("")
      .map((_, idx) => digits[idx] ?? "");
    setOtp(newOtp);
    const firstEmpty = newOtp.findIndex((c) => c === "");
    focusInput(firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty);
  };

  const handleProceed = () => {
    if (!isComplete) return;
    const code = otp.join("");
    // TODO: call verify API with 'code', then navigate
    router.push(ROUTES.FORGOT_PASSWORD_RESET);
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

        <h1 className="mb-4 md:my-6 font-medium text-2xl md:text-4xl">
          Forgot Password
        </h1>

        <p className="mb-8 md:mb-10 text-center text-grey-2">
          Enter verification code sent to email
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={(el: HTMLInputElement | null) => {
                // <-- use block body and don't return a value
                inputsRef.current[i] = el;
              }}
              inputMode="numeric"
              pattern="\d*"
              type="text"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              aria-label={`OTP digit ${i + 1}`}
              className={
                "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-center text-lg md:text-xl rounded-md border border-grey-3 outline-none transition focus:shadow-sm " +
                "focus:border-primary"
              }
            />
          ))}
        </div>

        <div className="w-full max-w-[420px] px-6">
          <Button
            className={`w-full rounded-md py-3 ${
              isComplete ? "bg-primary" : "bg-grey-3 cursor-not-allowed"
            }`}
            onClick={handleProceed}
            disabled={!isComplete}
            type="button"
          >
            Proceed
          </Button>
        </div>

        <div className="w-full max-w-[420px] mt-6 text-center">
          <a
            className="underline cursor-pointer hover:text-primary"
            onClick={() => router.push(ROUTES.LOGIN_PAGE)}
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

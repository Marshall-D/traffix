// pages/admin/forgot-password/verify.tsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";
import useForgotPassword from "@/src/hooks/useForgotPassword";
import OtpInput from "@/src/components/otp/OtpInput";
import toast from "react-hot-toast";
const VerifyOTP: React.FC = () => {
  const router = useRouter();
  const {
    OTP_LENGTH,
    otp,
    inputsRef,
    isOtpComplete,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    verifyOtp,
  } = useForgotPassword();

  const onProceed = async () => {
    const res = await verifyOtp();
    if (res.success) {
      toast.success("Code verified");
      router.push(ROUTES.FORGOT_PASSWORD_RESET);
    } else {
      toast.error(res.message ?? "Verification failed");
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

        <h1 className="mb-4 md:my-6 font-medium text-2xl md:text-4xl">
          Forgot Password
        </h1>
        <p className="mb-8 md:mb-10 text-center text-grey-2">
          Enter verification code sent to email
        </p>

        <OtpInput
          length={OTP_LENGTH}
          otp={otp}
          inputsRef={inputsRef}
          onChange={handleOtpChange}
          onKeyDown={handleOtpKeyDown}
          onPaste={handleOtpPaste}
        />

        <div className="w-full max-w-[420px] px-6">
          <Button
            className={`w-full rounded-md py-3 ${
              isOtpComplete ? "bg-primary" : "bg-grey-3 cursor-not-allowed"
            }`}
            onClick={onProceed}
            disabled={!isOtpComplete}
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

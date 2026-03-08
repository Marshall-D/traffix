// pages/admin/forgot-password/index.tsx
import React from "react";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
import { mdiEmailOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import Image from "next/image";
import { useRouter } from "next/router";
import ROUTES from "@/src/utils/routes";
import "react-tooltip/dist/react-tooltip.css";
import useForgotPassword from "@/src/hooks/useForgotPassword";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const { formik, isSelected, handleClick } = useForgotPassword("", {
    onSuccess: (email: string) => {
      router.push(
        `${ROUTES.FORGOT_PASSWORD_RESET}?email=${encodeURIComponent(email)}`
      );
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side (hidden on small screens) */}
      <div className="hidden md:block bg-primary-light w-1/2"></div>

      {/* Right Side (Forgot Password Form) */}
      <div className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo (responsive sizing) */}
        <div className="mb-20 md:my-5">
          <div className="hidden md:block w-[131px] h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>
          <div className="md:hidden w-[77px] h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 md:my-16 font-medium text-2xl md:text-4xl">
          <p>Forgot Password</p>
        </div>

        {/* Instructions */}
        <div className="mb-6 md:my-16 text-center text-grey-2">
          <p>Enter the email associated with your account for verification.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center space-y-4 w-full max-w-[330px]"
        >
          {/* Email Input */}
          <div className="w-full">
            <Input
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              label="Enter Email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              {...formik.getFieldMeta("email")}
            />
          </div>

          {/* Send Verification Button */}
          <div className="w-full pt-32 pb-10 lg:py-10">
            <Button
              className={`w-full ${
                isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
              }`}
              type="submit"
              onClick={handleClick}
              variant="error"
            >
              Send Verification
            </Button>
          </div>

          {/* Back to Login Link */}
          <div className="w-full text-center">
            <a
              className="underline cursor-pointer hover:text-primary"
              onClick={() => router.push(ROUTES.LOGIN_PAGE)}
            >
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

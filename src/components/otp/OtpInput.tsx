// src/components/otp/OtpInput.tsx
import React from "react";

type OtpInputProps = {
  /** number of digits */
  length: number;
  /** array of string digits (controlled) */
  otp: string[];
  /** ref to store inputs (forwarded from hook) */
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>;
  /** called with (value, index) on change */
  onChange: (value: string, index: number) => void;
  /** called with (key, index) on keydown */
  onKeyDown: (key: string, index: number) => void;
  /** called with paste text (raw) */
  onPaste: (pasteText: string) => void;
  className?: string;
};

const defaultInputClass =
  "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-center text-lg md:text-xl rounded-md border border-grey-3 outline-none transition focus:shadow-sm focus:border-primary";

export default function OtpInput({
  length,
  otp,
  inputsRef,
  onChange,
  onKeyDown,
  onPaste,
  className,
}: OtpInputProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 md:gap-6 mb-10 ${
        className ?? ""
      }`}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[i] = el;
          }}
          inputMode="numeric"
          pattern="\d*"
          type="text"
          maxLength={1}
          value={otp[i] ?? ""}
          onChange={(e) => onChange(e.target.value ?? "", i)}
          onKeyDown={(e) => onKeyDown(e.key, i)}
          onPaste={(e) => {
            e.preventDefault();
            onPaste(e.clipboardData.getData("Text"));
          }}
          aria-label={`OTP digit ${i + 1}`}
          className={defaultInputClass}
        />
      ))}
    </div>
  );
}

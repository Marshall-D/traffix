import classNames from "classnames";
import React, { FC } from "react";

interface Props {
  label: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  htmlFor?: string;
}

const InputLabel: FC<Props> = ({ label, size, required, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames("capitalize block mb-1 font-medium", {
        "text-sm": size === "sm" || size === "md",
      })}
    >
      {label} {required ? <span className="text-error">*</span> : null}
    </label>
  );
};

export default InputLabel;

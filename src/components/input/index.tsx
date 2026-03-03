import { mdiEye, mdiEyeOff } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import React, { forwardRef, useState } from "react";

import { IInput } from "./input";
import InputLabel from "../inputLabel";

// When type="password", the right-side icon is always the visibility toggle (takes precedence over appendIcon).
// eslint-disable-next-line react/display-name
export const Input = forwardRef<HTMLInputElement, IInput>(
  (
    {
      onChange,
      onBlur,
      value,
      description,
      type = "text",
      label = "",
      className,
      size = "md",
      id,
      touched,
      error,
      required,
      name,
      preppendIcon,
      appendIcon,
      placeholder,
      onAppendClick,
      onPreppendClick,
      variant = "square",
      borderVariant = "default",
      inputBackgroundVariant = "default",
      placeholderVariant = "default",
      iconSize = 1,
      disabled,
      preppendImg,
    },
    ref
  ) => {
    const isPassword = type === "password";
    const [showPasswordVisible, setShowPasswordVisible] = useState(false);
    const effectiveType = isPassword
      ? showPasswordVisible
        ? "text"
        : "password"
      : type;
    const showAppendIcon = isPassword || appendIcon;
    const valid = !touched || (touched && !error);

    const classes = classNames(
      "px-2  pt-2 pb-3  w-full placeholder:text-xs border  rounded-md hover:bg-blue-200",
      // FormSize[size],
      // InputVariant[variant],
      // BorderVariant[borderVariant],
      // InputBackgroundVariant[inputBackgroundVariant],
      preppendIcon && "pl-12",
      preppendImg && "pl-12",
      showAppendIcon && "pr-10",
      valid ? "border-grey" : "border-2 border-error",
      placeholderVariant === "default"
        ? "placeholder:text-[#C2C9D1]"
        : "placeholder:text-black"
    );

    const handleTogglePasswordVisibility = () => {
      if (isPassword) setShowPasswordVisible((prev) => !prev);
    };

    return (
      <div onBlur={onBlur} className={className}>
        {!!label && (
          <InputLabel
            htmlFor={id}
            size={size}
            required={required}
            label={label}
          />
        )}

        <div className="relative">
          <div
            onClick={onPreppendClick}
            className="flex absolute inset-y-0 left-0 items-center pl-4"
          >
            {preppendIcon ? (
              <Icon size={iconSize} path={preppendIcon} color="grey"></Icon>
            ) : null}
            {preppendImg ? (
              // <div>
              <img
                className="text-black cursor-pointer"
                // size={iconSize}
                height={20}
                width={20}
                src={preppendImg}
              />
            ) : // </div>
            null}
          </div>
          {/* <p className="flex absolute inset-y-0 left-10 items-center pl-4">
            placeholder
          </p> */}
          <div
            onClick={isPassword ? handleTogglePasswordVisibility : onAppendClick}
            className="flex absolute inset-y-0 right-0 items-center pr-3"
            role={isPassword ? "button" : undefined}
            aria-label={isPassword ? (showPasswordVisible ? "Hide password" : "Show password") : undefined}
            tabIndex={isPassword ? 0 : undefined}
            onKeyDown={
              isPassword
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setShowPasswordVisible((prev) => !prev);
                    }
                  }
                : undefined
            }
          >
            {isPassword ? (
              <Icon
                className="text-[#6b7280] cursor-pointer hover:text-gray-900"
                size={iconSize}
                path={showPasswordVisible ? mdiEyeOff : mdiEye}
                aria-hidden
              />
            ) : appendIcon ? (
              <Icon
                className="text-[#E4E7EC] cursor-pointer"
                size={iconSize}
                path={appendIcon}
              ></Icon>
            ) : null}
          </div>
          <input
            ref={ref}
            id={id}
            name={name}
            className={classes}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            type={effectiveType}
            disabled={disabled}
          />
        </div>
        {description && valid ? (
          <span className="mt-2 text-black text-xs leading-tight block">
            {description}
          </span>
        ) : null}
        {/* Form Validation */}
        {!valid ? (
          <span className="mt-2 text-error text-xs leading-tight block">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

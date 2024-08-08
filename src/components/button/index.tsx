import React from "react";
import { ButtonClasses, InputVariant, FormSize } from "../themes";
import classNames from "classnames";
// import { mdiLoading } from '@mdi/js';
import { IButton } from "./button";
// import Icon from '@mdi/react';

export const Button: React.FC<
  IButton &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = ({
  className = "",
  children,
  size = "sm",
  // variant = "primary",
  input = "square",
  disabled,
  loading,
  onClick,
  type,
  isSelected,
  ...rest
}): any => {
  const classes = classNames(
    `w-full ${isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"}`,
    ButtonClasses,
    FormSize[size],
    InputVariant[input]
    // ButtonVariant,
    // className
  );

  return (
    <button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {/* {loading ? <Icon spin size={1} path={mdiLoading}></Icon> : children} */}
      {children}
    </button>
  );
};

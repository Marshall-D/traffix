import React from "react";
import classNames from "classnames";
import { mdiLoading } from "@mdi/js";
import { IButton } from "./button";
import Icon from "@mdi/react";
import {
  FormSize,
  ButtonVariant,
  Disabled,
  ButtonClasses,
  InputVariant,
} from "../themes";

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
  variant = "primary",
  input = "square",
  disabled,
  loading,
  onClick,
  type,
  ...rest
}): any => {
  const classes = classNames(
    ButtonClasses,
    ButtonVariant[variant],
    FormSize[size],
    InputVariant[input],
    { [Disabled]: disabled },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {loading ? <Icon spin size={1} path={mdiLoading}></Icon> : children}
    </button>
  );
};

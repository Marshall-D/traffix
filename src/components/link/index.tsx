import classNames from "classnames";
import Linkk from "next/link";
import React from "react";
import { LinkVariant } from "../themes";
// import { LinkVariant } from '@themes';
import { ILink } from "./Link";

export const Link: React.FC<ILink> = ({
  className,
  href = "#",
  variant = "primary",
  textColor = "",
  children,
  disabled = false,
  onClick,
  style,
  target,
  enableShadowHover,
  active,
}) => {
  const classes = classNames(
    !disabled && LinkVariant[variant],
    `text-${textColor}`,
    { "cursor-not-allowed": disabled },
    enableShadowHover && "hover:shadow-2xl",
    active && "text-primary",
    className
  );
  return (
    <Linkk target={target} href={href}>
      <a
        className={classes}
        target={target}
        href={href}
        onClick={onClick}
        style={style}
      >
        {children}
      </a>
    </Linkk>
  );
};

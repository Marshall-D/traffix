import Icon from "@mdi/react";
import classNames from "classnames";
import React from "react";
import { IIconButton } from "./iconButton";
import { Disabled } from "../themes";
export const IconButton: React.FC<IIconButton> = ({
  className = "",
  path,
  onClick,
  bgColor = "bg-white",
  iconColor,
  hoverColor,
  size = 1,
  enclose = true,
  disabled,
  children,

  ...rest
}) => {
  const classes = classNames(
    `${iconColor}`,
    `${bgColor}`,
    `${hoverColor}`,
    `rounded-full`,
    { "p-2": enclose },
    { [Disabled]: disabled },
    className
  );
  return (
    <button className={classes} {...rest} onClick={onClick} disabled={disabled}>
      <Icon path={path} size={size}></Icon>
      {children}
    </button>
  );
};

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
  iconColor = "text-grey-1",
  // hoverColor = ,
  size = 1,
  enclose = true,
  disabled,

  ...rest
}) => {
  const classes = classNames(
    `${iconColor}`,
    `${bgColor}`,
    `rounded-full`,
    { "p-2": enclose },
    { [Disabled]: disabled },

    className
  );
  return (
    <button
      // data-tooltip-target="tooltip-default"
      className={classes}
      {...rest}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon path={path} size={size}></Icon>
    </button>
  );
};

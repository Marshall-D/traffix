import Icon from '@mdi/react';
import classNames from 'classnames';
import React from 'react';
import { IIconButton } from './iconButton';

export const IconButton: React.FC<IIconButton> = ({
  className = '',
  path,
  onClick,
  bgColor = 'bg-white',
  iconColor = 'text-grey-1',
  // hoverColor = ,
  size = 1,
  enclose = true,
  ...rest
}) => {
  const classes = classNames(
    `${iconColor}`,
    `${bgColor}`,
    `rounded-full`,
    { 'p-2': enclose },
    className
  );
  return (
    <button className={classes} {...rest} onClick={onClick}>
      <Icon path={path} size={size}></Icon>
    </button>
  );
};

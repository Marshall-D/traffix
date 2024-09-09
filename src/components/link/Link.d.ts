import React from 'react';

export type ILink = {
  variant?: 'primary' | 'secondary' | 'light' | 'transparent' | string;
  className?: string;
  textColor?: string;
  children?: any;
  href?: any;
  target?: any;
  disabled?: boolean;
  onClick?: any;
  style?: React.CSSProperties;
  enableShadowHover?: boolean;
  active?: boolean;
};

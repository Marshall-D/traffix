import { ReactNode } from "react";

export type IModal = {
  handleClose?: any;
  children: any;
  label?: string;
  isOpen: boolean;
  className?: string;
  bgColor: string;
  maxWidth?: string;
  children: string | JSX.Element | (JSX.Element | string)[];
  footer?: ReactNode;
};

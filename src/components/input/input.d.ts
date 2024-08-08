import React from "react";

export interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  value?: string | string[] | number;
  type?: React.HTMLInputTypeAttribute;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "square" | "rounded";
  borderVariant?: "default" | "black" | "transparent";
  inputBackgroundVariant?: "default" | "grey";
  placeholderVariant?: "default" | "solid";
  id?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  preppendIcon?: any;
  preppendImg?: string;
  appendIcon?: any;
  onPreppendClick?: any;
  onAppendClick?: any;
  // Validation Props
  touched?: boolean;
  valid?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string | undefined;
  iconSize?: number;
}

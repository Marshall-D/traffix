export type IButton = {
  className?: string;
  children: string | JSX.Element | Array<JSX.Element | string>;
  size?: 'lg' | 'md' | 'sm';
  input?: 'square' | 'rounded';
  variant?:
    | 'primary'
    | 'primary-outline'
    | 'secondary'
    | 'secondary-outline'
    | 'success'
    | 'success-outline'
    | 'error'
    | 'error-outline'
    | 'light'
    | 'light-outline'
    | 'black'
    | 'social'
    | 'white';
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  as?: React.ElementType<any>;
};

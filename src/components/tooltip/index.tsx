import React, { FC, ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  position?: 'top' | 'left' | 'right' | 'bottom';
}

export const Tooltip: FC<Props> = ({ text, children, position = 'top' }) => {
  return (
    <div
      className="tooltip"
      data-tip={text}
      tooltip-primary
      tooltip-top={position === 'top'}
      tooltip-bottom={position === 'bottom'}
      tooltip-left={position === 'left'}
      tooltip-right={position === 'right'}
    >
      {children}
    </div>
  );
};

'use client';

import { cn } from '../../lib';
import type { WrapperProps } from './types';

export const Heading1Wrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('w-full mt-[2em] mb-1', className)} {...props}>
      {props.children}
    </div>
  );
};

export const Heading1: React.FC<{
  className?: string;
}> = ({ className, ...props }) => {
  return (
    <h1
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 m-0 font-semibold text-3xl leading-[1.3] focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
};

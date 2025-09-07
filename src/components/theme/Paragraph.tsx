'use client';

import { cn } from '../../lib';

export const Paragraph: React.FC<{
  className?: string;
}> = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 focus-visible:outline-none',
        className,
      )}
    />
  );
};

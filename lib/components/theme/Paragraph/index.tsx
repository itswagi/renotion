import { memo } from 'react';
import { cn } from '../../../lib';

export const Paragraph: React.FC<{
  className?: string;
}> = memo(({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'renotion-paragraph re:w-full re:whitespace-break-spaces re:break-words re:py-[3px] re:px-0.5 re:focus-visible:outline-none',
        className,
      )}
    />
  );
});

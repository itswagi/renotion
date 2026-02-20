import { memo } from 'react';
import { cn } from '../../../lib';
import type { WrapperProps } from '../types';

export const Heading3Wrapper: React.FC<WrapperProps> = memo(
  ({ className, ...props }) => {
    return (
      <div
        className={cn(
          'renotion-heading3-wrapper re:w-full re:mt-[1em] re:mb-[1px]',
          className,
        )}
        {...props}
      >
        {props.children}
      </div>
    );
  },
);

export const Heading3: React.FC<{
  className?: string;
}> = memo(({ className, ...props }) => {
  return (
    <h3
      className={cn(
        'renotion-heading3 re:w-full re:whitespace-break-spaces re:break-words re:py-[3px] re:px-0.5 re:m-0 re:font-semibold re:text-xl re:leading-[1.3] re:focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
});

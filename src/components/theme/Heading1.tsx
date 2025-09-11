import { cn } from '../../lib';
import type { WrapperProps } from './types';

export const Heading1Wrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'renotion-heading1-wrapper re:w-full re:mt-[2em] re:mb-1',
        className,
      )}
      {...props}
    >
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
        'renotion-heading1 re:w-full re:whitespace-break-spaces re:break-words re:py-[3px] re:px-0.5 re:m-0 re:font-semibold re:text-3xl re:leading-[1.3] re:focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
};

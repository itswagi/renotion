import { cn } from '../../lib';
import type { WrapperProps } from './types';

export const Heading2Wrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'renotion-heading2-wrapper re:w-full re:mt-[1.4em] re:mb-[1px]',
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};

export const Heading2: React.FC<{
  className?: string;
}> = ({ className, ...props }) => {
  return (
    <h2
      className={cn(
        'renotion-heading2 re:w-full re:whitespace-break-spaces re:break-words re:py-[3px] re:px-0.5 re:m-0 re:font-semibold re:text-2xl re:leading-[1.3] re:focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
};

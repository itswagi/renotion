import { cn } from '../../lib';
import type { WrapperProps } from './types';

export const Heading3Wrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn('w-full mt-[1em] mb-[1px]', className)} {...props}>
      {props.children}
    </div>
  );
};

export const Heading3: React.FC<{
  className?: string;
}> = ({ className, ...props }) => {
  return (
    <h3
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 m-0 font-semibold text-xl leading-[1.3] focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
};

import { cn } from '../../lib';
import type { WrapperProps } from './types';

export const HorizontalRuleWrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full my-[1px] text-[rgba(255,255,255,0.13)] h-[13px] flex items-center',
        className,
      )}
    >
      {props.children}
    </div>
  );
};

export const HorizontalRule: React.FC = () => {
  return (
    <div
      role="separator"
      className="w-full h-[1px] visible border-b-[1px] border-[rgba(255,255,255,0.13)]"
    />
  );
};

import { cn } from '../../../lib';
import type { WrapperProps } from '../types';

export const HorizontalRuleWrapper: React.FC<WrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'renotion-horizontalRule-wrapper re:w-full re:my-[1px] re:text-[rgba(255,255,255,0.13)] re:h-[13px] re:flex re:items-center',
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
      className="renotion-horizontalRule re:w-full re:h-[1px] re:visible re:border-b-[1px] re:border-[rgba(255,255,255,0.13)]"
    />
  );
};

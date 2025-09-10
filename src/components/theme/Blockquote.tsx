import { cn } from '../../lib';

export const BlockquoteWrapper: React.FC<{
  blockIdx: number;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div
      data-block-idx={i}
      key={i}
      className="border-l-[3px] border-[rgba(255,255,255,0.81)] w-full px-3.5"
    >
      {children}
    </div>
  );
};

export const BlockquoteItem: React.FC<{
  level: number;
  className?: string;
}> = ({ level, className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        'w-full py-1 focus-visible:outline-none',
        {
          'border-l-[3px] border-[rgba(255,255,255,0.81)] px-3.5 ': level > 1,
        },
        className,
      )}
      style={{
        ...(level > 1 && {
          marginInlineStart: `${(level - 2) * 14 + 3 * (level - 2)}px`,
        }),
      }}
    />
  );
};

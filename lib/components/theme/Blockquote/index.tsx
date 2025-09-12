import { cn } from '@/lib';

export const BlockquoteWrapper: React.FC<{
  blockIdx: number;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div
      data-block-idx={i}
      key={i}
      className="renotion-blockquote-wrapper re:border-l-[3px] re:border-[rgba(255,255,255,0.81)] re:w-full re:px-3.5"
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
        `renotion-blockquote-${level} re:w-full re:py-1 re:focus-visible:outline-none`,
        {
          're:border-l-[3px] re:border-[rgba(255,255,255,0.81)] re:px-3.5 ':
            level > 1,
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

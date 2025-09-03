'use client';

import { useTextChanges } from '../hooks/useTextChanges.jsx';
import { cn, type RichText } from '../lib/index.js';

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
  id: string;
  rich_text: RichText[];
  onChange?: (updated: RichText[]) => void;
  ref?: any;
  className?: string;
}> = ({
  level,
  id,
  rich_text,
  onChange,
  ref: dragRef,
  className,
  ...props
}) => {
  const { ref, handleBeforeInput, handleInput } = useTextChanges({
    onChange,
    blockIdx: id,
    rich_text,
  });
  return (
    <div
      {...props}
      ref={dragRef ? dragRef : ref}
      contentEditable="true"
      suppressContentEditableWarning
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      data-block-idx={id}
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

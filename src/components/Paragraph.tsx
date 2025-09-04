'use client';

import { useTextChanges } from '../hooks/useTextChanges';
import { cn, type RichText } from '../lib';

export const Paragraph: React.FC<{
  onChange?: (updated: RichText[]) => void;
  blockIdx: string;
  rich_text: RichText[];
  ref?: any;
  className?: string;
}> = ({ onChange, blockIdx, rich_text, ref: dragRef, className, ...props }) => {
  const { ref, handleBeforeInput, handleInput } = useTextChanges({
    onChange,
    blockIdx,
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
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 focus-visible:outline-none',
        className,
      )}
    />
  );
};

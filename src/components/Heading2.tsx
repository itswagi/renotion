'use client';

import { useTextChanges } from '../hooks/useTextChanges.jsx';
import { cn, type RichText } from '../lib/index.js';

export const Heading2Wrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
  ref?: any;
}> = ({ blockIdx: i, children, ref, ...props }) => {
  return (
    <div
      ref={ref}
      data-block-idx={i}
      className="w-full mt-[1.4em] mb-[1px]"
      {...props}
    >
      {children}
    </div>
  );
};

export const Heading2: React.FC<{
  rich_text: RichText[];
  blockIdx: string;
  onChange?: (updated: RichText[]) => void;
  ref?: any;
  className?: string;
}> = ({ onChange, blockIdx, rich_text, ref: dragRef, className, ...props }) => {
  const { ref, handleBeforeInput, handleInput } = useTextChanges({
    onChange,
    blockIdx,
    rich_text,
  });
  return (
    <h2
      {...props}
      ref={dragRef ? dragRef : ref}
      contentEditable="true"
      suppressContentEditableWarning
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 m-0 font-semibold text-2xl leading-[1.3] focus-visible:outline-none',
        className,
      )}
    />
  );
};

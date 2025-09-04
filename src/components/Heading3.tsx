'use client';

import { useTextChanges } from '../hooks/useTextChanges';
import { cn, type RichText } from '../lib';

export const Heading3Wrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
  ref?: any;
}> = ({ blockIdx: i, children, ref, ...props }) => {
  return (
    <div
      ref={ref}
      data-block-idx={i}
      className="w-full mt-[1em] mb-[1px]"
      {...props}
    >
      {children}
    </div>
  );
};

export const Heading3: React.FC<{
  rich_text: RichText[];
  blockIdx: string;
  onChange?: (updated: RichText[]) => void;
  ref?: any;
  className?: string;
}> = ({ rich_text, blockIdx, onChange, ref: dragRef, className, ...props }) => {
  const { ref, handleBeforeInput, handleInput } = useTextChanges({
    onChange,
    blockIdx,
    rich_text,
  });
  return (
    <h3
      {...props}
      ref={dragRef ? dragRef : ref}
      contentEditable="true"
      suppressContentEditableWarning
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      className={cn(
        'w-full whitespace-break-spaces break-words py-[3px] px-0.5 m-0 font-semibold text-xl leading-[1.3] focus-visible:outline-none',
        className,
      )}
    />
  );
};

'use client';

import { useTextChanges } from '../hooks/useTextChanges.jsx';
import { cn, type RichText } from '../lib/index.js';

export const ListWrapper: React.FC<{
  blockIdx: number;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div data-block-idx={i} key={i} className="w-full">
      {children}
    </div>
  );
};

export const ListItem: React.FC<{
  level: number;
  type: 'ordered' | 'unordered' | 'task';
  numbering?: number; // only for ordered lists
  checked?: boolean; // only for task lists
  id: string;
  rich_text: RichText[];
  onChange?: (updated: RichText[]) => void;
  ref?: any;
  className?: string;
}> = ({
  level,
  id,
  type,
  checked,
  numbering,
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
      className={cn(`w-full my-[1px]`)}
      style={{
        ...(level > 0 && {
          marginInlineStart: `${level * 24}px`,
        }),
      }}
      data-block-idx={id}
    >
      <div className="w-full flex items-start ps-0.5">
        {type === 'unordered' && level % 3 === 0 && (
          <div className="w-6 flex justify-center items-center grow-0 shrink-0 min-h-[calc(1.5em+6px)] me-0.5">
            <div className="text-[1.5em] leading-none mb-0 before:content-['•'] before:font-arial" />
          </div>
        )}
        {type === 'unordered' && level % 3 === 1 && (
          <div className="w-6 flex justify-center items-center grow-0 shrink-0 min-h-[calc(1.5em+6px)] me-0.5">
            <div className="text-[1.5em] leading-none mb-0 before:content-['◦'] before:font-arial" />
          </div>
        )}
        {type === 'unordered' && level % 3 === 2 && (
          <div className="w-6 flex justify-center items-center grow-0 shrink-0 min-h-[calc(1.5em+6px)] me-0.5">
            <div className="text-[1.5em] leading-none mb-0 before:content-['▪'] before:font-arial" />
          </div>
        )}
        {type === 'ordered' && (
          <div className="w-[unset] flex justify-center items-center grow-0 shrink-0 min-h-[calc(1.5em+6px)] me-0.5">
            <div
              data-numbering={`${numbering}.`} // note the non-breaking space at the end
              className="leading-none mb-0 before:inline-block before:[content:attr(data-numbering)] before:whitespace-pre before:font-arial"
            />
          </div>
        )}
        {type === 'task' && (
          <div className="select-none me-[2px] w-6 flex items-center justify-center shrink-0 grow-0 min-h-[calc(1.5em+6px)] fill-current">
            <div
              className={cn(
                'relative shrink-0 grow-0 w-4 h-4 flex items-center justify-center rounded-[3px] transition-colors duration-200 ease-out',
                {
                  'bg-[#2383e2]': checked,
                  'bg-transparent border border-[rgba(255,255,255,0.46)]':
                    !checked,
                },
              )}
            >
              <div aria-hidden="true">
                {checked && (
                  <svg
                    aria-hidden="true"
                    role="graphics-symbol"
                    viewBox="0 0 14 14"
                    className="w-[14px] h-[14px] block fill-white shrink-0"
                  >
                    <path d="M6.00879 11.4033C5.70605 11.4033 5.45378 11.2829 5.25195 11.042L2.73242 7.99023C2.64453 7.88932 2.58268 7.79167 2.54688 7.69727C2.51107 7.60286 2.49316 7.50521 2.49316 7.4043C2.49316 7.17318 2.56966 6.98275 2.72266 6.83301C2.87891 6.68001 3.07422 6.60352 3.30859 6.60352C3.56901 6.60352 3.78548 6.70931 3.95801 6.9209L5.98926 9.43555L9.97852 3.13184C10.0794 2.97884 10.1836 2.87142 10.291 2.80957C10.4017 2.74447 10.5368 2.71191 10.6963 2.71191C10.9307 2.71191 11.1243 2.78678 11.2773 2.93652C11.4303 3.08626 11.5068 3.27507 11.5068 3.50293C11.5068 3.58757 11.4922 3.67546 11.4629 3.7666C11.4336 3.85775 11.388 3.95215 11.3262 4.0498L6.78027 11.0078C6.60124 11.2715 6.34408 11.4033 6.00879 11.4033Z" />
                  </svg>
                )}
              </div>
              <input
                aria-labelledby=":rkh:"
                type="checkbox"
                defaultChecked={checked}
                className="absolute opacity-0 w-4 h-4 top-0 start-0 cursor-pointer"
              />
            </div>
          </div>
        )}
        <div className="flex-[1_1_0px] min-w-[1px] flex flex-col">
          <div
            {...props}
            ref={dragRef ? dragRef : ref}
            contentEditable="true"
            suppressContentEditableWarning
            onBeforeInput={handleBeforeInput}
            onInput={handleInput}
            className={cn(
              'w-full whitespace-break-spaces break-words py-[3px] px-0.5 text-start focus-visible:outline-none',
              className,
            )}
          />
        </div>
      </div>
    </div>
  );
};

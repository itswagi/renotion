import { cn } from '../../../lib';

export const ListWrapper: React.FC<{
  blockIdx: number;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div data-block-idx={i} key={i} className="renotion-list-wrapper re:w-full">
      {children}
    </div>
  );
};

export const ListItem: React.FC<{
  level: number;
  type: 'ordered' | 'unordered' | 'task';
  numbering?: number; // only for ordered lists
  checked?: boolean; // only for task lists
  blockIdx: string;
  className?: string;
}> = ({ level, blockIdx, type, checked, numbering, className, ...props }) => {
  return (
    <div
      className={cn(
        `renotion-list-${type} renotion-list-${level} re:w-full re:my-[1px]`,
      )}
      style={{
        ...(level > 0 && {
          marginInlineStart: `${level * 24}px`,
        }),
      }}
      data-block-idx={blockIdx}
    >
      <div className="re:w-full re:flex re:items-start re:ps-0.5">
        {type === 'unordered' && level % 3 === 0 && (
          <div className="re:w-6 re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:min-h-[calc(1.5em+6px)] re:me-0.5">
            <div className="re:text-[1.5em] re:leading-none re:mb-0 re:before:content-['•'] re:before:font-arial" />
          </div>
        )}
        {type === 'unordered' && level % 3 === 1 && (
          <div className="re:w-6 re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:min-h-[calc(1.5em+6px)] re:me-0.5">
            <div className="re:text-[1.5em] re:leading-none re:mb-0 re:before:content-['◦'] re:before:font-arial" />
          </div>
        )}
        {type === 'unordered' && level % 3 === 2 && (
          <div className="re:w-6 re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:min-h-[calc(1.5em+6px)] re:me-0.5">
            <div className="re:text-[1.5em] re:leading-none re:mb-0 re:before:content-['▪'] re:before:font-arial" />
          </div>
        )}
        {type === 'ordered' && (
          <div className="re:w-[unset] re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:min-h-[calc(1.5em+6px)] re:me-0.5">
            <div
              data-numbering={`${numbering}.`} // note the non-breaking space at the end
              className="re:leading-none re:mb-0 re:before:inline-block re:before:[content:attr(data-numbering)] re:before:whitespace-pre re:before:font-arial"
            />
          </div>
        )}
        {type === 'task' && (
          <div className="re:select-none re:me-[2px] re:w-6 re:flex re:items-center re:justify-center re:shrink-0 re:row-0 re:min-h-[calc(1.5em+6px)] re:fill-current">
            <div
              className={cn(
                're:relative re:shrink-0 re:grow-0 re:w-4 re:h-4 re:flex re:items-center re:justify-center re:rounded-[3px] re:transition-colors re:duration-200 re:ease-out',
                {
                  're:bg-[#2383e2]': checked,
                  're:bg-transparent re:border re:border-[rgba(255,255,255,0.46)]':
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
                    className="re:w-[14px] re:h-[14px] re:block re:fill-white re:shrink-0"
                  >
                    <path d="M6.00879 11.4033C5.70605 11.4033 5.45378 11.2829 5.25195 11.042L2.73242 7.99023C2.64453 7.88932 2.58268 7.79167 2.54688 7.69727C2.51107 7.60286 2.49316 7.50521 2.49316 7.4043C2.49316 7.17318 2.56966 6.98275 2.72266 6.83301C2.87891 6.68001 3.07422 6.60352 3.30859 6.60352C3.56901 6.60352 3.78548 6.70931 3.95801 6.9209L5.98926 9.43555L9.97852 3.13184C10.0794 2.97884 10.1836 2.87142 10.291 2.80957C10.4017 2.74447 10.5368 2.71191 10.6963 2.71191C10.9307 2.71191 11.1243 2.78678 11.2773 2.93652C11.4303 3.08626 11.5068 3.27507 11.5068 3.50293C11.5068 3.58757 11.4922 3.67546 11.4629 3.7666C11.4336 3.85775 11.388 3.95215 11.3262 4.0498L6.78027 11.0078C6.60124 11.2715 6.34408 11.4033 6.00879 11.4033Z" />
                  </svg>
                )}
              </div>
              <input
                aria-labelledby=":rkh:"
                type="checkbox"
                defaultChecked={checked}
                className="re:absolute re:opacity-0 re:w-4 re:h-4 re:top-0 re:start-0 re:cursor-pointer"
              />
            </div>
          </div>
        )}
        <div className="re:flex-[1_1_0px] re:min-w-[1px] re:flex re:flex-col">
          <div
            {...props}
            className={cn(
              're:w-full re:whitespace-break-spaces re:break-words re:py-[3px] re:px-0.5 re:text-start re:focus-visible:outline-none',
              className,
            )}
          />
        </div>
      </div>
    </div>
  );
};

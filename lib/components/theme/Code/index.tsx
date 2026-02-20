import { memo } from 'react';

export const CodeWrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
}> = memo(({ blockIdx: i, children }) => {
  return (
    <div data-block-idx={i} key={i} className="renotion-code-wrapper re:w-full">
      {children}
    </div>
  );
});

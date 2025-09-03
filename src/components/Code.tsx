export const CodeWrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div data-block-idx={i} key={i} className="w-full">
      {children}
    </div>
  );
};

export const CodeWrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div data-block-idx={i} key={i} className="re:w-full">
      {children}
    </div>
  );
};

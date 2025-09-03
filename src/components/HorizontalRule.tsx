export const HorizontalRuleWrapper: React.FC<{
  blockIdx: string;
  children: React.ReactNode;
}> = ({ blockIdx: i, children }) => {
  return (
    <div
      data-block-idx={i}
      key={i}
      className="w-full my-[1px] text-[rgba(255,255,255,0.13)] h-[13px] flex items-center"
    >
      {children}
    </div>
  );
};

export const HorizontalRule: React.FC = () => {
  return (
    <div
      role="separator"
      className="w-full h-[1px] visible border-b-[1px] border-[rgba(255,255,255,0.13)]"
    />
  );
};

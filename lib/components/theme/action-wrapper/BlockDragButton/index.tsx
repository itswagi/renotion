type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: ((node: HTMLElement | null) => void) | undefined;
  dragIcon: React.FC<{ className?: string }>;
};

export const BlockDragButton: React.FC<Props> = ({
  className,
  dragIcon: DragIcon,
  ...props
}) => {
  return (
    <button
      {...props}
      className="re:px-1 re:py-1.5 re:rounded re:bg-transparent re:border-none re:hover:bg-[rgba(255,255,255,0.055)] re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:cursor-grab"
    >
      <DragIcon className="re:w-[14px] re:h-[14px]" />
    </button>
  );
};

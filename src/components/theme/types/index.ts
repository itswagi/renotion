export type WrapperProps = {
  'data-block-idx': string;
  children: React.ReactNode;
  style: React.CSSProperties;
  ref: (node: HTMLElement | null) => void;
  className?: string;
};

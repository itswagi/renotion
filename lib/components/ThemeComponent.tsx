import { useTextChanges } from '../hooks/useTextChanges';

type PropsBase = {
  Component: React.ElementType;
  onChange: (updated: any) => void;
  blockIdx: string;
  rich_text?: any[]; // not needed for horizontal rule
  className?: string;
  level?: number;
  type?: string;
  checked?: boolean;
  numbering?: number;
  code?: string;
};

export type ThemeComponentProps =
  | (PropsBase & {
      dragRef?: undefined;
      props?: undefined;
    })
  | (PropsBase & {
      dragRef: any;
      props: any;
    });

export const ThemeComponent: React.FC<ThemeComponentProps> = ({
  Component,
  blockIdx,
  onChange,
  rich_text,
  dragRef,
  ...props
}) => {
  const { ref, handleBeforeInput, handleInput } = useTextChanges({
    onChange,
    blockIdx,
    rich_text,
  });
  return (
    <Component
      {...props}
      ref={dragRef || ref}
      contentEditable={dragRef ? 'false' : 'true'}
      suppressContentEditableWarning
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
      data-block-idx={blockIdx}
    />
  );
};

import type { ThemeComponentProps } from '../../ThemeComponent';
import type { WrapperProps } from '../types';
import {
  BlockquoteItem,
  Heading1,
  Heading1Wrapper,
  Heading2,
  Heading2Wrapper,
  Heading3,
  Heading3Wrapper,
  HorizontalRule,
  HorizontalRuleWrapper,
  ListItem,
  Paragraph,
} from '../index';
import { CodeBlock } from '../../code-block';
import { cloneElement, type JSX } from 'react';
import { GripVertical, Settings } from 'lucide-react/icons';
import { cn } from '../../../lib';

const theme = {
  heading1Wrapper: (props: WrapperProps) => <Heading1Wrapper {...props} />,
  heading1: (props: ThemeComponentProps) => <Heading1 {...props} />,
  heading2Wrapper: (props: WrapperProps) => <Heading2Wrapper {...props} />,
  heading2: (props: ThemeComponentProps) => <Heading2 {...props} />,
  heading3Wrapper: (props: WrapperProps) => <Heading3Wrapper {...props} />,
  heading3: (props: ThemeComponentProps) => <Heading3 {...props} />,
  heading4Wrapper: (props: WrapperProps) => <Heading3Wrapper {...props} />,
  heading4: (props: ThemeComponentProps) => <Heading3 {...props} />,
  heading5Wrapper: (props: WrapperProps) => <Heading3Wrapper {...props} />,
  heading5: (props: ThemeComponentProps) => <Heading3 {...props} />,
  heading6Wrapper: (props: WrapperProps) => <Heading3Wrapper {...props} />,
  heading6: (props: ThemeComponentProps) => <Heading3 {...props} />,
  horizontalRuleWrapper: (props: WrapperProps) => (
    <HorizontalRuleWrapper {...props} />
  ),
  horizontalRule: (props: any) => <HorizontalRule {...props} />,
  blockquote: (props: ThemeComponentProps & { level: number }) => (
    <BlockquoteItem {...props} />
  ),
  listItem: (
    props: ThemeComponentProps & {
      level: number;
      type: 'task' | 'unordered' | 'ordered';
      checked?: boolean;
      numbering?: number;
    },
  ) => <ListItem {...props} />,
  codeBlock: (props: any) => <CodeBlock {...props} />,
  paragraph: (props: ThemeComponentProps) => <Paragraph {...props} />,
  // --- new keys ---
  editorWrapper: (props: {
    className?: string;
    children: React.ReactElement;
  }) => (
    <div
      {...props}
      className={cn(
        're:bg-[rgb(25,25,25)] re:text-[rgba(255,255,255,0.81)]',
        props?.className,
      )}
    >
      {props.children}
    </div>
  ),
  actionDragIcon: (props: { className?: string }) => (
    <GripVertical
      {...props}
      className={cn('re:text-[rgba(255,255,255,0.46)]', props?.className)}
    />
  ),
  actionDropdownIcon: (props: { className?: string }) => (
    <Settings
      {...props}
      className={cn('re:text-[rgba(255,255,255,0.46)]', props?.className)}
    />
  ),
};
export const defaultTheme = theme;
// --- Types ---
export type Theme = typeof theme;
type ThemeKey = keyof Theme;
type ThemeComponent = (props: any) => JSX.Element;

type EitherComponentOrClassName<T extends ThemeComponent> =
  | { Component: T; className?: never }
  | { Component?: never; className: string };

// 🔹 Special cases
type EditorWrapperOverride = { className: string };

// 🔹 Overrides type with special rules
type StrictThemeOverrides = {
  [K in Exclude<ThemeKey, 'editorWrapper'>]?: EitherComponentOrClassName<
    Theme[K]
  >;
} & {
  editorWrapper?: EditorWrapperOverride;
};

// --- Implementation ---
export function createTheme(overrides: StrictThemeOverrides = {}): Theme {
  const finalTheme = {} as Theme;

  (Object.keys(theme) as ThemeKey[]).forEach((key) => {
    const baseComponent = theme[key];
    const override = overrides[key];

    // Special case: editorWrapper (className only)
    if (key === 'editorWrapper' && override && 'className' in override) {
      finalTheme[key] = ((props: any) => {
        const element = baseComponent(props);
        return cloneElement(element, {
          ...element.props,
          className: [element.props.className, override.className]
            .filter(Boolean)
            .join(' '),
        });
      }) as ThemeComponent;
      return;
    }

    // Generic EitherComponentOrClassName case
    if (override && 'Component' in override && override.Component) {
      finalTheme[key] = override.Component as ThemeComponent;
    } else if (override && 'className' in override && override.className) {
      finalTheme[key] = ((props: any) => {
        const element = baseComponent(props);
        return cloneElement(element, {
          ...element.props,
          className: [element.props.className, override.className]
            .filter(Boolean)
            .join(' '),
        });
      }) as ThemeComponent;
    } else {
      finalTheme[key] = baseComponent as any;
    }
  });

  return finalTheme;
}

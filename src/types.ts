import type { Theme } from './components/theme/utils';

export type RenotionProps = {
  markdown: string;
  onChange?: (markdown: string) => void;
  theme?: Theme;
};

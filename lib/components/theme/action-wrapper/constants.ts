import type { BlockType } from '../../../lib';
import {
  CodeXml,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListChecks,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  Type,
} from 'lucide-react/icons';

export const changeTypeItems: {
  type: BlockType;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { type: 'paragraph', label: 'Text', icon: Type },
  { type: 'heading1', label: 'Heading 1', icon: Heading1 },
  { type: 'heading2', label: 'Heading 2', icon: Heading2 },
  { type: 'heading3', label: 'Heading 3', icon: Heading3 },
  { type: 'heading4', label: 'Heading 4', icon: Heading4 },
  { type: 'heading5', label: 'Heading 5', icon: Heading5 },
  { type: 'heading6', label: 'Heading 6', icon: Heading6 },
  { type: 'listItemBulleted', label: 'Bullet List', icon: List },
  { type: 'listItemNumbered', label: 'Numbered List', icon: ListOrdered },
  { type: 'listItemTask', label: 'Todo List', icon: ListChecks },
  { type: 'blockquote', label: 'Quote', icon: MessageSquareQuote },
  { type: 'code', label: 'Code', icon: CodeXml },
  { type: 'horizontal_rule', label: 'Divider', icon: Minus },
];

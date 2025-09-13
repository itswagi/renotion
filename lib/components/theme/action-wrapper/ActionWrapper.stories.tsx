// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import { defaultTheme } from '../../theme';
import type { BlockType, ParsedMarkdown } from '../../../lib';
import { ActionWrapper } from '.';

// Mock getHoverManager to always activate on mouse enter
const mockHoverManager = {
  registerBlock: ({ element, setActive }: any) => {
    if (element) {
      element.addEventListener('mouseenter', () => setActive(true));
      element.addEventListener('mouseleave', () => setActive(false));
    }
  },
  unregisterBlock: () => {},
};

// Patch global getHoverManager for the story
if (typeof window !== 'undefined') {
  (window as any).getHoverManager = () => mockHoverManager;
}

const meta = {
  component: ActionWrapper,
  argTypes: {
    blockType: {
      control: { type: 'select' },
      options: [
        'blockquote',
        'code',
        'heading',
        'horizontal_rule',
        'listItem',
        'paragraph',
      ] as ParsedMarkdown['type'][],
    },
  },
  decorators: (Story) => (
    <div className="renotion re:relative re:p-20">
      <Story />
      <div className="action--portal re:absolute re:top-0 re:left-0"></div>
    </div>
  ),
} satisfies Meta<typeof ActionWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: 'action-wrapper-1',
    isDragging: false,
    activatorRef: () => null,
    actionDragIcon: defaultTheme.actionDragIcon,
    actionDropdownIcon: defaultTheme.actionDropdownIcon,
    children: <div>This is a block</div>,
    blockType: 'paragraph',
    onChangeType: (type: BlockType) =>
      console.log(`Change block type to: ${type}`),
  },
};

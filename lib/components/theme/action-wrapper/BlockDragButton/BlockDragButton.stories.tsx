// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import { BlockDragButton } from '.';
import { defaultTheme } from '@/components/theme/utils';

const meta = {
  component: BlockDragButton,
} satisfies Meta<typeof BlockDragButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    dragIcon: defaultTheme.actionDragIcon,
  },
};

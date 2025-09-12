// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import { BlockSettingsDropdown } from '.';
import { defaultTheme } from '@/components/theme/utils';
import type { BlockType } from '@/lib';

const meta = {
  component: BlockSettingsDropdown,
} satisfies Meta<typeof BlockSettingsDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    actionDropdownIcon: defaultTheme.actionDropdownIcon,
    blockType: 'Heading 1',
    onChangeType: (type: BlockType) =>
      console.log(`Change block type to: ${type}`),
  },
};

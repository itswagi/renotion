// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import { BlockquoteItem, BlockquoteWrapper } from '.';

const meta = {
  component: BlockquoteItem,
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
    },
  },
  decorators: (Story) => (
    <BlockquoteWrapper blockIdx={0}>
      <Story />
    </BlockquoteWrapper>
  ),
} satisfies Meta<typeof BlockquoteItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    level: 0,
  },
  render: (args) => {
    // const ref = useRef(null);
    return <BlockquoteItem {...args} />;
  },
};

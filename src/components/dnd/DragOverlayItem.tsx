import { forwardRef } from 'react';
import { markdownToBlock } from '../../lib';

export const DragOverlayItem = forwardRef(
  ({ id, block, components, ...props }: any, ref: any) => {
    return markdownToBlock({
      parsed: [block],
      ref,
      props,
      isDragOverlay: true,
      components,
    });
  },
);

import { forwardRef } from 'react';
import { markdownToBlock } from '../../Editor.jsx';

export const DragOverlayItem = forwardRef(
  ({ id, block, ...props }: any, ref: any) => {
    return markdownToBlock({
      parsed: [block],
      ref,
      props,
      isDragOverlay: true,
    });
  },
);

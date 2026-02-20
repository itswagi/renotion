import { forwardRef } from 'react';
import { markdownToBlock } from '../../lib';
import type { ParsedMarkdown } from '../../lib/types';
import type { Theme } from '../theme/utils';

interface DragOverlayItemProps {
  id: string;
  block: ParsedMarkdown | null;
  components: Theme;
}

export const DragOverlayItem = forwardRef<
  HTMLDivElement,
  DragOverlayItemProps
>(({ block, components, ...props }, ref) => {
  if (!block) return null;
  return markdownToBlock({
    parsed: [block],
    ref,
    props,
    isDragOverlay: true,
    components,
  });
});

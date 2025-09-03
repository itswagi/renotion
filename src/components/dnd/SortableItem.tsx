import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionWrapper } from '../ActionWrapper.jsx';
import type { ConvertBlockToType, ParsedMarkdown } from '../../lib/index.js';

export function SortableItem({
  id,
  children,
  Element = 'div',
  leftOffset = 0,
  blockType,
  level,
  onChangeType,
}: {
  children: React.ReactNode;
  id: string;
  Element?: React.ElementType;
  leftOffset?: number;
  blockType?: ParsedMarkdown['type'];
  level?: number;
  onChangeType?: (type: ConvertBlockToType) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
    active,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: active?.id === id ? 0.5 : 1,
  };

  return (
    <Element ref={setNodeRef} style={style}>
      <ActionWrapper
        id={id}
        isDragging={!!active}
        activatorRef={setActivatorNodeRef}
        listeners={listeners}
        attributes={attributes}
        leftOffset={leftOffset}
        blockType={blockType}
        level={level}
        onChangeType={onChangeType}
      >
        {children}
      </ActionWrapper>
    </Element>
  );
}

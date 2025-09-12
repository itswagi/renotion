import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionWrapper } from '../theme/action-wrapper';
import type { BlockType, ParsedMarkdown } from '../../lib';

export function SortableItem({
  id,
  children,
  Element = 'div',
  leftOffset = 0,
  blockType,
  level,
  onChangeType,
  dragIcon,
  dropdownIcon,
}: {
  children: React.ReactNode;
  id: string;
  Element?: React.ElementType;
  leftOffset?: number;
  blockType?: ParsedMarkdown['type'];
  level?: number;
  onChangeType?: (type: BlockType) => void;
  dragIcon: React.FC<{ className?: string }>;
  dropdownIcon: React.FC<{ className?: string }>;
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
    // opacity: active?.id === id ? 0.5 : 1,
  };

  return (
    <Element ref={setNodeRef} style={style} data-block-idx={id}>
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
        actionDragIcon={dragIcon}
        actionDropdownIcon={dropdownIcon}
      >
        {children}
      </ActionWrapper>
    </Element>
  );
}

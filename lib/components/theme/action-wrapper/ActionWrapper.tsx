import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners';
import { createPortal } from 'react-dom';
import type { BlockType, ParsedMarkdown } from '../../../lib';
import { BlockDragButton } from './BlockDragButton';
import { BlockSettingsDropdown } from './BlockSettingsDropdown';
import { useActionWrapper } from './useActionWrapper';

export const ActionWrapper: React.FC<{
  id: string;
  leftOffset?: number;
  children: React.ReactNode;
  isDragging?: boolean;
  activatorRef?: (node: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap | undefined;
  attributes?: DraggableAttributes;
  blockType?: ParsedMarkdown['type'];
  level?: number;
  onChangeType?: (type: BlockType) => void;
  actionDropdownIcon: React.FC<{ className?: string }>;
  actionDragIcon: React.FC<{ className?: string }>;
}> = ({
  id,
  leftOffset: lf = 0,
  children,
  isDragging = false,
  activatorRef: setActivatorNodeRef,
  listeners,
  attributes,
  blockType,
  level,
  onChangeType,
  actionDragIcon: DragIcon,
  actionDropdownIcon: DropdownIcon,
}) => {
  const { blockRef, coords, showActions } = useActionWrapper({
    id,
    leftOffset: lf,
  });

  return (
    <div ref={blockRef} className="renotion-actions re:w-full">
      {children}

      {showActions &&
        !isDragging &&
        coords &&
        createPortal(
          <div
            className="re:absolute re:flex re:items-center re:justify-center re:transition-opacity re:duration-200 re:ease-out"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="renotion-actions-dropdown-wrapper re:h-6 re:flex re:items-center re:justify-center re:shrink-0 re:grow-0">
              <BlockSettingsDropdown
                actionDropdownIcon={DropdownIcon}
                blockType={blockType}
                level={level}
                onChangeType={onChangeType}
              />
            </div>
            <div className="renotion-actions-dnd re:h-6 re:flex re:items-center re:justify-center re:shrink-0 re:grow-0">
              <BlockDragButton
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
                dragIcon={DragIcon}
              />
            </div>
          </div>,
          document.querySelector('.action--portal')!,
        )}
    </div>
  );
};

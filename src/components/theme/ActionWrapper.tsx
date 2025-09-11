import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  CodeXml,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListChecks,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  Type,
} from 'lucide-react/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ConvertBlockToType, ParsedMarkdown } from '../../lib';
import { getHoverManager } from '../../lib';

const changeTypeItems: {
  type: ConvertBlockToType;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { type: 'paragraph', label: 'Text', icon: Type },
  { type: 'heading1', label: 'Heading 1', icon: Heading1 },
  { type: 'heading2', label: 'Heading 2', icon: Heading2 },
  { type: 'heading3', label: 'Heading 3', icon: Heading3 },
  { type: 'heading4', label: 'Heading 4', icon: Heading4 },
  { type: 'heading5', label: 'Heading 5', icon: Heading5 },
  { type: 'heading6', label: 'Heading 6', icon: Heading6 },
  { type: 'listItemBulleted', label: 'Bullet List', icon: List },
  { type: 'listItemNumbered', label: 'Numbered List', icon: ListOrdered },
  { type: 'listItemTask', label: 'Todo List', icon: ListChecks },
  { type: 'blockquote', label: 'Quote', icon: MessageSquareQuote },
  { type: 'code', label: 'Code', icon: CodeXml },
  { type: 'horizontal_rule', label: 'Divider', icon: Minus },
];

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
  onChangeType?: (type: ConvertBlockToType) => void;
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
  const blockRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const lastRect = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Helper to recalculate and set coordinates
  const recalcCoords = useCallback(() => {
    if (!blockRef.current) return;
    const parent = document.querySelector('.editor--wrapper') as HTMLElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const { top: parentTop, left: parentLeft } = parentRect;
    const rect = blockRef.current.getBoundingClientRect();
    const leftOffset = 50;
    const topOffset = (rect.height - 24) / 2;
    setCoords({
      top: rect.top - parentTop + topOffset,
      left: rect.left - parentLeft - leftOffset + lf,
    });
    lastRect.current = rect;
  }, [lf]);

  useEffect(() => {
    const hoverManager = getHoverManager();
    if (!hoverManager || !blockRef.current) return;
    const hoverId = `${id}`;

    hoverManager.registerBlock({
      id: hoverId,
      element: blockRef.current,
      setActive: (active) => {
        setShowActions(active);
        if (active) {
          recalcCoords();
        }
      },
    });

    // Listen for DOM changes to force recalc after drag/drop
    let animationFrame: number;
    let prevRect = blockRef.current.getBoundingClientRect();
    const checkRect = () => {
      if (!blockRef.current) return;
      const rect = blockRef.current.getBoundingClientRect();
      if (
        rect.top !== prevRect.top ||
        rect.left !== prevRect.left ||
        rect.width !== prevRect.width ||
        rect.height !== prevRect.height
      ) {
        prevRect = rect;
        if (showActions) recalcCoords();
      }
      animationFrame = requestAnimationFrame(checkRect);
    };
    animationFrame = requestAnimationFrame(checkRect);

    return () => {
      hoverManager.unregisterBlock(hoverId);
      cancelAnimationFrame(animationFrame);
    };
  }, [id, lf, recalcCoords, showActions]);

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="re:px-1 re:py-1.5 re:rounded re:bg-transparent re:border-none re:hover:bg-[rgba(255,255,255,0.055)] re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:cursor-grab">
                    <DropdownIcon className="re:w-[14px] re:h-[14px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" align="center">
                  <DropdownMenuLabel>
                    {level ? `${blockType} ${level}` : blockType}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Change Type
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="re:min-w-[220px] re:p-1">
                          {changeTypeItems.map(
                            ({ type, label, icon: Type }) => (
                              <DropdownMenuItem
                                key={type}
                                onClick={() => onChangeType?.(type as any)}
                              >
                                <div className="re:flex re:gap-2 re:item-center re:px-1 re:text-sm">
                                  <div className="re:shrink-0 re:grow-0 re:flex re:justify-center re:items-center re:w-5 re:h-5">
                                    <Type />
                                  </div>
                                  <div>{label}</div>
                                </div>
                              </DropdownMenuItem>
                            ),
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="renotion-actions-dnd re:h-6 re:flex re:items-center re:justify-center re:shrink-0 re:grow-0">
              <button
                {...listeners}
                {...attributes}
                ref={setActivatorNodeRef}
                className="re:px-1 re:py-1.5 re:rounded re:bg-transparent re:border-none re:hover:bg-[rgba(255,255,255,0.055)] re:flex re:justify-center re:items-center re:grow-0 re:shrink-0 re:cursor-grab"
              >
                <DragIcon className="re:w-[14px] re:h-[14px]" />
              </button>
            </div>
          </div>,
          document.querySelector('.action--portal')!,
        )}
    </div>
  );
};

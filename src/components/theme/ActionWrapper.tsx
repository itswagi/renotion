'use client';

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
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ConvertBlockToType, ParsedMarkdown } from '../../lib';
import { getHoverManager } from '../../lib';

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
          if (!blockRef.current) return;
          const parent = document.querySelector(
            '.editor--wrapper',
          ) as HTMLElement;
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
        }
      },
    });

    return () => {
      hoverManager.unregisterBlock(hoverId);
    };
  }, [id, lf]);

  return (
    <div ref={blockRef} className="w-full">
      {children}

      {showActions &&
        !isDragging &&
        coords &&
        createPortal(
          <div
            className="absolute flex items-center justify-center transition-opacity duration-200 ease-out"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="h-6 flex items-center justify center shrink-0 grow-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-1 py-1.5 rounded hover:bg-[rgba(255,255,255,0.055)] flex justify-center items-center grow-0 shrink-0 cursor-grab">
                    <DropdownIcon className="w-[14px] h-[14px]" />
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
                        <DropdownMenuSubContent className="min-w-[220px] p-1">
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('paragraph')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Type />
                              </div>
                              <div>Text</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading1')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading1 />
                              </div>
                              <div>Heading 1</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading2')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading2 />
                              </div>
                              <div>Heading 2</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading3')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading3 />
                              </div>
                              <div>Heading 3</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading4')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading4 />
                              </div>
                              <div>Heading 4</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading5')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading5 />
                              </div>
                              <div>Heading 5</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('heading6')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Heading6 />
                              </div>
                              <div>Heading 6</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('listItemBulleted')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <List />
                              </div>
                              <div>Bullet List</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('listItemNumbered')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <ListOrdered />
                              </div>
                              <div>Numbered List</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('listItemTask')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <ListChecks />
                              </div>
                              <div>Todo List</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('blockquote')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <MessageSquareQuote />
                              </div>
                              <div>Quote</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('code')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <CodeXml />
                              </div>
                              <div>Code</div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onChangeType?.('horizontal_rule')}
                          >
                            <div className="flex gap-2 item-center px-1 text-sm ">
                              <div className="shrink-0 grow-0 flex justify-center items-center w-5 h-5">
                                <Minus />
                              </div>
                              <div>Divider</div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <button
                {...listeners}
                {...attributes}
                ref={setActivatorNodeRef}
                className="px-1 py-1.5 rounded hover:bg-[rgba(255,255,255,0.055)] flex justify-center items-center grow-0 shrink-0 cursor-grab"
              >
                <DragIcon className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>,
          document.querySelector('.action--portal')!,
        )}
    </div>
  );
};

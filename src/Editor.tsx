'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useMemo, useState } from 'react';
import {
  BlockquoteItem,
  Heading1,
  Heading1Wrapper,
  Heading2,
  Heading2Wrapper,
  Heading3,
  Heading3Wrapper,
  HorizontalRule,
  HorizontalRuleWrapper,
  ListItem,
  Paragraph,
  SortableItem,
  DragOverlayItem,
  ActionWrapper,
  CodeBlock,
} from './components/index.js';
import {
  convertBlocksToMarkdown,
  parseMarkdown,
  kitchenSinkMarkdown,
} from './lib/index.js';
import type {
  ConvertBlockToType,
  ParsedMarkdown,
  ParsedParagraph,
  RichText,
} from './lib/index.js';

export const Renotion: React.FC<{
  markdown: string;
  onChange?: (markdown: string) => void;
}> = ({ markdown, onChange }) => {
  // keep parsed markdown in state and recompute only when input changes
  const [parsed, setParsed] = useState<ParsedMarkdown[]>(() =>
    parseMarkdown(markdown),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // optimized updateNode: no deep clone, just copy necessary level
  const updateNode = useCallback((updated: RichText[], blockIdx: string) => {
    setParsed((prev) => {
      const newParsed = prev.map((block) =>
        block.id === blockIdx ? { ...block, rich_text: updated } : block,
      );
      if (onChange) {
        // convert to markdown
        onChange(convertBlocksToMarkdown(newParsed));
      }
      return newParsed;
    });
  }, []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const convertBlockType = useCallback(
    (id: string, type: ConvertBlockToType) => {
      setParsed((prev) => {
        const findBlock = prev.find((block) => block.id === id);
        if (!findBlock) return prev;
        // if the block is already of the desired type, return prev
        if (findBlock.type === type) return prev;
        // convert the block to the desired type
        const convertedBlock = blockToType(findBlock, type);
        const newParsed = prev.map((block) =>
          block.id === id ? convertedBlock : block,
        );
        return newParsed as any;
      });
    },
    [onChange],
  );
  // memoize conversion to HTML blocks
  const htmlBlocks = useMemo(
    () => markdownToBlock({ parsed, updateNode, convertBlockType }),
    [parsed, updateNode],
  );

  function handleDragEnd(event: DragEndEvent) {
    const {
      active: { id },
      over,
    } = event;
    if (over && id !== over.id) {
      setParsed((prev) => {
        const oldIndex = parsed.findIndex((item) => item.id === id);
        const newIndex = prev.findIndex((item) => item.id === over.id);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const {
      active: { id },
    } = event;
    setActiveId(id as string);
  }

  const getBlockById = useMemo(() => {
    if (activeId === null) return null;
    const block = parsed.find((item) => item.id === activeId);
    if (block) {
      return block;
    }
    return null;
  }, [activeId, parsed]);

  const flattenedIds = useMemo(() => {
    return parsed.map((block: any) => block.id);
  }, [parsed]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="editor--wrapper relative">
        <SortableContext
          items={flattenedIds}
          strategy={verticalListSortingStrategy}
        >
          {htmlBlocks}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragOverlayItem id={activeId} block={getBlockById} />
          ) : null}
        </DragOverlay>
        <div className="action--portal absolute top-0 left-0" />
      </div>
    </DndContext>
  );
};

export function markdownToBlock({
  parsed,
  props,
  ref,
  updateNode,
  isDragOverlay = false,
  convertBlockType,
}: {
  parsed: ParsedMarkdown[];
  updateNode?: (
    updated: RichText[],
    blockIdx: string,
    childIdx?: string,
  ) => void;
  ref?: any;
  props?: any;
  isDragOverlay?: boolean;
  convertBlockType?: (id: string, type: ConvertBlockToType) => void;
}) {
  const notionBlocks = [];

  for (let block of parsed) {
    switch (block.type) {
      case 'heading':
        switch (block.level) {
          case 1:
            if (isDragOverlay) {
              return (
                <Heading1
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading1Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading1
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
          case 2:
            if (isDragOverlay) {
              return (
                <Heading2
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading2Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading2
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
          case 3:
            if (isDragOverlay) {
              return (
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading3Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
          case 4:
            if (isDragOverlay) {
              return (
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading3Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
          case 5:
            if (isDragOverlay) {
              return (
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading3Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
          case 6:
            if (isDragOverlay) {
              return (
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  ref={ref}
                  className="bg-[rgb(25,25,25)] p-2"
                  {...props}
                />
              );
            }
            notionBlocks.push(
              <SortableItem
                key={block.id}
                id={block.id}
                Element={Heading3Wrapper}
                blockType={block.type}
                level={block.level}
                onChangeType={(type) => convertBlockType?.(block.id, type)}
              >
                <Heading3
                  blockIdx={block.id}
                  rich_text={block.rich_text}
                  onChange={(updated: RichText[]) =>
                    updateNode?.(updated, block.id)
                  }
                />
              </SortableItem>,
            );
            break;
        }
        break;
      case 'horizontal_rule':
        // convert to notion horizontal rule block
        notionBlocks.push(
          <HorizontalRuleWrapper key={block.id} blockIdx={block.id}>
            <ActionWrapper id={block.id}>
              <HorizontalRule />
            </ActionWrapper>
          </HorizontalRuleWrapper>,
        );
        break;

      case 'blockquote':
        if (isDragOverlay) {
          return (
            <BlockquoteItem
              level={block.level}
              id={block.id}
              rich_text={block.rich_text}
              className="bg-[rgb(25,25,25)] p-2"
              {...props}
            />
          );
        }
        // convert to notion blockquote block
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            leftOffset={
              block.level > 1
                ? (block.level - 2) * 14 + 3 * (block.level - 2)
                : 0
            }
            blockType={block.type}
            level={block.level}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
          >
            <BlockquoteItem
              level={block.level}
              id={block.id}
              rich_text={block.rich_text}
              onChange={(updated: RichText[]) =>
                updateNode?.(updated, block.id)
              }
            />
          </SortableItem>,
        );
        break;
      case 'listItem':
        if (isDragOverlay) {
          return (
            <ListItem
              id={block.id}
              level={block.level}
              type={block.format}
              checked={block.format === 'task' ? block.checked : undefined}
              numbering={
                block.format === 'ordered' ? block.numbering : undefined
              }
              rich_text={block.rich_text}
              className="bg-[rgb(25,25,25)] p-2"
              {...props}
            />
          );
        }
        // convert to notion list item blocks
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            leftOffset={block.level > 0 ? block.level * 24 : 0}
            blockType={block.type}
            level={block.level}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
          >
            <ListItem
              id={block.id}
              level={block.level}
              type={block.format}
              checked={block.format === 'task' ? block.checked : undefined}
              numbering={
                block.format === 'ordered' ? block.numbering : undefined
              }
              rich_text={block.rich_text}
              onChange={(updated: RichText[]) =>
                updateNode?.(updated, block.id, block.id)
              }
            />
          </SortableItem>,
        );
        break;
      case 'code':
        if (isDragOverlay) {
          return (
            <CodeBlock
              code={block.rich_text[0]?.text || ''}
              className="bg-[rgb(25,25,25)] p-2"
              {...props}
            />
          );
        }
        // convert to notion code block
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            blockType={block.type}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
          >
            <CodeBlock code={block.rich_text[0]?.text || ''} />
          </SortableItem>,
        );
        break;
      case 'paragraph':
        if (isDragOverlay) {
          return (
            <Paragraph
              blockIdx={block.id}
              rich_text={block.rich_text}
              ref={ref}
              className="bg-[rgb(25,25,25)] p-2"
              {...props}
            />
          );
        }
        // convert to notion paragraph block
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            blockType={block.type}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
          >
            <Paragraph
              blockIdx={block.id}
              rich_text={block.rich_text}
              onChange={(updated: RichText[]) =>
                updateNode?.(updated, block.id)
              }
            />
          </SortableItem>,
        );
        break;
    }
  }
  return notionBlocks;
}

function blockToType(block: ParsedMarkdown, type: ConvertBlockToType) {
  console.log('🚀 ~ blockToType ~ type:', type);
  console.log('🚀 ~ blockToType ~ block:', block);
  if (!block) return null;
  switch (type) {
    case 'paragraph':
      return {
        id: block.id,
        type: 'paragraph',
        rich_text: (block as any)?.rich_text,
      } as ParsedParagraph;
    case 'heading1':
      return {
        id: block.id,
        type: 'heading',
        level: 1,
        rich_text: (block as any).rich_text,
      };
    case 'heading2':
      return {
        id: block.id,
        type: 'heading',
        level: 2,
        rich_text: (block as any).rich_text,
      };
    case 'heading3':
      return {
        id: block.id,
        type: 'heading',
        level: 3,
        rich_text: (block as any).rich_text,
      };
    case 'heading4':
      return {
        id: block.id,
        type: 'heading',
        level: 4,
        rich_text: (block as any).rich_text,
      };
    case 'heading5':
      return {
        id: block.id,
        type: 'heading',
        level: 5,
        rich_text: (block as any).rich_text,
      };
    case 'heading6':
      return {
        id: block.id,
        type: 'heading',
        level: 6,
        rich_text: (block as any).rich_text,
      };
    case 'horizontal_rule':
      return {
        id: block.id,
        type: 'horizontal_rule',
      };
    case 'blockquote':
      return {
        id: block.id,
        type: 'blockquote',
        level: 1,
        rich_text: (block as any).rich_text,
      };
    case 'listItemBulleted':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'unordered',
        rich_text: (block as any).rich_text,
      };
    case 'listItemNumbered':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'ordered',
        numbering: 1,
        rich_text: (block as any).rich_text,
      };
    case 'listItemTask':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'ordered',
        checked: false,
        rich_text: (block as any).rich_text,
      };

    case 'code':
      return {
        id: block.id,
        type: 'code',
        rich_text: (block as any).rich_text,
      };

    default:
      break;
  }
  return null;
}

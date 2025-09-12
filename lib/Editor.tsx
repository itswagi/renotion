import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useMemo, useState } from 'react';
import { DragOverlayItem } from './components';
import { defaultTheme } from './components/theme/utils';
import type { BlockType, ParsedMarkdown, RichText } from './lib';
import {
  blockToType,
  convertBlocksToMarkdown,
  markdownToBlock,
  parseMarkdown,
} from './lib';
import type { RenotionProps } from './types';

export const Renotion: React.FC<RenotionProps> = ({
  markdown,
  onChange,
  theme,
}) => {
  const components = useMemo(() => {
    if (theme) {
      return theme;
    }
    return defaultTheme;
  }, [theme]);
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
  const updateNode = useCallback(
    (updated: RichText[], blockIdx: string) => {
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
    },
    [onChange],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const convertBlockType = useCallback((id: string, type: BlockType) => {
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
  }, []);
  // memoize conversion to HTML blocks
  const htmlBlocks = useMemo(
    () => markdownToBlock({ parsed, updateNode, convertBlockType, components }),
    [components, convertBlockType, parsed, updateNode],
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
      <components.editorWrapper className="renotion re:relative re:p-20">
        <>
          <SortableContext
            items={flattenedIds}
            strategy={verticalListSortingStrategy}
          >
            {htmlBlocks}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <DragOverlayItem
                id={activeId}
                block={getBlockById}
                components={components}
              />
            ) : null}
          </DragOverlay>
          <div className="action--portal re:absolute re:top-0 re:left-0" />
        </>
      </components.editorWrapper>
    </DndContext>
  );
};

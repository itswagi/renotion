import { getHoverManager } from '@/lib';
import { useCallback, useEffect, useRef, useState } from 'react';

type HookArgs = {
  id: string;
  leftOffset?: number;
};

export const useActionWrapper = ({ id, leftOffset: lf = 0 }: HookArgs) => {
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
    const parent = document.querySelector('.renotion') as HTMLElement;
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

  // TODO: Unnecessarily registers/unregisters on mouse in and out of block
  const checkRect = useCallback(
    (prevRect: DOMRect, animationFrame: number) => {
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
      animationFrame = requestAnimationFrame(() =>
        checkRect(prevRect, animationFrame),
      );
    },
    [showActions, recalcCoords],
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
          recalcCoords();
        }
      },
    });

    // Listen for DOM changes to force recalc after drag/drop
    let animationFrame: number;
    let prevRect = blockRef.current.getBoundingClientRect();

    animationFrame = requestAnimationFrame(() =>
      checkRect(prevRect, animationFrame),
    );

    return () => {
      hoverManager.unregisterBlock(hoverId);
      cancelAnimationFrame(animationFrame);
    };
  }, [id, recalcCoords, checkRect]);

  return {
    blockRef,
    showActions,
    coords,
  };
};

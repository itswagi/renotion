import { getHoverManager } from '../../../lib';
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

  const recalcCoords = useCallback(() => {
    if (!blockRef.current) return;
    const parent = document.querySelector('.renotion') as HTMLElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = blockRef.current.getBoundingClientRect();
    const leftOffset = 50;
    const topOffset = (rect.height - 24) / 2;
    setCoords({
      top: rect.top - parentRect.top + topOffset,
      left: rect.left - parentRect.left - leftOffset + lf,
    });
  }, [lf]);

  useEffect(() => {
    const hoverManager = getHoverManager();
    if (!hoverManager || !blockRef.current) return;
    const hoverId = `${id}`;
    const element = blockRef.current;

    hoverManager.registerBlock({
      id: hoverId,
      element,
      setActive: (active) => {
        setShowActions(active);
        if (active) {
          recalcCoords();
        }
      },
    });

    const observer = new ResizeObserver(() => {
      recalcCoords();
    });
    observer.observe(element);

    return () => {
      hoverManager.unregisterBlock(hoverId);
      observer.disconnect();
    };
  }, [id, recalcCoords]);

  return {
    blockRef,
    showActions,
    coords,
  };
};

import type { UniqueIdentifier } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';

export const useDropIndicator = (activeId: UniqueIdentifier | null) => {
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const dropIndicatorWrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // remove existing indicator if any
    if (dropIndicatorWrapper.current) {
      dropIndicatorWrapper.current.remove();
      dropIndicatorWrapper.current = null;
    }

    // don't show indicator if no active drag or dragging over itself
    if (!activeId || overId === activeId) return;

    if (overId === null) return;

    const overElement = document.querySelector<HTMLElement>(
      `[data-block-idx='${overId}']`,
    );
    if (!overElement) return;

    // Create absolute-positioned line
    const wrapper = document.createElement('div');
    wrapper.id = 'drag-over-indicator';
    wrapper.style.position = 'absolute';
    wrapper.style.height = '4px';
    wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    wrapper.style.borderRadius = '4px';
    wrapper.style.transition = 'all 0.15s ease';
    wrapper.style.pointerEvents = 'none'; // prevent blocking mouse events
    wrapper.style.zIndex = '9999';

    // Position the line
    const rect = overElement.getBoundingClientRect();
    wrapper.style.left = `${rect.left}px`;
    wrapper.style.top = `${rect.top - 2}px`; // small offset
    wrapper.style.width = `${rect.width}px`;

    document.body.appendChild(wrapper);
    dropIndicatorWrapper.current = wrapper;

    return () => {
      wrapper.remove();
      dropIndicatorWrapper.current = null;
    };
  }, [overId, activeId]);
  return { setOverId };
};

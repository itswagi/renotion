type BlockEntry = {
  id: string;
  element: HTMLElement;
  setActive: (active: boolean) => void;
};

class HoverManager {
  blocks: Map<string, BlockEntry> = new Map();
  lastMouse: { x: number; y: number } | null = null;
  rafPending = false;
  activeBlockId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('scroll', this.requestEvaluate, true);
      window.addEventListener('resize', this.requestEvaluate);
    }
  }

  registerBlock(entry: BlockEntry) {
    this.blocks.set(entry.id, entry);
  }

  unregisterBlock(id: string) {
    this.blocks.delete(id);
  }

  handleMouseMove = (e: MouseEvent) => {
    this.lastMouse = { x: e.clientX, y: e.clientY };
    this.requestEvaluate();
  };

  requestEvaluate = () => {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(this.evaluate);
  };

  isMouseOverActionButtons = (): boolean => {
    if (!this.lastMouse) return false;

    // Check if mouse is over any visible action buttons
    const actionMenus = document.querySelectorAll('[data-state="open"]');
    for (const menu of actionMenus) {
      const rect = menu.getBoundingClientRect();
      // Add small buffer around the menu for better UX
      const buffer = 5;
      if (
        this.lastMouse.x >= rect.left - buffer &&
        this.lastMouse.x <= rect.right + buffer &&
        this.lastMouse.y >= rect.top - buffer &&
        this.lastMouse.y <= rect.bottom + buffer
      ) {
        return true;
      }
    }
    return false;
  };

  evaluate = () => {
    this.rafPending = false;
    if (!this.lastMouse) return;

    const { x, y } = this.lastMouse;
    let newActive: string | null = null;

    // First check if mouse is over action buttons - if so, keep current active block
    if (this.isMouseOverActionButtons() && this.activeBlockId) {
      return; // Keep current state
    }

    for (const block of this.blocks.values()) {
      const rect = block.element.getBoundingClientRect();
      const marginX = rect.width * 0.2; // 20% margin on sides
      const inVertical = y >= rect.top && y <= rect.bottom;
      const inHorizontal =
        x >= rect.left - marginX && x <= rect.right + marginX;
      if (inVertical && inHorizontal) {
        newActive = block.id;
        break;
      }
      if (!inVertical && !inHorizontal) {
        if (this.activeBlockId === block.id) {
          // If we moved out of the currently active block, deactivate it
          block.setActive(false);
          this.activeBlockId = null;
        }
      }
    }

    if (newActive !== this.activeBlockId) {
      // Deactivate previous
      if (this.activeBlockId) {
        const prev = this.blocks.get(this.activeBlockId);
        if (prev) prev.setActive(false);
      }
      // Activate new
      if (newActive) {
        const next = this.blocks.get(newActive);
        if (next) next.setActive(true);
      }
      this.activeBlockId = newActive;
    }
  };
}

// Export a safe singleton
let hoverManager: HoverManager | null = null;
export function getHoverManager() {
  if (typeof window === 'undefined') return null;
  if (!hoverManager) hoverManager = new HoverManager();
  return hoverManager;
}

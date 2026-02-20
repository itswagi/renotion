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
  hoverManagerId: number | null = null;
  menuOpen = false;

  constructor(hoverManagerId: number) {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('scroll', this.requestEvaluate, true);
      window.addEventListener('resize', this.requestEvaluate);
    }
    this.hoverManagerId = hoverManagerId;
  }

  registerBlock(entry: BlockEntry) {
    if (this.blocks.has(entry.id)) {
      return;
    }
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

  setMenuOpen = (open: boolean) => {
    this.menuOpen = open;
  };

  evaluate = () => {
    this.rafPending = false;
    if (!this.lastMouse) return;

    const { x, y } = this.lastMouse;
    let newActive: string | null = null;

    // If a dropdown menu is open, keep current active block
    if (this.menuOpen && this.activeBlockId) {
      return;
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
  const hoverManagerId = Math.floor(100 + Math.random() * 900);
  if (!hoverManager) hoverManager = new HoverManager(hoverManagerId);
  return hoverManager;
}

export function destroyHoverManager() {
  if (hoverManager) {
    window.removeEventListener('mousemove', hoverManager.handleMouseMove);
    window.removeEventListener('scroll', hoverManager.requestEvaluate, true);
    window.removeEventListener('resize', hoverManager.requestEvaluate);
    hoverManager.blocks.clear();
    hoverManager = null;
  }
}

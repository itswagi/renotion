import { findTextNodeAtChar } from '../lib/index.js';

export const restoreCaretToCorrectPosition = (
  savedCaretPosition: number,
  savedText: string | null,
  currentText: string | null,
  ref: Node,
) => {
  let offset = savedCaretPosition;
  if (savedText !== null) {
    const prevText = savedText;
    if (currentText && prevText && currentText !== prevText) {
      // check of text changes before the caret position
      const delta = caretDelta(prevText, currentText, offset);
      offset += delta;
    }
  }
  const { node: textNode, offset: charOffset } = findTextNodeAtChar(
    ref,
    offset,
  );

  if (textNode) {
    const range = document.createRange();
    range.setStart(textNode, charOffset);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

function caretDelta(before: string, current: string, cp: number): number {
  if (cp >= before.length) return current.length - cp;

  let bi = 0; // index in before
  let ci = 0; // index in current
  let newCp = 0;

  const isMarker = (ch: string) => ch === '*' || ch === '_';

  while (bi < cp && bi < before.length) {
    const bch = before[bi];
    const cch = current[ci];

    // --- Handle marker groups (*, **, *** etc.) ---
    if (isMarker(bch!)) {
      let bStart = bi;
      while (bi < before.length && isMarker(before[bi]!)) bi++;
      let bLen = bi - bStart;

      // If caret was inside this marker group → snap to ci
      if (cp <= bi) {
        return ci - cp;
      }
      // Skip the markers (they vanish in current)
      continue;
    }

    // --- Normal character ---
    if (cch !== undefined && bch === cch) {
      bi++;
      ci++;
      newCp++;
    } else {
      // Fallback mismatch
      bi++;
      if (cch !== undefined) {
        ci++;
        newCp++;
      }
    }
  }

  // Caret ended at cp, return the delta
  return newCp - cp;
}

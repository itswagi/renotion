import { useLayoutEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  type RichText,
  getCaretOffsetRelativeToParent,
  parseHTMLToRichText,
  richTextToHTML,
} from '../lib';
import { restoreCaretToCorrectPosition } from './helpers';

export const useTextChanges = ({
  blockIdx,
  rich_text,
  onChange,
}: {
  onChange?: (updated: RichText[]) => void;
  blockIdx: string;
  rich_text?: RichText[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const savedCaretPosition = useRef<number | null>(null);
  const savedText = useRef<string | null>(null);

  // Save caret BEFORE input
  const handleBeforeInput = () => {
    if (ref.current) {
      const offset = getCaretOffsetRelativeToParent(ref.current);
      savedCaretPosition.current = offset ?? null;
    }
  };

  useLayoutEffect(() => {
    if (ref.current && rich_text) {
      const idx = blockIdx;
      const html = renderToStaticMarkup(
        <>{richTextToHTML(rich_text, `${idx}`)}</>,
      );
      if (ref.current.innerHTML !== html) {
        ref.current.innerHTML = html;
      }
    }
  }, [blockIdx, rich_text]);

  //   Restore caret immediately after DOM updates
  useLayoutEffect(() => {
    if (ref.current && savedCaretPosition.current !== null) {
      restoreCaretToCorrectPosition(
        savedCaretPosition.current,
        savedText.current,
        ref.current.textContent,
        ref.current,
      );
    }
  }, [rich_text]);

  const handleInput = () => {
    if (!ref.current) return;
    savedText.current = ref.current.textContent;
    // Parse content to rich text (implement your own parseHTMLToRichText)
    const parsed = parseHTMLToRichText(ref.current);
    onChange?.(parsed);

    // Immediately re-save caret so offsets match new DOM
    const offset = getCaretOffsetRelativeToParent(ref.current);
    savedCaretPosition.current = offset ?? null;
  };

  return { ref, handleBeforeInput, handleInput };
};

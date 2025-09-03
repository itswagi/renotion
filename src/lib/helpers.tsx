import type {
  BlockquoteChild,
  ListItemChild,
  ParsedMarkdown,
  RichText,
} from './types.js';
import { Fragment } from 'react/jsx-runtime';
import { cn } from './utils/index.js';

export function isListItem(line: string): boolean {
  return /^(\s*(?:[-*+]|\d+\.)\s*(?:\[ ?[xX]?\])?(?:\s+.*)?)$/.test(line);
}

export function isFencedCodeBlock(line: string): boolean {
  return line.startsWith('```') || line.startsWith('~~~');
}

export function isBlockquote(line: string): boolean {
  return line.startsWith('>');
}

export function isHorizontalRule(line: string): boolean {
  // should contain only dashes or asterisks with atleast 3 of them
  const trimmed = line.trim();
  if (trimmed.length < 3) return false;
  if (/^(-{3,}|\*{3,})$/.test(trimmed)) return true;
  return false;
}

export function isHeading(line: string): boolean {
  return /^#{1,6} \S/.test(line.trim());
}

export function getHeadingText(line: string): string {
  return line.replace(/^#{1,6}\s+/, '');
}

export function hasGreaterThanAndText(line: string): boolean {
  return /^(?=.*>)(?=.*[^\s>]).+$/.test(line);
}

export function getBlockquoteLevel(line: string): number {
  const matches = line.match(/^(>\s*)+/);
  if (!matches) return 0;
  // Count how many ">" markers are in the match
  return (matches[0].match(/>/g) ?? []).length;
}

export function getHeadingLevel(line: string): number {
  const match = line.match(/^#+/);
  return match ? match[0].length : 0;
}

export function stripBlockquoteMarkers(line: string): string {
  return line.replace(/^(>\s*)+/, '');
}

export function isOnlyBlockquoteMarker(line: string): boolean {
  return /^\s*(>\s*)+\s*$/.test(line);
}

export const patterns = [
  {
    regex: /\*\*\*(.+?)\*\*\*/g,
    annotations: {
      bold: true,
      italic: true,
      strikethrough: false,
      underline: false,
      code: false,
    },
  }, // bold italic
  {
    regex: /\*\*(.+?)\*\*/g,
    annotations: {
      bold: true,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
    },
  }, // bold
  {
    regex: /\*(.+?)\*/g,
    annotations: {
      bold: false,
      italic: true,
      strikethrough: false,
      underline: false,
      code: false,
    },
  }, // italic
  {
    regex: /~~(.+?)~~/g,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: true,
      underline: false,
      code: false,
    },
  }, // strikethrough
  {
    regex: /__(.+?)__/g,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: true,
      code: false,
    },
  }, // underline
  {
    regex: /`(.+?)`/g,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: true,
    },
  }, // inline code
  {
    regex: /!\[([^\]]*?)\]\((.*?)\)/g,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
    },
    image: {
      alt: '', // placeholder, will be set in getRichText function
      url: '',
    },
  }, // images
  {
    regex: /\[([^\]]+?)\]\((.*?)\)/g,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
    },
    link: {
      href: '', // placeholder, will be set in getRichText function
    },
  }, // links
];

export function parseHTMLToRichText(el: HTMLElement): RichText[] {
  const richText: RichText[] = [];

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const subRichText = getRichText(node.textContent || '');
      richText.push(...subRichText);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // get element classes
      const classes = Array.from((node as HTMLElement).classList);
      const annotations = {
        bold: classes.includes('font-bold'),
        italic: classes.includes('italic'),
        strikethrough: classes.includes('line-through'),
        underline: classes.includes('underline'),
        code: classes.includes('code'),
      };
      if (node.nodeName.toLowerCase() === 'a') {
        const href = (node as HTMLAnchorElement).getAttribute('href') || '';
        const linkText = node.textContent || '';
        richText.push({
          text: linkText,
          annotations,
          link: { href },
        });
        return;
      }
      if (node.nodeName.toLowerCase() === 'img') {
        const url = (node as HTMLImageElement).src;
        const alt = (node as HTMLImageElement).alt;
        richText.push({
          text: '',
          annotations,
          image: { url, alt },
        });
        return;
      }
      return richText.push({
        text: node.textContent || '',
        annotations,
      });
    }
  });

  return richText;
}

export function getCaretOffsetRelativeToParent(parentElement: Node) {
  const selection = window.getSelection();
  if (!selection) return null;

  // Ensure there's a selection and it's within the parent element
  if (
    selection.rangeCount === 0 ||
    !parentElement.contains(selection.anchorNode)
  ) {
    return null; // No selection or selection is outside the parent
  }

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(parentElement);
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  // The offset is the length of the text content before the caret
  return preCaretRange.toString().length;
}

export function findTextNodeAtChar(root: Node, charCount: number) {
  let currentCount = 0;

  function traverse(node: Node): { node: Node | null; offset: number } | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || '';
      const length = text.length;

      if (charCount >= currentCount && charCount < currentCount + length) {
        // Found the text node containing charCount
        return { node: node, offset: charCount - currentCount };
      }

      // Edge case: exactly at the end of this text node
      if (charCount === currentCount + length) {
        return { node: node, offset: length };
      }

      currentCount += length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const result = traverse(node.childNodes[i]!);
        if (result) return result;
      }
    }
    return null;
  }

  return traverse(root) ?? { node: null, offset: 0 };
}

export function getRichText(input: string): RichText[] {
  const tokens: RichText[] = [];

  const regex =
    /!\[(?<imgAlt>[^\]]*)\]\((?<imgUrl>[^)]+)\)|(?<!\*)\*\*\*(?<biTextA>[^*]+)\*\*\*(?!\*)|(?<!_)___(?<biTextB>[^_]+)___(?!_)|(?<!\*)\*\*(?<bTextA>[^*]+)\*\*(?!\*)|(?<!_)__(?<bTextB>[^_]+)__(?!_)|(?<!\*)\*(?<iTextA>[^*]+)\*(?!\*)|(?<!_)_(?<iTextB>[^_]+)_(?!_)|`(?<codeText>[^`]+)`|(?<!~)~~(?<strikeText>[^~]+)~~(?!~)|\[(?<linkText>[^\]]+)\]\((?<linkHref>[^)]+)\)/gu;

  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(input)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({
        text: input.slice(lastIndex, m.index),
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    }

    const g = m.groups ?? {};

    if (g.imgAlt !== undefined) {
      tokens.push({
        text: '',
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
        },
        image: { alt: g.imgAlt, url: g.imgUrl },
      });
    } else if (g.biTextA !== undefined || g.biTextB !== undefined) {
      tokens.push({
        text: g.biTextA! ?? g.biTextB!,
        annotations: {
          bold: true,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    } else if (g.bTextA !== undefined || g.bTextB !== undefined) {
      tokens.push({
        text: g.bTextA! ?? g.bTextB!,
        annotations: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    } else if (g.iTextA !== undefined || g.iTextB !== undefined) {
      tokens.push({
        text: g.iTextA! ?? g.iTextB!,
        annotations: {
          bold: false,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    } else if (g.codeText !== undefined) {
      tokens.push({
        text: g.codeText,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: true,
        },
      });
    } else if (g.strikeText !== undefined) {
      tokens.push({
        text: g.strikeText,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: true,
          underline: false,
          code: false,
        },
      });
    } else if (g.linkText !== undefined) {
      tokens.push({
        text: g.linkText,
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: true,
          code: false,
        },
        link: { href: g.linkHref },
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({
      text: input.slice(lastIndex),
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
      },
    });
  }

  return tokens;
}

export function parseLine(
  lines: string[],
  index: number,
): { block: ParsedMarkdown | ParsedMarkdown[]; consumed: number } | null {
  // Headings
  const line = lines[index]!;
  if (isHeading(line)) {
    const level = getHeadingLevel(line);
    const text = getHeadingText(line);
    return {
      block: {
        id: index.toString(),
        type: 'heading',
        level,
        rich_text: getRichText(text),
      },
      consumed: 1,
    };
  }

  // Horizontal Rule
  if (isHorizontalRule(line)) {
    return {
      block: { id: index.toString(), type: 'horizontal_rule' },
      consumed: 1,
    };
  }

  // Blockquotes
  if (isBlockquote(line)) {
    const children: BlockquoteChild[] = [];
    let j = index;
    while (j < lines.length && isBlockquote(lines[j]!)) {
      if (j > index) {
        if (
          hasGreaterThanAndText(lines[j - 1]!) &&
          getBlockquoteLevel(lines[j - 1]!) == getBlockquoteLevel(lines[j]!)
        ) {
          children[children.length - 1]!.rich_text = [
            ...children[children.length - 1]!.rich_text,
            ...getRichText(' ' + stripBlockquoteMarkers(lines[j]!)),
          ];
          j++;
          continue;
        }
      }
      if (isOnlyBlockquoteMarker(lines[j]!)) {
        j++;
        continue; // Skip empty blockquote lines
      }
      const child = {
        type: 'blockquote' as any,
        level: getBlockquoteLevel(lines[j]!),
        rich_text: getRichText(stripBlockquoteMarkers(lines[j]!)),
        id: j.toString(),
      };
      children.push(child);
      j++;
    }
    return {
      block: children,
      consumed: j - index,
    };
  }

  // Fenced Code Block
  if (isFencedCodeBlock(line)) {
    const fence = line.slice(0, 3);
    const language = line.slice(3).trim() || null;
    let j = index + 1;
    let codeContent = '';
    while (j < lines.length && !lines[j]!.startsWith(fence)) {
      codeContent += lines[j] + '\n';
      j++;
    }
    // Remove the last newline character
    if (codeContent.endsWith('\n')) {
      codeContent = codeContent.slice(0, -1);
    }
    return {
      block: {
        id: index.toString(),
        type: 'code',
        rich_text: [{ text: codeContent }],
        language,
      },
      consumed: j + 1 - index,
    };
  }

  // Indented Code Block
  /// ((?:(?: {4}|\t).*(?:\n|$))+)/g
  if (line.startsWith('    ') || line.startsWith('\t')) {
    let j = index;
    let codeContent = '';
    while (
      j < lines.length &&
      (lines[j]!.startsWith('    ') || lines[j]!.startsWith('\t'))
    ) {
      codeContent += lines[j] + '\n';
      j++;
    }
    // Remove the last newline character
    if (codeContent.endsWith('\n')) {
      codeContent = codeContent.slice(0, -1);
    }
    return {
      block: {
        id: index.toString(),
        type: 'code',
        rich_text: [{ text: codeContent }],
        language: null,
      },
      consumed: j - index,
    };
  }

  // Lists (Ordered, Unordered, Task)
  if (isListItem(line)) {
    const children: ListItemChild[] = [];
    let j = index;

    while (j < lines.length && isListItem(lines[j]!)) {
      const match = lines[j]!.match(
        /^(\s*)([-*+]|\d+\.)\s*(?:\[ ?([xX]?)\]\s*)?(.*)?$/,
      );

      if (match && match[1] !== undefined && match[2] !== undefined) {
        const indent = match[1].length;
        const marker = match[2];
        const checkbox = match[3]; // "x" | "X" | "" | undefined
        const text = match[4] ?? '';

        let format: 'ordered' | 'unordered' | 'task' = 'unordered';
        let checked = false;

        if (/^\d+\.$/.test(marker)) {
          format = 'ordered';
        } else if (checkbox !== undefined) {
          format = 'task';
          checked = checkbox.toLowerCase() === 'x';
        }

        const level = Math.floor(indent / 2); // assuming 2 spaces per indent

        if (format === 'task') {
          children.push({
            type: 'listItem' as any,
            level,
            format,
            checked,
            rich_text: getRichText(text),
            id: j.toString(),
          });
        } else if (format === 'ordered') {
          const numbering = parseInt(marker, 10); // ✅ fix here
          children.push({
            type: 'listItem' as any,
            level,
            format,
            numbering,
            rich_text: getRichText(text),
            id: j.toString(),
          });
        } else {
          children.push({
            type: 'listItem' as any,
            level,
            format,
            rich_text: getRichText(text),
            id: j.toString(),
          });
        }
      }

      j++;
    }
    return {
      block: children,
      consumed: j - index,
    };
  }

  // empty line
  if (line.trim() === '') {
    return null;
  }

  return {
    block: {
      id: index.toString(),
      type: 'paragraph',
      rich_text: getRichText(line),
    },
    consumed: 1,
  };
}

/* Parsing Markdwown to object representation
    1. Split string at \n
    2. For each line, determine its type
        1. bold, italics, strikethrough, inline code, links and images are considered part of paragraphs even if the line starts with them
        2. headings (#, ##, ###, ####, #####) 
        3. horizontal rule (---)
        4. blockquotes (>)
        5. code blocks (```lang ... ```)
        6. lists (-, *, + for unordered, 1., 2., 3. for ordered, - [ ] and - [x] for task lists)
*/
export function parseMarkdown(markdown: string): ParsedMarkdown[] {
  // 1. Split string at \n
  const lines = markdown.split('\n');
  // 2. For each line, determine its type
  const blocks: ParsedMarkdown[] = [];
  for (let i = 0; i < lines.length; i++) {
    // Determine type of line
    const parsed = parseLine(lines, i);
    if (parsed) {
      if (Array.isArray(parsed.block)) {
        parsed.block.forEach((b) => blocks.push(b));
      } else blocks.push(parsed.block);
    }
    if (parsed?.consumed) i += parsed.consumed - 1;
  }
  return blocks;
}

export function removedFromStartLength(prev: string, curr: string): number {
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] === curr[0]) return i - 1;
  }

  return 0; // no pure "start removal"
}

export function richTextToHTML(richTexts: RichText[], key: string) {
  let html = [];
  for (let i = 0; i < richTexts.length; i++) {
    const rt = richTexts[i]!;
    if (Object.values(rt.annotations).some((v) => v)) {
      html.push(
        <span
          key={`${key}-${i}`}
          className={cn({
            'font-bold': rt.annotations.bold,
            italic: rt.annotations.italic,
            'line-through': rt.annotations.strikethrough,
            underline: rt.annotations.underline,
            'code font-mono bg-muted px-1 rounded': rt.annotations.code,
          })}
        >
          {rt.text}
        </span>,
      );
    } else if (rt.image) {
      html.push(
        <img
          key={`${key}-${i}`}
          src={rt.image.url}
          alt={rt.image.alt || ''}
          className="max-w-full h-auto"
        />,
      );
    } else if (rt.link) {
      html.push(
        <a
          key={`${key}-${i}`}
          href={rt.link.href}
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {rt.text}
        </a>,
      );
    } else html.push(<Fragment key={`${key}-${i}`}>{rt.text}</Fragment>);
  }
  return html;
}

export function convertAnnotationsToMarkdown(rt: RichText) {
  let text = rt.text;
  if (rt.annotations.bold) {
    text = `**${text}**`;
  }
  if (rt.annotations.italic) {
    text = `*${text}*`;
  }
  if (rt.annotations.strikethrough) {
    text = `~~${text}~~`;
  }
  if (rt.annotations.underline) {
    text = `__${text}__`;
  }
  if (rt.annotations.code) {
    text = `\`${text}\``;
  }
  if (rt.link) {
    text = `[${text}](${rt.link.href})`;
  }
  return text;
}

export function convertBlocksToMarkdown(blocks: ParsedMarkdown[]) {
  const markdown = blocks
    .map((block) => {
      switch (block.type) {
        case 'heading':
          return `${'#'.repeat(block.level)} ${block.rich_text
            .map((rt) => convertAnnotationsToMarkdown(rt))
            .join('')}\n\n`;
        case 'paragraph':
          return `${block.rich_text.map((rt) => rt.text).join('')}\n\n`;
        case 'listItem':
          const prefix =
            block.format === 'unordered'
              ? '- '
              : block.format === 'ordered'
                ? `${block.numbering}. `
                : block.format === 'task'
                  ? `[${block.checked ? 'x' : ' '}] `
                  : '';
          return `${'  '.repeat(block.level)}${prefix}${block.rich_text
            .map((rt) => rt.text)
            .join('')}\n`;
        case 'blockquote':
          return `${'> '.repeat(block.level)}${block.rich_text
            .map((rt) => rt.text)
            .join('')}\n\n`;
        case 'code':
          return `\`\`\`\n${block.rich_text
            .map((rt) => rt.text)
            .join('')}\n\`\`\`\n\n`;
        case 'horizontal_rule':
          return `---\n\n`;
        default:
          return '';
      }
    })
    .join('')
    .trim();
  return markdown;
}

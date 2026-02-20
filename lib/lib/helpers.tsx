import type React from 'react';
import { Fragment } from 'react/jsx-runtime';
import {
  CodeBlock,
  SortableItem,
  ThemeComponent,
  ListItem,
  Paragraph,
} from '../components';
import type { Theme } from '../components/theme/utils';
import type {
  BlockquoteChild,
  BlockType,
  ListItemChild,
  ParsedMarkdown,
  ParsedParagraph,
  RichText,
} from './types';
import { cn } from './utils';

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

  function traverse(
    node: ChildNode,
    inherited: RichText['annotations'],
  ) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        richText.push({
          text,
          ...(inherited && { annotations: { ...inherited } }),
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement;
      const classes = Array.from(elem.classList);
      // Merge parent annotations with current element's annotations
      const annotations = {
        bold: inherited?.bold || classes.includes('font-bold'),
        italic: inherited?.italic || classes.includes('italic'),
        strikethrough:
          inherited?.strikethrough || classes.includes('line-through'),
        underline: inherited?.underline || classes.includes('underline'),
        code: inherited?.code || classes.includes('code'),
      };

      if (elem.nodeName.toLowerCase() === 'a') {
        const href = (elem as HTMLAnchorElement).getAttribute('href') || '';
        const linkText = elem.textContent || '';
        richText.push({
          text: linkText,
          annotations,
          link: { href },
        });
        return;
      }
      if (elem.nodeName.toLowerCase() === 'img') {
        const url = (elem as HTMLImageElement).src;
        const alt = (elem as HTMLImageElement).alt;
        richText.push({
          text: '',
          annotations,
          image: { url, alt },
        });
        return;
      }

      // Recurse into children, passing accumulated annotations
      elem.childNodes.forEach((child) => traverse(child, annotations));
    }
  }

  el.childNodes.forEach((node) =>
    traverse(node, undefined as unknown as RichText['annotations']),
  );

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
        id: crypto.randomUUID(),
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
        type: 'blockquote' as const,
        level: getBlockquoteLevel(lines[j]!),
        rich_text: getRichText(stripBlockquoteMarkers(lines[j]!)),
        id: crypto.randomUUID(),
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
    let fenceClosed = false;
    while (j < lines.length) {
      if (lines[j]!.startsWith(fence)) {
        fenceClosed = true;
        break;
      }
      codeContent += lines[j] + '\n';
      j++;
    }
    // Remove the last newline character
    if (codeContent.endsWith('\n')) {
      codeContent = codeContent.slice(0, -1);
    }
    return {
      block: {
        id: crypto.randomUUID(),
        type: 'code',
        rich_text: [{ text: codeContent }],
        language,
      },
      consumed: fenceClosed ? j + 1 - index : j - index,
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
        id: crypto.randomUUID(),
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

        // Count tabs as 4 spaces for indent calculation
        const rawIndent = match[1];
        const expandedIndent = rawIndent.replace(/\t/g, '    ').length;
        const level = Math.floor(expandedIndent / 2);

        if (format === 'task') {
          children.push({
            type: 'listItem' as const,
            level,
            format,
            checked,
            rich_text: getRichText(text),
            id: crypto.randomUUID(),
          });
        } else if (format === 'ordered') {
          const numbering = parseInt(marker, 10); // ✅ fix here
          children.push({
            type: 'listItem' as const,
            level,
            format,
            numbering,
            rich_text: getRichText(text),
            id: crypto.randomUUID(),
          });
        } else {
          children.push({
            type: 'listItem' as const,
            level,
            format,
            rich_text: getRichText(text),
            id: crypto.randomUUID(),
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
  const html: React.ReactNode[] = [];
  for (let i = 0; i < richTexts.length; i++) {
    const rt = richTexts[i]!;
    if (Object.values(rt.annotations).some((v) => v)) {
      html.push(
        <span
          key={`${key}-${i}`}
          className={cn({
            're:font-bold': rt.annotations.bold,
            italic: rt.annotations.italic,
            're:line-through': rt.annotations.strikethrough,
            underline: rt.annotations.underline,
            're:code re:font-mono re:bg-muted re:px-1 re:rounded':
              rt.annotations.code,
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
          className="re:max-w-full re:h-auto"
        />,
      );
    } else if (rt.link) {
      html.push(
        <a
          key={`${key}-${i}`}
          href={rt.link.href}
          className="re:text-blue-500 re:underline"
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
          return `${block.rich_text.map((rt) => convertAnnotationsToMarkdown(rt)).join('')}\n\n`;
        case 'listItem': {
          const prefix =
            block.format === 'unordered'
              ? '- '
              : block.format === 'ordered'
              ? `${block.numbering}. `
              : block.format === 'task'
              ? `[${block.checked ? 'x' : ' '}] `
              : '';
          return `${'  '.repeat(block.level)}${prefix}${block.rich_text
            .map((rt) => convertAnnotationsToMarkdown(rt))
            .join('')}\n`;
        }
        case 'blockquote':
          return `${'> '.repeat(block.level)}${block.rich_text
            .map((rt) => convertAnnotationsToMarkdown(rt))
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

export function markdownToBlock({
  parsed,
  props,
  ref,
  updateNode,
  isDragOverlay = false,
  convertBlockType,
  components: theme,
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
  convertBlockType?: (id: string, type: BlockType) => void;
  components: Theme;
}) {
  const notionBlocks: React.ReactNode[] = [];

  for (const block of parsed) {
    switch (block.type) {
      case 'heading': {
        const headingMap: Record<
          number,
          { wrapper: keyof Theme; component: keyof Theme }
        > = {
          1: { wrapper: 'heading1Wrapper', component: 'heading1' },
          2: { wrapper: 'heading2Wrapper', component: 'heading2' },
          3: { wrapper: 'heading3Wrapper', component: 'heading3' },
          4: { wrapper: 'heading4Wrapper', component: 'heading4' },
          5: { wrapper: 'heading5Wrapper', component: 'heading5' },
          6: { wrapper: 'heading6Wrapper', component: 'heading6' },
        };
        const keys = headingMap[block.level] ?? headingMap[3]!;
        const HeadingComponent = theme[keys.component] as typeof theme.heading1;
        const HeadingWrapper = theme[keys.wrapper] as typeof theme.heading1Wrapper;
        if (isDragOverlay) {
          return (
            <ThemeComponent
              Component={HeadingComponent}
              blockIdx={block.id}
              rich_text={block.rich_text}
              dragRef={ref}
              {...props}
              className={cn(props?.className, 're:opacity-20')}
            />
          );
        }
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            Element={HeadingWrapper}
            blockType={block.type}
            level={block.level}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={HeadingComponent}
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
      case 'horizontal_rule':
        notionBlocks.push(
          <SortableItem
            key={block.id}
            id={block.id}
            Element={theme.horizontalRuleWrapper}
            blockType={block.type}
            onChangeType={(type) => convertBlockType?.(block.id, type)}
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={theme.horizontalRule}
              blockIdx={block.id}
              onChange={(updated: RichText[]) =>
                updateNode?.(updated, block.id)
              }
            />
          </SortableItem>,
        );
        break;

      case 'blockquote':
        if (isDragOverlay) {
          return (
            <ThemeComponent
              Component={theme.blockquote}
              level={block.level}
              blockIdx={block.id}
              rich_text={block.rich_text}
              {...props}
              className={cn(props.className, 're:opacity-20')}
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
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={theme.blockquote}
              level={block.level}
              blockIdx={block.id}
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
            <ThemeComponent
              blockIdx={block.id}
              level={block.level}
              type={block.format}
              checked={block.format === 'task' ? block.checked : undefined}
              numbering={
                block.format === 'ordered' ? block.numbering : undefined
              }
              rich_text={block.rich_text}
              {...props}
              className={cn(props.className, 're:opacity-20')}
              Component={ListItem}
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
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={ListItem}
              blockIdx={block.id}
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
            <ThemeComponent
              Component={CodeBlock}
              code={block.rich_text[0]?.text || ''}
              {...props}
              className={cn(props.className, 're:opacity-20')}
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
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={CodeBlock}
              blockIdx={block.id}
              onChange={(updated: RichText[]) =>
                updateNode?.(updated, block.id)
              }
              code={block.rich_text[0]?.text || ''}
            />
          </SortableItem>,
        );
        break;
      case 'paragraph':
        if (isDragOverlay) {
          return (
            <ThemeComponent
              Component={Paragraph}
              blockIdx={block.id}
              rich_text={block.rich_text}
              ref={ref}
              className="re:opacity-20"
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
            dragIcon={theme.actionDragIcon}
            dropdownIcon={theme.actionDropdownIcon}
          >
            <ThemeComponent
              Component={Paragraph}
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

function getBlockRichText(block: ParsedMarkdown): RichText[] {
  if ('rich_text' in block) {
    return block.rich_text as RichText[];
  }
  return [];
}

export function blockToType(
  block: ParsedMarkdown,
  type: BlockType,
): ParsedMarkdown | null {
  if (!block) return null;
  const richText = getBlockRichText(block);
  switch (type) {
    case 'paragraph':
      return { id: block.id, type: 'paragraph', rich_text: richText };
    case 'heading1':
      return { id: block.id, type: 'heading', level: 1, rich_text: richText };
    case 'heading2':
      return { id: block.id, type: 'heading', level: 2, rich_text: richText };
    case 'heading3':
      return { id: block.id, type: 'heading', level: 3, rich_text: richText };
    case 'heading4':
      return { id: block.id, type: 'heading', level: 4, rich_text: richText };
    case 'heading5':
      return { id: block.id, type: 'heading', level: 5, rich_text: richText };
    case 'heading6':
      return { id: block.id, type: 'heading', level: 6, rich_text: richText };
    case 'horizontal_rule':
      return { id: block.id, type: 'horizontal_rule' };
    case 'blockquote':
      return {
        id: block.id,
        type: 'blockquote',
        level: 1,
        rich_text: richText,
      };
    case 'listItemBulleted':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'unordered',
        rich_text: richText,
      };
    case 'listItemNumbered':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'ordered',
        numbering: 1,
        rich_text: richText,
      };
    case 'listItemTask':
      return {
        id: block.id,
        type: 'listItem',
        level: 1,
        format: 'task',
        checked: false,
        rich_text: richText,
      };
    case 'code':
      return { id: block.id, type: 'code', rich_text: richText, language: null };
    default:
      return null;
  }
}

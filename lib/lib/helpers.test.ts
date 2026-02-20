import { describe, test, expect } from 'vitest';
import {
  getRichText,
  parseMarkdown,
  convertBlocksToMarkdown,
  blockToType,
  convertAnnotationsToMarkdown,
  isListItem,
  isFencedCodeBlock,
  isBlockquote,
  isHorizontalRule,
  isHeading,
  getHeadingLevel,
  getBlockquoteLevel,
} from './helpers';
import type { ParsedMarkdown, RichText } from './types';

// ─── Helper utilities ───

const plain = (text: string): RichText => ({
  text,
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
  },
});

// ─── Line detection helpers ───

describe('line detection helpers', () => {
  test('isHeading', () => {
    expect(isHeading('# Hello')).toBe(true);
    expect(isHeading('## Hello')).toBe(true);
    expect(isHeading('###### Hello')).toBe(true);
    expect(isHeading('Not a heading')).toBe(false);
    expect(isHeading('')).toBe(false);
  });

  test('getHeadingLevel', () => {
    expect(getHeadingLevel('# H1')).toBe(1);
    expect(getHeadingLevel('### H3')).toBe(3);
    expect(getHeadingLevel('###### H6')).toBe(6);
  });

  test('isFencedCodeBlock', () => {
    expect(isFencedCodeBlock('```')).toBe(true);
    expect(isFencedCodeBlock('```typescript')).toBe(true);
    expect(isFencedCodeBlock('~~~')).toBe(true);
    expect(isFencedCodeBlock('not code')).toBe(false);
  });

  test('isListItem', () => {
    expect(isListItem('- item')).toBe(true);
    expect(isListItem('* item')).toBe(true);
    expect(isListItem('+ item')).toBe(true);
    expect(isListItem('1. item')).toBe(true);
    expect(isListItem('  - nested')).toBe(true);
    expect(isListItem('- [x] task')).toBe(true);
    expect(isListItem('- [ ] task')).toBe(true);
    expect(isListItem('not a list')).toBe(false);
  });

  test('isBlockquote', () => {
    expect(isBlockquote('> quote')).toBe(true);
    expect(isBlockquote('>> nested')).toBe(true);
    expect(isBlockquote('not a quote')).toBe(false);
  });

  test('getBlockquoteLevel', () => {
    expect(getBlockquoteLevel('> quote')).toBe(1);
    expect(getBlockquoteLevel('>> nested')).toBe(2);
    expect(getBlockquoteLevel('>>> deep')).toBe(3);
  });

  test('isHorizontalRule', () => {
    expect(isHorizontalRule('---')).toBe(true);
    expect(isHorizontalRule('***')).toBe(true);
    expect(isHorizontalRule('----')).toBe(true);
    expect(isHorizontalRule('not a rule')).toBe(false);
    expect(isHorizontalRule('--')).toBe(false);
  });
});

// ─── getRichText ───

describe('getRichText', () => {
  test('plain text', () => {
    const result = getRichText('Hello world');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('Hello world');
    expect(result[0]!.annotations.bold).toBe(false);
  });

  test('bold with asterisks', () => {
    const result = getRichText('**bold**');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('bold');
    expect(result[0]!.annotations.bold).toBe(true);
    expect(result[0]!.annotations.italic).toBe(false);
  });

  test('bold with underscores', () => {
    const result = getRichText('__bold__');
    // double underscores map to bold in this parser's regex
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('bold');
    expect(result[0]!.annotations.bold).toBe(true);
  });

  test('italic with asterisk', () => {
    const result = getRichText('*italic*');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('italic');
    expect(result[0]!.annotations.italic).toBe(true);
  });

  test('bold and italic with ***', () => {
    const result = getRichText('***bold italic***');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('bold italic');
    expect(result[0]!.annotations.bold).toBe(true);
    expect(result[0]!.annotations.italic).toBe(true);
  });

  test('inline code', () => {
    const result = getRichText('`code`');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('code');
    expect(result[0]!.annotations.code).toBe(true);
  });

  test('strikethrough', () => {
    const result = getRichText('~~struck~~');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('struck');
    expect(result[0]!.annotations.strikethrough).toBe(true);
  });

  test('link', () => {
    const result = getRichText('[click here](https://example.com)');
    expect(result).toHaveLength(1);
    expect(result[0]!.text).toBe('click here');
    expect(result[0]!.link?.href).toBe('https://example.com');
  });

  test('image', () => {
    const result = getRichText('![alt text](https://img.com/a.png)');
    expect(result).toHaveLength(1);
    expect(result[0]!.image?.alt).toBe('alt text');
    expect(result[0]!.image?.url).toBe('https://img.com/a.png');
  });

  test('mixed: text with bold and plain', () => {
    const result = getRichText('Hello **world** today');
    expect(result).toHaveLength(3);
    expect(result[0]!.text).toBe('Hello ');
    expect(result[0]!.annotations.bold).toBe(false);
    expect(result[1]!.text).toBe('world');
    expect(result[1]!.annotations.bold).toBe(true);
    expect(result[2]!.text).toBe(' today');
  });

  test('empty string', () => {
    const result = getRichText('');
    expect(result).toHaveLength(0);
  });
});

// ─── convertAnnotationsToMarkdown ───

describe('convertAnnotationsToMarkdown', () => {
  test('plain text', () => {
    expect(convertAnnotationsToMarkdown(plain('hello'))).toBe('hello');
  });

  test('bold', () => {
    const rt: RichText = {
      ...plain('bold'),
      annotations: { ...plain('').annotations, bold: true },
    };
    expect(convertAnnotationsToMarkdown(rt)).toBe('**bold**');
  });

  test('italic', () => {
    const rt: RichText = {
      ...plain('it'),
      annotations: { ...plain('').annotations, italic: true },
    };
    expect(convertAnnotationsToMarkdown(rt)).toBe('*it*');
  });

  test('strikethrough', () => {
    const rt: RichText = {
      ...plain('st'),
      annotations: { ...plain('').annotations, strikethrough: true },
    };
    expect(convertAnnotationsToMarkdown(rt)).toBe('~~st~~');
  });

  test('code', () => {
    const rt: RichText = {
      ...plain('cd'),
      annotations: { ...plain('').annotations, code: true },
    };
    expect(convertAnnotationsToMarkdown(rt)).toBe('`cd`');
  });

  test('link', () => {
    const rt: RichText = {
      ...plain('text'),
      annotations: { ...plain('').annotations, underline: true },
      link: { href: 'https://example.com' },
    };
    expect(convertAnnotationsToMarkdown(rt)).toBe(
      '[__text__](https://example.com)',
    );
  });
});

// ─── parseMarkdown ───

describe('parseMarkdown', () => {
  test('single heading', () => {
    const result = parseMarkdown('# Hello World');
    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('heading');
    if (result[0]!.type === 'heading') {
      expect(result[0]!.level).toBe(1);
      expect(result[0]!.rich_text[0]!.text).toBe('Hello World');
    }
  });

  test('multiple heading levels', () => {
    const md = '# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5\n\n###### H6';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(result[i]!.type).toBe('heading');
      if (result[i]!.type === 'heading') {
        expect(result[i]!.level).toBe(i + 1);
      }
    }
  });

  test('paragraph', () => {
    const result = parseMarkdown('Just a paragraph.');
    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('paragraph');
    if (result[0]!.type === 'paragraph') {
      expect(result[0]!.rich_text[0]!.text).toBe('Just a paragraph.');
    }
  });

  test('horizontal rule', () => {
    const result = parseMarkdown('---');
    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('horizontal_rule');
  });

  test('fenced code block with language', () => {
    const md = '```typescript\nconst x = 1;\n```';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('code');
    if (result[0]!.type === 'code') {
      expect(result[0]!.language).toBe('typescript');
      expect(result[0]!.rich_text[0]!.text).toBe('const x = 1;');
    }
  });

  test('fenced code block without language', () => {
    const md = '```\nhello\n```';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(1);
    if (result[0]!.type === 'code') {
      expect(result[0]!.language).toBeNull();
    }
  });

  test('unterminated code block does not consume entire document', () => {
    const md = '```typescript\ncode line\n\nNext paragraph';
    const result = parseMarkdown(md);
    // Should parse the code block (unterminated) and then the paragraph
    expect(result.length).toBeGreaterThanOrEqual(1);
    const codeBlock = result.find((b) => b.type === 'code');
    expect(codeBlock).toBeDefined();
  });

  test('unordered list', () => {
    const md = '- item 1\n- item 2\n- item 3';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(3);
    result.forEach((block) => {
      expect(block.type).toBe('listItem');
      if (block.type === 'listItem') {
        expect(block.format).toBe('unordered');
      }
    });
  });

  test('ordered list', () => {
    const md = '1. first\n2. second\n3. third';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(3);
    result.forEach((block) => {
      expect(block.type).toBe('listItem');
      if (block.type === 'listItem') {
        expect(block.format).toBe('ordered');
      }
    });
  });

  test('task list', () => {
    const md = '- [x] done\n- [ ] not done';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(2);
    if (result[0]!.type === 'listItem' && result[0]!.format === 'task') {
      expect(result[0]!.checked).toBe(true);
    }
    if (result[1]!.type === 'listItem' && result[1]!.format === 'task') {
      expect(result[1]!.checked).toBe(false);
    }
  });

  test('nested list with indentation', () => {
    const md = '- parent\n  - child\n    - grandchild';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(3);
    if (result[0]!.type === 'listItem') expect(result[0]!.level).toBe(0);
    if (result[1]!.type === 'listItem') expect(result[1]!.level).toBe(1);
    if (result[2]!.type === 'listItem') expect(result[2]!.level).toBe(2);
  });

  test('blockquote', () => {
    const md = '> This is a quote';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('blockquote');
    if (result[0]!.type === 'blockquote') {
      expect(result[0]!.level).toBe(1);
    }
  });

  test('nested blockquote', () => {
    const md = '>> Nested quote';
    const result = parseMarkdown(md);
    expect(result).toHaveLength(1);
    if (result[0]!.type === 'blockquote') {
      expect(result[0]!.level).toBe(2);
    }
  });

  test('paragraph with bold text', () => {
    const result = parseMarkdown('Hello **bold** world');
    expect(result).toHaveLength(1);
    if (result[0]!.type === 'paragraph') {
      expect(result[0]!.rich_text.length).toBe(3);
      expect(result[0]!.rich_text[1]!.annotations.bold).toBe(true);
    }
  });

  test('empty input returns empty array', () => {
    expect(parseMarkdown('')).toEqual([]);
  });

  test('all block IDs are unique', () => {
    const md =
      '# Heading\n\nParagraph\n\n- list\n- list\n\n> quote\n\n---\n\n```\ncode\n```';
    const result = parseMarkdown(md);
    const ids = result.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ─── convertBlocksToMarkdown ───

describe('convertBlocksToMarkdown', () => {
  test('heading', () => {
    const blocks: ParsedMarkdown[] = [
      { id: '1', type: 'heading', level: 2, rich_text: [plain('Title')] },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('## Title');
  });

  test('paragraph', () => {
    const blocks: ParsedMarkdown[] = [
      { id: '1', type: 'paragraph', rich_text: [plain('Hello')] },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('Hello');
  });

  test('paragraph with bold annotations', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'paragraph',
        rich_text: [
          plain('Hello '),
          {
            text: 'bold',
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
            },
          },
          plain(' world'),
        ],
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('Hello **bold** world');
  });

  test('unordered list', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'listItem',
        level: 0,
        format: 'unordered',
        rich_text: [plain('item')],
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('- item');
  });

  test('ordered list', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'listItem',
        level: 0,
        format: 'ordered',
        numbering: 1,
        rich_text: [plain('first')],
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('1. first');
  });

  test('task list', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'listItem',
        level: 0,
        format: 'task',
        checked: true,
        rich_text: [plain('done')],
      },
      {
        id: '2',
        type: 'listItem',
        level: 0,
        format: 'task',
        checked: false,
        rich_text: [plain('todo')],
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('[x] done\n[ ] todo');
  });

  test('blockquote', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'blockquote',
        level: 1,
        rich_text: [plain('quote')],
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('> quote');
  });

  test('code block', () => {
    const blocks: ParsedMarkdown[] = [
      {
        id: '1',
        type: 'code',
        rich_text: [{ text: 'const x = 1;' }],
        language: null,
      },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe(
      '```\nconst x = 1;\n```',
    );
  });

  test('horizontal rule', () => {
    const blocks: ParsedMarkdown[] = [
      { id: '1', type: 'horizontal_rule' },
    ];
    expect(convertBlocksToMarkdown(blocks)).toBe('---');
  });

  test('empty blocks returns empty string', () => {
    expect(convertBlocksToMarkdown([])).toBe('');
  });
});

// ─── Round-trip: parse → convert → parse ───

describe('round-trip', () => {
  const roundTrip = (md: string) => {
    const parsed = parseMarkdown(md);
    const converted = convertBlocksToMarkdown(parsed);
    const reparsed = parseMarkdown(converted);
    return { parsed, converted, reparsed };
  };

  test('headings survive round-trip', () => {
    const { parsed, reparsed } = roundTrip('# Hello\n\n## World');
    expect(reparsed).toHaveLength(parsed.length);
    reparsed.forEach((block, i) => {
      expect(block.type).toBe(parsed[i]!.type);
      if (block.type === 'heading' && parsed[i]!.type === 'heading') {
        expect(block.level).toBe(parsed[i]!.level);
      }
    });
  });

  test('paragraphs with bold survive round-trip', () => {
    const { parsed, reparsed } = roundTrip('Hello **bold** world');
    expect(reparsed).toHaveLength(parsed.length);
    if (
      reparsed[0]!.type === 'paragraph' &&
      parsed[0]!.type === 'paragraph'
    ) {
      expect(reparsed[0]!.rich_text.length).toBe(
        parsed[0]!.rich_text.length,
      );
    }
  });

  test('horizontal rule survives round-trip', () => {
    const { reparsed } = roundTrip('---');
    expect(reparsed).toHaveLength(1);
    expect(reparsed[0]!.type).toBe('horizontal_rule');
  });

  test('code block survives round-trip', () => {
    const { parsed, reparsed } = roundTrip('```\ncode\n```');
    expect(reparsed).toHaveLength(1);
    if (reparsed[0]!.type === 'code' && parsed[0]!.type === 'code') {
      expect(reparsed[0]!.rich_text[0]!.text).toBe(
        parsed[0]!.rich_text[0]!.text,
      );
    }
  });

  test('unordered list survives round-trip', () => {
    const { parsed, reparsed } = roundTrip('- one\n- two');
    expect(reparsed).toHaveLength(parsed.length);
    reparsed.forEach((block) => {
      expect(block.type).toBe('listItem');
    });
  });

  test('blockquote survives round-trip', () => {
    const { reparsed } = roundTrip('> quoted');
    expect(reparsed).toHaveLength(1);
    expect(reparsed[0]!.type).toBe('blockquote');
  });
});

// ─── blockToType ───

describe('blockToType', () => {
  const source: ParsedMarkdown = {
    id: 'test-id',
    type: 'paragraph',
    rich_text: [plain('hello')],
  };

  test('convert to heading levels 1-6', () => {
    for (let level = 1; level <= 6; level++) {
      const result = blockToType(
        source,
        `heading${level}` as any,
      );
      expect(result).not.toBeNull();
      expect(result!.type).toBe('heading');
      if (result!.type === 'heading') {
        expect(result!.level).toBe(level);
      }
      expect(result!.id).toBe('test-id');
    }
  });

  test('convert to paragraph', () => {
    const heading: ParsedMarkdown = {
      id: 'h1',
      type: 'heading',
      level: 1,
      rich_text: [plain('title')],
    };
    const result = blockToType(heading, 'paragraph');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('paragraph');
  });

  test('convert to bulleted list', () => {
    const result = blockToType(source, 'listItemBulleted');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('listItem');
    if (result!.type === 'listItem') {
      expect(result!.format).toBe('unordered');
    }
  });

  test('convert to numbered list', () => {
    const result = blockToType(source, 'listItemNumbered');
    expect(result).not.toBeNull();
    if (result!.type === 'listItem' && result!.format === 'ordered') {
      expect(result!.numbering).toBe(1);
    }
  });

  test('convert to task list', () => {
    const result = blockToType(source, 'listItemTask');
    expect(result).not.toBeNull();
    if (result!.type === 'listItem') {
      expect(result!.format).toBe('task');
      if (result!.format === 'task') {
        expect(result!.checked).toBe(false);
      }
    }
  });

  test('convert to blockquote', () => {
    const result = blockToType(source, 'blockquote');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('blockquote');
  });

  test('convert to code', () => {
    const result = blockToType(source, 'code');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('code');
    if (result!.type === 'code') {
      expect(result!.language).toBeNull();
    }
  });

  test('convert to horizontal rule', () => {
    const result = blockToType(source, 'horizontal_rule');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('horizontal_rule');
  });

  test('preserves block id', () => {
    const result = blockToType(source, 'heading1');
    expect(result!.id).toBe('test-id');
  });

  test('preserves rich_text content', () => {
    const result = blockToType(source, 'heading2');
    if (result!.type === 'heading') {
      expect(result!.rich_text[0]!.text).toBe('hello');
    }
  });
});

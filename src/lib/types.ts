export type BlockquoteChild = {
  type: 'blockquote';
  level: number;
  rich_text: RichText[];
  id: string;
};

export type ListItemChild = {
  type: 'listItem';
  level: number;
  rich_text: RichText[];
  id: string;
} & (
  | {
      format: 'ordered';
      numbering: number;
    }
  | {
      format: 'unordered';
    }
  | {
      format: 'task';
      checked: boolean; // only for task lists
    }
);

export type RichText = {
  text: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
  image?: {
    alt?: string;
    url?: string;
  };
  link?: {
    href?: string;
  };
};

export type ParsedHeading = {
  type: 'heading';
  level: number;
  rich_text: RichText[];
};

export type ParsedHorizontalRule = {
  type: 'horizontal_rule';
};

export type ParsedCode = {
  type: 'code';
  rich_text: { text: string }[];
  language: string | null;
};

export type ParsedParagraph = {
  type: 'paragraph';
  rich_text: RichText[];
};
export type ParsedMarkdown = {
  id: string;
} & (
  | ParsedHeading
  | ParsedHorizontalRule
  | BlockquoteChild
  | ListItemChild
  | ParsedParagraph
  | ParsedCode
);

export type ConvertBlockToType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'horizontal_rule'
  | 'blockquote'
  | 'listItemNumbered'
  | 'listItemBulleted'
  | 'listItemTask'
  | 'code';

export type CodeBlockProps = {
  code: string;
  language?: string; // Optional — will detect if not provided
  caption?: string | null; // Optional caption for the code block
};

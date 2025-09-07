import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css'; // Import a default style for syntax highlighting
import { Highlight, themes } from 'prism-react-renderer';
import { highlightToPrismMap } from './constants';
import type { CodeBlockProps } from './types';
import { cn } from '../../lib';

export default function CodeBlock({
  code,
  language,
  caption,
  ...props
}: CodeBlockProps) {
  // Detect language if not provided
  let detectedLang = language;
  if (!language) {
    const detection = hljs.highlightAuto(code);
    detectedLang =
      highlightToPrismMap[detection.language || 'plaintext'] || 'plaintext';
  }

  return (
    <div className={cn('relative', props.className)}>
      <div className="absolute text-xs text-[#858585] mt-2 ml-4">
        {detectedLang}
      </div>
      <Highlight
        code={code.trim()}
        language={detectedLang as string}
        theme={themes.vsDark}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="bg-[rgb(23,23,23)]! rounded-2xl!"
            style={{
              ...style,
              padding: '32px 20px',
              borderRadius: '8px',
              margin: '20px 0 0 0',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      {caption && (
        <div className="text-xs text-[#858585] mt-2 mb-5 pl-4">{caption}</div>
      )}
    </div>
  );
}

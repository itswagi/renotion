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
  // Use language from markdown fence, normalize via map, fallback to plaintext
  const detectedLang = language
    ? (highlightToPrismMap[language] || language)
    : 'plaintext';

  return (
    <div className={cn('renotion-code-block re:relative', props.className)}>
      <div className="renotion-code-block-lang re:absolute re:text-xs re:text-[#858585] re:mt-2 re:ml-4">
        {detectedLang}
      </div>
      <Highlight
        code={code.trim()}
        language={detectedLang as string}
        theme={themes.vsDark}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="renotion-code-block-code re:bg-[rgb(23,23,23)]! re:rounded-2xl!"
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
        <div className="renotion-code-block-caption re:text-xs re:text-[#858585] re:mt-2 re:mb-5 re:pl-4">
          {caption}
        </div>
      )}
    </div>
  );
}

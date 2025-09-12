export const kitchenSinkMarkdown = `
# 📝 Markdown Kitchen Sink

This is a **bold** word, this is *italic*, and this is ***bold italic***.
Here’s some ~~strikethrough~~ text and some \`inline code\`.

---

## Headings

# H1
## H2
### H3
#### H4
##### H5
###### H6

---

## Lists

### Unordered
- Item 1
  - Nested Item 1.1
    - Nested Item 1.1.1
    - Nested Item 1.1.2
  - Nested Item 1.2
- Item 2

### Ordered
1. First
2. Second
   1. Second.1
   2. Second.2
3. Third

### Task Lists
- [ ] Incomplete task
- [x] Completed task
- [ ] Another task

---

## Links and Images

[OpenAI](https://openai.com)  
![Placeholder Image](https://via.placeholder.com/150)

---

## Blockquotes

> This is a blockquote.  
>> Nested blockquote.  
>>
>> Further Nested.
> 
>>> Deeply nested blockquote.
> Multiple lines work too.

---

## Code

### Inline
Here’s some \`inline code\`.

### Fenced
\`\`\`js
// JavaScript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

\`\`\`python
# Python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

### Indented
    This is an indented code block.
    

---

## Horizontal Rule

---

---

## Tables

| Syntax | Description | Test Text |
|--------|-------------|-----------|
| Header | Title       | Here      |
| Cell   | Data        | Markdown  |
| Foot   | Note        | Content   |

---

## Footnotes

Here’s a sentence with a footnote.[^1]

[^1]: This is the footnote.

---

## Definition Lists (CommonMark Extension)

Term 1  
: Definition 1

Term 2  
: Definition 2a  
: Definition 2b

---

## HTML Support (Raw)

<div style="color: red; font-weight: bold;">
  This is raw HTML inside markdown.
</div>

---

## Escaping Characters

\\*This is not italic\\*  
\\# This is not a heading  

---

## Emojis (GitHub Flavored Markdown)

:smile: :rocket: :tada:

---

## Nested Elements

1. **Bold list item**
2. *Italic list item*
3. \`Code inside list\`
   - Nested with [a link](https://example.com)

---

## Mixed Content

> ### Blockquote with heading
> - A list
> - Inside
>   - A blockquote  
> 
> And a table:
> 
> | Key | Value |
> |-----|-------|
> | 1   | One   |
> | 2   | Two   |

---

End of test markdown 🚀
`;

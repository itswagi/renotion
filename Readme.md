**Renotion**

A Notion style editor and viewer for markdown

This is still an alpha release, it has bugs and limited working features. Please feel free to open up issues

## Usage

```
import { Renotion } from "renotion";

const App() {
    return (
        <Renotion markdown={''}/>
    )
}
```

Provide your markdown as a string to the `markdown` prop

## Docs

| Prop     | type     | Description                                                                                               |
| -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| markdown | required | Provide a string containing markdown                                                                      |
| onChange | optional | `onChange(updatedMarkdown) { //your code }` Provide an optional function to process the updated markdown. |
| theme    | optional | Provide an optional theme to the editor. You can use `Theme` type with `createTheme` to style the editor as you like |

```jsx
import { Renotion, createTheme } from "renotion";

const App() {
    return (
        <Renotion 
            markdown={''} 
            theme={createTheme({
                // Override with custom components
                heading1: { Component: ({ children }) => <h1 className="custom-h1">{children}</h1> },
                // Or just add CSS classes
                paragraph: { className: "text-gray-800 leading-relaxed" },
                // Special case: editorWrapper only accepts className
                editorWrapper: { className: "bg-white text-black" }
            })}
        />
    )
}
```

## Theming and Customization

The `Renotion` component exposes a `theme` prop that allows you to completely customize the appearance and behavior of various markdown elements. Use the `createTheme` helper function to create custom themes.

### Using `createTheme`

The `createTheme` function accepts an overrides object where you can customize any of the available theme components. You have two options for each component:

1. **Replace with a custom component**: Provide a `Component` property
2. **Add CSS classes**: Provide a `className` property

### Available Theme Components

| Component | Description | Props |
|-----------|-------------|-------|
| `heading1`, `heading2`, `heading3`, `heading4`, `heading5`, `heading6` | Heading elements | `ThemeComponentProps` |
| `heading1Wrapper`, `heading2Wrapper`, `heading3Wrapper`, etc. | Wrapper containers for headings | `WrapperProps` |
| `paragraph` | Paragraph elements | `ThemeComponentProps` |
| `blockquote` | Blockquote elements | `ThemeComponentProps & { level: number }` |
| `listItem` | List items (ordered, unordered, tasks) | `ThemeComponentProps & { level: number; type: 'task' \| 'unordered' \| 'ordered'; checked?: boolean; numbering?: number }` |
| `codeBlock` | Code block elements | Various code block props |
| `horizontalRule` | Horizontal rule elements | Any props |
| `horizontalRuleWrapper` | Wrapper for horizontal rules | `WrapperProps` |
| `editorWrapper` | Main editor container | `{ className?: string; children: React.ReactElement }` |
| `actionDragIcon` | Drag handle icon | `{ className?: string }` |
| `actionDropdownIcon` | Settings/dropdown icon | `{ className?: string }` |

### Examples

#### Custom Component Override
```jsx
const customTheme = createTheme({
  heading1: { 
    Component: ({ children, ...props }) => (
      <h1 className="text-4xl font-bold text-blue-600 mb-4" {...props}>
        🎯 {children}
      </h1>
    )
  },
  paragraph: {
    Component: ({ children, ...props }) => (
      <p className="text-gray-700 leading-7 mb-3" {...props}>
        {children}
      </p>
    )
  }
});
```

#### CSS Class Override
```jsx
const styledTheme = createTheme({
  heading1: { className: "text-3xl font-extrabold text-purple-800" },
  heading2: { className: "text-2xl font-semibold text-purple-600" },
  paragraph: { className: "text-gray-800 leading-relaxed mb-4" },
  blockquote: { className: "border-l-4 border-blue-500 pl-4 italic" },
  codeBlock: { className: "bg-gray-100 rounded-lg p-4" },
  editorWrapper: { className: "bg-slate-50 p-6 rounded-lg shadow-sm" }
});
```

#### Dark Theme Example
```jsx
const darkTheme = createTheme({
  editorWrapper: { className: "bg-gray-900 text-gray-100" },
  heading1: { className: "text-white font-bold" },
  heading2: { className: "text-gray-200 font-semibold" },
  paragraph: { className: "text-gray-300 leading-relaxed" },
  blockquote: { className: "border-l-4 border-gray-600 pl-4 text-gray-400" },
  codeBlock: { className: "bg-gray-800 text-green-400" }
});
```

### Special Notes

- **editorWrapper**: This component only accepts `className` overrides, not custom components
- **Icon components** (`actionDragIcon`, `actionDropdownIcon`): These only accept `className` overrides
- **Component precedence**: When you provide a `Component`, it completely replaces the default component
- **Class merging**: When you provide a `className`, it gets merged with the existing classes

### Issue Tracker

[Kanban Board](https://thread-humidity-52b.notion.site/2637409c3ed280818ba8d657c5d6d1ff?v=2637409c3ed2801f824e000c0218774d)

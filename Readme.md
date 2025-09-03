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

### Issue Tracker

[Kanban Board](https://thread-humidity-52b.notion.site/2637409c3ed280818ba8d657c5d6d1ff?v=2637409c3ed2801f824e000c0218774d)

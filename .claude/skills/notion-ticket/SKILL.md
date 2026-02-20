# Notion Ticket Skill

Create tickets in the Renotion project's Issue Tracking database on Notion.

## Invocation

User says: `/notion-ticket` followed by a description of the ticket.

## Data Source

- **Database:** Issue Tracking (Renotion project)
- **Data Source ID:** `2637409c-3ed2-800b-82d2-000b82d28cfa`

## Schema

| Property | Type | Values |
|---|---|---|
| **Issue** | title (required) | Free text — concise ticket title |
| **Status** | status | `Backlog`, `Open`, `In progress`, `In review`, `Testing`, `Won't fix`, `Resolved` |
| **Priority** | select | `High`, `Medium`, `Low` |
| **Type** | multi_select | `Security`, `Technical debt`, `Feature request`, `Bug` |
| **Assigned to** | person | User IDs |

## Instructions

1. Parse the user's message to extract:
   - A concise **title** for the `Issue` property
   - **Priority** (default to `Medium` if not specified)
   - **Type** (infer from context — e.g. "bug" maps to `Bug`, "feature" maps to `Feature request`, "tech debt" maps to `Technical debt`, "security" maps to `Security`; omit if unclear)
   - **Status** (default to `Open` if not specified)
   - **Page content** — a detailed description in Notion-flavored Markdown for the ticket body

2. Create the ticket using `mcp__notion__notion-create-pages` with:
   ```json
   {
     "parent": { "data_source_id": "2637409c-3ed2-800b-82d2-000b82d28cfa" },
     "pages": [
       {
         "properties": {
           "Issue": "<title>",
           "Status": "<status>",
           "Priority": "<priority>",
           "Type": "<type>"
         },
         "content": "<detailed description in Notion Markdown>"
       }
     ]
   }
   ```

3. After creation, confirm to the user with the ticket title and a link to the created page.

## Examples

**User:** `/notion-ticket high priority bug: markdown parser crashes on nested code blocks`

Creates:
- Issue: `Markdown parser crashes on nested code blocks`
- Priority: `High`
- Type: `["Bug"]`
- Status: `Open`
- Content: description of the bug

**User:** `/notion-ticket add support for callout blocks`

Creates:
- Issue: `Add support for callout blocks`
- Priority: `Medium`
- Type: `["Feature request"]`
- Status: `Open`
- Content: description of the feature request

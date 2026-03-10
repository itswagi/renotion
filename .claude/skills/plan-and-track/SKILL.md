---
name: plan-and-track
description: >-
  Use when implementing any feature, bugfix, or refactor — before writing
  code — or when tempted to skip ticket creation because the change seems
  small, retroactive tickets seem equivalent, or a plan file already exists.
---

## Iron Law

**NO CODE WITHOUT A TRACKING TICKET FIRST.**

Not after. Not retroactively. Not "next time." Before.

## Gate Function

Every implementation request passes through this gate:

1. **Assess** — Read the request. Is it an implementation task (feature, bugfix, refactor)?
2. **Decide** — See CLAUDE.md "Decide the scope" for `create_plan` vs `create_task` criteria.
3. **Create** — Call the MCP tool. Ticket exists in the system.
4. **Code** — Only now do you write, edit, or modify code.

If you are already coding and realize no ticket exists: **stop immediately**, create the ticket, then continue.

## API Notes

Subtasks are **plain strings**, not objects:

```
subtasks: ["Write unit tests", "Update handler"]  // correct
subtasks: [{ title: "..." }]                      // WRONG
```

## Red Flags

If you hear yourself thinking any of these, you are rationalizing. Stop and create the ticket.

| Thought | Counter |
|---------|---------|
| "It's only N lines" | Ticket creation takes 30 seconds. The rule has no size threshold. |
| "No time — demo/deadline soon" | 30 seconds for a ticket vs minutes of implementation. Time pressure is not a waiver. |
| "I'll create tickets retroactively" | "Before writing code" means before. Retroactive tickets cannot shape scope. |
| "The user said 'implement', not 'create tickets'" | CLAUDE.md is a standing instruction. User phrasing does not create exceptions. |
| "The plan file IS the documentation" | Plans are not tickets. Tickets provide status tracking, board visibility, and audit trail. |
| "Tickets would just duplicate the plan" | Then use `create_plan` with a detailed `description` — that's what the field is for. |
| "I'm already 2 hours in / almost done" | Sunk cost. Stop now, ticket the remaining work. Past violation does not justify future violation. |
| "User didn't ask for tickets" | They asked when they wrote CLAUDE.md. The rule is unconditional. |
| "I'll do it right next time" | This IS next time. The rule applies now. |
| "Retroactive tickets are busywork" | They still serve tracking, communication, and completion criteria. Create them. |
| "Flow state — switching costs" | The rule exists precisely to prevent this trap. 30-second interruption, not a context switch. |

## Foundational Principle

A rule that only applies when convenient is a suggestion. Violating the letter **is** violating the spirit. If the rule is wrong, change CLAUDE.md — do not invent situational exceptions.

---
name: plan-idea
description: >-
  Use when the user says "plan an idea", "pick an idea", "work on an idea",
  or wants to select a pending idea from pm-tool and enter plan mode with
  its full context.
---

# Plan Idea

Select a pending idea from pm-tool and enter plan mode with its full context.

## Workflow

```dot
digraph plan_idea {
  rankdir=TB;
  fetch [label="Fetch pending ideas\nlist_ideas(status: Pending)"];
  empty [label="No ideas found?\nReport and stop" shape=diamond];
  present [label="Present ideas\nvia AskUserQuestion"];
  cancelled [label="User cancels?\nStop, no status change" shape=diamond];
  details [label="Get full idea\nget_idea(ideaId)"];
  update [label="Update status\nupdate_idea(status: Planning)"];
  plan [label="Enter plan mode\nwith idea context"];
  handoff [label="Remind: plan-and-track\n+ link_idea"];

  fetch -> empty;
  empty -> present [label="has ideas"];
  empty -> "STOP" [label="zero"];
  present -> cancelled;
  cancelled -> details [label="selected"];
  cancelled -> "STOP" [label="cancelled"];
  details -> update;
  update -> plan;
  plan -> handoff;
}
```

### Steps

1. **Fetch** — `mcp__pm-tool__list_ideas` with `status: "Pending"`. If empty, say "No pending ideas found" and stop.
2. **Present** — Show ideas via `AskUserQuestion` (max 4 options; user can type "Other" for full list). Format each option: `[Title] — Priority: [priority] — Tags: [tags]`.
3. **Get details** — `mcp__pm-tool__get_idea` for the selected idea.
4. **Update status** — `mcp__pm-tool__update_idea` setting `status: "Planning"`.
5. **Enter plan mode** — Call `EnterPlanMode`. Use the idea's title, description, priority, tags, and `ideaId` as planning context.
6. **Handoff** — After planning, remind:
   - Use `plan-and-track` skill to create tickets before writing code.
   - Use `mcp__pm-tool__link_idea` to connect the idea to the resulting spec/epic/task.

### Edge Cases

- **Zero ideas** — Report "No pending ideas" and stop. Do not enter plan mode.
- **User cancels selection** — Stop immediately. Do not update idea status.
- **Idea has no description** — Note this during planning; ask clarifying questions.
- **Always include `ideaId`** in plan context so `link_idea` can be called after ticket creation.

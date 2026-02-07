---
description: Update planning documents with new reality
---

# Update Planning Workflow

Keep the `task.md` and `plan.json` in sync with reality.

## Step 1: Gather Status
- **Input**: What did we just finish? What failed?
- **Context**: Read current plan files.

## Step 2: Update Plan
- **Action**: Update the existing implementation plan.
- **Filename**: `docs/ai/planning/[feature-name].md` (target existing file).
- **Task**:
    - Mark completed items with `[x]`.
    - Add new tasks if scope changed.
    - Note blockers or issues.

## Step 3: Handle Blockers
- **Identify**: Is a task blocked?
- **Action**: Add specific blocker tag or dependency note.

## Step 4: Re-estimate
- **Question**: Do remaining tasks need more time/steps?
- **Edit**: Add new sub-tasks if complexity was discovered.

## Step 5: Session Summary
- **Output**: Updated plan diff.
- **Next Actions**: Execute next task.

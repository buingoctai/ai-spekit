---
description: Interactive workflow for executing feature plans
---

# Feature Plan Execution Helper

This workflow guides the agent through the process of taking a planned feature from `docs/ai/planning/` and implementing it task-by-task.

## Step 1: Gather Context
- Ask the user which plan file to execute (e.g., `docs/ai/planning/phase-1-setup.md`).
- Read the content of the selected plan file.
- **Action**: Store the plan execution state in memory.

## Step 2: Load & Validate Plan
- Parse the plan to identify:
    - `[ ]` Open Tasks
    - `[x]` Completed Tasks
    - Dependencies
- **Check**: Are there any blocking dependencies marked as incomplete?

## Step 3: Present Task Queue
- Display a summary of the remaining work to the user.
- **Output Example**: "There are 3 tasks remaining. The next logical task is: 'Implement X'."

## Step 4: Confirm Task
- Propose the next specific task to work on.
- **Action**: Ask user for confirmation to proceed with this specific task.

## Step 2: Implementation Log
- **Action**: Maintain a running log of changes.
- **Filename**: `docs/ai/implementation/[FEATURE-NAME].md`
- **Template Content**:
{{INCLUDE:phases/implementation.md}}
- **Update**: Record each significant change and decision.

## Step 5: Execute Task
- **Mode**: Switch to `EXECUTION`.
- detailed implementation:
    - Create/Modify files.
    - Run necessary terminal commands.
    - **Constraint**: Stick strictly to the task scope.

## Step 6: Verify Task
- **Mode**: Switch to `VERIFICATION`.
- Run relevant tests (unit tests, linting, build checks).
- **Self-Correction**: If verification fails, attempt to fix immediately.

## Step 7: Update Plan
- Mark the task as `[x]` in the definition file (e.g., `docs/ai/planning/phase-1-setup.md`).
- Add any implementation notes or deviation records if necessary.

## Step 8: Loop or Exit
- **Decision**: Are there more tasks?
    - **Yes**: Go back to **Step 3**.
    - **No**: Congratulate the user and exit workflow.

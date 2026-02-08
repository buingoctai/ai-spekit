---
description: Interactive workflow for executing feature plans
---

# Feature Plan Execution Helper

## Step 1: Gather Context
- Ask the user which plan file to execute.
- **Context**: If no file specified, list files in `{{DOCS_PATH}}/planning/`.
- **Action**: Read the content of the selected plan file.

## Step 2: Load & Validate Plan
- Parse the plan to identify `[ ]` Open Tasks.
- **Check**: Are there any blocking dependencies?

## Step 3: Present Task Queue
- Display a summary of the remaining work.

## Step 4: Confirm Task
- Propose the next specific task.
- **Action**: Ask user for confirmation.

## Step 5: Implementation Log
- **Action**: Create or append to `{{DOCS_PATH}}/implementation/[feature-name].md`.
- **Template Content**:
{{INCLUDE:phases/implementation.md}}

## Step 6: Execute Task
- **Mode**: Switch to `EXECUTION`.
- **Constraint**: Stick strictly to the task scope.

## Step 7: Verify Task
- **Mode**: Switch to `VERIFICATION`.
- Run tests/linting.

## Step 8: Update Plan & Loop
- Mark the task as `[x]` in the planning file.
- **Decision**: Are there more tasks? If yes, go to **Step 3**.

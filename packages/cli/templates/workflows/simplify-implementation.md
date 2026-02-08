---
description: Reducer for code complexity
---

# Simplify Implementation Workflow

This workflow refactors code to be cleaner and more maintainable.

## Step 1: Analyze Complexity
- **Input**: target file.
- **Metrics**: Look for long functions (>50 lines), deep nesting, or duplicate logic.

## Step 2: Propose Refactors
- **Strategy**: 
    - Extract helper functions.
    - Create shared utilities.
    - Rename variables for clarity.

## Step 3: Apply Changes
- **Action**: Edit the code safely.
- **Constraint**: Do not change behavior (functional neutrality).

## Step 4: Verify
- **Test**: Run existing tests to ensure no regressions.

## Step 5: Session Summary
- **Output**: Summary of reductions (e.g., "-20 lines").
- **Next Actions**: Recommend running `{{CLI}} execute-plan` for the next task.

---
description: Guide for adding test coverage
---

# Writing Tests Workflow

This workflow guides the creation of unit and integration tests.

## Step 1: Identify Targets
- **Input**: User selects files or functions to test.
- **Context**: Read the implementation code to understand logic.

## Step 2: Scaffold Test File
- **Action**: Create `*.spec.ts` or `*.test.ts`.
- **Imports**: Setup describe/it blocks and import dependencies.

## Step 3: Define Scenarios
- **Happy Path**: Write test for expected behavior.
- **Edge Cases**: Write tests for null inputs, errors, and boundary values.

## Step 4: Run & Refine
- **Execute**: Run `nx test` (or specific test command).
- **Fix**: Adjust test or code until green.

## Step 5: Session Summary
- **Output**: List of new tests added.
- **Next Actions**: Run `check-implementation` to verify overall quality.

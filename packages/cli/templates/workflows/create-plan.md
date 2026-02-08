---
description: Create the initial implementation plan from a design
---

# Create Implementation Plan Workflow

This workflow translates the approved design into a concrete checklist of tasks.

## Step 1: Gather Context
- **Input**: Approved Design Document (e.g., `docs/ai/design/feature-name.md`).
- **Context**: Read the requirement and design documents.

## Step 2: Draft Plan
- **Action**: Create the implementation plan.
- **Filename**: Save as `docs/ai/planning/[feature-name].md` (use lowercase kebab-case).
- **Template Content**:
{{INCLUDE:phases/planning.md}}
- **Fill**: Break down the design into small, testable tasks.

## Step 3: Verify Plan
- **Completeness**: Does it cover all design components?
- **Order**: Are dependencies handled correctly?

## Step 4: Session Summary
- **Output**: Link to the new plan.
- **Next Actions**: Ask user to choose:
    1.  [Recommended] Run `{{CLI}} execute-plan` (Standard path).
    2.  [Fast Track] Run `{{CLI}} writing-test` (Skip execution helper).
    3.  [Custom] Input your own next step.

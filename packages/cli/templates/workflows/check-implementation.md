---
description: Structured review of implementation code
---

# Check Implementation Workflow

This workflow validates that the code matches the plan and design.

## Step 1: Gather Context
- Identify the active feature and its plan.
- **Diff**: Look at local changes to see what was built.

## Step 2: Plan Fidelity
- **Check**: Did we implement all tasks marked as done in the plan?
- **Deviation**: Identify any scope creep or missing requirements.

## Step 3: Code Standards
- **Review**: Check for:
    - Type safety (no `any`).
    - Error handling (try/catch blocks).
    - Hardcoded values (should be config/constants).

## Step 4: Verification Readiness
- **Ask**: Can this be tested right now?
- **Output**: If no tests exist, recommend the `writing-test` workflow.

## Step 5: Session Summary
- **Output**: Pass/Fail assessment.
- **Next Actions**: Ask user to choose:
    1.  [Recommended] Run `{{CLI}} capture-knowledge` (Standard path).
    2.  [Fast Track] Run `{{CLI}} new-requirement` (Loop to next feature).
    3.  [Custom] Input your own next step.

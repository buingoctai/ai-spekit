---
description: General debugging procedure
---

# Debug Workflow

Standard procedure for diagnosing and fixing bugs.

## Step 1: Reproduce
- **Goal**: Create a minimal reproduction case.
- **Action**: Write a failing test or script.

## Step 2: Isolate
- **Binary Search**: Comment out code sections to find the culprit.
- **Logs**: Add strategic console logs or use a debugger.

## Step 3: Hypothesize
- **Theory**: "I think X is causing Y because Z."
- **Validate**: Check assumptions against documentation or code behavior.

## Step 4: Fix
- **Implement**: Apply the correction.
- **Verify**: Run the reproduction case (should pass now).

## Step 5: Session Summary
- **Output**: Root cause analysis.
- **Next Actions**: Recommend running `{{CLI}} writing-test` to add a regression test.

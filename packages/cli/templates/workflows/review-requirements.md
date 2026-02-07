---
description: Systematic review of requirement documents for clarity and feasibility
---

# Review Requirements Workflow

This workflow ensures that product requirements are ready for design and implementation.

## Step 1: Gather Context
- Ask the user which requirement document to review (e.g., in `docs/ai/requirements/`).
- Read the content of the document.
- **Reference**: Check similar existing requirements if available.

## Step 2: Clarity Check
- **Analyze**: Is the "Why" clear? Are User Stories unambiguous?
- **Action**: Highlight vague terms (e.g., "fast", "modern") that need quantification.

## Step 3: Completeness Check
- **Check**: Are Success Criteria defined? Are Constraints listed?
- **Missing Info**: Identify edge cases or error states not covered.

## Step 4: Feasibility Check
- **Technical Reality**: Can this be built with current tech stack?
- **Scope**: Is this too large for a single phase? Suggest splitting if needed.

## Step 5: Session Summary
- **Output**: A bulleted list of:
    - ✅ Approved items
    - ❓ Questions needing answer
    - ⚠️ Risks identified
- **Next Actions**: Ask user to choose:
    1.  [Recommended] Run `review-design` (Standard path).
    2.  [Fast Track] Run `create-plan` (Skip design review).
    3.  [Custom] Input your own next step.

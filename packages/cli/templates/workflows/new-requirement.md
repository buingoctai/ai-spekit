---
description: Process to ingest and structure a new feature request
---

# New Requirement Workflow

This workflow transforms a raw idea into a structured Requirement Document.

## Step 1: Gather Context
- **Input**: Ask user for the raw idea or problem statement.
- **Context**: Search `docs/ai/` to see if this overlaps with existing features.

## Step 2: Socratic Expansion
- **Interview**: Ask 3-5 questions to clarify:
    - Who is the user?
    - What is the core value?
    - What are the constraints?

## Step 3: Draft Structure
- **Action**: Use the following template structure strictly.
- **Filename**: Save as `docs/ai/requirements/[feature-name].md` (use lowercase kebab-case).
- **Template Content**:
{{INCLUDE:phases/requirements.md}}
- **Fill**: Populate the template with gathered info. Do NOT deviate from this structure.

## Step 4: Validating Logic
- **Self-Check**: Read the draft. Does it tell a coherent story?
- **Refine**: Polish wording and ensure consistent terminology.

## Step 5: Session Summary
- **Output**: Link to the new file.
- **Next Actions**: Recommend running `review-requirements` on the new draft.

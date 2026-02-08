---
description: Create a technical design document from requirements
---

# Create Design Workflow

This workflow translates functional requirements into a technical specification.

## Step 1: Gather Context
- **Input**: Approved Requirement Document (e.g., `docs/ai/requirements/feature-name.md`).
- **Context**: Read the requirement to understand the specific needs.

## Step 2: Draft Design
- **Action**: Create the design document.
- **Filename**: Save as `docs/ai/design/[feature-name].md` (use lowercase kebab-case).
- **Template Content**:
{{INCLUDE:phases/design.md}}
- **Fill**: Populate the template with:
    - Architecture Overview
    - Component Diagrams (Mermaid)
    - Data Models
    - API Definitions

## Step 3: Self-Review
- **Completeness**: Did I cover all User Stories?
- **Constraints**: Did I respect the technical constraints?

## Step 4: Session Summary
- **Output**: Link to the new design draft.
- **Next Actions**: Ask user to choose:
    1.  [Recommended] Run `{{CLI}} review-design` (Standard path).
    2.  [Fast Track] Run `{{CLI}} create-plan` (Skip formal design review).
    3.  [Custom] Input your own next step.

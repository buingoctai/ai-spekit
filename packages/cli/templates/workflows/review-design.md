---
description: Technical review of design documents against architecture standards
---

# Review Design Workflow

This workflow validates technical designs before planning begins.

## Step 1: Gather Context
- Ask for the design document (in `docs/ai/design/`) and its parent requirement.
- Read both documents to ensure alignment.


## Step 2: Check Draft
- **Action**: Verify the design document exists.
- **Filename**: `docs/ai/design/[feature-name].md`.


## Step 3: Architecture Alignment
- **Check**: Does this fit the Monorepo structure?
- **Pattern Match**: Are we using established patterns (e.g., Adapters, Agents)?

## Step 4: Scalability & Performance
- **Question**: Will this handle expected load?
- **Data**: Review data models for normalization/optimization issues.

## Step 4: Security Review
- **Scan**: Architecture for potential vulnerabilities (AuthZ, Data Leaks).
- **Compliance**: Check against known security constraints.

## Step 5: Session Summary
- **Output**: Implementation readiness score (1-5).
- **Next Actions**: Ask user to choose:
    1.  [Recommended] Run `create-plan` (Standard path).
    2.  [Fast Track] Run `execute-plan` (Skip planning).
    3.  [Custom] Input your own next step.

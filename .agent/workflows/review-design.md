---
description: Technical review of design documents against architecture standards
---

# Review Design Workflow

This workflow validates technical designs before planning begins.

## Step 1: Gather Context
- Ask for the design document (in `docs/ai/design/`) and its parent requirement.
- Read both documents to ensure alignment.

## Step 2: Architecture Alignment
- **Check**: Does this fit the Monorepo structure?
- **Pattern Match**: Are we using established patterns (e.g., Adapters, Agents)?

## Step 3: Scalability & Performance
- **Question**: Will this handle expected load?
- **Data**: Review data models for normalization/optimization issues.

## Step 4: Security Review
- **Scan**: Architecture for potential vulnerabilities (AuthZ, Data Leaks).
- **Compliance**: Check against known security constraints.

## Step 5: Session Summary
- **Output**: Implementation readiness score (1-5).
- **Next Actions**: Recommend "Proceed to Planning" or specific refactors.

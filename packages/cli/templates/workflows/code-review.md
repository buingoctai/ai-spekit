---
description: Local code review assistant for architectural and security checks
---

# Local Code Review Assistant

This workflow acts as a senior engineer peer-reviewing changes before they are committed.

## Step 1: Gather Context
- Identify the changed files (using `git status` or user input).
- Read the content of the changed files.

## Step 2: Architecture Alignment Check
- **Reference**: Read relevant docs in `docs/ai/design/` or `docs/ai/requirements/`.
- **Question**: Do these changes contradict the established patterns or design documents?
- **Output**: Flag any architectural violations.

## Step 3: Security Scan
- **Check**: detailed inspection for common vulnerabilities:
    - Hardcoded secrets/API keys.
    - Unsanitized inputs.
    - Unsafe type assertions (`as any` usage).
- **Output**: Warning list of potential security risks.

## Step 4: Test Coverage Check
- **Check**: Do the new/modified features have corresponding tests?
- **Action**: If strictly required, verify if `test` files exist nearby or in `__tests__`.

## Step 5: Generate Review Summary
- Compile findings into a structured report:
    - **Summary of Changes**
    - **✅ Approvals** (What looks good)
    - **⚠️ Warnings** (Arch/Security concerns)
    - **❌ Blockers** (Broken tests, critical flaws)

## Step 6: Recommendations
- Provide specific, actionable code snippets to fix found issues.
- Ask user if they want to apply fixes automatically or generic manual fixes.

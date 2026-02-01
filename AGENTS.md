# AI Agents Context & Workflow

## 🧠 Project Context: ai-spekit
**ai-spekit** is a Cognitive Operating System designed to empower the **Software Product Engineer (SPE)**. It bridges the gap between Human Intent (product specs) and AI Execution (code) through a structured, agentic workflow.

### Core Principles
1.  **Intent-Driven:** Everything starts with a structured intent (`.spec`).
2.  **Agentic Execution:** We build tools that allow AI to plan, execute, and verify work autonomously.
3.  **Monorepo Architecture:** We use Nx for scalable, modular development.

## 📂 Documentation Structure
The `docs/ai/` directory is the **primary long-term memory** of this project. Agents must read and write to these folders to maintain context.

-   **`docs/ai/requirements/`**: High-level specificiations, product requirement documents (PRDs), and intent definitions.
-   **`docs/ai/design/`**: Architecture diagrams, data models, and technical design documents (TDDs).
-   **`docs/ai/planning/`**: Task breakdowns, dependency graphs, and implementation plans (`plan.json`, `task.md`).
-   **`docs/ai/implementation/`**: Implementation notes, changelogs, and code-level decision records.
-   **`docs/ai/testing/`**: Test plans, QA reports, and verification logs.

## 🤖 Workflows for Agents

### 1. The Startup Sequence ("Memory Refresh")
**CRITICAL:** When joining the project, you MUST:
1.  **Read `.ai-spekit.json`**: Understand the current version and active phases.
2.  **Read `AGENTS.md`** (this file): Align on context and rules.
3.  **Search Memory**: meaningful keywords in `docs/ai/` to understand recent decisions. \`grep_search\` or \`find_by_name\` are your friends.

### 2. The Planning Workflow
Before writing code:
1.  **Check Requirements**: Look in `docs/ai/requirements/`. Is the goal clear?
2.  **Propose a Plan**: Write to `docs/ai/planning/`. Use standard templates.
3.  **Get Approval**: Do not execute massive changes without a plan review.

### 3. The Coding Workflow
1.  **Style Guide**: Follow the project's TypeScript configuration and ESLint rules strictly.
2.  **Atomic Changes**: Make small, verifiable changes.
3.  **Update Docs**: If you change the architecture, update `docs/ai/design/`.

## 🛠 Tech Stack
-   **Monorepo**: Nx + npm workspaces
-   **Language**: TypeScript (Strict Mode)
-   **Runtime**: Node.js >= 18

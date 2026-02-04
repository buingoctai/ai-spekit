# 🚀 ai-spekit

**The Cognitive Operating System for the Software Product Engineer (SPE)**

**ai-spekit** is an integrated AI toolkit designed to collapse the traditional wall between Product Management and Software Engineering. It empowers a single individual—the **Software Product Engineer**—to move from a raw problem statement to a production-ready solution by bridging the gap between **Human Intent** and **AI Execution**.

---

## 🏗️ Core Architecture

The kit is built on two primary "Engines" that work in a continuous feedback loop:

### 1. The Discovery Engine (The PM Brain)

*Focus: Automating the "Why" and the "What."*

* **Market/Problem Analysis:** Scans context to validate if a feature is worth building.
* **Synthetic Personas:** AI agents that simulate user feedback to stress-test ideas.
* **Spec Generation:** Transforms high-level intent into structured `.spec` files.

### 2. The Execution Engine (The Engineering Heart)

*Focus: Automating the "How."*

* **Architect Agent:** Breaks down the `.spec` file into a granular, atomic `plan.json`.
* **Agentic Coding Loop:** An **Action-Observation-Correction** cycle where the AI writes code, runs local tests/linters, and self-heals until the task is complete.
* **Contextual Documentation:** Automatically links code changes back to the original product goals.

---

## 🛠️ Phase 1 Focus: The Engineering Execution Engine

We are starting with the **Engineering Heart** to provide immediate value for your current development workflow.

* **Input:** You write a structured intent (e.g., `feature.spec`).
* **Planning:** **ai-spekit** maps your codebase and generates a step-by-step implementation plan.
* **Execution:** The kit executes tasks one by one, ensuring each step passes your local build and test suite before moving to the next.

---

## 📈 The SPE Workflow Evolution

> **"From Ticket-Taker to Intent-Driver"**

| Feature | Traditional Workflow | ai-spekit (SPE) Workflow |
| --- | --- | --- |
| **Defining** | Jira tickets & Hand-offs | **Structured Intent (.spec)** |
| **Planning** | Manual task breakdown | **AI-Generated plan.json** |
| **Coding** | Manual implementation | **Agentic Execution Loop** |
| **Testing** | Manual fix-and-run | **Automated Self-Healing** |

---

## 💻 Development

This project is an **Nx Monorepo**.

### Setup
```bash
npm install
```

## 🚀 Installation

### Prerequisites
- **Node.js** (latest LTS recommended)
- **npm** (comes with Node.js)

### Method A: Install via GitHub (For Users)
The easiest way to use `spekit` globally without cloning the repo:

```bash
npm install -g git+https://github.com/buingoctai/ai-spekit.git
```

### Method B: Local Linking (For Developers)
Best for contributors who want to modify the code and see changes instantly:

1. Navigate to the CLI package:
   ```bash
   cd packages/cli
   ```

2. Link the package globally:
   ```bash
   npm link
   ```

> **Usage Note**: Verify installation by running:
> ```bash
> spekit --version
> ```

### Structure
- `packages/cli`: The core orchestrator.
- `packages/execution-engine`: Phase 1 logic core.

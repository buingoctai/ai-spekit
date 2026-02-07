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

### Installation (Local Link)
Since this is a monorepo, the best way to install the CLI globally is to link it from the source:

1. **Install Dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Link the CLI**:
   ```bash
   cd packages/cli
   npm link
   ```

3. **Verify Installation**:
   ```bash
   spekit --version
   ```

> **Note**: This creates a symbolic link. Any changes you make to the code will be immediately reflected in the `spekit` command.

### Structure
- `packages/cli`: The core orchestrator.
- `packages/execution-engine`: Phase 1 logic core.

## 📖 Usage

### Initialization
Initialize a new AI-enhanced project or add AI capabilities to an existing one:

```bash
spekit init --environment gemini
```

**Options:**
- `-e, --environment <env>`: Specify the AI environment (e.g., `gemini`, `cursor`, `claude`).
- `-a, --all`: Initialize all development phases (requirements, design, planning, etc.).
- `-p, --phases <phases>`: Initialize specific phases (comma-separated).

### Generated Structure
Running `spekit init` will create the following structure in your project:

```
.
├── .ai-spekit.json       # Project configuration
├── AGENTS.md             # AI Agent role definitions
├── docs/
│   └── ai/               # Documentation for AI phases
│       ├── requirements/
│       ├── design/
│       └── ...
└── .gemini/              # (If gemini environment selected)
    └── commands/         # Custom Gemini CLI commands
        ├── review-requirements.toml
        ├── code-review.toml
        └── ...
```

### AI Integration
- **Gemini**: The `.gemini/commands` folder contains TOML files that define custom commands for the Gemini CLI. You can use these commands immediately to interact with your project documentation and code.


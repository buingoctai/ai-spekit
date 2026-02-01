import { Command } from 'commander';
import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Config } from '../lib/Config';
import chalk from 'chalk';

export function registerInitCommand(program: Command, config: Config) {
    program.command('init')
        .description('Initialize ai-spekit in the current directory')
        .action(async () => {
            console.log(chalk.blue('🤖 Initializing ai-spekit...'));

            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is the name of your project?',
                    default: path.basename(process.cwd())
                },
                {
                    type: 'checkbox',
                    name: 'environments',
                    message: 'Which environments do you want to support?',
                    choices: ['antigravity', 'local', 'ci'],
                    default: ['antigravity']
                }
            ]);

            // 1. Initialize .ai-spekit.json
            const configState = {
                version: '0.1.0',
                initializedPhases: [],
                environments: answers.environments,
                phases: {},
                context: {
                    projectName: answers.projectName
                }
            };

            await config.save(configState);
            console.log(chalk.green('✔ Initialized .ai-spekit.json'));

            // 2. Setup directory structure
            await fs.ensureDir(path.join(process.cwd(), 'docs/ai'));
            console.log(chalk.green('✔ Created docs/ai directory'));

            // 3. Generate AGENTS.md
            const agentsMdContent = `# Active Intelligence Agents

This file tracks the agents active in this workspace.

## Antigravity (Identity: Core)
- **Role**: Primary Orchestrator
- **Capabilities**: Planning, coding, debugging, verification.
- **Memory**: docs/ai/

## User (Human)
- **Role**: Product Owner / Reviewer
- **Responsibilities**: Design approval, requirement clarification.
`;
            await fs.writeFile(path.join(process.cwd(), 'AGENTS.md'), agentsMdContent);
            console.log(chalk.green('✔ Generated AGENTS.md'));

            console.log(chalk.blue('\nProject initialized successfully! 🚀'));
            console.log('Run `spekit phase start requirements` to begin.');
        });
}

import { Command } from 'commander';
import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Config } from '../lib/Config';
import { TemplateManager, Phase } from '../lib/TemplateManager';
import { AdapterFactory } from '../lib/environments';
import chalk from 'chalk';

export function registerInitCommand(program: Command, config: Config, templateManager: TemplateManager) {
    program.command('init')
        .description('Initialize ai-spekit in the current directory')
        .option('-e, --environment <env>', 'Specify environment (antigravity|gemini|cursor|claude)')
        .option('-a, --all', 'Initialize all phases')
        .option('-p, --phases <phases>', 'Comma-separated list of phases to initialize')
        .action(async (options) => {
            console.log(chalk.blue('🤖 Initializing ai-spekit...'));

            let projectName = path.basename(process.cwd());
            let contexts: string[] = [];
            let docsPath = 'docs/ai';

            // 1. Determine Project Name (skip prompt if we want, but usually init requires it? 
            // For now, let's keep it interactive only if not provided? 
            // The prompt "What is the name of your project?" default is current dir.
            // If user uses flags, maybe they expect less interaction.
            // But let's keep the name prompt or default it if non-interactive mode is implied?
            // The user didn't ask for non-interactive name, just env/phases.
            // Let's assume we still ask for name unless we want to add a flag for it too.
            // For checking "interactive mode", we can look at options.
            
            let targetPhases: Phase[] = [];

            // To be safe and minimal change:
            if (!options.environment && !options.all && !options.phases) {
                 const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: 'What is the name of your project?',
                        default: projectName
                    },
                    {
                        type: 'checkbox',
                        name: 'environments',
                        message: 'Which environments do you want to support?',
                        choices: ['antigravity', 'gemini', 'cursor', 'claude', 'local', 'ci'],
                        default: ['antigravity']
                    },
                    {
                        type: 'input',
                        name: 'docsPath',
                        message: 'Where should documentation be stored?',
                        default: 'docs/ai'
                    },
                    {
                        type: 'checkbox',
                        name: 'phases',
                        message: 'Which phases do you want to initialize now?',
                        choices: ['requirements', 'design', 'planning', 'implementation', 'testing'],
                        default: []
                    }
                ]);
                projectName = answers.projectName;
                contexts = answers.environments;
                docsPath = answers.docsPath;
                targetPhases = answers.phases;
            } else {
                 // Non-interactive / Flag mode for environment
                 if (options.environment) {
                     contexts = options.environment.split(',').map((e: string) => e.trim());
                 } else {
                     // Default if not specified but other flags are
                     contexts = ['antigravity'];
                 }
                 // We accept default project name in this mode to avoid prompt mixing
            }

            // 2. Determine Phases (if not already set by interactive mode)
            if (targetPhases.length === 0) {
                if (options.all) {
                    targetPhases = ['requirements', 'design', 'planning', 'implementation', 'testing'];
                } else if (options.phases) {
                    const pList = options.phases.split(',').map((p: string) => p.trim() as Phase);
                    // valid check?
                    const validPhases: Phase[] = ['requirements', 'design', 'planning', 'implementation', 'testing'];
                    targetPhases = pList.filter((p: Phase) => validPhases.includes(p));
                }
            }

            // 3. Initialize .ai-spekit.json
            const configState = {
                version: '0.1.0',
                docsPath: docsPath,
                initializedPhases: targetPhases, 
                environments: contexts,
                phases: {},
                context: {
                    projectName: projectName
                }
            };

            await config.save(configState);
            console.log(chalk.green('✔ Initialized .ai-spekit.json'));

            // 4. Setup directory structure & Gemini
            const fullDocsPath = path.join(process.cwd(), docsPath);
            await fs.ensureDir(fullDocsPath);
            console.log(chalk.green(`✔ Created ${docsPath} directory`));

            // Create phase directories if requested
            for (const phase of targetPhases) {
                await fs.ensureDir(path.join(fullDocsPath, phase));
                console.log(chalk.green(`✔ Initialized phase directory: ${docsPath}/${phase}`));
            }
            
            // Handle environment-specific setup using AdapterFactory
            const adapters = AdapterFactory.getAdapters(contexts);
            for (const adapter of adapters) {
                console.log(chalk.magenta(`✔ Setting up ${adapter.name} environment...`));
                await adapter.generateCommands(process.cwd(), templateManager.getTemplatesDir(), docsPath);
            }

            // 5. Generate AGENTS.md
            let agentName = 'Antigravity';
            if (contexts.includes('gemini')) agentName = 'Gemini';
            else if (contexts.includes('claude')) agentName = 'Claude';
            else if (contexts.includes('cursor')) agentName = 'Cursor';

            const agentsMdContent = `# Active Intelligence Agents

This file tracks the agents active in this workspace.

## ${agentName} (Identity: Core)
- **Role**: Primary Orchestrator
- **Capabilities**: Planning, coding, debugging, verification.
- **Memory**: ${docsPath}/

## User (Human)
- **Role**: Product Owner / Reviewer
- **Responsibilities**: Design approval, requirement clarification.
`;
            await fs.writeFile(path.join(process.cwd(), 'AGENTS.md'), agentsMdContent);
            console.log(chalk.green('✔ Generated AGENTS.md'));

            console.log(chalk.blue('\nProject initialized successfully! 🚀'));
            if (targetPhases.length === 0) {
                 console.log('Run `spekit phase start requirements` to begin.');
            } else {
                 console.log(`Initialized phases: ${targetPhases.join(', ')}`);
            }
        });
}

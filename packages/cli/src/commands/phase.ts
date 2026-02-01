import { Command } from 'commander';
import inquirer from 'inquirer';
import { Config } from '../lib/Config';
import { TemplateManager, Phase } from '../lib/TemplateManager';
import chalk from 'chalk';

export function registerPhaseCommand(program: Command, config: Config, templateManager: TemplateManager) {
    program.command('phase')
        .description('Manage development phases')
        .argument('<action>', 'Action to perform (start)')
        .argument('[phase]', 'Phase name (requirements, design, planning, implementation, testing)')
        .action(async (action, phase) => {
            if (action !== 'start') {
                console.log(chalk.red(`Unknown action: ${action}. Only 'start' is supported.`));
                return;
            }

            if (!phase) {
                // Interactive phase selection if not provided
                const answer = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'phase',
                        message: 'Which phase do you want to start?',
                        choices: ['requirements', 'design', 'planning', 'implementation', 'testing']
                    }
                ]);
                phase = answer.phase;
            }

            // Check if valid phase
            const validPhases: Phase[] = ['requirements', 'design', 'planning', 'implementation', 'testing'];
            if (!validPhases.includes(phase as Phase)) {
                console.error(chalk.red(`Invalid phase: ${phase}. Must be one of: ${validPhases.join(', ')}`));
                return;
            }

            console.log(chalk.blue(`Starting phase: ${phase}...`));

            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'featureName',
                    message: 'What is the name of the feature/topic?',
                    validate: (input) => input.length > 0 ? true : 'Feature name is required'
                },
                {
                    type: 'input',
                    name: 'filename',
                    message: 'Desired filename?',
                    default: `${phase}.md`
                }
            ]);

            try {
                const filePath = await templateManager.scaffoldDocument(
                    process.cwd(),
                    phase as Phase,
                    answers.featureName,
                    answers.filename
                );

                console.log(chalk.green(`✔ Scaffolding complete: ${filePath}`));

                await config.addInitializedPhase(phase as Phase);
                console.log(chalk.green(`✔ Phase '${phase}' marked as initialized in config.`));

            } catch (e: any) {
                console.error(chalk.red(`Error: ${e.message}`));
            }
        });
}

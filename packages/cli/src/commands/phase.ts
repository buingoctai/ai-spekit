import { Command } from 'commander';
import inquirer from 'inquirer';
import { Config } from '../lib/Config';
import { TemplateManager, Phase } from '../lib/TemplateManager';
import chalk from 'chalk';

export function registerPhaseCommand(program: Command, config: Config, templateManager: TemplateManager) {
    const phaseCommand = program.command('phase')
        .description('Manage development phases');

    phaseCommand.command('start')
        .description('Start a new phase document')
        .argument('[phase]', 'Phase name (requirements, design, planning, implementation, testing)')
        .action(async (phaseArg) => {
            // Load config to get docsPath
            const projectConfig = await config.load();
            if (!projectConfig) {
                console.log(chalk.red('Project not initialized. Run "spekit init" first.'));
                return;
            }

            let phase = phaseArg;
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
                // Pass the docsPath from config
                const filePath = await templateManager.scaffoldDocument(
                    process.cwd(),
                    projectConfig.docsPath,
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

    phaseCommand.command('list')
        .description('List all initialized phases')
        .action(async () => {
            const projectConfig = await config.load();
            if (!projectConfig) {
                console.log(chalk.red('Project not initialized. Run "spekit init" first.'));
                return;
            }

            const phases = projectConfig.initializedPhases;
            if (phases.length === 0) {
                console.log(chalk.yellow('No phases initialized yet.'));
                console.log(chalk.blue('Run "spekit phase start" to begin.'));
            } else {
                console.log(chalk.blue('Initialized phases:'));
                phases.forEach((p) => console.log(chalk.green(`  ✔ ${p}`)));
            }
        });
}

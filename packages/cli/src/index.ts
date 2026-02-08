#!/usr/bin/env node
import { program } from './cli';
import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';

async function main() {
    // Handle dynamic commands from .gemini/commands
    program.on('command:*', async (args) => {
        const commandName = args[0];
        const commandPath = path.join(process.cwd(), '.gemini/commands', `${commandName}.toml`);
        
        if (await fs.pathExists(commandPath)) {
            const content = await fs.readFile(commandPath, 'utf-8');
            // Extract the prompt content between triple quotes
            const promptMatch = content.match(/prompt = """\n([\s\S]+)\n"""/);
            if (promptMatch) {
                const promptBody = promptMatch[1];
                console.log(promptBody);

                // Check for "Next Actions" section to provide interactive selection
                const nextActionsMatch = promptBody.match(/## (?:Step \d+: )?Session Summary[\s\S]*?- \*\*Next Actions\*\*:(?:[\s\S]*?)(?: {4,}\d+\.\s+.*?Run `(.*?)`.*?\n)+/i);
                
                if (nextActionsMatch) {
                    const inquirer = (await import('inquirer')).default;
                    const { spawn } = await import('child_process');

                    // Extract all commands from bullets
                    const actionLines = promptBody.match(/(?: {4,}\d+\.\s+.*?Run `(.*?)`.*?)/g) || [];
                    const options = actionLines.map(line => {
                        const cmdMatch = line.match(/Run `(.*?)`/);
                        const label = line.trim().replace(/^\d+\.\s+/, '');
                        return { name: label, value: cmdMatch ? cmdMatch[1] : null };
                    }).filter(opt => opt.value);

                    if (options.length > 0) {
                        console.log('\n' + chalk.cyan('Suggested Next Actions:'));
                        const { nextAction } = await inquirer.prompt([{
                            type: 'list',
                            name: 'nextAction',
                            message: 'What would you like to do next?',
                            choices: [
                                ...options,
                                { name: 'Exit', value: 'exit' }
                            ]
                        }]);

                        if (nextAction && nextAction !== 'exit') {
                            console.log(chalk.green(`\nExecuting: ${nextAction}\n`));
                            const [cmd, ...cmdArgs] = nextAction.split(' ');
                            
                            // Use npx if it's a local command
                            const fullCmd = cmd === 'npx' ? cmd : 'npx';
                            const fullArgs = cmd === 'npx' ? cmdArgs : [cmd, ...cmdArgs];

                            spawn(fullCmd, fullArgs, { 
                                stdio: 'inherit',
                                shell: true 
                            });
                            return;
                        }
                    }
                }
                process.exit(0);
            }
        }
        
        console.error(chalk.red(`error: unknown command '${commandName}'`));
        process.exit(1);
    });

    await program.parseAsync(process.argv);
}

main().catch((err: Error) => {
    console.error('Error running ai-spekit CLI:', err);
    process.exit(1);
});

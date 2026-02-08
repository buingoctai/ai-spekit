#!/usr/bin/env node
import { program } from './cli';
import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';

async function handleNextActions(promptBody: string) {
    // Check for "Next Actions" section to provide interactive selection
    // Regex matches common patterns: "## Next Actions:", "- **Next Actions**:", etc.
    const nextActionsSection = promptBody.match(/## (?:Step \d+: )?Session Summary[\s\S]*?- \*\*Next Actions\*\*:(?:[\s\S]*?)(?: {2,}\d+\.\s+.*?\n)+/i);
    
    if (nextActionsSection) {
        const inquirer = (await import('inquirer')).default;
        const { spawn } = await import('child_process');

        // Extract all lines that look like commands: "1. [Label] Run `cmd`"
        const actionLines = promptBody.match(/(?: {2,}\d+\.\s+.*?Run `(.*?)`.*?)/g) || [];
        const options = actionLines.map(line => {
            const cmdMatch = line.match(/Run `(.*?)`/);
            const fullCmd = cmdMatch ? cmdMatch[1] : '';
            
            // Extract the descriptive part (e.g., "[Recommended]")
            let prefix = line.trim()
                .replace(/^\d+\.\s+/, '') // Remove "1. "
                .split('Run `')[0]       // Get everything before "Run `"
                .trim();

            // Format the command name (e.g., "create-design" -> "Create Design")
            const cmdName = fullCmd.replace('npx gemini ', '').replace('npx ', '');
            const friendlyCmd = cmdName
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            const label = prefix ? `${prefix} ${friendlyCmd}` : friendlyCmd;

            return { name: label, value: fullCmd || null };
        }).filter(opt => opt.value);

        if (options.length > 0) {
            console.log('\n' + chalk.cyan('Suggested Next Actions:'));
            const { nextAction } = await inquirer.prompt([{
                type: 'list',
                name: 'nextAction',
                message: 'What would you like to do next?',
                choices: [
                    ...options,
                    { name: chalk.yellow('Exit'), value: 'exit' }
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
                return true;
            }
        }
    }
    return false;
}

async function handleDefaultMode() {
    const commandDir = path.join(process.cwd(), '.gemini/commands');
    if (!(await fs.pathExists(commandDir))) {
        return false;
    }

    const files = await fs.readdir(commandDir);
    const workflows = files
        .filter(f => f.endsWith('.toml'))
        .map(f => f.replace('.toml', ''));

    if (workflows.length === 0) return false;

    console.log(chalk.blue('\n🤖 Gemini Workflow Orchestrator'));
    const inquirer = (await import('inquirer')).default;
    const { workflow } = await inquirer.prompt([{
        type: 'list',
        name: 'workflow',
        message: 'Which workflow would you like to run?',
        choices: [
            ...workflows,
            { name: chalk.yellow('Exit'), value: 'exit' }
        ]
    }]);

    if (workflow && workflow !== 'exit') {
        const commandPath = path.join(commandDir, `${workflow}.toml`);
        const content = await fs.readFile(commandPath, 'utf-8');
        const promptMatch = content.match(/prompt = """\n([\s\S]+)\n"""/);
        if (promptMatch) {
            console.log('\n' + promptMatch[1]);
            await handleNextActions(promptMatch[1]);
            return true;
        }
    }
    return true;
}

async function main() {
    // Handle dynamic commands from .gemini/commands
    program.on('command:*', async (args) => {
        const commandName = args[0];
        const commandPath = path.join(process.cwd(), '.gemini/commands', `${commandName}.toml`);
        
        if (await fs.pathExists(commandPath)) {
            const content = await fs.readFile(commandPath, 'utf-8');
            const promptMatch = content.match(/prompt = """\n([\s\S]+)\n"""/);
            if (promptMatch) {
                console.log(promptMatch[1]);
                const handled = await handleNextActions(promptMatch[1]);
                if (!handled) process.exit(0);
                return;
            }
        }
        
        console.error(chalk.red(`error: unknown command '${commandName}'`));
        process.exit(1);
    });

    // If no arguments provided, show the default interactive menu
    if (process.argv.length <= 2) {
        const handled = await handleDefaultMode();
        if (handled) return;
    }

    await program.parseAsync(process.argv);
}

main().catch((err: Error) => {
    console.error('Error running ai-spekit CLI:', err);
    process.exit(1);
});

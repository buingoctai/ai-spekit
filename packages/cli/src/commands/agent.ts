import { Command } from 'commander';
import { AgentManager } from '../lib/AgentManager';
import chalk from 'chalk';

export function registerAgentCommand(program: Command, agentManager: AgentManager) {
    program.command('agent')
        .description('Manage AI agents')
        .option('-l, --list', 'List active agents')
        .action(async (options) => {
            if (options.list) {
                console.log(chalk.blue('Scanning for active agents...'));
                const status = await agentManager.getAggregateStatus();

                if (Object.keys(status).length === 0) {
                    console.log(chalk.yellow('No active agents detected.'));
                } else {
                    console.log(chalk.green('Active Agents:'));
                    console.table(status);
                }
            }
        });
}

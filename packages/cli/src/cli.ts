import { Command } from 'commander';
import { AgentManager } from './lib/AgentManager';
import { Config } from './lib/Config';
import { TemplateManager } from './lib/TemplateManager';
import { registerInitCommand } from './commands/init';
import { registerPhaseCommand } from './commands/phase';
import { registerAgentCommand } from './commands/agent';

const program = new Command();
const agentManager = new AgentManager();
const templateManager = new TemplateManager();
const config = new Config();

program
    .name('spekit')
    .description('Cognitive Operating System for the Software Product Engineer')
    .version('0.1.0');

// Register modular commands
registerInitCommand(program, config);
registerPhaseCommand(program, config, templateManager);
registerAgentCommand(program, agentManager);

export { program };

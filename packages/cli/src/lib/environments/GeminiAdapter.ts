import * as fs from 'fs-extra';
import * as path from 'path';
import { EnvironmentAdapter } from './EnvironmentAdapter';

/**
 * Adapter for Gemini CLI environment.
 * Generates .gemini/commands/*.toml files from workflow templates.
 */
export class GeminiAdapter implements EnvironmentAdapter {
    name = 'gemini';

    async generateCommands(projectRoot: string, templatesDir: string, docsPath: string): Promise<void> {
        const workflowsDir = path.join(templatesDir, 'workflows');
        const commandDir = path.join(projectRoot, '.gemini/commands');
        await fs.ensureDir(commandDir);

        try {
            const files = await fs.readdir(workflowsDir);
            for (const file of files) {
                if (!file.endsWith('.md')) continue;

                let content = await fs.readFile(path.join(workflowsDir, file), 'utf-8');

                // Handle {{INCLUDE:path/to/file}}
                // Path is relative to the `templates` root (parent of workflowsDir)
                content = await this.processIncludes(content, workflowsDir, file);

                // Handle {{CLI}} placeholder - use 'npx spekit' for the internal tool
                content = content.replace(/{{CLI}}/g, 'npx spekit');

                // Handle {{DOCS_PATH}} placeholder - use the configured docs path
                content = content.replace(/{{DOCS_PATH}}/g, docsPath);

                const { description, body } = this.parseFrontMatter(content);
                const commandName = path.basename(file, '.md');

                // Escape backslashes and double quotes for TOML string
                const escapedBody = body
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '\\"');

                const tomlContent = `description = "${description}"\n\nprompt = """\n${escapedBody}\n"""`;

                await fs.writeFile(path.join(commandDir, `${commandName}.toml`), tomlContent);
                console.log(`✔ Generated command: .gemini/commands/${commandName}.toml`);
            }
        } catch (error: any) {
            // If workflows dir doesn't exist or other error, warn but don't fail init hard
            console.warn(`Warning: Failed to generate Gemini commands: ${error.message}`);
        }
    }

    /**
     * Process {{INCLUDE:path/to/file}} placeholders in the content.
     * Collects all matches first, then replaces them to avoid index shifting issues.
     */
    private async processIncludes(content: string, workflowsDir: string, sourceFile: string): Promise<string> {
        const includeRegex = /{{INCLUDE:([\w\-\.\/]+)}}/g;
        const matches: Array<{ fullMatch: string; includePath: string }> = [];
        
        // Collect all matches first
        let match;
        while ((match = includeRegex.exec(content)) !== null) {
            matches.push({
                fullMatch: match[0],
                includePath: match[1]
            });
        }

        // Process each match and build replacement map
        let processedContent = content;
        for (const { fullMatch, includePath } of matches) {
            const fullIncludePath = path.resolve(workflowsDir, '../', includePath);
            
            try {
                const includeContent = await fs.readFile(fullIncludePath, 'utf-8');
                // Use split/join for reliable replacement (handles special regex chars)
                processedContent = processedContent.split(fullMatch).join(includeContent);
            } catch (err: any) {
                console.warn(`Warning: Failed to include template '${includePath}' in '${sourceFile}': ${err.message}`);
                processedContent = processedContent.split(fullMatch).join(`[Error loading include: ${includePath}]`);
            }
        }

        return processedContent;
    }

    /**
     * Parse YAML front matter from markdown content.
     */
    private parseFrontMatter(content: string): { description: string; body: string } {
        const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
        if (match) {
            const frontMatter = match[1];
            const body = match[2];
            const descMatch = frontMatter.match(/description:\s*(.+)/);
            const description = descMatch ? descMatch[1].trim() : '';
            return { description, body: body.trim() };
        }
        return { description: '', body: content.trim() };
    }
}

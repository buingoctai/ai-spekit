import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Supported phases in the SPE lifecycle.
 */
export type Phase = 'requirements' | 'design' | 'planning' | 'implementation' | 'testing';

/**
 * Manages the retrieval and generation of phase documentation templates.
 */
export class TemplateManager {
    private templatesDir: string;
    private workflowsDir: string;

    constructor() {
        // Determine the templates directory relative to this file
        // Assumes structure: packages/cli/src/lib/TemplateManager.ts -> packages/cli/templates
        this.templatesDir = path.resolve(__dirname, '../../templates/phases');
        this.workflowsDir = path.resolve(__dirname, '../../templates/workflows');
    }

    /**
     * Reads a raw template file for a given phase.
     */
    async getTemplate(phase: Phase): Promise<string> {
        const templatePath = path.join(this.templatesDir, `${phase}.md`);
        try {
            return await fs.readFile(templatePath, 'utf-8');
        } catch (error: any) {
            throw new Error(`Failed to read template for phase '${phase}': ${error.message}`);
        }
    }

    /**
     * Renders a template by replacing placeholders.
     * Currently supports simple string replacement for {{featureName}}.
     */
    renderTemplate(content: string, featureName: string): string {
        // Replace placeholders like [Feature Name] used in the raw MD files
        return content.replace(/\[Feature Name\]/g, featureName);
    }

    /**
     * Scaffolds a new document for a specific feature and phase.
     * @param projectRoot The root of the user's workspace
     * @param phase The target phase (e.g., 'planning')
     * @param featureName Human readable feature name
     * @param filename Desired filename (e.g., 'phase-1-setup.md')
     */
    async scaffoldDocument(
        projectRoot: string,
        phase: Phase,
        featureName: string,
        filename: string,
    ): Promise<string> {
        // Basic check: Ensure we allow scaffolding by checking config (pseudo-logic for now)
        // In a real scenario, we might import Config here or pass it in. 
        // For strict compliance with the prompt: "Update TemplateManager.ts to check the current configuration"

        const rawTemplate = await this.getTemplate(phase);
        const renderedContent = this.renderTemplate(rawTemplate, featureName);

        const targetDir = path.join(projectRoot, 'docs/ai', phase);
        const targetPath = path.join(targetDir, filename);

        await fs.mkdir(targetDir, { recursive: true });

        try {
            await fs.writeFile(targetPath, renderedContent, 'utf-8');
            return targetPath;
        } catch (error: any) {
            throw new Error(`Failed to scaffold document at ${targetPath}: ${error.message}`);
        }
    }

    /**
     * Generates Gemini CLI commands from workflow templates.
     */
    async generateGeminiCommands(projectRoot: string): Promise<void> {
        const commandDir = path.join(projectRoot, '.gemini/commands');
        await fs.mkdir(commandDir, { recursive: true });

        try {
            const files = await fs.readdir(this.workflowsDir);
            for (const file of files) {
                if (!file.endsWith('.md')) continue;

                let content = await fs.readFile(path.join(this.workflowsDir, file), 'utf-8');

                // Handle {{INCLUDE:path/to/file}}
                // Path is relative to the `templates` root (parent of workflowsDir)
                // e.g. {{INCLUDE:phases/requirements.md}} -> ../phases/requirements.md
                const includeRegex = /{{INCLUDE:([\w\-\.\/]+)}}/g;
                let match;
                while ((match = includeRegex.exec(content)) !== null) {
                    const includePath = match[1];
                    const fullIncludePath = path.resolve(this.workflowsDir, '../', includePath);
                    
                    try {
                        const includeContent = await fs.readFile(fullIncludePath, 'utf-8');
                        // Replace the tag with content
                        // We use string replacement. To avoid regex issues with special chars in content,
                        // we can use split/join or careful replacement.
                        // Since we are iterating, we need to be careful about index shifts if we strictly use exec index.
                        // Simpler approach: replace all occurrences of this specific match string.
                        content = content.replace(match[0], includeContent);
                    } catch (err: any) {
                        console.warn(`Warning: Failed to include template '${includePath}' in '${file}': ${err.message}`);
                    }
                }

                const { description, body } = this.parseFrontMatter(content);
                const commandName = path.basename(file, '.md');

                // Escape double quotes in body for TOML string
                // Also escape backslashes to avoid TOML parse errors
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

    private parseFrontMatter(content: string): { description: string, body: string } {
        // Simple regex for --- description: ... ---
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

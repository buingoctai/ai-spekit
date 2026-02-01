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

    constructor() {
        // Determine the templates directory relative to this file
        // Assumes structure: packages/cli/src/lib/TemplateManager.ts -> packages/cli/templates
        this.templatesDir = path.resolve(__dirname, '../../templates/phases');
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
        filename: string
    ): Promise<string> {
        const rawTemplate = await this.getTemplate(phase);
        const renderedContent = this.renderTemplate(rawTemplate, featureName);

        const targetDir = path.join(projectRoot, 'docs/ai', phase);
        const targetPath = path.join(targetDir, filename);

        // Ensure directory exists
        await fs.mkdir(targetDir, { recursive: true });

        // Write file (prevent overwrite if exists?)
        // For now, we'll error if it exists to be safe, or we could use an option
        // Simple implementation: Just write
        try {
            // Check if file exists to warn?
            // const exists = await fs.stat(targetPath).then(() => true).catch(() => false);
            // if (exists) { throw new Error('File already exists'); }

            await fs.writeFile(targetPath, renderedContent, 'utf-8');
            return targetPath;
        } catch (error: any) {
            throw new Error(`Failed to scaffold document at ${targetPath}: ${error.message}`);
        }
    }
}

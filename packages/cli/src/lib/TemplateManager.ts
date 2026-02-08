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
     * @param docsPath The configured documentation path (e.g., 'docs/ai')
     * @param phase The target phase (e.g., 'planning')
     * @param featureName Human readable feature name
     * @param filename Desired filename (e.g., 'phase-1-setup.md')
     */
    async scaffoldDocument(
        projectRoot: string,
        docsPath: string,
        phase: Phase,
        featureName: string,
        filename: string,
    ): Promise<string> {
        const rawTemplate = await this.getTemplate(phase);
        const renderedContent = this.renderTemplate(rawTemplate, featureName);

        const targetDir = path.join(projectRoot, docsPath, phase);
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
     * Gets the templates directory path for use by environment adapters.
     */
    getTemplatesDir(): string {
        return path.resolve(this.templatesDir, '..');
    }
}

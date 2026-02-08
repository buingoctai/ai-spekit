/**
 * Interface for environment-specific adapters.
 * Each adapter handles the generation of configuration files and commands
 * for a specific AI development environment (e.g., Gemini, Cursor, Claude).
 */
export interface EnvironmentAdapter {
    /**
     * The name of the environment (e.g., 'gemini', 'cursor', 'claude').
     */
    name: string;

    /**
     * Called during 'init'. Generates specific config/command files for this environment.
     * @param projectRoot The root directory of the user's project
     * @param templatesDir The directory containing workflow templates
     * @param docsPath The configured documentation path (e.g., 'docs/ai')
     */
    generateCommands(projectRoot: string, templatesDir: string, docsPath: string): Promise<void>;
}

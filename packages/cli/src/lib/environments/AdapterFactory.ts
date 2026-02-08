import { EnvironmentAdapter } from './EnvironmentAdapter';
import { GeminiAdapter } from './GeminiAdapter';

/**
 * Registry of available environment adapters.
 */
const adapterRegistry: Record<string, () => EnvironmentAdapter> = {
    gemini: () => new GeminiAdapter(),
    // Future adapters:
    // cursor: () => new CursorAdapter(),
    // claude: () => new ClaudeAdapter(),
    // antigravity: () => new AntigravityAdapter(),
};

/**
 * Factory for creating environment adapters.
 * Uses a registry pattern to make adding new adapters straightforward.
 */
export class AdapterFactory {
    /**
     * Get an adapter instance for the given environment name.
     * @param name Environment name (e.g., 'gemini', 'cursor')
     * @returns The adapter instance, or null if not found
     */
    static getAdapter(name: string): EnvironmentAdapter | null {
        const factory = adapterRegistry[name.toLowerCase()];
        return factory ? factory() : null;
    }

    /**
     * Get all adapters for a list of environment names.
     * Skips environments that don't have adapters.
     * @param names List of environment names
     * @returns Array of adapter instances
     */
    static getAdapters(names: string[]): EnvironmentAdapter[] {
        return names
            .map(name => this.getAdapter(name))
            .filter((adapter): adapter is EnvironmentAdapter => adapter !== null);
    }

    /**
     * Check if an adapter exists for the given environment.
     * @param name Environment name
     */
    static hasAdapter(name: string): boolean {
        return name.toLowerCase() in adapterRegistry;
    }

    /**
     * Get list of supported environment names.
     */
    static getSupportedEnvironments(): string[] {
        return Object.keys(adapterRegistry);
    }
}

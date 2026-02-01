import * as path from 'path';
import { readJson, writeJson } from '../util/file';
import { Phase } from './TemplateManager';

export interface ProjectState {
    version: string;
    initializedPhases: Phase[];
    environments?: string[];
    phases: Record<string, any>;
    context?: any;
}

const CONFIG_FILENAME = '.ai-spekit.json';

export class Config {
    private configPath: string;
    private projectRoot: string;

    constructor(rootPath: string = process.cwd()) {
        this.projectRoot = rootPath;
        this.configPath = path.join(rootPath, CONFIG_FILENAME);
    }

    /**
     * Reads the current configuration.
     * Returns null if config file doesn't exist.
     */
    async load(): Promise<ProjectState | null> {
        try {
            return await readJson<ProjectState>(this.configPath);
        } catch (error) {
            return null;
        }
    }

    /**
     * Writes the configuration to disk.
     */
    async save(state: ProjectState): Promise<void> {
        await writeJson(this.configPath, state);
    }

    /**
     * Checks if a specific phase has been initialized.
     */
    async isPhaseInitialized(phase: Phase): Promise<boolean> {
        const config = await this.load();
        if (!config) return false;
        return config.initializedPhases.includes(phase);
    }

    /**
     * Adds a phase to the initialized list if not present.
     */
    async addInitializedPhase(phase: Phase): Promise<void> {
        const config = await this.load();
        if (!config) throw new Error('Config not loaded');

        if (!config.initializedPhases.includes(phase)) {
            config.initializedPhases.push(phase);
            await this.save(config);
        }
    }
}

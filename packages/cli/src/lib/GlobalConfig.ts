import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';

const GLOBAL_CONFIG_DIR = '.ai-spekit';
const GLOBAL_CONFIG_FILE = 'config.json';

export interface GlobalPreferences {
    defaultModel?: string;
    userName?: string;
}

export class GlobalConfig {
    private configPath: string;

    constructor() {
        this.configPath = path.join(os.homedir(), GLOBAL_CONFIG_DIR, GLOBAL_CONFIG_FILE);
    }

    private async ensureConfigDir(): Promise<void> {
        const dir = path.dirname(this.configPath);
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    async load(): Promise<GlobalPreferences> {
        try {
            const content = await fs.readFile(this.configPath, 'utf-8');
            return JSON.parse(content) as GlobalPreferences;
        } catch {
            return {};
        }
    }

    async save(prefs: GlobalPreferences): Promise<void> {
        await this.ensureConfigDir();
        // Merge with existing
        const current = await this.load();
        const updated = { ...current, ...prefs };
        await fs.writeFile(this.configPath, JSON.stringify(updated, null, 2), 'utf-8');
    }

    async get(key: keyof GlobalPreferences): Promise<any> {
        const config = await this.load();
        return config[key];
    }

    async set(key: keyof GlobalPreferences, value: any): Promise<void> {
        await this.save({ [key]: value });
    }
}

import { Config } from '../lib/Config';
import * as path from 'path';
import * as fs from 'fs-extra';

describe('Config', () => {
    const tmpDir = path.join(__dirname, 'tmp-config-test');
    const configFile = path.join(tmpDir, '.ai-spekit.json');
    let config: Config;

    beforeEach(async () => {
        await fs.ensureDir(tmpDir);
        config = new Config(tmpDir);
    });

    afterEach(async () => {
        await fs.remove(tmpDir);
    });

    it('should return null if config does not exist', async () => {
        const loaded = await config.load();
        expect(loaded).toBeNull();
    });

    it('should save and load config', async () => {
        const initialState = {
            version: '0.1.0',
            initializedPhases: [],
            phases: {}
        };
        await config.save(initialState);

        const loaded = await config.load();
        expect(loaded).toEqual(initialState);
    });

    it('should detect initialized phases', async () => {
        await config.save({
            version: '0.1.0',
            initializedPhases: ['requirements'],
            phases: {}
        });

        const isInit = await config.isPhaseInitialized('requirements');
        expect(isInit).toBe(true);

        const isInitDesign = await config.isPhaseInitialized('design');
        expect(isInitDesign).toBe(false);
    });

    it('should add initialized phase', async () => {
        await config.save({
            version: '0.1.0',
            initializedPhases: [],
            phases: {}
        });

        await config.addInitializedPhase('design');

        const loaded = await config.load();
        expect(loaded?.initializedPhases).toContain('design');
    });
});

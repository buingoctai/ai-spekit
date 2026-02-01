import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getCurrentBranch(cwd: string = process.cwd()): Promise<string> {
    try {
        const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd });
        return stdout.trim();
    } catch (error) {
        throw new Error('Failed to get current git branch');
    }
}

export async function getDiffSummary(cwd: string = process.cwd()): Promise<string> {
    try {
        const { stdout } = await execAsync('git diff --stat', { cwd });
        return stdout;
    } catch (error) {
        return 'Unable to retrieve git diff.';
    }
}

export async function isRepoClean(cwd: string = process.cwd()): Promise<boolean> {
    try {
        const { stdout } = await execAsync('git status --porcelain', { cwd });
        return stdout.trim().length === 0;
    } catch (error) {
        throw new Error('Failed to check git status');
    }
}

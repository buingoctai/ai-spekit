import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

export interface ProcessInfo {
    pid: number;
    command: string;
    cpu?: number;
    memory?: number;
}

/**
 * Lists running processes.
 * Uses `ps` on Unix-like systems.
 */
export async function listProcesses(filter: string = ''): Promise<ProcessInfo[]> {
    try {
        const isWin = os.platform() === 'win32';
        const cmd = isWin
            ? `tasklist /FO CSV /FI "IMAGENAME eq ${filter}*"`
            : `ps -eo pid,pcpu,pmem,command | grep "${filter}" | grep -v grep`;

        const { stdout } = await execAsync(cmd);

        if (isWin) {
            // Basic Windows parsing placeholder
            // TODO: Implement robust CSV parsing for Windows
            return [];
        }

        return stdout
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parseInt(parts[0], 10);
                const cpu = parseFloat(parts[1]);
                const memory = parseFloat(parts[2]);
                const command = parts.slice(3).join(' '); // Reconstruct command with args
                return { pid, cpu, memory, command };
            })
            .filter(p => !isNaN(p.pid));

    } catch (error) {
        // If grep finds nothing it returns exit code 1, which execAsync throws as error
        return [];
    }
}

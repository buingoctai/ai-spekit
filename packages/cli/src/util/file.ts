import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Reads a JSON file and parses it safely.
 */
export async function readJson<T>(filePath: string): Promise<T> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content) as T;
    } catch (error: any) {
        throw new Error(`Failed to read JSON file at ${filePath}: ${error.message}`);
    }
}

/**
 * Writes data to a JSON file safely with formatting.
 */
export async function writeJson<T>(filePath: string, data: T): Promise<void> {
    try {
        const content = JSON.stringify(data, null, 2);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (error: any) {
        throw new Error(`Failed to write JSON file at ${filePath}: ${error.message}`);
    }
}

/**
 * Reads the last N lines of a file.
 * Useful for tailing logs without reading the entire file.
 */
export async function readLastLines(filePath: string, maxLines: number = 50): Promise<string[]> {
    try {
        const handle = await fs.open(filePath, 'r');
        const stats = await handle.stat();
        const size = stats.size;
        const chunkSize = 1024 * 64; // Read 64KB chunks from the end
        let position = size;
        let lines: string[] = [];
        let leftover = '';

        while (position > 0 && lines.length <= maxLines) {
            const readSize = Math.min(chunkSize, position);
            position -= readSize;

            const buffer = Buffer.alloc(readSize);
            await handle.read(buffer, 0, readSize, position);
            const chunk = buffer.toString('utf-8');

            const newLines = (chunk + leftover).split('\n');

            // The first part of the chunk might be an incomplete line if we aren't at the start
            if (position > 0) {
                leftover = newLines.shift() || '';
            } else {
                leftover = '';
            }

            lines = [...newLines, ...lines];
        }

        await handle.close();

        // If we have leftover at start of file
        if (leftover) {
            lines.unshift(leftover);
        }

        // Clean up empty trailing lines often found in logs
        if (lines[lines.length - 1] === '') {
            lines.pop();
        }

        return lines.slice(-maxLines);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

#!/usr/bin/env node
import { program } from './cli';

async function main() {
    await program.parseAsync(process.argv);
}

main().catch((err: Error) => {
    console.error('Error running ai-spekit CLI:', err);
    process.exit(1);
});

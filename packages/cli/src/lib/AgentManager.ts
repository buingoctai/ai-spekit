import { AgentAdapter, AgentType, AgentStatus } from './adapters/AgentAdapter';

/**
 * Orchestrates multiple agents and manages their lifecycle.
 */
export class AgentManager {
    private adapters: Map<string, AgentAdapter> = new Map();

    /**
     * Register a new agent adapter
     */
    registerAdapter(adapter: AgentAdapter): void {
        if (this.adapters.has(adapter.id)) {
            console.warn(`Adapter with ID ${adapter.id} already registered. Overwriting.`);
        }
        this.adapters.set(adapter.id, adapter);
    }

    /**
     * Get an adapter by its ID
     */
    getAdapter(id: string): AgentAdapter | undefined {
        return this.adapters.get(id);
    }

    /**
     * Get all registered adapters
     */
    getAllAdapters(): AgentAdapter[] {
        return Array.from(this.adapters.values());
    }

    /**
     * Check status of all registered agents
     */
    async getAggregateStatus(): Promise<Record<string, AgentStatus>> {
        const statusMap: Record<string, AgentStatus> = {};

        const checks = Array.from(this.adapters.values()).map(async (adapter) => {
            try {
                statusMap[adapter.id] = await adapter.getStatus();
            } catch (error) {
                console.error(`Failed to get status for ${adapter.id}`, error);
                statusMap[adapter.id] = 'unknown';
            }
        });

        await Promise.all(checks);
        return statusMap;
    }
}

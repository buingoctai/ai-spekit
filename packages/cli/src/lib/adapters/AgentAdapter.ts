/**
 * Supported Agent Types in the system
 */
export type AgentType = 'antigravity' | 'local-llm' | 'remote-api';

/**
 * Standardized status for all agents
 */
export type AgentStatus = 'running' | 'waiting' | 'idle' | 'unknown';

/**
 * Interface that all Agent Adapters must implement.
 * This ensures the CLI can communicate with any underlying AI process uniformly.
 */
export interface AgentAdapter {
  /**
   * Unique identifier for the agent adapter instance
   */
  readonly id: string;

  /**
   * The type of agent this adapter connects to
   */
  readonly type: AgentType;

  /**
   * Checks the current health/status of the agent
   */
  getStatus(): Promise<AgentStatus>;

  /**
   * Connects to the agent process
   */
  connect(): Promise<void>;

  /**
   * Disconnects/Teardowns the agent connection
   */
  disconnect(): Promise<void>;
}

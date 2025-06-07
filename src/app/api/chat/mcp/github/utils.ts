import { z } from 'zod';

// INFO: Check https://hub.docker.com/r/mcp/github for more tool names

export const githubMcpToolsSchema = z.enum([
  'create_branch',
  'create_pull_request',
  'get_pull_request',
  'list_pull_requests',
]);

export type GithubMcpTools = z.infer<typeof githubMcpToolsSchema>;
export type GithubToolMapName = Record<GithubMcpTools, string>;

export const githubMcpToolMap: GithubToolMapName = {
  create_branch: 'Creating new branch...',
  create_pull_request: 'Creating pull request...',
  get_pull_request: 'Fetching pull request...',
  list_pull_requests: 'Fetching pull requests...',
};

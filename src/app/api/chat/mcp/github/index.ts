import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { experimental_createMCPClient } from 'ai';

const githubMcpClientPromise = experimental_createMCPClient({
  name: 'github-mcp',
  transport: new StdioClientTransport({
    command: 'docker',
    args: [
      'run',
      '--rm',
      '-i',
      '-e',
      `GITHUB_PERSONAL_ACCESS_TOKEN=${process.env.GITHUB_ACCESS_TOKEN}`,
      'mcp/github:latest',
      'stdio',
    ],
  }),
  onUncaughtError: (err: unknown) => {
    console.error('MCP Client uncaught error:', err);
  },
});

export async function getGithubMcpTools() {
  const githubMcpClient = await githubMcpClientPromise;
  return githubMcpClient.tools();
}

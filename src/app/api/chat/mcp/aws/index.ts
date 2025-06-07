import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { experimental_createMCPClient } from 'ai';

const awsDocsMcpClientPromise = experimental_createMCPClient({
  name: 'aws-docs-mcp',
  transport: new StdioClientTransport({
    command: 'docker',
    args: ['run', '--rm', '-i', 'mcp/aws-documentation:latest', 'stdio'],
  }),
  onUncaughtError: (err: unknown) => {
    console.error('MCP Client uncaught error:', err);
  },
});

export async function getAwsDocsMcpTools() {
  const awsDocsClient = await awsDocsMcpClientPromise;
  return awsDocsClient.tools();
}

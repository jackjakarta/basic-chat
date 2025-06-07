import { z } from 'zod';

export const awsDocsMcpToolsSchema = z.enum([
  'read_documentation',
  'recommend',
  'search_documentation',
]);

export type AwsDocsMcpTools = z.infer<typeof awsDocsMcpToolsSchema>;
export type AwsDocsToolMapName = Record<AwsDocsMcpTools, string>;

export const awsDocsMcpToolMap: AwsDocsToolMapName = {
  read_documentation: 'Reading AWS documentation...',
  recommend: 'Recommending AWS services...',
  search_documentation: 'Searching AWS documentation...',
};

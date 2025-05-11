/* eslint-disable @typescript-eslint/no-explicit-any */
export type NotionSource = {
  type: 'notion';
  id: string;
  name: string;
  link: string;
  content: string;
};

type NotionSearchParams = {
  query?: string;
  filter?: {
    value: 'page' | 'database';
    property: 'object';
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  start_cursor?: string;
  page_size?: number;
};

type NotionSearchResponse = {
  object: string;
  results: Array<NotionObject>;
  next_cursor: string | null;
  has_more: boolean;
};

type NotionObject = {
  object: 'page' | 'database';
  id: string;
  properties: Record<string, any>;
  url: string;
  // Additional fields that might be needed for content extraction
  [key: string]: any;
};

export class NotionSearchClient {
  private readonly access_token: string;
  private readonly baseUrl = 'https://api.notion.com/v1';
  private readonly apiVersion = '2022-06-28';

  constructor(access_token: string) {
    this.access_token = access_token;
  }

  /**
   * Search Notion for pages or databases matching the query
   * @param query The search query
   * @param options Additional search options
   * @returns Promise with array of NotionSource objects
   */
  async search(
    query: string,
    options: {
      filter?: 'page' | 'database';
      sort?: {
        direction: 'ascending' | 'descending';
      };
      limit?: number;
    } = {},
  ): Promise<NotionSource[]> {
    try {
      // Construct search params according to API docs
      const searchParams: NotionSearchParams = {
        query,
        page_size: options.limit || 100,
      };

      // Add filter if specified
      if (options.filter) {
        searchParams.filter = {
          value: options.filter,
          property: 'object',
        };
      }

      // Add sort if specified
      if (options.sort) {
        searchParams.sort = {
          direction: options.sort.direction,
          timestamp: 'last_edited_time',
        };
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.access_token}`,
          'Notion-Version': this.apiVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`Notion API returned: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as NotionSearchResponse;

      // Process and transform the results
      const sources = await Promise.all(
        data.results.map(async (result) => this.convertToSource(result)),
      );

      return sources;
    } catch (error) {
      console.error('Error searching Notion:', error);
      throw new Error(
        `Failed to search Notion: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Convert a Notion API result to a NotionSource
   */
  private async convertToSource(result: NotionObject): Promise<NotionSource> {
    // Extract the title from the page or database
    const name = this.extractTitle(result);

    // Get the content for the page
    const content = await this.fetchPageContent(result.id);

    return {
      type: 'notion',
      id: result.id,
      name,
      link: result.url,
      content,
    };
  }

  /**
   * Extract the title from a Notion page or database object
   */
  private extractTitle(object: NotionObject): string {
    // For pages, title is usually in a property called "title" or "Name"
    if (object.object === 'page') {
      const titleProperty =
        object.properties.title ||
        object.properties.Title ||
        object.properties.Name ||
        object.properties.name;

      if (titleProperty && Array.isArray(titleProperty.title)) {
        return titleProperty.title.map((part: any) => part.plain_text || '').join('');
      }
    }

    // For databases, title is in the title field
    if (object.object === 'database' && object.title) {
      return object.title.map((part: any) => part.plain_text || '').join('');
    }

    return 'Untitled';
  }

  /**
   * Fetch the content of a Notion page
   */
  private async fetchPageContent(pageId: string): Promise<string> {
    try {
      // First, retrieve the block children of the page
      const response = await fetch(`${this.baseUrl}/blocks/${pageId}/children`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.access_token}`,
          'Notion-Version': this.apiVersion,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Extract and concatenate the text content from blocks
      const blocks = data.results;
      return this.extractContentFromBlocks(blocks);
    } catch (error) {
      console.error(`Error fetching content for page ${pageId}:`, error);
      return '';
    }
  }

  /**
   * Extract text content from blocks recursively
   */
  private extractContentFromBlocks(blocks: any[]): string {
    let content = '';

    for (const block of blocks) {
      // Handle different block types
      if (block.type === 'paragraph') {
        content += this.extractRichText(block.paragraph.rich_text) + '\n\n';
      } else if (block.type === 'heading_1') {
        content += `# ${this.extractRichText(block.heading_1.rich_text)}\n\n`;
      } else if (block.type === 'heading_2') {
        content += `## ${this.extractRichText(block.heading_2.rich_text)}\n\n`;
      } else if (block.type === 'heading_3') {
        content += `### ${this.extractRichText(block.heading_3.rich_text)}\n\n`;
      } else if (block.type === 'bulleted_list_item') {
        content += `• ${this.extractRichText(block.bulleted_list_item.rich_text)}\n`;
      } else if (block.type === 'numbered_list_item') {
        content += `1. ${this.extractRichText(block.numbered_list_item.rich_text)}\n`;
      } else if (block.type === 'to_do') {
        const checked = block.to_do.checked ? '[x]' : '[ ]';
        content += `${checked} ${this.extractRichText(block.to_do.rich_text)}\n`;
      } else if (block.type === 'toggle') {
        content += `▶ ${this.extractRichText(block.toggle.rich_text)}\n`;
      } else if (block.type === 'code') {
        content += `\`\`\`${block.code.language || ''}\n${this.extractRichText(block.code.rich_text)}\n\`\`\`\n\n`;
      } else if (block.type === 'quote') {
        content += `> ${this.extractRichText(block.quote.rich_text)}\n\n`;
      } else if (block.type === 'divider') {
        content += '---\n\n';
      } else if (block.type === 'callout') {
        content += `📝 ${this.extractRichText(block.callout.rich_text)}\n\n`;
      } else if (block.type === 'table') {
        // For tables, we'd need to fetch the rows separately
        content += '[Table content]\n\n';
      }

      // If this block has children, recursively extract their content
      if (block.has_children) {
        // In a real implementation, you'd fetch the children blocks here
        // For simplicity, we'll just add a placeholder
        content += '[Nested content]\n\n';
      }
    }

    return content.trim();
  }

  private extractRichText(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) {
      return '';
    }

    return richText.map((text) => text.plain_text || '').join('');
  }
}

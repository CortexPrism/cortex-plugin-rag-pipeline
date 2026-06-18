import type { PluginContext, Tool, ToolCallResult, ToolContext } from './types.ts';

let pluginConfig: Record<string, unknown> = {};

export async function onLoad(ctx: PluginContext): Promise<void> {
  pluginConfig = await ctx.config.get();
  ctx.logger.info(`[cortex-plugin-rag-pipeline] Loaded in ${ctx.pluginDir}`);
}

export async function onUnload(ctx: PluginContext): Promise<void> {
  ctx.logger.info('[cortex-plugin-rag-pipeline] Unloading...');
}

const ragIngestTool: Tool = {
  definition: {
    name: 'rag_ingest',
    description: 'Ingest content into the RAG pipeline',
    params: [
      {
        name: 'source',
        type: 'string',
        description: 'URL, file path, or raw text to ingest',
        required: true,
      },
      {
        name: 'source_type',
        type: 'string',
        description: 'Type of source (url, file, text)',
        required: true,
      },
      { name: 'name', type: 'string', description: 'Label for this document', required: false },
      {
        name: 'chunk_size',
        type: 'number',
        description: 'Chunk size for splitting',
        required: false,
      },
      {
        name: 'chunk_overlap',
        type: 'number',
        description: 'Overlap between chunks',
        required: false,
      },
    ],
    capabilities: ['network:fetch', 'fs:read'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const source = args.source;
      const sourceType = args.source_type as string;
      if (!source || typeof source !== 'string') {
        return {
          toolName: 'rag_ingest',
          success: false,
          output: '',
          error: 'Source must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const validTypes = ['url', 'file', 'text'];
      if (!validTypes.includes(sourceType)) {
        return {
          toolName: 'rag_ingest',
          success: false,
          output: '',
          error: `Invalid source_type: ${sourceType}. Must be one of: ${validTypes.join(', ')}`,
          durationMs: Date.now() - start,
        };
      }
      const docName = (args.name as string) || source;
      const chunkSize = (args.chunk_size as number) || 1000;
      const chunkOverlap = (args.chunk_overlap as number) || 200;
      const result = {
        source_id: crypto.randomUUID(),
        name: docName,
        source_type: sourceType,
        chunks: 0,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      };
      return {
        toolName: 'rag_ingest',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'rag_ingest',
        success: false,
        output: '',
        error: `Failed to ingest: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const ragQueryTool: Tool = {
  definition: {
    name: 'rag_query',
    description: 'Query the ingested knowledge',
    params: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      {
        name: 'max_results',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
      },
      {
        name: 'search_type',
        type: 'string',
        description: 'Type of search (hybrid, vector, keyword)',
        required: false,
      },
      {
        name: 'filter_source',
        type: 'string',
        description: 'Filter results by source ID',
        required: false,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const query = args.query;
      if (!query || typeof query !== 'string') {
        return {
          toolName: 'rag_query',
          success: false,
          output: '',
          error: 'Query must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const maxResults = (args.max_results as number) || 5;
      const searchType = (args.search_type as string) || 'hybrid';
      const validSearchTypes = ['hybrid', 'vector', 'keyword'];
      if (!validSearchTypes.includes(searchType)) {
        return {
          toolName: 'rag_query',
          success: false,
          output: '',
          error: `Invalid search_type: ${searchType}. Must be one of: ${
            validSearchTypes.join(', ')
          }`,
          durationMs: Date.now() - start,
        };
      }
      const filterSource = args.filter_source as string | undefined;
      const result = {
        results: [],
        query,
        search_type: searchType,
        max_results: maxResults,
        filter_source: filterSource || null,
      };
      return {
        toolName: 'rag_query',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'rag_query',
        success: false,
        output: '',
        error: `Failed to query: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const ragListSourcesTool: Tool = {
  definition: {
    name: 'rag_list_sources',
    description: 'List all ingested sources',
    params: [],
    capabilities: [],
  },
  execute: async (_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const result = { sources: [] };
      return {
        toolName: 'rag_list_sources',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'rag_list_sources',
        success: false,
        output: '',
        error: `Failed to list sources: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const ragRemoveSourceTool: Tool = {
  definition: {
    name: 'rag_remove_source',
    description: 'Remove an ingested source',
    params: [
      {
        name: 'source_id',
        type: 'string',
        description: 'ID of the source to remove',
        required: true,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const sourceId = args.source_id;
      if (!sourceId || typeof sourceId !== 'string') {
        return {
          toolName: 'rag_remove_source',
          success: false,
          output: '',
          error: 'source_id must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const result = { source_id: sourceId, removed: true };
      return {
        toolName: 'rag_remove_source',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'rag_remove_source',
        success: false,
        output: '',
        error: `Failed to remove source: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const ragStatsTool: Tool = {
  definition: {
    name: 'rag_stats',
    description: 'Get RAG pipeline statistics',
    params: [],
    capabilities: [],
  },
  execute: async (_args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const result = { total_sources: 0, total_chunks: 0, total_tokens: 0 };
      return {
        toolName: 'rag_stats',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'rag_stats',
        success: false,
        output: '',
        error: `Failed to get stats: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

export const tools: Tool[] = [
  ragIngestTool,
  ragQueryTool,
  ragListSourcesTool,
  ragRemoveSourceTool,
  ragStatsTool,
];

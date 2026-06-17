# cortex-plugin-rag-pipeline

Pluggable RAG: ingest PDFs/websites/codebases into vector store, query with hybrid search.

## Installation

```bash
cortex plugin install marketplace:cortex-plugin-rag-pipeline
cortex plugin install github:CortexPrism/cortex-plugin-rag-pipeline
cortex plugin install ./manifest.json
```

## Tools

### rag_ingest

Ingest content into the RAG pipeline.

**Parameters:**

- `source` (string, required) — URL, file path, or raw text
- `source_type` (string, required) — url, file, text
- `name` (string, optional) — Label for this document
- `chunk_size` (number, optional, default 1000) — Chunk size
- `chunk_overlap` (number, optional, default 200) — Overlap between chunks

### rag_query

Query the ingested knowledge.

**Parameters:**

- `query` (string, required) — Search query
- `max_results` (number, optional, default 5) — Maximum results
- `search_type` (string, optional, default "hybrid") — hybrid, vector, keyword
- `filter_source` (string, optional) — Filter by source ID

### rag_list_sources

List all ingested sources.

### rag_remove_source

Remove an ingested source.

**Parameters:**

- `source_id` (string, required) — Source ID to remove

### rag_stats

Get RAG pipeline statistics (total sources, chunks, tokens).

## Configuration

```json
{
  "plugins": {
    "cortex-plugin-rag-pipeline": {
      "enabled": true,
      "config": {
        "vectorStore": "memory",
        "qdrantUrl": "",
        "pineconeApiKey": "",
        "defaultChunkSize": 1000,
        "defaultMaxResults": 5
      }
    }
  }
}
```

## Capabilities

- `tools` — Provides tool implementations
- `network:fetch` — Fetches content from URLs
- `fs:read` — Reads files from the filesystem

## License

MIT — See LICENSE file

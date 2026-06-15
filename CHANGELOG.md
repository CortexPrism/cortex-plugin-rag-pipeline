# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

## [1.0.0] — 2026-06-15

### Added
- Initial release of cortex-plugin-rag-pipeline
- `rag_ingest` tool — Ingest URLs, files, or text into vector store
- `rag_query` tool — Hybrid/vector/keyword search over ingested knowledge
- `rag_list_sources` tool — List all ingested sources
- `rag_remove_source` tool — Remove ingested sources by ID
- `rag_stats` tool — Pipeline statistics (sources, chunks, tokens)

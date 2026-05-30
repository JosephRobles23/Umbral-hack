export interface DocChunk {
  id: string;
  docId: string;
  content: string;
  embedding: number[];
  sourceDocNode: string;
  createdAt: string;
}

export interface DocEmbeddingIndex {
  upsert(chunk: DocChunk): void;
  query(embedding: number[], topK: number): { chunk: DocChunk; distance: number }[];
  purge(docId: string): void;
}

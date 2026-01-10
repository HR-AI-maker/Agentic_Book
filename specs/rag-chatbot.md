# Specification: RAG Chatbot

**Feature Branch**: `main`
**Created**: 2026-01-10
**Status**: Draft

## Intent

Build a Retrieval-Augmented Generation (RAG) chatbot that answers questions about the textbook content, including context-specific questions based on user-selected text.

## Architecture

```
User Question -> FastAPI Backend ->
  1. Generate embedding (OpenAI)
  2. Search similar chunks (Qdrant)
  3. Retrieve relevant content
  4. Generate answer (OpenAI GPT)
  5. Return response with citations
```

## Technical Stack

- **Backend**: FastAPI (Python)
- **Vector DB**: Qdrant Cloud (Free Tier)
- **Embeddings**: OpenAI text-embedding-3-small
- **LLM**: OpenAI GPT-4o-mini
- **Database**: Neon Serverless Postgres (user data, chat history)

## API Endpoints

### POST /api/chat
Ask a question to the chatbot.

**Request**:
```json
{
  "question": "What is ROS 2?",
  "context": "optional selected text",
  "user_id": "optional user id"
}
```

**Response**:
```json
{
  "answer": "ROS 2 is...",
  "sources": [
    {"chapter": "1.2", "title": "ROS 2 Architecture", "relevance": 0.92}
  ],
  "message_id": "uuid"
}
```

### POST /api/chat/feedback
Rate a chatbot response.

**Request**:
```json
{
  "message_id": "uuid",
  "rating": "helpful" | "not_helpful",
  "feedback": "optional text"
}
```

### GET /api/chat/history
Get chat history for authenticated user.

### POST /api/ingest
Ingest textbook content into vector database (admin only).

## Data Pipeline

### Content Ingestion
1. Parse MDX files from textbook
2. Split into chunks (500 tokens with 50 token overlap)
3. Generate embeddings for each chunk
4. Store in Qdrant with metadata (chapter, section, page)

### Query Processing
1. Generate embedding for user question
2. If context provided, combine question + context
3. Search Qdrant for top 5 similar chunks
4. Build prompt with retrieved context
5. Generate response with GPT-4o-mini
6. Return answer with source citations

## Constraints

- Response time < 5 seconds
- Max context window: 4000 tokens
- Store chat history for authenticated users only
- Rate limit: 20 requests/minute per IP

## Edge Cases

- No relevant content found -> "I don't have information about that in the textbook"
- Question too long -> Truncate to 500 characters
- OpenAI API error -> Graceful fallback with retry
- Qdrant unavailable -> Return error with helpful message

## Success Criteria

- 90% of questions answered with relevant content
- Average response time < 3 seconds
- User can ask follow-up questions with context
- Sources cited in every response

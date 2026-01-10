# Plan: Physical AI & Humanoid Robotics Textbook

## Strategy / Outline

Build a comprehensive textbook platform with integrated RAG chatbot using:
1. **Next.js 14** for the frontend (App Router, MDX support)
2. **FastAPI** for the backend API (RAG, auth, personalization)
3. **Qdrant Cloud** for vector storage (embeddings)
4. **Neon Postgres** for relational data (users, chat history)
5. **Better-auth** for authentication
6. **Vercel** for deployment

## Phase 1: Foundation (Core Requirements - 100 points)

| Task Name | Description / Output |
|-----------|---------------------|
| Setup Next.js project | Initialize Next.js 14 with App Router, TypeScript, Tailwind |
| Create book layout | Navigation, sidebar, chapter pages |
| Write Module 1 content | ROS 2 fundamentals (4 chapters) |
| Write Module 2 content | Gazebo & Unity (3 chapters) |
| Write Module 3 content | NVIDIA Isaac (4 chapters) |
| Write Module 4 content | VLA & Capstone (4 chapters) |
| Setup FastAPI backend | Project structure, CORS, environment |
| Implement RAG pipeline | Embeddings, Qdrant, retrieval |
| Create chat endpoint | POST /api/chat with streaming |
| Integrate chatbot UI | Floating chat widget in Next.js |
| Setup Neon Postgres | Database schema, connection |
| Content ingestion | Index all chapters into Qdrant |
| Deploy to Vercel | Frontend + API functions |

## Phase 2: Authentication (Bonus - 50 points)

| Task Name | Description / Output |
|-----------|---------------------|
| Setup Better-auth | Install and configure |
| Create signup flow | Email registration with background questions |
| Create login flow | Email/password authentication |
| User profile page | Display user info and preferences |
| Persist chat history | Store conversations for logged users |

## Phase 3: Personalization (Bonus - 50 points)

| Task Name | Description / Output |
|-----------|---------------------|
| Personalization API | Endpoint to customize content |
| Personalize button UI | Add to chapter pages |
| Content generation | Use GPT to adjust content based on level |
| Cache personalized content | Store for faster retrieval |

## Phase 4: Translation (Bonus - 50 points)

| Task Name | Description / Output |
|-----------|---------------------|
| Translation API | Endpoint to translate content |
| Urdu button UI | Add to chapter pages |
| Translation generation | Use GPT for Urdu translation |
| RTL support | Right-to-left layout for Urdu |

## Dependencies

### External Services
- OpenAI API (embeddings + chat)
- Qdrant Cloud (vector database)
- Neon (serverless Postgres)
- Vercel (deployment)

### Skills/Templates
- `chapter-writer` - Generate technical content
- `code-example` - Create working code snippets
- `rag-pipeline` - Build retrieval pipeline

## Architecture Decisions

### ADR-001: Next.js over Docusaurus
- **Decision**: Use Next.js instead of Docusaurus
- **Rationale**: Better integration with FastAPI, more flexibility for custom features
- **Trade-offs**: More setup work, but better control

### ADR-002: Qdrant over Pinecone
- **Decision**: Use Qdrant Cloud free tier
- **Rationale**: Free tier sufficient, open-source, easy setup
- **Trade-offs**: Limited storage on free tier

### ADR-003: Monorepo Structure
- **Decision**: Single repo with frontend/ and backend/ directories
- **Rationale**: Easier deployment to Vercel, shared types
- **Trade-offs**: Larger repo size

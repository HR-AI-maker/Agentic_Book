# Constitution: Physical AI & Humanoid Robotics Textbook

## Quality Standards

- **Tone/Style**: Technical-academic, professional, accessible to students with programming background
- **Evidence/Proof**: All technical concepts supported by code examples and official documentation references
- **Structure**: Logical flow following course curriculum (4 modules, 13 weeks)
- **Clarity**: Accessible to students with basic Python/programming knowledge
- **Size/Scope**: Comprehensive textbook covering ROS 2, Gazebo, NVIDIA Isaac, VLA
- **Citation/Documentation**: IEEE-style citations, inline code comments, API documentation links

## Principles

### I. Spec-Driven Development
- Follow spec-driven workflow: Spec -> Plan -> Tasks -> Implement
- All features documented before implementation
- Validate outputs against constitution standards

### II. Modular Architecture
- Frontend (Next.js) and Backend (FastAPI) are independently deployable
- RAG chatbot is a separate service integrated via API
- Book content is structured as MDX for maximum flexibility

### III. Test-First Approach
- API endpoints have integration tests
- Frontend components have unit tests
- RAG responses validated against source content

### IV. User-Centric Design
- Content personalized based on user background (software/hardware experience)
- Support for Urdu translation for accessibility
- RAG chatbot provides contextual help

### V. Performance & Scalability
- Serverless deployment on Vercel for auto-scaling
- Vector search via Qdrant Cloud (free tier)
- Postgres via Neon Serverless for user data

### VI. Security
- Authentication via Better-auth
- API keys stored in environment variables
- No hardcoded secrets

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+ | Book interface, SSR, App Router |
| Backend | FastAPI | RAG API, user management |
| Database | Neon Postgres | User data, preferences |
| Vector DB | Qdrant Cloud | Embeddings for RAG |
| Auth | Better-auth | User authentication |
| AI | OpenAI API | Embeddings, chat completions |
| Deployment | Vercel | Frontend + Serverless functions |

## Development Workflow

1. Create specification for each feature
2. Break down into atomic tasks
3. Implement with tests
4. Validate against acceptance criteria
5. Deploy and verify

## Governance

- Constitution supersedes all other practices
- Changes require documentation and approval
- All PRs must verify compliance with quality standards

**Version**: 1.0.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-10

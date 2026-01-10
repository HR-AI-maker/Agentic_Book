# Tasks / Atomic Work Units

## Phase 1: Core Implementation

### Task 1: Initialize Next.js Frontend
- **Input**: Project requirements
- **Output**: Next.js 14 project with TypeScript, Tailwind CSS, App Router
- **Completion Criteria**:
  - `npm run dev` starts successfully
  - Basic page renders at localhost:3000
- **Commands**:
  ```bash
  npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
  ```

### Task 2: Create Book Layout Components
- **Input**: Design requirements
- **Output**: Layout components (Header, Sidebar, ChapterLayout, Footer)
- **Completion Criteria**:
  - Navigation between modules works
  - Sidebar shows chapter list
  - Responsive design on mobile

### Task 3: Write Module 1 Content (ROS 2)
- **Input**: Course curriculum, research
- **Output**: 4 MDX chapters for Module 1
- **Completion Criteria**:
  - Chapter 1.1: Introduction to Physical AI
  - Chapter 1.2: ROS 2 Architecture
  - Chapter 1.3: Building ROS 2 Packages
  - Chapter 1.4: URDF for Humanoids
  - Each chapter 2000-4000 words with code examples

### Task 4: Write Module 2 Content (Gazebo & Unity)
- **Input**: Course curriculum, research
- **Output**: 3 MDX chapters for Module 2
- **Completion Criteria**:
  - Chapter 2.1: Gazebo Simulation
  - Chapter 2.2: Sensor Simulation
  - Chapter 2.3: Unity for Visualization
  - Code examples for each section

### Task 5: Write Module 3 Content (NVIDIA Isaac)
- **Input**: Course curriculum, research
- **Output**: 4 MDX chapters for Module 3
- **Completion Criteria**:
  - Chapter 3.1: Isaac Sim
  - Chapter 3.2: Isaac ROS
  - Chapter 3.3: Navigation with Nav2
  - Chapter 3.4: Sim-to-Real Transfer

### Task 6: Write Module 4 Content (VLA)
- **Input**: Course curriculum, research
- **Output**: 4 MDX chapters for Module 4
- **Completion Criteria**:
  - Chapter 4.1: Voice-to-Action
  - Chapter 4.2: Cognitive Planning
  - Chapter 4.3: Multi-Modal Interaction
  - Chapter 4.4: Capstone Project Guide

### Task 7: Initialize FastAPI Backend
- **Input**: API requirements
- **Output**: FastAPI project with proper structure
- **Completion Criteria**:
  - `uvicorn main:app` starts successfully
  - CORS configured for frontend
  - Environment variables setup
- **Commands**:
  ```bash
  mkdir backend && cd backend
  pip install fastapi uvicorn python-dotenv
  ```

### Task 8: Setup Qdrant Cloud
- **Input**: Qdrant Cloud account
- **Output**: Collection for textbook embeddings
- **Completion Criteria**:
  - Qdrant cluster created
  - Collection created with proper dimensions (1536 for text-embedding-3-small)
  - Connection tested from backend

### Task 9: Implement RAG Pipeline
- **Input**: Qdrant setup, OpenAI API
- **Output**: Working RAG module
- **Completion Criteria**:
  - Content chunking function
  - Embedding generation function
  - Similarity search function
  - Answer generation function

### Task 10: Create Chat API Endpoint
- **Input**: RAG pipeline
- **Output**: POST /api/chat endpoint
- **Completion Criteria**:
  - Accepts question and optional context
  - Returns answer with sources
  - Error handling for API failures

### Task 11: Build Chat UI Component
- **Input**: Design requirements
- **Output**: React chat widget
- **Completion Criteria**:
  - Floating chat button
  - Chat panel with message history
  - Text selection for context
  - Loading states

### Task 12: Setup Neon Postgres
- **Input**: Neon account
- **Output**: Database with schema
- **Completion Criteria**:
  - Database created
  - Users table
  - Chat messages table
  - Connection pool configured

### Task 13: Content Ingestion Script
- **Input**: MDX chapters
- **Output**: All content indexed in Qdrant
- **Completion Criteria**:
  - All chapters parsed and chunked
  - Embeddings generated
  - Stored in Qdrant with metadata

### Task 14: Deploy to Vercel
- **Input**: Complete application
- **Output**: Live URL
- **Completion Criteria**:
  - Frontend deployed
  - API routes working
  - Environment variables configured
  - Custom domain (optional)

---

## Phase 2: Authentication (Bonus)

### Task 15: Setup Better-auth
- **Input**: Better-auth docs
- **Output**: Auth configuration
- **Completion Criteria**:
  - Better-auth installed
  - Email provider configured
  - Session management working

### Task 16: Create Auth UI
- **Input**: Design requirements
- **Output**: Login/Signup pages
- **Completion Criteria**:
  - Signup form with background questions
  - Login form
  - Protected routes

---

## Phase 3: Personalization (Bonus)

### Task 17: Personalization API
- **Input**: User background data
- **Output**: POST /api/personalize endpoint
- **Completion Criteria**:
  - Accepts chapter content and user level
  - Returns personalized content
  - Caches results

### Task 18: Personalize UI
- **Input**: Design requirements
- **Output**: Personalize button on chapters
- **Completion Criteria**:
  - Button visible for logged users
  - Content updates on click
  - Loading state

---

## Phase 4: Translation (Bonus)

### Task 19: Translation API
- **Input**: Chapter content
- **Output**: POST /api/translate endpoint
- **Completion Criteria**:
  - Accepts content and target language
  - Returns translated text
  - Caches results

### Task 20: Translation UI
- **Input**: Design requirements
- **Output**: Translate button on chapters
- **Completion Criteria**:
  - Button for Urdu translation
  - RTL layout support
  - Toggle back to English

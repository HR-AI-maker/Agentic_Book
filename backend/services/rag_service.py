"""
RAG Service - Retrieval Augmented Generation for textbook content
Uses fastembed for local embeddings (no API needed)
"""

import os
import uuid
from typing import Optional, List, Dict
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from fastembed import TextEmbedding


class RAGService:
    def __init__(self):
        self._groq_client = None
        self._qdrant_client = None
        self._embedding_model = None
        self.collection_name = "textbook_content"
        self.chat_model = "llama-3.3-70b-versatile"
        self.embedding_dimension = 384  # all-MiniLM-L6-v2 dimension

    @property
    def embedding_model(self):
        """Local embedding model using fastembed"""
        if self._embedding_model is None:
            self._embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        return self._embedding_model

    @property
    def groq_client(self):
        """Groq client for chat completions (free, fast)"""
        if self._groq_client is None:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY environment variable is required")
            self._groq_client = OpenAI(
                api_key=api_key,
                base_url="https://api.groq.com/openai/v1"
            )
        return self._groq_client

    @property
    def qdrant_client(self):
        if self._qdrant_client is None:
            qdrant_url = os.getenv("QDRANT_URL")
            qdrant_api_key = os.getenv("QDRANT_API_KEY")

            if qdrant_url and qdrant_api_key:
                self._qdrant_client = QdrantClient(
                    url=qdrant_url,
                    api_key=qdrant_api_key
                )
            else:
                # Use in-memory for local development
                self._qdrant_client = QdrantClient(":memory:")

            # Ensure collection exists
            self._ensure_collection()
        return self._qdrant_client

    def _ensure_collection(self):
        """Create collection if it doesn't exist"""
        try:
            collections = self._qdrant_client.get_collections().collections
            if not any(c.name == self.collection_name for c in collections):
                self._qdrant_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.embedding_dimension,
                        distance=Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Error ensuring collection: {e}")

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using local fastembed model"""
        embeddings = list(self.embedding_model.embed([text]))
        return embeddings[0].tolist()

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts efficiently"""
        embeddings = list(self.embedding_model.embed(texts))
        return [emb.tolist() for emb in embeddings]

    def search_similar(self, query: str, limit: int = 3) -> List[Dict]:
        """Search for similar content in Qdrant"""
        try:
            query_embedding = self.generate_embedding(query)

            results = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit
            )

            return [
                {
                    "content": hit.payload.get("content", ""),
                    "chapter": hit.payload.get("chapter", ""),
                    "title": hit.payload.get("title", ""),
                    "relevance": hit.score
                }
                for hit in results
            ]
        except Exception as e:
            print(f"Error searching: {e}")
            return []

    async def get_answer(
        self,
        question: str,
        context: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Dict:
        """
        Get answer using RAG pipeline:
        1. Search for relevant content in Qdrant
        2. Build context from retrieved chunks
        3. Generate answer using Groq LLM
        """
        # Search for relevant content
        relevant_chunks = self.search_similar(question)

        # Build context from retrieved chunks
        if relevant_chunks:
            context_text = "\n\n".join([
                f"[Chapter {chunk['chapter']} - {chunk['title']}]\n{chunk['content']}"
                for chunk in relevant_chunks
            ])

            system_prompt = """You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
Answer questions based on the provided context from the textbook.
If the context contains relevant information, use it to provide accurate answers.
Always cite which chapter your information comes from when applicable.
If the context doesn't contain relevant information, provide your best knowledge but mention it's general knowledge."""

            user_prompt = f"""Context from textbook:
{context_text}

User question: {question}

{"Additional context from user: " + context if context else ""}

Please provide a helpful, accurate answer based on the textbook content."""
        else:
            # Fallback to general knowledge if no relevant content found
            system_prompt = """You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
You are an expert in robotics, AI, machine learning, computer vision, and humanoid robots.
Provide clear, educational, and accurate answers about physical AI and robotics topics."""

            user_prompt = question
            if context:
                user_prompt = f"Context: {context}\n\nQuestion: {question}"

        response = self.groq_client.chat.completions.create(
            model=self.chat_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        answer = response.choices[0].message.content

        # Format sources
        sources = [
            {
                "chapter": chunk["chapter"],
                "title": chunk["title"],
                "relevance": round(chunk["relevance"], 2)
            }
            for chunk in relevant_chunks
        ]

        return {
            "answer": answer,
            "sources": sources,
            "message_id": str(uuid.uuid4())
        }

    def ingest_content(self, chunks: List[Dict]) -> int:
        """
        Ingest textbook content into Qdrant.
        Each chunk should have: content, chapter, title
        """
        if not chunks:
            return 0

        # Generate embeddings in batch for efficiency
        texts = [chunk["content"] for chunk in chunks]
        embeddings = self.generate_embeddings_batch(texts)

        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            points.append(PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "content": chunk["content"],
                    "chapter": chunk.get("chapter", ""),
                    "title": chunk.get("title", ""),
                }
            ))

        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )

        return len(points)

    def get_collection_info(self) -> Dict:
        """Get information about the current collection"""
        try:
            info = self.qdrant_client.get_collection(self.collection_name)
            return {
                "name": self.collection_name,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count
            }
        except Exception as e:
            return {"error": str(e)}

"""
RAG Service - Retrieval Augmented Generation for textbook content
"""

import os
import uuid
from typing import Optional, List, Dict
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

class RAGService:
    def __init__(self):
        self._groq_client = None
        self._qdrant_client = None
        self.collection_name = "textbook_content"
        self.chat_model = "llama-3.3-70b-versatile"

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
                        size=1536,  # OpenAI text-embedding-3-small dimension
                        distance=Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Error ensuring collection: {e}")

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using OpenAI"""
        response = self.openai_client.embeddings.create(
            model=self.embedding_model,
            input=text
        )
        return response.data[0].embedding

    def search_similar(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for similar content in Qdrant"""
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

    async def get_answer(
        self,
        question: str,
        context: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Dict:
        """
        Get answer using Groq LLM.
        Currently operates in direct chat mode (no RAG) since Groq doesn't provide embeddings.
        """
        # Generate answer using Groq
        system_prompt = """You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
You are an expert in robotics, AI, machine learning, computer vision, and humanoid robots.
Provide clear, educational, and accurate answers about physical AI and robotics topics.
If you don't know something, say so honestly."""

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

        return {
            "answer": answer,
            "sources": [],
            "message_id": str(uuid.uuid4())
        }

    def ingest_content(self, chunks: List[Dict]) -> int:
        """
        Ingest textbook content into Qdrant.
        Each chunk should have: content, chapter, title, section
        """
        points = []
        for i, chunk in enumerate(chunks):
            embedding = self.generate_embedding(chunk["content"])
            points.append(PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "content": chunk["content"],
                    "chapter": chunk.get("chapter", ""),
                    "title": chunk.get("title", ""),
                    "section": chunk.get("section", "")
                }
            ))

        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )

        return len(points)

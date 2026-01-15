"""
RAG Service - Simple chatbot using Groq LLM with textbook content
No vector database needed - uses keyword matching for context retrieval
"""

import os
import uuid
import httpx
from typing import Optional, List, Dict
from openai import OpenAI
from data.textbook_content import CHAPTERS


class RAGService:
    def __init__(self):
        self._groq_client = None
        self.chat_model = "llama-3.3-70b-versatile"
        self.chapters = CHAPTERS

    @property
    def groq_client(self):
        """Groq client for chat completions"""
        if self._groq_client is None:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY environment variable is required")
            self._groq_client = OpenAI(
                api_key=api_key,
                base_url="https://api.groq.com/openai/v1"
            )
        return self._groq_client

    def call_gemini(self, prompt: str, max_tokens: int = 1000) -> str:
        """Call Gemini API as fallback when Groq hits rate limits."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not configured")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "maxOutputTokens": max_tokens,
                "temperature": 0.3
            }
        }

        # Retry up to 2 times on timeout
        for attempt in range(2):
            try:
                response = httpx.post(url, json=payload, timeout=120.0)
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except httpx.TimeoutException:
                if attempt == 1:
                    raise Exception("Request timed out.")
                print(f"Gemini timeout in RAG, retrying... (attempt {attempt + 1})")
            except Exception as e:
                raise e

    def call_llm(self, system_prompt: str, user_prompt: str, max_tokens: int = 1000) -> str:
        """Call LLM with automatic fallback from Groq to Gemini on rate limit."""
        full_prompt = f"{system_prompt}\n\n{user_prompt}"

        # Try Groq first
        try:
            response = self.groq_client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            error_str = str(e)
            # Check if it's a rate limit error (429)
            if "429" in error_str or "rate_limit" in error_str.lower():
                print(f"Groq rate limit hit in RAG, falling back to Gemini")
                return self.call_gemini(full_prompt, max_tokens)
            else:
                raise e

    def search_relevant_chapters(self, query: str, limit: int = 3) -> List[Dict]:
        """
        Simple keyword-based search to find relevant chapters.
        Scores chapters based on keyword matches in title and content.
        """
        query_lower = query.lower()
        query_words = set(query_lower.split())

        scored_chapters = []
        for chapter in self.chapters:
            title_lower = chapter["title"].lower()
            content_lower = chapter["content"].lower()

            # Score based on keyword matches
            score = 0
            for word in query_words:
                if len(word) > 2:  # Skip very short words
                    if word in title_lower:
                        score += 3  # Title matches are more important
                    if word in content_lower:
                        score += content_lower.count(word)

            if score > 0:
                scored_chapters.append({
                    "chapter": chapter["chapter"],
                    "title": chapter["title"],
                    "content": chapter["content"],
                    "relevance": min(score / 10, 1.0)  # Normalize to 0-1
                })

        # Sort by score and return top results
        scored_chapters.sort(key=lambda x: x["relevance"], reverse=True)
        return scored_chapters[:limit]

    async def get_answer(
        self,
        question: str,
        context: Optional[str] = None,
        user_id: Optional[str] = None,
        language: str = "english"
    ) -> Dict:
        """
        Get answer using Groq LLM with textbook content as context.
        Supports multiple languages: english, urdu
        """
        # Search for relevant chapters
        relevant_chunks = self.search_relevant_chapters(question)

        # Build context from all chapters if no specific match, or use matched chapters
        if relevant_chunks:
            context_text = "\n\n".join([
                f"[Chapter {chunk['chapter']} - {chunk['title']}]\n{chunk['content']}"
                for chunk in relevant_chunks
            ])
        else:
            # Include a summary of all chapters as fallback
            context_text = "\n\n".join([
                f"[Chapter {ch['chapter']} - {ch['title']}]\n{ch['content'][:500]}..."
                for ch in self.chapters[:5]
            ])

        # Build language instruction
        language_instruction = ""
        if language.lower() == "urdu":
            language_instruction = "\nIMPORTANT: Respond in Urdu language. Keep technical terms in English."

        system_prompt = f"""You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
Answer questions based on the provided context from the textbook.
If the context contains relevant information, use it to provide accurate, educational answers.
Always cite which chapter your information comes from when applicable.
Keep your answers clear, concise, and helpful for students learning robotics.
If the question is not related to the textbook content, politely redirect to robotics topics.{language_instruction}"""

        user_prompt = f"""Context from textbook:
{context_text}

User question: {question}

{"Additional context from user: " + context if context else ""}

Please provide a helpful, accurate answer based on the textbook content."""

        try:
            answer = self.call_llm(system_prompt, user_prompt, max_tokens=1000)
        except Exception as e:
            answer = f"I apologize, but I encountered an error: {str(e)}. Please make sure the API is configured correctly."

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

    def get_all_chapters(self) -> List[Dict]:
        """Return list of all available chapters"""
        return [
            {"chapter": ch["chapter"], "title": ch["title"]}
            for ch in self.chapters
        ]

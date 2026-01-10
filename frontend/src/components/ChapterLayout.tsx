"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ArrowLeft, ArrowRight, Globe, Sparkles, Menu, X } from "lucide-react";

interface ChapterLayoutProps {
  children: React.ReactNode;
  title: string;
  chapterId: string;
  moduleId: number;
  prevChapter?: { slug: string; title: string };
  nextChapter?: { slug: string; title: string };
}

export function ChapterLayout({
  children,
  title,
  chapterId,
  moduleId,
  prevChapter,
  nextChapter,
}: ChapterLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUrdu, setIsUrdu] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const handlePersonalize = async () => {
    setIsPersonalizing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/content/personalize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: document.getElementById("chapter-content")?.innerText || "",
            chapter_id: chapterId,
            user_level: "intermediate", // TODO: Get from user profile
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPersonalizedContent(data.personalized_content);
      }
    } catch (error) {
      console.error("Personalization error:", error);
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleTranslate = async () => {
    if (isUrdu) {
      setIsUrdu(false);
      setTranslatedContent(null);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/content/translate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: document.getElementById("chapter-content")?.innerText || "",
            chapter_id: chapterId,
            target_language: "urdu",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTranslatedContent(data.translated_content);
        setIsUrdu(true);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 left-4 z-30 lg:hidden bg-white p-2 rounded-lg shadow-md border border-gray-200"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
          {/* Chapter Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span>/</span>
              <span>Module {moduleId}</span>
              <span>/</span>
              <span className="text-gray-900">{chapterId}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePersonalize}
                disabled={isPersonalizing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isPersonalizing ? "Personalizing..." : "Personalize Content"}
              </button>

              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  isUrdu
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <Globe className="w-4 h-4" />
                {isTranslating ? "Translating..." : isUrdu ? "Switch to English" : "Translate to Urdu"}
              </button>
            </div>
          </div>

          {/* Content */}
          <article
            id="chapter-content"
            className={`prose prose-lg max-w-none ${isUrdu ? "text-right" : ""}`}
            dir={isUrdu ? "rtl" : "ltr"}
          >
            {translatedContent ? (
              <div dangerouslySetInnerHTML={{ __html: translatedContent.replace(/\n/g, "<br/>") }} />
            ) : personalizedContent ? (
              <div dangerouslySetInnerHTML={{ __html: personalizedContent.replace(/\n/g, "<br/>") }} />
            ) : (
              children
            )}
          </article>

          {/* Navigation */}
          <nav className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            {prevChapter ? (
              <Link
                href={`/chapters/${prevChapter.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">Previous</div>
                  <div className="font-medium">{prevChapter.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Link
                href={`/chapters/${nextChapter.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-500">Next</div>
                  <div className="font-medium">{nextChapter.title}</div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </main>
    </div>
  );
}

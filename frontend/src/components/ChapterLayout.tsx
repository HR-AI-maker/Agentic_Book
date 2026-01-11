"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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

  // Close sidebar handler
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Toggle sidebar handler
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      // Prevent background scrolling on mobile
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isSidebarOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

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

      {/* Mobile Sidebar Toggle - 44px minimum touch target */}
      <button
        onClick={toggleSidebar}
        onTouchEnd={(e) => {
          e.preventDefault();
          toggleSidebar();
        }}
        className="fixed top-20 left-4 z-50 lg:hidden bg-white p-3 min-w-[44px] min-h-[44px] rounded-lg shadow-md border border-gray-200 flex items-center justify-center active:bg-gray-100 transition-colors"
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isSidebarOpen}
        aria-controls="mobile-sidebar"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile - handles both click and touch */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          onTouchEnd={(e) => {
            e.preventDefault();
            closeSidebar();
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Container */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal={isSidebarOpen}
        aria-label="Navigation menu"
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Desktop Sidebar (always visible on lg+) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
          {/* Chapter Header */}
          <div className="mb-8 pl-12 lg:pl-0">
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
                className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 active:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isPersonalizing ? "Personalizing..." : "Personalize Content"}
              </button>

              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`inline-flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-lg transition-colors disabled:opacity-50 ${
                  isUrdu
                    ? "bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200"
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
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors py-2 min-h-[44px]"
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
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors py-2 min-h-[44px]"
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

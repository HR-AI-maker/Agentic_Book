"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ArrowLeft, ArrowRight, Globe, Sparkles, Menu, X, ChevronRight } from "lucide-react";

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
  const [userLevel, setUserLevel] = useState<string>("intermediate");
  const [error, setError] = useState<string | null>(null);
  const originalContentRef = useRef<string>("");

  // Capture original content once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const contentElement = document.getElementById("chapter-content");
      if (contentElement && !originalContentRef.current) {
        originalContentRef.current = contentElement.innerText || "";
      }
    }, 100); // Small delay to ensure content is rendered
    return () => clearTimeout(timer);
  }, []);

  // Get user level from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Map programming_experience to simpler levels
        const experience = user.programming_experience?.toLowerCase() || "";
        if (experience.includes("beginner") || experience.includes("none")) {
          setUserLevel("beginner");
        } else if (experience.includes("advanced") || experience.includes("expert")) {
          setUserLevel("advanced");
        } else {
          setUserLevel("intermediate");
        }
      } catch {
        // Keep default
      }
    }
  }, []);

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
    setError(null);
    try {
      // Use original content if available, otherwise get current content
      let content = originalContentRef.current;
      if (!content) {
        const contentElement = document.getElementById("chapter-content");
        content = contentElement?.innerText || "";
      }

      if (!content || content.trim().length < 50) {
        setError("Unable to get chapter content. Please refresh the page and try again.");
        setIsPersonalizing(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/content/personalize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content,
            chapter_id: chapterId,
            user_level: userLevel,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPersonalizedContent(data.personalized_content);
        setTranslatedContent(null); // Clear translation when personalizing
      } else {
        const errorText = await response.text();
        console.error("Personalization failed:", response.status, errorText);
        setError(`Personalization failed (${response.status}). Please try again.`);
      }
    } catch (err) {
      console.error("Personalization error:", err);
      setError("Network error. Please check your connection and try again.");
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
    setError(null);
    try {
      // Use personalized content if available, otherwise original content
      let content = personalizedContent || originalContentRef.current;
      if (!content) {
        const contentElement = document.getElementById("chapter-content");
        content = contentElement?.innerText || "";
      }

      if (!content || content.trim().length < 50) {
        setError("Unable to get chapter content. Please refresh the page and try again.");
        setIsTranslating(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/content/translate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content,
            chapter_id: chapterId,
            target_language: "urdu",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTranslatedContent(data.translated_content);
        setIsUrdu(true);
      } else {
        const errorText = await response.text();
        console.error("Translation failed:", response.status, errorText);
        setError(`Translation failed (${response.status}). Please try again.`);
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError("Network error. Please check your connection and try again.");
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
        className="fixed top-20 left-4 z-30 lg:hidden bg-white p-3 min-w-[44px] min-h-[44px] rounded-xl shadow-md border border-gray-200 flex items-center justify-center active:bg-gray-100 transition-colors"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Chapter Header - Beautiful styling */}
          <div className="mb-8 ml-14 sm:ml-16 lg:ml-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Module {moduleId}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium">
                {chapterId}
              </span>
            </nav>

            {/* Chapter Title - Gradient and beautiful */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            {/* Decorative line */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <div className="h-1 w-4 bg-blue-200 rounded-full"></div>
              <div className="h-1 w-2 bg-purple-200 rounded-full"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePersonalize}
                disabled={isPersonalizing || isTranslating}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 active:bg-purple-200 transition-colors disabled:opacity-50 font-medium text-sm border border-purple-100"
              >
                <Sparkles className="w-4 h-4" />
                {isPersonalizing ? "Personalizing..." : "Personalize"}
              </button>

              <button
                onClick={handleTranslate}
                disabled={isTranslating || isPersonalizing}
                className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl transition-colors disabled:opacity-50 font-medium text-sm border ${
                  isUrdu
                    ? "bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200 border-green-100"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 border-blue-100"
                }`}
              >
                <Globe className="w-4 h-4" />
                {isTranslating ? "Translating..." : isUrdu ? "English" : "Urdu"}
              </button>

              {/* Reset button - only show when content has been modified */}
              {(personalizedContent || translatedContent) && (
                <button
                  onClick={() => {
                    setPersonalizedContent(null);
                    setTranslatedContent(null);
                    setIsUrdu(false);
                    setError(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors font-medium text-sm border border-gray-200"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <article
            id="chapter-content"
            className={`prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm ${isUrdu ? "text-right" : ""}`}
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
          <nav className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
            {prevChapter ? (
              <Link
                href={`/chapters/${prevChapter.slug}`}
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors py-3 px-4 min-h-[56px] rounded-xl hover:bg-gray-100 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Previous</div>
                  <div className="font-medium text-sm sm:text-base">{prevChapter.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Link
                href={`/chapters/${nextChapter.slug}`}
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors py-3 px-4 min-h-[56px] rounded-xl hover:bg-gray-100 group sm:ml-auto"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Next</div>
                  <div className="font-medium text-sm sm:text-base">{nextChapter.title}</div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

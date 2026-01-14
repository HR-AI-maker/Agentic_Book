"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send, Loader2, Languages, Maximize2, Minimize2, LogIn } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  translatedContent?: string;
  isTranslating?: boolean;
  sources?: Array<{
    chapter: string;
    title: string;
    relevance: number;
  }>;
}

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Physical AI textbook assistant. Ask me any questions about ROS 2, Gazebo, NVIDIA Isaac, or humanoid robotics. You can also select text on the page and ask questions about it!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showUrdu, setShowUrdu] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 384, height: 500 }); // Default: w-96 (384px), h-500px
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setChatSize({ width: window.innerWidth - 48, height: window.innerHeight * 0.6 });
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: chatSize.width,
      height: chatSize.height,
    };
  }, [chatSize]);

  // Handle resize move
  useEffect(() => {
    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = resizeStartRef.current.x - clientX;
      const deltaY = resizeStartRef.current.y - clientY;

      const newWidth = Math.max(300, Math.min(800, resizeStartRef.current.width + deltaX));
      const newHeight = Math.max(400, Math.min(window.innerHeight - 100, resizeStartRef.current.height + deltaY));

      setChatSize({ width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      window.addEventListener("touchmove", handleResizeMove);
      window.addEventListener("touchend", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleResizeEnd);
    };
  }, [isResizing]);

  // Toggle expanded mode
  const toggleExpanded = useCallback(() => {
    if (isExpanded) {
      setChatSize(isMobile
        ? { width: window.innerWidth - 48, height: window.innerHeight * 0.6 }
        : { width: 384, height: 500 }
      );
    } else {
      setChatSize(isMobile
        ? { width: window.innerWidth - 24, height: window.innerHeight - 100 }
        : { width: 600, height: 700 }
      );
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded, isMobile]);

  // Check if user is signed in
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsSignedIn(!!user);
    };

    checkAuth();
    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", checkAuth);
    // Also check periodically for same-tab changes
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const translateMessage = async (messageId: string, text: string) => {
    // Mark message as translating
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTranslating: true } : msg
      )
    );

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/content/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();

      // Update message with translation
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translatedContent: data.translated_content, isTranslating: false }
            : msg
        )
      );
      setShowUrdu((prev) => ({ ...prev, [messageId]: true }));
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isTranslating: false } : msg
        )
      );
    }
  };

  const toggleLanguage = (messageId: string) => {
    setShowUrdu((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input + (selectedText ? `\n\n[Selected text: "${selectedText.slice(0, 200)}..."]` : ""),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/chat/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: input,
            context: selectedText || undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.message_id,
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please make sure the API server is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Selected Text Indicator */}
      {selectedText && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-md max-w-xs">
          <p className="text-sm font-medium">Text selected!</p>
          <p className="text-xs truncate">&quot;{selectedText.slice(0, 50)}...&quot;</p>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            Ask about this
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 transition-all duration-200"
          style={{
            width: isMobile ? `calc(100vw - 48px)` : `${chatSize.width}px`,
            height: `${chatSize.height}px`,
            maxWidth: "calc(100vw - 48px)",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {/* Resize Handle - Top Left Corner */}
          {!isMobile && (
            <div
              className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize z-10 group"
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            >
              <div className="w-3 h-3 border-t-2 border-l-2 border-gray-400 group-hover:border-blue-500 rounded-tl" />
            </div>
          )}

          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm md:text-base">Physical AI Assistant</h3>
              <p className="text-xs text-blue-100 hidden sm:block">Ask questions about the textbook</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleExpanded}
                className="p-1 hover:bg-blue-500 rounded transition-colors"
                aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-1 bg-blue-500 px-2 py-1 rounded-lg">
                <Languages className="w-4 h-4" />
                <span className="text-xs">اردو</span>
              </div>
            </div>
          </div>

          {/* Sign-in Prompt for non-authenticated users */}
          {!isSignedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Sign in to Chat</h4>
              <p className="text-sm text-gray-600 mb-4">
                Please sign in to interact with the Physical AI Assistant and get answers to your questions.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Don&apos;t have an account? Sign up
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      {/* Message Content */}
                      <p
                        className={`text-sm whitespace-pre-wrap ${
                          showUrdu[message.id] && message.translatedContent ? "text-right" : ""
                        }`}
                        dir={showUrdu[message.id] && message.translatedContent ? "rtl" : "ltr"}
                      >
                        {showUrdu[message.id] && message.translatedContent
                          ? message.translatedContent
                          : message.content}
                      </p>

                      {/* Translation Button for Assistant Messages */}
                      {message.role === "assistant" && message.id !== "welcome" && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          {message.isTranslating ? (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Translating to Urdu...</span>
                            </div>
                          ) : message.translatedContent ? (
                            <button
                              onClick={() => toggleLanguage(message.id)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <Languages className="w-3 h-3" />
                              {showUrdu[message.id] ? "Show English" : "اردو میں دیکھیں"}
                            </button>
                          ) : (
                            <button
                              onClick={() => translateMessage(message.id, message.content)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <Languages className="w-3 h-3" />
                              Translate to Urdu
                            </button>
                          )}
                        </div>
                      )}

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && !showUrdu[message.id] && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <p className="text-xs font-medium mb-1">Sources:</p>
                          {message.sources.map((source, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              Ch. {source.chapter}: {source.title}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Selected Text Indicator in Chat */}
              {selectedText && (
                <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <span className="font-medium">Context: </span>
                    &quot;{selectedText.slice(0, 100)}...&quot;
                    <button
                      onClick={() => setSelectedText("")}
                      className="ml-2 text-yellow-600 hover:underline"
                    >
                      Clear
                    </button>
                  </p>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

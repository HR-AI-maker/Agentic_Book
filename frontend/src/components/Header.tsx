"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Github, LogIn, LogOut, Home, BookOpen } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  programming_experience: string;
  hardware_experience: string;
  primary_interest: string;
}

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop/mobile
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) closeMobileMenu();
        if (isDropdownOpen) setIsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, isDropdownOpen, closeMobileMenu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setIsDropdownOpen(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsDropdownOpen(false);
    closeMobileMenu();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 truncate">
            Physical AI & Humanoid Robotics
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isDesktop && (
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
              Home
            </Link>
            <Link href="/chapters/introduction-to-physical-ai" className="text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium">
              Start Learning
            </Link>
            <a
              href="https://github.com/HR-AI-maker/Agentic_Book"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            {user ? (
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-24 truncate font-medium">{user.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Level: <span className="text-gray-700">{user.programming_experience}</span></p>
                      <p className="text-xs text-gray-500">Interest: <span className="text-gray-700">{user.primary_interest}</span></p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 min-h-[44px] text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        )}

        {/* Mobile: Sign In Button + Hamburger Menu */}
        {!isDesktop && (
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Level: <span className="text-gray-700">{user.programming_experience}</span></p>
                      <p className="text-xs text-gray-500">Interest: <span className="text-gray-700">{user.primary_interest}</span></p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 min-h-[44px] text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-sm text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {!isDesktop && isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer - Only render when open */}
      {!isDesktop && isMobileMenuOpen && (
        <div className="fixed left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              href="/"
              className="px-4 py-3.5 min-h-[48px] rounded-xl hover:bg-gray-100 flex items-center gap-3 font-medium text-gray-700"
              onClick={closeMobileMenu}
            >
              <Home className="w-5 h-5 text-blue-600" />
              Home
            </Link>
            <Link
              href="/chapters/introduction-to-physical-ai"
              className="px-4 py-3.5 min-h-[48px] rounded-xl hover:bg-gray-100 flex items-center gap-3 font-medium text-gray-700"
              onClick={closeMobileMenu}
            >
              <BookOpen className="w-5 h-5 text-purple-600" />
              Start Learning
            </Link>
            <a
              href="https://github.com/HR-AI-maker/Agentic_Book"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 min-h-[48px] rounded-xl hover:bg-gray-100 flex items-center gap-3 font-medium text-gray-700"
              onClick={closeMobileMenu}
            >
              <Github className="w-5 h-5 text-gray-700" />
              GitHub
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}

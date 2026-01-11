"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Github, LogIn, LogOut } from "lucide-react";

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

  // Close mobile menu handler
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Toggle mobile menu handler
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Check for user in localStorage on mount
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

  // Lock body scroll when mobile menu is open
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

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) {
          closeMobileMenu();
        }
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, isDropdownOpen, closeMobileMenu]);

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
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">Physical AI & Humanoid Robotics</span>
          <span className="font-bold text-lg sm:hidden">Physical AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors py-2">
            Home
          </Link>
          <Link href="/chapters/introduction-to-physical-ai" className="text-gray-600 hover:text-gray-900 transition-colors py-2">
            Start Learning
          </Link>
          <a
            href="https://github.com/HR-AI-maker/Agentic_Book"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors p-2"
          >
            <Github className="w-5 h-5" />
          </a>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="max-w-24 truncate">{user.name}</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Level: {user.programming_experience}</p>
                    <p className="text-xs text-gray-500">Interest: {user.primary_interest}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 min-h-[44px] text-left text-sm text-red-600 hover:bg-red-50 active:bg-red-100 flex items-center gap-2"
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
              className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button - 44px minimum touch target */}
        <button
          onClick={toggleMobileMenu}
          onTouchEnd={(e) => {
            e.preventDefault();
            toggleMobileMenu();
          }}
          className="md:hidden p-3 min-w-[44px] min-h-[44px] rounded-lg hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          onTouchEnd={(e) => {
            e.preventDefault();
            closeMobileMenu();
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed left-0 right-0 top-16 bg-white border-b border-gray-200 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal={isMobileMenuOpen}
        aria-label="Mobile navigation menu"
      >
        <nav className="flex flex-col p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link
            href="/"
            className="px-4 py-3 min-h-[44px] rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            href="/chapters/introduction-to-physical-ai"
            className="px-4 py-3 min-h-[44px] rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center"
            onClick={closeMobileMenu}
          >
            Start Learning
          </Link>
          <a
            href="https://github.com/HR-AI-maker/Agentic_Book"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 min-h-[44px] rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>

          {user ? (
            <>
              <div className="px-4 py-3 border-t border-gray-100 mt-2">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Level: {user.programming_experience}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-3 min-h-[44px] text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg text-left flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-center flex items-center justify-center gap-2 transition-colors"
              onClick={closeMobileMenu}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
          onTouchEnd={(e) => {
            e.preventDefault();
            setIsDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Book, Cpu, Monitor, Brain, Rocket } from "lucide-react";
import { useState } from "react";

interface Chapter {
  id: string;
  title: string;
  slug: string;
}

interface Module {
  id: string;
  title: string;
  icon: React.ReactNode;
  chapters: Chapter[];
}

interface SidebarProps {
  onClose?: () => void;
}

const modules: Module[] = [
  {
    id: "module-1",
    title: "ROS 2 Fundamentals",
    icon: <Cpu className="w-5 h-5" />,
    chapters: [
      { id: "1-1", title: "Introduction to Physical AI", slug: "introduction-to-physical-ai" },
      { id: "1-2", title: "ROS 2 Architecture", slug: "ros2-architecture" },
      { id: "1-3", title: "Building ROS 2 Packages", slug: "building-ros2-packages" },
      { id: "1-4", title: "URDF for Humanoids", slug: "urdf-for-humanoids" },
    ],
  },
  {
    id: "module-2",
    title: "Simulation (Gazebo & Unity)",
    icon: <Monitor className="w-5 h-5" />,
    chapters: [
      { id: "2-1", title: "Gazebo Simulation", slug: "gazebo-simulation" },
      { id: "2-2", title: "Sensor Simulation", slug: "sensor-simulation" },
      { id: "2-3", title: "Unity for Robotics", slug: "unity-for-robotics" },
    ],
  },
  {
    id: "module-3",
    title: "NVIDIA Isaac Platform",
    icon: <Brain className="w-5 h-5" />,
    chapters: [
      { id: "3-1", title: "Isaac Sim", slug: "isaac-sim" },
      { id: "3-2", title: "Isaac ROS", slug: "isaac-ros" },
      { id: "3-3", title: "Navigation with Nav2", slug: "navigation-nav2" },
      { id: "3-4", title: "Sim-to-Real Transfer", slug: "sim-to-real" },
    ],
  },
  {
    id: "module-4",
    title: "Vision-Language-Action",
    icon: <Rocket className="w-5 h-5" />,
    chapters: [
      { id: "4-1", title: "Voice-to-Action", slug: "voice-to-action" },
      { id: "4-2", title: "Cognitive Planning", slug: "cognitive-planning" },
      { id: "4-3", title: "Multi-Modal Interaction", slug: "multi-modal-interaction" },
      { id: "4-4", title: "Capstone Project", slug: "capstone-project" },
    ],
  },
];

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<string[]>(["module-1"]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className="w-72 bg-white border-r border-gray-200 h-full overflow-y-auto pt-16"
      role="navigation"
      aria-label="Chapter navigation"
    >
      <div className="p-4">
        <nav className="space-y-2">
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`flex items-center gap-2 px-3 py-3 min-h-[44px] rounded-lg transition-colors ${
              pathname === "/" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <Book className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Modules
            </h3>

            {modules.map((module) => (
              <div key={module.id} className="mb-1">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  aria-expanded={expandedModules.includes(module.id)}
                  aria-controls={`${module.id}-chapters`}
                >
                  <div className="flex items-center gap-2">
                    {module.icon}
                    <span className="font-medium text-sm">{module.title}</span>
                  </div>
                  {expandedModules.includes(module.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {expandedModules.includes(module.id) && (
                  <div
                    id={`${module.id}-chapters`}
                    className="ml-4 pl-4 border-l border-gray-200 mt-1 space-y-1"
                  >
                    {module.chapters.map((chapter) => {
                      const chapterPath = `/chapters/${chapter.slug}`;
                      const isActive = pathname === chapterPath;

                      return (
                        <Link
                          key={chapter.id}
                          href={chapterPath}
                          onClick={handleLinkClick}
                          className={`block px-3 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 active:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {chapter.id}. {chapter.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}

import Link from "next/link";
import { Header } from "@/components/Header";
import { ArrowRight, Cpu, Monitor, Brain, Rocket, Bot, BookOpen, MessageCircle } from "lucide-react";

const modules = [
  {
    id: 1,
    title: "The Robotic Nervous System",
    subtitle: "ROS 2 Fundamentals",
    description: "Master the middleware for robot control with ROS 2 nodes, topics, services, and URDF.",
    icon: <Cpu className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    chapters: 4,
    slug: "introduction-to-physical-ai",
  },
  {
    id: 2,
    title: "The Digital Twin",
    subtitle: "Gazebo & Unity",
    description: "Build physics simulations and high-fidelity environments for robot testing.",
    icon: <Monitor className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    chapters: 3,
    slug: "gazebo-simulation",
  },
  {
    id: 3,
    title: "The AI-Robot Brain",
    subtitle: "NVIDIA Isaac Platform",
    description: "Advanced perception, VSLAM navigation, and synthetic data generation.",
    icon: <Brain className="w-8 h-8" />,
    color: "from-green-500 to-teal-500",
    chapters: 4,
    slug: "isaac-sim",
  },
  {
    id: 4,
    title: "Vision-Language-Action",
    subtitle: "LLM + Robotics",
    description: "Voice commands, cognitive planning, and multi-modal human-robot interaction.",
    icon: <Rocket className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
    chapters: 4,
    slug: "voice-to-action",
  },
];

const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "RAG-Powered Chatbot",
    description: "Ask questions about any topic and get accurate answers based on the textbook content.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "15 In-Depth Chapters",
    description: "Comprehensive coverage from ROS 2 basics to advanced Vision-Language-Action models.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Context-Aware Help",
    description: "Select any text and ask the AI assistant specific questions about it.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Panaversity AI-Native Textbook
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Physical AI &<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Humanoid Robotics
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Master the future of robotics with ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action models.
            An interactive textbook with AI-powered learning assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chapters/introduction-to-physical-ai"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all border border-gray-200"
            >
              View Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Modules</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A 13-week journey from physical AI foundations to building autonomous humanoid robots
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link
                key={module.id}
                href={`/chapters/${module.slug}`}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>

                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg`}>
                    {module.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">Module {module.id}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{module.chapters} chapters</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">{module.subtitle}</p>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build the Future?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start your journey into Physical AI and humanoid robotics today.
          </p>
          <Link
            href="/chapters/introduction-to-physical-ai"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Begin Chapter 1
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>Physical AI & Humanoid Robotics Textbook - Panaversity</p>
          <p className="mt-2">Built with Next.js, FastAPI, and OpenAI</p>
        </div>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-orange-50/40 via-transparent to-amber-50/30" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Diagflow
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              How It Works
            </a>

          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 border-0"
            >
              <Link to="/app" className="flex items-center gap-2">
                Get Diagflow Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-20 lg:py-32">

          {/* Decorative Flow Lines - Desktop Only */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
            {/* Left Side - Flowing diagram lines */}
            <svg
              className="absolute left-0 top-0 h-full w-1/3 opacity-60"
              viewBox="0 0 400 800"
              preserveAspectRatio="xMinYMid slice"
            >
              {/* Vertical connector lines between nodes */}
              <path
                d="M110 175 Q110 220 140 260 Q175 290 175 320"
                fill="none"
                stroke="url(#gradient-left)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line"
              />
              <path
                d="M175 360 Q175 400 140 430 Q100 455 100 475"
                fill="none"
                stroke="url(#gradient-left)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line-delayed"
              />
              <path
                d="M100 525 Q100 560 100 590 L100 620"
                fill="none"
                stroke="url(#gradient-left)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line-slow"
              />

              {/* Diagram Nodes */}
              <g className="animate-pulse-slow">
                <rect x="80" y="140" width="60" height="35" rx="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.9" />
                <rect x="140" y="320" width="70" height="40" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.85" />
                <circle cx="100" cy="500" r="25" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.8" />
                <rect x="60" y="620" width="80" height="45" rx="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.85" />
              </g>

              {/* Connection dots at connection points */}
              <g className="animate-pulse-dots">
                <circle cx="110" cy="175" r="4" fill="#ea580c" opacity="0.9" />
                <circle cx="175" cy="320" r="4" fill="#ea580c" opacity="0.85" />
                <circle cx="175" cy="360" r="4" fill="#ea580c" opacity="0.85" />
                <circle cx="100" cy="475" r="4" fill="#ea580c" opacity="0.8" />
                <circle cx="100" cy="525" r="4" fill="#ea580c" opacity="0.8" />
                <circle cx="100" cy="620" r="4" fill="#ea580c" opacity="0.85" />
              </g>

              <defs>
                <linearGradient id="gradient-left" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Right Side - Flowing diagram lines (mirrored) */}
            <svg
              className="absolute right-0 top-0 h-full w-1/3 opacity-60"
              viewBox="0 0 400 800"
              preserveAspectRatio="xMaxYMid slice"
              style={{ transform: 'scaleX(-1)' }}
            >
              {/* Vertical connector lines between nodes */}
              <path
                d="M150 180 Q150 220 151 250 Q152 270 152 280"
                fill="none"
                stroke="url(#gradient-right)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line"
              />
              <path
                d="M152 318 Q152 370 168 410 Q188 440 188 451"
                fill="none"
                stroke="url(#gradient-right)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line-delayed"
              />
              <path
                d="M188 505 Q188 540 155 560 Q118 575 118 580"
                fill="none"
                stroke="url(#gradient-right)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-flow-line-slow"
              />

              {/* Diagram Nodes - Diamond and rectangles */}
              <g className="animate-pulse-slow">
                <polygon points="150,120 180,150 150,180 120,150" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.85" />
                <rect x="120" y="280" width="65" height="38" rx="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.9" />
                <circle cx="188" cy="478" r="27" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.8" />
                <rect x="80" y="580" width="75" height="42" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" opacity="0.85" />
              </g>

              {/* Connection dots at connection points */}
              <g className="animate-pulse-dots">
                <circle cx="150" cy="180" r="4" fill="#ea580c" opacity="0.85" />
                <circle cx="152" cy="280" r="4" fill="#ea580c" opacity="0.9" />
                <circle cx="152" cy="318" r="4" fill="#ea580c" opacity="0.9" />
                <circle cx="188" cy="451" r="4" fill="#ea580c" opacity="0.8" />
                <circle cx="188" cy="505" r="4" fill="#ea580c" opacity="0.8" />
                <circle cx="118" cy="580" r="4" fill="#ea580c" opacity="0.85" />
              </g>

              <defs>
                <linearGradient id="gradient-right" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating particles/dots */}
            <div className="absolute inset-0">
              <div className="absolute left-[10%] top-[20%] w-3 h-3 bg-orange-500/60 rounded-full animate-float-particle" />
              <div className="absolute left-[15%] top-[45%] w-2.5 h-2.5 bg-orange-600/50 rounded-full animate-float-particle-delayed" />
              <div className="absolute left-[8%] top-[70%] w-3.5 h-3.5 bg-orange-500/45 rounded-full animate-float-particle-slow" />
              <div className="absolute right-[12%] top-[25%] w-3 h-3 bg-orange-500/55 rounded-full animate-float-particle-delayed" />
              <div className="absolute right-[18%] top-[55%] w-2.5 h-2.5 bg-orange-600/60 rounded-full animate-float-particle" />
              <div className="absolute right-[10%] top-[75%] w-3 h-3 bg-orange-500/50 rounded-full animate-float-particle-slow" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif tracking-tight text-gray-900 leading-[1.1] mb-8">
              <span className="italic font-light">Describe</span>
              <span className="font-semibold"> it.</span>
              <br />
              <span className="font-semibold">We'll diagram </span>
              <span className="italic font-light">it.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Turn natural language into beautiful diagrams instantly.
              <br className="hidden sm:block" />
              No drag and drop required.
            </p>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl shadow-gray-900/20 hover:shadow-gray-900/30 transition-all hover:scale-105"
            >
              <Link to="/app" className="flex items-center gap-3">
                Start Creating — It's Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            {/* Trust Badges */}
            <p className="mt-6 text-sm text-gray-500">
              No signup required • Works in browser • 100% Free
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-gray-900 mb-4">
                Why Diagflow?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create professional diagrams in seconds, not hours
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Describe what you want in plain English. Get a complete diagram in seconds with AI-powered generation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI-Powered
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Powered by Google's Gemini AI. Understands context, suggests improvements, and iterates with you.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Privacy First
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your API key stays in your browser. Diagrams are generated locally. No data stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-24 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Three simple steps to create your diagram
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Describe Your Idea
                </h3>
                <p className="text-gray-600">
                  Type what you want to visualize in plain language. "Show me a user authentication flow" works perfectly.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI Generates Diagram
                </h3>
                <p className="text-gray-600">
                  Gemini AI interprets your request and generates a beautiful Mermaid diagram in seconds.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Iterate & Export
                </h3>
                <p className="text-gray-600">
                  Refine with follow-up prompts. Export as SVG, PNG, or copy the Mermaid code directly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-white mb-6">
              Ready to create your first diagram?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of developers, designers, and teams using Diagflow to visualize ideas faster.
            </p>
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-lg font-medium bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105"
            >
              <Link to="/app" className="flex items-center gap-3">
                Start Creating for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Workflow className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Diagflow
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Built with ❤️ by{" "}
                <a
                  href="https://github.com/PythonicBoat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
                >
                  @PythonicBoat
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Flow line animations */
        @keyframes flow-line {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        .animate-flow-line {
          stroke-dasharray: 1000;
          animation: flow-line 8s ease-in-out infinite;
        }

        .animate-flow-line-delayed {
          stroke-dasharray: 1000;
          animation: flow-line 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-flow-line-slow {
          stroke-dasharray: 1000;
          animation: flow-line 12s ease-in-out infinite;
          animation-delay: 4s;
        }

        /* Pulse animations for nodes */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes pulse-dots {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }

        .animate-pulse-dots {
          animation: pulse-dots 2s ease-in-out infinite;
        }

        /* Floating particle animations */
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.5; }
          50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; }
          75% { transform: translateY(-15px) translateX(2px); opacity: 0.6; }
        }

        .animate-float-particle {
          animation: float-particle 6s ease-in-out infinite;
        }

        .animate-float-particle-delayed {
          animation: float-particle 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-particle-slow {
          animation: float-particle 10s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

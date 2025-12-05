import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow, Github, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

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
            <a
              href="https://github.com/PythonicBoat/Diagflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:flex text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <a
                href="https://github.com/PythonicBoat/Diagflow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden md:inline">Star on GitHub</span>
              </a>
            </Button>
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
          {/* Floating Diagrams */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top Left Diagram */}
            <div 
              className="absolute top-16 left-8 lg:left-[8%] w-48 lg:w-64 transform -rotate-6 opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              style={{ animation: 'float 8s ease-in-out infinite' }}
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-3 border border-gray-100">
                <img 
                  src="/diagram-1.png" 
                  alt="System architecture diagram" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Top Right Diagram */}
            <div 
              className="absolute top-24 right-8 lg:right-[8%] w-52 lg:w-72 transform rotate-6 opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-3 border border-gray-100">
                <img 
                  src="/diagram-2.png" 
                  alt="Entity relationship diagram" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Bottom Left Diagram */}
            <div 
              className="absolute bottom-24 left-12 lg:left-[12%] w-44 lg:w-56 transform rotate-3 opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              style={{ animation: 'float 9s ease-in-out infinite', animationDelay: '2s' }}
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-3 border border-gray-100">
                <img 
                  src="/diagram-3.png" 
                  alt="Mind map diagram" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Bottom Right Diagram */}
            <div 
              className="absolute bottom-32 right-12 lg:right-[10%] w-48 lg:w-64 transform -rotate-8 opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
              style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '3s' }}
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-3 border border-gray-100">
                <img 
                  src="/diagram-4.png" 
                  alt="Sequence diagram" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
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

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <a
                  href="https://github.com/PythonicBoat/Diagflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://twitter.com/_yashvs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  Twitter
                </a>
              </div>

              <p className="text-sm text-gray-500">
                Built with ❤️ by{" "}
                <a
                  href="https://twitter.com/_yashvs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
                >
                  @_yashvs
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

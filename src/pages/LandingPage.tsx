import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Linkedin } from "lucide-react";
import { DiagflowLogo } from "@/components/logo/DiagflowLogo";

// Modern X (formerly Twitter) logo component
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);


const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Progressive loading sequence - blazing fast feel
    // Navbar is already visible (no delay)
    requestAnimationFrame(() => {
      setIsLoaded(true); // Page container ready

      // Hero text appears after 100ms
      setTimeout(() => setShowHero(true), 100);

      // Preview card appears after 300ms
      setTimeout(() => setShowPreview(true), 300);
    });
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  // Scroll animation hook
  const useScrollAnimation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
  };

  const featuresAnim = useScrollAnimation();
  const howItWorksAnim = useScrollAnimation();
  const ctaAnim = useScrollAnimation();

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDark ? 'bg-[#131b1f] text-[#F5F5F7]' : 'bg-[#f6f7f8] text-[#111111]'}`}>

      {/* Navigation - Loads instantly */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} ${isDark ? 'bg-black/80 border-gray-800/50' : 'bg-white/80 border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DiagflowLogo className="w-9 h-9" />
            <span className="font-sans text-lg font-semibold tracking-tight">Diagflow</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
            <a className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#111]'}`} href="#features">Features</a>
            <a className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#111]'}`} href="#how-it-works">How It Works</a>
            <Link className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#111]'}`} to="/pricing">Premium</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-[#86868B]' : 'hover:bg-gray-100 text-[#6E6E73]'}`}
            >
              {isDark ? (
                <span className="material-symbols-outlined text-[20px]">light_mode</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">dark_mode</span>
              )}
            </button>
            <Link
              to="/app"
              className={`hidden sm:flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80 ${isDark ? 'bg-white text-black' : 'bg-[#111] text-white'}`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content landmark for accessibility */}
      <main>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-20 lg:py-0 overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left Content - Staggered load */}
              <div className={`flex flex-col items-start text-left max-w-2xl transition-all duration-700 ease-out ${showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 id="hero-heading" className={`font-sans text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold tracking-tighter leading-[1.05] mb-8 ${isDark ? 'text-[#F5F5F7]' : 'text-[#111]'}`}>
                  Your{" "}
                  {/* Clean gradient text with subtle glow - Jony Ive approach */}
                  <span
                    className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-orange-500 to-amber-500' : 'from-orange-400 to-amber-400'}`}
                    style={{
                      textShadow: isDark ? '0 0 40px rgba(249, 115, 22, 0.3)' : 'none',
                      WebkitBackgroundClip: 'text'
                    }}
                  >
                    Design Copilot
                  </span>{" "}
                  for Diagrams.
                </h1>
                <p className={`text-lg sm:text-xl font-normal leading-relaxed mb-10 max-w-lg tracking-wide ${isDark ? 'text-[#A1A1A6]' : 'text-[#515154]'}`}>
                  The fastest way to visualize complex systems. Describe your architecture in any language, and let Archie handle the structure.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                  <Link
                    to="/app"
                    className={`group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isDark
                      ? 'bg-gradient-to-b from-white to-gray-100 text-black shadow-lg shadow-white/10'
                      : 'bg-gradient-to-b from-[#111] to-[#222] text-white shadow-lg shadow-black/20'
                      }`}
                  >
                    Start Visualizing for Free
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                  </Link>
                  <p className={`flex items-center text-sm font-medium ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                    <span className="material-symbols-outlined text-green-500 text-base mr-1.5">check_circle</span>
                    No credit card required
                  </p>
                </div>
              </div>

              {/* Right Preview Card - Staggered load with depth */}
              <div className={`relative w-full aspect-[1/1] lg:aspect-[5/4] transition-all duration-700 ease-out delay-100 ${showPreview ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <div className={`absolute inset-2 lg:inset-0 rounded-2xl overflow-hidden flex flex-col ${isDark
                  ? 'bg-[#111] border border-white/[0.08] shadow-2xl shadow-orange-500/[0.05]'
                  : 'bg-white border border-black/[0.08] shadow-2xl shadow-black/10'
                  }`}>

                  {/* Window Controls */}
                  <div className={`h-10 border-b flex items-center px-4 gap-2 ${isDark ? 'border-gray-800 bg-black/40' : 'border-gray-100 bg-gray-50'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Prompt */}
                    <div className={`w-[40%] border-r p-6 flex flex-col gap-4 relative z-10 ${isDark ? 'border-gray-800 bg-[#111]' : 'border-gray-100 bg-white'}`}>
                      <div className={`font-mono text-[10px] tracking-widest mb-1 uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Prompt</div>
                      <div className={`text-sm font-medium leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <span className="typing-cursor">Show me a user authentication flow</span>
                      </div>
                      <div className="mt-6 space-y-3 opacity-20">
                        <div className={`h-2 rounded w-5/6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 rounded w-4/6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 rounded w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>

                    {/* Right Panel - Diagram Preview */}
                    <div className={`flex-1 relative flex items-center justify-center p-8 bg-grid ${isDark ? 'bg-black' : 'bg-gray-50/50'}`}>
                      <div className="relative z-10 w-full max-w-[240px] flex flex-col items-center gap-6 scale-90 sm:scale-100">

                        {/* User Node */}
                        <div
                          className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center border animate-fade-in-up ${isDark ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200'}`}
                          style={{ animationDelay: "1s" }}
                        >
                          <span className={`material-symbols-outlined text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>person</span>
                        </div>

                        {/* Connector */}
                        <div className={`h-8 w-px animate-fade-in-up ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} style={{ animationDelay: "1.2s" }}></div>

                        {/* Auth Node */}
                        <div
                          className={`w-48 rounded-xl shadow-sm p-3 border flex items-center gap-3 animate-fade-in-up ${isDark ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200'}`}
                          style={{ animationDelay: "1.4s" }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#1a4e6b] border ${isDark ? 'bg-orange-900/10 border-orange-900/20' : 'bg-orange-50 border-orange-100'}`}>
                            <span className="material-symbols-outlined text-sm">lock</span>
                          </div>
                          <div className="flex-1">
                            <div className={`h-2 w-16 rounded mb-1.5 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                            <div className={`h-1.5 w-24 rounded ${isDark ? 'bg-gray-800/60' : 'bg-gray-100'}`}></div>
                          </div>
                        </div>

                        {/* Branch Connectors */}
                        <div className="w-full flex justify-between px-6 animate-fade-in-up" style={{ animationDelay: "1.8s" }}>
                          <div className={`h-8 w-px -rotate-12 origin-top ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                          <div className={`h-8 w-px rotate-12 origin-top ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        </div>

                        {/* Result Nodes */}
                        <div className="w-full flex justify-between gap-4 px-2 animate-fade-in-up" style={{ animationDelay: "2.1s" }}>
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${isDark ? 'border-gray-800 bg-[#1A1A1A]' : 'border-gray-200 bg-white'}`}>
                            <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
                          </div>
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${isDark ? 'border-gray-800 bg-[#1A1A1A]' : 'border-gray-200 bg-white'}`}>
                            <span className="material-symbols-outlined text-red-500 text-[14px]">close</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`py-24 border-t ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
          <div
            ref={featuresAnim.ref}
            className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${featuresAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-20">
              <h2 className={`font-sans text-4xl font-semibold tracking-tight mb-4 ${isDark ? 'text-[#F5F5F7]' : 'text-[#111]'}`}>
                Why Diagflow?
              </h2>
              <p className={`text-lg font-normal ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                Create professional diagrams in seconds, not hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isDark ? 'bg-[#121212] border-gray-800 hover:border-orange-500/50 hover:shadow-orange-500/10' : 'bg-[#f6f7f8] border-gray-100 hover:border-orange-300 hover:shadow-orange-200/50'}`}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Lightning Fast</h3>
                <p className={`leading-relaxed text-sm ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  Describe what you want in any language. Get a complete diagram in seconds with Archie's powerful generation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isDark ? 'bg-[#121212] border-gray-800 hover:border-orange-500/50 hover:shadow-orange-500/10' : 'bg-[#f6f7f8] border-gray-100 hover:border-orange-300 hover:shadow-orange-200/50'}`} style={{ transitionDelay: '100ms' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">stars</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Smart Builder</h3>
                <p className={`leading-relaxed text-sm ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  Powered by Archie, our intelligent builder. Understands context, suggests improvements, and iterates with you.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`group p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isDark ? 'bg-[#121212] border-gray-800 hover:border-orange-500/50 hover:shadow-orange-500/10' : 'bg-[#f6f7f8] border-gray-100 hover:border-orange-300 hover:shadow-orange-200/50'}`} style={{ transitionDelay: '200ms' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <h3 className="text-lg font-semibold mb-3">Privacy First</h3>
                <p className={`leading-relaxed text-sm ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  Your API key stays in your browser. Diagrams are generated locally. No data stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 overflow-hidden relative">
          <div
            ref={howItWorksAnim.ref}
            className={`max-w-7xl mx-auto px-6 transition-all duration-700 ${howItWorksAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-20">
              <h2 className={`font-sans text-4xl font-semibold tracking-tight mb-4 ${isDark ? 'text-[#F5F5F7]' : 'text-[#111]'}`}>
                How It Works
              </h2>
              <p className={`text-lg font-normal ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                Three simple steps to visualize your thoughts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line - animated gradient */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] z-0">
                <div className="h-full bg-gradient-to-r from-orange-500/0 via-orange-500 to-orange-500/0 animate-pulse"></div>
              </div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                {/* Advanced Step Indicator */}
                <div className="relative mb-8">
                  {/* Outer rotating ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute -inset-1 rounded-full border-2 border-dashed border-orange-500/30 animate-spin-slow"></div>
                  {/* Main badge */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">01</span>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping-slow"></div>
                </div>
                <h3 className="text-lg font-semibold mb-3">Describe Your Idea</h3>
                <p className={`text-sm leading-relaxed max-w-xs ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  Type what you want to visualize in plain language. "Show me a user authentication flow" works perfectly.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                {/* Advanced Step Indicator */}
                <div className="relative mb-8">
                  {/* Outer rotating ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute -inset-1 rounded-full border-2 border-dashed border-orange-500/30 animate-spin-slow" style={{ animationDelay: '-2s' }}></div>
                  {/* Main badge */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">02</span>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping-slow" style={{ animationDelay: '-1s' }}></div>
                </div>
                <h3 className="text-lg font-semibold mb-3">Archie Generates Diagram</h3>
                <p className={`text-sm leading-relaxed max-w-xs ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  The builder interprets your request and generates a beautiful Mermaid diagram in seconds.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center group">
                {/* Advanced Step Indicator */}
                <div className="relative mb-8">
                  {/* Outer rotating ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute -inset-1 rounded-full border-2 border-dashed border-orange-500/30 animate-spin-slow" style={{ animationDelay: '-4s' }}></div>
                  {/* Main badge */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">03</span>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping-slow" style={{ animationDelay: '-2s' }}></div>
                </div>
                <h3 className="text-lg font-semibold mb-3">Iterate &amp; Export</h3>
                <p className={`text-sm leading-relaxed max-w-xs ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
                  Refine with follow-up prompts. Export as SVG, PNG, or copy the Mermaid code directly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-24 relative ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div
            ref={ctaAnim.ref}
            className={`max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${ctaAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className={`font-sans text-4xl md:text-5xl font-semibold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-[#111]'}`}>
              Ready to create your first diagram?
            </h2>
            <p className={`text-lg mb-10 max-w-xl mx-auto font-normal ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
              Join thousands of developers and designers using Diagflow to visualize ideas faster.
            </p>
            <Link
              to="/app"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:scale-105 hover:shadow-lg ${isDark ? 'bg-white text-black hover:shadow-white/20' : 'bg-[#111] text-white hover:shadow-gray-900/30'}`}
            >
              Start Creating for Free
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`} role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <DiagflowLogo className="w-7 h-7" />
            <span className="font-sans font-semibold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Diagflow</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/_yashvs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on X"
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-[#111]'}`}
            >
              <XLogo className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/yashvardhan04"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on LinkedIn"
              className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-[#111]'}`}
            >
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>

          {/* Credits */}
          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-[#86868B]' : 'text-[#6E6E73]'}`}>
            Designed with <span className={`mx-1 font-medium ${isDark ? 'text-white' : 'text-[#111]'}`}>Precision</span> by{" "}
            <a href="https://github.com/itsyashvardhan" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#111]'}`}>
              @itsyashvardhan
            </a>
          </p>
        </div>
      </footer>

      <style>{`
        .font-sans {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .typing-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .bg-grid {
          background-image: radial-gradient(${isDark ? '#333' : '#e5e7eb'} 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          will-change: opacity, transform;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
          will-change: transform;
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }

        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

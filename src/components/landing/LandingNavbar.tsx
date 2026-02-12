import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DiagfloLogo } from "@/components/logo/DiagfloLogo";

const LandingNavbar = () => {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const handler = () =>
            setIsDark(document.documentElement.classList.contains("dark"));
        window.addEventListener("theme-changed", handler);
        return () => window.removeEventListener("theme-changed", handler);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
        const nowDark = document.documentElement.classList.contains("dark");
        setIsDark(nowDark);
        window.dispatchEvent(new Event("theme-changed"));
    };

    return (
        <>
            {/* Skip to content - WCAG 2.1 AA */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-orange-500 focus:text-white focus:text-sm focus:font-medium"
            >
                Skip to content
            </a>

            {/* Navigation - Eagerly loaded, renders instantly */}
            <nav
                className={`font-sans antialiased sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDark
                        ? "text-[#F5F5F7] bg-black/80 border-gray-800/50"
                        : "text-[#111111] bg-white/80 border-gray-200/50"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <DiagfloLogo className="w-9 h-9" />
                        <span className="font-sans text-lg font-semibold tracking-tight">
                            Diagflo
                        </span>
                    </div>

                    <div
                        className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDark ? "text-[#86868B]" : "text-[#6E6E73]"
                            }`}
                    >
                        <a
                            className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-[#111]"
                                }`}
                            href="#features"
                        >
                            Features
                        </a>
                        <a
                            className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-[#111]"
                                }`}
                            href="#how-it-works"
                        >
                            How It Works
                        </a>
                        <Link
                            className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-[#111]"
                                }`}
                            to="/docs"
                        >
                            Docs
                        </Link>
                        <Link
                            className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-[#111]"
                                }`}
                            to="/pricing"
                        >
                            Premium
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${isDark
                                    ? "hover:bg-gray-800 text-[#86868B]"
                                    : "hover:bg-gray-100 text-[#6E6E73]"
                                }`}
                        >
                            {isDark ? (
                                <span className="material-symbols-outlined text-[20px]">
                                    light_mode
                                </span>
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">
                                    dark_mode
                                </span>
                            )}
                        </button>
                        <Link
                            to="/app"
                            className={`hidden sm:flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80 ${isDark ? "bg-white text-black" : "bg-[#111] text-white"
                                }`}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default LandingNavbar;

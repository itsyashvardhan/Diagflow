import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { DiagramViewer } from "@/components/diagram/DiagramViewer";
import { ZoomControls } from "@/components/diagram/ZoomControls";
import { DiagramControls } from "@/components/diagram/DiagramControls";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { ExamplesModal } from "@/components/modals/ExamplesModal";
import { CodeViewModal } from "@/components/modals/CodeViewModal";
import { ExportModal } from "@/components/modals/ExportModal";
import { HistoryModal } from "@/components/modals/HistoryModal";
import { HelpModal } from "@/components/modals/HelpModal";
import { ShareModal } from "@/components/modals/ShareModal";
import { storage } from "@/lib/storage";
import { getSharedDiagram } from "@/lib/shareLinks";
import { generateDiagram } from "@/lib/gemini";
import { Message, DiagramHistoryEntry, AppSettings, Attachment } from "@/types/diagflow";
import { GEMINI_SUPPORTS_IMAGE_INPUT } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { logger } from "@/lib/logger";
import {
  Settings,
  Sparkles,
  History,
  HelpCircle,
  Maximize2,
  Minimize2,
  Workflow,
  RotateCcw,
} from "lucide-react";
import { Github, Share2 } from "lucide-react";
import { CreditsModal } from "@/components/modals/CreditsModal";

const Index = () => {
  // Get share ID from URL params (for /d/:shareId route)
  const { shareId } = useParams<{ shareId?: string }>();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState("");
  const [diagramHistory, setDiagramHistory] = useState<DiagramHistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Initialize settings and optionally hydrate API key from explicit storage slot
  const initialSettings = storage.getSettings();
  const storedApiKey = storage.getApiKey();
  if (storedApiKey && !initialSettings.geminiApiKey) {
    initialSettings.geminiApiKey = storedApiKey;
  }
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Chat column sizing (resizable, max 40% of viewport)
  const MIN_CHAT_WIDTH = 320; // px - ensures usability of chat input
  const [chatWidth, setChatWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("diagflow:chatWidth");
      if (saved) {
        return Number(saved);
      }
      // Default to 33% of the viewport width (respecting MIN_CHAT_WIDTH)
      if (typeof window !== "undefined") {
        return Math.max(MIN_CHAT_WIDTH, Math.floor(window.innerWidth * 0.33));
      }
      return 400;
    } catch {
      return 400;
    }
  });
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const latestWidthRef = useRef(chatWidth);

  // Helper to clamp width to [MIN_CHAT_WIDTH, 40vw]
  const clampWidth = (w: number) => {
    const max = Math.floor(window.innerWidth * 0.4);
    return Math.max(MIN_CHAT_WIDTH, Math.min(w, max));
  };

  useEffect(() => {
    latestWidthRef.current = chatWidth;
    try {
      localStorage.setItem("diagflow:chatWidth", String(chatWidth));
    } catch { }
  }, [chatWidth]);

  useEffect(() => {
    // Ensure saved width doesn't exceed 40% when window resizes
    const onResize = () => {
      setChatWidth((w) => clampWidth(w));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }
    const dx = e.clientX - startXRef.current;
    const newW = clampWidth(startWidthRef.current + dx);
    setChatWidth(newW);
    latestWidthRef.current = newW;
  };

  const onMouseUp = () => {
    if (!isResizingRef.current) {
      return;
    }
    isResizingRef.current = false;
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const startResize = (clientX: number) => {
    isResizingRef.current = true;
    startXRef.current = clientX;
    startWidthRef.current = latestWidthRef.current || chatWidth;
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    startResize(e.clientX);
  };

  const handleTouchStartResize = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) {
      return;
    }
    startResize(t.clientX);
  };

  // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [showShare, setShowShare] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load from storage on mount
  useEffect(() => {
    const savedMessages = storage.getChatHistory();
    const savedDiagram = storage.getCurrentDiagram();
    const savedHistory = storage.getDiagramHistory();
    const savedIndex = storage.getHistoryIndex();

    setMessages(savedMessages);
    setCurrentDiagram(savedDiagram);
    setDiagramHistory(savedHistory);
    setHistoryIndex(savedIndex);

    // Always dark mode
    document.documentElement.classList.add('dark');
  }, []);

  // Handle shared diagram loading from Supabase
  useEffect(() => {
    const loadSharedData = async () => {
      if (shareId) {
        setIsGenerating(true);
        try {
          const shared = await getSharedDiagram(shareId);
          if (shared) {
            setCurrentDiagram(shared.code);
            // Optionally add a system message explaining this is a shared diagram
            setMessages(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: `You're viewing a shared diagram: **${shared.title || "Untitled"}**`,
                timestamp: new Date().toISOString()
              }
            ]);
            toast({
              title: "Shared Diagram Loaded",
              description: `Viewing: ${shared.title || "Shared Diagram"}`,
            });
          } else {
            toast({
              title: "Diagram Not Found",
              description: "The shared diagram link might be invalid or expired.",
              variant: "destructive",
            });
          }
        } catch (error) {
          logger.error("Error loading shared diagram", error);
          toast({
            title: "Error Loading Shared Diagram",
            description: "There was an issue loading the shared diagram.",
            variant: "destructive",
          });
        } finally {
          setIsGenerating(false);
          // Clean up the URL to /app or similar if desired, 
          // but keeping /d/shareId is fine for direct links
        }
      }
    };
    loadSharedData();
  }, [shareId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowHelp(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Escape") {
        setShowSettings(false);
        setShowExamples(false);
        setShowCodeView(false);
        setShowExport(false);
        setShowHistory(false);
        setShowHelp(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        handleZoomReset();
      }
      // Fullscreen: Ctrl/Cmd + F
      if ((e.key === "f" || e.key === "F") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, diagramHistory]);

  const handleSendMessage = async (content: string, attachments: Attachment[] = []) => {
    if (!settings.geminiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in settings",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }

    if (attachments.length > 0 && !GEMINI_SUPPORTS_IMAGE_INPUT) {
      toast({
        title: "Image attachments not supported",
        description: "Switch to a Gemini Flash or Vision model to analyze images.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
      status: "sending", // Start with sending status
    };

    const userMessageIndex = messages.length;
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsGenerating(true);

    // Helper to update the user message status
    const updateMessageStatus = (updates: Partial<Message>) => {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[userMessageIndex]) {
          newMessages[userMessageIndex] = { ...newMessages[userMessageIndex], ...updates };
        }
        return newMessages;
      });
    };

    try {
      const response = await generateDiagram(
        settings.geminiApiKey,
        content,
        currentDiagram,
        updatedHistory,
        // onRetry callback - called when rate limited and retrying
        (retryInfo) => {
          updateMessageStatus({
            status: "queued",
            retryAttempt: retryInfo.attempt,
            estimatedWaitSeconds: retryInfo.estimatedWaitSeconds,
            queueReason: retryInfo.reason,
          });

          // Show a gentle toast notification
          toast({
            title: retryInfo.reason,
            description: `Attempt ${retryInfo.attempt}/${retryInfo.maxRetries} • Wait ~${retryInfo.estimatedWaitSeconds}s`,
          });
        }
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: `${response.explanation}\n\n${response.suggestions.length > 0
          ? "**Suggestions:**\n" + response.suggestions.map((s) => `• ${s}`).join("\n")
          : ""
          }`,
        timestamp: Date.now(),
      };

      // Mark user message as sent (success)
      updateMessageStatus({
        status: "sent",
        retryAttempt: undefined,
        estimatedWaitSeconds: undefined
      });

      const finalHistory = [...messages, { ...userMessage, status: "sent" as const }, assistantMessage];
      setMessages(finalHistory);
      setCurrentDiagram(response.code);

      // Add to history
      if (settings.autoSave) {
        const newEntry: DiagramHistoryEntry = {
          code: response.code,
          prompt: content,
          timestamp: Date.now(),
        };
        const newHistory = [...diagramHistory, newEntry];
        setDiagramHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        storage.saveDiagramHistory(newHistory);
        storage.saveHistoryIndex(newHistory.length - 1);
      }

      storage.saveCurrentDiagram(response.code);
      storage.saveChatHistory(finalHistory);

      toast({
        title: "Diagram Generated",
        description: "Your system diagram is ready",
      });
    } catch (error) {
      logger.error("Generation error", error);

      // Mark user message as error
      updateMessageStatus({
        status: "error",
        retryAttempt: undefined,
        estimatedWaitSeconds: undefined
      });

      // Check if it's a rate limit error and show specific guidance
      const isRateLimitError = error instanceof Error &&
        (error.name === "RateLimitError" ||
          error.message.toLowerCase().includes("rate limit") ||
          error.message.includes("429"));

      toast({
        title: isRateLimitError ? "Rate Limit Reached" : "Generation Failed",
        description: isRateLimitError
          ? "API quota exceeded. Wait a moment and try again, or upgrade your API tier for higher limits."
          : (error instanceof Error ? error.message : "Failed to generate diagram"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
    // Persist API key separately for explicit control
    storage.saveApiKey(newSettings.geminiApiKey);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  const handleApplyCode = (code: string) => {
    setCurrentDiagram(code);
    storage.saveCurrentDiagram(code);

    if (settings.autoSave) {
      const newEntry: DiagramHistoryEntry = {
        code,
        prompt: "Manual code edit",
        timestamp: Date.now(),
      };
      const newHistory = [...diagramHistory, newEntry];
      setDiagramHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      storage.saveDiagramHistory(newHistory);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentDiagram(diagramHistory[newIndex].code);
      storage.saveHistoryIndex(newIndex);
      storage.saveCurrentDiagram(diagramHistory[newIndex].code);
    }
  };

  const handleRedo = () => {
    if (historyIndex < diagramHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentDiagram(diagramHistory[newIndex].code);
      storage.saveHistoryIndex(newIndex);
      storage.saveCurrentDiagram(diagramHistory[newIndex].code);
    }
  };

  const handleRefreshChat = () => {
    setMessages([]);
    storage.saveChatHistory([]);
    setCurrentDiagram("");
    storage.saveCurrentDiagram("");
    setIsGenerating(false);
    toast({
      title: "Chat reset",
      description: "Conversation cleared. Diagram history is still available.",
    });
  };

  const handleRestoreHistory = (index: number) => {
    setHistoryIndex(index);
    setCurrentDiagram(diagramHistory[index].code);
    storage.saveHistoryIndex(index);
    storage.saveCurrentDiagram(diagramHistory[index].code);
    toast({
      title: "Diagram Restored",
      description: "Previous version loaded successfully",
    });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);
  // Allow zoom range from 0.1 to 5 (10% to 500%)
  const handleZoomInExpanded = () => setZoom((prev) => Math.min(prev + 0.1, 5));
  const handleZoomOutExpanded = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));
  const handleZoomResetExpanded = () => setZoom(1);

  const handleWheelZoom = (newZoom: number) => {
    setZoom(() => Math.max(0.1, Math.min(newZoom, 5)));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Fit diagram to screen - calculates optimal zoom based on SVG and container size
  const handleFitToScreen = () => {
    const svgContainer = document.getElementById("diagram-svg-container");
    const svg = svgContainer?.querySelector("svg");
    const canvas = document.querySelector("[data-diagram-canvas]") as HTMLElement;

    if (!svg || !canvas) {
      setZoom(1);
      return;
    }

    // Get natural SVG dimensions
    const svgWidth = svg.getBBox?.()?.width || svg.clientWidth || 800;
    const svgHeight = svg.getBBox?.()?.height || svg.clientHeight || 600;

    // Get available canvas space (with padding)
    const padding = 64; // 32px on each side
    const canvasWidth = canvas.clientWidth - padding;
    const canvasHeight = canvas.clientHeight - padding;

    // Calculate zoom to fit both dimensions
    const zoomX = canvasWidth / svgWidth;
    const zoomY = canvasHeight / svgHeight;
    const optimalZoom = Math.min(zoomX, zoomY, 2); // Cap at 200%

    // Clamp between 0.1 and 2
    setZoom(Math.max(0.1, Math.min(optimalZoom, 2)));
  };

  // Rotating text helper for the welcome panel
  function RotatingText({ phrases, interval = 3000 }: { phrases: string[]; interval?: number }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (!phrases || phrases.length === 0) {
        return;
      }
      const t = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
      return () => clearInterval(t);
    }, [phrases, interval]);

    return (
      <span className="inline-block text-foreground font-semibold transition-opacity duration-300">
        {phrases[index]}
      </span>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "var(--gradient-background)" }} />

      {/* Header */}
      <header className="relative z-20 premium-blur border-b border-white/5 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Workflow className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight gradient-text">Diagflow</h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1.5 py-1 glass-panel rounded-full shadow-inner max-w-[calc(100vw-48px)] overflow-x-auto no-scrollbar">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="h-8 rounded-full px-3 sm:px-4 hover:bg-white/5 transition-all shrink-0"
            >
              <History className="w-3.5 h-3.5 sm:mr-2 opacity-70" />
              <span className="text-xs font-medium hidden sm:inline">History</span>
            </Button>

            <div className="hidden sm:block w-px h-4 bg-white/10 mx-0.5" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExamples(true)}
              className="h-8 rounded-full px-3 sm:px-4 hover:bg-white/5 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:mr-2 opacity-70" />
              <span className="text-xs font-medium hidden sm:inline">Examples</span>
            </Button>

            <div className="hidden sm:block w-px h-4 bg-white/10 mx-0.5" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="h-8 rounded-full px-3 sm:px-4 hover:bg-white/5 transition-all shrink-0"
            >
              <Settings className="w-3.5 h-3.5 sm:mr-2 opacity-70" />
              <span className="text-xs font-medium hidden sm:inline">Settings</span>
            </Button>

            <div className="w-px h-4 bg-white/10 mx-0.5" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShare(true)}
              className="h-8 rounded-full px-3 sm:px-4 hover:bg-white/5 transition-all text-primary shrink-0"
            >
              <Share2 className="w-3.5 h-3.5 sm:mr-2" />
              <span className="text-xs font-medium hidden sm:inline">Share</span>
            </Button>

            <div className="w-px h-4 bg-white/10 mx-0.5" />

            <div className="flex items-center gap-1 ml-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelp(true)}
                className="w-8 h-8 rounded-full hover:bg-white/5 transition-all"
                title="Help Guide"
              >
                <HelpCircle className="w-3.5 h-3.5 opacity-70" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCredits(true)}
                className="w-8 h-8 rounded-full hover:bg-white/5 transition-all text-muted-foreground/50 hover:text-foreground"
                title="Credits & GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="hidden sm:inline-flex w-8 h-8 rounded-full hover:bg-white/5 transition-all"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 opacity-70" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 opacity-70" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Column (resizable) */}
        <div
          style={{
            width: isMobile ? '100%' : `${chatWidth}px`,
            maxHeight: isMobile ? '45%' : 'none',
            minWidth: isMobile ? '100%' : '320px'
          }}
          className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 shrink-0 transition-[width,max-height] duration-300"
        >
          <div className="flex items-center justify-between px-6 py-3 lg:py-4 border-b border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50">
                Workspace
              </span>
              <span className="text-xs lg:text-sm font-semibold text-foreground/80">
                Conversation
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 lg:h-8 gap-2 rounded-full px-2 lg:px-3 text-[10px] lg:text-xs opacity-60 hover:opacity-100 transition-opacity"
              onClick={handleRefreshChat}
              disabled={isGenerating}
            >
              <RotateCcw className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <span>New</span>
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm animate-slide-up">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
                      <Workflow className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground/90 leading-tight">Flow your thoughts</h2>
                  <div className="text-muted-foreground/70" style={{ fontSize: '15px' }}>
                    <p className="mb-2">Ask Archie to</p>
                    <RotatingText
                      interval={2500}
                      phrases={[
                        "design your system architecture",
                        "visualize user auth flows",
                        "create database entity relations",
                        "produce sequence illustrations",
                        "generate git branch visuals",
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {isGenerating && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 lg:p-6 border-t border-white/5 bg-black/5">
            <ChatInput
              onSend={handleSendMessage}
              onShowExamples={() => setShowExamples(true)}
              onOpenSettings={() => setShowSettings(true)}
              hasApiKey={Boolean(settings.geminiApiKey)}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Tactical Resize handle (desktop only) */}
        <div
          role="separator"
          onMouseDown={handleMouseDownResize}
          onTouchStart={handleTouchStartResize}
          className="hidden lg:flex w-1.5 hover:w-2 group relative items-center justify-center cursor-col-resize select-none transition-all duration-300"
        >
          {/* Main divider line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 group-hover:bg-primary/40 transition-colors" />

          {/* Subtle tactile strip */}
          <div className="w-1 h-12 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Diagram Column */}
        <div className="flex-1 flex flex-col relative bg-muted/10">
          {/* Floating Controls Overlay */}
          <div className="absolute top-3 lg:top-6 left-3 lg:left-6 right-3 lg:right-6 z-10 flex flex-col lg:flex-row items-end lg:items-center justify-between pointer-events-none gap-2">
            <div className="pointer-events-auto">
              <DiagramControls
                onUndo={handleUndo}
                onRedo={handleRedo}
                onShowCode={() => setShowCodeView(true)}
                onExport={() => setShowExport(true)}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < diagramHistory.length - 1}
                disabled={!currentDiagram}
              />
            </div>

            <div className="pointer-events-auto">
              <ZoomControls
                zoom={zoom}
                onZoomIn={handleZoomInExpanded}
                onZoomOut={handleZoomOutExpanded}
                onZoomReset={handleZoomResetExpanded}
                onFitToScreen={handleFitToScreen}
              />
            </div>
          </div>

          {/* Diagram Canvas */}
          <div className="flex-1 dotted-grid relative" data-diagram-canvas>
            <DiagramViewer
              code={currentDiagram}
              theme={settings.theme}
              zoom={zoom}
              onWheelZoom={handleWheelZoom}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <ExamplesModal
        open={showExamples}
        onOpenChange={setShowExamples}
        onSelectExample={handleSendMessage}
      />

      <CodeViewModal
        open={showCodeView}
        onOpenChange={setShowCodeView}
        code={currentDiagram}
        onApply={handleApplyCode}
      />

      <ExportModal
        open={showExport}
        onOpenChange={setShowExport}
        code={currentDiagram}
      />

      <HistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
        history={diagramHistory}
        onRestore={handleRestoreHistory}
      />

      <HelpModal
        open={showHelp}
        onOpenChange={setShowHelp}
      />

      <CreditsModal
        open={showCredits}
        onOpenChange={setShowCredits}
      />

      <ShareModal
        open={showShare}
        onOpenChange={setShowShare}
        diagramCode={currentDiagram}
      />
    </div>
  );
};

export default Index;

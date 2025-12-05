import { useEffect, useRef, useState, useCallback } from "react";
import { renderDiagram, clearDiagram } from "@/lib/mermaid";
import { MermaidTheme } from "@/types/diagflow";
import { AlertCircle, RefreshCw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";

interface DiagramViewerProps {
  code: string;
  theme?: MermaidTheme;
  zoom?: number;
  onWheelZoom?: (newZoom: number, centerX?: number, centerY?: number) => void;
}

function DiagramViewerInternal({ code, theme = "default", zoom = 1, onWheelZoom }: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [retryCount, setRetryCount] = useState(0);

  const render = useCallback(async () => {
    if (!code || !containerRef.current) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await renderDiagram(code, "diagram-svg-container", theme);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Diagram render error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to render diagram";
      setError(errorMessage);

      // Clear any partial render
      clearDiagram("diagram-svg-container");
    } finally {
      setIsLoading(false);
    }
  }, [code, theme]);

  useEffect(() => {
    render();
  }, [render]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    render();
  }, [render]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && code && !error) { // Left click only and only when diagram exists without error
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // If user scrolls with ctrl (or just scroll) while the diagram exists,
    // attempt to zoom. We use shift+wheel for zoom as well or ctrl+wheel.
    if (!code || error) return;

    const isZoomGesture = e.ctrlKey || e.shiftKey || Math.abs(e.deltaY) > 0;
    if (!isZoomGesture) return;

    e.preventDefault();
    // deltaY > 0 means scroll down (zoom out)
    const delta = -e.deltaY;
    const scaleAmount = delta > 0 ? 1.075 : 0.93; // zoom factor per wheel event
    const newZoom = Math.max(0.1, Math.min((zoom || 1) * scaleAmount, 5));

    if (onWheelZoom) {
      // compute pointer position relative to container center
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = rect ? e.clientX - rect.left : undefined;
      const cy = rect ? e.clientY - rect.top : undefined;
      onWheelZoom(newZoom, cx, cy);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-8 overflow-hidden select-none"
      style={{
        cursor: isDragging ? 'grabbing' : (code && !error) ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {error && (
        <div className="glass-panel p-6 max-w-lg text-center space-y-4 rounded-2xl animate-scale-in">
          <div className="w-14 h-14 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Diagram Rendering Error</h3>
          <div className="bg-muted/50 rounded-lg p-3 text-left">
            <div className="flex items-start gap-2">
              <Code className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground break-words">{error}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry {retryCount > 0 && `(${retryCount})`}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            The Mermaid syntax may be invalid. Try simplifying your diagram or check the code.
          </p>
        </div>
      )}

      {!error && isLoading && code && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Rendering diagram...</p>
        </div>
      )}

      {!error && !code && (
        <div className="text-center space-y-3 max-w-md">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-6xl">🦥</span>
          </div>
          <h3 className="text-lg font-semibold">Nothing here Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation with Archie to generate your first illustration
          </p>
        </div>
      )}

      <div
        id="diagram-svg-container"
        className="animate-scale-in"
        style={{
          display: error || !code || isLoading ? 'none' : 'block',
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      />
    </div>
  );
}

// Wrapper component with ErrorBoundary
export function DiagramViewer(props: DiagramViewerProps) {
  const handleError = (error: Error) => {
    console.error("DiagramViewer ErrorBoundary caught:", error);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="glass-panel p-6 max-w-md text-center space-y-4 rounded-2xl">
            <div className="w-14 h-14 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Diagram Crashed</h3>
            <p className="text-sm text-muted-foreground">
              The diagram renderer encountered a critical error. Please refresh the page or try a different diagram.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>
        </div>
      }
    >
      <DiagramViewerInternal {...props} />
    </ErrorBoundary>
  );
}


import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileCode, Copy, Image, ClipboardCopy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
}

/**
 * Converts SVG element to PNG blob via canvas
 */
async function svgToPngBlob(svgElement: SVGSVGElement, scale: number = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new window.Image();
    img.onload = () => {
      // Get SVG dimensions
      const bbox = svgElement.getBBox();
      const width = svgElement.width.baseVal.value || bbox.width + bbox.x * 2 || 800;
      const height = svgElement.height.baseVal.value || bbox.height + bbox.y * 2 || 600;

      // Create canvas with higher resolution for crisp output
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Fill with white background (transparent SVGs look bad as PNG)
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scale and draw
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create PNG blob"));
        }
      }, "image/png", 1.0);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };

    img.src = url;
  });
}

export function ExportModal({ open, onOpenChange, code }: ExportModalProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const getSvgElement = (): SVGSVGElement | null => {
    return document.querySelector("#diagram-svg-container svg") as SVGSVGElement | null;
  };

  const handleExportSVG = () => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      toast({
        title: "Error",
        description: "No diagram to export",
        variant: "destructive",
      });
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagram-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "SVG file downloaded successfully",
    });
  };

  const handleExportPNG = async () => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      toast({
        title: "Error",
        description: "No diagram to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const blob = await svgToPngBlob(svgElement, 2);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `diagram-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Exported",
        description: "PNG file downloaded successfully",
      });
    } catch (error) {
      console.error("PNG export failed:", error);
      toast({
        title: "Export Failed",
        description: "Could not generate PNG. Try SVG instead.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      toast({
        title: "Error",
        description: "No diagram to copy",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const blob = await svgToPngBlob(svgElement, 2);

      // Use Clipboard API to copy image
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      toast({
        title: "Copied",
        description: "Diagram image copied to clipboard",
      });
    } catch (error) {
      console.error("Copy image failed:", error);
      toast({
        title: "Copy Failed",
        description: "Could not copy image. Your browser may not support this feature.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Export Diagram</DialogTitle>
          <DialogDescription>
            Choose your preferred export format
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <Button
            onClick={handleExportSVG}
            variant="outline"
            className="glass-panel hover-glow h-auto py-4"
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileCode className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Export as SVG</div>
                <div className="text-xs text-muted-foreground">
                  Scalable vector format
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleExportPNG}
            variant="outline"
            className="glass-panel hover-glow h-auto py-4"
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                {isExporting ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Image className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Export as PNG</div>
                <div className="text-xs text-muted-foreground">
                  High-resolution image (2x)
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleCopyImage}
            variant="outline"
            className="glass-panel hover-glow h-auto py-4"
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                {isExporting ? (
                  <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
                ) : (
                  <ClipboardCopy className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Copy Image</div>
                <div className="text-xs text-muted-foreground">
                  Copy diagram to clipboard
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="glass-panel hover-glow h-auto py-4"
            disabled={isExporting}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Copy className="w-5 h-5" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Copy Code</div>
                <div className="text-xs text-muted-foreground">
                  Mermaid source code
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

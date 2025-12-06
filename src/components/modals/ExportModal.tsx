import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileCode, Copy, Image, ClipboardCopy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
}

export function ExportModal({ open, onOpenChange, code }: ExportModalProps) {
  const { toast } = useToast();

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

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is under development. Stay tuned!",
    });
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

          {/* PNG Export - Coming Soon */}
          <Button
            onClick={handleComingSoon}
            variant="outline"
            className="glass-panel h-auto py-4 opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center relative">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold flex items-center gap-2">
                  Export as PNG
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Soon
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  High-resolution image
                </div>
              </div>
            </div>
          </Button>

          {/* Copy Image - Coming Soon */}
          <Button
            onClick={handleComingSoon}
            variant="outline"
            className="glass-panel h-auto py-4 opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ClipboardCopy className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold flex items-center gap-2">
                  Copy Image
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded-full font-medium flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Soon
                  </span>
                </div>
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

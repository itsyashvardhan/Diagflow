import { ChevronUp, Cpu, Sparkles } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
    value: "gemini" | "nvidia";
    onValueChange: (value: "gemini" | "nvidia") => void;
    className?: string;
}

export function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Select value={value} onValueChange={onValueChange as any}>
                <SelectTrigger className="h-8 w-fit gap-2 border-none bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all rounded-full shadow-inner ring-offset-background focus:ring-0 focus:ring-offset-0">
                    <div className="flex items-center gap-1.5">
                        {value === "nvidia" ? (
                            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                        ) : (
                            <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <SelectValue placeholder="Select model" />
                    </div>
                </SelectTrigger>
                <SelectContent align="start" className="bg-[#0c0c0e] border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <SelectItem
                        value="nvidia"
                        className="text-[11px] font-bold uppercase tracking-wider py-2.5 focus:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span>Nvidia</span>
                        </div>
                    </SelectItem>
                    <SelectItem
                        value="gemini"
                        className="text-[11px] font-bold uppercase tracking-wider py-2.5 focus:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span>Gemini</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

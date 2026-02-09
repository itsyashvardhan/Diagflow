import { MermaidTheme } from "@/types/diagflow";
import { sanitizeDiagram, detectDiagramType, getDiagramTypeLabel } from "./diagramSanitizer";
import { logger } from "./logger";

export interface MermaidConfig {
  theme: MermaidTheme;
  themeVariables?: Record<string, string>;
}

export const getMermaidConfig = (theme: MermaidTheme): MermaidConfig => {
  const configs: Record<MermaidTheme, MermaidConfig> = {
    default: {
      theme: "default",
      themeVariables: {
        primaryColor: "#a78bfa",
        primaryTextColor: "#fff",
        primaryBorderColor: "#8b5cf6",
        lineColor: "#60a5fa",
        secondaryColor: "#7dd3fc",
        tertiaryColor: "#c084fc",
        fontSize: "16px",
        fontFamily: "Manrope, system-ui, sans-serif",
      },
    },
    forest: {
      theme: "forest",
      themeVariables: {
        primaryColor: "#34d399",
        primaryTextColor: "#fff",
        primaryBorderColor: "#10b981",
        lineColor: "#6ee7b7",
        fontSize: "16px",
        fontFamily: "Manrope, system-ui, sans-serif",
      },
    },
    dark: {
      theme: "dark",
      themeVariables: {
        darkMode: "true",
        primaryColor: "#8b5cf6",
        primaryTextColor: "#fff",
        primaryBorderColor: "#6d28d9",
        lineColor: "#a78bfa",
        fontSize: "16px",
        fontFamily: "Manrope, system-ui, sans-serif",
      },
    },
    neutral: {
      theme: "neutral",
      themeVariables: {
        primaryColor: "#64748b",
        primaryTextColor: "#fff",
        primaryBorderColor: "#475569",
        lineColor: "#94a3b8",
        fontSize: "16px",
        fontFamily: "Manrope, system-ui, sans-serif",
      },
    },
  };

  return configs[theme];
};

// Store mermaid instance to avoid re-initialization issues
let mermaidInstance: typeof import("mermaid").default | null = null;
let lastTheme: MermaidTheme | null = null;

export const initializeMermaid = async (theme: MermaidTheme = "default") => {
  try {
    // Dynamically import mermaid
    const mermaid = (await import("mermaid")).default;

    const config = getMermaidConfig(theme);

    mermaid.initialize({
      startOnLoad: false,
      theme: config.theme,
      themeVariables: config.themeVariables,
      securityLevel: "loose",
      suppressErrorRendering: true, // Suppress error rendering in the diagram
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50,
      },
    });

    mermaidInstance = mermaid;
    lastTheme = theme;
    return mermaid;
  } catch (error) {
    logger.error("Failed to initialize Mermaid", error);
    throw new Error("Failed to initialize diagram renderer");
  }
};

/**
 * Validates mermaid syntax without rendering
 */
export const validateMermaidSyntax = async (code: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    const mermaid = mermaidInstance || (await initializeMermaid());

    // Use parse to validate syntax without rendering
    await mermaid.parse(code);
    return { valid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid diagram syntax";
    // Clean up the error message for better readability
    const cleanedError = cleanErrorMessage(errorMessage);
    return { valid: false, error: cleanedError };
  }
};

/**
 * Cleans up mermaid error messages to be more user-friendly
 */
const cleanErrorMessage = (error: string): string => {
  // Remove technical jargon and make errors more readable
  let cleaned = error
    .replace(/Lexical error on line \d+\./g, "Syntax error:")
    .replace(/Expecting .+?, got .+/g, (match) => match.replace(/Expecting /, "Expected ").replace(/, got /, " but found "))
    .replace(/Parse error on line \d+:/g, "")
    .replace(/\n/g, " ")
    .trim();

  // Truncate very long error messages
  if (cleaned.length > 200) {
    cleaned = cleaned.substring(0, 200) + "...";
  }

  return cleaned || "Invalid diagram syntax. Please check your Mermaid code.";
};

export const renderDiagram = async (
  code: string,
  elementId: string,
  theme: MermaidTheme = "default"
): Promise<void> => {
  // Validate input
  if (!code || typeof code !== "string") {
    throw new Error("No diagram code provided");
  }

  const trimmedCode = code.trim();
  if (!trimmedCode) {
    throw new Error("Diagram code is empty");
  }

  try {
    // Step 1: Sanitize the diagram code (auto-fix known issues)
    const sanitized = sanitizeDiagram(trimmedCode);

    const diagramType = sanitized.diagramType;
    const codeToRender = sanitized.code;

    // Step 2: Re-initialize if theme changed
    const mermaid = lastTheme !== theme
      ? await initializeMermaid(theme)
      : mermaidInstance || await initializeMermaid(theme);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Diagram container not found`);
    }

    // Step 3: Validate syntax
    const validation = await validateMermaidSyntax(codeToRender);
    if (!validation.valid) {
      const typeLabel = getDiagramTypeLabel(diagramType);
      throw new Error(`${typeLabel} syntax error: ${validation.error || "Invalid syntax"}`);
    }

    // Clear previous content safely
    element.innerHTML = "";

    // Generate unique ID for this render
    const graphId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Step 4: Render with timeout protection
    const renderPromise = mermaid.render(graphId, codeToRender);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Diagram rendering timed out. The diagram may be too complex.")), 30000);
    });

    const { svg } = await Promise.race([renderPromise, timeoutPromise]);

    // Safely insert the SVG
    if (svg && element) {
      element.innerHTML = svg;
      // Force immediate DOM update and repaint
      void element.offsetHeight; // Trigger reflow
    }
  } catch (error) {
    logger.error("Mermaid rendering error", error);

    // Provide a clean, user-friendly error
    if (error instanceof Error) {
      const cleanedMessage = cleanErrorMessage(error.message);
      throw new Error(cleanedMessage);
    }

    throw new Error("Failed to render diagram. Please check your syntax.");
  }
};

/**
 * Safely clears any rendered diagram
 */
export const clearDiagram = (elementId: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = "";
    }
  } catch (error) {
    logger.error("Failed to clear diagram", error);
  }
};


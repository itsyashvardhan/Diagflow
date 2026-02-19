
import { logger } from "./logger";
import { Message, DiagramResponse, AppSettings, RetryCallback } from "@/types/diagflo";
import { sanitizeDiagram, detectDiagramType } from "./diagramSanitizer";

// Default system prompt for Gemini
const SYSTEM_PROMPT = `You are Diagflo, an expert system diagram assistant. Generate clear, accurate diagrams in Mermaid or Chart.js DSL as requested. Always explain your reasoning and suggest enhancements if possible.`;

// Custom error for rate limiting
class RateLimitError extends Error {
  retryAfterMs: number;
  constructor(message: string, retryAfterMs: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

// Helper: sleep for ms
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: enforce a minimum interval between requests (debounce)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 500;
async function enforceRequestInterval() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await sleep(MIN_REQUEST_INTERVAL_MS - elapsed);
  }
  lastRequestTime = Date.now();
}

// Helper: parse Retry-After header (seconds or date)
function parseRetryAfter(header: string | null): number {
  if (!header) return 2000; // Default 2s
  const seconds = Number(header);
  if (!isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(header);
  if (!isNaN(date)) return Math.max(date - Date.now(), 1000);
  return 2000;
}

const RATE_LIMIT_CONFIG = {
  maxRetries: 3,              // Maximum number of retry attempts
  baseDelayMs: 1000,          // Initial delay before first retry (1 second)
  maxDelayMs: 32000,          // Maximum delay cap (32 seconds)
};

// Helper: exponential backoff delay
function calculateBackoffDelay(attempt: number): number {
  const delay = RATE_LIMIT_CONFIG.baseDelayMs * Math.pow(2, attempt);
  return Math.min(delay, RATE_LIMIT_CONFIG.maxDelayMs);
}

// Helper: extract error message from Gemini API error body
function extractErrorMessage(errorBody: any): string {
  if (!errorBody) return "Unknown error";
  if (typeof errorBody === "string") return errorBody;
  if (errorBody.error && errorBody.error.message) return errorBody.error.message;
  if (errorBody.message) return errorBody.message;
  return JSON.stringify(errorBody);
}

export const GEMINI_SUPPORTS_IMAGE_INPUT = true;

type GeminiPart =
  | { text: string }
  | { inlineData: { data: string; mimeType: string } };

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

export async function generateDiagram(
  apiKey: string,
  model: AppSettings["geminiModel"],
  userPrompt: string,
  currentDiagram: string,
  chatHistory: Message[],
  onRetry?: RetryCallback
): Promise<DiagramResponse> {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  // Enforce minimum request interval to prevent rapid-fire requests
  await enforceRequestInterval();

  const trimmedHistory = chatHistory.slice(-10);

  const contents: GeminiContent[] = trimmedHistory
    .map((message, index) => {
      const parts: GeminiPart[] = [];
      const isLatest = index === trimmedHistory.length - 1;
      const cleanedContent = message.content?.trim();

      if (cleanedContent) {
        let textContent = cleanedContent;
        if (message.role === "user" && isLatest && currentDiagram) {
          textContent = `Current diagram context (Mermaid v11.12.0):\n\`\`\`mermaid\n${currentDiagram}\n\`\`\`\n\nUser request:\n${cleanedContent}`;
        }
        parts.push({ text: textContent });
      } else if (message.role === "user" && isLatest && currentDiagram) {
        parts.push({
          text: `Current diagram context (Mermaid v11.12.0):\n\`\`\`mermaid\n${currentDiagram}\n\`\`\``,
        });
      }

      if (GEMINI_SUPPORTS_IMAGE_INPUT && message.attachments) {
        message.attachments.forEach((attachment) => {
          if (attachment.base64) {
            parts.push({
              inlineData: {
                data: attachment.base64,
                mimeType: attachment.mimeType,
              },
            });
            parts.push({
              text: `The user provided an image attachment (${attachment.name}). Extract any architectural or workflow insights relevant to the request from this image.`,
            });
          }
        });
      }

      if (
        message.role === "user" &&
        isLatest &&
        (!cleanedContent || cleanedContent.length === 0) &&
        GEMINI_SUPPORTS_IMAGE_INPUT &&
        message.attachments &&
        message.attachments.length > 0
      ) {
        parts.push({
          text: "Analyze the attached image(s) and generate or update the diagram accordingly.",
        });
      }

      if (parts.length === 0) {
        return null;
      }

      return {
        role: message.role === "assistant" ? "model" : "user",
        parts,
      } satisfies GeminiContent;
    })
    .filter((entry): entry is GeminiContent => entry !== null);

  if (contents.length === 0) {
    const fallbackParts: GeminiPart[] = [];
    if (currentDiagram) {
      fallbackParts.push({
        text: `Current diagram context (Mermaid v11.12.0):\n\`\`\`mermaid\n${currentDiagram}\n\`\`\``,
      });
    }
    const sanitizedPrompt = userPrompt.trim().length > 0 ? userPrompt.trim() : "Analyze the provided image(s) and generate the appropriate Mermaid diagram.";
    fallbackParts.push({ text: sanitizedPrompt });
    contents.push({ role: "user", parts: fallbackParts });
  }

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 4096,
    },
  });

  // Retry loop with exponential backoff
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RATE_LIMIT_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch(`${apiURL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      // Handle rate limiting (429)
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfterMs = parseRetryAfter(retryAfterHeader);

        // If we have retries left, wait and retry
        if (attempt < RATE_LIMIT_CONFIG.maxRetries) {
          const backoffDelay = Math.max(retryAfterMs, calculateBackoffDelay(attempt));
          const estimatedWaitSeconds = Math.ceil(backoffDelay / 1000);

          // Notify the UI about the retry
          onRetry?.({
            attempt: attempt + 1,
            maxRetries: RATE_LIMIT_CONFIG.maxRetries,
            estimatedWaitSeconds,
            reason: "High demand, retrying...",
          });

          logger.warn(
            `Rate limited (429). Attempt ${attempt + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1}. ` +
            `Retrying in ${estimatedWaitSeconds}s...`
          );
          await sleep(backoffDelay);
          continue;
        }

        // All retries exhausted
        const errorBody = await response.json().catch(() => ({}));
        throw new RateLimitError(
          `Rate limit exceeded. Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before trying again. ` +
          `Consider upgrading to a paid API tier for higher limits.`,
          retryAfterMs
        );
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = extractErrorMessage(errorBody);

        // For 5xx errors, retry with backoff
        if (response.status >= 500 && attempt < RATE_LIMIT_CONFIG.maxRetries) {
          const backoffDelay = calculateBackoffDelay(attempt);
          const estimatedWaitSeconds = Math.ceil(backoffDelay / 1000);

          onRetry?.({
            attempt: attempt + 1,
            maxRetries: RATE_LIMIT_CONFIG.maxRetries,
            estimatedWaitSeconds,
            reason: "Server busy, retrying...",
          });

          logger.warn(
            `Server error (${response.status}). Attempt ${attempt + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1}. ` +
            `Retrying in ${estimatedWaitSeconds}s...`
          );
          await sleep(backoffDelay);
          continue;
        }

        throw new Error(errorMessage);
      }

      // Success! Parse and return the response
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("No response from Gemini API");
      }

      return parseDiagramResponse(text);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry for non-retryable errors
      if (error instanceof RateLimitError ||
        (error instanceof Error && !error.message.includes("fetch"))) {
        throw error;
      }

      // Network errors: retry with backoff
      if (attempt < RATE_LIMIT_CONFIG.maxRetries) {
        const backoffDelay = calculateBackoffDelay(attempt);
        const estimatedWaitSeconds = Math.ceil(backoffDelay / 1000);

        onRetry?.({
          attempt: attempt + 1,
          maxRetries: RATE_LIMIT_CONFIG.maxRetries,
          estimatedWaitSeconds,
          reason: "Connection issue, retrying...",
        });

        logger.warn(
          `[Gemini API] Network error. Attempt ${attempt + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1}. ` +
          `Retrying in ${estimatedWaitSeconds}s...`
        );
        await sleep(backoffDelay);
        continue;
      }
    }
  }

  // All retries exhausted
  throw lastError || new Error("Failed to generate diagram after multiple attempts");
}

export function parseDiagramResponse(text: string): DiagramResponse {
  const sections = {
    explanation: "",
    code: "",
    suggestions: [] as string[],
  };

  // Extract explanation (if structured format is used)
  const explanationMatch = text.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\*\*Structured Diagram Code:\*\*|$)/i);
  if (explanationMatch) {
    sections.explanation = explanationMatch[1].trim();
  }

  // Extract mermaid code
  const mermaidMatch = text.match(/```mermaid\s*([\s\S]*?)```/i);
  if (mermaidMatch) {
    sections.code = mermaidMatch[1].trim();
  }

  // Extract Chart.js DSL code (if mermaid not found)
  if (!sections.code) {
    const chartjsMatch = text.match(/```chartjs\s*([\s\S]*?)```/i);
    if (chartjsMatch) {
      // Wrap the JSON in chartjs tags for the renderer to detect
      sections.code = `chartjs\n${chartjsMatch[1].trim()}`;
    }
  }

  // Self-healing extraction for plain-text Mermaid (no code fence).
  if (!sections.code) {
    const lineStartKeywords = [
      "flowchart", "graph", "sequenceDiagram", "classDiagram", "stateDiagram", "stateDiagram-v2",
      "erDiagram", "gantt", "pie", "gitGraph", "mindmap", "timeline", "quadrantChart",
      "requirementDiagram", "C4Context", "C4Container", "C4Component", "C4Dynamic", "C4Deployment",
      "journey", "xychart-beta", "sankey-beta", "block-beta", "packet-beta", "architecture-beta", "kanban",
    ];

    const escaped = lineStartKeywords.map((k) => k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));
    const startRegex = new RegExp(`(^|\\n)\\s*(${escaped.join("|")})\\b`, "i");
    const start = text.search(startRegex);

    if (start >= 0) {
      const candidate = text.slice(start).trim()
        .replace(/^```[\w-]*\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      sections.code = candidate;
    }
  }

  // Normalize Mermaid output for all supported diagram formats.
  if (sections.code) {
    const detected = detectDiagramType(sections.code);
    if (detected && detected !== "chartjs") {
      sections.code = sanitizeDiagram(sections.code).code;
    }
  }

  // Handle conversational responses (no diagram structure)
  // If there's no explanation match and no code, treat the entire text as the explanation
  if (!sections.explanation && !sections.code) {
    sections.explanation = text.trim();
  }

  // Extract enhancement suggestions
  const suggestionsMatch = text.match(/\*\*Enhancement Suggestions:\*\*\s*([\s\S]*?)$/i);
  if (suggestionsMatch) {
    const suggestionText = suggestionsMatch[1].trim();
    sections.suggestions = suggestionText
      .split("\n")
      .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("*"))
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  return sections;
}

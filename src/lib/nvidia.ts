import { Message, DiagramResponse, RetryCallback } from "@/types/diagflo";
import { logger } from "./logger";
import { parseDiagramResponse } from "./gemini";

// Client-side NVIDIA adapter for Diagflo
// - Hits /api/nvidia serverless proxy
// - Handles rate limiting and high-load signals from the proxy

const NVIDIA_PROXY_URL = "/api/nvidia";

const RATE_LIMIT_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 2000, // Slightly higher base delay for shared proxy
    maxDelayMs: 32000,
};

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoffDelay(attempt: number): number {
    const delay = RATE_LIMIT_CONFIG.baseDelayMs * Math.pow(2, attempt);
    return Math.min(delay, RATE_LIMIT_CONFIG.maxDelayMs);
}

export async function generateDiagramNvidia(
    userPrompt: string,
    currentDiagram: string,
    chatHistory: Message[],
    onRetry?: RetryCallback
): Promise<DiagramResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= RATE_LIMIT_CONFIG.maxRetries; attempt++) {
        try {
            const response = await fetch(NVIDIA_PROXY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userPrompt,
                    currentDiagram,
                    chatHistory,
                }),
            });

            // Check for High Load signal in headers
            const isHighLoad = response.headers.get("X-High-Load") === "true";
            if (isHighLoad) {
                // This is a subtle signal, we could pass it back to the UI
                // For now, we just log it. The UI can handle the 429 specifically.
                logger.warn("Archie proxy is under high load (30+ RPM)");
            }

            // Handle rate limiting (429)
            if (response.status === 429) {
                const data = await response.json().catch(() => ({}));
                const retryAfterSeconds = data.retryAfter || 2;
                const retryAfterMs = retryAfterSeconds * 1000;

                if (attempt < RATE_LIMIT_CONFIG.maxRetries) {
                    const backoffDelay = Math.max(retryAfterMs, calculateBackoffDelay(attempt));
                    const estimatedWaitSeconds = Math.ceil(backoffDelay / 1000);

                    onRetry?.({
                        attempt: attempt + 1,
                        maxRetries: RATE_LIMIT_CONFIG.maxRetries,
                        estimatedWaitSeconds,
                        reason: "High demand, retrying...",
                    });

                    logger.warn(
                        `[Nvidia Proxy] Rate limited (429). Attempt ${attempt + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1}. ` +
                        `Retrying in ${estimatedWaitSeconds}s...`
                    );
                    await sleep(backoffDelay);
                    continue;
                }

                throw new Error(data.message || "Archie is currently at capacity. Please try again in a few moments or switch to your personal Gemini API key.");
            }

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const errorMessage = errorBody.error || errorBody.details || "Failed to generate diagram via Archie proxy";

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
                        `[Nvidia Proxy] Server error (${response.status}). Attempt ${attempt + 1}/${RATE_LIMIT_CONFIG.maxRetries + 1}. ` +
                        `Retrying in ${estimatedWaitSeconds}s...`
                    );
                    await sleep(backoffDelay);
                    continue;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("No response from Archie proxy");
            }

            return parseDiagramResponse(text);

        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Network errors: retry with backoff
            if (attempt < RATE_LIMIT_CONFIG.maxRetries && (error instanceof Error && error.message.includes("fetch"))) {
                const backoffDelay = calculateBackoffDelay(attempt);
                const estimatedWaitSeconds = Math.ceil(backoffDelay / 1000);

                onRetry?.({
                    attempt: attempt + 1,
                    maxRetries: RATE_LIMIT_CONFIG.maxRetries,
                    estimatedWaitSeconds,
                    reason: "Connection issue, retrying...",
                });

                await sleep(backoffDelay);
                continue;
            }

            throw lastError;
        }
    }

    throw lastError || new Error("Failed to generate diagram after multiple attempts");
}

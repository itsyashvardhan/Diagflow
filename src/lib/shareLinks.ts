import { supabase } from './supabase';
import { logger } from './logger';

/**
 * Share Link Storage - Manages short shareable links for diagrams
 * Using Supabase for true cross-device sharing.
 * Includes automatic retry logic for transient network/521 errors.
 */

interface SharedDiagram {
    id: string;
    code: string;
    title?: string;
    createdAt: string;
}

/**
 * Retry wrapper for Supabase operations.
 * Handles transient 521 (origin down) and network errors with exponential backoff.
 */
async function withRetry<T>(
    operation: () => Promise<T>,
    label: string,
    maxRetries = 2,
    baseDelayMs = 1000
): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (err: unknown) {
            lastError = err;
            const isRetryable =
                err instanceof TypeError || // Network error / CORS failure
                (err instanceof Error && /fetch|network|521|CORS/i.test(err.message));

            if (!isRetryable || attempt === maxRetries) {
                throw err;
            }

            const delay = baseDelayMs * Math.pow(2, attempt);
            logger.warn(`[${label}] Transient error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, {
                error: err instanceof Error ? err.message : String(err),
            });
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError; // Should never reach here, but satisfies TypeScript
}

/**
 * Generate a short alphanumeric ID in format xxxx-xxxx-xxxx
 */
export function generateShareId(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const segment = () => {
        let result = "";
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    return `${segment()}-${segment()}-${segment()}`;
}

/**
 * Create a shareable link for a diagram in Supabase
 * Returns the short ID and full URL
 */
export async function createShareLink(code: string, title?: string): Promise<{ id: string; url: string }> {
    // Check if configuration is valid
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
        logger.error("Supabase configuration missing", {
            hasUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
            hasKey: Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
        });
        throw new Error("Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.");
    }

    return withRetry(async () => {
        logger.info("Creating share link...", { codeLength: code.length, title });

        // First, check if this exact diagram already has a shared link
        const { data: existing, error: searchError } = await supabase!
            .from('shared_diagrams')
            .select('id')
            .eq('code', code)
            .limit(1)
            .maybeSingle();

        if (searchError) {
            logger.error("Error searching for existing share link", searchError);
            // If it's a network-level failure, throw to trigger retry
            if (searchError.message?.includes('fetch') || searchError.code === 'PGRST') {
                throw new Error(`Network error searching shared diagrams: ${searchError.message}`);
            }
        }

        if (existing) {
            logger.info("Found existing share link", existing.id);
            return {
                id: existing.id,
                url: `${window.location.origin}/d/${existing.id}`,
            };
        }

        // Generate new ID
        const id = generateShareId();
        logger.info("Generated new share ID", id);

        // Try to insert
        const { error: insertError } = await supabase!
            .from('shared_diagrams')
            .insert([
                { id, code, title }
            ]);

        if (insertError) {
            logger.error("Supabase insert error", {
                error: insertError,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint,
                code: insertError.code
            });
            throw new Error(`Failed to create share link: ${insertError.message || "Unknown error"}`);
        }

        logger.info("Share link created successfully", id);
        return {
            id,
            url: `${window.location.origin}/d/${id}`,
        };
    }, "createShareLink");
}

/**
 * Retrieve a shared diagram by ID from Supabase
 */
export async function getSharedDiagram(id: string): Promise<SharedDiagram | null> {
    if (!supabase) {
        logger.error("Supabase client not initialized");
        return null;
    }

    return withRetry(async () => {
        logger.info("Fetching shared diagram", id);

        const { data, error } = await supabase!
            .from('shared_diagrams')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            logger.error("Could not find shared diagram", {
                id,
                error,
                errorMessage: error?.message,
                errorDetails: error?.details,
                errorHint: error?.hint,
                errorCode: error?.code,
                hasData: Boolean(data)
            });
            return null;
        }

        logger.info("Shared diagram found", { id: data.id, title: data.title });
        return {
            id: data.id,
            code: data.code,
            title: data.title,
            createdAt: data.created_at
        };
    }, "getSharedDiagram");
}

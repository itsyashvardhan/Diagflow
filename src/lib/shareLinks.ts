import { supabase } from './supabase';

/**
 * Share Link Storage - Manages short shareable links for diagrams
 * Using Supabase for true cross-device sharing.
 */

interface SharedDiagram {
    id: string;
    code: string;
    title?: string;
    createdAt: string;
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
        console.error("Supabase configuration missing:", {
            hasUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
            hasKey: Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
        });
        throw new Error("Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.");
    }

    console.log("Creating share link...", { codeLength: code.length, title });

    // First, check if this exact diagram already has a shared link
    const { data: existing, error: searchError } = await supabase
        .from('shared_diagrams')
        .select('id')
        .eq('code', code)
        .limit(1)
        .maybeSingle();

    if (searchError) {
        console.error("Error searching for existing share link:", searchError);
    }

    if (existing) {
        console.log("Found existing share link:", existing.id);
        return {
            id: existing.id,
            url: `${window.location.origin}/d/${existing.id}`,
        };
    }

    // Generate new ID
    let id = generateShareId();
    console.log("Generated new share ID:", id);

    // Try to insert (Supabase will handle ID collision if PK fails, but we can retry once if needed)
    const { error: insertError } = await supabase
        .from('shared_diagrams')
        .insert([
            { id, code, title }
        ]);

    if (insertError) {
        console.error("Supabase insert error:", {
            error: insertError,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
        });
        throw new Error(`Failed to create share link: ${insertError.message || "Unknown error"}`);
    }

    console.log("Share link created successfully:", id);
    return {
        id,
        url: `${window.location.origin}/d/${id}`,
    };
}

/**
 * Retrieve a shared diagram by ID from Supabase
 */
export async function getSharedDiagram(id: string): Promise<SharedDiagram | null> {
    if (!supabase) {
        console.error("Supabase client not initialized");
        return null;
    }

    console.log("Fetching shared diagram:", id);

    const { data, error } = await supabase
        .from('shared_diagrams')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error("Could not find shared diagram:", {
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

    console.log("Shared diagram found:", { id: data.id, title: data.title });
    return {
        id: data.id,
        code: data.code,
        title: data.title,
        createdAt: data.created_at
    };
}

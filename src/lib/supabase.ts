import { createClient } from '@supabase/supabase-js';

// Supabase configuration - disabled warning for cleaner console
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Only create a client if the URL is valid to prevent "supabaseUrl is required" error
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabasePublishableKey)
    : (null as any);



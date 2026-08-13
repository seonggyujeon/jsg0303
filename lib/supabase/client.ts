import { createClient } from "@supabase/supabase-js";

// Supabase publishable keys are designed for browser use. Database and Storage
// access is restricted by Row Level Security; no secret/service key is bundled.
const SUPABASE_URL = "https://cjyejnsgzefunksymfat.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TEBwdW9yAuwIAe_07QyMHA_l2kfLkPY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

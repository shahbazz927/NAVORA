// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ============================================================================
// Credentials are read ONLY from Vite env vars (.env file at project root) so
// secrets never live in source code. The .env file is git-ignored.
//
// Required vars:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file at the project root.'
  );
}

// TEMP DEBUG (lengths only — never the secret values).
// Remove after diagnosing the "Failed to fetch" issue.
console.log(
  '[supabase] VITE_SUPABASE_URL length =',
  String(SUPABASE_URL).length,
  '| prefix =',
  String(SUPABASE_URL).slice(0, 8)
);
console.log(
  '[supabase] VITE_SUPABASE_ANON_KEY length =',
  String(SUPABASE_ANON_KEY).length
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
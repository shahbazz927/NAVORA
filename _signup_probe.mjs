import { createClient } from '@supabase/supabase-js';

const URL = process.env.VITE_SUPABASE_URL || "https://wqpweslcmayzqhczcddi.supabase.co";
const KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_pbNSi0fW7C73lcSpxMtosw_DP7-AoGo";

console.log('Node version:', process.version);
console.log('Checking global fetch exists:', typeof fetch === 'function');

const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

const email = 'probe-' + Date.now() + '@gmail.com';

console.log('Calling supabase.auth.signUp() with email:', email);

try {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'TestPass123!',
    options: { data: { full_name: 'Probe User' } },
  });
  console.log('=== signUp result ===');
  console.log('data keys:', data ? Object.keys(data) : null);
  console.log('data.user?.id:', data?.user?.id || '(none)');
  console.log('error:', error);
  if (error) {
    console.log('error.name:', error.name);
    console.log('error.message:', error.message);
    console.log('error.stack:', error.stack);
  }
} catch (err) {
  console.log('=== signUp THREW (this is the Failed to fetch path) ===');
  console.log('err:', err);
  console.log('err.name:', err.name);
  console.log('err.message:', err.message);
  console.log('err instanceof TypeError:', err instanceof TypeError);
  console.log('err.cause:', err.cause);
  console.log('err.stack:', err.stack);
}
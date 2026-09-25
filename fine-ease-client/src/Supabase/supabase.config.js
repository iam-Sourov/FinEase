import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kqwmywrdtfyxrqgisrqw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxd215d3JkdGZ5eHJxZ2lzcnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNTgzNjcsImV4cCI6MjEwMTkzNDM2N30.gDltqkKiIs_tNE6jjCn5hUSj5VhnohobSYzu8C6M1oU';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables missing in environment. Using embedded Supabase project fallbacks.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

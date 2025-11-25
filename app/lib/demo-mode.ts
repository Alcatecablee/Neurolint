/**
 * Demo Mode Configuration
 * Enables testing without Supabase credentials
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                        (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV === 'development');

export function isDemoMode(): boolean {
  return DEMO_MODE;
}

export function validateSupabaseConfig() {
  if (isDemoMode()) {
    console.log('[Demo Mode] Bypassing Supabase validation');
    return true;
  }
  
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  
  const hasValidConfig = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder');
  
  return hasValidConfig;
}

export const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@neurolint.dev',
  full_name: 'Demo User',
  first_name: 'Demo',
  last_name: 'User',
  avatar_url: null,
  plan: 'professional' as const,
  subscription_status: 'active' as const,
  email_confirmed: true,
  trial_ends_at: null,
  subscription_id: 'demo-sub-123',
  payment_method: 'card' as const,
  usage: {
    remainingFixes: 1000,
    remainingAnalyzes: 500,
    lastReset: new Date().toISOString(),
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_SESSION = {
  user: DEMO_USER,
  access_token: 'demo-token-' + Date.now(),
  expires_at: Date.now() + 86400000,
};
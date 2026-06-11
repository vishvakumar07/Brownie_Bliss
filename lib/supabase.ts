// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Warn loudly in dev if the keys look wrong (real anon keys are JWTs starting with "eyJ")
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  (!supabaseAnonKey.startsWith('eyJ') || !supabaseUrl.includes('supabase.co'))
) {
  console.error(
    '⚠️  Supabase env vars look invalid.\n' +
    '  NEXT_PUBLIC_SUPABASE_URL should be: https://<project-ref>.supabase.co\n' +
    '  NEXT_PUBLIC_SUPABASE_ANON_KEY should be a long JWT starting with "eyJ..."\n' +
    '  Get them from: Supabase Dashboard → Project Settings → API'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

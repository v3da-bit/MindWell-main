import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzbapjgyxdcargacupeb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmFwamd5eGRjYXJnYWN1cGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDU4NDksImV4cCI6MjA3NDEyMTg0OX0.mAswZMbMohsR5EQmTQrtl2aJaIUHLWKF4UB5ia6-MqM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client for API routes
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmFwamd5eGRjYXJnYWN1cGViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU0NTg0OSwiZXhwIjoyMDc0MTIxODQ5fQ.8MlBWlMHTTuCnvtp8OMuRVKWkPLaFor-qkIYoPCpGbo'
)

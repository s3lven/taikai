import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const redirectURL = import.meta.env.PROD
  ? import.meta.env.VITE_FRONTEND_URL
  : "http://localhost:5173/dashboard"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSupabaseUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.access_token
}

export default supabase

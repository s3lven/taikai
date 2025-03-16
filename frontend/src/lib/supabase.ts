import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSupabaseUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.access_token
}

export default supabase

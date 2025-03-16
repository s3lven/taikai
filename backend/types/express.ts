import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../models/supabase.models"

declare global {
  namespace Express {
    interface Request {
      user: User | null
      supabase: Supabase
    }
  }
}

export type Supabase = SupabaseClient<Database>

interface User {
  id: string
  email?: string
  app_metadata: {
    provider?: string
    [key: string]: any
  }
  user_metadata: {
    [key: string]: any
  }
  aud: string
  created_at: string
}

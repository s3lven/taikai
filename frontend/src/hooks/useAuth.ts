import supabase from "@/lib/supabase"
import { User } from "@/types/auth.types"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)

    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)

    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Signout Error", error)
  }

  const user: User = {
    name: session?.user.user_metadata.name,
    email: session?.user.email,
    image: session?.user.user_metadata.picture,
    joined_at: session?.user.created_at,
  }
  
  return { session, loading, signOut, user }
}

export default useAuth

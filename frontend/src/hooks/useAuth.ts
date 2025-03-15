import supabase from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Signout Error", error)
  }

  const user: {
    name: string
    email: string | undefined
    image: string
  } = {
    name: session?.user.user_metadata.name ?? "",
    email: session?.user.email,
    image: session?.user.user_metadata.picture ?? "",
  }

  return { session, signOut, user }
}

export default useAuth

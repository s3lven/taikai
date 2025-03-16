import { createClient } from "@supabase/supabase-js"
import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError"

const SUPABASE_URL = process.env.SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ""

// Middleware to verify JWT from the client
const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    // Public access - use anon key
    req.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    req.user = null
    return next()
  }

  try {
    // Create supabase client with user's JWT
    req.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Get the user data to have it available in routes
    const {
      data: { user },
      error,
    } = await req.supabase.auth.getUser()

    if (error) throw new AppError(error.message)
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export default authenticateToken

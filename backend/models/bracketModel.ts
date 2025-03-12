import { Database } from "./supabase.models"

export type BracketStatusType = Database["public"]["Enums"]["bracket_status"]
export type BracketType = Database["public"]["Enums"]["bracket_type"]

export type Bracket = Database["public"]["Tables"]["brackets"]["Row"]

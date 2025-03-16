import { Database } from "./supabase.models"

export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"]
export type TournamentStatusType = Database["public"]["Enums"]["tournament_status"]

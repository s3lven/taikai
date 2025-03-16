import { Database } from "./supabase.models";

export type IpponType = Database["public"]["Enums"]["ippon_type"]

export type Match = Database["public"]["Tables"]["matches"]["Row"]

export type NewMatch = Database["public"]["Tables"]["matches"]["Insert"]

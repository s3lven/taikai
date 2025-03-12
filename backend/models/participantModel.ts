import { Database } from "./supabase.models";

export type Participant = Database["public"]["Tables"]["participants"]["Row"]


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bracket_participants: {
        Row: {
          bracket_id: number
          id: number
          participant_id: number
          sequence: number
        }
        Insert: {
          bracket_id: number
          id?: number
          participant_id: number
          sequence: number
        }
        Update: {
          bracket_id?: number
          id?: number
          participant_id?: number
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "bracket_participants_bracket_id_fkey"
            columns: ["bracket_id"]
            isOneToOne: false
            referencedRelation: "brackets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bracket_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      brackets: {
        Row: {
          id: number
          name: string
          status: Database["public"]["Enums"]["bracket_status"]
          tournament_id: number
          type: Database["public"]["Enums"]["bracket_type"]
        }
        Insert: {
          id?: number
          name: string
          status?: Database["public"]["Enums"]["bracket_status"]
          tournament_id: number
          type?: Database["public"]["Enums"]["bracket_type"]
        }
        Update: {
          id?: number
          name?: string
          status?: Database["public"]["Enums"]["bracket_status"]
          tournament_id?: number
          type?: Database["public"]["Enums"]["bracket_type"]
        }
        Relationships: [
          {
            foreignKeyName: "brackets_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          bracket_id: number
          bye_match: boolean
          created_at: string | null
          id: number
          match: number
          player1_id: number | null
          player1_score: Database["public"]["Enums"]["ippon_type"][] | null
          player2_id: number | null
          player2_score: Database["public"]["Enums"]["ippon_type"][] | null
          round: number
          updated_at: string | null
          winner_id: number | null
        }
        Insert: {
          bracket_id: number
          bye_match?: boolean
          created_at?: string | null
          id?: number
          match: number
          player1_id?: number | null
          player1_score?: Database["public"]["Enums"]["ippon_type"][] | null
          player2_id?: number | null
          player2_score?: Database["public"]["Enums"]["ippon_type"][] | null
          round: number
          updated_at?: string | null
          winner_id?: number | null
        }
        Update: {
          bracket_id?: number
          bye_match?: boolean
          created_at?: string | null
          id?: number
          match?: number
          player1_id?: number | null
          player1_score?: Database["public"]["Enums"]["ippon_type"][] | null
          player2_id?: number | null
          player2_score?: Database["public"]["Enums"]["ippon_type"][] | null
          round?: number
          updated_at?: string | null
          winner_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_bracket_id_fkey"
            columns: ["bracket_id"]
            isOneToOne: false
            referencedRelation: "brackets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      tournament_editors: {
        Row: {
          added_at: string | null
          tournament_id: number
          user_id: string
        }
        Insert: {
          added_at?: string | null
          tournament_id: number
          user_id: string
        }
        Update: {
          added_at?: string | null
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_editors_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          creator_id: string
          date: string
          id: number
          location: string
          name: string
          status: Database["public"]["Enums"]["tournament_status"]
        }
        Insert: {
          creator_id: string
          date: string
          id?: number
          location: string
          name: string
          status?: Database["public"]["Enums"]["tournament_status"]
        }
        Update: {
          creator_id?: string
          date?: string
          id?: number
          location?: string
          name?: string
          status?: Database["public"]["Enums"]["tournament_status"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tournaments: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      reset_bracket: {
        Args: {
          reset_bracket_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      bracket_status: "Editing" | "In Progress" | "Completed"
      bracket_type:
        | "Single Elimination"
        | "Double Elimination"
        | "Round Robin"
        | "Swiss"
      ippon_type:
        | "Men"
        | "Kote"
        | "Do"
        | "Tsuki"
        | "Hantei"
        | "Hansoku"
        | "None"
      tournament_status: "Active" | "Upcoming" | "Past"
    }
    CompositeTypes: {
      change_record: {
        entity_type: string | null
        change_type: string | null
        entity_id: number | null
        payload: Json | null
        timestamp: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

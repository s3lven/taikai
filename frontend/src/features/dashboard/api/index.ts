import { getSupabaseUser } from "@/lib/supabase"
import {
  Bracket,
  CreateBracketForm,
  CreateTournamentForm,
  Tournament,
  TournamentForm,
} from "@/types"

const API_URL_TOURNAMENT = import.meta.env.PROD ? `${import.meta.env.VITE_BACKEND_URL}/api/tournaments` : "/api/tournaments"
const API_URL_BRACKET = import.meta.env.PROD ? `${import.meta.env.VITE_BACKEND_URL}/api/brackets` : "/api/brackets"

type ResponsePayload<T> = {
  message: string
  payload: T
}

export const getTournaments = async (): Promise<Tournament[]> => {
  const response = await fetch(`${API_URL_TOURNAMENT}`)
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments")
  }
  const data: ResponsePayload<Tournament[]> = await response.json()
  return data.payload
}

export const getUserTournaments = async (): Promise<Tournament[]> => {
  const response = await fetch(`${API_URL_TOURNAMENT}/user-tournaments`, {
    headers: {
      Authorization: `Bearer ${await getSupabaseUser()}`,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments")
  }
  const data: ResponsePayload<Tournament[]> = await response.json()
  return data.payload
}

export const createTournament = async (
  tournament: CreateTournamentForm
): Promise<Tournament> => {
  const response = await fetch(`${API_URL_TOURNAMENT}`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getSupabaseUser()}`,
    },
    body: JSON.stringify(tournament),
  })
  if (!response.ok) {
    throw new Error("Failed to create tournament")
  }
  const data: ResponsePayload<Tournament> = await response.json()
  return data.payload
}

export const updateTournament = async ({
  id,
  tournament,
}: {
  id: number
  tournament: TournamentForm
}) => {
  const response = await fetch(`${API_URL_TOURNAMENT}/${id}`, {
    method: `PUT`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getSupabaseUser()}`,
    },
    body: JSON.stringify(tournament),
  })
  if (!response.ok) {
    throw new Error("Failed to update tournament")
  }
  const data: ResponsePayload<Tournament[]> = await response.json()
  return data.payload[0]
}

export const deleteTournament = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL_TOURNAMENT}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${await getSupabaseUser()}`,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to delete tournament")
  }
  return
}

export const createBracket = async (bracket: CreateBracketForm) => {
  const response = await fetch(`${API_URL_BRACKET}`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bracket),
  })
  if (!response.ok) {
    throw new Error("Failed to create tournament")
  }
  const data: ResponsePayload<Bracket> = await response.json()
  return data.payload
}

export const deleteBracket = async ({
  bracketID,
}: {
  tournamentID: number
  bracketID: number
}): Promise<void> => {
  const response = await fetch(`${API_URL_BRACKET}/${bracketID}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete bracket")
  }
  return
}

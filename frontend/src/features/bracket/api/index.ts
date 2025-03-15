import { Bracket, Match, Participant, Tournament } from "@/types";
import { Change } from "@/types/changes";

const API_URL = "/api/brackets";

type ResponsePayload<T> = {
  message: string;
  payload: T;
};

interface BracketInfoPayload {
  tournament: Omit<Tournament, "brackets">;
  bracket: Bracket;
  participants: Participant[];
  matches: Match[][];
}

export const getAllBracketInfo = async (
  bracketID: number
): Promise<BracketInfoPayload> => {
  const response = await fetch(`${API_URL}/${bracketID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bracket information");
  }
  const data: ResponsePayload<BracketInfoPayload> = await response.json();
  return data.payload;
};

export const batchUpdateBracket = async (changes: Change[]) => {
  const response = await fetch(`${API_URL}/batch-update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ changes }),
  });
  if (!response.ok) throw new Error("Failed to save changes to bracket");
};

export const runBracket = async (id: number, changes?: []) => {
  const response = await fetch(`${API_URL}/${id}/run`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ changes }),
  });
  if (!response.ok) throw new Error("Failed to run the bracket");
};

export const resetBracket = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}/reset`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to reset the bracket");
};

export const openBracket = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}/open`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to open the bracket");
};

export const completeBracket = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to complete the bracket");
};

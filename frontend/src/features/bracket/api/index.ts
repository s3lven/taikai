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
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(`${API_URL}/${bracketID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bracket information");
  }
  const data: ResponsePayload<BracketInfoPayload> = await response.json();
  console.log(data);
  return data.payload;
};

export const batchUpdateBracket = async (changes: Change[]) => {
  const response = await fetch(`/api/brackets/batch-update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ changes }),
  });
  if (!response.ok) throw new Error("Failed to save changes to bracket");
  console.log("Chanes saved successfully");
};

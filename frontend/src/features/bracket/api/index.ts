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
  console.log("Received changes: ", changes);
  const plainChanges = changes.map((change) => ({
    ...change,
    payload: JSON.parse(JSON.stringify(change.payload)),
  }));
  console.log("Plain changes: ", plainChanges);

  const response = await fetch(`http://localhost:3001/api/brackets/changes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ changes: plainChanges }),
  });
  if (!response.ok) throw new Error("Failed to save changes to bracket");
  console.log("Chanes saved successfully");
};

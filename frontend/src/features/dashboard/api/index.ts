import { Tournament } from "@/types";

const API_URL = "/api/tournaments"

export const getTournaments = async (): Promise<Tournament[]> => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments");
  }
  return await response.json();
};

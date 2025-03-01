import { Tournament } from "@/types";

const API_URL = "/api/tournaments";

type ResponsePayload<T> = {
  message: string;
  payload: T;
};

export const getTournaments = async (): Promise<Tournament[]> => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments");
  }
  const data: ResponsePayload<Tournament[]> = await response.json();
  return data.payload;
};

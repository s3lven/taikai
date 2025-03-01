import { Tournament, TournamentForm } from "@/types";

const API_URL = "/api/tournaments";

type ResponsePayload<T> = {
  message: string;
  payload: T;
};

export const getTournaments = async (): Promise<Tournament[]> => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments");
  }
  const data: ResponsePayload<Tournament[]> = await response.json();
  return data.payload;
};

export const createTournament = async (
  tournament: TournamentForm
): Promise<Tournament> => {
  const response = await fetch(`${API_URL}`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tournament),
  });
  if (!response.ok) {
    throw new Error("Failed to create tournament");
  }
  const data: ResponsePayload<Tournament> = await response.json();
  return data.payload;
};

export const updateTournament = async ({
  id,
  tournament,
}: {
  id: number;
  tournament: TournamentForm;
}) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: `PUT`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tournament),
  });
  if (!response.ok) {
    throw new Error("Failed to update tournament");
  }
  const data: ResponsePayload<Tournament> = await response.json();
  return data.payload;
};

export const deleteTournament = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete tournaments");
  }
  return;
};

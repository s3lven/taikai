// import { act, render, renderHook, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";
// import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store";
// import { mockTournament } from "./mocks";
// import TournamentEditDialog from "@/features/dashboard/components/dialogs/tournament-edit-dialog";
// import userEvent from "@testing-library/user-event";
// import TournamentNewDialog from "@/features/dashboard/components/dialogs/tournament-new-dialog";
// import TournamentViewDialog from "@/features/dashboard/components/dialogs/tournament-view-dialog";
// import { http, HttpResponse } from "msw";
// import { CreateTournament, Tournament } from "@/types";
// import { server } from "./mocks/server";

// describe("Tournament Edit Dialog", () => {
//   it("renders the edit dialog with tournament name", () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setEditingTournament(mockTournament);
//     });

//     render(<TournamentEditDialog />);

//     expect(screen.getByText(`Edit ${mockTournament.name}`)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("NCKF Taikai")).toHaveValue(
//       mockTournament.name
//     );
//   });

//   it("updates tournament on form submission", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     await act(async () => {
//       await result.current.fetchTournaments();
//       result.current.setEditingTournament(mockTournament);
//     });

//     render(<TournamentEditDialog />);

//     const input = screen.getByPlaceholderText("NCKF Taikai");
//     const submitButton = screen.getByText("Submit");

//     await userEvent.clear(input);
//     await userEvent.type(input, "Updated Tournament Name");
//     await userEvent.click(submitButton);

//     expect(result.current.editingTournament).toBeNull();
//     const updatedTournament = result.current.tournaments.find(
//       (t) => t.id === mockTournament.id
//     );
//     expect(updatedTournament?.name).toBe("Updated Tournament");
//   });

//   it("closes dialog when cancel is clicked", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setEditingTournament(mockTournament);
//     });

//     render(<TournamentEditDialog />);

//     // Simulate closing the dialog
//     await userEvent.keyboard("{Escape}");

//     expect(result.current.editingTournament).toBeNull();
//   });
// });

// describe("Tournament New Dialog", () => {
//   it("renders the new tournament dialog", () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setIsAddingTournament(true);
//     });

//     render(<TournamentNewDialog />);

//     expect(screen.getByText("New Taikai")).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("NCKF Taikai")).toBeInTheDocument();
//   });

//   it("adds a new tournament on form submission", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     server.use(
//       http.post("/api/tournaments", async ({ request }) => {
//         const { name, status, location, date, numberOfParticipants } =
//           (await request.json()) as CreateTournament;
//         const newTournament: Tournament = {
//           id: Date.now(),
//           name,
//           status,
//           location,
//           date,
//           numberOfParticipants,
//           brackets: [],
//         };
//         return HttpResponse.json(newTournament, { status: 201 });
//       })
//     );

//     await act(async () => {
//       await result.current.fetchTournaments();
//       result.current.setIsAddingTournament(true);
//     });

//     render(<TournamentNewDialog />);

//     const input = screen.getByPlaceholderText("NCKF Taikai");
//     const submitButton = screen.getByText("Submit");

//     await userEvent.type(input, "New Tournament");
//     await userEvent.click(submitButton);

//     expect(result.current.tournaments).toHaveLength(2);
//     expect(result.current.tournaments[1].name).toBe("New Tournament");
//     expect(result.current.isAddingTournament).toBeFalsy();
//   });

//   it("prevents submission of invalid tournament name", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setIsAddingTournament(true);
//     });

//     render(<TournamentNewDialog />);

//     const input = screen.getByPlaceholderText("NCKF Taikai");
//     const submitButton = screen.getByText("Submit");

//     // Try to submit with a too short name
//     await userEvent.type(input, "A");
//     await userEvent.click(submitButton);

//     expect(
//       screen.getByText("Name must be longer than 2 characters")
//     ).toBeInTheDocument();
//     expect(result.current.isAddingTournament).toBeTruthy();
//     expect(result.current.tournaments).toHaveLength(0);
//   });
// });

// describe("Tournament View Dialog", () => {
//   it("renders tournament details and brackets", () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setViewingTournament(mockTournament);
//     });

//     render(<TournamentViewDialog />);

//     const elements = screen.getAllByText("Beginner Bracket");

//     expect(screen.getByText(mockTournament.name)).toBeInTheDocument();
//     expect(screen.getByText("Select a bracket below")).toBeInTheDocument();
//     expect(elements).toHaveLength(2);
//   });

//   it("closes dialog when escape is pressed", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     act(() => {
//       result.current.setViewingTournament(mockTournament);
//     });

//     render(<TournamentViewDialog />);

//     // Simulate closing the dialog
//     await userEvent.keyboard("{Escape}");

//     expect(result.current.viewingTournament).toBeNull();
//   });
// });

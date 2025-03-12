// import { describe, it, expect } from "vitest";
// import { act, renderHook } from "@testing-library/react";
// import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store";
// import { createMockTournament, mockTournament } from "./mocks";

// describe("Tournament Store", () => {
//   it("should initialize with empty state", () => {
//     const { result } = renderHook(() => useTournamentStore());

//     expect(result.current.tournaments).toEqual([]);
//     expect(result.current.editingTournament).toBeNull();
//     expect(result.current.viewingTournament).toBeNull();
//     expect(result.current.isAddingTournament).toBeFalsy();
//   });

//   it("should add a tournament", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     await act(async () => {
//       await result.current.addTournament(createMockTournament);
//     });

//     expect(result.current.tournaments).toHaveLength(1);
//     expect(result.current.tournaments[0]).toEqual(mockTournament);
//   });

//   it("should remove a tournament", async () => {
//     const { result } = renderHook(() => useTournamentStore());

//     await act(async () => {
//       await result.current.addTournament(mockTournament);
//       await result.current.removeTournament(mockTournament.id);
//     });

//     expect(result.current.tournaments).toHaveLength(0);
//   });

//   it("should update a tournament", async () => {
//     const { result } = renderHook(() => useTournamentStore());
//     const updatedTournament = { ...mockTournament, name: "Updated Tournament" };

//     await act(async () => {
//       await result.current.addTournament(mockTournament);
//       await result.current.updateTournament(
//         mockTournament.id,
//         updatedTournament
//       );
//     });

//     expect(result.current.tournaments[0].name).toBe("Updated Tournament");
//   });
// });

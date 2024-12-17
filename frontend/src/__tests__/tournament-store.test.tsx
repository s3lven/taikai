import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTournamentStore } from "@/stores/tournament-store";
import { mockTournament } from "./mocks";

describe("Tournament Store", () => {
	it('should initialize with empty state', () => {
        const { result } = renderHook(() => useTournamentStore());
    
        expect(result.current.tournaments).toEqual([]);
        expect(result.current.editingTournament).toBeNull();
        expect(result.current.viewingTournament).toBeNull();
        expect(result.current.isAddingTournament).toBeFalsy();
      });
    
      it('should add a tournament', () => {
        const { result } = renderHook(() => useTournamentStore());
    
        act(() => {
          result.current.addTournament(mockTournament);
        });
    
        expect(result.current.tournaments).toHaveLength(1);
        expect(result.current.tournaments[0]).toEqual(mockTournament);
      });
    
      it('should remove a tournament', () => {
        const { result } = renderHook(() => useTournamentStore());
    
        act(() => {
          result.current.addTournament(mockTournament);
          result.current.removeTournament(mockTournament.id);
        });
    
        expect(result.current.tournaments).toHaveLength(0);
      });
    
      it('should update a tournament', () => {
        const { result } = renderHook(() => useTournamentStore());
        const updatedTournament = { ...mockTournament, name: 'Updated Tournament' };
    
        act(() => {
          result.current.addTournament(mockTournament);
          result.current.updateTournament(mockTournament.id, updatedTournament);
        });
    
        expect(result.current.tournaments[0].name).toBe('Updated Tournament');
      });
});

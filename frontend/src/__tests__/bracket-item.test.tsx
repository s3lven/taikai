import { act, render, renderHook, screen } from "@testing-library/react";
import { mockBracket, mockTournament } from "./mocks";
import userEvent from "@testing-library/user-event";
import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store";
import { describe, it, expect } from "vitest";
import BracketSettings from "@/features/dashboard/components/bracket-settings";
import BracketItem from "@/features/dashboard/components/bracket-item";

describe("Bracket Item", () => {
  it("renders bracket details correctly", () => {
    render(<BracketItem bracket={mockBracket} />);

    expect(screen.getAllByText(mockBracket.name)).toHaveLength(2);
    expect(screen.getByText(mockBracket.status)).toBeInTheDocument();
    expect(
      screen.getByText(mockBracket.numberOfParticipants.toString())
    ).toBeInTheDocument();
  });
});

describe("Bracket Settings", () => {
  it("opens dropdown menu and allows bracket deletion", async () => {
    const { result } = renderHook(() => useTournamentStore());

    // Set up a viewing tournament with the bracket
    act(() => {
      result.current.setInitialTournaments([mockTournament]);
      result.current.setViewingTournament(mockTournament);
    });

    render(<BracketSettings bracket={mockBracket} />);

    // Open dropdown
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);

    // Find and click delete
    const deleteButton = screen.getByText("Delete");
    await userEvent.click(deleteButton);

    // Verify bracket was removed
    const updatedTournament = result.current.tournaments[0];
    expect(updatedTournament.brackets).toHaveLength(0);
  });
});

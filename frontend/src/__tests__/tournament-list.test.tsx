import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTournamentStore } from "@/stores/tournament-store";
import { mockTournament } from "./mocks";

import TournamentList from "@/features/dashboard/components/tournament-list";
import userEvent from "@testing-library/user-event";
import TournamentSettings from "@/features/dashboard/components/tournament-settings";

describe("Tournament List", () => {
	it("filters by status", () => {
		const activeTournament = { ...mockTournament, status: "Active" };
		const upcomingTournament = { ...mockTournament, id: 2, status: "Upcoming" };

		const { result } = renderHook(() => useTournamentStore());
		act(() => {
			result.current.setInitialTournaments([
				activeTournament,
				upcomingTournament,
			]);
		});

		render(<TournamentList status="Active" />);

		expect(screen.getByText("Active Tournaments")).toBeInTheDocument();
		expect(screen.getByText("Test Tournament"));
	});

	it("views dialog when clicking tournament", async () => {
		const { result } = renderHook(() => useTournamentStore());

		act(() => {
			result.current.setInitialTournaments([mockTournament]);
		});

		render(<TournamentList status="Active" />);

		const tournamentCard = screen.getByText("Test Tournament");
		await userEvent.click(tournamentCard);

		expect(result.current.viewingTournament).toEqual(mockTournament);
	});
});

describe("Tournament Settings", () => {
	it("opens drowdown menu and allows tournament editing", async () => {
		const { result } = renderHook(() => useTournamentStore());

		act(() => {
			result.current.setInitialTournaments([mockTournament]);
		});

		render(<TournamentSettings tournament={mockTournament} />);

		const trigger = screen.getByRole("button");
		await userEvent.click(trigger);

		const editButton = screen.getByText("Edit");
		await userEvent.click(editButton);

		expect(result.current.editingTournament).toEqual(mockTournament);
	});

	it("opens drowdown menu and allows tournament deletion", async () => {
		const { result } = renderHook(() => useTournamentStore());

		act(() => {
			result.current.setInitialTournaments([mockTournament]);
		});

		render(<TournamentSettings tournament={mockTournament} />);

		const trigger = screen.getByRole("button");
		await userEvent.click(trigger);

		const button = screen.getByText("Delete");
		await userEvent.click(button);

		expect(result.current.tournaments).toHaveLength(0);
	});
});

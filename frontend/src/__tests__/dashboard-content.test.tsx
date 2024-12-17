import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DashboardContent from "@/features/dashboard/components/dashboard-content";
import { useTournamentStore } from "@/stores/tournament-store";
import { mockTournament } from "./mocks";

describe("Dashboard Content", () => {
	it("renders tournament when tournaments exist", () => {
		const { result } = renderHook(() => useTournamentStore());

		act(() => {
			result.current.setInitialTournaments([mockTournament]);
		});

		render(<DashboardContent />);

		expect(screen.getByText("Active Tournaments")).toBeInTheDocument();
		expect(screen.getByText("Test Tournament")).toBeInTheDocument();
	});

	it("renders empty dashboard when no tournaments exist", () => {
		const { result } = renderHook(() => useTournamentStore());

		act(() => {
			result.current.setInitialTournaments([]);
		});

		render(<DashboardContent />);

		expect(screen.getByText("There's nothing here!")).toBeInTheDocument();
		expect(screen.getByText("Let's fix that.")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});
});

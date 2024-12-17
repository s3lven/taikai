import { useEffect } from "react";
import EmptyDashboard from "./empty-dashboard";
import { dummyTournamentData } from "@/types";
import { useTournamentStore } from "@/stores/tournament-store";
import TournamentList from "./tournament-list";

const DashboardContent = () => {
	const { setInitialTournaments, tournaments } = useTournamentStore();

	useEffect(() => {
		// Simulate fetch
		setInitialTournaments(dummyTournamentData);
	}, [setInitialTournaments]);

	return tournaments.length > 0 ? (
		<div className="w-full flex flex-col gap-12 pt-6">
			<TournamentList status="Active" />
			<TournamentList status="Upcoming" />
			<TournamentList status="Past" />
		</div>
	) : (
		<EmptyDashboard />
	);
};

export default DashboardContent;

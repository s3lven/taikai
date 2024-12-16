import { useEffect } from "react";
import DashboardSection from "./dashboard-section";
import EmptyDashboard from "./empty-dashboard";
import { dummyTournamentData } from "@/types";
import { useTournamentStore } from "@/stores/tournament-store";

const DashboardContent = () => {
	const { setInitialTournaments, tournaments } = useTournamentStore();

	useEffect(() => {
		// Simulate fetch
		setInitialTournaments(dummyTournamentData);
	}, [setInitialTournaments]);

	return tournaments.length > 0 ? (
		<div className="w-full flex flex-col gap-12 pt-6">
			<DashboardSection status="Active" />
			<DashboardSection status="Upcoming" />
			<DashboardSection status="Past" />
		</div>
	) : (
		<EmptyDashboard />
	);
};

export default DashboardContent;

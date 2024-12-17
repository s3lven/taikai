import { useEffect } from "react";
import { dummyTournamentData } from "@/types";
import { useTournamentStore } from "@/stores/tournament-store";
import TournamentList from "./tournament-list";
import { Button } from "@/components/ui/button";

const EmptyDashboard = () => {
	const { setIsAddingTournament } = useTournamentStore();

	return (
		<div className="flex flex-col items-center justify-center gap-4 h-full flex-1">
			<h1 className="text-figma_dark text-title">There&apos;s nothing here!</h1>
			<h1 className="text-figma_dark text-title">Let&apos;s fix that.</h1>
			<Button
					className="bg-figma_shade2 hover:bg-figma_shade2/90 text-white 
                    transition-transform hover:scale-105 duration-300"
					onClick={() => setIsAddingTournament(true)}
				>
					Create New Taikai
				</Button>
		</div>
	);
};

const DashboardContent = () => {
	const { setInitialTournaments, tournaments } = useTournamentStore();

	useEffect(() => {
		// Simulate fetch -- commented out for testing
		// setInitialTournaments(dummyTournamentData);
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

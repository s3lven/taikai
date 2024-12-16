import BracketDialog from "./bracket-dialog";
import { useTournamentStore } from "@/stores/tournament-store";

interface DashboardSectionProps {
	status: string;
}

const DashboardSection = ({ status }: DashboardSectionProps) => {
	const tournamentData = useTournamentStore((state) => state.tournaments);
	const filteredTournamentData = tournamentData.filter(
		(tournament) => tournament.status === status
	);

	return (
		filteredTournamentData.length > 0 && (
			<div className="space-y-4">
				{/* Header */}
				<div className="w-full flex justify-between">
					<h1 className="text-headline text-figma_dark">
						{status} Tournaments
					</h1>
				</div>
				{/* List */}
				<div className="w-full flex flex-wrap gap-6">
					{filteredTournamentData.map((tournament, index) => (
						<div key={index}>
							{/* Dialog Trigger */}
							<BracketDialog tournament={tournament} />
						</div>
					))}
				</div>
			</div>
		)
	);
};

export default DashboardSection;

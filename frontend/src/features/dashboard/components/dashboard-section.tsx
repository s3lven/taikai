import { Tournament } from "@/types";
import BracketDialog from "./bracket-dialog";

interface DashboardSectionProps {
	tournamentData: Tournament[];
	status: string;
}

const DashboardSection = ({
	tournamentData,
	status,
}: DashboardSectionProps) => {
	return (
		<>
			{/* Header */}
			<div className="w-full flex justify-between">
				<h1 className="text-headline text-figma_dark">{status} Tournaments</h1>
				{/* <Button>Create New</Button> */}
			</div>
			{/* List */}
			<div className="w-full flex flex-wrap gap-6">
				{tournamentData
					.filter((tournament) => tournament.status === status)
					.map((tournament, index) => (
						<div key={index}>
							{/* Dialog Trigger */}
							<BracketDialog tournament={tournament} />
						</div>
					))}
			</div>
		</>
	);
};

export default DashboardSection;

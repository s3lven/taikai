import { useTournamentStore } from "@/stores/tournament-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import TournamentSettings from "./tournament-settings";

interface TournamentListProps {
	status: string;
}

const TournamentList = ({ status }: TournamentListProps) => {
	const { setViewingTournament, tournaments } = useTournamentStore();
	const filteredTournamentData = tournaments.filter(
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
				<div className="w-full flex gap-6">
					{filteredTournamentData.map((tournament) => (
						<Card
							className="w-full max-w-md shadow-md cursor-pointer font-poppins 
						hover:shadow-lg hover:scale-105 transition-all duration-300"
							onClick={() => setViewingTournament(tournament)}
							key={tournament.id}
						>
							<CardContent className="relative flex items-center justify-between w-full gap-6">
								<Avatar className="size-16">
									<AvatarImage src="" />
									<AvatarFallback className="text-white bg-figma_shade2">
										CN
									</AvatarFallback>
								</Avatar>
								<CardHeader className="flex flex-col justify-stretch px-0 flex-1">
									<CardTitle className="text-xl font-bold">
										{tournament.name}
									</CardTitle>
									<CardDescription className="text-sm text-gray-500 flex items-center gap-1">
										<span className="flex items-center h-full">
											{tournament.location} •{" "}
											{new Date(tournament.date).toLocaleDateString()} •
										</span>
										<span className="flex items-center h-full">
											<User size={14} />{" "}
											<span>{tournament.numberOfParticipants}</span>
										</span>
									</CardDescription>
								</CardHeader>
								<TournamentSettings tournament={tournament} />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	);
};

export default TournamentList;

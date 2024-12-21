import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTournamentStore } from "@/stores/tournament-store";
import { Tournament } from "@/types";

import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface TournamentSettingsProps {
	tournament: Tournament;
}

const TournamentSettings = ({ tournament }: TournamentSettingsProps) => {
	const { setEditingTournament, removeTournament } = useTournamentStore();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsDeleting(true);

		void removeTournament(tournament.id);

		setIsDeleting(false);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='absolute right-4
                rounded-full  p-2 border border-transparent 
                hover:shadow-2xl hover:border-figma_shade2_30 transition-all duration-300"'
				onClick={(e) => e.stopPropagation()}
			>
				<MoreVertical className="size-8" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="font-poppins">
				<DropdownMenuLabel>{tournament.name}</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						setEditingTournament(tournament);
					}}
				>
					Edit
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-figma_error"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default TournamentSettings;

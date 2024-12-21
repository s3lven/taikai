import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTournamentStore } from "@/stores/tournament-store";
import { Bracket } from "@/types";

import { MoreVertical } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

interface BracketSettingsProps {
	bracket: Bracket;
}

const BracketSettings = ({ bracket }: BracketSettingsProps) => {
	const { viewingTournament, setViewingTournament, removeBracket } =
		useTournamentStore(
			useShallow((state) => ({
				viewingTournament: state.viewingTournament,
				setViewingTournament: state.setViewingTournament,
				removeBracket: state.removeBracket,
			}))
		);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (viewingTournament) {
			void removeBracket(bracket.id);
			setViewingTournament({
				...viewingTournament,
				brackets: viewingTournament.brackets.filter((b) => b.id !== bracket.id),
			});
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='absolute right-4 flex items-center justify-center
                rounded-full p-2 border border-transparent 
                hover:shadow-2xl hover:border-figma_shade2_30 transition-all duration-300"'
				onClick={(e) => e.stopPropagation()}
			>
				<MoreVertical />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="font-poppins">
				<DropdownMenuLabel>{bracket.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-figma_error" onClick={handleDelete}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default BracketSettings;

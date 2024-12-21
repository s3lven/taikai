import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";

const TournamentName = () => {
	const [tournamentName] = useBracketStore(useShallow((state) => [state.bracket.tournamentName]));
	return (
		<div className="w-full h-full flex flex-col gap-1">
			<p className="text-grey text-desc">Taikai Name</p>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<p
							className="w-full h-10 px-4 border text-sm ring-offset-background font-poppins text-desc flex justify-between items-center
                            bg-transparent border-figma_grey text-figma_grey rounded-md"
						>
							<span className="truncate">{tournamentName}</span>
						</p>
					</TooltipTrigger>
					<TooltipContent
						className="bg-figma_shade2 text-figma_grey border-figma_grey text-desc px-4 py-2 rounded shadow-md"
						sideOffset={5}
					>
						{tournamentName}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default TournamentName;

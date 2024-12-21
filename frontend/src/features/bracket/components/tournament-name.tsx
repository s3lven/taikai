import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const TournamentName = () => {
	const tournamentName = "Tournament Name";
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

// rounded-md border text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
// disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 min-w-[150px] w-minh-full px-4 py-0 bg-transparent border-figma_grey font-poppins text-desc flex justify-between items-center

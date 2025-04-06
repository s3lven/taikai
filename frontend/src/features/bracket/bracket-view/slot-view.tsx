import { BracketStatusType, IpponType, Match, PlayerColorType } from "@/types"
import { Triangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMatchesStore } from "@/stores/matches-store"
import { useShallow } from "zustand/react/shallow"

interface SlotProps {
	isWinner: boolean
	match: Match
	color: PlayerColorType
	status: BracketStatusType
}

const SlotView = ({ isWinner, color, match, status }: SlotProps) => {
	const player = color === "Red" ? match.player1 : match.player2
	const score = color === "Red" ? match.player1Score : match.player2Score
	const hasHansoku =
		color === "Red" ? match.hasPlayer1Hansoku : match.hasPlayer2Hansoku

	const firstRowOptions: IpponType[] = ["Men", "Kote", "Do"]
	const secondRowOptions: IpponType[] = ["Tsuki", "Hansoku", "Hantei"]

	// Formatting options to single character for button
	const renderChar = (option: string) => {
		switch (option) {
			case "Hantei":
				return "Ht"
			default:
				return option.charAt(0)
		}
	}

	const [setScore] = useMatchesStore(
		useShallow((state) => [state.setScore, state.rounds])
	)

	const handleSetScore = (option: IpponType) => {
		setScore(match.id, color, option)
	}

	return (
		<div className="w-full flex flex-col gap-[2px]">
			{/* Seed */}
			<div
				className={
					"text-label " +
					cn(
						"px-2 h-[26px] ",
						color === "Red"
							? "bg-figma_error text-white rounded-t md:rounded-tr-none"
							: "bg-white text-figma_shade2 rounded-t md:rounded-tl-none"
					)
				}
			>
				{player?.sequence}
			</div>
			{/* Name */}
			<div className="bg-figma_shade2_30 text-white px-2 text-[12px] text-desc md:text-[14px]">
				{player?.name ?? "TBD"}
			</div>
			{/* Scoreboard */}
			<div
				className={cn(
					"relative bg-figma_shade2_30 h-20 flex justify-center items-center gap-4 rounded-b",
					isWinner && "text-figma_green",
					color === "Red" ? "md:rounded-br-none" : "md:rounded-bl-none"
				)}
			>
				{score.map((s, index) => {
					const isFirstScore = index === 0 && match.firstScorer === player
					return (
						<div
							key={`${player}-${s}-${index}`}
							className={cn(
								"size-8 inline-flex justify-center items-center",
								isFirstScore && "rounded-full border-2",
								isWinner ? "border-figma_green" : "border-white"
							)}
						>
							{renderChar(s)}
						</div>
					)
				})}

				{/* Hansoku */}
				<div
					className={cn(
						"absolute bottom-4 ",
						color === "Red" ? "left-4" : "right-4"
					)}
				>
					{hasHansoku && <Triangle className="text-red-500 size-4" />}
				</div>
			</div>

			{status === "In Progress" && (
				<>
					{/* Point Options 1 */}
					<div className="grid grid-cols-3 justify-between items-center h-[42px] gap-[1px] ">
						{firstRowOptions.map((option) => (
							<Button
								key={option}
								variant={"ghost"}
								size={"icon"}
								className="bg-figma_shade2_30 w-full hover:bg-figma_shade2_30/80 text-white hover:text-white rounded-md text-sm font-normal"
								onClick={() => handleSetScore(option)}
							>
								{option}
							</Button>
						))}
					</div>
					{/* Point Options 2 */}
					<div
						className={cn(
							"grid grid-cols-3 justify-between items-center h-[42px] gap-[1px] rounded-b"
						)}
					>
						{secondRowOptions.map((option) => (
							<Button
								key={option}
								variant={"ghost"}
								size={"icon"}
								className="bg-figma_shade2_30 w-full hover:bg-figma_shade2_30/80 text-white hover:text-white rounded-md text-sm font-normal"
								onClick={() => handleSetScore(option)}
							>
								{option === "Hansoku" ? (
									<Triangle className="text-white" />
								) : (
									option
								)}
							</Button>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default SlotView

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

	const firstRowOptions: IpponType[] = ["Men", "Kote", "Do"]
	const secondRowOptions: IpponType[] = ["Tsuki", "Hansoku", "Hantei"]

	// Formatting options to single character for button
	const renderChar = (option: string) => {
		switch (option) {
			case "Hansoku":
				return <Triangle className="text-white" />
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
					"bg-figma_shade2_30 h-20 flex justify-center items-center gap-4",
					isWinner && "text-figma_green"
				)}
			>
				{score.map((s, index) => {
					const isFirstScore = index === 0 && match.firstScorer === player
					return (
						<div
							key={`${player}-${s}`}
							className={cn(
								"text-white size-8 text-center pt-[2px]",
								isFirstScore && "rounded-full border-white border-2"
							)}
						>
							{renderChar(s)}
						</div>
					)
				})}
			</div>

			{status === "In Progress" && (
				<>
					{/* Point Options 1 */}
					<div className="bg-figma_shade2_30 flex justify-between items-center px-2 h-[42px]">
						{firstRowOptions.map((option) => (
							<div
								key={option}
								className="flex items-center justify-center text-white text-label"
							>
								<Button
									variant={"ghost"}
									size={"icon"}
									className="hover:bg-figma_shade2_30 hover:text-white"
									onClick={() => handleSetScore(option)}
								>
									{renderChar(option)}
								</Button>
							</div>
						))}
					</div>
					{/* Point Options 2 */}
					<div
						className={cn(
							"bg-figma_shade2_30 flex justify-between items-center px-2 h-[42px] rounded-b",
							color === "Red" ? "md:rounded-br-none" : "md:rounded-bl-none"
						)}
					>
						{secondRowOptions.map((option) => {
							return (
								<div
									key={option}
									className="flex items-center justify-center text-white text-label"
								>
									<Button
										variant={"ghost"}
										size={"icon"}
										className="hover:bg-figma_shade2_30 hover:text-white "
										onClick={() => handleSetScore(option)}
									>
										{renderChar(option)}
									</Button>
								</div>
							)
						})}
					</div>
				</>
			)}
		</div>
	)
}

export default SlotView

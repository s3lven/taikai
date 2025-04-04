import { IpponType, Participant, PlayerColorType } from "@/types"
import { Triangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SlotProps {
	isWinner: boolean
	player: Participant | null
	score: IpponType[]
	color: PlayerColorType
}

const SlotView = ({ isWinner, player, color, score }: SlotProps) => {
	const firstRowOptions = ["Men", "Kote", "Do"]
	const secondRowOptions = ["Tsuki", "Hansoku", "Hantei"]

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
				{score.map((s) => (
					<p className="text-white">{s}</p>
				))}
			</div>
			{/* Point Options 1 */}
			<div className="bg-figma_shade2_30 flex justify-between items-center px-2 h-[42px]">
				{firstRowOptions.map((option) => (
					<div className="flex items-center justify-center text-white text-label">
						<Button
							variant={"ghost"}
							size={"icon"}
							className="hover:bg-figma_shade2_30 hover:text-white "
						>
							{option.charAt(0)}
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
						<div className="flex items-center justify-center text-white text-label">
							<Button
								variant={"ghost"}
								size={"icon"}
								className="hover:bg-figma_shade2_30 hover:text-white "
							>
								{renderChar(option)}
							</Button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default SlotView

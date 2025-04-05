import { cn } from "@/lib/utils"
import { hitMap, IpponType, Participant, PlayerColorType } from "@/types"

interface BracketSlotProps {
	variant: PlayerColorType
	player: Participant | null
	isWinner: boolean
	scores: IpponType[]
}

const BracketSlot = ({
	variant,
	player,
	isWinner,
	scores,
}: BracketSlotProps) => {
	return (
		<div className="w-[220px] h-[27px] flex items-center">
			<div
				className={cn(
					"size-[27px] flex items-center justify-center",
					variant === "Red"
						? "bg-figma_error rounded-tl text-white"
						: "bg-white text-black rounded-bl"
				)}
			>
				<p
					className={cn(
						"text-label uppercase text-center",
						player?.sequence == -1 && "opacity-0"
					)}
				>
					{player?.sequence}
				</p>
			</div>
			<div
				className={cn(
					"w-full h-[27px] flex items-center justify-center px-1 bg-figma_neutral8",
					variant === "Red" ? "rounded-tr " : "rounded-br"
				)}
			>
				<div className="w-full h-full flex items-center flex-1">
					<p
						className={
							// Need this here instead of inside cn() because the style won't show
							"text-desc " +
							cn(
								"w-[128px] truncate",
								player?.sequence == -1 && "opacity-0",
								isWinner ? "text-figma_green" : "text-white "
							)
						}
					>
						{player?.name}
					</p>
				</div>
				<div className="w-9 h-full gap-1 flex items-center justify-center">
					{scores.map((score, index) => (
						<div
							key={index}
							className="w-full h-full flex items-center justify-center"
						>
							<p
								className={
									"text-desc " +
									cn("`w-5", isWinner ? "text-figma_green" : "text-white")
								}
							>
								{hitMap[score]}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default BracketSlot

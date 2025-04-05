import { Match, Participant } from "@/types"
import { Info } from "lucide-react"
import { useMatchesStore } from "@/stores/matches-store"
import { useShallow } from "zustand/react/shallow"
import { useBracketStore } from "@/stores/bracket-store"
import BracketSlot from "./bracket-slot"
import SlotView from "./slot-view"
import { useSubmitScoreQuery } from "../hooks/useSubmitScoreQuery"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface BracketMatchProps {
	match: Match
	style: React.CSSProperties
}

const BracketMatch = ({ match, style }: BracketMatchProps) => {
	const redPlayer = match.player1
	const whitePlayer = match.player2

	const [dialogOpen, setDialogOpen] = useState(false)
	const [winner, setWinner] = useState<Participant | null>(match.winner)

	const bracketStatus = useBracketStore(
		useShallow((state) => state.bracket.status)
	)

	const [submitScore, resetMatch] = useMatchesStore(
		useShallow((state) => [state.submitScore, state.resetMatch])
	)
	const { submitScore: submitScoreQuery } = useSubmitScoreQuery()
	const handleSubmitScore = async () => {
		const submittedWinner = submitScore(match.id)

		if (!submittedWinner) return
		setWinner(submittedWinner)

		// Uncomment when score submission is fully ready
		// submitScoreQuery()

		setDialogOpen(false)
	}
	const handleResetMatch = () => {
		resetMatch(match.id)
		setDialogOpen(false)
	}
	useEffect(() => {
		if (match) {
			setWinner(match.winner)
		}
	}, [match])

	const InProgressView = () => (
		<>
			{/* Slots */}
			<div className="w-full flex flex-col gap-[4px] font-poppins md:flex-row md:gap-[2px]">
				{/* Red */}
				<SlotView
					color="Red"
					match={match}
					isWinner={JSON.stringify(winner) === JSON.stringify(redPlayer)}
					status="In Progress"
				/>

				{/* White */}
				<SlotView
					color="White"
					match={match}
					isWinner={JSON.stringify(winner) === JSON.stringify(whitePlayer)}
					status="In Progress"
				/>
			</div>

			{/* Buttons */}
			<div className="w-full flex gap-[2px] font-poppins">
				{/* Reset */}
				<Button
					onClick={handleResetMatch}
					className="w-full uppercase text-[14px] tracking-[2px] font-bold leading-[26px] rounded px-4 py-3
           text-white bg-figma_neutral7 hover:bg-figma_shade2_30"
				>
					Reset
				</Button>
				{/* Submit */}
				<Button
					onClick={handleSubmitScore}
					className="w-full uppercase text-[14px] tracking-[2px] font-bold leading-[26px] rounded px-4 py-3
           text-white bg-figma_secondary hover:bg-figma_dark"
				>
					Submit
				</Button>
			</div>
		</>
	)

	const ScoreView = () => (
		<>
			{/* Slots */}
			<div className="w-full flex flex-col gap-[4px] font-poppins md:flex-row md:gap-[2px]">
				{/* Red */}
				<SlotView
					color="Red"
					match={match}
					isWinner={JSON.stringify(winner) === JSON.stringify(redPlayer)}
					status="Editing"
				/>

				{/* White */}
				<SlotView
					color="White"
					match={match}
					isWinner={JSON.stringify(winner) === JSON.stringify(whitePlayer)}
					status="Editing"
				/>
			</div>
		</>
	)

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<div
					className=" text-white absolute w-[220px] h-[56px] flex flex-col justify-center gap-[2px]
          hover:outline-primary hover:outline cursor-pointer"
					style={style}
				>
					<BracketSlot
						variant="Red"
						player={redPlayer}
						isWinner={JSON.stringify(winner) === JSON.stringify(redPlayer)}
						scores={match.player1Score ?? []}
					/>
					<BracketSlot
						variant="White"
						player={whitePlayer}
						isWinner={JSON.stringify(winner) === JSON.stringify(whitePlayer)}
						scores={match.player2Score ?? []}
					/>
				</div>
			</DialogTrigger>
			<DialogContent
				className="bg-figma_neutral8 rounded-lg text-white w-full min-w-[330px] max-w-[360px] md:max-w-lg p-4 md:p-6"
				aria-describedby={undefined}
			>
				<DialogHeader className="w-fit flex-row items-center gap-3 space-y-0">
					<DialogTitle className="font-poppins text-paragraph md:text-lead">
						Report Scores
					</DialogTitle>
					<Button
						variant={"outline"}
						className="border-none bg-figma_shade2_5 hover:bg-figma_shade2_30 p-0 size-8"
					>
						<Info className="text-white" />
					</Button>
				</DialogHeader>
				<>
					{/* Overlay Content -- Render based on different scenarios */}
					{bracketStatus === "In Progress" && redPlayer && whitePlayer && (
						<InProgressView />
					)}
					{/* If we are in progress, but the match isnt ready to score because there aren't enough players */}
					{bracketStatus === "In Progress" && (!redPlayer || !whitePlayer) && (
						<ScoreView />
					)}
					{/* If we are editting the details/participants list, we should not be able to edit match status */}
					{bracketStatus === "Editing" && <ScoreView />}
					{/* If we completed the tournament, we should see the current scores and not be able to edit */}
					{bracketStatus === "Completed" && <ScoreView />}
				</>
			</DialogContent>
		</Dialog>
	)
}

export default BracketMatch

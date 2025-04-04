import { Match } from "@/types"
import { Info } from "lucide-react"
import { useMatchesStore } from "@/stores/matches-store"
import { useShallow } from "zustand/react/shallow"
import { useBracketStore } from "@/stores/bracket-store"
import BracketSlot from "./bracket-slot"
import SlotView from "../match-view/slot-view"
import { useSubmitScoreQuery } from "../hooks/useSubmitScoreQuery"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BracketMatchProps {
	match: Match
	style: React.CSSProperties
}

const BracketMatch = ({ match, style }: BracketMatchProps) => {
	const redPlayer = match.player1
	const whitePlayer = match.player2
	const winner = match.winner
	const handleWinner = () => {}

	const bracketStatus = useBracketStore(
		useShallow((state) => state.bracket.status)
	)
	const [submitScore, resetMatch] = useMatchesStore(
		useShallow((state) => [state.submitScore, state.resetMatch])
	)
	const { submitScore: submitScoreQuery } = useSubmitScoreQuery()

	const handleSubmitScore = async () => {
		submitScore(match.id, winner)
		submitScoreQuery()
	}
	const handleResetMatch = () => {
		resetMatch(match.id)
	}

	// const InProgressMatchView = () => (
	//   <div
	//     className={`w-full h-full flex flex-col items-center pt-9 justify-between`}
	//   >
	//     {/* Display */}
	//     <div className="flex flex-col w-full">
	//       {/* Match Labels */}
	//       <div className="w-full flex justify-end items-center gap-[28px] px-[22px] ">
	//         <div className="flex items-center justify-center">
	//           <p className="text-label uppercase text-white">winner</p>
	//         </div>
	//         <div className="flex items-center justify-center">
	//           <p className="text-label uppercase text-white">score</p>
	//         </div>
	//       </div>
	//       <div className="w-full flex flex-col gap-[2px] justify-center">
	//         <SlotView
	//           player={redPlayer}
	//           color={"Red"}
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player1Score}
	//         />
	//         <SlotView
	//           player={whitePlayer}
	//           color={"White"}
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player2Score}
	//         />
	//       </div>
	//     </div>
	//     {/* Button */}
	//     <Dialog.Close asChild>
	//       <div className="flex justify-center items-center">
	//         <EditorButton
	//           text={"submit scores"}
	//           onClickHandler={handleSubmitScore}
	//         />
	//       </div>
	//     </Dialog.Close>
	//     {/* Reset Button */}
	//     <Dialog.Close asChild>
	//       <div className="md:absolute bottom-4 right-4">
	//         <EditorButton
	//           text={"reset match"}
	//           variant="no-outline"
	//           onClickHandler={handleResetMatch}
	//         />
	//       </div>
	//     </Dialog.Close>
	//   </div>
	// );

	// const EditMatchView = () => (
	//   <div className={`w-full h-full flex flex-col items-center justify-center`}>
	//     {/* Display */}
	//     <div className="flex flex-col w-full">
	//       <div className="w-full flex flex-col gap-[2px] justify-center">
	//         <SlotView
	//           player={redPlayer}
	//           color={"Red"}
	//           isPending
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player1Score}
	//         />
	//         <SlotView
	//           player={whitePlayer}
	//           color={"White"}
	//           isPending
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player2Score}
	//         />
	//       </div>
	//     </div>
	//   </div>
	// );

	// const CompletedView = () => (
	//   <div className={`w-full h-full flex flex-col items-center justify-center`}>
	//     {/* Display */}
	//     <div className="flex flex-col w-full">
	//       {/* Match Labels */}
	//       <div className="w-full flex justify-end items-center gap-[36px] px-[25.5px] ">
	//         <div className="flex items-center justify-center">
	//           <p className="text-label uppercase text-white">winner</p>
	//         </div>
	//         <div className="flex items-center justify-center">
	//           <p className="text-label uppercase text-white">score</p>
	//         </div>
	//       </div>
	//       <div className="w-full flex flex-col gap-[2px] justify-center">
	//         <SlotView
	//           player={redPlayer}
	//           color={"Red"}
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player1Score}
	//           disabled
	//         />
	//         <SlotView
	//           player={whitePlayer}
	//           color={"White"}
	//           handleWinner={handleWinner}
	//           winner={winner}
	//           matchId={match.id}
	//           scores={match.player2Score}
	//           disabled
	//         />
	//       </div>
	//     </div>
	//   </div>
	// );

	return (
		// <Dialog.Root>
		//   <Dialog.Trigger asChild>
		//     <div
		//       className="absolute w-[220px] h-[56px] flex flex-col justify-center gap-[2px] hover:outline-primary hover:outline cursor-pointer"
		//       style={style}
		//     >
		//       Opem
		//     </div>
		//   </Dialog.Trigger>
		//   <Dialog.Portal>
		//     <Dialog.Overlay className="bg-figma_shade2/80 data-[state=open]:animate-overlayShow fixed inset-0" />
		//     <Dialog.Content
		//       className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none
		//       max-w-[680px] max-h-[425px] flex flex-col justify-between items-center p-4 gap-[10px] bg-figma_neutral8 h-full font-poppins w-11/12"
		//       aria-describedby={undefined}
		//     >
		//       <Dialog.Title asChild>
		//         {/* Title */}
		//         <div className="w-full px-4 py-2 border-b border-white ">
		//           <p className="text-lead text-white">Report Scores</p>
		//         </div>
		//       </Dialog.Title>
		//       {/* Overlay Content -- Render based on different scenarios */}
		//       {/* If we are in progress and both players are present */}
		//       {bracketStatus === "In Progress" && redPlayer && whitePlayer && (
		//         <InProgressMatchView />
		//       )}
		//       {/* If we are in progress, but the match isnt ready to score because there aren't enough players */}
		//       {bracketStatus === "In Progress" && (!redPlayer || !whitePlayer) && (
		//         <EditMatchView />
		//       )}
		//       {/* If we are editting the details/participants list, we should not be able to edit match status */}
		//       {bracketStatus === "Editing" && <EditMatchView />}
		//       {/* If we completed the tournament, we should see the current scores and not be able to edit */}
		//       {bracketStatus === "Completed" && <CompletedView />}
		//       <Dialog.Close className="absolute top-4 right-4">
		//         <X
		//           size={"1.5rem"}
		//           className="hover:bg-figma_shade2_30 rounded-full text-figma_shade1"
		//         />
		//       </Dialog.Close>
		//     </Dialog.Content>
		//   </Dialog.Portal>
		// </Dialog.Root>

		<Dialog>
			<DialogTrigger asChild>
				<div
					className=" text-white absolute w-[220px] h-[56px] flex flex-col justify-center gap-[2px]
          hover:outline-primary hover:outline cursor-pointer"
					style={style}
				>
					<BracketSlot
						variant="Red"
						player={match.player1}
						isWinner={JSON.stringify(winner) === JSON.stringify(redPlayer)}
						scores={match.player1Score ?? []}
					/>
					<BracketSlot
						variant="White"
						player={match.player2}
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
				{/* Slots */}
				<div className="w-full flex flex-col gap-[4px] font-poppins md:flex-row md:gap-[2px]">
					{/* Red */}
					<SlotView
						color="Red"
						player={match.player1}
						score={match.player1Score}
						isWinner={JSON.stringify(winner) === JSON.stringify(redPlayer)}
					/>

					{/* White */}
					<SlotView
						color="White"
						player={match.player2}
						score={match.player2Score}
						isWinner={JSON.stringify(winner) === JSON.stringify(whitePlayer)}
					/>
				</div>

				{/* Buttons */}
				<div className="w-full flex gap-[2px] font-poppins">
					{/* Reset */}
					<Button
						className="w-full uppercase text-[14px] tracking-[2px] font-bold leading-[26px] rounded px-4 py-3
           text-white bg-figma_neutral7 hover:bg-figma_shade2_30"
					>
						Reset
					</Button>
					{/* Submit */}
					<Button
						className="w-full uppercase text-[14px] tracking-[2px] font-bold leading-[26px] rounded px-4 py-3
           text-white bg-figma_secondary hover:bg-figma_dark"
					>
						Submit
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default BracketMatch

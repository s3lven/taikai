import { Match } from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import BracketSlot from "./bracket-slot";

interface BracketMatchProps {
	match: Match;
	style: React.CSSProperties;
}

const BracketMatch = ({ match, style }: BracketMatchProps) => {
	const redPlayer = match.player1;
	const whitePlayer = match.player2;

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<div
					className="absolute w-[220px] h-[56px] flex flex-col justify-center gap-[2px] hover:outline-primary hover:outline cursor-pointer"
					style={style}
				>
					<BracketSlot
						variant="Red"
						name={redPlayer?.name}
						sequence={redPlayer?.sequence}
						// isWinner={winner === redPlayer}
						// scores={matchFromStore?.player1Score || []}
					/>
					<BracketSlot
						variant="White"
						name={whitePlayer?.name}
						sequence={whitePlayer?.sequence}
						// isWinner={winner === whitePlayer}
						// scores={matchFromStore?.player2Score || []}
					/>
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="bg-figma_shade2/80 data-[state=open]:animate-overlayShow fixed inset-0" />
				<Dialog.Content
					className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none
          max-w-[680px] max-h-[425px] flex flex-col justify-between items-center p-4 gap-[10px] bg-figma_neutral8 w-full h-full font-poppins"
					aria-describedby={undefined}
				>
					<Dialog.Title asChild>
						{/* Title */}
						<div className="w-full px-4 py-2 border-b border-white ">
							<p className="text-lead text-white">Report Scores</p>
						</div>
					</Dialog.Title>
					{/* Overlay Content */}
					{/* Render based on different scenarios */}
					{/* If we are in progress and both players are present */}
					{/* {bracketStatus === "In Progress" && redPlayer && whitePlayer && (
            <InProgressMatchView />
          )} */}
					{/* If we are in progress, but the match isnt ready to score because there aren't enough players */}
					{/* {bracketStatus === "In Progress" && (!redPlayer || !whitePlayer) && (
            <EditMatchView />
          )} */}
					{/* If we are editting the details/participants list, we should not be able to edit match status */}
					{/* {bracketStatus === "Editing" && <EditMatchView />}
          {bracketStatus === "Completed" && <CompletedView />} */}
					<Dialog.Close className="absolute top-4 right-4">
						<X
							size={"1.5rem"}
							color="#717171"
							className="hover:bg-figma_shade2_30 rounded-full"
						/>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default BracketMatch;

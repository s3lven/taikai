import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useBracketStore } from "@/stores/bracket-store";
import { useMatchesStore } from "@/stores/matches-store";
import { DialogDescription } from "@radix-ui/react-dialog";

import { useShallow } from "zustand/react/shallow";
import EditorButton from "./editor-button";
import { Match, Participant } from "@/types";

import JSConfetti from 'js-confetti'

interface ResultsDialogProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultDialog = ({ isOpen, setIsOpen }: ResultsDialogProps) => {
	const [completeBracket] = useBracketStore(
		useShallow((state) => [state.completeBracket])
	);
	const lastThreeMatches = useMatchesStore(
		useShallow((state) => state.rounds.flat().slice(-3))
	);

	const formatResults = (matches: Match[]) => {
		// Create a map to track players and their progression
		const playerStatus = new Map<
			number,
			{
				participant: Participant;
				status: "semifinalist" | "runner-up" | "winner";
			}
		>();

		// Process semifinal matches
		matches.slice(0, 2).forEach((match) => {
			// Add players to tracking if they exist
			if (match.player1) {
				playerStatus.set(match.player1.id, {
					participant: match.player1,
					status: "semifinalist",
				});
			}
			if (match.player2) {
				playerStatus.set(match.player2.id, {
					participant: match.player2,
					status: "semifinalist",
				});
			}

			// Update winner to finalist status
			if (match.winner) {
				const existingPlayer = playerStatus.get(match.winner.id);
				if (existingPlayer) {
					existingPlayer.status = "runner-up";
				}
			}
		});

		// Process finals match
		const finalMatch = matches[2];
		if (finalMatch.winner) {
			// Set winner
			const winnerPlayer = playerStatus.get(finalMatch.winner.id);
			if (winnerPlayer) {
				winnerPlayer.status = "winner";
			}

			// Set runner-up
			const loserId =
				finalMatch.player1?.id === finalMatch.winner.id
					? finalMatch.player2?.id
					: finalMatch.player1?.id;

			if (loserId) {
				const loserPlayer = playerStatus.get(loserId);
				if (loserPlayer) {
					loserPlayer.status = "runner-up";
				}
			}
		}

		// Convert positions to numerical ranks
		const rankMap = {
			winner: 1,
			"runner-up": 2,
			semifinalist: 3,
		};

		// Create array of players with their ranks
		const rankings = Array.from(playerStatus.values())
			.map(({ participant, status }) => ({
				participant,
				rank: rankMap[status],
			}))
			.sort((a, b) => a.rank - b.rank);

		return rankings;
	};

	const results = formatResults(lastThreeMatches);

	const rankStyles: Record<number, string> = {
		1: "bg-yellow-500",
		2: "bg-stone-400",
		3: "bg-amber-600",
	};

	const handleComplete = () => {
		completeBracket()
		setIsOpen(false)
	}

	const confetti = new JSConfetti()
	void confetti.addConfetti()

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="w-full max-h-[75vh] bg-figma_neutral8 font-poppins text-white">
				<DialogHeader className="border-b border-white pb-2 space-y-4">
					<DialogTitle>Taikai Results</DialogTitle>
					<DialogDescription>
						Please report these results to the head shinpan!
					</DialogDescription>
				</DialogHeader>
				<div className="py-8 flex flex-col items-center gap-8">
					<div className="flex flex-col items-center gap-2 w-full">
						{results.map((player) => (
							<div key={player.rank} className="w-full h-[70px] flex">
								<div
									className={`w-full h-full flex items-center justify-center rounded`}
								>
									<div
										className={`w-6 h-full flex items-center justify-center rounded-tl rounded-bl
									${rankStyles[player.rank]}`}
									>
										<p className={`text-label text-center`}>{player.rank}</p>
									</div>
									<div className="w-full h-full flex justify-between items-center px-2 bg-figma_shade2_30">
										{player.participant.name}
									</div>
								</div>
							</div>
						))}
					</div>
					<EditorButton
						variant={"no-outline"}
						text="mark as complete"
						onClickHandler={handleComplete}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ResultDialog;

import { useMatchesStore } from "@/stores/matches-store";
import { useParticipantStore } from "@/stores/participant-store";
import { Match, Participant } from "@/types";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const BracketStructure = () => {
	const [participants] = useParticipantStore(
		useShallow((state) => [state.participants])
	);
	const participantCount = participants.length;
	const rounds = Math.ceil(Math.log2(participantCount));

	const [matches, setMatches] = useMatchesStore(
		useShallow((state) => [state.rounds, state.setMatches])
	);

	useEffect(() => {
		// Helper function to mark BYE rounds in the Slots mapping
		const changeIntoBye = (seed: number) => {
			return seed <= participantCount
				? participants.find((player) => player.sequence === seed)!
				: null;
		};

		const createMapping = () => {
			// If there isn't enough players, then return nothing
			if (participantCount < 2) return [];

			let matches: (Participant | null)[][] = [
				[
					participants.find((player) => player.sequence === 1)!,
					participants.find((player) => player.sequence === 2)!,
				],
			];

			for (let currRound = 1; currRound < rounds; currRound++) {
				const roundMatches = [];
				const sum = Math.pow(2, currRound + 1) + 1;

				for (const match of matches) {
					let player1 = changeIntoBye(match[0]!.sequence);
					let player2 = changeIntoBye(sum - match[0]!.sequence);
					roundMatches.push([player1, player2]);
					player1 = changeIntoBye(sum - match[1]!.sequence);
					player2 = changeIntoBye(match[1]!.sequence);
					roundMatches.push([player1, player2]);
				}
				matches = roundMatches;
			}

			const bracket = matches.map((match) => ({
				player1: match[0],
				player2: match[1],
				player1Score: [],
				player2Score: [],
				winner: null,
				submitted: false,
			}));

			return bracket;
		};

		const createInitialMatches = () => {
			const initialBracket: Match[][] = [];
			const initialMatches = createMapping().length;

			// Push the initla bracket
			initialBracket.push(createMapping());

			// Fill the rest of the rounds
			for (let i = 1; i < rounds; i++) {
				initialBracket.push(
					new Array<Match>(initialMatches / Math.pow(2, i)).fill({
						player1: null,
						player2: null,
						player1Score: [],
						player2Score: [],
						winner: null,
					})
				);
			}

			// Detect bye rounds and move competitors up
			initialBracket[0].forEach((match, index) => {
				const nextRoundMatch = Math.floor(index / 2);
				if (match?.player1 === null) {
					initialBracket[1][nextRoundMatch].player2 = match.player2;
					match.id = -1;
				} else if (match?.player2 === null) {
					initialBracket[1][nextRoundMatch].player1 = match.player1;
					match.id = -1;
				}
			});

			return initialBracket;
		};

		setMatches(createInitialMatches());
	}, [participantCount, participants, rounds, setMatches]);

	return (
		<div className="w-full flex gap-8">
			{matches.map((round, roundIndex) => (
				<div key={roundIndex} className="flex flex-col gap-4 relative">
					{round.map((match) => (
						<div
							key={match.id}
							className="w-48 p-4 border rounded-md shadow bg-white text-center relative"
						>
							<div>{match.player1?.name ?? "Bye"}</div>
							<div className="text-sm text-gray-500">vs</div>
							<div>{match.player2?.name ?? "Bye"}</div>
							<div className="mt-2 font-bold text-blue-500">
								Winner: {match.winner?.name ?? "TBD"}
							</div>
						</div>
					))}

					{/* SVG Connectors */}
					
				</div>
			))}
		</div>
	);
};

export default BracketStructure;

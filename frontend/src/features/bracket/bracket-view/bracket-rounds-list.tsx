import { useParticipantStore } from "@/stores/participant-store";
import { BracketRoundType } from "@/types";
import { useShallow } from "zustand/react/shallow";

interface BracketRoundTitleProps {
	roundTitle: BracketRoundType;
}

const BracketRoundTitle = ({ roundTitle }: BracketRoundTitleProps) => {
	return (
		<div className="w-full h-full max-w-[230px] flex items-center justify-center bg-figma_neutral7">
			<p className="text-white text-label uppercase">{roundTitle}</p>
		</div>
	);
};

const BracketRoundsList = () => {
    const [length] = useParticipantStore(useShallow((state) => [state.participants.length]))

	const determineRoundTitles = (numberOfParticipants: number): BracketRoundType[] => {
		const roundTitles: BracketRoundType[] = [];
		const numberOfRounds = Math.ceil(
			Math.log(numberOfParticipants) / Math.log(2)
		);

		if (numberOfRounds == 0) return ["Finals"];

		for (let i = 0; i < numberOfRounds; i++) {
			const roundNumber = i + 1;
			let title: BracketRoundType;

			if (roundNumber === numberOfRounds) {
				title = "Finals";
			} else if (roundNumber === numberOfRounds - 1) {
				title = "Semi-Finals";
			} else if (roundNumber === numberOfRounds - 2) {
				title = "Quarter-Finals";
			} else {
				title = `Round ${roundNumber}`;
			}

			roundTitles.push(title);
		}

		return roundTitles;
	};
	return (
		<div className="w-full max-h-[25px] flex gap-1">
			{determineRoundTitles(length).map((title) => (
				<BracketRoundTitle roundTitle={title} key={title} />
			))}
		</div>
	);
};

export default BracketRoundsList;

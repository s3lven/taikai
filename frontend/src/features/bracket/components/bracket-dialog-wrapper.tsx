import { ReactNode, useEffect, useState } from "react";
import ResultsDialog from "./results-dialog";
import { useMatchesStore } from "@/stores/matches-store";

interface BracketDialogWrapperProps {
	children: ReactNode;
	className: string;
}

const BracketDialogWrapper = ({
	children,
	className,
}: BracketDialogWrapperProps) => {
	const [isResultsOpen, setIsResultsOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = useMatchesStore.subscribe((state) => {
			if (state.isBracketCompleted()) {
				setIsResultsOpen(true);
			}
		});

		return unsubscribe;
	}, []);

	return (
		<div className={className}>
			{children}
			{isResultsOpen && (
				<ResultsDialog isOpen={isResultsOpen} setIsOpen={setIsResultsOpen} />
			)}
		</div>
	);
};

export default BracketDialogWrapper;

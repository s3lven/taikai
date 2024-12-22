import { useParams } from "react-router-dom";
import BracketPanel from "./bracket-panel/bracket-panel";
import { useEffect } from "react";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";
import BracketView from "./bracket-view/bracket-view";

const BracketPage = () => {
	const fetchBracketData = useBracketStore(
		useShallow((state) => state.fetchBracketData)
	);

	// Extract the bracket id from the URL and check if it exists
	const params = useParams();

	if (params.bracketId === undefined) {
		console.error("Bracket ID not found in URL");
	}
	const bracketId = parseInt(params.bracketId!);

	useEffect(() => {
		void fetchBracketData(bracketId);
	}, [fetchBracketData, bracketId]);

	return (
		<div className="w-full flex-1 flex gap-5 bg-figma_shade2">
			<BracketPanel />
			<BracketView />
		</div>
	);
};

export default BracketPage;

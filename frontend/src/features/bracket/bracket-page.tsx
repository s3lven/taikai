import { useParams } from "react-router-dom";
import BracketPanel from "./bracket-panel/bracket-panel";
import { useEffect } from "react";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";
import BracketView from "./bracket-view/bracket-view";
import BracketDialogWrapper from "./components/bracket-dialog-wrapper";
import { useParticipantStore } from "@/stores/participant-store";

const BracketPage = () => {
	const fetchBracketData = useBracketStore(
		useShallow((state) => state.fetchBracketData)
	);
	const fetchParticipants = useParticipantStore(useShallow((state) => state.fetchParticipants))

	// Extract the bracket id from the URL and check if it exists
	const params = useParams();

	if (params.bracketId === undefined) {
		console.error("Bracket ID not found in URL");
	}
	const bracketId = parseInt(params.bracketId!);

	useEffect(() => {
		void fetchBracketData(bracketId);
		void fetchParticipants(bracketId)
	}, [fetchBracketData, bracketId, fetchParticipants]);

	return (
		<BracketDialogWrapper className="w-full flex-1 flex gap-5 bg-figma_shade2">
			<BracketPanel />
			<BracketView />
		</BracketDialogWrapper>
	);
};

export default BracketPage;

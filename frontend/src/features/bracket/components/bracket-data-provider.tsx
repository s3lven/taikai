import { useBracketStore } from "@/stores/bracket-store";
import { useParticipantStore } from "@/stores/participant-store";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

interface BracketDataProviderProps {
	children: React.ReactNode;
	bracketId: number;
	className?: string;
}

const BracketDataProvider = ({
	children,
	bracketId,
	className,
}: BracketDataProviderProps) => {
	const fetchBracketData = useBracketStore(
		useShallow((state) => state.fetchBracketData)
	);
	const fetchParticipants = useParticipantStore(
		useShallow((state) => state.fetchParticipants)
	);

	// Fetch bracket data and participants on mount
	useEffect(() => {
		void fetchBracketData(bracketId);
		void fetchParticipants(bracketId);
	}, [bracketId, fetchBracketData, fetchParticipants]);

	return <div className={className}>{children}</div>;
};

export default BracketDataProvider;

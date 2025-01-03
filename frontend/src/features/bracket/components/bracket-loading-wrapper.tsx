import { useBracketStore } from "@/stores/bracket-store";
import React from "react";
import { useShallow } from "zustand/react/shallow";

const BracketLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
	const [bracketIsLoading, bracketError, bracketInitialized] = useBracketStore(
		useShallow((state) => [state.isLoading, state.error, state.isInitialized])
	);

	if (bracketError) {
		return  <div>Error: {bracketError.message}</div>	
	}

	if (bracketIsLoading || !bracketInitialized) {
		return <div>Loading...</div>;
	}


	return <>{children}</>;
};

export default BracketLoadingWrapper;

import { Button } from "@/components/ui/button";
import { useTournamentStore } from "@/stores/tournament-store";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

const BracketAddButton = () => {
	const navigate = useNavigate();
	const { viewingTournament, addBracket } = useTournamentStore(
		useShallow((state) => ({
			viewingTournament: state.viewingTournament,
			addBracket: state.addBracket,
		}))
	);

	const handleAddBracket = () => {
		if (!viewingTournament) return;

		void (async () => {
			try {
				const bracketId = await addBracket(viewingTournament.id);
				await navigate(`/bracket/${bracketId}`);
			} catch (error) {
				console.error("Failed to delete tournament:", error);
			}
		})();
	};

	return (
		<Button
			className="rounded-lg bg-neutral-700 px-4 py-4 shadow-lg font-semibold
				hover:bg-figma_shade2 uppercase transition-transform ease-in-out duration-300 hover:scale-[1.01]"
			onClick={handleAddBracket}
		>
			<Plus />
			Add Bracket
		</Button>
	);
};

export default BracketAddButton;

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTournamentData from "../hooks/useTournamentData";
import { CreateBracketForm } from "@/types";
import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store";

const BracketAddButton = () => {
  const navigate = useNavigate();
  const { viewingTournament, setViewingTournament } = useTournamentStore();
  const { addBracket, isAddingBracket } = useTournamentData();

  const handleAddBracket = async () => {
    if (!viewingTournament) {
      console.error("There is no tournament opened");
      return;
    }
    const newBracket: CreateBracketForm = {
      name: "New Bracket",
      tournamentID: viewingTournament.id,
      type: "Single Elimination",
    };
    const bracket = await addBracket(newBracket);

    if (viewingTournament && viewingTournament.id === bracket.tournamentID) {
      setViewingTournament({
        ...viewingTournament,
        brackets: [...viewingTournament.brackets, bracket],
      });
    }
    await navigate(`/bracket/${bracket.id}`);
  };

  return (
    <Button
      className="rounded-lg bg-neutral-700 px-4 py-4 shadow-lg font-semibold
				hover:bg-figma_shade2 uppercase transition-transform ease-in-out duration-300 hover:scale-[1.01]"
      onClick={handleAddBracket}
      disabled={isAddingBracket}
    >
      <Plus />
      {isAddingBracket ? "Creating Bracket..." : "Add Bracket"}
    </Button>
  );
};

export default BracketAddButton;

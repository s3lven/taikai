import BracketRoundsList from "./bracket-rounds-list";
import BracketStructure from "./bracket-structure";
import useTournamentBracket from "./hooks/useTournamentBracket";
import { useShallow } from "zustand/react/shallow";
import { useBracketStore } from "@/stores/bracket-store";
import useCurrentBracketData from "../hooks/useCurrentBracketData";

const BracketView = () => {
  const { matches: editingMatches } = useTournamentBracket();
  const bracket = useCurrentBracketData();
  const [status] = useBracketStore(
    useShallow((state) => [state.bracket.status])
  );
  return (
    <div className="w-fit h-full flex-1 space-y-4 pr-5">
      {/* Round Titles */}
      <BracketRoundsList />

      {/* Bracket */}
      {status === "Editing" ? (
        <BracketStructure matches={editingMatches} />
      ) : (
        <BracketStructure matches={bracket?.data?.matches!} />
      )}
    </div>
  );
};

export default BracketView;

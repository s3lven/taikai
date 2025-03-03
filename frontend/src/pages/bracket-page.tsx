import BracketPanel from "../features/bracket/bracket-panel/bracket-panel";
import { useParticipantStore } from "@/stores/participant-store";
import { useShallow } from "zustand/react/shallow";
import { useBracketStore } from "@/stores/bracket-store";
import { useEffect } from "react";
import BracketView from "@/features/bracket/bracket-view/bracket-view";
import useCurrentBracketData from "@/features/bracket/hooks/useCurrentBracketData";
import { useMatchesStore } from "@/stores/matches-store";
import useTournamentBracket from "@/features/bracket/bracket-view/hooks/useTournamentBracket";

const BracketPage = () => {
  const bracket = useCurrentBracketData();

  const [setParticipants] = useParticipantStore(
    useShallow((state) => [state.setParticipants])
  );
  const setBracket = useBracketStore(useShallow((state) => state.setBracket));
  const setMatches = useMatchesStore(useShallow((state) => state.setMatches));
  const matches = useTournamentBracket();

  useEffect(() => {
    if (bracket?.data?.participants) setParticipants(bracket.data.participants);
    if (bracket?.data?.bracket && bracket?.data?.tournament)
      setBracket(bracket.data.bracket, bracket.data.tournament);
    if (bracket?.data?.matches.length) {
      setMatches(bracket.data.matches);
    } else {
      setMatches(matches);
    }
  }, [bracket]);

  if (bracket?.isLoading) return <>Loading...</>;
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full flex-1 flex gap-5 bg-figma_shade2">
        <BracketPanel />
        <BracketView />
      </div>
    </div>
  );
};

export default BracketPage;

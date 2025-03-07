import { useQuery } from "@tanstack/react-query";
import { getAllBracketInfo } from "../api";
import { useParticipantStore } from "@/stores/participant-store";
import { useShallow } from "zustand/react/shallow";
import { useBracketStore } from "@/stores/bracket-store";
import { useMatchesStore } from "@/stores/matches-store";

const useBracketQuery = (bracketID: number) => {
  const [setParticipants] = useParticipantStore(
    useShallow((state) => [state.setParticipants])
  );
  const setBracket = useBracketStore(useShallow((state) => state.setBracket));
  const setMatches = useMatchesStore(useShallow((state) => state.setMatches));

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bracket", bracketID],
    queryFn: () => getAllBracketInfo(bracketID),
    select: (data) => {
      setParticipants(data.participants);
      setBracket(data.bracket, data.tournament);
      if (data.matches.length > 0) setMatches(data.matches);
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useBracketQuery;

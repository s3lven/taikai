import { useQuery } from "@tanstack/react-query";
import { getAllBracketInfo } from "../api";

const useBracketQuery = (bracketID: number) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bracket", bracketID],
    queryFn: () => getAllBracketInfo(bracketID),
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

import { useParams } from "react-router-dom";
import useBracketQuery from "./useBracketQuery";

const useCurrentBracketData = () => {
  const { bracketId } = useParams();

  if (bracketId === undefined) {
    console.error("There is no bracket ID in the url");
    return null;
  }

  return useBracketQuery(parseInt(bracketId));
};

export default useCurrentBracketData;

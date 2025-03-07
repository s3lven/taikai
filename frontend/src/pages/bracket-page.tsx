import BracketPanel from "../features/bracket/bracket-panel/bracket-panel";
import BracketView from "@/features/bracket/bracket-view/bracket-view";
import useBracketQuery from "@/features/bracket/hooks/useBracketQuery";
import { useParams } from "react-router-dom";

const BracketPage = () => {
  // Extract the bracket id from the URL and check if it exists
  const params = useParams();

  if (params.bracketId === undefined) {
    console.error("Bracket ID not found in URL");
  }
  const bracketId = parseInt(params.bracketId!);

  const query = useBracketQuery(bracketId);

  if (query?.isLoading) return <>Loading...</>;

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

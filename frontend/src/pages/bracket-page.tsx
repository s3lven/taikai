import { useParams } from "react-router-dom";
import BracketPanel from "../features/bracket/bracket-panel/bracket-panel";
import BracketView from "../features/bracket/bracket-view/bracket-view";
import BracketDialogWrapper from "../features/bracket/components/bracket-dialog-wrapper";
import BracketDataProvider from "../features/bracket/components/bracket-data-provider";
import BracketLoadingWrapper from "../features/bracket/components/bracket-loading-wrapper";

const BracketPage = () => {
  // Extract the bracket id from the URL and check if it exists
  const params = useParams();

  if (params.bracketId === undefined) {
    console.error("Bracket ID not found in URL");
  }
  const bracketId = parseInt(params.bracketId!);

  return (
    <BracketDataProvider bracketId={bracketId} className="flex-1 flex flex-col">
      <BracketLoadingWrapper>
        <BracketDialogWrapper className="w-full flex-1 flex gap-5 bg-figma_shade2">
          <BracketPanel />
          <BracketView />
        </BracketDialogWrapper>
      </BracketLoadingWrapper>
    </BracketDataProvider>
  );
};

export default BracketPage;

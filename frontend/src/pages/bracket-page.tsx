import MobileBracketPanel from "@/features/bracket/bracket-panel/mobile-bracket-panel"
import BracketPanel from "../features/bracket/bracket-panel/bracket-panel"
import BracketView from "@/features/bracket/bracket-view/bracket-view"
import BracketDialogManager from "@/features/bracket/components/bracket-dialog-manager"
import useBracketQuery from "@/features/bracket/hooks/useBracketQuery"

import { useParams } from "react-router-dom"


const BracketPage = () => {
  // Extract the bracket id from the URL and check if it exists
  const params = useParams()
  if (params.bracketId === undefined) {
    console.error("Bracket ID not found in URL")
  }
  const bracketId = parseInt(params.bracketId!)

  const query = useBracketQuery(bracketId)

  if (query?.isLoading) return <>Loading...</>

  return (
    <div className="flex-1 flex flex-col bg-figma_shade2">
      {/* Desktop Layout */}
      <div className="w-full flex-1 hidden md:flex gap-5">
        <BracketPanel />
        <div className="w-full overflow-auto">
          <BracketView />
        </div>
      </div>

      {/* Mobile Layout */}
      <MobileBracketPanel />
      <BracketDialogManager />
    </div>
  )
}

export default BracketPage

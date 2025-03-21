import BracketNameInput from "./bracket-name-input"
import BracketTypeInput from "./bracket-type-input"
import TournamentName from "./tournament-name"

interface InformationPanelProps {
  isTitleVisible?: boolean
}

const InformationPanel = ({ isTitleVisible = true }: InformationPanelProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-2.5 px-0 py-4 md:px-4">
      {isTitleVisible ? (
        <p className="text-grey text-label uppercase w-fit">
          bracket information
        </p>
      ) : null}

      <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
        <BracketNameInput />
        <TournamentName />
        <BracketTypeInput />
      </div>
    </div>
  )
}

export default InformationPanel

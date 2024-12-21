import BracketNameInput from "./bracket-name-input"
import BracketTypeInput from "./bracket-type-input"
import TournamentName from "./tournament-name"

const InformationPanel = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2.5 p-4">
      <p className="text-grey text-label uppercase w-fit">
        bracket information
      </p>
      <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
        <BracketNameInput />
        <TournamentName />
        <BracketTypeInput />
      </div>
    </div>
  )
}

export default InformationPanel
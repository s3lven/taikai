import BracketRoundsList from './bracket-rounds-list'
import BracketStructure from './bracket-structure'

const BracketView = () => {
  return (
    <div className="w-full flex-1 space-y-4 pr-5 overflow-y-scroll no-scrollbar pb-20">
      {/* Round Titles */}
      <BracketRoundsList />

      {/* Bracket */}
      <BracketStructure />
    </div>
  )
}

export default BracketView
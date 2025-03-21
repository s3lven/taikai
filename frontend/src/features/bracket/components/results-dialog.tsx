import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBracketStore } from "@/stores/bracket-store"
import { useMatchesStore } from "@/stores/matches-store"
import { DialogDescription } from "@radix-ui/react-dialog"

import { useShallow } from "zustand/react/shallow"
import EditorButton from "./editor-button"
import { Match, Participant } from "@/types"

import JSConfetti from "js-confetti"
import { useBracketMutations } from "../hooks/useBracketMutations"

interface ResultsDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ResultDialog = ({ isOpen, setIsOpen }: ResultsDialogProps) => {
  const [completeBracket, bracketId] = useBracketStore(
    useShallow((state) => [state.completeBracket, state.bracket.id])
  )
  const rounds = useMatchesStore(useShallow((state) => state.rounds))
  const { completeBracketMutation } = useBracketMutations()

  // If there are not enough rounds, return null
  if (rounds.length < 2) {
    return null
  }

  const formatResults = (matches: Match[]) => {
    // Create a map to track players and their progression
    const playerStatus = new Map<
      number,
      {
        participant: Participant
        status: "semifinalist" | "runner-up" | "winner"
      }
    >()

    // Process semifinal matches
    matches.slice(0, 2).forEach((match) => {
      // Add players to tracking if they exist
      if (match.player1) {
        playerStatus.set(match.player1.id, {
          participant: match.player1,
          status: "semifinalist",
        })
      }
      if (match.player2) {
        playerStatus.set(match.player2.id, {
          participant: match.player2,
          status: "semifinalist",
        })
      }

      // Update winner to finalist status
      if (match.winner) {
        const existingPlayer = playerStatus.get(match.winner.id)
        if (existingPlayer) {
          existingPlayer.status = "runner-up"
        }
      }
    })

    // Process finals match
    const finalMatch = matches[2]
    if (finalMatch.winner) {
      // Set winner
      const winnerPlayer = playerStatus.get(finalMatch.winner.id)
      if (winnerPlayer) {
        winnerPlayer.status = "winner"
      }

      // Set runner-up
      const loserId =
        finalMatch.player1?.id === finalMatch.winner.id
          ? finalMatch.player2?.id
          : finalMatch.player1?.id

      if (loserId) {
        const loserPlayer = playerStatus.get(loserId)
        if (loserPlayer) {
          loserPlayer.status = "runner-up"
        }
      }
    }

    // Convert positions to numerical ranks
    const rankMap = {
      winner: 1,
      "runner-up": 2,
      semifinalist: 3,
    }

    // Create array of players with their ranks
    const rankings = Array.from(playerStatus.values())
      .map(({ participant, status }) => ({
        participant,
        rank: rankMap[status],
      }))
      .sort((a, b) => a.rank - b.rank)

    return rankings
  }

  const lastThreeMatches = rounds.flat().slice(-3)
  const results = formatResults(lastThreeMatches)

  const rankStyles: Record<number, string> = {
    1: "bg-yellow-500",
    2: "bg-stone-400",
    3: "bg-amber-600",
  }

  const handleComplete = () => {
    completeBracket()
    completeBracketMutation.mutate(bracketId)
    setIsOpen(false)
  }

  if (isOpen) {
    const confetti = new JSConfetti()
    void confetti.addConfetti()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-11/12 max-h-[75vh] bg-figma_neutral8 font-poppins text-white overflow-hidden">
        <DialogHeader className="border-b border-white pb-2 space-y-4">
          <DialogTitle>Taikai Results</DialogTitle>
          <DialogDescription>
            Please report these results to the head shinpan!
          </DialogDescription>
        </DialogHeader>
        <div className="min-w-0 py-8 flex flex-col items-center gap-8">
          <div className="w-full flex flex-col items-center gap-2">
            {results.map((player) => (
              <div key={player.participant.id} className="w-full h-[70px] flex">
                <div
                  className={`w-6 flex-none h-full flex items-center justify-center rounded-tl rounded-bl
									${rankStyles[player.rank]}`}
                >
                  <p className={`text-label text-center`}>{player.rank}</p>
                </div>
                <div className="w-full h-full flex items-center px-2 bg-figma_shade2_30 overflow-hidden rounded-tr rounded-br">
                  <p className="w-full truncate">{player.participant.name}</p>
                </div>
              </div>
            ))}
          </div>
          <EditorButton
            variant={"no-outline"}
            text="mark as complete"
            onClickHandler={handleComplete}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResultDialog

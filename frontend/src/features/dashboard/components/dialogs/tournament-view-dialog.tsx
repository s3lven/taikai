import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import BracketItem from "../bracket-item"
import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store"
import BracketAddButton from "../bracket-add-button"

const TournamentViewDialog = () => {
  const order = ["Active", "Upcoming", "Past"]
  const { viewingTournament, setViewingTournament } = useTournamentStore()

  return (
    <Dialog
      open={!!viewingTournament}
      onOpenChange={() => setViewingTournament(null)}
    >
      <DialogContent
        className="container w-11/12 max-h-[75vh] bg-figma_neutral8 font-poppins text-white"
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b border-white pb-2 space-y-4">
          <DialogTitle>{viewingTournament?.name}</DialogTitle>
          <DialogDescription className="text-white">
            Select a bracket below
          </DialogDescription>
        </DialogHeader>
        <div
          className="w-full h-full flex-grow flex flex-col justify-start gap-2 px-2 py-4
                  text-desc text-white focus:outline-none overflow-y-auto no-scrollbar"
        >
          {/* Add Button */}
          <BracketAddButton />
          {viewingTournament?.brackets
            .toSorted(
              (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
            )
            .map((bracket) => (
              <BracketItem key={`${bracket.id}`} bracket={bracket} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TournamentViewDialog

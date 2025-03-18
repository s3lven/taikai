import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store"
import TournamentNewDialog from "../features/dashboard/components/dialogs/tournament-new-dialog"
import TournamentViewDialog from "../features/dashboard/components/dialogs/tournament-view-dialog"
import { Button } from "@/components/ui/button"
import TournamentEditDialog from "../features/dashboard/components/dialogs/tournament-edit-dialog"
import DashboardContent from "../features/dashboard/components/dashboard-content"
import { Plus } from "lucide-react"

const DashboardPage = () => {
  const {
    editingTournament,
    viewingTournament,
    isAddingDialogOpen,
    setIsAddingDialogOpen,
  } = useTournamentStore()

  return (
    <div className="pb-8 container px-4 mx-auto w-full flex-1 flex flex-col">
      <div className="w-full pt-6 pb-2 border-b border-figma_neutral5 flex justify-between items-center">
        <h1 className="text-figma_dark lg:text-title font-bold text-[32px]">
          Dashboard
        </h1>
        <Button
          className="bg-figma_shade2 hover:bg-figma_shade2/90 text-white 
                    transition-transform hover:scale-105 duration-300"
          onClick={() => setIsAddingDialogOpen(true)}
        >
          <Plus />
          <span className="hidden md:block">Create New Taikai</span>
        </Button>
      </div>

      <DashboardContent />

      {/* Show Dialogs/Modals on the page-level*/}
      {editingTournament && <TournamentEditDialog />}
      {viewingTournament && <TournamentViewDialog />}
      {isAddingDialogOpen && <TournamentNewDialog />}
    </div>
  )
}

export default DashboardPage

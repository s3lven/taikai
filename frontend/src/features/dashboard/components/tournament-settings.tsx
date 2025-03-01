import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTournamentStore } from "@/stores/tournament-store";
import { Tournament } from "@/types";

import { MoreVertical } from "lucide-react";
import useTournamentData from "../hooks/useTournamentData";

interface TournamentSettingsProps {
  tournament: Tournament;
}

const TournamentSettings = ({ tournament }: TournamentSettingsProps) => {
  const { setEditingTournament } = useTournamentStore();
  const { removeTournament, isRemovingTournament } = useTournamentData();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTournament(tournament.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='absolute right-4
                rounded-full  p-2 border border-transparent 
                hover:shadow-2xl hover:border-figma_shade2_30 transition-all duration-300"'
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-poppins">
        <DropdownMenuLabel>{tournament.name}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setEditingTournament(tournament);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-figma_error"
          onClick={handleDelete}
          disabled={isRemovingTournament}
        >
          {isRemovingTournament ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TournamentSettings;

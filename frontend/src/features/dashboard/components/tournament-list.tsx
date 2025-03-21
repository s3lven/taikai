import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User } from "lucide-react"
import TournamentSettings from "./tournament-settings"

import { TournamentStatusType } from "@/types"
import useTournamentData from "../hooks/useTournamentData"

interface TournamentListProps {
  status: TournamentStatusType
}

const TournamentList = ({ status }: TournamentListProps) => {
  const { setViewingTournament } = useTournamentStore()
  const { getFilteredTournaments } = useTournamentData()
  const filteredTournaments = getFilteredTournaments(status)

  return (
    filteredTournaments.length > 0 && (
      <div className="space-y-4">
        {/* Header */}
        <h1 className="w-full lg:text-headline text-2xl font-bold tracking-tight text-figma_dark">
          {status} Tournaments
        </h1>
        {/* List */}
        <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card
              className="w-full shadow-md cursor-pointer font-poppins 
						hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center min-w-0"
              onClick={() => setViewingTournament(tournament)}
              key={tournament.id}
            >
              <CardContent className="relative flex items-center justify-between w-full gap-6 ">
                <Avatar className="size-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-white bg-figma_shade2">
                    CN
                  </AvatarFallback>
                </Avatar>
                <CardHeader className="px-0 flex-1 mr-10 min-w-0">
                  <CardTitle className="text-xl font-bold">
                    <p className="truncate">{tournament.name}</p>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="flex items-center h-full">
                      {tournament.location} •{" "}
                      {/* Long formatting needed here because toLocaleDateString returns -1 day due to local timezones */}
                      {new Date(tournament.date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                      })}{" "}
                      •
                    </span>
                    <span className="flex items-center h-full">
                      <User size={14} /> {/* TODO: Grab participant count */}
                      <span>10</span>
                    </span>
                  </CardDescription>
                </CardHeader>
                <TournamentSettings tournament={tournament} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  )
}

export default TournamentList

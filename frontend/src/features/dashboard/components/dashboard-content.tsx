import { useTournamentStore } from "@/stores/tournament-store";
import TournamentList from "./tournament-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useTournamentData from "../hooks/useTournamentData";

const EmptyDashboard = () => {
  const { setIsAddingTournament } = useTournamentStore();

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full flex-1">
      <h1 className="text-figma_dark text-title">There&apos;s nothing here!</h1>
      <h1 className="text-figma_dark text-title">Let&apos;s fix that.</h1>
      <Button
        className="bg-figma_shade2 hover:bg-figma_shade2/90 text-white 
                    transition-transform hover:scale-105 duration-300"
        onClick={() => setIsAddingTournament(true)}
      >
        Create New Taikai
      </Button>
    </div>
  );
};

const DashboardLoading = () => {
  return (
    <div className="pt-6 space-y-4">
      <Skeleton className="w-[335px] h-[42px] bg-figma_neutral6" />
      <div className="w-full flex flex-wrap gap-6">
        {new Array(9).fill(null).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full max-w-md h-[100px] bg-figma_neutral6"
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

const DashboardError = () => {
  return (
    <div className="pt-6 flex items-center justify-center flex-1">
      <h1 className="text-figma_dark text-balance text-lead">
        An unexpected error occurred while loading your tournaments. Please try
        again later.
      </h1>
    </div>
  );
};

const DashboardContent = () => {
  const { tournaments, isLoading, isError, error, refetch } =
    useTournamentData();

  if (isLoading) return <DashboardLoading />;

  if (isError || !tournaments) {
    console.error(error?.message);
    return <DashboardError />;
  }

  return tournaments.length > 0 ? (
    <div className="w-full flex flex-col gap-12 pt-6">
      <TournamentList status="Active" />
      <TournamentList status="Upcoming" />
      <TournamentList status="Past" />
    </div>
  ) : (
    <EmptyDashboard />
  );
};

export default DashboardContent;

import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import { useTournamentStore } from "@/stores/tournament-store";
import TournamentNewDialog from "./components/dialogs/tournament-new-dialog";
import TournamentViewDialog from "./components/dialogs/tournament-view-dialog";
import { Button } from "@/components/ui/button";
import TournamentEditDialog from "./components/dialogs/tournament-edit-dialog";
const LazyDashboardContent = React.lazy(
	() => import("./components/dashboard-content")
);

const DashboardLoading = () => {
	return (
		<div className="w-full flex flex-wrap gap-6 text-figma_dark">
			{new Array(12).fill(null).map((_, i) => (
				<Skeleton
					key={i}
					className="w-[392px] h-[210px] bg-slate-300 flex flex-col items-center justify-center rounded-lg"
				/>
			))}
			<span className="sr-only">Loading...</span>
		</div>
	);
};

const DashboardPage = () => {
	const { editingTournament, viewingTournament, isAddingTournament, setIsAddingTournament } = useTournamentStore()

	return (
		<div className="pb-8 max-w-screen-2xl px-[60px] mx-auto w-full flex-1 flex flex-col ">
			<div className="w-full pt-6 pb-2 border-b border-figma_neutral5 flex justify-between items-center">
				<h1 className="text-figma_dark text-title">Dashboard</h1>
				{/* Put trigger here */}
				<Button
					className="bg-figma_shade2 hover:bg-figma_shade2/90 text-white 
                    transition-transform hover:scale-105 duration-300"
					onClick={() => setIsAddingTournament(true)}
				>
					Create New Taikai
				</Button>
			</div>

			<Suspense fallback={<DashboardLoading />}>
				<LazyDashboardContent />
			</Suspense>

			{/* Show Dialogs/Modals on the page-level*/}
			{editingTournament && <TournamentEditDialog />}
			{viewingTournament && <TournamentViewDialog />}
			{isAddingTournament && <TournamentNewDialog />}
		</div>
	);
};

export default DashboardPage;

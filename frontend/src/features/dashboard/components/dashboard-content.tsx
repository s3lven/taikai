import { useState } from "react";
import DashboardSection from "./dashboard-section";
import EmptyDashboard from "./empty-dashboard";
import { dummyTournamentData } from "@/types";

const DashboardContent = () => {
	const [tournamentData] = useState(dummyTournamentData);
	return tournamentData.length > 0 ? (
		<div className="w-full flex flex-col gap-12 pt-6">
			<DashboardSection tournamentData={tournamentData} status="Active" />
			<DashboardSection tournamentData={tournamentData} status="Upcoming" />
			<DashboardSection tournamentData={tournamentData} status="Past" />
		</div>
	) : (
		<EmptyDashboard />
	);
};

export default DashboardContent;

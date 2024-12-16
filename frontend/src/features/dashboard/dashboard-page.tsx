import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
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
	return (
		<div className="pb-8 max-w-screen-2xl mx-auto w-full flex-1 flex flex-col ">
			<div className="w-full pt-6 pb-2 border-b border-figma_neutral5 flex justify-between items-center">
				<h1 className="text-figma_dark text-title">Dashboard</h1>

				<Button className="bg-figma_shade2 hover:bg-figma_shade2/90 text-white transition-transform hover:scale-105 duration-300" asChild>
					<Link to="/new">Create New Taikai</Link>
				</Button>
			</div>

			<Suspense fallback={<DashboardLoading />}>
				<LazyDashboardContent />
			</Suspense>
		</div>
	);
};

export default DashboardPage;

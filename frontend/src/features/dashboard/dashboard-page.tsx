import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
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
		<div className="flex flex-col gap-5 pb-8 px-[108px]">
			<div className="w-full py-6 border-b border-figma_neutral5">
				<h1 className="text-figma_dark text-title">Dashboard</h1>
			</div>

      
			<Suspense fallback={<DashboardLoading />}>
				<LazyDashboardContent />
			</Suspense>
		</div>
	);
};

export default DashboardPage;

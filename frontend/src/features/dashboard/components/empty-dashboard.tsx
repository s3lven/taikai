import NewTaikaiDialog from "./dialogs/tournament-new-dialog";

const EmptyDashboard = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 h-full flex-1">
			<h1 className="text-figma_dark text-title">There&apos;s nothing here!</h1>
			<h1 className="text-figma_dark text-title">Let&apos;s fix that.</h1>
			<NewTaikaiDialog />
		</div>
	);
};

export default EmptyDashboard;

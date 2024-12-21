import { useBracketStore } from "@/stores/bracket-store";
import EditorButton from "../editor-button";
import { useShallow } from "zustand/react/shallow";
import { Progress } from "@/components/ui/progress";

const PlayProgress = () => {
	const [
		bracketStatus,
		runBracket,
		progress,
		completeBracket,
		reopenBracket,
		resetBracket,
		// testBracket,
	] = useBracketStore(
		useShallow((state) => [
			state.bracket.status,
			state.runBracket,
			state.bracket.progress,
			state.completeBracket,
			state.reopenBracket,
			state.resetBracket,
			// state.testBracket,
		])
	);

	return (
		<>
			<div className="w-full pb-2 border-b border-figma_neutral8 ">
				<p className="text-desc text-center text-figma_grey">{bracketStatus}</p>
			</div>
			{bracketStatus === "Editing" ? (
				<p className="text-desc text-center text-figma_grey">
					Ready to go? Click &quot;Start Tournament&quot; to start reporting
					scores:
				</p>
			) : (
				<Progress value={progress} />
			)}

			<div className="flex flex-col justify-center items-center gap-2">
				{bracketStatus === "Editing" ? (
					<EditorButton text="start tournament" onClickHandler={runBracket} />
				) : (
					<>
						{progress === 100 && bracketStatus === "In Progress" && (
							<EditorButton
								variant={"no-outline"}
								text="mark as complete"
								onClickHandler={completeBracket}
							/>
						)}
						{bracketStatus === "Completed" && (
							<EditorButton
								variant="no-outline"
								text="reopen bracket"
								onClickHandler={reopenBracket}
							/>
						)}
						<EditorButton
							variant={"no-outline"}
							text="reset bracket"
							onClickHandler={resetBracket}
						/>
					</>
				)}
				{/* Button to test the progress bar
				<EditorButton
					variant="no-outline"
					text="add half"
					onClickHandler={testBracket}
				/> */}
			</div>
		</>
	);
};

export default PlayProgress;

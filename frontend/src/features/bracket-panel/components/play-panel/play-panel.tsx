import EditorButton from "../editor-button";
import PlayProgress from "./play-progress";
import SaveChangeButton from "../save-changes-button";

const PlayPanel = () => {
	return (
		<div className="w-full h-full flex flex-col gap-2.5 p-4">
			{/* Bracket Status */}
			<p className="text-figma_grey text-label uppercase w-fit">
				bracket status
			</p>
			<div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
				<PlayProgress />
			</div>

			{/* Changes */}
			{/* TODO: Hook up this feature to save on a database */}
			<div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
				<div className="w-full pb-2 border-b border-figma_neutral8 ">
					<p className="text-desc text-center text-figma_grey">
						Changes Unsaved
					</p>
				</div>
				<p className="text-desc text-center text-figma_grey">
					Save your changes to make sure your work doesn&apos;t disappear!
				</p>
				<div className="flex justify-center items-center">
					<SaveChangeButton />
				</div>
			</div>

			{/* Bracket Status */}
			<div className="w-full flex flex-col gap-4 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
				<p className="text-desc text-center text-figma_grey">
					Let others know about your bracket!
				</p>
				<div className="flex justify-center items-center">
					<EditorButton text="share" />
				</div>
			</div>
		</div>
	);
};

export default PlayPanel;

// import EditorButton from "../../../components/editor-button";
import PlayProgress from "./play-progress"
import SaveChangesPanel from "./save-changes-panel"

interface PlayPanelProps {
  isTitleVisible?: boolean
}

const PlayPanel = ({ isTitleVisible = true }: PlayPanelProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-2.5 py-4 md:px-4">
      {/* Bracket Status */}
      {isTitleVisible ? (
        <p
          className="text-figma_grey text-label uppercase w-fit 
        "
        >
          bracket status
        </p>
      ) : null}
      <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
        <PlayProgress />
      </div>

      {/* Changes */}
      <SaveChangesPanel />

      {/* Bracket Status */}
      {/* <div className="w-full flex flex-col gap-4 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
				<p className="text-desc text-center text-figma_grey">
					Let others know about your bracket!
				</p>
				<div className="flex justify-center items-center">
					<EditorButton text="share" />
				</div>
			</div> */}
    </div>
  )
}

export default PlayPanel

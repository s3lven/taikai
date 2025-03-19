import { Shuffle } from "lucide-react"
import EditorButton from "../../../components/editor-button"
import ParticipantsList from "./participants-list"
import { useParticipantStore } from "@/stores/participant-store"
import { useShallow } from "zustand/react/shallow"
import { useBracketStore } from "@/stores/bracket-store"

interface ParticipantPanelProps {
  isTitleVisible?: boolean
}

const ParticipantsPanel = ({
  isTitleVisible = true,
}: ParticipantPanelProps) => {
  const { addParticipant, shuffleParticipants } = useParticipantStore(
    useShallow((state) => ({
      addParticipant: state.addParticipant,
      shuffleParticipants: state.shuffleParticipants,
    }))
  )

  const [status] = useBracketStore(
    useShallow((state) => [state.bracket.status])
  )

  return (
    <div className="w-full h-max flex flex-col gap-2.5 px-0 py-4 md:px-4 font-poppins">
      {isTitleVisible ? (
        <p className="text-figma_grey text-label uppercase w-fit">
          participants
        </p>
      ) : null}
      <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm ">
        <ParticipantsList />

        {status === "Editing" ? (
          <div className="w-full flex justify-between">
            <EditorButton
              text={<Shuffle size={"24px"} />}
              onClickHandler={shuffleParticipants}
            />
            <EditorButton
              text="Add Participant"
              onClickHandler={addParticipant}
            />
          </div>
        ) : null}
      </div>
      {status !== "Editing" ? (
        <p className="text-center text-grey text-desc">
          Note: You cannot edit the participants after the bracket has started.
          Reset the bracket to make changes.
        </p>
      ) : null}
    </div>
  )
}

export default ParticipantsPanel

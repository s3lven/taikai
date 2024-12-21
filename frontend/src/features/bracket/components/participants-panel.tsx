import { Shuffle } from 'lucide-react';
import EditorButton from './editor-button';
import ParticipantsList from './participants-list';
import { useParticipantStore } from '@/stores/participant-store';
import { useShallow } from 'zustand/react/shallow';

const ParticipantsPanel = () => {
    const {addParticipant, shuffleParticipants} = useParticipantStore(useShallow((state) => ({
        addParticipant: state.addParticipant,
        shuffleParticipants: state.shuffleParticipants
    })))

    return (
        <div className="w-full h-max flex flex-col gap-2.5 p-4 pb-80 font-poppins">
          <p className="text-figma_grey text-label uppercase w-fit">participants</p>
          <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm ">
            <ParticipantsList />
    
            {/* {bracketStatus === "Editing" ? ( */}
              <div className="w-full flex justify-between">
                <EditorButton
                  text={<Shuffle size={"24px"} />}
                  onClickHandler={shuffleParticipants}
                />
                <EditorButton text="Add Participant" onClickHandler={addParticipant} />
              </div>
            {/* ) : null} */}
          </div>
          {/* {bracketStatus !== "Editing" ? (
            <p className="text-center text-grey text-desc">
              Note: You cannot edit the participants after the bracket has started.
              Reset the bracket to make changes.
            </p>
          ) : null} */}
        </div>
      );
}

export default ParticipantsPanel
import { Participant } from "@/types";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ParticipantSlot from "./participant-slot";
import { useShallow } from "zustand/react/shallow";
import { useParticipantStore } from "@/stores/participant-store";
import { useBracketStore } from "@/stores/bracket-store";
import ParticipantSlotView from "./participant-slot-view";

const ParticipantsList = () => {
	const { participants, removeParticipant, moveParticipant } =
		useParticipantStore(
			useShallow((state) => ({
				participants: state.participants,
				removeParticipant: state.removeParticipant,
				moveParticipant: state.moveParticipant,
			}))
		);

	const [bracketStatus] = useBracketStore(
		useShallow((state) => [state.bracket.status])
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		const oldIndex = participants.findIndex(
			(participant) => participant.sequence === active.id
		);
		const newIndex = participants.findIndex(
			(participant) => participant.sequence === over.id
		);

		if (oldIndex === -1 || newIndex === -1) return;

		const activeIndex = participants.findIndex(
			(participant) => participant.sequence === active.id
		);
		const overIndex: number = participants.findIndex(
			(participant: Participant) => participant.sequence === over.id
		);

		if (activeIndex !== overIndex) {
			moveParticipant(activeIndex, overIndex);
		}
	};

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(TouchSensor)
	);

	return (
		participants && (
			<div className="flex flex-col gap-2">
				{bracketStatus === "Editing" ? (
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						sensors={sensors}
					>
						<SortableContext
							items={participants.map((participant) => participant.sequence)}
							strategy={verticalListSortingStrategy}
						>
							{participants.map((participant) => (
								<ParticipantSlot
									key={participant.id}
									participant={participant}
									removeParticipant={removeParticipant}
								/>
							))}
						</SortableContext>
					</DndContext>
				) : (
					// Render the participant list in a read-only mode
					participants.map((participant) => (
						<ParticipantSlotView
							key={participant.id}
							participant={participant}
						/>
					))
				)}
			</div>
		)
	);
};

export default ParticipantsList;

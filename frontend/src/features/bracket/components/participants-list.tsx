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

const ParticipantsList = () => {
	const { participants, removeParticipant, moveParticipant } =
		useParticipantStore(
			useShallow((state) => ({
				participants: state.participants,
				removeParticipant: state.removeParticipant,
				moveParticipant: state.moveParticipant,
			}))
		);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		const oldIndex = participants.findIndex(
			(participant) => participant.id === active.id
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

	return participants?.length ? (
		<div className="flex flex-col gap-2">
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
		</div>
	) : (
		participants.map((participant) => (
			<p key={participant.id}>{participant.name}</p>
		))
	);
};

export default ParticipantsList;

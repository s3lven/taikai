import React, { useState } from "react";
import { Participant } from "@/types";
import { GripVertical, X } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "@headlessui/react";

import { debounce } from "lodash";
import { useParticipantStore } from "@/stores/participant-store";

interface ParticipantSlotProps {
	participant: Participant;
	forceDragging?: boolean;
	removeParticipant: (id: number) => void;
}

const ParticipantSlot = ({
	participant,
	forceDragging = false,
	removeParticipant,
}: ParticipantSlotProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		setActivatorNodeRef,
		isDragging,
	} = useSortable({ id: participant.sequence });

	const style = {
		transition: transition ?? undefined,
		transform: CSS.Transform.toString(transform),
		opacity: isDragging ? "0.4" : "1",
	};

	const [inputValue, setInputValue] = useState(participant.name);
	const updatePlayerName = useParticipantStore(
		(state) => state.updateParticipantName
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedUpdateName = React.useCallback(
		debounce((id: number, name: string) => {
			updatePlayerName(id, name);
		}, 300),
		[updatePlayerName]
	);

	const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		debouncedUpdateName(participant.id, newValue);
	};

	const handleRemoveSlot = () => {
		removeParticipant(participant.id);
	};

	return (
		<div ref={setNodeRef} style={style} className="w-full h-6 touch-none">
			<div
				className={`${
					isDragging || forceDragging ? "cursor-grabbing" : "cursor-grab"
				} flex justify-between items-center gap-4 group`}
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
			>
				<div className="flex gap-1 items-center">
					<GripVertical className="text-figma_neutral6" size={"1.5rem"} />
					<p className="w-4 text-desc text-figma_grey text-center">
						{participant.sequence}
					</p>
				</div>
				<div className="flex-1 flex justify-between items-center gap-2">
					<Input
						className="w-full h-full border border-figma_grey bg-figma_neutral8 text-figma_grey px-1"
						value={inputValue}
						onChange={handleChangeName}
					/>
					<Button
						className="flex items-center justify-center text-figma_grey
                opacity-100 md:opacity-0 transition-opacity ease-in-out duration-300 group-hover:opacity-100"
						onMouseDown={handleRemoveSlot}
					>
						<X size={"1rem"} />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ParticipantSlot;

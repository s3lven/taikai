import { Participant } from "@/types";

import { Input } from "@headlessui/react";

interface ParticipantSlotViewProps {
	participant: Participant;
}

const ParticipantSlotView = ({ participant }: ParticipantSlotViewProps) => {
	return (
		<div className="w-full h-6">
			<div className={`flex justify-between items-center gap-4 group`}>
				<div className="flex gap-1 items-center">
					<p className="w-4 text-desc text-figma_grey text-center">
						{participant.sequence}
					</p>
				</div>
				<div className="flex justify-between items-center gap-2">
					<Input
						className="w-full h-full border border-figma_grey bg-figma_neutral8 text-figma_grey px-1"
						value={participant.name}
						readOnly
					/>
				</div>
			</div>
		</div>
	);
};

export default ParticipantSlotView;

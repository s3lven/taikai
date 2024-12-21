import { useBracketStore } from "@/stores/bracket-store";
import { Input } from "@headlessui/react";
import { useShallow } from "zustand/react/shallow";

const BracketNameInput = () => {
	const { name, setBracketName } = useBracketStore(
		useShallow((state) => ({
			name: state.bracket.name,
			setBracketName: state.setBracketName,
		}))
	);

	return (
		<div className="w-full h-full flex flex-col gap-1 ">
			<p className="text-figma_grey text-desc">Bracket Name</p>
			<Input
				className="h-10 px-4 py-4 bg-transparent border border-figma_grey font-poppins text-figma_grey text-desc rounded-md focus-visible:outline-white"
				value={name}
				onChange={(e) => {
					setBracketName(e.target.value);
				}}
			/>
		</div>
	);
};

export default BracketNameInput;

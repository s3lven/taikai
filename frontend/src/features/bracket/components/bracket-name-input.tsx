import { Input } from "@headlessui/react";
import { useState } from "react";

const BracketNameInput = () => {
	const [bracketName, setBracketName] = useState("");

	return (
		<div className="w-full h-full flex flex-col gap-1 ">
			<p className="text-figma_grey text-desc">Bracket Name</p>
			<Input
				className="h-10 px-4 py-4 bg-transparent border border-figma_grey font-poppins text-figma_grey text-desc rounded-md focus-visible:outline-white"
				value={bracketName}
				onChange={(e) => setBracketName(e.target.value)}
			/>
		</div>
	);
};

export default BracketNameInput;

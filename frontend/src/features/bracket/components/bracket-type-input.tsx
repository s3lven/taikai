import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";

const BracketTypeInput = () => {
	const [type, setBracketType] = useBracketStore(useShallow((state) => [state.bracket.type, state.setBracketType]));

	return (
		<div className="w-full h-full flex flex-col gap-1">
			<p className="text-figma_grey text-desc">Bracket Type</p>
			<Select defaultValue={type} value={type} onValueChange={(value) => {setBracketType(value)}}>
				<SelectTrigger
					className={`px-4 py-0 bg-transparent  border-figma_grey font-poppins text-figma_grey text-desc
                    flex justify-between items-center ring-offset-none focus:ring-transparent`}
				>
					<div className="h-full flex items-center">
						<p className="text-figma_grey text-desc">Single Elimination</p>
					</div>
				</SelectTrigger>
				<SelectContent className="py-4 rounded-lg bg-figma_neutral8 focus:outline-none shadow-lg outline outline-1 outline-shade2 text-button-sm text-white font-poppins outline-white">
					<SelectItem
						value="Single Elimination"
						className=" bg-figma_neutral8 hover:bg-figma_neutral7 py-2 cursor-pointer"
					>
						Single Elimination
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default BracketTypeInput;

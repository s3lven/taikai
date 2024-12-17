import { Bracket } from "@/types";
import { User } from "lucide-react";

interface BracketItemProps {
	bracket: Bracket;
	tournamentName: string;
}

const BracketItem = ({ bracket }: BracketItemProps) => {
	return (
		<div className="relative group">
			<div
				className="rounded-lg bg-neutral-700 flex justify-between px-4 py-4 hover:bg-figma_shade2 shadow-lg transition-transform ease-in-out duration-300 hover:scale-[1.01]"
				//   to={`/${tournament}/${bracket.bracketCode}`}
			>
				<div className="flex flex-col justify-center flex-1">
					<p className="">{bracket.name}</p>
					<p className="">{bracket.name}</p>
				</div>
				<div className="flex items-center text-right justify-end w-1/4">
					<p className="w-full">{bracket.status}</p>
				</div>
				<div className="flex gap-4 justify-end items-center w-1/4">
					<div className="flex gap-1 justify-end items-center">
						<p className="text-right">{bracket.numberOfParticipants}</p>
						{/* <p>{bracket.slots.length}</p> */}
						<User />
					</div>
				</div>
			</div>
			{/* <BracketSettingsPopover name={item.bracketName} /> */}
		</div>
	);
};

export default BracketItem
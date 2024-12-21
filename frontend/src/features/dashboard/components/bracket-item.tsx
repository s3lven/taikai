import { Bracket } from "@/types";
import { User } from "lucide-react";
import BracketSettings from "./bracket-settings";
import { useNavigate } from "react-router-dom";

interface BracketItemProps {
	bracket: Bracket;
}

const BracketItem = ({ bracket }: BracketItemProps) => {
	const navigate = useNavigate()

	return (
		<div
			className="relative group rounded-lg bg-neutral-700 px-4 py-4 shadow-lg
				hover:bg-figma_shade2  transition-transform ease-in-out duration-300 hover:scale-[1.01]"
			onClick={() => void navigate(`/bracket/${bracket.id}`)}
		>
			<div className="flex justify-between w-[90%]">
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
				<BracketSettings bracket={bracket} />
			</div>
		</div>
	);
};

export default BracketItem;

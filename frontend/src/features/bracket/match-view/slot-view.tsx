import { IpponType, Participant, PlayerColorType } from "@/types";
import { Check } from "lucide-react";
import MatchDropdown from "./match-dropdown";
import { Button } from "@headlessui/react";

interface SlotProps {
    player: Participant | null;
    color: PlayerColorType;
    isPending?: boolean;
    handleWinner: (player: Participant | null) => void;
    winner: Participant | null;
    matchId: number;
    scores: IpponType[];
    disabled?: boolean;
  }
  

const SlotView = ({
    player,
    color,
    isPending = false,
    handleWinner,
    winner,
    matchId,
    scores,
    disabled = false,
  }: SlotProps) => {
	return (
		<div className="w-full h-[70px] flex items-center">
			<div
				className={`w-[28px] h-full flex items-center justify-center ${
					color === "Red" ? "bg-figma_error rounded-tl" : "bg-white rounded-bl"
				}`}
			>
				<p
					className={`text-label text-center ${
						color === "Red" ? "text-white" : "text-black"
					}`}
				>
					{player?.sequence}
				</p>
			</div>
			<div
				className={`overflow-hidden w-full flex-1 h-full flex justify-between items-center px-2 bg-figma_shade2_30 ${
					color === "Red" ? "rounded-tr" : "rounded-br"
				}`}
			>
				<div className="flex items-center overflow-hidden">
					<p className="text-desc text-white line-clamp-2">
						{player ? player?.name : "To be determined"}
					</p>
				</div>
				{!isPending && (
					<div className="flex items-center gap-8">
						<Button
							onClick={() => handleWinner(player)}
							className={`outline-none hover:bg-figma_neutral8 rounded disabled:hover:bg-transparent ${
								disabled && JSON.stringify(winner) !== JSON.stringify(player) && "opacity-0"
							}`}
							disabled={disabled}
						>
							<Check
								size={"30px"}
								color={`${JSON.stringify(winner) === JSON.stringify(player) ? "#2ECC71" : "white"}`}
								className="transition-colors ease-in-out"
							/>
						</Button>
						<div className="flex items-center gap-1">
							<MatchDropdown
								index={0}
								matchId={matchId}
								playerType={color === "Red" ? "player1" : "player2"}
								initialValue={scores[0]}
								disabled={disabled}
							/>
							<MatchDropdown
								index={1}
								matchId={matchId}
								playerType={color === "Red" ? "player1" : "player2"}
								initialValue={scores[1]}
								disabled={disabled}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SlotView;

import { Bracket, Tournament } from "@/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { User } from "lucide-react";
import { Link } from "react-router-dom";

type BracketDialogItemProps = {
    bracket: Bracket;
    tournamentName: string
  };

const BracketDialogItem = ({ bracket, tournament }: BracketDialogItemProps) => {
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

interface BracketDialogProps {
	tournament: Tournament;
}

const BracketDialog = ({ tournament }: BracketDialogProps) => {
	const order = ["Active", "Upcoming", "Past"];

	return (
		<Dialog>
			<DialogTrigger
				className="aspect-video w-[400px] flex flex-col items-center justify-center 
            bg-slate-300 hover:bg-slate-400 font-poppins cursor-pointer"
			>
				{tournament.name}
			</DialogTrigger>
			<DialogContent className="max-w-3xl w-full max-h-[75vh] bg-figma_neutral8 font-poppins text-white  ">
				<DialogHeader className="border-b border-white pb-2 space-y-4">
					<DialogTitle>{tournament.name}</DialogTitle>
					<DialogDescription className="text-white">
						Select a bracket below
					</DialogDescription>
				</DialogHeader>
				<div
					className="w-full h-full flex-grow flex flex-col justify-start gap-2 px-2 py-4
                  text-desc text-white focus:outline-none overflow-y-auto no-scrollbar"
				>
					{tournament.brackets
						.toSorted(
							(a, b) => order.indexOf(a.status) - order.indexOf(b.status)
						)
						.map((bracket) => (
                            <BracketDialogItem  bracket={bracket} tournamentName={tournament.name}/>
                        ))}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default BracketDialog;

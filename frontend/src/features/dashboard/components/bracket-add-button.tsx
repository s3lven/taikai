import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BracketAddButton = () => {
    const navigate = useNavigate()
    
	const handleAddBracket = () => {
		console.log("Add Bracket");
        
        // Create a new bracket in the backend
        const bracketId = 1;

        // Navigate to the new bracket using .navigate()
        void navigate(`/bracket/${bracketId}`);
	};

	return (
		<Button
			className="rounded-lg bg-neutral-700 px-4 py-4 shadow-lg font-semibold
				hover:bg-figma_shade2 uppercase transition-transform ease-in-out duration-300 hover:scale-[1.01]"
			onClick={handleAddBracket}
		>
			<Plus />
			Add Bracket
		</Button>
	);
};

export default BracketAddButton;

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-center py-[120px] gap-16 bg-figma_dark font-poppins">
			<div className="flex flex-col justify-center items-center gap-6">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-headline text-center text-white">
							Never miss your next match
						</p>
						<p className="text-header text-center text-white ">
							Welcome to Taikai
						</p>
					</div>
					<p className="text-xl leading-8 text-center text-white text-balance w-1/2">
						Taikai provides intuitive bracket creation, real-time match updates,
						and easy navigation to ensure your taikai runs smoothly.
					</p>
				</div>
				<div className="flex gap-6">
					<Link to={"/dashboard"}>
						<Button
							className="bg-figma_secondary hover:bg-figma_secondary/80 text-white hover:text-white font-poppins"
							variant="outline"
							size="lg"
						>
							Get Started
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;

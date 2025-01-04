import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTournamentStore } from "@/stores/tournament-store";
import { Tournament } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name must be longer than 2 characters" })
		.max(50, { message: "Name must be shorter than 50 characters" }),
});

const TournamentEditDialog = () => {
	const { updateTournament, editingTournament, setEditingTournament } =
		useTournamentStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editingTournament
			? { name: editingTournament.name }
			: { name: "" },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const newTournament: Tournament = {
			id: Date.now(),
			name: values.name,
			status: "Upcoming",
			brackets: [],
			location: "here",
			date: "2024-02-29",
			participantCount: 25,
		};
		try {
			await updateTournament(editingTournament!.id, newTournament);
			setEditingTournament(null);
		} catch (error) {
			if(error instanceof Error) {
				console.error(error.message)
			} else {
				console.error("Error when editting tournament")
			}
		}
		
	};

	return (
		<Dialog
			open={!!editingTournament}
			onOpenChange={() => setEditingTournament(null)}
		>
			<DialogContent className=" max-h-[75vh] bg-figma_neutral8 font-poppins text-white" aria-describedby={undefined}>
				<DialogHeader className="border-b border-white pb-2 space-y-4" >
					<DialogTitle>Edit {editingTournament?.name}</DialogTitle>
				</DialogHeader>
				{/* Form Component */}
				<Form {...form}>
					<form
						// Why does this onSubmit work ?
						onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
						className="h-full flex flex-col gap-6 py-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="NCKF Taikai"
											{...field}
											className="bg-neutral-700 hover:bg-figma_shade2 focus-visible:bg-figma_shade2 focus:outline-none border-0 ring-offset-transparent focus-visible:ring-white/50 focus-visible:ring-1 focus-visible:ring-offset-1"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="self-end bg-figma_shade2 hover:bg-figma_shade2/80"
						>
							Submit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default TournamentEditDialog;

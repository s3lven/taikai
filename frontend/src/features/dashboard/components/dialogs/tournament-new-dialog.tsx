import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTournamentStore } from "@/features/dashboard/hooks/tournament-store";
import { TournamentForm } from "@/types";
import useTournamentData from "../../hooks/useTournamentData";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required" })
    .max(50, { message: "Name must be shorter than 50 characters" }),
});

const TournamentNewDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isAddingDialogOpen, setIsAddingDialogOpen } = useTournamentStore();

  const { addTournament, isAddingTournament } = useTournamentData();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: Expand dialog to add more fields
    const newTournament: TournamentForm = {
      name: values.name,
      location: "here",
      date: new Date().toLocaleDateString(),
    };

    addTournament(newTournament);
    setIsAddingDialogOpen(false);
  };

  return (
    <Dialog open={isAddingDialogOpen} onOpenChange={setIsAddingDialogOpen}>
      <DialogContent
        className=" max-h-[75vh] bg-figma_neutral8 font-poppins text-white"
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b border-white pb-2 space-y-4">
          <DialogTitle>New Taikai</DialogTitle>
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
              disabled={isAddingTournament}
            >
              {isAddingTournament ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentNewDialog;

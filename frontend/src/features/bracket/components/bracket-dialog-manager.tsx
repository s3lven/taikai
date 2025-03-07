import { useEffect, useState } from "react";
import ResultDialog from "./results-dialog";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";

const BracketDialogManager = () => {
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [progress, status] = useBracketStore(
    useShallow((state) => [state.bracket.progress, state.bracket.status])
  );

  useEffect(() => {
    if (progress === 100 && status === "In Progress") {
      setIsResultsOpen(true);
    }
  }, [progress, status]);
  return (
    <>
      <ResultDialog isOpen={isResultsOpen} setIsOpen={setIsResultsOpen} />
    </>
  );
};

export default BracketDialogManager;

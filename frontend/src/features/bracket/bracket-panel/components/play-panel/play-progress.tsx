import { useBracketStore } from "@/stores/bracket-store";
import EditorButton from "../../../components/editor-button";
import { useShallow } from "zustand/react/shallow";
import { Progress } from "@/components/ui/progress";
import { useSaveAllChanges } from "@/features/bracket/hooks/useSaveAllChanges";
import { useBracketMutations } from "@/features/bracket/hooks/useBracketMutations";

const PlayProgress = () => {
  const [
    bracketStatus,
    runBracket,
    progress,
    completeBracket,
    reopenBracket,
    resetBracket,
    bracketId,
  ] = useBracketStore(
    useShallow((state) => [
      state.bracket.status,
      state.runBracket,
      state.bracket.progress,
      state.completeBracket,
      state.reopenBracket,
      state.resetBracket,
      state.bracket.id,
    ])
  );

  const { saveAllChanges, isSaving } = useSaveAllChanges();
  const {
    runBracketMutation,
    completeBracketMutation,
    openBracketMutation,
    resetBracketMutation,
  } = useBracketMutations();
  const handleRunBracket = async () => {
    // Client Side
    runBracket();

    // Server Side
    saveAllChanges();
    runBracketMutation.mutate(bracketId);
  };

  const handleCompleteBracket = async () => {
    // Client Side
    completeBracket();

    // Server Side
    completeBracketMutation.mutate(bracketId);
  };

  const handleReopenBracket = async () => {
    // Client Side
    reopenBracket();

    // Server Side
    openBracketMutation.mutate(bracketId);
  };

  const handleResetBracket = async () => {
    // Client Side
    resetBracket();

    // Server Side
    resetBracketMutation.mutate(bracketId);
  };

  return (
    <>
      <div className="w-full pb-2 border-b border-figma_neutral8 ">
        <p className="text-desc text-center text-figma_grey">{bracketStatus}</p>
      </div>
      {bracketStatus === "Editing" ? (
        <p className="text-desc text-center text-figma_grey">
          Ready to go? Click &quot;Start Tournament&quot; to start reporting
          scores:
        </p>
      ) : (
        <Progress value={progress} />
      )}

      <div className="flex flex-col justify-center items-center gap-2">
        {bracketStatus === "Editing" ? (
          <EditorButton
            text="start tournament"
            onClickHandler={handleRunBracket}
            disabled={isSaving || runBracketMutation.isPending}
          />
        ) : (
          <>
            {progress === 100 && bracketStatus === "In Progress" && (
              <EditorButton
                variant={"no-outline"}
                text="mark as complete"
                onClickHandler={handleCompleteBracket}
                disabled={completeBracketMutation.isPending}
              />
            )}
            {bracketStatus === "Completed" && (
              <EditorButton
                variant="no-outline"
                text="reopen bracket"
                onClickHandler={handleReopenBracket}
                disabled={openBracketMutation.isPending}
              />
            )}
            <EditorButton
              variant={"no-outline"}
              text="reset bracket"
              onClickHandler={handleResetBracket}
              disabled={resetBracketMutation.isPending}
            />
          </>
        )}
      </div>
    </>
  );
};

export default PlayProgress;

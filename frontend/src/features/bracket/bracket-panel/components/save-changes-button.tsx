import { useShallow } from "zustand/react/shallow";
import EditorButton from "../../components/editor-button";
import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useSaveAllChanges } from "@/features/bracket/hooks/useSaveAllChanges";

const SaveChangeButton = () => {
  const [hasUnsavedChanges] = useChangeTrackingStore(
    useShallow((state) => [state.hasUnsavedChanges])
  );
  const { saveAllChanges, isSaving } = useSaveAllChanges();

  const handleSave = () => {
    if (!hasUnsavedChanges || isSaving) return;
    saveAllChanges();
  };

  return (
    <EditorButton
      text={isSaving ? "Saving" : "Save Changes"}
      onClickHandler={handleSave}
      disabled={!hasUnsavedChanges || isSaving}
    />
  );
};

export default SaveChangeButton;

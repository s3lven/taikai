import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import EditorButton from "../../components/editor-button";
import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useSaveAllChanges } from "@/features/bracket/hooks/useSaveAllChanges";

const SaveChangeButton = () => {
    const [isSaving, setIsSaving] = useState(false);
    const hasUnsavedChanges = useChangeTrackingStore(
        useShallow((state) => state.hasUnsavedChanges)
    );
    const saveAllChanges = useSaveAllChanges();

    const handleSave = async () => {
        if (!hasUnsavedChanges || isSaving) return;
        setIsSaving(true);
        await saveAllChanges();
        setIsSaving(false);
    };

    return (
        <EditorButton
            text={isSaving ? "Saving" : "Save Changes"}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClickHandler={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
        />
    );
};

export default SaveChangeButton;
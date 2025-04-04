import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useShallow } from "zustand/react/shallow";
import SaveChangeButton from "../save-changes-button";

const SaveChangesPanel = () => {
    const [hasUnsavedChanges] = useChangeTrackingStore(
          useShallow((state) => [state.hasUnsavedChanges])
        );
        
  return (
    <div className="w-full flex flex-col gap-8 px-2 py-4 bg-figma_shade2_30 shadow rounded-sm">
      <div className="w-full pb-2 border-b border-figma_neutral8 ">
        <p className="text-desc text-center text-figma_grey">
          {hasUnsavedChanges ? "Changes Unsaved" : "No Unsaved Changes"}
        </p>
      </div>
      <p className="text-desc text-center text-figma_grey">
        Save your changes to make sure your work doesn&apos;t disappear!
      </p>
      <div className="flex justify-center items-center">
        <SaveChangeButton />
      </div>
    </div>
  )
}

export default SaveChangesPanel

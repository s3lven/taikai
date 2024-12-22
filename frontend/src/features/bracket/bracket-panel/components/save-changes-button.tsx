import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { Change } from "@/types/changes";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import EditorButton from "../../components/editor-button";

const saveChangesToBackend = async (changes: Change[]) => {
	console.log("Received changes: ", changes);
	const plainChanges = changes.map((change) => ({
		...change,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		payload: JSON.parse(JSON.stringify(change.payload)),
	}));
	console.log("Plain changes: ", plainChanges);

	// Type the response
	const response = await fetch(`http://localhost:3001/api/brackets/changes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ changes: plainChanges }),
	});
	if (!response.ok) {
		throw new Error("Failed to save changes");
	}
	console.log("Changes saved successfully");
};

const SaveChangeButton = () => {
	const [getConsolidatedChanges, clearChanges, hasUnsavedChanges] =
		useChangeTrackingStore(
			useShallow((state) => [
				state.getConsolidatedChanges,
				state.clearChanges,
				state.hasUnsavedChanges,
			])
		);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!hasUnsavedChanges || isSaving) return;
		setIsSaving(true);

		try {
			// Get consolidated changes before saving
			const consolidatedChanges = getConsolidatedChanges();
			await saveChangesToBackend(consolidatedChanges);
			clearChanges();
		} catch (error) {
			console.error("Failed to save changes", error);
		} finally {
			setIsSaving(false);
		}
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

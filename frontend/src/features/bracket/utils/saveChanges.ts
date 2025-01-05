import { Change } from "@/types/changes";

const saveChanges = async (changes: Change[]) => {
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

export default saveChanges

import { Change } from "@/types/changes";

const saveChanges = async (changes: Change[]) => {
  console.log("Received changes: ", changes);
  const plainChanges = changes.map((change) => ({
    ...change,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    payload: JSON.parse(JSON.stringify(change.payload)),
  }));
  console.log("Plain changes: ", plainChanges);

  try {
    // Type the response
    const response = await fetch(`http://localhost:3001/api/brackets/changes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ changes: plainChanges }),
    });
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error;
      throw new Error(errorMessage);
    }
    console.log("Changes saved successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error saving changes: ${error.message}`);
    } else {
      console.error("Error saving changes");
    }
  }
};

export default saveChanges;

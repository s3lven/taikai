export default function parsePostgresArray(arrayString: string | null | undefined) {
  if (!arrayString || arrayString === "{}") return [];

  // Remove the outer braces and split by comma
  return arrayString
    .substring(1, arrayString.length - 1)
    .split(",")
    .map((item) => item.trim());
}

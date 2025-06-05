export function sortFieldsByDotPriority(fields) {
  return fields.sort((a, b) => {
    const aHasDot = a.includes(".");
    const bHasDot = b.includes(".");

    if (aHasDot && !bHasDot) return 1;
    if (!aHasDot && bHasDot) return -1;

    return a.localeCompare(b);
  });
}
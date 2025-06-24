export function formatLabel(str) {
  return str
    .split(/[._]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const cleanFormData = (data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== "")
  );
};

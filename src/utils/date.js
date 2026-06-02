import { format, parseISO } from "date-fns";

export const formatIsoDate = (dateIso, formatDate) => {
  if (!dateIso) return;
  return format(parseISO(dateIso), formatDate || "dd MMMM yyyy");
};

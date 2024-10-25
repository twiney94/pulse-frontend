import moment from "moment";

/**
 * Convert a date string (e.g., "2024-05-15T09:00:00+00:00") to a human-readable format
 * @param date - The date string in ISO format
 * @param desiredFormat - "long" for detailed format, "short" for abbreviated
 * @returns A string for short format or an object for long format (date and time)
 */
const convertDate = (
  date: string,
  desiredFormat: "long" | "short" = "long"
): { date: string; time: string } | string => {
  const dateObj = moment(date); // Parse the date string using moment

  if (desiredFormat === "long") {
    const dateStr = dateObj.format("dddd, MMMM Do, YYYY"); // e.g., "Tuesday, November 4th, 2023"
    const timeStr = dateObj.format("h:mm A z"); // e.g., "9:00 AM EST"
    return { date: dateStr, time: timeStr };
  } else {
    return dateObj.format("dddd, MMMM Do"); // e.g., "Tuesday, November 4th"
  }
};

export { convertDate };

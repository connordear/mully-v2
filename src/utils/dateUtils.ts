import { Program, RegistrationInfo } from "@/lib/types";

export function convertDateStrToDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * @param start Start date in format "YYYY-MM-DD"
 * @param end End date in format "YYYY-MM-DD"
 * @returns Array of days of the week between start and end dates
 */
export function getDaysOfWeek(start: string, end: string) {
  const startDate = convertDateStrToDate(start);
  const endDate = convertDateStrToDate(end);
  const daysOfWeek = [];
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    daysOfWeek.push(dayOfWeekLookup[date.getDay()]);
  }
  return Array.from(new Set(daysOfWeek));
}

export function getBirthdays(
  program: Program | undefined,
  registrations: RegistrationInfo[]
) {
  if (!program) return [];
  const { startDate, endDate } = program;
  const start = convertDateStrToDate(startDate);
  const end = convertDateStrToDate(endDate);
  const birthdays: RegistrationInfo[] = [];
  registrations.forEach((registration) => {
    if (!registration.birthdate) return;
    const birthdate = convertDateStrToDate(registration.birthdate);
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      if (
        date.getDate() === birthdate.getDate() &&
        date.getMonth() === birthdate.getMonth()
      ) {
        birthdays.push(registration);
      }
    }
  });
  return birthdays;
}

export const dayOfWeekLookup = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat",
];

/**
 * Given a date, returns a new Date object for the Wednesday of the previous week.
 *
 * @param {Date} date The starting date.
 * @returns {Date} A new Date object representing the previous Wednesday.
 */
export function getPreviousWednesday(date: Date): Date {
  const resultDate = new Date(date);
  const day = resultDate.getDay(); // Sunday = 0, Wednesday = 3

  // Calculate days to subtract to get to the most recent Wednesday
  const daysSinceWednesday = (day + 4) % 7;

  // If it's 0, the day *is* Wednesday, so we need to go back a full week.
  // Otherwise, we just go back the calculated number of days.
  const daysToSubtract = daysSinceWednesday === 0 ? 7 : daysSinceWednesday;

  resultDate.setDate(resultDate.getDate() - daysToSubtract);
  return resultDate;
}

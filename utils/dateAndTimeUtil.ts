import { format } from "date-fns";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
}

export const getDaysHoursMinutesRemaining = (eventTime: Date): Remaining => {
  const timeNow = new Date();
  let delta = Math.abs(eventTime.getTime() - timeNow.getTime()) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  return { days, hours, minutes };
};

// Extract month name (e.g. 'June') from date string (e.g. 01/02/2020)
export const getMonthName = (date: string) => {
  return new Date(date).toLocaleString('default', { month: 'long' });
};

export const isUpcomingDate = (dateStr: string, upcoming = true): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = today <= new Date(dateStr);
  return upcoming ? check : !check;
};

export const isDateSoon = (dateStr: string): boolean => {
  return new Date(dateStr).getMonth() - new Date().getMonth() <= 1;
};

export const convertDateToReadable = (
  dateStr: string,
  month = false
): string => {
  if (dateStr === '2022-02-02') return '';
  const dateWords = new Date(dateStr).toDateString().slice(0, -5).split(' ');
  return month ? dateWords[1] : dateWords[2];
};

// Convert date to readable string and append time if not undefined
export const parseDateAndTime = (date: string, time: string | undefined) => {
  return `${format(new Date(date), 'EEEE do MMMM')}${time ? ` - ${time}` : ''}`;
};

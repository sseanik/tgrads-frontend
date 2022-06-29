interface Remaining {
  days: number;
  hours: number;
  minutes: number;
}

const getDaysHoursMinutesRemaining = (eventTime: Date): Remaining => {
  const timeNow = new Date();
  let delta = Math.abs(eventTime.getTime() - timeNow.getTime()) / 1000;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  return { days, hours, minutes };
};

export default getDaysHoursMinutesRemaining;

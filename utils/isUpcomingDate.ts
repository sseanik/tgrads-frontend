const upcomingDate = (dateStr: string, upcoming = true): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = today <= new Date(dateStr);
  return upcoming ? check : !check;
};

export default upcomingDate;

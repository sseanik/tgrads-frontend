const upcomingDate = (dateStr: string, upcoming = true): boolean => {
  const check = new Date() <= new Date(dateStr);
  return upcoming ? check : !check;
};

export default upcomingDate;

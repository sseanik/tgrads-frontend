const isDateSoon = (dateStr: string): boolean => {
  return new Date(dateStr).getMonth() - new Date().getMonth() <= 1;
};

export default isDateSoon;

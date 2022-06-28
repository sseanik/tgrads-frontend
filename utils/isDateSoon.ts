const isDateSoon = (dateStr: string) => {
  return new Date(dateStr).getMonth() - new Date().getMonth() <= 1;
};

export default isDateSoon;

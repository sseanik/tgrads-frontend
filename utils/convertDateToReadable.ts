const convertDateToReadable = (dateStr: string, month = false) => {
  const dateWords = new Date(dateStr).toDateString().slice(0, -5).split(' ');
  return month ? dateWords[1] : dateWords[2];
};

export default convertDateToReadable;
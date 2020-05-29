export const formatDateToString = (date: Date) => {
  const year = date.getFullYear();
  // pasting a 0 before the number if single digit
  const month =
    date.getMonth() + 1 < 10
      ? 0 + String(date.getMonth() + 1)
      : date.getMonth() + 1;
  const day =
    date.getDate() < 10 ? 0 + date.getDate().toString() : date.getDate();

  return year + '-' + month + '-' + day;
};

export const getFirstDayOfWeek = (userDate: Date) => {
  const date = new Date(userDate);
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  date.setHours(0, 0, 0, 0);

  return new Date(date.setDate(diff));
};

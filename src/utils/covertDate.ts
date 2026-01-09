export function convertDate(date: string, abbrMonth = true) {
  const dateString = new Date(date).toDateString().split(" ");
  const month = dateString[1];
  const day = dateString[2];
  const year = dateString[3];
  const monthString = abbrMonth ? month.substring(0, 3) : month;

  return `${monthString}, ${day} ${year}`;
}

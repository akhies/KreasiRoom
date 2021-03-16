import { DateTime } from 'luxon';

const formatDateToUTC = (datetime, format = 'dd MMMM yyyy HH:mm ZZZZ') => {
  return DateTime.fromSeconds(datetime)
    .toUTC()
    .toFormat(format);
};

export default ({
  title,
  startDatetimeInSeconds,
  endDatetimeInSeconds,
  description
}) => {
  const dateFormat = "yyyyMMdd'T'HHmmss'Z'";
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);
  return `http://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${formatDateToUTC(
    startDatetimeInSeconds,
    dateFormat
  )}/${formatDateToUTC(
    endDatetimeInSeconds,
    dateFormat
  )}&details=${encodedDesc}`;
};

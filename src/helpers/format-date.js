// import moment from 'moment';
import { DateTime } from 'luxon';

export default (datetime, dateFormat = 'dd MMMM yyyy HH:mm ZZZZZ') => {
  if (typeof datetime === Date) {
    return DateTime.fromJSDate(datetime).toFormat(dateFormat);
  }
  return DateTime.fromSeconds(datetime)
    .setLocale('id')
    .toFormat(dateFormat);
};

export const dateSecondsToJSDate = seconds => {
  return DateTime.fromSeconds(seconds).toJSDate();
};

export const dateToISO = datetime => {
  return DateTime.fromSeconds(datetime)
    .setZone('utc')
    .toFormat("yyyyMMdd'T'HHmmss'Z'");
};

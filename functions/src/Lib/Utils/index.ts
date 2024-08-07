import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";

export const getFirebaseUtcTimestamp = (timestamp: number | Date | string) => {
  const date = new Date(timestamp);
  const firebaseTimestamp = Timestamp.fromDate(date);
  return firebaseTimestamp;
};

export const firebaseTimestampToLocalTime = (firebasetTimestamp: Timestamp) => {
  const timestamp = firebasetTimestamp.toMillis();
  const utcDate = moment.utc(timestamp);
  const localDate = utcDate.utcOffset("+0500"); // or any other offset you need
  const formattedDate = localDate.format("YYYY-MM-DD LT");
  const utcDatee = localDate.utc().toDate();

  return { formattedDate, utcDate: utcDatee };
};

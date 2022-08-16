import dayjs from "dayjs";
import { define } from "superstruct";
const dateFormat = define("date with format 'YYYY-MM-DD'", (val) => {
  return dayjs(val, "YYYY-MM-DD").isValid();
});
const timeFormat = define("time with format 'HH:ss' ", (val) => {
  return dayjs(val, "HH:ss").isValid();
});

export { dateFormat, timeFormat };

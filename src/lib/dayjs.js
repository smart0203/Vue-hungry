import dayjs from "dayjs";
import "dayjs/locale/th";
const relativeTime = require("dayjs/plugin/relativeTime");
const utc = require("dayjs/plugin/utc");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

export default dayjs;

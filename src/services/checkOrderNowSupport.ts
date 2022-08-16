import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import dayjs from "@/lib/dayjs";

async function checkOrderNowSupport(restaurantId: number | string) {
  if (!restaurantId) {
    throw new Error("restaurantId paramater is missing");
  }
  const defaultErrorMessage =
    "Oops, something went wrong, failed check is support order now";
  const url = `/restaurants/${restaurantId}/check_order_now_support.json`;
  const now = dayjs();
  const currentDate = now.format("YYYY-MM-DD");
  const detimineStartTime = () => {
    const currentHour = now.format("HH");
    const currentMinute = parseInt(now.format("mm"));
    if (currentMinute > 45) {
      return `${now.add(1, "hour").format("HH")}:00`;
    } else if (currentMinute > 30) {
      return `${currentHour}:45`;
    }
    if (currentMinute > 15) {
      return `${currentHour}:30`;
    }
    return `${currentHour}:15`;
  };
  const startTime = detimineStartTime();
  try {
    const result = await axios({
      url: url,
      method: "post",
      data: {
        date: currentDate,
        startTime: startTime,
      },
    });
    if (result.data) {
      return {
        isSuccess: true,
        data: {
          isSupport: result.data.success,
        },
        message: result.data.message,
      };
    }
    rollbar.error(defaultErrorMessage, {
      restaurantId,
      date: currentDate,
      startTime,
    });

    return {
      isSuccess: false,
      data: "",
      message: defaultErrorMessage,
    };
  } catch (err: any) {
    rollbar.error(err.message || defaultErrorMessage, err, { restaurantId });
    return {
      isSuccess: false,
      data: "",
      message: err.message || defaultErrorMessage,
    };
  }
}

export default checkOrderNowSupport;

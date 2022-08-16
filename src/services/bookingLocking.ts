import useHttp from "@/composable/useHttp";
import useReport from "@/composable/useReport";
import dayjs from "@/lib/dayjs";

export async function createBookingLocking({
  date,
  startTime,
  adult,
  kids,
  restaurantId,
  packages,
  temporaryBookingId,
}: {
  date: string;
  startTime: string;
  adult: number;
  kids: number;
  restaurantId: string | number;
  packages: any[];
  temporaryBookingId?: string | number;
}) {
  const isUpdate = typeof temporaryBookingId === "number";
  const defaultErrorMessage =
    "Oops, something went wrong, failed get locking booking";

  try {
    const dateDayjs = dayjs(date);
    const formatedDate = dateDayjs.format("YYYY-MM-DD");

    if (!dateDayjs.isValid()) {
      const errMessage = "date format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          date,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    if (typeof restaurantId !== "string" && typeof restaurantId !== "number") {
      const errMessage = "restaurantId format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          startTime,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }
    if (
      typeof startTime != "string" ||
      (typeof startTime == "string" && startTime.length == 0)
    ) {
      const errMessage = "startTime format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          startTime,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    if (typeof adult != "number") {
      const errMessage = "adult format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          adult,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    if (typeof kids != "number") {
      const errMessage = "kids format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          kids,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    if (Array.isArray(packages) === false) {
      const errMessage = "packages format is wrong";
      useReport({
        level: "error",
        message: errMessage,
        object: {
          packages,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    const url =
      isUpdate === false
        ? `/temporary_reservations`
        : `/temporary_reservations/${temporaryBookingId}`;
    const payload = {
      reservation: {
        date: formatedDate,
        adult,
        startTime,
        kids,
        restaurantId: restaurantId,
      },
      packages,
    };
    const { isSuccess, data, error } = await useHttp({
      url,
      method: isUpdate ? "PUT" : "POST",
      data: payload,
    });

    if (!isSuccess) {
      const errMessage = error.message || defaultErrorMessage;
      let reportPayload = {
        ...payload.reservation,
        packages,
      };
      if (data.data !== undefined) {
        reportPayload = { ...data.data, ...reportPayload };
      }
      useReport({
        level: "error",
        message: errMessage,
        object: {
          ...reportPayload,
        },
      });
      return {
        isSuccess: false,
        message: errMessage,
        data: null,
      };
    }

    const { tmpReservationId, expiredAt } = data.data;

    if (typeof tmpReservationId !== "number") {
      useReport({
        level: "error",
        message: "temporary reservation id is not number",
        object: {
          tmpReservationId,
        },
      });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
      };
    }

    if (
      typeof expiredAt !== "string" ||
      (typeof expiredAt === "string" && expiredAt.length === 0)
    ) {
      useReport({
        level: "error",
        message: "expiredAt is not string or have zero length",
        object: {
          expiredAt,
        },
      });

      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: null,
      };
    }

    return {
      isSuccess: true,
      message: "",
      data: {
        expiredAt,
        tmpReservationId,
      },
    };
  } catch (err: unknown) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      message: defaultErrorMessage,
      data: null,
    };
  }
}

import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import qs from "qs";
import humps from "humps";
import { string, number, assert } from "superstruct";
import isEmpty from "lodash-es/isEmpty";

interface PointHistoryResponse {
  data: {
    id: string;
    type: "points";
    attributes: {
      createdAt: string;
      expiryDate: string;
      title: "Points Earned" | "Spend Points";
      description: string;
      point: number;
    };
    relationships: {
      restaurant: {
        data: null | {
          id: number;
          lat: string;
          lng: string;
          createdAt: string;
          updatedAt: string;
          ownerId: number;
          daysInAdvance: number;
          minBookingTime: number;
          resDuration: number;
          largestTable: number;
          mon: number;
          tue: number;
          wed: number;
          thu: number;
          fri: number;
          sat: number;
          sun: number;
          phone: string;
          website: string;
          estDuration: null;
          estDurationConfidence: null;
          minInAdvBookingsClose: null;
          avgTurnTime: null;
          confInAvgTurnTime: null;
          maxTurnTime: null;
          active: boolean;
          metaKw: null;
          metaDesc: null;
          instantConfirm: boolean;
          restaurantGroupId: number | null;
          ccMinPartySize: number;
          adultCcHoldAmount: number | null;
          coversRequireAdditional: null;
          timeZone: string;
          rank: number;
          foursquareId: null;
          minPartySize: number;
          adultCcImmediateChargeAmount: number | null;
          minPartySizeToCharge: null;
          onHoldPricingType: string;
          chargePricingType: string;
          price: string;
          subPrice: string;
          hours: string;
          corkageCharge: string;
          reviewLink: null | string;
          expiryDate: string;
          deletedAt: null;
          kidsDefinition: string;
          kidsCcImmediateChargeAmount: number | null;
          kidsCcHoldAmount: number | null;
          reviewsScore: number;
          oldLink: null;
          slug: string;
          cityId: number;
          startDate: string;
          reservationsCount: number;
          reviewsCount: number;
          branchId: number | null;
          timeInAdvanceToRectify: number;
          anyOffers: boolean;
          packageHighestPriceCents: number;
          packageLowestPriceCents: number;
          deliveryNote: string;
          couriers: string;
          deliveryPhone: string;
          recordGuests: boolean;
          acceptKids: boolean;
          customSeats: string;
          reservationSystemOnly: boolean;
          allowBooking: boolean;
          createdBy: null;
          topOrder: number;
          minuteBeforeDeliveryTime: number | null;
          callDriverTimeLimitDuration: number | null;
          merchantId: null;
          activateAutoCallDriver: boolean;
          promotedByHh: null;
          logo: {
            url: string;
          };
          acceptVoucher: boolean;
          isDineIn: boolean;
          isTakeAway: boolean;
          userId: null;
          monTakeAway: number;
          tueTakeAway: number;
          wedTakeAway: number;
          thuTakeAway: number;
          friTakeAway: number;
          satTakeAway: number;
          sunTakeAway: number;
          supportOrderNow: boolean;
          allowOrderNow: boolean;
          allowEditMenu: null;
          dineInMinBookingTimeInAdvance: number;
          deliveryMinBookingTimeInAdvance: number;
          cachedLogoUrl: string;
          cityDeliveryChannelId: null;
          viewCacheKey: string;
          invCacheKey: string;
          bookingFlow: string;
          acceptGroupBooking: boolean;
          confirmMsg: null | string;
          bookingCondition: null;
          requestChoice: null | string;
          requestQuestion: null | string;
          chargeCondition: null;
          holdCondition: null;
          openingHours: null | string;
          address: string;
          misc: string;
          name: string;
          shortName: null;
          smallNote: null;
          foodDetails: null;
          ambience: null;
          selfPickupMessage: null | string;
          customText: null | string;
          confirmMsgTh: string;
          confirmMsgEn: string;
          bookingConditionTh: string;
          bookingConditionEn: string;
          requestChoiceTh: string;
          requestChoiceEn: string;
          requestQuestionTh: string;
          requestQuestionEn: string;
          chargeConditionTh: null | string;
          chargeConditionEn: null | string;
          holdConditionTh: null | string;
          holdConditionEn: null | string;
          openingHoursTh: null | string;
          openingHoursEn: null | string;
          addressTh: string;
          addressEn: string;
          miscTh: string;
          miscEn: string;
          nameTh: string;
          nameEn: string;
          shortNameTh: string;
          shortNameEn: string;
          smallNoteTh: string;
          smallNoteEn: string;
          foodDetailsTh: string;
          foodDetailsEn: string;
          ambienceTh: string;
          ambienceEn: string;
          selfPickupMessageTh: string;
          selfPickupMessageEn: string;
          customTextTh: string;
          customTextEn: string;
        };
      };
      reservation: {
        data: null | {
          id: string;
          type: string;
        };
      };
    };
  }[];
  included: {
    id: string;
    type: string;
    attributes: {
      restaurantId: number;
      date: string;
      startTime: string;
      endTime: string;
      partySize: number;
      active: boolean;
      name: string;
      username: string;
      email: string;
      phone: string;
      noShow: boolean;
      arrived: boolean;
      table: null;
      specialRequest: string;
      channel: number;
      ack: boolean;
      note: null;
      usage: number;
      cancelUrl: null;
      updatedAt: string;
      createdAt: string;
      ownerId: number;
      chargedAmount: number | null;
      chargedAmountInBaht: null | string;
      modifyUrl: string;
      adult: number;
      kids: number;
    };
  }[];
  links: {
    self: string;
    first: string;
    prev: null;
    next: string;
    last: string;
  };
  meta: {
    totalPoints: number;
  };
  success: boolean;
  message: null;
}

async function getPointHistory(
  token: string,
  paramPageNumber = 1,
  paramPageSize = 10
) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get point history";
  try {
    assert(token, string());
    assert(paramPageNumber, number());
    assert(paramPageSize, number());
    const queryString = {
      accessToken: token,
      provider: "hungryhub",
      page: {
        number: paramPageNumber,
        size: paramPageSize,
      },
    };

    const stringifyQueryString = qs.stringify(
      humps.decamelizeKeys(queryString),
      {
        encode: false,
      }
    );
    const response = await axios({
      url: `/users/points/history.json?${stringifyQueryString}`,
      method: "get",
    });

    const responseData = response.data as PointHistoryResponse;
    if (isEmpty(responseData)) {
      rollbar.error(defaultErrorMessage, {
        queryString: stringifyQueryString,
      });
      return {
        isSuccess: false,
        message: defaultErrorMessage,
        data: [],
        meta: null,
      };
    }
    const pointHistory = responseData.data.map((history) => {
      return {
        id: history.id,
        type: history.type,
        ...history.attributes,
      };
    });
    return {
      isSuccess: responseData.success || false,
      data: pointHistory || [],
      message: responseData.message,
      meta: {
        links: responseData.links,
        totalPoints: responseData.meta?.totalPoints,
      },
    };
  } catch (err: any) {
    rollbar.error(defaultErrorMessage, err);
    return {
      isSuccess: false,
      data: [],
      message: defaultErrorMessage,
      meta: null,
    };
  }
}

async function redeemPointAsVoucher(token: string, amount: number) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed redeem point as voucher";
  try {
    assert(token, string());
    assert(amount, number());
    const response = await axios({
      url: "/users/points/redeem_as_voucher.json",
      method: "post",
      data: {
        provider: "hungryhub",
        accessToken: token,
        redeemAmount: amount,
      },
    });
    const responseData = response.data as {
      message: string;
      success: boolean;
    };

    if (isEmpty(responseData)) {
      rollbar.error(defaultErrorMessage);
      return {
        isSuccess: false,
        data: null,
        message: defaultErrorMessage,
      };
    }

    return {
      isSuccess: responseData.success,
      data: {},
      message: responseData.message,
    };
  } catch (err: any) {
    rollbar.error(defaultErrorMessage, err);
    return {
      isSuccess: false,
      data: null,
      message: defaultErrorMessage,
    };
  }
}

export { getPointHistory, redeemPointAsVoucher };

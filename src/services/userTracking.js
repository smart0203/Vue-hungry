import { ref, watch } from "@vue/composition-api";
import isEmpty from "lodash-es/isEmpty";
const asyncEvent = ref({});

const clevertapConstants = [
  { eventId: "PAGE_VIEWED", eventName: "Page Visited" },
  { eventId: "RESTAURANT_VIEWED", eventName: "Restaurant Viewed" },
  { eventId: "INITIATE_SIGNUP", eventName: "Initiated Signed Up" },
  {
    eventId: "VIEWED_RESTAURANT_PACKAGE",
    eventName: "Viewed Restaurant Package",
  },
  { eventId: "SEARCH", eventName: "Search" },
  { eventId: "INITIATED_TO_BOOK", eventName: "Initiated To Book" },
  { eventId: "CHARGED", eventName: "Charged" },
  { eventId: "PROMOTION_TAPPED", eventName: "Promotion Tapped" },
  { eventId: "BLOGGER_REVIEW_TAPPED", eventName: "Blogger review tapped" },
  { eventId: "BLOGGER_TAPPED", eventName: "Blogger tapped" },
  {
    eventId: "MORE_BLOGGER_REVIEW_TAPPED",
    eventName: "More blogger review tapped",
  },
  { eventId: "MORE_REVIEW_TAPPED", eventName: "More review tapped" },
  {
    eventId: "RESTAURANT_SECTION_TAPPED",
    eventName: "Restaurant Section Tapped",
  },
  { eventId: "USER_SIGNED_UP", eventName: "User Signed Up" },
  { eventId: "USER_SIGNED_IN", eventName: "User Signed In" },
  {
    eventId: "RESTAURANT_YOUTUBE_PLAYED",
    eventName: "Restaurant Youtube Played",
  },
  {
    eventId: "BOOKING_STEP_ADULT_SELECTED",
    eventName: "Booking step adult selected",
  },
  { eventId: "BOOKING_STEP_ADD_KIDS", eventName: "Booking Step Add Kids" },
  {
    eventId: "BOOKING_STEP_DATE_SELECTED",
    eventName: "Booking Step Date Selected",
  },
  {
    eventId: "BOOKING_STEP_TIME_SELECTED",
    eventName: "Booking Step Time Selected",
  },
  { eventId: "BOOKING_STEP_BIG_GROUP", eventName: "Booking Step Big Group" },
  {
    eventId: "BOOKING_STEP_BIG_GROUP_SUBMIT",
    eventName: "Booking Step Big Group Submit",
  },
  {
    eventId: "BOOKING_STEP_BEGIN_CHECKOUT",
    eventName: "Booking Step Begin Checkout",
  },
  {
    eventId: "BOOKING_STEP_BIG_GROUP_CONFIRMED",
    eventName: "Booking Step Big Group Confirmed",
  },

  {
    eventId: "BOOKING_STEP_PACKAGE_SELECTED",
    eventName: "Booking Step Package Selected",
  },
  {
    eventId: "BOOKING_STEP_PACKAGE_QUANTITY",
    eventName: "Booking Step Package Quantity",
  },
  {
    eventId: "CLICK_FEATURED_RESTAURANTS_SECTION",
    eventName: "Click Featured Restaurants Section",
  },
  {
    eventId: "PENDING_TRANSACTION",
    eventName: "Pending Transaction",
  },
  {
    eventId: "HOME_SECTION_TAPPED",
    eventName: "Homepage Section Tapped",
  },
  {
    eventId: "ADS_CLICKED",
    eventName: "Ads Clicked",
  },
  {
    eventId: "VR_LINK_CLICKED",
    eventName: "VR Link Clicked",
  },
  {
    eventId: "GIFT_CARD_PURCHASED",
    eventName: "Gift Card Purchased",
  },
];

function track(eventId, eventParam, isAsync = false) {
  const event = clevertapConstants.filter(
    (constant) => constant.eventId === eventId
  );
  if (event.length) {
    if (isAsync) {
      asyncEvent.value = { eventId, eventParam };
      return;
    }
    if (window.dataLayer) {
      window.dataLayer.push({
        event: event[0].eventName,
        ...eventParam,
      });
    }
  } else {
    throw new Error("invalid eventId");
  }
}

function sendAsyncEvent() {
  if (asyncEvent.value && !isEmpty(asyncEvent.value)) {
    track(asyncEvent.value.eventId, asyncEvent.value.eventParam, false);
    asyncEvent.value = {};
  }
}

watch(asyncEvent, (newVal) => {
  if (newVal && !isEmpty(newVal)) {
    sendAsyncEvent();
  }
});

export default track;

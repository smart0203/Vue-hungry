import { ref, watch, Ref } from "@vue/composition-api";
import dayjs from "@/lib/dayjs";
import { screen } from "@/helper/screenSizeHelper";
import * as alert from "@/lib/alert";
import useHttp from "@/composable/useHttp";
import useReport from "@/composable/useReport";
import {
  GroupLandingBloggerReview,
  GroupLandingCustomerReview,
} from "@/types/APIResponse";

type BloggerReview = {
  id: string;
  avatar: string;
  name: string;
  excerpt?: string;
  review: string;
  title: string;
  link: string;
  date: string;
  photos: {
    thumb: string;
    squareThumb: string;
    original: string;
  }[];
  restaurantName: string;
  restaurantId: number;
  restaurantLink: string;
};

type CustomerReview = {
  id: string;
  avatar: string;
  name: string;
  review: string;
  title: string;
  date: string;
  photos: {
    thumb: string;
    caption: string;
    original: string;
  }[];
  restaurantName: string;
  restaurantId: number;
  restaurantLink: string;
};

// global state
const isDesktop = screen != "phone" ? true : false;

// global function
function initDummyBloggerReview(count?: number): BloggerReview[] {
  const loop = count || 5;
  const temp: BloggerReview[] = [];
  for (let index = 0; index < loop; index++) {
    temp.push({
      id: Math.random().toString(36),
      avatar: "",
      name: "",
      excerpt: "",
      review: "",
      title: "",
      link: "",
      date: dayjs().format("DD-MM-YYYY"),
      photos: [
        {
          thumb: "",
          squareThumb: "",
          original: "",
        },
        {
          thumb: "",
          squareThumb: "",
          original: "",
        },
        {
          thumb: "",
          squareThumb: "",
          original: "",
        },
      ],
      restaurantName: "",
      restaurantId: 0,
      restaurantLink: "",
    });
  }
  return temp;
}

function initDummyCustomerReview(count?: number): CustomerReview[] {
  const loop = count || 5;
  const temp: CustomerReview[] = [];
  for (let index = 0; index < loop; index++) {
    temp.push({
      id: Math.random().toString(36),
      avatar: "",
      name: "",
      review: "",
      title: "",
      date: dayjs().format("DD-MM-YYYY"),
      photos: [
        {
          thumb: "",
          caption: "",
          original: "",
        },
        {
          thumb: "",
          caption: "",
          original: "",
        },
        {
          thumb: "",
          caption: "",
          original: "",
        },
      ],
      restaurantName: "",
      restaurantLink: "",
      restaurantId: 0,
    });
  }
  return temp;
}

async function getGroupLandingReviews(
  groupLandingId: string | number,
  reviewType: string,
  pageNumber = 1,
  pageSize = 10
) {
  if (!groupLandingId || !reviewType) {
    throw new Error(
      'Required parameter "groupLandingId" or "reviewType" is missing '
    );
  }
  const defaultErrorMessage =
    "Oops, something went wrong, failed get group landing reviews";
  try {
    const { isSuccess, message, data, error } = await useHttp({
      method: "GET",
      url: `/group_landing_pages/${groupLandingId}/reviews.json?review_type=${reviewType}&per_page=${pageSize}&page=${pageNumber}`,
    });
    if (isSuccess) {
      return {
        isSuccess: true,
        data: data.data,
        message: message,
      };
    }
    useReport({
      level: "error",
      message: error.message || defaultErrorMessage,
    });
    return {
      isSuccess: false,
      data: [],
      message: error.message,
    };
  } catch (err) {
    useReport({
      level: "error",
      message: defaultErrorMessage,
      errorException: err,
    });
    return {
      isSuccess: false,
      data: [],
      message: defaultErrorMessage,
    };
  }
}

const bloggerReview = (
  groupLandingId: number | string,
  isGroupLandingFound: Ref<boolean>
) => {
  if (!groupLandingId) {
    throw new Error("missing groupLandingId");
  }
  const isLoading = ref(true);
  const reviews = ref<BloggerReview[]>([]);

  reviews.value = initDummyBloggerReview();

  watch(isGroupLandingFound, () => {
    getReview();
  });

  async function getReview() {
    isLoading.value = true;
    const { data, isSuccess, message } = await getGroupLandingReviews(
      groupLandingId,
      "blogger",
      1,
      100
    );
    const responseData = data as GroupLandingBloggerReview["data"];
    if (isSuccess) {
      reviews.value = responseData.map((review) => {
        const reviewRelationship = review.relationships;
        const reviewAttr = review.attributes;

        const restaurantLink = () => {
          const restaurantSlug = reviewRelationship.restaurant?.data?.slug;
          const restaurantBranchId = reviewRelationship.branch?.data?.id;

          if (restaurantSlug) {
            return `/restaurants/${restaurantSlug}`;
          } else if (restaurantBranchId) {
            return `/restaurants/search?branch_id=${restaurantBranchId}`;
          }
          throw new Error("Invalid restaurant slug / branch id ");
        };

        const restaurantName = reviewAttr.restaurantId
          ? review.relationships.restaurant.data.name
          : null;
        const restaurantNameBranch = !review.attributes.restaurantId
          ? review.relationships.branch.data.name
          : null;

        return {
          id: review.id,
          avatar: reviewAttr.blogger.avatar.original,
          name: reviewAttr.blogger.name,
          excerpt: reviewAttr.excerpt,
          review: reviewAttr.review,
          title: reviewAttr.title,
          link: reviewAttr.bloggerLink || review.attributes.link,
          date: reviewAttr.createdAt,
          photos: reviewAttr.photos,
          restaurantName: restaurantName || restaurantNameBranch,
          restaurantId: reviewAttr.restaurantId,
          restaurantLink: restaurantLink(),
        };
      });

      isLoading.value = false;
    } else {
      alert.error(message);
    }
  }

  return {
    isLoading,
    reviews,
  };
};

const customerReview = (
  groupLandingId: number | string,
  isGroupLandingFound: Ref<boolean>
) => {
  if (!groupLandingId) {
    throw new Error("missing groupLandingId");
  }

  // state
  const isLoading = ref(true);
  const reviews = ref<CustomerReview[]>([]);
  const pageNumber = ref(1);
  const pageSize = ref(0);
  const isShowLoadMore = ref(true);

  reviews.value = initDummyCustomerReview();

  watch(isGroupLandingFound, async () => {
    if (isDesktop) {
      pageSize.value = 100;
    } else {
      pageSize.value = 2;
    }
    reviews.value = await getReview(pageNumber.value, pageSize.value);
  });

  async function loadMoreReview() {
    pageNumber.value = pageNumber.value + 1;
    const result = await getReview(pageNumber.value, pageSize.value);
    reviews.value = [...result, ...reviews.value];
  }

  async function getReview(paramPageNumber: number, paramPageSize: number) {
    isLoading.value = true;
    const { isSuccess, message, data } = await getGroupLandingReviews(
      groupLandingId,
      "user",
      paramPageNumber,
      paramPageSize
    );

    const resultData = data as GroupLandingCustomerReview["data"];

    if (isSuccess) {
      const parseResult = resultData.map((review) => {
        let restaurantId = 0;
        let restaurantName = "";
        let restaurantLink = "";
        if (review.attributes.restaurant) {
          restaurantId = review.attributes.restaurant.id;
          restaurantName = review.attributes.restaurant.name;
          restaurantLink = `/restaurants/${review.attributes.restaurant.link}`;
        }
        const avatar = review.attributes.userAvatar
          ? review.attributes.userAvatar.original
          : review.attributes.avatar;
        return {
          id: review.id,
          rating: review.attributes.rating,
          restaurantId: restaurantId,
          restaurantName: restaurantName,
          restaurantLink: restaurantLink,
          avatar: avatar,
          name: review.attributes.userName,
          review: review.attributes.review,
          title: "",
          date: review.attributes.createdAt,
          photos: review.attributes.pictures,
        };
      });

      isLoading.value = false;
      return parseResult;
    } else {
      alert.error(message);
      return [];
    }
  }

  return {
    isLoading,
    reviews,
    loadMoreReview,
    isShowLoadMore,
  };
};

export { customerReview, bloggerReview };

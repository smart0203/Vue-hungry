import { getField, updateField } from "vuex-map-fields";
import { API_MINOR_VERSION } from "@/lib/constant";
import axios from "@/lib/myAjax.js";
import * as alert from "@/lib/alert";
import rollbar from "@/lib/rollbar";
import humps from "humps";
import qs from "query-string";
const initialState = {
  keepState: false,
  reviews: [],
  bloggerReviews: [],
  reviewTotalScore: 0,
  reviewTotalCount: 0,
  reviewStarsCount: [],
  reviewPage: 1,
  bloggerReviewPage: 1,
  anyNextReviews: false,
  anyNextBloggerReviews: false,
};

export default {
  namespaced: true,
  state: {
    ...initialState,
  },
  getters: {
    getField,
    getState: (state) => (name) => {
      return state[name];
    },
  },
  mutations: {
    updateField,
    setState(state, payload) {
      state[payload.state] = payload.val;
    },
    pushState(state, payload) {
      state[payload.state] = [...state[payload.state], ...payload.val];
    },
    resetAllState(state) {
      if (state.keepState) {
        return;
      }
      let newState = {
        ...initialState,
      };
      Object.assign(state, newState);
    },
  },
  actions: {
    loadMoreReview({ state, dispatch }) {
      state.reviewPage += 1;
      return dispatch("getReview");
    },
    lodaMoreBloggerReview({ state, dispatch }) {
      if (state.bloggerReviews.length > 3) {
        state.bloggerReviewPage += 1;
      }
      return dispatch("getBloggerReview");
    },
    getReview({ state, commit, rootState }) {
      return new Promise((resolve, reject) => {
        try {
          const payload = humps.decamelizeKeys({
            restaurantId: rootState.restaurant.restaurantId,
            minorVersion: API_MINOR_VERSION,
            sort: "newest",
          });
          const pageNumber = `page[number]=${state.reviewPage}`;
          const pageSize = `page[size]=${10}`;
          const query = `${qs.stringify(payload)}&${pageNumber}&${pageSize}`;
          const url = `/reviews.json?${query}`;
          axios({
            url,
            method: "get",
          })
            .then((resp) => {
              const response = resp.data;
              const links = response.links;

              if (response.success) {
                const reviews = response.data;
                commit("pushState", {
                  state: "reviews",
                  val: reviews.map((review) => {
                    let restaurantId = "";
                    let restaurantName = "";
                    if (review.attributes.restaurant) {
                      restaurantId = review.attributes.restaurant.id;
                      restaurantName = review.attributes.restaurant.name;
                    }
                    const avatar = review.attributes.userAvatar
                      ? review.attributes.userAvatar.original
                      : review.attributes.avatar;
                    return Object.freeze({
                      id: review.id,
                      rating: review.attributes.rating,
                      restaurantId: restaurantId,
                      restaurantName: restaurantName,
                      avatar: avatar,
                      name: review.attributes.userName,
                      review: review.attributes.review,
                      title: "",
                      date: review.attributes.createdAt,
                      photos: review.attributes.pictures,
                    });
                  }),
                });
                if (links && links.next && reviews.length) {
                  commit("setState", {
                    state: "anyNextReviews",
                    val: true,
                  });
                } else {
                  commit("setState", {
                    state: "anyNextReviews",
                    val: false,
                  });
                }
                resolve();
              } else {
                const error = {
                  message: "Oops, something went wrong, failed get reviews",
                  cause: response,
                };
                rollbar.error(error.message, error.cause);
                reject(error.message);
              }
            })
            .catch((err) => {
              if (err.dontReport) {
                reject(null);
              } else {
                const error = {
                  message: "Oops, failed get review",
                  cause: err,
                };

                rollbar.error(error.message, error.cause);
                reject(error.message);
              }
            });
        } catch (err) {
          if (err.dontReport) {
            reject(null);
          } else {
            const error = {
              message: "Oops, failed get review",
              cause: err,
            };

            rollbar.error(error.message, error.cause);
            reject(error.message);
          }
        }
      });
    },
    getBloggerReview({ state, commit, rootState }) {
      return new Promise((resolve, reject) => {
        try {
          const payload = humps.decamelizeKeys({
            minorVersion: API_MINOR_VERSION,
          });
          const restaurantId = rootState.restaurant.restaurantId;
          const pageNumber = state.bloggerReviewPage;
          const pageSize = state.bloggerReviews.length === 0 ? 3 : 10;
          const query = `${qs.stringify(
            payload
          )}&page[number]=${pageNumber}&page[size]=${pageSize}`;
          const url = `/restaurants/${restaurantId}/blogger_reviews.json?${query}`;
          axios({
            url,
            method: "get",
          })
            .then((resp) => {
              const response = resp.data;
              if (response.success) {
                const reviews = response.data;
                const links = response.links;
                const commitType =
                  state.bloggerReviewPage === 1 ? "setState" : "pushState";
                commit(commitType, {
                  state: "bloggerReviews",
                  val: reviews.map((review) => {
                    return Object.freeze({
                      id: review.id,
                      avatar: review.attributes.blogger.avatar.original,
                      name: review.attributes.blogger.name,
                      excerpt: review.attributes.excerpt,
                      review: review.attributes.review,
                      title: review.attributes.title,
                      link:
                        review.attributes.bloggerLink || review.attributes.link,
                      date: review.attributes.createdAt,
                      photos: review.attributes.photos,
                    });
                  }),
                });
                if (links && links.next && reviews.length > 0) {
                  commit("setState", {
                    state: "anyNextBloggerReviews",
                    val: true,
                  });
                } else {
                  commit("setState", {
                    state: "anyNextBloggerReviews",
                    val: false,
                  });
                }
                resolve();
              } else {
                const error = {
                  message: "Oops, something went wrong, failed get reviews",
                  cause: response,
                };
                alert.error(error.message);
                rollbar.error(error.message, error.cause);
              }
            })
            .catch((err) => {
              if (err.dontReport) {
                reject(null);
              } else {
                const error = {
                  cause: err,
                  message:
                    "Oops, something went wrong, failed get blogger review",
                };
                rollbar.error(error.message, error.cause);
                reject(error.message);
              }
            });
        } catch (err) {
          const error = {
            cause: err,
            message: "Oops, something went wrong, failed get blogger review",
          };
          rollbar.error(error.message, error.cause);
          reject(error.message);
        }
      });
    },
  },
};

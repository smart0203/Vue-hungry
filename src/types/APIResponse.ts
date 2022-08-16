import { Voucher } from "./Voucher";
type Links = {
  self: string;
  first: string;
  prev: null;
  next: string;
  last: string;
};
// API: https://hungryhub.com/api/v5/group_landing_pages/:id / https://hungryhub.com/api/v5/group_landing_pages
interface GroupLanding {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    footerDescription: null;
    slug: string;
    compactRestaurant: boolean;
    totalRestaurants: number;
    groupTagId: null;
    branchId: null;
    tagId: number;
    sortBy: null;
    mobilePhotos: string[];
    desktopPhotos: string[];
    logo: string;
  };
}

export interface GetGroupLandingPage {
  data: GroupLanding | GroupLanding[];
  success: boolean;
  message: null;
}

// https://hungryhub.com/api/v5/group_landing_pages/:id/reviews.json?review_type=blogger
export interface GroupLandingBloggerReview {
  data: {
    id: string;
    type: "blogger_reviews";
    attributes: {
      priority: number;
      title: string;
      review: string;
      excerpt: string;
      createdAt: string;
      bloggerLink: string;
      restaurantId: number;
      branchId: null;
      blogger: {
        id: number;
        name: string;
        website: null | string;
        facebook: null | string;
        twitter: null | string;
        instagram: null | string;
        avatar: {
          thumb: string;
          original: string;
        };
      };
      photos: {
        thumb: string;
        squareThumb: string;
        original: string;
      }[];
      cover: {
        squareUrl: string;
        original: string;
      };
      link: string;
    };
    relationships: {
      restaurant: {
        data: {
          id: number;
          email?: string;
          name: string;
          channelId?: number;
          createdAt: string;
          updatedAt: string;
          slug: string;
          avatar?: {
            url: string;
          };
          website: null | string;
          instagram?: null | string;
          facebook?: null | string;
          twitter?: null | string;
          lat?: string;
          lng?: string;
          ownerId?: number;
          daysInAdvance?: number;
          minBookingTime?: number;
          resDuration?: number;
          largestTable?: number;
          mon?: number | null;
          tue?: number | null;
          wed?: number | null;
          thu?: number | null;
          fri?: number | null;
          sat?: number | null;
          sun?: number | null;
          phone?: string;
          estDuration?: null;
          estDurationConfidence?: null;
          minInAdvBookingsClose?: null;
          avgTurnTime?: null;
          confInAvgTurnTime?: null;
          maxTurnTime?: null;
          active?: boolean;
          metaKw?: null;
          metaDesc?: null;
          instantConfirm?: boolean;
          restaurantGroupId?: number;
          ccMinPartySize?: number;
          adultCcHoldAmount?: null;
          coversRequireAdditional?: null;
          timeZone?: string;
          rank?: number;
          foursquareId?: null;
          minPartySize?: number;
          adultCcImmediateChargeAmount?: null;
          minPartySizeToCharge?: null;
          onHoldPricingType?: string;
          chargePricingType?: string;
          price?: string;
          subPrice?: string;
          hours?: string;
          string?: string;
          reviewLink?: null;
          expiryDate?: string;
          deletedAt?: null;
          kidsDefinition?: string;
          kidsCcImmediateChargeAmount?: null;
          kidsCcHoldAmount?: null;
          reviewsScore?: number;
          oldLink?: null | string;
          cityId?: number;
          startDate?: string;
          reservationsCount?: number;
          reviewsCount?: number;
          branchId?: number;
          timeInAdvanceToRectify?: number;
          anyOffers?: boolean;
          packageHighestPriceCents?: number;
          packageLowestPriceCents?: number;
          deliveryNote?: string;
          couriers?: string;
          deliveryPhone?: string;
          recordGuests?: boolean;
          acceptKids?: boolean;
          customSeats?: string;
          reservationSystemOnly?: boolean;
          allowBooking?: boolean;
          createdBy?: null;
          topOrder?: number;
          minuteBeforeDeliveryTime?: number;
          callDriverTimeLimitDuration?: number;
          merchantId?: number;
          activateAutoCallDriver?: boolean;
          promotedByHh?: null;
          logo?: {
            url: string;
          };
          acceptVoucher?: boolean;
          isDineIn?: boolean;
          isTakeAway?: boolean;
          userId?: number;
          monTakeAway?: number | null;
          tueTakeAway?: number | null;
          wedTakeAway?: number | null;
          thuTakeAway?: number | null;
          friTakeAway?: number | null;
          satTakeAway?: number | null;
          sunTakeAway?: number | null;
          supportOrderNow?: boolean;
          allowOrderNow?: boolean;
          dineInMinBookingTimeInAdvance?: number;
          deliveryMinBookingTimeInAdvance?: number;
          cachedLogoUrl?: string;
          cityDeliveryChannelId?: null;
          viewCacheKey?: string;
          invCacheKey?: string;
          bookingFlow?: string;
          acceptGroupBooking?: boolean;
          flag?: boolean;
          minimumSeatAllotment?: number;
          confirmMsg?: null | string;
          bookingCondition?: null;
          requestChoice?: null;
          requestQuestion?: null;
          chargeCondition?: null;
          holdCondition?: null;
          openingHours?: null;
          address?: string;
          misc?: string;
          shortName?: string;
          smallNote?: null;
          foodDetails?: null;
          ambience?: null;
          selfPickupMessage?: null;
          customText?: null;
          confirmMsgTh?: string;
          confirmMsgEn?: string;
          bookingConditionTh?: string;
          bookingConditionEn?: string;
          requestChoiceTh?: string;
          requestChoiceEn?: string;
          requestQuestionTh?: string;
          requestQuestionEn?: string;
          chargeConditionTh?: null;
          chargeConditionEn?: null;
          holdConditionTh?: null;
          holdConditionEn?: null;
          openingHoursTh?: null;
          openingHoursEn?: null;
          addressTh?: string;
          addressEn?: string;
          miscTh?: string;
          miscEn?: string;
          nameTh?: string;
          nameEn?: string;
          shortNameTh?: string;
          shortNameEn?: string;
          smallNoteTh?: string;
          smallNoteEn?: string;
          foodDetailsTh?: string;
          foodDetailsEn?: string;
          ambienceTh?: string;
          ambienceEn?: string;
          selfPickupMessageTh?: string;
          selfPickupMessageEn?: string;
          customTextTh?: string;
          customTextEn?: string;
        };
      };
      branch: any;
      blogger: {
        data: {
          id: number;
          name: string;
          website: null | string;
          facebook: null | string;
          twitter: null | string;
          instagram: null | string;
          avatar: {
            thumb: string;
            original: string;
          };
        };
      };
    };
  }[];
  links: Links;
  success: boolean;
  message: null;
}

// https://hungryhub.com/api/v5/group_landing_pages/:id/reviews.json?review_type=user
export interface GroupLandingCustomerReview {
  data: {
    id: string;
    type: string;
    attributes: {
      rating: number;
      review: string;
      title: null;
      createdAt: string;
      userName: string;
      reviewRecommendedFors: {
        id: number;
        reviewId: number;
        dimensionId: number;
        createdAt: string;
        updatedAt: string;
      }[];
      encryptedId: string;
      userAvatar: {
        thumb: string;
        medium: string;
        original: string;
      };
      pictures: {
        thumb: string;
        original: string;
        caption: string;
      }[];
      avatar: string;
      restaurant: {
        id: number;
        name: string;
        link: string;
      };
      link: string;
    };
  }[];
  links: Links;
  success: boolean;
  message: null;
}

// API: https://hungryhub.com/api/v5/users/vouchers.json
export interface UserVoucher {
  data: {
    id: string;
    type: "vouchers";
    attributes: Voucher;
  }[];
  links: Links;
  meta: {
    total: number;
  };
  success: boolean;
  message: null;
}

export interface VoucherData {
  id: string;
  type: string;
  attributes: Voucher;
}

export interface ValidateVoucher {
  data: null | VoucherData | VoucherData[];
  meta?: {
    calculate: Calculate;
    totalVoucherAmount: number;
  };
  success?: boolean;
  message?: string;
}

export interface Calculate {
  chargePrice: number;
  currency: string;
  totalPrice: number;
  chargeAmountType: string;
  chargePercent: number;
  chargeType: null;
  originalDeliveryFee: number;
  deliveryFee: number;
  deliveryFeeCurrency: string;
  deliveryFeeInBaht: string;
  deliveryFeePerKmInBaht: number;
  freeDeliveryFeeThresholdInBaht: number;
  deliveryRadius: number;
  totalPackagePrice: number;
  selectedPackages: {
    id: number;
    restaurantPackageId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  isDineIn: boolean;
  usedVoucherAmountByHh: number;
  usedVoucherAmountByRestaurant: number;
  voucherDeductibles: any[];
  usedVouchers: {
    id: number | string;
    name: string;
    voucherCode: string;
    amount: number;
  }[];
}

//API: https://hungryhub.com/api/v5/cuisines.json?client_type=web&sort=name_asc
export interface GetCuisineList {
  data: {
    id: string;
    type: "cuisines";
    attributes: {
      name: string;
      nameEn: string;
      totalRestaurants: number;
      cover: {
        url: string;
        thumbUrl: string;
      };
    };
  }[];
  links: Links;
  success: boolean;
  message: null;
}

// GET https://hungryhub.com/api/v5/reservations.json
export interface GetUserReservations {
  data: {
    id: string;
    type: "reservations";
    attributes: {
      restaurantId: number;
      date: string;
      name: string;
      specialRequest: string;
      adult: number;
      kids: number;
      qrcode: string;
      phone: string;
      email: string;
      serviceType: "dine_in" | "pick_up" | string;
      serviceTypeHumanize: "Dine In" | "Self Pick-Up" | string;
      deliveryAddressHumanize: null | string;
      distanceToRestaurant: string;
      encryptedId: string;
      qrCodeForPayment: null | string;
      chargePrice: number;
      totalPrice: number;
      chargeAmountType: string;
      chargePercent: number;
      chargeType: "on_charge" | string;
      deliveryFeeInBaht: string;
      deliveryFeePerKmInBaht: string;
      skipStartTime: boolean;
      trueWalletUrl: string;
      shopeePayUrl: string;
      corporateEventId: null;
      facebookEventId: string;
      deliveryRadius: number;
      isGroupBooking: boolean;
      deliveryFee: {
        amount: number;
        format: string;
        currency: string;
      };
      originalDeliveryFee: {
        amount: number;
        format: string;
        currency: string;
      };
      ack: boolean;
      startTime: string;
      isLastMinute: boolean;
      status: string;
      statusAsSymbol: string;
      shareUrl: string;
      modifyUrl: string;
      diningOccasion: string;
      estimationDeliveredAt: string;
      driverTrackingLink: string;
      reviewUrl: string;
      packages: {
        name: string;
        amount: string;
        netPrice: string;
        quantity: number;
        id: number;
        isAddOn: boolean;
        pricingType: string;
        sections: any[];
        kidsPriceRate: number;
        rules: {
          priceDescription: string;
          price: string;
          minSeat: number | null;
          maxSeat: null | string;
          perPack: number | null;
          duration: number;
        }[];
        skipTimeSelection: null;
        isAcceptManyQuantity: boolean;
        customNetPrice: string;
      }[];
      deliveryStatus: string;
      availableDeliveryStatus: {
        key:
          | "Driver::CANCELLED"
          | "Driver::DELIVERED"
          | "Driver::FINDING_DRIVER"
          | "Driver::ON_THE_WAY_TO_RESTAURANT"
          | "Driver::PICKED_UP"
          | string;
        label:
          | "Delivered"
          | "Finding driver"
          | "Hungryhub canceled"
          | "On the Way to Customer"
          | "On The Way to Restaurant"
          | string;
      }[];
      driver: any;
      supportTracking: boolean;
      priceAmount: string;
      priceCurrency: string;
      revenue: {
        amount: string;
        currency: string;
      };
      type: string;
      pricingType: string;
      typeShort: string;
      restaurantName: string;
      restaurantNameEn: string;
      guestBookingId: null;
      guests: {
        name: string;
        phone: string;
      }[];
      myRating: number;
      hungryPoints: number;
      clevertapPayload: {
        id: number;
        type: string;
        priceCents: number;
        priceCurrency: string;
        commision: string;
        quantity: number;
        restaurantPackageId: number;
        name: string;
        netPrice: string;
        amount: string;
        pricingType?: string;
      }[];
      qrCodeForPaymentExpiredAt: string;
      isOrderNow: boolean;
      hasPrepayment: boolean;
      usedVouchers: any[];
      paymentType: null | string;
    };
    relationships: {
      restaurant: {
        data:
          | { id?: string; type: string }[]
          | { id?: string; type: string }
          | null;
      };
      vouchers: {
        data:
          | { id?: string; type: string }[]
          | { id?: string; type: string }
          | null;
      };
      address: {
        data:
          | { id?: string; type: string }[]
          | { id?: string; type: string }
          | null;
      };
      review: {
        data:
          | { id?: string; type: string }[]
          | { id?: string; type: string }
          | null;
      };
    };
  }[];
  included: {
    id?: string;
    type:
      | "restaurant-packages"
      | "restaurants"
      | "restaurants-pictures"
      | "reviews"
      | string;
    attributes: {
      lowestAycePrice?: string;
      lowestPpPrice?: null | string;
      lowestXpPrice?: null | string;
      lowestHsPrice?: null;
      lowestBfpPrice?: null | string;
      lowestSmPrice?: null;
      lowestHahPrice?: string;
      pricePerPerson?: {
        amount: string;
        currency: string;
        symbol: string;
        format: string;
      };
      priceAndPricingType?: {
        amount: number;
        currency: string;
        symbol: string;
        format: string;
        pricingType: string;
      };
      isDeleted?: boolean;
      lat?: string;
      lng?: string;
      largestTable?: number;
      branchId?: number | null;
      minPartySize?: number;
      name?: string;
      names?: {
        th: string;
        en: string;
      };
      slug?: string;
      favorited?: boolean;
      allowBooking?: boolean;
      availability?: string;
      reviewsScore?: number;
      reviewsCount?: number;
      mapLocation?: string;
      promotedByHh?: boolean;
      enableBigGroupFeature?: boolean;
      location?: string;
      primaryLocation?: {
        id: number;
        name: string;
      };
      cuisine?: string;
      primaryCuisine?: {
        id: number;
        name: string;
      };
      imageCoverUrl?: {
        thumb: string;
        large: string;
        square: string;
      };
      canonical_link?: string;
      lastBookingWasMade?: string;
      totalCovers?: number;
      timeSlots?: any;
      reservationSystemOnly?: boolean;
      phone?: string;
      phoneForDelivery?: string;
      rating?: null;
      review?: null;
      title?: null;
      createdAt?: null;
      userName?: string;
      reviewRecommendedFors?: any[];
      encryptedId?: string;
      userAvatar?: {
        thumb: string;
        medium: string;
        original: string;
      };
      pictures?: any[];
      avatar?: string;
      restaurant?: {
        id: number;
        name: string;
        link: string;
      };
      link?: string;
    };
    relationships?: any;
  }[];
  links: Links;
  success: boolean;
  message: null;
}

// GET https://hungryhub.com/api/v5/users/favorite_restaurants.json
export interface GetFavRestaurants {
  data: {
    id: string;
    type: string;
    attributes: {
      lowestAycePrice: null | string;
      lowestPpPrice: null | string;
      lowestXpPrice: null | string;
      lowestHsPrice: null;
      lowestBfpPrice: null;
      lowestSmPrice: null;
      lowestHahPrice: null | string;
      pricePerPerson: {
        amount: string;
        currency: string;
        symbol: string;
        format: string;
      };
      priceAndPricingType: {
        amount: number;
        currency: string;
        symbol: string;
        format: string;
        pricingType: string;
      };
      isDeleted: boolean;
      lat: string;
      lng: string;
      reviewsCount: number;
      largestTable: number;
      branchId: number | null;
      minPartySize: number;
      name: string;
      nameEn: string;
      slug: string;
      favorited: boolean;
      allowBooking: boolean;
      availability: string;
      reviewsScore: number;
      mapLocation: string;
      promotedByHh: boolean;
      enableBigGroupFeature: boolean;
      location: string;
      primaryLocation: {
        id: number;
        name: string;
      };
      cuisine: string;
      primaryCuisine: {
        id: number;
        name: string;
      };
      imageCoverUrl: {
        thumb: string;
        large: string;
        square: string;
      };
      canonicalLink: string;
      lastBookingWasMade: string;
      totalCovers: number;
      timeSlots: any;
      reservationSystemOnly: boolean;
      breadcrumbs: {
        order: number;
        title: string;
        link: string;
      }[];
      address: string;
      parking: boolean | string;
      corkageCharge: string;
      openingHours: null;
      foodDetails: null;
      daysInAdvance: number;
      ambience: null;
      expiryDate: string;
      smallNote: null;
      acceptKids: boolean;
      selfPickupMessage: null;
      customText: null | string;
      recordGuests: boolean;
      acceptVoucher: boolean;
      description: string;
      customSeats: any[];
      tags: any[];
      logoUrl: {
        medium: string;
        thumb: string;
      };
      platform: string[];
      customSectionTitle: string;
      customSectionContent: string;
      availablePackageTypes: string[];
      reservationDurationInHours: string;
      openingHoursShort: string;
      weekdayOpeningHours: {
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
        sat: string;
        sun: string;
      };
      hashtags: {
        id: number;
        label: string;
        linkToGroupLandingPage: string;
      }[];
      videos: string[];
      locations: {
        id: number;
        title: string;
      }[];
      cuisines: {
        id: number;
        title: string;
      }[];
      jsonld: null;
      link: string;
      seo: {
        title: string;
        description: string;
        keywords: string;
      };
      linkToGroupLandingPage: string;
      gbPrimepayPublicKey: string;
      supportOrderNow: boolean;
      cookingTime: number;
      hasDeliveryPricingTier: boolean;
      phone: string;
      phoneForDelivery: string;
      covid19Rating: {
        overallCleanliness: string;
        socialDistancing: string;
        staffProtection: string;
      };
    };
    relationships: {
      pictures: {
        data: {
          id: string;
          type: string;
        }[];
      };
      restaurant_packages: {
        data: {
          id: string;
          type: string;
        }[];
      };
      last_reviews: {
        data: {
          id: string;
          type: string;
        }[];
      };
      blogger_reviews: {
        data: {
          id: string;
          type: string;
        }[];
      };
    };
  }[];
  links: Links;
  success: boolean;
  message: null | string;
}

//API: https://hungryhub.com/api/v5/cities.json
export interface GetCitiesList {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      homeDescription: string;
    };
  }[];
  success: boolean;
  message: null;
}

// https://hungryhub.com/api/v5/loyalty_levels.json
export interface GetLoyaltyLevel {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      rank: number;
      backgroundColor: string;
      dividerColor: string;
      logo: {
        url: string;
      };
      progressBarColor: string;
      iconBadge: {
        url: string;
      };
      profileHeaderWeb: {
        url: string;
      };
      profileHeaderMobile: {
        url: string;
      };
      profileTextColor: string;
      textColor: string;
      benefit: {
        category: string;
        active: boolean;
        iconUrl: string;
        rank: number;
        desc: string;
        value: number | null;
      }[];
      qualification: {
        totalSpend: number;
        totalReservations: number;
      };
      regain: {
        totalSpend: number;
        totalReservations: number;
      };
    };
  }[];
  success: boolean;
  message: null;
}

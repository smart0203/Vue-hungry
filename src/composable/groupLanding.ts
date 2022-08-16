import { axios } from "@/lib/fetcher";
import rollbar from "@/lib/rollbar";
import dayjs from "@/lib/dayjs";
import isEmpty from "lodash-es/isEmpty";
import isArray from "lodash-es/isArray";
import { useStorage } from "@vueuse/core";
import { ref } from "@vue/composition-api";
import { isAllowLocalStorage } from "@/helper/storagePermissionHelper";
import { AxiosResponse } from "axios";
import { GroupLandingPage } from "@/types/GroupLandingPage";
import type { GetGroupLandingPage } from "@/types/APIResponse";

const GROUP_LANDING = "hungryhub_group_landing";
const GROUP_LANDING_LAST_UPDATED = "hungryhub_group_landing_last_updated";
const isLoading = ref(false);
let groupLandingList = isAllowLocalStorage()
  ? useStorage(GROUP_LANDING, [])
  : ref<GroupLandingPage[]>([]);

let groupLandingLastUpdated = isAllowLocalStorage()
  ? useStorage(GROUP_LANDING_LAST_UPDATED, "")
  : ref("");

const shouldGetAllGroupLanding = () => {
  const today = dayjs();
  const lastUpdated = dayjs(groupLandingLastUpdated.value, "DD-MM-YYYY HH:ss");
  const isLastUpdatedValid = lastUpdated.isValid();
  const isLastUpdatedExpired = () => {
    if (!isLastUpdatedValid) {
      return true;
    }
    return today.isSameOrBefore(lastUpdated, "hour") === false ? true : false;
  };

  if (
    (groupLandingList.value && groupLandingList.value.length === 0) ||
    isLastUpdatedExpired() === true
  ) {
    return true;
  }
  return false;
};

async function getAllGroupLanding() {
  if (!isLoading.value && shouldGetAllGroupLanding()) {
    isLoading.value = true;
    const result = await getGroupLanding();
    if (result.isSuccess && Array.isArray(result.data)) {
      groupLandingList.value = result.data;
      groupLandingLastUpdated.value = dayjs().format("DD-MM-YYYY HH:ss");
    }
    isLoading.value = false;
  }
  return;
}

async function getGroupLanding(groupLandingId?: string | number) {
  const defaultErrorMessage =
    "Oops, something went wrong, failed get group landing data";
  try {
    const baseUrl = `/group_landing_pages`;
    let url = "";
    if (groupLandingId) {
      url = `${baseUrl}/${groupLandingId}.json`;
    } else {
      url = `${baseUrl}.json`;
    }
    const result: AxiosResponse<GetGroupLandingPage> = await axios({
      url: url,
    });
    if (result && !isEmpty(result.data) && result.data.success) {
      const { data } = result.data;
      if (Array.isArray(data)) {
        return {
          isSuccess: true,
          data: data.map((group) => {
            return {
              id: group.id,
              ...group.attributes,
            };
          }),
        };
      }
      return {
        isSuccess: true,
        data: {
          id: data.id,
          ...data.attributes,
        },
      };
    }
    if (result.data.message === "Data not found") {
      return {
        isSuccess: false,
        message: result.data.message,
        data: null,
      };
    }
    const error = {
      message: result.data.message || defaultErrorMessage,
      cause: result,
    };
    rollbar.error(error.message, { error });
    return {
      isSuccess: false,
      data: null,
      message: error.message,
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

function belongToGroupLanding(paramBranchId: string | number) {
  if (
    groupLandingList.value &&
    isArray(groupLandingList.value) &&
    paramBranchId
  ) {
    const checkIsBelong = groupLandingList.value.filter((group) => {
      return group.branchId == paramBranchId;
    });
    return checkIsBelong;
  }
  return false;
}

export {
  belongToGroupLanding,
  getGroupLanding,
  getAllGroupLanding,
  groupLandingList,
  isLoading,
};

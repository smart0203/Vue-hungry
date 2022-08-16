import { isDesktop } from "@/helper/screenSizeHelper";
import rollbar from "@/lib/rollbar";
import chunk from "lodash-es/chunk";

export function generateFilterItemChunk(item: string[]) {
  let DESKTOP_MAX_CHUNK_GROUP = 4;
  let DESKTOP_RECOMMENDED_LENGTH_EACH_CHUNK = 5;
  let MOBILE_MAX_CHUNK_GROUP = 2;
  let MOBILE_RECOMMENDED_LENGTH_EACH_CHUNK = 100;
  let lengthEachChunk = 0;

  function setMaxChunkGroup(desktopSize: number, mobileSize: number) {
    DESKTOP_MAX_CHUNK_GROUP = desktopSize;
    MOBILE_MAX_CHUNK_GROUP = mobileSize;
  }

  function setRecommendedLengthChunk(desktopSize: number, mobileSize: number) {
    DESKTOP_RECOMMENDED_LENGTH_EACH_CHUNK = desktopSize;
    MOBILE_RECOMMENDED_LENGTH_EACH_CHUNK = mobileSize;
  }

  function getMaxChunkGroup() {
    return isDesktop ? DESKTOP_MAX_CHUNK_GROUP : MOBILE_MAX_CHUNK_GROUP;
  }

  function getRecommendedLengthChunk() {
    return isDesktop
      ? DESKTOP_RECOMMENDED_LENGTH_EACH_CHUNK
      : MOBILE_RECOMMENDED_LENGTH_EACH_CHUNK;
  }

  function getItemInChunkSize() {
    try {
      const recommended = getRecommendedLengthChunk();
      const maxChunk = getMaxChunkGroup();
      const math = Math.ceil(item.length / recommended);
      if (!isDesktop) {
        return Math.ceil(item.length / MOBILE_MAX_CHUNK_GROUP);
      }
      if (item.length <= recommended || math <= maxChunk) {
        lengthEachChunk = recommended;
      } else {
        lengthEachChunk = Math.ceil(item.length / maxChunk);
      }
      return lengthEachChunk;
    } catch (err: any) {
      rollbar.error("failed get item in chunk", err);
      return 0;
    }
  }

  function getChunkResult() {
    return chunk(item, getItemInChunkSize());
  }

  return {
    getItemInChunkSize,
    getChunkResult,
    getRecommendedLengthChunk,
    getMaxChunkGroup,
    setMaxChunkGroup,
    setRecommendedLengthChunk,
  };
}

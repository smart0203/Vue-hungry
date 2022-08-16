const baseUrl = "https://imgproxy.hungryhub.com/insecure";
import {
  isRetina as isRetinaScreen,
  isHD as isHDScreen,
  isMobile,
  isTablet,
} from "@/helper/screenSizeHelper";

type specialScreenSize = "full-screen" | "half-screen";

function imageMutator({
  image,
  desktopWidth = 0,
  desktopHeight = 0,
  mobileWidth = 0,
  mobileHeight = 0,
  isRetina = false,
  isWebp = true,
  isEnlarge = false,
  resizingType = "fill",
}: {
  image: string;
  desktopWidth?: number | specialScreenSize;
  desktopHeight?: number;
  mobileWidth?: number | specialScreenSize;
  mobileHeight?: number;
  isRetina?: boolean;
  isWebp?: boolean;
  isEnlarge?: boolean;
  resizingType?: string;
}) {
  // parsed constant
  const isUsingWebp = () => {
    return isWebp && window.isSupportWebp ? true : false;
  };

  const isUsingRetina = () => {
    return isRetinaScreen() && isRetina ? true : false;
  };

  function sizeMultiplier(size: number) {
    if (isUsingRetina()) {
      return Math.round(size * 2);
    } else if (isHDScreen()) {
      const enlarge = Math.round(window.devicePixelRatio * 10) / 10 + 0.4;
      return Math.round(size * enlarge);
    }
    return Math.round(size);
  }

  // do width and heigth calculation for desktop and mobile
  const parsedMobileWidth = () => {
    let size = 0;
    if (mobileWidth === "full-screen") {
      size = window.innerWidth;
    } else if (mobileWidth === "half-screen") {
      size = window.screen.width / 2;
    } else {
      size = mobileWidth;
    }
    return sizeMultiplier(size);
  };

  const parsedMobileHeight = () => {
    const size = mobileHeight;
    return sizeMultiplier(size);
  };

  const parsedDesktopWidth = () => {
    let size = 0;
    if (desktopWidth === "full-screen") {
      size = window.screen.width;
    } else if (desktopWidth === "half-screen") {
      size = Math.round(window.screen.width / 2);
    } else {
      size = desktopWidth;
    }
    return sizeMultiplier(size);
  };

  const parsedDesktopHeight = () => {
    const size = desktopHeight;
    return sizeMultiplier(size);
  };

  return mutatorService(
    resizingType,
    isMobile || isTablet ? parsedMobileWidth() : parsedDesktopWidth(),
    isMobile || isTablet ? parsedMobileHeight() : parsedDesktopHeight(),
    "ce",
    isEnlarge ? 1 : 0,
    image,
    isUsingWebp() ? "webp" : "jpg"
  );
}

function mutatorService(
  resizingType = "fill",
  width: number | string,
  height: number | string,
  gravity = "ce",
  enlarge = 0,
  url: string,
  format: string
) {
  try {
    const encodedUrl = btoa(url);
    const parsedUrl = `${baseUrl}/${resizingType}/${width}/${height}/${gravity}/${enlarge}/${encodedUrl}`;
    if (format) {
      return `${parsedUrl}.${format}`;
    }
    return parsedUrl;
  } catch (err) {
    // if encode process failed, use plain url (usually file name contain Thai charcter)
    const parsedUrl = `${baseUrl}/${resizingType}/${width}/${height}/${gravity}/${enlarge}/plain/${url}`;
    if (format) {
      return `${parsedUrl}@${format}`;
    }
    return parsedUrl;
  }
}

export default imageMutator;

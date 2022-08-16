function isRetina() {
  if (window.devicePixelRatio >= 2) return true;
  return false;
}

function isHD() {
  if (window.devicePixelRatio > 1) return true;
  const mediaQuery =
    "(-webkit-min-device-pixel-ratio: 1.1),\
            (min--moz-device-pixel-ratio: 1.1),\
            (-o-min-device-pixel-ratio: 10/9),\
    ";
  if (window.matchMedia && window.matchMedia(mediaQuery).matches) return true;
  return false;
}

function getCurrentScreenSize() {
  if (window.matchMedia("(max-width: 767px)").matches) {
    return {
      isDesktop: false,
      isTablet: false,
      isMobile: true,
      screen: "phone",
    };
  } else if (window.matchMedia("(max-width: 991px)").matches) {
    return {
      isDesktop: false,
      isTablet: true,
      isMobile: true,
      screen: "tablet",
    };
  } else if (window.matchMedia("(max-width: 1199px)").matches) {
    return {
      isDesktop: true,
      isTablet: false,
      isMobile: false,
      screen: "desktop",
    };
  }
  return {
    isDesktop: true,
    isTablet: false,
    isMobile: false,
    screen: "large-desktop",
  };
}

const { screen, isDesktop, isTablet, isMobile } = getCurrentScreenSize();

export {
  screen,
  isDesktop,
  isMobile,
  isTablet,
  isRetina,
  isHD,
  getCurrentScreenSize,
};

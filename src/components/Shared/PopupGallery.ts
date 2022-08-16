import useReport from "@/composable/useReport";
import imageMutator from "@/services/imageMutator";
import { historyPushState, historyRemoveState } from "@/helper/urlHelper";
import "lightgallery/css/lightgallery-bundle.min.css";

async function loadLightGallery() {
  try {
    const ligthGalleryCore = await import("lightgallery");
    // @ts-ignore
    await import("lightgallery/css/lightgallery-bundle.min.css");
    if (ligthGalleryCore) {
      const thumbnailPlugin = await import("lightgallery/plugins/thumbnail");
      const zoomPlugin = await import("lightgallery/plugins/zoom");
      const sharePlugin = await import("lightgallery/plugins/share");
      if (
        thumbnailPlugin?.default &&
        zoomPlugin?.default &&
        sharePlugin?.default
      ) {
        return {
          core: ligthGalleryCore.default,
          thumbnailPlugin: thumbnailPlugin.default,
          zoomPlugin: zoomPlugin.default,
          sharePlugin: sharePlugin.default,
        };
      }
      return false;
    }
  } catch (err) {
    useReport({
      level: "error",
      message: "Failed get ligth gallery plugin",
      errorException: err,
    });
    return false;
  }
}

function usePopupGallery() {
  const HISTORY_STATE = "isGalleryOpen";
  let ligthGalleryInstance: any = undefined;

  async function setupPopupGallery(
    element: string,
    items: { asset: string; isYoutubeVideo?: boolean }[]
  ) {
    try {
      const result = await loadLightGallery();
      const el = document.querySelector(`${element}`) as HTMLElement;
      if (!result) {
        useReport({
          level: "error",
          message: "failed download image gallery script",
          object: {
            result,
          },
        });
        return;
      }
      const {
        core: ligthGalleryCore,
        thumbnailPlugin,
        zoomPlugin,
        sharePlugin,
      } = result;
      if (!el) {
        useReport({
          level: "error",
          message: "Invalid image gallery element",
          object: {
            el,
          },
        });
        return;
      }
      const parsedAssets = items.map((item) => {
        if (item.isYoutubeVideo) {
          return {
            src: item.asset,
            iframe: true,
          };
        }
        const usedImage = item.asset || "";
        const original = imageMutator({
          image: usedImage,
          mobileWidth: "full-screen",
          mobileHeight: 0,
          desktopWidth: 0,
          desktopHeight: 0,
          isRetina: true,
          isWebp: true,
          isEnlarge: false,
          resizingType: "fill",
        });
        return {
          src: original,
          // downloadUrl: usedImage,
          thumb: imageMutator({
            image: usedImage,
            mobileWidth: 200,
            mobileHeight: 200,
            desktopWidth: 200,
            desktopHeight: 200,
            isRetina: true,
            isWebp: true,
            isEnlarge: false,
            resizingType: "fill",
          }),
        };
      });
      el.addEventListener("lgBeforeClose", () => {
        historyRemoveState(HISTORY_STATE);
        window.onpopstate = null;
      });
      el.addEventListener("lgAfterOpen", function () {
        historyPushState(HISTORY_STATE, true);
        window.onpopstate = () => {
          ligthGalleryInstance.closeGallery();
        };
      });
      ligthGalleryInstance = ligthGalleryCore(el, {
        dynamic: true,
        dynamicEl: parsedAssets,
        plugins: [thumbnailPlugin, sharePlugin, zoomPlugin],
        mobileSettings: {
          showCloseIcon: true,
        },
      });
    } catch (err) {
      useReport({
        level: "error",
        message: "Failed setup image gallery",
        errorException: err,
      });
    }
  }

  async function showPopupGallery(
    element: string,
    items: { asset: string; isYoutubeVideo?: boolean }[],
    initialShowedImageIndex = 0
  ) {
    const initialShowedIndex =
      typeof initialShowedImageIndex === "number" ? initialShowedImageIndex : 0;
    if (ligthGalleryInstance) {
      ligthGalleryInstance.openGallery(initialShowedIndex);
      return;
    }
    await setupPopupGallery(element, items);
    if (ligthGalleryInstance) {
      ligthGalleryInstance.openGallery(initialShowedIndex);
    }
  }

  return {
    instance: ligthGalleryInstance,
    showGallery: showPopupGallery,
  };
}

export default usePopupGallery;

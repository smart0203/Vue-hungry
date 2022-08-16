import { saveToUserStorage, getFromUserStorage } from "./userStorage";

type componentImportFunction = () => Promise<string>;

// Inspired from https://raphael-leger.medium.com/react-webpack-chunkloaderror-loading-chunk-x-failed-ac385bd110e0

export default async function lazyImport(
  componentImport: componentImportFunction
) {
  const pageHasAlreadyBeenForceRefreshed = JSON.parse(
    getFromUserStorage("page-has-been-force-refreshed") || "false"
  );

  try {
    const component = await componentImport();

    saveToUserStorage("page-has-been-force-refreshed", "false");

    return component;
  } catch (error) {
    if (!pageHasAlreadyBeenForceRefreshed) {
      // Assuming that the user is not on the latest version of the application.
      // Let's refresh the page immediately.
      saveToUserStorage("page-has-been-force-refreshed", "true");
      return window.location.reload();
    }

    // The page has already been reloaded
    // Assuming that user is already using the latest version of the application.
    // Let's let the application crash and raise the error.
    // throw error;
  }
}

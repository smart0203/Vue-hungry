import { ref } from "@vue/composition-api";
async function importComponent(componentPath = "", config = {}) {
  let component = ref("");
  let isLoading = ref(true);
  let isSuccess = ref(false);
  let errorMessage = ref("");
  let enableVariant = false;
  let isDesktop = false;
  let importResult = "";
  let componentName = "";
  try {
    if (config) {
      enableVariant = config.enableVariant;
      isDesktop = config.isDesktop;
    }
    if ((componentPath && componentPath.length === 0) || !componentPath) {
      errorMessage.value = `Failed load component, please provide path to component ${componentPath}`;
      isSuccess.value = false;
      return { component, isLoading, isSuccess, errorMessage };
    }
    const splitPath = componentPath.split("/");
    if (!splitPath || (splitPath && !splitPath.length)) {
      errorMessage.value = `Failed load component, Invalid path to component ${componentPath}`;
      isSuccess.value = false;
      return { component, isLoading, isSuccess, errorMessage };
    }
    const lastPath = splitPath[splitPath.length - 1];
    const isFolder = lastPath.includes(".vue") ? false : true;
    // load component by its desktop and mobile variant
    // MyComponent (folder name)
    // -MyComponentDesktop.vue (desktop component name)
    // -MyComponentMobile.vue (mobile component name)
    if (enableVariant && isFolder) {
      // guess component name by using regex to replace non alphanumeric from latest folder path
      const name = lastPath.replace(/\W/g, "");
      componentName = isDesktop ? `${name}Desktop` : `${name}Mobile`;
      importResult = await import(
        `@/components/${componentPath}/${componentName}.vue`
      );
    }
    // load component directly
    else {
      // remove component from its path
      splitPath.pop();
      componentName = lastPath.replace(".vue", "");
      importResult = await import(
        `@/components/${splitPath.join("/")}/${componentName}.vue`
      );
    }

    if (!importResult || !importResult.default) {
      errorMessage.value = "Failed load component, component not found";
      isSuccess.value = false;
      return { component, isLoading, isSuccess, errorMessage };
    }
    isLoading.value = false;
    isSuccess.value = true;
    component.value = importResult.default;
    return { component, isLoading, isSuccess, errorMessage };
  } catch (err) {
    isLoading.value = false;
    errorMessage.value = `Failed load component, ${err}`;
    return { component, isLoading, isSuccess, errorMessage };
  }
}

export { importComponent };

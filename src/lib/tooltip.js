import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

function tooltip(element, message, theme = "yellow", tippyConfig) {
  const content = message;
  return tippy(element, {
    zIndex: "40",
    theme: theme,
    content: content,
    allowHTML: true,
    placement: "bottom-start",
    arrow: true,
    interactive: true,
    ignoreAttributes: true,
    ...tippyConfig,
  });
}

export default {
  tooltip,
};

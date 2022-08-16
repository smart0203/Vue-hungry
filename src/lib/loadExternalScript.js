const loadScript = function load(
  scriptUrl,
  id,
  isAsync = false,
  isDefer = false
) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  if (id) {
    script.id = id;
  }
  script.async = isAsync;
  script.defer = isDefer;
  script.src = scriptUrl;
  document.body.appendChild(script);
  return new Promise((resolve, reject) => {
    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject();
    };
  });
};

export default loadScript;

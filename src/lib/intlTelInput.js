const getIntTelInput = async () => {
  try {
    await import("intl-tel-input/build/css/intlTelInput.min.css");
    const moduleRequest = await import("intl-tel-input/build/js/intlTelInput");
    return moduleRequest.default;
  } catch (err) {
    throw new Error(err);
  }
};
export default getIntTelInput;

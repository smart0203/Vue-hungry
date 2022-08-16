function isSupportWebp() {
  const { Modernizr, isSupportWebp } = window;
  if (isSupportWebp == undefined) {
    Modernizr.on("webp", function (result) {
      window.isSupportWebp = result;
    });
  }
}

export default isSupportWebp;

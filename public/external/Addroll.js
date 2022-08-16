!(function (f, b, e, v, n, t, s) {
  f.fbq ||
    ((n = f.fbq =
      function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      }),
    f._fbq || (f._fbq = n),
    (n.push = n),
    (n.loaded = !0),
    (n.version = "2.0"),
    (n.queue = []),
    ((t = b.createElement(e)).async = !0),
    (t.src = v),
    (s = b.getElementsByTagName(e)[0]).parentNode.insertBefore(t, s));
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js"
),
  (adroll_adv_id = "PIUBKOGYZVCYHOWAXOTQIQ"),
  (adroll_pix_id = "NFFJLK2QLVERZHCAZBFMEF");
var scr = document.createElement("script"),
  host = "https://s.adroll.com";
scr.setAttribute("async", "true"),
  (scr.type = "text/javascript"),
  (scr.src = host + "/j/roundtrip.js"),
  (
    (document.getElementsByTagName("head") || [null])[0] ||
    document.getElementsByTagName("script")[0].parentNode
  ).appendChild(scr);

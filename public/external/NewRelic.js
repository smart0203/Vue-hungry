window.NREUM || (NREUM = {}),
  (NREUM.init = { privacy: { cookies_enabled: !0 } }),
  window.NREUM || (NREUM = {}),
  (__nr_require = (function (e, n, t) {
    function r(t) {
      if (!n[t]) {
        var i = (n[t] = { exports: {} });
        e[t][0].call(
          i.exports,
          function (n) {
            var i;
            return r(e[t][1][n] || n);
          },
          i,
          i.exports
        );
      }
      return n[t].exports;
    }
    if ("function" == typeof __nr_require) return __nr_require;
    for (var i = 0; i < t.length; i++) r(t[i]);
    return r;
  })(
    {
      1: [
        function (e, n, t) {
          function r() {}
          function i(e, n, t) {
            return function () {
              return (
                o(e, [u.now()].concat(c(arguments)), n ? null : this, t),
                n ? void 0 : this
              );
            };
          }
          var o = e("handle"),
            a = e(5),
            c = e(6),
            f = e("ee").get("tracer"),
            u = e("loader"),
            s = NREUM;
          void 0 === window.newrelic && (newrelic = s);
          var d,
            p = "api-",
            l = p + "ixn-";
          a(
            [
              "setPageViewName",
              "setCustomAttribute",
              "setErrorHandler",
              "finished",
              "addToTrace",
              "inlineHit",
              "addRelease",
            ],
            function (e, n) {
              s[n] = i(p + n, !0, "api");
            }
          ),
            (s.addPageAction = i(p + "addPageAction", !0)),
            (s.setCurrentRouteName = i(p + "routeName", !0)),
            (n.exports = newrelic),
            (s.interaction = function () {
              return new r().get();
            });
          var m = (r.prototype = {
            createTracer: function (e, n) {
              var t = {},
                r = this,
                i = "function" == typeof n;
              return (
                o(l + "tracer", [u.now(), e, t], r),
                function () {
                  if (
                    (f.emit((i ? "" : "no-") + "fn-start", [u.now(), r, i], t),
                    i)
                  )
                    try {
                      return n.apply(this, arguments);
                    } catch (e) {
                      throw (f.emit("fn-err", [arguments, this, e], t), e);
                    } finally {
                      f.emit("fn-end", [u.now()], t);
                    }
                }
              );
            },
          });
          a(
            "actionText,setName,setAttribute,save,ignore,onEnd,getContext,end,get".split(
              ","
            ),
            function (e, n) {
              m[n] = i(l + n);
            }
          ),
            (newrelic.noticeError = function (e, n) {
              "string" == typeof e && (e = new Error(e)),
                o("err", [e, u.now(), !1, n]);
            });
        },
        {},
      ],
      2: [
        function (e, n, t) {
          function r(e, n) {
            var t;
            e.getEntries().forEach(function (e) {
              "first-paint" === e.name
                ? d("timing", ["fp", Math.floor(e.startTime)])
                : "first-contentful-paint" === e.name &&
                  d("timing", ["fcp", Math.floor(e.startTime)]);
            });
          }
          function i(e, n) {
            var t = e.getEntries();
            t.length > 0 && d("lcp", [t[t.length - 1]]);
          }
          function o(e) {
            e.getEntries().forEach(function (e) {
              e.hadRecentInput || d("cls", [e]);
            });
          }
          function a(e) {
            if (e instanceof m && !g) {
              var n = Math.round(e.timeStamp),
                t = { type: e.type };
              n <= p.now()
                ? (t.fid = p.now() - n)
                : n > p.offset && n <= Date.now()
                ? ((n -= p.offset), (t.fid = p.now() - n))
                : (n = p.now()),
                (g = !0),
                d("timing", ["fi", n, t]);
            }
          }
          function c(e) {
            d("pageHide", [p.now(), e]);
          }
          if (
            !(
              "init" in NREUM &&
              "page_view_timing" in NREUM.init &&
              "enabled" in NREUM.init.page_view_timing &&
              !1 === NREUM.init.page_view_timing.enabled
            )
          ) {
            var f,
              u,
              s,
              d = e("handle"),
              p = e("loader"),
              l = e(4),
              m = NREUM.o.EV;
            if (
              "PerformanceObserver" in window &&
              "function" == typeof window.PerformanceObserver
            ) {
              f = new PerformanceObserver(r);
              try {
                f.observe({ entryTypes: ["paint"] });
              } catch (v) {}
              u = new PerformanceObserver(i);
              try {
                u.observe({ entryTypes: ["largest-contentful-paint"] });
              } catch (v) {}
              s = new PerformanceObserver(o);
              try {
                s.observe({ type: "layout-shift", buffered: !0 });
              } catch (v) {}
            }
            if ("addEventListener" in document) {
              var g = !1,
                y;
              [
                "click",
                "keydown",
                "mousedown",
                "pointerdown",
                "touchstart",
              ].forEach(function (e) {
                document.addEventListener(e, a, !1);
              });
            }
            l(c);
          }
        },
        {},
      ],
      3: [
        function (e, n, t) {
          function r(e, n) {
            if (!i) return !1;
            if (e !== i) return !1;
            if (!n) return !0;
            if (!o) return !1;
            for (
              var t = o.split("."), r = n.split("."), a = 0;
              a < r.length;
              a++
            )
              if (r[a] !== t[a]) return !1;
            return !0;
          }
          var i = null,
            o = null,
            a = /Version\/(\S+)\s+Safari/;
          if (navigator.userAgent) {
            var c = navigator.userAgent,
              f = c.match(a);
            f &&
              -1 === c.indexOf("Chrome") &&
              -1 === c.indexOf("Chromium") &&
              ((i = "Safari"), (o = f[1]));
          }
          n.exports = { agent: i, version: o, match: r };
        },
        {},
      ],
      4: [
        function (e, n, t) {
          function r(e) {
            function n() {
              e(
                a && document[a]
                  ? document[a]
                  : document[i]
                  ? "hidden"
                  : "visible"
              );
            }
            "addEventListener" in document &&
              o &&
              document.addEventListener(o, n, !1);
          }
          var i, o, a;
          (n.exports = r),
            void 0 !== document.hidden
              ? ((i = "hidden"),
                (o = "visibilitychange"),
                (a = "visibilityState"))
              : void 0 !== document.msHidden
              ? ((i = "msHidden"), (o = "msvisibilitychange"))
              : void 0 !== document.webkitHidden &&
                ((i = "webkitHidden"),
                (o = "webkitvisibilitychange"),
                (a = "webkitVisibilityState"));
        },
        {},
      ],
      5: [
        function (e, n, t) {
          function r(e, n) {
            var t = [],
              r = "",
              o = 0;
            for (r in e) i.call(e, r) && ((t[o] = n(r, e[r])), (o += 1));
            return t;
          }
          var i = Object.prototype.hasOwnProperty;
          n.exports = r;
        },
        {},
      ],
      6: [
        function (e, n, t) {
          function r(e, n, t) {
            n || (n = 0), void 0 === t && (t = e ? e.length : 0);
            for (
              var r = -1, i = t - n || 0, o = Array(i < 0 ? 0 : i);
              ++r < i;

            )
              o[r] = e[n + r];
            return o;
          }
          n.exports = r;
        },
        {},
      ],
      7: [
        function (e, n, t) {
          n.exports = {
            exists:
              void 0 !== window.performance &&
              window.performance.timing &&
              void 0 !== window.performance.timing.navigationStart,
          };
        },
        {},
      ],
      ee: [
        function (e, n, t) {
          function r() {}
          function i(e) {
            function n(e) {
              return e && e instanceof r ? e : e ? f(e, c, o) : o();
            }
            function t(t, r, i, o) {
              if (!p.aborted || o) {
                e && e(t, r, i);
                for (var a = n(i), c = v(t), f = c.length, u = 0; u < f; u++)
                  c[u].apply(a, r);
                var d = s[w[t]];
                return d && d.push([b, t, r, a]), a;
              }
            }
            function l(e, n) {
              h[e] = v(e).concat(n);
            }
            function m(e, n) {
              var t = h[e];
              if (t)
                for (var r = 0; r < t.length; r++) t[r] === n && t.splice(r, 1);
            }
            function v(e) {
              return h[e] || [];
            }
            function g(e) {
              return (d[e] = d[e] || i(t));
            }
            function y(e, n) {
              u(e, function (e, t) {
                (n = n || "feature"), (w[t] = n), n in s || (s[n] = []);
              });
            }
            var h = {},
              w = {},
              b = {
                on: l,
                addEventListener: l,
                removeEventListener: m,
                emit: t,
                get: g,
                listeners: v,
                context: n,
                buffer: y,
                abort: a,
                aborted: !1,
              };
            return b;
          }
          function o() {
            return new r();
          }
          function a() {
            (s.api || s.feature) && ((p.aborted = !0), (s = p.backlog = {}));
          }
          var c = "nr@context",
            f = e("gos"),
            u = e(5),
            s = {},
            d = {},
            p = (n.exports = i());
          p.backlog = s;
        },
        {},
      ],
      gos: [
        function (e, n, t) {
          function r(e, n, t) {
            if (i.call(e, n)) return e[n];
            var r = t();
            if (Object.defineProperty && Object.keys)
              try {
                return (
                  Object.defineProperty(e, n, {
                    value: r,
                    writable: !0,
                    enumerable: !1,
                  }),
                  r
                );
              } catch (o) {}
            return (e[n] = r), r;
          }
          var i = Object.prototype.hasOwnProperty;
          n.exports = r;
        },
        {},
      ],
      handle: [
        function (e, n, t) {
          function r(e, n, t, r) {
            i.buffer([e], r), i.emit(e, n, t);
          }
          var i = e("ee").get("handle");
          (n.exports = r), (r.ee = i);
        },
        {},
      ],
      id: [
        function (e, n, t) {
          function r(e) {
            var n = typeof e;
            return !e || ("object" !== n && "function" !== n)
              ? -1
              : e === window
              ? 0
              : a(e, o, function () {
                  return i++;
                });
          }
          var i = 1,
            o = "nr@id",
            a = e("gos");
          n.exports = r;
        },
        {},
      ],
      loader: [
        function (e, n, t) {
          function r() {
            if (!x++) {
              var e = (E.info = NREUM.info),
                n = l.getElementsByTagName("script")[0];
              if (
                (setTimeout(s.abort, 3e4),
                !(e && e.licenseKey && e.applicationID && n))
              )
                return s.abort();
              u(w, function (n, t) {
                e[n] || (e[n] = t);
              });
              var t = a();
              f("mark", ["onload", t + E.offset], null, "api"),
                f("timing", ["load", t]);
              var r = l.createElement("script");
              (r.src = "https://" + e.agent), n.parentNode.insertBefore(r, n);
            }
          }
          function i() {
            "complete" === l.readyState && o();
          }
          function o() {
            f("mark", ["domContent", a() + E.offset], null, "api");
          }
          function a() {
            return O.exists && performance.now
              ? Math.round(performance.now())
              : (c = Math.max(new Date().getTime(), c)) - E.offset;
          }
          var c = new Date().getTime(),
            f = e("handle"),
            u = e(5),
            s = e("ee"),
            d = e(3),
            p = window,
            l = p.document,
            m = "addEventListener",
            v = "attachEvent",
            g = p.XMLHttpRequest,
            y = g && g.prototype;
          NREUM.o = {
            ST: setTimeout,
            SI: p.setImmediate,
            CT: clearTimeout,
            XHR: g,
            REQ: p.Request,
            EV: p.Event,
            PR: p.Promise,
            MO: p.MutationObserver,
          };
          var h = "" + location,
            w = {
              beacon: "bam.nr-data.net",
              errorBeacon: "bam.nr-data.net",
              agent: "js-agent.newrelic.com/nr-1177.min.js",
            },
            b = g && y && y[m] && !/CriOS/.test(navigator.userAgent),
            E = (n.exports = {
              offset: c,
              now: a,
              origin: h,
              features: {},
              xhrWrappable: b,
              userAgent: d,
            });
          e(1),
            e(2),
            l[m]
              ? (l[m]("DOMContentLoaded", o, !1), p[m]("load", r, !1))
              : (l[v]("onreadystatechange", i), p[v]("onload", r)),
            f("mark", ["firstbyte", c], null, "api");
          var x = 0,
            O = e(7);
        },
        {},
      ],
      "wrap-function": [
        function (e, n, t) {
          function r(e) {
            return !(e && e instanceof Function && e.apply && !e[a]);
          }
          var i = e("ee"),
            o = e(6),
            a = "nr@original",
            c = Object.prototype.hasOwnProperty,
            f = !1;
          n.exports = function (e, n) {
            function t(e, n, t, i) {
              function nrWrapper() {
                var r, a, c, f;
                try {
                  (a = this),
                    (r = o(arguments)),
                    (c = "function" == typeof t ? t(r, a) : t || {});
                } catch (u) {
                  p([u, "", [r, a, i], c]);
                }
                s(n + "start", [r, a, i], c);
                try {
                  return (f = e.apply(a, r));
                } catch (d) {
                  throw (s(n + "err", [r, a, d], c), d);
                } finally {
                  s(n + "end", [r, a, f], c);
                }
              }
              return r(e)
                ? e
                : (n || (n = ""),
                  (nrWrapper[a] = e),
                  d(e, nrWrapper),
                  nrWrapper);
            }
            function u(e, n, i, o) {
              i || (i = "");
              var a,
                c,
                f,
                u = "-" === i.charAt(0);
              for (f = 0; f < n.length; f++)
                r((a = e[(c = n[f])])) || (e[c] = t(a, u ? c + i : i, o, c));
            }
            function s(t, r, i) {
              if (!f || n) {
                var o = f;
                f = !0;
                try {
                  e.emit(t, r, i, n);
                } catch (a) {
                  p([a, t, r, i]);
                }
                f = o;
              }
            }
            function d(e, n) {
              if (Object.defineProperty && Object.keys)
                try {
                  var t;
                  return (
                    Object.keys(e).forEach(function (t) {
                      Object.defineProperty(n, t, {
                        get: function () {
                          return e[t];
                        },
                        set: function (n) {
                          return (e[t] = n), n;
                        },
                      });
                    }),
                    n
                  );
                } catch (r) {
                  p([r]);
                }
              for (var i in e) c.call(e, i) && (n[i] = e[i]);
              return n;
            }
            function p(n) {
              try {
                e.emit("internal-error", n);
              } catch (t) {}
            }
            return e || (e = i), (t.inPlace = u), (t.flag = a), t;
          };
        },
        {},
      ],
    },
    {},
    ["loader"]
  )),
  (NREUM.loader_config = {
    accountID: "1691363",
    trustKey: "1691363",
    agentID: "77395634",
    licenseKey: "38717a3ae6",
    applicationID: "77395616",
  }),
  (NREUM.info = {
    beacon: "bam.nr-data.net",
    errorBeacon: "bam.nr-data.net",
    licenseKey: "38717a3ae6",
    applicationID: "77395616",
    sa: 1,
  });

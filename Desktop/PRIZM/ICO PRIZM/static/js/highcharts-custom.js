"use strict";
! function(t, e) {
    "object" == typeof module && module.exports ? module.exports = t.document ? e(t) : e : t.Highcharts = e(t)
}("undefined" != typeof window ? window : this, function(t) {
    var e = function() {
        var t = window,
            e = t.document,
            i = "http://www.w3.org/2000/svg",
            o = t.navigator && t.navigator.userAgent || "",
            n = e && e.createElementNS && !!e.createElementNS(i, "svg").createSVGRect,
            r = /(edge|msie|trident)/i.test(o) && !window.opera,
            a = !n,
            s = /Firefox/.test(o),
            l = s && parseInt(o.split("Firefox/")[1], 10) < 4;
        return t.Highcharts ? t.Highcharts.error(16, !0) : {
            product: "Highcharts",
            version: "5.0.12 custom build",
            deg2rad: 2 * Math.PI / 360,
            doc: e,
            hasBidiBug: l,
            hasTouch: e && void 0 !== e.documentElement.ontouchstart,
            isMS: r,
            isWebKit: /AppleWebKit/.test(o),
            isFirefox: s,
            isTouchDevice: /(Mobile|Android|Windows Phone)/.test(o),
            SVG_NS: i,
            chartCount: 0,
            seriesTypes: {},
            symbolSizes: {},
            svg: n,
            vml: a,
            win: t,
            marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
            noop: function() {},
            charts: []
        }
    }();
    return function(t) {
            var e = [],
                i = t.charts,
                o = t.doc,
                n = t.win;
            t.error = function(e, i) {
                var o = t.isNumber(e) ? "Highcharts error #" + e + ": www.highcharts.com/errors/" + e : e;
                if (i) throw new Error(o);
                n.console && console.log(o)
            }, t.Fx = function(t, e, i) {
                this.options = e, this.elem = t, this.prop = i
            }, t.Fx.prototype = {
                dSetter: function() {
                    var t, e = this.paths[0],
                        i = this.paths[1],
                        o = [],
                        n = this.now,
                        r = e.length;
                    if (1 === n) o = this.toD;
                    else if (r === i.length && n < 1)
                        for (; r--;) t = parseFloat(e[r]), o[r] = isNaN(t) ? e[r] : n * parseFloat(i[r] - t) + t;
                    else o = i;
                    this.elem.attr("d", o, null, !0)
                },
                update: function() {
                    var t = this.elem,
                        e = this.prop,
                        i = this.now,
                        o = this.options.step;
                    this[e + "Setter"] ? this[e + "Setter"]() : t.attr ? t.element && t.attr(e, i, null, !0) : t.style[e] = i + this.unit, o && o.call(t, i, this)
                },
                run: function(t, i, o) {
                    var n, r = this,
                        a = function(t) {
                            return !a.stopped && r.step(t)
                        };
                    this.startTime = +new Date, this.start = t, this.end = i, this.unit = o, this.now = this.start, this.pos = 0, a.elem = this.elem, a.prop = this.prop, a() && 1 === e.push(a) && (a.timerId = setInterval(function() {
                        for (n = 0; n < e.length; n++) e[n]() || e.splice(n--, 1);
                        e.length || clearInterval(a.timerId)
                    }, 13))
                },
                step: function(e) {
                    var i, o, n = +new Date,
                        r = this.options,
                        a = this.elem,
                        s = r.complete,
                        l = r.duration,
                        h = r.curAnim;
                    return a.attr && !a.element ? i = !1 : e || n >= l + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), h[this.prop] = !0, o = !0, t.objectEach(h, function(t) {
                        !0 !== t && (o = !1)
                    }), o && s && s.call(a), i = !1) : (this.pos = r.easing((n - this.startTime) / l), this.now = this.start + (this.end - this.start) * this.pos, this.update(), i = !0), i
                },
                initPath: function(e, i, o) {
                    function n(t) {
                        var e, i;
                        for (d = t.length; d--;) e = "M" === t[d] || "L" === t[d], i = /[a-zA-Z]/.test(t[d + 3]), e && i && t.splice(d + 1, 0, t[d + 1], t[d + 2], t[d + 1], t[d + 2])
                    }

                    function r(t, e, i) {
                        [].splice.apply(t, [i, 0].concat(e))
                    }

                    function a(t, e) {
                        for (; t.length < h;) t[0] = e[h - t.length], r(t, t.slice(0, m), 0), y && (r(t, t.slice(t.length - m), t.length), d--);
                        t[0] = "M"
                    }

                    function s(t, e) {
                        for (var i = (h - t.length) / m; i > 0 && i--;)(c = t.slice().splice(t.length / b - m, m * b))[0] = e[h - m - i * m], f && (c[m - 6] = c[m - 2], c[m - 5] = c[m - 1]), r(t, c, t.length / b), y && i--
                    }
                    i = i || "";
                    var l, h, c, d, p, u = e.startX,
                        g = e.endX,
                        f = i.indexOf("C") > -1,
                        m = f ? 7 : 3,
                        x = i.split(" "),
                        v = o.slice(),
                        y = e.isArea,
                        b = y ? 2 : 1;
                    if (f && (n(x), n(v)), u && g) {
                        for (d = 0; d < u.length; d++) {
                            if (u[d] === g[0]) {
                                l = d;
                                break
                            }
                            if (u[0] === g[g.length - u.length + d]) {
                                l = d, p = !0;
                                break
                            }
                        }
                        void 0 === l && (x = [])
                    }
                    return x.length && t.isNumber(l) && (h = v.length + l * b * m, p ? (a(x, v), s(v, x)) : (a(v, x), s(x, v))), [x, v]
                }
            }, t.Fx.prototype.fillSetter = t.Fx.prototype.strokeSetter = function() {
                this.elem.attr(this.prop, t.color(this.start).tweenTo(t.color(this.end), this.pos), null, !0)
            }, t.extend = function(t, e) {
                var i;
                t || (t = {});
                for (i in e) t[i] = e[i];
                return t
            }, t.merge = function() {
                var e, i, o = arguments,
                    n = {},
                    r = function(e, i) {
                        return "object" != typeof e && (e = {}), t.objectEach(i, function(o, n) {
                            !t.isObject(o, !0) || t.isClass(o) || t.isDOMElement(o) ? e[n] = i[n] : e[n] = r(e[n] || {}, o)
                        }), e
                    };
                for (!0 === o[0] && (n = o[1], o = Array.prototype.slice.call(o, 2)), i = o.length, e = 0; e < i; e++) n = r(n, o[e]);
                return n
            }, t.pInt = function(t, e) {
                return parseInt(t, e || 10)
            }, t.isString = function(t) {
                return "string" == typeof t
            }, t.isArray = function(t) {
                var e = Object.prototype.toString.call(t);
                return "[object Array]" === e || "[object Array Iterator]" === e
            }, t.isObject = function(e, i) {
                return !(!e || "object" != typeof e || i && t.isArray(e))
            }, t.isDOMElement = function(e) {
                return t.isObject(e) && "number" == typeof e.nodeType
            }, t.isClass = function(e) {
                var i = e && e.constructor;
                return !(!t.isObject(e, !0) || t.isDOMElement(e) || !i || !i.name || "Object" === i.name)
            }, t.isNumber = function(t) {
                return "number" == typeof t && !isNaN(t)
            }, t.erase = function(t, e) {
                for (var i = t.length; i--;)
                    if (t[i] === e) {
                        t.splice(i, 1);
                        break
                    }
            }, t.defined = function(t) {
                return void 0 !== t && null !== t
            }, t.attr = function(e, i, o) {
                var n;
                return t.isString(i) ? t.defined(o) ? e.setAttribute(i, o) : e && e.getAttribute && (n = e.getAttribute(i)) : t.defined(i) && t.isObject(i) && t.objectEach(i, function(t, i) {
                    e.setAttribute(i, t)
                }), n
            }, t.splat = function(e) {
                return t.isArray(e) ? e : [e]
            }, t.syncTimeout = function(t, e, i) {
                if (e) return setTimeout(t, e, i);
                t.call(0, i)
            }, t.pick = function() {
                var t, e, i = arguments,
                    o = i.length;
                for (t = 0; t < o; t++)
                    if (void 0 !== (e = i[t]) && null !== e) return e
            }, t.css = function(e, i) {
                t.isMS && !t.svg && i && void 0 !== i.opacity && (i.filter = "alpha(opacity=" + 100 * i.opacity + ")"), t.extend(e.style, i)
            }, t.createElement = function(e, i, n, r, a) {
                var s = o.createElement(e),
                    l = t.css;
                return i && t.extend(s, i), a && l(s, {
                    padding: 0,
                    border: "none",
                    margin: 0
                }), n && l(s, n), r && r.appendChild(s), s
            }, t.extendClass = function(e, i) {
                var o = function() {};
                return o.prototype = new e, t.extend(o.prototype, i), o
            }, t.pad = function(t, e, i) {
                return new Array((e || 2) + 1 - String(t).length).join(i || 0) + t
            }, t.relativeLength = function(t, e) {
                return /%$/.test(t) ? e * parseFloat(t) / 100 : parseFloat(t)
            }, t.wrap = function(t, e, i) {
                var o = t[e];
                t[e] = function() {
                    var t, e = Array.prototype.slice.call(arguments),
                        n = arguments,
                        r = this;
                    return r.proceed = function() {
                        o.apply(r, arguments.length ? arguments : n)
                    }, e.unshift(o), t = i.apply(this, e), r.proceed = null, t
                }
            }, t.getTZOffset = function(e) {
                var i = t.Date;
                return 6e4 * (i.hcGetTimezoneOffset && i.hcGetTimezoneOffset(e) || i.hcTimezoneOffset || 0)
            }, t.dateFormat = function(e, i, o) {
                if (!t.defined(i) || isNaN(i)) return t.defaultOptions.lang.invalidDate || "";
                e = t.pick(e, "%Y-%m-%d %H:%M:%S");
                var n = t.Date,
                    r = new n(i - t.getTZOffset(i)),
                    a = r[n.hcGetHours](),
                    s = r[n.hcGetDay](),
                    l = r[n.hcGetDate](),
                    h = r[n.hcGetMonth](),
                    c = r[n.hcGetFullYear](),
                    d = t.defaultOptions.lang,
                    p = d.weekdays,
                    u = d.shortWeekdays,
                    g = t.pad,
                    f = t.extend({
                        a: u ? u[s] : p[s].substr(0, 3),
                        A: p[s],
                        d: g(l),
                        e: g(l, 2, " "),
                        w: s,
                        b: d.shortMonths[h],
                        B: d.months[h],
                        m: g(h + 1),
                        y: c.toString().substr(2, 2),
                        Y: c,
                        H: g(a),
                        k: a,
                        I: g(a % 12 || 12),
                        l: a % 12 || 12,
                        M: g(r[n.hcGetMinutes]()),
                        p: a < 12 ? "AM" : "PM",
                        P: a < 12 ? "am" : "pm",
                        S: g(r.getSeconds()),
                        L: g(Math.round(i % 1e3), 3)
                    }, t.dateFormats);
                return t.objectEach(f, function(t, o) {
                    for (; - 1 !== e.indexOf("%" + o);) e = e.replace("%" + o, "function" == typeof t ? t(i) : t)
                }), o ? e.substr(0, 1).toUpperCase() + e.substr(1) : e
            }, t.formatSingle = function(e, i) {
                var o, n = /f$/,
                    r = /\.([0-9])/,
                    a = t.defaultOptions.lang;
                return n.test(e) ? (o = (o = e.match(r)) ? o[1] : -1, null !== i && (i = t.numberFormat(i, o, a.decimalPoint, e.indexOf(",") > -1 ? a.thousandsSep : ""))) : i = t.dateFormat(e, i), i
            }, t.format = function(e, i) {
                for (var o, n, r, a, s, l, h, c = "{", d = !1, p = []; e && -1 !== (h = e.indexOf(c));) {
                    if (o = e.slice(0, h), d) {
                        for (s = (r = (n = o.split(":")).shift().split(".")).length, l = i, a = 0; a < s; a++) l = l[r[a]];
                        n.length && (l = t.formatSingle(n.join(":"), l)), p.push(l)
                    } else p.push(o);
                    e = e.slice(h + 1), c = (d = !d) ? "}" : "{"
                }
                return p.push(e), p.join("")
            }, t.getMagnitude = function(t) {
                return Math.pow(10, Math.floor(Math.log(t) / Math.LN10))
            }, t.normalizeTickInterval = function(e, i, o, n, r) {
                var a, s, l = e;
                for (a = e / (o = t.pick(o, 1)), i || (i = r ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === n && (1 === o ? i = t.grep(i, function(t) {
                        return t % 1 == 0
                    }) : o <= .1 && (i = [1 / o]))), s = 0; s < i.length && (l = i[s], !(r && l * o >= e || !r && a <= (i[s] + (i[s + 1] || i[s])) / 2)); s++);
                return l = t.correctFloat(l * o, -Math.round(Math.log(.001) / Math.LN10))
            }, t.stableSort = function(t, e) {
                var i, o, n = t.length;
                for (o = 0; o < n; o++) t[o].safeI = o;
                for (t.sort(function(t, o) {
                        return i = e(t, o), 0 === i ? t.safeI - o.safeI : i
                    }), o = 0; o < n; o++) delete t[o].safeI
            }, t.arrayMin = function(t) {
                for (var e = t.length, i = t[0]; e--;) t[e] < i && (i = t[e]);
                return i
            }, t.arrayMax = function(t) {
                for (var e = t.length, i = t[0]; e--;) t[e] > i && (i = t[e]);
                return i
            }, t.destroyObjectProperties = function(e, i) {
                t.objectEach(e, function(t, o) {
                    t && t !== i && t.destroy && t.destroy(), delete e[o]
                })
            }, t.discardElement = function(e) {
                var i = t.garbageBin;
                i || (i = t.createElement("div")), e && i.appendChild(e), i.innerHTML = ""
            }, t.correctFloat = function(t, e) {
                return parseFloat(t.toPrecision(e || 14))
            }, t.setAnimation = function(e, i) {
                i.renderer.globalAnimation = t.pick(e, i.options.chart.animation, !0)
            }, t.animObject = function(e) {
                return t.isObject(e) ? t.merge(e) : {
                    duration: e ? 500 : 0
                }
            }, t.timeUnits = {
                millisecond: 1,
                second: 1e3,
                minute: 6e4,
                hour: 36e5,
                day: 864e5,
                week: 6048e5,
                month: 24192e5,
                year: 314496e5
            }, t.numberFormat = function(e, i, o, n) {
                e = +e || 0, i = +i;
                var r, a, s, l, h = t.defaultOptions.lang,
                    c = (e.toString().split(".")[1] || "").length;
                return -1 === i ? i = Math.min(c, 20) : t.isNumber(i) || (i = 2), l = (Math.abs(e) + Math.pow(10, -Math.max(i, c) - 1)).toFixed(i), r = String(t.pInt(l)), a = r.length > 3 ? r.length % 3 : 0, o = t.pick(o, h.decimalPoint), n = t.pick(n, h.thousandsSep), s = e < 0 ? "-" : "", s += a ? r.substr(0, a) + n : "", s += r.substr(a).replace(/(\d{3})(?=\d)/g, "$1" + n), i && (s += o + l.slice(-i)), s
            }, Math.easeInOutSine = function(t) {
                return -.5 * (Math.cos(Math.PI * t) - 1)
            }, t.getStyle = function(e, i, o) {
                var r;
                return "width" === i ? Math.min(e.offsetWidth, e.scrollWidth) - t.getStyle(e, "padding-left") - t.getStyle(e, "padding-right") : "height" === i ? Math.min(e.offsetHeight, e.scrollHeight) - t.getStyle(e, "padding-top") - t.getStyle(e, "padding-bottom") : ((r = n.getComputedStyle(e, void 0)) && (r = r.getPropertyValue(i), t.pick(o, !0) && (r = t.pInt(r))), r)
            }, t.inArray = function(t, e) {
                return e.indexOf ? e.indexOf(t) : [].indexOf.call(e, t)
            }, t.grep = function(t, e) {
                return [].filter.call(t, e)
            }, t.find = function(t, e) {
                return [].find.call(t, e)
            }, t.map = function(t, e) {
                for (var i = [], o = 0, n = t.length; o < n; o++) i[o] = e.call(t[o], t[o], o, t);
                return i
            }, t.offset = function(t) {
                var e = o.documentElement,
                    i = t.getBoundingClientRect();
                return {
                    top: i.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                    left: i.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
                }
            }, t.stop = function(t, i) {
                for (var o = e.length; o--;) e[o].elem !== t || i && i !== e[o].prop || (e[o].stopped = !0)
            }, t.each = function(t, e, i) {
                return Array.prototype.forEach.call(t, e, i)
            }, t.objectEach = function(t, e, i) {
                for (var o in t) t.hasOwnProperty(o) && e.call(i, t[o], o, t)
            }, t.addEvent = function(e, i, o) {
                function r(t) {
                    t.target = t.srcElement || n, o.call(e, t)
                }
                var a = e.hcEvents = e.hcEvents || {};
                return e.addEventListener ? e.addEventListener(i, o, !1) : e.attachEvent && (e.hcEventsIE || (e.hcEventsIE = {}), e.hcEventsIE[o.toString()] = r, e.attachEvent("on" + i, r)), a[i] || (a[i] = []), a[i].push(o),
                    function() {
                        t.removeEvent(e, i, o)
                    }
            }, t.removeEvent = function(e, i, o) {
                function n(t, i) {
                    e.removeEventListener ? e.removeEventListener(t, i, !1) : e.attachEvent && (i = e.hcEventsIE[i.toString()], e.detachEvent("on" + t, i))
                }

                function r() {
                    var o, r;
                    e.nodeName && (i ? (o = {})[i] = !0 : o = l, t.objectEach(o, function(t, e) {
                        if (l[e])
                            for (r = l[e].length; r--;) n(e, l[e][r])
                    }))
                }
                var a, s, l = e.hcEvents;
                l && (i ? (a = l[i] || [], o ? ((s = t.inArray(o, a)) > -1 && (a.splice(s, 1), l[i] = a), n(i, o)) : (r(), l[i] = [])) : (r(), e.hcEvents = {}))
            }, t.fireEvent = function(e, i, n, r) {
                var a, s, l, h, c, d = e.hcEvents;
                if (n = n || {}, o.createEvent && (e.dispatchEvent || e.fireEvent))(a = o.createEvent("Events")).initEvent(i, !0, !0), t.extend(a, n), e.dispatchEvent ? e.dispatchEvent(a) : e.fireEvent(i, a);
                else if (d)
                    for (l = (s = d[i] || []).length, n.target || t.extend(n, {
                            preventDefault: function() {
                                n.defaultPrevented = !0
                            },
                            target: e,
                            type: i
                        }), h = 0; h < l; h++)(c = s[h]) && !1 === c.call(e, n) && n.preventDefault();
                r && !n.defaultPrevented && r(n)
            }, t.animate = function(e, i, o) {
                var n, r, a, s, l = "";
                t.isObject(o) || (o = {
                    duration: (s = arguments)[2],
                    easing: s[3],
                    complete: s[4]
                }), t.isNumber(o.duration) || (o.duration = 400), o.easing = "function" == typeof o.easing ? o.easing : Math[o.easing] || Math.easeInOutSine, o.curAnim = t.merge(i), t.objectEach(i, function(s, h) {
                    t.stop(e, h), a = new t.Fx(e, o, h), r = null, "d" === h ? (a.paths = a.initPath(e, e.d, i.d), a.toD = i.d, n = 0, r = 1) : e.attr ? n = e.attr(h) : (n = parseFloat(t.getStyle(e, h)) || 0, "opacity" !== h && (l = "px")), r || (r = s), r && r.match && r.match("px") && (r = r.replace(/px/g, "")), a.run(n, r, l)
                })
            }, t.seriesType = function(e, i, o, n, r) {
                var a = t.getOptions(),
                    s = t.seriesTypes;
                return s[e] ? t.error(27) : (a.plotOptions[e] = t.merge(a.plotOptions[i], o), s[e] = t.extendClass(s[i] || function() {}, n), s[e].prototype.type = e, r && (s[e].prototype.pointClass = t.extendClass(t.Point, r)), s[e])
            }, t.uniqueKey = function() {
                var t = Math.random().toString(36).substring(2, 9),
                    e = 0;
                return function() {
                    return "highcharts-" + t + "-" + e++
                }
            }(), n.jQuery && (n.jQuery.fn.highcharts = function() {
                var e = [].slice.call(arguments);
                if (this[0]) return e[0] ? (new(t[t.isString(e[0]) ? e.shift() : "Chart"])(this[0], e[0], e[1]), this) : i[t.attr(this[0], "data-highcharts-chart")]
            }), o && !o.defaultView && (t.getStyle = function(e, i) {
                var o, n = {
                    width: "clientWidth",
                    height: "clientHeight"
                }[i];
                return e.style[i] ? t.pInt(e.style[i]) : ("opacity" === i && (i = "filter"), n ? (e.style.zoom = 1, Math.max(e[n] - 2 * t.getStyle(e, "padding"), 0)) : (o = e.currentStyle[i.replace(/\-(\w)/g, function(t, e) {
                    return e.toUpperCase()
                })], "filter" === i && (o = o.replace(/alpha\(opacity=([0-9]+)\)/, function(t, e) {
                    return e / 100
                })), "" === o ? 1 : t.pInt(o)))
            }), Array.prototype.forEach || (t.each = function(t, e, i) {
                for (var o = 0, n = t.length; o < n; o++)
                    if (!1 === e.call(i, t[o], o, t)) return o
            }), Array.prototype.indexOf || (t.inArray = function(t, e) {
                var i, o = 0;
                if (e)
                    for (i = e.length; o < i; o++)
                        if (e[o] === t) return o;
                return -1
            }), Array.prototype.filter || (t.grep = function(t, e) {
                for (var i = [], o = 0, n = t.length; o < n; o++) e(t[o], o) && i.push(t[o]);
                return i
            }), Array.prototype.find || (t.find = function(t, e) {
                var i, o = t.length;
                for (i = 0; i < o; i++)
                    if (e(t[i], i)) return t[i]
            })
        }(e),
        function(t) {
            var e = t.each,
                i = t.isNumber,
                o = t.map,
                n = t.merge,
                r = t.pInt;
            t.Color = function(e) {
                if (!(this instanceof t.Color)) return new t.Color(e);
                this.init(e)
            }, t.Color.prototype = {
                parsers: [{
                    regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                    parse: function(t) {
                        return [r(t[1]), r(t[2]), r(t[3]), parseFloat(t[4], 10)]
                    }
                }, {
                    regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                    parse: function(t) {
                        return [r(t[1]), r(t[2]), r(t[3]), 1]
                    }
                }],
                names: {
                    none: "rgba(255,255,255,0)",
                    white: "#ffffff",
                    black: "#000000"
                },
                init: function(e) {
                    var i, n, r, a, s;
                    if (this.input = e = this.names[e && e.toLowerCase ? e.toLowerCase() : ""] || e, e && e.stops) this.stops = o(e.stops, function(e) {
                        return new t.Color(e[1])
                    });
                    else if (e && "#" === e[0] && (s = e.length, e = parseInt(e.substr(1), 16), 7 === s ? n = [(16711680 & e) >> 16, (65280 & e) >> 8, 255 & e, 1] : 4 === s && (n = [(3840 & e) >> 4 | (3840 & e) >> 8, (240 & e) >> 4 | 240 & e, (15 & e) << 4 | 15 & e, 1])), !n)
                        for (r = this.parsers.length; r-- && !n;)(i = (a = this.parsers[r]).regex.exec(e)) && (n = a.parse(i));
                    this.rgba = n || []
                },
                get: function(t) {
                    var o, r = this.input,
                        a = this.rgba;
                    return this.stops ? ((o = n(r)).stops = [].concat(o.stops), e(this.stops, function(e, i) {
                        o.stops[i] = [o.stops[i][0], e.get(t)]
                    })) : o = a && i(a[0]) ? "rgb" === t || !t && 1 === a[3] ? "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")" : "a" === t ? a[3] : "rgba(" + a.join(",") + ")" : r, o
                },
                brighten: function(t) {
                    var o, n = this.rgba;
                    if (this.stops) e(this.stops, function(e) {
                        e.brighten(t)
                    });
                    else if (i(t) && 0 !== t)
                        for (o = 0; o < 3; o++) n[o] += r(255 * t), n[o] < 0 && (n[o] = 0), n[o] > 255 && (n[o] = 255);
                    return this
                },
                setOpacity: function(t) {
                    return this.rgba[3] = t, this
                },
                tweenTo: function(t, e) {
                    var i, o, n = this;
                    return t.rgba.length ? (n = n.rgba, o = ((i = 1 !== (t = t.rgba)[3] || 1 !== n[3]) ? "rgba(" : "rgb(") + Math.round(t[0] + (n[0] - t[0]) * (1 - e)) + "," + Math.round(t[1] + (n[1] - t[1]) * (1 - e)) + "," + Math.round(t[2] + (n[2] - t[2]) * (1 - e)) + (i ? "," + (t[3] + (n[3] - t[3]) * (1 - e)) : "") + ")") : o = t.input || "none", o
                }
            }, t.color = function(e) {
                return new t.Color(e)
            }
        }(e),
        function(t) {
            function e() {
                var e = t.defaultOptions.global,
                    i = c.moment;
                if (e.timezone) {
                    if (i) return function(t) {
                        return -i.tz(t, e.timezone).utcOffset()
                    };
                    t.error(25)
                }
                return e.useUTC && e.getTimezoneOffset
            }

            function i() {
                var i, o = t.defaultOptions.global,
                    a = o.useUTC,
                    s = a ? "getUTC" : "get",
                    h = a ? "setUTC" : "set";
                t.Date = i = o.Date || c.Date, i.hcTimezoneOffset = a && o.timezoneOffset, i.hcGetTimezoneOffset = e(), i.hcMakeTime = function(t, e, o, n, s, h) {
                    var c;
                    return a ? (c = i.UTC.apply(0, arguments), c += r(c)) : c = new i(t, e, l(o, 1), l(n, 0), l(s, 0), l(h, 0)).getTime(), c
                }, n(["Minutes", "Hours", "Day", "Date", "Month", "FullYear"], function(t) {
                    i["hcGet" + t] = s + t
                }), n(["Milliseconds", "Seconds", "Minutes", "Hours", "Date", "Month", "FullYear"], function(t) {
                    i["hcSet" + t] = h + t
                })
            }
            var o = t.color,
                n = t.each,
                r = t.getTZOffset,
                a = t.isTouchDevice,
                s = t.merge,
                l = t.pick,
                h = t.svg,
                c = t.win;
            t.defaultOptions = {
                colors: "#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),
                symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
                lang: {
                    loading: "Loading...",
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    decimalPoint: ".",
                    numericSymbols: ["k", "M", "G", "T", "P", "E"],
                    resetZoom: "Reset zoom",
                    resetZoomTitle: "Reset zoom level 1:1",
                    thousandsSep: " "
                },
                global: {
                    useUTC: !0,
                    VMLRadialGradientURL: "http://code.highcharts.com/5.0.12 custom build/gfx/vml-radial-gradient.png"
                },
                chart: {
                    borderRadius: 0,
                    defaultSeriesType: "line",
                    ignoreHiddenSeries: !0,
                    spacing: [10, 10, 15, 10],
                    resetZoomButton: {
                        theme: {
                            zIndex: 20
                        },
                        position: {
                            align: "right",
                            x: -10,
                            y: 10
                        }
                    },
                    width: null,
                    height: null,
                    borderColor: "#335cad",
                    backgroundColor: "#ffffff",
                    plotBorderColor: "#cccccc"
                },
                title: {
                    text: "Chart title",
                    align: "center",
                    margin: 15,
                    widthAdjust: -44
                },
                subtitle: {
                    text: "",
                    align: "center",
                    widthAdjust: -44
                },
                plotOptions: {},
                labels: {
                    style: {
                        position: "absolute",
                        color: "#333333"
                    }
                },
                legend: {
                    enabled: !0,
                    align: "center",
                    layout: "horizontal",
                    labelFormatter: function() {
                        return this.name
                    },
                    borderColor: "#999999",
                    borderRadius: 0,
                    navigation: {
                        activeColor: "#003399",
                        inactiveColor: "#cccccc"
                    },
                    itemStyle: {
                        color: "#333333",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textOverflow: "ellipsis"
                    },
                    itemHoverStyle: {
                        color: "#000000"
                    },
                    itemHiddenStyle: {
                        color: "#cccccc"
                    },
                    shadow: !1,
                    itemCheckboxStyle: {
                        position: "absolute",
                        width: "13px",
                        height: "13px"
                    },
                    squareSymbol: !0,
                    symbolPadding: 5,
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                    title: {
                        style: {
                            fontWeight: "bold"
                        }
                    }
                },
                loading: {
                    labelStyle: {
                        fontWeight: "bold",
                        position: "relative",
                        top: "45%"
                    },
                    style: {
                        position: "absolute",
                        backgroundColor: "#ffffff",
                        opacity: .5,
                        textAlign: "center"
                    }
                },
                tooltip: {
                    enabled: !0,
                    animation: h,
                    borderRadius: 3,
                    dateTimeLabelFormats: {
                        millisecond: "%A, %b %e, %H:%M:%S.%L",
                        second: "%A, %b %e, %H:%M:%S",
                        minute: "%A, %b %e, %H:%M",
                        hour: "%A, %b %e, %H:%M",
                        day: "%A, %b %e, %Y",
                        week: "Week from %A, %b %e, %Y",
                        month: "%B %Y",
                        year: "%Y"
                    },
                    footerFormat: "",
                    padding: 8,
                    snap: a ? 25 : 10,
                    backgroundColor: o("#f7f7f7").setOpacity(.85).get(),
                    borderWidth: 1,
                    headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                    pointFormat: '<span style="color:{point.color}">â—</span> {series.name}: <b>{point.y}</b><br/>',
                    shadow: !0,
                    style: {
                        color: "#333333",
                        cursor: "default",
                        fontSize: "12px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap"
                    }
                },
                credits: {
                    enabled: !0,
                    href: "http://www.highcharts.com",
                    position: {
                        align: "right",
                        x: -10,
                        verticalAlign: "bottom",
                        y: -5
                    },
                    style: {
                        cursor: "pointer",
                        color: "#999999",
                        fontSize: "9px"
                    },
                    text: "Highcharts.com"
                }
            }, t.setOptions = function(e) {
                return t.defaultOptions = s(!0, t.defaultOptions, e), i(), t.defaultOptions
            }, t.getOptions = function() {
                return t.defaultOptions
            }, t.defaultPlotOptions = t.defaultOptions.plotOptions, i()
        }(e),
        function(t) {
            var e, i, o = t.addEvent,
                n = t.animate,
                r = t.attr,
                a = t.charts,
                s = t.color,
                l = t.css,
                h = t.createElement,
                c = t.defined,
                d = t.deg2rad,
                p = t.destroyObjectProperties,
                u = t.doc,
                g = t.each,
                f = t.extend,
                m = t.erase,
                x = t.grep,
                v = t.hasTouch,
                y = t.inArray,
                b = t.isArray,
                M = t.isFirefox,
                w = t.isMS,
                k = t.isObject,
                S = t.isString,
                A = t.isWebKit,
                C = t.merge,
                T = t.noop,
                P = t.objectEach,
                L = t.pick,
                D = t.pInt,
                O = t.removeEvent,
                I = (t.splat, t.stop),
                E = t.svg,
                z = t.SVG_NS,
                B = t.symbolSizes,
                R = t.win;
            e = t.SVGElement = function() {
                return this
            }, f(e.prototype, {
                opacity: 1,
                SVG_NS: z,
                textProps: ["direction", "fontSize", "fontWeight", "fontFamily", "fontStyle", "color", "lineHeight", "width", "textAlign", "textDecoration", "textOverflow", "textOutline"],
                init: function(t, e) {
                    this.element = "span" === e ? h(e) : u.createElementNS(this.SVG_NS, e), this.renderer = t
                },
                animate: function(e, i, o) {
                    var r = t.animObject(L(i, this.renderer.globalAnimation, !0));
                    return 0 !== r.duration ? (o && (r.complete = o), n(this, e, r)) : (this.attr(e, null, o), r.step && r.step.call(this)), this
                },
                colorGradient: function(e, i, o) {
                    var n, r, a, s, l, h, d, p, u, f, m, x, v = this.renderer,
                        y = [];
                    e.radialGradient ? r = "radialGradient" : e.linearGradient && (r = "linearGradient"), r && (a = e[r], l = v.gradients, d = e.stops, f = o.radialReference, b(a) && (e[r] = a = {
                        x1: a[0],
                        y1: a[1],
                        x2: a[2],
                        y2: a[3],
                        gradientUnits: "userSpaceOnUse"
                    }), "radialGradient" === r && f && !c(a.gradientUnits) && (s = a, a = C(a, v.getRadialAttr(f, s), {
                        gradientUnits: "userSpaceOnUse"
                    })), P(a, function(t, e) {
                        "id" !== e && y.push(e, t)
                    }), P(d, function(t) {
                        y.push(t)
                    }), l[y = y.join(",")] ? m = l[y].attr("id") : (a.id = m = t.uniqueKey(), l[y] = h = v.createElement(r).attr(a).add(v.defs), h.radAttr = s, h.stops = [], g(d, function(e) {
                        var i;
                        0 === e[1].indexOf("rgba") ? (n = t.color(e[1]), p = n.get("rgb"), u = n.get("a")) : (p = e[1], u = 1), i = v.createElement("stop").attr({
                            offset: e[0],
                            "stop-color": p,
                            "stop-opacity": u
                        }).add(h), h.stops.push(i)
                    })), x = "url(" + v.url + "#" + m + ")", o.setAttribute(i, x), o.gradient = y, e.toString = function() {
                        return x
                    })
                },
                applyTextOutline: function(e) {
                    var i, o, n, a, s, l, h = this.element,
                        c = {};
                    if (-1 !== e.indexOf("contrast") && (c.textOutline = e = e.replace(/contrast/g, this.renderer.getContrast(h.style.fill))), e = e.split(" "), n = e[e.length - 1], (a = e[0]) && "none" !== a && t.svg) {
                        for (this.fakeTS = !0, i = [].slice.call(h.getElementsByTagName("tspan")), this.ySetter = this.xSetter, a = a.replace(/(^[\d\.]+)(.*?)$/g, function(t, e, i) {
                                return 2 * e + i
                            }), l = i.length; l--;) "highcharts-text-outline" === (o = i[l]).getAttribute("class") && m(i, h.removeChild(o));
                        s = h.firstChild, g(i, function(t, e) {
                            var i;
                            0 === e && (t.setAttribute("x", h.getAttribute("x")), e = h.getAttribute("y"), t.setAttribute("y", e || 0), null === e && h.setAttribute("y", 0)), i = t.cloneNode(1), r(i, {
                                class: "highcharts-text-outline",
                                fill: n,
                                stroke: n,
                                "stroke-width": a,
                                "stroke-linejoin": "round"
                            }), h.insertBefore(i, s)
                        })
                    }
                },
                attr: function(t, e, i, o) {
                    var n, r, a, s, l = this.element,
                        h = this;
                    return "string" == typeof t && void 0 !== e && (n = t, (t = {})[n] = e), "string" == typeof t ? h = (this[t + "Getter"] || this._defaultGetter).call(this, t, l) : (P(t, function(e, i) {
                        a = !1, o || I(this, i), this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(i) && (r || (this.symbolAttr(t), r = !0), a = !0), !this.rotation || "x" !== i && "y" !== i || (this.doTransform = !0), a || ((s = this[i + "Setter"] || this._defaultSetter).call(this, e, i, l), this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(i) && this.updateShadows(i, e, s))
                    }, this), this.afterSetters()), i && i(), h
                },
                afterSetters: function() {
                    this.doTransform && (this.updateTransform(), this.doTransform = !1)
                },
                updateShadows: function(t, e, i) {
                    for (var o = this.shadows, n = o.length; n--;) i.call(o[n], "height" === t ? Math.max(e - (o[n].cutHeight || 0), 0) : "d" === t ? this.d : e, t, o[n])
                },
                addClass: function(t, e) {
                    var i = this.attr("class") || "";
                    return -1 === i.indexOf(t) && (e || (t = (i + (i ? " " : "") + t).replace("  ", " ")), this.attr("class", t)), this
                },
                hasClass: function(t) {
                    return -1 !== r(this.element, "class").indexOf(t)
                },
                removeClass: function(t) {
                    return r(this.element, "class", (r(this.element, "class") || "").replace(t, "")), this
                },
                symbolAttr: function(t) {
                    var e = this;
                    g(["x", "y", "r", "start", "end", "width", "height", "innerR", "anchorX", "anchorY"], function(i) {
                        e[i] = L(t[i], e[i])
                    }), e.attr({
                        d: e.renderer.symbols[e.symbolName](e.x, e.y, e.width, e.height, e)
                    })
                },
                clip: function(t) {
                    return this.attr("clip-path", t ? "url(" + this.renderer.url + "#" + t.id + ")" : "none")
                },
                crisp: function(t, e) {
                    var i, o = this,
                        n = {};
                    return e = e || t.strokeWidth || 0, i = Math.round(e) % 2 / 2, t.x = Math.floor(t.x || o.x || 0) + i, t.y = Math.floor(t.y || o.y || 0) + i, t.width = Math.floor((t.width || o.width || 0) - 2 * i), t.height = Math.floor((t.height || o.height || 0) - 2 * i), c(t.strokeWidth) && (t.strokeWidth = e), P(t, function(t, e) {
                        o[e] !== t && (o[e] = n[e] = t)
                    }), n
                },
                css: function(t) {
                    var e, i, o = this.styles,
                        n = {},
                        a = this.element,
                        s = "",
                        h = !o,
                        c = ["textOutline", "textOverflow", "width"];
                    return t && t.color && (t.fill = t.color), o && P(t, function(t, e) {
                        t !== o[e] && (n[e] = t, h = !0)
                    }), h && (o && (t = f(o, n)), e = this.textWidth = t && t.width && "auto" !== t.width && "text" === a.nodeName.toLowerCase() && D(t.width), this.styles = t, e && !E && this.renderer.forExport && delete t.width, w && !E ? l(this.element, t) : (i = function(t, e) {
                        return "-" + e.toLowerCase()
                    }, P(t, function(t, e) {
                        -1 === y(e, c) && (s += e.replace(/([A-Z])/g, i) + ":" + t + ";")
                    }), s && r(a, "style", s)), this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), t && t.textOutline && this.applyTextOutline(t.textOutline))), this
                },
                strokeWidth: function() {
                    return this["stroke-width"] || 0
                },
                on: function(t, e) {
                    var i = this,
                        o = i.element;
                    return v && "click" === t ? (o.ontouchstart = function(t) {
                        i.touchEventFired = Date.now(), t.preventDefault(), e.call(o, t)
                    }, o.onclick = function(t) {
                        (-1 === R.navigator.userAgent.indexOf("Android") || Date.now() - (i.touchEventFired || 0) > 1100) && e.call(o, t)
                    }) : o["on" + t] = e, this
                },
                setRadialReference: function(t) {
                    var e = this.renderer.gradients[this.element.gradient];
                    return this.element.radialReference = t, e && e.radAttr && e.animate(this.renderer.getRadialAttr(t, e.radAttr)), this
                },
                translate: function(t, e) {
                    return this.attr({
                        translateX: t,
                        translateY: e
                    })
                },
                invert: function(t) {
                    var e = this;
                    return e.inverted = t, e.updateTransform(), e
                },
                updateTransform: function() {
                    var t, e = this,
                        i = e.translateX || 0,
                        o = e.translateY || 0,
                        n = e.scaleX,
                        r = e.scaleY,
                        a = e.inverted,
                        s = e.rotation,
                        l = e.element;
                    a && (i += e.width, o += e.height), t = ["translate(" + i + "," + o + ")"], a ? t.push("rotate(90) scale(-1,1)") : s && t.push("rotate(" + s + " " + (l.getAttribute("x") || 0) + " " + (l.getAttribute("y") || 0) + ")"), (c(n) || c(r)) && t.push("scale(" + L(n, 1) + " " + L(r, 1) + ")"), t.length && l.setAttribute("transform", t.join(" "))
                },
                toFront: function() {
                    var t = this.element;
                    return t.parentNode.appendChild(t), this
                },
                align: function(t, e, i) {
                    var o, n, r, a, s, l, h, c = {},
                        d = this.renderer,
                        p = d.alignedObjects;
                    return t ? (this.alignOptions = t, this.alignByTranslate = e, i && !S(i) || (this.alignTo = s = i || "renderer", m(p, this), p.push(this), i = null)) : (t = this.alignOptions, e = this.alignByTranslate, s = this.alignTo), i = L(i, d[s], d), o = t.align, n = t.verticalAlign, r = (i.x || 0) + (t.x || 0), a = (i.y || 0) + (t.y || 0), "right" === o ? l = 1 : "center" === o && (l = 2), l && (r += (i.width - (t.width || 0)) / l), c[e ? "translateX" : "x"] = Math.round(r), "bottom" === n ? h = 1 : "middle" === n && (h = 2), h && (a += (i.height - (t.height || 0)) / h), c[e ? "translateY" : "y"] = Math.round(a), this[this.placed ? "animate" : "attr"](c), this.placed = !0, this.alignAttr = c, this
                },
                getBBox: function(t, e) {
                    var i, o, n, r, a, s, l, h, c = this,
                        p = c.renderer,
                        u = c.element,
                        m = c.styles,
                        x = c.textStr,
                        v = p.cache,
                        y = p.cacheKeys;
                    if (r = L(e, c.rotation), a = r * d, s = m && m.fontSize, void 0 !== x && (-1 === (h = x.toString()).indexOf("<") && (h = h.replace(/[0-9]/g, "0")), h += ["", r || 0, s, m && m.width, m && m.textOverflow].join(",")), h && !t && (i = v[h]), !i) {
                        if (u.namespaceURI === c.SVG_NS || p.forExport) {
                            try {
                                (l = this.fakeTS && function(t) {
                                    g(u.querySelectorAll(".highcharts-text-outline"), function(e) {
                                        e.style.display = t
                                    })
                                }) && l("none"), i = u.getBBox ? f({}, u.getBBox()) : {
                                    width: u.offsetWidth,
                                    height: u.offsetHeight
                                }, l && l("")
                            } catch (t) {}(!i || i.width < 0) && (i = {
                                width: 0,
                                height: 0
                            })
                        } else i = c.htmlGetBBox();
                        if (p.isSVG && (o = i.width, n = i.height, m && "11px" === m.fontSize && 17 === Math.round(n) && (i.height = n = 14), r && (i.width = Math.abs(n * Math.sin(a)) + Math.abs(o * Math.cos(a)), i.height = Math.abs(n * Math.cos(a)) + Math.abs(o * Math.sin(a)))), h && i.height > 0) {
                            for (; y.length > 250;) delete v[y.shift()];
                            v[h] || y.push(h), v[h] = i
                        }
                    }
                    return i
                },
                show: function(t) {
                    return this.attr({
                        visibility: t ? "inherit" : "visible"
                    })
                },
                hide: function() {
                    return this.attr({
                        visibility: "hidden"
                    })
                },
                fadeOut: function(t) {
                    var e = this;
                    e.animate({
                        opacity: 0
                    }, {
                        duration: t || 150,
                        complete: function() {
                            e.attr({
                                y: -9999
                            })
                        }
                    })
                },
                add: function(t) {
                    var e, i = this.renderer,
                        o = this.element;
                    return t && (this.parentGroup = t), this.parentInverted = t && t.inverted, void 0 !== this.textStr && i.buildText(this), this.added = !0, (!t || t.handleZ || this.zIndex) && (e = this.zIndexSetter()), e || (t ? t.element : i.box).appendChild(o), this.onAdd && this.onAdd(), this
                },
                safeRemoveChild: function(t) {
                    var e = t.parentNode;
                    e && e.removeChild(t)
                },
                destroy: function() {
                    var t, e, i = this,
                        o = i.element || {},
                        n = i.renderer.isSVG && "SPAN" === o.nodeName && i.parentGroup,
                        r = o.ownerSVGElement;
                    if (o.onclick = o.onmouseout = o.onmouseover = o.onmousemove = o.point = null, I(i), i.clipPath && r && (g(r.querySelectorAll("[clip-path]"), function(t) {
                            t.getAttribute("clip-path").indexOf(i.clipPath.element.id + ")") > -1 && t.removeAttribute("clip-path")
                        }), i.clipPath = i.clipPath.destroy()), i.stops) {
                        for (e = 0; e < i.stops.length; e++) i.stops[e] = i.stops[e].destroy();
                        i.stops = null
                    }
                    for (i.safeRemoveChild(o), i.destroyShadows(); n && n.div && 0 === n.div.childNodes.length;) t = n.parentGroup, i.safeRemoveChild(n.div), delete n.div, n = t;
                    return i.alignTo && m(i.renderer.alignedObjects, i), P(i, function(t, e) {
                        delete i[e]
                    }), null
                },
                shadow: function(t, e, i) {
                    var o, n, a, s, l, h, c = [],
                        d = this.element;
                    if (t) {
                        if (!this.shadows) {
                            for (s = L(t.width, 3), l = (t.opacity || .15) / s, h = this.parentInverted ? "(-1,-1)" : "(" + L(t.offsetX, 1) + ", " + L(t.offsetY, 1) + ")", o = 1; o <= s; o++) n = d.cloneNode(0), a = 2 * s + 1 - 2 * o, r(n, {
                                isShadow: "true",
                                stroke: t.color || "#000000",
                                "stroke-opacity": l * o,
                                "stroke-width": a,
                                transform: "translate" + h,
                                fill: "none"
                            }), i && (r(n, "height", Math.max(r(n, "height") - a, 0)), n.cutHeight = a), e ? e.element.appendChild(n) : d.parentNode.insertBefore(n, d), c.push(n);
                            this.shadows = c
                        }
                    } else this.destroyShadows();
                    return this
                },
                destroyShadows: function() {
                    g(this.shadows || [], function(t) {
                        this.safeRemoveChild(t)
                    }, this), this.shadows = void 0
                },
                xGetter: function(t) {
                    return "circle" === this.element.nodeName && ("x" === t ? t = "cx" : "y" === t && (t = "cy")), this._defaultGetter(t)
                },
                _defaultGetter: function(t) {
                    var e = L(this[t], this.element ? this.element.getAttribute(t) : null, 0);
                    return /^[\-0-9\.]+$/.test(e) && (e = parseFloat(e)), e
                },
                dSetter: function(t, e, i) {
                    t && t.join && (t = t.join(" ")), /(NaN| {2}|^$)/.test(t) && (t = "M 0 0"), i.setAttribute(e, t), this[e] = t
                },
                dashstyleSetter: function(t) {
                    var e, i = this["stroke-width"];
                    if ("inherit" === i && (i = 1), t = t && t.toLowerCase()) {
                        for (e = (t = t.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",")).length; e--;) t[e] = D(t[e]) * i;
                        t = t.join(",").replace(/NaN/g, "none"), this.element.setAttribute("stroke-dasharray", t)
                    }
                },
                alignSetter: function(t) {
                    var e = {
                        left: "start",
                        center: "middle",
                        right: "end"
                    };
                    this.element.setAttribute("text-anchor", e[t])
                },
                opacitySetter: function(t, e, i) {
                    this[e] = t, i.setAttribute(e, t)
                },
                titleSetter: function(t) {
                    var e = this.element.getElementsByTagName("title")[0];
                    e || (e = u.createElementNS(this.SVG_NS, "title"), this.element.appendChild(e)), e.firstChild && e.removeChild(e.firstChild), e.appendChild(u.createTextNode(String(L(t), "").replace(/<[^>]*>/g, "")))
                },
                textSetter: function(t) {
                    t !== this.textStr && (delete this.bBox, this.textStr = t, this.added && this.renderer.buildText(this))
                },
                fillSetter: function(t, e, i) {
                    "string" == typeof t ? i.setAttribute(e, t) : t && this.colorGradient(t, e, i)
                },
                visibilitySetter: function(t, e, i) {
                    "inherit" === t ? i.removeAttribute(e) : i.setAttribute(e, t)
                },
                zIndexSetter: function(t, e) {
                    var i, o, n, r, a, s = this.renderer,
                        l = this.parentGroup,
                        h = (l || s).element || s.box,
                        d = this.element,
                        p = this.added;
                    if (c(t) && (d.zIndex = t, t = +t, this[e] === t && (p = !1), this[e] = t), p) {
                        for ((t = this.zIndex) && l && (l.handleZ = !0), i = h.childNodes, a = 0; a < i.length && !r; a++) n = (o = i[a]).zIndex, o !== d && (D(n) > t || !c(t) && c(n) || t < 0 && !c(n) && h !== s.box) && (h.insertBefore(d, o), r = !0);
                        r || h.appendChild(d)
                    }
                    return r
                },
                _defaultSetter: function(t, e, i) {
                    i.setAttribute(e, t)
                }
            }), e.prototype.yGetter = e.prototype.xGetter, e.prototype.translateXSetter = e.prototype.translateYSetter = e.prototype.rotationSetter = e.prototype.verticalAlignSetter = e.prototype.scaleXSetter = e.prototype.scaleYSetter = function(t, e) {
                this[e] = t, this.doTransform = !0
            }, e.prototype["stroke-widthSetter"] = e.prototype.strokeSetter = function(t, i, o) {
                this[i] = t, this.stroke && this["stroke-width"] ? (e.prototype.fillSetter.call(this, this.stroke, "stroke", o), o.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0) : "stroke-width" === i && 0 === t && this.hasStroke && (o.removeAttribute("stroke"), this.hasStroke = !1)
            }, i = t.SVGRenderer = function() {
                this.init.apply(this, arguments)
            }, f(i.prototype, {
                Element: e,
                SVG_NS: z,
                init: function(t, e, i, n, a, s) {
                    var h, c, d = this;
                    c = (h = d.createElement("svg").attr({
                        version: "1.1",
                        class: "highcharts-root"
                    }).css(this.getStyle(n))).element, t.appendChild(c), -1 === t.innerHTML.indexOf("xmlns") && r(c, "xmlns", this.SVG_NS), d.isSVG = !0, this.box = c, this.boxWrapper = h, d.alignedObjects = [], this.url = (M || A) && u.getElementsByTagName("base").length ? R.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "", this.createElement("desc").add().element.appendChild(u.createTextNode("Created with Highcharts 5.0.12 custom build")), d.defs = this.createElement("defs").add(), d.allowHTML = s, d.forExport = a, d.gradients = {}, d.cache = {}, d.cacheKeys = [], d.imgCount = 0, d.setSize(e, i, !1);
                    var p, g;
                    M && t.getBoundingClientRect && ((p = function() {
                        l(t, {
                            left: 0,
                            top: 0
                        }), g = t.getBoundingClientRect(), l(t, {
                            left: Math.ceil(g.left) - g.left + "px",
                            top: Math.ceil(g.top) - g.top + "px"
                        })
                    })(), d.unSubPixelFix = o(R, "resize", p))
                },
                getStyle: function(t) {
                    return this.style = f({
                        fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                        fontSize: "12px"
                    }, t), this.style
                },
                setStyle: function(t) {
                    this.boxWrapper.css(this.getStyle(t))
                },
                isHidden: function() {
                    return !this.boxWrapper.getBBox().width
                },
                destroy: function() {
                    var t = this,
                        e = t.defs;
                    return t.box = null, t.boxWrapper = t.boxWrapper.destroy(), p(t.gradients || {}), t.gradients = null, e && (t.defs = e.destroy()), t.unSubPixelFix && t.unSubPixelFix(), t.alignedObjects = null, null
                },
                createElement: function(t) {
                    var e = new this.Element;
                    return e.init(this, t), e
                },
                draw: T,
                getRadialAttr: function(t, e) {
                    return {
                        cx: t[0] - t[2] / 2 + e.cx * t[2],
                        cy: t[1] - t[2] / 2 + e.cy * t[2],
                        r: e.r * t[2]
                    }
                },
                getSpanWidth: function(t, e) {
                    var i = this,
                        o = t.getBBox(!0).width;
                    return !E && i.forExport && (o = i.measureSpanWidth(e.firstChild.data, t.styles)), o
                },
                applyEllipsis: function(t, e, i, o) {
                    var n, r = this,
                        a = r.getSpanWidth(t, e),
                        s = a > o,
                        l = 0,
                        h = i.length,
                        c = function(t) {
                            e.removeChild(e.firstChild), t && e.appendChild(u.createTextNode(t))
                        };
                    if (s) {
                        for (; l <= h;) n = Math.ceil((l + h) / 2), c(i.substring(0, n) + "â€¦"), a = r.getSpanWidth(t, e), l === h ? l = h + 1 : a > o ? h = n - 1 : l = n;
                        0 === h && c("")
                    }
                    return s
                },
                buildText: function(t) {
                    var e, i, o, n, a, s, h, c = t.element,
                        d = this,
                        p = d.forExport,
                        f = L(t.textStr, "").toString(),
                        m = -1 !== f.indexOf("<"),
                        v = c.childNodes,
                        y = r(c, "x"),
                        b = t.styles,
                        M = t.textWidth,
                        w = b && b.lineHeight,
                        k = b && b.textOutline,
                        S = b && "ellipsis" === b.textOverflow,
                        A = b && "nowrap" === b.whiteSpace,
                        C = b && b.fontSize,
                        T = v.length,
                        P = M && !t.added && this.box,
                        O = function(t) {
                            var e;
                            return e = /(px|em)$/.test(t && t.style.fontSize) ? t.style.fontSize : C || d.style.fontSize || 12, w ? D(w) : d.fontMetrics(e, t.getAttribute("style") ? t : c).h
                        },
                        I = function(t) {
                            return t.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                        };
                    if ((s = [f, S, A, w, k, C, M].join(",")) !== t.textCache) {
                        for (t.textCache = s; T--;) c.removeChild(v[T]);
                        m || k || S || M || -1 !== f.indexOf(" ") ? (i = /<.*class="([^"]+)".*>/, o = /<.*style="([^"]+)".*>/, n = /<.*href="([^"]+)".*>/, P && P.appendChild(c), e = m ? f.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g) : [f], e = x(e, function(t) {
                            return "" !== t
                        }), g(e, function(e, s) {
                            var f, m = 0;
                            e = e.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||"), f = e.split("|||"), g(f, function(e) {
                                if ("" !== e || 1 === f.length) {
                                    var g, x, v = {},
                                        b = u.createElementNS(d.SVG_NS, "tspan");
                                    if (i.test(e) && (g = e.match(i)[1], r(b, "class", g)), o.test(e) && (x = e.match(o)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), r(b, "style", x)), n.test(e) && !p && (r(b, "onclick", 'location.href="' + e.match(n)[1] + '"'), l(b, {
                                            cursor: "pointer"
                                        })), " " !== (e = I(e.replace(/<(.|\n)*?>/g, "") || " "))) {
                                        if (b.appendChild(u.createTextNode(e)), m ? v.dx = 0 : s && null !== y && (v.x = y), r(b, v), c.appendChild(b), !m && h && (!E && p && l(b, {
                                                display: "block"
                                            }), r(b, "dy", O(b))), M) {
                                            var w, k, C = e.replace(/([^\^])-/g, "$1- ").split(" "),
                                                T = f.length > 1 || s || C.length > 1 && !A,
                                                P = [],
                                                L = O(b),
                                                D = t.rotation;
                                            for (S && (a = d.applyEllipsis(t, b, e, M)); !S && T && (C.length || P.length);) t.rotation = 0, w = (k = d.getSpanWidth(t, b)) > M, void 0 === a && (a = w), w && 1 !== C.length ? (b.removeChild(b.firstChild), P.unshift(C.pop())) : (C = P, P = [], C.length && !A && (b = u.createElementNS(z, "tspan"), r(b, {
                                                dy: L,
                                                x: y
                                            }), x && r(b, "style", x), c.appendChild(b)), k > M && (M = k)), C.length && b.appendChild(u.createTextNode(C.join(" ").replace(/- /g, "-")));
                                            t.rotation = D
                                        }
                                        m++
                                    }
                                }
                            }), h = h || c.childNodes.length
                        }), a && t.attr("title", t.textStr), P && P.removeChild(c), k && t.applyTextOutline && t.applyTextOutline(k)) : c.appendChild(u.createTextNode(I(f)))
                    }
                },
                getContrast: function(t) {
                    return t = s(t).rgba, t[0] + t[1] + t[2] > 510 ? "#000000" : "#FFFFFF"
                },
                button: function(t, e, i, n, r, a, s, l, h) {
                    var c = this.label(t, e, i, h, null, null, null, null, "button"),
                        d = 0;
                    c.attr(C({
                        padding: 8,
                        r: 2
                    }, r));
                    var p, u, g, m;
                    return r = C({
                        fill: "#f7f7f7",
                        stroke: "#cccccc",
                        "stroke-width": 1,
                        style: {
                            color: "#333333",
                            cursor: "pointer",
                            fontWeight: "normal"
                        }
                    }, r), p = r.style, delete r.style, a = C(r, {
                        fill: "#e6e6e6"
                    }, a), u = a.style, delete a.style, s = C(r, {
                        fill: "#e6ebf5",
                        style: {
                            color: "#000000",
                            fontWeight: "bold"
                        }
                    }, s), g = s.style, delete s.style, l = C(r, {
                        style: {
                            color: "#cccccc"
                        }
                    }, l), m = l.style, delete l.style, o(c.element, w ? "mouseover" : "mouseenter", function() {
                        3 !== d && c.setState(1)
                    }), o(c.element, w ? "mouseout" : "mouseleave", function() {
                        3 !== d && c.setState(d)
                    }), c.setState = function(t) {
                        1 !== t && (c.state = d = t), c.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][t || 0]), c.attr([r, a, s, l][t || 0]).css([p, u, g, m][t || 0])
                    }, c.attr(r).css(f({
                        cursor: "default"
                    }, p)), c.on("click", function(t) {
                        3 !== d && n.call(c, t)
                    })
                },
                crispLine: function(t, e) {
                    return t[1] === t[4] && (t[1] = t[4] = Math.round(t[1]) - e % 2 / 2), t[2] === t[5] && (t[2] = t[5] = Math.round(t[2]) + e % 2 / 2), t
                },
                path: function(t) {
                    var e = {
                        fill: "none"
                    };
                    return b(t) ? e.d = t : k(t) && f(e, t), this.createElement("path").attr(e)
                },
                circle: function(t, e, i) {
                    var o = k(t) ? t : {
                            x: t,
                            y: e,
                            r: i
                        },
                        n = this.createElement("circle");
                    return n.xSetter = n.ySetter = function(t, e, i) {
                        i.setAttribute("c" + e, t)
                    }, n.attr(o)
                },
                arc: function(t, e, i, o, n, r) {
                    var a, s;
                    return k(t) ? (e = (s = t).y, i = s.r, o = s.innerR, n = s.start, r = s.end, t = s.x) : s = {
                        innerR: o,
                        start: n,
                        end: r
                    }, a = this.symbol("arc", t, e, i, i, s), a.r = i, a
                },
                rect: function(t, e, i, o, n, a) {
                    n = k(t) ? t.r : n;
                    var s = this.createElement("rect"),
                        l = k(t) ? t : void 0 === t ? {} : {
                            x: t,
                            y: e,
                            width: Math.max(i, 0),
                            height: Math.max(o, 0)
                        };
                    return void 0 !== a && (l.strokeWidth = a, l = s.crisp(l)), l.fill = "none", n && (l.r = n), s.rSetter = function(t, e, i) {
                        r(i, {
                            rx: t,
                            ry: t
                        })
                    }, s.attr(l)
                },
                setSize: function(t, e, i) {
                    var o = this,
                        n = o.alignedObjects,
                        r = n.length;
                    for (o.width = t, o.height = e, o.boxWrapper.animate({
                            width: t,
                            height: e
                        }, {
                            step: function() {
                                this.attr({
                                    viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")
                                })
                            },
                            duration: L(i, !0) ? void 0 : 0
                        }); r--;) n[r].align()
                },
                g: function(t) {
                    var e = this.createElement("g");
                    return t ? e.attr({
                        class: "highcharts-" + t
                    }) : e
                },
                image: function(t, e, i, o, n) {
                    var r, a = {
                        preserveAspectRatio: "none"
                    };
                    return arguments.length > 1 && f(a, {
                        x: e,
                        y: i,
                        width: o,
                        height: n
                    }), r = this.createElement("image").attr(a), r.element.setAttributeNS ? r.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", t) : r.element.setAttribute("hc-svg-href", t), r
                },
                symbol: function(t, e, i, o, n, r) {
                    var s, d, p, m = this,
                        x = /^url\((.*?)\)$/,
                        v = x.test(t),
                        y = !v && (this.symbols[t] ? t : "circle"),
                        b = y && this.symbols[y],
                        M = c(e) && b && b.call(this.symbols, Math.round(e), Math.round(i), o, n, r);
                    return b ? ((s = this.path(M)).attr("fill", "none"), f(s, {
                        symbolName: y,
                        x: e,
                        y: i,
                        width: o,
                        height: n
                    }), r && f(s, r)) : v && (d = t.match(x)[1], (s = this.image(d)).imgwidth = L(B[d] && B[d].width, r && r.width), s.imgheight = L(B[d] && B[d].height, r && r.height), p = function() {
                        s.attr({
                            width: s.width,
                            height: s.height
                        })
                    }, g(["width", "height"], function(t) {
                        s[t + "Setter"] = function(t, e) {
                            var i = {},
                                o = this["img" + e],
                                n = "width" === e ? "translateX" : "translateY";
                            this[e] = t, c(o) && (this.element && this.element.setAttribute(e, o), this.alignByTranslate || (i[n] = ((this[e] || 0) - o) / 2, this.attr(i)))
                        }
                    }), c(e) && s.attr({
                        x: e,
                        y: i
                    }), s.isImg = !0, c(s.imgwidth) && c(s.imgheight) ? p() : (s.attr({
                        width: 0,
                        height: 0
                    }), h("img", {
                        onload: function() {
                            var t = a[m.chartIndex];
                            0 === this.width && (l(this, {
                                position: "absolute",
                                top: "-999em"
                            }), u.body.appendChild(this)), B[d] = {
                                width: this.width,
                                height: this.height
                            }, s.imgwidth = this.width, s.imgheight = this.height, s.element && p(), this.parentNode && this.parentNode.removeChild(this), !--m.imgCount && t && t.onload && t.onload()
                        },
                        src: d
                    }), this.imgCount++)), s
                },
                symbols: {
                    circle: function(t, e, i, o) {
                        return this.arc(t + i / 2, e + o / 2, i / 2, o / 2, {
                            start: 0,
                            end: 2 * Math.PI,
                            open: !1
                        })
                    },
                    square: function(t, e, i, o) {
                        return ["M", t, e, "L", t + i, e, t + i, e + o, t, e + o, "Z"]
                    },
                    triangle: function(t, e, i, o) {
                        return ["M", t + i / 2, e, "L", t + i, e + o, t, e + o, "Z"]
                    },
                    "triangle-down": function(t, e, i, o) {
                        return ["M", t, e, "L", t + i, e, t + i / 2, e + o, "Z"]
                    },
                    diamond: function(t, e, i, o) {
                        return ["M", t + i / 2, e, "L", t + i, e + o / 2, t + i / 2, e + o, t, e + o / 2, "Z"]
                    },
                    arc: function(t, e, i, o, n) {
                        var r, a = n.start,
                            s = n.r || i,
                            l = n.r || o || i,
                            h = n.end - .001,
                            d = n.innerR,
                            p = n.open,
                            u = Math.cos(a),
                            g = Math.sin(a),
                            f = Math.cos(h),
                            m = Math.sin(h),
                            x = n.end - a < Math.PI ? 0 : 1;
                        return r = ["M", t + s * u, e + l * g, "A", s, l, 0, x, 1, t + s * f, e + l * m], c(d) && r.push(p ? "M" : "L", t + d * f, e + d * m, "A", d, d, 0, x, 0, t + d * u, e + d * g), r.push(p ? "" : "Z"), r
                    },
                    callout: function(t, e, i, o, n) {
                        var r, a = Math.min(n && n.r || 0, i, o),
                            s = a + 6,
                            l = n && n.anchorX,
                            h = n && n.anchorY;
                        return r = ["M", t + a, e, "L", t + i - a, e, "C", t + i, e, t + i, e, t + i, e + a, "L", t + i, e + o - a, "C", t + i, e + o, t + i, e + o, t + i - a, e + o, "L", t + a, e + o, "C", t, e + o, t, e + o, t, e + o - a, "L", t, e + a, "C", t, e, t, e, t + a, e], l && l > i ? h > e + s && h < e + o - s ? r.splice(13, 3, "L", t + i, h - 6, t + i + 6, h, t + i, h + 6, t + i, e + o - a) : r.splice(13, 3, "L", t + i, o / 2, l, h, t + i, o / 2, t + i, e + o - a) : l && l < 0 ? h > e + s && h < e + o - s ? r.splice(33, 3, "L", t, h + 6, t - 6, h, t, h - 6, t, e + a) : r.splice(33, 3, "L", t, o / 2, l, h, t, o / 2, t, e + a) : h && h > o && l > t + s && l < t + i - s ? r.splice(23, 3, "L", l + 6, e + o, l, e + o + 6, l - 6, e + o, t + a, e + o) : h && h < 0 && l > t + s && l < t + i - s && r.splice(3, 3, "L", l - 6, e, l, e - 6, l + 6, e, i - a, e), r
                    }
                },
                clipRect: function(e, i, o, n) {
                    var r, a = t.uniqueKey(),
                        s = this.createElement("clipPath").attr({
                            id: a
                        }).add(this.defs);
                    return r = this.rect(e, i, o, n, 0).add(s), r.id = a, r.clipPath = s, r.count = 0, r
                },
                text: function(t, e, i, o) {
                    var n, r = this,
                        a = !E && r.forExport,
                        s = {};
                    return !o || !r.allowHTML && r.forExport ? (s.x = Math.round(e || 0), i && (s.y = Math.round(i)), (t || 0 === t) && (s.text = t), n = r.createElement("text").attr(s), a && n.css({
                        position: "absolute"
                    }), o || (n.xSetter = function(t, e, i) {
                        var o, n, r = i.getElementsByTagName("tspan"),
                            a = i.getAttribute(e);
                        for (n = 0; n < r.length; n++)(o = r[n]).getAttribute(e) === a && o.setAttribute(e, t);
                        i.setAttribute(e, t)
                    }), n) : r.html(t, e, i)
                },
                fontMetrics: function(t, e) {
                    var i, o;
                    return t = t || e && e.style && e.style.fontSize || this.style && this.style.fontSize, t = /px/.test(t) ? D(t) : /em/.test(t) ? parseFloat(t) * (e ? this.fontMetrics(null, e.parentNode).f : 16) : 12, i = t < 24 ? t + 3 : Math.round(1.2 * t), o = Math.round(.8 * i), {
                        h: i,
                        b: o,
                        f: t
                    }
                },
                rotCorr: function(t, e, i) {
                    var o = t;
                    return e && i && (o = Math.max(o * Math.cos(e * d), 4)), {
                        x: -t / 3 * Math.sin(e * d),
                        y: o
                    }
                },
                label: function(i, o, n, r, a, s, l, h, d) {
                    var p, u, m, x, v, y, b, M, w, k, S, A, T, P = this,
                        L = P.g("button" !== d && "label"),
                        D = L.text = P.text("", 0, 0, l).attr({
                            zIndex: 1
                        }),
                        I = 0,
                        E = 3,
                        z = 0,
                        B = {},
                        R = /^url\((.*?)\)$/.test(r),
                        N = R;
                    d && L.addClass("highcharts-" + d), N = R, k = function() {
                        return (M || 0) % 2 / 2
                    }, S = function() {
                        var t, e = D.element.style,
                            i = {};
                        u = (void 0 === m || void 0 === x || b) && c(D.textStr) && D.getBBox(), L.width = (m || u.width || 0) + 2 * E + z, L.height = (x || u.height || 0) + 2 * E, w = E + P.fontMetrics(e && e.fontSize, D).b, N && (p || (L.box = p = P.symbols[r] || R ? P.symbol(r) : P.rect(), p.addClass(("button" === d ? "" : "highcharts-label-box") + (d ? " highcharts-" + d + "-box" : "")), p.add(L), t = k(), i.x = t, i.y = (h ? -w : 0) + t), i.width = Math.round(L.width), i.height = Math.round(L.height), p.attr(f(i, B)), B = {})
                    }, A = function() {
                        var t, e = z + E;
                        t = h ? 0 : w, c(m) && u && ("center" === b || "right" === b) && (e += {
                            center: .5,
                            right: 1
                        }[b] * (m - u.width)), e === D.x && t === D.y || (D.attr("x", e), void 0 !== t && D.attr("y", t)), D.x = e, D.y = t
                    }, T = function(t, e) {
                        p ? p.attr(t, e) : B[t] = e
                    }, L.onAdd = function() {
                        D.add(L), L.attr({
                            text: i || 0 === i ? i : "",
                            x: o,
                            y: n
                        }), p && c(a) && L.attr({
                            anchorX: a,
                            anchorY: s
                        })
                    }, L.widthSetter = function(e) {
                        m = t.isNumber(e) ? e : null
                    }, L.heightSetter = function(t) {
                        x = t
                    }, L["text-alignSetter"] = function(t) {
                        b = t
                    }, L.paddingSetter = function(t) {
                        c(t) && t !== E && (E = L.padding = t, A())
                    }, L.paddingLeftSetter = function(t) {
                        c(t) && t !== z && (z = t, A())
                    }, L.alignSetter = function(t) {
                        (t = {
                            left: 0,
                            center: .5,
                            right: 1
                        }[t]) !== I && (I = t, u && L.attr({
                            x: v
                        }))
                    }, L.textSetter = function(t) {
                        void 0 !== t && D.textSetter(t), S(), A()
                    }, L["stroke-widthSetter"] = function(t, e) {
                        t && (N = !0), M = this["stroke-width"] = t, T(e, t)
                    }, L.strokeSetter = L.fillSetter = L.rSetter = function(t, e) {
                        "fill" === e && t && (N = !0), T(e, t)
                    }, L.anchorXSetter = function(t, e) {
                        a = L.anchorX = t, T(e, Math.round(t) - k() - v)
                    }, L.anchorYSetter = function(t, e) {
                        s = L.anchorY = t, T(e, t - y)
                    }, L.xSetter = function(t) {
                        L.x = t, I && (t -= I * ((m || u.width) + 2 * E)), v = Math.round(t), L.attr("translateX", v)
                    }, L.ySetter = function(t) {
                        y = L.y = Math.round(t), L.attr("translateY", y)
                    };
                    var G = L.css;
                    return f(L, {
                        css: function(t) {
                            if (t) {
                                var e = {};
                                t = C(t), g(L.textProps, function(i) {
                                    void 0 !== t[i] && (e[i] = t[i], delete t[i])
                                }), D.css(e)
                            }
                            return G.call(L, t)
                        },
                        getBBox: function() {
                            return {
                                width: u.width + 2 * E,
                                height: u.height + 2 * E,
                                x: u.x - E,
                                y: u.y - E
                            }
                        },
                        shadow: function(t) {
                            return t && (S(), p && p.shadow(t)), L
                        },
                        destroy: function() {
                            O(L.element, "mouseenter"), O(L.element, "mouseleave"), D && (D = D.destroy()), p && (p = p.destroy()), e.prototype.destroy.call(L), L = P = S = A = T = null
                        }
                    })
                }
            }), t.Renderer = i
        }(e),
        function(t) {
            var e = t.attr,
                i = t.createElement,
                o = t.css,
                n = t.defined,
                r = t.each,
                a = t.extend,
                s = t.isFirefox,
                l = t.isMS,
                h = t.isWebKit,
                c = t.pInt,
                d = t.SVGElement,
                p = t.SVGRenderer,
                u = t.win,
                g = t.wrap;
            a(d.prototype, {
                htmlCss: function(t) {
                    var e = this,
                        i = e.element,
                        n = t && "SPAN" === i.tagName && t.width;
                    return n && (delete t.width, e.textWidth = n, e.updateTransform()), t && "ellipsis" === t.textOverflow && (t.whiteSpace = "nowrap", t.overflow = "hidden"), e.styles = a(e.styles, t), o(e.element, t), e
                },
                htmlGetBBox: function() {
                    var t = this.element;
                    return "text" === t.nodeName && (t.style.position = "absolute"), {
                        x: t.offsetLeft,
                        y: t.offsetTop,
                        width: t.offsetWidth,
                        height: t.offsetHeight
                    }
                },
                htmlUpdateTransform: function() {
                    if (this.added) {
                        var t = this,
                            e = t.renderer,
                            i = t.element,
                            a = t.translateX || 0,
                            s = t.translateY || 0,
                            l = t.x || 0,
                            d = t.y || 0,
                            p = t.textAlign || "left",
                            u = {
                                left: 0,
                                center: .5,
                                right: 1
                            }[p],
                            g = t.styles;
                        if (o(i, {
                                marginLeft: a,
                                marginTop: s
                            }), t.shadows && r(t.shadows, function(t) {
                                o(t, {
                                    marginLeft: a + 1,
                                    marginTop: s + 1
                                })
                            }), t.inverted && r(i.childNodes, function(t) {
                                e.invertChild(t, i)
                            }), "SPAN" === i.tagName) {
                            var f, m = t.rotation,
                                x = c(t.textWidth),
                                v = g && g.whiteSpace,
                                y = [m, p, i.innerHTML, t.textWidth, t.textAlign].join(",");
                            y !== t.cTT && (f = e.fontMetrics(i.style.fontSize).b, n(m) && t.setSpanRotation(m, u, f), o(i, {
                                width: "",
                                whiteSpace: v || "nowrap"
                            }), i.offsetWidth > x && /[ \-]/.test(i.textContent || i.innerText) && o(i, {
                                width: x + "px",
                                display: "block",
                                whiteSpace: v || "normal"
                            }), t.getSpanCorrection(i.offsetWidth, f, u, m, p)), o(i, {
                                left: l + (t.xCorr || 0) + "px",
                                top: d + (t.yCorr || 0) + "px"
                            }), h && (f = i.offsetHeight), t.cTT = y
                        }
                    } else this.alignOnAdd = !0
                },
                setSpanRotation: function(t, e, i) {
                    var n = {},
                        r = l ? "-ms-transform" : h ? "-webkit-transform" : s ? "MozTransform" : u.opera ? "-o-transform" : "";
                    n[r] = n.transform = "rotate(" + t + "deg)", n[r + (s ? "Origin" : "-origin")] = n.transformOrigin = 100 * e + "% " + i + "px", o(this.element, n)
                },
                getSpanCorrection: function(t, e, i) {
                    this.xCorr = -t * i, this.yCorr = -e
                }
            }), a(p.prototype, {
                html: function(t, o, n) {
                    var s = this.createElement("span"),
                        l = s.element,
                        h = s.renderer,
                        c = h.isSVG,
                        d = function(t, e) {
                            r(["opacity", "visibility"], function(i) {
                                g(t, i + "Setter", function(t, i, o, n) {
                                    t.call(this, i, o, n), e[o] = i
                                })
                            })
                        };
                    return s.textSetter = function(t) {
                        t !== l.innerHTML && delete this.bBox, l.innerHTML = this.textStr = t, s.htmlUpdateTransform()
                    }, c && d(s, s.element.style), s.xSetter = s.ySetter = s.alignSetter = s.rotationSetter = function(t, e) {
                        "align" === e && (e = "textAlign"), s[e] = t, s.htmlUpdateTransform()
                    }, s.attr({
                        text: t,
                        x: Math.round(o),
                        y: Math.round(n)
                    }).css({
                        fontFamily: this.style.fontFamily,
                        fontSize: this.style.fontSize,
                        position: "absolute"
                    }), l.style.whiteSpace = "nowrap", s.css = s.htmlCss, c && (s.add = function(t) {
                        var o, n, c = h.box.parentNode,
                            p = [];
                        if (this.parentGroup = t, t) {
                            if (!(o = t.div)) {
                                for (n = t; n;) p.push(n), n = n.parentGroup;
                                r(p.reverse(), function(t) {
                                    var n, r = e(t.element, "class");
                                    r && (r = {
                                        className: r
                                    }), o = t.div = t.div || i("div", r, {
                                        position: "absolute",
                                        left: (t.translateX || 0) + "px",
                                        top: (t.translateY || 0) + "px",
                                        display: t.display,
                                        opacity: t.opacity,
                                        pointerEvents: t.styles && t.styles.pointerEvents
                                    }, o || c), n = o.style, a(t, {
                                        on: function() {
                                            return s.on.apply({
                                                element: p[0].div
                                            }, arguments), t
                                        },
                                        translateXSetter: function(e, i) {
                                            n.left = e + "px", t[i] = e, t.doTransform = !0
                                        },
                                        translateYSetter: function(e, i) {
                                            n.top = e + "px", t[i] = e, t.doTransform = !0
                                        }
                                    }), d(t, n)
                                })
                            }
                        } else o = c;
                        return o.appendChild(l), s.added = !0, s.alignOnAdd && s.htmlUpdateTransform(), s
                    }), s
                }
            })
        }(e),
        function(t) {
            var e, i, o, n = t.createElement,
                r = t.css,
                a = t.defined,
                s = t.deg2rad,
                l = t.discardElement,
                h = t.doc,
                c = t.each,
                d = t.erase,
                p = t.extend,
                u = t.extendClass,
                g = t.isArray,
                f = t.isNumber,
                m = t.isObject,
                x = t.merge,
                v = t.noop,
                y = t.pick,
                b = t.pInt,
                M = t.svg,
                w = t.SVGElement,
                k = t.SVGRenderer,
                S = t.win;
            M || ((o = {
                docMode8: h && 8 === h.documentMode,
                init: function(t, e) {
                    var i = this,
                        o = ["<", e, ' filled="f" stroked="f"'],
                        r = ["position: ", "absolute", ";"],
                        a = "div" === e;
                    ("shape" === e || a) && r.push("left:0;top:0;width:1px;height:1px;"), r.push("visibility: ", a ? "hidden" : "visible"), o.push(' style="', r.join(""), '"/>'), e && (o = a || "span" === e || "img" === e ? o.join("") : t.prepVML(o), i.element = n(o)), i.renderer = t
                },
                add: function(t) {
                    var e = this,
                        i = e.renderer,
                        o = e.element,
                        n = i.box,
                        r = t && t.inverted,
                        a = t ? t.element || t : n;
                    return t && (this.parentGroup = t), r && i.invertChild(o, a), a.appendChild(o), e.added = !0, e.alignOnAdd && !e.deferUpdateTransform && e.updateTransform(), e.onAdd && e.onAdd(), this.className && this.attr("class", this.className), e
                },
                updateTransform: w.prototype.htmlUpdateTransform,
                setSpanRotation: function() {
                    var t = this.rotation,
                        e = Math.cos(t * s),
                        i = Math.sin(t * s);
                    r(this.element, {
                        filter: t ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", e, ", M12=", -i, ", M21=", i, ", M22=", e, ", sizingMethod='auto expand')"].join("") : "none"
                    })
                },
                getSpanCorrection: function(t, e, i, o, n) {
                    var a, l = o ? Math.cos(o * s) : 1,
                        h = o ? Math.sin(o * s) : 0,
                        c = y(this.elemHeight, this.element.offsetHeight),
                        d = n && "left" !== n;
                    this.xCorr = l < 0 && -t, this.yCorr = h < 0 && -c, a = l * h < 0, this.xCorr += h * e * (a ? 1 - i : i), this.yCorr -= l * e * (o ? a ? i : 1 - i : 1), d && (this.xCorr -= t * i * (l < 0 ? -1 : 1), o && (this.yCorr -= c * i * (h < 0 ? -1 : 1)), r(this.element, {
                        textAlign: n
                    }))
                },
                pathToVML: function(t) {
                    for (var e = t.length, i = []; e--;) f(t[e]) ? i[e] = Math.round(10 * t[e]) - 5 : "Z" === t[e] ? i[e] = "x" : (i[e] = t[e], !t.isArc || "wa" !== t[e] && "at" !== t[e] || (i[e + 5] === i[e + 7] && (i[e + 7] += t[e + 7] > t[e + 5] ? 1 : -1), i[e + 6] === i[e + 8] && (i[e + 8] += t[e + 8] > t[e + 6] ? 1 : -1)));
                    return i.join(" ") || "x"
                },
                clip: function(t) {
                    var e, i, o = this;
                    return t ? (e = t.members, d(e, o), e.push(o), o.destroyClip = function() {
                        d(e, o)
                    }, i = t.getCSS(o)) : (o.destroyClip && o.destroyClip(), i = {
                        clip: o.docMode8 ? "inherit" : "rect(auto)"
                    }), o.css(i)
                },
                css: w.prototype.htmlCss,
                safeRemoveChild: function(t) {
                    t.parentNode && l(t)
                },
                destroy: function() {
                    return this.destroyClip && this.destroyClip(), w.prototype.destroy.apply(this)
                },
                on: function(t, e) {
                    return this.element["on" + t] = function() {
                        var t = S.event;
                        t.target = t.srcElement, e(t)
                    }, this
                },
                cutOffPath: function(t, e) {
                    var i;
                    return t = t.split(/[ ,]/), 9 !== (i = t.length) && 11 !== i || (t[i - 4] = t[i - 2] = b(t[i - 2]) - 10 * e), t.join(" ")
                },
                shadow: function(t, e, i) {
                    var o, r, a, s, l, h, c, d = [],
                        p = this.element,
                        u = this.renderer,
                        g = p.style,
                        f = p.path;
                    if (f && "string" != typeof f.value && (f = "x"), l = f, t) {
                        for (h = y(t.width, 3), c = (t.opacity || .15) / h, o = 1; o <= 3; o++) s = 2 * h + 1 - 2 * o, i && (l = this.cutOffPath(f.value, s + .5)), a = ['<shape isShadow="true" strokeweight="', s, '" filled="false" path="', l, '" coordsize="10 10" style="', p.style.cssText, '" />'], r = n(u.prepVML(a), null, {
                            left: b(g.left) + y(t.offsetX, 1),
                            top: b(g.top) + y(t.offsetY, 1)
                        }), i && (r.cutOff = s + 1), a = ['<stroke color="', t.color || "#000000", '" opacity="', c * o, '"/>'], n(u.prepVML(a), null, null, r), e ? e.element.appendChild(r) : p.parentNode.insertBefore(r, p), d.push(r);
                        this.shadows = d
                    }
                    return this
                },
                updateShadows: v,
                setAttr: function(t, e) {
                    this.docMode8 ? this.element[t] = e : this.element.setAttribute(t, e)
                },
                classSetter: function(t) {
                    (this.added ? this.element : this).className = t
                },
                dashstyleSetter: function(t, e, i) {
                    (i.getElementsByTagName("stroke")[0] || n(this.renderer.prepVML(["<stroke/>"]), null, null, i))[e] = t || "solid", this[e] = t
                },
                dSetter: function(t, e, i) {
                    var o, n = this.shadows;
                    if (t = t || [], this.d = t.join && t.join(" "), i.path = t = this.pathToVML(t), n)
                        for (o = n.length; o--;) n[o].path = n[o].cutOff ? this.cutOffPath(t, n[o].cutOff) : t;
                    this.setAttr(e, t)
                },
                fillSetter: function(t, e, i) {
                    var o = i.nodeName;
                    "SPAN" === o ? i.style.color = t : "IMG" !== o && (i.filled = "none" !== t, this.setAttr("fillcolor", this.renderer.color(t, i, e, this)))
                },
                "fill-opacitySetter": function(t, e, i) {
                    n(this.renderer.prepVML(["<", e.split("-")[0], ' opacity="', t, '"/>']), null, null, i)
                },
                opacitySetter: v,
                rotationSetter: function(t, e, i) {
                    var o = i.style;
                    this[e] = o[e] = t, o.left = -Math.round(Math.sin(t * s) + 1) + "px", o.top = Math.round(Math.cos(t * s)) + "px"
                },
                strokeSetter: function(t, e, i) {
                    this.setAttr("strokecolor", this.renderer.color(t, i, e, this))
                },
                "stroke-widthSetter": function(t, e, i) {
                    i.stroked = !!t, this[e] = t, f(t) && (t += "px"), this.setAttr("strokeweight", t)
                },
                titleSetter: function(t, e) {
                    this.setAttr(e, t)
                },
                visibilitySetter: function(t, e, i) {
                    "inherit" === t && (t = "visible"), this.shadows && c(this.shadows, function(i) {
                        i.style[e] = t
                    }), "DIV" === i.nodeName && (t = "hidden" === t ? "-999em" : 0, this.docMode8 || (i.style[e] = t ? "visible" : "hidden"), e = "top"), i.style[e] = t
                },
                xSetter: function(t, e, i) {
                    this[e] = t, "x" === e ? e = "left" : "y" === e && (e = "top"), this.updateClipping ? (this[e] = t, this.updateClipping()) : i.style[e] = t
                },
                zIndexSetter: function(t, e, i) {
                    i.style[e] = t
                }
            })["stroke-opacitySetter"] = o["fill-opacitySetter"], t.VMLElement = o = u(w, o), o.prototype.ySetter = o.prototype.widthSetter = o.prototype.heightSetter = o.prototype.xSetter, i = {
                Element: o,
                isIE8: S.navigator.userAgent.indexOf("MSIE 8.0") > -1,
                init: function(t, e, i) {
                    var o, n, r, a = this;
                    if (a.alignedObjects = [], o = a.createElement("div").css({
                            position: "relative"
                        }), n = o.element, t.appendChild(o.element), a.isVML = !0, a.box = n, a.boxWrapper = o, a.gradients = {}, a.cache = {}, a.cacheKeys = [], a.imgCount = 0, a.setSize(e, i, !1), !h.namespaces.hcv) {
                        h.namespaces.add("hcv", "urn:schemas-microsoft-com:vml"), r = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } ";
                        try {
                            h.createStyleSheet().cssText = r
                        } catch (t) {
                            h.styleSheets[0].cssText += r
                        }
                    }
                },
                isHidden: function() {
                    return !this.box.offsetWidth
                },
                clipRect: function(t, e, i, o) {
                    var n = this.createElement(),
                        r = m(t);
                    return p(n, {
                        members: [],
                        count: 0,
                        left: (r ? t.x : t) + 1,
                        top: (r ? t.y : e) + 1,
                        width: (r ? t.width : i) - 1,
                        height: (r ? t.height : o) - 1,
                        getCSS: function(t) {
                            var e = t.element,
                                i = e.nodeName,
                                o = "shape" === i,
                                n = t.inverted,
                                r = this,
                                a = r.top - (o ? e.offsetTop : 0),
                                s = r.left,
                                l = s + r.width,
                                h = a + r.height,
                                c = {
                                    clip: "rect(" + Math.round(n ? s : a) + "px," + Math.round(n ? h : l) + "px," + Math.round(n ? l : h) + "px," + Math.round(n ? a : s) + "px)"
                                };
                            return !n && t.docMode8 && "DIV" === i && p(c, {
                                width: l + "px",
                                height: h + "px"
                            }), c
                        },
                        updateClipping: function() {
                            c(n.members, function(t) {
                                t.element && t.css(n.getCSS(t))
                            })
                        }
                    })
                },
                color: function(e, i, o, r) {
                    var a, s, l, h = this,
                        d = /^rgba/,
                        p = "none";
                    if (e && e.linearGradient ? l = "gradient" : e && e.radialGradient && (l = "pattern"), l) {
                        var u, g, f, m, x, v, y, b, M, w, k, S, A = e.linearGradient || e.radialGradient,
                            C = "",
                            T = e.stops,
                            P = [],
                            L = function() {
                                s = ['<fill colors="' + P.join(",") + '" opacity="', b, '" o:opacity2="', y, '" type="', l, '" ', C, 'focus="100%" method="any" />'], n(h.prepVML(s), null, null, i)
                            };
                        if (k = T[0], S = T[T.length - 1], k[0] > 0 && T.unshift([0, k[1]]), S[0] < 1 && T.push([1, S[1]]), c(T, function(e, i) {
                                d.test(e[1]) ? (a = t.color(e[1]), u = a.get("rgb"), g = a.get("a")) : (u = e[1], g = 1), P.push(100 * e[0] + "% " + u), i ? (b = g, M = u) : (y = g, w = u)
                            }), "fill" === o)
                            if ("gradient" === l) f = A.x1 || A[0] || 0, m = A.y1 || A[1] || 0, x = A.x2 || A[2] || 0, v = A.y2 || A[3] || 0, C = 'angle="' + (90 - 180 * Math.atan((v - m) / (x - f)) / Math.PI) + '"', L();
                            else {
                                var D, O = A.r,
                                    I = 2 * O,
                                    E = 2 * O,
                                    z = A.cx,
                                    B = A.cy,
                                    R = i.radialReference,
                                    N = function() {
                                        R && (D = r.getBBox(), z += (R[0] - D.x) / D.width - .5, B += (R[1] - D.y) / D.height - .5, I *= R[2] / D.width, E *= R[2] / D.height), C = 'src="' + t.getOptions().global.VMLRadialGradientURL + '" size="' + I + "," + E + '" origin="0.5,0.5" position="' + z + "," + B + '" color2="' + w + '" ', L()
                                    };
                                r.added ? N() : r.onAdd = N, p = M
                            } else p = u
                    } else if (d.test(e) && "IMG" !== i.tagName) a = t.color(e), r[o + "-opacitySetter"](a.get("a"), o, i), p = a.get("rgb");
                    else {
                        var G = i.getElementsByTagName(o);
                        G.length && (G[0].opacity = 1, G[0].type = "solid"), p = e
                    }
                    return p
                },
                prepVML: function(t) {
                    var e = "display:inline-block;behavior:url(#default#VML);",
                        i = this.isIE8;
                    return t = t.join(""), t = i ? -1 === (t = t.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />')).indexOf('style="') ? t.replace("/>", ' style="' + e + '" />') : t.replace('style="', 'style="' + e) : t.replace("<", "<hcv:")
                },
                text: k.prototype.html,
                path: function(t) {
                    var e = {
                        coordsize: "10 10"
                    };
                    return g(t) ? e.d = t : m(t) && p(e, t), this.createElement("shape").attr(e)
                },
                circle: function(t, e, i) {
                    var o = this.symbol("circle");
                    return m(t) && (i = t.r, e = t.y, t = t.x), o.isCircle = !0, o.r = i, o.attr({
                        x: t,
                        y: e
                    })
                },
                g: function(t) {
                    var e;
                    return t && (e = {
                        className: "highcharts-" + t,
                        class: "highcharts-" + t
                    }), this.createElement("div").attr(e)
                },
                image: function(t, e, i, o, n) {
                    var r = this.createElement("img").attr({
                        src: t
                    });
                    return arguments.length > 1 && r.attr({
                        x: e,
                        y: i,
                        width: o,
                        height: n
                    }), r
                },
                createElement: function(t) {
                    return "rect" === t ? this.symbol(t) : k.prototype.createElement.call(this, t)
                },
                invertChild: function(t, e) {
                    var i = this,
                        o = e.style,
                        n = "IMG" === t.tagName && t.style;
                    r(t, {
                        flip: "x",
                        left: b(o.width) - (n ? b(n.top) : 1),
                        top: b(o.height) - (n ? b(n.left) : 1),
                        rotation: -90
                    }), c(t.childNodes, function(e) {
                        i.invertChild(e, t)
                    })
                },
                symbols: {
                    arc: function(t, e, i, o, n) {
                        var r, a = n.start,
                            s = n.end,
                            l = n.r || i || o,
                            h = n.innerR,
                            c = Math.cos(a),
                            d = Math.sin(a),
                            p = Math.cos(s),
                            u = Math.sin(s);
                        return s - a == 0 ? ["x"] : (r = ["wa", t - l, e - l, t + l, e + l, t + l * c, e + l * d, t + l * p, e + l * u], n.open && !h && r.push("e", "M", t, e), r.push("at", t - h, e - h, t + h, e + h, t + h * p, e + h * u, t + h * c, e + h * d, "x", "e"), r.isArc = !0, r)
                    },
                    circle: function(t, e, i, o, n) {
                        return n && a(n.r) && (i = o = 2 * n.r), n && n.isCircle && (t -= i / 2, e -= o / 2), ["wa", t, e, t + i, e + o, t + i, e + o / 2, t + i, e + o / 2, "e"]
                    },
                    rect: function(t, e, i, o, n) {
                        return k.prototype.symbols[a(n) && n.r ? "callout" : "square"].call(0, t, e, i, o, n)
                    }
                }
            }, t.VMLRenderer = e = function() {
                this.init.apply(this, arguments)
            }, e.prototype = x(k.prototype, i), t.Renderer = e), k.prototype.measureSpanWidth = function(t, e) {
                var i, o = h.createElement("span"),
                    n = h.createTextNode(t);
                return o.appendChild(n), r(o, e), this.box.appendChild(o), i = o.offsetWidth, l(o), i
            }
        }(e),
        function(t) {
            var e = t.correctFloat,
                i = t.defined,
                o = t.destroyObjectProperties,
                n = t.isNumber,
                r = t.merge,
                a = t.pick,
                s = t.deg2rad;
            t.Tick = function(t, e, i, o) {
                this.axis = t, this.pos = e, this.type = i || "", this.isNew = !0, this.isNewLabel = !0, i || o || this.addLabel()
            }, t.Tick.prototype = {
                addLabel: function() {
                    var t, o, n = this,
                        s = n.axis,
                        l = s.options,
                        h = s.chart,
                        c = s.categories,
                        d = s.names,
                        p = n.pos,
                        u = l.labels,
                        g = s.tickPositions,
                        f = p === g[0],
                        m = p === g[g.length - 1],
                        x = c ? a(c[p], d[p], p) : p,
                        v = n.label,
                        y = g.info;
                    s.isDatetimeAxis && y && (o = l.dateTimeLabelFormats[y.higherRanks[p] || y.unitName]), n.isFirst = f, n.isLast = m, t = s.labelFormatter.call({
                        axis: s,
                        chart: h,
                        isFirst: f,
                        isLast: m,
                        dateTimeLabelFormat: o,
                        value: s.isLog ? e(s.lin2log(x)) : x
                    }), i(v) ? v && v.attr({
                        text: t
                    }) : (n.label = v = i(t) && u.enabled ? h.renderer.text(t, 0, 0, u.useHTML).css(r(u.style)).add(s.labelGroup) : null, n.labelLength = v && v.getBBox().width, n.rotation = 0)
                },
                getLabelSize: function() {
                    return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
                },
                handleOverflow: function(t) {
                    var e, i, o = this.axis,
                        n = t.x,
                        r = o.chart.chartWidth,
                        l = o.chart.spacing,
                        h = a(o.labelLeft, Math.min(o.pos, l[3])),
                        c = a(o.labelRight, Math.max(o.pos + o.len, r - l[1])),
                        d = this.label,
                        p = this.rotation,
                        u = {
                            left: 0,
                            center: .5,
                            right: 1
                        }[o.labelAlign],
                        g = d.getBBox().width,
                        f = o.getSlotWidth(),
                        m = f,
                        x = u,
                        v = 1,
                        y = {};
                    p ? p < 0 && n - u * g < h ? i = Math.round(n / Math.cos(p * s) - h) : p > 0 && n + u * g > c && (i = Math.round((r - n) / Math.cos(p * s))) : (e = n + (1 - u) * g, n - u * g < h ? m = t.x + m * (1 - u) - h : e > c && (m = c - t.x + m * u, v = -1), (m = Math.min(f, m)) < f && "center" === o.labelAlign && (t.x += v * (f - m - x * (f - Math.min(g, m)))), (g > m || o.autoRotation && (d.styles || {}).width) && (i = m)), i && (y.width = i, (o.options.labels.style || {}).textOverflow || (y.textOverflow = "ellipsis"), d.css(y))
                },
                getPosition: function(t, e, i, o) {
                    var n = this.axis,
                        r = n.chart,
                        a = o && r.oldChartHeight || r.chartHeight;
                    return {
                        x: t ? n.translate(e + i, null, null, o) + n.transB : n.left + n.offset + (n.opposite ? (o && r.oldChartWidth || r.chartWidth) - n.right - n.left : 0),
                        y: t ? a - n.bottom + n.offset - (n.opposite ? n.height : 0) : a - n.translate(e + i, null, null, o) - n.transB
                    }
                },
                getLabelPosition: function(t, e, o, n, r, a, l, h) {
                    var c, d = this.axis,
                        p = d.transA,
                        u = d.reversed,
                        g = d.staggerLines,
                        f = d.tickRotCorr || {
                            x: 0,
                            y: 0
                        },
                        m = r.y;
                    return i(m) || (m = 0 === d.side ? o.rotation ? -8 : -o.getBBox().height : 2 === d.side ? f.y + 8 : Math.cos(o.rotation * s) * (f.y - o.getBBox(!1, 0).height / 2)), t = t + r.x + f.x - (a && n ? a * p * (u ? -1 : 1) : 0), e = e + m - (a && !n ? a * p * (u ? 1 : -1) : 0), g && (c = l / (h || 1) % g, d.opposite && (c = g - c - 1), e += c * (d.labelOffset / g)), {
                        x: t,
                        y: Math.round(e)
                    }
                },
                getMarkPath: function(t, e, i, o, n, r) {
                    return r.crispLine(["M", t, e, "L", t + (n ? 0 : -i), e + (n ? i : 0)], o)
                },
                renderGridLine: function(t, e, i) {
                    var o, n = this,
                        r = n.axis,
                        a = r.options,
                        s = n.gridLine,
                        l = {},
                        h = n.pos,
                        c = n.type,
                        d = r.tickmarkOffset,
                        p = r.chart.renderer,
                        u = c ? c + "Grid" : "grid",
                        g = a[u + "LineWidth"],
                        f = a[u + "LineColor"],
                        m = a[u + "LineDashStyle"];
                    s || (l.stroke = f, l["stroke-width"] = g, m && (l.dashstyle = m), c || (l.zIndex = 1), t && (l.opacity = 0), n.gridLine = s = p.path().attr(l).addClass("highcharts-" + (c ? c + "-" : "") + "grid-line").add(r.gridGroup)), !t && s && (o = r.getPlotLinePath(h + d, s.strokeWidth() * i, t, !0)) && s[n.isNew ? "attr" : "animate"]({
                        d: o,
                        opacity: e
                    })
                },
                renderMark: function(t, e, i) {
                    var o = this,
                        n = o.axis,
                        r = n.options,
                        s = n.chart.renderer,
                        l = o.type,
                        h = l ? l + "Tick" : "tick",
                        c = n.tickSize(h),
                        d = o.mark,
                        p = !d,
                        u = t.x,
                        g = t.y,
                        f = a(r[h + "Width"], !l && n.isXAxis ? 1 : 0),
                        m = r[h + "Color"];
                    c && (n.opposite && (c[0] = -c[0]), p && (o.mark = d = s.path().addClass("highcharts-" + (l ? l + "-" : "") + "tick").add(n.axisGroup), d.attr({
                        stroke: m,
                        "stroke-width": f
                    })), d[p ? "attr" : "animate"]({
                        d: o.getMarkPath(u, g, c[0], d.strokeWidth() * i, n.horiz, s),
                        opacity: e
                    }))
                },
                renderLabel: function(t, e, i, o) {
                    var r = this,
                        s = r.axis,
                        l = s.horiz,
                        h = s.options,
                        c = r.label,
                        d = h.labels,
                        p = d.step,
                        u = s.tickmarkOffset,
                        g = !0,
                        f = t.x,
                        m = t.y;
                    c && n(f) && (c.xy = t = r.getLabelPosition(f, m, c, l, d, u, o, p), r.isFirst && !r.isLast && !a(h.showFirstLabel, 1) || r.isLast && !r.isFirst && !a(h.showLastLabel, 1) ? g = !1 : !l || s.isRadial || d.step || d.rotation || e || 0 === i || r.handleOverflow(t), p && o % p && (g = !1), g && n(t.y) ? (t.opacity = i, c[r.isNewLabel ? "attr" : "animate"](t), r.isNewLabel = !1) : (c.attr("y", -9999), r.isNewLabel = !0), r.isNew = !1)
                },
                render: function(t, e, i) {
                    var o = this,
                        n = o.axis,
                        r = n.horiz,
                        s = o.pos,
                        l = n.tickmarkOffset,
                        h = o.getPosition(r, s, l, e),
                        c = h.x,
                        d = h.y,
                        p = r && c === n.pos + n.len || !r && d === n.pos ? -1 : 1;
                    i = a(i, 1), this.isActive = !0, this.renderGridLine(e, i, p), this.renderMark(h, i, p), this.renderLabel(h, e, i, t)
                },
                destroy: function() {
                    o(this, this.axis)
                }
            }
        }(e),
        function(t, e) {
            var i = t.arrayMax,
                o = t.arrayMin,
                n = t.defined,
                r = t.destroyObjectProperties,
                a = t.each,
                s = t.erase,
                l = t.merge,
                h = t.pick;
            t.PlotLineOrBand = function(t, e) {
                this.axis = t, e && (this.options = e, this.id = e.id)
            }, t.PlotLineOrBand.prototype = {
                render: function() {
                    var e, i = this,
                        o = i.axis,
                        r = o.horiz,
                        a = i.options,
                        s = a.label,
                        c = i.label,
                        d = a.to,
                        p = a.from,
                        u = a.value,
                        g = n(p) && n(d),
                        f = n(u),
                        m = i.svgElem,
                        x = !m,
                        v = [],
                        y = a.color,
                        b = h(a.zIndex, 0),
                        M = a.events,
                        w = {
                            class: "highcharts-plot-" + (g ? "band " : "line ") + (a.className || "")
                        },
                        k = {},
                        S = o.chart.renderer,
                        A = g ? "bands" : "lines",
                        C = o.log2lin;
                    if (o.isLog && (p = C(p), d = C(d), u = C(u)), f ? (w = {
                            stroke: y,
                            "stroke-width": a.width
                        }, a.dashStyle && (w.dashstyle = a.dashStyle)) : g && (y && (w.fill = y), a.borderWidth && (w.stroke = a.borderColor, w["stroke-width"] = a.borderWidth)), k.zIndex = b, A += "-" + b, (e = o.plotLinesAndBandsGroups[A]) || (o.plotLinesAndBandsGroups[A] = e = S.g("plot-" + A).attr(k).add()), x && (i.svgElem = m = S.path().attr(w).add(e)), f) v = o.getPlotLinePath(u, m.strokeWidth());
                    else {
                        if (!g) return;
                        v = o.getPlotBandPath(p, d, a)
                    }
                    return x && v && v.length ? (m.attr({
                        d: v
                    }), M && t.objectEach(M, function(t, e) {
                        m.on(e, function(t) {
                            M[e].apply(i, [t])
                        })
                    })) : m && (v ? (m.show(), m.animate({
                        d: v
                    })) : (m.hide(), c && (i.label = c = c.destroy()))), s && n(s.text) && v && v.length && o.width > 0 && o.height > 0 && !v.flat ? (s = l({
                        align: r && g && "center",
                        x: r ? !g && 4 : 10,
                        verticalAlign: !r && g && "middle",
                        y: r ? g ? 16 : 10 : g ? 6 : -4,
                        rotation: r && !g && 90
                    }, s), this.renderLabel(s, v, g, b)) : c && c.hide(), i
                },
                renderLabel: function(t, e, n, r) {
                    var a, s, l, h, c, d = this,
                        p = d.label,
                        u = d.axis.chart.renderer;
                    p || ((a = {
                        align: t.textAlign || t.align,
                        rotation: t.rotation,
                        class: "highcharts-plot-" + (n ? "band" : "line") + "-label " + (t.className || "")
                    }).zIndex = r, d.label = p = u.text(t.text, 0, 0, t.useHTML).attr(a).add(), p.css(t.style)), s = [e[1], e[4], n ? e[6] : e[1]], l = [e[2], e[5], n ? e[7] : e[2]], h = o(s), c = o(l), p.align(t, !1, {
                        x: h,
                        y: c,
                        width: i(s) - h,
                        height: i(l) - c
                    }), p.show()
                },
                destroy: function() {
                    s(this.axis.plotLinesAndBands, this), delete this.axis, r(this)
                }
            }, t.extend(e.prototype, {
                getPlotBandPath: function(t, e) {
                    var i = this.getPlotLinePath(e, null, null, !0),
                        o = this.getPlotLinePath(t, null, null, !0),
                        n = this.horiz,
                        r = 1,
                        a = t < this.min && e < this.min || t > this.max && e > this.max;
                    return o && i ? (a && (o.flat = o.toString() === i.toString(), r = 0), o.push(n && i[4] === o[4] ? i[4] + r : i[4], n || i[5] !== o[5] ? i[5] : i[5] + r, n && i[1] === o[1] ? i[1] + r : i[1], n || i[2] !== o[2] ? i[2] : i[2] + r)) : o = null, o
                },
                addPlotBand: function(t) {
                    return this.addPlotBandOrLine(t, "plotBands")
                },
                addPlotLine: function(t) {
                    return this.addPlotBandOrLine(t, "plotLines")
                },
                addPlotBandOrLine: function(e, i) {
                    var o = new t.PlotLineOrBand(this, e).render(),
                        n = this.userOptions;
                    return o && (i && (n[i] = n[i] || [], n[i].push(e)), this.plotLinesAndBands.push(o)), o
                },
                removePlotBandOrLine: function(t) {
                    for (var e = this.plotLinesAndBands, i = this.options, o = this.userOptions, n = e.length; n--;) e[n].id === t && e[n].destroy();
                    a([i.plotLines || [], o.plotLines || [], i.plotBands || [], o.plotBands || []], function(e) {
                        for (n = e.length; n--;) e[n].id === t && s(e, e[n])
                    })
                },
                removePlotBand: function(t) {
                    this.removePlotBandOrLine(t)
                },
                removePlotLine: function(t) {
                    this.removePlotBandOrLine(t)
                }
            })
        }(e, function(t) {
            var e = t.addEvent,
                i = t.animObject,
                o = t.arrayMax,
                n = t.arrayMin,
                r = t.color,
                a = t.correctFloat,
                s = t.defaultOptions,
                l = t.defined,
                h = t.deg2rad,
                c = t.destroyObjectProperties,
                d = t.each,
                p = t.extend,
                u = t.fireEvent,
                g = t.format,
                f = t.getMagnitude,
                m = t.grep,
                x = t.inArray,
                v = t.isArray,
                y = t.isNumber,
                b = t.isString,
                M = t.merge,
                w = t.normalizeTickInterval,
                k = t.objectEach,
                S = t.pick,
                A = t.removeEvent,
                C = t.splat,
                T = t.syncTimeout,
                P = t.Tick,
                L = function() {
                    this.init.apply(this, arguments)
                };
            return t.extend(L.prototype, {
                defaultOptions: {
                    dateTimeLabelFormats: {
                        millisecond: "%H:%M:%S.%L",
                        second: "%H:%M:%S",
                        minute: "%H:%M",
                        hour: "%H:%M",
                        day: "%e. %b",
                        week: "%e. %b",
                        month: "%b '%y",
                        year: "%Y"
                    },
                    endOnTick: !1,
                    labels: {
                        enabled: !0,
                        style: {
                            color: "#666666",
                            cursor: "default",
                            fontSize: "11px"
                        },
                        x: 0
                    },
                    minPadding: .01,
                    maxPadding: .01,
                    minorTickLength: 2,
                    minorTickPosition: "outside",
                    startOfWeek: 1,
                    startOnTick: !1,
                    tickLength: 10,
                    tickmarkPlacement: "between",
                    tickPixelInterval: 100,
                    tickPosition: "outside",
                    title: {
                        align: "middle",
                        style: {
                            color: "#666666"
                        }
                    },
                    type: "linear",
                    minorGridLineColor: "#f2f2f2",
                    minorGridLineWidth: 1,
                    minorTickColor: "#999999",
                    lineColor: "#ccd6eb",
                    lineWidth: 1,
                    gridLineColor: "#e6e6e6",
                    tickColor: "#ccd6eb"
                },
                defaultYAxisOptions: {
                    endOnTick: !0,
                    tickPixelInterval: 72,
                    showLastLabel: !0,
                    labels: {
                        x: -8
                    },
                    maxPadding: .05,
                    minPadding: .05,
                    startOnTick: !0,
                    title: {
                        rotation: 270,
                        text: "Values"
                    },
                    stackLabels: {
                        enabled: !1,
                        formatter: function() {
                            return t.numberFormat(this.total, -1)
                        },
                        style: {
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#000000",
                            textOutline: "1px contrast"
                        }
                    },
                    gridLineWidth: 1,
                    lineWidth: 0
                },
                defaultLeftAxisOptions: {
                    labels: {
                        x: -15
                    },
                    title: {
                        rotation: 270
                    }
                },
                defaultRightAxisOptions: {
                    labels: {
                        x: 15
                    },
                    title: {
                        rotation: 90
                    }
                },
                defaultBottomAxisOptions: {
                    labels: {
                        autoRotation: [-45],
                        x: 0
                    },
                    title: {
                        rotation: 0
                    }
                },
                defaultTopAxisOptions: {
                    labels: {
                        autoRotation: [-45],
                        x: 0
                    },
                    title: {
                        rotation: 0
                    }
                },
                init: function(t, i) {
                    var o = i.isX,
                        n = this;
                    n.chart = t, n.horiz = t.inverted && !n.isZAxis ? !o : o, n.isXAxis = o, n.coll = n.coll || (o ? "xAxis" : "yAxis"), n.opposite = i.opposite, n.side = i.side || (n.horiz ? n.opposite ? 0 : 2 : n.opposite ? 1 : 3), n.setOptions(i);
                    var r = this.options,
                        a = r.type,
                        s = "datetime" === a;
                    n.labelFormatter = r.labels.formatter || n.defaultLabelFormatter, n.userOptions = i, n.minPixelPadding = 0, n.reversed = r.reversed, n.visible = !1 !== r.visible, n.zoomEnabled = !1 !== r.zoomEnabled, n.hasNames = "category" === a || !0 === r.categories, n.categories = r.categories || n.hasNames, n.names = n.names || [], n.plotLinesAndBandsGroups = {}, n.isLog = "logarithmic" === a, n.isDatetimeAxis = s, n.positiveValuesOnly = n.isLog && !n.allowNegativeLog, n.isLinked = l(r.linkedTo), n.ticks = {}, n.labelEdge = [], n.minorTicks = {}, n.plotLinesAndBands = [], n.alternateBands = {}, n.len = 0, n.minRange = n.userMinRange = r.minRange || r.maxZoom, n.range = r.range, n.offset = r.offset || 0, n.stacks = {}, n.oldStacks = {}, n.stacksTouched = 0, n.max = null, n.min = null, n.crosshair = S(r.crosshair, C(t.options.tooltip.crosshairs)[o ? 0 : 1], !1);
                    var h = n.options.events; - 1 === x(n, t.axes) && (o ? t.axes.splice(t.xAxis.length, 0, n) : t.axes.push(n), t[n.coll].push(n)), n.series = n.series || [], t.inverted && !n.isZAxis && o && void 0 === n.reversed && (n.reversed = !0), k(h, function(t, i) {
                        e(n, i, t)
                    }), n.lin2log = r.linearToLogConverter || n.lin2log, n.isLog && (n.val2lin = n.log2lin, n.lin2val = n.lin2log)
                },
                setOptions: function(t) {
                    this.options = M(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], M(s[this.coll], t))
                },
                defaultLabelFormatter: function() {
                    var e, i, o = this.axis,
                        n = this.value,
                        r = o.categories,
                        a = this.dateTimeLabelFormat,
                        l = s.lang,
                        h = l.numericSymbols,
                        c = l.numericSymbolMagnitude || 1e3,
                        d = h && h.length,
                        p = o.options.labels.format,
                        u = o.isLog ? Math.abs(n) : o.tickInterval;
                    if (p) i = g(p, this);
                    else if (r) i = n;
                    else if (a) i = t.dateFormat(a, n);
                    else if (d && u >= 1e3)
                        for (; d-- && void 0 === i;) u >= (e = Math.pow(c, d + 1)) && 10 * n % e == 0 && null !== h[d] && 0 !== n && (i = t.numberFormat(n / e, -1) + h[d]);
                    return void 0 === i && (i = Math.abs(n) >= 1e4 ? t.numberFormat(n, -1) : t.numberFormat(n, -1, void 0, "")), i
                },
                getSeriesExtremes: function() {
                    var t = this,
                        e = t.chart;
                    t.hasVisibleSeries = !1, t.dataMin = t.dataMax = t.threshold = null, t.softThreshold = !t.isXAxis, t.buildStacks && t.buildStacks(), d(t.series, function(i) {
                        if (i.visible || !e.options.chart.ignoreHiddenSeries) {
                            var r, a, s, h = i.options,
                                c = h.threshold;
                            t.hasVisibleSeries = !0, t.positiveValuesOnly && c <= 0 && (c = null), t.isXAxis ? (r = i.xData).length && (a = n(r), y(a) || a instanceof Date || (r = m(r, function(t) {
                                return y(t)
                            }), a = n(r)), t.dataMin = Math.min(S(t.dataMin, r[0]), a), t.dataMax = Math.max(S(t.dataMax, r[0]), o(r))) : (i.getExtremes(), s = i.dataMax, a = i.dataMin, l(a) && l(s) && (t.dataMin = Math.min(S(t.dataMin, a), a), t.dataMax = Math.max(S(t.dataMax, s), s)), l(c) && (t.threshold = c), h.softThreshold && !t.positiveValuesOnly || (t.softThreshold = !1))
                        }
                    })
                },
                translate: function(t, e, i, o, n, r) {
                    var a, s = this.linkedParent || this,
                        l = 1,
                        h = 0,
                        c = o ? s.oldTransA : s.transA,
                        d = o ? s.oldMin : s.min,
                        p = s.minPixelPadding,
                        u = (s.isOrdinal || s.isBroken || s.isLog && n) && s.lin2val;
                    return c || (c = s.transA), i && (l *= -1, h = s.len), s.reversed && (h -= (l *= -1) * (s.sector || s.len)), e ? (t = t * l + h, a = (t -= p) / c + d, u && (a = s.lin2val(a))) : (u && (t = s.val2lin(t)), a = l * (t - d) * c + h + l * p + (y(r) ? c * r : 0)), a
                },
                toPixels: function(t, e) {
                    return this.translate(t, !1, !this.horiz, null, !0) + (e ? 0 : this.pos)
                },
                toValue: function(t, e) {
                    return this.translate(t - (e ? 0 : this.pos), !0, !this.horiz, null, !0)
                },
                getPlotLinePath: function(t, e, i, o, n) {
                    var r, a, s, l, h, c = this,
                        d = c.chart,
                        p = c.left,
                        u = c.top,
                        g = i && d.oldChartHeight || d.chartHeight,
                        f = i && d.oldChartWidth || d.chartWidth,
                        m = c.transB,
                        x = function(t, e, i) {
                            return (t < e || t > i) && (o ? t = Math.min(Math.max(e, t), i) : h = !0), t
                        };
                    return n = S(n, c.translate(t, null, null, i)), r = s = Math.round(n + m), a = l = Math.round(g - n - m), y(n) ? c.horiz ? (a = u, l = g - c.bottom, r = s = x(r, p, p + c.width)) : (r = p, s = f - c.right, a = l = x(a, u, u + c.height)) : h = !0, h && !o ? null : d.renderer.crispLine(["M", r, a, "L", s, l], e || 1)
                },
                getLinearTickPositions: function(t, e, i) {
                    var o, n, r = a(Math.floor(e / t) * t),
                        s = a(Math.ceil(i / t) * t),
                        l = [];
                    if (this.single) return [e];
                    for (o = r; o <= s && (l.push(o), (o = a(o + t)) !== n);) n = o;
                    return l
                },
                getMinorTickPositions: function() {
                    var t, e = this,
                        i = e.options,
                        o = e.tickPositions,
                        n = e.minorTickInterval,
                        r = [],
                        a = e.pointRangePadding || 0,
                        s = e.min - a,
                        l = e.max + a,
                        h = l - s;
                    if (h && h / n < e.len / 3)
                        if (e.isLog) d(this.paddedTicks, function(t, i, o) {
                            i && r.push.apply(r, e.getLogTickPositions(n, o[i - 1], o[i], !0))
                        });
                        else if (e.isDatetimeAxis && "auto" === i.minorTickInterval) r = r.concat(e.getTimeTicks(e.normalizeTimeTickInterval(n), s, l, i.startOfWeek));
                    else
                        for (t = s + (o[0] - s) % n; t <= l && t !== r[0]; t += n) r.push(t);
                    return 0 !== r.length && e.trimTicks(r), r
                },
                adjustForMinRange: function() {
                    var t, e, i, r, a, s, h, c, p, u, g = this,
                        f = g.options,
                        m = g.min,
                        x = g.max;
                    g.isXAxis && void 0 === g.minRange && !g.isLog && (l(f.min) || l(f.max) ? g.minRange = null : (d(g.series, function(t) {
                        for (s = t.xData, h = t.xIncrement ? 1 : s.length - 1, r = h; r > 0; r--) a = s[r] - s[r - 1], (void 0 === i || a < i) && (i = a)
                    }), g.minRange = Math.min(5 * i, g.dataMax - g.dataMin))), x - m < g.minRange && (e = g.dataMax - g.dataMin >= g.minRange, c = [m - (t = ((u = g.minRange) - x + m) / 2), S(f.min, m - t)], e && (c[2] = g.isLog ? g.log2lin(g.dataMin) : g.dataMin), p = [(m = o(c)) + u, S(f.max, m + u)], e && (p[2] = g.isLog ? g.log2lin(g.dataMax) : g.dataMax), (x = n(p)) - m < u && (c[0] = x - u, c[1] = S(f.min, x - u), m = o(c))), g.min = m, g.max = x
                },
                getClosest: function() {
                    var t;
                    return this.categories ? t = 1 : d(this.series, function(e) {
                        var i = e.closestPointRange,
                            o = e.visible || !e.chart.options.chart.ignoreHiddenSeries;
                        !e.noSharedTooltip && l(i) && o && (t = l(t) ? Math.min(t, i) : i)
                    }), t
                },
                nameToX: function(t) {
                    var e, i = v(this.categories),
                        o = i ? this.categories : this.names,
                        n = t.options.x;
                    return t.series.requireSorting = !1, l(n) || (n = !1 === this.options.uniqueNames ? t.series.autoIncrement() : x(t.name, o)), -1 === n ? i || (e = o.length) : e = n, void 0 !== e && (this.names[e] = t.name), e
                },
                updateNames: function() {
                    var t = this;
                    this.names.length > 0 && (this.names.length = 0, this.minRange = this.userMinRange, d(this.series || [], function(e) {
                        e.xIncrement = null, e.points && !e.isDirtyData || (e.processData(), e.generatePoints()), d(e.points, function(i, o) {
                            var n;
                            i.options && void 0 !== (n = t.nameToX(i)) && n !== i.x && (i.x = n, e.xData[o] = n)
                        })
                    }))
                },
                setAxisTranslation: function(t) {
                    var e, i, o = this,
                        n = o.max - o.min,
                        r = o.axisPointRange || 0,
                        a = 0,
                        s = 0,
                        l = o.linkedParent,
                        h = !!o.categories,
                        c = o.transA,
                        p = o.isXAxis;
                    (p || h || r) && (e = o.getClosest(), l ? (a = l.minPointOffset, s = l.pointRangePadding) : d(o.series, function(t) {
                        var i = h ? 1 : p ? S(t.options.pointRange, e, 0) : o.axisPointRange || 0,
                            n = t.options.pointPlacement;
                        r = Math.max(r, i), o.single || (a = Math.max(a, b(n) ? 0 : i / 2), s = Math.max(s, "on" === n ? 0 : i))
                    }), i = o.ordinalSlope && e ? o.ordinalSlope / e : 1, o.minPointOffset = a *= i, o.pointRangePadding = s *= i, o.pointRange = Math.min(r, n), p && (o.closestPointRange = e)), t && (o.oldTransA = c), o.translationSlope = o.transA = c = o.options.staticScale || o.len / (n + s || 1), o.transB = o.horiz ? o.left : o.bottom, o.minPixelPadding = c * a
                },
                minFromRange: function() {
                    return this.max - this.range
                },
                setTickInterval: function(e) {
                    var i, o, n, r, s, h, c, p = this,
                        g = p.chart,
                        m = p.options,
                        x = p.isLog,
                        v = p.log2lin,
                        b = p.isDatetimeAxis,
                        M = p.isXAxis,
                        k = p.isLinked,
                        A = m.maxPadding,
                        C = m.minPadding,
                        T = m.tickInterval,
                        P = m.tickPixelInterval,
                        L = p.categories,
                        D = p.threshold,
                        O = p.softThreshold;
                    b || L || k || this.getTickAmount(), h = S(p.userMin, m.min), c = S(p.userMax, m.max), k ? (p.linkedParent = g[p.coll][m.linkedTo], o = p.linkedParent.getExtremes(), p.min = S(o.min, o.dataMin), p.max = S(o.max, o.dataMax), m.type !== p.linkedParent.options.type && t.error(11, 1)) : (!O && l(D) && (p.dataMin >= D ? (r = D, C = 0) : p.dataMax <= D && (s = D, A = 0)), p.min = S(h, r, p.dataMin), p.max = S(c, s, p.dataMax)), x && (p.positiveValuesOnly && !e && Math.min(p.min, S(p.dataMin, p.min)) <= 0 && t.error(10, 1), p.min = a(v(p.min), 15), p.max = a(v(p.max), 15)), p.range && l(p.max) && (p.userMin = p.min = h = Math.max(p.min, p.minFromRange()), p.userMax = c = p.max, p.range = null), u(p, "foundExtremes"), p.beforePadding && p.beforePadding(), p.adjustForMinRange(), L || p.axisPointRange || p.usePercentage || k || !l(p.min) || !l(p.max) || (i = p.max - p.min) && (!l(h) && C && (p.min -= i * C), !l(c) && A && (p.max += i * A)), y(m.softMin) && (p.min = Math.min(p.min, m.softMin)), y(m.softMax) && (p.max = Math.max(p.max, m.softMax)), y(m.floor) && (p.min = Math.max(p.min, m.floor)), y(m.ceiling) && (p.max = Math.min(p.max, m.ceiling)), O && l(p.dataMin) && (D = D || 0, !l(h) && p.min < D && p.dataMin >= D ? p.min = D : !l(c) && p.max > D && p.dataMax <= D && (p.max = D)), p.min === p.max || void 0 === p.min || void 0 === p.max ? p.tickInterval = 1 : k && !T && P === p.linkedParent.options.tickPixelInterval ? p.tickInterval = T = p.linkedParent.tickInterval : p.tickInterval = S(T, this.tickAmount ? (p.max - p.min) / Math.max(this.tickAmount - 1, 1) : void 0, L ? 1 : (p.max - p.min) * P / Math.max(p.len, P)), M && !e && d(p.series, function(t) {
                        t.processData(p.min !== p.oldMin || p.max !== p.oldMax)
                    }), p.setAxisTranslation(!0), p.beforeSetTickPositions && p.beforeSetTickPositions(), p.postProcessTickInterval && (p.tickInterval = p.postProcessTickInterval(p.tickInterval)), p.pointRange && !T && (p.tickInterval = Math.max(p.pointRange, p.tickInterval)), n = S(m.minTickInterval, p.isDatetimeAxis && p.closestPointRange), !T && p.tickInterval < n && (p.tickInterval = n), b || x || T || (p.tickInterval = w(p.tickInterval, null, f(p.tickInterval), S(m.allowDecimals, !(p.tickInterval > .5 && p.tickInterval < 5 && p.max > 1e3 && p.max < 9999)), !!this.tickAmount)), this.tickAmount || (p.tickInterval = p.unsquish()), this.setTickPositions()
                },
                setTickPositions: function() {
                    var t, e = this.options,
                        i = e.tickPositions,
                        o = e.tickPositioner,
                        n = e.startOnTick,
                        r = e.endOnTick;
                    this.tickmarkOffset = this.categories && "between" === e.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0, this.minorTickInterval = "auto" === e.minorTickInterval && this.tickInterval ? this.tickInterval / 5 : e.minorTickInterval, this.single = this.min === this.max && l(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== e.allowDecimals), this.tickPositions = t = i && i.slice(), t || ((t = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, e.units), this.min, this.max, e.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max)).length > this.len && (t = [t[0], t.pop()]), this.tickPositions = t, o && (o = o.apply(this, [this.min, this.max])) && (this.tickPositions = t = o)), this.paddedTicks = t.slice(0), this.trimTicks(t, n, r), this.isLinked || (this.single && (this.min -= .5, this.max += .5), i || o || this.adjustTickAmount())
                },
                trimTicks: function(t, e, i) {
                    var o = t[0],
                        n = t[t.length - 1],
                        r = this.minPointOffset || 0;
                    if (!this.isLinked) {
                        if (e && o !== -1 / 0) this.min = o;
                        else
                            for (; this.min - r > t[0];) t.shift();
                        if (i) this.max = n;
                        else
                            for (; this.max + r < t[t.length - 1];) t.pop();
                        0 === t.length && l(o) && t.push((n + o) / 2)
                    }
                },
                alignToOthers: function() {
                    var t, e = {},
                        i = this.options;
                    return !1 === this.chart.options.chart.alignTicks || !1 === i.alignTicks || this.isLog || d(this.chart[this.coll], function(i) {
                        var o = i.options,
                            n = [i.horiz ? o.left : o.top, o.width, o.height, o.pane].join(",");
                        i.series.length && (e[n] ? t = !0 : e[n] = 1)
                    }), t
                },
                getTickAmount: function() {
                    var t = this.options,
                        e = t.tickAmount,
                        i = t.tickPixelInterval;
                    !l(t.tickInterval) && this.len < i && !this.isRadial && !this.isLog && t.startOnTick && t.endOnTick && (e = 2), !e && this.alignToOthers() && (e = Math.ceil(this.len / i) + 1), e < 4 && (this.finalTickAmt = e, e = 5), this.tickAmount = e
                },
                adjustTickAmount: function() {
                    var t, e, i = this.tickInterval,
                        o = this.tickPositions,
                        n = this.tickAmount,
                        r = this.finalTickAmt,
                        s = o && o.length;
                    if (s < n) {
                        for (; o.length < n;) o.push(a(o[o.length - 1] + i));
                        this.transA *= (s - 1) / (n - 1), this.max = o[o.length - 1]
                    } else s > n && (this.tickInterval *= 2, this.setTickPositions());
                    if (l(r)) {
                        for (t = e = o.length; t--;)(3 === r && t % 2 == 1 || r <= 2 && t > 0 && t < e - 1) && o.splice(t, 1);
                        this.finalTickAmt = void 0
                    }
                },
                setScale: function() {
                    var t, e, i = this;
                    i.oldMin = i.min, i.oldMax = i.max, i.oldAxisLength = i.len, i.setAxisSize(), e = i.len !== i.oldAxisLength, d(i.series, function(e) {
                        (e.isDirtyData || e.isDirty || e.xAxis.isDirty) && (t = !0)
                    }), e || t || i.isLinked || i.forceRedraw || i.userMin !== i.oldUserMin || i.userMax !== i.oldUserMax || i.alignToOthers() ? (i.resetStacks && i.resetStacks(), i.forceRedraw = !1, i.getSeriesExtremes(), i.setTickInterval(), i.oldUserMin = i.userMin, i.oldUserMax = i.userMax, i.isDirty || (i.isDirty = e || i.min !== i.oldMin || i.max !== i.oldMax)) : i.cleanStacks && i.cleanStacks()
                },
                setExtremes: function(t, e, i, o, n) {
                    var r = this,
                        a = r.chart;
                    i = S(i, !0), d(r.series, function(t) {
                        delete t.kdTree
                    }), n = p(n, {
                        min: t,
                        max: e
                    }), u(r, "setExtremes", n, function() {
                        r.userMin = t, r.userMax = e, r.eventArgs = n, i && a.redraw(o)
                    })
                },
                zoom: function(t, e) {
                    var i = this.dataMin,
                        o = this.dataMax,
                        n = this.options,
                        r = Math.min(i, S(n.min, i)),
                        a = Math.max(o, S(n.max, o));
                    return t === this.min && e === this.max || (this.allowZoomOutside || (l(i) && (t < r && (t = r), t > a && (t = a)), l(o) && (e < r && (e = r), e > a && (e = a))), this.displayBtn = void 0 !== t || void 0 !== e, this.setExtremes(t, e, !1, void 0, {
                        trigger: "zoom"
                    })), !0
                },
                setAxisSize: function() {
                    var t = this.chart,
                        e = this.options,
                        i = e.offsets || [0, 0, 0, 0],
                        o = this.horiz,
                        n = S(e.width, t.plotWidth - i[3] + i[1]),
                        r = S(e.height, t.plotHeight - i[0] + i[2]),
                        a = S(e.top, t.plotTop + i[0]),
                        s = S(e.left, t.plotLeft + i[3]),
                        l = /%$/;
                    l.test(r) && (r = Math.round(parseFloat(r) / 100 * t.plotHeight)), l.test(a) && (a = Math.round(parseFloat(a) / 100 * t.plotHeight + t.plotTop)), this.left = s, this.top = a, this.width = n, this.height = r, this.bottom = t.chartHeight - r - a, this.right = t.chartWidth - n - s, this.len = Math.max(o ? n : r, 0), this.pos = o ? s : a
                },
                getExtremes: function() {
                    var t = this,
                        e = t.isLog,
                        i = t.lin2log;
                    return {
                        min: e ? a(i(t.min)) : t.min,
                        max: e ? a(i(t.max)) : t.max,
                        dataMin: t.dataMin,
                        dataMax: t.dataMax,
                        userMin: t.userMin,
                        userMax: t.userMax
                    }
                },
                getThreshold: function(t) {
                    var e = this,
                        i = e.isLog,
                        o = e.lin2log,
                        n = i ? o(e.min) : e.min,
                        r = i ? o(e.max) : e.max;
                    return null === t ? t = n : n > t ? t = n : r < t && (t = r), e.translate(t, 0, 1, 0, 1)
                },
                autoLabelAlign: function(t) {
                    var e = (S(t, 0) - 90 * this.side + 720) % 360;
                    return e > 15 && e < 165 ? "right" : e > 195 && e < 345 ? "left" : "center"
                },
                tickSize: function(t) {
                    var e = this.options,
                        i = e[t + "Length"],
                        o = S(e[t + "Width"], "tick" === t && this.isXAxis ? 1 : 0);
                    if (o && i) return "inside" === e[t + "Position"] && (i = -i), [i, o]
                },
                labelMetrics: function() {
                    var t = this.tickPositions && this.tickPositions[0] || 0;
                    return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[t] && this.ticks[t].label)
                },
                unsquish: function() {
                    var t, e, i, o = this.options.labels,
                        n = this.horiz,
                        r = this.tickInterval,
                        a = r,
                        s = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / r),
                        c = o.rotation,
                        p = this.labelMetrics(),
                        u = Number.MAX_VALUE,
                        g = function(t) {
                            var e = t / (s || 1);
                            return (e = e > 1 ? Math.ceil(e) : 1) * r
                        };
                    return n ? (i = !o.staggerLines && !o.step && (l(c) ? [c] : s < S(o.autoRotationLimit, 80) && o.autoRotation)) && d(i, function(i) {
                        var o;
                        (i === c || i && i >= -90 && i <= 90) && (o = (e = g(Math.abs(p.h / Math.sin(h * i)))) + Math.abs(i / 360)) < u && (u = o, t = i, a = e)
                    }) : o.step || (a = g(p.h)), this.autoRotation = i, this.labelRotation = S(t, c), a
                },
                getSlotWidth: function() {
                    var t = this.chart,
                        e = this.horiz,
                        i = this.options.labels,
                        o = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
                        n = t.margin[3];
                    return e && (i.step || 0) < 2 && !i.rotation && (this.staggerLines || 1) * this.len / o || !e && (n && n - t.spacing[3] || .33 * t.chartWidth)
                },
                renderUnsquish: function() {
                    var t, e, i, o, n = this.chart,
                        r = n.renderer,
                        a = this.tickPositions,
                        s = this.ticks,
                        l = this.options.labels,
                        h = this.horiz,
                        c = this.getSlotWidth(),
                        p = Math.max(1, Math.round(c - 2 * (l.padding || 5))),
                        u = {},
                        g = this.labelMetrics(),
                        f = l.style && l.style.textOverflow,
                        m = 0;
                    if (b(l.rotation) || (u.rotation = l.rotation || 0), d(a, function(t) {
                            (t = s[t]) && t.labelLength > m && (m = t.labelLength)
                        }), this.maxLabelLength = m, this.autoRotation) m > p && m > g.h ? u.rotation = this.labelRotation : this.labelRotation = 0;
                    else if (c && (t = {
                            width: p + "px"
                        }, !f))
                        for (t.textOverflow = "clip", i = a.length; !h && i--;) o = a[i], (e = s[o].label) && (e.styles && "ellipsis" === e.styles.textOverflow ? e.css({
                            textOverflow: "clip"
                        }) : s[o].labelLength > c && e.css({
                            width: c + "px"
                        }), e.getBBox().height > this.len / a.length - (g.h - g.f) && (e.specCss = {
                            textOverflow: "ellipsis"
                        }));
                    u.rotation && (t = {
                        width: (m > .5 * n.chartHeight ? .33 * n.chartHeight : n.chartHeight) + "px"
                    }, f || (t.textOverflow = "ellipsis")), this.labelAlign = l.align || this.autoLabelAlign(this.labelRotation), this.labelAlign && (u.align = this.labelAlign), d(a, function(e) {
                        var i = s[e],
                            o = i && i.label;
                        o && (o.attr(u), t && o.css(M(t, o.specCss)), delete o.specCss, i.rotation = u.rotation)
                    }), this.tickRotCorr = r.rotCorr(g.b, this.labelRotation || 0, 0 !== this.side)
                },
                hasData: function() {
                    return this.hasVisibleSeries || l(this.min) && l(this.max) && !!this.tickPositions
                },
                addTitle: function(t) {
                    var e, i = this,
                        o = i.chart.renderer,
                        n = i.horiz,
                        r = i.opposite,
                        a = i.options.title;
                    i.axisTitle || ((e = a.textAlign) || (e = (n ? {
                        low: "left",
                        middle: "center",
                        high: "right"
                    } : {
                        low: r ? "right" : "left",
                        middle: "center",
                        high: r ? "left" : "right"
                    })[a.align]), i.axisTitle = o.text(a.text, 0, 0, a.useHTML).attr({
                        zIndex: 7,
                        rotation: a.rotation || 0,
                        align: e
                    }).addClass("highcharts-axis-title").css(a.style).add(i.axisGroup), i.axisTitle.isNew = !0), i.axisTitle[t ? "show" : "hide"](!0)
                },
                generateTick: function(t) {
                    var e = this.ticks;
                    e[t] ? e[t].addLabel() : e[t] = new P(this, t)
                },
                getOffset: function() {
                    var t, e, i, o, n, r, a = this,
                        s = a.chart,
                        h = s.renderer,
                        c = a.options,
                        p = a.tickPositions,
                        u = a.ticks,
                        g = a.horiz,
                        f = a.side,
                        m = s.inverted && !a.isZAxis ? [1, 0, 3, 2][f] : f,
                        x = 0,
                        v = 0,
                        y = c.title,
                        b = c.labels,
                        M = 0,
                        w = s.axisOffset,
                        A = s.clipOffset,
                        C = [-1, 1, 1, -1][f],
                        T = c.className,
                        P = a.axisParent,
                        L = this.tickSize("tick");
                    t = a.hasData(), a.showAxis = e = t || S(c.showEmpty, !0), a.staggerLines = a.horiz && b.staggerLines, a.axisGroup || (a.gridGroup = h.g("grid").attr({
                        zIndex: c.gridZIndex || 1
                    }).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (T || "")).add(P), a.axisGroup = h.g("axis").attr({
                        zIndex: c.zIndex || 2
                    }).addClass("highcharts-" + this.coll.toLowerCase() + " " + (T || "")).add(P), a.labelGroup = h.g("axis-labels").attr({
                        zIndex: b.zIndex || 7
                    }).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (T || "")).add(P)), t || a.isLinked ? (d(p, function(t, e) {
                        a.generateTick(t, e)
                    }), a.renderUnsquish(), !1 === b.reserveSpace || 0 !== f && 2 !== f && {
                        1: "left",
                        3: "right"
                    }[f] !== a.labelAlign && "center" !== a.labelAlign || d(p, function(t) {
                        M = Math.max(u[t].getLabelSize(), M)
                    }), a.staggerLines && (M *= a.staggerLines, a.labelOffset = M * (a.opposite ? -1 : 1))) : k(u, function(t, e) {
                        t.destroy(), delete u[e]
                    }), y && y.text && !1 !== y.enabled && (a.addTitle(e), e && !1 !== y.reserveSpace && (a.titleOffset = x = a.axisTitle.getBBox()[g ? "height" : "width"], i = y.offset, v = l(i) ? 0 : S(y.margin, g ? 5 : 10))), a.renderLine(), a.offset = C * S(c.offset, w[f]), a.tickRotCorr = a.tickRotCorr || {
                        x: 0,
                        y: 0
                    }, r = 0 === f ? -a.labelMetrics().h : 2 === f ? a.tickRotCorr.y : 0, o = Math.abs(M) + v, M && (o -= r, o += C * (g ? S(b.y, a.tickRotCorr.y + 8 * C) : b.x)), a.axisTitleMargin = S(i, o), w[f] = Math.max(w[f], a.axisTitleMargin + x + C * a.offset, o, t && p.length && L ? L[0] + C * a.offset : 0), n = 2 * Math.floor(a.axisLine.strokeWidth() / 2), c.offset > 0 && (n -= 2 * c.offset), A[m] = Math.max(A[m] || n, n)
                },
                getLinePath: function(t) {
                    var e = this.chart,
                        i = this.opposite,
                        o = this.offset,
                        n = this.horiz,
                        r = this.left + (i ? this.width : 0) + o,
                        a = e.chartHeight - this.bottom - (i ? this.height : 0) + o;
                    return i && (t *= -1), e.renderer.crispLine(["M", n ? this.left : r, n ? a : this.top, "L", n ? e.chartWidth - this.right : r, n ? a : e.chartHeight - this.bottom], t)
                },
                renderLine: function() {
                    this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup), this.axisLine.attr({
                        stroke: this.options.lineColor,
                        "stroke-width": this.options.lineWidth,
                        zIndex: 7
                    }))
                },
                getTitlePosition: function() {
                    var t = this.horiz,
                        e = this.left,
                        i = this.top,
                        o = this.len,
                        n = this.options.title,
                        r = t ? e : i,
                        a = this.opposite,
                        s = this.offset,
                        l = n.x || 0,
                        h = n.y || 0,
                        c = this.chart.renderer.fontMetrics(n.style && n.style.fontSize, this.axisTitle).f,
                        d = {
                            low: r + (t ? 0 : o),
                            middle: r + o / 2,
                            high: r + (t ? o : 0)
                        }[n.align],
                        p = (t ? i + this.height : e) + (t ? 1 : -1) * (a ? -1 : 1) * this.axisTitleMargin + (2 === this.side ? c : 0);
                    return {
                        x: t ? d + l : p + (a ? this.width : 0) + s + l,
                        y: t ? p + h - (a ? this.height : 0) + s : d + h
                    }
                },
                renderMinorTick: function(t) {
                    var e = this.chart.hasRendered && y(this.oldMin),
                        i = this.minorTicks;
                    i[t] || (i[t] = new P(this, t, "minor")), e && i[t].isNew && i[t].render(null, !0), i[t].render(null, !1, 1)
                },
                renderTick: function(t, e) {
                    var i = this.isLinked,
                        o = this.ticks,
                        n = this.chart.hasRendered && y(this.oldMin);
                    (!i || t >= this.min && t <= this.max) && (o[t] || (o[t] = new P(this, t)), n && o[t].isNew && o[t].render(e, !0, .1), o[t].render(e))
                },
                render: function() {
                    var e, o, n = this,
                        r = n.chart,
                        a = r.renderer,
                        s = n.options,
                        l = n.isLog,
                        h = n.lin2log,
                        c = n.isLinked,
                        p = n.tickPositions,
                        u = n.axisTitle,
                        g = n.ticks,
                        f = n.minorTicks,
                        m = n.alternateBands,
                        x = s.stackLabels,
                        v = s.alternateGridColor,
                        b = n.tickmarkOffset,
                        M = n.axisLine,
                        w = n.showAxis,
                        S = i(a.globalAnimation);
                    if (n.labelEdge.length = 0, n.overlap = !1, d([g, f, m], function(t) {
                            k(t, function(t) {
                                t.isActive = !1
                            })
                        }), (n.hasData() || c) && (n.minorTickInterval && !n.categories && d(n.getMinorTickPositions(), function(t) {
                            n.renderMinorTick(t)
                        }), p.length && (d(p, function(t, e) {
                            n.renderTick(t, e)
                        }), b && (0 === n.min || n.single) && (g[-1] || (g[-1] = new P(n, -1, null, !0)), g[-1].render(-1))), v && d(p, function(i, a) {
                            o = void 0 !== p[a + 1] ? p[a + 1] + b : n.max - b, a % 2 == 0 && i < n.max && o <= n.max + (r.polar ? -b : b) && (m[i] || (m[i] = new t.PlotLineOrBand(n)), e = i + b, m[i].options = {
                                from: l ? h(e) : e,
                                to: l ? h(o) : o,
                                color: v
                            }, m[i].render(), m[i].isActive = !0)
                        }), n._addedPlotLB || (d((s.plotLines || []).concat(s.plotBands || []), function(t) {
                            n.addPlotBandOrLine(t)
                        }), n._addedPlotLB = !0)), d([g, f, m], function(t) {
                            var e, i = [],
                                o = S.duration,
                                n = function() {
                                    for (e = i.length; e--;) t[i[e]] && !t[i[e]].isActive && (t[i[e]].destroy(), delete t[i[e]])
                                };
                            k(t, function(t, e) {
                                t.isActive || (t.render(e, !1, 0), t.isActive = !1, i.push(e))
                            }), T(n, t !== m && r.hasRendered && o ? o : 0)
                        }), M && (M[M.isPlaced ? "animate" : "attr"]({
                            d: this.getLinePath(M.strokeWidth())
                        }), M.isPlaced = !0, M[w ? "show" : "hide"](!0)), u && w) {
                        var A = n.getTitlePosition();
                        y(A.y) ? (u[u.isNew ? "attr" : "animate"](A), u.isNew = !1) : (u.attr("y", -9999), u.isNew = !0)
                    }
                    x && x.enabled && n.renderStackTotals(), n.isDirty = !1
                },
                redraw: function() {
                    this.visible && (this.render(), d(this.plotLinesAndBands, function(t) {
                        t.render()
                    })), d(this.series, function(t) {
                        t.isDirty = !0
                    })
                },
                keepProps: ["extKey", "hcEvents", "names", "series", "userMax", "userMin"],
                destroy: function(t) {
                    var e, i, o = this,
                        n = o.stacks,
                        r = o.plotLinesAndBands;
                    if (t || A(o), k(n, function(t, e) {
                            c(t), n[e] = null
                        }), d([o.ticks, o.minorTicks, o.alternateBands], function(t) {
                            c(t)
                        }), r)
                        for (i = r.length; i--;) r[i].destroy();
                    d(["stackTotalGroup", "axisLine", "axisTitle", "axisGroup", "gridGroup", "labelGroup", "cross"], function(t) {
                        o[t] && (o[t] = o[t].destroy())
                    });
                    for (e in o.plotLinesAndBandsGroups) o.plotLinesAndBandsGroups[e] = o.plotLinesAndBandsGroups[e].destroy();
                    k(o, function(t, e) {
                        -1 === x(e, o.keepProps) && delete o[e]
                    })
                },
                drawCrosshair: function(t, e) {
                    var i, o, n, a = this.crosshair,
                        s = S(a.snap, !0),
                        h = this.cross;
                    if (t || (t = this.cross && this.cross.e), this.crosshair && !1 !== (l(e) || !s)) {
                        if (s ? l(e) && (o = this.isXAxis ? e.plotX : this.len - e.plotY) : o = t && (this.horiz ? t.chartX - this.pos : this.len - t.chartY + this.pos), l(o) && (i = this.getPlotLinePath(e && (this.isXAxis ? e.x : S(e.stackY, e.y)), null, null, null, o) || null), !l(i)) return void this.hideCrosshair();
                        n = this.categories && !this.isRadial, h || (this.cross = h = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (n ? "category " : "thin ") + a.className).attr({
                            zIndex: S(a.zIndex, 2)
                        }).add(), h.attr({
                            stroke: a.color || (n ? r("#ccd6eb").setOpacity(.25).get() : "#cccccc"),
                            "stroke-width": S(a.width, 1)
                        }), a.dashStyle && h.attr({
                            dashstyle: a.dashStyle
                        })), h.show().attr({
                            d: i
                        }), n && !a.width && h.attr({
                            "stroke-width": this.transA
                        }), this.cross.e = t
                    } else this.hideCrosshair()
                },
                hideCrosshair: function() {
                    this.cross && this.cross.hide()
                }
            }), t.Axis = L, L
        }(e)),
        function(t) {
            var e = t.Axis,
                i = t.Date,
                o = t.dateFormat,
                n = t.defaultOptions,
                r = t.defined,
                a = t.each,
                s = t.extend,
                l = t.getMagnitude,
                h = t.getTZOffset,
                c = t.normalizeTickInterval,
                d = t.pick,
                p = t.timeUnits;
            e.prototype.getTimeTicks = function(t, e, l, c) {
                var u, g, f, m = [],
                    x = {},
                    v = n.global.useUTC,
                    y = new i(e - Math.max(h(e), h(l))),
                    b = i.hcMakeTime,
                    M = t.unitRange,
                    w = t.count;
                if (r(e)) {
                    y[i.hcSetMilliseconds](M >= p.second ? 0 : w * Math.floor(y.getMilliseconds() / w)), M >= p.second && y[i.hcSetSeconds](M >= p.minute ? 0 : w * Math.floor(y.getSeconds() / w)), M >= p.minute && y[i.hcSetMinutes](M >= p.hour ? 0 : w * Math.floor(y[i.hcGetMinutes]() / w)), M >= p.hour && y[i.hcSetHours](M >= p.day ? 0 : w * Math.floor(y[i.hcGetHours]() / w)), M >= p.day && y[i.hcSetDate](M >= p.month ? 1 : w * Math.floor(y[i.hcGetDate]() / w)), M >= p.month && (y[i.hcSetMonth](M >= p.year ? 0 : w * Math.floor(y[i.hcGetMonth]() / w)), g = y[i.hcGetFullYear]()), M >= p.year && (g -= g % w, y[i.hcSetFullYear](g)), M === p.week && y[i.hcSetDate](y[i.hcGetDate]() - y[i.hcGetDay]() + d(c, 1)), g = y[i.hcGetFullYear]();
                    var k = y[i.hcGetMonth](),
                        S = y[i.hcGetDate](),
                        A = y[i.hcGetHours]();
                    (i.hcTimezoneOffset || i.hcGetTimezoneOffset) && (f = (!v || !!i.hcGetTimezoneOffset) && (l - e > 4 * p.month || h(e) !== h(l)), y = y.getTime(), y = new i(y + h(y)));
                    var C = y.getTime();
                    for (u = 1; C < l;) m.push(C), M === p.year ? C = b(g + u * w, 0) : M === p.month ? C = b(g, k + u * w) : !f || M !== p.day && M !== p.week ? f && M === p.hour ? C = b(g, k, S, A + u * w) : C += M * w : C = b(g, k, S + u * w * (M === p.day ? 1 : 7)), u++;
                    m.push(C), M <= p.hour && m.length < 1e4 && a(m, function(t) {
                        t % 18e5 == 0 && "000000000" === o("%H%M%S%L", t) && (x[t] = "day")
                    })
                }
                return m.info = s(t, {
                    higherRanks: x,
                    totalRange: M * w
                }), m
            }, e.prototype.normalizeTimeTickInterval = function(t, e) {
                var i, o, n = e || [
                        ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                        ["second", [1, 2, 5, 10, 15, 30]],
                        ["minute", [1, 2, 5, 10, 15, 30]],
                        ["hour", [1, 2, 3, 4, 6, 8, 12]],
                        ["day", [1, 2]],
                        ["week", [1, 2]],
                        ["month", [1, 2, 3, 4, 6]],
                        ["year", null]
                    ],
                    r = n[n.length - 1],
                    a = p[r[0]],
                    s = r[1];
                for (o = 0; o < n.length && (r = n[o], a = p[r[0]], s = r[1], !(n[o + 1] && t <= (a * s[s.length - 1] + p[n[o + 1][0]]) / 2)); o++);
                return a === p.year && t < 5 * a && (s = [1, 2, 5]), i = c(t / a, s, "year" === r[0] ? Math.max(l(t / a), 1) : 1), {
                    unitRange: a,
                    count: i,
                    unitName: r[0]
                }
            }
        }(e),
        function(t) {
            var e = t.Axis,
                i = t.getMagnitude,
                o = t.map,
                n = t.normalizeTickInterval,
                r = t.pick;
            e.prototype.getLogTickPositions = function(t, e, a, s) {
                var l = this,
                    h = l.options,
                    c = l.len,
                    d = l.lin2log,
                    p = l.log2lin,
                    u = [];
                if (s || (l._minorAutoInterval = null), t >= .5) t = Math.round(t), u = l.getLinearTickPositions(t, e, a);
                else if (t >= .08) {
                    var g, f, m, x, v, y, b, M = Math.floor(e);
                    for (g = t > .3 ? [1, 2, 4] : t > .15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9], f = M; f < a + 1 && !b; f++)
                        for (x = g.length, m = 0; m < x && !b; m++)(v = p(d(f) * g[m])) > e && (!s || y <= a) && void 0 !== y && u.push(y), y > a && (b = !0), y = v
                } else {
                    var w = d(e),
                        k = d(a),
                        S = h[s ? "minorTickInterval" : "tickInterval"],
                        A = "auto" === S ? null : S,
                        C = h.tickPixelInterval / (s ? 5 : 1),
                        T = s ? c / l.tickPositions.length : c;
                    t = r(A, l._minorAutoInterval, (k - w) * C / (T || 1)), t = n(t, null, i(t)), u = o(l.getLinearTickPositions(t, w, k), p), s || (l._minorAutoInterval = t / 5)
                }
                return s || (l.tickInterval = t), u
            }, e.prototype.log2lin = function(t) {
                return Math.log(t) / Math.LN10
            }, e.prototype.lin2log = function(t) {
                return Math.pow(10, t)
            }
        }(e),
        function(t) {
            var e = t.dateFormat,
                i = t.each,
                o = t.extend,
                n = t.format,
                r = t.isNumber,
                a = t.map,
                s = t.merge,
                l = t.pick,
                h = t.splat,
                c = t.syncTimeout,
                d = t.timeUnits;
            t.Tooltip = function() {
                this.init.apply(this, arguments)
            }, t.Tooltip.prototype = {
                init: function(t, e) {
                    this.chart = t, this.options = e, this.crosshairs = [], this.now = {
                        x: 0,
                        y: 0
                    }, this.isHidden = !0, this.split = e.split && !t.inverted, this.shared = e.shared || this.split
                },
                cleanSplit: function(t) {
                    i(this.chart.series, function(e) {
                        var i = e && e.tt;
                        i && (!i.isActive || t ? e.tt = i.destroy() : i.isActive = !1)
                    })
                },
                getLabel: function() {
                    var t = this.chart.renderer,
                        e = this.options;
                    return this.label || (this.split ? this.label = t.g("tooltip") : (this.label = t.label("", 0, 0, e.shape || "callout", null, null, e.useHTML, null, "tooltip").attr({
                        padding: e.padding,
                        r: e.borderRadius
                    }), this.label.attr({
                        fill: e.backgroundColor,
                        "stroke-width": e.borderWidth
                    }).css(e.style).shadow(e.shadow)), this.label.attr({
                        zIndex: 8
                    }).add()), this.label
                },
                update: function(t) {
                    this.destroy(), s(!0, this.chart.options.tooltip.userOptions, t), this.init(this.chart, s(!0, this.options, t))
                },
                destroy: function() {
                    this.label && (this.label = this.label.destroy()), this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy()), clearTimeout(this.hideTimer), clearTimeout(this.tooltipTimeout)
                },
                move: function(t, e, i, n) {
                    var r = this,
                        a = r.now,
                        s = !1 !== r.options.animation && !r.isHidden && (Math.abs(t - a.x) > 1 || Math.abs(e - a.y) > 1),
                        l = r.followPointer || r.len > 1;
                    o(a, {
                        x: s ? (2 * a.x + t) / 3 : t,
                        y: s ? (a.y + e) / 2 : e,
                        anchorX: l ? void 0 : s ? (2 * a.anchorX + i) / 3 : i,
                        anchorY: l ? void 0 : s ? (a.anchorY + n) / 2 : n
                    }), r.getLabel().attr(a), s && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
                        r && r.move(t, e, i, n)
                    }, 32))
                },
                hide: function(t) {
                    var e = this;
                    clearTimeout(this.hideTimer), t = l(t, this.options.hideDelay, 500), this.isHidden || (this.hideTimer = c(function() {
                        e.getLabel()[t ? "fadeOut" : "hide"](), e.isHidden = !0
                    }, t))
                },
                getAnchor: function(t, e) {
                    var o, n, r, s = this.chart,
                        l = s.inverted,
                        c = s.plotTop,
                        d = s.plotLeft,
                        p = 0,
                        u = 0;
                    return t = h(t), o = t[0].tooltipPos, this.followPointer && e && (void 0 === e.chartX && (e = s.pointer.normalize(e)), o = [e.chartX - s.plotLeft, e.chartY - c]), o || (i(t, function(t) {
                        n = t.series.yAxis, r = t.series.xAxis, p += t.plotX + (!l && r ? r.left - d : 0), u += (t.plotLow ? (t.plotLow + t.plotHigh) / 2 : t.plotY) + (!l && n ? n.top - c : 0)
                    }), p /= t.length, u /= t.length, o = [l ? s.plotWidth - u : p, this.shared && !l && t.length > 1 && e ? e.chartY - c : l ? s.plotHeight - p : u]), a(o, Math.round)
                },
                getPosition: function(t, e, i) {
                    var o, n = this.chart,
                        r = this.distance,
                        a = {},
                        s = i.h || 0,
                        h = ["y", n.chartHeight, e, i.plotY + n.plotTop, n.plotTop, n.plotTop + n.plotHeight],
                        c = ["x", n.chartWidth, t, i.plotX + n.plotLeft, n.plotLeft, n.plotLeft + n.plotWidth],
                        d = !this.followPointer && l(i.ttBelow, !n.inverted == !!i.negative),
                        p = function(t, e, i, o, n, l) {
                            var h = i < o - r,
                                c = o + r + i < e,
                                p = o - r - i,
                                u = o + r;
                            if (d && c) a[t] = u;
                            else if (!d && h) a[t] = p;
                            else if (h) a[t] = Math.min(l - i, p - s < 0 ? p : p - s);
                            else {
                                if (!c) return !1;
                                a[t] = Math.max(n, u + s + i > e ? u : u + s)
                            }
                        },
                        u = function(t, e, i, o) {
                            var n;
                            return o < r || o > e - r ? n = !1 : a[t] = o < i / 2 ? 1 : o > e - i / 2 ? e - i - 2 : o - i / 2, n
                        },
                        g = function(t) {
                            var e = h;
                            h = c, c = e, o = t
                        },
                        f = function() {
                            !1 !== p.apply(0, h) ? !1 !== u.apply(0, c) || o || (g(!0), f()) : o ? a.x = a.y = 0 : (g(!0), f())
                        };
                    return (n.inverted || this.len > 1) && g(), f(), a
                },
                defaultFormatter: function(t) {
                    var e, i = this.points || h(this);
                    return e = [t.tooltipFooterHeaderFormatter(i[0])], (e = e.concat(t.bodyFormatter(i))).push(t.tooltipFooterHeaderFormatter(i[0], !0)), e
                },
                refresh: function(t, e) {
                    var o, n, r, a, s, c, d = this,
                        p = d.options,
                        u = t,
                        g = {},
                        f = [],
                        m = p.formatter || d.defaultFormatter,
                        x = d.shared;
                    clearTimeout(this.hideTimer), d.followPointer = h(u)[0].series.tooltipOptions.followPointer, n = (a = d.getAnchor(u, e))[0], r = a[1], !x || u.series && u.series.noSharedTooltip ? g = u.getLabelConfig() : (i(u, function(t) {
                        t.setState("hover"), f.push(t.getLabelConfig())
                    }), (g = {
                        x: u[0].category,
                        y: u[0].y
                    }).points = f, u = u[0]), this.len = f.length, s = m.call(g, d), c = u.series, this.distance = l(c.tooltipOptions.distance, 16), !1 === s ? this.hide() : (o = d.getLabel(), d.isHidden && o.attr({
                        opacity: 1
                    }).show(), d.split ? this.renderSplit(s, t) : (p.style.width || o.css({
                        width: this.chart.spacingBox.width
                    }), o.attr({
                        text: s && s.join ? s.join("") : s
                    }), o.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + l(u.colorIndex, c.colorIndex)), o.attr({
                        stroke: p.borderColor || u.color || c.color || "#666666"
                    }), d.updatePosition({
                        plotX: n,
                        plotY: r,
                        negative: u.negative,
                        ttBelow: u.ttBelow,
                        h: a[2] || 0
                    })), this.isHidden = !1)
                },
                renderSplit: function(e, o) {
                    var n, r = this,
                        a = [],
                        s = this.chart,
                        h = s.renderer,
                        c = !0,
                        d = this.options,
                        p = this.getLabel();
                    i(e.slice(0, o.length + 1), function(t, e) {
                        var i, u, g, f, m = o[e - 1] || {
                                isHeader: !0,
                                plotX: o[0].plotX
                            },
                            x = m.series || r,
                            v = x.tt,
                            y = m.series || {},
                            b = "highcharts-color-" + l(m.colorIndex, y.colorIndex, "none");
                        v || (x.tt = v = h.label(null, null, null, "callout").addClass("highcharts-tooltip-box " + b).attr({
                            padding: d.padding,
                            r: d.borderRadius,
                            fill: d.backgroundColor,
                            stroke: m.color || y.color || "#333333",
                            "stroke-width": d.borderWidth
                        }).add(p)), v.isActive = !0, v.attr({
                            text: t
                        }), v.css(d.style), f = (g = v.getBBox()).width + v.strokeWidth(), m.isHeader ? (n = g.height, u = Math.max(0, Math.min(m.plotX + s.plotLeft - f / 2, s.chartWidth - f))) : u = m.plotX + s.plotLeft - l(d.distance, 16) - f, u < 0 && (c = !1), i = (m.series && m.series.yAxis && m.series.yAxis.pos) + (m.plotY || 0), i -= s.plotTop, a.push({
                            target: m.isHeader ? s.plotHeight + n : i,
                            rank: m.isHeader ? 1 : 0,
                            size: x.tt.getBBox().height + 1,
                            point: m,
                            x: u,
                            tt: v
                        })
                    }), this.cleanSplit(), t.distribute(a, s.plotHeight + n), i(a, function(t) {
                        var e = t.point,
                            i = e.series;
                        t.tt.attr({
                            visibility: void 0 === t.pos ? "hidden" : "inherit",
                            x: c || e.isHeader ? t.x : e.plotX + s.plotLeft + l(d.distance, 16),
                            y: t.pos + s.plotTop,
                            anchorX: e.isHeader ? e.plotX + s.plotLeft : e.plotX + i.xAxis.pos,
                            anchorY: e.isHeader ? t.pos + s.plotTop - 15 : e.plotY + i.yAxis.pos
                        })
                    })
                },
                updatePosition: function(t) {
                    var e = this.chart,
                        i = this.getLabel(),
                        o = (this.options.positioner || this.getPosition).call(this, i.width, i.height, t);
                    this.move(Math.round(o.x), Math.round(o.y || 0), t.plotX + e.plotLeft, t.plotY + e.plotTop)
                },
                getDateFormat: function(t, i, o, n) {
                    var r, a, s = e("%m-%d %H:%M:%S.%L", i),
                        l = "01-01 00:00:00.000",
                        h = {
                            millisecond: 15,
                            second: 12,
                            minute: 9,
                            hour: 6,
                            day: 3
                        },
                        c = "millisecond";
                    for (a in d) {
                        if (t === d.week && +e("%w", i) === o && s.substr(6) === l.substr(6)) {
                            a = "week";
                            break
                        }
                        if (d[a] > t) {
                            a = c;
                            break
                        }
                        if (h[a] && s.substr(h[a]) !== l.substr(h[a])) break;
                        "week" !== a && (c = a)
                    }
                    return a && (r = n[a]), r
                },
                getXDateFormat: function(t, e, i) {
                    var o = e.dateTimeLabelFormats,
                        n = i && i.closestPointRange;
                    return (n ? this.getDateFormat(n, t.x, i.options.startOfWeek, o) : o.day) || o.year
                },
                tooltipFooterHeaderFormatter: function(t, e) {
                    var i = e ? "footer" : "header",
                        o = t.series,
                        a = o.tooltipOptions,
                        s = a.xDateFormat,
                        l = o.xAxis,
                        h = l && "datetime" === l.options.type && r(t.key),
                        c = a[i + "Format"];
                    return h && !s && (s = this.getXDateFormat(t, a, l)), h && s && (c = c.replace("{point.key}", "{point.key:" + s + "}")), n(c, {
                        point: t,
                        series: o
                    })
                },
                bodyFormatter: function(t) {
                    return a(t, function(t) {
                        var e = t.series.tooltipOptions;
                        return (e.pointFormatter || t.point.tooltipFormatter).call(t.point, e.pointFormat)
                    })
                }
            }
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.attr,
                o = t.charts,
                n = t.color,
                r = t.css,
                a = t.defined,
                s = t.doc,
                l = t.each,
                h = t.extend,
                c = t.fireEvent,
                d = t.offset,
                p = t.pick,
                u = t.removeEvent,
                g = t.splat,
                f = t.Tooltip,
                m = t.win;
            t.Pointer = function(t, e) {
                this.init(t, e)
            }, t.Pointer.prototype = {
                init: function(t, e) {
                    this.options = e, this.chart = t, this.runChartClick = e.chart.events && !!e.chart.events.click, this.pinchDown = [], this.lastValidTouch = {}, f && e.tooltip.enabled && (t.tooltip = new f(t, e.tooltip), this.followTouchMove = p(e.tooltip.followTouchMove, !0)), this.setDOMEvents()
                },
                zoomOption: function(t) {
                    var e, i, o = this.chart,
                        n = o.options.chart,
                        r = n.zoomType || "",
                        a = o.inverted;
                    /touch/.test(t.type) && (r = p(n.pinchType, r)), this.zoomX = e = /x/.test(r), this.zoomY = i = /y/.test(r), this.zoomHor = e && !a || i && a, this.zoomVert = i && !a || e && a, this.hasZoom = e || i
                },
                normalize: function(t, e) {
                    var i, o, n;
                    return (t = t || m.event).target || (t.target = t.srcElement), n = t.touches ? t.touches.length ? t.touches.item(0) : t.changedTouches[0] : t, e || (this.chartPosition = e = d(this.chart.container)), void 0 === n.pageX ? (i = Math.max(t.x, t.clientX - e.left), o = t.y) : (i = n.pageX - e.left, o = n.pageY - e.top), h(t, {
                        chartX: Math.round(i),
                        chartY: Math.round(o)
                    })
                },
                getCoordinates: function(t) {
                    var e = {
                        xAxis: [],
                        yAxis: []
                    };
                    return l(this.chart.axes, function(i) {
                        e[i.isXAxis ? "xAxis" : "yAxis"].push({
                            axis: i,
                            value: i.toValue(t[i.horiz ? "chartX" : "chartY"])
                        })
                    }), e
                },
                getKDPoints: function(t, e, i) {
                    var o, n, r, a, s = [];
                    if (l(t, function(t) {
                            o = t.noSharedTooltip && e, n = !e && t.directTouch, t.visible && !n && p(t.options.enableMouseTracking, !0) && (r = t.searchPoint(i, !o && t.options.findNearestPointBy.indexOf("y") < 0)) && r.series && s.push(r)
                        }), s.sort(function(t, i) {
                            var o = t.distX - i.distX,
                                n = t.dist - i.dist,
                                r = (i.series.group && i.series.group.zIndex) - (t.series.group && t.series.group.zIndex);
                            return 0 !== o && e ? o : 0 !== n ? n : 0 !== r ? r : t.series.index > i.series.index ? -1 : 1
                        }), e && s[0] && !s[0].series.noSharedTooltip)
                        for (a = s.length; a--;)(s[a].x !== s[0].x || s[a].series.noSharedTooltip) && s.splice(a, 1);
                    return s
                },
                getPointFromEvent: function(t) {
                    for (var e, i = t.target; i && !e;) e = i.point, i = i.parentNode;
                    return e
                },
                getChartCoordinatesFromPoint: function(t, e) {
                    var i = t.series,
                        o = i.xAxis,
                        n = i.yAxis;
                    if (o && n) return e ? {
                        chartX: o.len + o.pos - t.clientX,
                        chartY: n.len + n.pos - t.plotY
                    } : {
                        chartX: t.clientX + o.pos,
                        chartY: t.plotY + n.pos
                    }
                },
                getHoverData: function(e, i, o, n, r, a) {
                    var s, l = e,
                        h = i,
                        c = r ? o : [h],
                        d = !(!n || !e),
                        p = h && !h.stickyTracking,
                        u = function(t, e) {
                            return 0 === e
                        };
                    return d ? u = function(t) {
                        return t === e
                    } : p ? u = function(t) {
                        return t.series === h
                    } : c = t.grep(o, function(t) {
                        return t.stickyTracking
                    }), s = d && !r ? [e] : this.getKDPoints(c, r, a), l = t.find(s, u), h = l && l.series, d || p || !r || (s = this.getKDPoints(o, r, a)), s.sort(function(t, e) {
                        return t.series.index - e.series.index
                    }), {
                        hoverPoint: l,
                        hoverSeries: h,
                        hoverPoints: s
                    }
                },
                runPointActions: function(i, n) {
                    var r, a, h, c, d = this,
                        u = d.chart,
                        g = u.series,
                        f = u.tooltip,
                        m = !!f && f.shared,
                        x = n || u.hoverPoint,
                        v = x && x.series || u.hoverSeries,
                        y = !!n || v && v.directTouch && d.isDirectTouch,
                        b = this.getHoverData(x, v, g, y, m, i);
                    x = b.hoverPoint, a = (v = b.hoverSeries) && v.tooltipOptions.followPointer, r = m && x && !x.series.noSharedTooltip, c = r ? b.hoverPoints : x ? [x] : [], x && (x !== u.hoverPoint || f && f.isHidden) ? (l(u.hoverPoints || [], function(e) {
                        -1 === t.inArray(e, c) && e.setState()
                    }), l(c || [], function(t) {
                        t.setState("hover")
                    }), u.hoverSeries !== v && v.onMouseOver(), u.hoverPoint && u.hoverPoint.firePointEvent("mouseOut"), x.firePointEvent("mouseOver"), u.hoverPoints = c, u.hoverPoint = x, f && f.refresh(r ? c : x, i)) : a && f && !f.isHidden && (h = f.getAnchor([{}], i), f.updatePosition({
                        plotX: h[0],
                        plotY: h[1]
                    })), d.unDocMouseMove || (d.unDocMouseMove = e(s, "mousemove", function(e) {
                        var i = o[t.hoverChartIndex];
                        i && i.pointer.onDocumentMouseMove(e)
                    })), l(u.axes, function(e) {
                        p(e.crosshair.snap, !0) ? t.find(c, function(t) {
                            return t.series[e.coll] === e
                        }) ? e.drawCrosshair(i, x) : e.hideCrosshair() : e.drawCrosshair(i)
                    })
                },
                reset: function(t, e) {
                    var i = this,
                        o = i.chart,
                        n = o.hoverSeries,
                        r = o.hoverPoint,
                        a = o.hoverPoints,
                        s = o.tooltip,
                        h = s && s.shared ? a : r;
                    t && h && l(g(h), function(e) {
                        e.series.isCartesian && void 0 === e.plotX && (t = !1)
                    }), t ? s && h && (s.refresh(h), r && (r.setState(r.state, !0), l(o.axes, function(t) {
                        t.crosshair && t.drawCrosshair(null, r)
                    }))) : (r && r.onMouseOut(), a && l(a, function(t) {
                        t.setState()
                    }), n && n.onMouseOut(), s && s.hide(e), i.unDocMouseMove && (i.unDocMouseMove = i.unDocMouseMove()), l(o.axes, function(t) {
                        t.hideCrosshair()
                    }), i.hoverX = o.hoverPoints = o.hoverPoint = null)
                },
                scaleGroups: function(t, e) {
                    var i, o = this.chart;
                    l(o.series, function(n) {
                        i = t || n.getPlotBox(), n.xAxis && n.xAxis.zoomEnabled && n.group && (n.group.attr(i), n.markerGroup && (n.markerGroup.attr(i), n.markerGroup.clip(e ? o.clipRect : null)), n.dataLabelsGroup && n.dataLabelsGroup.attr(i))
                    }), o.clipRect.attr(e || o.clipBox)
                },
                dragStart: function(t) {
                    var e = this.chart;
                    e.mouseIsDown = t.type, e.cancelClick = !1, e.mouseDownX = this.mouseDownX = t.chartX, e.mouseDownY = this.mouseDownY = t.chartY
                },
                drag: function(t) {
                    var e, i, o = this.chart,
                        r = o.options.chart,
                        a = t.chartX,
                        s = t.chartY,
                        l = this.zoomHor,
                        h = this.zoomVert,
                        c = o.plotLeft,
                        d = o.plotTop,
                        p = o.plotWidth,
                        u = o.plotHeight,
                        g = this.selectionMarker,
                        f = this.mouseDownX,
                        m = this.mouseDownY,
                        x = r.panKey && t[r.panKey + "Key"];
                    g && g.touch || (a < c ? a = c : a > c + p && (a = c + p), s < d ? s = d : s > d + u && (s = d + u), this.hasDragged = Math.sqrt(Math.pow(f - a, 2) + Math.pow(m - s, 2)), this.hasDragged > 10 && (e = o.isInsidePlot(f - c, m - d), o.hasCartesianSeries && (this.zoomX || this.zoomY) && e && !x && (g || (this.selectionMarker = g = o.renderer.rect(c, d, l ? 1 : p, h ? 1 : u, 0).attr({
                        fill: r.selectionMarkerFill || n("#335cad").setOpacity(.25).get(),
                        class: "highcharts-selection-marker",
                        zIndex: 7
                    }).add())), g && l && (i = a - f, g.attr({
                        width: Math.abs(i),
                        x: (i > 0 ? 0 : i) + f
                    })), g && h && (i = s - m, g.attr({
                        height: Math.abs(i),
                        y: (i > 0 ? 0 : i) + m
                    })), e && !g && r.panning && o.pan(t, r.panning)))
                },
                drop: function(t) {
                    var e = this,
                        i = this.chart,
                        o = this.hasPinched;
                    if (this.selectionMarker) {
                        var n, s = {
                                originalEvent: t,
                                xAxis: [],
                                yAxis: []
                            },
                            d = this.selectionMarker,
                            p = d.attr ? d.attr("x") : d.x,
                            u = d.attr ? d.attr("y") : d.y,
                            g = d.attr ? d.attr("width") : d.width,
                            f = d.attr ? d.attr("height") : d.height;
                        (this.hasDragged || o) && (l(i.axes, function(i) {
                            if (i.zoomEnabled && a(i.min) && (o || e[{
                                    xAxis: "zoomX",
                                    yAxis: "zoomY"
                                }[i.coll]])) {
                                var r = i.horiz,
                                    l = "touchend" === t.type ? i.minPixelPadding : 0,
                                    h = i.toValue((r ? p : u) + l),
                                    c = i.toValue((r ? p + g : u + f) - l);
                                s[i.coll].push({
                                    axis: i,
                                    min: Math.min(h, c),
                                    max: Math.max(h, c)
                                }), n = !0
                            }
                        }), n && c(i, "selection", s, function(t) {
                            i.zoom(h(t, o ? {
                                animation: !1
                            } : null))
                        })), this.selectionMarker = this.selectionMarker.destroy(), o && this.scaleGroups()
                    }
                    i && (r(i.container, {
                        cursor: i._cursor
                    }), i.cancelClick = this.hasDragged > 10, i.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
                },
                onContainerMouseDown: function(t) {
                    t = this.normalize(t), this.zoomOption(t), t.preventDefault && t.preventDefault(), this.dragStart(t)
                },
                onDocumentMouseUp: function(e) {
                    o[t.hoverChartIndex] && o[t.hoverChartIndex].pointer.drop(e)
                },
                onDocumentMouseMove: function(t) {
                    var e = this.chart,
                        i = this.chartPosition;
                    t = this.normalize(t, i), !i || this.inClass(t.target, "highcharts-tracker") || e.isInsidePlot(t.chartX - e.plotLeft, t.chartY - e.plotTop) || this.reset()
                },
                onContainerMouseLeave: function(e) {
                    var i = o[t.hoverChartIndex];
                    i && (e.relatedTarget || e.toElement) && (i.pointer.reset(), i.pointer.chartPosition = null)
                },
                onContainerMouseMove: function(e) {
                    var i = this.chart;
                    a(t.hoverChartIndex) && o[t.hoverChartIndex] && o[t.hoverChartIndex].mouseIsDown || (t.hoverChartIndex = i.index), (e = this.normalize(e)).returnValue = !1, "mousedown" === i.mouseIsDown && this.drag(e), !this.inClass(e.target, "highcharts-tracker") && !i.isInsidePlot(e.chartX - i.plotLeft, e.chartY - i.plotTop) || i.openMenu || this.runPointActions(e)
                },
                inClass: function(t, e) {
                    for (var o; t;) {
                        if (o = i(t, "class")) {
                            if (-1 !== o.indexOf(e)) return !0;
                            if (-1 !== o.indexOf("highcharts-container")) return !1
                        }
                        t = t.parentNode
                    }
                },
                onTrackerMouseOut: function(t) {
                    var e = this.chart.hoverSeries,
                        i = t.relatedTarget || t.toElement;
                    this.isDirectTouch = !1, !e || !i || e.stickyTracking || this.inClass(i, "highcharts-tooltip") || this.inClass(i, "highcharts-series-" + e.index) && this.inClass(i, "highcharts-tracker") || e.onMouseOut()
                },
                onContainerClick: function(t) {
                    var e = this.chart,
                        i = e.hoverPoint,
                        o = e.plotLeft,
                        n = e.plotTop;
                    t = this.normalize(t), e.cancelClick || (i && this.inClass(t.target, "highcharts-tracker") ? (c(i.series, "click", h(t, {
                        point: i
                    })), e.hoverPoint && i.firePointEvent("click", t)) : (h(t, this.getCoordinates(t)), e.isInsidePlot(t.chartX - o, t.chartY - n) && c(e, "click", t)))
                },
                setDOMEvents: function() {
                    var i = this,
                        o = i.chart.container;
                    o.onmousedown = function(t) {
                        i.onContainerMouseDown(t)
                    }, o.onmousemove = function(t) {
                        i.onContainerMouseMove(t)
                    }, o.onclick = function(t) {
                        i.onContainerClick(t)
                    }, e(o, "mouseleave", i.onContainerMouseLeave), 1 === t.chartCount && e(s, "mouseup", i.onDocumentMouseUp), t.hasTouch && (o.ontouchstart = function(t) {
                        i.onContainerTouchStart(t)
                    }, o.ontouchmove = function(t) {
                        i.onContainerTouchMove(t)
                    }, 1 === t.chartCount && e(s, "touchend", i.onDocumentTouchEnd))
                },
                destroy: function() {
                    var e = this;
                    e.unDocMouseMove && e.unDocMouseMove(), u(e.chart.container, "mouseleave", e.onContainerMouseLeave), t.chartCount || (u(s, "mouseup", e.onDocumentMouseUp), u(s, "touchend", e.onDocumentTouchEnd)), clearInterval(e.tooltipTimeout), t.objectEach(e, function(t, i) {
                        e[i] = null
                    })
                }
            }
        }(e),
        function(t) {
            var e = t.charts,
                i = t.each,
                o = t.extend,
                n = t.map,
                r = t.noop,
                a = t.pick,
                s = t.Pointer;
            o(s.prototype, {
                pinchTranslate: function(t, e, i, o, n, r) {
                    this.zoomHor && this.pinchTranslateDirection(!0, t, e, i, o, n, r), this.zoomVert && this.pinchTranslateDirection(!1, t, e, i, o, n, r)
                },
                pinchTranslateDirection: function(t, e, i, o, n, r, a, s) {
                    var l, h, c, d, p, u, g = this.chart,
                        f = t ? "x" : "y",
                        m = t ? "X" : "Y",
                        x = "chart" + m,
                        v = t ? "width" : "height",
                        y = g["plot" + (t ? "Left" : "Top")],
                        b = s || 1,
                        M = g.inverted,
                        w = g.bounds[t ? "h" : "v"],
                        k = 1 === e.length,
                        S = e[0][x],
                        A = i[0][x],
                        C = !k && e[1][x],
                        T = !k && i[1][x],
                        P = function() {
                            !k && Math.abs(S - C) > 20 && (b = s || Math.abs(A - T) / Math.abs(S - C)), c = (y - A) / b + S, l = g["plot" + (t ? "Width" : "Height")] / b
                        };
                    P(), (h = c) < w.min ? (h = w.min, d = !0) : h + l > w.max && (h = w.max - l, d = !0), d ? (A -= .8 * (A - a[f][0]), k || (T -= .8 * (T - a[f][1])), P()) : a[f] = [A, T], M || (r[f] = c - y, r[v] = l), u = M ? t ? "scaleY" : "scaleX" : "scale" + m, p = M ? 1 / b : b, n[v] = l, n[f] = h, o[u] = b, o["translate" + m] = p * y + (A - p * S)
                },
                pinch: function(t) {
                    var e = this,
                        s = e.chart,
                        l = e.pinchDown,
                        h = t.touches,
                        c = h.length,
                        d = e.lastValidTouch,
                        p = e.hasZoom,
                        u = e.selectionMarker,
                        g = {},
                        f = 1 === c && (e.inClass(t.target, "highcharts-tracker") && s.runTrackerClick || e.runChartClick),
                        m = {};
                    c > 1 && (e.initiated = !0), p && e.initiated && !f && t.preventDefault(), n(h, function(t) {
                        return e.normalize(t)
                    }), "touchstart" === t.type ? (i(h, function(t, e) {
                        l[e] = {
                            chartX: t.chartX,
                            chartY: t.chartY
                        }
                    }), d.x = [l[0].chartX, l[1] && l[1].chartX], d.y = [l[0].chartY, l[1] && l[1].chartY], i(s.axes, function(t) {
                        if (t.zoomEnabled) {
                            var e = s.bounds[t.horiz ? "h" : "v"],
                                i = t.minPixelPadding,
                                o = t.toPixels(a(t.options.min, t.dataMin)),
                                n = t.toPixels(a(t.options.max, t.dataMax)),
                                r = Math.min(o, n),
                                l = Math.max(o, n);
                            e.min = Math.min(t.pos, r - i), e.max = Math.max(t.pos + t.len, l + i)
                        }
                    }), e.res = !0) : e.followTouchMove && 1 === c ? this.runPointActions(e.normalize(t)) : l.length && (u || (e.selectionMarker = u = o({
                        destroy: r,
                        touch: !0
                    }, s.plotBox)), e.pinchTranslate(l, h, g, u, m, d), e.hasPinched = p, e.scaleGroups(g, m), e.res && (e.res = !1, this.reset(!1, 0)))
                },
                touch: function(e, i) {
                    var o, n, r = this.chart;
                    r.index !== t.hoverChartIndex && this.onContainerMouseLeave({
                        relatedTarget: !0
                    }), t.hoverChartIndex = r.index, 1 === e.touches.length ? (e = this.normalize(e), r.isInsidePlot(e.chartX - r.plotLeft, e.chartY - r.plotTop) && !r.openMenu ? (i && this.runPointActions(e), "touchmove" === e.type && (o = !!(n = this.pinchDown)[0] && Math.sqrt(Math.pow(n[0].chartX - e.chartX, 2) + Math.pow(n[0].chartY - e.chartY, 2)) >= 4), a(o, !0) && this.pinch(e)) : i && this.reset()) : 2 === e.touches.length && this.pinch(e)
                },
                onContainerTouchStart: function(t) {
                    this.zoomOption(t), this.touch(t, !0)
                },
                onContainerTouchMove: function(t) {
                    this.touch(t)
                },
                onDocumentTouchEnd: function(i) {
                    e[t.hoverChartIndex] && e[t.hoverChartIndex].pointer.drop(i)
                }
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.charts,
                o = t.css,
                n = t.doc,
                r = t.extend,
                a = t.hasTouch,
                s = t.noop,
                l = t.Pointer,
                h = t.removeEvent,
                c = t.win,
                d = t.wrap;
            if (!a && (c.PointerEvent || c.MSPointerEvent)) {
                var p = {},
                    u = !!c.PointerEvent,
                    g = function() {
                        var e = [];
                        return e.item = function(t) {
                            return this[t]
                        }, t.objectEach(p, function(t) {
                            e.push({
                                pageX: t.pageX,
                                pageY: t.pageY,
                                target: t.target
                            })
                        }), e
                    },
                    f = function(e, o, n, r) {
                        "touch" !== e.pointerType && e.pointerType !== e.MSPOINTER_TYPE_TOUCH || !i[t.hoverChartIndex] || (r(e), i[t.hoverChartIndex].pointer[o]({
                            type: n,
                            target: e.currentTarget,
                            preventDefault: s,
                            touches: g()
                        }))
                    };
                r(l.prototype, {
                    onContainerPointerDown: function(t) {
                        f(t, "onContainerTouchStart", "touchstart", function(t) {
                            p[t.pointerId] = {
                                pageX: t.pageX,
                                pageY: t.pageY,
                                target: t.currentTarget
                            }
                        })
                    },
                    onContainerPointerMove: function(t) {
                        f(t, "onContainerTouchMove", "touchmove", function(t) {
                            p[t.pointerId] = {
                                pageX: t.pageX,
                                pageY: t.pageY
                            }, p[t.pointerId].target || (p[t.pointerId].target = t.currentTarget)
                        })
                    },
                    onDocumentPointerUp: function(t) {
                        f(t, "onDocumentTouchEnd", "touchend", function(t) {
                            delete p[t.pointerId]
                        })
                    },
                    batchMSEvents: function(t) {
                        t(this.chart.container, u ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown), t(this.chart.container, u ? "pointermove" : "MSPointerMove", this.onContainerPointerMove), t(n, u ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
                    }
                }), d(l.prototype, "init", function(t, e, i) {
                    t.call(this, e, i), this.hasZoom && o(e.container, {
                        "-ms-touch-action": "none",
                        "touch-action": "none"
                    })
                }), d(l.prototype, "setDOMEvents", function(t) {
                    t.apply(this), (this.hasZoom || this.followTouchMove) && this.batchMSEvents(e)
                }), d(l.prototype, "destroy", function(t) {
                    this.batchMSEvents(h), t.call(this)
                })
            }
        }(e),
        function(t) {
            var e = t,
                i = e.addEvent,
                o = e.css,
                n = e.discardElement,
                r = e.defined,
                a = e.each,
                s = e.isFirefox,
                l = e.marginNames,
                h = e.merge,
                c = e.pick,
                d = e.setAnimation,
                p = e.stableSort,
                u = e.win,
                g = e.wrap;
            t.Legend = function(t, e) {
                this.init(t, e)
            }, t.Legend.prototype = {
                init: function(t, e) {
                    this.chart = t, this.setOptions(e), e.enabled && (this.render(), i(this.chart, "endResize", function() {
                        this.legend.positionCheckboxes()
                    }))
                },
                setOptions: function(t) {
                    var e = c(t.padding, 8);
                    this.options = t, this.itemStyle = t.itemStyle, this.itemHiddenStyle = h(this.itemStyle, t.itemHiddenStyle), this.itemMarginTop = t.itemMarginTop || 0, this.padding = e, this.initialItemY = e - 5, this.maxItemWidth = 0, this.itemHeight = 0, this.symbolWidth = c(t.symbolWidth, 16), this.pages = []
                },
                update: function(t, e) {
                    var i = this.chart;
                    this.setOptions(h(!0, this.options, t)), this.destroy(), i.isDirtyLegend = i.isDirtyBox = !0, c(e, !0) && i.redraw()
                },
                colorizeItem: function(t, i) {
                    t.legendGroup[i ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
                    var o = this,
                        n = o.options,
                        r = t.legendItem,
                        a = t.legendLine,
                        s = t.legendSymbol,
                        l = o.itemHiddenStyle.color,
                        h = i ? n.itemStyle.color : l,
                        c = i ? t.color || l : l,
                        d = t.options && t.options.marker,
                        p = {
                            fill: c
                        };
                    r && r.css({
                        fill: h,
                        color: h
                    }), a && a.attr({
                        stroke: c
                    }), s && (d && s.isMarker && (p = t.pointAttribs(), i || e.objectEach(p, function(t, e) {
                        p[e] = l
                    })), s.attr(p))
                },
                positionItem: function(t) {
                    var e = this,
                        i = e.options,
                        o = i.symbolPadding,
                        n = !i.rtl,
                        r = t._legendItemPos,
                        a = r[0],
                        s = r[1],
                        l = t.checkbox,
                        h = t.legendGroup;
                    h && h.element && h.translate(n ? a : e.legendWidth - a - 2 * o - 4, s), l && (l.x = a, l.y = s)
                },
                destroyItem: function(t) {
                    var e = t.checkbox;
                    a(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(e) {
                        t[e] && (t[e] = t[e].destroy())
                    }), e && n(t.checkbox)
                },
                destroy: function() {
                    function t(t) {
                        this[t] && (this[t] = this[t].destroy())
                    }
                    a(this.getAllItems(), function(e) {
                        a(["legendItem", "legendGroup"], t, e)
                    }), a(["clipRect", "up", "down", "pager", "nav", "box", "title", "group"], t, this), this.display = null
                },
                positionCheckboxes: function(t) {
                    var e, i = this.group && this.group.alignAttr,
                        n = this.clipHeight || this.legendHeight,
                        r = this.titleHeight;
                    i && (e = i.translateY, a(this.allItems, function(a) {
                        var s, l = a.checkbox;
                        l && (s = e + r + l.y + (t || 0) + 3, o(l, {
                            left: i.translateX + a.checkboxOffset + l.x - 20 + "px",
                            top: s + "px",
                            display: s > e - 6 && s < e + n - 6 ? "" : "none"
                        }))
                    }))
                },
                renderTitle: function() {
                    var t, e = this.options,
                        i = this.padding,
                        o = e.title,
                        n = 0;
                    o.text && (this.title || (this.title = this.chart.renderer.label(o.text, i - 3, i - 4, null, null, null, e.useHTML, null, "legend-title").attr({
                        zIndex: 1
                    }).css(o.style).add(this.group)), n = (t = this.title.getBBox()).height, this.offsetWidth = t.width, this.contentGroup.attr({
                        translateY: n
                    })), this.titleHeight = n
                },
                setText: function(t) {
                    var i = this.options;
                    t.legendItem.attr({
                        text: i.labelFormat ? e.format(i.labelFormat, t) : i.labelFormatter.call(t)
                    })
                },
                renderItem: function(t) {
                    var e, i, o, n = this,
                        r = n.chart,
                        a = r.renderer,
                        s = n.options,
                        l = "horizontal" === s.layout,
                        d = n.symbolWidth,
                        p = s.symbolPadding,
                        u = n.itemStyle,
                        g = n.itemHiddenStyle,
                        f = n.padding,
                        m = l ? c(s.itemDistance, 20) : 0,
                        x = !s.rtl,
                        v = s.width,
                        y = s.itemMarginBottom || 0,
                        b = n.itemMarginTop,
                        M = t.legendItem,
                        w = !t.series,
                        k = !w && t.series.drawLegendSymbol ? t.series : t,
                        S = k.options,
                        A = n.createCheckboxForItem && S && S.showCheckbox,
                        C = d + p + m + (A ? 20 : 0),
                        T = s.useHTML,
                        P = 12,
                        L = t.options.className;
                    M || (t.legendGroup = a.g("legend-item").addClass("highcharts-" + k.type + "-series highcharts-color-" + t.colorIndex + (L ? " " + L : "") + (w ? " highcharts-series-" + t.index : "")).attr({
                        zIndex: 1
                    }).add(n.scrollGroup), t.legendItem = M = a.text("", x ? d + p : -p, n.baseline || 0, T).css(h(t.visible ? u : g)).attr({
                        align: x ? "left" : "right",
                        zIndex: 2
                    }).add(t.legendGroup), n.baseline || (P = u.fontSize, n.fontMetrics = a.fontMetrics(P, M), n.baseline = n.fontMetrics.f + 3 + b, M.attr("y", n.baseline)), n.symbolHeight = s.symbolHeight || n.fontMetrics.f, k.drawLegendSymbol(n, t), n.setItemEvents && n.setItemEvents(t, M, T), A && n.createCheckboxForItem(t)), n.colorizeItem(t, t.visible), u.width || M.css({
                        width: (s.itemWidth || r.spacingBox.width) - C
                    }), n.setText(t), i = M.getBBox(), o = t.checkboxOffset = s.itemWidth || t.legendItemWidth || i.width + C, n.itemHeight = e = Math.round(t.legendItemHeight || i.height || n.symbolHeight), l && n.itemX - f + o > (v || r.spacingBox.width - 2 * f - s.x) && (n.itemX = f, n.itemY += b + n.lastLineHeight + y, n.lastLineHeight = 0), n.maxItemWidth = Math.max(n.maxItemWidth, o), n.lastItemY = b + n.itemY + y, n.lastLineHeight = Math.max(e, n.lastLineHeight), t._legendItemPos = [n.itemX, n.itemY], l ? n.itemX += o : (n.itemY += b + e + y, n.lastLineHeight = e), n.offsetWidth = v || Math.max((l ? n.itemX - f - m : o) + f, n.offsetWidth)
                },
                getAllItems: function() {
                    var t = [];
                    return a(this.chart.series, function(e) {
                        var i = e && e.options;
                        e && c(i.showInLegend, !r(i.linkedTo) && void 0, !0) && (t = t.concat(e.legendItems || ("point" === i.legendType ? e.data : e)))
                    }), t
                },
                adjustMargins: function(t, e) {
                    var i = this.chart,
                        o = this.options,
                        n = o.align.charAt(0) + o.verticalAlign.charAt(0) + o.layout.charAt(0);
                    o.floating || a([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(a, s) {
                        a.test(n) && !r(t[s]) && (i[l[s]] = Math.max(i[l[s]], i.legend[(s + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][s] * o[s % 2 ? "x" : "y"] + c(o.margin, 12) + e[s]))
                    })
                },
                render: function() {
                    var t, e, i, o, n = this,
                        r = n.chart,
                        s = r.renderer,
                        l = n.group,
                        c = n.box,
                        d = n.options,
                        u = n.padding;
                    n.itemX = u, n.itemY = n.initialItemY, n.offsetWidth = 0, n.lastItemY = 0, l || (n.group = l = s.g("legend").attr({
                        zIndex: 7
                    }).add(), n.contentGroup = s.g().attr({
                        zIndex: 1
                    }).add(l), n.scrollGroup = s.g().add(n.contentGroup)), n.renderTitle(), t = n.getAllItems(), p(t, function(t, e) {
                        return (t.options && t.options.legendIndex || 0) - (e.options && e.options.legendIndex || 0)
                    }), d.reversed && t.reverse(), n.allItems = t, n.display = e = !!t.length, n.lastLineHeight = 0, a(t, function(t) {
                        n.renderItem(t)
                    }), i = (d.width || n.offsetWidth) + u, o = n.lastItemY + n.lastLineHeight + n.titleHeight, o = n.handleOverflow(o), o += u, c || (n.box = c = s.rect().addClass("highcharts-legend-box").attr({
                        r: d.borderRadius
                    }).add(l), c.isNew = !0), c.attr({
                        stroke: d.borderColor,
                        "stroke-width": d.borderWidth || 0,
                        fill: d.backgroundColor || "none"
                    }).shadow(d.shadow), i > 0 && o > 0 && (c[c.isNew ? "attr" : "animate"](c.crisp({
                        x: 0,
                        y: 0,
                        width: i,
                        height: o
                    }, c.strokeWidth())), c.isNew = !1), c[e ? "show" : "hide"](), n.legendWidth = i, n.legendHeight = o, a(t, function(t) {
                        n.positionItem(t)
                    }), e && l.align(h(d, {
                        width: i,
                        height: o
                    }), !0, "spacingBox"), r.isResizing || this.positionCheckboxes()
                },
                handleOverflow: function(t) {
                    var e, i, o = this,
                        n = this.chart,
                        r = n.renderer,
                        s = this.options,
                        l = s.y,
                        h = "top" === s.verticalAlign,
                        d = this.padding,
                        p = n.spacingBox.height + (h ? -l : l) - d,
                        u = s.maxHeight,
                        g = this.clipRect,
                        f = s.navigation,
                        m = c(f.animation, !0),
                        x = f.arrowSize || 12,
                        v = this.nav,
                        y = this.pages,
                        b = this.allItems,
                        M = function(t) {
                            "number" == typeof t ? g.attr({
                                height: t
                            }) : g && (o.clipRect = g.destroy(), o.contentGroup.clip()), o.contentGroup.div && (o.contentGroup.div.style.clip = t ? "rect(" + d + "px,9999px," + (d + t) + "px,0)" : "auto")
                        };
                    return "horizontal" !== s.layout || "middle" === s.verticalAlign || s.floating || (p /= 2), u && (p = Math.min(p, u)), y.length = 0, t > p && !1 !== f.enabled ? (this.clipHeight = e = Math.max(p - 20 - this.titleHeight - d, 0), this.currentPage = c(this.currentPage, 1), this.fullHeight = t, a(b, function(t, o) {
                        var n = t._legendItemPos[1],
                            r = Math.round(t.legendItem.getBBox().height),
                            a = y.length;
                        (!a || n - y[a - 1] > e && (i || n) !== y[a - 1]) && (y.push(i || n), a++), o === b.length - 1 && n + r - y[a - 1] > e && y.push(n), n !== i && (i = n)
                    }), g || (g = o.clipRect = r.clipRect(0, d, 9999, 0), o.contentGroup.clip(g)), M(e), v || (this.nav = v = r.g().attr({
                        zIndex: 1
                    }).add(this.group), this.up = r.symbol("triangle", 0, 0, x, x).on("click", function() {
                        o.scroll(-1, m)
                    }).add(v), this.pager = r.text("", 15, 10).addClass("highcharts-legend-navigation").css(f.style).add(v), this.down = r.symbol("triangle-down", 0, 0, x, x).on("click", function() {
                        o.scroll(1, m)
                    }).add(v)), o.scroll(0), t = p) : v && (M(), this.nav = v.destroy(), this.scrollGroup.attr({
                        translateY: 1
                    }), this.clipHeight = 0), t
                },
                scroll: function(t, e) {
                    var i, o = this.pages,
                        n = o.length,
                        r = this.currentPage + t,
                        a = this.clipHeight,
                        s = this.options.navigation,
                        l = this.pager,
                        h = this.padding;
                    r > n && (r = n), r > 0 && (void 0 !== e && d(e, this.chart), this.nav.attr({
                        translateX: h,
                        translateY: a + this.padding + 7 + this.titleHeight,
                        visibility: "visible"
                    }), this.up.attr({
                        class: 1 === r ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                    }), l.attr({
                        text: r + "/" + n
                    }), this.down.attr({
                        x: 18 + this.pager.getBBox().width,
                        class: r === n ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                    }), this.up.attr({
                        fill: 1 === r ? s.inactiveColor : s.activeColor
                    }).css({
                        cursor: 1 === r ? "default" : "pointer"
                    }), this.down.attr({
                        fill: r === n ? s.inactiveColor : s.activeColor
                    }).css({
                        cursor: r === n ? "default" : "pointer"
                    }), i = -o[r - 1] + this.initialItemY, this.scrollGroup.animate({
                        translateY: i
                    }), this.currentPage = r, this.positionCheckboxes(i))
                }
            }, e.LegendSymbolMixin = {
                drawRectangle: function(t, e) {
                    var i = t.options,
                        o = t.symbolHeight,
                        n = i.squareSymbol,
                        r = n ? o : t.symbolWidth;
                    e.legendSymbol = this.chart.renderer.rect(n ? (t.symbolWidth - o) / 2 : 0, t.baseline - o + 1, r, o, c(t.options.symbolRadius, o / 2)).addClass("highcharts-point").attr({
                        zIndex: 3
                    }).add(e.legendGroup)
                },
                drawLineMarker: function(t) {
                    var e, i, o = this.options,
                        n = o.marker,
                        r = t.symbolWidth,
                        a = t.symbolHeight,
                        s = a / 2,
                        l = this.chart.renderer,
                        d = this.legendGroup,
                        p = t.baseline - Math.round(.3 * t.fontMetrics.b),
                        u = {};
                    u = {
                        "stroke-width": o.lineWidth || 0
                    }, o.dashStyle && (u.dashstyle = o.dashStyle), this.legendLine = l.path(["M", 0, p, "L", r, p]).addClass("highcharts-graph").attr(u).add(d), n && !1 !== n.enabled && (e = Math.min(c(n.radius, s), s), 0 === this.symbol.indexOf("url") && (n = h(n, {
                        width: a,
                        height: a
                    }), e = 0), this.legendSymbol = i = l.symbol(this.symbol, r / 2 - e, p - e, 2 * e, 2 * e, n).addClass("highcharts-point").add(d), i.isMarker = !0)
                }
            }, (/Trident\/7\.0/.test(u.navigator.userAgent) || s) && g(t.Legend.prototype, "positionItem", function(t, e) {
                var i = this,
                    o = function() {
                        e._legendItemPos && t.call(i, e)
                    };
                o(), setTimeout(o)
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.animate,
                o = t.animObject,
                n = t.attr,
                r = t.doc,
                a = t.Axis,
                s = t.createElement,
                l = t.defaultOptions,
                h = t.discardElement,
                c = t.charts,
                d = t.css,
                p = t.defined,
                u = t.each,
                g = t.extend,
                f = t.find,
                m = t.fireEvent,
                x = t.getStyle,
                v = t.grep,
                y = t.isNumber,
                b = t.isObject,
                M = t.isString,
                w = t.Legend,
                k = t.marginNames,
                S = t.merge,
                A = t.objectEach,
                C = t.Pointer,
                T = t.pick,
                P = t.pInt,
                L = t.removeEvent,
                D = t.seriesTypes,
                O = t.splat,
                I = t.svg,
                E = t.syncTimeout,
                z = t.win,
                B = t.Renderer,
                R = t.Chart = function() {
                    this.getArgs.apply(this, arguments)
                };
            t.chart = function(t, e, i) {
                return new R(t, e, i)
            }, g(R.prototype, {
                callbacks: [],
                getArgs: function() {
                    var t = [].slice.call(arguments);
                    (M(t[0]) || t[0].nodeName) && (this.renderTo = t.shift()), this.init(t[0], t[1])
                },
                init: function(i, o) {
                    var n, r, a = i.series,
                        s = i.plotOptions || {};
                    i.series = null, n = S(l, i);
                    for (r in n.plotOptions) n.plotOptions[r].tooltip = s[r] && S(s[r].tooltip) || void 0;
                    n.tooltip.userOptions = i.chart && i.chart.forExport && i.tooltip.userOptions || i.tooltip, n.series = i.series = a, this.userOptions = i;
                    var h = n.chart,
                        d = h.events;
                    this.margin = [], this.spacing = [], this.bounds = {
                        h: {},
                        v: {}
                    }, this.callback = o, this.isResizing = 0, this.options = n, this.axes = [], this.series = [], this.hasCartesianSeries = h.showAxes;
                    var p = this;
                    p.index = c.length, c.push(p), t.chartCount++, d && A(d, function(t, i) {
                        e(p, i, t)
                    }), p.xAxis = [], p.yAxis = [], p.pointCount = p.colorCounter = p.symbolCounter = 0, p.firstRender()
                },
                initSeries: function(e) {
                    var i, o = this.options.chart,
                        n = e.type || o.type || o.defaultSeriesType,
                        r = D[n];
                    return r || t.error(17, !0), (i = new r).init(this, e), i
                },
                orderSeries: function(t) {
                    for (var e = this.series, i = t || 0; i < e.length; i++) e[i] && (e[i].index = i, e[i].name = e[i].name || "Series " + (e[i].index + 1))
                },
                isInsidePlot: function(t, e, i) {
                    var o = i ? e : t,
                        n = i ? t : e;
                    return o >= 0 && o <= this.plotWidth && n >= 0 && n <= this.plotHeight
                },
                redraw: function(e) {
                    var i, o, n, r, a = this,
                        s = a.axes,
                        l = a.series,
                        h = a.pointer,
                        c = a.legend,
                        d = a.isDirtyLegend,
                        p = a.hasCartesianSeries,
                        f = a.isDirtyBox,
                        x = a.renderer,
                        v = x.isHidden(),
                        y = [];
                    for (a.setResponsive && a.setResponsive(!1), t.setAnimation(e, a), v && a.temporaryDisplay(), a.layOutTitles(), n = l.length; n--;)
                        if ((r = l[n]).options.stacking && (i = !0, r.isDirty)) {
                            o = !0;
                            break
                        }
                    if (o)
                        for (n = l.length; n--;)(r = l[n]).options.stacking && (r.isDirty = !0);
                    u(l, function(t) {
                        t.isDirty && "point" === t.options.legendType && (t.updateTotals && t.updateTotals(), d = !0), t.isDirtyData && m(t, "updatedData")
                    }), d && c.options.enabled && (c.render(), a.isDirtyLegend = !1), i && a.getStacks(), p && u(s, function(t) {
                        t.updateNames(), t.setScale()
                    }), a.getMargins(), p && (u(s, function(t) {
                        t.isDirty && (f = !0)
                    }), u(s, function(t) {
                        var e = t.min + "," + t.max;
                        t.extKey !== e && (t.extKey = e, y.push(function() {
                            m(t, "afterSetExtremes", g(t.eventArgs, t.getExtremes())), delete t.eventArgs
                        })), (f || i) && t.redraw()
                    })), f && a.drawChartBox(), m(a, "predraw"), u(l, function(t) {
                        (f || t.isDirty) && t.visible && t.redraw(), t.isDirtyData = !1
                    }), h && h.reset(!0), x.draw(), m(a, "redraw"), m(a, "render"), v && a.temporaryDisplay(!0), u(y, function(t) {
                        t.call()
                    })
                },
                get: function(t) {
                    function e(e) {
                        return e.id === t || e.options && e.options.id === t
                    }
                    var i, o, n = this.series;
                    for (i = f(this.axes, e) || f(this.series, e), o = 0; !i && o < n.length; o++) i = f(n[o].points || [], e);
                    return i
                },
                getAxes: function() {
                    var t, e = this,
                        i = this.options,
                        o = i.xAxis = O(i.xAxis || {}),
                        n = i.yAxis = O(i.yAxis || {});
                    u(o, function(t, e) {
                        t.index = e, t.isX = !0
                    }), u(n, function(t, e) {
                        t.index = e
                    }), t = o.concat(n), u(t, function(t) {
                        new a(e, t)
                    })
                },
                getSelectedPoints: function() {
                    var t = [];
                    return u(this.series, function(e) {
                        t = t.concat(v(e.data || [], function(t) {
                            return t.selected
                        }))
                    }), t
                },
                getSelectedSeries: function() {
                    return v(this.series, function(t) {
                        return t.selected
                    })
                },
                setTitle: function(t, e, i) {
                    var o, n, r = this,
                        a = r.options;
                    o = a.title = S({
                        style: {
                            color: "#333333",
                            fontSize: a.isStock ? "16px" : "18px"
                        }
                    }, a.title, t), n = a.subtitle = S({
                        style: {
                            color: "#666666"
                        }
                    }, a.subtitle, e), u([
                        ["title", t, o],
                        ["subtitle", e, n]
                    ], function(t, e) {
                        var i = t[0],
                            o = r[i],
                            n = t[1],
                            a = t[2];
                        o && n && (r[i] = o = o.destroy()), a && a.text && !o && (r[i] = r.renderer.text(a.text, 0, 0, a.useHTML).attr({
                            align: a.align,
                            class: "highcharts-" + i,
                            zIndex: a.zIndex || 4
                        }).add(), r[i].update = function(t) {
                            r.setTitle(!e && t, e && t)
                        }, r[i].css(a.style))
                    }), r.layOutTitles(i)
                },
                layOutTitles: function(t) {
                    var e, i = 0,
                        o = this.renderer,
                        n = this.spacingBox;
                    u(["title", "subtitle"], function(t) {
                        var e, r = this[t],
                            a = this.options[t],
                            s = "title" === t ? -3 : a.verticalAlign ? 0 : i + 2;
                        r && (e = a.style.fontSize, e = o.fontMetrics(e, r).b, r.css({
                            width: (a.width || n.width + a.widthAdjust) + "px"
                        }).align(g({
                            y: s + e
                        }, a), !1, "spacingBox"), a.floating || a.verticalAlign || (i = Math.ceil(i + r.getBBox(a.useHTML).height)))
                    }, this), e = this.titleOffset !== i, this.titleOffset = i, !this.isDirtyBox && e && (this.isDirtyBox = e, this.hasRendered && T(t, !0) && this.isDirtyBox && this.redraw())
                },
                getChartSize: function() {
                    var e = this,
                        i = e.options.chart,
                        o = i.width,
                        n = i.height,
                        r = e.renderTo;
                    p(o) || (e.containerWidth = x(r, "width")), p(n) || (e.containerHeight = x(r, "height")), e.chartWidth = Math.max(0, o || e.containerWidth || 600), e.chartHeight = Math.max(0, t.relativeLength(n, e.chartWidth) || e.containerHeight || 400)
                },
                temporaryDisplay: function(e) {
                    var i, o = this.renderTo;
                    if (e)
                        for (; o && o.style;) o.hcOrigStyle && (t.css(o, o.hcOrigStyle), delete o.hcOrigStyle), o = o.parentNode;
                    else
                        for (; o && o.style;) "none" === x(o, "display", !1) && (o.hcOrigStyle = {
                            display: o.style.display,
                            height: o.style.height,
                            overflow: o.style.overflow
                        }, i = {
                            display: "block",
                            overflow: "hidden"
                        }, o !== this.renderTo && (i.height = 0), t.css(o, i), o.style.setProperty && o.style.setProperty("display", "block", "important")), o = o.parentNode
                },
                setClassName: function(t) {
                    this.container.className = "highcharts-container " + (t || "")
                },
                getContainer: function() {
                    var e, i, o, a, l, h, d = this,
                        p = d.options,
                        u = p.chart,
                        f = d.renderTo,
                        m = t.uniqueKey();
                    f || (d.renderTo = f = u.renderTo), M(f) && (d.renderTo = f = r.getElementById(f)), f || t.error(13, !0), a = P(n(f, "data-highcharts-chart")), y(a) && c[a] && c[a].hasRendered && c[a].destroy(), n(f, "data-highcharts-chart", d.index), f.innerHTML = "", u.skipClone || f.offsetWidth || d.temporaryDisplay(), d.getChartSize(), i = d.chartWidth, o = d.chartHeight, h = g({
                        position: "relative",
                        overflow: "hidden",
                        width: i + "px",
                        height: o + "px",
                        textAlign: "left",
                        lineHeight: "normal",
                        zIndex: 0,
                        "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
                    }, u.style), e = s("div", {
                        id: m
                    }, h, f), d.container = e, d._cursor = e.style.cursor, l = t[u.renderer] || B, d.renderer = new l(e, i, o, null, u.forExport, p.exporting && p.exporting.allowHTML), d.setClassName(u.className), d.renderer.setStyle(u.style), d.renderer.chartIndex = d.index
                },
                getMargins: function(t) {
                    var e = this,
                        i = e.spacing,
                        o = e.margin,
                        n = e.titleOffset;
                    e.resetMargins(), n && !p(o[0]) && (e.plotTop = Math.max(e.plotTop, n + e.options.title.margin + i[0])), e.legend.display && e.legend.adjustMargins(o, i), e.extraMargin && (e[e.extraMargin.type] = (e[e.extraMargin.type] || 0) + e.extraMargin.value), e.extraTopMargin && (e.plotTop += e.extraTopMargin), t || this.getAxisMargins()
                },
                getAxisMargins: function() {
                    var t = this,
                        e = t.axisOffset = [0, 0, 0, 0],
                        i = t.margin;
                    t.hasCartesianSeries && u(t.axes, function(t) {
                        t.visible && t.getOffset()
                    }), u(k, function(o, n) {
                        p(i[n]) || (t[o] += e[n])
                    }), t.setChartSize()
                },
                reflow: function(t) {
                    var e = this,
                        i = e.options.chart,
                        o = e.renderTo,
                        n = p(i.width),
                        a = i.width || x(o, "width"),
                        s = i.height || x(o, "height"),
                        l = t ? t.target : z;
                    n || e.isPrinting || !a || !s || l !== z && l !== r || (a === e.containerWidth && s === e.containerHeight || (clearTimeout(e.reflowTimeout), e.reflowTimeout = E(function() {
                        e.container && e.setSize(void 0, void 0, !1)
                    }, t ? 100 : 0)), e.containerWidth = a, e.containerHeight = s)
                },
                initReflow: function() {
                    var t, i = this;
                    t = e(z, "resize", function(t) {
                        i.reflow(t)
                    }), e(i, "destroy", t)
                },
                setSize: function(e, n, r) {
                    var a, s = this,
                        l = s.renderer;
                    s.isResizing += 1, t.setAnimation(r, s), s.oldChartHeight = s.chartHeight, s.oldChartWidth = s.chartWidth, void 0 !== e && (s.options.chart.width = e), void 0 !== n && (s.options.chart.height = n), s.getChartSize(), ((a = l.globalAnimation) ? i : d)(s.container, {
                        width: s.chartWidth + "px",
                        height: s.chartHeight + "px"
                    }, a), s.setChartSize(!0), l.setSize(s.chartWidth, s.chartHeight, r), u(s.axes, function(t) {
                        t.isDirty = !0, t.setScale()
                    }), s.isDirtyLegend = !0, s.isDirtyBox = !0, s.layOutTitles(), s.getMargins(), s.redraw(r), s.oldChartHeight = null, m(s, "resize"), E(function() {
                        s && m(s, "endResize", null, function() {
                            s.isResizing -= 1
                        })
                    }, o(a).duration)
                },
                setChartSize: function(t) {
                    function e(t) {
                        var e = x[t] || 0;
                        return Math.max(l || e, e) / 2
                    }
                    var i, o, n, r, a, s, l, h = this,
                        c = h.inverted,
                        d = h.renderer,
                        p = h.chartWidth,
                        g = h.chartHeight,
                        f = h.options.chart,
                        m = h.spacing,
                        x = h.clipOffset;
                    h.plotLeft = n = Math.round(h.plotLeft), h.plotTop = r = Math.round(h.plotTop), h.plotWidth = a = Math.max(0, Math.round(p - n - h.marginRight)), h.plotHeight = s = Math.max(0, Math.round(g - r - h.marginBottom)), h.plotSizeX = c ? s : a, h.plotSizeY = c ? a : s, h.plotBorderWidth = f.plotBorderWidth || 0, h.spacingBox = d.spacingBox = {
                        x: m[3],
                        y: m[0],
                        width: p - m[3] - m[1],
                        height: g - m[0] - m[2]
                    }, h.plotBox = d.plotBox = {
                        x: n,
                        y: r,
                        width: a,
                        height: s
                    }, l = 2 * Math.floor(h.plotBorderWidth / 2), i = Math.ceil(e(3)), o = Math.ceil(e(0)), h.clipBox = {
                        x: i,
                        y: o,
                        width: Math.floor(h.plotSizeX - e(1) - i),
                        height: Math.max(0, Math.floor(h.plotSizeY - e(2) - o))
                    }, t || u(h.axes, function(t) {
                        t.setAxisSize(), t.setAxisTranslation()
                    })
                },
                resetMargins: function() {
                    var t = this,
                        e = t.options.chart;
                    u(["margin", "spacing"], function(i) {
                        var o = e[i],
                            n = b(o) ? o : [o, o, o, o];
                        u(["Top", "Right", "Bottom", "Left"], function(o, r) {
                            t[i][r] = T(e[i + o], n[r])
                        })
                    }), u(k, function(e, i) {
                        t[e] = T(t.margin[i], t.spacing[i])
                    }), t.axisOffset = [0, 0, 0, 0], t.clipOffset = []
                },
                drawChartBox: function() {
                    var t, e, i, o = this,
                        n = o.options.chart,
                        r = o.renderer,
                        a = o.chartWidth,
                        s = o.chartHeight,
                        l = o.chartBackground,
                        h = o.plotBackground,
                        c = o.plotBorder,
                        d = o.plotBGImage,
                        p = n.backgroundColor,
                        u = n.plotBackgroundColor,
                        g = n.plotBackgroundImage,
                        f = o.plotLeft,
                        m = o.plotTop,
                        x = o.plotWidth,
                        v = o.plotHeight,
                        y = o.plotBox,
                        b = o.clipRect,
                        M = o.clipBox,
                        w = "animate";
                    l || (o.chartBackground = l = r.rect().addClass("highcharts-background").add(), w = "attr"), e = (t = n.borderWidth || 0) + (n.shadow ? 8 : 0), i = {
                        fill: p || "none"
                    }, (t || l["stroke-width"]) && (i.stroke = n.borderColor, i["stroke-width"] = t), l.attr(i).shadow(n.shadow), l[w]({
                        x: e / 2,
                        y: e / 2,
                        width: a - e - t % 2,
                        height: s - e - t % 2,
                        r: n.borderRadius
                    }), w = "animate", h || (w = "attr", o.plotBackground = h = r.rect().addClass("highcharts-plot-background").add()), h[w](y), h.attr({
                        fill: u || "none"
                    }).shadow(n.plotShadow), g && (d ? d.animate(y) : o.plotBGImage = r.image(g, f, m, x, v).add()), b ? b.animate({
                        width: M.width,
                        height: M.height
                    }) : o.clipRect = r.clipRect(M), w = "animate", c || (w = "attr", o.plotBorder = c = r.rect().addClass("highcharts-plot-border").attr({
                        zIndex: 1
                    }).add()), c.attr({
                        stroke: n.plotBorderColor,
                        "stroke-width": n.plotBorderWidth || 0,
                        fill: "none"
                    }), c[w](c.crisp({
                        x: f,
                        y: m,
                        width: x,
                        height: v
                    }, -c.strokeWidth())), o.isDirtyBox = !1
                },
                propFromSeries: function() {
                    var t, e, i, o = this,
                        n = o.options.chart,
                        r = o.options.series;
                    u(["inverted", "angular", "polar"], function(a) {
                        for (t = D[n.type || n.defaultSeriesType], i = n[a] || t && t.prototype[a], e = r && r.length; !i && e--;)(t = D[r[e].type]) && t.prototype[a] && (i = !0);
                        o[a] = i
                    })
                },
                linkSeries: function() {
                    var t = this,
                        e = t.series;
                    u(e, function(t) {
                        t.linkedSeries.length = 0
                    }), u(e, function(e) {
                        var i = e.options.linkedTo;
                        M(i) && (i = ":previous" === i ? t.series[e.index - 1] : t.get(i)) && i.linkedParent !== e && (i.linkedSeries.push(e), e.linkedParent = i, e.visible = T(e.options.visible, i.options.visible, e.visible))
                    })
                },
                renderSeries: function() {
                    u(this.series, function(t) {
                        t.translate(), t.render()
                    })
                },
                renderLabels: function() {
                    var t = this,
                        e = t.options.labels;
                    e.items && u(e.items, function(i) {
                        var o = g(e.style, i.style),
                            n = P(o.left) + t.plotLeft,
                            r = P(o.top) + t.plotTop + 12;
                        delete o.left, delete o.top, t.renderer.text(i.html, n, r).attr({
                            zIndex: 2
                        }).css(o).add()
                    })
                },
                render: function() {
                    var t, e, i, o, n = this,
                        r = n.axes,
                        a = n.renderer,
                        s = n.options;
                    n.setTitle(), n.legend = new w(n, s.legend), n.getStacks && n.getStacks(), n.getMargins(!0), n.setChartSize(), t = n.plotWidth, e = n.plotHeight = n.plotHeight - 21, u(r, function(t) {
                        t.setScale()
                    }), n.getAxisMargins(), i = t / n.plotWidth > 1.1, o = e / n.plotHeight > 1.05, (i || o) && (u(r, function(t) {
                        (t.horiz && i || !t.horiz && o) && t.setTickInterval(!0)
                    }), n.getMargins()), n.drawChartBox(), n.hasCartesianSeries && u(r, function(t) {
                        t.visible && t.render()
                    }), n.seriesGroup || (n.seriesGroup = a.g("series-group").attr({
                        zIndex: 3
                    }).add()), n.renderSeries(), n.renderLabels(), n.addCredits(), n.setResponsive && n.setResponsive(), n.hasRendered = !0
                },
                addCredits: function(t) {
                    var e = this;
                    (t = S(!0, this.options.credits, t)).enabled && !this.credits && (this.credits = this.renderer.text(t.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
                        t.href && (z.location.href = t.href)
                    }).attr({
                        align: t.position.align,
                        zIndex: 8
                    }).css(t.style).add().align(t.position), this.credits.update = function(t) {
                        e.credits = e.credits.destroy(), e.addCredits(t)
                    })
                },
                destroy: function() {
                    var e, i = this,
                        o = i.axes,
                        n = i.series,
                        r = i.container,
                        a = r && r.parentNode;
                    for (m(i, "destroy"), i.renderer.forExport ? t.erase(c, i) : c[i.index] = void 0, t.chartCount--, i.renderTo.removeAttribute("data-highcharts-chart"), L(i), e = o.length; e--;) o[e] = o[e].destroy();
                    for (this.scroller && this.scroller.destroy && this.scroller.destroy(), e = n.length; e--;) n[e] = n[e].destroy();
                    u(["title", "subtitle", "chartBackground", "plotBackground", "plotBGImage", "plotBorder", "seriesGroup", "clipRect", "credits", "pointer", "rangeSelector", "legend", "resetZoomButton", "tooltip", "renderer"], function(t) {
                        var e = i[t];
                        e && e.destroy && (i[t] = e.destroy())
                    }), r && (r.innerHTML = "", L(r), a && h(r)), A(i, function(t, e) {
                        delete i[e]
                    })
                },
                isReadyToRender: function() {
                    var t = this;
                    return !(!I && z == z.top && "complete" !== r.readyState) || (r.attachEvent("onreadystatechange", function() {
                        r.detachEvent("onreadystatechange", t.firstRender), "complete" === r.readyState && t.firstRender()
                    }), !1)
                },
                firstRender: function() {
                    var t = this,
                        e = t.options;
                    t.isReadyToRender() && (t.getContainer(), m(t, "init"), t.resetMargins(), t.setChartSize(), t.propFromSeries(), t.getAxes(), u(e.series || [], function(e) {
                        t.initSeries(e)
                    }), t.linkSeries(), m(t, "beforeRender"), C && (t.pointer = new C(t, e)), t.render(), !t.renderer.imgCount && t.onload && t.onload(), t.temporaryDisplay(!0))
                },
                onload: function() {
                    u([this.callback].concat(this.callbacks), function(t) {
                        t && void 0 !== this.index && t.apply(this, [this])
                    }, this), m(this, "load"), m(this, "render"), p(this.index) && !1 !== this.options.chart.reflow && this.initReflow(), this.onload = null
                }
            })
        }(e),
        function(t) {
            var e = t.pick,
                i = t.relativeLength;
            t.CenteredSeriesMixin = {
                getCenter: function() {
                    var t, o, n, r = this.options,
                        a = this.chart,
                        s = 2 * (r.slicedOffset || 0),
                        l = a.plotWidth - 2 * s,
                        h = a.plotHeight - 2 * s,
                        c = r.center,
                        d = [e(c[0], "50%"), e(c[1], "50%"), r.size || "100%", r.innerSize || 0],
                        p = Math.min(l, h);
                    for (o = 0; o < 4; ++o) n = d[o], t = o < 2 || 2 === o && /%$/.test(n), d[o] = i(n, [l, h, p, d[2]][o]) + (t ? s : 0);
                    return d[3] > d[2] && (d[3] = d[2]), d
                }
            }
        }(e),
        function(t) {
            var e, i = t,
                o = i.each,
                n = i.extend,
                r = i.erase,
                a = i.fireEvent,
                s = i.format,
                l = i.isArray,
                h = i.isNumber,
                c = i.pick,
                d = i.removeEvent;
            t.Point = e = function() {}, t.Point.prototype = {
                init: function(t, e, i) {
                    var o, n, r = this,
                        a = t.chart.options.chart.colorCount;
                    return r.series = t, r.color = t.color, r.applyOptions(e, i), t.options.colorByPoint ? (o = t.options.colors || t.chart.options.colors, r.color = r.color || o[t.colorCounter], a = o.length, n = t.colorCounter, ++t.colorCounter === a && (t.colorCounter = 0)) : n = t.colorIndex, r.colorIndex = c(r.colorIndex, n), t.chart.pointCount++, r
                },
                applyOptions: function(t, i) {
                    var o = this,
                        r = o.series,
                        a = r.options.pointValKey || r.pointValKey;
                    return t = e.prototype.optionsToObject.call(this, t), n(o, t), o.options = o.options ? n(o.options, t) : t, t.group && delete o.group, a && (o.y = o[a]), o.isNull = c(o.isValid && !o.isValid(), null === o.x || !h(o.y, !0)), o.selected && (o.state = "select"), "name" in o && void 0 === i && r.xAxis && r.xAxis.hasNames && (o.x = r.xAxis.nameToX(o)), void 0 === o.x && r && (o.x = void 0 === i ? r.autoIncrement(o) : i), o
                },
                optionsToObject: function(t) {
                    var e, i = {},
                        o = this.series,
                        n = o.options.keys,
                        r = n || o.pointArrayMap || ["y"],
                        a = r.length,
                        s = 0,
                        c = 0;
                    if (h(t) || null === t) i[r[0]] = t;
                    else if (l(t))
                        for (!n && t.length > a && ("string" === (e = typeof t[0]) ? i.name = t[0] : "number" === e && (i.x = t[0]), s++); c < a;) n && void 0 === t[s] || (i[r[c]] = t[s]), s++, c++;
                    else "object" == typeof t && (i = t, t.dataLabels && (o._hasPointLabels = !0), t.marker && (o._hasPointMarkers = !0));
                    return i
                },
                getClassName: function() {
                    return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "")
                },
                getZone: function() {
                    var t, e = this.series,
                        i = e.zones,
                        o = e.zoneAxis || "y",
                        n = 0;
                    for (t = i[n]; this[o] >= t.value;) t = i[++n];
                    return t && t.color && !this.options.color && (this.color = t.color), t
                },
                destroy: function() {
                    var t, e = this,
                        i = e.series.chart,
                        o = i.hoverPoints;
                    i.pointCount--, o && (e.setState(), r(o, e), o.length || (i.hoverPoints = null)), e === i.hoverPoint && e.onMouseOut(), (e.graphic || e.dataLabel) && (d(e), e.destroyElements()), e.legendItem && i.legend.destroyItem(e);
                    for (t in e) e[t] = null
                },
                destroyElements: function() {
                    for (var t, e = this, i = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"], o = 6; o--;) e[t = i[o]] && (e[t] = e[t].destroy())
                },
                getLabelConfig: function() {
                    return {
                        x: this.category,
                        y: this.y,
                        color: this.color,
                        colorIndex: this.colorIndex,
                        key: this.name || this.category,
                        series: this.series,
                        point: this,
                        percentage: this.percentage,
                        total: this.total || this.stackTotal
                    }
                },
                tooltipFormatter: function(t) {
                    var e = this.series,
                        i = e.tooltipOptions,
                        n = c(i.valueDecimals, ""),
                        r = i.valuePrefix || "",
                        a = i.valueSuffix || "";
                    return o(e.pointArrayMap || ["y"], function(e) {
                        e = "{point." + e, (r || a) && (t = t.replace(e + "}", r + e + "}" + a)), t = t.replace(e + "}", e + ":,." + n + "f}")
                    }), s(t, {
                        point: this,
                        series: this.series
                    })
                },
                firePointEvent: function(t, e, i) {
                    var o = this,
                        n = this.series.options;
                    (n.point.events[t] || o.options && o.options.events && o.options.events[t]) && this.importEvents(), "click" === t && n.allowPointSelect && (i = function(t) {
                        o.select && o.select(null, t.ctrlKey || t.metaKey || t.shiftKey)
                    }), a(this, t, e, i)
                },
                visible: !0
            }
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.animObject,
                o = t.arrayMax,
                n = t.arrayMin,
                r = t.correctFloat,
                a = t.Date,
                s = t.defaultOptions,
                l = t.defaultPlotOptions,
                h = t.defined,
                c = t.each,
                d = t.erase,
                p = t.extend,
                u = t.fireEvent,
                g = t.grep,
                f = t.isArray,
                m = t.isNumber,
                x = t.isString,
                v = t.LegendSymbolMixin,
                y = t.merge,
                b = t.objectEach,
                M = t.pick,
                w = t.Point,
                k = t.removeEvent,
                S = t.splat,
                A = t.SVGElement,
                C = t.syncTimeout,
                T = t.win;
            t.Series = t.seriesType("line", null, {
                lineWidth: 2,
                allowPointSelect: !1,
                showCheckbox: !1,
                animation: {
                    duration: 1e3
                },
                events: {},
                marker: {
                    lineWidth: 0,
                    lineColor: "#ffffff",
                    radius: 4,
                    states: {
                        hover: {
                            animation: {
                                duration: 50
                            },
                            enabled: !0,
                            radiusPlus: 2,
                            lineWidthPlus: 1
                        },
                        select: {
                            fillColor: "#cccccc",
                            lineColor: "#000000",
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: "center",
                    formatter: function() {
                        return null === this.y ? "" : t.numberFormat(this.y, -1)
                    },
                    style: {
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "contrast",
                        textOutline: "1px contrast"
                    },
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                softThreshold: !0,
                states: {
                    hover: {
                        animation: {
                            duration: 50
                        },
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: .25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: !0,
                turboThreshold: 1e3,
                findNearestPointBy: "x"
            }, {
                isCartesian: !0,
                pointClass: w,
                sorted: !0,
                requireSorting: !0,
                directTouch: !1,
                axisTypes: ["xAxis", "yAxis"],
                colorCounter: 0,
                parallelArrays: ["x", "y"],
                coll: "series",
                init: function(t, i) {
                    var o, n, r = this,
                        a = t.series;
                    r.chart = t, r.options = i = r.setOptions(i), r.linkedSeries = [], r.bindAxes(), p(r, {
                        name: i.name,
                        state: "",
                        visible: !1 !== i.visible,
                        selected: !0 === i.selected
                    }), o = i.events, b(o, function(t, i) {
                        e(r, i, t)
                    }), (o && o.click || i.point && i.point.events && i.point.events.click || i.allowPointSelect) && (t.runTrackerClick = !0), r.getColor(), r.getSymbol(), c(r.parallelArrays, function(t) {
                        r[t + "Data"] = []
                    }), r.setData(i.data, !1), r.isCartesian && (t.hasCartesianSeries = !0), a.length && (n = a[a.length - 1]), r._i = M(n && n._i, -1) + 1, t.orderSeries(this.insert(a))
                },
                insert: function(t) {
                    var e, i = this.options.index;
                    if (m(i)) {
                        for (e = t.length; e--;)
                            if (i >= M(t[e].options.index, t[e]._i)) {
                                t.splice(e + 1, 0, this);
                                break
                            } - 1 === e && t.unshift(this), e += 1
                    } else t.push(this);
                    return M(e, t.length - 1)
                },
                bindAxes: function() {
                    var e, i = this,
                        o = i.options,
                        n = i.chart;
                    c(i.axisTypes || [], function(r) {
                        c(n[r], function(t) {
                            e = t.options, (o[r] === e.index || void 0 !== o[r] && o[r] === e.id || void 0 === o[r] && 0 === e.index) && (i.insert(t.series), i[r] = t, t.isDirty = !0)
                        }), i[r] || i.optionalAxis === r || t.error(18, !0)
                    })
                },
                updateParallelArrays: function(t, e) {
                    var i = t.series,
                        o = arguments,
                        n = m(e) ? function(o) {
                            var n = "y" === o && i.toYData ? i.toYData(t) : t[o];
                            i[o + "Data"][e] = n
                        } : function(t) {
                            Array.prototype[e].apply(i[t + "Data"], Array.prototype.slice.call(o, 2))
                        };
                    c(i.parallelArrays, n)
                },
                autoIncrement: function() {
                    var t, e, i = this.options,
                        o = this.xIncrement,
                        n = i.pointIntervalUnit;
                    return o = M(o, i.pointStart, 0), this.pointInterval = e = M(this.pointInterval, i.pointInterval, 1), n && (t = new a(o), "day" === n ? t = +t[a.hcSetDate](t[a.hcGetDate]() + e) : "month" === n ? t = +t[a.hcSetMonth](t[a.hcGetMonth]() + e) : "year" === n && (t = +t[a.hcSetFullYear](t[a.hcGetFullYear]() + e)), e = t - o), this.xIncrement = o + e, o
                },
                setOptions: function(t) {
                    var e, i, o = this.chart,
                        n = o.options,
                        r = n.plotOptions,
                        a = (o.userOptions || {}).plotOptions || {},
                        l = r[this.type];
                    return this.userOptions = t, e = y(l, r.series, t), this.tooltipOptions = y(s.tooltip, s.plotOptions.series && s.plotOptions.series.tooltip, s.plotOptions[this.type].tooltip, n.tooltip.userOptions, r.series && r.series.tooltip, r[this.type].tooltip, t.tooltip), this.stickyTracking = M(t.stickyTracking, a[this.type] && a[this.type].stickyTracking, a.series && a.series.stickyTracking, !(!this.tooltipOptions.shared || this.noSharedTooltip) || e.stickyTracking), null === l.marker && delete e.marker, this.zoneAxis = e.zoneAxis, i = this.zones = (e.zones || []).slice(), !e.negativeColor && !e.negativeFillColor || e.zones || i.push({
                        value: e[this.zoneAxis + "Threshold"] || e.threshold || 0,
                        className: "highcharts-negative",
                        color: e.negativeColor,
                        fillColor: e.negativeFillColor
                    }), i.length && h(i[i.length - 1].value) && i.push({
                        color: this.color,
                        fillColor: this.fillColor
                    }), e
                },
                getCyclic: function(t, e, i) {
                    var o, n, r = this.chart,
                        a = this.userOptions,
                        s = t + "Index",
                        l = t + "Counter",
                        c = i ? i.length : M(r.options.chart[t + "Count"], r[t + "Count"]);
                    e || (n = M(a[s], a["_" + s]), h(n) ? o = n : (r.series.length || (r[l] = 0), a["_" + s] = o = r[l] % c, r[l] += 1), i && (e = i[o])), void 0 !== o && (this[s] = o), this[t] = e
                },
                getColor: function() {
                    this.options.colorByPoint ? this.options.color = null : this.getCyclic("color", this.options.color || l[this.type].color, this.chart.options.colors)
                },
                getSymbol: function() {
                    var t = this.options.marker;
                    this.getCyclic("symbol", t.symbol, this.chart.options.symbols)
                },
                drawLegendSymbol: v.drawLineMarker,
                setData: function(e, i, o, n) {
                    var r, a, s, l = this,
                        h = l.points,
                        d = h && h.length || 0,
                        p = l.options,
                        u = l.chart,
                        g = null,
                        v = l.xAxis,
                        y = p.turboThreshold,
                        b = this.xData,
                        w = this.yData,
                        k = l.pointArrayMap,
                        S = k && k.length;
                    if (e = e || [], r = e.length, i = M(i, !0), !1 !== n && r && d === r && !l.cropped && !l.hasGroupedData && l.visible) c(e, function(t, e) {
                        h[e].update && t !== p.data[e] && h[e].update(t, !1, null, !1)
                    });
                    else {
                        if (l.xIncrement = null, l.colorCounter = 0, c(this.parallelArrays, function(t) {
                                l[t + "Data"].length = 0
                            }), y && r > y) {
                            for (a = 0; null === g && a < r;) g = e[a], a++;
                            if (m(g))
                                for (a = 0; a < r; a++) b[a] = this.autoIncrement(), w[a] = e[a];
                            else if (f(g))
                                if (S)
                                    for (a = 0; a < r; a++) s = e[a], b[a] = s[0], w[a] = s.slice(1, S + 1);
                                else
                                    for (a = 0; a < r; a++) s = e[a], b[a] = s[0], w[a] = s[1];
                            else t.error(12)
                        } else
                            for (a = 0; a < r; a++) void 0 !== e[a] && (s = {
                                series: l
                            }, l.pointClass.prototype.applyOptions.apply(s, [e[a]]), l.updateParallelArrays(s, a));
                        for (x(w[0]) && t.error(14, !0), l.data = [], l.options.data = l.userOptions.data = e, a = d; a--;) h[a] && h[a].destroy && h[a].destroy();
                        v && (v.minRange = v.userMinRange), l.isDirty = u.isDirtyBox = !0, l.isDirtyData = !!h, o = !1
                    }
                    "point" === p.legendType && (this.processData(), this.generatePoints()), i && u.redraw(o)
                },
                processData: function(e) {
                    var i, o, n, r, a, s, l, h, c = this,
                        d = c.xData,
                        p = c.yData,
                        u = d.length,
                        g = 0,
                        f = c.xAxis,
                        m = c.options,
                        x = m.cropThreshold,
                        v = c.getExtremesFromAll || m.getExtremesFromAll,
                        y = c.isCartesian,
                        b = f && f.val2lin,
                        M = f && f.isLog;
                    if (y && !c.isDirty && !f.isDirty && !c.yAxis.isDirty && !e) return !1;
                    for (f && (l = (s = f.getExtremes()).min, h = s.max), y && c.sorted && !v && (!x || u > x || c.forceCrop) && (d[u - 1] < l || d[0] > h ? (d = [], p = []) : (d[0] < l || d[u - 1] > h) && (d = (i = this.cropData(c.xData, c.yData, l, h)).xData, p = i.yData, g = i.start, o = !0)), a = d.length || 1; --a;)(n = M ? b(d[a]) - b(d[a - 1]) : d[a] - d[a - 1]) > 0 && (void 0 === r || n < r) ? r = n : n < 0 && c.requireSorting && t.error(15);
                    c.cropped = o, c.cropStart = g, c.processedXData = d, c.processedYData = p, c.closestPointRange = r
                },
                cropData: function(t, e, i, o) {
                    var n, r, a = t.length,
                        s = 0,
                        l = a,
                        h = M(this.cropShoulder, 1);
                    for (n = 0; n < a; n++)
                        if (t[n] >= i) {
                            s = Math.max(0, n - h);
                            break
                        }
                    for (r = n; r < a; r++)
                        if (t[r] > o) {
                            l = r + h;
                            break
                        }
                    return {
                        xData: t.slice(s, l),
                        yData: e.slice(s, l),
                        start: s,
                        end: l
                    }
                },
                generatePoints: function() {
                    var t, e, i, o, n = this,
                        r = n.options,
                        a = r.data,
                        s = n.data,
                        l = n.processedXData,
                        h = n.processedYData,
                        c = n.pointClass,
                        d = l.length,
                        p = n.cropStart || 0,
                        u = n.hasGroupedData,
                        g = r.keys,
                        f = [];
                    if (!s && !u) {
                        var m = [];
                        m.length = a.length, s = n.data = m
                    }
                    for (g && u && (n.options.keys = !1), o = 0; o < d; o++) e = p + o, u ? (i = (new c).init(n, [l[o]].concat(S(h[o])))).dataGroup = n.groupMap[o] : (i = s[e]) || void 0 === a[e] || (s[e] = i = (new c).init(n, a[e], l[o])), i && (i.index = e, f[o] = i);
                    if (n.options.keys = g, s && (d !== (t = s.length) || u))
                        for (o = 0; o < t; o++) o !== p || u || (o += d), s[o] && (s[o].destroyElements(), s[o].plotX = void 0);
                    n.data = s, n.points = f
                },
                getExtremes: function(t) {
                    var e, i, r, a, s, l, h, c = this.xAxis,
                        d = this.yAxis,
                        p = this.processedXData,
                        u = [],
                        g = 0,
                        x = c.getExtremes(),
                        v = x.min,
                        y = x.max;
                    for (e = (t = t || this.stackedYData || this.processedYData || []).length, l = 0; l < e; l++)
                        if (a = p[l], s = t[l], i = (m(s, !0) || f(s)) && (!d.positiveValuesOnly || s.length || s > 0), r = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (p[l] || a) >= v && (p[l] || a) <= y, i && r)
                            if (h = s.length)
                                for (; h--;) null !== s[h] && (u[g++] = s[h]);
                            else u[g++] = s;
                    this.dataMin = n(u), this.dataMax = o(u)
                },
                translate: function() {
                    this.processedXData || this.processData(), this.generatePoints();
                    var t, e, i, o, n, a = this,
                        s = a.options,
                        l = s.stacking,
                        c = a.xAxis,
                        d = c.categories,
                        p = a.yAxis,
                        u = a.points,
                        g = u.length,
                        f = !!a.modifyValue,
                        x = s.pointPlacement,
                        v = "between" === x || m(x),
                        y = s.threshold,
                        b = s.startFromThreshold ? y : 0,
                        w = Number.MAX_VALUE;
                    for ("between" === x && (x = .5), m(x) && (x *= M(s.pointRange || c.pointRange)), t = 0; t < g; t++) {
                        var k, S, A = u[t],
                            C = A.x,
                            T = A.y,
                            P = A.low,
                            L = l && p.stacks[(a.negStacks && T < (b ? 0 : y) ? "-" : "") + a.stackKey];
                        p.positiveValuesOnly && null !== T && T <= 0 && (A.isNull = !0), A.plotX = e = r(Math.min(Math.max(-1e5, c.translate(C, 0, 0, 0, 1, x, "flags" === this.type)), 1e5)), l && a.visible && !A.isNull && L && L[C] && (n = a.getStackIndicator(n, C, a.index), P = (S = (k = L[C]).points[n.key])[0], T = S[1], P === b && n.key === L[C].base && (P = M(y, p.min)), p.positiveValuesOnly && P <= 0 && (P = null), A.total = A.stackTotal = k.total, A.percentage = k.total && A.y / k.total * 100, A.stackY = T, k.setOffset(a.pointXOffset || 0, a.barW || 0)), A.yBottom = h(P) ? p.translate(P, 0, 1, 0, 1) : null, f && (T = a.modifyValue(T, A)), A.plotY = i = "number" == typeof T && T !== 1 / 0 ? Math.min(Math.max(-1e5, p.translate(T, 0, 1, 0, 1)), 1e5) : void 0, A.isInside = void 0 !== i && i >= 0 && i <= p.len && e >= 0 && e <= c.len, A.clientX = v ? r(c.translate(C, 0, 0, 0, 1, x)) : e, A.negative = A.y < (y || 0), A.category = d && void 0 !== d[A.x] ? d[A.x] : A.x, A.isNull || (void 0 !== o && (w = Math.min(w, Math.abs(e - o))), o = e), A.zone = this.zones.length && A.getZone()
                    }
                    a.closestPointRangePx = w
                },
                getValidPoints: function(t, e) {
                    var i = this.chart;
                    return g(t || this.points || [], function(t) {
                        return !(e && !i.isInsidePlot(t.plotX, t.plotY, i.inverted)) && !t.isNull
                    })
                },
                setClip: function(t) {
                    var e = this.chart,
                        i = this.options,
                        o = e.renderer,
                        n = e.inverted,
                        r = this.clipBox,
                        a = r || e.clipBox,
                        s = this.sharedClipKey || ["_sharedClip", t && t.duration, t && t.easing, a.height, i.xAxis, i.yAxis].join(","),
                        l = e[s],
                        h = e[s + "m"];
                    l || (t && (a.width = 0, e[s + "m"] = h = o.clipRect(-99, n ? -e.plotLeft : -e.plotTop, 99, n ? e.chartWidth : e.chartHeight)), e[s] = l = o.clipRect(a), l.count = {
                        length: 0
                    }), t && (l.count[this.index] || (l.count[this.index] = !0, l.count.length += 1)), !1 !== i.clip && (this.group.clip(t || r ? l : e.clipRect), this.markerGroup.clip(h), this.sharedClipKey = s), t || (l.count[this.index] && (delete l.count[this.index], l.count.length -= 1), 0 === l.count.length && s && e[s] && (r || (e[s] = e[s].destroy()), e[s + "m"] && (e[s + "m"] = e[s + "m"].destroy())))
                },
                animate: function(t) {
                    var e, o, n = this,
                        r = n.chart,
                        a = i(n.options.animation);
                    t ? n.setClip(a) : ((e = r[o = this.sharedClipKey]) && e.animate({
                        width: r.plotSizeX
                    }, a), r[o + "m"] && r[o + "m"].animate({
                        width: r.plotSizeX + 99
                    }, a), n.animate = null)
                },
                afterAnimate: function() {
                    this.setClip(), u(this, "afterAnimate")
                },
                drawPoints: function() {
                    var t, e, i, o, n, r, a, s, l, h, c = this,
                        d = c.points,
                        p = c.chart,
                        u = c.options.marker,
                        g = c[c.specialGroup] || c.markerGroup,
                        f = c.xAxis,
                        x = M(u.enabled, !!f.isRadial || null, c.closestPointRangePx >= 2 * u.radius);
                    if (!1 !== u.enabled || c._hasPointMarkers)
                        for (e = 0; e < d.length; e++) t = (i = d[e]).plotY, n = i.graphic, r = i.marker || {}, a = !!i.marker, s = x && void 0 === r.enabled || r.enabled, l = i.isInside, s && m(t) && null !== i.y ? (o = M(r.symbol, c.symbol), i.hasImage = 0 === o.indexOf("url"), h = c.markerAttribs(i, i.selected && "select"), n ? n[l ? "show" : "hide"](!0).animate(h) : l && (h.width > 0 || i.hasImage) && (i.graphic = n = p.renderer.symbol(o, h.x, h.y, h.width, h.height, a ? r : u).add(g)), n && n.attr(c.pointAttribs(i, i.selected && "select")), n && n.addClass(i.getClassName(), !0)) : n && (i.graphic = n.destroy())
                },
                markerAttribs: function(t, e) {
                    var i, o, n, r = this.options.marker,
                        a = t.marker || {},
                        s = M(a.radius, r.radius);
                    return e && (i = r.states[e], o = a.states && a.states[e], s = M(o && o.radius, i && i.radius, s + (i && i.radiusPlus || 0))), t.hasImage && (s = 0), n = {
                        x: Math.floor(t.plotX) - s,
                        y: t.plotY - s
                    }, s && (n.width = n.height = 2 * s), n
                },
                pointAttribs: function(t, e) {
                    var i, o, n, r, a = this.options.marker,
                        s = t && t.options,
                        l = s && s.marker || {},
                        h = this.color,
                        c = s && s.color,
                        d = t && t.color,
                        p = M(l.lineWidth, a.lineWidth),
                        u = t && t.zone && t.zone.color;
                    return h = c || u || d || h, n = l.fillColor || a.fillColor || h, r = l.lineColor || a.lineColor || h, e && (i = a.states[e], o = l.states && l.states[e] || {}, p = M(o.lineWidth, i.lineWidth, p + M(o.lineWidthPlus, i.lineWidthPlus, 0)), n = o.fillColor || i.fillColor || n, r = o.lineColor || i.lineColor || r), {
                        stroke: r,
                        "stroke-width": p,
                        fill: n
                    }
                },
                destroy: function() {
                    var t, e, i, o, n = this,
                        r = n.chart,
                        a = /AppleWebKit\/533/.test(T.navigator.userAgent),
                        s = n.data || [];
                    for (u(n, "destroy"), k(n), c(n.axisTypes || [], function(t) {
                            (o = n[t]) && o.series && (d(o.series, n), o.isDirty = o.forceRedraw = !0)
                        }), n.legendItem && n.chart.legend.destroyItem(n), e = s.length; e--;)(i = s[e]) && i.destroy && i.destroy();
                    n.points = null, clearTimeout(n.animationTimeout), b(n, function(e, i) {
                        e instanceof A && !e.survive && e[t = a && "group" === i ? "hide" : "destroy"]()
                    }), r.hoverSeries === n && (r.hoverSeries = null), d(r.series, n), r.orderSeries(), b(n, function(t, e) {
                        delete n[e]
                    })
                },
                getGraphPath: function(t, e, i) {
                    var o, n, r = this,
                        a = r.options,
                        s = a.step,
                        l = [],
                        d = [];
                    return t = t || r.points, (o = t.reversed) && t.reverse(), (s = {
                        right: 1,
                        center: 2
                    }[s] || s && 3) && o && (s = 4 - s), !a.connectNulls || e || i || (t = this.getValidPoints(t)), c(t, function(o, c) {
                        var p, u = o.plotX,
                            g = o.plotY,
                            f = t[c - 1];
                        (o.leftCliff || f && f.rightCliff) && !i && (n = !0), o.isNull && !h(e) && c > 0 ? n = !a.connectNulls : o.isNull && !e ? n = !0 : (0 === c || n ? p = ["M", o.plotX, o.plotY] : r.getPointSpline ? p = r.getPointSpline(t, o, c) : s ? (p = 1 === s ? ["L", f.plotX, g] : 2 === s ? ["L", (f.plotX + u) / 2, f.plotY, "L", (f.plotX + u) / 2, g] : ["L", u, f.plotY]).push("L", u, g) : p = ["L", u, g], d.push(o.x), s && d.push(o.x), l.push.apply(l, p), n = !1)
                    }), l.xMap = d, r.graphPath = l, l
                },
                drawGraph: function() {
                    var t = this,
                        e = this.options,
                        i = (this.gappedPath || this.getGraphPath).call(this),
                        o = [
                            ["graph", "highcharts-graph", e.lineColor || this.color, e.dashStyle]
                        ];
                    c(this.zones, function(i, n) {
                        o.push(["zone-graph-" + n, "highcharts-graph highcharts-zone-graph-" + n + " " + (i.className || ""), i.color || t.color, i.dashStyle || e.dashStyle])
                    }), c(o, function(o, n) {
                        var r, a = o[0],
                            s = t[a];
                        s ? (s.endX = i.xMap, s.animate({
                            d: i
                        })) : i.length && (t[a] = t.chart.renderer.path(i).addClass(o[1]).attr({
                            zIndex: 1
                        }).add(t.group), r = {
                            stroke: o[2],
                            "stroke-width": e.lineWidth,
                            fill: t.fillGraph && t.color || "none"
                        }, o[3] ? r.dashstyle = o[3] : "square" !== e.linecap && (r["stroke-linecap"] = r["stroke-linejoin"] = "round"), s = t[a].attr(r).shadow(n < 2 && e.shadow)), s && (s.startX = i.xMap, s.isArea = i.isArea)
                    })
                },
                applyZones: function() {
                    var t, e, i, o, n, r, a, s, l, h = this,
                        d = this.chart,
                        p = d.renderer,
                        u = this.zones,
                        g = this.clips || [],
                        f = this.graph,
                        m = this.area,
                        x = Math.max(d.chartWidth, d.chartHeight),
                        v = this[(this.zoneAxis || "y") + "Axis"],
                        y = d.inverted,
                        b = !1;
                    u.length && (f || m) && v && void 0 !== v.min && (n = v.reversed, r = v.horiz, f && f.hide(), m && m.hide(), o = v.getExtremes(), c(u, function(c, u) {
                        t = n ? r ? d.plotWidth : 0 : r ? 0 : v.toPixels(o.min), t = Math.min(Math.max(M(e, t), 0), x), e = Math.min(Math.max(Math.round(v.toPixels(M(c.value, o.max), !0)), 0), x), b && (t = e = v.toPixels(o.max)), a = Math.abs(t - e), s = Math.min(t, e), l = Math.max(t, e), v.isXAxis ? (i = {
                            x: y ? l : s,
                            y: 0,
                            width: a,
                            height: x
                        }, r || (i.x = d.plotHeight - i.x)) : (i = {
                            x: 0,
                            y: y ? l : s,
                            width: x,
                            height: a
                        }, r && (i.y = d.plotWidth - i.y)), y && p.isVML && (i = v.isXAxis ? {
                            x: 0,
                            y: n ? s : l,
                            height: i.width,
                            width: d.chartWidth
                        } : {
                            x: i.y - d.plotLeft - d.spacingBox.x,
                            y: 0,
                            width: i.height,
                            height: d.chartHeight
                        }), g[u] ? g[u].animate(i) : (g[u] = p.clipRect(i), f && h["zone-graph-" + u].clip(g[u]), m && h["zone-area-" + u].clip(g[u])), b = c.value > o.max
                    }), this.clips = g)
                },
                invertGroups: function(t) {
                    function i() {
                        c(["group", "markerGroup"], function(e) {
                            n[e] && (r.renderer.isVML && n[e].attr({
                                width: n.yAxis.len,
                                height: n.xAxis.len
                            }), n[e].width = n.yAxis.len, n[e].height = n.xAxis.len, n[e].invert(t))
                        })
                    }
                    var o, n = this,
                        r = n.chart;
                    n.xAxis && (o = e(r, "resize", i), e(n, "destroy", o), i(), n.invertGroups = i)
                },
                plotGroup: function(t, e, i, o, n) {
                    var r = this[t],
                        a = !r;
                    return a && (this[t] = r = this.chart.renderer.g().attr({
                        zIndex: o || .1
                    }).add(n)), r.addClass("highcharts-" + e + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series highcharts-color-" + this.colorIndex + " " + (this.options.className || ""), !0), r.attr({
                        visibility: i
                    })[a ? "attr" : "animate"](this.getPlotBox()), r
                },
                getPlotBox: function() {
                    var t = this.chart,
                        e = this.xAxis,
                        i = this.yAxis;
                    return t.inverted && (e = i, i = this.xAxis), {
                        translateX: e ? e.left : t.plotLeft,
                        translateY: i ? i.top : t.plotTop,
                        scaleX: 1,
                        scaleY: 1
                    }
                },
                render: function() {
                    var t, e = this,
                        o = e.chart,
                        n = e.options,
                        r = !!e.animate && o.renderer.isSVG && i(n.animation).duration,
                        a = e.visible ? "inherit" : "hidden",
                        s = n.zIndex,
                        l = e.hasRendered,
                        h = o.seriesGroup,
                        c = o.inverted;
                    t = e.plotGroup("group", "series", a, s, h), e.markerGroup = e.plotGroup("markerGroup", "markers", a, s, h), r && e.animate(!0), t.inverted = !!e.isCartesian && c, e.drawGraph && (e.drawGraph(), e.applyZones()), e.drawDataLabels && e.drawDataLabels(), e.visible && e.drawPoints(), e.drawTracker && !1 !== e.options.enableMouseTracking && e.drawTracker(), e.invertGroups(c), !1 === n.clip || e.sharedClipKey || l || t.clip(o.clipRect), r && e.animate(), l || (e.animationTimeout = C(function() {
                        e.afterAnimate()
                    }, r)), e.isDirty = !1, e.hasRendered = !0
                },
                redraw: function() {
                    var t = this,
                        e = t.chart,
                        i = t.isDirty || t.isDirtyData,
                        o = t.group,
                        n = t.xAxis,
                        r = t.yAxis;
                    o && (e.inverted && o.attr({
                        width: e.plotWidth,
                        height: e.plotHeight
                    }), o.animate({
                        translateX: M(n && n.left, e.plotLeft),
                        translateY: M(r && r.top, e.plotTop)
                    })), t.translate(), t.render(), i && delete this.kdTree
                },
                kdAxisArray: ["clientX", "plotY"],
                searchPoint: function(t, e) {
                    var i = this,
                        o = i.xAxis,
                        n = i.yAxis,
                        r = i.chart.inverted;
                    return this.searchKDTree({
                        clientX: r ? o.len - t.chartY + o.pos : t.chartX - o.pos,
                        plotY: r ? n.len - t.chartX + n.pos : t.chartY - n.pos
                    }, e)
                },
                buildKDTree: function() {
                    function t(e, o, n) {
                        var r, a, s = e && e.length;
                        if (s) return r = i.kdAxisArray[o % n], e.sort(function(t, e) {
                            return t[r] - e[r]
                        }), a = Math.floor(s / 2), {
                            point: e[a],
                            left: t(e.slice(0, a), o + 1, n),
                            right: t(e.slice(a + 1), o + 1, n)
                        }
                    }

                    function e() {
                        i.kdTree = t(i.getValidPoints(null, !i.directTouch), o, o), i.buildingKdTree = !1
                    }
                    this.buildingKdTree = !0;
                    var i = this,
                        o = i.options.findNearestPointBy.indexOf("y") > -1 ? 2 : 1;
                    delete i.kdTree, C(e, i.options.kdNow ? 0 : 1)
                },
                searchKDTree: function(t, e) {
                    function i(t, e) {
                        var i = h(t[r]) && h(e[r]) ? Math.pow(t[r] - e[r], 2) : null,
                            o = h(t[a]) && h(e[a]) ? Math.pow(t[a] - e[a], 2) : null,
                            n = (i || 0) + (o || 0);
                        e.dist = h(n) ? Math.sqrt(n) : Number.MAX_VALUE, e.distX = h(i) ? Math.sqrt(i) : Number.MAX_VALUE
                    }

                    function o(t, e, r, a) {
                        var l, h, c, d, p, u = e.point,
                            g = n.kdAxisArray[r % a],
                            f = u;
                        return i(t, u), l = t[g] - u[g], h = l < 0 ? "left" : "right", c = l < 0 ? "right" : "left", e[h] && (f = (d = o(t, e[h], r + 1, a))[s] < f[s] ? d : u), e[c] && Math.sqrt(l * l) < f[s] && (f = (p = o(t, e[c], r + 1, a))[s] < f[s] ? p : f), f
                    }
                    var n = this,
                        r = this.kdAxisArray[0],
                        a = this.kdAxisArray[1],
                        s = e ? "distX" : "dist",
                        l = n.options.findNearestPointBy.indexOf("y") > -1 ? 2 : 1;
                    if (this.kdTree || this.buildingKdTree || this.buildKDTree(), this.kdTree) return o(t, this.kdTree, l, l)
                }
            })
        }(e),
        function(t) {
            function e(t, e, i, o, n) {
                var r = t.chart.inverted;
                this.axis = t, this.isNegative = i, this.options = e, this.x = o, this.total = null, this.points = {}, this.stack = n, this.leftCliff = 0, this.rightCliff = 0, this.alignOptions = {
                    align: e.align || (r ? i ? "left" : "right" : "center"),
                    verticalAlign: e.verticalAlign || (r ? "middle" : i ? "bottom" : "top"),
                    y: c(e.y, r ? 4 : i ? 14 : -6),
                    x: c(e.x, r ? i ? -6 : 6 : 0)
                }, this.textAlign = e.textAlign || (r ? i ? "right" : "left" : "center")
            }
            var i = t.Axis,
                o = t.Chart,
                n = t.correctFloat,
                r = t.defined,
                a = t.destroyObjectProperties,
                s = t.each,
                l = t.format,
                h = t.objectEach,
                c = t.pick,
                d = t.Series;
            e.prototype = {
                destroy: function() {
                    a(this, this.axis)
                },
                render: function(t) {
                    var e = this.options,
                        i = e.format,
                        o = i ? l(i, this) : e.formatter.call(this);
                    this.label ? this.label.attr({
                        text: o,
                        visibility: "hidden"
                    }) : this.label = this.axis.chart.renderer.text(o, null, null, e.useHTML).css(e.style).attr({
                        align: this.textAlign,
                        rotation: e.rotation,
                        visibility: "hidden"
                    }).add(t)
                },
                setOffset: function(t, e) {
                    var i, o = this.axis,
                        n = o.chart,
                        r = n.inverted,
                        a = o.reversed,
                        s = this.isNegative && !a || !this.isNegative && a,
                        l = o.translate(o.usePercentage ? 100 : this.total, 0, 0, 0, 1),
                        h = o.translate(0),
                        c = Math.abs(l - h),
                        d = n.xAxis[0].translate(this.x) + t,
                        p = n.plotHeight,
                        u = {
                            x: r ? s ? l : l - c : d,
                            y: r ? p - d - e : s ? p - l - c : p - l,
                            width: r ? c : e,
                            height: r ? e : c
                        },
                        g = this.label;
                    g && (g.align(this.alignOptions, null, u), i = g.alignAttr, g[!1 === this.options.crop || n.isInsidePlot(i.x, i.y) ? "show" : "hide"](!0))
                }
            }, o.prototype.getStacks = function() {
                var t = this;
                s(t.yAxis, function(t) {
                    t.stacks && t.hasVisibleSeries && (t.oldStacks = t.stacks)
                }), s(t.series, function(e) {
                    !e.options.stacking || !0 !== e.visible && !1 !== t.options.chart.ignoreHiddenSeries || (e.stackKey = e.type + c(e.options.stack, ""))
                })
            }, i.prototype.buildStacks = function() {
                var t, e, i = this.series,
                    o = c(this.options.reversedStacks, !0),
                    n = i.length;
                if (!this.isXAxis) {
                    for (this.usePercentage = !1, e = n; e--;) i[o ? e : n - e - 1].setStackedPoints();
                    for (e = n; e--;)(t = i[o ? e : n - e - 1]).setStackCliffs && t.setStackCliffs();
                    if (this.usePercentage)
                        for (e = 0; e < n; e++) i[e].setPercentStacks()
                }
            }, i.prototype.renderStackTotals = function() {
                var t = this,
                    e = t.chart,
                    i = e.renderer,
                    o = t.stacks,
                    n = t.stackTotalGroup;
                n || (t.stackTotalGroup = n = i.g("stack-labels").attr({
                    visibility: "visible",
                    zIndex: 6
                }).add()), n.translate(e.plotLeft, e.plotTop), h(o, function(t) {
                    h(t, function(t) {
                        t.render(n)
                    })
                })
            }, i.prototype.resetStacks = function() {
                var t = this,
                    e = t.stacks;
                t.isXAxis || h(e, function(e) {
                    h(e, function(i, o) {
                        i.touched < t.stacksTouched ? (i.destroy(), delete e[o]) : (i.total = null, i.cum = null)
                    })
                })
            }, i.prototype.cleanStacks = function() {
                var t;
                this.isXAxis || (this.oldStacks && (t = this.stacks = this.oldStacks), h(t, function(t) {
                    h(t, function(t) {
                        t.cum = t.total
                    })
                }))
            }, d.prototype.setStackedPoints = function() {
                if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                    var t, i, o, a, s, l, h, d, p, u = this,
                        g = u.processedXData,
                        f = u.processedYData,
                        m = [],
                        x = f.length,
                        v = u.options,
                        y = v.threshold,
                        b = v.startFromThreshold ? y : 0,
                        M = v.stack,
                        w = v.stacking,
                        k = u.stackKey,
                        S = "-" + k,
                        A = u.negStacks,
                        C = u.yAxis,
                        T = C.stacks,
                        P = C.oldStacks;
                    for (C.stacksTouched += 1, h = 0; h < x; h++) d = g[h], p = f[h], l = (t = u.getStackIndicator(t, d, u.index)).key, T[s = (i = A && p < (b ? 0 : y)) ? S : k] || (T[s] = {}), T[s][d] || (P[s] && P[s][d] ? (T[s][d] = P[s][d], T[s][d].total = null) : T[s][d] = new e(C, C.options.stackLabels, i, d, M)), o = T[s][d], null !== p && (o.points[l] = o.points[u.index] = [c(o.cum, b)], r(o.cum) || (o.base = l), o.touched = C.stacksTouched, t.index > 0 && !1 === u.singleStacks && (o.points[l][0] = o.points[u.index + "," + d + ",0"][0])), "percent" === w ? (a = i ? k : S, A && T[a] && T[a][d] ? (a = T[a][d], o.total = a.total = Math.max(a.total, o.total) + Math.abs(p) || 0) : o.total = n(o.total + (Math.abs(p) || 0))) : o.total = n(o.total + (p || 0)), o.cum = c(o.cum, b) + (p || 0), null !== p && (o.points[l].push(o.cum), m[h] = o.cum);
                    "percent" === w && (C.usePercentage = !0), this.stackedYData = m, C.oldStacks = {}
                }
            }, d.prototype.setPercentStacks = function() {
                var t, e = this,
                    i = e.stackKey,
                    o = e.yAxis.stacks,
                    r = e.processedXData;
                s([i, "-" + i], function(i) {
                    for (var a, s, l, h, c = r.length; c--;) a = r[c], t = e.getStackIndicator(t, a, e.index, i), (l = (s = o[i] && o[i][a]) && s.points[t.key]) && (h = s.total ? 100 / s.total : 0, l[0] = n(l[0] * h), l[1] = n(l[1] * h), e.stackedYData[c] = l[1])
                })
            }, d.prototype.getStackIndicator = function(t, e, i, o) {
                return !r(t) || t.x !== e || o && t.key !== o ? t = {
                    x: e,
                    index: 0,
                    key: o
                } : t.index++, t.key = [i, e, t.index].join(","), t
            }
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.animate,
                o = t.Axis,
                n = t.Chart,
                r = t.createElement,
                a = t.css,
                s = t.defined,
                l = t.each,
                h = t.erase,
                c = t.extend,
                d = t.fireEvent,
                p = t.inArray,
                u = t.isNumber,
                g = t.isObject,
                f = t.isArray,
                m = t.merge,
                x = t.objectEach,
                v = t.pick,
                y = t.Point,
                b = t.Series,
                M = t.seriesTypes,
                w = t.setAnimation,
                k = t.splat;
            c(n.prototype, {
                addSeries: function(t, e, i) {
                    var o, n = this;
                    return t && (e = v(e, !0), d(n, "addSeries", {
                        options: t
                    }, function() {
                        o = n.initSeries(t), n.isDirtyLegend = !0, n.linkSeries(), e && n.redraw(i)
                    })), o
                },
                addAxis: function(t, e, i, n) {
                    var r = e ? "xAxis" : "yAxis",
                        a = this.options,
                        s = m(t, {
                            index: this[r].length,
                            isX: e
                        });
                    new o(this, s), a[r] = k(a[r] || {}), a[r].push(s), v(i, !0) && this.redraw(n)
                },
                showLoading: function(t) {
                    var o = this,
                        n = o.options,
                        s = o.loadingDiv,
                        l = n.loading,
                        h = function() {
                            s && a(s, {
                                left: o.plotLeft + "px",
                                top: o.plotTop + "px",
                                width: o.plotWidth + "px",
                                height: o.plotHeight + "px"
                            })
                        };
                    s || (o.loadingDiv = s = r("div", {
                        className: "highcharts-loading highcharts-loading-hidden"
                    }, null, o.container), o.loadingSpan = r("span", {
                        className: "highcharts-loading-inner"
                    }, null, s), e(o, "redraw", h)), s.className = "highcharts-loading", o.loadingSpan.innerHTML = t || n.lang.loading, a(s, c(l.style, {
                        zIndex: 10
                    })), a(o.loadingSpan, l.labelStyle), o.loadingShown || (a(s, {
                        opacity: 0,
                        display: ""
                    }), i(s, {
                        opacity: l.style.opacity || .5
                    }, {
                        duration: l.showDuration || 0
                    })), o.loadingShown = !0, h()
                },
                hideLoading: function() {
                    var t = this.options,
                        e = this.loadingDiv;
                    e && (e.className = "highcharts-loading highcharts-loading-hidden", i(e, {
                        opacity: 0
                    }, {
                        duration: t.loading.hideDuration || 100,
                        complete: function() {
                            a(e, {
                                display: "none"
                            })
                        }
                    })), this.loadingShown = !1
                },
                propsRequireDirtyBox: ["backgroundColor", "borderColor", "borderWidth", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "spacing", "spacingTop", "spacingRight", "spacingBottom", "spacingLeft", "borderRadius", "plotBackgroundColor", "plotBackgroundImage", "plotBorderColor", "plotBorderWidth", "plotShadow", "shadow"],
                propsRequireUpdateSeries: ["chart.inverted", "chart.polar", "chart.ignoreHiddenSeries", "chart.type", "colors", "plotOptions", "tooltip"],
                update: function(t, e) {
                    var i, o, n, r, a = this,
                        h = {
                            credits: "addCredits",
                            title: "setTitle",
                            subtitle: "setSubtitle"
                        },
                        c = t.chart;
                    c && (m(!0, a.options.chart, c), "className" in c && a.setClassName(c.className), ("inverted" in c || "polar" in c) && (a.propFromSeries(), i = !0), "alignTicks" in c && (i = !0), x(c, function(t, e) {
                        -1 !== p("chart." + e, a.propsRequireUpdateSeries) && (o = !0), -1 !== p(e, a.propsRequireDirtyBox) && (a.isDirtyBox = !0)
                    }), "style" in c && a.renderer.setStyle(c.style)), t.colors && (this.options.colors = t.colors), t.plotOptions && m(!0, this.options.plotOptions, t.plotOptions), x(t, function(t, e) {
                        a[e] && "function" == typeof a[e].update ? a[e].update(t, !1) : "function" == typeof a[h[e]] && a[h[e]](t), "chart" !== e && -1 !== p(e, a.propsRequireUpdateSeries) && (o = !0)
                    }), l(["xAxis", "yAxis", "zAxis", "series", "colorAxis", "pane"], function(e) {
                        t[e] && l(k(t[e]), function(t, i) {
                            var o = s(t.id) && a.get(t.id) || a[e][i];
                            o && o.coll === e && o.update(t, !1)
                        })
                    }), i && l(a.axes, function(t) {
                        t.update({}, !1)
                    }), o && l(a.series, function(t) {
                        t.update({}, !1)
                    }), t.loading && m(!0, a.options.loading, t.loading), n = c && c.width, r = c && c.height, u(n) && n !== a.chartWidth || u(r) && r !== a.chartHeight ? a.setSize(n, r) : v(e, !0) && a.redraw()
                },
                setSubtitle: function(t) {
                    this.setTitle(void 0, t)
                }
            }), c(y.prototype, {
                update: function(t, e, i, o) {
                    function n() {
                        a.applyOptions(t), null === a.y && l && (a.graphic = l.destroy()), g(t, !0) && (l && l.element && t && t.marker && t.marker.symbol && (a.graphic = l.destroy()), t && t.dataLabels && a.dataLabel && (a.dataLabel = a.dataLabel.destroy())), r = a.index, s.updateParallelArrays(a, r), c.data[r] = g(c.data[r], !0) || g(t, !0) ? a.options : t, s.isDirty = s.isDirtyData = !0, !s.fixedBox && s.hasCartesianSeries && (h.isDirtyBox = !0), "point" === c.legendType && (h.isDirtyLegend = !0), e && h.redraw(i)
                    }
                    var r, a = this,
                        s = a.series,
                        l = a.graphic,
                        h = s.chart,
                        c = s.options;
                    e = v(e, !0), !1 === o ? n() : a.firePointEvent("update", {
                        options: t
                    }, n)
                },
                remove: function(t, e) {
                    this.series.removePoint(p(this, this.series.data), t, e)
                }
            }), c(b.prototype, {
                addPoint: function(t, e, i, o) {
                    var n, r, a, s, l = this,
                        h = l.options,
                        c = l.data,
                        d = l.chart,
                        p = l.xAxis,
                        u = p && p.hasNames && p.names,
                        g = h.data,
                        f = l.xData;
                    if (e = v(e, !0), n = {
                            series: l
                        }, l.pointClass.prototype.applyOptions.apply(n, [t]), s = n.x, a = f.length, l.requireSorting && s < f[a - 1])
                        for (r = !0; a && f[a - 1] > s;) a--;
                    l.updateParallelArrays(n, "splice", a, 0, 0), l.updateParallelArrays(n, a), u && n.name && (u[s] = n.name), g.splice(a, 0, t), r && (l.data.splice(a, 0, null), l.processData()), "point" === h.legendType && l.generatePoints(), i && (c[0] && c[0].remove ? c[0].remove(!1) : (c.shift(), l.updateParallelArrays(n, "shift"), g.shift())), l.isDirty = !0, l.isDirtyData = !0, e && d.redraw(o)
                },
                removePoint: function(t, e, i) {
                    var o = this,
                        n = o.data,
                        r = n[t],
                        a = o.points,
                        s = o.chart,
                        l = function() {
                            a && a.length === n.length && a.splice(t, 1), n.splice(t, 1), o.options.data.splice(t, 1), o.updateParallelArrays(r || {
                                series: o
                            }, "splice", t, 1), r && r.destroy(), o.isDirty = !0, o.isDirtyData = !0, e && s.redraw()
                        };
                    w(i, s), e = v(e, !0), r ? r.firePointEvent("remove", null, l) : l()
                },
                remove: function(t, e, i) {
                    function o() {
                        n.destroy(), r.isDirtyLegend = r.isDirtyBox = !0, r.linkSeries(), v(t, !0) && r.redraw(e)
                    }
                    var n = this,
                        r = n.chart;
                    !1 !== i ? d(n, "remove", null, o) : o()
                },
                update: function(t, e) {
                    var i, o = this,
                        n = o.chart,
                        r = o.userOptions,
                        a = o.oldType || o.type,
                        s = t.type || r.type || n.options.chart.type,
                        h = M[a].prototype,
                        d = ["group", "markerGroup", "dataLabelsGroup"];
                    if (Object.keys && "data" === Object.keys(t).toString()) return this.setData(t.data, e);
                    (s && s !== a || void 0 !== t.zIndex) && (d.length = 0), l(d, function(t) {
                        d[t] = o[t], delete o[t]
                    }), t = m(r, {
                        animation: !1,
                        index: o.index,
                        pointStart: o.xData[0]
                    }, {
                        data: o.options.data
                    }, t), o.remove(!1, null, !1);
                    for (i in h) o[i] = void 0;
                    c(o, M[s || a].prototype), l(d, function(t) {
                        o[t] = d[t]
                    }), o.init(n, t), o.oldType = a, n.linkSeries(), v(e, !0) && n.redraw(!1)
                }
            }), c(o.prototype, {
                update: function(t, e) {
                    var i = this.chart;
                    t = i.options[this.coll][this.options.index] = m(this.userOptions, t), this.destroy(!0), this.init(i, c(t, {
                        events: void 0
                    })), i.isDirtyBox = !0, v(e, !0) && i.redraw()
                },
                remove: function(t) {
                    for (var e = this.chart, i = this.coll, o = this.series, n = o.length; n--;) o[n] && o[n].remove(!1);
                    h(e.axes, this), h(e[i], this), f(e.options[i]) ? e.options[i].splice(this.options.index, 1) : delete e.options[i], l(e[i], function(t, e) {
                        t.options.index = e
                    }), this.destroy(), e.isDirtyBox = !0, v(t, !0) && e.redraw()
                },
                setTitle: function(t, e) {
                    this.update({
                        title: t
                    }, e)
                },
                setCategories: function(t, e) {
                    this.update({
                        categories: t
                    }, e)
                }
            })
        }(e),
        function(t) {
            var e = t.color,
                i = t.each,
                o = t.LegendSymbolMixin,
                n = t.map,
                r = t.pick,
                a = t.Series;
            (0, t.seriesType)("area", "line", {
                softThreshold: !1,
                threshold: 0
            }, {
                singleStacks: !1,
                getStackPoints: function() {
                    var e, o, a = this,
                        s = [],
                        l = [],
                        h = this.xAxis,
                        c = this.yAxis,
                        d = c.stacks[this.stackKey],
                        p = {},
                        u = this.points,
                        g = a.index,
                        f = c.series,
                        m = f.length,
                        x = r(c.options.reversedStacks, !0) ? 1 : -1;
                    if (this.options.stacking) {
                        for (o = 0; o < u.length; o++) p[u[o].x] = u[o];
                        t.objectEach(d, function(t, e) {
                            null !== t.total && l.push(e)
                        }), l.sort(function(t, e) {
                            return t - e
                        }), e = n(f, function() {
                            return this.visible
                        }), i(l, function(t, n) {
                            var r, a, u = 0;
                            if (p[t] && !p[t].isNull) s.push(p[t]), i([-1, 1], function(i) {
                                var s = 1 === i ? "rightNull" : "leftNull",
                                    h = 1 === i ? "rightCliff" : "leftCliff",
                                    c = 0,
                                    u = d[l[n + i]];
                                if (u)
                                    for (o = g; o >= 0 && o < m;)(r = u.points[o]) || (o === g ? p[t][s] = !0 : e[o] && (a = d[t].points[o]) && (c -= a[1] - a[0])), o += x;
                                p[t][h] = c
                            });
                            else {
                                for (o = g; o >= 0 && o < m;) {
                                    if (r = d[t].points[o]) {
                                        u = r[1];
                                        break
                                    }
                                    o += x
                                }
                                u = c.translate(u, 0, 1, 0, 1), s.push({
                                    isNull: !0,
                                    plotX: h.translate(t, 0, 0, 0, 1),
                                    x: t,
                                    plotY: u,
                                    yBottom: u
                                })
                            }
                        })
                    }
                    return s
                },
                getGraphPath: function(t) {
                    var e, i, o, n, s, l, h, c, d = a.prototype.getGraphPath,
                        p = this.options,
                        u = p.stacking,
                        g = this.yAxis,
                        f = [],
                        m = [],
                        x = this.index,
                        v = g.stacks[this.stackKey],
                        y = p.threshold,
                        b = g.getThreshold(p.threshold),
                        M = p.connectNulls || "percent" === u,
                        w = function(e, i, o) {
                            var n, r, a = t[e],
                                s = u && v[a.x].points[x],
                                h = a[o + "Null"] || 0,
                                c = a[o + "Cliff"] || 0,
                                d = !0;
                            c || h ? (n = (h ? s[0] : s[1]) + c, r = s[0] + c, d = !!h) : !u && t[i] && t[i].isNull && (n = r = y), void 0 !== n && (m.push({
                                plotX: l,
                                plotY: null === n ? b : g.getThreshold(n),
                                isNull: d,
                                isCliff: !0
                            }), f.push({
                                plotX: l,
                                plotY: null === r ? b : g.getThreshold(r),
                                doCurve: !1
                            }))
                        };
                    for (t = t || this.points, u && (t = this.getStackPoints()), n = 0; n < t.length; n++) h = t[n].isNull, l = r(t[n].rectPlotX, t[n].plotX), c = r(t[n].yBottom, b), h && !M || (M || w(n, n - 1, "left"), h && !u && M || (m.push(t[n]), f.push({
                        x: n,
                        plotX: l,
                        plotY: c
                    })), M || w(n, n + 1, "right"));
                    return i = d.call(this, m, !0, !0), f.reversed = !0, (o = d.call(this, f, !0, !0)).length && (o[0] = "L"), s = i.concat(o), e = d.call(this, m, !1, M), s.xMap = i.xMap, this.areaPath = s, e
                },
                drawGraph: function() {
                    this.areaPath = [], a.prototype.drawGraph.apply(this);
                    var t = this,
                        o = this.areaPath,
                        n = this.options,
                        s = this.zones,
                        l = [
                            ["area", "highcharts-area", this.color, n.fillColor]
                        ];
                    i(s, function(e, i) {
                        l.push(["zone-area-" + i, "highcharts-area highcharts-zone-area-" + i + " " + e.className, e.color || t.color, e.fillColor || n.fillColor])
                    }), i(l, function(i) {
                        var a = i[0],
                            s = t[a];
                        s ? (s.endX = o.xMap, s.animate({
                            d: o
                        })) : (s = t[a] = t.chart.renderer.path(o).addClass(i[1]).attr({
                            fill: r(i[3], e(i[2]).setOpacity(r(n.fillOpacity, .75)).get()),
                            zIndex: 0
                        }).add(t.group)).isArea = !0, s.startX = o.xMap, s.shiftUnit = n.step ? 2 : 1
                    })
                },
                drawLegendSymbol: o.drawRectangle
            })
        }(e),
        function(t) {
            var e = t.pick;
            (0, t.seriesType)("spline", "line", {}, {
                getPointSpline: function(t, i, o) {
                    function n(t) {
                        return t && !t.isNull && !1 !== t.doCurve && !i.isCliff
                    }
                    var r, a, s, l, h, c = i.plotX,
                        d = i.plotY,
                        p = t[o - 1],
                        u = t[o + 1];
                    if (n(p) && n(u)) {
                        var g = p.plotX,
                            f = p.plotY,
                            m = u.plotX,
                            x = u.plotY,
                            v = 0;
                        a = (1.5 * d + f) / 2.5, l = (1.5 * d + x) / 2.5, (s = (1.5 * c + m) / 2.5) !== (r = (1.5 * c + g) / 2.5) && (v = (l - a) * (s - c) / (s - r) + d - l), l += v, (a += v) > f && a > d ? l = 2 * d - (a = Math.max(f, d)) : a < f && a < d && (l = 2 * d - (a = Math.min(f, d))), l > x && l > d ? a = 2 * d - (l = Math.max(x, d)) : l < x && l < d && (a = 2 * d - (l = Math.min(x, d))), i.rightContX = s, i.rightContY = l
                    }
                    return h = ["C", e(p.rightContX, p.plotX), e(p.rightContY, p.plotY), e(r, c), e(a, d), c, d], p.rightContX = p.rightContY = null, h
                }
            })
        }(e),
        function(t) {
            var e = t.seriesTypes.area.prototype,
                i = t.defaultPlotOptions,
                o = t.LegendSymbolMixin;
            (0, t.seriesType)("areaspline", "spline", i.area, {
                getStackPoints: e.getStackPoints,
                getGraphPath: e.getGraphPath,
                setStackCliffs: e.setStackCliffs,
                drawGraph: e.drawGraph,
                drawLegendSymbol: o.drawRectangle
            })
        }(e),
        function(t) {
            var e = t.animObject,
                i = t.color,
                o = t.each,
                n = t.extend,
                r = t.isNumber,
                a = t.LegendSymbolMixin,
                s = t.merge,
                l = t.noop,
                h = t.pick,
                c = t.Series,
                d = t.seriesType,
                p = t.svg;
            d("column", "line", {
                borderRadius: 0,
                crisp: !0,
                groupPadding: .2,
                marker: null,
                pointPadding: .1,
                minPointLength: 0,
                cropThreshold: 50,
                pointRange: null,
                states: {
                    hover: {
                        halo: !1,
                        brightness: .1,
                        shadow: !1
                    },
                    select: {
                        color: "#cccccc",
                        borderColor: "#000000",
                        shadow: !1
                    }
                },
                dataLabels: {
                    align: null,
                    verticalAlign: null,
                    y: null
                },
                softThreshold: !1,
                startFromThreshold: !0,
                stickyTracking: !1,
                tooltip: {
                    distance: 6
                },
                threshold: 0,
                borderColor: "#ffffff"
            }, {
                cropShoulder: 0,
                directTouch: !0,
                trackerGroups: ["group", "dataLabelsGroup"],
                negStacks: !0,
                init: function() {
                    c.prototype.init.apply(this, arguments);
                    var t = this,
                        e = t.chart;
                    e.hasRendered && o(e.series, function(e) {
                        e.type === t.type && (e.isDirty = !0)
                    })
                },
                getColumnMetrics: function() {
                    var t, e = this,
                        i = e.options,
                        n = e.xAxis,
                        r = e.yAxis,
                        a = n.reversed,
                        s = {},
                        l = 0;
                    !1 === i.grouping ? l = 1 : o(e.chart.series, function(i) {
                        var o, n = i.options,
                            a = i.yAxis;
                        i.type !== e.type || !i.visible && e.chart.options.chart.ignoreHiddenSeries || r.len !== a.len || r.pos !== a.pos || (n.stacking ? (t = i.stackKey, void 0 === s[t] && (s[t] = l++), o = s[t]) : !1 !== n.grouping && (o = l++), i.columnIndex = o)
                    });
                    var c = Math.min(Math.abs(n.transA) * (n.ordinalSlope || i.pointRange || n.closestPointRange || n.tickInterval || 1), n.len),
                        d = c * i.groupPadding,
                        p = (c - 2 * d) / (l || 1),
                        u = Math.min(i.maxPointWidth || n.len, h(i.pointWidth, p * (1 - 2 * i.pointPadding))),
                        g = (p - u) / 2 + (d + ((e.columnIndex || 0) + (a ? 1 : 0)) * p - c / 2) * (a ? -1 : 1);
                    return e.columnMetrics = {
                        width: u,
                        offset: g
                    }, e.columnMetrics
                },
                crispCol: function(t, e, i, o) {
                    var n, r, a = this.chart,
                        s = this.borderWidth,
                        l = -(s % 2 ? .5 : 0),
                        h = s % 2 ? .5 : 1;
                    return a.inverted && a.renderer.isVML && (h += 1), this.options.crisp && (i = Math.round(t + i) + l - (t = Math.round(t) + l)), n = Math.round(e + o) + h, r = Math.abs(e) <= .5 && n > .5, e = Math.round(e) + h, o = n - e, r && o && (e -= 1, o += 1), {
                        x: t,
                        y: e,
                        width: i,
                        height: o
                    }
                },
                translate: function() {
                    var t = this,
                        e = t.chart,
                        i = t.options,
                        n = t.dense = t.closestPointRange * t.xAxis.transA < 2,
                        r = t.borderWidth = h(i.borderWidth, n ? 0 : 1),
                        a = t.yAxis,
                        s = i.threshold,
                        l = t.translatedThreshold = a.getThreshold(s),
                        d = h(i.minPointLength, 5),
                        p = t.getColumnMetrics(),
                        u = p.width,
                        g = t.barW = Math.max(u, 1 + 2 * r),
                        f = t.pointXOffset = p.offset;
                    e.inverted && (l -= .5), i.pointPadding && (g = Math.ceil(g)), c.prototype.translate.apply(t), o(t.points, function(i) {
                        var o, n = h(i.yBottom, l),
                            r = 999 + Math.abs(n),
                            s = Math.min(Math.max(-r, i.plotY), a.len + r),
                            c = i.plotX + f,
                            p = g,
                            m = Math.min(s, n),
                            x = Math.max(s, n) - m;
                        Math.abs(x) < d && d && (x = d, o = !a.reversed && !i.negative || a.reversed && i.negative, m = Math.abs(m - l) > d ? n - d : l - (o ? d : 0)), i.barX = c, i.pointWidth = u, i.tooltipPos = e.inverted ? [a.len + a.pos - e.plotLeft - s, t.xAxis.len - c - p / 2, x] : [c + p / 2, s + a.pos - e.plotTop, x], i.shapeType = "rect", i.shapeArgs = t.crispCol.apply(t, i.isNull ? [c, l, p, 0] : [c, m, p, x])
                    })
                },
                getSymbol: l,
                drawLegendSymbol: a.drawRectangle,
                drawGraph: function() {
                    this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
                },
                pointAttribs: function(t, e) {
                    var o, n, r, a, l = this.options,
                        h = this.pointAttrToOptions || {},
                        c = h.stroke || "borderColor",
                        d = h["stroke-width"] || "borderWidth",
                        p = t && t.color || this.color,
                        u = t[c] || l[c] || this.color || p,
                        g = t[d] || l[d] || this[d] || 0,
                        f = l.dashStyle;
                    return t && this.zones.length && (r = t.getZone(), p = t.options.color || r && r.color || this.color), e && (a = (o = s(l.states[e], t.options.states && t.options.states[e] || {})).brightness, p = o.color || void 0 !== a && i(p).brighten(o.brightness).get() || p, u = o[c] || u, g = o[d] || g, f = o.dashStyle || f), n = {
                        fill: p,
                        stroke: u,
                        "stroke-width": g
                    }, l.borderRadius && (n.r = l.borderRadius), f && (n.dashstyle = f), n
                },
                drawPoints: function() {
                    var t, e = this,
                        i = this.chart,
                        n = e.options,
                        a = i.renderer,
                        l = n.animationLimit || 250;
                    o(e.points, function(o) {
                        var h = o.plotY,
                            c = o.graphic;
                        r(h) && null !== o.y ? (t = o.shapeArgs, c ? c[i.pointCount < l ? "animate" : "attr"](s(t)) : o.graphic = c = a[o.shapeType](t).add(o.group || e.group), c.attr(e.pointAttribs(o, o.selected && "select")).shadow(n.shadow, null, n.stacking && !n.borderRadius), c.addClass(o.getClassName(), !0)) : c && (o.graphic = c.destroy())
                    })
                },
                animate: function(t) {
                    var i, o = this,
                        r = this.yAxis,
                        a = o.options,
                        s = this.chart.inverted,
                        l = {};
                    p && (t ? (l.scaleY = .001, i = Math.min(r.pos + r.len, Math.max(r.pos, r.toPixels(a.threshold))), s ? l.translateX = i - r.len : l.translateY = i, o.group.attr(l)) : (l[s ? "translateX" : "translateY"] = r.pos, o.group.animate(l, n(e(o.options.animation), {
                        step: function(t, e) {
                            o.group.attr({
                                scaleY: Math.max(.001, e.pos)
                            })
                        }
                    })), o.animate = null))
                },
                remove: function() {
                    var t = this,
                        e = t.chart;
                    e.hasRendered && o(e.series, function(e) {
                        e.type === t.type && (e.isDirty = !0)
                    }), c.prototype.remove.apply(t, arguments)
                }
            })
        }(e),
        function(t) {
            (0, t.seriesType)("bar", "column", null, {
                inverted: !0
            })
        }(e),
        function(t) {
            var e = t.Series;
            (0, t.seriesType)("scatter", "line", {
                lineWidth: 0,
                findNearestPointBy: "xy",
                marker: {
                    enabled: !0
                },
                tooltip: {
                    headerFormat: '<span style="color:{point.color}">â—</span> <span style="font-size: 0.85em"> {series.name}</span><br/>',
                    pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
                }
            }, {
                sorted: !1,
                requireSorting: !1,
                noSharedTooltip: !0,
                trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
                takeOrdinalPosition: !1,
                drawGraph: function() {
                    this.options.lineWidth && e.prototype.drawGraph.call(this)
                }
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.CenteredSeriesMixin,
                o = t.defined,
                n = t.each,
                r = t.extend,
                a = t.inArray,
                s = t.LegendSymbolMixin,
                l = t.noop,
                h = t.pick,
                c = t.Point,
                d = t.Series,
                p = t.seriesType,
                u = t.seriesTypes,
                g = t.setAnimation;
            p("pie", "line", {
                center: [null, null],
                clip: !1,
                colorByPoint: !0,
                dataLabels: {
                    distance: 30,
                    enabled: !0,
                    formatter: function() {
                        return this.point.isNull ? void 0 : this.point.name
                    },
                    x: 0
                },
                ignoreHiddenPoint: !0,
                legendType: "point",
                marker: null,
                size: null,
                showInLegend: !1,
                slicedOffset: 10,
                stickyTracking: !1,
                tooltip: {
                    followPointer: !0
                },
                borderColor: "#ffffff",
                borderWidth: 1,
                states: {
                    hover: {
                        brightness: .1,
                        shadow: !1
                    }
                }
            }, {
                isCartesian: !1,
                requireSorting: !1,
                directTouch: !0,
                noSharedTooltip: !0,
                trackerGroups: ["group", "dataLabelsGroup"],
                axisTypes: [],
                pointAttribs: u.column.prototype.pointAttribs,
                animate: function(t) {
                    var e = this,
                        i = e.points,
                        o = e.startAngleRad;
                    t || (n(i, function(t) {
                        var i = t.graphic,
                            n = t.shapeArgs;
                        i && (i.attr({
                            r: t.startR || e.center[3] / 2,
                            start: o,
                            end: o
                        }), i.animate({
                            r: n.r,
                            start: n.start,
                            end: n.end
                        }, e.options.animation))
                    }), e.animate = null)
                },
                updateTotals: function() {
                    var t, e, i = 0,
                        o = this.points,
                        n = o.length,
                        r = this.options.ignoreHiddenPoint;
                    for (t = 0; t < n; t++) e = o[t], i += r && !e.visible ? 0 : e.isNull ? 0 : e.y;
                    for (this.total = i, t = 0; t < n; t++)(e = o[t]).percentage = i > 0 && (e.visible || !r) ? e.y / i * 100 : 0, e.total = i
                },
                generatePoints: function() {
                    d.prototype.generatePoints.call(this), this.updateTotals()
                },
                translate: function(t) {
                    this.generatePoints();
                    var e, i, o, n, r, a, s, l, c = this,
                        d = 0,
                        p = c.options,
                        u = p.slicedOffset,
                        g = u + (p.borderWidth || 0),
                        f = p.startAngle || 0,
                        m = c.startAngleRad = Math.PI / 180 * (f - 90),
                        x = (c.endAngleRad = Math.PI / 180 * (h(p.endAngle, f + 360) - 90)) - m,
                        v = c.points,
                        y = p.dataLabels.distance,
                        b = p.ignoreHiddenPoint,
                        M = v.length;
                    for (t || (c.center = t = c.getCenter()), c.getX = function(e, i, o) {
                            return n = Math.asin(Math.min((e - t[1]) / (t[2] / 2 + o.labelDistance), 1)), t[0] + (i ? -1 : 1) * (Math.cos(n) * (t[2] / 2 + o.labelDistance))
                        }, s = 0; s < M; s++)(l = v[s]).labelDistance = h(l.options.dataLabels && l.options.dataLabels.distance, y), c.maxLabelDistance = Math.max(c.maxLabelDistance || 0, l.labelDistance), i = m + d * x, b && !l.visible || (d += l.percentage / 100), o = m + d * x, l.shapeType = "arc", l.shapeArgs = {
                        x: t[0],
                        y: t[1],
                        r: t[2] / 2,
                        innerR: t[3] / 2,
                        start: Math.round(1e3 * i) / 1e3,
                        end: Math.round(1e3 * o) / 1e3
                    }, (n = (o + i) / 2) > 1.5 * Math.PI ? n -= 2 * Math.PI : n < -Math.PI / 2 && (n += 2 * Math.PI), l.slicedTranslation = {
                        translateX: Math.round(Math.cos(n) * u),
                        translateY: Math.round(Math.sin(n) * u)
                    }, r = Math.cos(n) * t[2] / 2, a = Math.sin(n) * t[2] / 2, l.tooltipPos = [t[0] + .7 * r, t[1] + .7 * a], l.half = n < -Math.PI / 2 || n > Math.PI / 2 ? 1 : 0, l.angle = n, e = Math.min(g, l.labelDistance / 5), l.labelPos = [t[0] + r + Math.cos(n) * l.labelDistance, t[1] + a + Math.sin(n) * l.labelDistance, t[0] + r + Math.cos(n) * e, t[1] + a + Math.sin(n) * e, t[0] + r, t[1] + a, l.labelDistance < 0 ? "center" : l.half ? "right" : "left", n]
                },
                drawGraph: null,
                drawPoints: function() {
                    var t, e, i, o, a = this,
                        s = a.chart.renderer,
                        l = a.options.shadow;
                    l && !a.shadowGroup && (a.shadowGroup = s.g("shadow").add(a.group)), n(a.points, function(n) {
                        if (!n.isNull) {
                            e = n.graphic, o = n.shapeArgs, t = n.getTranslate();
                            var h = n.shadowGroup;
                            l && !h && (h = n.shadowGroup = s.g("shadow").add(a.shadowGroup)), h && h.attr(t), i = a.pointAttribs(n, n.selected && "select"), e ? e.setRadialReference(a.center).attr(i).animate(r(o, t)) : (n.graphic = e = s[n.shapeType](o).setRadialReference(a.center).attr(t).add(a.group), n.visible || e.attr({
                                visibility: "hidden"
                            }), e.attr(i).attr({
                                "stroke-linejoin": "round"
                            }).shadow(l, h)), e.addClass(n.getClassName())
                        }
                    })
                },
                searchPoint: l,
                sortByAngle: function(t, e) {
                    t.sort(function(t, i) {
                        return void 0 !== t.angle && (i.angle - t.angle) * e
                    })
                },
                drawLegendSymbol: s.drawRectangle,
                getCenter: i.getCenter,
                getSymbol: l
            }, {
                init: function() {
                    c.prototype.init.apply(this, arguments);
                    var t, i = this;
                    return i.name = h(i.name, "Slice"), t = function(t) {
                        i.slice("select" === t.type)
                    }, e(i, "select", t), e(i, "unselect", t), i
                },
                isValid: function() {
                    return t.isNumber(this.y, !0) && this.y >= 0
                },
                setVisible: function(t, e) {
                    var i = this,
                        o = i.series,
                        r = o.chart,
                        s = o.options.ignoreHiddenPoint;
                    e = h(e, s), t !== i.visible && (i.visible = i.options.visible = t = void 0 === t ? !i.visible : t, o.options.data[a(i, o.data)] = i.options, n(["graphic", "dataLabel", "connector", "shadowGroup"], function(e) {
                        i[e] && i[e][t ? "show" : "hide"](!0)
                    }), i.legendItem && r.legend.colorizeItem(i, t), t || "hover" !== i.state || i.setState(""), s && (o.isDirty = !0), e && r.redraw())
                },
                slice: function(t, e, i) {
                    var n = this,
                        r = n.series,
                        s = r.chart;
                    g(i, s), e = h(e, !0), n.sliced = n.options.sliced = t = o(t) ? t : !n.sliced, r.options.data[a(n, r.data)] = n.options, n.graphic.animate(this.getTranslate()), n.shadowGroup && n.shadowGroup.animate(this.getTranslate())
                },
                getTranslate: function() {
                    return this.sliced ? this.slicedTranslation : {
                        translateX: 0,
                        translateY: 0
                    }
                },
                haloPath: function(t) {
                    var e = this.shapeArgs;
                    return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(e.x, e.y, e.r + t, e.r + t, {
                        innerR: this.shapeArgs.r,
                        start: e.start,
                        end: e.end
                    })
                }
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.arrayMax,
                o = t.defined,
                n = t.each,
                r = t.extend,
                a = t.format,
                s = t.map,
                l = t.merge,
                h = t.noop,
                c = t.pick,
                d = t.relativeLength,
                p = t.Series,
                u = t.seriesTypes,
                g = t.stableSort;
            t.distribute = function(t, e) {
                function i(t, e) {
                    return t.target - e.target
                }
                var o, r, a, l = !0,
                    h = t,
                    c = [],
                    d = 0;
                for (o = t.length; o--;) d += t[o].size;
                if (d > e) {
                    for (g(t, function(t, e) {
                            return (e.rank || 0) - (t.rank || 0)
                        }), o = 0, d = 0; d <= e;) d += t[o].size, o++;
                    c = t.splice(o - 1, t.length)
                }
                for (g(t, i), t = s(t, function(t) {
                        return {
                            size: t.size,
                            targets: [t.target]
                        }
                    }); l;) {
                    for (o = t.length; o--;) r = t[o], a = (Math.min.apply(0, r.targets) + Math.max.apply(0, r.targets)) / 2, r.pos = Math.min(Math.max(0, a - r.size / 2), e - r.size);
                    for (o = t.length, l = !1; o--;) o > 0 && t[o - 1].pos + t[o - 1].size > t[o].pos && (t[o - 1].size += t[o].size, t[o - 1].targets = t[o - 1].targets.concat(t[o].targets), t[o - 1].pos + t[o - 1].size > e && (t[o - 1].pos = e - t[o - 1].size), t.splice(o, 1), l = !0)
                }
                o = 0, n(t, function(t) {
                    var e = 0;
                    n(t.targets, function() {
                        h[o].pos = t.pos + e, e += h[o].size, o++
                    })
                }), h.push.apply(h, c), g(h, i)
            }, p.prototype.drawDataLabels = function() {
                var i, r, s, h, d = this,
                    p = d.options,
                    u = p.dataLabels,
                    g = d.points,
                    f = d.hasRendered || 0,
                    m = c(u.defer, !!p.animation),
                    x = d.chart.renderer;
                (u.enabled || d._hasPointLabels) && (d.dlProcessOptions && d.dlProcessOptions(u), h = d.plotGroup("dataLabelsGroup", "data-labels", m && !f ? "hidden" : "visible", u.zIndex || 6), m && (h.attr({
                    opacity: +f
                }), f || e(d, "afterAnimate", function() {
                    d.visible && h.show(!0), h[p.animation ? "animate" : "attr"]({
                        opacity: 1
                    }, {
                        duration: 200
                    })
                })), r = u, n(g, function(e) {
                    var n, g, f, m, v, y = e.dataLabel,
                        b = e.connector,
                        M = !y;
                    i = e.dlOptions || e.options && e.options.dataLabels, (n = c(i && i.enabled, r.enabled) && null !== e.y) && (u = l(r, i), g = e.getLabelConfig(), s = u.format ? a(u.format, g) : u.formatter.call(g, u), v = u.style, m = u.rotation, v.color = c(u.color, v.color, d.color, "#000000"), "contrast" === v.color && (e.contrastColor = x.getContrast(e.color || d.color), v.color = u.inside || c(e.labelDistance, u.distance) < 0 || p.stacking ? e.contrastColor : "#000000"), p.cursor && (v.cursor = p.cursor), f = {
                        fill: u.backgroundColor,
                        stroke: u.borderColor,
                        "stroke-width": u.borderWidth,
                        r: u.borderRadius || 0,
                        rotation: m,
                        padding: u.padding,
                        zIndex: 1
                    }, t.objectEach(f, function(t, e) {
                        void 0 === t && delete f[e]
                    })), !y || n && o(s) ? n && o(s) && (y ? f.text = s : (y = e.dataLabel = x[m ? "text" : "label"](s, 0, -9999, u.shape, null, null, u.useHTML, null, "data-label")).addClass("highcharts-data-label-color-" + e.colorIndex + " " + (u.className || "") + (u.useHTML ? "highcharts-tracker" : "")), y.attr(f), y.css(v).shadow(u.shadow), y.added || y.add(h), d.alignDataLabel(e, y, u, null, M)) : (e.dataLabel = y = y.destroy(), b && (e.connector = b.destroy()))
                }))
            }, p.prototype.alignDataLabel = function(t, e, i, o, n) {
                var a, s, l, h, d, p, u = this.chart,
                    g = u.inverted,
                    f = c(t.plotX, -9999),
                    m = c(t.plotY, -9999),
                    x = e.getBBox(),
                    v = i.rotation,
                    y = i.align,
                    b = this.visible && (t.series.forceDL || u.isInsidePlot(f, Math.round(m), g) || o && u.isInsidePlot(f, g ? o.x + 1 : o.y + o.height - 1, g)),
                    M = "justify" === c(i.overflow, "justify");
                b && (a = i.style.fontSize, s = u.renderer.fontMetrics(a, e).b, o = r({
                    x: g ? u.plotWidth - m : f,
                    y: Math.round(g ? u.plotHeight - f : m),
                    width: 0,
                    height: 0
                }, o), r(i, {
                    width: x.width,
                    height: x.height
                }), v ? (M = !1, d = u.renderer.rotCorr(s, v), p = {
                    x: o.x + i.x + o.width / 2 + d.x,
                    y: o.y + i.y + {
                        top: 0,
                        middle: .5,
                        bottom: 1
                    }[i.verticalAlign] * o.height
                }, e[n ? "attr" : "animate"](p).attr({
                    align: y
                }), h = (l = (v + 720) % 360) > 180 && l < 360, "left" === y ? p.y -= h ? x.height : 0 : "center" === y ? (p.x -= x.width / 2, p.y -= x.height / 2) : "right" === y && (p.x -= x.width, p.y -= h ? 0 : x.height)) : (e.align(i, null, o), p = e.alignAttr), M ? t.isLabelJustified = this.justifyDataLabel(e, i, p, x, o, n) : c(i.crop, !0) && (b = u.isInsidePlot(p.x, p.y) && u.isInsidePlot(p.x + x.width, p.y + x.height)), i.shape && !v && e[n ? "attr" : "animate"]({
                    anchorX: g ? u.plotWidth - t.plotY : t.plotX,
                    anchorY: g ? u.plotHeight - t.plotX : t.plotY
                })), b || (e.attr({
                    y: -9999
                }), e.placed = !1)
            }, p.prototype.justifyDataLabel = function(t, e, i, o, n, r) {
                var a, s, l = this.chart,
                    h = e.align,
                    c = e.verticalAlign,
                    d = t.box ? 0 : t.padding || 0;
                return (a = i.x + d) < 0 && ("right" === h ? e.align = "left" : e.x = -a, s = !0), (a = i.x + o.width - d) > l.plotWidth && ("left" === h ? e.align = "right" : e.x = l.plotWidth - a, s = !0), (a = i.y + d) < 0 && ("bottom" === c ? e.verticalAlign = "top" : e.y = -a, s = !0), (a = i.y + o.height - d) > l.plotHeight && ("top" === c ? e.verticalAlign = "bottom" : e.y = l.plotHeight - a, s = !0), s && (t.placed = !r, t.align(e, null, n)), s
            }, u.pie && (u.pie.prototype.drawDataLabels = function() {
                var e, r, a, s, l, h, d, u, g, f, m = this,
                    x = m.data,
                    v = m.chart,
                    y = m.options.dataLabels,
                    b = c(y.connectorPadding, 10),
                    M = c(y.connectorWidth, 1),
                    w = v.plotWidth,
                    k = v.plotHeight,
                    S = m.center,
                    A = S[2] / 2,
                    C = S[1],
                    T = [
                        [],
                        []
                    ],
                    P = [0, 0, 0, 0];
                m.visible && (y.enabled || m._hasPointLabels) && (n(x, function(t) {
                    t.dataLabel && t.visible && t.dataLabel.shortened && (t.dataLabel.attr({
                        width: "auto"
                    }).css({
                        width: "auto",
                        textOverflow: "clip"
                    }), t.dataLabel.shortened = !1)
                }), p.prototype.drawDataLabels.apply(m), n(x, function(t) {
                    t.dataLabel && t.visible && (T[t.half].push(t), t.dataLabel._pos = null)
                }), n(T, function(i, r) {
                    var c, p, x, M, T, L, D = i.length,
                        O = [];
                    if (D)
                        for (m.sortByAngle(i, r - .5), m.maxLabelDistance > 0 && (c = Math.max(0, C - A - m.maxLabelDistance), p = Math.min(C + A + m.maxLabelDistance, v.plotHeight), n(i, function(t) {
                                t.labelDistance > 0 && t.dataLabel && (t.top = Math.max(0, C - A - t.labelDistance), t.bottom = Math.min(C + A + t.labelDistance, v.plotHeight), L = t.dataLabel.getBBox().height || 21, t.positionsIndex = O.push({
                                    target: t.labelPos[1] - t.top + L / 2,
                                    size: L,
                                    rank: t.y
                                }) - 1)
                            }), t.distribute(O, p + L - c)), f = 0; f < D; f++) T = (e = i[f]).positionsIndex, l = e.labelPos, a = e.dataLabel, g = !1 === e.visible ? "hidden" : "inherit", x = l[1], O && o(O[T]) ? void 0 === O[T].pos ? g = "hidden" : (h = O[T].size, u = e.top + O[T].pos) : u = x, delete e.positionIndex, d = y.justify ? S[0] + (r ? -1 : 1) * (A + e.labelDistance) : m.getX(u < e.top + 2 || u > e.bottom - 2 ? x : u, r, e), a._attr = {
                            visibility: g,
                            align: l[6]
                        }, a._pos = {
                            x: d + y.x + ({
                                left: b,
                                right: -b
                            }[l[6]] || 0),
                            y: u + y.y - 10
                        }, l.x = d, l.y = u, s = a.getBBox().width, M = null, d - s < b ? (M = Math.round(s - d + b), P[3] = Math.max(M, P[3])) : d + s > w - b && (M = Math.round(d + s - w + b), P[1] = Math.max(M, P[1])), u - h / 2 < 0 ? P[0] = Math.max(Math.round(h / 2 - u), P[0]) : u + h / 2 > k && (P[2] = Math.max(Math.round(u + h / 2 - k), P[2])), a.sideOverflow = M
                }), (0 === i(P) || this.verifyDataLabelOverflow(P)) && (this.placeDataLabels(), M && n(this.points, function(t) {
                    var e;
                    r = t.connector, (a = t.dataLabel) && a._pos && t.visible && t.labelDistance > 0 ? (g = a._attr.visibility, (e = !r) && (t.connector = r = v.renderer.path().addClass("highcharts-data-label-connector highcharts-color-" + t.colorIndex).add(m.dataLabelsGroup), r.attr({
                        "stroke-width": M,
                        stroke: y.connectorColor || t.color || "#666666"
                    })), r[e ? "attr" : "animate"]({
                        d: m.connectorPath(t.labelPos)
                    }), r.attr("visibility", g)) : r && (t.connector = r.destroy())
                })))
            }, u.pie.prototype.connectorPath = function(t) {
                var e = t.x,
                    i = t.y;
                return c(this.options.dataLabels.softConnector, !0) ? ["M", e + ("left" === t[6] ? 5 : -5), i, "C", e, i, 2 * t[2] - t[4], 2 * t[3] - t[5], t[2], t[3], "L", t[4], t[5]] : ["M", e + ("left" === t[6] ? 5 : -5), i, "L", t[2], t[3], "L", t[4], t[5]]
            }, u.pie.prototype.placeDataLabels = function() {
                n(this.points, function(t) {
                    var e, i = t.dataLabel;
                    i && t.visible && ((e = i._pos) ? (i.sideOverflow && (i._attr.width = i.getBBox().width - i.sideOverflow, i.css({
                        width: i._attr.width + "px",
                        textOverflow: "ellipsis"
                    }), i.shortened = !0), i.attr(i._attr), i[i.moved ? "animate" : "attr"](e), i.moved = !0) : i && i.attr({
                        y: -9999
                    }))
                }, this)
            }, u.pie.prototype.alignDataLabel = h, u.pie.prototype.verifyDataLabelOverflow = function(t) {
                var e = this.center,
                    i = this.options,
                    o = i.center,
                    n = i.minSize || 80,
                    r = n,
                    a = null !== i.size;
                return a || (null !== o[0] ? r = Math.max(e[2] - Math.max(t[1], t[3]), n) : (r = Math.max(e[2] - t[1] - t[3], n), e[0] += (t[3] - t[1]) / 2), null !== o[1] ? r = Math.max(Math.min(r, e[2] - Math.max(t[0], t[2])), n) : (r = Math.max(Math.min(r, e[2] - t[0] - t[2]), n), e[1] += (t[0] - t[2]) / 2), r < e[2] ? (e[2] = r, e[3] = Math.min(d(i.innerSize || 0, r), r), this.translate(e), this.drawDataLabels && this.drawDataLabels()) : a = !0), a
            }), u.column && (u.column.prototype.alignDataLabel = function(t, e, i, o, n) {
                var r, a = this.chart.inverted,
                    s = t.series,
                    h = t.dlBox || t.shapeArgs,
                    d = c(t.below, t.plotY > c(this.translatedThreshold, s.yAxis.len)),
                    u = c(i.inside, !!this.options.stacking);
                h && ((o = l(h)).y < 0 && (o.height += o.y, o.y = 0), (r = o.y + o.height - s.yAxis.len) > 0 && (o.height -= r), a && (o = {
                    x: s.yAxis.len - o.y - o.height,
                    y: s.xAxis.len - o.x - o.width,
                    width: o.height,
                    height: o.width
                }), u || (a ? (o.x += d ? 0 : o.width, o.width = 0) : (o.y += d ? o.height : 0, o.height = 0))), i.align = c(i.align, !a || u ? "center" : d ? "right" : "left"), i.verticalAlign = c(i.verticalAlign, a || u ? "middle" : d ? "top" : "bottom"), p.prototype.alignDataLabel.call(this, t, e, i, o, n), t.isLabelJustified && t.contrastColor && t.dataLabel.css({
                    color: t.contrastColor
                })
            })
        }(e),
        function(t) {
            var e, i = t.addEvent,
                o = t.Chart,
                n = t.createElement,
                r = t.css,
                a = t.defaultOptions,
                s = t.defaultPlotOptions,
                l = t.each,
                h = t.extend,
                c = t.fireEvent,
                d = t.hasTouch,
                p = t.inArray,
                u = t.isObject,
                g = t.Legend,
                f = t.merge,
                m = t.pick,
                x = t.Point,
                v = t.Series,
                y = t.seriesTypes,
                b = t.svg;
            e = t.TrackerMixin = {
                drawTrackerPoint: function() {
                    var t = this,
                        e = t.chart.pointer,
                        i = function(t) {
                            var i = e.getPointFromEvent(t);
                            void 0 !== i && (e.isDirectTouch = !0, i.onMouseOver(t))
                        };
                    l(t.points, function(t) {
                        t.graphic && (t.graphic.element.point = t), t.dataLabel && (t.dataLabel.div ? t.dataLabel.div.point = t : t.dataLabel.element.point = t)
                    }), t._hasTracking || (l(t.trackerGroups, function(o) {
                        t[o] && (t[o].addClass("highcharts-tracker").on("mouseover", i).on("mouseout", function(t) {
                            e.onTrackerMouseOut(t)
                        }), d && t[o].on("touchstart", i), t.options.cursor && t[o].css(r).css({
                            cursor: t.options.cursor
                        }))
                    }), t._hasTracking = !0)
                },
                drawTrackerGraph: function() {
                    var t, e = this,
                        i = e.options,
                        o = i.trackByArea,
                        n = [].concat(o ? e.areaPath : e.graphPath),
                        r = n.length,
                        a = e.chart,
                        s = a.pointer,
                        h = a.renderer,
                        c = a.options.tooltip.snap,
                        p = e.tracker,
                        u = function() {
                            a.hoverSeries !== e && e.onMouseOver()
                        },
                        g = "rgba(192,192,192," + (b ? 1e-4 : .002) + ")";
                    if (r && !o)
                        for (t = r + 1; t--;) "M" === n[t] && n.splice(t + 1, 0, n[t + 1] - c, n[t + 2], "L"), (t && "M" === n[t] || t === r) && n.splice(t, 0, "L", n[t - 2] + c, n[t - 1]);
                    p ? p.attr({
                        d: n
                    }) : e.graph && (e.tracker = h.path(n).attr({
                        "stroke-linejoin": "round",
                        visibility: e.visible ? "visible" : "hidden",
                        stroke: g,
                        fill: o ? g : "none",
                        "stroke-width": e.graph.strokeWidth() + (o ? 0 : 2 * c),
                        zIndex: 2
                    }).add(e.group), l([e.tracker, e.markerGroup], function(t) {
                        t.addClass("highcharts-tracker").on("mouseover", u).on("mouseout", function(t) {
                            s.onTrackerMouseOut(t)
                        }), i.cursor && t.css({
                            cursor: i.cursor
                        }), d && t.on("touchstart", u)
                    }))
                }
            }, y.column && (y.column.prototype.drawTracker = e.drawTrackerPoint), y.pie && (y.pie.prototype.drawTracker = e.drawTrackerPoint), y.scatter && (y.scatter.prototype.drawTracker = e.drawTrackerPoint), h(g.prototype, {
                setItemEvents: function(t, e, i) {
                    var o = this,
                        n = o.chart.renderer.boxWrapper,
                        r = "highcharts-legend-" + (t.series ? "point" : "series") + "-active";
                    (i ? e : t.legendGroup).on("mouseover", function() {
                        t.setState("hover"), n.addClass(r), e.css(o.options.itemHoverStyle)
                    }).on("mouseout", function() {
                        e.css(f(t.visible ? o.itemStyle : o.itemHiddenStyle)), n.removeClass(r), t.setState()
                    }).on("click", function(e) {
                        var i = function() {
                            t.setVisible && t.setVisible()
                        };
                        e = {
                            browserEvent: e
                        }, t.firePointEvent ? t.firePointEvent("legendItemClick", e, i) : c(t, "legendItemClick", e, i)
                    })
                },
                createCheckboxForItem: function(t) {
                    var e = this;
                    t.checkbox = n("input", {
                        type: "checkbox",
                        checked: t.selected,
                        defaultChecked: t.selected
                    }, e.options.itemCheckboxStyle, e.chart.container), i(t.checkbox, "click", function(e) {
                        var i = e.target;
                        c(t.series || t, "checkboxClick", {
                            checked: i.checked,
                            item: t
                        }, function() {
                            t.select()
                        })
                    })
                }
            }), a.legend.itemStyle.cursor = "pointer", h(o.prototype, {
                showResetZoom: function() {
                    function t() {
                        e.zoomOut()
                    }
                    var e = this,
                        i = a.lang,
                        o = e.options.chart.resetZoomButton,
                        n = o.theme,
                        r = n.states,
                        s = "chart" === o.relativeTo ? null : "plotBox";
                    this.resetZoomButton = e.renderer.button(i.resetZoom, null, null, t, n, r && r.hover).attr({
                        align: o.position.align,
                        title: i.resetZoomTitle
                    }).addClass("highcharts-reset-zoom").add().align(o.position, !1, s)
                },
                zoomOut: function() {
                    var t = this;
                    c(t, "selection", {
                        resetSelection: !0
                    }, function() {
                        t.zoom()
                    })
                },
                zoom: function(t) {
                    var e, i, o = this,
                        n = o.pointer,
                        r = !1;
                    !t || t.resetSelection ? l(o.axes, function(t) {
                        e = t.zoom()
                    }) : l(t.xAxis.concat(t.yAxis), function(t) {
                        var i = t.axis,
                            o = i.isXAxis;
                        n[o ? "zoomX" : "zoomY"] && (e = i.zoom(t.min, t.max), i.displayBtn && (r = !0))
                    }), i = o.resetZoomButton, r && !i ? o.showResetZoom() : !r && u(i) && (o.resetZoomButton = i.destroy()), e && o.redraw(m(o.options.chart.animation, t && t.animation, o.pointCount < 100))
                },
                pan: function(t, e) {
                    var i, o = this,
                        n = o.hoverPoints;
                    n && l(n, function(t) {
                        t.setState()
                    }), l("xy" === e ? [1, 0] : [1], function(e) {
                        var n, r = o[e ? "xAxis" : "yAxis"][0],
                            a = r.horiz,
                            s = t[a ? "chartX" : "chartY"],
                            l = a ? "mouseDownX" : "mouseDownY",
                            h = o[l],
                            c = (r.pointRange || 0) / 2,
                            d = r.getExtremes(),
                            p = r.toValue(h - s, !0) + c,
                            u = r.toValue(h + r.len - s, !0) - c,
                            g = u < p,
                            f = g ? u : p,
                            m = g ? p : u,
                            x = Math.min(d.dataMin, r.toValue(r.toPixels(d.min) - r.minPixelPadding)),
                            v = Math.max(d.dataMax, r.toValue(r.toPixels(d.max) + r.minPixelPadding));
                        (n = x - f) > 0 && (m += n, f = x), (n = m - v) > 0 && (m = v, f -= n), r.series.length && f !== d.min && m !== d.max && (r.setExtremes(f, m, !1, !1, {
                            trigger: "pan"
                        }), i = !0), o[l] = s
                    }), i && o.redraw(!1), r(o.container, {
                        cursor: "move"
                    })
                }
            }), h(x.prototype, {
                select: function(t, e) {
                    var i = this,
                        o = i.series,
                        n = o.chart;
                    t = m(t, !i.selected), i.firePointEvent(t ? "select" : "unselect", {
                        accumulate: e
                    }, function() {
                        i.selected = i.options.selected = t, o.options.data[p(i, o.data)] = i.options, i.setState(t && "select"), e || l(n.getSelectedPoints(), function(t) {
                            t.selected && t !== i && (t.selected = t.options.selected = !1, o.options.data[p(t, o.data)] = t.options, t.setState(""), t.firePointEvent("unselect"))
                        })
                    })
                },
                onMouseOver: function(t) {
                    var e = this,
                        i = e.series.chart,
                        o = i.pointer;
                    t = t ? o.normalize(t) : o.getChartCoordinatesFromPoint(e, i.inverted), o.runPointActions(t, e)
                },
                onMouseOut: function() {
                    var t = this,
                        e = t.series.chart;
                    t.firePointEvent("mouseOut"), l(e.hoverPoints || [], function(t) {
                        t.setState()
                    }), e.hoverPoints = e.hoverPoint = null
                },
                importEvents: function() {
                    if (!this.hasImportedEvents) {
                        var e = this,
                            o = f(e.series.options.point, e.options).events;
                        e.events = o, t.objectEach(o, function(t, o) {
                            i(e, o, t)
                        }), this.hasImportedEvents = !0
                    }
                },
                setState: function(t, e) {
                    var i, o, n, r = this,
                        a = Math.floor(r.plotX),
                        l = r.plotY,
                        c = r.series,
                        d = c.options.states[t] || {},
                        p = s[c.type].marker && c.options.marker,
                        u = p && !1 === p.enabled,
                        g = p && p.states && p.states[t] || {},
                        f = !1 === g.enabled,
                        x = c.stateMarkerGraphic,
                        v = r.marker || {},
                        y = c.chart,
                        b = c.halo,
                        M = p && c.markerAttribs;
                    (t = t || "") === r.state && !e || r.selected && "select" !== t || !1 === d.enabled || t && (f || u && !1 === g.enabled) || t && v.states && v.states[t] && !1 === v.states[t].enabled || (M && (o = c.markerAttribs(r, t)), r.graphic ? (r.state && r.graphic.removeClass("highcharts-point-" + r.state), t && r.graphic.addClass("highcharts-point-" + t), r.graphic.attr(c.pointAttribs(r, t)), o && r.graphic.animate(o, m(y.options.chart.animation, g.animation, p.animation)), x && x.hide()) : (t && g && (n = v.symbol || c.symbol, x && x.currentSymbol !== n && (x = x.destroy()), x ? x[e ? "animate" : "attr"]({
                        x: o.x,
                        y: o.y
                    }) : n && (c.stateMarkerGraphic = x = y.renderer.symbol(n, o.x, o.y, o.width, o.height).add(c.markerGroup), x.currentSymbol = n), x && x.attr(c.pointAttribs(r, t))), x && (x[t && y.isInsidePlot(a, l, y.inverted) ? "show" : "hide"](), x.element.point = r)), (i = d.halo) && i.size ? (b || (c.halo = b = y.renderer.path().add((r.graphic || x).parentGroup)), b[e ? "animate" : "attr"]({
                        d: r.haloPath(i.size)
                    }), b.attr({
                        class: "highcharts-halo highcharts-color-" + m(r.colorIndex, c.colorIndex)
                    }), b.point = r, b.attr(h({
                        fill: r.color || c.color,
                        "fill-opacity": i.opacity,
                        zIndex: -1
                    }, i.attributes))) : b && b.point && b.point.haloPath && b.animate({
                        d: b.point.haloPath(0)
                    }), r.state = t)
                },
                haloPath: function(t) {
                    return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - t, this.plotY - t, 2 * t, 2 * t)
                }
            }), h(v.prototype, {
                onMouseOver: function() {
                    var t = this,
                        e = t.chart,
                        i = e.hoverSeries;
                    i && i !== t && i.onMouseOut(), t.options.events.mouseOver && c(t, "mouseOver"), t.setState("hover"), e.hoverSeries = t
                },
                onMouseOut: function() {
                    var t = this,
                        e = t.options,
                        i = t.chart,
                        o = i.tooltip,
                        n = i.hoverPoint;
                    i.hoverSeries = null, n && n.onMouseOut(), t && e.events.mouseOut && c(t, "mouseOut"), !o || t.stickyTracking || o.shared && !t.noSharedTooltip || o.hide(), t.setState()
                },
                setState: function(t) {
                    var e, i = this,
                        o = i.options,
                        n = i.graph,
                        r = o.states,
                        a = o.lineWidth,
                        s = 0;
                    if (t = t || "", i.state !== t) {
                        if (l([i.group, i.markerGroup, i.dataLabelsGroup], function(e) {
                                e && (i.state && e.removeClass("highcharts-series-" + i.state), t && e.addClass("highcharts-series-" + t))
                            }), i.state = t, r[t] && !1 === r[t].enabled) return;
                        if (t && (a = r[t].lineWidth || a + (r[t].lineWidthPlus || 0)), n && !n.dashstyle)
                            for (e = {
                                    "stroke-width": a
                                }, n.animate(e, m(i.chart.options.chart.animation, r[t] && r[t].animation)); i["zone-graph-" + s];) i["zone-graph-" + s].attr(e), s += 1
                    }
                },
                setVisible: function(t, e) {
                    var i, o = this,
                        n = o.chart,
                        r = o.legendItem,
                        a = n.options.chart.ignoreHiddenSeries,
                        s = o.visible;
                    o.visible = t = o.options.visible = o.userOptions.visible = void 0 === t ? !s : t, i = t ? "show" : "hide", l(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(t) {
                        o[t] && o[t][i]()
                    }), n.hoverSeries !== o && (n.hoverPoint && n.hoverPoint.series) !== o || o.onMouseOut(), r && n.legend.colorizeItem(o, t), o.isDirty = !0, o.options.stacking && l(n.series, function(t) {
                        t.options.stacking && t.visible && (t.isDirty = !0)
                    }), l(o.linkedSeries, function(e) {
                        e.setVisible(t, !1)
                    }), a && (n.isDirtyBox = !0), !1 !== e && n.redraw(), c(o, i)
                },
                show: function() {
                    this.setVisible(!0)
                },
                hide: function() {
                    this.setVisible(!1)
                },
                select: function(t) {
                    var e = this;
                    e.selected = t = void 0 === t ? !e.selected : t, e.checkbox && (e.checkbox.checked = t), c(e, t ? "select" : "unselect")
                },
                drawTracker: e.drawTrackerGraph
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.Axis,
                o = t.Chart,
                n = t.css,
                r = t.dateFormat,
                a = t.defined,
                s = t.each,
                l = t.extend,
                h = t.noop,
                c = t.Series,
                d = t.timeUnits,
                p = t.wrap;
            p(c.prototype, "init", function(t) {
                var i, o = this;
                t.apply(this, Array.prototype.slice.call(arguments, 1)), (i = o.xAxis) && i.options.ordinal && e(o, "updatedData", function() {
                    delete i.ordinalIndex
                })
            }), p(i.prototype, "getTimeTicks", function(t, e, i, o, n, s, l, h) {
                var c, p, u, g, f, m, x = 0,
                    v = {},
                    y = [],
                    b = -Number.MAX_VALUE,
                    M = this.options.tickPixelInterval;
                if (!this.options.ordinal && !this.options.breaks || !s || s.length < 3 || void 0 === i) return t.call(this, e, i, o, n);
                for (f = s.length, c = 0; c < f; c++) {
                    if (m = c && s[c - 1] > o, s[c] < i && (x = c), c === f - 1 || s[c + 1] - s[c] > 5 * l || m) {
                        if (s[c] > b) {
                            for (p = t.call(this, e, s[x], s[c], n); p.length && p[0] <= b;) p.shift();
                            p.length && (b = p[p.length - 1]), y = y.concat(p)
                        }
                        x = c + 1
                    }
                    if (m) break
                }
                if (g = p.info, h && g.unitRange <= d.hour) {
                    for (c = y.length - 1, x = 1; x < c; x++) r("%d", y[x]) !== r("%d", y[x - 1]) && (v[y[x]] = "day", u = !0);
                    u && (v[y[0]] = "day"), g.higherRanks = v
                }
                if (y.info = g, h && a(M)) {
                    for (var w, k, S, A, C, T = y.length, P = T, L = [], D = []; P--;) k = this.translate(y[P]), S && (D[P] = S - k), L[P] = S = k;
                    for (D.sort(), (A = D[Math.floor(D.length / 2)]) < .6 * M && (A = null), P = y[T - 1] > o ? T - 1 : T, S = void 0; P--;) k = L[P], C = Math.abs(S - k), S && C < .8 * M && (null === A || C < .8 * A) ? (v[y[P]] && !v[y[P + 1]] ? (w = P + 1, S = k) : w = P, y.splice(w, 1)) : S = k
                }
                return y
            }), l(i.prototype, {
                beforeSetTickPositions: function() {
                    var t, e, i, o, n, r, a = this,
                        l = [],
                        h = !1,
                        c = a.getExtremes(),
                        d = c.min,
                        p = c.max,
                        u = a.isXAxis && !!a.options.breaks,
                        g = a.options.ordinal,
                        f = a.chart.options.chart.ignoreHiddenSeries;
                    if (g || u) {
                        if (s(a.series, function(e, i) {
                                if ((!f || !1 !== e.visible) && (!1 !== e.takeOrdinalPosition || u) && (l = l.concat(e.processedXData), t = l.length, l.sort(function(t, e) {
                                        return t - e
                                    }), t))
                                    for (i = t - 1; i--;) l[i] === l[i + 1] && l.splice(i, 1)
                            }), (t = l.length) > 2) {
                            for (e = l[1] - l[0], r = t - 1; r-- && !h;) l[r + 1] - l[r] !== e && (h = !0);
                            !a.options.keepOrdinalPadding && (l[0] - d > e || p - l[l.length - 1] > e) && (h = !0)
                        }
                        h ? (a.ordinalPositions = l, i = a.ordinal2lin(Math.max(d, l[0]), !0), o = Math.max(a.ordinal2lin(Math.min(p, l[l.length - 1]), !0), 1), a.ordinalSlope = n = (p - d) / (o - i), a.ordinalOffset = d - i * n) : a.ordinalPositions = a.ordinalSlope = a.ordinalOffset = void 0
                    }
                    a.isOrdinal = g && h, a.groupIntervalFactor = null
                },
                val2lin: function(t, e) {
                    var i, o = this,
                        n = o.ordinalPositions;
                    if (n) {
                        var r, a, s = n.length;
                        for (r = s; r--;)
                            if (n[r] === t) {
                                a = r;
                                break
                            }
                        for (r = s - 1; r--;)
                            if (t > n[r] || 0 === r) {
                                a = r + (t - n[r]) / (n[r + 1] - n[r]);
                                break
                            }
                        i = e ? a : o.ordinalSlope * (a || 0) + o.ordinalOffset
                    } else i = t;
                    return i
                },
                lin2val: function(t, e) {
                    var i = this,
                        o = i.ordinalPositions;
                    if (o) {
                        var n, r, a = i.ordinalSlope,
                            s = i.ordinalOffset,
                            l = o.length - 1;
                        if (e) t < 0 ? t = o[0] : t > l ? t = o[l] : r = t - (l = Math.floor(t));
                        else
                            for (; l--;)
                                if (n = a * l + s, t >= n) {
                                    r = (t - n) / (a * (l + 1) + s - n);
                                    break
                                } return void 0 !== r && void 0 !== o[l] ? o[l] + (r ? r * (o[l + 1] - o[l]) : 0) : t
                    }
                    return t
                },
                getExtendedPositions: function() {
                    var t, e, o = this,
                        n = o.chart,
                        r = o.series[0].currentDataGrouping,
                        a = o.ordinalIndex,
                        l = r ? r.count + r.unitName : "raw",
                        c = o.getExtremes();
                    return a || (a = o.ordinalIndex = {}), a[l] || (t = {
                        series: [],
                        chart: n,
                        getExtremes: function() {
                            return {
                                min: c.dataMin,
                                max: c.dataMax
                            }
                        },
                        options: {
                            ordinal: !0
                        },
                        val2lin: i.prototype.val2lin,
                        ordinal2lin: i.prototype.ordinal2lin
                    }, s(o.series, function(i) {
                        (e = {
                            xAxis: t,
                            xData: i.xData,
                            chart: n,
                            destroyGroupedData: h
                        }).options = {
                            dataGrouping: r ? {
                                enabled: !0,
                                forced: !0,
                                approximation: "open",
                                units: [
                                    [r.unitName, [r.count]]
                                ]
                            } : {
                                enabled: !1
                            }
                        }, i.processData.apply(e), t.series.push(e)
                    }), o.beforeSetTickPositions.apply(t), a[l] = t.ordinalPositions), a[l]
                },
                getGroupIntervalFactor: function(t, e, i) {
                    var o, n, r = i.processedXData,
                        a = r.length,
                        s = [],
                        l = this.groupIntervalFactor;
                    if (!l) {
                        for (o = 0; o < a - 1; o++) s[o] = r[o + 1] - r[o];
                        s.sort(function(t, e) {
                            return t - e
                        }), n = s[Math.floor(a / 2)], t = Math.max(t, r[0]), e = Math.min(e, r[a - 1]), this.groupIntervalFactor = l = a * n / (e - t)
                    }
                    return l
                },
                postProcessTickInterval: function(t) {
                    var e = this.ordinalSlope;
                    return e ? this.options.breaks ? this.closestPointRange : t / (e / this.closestPointRange) : t
                }
            }), i.prototype.ordinal2lin = i.prototype.val2lin, p(o.prototype, "pan", function(t, e) {
                var i = this,
                    o = i.xAxis[0],
                    r = e.chartX,
                    a = !1;
                if (o.options.ordinal && o.series.length) {
                    var l, h, c, d, p = i.mouseDownX,
                        u = o.getExtremes(),
                        g = u.dataMax,
                        f = u.min,
                        m = u.max,
                        x = i.hoverPoints,
                        v = o.closestPointRange,
                        y = (p - r) / (o.translationSlope * (o.ordinalSlope || v)),
                        b = {
                            ordinalPositions: o.getExtendedPositions()
                        },
                        M = o.lin2val,
                        w = o.val2lin;
                    b.ordinalPositions ? Math.abs(y) > 1 && (x && s(x, function(t) {
                        t.setState()
                    }), y < 0 ? (c = b, d = o.ordinalPositions ? o : b) : (c = o.ordinalPositions ? o : b, d = b), g > (h = d.ordinalPositions)[h.length - 1] && h.push(g), i.fixedRange = m - f, (l = o.toFixedRange(null, null, M.apply(c, [w.apply(c, [f, !0]) + y, !0]), M.apply(d, [w.apply(d, [m, !0]) + y, !0]))).min >= Math.min(u.dataMin, f) && l.max <= Math.max(g, m) && o.setExtremes(l.min, l.max, !0, !1, {
                        trigger: "pan"
                    }), i.mouseDownX = r, n(i.container, {
                        cursor: "move"
                    })) : a = !0
                } else a = !0;
                a && t.apply(this, Array.prototype.slice.call(arguments, 1))
            })
        }(e),
        function(t) {
            var e = t.arrayMax,
                i = t.arrayMin,
                o = t.Axis,
                n = t.defaultPlotOptions,
                r = t.defined,
                a = t.each,
                s = t.extend,
                l = t.format,
                h = t.isNumber,
                c = t.merge,
                d = t.pick,
                p = t.Point,
                u = t.Series,
                g = t.Tooltip,
                f = t.wrap,
                m = u.prototype,
                x = m.processData,
                v = m.generatePoints,
                y = m.destroy,
                b = {
                    approximation: "average",
                    groupPixelWidth: 2,
                    dateTimeLabelFormats: {
                        millisecond: ["%A, %b %e, %H:%M:%S.%L", "%A, %b %e, %H:%M:%S.%L", "-%H:%M:%S.%L"],
                        second: ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"],
                        minute: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                        hour: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                        day: ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                        week: ["Week from %A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                        month: ["%B %Y", "%B", "-%B %Y"],
                        year: ["%Y", "%Y", "-%Y"]
                    }
                },
                M = {
                    line: {},
                    spline: {},
                    area: {},
                    areaspline: {},
                    column: {
                        approximation: "sum",
                        groupPixelWidth: 10
                    },
                    arearange: {
                        approximation: "range"
                    },
                    areasplinerange: {
                        approximation: "range"
                    },
                    columnrange: {
                        approximation: "range",
                        groupPixelWidth: 10
                    },
                    candlestick: {
                        approximation: "ohlc",
                        groupPixelWidth: 10
                    },
                    ohlc: {
                        approximation: "ohlc",
                        groupPixelWidth: 5
                    }
                },
                w = t.defaultDataGroupingUnits = [
                    ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                    ["second", [1, 2, 5, 10, 15, 30]],
                    ["minute", [1, 2, 5, 10, 15, 30]],
                    ["hour", [1, 2, 3, 4, 6, 8, 12]],
                    ["day", [1]],
                    ["week", [1]],
                    ["month", [1, 3, 6]],
                    ["year", null]
                ],
                k = {
                    sum: function(t) {
                        var e, i = t.length;
                        if (!i && t.hasNulls) e = null;
                        else if (i)
                            for (e = 0; i--;) e += t[i];
                        return e
                    },
                    average: function(t) {
                        var e = t.length,
                            i = k.sum(t);
                        return h(i) && e && (i /= e), i
                    },
                    averages: function() {
                        var t = [];
                        return a(arguments, function(e) {
                            t.push(k.average(e))
                        }), t
                    },
                    open: function(t) {
                        return t.length ? t[0] : t.hasNulls ? null : void 0
                    },
                    high: function(t) {
                        return t.length ? e(t) : t.hasNulls ? null : void 0
                    },
                    low: function(t) {
                        return t.length ? i(t) : t.hasNulls ? null : void 0
                    },
                    close: function(t) {
                        return t.length ? t[t.length - 1] : t.hasNulls ? null : void 0
                    },
                    ohlc: function(t, e, i, o) {
                        if (t = k.open(t), e = k.high(e), i = k.low(i), o = k.close(o), h(t) || h(e) || h(i) || h(o)) return [t, e, i, o]
                    },
                    range: function(t, e) {
                        return t = k.low(t), e = k.high(e), h(t) || h(e) ? [t, e] : null === t && null === e ? null : void 0
                    }
                };
            m.groupData = function(t, e, i, o) {
                var n, r, s, l, c, d, p = this,
                    u = p.data,
                    g = p.options.data,
                    f = [],
                    m = [],
                    x = [],
                    v = t.length,
                    y = !!e,
                    w = [],
                    S = "function" == typeof o ? o : k[o] || M[p.type] && k[M[p.type].approximation] || k[b.approximation],
                    A = p.pointArrayMap,
                    C = A && A.length,
                    T = 0,
                    P = 0;
                for (C ? a(A, function() {
                        w.push([])
                    }) : w.push([]), l = C || 1, c = 0; c <= v && !(t[c] >= i[0]); c++);
                for (c; c <= v; c++) {
                    for (; void 0 !== i[T + 1] && t[c] >= i[T + 1] || c === v;) {
                        for (n = i[T], p.dataGroupInfo = {
                                start: P,
                                length: w[0].length
                            }, void 0 !== (s = S.apply(p, w)) && (f.push(n), m.push(s), x.push(p.dataGroupInfo)), P = c, d = 0; d < l; d++) w[d].length = 0, w[d].hasNulls = !1;
                        if (T += 1, c === v) break
                    }
                    if (c === v) break;
                    if (A) {
                        var L, D = p.cropStart + c,
                            O = u && u[D] || p.pointClass.prototype.applyOptions.apply({
                                series: p
                            }, [g[D]]);
                        for (d = 0; d < C; d++) L = O[A[d]], h(L) ? w[d].push(L) : null === L && (w[d].hasNulls = !0)
                    } else r = y ? e[c] : null, h(r) ? w[0].push(r) : null === r && (w[0].hasNulls = !0)
                }
                return [f, m, x]
            }, m.processData = function() {
                var t, e = this,
                    i = e.chart,
                    o = e.options.dataGrouping,
                    n = !1 !== e.allowDG && o && d(o.enabled, i.options.isStock),
                    a = e.visible || !i.options.chart.ignoreHiddenSeries;
                if (e.forceCrop = n, e.groupPixelWidth = null, e.hasProcessed = !0, !(!1 === x.apply(e, arguments) || !n)) {
                    e.destroyGroupedData();
                    var s, l = e.processedXData,
                        h = e.processedYData,
                        c = i.plotSizeX,
                        p = e.xAxis,
                        u = p.options.ordinal,
                        g = e.groupPixelWidth = p.getGroupPixelWidth && p.getGroupPixelWidth();
                    if (g) {
                        t = !0, e.isDirty = !0, e.points = null;
                        var f = p.getExtremes(),
                            v = f.min,
                            y = f.max,
                            b = g * (y - v) / c * (u && p.getGroupIntervalFactor(v, y, e) || 1),
                            M = p.getTimeTicks(p.normalizeTimeTickInterval(b, o.units || w), Math.min(v, l[0]), Math.max(y, l[l.length - 1]), p.options.startOfWeek, l, e.closestPointRange),
                            k = m.groupData.apply(e, [l, h, M, o.approximation]),
                            S = k[0],
                            A = k[1];
                        if (o.smoothed) {
                            for (S[s = S.length - 1] = Math.min(S[s], y); s-- && s > 0;) S[s] += b / 2;
                            S[0] = Math.max(S[0], v)
                        }
                        e.currentDataGrouping = M.info, e.closestPointRange = M.info.totalRange, e.groupMap = k[2], r(S[0]) && S[0] < p.dataMin && a && (p.min === p.dataMin && (p.min = S[0]), p.dataMin = S[0]), e.processedXData = S, e.processedYData = A
                    } else e.currentDataGrouping = e.groupMap = null;
                    e.hasGroupedData = t
                }
            }, m.destroyGroupedData = function() {
                var t = this.groupedData;
                a(t || [], function(e, i) {
                    e && (t[i] = e.destroy ? e.destroy() : null)
                }), this.groupedData = null
            }, m.generatePoints = function() {
                v.apply(this), this.destroyGroupedData(), this.groupedData = this.hasGroupedData ? this.points : null
            }, f(p.prototype, "update", function(e) {
                this.dataGroup ? t.error(24) : e.apply(this, [].slice.call(arguments, 1))
            }), f(g.prototype, "tooltipFooterHeaderFormatter", function(e, i, o) {
                var n, r, a, c, d, p = this,
                    u = i.series,
                    g = u.options,
                    f = u.tooltipOptions,
                    m = g.dataGrouping,
                    x = f.xDateFormat,
                    v = u.xAxis,
                    y = t.dateFormat;
                return v && "datetime" === v.options.type && m && h(i.key) ? (r = u.currentDataGrouping, a = m.dateTimeLabelFormats, r ? (c = a[r.unitName], 1 === r.count ? x = c[0] : (x = c[1], n = c[2])) : !x && a && (x = p.getXDateFormat(i, f, v)), d = y(x, i.key), n && (d += y(n, i.key + r.totalRange - 1)), l(f[(o ? "footer" : "header") + "Format"], {
                    point: s(i.point, {
                        key: d
                    }),
                    series: u
                })) : e.call(p, i, o)
            }), m.destroy = function() {
                for (var t = this, e = t.groupedData || [], i = e.length; i--;) e[i] && e[i].destroy();
                y.apply(t)
            }, f(m, "setOptions", function(t, e) {
                var i = t.call(this, e),
                    o = this.type,
                    r = this.chart.options.plotOptions,
                    a = n[o].dataGrouping;
                return M[o] && (a || (a = c(b, M[o])), i.dataGrouping = c(a, r.series && r.series.dataGrouping, r[o].dataGrouping, e.dataGrouping)), this.chart.options.isStock && (this.requireSorting = !0), i
            }), f(o.prototype, "setScale", function(t) {
                t.call(this), a(this.series, function(t) {
                    t.hasProcessed = !1
                })
            }), o.prototype.getGroupPixelWidth = function() {
                var t, e, i, o = this.series,
                    n = o.length,
                    r = 0,
                    a = !1;
                for (t = n; t--;)(i = o[t].options.dataGrouping) && (r = Math.max(r, i.groupPixelWidth));
                for (t = n; t--;)(i = o[t].options.dataGrouping) && o[t].hasProcessed && (e = (o[t].processedXData || o[t].data).length, (o[t].groupPixelWidth || e > this.chart.plotSizeX / r || e && i.forced) && (a = !0));
                return a ? r : 0
            }, o.prototype.setDataGrouping = function(t, e) {
                var i;
                if (e = d(e, !0), t || (t = {
                        forced: !1,
                        units: null
                    }), this instanceof o)
                    for (i = this.series.length; i--;) this.series[i].update({
                        dataGrouping: t
                    }, !1);
                else a(this.chart.options.series, function(e) {
                    e.dataGrouping = t
                }, !1);
                e && this.chart.redraw()
            }
        }(e),
        function(t) {
            var e = t.each,
                i = t.Point,
                o = t.seriesType,
                n = t.seriesTypes;
            o("ohlc", "column", {
                lineWidth: 1,
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">â—</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'
                },
                threshold: null,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                stickyTracking: !0
            }, {
                directTouch: !1,
                pointArrayMap: ["open", "high", "low", "close"],
                toYData: function(t) {
                    return [t.open, t.high, t.low, t.close]
                },
                pointValKey: "close",
                pointAttrToOptions: {
                    stroke: "color",
                    "stroke-width": "lineWidth"
                },
                pointAttribs: function(t, e) {
                    var i = n.column.prototype.pointAttribs.call(this, t, e),
                        o = this.options;
                    return delete i.fill, !t.options.color && o.upColor && t.open < t.close && (i.stroke = o.upColor), i
                },
                translate: function() {
                    var t = this,
                        i = t.yAxis,
                        o = !!t.modifyValue,
                        r = ["plotOpen", "plotHigh", "plotLow", "plotClose", "yBottom"];
                    n.column.prototype.translate.apply(t), e(t.points, function(n) {
                        e([n.open, n.high, n.low, n.close, n.low], function(e, a) {
                            null !== e && (o && (e = t.modifyValue(e)), n[r[a]] = i.toPixels(e, !0))
                        }), n.tooltipPos[1] = n.plotHigh + i.pos - t.chart.plotTop
                    })
                },
                drawPoints: function() {
                    var t = this,
                        i = t.points,
                        o = t.chart;
                    e(i, function(e) {
                        var i, n, r, a, s, l, h = e.graphic,
                            c = !h;
                        void 0 !== e.plotY && (h || (e.graphic = h = o.renderer.path().add(t.group)), h.attr(t.pointAttribs(e, e.selected && "select")), r = h.strokeWidth() % 2 / 2, l = Math.round(e.plotX) - r, a = Math.round(e.shapeArgs.width / 2), s = ["M", l, Math.round(e.yBottom), "L", l, Math.round(e.plotHigh)], null !== e.open && (i = Math.round(e.plotOpen) + r, s.push("M", l, i, "L", l - a, i)), null !== e.close && (n = Math.round(e.plotClose) + r, s.push("M", l, n, "L", l + a, n)), h[c ? "attr" : "animate"]({
                            d: s
                        }).addClass(e.getClassName(), !0))
                    })
                },
                animate: null
            }, {
                getClassName: function() {
                    return i.prototype.getClassName.call(this) + (this.open < this.close ? " highcharts-point-up" : " highcharts-point-down")
                }
            })
        }(e),
        function(t) {
            var e = t.defaultPlotOptions,
                i = t.each,
                o = t.merge,
                n = t.seriesType,
                r = t.seriesTypes;
            n("candlestick", "ohlc", o(e.column, {
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                tooltip: e.ohlc.tooltip,
                threshold: null,
                lineColor: "#000000",
                lineWidth: 1,
                upColor: "#ffffff",
                stickyTracking: !0
            }), {
                pointAttribs: function(t, e) {
                    var i, o = r.column.prototype.pointAttribs.call(this, t, e),
                        n = this.options,
                        a = t.open < t.close,
                        s = n.lineColor || this.color;
                    return o["stroke-width"] = n.lineWidth, o.fill = t.options.color || (a ? n.upColor || this.color : this.color), o.stroke = t.lineColor || (a ? n.upLineColor || s : s), e && (i = n.states[e], o.fill = i.color || o.fill, o.stroke = i.lineColor || o.stroke, o["stroke-width"] = i.lineWidth || o["stroke-width"]), o
                },
                drawPoints: function() {
                    var t = this,
                        e = t.points,
                        o = t.chart;
                    i(e, function(e) {
                        var i, n, r, a, s, l, h, c, d, p, u = e.graphic,
                            g = !u;
                        void 0 !== e.plotY && (u || (e.graphic = u = o.renderer.path().add(t.group)), u.attr(t.pointAttribs(e, e.selected && "select")).shadow(t.options.shadow), h = u.strokeWidth() % 2 / 2, c = Math.round(e.plotX) - h, i = e.plotOpen, n = e.plotClose, r = Math.min(i, n), a = Math.max(i, n), p = Math.round(e.shapeArgs.width / 2), s = Math.round(r) !== Math.round(e.plotHigh), l = a !== e.yBottom, r = Math.round(r) + h, a = Math.round(a) + h, (d = []).push("M", c - p, a, "L", c - p, r, "L", c + p, r, "L", c + p, a, "Z", "M", c, r, "L", c, s ? Math.round(e.plotHigh) : r, "M", c, a, "L", c, l ? Math.round(e.yBottom) : a), u[g ? "attr" : "animate"]({
                            d: d
                        }).addClass(e.getClassName(), !0))
                    })
                }
            })
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.each,
                o = t.merge,
                n = t.noop,
                r = t.Renderer,
                a = t.Series,
                s = t.seriesType,
                l = t.seriesTypes,
                h = t.SVGRenderer,
                c = t.TrackerMixin,
                d = t.VMLRenderer,
                p = h.prototype.symbols,
                u = t.stableSort;
            s("flags", "column", {
                pointRange: 0,
                shape: "flag",
                stackDistance: 12,
                textAlign: "center",
                tooltip: {
                    pointFormat: "{point.text}<br/>"
                },
                threshold: null,
                y: -30,
                fillColor: "#ffffff",
                lineWidth: 1,
                states: {
                    hover: {
                        lineColor: "#000000",
                        fillColor: "#ccd6eb"
                    }
                },
                style: {
                    fontSize: "11px",
                    fontWeight: "bold"
                }
            }, {
                sorted: !1,
                noSharedTooltip: !0,
                allowDG: !1,
                takeOrdinalPosition: !1,
                trackerGroups: ["markerGroup"],
                forceCrop: !0,
                init: a.prototype.init,
                pointAttribs: function(t, e) {
                    var i = this.options,
                        o = t && t.color || this.color,
                        n = i.lineColor,
                        r = t && t.lineWidth,
                        a = t && t.fillColor || i.fillColor;
                    return e && (a = i.states[e].fillColor, n = i.states[e].lineColor, r = i.states[e].lineWidth), {
                        fill: a || o,
                        stroke: n || o,
                        "stroke-width": r || i.lineWidth || 0
                    }
                },
                translate: function() {
                    l.column.prototype.translate.apply(this);
                    var t, e, o, n, r, a, s = this,
                        h = s.options,
                        c = s.chart,
                        d = s.points,
                        p = d.length - 1,
                        g = h.onSeries,
                        f = g && c.get(g),
                        m = h.onKey || "y",
                        x = f && f.options.step,
                        v = f && f.points,
                        y = v && v.length,
                        b = s.xAxis,
                        M = s.yAxis,
                        w = b.getExtremes(),
                        k = 0;
                    if (f && f.visible && y)
                        for (k = (f.pointXOffset || 0) + (f.barW || 0) / 2, a = f.currentDataGrouping, n = v[y - 1].x + (a ? a.totalRange : 0), u(d, function(t, e) {
                                return t.x - e.x
                            }), m = "plot" + m[0].toUpperCase() + m.substr(1); y-- && d[p] && (t = d[p], !((o = v[y]).x <= t.x && void 0 !== o[m] && (t.x <= n && (t.plotY = o[m], o.x < t.x && !x && (r = v[y + 1]) && void 0 !== r[m] && (t.plotY += (t.x - o.x) / (r.x - o.x) * (r[m] - o[m]))), p--, y++, p < 0))););
                    i(d, function(t, i) {
                        var o;
                        void 0 === t.plotY && (t.x >= w.min && t.x <= w.max ? t.plotY = c.chartHeight - b.bottom - (b.opposite ? b.height : 0) + b.offset - M.top : t.shapeArgs = {}), t.plotX += k, (e = d[i - 1]) && e.plotX === t.plotX && (void 0 === e.stackIndex && (e.stackIndex = 0), o = e.stackIndex + 1), t.stackIndex = o
                    })
                },
                drawPoints: function() {
                    var e, i, n, r, a, s, l, h, c, d, p = this,
                        u = p.points,
                        g = p.chart,
                        f = g.renderer,
                        m = p.options,
                        x = m.y,
                        v = p.yAxis;
                    for (r = u.length; r--;) d = (a = u[r]).plotX > p.xAxis.len, e = a.plotX, l = a.stackIndex, n = a.options.shape || m.shape, void 0 !== (i = a.plotY) && (i = a.plotY + x - (void 0 !== l && l * m.stackDistance)), h = l ? void 0 : a.plotX, c = l ? void 0 : a.plotY, s = a.graphic, void 0 !== i && e >= 0 && !d ? (s || (s = a.graphic = f.label("", null, null, n, null, null, m.useHTML).attr(p.pointAttribs(a)).css(o(m.style, a.style)).attr({
                        align: "flag" === n ? "left" : "center",
                        width: m.width,
                        height: m.height,
                        "text-align": m.textAlign
                    }).addClass("highcharts-point").add(p.markerGroup), a.graphic.div && (a.graphic.div.point = a), s.shadow(m.shadow)), e > 0 && (e -= s.strokeWidth() % 2), s.attr({
                        text: a.options.title || m.title || "A",
                        x: e,
                        y: i,
                        anchorX: h,
                        anchorY: c
                    }), a.tooltipPos = g.inverted ? [v.len + v.pos - g.plotLeft - i, p.xAxis.len - e] : [e, i + v.pos - g.plotTop]) : s && (a.graphic = s.destroy());
                    m.useHTML && t.wrap(p.markerGroup, "on", function(e) {
                        return t.SVGElement.prototype.on.apply(e.apply(this, [].slice.call(arguments, 1)), [].slice.call(arguments, 1))
                    })
                },
                drawTracker: function() {
                    var t = this.points;
                    c.drawTrackerPoint.apply(this), i(t, function(o) {
                        var n = o.graphic;
                        n && e(n.element, "mouseover", function() {
                            o.stackIndex > 0 && !o.raised && (o._y = n.y, n.attr({
                                y: o._y - 8
                            }), o.raised = !0), i(t, function(t) {
                                t !== o && t.raised && t.graphic && (t.graphic.attr({
                                    y: t._y
                                }), t.raised = !1)
                            })
                        })
                    })
                },
                animate: n,
                buildKDTree: n,
                setClip: n
            }), p.flag = function(t, e, i, o, n) {
                return ["M", n && n.anchorX || t, n && n.anchorY || e, "L", t, e + o, t, e, t + i, e, t + i, e + o, t, e + o, "Z"]
            }, i(["circle", "square"], function(t) {
                p[t + "pin"] = function(e, i, o, n, r) {
                    var a, s, l = r && r.anchorX,
                        h = r && r.anchorY;
                    return "circle" === t && n > o && (e -= Math.round((n - o) / 2), o = n), a = p[t](e, i, o, n), l && h && (s = i > h ? i : i + n, a.push("M", l, s, "L", l, h)), a
                }
            }), r === d && i(["flag", "circlepin", "squarepin"], function(t) {
                d.prototype.symbols[t] = p[t]
            })
        }(e),
        function(t) {
            function e(t, e, i) {
                this.init(t, e, i)
            }
            var i, o = t.addEvent,
                n = t.Axis,
                r = t.correctFloat,
                a = t.defaultOptions,
                s = t.defined,
                l = t.destroyObjectProperties,
                h = t.doc,
                c = t.each,
                d = t.fireEvent,
                p = t.hasTouch,
                u = t.isTouchDevice,
                g = t.merge,
                f = t.pick,
                m = t.removeEvent,
                x = t.svg,
                v = t.wrap,
                y = {
                    height: u ? 20 : 14,
                    barBorderRadius: 0,
                    buttonBorderRadius: 0,
                    liveRedraw: x && !u,
                    margin: 10,
                    minWidth: 6,
                    step: .2,
                    zIndex: 3,
                    barBackgroundColor: "#cccccc",
                    barBorderWidth: 1,
                    barBorderColor: "#cccccc",
                    buttonArrowColor: "#333333",
                    buttonBackgroundColor: "#e6e6e6",
                    buttonBorderColor: "#cccccc",
                    buttonBorderWidth: 1,
                    rifleColor: "#333333",
                    trackBackgroundColor: "#f2f2f2",
                    trackBorderColor: "#f2f2f2",
                    trackBorderWidth: 1
                };
            a.scrollbar = g(!0, y, a.scrollbar), t.swapXY = i = function(t, e) {
                var i, o, n = t.length;
                if (e)
                    for (i = 0; i < n; i += 3) o = t[i + 1], t[i + 1] = t[i + 2], t[i + 2] = o;
                return t
            }, e.prototype = {
                init: function(t, e, i) {
                    this.scrollbarButtons = [], this.renderer = t, this.userOptions = e, this.options = g(y, e), this.chart = i, this.size = f(this.options.size, this.options.height), e.enabled && (this.render(), this.initEvents(), this.addEvents())
                },
                render: function() {
                    var t, e = this,
                        o = e.renderer,
                        n = e.options,
                        r = e.size;
                    e.group = t = o.g("scrollbar").attr({
                        zIndex: n.zIndex,
                        translateY: -99999
                    }).add(), e.track = o.rect().addClass("highcharts-scrollbar-track").attr({
                        x: 0,
                        r: n.trackBorderRadius || 0,
                        height: r,
                        width: r
                    }).add(t), e.track.attr({
                        fill: n.trackBackgroundColor,
                        stroke: n.trackBorderColor,
                        "stroke-width": n.trackBorderWidth
                    }), this.trackBorderWidth = e.track.strokeWidth(), e.track.attr({
                        y: -this.trackBorderWidth % 2 / 2
                    }), e.scrollbarGroup = o.g().add(t), e.scrollbar = o.rect().addClass("highcharts-scrollbar-thumb").attr({
                        height: r,
                        width: r,
                        r: n.barBorderRadius || 0
                    }).add(e.scrollbarGroup), e.scrollbarRifles = o.path(i(["M", -3, r / 4, "L", -3, 2 * r / 3, "M", 0, r / 4, "L", 0, 2 * r / 3, "M", 3, r / 4, "L", 3, 2 * r / 3], n.vertical)).addClass("highcharts-scrollbar-rifles").add(e.scrollbarGroup), e.scrollbar.attr({
                        fill: n.barBackgroundColor,
                        stroke: n.barBorderColor,
                        "stroke-width": n.barBorderWidth
                    }), e.scrollbarRifles.attr({
                        stroke: n.rifleColor,
                        "stroke-width": 1
                    }), e.scrollbarStrokeWidth = e.scrollbar.strokeWidth(), e.scrollbarGroup.translate(-e.scrollbarStrokeWidth % 2 / 2, -e.scrollbarStrokeWidth % 2 / 2), e.drawScrollbarButton(0), e.drawScrollbarButton(1)
                },
                position: function(t, e, i, o) {
                    var n = this,
                        r = n.options.vertical,
                        a = o,
                        s = 0,
                        l = n.rendered ? "animate" : "attr";
                    n.x = t, n.y = e + this.trackBorderWidth, n.width = i, n.height = o, n.xOffset = a, n.yOffset = s, r ? (n.width = n.yOffset = i = s = n.size, n.xOffset = a = 0, n.barWidth = o - 2 * i, n.x = t += n.options.margin) : (n.height = n.xOffset = o = a = n.size, n.barWidth = i - 2 * o, n.y = n.y + n.options.margin), n.group[l]({
                        translateX: t,
                        translateY: n.y
                    }), n.track[l]({
                        width: i,
                        height: o
                    }), n.scrollbarButtons[1][l]({
                        translateX: r ? 0 : i - a,
                        translateY: r ? o - s : 0
                    })
                },
                drawScrollbarButton: function(t) {
                    var e, o, n = this,
                        r = n.renderer,
                        a = n.scrollbarButtons,
                        s = n.options,
                        l = n.size;
                    e = r.g().add(n.group), a.push(e), (o = r.rect().addClass("highcharts-scrollbar-button").add(e)).attr({
                        stroke: s.buttonBorderColor,
                        "stroke-width": s.buttonBorderWidth,
                        fill: s.buttonBackgroundColor
                    }), o.attr(o.crisp({
                        x: -.5,
                        y: -.5,
                        width: l + 1,
                        height: l + 1,
                        r: s.buttonBorderRadius
                    }, o.strokeWidth())), (o = r.path(i(["M", l / 2 + (t ? -1 : 1), l / 2 - 3, "L", l / 2 + (t ? -1 : 1), l / 2 + 3, "L", l / 2 + (t ? 2 : -2), l / 2], s.vertical)).addClass("highcharts-scrollbar-arrow").add(a[t])).attr({
                        fill: s.buttonArrowColor
                    })
                },
                setRange: function(t, e) {
                    var i, o, n, a, l, h = this,
                        c = h.options,
                        d = c.vertical,
                        p = c.minWidth,
                        u = h.barWidth,
                        g = this.rendered && !this.hasDragged ? "animate" : "attr";
                    s(u) && (t = Math.max(t, 0), i = Math.ceil(u * t), o = u * Math.min(e, 1), h.calculatedWidth = a = r(o - i), a < p && (i = (u - p + a) * t, a = p), n = Math.floor(i + h.xOffset + h.yOffset), l = a / 2 - .5, h.from = t, h.to = e, d ? (h.scrollbarGroup[g]({
                        translateY: n
                    }), h.scrollbar[g]({
                        height: a
                    }), h.scrollbarRifles[g]({
                        translateY: l
                    }), h.scrollbarTop = n, h.scrollbarLeft = 0) : (h.scrollbarGroup[g]({
                        translateX: n
                    }), h.scrollbar[g]({
                        width: a
                    }), h.scrollbarRifles[g]({
                        translateX: l
                    }), h.scrollbarLeft = n, h.scrollbarTop = 0), a <= 12 ? h.scrollbarRifles.hide() : h.scrollbarRifles.show(!0), !1 === c.showFull && (t <= 0 && e >= 1 ? h.group.hide() : h.group.show()), h.rendered = !0)
                },
                initEvents: function() {
                    var t = this;
                    t.mouseMoveHandler = function(e) {
                        var i, o = t.chart.pointer.normalize(e),
                            n = t.options.vertical ? "chartY" : "chartX",
                            r = t.initPositions;
                        !t.grabbedCenter || e.touches && 0 === e.touches[0][n] || (i = t.cursorToScrollbarPosition(o)[n] - t[n], t.hasDragged = !0, t.updatePosition(r[0] + i, r[1] + i), t.hasDragged && d(t, "changed", {
                            from: t.from,
                            to: t.to,
                            trigger: "scrollbar",
                            DOMType: e.type,
                            DOMEvent: e
                        }))
                    }, t.mouseUpHandler = function(e) {
                        t.hasDragged && d(t, "changed", {
                            from: t.from,
                            to: t.to,
                            trigger: "scrollbar",
                            DOMType: e.type,
                            DOMEvent: e
                        }), t.grabbedCenter = t.hasDragged = t.chartX = t.chartY = null
                    }, t.mouseDownHandler = function(e) {
                        var i = t.chart.pointer.normalize(e),
                            o = t.cursorToScrollbarPosition(i);
                        t.chartX = o.chartX, t.chartY = o.chartY, t.initPositions = [t.from, t.to], t.grabbedCenter = !0
                    }, t.buttonToMinClick = function(e) {
                        var i = r(t.to - t.from) * t.options.step;
                        t.updatePosition(r(t.from - i), r(t.to - i)), d(t, "changed", {
                            from: t.from,
                            to: t.to,
                            trigger: "scrollbar",
                            DOMEvent: e
                        })
                    }, t.buttonToMaxClick = function(e) {
                        var i = (t.to - t.from) * t.options.step;
                        t.updatePosition(t.from + i, t.to + i), d(t, "changed", {
                            from: t.from,
                            to: t.to,
                            trigger: "scrollbar",
                            DOMEvent: e
                        })
                    }, t.trackClick = function(e) {
                        var i = t.chart.pointer.normalize(e),
                            o = t.to - t.from,
                            n = t.y + t.scrollbarTop,
                            r = t.x + t.scrollbarLeft;
                        t.options.vertical && i.chartY > n || !t.options.vertical && i.chartX > r ? t.updatePosition(t.from + o, t.to + o) : t.updatePosition(t.from - o, t.to - o), d(t, "changed", {
                            from: t.from,
                            to: t.to,
                            trigger: "scrollbar",
                            DOMEvent: e
                        })
                    }
                },
                cursorToScrollbarPosition: function(t) {
                    var e = this,
                        i = e.options,
                        o = i.minWidth > e.calculatedWidth ? i.minWidth : 0;
                    return {
                        chartX: (t.chartX - e.x - e.xOffset) / (e.barWidth - o),
                        chartY: (t.chartY - e.y - e.yOffset) / (e.barWidth - o)
                    }
                },
                updatePosition: function(t, e) {
                    e > 1 && (t = r(1 - r(e - t)), e = 1), t < 0 && (e = r(e - t), t = 0), this.from = t, this.to = e
                },
                update: function(t) {
                    this.destroy(), this.init(this.chart.renderer, g(!0, this.options, t), this.chart)
                },
                addEvents: function() {
                    var t, e = this.options.inverted ? [1, 0] : [0, 1],
                        i = this.scrollbarButtons,
                        n = this.scrollbarGroup.element,
                        r = this.track.element,
                        a = this.mouseDownHandler,
                        s = this.mouseMoveHandler,
                        l = this.mouseUpHandler;
                    t = [
                        [i[e[0]].element, "click", this.buttonToMinClick],
                        [i[e[1]].element, "click", this.buttonToMaxClick],
                        [r, "click", this.trackClick],
                        [n, "mousedown", a],
                        [h, "mousemove", s],
                        [h, "mouseup", l]
                    ], p && t.push([n, "touchstart", a], [h, "touchmove", s], [h, "touchend", l]), c(t, function(t) {
                        o.apply(null, t)
                    }), this._events = t
                },
                removeEvents: function() {
                    c(this._events, function(t) {
                        m.apply(null, t)
                    }), this._events.length = 0
                },
                destroy: function() {
                    var t = this.chart.scroller;
                    this.removeEvents(), c(["track", "scrollbarRifles", "scrollbar", "scrollbarGroup", "group"], function(t) {
                        this[t] && this[t].destroy && (this[t] = this[t].destroy())
                    }, this), t && this === t.scrollbar && (t.scrollbar = null, l(t.scrollbarButtons))
                }
            }, v(n.prototype, "init", function(t) {
                var i = this;
                t.apply(i, Array.prototype.slice.call(arguments, 1)), i.options.scrollbar && i.options.scrollbar.enabled && (i.options.scrollbar.vertical = !i.horiz, i.options.startOnTick = i.options.endOnTick = !1, i.scrollbar = new e(i.chart.renderer, i.options.scrollbar, i.chart), o(i.scrollbar, "changed", function(t) {
                    var e, o, n = Math.min(f(i.options.min, i.min), i.min, i.dataMin),
                        r = Math.max(f(i.options.max, i.max), i.max, i.dataMax) - n;
                    i.horiz && !i.reversed || !i.horiz && i.reversed ? (e = n + r * this.to, o = n + r * this.from) : (e = n + r * (1 - this.from), o = n + r * (1 - this.to)), i.setExtremes(o, e, !0, !1, t)
                }))
            }), v(n.prototype, "render", function(t) {
                var e, i, o, n = this,
                    r = Math.min(f(n.options.min, n.min), n.min, n.dataMin),
                    a = Math.max(f(n.options.max, n.max), n.max, n.dataMax),
                    l = n.scrollbar,
                    h = n.titleOffset || 0;
                t.apply(n, Array.prototype.slice.call(arguments, 1)), l && (n.horiz ? (l.position(n.left, n.top + n.height + 2 + n.chart.scrollbarsOffsets[1] + (n.opposite ? 0 : h + n.axisTitleMargin + n.offset), n.width, n.height), e = 1) : (l.position(n.left + n.width + 2 + n.chart.scrollbarsOffsets[0] + (n.opposite ? h + n.axisTitleMargin + n.offset : 0), n.top, n.width, n.height), e = 0), (!n.opposite && !n.horiz || n.opposite && n.horiz) && (n.chart.scrollbarsOffsets[e] += n.scrollbar.size + n.scrollbar.options.margin), isNaN(r) || isNaN(a) || !s(n.min) || !s(n.max) ? l.setRange(0, 0) : (i = (n.min - r) / (a - r), o = (n.max - r) / (a - r), n.horiz && !n.reversed || !n.horiz && n.reversed ? l.setRange(i, o) : l.setRange(1 - o, 1 - i)))
            }), v(n.prototype, "getOffset", function(t) {
                var e = this,
                    i = e.horiz ? 2 : 1,
                    o = e.scrollbar;
                t.apply(e, Array.prototype.slice.call(arguments, 1)), o && (e.chart.scrollbarsOffsets = [0, 0], e.chart.axisOffset[i] += o.size + o.options.margin)
            }), v(n.prototype, "destroy", function(t) {
                this.scrollbar && (this.scrollbar = this.scrollbar.destroy()), t.apply(this, Array.prototype.slice.call(arguments, 1))
            }), t.Scrollbar = e
        }(e),
        function(t) {
            function e(t) {
                this.init(t)
            }
            var i, o = t.addEvent,
                n = t.Axis,
                r = t.Chart,
                a = t.color,
                s = t.defaultDataGroupingUnits,
                l = t.defaultOptions,
                h = t.defined,
                c = t.destroyObjectProperties,
                d = t.doc,
                p = t.each,
                u = t.erase,
                g = t.extend,
                f = t.grep,
                m = t.hasTouch,
                x = t.isNumber,
                v = t.isObject,
                y = t.isTouchDevice,
                b = t.merge,
                M = t.pick,
                w = t.removeEvent,
                k = t.Scrollbar,
                S = t.Series,
                A = t.seriesTypes,
                C = t.wrap,
                T = [].concat(s),
                P = function(t) {
                    var e = f(arguments, x);
                    if (e.length) return Math[t].apply(0, e)
                };
            T[4] = ["day", [1, 2, 3, 4]], T[5] = ["week", [1, 2, 3]], i = void 0 === A.areaspline ? "line" : "areaspline", g(l, {
                navigator: {
                    height: 40,
                    margin: 25,
                    maskInside: !0,
                    handles: {
                        backgroundColor: "#f2f2f2",
                        borderColor: "#999999"
                    },
                    maskFill: a("#6685c2").setOpacity(.3).get(),
                    outlineColor: "#cccccc",
                    outlineWidth: 1,
                    series: {
                        type: i,
                        color: "#335cad",
                        fillOpacity: .05,
                        lineWidth: 1,
                        compare: null,
                        dataGrouping: {
                            approximation: "average",
                            enabled: !0,
                            groupPixelWidth: 2,
                            smoothed: !0,
                            units: T
                        },
                        dataLabels: {
                            enabled: !1,
                            zIndex: 2
                        },
                        id: "highcharts-navigator-series",
                        className: "highcharts-navigator-series",
                        lineColor: null,
                        marker: {
                            enabled: !1
                        },
                        pointRange: 0,
                        shadow: !1,
                        threshold: null
                    },
                    xAxis: {
                        className: "highcharts-navigator-xaxis",
                        tickLength: 0,
                        lineWidth: 0,
                        gridLineColor: "#e6e6e6",
                        gridLineWidth: 1,
                        tickPixelInterval: 200,
                        labels: {
                            align: "left",
                            style: {
                                color: "#999999"
                            },
                            x: 3,
                            y: -4
                        },
                        crosshair: !1
                    },
                    yAxis: {
                        className: "highcharts-navigator-yaxis",
                        gridLineWidth: 0,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: .1,
                        maxPadding: .1,
                        labels: {
                            enabled: !1
                        },
                        crosshair: !1,
                        title: {
                            text: null
                        },
                        tickLength: 0,
                        tickWidth: 0
                    }
                }
            }), e.prototype = {
                drawHandle: function(t, e) {
                    var i = this,
                        o = i.chart.renderer,
                        n = i.handles;
                    if (!i.rendered) {
                        n[e] = o.path(["M", -4.5, .5, "L", 3.5, .5, 3.5, 15.5, -4.5, 15.5, -4.5, .5, "M", -1.5, 4, "L", -1.5, 12, "M", .5, 4, "L", .5, 12]).attr({
                            zIndex: 10 - e
                        }).addClass("highcharts-navigator-handle highcharts-navigator-handle-" + ["left", "right"][e]).add();
                        var r = i.navigatorOptions.handles;
                        n[e].attr({
                            fill: r.backgroundColor,
                            stroke: r.borderColor,
                            "stroke-width": 1
                        }).css({
                            cursor: "ew-resize"
                        })
                    }
                    n[e][i.rendered && !i.hasDragged ? "animate" : "attr"]({
                        translateX: Math.round(i.scrollerLeft + i.scrollbarHeight + parseInt(t, 10)),
                        translateY: Math.round(i.top + i.height / 2 - 8)
                    })
                },
                update: function(t) {
                    this.destroy();
                    var e = this.chart.options;
                    b(!0, e.navigator, this.options, t), this.init(this.chart)
                },
                render: function(t, e, i, o) {
                    var n, r, a, s, l, c, d, p, u, g = this,
                        f = g.chart,
                        m = f.renderer,
                        v = g.navigatorGroup,
                        y = g.scrollbarHeight,
                        b = g.xAxis,
                        w = g.navigatorOptions,
                        k = w.maskInside,
                        S = g.height,
                        A = g.top,
                        C = g.navigatorEnabled,
                        T = g.outlineHeight,
                        P = g.rendered;
                    x(t) && x(e) && (!g.hasDragged || h(i)) && (g.navigatorLeft = n = M(b.left, f.plotLeft + y), g.navigatorWidth = r = M(b.len, f.plotWidth - 2 * y), g.scrollerLeft = a = n - y, g.scrollerWidth = s = s = r + 2 * y, i = M(i, b.translate(t)), o = M(o, b.translate(e)), x(i) && Math.abs(i) !== 1 / 0 || (i = 0, o = s), b.translate(o, !0) - b.translate(i, !0) < f.xAxis[0].minRange || (g.zoomedMax = Math.min(Math.max(i, o, 0), r), g.zoomedMin = Math.min(Math.max(g.fixedWidth ? g.zoomedMax - g.fixedWidth : Math.min(i, o), 0), r), g.range = g.zoomedMax - g.zoomedMin, d = Math.round(g.zoomedMax), c = Math.round(g.zoomedMin), P || C && (g.navigatorGroup = v = m.g("navigator").attr({
                        zIndex: 3
                    }).add(), g.leftShade = m.rect().addClass("highcharts-navigator-mask" + (k ? "-inside" : "")).attr({
                        fill: w.maskFill
                    }).css(k && {
                        cursor: "ew-resize"
                    }).add(v), k || (g.rightShade = m.rect().addClass("highcharts-navigator-mask").attr({
                        fill: w.maskFill
                    }).add(v)), g.outline = m.path().addClass("highcharts-navigator-outline").attr({
                        "stroke-width": w.outlineWidth,
                        stroke: w.outlineColor
                    }).add(v)), C && (u = P && !g.hasDragged ? "animate" : "attr", p = A + (l = g.outline.strokeWidth() / 2), g.leftShade[u](w.maskInside ? {
                        x: n + c,
                        y: A,
                        width: d - c,
                        height: S
                    } : {
                        x: n,
                        y: A,
                        width: c,
                        height: S
                    }), g.rightShade && g.rightShade[u]({
                        x: n + d,
                        y: A,
                        width: r - d,
                        height: S
                    }), g.outline[u]({
                        d: ["M", a, p, "L", n + c - l, p, n + c - l, p + T, "L", n + d - l, p + T, "L", n + d - l, p, a + s, p].concat(w.maskInside ? ["M", n + c + l, p, "L", n + d - l, p] : [])
                    }), g.drawHandle(c + l, 0), g.drawHandle(d + l, 1)), g.scrollbar && (g.scrollbar.hasDragged = g.hasDragged, g.scrollbar.position(g.scrollerLeft, g.top + (C ? g.height : -g.scrollbarHeight), g.scrollerWidth, g.scrollbarHeight), g.scrollbar.setRange(c / r, d / r)), g.rendered = !0))
                },
                addEvents: function() {
                    var t, e = this.chart,
                        i = e.container,
                        n = this.mouseDownHandler,
                        r = this.mouseMoveHandler,
                        a = this.mouseUpHandler;
                    t = [
                        [i, "mousedown", n],
                        [i, "mousemove", r],
                        [d, "mouseup", a]
                    ], m && t.push([i, "touchstart", n], [i, "touchmove", r], [d, "touchend", a]), p(t, function(t) {
                        o.apply(null, t)
                    }), this._events = t, this.series && this.series[0] && o(this.series[0].xAxis, "foundExtremes", function() {
                        e.scroller.modifyNavigatorAxisExtremes()
                    }), o(e, "redraw", function() {
                        var t = this.scroller,
                            e = t && (t.baseSeries && t.baseSeries[0] && t.baseSeries[0].xAxis || t.scrollbar && this.xAxis[0]);
                        e && t.render(e.min, e.max)
                    })
                },
                removeEvents: function() {
                    this._events && (p(this._events, function(t) {
                        w.apply(null, t)
                    }), this._events = void 0), this.removeBaseSeriesEvents()
                },
                removeBaseSeriesEvents: function() {
                    var t = this.baseSeries || [];
                    this.navigatorEnabled && t[0] && !1 !== this.navigatorOptions.adaptToUpdatedData && (p(t, function(t) {
                        w(t, "updatedData", this.updatedDataHandler)
                    }, this), t[0].xAxis && w(t[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes))
                },
                init: function(t) {
                    var e = t.options,
                        i = e.navigator,
                        r = i.enabled,
                        a = e.scrollbar,
                        s = a.enabled,
                        l = r ? i.height : 0,
                        c = s ? a.height : 0;
                    this.handles = [], this.scrollbarButtons = [], this.elementsToDestroy = [], this.chart = t, this.setBaseSeries(), this.height = l, this.scrollbarHeight = c, this.scrollbarEnabled = s, this.navigatorEnabled = r, this.navigatorOptions = i, this.scrollbarOptions = a, this.outlineHeight = l + c;
                    var d, p, u = this,
                        g = u.baseSeries;
                    u.mouseDownHandler = function(e) {
                        e = t.pointer.normalize(e);
                        var i, o, n, r = u.zoomedMin,
                            a = u.zoomedMax,
                            s = u.top,
                            h = u.scrollerLeft,
                            c = u.scrollerWidth,
                            g = u.navigatorLeft,
                            f = u.navigatorWidth,
                            m = u.scrollbarPad || 0,
                            x = u.range,
                            v = e.chartX,
                            b = e.chartY,
                            M = t.xAxis[0],
                            w = y ? 10 : 7;
                        b > s && b < s + l && (Math.abs(v - r - g) < w ? (u.grabbedLeft = !0, u.otherHandlePos = a, u.fixedExtreme = M.max, t.fixedRange = null) : Math.abs(v - a - g) < w ? (u.grabbedRight = !0, u.otherHandlePos = r, u.fixedExtreme = M.min, t.fixedRange = null) : v > g + r - m && v < g + a + m ? (u.grabbedCenter = v, u.fixedWidth = x, p = v - r) : v > h && v < h + c && ((n = v - g - x / 2) < 0 ? n = 0 : n + x >= f && (n = f - x, i = u.getUnionExtremes().dataMax), n !== r && (u.fixedWidth = x, o = d.toFixedRange(n, n + x, null, i), M.setExtremes(o.min, o.max, !0, null, {
                            trigger: "navigator"
                        }))))
                    }, u.mouseMoveHandler = function(e) {
                        var i, o = u.scrollbarHeight,
                            n = u.navigatorLeft,
                            r = u.navigatorWidth,
                            a = u.scrollerLeft,
                            s = u.scrollerWidth,
                            l = u.range;
                        e.touches && 0 === e.touches[0].pageX || ((i = (e = t.pointer.normalize(e)).chartX) < n ? i = n : i > a + s - o && (i = a + s - o), u.grabbedLeft ? (u.hasDragged = !0, u.render(0, 0, i - n, u.otherHandlePos)) : u.grabbedRight ? (u.hasDragged = !0, u.render(0, 0, u.otherHandlePos, i - n)) : u.grabbedCenter && (u.hasDragged = !0, i < p ? i = p : i > r + p - l && (i = r + p - l), u.render(0, 0, i - p, i - p + l)), u.hasDragged && u.scrollbar && u.scrollbar.options.liveRedraw && (e.DOMType = e.type, setTimeout(function() {
                            u.mouseUpHandler(e)
                        }, 0)))
                    }, u.mouseUpHandler = function(e) {
                        var i, o, n, r = e.DOMEvent || e;
                        (u.hasDragged || "scrollbar" === e.trigger) && (u.zoomedMin === u.otherHandlePos ? o = u.fixedExtreme : u.zoomedMax === u.otherHandlePos && (n = u.fixedExtreme), u.zoomedMax === u.navigatorWidth && (n = u.getUnionExtremes().dataMax), i = d.toFixedRange(u.zoomedMin, u.zoomedMax, o, n), h(i.min) && t.xAxis[0].setExtremes(i.min, i.max, !0, !u.hasDragged && null, {
                            trigger: "navigator",
                            triggerOp: "navigator-drag",
                            DOMEvent: r
                        })), "mousemove" !== e.DOMType && (u.grabbedLeft = u.grabbedRight = u.grabbedCenter = u.fixedWidth = u.fixedExtreme = u.otherHandlePos = u.hasDragged = p = null)
                    };
                    var f = t.xAxis.length,
                        m = t.yAxis.length,
                        x = g && g[0] && g[0].xAxis || t.xAxis[0];
                    t.extraBottomMargin = u.outlineHeight + i.margin, t.isDirtyBox = !0, u.navigatorEnabled ? (u.xAxis = d = new n(t, b({
                        offset: 0
                    }, {
                        breaks: x.options.breaks,
                        ordinal: x.options.ordinal
                    }, i.xAxis, {
                        id: "navigator-x-axis",
                        yAxis: "navigator-y-axis",
                        isX: !0,
                        type: "datetime",
                        index: f,
                        height: l,
                        offsetLeft: c,
                        offsetRight: -c,
                        keepOrdinalPadding: !0,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: 0,
                        maxPadding: 0,
                        zoomEnabled: !1
                    })), u.yAxis = new n(t, b(i.yAxis, {
                        id: "navigator-y-axis",
                        alignTicks: !1,
                        height: l,
                        offset: 0,
                        index: m,
                        zoomEnabled: !1
                    })), g || i.series.data ? u.addBaseSeries() : 0 === t.series.length && C(t, "redraw", function(e, i) {
                        t.series.length > 0 && !u.series && (u.setBaseSeries(), t.redraw = e), e.call(t, i)
                    })) : u.xAxis = d = {
                        translate: function(e, i) {
                            var o = t.xAxis[0],
                                n = o.getExtremes(),
                                r = t.plotWidth - 2 * c,
                                a = P("min", o.options.min, n.dataMin),
                                s = P("max", o.options.max, n.dataMax) - a;
                            return i ? e * s / r + a : r * (e - a) / s
                        },
                        toFixedRange: n.prototype.toFixedRange,
                        fake: !0
                    }, t.options.scrollbar.enabled && (t.scrollbar = u.scrollbar = new k(t.renderer, b(t.options.scrollbar, {
                        margin: u.navigatorEnabled ? 0 : 10
                    }), t), o(u.scrollbar, "changed", function(e) {
                        var i = u.navigatorWidth,
                            o = i * this.to,
                            n = i * this.from;
                        u.hasDragged = u.scrollbar.hasDragged, u.render(0, 0, n, o), (t.options.scrollbar.liveRedraw || "mousemove" !== e.DOMType) && setTimeout(function() {
                            u.mouseUpHandler(e)
                        })
                    })), u.addBaseSeriesEvents(), u.addEvents()
                },
                getUnionExtremes: function(t) {
                    var e, i = this.chart.xAxis[0],
                        o = this.xAxis,
                        n = o.options,
                        r = i.options;
                    return t && null === i.dataMin || (e = {
                        dataMin: M(n && n.min, P("min", r.min, i.dataMin, o.dataMin, o.min)),
                        dataMax: M(n && n.max, P("max", r.max, i.dataMax, o.dataMax, o.max))
                    }), e
                },
                setBaseSeries: function(t) {
                    var e = this.chart,
                        i = this.baseSeries = [];
                    t = t || e.options && e.options.navigator.baseSeries || 0, this.series && (this.removeBaseSeriesEvents(), p(this.series, function(t) {
                        t.destroy()
                    })), p(e.series || [], function(e, o) {
                        (e.options.showInNavigator || (o === t || e.options.id === t) && !1 !== e.options.showInNavigator) && i.push(e)
                    }), this.xAxis && !this.xAxis.fake && this.addBaseSeries()
                },
                addBaseSeries: function() {
                    var t, e, i, o = this,
                        n = o.chart,
                        r = o.series = [],
                        a = o.baseSeries,
                        s = o.navigatorOptions.series,
                        l = {
                            enableMouseTracking: !1,
                            group: "nav",
                            padXAxis: !1,
                            xAxis: "navigator-x-axis",
                            yAxis: "navigator-y-axis",
                            showInLegend: !1,
                            stacking: !1,
                            isInternal: !0,
                            visible: !0
                        };
                    a ? p(a, function(a, h) {
                        l.name = "Navigator " + (h + 1), t = a.options || {}, i = t.navigatorOptions || {}, e = b(t, l, s, i);
                        var c = i.data || s.data;
                        o.hasNavigatorData = o.hasNavigatorData || !!c, e.data = c || t.data && t.data.slice(0), a.navigatorSeries = n.initSeries(e), r.push(a.navigatorSeries)
                    }) : ((e = b(s, l)).data = s.data, o.hasNavigatorData = !!e.data, r.push(n.initSeries(e))), this.addBaseSeriesEvents()
                },
                addBaseSeriesEvents: function() {
                    var t = this,
                        e = t.baseSeries || [];
                    e[0] && e[0].xAxis && o(e[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes), !1 !== this.navigatorOptions.adaptToUpdatedData && p(e, function(e) {
                        e.xAxis && (o(e, "updatedData", this.updatedDataHandler), e.userOptions.events = g(e.userOptions.event, {
                            updatedData: this.updatedDataHandler
                        })), o(e, "remove", function() {
                            this.navigatorSeries && (u(t.series, this.navigatorSeries), this.navigatorSeries.remove(), delete this.navigatorSeries)
                        })
                    }, this)
                },
                modifyNavigatorAxisExtremes: function() {
                    var t, e = this.xAxis;
                    e.getExtremes && (!(t = this.getUnionExtremes(!0)) || t.dataMin === e.min && t.dataMax === e.max || (e.min = t.dataMin, e.max = t.dataMax))
                },
                modifyBaseAxisExtremes: function() {
                    var t, e, i = this,
                        o = i.chart.scroller,
                        n = i.getExtremes(),
                        r = n.min,
                        a = n.max,
                        s = n.dataMin,
                        l = n.dataMax,
                        h = a - r,
                        c = o.stickToMin,
                        d = o.stickToMax,
                        p = o.series && o.series[0],
                        u = !!i.setExtremes;
                    i.eventArgs && "rangeSelectorButton" === i.eventArgs.trigger || (c && (t = (e = s) + h), d && (t = l, c || (e = Math.max(t - h, p && p.xData ? p.xData[0] : -Number.MAX_VALUE))), u && (c || d) && x(e) && (i.min = i.userMin = e, i.max = i.userMax = t)), o.stickToMin = o.stickToMax = null
                },
                updatedDataHandler: function() {
                    var t = this.chart.scroller,
                        e = this,
                        i = this.navigatorSeries;
                    t.stickToMin = x(e.xAxis.min) && e.xAxis.min <= e.xData[0], t.stickToMax = Math.round(t.zoomedMax) >= Math.round(t.navigatorWidth), i && !t.hasNavigatorData && (i.options.pointStart = e.xData[0], i.setData(e.options.data, !1, null, !1))
                },
                destroy: function() {
                    this.removeEvents(), this.xAxis && (u(this.chart.xAxis, this.xAxis), u(this.chart.axes, this.xAxis)), this.yAxis && (u(this.chart.yAxis, this.yAxis), u(this.chart.axes, this.yAxis)), p(this.series || [], function(t) {
                        t.destroy && t.destroy()
                    }), p(["series", "xAxis", "yAxis", "leftShade", "rightShade", "outline", "scrollbarTrack", "scrollbarRifles", "scrollbarGroup", "scrollbar", "navigatorGroup", "rendered"], function(t) {
                        this[t] && this[t].destroy && this[t].destroy(), this[t] = null
                    }, this), p([this.handles, this.elementsToDestroy], function(t) {
                        c(t)
                    }, this)
                }
            }, t.Navigator = e, C(n.prototype, "zoom", function(t, e, i) {
                var o, n, r = this.chart,
                    a = r.options,
                    s = a.chart.zoomType,
                    l = a.navigator,
                    c = a.rangeSelector;
                return this.isXAxis && (l && l.enabled || c && c.enabled) && ("x" === s ? r.resetZoomButton = "blocked" : "y" === s ? n = !1 : "xy" === s && (o = this.previousZoom, h(e) ? this.previousZoom = [this.min, this.max] : o && (e = o[0], i = o[1], delete this.previousZoom))), void 0 !== n ? n : t.call(this, e, i)
            }), C(r.prototype, "init", function(t, i, n) {
                o(this, "beforeRender", function() {
                    var t = this.options;
                    (t.navigator.enabled || t.scrollbar.enabled) && (this.scroller = this.navigator = new e(this))
                }), t.call(this, i, n)
            }), C(r.prototype, "getMargins", function(t) {
                var e, i, o = this.legend,
                    n = o.options,
                    r = this.scroller;
                t.apply(this, [].slice.call(arguments, 1)), r && (e = r.xAxis, i = r.yAxis, r.top = r.navigatorOptions.top || this.chartHeight - r.height - r.scrollbarHeight - this.spacing[2] - ("bottom" === n.verticalAlign && n.enabled && !n.floating ? o.legendHeight + M(n.margin, 10) : 0), e && i && (e.options.top = i.options.top = r.top, e.setAxisSize(), i.setAxisSize()))
            }), C(S.prototype, "addPoint", function(e, i, o, n, r) {
                var a = this.options.turboThreshold;
                a && this.xData.length > a && v(i, !0) && this.chart.scroller && t.error(20, !0), e.call(this, i, o, n, r)
            }), C(r.prototype, "addSeries", function(t, e, i, o) {
                var n = t.call(this, e, !1, o);
                return this.scroller && this.scroller.setBaseSeries(), M(i, !0) && this.redraw(), n
            }), C(S.prototype, "update", function(t, e, i) {
                t.call(this, e, !1), this.chart.scroller && this.chart.scroller.setBaseSeries(), M(i, !0) && this.chart.redraw()
            })
        }(e),
        function(t) {
            function e(t) {
                this.init(t)
            }
            var i = t.addEvent,
                o = t.Axis,
                n = t.Chart,
                r = t.css,
                a = t.createElement,
                s = t.dateFormat,
                l = t.defaultOptions,
                h = l.global.useUTC,
                c = t.defined,
                d = t.destroyObjectProperties,
                p = t.discardElement,
                u = t.each,
                g = t.extend,
                f = t.fireEvent,
                m = t.Date,
                x = t.isNumber,
                v = t.merge,
                y = t.pick,
                b = t.pInt,
                M = t.splat,
                w = t.wrap;
            g(l, {
                rangeSelector: {
                    buttonTheme: {
                        "stroke-width": 0,
                        width: 28,
                        height: 18,
                        padding: 2,
                        zIndex: 7
                    },
                    height: 35,
                    inputPosition: {
                        align: "right"
                    },
                    labelStyle: {
                        color: "#666666"
                    }
                }
            }), l.lang = v(l.lang, {
                rangeSelectorZoom: "Zoom",
                rangeSelectorFrom: "From",
                rangeSelectorTo: "To"
            }), e.prototype = {
                clickButton: function(t, e) {
                    var n, r, a, s, l, c, d, p = this,
                        g = p.chart,
                        f = p.buttonOptions[t],
                        m = g.xAxis[0],
                        v = g.scroller && g.scroller.getUnionExtremes() || m || {},
                        b = v.dataMin,
                        w = v.dataMax,
                        k = m && Math.round(Math.min(m.max, y(w, m.max))),
                        S = f.type,
                        A = f._range,
                        C = f.dataGrouping;
                    if (null !== b && null !== w) {
                        if (g.fixedRange = A, C && (this.forcedDataGrouping = !0, o.prototype.setDataGrouping.call(m || {
                                chart: this.chart
                            }, C, !1)), "month" === S || "year" === S) m ? (c = {
                            range: f,
                            max: k,
                            dataMin: b,
                            dataMax: w
                        }, n = m.minFromRange.call(c), x(c.newMax) && (k = c.newMax)) : A = f;
                        else if (A) n = Math.max(k - A, b), k = Math.min(n + A, w);
                        else if ("ytd" === S) {
                            if (!m) return void i(g, "beforeRender", function() {
                                p.clickButton(t)
                            });
                            void 0 === w && (b = Number.MAX_VALUE, w = Number.MIN_VALUE, u(g.series, function(t) {
                                var e = t.xData;
                                b = Math.min(e[0], b), w = Math.max(e[e.length - 1], w)
                            }), e = !1), n = a = (d = p.getYTDExtremes(w, b, h)).min, k = d.max
                        } else "all" === S && m && (n = b, k = w);
                        p.setSelected(t), m ? m.setExtremes(n, k, y(e, 1), null, {
                            trigger: "rangeSelectorButton",
                            rangeSelectorButton: f
                        }) : (r = M(g.options.xAxis)[0], l = r.range, r.range = A, s = r.min, r.min = a, i(g, "load", function() {
                            r.range = l, r.min = s
                        }))
                    }
                },
                setSelected: function(t) {
                    this.selected = this.options.selected = t
                },
                defaultButtons: [{
                    type: "month",
                    count: 1,
                    text: "1m"
                }, {
                    type: "month",
                    count: 3,
                    text: "3m"
                }, {
                    type: "month",
                    count: 6,
                    text: "6m"
                }, {
                    type: "ytd",
                    text: "YTD"
                }, {
                    type: "year",
                    count: 1,
                    text: "1y"
                }, {
                    type: "all",
                    text: "All"
                }],
                init: function(t) {
                    var e = this,
                        o = t.options.rangeSelector,
                        n = o.buttons || [].concat(e.defaultButtons),
                        r = o.selected,
                        a = function() {
                            var t = e.minInput,
                                i = e.maxInput;
                            t && t.blur && f(t, "blur"), i && i.blur && f(i, "blur")
                        };
                    e.chart = t, e.options = o, e.buttons = [], t.extraTopMargin = o.height, e.buttonOptions = n, this.unMouseDown = i(t.container, "mousedown", a), this.unResize = i(t, "resize", a), u(n, e.computeButtonRange), void 0 !== r && n[r] && this.clickButton(r, !1), i(t, "load", function() {
                        i(t.xAxis[0], "setExtremes", function(i) {
                            this.max - this.min !== t.fixedRange && "rangeSelectorButton" !== i.trigger && "updatedData" !== i.trigger && e.forcedDataGrouping && this.setDataGrouping(!1, !1)
                        })
                    })
                },
                updateButtonStates: function() {
                    var t = this,
                        e = this.chart,
                        i = e.xAxis[0],
                        o = Math.round(i.max - i.min),
                        n = !i.hasVisibleSeries,
                        r = e.scroller && e.scroller.getUnionExtremes() || i,
                        a = r.dataMin,
                        s = r.dataMax,
                        l = t.getYTDExtremes(s, a, h),
                        c = l.min,
                        d = l.max,
                        p = t.selected,
                        g = x(p),
                        f = t.options.allButtonsEnabled,
                        m = t.buttons;
                    u(t.buttonOptions, function(t, e) {
                        var r, l, h = t._range,
                            u = t.type,
                            x = t.count || 1,
                            v = m[e],
                            y = 0,
                            b = e === p,
                            M = h > s - a,
                            w = h < i.minRange,
                            k = !1,
                            S = !1,
                            A = h === o;
                        ("month" === u || "year" === u) && o >= 864e5 * {
                            month: 28,
                            year: 365
                        }[u] * x && o <= 864e5 * {
                            month: 31,
                            year: 366
                        }[u] * x ? A = !0 : "ytd" === u ? (A = d - c === o, k = !b) : "all" === u && (A = i.max - i.min >= s - a, S = !b && g && A), r = !f && (M || w || S || n), l = b && A || A && !g && !k, r ? y = 3 : l && (g = !0, y = 2), v.state !== y && v.setState(y)
                    })
                },
                computeButtonRange: function(t) {
                    var e = t.type,
                        i = t.count || 1,
                        o = {
                            millisecond: 1,
                            second: 1e3,
                            minute: 6e4,
                            hour: 36e5,
                            day: 864e5,
                            week: 6048e5
                        };
                    o[e] ? t._range = o[e] * i : "month" !== e && "year" !== e || (t._range = 24 * {
                        month: 30,
                        year: 365
                    }[e] * 36e5 * i)
                },
                setInputValue: function(t, e) {
                    var i = this.chart.options.rangeSelector,
                        o = this[t + "Input"];
                    c(e) && (o.previousValue = o.HCTime, o.HCTime = e), o.value = s(i.inputEditDateFormat || "%Y-%m-%d", o.HCTime), this[t + "DateBox"].attr({
                        text: s(i.inputDateFormat || "%b %e, %Y", o.HCTime)
                    })
                },
                showInput: function(t) {
                    var e = this.inputGroup,
                        i = this[t + "DateBox"];
                    r(this[t + "Input"], {
                        left: e.translateX + i.x + "px",
                        top: e.translateY + "px",
                        width: i.width - 2 + "px",
                        height: i.height - 2 + "px",
                        border: "2px solid silver"
                    })
                },
                hideInput: function(t) {
                    r(this[t + "Input"], {
                        border: 0,
                        width: "1px",
                        height: "1px"
                    }), this.setInputValue(t)
                },
                drawInput: function(t) {
                    function e() {
                        var t = i.value,
                            e = (u.inputDateParser || Date.parse)(t),
                            o = c.xAxis[0],
                            n = c.scroller && c.scroller.xAxis ? c.scroller.xAxis : o,
                            r = n.dataMin,
                            a = n.dataMax;
                        e !== i.previousValue && (i.previousValue = e, x(e) || (e = t.split("-"), e = Date.UTC(b(e[0]), b(e[1]) - 1, b(e[2]))), x(e) && (h || (e += 60 * (new Date).getTimezoneOffset() * 1e3), y ? e > s.maxInput.HCTime ? e = void 0 : e < r && (e = r) : e < s.minInput.HCTime ? e = void 0 : e > a && (e = a), void 0 !== e && o.setExtremes(y ? e : o.min, y ? o.max : e, void 0, void 0, {
                            trigger: "rangeSelectorInput"
                        })))
                    }
                    var i, o, n, s = this,
                        c = s.chart,
                        d = c.renderer.style || {},
                        p = c.renderer,
                        u = c.options.rangeSelector,
                        f = l.lang,
                        m = s.div,
                        y = "min" === t,
                        M = this.inputGroup;
                    this[t + "Label"] = o = p.label(f[y ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).addClass("highcharts-range-label").attr({
                        padding: 2
                    }).add(M), M.offset += o.width + 5, this[t + "DateBox"] = n = p.label("", M.offset).addClass("highcharts-range-input").attr({
                        padding: 2,
                        width: u.inputBoxWidth || 90,
                        height: u.inputBoxHeight || 17,
                        stroke: u.inputBoxBorderColor || "#cccccc",
                        "stroke-width": 1,
                        "text-align": "center"
                    }).on("click", function() {
                        s.showInput(t), s[t + "Input"].focus()
                    }).add(M), M.offset += n.width + (y ? 10 : 0), this[t + "Input"] = i = a("input", {
                        name: t,
                        className: "highcharts-range-selector",
                        type: "text"
                    }, {
                        top: c.plotTop + "px"
                    }, m), o.css(v(d, u.labelStyle)), n.css(v({
                        color: "#333333"
                    }, d, u.inputStyle)), r(i, g({
                        position: "absolute",
                        border: 0,
                        width: "1px",
                        height: "1px",
                        padding: 0,
                        textAlign: "center",
                        fontSize: d.fontSize,
                        fontFamily: d.fontFamily,
                        left: "-9em"
                    }, u.inputStyle)), i.onfocus = function() {
                        s.showInput(t)
                    }, i.onblur = function() {
                        s.hideInput(t)
                    }, i.onchange = e, i.onkeypress = function(t) {
                        13 === t.keyCode && e()
                    }
                },
                getPosition: function() {
                    var t = this.chart,
                        e = t.options.rangeSelector,
                        i = y((e.buttonPosition || {}).y, t.plotTop - t.axisOffset[0] - e.height);
                    return {
                        buttonTop: i,
                        inputTop: i - 10
                    }
                },
                getYTDExtremes: function(t, e, i) {
                    var o, n = new m(t),
                        r = n[m.hcGetFullYear](),
                        a = i ? m.UTC(r, 0, 1) : +new m(r, 0, 1);
                    return o = Math.max(e || 0, a), n = n.getTime(), {
                        max: Math.min(t || n, n),
                        min: o
                    }
                },
                render: function(t, e) {
                    var i, o, n = this,
                        r = n.chart,
                        s = r.renderer,
                        h = r.container,
                        d = r.options,
                        p = d.exporting && !1 !== d.exporting.enabled && d.navigation && d.navigation.buttonOptions,
                        f = d.rangeSelector,
                        m = n.buttons,
                        x = l.lang,
                        v = n.div,
                        b = n.inputGroup,
                        M = f.buttonTheme,
                        w = f.buttonPosition || {},
                        k = f.inputEnabled,
                        S = M && M.states,
                        A = r.plotLeft,
                        C = this.getPosition(),
                        T = n.group,
                        P = n.rendered;
                    !1 !== f.enabled && (P || (n.group = T = s.g("range-selector-buttons").add(), n.zoomText = s.text(x.rangeSelectorZoom, y(w.x, A), 15).css(f.labelStyle).add(T), i = y(w.x, A) + n.zoomText.getBBox().width + 5, u(n.buttonOptions, function(t, e) {
                        m[e] = s.button(t.text, i, 0, function() {
                            n.clickButton(e), n.isActive = !0
                        }, M, S && S.hover, S && S.select, S && S.disabled).attr({
                            "text-align": "center"
                        }).add(T), i += m[e].width + y(f.buttonSpacing, 5)
                    }), !1 !== k && (n.div = v = a("div", null, {
                        position: "relative",
                        height: 0,
                        zIndex: 1
                    }), h.parentNode.insertBefore(v, h), n.inputGroup = b = s.g("input-group").add(), b.offset = 0, n.drawInput("min"), n.drawInput("max"))), n.updateButtonStates(), T[P ? "animate" : "attr"]({
                        translateY: C.buttonTop
                    }), !1 !== k && (b.align(g({
                        y: C.inputTop,
                        width: b.offset,
                        x: p && C.inputTop < (p.y || 0) + p.height - r.spacing[0] ? -40 : 0
                    }, f.inputPosition), !0, r.spacingBox), c(k) || (o = T.getBBox(), b[b.alignAttr.translateX < o.x + o.width + 10 ? "hide" : "show"]()), n.setInputValue("min", t), n.setInputValue("max", e)), n.rendered = !0)
                },
                update: function(t) {
                    var e = this.chart;
                    v(!0, e.options.rangeSelector, t), this.destroy(), this.init(e)
                },
                destroy: function() {
                    var i = this,
                        o = i.minInput,
                        n = i.maxInput;
                    i.unMouseDown(), i.unResize(), d(i.buttons), o && (o.onfocus = o.onblur = o.onchange = null), n && (n.onfocus = n.onblur = n.onchange = null), t.objectEach(i, function(t, o) {
                        t && "chart" !== o && (t.destroy ? t.destroy() : t.nodeType && p(this[o])), t !== e.prototype[o] && (i[o] = null)
                    }, this)
                }
            }, o.prototype.toFixedRange = function(t, e, i, o) {
                var n = this.chart && this.chart.fixedRange,
                    r = y(i, this.translate(t, !0, !this.horiz)),
                    a = y(o, this.translate(e, !0, !this.horiz)),
                    s = n && (a - r) / n;
                return s > .7 && s < 1.3 && (o ? r = a - n : a = r + n), x(r) || (r = a = void 0), {
                    min: r,
                    max: a
                }
            }, o.prototype.minFromRange = function() {
                var t, e, i, o = this.range,
                    n = {
                        month: "Month",
                        year: "FullYear"
                    }[o.type],
                    r = this.max,
                    a = function(t, e) {
                        var i = new Date(t),
                            o = i["get" + n]();
                        return i["set" + n](o + e), o === i["get" + n]() && i.setDate(0), i.getTime() - t
                    };
                return x(o) ? (t = r - o, i = o) : (t = r + a(r, -o.count), this.chart && (this.chart.fixedRange = r - t)), e = y(this.dataMin, Number.MIN_VALUE), x(t) || (t = e), t <= e && (t = e, void 0 === i && (i = a(t, o.count)), this.newMax = Math.min(t + i, this.dataMax)), x(r) || (t = void 0), t
            }, w(n.prototype, "init", function(t, o, n) {
                i(this, "init", function() {
                    this.options.rangeSelector.enabled && (this.rangeSelector = new e(this))
                }), t.call(this, o, n)
            }), n.prototype.callbacks.push(function(t) {
                function e() {
                    o = t.xAxis[0].getExtremes(), x(o.min) && a.render(o.min, o.max)
                }
                var o, n, r, a = t.rangeSelector;
                a && (r = i(t.xAxis[0], "afterSetExtremes", function(t) {
                    a.render(t.min, t.max)
                }), n = i(t, "redraw", e), e()), i(t, "destroy", function() {
                    a && (n(), r())
                })
            }), t.RangeSelector = e
        }(e),
        function(t) {
            var e = t.addEvent,
                i = t.Chart,
                o = t.isNumber;
            i.prototype.callbacks.push(function(t) {
                function i() {
                    n = t.xAxis[0].getExtremes(), o(n.min) && l.render(n.min, n.max)
                }
                var n, r, a, s = t.scroller,
                    l = t.rangeSelector;
                s && (n = t.xAxis[0].getExtremes(), s.render(n.min, n.max)), l && (a = e(t.xAxis[0], "afterSetExtremes", function(t) {
                    l.render(t.min, t.max)
                }), r = e(t, "redraw", i), i()), e(t, "destroy", function() {
                    l && (r(), a())
                })
            })
        }(e),
        function(t) {
            var e = t.arrayMax,
                i = t.arrayMin,
                o = t.Axis,
                n = t.Chart,
                r = t.defined,
                a = t.each,
                s = t.extend,
                l = t.format,
                h = t.grep,
                c = t.inArray,
                d = t.isNumber,
                p = t.isString,
                u = t.map,
                g = t.merge,
                f = t.pick,
                m = t.Point,
                x = t.Renderer,
                v = t.Series,
                y = t.splat,
                b = t.SVGRenderer,
                M = t.VMLRenderer,
                w = t.wrap,
                k = v.prototype,
                S = k.init,
                A = k.processData,
                C = m.prototype.tooltipFormatter;
            t.StockChart = t.stockChart = function(e, i, o) {
                var r, a = p(e) || e.nodeName,
                    s = arguments[a ? 1 : 0],
                    l = s.series,
                    h = t.getOptions(),
                    c = f(s.navigator && s.navigator.enabled, h.navigator.enabled, !0),
                    d = c ? {
                        startOnTick: !1,
                        endOnTick: !1
                    } : null,
                    m = {
                        marker: {
                            enabled: !1,
                            radius: 2
                        }
                    },
                    x = {
                        shadow: !1,
                        borderWidth: 0
                    };
                return s.xAxis = u(y(s.xAxis || {}), function(t) {
                    return g({
                        minPadding: 0,
                        maxPadding: 0,
                        ordinal: !0,
                        title: {
                            text: null
                        },
                        labels: {
                            overflow: "justify"
                        },
                        showLastLabel: !0
                    }, h.xAxis, t, {
                        type: "datetime",
                        categories: null
                    }, d)
                }), s.yAxis = u(y(s.yAxis || {}), function(t) {
                    return r = f(t.opposite, !0), g({
                        labels: {
                            y: -2
                        },
                        opposite: r,
                        showLastLabel: !1,
                        title: {
                            text: null
                        }
                    }, h.yAxis, t)
                }), s.series = null, s = g({
                    chart: {
                        panning: !0,
                        pinchType: "x"
                    },
                    navigator: {
                        enabled: c
                    },
                    scrollbar: {
                        enabled: f(h.scrollbar.enabled, !0)
                    },
                    rangeSelector: {
                        enabled: f(h.rangeSelector.enabled, !0)
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        shared: !0,
                        crosshairs: !0
                    },
                    legend: {
                        enabled: !1
                    },
                    plotOptions: {
                        line: m,
                        spline: m,
                        area: m,
                        areaspline: m,
                        arearange: m,
                        areasplinerange: m,
                        column: x,
                        columnrange: x,
                        candlestick: x,
                        ohlc: x
                    }
                }, s, {
                    isStock: !0
                }), s.series = l, a ? new n(e, s, o) : new n(s, i)
            }, w(o.prototype, "autoLabelAlign", function(t) {
                var e, i = this.chart,
                    o = this.options,
                    n = i._labelPanes = i._labelPanes || {},
                    r = this.options.labels;
                return this.chart.options.isStock && "yAxis" === this.coll && (e = o.top + "," + o.height, !n[e] && r.enabled) ? (15 === r.x && (r.x = 0), void 0 === r.align && (r.align = "right"), n[e] = this, "right") : t.call(this, [].slice.call(arguments, 1))
            }), w(o.prototype, "destroy", function(t) {
                var e = this.chart,
                    i = this.options && this.options.top + "," + this.options.height;
                return i && e._labelPanes && e._labelPanes[i] === this && delete e._labelPanes[i], t.call(this, Array.prototype.slice.call(arguments, 1))
            }), w(o.prototype, "getPlotLinePath", function(e, i, o, n, s, l) {
                var h, g, m, x, v, y, b, M = this,
                    w = this.isLinked && !this.series ? this.linkedParent.series : this.series,
                    k = M.chart,
                    S = k.renderer,
                    A = M.left,
                    C = M.top,
                    T = [],
                    P = [];
                return "xAxis" !== M.coll && "yAxis" !== M.coll ? e.apply(this, [].slice.call(arguments, 1)) : (P = function(t) {
                    var e = "xAxis" === t ? "yAxis" : "xAxis",
                        i = M.options[e];
                    return d(i) ? [k[e][i]] : p(i) ? [k.get(i)] : u(w, function(t) {
                        return t[e]
                    })
                }(M.coll), v = M.isXAxis ? k.yAxis : k.xAxis, a(v, function(t) {
                    if (!r(t.options.id) || -1 === t.options.id.indexOf("navigator")) {
                        var e = t.isXAxis ? "yAxis" : "xAxis",
                            i = r(t.options[e]) ? k[e][t.options[e]] : k[e][0];
                        M === i && P.push(t)
                    }
                }), y = P.length ? [] : [M.isXAxis ? k.yAxis[0] : k.xAxis[0]], a(P, function(e) {
                    -1 !== c(e, y) || t.find(y, function(t) {
                        return t.pos === e.pos && t.len && e.len
                    }) || y.push(e)
                }), b = f(l, M.translate(i, null, null, n)), d(b) && (M.horiz ? a(y, function(t) {
                    var e;
                    g = t.pos, x = g + t.len, ((h = m = Math.round(b + M.transB)) < A || h > A + M.width) && (s ? h = m = Math.min(Math.max(A, h), A + M.width) : e = !0), e || T.push("M", h, g, "L", m, x)
                }) : a(y, function(t) {
                    var e;
                    h = t.pos, m = h + t.len, ((g = x = Math.round(C + M.height - b)) < C || g > C + M.height) && (s ? g = x = Math.min(Math.max(C, g), M.top + M.height) : e = !0), e || T.push("M", h, g, "L", m, x)
                })), T.length > 0 ? S.crispPolyLine(T, o || 1) : null)
            }), o.prototype.getPlotBandPath = function(t, e) {
                var i, o = this.getPlotLinePath(e, null, null, !0),
                    n = this.getPlotLinePath(t, null, null, !0),
                    r = [];
                if (n && o)
                    if (n.toString() === o.toString())(r = n).flat = !0;
                    else
                        for (i = 0; i < n.length; i += 6) r.push("M", n[i + 1], n[i + 2], "L", n[i + 4], n[i + 5], o[i + 4], o[i + 5], o[i + 1], o[i + 2], "z");
                else r = null;
                return r
            }, b.prototype.crispPolyLine = function(t, e) {
                var i;
                for (i = 0; i < t.length; i += 6) t[i + 1] === t[i + 4] && (t[i + 1] = t[i + 4] = Math.round(t[i + 1]) - e % 2 / 2), t[i + 2] === t[i + 5] && (t[i + 2] = t[i + 5] = Math.round(t[i + 2]) + e % 2 / 2);
                return t
            }, x === M && (M.prototype.crispPolyLine = b.prototype.crispPolyLine), w(o.prototype, "hideCrosshair", function(t, e) {
                t.call(this, e), this.crossLabel && (this.crossLabel = this.crossLabel.hide())
            }), w(o.prototype, "drawCrosshair", function(t, e, i) {
                if (t.call(this, e, i), r(this.crosshair.label) && this.crosshair.label.enabled && this.cross) {
                    var o, n, a, h, c, d, p = this.chart,
                        u = this.options.crosshair.label,
                        g = this.horiz,
                        m = this.opposite,
                        x = this.left,
                        v = this.top,
                        y = this.crossLabel,
                        b = u.format,
                        M = "",
                        w = "inside" === this.options.tickPosition,
                        k = !1 !== this.crosshair.snap,
                        S = 0;
                    e || (e = this.cross && this.cross.e), c = g ? "center" : m ? "right" === this.labelAlign ? "right" : "left" : "left" === this.labelAlign ? "left" : "center", y || (y = this.crossLabel = p.renderer.label(null, null, null, u.shape || "callout").addClass("highcharts-crosshair-label" + (this.series[0] && " highcharts-color-" + this.series[0].colorIndex)).attr({
                        align: u.align || c,
                        padding: f(u.padding, 8),
                        r: f(u.borderRadius, 3),
                        zIndex: 2
                    }).add(this.labelGroup)).attr({
                        fill: u.backgroundColor || this.series[0] && this.series[0].color || "#666666",
                        stroke: u.borderColor || "",
                        "stroke-width": u.borderWidth || 0
                    }).css(s({
                        color: "#ffffff",
                        fontWeight: "normal",
                        fontSize: "11px",
                        textAlign: "center"
                    }, u.style)), g ? (o = k ? i.plotX + x : e.chartX, n = v + (m ? 0 : this.height)) : (o = m ? this.width + x : 0, n = k ? i.plotY + v : e.chartY), b || u.formatter || (this.isDatetimeAxis && (M = "%b %d, %Y"), b = "{value" + (M ? ":" + M : "") + "}"), d = k ? i[this.isXAxis ? "x" : "y"] : this.toValue(g ? e.chartX : e.chartY), y.attr({
                        text: b ? l(b, {
                            value: d
                        }) : u.formatter.call(this, d),
                        x: o,
                        y: n,
                        visibility: "visible"
                    }), a = y.getBBox(), g ? (w && !m || !w && m) && (n = y.y - a.height) : n = y.y - a.height / 2, h = g ? {
                        left: x - a.x,
                        right: x + this.width - a.x
                    } : {
                        left: "left" === this.labelAlign ? x : 0,
                        right: "right" === this.labelAlign ? x + this.width : p.chartWidth
                    }, y.translateX < h.left && (S = h.left - y.translateX), y.translateX + a.width >= h.right && (S = -(y.translateX + a.width - h.right)), y.attr({
                        x: o + S,
                        y: n,
                        anchorX: g ? o : this.opposite ? 0 : p.chartWidth,
                        anchorY: g ? this.opposite ? p.chartHeight : 0 : n + a.height / 2
                    })
                }
            }), k.init = function() {
                S.apply(this, arguments), this.setCompare(this.options.compare)
            }, k.setCompare = function(t) {
                this.modifyValue = "value" === t || "percent" === t ? function(e, i) {
                    var o = this.compareValue;
                    if (void 0 !== e && void 0 !== o) return "value" === t ? e -= o : e = e / o * 100 - (100 === this.options.compareBase ? 0 : 100), i && (i.change = e), e
                } : null, this.userOptions.compare = t, this.chart.hasRendered && (this.isDirty = !0)
            }, k.processData = function() {
                var t, e, i, o, n, r = this,
                    a = -1;
                if (A.apply(this, arguments), r.xAxis && r.processedYData)
                    for (e = r.processedXData, o = (i = r.processedYData).length, r.pointArrayMap && -1 === (a = c("close", r.pointArrayMap)) && (a = c(r.pointValKey || "y", r.pointArrayMap)), t = 0; t < o - 1; t++)
                        if (n = i[t] && a > -1 ? i[t][a] : i[t], d(n) && e[t + 1] >= r.xAxis.min && 0 !== n) {
                            r.compareValue = n;
                            break
                        }
            }, w(k, "getExtremes", function(t) {
                var o;
                t.apply(this, [].slice.call(arguments, 1)), this.modifyValue && (o = [this.modifyValue(this.dataMin), this.modifyValue(this.dataMax)], this.dataMin = i(o), this.dataMax = e(o))
            }), o.prototype.setCompare = function(t, e) {
                this.isXAxis || (a(this.series, function(e) {
                    e.setCompare(t)
                }), f(e, !0) && this.chart.redraw())
            }, m.prototype.tooltipFormatter = function(e) {
                var i = this;
                return e = e.replace("{point.change}", (i.change > 0 ? "+" : "") + t.numberFormat(i.change, f(i.series.tooltipOptions.changeDecimals, 2))), C.apply(this, [e])
            }, w(v.prototype, "render", function(t) {
                this.chart.is3d && this.chart.is3d() || this.chart.polar || !this.xAxis || this.xAxis.isRadial || (!this.clipBox && this.animate ? (this.clipBox = g(this.chart.clipBox), this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len) : this.chart[this.sharedClipKey] ? this.chart[this.sharedClipKey].attr({
                    width: this.xAxis.len,
                    height: this.yAxis.len
                }) : this.clipBox && (this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len)), t.call(this)
            }), w(n.prototype, "getSelectedPoints", function(t) {
                var e = t.call(this);
                return a(this.series, function(t) {
                    t.hasGroupedData && (e = e.concat(h(t.points || [], function(t) {
                        return t.selected
                    })))
                }), e
            }), w(n.prototype, "update", function(t, e) {
                return "scrollbar" in e && this.navigator && (g(!0, this.options.scrollbar, e.scrollbar), this.navigator.update({}, !1), delete e.scrollbar), t.apply(this, Array.prototype.slice.call(arguments, 1))
            })
        }(e),
        function(t) {
            function e(t, e) {
                this.init(t, e)
            }
            var i = t.CenteredSeriesMixin,
                o = t.each,
                n = t.extend,
                r = t.merge,
                a = t.splat;
            n(e.prototype, {
                coll: "pane",
                init: function(t, e) {
                    this.chart = e, this.background = [], e.pane.push(this), this.setOptions(t)
                },
                setOptions: function(t) {
                    this.options = t = r(this.defaultOptions, this.chart.angular ? {
                        background: {}
                    } : void 0, t)
                },
                render: function() {
                    var t, e, i = this.options,
                        o = this.options.background,
                        n = this.chart.renderer;
                    if (this.group || (this.group = n.g("pane-group").attr({
                            zIndex: i.zIndex || 0
                        }).add()), this.updateCenter(), o)
                        for (o = a(o), t = Math.max(o.length, this.background.length || 0), e = 0; e < t; e++) o[e] && this.axis ? this.renderBackground(r(this.defaultBackgroundOptions, o[e]), e) : this.background[e] && (this.background[e] = this.background[e].destroy(), this.background.splice(e, 1))
                },
                renderBackground: function(t, e) {
                    var i = "animate";
                    this.background[e] || (this.background[e] = this.chart.renderer.path().add(this.group), i = "attr"), this.background[e][i]({
                        d: this.axis.getPlotBandPath(t.from, t.to, t)
                    }).attr({
                        fill: t.backgroundColor,
                        stroke: t.borderColor,
                        "stroke-width": t.borderWidth,
                        class: "highcharts-pane " + (t.className || "")
                    })
                },
                defaultOptions: {
                    center: ["50%", "50%"],
                    size: "85%",
                    startAngle: 0
                },
                defaultBackgroundOptions: {
                    shape: "circle",
                    borderWidth: 1,
                    borderColor: "#cccccc",
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, "#ffffff"],
                            [1, "#e6e6e6"]
                        ]
                    },
                    from: -Number.MAX_VALUE,
                    innerRadius: 0,
                    to: Number.MAX_VALUE,
                    outerRadius: "105%"
                },
                updateCenter: function(t) {
                    this.center = (t || this.axis || {}).center = i.getCenter.call(this)
                },
                update: function(t, e) {
                    r(!0, this.options, t), this.setOptions(this.options), this.render(), o(this.chart.axes, function(t) {
                        t.pane === this && (t.pane = null, t.update({}, e))
                    }, this)
                }
            }), t.Pane = e
        }(e),
        function(t) {
            var e, i, o = t.Axis,
                n = t.each,
                r = t.extend,
                a = t.map,
                s = t.merge,
                l = t.noop,
                h = t.pick,
                c = t.pInt,
                d = t.Tick,
                p = t.wrap,
                u = o.prototype,
                g = d.prototype;
            e = {
                getOffset: l,
                redraw: function() {
                    this.isDirty = !1
                },
                render: function() {
                    this.isDirty = !1
                },
                setScale: l,
                setCategories: l,
                setTitle: l
            }, i = {
                defaultRadialGaugeOptions: {
                    labels: {
                        align: "center",
                        x: 0,
                        y: null
                    },
                    minorGridLineWidth: 0,
                    minorTickInterval: "auto",
                    minorTickLength: 10,
                    minorTickPosition: "inside",
                    minorTickWidth: 1,
                    tickLength: 10,
                    tickPosition: "inside",
                    tickWidth: 2,
                    title: {
                        rotation: 0
                    },
                    zIndex: 2
                },
                defaultRadialXOptions: {
                    gridLineWidth: 1,
                    labels: {
                        align: null,
                        distance: 15,
                        x: 0,
                        y: null
                    },
                    maxPadding: 0,
                    minPadding: 0,
                    showLastLabel: !1,
                    tickLength: 0
                },
                defaultRadialYOptions: {
                    gridLineInterpolation: "circle",
                    labels: {
                        align: "right",
                        x: -3,
                        y: -2
                    },
                    showLastLabel: !1,
                    title: {
                        x: 4,
                        text: null,
                        rotation: 90
                    }
                },
                setOptions: function(t) {
                    var e = this.options = s(this.defaultOptions, this.defaultRadialOptions, t);
                    e.plotBands || (e.plotBands = [])
                },
                getOffset: function() {
                    u.getOffset.call(this), this.chart.axisOffset[this.side] = 0
                },
                getLinePath: function(t, e) {
                    var i, o, n = this.center,
                        r = this.chart,
                        a = h(e, n[2] / 2 - this.offset);
                    return this.isCircular || void 0 !== e ? o = this.chart.renderer.symbols.arc(this.left + n[0], this.top + n[1], a, a, {
                        start: this.startAngleRad,
                        end: this.endAngleRad,
                        open: !0,
                        innerR: 0
                    }) : (i = this.postTranslate(this.angleRad, a), o = ["M", n[0] + r.plotLeft, n[1] + r.plotTop, "L", i.x, i.y]), o
                },
                setAxisTranslation: function() {
                    u.setAxisTranslation.call(this), this.center && (this.isCircular ? this.transA = (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.transA = this.center[2] / 2 / (this.max - this.min || 1), this.isXAxis ? this.minPixelPadding = this.transA * this.minPointOffset : this.minPixelPadding = 0)
                },
                beforeSetTickPositions: function() {
                    this.autoConnect = this.isCircular && void 0 === h(this.userMax, this.options.max) && this.endAngleRad - this.startAngleRad == 2 * Math.PI, this.autoConnect && (this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0)
                },
                setAxisSize: function() {
                    u.setAxisSize.call(this), this.isRadial && (this.pane.updateCenter(this), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * h(this.sector, 1) / 2)
                },
                getPosition: function(t, e) {
                    return this.postTranslate(this.isCircular ? this.translate(t) : this.angleRad, h(this.isCircular ? e : this.translate(t), this.center[2] / 2) - this.offset)
                },
                postTranslate: function(t, e) {
                    var i = this.chart,
                        o = this.center;
                    return t = this.startAngleRad + t, {
                        x: i.plotLeft + o[0] + Math.cos(t) * e,
                        y: i.plotTop + o[1] + Math.sin(t) * e
                    }
                },
                getPlotBandPath: function(t, e, i) {
                    var o, n, r, s, l = this.center,
                        d = this.startAngleRad,
                        p = l[2] / 2,
                        u = [h(i.outerRadius, "100%"), i.innerRadius, h(i.thickness, 10)],
                        g = Math.min(this.offset, 0),
                        f = /%$/,
                        m = this.isCircular;
                    return "polygon" === this.options.gridLineInterpolation ? s = this.getPlotLinePath(t).concat(this.getPlotLinePath(e, !0)) : (t = Math.max(t, this.min), e = Math.min(e, this.max), m || (u[0] = this.translate(t), u[1] = this.translate(e)), u = a(u, function(t) {
                        return f.test(t) && (t = c(t, 10) * p / 100), t
                    }), "circle" !== i.shape && m ? (o = d + this.translate(t), n = d + this.translate(e)) : (o = -Math.PI / 2, n = 1.5 * Math.PI, r = !0), u[0] -= g, u[2] -= g, s = this.chart.renderer.symbols.arc(this.left + l[0], this.top + l[1], u[0], u[0], {
                        start: Math.min(o, n),
                        end: Math.max(o, n),
                        innerR: h(u[1], u[0] - u[2]),
                        open: r
                    })), s
                },
                getPlotLinePath: function(t, e) {
                    var i, o, r, a, s = this,
                        l = s.center,
                        h = s.chart,
                        c = s.getPosition(t);
                    return s.isCircular ? a = ["M", l[0] + h.plotLeft, l[1] + h.plotTop, "L", c.x, c.y] : "circle" === s.options.gridLineInterpolation ? (t = s.translate(t)) && (a = s.getLinePath(0, t)) : (n(h.xAxis, function(t) {
                        t.pane === s.pane && (i = t)
                    }), a = [], t = s.translate(t), r = i.tickPositions, i.autoConnect && (r = r.concat([r[0]])), e && (r = [].concat(r).reverse()), n(r, function(e, n) {
                        o = i.getPosition(e, t), a.push(n ? "L" : "M", o.x, o.y)
                    })), a
                },
                getTitlePosition: function() {
                    var t = this.center,
                        e = this.chart,
                        i = this.options.title;
                    return {
                        x: e.plotLeft + t[0] + (i.x || 0),
                        y: e.plotTop + t[1] - {
                            high: .5,
                            middle: .25,
                            low: 0
                        }[i.align] * t[2] + (i.y || 0)
                    }
                }
            }, p(u, "init", function(t, o, n) {
                var a, l, c = o.angular,
                    d = o.polar,
                    p = n.isX,
                    u = c && p,
                    g = o.options,
                    f = n.pane || 0,
                    m = this.pane = o.pane[f],
                    x = m.options;
                c ? (r(this, u ? e : i), (a = !p) && (this.defaultRadialOptions = this.defaultRadialGaugeOptions)) : d && (r(this, i), a = p, this.defaultRadialOptions = p ? this.defaultRadialXOptions : s(this.defaultYAxisOptions, this.defaultRadialYOptions)), c || d ? (this.isRadial = !0, o.inverted = !1, g.chart.zoomType = null) : this.isRadial = !1, a && (m.axis = this), t.call(this, o, n), u || !c && !d || (l = this.options, this.angleRad = (l.angle || 0) * Math.PI / 180, this.startAngleRad = (x.startAngle - 90) * Math.PI / 180, this.endAngleRad = (h(x.endAngle, x.startAngle + 360) - 90) * Math.PI / 180, this.offset = l.offset || 0, this.isCircular = a)
            }), p(u, "autoLabelAlign", function(t) {
                if (!this.isRadial) return t.apply(this, [].slice.call(arguments, 1))
            }), p(g, "getPosition", function(t, e, i, o, n) {
                var r = this.axis;
                return r.getPosition ? r.getPosition(i) : t.call(this, e, i, o, n)
            }), p(g, "getLabelPosition", function(t, e, i, o, n, r, a, s, l) {
                var c, d = this.axis,
                    p = r.y,
                    u = 20,
                    g = r.align,
                    f = (d.translate(this.pos) + d.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
                return d.isRadial ? (c = d.getPosition(this.pos, d.center[2] / 2 + h(r.distance, -25)), "auto" === r.rotation ? o.attr({
                    rotation: f
                }) : null === p && (p = d.chart.renderer.fontMetrics(o.styles.fontSize).b - o.getBBox().height / 2), null === g && (d.isCircular ? (this.label.getBBox().width > d.len * d.tickInterval / (d.max - d.min) && (u = 0), g = f > u && f < 180 - u ? "left" : f > 180 + u && f < 360 - u ? "right" : "center") : g = "center", o.attr({
                    align: g
                })), c.x += r.x, c.y += p) : c = t.call(this, e, i, o, n, r, a, s, l), c
            }), p(g, "getMarkPath", function(t, e, i, o, n, r, a) {
                var s, l = this.axis;
                return l.isRadial ? ["M", e, i, "L", (s = l.getPosition(this.pos, l.center[2] / 2 + o)).x, s.y] : t.call(this, e, i, o, n, r, a)
            })
        }(e),
        function(t) {
            var e = t.each,
                i = t.noop,
                o = t.pick,
                n = t.Series,
                r = t.seriesType,
                a = t.seriesTypes;
            r("arearange", "area", {
                lineWidth: 1,
                marker: null,
                threshold: null,
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">â—</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
                },
                trackByArea: !0,
                dataLabels: {
                    align: null,
                    verticalAlign: null,
                    xLow: 0,
                    xHigh: 0,
                    yLow: 0,
                    yHigh: 0
                },
                states: {
                    hover: {
                        halo: !1
                    }
                }
            }, {
                pointArrayMap: ["low", "high"],
                dataLabelCollections: ["dataLabel", "dataLabelUpper"],
                toYData: function(t) {
                    return [t.low, t.high]
                },
                pointValKey: "low",
                deferTranslatePolar: !0,
                highToXY: function(t) {
                    var e = this.chart,
                        i = this.xAxis.postTranslate(t.rectPlotX, this.yAxis.len - t.plotHigh);
                    t.plotHighX = i.x - e.plotLeft, t.plotHigh = i.y - e.plotTop
                },
                translate: function() {
                    var t = this,
                        i = t.yAxis,
                        o = !!t.modifyValue;
                    a.area.prototype.translate.apply(t), e(t.points, function(e) {
                        var n = e.low,
                            r = e.high,
                            a = e.plotY;
                        null === r || null === n ? e.isNull = !0 : (e.plotLow = a, e.plotHigh = i.translate(o ? t.modifyValue(r, e) : r, 0, 1, 0, 1), o && (e.yBottom = e.plotHigh))
                    }), this.chart.polar && e(this.points, function(e) {
                        t.highToXY(e)
                    })
                },
                getGraphPath: function(t) {
                    var e, i, n, r, s, l, h, c = [],
                        d = [],
                        p = a.area.prototype.getGraphPath,
                        u = this.options,
                        g = this.chart.polar && !1 !== u.connectEnds,
                        f = u.connectNulls,
                        m = u.step;
                    for (e = (t = t || this.points).length, e = t.length; e--;)(i = t[e]).isNull || g || f || t[e + 1] && !t[e + 1].isNull || d.push({
                        plotX: i.plotX,
                        plotY: i.plotY,
                        doCurve: !1
                    }), n = {
                        polarPlotY: i.polarPlotY,
                        rectPlotX: i.rectPlotX,
                        yBottom: i.yBottom,
                        plotX: o(i.plotHighX, i.plotX),
                        plotY: i.plotHigh,
                        isNull: i.isNull
                    }, d.push(n), c.push(n), i.isNull || g || f || t[e - 1] && !t[e - 1].isNull || d.push({
                        plotX: i.plotX,
                        plotY: i.plotY,
                        doCurve: !1
                    });
                    return s = p.call(this, t), m && (!0 === m && (m = "left"), u.step = {
                        left: "right",
                        center: "center",
                        right: "left"
                    }[m]), l = p.call(this, c), h = p.call(this, d), u.step = m, r = [].concat(s, l), this.chart.polar || "M" !== h[0] || (h[0] = "L"), this.graphPath = r, this.areaPath = this.areaPath.concat(s, h), r.isArea = !0, r.xMap = s.xMap, this.areaPath.xMap = s.xMap, r
                },
                drawDataLabels: function() {
                    var t, e, i, o = this.data,
                        r = o.length,
                        a = [],
                        s = n.prototype,
                        l = this.options.dataLabels,
                        h = l.align,
                        c = l.verticalAlign,
                        d = l.inside,
                        p = this.chart.inverted;
                    if (l.enabled || this._hasPointLabels) {
                        for (t = r; t--;)(e = o[t]) && (i = d ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.y = e.high, e._plotY = e.plotY, e.plotY = e.plotHigh, a[t] = e.dataLabel, e.dataLabel = e.dataLabelUpper, e.below = i, p ? h || (l.align = i ? "right" : "left") : c || (l.verticalAlign = i ? "top" : "bottom"), l.x = l.xHigh, l.y = l.yHigh);
                        for (s.drawDataLabels && s.drawDataLabels.apply(this, arguments), t = r; t--;)(e = o[t]) && (i = d ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.dataLabelUpper = e.dataLabel, e.dataLabel = a[t], e.y = e.low, e.plotY = e._plotY, e.below = !i, p ? h || (l.align = i ? "left" : "right") : c || (l.verticalAlign = i ? "bottom" : "top"), l.x = l.xLow, l.y = l.yLow);
                        s.drawDataLabels && s.drawDataLabels.apply(this, arguments)
                    }
                    l.align = h, l.verticalAlign = c
                },
                alignDataLabel: function() {
                    a.column.prototype.alignDataLabel.apply(this, arguments)
                },
                setStackedPoints: i,
                getSymbol: i,
                drawPoints: i
            })
        }(e),
        function(t) {
            (0, t.seriesType)("areasplinerange", "arearange", null, {
                getPointSpline: t.seriesTypes.spline.prototype.getPointSpline
            })
        }(e),
        function(t) {
            var e = t.defaultPlotOptions,
                i = t.each,
                o = t.merge,
                n = t.noop,
                r = t.pick,
                a = t.seriesType,
                s = t.seriesTypes.column.prototype;
            a("columnrange", "arearange", o(e.column, e.arearange, {
                lineWidth: 1,
                pointRange: null
            }), {
                translate: function() {
                    var t, e, o = this,
                        n = o.yAxis,
                        a = o.xAxis,
                        l = a.startAngleRad,
                        h = o.chart,
                        c = o.xAxis.isRadial;
                    s.translate.apply(o), i(o.points, function(i) {
                        var s, d, p, u = i.shapeArgs,
                            g = o.options.minPointLength;
                        i.plotHigh = e = n.translate(i.high, 0, 1, 0, 1), i.plotLow = i.plotY, p = e, d = r(i.rectPlotY, i.plotY) - e, Math.abs(d) < g ? (d += s = g - d, p -= s / 2) : d < 0 && (p -= d *= -1), c ? (t = i.barX + l, i.shapeType = "path", i.shapeArgs = {
                            d: o.polarArc(p + d, p, t, t + i.pointWidth)
                        }) : (u.height = d, u.y = p, i.tooltipPos = h.inverted ? [n.len + n.pos - h.plotLeft - p - d / 2, a.len + a.pos - h.plotTop - u.x - u.width / 2, d] : [a.left - h.plotLeft + u.x + u.width / 2, n.pos - h.plotTop + p + d / 2, d])
                    })
                },
                directTouch: !0,
                trackerGroups: ["group", "dataLabelsGroup"],
                drawGraph: n,
                crispCol: s.crispCol,
                drawPoints: s.drawPoints,
                drawTracker: s.drawTracker,
                getColumnMetrics: s.getColumnMetrics,
                animate: function() {
                    return s.animate.apply(this, arguments)
                },
                polarArc: function() {
                    return s.polarArc.apply(this, arguments)
                },
                pointAttribs: s.pointAttribs
            })
        }(e),
        function(t) {
            var e = t.each,
                i = t.isNumber,
                o = t.merge,
                n = t.noop,
                r = t.pick,
                a = t.pInt,
                s = t.Series,
                l = t.seriesType,
                h = t.TrackerMixin;
            l("gauge", "line", {
                dataLabels: {
                    enabled: !0,
                    defer: !1,
                    y: 15,
                    borderRadius: 3,
                    crop: !1,
                    verticalAlign: "top",
                    zIndex: 2,
                    borderWidth: 1,
                    borderColor: "#cccccc"
                },
                dial: {},
                pivot: {},
                tooltip: {
                    headerFormat: ""
                },
                showInLegend: !1
            }, {
                angular: !0,
                directTouch: !0,
                drawGraph: n,
                fixedBox: !0,
                forceDL: !0,
                noSharedTooltip: !0,
                trackerGroups: ["group", "dataLabelsGroup"],
                translate: function() {
                    var t = this,
                        n = t.yAxis,
                        s = t.options,
                        l = n.center;
                    t.generatePoints(), e(t.points, function(t) {
                        var e = o(s.dial, t.dial),
                            h = a(r(e.radius, 80)) * l[2] / 200,
                            c = a(r(e.baseLength, 70)) * h / 100,
                            d = a(r(e.rearLength, 10)) * h / 100,
                            p = e.baseWidth || 3,
                            u = e.topWidth || 1,
                            g = s.overshoot,
                            f = n.startAngleRad + n.translate(t.y, null, null, null, !0);
                        i(g) ? (g = g / 180 * Math.PI, f = Math.max(n.startAngleRad - g, Math.min(n.endAngleRad + g, f))) : !1 === s.wrap && (f = Math.max(n.startAngleRad, Math.min(n.endAngleRad, f))), f = 180 * f / Math.PI, t.shapeType = "path", t.shapeArgs = {
                            d: e.path || ["M", -d, -p / 2, "L", c, -p / 2, h, -u / 2, h, u / 2, c, p / 2, -d, p / 2, "z"],
                            translateX: l[0],
                            translateY: l[1],
                            rotation: f
                        }, t.plotX = l[0], t.plotY = l[1]
                    })
                },
                drawPoints: function() {
                    var t = this,
                        i = t.yAxis.center,
                        n = t.pivot,
                        a = t.options,
                        s = a.pivot,
                        l = t.chart.renderer;
                    e(t.points, function(e) {
                        var i = e.graphic,
                            n = e.shapeArgs,
                            r = n.d,
                            s = o(a.dial, e.dial);
                        i ? (i.animate(n), n.d = r) : (e.graphic = l[e.shapeType](n).attr({
                            rotation: n.rotation,
                            zIndex: 1
                        }).addClass("highcharts-dial").add(t.group), e.graphic.attr({
                            stroke: s.borderColor || "none",
                            "stroke-width": s.borderWidth || 0,
                            fill: s.backgroundColor || "#000000"
                        }))
                    }), n ? n.animate({
                        translateX: i[0],
                        translateY: i[1]
                    }) : (t.pivot = l.circle(0, 0, r(s.radius, 5)).attr({
                        zIndex: 2
                    }).addClass("highcharts-pivot").translate(i[0], i[1]).add(t.group), t.pivot.attr({
                        "stroke-width": s.borderWidth || 0,
                        stroke: s.borderColor || "#cccccc",
                        fill: s.backgroundColor || "#000000"
                    }))
                },
                animate: function(t) {
                    var i = this;
                    t || (e(i.points, function(t) {
                        var e = t.graphic;
                        e && (e.attr({
                            rotation: 180 * i.yAxis.startAngleRad / Math.PI
                        }), e.animate({
                            rotation: t.shapeArgs.rotation
                        }, i.options.animation))
                    }), i.animate = null)
                },
                render: function() {
                    this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup), s.prototype.render.call(this), this.group.clip(this.chart.clipRect)
                },
                setData: function(t, e) {
                    s.prototype.setData.call(this, t, !1), this.processData(), this.generatePoints(), r(e, !0) && this.chart.redraw()
                },
                drawTracker: h && h.drawTrackerPoint
            }, {
                setState: function(t) {
                    this.state = t
                }
            })
        }(e),
        function(t) {
            var e = t.each,
                i = t.noop,
                o = t.pick,
                n = t.seriesType,
                r = t.seriesTypes;
            n("boxplot", "column", {
                threshold: null,
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">â—</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'
                },
                whiskerLength: "50%",
                fillColor: "#ffffff",
                lineWidth: 1,
                medianWidth: 2,
                states: {
                    hover: {
                        brightness: -.3
                    }
                },
                whiskerWidth: 2
            }, {
                pointArrayMap: ["low", "q1", "median", "q3", "high"],
                toYData: function(t) {
                    return [t.low, t.q1, t.median, t.q3, t.high]
                },
                pointValKey: "high",
                pointAttribs: function(t) {
                    var e = this.options,
                        i = t && t.color || this.color;
                    return {
                        fill: t.fillColor || e.fillColor || i,
                        stroke: e.lineColor || i,
                        "stroke-width": e.lineWidth || 0
                    }
                },
                drawDataLabels: i,
                translate: function() {
                    var t = this,
                        i = t.yAxis,
                        o = t.pointArrayMap;
                    r.column.prototype.translate.apply(t), e(t.points, function(t) {
                        e(o, function(e) {
                            null !== t[e] && (t[e + "Plot"] = i.translate(t[e], 0, 1, 0, 1))
                        })
                    })
                },
                drawPoints: function() {
                    var t, i, n, r, a, s, l, h, c, d, p, u = this,
                        g = u.points,
                        f = u.options,
                        m = u.chart.renderer,
                        x = 0,
                        v = !1 !== u.doQuartiles,
                        y = u.options.whiskerLength;
                    e(g, function(e) {
                        var g, b = e.graphic,
                            M = b ? "animate" : "attr",
                            w = e.shapeArgs,
                            k = {},
                            S = {},
                            A = {},
                            C = e.color || u.color;
                        void 0 !== e.plotY && (l = w.width, h = Math.floor(w.x), c = h + l, d = Math.round(l / 2), t = Math.floor(v ? e.q1Plot : e.lowPlot), i = Math.floor(v ? e.q3Plot : e.lowPlot), n = Math.floor(e.highPlot), r = Math.floor(e.lowPlot), b || (e.graphic = b = m.g("point").add(u.group), e.stem = m.path().addClass("highcharts-boxplot-stem").add(b), y && (e.whiskers = m.path().addClass("highcharts-boxplot-whisker").add(b)), v && (e.box = m.path(void 0).addClass("highcharts-boxplot-box").add(b)), e.medianShape = m.path(void 0).addClass("highcharts-boxplot-median").add(b)), k.stroke = e.stemColor || f.stemColor || C, k["stroke-width"] = o(e.stemWidth, f.stemWidth, f.lineWidth), k.dashstyle = e.stemDashStyle || f.stemDashStyle, e.stem.attr(k), y && (S.stroke = e.whiskerColor || f.whiskerColor || C, S["stroke-width"] = o(e.whiskerWidth, f.whiskerWidth, f.lineWidth), e.whiskers.attr(S)), v && (g = u.pointAttribs(e), e.box.attr(g)), A.stroke = e.medianColor || f.medianColor || C, A["stroke-width"] = o(e.medianWidth, f.medianWidth, f.lineWidth), e.medianShape.attr(A), s = e.stem.strokeWidth() % 2 / 2, x = h + d + s, e.stem[M]({
                            d: ["M", x, i, "L", x, n, "M", x, t, "L", x, r]
                        }), v && (s = e.box.strokeWidth() % 2 / 2, t = Math.floor(t) + s, i = Math.floor(i) + s, h += s, c += s, e.box[M]({
                            d: ["M", h, i, "L", h, t, "L", c, t, "L", c, i, "L", h, i, "z"]
                        })), y && (s = e.whiskers.strokeWidth() % 2 / 2, n += s, r += s, p = /%$/.test(y) ? d * parseFloat(y) / 100 : y / 2, e.whiskers[M]({
                            d: ["M", x - p, n, "L", x + p, n, "M", x - p, r, "L", x + p, r]
                        })), a = Math.round(e.medianPlot), s = e.medianShape.strokeWidth() % 2 / 2, a += s, e.medianShape[M]({
                            d: ["M", h, a, "L", c, a]
                        }))
                    })
                },
                setStackedPoints: i
            })
        }(e),
        function(t) {
            var e = t.each,
                i = t.noop,
                o = t.seriesType,
                n = t.seriesTypes;
            o("errorbar", "boxplot", {
                color: "#000000",
                grouping: !1,
                linkedTo: ":previous",
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">â—</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
                },
                whiskerWidth: null
            }, {
                type: "errorbar",
                pointArrayMap: ["low", "high"],
                toYData: function(t) {
                    return [t.low, t.high]
                },
                pointValKey: "high",
                doQuartiles: !1,
                drawDataLabels: n.arearange ? function() {
                    var t = this.pointValKey;
                    n.arearange.prototype.drawDataLabels.call(this), e(this.data, function(e) {
                        e.y = e[t]
                    })
                } : i,
                getColumnMetrics: function() {
                    return this.linkedParent && this.linkedParent.columnMetrics || n.column.prototype.getColumnMetrics.call(this)
                }
            })
        }(e),
        function(t) {
            var e = t.correctFloat,
                i = t.isNumber,
                o = t.pick,
                n = t.Point,
                r = t.Series,
                a = t.seriesType,
                s = t.seriesTypes;
            a("waterfall", "column", {
                dataLabels: {
                    inside: !0
                },
                lineWidth: 1,
                lineColor: "#333333",
                dashStyle: "dot",
                borderColor: "#333333",
                states: {
                    hover: {
                        lineWidthPlus: 0
                    }
                }
            }, {
                pointValKey: "y",
                translate: function() {
                    var t, i, n, r, a, l, h, c, d, p, u, g, f, m = this,
                        x = m.options,
                        v = m.yAxis,
                        y = o(x.minPointLength, 5),
                        b = y / 2,
                        M = x.threshold,
                        w = x.stacking;
                    for (s.column.prototype.translate.apply(m), d = p = M, i = 0, t = (n = m.points).length; i < t; i++) r = n[i], c = m.processedYData[i], a = r.shapeArgs, l = w && v.stacks[(m.negStacks && c < M ? "-" : "") + m.stackKey], g = m.getStackIndicator(g, r.x, m.index), u = l ? l[r.x].points[g.key] : [0, c], r.isSum ? r.y = e(c) : r.isIntermediateSum && (r.y = e(c - p)), h = Math.max(d, d + r.y) + u[0], a.y = v.translate(h, 0, 1, 0, 1), r.isSum ? (a.y = v.translate(u[1], 0, 1, 0, 1), a.height = Math.min(v.translate(u[0], 0, 1, 0, 1), v.len) - a.y) : r.isIntermediateSum ? (a.y = v.translate(u[1], 0, 1, 0, 1), a.height = Math.min(v.translate(p, 0, 1, 0, 1), v.len) - a.y, p = u[1]) : (a.height = c > 0 ? v.translate(d, 0, 1, 0, 1) - a.y : v.translate(d, 0, 1, 0, 1) - v.translate(d - c, 0, 1, 0, 1), d += l && l[r.x] ? l[r.x].total : c), a.height < 0 && (a.y += a.height, a.height *= -1), r.plotY = a.y = Math.round(a.y) - m.borderWidth % 2 / 2, a.height = Math.max(Math.round(a.height), .001), r.yBottom = a.y + a.height, a.height <= y && !r.isNull ? (a.height = y, a.y -= b, r.plotY = a.y, r.y < 0 ? r.minPointLengthOffset = -b : r.minPointLengthOffset = b) : r.minPointLengthOffset = 0, f = r.plotY + (r.negative ? a.height : 0), m.chart.inverted ? r.tooltipPos[0] = v.len - f : r.tooltipPos[1] = f
                },
                processData: function(t) {
                    var i, o, n, a, s, l, h, c = this,
                        d = c.options,
                        p = c.yData,
                        u = c.options.data,
                        g = p.length;
                    for (n = o = a = s = d.threshold || 0, h = 0; h < g; h++) l = p[h], i = u && u[h] ? u[h] : {}, "sum" === l || i.isSum ? p[h] = e(n) : "intermediateSum" === l || i.isIntermediateSum ? p[h] = e(o) : (n += l, o += l), a = Math.min(n, a), s = Math.max(n, s);
                    r.prototype.processData.call(this, t), c.options.stacking || (c.dataMin = a, c.dataMax = s)
                },
                toYData: function(t) {
                    return t.isSum ? 0 === t.x ? null : "sum" : t.isIntermediateSum ? 0 === t.x ? null : "intermediateSum" : t.y
                },
                pointAttribs: function(t, e) {
                    var i, o = this.options.upColor;
                    return o && !t.options.color && (t.color = t.y > 0 ? o : null), i = s.column.prototype.pointAttribs.call(this, t, e), delete i.dashstyle, i
                },
                getGraphPath: function() {
                    return ["M", 0, 0]
                },
                getCrispPath: function() {
                    var t, e, i, o, n = this.data,
                        r = n.length,
                        a = this.graph.strokeWidth() + this.borderWidth,
                        s = Math.round(a) % 2 / 2,
                        l = this.yAxis.reversed,
                        h = [];
                    for (i = 1; i < r; i++) e = n[i].shapeArgs, o = ["M", (t = n[i - 1].shapeArgs).x + t.width, t.y + n[i - 1].minPointLengthOffset + s, "L", e.x, t.y + n[i - 1].minPointLengthOffset + s], (n[i - 1].y < 0 && !l || n[i - 1].y > 0 && l) && (o[2] += t.height, o[5] += t.height), h = h.concat(o);
                    return h
                },
                drawGraph: function() {
                    r.prototype.drawGraph.call(this), this.graph.attr({
                        d: this.getCrispPath()
                    })
                },
                setStackedPoints: function() {
                    var t, e, i = this,
                        o = i.options;
                    for (r.prototype.setStackedPoints.apply(i, arguments), t = i.stackedYData ? i.stackedYData.length : 0, e = 1; e < t; e++) o.data[e].isSum || o.data[e].isIntermediateSum || (i.stackedYData[e] += i.stackedYData[e - 1])
                },
                getExtremes: function() {
                    if (this.options.stacking) return r.prototype.getExtremes.apply(this, arguments)
                }
            }, {
                getClassName: function() {
                    var t = n.prototype.getClassName.call(this);
                    return this.isSum ? t += " highcharts-sum" : this.isIntermediateSum && (t += " highcharts-intermediate-sum"), t
                },
                isValid: function() {
                    return i(this.y, !0) || this.isSum || this.isIntermediateSum
                }
            })
        }(e),
        function(t) {
            var e = t.arrayMax,
                i = t.arrayMin,
                o = t.Axis,
                n = t.color,
                r = t.each,
                a = t.isNumber,
                s = t.noop,
                l = t.pick,
                h = t.pInt,
                c = t.Point,
                d = t.Series,
                p = t.seriesType,
                u = t.seriesTypes;
            p("bubble", "scatter", {
                dataLabels: {
                    formatter: function() {
                        return this.point.z
                    },
                    inside: !0,
                    verticalAlign: "middle"
                },
                marker: {
                    lineColor: null,
                    lineWidth: 1,
                    radius: null,
                    states: {
                        hover: {
                            radiusPlus: 0
                        }
                    },
                    symbol: "circle"
                },
                minSize: 8,
                maxSize: "20%",
                softThreshold: !1,
                states: {
                    hover: {
                        halo: {
                            size: 5
                        }
                    }
                },
                tooltip: {
                    pointFormat: "({point.x}, {point.y}), Size: {point.z}"
                },
                turboThreshold: 0,
                zThreshold: 0,
                zoneAxis: "z"
            }, {
                pointArrayMap: ["y", "z"],
                parallelArrays: ["x", "y", "z"],
                trackerGroups: ["group", "dataLabelsGroup"],
                specialGroup: "group",
                bubblePadding: !0,
                zoneAxis: "z",
                directTouch: !0,
                pointAttribs: function(t, e) {
                    var i = this.options.marker,
                        o = l(i.fillOpacity, .5),
                        r = d.prototype.pointAttribs.call(this, t, e);
                    return 1 !== o && (r.fill = n(r.fill).setOpacity(o).get("rgba")), r
                },
                getRadii: function(t, e, i, o) {
                    var n, r, a, s, l, h = this.zData,
                        c = [],
                        d = this.options,
                        p = "width" !== d.sizeBy,
                        u = d.zThreshold,
                        g = e - t;
                    for (r = 0, n = h.length; r < n; r++) s = h[r], d.sizeByAbsoluteValue && null !== s && (s = Math.abs(s - u), e = Math.max(e - u, Math.abs(t - u)), t = 0), null === s ? l = null : s < t ? l = i / 2 - 1 : (a = g > 0 ? (s - t) / g : .5, p && a >= 0 && (a = Math.sqrt(a)), l = Math.ceil(i + a * (o - i)) / 2), c.push(l);
                    this.radii = c
                },
                animate: function(t) {
                    var e = this.options.animation;
                    t || (r(this.points, function(t) {
                        var i, o = t.graphic;
                        o && o.width && (i = {
                            x: o.x,
                            y: o.y,
                            width: o.width,
                            height: o.height
                        }, o.attr({
                            x: t.plotX,
                            y: t.plotY,
                            width: 1,
                            height: 1
                        }), o.animate(i, e))
                    }), this.animate = null)
                },
                translate: function() {
                    var e, i, o, n = this.data,
                        r = this.radii;
                    for (u.scatter.prototype.translate.call(this), e = n.length; e--;) i = n[e], o = r ? r[e] : 0, a(o) && o >= this.minPxSize / 2 ? (i.marker = t.extend(i.marker, {
                        radius: o,
                        width: 2 * o,
                        height: 2 * o
                    }), i.dlBox = {
                        x: i.plotX - o,
                        y: i.plotY - o,
                        width: 2 * o,
                        height: 2 * o
                    }) : i.shapeArgs = i.plotY = i.dlBox = void 0
                },
                alignDataLabel: u.column.prototype.alignDataLabel,
                buildKDTree: s,
                applyZones: s
            }, {
                haloPath: function(t) {
                    return c.prototype.haloPath.call(this, 0 === t ? 0 : (this.marker ? this.marker.radius || 0 : 0) + t)
                },
                ttBelow: !1
            }), o.prototype.beforePadding = function() {
                var t = this,
                    o = this.len,
                    n = this.chart,
                    s = 0,
                    c = o,
                    d = this.isXAxis,
                    p = d ? "xData" : "yData",
                    u = this.min,
                    g = {},
                    f = Math.min(n.plotWidth, n.plotHeight),
                    m = Number.MAX_VALUE,
                    x = -Number.MAX_VALUE,
                    v = this.max - u,
                    y = o / v,
                    b = [];
                r(this.series, function(o) {
                    var a, s = o.options;
                    !o.bubblePadding || !o.visible && n.options.chart.ignoreHiddenSeries || (t.allowZoomOutside = !0, b.push(o), d && (r(["minSize", "maxSize"], function(t) {
                        var e = s[t],
                            i = /%$/.test(e);
                        e = h(e), g[t] = i ? f * e / 100 : e
                    }), o.minPxSize = g.minSize, o.maxPxSize = Math.max(g.maxSize, g.minSize), (a = o.zData).length && (m = l(s.zMin, Math.min(m, Math.max(i(a), !1 === s.displayNegative ? s.zThreshold : -Number.MAX_VALUE))), x = l(s.zMax, Math.max(x, e(a))))))
                }), r(b, function(e) {
                    var i, o = e[p],
                        n = o.length;
                    if (d && e.getRadii(m, x, e.minPxSize, e.maxPxSize), v > 0)
                        for (; n--;) a(o[n]) && t.dataMin <= o[n] && o[n] <= t.dataMax && (i = e.radii[n], s = Math.min((o[n] - u) * y - i, s), c = Math.max((o[n] - u) * y + i, c))
                }), b.length && v > 0 && !this.isLog && (y *= (o + s - (c -= o)) / o, r([
                    ["min", "userMin", s],
                    ["max", "userMax", c]
                ], function(e) {
                    void 0 === l(t.options[e[0]], t[e[1]]) && (t[e[0]] += e[2] / y)
                }))
            }
        }(e),
        function(t) {
            function e(t, e) {
                var i, o = this.chart,
                    n = this.options.animation,
                    r = this.group,
                    a = this.markerGroup,
                    s = this.xAxis.center,
                    l = o.plotLeft,
                    h = o.plotTop;
                o.polar ? o.renderer.isSVG && (!0 === n && (n = {}), e ? (i = {
                    translateX: s[0] + l,
                    translateY: s[1] + h,
                    scaleX: .001,
                    scaleY: .001
                }, r.attr(i), a && a.attr(i)) : (i = {
                    translateX: l,
                    translateY: h,
                    scaleX: 1,
                    scaleY: 1
                }, r.animate(i, n), a && a.animate(i, n), this.animate = null)) : t.call(this, e)
            }
            var i, o = t.each,
                n = t.pick,
                r = t.Pointer,
                a = t.Series,
                s = t.seriesTypes,
                l = t.wrap,
                h = a.prototype,
                c = r.prototype;
            h.searchPointByAngle = function(t) {
                var e = this,
                    i = e.chart,
                    o = e.xAxis.pane.center,
                    n = t.chartX - o[0] - i.plotLeft,
                    r = t.chartY - o[1] - i.plotTop;
                return this.searchKDTree({
                    clientX: 180 + Math.atan2(n, r) * (-180 / Math.PI)
                })
            }, h.getConnectors = function(t, e, i, o) {
                var n, r, a, s, l, h, c, d, p, u, g, f, m, x, v, y, b, M, w, k, S, A = o ? 1 : 0;
                return n = e >= 0 && e <= t.length - 1 ? e : e < 0 ? t.length - 1 + e : 0, r = n - 1 < 0 ? t.length - (1 + A) : n - 1, a = n + 1 > t.length - 1 ? A : n + 1, s = t[r], l = t[a], h = s.plotX, c = s.plotY, d = l.plotX, p = l.plotY, u = t[n].plotX, g = t[n].plotY, m = (1.5 * u + h) / 2.5, x = (1.5 * g + c) / 2.5, v = (1.5 * u + d) / 2.5, y = (1.5 * g + p) / 2.5, b = Math.sqrt(Math.pow(m - u, 2) + Math.pow(x - g, 2)), M = Math.sqrt(Math.pow(v - u, 2) + Math.pow(y - g, 2)), w = Math.atan2(x - g, m - u), k = Math.atan2(y - g, v - u), S = Math.PI / 2 + (w + k) / 2, Math.abs(w - S) > Math.PI / 2 && (S -= Math.PI), m = u + Math.cos(S) * b, x = g + Math.sin(S) * b, v = u + Math.cos(Math.PI + S) * M, y = g + Math.sin(Math.PI + S) * M, f = {
                    rightContX: v,
                    rightContY: y,
                    leftContX: m,
                    leftContY: x,
                    plotX: u,
                    plotY: g
                }, i && (f.prevPointCont = this.getConnectors(t, r, !1, o)), f
            }, l(h, "buildKDTree", function(t) {
                this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.options.findNearestPointBy = "xy"), t.apply(this)
            }), h.toXY = function(t) {
                var e, i, o = this.chart,
                    n = t.plotX,
                    r = t.plotY;
                t.rectPlotX = n, t.rectPlotY = r, e = this.xAxis.postTranslate(t.plotX, this.yAxis.len - r), t.plotX = t.polarPlotX = e.x - o.plotLeft, t.plotY = t.polarPlotY = e.y - o.plotTop, this.kdByAngle ? ((i = (n / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360) < 0 && (i += 360), t.clientX = i) : t.clientX = t.plotX
            }, s.spline && (l(s.spline.prototype, "getPointSpline", function(t, e, i, o) {
                var n;
                return this.chart.polar ? o ? ["C", (n = this.getConnectors(e, o, !0, this.connectEnds)).prevPointCont.rightContX, n.prevPointCont.rightContY, n.leftContX, n.leftContY, n.plotX, n.plotY] : ["M", i.plotX, i.plotY] : t.call(this, e, i, o)
            }), s.areasplinerange && (s.areasplinerange.prototype.getPointSpline = s.spline.prototype.getPointSpline)), l(h, "translate", function(t) {
                var e, i, o = this.chart;
                if (t.call(this), o.polar && (this.kdByAngle = o.tooltip && o.tooltip.shared, !this.preventPostTranslate))
                    for (i = (e = this.points).length; i--;) this.toXY(e[i])
            }), l(h, "getGraphPath", function(t, e) {
                var i, n, r, a = this;
                if (this.chart.polar) {
                    for (e = e || this.points, i = 0; i < e.length; i++)
                        if (!e[i].isNull) {
                            n = i;
                            break
                        }!1 !== this.options.connectEnds && void 0 !== n && (this.connectEnds = !0, e.splice(e.length, 0, e[n]), r = !0), o(e, function(t) {
                        void 0 === t.polarPlotY && a.toXY(t)
                    })
                }
                var s = t.apply(this, [].slice.call(arguments, 1));
                return r && e.pop(), s
            }), l(h, "animate", e), s.column && ((i = s.column.prototype).polarArc = function(t, e, i, o) {
                var r = this.xAxis.center,
                    a = this.yAxis.len;
                return this.chart.renderer.symbols.arc(r[0], r[1], a - e, null, {
                    start: i,
                    end: o,
                    innerR: a - n(t, a)
                })
            }, l(i, "animate", e), l(i, "translate", function(t) {
                var e, i, o, n, r = this.xAxis,
                    a = r.startAngleRad;
                if (this.preventPostTranslate = !0, t.call(this), r.isRadial)
                    for (n = (i = this.points).length; n--;) e = (o = i[n]).barX + a, o.shapeType = "path", o.shapeArgs = {
                        d: this.polarArc(o.yBottom, o.plotY, e, e + o.pointWidth)
                    }, this.toXY(o), o.tooltipPos = [o.plotX, o.plotY], o.ttBelow = o.plotY > r.center[1]
            }), l(i, "alignDataLabel", function(t, e, i, o, n, r) {
                if (this.chart.polar) {
                    var a, s, l = e.rectPlotX / Math.PI * 180;
                    null === o.align && (a = l > 20 && l < 160 ? "left" : l > 200 && l < 340 ? "right" : "center", o.align = a), null === o.verticalAlign && (s = l < 45 || l > 315 ? "bottom" : l > 135 && l < 225 ? "top" : "middle", o.verticalAlign = s), h.alignDataLabel.call(this, e, i, o, n, r)
                } else t.call(this, e, i, o, n, r)
            })), l(c, "getCoordinates", function(t, e) {
                var i = this.chart,
                    n = {
                        xAxis: [],
                        yAxis: []
                    };
                return i.polar ? o(i.axes, function(t) {
                    var o = t.isXAxis,
                        r = t.center,
                        a = e.chartX - r[0] - i.plotLeft,
                        s = e.chartY - r[1] - i.plotTop;
                    n[o ? "xAxis" : "yAxis"].push({
                        axis: t,
                        value: t.translate(o ? Math.PI - Math.atan2(a, s) : Math.sqrt(Math.pow(a, 2) + Math.pow(s, 2)), !0)
                    })
                }) : n = t.call(this, e), n
            }), l(t.Chart.prototype, "getAxes", function(e) {
                this.pane || (this.pane = []), o(t.splat(this.options.pane), function(e) {
                    new t.Pane(e, this)
                }, this), e.call(this)
            }), l(t.Chart.prototype, "drawChartBox", function(t) {
                t.call(this), o(this.pane, function(t) {
                    t.render()
                })
            }), l(t.Chart.prototype, "get", function(e, i) {
                return t.find(this.pane, function(t) {
                    return t.options.id === i
                }) || e.call(this, i)
            })
        }(e),
        function(t) {
            var e = t.seriesType,
                i = t.seriesTypes,
                o = t.noop,
                n = t.pick,
                r = t.each;
            e("funnel", "pie", {
                animation: !1,
                center: ["50%", "50%"],
                width: "90%",
                neckWidth: "30%",
                height: "100%",
                neckHeight: "25%",
                reversed: !1,
                size: !0,
                dataLabels: {
                    connectorWidth: 1
                },
                states: {
                    select: {
                        color: "#cccccc",
                        borderColor: "#000000",
                        shadow: !1
                    }
                }
            }, {
                animate: o,
                translate: function() {
                    var t, e, i, n, a, s, l, h, c, d, p, u = function(t, e) {
                            return /%$/.test(t) ? e * parseInt(t, 10) / 100 : parseInt(t, 10)
                        },
                        g = 0,
                        f = this,
                        m = f.chart,
                        x = f.options,
                        v = x.reversed,
                        y = x.ignoreHiddenPoint,
                        b = m.plotWidth,
                        M = m.plotHeight,
                        w = 0,
                        k = x.center,
                        S = u(k[0], b),
                        A = u(k[1], M),
                        C = u(x.width, b),
                        T = u(x.height, M),
                        P = u(x.neckWidth, b),
                        L = u(x.neckHeight, M),
                        D = A - T / 2 + T - L,
                        O = f.data,
                        I = "left" === x.dataLabels.position ? 1 : 0;
                    f.getWidthAt = e = function(t) {
                        var e = A - T / 2;
                        return t > D || T === L ? P : P + (C - P) * (1 - (t - e) / (T - L))
                    }, f.getX = function(t, i, o) {
                        return S + (i ? -1 : 1) * (e(v ? 2 * A - t : t) / 2 + o.labelDistance)
                    }, f.center = [S, A, T], f.centerX = S, r(O, function(t) {
                        y && !1 === t.visible || (g += t.y)
                    }), r(O, function(r) {
                        p = null, n = g ? r.y / g : 0, c = (s = A - T / 2 + w * T) + n * T, t = e(s), l = (a = S - t / 2) + t, t = e(c), d = (h = S - t / 2) + t, s > D ? (a = h = S - P / 2, l = d = S + P / 2) : c > D && (p = c, t = e(D), d = (h = S - t / 2) + t, c = D), v && (s = 2 * A - s, c = 2 * A - c, p = p ? 2 * A - p : null), i = ["M", a, s, "L", l, s, d, c], p && i.push(d, p, h, p), i.push(h, c, "Z"), r.shapeType = "path", r.shapeArgs = {
                            d: i
                        }, r.percentage = 100 * n, r.plotX = S, r.plotY = (s + (p || c)) / 2, r.tooltipPos = [S, r.plotY], r.slice = o, r.half = I, y && !1 === r.visible || (w += n)
                    })
                },
                sortByAngle: function(t) {
                    t.sort(function(t, e) {
                        return t.plotY - e.plotY
                    })
                },
                drawDataLabels: function() {
                    var t, e, o, r, a, s = this,
                        l = s.data,
                        h = s.options.dataLabels.distance,
                        c = l.length;
                    for (s.center[2] -= 2 * h; c--;) e = (t = (o = l[c]).half) ? 1 : -1, a = o.plotY, o.labelDistance = n(o.options.dataLabels && o.options.dataLabels.distance, h), s.maxLabelDistance = Math.max(o.labelDistance, s.maxLabelDistance || 0), r = s.getX(a, t, o), o.labelPos = [0, a, r + (o.labelDistance - 5) * e, a, r + o.labelDistance * e, a, t ? "right" : "left", 0];
                    i.pie.prototype.drawDataLabels.call(this)
                }
            }), e("pyramid", "funnel", {
                neckWidth: "0%",
                neckHeight: "0%",
                reversed: !0
            })
        }(e),
        function(t) {
            var e = t.defaultOptions,
                i = t.doc,
                o = t.Chart,
                n = t.addEvent,
                r = t.removeEvent,
                a = t.fireEvent,
                s = t.createElement,
                l = t.discardElement,
                h = t.css,
                c = t.merge,
                d = t.pick,
                p = t.each,
                u = t.objectEach,
                g = t.extend,
                f = t.isTouchDevice,
                m = t.win,
                x = m.navigator.userAgent,
                v = (t.SVGRenderer, t.Renderer.prototype.symbols);
            /Edge\/|Trident\/|MSIE /.test(x), /firefox/i.test(x);
            g(e.lang, {
                printChart: "Print chart",
                downloadPNG: "Download PNG image",
                downloadJPEG: "Download JPEG image",
                downloadPDF: "Download PDF document",
                downloadSVG: "Download SVG vector image",
                contextButtonTitle: "Chart context menu"
            }), e.navigation = {
                buttonOptions: {
                    theme: {},
                    symbolSize: 14,
                    symbolX: 12.5,
                    symbolY: 10.5,
                    align: "right",
                    buttonSpacing: 3,
                    height: 22,
                    verticalAlign: "top",
                    width: 24
                }
            }, c(!0, e.navigation, {
                menuStyle: {
                    border: "1px solid #999999",
                    background: "#ffffff",
                    padding: "5px 0"
                },
                menuItemStyle: {
                    padding: "0.5em 1em",
                    background: "none",
                    color: "#333333",
                    fontSize: f ? "14px" : "11px",
                    transition: "background 250ms, color 250ms"
                },
                menuItemHoverStyle: {
                    background: "#335cad",
                    color: "#ffffff"
                },
                buttonOptions: {
                    symbolFill: "#666666",
                    symbolStroke: "#666666",
                    symbolStrokeWidth: 3,
                    theme: {
                        fill: "#ffffff",
                        stroke: "none",
                        padding: 5
                    }
                }
            }), e.exporting = {
                type: "image/png",
                url: "https://export.highcharts.com/",
                printMaxWidth: 780,
                scale: 2,
                buttons: {
                    contextButton: {
                        className: "highcharts-contextbutton",
                        menuClassName: "highcharts-contextmenu",
                        symbol: "menu",
                        _titleKey: "contextButtonTitle",
                        menuItems: [{
                            textKey: "printChart",
                            onclick: function() {
                                this.print()
                            }
                        }, {
                            separator: !0
                        }, {
                            textKey: "downloadPNG",
                            onclick: function() {
                                this.exportChart()
                            }
                        }, {
                            textKey: "downloadJPEG",
                            onclick: function() {
                                this.exportChart({
                                    type: "image/jpeg"
                                })
                            }
                        }, {
                            textKey: "downloadPDF",
                            onclick: function() {
                                this.exportChart({
                                    type: "application/pdf"
                                })
                            }
                        }, {
                            textKey: "downloadSVG",
                            onclick: function() {
                                this.exportChart({
                                    type: "image/svg+xml"
                                })
                            }
                        }]
                    }
                }
            }, t.post = function(t, e, o) {
                var n = s("form", c({
                    method: "post",
                    action: t,
                    enctype: "multipart/form-data"
                }, o), {
                    display: "none"
                }, i.body);
                u(e, function(t, e) {
                    s("input", {
                        type: "hidden",
                        name: e,
                        value: t
                    }, null, n)
                }), n.submit(), l(n)
            }, g(o.prototype, {
                sanitizeSVG: function(t, e) {
                    if (e && e.exporting && e.exporting.allowHTML) {
                        var i = t.match(/<\/svg>(.*?$)/);
                        i && i[1] && (i = '<foreignObject x="0" y="0" width="' + e.chart.width + '" height="' + e.chart.height + '"><body xmlns="http://www.w3.org/1999/xhtml">' + i[1] + "</body></foreignObject>", t = t.replace("</svg>", i + "</svg>"))
                    }
                    return t = t.replace(/zIndex="[^"]+"/g, "").replace(/isShadow="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g, " xlink:href=").replace(/\n/, " ").replace(/<\/svg>.*?$/, "</svg>").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, "Â ").replace(/&shy;/g, "Â­"), t = t.replace(/<IMG /g, "<image ").replace(/<(\/?)TITLE>/g, "<$1title>").replace(/height=([^" ]+)/g, 'height="$1"').replace(/width=([^" ]+)/g, 'width="$1"').replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>').replace(/ id=([^" >]+)/g, ' id="$1"').replace(/class=([^" >]+)/g, 'class="$1"').replace(/ transform /g, " ").replace(/:(path|rect)/g, "$1").replace(/style="([^"]+)"/g, function(t) {
                        return t.toLowerCase()
                    })
                },
                getChartHTML: function() {
                    return this.container.innerHTML
                },
                getSVG: function(e) {
                    var o, n, r, a, h, d, u, f, m = this,
                        x = c(m.options, e);
                    return i.createElementNS || (i.createElementNS = function(t, e) {
                        return i.createElement(e)
                    }), n = s("div", null, {
                        position: "absolute",
                        top: "-9999em",
                        width: m.chartWidth + "px",
                        height: m.chartHeight + "px"
                    }, i.body), u = m.renderTo.style.width, f = m.renderTo.style.height, h = x.exporting.sourceWidth || x.chart.width || /px$/.test(u) && parseInt(u, 10) || 600, d = x.exporting.sourceHeight || x.chart.height || /px$/.test(f) && parseInt(f, 10) || 400, g(x.chart, {
                        animation: !1,
                        renderTo: n,
                        forExport: !0,
                        renderer: "SVGRenderer",
                        width: h,
                        height: d
                    }), x.exporting.enabled = !1, delete x.data, x.series = [], p(m.series, function(t) {
                        (a = c(t.userOptions, {
                            animation: !1,
                            enableMouseTracking: !1,
                            showCheckbox: !1,
                            visible: t.visible
                        })).isInternal || x.series.push(a)
                    }), p(m.axes, function(e) {
                        e.userOptions.internalKey || (e.userOptions.internalKey = t.uniqueKey())
                    }), o = new t.Chart(x, m.callback), e && p(["xAxis", "yAxis", "series"], function(t) {
                        var i = {};
                        e[t] && (i[t] = e[t], o.update(i))
                    }), p(m.axes, function(e) {
                        var i = t.find(o.axes, function(t) {
                                return t.options.internalKey === e.userOptions.internalKey
                            }),
                            n = e.getExtremes(),
                            r = n.userMin,
                            a = n.userMax;
                        !i || void 0 === r && void 0 === a || i.setExtremes(r, a, !0, !1)
                    }), r = o.getChartHTML(), r = m.sanitizeSVG(r, x), x = null, o.destroy(), l(n), r
                },
                getSVGForExport: function(t, e) {
                    var i = this.options.exporting;
                    return this.getSVG(c({
                        chart: {
                            borderRadius: 0
                        }
                    }, i.chartOptions, e, {
                        exporting: {
                            sourceWidth: t && t.sourceWidth || i.sourceWidth,
                            sourceHeight: t && t.sourceHeight || i.sourceHeight
                        }
                    }))
                },
                exportChart: function(e, i) {
                    var o = this.getSVGForExport(e, i);
                    e = c(this.options.exporting, e), t.post(e.url, {
                        filename: e.filename || "chart",
                        type: e.type,
                        width: e.width || 0,
                        scale: e.scale,
                        svg: o
                    }, e.formAttributes)
                },
                print: function() {
                    var t, e, o = this,
                        n = o.container,
                        r = [],
                        s = n.parentNode,
                        l = i.body,
                        h = l.childNodes,
                        c = o.options.exporting.printMaxWidth;
                    o.isPrinting || (o.isPrinting = !0, o.pointer.reset(null, 0), a(o, "beforePrint"), (e = c && o.chartWidth > c) && (t = [o.options.chart.width, void 0, !1], o.setSize(c, void 0, !1)), p(h, function(t, e) {
                        1 === t.nodeType && (r[e] = t.style.display, t.style.display = "none")
                    }), l.appendChild(n), m.focus(), m.print(), setTimeout(function() {
                        s.appendChild(n), p(h, function(t, e) {
                            1 === t.nodeType && (t.style.display = r[e])
                        }), o.isPrinting = !1, e && o.setSize.apply(o, t), a(o, "afterPrint")
                    }, 1e3))
                },
                contextMenu: function(t, e, o, r, a, l, c) {
                    var d, u, f, m = this,
                        x = m.options.navigation,
                        v = m.chartWidth,
                        y = m.chartHeight,
                        b = "cache-" + t,
                        M = m[b],
                        w = Math.max(a, l);
                    M || (m[b] = M = s("div", {
                        className: t
                    }, {
                        position: "absolute",
                        zIndex: 1e3,
                        padding: w + "px"
                    }, m.container), d = s("div", {
                        className: "highcharts-menu"
                    }, null, M), h(d, g({
                        MozBoxShadow: "3px 3px 10px #888",
                        WebkitBoxShadow: "3px 3px 10px #888",
                        boxShadow: "3px 3px 10px #888"
                    }, x.menuStyle)), u = function() {
                        h(M, {
                            display: "none"
                        }), c && c.setState(0), m.openMenu = !1
                    }, m.exportEvents.push(n(M, "mouseleave", function() {
                        M.hideTimer = setTimeout(u, 500)
                    }), n(M, "mouseenter", function() {
                        clearTimeout(M.hideTimer)
                    }), n(i, "mouseup", function(e) {
                        m.pointer.inClass(e.target, t) || u()
                    })), p(e, function(t) {
                        if (t) {
                            var e;
                            t.separator ? e = s("hr", null, null, d) : ((e = s("div", {
                                className: "highcharts-menu-item",
                                onclick: function(e) {
                                    e && e.stopPropagation(), u(), t.onclick && t.onclick.apply(m, arguments)
                                },
                                innerHTML: t.text || m.options.lang[t.textKey]
                            }, null, d)).onmouseover = function() {
                                h(this, x.menuItemHoverStyle)
                            }, e.onmouseout = function() {
                                h(this, x.menuItemStyle)
                            }, h(e, g({
                                cursor: "pointer"
                            }, x.menuItemStyle))), m.exportDivElements.push(e)
                        }
                    }), m.exportDivElements.push(d, M), m.exportMenuWidth = M.offsetWidth, m.exportMenuHeight = M.offsetHeight), f = {
                        display: "block"
                    }, o + m.exportMenuWidth > v ? f.right = v - o - a - w + "px" : f.left = o - w + "px", r + l + m.exportMenuHeight > y && "top" !== c.alignOptions.verticalAlign ? f.bottom = y - r - w + "px" : f.top = r + l - w + "px", h(M, f), m.openMenu = !0
                },
                addButton: function(t) {
                    var e, i, o = this,
                        n = o.renderer,
                        r = c(o.options.navigation.buttonOptions, t),
                        a = r.onclick,
                        s = r.menuItems,
                        l = r.symbolSize || 12;
                    if (o.btnCount || (o.btnCount = 0), o.exportDivElements || (o.exportDivElements = [], o.exportSVGElements = []), !1 !== r.enabled) {
                        var h, p = r.theme,
                            u = p.states,
                            f = u && u.hover,
                            m = u && u.select;
                        delete p.states, a ? h = function(t) {
                            t.stopPropagation(), a.call(o, t)
                        } : s && (h = function() {
                            o.contextMenu(i.menuClassName, s, i.translateX, i.translateY, i.width, i.height, i), i.setState(2)
                        }), r.text && r.symbol ? p.paddingLeft = d(p.paddingLeft, 25) : r.text || g(p, {
                            width: r.width,
                            height: r.height,
                            padding: 0
                        }), (i = n.button(r.text, 0, 0, h, p, f, m).addClass(t.className).attr({
                            "stroke-linecap": "round",
                            title: o.options.lang[r._titleKey],
                            zIndex: 3
                        })).menuClassName = t.menuClassName || "highcharts-menu-" + o.btnCount++, r.symbol && (e = n.symbol(r.symbol, r.symbolX - l / 2, r.symbolY - l / 2, l, l).addClass("highcharts-button-symbol").attr({
                            zIndex: 1
                        }).add(i)).attr({
                            stroke: r.symbolStroke,
                            fill: r.symbolFill,
                            "stroke-width": r.symbolStrokeWidth || 1
                        }), i.add().align(g(r, {
                            width: i.width,
                            x: d(r.x, o.buttonOffset)
                        }), !0, "spacingBox"), o.buttonOffset += (i.width + r.buttonSpacing) * ("right" === r.align ? -1 : 1), o.exportSVGElements.push(i, e)
                    }
                },
                destroyExport: function(t) {
                    var e, i = t ? t.target : this,
                        o = i.exportSVGElements,
                        n = i.exportDivElements,
                        a = i.exportEvents;
                    o && (p(o, function(t, o) {
                        t && (t.onclick = t.ontouchstart = null, e = "cache-" + t.menuClassName, i[e] && delete i[e], i.exportSVGElements[o] = t.destroy())
                    }), o.length = 0), n && (p(n, function(t, e) {
                        clearTimeout(t.hideTimer), r(t, "mouseleave"), i.exportDivElements[e] = t.onmouseout = t.onmouseover = t.ontouchstart = t.onclick = null, l(t)
                    }), n.length = 0), a && (p(a, function(t) {
                        t()
                    }), a.length = 0)
                }
            }), v.menu = function(t, e, i, o) {
                return ["M", t, e + 2.5, "L", t + i, e + 2.5, "M", t, e + o / 2 + .5, "L", t + i, e + o / 2 + .5, "M", t, e + o - 1.5, "L", t + i, e + o - 1.5]
            }, o.prototype.renderExporting = function() {
                var t = this,
                    e = t.options.exporting,
                    i = e.buttons,
                    o = t.isDirtyExporting || !t.exportSVGElements;
                t.buttonOffset = 0, t.isDirtyExporting && t.destroyExport(), o && !1 !== e.enabled && (t.exportEvents = [], u(i, function(e) {
                    t.addButton(e)
                }), t.isDirtyExporting = !1), n(t, "destroy", t.destroyExport)
            }, o.prototype.callbacks.push(function(t) {
                function e(e, i, o) {
                    t.isDirtyExporting = !0, c(!0, t.options[e], i), d(o, !0) && t.redraw()
                }
                t.renderExporting(), n(t, "redraw", t.renderExporting), p(["exporting", "navigation"], function(i) {
                    t[i] = {
                        update: function(t, o) {
                            e(i, t, o)
                        }
                    }
                })
            })
        }(e),
        function(t) {
            function e(t, e) {
                var i = r.getElementsByTagName("head")[0],
                    o = r.createElement("script");
                o.type = "text/javascript", o.src = t, o.onload = e, o.onerror = function() {
                    console.error("Error loading script", t)
                }, i.appendChild(o)
            }
            var i = t.merge,
                o = t.win,
                n = o.navigator,
                r = o.document,
                a = t.each,
                s = o.URL || o.webkitURL || o,
                l = /Edge\/|Trident\/|MSIE /.test(n.userAgent),
                h = /Edge\/\d+/.test(n.userAgent),
                c = l ? 150 : 0;
            t.CanVGRenderer = {}, t.dataURLtoBlob = function(t) {
                if (o.atob && o.ArrayBuffer && o.Uint8Array && o.Blob && s.createObjectURL) {
                    for (var e, i = t.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/), n = o.atob(i[3]), r = new o.ArrayBuffer(n.length), a = new o.Uint8Array(r), l = 0; l < a.length; ++l) a[l] = n.charCodeAt(l);
                    return e = new o.Blob([a], {
                        type: i[1]
                    }), s.createObjectURL(e)
                }
            }, t.downloadURL = function(e, i) {
                var a, s = r.createElement("a");
                if (n.msSaveOrOpenBlob) n.msSaveOrOpenBlob(e, i);
                else {
                    if (e.length > 2e6 && !(e = t.dataURLtoBlob(e))) throw "Data URL length limit reached";
                    if (void 0 !== s.download) s.href = e, s.download = i, r.body.appendChild(s), s.click(), r.body.removeChild(s);
                    else try {
                        if (void 0 === (a = o.open(e, "chart")) || null === a) throw "Failed to open window"
                    } catch (t) {
                        o.location.href = e
                    }
                }
            }, t.svgToDataUrl = function(t) {
                var e = n.userAgent.indexOf("WebKit") > -1 && n.userAgent.indexOf("Chrome") < 0;
                try {
                    if (!e && n.userAgent.toLowerCase().indexOf("firefox") < 0) return s.createObjectURL(new o.Blob([t], {
                        type: "image/svg+xml;charset-utf-16"
                    }))
                } catch (t) {}
                return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(t)
            }, t.imageToDataUrl = function(t, e, i, n, a, s, l, h, d) {
                var p, u = new o.Image,
                    g = function() {
                        setTimeout(function() {
                            var o, s = r.createElement("canvas"),
                                h = s.getContext && s.getContext("2d");
                            try {
                                if (h) {
                                    s.height = u.height * n, s.width = u.width * n, h.drawImage(u, 0, 0, s.width, s.height);
                                    try {
                                        o = s.toDataURL(e), a(o, e, i, n)
                                    } catch (o) {
                                        p(t, e, i, n)
                                    }
                                } else l(t, e, i, n)
                            } finally {
                                d && d(t, e, i, n)
                            }
                        }, c)
                    },
                    f = function() {
                        h(t, e, i, n), d && d(t, e, i, n)
                    };
                p = function() {
                    u = new o.Image, p = s, u.crossOrigin = "Anonymous", u.onload = g, u.onerror = f, u.src = t
                }, u.onload = g, u.onerror = f, u.src = t
            }, t.downloadSVGLocal = function(i, l, h, c) {
                function d(t, e) {
                    var i = t.width.baseVal.value + 2 * e,
                        n = t.height.baseVal.value + 2 * e,
                        r = new o.jsPDF("l", "pt", [i, n]);
                    return o.svg2pdf(t, r, {
                        removeInvalid: !0
                    }), r.output("datauristring")
                }

                function p() {
                    v.innerHTML = i;
                    var e, o, n = v.getElementsByTagName("text"),
                        r = v.getElementsByTagName("svg")[0].style;
                    a(n, function(t) {
                        a(["font-family", "font-size"], function(e) {
                            !t.style[e] && r[e] && (t.style[e] = r[e])
                        }), t.style["font-family"] = t.style["font-family"] && t.style["font-family"].split(" ").splice(-1), e = t.getElementsByTagName("title"), a(e, function(e) {
                            t.removeChild(e)
                        })
                    }), o = d(v.firstChild, 0);
                    try {
                        t.downloadURL(o, b), c && c()
                    } catch (t) {
                        h()
                    }
                }
                var u, g, f, m = !0,
                    x = l.libURL || t.getOptions().exporting.libURL,
                    v = r.createElement("div"),
                    y = l.type || "image/png",
                    b = (l.filename || "chart") + "." + ("image/svg+xml" === y ? "svg" : y.split("/")[1]),
                    M = l.scale || 1;
                if (x = "/" !== x.slice(-1) ? x + "/" : x, "image/svg+xml" === y) try {
                    n.msSaveOrOpenBlob ? ((g = new MSBlobBuilder).append(i), u = g.getBlob("image/svg+xml")) : u = t.svgToDataUrl(i), t.downloadURL(u, b), c && c()
                } catch (t) {
                    h()
                } else "application/pdf" === y ? o.jsPDF && o.svg2pdf ? p() : (m = !0, e(x + "jspdf.js", function() {
                    e(x + "svg2pdf.js", function() {
                        p()
                    })
                })) : (u = t.svgToDataUrl(i), f = function() {
                    try {
                        s.revokeObjectURL(u)
                    } catch (t) {}
                }, t.imageToDataUrl(u, y, {}, M, function(e) {
                    try {
                        t.downloadURL(e, b), c && c()
                    } catch (t) {
                        h()
                    }
                }, function() {
                    var a = r.createElement("canvas"),
                        s = a.getContext("2d"),
                        l = i.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * M,
                        d = i.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * M,
                        p = function() {
                            s.drawSvg(i, 0, 0, l, d);
                            try {
                                t.downloadURL(n.msSaveOrOpenBlob ? a.msToBlob() : a.toDataURL(y), b), c && c()
                            } catch (t) {
                                h()
                            } finally {
                                f()
                            }
                        };
                    a.width = l, a.height = d, o.canvg ? p() : (m = !0, e(x + "rgbcolor.js", function() {
                        e(x + "canvg.js", function() {
                            p()
                        })
                    }))
                }, h, h, function() {
                    m && f()
                }))
            }, t.Chart.prototype.getSVGForLocalExport = function(e, i, o, n) {
                var r, a, s, l, h, c, d = this,
                    p = 0,
                    u = function(t) {
                        return d.sanitizeSVG(t, s)
                    },
                    g = function(t, e, i) {
                        ++p, i.imageElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), p === r.length && n(u(a.innerHTML))
                    };
                t.wrap(t.Chart.prototype, "getChartHTML", function(t) {
                    var e = t.apply(this, Array.prototype.slice.call(arguments, 1));
                    return s = this.options, a = this.container.cloneNode(!0), e
                }), d.getSVGForExport(e, i), r = a.getElementsByTagName("image");
                try {
                    if (!r.length) return void n(u(a.innerHTML));
                    for (h = 0, c = r.length; h < c; ++h) l = r[h], t.imageToDataUrl(l.getAttributeNS("http://www.w3.org/1999/xlink", "href"), "image/png", {
                        imageElement: l
                    }, e.scale, g, o, o, o)
                } catch (t) {
                    o()
                }
            }, t.Chart.prototype.exportChartLocal = function(e, i) {
                var o = this,
                    n = t.merge(o.options.exporting, e),
                    r = function() {
                        if (!1 === n.fallbackToExportServer) {
                            if (!n.error) throw "Fallback to export server disabled";
                            n.error(n)
                        } else o.exportChart(n)
                    },
                    a = function(e) {
                        e.indexOf("<foreignObject") > -1 && "image/svg+xml" !== n.type ? r() : t.downloadSVGLocal(e, n, r)
                    };
                l && ("application/pdf" === n.type || o.container.getElementsByTagName("image").length && "image/svg+xml" !== n.type) || h && "image/svg+xml" !== n.type || "application/pdf" === n.type && o.container.getElementsByTagName("image").length ? r() : o.getSVGForLocalExport(n, i, r, a)
            }, i(!0, t.getOptions().exporting, {
                libURL: "https://code.highcharts.com/5.0.12 custom build/lib/",
                buttons: {
                    contextButton: {
                        menuItems: [{
                            textKey: "printChart",
                            onclick: function() {
                                this.print()
                            }
                        }, {
                            separator: !0
                        }, {
                            textKey: "downloadPNG",
                            onclick: function() {
                                this.exportChartLocal()
                            }
                        }, {
                            textKey: "downloadJPEG",
                            onclick: function() {
                                this.exportChartLocal({
                                    type: "image/jpeg"
                                })
                            }
                        }, {
                            textKey: "downloadSVG",
                            onclick: function() {
                                this.exportChartLocal({
                                    type: "image/svg+xml"
                                })
                            }
                        }, {
                            textKey: "downloadPDF",
                            onclick: function() {
                                this.exportChartLocal({
                                    type: "application/pdf"
                                })
                            }
                        }]
                    }
                }
            })
        }(e),
        function(t) {
            var e, i = t.win.document,
                o = t.each,
                n = t.objectEach,
                r = t.pick,
                a = t.inArray,
                s = t.isNumber,
                l = t.splat,
                h = function(t, e) {
                    this.init(t, e)
                };
            t.extend(h.prototype, {
                init: function(t, e) {
                    this.options = t, this.chartOptions = e, this.columns = t.columns || this.rowsToColumns(t.rows) || [], this.firstRowAsNames = r(t.firstRowAsNames, !0), this.decimalRegex = t.decimalPoint && new RegExp("^(-?[0-9]+)" + t.decimalPoint + "([0-9]+)$"), this.rawColumns = [], this.columns.length ? this.dataFound() : (this.parseCSV(), this.parseTable(), this.parseGoogleSpreadsheet())
                },
                getColumnDistribution: function() {
                    var i, r = this.chartOptions,
                        a = this.options,
                        s = [],
                        l = function(e) {
                            return (t.seriesTypes[e || "line"].prototype.pointArrayMap || [0]).length
                        },
                        h = function(e) {
                            return t.seriesTypes[e || "line"].prototype.pointArrayMap
                        },
                        c = r && r.chart && r.chart.type,
                        d = [],
                        p = [],
                        u = 0;
                    o(r && r.series || [], function(t) {
                        d.push(l(t.type || c))
                    }), o(a && a.seriesMapping || [], function(t) {
                        s.push(t.x || 0)
                    }), 0 === s.length && s.push(0), o(a && a.seriesMapping || [], function(t) {
                        var o = new e,
                            a = d[u] || l(c),
                            s = r && r.series || [],
                            g = h((s[u] || {}).type || c) || ["y"];
                        for (o.addColumnReader(t.x, "x"), n(t, function(t, e) {
                                "x" !== e && o.addColumnReader(t, e)
                            }), i = 0; i < a; i++) o.hasReader(g[i]) || o.addColumnReader(void 0, g[i]);
                        p.push(o), u++
                    });
                    var g = h(c);
                    void 0 === g && (g = ["y"]), this.valueCount = {
                        global: l(c),
                        xColumns: s,
                        individual: d,
                        seriesBuilders: p,
                        globalPointArrayMap: g
                    }
                },
                dataFound: function() {
                    this.options.switchRowsAndColumns && (this.columns = this.rowsToColumns(this.columns)), this.getColumnDistribution(), this.parseTypes(), !1 !== this.parsed() && this.complete()
                },
                parseCSV: function() {
                    var t, e, i = this,
                        n = this.options,
                        r = n.csv,
                        a = this.columns,
                        s = n.startRow || 0,
                        l = n.endRow || Number.MAX_VALUE,
                        h = n.startColumn || 0,
                        c = n.endColumn || Number.MAX_VALUE,
                        d = 0;
                    r && (e = r.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(n.lineDelimiter || "\n"), t = n.itemDelimiter || (-1 !== r.indexOf("\t") ? "\t" : ","), o(e, function(e, n) {
                        var r, p = i.trim(e),
                            u = 0 === p.indexOf("#"),
                            g = "" === p;
                        n >= s && n <= l && !u && !g && (r = e.split(t), o(r, function(t, e) {
                            e >= h && e <= c && (a[e - h] || (a[e - h] = []), a[e - h][d] = t)
                        }), d += 1)
                    }), this.dataFound())
                },
                parseTable: function() {
                    var t = this.options,
                        e = t.table,
                        n = this.columns,
                        r = t.startRow || 0,
                        a = t.endRow || Number.MAX_VALUE,
                        s = t.startColumn || 0,
                        l = t.endColumn || Number.MAX_VALUE;
                    e && ("string" == typeof e && (e = i.getElementById(e)), o(e.getElementsByTagName("tr"), function(t, e) {
                        e >= r && e <= a && o(t.children, function(t, i) {
                            ("TD" === t.tagName || "TH" === t.tagName) && i >= s && i <= l && (n[i - s] || (n[i - s] = []), n[i - s][e - r] = t.innerHTML)
                        })
                    }), this.dataFound())
                },
                parseGoogleSpreadsheet: function() {
                    var t, e, i = this,
                        n = this.options,
                        r = n.googleSpreadsheetKey,
                        a = this.columns,
                        s = n.startRow || 0,
                        l = n.endRow || Number.MAX_VALUE,
                        h = n.startColumn || 0,
                        c = n.endColumn || Number.MAX_VALUE;
                    r && jQuery.ajax({
                        dataType: "json",
                        url: "https://spreadsheets.google.com/feeds/cells/" + r + "/" + (n.googleSpreadsheetWorksheet || "od6") + "/public/values?alt=json-in-script&callback=?",
                        error: n.error,
                        success: function(n) {
                            var r, d, p = n.feed.entry,
                                u = p.length,
                                g = 0,
                                f = 0;
                            for (d = 0; d < u; d++) r = p[d], g = Math.max(g, r.gs$cell.col), f = Math.max(f, r.gs$cell.row);
                            for (d = 0; d < g; d++) d >= h && d <= c && (a[d - h] = [], a[d - h].length = Math.min(f, l - s));
                            for (d = 0; d < u; d++) r = p[d], t = r.gs$cell.row - 1, (e = r.gs$cell.col - 1) >= h && e <= c && t >= s && t <= l && (a[e - h][t - s] = r.content.$t);
                            o(a, function(t) {
                                for (d = 0; d < t.length; d++) void 0 === t[d] && (t[d] = null)
                            }), i.dataFound()
                        }
                    })
                },
                trim: function(t, e) {
                    return "string" == typeof t && (t = t.replace(/^\s+|\s+$/g, ""), e && /^[0-9\s]+$/.test(t) && (t = t.replace(/\s/g, "")), this.decimalRegex && (t = t.replace(this.decimalRegex, "$1.$2"))), t
                },
                parseTypes: function() {
                    for (var t = this.columns, e = t.length; e--;) this.parseColumn(t[e], e)
                },
                parseColumn: function(t, e) {
                    var i, o, n, r, h, c, d, p = this.rawColumns,
                        u = this.columns,
                        g = t.length,
                        f = this.firstRowAsNames,
                        m = -1 !== a(e, this.valueCount.xColumns),
                        x = [],
                        v = this.chartOptions,
                        y = (this.options.columnTypes || [])[e],
                        b = m && (v && v.xAxis && "category" === l(v.xAxis)[0].type || "string" === y);
                    for (p[e] || (p[e] = []); g--;) i = x[g] || t[g], n = this.trim(i), r = this.trim(i, !0), o = parseFloat(r), void 0 === p[e][g] && (p[e][g] = n), b || 0 === g && f ? t[g] = n : +r === o ? (t[g] = o, o > 31536e6 && "float" !== y ? t.isDatetime = !0 : t.isNumeric = !0, void 0 !== t[g + 1] && (d = o > t[g + 1])) : (h = this.parseDate(i), m && s(h) && "float" !== y ? (x[g] = i, t[g] = h, t.isDatetime = !0, void 0 !== t[g + 1] && ((c = h > t[g + 1]) !== d && void 0 !== d && (this.alternativeFormat ? (this.dateFormat = this.alternativeFormat, g = t.length, this.alternativeFormat = this.dateFormats[this.dateFormat].alternative) : t.unsorted = !0), d = c)) : (t[g] = "" === n ? null : n, 0 !== g && (t.isDatetime || t.isNumeric) && (t.mixed = !0)));
                    if (m && t.mixed && (u[e] = p[e]), m && d && this.options.sort)
                        for (e = 0; e < u.length; e++) u[e].reverse(), f && u[e].unshift(u[e].pop())
                },
                dateFormats: {
                    "YYYY-mm-dd": {
                        regex: /^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/,
                        parser: function(t) {
                            return Date.UTC(+t[1], t[2] - 1, +t[3])
                        }
                    },
                    "dd/mm/YYYY": {
                        regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,
                        parser: function(t) {
                            return Date.UTC(+t[3], t[2] - 1, +t[1])
                        },
                        alternative: "mm/dd/YYYY"
                    },
                    "mm/dd/YYYY": {
                        regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,
                        parser: function(t) {
                            return Date.UTC(+t[3], t[1] - 1, +t[2])
                        }
                    },
                    "dd/mm/YY": {
                        regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
                        parser: function(t) {
                            return Date.UTC(+t[3] + 2e3, t[2] - 1, +t[1])
                        },
                        alternative: "mm/dd/YY"
                    },
                    "mm/dd/YY": {
                        regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
                        parser: function(t) {
                            return Date.UTC(+t[3] + 2e3, t[1] - 1, +t[2])
                        }
                    }
                },
                parseDate: function(t) {
                    var e, i, o, n, r = this.options.parseDate,
                        a = this.options.dateFormat || this.dateFormat;
                    if (r) e = r(t);
                    else if ("string" == typeof t) {
                        if (a) o = this.dateFormats[a], (n = t.match(o.regex)) && (e = o.parser(n));
                        else
                            for (i in this.dateFormats)
                                if (o = this.dateFormats[i], n = t.match(o.regex)) {
                                    this.dateFormat = a = i, this.alternativeFormat = o.alternative, e = o.parser(n);
                                    break
                                }
                        n || ("object" == typeof(n = Date.parse(t)) && null !== n && n.getTime ? e = n.getTime() - 6e4 * n.getTimezoneOffset() : s(n) && (e = n - 6e4 * new Date(n).getTimezoneOffset()))
                    }
                    return e
                },
                rowsToColumns: function(t) {
                    var e, i, o, n, r;
                    if (t)
                        for (r = [], i = t.length, e = 0; e < i; e++)
                            for (n = t[e].length, o = 0; o < n; o++) r[o] || (r[o] = []), r[o][e] = t[e][o];
                    return r
                },
                parsed: function() {
                    if (this.options.parsed) return this.options.parsed.call(this, this.columns)
                },
                getFreeIndexes: function(t, e) {
                    var i, o, n, r = [],
                        a = [];
                    for (o = 0; o < t; o += 1) r.push(!0);
                    for (i = 0; i < e.length; i += 1)
                        for (n = e[i].getReferencedColumnIndexes(), o = 0; o < n.length; o += 1) r[n[o]] = !1;
                    for (o = 0; o < r.length; o += 1) r[o] && a.push(o);
                    return a
                },
                complete: function() {
                    var t, i, o, n, r, s, l, h, c, d, p, u, g = this.columns,
                        f = [],
                        m = this.options,
                        x = [];
                    if (f.length = g.length, m.complete || m.afterComplete) {
                        for (n = 0; n < g.length; n++) this.firstRowAsNames && (g[n].name = g[n].shift());
                        for (i = [], d = this.getFreeIndexes(g.length, this.valueCount.seriesBuilders), l = 0; l < this.valueCount.seriesBuilders.length; l++)(c = this.valueCount.seriesBuilders[l]).populateColumns(d) && x.push(c);
                        for (; d.length > 0;) {
                            for ((c = new e).addColumnReader(0, "x"), -1 !== (u = a(0, d)) && d.splice(u, 1), n = 0; n < this.valueCount.global; n++) c.addColumnReader(void 0, this.valueCount.globalPointArrayMap[n]);
                            c.populateColumns(d) && x.push(c)
                        }
                        if (x.length > 0 && x[0].readers.length > 0 && void 0 !== (p = g[x[0].readers[0].columnIndex]) && (p.isDatetime ? t = "datetime" : p.isNumeric || (t = "category")), "category" === t)
                            for (l = 0; l < x.length; l++)
                                for (c = x[l], s = 0; s < c.readers.length; s++) "x" === c.readers[s].configName && (c.readers[s].configName = "name");
                        for (l = 0; l < x.length; l++) {
                            for (c = x[l], o = [], r = 0; r < g[0].length; r++) o[r] = c.read(g, r);
                            i[l] = {
                                data: o
                            }, c.name && (i[l].name = c.name), "category" === t && (i[l].turboThreshold = 0)
                        }
                        h = {
                            series: i
                        }, t && (h.xAxis = {
                            type: t
                        }, "category" === t && (h.xAxis.uniqueNames = !1)), m.complete && m.complete(h), m.afterComplete && m.afterComplete(h)
                    }
                }
            }), t.Data = h, t.data = function(t, e) {
                return new h(t, e)
            }, t.wrap(t.Chart.prototype, "init", function(e, i, o) {
                var n = this;
                i && i.data ? t.data(t.extend(i.data, {
                    afterComplete: function(r) {
                        var a, s;
                        if (i.hasOwnProperty("series"))
                            if ("object" == typeof i.series)
                                for (a = Math.max(i.series.length, r.series.length); a--;) s = i.series[a] || {}, i.series[a] = t.merge(s, r.series[a]);
                            else delete i.series;
                        i = t.merge(r, i), e.call(n, i, o)
                    }
                }), i) : e.call(n, i, o)
            }), (e = function() {
                this.readers = [], this.pointIsArray = !0
            }).prototype.populateColumns = function(t) {
                var e = this,
                    i = !0;
                return o(e.readers, function(e) {
                    void 0 === e.columnIndex && (e.columnIndex = t.shift())
                }), o(e.readers, function(t) {
                    void 0 === t.columnIndex && (i = !1)
                }), i
            }, e.prototype.read = function(t, e) {
                var i, n = this,
                    r = n.pointIsArray,
                    a = r ? [] : {};
                return o(n.readers, function(i) {
                    var o = t[i.columnIndex][e];
                    r ? a.push(o) : a[i.configName] = o
                }), void 0 === this.name && n.readers.length >= 2 && (i = n.getReferencedColumnIndexes()).length >= 2 && (i.shift(), i.sort(), this.name = t[i.shift()].name), a
            }, e.prototype.addColumnReader = function(t, e) {
                this.readers.push({
                    columnIndex: t,
                    configName: e
                }), "x" !== e && "y" !== e && void 0 !== e && (this.pointIsArray = !1)
            }, e.prototype.getReferencedColumnIndexes = function() {
                var t, e, i = [];
                for (t = 0; t < this.readers.length; t += 1) void 0 !== (e = this.readers[t]).columnIndex && i.push(e.columnIndex);
                return i
            }, e.prototype.hasReader = function(t) {
                var e;
                for (e = 0; e < this.readers.length; e += 1)
                    if (this.readers[e].configName === t) return !0
            }
        }(e),
        function(t) {
            function e() {
                var t = this;
                t.hasData() ? t.hideNoData() : t.showNoData()
            }
            var i = t.seriesTypes,
                o = t.Chart.prototype,
                n = t.getOptions(),
                r = t.extend,
                a = t.each;
            r(n.lang, {
                noData: "No data to display"
            }), n.noData = {
                position: {
                    x: 0,
                    y: 0,
                    align: "center",
                    verticalAlign: "middle"
                }
            }, n.noData.style = {
                fontWeight: "bold",
                fontSize: "12px",
                color: "#666666"
            }, a(["bubble", "gauge", "heatmap", "pie", "treemap", "waterfall"], function(t) {
                i[t] && (i[t].prototype.hasData = function() {
                    return !!this.points.length
                })
            }), t.Series.prototype.hasData = function() {
                return this.visible && void 0 !== this.dataMax && void 0 !== this.dataMin
            }, o.showNoData = function(t) {
                var e = this,
                    i = e.options,
                    o = t || i.lang.noData,
                    n = i.noData;
                e.noDataLabel || (e.noDataLabel = e.renderer.label(o, 0, 0, null, null, null, n.useHTML, null, "no-data"), e.noDataLabel.attr(n.attr).css(n.style), e.noDataLabel.add(), e.noDataLabel.align(r(e.noDataLabel.getBBox(), n.position), !1, "plotBox"))
            }, o.hideNoData = function() {
                var t = this;
                t.noDataLabel && (t.noDataLabel = t.noDataLabel.destroy())
            }, o.hasData = function() {
                for (var t = this, e = t.series, i = e.length; i--;)
                    if (e[i].hasData() && !e[i].options.isInternal) return !0;
                return t.loadingShown
            }, o.callbacks.push(function(i) {
                t.addEvent(i, "load", e), t.addEvent(i, "redraw", e)
            })
        }(e),
        function(t) {
            var e = t.noop,
                i = t.color,
                o = t.defaultOptions,
                n = t.each,
                r = t.extend,
                a = t.format,
                s = t.objectEach,
                l = t.pick,
                h = t.wrap,
                c = t.Chart,
                d = t.seriesTypes,
                p = d.pie,
                u = d.column,
                g = t.Tick,
                f = t.fireEvent,
                m = t.inArray,
                x = 1;
            r(o.lang, {
                drillUpText: "â— Back to {series.name}"
            }), o.drilldown = {
                activeAxisLabelStyle: {
                    cursor: "pointer",
                    color: "#003399",
                    fontWeight: "bold",
                    textDecoration: "underline"
                },
                activeDataLabelStyle: {
                    cursor: "pointer",
                    color: "#003399",
                    fontWeight: "bold",
                    textDecoration: "underline"
                },
                animation: {
                    duration: 500
                },
                drillUpButton: {
                    position: {
                        align: "right",
                        x: -10,
                        y: 10
                    }
                }
            }, t.SVGRenderer.prototype.Element.prototype.fadeIn = function(t) {
                this.attr({
                    opacity: .1,
                    visibility: "inherit"
                }).animate({
                    opacity: l(this.newOpacity, 1)
                }, t || {
                    duration: 250
                })
            }, c.prototype.addSeriesAsDrilldown = function(t, e) {
                this.addSingleSeriesAsDrilldown(t, e), this.applyDrilldown()
            }, c.prototype.addSingleSeriesAsDrilldown = function(o, a) {
                var s, l, h, c, d, p, u = o.series,
                    g = u.xAxis,
                    f = u.yAxis,
                    v = [],
                    y = [];
                p = {
                    color: o.color || u.color
                }, this.drilldownLevels || (this.drilldownLevels = []), c = u.options._levelNumber || 0, (d = this.drilldownLevels[this.drilldownLevels.length - 1]) && d.levelNumber !== c && (d = void 0), a = r(r({
                    _ddSeriesId: x++
                }, p), a), l = m(o, u.points), n(u.chart.series, function(t) {
                    t.xAxis !== g || t.isDrilling || (t.options._ddSeriesId = t.options._ddSeriesId || x++, t.options._colorIndex = t.userOptions._colorIndex, t.options._levelNumber = t.options._levelNumber || c, d ? (v = d.levelSeries, y = d.levelSeriesOptions) : (v.push(t), y.push(t.options)))
                }), h = r({
                    levelNumber: c,
                    seriesOptions: u.options,
                    levelSeriesOptions: y,
                    levelSeries: v,
                    shapeArgs: o.shapeArgs,
                    bBox: o.graphic ? o.graphic.getBBox() : {},
                    color: o.isNull ? new t.Color(i).setOpacity(0).get() : i,
                    lowerSeriesOptions: a,
                    pointOptions: u.options.data[l],
                    pointIndex: l,
                    oldExtremes: {
                        xMin: g && g.userMin,
                        xMax: g && g.userMax,
                        yMin: f && f.userMin,
                        yMax: f && f.userMax
                    }
                }, p), this.drilldownLevels.push(h), g && g.names && (g.names.length = 0), (s = h.lowerSeries = this.addSeries(a, !1)).options._levelNumber = c + 1, g && (g.oldPos = g.pos, g.userMin = g.userMax = null, f.userMin = f.userMax = null), u.type === s.type && (s.animate = s.animateDrilldown || e, s.options.animation = !0)
            }, c.prototype.applyDrilldown = function() {
                var t, e = this.drilldownLevels;
                e && e.length > 0 && (t = e[e.length - 1].levelNumber, n(this.drilldownLevels, function(e) {
                    e.levelNumber === t && n(e.levelSeries, function(e) {
                        e.options && e.options._levelNumber === t && e.remove(!1)
                    })
                })), this.redraw(), this.showDrillUpButton()
            }, c.prototype.getDrilldownBackText = function() {
                var t, e = this.drilldownLevels;
                if (e && e.length > 0) return t = e[e.length - 1], t.series = t.seriesOptions, a(this.options.lang.drillUpText, t)
            }, c.prototype.showDrillUpButton = function() {
                var t, e, i = this,
                    o = this.getDrilldownBackText(),
                    n = i.options.drilldown.drillUpButton;
                this.drillUpButton ? this.drillUpButton.attr({
                    text: o
                }).align() : (e = (t = n.theme) && t.states, this.drillUpButton = this.renderer.button(o, null, null, function() {
                    i.drillUp()
                }, t, e && e.hover, e && e.select).addClass("highcharts-drillup-button").attr({
                    align: n.position.align,
                    zIndex: 7
                }).add().align(n.position, !1, n.relativeTo || "plotBox"))
            }, c.prototype.drillUp = function() {
                for (var t, e, i, o, r, a = this, s = a.drilldownLevels, l = s[s.length - 1].levelNumber, h = s.length, c = a.series, d = function(t) {
                        var r;
                        n(c, function(e) {
                            e.options._ddSeriesId === t._ddSeriesId && (r = e)
                        }), (r = r || a.addSeries(t, !1)).type === i.type && r.animateDrillupTo && (r.animate = r.animateDrillupTo), t === e.seriesOptions && (o = r)
                    }; h--;)
                    if ((e = s[h]).levelNumber === l) {
                        if (s.pop(), !(i = e.lowerSeries).chart)
                            for (t = c.length; t--;)
                                if (c[t].options.id === e.lowerSeriesOptions.id && c[t].options._levelNumber === l + 1) {
                                    i = c[t];
                                    break
                                }
                        i.xData = [], n(e.levelSeriesOptions, d), f(a, "drillup", {
                            seriesOptions: e.seriesOptions
                        }), o.type === i.type && (o.drilldownLevel = e, o.options.animation = a.options.drilldown.animation, i.animateDrillupFrom && i.chart && i.animateDrillupFrom(e)), o.options._levelNumber = l, i.remove(!1), o.xAxis && (r = e.oldExtremes, o.xAxis.setExtremes(r.xMin, r.xMax, !1), o.yAxis.setExtremes(r.yMin, r.yMax, !1))
                    }
                f(a, "drillupall"), this.redraw(), 0 === this.drilldownLevels.length ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({
                    text: this.getDrilldownBackText()
                }).align(), this.ddDupes.length = []
            }, u.prototype.supportsDrilldown = !0, u.prototype.animateDrillupTo = function(t) {
                if (!t) {
                    var i = this,
                        o = i.drilldownLevel;
                    n(this.points, function(t) {
                        var e = t.dataLabel;
                        t.graphic && t.graphic.hide(), e && (e.hidden = "hidden" === e.attr("visibility"), e.hidden || (e.hide(), t.connector && t.connector.hide()))
                    }), setTimeout(function() {
                        i.points && n(i.points, function(t, e) {
                            var i = e === (o && o.pointIndex) ? "show" : "fadeIn",
                                n = "show" === i || void 0,
                                r = t.dataLabel;
                            t.graphic && t.graphic[i](n), r && !r.hidden && (r[i](n), t.connector && t.connector[i](n))
                        })
                    }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0)), this.animate = e
                }
            }, u.prototype.animateDrilldown = function(t) {
                var e, i = this,
                    o = this.chart.drilldownLevels,
                    a = this.chart.options.drilldown.animation,
                    s = this.xAxis;
                t || (n(o, function(t) {
                    i.options._ddSeriesId === t.lowerSeriesOptions._ddSeriesId && ((e = t.shapeArgs).fill = t.color)
                }), e.x += l(s.oldPos, s.pos) - s.pos, n(this.points, function(t) {
                    t.shapeArgs.fill = t.color, t.graphic && t.graphic.attr(e).animate(r(t.shapeArgs, {
                        fill: t.color || i.color
                    }), a), t.dataLabel && t.dataLabel.fadeIn(a)
                }), this.animate = null)
            }, u.prototype.animateDrillupFrom = function(e) {
                var i = this.chart.options.drilldown.animation,
                    o = this.group,
                    r = o !== this.chart.seriesGroup,
                    a = this;
                n(a.trackerGroups, function(t) {
                    a[t] && a[t].on("mouseover")
                }), r && delete this.group, n(this.points, function(n) {
                    var a = n.graphic,
                        s = e.shapeArgs,
                        l = function() {
                            a.destroy(), o && r && (o = o.destroy())
                        };
                    a && (delete n.graphic, s.fill = e.color, i ? a.animate(s, t.merge(i, {
                        complete: l
                    })) : (a.attr(s), l()))
                })
            }, p && r(p.prototype, {
                supportsDrilldown: !0,
                animateDrillupTo: u.prototype.animateDrillupTo,
                animateDrillupFrom: u.prototype.animateDrillupFrom,
                animateDrilldown: function(e) {
                    var i = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                        o = this.chart.options.drilldown.animation,
                        r = i.shapeArgs,
                        a = r.start,
                        s = (r.end - a) / this.points.length;
                    e || (n(this.points, function(e, n) {
                        var l = e.shapeArgs;
                        r.fill = i.color, l.fill = e.color, e.graphic && e.graphic.attr(t.merge(r, {
                            start: a + n * s,
                            end: a + (n + 1) * s
                        }))[o ? "animate" : "attr"](l, o)
                    }), this.animate = null)
                }
            }), t.Point.prototype.doDrilldown = function(t, e, i) {
                var o, n = this.series.chart,
                    r = n.options.drilldown,
                    a = (r.series || []).length;
                for (n.ddDupes || (n.ddDupes = []); a-- && !o;) r.series[a].id === this.drilldown && -1 === m(this.drilldown, n.ddDupes) && (o = r.series[a], n.ddDupes.push(this.drilldown));
                f(n, "drilldown", {
                    point: this,
                    seriesOptions: o,
                    category: e,
                    originalEvent: i,
                    points: void 0 !== e && this.series.xAxis.getDDPoints(e).slice(0)
                }, function(e) {
                    var i = e.point.series && e.point.series.chart,
                        o = e.seriesOptions;
                    i && o && (t ? i.addSingleSeriesAsDrilldown(e.point, o) : i.addSeriesAsDrilldown(e.point, o))
                })
            }, t.Axis.prototype.drilldownCategory = function(t, e) {
                s(this.getDDPoints(t), function(i) {
                    i && i.series && i.series.visible && i.doDrilldown && i.doDrilldown(!0, t, e)
                }), this.chart.applyDrilldown()
            }, t.Axis.prototype.getDDPoints = function(t) {
                var e = [];
                return n(this.series, function(i) {
                    var o, n = i.xData,
                        r = i.points;
                    for (o = 0; o < n.length; o++)
                        if (n[o] === t && i.options.data[o] && i.options.data[o].drilldown) {
                            e.push(!r || r[o]);
                            break
                        }
                }), e
            }, g.prototype.drillable = function() {
                var e = this.pos,
                    i = this.label,
                    o = this.axis,
                    n = "xAxis" === o.coll && o.getDDPoints,
                    r = n && o.getDDPoints(e);
                n && (i && r.length ? (i.drillable = !0, i.basicStyles || (i.basicStyles = t.merge(i.styles)), i.addClass("highcharts-drilldown-axis-label").css(o.chart.options.drilldown.activeAxisLabelStyle).on("click", function(t) {
                    o.drilldownCategory(e, t)
                })) : i && i.drillable && (i.styles = {}, i.css(i.basicStyles), i.on("click", null), i.removeClass("highcharts-drilldown-axis-label")))
            }, h(g.prototype, "addLabel", function(t) {
                t.call(this), this.drillable()
            }), h(t.Point.prototype, "init", function(e, i, o, n) {
                var r = e.call(this, i, o, n),
                    a = i.xAxis,
                    s = a && a.ticks[n];
                return r.drilldown && t.addEvent(r, "click", function(t) {
                    i.xAxis && !1 === i.chart.options.drilldown.allowPointDrilldown ? i.xAxis.drilldownCategory(r.x, t) : r.doDrilldown(void 0, void 0, t)
                }), s && s.drillable(), r
            }), h(t.Series.prototype, "drawDataLabels", function(t) {
                var e = this.chart.options.drilldown.activeDataLabelStyle,
                    i = this.chart.renderer;
                t.call(this), n(this.points, function(t) {
                    var o = {};
                    t.drilldown && t.dataLabel && ("contrast" === e.color && (o.color = i.getContrast(t.color || this.color)), t.dataLabel.addClass("highcharts-drilldown-data-label"), t.dataLabel.css(e).css(o))
                }, this)
            });
            var v = function(t) {
                t.call(this), n(this.points, function(t) {
                    t.drilldown && t.graphic && (t.graphic.addClass("highcharts-drilldown-point"), t.graphic.css({
                        cursor: "pointer"
                    }))
                })
            };
            s(d, function(t) {
                t.prototype.supportsDrilldown && h(t.prototype, "drawTracker", v)
            })
        }(e),
        function(t) {
            var e, i = t.pInt,
                o = t.pick,
                n = t.each,
                r = t.isNumber;
            (0, t.wrap)(t.Renderer.prototype.symbols, "arc", function(t, e, i, o, n, r) {
                var a = t(e, i, o, n, r);
                if (r.rounded) {
                    var s = ((r.r || o) - r.innerR) / 2,
                        l = ["A", s, s, 0, 1, 1, a[1], a[2]],
                        h = ["A", s, s, 0, 1, 1, a[12], a[13]];
                    a.splice.apply(a, [a.length - 1, 0].concat(l)), a.splice.apply(a, [11, 3].concat(h))
                }
                return a
            }), e = {
                initDataClasses: function(e) {
                    var i, o = this.chart,
                        r = 0,
                        a = this.options;
                    this.dataClasses = i = [], n(e.dataClasses, function(n, s) {
                        var l;
                        n = t.merge(n), i.push(n), n.color || ("category" === a.dataClassColor ? (l = o.options.colors, n.color = l[r++], r === l.length && (r = 0)) : n.color = t.color(a.minColor).tweenTo(t.color(a.maxColor), s / (e.dataClasses.length - 1)))
                    })
                },
                initStops: function(e) {
                    this.stops = e.stops || [
                        [0, this.options.minColor],
                        [1, this.options.maxColor]
                    ], n(this.stops, function(e) {
                        e.color = t.color(e[1])
                    })
                },
                toColor: function(t, e) {
                    var i, o, n, r, a, s, l = this.stops,
                        h = this.dataClasses;
                    if (h) {
                        for (s = h.length; s--;)
                            if (a = h[s], o = a.from, n = a.to, (void 0 === o || t >= o) && (void 0 === n || t <= n)) {
                                r = a.color, e && (e.dataClass = s);
                                break
                            }
                    } else {
                        for (this.isLog && (t = this.val2lin(t)), i = 1 - (this.max - t) / (this.max - this.min), s = l.length; s-- && !(i > l[s][0]););
                        o = l[s] || l[s + 1], i = 1 - ((n = l[s + 1] || o)[0] - i) / (n[0] - o[0] || 1), r = o.color.tweenTo(n.color, i)
                    }
                    return r
                }
            }, t.seriesType("solidgauge", "gauge", {
                colorByPoint: !0
            }, {
                translate: function() {
                    var i = this.yAxis;
                    t.extend(i, e), !i.dataClasses && i.options.dataClasses && i.initDataClasses(i.options), i.initStops(i.options), t.seriesTypes.gauge.prototype.translate.call(this)
                },
                drawPoints: function() {
                    var e, a = this,
                        s = a.yAxis,
                        l = s.center,
                        h = a.options,
                        c = a.chart.renderer,
                        d = h.overshoot,
                        p = r(d) ? d / 180 * Math.PI : 0;
                    r(h.threshold) && (e = s.startAngleRad + s.translate(h.threshold, null, null, null, !0)), this.thresholdAngleRad = o(e, s.startAngleRad), n(a.points, function(e) {
                        var n, r, d, u, g = e.graphic,
                            f = s.startAngleRad + s.translate(e.y, null, null, null, !0),
                            m = i(o(e.options.radius, h.radius, 100)) * l[2] / 200,
                            x = i(o(e.options.innerRadius, h.innerRadius, 60)) * l[2] / 200,
                            v = s.toColor(e.y, e),
                            y = Math.min(s.startAngleRad, s.endAngleRad),
                            b = Math.max(s.startAngleRad, s.endAngleRad);
                        "none" === v && (v = e.color || a.color || "none"), "none" !== v && (e.color = v), f = Math.max(y - p, Math.min(b + p, f)), !1 === h.wrap && (f = Math.max(y, Math.min(b, f))), d = Math.min(f, a.thresholdAngleRad), (u = Math.max(f, a.thresholdAngleRad)) - d > 2 * Math.PI && (u = d + 2 * Math.PI), e.shapeArgs = n = {
                            x: l[0],
                            y: l[1],
                            r: m,
                            innerR: x,
                            start: d,
                            end: u,
                            rounded: h.rounded
                        }, e.startR = m, g ? (r = n.d, g.animate(t.extend({
                            fill: v
                        }, n)), r && (n.d = r)) : (e.graphic = c.arc(n).addClass(e.getClassName(), !0).attr({
                            fill: v,
                            "sweep-flag": 0
                        }).add(a.group), "square" !== h.linecap && e.graphic.attr({
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                        }), e.graphic.attr({
                            stroke: h.borderColor || "none",
                            "stroke-width": h.borderWidth || 0
                        }))
                    })
                },
                animate: function(e) {
                    e || (this.startAngleRad = this.thresholdAngleRad, t.seriesTypes.pie.prototype.animate.call(this, e))
                }
            })
        }(e),
        function(t) {
            var e, i = t.Axis,
                o = t.Chart,
                n = t.color,
                r = t.each,
                a = t.extend,
                s = t.isNumber,
                l = t.Legend,
                h = t.LegendSymbolMixin,
                c = t.noop,
                d = t.merge,
                p = t.pick,
                u = t.wrap;
            e = t.ColorAxis = function() {
                this.init.apply(this, arguments)
            }, a(e.prototype, i.prototype), a(e.prototype, {
                defaultColorAxisOptions: {
                    lineWidth: 0,
                    minPadding: 0,
                    maxPadding: 0,
                    gridLineWidth: 1,
                    tickPixelInterval: 72,
                    startOnTick: !0,
                    endOnTick: !0,
                    offset: 0,
                    marker: {
                        animation: {
                            duration: 50
                        },
                        width: .01,
                        color: "#999999"
                    },
                    labels: {
                        overflow: "justify",
                        rotation: 0
                    },
                    minColor: "#e6ebf5",
                    maxColor: "#003399",
                    tickLength: 5,
                    showInLegend: !0
                },
                keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(i.prototype.keepProps),
                init: function(t, e) {
                    var o, n = "vertical" !== t.options.legend.layout;
                    this.coll = "colorAxis", o = d(this.defaultColorAxisOptions, {
                        side: n ? 2 : 1,
                        reversed: !n
                    }, e, {
                        opposite: !n,
                        showEmpty: !1,
                        title: null
                    }), i.prototype.init.call(this, t, o), e.dataClasses && this.initDataClasses(e), this.initStops(), this.horiz = n, this.zoomEnabled = !1, this.defaultLegendLength = 200
                },
                initDataClasses: function(t) {
                    var e, i = this.chart,
                        o = 0,
                        a = i.options.chart.colorCount,
                        s = this.options,
                        l = t.dataClasses.length;
                    this.dataClasses = e = [], this.legendItems = [], r(t.dataClasses, function(t, r) {
                        var h;
                        t = d(t), e.push(t), t.color || ("category" === s.dataClassColor ? (h = i.options.colors, a = h.length, t.color = h[o], t.colorIndex = o, ++o === a && (o = 0)) : t.color = n(s.minColor).tweenTo(n(s.maxColor), l < 2 ? .5 : r / (l - 1)))
                    })
                },
                initStops: function() {
                    this.stops = this.options.stops || [
                        [0, this.options.minColor],
                        [1, this.options.maxColor]
                    ], r(this.stops, function(t) {
                        t.color = n(t[1])
                    })
                },
                setOptions: function(t) {
                    i.prototype.setOptions.call(this, t), this.options.crosshair = this.options.marker
                },
                setAxisSize: function() {
                    var t, e, i, o, n = this.legendSymbol,
                        r = this.chart,
                        a = r.options.legend || {};
                    n ? (this.left = t = n.attr("x"), this.top = e = n.attr("y"), this.width = i = n.attr("width"), this.height = o = n.attr("height"), this.right = r.chartWidth - t - i, this.bottom = r.chartHeight - e - o, this.len = this.horiz ? i : o, this.pos = this.horiz ? t : e) : this.len = (this.horiz ? a.symbolWidth : a.symbolHeight) || this.defaultLegendLength
                },
                normalizedValue: function(t) {
                    return this.isLog && (t = this.val2lin(t)), 1 - (this.max - t) / (this.max - this.min || 1)
                },
                toColor: function(t, e) {
                    var i, o, n, r, a, s, l = this.stops,
                        h = this.dataClasses;
                    if (h) {
                        for (s = h.length; s--;)
                            if (a = h[s], o = a.from, n = a.to, (void 0 === o || t >= o) && (void 0 === n || t <= n)) {
                                r = a.color, e && (e.dataClass = s, e.colorIndex = a.colorIndex);
                                break
                            }
                    } else {
                        for (i = this.normalizedValue(t), s = l.length; s-- && !(i > l[s][0]););
                        o = l[s] || l[s + 1], i = 1 - ((n = l[s + 1] || o)[0] - i) / (n[0] - o[0] || 1), r = o.color.tweenTo(n.color, i)
                    }
                    return r
                },
                getOffset: function() {
                    var t = this.legendGroup,
                        e = this.chart.axisOffset[this.side];
                    t && (this.axisParent = t, i.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = e)
                },
                setLegendColor: function() {
                    var t, e = this.horiz,
                        i = this.reversed,
                        o = i ? 1 : 0,
                        n = i ? 0 : 1;
                    t = e ? [o, 0, n, 0] : [0, n, 0, o], this.legendColor = {
                        linearGradient: {
                            x1: t[0],
                            y1: t[1],
                            x2: t[2],
                            y2: t[3]
                        },
                        stops: this.stops
                    }
                },
                drawLegendSymbol: function(t, e) {
                    var i = t.padding,
                        o = t.options,
                        n = this.horiz,
                        r = p(o.symbolWidth, n ? this.defaultLegendLength : 12),
                        a = p(o.symbolHeight, n ? 12 : this.defaultLegendLength),
                        s = p(o.labelPadding, n ? 16 : 30),
                        l = p(o.itemDistance, 10);
                    this.setLegendColor(), e.legendSymbol = this.chart.renderer.rect(0, t.baseline - 11, r, a).attr({
                        zIndex: 1
                    }).add(e.legendGroup), this.legendItemWidth = r + i + (n ? l : s), this.legendItemHeight = a + i + (n ? s : 0)
                },
                setState: c,
                visible: !0,
                setVisible: c,
                getSeriesExtremes: function() {
                    var t = this.series,
                        e = t.length;
                    for (this.dataMin = 1 / 0, this.dataMax = -1 / 0; e--;) void 0 !== t[e].valueMin && (this.dataMin = Math.min(this.dataMin, t[e].valueMin), this.dataMax = Math.max(this.dataMax, t[e].valueMax))
                },
                drawCrosshair: function(t, e) {
                    var o, n = e && e.plotX,
                        r = e && e.plotY,
                        a = this.pos,
                        s = this.len;
                    e && ((o = this.toPixels(e[e.series.colorKey])) < a ? o = a - 2 : o > a + s && (o = a + s + 2), e.plotX = o, e.plotY = this.len - o, i.prototype.drawCrosshair.call(this, t, e), e.plotX = n, e.plotY = r, this.cross && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.attr({
                        fill: this.crosshair.color
                    })))
                },
                getPlotLinePath: function(t, e, o, n, r) {
                    return s(r) ? this.horiz ? ["M", r - 4, this.top - 6, "L", r + 4, this.top - 6, r, this.top, "Z"] : ["M", this.left, r, "L", this.left - 6, r + 6, this.left - 6, r - 6, "Z"] : i.prototype.getPlotLinePath.call(this, t, e, o, n)
                },
                update: function(t, e) {
                    var o = this.chart,
                        n = o.legend;
                    r(this.series, function(t) {
                        t.isDirtyData = !0
                    }), t.dataClasses && n.allItems && (r(n.allItems, function(t) {
                        t.isDataClass && t.legendGroup && t.legendGroup.destroy()
                    }), o.isDirtyLegend = !0), o.options[this.coll] = d(this.userOptions, t), i.prototype.update.call(this, t, e), this.legendItem && (this.setLegendColor(), n.colorizeItem(this, !0))
                },
                remove: function() {
                    this.legendItem && this.chart.legend.destroyItem(this), i.prototype.remove.call(this)
                },
                getDataClassLegendSymbols: function() {
                    var e, i = this,
                        o = this.chart,
                        n = this.legendItems,
                        s = o.options.legend,
                        l = s.valueDecimals,
                        d = s.valueSuffix || "";
                    return n.length || r(this.dataClasses, function(s, p) {
                        var u = !0,
                            g = s.from,
                            f = s.to;
                        e = "", void 0 === g ? e = "< " : void 0 === f && (e = "> "), void 0 !== g && (e += t.numberFormat(g, l) + d), void 0 !== g && void 0 !== f && (e += " - "), void 0 !== f && (e += t.numberFormat(f, l) + d), n.push(a({
                            chart: o,
                            name: e,
                            options: {},
                            drawLegendSymbol: h.drawRectangle,
                            visible: !0,
                            setState: c,
                            isDataClass: !0,
                            setVisible: function() {
                                u = this.visible = !u, r(i.series, function(t) {
                                    r(t.points, function(t) {
                                        t.dataClass === p && t.setVisible(u)
                                    })
                                }), o.legend.colorizeItem(this, u)
                            }
                        }, s))
                    }), n
                },
                name: ""
            }), r(["fill", "stroke"], function(e) {
                t.Fx.prototype[e + "Setter"] = function() {
                    this.elem.attr(e, n(this.start).tweenTo(n(this.end), this.pos), null, !0)
                }
            }), u(o.prototype, "getAxes", function(t) {
                var i = this.options.colorAxis;
                t.call(this), this.colorAxis = [], i && new e(this, i)
            }), u(l.prototype, "getAllItems", function(t) {
                var e = [],
                    i = this.chart.colorAxis[0];
                return i && i.options && (i.options.showInLegend && (i.options.dataClasses ? e = e.concat(i.getDataClassLegendSymbols()) : e.push(i)), r(i.series, function(t) {
                    t.options.showInLegend = !1
                })), e.concat(t.call(this))
            }), u(l.prototype, "colorizeItem", function(t, e, i) {
                t.call(this, e, i), i && e.legendColor && e.legendSymbol.attr({
                    fill: e.legendColor
                })
            })
        }(e),
        function(t) {
            var e = t.defined,
                i = t.each,
                o = t.noop,
                n = t.seriesTypes;
            t.colorPointMixin = {
                isValid: function() {
                    return null !== this.value
                },
                setVisible: function(t) {
                    var e = this,
                        o = t ? "show" : "hide";
                    i(["graphic", "dataLabel"], function(t) {
                        e[t] && e[t][o]()
                    })
                },
                setState: function(e) {
                    t.Point.prototype.setState.call(this, e), this.graphic && this.graphic.attr({
                        zIndex: "hover" === e ? 1 : 0
                    })
                }
            }, t.colorSeriesMixin = {
                pointArrayMap: ["value"],
                axisTypes: ["xAxis", "yAxis", "colorAxis"],
                optionalAxis: "colorAxis",
                trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
                getSymbol: o,
                parallelArrays: ["x", "y", "value"],
                colorKey: "value",
                pointAttribs: n.column.prototype.pointAttribs,
                translateColors: function() {
                    var t = this,
                        e = this.options.nullColor,
                        o = this.colorAxis,
                        n = this.colorKey;
                    i(this.data, function(i) {
                        var r, a = i[n];
                        (r = i.options.color || (i.isNull ? e : o && void 0 !== a ? o.toColor(a, i) : i.color || t.color)) && (i.color = r)
                    })
                },
                colorAttribs: function(t) {
                    var i = {};
                    return e(t.color) && (i[this.colorProp || "fill"] = t.color), i
                }
            }
        }(e),
        function(t) {
            var e = t.colorPointMixin,
                i = t.colorSeriesMixin,
                o = t.each,
                n = t.LegendSymbolMixin,
                r = t.merge,
                a = t.noop,
                s = t.pick,
                l = t.Series,
                h = t.seriesType,
                c = t.seriesTypes;
            h("heatmap", "scatter", {
                animation: !1,
                borderWidth: 0,
                nullColor: "#f7f7f7",
                dataLabels: {
                    formatter: function() {
                        return this.point.value
                    },
                    inside: !0,
                    verticalAlign: "middle",
                    crop: !1,
                    overflow: !1,
                    padding: 0
                },
                marker: null,
                pointRange: null,
                tooltip: {
                    pointFormat: "{point.x}, {point.y}: {point.value}<br/>"
                },
                states: {
                    normal: {
                        animation: !0
                    },
                    hover: {
                        halo: !1,
                        brightness: .2
                    }
                }
            }, r(i, {
                pointArrayMap: ["y", "value"],
                hasPointSpecificOptions: !0,
                supportsDrilldown: !0,
                getExtremesFromAll: !0,
                directTouch: !0,
                init: function() {
                    var t;
                    c.scatter.prototype.init.apply(this, arguments), (t = this.options).pointRange = s(t.pointRange, t.colsize || 1), this.yAxis.axisPointRange = t.rowsize || 1
                },
                translate: function() {
                    var t = this,
                        e = t.options,
                        i = t.xAxis,
                        n = t.yAxis,
                        r = function(t, e, i) {
                            return Math.min(Math.max(e, t), i)
                        };
                    t.generatePoints(), o(t.points, function(t) {
                        var o = (e.colsize || 1) / 2,
                            a = (e.rowsize || 1) / 2,
                            s = r(Math.round(i.len - i.translate(t.x - o, 0, 1, 0, 1)), -i.len, 2 * i.len),
                            l = r(Math.round(i.len - i.translate(t.x + o, 0, 1, 0, 1)), -i.len, 2 * i.len),
                            h = r(Math.round(n.translate(t.y - a, 0, 1, 0, 1)), -n.len, 2 * n.len),
                            c = r(Math.round(n.translate(t.y + a, 0, 1, 0, 1)), -n.len, 2 * n.len);
                        t.plotX = t.clientX = (s + l) / 2, t.plotY = (h + c) / 2, t.shapeType = "rect", t.shapeArgs = {
                            x: Math.min(s, l),
                            y: Math.min(h, c),
                            width: Math.abs(l - s),
                            height: Math.abs(c - h)
                        }
                    }), t.translateColors()
                },
                drawPoints: function() {
                    c.column.prototype.drawPoints.call(this), o(this.points, function(t) {
                        t.graphic.attr(this.colorAttribs(t))
                    }, this)
                },
                animate: a,
                getBox: a,
                drawLegendSymbol: n.drawRectangle,
                alignDataLabel: c.column.prototype.alignDataLabel,
                getExtremes: function() {
                    l.prototype.getExtremes.call(this, this.valueData), this.valueMin = this.dataMin, this.valueMax = this.dataMax, l.prototype.getExtremes.call(this)
                }
            }), e)
        }(e), e
});
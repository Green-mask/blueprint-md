import { c as createLucideIcon, g as getDefaultExportFromCjs, a as commonjsGlobal, r as reactExports, o, b as reactDomExports, j as jsxRuntimeExports, d as cn } from "./index-P75cKx3Q.js";
import { S as Search, X, B as Button, a as Badge, R as Root, C as Content, b as Close, T as Title, P as Portal, O as Overlay, L as Label, I as Input, c as Textarea, u as useCreatePlot, d as useSaveDraftPlot, e as ue } from "./index-BgKRUM4J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
const EARTH_RADIUS_M = 6371e3;
function toRad(deg) {
  return deg * Math.PI / 180;
}
function calculateDistance(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const haversine = sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return EARTH_RADIUS_M * c;
}
function calculateArea(waypoints) {
  const n = waypoints.length;
  if (n < 3) return 0;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = toRad(waypoints[i].lon);
    const xj = toRad(waypoints[j].lon);
    const yi = Math.log(Math.tan(Math.PI / 4 + toRad(waypoints[i].lat) / 2));
    const yj = Math.log(Math.tan(Math.PI / 4 + toRad(waypoints[j].lat) / 2));
    area += (xj - xi) * (yj + yi);
  }
  const meanLat = waypoints.reduce((sum, wp) => sum + wp.lat, 0) / n;
  const cosLat = Math.cos(toRad(meanLat));
  const areaRad = Math.abs(area) / 2;
  return areaRad * EARTH_RADIUS_M * EARTH_RADIUS_M * cosLat;
}
function calculatePerimeter(waypoints, closed = true) {
  const n = waypoints.length;
  if (n < 2) return 0;
  let total = 0;
  for (let i = 0; i < n - 1; i++) {
    total += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  if (closed && n >= 3) {
    total += calculateDistance(waypoints[n - 1], waypoints[0]);
  }
  return total;
}
function calculateCentroid(waypoints) {
  const n = waypoints.length;
  if (n === 0) return null;
  const lat = waypoints.reduce((s, p) => s + p.lat, 0) / n;
  const lon = waypoints.reduce((s, p) => s + p.lon, 0) / n;
  return { lat, lon };
}
function midpoint(a, b) {
  return { lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2 };
}
function sqmToHectares(sqm) {
  return sqm / 1e4;
}
function sqmToAcres(sqm) {
  return sqm / 4046.8564224;
}
function metersToFeet(m) {
  return m * 3.28084;
}
function hasMoved(a, b, thresholdM = 3) {
  if (!a || !b) return false;
  return calculateDistance(a, b) >= thresholdM;
}
function formatDistance(m) {
  if (m < 1e3) return `${m.toFixed(1)} m`;
  return `${(m / 1e3).toFixed(3)} km`;
}
function geoPositionToWaypoint(pos, sequence) {
  return {
    lat: pos.lat,
    lon: pos.lon,
    accuracy: pos.accuracy,
    timestamp: BigInt(Math.floor(pos.timestamp)) * 1000000n,
    sequence: BigInt(sequence)
  };
}
var leafletSrc = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(module, exports$1) {
  (function(global, factory) {
    factory(exports$1);
  })(commonjsGlobal, function(exports$12) {
    var version = "1.9.4";
    function extend(dest) {
      var i, j, len, src;
      for (j = 1, len = arguments.length; j < len; j++) {
        src = arguments[j];
        for (i in src) {
          dest[i] = src[i];
        }
      }
      return dest;
    }
    var create$2 = Object.create || /* @__PURE__ */ function() {
      function F() {
      }
      return function(proto) {
        F.prototype = proto;
        return new F();
      };
    }();
    function bind(fn, obj) {
      var slice = Array.prototype.slice;
      if (fn.bind) {
        return fn.bind.apply(fn, slice.call(arguments, 1));
      }
      var args = slice.call(arguments, 2);
      return function() {
        return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
      };
    }
    var lastId = 0;
    function stamp(obj) {
      if (!("_leaflet_id" in obj)) {
        obj["_leaflet_id"] = ++lastId;
      }
      return obj._leaflet_id;
    }
    function throttle(fn, time2, context) {
      var lock, args, wrapperFn, later;
      later = function() {
        lock = false;
        if (args) {
          wrapperFn.apply(context, args);
          args = false;
        }
      };
      wrapperFn = function() {
        if (lock) {
          args = arguments;
        } else {
          fn.apply(context, arguments);
          setTimeout(later, time2);
          lock = true;
        }
      };
      return wrapperFn;
    }
    function wrapNum(x, range, includeMax) {
      var max = range[1], min = range[0], d = max - min;
      return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
    }
    function falseFn() {
      return false;
    }
    function formatNum(num, precision) {
      if (precision === false) {
        return num;
      }
      var pow = Math.pow(10, precision === void 0 ? 6 : precision);
      return Math.round(num * pow) / pow;
    }
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function splitWords(str) {
      return trim(str).split(/\s+/);
    }
    function setOptions(obj, options) {
      if (!Object.prototype.hasOwnProperty.call(obj, "options")) {
        obj.options = obj.options ? create$2(obj.options) : {};
      }
      for (var i in options) {
        obj.options[i] = options[i];
      }
      return obj.options;
    }
    function getParamString(obj, existingUrl, uppercase) {
      var params = [];
      for (var i in obj) {
        params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + "=" + encodeURIComponent(obj[i]));
      }
      return (!existingUrl || existingUrl.indexOf("?") === -1 ? "?" : "&") + params.join("&");
    }
    var templateRe = /\{ *([\w_ -]+) *\}/g;
    function template(str, data) {
      return str.replace(templateRe, function(str2, key) {
        var value = data[key];
        if (value === void 0) {
          throw new Error("No value provided for variable " + str2);
        } else if (typeof value === "function") {
          value = value(data);
        }
        return value;
      });
    }
    var isArray = Array.isArray || function(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    };
    function indexOf(array, el) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] === el) {
          return i;
        }
      }
      return -1;
    }
    var emptyImageUrl = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function getPrefixed(name) {
      return window["webkit" + name] || window["moz" + name] || window["ms" + name];
    }
    var lastTime = 0;
    function timeoutDefer(fn) {
      var time2 = +/* @__PURE__ */ new Date(), timeToCall = Math.max(0, 16 - (time2 - lastTime));
      lastTime = time2 + timeToCall;
      return window.setTimeout(fn, timeToCall);
    }
    var requestFn = window.requestAnimationFrame || getPrefixed("RequestAnimationFrame") || timeoutDefer;
    var cancelFn = window.cancelAnimationFrame || getPrefixed("CancelAnimationFrame") || getPrefixed("CancelRequestAnimationFrame") || function(id2) {
      window.clearTimeout(id2);
    };
    function requestAnimFrame(fn, context, immediate) {
      if (immediate && requestFn === timeoutDefer) {
        fn.call(context);
      } else {
        return requestFn.call(window, bind(fn, context));
      }
    }
    function cancelAnimFrame(id2) {
      if (id2) {
        cancelFn.call(window, id2);
      }
    }
    var Util = {
      __proto__: null,
      extend,
      create: create$2,
      bind,
      get lastId() {
        return lastId;
      },
      stamp,
      throttle,
      wrapNum,
      falseFn,
      formatNum,
      trim,
      splitWords,
      setOptions,
      getParamString,
      template,
      isArray,
      indexOf,
      emptyImageUrl,
      requestFn,
      cancelFn,
      requestAnimFrame,
      cancelAnimFrame
    };
    function Class() {
    }
    Class.extend = function(props) {
      var NewClass = function() {
        setOptions(this);
        if (this.initialize) {
          this.initialize.apply(this, arguments);
        }
        this.callInitHooks();
      };
      var parentProto = NewClass.__super__ = this.prototype;
      var proto = create$2(parentProto);
      proto.constructor = NewClass;
      NewClass.prototype = proto;
      for (var i in this) {
        if (Object.prototype.hasOwnProperty.call(this, i) && i !== "prototype" && i !== "__super__") {
          NewClass[i] = this[i];
        }
      }
      if (props.statics) {
        extend(NewClass, props.statics);
      }
      if (props.includes) {
        checkDeprecatedMixinEvents(props.includes);
        extend.apply(null, [proto].concat(props.includes));
      }
      extend(proto, props);
      delete proto.statics;
      delete proto.includes;
      if (proto.options) {
        proto.options = parentProto.options ? create$2(parentProto.options) : {};
        extend(proto.options, props.options);
      }
      proto._initHooks = [];
      proto.callInitHooks = function() {
        if (this._initHooksCalled) {
          return;
        }
        if (parentProto.callInitHooks) {
          parentProto.callInitHooks.call(this);
        }
        this._initHooksCalled = true;
        for (var i2 = 0, len = proto._initHooks.length; i2 < len; i2++) {
          proto._initHooks[i2].call(this);
        }
      };
      return NewClass;
    };
    Class.include = function(props) {
      var parentOptions = this.prototype.options;
      extend(this.prototype, props);
      if (props.options) {
        this.prototype.options = parentOptions;
        this.mergeOptions(props.options);
      }
      return this;
    };
    Class.mergeOptions = function(options) {
      extend(this.prototype.options, options);
      return this;
    };
    Class.addInitHook = function(fn) {
      var args = Array.prototype.slice.call(arguments, 1);
      var init = typeof fn === "function" ? fn : function() {
        this[fn].apply(this, args);
      };
      this.prototype._initHooks = this.prototype._initHooks || [];
      this.prototype._initHooks.push(init);
      return this;
    };
    function checkDeprecatedMixinEvents(includes) {
      if (typeof L === "undefined" || !L || !L.Mixin) {
        return;
      }
      includes = isArray(includes) ? includes : [includes];
      for (var i = 0; i < includes.length; i++) {
        if (includes[i] === L.Mixin.Events) {
          console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
    }
    var Events = {
      /* @method on(type: String, fn: Function, context?: Object): this
       * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
       *
       * @alternative
       * @method on(eventMap: Object): this
       * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
       */
      on: function(types, fn, context) {
        if (typeof types === "object") {
          for (var type in types) {
            this._on(type, types[type], fn);
          }
        } else {
          types = splitWords(types);
          for (var i = 0, len = types.length; i < len; i++) {
            this._on(types[i], fn, context);
          }
        }
        return this;
      },
      /* @method off(type: String, fn?: Function, context?: Object): this
       * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
       *
       * @alternative
       * @method off(eventMap: Object): this
       * Removes a set of type/listener pairs.
       *
       * @alternative
       * @method off: this
       * Removes all listeners to all events on the object. This includes implicitly attached events.
       */
      off: function(types, fn, context) {
        if (!arguments.length) {
          delete this._events;
        } else if (typeof types === "object") {
          for (var type in types) {
            this._off(type, types[type], fn);
          }
        } else {
          types = splitWords(types);
          var removeAll = arguments.length === 1;
          for (var i = 0, len = types.length; i < len; i++) {
            if (removeAll) {
              this._off(types[i]);
            } else {
              this._off(types[i], fn, context);
            }
          }
        }
        return this;
      },
      // attach listener (without syntactic sugar now)
      _on: function(type, fn, context, _once) {
        if (typeof fn !== "function") {
          console.warn("wrong listener type: " + typeof fn);
          return;
        }
        if (this._listens(type, fn, context) !== false) {
          return;
        }
        if (context === this) {
          context = void 0;
        }
        var newListener = { fn, ctx: context };
        if (_once) {
          newListener.once = true;
        }
        this._events = this._events || {};
        this._events[type] = this._events[type] || [];
        this._events[type].push(newListener);
      },
      _off: function(type, fn, context) {
        var listeners, i, len;
        if (!this._events) {
          return;
        }
        listeners = this._events[type];
        if (!listeners) {
          return;
        }
        if (arguments.length === 1) {
          if (this._firingCount) {
            for (i = 0, len = listeners.length; i < len; i++) {
              listeners[i].fn = falseFn;
            }
          }
          delete this._events[type];
          return;
        }
        if (typeof fn !== "function") {
          console.warn("wrong listener type: " + typeof fn);
          return;
        }
        var index2 = this._listens(type, fn, context);
        if (index2 !== false) {
          var listener = listeners[index2];
          if (this._firingCount) {
            listener.fn = falseFn;
            this._events[type] = listeners = listeners.slice();
          }
          listeners.splice(index2, 1);
        }
      },
      // @method fire(type: String, data?: Object, propagate?: Boolean): this
      // Fires an event of the specified type. You can optionally provide a data
      // object — the first argument of the listener function will contain its
      // properties. The event can optionally be propagated to event parents.
      fire: function(type, data, propagate) {
        if (!this.listens(type, propagate)) {
          return this;
        }
        var event = extend({}, data, {
          type,
          target: this,
          sourceTarget: data && data.sourceTarget || this
        });
        if (this._events) {
          var listeners = this._events[type];
          if (listeners) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var i = 0, len = listeners.length; i < len; i++) {
              var l = listeners[i];
              var fn = l.fn;
              if (l.once) {
                this.off(type, fn, l.ctx);
              }
              fn.call(l.ctx || this, event);
            }
            this._firingCount--;
          }
        }
        if (propagate) {
          this._propagateEvent(event);
        }
        return this;
      },
      // @method listens(type: String, propagate?: Boolean): Boolean
      // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
      // Returns `true` if a particular event type has any listeners attached to it.
      // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
      listens: function(type, fn, context, propagate) {
        if (typeof type !== "string") {
          console.warn('"string" type argument expected');
        }
        var _fn = fn;
        if (typeof fn !== "function") {
          propagate = !!fn;
          _fn = void 0;
          context = void 0;
        }
        var listeners = this._events && this._events[type];
        if (listeners && listeners.length) {
          if (this._listens(type, _fn, context) !== false) {
            return true;
          }
        }
        if (propagate) {
          for (var id2 in this._eventParents) {
            if (this._eventParents[id2].listens(type, fn, context, propagate)) {
              return true;
            }
          }
        }
        return false;
      },
      // returns the index (number) or false
      _listens: function(type, fn, context) {
        if (!this._events) {
          return false;
        }
        var listeners = this._events[type] || [];
        if (!fn) {
          return !!listeners.length;
        }
        if (context === this) {
          context = void 0;
        }
        for (var i = 0, len = listeners.length; i < len; i++) {
          if (listeners[i].fn === fn && listeners[i].ctx === context) {
            return i;
          }
        }
        return false;
      },
      // @method once(…): this
      // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
      once: function(types, fn, context) {
        if (typeof types === "object") {
          for (var type in types) {
            this._on(type, types[type], fn, true);
          }
        } else {
          types = splitWords(types);
          for (var i = 0, len = types.length; i < len; i++) {
            this._on(types[i], fn, context, true);
          }
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(obj) {
        this._eventParents = this._eventParents || {};
        this._eventParents[stamp(obj)] = obj;
        return this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(obj) {
        if (this._eventParents) {
          delete this._eventParents[stamp(obj)];
        }
        return this;
      },
      _propagateEvent: function(e) {
        for (var id2 in this._eventParents) {
          this._eventParents[id2].fire(e.type, extend({
            layer: e.target,
            propagatedFrom: e.target
          }, e), true);
        }
      }
    };
    Events.addEventListener = Events.on;
    Events.removeEventListener = Events.clearAllEventListeners = Events.off;
    Events.addOneTimeEventListener = Events.once;
    Events.fireEvent = Events.fire;
    Events.hasEventListeners = Events.listens;
    var Evented = Class.extend(Events);
    function Point(x, y, round) {
      this.x = round ? Math.round(x) : x;
      this.y = round ? Math.round(y) : y;
    }
    var trunc = Math.trunc || function(v) {
      return v > 0 ? Math.floor(v) : Math.ceil(v);
    };
    Point.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new Point(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(point) {
        return this.clone()._add(toPoint(point));
      },
      _add: function(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(point) {
        return this.clone()._subtract(toPoint(point));
      },
      _subtract: function(point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
      },
      // @method divideBy(num: Number): Point
      // Returns the result of division of the current point by the given number.
      divideBy: function(num) {
        return this.clone()._divideBy(num);
      },
      _divideBy: function(num) {
        this.x /= num;
        this.y /= num;
        return this;
      },
      // @method multiplyBy(num: Number): Point
      // Returns the result of multiplication of the current point by the given number.
      multiplyBy: function(num) {
        return this.clone()._multiplyBy(num);
      },
      _multiplyBy: function(num) {
        this.x *= num;
        this.y *= num;
        return this;
      },
      // @method scaleBy(scale: Point): Point
      // Multiply each coordinate of the current point by each coordinate of
      // `scale`. In linear algebra terms, multiply the point by the
      // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
      // defined by `scale`.
      scaleBy: function(point) {
        return new Point(this.x * point.x, this.y * point.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(point) {
        return new Point(this.x / point.x, this.y / point.y);
      },
      // @method round(): Point
      // Returns a copy of the current point with rounded coordinates.
      round: function() {
        return this.clone()._round();
      },
      _round: function() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      },
      // @method floor(): Point
      // Returns a copy of the current point with floored coordinates (rounded down).
      floor: function() {
        return this.clone()._floor();
      },
      _floor: function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
      },
      // @method ceil(): Point
      // Returns a copy of the current point with ceiled coordinates (rounded up).
      ceil: function() {
        return this.clone()._ceil();
      },
      _ceil: function() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
      },
      // @method trunc(): Point
      // Returns a copy of the current point with truncated coordinates (rounded towards zero).
      trunc: function() {
        return this.clone()._trunc();
      },
      _trunc: function() {
        this.x = trunc(this.x);
        this.y = trunc(this.y);
        return this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(point) {
        point = toPoint(point);
        var x = point.x - this.x, y = point.y - this.y;
        return Math.sqrt(x * x + y * y);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(point) {
        point = toPoint(point);
        return point.x === this.x && point.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(point) {
        point = toPoint(point);
        return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + formatNum(this.x) + ", " + formatNum(this.y) + ")";
      }
    };
    function toPoint(x, y, round) {
      if (x instanceof Point) {
        return x;
      }
      if (isArray(x)) {
        return new Point(x[0], x[1]);
      }
      if (x === void 0 || x === null) {
        return x;
      }
      if (typeof x === "object" && "x" in x && "y" in x) {
        return new Point(x.x, x.y);
      }
      return new Point(x, y, round);
    }
    function Bounds(a, b) {
      if (!a) {
        return;
      }
      var points = b ? [a, b] : a;
      for (var i = 0, len = points.length; i < len; i++) {
        this.extend(points[i]);
      }
    }
    Bounds.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(obj) {
        var min2, max2;
        if (!obj) {
          return this;
        }
        if (obj instanceof Point || typeof obj[0] === "number" || "x" in obj) {
          min2 = max2 = toPoint(obj);
        } else {
          obj = toBounds(obj);
          min2 = obj.min;
          max2 = obj.max;
          if (!min2 || !max2) {
            return this;
          }
        }
        if (!this.min && !this.max) {
          this.min = min2.clone();
          this.max = max2.clone();
        } else {
          this.min.x = Math.min(min2.x, this.min.x);
          this.max.x = Math.max(max2.x, this.max.x);
          this.min.y = Math.min(min2.y, this.min.y);
          this.max.y = Math.max(max2.y, this.max.y);
        }
        return this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(round) {
        return toPoint(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          round
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return toPoint(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return toPoint(this.max.x, this.min.y);
      },
      // @method getTopLeft(): Point
      // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
      getTopLeft: function() {
        return this.min;
      },
      // @method getBottomRight(): Point
      // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
      getBottomRight: function() {
        return this.max;
      },
      // @method getSize(): Point
      // Returns the size of the given bounds
      getSize: function() {
        return this.max.subtract(this.min);
      },
      // @method contains(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains(point: Point): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(obj) {
        var min, max;
        if (typeof obj[0] === "number" || obj instanceof Point) {
          obj = toPoint(obj);
        } else {
          obj = toBounds(obj);
        }
        if (obj instanceof Bounds) {
          min = obj.min;
          max = obj.max;
        } else {
          min = max = obj;
        }
        return min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(bounds) {
        bounds = toBounds(bounds);
        var min = this.min, max = this.max, min2 = bounds.min, max2 = bounds.max, xIntersects = max2.x >= min.x && min2.x <= max.x, yIntersects = max2.y >= min.y && min2.y <= max.y;
        return xIntersects && yIntersects;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(bounds) {
        bounds = toBounds(bounds);
        var min = this.min, max = this.max, min2 = bounds.min, max2 = bounds.max, xOverlaps = max2.x > min.x && min2.x < max.x, yOverlaps = max2.y > min.y && min2.y < max.y;
        return xOverlaps && yOverlaps;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this.min && this.max);
      },
      // @method pad(bufferRatio: Number): Bounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(bufferRatio) {
        var min = this.min, max = this.max, heightBuffer = Math.abs(min.x - max.x) * bufferRatio, widthBuffer = Math.abs(min.y - max.y) * bufferRatio;
        return toBounds(
          toPoint(min.x - heightBuffer, min.y - widthBuffer),
          toPoint(max.x + heightBuffer, max.y + widthBuffer)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(bounds) {
        if (!bounds) {
          return false;
        }
        bounds = toBounds(bounds);
        return this.min.equals(bounds.getTopLeft()) && this.max.equals(bounds.getBottomRight());
      }
    };
    function toBounds(a, b) {
      if (!a || a instanceof Bounds) {
        return a;
      }
      return new Bounds(a, b);
    }
    function LatLngBounds(corner1, corner2) {
      if (!corner1) {
        return;
      }
      var latlngs = corner2 ? [corner1, corner2] : corner1;
      for (var i = 0, len = latlngs.length; i < len; i++) {
        this.extend(latlngs[i]);
      }
    }
    LatLngBounds.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(obj) {
        var sw = this._southWest, ne = this._northEast, sw2, ne2;
        if (obj instanceof LatLng) {
          sw2 = obj;
          ne2 = obj;
        } else if (obj instanceof LatLngBounds) {
          sw2 = obj._southWest;
          ne2 = obj._northEast;
          if (!sw2 || !ne2) {
            return this;
          }
        } else {
          return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
        }
        if (!sw && !ne) {
          this._southWest = new LatLng(sw2.lat, sw2.lng);
          this._northEast = new LatLng(ne2.lat, ne2.lng);
        } else {
          sw.lat = Math.min(sw2.lat, sw.lat);
          sw.lng = Math.min(sw2.lng, sw.lng);
          ne.lat = Math.max(ne2.lat, ne.lat);
          ne.lng = Math.max(ne2.lng, ne.lng);
        }
        return this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(bufferRatio) {
        var sw = this._southWest, ne = this._northEast, heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio, widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
        return new LatLngBounds(
          new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
          new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new LatLng(
          (this._southWest.lat + this._northEast.lat) / 2,
          (this._southWest.lng + this._northEast.lng) / 2
        );
      },
      // @method getSouthWest(): LatLng
      // Returns the south-west point of the bounds.
      getSouthWest: function() {
        return this._southWest;
      },
      // @method getNorthEast(): LatLng
      // Returns the north-east point of the bounds.
      getNorthEast: function() {
        return this._northEast;
      },
      // @method getNorthWest(): LatLng
      // Returns the north-west point of the bounds.
      getNorthWest: function() {
        return new LatLng(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new LatLng(this.getSouth(), this.getEast());
      },
      // @method getWest(): Number
      // Returns the west longitude of the bounds
      getWest: function() {
        return this._southWest.lng;
      },
      // @method getSouth(): Number
      // Returns the south latitude of the bounds
      getSouth: function() {
        return this._southWest.lat;
      },
      // @method getEast(): Number
      // Returns the east longitude of the bounds
      getEast: function() {
        return this._northEast.lng;
      },
      // @method getNorth(): Number
      // Returns the north latitude of the bounds
      getNorth: function() {
        return this._northEast.lat;
      },
      // @method contains(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains (latlng: LatLng): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(obj) {
        if (typeof obj[0] === "number" || obj instanceof LatLng || "lat" in obj) {
          obj = toLatLng(obj);
        } else {
          obj = toLatLngBounds(obj);
        }
        var sw = this._southWest, ne = this._northEast, sw2, ne2;
        if (obj instanceof LatLngBounds) {
          sw2 = obj.getSouthWest();
          ne2 = obj.getNorthEast();
        } else {
          sw2 = ne2 = obj;
        }
        return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(bounds) {
        bounds = toLatLngBounds(bounds);
        var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat, lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;
        return latIntersects && lngIntersects;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(bounds) {
        bounds = toLatLngBounds(bounds);
        var sw = this._southWest, ne = this._northEast, sw2 = bounds.getSouthWest(), ne2 = bounds.getNorthEast(), latOverlaps = ne2.lat > sw.lat && sw2.lat < ne.lat, lngOverlaps = ne2.lng > sw.lng && sw2.lng < ne.lng;
        return latOverlaps && lngOverlaps;
      },
      // @method toBBoxString(): String
      // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
      toBBoxString: function() {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
      },
      // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
      // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(bounds, maxMargin) {
        if (!bounds) {
          return false;
        }
        bounds = toLatLngBounds(bounds);
        return this._southWest.equals(bounds.getSouthWest(), maxMargin) && this._northEast.equals(bounds.getNorthEast(), maxMargin);
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function toLatLngBounds(a, b) {
      if (a instanceof LatLngBounds) {
        return a;
      }
      return new LatLngBounds(a, b);
    }
    function LatLng(lat, lng, alt) {
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid LatLng object: (" + lat + ", " + lng + ")");
      }
      this.lat = +lat;
      this.lng = +lng;
      if (alt !== void 0) {
        this.alt = +alt;
      }
    }
    LatLng.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(obj, maxMargin) {
        if (!obj) {
          return false;
        }
        obj = toLatLng(obj);
        var margin = Math.max(
          Math.abs(this.lat - obj.lat),
          Math.abs(this.lng - obj.lng)
        );
        return margin <= (maxMargin === void 0 ? 1e-9 : maxMargin);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(precision) {
        return "LatLng(" + formatNum(this.lat, precision) + ", " + formatNum(this.lng, precision) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(other) {
        return Earth.distance(this, toLatLng(other));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return Earth.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(sizeInMeters) {
        var latAccuracy = 180 * sizeInMeters / 40075017, lngAccuracy = latAccuracy / Math.cos(Math.PI / 180 * this.lat);
        return toLatLngBounds(
          [this.lat - latAccuracy, this.lng - lngAccuracy],
          [this.lat + latAccuracy, this.lng + lngAccuracy]
        );
      },
      clone: function() {
        return new LatLng(this.lat, this.lng, this.alt);
      }
    };
    function toLatLng(a, b, c) {
      if (a instanceof LatLng) {
        return a;
      }
      if (isArray(a) && typeof a[0] !== "object") {
        if (a.length === 3) {
          return new LatLng(a[0], a[1], a[2]);
        }
        if (a.length === 2) {
          return new LatLng(a[0], a[1]);
        }
        return null;
      }
      if (a === void 0 || a === null) {
        return a;
      }
      if (typeof a === "object" && "lat" in a) {
        return new LatLng(a.lat, "lng" in a ? a.lng : a.lon, a.alt);
      }
      if (b === void 0) {
        return null;
      }
      return new LatLng(a, b, c);
    }
    var CRS = {
      // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
      // Projects geographical coordinates into pixel coordinates for a given zoom.
      latLngToPoint: function(latlng, zoom2) {
        var projectedPoint = this.projection.project(latlng), scale3 = this.scale(zoom2);
        return this.transformation._transform(projectedPoint, scale3);
      },
      // @method pointToLatLng(point: Point, zoom: Number): LatLng
      // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
      // zoom into geographical coordinates.
      pointToLatLng: function(point, zoom2) {
        var scale3 = this.scale(zoom2), untransformedPoint = this.transformation.untransform(point, scale3);
        return this.projection.unproject(untransformedPoint);
      },
      // @method project(latlng: LatLng): Point
      // Projects geographical coordinates into coordinates in units accepted for
      // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
      project: function(latlng) {
        return this.projection.project(latlng);
      },
      // @method unproject(point: Point): LatLng
      // Given a projected coordinate returns the corresponding LatLng.
      // The inverse of `project`.
      unproject: function(point) {
        return this.projection.unproject(point);
      },
      // @method scale(zoom: Number): Number
      // Returns the scale used when transforming projected coordinates into
      // pixel coordinates for a particular zoom. For example, it returns
      // `256 * 2^zoom` for Mercator-based CRS.
      scale: function(zoom2) {
        return 256 * Math.pow(2, zoom2);
      },
      // @method zoom(scale: Number): Number
      // Inverse of `scale()`, returns the zoom level corresponding to a scale
      // factor of `scale`.
      zoom: function(scale3) {
        return Math.log(scale3 / 256) / Math.LN2;
      },
      // @method getProjectedBounds(zoom: Number): Bounds
      // Returns the projection's bounds scaled and transformed for the provided `zoom`.
      getProjectedBounds: function(zoom2) {
        if (this.infinite) {
          return null;
        }
        var b = this.projection.bounds, s = this.scale(zoom2), min = this.transformation.transform(b.min, s), max = this.transformation.transform(b.max, s);
        return new Bounds(min, max);
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates.
      // @property code: String
      // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
      //
      // @property wrapLng: Number[]
      // An array of two numbers defining whether the longitude (horizontal) coordinate
      // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
      // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
      //
      // @property wrapLat: Number[]
      // Like `wrapLng`, but for the latitude (vertical) axis.
      // wrapLng: [min, max],
      // wrapLat: [min, max],
      // @property infinite: Boolean
      // If true, the coordinate space will be unbounded (infinite in both axes)
      infinite: false,
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where lat and lng has been wrapped according to the
      // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
      wrapLatLng: function(latlng) {
        var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng, lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat, alt = latlng.alt;
        return new LatLng(lat, lng, alt);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(bounds) {
        var center = bounds.getCenter(), newCenter = this.wrapLatLng(center), latShift = center.lat - newCenter.lat, lngShift = center.lng - newCenter.lng;
        if (latShift === 0 && lngShift === 0) {
          return bounds;
        }
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast(), newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift), newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);
        return new LatLngBounds(newSw, newNe);
      }
    };
    var Earth = extend({}, CRS, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(latlng1, latlng2) {
        var rad = Math.PI / 180, lat1 = latlng1.lat * rad, lat2 = latlng2.lat * rad, sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2), sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2), a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon, c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.R * c;
      }
    });
    var earthRadius = 6378137;
    var SphericalMercator = {
      R: earthRadius,
      MAX_LATITUDE: 85.0511287798,
      project: function(latlng) {
        var d = Math.PI / 180, max = this.MAX_LATITUDE, lat = Math.max(Math.min(max, latlng.lat), -max), sin = Math.sin(lat * d);
        return new Point(
          this.R * latlng.lng * d,
          this.R * Math.log((1 + sin) / (1 - sin)) / 2
        );
      },
      unproject: function(point) {
        var d = 180 / Math.PI;
        return new LatLng(
          (2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d,
          point.x * d / this.R
        );
      },
      bounds: function() {
        var d = earthRadius * Math.PI;
        return new Bounds([-d, -d], [d, d]);
      }()
    };
    function Transformation(a, b, c, d) {
      if (isArray(a)) {
        this._a = a[0];
        this._b = a[1];
        this._c = a[2];
        this._d = a[3];
        return;
      }
      this._a = a;
      this._b = b;
      this._c = c;
      this._d = d;
    }
    Transformation.prototype = {
      // @method transform(point: Point, scale?: Number): Point
      // Returns a transformed point, optionally multiplied by the given scale.
      // Only accepts actual `L.Point` instances, not arrays.
      transform: function(point, scale3) {
        return this._transform(point.clone(), scale3);
      },
      // destructive transform (faster)
      _transform: function(point, scale3) {
        scale3 = scale3 || 1;
        point.x = scale3 * (this._a * point.x + this._b);
        point.y = scale3 * (this._c * point.y + this._d);
        return point;
      },
      // @method untransform(point: Point, scale?: Number): Point
      // Returns the reverse transformation of the given point, optionally divided
      // by the given scale. Only accepts actual `L.Point` instances, not arrays.
      untransform: function(point, scale3) {
        scale3 = scale3 || 1;
        return new Point(
          (point.x / scale3 - this._b) / this._a,
          (point.y / scale3 - this._d) / this._c
        );
      }
    };
    function toTransformation(a, b, c, d) {
      return new Transformation(a, b, c, d);
    }
    var EPSG3857 = extend({}, Earth, {
      code: "EPSG:3857",
      projection: SphericalMercator,
      transformation: function() {
        var scale3 = 0.5 / (Math.PI * SphericalMercator.R);
        return toTransformation(scale3, 0.5, -scale3, 0.5);
      }()
    });
    var EPSG900913 = extend({}, EPSG3857, {
      code: "EPSG:900913"
    });
    function svgCreate(name) {
      return document.createElementNS("http://www.w3.org/2000/svg", name);
    }
    function pointsToPath(rings, closed) {
      var str = "", i, j, len, len2, points, p;
      for (i = 0, len = rings.length; i < len; i++) {
        points = rings[i];
        for (j = 0, len2 = points.length; j < len2; j++) {
          p = points[j];
          str += (j ? "L" : "M") + p.x + " " + p.y;
        }
        str += closed ? Browser.svg ? "z" : "x" : "";
      }
      return str || "M0 0";
    }
    var style = document.documentElement.style;
    var ie = "ActiveXObject" in window;
    var ielt9 = ie && !document.addEventListener;
    var edge = "msLaunchUri" in navigator && !("documentMode" in document);
    var webkit = userAgentContains2("webkit");
    var android = userAgentContains2("android");
    var android23 = userAgentContains2("android 2") || userAgentContains2("android 3");
    var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10);
    var androidStock = android && userAgentContains2("Google") && webkitVer < 537 && !("AudioNode" in window);
    var opera = !!window.opera;
    var chrome = !edge && userAgentContains2("chrome");
    var gecko = userAgentContains2("gecko") && !webkit && !opera && !ie;
    var safari = !chrome && userAgentContains2("safari");
    var phantom = userAgentContains2("phantom");
    var opera12 = "OTransition" in style;
    var win = navigator.platform.indexOf("Win") === 0;
    var ie3d = ie && "transition" in style;
    var webkit3d = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !android23;
    var gecko3d = "MozPerspective" in style;
    var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;
    var mobile = typeof orientation !== "undefined" || userAgentContains2("mobile");
    var mobileWebkit = mobile && webkit;
    var mobileWebkit3d = mobile && webkit3d;
    var msPointer = !window.PointerEvent && window.MSPointerEvent;
    var pointer = !!(window.PointerEvent || msPointer);
    var touchNative = "ontouchstart" in window || !!window.TouchEvent;
    var touch = !window.L_NO_TOUCH && (touchNative || pointer);
    var mobileOpera = mobile && opera;
    var mobileGecko = mobile && gecko;
    var retina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;
    var passiveEvents = function() {
      var supportsPassiveOption = false;
      try {
        var opts = Object.defineProperty({}, "passive", {
          get: function() {
            supportsPassiveOption = true;
          }
        });
        window.addEventListener("testPassiveEventSupport", falseFn, opts);
        window.removeEventListener("testPassiveEventSupport", falseFn, opts);
      } catch (e) {
      }
      return supportsPassiveOption;
    }();
    var canvas$1 = function() {
      return !!document.createElement("canvas").getContext;
    }();
    var svg$1 = !!(document.createElementNS && svgCreate("svg").createSVGRect);
    var inlineSvg = !!svg$1 && function() {
      var div = document.createElement("div");
      div.innerHTML = "<svg/>";
      return (div.firstChild && div.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }();
    var vml = !svg$1 && function() {
      try {
        var div = document.createElement("div");
        div.innerHTML = '<v:shape adj="1"/>';
        var shape = div.firstChild;
        shape.style.behavior = "url(#default#VML)";
        return shape && typeof shape.adj === "object";
      } catch (e) {
        return false;
      }
    }();
    var mac = navigator.platform.indexOf("Mac") === 0;
    var linux = navigator.platform.indexOf("Linux") === 0;
    function userAgentContains2(str) {
      return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
    }
    var Browser = {
      ie,
      ielt9,
      edge,
      webkit,
      android,
      android23,
      androidStock,
      opera,
      chrome,
      gecko,
      safari,
      phantom,
      opera12,
      win,
      ie3d,
      webkit3d,
      gecko3d,
      any3d,
      mobile,
      mobileWebkit,
      mobileWebkit3d,
      msPointer,
      pointer,
      touch,
      touchNative,
      mobileOpera,
      mobileGecko,
      retina,
      passiveEvents,
      canvas: canvas$1,
      svg: svg$1,
      vml,
      inlineSvg,
      mac,
      linux
    };
    var POINTER_DOWN = Browser.msPointer ? "MSPointerDown" : "pointerdown";
    var POINTER_MOVE = Browser.msPointer ? "MSPointerMove" : "pointermove";
    var POINTER_UP = Browser.msPointer ? "MSPointerUp" : "pointerup";
    var POINTER_CANCEL = Browser.msPointer ? "MSPointerCancel" : "pointercancel";
    var pEvent = {
      touchstart: POINTER_DOWN,
      touchmove: POINTER_MOVE,
      touchend: POINTER_UP,
      touchcancel: POINTER_CANCEL
    };
    var handle = {
      touchstart: _onPointerStart,
      touchmove: _handlePointer,
      touchend: _handlePointer,
      touchcancel: _handlePointer
    };
    var _pointers = {};
    var _pointerDocListener = false;
    function addPointerListener(obj, type, handler) {
      if (type === "touchstart") {
        _addPointerDocListener();
      }
      if (!handle[type]) {
        console.warn("wrong event specified:", type);
        return falseFn;
      }
      handler = handle[type].bind(this, handler);
      obj.addEventListener(pEvent[type], handler, false);
      return handler;
    }
    function removePointerListener(obj, type, handler) {
      if (!pEvent[type]) {
        console.warn("wrong event specified:", type);
        return;
      }
      obj.removeEventListener(pEvent[type], handler, false);
    }
    function _globalPointerDown(e) {
      _pointers[e.pointerId] = e;
    }
    function _globalPointerMove(e) {
      if (_pointers[e.pointerId]) {
        _pointers[e.pointerId] = e;
      }
    }
    function _globalPointerUp(e) {
      delete _pointers[e.pointerId];
    }
    function _addPointerDocListener() {
      if (!_pointerDocListener) {
        document.addEventListener(POINTER_DOWN, _globalPointerDown, true);
        document.addEventListener(POINTER_MOVE, _globalPointerMove, true);
        document.addEventListener(POINTER_UP, _globalPointerUp, true);
        document.addEventListener(POINTER_CANCEL, _globalPointerUp, true);
        _pointerDocListener = true;
      }
    }
    function _handlePointer(handler, e) {
      if (e.pointerType === (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
        return;
      }
      e.touches = [];
      for (var i in _pointers) {
        e.touches.push(_pointers[i]);
      }
      e.changedTouches = [e];
      handler(e);
    }
    function _onPointerStart(handler, e) {
      if (e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH) {
        preventDefault(e);
      }
      _handlePointer(handler, e);
    }
    function makeDblclick(event) {
      var newEvent = {}, prop, i;
      for (i in event) {
        prop = event[i];
        newEvent[i] = prop && prop.bind ? prop.bind(event) : prop;
      }
      event = newEvent;
      newEvent.type = "dblclick";
      newEvent.detail = 2;
      newEvent.isTrusted = false;
      newEvent._simulated = true;
      return newEvent;
    }
    var delay2 = 200;
    function addDoubleTapListener(obj, handler) {
      obj.addEventListener("dblclick", handler);
      var last = 0, detail;
      function simDblclick(e) {
        if (e.detail !== 1) {
          detail = e.detail;
          return;
        }
        if (e.pointerType === "mouse" || e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents) {
          return;
        }
        var path = getPropagationPath(e);
        if (path.some(function(el) {
          return el instanceof HTMLLabelElement && el.attributes.for;
        }) && !path.some(function(el) {
          return el instanceof HTMLInputElement || el instanceof HTMLSelectElement;
        })) {
          return;
        }
        var now2 = Date.now();
        if (now2 - last <= delay2) {
          detail++;
          if (detail === 2) {
            handler(makeDblclick(e));
          }
        } else {
          detail = 1;
        }
        last = now2;
      }
      obj.addEventListener("click", simDblclick);
      return {
        dblclick: handler,
        simDblclick
      };
    }
    function removeDoubleTapListener(obj, handlers) {
      obj.removeEventListener("dblclick", handlers.dblclick);
      obj.removeEventListener("click", handlers.simDblclick);
    }
    var TRANSFORM = testProp(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    );
    var TRANSITION = testProp(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    );
    var TRANSITION_END = TRANSITION === "webkitTransition" || TRANSITION === "OTransition" ? TRANSITION + "End" : "transitionend";
    function get(id2) {
      return typeof id2 === "string" ? document.getElementById(id2) : id2;
    }
    function getStyle(el, style2) {
      var value = el.style[style2] || el.currentStyle && el.currentStyle[style2];
      if ((!value || value === "auto") && document.defaultView) {
        var css = document.defaultView.getComputedStyle(el, null);
        value = css ? css[style2] : null;
      }
      return value === "auto" ? null : value;
    }
    function create$1(tagName, className, container) {
      var el = document.createElement(tagName);
      el.className = className || "";
      if (container) {
        container.appendChild(el);
      }
      return el;
    }
    function remove(el) {
      var parent = el.parentNode;
      if (parent) {
        parent.removeChild(el);
      }
    }
    function empty(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    }
    function toFront(el) {
      var parent = el.parentNode;
      if (parent && parent.lastChild !== el) {
        parent.appendChild(el);
      }
    }
    function toBack(el) {
      var parent = el.parentNode;
      if (parent && parent.firstChild !== el) {
        parent.insertBefore(el, parent.firstChild);
      }
    }
    function hasClass(el, name) {
      if (el.classList !== void 0) {
        return el.classList.contains(name);
      }
      var className = getClass(el);
      return className.length > 0 && new RegExp("(^|\\s)" + name + "(\\s|$)").test(className);
    }
    function addClass(el, name) {
      if (el.classList !== void 0) {
        var classes = splitWords(name);
        for (var i = 0, len = classes.length; i < len; i++) {
          el.classList.add(classes[i]);
        }
      } else if (!hasClass(el, name)) {
        var className = getClass(el);
        setClass(el, (className ? className + " " : "") + name);
      }
    }
    function removeClass(el, name) {
      if (el.classList !== void 0) {
        el.classList.remove(name);
      } else {
        setClass(el, trim((" " + getClass(el) + " ").replace(" " + name + " ", " ")));
      }
    }
    function setClass(el, name) {
      if (el.className.baseVal === void 0) {
        el.className = name;
      } else {
        el.className.baseVal = name;
      }
    }
    function getClass(el) {
      if (el.correspondingElement) {
        el = el.correspondingElement;
      }
      return el.className.baseVal === void 0 ? el.className : el.className.baseVal;
    }
    function setOpacity(el, value) {
      if ("opacity" in el.style) {
        el.style.opacity = value;
      } else if ("filter" in el.style) {
        _setOpacityIE(el, value);
      }
    }
    function _setOpacityIE(el, value) {
      var filter2 = false, filterName = "DXImageTransform.Microsoft.Alpha";
      try {
        filter2 = el.filters.item(filterName);
      } catch (e) {
        if (value === 1) {
          return;
        }
      }
      value = Math.round(value * 100);
      if (filter2) {
        filter2.Enabled = value !== 100;
        filter2.Opacity = value;
      } else {
        el.style.filter += " progid:" + filterName + "(opacity=" + value + ")";
      }
    }
    function testProp(props) {
      var style2 = document.documentElement.style;
      for (var i = 0; i < props.length; i++) {
        if (props[i] in style2) {
          return props[i];
        }
      }
      return false;
    }
    function setTransform(el, offset, scale3) {
      var pos = offset || new Point(0, 0);
      el.style[TRANSFORM] = (Browser.ie3d ? "translate(" + pos.x + "px," + pos.y + "px)" : "translate3d(" + pos.x + "px," + pos.y + "px,0)") + (scale3 ? " scale(" + scale3 + ")" : "");
    }
    function setPosition(el, point) {
      el._leaflet_pos = point;
      if (Browser.any3d) {
        setTransform(el, point);
      } else {
        el.style.left = point.x + "px";
        el.style.top = point.y + "px";
      }
    }
    function getPosition(el) {
      return el._leaflet_pos || new Point(0, 0);
    }
    var disableTextSelection;
    var enableTextSelection;
    var _userSelect;
    if ("onselectstart" in document) {
      disableTextSelection = function() {
        on(window, "selectstart", preventDefault);
      };
      enableTextSelection = function() {
        off(window, "selectstart", preventDefault);
      };
    } else {
      var userSelectProperty = testProp(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      disableTextSelection = function() {
        if (userSelectProperty) {
          var style2 = document.documentElement.style;
          _userSelect = style2[userSelectProperty];
          style2[userSelectProperty] = "none";
        }
      };
      enableTextSelection = function() {
        if (userSelectProperty) {
          document.documentElement.style[userSelectProperty] = _userSelect;
          _userSelect = void 0;
        }
      };
    }
    function disableImageDrag() {
      on(window, "dragstart", preventDefault);
    }
    function enableImageDrag() {
      off(window, "dragstart", preventDefault);
    }
    var _outlineElement, _outlineStyle;
    function preventOutline(element) {
      while (element.tabIndex === -1) {
        element = element.parentNode;
      }
      if (!element.style) {
        return;
      }
      restoreOutline();
      _outlineElement = element;
      _outlineStyle = element.style.outlineStyle;
      element.style.outlineStyle = "none";
      on(window, "keydown", restoreOutline);
    }
    function restoreOutline() {
      if (!_outlineElement) {
        return;
      }
      _outlineElement.style.outlineStyle = _outlineStyle;
      _outlineElement = void 0;
      _outlineStyle = void 0;
      off(window, "keydown", restoreOutline);
    }
    function getSizedParentNode(element) {
      do {
        element = element.parentNode;
      } while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
      return element;
    }
    function getScale(element) {
      var rect = element.getBoundingClientRect();
      return {
        x: rect.width / element.offsetWidth || 1,
        y: rect.height / element.offsetHeight || 1,
        boundingClientRect: rect
      };
    }
    var DomUtil = {
      __proto__: null,
      TRANSFORM,
      TRANSITION,
      TRANSITION_END,
      get,
      getStyle,
      create: create$1,
      remove,
      empty,
      toFront,
      toBack,
      hasClass,
      addClass,
      removeClass,
      setClass,
      getClass,
      setOpacity,
      testProp,
      setTransform,
      setPosition,
      getPosition,
      get disableTextSelection() {
        return disableTextSelection;
      },
      get enableTextSelection() {
        return enableTextSelection;
      },
      disableImageDrag,
      enableImageDrag,
      preventOutline,
      restoreOutline,
      getSizedParentNode,
      getScale
    };
    function on(obj, types, fn, context) {
      if (types && typeof types === "object") {
        for (var type in types) {
          addOne(obj, type, types[type], fn);
        }
      } else {
        types = splitWords(types);
        for (var i = 0, len = types.length; i < len; i++) {
          addOne(obj, types[i], fn, context);
        }
      }
      return this;
    }
    var eventsKey = "_leaflet_events";
    function off(obj, types, fn, context) {
      if (arguments.length === 1) {
        batchRemove(obj);
        delete obj[eventsKey];
      } else if (types && typeof types === "object") {
        for (var type in types) {
          removeOne(obj, type, types[type], fn);
        }
      } else {
        types = splitWords(types);
        if (arguments.length === 2) {
          batchRemove(obj, function(type2) {
            return indexOf(types, type2) !== -1;
          });
        } else {
          for (var i = 0, len = types.length; i < len; i++) {
            removeOne(obj, types[i], fn, context);
          }
        }
      }
      return this;
    }
    function batchRemove(obj, filterFn) {
      for (var id2 in obj[eventsKey]) {
        var type = id2.split(/\d/)[0];
        if (!filterFn || filterFn(type)) {
          removeOne(obj, type, null, null, id2);
        }
      }
    }
    var mouseSubst = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function addOne(obj, type, fn, context) {
      var id2 = type + stamp(fn) + (context ? "_" + stamp(context) : "");
      if (obj[eventsKey] && obj[eventsKey][id2]) {
        return this;
      }
      var handler = function(e) {
        return fn.call(context || obj, e || window.event);
      };
      var originalHandler = handler;
      if (!Browser.touchNative && Browser.pointer && type.indexOf("touch") === 0) {
        handler = addPointerListener(obj, type, handler);
      } else if (Browser.touch && type === "dblclick") {
        handler = addDoubleTapListener(obj, handler);
      } else if ("addEventListener" in obj) {
        if (type === "touchstart" || type === "touchmove" || type === "wheel" || type === "mousewheel") {
          obj.addEventListener(mouseSubst[type] || type, handler, Browser.passiveEvents ? { passive: false } : false);
        } else if (type === "mouseenter" || type === "mouseleave") {
          handler = function(e) {
            e = e || window.event;
            if (isExternalTarget(obj, e)) {
              originalHandler(e);
            }
          };
          obj.addEventListener(mouseSubst[type], handler, false);
        } else {
          obj.addEventListener(type, originalHandler, false);
        }
      } else {
        obj.attachEvent("on" + type, handler);
      }
      obj[eventsKey] = obj[eventsKey] || {};
      obj[eventsKey][id2] = handler;
    }
    function removeOne(obj, type, fn, context, id2) {
      id2 = id2 || type + stamp(fn) + (context ? "_" + stamp(context) : "");
      var handler = obj[eventsKey] && obj[eventsKey][id2];
      if (!handler) {
        return this;
      }
      if (!Browser.touchNative && Browser.pointer && type.indexOf("touch") === 0) {
        removePointerListener(obj, type, handler);
      } else if (Browser.touch && type === "dblclick") {
        removeDoubleTapListener(obj, handler);
      } else if ("removeEventListener" in obj) {
        obj.removeEventListener(mouseSubst[type] || type, handler, false);
      } else {
        obj.detachEvent("on" + type, handler);
      }
      obj[eventsKey][id2] = null;
    }
    function stopPropagation(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else if (e.originalEvent) {
        e.originalEvent._stopped = true;
      } else {
        e.cancelBubble = true;
      }
      return this;
    }
    function disableScrollPropagation(el) {
      addOne(el, "wheel", stopPropagation);
      return this;
    }
    function disableClickPropagation(el) {
      on(el, "mousedown touchstart dblclick contextmenu", stopPropagation);
      el["_leaflet_disable_click"] = true;
      return this;
    }
    function preventDefault(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      return this;
    }
    function stop(e) {
      preventDefault(e);
      stopPropagation(e);
      return this;
    }
    function getPropagationPath(ev) {
      if (ev.composedPath) {
        return ev.composedPath();
      }
      var path = [];
      var el = ev.target;
      while (el) {
        path.push(el);
        el = el.parentNode;
      }
      return path;
    }
    function getMousePosition(e, container) {
      if (!container) {
        return new Point(e.clientX, e.clientY);
      }
      var scale3 = getScale(container), offset = scale3.boundingClientRect;
      return new Point(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (e.clientX - offset.left) / scale3.x - container.clientLeft,
        (e.clientY - offset.top) / scale3.y - container.clientTop
      );
    }
    var wheelPxFactor = Browser.linux && Browser.chrome ? window.devicePixelRatio : Browser.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function getWheelDelta(e) {
      return Browser.edge ? e.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        e.deltaY && e.deltaMode === 0 ? -e.deltaY / wheelPxFactor : (
          // Pixels
          e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : (
            // Lines
            e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : (
              // Pages
              e.deltaX || e.deltaZ ? 0 : (
                // Skip horizontal/depth wheel events
                e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : (
                  // Legacy IE pixels
                  e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : (
                    // Legacy Moz lines
                    e.detail ? e.detail / -32765 * 60 : (
                      // Legacy Moz pages
                      0
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    function isExternalTarget(el, e) {
      var related = e.relatedTarget;
      if (!related) {
        return true;
      }
      try {
        while (related && related !== el) {
          related = related.parentNode;
        }
      } catch (err) {
        return false;
      }
      return related !== el;
    }
    var DomEvent = {
      __proto__: null,
      on,
      off,
      stopPropagation,
      disableScrollPropagation,
      disableClickPropagation,
      preventDefault,
      stop,
      getPropagationPath,
      getMousePosition,
      getWheelDelta,
      isExternalTarget,
      addListener: on,
      removeListener: off
    };
    var PosAnimation = Evented.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(el, newPos, duration, easeLinearity) {
        this.stop();
        this._el = el;
        this._inProgress = true;
        this._duration = duration || 0.25;
        this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
        this._startPos = getPosition(el);
        this._offset = newPos.subtract(this._startPos);
        this._startTime = +/* @__PURE__ */ new Date();
        this.fire("start");
        this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        if (!this._inProgress) {
          return;
        }
        this._step(true);
        this._complete();
      },
      _animate: function() {
        this._animId = requestAnimFrame(this._animate, this);
        this._step();
      },
      _step: function(round) {
        var elapsed = +/* @__PURE__ */ new Date() - this._startTime, duration = this._duration * 1e3;
        if (elapsed < duration) {
          this._runFrame(this._easeOut(elapsed / duration), round);
        } else {
          this._runFrame(1);
          this._complete();
        }
      },
      _runFrame: function(progress2, round) {
        var pos = this._startPos.add(this._offset.multiplyBy(progress2));
        if (round) {
          pos._round();
        }
        setPosition(this._el, pos);
        this.fire("step");
      },
      _complete: function() {
        cancelAnimFrame(this._animId);
        this._inProgress = false;
        this.fire("end");
      },
      _easeOut: function(t) {
        return 1 - Math.pow(1 - t, this._easeOutPower);
      }
    });
    var Map2 = Evented.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: EPSG3857,
        // @option center: LatLng = undefined
        // Initial geographic center of the map
        center: void 0,
        // @option zoom: Number = undefined
        // Initial map zoom level
        zoom: void 0,
        // @option minZoom: Number = *
        // Minimum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the lowest of their `minZoom` options will be used instead.
        minZoom: void 0,
        // @option maxZoom: Number = *
        // Maximum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the highest of their `maxZoom` options will be used instead.
        maxZoom: void 0,
        // @option layers: Layer[] = []
        // Array of layers that will be added to the map initially
        layers: [],
        // @option maxBounds: LatLngBounds = null
        // When this option is set, the map restricts the view to the given
        // geographical bounds, bouncing the user back if the user tries to pan
        // outside the view. To set the restriction dynamically, use
        // [`setMaxBounds`](#map-setmaxbounds) method.
        maxBounds: void 0,
        // @option renderer: Renderer = *
        // The default method for drawing vector layers on the map. `L.SVG`
        // or `L.Canvas` by default depending on browser support.
        renderer: void 0,
        // @section Animation Options
        // @option zoomAnimation: Boolean = true
        // Whether the map zoom animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        zoomAnimation: true,
        // @option zoomAnimationThreshold: Number = 4
        // Won't animate zoom if the zoom difference exceeds this value.
        zoomAnimationThreshold: 4,
        // @option fadeAnimation: Boolean = true
        // Whether the tile fade animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        fadeAnimation: true,
        // @option markerZoomAnimation: Boolean = true
        // Whether markers animate their zoom with the zoom animation, if disabled
        // they will disappear for the length of the animation. By default it's
        // enabled in all browsers that support CSS3 Transitions except Android.
        markerZoomAnimation: true,
        // @option transform3DLimit: Number = 2^23
        // Defines the maximum size of a CSS translation transform. The default
        // value should not be changed unless a web browser positions layers in
        // the wrong place after doing a large `panBy`.
        transform3DLimit: 8388608,
        // Precision limit of a 32-bit float
        // @section Interaction Options
        // @option zoomSnap: Number = 1
        // Forces the map's zoom level to always be a multiple of this, particularly
        // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
        // By default, the zoom level snaps to the nearest integer; lower values
        // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
        // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
        zoomSnap: 1,
        // @option zoomDelta: Number = 1
        // Controls how much the map's zoom level will change after a
        // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
        // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
        // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
        zoomDelta: 1,
        // @option trackResize: Boolean = true
        // Whether the map automatically handles browser window resize to update itself.
        trackResize: true
      },
      initialize: function(id2, options) {
        options = setOptions(this, options);
        this._handlers = [];
        this._layers = {};
        this._zoomBoundLayers = {};
        this._sizeChanged = true;
        this._initContainer(id2);
        this._initLayout();
        this._onResize = bind(this._onResize, this);
        this._initEvents();
        if (options.maxBounds) {
          this.setMaxBounds(options.maxBounds);
        }
        if (options.zoom !== void 0) {
          this._zoom = this._limitZoom(options.zoom);
        }
        if (options.center && options.zoom !== void 0) {
          this.setView(toLatLng(options.center), options.zoom, { reset: true });
        }
        this.callInitHooks();
        this._zoomAnimated = TRANSITION && Browser.any3d && !Browser.mobileOpera && this.options.zoomAnimation;
        if (this._zoomAnimated) {
          this._createAnimProxy();
          on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
        }
        this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(center, zoom2, options) {
        zoom2 = zoom2 === void 0 ? this._zoom : this._limitZoom(zoom2);
        center = this._limitCenter(toLatLng(center), zoom2, this.options.maxBounds);
        options = options || {};
        this._stop();
        if (this._loaded && !options.reset && options !== true) {
          if (options.animate !== void 0) {
            options.zoom = extend({ animate: options.animate }, options.zoom);
            options.pan = extend({ animate: options.animate, duration: options.duration }, options.pan);
          }
          var moved = this._zoom !== zoom2 ? this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom2, options.zoom) : this._tryAnimatedPan(center, options.pan);
          if (moved) {
            clearTimeout(this._sizeTimer);
            return this;
          }
        }
        this._resetView(center, zoom2, options.pan && options.pan.noMoveStart);
        return this;
      },
      // @method setZoom(zoom: Number, options?: Zoom/pan options): this
      // Sets the zoom of the map.
      setZoom: function(zoom2, options) {
        if (!this._loaded) {
          this._zoom = zoom2;
          return this;
        }
        return this.setView(this.getCenter(), zoom2, { zoom: options });
      },
      // @method zoomIn(delta?: Number, options?: Zoom options): this
      // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomIn: function(delta, options) {
        delta = delta || (Browser.any3d ? this.options.zoomDelta : 1);
        return this.setZoom(this._zoom + delta, options);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(delta, options) {
        delta = delta || (Browser.any3d ? this.options.zoomDelta : 1);
        return this.setZoom(this._zoom - delta, options);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(latlng, zoom2, options) {
        var scale3 = this.getZoomScale(zoom2), viewHalf = this.getSize().divideBy(2), containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng), centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale3), newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
        return this.setView(newCenter, zoom2, { zoom: options });
      },
      _getBoundsCenterZoom: function(bounds, options) {
        options = options || {};
        bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);
        var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), zoom2 = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));
        zoom2 = typeof options.maxZoom === "number" ? Math.min(options.maxZoom, zoom2) : zoom2;
        if (zoom2 === Infinity) {
          return {
            center: bounds.getCenter(),
            zoom: zoom2
          };
        }
        var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2), swPoint = this.project(bounds.getSouthWest(), zoom2), nePoint = this.project(bounds.getNorthEast(), zoom2), center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom2);
        return {
          center,
          zoom: zoom2
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(bounds, options) {
        bounds = toLatLngBounds(bounds);
        if (!bounds.isValid()) {
          throw new Error("Bounds are not valid.");
        }
        var target = this._getBoundsCenterZoom(bounds, options);
        return this.setView(target.center, target.zoom, options);
      },
      // @method fitWorld(options?: fitBounds options): this
      // Sets a map view that mostly contains the whole world with the maximum
      // zoom level possible.
      fitWorld: function(options) {
        return this.fitBounds([[-90, -180], [90, 180]], options);
      },
      // @method panTo(latlng: LatLng, options?: Pan options): this
      // Pans the map to a given center.
      panTo: function(center, options) {
        return this.setView(center, this._zoom, { pan: options });
      },
      // @method panBy(offset: Point, options?: Pan options): this
      // Pans the map by a given number of pixels (animated).
      panBy: function(offset, options) {
        offset = toPoint(offset).round();
        options = options || {};
        if (!offset.x && !offset.y) {
          return this.fire("moveend");
        }
        if (options.animate !== true && !this.getSize().contains(offset)) {
          this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
          return this;
        }
        if (!this._panAnim) {
          this._panAnim = new PosAnimation();
          this._panAnim.on({
            "step": this._onPanTransitionStep,
            "end": this._onPanTransitionEnd
          }, this);
        }
        if (!options.noMoveStart) {
          this.fire("movestart");
        }
        if (options.animate !== false) {
          addClass(this._mapPane, "leaflet-pan-anim");
          var newPos = this._getMapPanePos().subtract(offset).round();
          this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
        } else {
          this._rawPanBy(offset);
          this.fire("move").fire("moveend");
        }
        return this;
      },
      // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) performing a smooth
      // pan-zoom animation.
      flyTo: function(targetCenter, targetZoom, options) {
        options = options || {};
        if (options.animate === false || !Browser.any3d) {
          return this.setView(targetCenter, targetZoom, options);
        }
        this._stop();
        var from = this.project(this.getCenter()), to = this.project(targetCenter), size = this.getSize(), startZoom = this._zoom;
        targetCenter = toLatLng(targetCenter);
        targetZoom = targetZoom === void 0 ? startZoom : targetZoom;
        var w0 = Math.max(size.x, size.y), w1 = w0 * this.getZoomScale(startZoom, targetZoom), u1 = to.distanceTo(from) || 1, rho = 1.42, rho2 = rho * rho;
        function r(i) {
          var s1 = i ? -1 : 1, s2 = i ? w1 : w0, t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1, b1 = 2 * s2 * rho2 * u1, b = t1 / b1, sq = Math.sqrt(b * b + 1) - b;
          var log = sq < 1e-9 ? -18 : Math.log(sq);
          return log;
        }
        function sinh(n) {
          return (Math.exp(n) - Math.exp(-n)) / 2;
        }
        function cosh(n) {
          return (Math.exp(n) + Math.exp(-n)) / 2;
        }
        function tanh(n) {
          return sinh(n) / cosh(n);
        }
        var r0 = r(0);
        function w(s) {
          return w0 * (cosh(r0) / cosh(r0 + rho * s));
        }
        function u(s) {
          return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2;
        }
        function easeOut2(t) {
          return 1 - Math.pow(1 - t, 1.5);
        }
        var start = Date.now(), S = (r(1) - r0) / rho, duration = options.duration ? 1e3 * options.duration : 1e3 * S * 0.8;
        function frame2() {
          var t = (Date.now() - start) / duration, s = easeOut2(t) * S;
          if (t <= 1) {
            this._flyToFrame = requestAnimFrame(frame2, this);
            this._move(
              this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
              this.getScaleZoom(w0 / w(s), startZoom),
              { flyTo: true }
            );
          } else {
            this._move(targetCenter, targetZoom)._moveEnd(true);
          }
        }
        this._moveStart(true, options.noMoveStart);
        frame2.call(this);
        return this;
      },
      // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
      // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
      flyToBounds: function(bounds, options) {
        var target = this._getBoundsCenterZoom(bounds, options);
        return this.flyTo(target.center, target.zoom, options);
      },
      // @method setMaxBounds(bounds: LatLngBounds): this
      // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
      setMaxBounds: function(bounds) {
        bounds = toLatLngBounds(bounds);
        if (this.listens("moveend", this._panInsideMaxBounds)) {
          this.off("moveend", this._panInsideMaxBounds);
        }
        if (!bounds.isValid()) {
          this.options.maxBounds = null;
          return this;
        }
        this.options.maxBounds = bounds;
        if (this._loaded) {
          this._panInsideMaxBounds();
        }
        return this.on("moveend", this._panInsideMaxBounds);
      },
      // @method setMinZoom(zoom: Number): this
      // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
      setMinZoom: function(zoom2) {
        var oldZoom = this.options.minZoom;
        this.options.minZoom = zoom2;
        if (this._loaded && oldZoom !== zoom2) {
          this.fire("zoomlevelschange");
          if (this.getZoom() < this.options.minZoom) {
            return this.setZoom(zoom2);
          }
        }
        return this;
      },
      // @method setMaxZoom(zoom: Number): this
      // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
      setMaxZoom: function(zoom2) {
        var oldZoom = this.options.maxZoom;
        this.options.maxZoom = zoom2;
        if (this._loaded && oldZoom !== zoom2) {
          this.fire("zoomlevelschange");
          if (this.getZoom() > this.options.maxZoom) {
            return this.setZoom(zoom2);
          }
        }
        return this;
      },
      // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
      // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
      panInsideBounds: function(bounds, options) {
        this._enforcingBounds = true;
        var center = this.getCenter(), newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));
        if (!center.equals(newCenter)) {
          this.panTo(newCenter, options);
        }
        this._enforcingBounds = false;
        return this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(latlng, options) {
        options = options || {};
        var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]), paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]), pixelCenter = this.project(this.getCenter()), pixelPoint = this.project(latlng), pixelBounds = this.getPixelBounds(), paddedBounds = toBounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]), paddedSize = paddedBounds.getSize();
        if (!paddedBounds.contains(pixelPoint)) {
          this._enforcingBounds = true;
          var centerOffset = pixelPoint.subtract(paddedBounds.getCenter());
          var offset = paddedBounds.extend(pixelPoint).getSize().subtract(paddedSize);
          pixelCenter.x += centerOffset.x < 0 ? -offset.x : offset.x;
          pixelCenter.y += centerOffset.y < 0 ? -offset.y : offset.y;
          this.panTo(this.unproject(pixelCenter), options);
          this._enforcingBounds = false;
        }
        return this;
      },
      // @method invalidateSize(options: Zoom/pan options): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default. If `options.pan` is `false`, panning will not occur.
      // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
      // that it doesn't happen often even if the method is called many
      // times in a row.
      // @alternative
      // @method invalidateSize(animate: Boolean): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default.
      invalidateSize: function(options) {
        if (!this._loaded) {
          return this;
        }
        options = extend({
          animate: false,
          pan: true
        }, options === true ? { animate: true } : options);
        var oldSize = this.getSize();
        this._sizeChanged = true;
        this._lastCenter = null;
        var newSize = this.getSize(), oldCenter = oldSize.divideBy(2).round(), newCenter = newSize.divideBy(2).round(), offset = oldCenter.subtract(newCenter);
        if (!offset.x && !offset.y) {
          return this;
        }
        if (options.animate && options.pan) {
          this.panBy(offset);
        } else {
          if (options.pan) {
            this._rawPanBy(offset);
          }
          this.fire("move");
          if (options.debounceMoveend) {
            clearTimeout(this._sizeTimer);
            this._sizeTimer = setTimeout(bind(this.fire, this, "moveend"), 200);
          } else {
            this.fire("moveend");
          }
        }
        return this.fire("resize", {
          oldSize,
          newSize
        });
      },
      // @section Methods for modifying map state
      // @method stop(): this
      // Stops the currently running `panTo` or `flyTo` animation, if any.
      stop: function() {
        this.setZoom(this._limitZoom(this._zoom));
        if (!this.options.zoomSnap) {
          this.fire("viewreset");
        }
        return this._stop();
      },
      // @section Geolocation methods
      // @method locate(options?: Locate options): this
      // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
      // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
      // and optionally sets the map view to the user's location with respect to
      // detection accuracy (or to the world view if geolocation failed).
      // Note that, if your page doesn't use HTTPS, this method will fail in
      // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
      // See `Locate options` for more details.
      locate: function(options) {
        options = this._locateOptions = extend({
          timeout: 1e4,
          watch: false
          // setView: false
          // maxZoom: <Number>
          // maximumAge: 0
          // enableHighAccuracy: false
        }, options);
        if (!("geolocation" in navigator)) {
          this._handleGeolocationError({
            code: 0,
            message: "Geolocation not supported."
          });
          return this;
        }
        var onResponse = bind(this._handleGeolocationResponse, this), onError = bind(this._handleGeolocationError, this);
        if (options.watch) {
          this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
        } else {
          navigator.geolocation.getCurrentPosition(onResponse, onError, options);
        }
        return this;
      },
      // @method stopLocate(): this
      // Stops watching location previously initiated by `map.locate({watch: true})`
      // and aborts resetting the map view if map.locate was called with
      // `{setView: true}`.
      stopLocate: function() {
        if (navigator.geolocation && navigator.geolocation.clearWatch) {
          navigator.geolocation.clearWatch(this._locationWatchId);
        }
        if (this._locateOptions) {
          this._locateOptions.setView = false;
        }
        return this;
      },
      _handleGeolocationError: function(error) {
        if (!this._container._leaflet_id) {
          return;
        }
        var c = error.code, message = error.message || (c === 1 ? "permission denied" : c === 2 ? "position unavailable" : "timeout");
        if (this._locateOptions.setView && !this._loaded) {
          this.fitWorld();
        }
        this.fire("locationerror", {
          code: c,
          message: "Geolocation error: " + message + "."
        });
      },
      _handleGeolocationResponse: function(pos) {
        if (!this._container._leaflet_id) {
          return;
        }
        var lat = pos.coords.latitude, lng = pos.coords.longitude, latlng = new LatLng(lat, lng), bounds = latlng.toBounds(pos.coords.accuracy * 2), options = this._locateOptions;
        if (options.setView) {
          var zoom2 = this.getBoundsZoom(bounds);
          this.setView(latlng, options.maxZoom ? Math.min(zoom2, options.maxZoom) : zoom2);
        }
        var data = {
          latlng,
          bounds,
          timestamp: pos.timestamp
        };
        for (var i in pos.coords) {
          if (typeof pos.coords[i] === "number") {
            data[i] = pos.coords[i];
          }
        }
        this.fire("locationfound", data);
      },
      // TODO Appropriate docs section?
      // @section Other Methods
      // @method addHandler(name: String, HandlerClass: Function): this
      // Adds a new `Handler` to the map, given its name and constructor function.
      addHandler: function(name, HandlerClass) {
        if (!HandlerClass) {
          return this;
        }
        var handler = this[name] = new HandlerClass(this);
        this._handlers.push(handler);
        if (this.options[name]) {
          handler.enable();
        }
        return this;
      },
      // @method remove(): this
      // Destroys the map and clears all related event listeners.
      remove: function() {
        this._initEvents(true);
        if (this.options.maxBounds) {
          this.off("moveend", this._panInsideMaxBounds);
        }
        if (this._containerId !== this._container._leaflet_id) {
          throw new Error("Map container is being reused by another instance");
        }
        try {
          delete this._container._leaflet_id;
          delete this._containerId;
        } catch (e) {
          this._container._leaflet_id = void 0;
          this._containerId = void 0;
        }
        if (this._locationWatchId !== void 0) {
          this.stopLocate();
        }
        this._stop();
        remove(this._mapPane);
        if (this._clearControlPos) {
          this._clearControlPos();
        }
        if (this._resizeRequest) {
          cancelAnimFrame(this._resizeRequest);
          this._resizeRequest = null;
        }
        this._clearHandlers();
        if (this._loaded) {
          this.fire("unload");
        }
        var i;
        for (i in this._layers) {
          this._layers[i].remove();
        }
        for (i in this._panes) {
          remove(this._panes[i]);
        }
        this._layers = [];
        this._panes = [];
        delete this._mapPane;
        delete this._renderer;
        return this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(name, container) {
        var className = "leaflet-pane" + (name ? " leaflet-" + name.replace("Pane", "") + "-pane" : ""), pane = create$1("div", className, container || this._mapPane);
        if (name) {
          this._panes[name] = pane;
        }
        return pane;
      },
      // @section Methods for Getting Map State
      // @method getCenter(): LatLng
      // Returns the geographical center of the map view
      getCenter: function() {
        this._checkIfLoaded();
        if (this._lastCenter && !this._moved()) {
          return this._lastCenter.clone();
        }
        return this.layerPointToLatLng(this._getCenterLayerPoint());
      },
      // @method getZoom(): Number
      // Returns the current zoom level of the map view
      getZoom: function() {
        return this._zoom;
      },
      // @method getBounds(): LatLngBounds
      // Returns the geographical bounds visible in the current map view
      getBounds: function() {
        var bounds = this.getPixelBounds(), sw = this.unproject(bounds.getBottomLeft()), ne = this.unproject(bounds.getTopRight());
        return new LatLngBounds(sw, ne);
      },
      // @method getMinZoom(): Number
      // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
      getMinZoom: function() {
        return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
      },
      // @method getMaxZoom(): Number
      // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
      getMaxZoom: function() {
        return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
      },
      // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
      // Returns the maximum zoom level on which the given bounds fit to the map
      // view in its entirety. If `inside` (optional) is set to `true`, the method
      // instead returns the minimum zoom level on which the map view fits into
      // the given bounds in its entirety.
      getBoundsZoom: function(bounds, inside, padding) {
        bounds = toLatLngBounds(bounds);
        padding = toPoint(padding || [0, 0]);
        var zoom2 = this.getZoom() || 0, min = this.getMinZoom(), max = this.getMaxZoom(), nw = bounds.getNorthWest(), se = bounds.getSouthEast(), size = this.getSize().subtract(padding), boundsSize = toBounds(this.project(se, zoom2), this.project(nw, zoom2)).getSize(), snap = Browser.any3d ? this.options.zoomSnap : 1, scalex = size.x / boundsSize.x, scaley = size.y / boundsSize.y, scale3 = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);
        zoom2 = this.getScaleZoom(scale3, zoom2);
        if (snap) {
          zoom2 = Math.round(zoom2 / (snap / 100)) * (snap / 100);
          zoom2 = inside ? Math.ceil(zoom2 / snap) * snap : Math.floor(zoom2 / snap) * snap;
        }
        return Math.max(min, Math.min(max, zoom2));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        if (!this._size || this._sizeChanged) {
          this._size = new Point(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          );
          this._sizeChanged = false;
        }
        return this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(center, zoom2) {
        var topLeftPoint = this._getTopLeftPoint(center, zoom2);
        return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
      },
      // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
      // the map pane? "left point of the map layer" can be confusing, specially
      // since there can be negative offsets.
      // @method getPixelOrigin(): Point
      // Returns the projected pixel coordinates of the top left point of
      // the map layer (useful in custom layer and overlay implementations).
      getPixelOrigin: function() {
        this._checkIfLoaded();
        return this._pixelOrigin;
      },
      // @method getPixelWorldBounds(zoom?: Number): Bounds
      // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
      // If `zoom` is omitted, the map's current zoom level is used.
      getPixelWorldBounds: function(zoom2) {
        return this.options.crs.getProjectedBounds(zoom2 === void 0 ? this.getZoom() : zoom2);
      },
      // @section Other Methods
      // @method getPane(pane: String|HTMLElement): HTMLElement
      // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
      getPane: function(pane) {
        return typeof pane === "string" ? this._panes[pane] : pane;
      },
      // @method getPanes(): Object
      // Returns a plain object containing the names of all [panes](#map-pane) as keys and
      // the panes as values.
      getPanes: function() {
        return this._panes;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the map.
      getContainer: function() {
        return this._container;
      },
      // @section Conversion Methods
      // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
      // Returns the scale factor to be applied to a map transition from zoom level
      // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
      getZoomScale: function(toZoom, fromZoom) {
        var crs = this.options.crs;
        fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
        return crs.scale(toZoom) / crs.scale(fromZoom);
      },
      // @method getScaleZoom(scale: Number, fromZoom: Number): Number
      // Returns the zoom level that the map would end up at, if it is at `fromZoom`
      // level and everything is scaled by a factor of `scale`. Inverse of
      // [`getZoomScale`](#map-getZoomScale).
      getScaleZoom: function(scale3, fromZoom) {
        var crs = this.options.crs;
        fromZoom = fromZoom === void 0 ? this._zoom : fromZoom;
        var zoom2 = crs.zoom(scale3 * crs.scale(fromZoom));
        return isNaN(zoom2) ? Infinity : zoom2;
      },
      // @method project(latlng: LatLng, zoom: Number): Point
      // Projects a geographical coordinate `LatLng` according to the projection
      // of the map's CRS, then scales it according to `zoom` and the CRS's
      // `Transformation`. The result is pixel coordinate relative to
      // the CRS origin.
      project: function(latlng, zoom2) {
        zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
        return this.options.crs.latLngToPoint(toLatLng(latlng), zoom2);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(point, zoom2) {
        zoom2 = zoom2 === void 0 ? this._zoom : zoom2;
        return this.options.crs.pointToLatLng(toPoint(point), zoom2);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(point) {
        var projectedPoint = toPoint(point).add(this.getPixelOrigin());
        return this.unproject(projectedPoint);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(latlng) {
        var projectedPoint = this.project(toLatLng(latlng))._round();
        return projectedPoint._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(latlng) {
        return this.options.crs.wrapLatLng(toLatLng(latlng));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(latlng) {
        return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(latlng1, latlng2) {
        return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(point) {
        return toPoint(point).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(point) {
        return toPoint(point).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(point) {
        var layerPoint = this.containerPointToLayerPoint(toPoint(point));
        return this.layerPointToLatLng(layerPoint);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(latlng) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(e) {
        return getMousePosition(e, this._container);
      },
      // @method mouseEventToLayerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to
      // the [origin pixel](#map-getpixelorigin) where the event took place.
      mouseEventToLayerPoint: function(e) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
      },
      // @method mouseEventToLatLng(ev: MouseEvent): LatLng
      // Given a MouseEvent object, returns geographical coordinate where the
      // event took place.
      mouseEventToLatLng: function(e) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
      },
      // map initialization methods
      _initContainer: function(id2) {
        var container = this._container = get(id2);
        if (!container) {
          throw new Error("Map container not found.");
        } else if (container._leaflet_id) {
          throw new Error("Map container is already initialized.");
        }
        on(container, "scroll", this._onScroll, this);
        this._containerId = stamp(container);
      },
      _initLayout: function() {
        var container = this._container;
        this._fadeAnimated = this.options.fadeAnimation && Browser.any3d;
        addClass(container, "leaflet-container" + (Browser.touch ? " leaflet-touch" : "") + (Browser.retina ? " leaflet-retina" : "") + (Browser.ielt9 ? " leaflet-oldie" : "") + (Browser.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var position = getStyle(container, "position");
        if (position !== "absolute" && position !== "relative" && position !== "fixed" && position !== "sticky") {
          container.style.position = "relative";
        }
        this._initPanes();
        if (this._initControlPos) {
          this._initControlPos();
        }
      },
      _initPanes: function() {
        var panes = this._panes = {};
        this._paneRenderers = {};
        this._mapPane = this.createPane("mapPane", this._container);
        setPosition(this._mapPane, new Point(0, 0));
        this.createPane("tilePane");
        this.createPane("overlayPane");
        this.createPane("shadowPane");
        this.createPane("markerPane");
        this.createPane("tooltipPane");
        this.createPane("popupPane");
        if (!this.options.markerZoomAnimation) {
          addClass(panes.markerPane, "leaflet-zoom-hide");
          addClass(panes.shadowPane, "leaflet-zoom-hide");
        }
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(center, zoom2, noMoveStart) {
        setPosition(this._mapPane, new Point(0, 0));
        var loading = !this._loaded;
        this._loaded = true;
        zoom2 = this._limitZoom(zoom2);
        this.fire("viewprereset");
        var zoomChanged = this._zoom !== zoom2;
        this._moveStart(zoomChanged, noMoveStart)._move(center, zoom2)._moveEnd(zoomChanged);
        this.fire("viewreset");
        if (loading) {
          this.fire("load");
        }
      },
      _moveStart: function(zoomChanged, noMoveStart) {
        if (zoomChanged) {
          this.fire("zoomstart");
        }
        if (!noMoveStart) {
          this.fire("movestart");
        }
        return this;
      },
      _move: function(center, zoom2, data, supressEvent) {
        if (zoom2 === void 0) {
          zoom2 = this._zoom;
        }
        var zoomChanged = this._zoom !== zoom2;
        this._zoom = zoom2;
        this._lastCenter = center;
        this._pixelOrigin = this._getNewPixelOrigin(center);
        if (!supressEvent) {
          if (zoomChanged || data && data.pinch) {
            this.fire("zoom", data);
          }
          this.fire("move", data);
        } else if (data && data.pinch) {
          this.fire("zoom", data);
        }
        return this;
      },
      _moveEnd: function(zoomChanged) {
        if (zoomChanged) {
          this.fire("zoomend");
        }
        return this.fire("moveend");
      },
      _stop: function() {
        cancelAnimFrame(this._flyToFrame);
        if (this._panAnim) {
          this._panAnim.stop();
        }
        return this;
      },
      _rawPanBy: function(offset) {
        setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
      },
      _getZoomSpan: function() {
        return this.getMaxZoom() - this.getMinZoom();
      },
      _panInsideMaxBounds: function() {
        if (!this._enforcingBounds) {
          this.panInsideBounds(this.options.maxBounds);
        }
      },
      _checkIfLoaded: function() {
        if (!this._loaded) {
          throw new Error("Set map center and zoom first.");
        }
      },
      // DOM event handling
      // @section Interaction events
      _initEvents: function(remove2) {
        this._targets = {};
        this._targets[stamp(this._container)] = this;
        var onOff = remove2 ? off : on;
        onOff(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this);
        if (this.options.trackResize) {
          onOff(window, "resize", this._onResize, this);
        }
        if (Browser.any3d && this.options.transform3DLimit) {
          (remove2 ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        }
      },
      _onResize: function() {
        cancelAnimFrame(this._resizeRequest);
        this._resizeRequest = requestAnimFrame(
          function() {
            this.invalidateSize({ debounceMoveend: true });
          },
          this
        );
      },
      _onScroll: function() {
        this._container.scrollTop = 0;
        this._container.scrollLeft = 0;
      },
      _onMoveEnd: function() {
        var pos = this._getMapPanePos();
        if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
          this._resetView(this.getCenter(), this.getZoom());
        }
      },
      _findEventTargets: function(e, type) {
        var targets = [], target, isHover = type === "mouseout" || type === "mouseover", src = e.target || e.srcElement, dragging = false;
        while (src) {
          target = this._targets[stamp(src)];
          if (target && (type === "click" || type === "preclick") && this._draggableMoved(target)) {
            dragging = true;
            break;
          }
          if (target && target.listens(type, true)) {
            if (isHover && !isExternalTarget(src, e)) {
              break;
            }
            targets.push(target);
            if (isHover) {
              break;
            }
          }
          if (src === this._container) {
            break;
          }
          src = src.parentNode;
        }
        if (!targets.length && !dragging && !isHover && this.listens(type, true)) {
          targets = [this];
        }
        return targets;
      },
      _isClickDisabled: function(el) {
        while (el && el !== this._container) {
          if (el["_leaflet_disable_click"]) {
            return true;
          }
          el = el.parentNode;
        }
      },
      _handleDOMEvent: function(e) {
        var el = e.target || e.srcElement;
        if (!this._loaded || el["_leaflet_disable_events"] || e.type === "click" && this._isClickDisabled(el)) {
          return;
        }
        var type = e.type;
        if (type === "mousedown") {
          preventOutline(el);
        }
        this._fireDOMEvent(e, type);
      },
      _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
      _fireDOMEvent: function(e, type, canvasTargets) {
        if (e.type === "click") {
          var synth = extend({}, e);
          synth.type = "preclick";
          this._fireDOMEvent(synth, synth.type, canvasTargets);
        }
        var targets = this._findEventTargets(e, type);
        if (canvasTargets) {
          var filtered = [];
          for (var i = 0; i < canvasTargets.length; i++) {
            if (canvasTargets[i].listens(type, true)) {
              filtered.push(canvasTargets[i]);
            }
          }
          targets = filtered.concat(targets);
        }
        if (!targets.length) {
          return;
        }
        if (type === "contextmenu") {
          preventDefault(e);
        }
        var target = targets[0];
        var data = {
          originalEvent: e
        };
        if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
          var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
          data.containerPoint = isMarker ? this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
          data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
          data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
        }
        for (i = 0; i < targets.length; i++) {
          targets[i].fire(type, data, true);
          if (data.originalEvent._stopped || targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1) {
            return;
          }
        }
      },
      _draggableMoved: function(obj) {
        obj = obj.dragging && obj.dragging.enabled() ? obj : this;
        return obj.dragging && obj.dragging.moved() || this.boxZoom && this.boxZoom.moved();
      },
      _clearHandlers: function() {
        for (var i = 0, len = this._handlers.length; i < len; i++) {
          this._handlers[i].disable();
        }
      },
      // @section Other Methods
      // @method whenReady(fn: Function, context?: Object): this
      // Runs the given function `fn` when the map gets initialized with
      // a view (center and zoom) and at least one layer, or immediately
      // if it's already initialized, optionally passing a function context.
      whenReady: function(callback, context) {
        if (this._loaded) {
          callback.call(context || this, { target: this });
        } else {
          this.on("load", callback, context);
        }
        return this;
      },
      // private methods for getting map state
      _getMapPanePos: function() {
        return getPosition(this._mapPane) || new Point(0, 0);
      },
      _moved: function() {
        var pos = this._getMapPanePos();
        return pos && !pos.equals([0, 0]);
      },
      _getTopLeftPoint: function(center, zoom2) {
        var pixelOrigin = center && zoom2 !== void 0 ? this._getNewPixelOrigin(center, zoom2) : this.getPixelOrigin();
        return pixelOrigin.subtract(this._getMapPanePos());
      },
      _getNewPixelOrigin: function(center, zoom2) {
        var viewHalf = this.getSize()._divideBy(2);
        return this.project(center, zoom2)._subtract(viewHalf)._add(this._getMapPanePos())._round();
      },
      _latLngToNewLayerPoint: function(latlng, zoom2, center) {
        var topLeft = this._getNewPixelOrigin(center, zoom2);
        return this.project(latlng, zoom2)._subtract(topLeft);
      },
      _latLngBoundsToNewLayerBounds: function(latLngBounds, zoom2, center) {
        var topLeft = this._getNewPixelOrigin(center, zoom2);
        return toBounds([
          this.project(latLngBounds.getSouthWest(), zoom2)._subtract(topLeft),
          this.project(latLngBounds.getNorthWest(), zoom2)._subtract(topLeft),
          this.project(latLngBounds.getSouthEast(), zoom2)._subtract(topLeft),
          this.project(latLngBounds.getNorthEast(), zoom2)._subtract(topLeft)
        ]);
      },
      // layer point of the current center
      _getCenterLayerPoint: function() {
        return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
      },
      // offset of the specified place to the current center in pixels
      _getCenterOffset: function(latlng) {
        return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
      },
      // adjust center for view to get inside bounds
      _limitCenter: function(center, zoom2, bounds) {
        if (!bounds) {
          return center;
        }
        var centerPoint = this.project(center, zoom2), viewHalf = this.getSize().divideBy(2), viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)), offset = this._getBoundsOffset(viewBounds, bounds, zoom2);
        if (Math.abs(offset.x) <= 1 && Math.abs(offset.y) <= 1) {
          return center;
        }
        return this.unproject(centerPoint.add(offset), zoom2);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(offset, bounds) {
        if (!bounds) {
          return offset;
        }
        var viewBounds = this.getPixelBounds(), newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
        return offset.add(this._getBoundsOffset(newBounds, bounds));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(pxBounds, maxBounds, zoom2) {
        var projectedMaxBounds = toBounds(
          this.project(maxBounds.getNorthEast(), zoom2),
          this.project(maxBounds.getSouthWest(), zoom2)
        ), minOffset = projectedMaxBounds.min.subtract(pxBounds.min), maxOffset = projectedMaxBounds.max.subtract(pxBounds.max), dx = this._rebound(minOffset.x, -maxOffset.x), dy = this._rebound(minOffset.y, -maxOffset.y);
        return new Point(dx, dy);
      },
      _rebound: function(left, right) {
        return left + right > 0 ? Math.round(left - right) / 2 : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
      },
      _limitZoom: function(zoom2) {
        var min = this.getMinZoom(), max = this.getMaxZoom(), snap = Browser.any3d ? this.options.zoomSnap : 1;
        if (snap) {
          zoom2 = Math.round(zoom2 / snap) * snap;
        }
        return Math.max(min, Math.min(max, zoom2));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        removeClass(this._mapPane, "leaflet-pan-anim");
        this.fire("moveend");
      },
      _tryAnimatedPan: function(center, options) {
        var offset = this._getCenterOffset(center)._trunc();
        if ((options && options.animate) !== true && !this.getSize().contains(offset)) {
          return false;
        }
        this.panBy(offset, options);
        return true;
      },
      _createAnimProxy: function() {
        var proxy = this._proxy = create$1("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(proxy);
        this.on("zoomanim", function(e) {
          var prop = TRANSFORM, transform = this._proxy.style[prop];
          setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));
          if (transform === this._proxy.style[prop] && this._animatingZoom) {
            this._onZoomTransitionEnd();
          }
        }, this);
        this.on("load moveend", this._animMoveEnd, this);
        this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        remove(this._proxy);
        this.off("load moveend", this._animMoveEnd, this);
        delete this._proxy;
      },
      _animMoveEnd: function() {
        var c = this.getCenter(), z = this.getZoom();
        setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
      },
      _catchTransitionEnd: function(e) {
        if (this._animatingZoom && e.propertyName.indexOf("transform") >= 0) {
          this._onZoomTransitionEnd();
        }
      },
      _nothingToAnimate: function() {
        return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
      },
      _tryAnimatedZoom: function(center, zoom2, options) {
        if (this._animatingZoom) {
          return true;
        }
        options = options || {};
        if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() || Math.abs(zoom2 - this._zoom) > this.options.zoomAnimationThreshold) {
          return false;
        }
        var scale3 = this.getZoomScale(zoom2), offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale3);
        if (options.animate !== true && !this.getSize().contains(offset)) {
          return false;
        }
        requestAnimFrame(function() {
          this._moveStart(true, options.noMoveStart || false)._animateZoom(center, zoom2, true);
        }, this);
        return true;
      },
      _animateZoom: function(center, zoom2, startAnim, noUpdate) {
        if (!this._mapPane) {
          return;
        }
        if (startAnim) {
          this._animatingZoom = true;
          this._animateToCenter = center;
          this._animateToZoom = zoom2;
          addClass(this._mapPane, "leaflet-zoom-anim");
        }
        this.fire("zoomanim", {
          center,
          zoom: zoom2,
          noUpdate
        });
        if (!this._tempFireZoomEvent) {
          this._tempFireZoomEvent = this._zoom !== this._animateToZoom;
        }
        this._move(this._animateToCenter, this._animateToZoom, void 0, true);
        setTimeout(bind(this._onZoomTransitionEnd, this), 250);
      },
      _onZoomTransitionEnd: function() {
        if (!this._animatingZoom) {
          return;
        }
        if (this._mapPane) {
          removeClass(this._mapPane, "leaflet-zoom-anim");
        }
        this._animatingZoom = false;
        this._move(this._animateToCenter, this._animateToZoom, void 0, true);
        if (this._tempFireZoomEvent) {
          this.fire("zoom");
        }
        delete this._tempFireZoomEvent;
        this.fire("move");
        this._moveEnd(true);
      }
    });
    function createMap(id2, options) {
      return new Map2(id2, options);
    }
    var Control = Class.extend({
      // @section
      // @aka Control Options
      options: {
        // @option position: String = 'topright'
        // The position of the control (one of the map corners). Possible values are `'topleft'`,
        // `'topright'`, `'bottomleft'` or `'bottomright'`
        position: "topright"
      },
      initialize: function(options) {
        setOptions(this, options);
      },
      /* @section
       * Classes extending L.Control will inherit the following methods:
       *
       * @method getPosition: string
       * Returns the position of the control.
       */
      getPosition: function() {
        return this.options.position;
      },
      // @method setPosition(position: string): this
      // Sets the position of the control.
      setPosition: function(position) {
        var map = this._map;
        if (map) {
          map.removeControl(this);
        }
        this.options.position = position;
        if (map) {
          map.addControl(this);
        }
        return this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTMLElement that contains the control.
      getContainer: function() {
        return this._container;
      },
      // @method addTo(map: Map): this
      // Adds the control to the given map.
      addTo: function(map) {
        this.remove();
        this._map = map;
        var container = this._container = this.onAdd(map), pos = this.getPosition(), corner = map._controlCorners[pos];
        addClass(container, "leaflet-control");
        if (pos.indexOf("bottom") !== -1) {
          corner.insertBefore(container, corner.firstChild);
        } else {
          corner.appendChild(container);
        }
        this._map.on("unload", this.remove, this);
        return this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        if (!this._map) {
          return this;
        }
        remove(this._container);
        if (this.onRemove) {
          this.onRemove(this._map);
        }
        this._map.off("unload", this.remove, this);
        this._map = null;
        return this;
      },
      _refocusOnMap: function(e) {
        if (this._map && e && e.screenX > 0 && e.screenY > 0) {
          this._map.getContainer().focus();
        }
      }
    });
    var control = function(options) {
      return new Control(options);
    };
    Map2.include({
      // @method addControl(control: Control): this
      // Adds the given control to the map
      addControl: function(control2) {
        control2.addTo(this);
        return this;
      },
      // @method removeControl(control: Control): this
      // Removes the given control from the map
      removeControl: function(control2) {
        control2.remove();
        return this;
      },
      _initControlPos: function() {
        var corners = this._controlCorners = {}, l = "leaflet-", container = this._controlContainer = create$1("div", l + "control-container", this._container);
        function createCorner(vSide, hSide) {
          var className = l + vSide + " " + l + hSide;
          corners[vSide + hSide] = create$1("div", className, container);
        }
        createCorner("top", "left");
        createCorner("top", "right");
        createCorner("bottom", "left");
        createCorner("bottom", "right");
      },
      _clearControlPos: function() {
        for (var i in this._controlCorners) {
          remove(this._controlCorners[i]);
        }
        remove(this._controlContainer);
        delete this._controlCorners;
        delete this._controlContainer;
      }
    });
    var Layers = Control.extend({
      // @section
      // @aka Control.Layers options
      options: {
        // @option collapsed: Boolean = true
        // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
        collapsed: true,
        position: "topright",
        // @option autoZIndex: Boolean = true
        // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
        autoZIndex: true,
        // @option hideSingleBase: Boolean = false
        // If `true`, the base layers in the control will be hidden when there is only one.
        hideSingleBase: false,
        // @option sortLayers: Boolean = false
        // Whether to sort the layers. When `false`, layers will keep the order
        // in which they were added to the control.
        sortLayers: false,
        // @option sortFunction: Function = *
        // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
        // that will be used for sorting the layers, when `sortLayers` is `true`.
        // The function receives both the `L.Layer` instances and their names, as in
        // `sortFunction(layerA, layerB, nameA, nameB)`.
        // By default, it sorts layers alphabetically by their name.
        sortFunction: function(layerA, layerB, nameA, nameB) {
          return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
        }
      },
      initialize: function(baseLayers, overlays, options) {
        setOptions(this, options);
        this._layerControlInputs = [];
        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._preventClick = false;
        for (var i in baseLayers) {
          this._addLayer(baseLayers[i], i);
        }
        for (i in overlays) {
          this._addLayer(overlays[i], i, true);
        }
      },
      onAdd: function(map) {
        this._initLayout();
        this._update();
        this._map = map;
        map.on("zoomend", this._checkDisabledLayers, this);
        for (var i = 0; i < this._layers.length; i++) {
          this._layers[i].layer.on("add remove", this._onLayerChange, this);
        }
        return this._container;
      },
      addTo: function(map) {
        Control.prototype.addTo.call(this, map);
        return this._expandIfNotCollapsed();
      },
      onRemove: function() {
        this._map.off("zoomend", this._checkDisabledLayers, this);
        for (var i = 0; i < this._layers.length; i++) {
          this._layers[i].layer.off("add remove", this._onLayerChange, this);
        }
      },
      // @method addBaseLayer(layer: Layer, name: String): this
      // Adds a base layer (radio button entry) with the given name to the control.
      addBaseLayer: function(layer, name) {
        this._addLayer(layer, name);
        return this._map ? this._update() : this;
      },
      // @method addOverlay(layer: Layer, name: String): this
      // Adds an overlay (checkbox entry) with the given name to the control.
      addOverlay: function(layer, name) {
        this._addLayer(layer, name, true);
        return this._map ? this._update() : this;
      },
      // @method removeLayer(layer: Layer): this
      // Remove the given layer from the control.
      removeLayer: function(layer) {
        layer.off("add remove", this._onLayerChange, this);
        var obj = this._getLayer(stamp(layer));
        if (obj) {
          this._layers.splice(this._layers.indexOf(obj), 1);
        }
        return this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        addClass(this._container, "leaflet-control-layers-expanded");
        this._section.style.height = null;
        var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
        if (acceptableHeight < this._section.clientHeight) {
          addClass(this._section, "leaflet-control-layers-scrollbar");
          this._section.style.height = acceptableHeight + "px";
        } else {
          removeClass(this._section, "leaflet-control-layers-scrollbar");
        }
        this._checkDisabledLayers();
        return this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        removeClass(this._container, "leaflet-control-layers-expanded");
        return this;
      },
      _initLayout: function() {
        var className = "leaflet-control-layers", container = this._container = create$1("div", className), collapsed = this.options.collapsed;
        container.setAttribute("aria-haspopup", true);
        disableClickPropagation(container);
        disableScrollPropagation(container);
        var section = this._section = create$1("section", className + "-list");
        if (collapsed) {
          this._map.on("click", this.collapse, this);
          on(container, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this);
        }
        var link = this._layersLink = create$1("a", className + "-toggle", container);
        link.href = "#";
        link.title = "Layers";
        link.setAttribute("role", "button");
        on(link, {
          keydown: function(e) {
            if (e.keyCode === 13) {
              this._expandSafely();
            }
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(e) {
            preventDefault(e);
            this._expandSafely();
          }
        }, this);
        if (!collapsed) {
          this.expand();
        }
        this._baseLayersList = create$1("div", className + "-base", section);
        this._separator = create$1("div", className + "-separator", section);
        this._overlaysList = create$1("div", className + "-overlays", section);
        container.appendChild(section);
      },
      _getLayer: function(id2) {
        for (var i = 0; i < this._layers.length; i++) {
          if (this._layers[i] && stamp(this._layers[i].layer) === id2) {
            return this._layers[i];
          }
        }
      },
      _addLayer: function(layer, name, overlay) {
        if (this._map) {
          layer.on("add remove", this._onLayerChange, this);
        }
        this._layers.push({
          layer,
          name,
          overlay
        });
        if (this.options.sortLayers) {
          this._layers.sort(bind(function(a, b) {
            return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
          }, this));
        }
        if (this.options.autoZIndex && layer.setZIndex) {
          this._lastZIndex++;
          layer.setZIndex(this._lastZIndex);
        }
        this._expandIfNotCollapsed();
      },
      _update: function() {
        if (!this._container) {
          return this;
        }
        empty(this._baseLayersList);
        empty(this._overlaysList);
        this._layerControlInputs = [];
        var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
        for (i = 0; i < this._layers.length; i++) {
          obj = this._layers[i];
          this._addItem(obj);
          overlaysPresent = overlaysPresent || obj.overlay;
          baseLayersPresent = baseLayersPresent || !obj.overlay;
          baseLayersCount += !obj.overlay ? 1 : 0;
        }
        if (this.options.hideSingleBase) {
          baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
          this._baseLayersList.style.display = baseLayersPresent ? "" : "none";
        }
        this._separator.style.display = overlaysPresent && baseLayersPresent ? "" : "none";
        return this;
      },
      _onLayerChange: function(e) {
        if (!this._handlingClick) {
          this._update();
        }
        var obj = this._getLayer(stamp(e.target));
        var type = obj.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
        if (type) {
          this._map.fire(type, obj);
        }
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(name, checked) {
        var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"' + (checked ? ' checked="checked"' : "") + "/>";
        var radioFragment = document.createElement("div");
        radioFragment.innerHTML = radioHtml;
        return radioFragment.firstChild;
      },
      _addItem: function(obj) {
        var label = document.createElement("label"), checked = this._map.hasLayer(obj.layer), input;
        if (obj.overlay) {
          input = document.createElement("input");
          input.type = "checkbox";
          input.className = "leaflet-control-layers-selector";
          input.defaultChecked = checked;
        } else {
          input = this._createRadioElement("leaflet-base-layers_" + stamp(this), checked);
        }
        this._layerControlInputs.push(input);
        input.layerId = stamp(obj.layer);
        on(input, "click", this._onInputClick, this);
        var name = document.createElement("span");
        name.innerHTML = " " + obj.name;
        var holder = document.createElement("span");
        label.appendChild(holder);
        holder.appendChild(input);
        holder.appendChild(name);
        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(label);
        this._checkDisabledLayers();
        return label;
      },
      _onInputClick: function() {
        if (this._preventClick) {
          return;
        }
        var inputs = this._layerControlInputs, input, layer;
        var addedLayers = [], removedLayers = [];
        this._handlingClick = true;
        for (var i = inputs.length - 1; i >= 0; i--) {
          input = inputs[i];
          layer = this._getLayer(input.layerId).layer;
          if (input.checked) {
            addedLayers.push(layer);
          } else if (!input.checked) {
            removedLayers.push(layer);
          }
        }
        for (i = 0; i < removedLayers.length; i++) {
          if (this._map.hasLayer(removedLayers[i])) {
            this._map.removeLayer(removedLayers[i]);
          }
        }
        for (i = 0; i < addedLayers.length; i++) {
          if (!this._map.hasLayer(addedLayers[i])) {
            this._map.addLayer(addedLayers[i]);
          }
        }
        this._handlingClick = false;
        this._refocusOnMap();
      },
      _checkDisabledLayers: function() {
        var inputs = this._layerControlInputs, input, layer, zoom2 = this._map.getZoom();
        for (var i = inputs.length - 1; i >= 0; i--) {
          input = inputs[i];
          layer = this._getLayer(input.layerId).layer;
          input.disabled = layer.options.minZoom !== void 0 && zoom2 < layer.options.minZoom || layer.options.maxZoom !== void 0 && zoom2 > layer.options.maxZoom;
        }
      },
      _expandIfNotCollapsed: function() {
        if (this._map && !this.options.collapsed) {
          this.expand();
        }
        return this;
      },
      _expandSafely: function() {
        var section = this._section;
        this._preventClick = true;
        on(section, "click", preventDefault);
        this.expand();
        var that = this;
        setTimeout(function() {
          off(section, "click", preventDefault);
          that._preventClick = false;
        });
      }
    });
    var layers = function(baseLayers, overlays, options) {
      return new Layers(baseLayers, overlays, options);
    };
    var Zoom = Control.extend({
      // @section
      // @aka Control.Zoom options
      options: {
        position: "topleft",
        // @option zoomInText: String = '<span aria-hidden="true">+</span>'
        // The text set on the 'zoom in' button.
        zoomInText: '<span aria-hidden="true">+</span>',
        // @option zoomInTitle: String = 'Zoom in'
        // The title set on the 'zoom in' button.
        zoomInTitle: "Zoom in",
        // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
        // The text set on the 'zoom out' button.
        zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
        // @option zoomOutTitle: String = 'Zoom out'
        // The title set on the 'zoom out' button.
        zoomOutTitle: "Zoom out"
      },
      onAdd: function(map) {
        var zoomName = "leaflet-control-zoom", container = create$1("div", zoomName + " leaflet-bar"), options = this.options;
        this._zoomInButton = this._createButton(
          options.zoomInText,
          options.zoomInTitle,
          zoomName + "-in",
          container,
          this._zoomIn
        );
        this._zoomOutButton = this._createButton(
          options.zoomOutText,
          options.zoomOutTitle,
          zoomName + "-out",
          container,
          this._zoomOut
        );
        this._updateDisabled();
        map.on("zoomend zoomlevelschange", this._updateDisabled, this);
        return container;
      },
      onRemove: function(map) {
        map.off("zoomend zoomlevelschange", this._updateDisabled, this);
      },
      disable: function() {
        this._disabled = true;
        this._updateDisabled();
        return this;
      },
      enable: function() {
        this._disabled = false;
        this._updateDisabled();
        return this;
      },
      _zoomIn: function(e) {
        if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
          this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
        }
      },
      _zoomOut: function(e) {
        if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
          this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
        }
      },
      _createButton: function(html, title, className, container, fn) {
        var link = create$1("a", className, container);
        link.innerHTML = html;
        link.href = "#";
        link.title = title;
        link.setAttribute("role", "button");
        link.setAttribute("aria-label", title);
        disableClickPropagation(link);
        on(link, "click", stop);
        on(link, "click", fn, this);
        on(link, "click", this._refocusOnMap, this);
        return link;
      },
      _updateDisabled: function() {
        var map = this._map, className = "leaflet-disabled";
        removeClass(this._zoomInButton, className);
        removeClass(this._zoomOutButton, className);
        this._zoomInButton.setAttribute("aria-disabled", "false");
        this._zoomOutButton.setAttribute("aria-disabled", "false");
        if (this._disabled || map._zoom === map.getMinZoom()) {
          addClass(this._zoomOutButton, className);
          this._zoomOutButton.setAttribute("aria-disabled", "true");
        }
        if (this._disabled || map._zoom === map.getMaxZoom()) {
          addClass(this._zoomInButton, className);
          this._zoomInButton.setAttribute("aria-disabled", "true");
        }
      }
    });
    Map2.mergeOptions({
      zoomControl: true
    });
    Map2.addInitHook(function() {
      if (this.options.zoomControl) {
        this.zoomControl = new Zoom();
        this.addControl(this.zoomControl);
      }
    });
    var zoom = function(options) {
      return new Zoom(options);
    };
    var Scale = Control.extend({
      // @section
      // @aka Control.Scale options
      options: {
        position: "bottomleft",
        // @option maxWidth: Number = 100
        // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
        maxWidth: 100,
        // @option metric: Boolean = True
        // Whether to show the metric scale line (m/km).
        metric: true,
        // @option imperial: Boolean = True
        // Whether to show the imperial scale line (mi/ft).
        imperial: true
        // @option updateWhenIdle: Boolean = false
        // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
      },
      onAdd: function(map) {
        var className = "leaflet-control-scale", container = create$1("div", className), options = this.options;
        this._addScales(options, className + "-line", container);
        map.on(options.updateWhenIdle ? "moveend" : "move", this._update, this);
        map.whenReady(this._update, this);
        return container;
      },
      onRemove: function(map) {
        map.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(options, className, container) {
        if (options.metric) {
          this._mScale = create$1("div", className, container);
        }
        if (options.imperial) {
          this._iScale = create$1("div", className, container);
        }
      },
      _update: function() {
        var map = this._map, y = map.getSize().y / 2;
        var maxMeters = map.distance(
          map.containerPointToLatLng([0, y]),
          map.containerPointToLatLng([this.options.maxWidth, y])
        );
        this._updateScales(maxMeters);
      },
      _updateScales: function(maxMeters) {
        if (this.options.metric && maxMeters) {
          this._updateMetric(maxMeters);
        }
        if (this.options.imperial && maxMeters) {
          this._updateImperial(maxMeters);
        }
      },
      _updateMetric: function(maxMeters) {
        var meters = this._getRoundNum(maxMeters), label = meters < 1e3 ? meters + " m" : meters / 1e3 + " km";
        this._updateScale(this._mScale, label, meters / maxMeters);
      },
      _updateImperial: function(maxMeters) {
        var maxFeet = maxMeters * 3.2808399, maxMiles, miles, feet;
        if (maxFeet > 5280) {
          maxMiles = maxFeet / 5280;
          miles = this._getRoundNum(maxMiles);
          this._updateScale(this._iScale, miles + " mi", miles / maxMiles);
        } else {
          feet = this._getRoundNum(maxFeet);
          this._updateScale(this._iScale, feet + " ft", feet / maxFeet);
        }
      },
      _updateScale: function(scale3, text, ratio) {
        scale3.style.width = Math.round(this.options.maxWidth * ratio) + "px";
        scale3.innerHTML = text;
      },
      _getRoundNum: function(num) {
        var pow10 = Math.pow(10, (Math.floor(num) + "").length - 1), d = num / pow10;
        d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
        return pow10 * d;
      }
    });
    var scale2 = function(options) {
      return new Scale(options);
    };
    var ukrainianFlag = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>';
    var Attribution = Control.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (Browser.inlineSvg ? ukrainianFlag + " " : "") + "Leaflet</a>"
      },
      initialize: function(options) {
        setOptions(this, options);
        this._attributions = {};
      },
      onAdd: function(map) {
        map.attributionControl = this;
        this._container = create$1("div", "leaflet-control-attribution");
        disableClickPropagation(this._container);
        for (var i in map._layers) {
          if (map._layers[i].getAttribution) {
            this.addAttribution(map._layers[i].getAttribution());
          }
        }
        this._update();
        map.on("layeradd", this._addAttribution, this);
        return this._container;
      },
      onRemove: function(map) {
        map.off("layeradd", this._addAttribution, this);
      },
      _addAttribution: function(ev) {
        if (ev.layer.getAttribution) {
          this.addAttribution(ev.layer.getAttribution());
          ev.layer.once("remove", function() {
            this.removeAttribution(ev.layer.getAttribution());
          }, this);
        }
      },
      // @method setPrefix(prefix: String|false): this
      // The HTML text shown before the attributions. Pass `false` to disable.
      setPrefix: function(prefix) {
        this.options.prefix = prefix;
        this._update();
        return this;
      },
      // @method addAttribution(text: String): this
      // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
      addAttribution: function(text) {
        if (!text) {
          return this;
        }
        if (!this._attributions[text]) {
          this._attributions[text] = 0;
        }
        this._attributions[text]++;
        this._update();
        return this;
      },
      // @method removeAttribution(text: String): this
      // Removes an attribution text.
      removeAttribution: function(text) {
        if (!text) {
          return this;
        }
        if (this._attributions[text]) {
          this._attributions[text]--;
          this._update();
        }
        return this;
      },
      _update: function() {
        if (!this._map) {
          return;
        }
        var attribs = [];
        for (var i in this._attributions) {
          if (this._attributions[i]) {
            attribs.push(i);
          }
        }
        var prefixAndAttribs = [];
        if (this.options.prefix) {
          prefixAndAttribs.push(this.options.prefix);
        }
        if (attribs.length) {
          prefixAndAttribs.push(attribs.join(", "));
        }
        this._container.innerHTML = prefixAndAttribs.join(' <span aria-hidden="true">|</span> ');
      }
    });
    Map2.mergeOptions({
      attributionControl: true
    });
    Map2.addInitHook(function() {
      if (this.options.attributionControl) {
        new Attribution().addTo(this);
      }
    });
    var attribution = function(options) {
      return new Attribution(options);
    };
    Control.Layers = Layers;
    Control.Zoom = Zoom;
    Control.Scale = Scale;
    Control.Attribution = Attribution;
    control.layers = layers;
    control.zoom = zoom;
    control.scale = scale2;
    control.attribution = attribution;
    var Handler = Class.extend({
      initialize: function(map) {
        this._map = map;
      },
      // @method enable(): this
      // Enables the handler
      enable: function() {
        if (this._enabled) {
          return this;
        }
        this._enabled = true;
        this.addHooks();
        return this;
      },
      // @method disable(): this
      // Disables the handler
      disable: function() {
        if (!this._enabled) {
          return this;
        }
        this._enabled = false;
        this.removeHooks();
        return this;
      },
      // @method enabled(): Boolean
      // Returns `true` if the handler is enabled
      enabled: function() {
        return !!this._enabled;
      }
      // @section Extension methods
      // Classes inheriting from `Handler` must implement the two following methods:
      // @method addHooks()
      // Called when the handler is enabled, should add event hooks.
      // @method removeHooks()
      // Called when the handler is disabled, should remove the event hooks added previously.
    });
    Handler.addTo = function(map, name) {
      map.addHandler(name, this);
      return this;
    };
    var Mixin = { Events };
    var START = Browser.touch ? "touchstart mousedown" : "mousedown";
    var Draggable = Evented.extend({
      options: {
        // @section
        // @aka Draggable options
        // @option clickTolerance: Number = 3
        // The max number of pixels a user can shift the mouse pointer during a click
        // for it to be considered a valid click (as opposed to a mouse drag).
        clickTolerance: 3
      },
      // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
      // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
      initialize: function(element, dragStartTarget, preventOutline2, options) {
        setOptions(this, options);
        this._element = element;
        this._dragStartTarget = dragStartTarget || element;
        this._preventOutline = preventOutline2;
      },
      // @method enable()
      // Enables the dragging ability
      enable: function() {
        if (this._enabled) {
          return;
        }
        on(this._dragStartTarget, START, this._onDown, this);
        this._enabled = true;
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        if (!this._enabled) {
          return;
        }
        if (Draggable._dragging === this) {
          this.finishDrag(true);
        }
        off(this._dragStartTarget, START, this._onDown, this);
        this._enabled = false;
        this._moved = false;
      },
      _onDown: function(e) {
        if (!this._enabled) {
          return;
        }
        this._moved = false;
        if (hasClass(this._element, "leaflet-zoom-anim")) {
          return;
        }
        if (e.touches && e.touches.length !== 1) {
          if (Draggable._dragging === this) {
            this.finishDrag();
          }
          return;
        }
        if (Draggable._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) {
          return;
        }
        Draggable._dragging = this;
        if (this._preventOutline) {
          preventOutline(this._element);
        }
        disableImageDrag();
        disableTextSelection();
        if (this._moving) {
          return;
        }
        this.fire("down");
        var first = e.touches ? e.touches[0] : e, sizedParent = getSizedParentNode(this._element);
        this._startPoint = new Point(first.clientX, first.clientY);
        this._startPos = getPosition(this._element);
        this._parentScale = getScale(sizedParent);
        var mouseevent = e.type === "mousedown";
        on(document, mouseevent ? "mousemove" : "touchmove", this._onMove, this);
        on(document, mouseevent ? "mouseup" : "touchend touchcancel", this._onUp, this);
      },
      _onMove: function(e) {
        if (!this._enabled) {
          return;
        }
        if (e.touches && e.touches.length > 1) {
          this._moved = true;
          return;
        }
        var first = e.touches && e.touches.length === 1 ? e.touches[0] : e, offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);
        if (!offset.x && !offset.y) {
          return;
        }
        if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) {
          return;
        }
        offset.x /= this._parentScale.x;
        offset.y /= this._parentScale.y;
        preventDefault(e);
        if (!this._moved) {
          this.fire("dragstart");
          this._moved = true;
          addClass(document.body, "leaflet-dragging");
          this._lastTarget = e.target || e.srcElement;
          if (window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance) {
            this._lastTarget = this._lastTarget.correspondingUseElement;
          }
          addClass(this._lastTarget, "leaflet-drag-target");
        }
        this._newPos = this._startPos.add(offset);
        this._moving = true;
        this._lastEvent = e;
        this._updatePosition();
      },
      _updatePosition: function() {
        var e = { originalEvent: this._lastEvent };
        this.fire("predrag", e);
        setPosition(this._element, this._newPos);
        this.fire("drag", e);
      },
      _onUp: function() {
        if (!this._enabled) {
          return;
        }
        this.finishDrag();
      },
      finishDrag: function(noInertia) {
        removeClass(document.body, "leaflet-dragging");
        if (this._lastTarget) {
          removeClass(this._lastTarget, "leaflet-drag-target");
          this._lastTarget = null;
        }
        off(document, "mousemove touchmove", this._onMove, this);
        off(document, "mouseup touchend touchcancel", this._onUp, this);
        enableImageDrag();
        enableTextSelection();
        var fireDragend = this._moved && this._moving;
        this._moving = false;
        Draggable._dragging = false;
        if (fireDragend) {
          this.fire("dragend", {
            noInertia,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      }
    });
    function clipPolygon(points, bounds, round) {
      var clippedPoints, edges = [1, 4, 2, 8], i, j, k, a, b, len, edge2, p;
      for (i = 0, len = points.length; i < len; i++) {
        points[i]._code = _getBitCode(points[i], bounds);
      }
      for (k = 0; k < 4; k++) {
        edge2 = edges[k];
        clippedPoints = [];
        for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
          a = points[i];
          b = points[j];
          if (!(a._code & edge2)) {
            if (b._code & edge2) {
              p = _getEdgeIntersection(b, a, edge2, bounds, round);
              p._code = _getBitCode(p, bounds);
              clippedPoints.push(p);
            }
            clippedPoints.push(a);
          } else if (!(b._code & edge2)) {
            p = _getEdgeIntersection(b, a, edge2, bounds, round);
            p._code = _getBitCode(p, bounds);
            clippedPoints.push(p);
          }
        }
        points = clippedPoints;
      }
      return points;
    }
    function polygonCenter(latlngs, crs) {
      var i, j, p1, p2, f, area, x, y, center;
      if (!latlngs || latlngs.length === 0) {
        throw new Error("latlngs not passed");
      }
      if (!isFlat(latlngs)) {
        console.warn("latlngs are not flat! Only the first ring will be used");
        latlngs = latlngs[0];
      }
      var centroidLatLng = toLatLng([0, 0]);
      var bounds = toLatLngBounds(latlngs);
      var areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
      if (areaBounds < 1700) {
        centroidLatLng = centroid(latlngs);
      }
      var len = latlngs.length;
      var points = [];
      for (i = 0; i < len; i++) {
        var latlng = toLatLng(latlngs[i]);
        points.push(crs.project(toLatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
      }
      area = x = y = 0;
      for (i = 0, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];
        f = p1.y * p2.x - p2.y * p1.x;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
        area += f * 3;
      }
      if (area === 0) {
        center = points[0];
      } else {
        center = [x / area, y / area];
      }
      var latlngCenter = crs.unproject(toPoint(center));
      return toLatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
    }
    function centroid(coords) {
      var latSum = 0;
      var lngSum = 0;
      var len = 0;
      for (var i = 0; i < coords.length; i++) {
        var latlng = toLatLng(coords[i]);
        latSum += latlng.lat;
        lngSum += latlng.lng;
        len++;
      }
      return toLatLng([latSum / len, lngSum / len]);
    }
    var PolyUtil = {
      __proto__: null,
      clipPolygon,
      polygonCenter,
      centroid
    };
    function simplify(points, tolerance) {
      if (!tolerance || !points.length) {
        return points.slice();
      }
      var sqTolerance = tolerance * tolerance;
      points = _reducePoints(points, sqTolerance);
      points = _simplifyDP(points, sqTolerance);
      return points;
    }
    function pointToSegmentDistance(p, p1, p2) {
      return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
    }
    function closestPointOnSegment(p, p1, p2) {
      return _sqClosestPointOnSegment(p, p1, p2);
    }
    function _simplifyDP(points, sqTolerance) {
      var len = points.length, ArrayConstructor = typeof Uint8Array !== "undefined" ? Uint8Array : Array, markers = new ArrayConstructor(len);
      markers[0] = markers[len - 1] = 1;
      _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
      var i, newPoints = [];
      for (i = 0; i < len; i++) {
        if (markers[i]) {
          newPoints.push(points[i]);
        }
      }
      return newPoints;
    }
    function _simplifyDPStep(points, markers, sqTolerance, first, last) {
      var maxSqDist = 0, index2, i, sqDist;
      for (i = first + 1; i <= last - 1; i++) {
        sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);
        if (sqDist > maxSqDist) {
          index2 = i;
          maxSqDist = sqDist;
        }
      }
      if (maxSqDist > sqTolerance) {
        markers[index2] = 1;
        _simplifyDPStep(points, markers, sqTolerance, first, index2);
        _simplifyDPStep(points, markers, sqTolerance, index2, last);
      }
    }
    function _reducePoints(points, sqTolerance) {
      var reducedPoints = [points[0]];
      for (var i = 1, prev = 0, len = points.length; i < len; i++) {
        if (_sqDist(points[i], points[prev]) > sqTolerance) {
          reducedPoints.push(points[i]);
          prev = i;
        }
      }
      if (prev < len - 1) {
        reducedPoints.push(points[len - 1]);
      }
      return reducedPoints;
    }
    var _lastCode;
    function clipSegment(a, b, bounds, useLastCode, round) {
      var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds), codeB = _getBitCode(b, bounds), codeOut, p, newCode;
      _lastCode = codeB;
      while (true) {
        if (!(codeA | codeB)) {
          return [a, b];
        }
        if (codeA & codeB) {
          return false;
        }
        codeOut = codeA || codeB;
        p = _getEdgeIntersection(a, b, codeOut, bounds, round);
        newCode = _getBitCode(p, bounds);
        if (codeOut === codeA) {
          a = p;
          codeA = newCode;
        } else {
          b = p;
          codeB = newCode;
        }
      }
    }
    function _getEdgeIntersection(a, b, code, bounds, round) {
      var dx = b.x - a.x, dy = b.y - a.y, min = bounds.min, max = bounds.max, x, y;
      if (code & 8) {
        x = a.x + dx * (max.y - a.y) / dy;
        y = max.y;
      } else if (code & 4) {
        x = a.x + dx * (min.y - a.y) / dy;
        y = min.y;
      } else if (code & 2) {
        x = max.x;
        y = a.y + dy * (max.x - a.x) / dx;
      } else if (code & 1) {
        x = min.x;
        y = a.y + dy * (min.x - a.x) / dx;
      }
      return new Point(x, y, round);
    }
    function _getBitCode(p, bounds) {
      var code = 0;
      if (p.x < bounds.min.x) {
        code |= 1;
      } else if (p.x > bounds.max.x) {
        code |= 2;
      }
      if (p.y < bounds.min.y) {
        code |= 4;
      } else if (p.y > bounds.max.y) {
        code |= 8;
      }
      return code;
    }
    function _sqDist(p1, p2) {
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      return dx * dx + dy * dy;
    }
    function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
      var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y, dot = dx * dx + dy * dy, t;
      if (dot > 0) {
        t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
        if (t > 1) {
          x = p2.x;
          y = p2.y;
        } else if (t > 0) {
          x += dx * t;
          y += dy * t;
        }
      }
      dx = p.x - x;
      dy = p.y - y;
      return sqDist ? dx * dx + dy * dy : new Point(x, y);
    }
    function isFlat(latlngs) {
      return !isArray(latlngs[0]) || typeof latlngs[0][0] !== "object" && typeof latlngs[0][0] !== "undefined";
    }
    function _flat(latlngs) {
      console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead.");
      return isFlat(latlngs);
    }
    function polylineCenter(latlngs, crs) {
      var i, halfDist, segDist, dist, p1, p2, ratio, center;
      if (!latlngs || latlngs.length === 0) {
        throw new Error("latlngs not passed");
      }
      if (!isFlat(latlngs)) {
        console.warn("latlngs are not flat! Only the first ring will be used");
        latlngs = latlngs[0];
      }
      var centroidLatLng = toLatLng([0, 0]);
      var bounds = toLatLngBounds(latlngs);
      var areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
      if (areaBounds < 1700) {
        centroidLatLng = centroid(latlngs);
      }
      var len = latlngs.length;
      var points = [];
      for (i = 0; i < len; i++) {
        var latlng = toLatLng(latlngs[i]);
        points.push(crs.project(toLatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
      }
      for (i = 0, halfDist = 0; i < len - 1; i++) {
        halfDist += points[i].distanceTo(points[i + 1]) / 2;
      }
      if (halfDist === 0) {
        center = points[0];
      } else {
        for (i = 0, dist = 0; i < len - 1; i++) {
          p1 = points[i];
          p2 = points[i + 1];
          segDist = p1.distanceTo(p2);
          dist += segDist;
          if (dist > halfDist) {
            ratio = (dist - halfDist) / segDist;
            center = [
              p2.x - ratio * (p2.x - p1.x),
              p2.y - ratio * (p2.y - p1.y)
            ];
            break;
          }
        }
      }
      var latlngCenter = crs.unproject(toPoint(center));
      return toLatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
    }
    var LineUtil = {
      __proto__: null,
      simplify,
      pointToSegmentDistance,
      closestPointOnSegment,
      clipSegment,
      _getEdgeIntersection,
      _getBitCode,
      _sqClosestPointOnSegment,
      isFlat,
      _flat,
      polylineCenter
    };
    var LonLat = {
      project: function(latlng) {
        return new Point(latlng.lng, latlng.lat);
      },
      unproject: function(point) {
        return new LatLng(point.y, point.x);
      },
      bounds: new Bounds([-180, -90], [180, 90])
    };
    var Mercator = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new Bounds([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(latlng) {
        var d = Math.PI / 180, r = this.R, y = latlng.lat * d, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), con = e * Math.sin(y);
        var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
        y = -r * Math.log(Math.max(ts, 1e-10));
        return new Point(latlng.lng * d * r, y);
      },
      unproject: function(point) {
        var d = 180 / Math.PI, r = this.R, tmp = this.R_MINOR / r, e = Math.sqrt(1 - tmp * tmp), ts = Math.exp(-point.y / r), phi = Math.PI / 2 - 2 * Math.atan(ts);
        for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
          con = e * Math.sin(phi);
          con = Math.pow((1 - con) / (1 + con), e / 2);
          dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
          phi += dphi;
        }
        return new LatLng(phi * d, point.x * d / r);
      }
    };
    var index = {
      __proto__: null,
      LonLat,
      Mercator,
      SphericalMercator
    };
    var EPSG3395 = extend({}, Earth, {
      code: "EPSG:3395",
      projection: Mercator,
      transformation: function() {
        var scale3 = 0.5 / (Math.PI * Mercator.R);
        return toTransformation(scale3, 0.5, -scale3, 0.5);
      }()
    });
    var EPSG4326 = extend({}, Earth, {
      code: "EPSG:4326",
      projection: LonLat,
      transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
    });
    var Simple = extend({}, CRS, {
      projection: LonLat,
      transformation: toTransformation(1, 0, -1, 0),
      scale: function(zoom2) {
        return Math.pow(2, zoom2);
      },
      zoom: function(scale3) {
        return Math.log(scale3) / Math.LN2;
      },
      distance: function(latlng1, latlng2) {
        var dx = latlng2.lng - latlng1.lng, dy = latlng2.lat - latlng1.lat;
        return Math.sqrt(dx * dx + dy * dy);
      },
      infinite: true
    });
    CRS.Earth = Earth;
    CRS.EPSG3395 = EPSG3395;
    CRS.EPSG3857 = EPSG3857;
    CRS.EPSG900913 = EPSG900913;
    CRS.EPSG4326 = EPSG4326;
    CRS.Simple = Simple;
    var Layer = Evented.extend({
      // Classes extending `L.Layer` will inherit the following options:
      options: {
        // @option pane: String = 'overlayPane'
        // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
        pane: "overlayPane",
        // @option attribution: String = null
        // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
        attribution: null,
        bubblingMouseEvents: true
      },
      /* @section
       * Classes extending `L.Layer` will inherit the following methods:
       *
       * @method addTo(map: Map|LayerGroup): this
       * Adds the layer to the given map or layer group.
       */
      addTo: function(map) {
        map.addLayer(this);
        return this;
      },
      // @method remove: this
      // Removes the layer from the map it is currently active on.
      remove: function() {
        return this.removeFrom(this._map || this._mapToAdd);
      },
      // @method removeFrom(map: Map): this
      // Removes the layer from the given map
      //
      // @alternative
      // @method removeFrom(group: LayerGroup): this
      // Removes the layer from the given `LayerGroup`
      removeFrom: function(obj) {
        if (obj) {
          obj.removeLayer(this);
        }
        return this;
      },
      // @method getPane(name? : String): HTMLElement
      // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
      getPane: function(name) {
        return this._map.getPane(name ? this.options[name] || name : this.options.pane);
      },
      addInteractiveTarget: function(targetEl) {
        this._map._targets[stamp(targetEl)] = this;
        return this;
      },
      removeInteractiveTarget: function(targetEl) {
        delete this._map._targets[stamp(targetEl)];
        return this;
      },
      // @method getAttribution: String
      // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
      getAttribution: function() {
        return this.options.attribution;
      },
      _layerAdd: function(e) {
        var map = e.target;
        if (!map.hasLayer(this)) {
          return;
        }
        this._map = map;
        this._zoomAnimated = map._zoomAnimated;
        if (this.getEvents) {
          var events = this.getEvents();
          map.on(events, this);
          this.once("remove", function() {
            map.off(events, this);
          }, this);
        }
        this.onAdd(map);
        this.fire("add");
        map.fire("layeradd", { layer: this });
      }
    });
    Map2.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(layer) {
        if (!layer._layerAdd) {
          throw new Error("The provided object is not a Layer.");
        }
        var id2 = stamp(layer);
        if (this._layers[id2]) {
          return this;
        }
        this._layers[id2] = layer;
        layer._mapToAdd = this;
        if (layer.beforeAdd) {
          layer.beforeAdd(this);
        }
        this.whenReady(layer._layerAdd, layer);
        return this;
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(layer) {
        var id2 = stamp(layer);
        if (!this._layers[id2]) {
          return this;
        }
        if (this._loaded) {
          layer.onRemove(this);
        }
        delete this._layers[id2];
        if (this._loaded) {
          this.fire("layerremove", { layer });
          layer.fire("remove");
        }
        layer._map = layer._mapToAdd = null;
        return this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(layer) {
        return stamp(layer) in this._layers;
      },
      /* @method eachLayer(fn: Function, context?: Object): this
       * Iterates over the layers of the map, optionally specifying context of the iterator function.
       * ```
       * map.eachLayer(function(layer){
       *     layer.bindPopup('Hello');
       * });
       * ```
       */
      eachLayer: function(method, context) {
        for (var i in this._layers) {
          method.call(context, this._layers[i]);
        }
        return this;
      },
      _addLayers: function(layers2) {
        layers2 = layers2 ? isArray(layers2) ? layers2 : [layers2] : [];
        for (var i = 0, len = layers2.length; i < len; i++) {
          this.addLayer(layers2[i]);
        }
      },
      _addZoomLimit: function(layer) {
        if (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
          this._zoomBoundLayers[stamp(layer)] = layer;
          this._updateZoomLevels();
        }
      },
      _removeZoomLimit: function(layer) {
        var id2 = stamp(layer);
        if (this._zoomBoundLayers[id2]) {
          delete this._zoomBoundLayers[id2];
          this._updateZoomLevels();
        }
      },
      _updateZoomLevels: function() {
        var minZoom = Infinity, maxZoom = -Infinity, oldZoomSpan = this._getZoomSpan();
        for (var i in this._zoomBoundLayers) {
          var options = this._zoomBoundLayers[i].options;
          minZoom = options.minZoom === void 0 ? minZoom : Math.min(minZoom, options.minZoom);
          maxZoom = options.maxZoom === void 0 ? maxZoom : Math.max(maxZoom, options.maxZoom);
        }
        this._layersMaxZoom = maxZoom === -Infinity ? void 0 : maxZoom;
        this._layersMinZoom = minZoom === Infinity ? void 0 : minZoom;
        if (oldZoomSpan !== this._getZoomSpan()) {
          this.fire("zoomlevelschange");
        }
        if (this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
          this.setZoom(this._layersMaxZoom);
        }
        if (this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
          this.setZoom(this._layersMinZoom);
        }
      }
    });
    var LayerGroup = Layer.extend({
      initialize: function(layers2, options) {
        setOptions(this, options);
        this._layers = {};
        var i, len;
        if (layers2) {
          for (i = 0, len = layers2.length; i < len; i++) {
            this.addLayer(layers2[i]);
          }
        }
      },
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the group.
      addLayer: function(layer) {
        var id2 = this.getLayerId(layer);
        this._layers[id2] = layer;
        if (this._map) {
          this._map.addLayer(layer);
        }
        return this;
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the group.
      // @alternative
      // @method removeLayer(id: Number): this
      // Removes the layer with the given internal ID from the group.
      removeLayer: function(layer) {
        var id2 = layer in this._layers ? layer : this.getLayerId(layer);
        if (this._map && this._layers[id2]) {
          this._map.removeLayer(this._layers[id2]);
        }
        delete this._layers[id2];
        return this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the group.
      // @alternative
      // @method hasLayer(id: Number): Boolean
      // Returns `true` if the given internal ID is currently added to the group.
      hasLayer: function(layer) {
        var layerId = typeof layer === "number" ? layer : this.getLayerId(layer);
        return layerId in this._layers;
      },
      // @method clearLayers(): this
      // Removes all the layers from the group.
      clearLayers: function() {
        return this.eachLayer(this.removeLayer, this);
      },
      // @method invoke(methodName: String, …): this
      // Calls `methodName` on every layer contained in this group, passing any
      // additional parameters. Has no effect if the layers contained do not
      // implement `methodName`.
      invoke: function(methodName) {
        var args = Array.prototype.slice.call(arguments, 1), i, layer;
        for (i in this._layers) {
          layer = this._layers[i];
          if (layer[methodName]) {
            layer[methodName].apply(layer, args);
          }
        }
        return this;
      },
      onAdd: function(map) {
        this.eachLayer(map.addLayer, map);
      },
      onRemove: function(map) {
        this.eachLayer(map.removeLayer, map);
      },
      // @method eachLayer(fn: Function, context?: Object): this
      // Iterates over the layers of the group, optionally specifying context of the iterator function.
      // ```js
      // group.eachLayer(function (layer) {
      // 	layer.bindPopup('Hello');
      // });
      // ```
      eachLayer: function(method, context) {
        for (var i in this._layers) {
          method.call(context, this._layers[i]);
        }
        return this;
      },
      // @method getLayer(id: Number): Layer
      // Returns the layer with the given internal ID.
      getLayer: function(id2) {
        return this._layers[id2];
      },
      // @method getLayers(): Layer[]
      // Returns an array of all the layers added to the group.
      getLayers: function() {
        var layers2 = [];
        this.eachLayer(layers2.push, layers2);
        return layers2;
      },
      // @method setZIndex(zIndex: Number): this
      // Calls `setZIndex` on every layer contained in this group, passing the z-index.
      setZIndex: function(zIndex) {
        return this.invoke("setZIndex", zIndex);
      },
      // @method getLayerId(layer: Layer): Number
      // Returns the internal ID for a layer
      getLayerId: function(layer) {
        return stamp(layer);
      }
    });
    var layerGroup = function(layers2, options) {
      return new LayerGroup(layers2, options);
    };
    var FeatureGroup = LayerGroup.extend({
      addLayer: function(layer) {
        if (this.hasLayer(layer)) {
          return this;
        }
        layer.addEventParent(this);
        LayerGroup.prototype.addLayer.call(this, layer);
        return this.fire("layeradd", { layer });
      },
      removeLayer: function(layer) {
        if (!this.hasLayer(layer)) {
          return this;
        }
        if (layer in this._layers) {
          layer = this._layers[layer];
        }
        layer.removeEventParent(this);
        LayerGroup.prototype.removeLayer.call(this, layer);
        return this.fire("layerremove", { layer });
      },
      // @method setStyle(style: Path options): this
      // Sets the given path options to each layer of the group that has a `setStyle` method.
      setStyle: function(style2) {
        return this.invoke("setStyle", style2);
      },
      // @method bringToFront(): this
      // Brings the layer group to the top of all other layers
      bringToFront: function() {
        return this.invoke("bringToFront");
      },
      // @method bringToBack(): this
      // Brings the layer group to the back of all other layers
      bringToBack: function() {
        return this.invoke("bringToBack");
      },
      // @method getBounds(): LatLngBounds
      // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
      getBounds: function() {
        var bounds = new LatLngBounds();
        for (var id2 in this._layers) {
          var layer = this._layers[id2];
          bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
        }
        return bounds;
      }
    });
    var featureGroup = function(layers2, options) {
      return new FeatureGroup(layers2, options);
    };
    var Icon = Class.extend({
      /* @section
       * @aka Icon options
       *
       * @option iconUrl: String = null
       * **(required)** The URL to the icon image (absolute or relative to your script path).
       *
       * @option iconRetinaUrl: String = null
       * The URL to a retina sized version of the icon image (absolute or relative to your
       * script path). Used for Retina screen devices.
       *
       * @option iconSize: Point = null
       * Size of the icon image in pixels.
       *
       * @option iconAnchor: Point = null
       * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
       * will be aligned so that this point is at the marker's geographical location. Centered
       * by default if size is specified, also can be set in CSS with negative margins.
       *
       * @option popupAnchor: Point = [0, 0]
       * The coordinates of the point from which popups will "open", relative to the icon anchor.
       *
       * @option tooltipAnchor: Point = [0, 0]
       * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
       *
       * @option shadowUrl: String = null
       * The URL to the icon shadow image. If not specified, no shadow image will be created.
       *
       * @option shadowRetinaUrl: String = null
       *
       * @option shadowSize: Point = null
       * Size of the shadow image in pixels.
       *
       * @option shadowAnchor: Point = null
       * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
       * as iconAnchor if not specified).
       *
       * @option className: String = ''
       * A custom class name to assign to both icon and shadow images. Empty by default.
       */
      options: {
        popupAnchor: [0, 0],
        tooltipAnchor: [0, 0],
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: false
      },
      initialize: function(options) {
        setOptions(this, options);
      },
      // @method createIcon(oldIcon?: HTMLElement): HTMLElement
      // Called internally when the icon has to be shown, returns a `<img>` HTML element
      // styled according to the options.
      createIcon: function(oldIcon) {
        return this._createIcon("icon", oldIcon);
      },
      // @method createShadow(oldIcon?: HTMLElement): HTMLElement
      // As `createIcon`, but for the shadow beneath it.
      createShadow: function(oldIcon) {
        return this._createIcon("shadow", oldIcon);
      },
      _createIcon: function(name, oldIcon) {
        var src = this._getIconUrl(name);
        if (!src) {
          if (name === "icon") {
            throw new Error("iconUrl not set in Icon options (see the docs).");
          }
          return null;
        }
        var img = this._createImg(src, oldIcon && oldIcon.tagName === "IMG" ? oldIcon : null);
        this._setIconStyles(img, name);
        if (this.options.crossOrigin || this.options.crossOrigin === "") {
          img.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
        }
        return img;
      },
      _setIconStyles: function(img, name) {
        var options = this.options;
        var sizeOption = options[name + "Size"];
        if (typeof sizeOption === "number") {
          sizeOption = [sizeOption, sizeOption];
        }
        var size = toPoint(sizeOption), anchor = toPoint(name === "shadow" && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2, true));
        img.className = "leaflet-marker-" + name + " " + (options.className || "");
        if (anchor) {
          img.style.marginLeft = -anchor.x + "px";
          img.style.marginTop = -anchor.y + "px";
        }
        if (size) {
          img.style.width = size.x + "px";
          img.style.height = size.y + "px";
        }
      },
      _createImg: function(src, el) {
        el = el || document.createElement("img");
        el.src = src;
        return el;
      },
      _getIconUrl: function(name) {
        return Browser.retina && this.options[name + "RetinaUrl"] || this.options[name + "Url"];
      }
    });
    function icon(options) {
      return new Icon(options);
    }
    var IconDefault = Icon.extend({
      options: {
        iconUrl: "marker-icon.png",
        iconRetinaUrl: "marker-icon-2x.png",
        shadowUrl: "marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      },
      _getIconUrl: function(name) {
        if (typeof IconDefault.imagePath !== "string") {
          IconDefault.imagePath = this._detectIconPath();
        }
        return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
      },
      _stripUrl: function(path) {
        var strip = function(str, re, idx) {
          var match = re.exec(str);
          return match && match[idx];
        };
        path = strip(path, /^url\((['"])?(.+)\1\)$/, 2);
        return path && strip(path, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var el = create$1("div", "leaflet-default-icon-path", document.body);
        var path = getStyle(el, "background-image") || getStyle(el, "backgroundImage");
        document.body.removeChild(el);
        path = this._stripUrl(path);
        if (path) {
          return path;
        }
        var link = document.querySelector('link[href$="leaflet.css"]');
        if (!link) {
          return "";
        }
        return link.href.substring(0, link.href.length - "leaflet.css".length - 1);
      }
    });
    var MarkerDrag = Handler.extend({
      initialize: function(marker2) {
        this._marker = marker2;
      },
      addHooks: function() {
        var icon2 = this._marker._icon;
        if (!this._draggable) {
          this._draggable = new Draggable(icon2, icon2, true);
        }
        this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable();
        addClass(icon2, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable();
        if (this._marker._icon) {
          removeClass(this._marker._icon, "leaflet-marker-draggable");
        }
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(e) {
        var marker2 = this._marker, map = marker2._map, speed = this._marker.options.autoPanSpeed, padding = this._marker.options.autoPanPadding, iconPos = getPosition(marker2._icon), bounds = map.getPixelBounds(), origin = map.getPixelOrigin();
        var panBounds = toBounds(
          bounds.min._subtract(origin).add(padding),
          bounds.max._subtract(origin).subtract(padding)
        );
        if (!panBounds.contains(iconPos)) {
          var movement = toPoint(
            (Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) - (Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),
            (Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) - (Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
          ).multiplyBy(speed);
          map.panBy(movement, { animate: false });
          this._draggable._newPos._add(movement);
          this._draggable._startPos._add(movement);
          setPosition(marker2._icon, this._draggable._newPos);
          this._onDrag(e);
          this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng();
        this._marker.closePopup && this._marker.closePopup();
        this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(e) {
        if (this._marker.options.autoPan) {
          cancelAnimFrame(this._panRequest);
          this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
        }
      },
      _onDrag: function(e) {
        var marker2 = this._marker, shadow = marker2._shadow, iconPos = getPosition(marker2._icon), latlng = marker2._map.layerPointToLatLng(iconPos);
        if (shadow) {
          setPosition(shadow, iconPos);
        }
        marker2._latlng = latlng;
        e.latlng = latlng;
        e.oldLatLng = this._oldLatLng;
        marker2.fire("move", e).fire("drag", e);
      },
      _onDragEnd: function(e) {
        cancelAnimFrame(this._panRequest);
        delete this._oldLatLng;
        this._marker.fire("moveend").fire("dragend", e);
      }
    });
    var Marker2 = Layer.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new IconDefault(),
        // Option inherited from "Interactive layer" abstract class
        interactive: true,
        // @option keyboard: Boolean = true
        // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
        keyboard: true,
        // @option title: String = ''
        // Text for the browser tooltip that appear on marker hover (no tooltip by default).
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        title: "",
        // @option alt: String = 'Marker'
        // Text for the `alt` attribute of the icon image.
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        alt: "Marker",
        // @option zIndexOffset: Number = 0
        // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
        zIndexOffset: 0,
        // @option opacity: Number = 1.0
        // The opacity of the marker.
        opacity: 1,
        // @option riseOnHover: Boolean = false
        // If `true`, the marker will get on top of others when you hover the mouse over it.
        riseOnHover: false,
        // @option riseOffset: Number = 250
        // The z-index offset used for the `riseOnHover` feature.
        riseOffset: 250,
        // @option pane: String = 'markerPane'
        // `Map pane` where the markers icon will be added.
        pane: "markerPane",
        // @option shadowPane: String = 'shadowPane'
        // `Map pane` where the markers shadow will be added.
        shadowPane: "shadowPane",
        // @option bubblingMouseEvents: Boolean = false
        // When `true`, a mouse event on this marker will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: false,
        // @option autoPanOnFocus: Boolean = true
        // When `true`, the map will pan whenever the marker is focused (via
        // e.g. pressing `tab` on the keyboard) to ensure the marker is
        // visible within the map's bounds
        autoPanOnFocus: true,
        // @section Draggable marker options
        // @option draggable: Boolean = false
        // Whether the marker is draggable with mouse/touch or not.
        draggable: false,
        // @option autoPan: Boolean = false
        // Whether to pan the map when dragging this marker near its edge or not.
        autoPan: false,
        // @option autoPanPadding: Point = Point(50, 50)
        // Distance (in pixels to the left/right and to the top/bottom) of the
        // map edge to start panning the map.
        autoPanPadding: [50, 50],
        // @option autoPanSpeed: Number = 10
        // Number of pixels the map should pan by.
        autoPanSpeed: 10
      },
      /* @section
       *
       * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
       */
      initialize: function(latlng, options) {
        setOptions(this, options);
        this._latlng = toLatLng(latlng);
      },
      onAdd: function(map) {
        this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;
        if (this._zoomAnimated) {
          map.on("zoomanim", this._animateZoom, this);
        }
        this._initIcon();
        this.update();
      },
      onRemove: function(map) {
        if (this.dragging && this.dragging.enabled()) {
          this.options.draggable = true;
          this.dragging.removeHooks();
        }
        delete this.dragging;
        if (this._zoomAnimated) {
          map.off("zoomanim", this._animateZoom, this);
        }
        this._removeIcon();
        this._removeShadow();
      },
      getEvents: function() {
        return {
          zoom: this.update,
          viewreset: this.update
        };
      },
      // @method getLatLng: LatLng
      // Returns the current geographical position of the marker.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Changes the marker position to the given point.
      setLatLng: function(latlng) {
        var oldLatLng = this._latlng;
        this._latlng = toLatLng(latlng);
        this.update();
        return this.fire("move", { oldLatLng, latlng: this._latlng });
      },
      // @method setZIndexOffset(offset: Number): this
      // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
      setZIndexOffset: function(offset) {
        this.options.zIndexOffset = offset;
        return this.update();
      },
      // @method getIcon: Icon
      // Returns the current icon used by the marker
      getIcon: function() {
        return this.options.icon;
      },
      // @method setIcon(icon: Icon): this
      // Changes the marker icon.
      setIcon: function(icon2) {
        this.options.icon = icon2;
        if (this._map) {
          this._initIcon();
          this.update();
        }
        if (this._popup) {
          this.bindPopup(this._popup, this._popup.options);
        }
        return this;
      },
      getElement: function() {
        return this._icon;
      },
      update: function() {
        if (this._icon && this._map) {
          var pos = this._map.latLngToLayerPoint(this._latlng).round();
          this._setPos(pos);
        }
        return this;
      },
      _initIcon: function() {
        var options = this.options, classToAdd = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        var icon2 = options.icon.createIcon(this._icon), addIcon = false;
        if (icon2 !== this._icon) {
          if (this._icon) {
            this._removeIcon();
          }
          addIcon = true;
          if (options.title) {
            icon2.title = options.title;
          }
          if (icon2.tagName === "IMG") {
            icon2.alt = options.alt || "";
          }
        }
        addClass(icon2, classToAdd);
        if (options.keyboard) {
          icon2.tabIndex = "0";
          icon2.setAttribute("role", "button");
        }
        this._icon = icon2;
        if (options.riseOnHover) {
          this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          });
        }
        if (this.options.autoPanOnFocus) {
          on(icon2, "focus", this._panOnFocus, this);
        }
        var newShadow = options.icon.createShadow(this._shadow), addShadow = false;
        if (newShadow !== this._shadow) {
          this._removeShadow();
          addShadow = true;
        }
        if (newShadow) {
          addClass(newShadow, classToAdd);
          newShadow.alt = "";
        }
        this._shadow = newShadow;
        if (options.opacity < 1) {
          this._updateOpacity();
        }
        if (addIcon) {
          this.getPane().appendChild(this._icon);
        }
        this._initInteraction();
        if (newShadow && addShadow) {
          this.getPane(options.shadowPane).appendChild(this._shadow);
        }
      },
      _removeIcon: function() {
        if (this.options.riseOnHover) {
          this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          });
        }
        if (this.options.autoPanOnFocus) {
          off(this._icon, "focus", this._panOnFocus, this);
        }
        remove(this._icon);
        this.removeInteractiveTarget(this._icon);
        this._icon = null;
      },
      _removeShadow: function() {
        if (this._shadow) {
          remove(this._shadow);
        }
        this._shadow = null;
      },
      _setPos: function(pos) {
        if (this._icon) {
          setPosition(this._icon, pos);
        }
        if (this._shadow) {
          setPosition(this._shadow, pos);
        }
        this._zIndex = pos.y + this.options.zIndexOffset;
        this._resetZIndex();
      },
      _updateZIndex: function(offset) {
        if (this._icon) {
          this._icon.style.zIndex = this._zIndex + offset;
        }
      },
      _animateZoom: function(opt) {
        var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
        this._setPos(pos);
      },
      _initInteraction: function() {
        if (!this.options.interactive) {
          return;
        }
        addClass(this._icon, "leaflet-interactive");
        this.addInteractiveTarget(this._icon);
        if (MarkerDrag) {
          var draggable = this.options.draggable;
          if (this.dragging) {
            draggable = this.dragging.enabled();
            this.dragging.disable();
          }
          this.dragging = new MarkerDrag(this);
          if (draggable) {
            this.dragging.enable();
          }
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(opacity) {
        this.options.opacity = opacity;
        if (this._map) {
          this._updateOpacity();
        }
        return this;
      },
      _updateOpacity: function() {
        var opacity = this.options.opacity;
        if (this._icon) {
          setOpacity(this._icon, opacity);
        }
        if (this._shadow) {
          setOpacity(this._shadow, opacity);
        }
      },
      _bringToFront: function() {
        this._updateZIndex(this.options.riseOffset);
      },
      _resetZIndex: function() {
        this._updateZIndex(0);
      },
      _panOnFocus: function() {
        var map = this._map;
        if (!map) {
          return;
        }
        var iconOpts = this.options.icon.options;
        var size = iconOpts.iconSize ? toPoint(iconOpts.iconSize) : toPoint(0, 0);
        var anchor = iconOpts.iconAnchor ? toPoint(iconOpts.iconAnchor) : toPoint(0, 0);
        map.panInside(this._latlng, {
          paddingTopLeft: anchor,
          paddingBottomRight: size.subtract(anchor)
        });
      },
      _getPopupAnchor: function() {
        return this.options.icon.options.popupAnchor;
      },
      _getTooltipAnchor: function() {
        return this.options.icon.options.tooltipAnchor;
      }
    });
    function marker(latlng, options) {
      return new Marker2(latlng, options);
    }
    var Path = Layer.extend({
      // @section
      // @aka Path options
      options: {
        // @option stroke: Boolean = true
        // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
        stroke: true,
        // @option color: String = '#3388ff'
        // Stroke color
        color: "#3388ff",
        // @option weight: Number = 3
        // Stroke width in pixels
        weight: 3,
        // @option opacity: Number = 1.0
        // Stroke opacity
        opacity: 1,
        // @option lineCap: String= 'round'
        // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
        lineCap: "round",
        // @option lineJoin: String = 'round'
        // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
        lineJoin: "round",
        // @option dashArray: String = null
        // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashArray: null,
        // @option dashOffset: String = null
        // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashOffset: null,
        // @option fill: Boolean = depends
        // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
        fill: false,
        // @option fillColor: String = *
        // Fill color. Defaults to the value of the [`color`](#path-color) option
        fillColor: null,
        // @option fillOpacity: Number = 0.2
        // Fill opacity.
        fillOpacity: 0.2,
        // @option fillRule: String = 'evenodd'
        // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
        fillRule: "evenodd",
        // className: '',
        // Option inherited from "Interactive layer" abstract class
        interactive: true,
        // @option bubblingMouseEvents: Boolean = true
        // When `true`, a mouse event on this path will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: true
      },
      beforeAdd: function(map) {
        this._renderer = map.getRenderer(this);
      },
      onAdd: function() {
        this._renderer._initPath(this);
        this._reset();
        this._renderer._addPath(this);
      },
      onRemove: function() {
        this._renderer._removePath(this);
      },
      // @method redraw(): this
      // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
      redraw: function() {
        if (this._map) {
          this._renderer._updatePath(this);
        }
        return this;
      },
      // @method setStyle(style: Path options): this
      // Changes the appearance of a Path based on the options in the `Path options` object.
      setStyle: function(style2) {
        setOptions(this, style2);
        if (this._renderer) {
          this._renderer._updateStyle(this);
          if (this.options.stroke && style2 && Object.prototype.hasOwnProperty.call(style2, "weight")) {
            this._updateBounds();
          }
        }
        return this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all path layers.
      bringToFront: function() {
        if (this._renderer) {
          this._renderer._bringToFront(this);
        }
        return this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all path layers.
      bringToBack: function() {
        if (this._renderer) {
          this._renderer._bringToBack(this);
        }
        return this;
      },
      getElement: function() {
        return this._path;
      },
      _reset: function() {
        this._project();
        this._update();
      },
      _clickTolerance: function() {
        return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
      }
    });
    var CircleMarker = Path.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: true,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(latlng, options) {
        setOptions(this, options);
        this._latlng = toLatLng(latlng);
        this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(latlng) {
        var oldLatLng = this._latlng;
        this._latlng = toLatLng(latlng);
        this.redraw();
        return this.fire("move", { oldLatLng, latlng: this._latlng });
      },
      // @method getLatLng(): LatLng
      // Returns the current geographical position of the circle marker
      getLatLng: function() {
        return this._latlng;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle marker. Units are in pixels.
      setRadius: function(radius) {
        this.options.radius = this._radius = radius;
        return this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of the circle
      getRadius: function() {
        return this._radius;
      },
      setStyle: function(options) {
        var radius = options && options.radius || this._radius;
        Path.prototype.setStyle.call(this, options);
        this.setRadius(radius);
        return this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._updateBounds();
      },
      _updateBounds: function() {
        var r = this._radius, r2 = this._radiusY || r, w = this._clickTolerance(), p = [r + w, r2 + w];
        this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
      },
      _update: function() {
        if (this._map) {
          this._updatePath();
        }
      },
      _updatePath: function() {
        this._renderer._updateCircle(this);
      },
      _empty: function() {
        return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(p) {
        return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
      }
    });
    function circleMarker(latlng, options) {
      return new CircleMarker(latlng, options);
    }
    var Circle2 = CircleMarker.extend({
      initialize: function(latlng, options, legacyOptions) {
        if (typeof options === "number") {
          options = extend({}, legacyOptions, { radius: options });
        }
        setOptions(this, options);
        this._latlng = toLatLng(latlng);
        if (isNaN(this.options.radius)) {
          throw new Error("Circle radius cannot be NaN");
        }
        this._mRadius = this.options.radius;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle. Units are in meters.
      setRadius: function(radius) {
        this._mRadius = radius;
        return this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of a circle. Units are in meters.
      getRadius: function() {
        return this._mRadius;
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        var half = [this._radius, this._radiusY || this._radius];
        return new LatLngBounds(
          this._map.layerPointToLatLng(this._point.subtract(half)),
          this._map.layerPointToLatLng(this._point.add(half))
        );
      },
      setStyle: Path.prototype.setStyle,
      _project: function() {
        var lng = this._latlng.lng, lat = this._latlng.lat, map = this._map, crs = map.options.crs;
        if (crs.distance === Earth.distance) {
          var d = Math.PI / 180, latR = this._mRadius / Earth.R / d, top = map.project([lat + latR, lng]), bottom = map.project([lat - latR, lng]), p = top.add(bottom).divideBy(2), lat2 = map.unproject(p).lat, lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) / (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;
          if (isNaN(lngR) || lngR === 0) {
            lngR = latR / Math.cos(Math.PI / 180 * lat);
          }
          this._point = p.subtract(map.getPixelOrigin());
          this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
          this._radiusY = p.y - top.y;
        } else {
          var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = map.latLngToLayerPoint(this._latlng);
          this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
        }
        this._updateBounds();
      }
    });
    function circle(latlng, options, legacyOptions) {
      return new Circle2(latlng, options, legacyOptions);
    }
    var Polyline2 = Path.extend({
      // @section
      // @aka Polyline options
      options: {
        // @option smoothFactor: Number = 1.0
        // How much to simplify the polyline on each zoom level. More means
        // better performance and smoother look, and less means more accurate representation.
        smoothFactor: 1,
        // @option noClip: Boolean = false
        // Disable polyline clipping.
        noClip: false
      },
      initialize: function(latlngs, options) {
        setOptions(this, options);
        this._setLatLngs(latlngs);
      },
      // @method getLatLngs(): LatLng[]
      // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
      getLatLngs: function() {
        return this._latlngs;
      },
      // @method setLatLngs(latlngs: LatLng[]): this
      // Replaces all the points in the polyline with the given array of geographical points.
      setLatLngs: function(latlngs) {
        this._setLatLngs(latlngs);
        return this.redraw();
      },
      // @method isEmpty(): Boolean
      // Returns `true` if the Polyline has no LatLngs.
      isEmpty: function() {
        return !this._latlngs.length;
      },
      // @method closestLayerPoint(p: Point): Point
      // Returns the point closest to `p` on the Polyline.
      closestLayerPoint: function(p) {
        var minDistance = Infinity, minPoint = null, closest = _sqClosestPointOnSegment, p1, p2;
        for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
          var points = this._parts[j];
          for (var i = 1, len = points.length; i < len; i++) {
            p1 = points[i - 1];
            p2 = points[i];
            var sqDist = closest(p, p1, p2, true);
            if (sqDist < minDistance) {
              minDistance = sqDist;
              minPoint = closest(p, p1, p2);
            }
          }
        }
        if (minPoint) {
          minPoint.distance = Math.sqrt(minDistance);
        }
        return minPoint;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map) {
          throw new Error("Must add layer to map before using getCenter()");
        }
        return polylineCenter(this._defaultShape(), this._map.options.crs);
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        return this._bounds;
      },
      // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
      // Adds a given point to the polyline. By default, adds to the first ring of
      // the polyline in case of a multi-polyline, but can be overridden by passing
      // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
      addLatLng: function(latlng, latlngs) {
        latlngs = latlngs || this._defaultShape();
        latlng = toLatLng(latlng);
        latlngs.push(latlng);
        this._bounds.extend(latlng);
        return this.redraw();
      },
      _setLatLngs: function(latlngs) {
        this._bounds = new LatLngBounds();
        this._latlngs = this._convertLatLngs(latlngs);
      },
      _defaultShape: function() {
        return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(latlngs) {
        var result = [], flat = isFlat(latlngs);
        for (var i = 0, len = latlngs.length; i < len; i++) {
          if (flat) {
            result[i] = toLatLng(latlngs[i]);
            this._bounds.extend(result[i]);
          } else {
            result[i] = this._convertLatLngs(latlngs[i]);
          }
        }
        return result;
      },
      _project: function() {
        var pxBounds = new Bounds();
        this._rings = [];
        this._projectLatlngs(this._latlngs, this._rings, pxBounds);
        if (this._bounds.isValid() && pxBounds.isValid()) {
          this._rawPxBounds = pxBounds;
          this._updateBounds();
        }
      },
      _updateBounds: function() {
        var w = this._clickTolerance(), p = new Point(w, w);
        if (!this._rawPxBounds) {
          return;
        }
        this._pxBounds = new Bounds([
          this._rawPxBounds.min.subtract(p),
          this._rawPxBounds.max.add(p)
        ]);
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(latlngs, result, projectedBounds) {
        var flat = latlngs[0] instanceof LatLng, len = latlngs.length, i, ring;
        if (flat) {
          ring = [];
          for (i = 0; i < len; i++) {
            ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
            projectedBounds.extend(ring[i]);
          }
          result.push(ring);
        } else {
          for (i = 0; i < len; i++) {
            this._projectLatlngs(latlngs[i], result, projectedBounds);
          }
        }
      },
      // clip polyline by renderer bounds so that we have less to render for performance
      _clipPoints: function() {
        var bounds = this._renderer._bounds;
        this._parts = [];
        if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
          return;
        }
        if (this.options.noClip) {
          this._parts = this._rings;
          return;
        }
        var parts = this._parts, i, j, k, len, len2, segment, points;
        for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
          points = this._rings[i];
          for (j = 0, len2 = points.length; j < len2 - 1; j++) {
            segment = clipSegment(points[j], points[j + 1], bounds, j, true);
            if (!segment) {
              continue;
            }
            parts[k] = parts[k] || [];
            parts[k].push(segment[0]);
            if (segment[1] !== points[j + 1] || j === len2 - 2) {
              parts[k].push(segment[1]);
              k++;
            }
          }
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        var parts = this._parts, tolerance = this.options.smoothFactor;
        for (var i = 0, len = parts.length; i < len; i++) {
          parts[i] = simplify(parts[i], tolerance);
        }
      },
      _update: function() {
        if (!this._map) {
          return;
        }
        this._clipPoints();
        this._simplifyPoints();
        this._updatePath();
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(p, closed) {
        var i, j, k, len, len2, part, w = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(p)) {
          return false;
        }
        for (i = 0, len = this._parts.length; i < len; i++) {
          part = this._parts[i];
          for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
            if (!closed && j === 0) {
              continue;
            }
            if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
              return true;
            }
          }
        }
        return false;
      }
    });
    function polyline(latlngs, options) {
      return new Polyline2(latlngs, options);
    }
    Polyline2._flat = _flat;
    var Polygon2 = Polyline2.extend({
      options: {
        fill: true
      },
      isEmpty: function() {
        return !this._latlngs.length || !this._latlngs[0].length;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
      getCenter: function() {
        if (!this._map) {
          throw new Error("Must add layer to map before using getCenter()");
        }
        return polygonCenter(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(latlngs) {
        var result = Polyline2.prototype._convertLatLngs.call(this, latlngs), len = result.length;
        if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
          result.pop();
        }
        return result;
      },
      _setLatLngs: function(latlngs) {
        Polyline2.prototype._setLatLngs.call(this, latlngs);
        if (isFlat(this._latlngs)) {
          this._latlngs = [this._latlngs];
        }
      },
      _defaultShape: function() {
        return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var bounds = this._renderer._bounds, w = this.options.weight, p = new Point(w, w);
        bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));
        this._parts = [];
        if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
          return;
        }
        if (this.options.noClip) {
          this._parts = this._rings;
          return;
        }
        for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
          clipped = clipPolygon(this._rings[i], bounds, true);
          if (clipped.length) {
            this._parts.push(clipped);
          }
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, true);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(p) {
        var inside = false, part, p1, p2, i, j, k, len, len2;
        if (!this._pxBounds || !this._pxBounds.contains(p)) {
          return false;
        }
        for (i = 0, len = this._parts.length; i < len; i++) {
          part = this._parts[i];
          for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
            p1 = part[j];
            p2 = part[k];
            if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
              inside = !inside;
            }
          }
        }
        return inside || Polyline2.prototype._containsPoint.call(this, p, true);
      }
    });
    function polygon(latlngs, options) {
      return new Polygon2(latlngs, options);
    }
    var GeoJSON = FeatureGroup.extend({
      /* @section
       * @aka GeoJSON options
       *
       * @option pointToLayer: Function = *
       * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
       * called when data is added, passing the GeoJSON point feature and its `LatLng`.
       * The default is to spawn a default `Marker`:
       * ```js
       * function(geoJsonPoint, latlng) {
       * 	return L.marker(latlng);
       * }
       * ```
       *
       * @option style: Function = *
       * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
       * called internally when data is added.
       * The default value is to not override any defaults:
       * ```js
       * function (geoJsonFeature) {
       * 	return {}
       * }
       * ```
       *
       * @option onEachFeature: Function = *
       * A `Function` that will be called once for each created `Feature`, after it has
       * been created and styled. Useful for attaching events and popups to features.
       * The default is to do nothing with the newly created layers:
       * ```js
       * function (feature, layer) {}
       * ```
       *
       * @option filter: Function = *
       * A `Function` that will be used to decide whether to include a feature or not.
       * The default is to include all features:
       * ```js
       * function (geoJsonFeature) {
       * 	return true;
       * }
       * ```
       * Note: dynamically changing the `filter` option will have effect only on newly
       * added data. It will _not_ re-evaluate already included features.
       *
       * @option coordsToLatLng: Function = *
       * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
       * The default is the `coordsToLatLng` static method.
       *
       * @option markersInheritOptions: Boolean = false
       * Whether default Markers for "Point" type Features inherit from group options.
       */
      initialize: function(geojson, options) {
        setOptions(this, options);
        this._layers = {};
        if (geojson) {
          this.addData(geojson);
        }
      },
      // @method addData( <GeoJSON> data ): this
      // Adds a GeoJSON object to the layer.
      addData: function(geojson) {
        var features = isArray(geojson) ? geojson : geojson.features, i, len, feature;
        if (features) {
          for (i = 0, len = features.length; i < len; i++) {
            feature = features[i];
            if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
              this.addData(feature);
            }
          }
          return this;
        }
        var options = this.options;
        if (options.filter && !options.filter(geojson)) {
          return this;
        }
        var layer = geometryToLayer(geojson, options);
        if (!layer) {
          return this;
        }
        layer.feature = asFeature(geojson);
        layer.defaultOptions = layer.options;
        this.resetStyle(layer);
        if (options.onEachFeature) {
          options.onEachFeature(geojson, layer);
        }
        return this.addLayer(layer);
      },
      // @method resetStyle( <Path> layer? ): this
      // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
      // If `layer` is omitted, the style of all features in the current layer is reset.
      resetStyle: function(layer) {
        if (layer === void 0) {
          return this.eachLayer(this.resetStyle, this);
        }
        layer.options = extend({}, layer.defaultOptions);
        this._setLayerStyle(layer, this.options.style);
        return this;
      },
      // @method setStyle( <Function> style ): this
      // Changes styles of GeoJSON vector layers with the given style function.
      setStyle: function(style2) {
        return this.eachLayer(function(layer) {
          this._setLayerStyle(layer, style2);
        }, this);
      },
      _setLayerStyle: function(layer, style2) {
        if (layer.setStyle) {
          if (typeof style2 === "function") {
            style2 = style2(layer.feature);
          }
          layer.setStyle(style2);
        }
      }
    });
    function geometryToLayer(geojson, options) {
      var geometry = geojson.type === "Feature" ? geojson.geometry : geojson, coords = geometry ? geometry.coordinates : null, layers2 = [], pointToLayer = options && options.pointToLayer, _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng, latlng, latlngs, i, len;
      if (!coords && !geometry) {
        return null;
      }
      switch (geometry.type) {
        case "Point":
          latlng = _coordsToLatLng(coords);
          return _pointToLayer(pointToLayer, geojson, latlng, options);
        case "MultiPoint":
          for (i = 0, len = coords.length; i < len; i++) {
            latlng = _coordsToLatLng(coords[i]);
            layers2.push(_pointToLayer(pointToLayer, geojson, latlng, options));
          }
          return new FeatureGroup(layers2);
        case "LineString":
        case "MultiLineString":
          latlngs = coordsToLatLngs(coords, geometry.type === "LineString" ? 0 : 1, _coordsToLatLng);
          return new Polyline2(latlngs, options);
        case "Polygon":
        case "MultiPolygon":
          latlngs = coordsToLatLngs(coords, geometry.type === "Polygon" ? 1 : 2, _coordsToLatLng);
          return new Polygon2(latlngs, options);
        case "GeometryCollection":
          for (i = 0, len = geometry.geometries.length; i < len; i++) {
            var geoLayer = geometryToLayer({
              geometry: geometry.geometries[i],
              type: "Feature",
              properties: geojson.properties
            }, options);
            if (geoLayer) {
              layers2.push(geoLayer);
            }
          }
          return new FeatureGroup(layers2);
        case "FeatureCollection":
          for (i = 0, len = geometry.features.length; i < len; i++) {
            var featureLayer = geometryToLayer(geometry.features[i], options);
            if (featureLayer) {
              layers2.push(featureLayer);
            }
          }
          return new FeatureGroup(layers2);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function _pointToLayer(pointToLayerFn, geojson, latlng, options) {
      return pointToLayerFn ? pointToLayerFn(geojson, latlng) : new Marker2(latlng, options && options.markersInheritOptions && options);
    }
    function coordsToLatLng(coords) {
      return new LatLng(coords[1], coords[0], coords[2]);
    }
    function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
      var latlngs = [];
      for (var i = 0, len = coords.length, latlng; i < len; i++) {
        latlng = levelsDeep ? coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) : (_coordsToLatLng || coordsToLatLng)(coords[i]);
        latlngs.push(latlng);
      }
      return latlngs;
    }
    function latLngToCoords(latlng, precision) {
      latlng = toLatLng(latlng);
      return latlng.alt !== void 0 ? [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] : [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
    }
    function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
      var coords = [];
      for (var i = 0, len = latlngs.length; i < len; i++) {
        coords.push(levelsDeep ? latLngsToCoords(latlngs[i], isFlat(latlngs[i]) ? 0 : levelsDeep - 1, closed, precision) : latLngToCoords(latlngs[i], precision));
      }
      if (!levelsDeep && closed && coords.length > 0) {
        coords.push(coords[0].slice());
      }
      return coords;
    }
    function getFeature(layer, newGeometry) {
      return layer.feature ? extend({}, layer.feature, { geometry: newGeometry }) : asFeature(newGeometry);
    }
    function asFeature(geojson) {
      if (geojson.type === "Feature" || geojson.type === "FeatureCollection") {
        return geojson;
      }
      return {
        type: "Feature",
        properties: {},
        geometry: geojson
      };
    }
    var PointToGeoJSON = {
      toGeoJSON: function(precision) {
        return getFeature(this, {
          type: "Point",
          coordinates: latLngToCoords(this.getLatLng(), precision)
        });
      }
    };
    Marker2.include(PointToGeoJSON);
    Circle2.include(PointToGeoJSON);
    CircleMarker.include(PointToGeoJSON);
    Polyline2.include({
      toGeoJSON: function(precision) {
        var multi = !isFlat(this._latlngs);
        var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);
        return getFeature(this, {
          type: (multi ? "Multi" : "") + "LineString",
          coordinates: coords
        });
      }
    });
    Polygon2.include({
      toGeoJSON: function(precision) {
        var holes = !isFlat(this._latlngs), multi = holes && !isFlat(this._latlngs[0]);
        var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);
        if (!holes) {
          coords = [coords];
        }
        return getFeature(this, {
          type: (multi ? "Multi" : "") + "Polygon",
          coordinates: coords
        });
      }
    });
    LayerGroup.include({
      toMultiPoint: function(precision) {
        var coords = [];
        this.eachLayer(function(layer) {
          coords.push(layer.toGeoJSON(precision).geometry.coordinates);
        });
        return getFeature(this, {
          type: "MultiPoint",
          coordinates: coords
        });
      },
      // @method toGeoJSON(precision?: Number|false): Object
      // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
      // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
      toGeoJSON: function(precision) {
        var type = this.feature && this.feature.geometry && this.feature.geometry.type;
        if (type === "MultiPoint") {
          return this.toMultiPoint(precision);
        }
        var isGeometryCollection = type === "GeometryCollection", jsons = [];
        this.eachLayer(function(layer) {
          if (layer.toGeoJSON) {
            var json = layer.toGeoJSON(precision);
            if (isGeometryCollection) {
              jsons.push(json.geometry);
            } else {
              var feature = asFeature(json);
              if (feature.type === "FeatureCollection") {
                jsons.push.apply(jsons, feature.features);
              } else {
                jsons.push(feature);
              }
            }
          }
        });
        if (isGeometryCollection) {
          return getFeature(this, {
            geometries: jsons,
            type: "GeometryCollection"
          });
        }
        return {
          type: "FeatureCollection",
          features: jsons
        };
      }
    });
    function geoJSON(geojson, options) {
      return new GeoJSON(geojson, options);
    }
    var geoJson = geoJSON;
    var ImageOverlay = Layer.extend({
      // @section
      // @aka ImageOverlay options
      options: {
        // @option opacity: Number = 1.0
        // The opacity of the image overlay.
        opacity: 1,
        // @option alt: String = ''
        // Text for the `alt` attribute of the image (useful for accessibility).
        alt: "",
        // @option interactive: Boolean = false
        // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
        interactive: false,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the image.
        // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: false,
        // @option errorOverlayUrl: String = ''
        // URL to the overlay image to show in place of the overlay that failed to load.
        errorOverlayUrl: "",
        // @option zIndex: Number = 1
        // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
        zIndex: 1,
        // @option className: String = ''
        // A custom class name to assign to the image. Empty by default.
        className: ""
      },
      initialize: function(url, bounds, options) {
        this._url = url;
        this._bounds = toLatLngBounds(bounds);
        setOptions(this, options);
      },
      onAdd: function() {
        if (!this._image) {
          this._initImage();
          if (this.options.opacity < 1) {
            this._updateOpacity();
          }
        }
        if (this.options.interactive) {
          addClass(this._image, "leaflet-interactive");
          this.addInteractiveTarget(this._image);
        }
        this.getPane().appendChild(this._image);
        this._reset();
      },
      onRemove: function() {
        remove(this._image);
        if (this.options.interactive) {
          this.removeInteractiveTarget(this._image);
        }
      },
      // @method setOpacity(opacity: Number): this
      // Sets the opacity of the overlay.
      setOpacity: function(opacity) {
        this.options.opacity = opacity;
        if (this._image) {
          this._updateOpacity();
        }
        return this;
      },
      setStyle: function(styleOpts) {
        if (styleOpts.opacity) {
          this.setOpacity(styleOpts.opacity);
        }
        return this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all overlays.
      bringToFront: function() {
        if (this._map) {
          toFront(this._image);
        }
        return this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        if (this._map) {
          toBack(this._image);
        }
        return this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(url) {
        this._url = url;
        if (this._image) {
          this._image.src = url;
        }
        return this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(bounds) {
        this._bounds = toLatLngBounds(bounds);
        if (this._map) {
          this._reset();
        }
        return this;
      },
      getEvents: function() {
        var events = {
          zoom: this._reset,
          viewreset: this._reset
        };
        if (this._zoomAnimated) {
          events.zoomanim = this._animateZoom;
        }
        return events;
      },
      // @method setZIndex(value: Number): this
      // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
      setZIndex: function(value) {
        this.options.zIndex = value;
        this._updateZIndex();
        return this;
      },
      // @method getBounds(): LatLngBounds
      // Get the bounds that this ImageOverlay covers
      getBounds: function() {
        return this._bounds;
      },
      // @method getElement(): HTMLElement
      // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
      // used by this overlay.
      getElement: function() {
        return this._image;
      },
      _initImage: function() {
        var wasElementSupplied = this._url.tagName === "IMG";
        var img = this._image = wasElementSupplied ? this._url : create$1("img");
        addClass(img, "leaflet-image-layer");
        if (this._zoomAnimated) {
          addClass(img, "leaflet-zoom-animated");
        }
        if (this.options.className) {
          addClass(img, this.options.className);
        }
        img.onselectstart = falseFn;
        img.onmousemove = falseFn;
        img.onload = bind(this.fire, this, "load");
        img.onerror = bind(this._overlayOnError, this, "error");
        if (this.options.crossOrigin || this.options.crossOrigin === "") {
          img.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
        }
        if (this.options.zIndex) {
          this._updateZIndex();
        }
        if (wasElementSupplied) {
          this._url = img.src;
          return;
        }
        img.src = this._url;
        img.alt = this.options.alt;
      },
      _animateZoom: function(e) {
        var scale3 = this._map.getZoomScale(e.zoom), offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
        setTransform(this._image, offset, scale3);
      },
      _reset: function() {
        var image = this._image, bounds = new Bounds(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), size = bounds.getSize();
        setPosition(image, bounds.min);
        image.style.width = size.x + "px";
        image.style.height = size.y + "px";
      },
      _updateOpacity: function() {
        setOpacity(this._image, this.options.opacity);
      },
      _updateZIndex: function() {
        if (this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
          this._image.style.zIndex = this.options.zIndex;
        }
      },
      _overlayOnError: function() {
        this.fire("error");
        var errorUrl = this.options.errorOverlayUrl;
        if (errorUrl && this._url !== errorUrl) {
          this._url = errorUrl;
          this._image.src = errorUrl;
        }
      },
      // @method getCenter(): LatLng
      // Returns the center of the ImageOverlay.
      getCenter: function() {
        return this._bounds.getCenter();
      }
    });
    var imageOverlay = function(url, bounds, options) {
      return new ImageOverlay(url, bounds, options);
    };
    var VideoOverlay = ImageOverlay.extend({
      // @section
      // @aka VideoOverlay options
      options: {
        // @option autoplay: Boolean = true
        // Whether the video starts playing automatically when loaded.
        // On some browsers autoplay will only work with `muted: true`
        autoplay: true,
        // @option loop: Boolean = true
        // Whether the video will loop back to the beginning when played.
        loop: true,
        // @option keepAspectRatio: Boolean = true
        // Whether the video will save aspect ratio after the projection.
        // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
        keepAspectRatio: true,
        // @option muted: Boolean = false
        // Whether the video starts on mute when loaded.
        muted: false,
        // @option playsInline: Boolean = true
        // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
        playsInline: true
      },
      _initImage: function() {
        var wasElementSupplied = this._url.tagName === "VIDEO";
        var vid = this._image = wasElementSupplied ? this._url : create$1("video");
        addClass(vid, "leaflet-image-layer");
        if (this._zoomAnimated) {
          addClass(vid, "leaflet-zoom-animated");
        }
        if (this.options.className) {
          addClass(vid, this.options.className);
        }
        vid.onselectstart = falseFn;
        vid.onmousemove = falseFn;
        vid.onloadeddata = bind(this.fire, this, "load");
        if (wasElementSupplied) {
          var sourceElements = vid.getElementsByTagName("source");
          var sources = [];
          for (var j = 0; j < sourceElements.length; j++) {
            sources.push(sourceElements[j].src);
          }
          this._url = sourceElements.length > 0 ? sources : [vid.src];
          return;
        }
        if (!isArray(this._url)) {
          this._url = [this._url];
        }
        if (!this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(vid.style, "objectFit")) {
          vid.style["objectFit"] = "fill";
        }
        vid.autoplay = !!this.options.autoplay;
        vid.loop = !!this.options.loop;
        vid.muted = !!this.options.muted;
        vid.playsInline = !!this.options.playsInline;
        for (var i = 0; i < this._url.length; i++) {
          var source = create$1("source");
          source.src = this._url[i];
          vid.appendChild(source);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function videoOverlay(video, bounds, options) {
      return new VideoOverlay(video, bounds, options);
    }
    var SVGOverlay = ImageOverlay.extend({
      _initImage: function() {
        var el = this._image = this._url;
        addClass(el, "leaflet-image-layer");
        if (this._zoomAnimated) {
          addClass(el, "leaflet-zoom-animated");
        }
        if (this.options.className) {
          addClass(el, this.options.className);
        }
        el.onselectstart = falseFn;
        el.onmousemove = falseFn;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function svgOverlay(el, bounds, options) {
      return new SVGOverlay(el, bounds, options);
    }
    var DivOverlay = Layer.extend({
      // @section
      // @aka DivOverlay options
      options: {
        // @option interactive: Boolean = false
        // If true, the popup/tooltip will listen to the mouse events.
        interactive: false,
        // @option offset: Point = Point(0, 0)
        // The offset of the overlay position.
        offset: [0, 0],
        // @option className: String = ''
        // A custom CSS class name to assign to the overlay.
        className: "",
        // @option pane: String = undefined
        // `Map pane` where the overlay will be added.
        pane: void 0,
        // @option content: String|HTMLElement|Function = ''
        // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
        // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
        content: ""
      },
      initialize: function(options, source) {
        if (options && (options instanceof LatLng || isArray(options))) {
          this._latlng = toLatLng(options);
          setOptions(this, source);
        } else {
          setOptions(this, options);
          this._source = source;
        }
        if (this.options.content) {
          this._content = this.options.content;
        }
      },
      // @method openOn(map: Map): this
      // Adds the overlay to the map.
      // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
      openOn: function(map) {
        map = arguments.length ? map : this._source._map;
        if (!map.hasLayer(this)) {
          map.addLayer(this);
        }
        return this;
      },
      // @method close(): this
      // Closes the overlay.
      // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
      // and `layer.closePopup()`/`.closeTooltip()`.
      close: function() {
        if (this._map) {
          this._map.removeLayer(this);
        }
        return this;
      },
      // @method toggle(layer?: Layer): this
      // Opens or closes the overlay bound to layer depending on its current state.
      // Argument may be omitted only for overlay bound to layer.
      // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
      toggle: function(layer) {
        if (this._map) {
          this.close();
        } else {
          if (arguments.length) {
            this._source = layer;
          } else {
            layer = this._source;
          }
          this._prepareOpen();
          this.openOn(layer._map);
        }
        return this;
      },
      onAdd: function(map) {
        this._zoomAnimated = map._zoomAnimated;
        if (!this._container) {
          this._initLayout();
        }
        if (map._fadeAnimated) {
          setOpacity(this._container, 0);
        }
        clearTimeout(this._removeTimeout);
        this.getPane().appendChild(this._container);
        this.update();
        if (map._fadeAnimated) {
          setOpacity(this._container, 1);
        }
        this.bringToFront();
        if (this.options.interactive) {
          addClass(this._container, "leaflet-interactive");
          this.addInteractiveTarget(this._container);
        }
      },
      onRemove: function(map) {
        if (map._fadeAnimated) {
          setOpacity(this._container, 0);
          this._removeTimeout = setTimeout(bind(remove, void 0, this._container), 200);
        } else {
          remove(this._container);
        }
        if (this.options.interactive) {
          removeClass(this._container, "leaflet-interactive");
          this.removeInteractiveTarget(this._container);
        }
      },
      // @namespace DivOverlay
      // @method getLatLng: LatLng
      // Returns the geographical point of the overlay.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Sets the geographical point where the overlay will open.
      setLatLng: function(latlng) {
        this._latlng = toLatLng(latlng);
        if (this._map) {
          this._updatePosition();
          this._adjustPan();
        }
        return this;
      },
      // @method getContent: String|HTMLElement
      // Returns the content of the overlay.
      getContent: function() {
        return this._content;
      },
      // @method setContent(htmlContent: String|HTMLElement|Function): this
      // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
      // The function should return a `String` or `HTMLElement` to be used in the overlay.
      setContent: function(content) {
        this._content = content;
        this.update();
        return this;
      },
      // @method getElement: String|HTMLElement
      // Returns the HTML container of the overlay.
      getElement: function() {
        return this._container;
      },
      // @method update: null
      // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
      update: function() {
        if (!this._map) {
          return;
        }
        this._container.style.visibility = "hidden";
        this._updateContent();
        this._updateLayout();
        this._updatePosition();
        this._container.style.visibility = "";
        this._adjustPan();
      },
      getEvents: function() {
        var events = {
          zoom: this._updatePosition,
          viewreset: this._updatePosition
        };
        if (this._zoomAnimated) {
          events.zoomanim = this._animateZoom;
        }
        return events;
      },
      // @method isOpen: Boolean
      // Returns `true` when the overlay is visible on the map.
      isOpen: function() {
        return !!this._map && this._map.hasLayer(this);
      },
      // @method bringToFront: this
      // Brings this overlay in front of other overlays (in the same map pane).
      bringToFront: function() {
        if (this._map) {
          toFront(this._container);
        }
        return this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        if (this._map) {
          toBack(this._container);
        }
        return this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(latlng) {
        var source = this._source;
        if (!source._map) {
          return false;
        }
        if (source instanceof FeatureGroup) {
          source = null;
          var layers2 = this._source._layers;
          for (var id2 in layers2) {
            if (layers2[id2]._map) {
              source = layers2[id2];
              break;
            }
          }
          if (!source) {
            return false;
          }
          this._source = source;
        }
        if (!latlng) {
          if (source.getCenter) {
            latlng = source.getCenter();
          } else if (source.getLatLng) {
            latlng = source.getLatLng();
          } else if (source.getBounds) {
            latlng = source.getBounds().getCenter();
          } else {
            throw new Error("Unable to get source layer LatLng.");
          }
        }
        this.setLatLng(latlng);
        if (this._map) {
          this.update();
        }
        return true;
      },
      _updateContent: function() {
        if (!this._content) {
          return;
        }
        var node = this._contentNode;
        var content = typeof this._content === "function" ? this._content(this._source || this) : this._content;
        if (typeof content === "string") {
          node.innerHTML = content;
        } else {
          while (node.hasChildNodes()) {
            node.removeChild(node.firstChild);
          }
          node.appendChild(content);
        }
        this.fire("contentupdate");
      },
      _updatePosition: function() {
        if (!this._map) {
          return;
        }
        var pos = this._map.latLngToLayerPoint(this._latlng), offset = toPoint(this.options.offset), anchor = this._getAnchor();
        if (this._zoomAnimated) {
          setPosition(this._container, pos.add(anchor));
        } else {
          offset = offset.add(pos).add(anchor);
        }
        var bottom = this._containerBottom = -offset.y, left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;
        this._container.style.bottom = bottom + "px";
        this._container.style.left = left + "px";
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    Map2.include({
      _initOverlay: function(OverlayClass, content, latlng, options) {
        var overlay = content;
        if (!(overlay instanceof OverlayClass)) {
          overlay = new OverlayClass(options).setContent(content);
        }
        if (latlng) {
          overlay.setLatLng(latlng);
        }
        return overlay;
      }
    });
    Layer.include({
      _initOverlay: function(OverlayClass, old, content, options) {
        var overlay = content;
        if (overlay instanceof OverlayClass) {
          setOptions(overlay, options);
          overlay._source = this;
        } else {
          overlay = old && !options ? old : new OverlayClass(options, this);
          overlay.setContent(content);
        }
        return overlay;
      }
    });
    var Popup2 = DivOverlay.extend({
      // @section
      // @aka Popup options
      options: {
        // @option pane: String = 'popupPane'
        // `Map pane` where the popup will be added.
        pane: "popupPane",
        // @option offset: Point = Point(0, 7)
        // The offset of the popup position.
        offset: [0, 7],
        // @option maxWidth: Number = 300
        // Max width of the popup, in pixels.
        maxWidth: 300,
        // @option minWidth: Number = 50
        // Min width of the popup, in pixels.
        minWidth: 50,
        // @option maxHeight: Number = null
        // If set, creates a scrollable container of the given height
        // inside a popup if its content exceeds it.
        // The scrollable container can be styled using the
        // `leaflet-popup-scrolled` CSS class selector.
        maxHeight: null,
        // @option autoPan: Boolean = true
        // Set it to `false` if you don't want the map to do panning animation
        // to fit the opened popup.
        autoPan: true,
        // @option autoPanPaddingTopLeft: Point = null
        // The margin between the popup and the top left corner of the map
        // view after autopanning was performed.
        autoPanPaddingTopLeft: null,
        // @option autoPanPaddingBottomRight: Point = null
        // The margin between the popup and the bottom right corner of the map
        // view after autopanning was performed.
        autoPanPaddingBottomRight: null,
        // @option autoPanPadding: Point = Point(5, 5)
        // Equivalent of setting both top left and bottom right autopan padding to the same value.
        autoPanPadding: [5, 5],
        // @option keepInView: Boolean = false
        // Set it to `true` if you want to prevent users from panning the popup
        // off of the screen while it is open.
        keepInView: false,
        // @option closeButton: Boolean = true
        // Controls the presence of a close button in the popup.
        closeButton: true,
        // @option autoClose: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the popup closing when another popup is opened.
        autoClose: true,
        // @option closeOnEscapeKey: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the ESC key for closing of the popup.
        closeOnEscapeKey: true,
        // @option closeOnClick: Boolean = *
        // Set it if you want to override the default behavior of the popup closing when user clicks
        // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
        // @option className: String = ''
        // A custom CSS class name to assign to the popup.
        className: ""
      },
      // @namespace Popup
      // @method openOn(map: Map): this
      // Alternative to `map.openPopup(popup)`.
      // Adds the popup to the map and closes the previous one.
      openOn: function(map) {
        map = arguments.length ? map : this._source._map;
        if (!map.hasLayer(this) && map._popup && map._popup.options.autoClose) {
          map.removeLayer(map._popup);
        }
        map._popup = this;
        return DivOverlay.prototype.openOn.call(this, map);
      },
      onAdd: function(map) {
        DivOverlay.prototype.onAdd.call(this, map);
        map.fire("popupopen", { popup: this });
        if (this._source) {
          this._source.fire("popupopen", { popup: this }, true);
          if (!(this._source instanceof Path)) {
            this._source.on("preclick", stopPropagation);
          }
        }
      },
      onRemove: function(map) {
        DivOverlay.prototype.onRemove.call(this, map);
        map.fire("popupclose", { popup: this });
        if (this._source) {
          this._source.fire("popupclose", { popup: this }, true);
          if (!(this._source instanceof Path)) {
            this._source.off("preclick", stopPropagation);
          }
        }
      },
      getEvents: function() {
        var events = DivOverlay.prototype.getEvents.call(this);
        if (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
          events.preclick = this.close;
        }
        if (this.options.keepInView) {
          events.moveend = this._adjustPan;
        }
        return events;
      },
      _initLayout: function() {
        var prefix = "leaflet-popup", container = this._container = create$1(
          "div",
          prefix + " " + (this.options.className || "") + " leaflet-zoom-animated"
        );
        var wrapper = this._wrapper = create$1("div", prefix + "-content-wrapper", container);
        this._contentNode = create$1("div", prefix + "-content", wrapper);
        disableClickPropagation(container);
        disableScrollPropagation(this._contentNode);
        on(container, "contextmenu", stopPropagation);
        this._tipContainer = create$1("div", prefix + "-tip-container", container);
        this._tip = create$1("div", prefix + "-tip", this._tipContainer);
        if (this.options.closeButton) {
          var closeButton = this._closeButton = create$1("a", prefix + "-close-button", container);
          closeButton.setAttribute("role", "button");
          closeButton.setAttribute("aria-label", "Close popup");
          closeButton.href = "#close";
          closeButton.innerHTML = '<span aria-hidden="true">&#215;</span>';
          on(closeButton, "click", function(ev) {
            preventDefault(ev);
            this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var container = this._contentNode, style2 = container.style;
        style2.width = "";
        style2.whiteSpace = "nowrap";
        var width = container.offsetWidth;
        width = Math.min(width, this.options.maxWidth);
        width = Math.max(width, this.options.minWidth);
        style2.width = width + 1 + "px";
        style2.whiteSpace = "";
        style2.height = "";
        var height = container.offsetHeight, maxHeight = this.options.maxHeight, scrolledClass = "leaflet-popup-scrolled";
        if (maxHeight && height > maxHeight) {
          style2.height = maxHeight + "px";
          addClass(container, scrolledClass);
        } else {
          removeClass(container, scrolledClass);
        }
        this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(e) {
        var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), anchor = this._getAnchor();
        setPosition(this._container, pos.add(anchor));
      },
      _adjustPan: function() {
        if (!this.options.autoPan) {
          return;
        }
        if (this._map._panAnim) {
          this._map._panAnim.stop();
        }
        if (this._autopanning) {
          this._autopanning = false;
          return;
        }
        var map = this._map, marginBottom = parseInt(getStyle(this._container, "marginBottom"), 10) || 0, containerHeight = this._container.offsetHeight + marginBottom, containerWidth = this._containerWidth, layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);
        layerPos._add(getPosition(this._container));
        var containerPos = map.layerPointToContainerPoint(layerPos), padding = toPoint(this.options.autoPanPadding), paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding), paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding), size = map.getSize(), dx = 0, dy = 0;
        if (containerPos.x + containerWidth + paddingBR.x > size.x) {
          dx = containerPos.x + containerWidth - size.x + paddingBR.x;
        }
        if (containerPos.x - dx - paddingTL.x < 0) {
          dx = containerPos.x - paddingTL.x;
        }
        if (containerPos.y + containerHeight + paddingBR.y > size.y) {
          dy = containerPos.y + containerHeight - size.y + paddingBR.y;
        }
        if (containerPos.y - dy - paddingTL.y < 0) {
          dy = containerPos.y - paddingTL.y;
        }
        if (dx || dy) {
          if (this.options.keepInView) {
            this._autopanning = true;
          }
          map.fire("autopanstart").panBy([dx, dy]);
        }
      },
      _getAnchor: function() {
        return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    });
    var popup = function(options, source) {
      return new Popup2(options, source);
    };
    Map2.mergeOptions({
      closePopupOnClick: true
    });
    Map2.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(popup2, latlng, options) {
        this._initOverlay(Popup2, popup2, latlng, options).openOn(this);
        return this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(popup2) {
        popup2 = arguments.length ? popup2 : this._popup;
        if (popup2) {
          popup2.close();
        }
        return this;
      }
    });
    Layer.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(content, options) {
        this._popup = this._initOverlay(Popup2, this._popup, content, options);
        if (!this._popupHandlersAdded) {
          this.on({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          });
          this._popupHandlersAdded = true;
        }
        return this;
      },
      // @method unbindPopup(): this
      // Removes the popup previously bound with `bindPopup`.
      unbindPopup: function() {
        if (this._popup) {
          this.off({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          });
          this._popupHandlersAdded = false;
          this._popup = null;
        }
        return this;
      },
      // @method openPopup(latlng?: LatLng): this
      // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
      openPopup: function(latlng) {
        if (this._popup) {
          if (!(this instanceof FeatureGroup)) {
            this._popup._source = this;
          }
          if (this._popup._prepareOpen(latlng || this._latlng)) {
            this._popup.openOn(this._map);
          }
        }
        return this;
      },
      // @method closePopup(): this
      // Closes the popup bound to this layer if it is open.
      closePopup: function() {
        if (this._popup) {
          this._popup.close();
        }
        return this;
      },
      // @method togglePopup(): this
      // Opens or closes the popup bound to this layer depending on its current state.
      togglePopup: function() {
        if (this._popup) {
          this._popup.toggle(this);
        }
        return this;
      },
      // @method isPopupOpen(): boolean
      // Returns `true` if the popup bound to this layer is currently open.
      isPopupOpen: function() {
        return this._popup ? this._popup.isOpen() : false;
      },
      // @method setPopupContent(content: String|HTMLElement|Popup): this
      // Sets the content of the popup bound to this layer.
      setPopupContent: function(content) {
        if (this._popup) {
          this._popup.setContent(content);
        }
        return this;
      },
      // @method getPopup(): Popup
      // Returns the popup bound to this layer.
      getPopup: function() {
        return this._popup;
      },
      _openPopup: function(e) {
        if (!this._popup || !this._map) {
          return;
        }
        stop(e);
        var target = e.layer || e.target;
        if (this._popup._source === target && !(target instanceof Path)) {
          if (this._map.hasLayer(this._popup)) {
            this.closePopup();
          } else {
            this.openPopup(e.latlng);
          }
          return;
        }
        this._popup._source = target;
        this.openPopup(e.latlng);
      },
      _movePopup: function(e) {
        this._popup.setLatLng(e.latlng);
      },
      _onKeyPress: function(e) {
        if (e.originalEvent.keyCode === 13) {
          this._openPopup(e);
        }
      }
    });
    var Tooltip = DivOverlay.extend({
      // @section
      // @aka Tooltip options
      options: {
        // @option pane: String = 'tooltipPane'
        // `Map pane` where the tooltip will be added.
        pane: "tooltipPane",
        // @option offset: Point = Point(0, 0)
        // Optional offset of the tooltip position.
        offset: [0, 0],
        // @option direction: String = 'auto'
        // Direction where to open the tooltip. Possible values are: `right`, `left`,
        // `top`, `bottom`, `center`, `auto`.
        // `auto` will dynamically switch between `right` and `left` according to the tooltip
        // position on the map.
        direction: "auto",
        // @option permanent: Boolean = false
        // Whether to open the tooltip permanently or only on mouseover.
        permanent: false,
        // @option sticky: Boolean = false
        // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
        sticky: false,
        // @option opacity: Number = 0.9
        // Tooltip container opacity.
        opacity: 0.9
      },
      onAdd: function(map) {
        DivOverlay.prototype.onAdd.call(this, map);
        this.setOpacity(this.options.opacity);
        map.fire("tooltipopen", { tooltip: this });
        if (this._source) {
          this.addEventParent(this._source);
          this._source.fire("tooltipopen", { tooltip: this }, true);
        }
      },
      onRemove: function(map) {
        DivOverlay.prototype.onRemove.call(this, map);
        map.fire("tooltipclose", { tooltip: this });
        if (this._source) {
          this.removeEventParent(this._source);
          this._source.fire("tooltipclose", { tooltip: this }, true);
        }
      },
      getEvents: function() {
        var events = DivOverlay.prototype.getEvents.call(this);
        if (!this.options.permanent) {
          events.preclick = this.close;
        }
        return events;
      },
      _initLayout: function() {
        var prefix = "leaflet-tooltip", className = prefix + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = create$1("div", className);
        this._container.setAttribute("role", "tooltip");
        this._container.setAttribute("id", "leaflet-tooltip-" + stamp(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(pos) {
        var subX, subY, map = this._map, container = this._container, centerPoint = map.latLngToContainerPoint(map.getCenter()), tooltipPoint = map.layerPointToContainerPoint(pos), direction = this.options.direction, tooltipWidth = container.offsetWidth, tooltipHeight = container.offsetHeight, offset = toPoint(this.options.offset), anchor = this._getAnchor();
        if (direction === "top") {
          subX = tooltipWidth / 2;
          subY = tooltipHeight;
        } else if (direction === "bottom") {
          subX = tooltipWidth / 2;
          subY = 0;
        } else if (direction === "center") {
          subX = tooltipWidth / 2;
          subY = tooltipHeight / 2;
        } else if (direction === "right") {
          subX = 0;
          subY = tooltipHeight / 2;
        } else if (direction === "left") {
          subX = tooltipWidth;
          subY = tooltipHeight / 2;
        } else if (tooltipPoint.x < centerPoint.x) {
          direction = "right";
          subX = 0;
          subY = tooltipHeight / 2;
        } else {
          direction = "left";
          subX = tooltipWidth + (offset.x + anchor.x) * 2;
          subY = tooltipHeight / 2;
        }
        pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);
        removeClass(container, "leaflet-tooltip-right");
        removeClass(container, "leaflet-tooltip-left");
        removeClass(container, "leaflet-tooltip-top");
        removeClass(container, "leaflet-tooltip-bottom");
        addClass(container, "leaflet-tooltip-" + direction);
        setPosition(container, pos);
      },
      _updatePosition: function() {
        var pos = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(pos);
      },
      setOpacity: function(opacity) {
        this.options.opacity = opacity;
        if (this._container) {
          setOpacity(this._container, opacity);
        }
      },
      _animateZoom: function(e) {
        var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
        this._setPosition(pos);
      },
      _getAnchor: function() {
        return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    });
    var tooltip = function(options, source) {
      return new Tooltip(options, source);
    };
    Map2.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(tooltip2, latlng, options) {
        this._initOverlay(Tooltip, tooltip2, latlng, options).openOn(this);
        return this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(tooltip2) {
        tooltip2.close();
        return this;
      }
    });
    Layer.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(content, options) {
        if (this._tooltip && this.isTooltipOpen()) {
          this.unbindTooltip();
        }
        this._tooltip = this._initOverlay(Tooltip, this._tooltip, content, options);
        this._initTooltipInteractions();
        if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
          this.openTooltip();
        }
        return this;
      },
      // @method unbindTooltip(): this
      // Removes the tooltip previously bound with `bindTooltip`.
      unbindTooltip: function() {
        if (this._tooltip) {
          this._initTooltipInteractions(true);
          this.closeTooltip();
          this._tooltip = null;
        }
        return this;
      },
      _initTooltipInteractions: function(remove2) {
        if (!remove2 && this._tooltipHandlersAdded) {
          return;
        }
        var onOff = remove2 ? "off" : "on", events = {
          remove: this.closeTooltip,
          move: this._moveTooltip
        };
        if (!this._tooltip.options.permanent) {
          events.mouseover = this._openTooltip;
          events.mouseout = this.closeTooltip;
          events.click = this._openTooltip;
          if (this._map) {
            this._addFocusListeners();
          } else {
            events.add = this._addFocusListeners;
          }
        } else {
          events.add = this._openTooltip;
        }
        if (this._tooltip.options.sticky) {
          events.mousemove = this._moveTooltip;
        }
        this[onOff](events);
        this._tooltipHandlersAdded = !remove2;
      },
      // @method openTooltip(latlng?: LatLng): this
      // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
      openTooltip: function(latlng) {
        if (this._tooltip) {
          if (!(this instanceof FeatureGroup)) {
            this._tooltip._source = this;
          }
          if (this._tooltip._prepareOpen(latlng)) {
            this._tooltip.openOn(this._map);
            if (this.getElement) {
              this._setAriaDescribedByOnLayer(this);
            } else if (this.eachLayer) {
              this.eachLayer(this._setAriaDescribedByOnLayer, this);
            }
          }
        }
        return this;
      },
      // @method closeTooltip(): this
      // Closes the tooltip bound to this layer if it is open.
      closeTooltip: function() {
        if (this._tooltip) {
          return this._tooltip.close();
        }
      },
      // @method toggleTooltip(): this
      // Opens or closes the tooltip bound to this layer depending on its current state.
      toggleTooltip: function() {
        if (this._tooltip) {
          this._tooltip.toggle(this);
        }
        return this;
      },
      // @method isTooltipOpen(): boolean
      // Returns `true` if the tooltip bound to this layer is currently open.
      isTooltipOpen: function() {
        return this._tooltip.isOpen();
      },
      // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
      // Sets the content of the tooltip bound to this layer.
      setTooltipContent: function(content) {
        if (this._tooltip) {
          this._tooltip.setContent(content);
        }
        return this;
      },
      // @method getTooltip(): Tooltip
      // Returns the tooltip bound to this layer.
      getTooltip: function() {
        return this._tooltip;
      },
      _addFocusListeners: function() {
        if (this.getElement) {
          this._addFocusListenersOnLayer(this);
        } else if (this.eachLayer) {
          this.eachLayer(this._addFocusListenersOnLayer, this);
        }
      },
      _addFocusListenersOnLayer: function(layer) {
        var el = typeof layer.getElement === "function" && layer.getElement();
        if (el) {
          on(el, "focus", function() {
            this._tooltip._source = layer;
            this.openTooltip();
          }, this);
          on(el, "blur", this.closeTooltip, this);
        }
      },
      _setAriaDescribedByOnLayer: function(layer) {
        var el = typeof layer.getElement === "function" && layer.getElement();
        if (el) {
          el.setAttribute("aria-describedby", this._tooltip._container.id);
        }
      },
      _openTooltip: function(e) {
        if (!this._tooltip || !this._map) {
          return;
        }
        if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
          this._openOnceFlag = true;
          var that = this;
          this._map.once("moveend", function() {
            that._openOnceFlag = false;
            that._openTooltip(e);
          });
          return;
        }
        this._tooltip._source = e.layer || e.target;
        this.openTooltip(this._tooltip.options.sticky ? e.latlng : void 0);
      },
      _moveTooltip: function(e) {
        var latlng = e.latlng, containerPoint, layerPoint;
        if (this._tooltip.options.sticky && e.originalEvent) {
          containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
          layerPoint = this._map.containerPointToLayerPoint(containerPoint);
          latlng = this._map.layerPointToLatLng(layerPoint);
        }
        this._tooltip.setLatLng(latlng);
      }
    });
    var DivIcon = Icon.extend({
      options: {
        // @section
        // @aka DivIcon options
        iconSize: [12, 12],
        // also can be set through CSS
        // iconAnchor: (Point),
        // popupAnchor: (Point),
        // @option html: String|HTMLElement = ''
        // Custom HTML code to put inside the div element, empty by default. Alternatively,
        // an instance of `HTMLElement`.
        html: false,
        // @option bgPos: Point = [0, 0]
        // Optional relative position of the background, in pixels
        bgPos: null,
        className: "leaflet-div-icon"
      },
      createIcon: function(oldIcon) {
        var div = oldIcon && oldIcon.tagName === "DIV" ? oldIcon : document.createElement("div"), options = this.options;
        if (options.html instanceof Element) {
          empty(div);
          div.appendChild(options.html);
        } else {
          div.innerHTML = options.html !== false ? options.html : "";
        }
        if (options.bgPos) {
          var bgPos = toPoint(options.bgPos);
          div.style.backgroundPosition = -bgPos.x + "px " + -bgPos.y + "px";
        }
        this._setIconStyles(div, "icon");
        return div;
      },
      createShadow: function() {
        return null;
      }
    });
    function divIcon(options) {
      return new DivIcon(options);
    }
    Icon.Default = IconDefault;
    var GridLayer = Layer.extend({
      // @section
      // @aka GridLayer options
      options: {
        // @option tileSize: Number|Point = 256
        // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
        tileSize: 256,
        // @option opacity: Number = 1.0
        // Opacity of the tiles. Can be used in the `createTile()` function.
        opacity: 1,
        // @option updateWhenIdle: Boolean = (depends)
        // Load new tiles only when panning ends.
        // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
        // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
        // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
        updateWhenIdle: Browser.mobile,
        // @option updateWhenZooming: Boolean = true
        // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
        updateWhenZooming: true,
        // @option updateInterval: Number = 200
        // Tiles will not update more than once every `updateInterval` milliseconds when panning.
        updateInterval: 200,
        // @option zIndex: Number = 1
        // The explicit zIndex of the tile layer.
        zIndex: 1,
        // @option bounds: LatLngBounds = undefined
        // If set, tiles will only be loaded inside the set `LatLngBounds`.
        bounds: null,
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = undefined
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: void 0,
        // @option maxNativeZoom: Number = undefined
        // Maximum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
        // from `maxNativeZoom` level and auto-scaled.
        maxNativeZoom: void 0,
        // @option minNativeZoom: Number = undefined
        // Minimum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
        // from `minNativeZoom` level and auto-scaled.
        minNativeZoom: void 0,
        // @option noWrap: Boolean = false
        // Whether the layer is wrapped around the antimeridian. If `true`, the
        // GridLayer will only be displayed once at low zoom levels. Has no
        // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
        // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
        // tiles outside the CRS limits.
        noWrap: false,
        // @option pane: String = 'tilePane'
        // `Map pane` where the grid layer will be added.
        pane: "tilePane",
        // @option className: String = ''
        // A custom class name to assign to the tile layer. Empty by default.
        className: "",
        // @option keepBuffer: Number = 2
        // When panning the map, keep this many rows and columns of tiles before unloading them.
        keepBuffer: 2
      },
      initialize: function(options) {
        setOptions(this, options);
      },
      onAdd: function() {
        this._initContainer();
        this._levels = {};
        this._tiles = {};
        this._resetView();
      },
      beforeAdd: function(map) {
        map._addZoomLimit(this);
      },
      onRemove: function(map) {
        this._removeAllTiles();
        remove(this._container);
        map._removeZoomLimit(this);
        this._container = null;
        this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        if (this._map) {
          toFront(this._container);
          this._setAutoZIndex(Math.max);
        }
        return this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        if (this._map) {
          toBack(this._container);
          this._setAutoZIndex(Math.min);
        }
        return this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the tiles for this layer.
      getContainer: function() {
        return this._container;
      },
      // @method setOpacity(opacity: Number): this
      // Changes the [opacity](#gridlayer-opacity) of the grid layer.
      setOpacity: function(opacity) {
        this.options.opacity = opacity;
        this._updateOpacity();
        return this;
      },
      // @method setZIndex(zIndex: Number): this
      // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
      setZIndex: function(zIndex) {
        this.options.zIndex = zIndex;
        this._updateZIndex();
        return this;
      },
      // @method isLoading: Boolean
      // Returns `true` if any tile in the grid layer has not finished loading.
      isLoading: function() {
        return this._loading;
      },
      // @method redraw: this
      // Causes the layer to clear all the tiles and request them again.
      redraw: function() {
        if (this._map) {
          this._removeAllTiles();
          var tileZoom = this._clampZoom(this._map.getZoom());
          if (tileZoom !== this._tileZoom) {
            this._tileZoom = tileZoom;
            this._updateLevels();
          }
          this._update();
        }
        return this;
      },
      getEvents: function() {
        var events = {
          viewprereset: this._invalidateAll,
          viewreset: this._resetView,
          zoom: this._resetView,
          moveend: this._onMoveEnd
        };
        if (!this.options.updateWhenIdle) {
          if (!this._onMove) {
            this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
          }
          events.move = this._onMove;
        }
        if (this._zoomAnimated) {
          events.zoomanim = this._animateZoom;
        }
        return events;
      },
      // @section Extension methods
      // Layers extending `GridLayer` shall reimplement the following method.
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, must be overridden by classes extending `GridLayer`.
      // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
      // is specified, it must be called when the tile has finished loading and drawing.
      createTile: function() {
        return document.createElement("div");
      },
      // @section
      // @method getTileSize: Point
      // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
      getTileSize: function() {
        var s = this.options.tileSize;
        return s instanceof Point ? s : new Point(s, s);
      },
      _updateZIndex: function() {
        if (this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null) {
          this._container.style.zIndex = this.options.zIndex;
        }
      },
      _setAutoZIndex: function(compare) {
        var layers2 = this.getPane().children, edgeZIndex = -compare(-Infinity, Infinity);
        for (var i = 0, len = layers2.length, zIndex; i < len; i++) {
          zIndex = layers2[i].style.zIndex;
          if (layers2[i] !== this._container && zIndex) {
            edgeZIndex = compare(edgeZIndex, +zIndex);
          }
        }
        if (isFinite(edgeZIndex)) {
          this.options.zIndex = edgeZIndex + compare(-1, 1);
          this._updateZIndex();
        }
      },
      _updateOpacity: function() {
        if (!this._map) {
          return;
        }
        if (Browser.ielt9) {
          return;
        }
        setOpacity(this._container, this.options.opacity);
        var now2 = +/* @__PURE__ */ new Date(), nextFrame = false, willPrune = false;
        for (var key in this._tiles) {
          var tile = this._tiles[key];
          if (!tile.current || !tile.loaded) {
            continue;
          }
          var fade = Math.min(1, (now2 - tile.loaded) / 200);
          setOpacity(tile.el, fade);
          if (fade < 1) {
            nextFrame = true;
          } else {
            if (tile.active) {
              willPrune = true;
            } else {
              this._onOpaqueTile(tile);
            }
            tile.active = true;
          }
        }
        if (willPrune && !this._noPrune) {
          this._pruneTiles();
        }
        if (nextFrame) {
          cancelAnimFrame(this._fadeFrame);
          this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
        }
      },
      _onOpaqueTile: falseFn,
      _initContainer: function() {
        if (this._container) {
          return;
        }
        this._container = create$1("div", "leaflet-layer " + (this.options.className || ""));
        this._updateZIndex();
        if (this.options.opacity < 1) {
          this._updateOpacity();
        }
        this.getPane().appendChild(this._container);
      },
      _updateLevels: function() {
        var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom;
        if (zoom2 === void 0) {
          return void 0;
        }
        for (var z in this._levels) {
          z = Number(z);
          if (this._levels[z].el.children.length || z === zoom2) {
            this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom2 - z);
            this._onUpdateLevel(z);
          } else {
            remove(this._levels[z].el);
            this._removeTilesAtZoom(z);
            this._onRemoveLevel(z);
            delete this._levels[z];
          }
        }
        var level = this._levels[zoom2], map = this._map;
        if (!level) {
          level = this._levels[zoom2] = {};
          level.el = create$1("div", "leaflet-tile-container leaflet-zoom-animated", this._container);
          level.el.style.zIndex = maxZoom;
          level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom2).round();
          level.zoom = zoom2;
          this._setZoomTransform(level, map.getCenter(), map.getZoom());
          falseFn(level.el.offsetWidth);
          this._onCreateLevel(level);
        }
        this._level = level;
        return level;
      },
      _onUpdateLevel: falseFn,
      _onRemoveLevel: falseFn,
      _onCreateLevel: falseFn,
      _pruneTiles: function() {
        if (!this._map) {
          return;
        }
        var key, tile;
        var zoom2 = this._map.getZoom();
        if (zoom2 > this.options.maxZoom || zoom2 < this.options.minZoom) {
          this._removeAllTiles();
          return;
        }
        for (key in this._tiles) {
          tile = this._tiles[key];
          tile.retain = tile.current;
        }
        for (key in this._tiles) {
          tile = this._tiles[key];
          if (tile.current && !tile.active) {
            var coords = tile.coords;
            if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
              this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
            }
          }
        }
        for (key in this._tiles) {
          if (!this._tiles[key].retain) {
            this._removeTile(key);
          }
        }
      },
      _removeTilesAtZoom: function(zoom2) {
        for (var key in this._tiles) {
          if (this._tiles[key].coords.z !== zoom2) {
            continue;
          }
          this._removeTile(key);
        }
      },
      _removeAllTiles: function() {
        for (var key in this._tiles) {
          this._removeTile(key);
        }
      },
      _invalidateAll: function() {
        for (var z in this._levels) {
          remove(this._levels[z].el);
          this._onRemoveLevel(Number(z));
          delete this._levels[z];
        }
        this._removeAllTiles();
        this._tileZoom = void 0;
      },
      _retainParent: function(x, y, z, minZoom) {
        var x2 = Math.floor(x / 2), y2 = Math.floor(y / 2), z2 = z - 1, coords2 = new Point(+x2, +y2);
        coords2.z = +z2;
        var key = this._tileCoordsToKey(coords2), tile = this._tiles[key];
        if (tile && tile.active) {
          tile.retain = true;
          return true;
        } else if (tile && tile.loaded) {
          tile.retain = true;
        }
        if (z2 > minZoom) {
          return this._retainParent(x2, y2, z2, minZoom);
        }
        return false;
      },
      _retainChildren: function(x, y, z, maxZoom) {
        for (var i = 2 * x; i < 2 * x + 2; i++) {
          for (var j = 2 * y; j < 2 * y + 2; j++) {
            var coords = new Point(i, j);
            coords.z = z + 1;
            var key = this._tileCoordsToKey(coords), tile = this._tiles[key];
            if (tile && tile.active) {
              tile.retain = true;
              continue;
            } else if (tile && tile.loaded) {
              tile.retain = true;
            }
            if (z + 1 < maxZoom) {
              this._retainChildren(i, j, z + 1, maxZoom);
            }
          }
        }
      },
      _resetView: function(e) {
        var animating = e && (e.pinch || e.flyTo);
        this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
      },
      _animateZoom: function(e) {
        this._setView(e.center, e.zoom, true, e.noUpdate);
      },
      _clampZoom: function(zoom2) {
        var options = this.options;
        if (void 0 !== options.minNativeZoom && zoom2 < options.minNativeZoom) {
          return options.minNativeZoom;
        }
        if (void 0 !== options.maxNativeZoom && options.maxNativeZoom < zoom2) {
          return options.maxNativeZoom;
        }
        return zoom2;
      },
      _setView: function(center, zoom2, noPrune, noUpdate) {
        var tileZoom = Math.round(zoom2);
        if (this.options.maxZoom !== void 0 && tileZoom > this.options.maxZoom || this.options.minZoom !== void 0 && tileZoom < this.options.minZoom) {
          tileZoom = void 0;
        } else {
          tileZoom = this._clampZoom(tileZoom);
        }
        var tileZoomChanged = this.options.updateWhenZooming && tileZoom !== this._tileZoom;
        if (!noUpdate || tileZoomChanged) {
          this._tileZoom = tileZoom;
          if (this._abortLoading) {
            this._abortLoading();
          }
          this._updateLevels();
          this._resetGrid();
          if (tileZoom !== void 0) {
            this._update(center);
          }
          if (!noPrune) {
            this._pruneTiles();
          }
          this._noPrune = !!noPrune;
        }
        this._setZoomTransforms(center, zoom2);
      },
      _setZoomTransforms: function(center, zoom2) {
        for (var i in this._levels) {
          this._setZoomTransform(this._levels[i], center, zoom2);
        }
      },
      _setZoomTransform: function(level, center, zoom2) {
        var scale3 = this._map.getZoomScale(zoom2, level.zoom), translate = level.origin.multiplyBy(scale3).subtract(this._map._getNewPixelOrigin(center, zoom2)).round();
        if (Browser.any3d) {
          setTransform(level.el, translate, scale3);
        } else {
          setPosition(level.el, translate);
        }
      },
      _resetGrid: function() {
        var map = this._map, crs = map.options.crs, tileSize = this._tileSize = this.getTileSize(), tileZoom = this._tileZoom;
        var bounds = this._map.getPixelWorldBounds(this._tileZoom);
        if (bounds) {
          this._globalTileRange = this._pxBoundsToTileRange(bounds);
        }
        this._wrapX = crs.wrapLng && !this.options.noWrap && [
          Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
          Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
        ];
        this._wrapY = crs.wrapLat && !this.options.noWrap && [
          Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
          Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
        ];
      },
      _onMoveEnd: function() {
        if (!this._map || this._map._animatingZoom) {
          return;
        }
        this._update();
      },
      _getTiledPixelBounds: function(center) {
        var map = this._map, mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(), scale3 = map.getZoomScale(mapZoom, this._tileZoom), pixelCenter = map.project(center, this._tileZoom).floor(), halfSize = map.getSize().divideBy(scale3 * 2);
        return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(center) {
        var map = this._map;
        if (!map) {
          return;
        }
        var zoom2 = this._clampZoom(map.getZoom());
        if (center === void 0) {
          center = map.getCenter();
        }
        if (this._tileZoom === void 0) {
          return;
        }
        var pixelBounds = this._getTiledPixelBounds(center), tileRange = this._pxBoundsToTileRange(pixelBounds), tileCenter = tileRange.getCenter(), queue = [], margin = this.options.keepBuffer, noPruneRange = new Bounds(
          tileRange.getBottomLeft().subtract([margin, -margin]),
          tileRange.getTopRight().add([margin, -margin])
        );
        if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
          throw new Error("Attempted to load an infinite number of tiles");
        }
        for (var key in this._tiles) {
          var c = this._tiles[key].coords;
          if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
            this._tiles[key].current = false;
          }
        }
        if (Math.abs(zoom2 - this._tileZoom) > 1) {
          this._setView(center, zoom2);
          return;
        }
        for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
          for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
            var coords = new Point(i, j);
            coords.z = this._tileZoom;
            if (!this._isValidTile(coords)) {
              continue;
            }
            var tile = this._tiles[this._tileCoordsToKey(coords)];
            if (tile) {
              tile.current = true;
            } else {
              queue.push(coords);
            }
          }
        }
        queue.sort(function(a, b) {
          return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
        });
        if (queue.length !== 0) {
          if (!this._loading) {
            this._loading = true;
            this.fire("loading");
          }
          var fragment = document.createDocumentFragment();
          for (i = 0; i < queue.length; i++) {
            this._addTile(queue[i], fragment);
          }
          this._level.el.appendChild(fragment);
        }
      },
      _isValidTile: function(coords) {
        var crs = this._map.options.crs;
        if (!crs.infinite) {
          var bounds = this._globalTileRange;
          if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
            return false;
          }
        }
        if (!this.options.bounds) {
          return true;
        }
        var tileBounds = this._tileCoordsToBounds(coords);
        return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
      },
      _keyToBounds: function(key) {
        return this._tileCoordsToBounds(this._keyToTileCoords(key));
      },
      _tileCoordsToNwSe: function(coords) {
        var map = this._map, tileSize = this.getTileSize(), nwPoint = coords.scaleBy(tileSize), sePoint = nwPoint.add(tileSize), nw = map.unproject(nwPoint, coords.z), se = map.unproject(sePoint, coords.z);
        return [nw, se];
      },
      // converts tile coordinates to its geographical bounds
      _tileCoordsToBounds: function(coords) {
        var bp = this._tileCoordsToNwSe(coords), bounds = new LatLngBounds(bp[0], bp[1]);
        if (!this.options.noWrap) {
          bounds = this._map.wrapLatLngBounds(bounds);
        }
        return bounds;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(coords) {
        return coords.x + ":" + coords.y + ":" + coords.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(key) {
        var k = key.split(":"), coords = new Point(+k[0], +k[1]);
        coords.z = +k[2];
        return coords;
      },
      _removeTile: function(key) {
        var tile = this._tiles[key];
        if (!tile) {
          return;
        }
        remove(tile.el);
        delete this._tiles[key];
        this.fire("tileunload", {
          tile: tile.el,
          coords: this._keyToTileCoords(key)
        });
      },
      _initTile: function(tile) {
        addClass(tile, "leaflet-tile");
        var tileSize = this.getTileSize();
        tile.style.width = tileSize.x + "px";
        tile.style.height = tileSize.y + "px";
        tile.onselectstart = falseFn;
        tile.onmousemove = falseFn;
        if (Browser.ielt9 && this.options.opacity < 1) {
          setOpacity(tile, this.options.opacity);
        }
      },
      _addTile: function(coords, container) {
        var tilePos = this._getTilePos(coords), key = this._tileCoordsToKey(coords);
        var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));
        this._initTile(tile);
        if (this.createTile.length < 2) {
          requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
        }
        setPosition(tile, tilePos);
        this._tiles[key] = {
          el: tile,
          coords,
          current: true
        };
        container.appendChild(tile);
        this.fire("tileloadstart", {
          tile,
          coords
        });
      },
      _tileReady: function(coords, err, tile) {
        if (err) {
          this.fire("tileerror", {
            error: err,
            tile,
            coords
          });
        }
        var key = this._tileCoordsToKey(coords);
        tile = this._tiles[key];
        if (!tile) {
          return;
        }
        tile.loaded = +/* @__PURE__ */ new Date();
        if (this._map._fadeAnimated) {
          setOpacity(tile.el, 0);
          cancelAnimFrame(this._fadeFrame);
          this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
        } else {
          tile.active = true;
          this._pruneTiles();
        }
        if (!err) {
          addClass(tile.el, "leaflet-tile-loaded");
          this.fire("tileload", {
            tile: tile.el,
            coords
          });
        }
        if (this._noTilesToLoad()) {
          this._loading = false;
          this.fire("load");
          if (Browser.ielt9 || !this._map._fadeAnimated) {
            requestAnimFrame(this._pruneTiles, this);
          } else {
            setTimeout(bind(this._pruneTiles, this), 250);
          }
        }
      },
      _getTilePos: function(coords) {
        return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(coords) {
        var newCoords = new Point(
          this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
          this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y
        );
        newCoords.z = coords.z;
        return newCoords;
      },
      _pxBoundsToTileRange: function(bounds) {
        var tileSize = this.getTileSize();
        return new Bounds(
          bounds.min.unscaleBy(tileSize).floor(),
          bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1])
        );
      },
      _noTilesToLoad: function() {
        for (var key in this._tiles) {
          if (!this._tiles[key].loaded) {
            return false;
          }
        }
        return true;
      }
    });
    function gridLayer(options) {
      return new GridLayer(options);
    }
    var TileLayer2 = GridLayer.extend({
      // @section
      // @aka TileLayer options
      options: {
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = 18
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: 18,
        // @option subdomains: String|String[] = 'abc'
        // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
        subdomains: "abc",
        // @option errorTileUrl: String = ''
        // URL to the tile image to show in place of the tile that failed to load.
        errorTileUrl: "",
        // @option zoomOffset: Number = 0
        // The zoom number used in tile URLs will be offset with this value.
        zoomOffset: 0,
        // @option tms: Boolean = false
        // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
        tms: false,
        // @option zoomReverse: Boolean = false
        // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
        zoomReverse: false,
        // @option detectRetina: Boolean = false
        // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
        detectRetina: false,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: false,
        // @option referrerPolicy: Boolean|String = false
        // Whether the referrerPolicy attribute will be added to the tiles.
        // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
        // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
        // (e.g. to validate an API token).
        // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
        referrerPolicy: false
      },
      initialize: function(url, options) {
        this._url = url;
        options = setOptions(this, options);
        if (options.detectRetina && Browser.retina && options.maxZoom > 0) {
          options.tileSize = Math.floor(options.tileSize / 2);
          if (!options.zoomReverse) {
            options.zoomOffset++;
            options.maxZoom = Math.max(options.minZoom, options.maxZoom - 1);
          } else {
            options.zoomOffset--;
            options.minZoom = Math.min(options.maxZoom, options.minZoom + 1);
          }
          options.minZoom = Math.max(0, options.minZoom);
        } else if (!options.zoomReverse) {
          options.maxZoom = Math.max(options.minZoom, options.maxZoom);
        } else {
          options.minZoom = Math.min(options.maxZoom, options.minZoom);
        }
        if (typeof options.subdomains === "string") {
          options.subdomains = options.subdomains.split("");
        }
        this.on("tileunload", this._onTileRemove);
      },
      // @method setUrl(url: String, noRedraw?: Boolean): this
      // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
      // If the URL does not change, the layer will not be redrawn unless
      // the noRedraw parameter is set to false.
      setUrl: function(url, noRedraw) {
        if (this._url === url && noRedraw === void 0) {
          noRedraw = true;
        }
        this._url = url;
        if (!noRedraw) {
          this.redraw();
        }
        return this;
      },
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
      // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
      // callback is called when the tile has been loaded.
      createTile: function(coords, done) {
        var tile = document.createElement("img");
        on(tile, "load", bind(this._tileOnLoad, this, done, tile));
        on(tile, "error", bind(this._tileOnError, this, done, tile));
        if (this.options.crossOrigin || this.options.crossOrigin === "") {
          tile.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
        }
        if (typeof this.options.referrerPolicy === "string") {
          tile.referrerPolicy = this.options.referrerPolicy;
        }
        tile.alt = "";
        tile.src = this.getTileUrl(coords);
        return tile;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(coords) {
        var data = {
          r: Browser.retina ? "@2x" : "",
          s: this._getSubdomain(coords),
          x: coords.x,
          y: coords.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var invertedY = this._globalTileRange.max.y - coords.y;
          if (this.options.tms) {
            data["y"] = invertedY;
          }
          data["-y"] = invertedY;
        }
        return template(this._url, extend(data, this.options));
      },
      _tileOnLoad: function(done, tile) {
        if (Browser.ielt9) {
          setTimeout(bind(done, this, null, tile), 0);
        } else {
          done(null, tile);
        }
      },
      _tileOnError: function(done, tile, e) {
        var errorUrl = this.options.errorTileUrl;
        if (errorUrl && tile.getAttribute("src") !== errorUrl) {
          tile.src = errorUrl;
        }
        done(e, tile);
      },
      _onTileRemove: function(e) {
        e.tile.onload = null;
      },
      _getZoomForUrl: function() {
        var zoom2 = this._tileZoom, maxZoom = this.options.maxZoom, zoomReverse = this.options.zoomReverse, zoomOffset = this.options.zoomOffset;
        if (zoomReverse) {
          zoom2 = maxZoom - zoom2;
        }
        return zoom2 + zoomOffset;
      },
      _getSubdomain: function(tilePoint) {
        var index2 = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
        return this.options.subdomains[index2];
      },
      // stops loading all tiles in the background layer
      _abortLoading: function() {
        var i, tile;
        for (i in this._tiles) {
          if (this._tiles[i].coords.z !== this._tileZoom) {
            tile = this._tiles[i].el;
            tile.onload = falseFn;
            tile.onerror = falseFn;
            if (!tile.complete) {
              tile.src = emptyImageUrl;
              var coords = this._tiles[i].coords;
              remove(tile);
              delete this._tiles[i];
              this.fire("tileabort", {
                tile,
                coords
              });
            }
          }
        }
      },
      _removeTile: function(key) {
        var tile = this._tiles[key];
        if (!tile) {
          return;
        }
        tile.el.setAttribute("src", emptyImageUrl);
        return GridLayer.prototype._removeTile.call(this, key);
      },
      _tileReady: function(coords, err, tile) {
        if (!this._map || tile && tile.getAttribute("src") === emptyImageUrl) {
          return;
        }
        return GridLayer.prototype._tileReady.call(this, coords, err, tile);
      }
    });
    function tileLayer(url, options) {
      return new TileLayer2(url, options);
    }
    var TileLayerWMS = TileLayer2.extend({
      // @section
      // @aka TileLayer.WMS options
      // If any custom options not documented here are used, they will be sent to the
      // WMS server as extra parameters in each request URL. This can be useful for
      // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
      defaultWmsParams: {
        service: "WMS",
        request: "GetMap",
        // @option layers: String = ''
        // **(required)** Comma-separated list of WMS layers to show.
        layers: "",
        // @option styles: String = ''
        // Comma-separated list of WMS styles.
        styles: "",
        // @option format: String = 'image/jpeg'
        // WMS image format (use `'image/png'` for layers with transparency).
        format: "image/jpeg",
        // @option transparent: Boolean = false
        // If `true`, the WMS service will return images with transparency.
        transparent: false,
        // @option version: String = '1.1.1'
        // Version of the WMS service to use
        version: "1.1.1"
      },
      options: {
        // @option crs: CRS = null
        // Coordinate Reference System to use for the WMS requests, defaults to
        // map CRS. Don't change this if you're not sure what it means.
        crs: null,
        // @option uppercase: Boolean = false
        // If `true`, WMS request parameter keys will be uppercase.
        uppercase: false
      },
      initialize: function(url, options) {
        this._url = url;
        var wmsParams = extend({}, this.defaultWmsParams);
        for (var i in options) {
          if (!(i in this.options)) {
            wmsParams[i] = options[i];
          }
        }
        options = setOptions(this, options);
        var realRetina = options.detectRetina && Browser.retina ? 2 : 1;
        var tileSize = this.getTileSize();
        wmsParams.width = tileSize.x * realRetina;
        wmsParams.height = tileSize.y * realRetina;
        this.wmsParams = wmsParams;
      },
      onAdd: function(map) {
        this._crs = this.options.crs || map.options.crs;
        this._wmsVersion = parseFloat(this.wmsParams.version);
        var projectionKey = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[projectionKey] = this._crs.code;
        TileLayer2.prototype.onAdd.call(this, map);
      },
      getTileUrl: function(coords) {
        var tileBounds = this._tileCoordsToNwSe(coords), crs = this._crs, bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])), min = bounds.min, max = bounds.max, bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ? [min.y, min.x, max.y, max.x] : [min.x, min.y, max.x, max.y]).join(","), url = TileLayer2.prototype.getTileUrl.call(this, coords);
        return url + getParamString(this.wmsParams, url, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + bbox;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(params, noRedraw) {
        extend(this.wmsParams, params);
        if (!noRedraw) {
          this.redraw();
        }
        return this;
      }
    });
    function tileLayerWMS(url, options) {
      return new TileLayerWMS(url, options);
    }
    TileLayer2.WMS = TileLayerWMS;
    tileLayer.wms = tileLayerWMS;
    var Renderer = Layer.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(options) {
        setOptions(this, options);
        stamp(this);
        this._layers = this._layers || {};
      },
      onAdd: function() {
        if (!this._container) {
          this._initContainer();
          addClass(this._container, "leaflet-zoom-animated");
        }
        this.getPane().appendChild(this._container);
        this._update();
        this.on("update", this._updatePaths, this);
      },
      onRemove: function() {
        this.off("update", this._updatePaths, this);
        this._destroyContainer();
      },
      getEvents: function() {
        var events = {
          viewreset: this._reset,
          zoom: this._onZoom,
          moveend: this._update,
          zoomend: this._onZoomEnd
        };
        if (this._zoomAnimated) {
          events.zoomanim = this._onAnimZoom;
        }
        return events;
      },
      _onAnimZoom: function(ev) {
        this._updateTransform(ev.center, ev.zoom);
      },
      _onZoom: function() {
        this._updateTransform(this._map.getCenter(), this._map.getZoom());
      },
      _updateTransform: function(center, zoom2) {
        var scale3 = this._map.getZoomScale(zoom2, this._zoom), viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding), currentCenterPoint = this._map.project(this._center, zoom2), topLeftOffset = viewHalf.multiplyBy(-scale3).add(currentCenterPoint).subtract(this._map._getNewPixelOrigin(center, zoom2));
        if (Browser.any3d) {
          setTransform(this._container, topLeftOffset, scale3);
        } else {
          setPosition(this._container, topLeftOffset);
        }
      },
      _reset: function() {
        this._update();
        this._updateTransform(this._center, this._zoom);
        for (var id2 in this._layers) {
          this._layers[id2]._reset();
        }
      },
      _onZoomEnd: function() {
        for (var id2 in this._layers) {
          this._layers[id2]._project();
        }
      },
      _updatePaths: function() {
        for (var id2 in this._layers) {
          this._layers[id2]._update();
        }
      },
      _update: function() {
        var p = this.options.padding, size = this._map.getSize(), min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
        this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
        this._center = this._map.getCenter();
        this._zoom = this._map.getZoom();
      }
    });
    var Canvas = Renderer.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var events = Renderer.prototype.getEvents.call(this);
        events.viewprereset = this._onViewPreReset;
        return events;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = true;
      },
      onAdd: function() {
        Renderer.prototype.onAdd.call(this);
        this._draw();
      },
      _initContainer: function() {
        var container = this._container = document.createElement("canvas");
        on(container, "mousemove", this._onMouseMove, this);
        on(container, "click dblclick mousedown mouseup contextmenu", this._onClick, this);
        on(container, "mouseout", this._handleMouseOut, this);
        container["_leaflet_disable_events"] = true;
        this._ctx = container.getContext("2d");
      },
      _destroyContainer: function() {
        cancelAnimFrame(this._redrawRequest);
        delete this._ctx;
        remove(this._container);
        off(this._container);
        delete this._container;
      },
      _updatePaths: function() {
        if (this._postponeUpdatePaths) {
          return;
        }
        var layer;
        this._redrawBounds = null;
        for (var id2 in this._layers) {
          layer = this._layers[id2];
          layer._update();
        }
        this._redraw();
      },
      _update: function() {
        if (this._map._animatingZoom && this._bounds) {
          return;
        }
        Renderer.prototype._update.call(this);
        var b = this._bounds, container = this._container, size = b.getSize(), m = Browser.retina ? 2 : 1;
        setPosition(container, b.min);
        container.width = m * size.x;
        container.height = m * size.y;
        container.style.width = size.x + "px";
        container.style.height = size.y + "px";
        if (Browser.retina) {
          this._ctx.scale(2, 2);
        }
        this._ctx.translate(-b.min.x, -b.min.y);
        this.fire("update");
      },
      _reset: function() {
        Renderer.prototype._reset.call(this);
        if (this._postponeUpdatePaths) {
          this._postponeUpdatePaths = false;
          this._updatePaths();
        }
      },
      _initPath: function(layer) {
        this._updateDashArray(layer);
        this._layers[stamp(layer)] = layer;
        var order = layer._order = {
          layer,
          prev: this._drawLast,
          next: null
        };
        if (this._drawLast) {
          this._drawLast.next = order;
        }
        this._drawLast = order;
        this._drawFirst = this._drawFirst || this._drawLast;
      },
      _addPath: function(layer) {
        this._requestRedraw(layer);
      },
      _removePath: function(layer) {
        var order = layer._order;
        var next = order.next;
        var prev = order.prev;
        if (next) {
          next.prev = prev;
        } else {
          this._drawLast = prev;
        }
        if (prev) {
          prev.next = next;
        } else {
          this._drawFirst = next;
        }
        delete layer._order;
        delete this._layers[stamp(layer)];
        this._requestRedraw(layer);
      },
      _updatePath: function(layer) {
        this._extendRedrawBounds(layer);
        layer._project();
        layer._update();
        this._requestRedraw(layer);
      },
      _updateStyle: function(layer) {
        this._updateDashArray(layer);
        this._requestRedraw(layer);
      },
      _updateDashArray: function(layer) {
        if (typeof layer.options.dashArray === "string") {
          var parts = layer.options.dashArray.split(/[, ]+/), dashArray = [], dashValue, i;
          for (i = 0; i < parts.length; i++) {
            dashValue = Number(parts[i]);
            if (isNaN(dashValue)) {
              return;
            }
            dashArray.push(dashValue);
          }
          layer.options._dashArray = dashArray;
        } else {
          layer.options._dashArray = layer.options.dashArray;
        }
      },
      _requestRedraw: function(layer) {
        if (!this._map) {
          return;
        }
        this._extendRedrawBounds(layer);
        this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
      },
      _extendRedrawBounds: function(layer) {
        if (layer._pxBounds) {
          var padding = (layer.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new Bounds();
          this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
          this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
        }
      },
      _redraw: function() {
        this._redrawRequest = null;
        if (this._redrawBounds) {
          this._redrawBounds.min._floor();
          this._redrawBounds.max._ceil();
        }
        this._clear();
        this._draw();
        this._redrawBounds = null;
      },
      _clear: function() {
        var bounds = this._redrawBounds;
        if (bounds) {
          var size = bounds.getSize();
          this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
        } else {
          this._ctx.save();
          this._ctx.setTransform(1, 0, 0, 1, 0, 0);
          this._ctx.clearRect(0, 0, this._container.width, this._container.height);
          this._ctx.restore();
        }
      },
      _draw: function() {
        var layer, bounds = this._redrawBounds;
        this._ctx.save();
        if (bounds) {
          var size = bounds.getSize();
          this._ctx.beginPath();
          this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
          this._ctx.clip();
        }
        this._drawing = true;
        for (var order = this._drawFirst; order; order = order.next) {
          layer = order.layer;
          if (!bounds || layer._pxBounds && layer._pxBounds.intersects(bounds)) {
            layer._updatePath();
          }
        }
        this._drawing = false;
        this._ctx.restore();
      },
      _updatePoly: function(layer, closed) {
        if (!this._drawing) {
          return;
        }
        var i, j, len2, p, parts = layer._parts, len = parts.length, ctx = this._ctx;
        if (!len) {
          return;
        }
        ctx.beginPath();
        for (i = 0; i < len; i++) {
          for (j = 0, len2 = parts[i].length; j < len2; j++) {
            p = parts[i][j];
            ctx[j ? "lineTo" : "moveTo"](p.x, p.y);
          }
          if (closed) {
            ctx.closePath();
          }
        }
        this._fillStroke(ctx, layer);
      },
      _updateCircle: function(layer) {
        if (!this._drawing || layer._empty()) {
          return;
        }
        var p = layer._point, ctx = this._ctx, r = Math.max(Math.round(layer._radius), 1), s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;
        if (s !== 1) {
          ctx.save();
          ctx.scale(1, s);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
        if (s !== 1) {
          ctx.restore();
        }
        this._fillStroke(ctx, layer);
      },
      _fillStroke: function(ctx, layer) {
        var options = layer.options;
        if (options.fill) {
          ctx.globalAlpha = options.fillOpacity;
          ctx.fillStyle = options.fillColor || options.color;
          ctx.fill(options.fillRule || "evenodd");
        }
        if (options.stroke && options.weight !== 0) {
          if (ctx.setLineDash) {
            ctx.setLineDash(layer.options && layer.options._dashArray || []);
          }
          ctx.globalAlpha = options.opacity;
          ctx.lineWidth = options.weight;
          ctx.strokeStyle = options.color;
          ctx.lineCap = options.lineCap;
          ctx.lineJoin = options.lineJoin;
          ctx.stroke();
        }
      },
      // Canvas obviously doesn't have mouse events for individual drawn objects,
      // so we emulate that by calculating what's under the mouse on mousemove/click manually
      _onClick: function(e) {
        var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;
        for (var order = this._drawFirst; order; order = order.next) {
          layer = order.layer;
          if (layer.options.interactive && layer._containsPoint(point)) {
            if (!(e.type === "click" || e.type === "preclick") || !this._map._draggableMoved(layer)) {
              clickedLayer = layer;
            }
          }
        }
        this._fireEvent(clickedLayer ? [clickedLayer] : false, e);
      },
      _onMouseMove: function(e) {
        if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
          return;
        }
        var point = this._map.mouseEventToLayerPoint(e);
        this._handleMouseHover(e, point);
      },
      _handleMouseOut: function(e) {
        var layer = this._hoveredLayer;
        if (layer) {
          removeClass(this._container, "leaflet-interactive");
          this._fireEvent([layer], e, "mouseout");
          this._hoveredLayer = null;
          this._mouseHoverThrottled = false;
        }
      },
      _handleMouseHover: function(e, point) {
        if (this._mouseHoverThrottled) {
          return;
        }
        var layer, candidateHoveredLayer;
        for (var order = this._drawFirst; order; order = order.next) {
          layer = order.layer;
          if (layer.options.interactive && layer._containsPoint(point)) {
            candidateHoveredLayer = layer;
          }
        }
        if (candidateHoveredLayer !== this._hoveredLayer) {
          this._handleMouseOut(e);
          if (candidateHoveredLayer) {
            addClass(this._container, "leaflet-interactive");
            this._fireEvent([candidateHoveredLayer], e, "mouseover");
            this._hoveredLayer = candidateHoveredLayer;
          }
        }
        this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : false, e);
        this._mouseHoverThrottled = true;
        setTimeout(bind(function() {
          this._mouseHoverThrottled = false;
        }, this), 32);
      },
      _fireEvent: function(layers2, e, type) {
        this._map._fireDOMEvent(e, type || e.type, layers2);
      },
      _bringToFront: function(layer) {
        var order = layer._order;
        if (!order) {
          return;
        }
        var next = order.next;
        var prev = order.prev;
        if (next) {
          next.prev = prev;
        } else {
          return;
        }
        if (prev) {
          prev.next = next;
        } else if (next) {
          this._drawFirst = next;
        }
        order.prev = this._drawLast;
        this._drawLast.next = order;
        order.next = null;
        this._drawLast = order;
        this._requestRedraw(layer);
      },
      _bringToBack: function(layer) {
        var order = layer._order;
        if (!order) {
          return;
        }
        var next = order.next;
        var prev = order.prev;
        if (prev) {
          prev.next = next;
        } else {
          return;
        }
        if (next) {
          next.prev = prev;
        } else if (prev) {
          this._drawLast = prev;
        }
        order.prev = null;
        order.next = this._drawFirst;
        this._drawFirst.prev = order;
        this._drawFirst = order;
        this._requestRedraw(layer);
      }
    });
    function canvas(options) {
      return Browser.canvas ? new Canvas(options) : null;
    }
    var vmlCreate = function() {
      try {
        document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml");
        return function(name) {
          return document.createElement("<lvml:" + name + ' class="lvml">');
        };
      } catch (e) {
      }
      return function(name) {
        return document.createElement("<" + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }();
    var vmlMixin = {
      _initContainer: function() {
        this._container = create$1("div", "leaflet-vml-container");
      },
      _update: function() {
        if (this._map._animatingZoom) {
          return;
        }
        Renderer.prototype._update.call(this);
        this.fire("update");
      },
      _initPath: function(layer) {
        var container = layer._container = vmlCreate("shape");
        addClass(container, "leaflet-vml-shape " + (this.options.className || ""));
        container.coordsize = "1 1";
        layer._path = vmlCreate("path");
        container.appendChild(layer._path);
        this._updateStyle(layer);
        this._layers[stamp(layer)] = layer;
      },
      _addPath: function(layer) {
        var container = layer._container;
        this._container.appendChild(container);
        if (layer.options.interactive) {
          layer.addInteractiveTarget(container);
        }
      },
      _removePath: function(layer) {
        var container = layer._container;
        remove(container);
        layer.removeInteractiveTarget(container);
        delete this._layers[stamp(layer)];
      },
      _updateStyle: function(layer) {
        var stroke = layer._stroke, fill = layer._fill, options = layer.options, container = layer._container;
        container.stroked = !!options.stroke;
        container.filled = !!options.fill;
        if (options.stroke) {
          if (!stroke) {
            stroke = layer._stroke = vmlCreate("stroke");
          }
          container.appendChild(stroke);
          stroke.weight = options.weight + "px";
          stroke.color = options.color;
          stroke.opacity = options.opacity;
          if (options.dashArray) {
            stroke.dashStyle = isArray(options.dashArray) ? options.dashArray.join(" ") : options.dashArray.replace(/( *, *)/g, " ");
          } else {
            stroke.dashStyle = "";
          }
          stroke.endcap = options.lineCap.replace("butt", "flat");
          stroke.joinstyle = options.lineJoin;
        } else if (stroke) {
          container.removeChild(stroke);
          layer._stroke = null;
        }
        if (options.fill) {
          if (!fill) {
            fill = layer._fill = vmlCreate("fill");
          }
          container.appendChild(fill);
          fill.color = options.fillColor || options.color;
          fill.opacity = options.fillOpacity;
        } else if (fill) {
          container.removeChild(fill);
          layer._fill = null;
        }
      },
      _updateCircle: function(layer) {
        var p = layer._point.round(), r = Math.round(layer._radius), r2 = Math.round(layer._radiusY || r);
        this._setPath(layer, layer._empty() ? "M0 0" : "AL " + p.x + "," + p.y + " " + r + "," + r2 + " 0," + 65535 * 360);
      },
      _setPath: function(layer, path) {
        layer._path.v = path;
      },
      _bringToFront: function(layer) {
        toFront(layer._container);
      },
      _bringToBack: function(layer) {
        toBack(layer._container);
      }
    };
    var create = Browser.vml ? vmlCreate : svgCreate;
    var SVG = Renderer.extend({
      _initContainer: function() {
        this._container = create("svg");
        this._container.setAttribute("pointer-events", "none");
        this._rootGroup = create("g");
        this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        remove(this._container);
        off(this._container);
        delete this._container;
        delete this._rootGroup;
        delete this._svgSize;
      },
      _update: function() {
        if (this._map._animatingZoom && this._bounds) {
          return;
        }
        Renderer.prototype._update.call(this);
        var b = this._bounds, size = b.getSize(), container = this._container;
        if (!this._svgSize || !this._svgSize.equals(size)) {
          this._svgSize = size;
          container.setAttribute("width", size.x);
          container.setAttribute("height", size.y);
        }
        setPosition(container, b.min);
        container.setAttribute("viewBox", [b.min.x, b.min.y, size.x, size.y].join(" "));
        this.fire("update");
      },
      // methods below are called by vector layers implementations
      _initPath: function(layer) {
        var path = layer._path = create("path");
        if (layer.options.className) {
          addClass(path, layer.options.className);
        }
        if (layer.options.interactive) {
          addClass(path, "leaflet-interactive");
        }
        this._updateStyle(layer);
        this._layers[stamp(layer)] = layer;
      },
      _addPath: function(layer) {
        if (!this._rootGroup) {
          this._initContainer();
        }
        this._rootGroup.appendChild(layer._path);
        layer.addInteractiveTarget(layer._path);
      },
      _removePath: function(layer) {
        remove(layer._path);
        layer.removeInteractiveTarget(layer._path);
        delete this._layers[stamp(layer)];
      },
      _updatePath: function(layer) {
        layer._project();
        layer._update();
      },
      _updateStyle: function(layer) {
        var path = layer._path, options = layer.options;
        if (!path) {
          return;
        }
        if (options.stroke) {
          path.setAttribute("stroke", options.color);
          path.setAttribute("stroke-opacity", options.opacity);
          path.setAttribute("stroke-width", options.weight);
          path.setAttribute("stroke-linecap", options.lineCap);
          path.setAttribute("stroke-linejoin", options.lineJoin);
          if (options.dashArray) {
            path.setAttribute("stroke-dasharray", options.dashArray);
          } else {
            path.removeAttribute("stroke-dasharray");
          }
          if (options.dashOffset) {
            path.setAttribute("stroke-dashoffset", options.dashOffset);
          } else {
            path.removeAttribute("stroke-dashoffset");
          }
        } else {
          path.setAttribute("stroke", "none");
        }
        if (options.fill) {
          path.setAttribute("fill", options.fillColor || options.color);
          path.setAttribute("fill-opacity", options.fillOpacity);
          path.setAttribute("fill-rule", options.fillRule || "evenodd");
        } else {
          path.setAttribute("fill", "none");
        }
      },
      _updatePoly: function(layer, closed) {
        this._setPath(layer, pointsToPath(layer._parts, closed));
      },
      _updateCircle: function(layer) {
        var p = layer._point, r = Math.max(Math.round(layer._radius), 1), r2 = Math.max(Math.round(layer._radiusY), 1) || r, arc = "a" + r + "," + r2 + " 0 1,0 ";
        var d = layer._empty() ? "M0 0" : "M" + (p.x - r) + "," + p.y + arc + r * 2 + ",0 " + arc + -r * 2 + ",0 ";
        this._setPath(layer, d);
      },
      _setPath: function(layer, path) {
        layer._path.setAttribute("d", path);
      },
      // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
      _bringToFront: function(layer) {
        toFront(layer._path);
      },
      _bringToBack: function(layer) {
        toBack(layer._path);
      }
    });
    if (Browser.vml) {
      SVG.include(vmlMixin);
    }
    function svg(options) {
      return Browser.svg || Browser.vml ? new SVG(options) : null;
    }
    Map2.include({
      // @namespace Map; @method getRenderer(layer: Path): Renderer
      // Returns the instance of `Renderer` that should be used to render the given
      // `Path`. It will ensure that the `renderer` options of the map and paths
      // are respected, and that the renderers do exist on the map.
      getRenderer: function(layer) {
        var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;
        if (!renderer) {
          renderer = this._renderer = this._createRenderer();
        }
        if (!this.hasLayer(renderer)) {
          this.addLayer(renderer);
        }
        return renderer;
      },
      _getPaneRenderer: function(name) {
        if (name === "overlayPane" || name === void 0) {
          return false;
        }
        var renderer = this._paneRenderers[name];
        if (renderer === void 0) {
          renderer = this._createRenderer({ pane: name });
          this._paneRenderers[name] = renderer;
        }
        return renderer;
      },
      _createRenderer: function(options) {
        return this.options.preferCanvas && canvas(options) || svg(options);
      }
    });
    var Rectangle = Polygon2.extend({
      initialize: function(latLngBounds, options) {
        Polygon2.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(latLngBounds) {
        return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
      },
      _boundsToLatLngs: function(latLngBounds) {
        latLngBounds = toLatLngBounds(latLngBounds);
        return [
          latLngBounds.getSouthWest(),
          latLngBounds.getNorthWest(),
          latLngBounds.getNorthEast(),
          latLngBounds.getSouthEast()
        ];
      }
    });
    function rectangle(latLngBounds, options) {
      return new Rectangle(latLngBounds, options);
    }
    SVG.create = create;
    SVG.pointsToPath = pointsToPath;
    GeoJSON.geometryToLayer = geometryToLayer;
    GeoJSON.coordsToLatLng = coordsToLatLng;
    GeoJSON.coordsToLatLngs = coordsToLatLngs;
    GeoJSON.latLngToCoords = latLngToCoords;
    GeoJSON.latLngsToCoords = latLngsToCoords;
    GeoJSON.getFeature = getFeature;
    GeoJSON.asFeature = asFeature;
    Map2.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: true
    });
    var BoxZoom = Handler.extend({
      initialize: function(map) {
        this._map = map;
        this._container = map._container;
        this._pane = map._panes.overlayPane;
        this._resetStateTimeout = 0;
        map.on("unload", this._destroy, this);
      },
      addHooks: function() {
        on(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        off(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        remove(this._pane);
        delete this._pane;
      },
      _resetState: function() {
        this._resetStateTimeout = 0;
        this._moved = false;
      },
      _clearDeferredResetState: function() {
        if (this._resetStateTimeout !== 0) {
          clearTimeout(this._resetStateTimeout);
          this._resetStateTimeout = 0;
        }
      },
      _onMouseDown: function(e) {
        if (!e.shiftKey || e.which !== 1 && e.button !== 1) {
          return false;
        }
        this._clearDeferredResetState();
        this._resetState();
        disableTextSelection();
        disableImageDrag();
        this._startPoint = this._map.mouseEventToContainerPoint(e);
        on(document, {
          contextmenu: stop,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(e) {
        if (!this._moved) {
          this._moved = true;
          this._box = create$1("div", "leaflet-zoom-box", this._container);
          addClass(this._container, "leaflet-crosshair");
          this._map.fire("boxzoomstart");
        }
        this._point = this._map.mouseEventToContainerPoint(e);
        var bounds = new Bounds(this._point, this._startPoint), size = bounds.getSize();
        setPosition(this._box, bounds.min);
        this._box.style.width = size.x + "px";
        this._box.style.height = size.y + "px";
      },
      _finish: function() {
        if (this._moved) {
          remove(this._box);
          removeClass(this._container, "leaflet-crosshair");
        }
        enableTextSelection();
        enableImageDrag();
        off(document, {
          contextmenu: stop,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(e) {
        if (e.which !== 1 && e.button !== 1) {
          return;
        }
        this._finish();
        if (!this._moved) {
          return;
        }
        this._clearDeferredResetState();
        this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);
        var bounds = new LatLngBounds(
          this._map.containerPointToLatLng(this._startPoint),
          this._map.containerPointToLatLng(this._point)
        );
        this._map.fitBounds(bounds).fire("boxzoomend", { boxZoomBounds: bounds });
      },
      _onKeyDown: function(e) {
        if (e.keyCode === 27) {
          this._finish();
          this._clearDeferredResetState();
          this._resetState();
        }
      }
    });
    Map2.addInitHook("addHandler", "boxZoom", BoxZoom);
    Map2.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: true
    });
    var DoubleClickZoom = Handler.extend({
      addHooks: function() {
        this._map.on("dblclick", this._onDoubleClick, this);
      },
      removeHooks: function() {
        this._map.off("dblclick", this._onDoubleClick, this);
      },
      _onDoubleClick: function(e) {
        var map = this._map, oldZoom = map.getZoom(), delta = map.options.zoomDelta, zoom2 = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;
        if (map.options.doubleClickZoom === "center") {
          map.setZoom(zoom2);
        } else {
          map.setZoomAround(e.containerPoint, zoom2);
        }
      }
    });
    Map2.addInitHook("addHandler", "doubleClickZoom", DoubleClickZoom);
    Map2.mergeOptions({
      // @option dragging: Boolean = true
      // Whether the map is draggable with mouse/touch or not.
      dragging: true,
      // @section Panning Inertia Options
      // @option inertia: Boolean = *
      // If enabled, panning of the map will have an inertia effect where
      // the map builds momentum while dragging and continues moving in
      // the same direction for some time. Feels especially nice on touch
      // devices. Enabled by default.
      inertia: true,
      // @option inertiaDeceleration: Number = 3000
      // The rate with which the inertial movement slows down, in pixels/second².
      inertiaDeceleration: 3400,
      // px/s^2
      // @option inertiaMaxSpeed: Number = Infinity
      // Max speed of the inertial movement, in pixels/second.
      inertiaMaxSpeed: Infinity,
      // px/s
      // @option easeLinearity: Number = 0.2
      easeLinearity: 0.2,
      // TODO refactor, move to CRS
      // @option worldCopyJump: Boolean = false
      // With this option enabled, the map tracks when you pan to another "copy"
      // of the world and seamlessly jumps to the original one so that all overlays
      // like markers and vector layers are still visible.
      worldCopyJump: false,
      // @option maxBoundsViscosity: Number = 0.0
      // If `maxBounds` is set, this option will control how solid the bounds
      // are when dragging the map around. The default value of `0.0` allows the
      // user to drag outside the bounds at normal speed, higher values will
      // slow down map dragging outside bounds, and `1.0` makes the bounds fully
      // solid, preventing the user from dragging outside the bounds.
      maxBoundsViscosity: 0
    });
    var Drag = Handler.extend({
      addHooks: function() {
        if (!this._draggable) {
          var map = this._map;
          this._draggable = new Draggable(map._mapPane, map._container);
          this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this);
          this._draggable.on("predrag", this._onPreDragLimit, this);
          if (map.options.worldCopyJump) {
            this._draggable.on("predrag", this._onPreDragWrap, this);
            map.on("zoomend", this._onZoomEnd, this);
            map.whenReady(this._onZoomEnd, this);
          }
        }
        addClass(this._map._container, "leaflet-grab leaflet-touch-drag");
        this._draggable.enable();
        this._positions = [];
        this._times = [];
      },
      removeHooks: function() {
        removeClass(this._map._container, "leaflet-grab");
        removeClass(this._map._container, "leaflet-touch-drag");
        this._draggable.disable();
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      moving: function() {
        return this._draggable && this._draggable._moving;
      },
      _onDragStart: function() {
        var map = this._map;
        map._stop();
        if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
          var bounds = toLatLngBounds(this._map.options.maxBounds);
          this._offsetLimit = toBounds(
            this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
            this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
          );
          this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
        } else {
          this._offsetLimit = null;
        }
        map.fire("movestart").fire("dragstart");
        if (map.options.inertia) {
          this._positions = [];
          this._times = [];
        }
      },
      _onDrag: function(e) {
        if (this._map.options.inertia) {
          var time2 = this._lastTime = +/* @__PURE__ */ new Date(), pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;
          this._positions.push(pos);
          this._times.push(time2);
          this._prunePositions(time2);
        }
        this._map.fire("move", e).fire("drag", e);
      },
      _prunePositions: function(time2) {
        while (this._positions.length > 1 && time2 - this._times[0] > 50) {
          this._positions.shift();
          this._times.shift();
        }
      },
      _onZoomEnd: function() {
        var pxCenter = this._map.getSize().divideBy(2), pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
        this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
        this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
      },
      _viscousLimit: function(value, threshold) {
        return value - (value - threshold) * this._viscosity;
      },
      _onPreDragLimit: function() {
        if (!this._viscosity || !this._offsetLimit) {
          return;
        }
        var offset = this._draggable._newPos.subtract(this._draggable._startPos);
        var limit = this._offsetLimit;
        if (offset.x < limit.min.x) {
          offset.x = this._viscousLimit(offset.x, limit.min.x);
        }
        if (offset.y < limit.min.y) {
          offset.y = this._viscousLimit(offset.y, limit.min.y);
        }
        if (offset.x > limit.max.x) {
          offset.x = this._viscousLimit(offset.x, limit.max.x);
        }
        if (offset.y > limit.max.y) {
          offset.y = this._viscousLimit(offset.y, limit.max.y);
        }
        this._draggable._newPos = this._draggable._startPos.add(offset);
      },
      _onPreDragWrap: function() {
        var worldWidth = this._worldWidth, halfWidth = Math.round(worldWidth / 2), dx = this._initialWorldOffset, x = this._draggable._newPos.x, newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx, newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx, newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
        this._draggable._absPos = this._draggable._newPos.clone();
        this._draggable._newPos.x = newX;
      },
      _onDragEnd: function(e) {
        var map = this._map, options = map.options, noInertia = !options.inertia || e.noInertia || this._times.length < 2;
        map.fire("dragend", e);
        if (noInertia) {
          map.fire("moveend");
        } else {
          this._prunePositions(+/* @__PURE__ */ new Date());
          var direction = this._lastPos.subtract(this._positions[0]), duration = (this._lastTime - this._times[0]) / 1e3, ease2 = options.easeLinearity, speedVector = direction.multiplyBy(ease2 / duration), speed = speedVector.distanceTo([0, 0]), limitedSpeed = Math.min(options.inertiaMaxSpeed, speed), limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed), decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease2), offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
          if (!offset.x && !offset.y) {
            map.fire("moveend");
          } else {
            offset = map._limitOffset(offset, map.options.maxBounds);
            requestAnimFrame(function() {
              map.panBy(offset, {
                duration: decelerationDuration,
                easeLinearity: ease2,
                noMoveStart: true,
                animate: true
              });
            });
          }
        }
      }
    });
    Map2.addInitHook("addHandler", "dragging", Drag);
    Map2.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: true,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var Keyboard = Handler.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173]
      },
      initialize: function(map) {
        this._map = map;
        this._setPanDelta(map.options.keyboardPanDelta);
        this._setZoomDelta(map.options.zoomDelta);
      },
      addHooks: function() {
        var container = this._map._container;
        if (container.tabIndex <= 0) {
          container.tabIndex = "0";
        }
        on(container, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this);
        this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks();
        off(this._map._container, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this);
        this._map.off({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      _onMouseDown: function() {
        if (this._focused) {
          return;
        }
        var body = document.body, docEl = document.documentElement, top = body.scrollTop || docEl.scrollTop, left = body.scrollLeft || docEl.scrollLeft;
        this._map._container.focus();
        window.scrollTo(left, top);
      },
      _onFocus: function() {
        this._focused = true;
        this._map.fire("focus");
      },
      _onBlur: function() {
        this._focused = false;
        this._map.fire("blur");
      },
      _setPanDelta: function(panDelta) {
        var keys = this._panKeys = {}, codes = this.keyCodes, i, len;
        for (i = 0, len = codes.left.length; i < len; i++) {
          keys[codes.left[i]] = [-1 * panDelta, 0];
        }
        for (i = 0, len = codes.right.length; i < len; i++) {
          keys[codes.right[i]] = [panDelta, 0];
        }
        for (i = 0, len = codes.down.length; i < len; i++) {
          keys[codes.down[i]] = [0, panDelta];
        }
        for (i = 0, len = codes.up.length; i < len; i++) {
          keys[codes.up[i]] = [0, -1 * panDelta];
        }
      },
      _setZoomDelta: function(zoomDelta) {
        var keys = this._zoomKeys = {}, codes = this.keyCodes, i, len;
        for (i = 0, len = codes.zoomIn.length; i < len; i++) {
          keys[codes.zoomIn[i]] = zoomDelta;
        }
        for (i = 0, len = codes.zoomOut.length; i < len; i++) {
          keys[codes.zoomOut[i]] = -zoomDelta;
        }
      },
      _addHooks: function() {
        on(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        off(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(e) {
        if (e.altKey || e.ctrlKey || e.metaKey) {
          return;
        }
        var key = e.keyCode, map = this._map, offset;
        if (key in this._panKeys) {
          if (!map._panAnim || !map._panAnim._inProgress) {
            offset = this._panKeys[key];
            if (e.shiftKey) {
              offset = toPoint(offset).multiplyBy(3);
            }
            if (map.options.maxBounds) {
              offset = map._limitOffset(toPoint(offset), map.options.maxBounds);
            }
            if (map.options.worldCopyJump) {
              var newLatLng = map.wrapLatLng(map.unproject(map.project(map.getCenter()).add(offset)));
              map.panTo(newLatLng);
            } else {
              map.panBy(offset);
            }
          }
        } else if (key in this._zoomKeys) {
          map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
        } else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
          map.closePopup();
        } else {
          return;
        }
        stop(e);
      }
    });
    Map2.addInitHook("addHandler", "keyboard", Keyboard);
    Map2.mergeOptions({
      // @section Mouse wheel options
      // @option scrollWheelZoom: Boolean|String = true
      // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
      // it will zoom to the center of the view regardless of where the mouse was.
      scrollWheelZoom: true,
      // @option wheelDebounceTime: Number = 40
      // Limits the rate at which a wheel can fire (in milliseconds). By default
      // user can't zoom via wheel more often than once per 40 ms.
      wheelDebounceTime: 40,
      // @option wheelPxPerZoomLevel: Number = 60
      // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
      // mean a change of one full zoom level. Smaller values will make wheel-zooming
      // faster (and vice versa).
      wheelPxPerZoomLevel: 60
    });
    var ScrollWheelZoom = Handler.extend({
      addHooks: function() {
        on(this._map._container, "wheel", this._onWheelScroll, this);
        this._delta = 0;
      },
      removeHooks: function() {
        off(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(e) {
        var delta = getWheelDelta(e);
        var debounce = this._map.options.wheelDebounceTime;
        this._delta += delta;
        this._lastMousePos = this._map.mouseEventToContainerPoint(e);
        if (!this._startTime) {
          this._startTime = +/* @__PURE__ */ new Date();
        }
        var left = Math.max(debounce - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer);
        this._timer = setTimeout(bind(this._performZoom, this), left);
        stop(e);
      },
      _performZoom: function() {
        var map = this._map, zoom2 = map.getZoom(), snap = this._map.options.zoomSnap || 0;
        map._stop();
        var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2, d4 = snap ? Math.ceil(d3 / snap) * snap : d3, delta = map._limitZoom(zoom2 + (this._delta > 0 ? d4 : -d4)) - zoom2;
        this._delta = 0;
        this._startTime = null;
        if (!delta) {
          return;
        }
        if (map.options.scrollWheelZoom === "center") {
          map.setZoom(zoom2 + delta);
        } else {
          map.setZoomAround(this._lastMousePos, zoom2 + delta);
        }
      }
    });
    Map2.addInitHook("addHandler", "scrollWheelZoom", ScrollWheelZoom);
    var tapHoldDelay = 600;
    Map2.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: Browser.touchNative && Browser.safari && Browser.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var TapHold = Handler.extend({
      addHooks: function() {
        on(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        off(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(e) {
        clearTimeout(this._holdTimeout);
        if (e.touches.length !== 1) {
          return;
        }
        var first = e.touches[0];
        this._startPos = this._newPos = new Point(first.clientX, first.clientY);
        this._holdTimeout = setTimeout(bind(function() {
          this._cancel();
          if (!this._isTapValid()) {
            return;
          }
          on(document, "touchend", preventDefault);
          on(document, "touchend touchcancel", this._cancelClickPrevent);
          this._simulateEvent("contextmenu", first);
        }, this), tapHoldDelay);
        on(document, "touchend touchcancel contextmenu", this._cancel, this);
        on(document, "touchmove", this._onMove, this);
      },
      _cancelClickPrevent: function cancelClickPrevent() {
        off(document, "touchend", preventDefault);
        off(document, "touchend touchcancel", cancelClickPrevent);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout);
        off(document, "touchend touchcancel contextmenu", this._cancel, this);
        off(document, "touchmove", this._onMove, this);
      },
      _onMove: function(e) {
        var first = e.touches[0];
        this._newPos = new Point(first.clientX, first.clientY);
      },
      _isTapValid: function() {
        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
      },
      _simulateEvent: function(type, e) {
        var simulatedEvent = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          // detail: 1,
          screenX: e.screenX,
          screenY: e.screenY,
          clientX: e.clientX,
          clientY: e.clientY
          // button: 2,
          // buttons: 2
        });
        simulatedEvent._simulated = true;
        e.target.dispatchEvent(simulatedEvent);
      }
    });
    Map2.addInitHook("addHandler", "tapHold", TapHold);
    Map2.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: Browser.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: true
    });
    var TouchZoom = Handler.extend({
      addHooks: function() {
        addClass(this._map._container, "leaflet-touch-zoom");
        on(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        removeClass(this._map._container, "leaflet-touch-zoom");
        off(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(e) {
        var map = this._map;
        if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) {
          return;
        }
        var p1 = map.mouseEventToContainerPoint(e.touches[0]), p2 = map.mouseEventToContainerPoint(e.touches[1]);
        this._centerPoint = map.getSize()._divideBy(2);
        this._startLatLng = map.containerPointToLatLng(this._centerPoint);
        if (map.options.touchZoom !== "center") {
          this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
        }
        this._startDist = p1.distanceTo(p2);
        this._startZoom = map.getZoom();
        this._moved = false;
        this._zooming = true;
        map._stop();
        on(document, "touchmove", this._onTouchMove, this);
        on(document, "touchend touchcancel", this._onTouchEnd, this);
        preventDefault(e);
      },
      _onTouchMove: function(e) {
        if (!e.touches || e.touches.length !== 2 || !this._zooming) {
          return;
        }
        var map = this._map, p1 = map.mouseEventToContainerPoint(e.touches[0]), p2 = map.mouseEventToContainerPoint(e.touches[1]), scale3 = p1.distanceTo(p2) / this._startDist;
        this._zoom = map.getScaleZoom(scale3, this._startZoom);
        if (!map.options.bounceAtZoomLimits && (this._zoom < map.getMinZoom() && scale3 < 1 || this._zoom > map.getMaxZoom() && scale3 > 1)) {
          this._zoom = map._limitZoom(this._zoom);
        }
        if (map.options.touchZoom === "center") {
          this._center = this._startLatLng;
          if (scale3 === 1) {
            return;
          }
        } else {
          var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
          if (scale3 === 1 && delta.x === 0 && delta.y === 0) {
            return;
          }
          this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
        }
        if (!this._moved) {
          map._moveStart(true, false);
          this._moved = true;
        }
        cancelAnimFrame(this._animRequest);
        var moveFn = bind(map._move, map, this._center, this._zoom, { pinch: true, round: false }, void 0);
        this._animRequest = requestAnimFrame(moveFn, this, true);
        preventDefault(e);
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = false;
          return;
        }
        this._zooming = false;
        cancelAnimFrame(this._animRequest);
        off(document, "touchmove", this._onTouchMove, this);
        off(document, "touchend touchcancel", this._onTouchEnd, this);
        if (this._map.options.zoomAnimation) {
          this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
        } else {
          this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      }
    });
    Map2.addInitHook("addHandler", "touchZoom", TouchZoom);
    Map2.BoxZoom = BoxZoom;
    Map2.DoubleClickZoom = DoubleClickZoom;
    Map2.Drag = Drag;
    Map2.Keyboard = Keyboard;
    Map2.ScrollWheelZoom = ScrollWheelZoom;
    Map2.TapHold = TapHold;
    Map2.TouchZoom = TouchZoom;
    exports$12.Bounds = Bounds;
    exports$12.Browser = Browser;
    exports$12.CRS = CRS;
    exports$12.Canvas = Canvas;
    exports$12.Circle = Circle2;
    exports$12.CircleMarker = CircleMarker;
    exports$12.Class = Class;
    exports$12.Control = Control;
    exports$12.DivIcon = DivIcon;
    exports$12.DivOverlay = DivOverlay;
    exports$12.DomEvent = DomEvent;
    exports$12.DomUtil = DomUtil;
    exports$12.Draggable = Draggable;
    exports$12.Evented = Evented;
    exports$12.FeatureGroup = FeatureGroup;
    exports$12.GeoJSON = GeoJSON;
    exports$12.GridLayer = GridLayer;
    exports$12.Handler = Handler;
    exports$12.Icon = Icon;
    exports$12.ImageOverlay = ImageOverlay;
    exports$12.LatLng = LatLng;
    exports$12.LatLngBounds = LatLngBounds;
    exports$12.Layer = Layer;
    exports$12.LayerGroup = LayerGroup;
    exports$12.LineUtil = LineUtil;
    exports$12.Map = Map2;
    exports$12.Marker = Marker2;
    exports$12.Mixin = Mixin;
    exports$12.Path = Path;
    exports$12.Point = Point;
    exports$12.PolyUtil = PolyUtil;
    exports$12.Polygon = Polygon2;
    exports$12.Polyline = Polyline2;
    exports$12.Popup = Popup2;
    exports$12.PosAnimation = PosAnimation;
    exports$12.Projection = index;
    exports$12.Rectangle = Rectangle;
    exports$12.Renderer = Renderer;
    exports$12.SVG = SVG;
    exports$12.SVGOverlay = SVGOverlay;
    exports$12.TileLayer = TileLayer2;
    exports$12.Tooltip = Tooltip;
    exports$12.Transformation = Transformation;
    exports$12.Util = Util;
    exports$12.VideoOverlay = VideoOverlay;
    exports$12.bind = bind;
    exports$12.bounds = toBounds;
    exports$12.canvas = canvas;
    exports$12.circle = circle;
    exports$12.circleMarker = circleMarker;
    exports$12.control = control;
    exports$12.divIcon = divIcon;
    exports$12.extend = extend;
    exports$12.featureGroup = featureGroup;
    exports$12.geoJSON = geoJSON;
    exports$12.geoJson = geoJson;
    exports$12.gridLayer = gridLayer;
    exports$12.icon = icon;
    exports$12.imageOverlay = imageOverlay;
    exports$12.latLng = toLatLng;
    exports$12.latLngBounds = toLatLngBounds;
    exports$12.layerGroup = layerGroup;
    exports$12.map = createMap;
    exports$12.marker = marker;
    exports$12.point = toPoint;
    exports$12.polygon = polygon;
    exports$12.polyline = polyline;
    exports$12.popup = popup;
    exports$12.rectangle = rectangle;
    exports$12.setOptions = setOptions;
    exports$12.stamp = stamp;
    exports$12.svg = svg;
    exports$12.svgOverlay = svgOverlay;
    exports$12.tileLayer = tileLayer;
    exports$12.tooltip = tooltip;
    exports$12.transformation = toTransformation;
    exports$12.version = version;
    exports$12.videoOverlay = videoOverlay;
    var oldL = window.L;
    exports$12.noConflict = function() {
      window.L = oldL;
      return this;
    };
    window.L = exports$12;
  });
})(leafletSrc, leafletSrc.exports);
var leafletSrcExports = leafletSrc.exports;
const L$1 = /* @__PURE__ */ getDefaultExportFromCjs(leafletSrcExports);
function useAttribution(map, attribution) {
  const attributionRef = reactExports.useRef(attribution);
  reactExports.useEffect(function updateAttribution() {
    if (attribution !== attributionRef.current && map.attributionControl != null) {
      if (attributionRef.current != null) {
        map.attributionControl.removeAttribution(attributionRef.current);
      }
      if (attribution != null) {
        map.attributionControl.addAttribution(attribution);
      }
    }
    attributionRef.current = attribution;
  }, [
    map,
    attribution
  ]);
}
function updateCircle(layer, props, prevProps) {
  if (props.center !== prevProps.center) {
    layer.setLatLng(props.center);
  }
  if (props.radius != null && props.radius !== prevProps.radius) {
    layer.setRadius(props.radius);
  }
}
const CONTEXT_VERSION = 1;
function createLeafletContext(map) {
  return Object.freeze({
    __version: CONTEXT_VERSION,
    map
  });
}
function extendContext(source, extra) {
  return Object.freeze({
    ...source,
    ...extra
  });
}
const LeafletContext = reactExports.createContext(null);
function useLeafletContext() {
  const context = reactExports.use(LeafletContext);
  if (context == null) {
    throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");
  }
  return context;
}
function createContainerComponent(useElement) {
  function ContainerComponent(props, forwardedRef) {
    const { instance, context } = useElement(props).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    const { children } = props;
    return children == null ? null : /* @__PURE__ */ o.createElement(LeafletContext, {
      value: context
    }, children);
  }
  return /* @__PURE__ */ reactExports.forwardRef(ContainerComponent);
}
function createDivOverlayComponent(useElement) {
  function OverlayComponent(props, forwardedRef) {
    const [isOpen, setOpen] = reactExports.useState(false);
    const { instance } = useElement(props, setOpen).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    reactExports.useEffect(function updateOverlay() {
      if (isOpen) {
        instance.update();
      }
    }, [
      instance,
      isOpen,
      props.children
    ]);
    const contentNode = instance._contentNode;
    return contentNode ? /* @__PURE__ */ reactDomExports.createPortal(props.children, contentNode) : null;
  }
  return /* @__PURE__ */ reactExports.forwardRef(OverlayComponent);
}
function createLeafComponent(useElement) {
  function LeafComponent(props, forwardedRef) {
    const { instance } = useElement(props).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    return null;
  }
  return /* @__PURE__ */ reactExports.forwardRef(LeafComponent);
}
function useEventHandlers(element, eventHandlers) {
  const eventHandlersRef = reactExports.useRef(void 0);
  reactExports.useEffect(function addEventHandlers() {
    if (eventHandlers != null) {
      element.instance.on(eventHandlers);
    }
    eventHandlersRef.current = eventHandlers;
    return function removeEventHandlers() {
      if (eventHandlersRef.current != null) {
        element.instance.off(eventHandlersRef.current);
      }
      eventHandlersRef.current = null;
    };
  }, [
    element,
    eventHandlers
  ]);
}
function withPane(props, context) {
  const pane = props.pane ?? context.pane;
  return pane ? {
    ...props,
    pane
  } : props;
}
function createDivOverlayHook(useElement, useLifecycle) {
  return function useDivOverlay(props, setOpen) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useAttribution(context.map, props.attribution);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLifecycle(elementRef.current, context, props, setOpen);
    return elementRef;
  };
}
function createElementObject(instance, context, container) {
  return Object.freeze({
    instance,
    context,
    container
  });
}
function createElementHook(createElement, updateElement) {
  if (updateElement == null) {
    return function useImmutableLeafletElement(props, context) {
      const elementRef = reactExports.useRef(void 0);
      if (!elementRef.current) elementRef.current = createElement(props, context);
      return elementRef;
    };
  }
  return function useMutableLeafletElement(props, context) {
    const elementRef = reactExports.useRef(void 0);
    if (!elementRef.current) elementRef.current = createElement(props, context);
    const propsRef = reactExports.useRef(props);
    const { instance } = elementRef.current;
    reactExports.useEffect(function updateElementProps() {
      if (propsRef.current !== props) {
        updateElement(instance, props, propsRef.current);
        propsRef.current = props;
      }
    }, [
      instance,
      props,
      updateElement
    ]);
    return elementRef;
  };
}
function useLayerLifecycle(element, context) {
  reactExports.useEffect(function addLayer() {
    const container = context.layerContainer ?? context.map;
    container.addLayer(element.instance);
    return function removeLayer() {
      var _a;
      (_a = context.layerContainer) == null ? void 0 : _a.removeLayer(element.instance);
      context.map.removeLayer(element.instance);
    };
  }, [
    context,
    element
  ]);
}
function createLayerHook(useElement) {
  return function useLayer(props) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useAttribution(context.map, props.attribution);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLayerLifecycle(elementRef.current, context);
    return elementRef;
  };
}
function usePathOptions(element, props) {
  const optionsRef = reactExports.useRef(void 0);
  reactExports.useEffect(function updatePathOptions() {
    if (props.pathOptions !== optionsRef.current) {
      const options = props.pathOptions ?? {};
      element.instance.setStyle(options);
      optionsRef.current = options;
    }
  }, [
    element,
    props
  ]);
}
function createPathHook(useElement) {
  return function usePath(props) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLayerLifecycle(elementRef.current, context);
    usePathOptions(elementRef.current, props);
    return elementRef;
  };
}
function createLayerComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const useLayer = createLayerHook(useElement);
  return createContainerComponent(useLayer);
}
function createOverlayComponent(createElement, useLifecycle) {
  const useElement = createElementHook(createElement);
  const useOverlay = createDivOverlayHook(useElement, useLifecycle);
  return createDivOverlayComponent(useOverlay);
}
function createPathComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const usePath = createPathHook(useElement);
  return createContainerComponent(usePath);
}
function createTileLayerComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const useLayer = createLayerHook(useElement);
  return createLeafComponent(useLayer);
}
function updateGridLayer(layer, props, prevProps) {
  const { opacity, zIndex } = props;
  if (opacity != null && opacity !== prevProps.opacity) {
    layer.setOpacity(opacity);
  }
  if (zIndex != null && zIndex !== prevProps.zIndex) {
    layer.setZIndex(zIndex);
  }
}
function useMap() {
  return useLeafletContext().map;
}
function useMapEvents(handlers) {
  const map = useMap();
  reactExports.useEffect(function addMapEventHandlers() {
    map.on(handlers);
    return function removeMapEventHandlers() {
      map.off(handlers);
    };
  }, [
    map,
    handlers
  ]);
  return map;
}
const Circle = createPathComponent(function createCircle({ center, children: _c, ...options }, ctx) {
  const circle = new leafletSrcExports.Circle(center, options);
  return createElementObject(circle, extendContext(ctx, {
    overlayContainer: circle
  }));
}, updateCircle);
function MapContainerComponent({ bounds, boundsOptions, center, children, className, id: id2, placeholder, style, whenReady, zoom, ...options }, forwardedRef) {
  const [props] = reactExports.useState({
    className,
    id: id2,
    style
  });
  const [context, setContext] = reactExports.useState(null);
  const mapInstanceRef = reactExports.useRef(void 0);
  reactExports.useImperativeHandle(forwardedRef, () => (context == null ? void 0 : context.map) ?? null, [
    context
  ]);
  const mapRef = reactExports.useCallback((node) => {
    if (node !== null && !mapInstanceRef.current) {
      const map = new leafletSrcExports.Map(node, options);
      mapInstanceRef.current = map;
      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }
      setContext(createLeafletContext(map));
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      context == null ? void 0 : context.map.remove();
    };
  }, [
    context
  ]);
  const contents = context ? /* @__PURE__ */ o.createElement(LeafletContext, {
    value: context
  }, children) : placeholder ?? null;
  return /* @__PURE__ */ o.createElement("div", {
    ...props,
    ref: mapRef
  }, contents);
}
const MapContainer = /* @__PURE__ */ reactExports.forwardRef(MapContainerComponent);
const Marker = createLayerComponent(function createMarker({ position, ...options }, ctx) {
  const marker = new leafletSrcExports.Marker(position, options);
  return createElementObject(marker, extendContext(ctx, {
    overlayContainer: marker
  }));
}, function updateMarker(marker, props, prevProps) {
  if (props.position !== prevProps.position) {
    marker.setLatLng(props.position);
  }
  if (props.icon != null && props.icon !== prevProps.icon) {
    marker.setIcon(props.icon);
  }
  if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) {
    marker.setZIndexOffset(props.zIndexOffset);
  }
  if (props.opacity != null && props.opacity !== prevProps.opacity) {
    marker.setOpacity(props.opacity);
  }
  if (marker.dragging != null && props.draggable !== prevProps.draggable) {
    if (props.draggable === true) {
      marker.dragging.enable();
    } else {
      marker.dragging.disable();
    }
  }
});
const Polygon = createPathComponent(function createPolygon({ positions, ...options }, ctx) {
  const polygon = new leafletSrcExports.Polygon(positions, options);
  return createElementObject(polygon, extendContext(ctx, {
    overlayContainer: polygon
  }));
}, function updatePolygon(layer, props, prevProps) {
  if (props.positions !== prevProps.positions) {
    layer.setLatLngs(props.positions);
  }
});
const Polyline = createPathComponent(function createPolyline({ positions, ...options }, ctx) {
  const polyline = new leafletSrcExports.Polyline(positions, options);
  return createElementObject(polyline, extendContext(ctx, {
    overlayContainer: polyline
  }));
}, function updatePolyline(layer, props, prevProps) {
  if (props.positions !== prevProps.positions) {
    layer.setLatLngs(props.positions);
  }
});
const Popup = createOverlayComponent(function createPopup(props, context) {
  const popup = new leafletSrcExports.Popup(props, context.overlayContainer);
  return createElementObject(popup, context);
}, function usePopupLifecycle(element, context, { position }, setOpen) {
  reactExports.useEffect(function addPopup() {
    const { instance } = element;
    function onPopupOpen(event) {
      if (event.popup === instance) {
        instance.update();
        setOpen(true);
      }
    }
    function onPopupClose(event) {
      if (event.popup === instance) {
        setOpen(false);
      }
    }
    context.map.on({
      popupopen: onPopupOpen,
      popupclose: onPopupClose
    });
    if (context.overlayContainer == null) {
      if (position != null) {
        instance.setLatLng(position);
      }
      instance.openOn(context.map);
    } else {
      context.overlayContainer.bindPopup(instance);
    }
    return function removePopup() {
      var _a;
      context.map.off({
        popupopen: onPopupOpen,
        popupclose: onPopupClose
      });
      (_a = context.overlayContainer) == null ? void 0 : _a.unbindPopup();
      context.map.removeLayer(instance);
    };
  }, [
    element,
    context,
    setOpen,
    position
  ]);
});
const TileLayer = createTileLayerComponent(function createTileLayer({ url, ...options }, context) {
  const layer = new leafletSrcExports.TileLayer(url, withPane(options, context));
  return createElementObject(layer, context);
}, function updateTileLayer(layer, props, prevProps) {
  updateGridLayer(layer, props, prevProps);
  const { url } = props;
  if (url != null && url !== prevProps.url) {
    layer.setUrl(url);
  }
});
function MapSearchBar() {
  const map = useMap();
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [activeIndex, setActiveIndex] = reactExports.useState(-1);
  const debounceRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const doSearch = reactExports.useCallback(async (q) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "BlueprintMD/1.0" }
      });
      if (!res.ok) throw new Error("Nominatim error");
      const data = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void doSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);
  reactExports.useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  reactExports.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const stop = (e) => e.stopPropagation();
    el.addEventListener("click", stop);
    el.addEventListener("dblclick", stop);
    el.addEventListener("wheel", stop);
    el.addEventListener("touchstart", stop);
    return () => {
      el.removeEventListener("click", stop);
      el.removeEventListener("dblclick", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, []);
  function selectResult(r) {
    map.flyTo([Number.parseFloat(r.lat), Number.parseFloat(r.lon)], 16, {
      animate: true,
      duration: 1.2
    });
    setQuery(r.display_name.split(",")[0]);
    setIsOpen(false);
    setResults([]);
  }
  function clearSearch() {
    var _a;
    setQuery("");
    setResults([]);
    setIsOpen(false);
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  function handleKeyDown(e) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectResult(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      style: {
        position: "relative",
        minWidth: 180,
        maxWidth: 300,
        width: "clamp(180px, 30vw, 300px)",
        fontFamily: "var(--font-body, sans-serif)"
      },
      "data-ocid": "measure.search_bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              background: "var(--card, #fff)",
              border: "1px solid var(--border, #e2e8f0)",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              height: 36,
              padding: "0 8px",
              gap: 6,
              overflow: "hidden"
            },
            children: [
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  style: {
                    width: 15,
                    height: 15,
                    color: "var(--primary, #06b6d4)",
                    flexShrink: 0,
                    animation: "spin 1s linear infinite"
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  style: {
                    width: 15,
                    height: 15,
                    color: "var(--muted-foreground, #64748b)",
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  onKeyDown: handleKeyDown,
                  onFocus: () => results.length > 0 && setIsOpen(true),
                  placeholder: "Search location…",
                  "aria-label": "Search for a location",
                  "aria-autocomplete": "list",
                  "aria-expanded": isOpen,
                  "data-ocid": "measure.search_input",
                  style: {
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: "var(--foreground, #0f172a)",
                    fontFamily: "inherit",
                    minWidth: 0
                  }
                }
              ),
              query && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearSearch,
                  "aria-label": "Clear search",
                  "data-ocid": "measure.search_clear_button",
                  style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    flexShrink: 0
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    X,
                    {
                      style: {
                        width: 14,
                        height: 14,
                        color: "var(--muted-foreground, #64748b)"
                      }
                    }
                  )
                }
              )
            ]
          }
        ),
        isOpen && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-label": "Location suggestions",
            style: {
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "var(--card, #fff)",
              border: "1px solid var(--border, #e2e8f0)",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
              zIndex: 2e3,
              listStyle: "none",
              margin: 0,
              padding: "4px 0",
              maxHeight: 220,
              overflowY: "auto"
            },
            children: results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "aria-selected": i === activeIndex,
                onMouseDown: () => selectResult(r),
                onMouseEnter: () => setActiveIndex(i),
                "data-ocid": `measure.search_result.${i + 1}`,
                style: {
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--foreground, #0f172a)",
                  background: i === activeIndex ? "var(--muted, #f1f5f9)" : "transparent",
                  lineHeight: 1.4,
                  transition: "background 0.1s"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        display: "block",
                        fontWeight: 600,
                        fontSize: 13,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: r.display_name.split(",")[0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        color: "var(--muted-foreground, #64748b)",
                        fontSize: 11,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block"
                      },
                      children: r.display_name.split(",").slice(1).join(",").trim()
                    }
                  )
                ]
              },
              r.place_id
            ))
          }
        )
      ]
    }
  );
}
L$1.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});
function makeWaypointIcon(label, isFirst, isClosed) {
  const color2 = isFirst && isClosed ? "#06b6d4" : "#22d3ee";
  return L$1.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${isFirst ? isClosed ? "#06b6d4" : "#0e7490" : "oklch(0.25 0 0)"};
      border:2px solid ${color2};
      display:flex;align-items:center;justify-content:center;
      color:${color2};font-family:'JetBrains Mono',monospace;
      font-size:10px;font-weight:700;
      box-shadow:0 0 8px ${color2}66;
      cursor:pointer;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}
const userPositionIcon = L$1.divIcon({
  className: "",
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="
      position:absolute;inset:0;border-radius:50%;
      background:oklch(0.62 0.18 233 / 0.2);
      animation:pulse 2s infinite;
    "></div>
    <div style="
      position:absolute;inset:3px;border-radius:50%;
      background:oklch(0.62 0.18 233);
      border:2px solid white;
      box-shadow:0 0 6px oklch(0.62 0.18 233 / 0.8);
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});
const centroidIcon = L$1.divIcon({
  className: "",
  html: `<div style="
    width:10px;height:10px;border-radius:50%;
    background:oklch(0.62 0.18 233 / 0.6);
    border:1px solid oklch(0.62 0.18 233);
  "></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});
const TILES = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    label: "Street"
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri World Imagery",
    label: "Satellite"
  }
};
function MapAutoCenter({
  position,
  hasCentered,
  onCentered
}) {
  const map = useMap();
  reactExports.useEffect(() => {
    if (position && !hasCentered) {
      map.setView([position.lat, position.lon], 18);
      onCentered();
    }
  }, [position, hasCentered, map, onCentered]);
  return null;
}
function MapFollowUser({
  position,
  captureMode
}) {
  const map = useMap();
  const prevRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (position && captureMode === "walk") {
      const prev = prevRef.current;
      if (!prev || calculateDistance(prev, position) > 2) {
        map.panTo([position.lat, position.lon], {
          animate: true,
          duration: 0.8
        });
        prevRef.current = position;
      }
    }
  }, [position, captureMode, map]);
  return null;
}
function MapClickCapture({
  enabled,
  onTap
}) {
  useMapEvents({
    click(e) {
      if (enabled) {
        onTap(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}
function SearchBarOverlay({
  portalTarget
}) {
  if (!portalTarget) return null;
  return reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(MapSearchBar, {}), portalTarget);
}
function MapView({
  position,
  waypoints,
  isClosed,
  captureMode,
  onAddWaypoint,
  onClosePlot
}) {
  const [tileKey, setTileKey] = reactExports.useState("satellite");
  const [hasCentered, setHasCentered] = reactExports.useState(false);
  const searchPortalRef = reactExports.useRef(null);
  const [searchPortalReady, setSearchPortalReady] = reactExports.useState(false);
  const defaultCenter = [51.505, -0.09];
  const tile = TILES[tileKey];
  const latlngs = waypoints.map((wp) => [wp.lat, wp.lon]);
  const centroid = isClosed && waypoints.length >= 3 ? calculateCentroid(waypoints) : null;
  const handleMarkerClick = reactExports.useCallback(
    (index) => {
      if (index === 0 && !isClosed && waypoints.length >= 3) {
        onClosePlot();
      }
    },
    [isClosed, waypoints.length, onClosePlot]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full", "data-ocid": "measure.map", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute top-3 right-3 z-[1000] flex items-center gap-2",
        "data-ocid": "measure.map_controls",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: (el) => {
                if (el && !searchPortalRef.current) {
                  searchPortalRef.current = el;
                  setSearchPortalReady(true);
                }
              },
              className: "hidden sm:block",
              "data-ocid": "measure.search_portal"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex rounded-lg overflow-hidden border border-border shadow-md",
              "data-ocid": "measure.tile_toggle",
              children: Object.keys(TILES).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setTileKey(k),
                  "data-ocid": `measure.tile_${k}`,
                  className: `px-3 py-1.5 text-xs font-mono transition-smooth ${tileKey === k ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
                  children: TILES[k].label
                },
                k
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      MapContainer,
      {
        center: defaultCenter,
        zoom: 14,
        className: "w-full h-full",
        zoomControl: false,
        attributionControl: false,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TileLayer, { url: tile.url, attribution: tile.attribution }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MapAutoCenter,
            {
              position,
              hasCentered,
              onCentered: () => setHasCentered(true)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapFollowUser, { position, captureMode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MapClickCapture,
            {
              enabled: captureMode === "tap" && !isClosed,
              onTap: onAddWaypoint
            }
          ),
          searchPortalReady && /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBarOverlay, { portalTarget: searchPortalRef.current }),
          position && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Marker,
              {
                position: [position.lat, position.lon],
                icon: userPositionIcon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Circle,
              {
                center: [position.lat, position.lon],
                radius: position.accuracy,
                pathOptions: {
                  color: "oklch(0.62 0.18 233)",
                  fillColor: "oklch(0.62 0.18 233)",
                  fillOpacity: 0.08,
                  weight: 1,
                  dashArray: "4 4"
                }
              }
            )
          ] }),
          latlngs.length >= 2 && !isClosed && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Polyline,
            {
              positions: latlngs,
              pathOptions: {
                color: "#22d3ee",
                weight: 2,
                opacity: 0.9,
                dashArray: "6 4"
              }
            }
          ),
          isClosed && latlngs.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Polygon,
            {
              positions: latlngs,
              pathOptions: {
                color: "#06b6d4",
                weight: 2,
                opacity: 1,
                fillColor: "#06b6d4",
                fillOpacity: 0.12
              }
            }
          ),
          waypoints.length >= 2 && waypoints.map((wp, i) => {
            const next = waypoints[(i + 1) % waypoints.length];
            if (!isClosed && i === waypoints.length - 1) return null;
            const dist = calculateDistance(wp, next);
            const mid = midpoint(wp, next);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Marker,
              {
                position: [mid.lat, mid.lon],
                icon: L$1.divIcon({
                  className: "",
                  html: `<div style="
                    background:oklch(0.25 0 0 / 0.85);
                    border:1px solid oklch(0.35 0 0);
                    border-radius:3px;padding:1px 5px;
                    font-family:'JetBrains Mono',monospace;
                    font-size:10px;color:#a3e8f4;white-space:nowrap;
                    box-shadow:0 1px 4px oklch(0.1 0 0 / 0.6);
                  ">${formatDistance(dist)}</div>`,
                  iconAnchor: [0, 0]
                })
              },
              `edge-${wp.lat.toFixed(6)}-${wp.lon.toFixed(6)}`
            );
          }),
          waypoints.map((wp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Marker,
            {
              position: [wp.lat, wp.lon],
              icon: makeWaypointIcon(String(i + 1), i === 0, isClosed),
              eventHandlers: { click: () => handleMarkerClick(i) },
              "data-ocid": `measure.waypoint.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-primary", children: [
                  "Waypoint ",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Lat: ",
                  wp.lat.toFixed(7)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Lon: ",
                  wp.lon.toFixed(7)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "±",
                  wp.accuracy.toFixed(1),
                  " m"
                ] })
              ] }) })
            },
            `wp-${wp.lat.toFixed(6)}-${wp.lon.toFixed(6)}-${i}`
          )),
          centroid && /* @__PURE__ */ jsxRuntimeExports.jsx(Marker, { position: [centroid.lat, centroid.lon], icon: centroidIcon, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: "Centroid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: centroid.lat.toFixed(7) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: centroid.lon.toFixed(7) })
          ] }) }) })
        ]
      }
    )
  ] });
}
const LayoutGroupContext = reactExports.createContext({});
function useConstant(init) {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
const isBrowser$1 = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser$1 ? reactExports.useLayoutEffect : reactExports.useEffect;
const PresenceContext = /* @__PURE__ */ reactExports.createContext(null);
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
const clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};
let invariant = () => {
};
const MotionGlobalConfig = {};
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
function isObject(value) {
  return typeof value === "object" && value !== null;
}
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
const combineFunctions = (a, b) => (v) => b(a(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0; i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = /* @__PURE__ */ reverseEasing(backOut);
const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
const anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);
const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
const isEasingArray = (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};
const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
const easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
const isValidEasing = (easing) => {
  return typeof easing === "string";
};
const easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4);
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition)) {
    return easingLookup[definition];
  }
  return definition;
};
const stepsOrder = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      const prevFrame = thisFrame;
      thisFrame = nextFrame;
      nextFrame = prevFrame;
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const useManualTiming = MotionGlobalConfig.useManualTiming;
    const timestamp = useManualTiming ? state.timestamp : performance.now();
    runNextFrame = false;
    if (!useManualTiming) {
      state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
    }
    state.timestamp = timestamp;
    state.isProcessing = true;
    setup.process(state);
    read.process(state);
    resolveKeyframes.process(state);
    preUpdate.process(state);
    update.process(state);
    preRender.process(state);
    render.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process) => {
    for (let i = 0; i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process);
    }
  };
  return { schedule, cancel, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
const isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function containsCSSVariable(value) {
  if (typeof value !== "string")
    return false;
  return value.split("/*")[0].includes("var(--");
}
const number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = {
  ...number,
  transform: (v) => clamp(0, 1, v)
};
const scale = {
  ...number,
  default: 1
};
const sanitize = (v) => Math.round(v * 1e5) / 1e5;
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v) {
  return v == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
const isColorString = (type, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const clampRgbUnit = (v) => clamp(0, 255, v);
const rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
};
const rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "";
  let g = "";
  let b = "";
  let a = "";
  if (v.length > 5) {
    r = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a = v.substring(7, 9);
  } else {
    r = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a = v.substring(4, 5);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = /* @__PURE__ */ createUnitType("deg");
const percent = /* @__PURE__ */ createUnitType("%");
const px = /* @__PURE__ */ createUnitType("px");
const vh = /* @__PURE__ */ createUnitType("vh");
const vw = /* @__PURE__ */ createUnitType("vw");
const progressPercentage = /* @__PURE__ */ (() => ({
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
}))();
const hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  },
  getAnimatableNone: (v) => {
    const parsed = color.parse(v);
    parsed.alpha = 0;
    return color.transform(parsed);
  }
};
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v) {
  var _a, _b;
  return isNaN(v) && typeof v === "string" && (((_a = v.match(floatRegex)) == null ? void 0 : _a.length) || 0) + (((_b = v.match(colorRegex)) == null ? void 0 : _b.length) || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function buildTransformer({ split, types }) {
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0; i < numSections; i++) {
      output += split[i];
      if (v[i] !== void 0) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v[i]);
        } else {
          output += v[i];
        }
      }
    }
    return output;
  };
}
function createTransformer(source) {
  return buildTransformer(analyseComplexValue(source));
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
const convertToZero = (value, splitBefore) => {
  if (typeof value === "number") {
    return (splitBefore == null ? void 0 : splitBefore.trim().endsWith("/")) ? value : 0;
  }
  return convertNumbersToZero(value);
};
function getAnimatableNone$1(v) {
  const info = analyseComplexValue(v);
  const transformer = buildTransformer(info);
  return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}
const mixNumber$1 = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color2) {
  const type = getColorType(color2);
  if (!Boolean(type))
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p) => p <= 0 ? origin : target;
  } else {
    return (p) => p >= 1 ? target : origin;
  }
}
function mixNumber(a, b) {
  return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
  if (typeof a === "number") {
    return mixNumber;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
  return (p) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](p);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer(a[key])(a[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = origin.values[originIndex] ?? 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    return mixImmediate(origin, target);
  }
};
function mix(from, to, p) {
  if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
    return mixNumber$1(from, to, p);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
const generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++) {
    points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] });
  const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => {
      return generator.next(duration * progress2).value / scale2;
    },
    duration: /* @__PURE__ */ millisecondsToSeconds(duration)
  };
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
const safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = /* @__PURE__ */ secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    springOptions.velocity = 0;
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring({ ...options, velocity: 0 });
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  let resolveVelocity;
  let angularFreq;
  let A;
  let sinCoeff;
  let cosCoeff;
  if (dampingRatio < 1) {
    angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
    sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
    cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return envelope * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    const C = initialVelocity + undampedAngularFreq * initialDelta;
    resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
    const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
    const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
    const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    velocity: (t) => /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t)),
    next: (t) => {
      if (!isResolvedFromDuration && dampingRatio < 1) {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const sin = Math.sin(angularFreq * t);
        const cos = Math.cos(angularFreq * t);
        const current2 = target - envelope * (A * sin + initialDelta * cos);
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
        state.value = state.done ? target : current2;
        return state;
      }
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {
    }
  };
  return generator;
}
spring.applyToOptions = (options) => {
  const generatorOptions = createGeneratorEasing(options, 100, spring);
  options.ease = generatorOptions.ease;
  options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration);
  options.type = "keyframes";
  return options;
};
const velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
  const nearestBoundary = (v) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: getGeneratorVelocity(calcLatest, t, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state;
      }
    }
  };
}
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (; i < input.length - 2; i++) {
        if (v < input[i + 1])
          break;
      }
    }
    const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
    offset.push(mixNumber$1(min, 1, offsetProgress));
  }
}
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o2) => o2 * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state.value = mapTimeToKeyframe(t);
      state.done = t >= duration;
      return state;
    }
  };
}
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
  const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
const transitionTypeMap = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
function replaceTransitionType(transition) {
  if (typeof transition.type === "string") {
    transition.type = transitionTypeMap[transition.type];
  }
}
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
const percentToProgress = (percent2) => percent2 / 100;
class JSAnimation extends WithPromise {
  constructor(options) {
    super();
    this.state = "idle";
    this.startTime = null;
    this.isStopped = false;
    this.currentTime = 0;
    this.holdTime = null;
    this.playbackSpeed = 1;
    this.delayState = {
      done: false,
      value: void 0
    };
    this.stop = () => {
      var _a, _b;
      const { motionValue: motionValue2 } = this.options;
      if (motionValue2 && motionValue2.updatedAt !== time.now()) {
        this.tick(time.now());
      }
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      (_b = (_a = this.options).onStop) == null ? void 0 : _b.call(_a);
    };
    this.options = options;
    this.initAnimation();
    this.play();
    if (options.autoplay === false)
      this.pause();
  }
  initAnimation() {
    const { options } = this;
    replaceTransitionType(options);
    const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
    let { keyframes: keyframes$1 } = options;
    const generatorFactory = type || keyframes;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      this.mirroredGenerator = generatorFactory({
        ...options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    this.calculatedDuration = calculatedDuration;
    this.resolvedDuration = calculatedDuration + repeatDelay;
    this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
    this.generator = generator;
  }
  updateTime(timestamp) {
    const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
    if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = animationTime;
    }
  }
  tick(timestamp, sample = false) {
    const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else {
      this.updateTime(timestamp);
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
    const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    let state;
    if (isInDelayPhase) {
      this.delayState.value = keyframes2[0];
      state = this.delayState;
    } else {
      state = frameGenerator.next(elapsed);
    }
    if (mixKeyframes && !isInDelayPhase) {
      state.value = mixKeyframes(state.value);
    }
    let { done } = state;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && type !== inertia) {
      state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
    }
    if (onUpdate) {
      onUpdate(state.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve, reject) {
    return this.finished.then(resolve, reject);
  }
  get duration() {
    return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.playbackSpeed;
    }
    if (this.driver) {
      this.driver.start(false);
    } else {
      this.startTime = 0;
      this.state = "paused";
      this.holdTime = newTime;
      this.tick(newTime);
    }
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const t = this.currentTime;
    if (t <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity) {
      return this.generator.velocity(t);
    }
    const current = this.generator.next(t).value;
    return getGeneratorVelocity((s) => this.generator.next(s).value, t, current);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    const hasChanged = this.playbackSpeed !== newSpeed;
    if (hasChanged && this.driver) {
      this.updateTime(time.now());
    }
    this.playbackSpeed = newSpeed;
    if (hasChanged && this.driver) {
      this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    var _a, _b;
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    (_b = (_a = this.options).onPlay) == null ? void 0 : _b.call(_a);
    const now2 = this.driver.now();
    if (this.state === "finished") {
      this.updateFinished();
      this.startTime = now2;
    } else if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime ?? now2;
    }
    if (this.state === "finished" && this.speed < 0) {
      this.startTime += this.calculatedDuration;
    }
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    this.state = "paused";
    this.updateTime(time.now());
    this.holdTime = this.currentTime;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    var _a, _b;
    this.notifyFinished();
    this.teardown();
    this.state = "finished";
    (_b = (_a = this.options).onComplete) == null ? void 0 : _b.call(_a);
  }
  cancel() {
    var _a, _b;
    this.holdTime = null;
    this.startTime = 0;
    this.tick(0);
    this.teardown();
    (_b = (_a = this.options).onCancel) == null ? void 0 : _b.call(_a);
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.startTime = this.holdTime = null;
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(sampleTime) {
    this.startTime = 0;
    return this.tick(sampleTime, true);
  }
  attachTimeline(timeline) {
    var _a;
    if (this.options.allowFlatten) {
      this.options.type = "keyframes";
      this.options.ease = "linear";
      this.initAnimation();
    }
    (_a = this.driver) == null ? void 0 : _a.stop();
    return timeline.observe(this);
  }
}
function fillWildcards(keyframes2) {
  for (let i = 1; i < keyframes2.length; i++) {
    keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
  }
}
const radToDeg = (rad) => rad * 180 / Math.PI;
const rotate = (v) => {
  const angle = radToDeg(Math.atan2(v[1], v[0]));
  return rebaseAngle(angle);
};
const matrix2dParsers = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
  rotate,
  rotateZ: rotate,
  skewX: (v) => radToDeg(Math.atan(v[1])),
  skewY: (v) => radToDeg(Math.atan(v[2])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
};
const rebaseAngle = (angle) => {
  angle = angle % 360;
  if (angle < 0)
    angle += 360;
  return angle;
};
const rotateZ = rotate;
const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
const matrix3dParsers = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX,
  scaleY,
  scale: (v) => (scaleX(v) + scaleY(v)) / 2,
  rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
  rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
  rotateZ,
  rotate: rotateZ,
  skewX: (v) => radToDeg(Math.atan(v[4])),
  skewY: (v) => radToDeg(Math.atan(v[1])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
  if (!transform || transform === "none") {
    return defaultTransformValue(name);
  }
  const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers;
  let match;
  if (matrix3dMatch) {
    parsers = matrix3dParsers;
    match = matrix3dMatch;
  } else {
    const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers;
    match = matrix2dMatch;
  }
  if (!match) {
    return defaultTransformValue(name);
  }
  const valueParser = parsers[name];
  const values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
  const { transform = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform, name);
};
function convertTransformToNumber(value) {
  return parseFloat(value.trim());
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
const transformProps = /* @__PURE__ */ (() => new Set(transformPropOrder))();
const isNumOrPxType = (v) => v === number || v === px;
const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
    const width = x.max - x.min;
    return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
  },
  height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
    const height = y.max - y.min;
    return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
  },
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
  y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
let isForced = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          var _a;
          (_a = element.getValue(key)) == null ? void 0 : _a.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete(isForced));
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  isForced = true;
  readAllKeyframes();
  measureAllKeyframes();
  isForced = false;
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.state = "pending";
    this.isAsync = false;
    this.needsMeasurement = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled";
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue2 == null ? void 0 : motionValue2.get();
      const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== void 0) {
        unresolvedKeyframes[0] = currentValue;
      } else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        if (valueAsRead !== void 0 && valueAsRead !== null) {
          unresolvedKeyframes[0] = valueAsRead;
        }
      }
      if (unresolvedKeyframes[0] === void 0) {
        unresolvedKeyframes[0] = finalKeyframe;
      }
      if (motionValue2 && currentValue === void 0) {
        motionValue2.set(unresolvedKeyframes[0]);
      }
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(isForcedComplete = false) {
    this.state = "complete";
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
    toResolve.delete(this);
  }
  cancel() {
    if (this.state === "scheduled") {
      toResolve.delete(this);
      this.state = "pending";
    }
  }
  resume() {
    if (this.state === "pending")
      this.scheduleResolve();
  }
}
const isCSSVar = (name) => name.startsWith("--");
function setStyle(element, name, value) {
  isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
const supportsFlags = {};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
const supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function") {
    return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  const options = {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  if (pseudoElement)
    options.pseudoElement = pseudoElement;
  const animation = element.animate(keyframeOptions, options);
  return animation;
}
function isGenerator(type) {
  return typeof type === "function" && "applyToOptions" in type;
}
function applyGeneratorOptions({ type, ...options }) {
  if (isGenerator(type) && supportsLinearEasing()) {
    return type.applyToOptions(options);
  } else {
    options.duration ?? (options.duration = 300);
    options.ease ?? (options.ease = "easeOut");
  }
  return options;
}
class NativeAnimation extends WithPromise {
  constructor(options) {
    super();
    this.finishedTime = null;
    this.isStopped = false;
    this.manualStartTime = null;
    if (!options)
      return;
    const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
    this.isPseudoElement = Boolean(pseudoElement);
    this.allowFlatten = allowFlatten;
    this.options = options;
    invariant(typeof options.type !== "string");
    const transition = applyGeneratorOptions(options);
    this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
    if (transition.autoplay === false) {
      this.animation.pause();
    }
    this.animation.onfinish = () => {
      this.finishedTime = this.time;
      if (!pseudoElement) {
        const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
        if (this.updateMotionValue) {
          this.updateMotionValue(keyframe);
        }
        setStyle(element, name, keyframe);
        this.animation.cancel();
      }
      onComplete == null ? void 0 : onComplete();
      this.notifyFinished();
    };
  }
  play() {
    if (this.isStopped)
      return;
    this.manualStartTime = null;
    this.animation.play();
    if (this.state === "finished") {
      this.updateFinished();
    }
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var _a, _b;
    (_b = (_a = this.animation).finish) == null ? void 0 : _b.call(_a);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e) {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = true;
    const { state } = this;
    if (state === "idle" || state === "finished") {
      return;
    }
    if (this.updateMotionValue) {
      this.updateMotionValue();
    } else {
      this.commitStyles();
    }
    if (!this.isPseudoElement)
      this.cancel();
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var _a, _b, _c;
    const element = (_a = this.options) == null ? void 0 : _a.element;
    if (!this.isPseudoElement && (element == null ? void 0 : element.isConnected)) {
      (_c = (_b = this.animation).commitStyles) == null ? void 0 : _c.call(_b);
    }
  }
  get duration() {
    var _a, _b;
    const duration = ((_b = (_a = this.animation.effect) == null ? void 0 : _a.getComputedTiming) == null ? void 0 : _b.call(_a).duration) || 0;
    return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
  }
  set time(newTime) {
    const wasFinished = this.finishedTime !== null;
    this.manualStartTime = null;
    this.finishedTime = null;
    this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    if (wasFinished) {
      this.animation.pause();
    }
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(newSpeed) {
    if (newSpeed < 0)
      this.finishedTime = null;
    this.animation.playbackRate = newSpeed;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(newStartTime) {
    this.manualStartTime = this.animation.startTime = newStartTime;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
    var _a;
    if (this.allowFlatten) {
      (_a = this.animation.effect) == null ? void 0 : _a.updateTiming({ easing: "linear" });
    }
    this.animation.onfinish = null;
    if (timeline && supportsScrollTimeline()) {
      this.animation.timeline = timeline;
      if (rangeStart)
        this.animation.rangeStart = rangeStart;
      if (rangeEnd)
        this.animation.rangeEnd = rangeEnd;
      return noop;
    } else {
      return observe(this);
    }
  }
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
    transition.ease = unsupportedEasingFunctions[transition.ease];
  }
}
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options);
    replaceTransitionType(options);
    super(options);
    if (options.startTime !== void 0 && options.autoplay !== false) {
      this.startTime = options.startTime;
    }
    this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value) {
    const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue2)
      return;
    if (value !== void 0) {
      motionValue2.set(value);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: false
    });
    const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
    const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
    const current = sampleAnimation.sample(sampleTime).value;
    const { name } = this.options;
    if (element && name)
      setStyle(element, name, current);
    motionValue2.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
    sampleAnimation.stop();
  }
}
const isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && // It's animatable if we have a string
  (complex.test(value) || value === "0") && // And it contains numbers and/or colors
  !value.startsWith("url(")) {
    return true;
  }
  return false;
};
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0; i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null) {
    return false;
  }
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
function makeAnimationInstant(options) {
  options.duration = 0;
  options.type = "keyframes";
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
const browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function hasBrowserOnlyColors(keyframes2) {
  for (let i = 0; i < keyframes2.length; i++) {
    if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
      return true;
    }
  }
  return false;
}
const colorProperties = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]);
const supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
  var _a;
  const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
  const subject = (_a = motionValue2 == null ? void 0 : motionValue2.owner) == null ? void 0 : _a.current;
  if (!(subject instanceof HTMLElement)) {
    return false;
  }
  const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
  return supportsWaapi() && name && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}
const MAX_RESOLVE_DELAY = 40;
class AsyncMotionValueAnimation extends WithPromise {
  constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
    var _a;
    super();
    this.stop = () => {
      var _a2, _b;
      if (this._animation) {
        this._animation.stop();
        (_a2 = this.stopTimeline) == null ? void 0 : _a2.call(this);
      }
      (_b = this.keyframeResolver) == null ? void 0 : _b.cancel();
    };
    this.createdAt = time.now();
    const optionsWithDefaults = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      name,
      motionValue: motionValue2,
      element,
      ...options
    };
    const KeyframeResolver$1 = (element == null ? void 0 : element.KeyframeResolver) || KeyframeResolver;
    this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
    (_a = this.keyframeResolver) == null ? void 0 : _a.scheduleResolve();
  }
  onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
    var _a, _b;
    this.keyframeResolver = void 0;
    const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
    this.resolvedAt = time.now();
    let canAnimateValue = true;
    if (!canAnimate(keyframes2, name, type, velocity)) {
      canAnimateValue = false;
      if (MotionGlobalConfig.instantAnimations || !delay2) {
        onUpdate == null ? void 0 : onUpdate(getFinalKeyframe(keyframes2, options, finalKeyframe));
      }
      keyframes2[0] = keyframes2[keyframes2.length - 1];
      makeAnimationInstant(options);
      options.repeat = 0;
    }
    const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
    const resolvedOptions = {
      startTime,
      finalKeyframe,
      ...options,
      keyframes: keyframes2
    };
    const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
    const element = (_b = (_a = resolvedOptions.motionValue) == null ? void 0 : _a.owner) == null ? void 0 : _b.current;
    let animation;
    if (useWaapi) {
      try {
        animation = new NativeAnimationExtended({
          ...resolvedOptions,
          element
        });
      } catch {
        animation = new JSAnimation(resolvedOptions);
      }
    } else {
      animation = new JSAnimation(resolvedOptions);
    }
    animation.finished.then(() => {
      this.notifyFinished();
    }).catch(noop);
    if (this.pendingTimeline) {
      this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
      this.pendingTimeline = void 0;
    }
    this._animation = animation;
  }
  get finished() {
    if (!this._animation) {
      return this._finished;
    } else {
      return this.animation.finished;
    }
  }
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
  get animation() {
    var _a;
    if (!this._animation) {
      (_a = this.keyframeResolver) == null ? void 0 : _a.resume();
      flushKeyframeResolvers();
    }
    return this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(newTime) {
    this.animation.time = newTime;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(newSpeed) {
    this.animation.speed = newSpeed;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(timeline) {
    if (this._animation) {
      this.stopTimeline = this.animation.attachTimeline(timeline);
    } else {
      this.pendingTimeline = timeline;
    }
    return () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var _a;
    if (this._animation) {
      this.animation.cancel();
    }
    (_a = this.keyframeResolver) == null ? void 0 : _a.cancel();
  }
}
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
  const numChildren = children.size;
  const maxStaggerDuration = (numChildren - 1) * staggerChildren;
  const delayIsFunction = typeof delayChildren === "function";
  return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
}
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
function getVariableValue(current, element, depth = 1) {
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
const keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
const ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
function resolveTransition(transition, parentTransition) {
  if ((transition == null ? void 0 : transition.inherit) && parentTransition) {
    const { inherit: _, ...rest } = transition;
    return { ...parentTransition, ...rest };
  }
  return transition;
}
function getValueTransition(transition, key) {
  const valueTransition = (transition == null ? void 0 : transition[key]) ?? (transition == null ? void 0 : transition["default"]) ?? transition;
  if (valueTransition !== transition) {
    return resolveTransition(valueTransition, transition);
  }
  return valueTransition;
}
const orchestrationKeys = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function isTransitionDefined(transition) {
  for (const key in transition) {
    if (!orchestrationKeys.has(key))
      return true;
  }
  return false;
}
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    Object.assign(options, getDefaultTransition(name, options));
  }
  options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration));
  options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay));
  if (options.from !== void 0) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    makeAnimationInstant(options);
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || (element == null ? void 0 : element.shouldSkipAnimations)) {
    shouldSkip = true;
    makeAnimationInstant(options);
    options.delay = 0;
  }
  options.allowFlatten = !valueTransition.type && !valueTransition.ease;
  if (shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement == null ? void 0 : visualElement.values.forEach((value, key) => {
    state[0][key] = value.get();
    state[1][key] = value.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init, options = {}) {
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v) => {
      var _a;
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev) {
        (_a = this.events.change) == null ? void 0 : _a.notify(this.current);
        if (this.dependents) {
          for (const dependent of this.dependents) {
            dependent.dirty();
          }
        }
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v) {
    if (!this.passiveEffect) {
      this.updateAndNotify(v);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  dirty() {
    var _a;
    (_a = this.events.change) == null ? void 0 : _a.notify(this.current);
  }
  addDependent(dependent) {
    if (!this.dependents) {
      this.dependents = /* @__PURE__ */ new Set();
    }
    this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    if (this.dependents) {
      this.dependents.delete(dependent);
    }
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var _a, _b;
    (_a = this.dependents) == null ? void 0 : _a.clear();
    (_b = this.events.destroy) == null ? void 0 : _b.notify();
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
const isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function resolveFinalValueInKeyframes(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}
const isMotionValue = (value) => Boolean(value && value.getVelocity);
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  } else if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange);
    newWillChange.add(key);
  }
}
function camelToDash(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  let { transition, transitionEnd, ...target } = targetAndTransition;
  const defaultTransition = visualElement.getDefaultTransition();
  transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
  const reduceMotion = transition == null ? void 0 : transition.reduceMotion;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key in target) {
    const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    const currentValue = value.get();
    if (currentValue !== void 0 && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
      frame.update(() => value.set(valueTarget));
      continue;
    }
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
    value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    const applyTransitionEnd = () => frame.update(() => {
      transitionEnd && setTarget(visualElement, transitionEnd);
    });
    if (animations2.length) {
      Promise.all(animations2).then(applyTransitionEnd);
    } else {
      applyTransitionEnd();
    }
  }
  return animations2;
}
function animateVariant(visualElement, variant, options = {}) {
  var _a;
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? (_a = visualElement.presenceContext) == null ? void 0 : _a.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  for (const child of visualElement.variantChildren) {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  }
  return Promise.all(animations2);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
const auto = {
  test: (v) => v === "auto",
  parse: (v) => v
};
const testValueType = (v) => (type) => type.test(v);
const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
};
const mask = {
  ...complex,
  getAnimatableNone: (v) => {
    const parsed = complex.parse(v);
    const transformer = complex.createTransformer(v);
    return transformer(parsed.map((v2) => typeof v2 === "number" ? 0 : typeof v2 === "object" ? { ...v2, alpha: 1 } : v2));
  }
};
const int = {
  ...number,
  transform: Math.round
};
const transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};
const numberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  inset: px,
  insetBlock: px,
  insetBlockStart: px,
  insetBlockEnd: px,
  insetInline: px,
  insetInlineStart: px,
  insetInlineEnd: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  paddingBlock: px,
  paddingBlockStart: px,
  paddingBlockEnd: px,
  paddingInline: px,
  paddingInlineStart: px,
  paddingInlineEnd: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  marginBlock: px,
  marginBlockStart: px,
  marginBlockEnd: px,
  marginInline: px,
  marginInlineStart: px,
  marginInlineEnd: px,
  // Typography
  fontSize: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px,
  ...transformValueTypes,
  zIndex: int,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter,
  mask,
  WebkitMask: mask
};
const getDefaultValueType = (key) => defaultValueTypes[key];
const customTypes = /* @__PURE__ */ new Set([filter, mask]);
function getAnimatableNone(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (!customTypes.has(defaultValueType))
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = void 0;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
    }
  }
}
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i] = resolved;
          }
          if (i === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    const originHasVar = containsCSSVariable(origin);
    const targetHasVar = containsCSSVariable(target);
    if (originHasVar !== targetHasVar && positionalValues[name]) {
      this.needsMeasurement = true;
      return;
    }
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        const value = unresolvedKeyframes[i];
        if (typeof value === "string") {
          unresolvedKeyframes[i] = parseFloat(value);
        }
      }
    } else if (positionalValues[name]) {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
        noneKeyframeIndexes.push(i);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    var _a;
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if ((_a = this.removedTransforms) == null ? void 0 : _a.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
}
function resolveElements(elementOrSelector, scope, selectorCache) {
  if (elementOrSelector == null) {
    return [];
  }
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    const elements = (selectorCache == null ? void 0 : selectorCache[elementOrSelector]) ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector).filter((element) => element != null);
}
const getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}
const { schedule: microtask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);
const isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  elements.forEach((element) => {
    let isPressed = false;
    let deferredHoverEnd = false;
    let hoverEndCallback;
    const removePointerLeave = () => {
      element.removeEventListener("pointerleave", onPointerLeave);
    };
    const endHover = (event) => {
      if (hoverEndCallback) {
        hoverEndCallback(event);
        hoverEndCallback = void 0;
      }
      removePointerLeave();
    };
    const onPointerUp = (event) => {
      isPressed = false;
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (deferredHoverEnd) {
        deferredHoverEnd = false;
        endHover(event);
      }
    };
    const onPointerDown = () => {
      isPressed = true;
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerUp, eventOptions);
    };
    const onPointerLeave = (leaveEvent) => {
      if (leaveEvent.pointerType === "touch")
        return;
      if (isPressed) {
        deferredHoverEnd = true;
        return;
      }
      endHover(leaveEvent);
    };
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      deferredHoverEnd = false;
      const onHoverEnd = onHoverStart(element, enterEvent);
      if (typeof onHoverEnd !== "function")
        return;
      hoverEndCallback = onHoverEnd;
      element.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    element.addEventListener("pointerdown", onPointerDown, eventOptions);
  });
  return cancel;
}
const isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
const isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
const keyboardAccessibleElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return keyboardAccessibleElements.has(element.tagName) || element.isContentEditable === true;
}
const textInputElements = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function isElementTextInput(element) {
  return textInputElements.has(element.tagName) || element.isContentEditable === true;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
const claimedPointerDownEvents = /* @__PURE__ */ new WeakSet();
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
  const startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    if (claimedPointerDownEvents.has(startEvent))
      return;
    isPressing.add(target);
    if (options.stopPropagation) {
      claimedPointerDownEvents.add(startEvent);
    }
    const onPressEnd = onPressStart(target, startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (isPressing.has(target)) {
        isPressing.delete(target);
      }
      if (!isValidPressEvent(endEvent)) {
        return;
      }
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  targets.forEach((target) => {
    const pointerDownTarget = options.useGlobalTarget ? window : target;
    pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
    if (isHTMLElement(target)) {
      target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
      if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
        target.tabIndex = 0;
      }
    }
  });
  return cancelEvents;
}
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
const resizeHandlers = /* @__PURE__ */ new WeakMap();
let observer;
const getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
  if (borderBoxSize && borderBoxSize[0]) {
    return borderBoxSize[0][borderBoxAxis + "Size"];
  } else if (isSVGElement(target) && "getBBox" in target) {
    return target.getBBox()[svgAxis];
  } else {
    return target[htmlAxis];
  }
};
const getWidth = /* @__PURE__ */ getSize("inline", "width", "offsetWidth");
const getHeight = /* @__PURE__ */ getSize("block", "height", "offsetHeight");
function notifyTarget({ target, borderBoxSize }) {
  var _a;
  (_a = resizeHandlers.get(target)) == null ? void 0 : _a.forEach((handler) => {
    handler(target, {
      get width() {
        return getWidth(target, borderBoxSize);
      },
      get height() {
        return getHeight(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = /* @__PURE__ */ new Set();
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer == null ? void 0 : observer.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers == null ? void 0 : elementHandlers.delete(handler);
      if (!(elementHandlers == null ? void 0 : elementHandlers.size)) {
        observer == null ? void 0 : observer.unobserve(element);
      }
    });
  };
}
const windowCallbacks = /* @__PURE__ */ new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const info = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = void 0;
    }
  };
}
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
const valueTypes = [...dimensionValueTypes, color, complex];
const findValueType = (v) => valueTypes.find(testValueType(v));
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
const createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
const createAxis = () => ({ min: 0, max: 0 });
const createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
const visualElementStore = /* @__PURE__ */ new WeakMap();
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
const variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };
const isBrowser = typeof window !== "undefined";
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let featureDefinitions = {};
function setFeatureDefinitions(definitions) {
  featureDefinitions = definitions;
}
function getFeatureDefinitions() {
  return featureDefinitions;
}
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.shouldSkipAnimations = false;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.hasBeenMounted = false;
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.skipAnimationsConfig = skipAnimations;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key]);
      }
    }
  }
  mount(instance) {
    var _a, _b;
    if (this.hasBeenMounted) {
      for (const key in this.initialValues) {
        (_a = this.values.get(key)) == null ? void 0 : _a.jump(this.initialValues[key]);
        this.latestValues[key] = this.initialValues[key];
      }
    }
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (this.reducedMotionConfig === "never") {
      this.shouldReduceMotion = false;
    } else if (this.reducedMotionConfig === "always") {
      this.shouldReduceMotion = true;
    } else {
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = prefersReducedMotion.current;
    }
    this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
    (_b = this.parent) == null ? void 0 : _b.addChild(this);
    this.update(this.props, this.presenceContext);
    this.hasBeenMounted = true;
  }
  unmount() {
    var _a;
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    (_a = this.parent) == null ? void 0 : _a.removeChild(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child);
    this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
    this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child);
    this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
      const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
      const animation = new NativeAnimation({
        element: this.current,
        name: key,
        keyframes: keyframes2,
        times,
        ease: ease2,
        duration: /* @__PURE__ */ secondsToMilliseconds(duration)
      });
      const cleanup = factory(animation);
      this.valueSubscriptions.set(key, () => {
        cleanup();
        animation.cancel();
      });
      return;
    }
    const valueIsTransform = transformProps.has(key);
    if (valueIsTransform && this.onBindTransform) {
      this.onBindTransform();
    }
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
      this.scheduleRender();
    });
    let removeSyncCheck;
    if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value.owner)
        value.stop();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === void 0 && defaultValue !== void 0) {
      value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
    if (value !== void 0 && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    var _a;
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, (_a = this.presenceContext) == null ? void 0 : _a.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    const style = props.style;
    return style ? style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
class Feature {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {
  }
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top });
  const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  var _a;
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      translateAxis(box.x, -node.scroll.offset.x);
      translateAxis(box.y, -node.scroll.offset.y);
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues, (_a = node.layout) == null ? void 0 : _a.layoutBox);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min += distance2;
  axis.max += distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function resolveAxisTranslate(value, axis) {
  if (typeof value === "string") {
    return parseFloat(value) / 100 * (axis.max - axis.min);
  }
  return value;
}
function transformBox(box, transform, sourceBox) {
  const resolveBox = sourceBox ?? box;
  transformAxis(box.x, resolveAxisTranslate(transform.x, resolveBox.x), transform.scaleX, transform.scale, transform.originX);
  transformAxis(box.y, resolveAxisTranslate(transform.y, resolveBox.y), transform.scaleY, transform.scale, transform.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode2;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0; i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      const parsed = parseFloat(value);
      valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key;
  for (key in style) {
    elementStyle[key] = style[key];
  }
  projection == null ? void 0 : projection.applyProjectionStyles(elementStyle, styleProp);
  for (key in vars) {
    elementStyle.setProperty(key, vars[key]);
  }
}
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x = pixelsToPercent(latest, node.target.x);
    const y = pixelsToPercent(latest, node.target.y);
    return `${x}% ${y}%`;
  }
};
const correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};
const scaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  var _a;
  const style = props.style;
  const prevStyle = prevProps == null ? void 0 : prevProps.style;
  const newValues = {};
  if (!style)
    return newValues;
  for (const key in style) {
    if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || ((_a = visualElement == null ? void 0 : visualElement.getValue(key)) == null ? void 0 : _a.liveStyle) !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    var _a;
    if (transformProps.has(key)) {
      return ((_a = this.projection) == null ? void 0 : _a.isProjecting) ? defaultTransformValue(key) : readTransformValue(instance, key);
    } else {
      const computedStyle = getComputedStyle$1(instance);
      const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value === "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
const camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = `${-offset}`;
  attrs[keys.array] = `${length} ${spacing}`;
}
const cssMotionPathProperties = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate, styleProp) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag2) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style } = state;
  if (attrs.transform) {
    style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (style.transform || attrs.transformOrigin) {
    style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
    delete attrs.transformOrigin;
  }
  if (style.transform) {
    style.transformBox = (styleProp == null ? void 0 : styleProp.transformBox) ?? "fill-box";
    delete attrs.transformBox;
  }
  for (const key of cssMotionPathProperties) {
    if (attrs[key] !== void 0) {
      style[key] = attrs[key];
      delete attrs[key];
    }
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse();
const numAnimationTypes = variantPriorityOrder.length;
function createAnimateFunction(visualElement) {
  return (animations2) => {
    return Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  };
}
function createAnimationState(visualElement) {
  let animate = createAnimateFunction(visualElement);
  let state = createState();
  let isInitialRender = true;
  let wasReset = false;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    var _a;
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? (_a = visualElement.presenceContext) == null ? void 0 : _a.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state[type];
      const prop = props[type] !== void 0 ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && (isInitialRender || wasReset) && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      if (type === "exit" && typeState.isActive && activeDelta !== true) {
        if (typeState.prevResolvedValues) {
          encounteredKeys = {
            ...encounteredKeys,
            ...typeState.prevResolvedValues
          };
        }
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev);
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== void 0 && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if ((isInitialRender || wasReset) && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => {
          const options = { type };
          if (typeof animation === "string" && (isInitialRender || wasReset) && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
            const { parent } = visualElement;
            const parentVariant = resolveVariant(parent, animation);
            if (parent.enteringChildren && parentVariant) {
              const { delayChildren } = parentVariant.transition || {};
              options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
            }
          }
          return {
            animation,
            options
          };
        }));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial !== "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        if (initialTransition && initialTransition.transition) {
          fallbackAnimation.transition = initialTransition.transition;
        }
      }
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget ?? null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    wasReset = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    var _a;
    if (state[type].isActive === isActive)
      return Promise.resolve();
    (_a = visualElement.variantChildren) == null ? void 0 : _a.forEach((child) => {
      var _a2;
      return (_a2 = child.animationState) == null ? void 0 : _a2.setActive(type, isActive);
    });
    state[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
      wasReset = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
const SCALE_PRECISION = 1e-4;
const SCALE_MIN = 1 - SCALE_PRECISION;
const SCALE_MAX = 1 + SCALE_PRECISION;
const TRANSLATE_PRECISION = 0.01;
const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = anchorPoint + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent, anchor) {
  calcRelativeAxis(target.x, relative.x, parent.x, anchor == null ? void 0 : anchor.x);
  calcRelativeAxis(target.y, relative.y, parent.y, anchor == null ? void 0 : anchor.y);
}
function calcRelativeAxisPosition(target, layout2, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = layout2.min - anchorPoint;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent, anchor) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x, anchor == null ? void 0 : anchor.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y, anchor == null ? void 0 : anchor.y);
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"];
const yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = (latestTransform == null ? void 0 : latestTransform.z) || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform = `perspective(${transformPerspective}px) ${transform}`;
    if (rotate2)
      transform += `rotate(${rotate2}deg) `;
    if (rotateX)
      transform += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform += `skewX(${skewX}deg) `;
    if (skewY)
      transform += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform || "none";
}
const borderLabels = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius"
];
const numBorders = borderLabels.length;
const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
const isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
    target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
  }
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = borderLabels[i];
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p) => {
    if (p < min)
      return 0;
    if (p > max)
      return 1;
    return easing(/* @__PURE__ */ progress(min, max, p));
  };
}
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
const compareByDepth = (a, b) => a.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.setup(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    for (let i = this.members.length - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member === node || member === this.lead || member === this.prevLead)
        continue;
      const inst = member.instance;
      if ((!inst || inst.isConnected === false) && !member.snapshot) {
        removeItem(this.members, member);
        member.unmount();
      }
    }
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead)
      this.prevLead = void 0;
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead)
        this.promote(prevLead);
    }
  }
  relegate(node) {
    var _a;
    for (let i = this.members.indexOf(node) - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false && ((_a = member.instance) == null ? void 0 : _a.isConnected) !== false) {
        this.promote(member);
        return true;
      }
    }
    return false;
  }
  promote(node, preserveFollowOpacity) {
    var _a;
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.updateSnapshot();
      node.scheduleRender();
      const { layoutDependency: prevDep } = prevLead.options;
      const { layoutDependency: nextDep } = node.options;
      if (prevDep === void 0 || prevDep !== nextDep) {
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity)
          prevLead.preserveOpacity = true;
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if ((_a = node.root) == null ? void 0 : _a.isUpdating)
          node.isLayoutDirty = true;
      }
      if (node.options.crossfade === false)
        prevLead.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((member) => {
      var _a, _b, _c, _d, _e;
      (_b = (_a = member.options).onExitComplete) == null ? void 0 : _b.call(_a);
      (_e = (_c = member.resumingFrom) == null ? void 0 : (_d = _c.options).onExitComplete) == null ? void 0 : _e.call(_d);
    });
  }
  scheduleRender() {
    this.members.forEach((member) => member.instance && member.scheduleRender(false));
  }
  removeLeadSnapshot() {
    var _a;
    if ((_a = this.lead) == null ? void 0 : _a.snapshot)
      this.lead.snapshot = void 0;
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};
const transformAxes = ["", "X", "Y", "Z"];
const animationTarget = 1e3;
let id$1 = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode$1({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent == null ? void 0 : defaultParent()) {
      this.id = id$1++;
      this.animationId = 0;
      this.animationCommitId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.layoutVersion = 0;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
      };
      this.resolvedRelativeTargetAt = 0;
      this.linkedParentVersion = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        let innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        frame.read(() => {
          innerWidth = window.innerWidth;
        });
        attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          if (newInnerWidth === innerWidth)
            return;
          innerWidth = newInnerWidth;
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
          if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      this.eventHandlers.clear();
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") {
          node.isLayoutDirty = true;
        }
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        const wasBlockedByResize = this.updateBlockedByResize;
        this.unblockUpdate();
        this.updateBlockedByResize = false;
        this.clearAllSnapshots();
        if (wasBlockedByResize) {
          this.nodes.forEach(forceLayoutMeasure);
        }
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId;
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      } else {
        this.isUpdating = false;
        this.nodes.forEach(ensureDraggedNodesSnapshotted);
        this.nodes.forEach(resetTransformStyle);
        this.nodes.forEach(updateLayout);
        this.nodes.forEach(notifyLayoutUpdate);
      }
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
      if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
        this.snapshot = void 0;
      }
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutVersion++;
      if (!this.layoutCorrected)
        this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var _a;
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = ((_a = this.scroll) == null ? void 0 : _a.wasRoot) || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      var _a;
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if ((_a = this.scroll) == null ? void 0 : _a.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll, options } = node;
        if (node !== this.root && scroll && options.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false, output) {
      var _a, _b;
      const withTransforms = output || createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          translateAxis(withTransforms.x, -node.scroll.offset.x);
          translateAxis(withTransforms.y, -node.scroll.offset.y);
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues, (_a = node.layout) == null ? void 0 : _a.layoutBox);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues, (_b = this.layout) == null ? void 0 : _b.layoutBox);
      }
      return withTransforms;
    }
    removeTransform(box) {
      var _a;
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!hasTransform(node.latestValues))
          continue;
        let sourceBox;
        if (node.instance) {
          hasScale(node.latestValues) && node.updateSnapshot();
          sourceBox = createBox();
          copyBoxInto(sourceBox, node.measurePageBox());
        }
        removeBoxTransforms(boxWithoutTransform, node.latestValues, (_a = node.snapshot) == null ? void 0 : _a.layoutBox, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      var _a;
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a = this.parent) == null ? void 0 : _a.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      const relativeParent = this.getClosestProjectingParent();
      if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) {
        this.removeRelativeTarget();
      }
      if (!this.targetDelta && !this.relativeTarget) {
        if (this.options.layoutAnchor !== false && relativeParent && relativeParent.layout) {
          this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
        } else {
          this.removeRelativeTarget();
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.applyTransform(this.layout.layoutBox, false, this.target);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        if (this.options.layoutAnchor !== false && relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(relativeParent, layout2, parentLayout) {
      this.relativeParent = relativeParent;
      this.linkedParentVersion = relativeParent.layoutVersion;
      this.forceRelativeParentToResolveTarget();
      this.relativeTarget = createBox();
      this.relativeTargetOrigin = createBox();
      calcRelativePosition(this.relativeTargetOrigin, layout2, parentLayout, this.options.layoutAnchor || void 0);
      copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var _a;
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || ((_a = this.parent) == null ? void 0 : _a.isProjectionDirty)) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll2 = true) {
      var _a;
      (_a = this.options.visualElement) == null ? void 0 : _a.scheduleRender();
      if (notifyAll2) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      var _a, _b, _c;
      this.notifyListeners("animationStart");
      (_a = this.currentAnimation) == null ? void 0 : _a.stop();
      (_c = (_b = this.resumingFrom) == null ? void 0 : _b.currentAnimation) == null ? void 0 : _c.stop();
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.motionValue || (this.motionValue = motionValue(0));
        this.motionValue.jump(0, false);
        this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
          ...options,
          velocity: 0,
          isSync: true,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
          },
          onComplete: () => {
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      var _a;
      const { layoutId } = this.options;
      return layoutId ? ((_a = this.getStack()) == null ? void 0 : _a.lead) || this : this;
    }
    getPrevLead() {
      var _a;
      const { layoutId } = this.options;
      return layoutId ? (_a = this.getStack()) == null ? void 0 : _a.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0; i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        targetStyle.visibility = "";
        targetStyle.opacity = "";
        targetStyle.pointerEvents = resolveMotionValue(styleProp == null ? void 0 : styleProp.pointerEvents) || "";
        targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        if (this.options.layoutId) {
          targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          targetStyle.pointerEvents = resolveMotionValue(styleProp == null ? void 0 : styleProp.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        transform = transformTemplate(valuesToRender, transform);
      }
      targetStyle.transform = transform;
      const { x, y } = this.projectionDelta;
      targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
        const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0; i < num; i++) {
            targetStyle[applyTo[i]] = corrected;
          }
        } else {
          if (isCSSVariable) {
            this.options.visualElement.renderState.vars[key] = corrected;
          } else {
            targetStyle[key] = corrected;
          }
        }
      }
      if (this.options.layoutId) {
        targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp == null ? void 0 : styleProp.pointerEvents) || "" : "none";
      }
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => {
        var _a;
        return (_a = node.currentAnimation) == null ? void 0 : _a.stop();
      });
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  var _a;
  const snapshot = ((_a = node.resumeFrom) == null ? void 0 : _a.snapshot) || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (animationType === "x" || animationType === "y") {
      const snapAxis = animationType === "x" ? "y" : "x";
      copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout2[snapAxis]);
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const anchor = node.options.layoutAnchor || void 0;
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox, anchor);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox, anchor);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeLayoutChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function forceLayoutMeasure(node) {
  node.isLayoutDirty = true;
  node.updateLayout();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function ensureDraggedNodesSnapshotted(node) {
  if (node.isAnimationBlocked && node.layout && !node.isLayoutDirty) {
    node.snapshot = node.layout;
    node.isLayoutDirty = true;
  }
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = void 0;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber$1(delta.translate, 0, p);
  output.scale = mixNumber$1(delta.scale, 1, p);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber$1(from.min, to.min, p);
  output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p);
  mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  var _a;
  return node !== node.root && ((_a = node.scroll) == null ? void 0 : _a.wasRoot);
}
const DocumentProjectionNode = createProjectionNode$1({
  attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
  measureScroll: () => {
    var _a, _b;
    return {
      x: document.documentElement.scrollLeft || ((_a = document.body) == null ? void 0 : _a.scrollLeft) || 0,
      y: document.documentElement.scrollTop || ((_b = document.body) == null ? void 0 : _b.scrollTop) || 0
    };
  },
  checkIsScrollRoot: () => true
});
const rootProjectionNode = {
  current: void 0
};
const HTMLProjectionNode = createProjectionNode$1({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
const MotionConfigContext = reactExports.createContext({
  transformPagePoint: (p) => p,
  isStatic: false,
  reducedMotion: "never"
});
function usePresence(subscribe = true) {
  const context = reactExports.useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id2 = reactExports.useId();
  reactExports.useEffect(() => {
    if (subscribe) {
      return register(id2);
    }
  }, [subscribe]);
  const safeToRemove = reactExports.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
const LazyContext = reactExports.createContext({ strict: false });
const featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let isInitialized = false;
function initFeatureDefinitions() {
  if (isInitialized)
    return;
  const initialFeatureDefinitions = {};
  for (const key in featureProps) {
    initialFeatureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  setFeatureDefinitions(initialFeatureDefinitions);
  isInitialized = true;
}
function getInitializedFeatureDefinitions() {
  initFeatureDefinitions();
  return getFeatureDefinitions();
}
function loadFeatures(features) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  for (const key in features) {
    featureDefinitions2[key] = {
      ...featureDefinitions2[key],
      ...features[key]
    };
  }
  setFeatureDefinitions(featureDefinitions2);
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
let shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (typeof isValidProp !== "function")
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  const emotionPkg = "@emotion/is-prop-valid";
  loadExternalIsValidProp(require(emotionPkg).default);
} catch {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (isMotionValue(props[key]))
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const MotionContext = /* @__PURE__ */ reactExports.createContext({});
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, reactExports.useContext(MotionContext));
  return reactExports.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return reactExports.useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
function useSVGProps(props, visualState, _isStatic, Component) {
  const visualProps = reactExports.useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component), props.transformTemplate, props.style);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component)
  ) {
    return true;
  }
  return false;
}
function useRender(Component, props, ref, { latestValues }, isStatic, forwardMotionProps = false, isSVG) {
  const useVisualProps = isSVG ?? isSVGComponent(Component) ? useSVGProps : useHTMLProps;
  const visualProps = useVisualProps(props, latestValues, isStatic, Component);
  const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
  const elementProps = Component !== reactExports.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
  const { children } = props;
  const renderedChildren = reactExports.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return reactExports.createElement(Component, {
    ...elementProps,
    children: renderedChildren
  });
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  return state;
}
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context = reactExports.useContext(MotionContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
});
const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState
});
const motionComponentSymbol = Symbol.for("motionComponentSymbol");
function useMotionRef(visualState, visualElement, externalRef) {
  const externalRefContainer = reactExports.useRef(externalRef);
  reactExports.useInsertionEffect(() => {
    externalRefContainer.current = externalRef;
  });
  const refCleanup = reactExports.useRef(null);
  return reactExports.useCallback((instance) => {
    var _a;
    if (instance) {
      (_a = visualState.onMount) == null ? void 0 : _a.call(visualState, instance);
    }
    const ref = externalRefContainer.current;
    if (typeof ref === "function") {
      if (instance) {
        const cleanup = ref(instance);
        if (typeof cleanup === "function") {
          refCleanup.current = cleanup;
        }
      } else if (refCleanup.current) {
        refCleanup.current();
        refCleanup.current = null;
      } else {
        ref(instance);
      }
    } else if (ref) {
      ref.current = instance;
    }
    if (visualElement) {
      instance ? visualElement.mount(instance) : visualElement.unmount();
    }
  }, [visualElement]);
}
const SwitchLayoutGroupContext = reactExports.createContext({});
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor, isSVG) {
  var _a, _b;
  const { visualElement: parent } = reactExports.useContext(MotionContext);
  const lazyContext = reactExports.useContext(LazyContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const motionConfig = reactExports.useContext(MotionConfigContext);
  const reducedMotionConfig = motionConfig.reducedMotion;
  const skipAnimations = motionConfig.skipAnimations;
  const visualElementRef = reactExports.useRef(null);
  const hasMountedOnce = reactExports.useRef(false);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig,
      skipAnimations,
      isSVG
    });
    if (hasMountedOnce.current && visualElementRef.current) {
      visualElementRef.current.manuallyAnimateOnMount = true;
    }
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = reactExports.useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = reactExports.useRef(false);
  reactExports.useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = reactExports.useRef(Boolean(optimisedAppearId) && typeof window !== "undefined" && !((_a = window.MotionHandoffIsComplete) == null ? void 0 : _a.call(window, optimisedAppearId)) && ((_b = window.MotionHasOptimisedAnimation) == null ? void 0 : _b.call(window, optimisedAppearId)));
  useIsomorphicLayoutEffect(() => {
    hasMountedOnce.current = true;
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    visualElement.scheduleRenderMicrotask();
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  reactExports.useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        var _a2;
        (_a2 = window.MotionHandoffMarkAsComplete) == null ? void 0 : _a2.call(window, optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
    visualElement.enteringChildren = void 0;
  });
  return visualElement;
}
function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutAnchor, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot,
    layoutAnchor
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createMotionComponent(Component, { forwardMotionProps = false, type } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const isSVG = type ? type === "svg" : isSVGComponent(Component);
  const useVisualState = isSVG ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...reactExports.useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && typeof window !== "undefined") {
      useStrictMode();
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode, isSVG);
    }
    return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps, isSVG)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${Component.displayName ?? Component.name ?? ""})`}`;
  const ForwardRefMotionComponent = reactExports.forwardRef(MotionDOMComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = reactExports.useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  reactExports.useContext(LazyContext).strict;
}
function getProjectionFunctionality(props) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  const { drag: drag2, layout: layout2 } = featureDefinitions2;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: (drag2 == null ? void 0 : drag2.isEnabled(props)) || (layout2 == null ? void 0 : layout2.isEnabled(props)) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy === "undefined") {
    return createMotionComponent;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const factory = (Component, options) => {
    return createMotionComponent(Component, options, preloadedFeatures, createVisualElement);
  };
  const deprecatedFactoryFunction = (Component, options) => {
    return factory(Component, options);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return factory;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
      }
      return componentCache.get(key);
    }
  });
}
const createDomVisualElement = (Component, options) => {
  const isSVG = options.isSVG ?? isSVGComponent(Component);
  return isSVG ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component !== reactExports.Fragment
  });
};
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node);
    node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    var _a;
    this.node.animationState.reset();
    (_a = this.unmountControls) == null ? void 0 : _a.call(this);
  }
}
let id = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments);
    this.id = id++;
    this.isExitComplete = false;
  }
  update() {
    var _a;
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    if (isPresent && prevIsPresent === false) {
      if (this.isExitComplete) {
        const { initial, custom } = this.node.getProps();
        if (typeof initial === "string") {
          const resolved = resolveVariant(this.node, initial, custom);
          if (resolved) {
            const { transition, transitionEnd, ...target } = resolved;
            for (const key in target) {
              (_a = this.node.getValue(key)) == null ? void 0 : _a.jump(target[key]);
            }
          }
        }
        this.node.animationState.reset();
        this.node.animationState.animateChanges();
      } else {
        this.node.animationState.setActive("exit", false);
      }
      this.isExitComplete = false;
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => {
        this.isExitComplete = true;
        onExitComplete(this.id);
      });
    }
  }
  mount() {
    const { register, onExitComplete } = this.node.presenceContext || {};
    if (onExitComplete) {
      onExitComplete(this.id);
    }
    if (register) {
      this.unmount = register(this.id);
    }
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
const distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
const overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3, element } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.lastRawMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.scrollPositions = /* @__PURE__ */ new Map();
    this.removeScrollListeners = null;
    this.onElementScroll = (event2) => {
      this.handleScroll(event2.target);
    };
    this.onWindowScroll = () => {
      this.handleScroll(window);
    };
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      if (this.lastRawMoveEventInfo) {
        this.lastMoveEventInfo = transformPoint(this.lastRawMoveEventInfo, this.transformPagePoint);
      }
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastRawMoveEventInfo = info2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin || !this.startEvent) {
        resumeAnimation && resumeAnimation();
      }
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.distanceThreshold = distanceThreshold;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    if (element) {
      this.startScrollTracking(element);
    }
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(element) {
    let current = element.parentElement;
    while (current) {
      const style = getComputedStyle(current);
      if (overflowStyles.has(style.overflowX) || overflowStyles.has(style.overflowY)) {
        this.scrollPositions.set(current, {
          x: current.scrollLeft,
          y: current.scrollTop
        });
      }
      current = current.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    });
    window.addEventListener("scroll", this.onElementScroll, {
      capture: true
    });
    window.addEventListener("scroll", this.onWindowScroll);
    this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: true
      });
      window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(target) {
    const initial = this.scrollPositions.get(target);
    if (!initial)
      return;
    const isWindow = target === window;
    const current = isWindow ? { x: window.scrollX, y: window.scrollY } : {
      x: target.scrollLeft,
      y: target.scrollTop
    };
    const delta = { x: current.x - initial.x, y: current.y - initial.y };
    if (delta.x === 0 && delta.y === 0)
      return;
    if (isWindow) {
      if (this.lastMoveEventInfo) {
        this.lastMoveEventInfo.point.x += delta.x;
        this.lastMoveEventInfo.point.y += delta.y;
      }
    } else {
      if (this.history.length > 0) {
        this.history[0].x -= delta.x;
        this.history[0].y -= delta.y;
      }
    }
    this.scrollPositions.set(target, current);
    frame.update(this.updatePoint, true);
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    this.removeScrollListeners && this.removeScrollListeners();
    this.scrollPositions.clear();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  if (timestampedPoint === history[0] && history.length > 2 && lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta) * 2) {
    timestampedPoint = history[1];
  }
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
function applyConstraints(point, { min, max }, elastic) {
  if (min !== void 0 && point < min) {
    point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.latestPointerEvent = null;
    this.latestPanInfo = null;
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
      this.stopAnimation();
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.update(() => onDragStart(event, info), false, true);
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      if (onDrag) {
        frame.update(() => onDrag(event, info), false, true);
      }
    };
    const onSessionEnd = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.stop(event, info);
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
    };
    const resumeAnimation = () => {
      const { dragSnapToOrigin: snap } = this.getProps();
      if (snap || this.constraints) {
        this.startAnimation({ x: 0, y: 0 });
      }
    };
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent;
    const finalPanInfo = panInfo || this.latestPanInfo;
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
    }
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.endPanSession();
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end();
    this.panSession = void 0;
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    var _a;
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a = this.visualElement.projection) == null ? void 0 : _a.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && !isRefObject(dragConstraints) && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin === true || dragSnapToOrigin === axis)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        const current = axisValue.get() || 0;
        axisValue.set(point[axis] - mixNumber$1(min, max, 0.5) + current);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.constraints = false;
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
    });
    this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      const target = event.target;
      const isClickingTextInputChild = target !== element && isElementTextInput(target);
      if (drag2 && dragListener && !isClickingTextInputChild) {
        this.start(event);
      }
    });
    let stopResizeObservers;
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
        if (!stopResizeObservers) {
          stopResizeObservers = startResizeObservers(element, dragConstraints.current, () => this.scalePositionWithinConstraints());
        }
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", ({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    });
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
      stopResizeObservers && stopResizeObservers();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function skipFirstCall(callback) {
  let isFirst = true;
  return () => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    callback();
  };
}
function startResizeObservers(element, constraintsElement, onResize) {
  const stopElement = resize(element, skipFirstCall(onResize));
  const stopContainer = resize(constraintsElement, skipFirstCall(onResize));
  return () => {
    stopElement();
    stopContainer();
  };
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
class DragGesture extends Feature {
  constructor(node) {
    super(node);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  update() {
    const { dragControls } = this.node.getProps();
    const { dragControls: prevDragControls } = this.node.prevProps || {};
    if (dragControls !== prevDragControls) {
      this.removeGroupControls();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
    }
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
    if (!this.controls.isDragging) {
      this.controls.endPanSession();
    }
  }
}
const asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.update(() => handler(event, info), false, true);
  }
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: asyncHandler(onPan),
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
}
let hasTakenAnySnapshot = false;
class MeasureLayoutWithContext extends reactExports.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      if (hasTakenAnySnapshot) {
        projection.root.didUpdate();
      }
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const { projection } = visualElement;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    if (prevProps.layoutDependency !== layoutDependency) {
      projection.setOptions({
        ...projection.options,
        layoutDependency
      });
    }
    hasTakenAnySnapshot = true;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { visualElement, layoutAnchor } = this.props;
    const { projection } = visualElement;
    if (projection) {
      projection.options.layoutAnchor = layoutAnchor;
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    hasTakenAnySnapshot = true;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: reactExports.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
const drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (_element, startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.current instanceof HTMLButtonElement && node.current.disabled) {
    return;
  }
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    const { globalTapTarget, propagate } = this.node.props;
    this.unmount = press(current, (_element, startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, {
      useGlobalTarget: globalTapTarget,
      stopPropagation: (propagate == null ? void 0 : propagate.tap) === false
    });
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap();
const observers = /* @__PURE__ */ new WeakMap();
const fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
const fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    var _a;
    (_a = this.stopObserver) == null ? void 0 : _a.call(this);
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    this.stopObserver = observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
    var _a;
    (_a = this.stopObserver) == null ? void 0 : _a.call(this);
    this.hasEnteredView = false;
    this.isInView = false;
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};
const layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
const featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
};
const motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
function GpsBadge({
  position,
  error,
  isTracking,
  satelliteCount
}) {
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "destructive",
        className: "text-xs font-mono gap-1",
        "data-ocid": "measure.gps_denied_badge",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-destructive-foreground inline-block" }),
          "GPS Denied"
        ]
      }
    );
  }
  if (!isTracking || !position) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "text-xs font-mono gap-1 border-muted-foreground text-muted-foreground",
        "data-ocid": "measure.gps_acquiring_badge",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-muted-foreground inline-block animate-pulse" }),
          "Acquiring GPS…"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: "text-xs font-mono gap-1 border-primary text-primary",
      "data-ocid": "measure.gps_locked_badge",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary inline-block" }),
        "GPS ±",
        position.accuracy.toFixed(0),
        "m",
        satelliteCount !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          " · ",
          satelliteCount,
          " sat"
        ] })
      ]
    }
  );
}
function MeasurementPanel({
  waypoints,
  isClosed,
  gpsPosition,
  gpsAccuracy,
  satelliteCount,
  gpsError,
  isTracking,
  captureMode,
  onCaptureMode,
  onUndo,
  onClear,
  onClosePlot,
  onSave,
  onStartTracking
}) {
  const [areaUnit, setAreaUnit] = reactExports.useState("sqm");
  const [distUnit, setDistUnit] = reactExports.useState("m");
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const areaSqm = isClosed && waypoints.length >= 3 ? calculateArea(waypoints) : 0;
  const perimM = waypoints.length >= 2 ? calculatePerimeter(waypoints, isClosed) : 0;
  const displayArea = () => {
    if (areaUnit === "ha") return `${sqmToHectares(areaSqm).toFixed(4)} ha`;
    if (areaUnit === "acres") return `${sqmToAcres(areaSqm).toFixed(4)} ac`;
    return `${areaSqm.toFixed(2)} m²`;
  };
  const displayPerim = () => {
    if (distUnit === "ft") return `${metersToFeet(perimM).toFixed(1)} ft`;
    return formatDistance(perimM);
  };
  const canClose = !isClosed && waypoints.length >= 3;
  const canSave = isClosed && waypoints.length >= 3;
  const hasWaypoints = waypoints.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { y: 80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { type: "spring", stiffness: 260, damping: 30 },
      className: "fixed bottom-0 sm:bottom-4 left-0 right-0 sm:left-4 sm:right-4 z-[1000] sm:rounded-xl",
      "data-ocid": "measure.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden h-16", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border sm:rounded-xl overflow-hidden",
            style: {
              boxShadow: "0 -2px 24px oklch(0.12 0 0 / 0.7), 0 0 0 1px oklch(0.62 0.18 233 / 0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GpsBadge,
                  {
                    position: gpsPosition,
                    error: gpsError,
                    isTracking,
                    satelliteCount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted/50 rounded-md p-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => onCaptureMode("tap"),
                      "data-ocid": "measure.tap_mode_toggle",
                      className: `px-3 py-1 text-xs font-mono rounded transition-smooth ${captureMode === "tap" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
                      children: "TAP"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => onCaptureMode("walk"),
                      "data-ocid": "measure.walk_mode_toggle",
                      className: `px-3 py-1 text-xs font-mono rounded transition-smooth ${captureMode === "walk" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
                      children: "WALK"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 divide-x divide-border px-0 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display uppercase tracking-widest text-muted-foreground", children: "Area" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: ["sqm", "ha", "acres"].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setAreaUnit(u),
                        "data-ocid": `measure.area_unit_${u}`,
                        className: `text-[9px] font-mono px-1 rounded transition-smooth ${areaUnit === u ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
                        children: u === "sqm" ? "m²" : u.toUpperCase()
                      },
                      u
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-2xl font-bold tabular-nums text-foreground leading-none",
                      "data-ocid": "measure.area_value",
                      children: isClosed && waypoints.length >= 3 ? displayArea() : "—"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display uppercase tracking-widest text-muted-foreground", children: "Perimeter" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: ["m", "ft"].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setDistUnit(u),
                        "data-ocid": `measure.dist_unit_${u}`,
                        className: `text-[9px] font-mono px-1 rounded transition-smooth ${distUnit === u ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
                        children: u
                      },
                      u
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-mono text-2xl font-bold tabular-nums text-foreground leading-none",
                      "data-ocid": "measure.perimeter_value",
                      children: waypoints.length >= 2 ? displayPerim() : "—"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-4 pb-2 text-xs font-mono text-muted-foreground",
                  "data-ocid": "measure.waypoint_count",
                  children: [
                    waypoints.length,
                    " waypoint",
                    waypoints.length !== 1 ? "s" : "",
                    isClosed && " · polygon closed",
                    gpsAccuracy !== null && !isClosed && isTracking && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-primary", children: "· GPS ready" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 pb-4", children: [
                !isTracking && !gpsError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "flex-1",
                    onClick: onStartTracking,
                    "data-ocid": "measure.start_gps_button",
                    children: "Start GPS"
                  }
                ),
                hasWaypoints && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: onUndo,
                      disabled: waypoints.length === 0,
                      "data-ocid": "measure.undo_button",
                      className: "font-mono text-xs",
                      children: "Undo"
                    }
                  ),
                  showClearConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "destructive",
                        size: "sm",
                        onClick: () => {
                          onClear();
                          setShowClearConfirm(false);
                        },
                        "data-ocid": "measure.clear_confirm_button",
                        className: "font-mono text-xs",
                        children: "Clear All"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => setShowClearConfirm(false),
                        "data-ocid": "measure.clear_cancel_button",
                        className: "font-mono text-xs",
                        children: "Cancel"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setShowClearConfirm(true),
                      "data-ocid": "measure.clear_button",
                      className: "font-mono text-xs text-destructive border-destructive/40 hover:bg-destructive/10",
                      children: "Clear"
                    }
                  ),
                  canClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: onClosePlot,
                      "data-ocid": "measure.close_plot_button",
                      className: "font-mono text-xs border-primary/40 text-primary hover:bg-primary/10",
                      children: "Close Plot"
                    }
                  ),
                  canSave && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90",
                      onClick: onSave,
                      "data-ocid": "measure.save_plot_button",
                      children: "Save Plot"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function SavePlotDialog({
  open,
  waypoints,
  onSave,
  onClose
}) {
  const [name, setName] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [nameError, setNameError] = reactExports.useState("");
  const areaSqm = calculateArea(waypoints);
  const perimM = calculatePerimeter(waypoints, true);
  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Plot name is required");
      return;
    }
    setNameError("");
    setIsSaving(true);
    try {
      await onSave(name.trim(), notes.trim());
      setName("");
      setNotes("");
    } finally {
      setIsSaving(false);
    }
  };
  const handleClose = () => {
    if (!isSaving) {
      setName("");
      setNotes("");
      setNameError("");
      onClose();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o2) => !o2 && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md bg-card border-border",
      "data-ocid": "measure.save_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg text-foreground", children: "Save Plot" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display uppercase tracking-widest text-muted-foreground mb-1", children: "Area" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-mono text-xl font-bold tabular-nums text-primary",
                "data-ocid": "measure.save_dialog_area",
                children: [
                  areaSqm.toFixed(2),
                  " m²"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
              sqmToHectares(areaSqm).toFixed(4),
              " ha"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display uppercase tracking-widest text-muted-foreground mb-1", children: "Perimeter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-xl font-bold tabular-nums text-foreground",
                "data-ocid": "measure.save_dialog_perimeter",
                children: formatDistance(perimM)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
              waypoints.length,
              " waypoints"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "plot-name",
                className: "font-display text-sm text-foreground",
                children: [
                  "Plot Name ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "plot-name",
                placeholder: "e.g. Lot A – North Boundary",
                value: name,
                onChange: (e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                },
                className: "font-mono bg-muted/30 border-input focus-visible:ring-primary",
                "data-ocid": "measure.save_dialog_name_input",
                autoFocus: true
              }
            ),
            nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive font-mono",
                "data-ocid": "measure.save_dialog_name_error",
                children: nameError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "plot-notes",
                className: "font-display text-sm text-foreground",
                children: [
                  "Notes",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(optional)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "plot-notes",
                placeholder: "Site conditions, reference points, remarks...",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                rows: 3,
                className: "font-mono text-sm bg-muted/30 border-input focus-visible:ring-primary resize-none",
                "data-ocid": "measure.save_dialog_notes_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: handleClose,
              disabled: isSaving,
              "data-ocid": "measure.save_dialog_cancel_button",
              className: "font-mono",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: isSaving,
              "data-ocid": "measure.save_dialog_confirm_button",
              className: "font-mono",
              children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin",
                  "data-ocid": "measure.save_dialog.loading_state"
                }
              ) : "Save Plot"
            }
          )
        ] })
      ]
    }
  ) });
}
const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 1e4,
  maximumAge: 1e3
};
function estimateSatellites(accuracy) {
  if (accuracy <= 3) return 18;
  if (accuracy <= 5) return 14;
  if (accuracy <= 10) return 10;
  if (accuracy <= 20) return 7;
  if (accuracy <= 50) return 5;
  return 4;
}
function useGeolocation() {
  const [position, setPosition] = reactExports.useState(null);
  const [isTracking, setIsTracking] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [satelliteCount, setSatelliteCount] = reactExports.useState(null);
  const watchIdRef = reactExports.useRef(null);
  const handleSuccess = reactExports.useCallback((pos) => {
    const geoPos = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      altitude: pos.coords.altitude,
      speed: pos.coords.speed,
      timestamp: pos.timestamp
    };
    setPosition(geoPos);
    setError(null);
    setSatelliteCount(estimateSatellites(pos.coords.accuracy));
  }, []);
  const handleError = reactExports.useCallback((err) => {
    const messages = {
      1: "Location access denied. Please enable GPS permissions.",
      2: "Location unavailable. Check GPS signal.",
      3: "Location request timed out. Move to open sky."
    };
    setError(messages[err.code] ?? "Unknown location error.");
    setIsTracking(false);
  }, []);
  const startTracking = reactExports.useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setError(null);
    setIsTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      GEO_OPTIONS
    );
  }, [handleSuccess, handleError]);
  const stopTracking = reactExports.useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
  return {
    position,
    isTracking,
    error,
    satelliteCount,
    startTracking,
    stopTracking
  };
}
function Measure() {
  var _a, _b;
  const geo = useGeolocation();
  const createPlot = useCreatePlot();
  const saveDraft = useSaveDraftPlot();
  const [waypoints, setWaypoints] = reactExports.useState([]);
  const [isClosed, setIsClosed] = reactExports.useState(false);
  const [captureMode, setCaptureMode] = reactExports.useState("tap");
  const [showSaveDialog, setShowSaveDialog] = reactExports.useState(false);
  const prevWalkPos = reactExports.useRef(geo.position);
  const walkIntervalRef = reactExports.useRef(null);
  const autosaveIntervalRef = reactExports.useRef(
    null
  );
  const { startTracking } = geo;
  reactExports.useEffect(() => {
    startTracking();
  }, [startTracking]);
  reactExports.useEffect(() => {
    if (captureMode !== "walk" || !geo.isTracking || isClosed) return;
    walkIntervalRef.current = setInterval(() => {
      const curr = geo.position;
      if (!curr) return;
      if (hasMoved(prevWalkPos.current, curr, 3)) {
        const seq = waypoints.length;
        setWaypoints((prev) => [...prev, geoPositionToWaypoint(curr, seq)]);
        prevWalkPos.current = curr;
      }
    }, 5e3);
    return () => {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    };
  }, [captureMode, geo.isTracking, geo.position, isClosed, waypoints.length]);
  reactExports.useEffect(() => {
    if (waypoints.length < 2) return;
    autosaveIntervalRef.current = setInterval(async () => {
      if (waypoints.length < 2) return;
      try {
        await saveDraft.mutateAsync({
          name: `Draft – ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
          notes: "",
          waypoints
        });
      } catch {
      }
    }, 3e4);
    return () => {
      if (autosaveIntervalRef.current)
        clearInterval(autosaveIntervalRef.current);
    };
  }, [waypoints, saveDraft]);
  const handleAddWaypoint = reactExports.useCallback(
    (lat, lon) => {
      var _a2;
      if (isClosed) return;
      const acc = ((_a2 = geo.position) == null ? void 0 : _a2.accuracy) ?? 5;
      const wp = {
        lat,
        lon,
        accuracy: acc,
        // Backend expects nanoseconds (Int); Date.now() returns ms → multiply by 1_000_000n
        timestamp: BigInt(Date.now()) * 1000000n,
        sequence: BigInt(waypoints.length)
      };
      setWaypoints((prev) => [...prev, wp]);
    },
    [isClosed, geo.position, waypoints.length]
  );
  const handleClosePlot = reactExports.useCallback(() => {
    if (waypoints.length >= 3) {
      setIsClosed(true);
      ue.success("Polygon closed", {
        description: `${waypoints.length} waypoints captured`,
        duration: 3e3
      });
    }
  }, [waypoints.length]);
  const handleUndo = reactExports.useCallback(() => {
    setWaypoints((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
    if (isClosed) setIsClosed(false);
  }, [isClosed]);
  const handleClear = reactExports.useCallback(() => {
    setWaypoints([]);
    setIsClosed(false);
    prevWalkPos.current = null;
  }, []);
  const handleSave = async (name, notes) => {
    try {
      await createPlot.mutateAsync({ name, notes, waypoints });
      ue.success("Plot saved!", {
        description: `"${name}" has been saved to your plots`,
        duration: 4500
      });
      setShowSaveDialog(false);
      handleClear();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      ue.error("Save failed", {
        description: `Could not save plot: ${msg}`,
        duration: 6e3
      });
    }
  };
  const handleCaptureMode = reactExports.useCallback(
    (mode) => {
      setCaptureMode(mode);
      if (mode === "walk") {
        prevWalkPos.current = geo.position;
        if (!geo.isTracking) geo.startTracking();
        ue.info("Walk mode active", {
          description: "Move 3+ meters — waypoint auto-captures every 5 seconds",
          duration: 4e3
        });
      }
    },
    [geo]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col relative", "data-ocid": "measure.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: { bottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapView,
      {
        position: geo.position,
        waypoints,
        isClosed,
        captureMode,
        onAddWaypoint: handleAddWaypoint,
        onClosePlot: handleClosePlot
      }
    ) }),
    geo.position && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute top-3 left-3 z-[1000] hidden sm:block",
        "data-ocid": "measure.gps_coords",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card/90 border border-border rounded-lg px-3 py-2 backdrop-blur-sm",
            style: { boxShadow: "0 2px 8px oklch(0.1 0 0 / 0.5)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "Current Position" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm tabular-nums text-primary", children: geo.position.lat.toFixed(7) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm tabular-nums text-primary", children: geo.position.lon.toFixed(7) }),
              geo.position.altitude !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground", children: [
                "Alt: ",
                (_a = geo.position.altitude) == null ? void 0 : _a.toFixed(1),
                "m"
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MeasurementPanel,
      {
        waypoints,
        isClosed,
        gpsPosition: geo.position,
        gpsAccuracy: ((_b = geo.position) == null ? void 0 : _b.accuracy) ?? null,
        satelliteCount: geo.satelliteCount,
        gpsError: geo.error,
        isTracking: geo.isTracking,
        captureMode,
        onCaptureMode: handleCaptureMode,
        onUndo: handleUndo,
        onClear: handleClear,
        onClosePlot: handleClosePlot,
        onSave: () => setShowSaveDialog(true),
        onStartTracking: geo.startTracking
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SavePlotDialog,
      {
        open: showSaveDialog,
        waypoints,
        onSave: handleSave,
        onClose: () => setShowSaveDialog(false)
      }
    )
  ] });
}
export {
  Measure as default
};

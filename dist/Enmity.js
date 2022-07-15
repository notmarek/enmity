try {
  Promise.resolve()
    .then(function () {
      return Assets$2;
    })
    .then(() => {
      Promise.resolve()
        .then(function () {
          return index$1;
        })
        .then((a) => {
          a.initialize();
        });
    });
} catch (error) {
  alert(`Enmity failed to initialize: ${error.message}`), console.error(error);
}
const modules$1 = {
    Constants: { props: ["ActionTypes"] },
    Clipboard: { props: ["setString", "getString"] },
    Assets: { props: ["registerAsset"] },
    Messages: { props: ["receiveMessage", "sendMessage"] },
    Clyde: { props: ["createBotMessage"] },
    Avatars: { props: ["BOT_AVATARS"] },
    Native: { props: ["NativeModules"], export: "NativeModules" },
    React: { props: ["createElement"] },
    Dispatcher: { props: ["dirtyDispatch"] },
    Storage: { props: ["getItem"] },
    Toasts: {
      props: ["open", "close"],
      ensure: (a) =>
        !a.openLazy &&
        !a.startDrag &&
        !a.init &&
        !a.openReplay &&
        !a.setAlwaysOnTop,
    },
    Dialog: { props: ["show", "openLazy", "close"] },
    Token: { props: ["getToken"] },
    REST: { props: ["getAPIBaseURL"] },
    Settings: { props: ["watchKeys"] },
    Users: { props: ["getCurrentUser"] },
    Navigation: { props: ["pushLazy"] },
    NavigationNative: { props: ["NavigationContainer"] },
    NavigationStack: { props: ["createStackNavigator"] },
    Theme: { props: ["theme"] },
    Linking: { props: ["openURL"] },
    StyleSheet: { props: ["createThemedStyleSheet"] },
    ColorMap: { props: ["ThemeColorMap"] },
    Components: {
      multiple: !0,
      props: {
        Forms: ["Form", "FormSection"],
        General: ["Button", "Text", "View"],
      },
    },
    Locale: { props: ["Messages"] },
    Profiles: { props: ["showUserProfile"] },
    Lodash: { props: ["debounce", "throttle"] },
    Logger: { name: "Logger" },
    Flux: { props: [["Store", "connectStores"], ["useStateFromStoresObject"]] },
    SVG: { props: ["Svg"] },
    Scenes: { name: "getScreens", default: !1 },
    Moment: { props: ["isMoment"] },
  },
  common = {},
  blacklist = [],
  filters = {
    byProps:
      (...a) =>
      (b) =>
        a.every((a) => void 0 !== b[a]),
    byName:
      (a, b = !0) =>
      (c) =>
        !!c &&
        (b
          ? "function" == typeof c && c.name === a
          : "function" == typeof c.default && c.default.name === a),
    byTypeName:
      (a, b = !0) =>
      (c) =>
        !!c &&
        (b
          ? "function" == typeof c && c.name === a
          : "function" == typeof c.default && c.default.type?.name === a),
    byDisplayName:
      (a, b = !0) =>
      (c) =>
        !!c &&
        (b
          ? "function" == typeof c && c.name === a
          : "function" == typeof c.default && c.default.name === a),
  },
  getters = [];
Object.entries(modules$1).map(([b, a]) => {
  if (a.multiple)
    Object.entries(a.props).map(([a, c]) => {
      getters.push({
        id: a,
        filter(a) {
          let b = filters.byProps(...c)(a);
          return b;
        },
        submodule: b,
      });
    });
  else if (a.props) {
    if (a.props.every((a) => Array.isArray(a))) {
      let c = [];
      getters.push({
        id: b,
        filter(d) {
          let b = a.props.some((a) => a.every((a) => d[a]));
          return (!b || !a.ensure || !!a.ensure(d)) && (b && c.push(d), b);
        },
        map: Object.assign({}, ...c),
      });
    } else
      getters.push({
        id: b,
        filter(b) {
          let c = filters.byProps(...a.props)(b);
          return (!c || !a.ensure || !1 !== a.ensure(b)) && c;
        },
        map: a.export,
      });
  } else
    a.displayName
      ? getters.push({
          id: b,
          filter: filters.byDisplayName(a.displayName, a.default),
          map: a.export,
        })
      : a.name
      ? getters.push({
          id: b,
          filter: filters.byName(a.name, a.default),
          map: a.export,
        })
      : a.filter && getters.push({ id: b, filter: a.filter, map: a.export });
});
const results = bulk(...getters.map(({ filter: a }) => a));
function getModule(
  i,
  { all: d = !1, traverse: j = !1, defaultExport: k = !0 } = {}
) {
  if ("function" != typeof i) return null;
  let c = [],
    e = function (a, b) {
      try {
        return i(a, b);
      } catch {
        return !1;
      }
    },
    g = common.Locale && common.Locale.getLocale();
  for (let b in modules) {
    if (blacklist.includes(b)) continue;
    if (!modules[b].isInitialized)
      try {
        __r(b);
      } catch (l) {
        blacklist.push(b);
        continue;
      }
    common.Moment && g && common.Moment.locale(g);
    let a = modules[b].publicModule.exports;
    if (!a || a === window || null === a.ihateproxies) {
      blacklist.push(b);
      continue;
    }
    if ("object" == typeof a) {
      if (e(a, b)) {
        if (!d) return a;
        c.push(a);
      }
      if (a.default && e(a.default, b)) {
        let h = k ? a.default : a;
        if (!d) return h;
        c.push(h);
      }
      if (j && a.__esModule) {
        for (let f in a)
          if (void 0 !== a[f] && e(a[f], b)) {
            if (!d) return a[f];
            c.push(a[f]);
          }
      }
    } else if ("function" == typeof a) {
      if (!e(a, b)) continue;
      if (!d) return a;
      c.push(a);
    }
  }
  return d ? c : c[0];
}
function getModules(a) {
  return getModule(a, { all: !0 });
}
function bulk(...a) {
  let b = new Array(a.length),
    c = a.map((a) => (b) => {
      try {
        return a(b);
      } catch {
        return !1;
      }
    });
  return (
    getModule((e) => {
      for (let d = 0; d < c.length; d++) {
        let f = c[d];
        "function" == typeof f && f(e) && null == b[d] && (b[d] = e);
      }
      return b.filter(String).length === a.length;
    }),
    b
  );
}
function getByProps(...c) {
  let [a, { bulk: d = !1, ...b }] = parseOptions(c);
  if (d) {
    let e = a
      .map((a) =>
        Array.isArray(a) ? filters.byProps(...a) : filters.byProps(a)
      )
      .concat({ ...b });
    return bulk(...e);
  }
  return getModule(filters.byProps(...a), b);
}
function getByDisplayName(...d) {
  let [a, { bulk: e = !1, default: b = !0, ...c }] = parseOptions(d);
  if (e) {
    let f = a.map(filters.byDisplayName).concat({ defaultExport: b, ...c });
    return bulk(...f);
  }
  return getModule(filters.byDisplayName(a[0]), { defaultExport: b, ...c });
}
function getByTypeName(...d) {
  let [a, { bulk: e = !1, default: b = !0, ...c }] = parseOptions(d);
  if (e) {
    let f = a.map(filters.byTypeName).concat({ defaultExport: b, ...c });
    return bulk(...f);
  }
  return getModule(filters.byTypeName(a[0]), { defaultExport: b, ...c });
}
function getByName$1(...d) {
  let [a, { bulk: e = !1, default: b = !0, ...c }] = parseOptions(d);
  if (e) {
    let f = a.map(filters.byName).concat({ defaultExport: b, ...c });
    return bulk(...f);
  }
  return getModule(filters.byName(a[0]), { defaultExport: b, ...c });
}
function getByKeyword(...a) {
  let [[d], { caseSensitive: e = !1, all: b = !1, ...c }] = parseOptions(a);
  return getModule(
    (b) => {
      let c = [...Object.keys(b), ...Object.keys(b.__proto__)];
      for (let a = 0; a < c.length; a++) {
        let f = c[a];
        if (e) {
          if (~f.indexOf(d)) return !0;
        } else {
          let g = d.toLowerCase();
          if (~f.toLowerCase().indexOf(g)) return !0;
        }
      }
      return !1;
    },
    { all: b, ...c }
  );
}
function parseOptions(a, b = (a) => "object" == typeof a && !Array.isArray(a)) {
  return [a, b(a[a.length - 1]) ? a.pop() : {}];
}
getters.map(({ id: c, map: d, submodule: a }, e) => {
  let b = (a) => a;
  if ("string" == typeof d) b = (a) => a[d];
  else if (Array.isArray(d)) {
    let g = {};
    b = (b) => {
      for (let a of d) g[a] = b[a];
      return g;
    };
  }
  if (!results[e]) return;
  let f = b(results[e]);
  a ? ((common[a] ??= {}), (common[a][c] = f)) : (common[c] = f);
});
var Type,
  ApplicationCommandSectionType,
  ApplicationCommandType,
  ApplicationCommandInputType,
  ApplicationCommandPermissionType,
  ApplicationCommandOptionType,
  InteractionTypes,
  Times,
  Modules = Object.freeze({
    __proto__: null,
    common: common,
    blacklist: blacklist,
    filters: filters,
    getModule: getModule,
    getModules: getModules,
    bulk: bulk,
    getByProps: getByProps,
    getByDisplayName: getByDisplayName,
    getByTypeName: getByTypeName,
    getByName: getByName$1,
    getByKeyword: getByKeyword,
  });
const {
  Clipboard,
  Assets: Assets$3,
  Messages,
  Clyde: Clyde$1,
  Avatars,
  Native,
  Dispatcher,
  Storage,
  Toasts,
  Dialog,
  Token,
  REST,
  Settings: Settings$3,
  Users,
  Theme,
  Linking,
  StyleSheet: StyleSheet$1,
  ColorMap,
  Components: Components$1,
  Locale,
  Constants,
  Profiles,
  Logger: Logger$1,
  Lodash,
  Flux,
  SVG,
  Scenes,
  Navigation,
  NavigationNative,
  NavigationStack,
  Moment,
} = common;
common.React;
const patches = [];
function getPatchesByCaller(b) {
  if (!b) return [];
  let c = [];
  for (let a of patches) {
    let e = [...a.patches.before, ...a.patches.instead, ...a.patches.after];
    for (let d of e) d.caller === b && c.push(d);
  }
  return c;
}
function unpatchAll(b) {
  let a = getPatchesByCaller(b);
  if (a.length) for (let c of a) c.unpatch();
}
function override(a) {
  return function () {
    if (
      !a?.patches?.before.length &&
      !a?.patches?.after.length &&
      !a?.patches?.instead.length &&
      !patches.find((b) => b.mdl === a.mdl && b.func === a.func)
    )
      return (
        a.unpatch(),
        new.target
          ? new a.original(...arguments)
          : a.original.apply(this, arguments)
      );
    let c,
      b = arguments,
      k = a.patches.before;
    for (let g = 0; g < k.length; g++) {
      let d = k[g];
      if (d)
        try {
          let l = d.callback(this, b, a.original.bind(this));
          Array.isArray(l) && (b = l), d.once && d.unpatch();
        } catch (p) {
          console.error(
            `Could not fire before patch for ${a.func} of ${d.caller}`
          ),
            console.error(p);
        }
    }
    let h = a.patches.instead;
    if (h.length)
      for (let i = 0; i < h.length; i++) {
        let e = h[i];
        if (e)
          try {
            let m = e.callback(this, b, a.original.bind(this));
            void 0 !== m && (c = m), e.once && e.unpatch();
          } catch (q) {
            console.error(
              `Could not fire instead patch for ${a.func} of ${e.caller}`
            ),
              console.error(q);
          }
      }
    else c = new.target ? new a.original(...b) : a.original.apply(this, b);
    let n = a.patches.after;
    for (let j = 0; j < n.length; j++) {
      let f = n[j];
      if (f)
        try {
          let o = f.callback(this, b, c, (a) => (c = a));
          void 0 !== o && (c = o), f.once && f.unpatch();
        } catch (r) {
          console.error(
            `Could not fire after patch for ${a.func} of ${f.caller}`
          ),
            console.error(r);
        }
    }
    return c;
  };
}
function push([, b, c, , e, f]) {
  let a = {
    mdl: b,
    func: c,
    id: patches?.[e]?.length ?? 0,
    original: b[c],
    once: f,
    unpatch() {
      (a.mdl[a.func] = a.original),
        (a.patches = { before: [], after: [], instead: [] });
    },
    patches: { before: [], after: [], instead: [] },
  };
  b[c] = override(a);
  let d = Object.getOwnPropertyDescriptors(a.original);
  return (
    delete d.length,
    Object.defineProperties(b[c], {
      ...d,
      toString: {
        value: () => a.original.toString(),
        configurable: !0,
        enumerable: !1,
      },
      __original: { value: a.original, configurable: !0, enumerable: !1 },
    }),
    patches.push(a),
    a
  );
}
function get$2([, b, c]) {
  let a = patches.find((a) => a.mdl === b && a.func === c);
  return a || push(...arguments);
}
function patch(c, d, b, e, a = Type.After, h = !1) {
  if (c && "string" == typeof c) {
    if (d && ["function", "object"].includes(typeof d)) {
      if (b && "string" == typeof b) {
        if (e && "function" == typeof e) {
          if (
            a &&
            "string" == typeof a &&
            ["after", "before", "instead"].includes(a)
          ) {
            if (void 0 === d[b])
              throw new ReferenceError(
                `function ${b} does not exist on the second argument (object or function)`
              );
          } else
            throw new TypeError(
              'fifth argument "type" must be of type string and any of the three: after, before, instead'
            );
        } else
          throw new TypeError(
            'fourth argument "callback" must be of type function'
          );
      } else
        throw new TypeError('third argument "func" must be of type string');
    } else
      throw new TypeError(
        'second argument "mdl" must be of type function or object'
      );
  } else throw new TypeError('first argument "caller" must be of type string');
  let f = get$2(arguments),
    g = {
      caller: c,
      once: h,
      type: a,
      id: f.patches?.[a]?.length ?? 0,
      callback: e,
      unpatch() {
        let e = f.patches?.[a].findIndex((a) => a.id === g.id);
        if (
          (~e && f.patches?.[a].splice(e, 1),
          f.patches?.before.length ||
            f.patches?.after.length ||
            f.patches?.instead.length)
        )
          return;
        let c = patches.findIndex((a) => a.mdl == d && a.func == b);
        c && (patches[c]?.unpatch(), patches.splice(c, 1));
      },
    };
  return (f.patches[a] ??= []), f.patches[a].push(g), g.unpatch;
}
function before(a, b, c, d, e = !1) {
  return patch(a, b, c, d, Type.Before, e);
}
function instead(a, b, c, d, e = !1) {
  return patch(a, b, c, d, Type.Instead, e);
}
function after(a, b, c, d, e = !1) {
  return patch(a, b, c, d, Type.After, e);
}
function create(a) {
  return {
    getPatchesByCaller: getPatchesByCaller,
    before: (b, c, d) => before(a, b, c, d),
    instead: (b, c, d) => instead(a, b, c, d),
    after: (b, c, d) => after(a, b, c, d),
    unpatchAll: () => unpatchAll(a),
  };
}
!(function (a) {
  (a.Before = "before"), (a.Instead = "instead"), (a.After = "after");
})(Type || (Type = {}));
var Patcher$4 = { create, before, instead, after, unpatchAll, patches },
  Patcher$5 = Object.freeze({
    __proto__: null,
    create: create,
    before: before,
    instead: instead,
    after: after,
    unpatchAll: unpatchAll,
    patches: patches,
    default: Patcher$4,
  });
const assets = {};
try {
  Patcher$4.after("enmity-assets", Assets$3, "registerAsset", (c, [a], b) => {
    assets[a.name] = { ...a, id: b };
  });
  for (let id1 = 1; ; id1++) {
    let asset = Assets$3.getAssetByID(id1);
    if (!asset) break;
    assets[asset.name] || (assets[asset.name] = { ...asset, id: id1 });
  }
} catch {}
function find(a) {
  return Object.values(assets).find(a);
}
function getByName(a) {
  return assets[a];
}
function getByID(a) {
  return Assets$3.getAssetByID(a);
}
function getIDByName(a) {
  return assets[a]?.id;
}
var Assets$1 = { assets, getByName, getByID, getIDByName },
  Assets$2 = Object.freeze({
    __proto__: null,
    assets: assets,
    find: find,
    getByName: getByName,
    getByID: getByID,
    getIDByName: getIDByName,
    default: Assets$1,
  });
const settings = Settings$3.get("marekenmity") ?? {};
function getSetting(a, b, c) {
  return settings[a]?.[b] ?? c;
}
function get$1(a) {
  return settings[a] ?? {};
}
function getAll() {
  return settings;
}
const Events$2 = {
    ENMITY_GET_SETTING: ({ file: a, setting: b, defaults: c }) =>
      settings[a][b] ?? c,
    ENMITY_SET_SETTING({ file: a, setting: b, value: c }) {
      settings[a] || (settings[a] = {}),
        void 0 == c ? delete settings[a][b] : (settings[a][b] = c);
    },
    ENMITY_TOGGLE_SETTING({ file: a, setting: b, defaults: c }) {
      settings[a] || (settings[a] = {}),
        void 0 === settings[a][b]
          ? (settings[a][b] = !Boolean(c))
          : (settings[a][b] = !Boolean(settings[a][b]));
    },
  },
  store = new Flux.Store(Dispatcher, Events$2);
store.addChangeListener(
  Lodash.debounce(() => Settings$3.set({ enmity: settings }), 200)
);
var Manager = { store, getAll, getSetting, get: get$1 },
  React = common.React;
const listeners = {};
function ENMITY_SET_SETTING(a) {
  return handleSettingsUpdate({ ...a, type: "set" });
}
function ENMITY_TOGGLE_SETTING(a) {
  return handleSettingsUpdate({ ...a, type: "toggle" });
}
function handleSettingsUpdate({ file: b, type: e, ...c }) {
  let a = listeners[b];
  if (a) for (let d of a.values()) d({ ...c });
}
function set(a, b, c) {
  if (a && "string" == typeof a) {
    if (!b || "string" != typeof b)
      throw new TypeError("the second argument setting must be of type string");
  } else throw new TypeError("the first argument file must be of type string");
  return Dispatcher.dirtyDispatch({
    type: "ENMITY_SET_SETTING",
    file: a,
    setting: b,
    value: c,
  });
}
function get(a, b, c) {
  if (a && "string" == typeof a) {
    if (!b || "string" != typeof b)
      throw new TypeError("the second argument setting must be of type string");
  } else throw new TypeError("the first argument file must be of type string");
  return Manager.getSetting(a, b, c);
}
function getBoolean(a, b, c) {
  if (a && "string" == typeof a) {
    if (b && "string" == typeof b) {
      if (void 0 === c || "boolean" != typeof c)
        throw new TypeError(
          "the third argument defaults must be of type boolean"
        );
    } else
      throw new TypeError("the second argument setting must be of type string");
  } else throw new TypeError("the first argument file must be of type string");
  return Boolean(Manager.getSetting(a, b, c));
}
function toggle(a, b, c) {
  if (a && "string" == typeof a) {
    if (b && "string" == typeof b) {
      if (void 0 === c || "boolean" != typeof c)
        throw new TypeError(
          "the third argument defaults must be of type boolean"
        );
    } else
      throw new TypeError("the second argument setting must be of type string");
  } else throw new TypeError("the first argument file must be of type string");
  return Dispatcher.dirtyDispatch({
    type: "ENMITY_TOGGLE_SETTING",
    file: a,
    setting: b,
    defaults: c,
  });
}
function connectComponent(a, c) {
  if (a && ["function", "object"].includes(typeof a)) {
    if (!c || "string" != typeof c)
      throw new TypeError("the second argument file must be of type string");
  } else
    throw new TypeError(
      "the first argument component must be of type function or object"
    );
  let b = (b) => {
    let d = React.useState({})[1];
    return (
      React.useEffect(() => {
        function a() {
          d({});
        }
        return subscribe(c, a), () => unsubscribe(c, a);
      }, []),
      React.createElement(a, { ...b, settings: makeStore(c) })
    );
  };
  return (
    a.displayName && (b.displayName = a.displayName),
    a.name && (b.name = `Connected${a.name}`),
    b
  );
}
function makeStore(a) {
  if (!a || "string" != typeof a)
    throw new TypeError("the first argument file must be of type string");
  return {
    settings: Manager.get(a),
    set: (b, c) => set(a, b, c),
    get: (b, c) => get(a, b, c),
    toggle: (b, c) => toggle(a, b, c),
    getBoolean: (b, c) => getBoolean(a, b, c),
  };
}
function subscribe(a, b) {
  if (a && "string" == typeof a) {
    if (!b || "function" != typeof b)
      throw new TypeError(
        "the second argument callback must be of type function"
      );
  } else throw new TypeError("the first argument file must be of type string");
  (listeners[a] ??= new Set()), listeners[a].add(b);
}
function unsubscribe(a, b) {
  if (a && "string" == typeof a) {
    if (!b || "function" != typeof b)
      throw new TypeError(
        "the second argument callback must be of type function"
      );
  } else throw new TypeError("the first argument file must be of type string");
  listeners[a]?.delete(b), listeners[a]?.size === 0 && delete listeners[a];
}
function connectStores(a, b) {
  if (a && ["function", "object"].includes(typeof a)) {
    if (!b || "string" != typeof b)
      throw new TypeError("the second argument file must be of type string");
  } else
    throw new TypeError(
      "the first argument component must be of type function or object"
    );
  return Flux.connectStores([Manager.store], () => ({
    settings: makeStore(b),
  }))(a);
}
Dispatcher.subscribe("ENMITY_SET_SETTING", ENMITY_SET_SETTING),
  Dispatcher.subscribe("ENMITY_TOGGLE_SETTING", ENMITY_TOGGLE_SETTING);
var Settings$1 = {
    connectComponent,
    connectStores,
    unsubscribe,
    subscribe,
    makeStore,
    listeners,
    toggle,
    get,
    set,
  },
  Settings$2 = Object.freeze({
    __proto__: null,
    listeners: listeners,
    set: set,
    get: get,
    getBoolean: getBoolean,
    toggle: toggle,
    connectComponent: connectComponent,
    makeStore: makeStore,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    connectStores: connectStores,
    default: Settings$1,
    settings: settings,
    store: store,
  });
const Logger = getByName$1("Logger"),
  EnmityLogger = new Logger("MarekEnmity");
let socket;
function connectWebsocket(host) {
  console.log("Connecting to debug WebSocket"),
    void 0 !== socket &&
      socket.readyState !== WebSocket.CLOSED &&
      (socket.close(), (socket = null));
  let address =
    Boolean(Settings$1.get("marekenmity", "autoConnectWS", !1)) &&
    Settings$1.get("marekenmity", "debugWSAddress");
  (address || host) &&
    ((socket = new WebSocket(`ws://${host ?? address}`)).addEventListener(
      "open",
      () => {
        console.log("Connected with debug websocket"),
          Toasts.open({
            content: "Connected to the WebSocket server.",
            source: getIDByName("Check"),
          });
      }
    ),
    socket.addEventListener("error", (a) => {
      console.log(`Error with debug websocket: ${a.message}`),
        Toasts.open({
          content: "An error occured with the websocket connection.",
          source: getIDByName("toast_copy_link"),
        });
    }),
    socket.addEventListener("close", (a) => {
      console.log(`Error with debug websocket: ${a.message}`),
        Toasts.open({
          content: "The websocket connection has been closed.",
          source: getIDByName("toast_copy_link"),
        });
    }),
    socket.addEventListener("message", (message) => {
      try {
        console.log(eval(message.data));
      } catch (e) {
        console.error(e);
      }
    }));
}
function initialize$5() {
  let a = nativeLoggingHook;
  (globalThis.nativeLoggingHook = function (b, c) {
    return (
      socket?.readyState === WebSocket.OPEN &&
        socket.send(JSON.stringify({ level: c, message: b })),
      EnmityLogger.log(b),
      a.apply(this, arguments)
    );
  }),
    Settings$1.get("marekenmity", "autoConnectWS", !1) && connectWebsocket();
}
function sendMessage(a) {
  socket?.readyState === WebSocket.OPEN && socket.send(a);
}
var WebSocket$1 = {
  initialize: initialize$5,
  sendMessage,
  connectWebsocket,
  socket,
};
const {
    Alert,
    Button,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    SectionList,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Touchable,
    View,
    VirtualizedList,
  } = Components$1.General,
  {
    Form,
    FormArrow,
    FormCTA,
    FormCTAButton,
    FormCardSection,
    FormCheckbox,
    FormDivider,
    FormHint,
    FormIcon,
    FormInput,
    FormLabel,
    FormRadio,
    FormRow,
    FormSection,
    FormSelect,
    FormSubLabel,
    FormSwitch,
    FormTernaryCheckBox,
    FormText,
    FormTextColors,
    FormTextSizes,
  } = Components$1.Forms;
var Components = Object.freeze({
  __proto__: null,
  Alert: Alert,
  Button: Button,
  FlatList: FlatList,
  Image: Image,
  ImageBackground: ImageBackground,
  KeyboardAvoidingView: KeyboardAvoidingView,
  Modal: Modal,
  Pressable: Pressable,
  RefreshControl: RefreshControl,
  ScrollView: ScrollView,
  SectionList: SectionList,
  StatusBar: StatusBar,
  StyleSheet: StyleSheet,
  Switch: Switch,
  Text: Text,
  TextInput: TextInput,
  TouchableHighlight: TouchableHighlight,
  TouchableOpacity: TouchableOpacity,
  TouchableWithoutFeedback: TouchableWithoutFeedback,
  Touchable: Touchable,
  View: View,
  VirtualizedList: VirtualizedList,
  Form: Form,
  FormArrow: FormArrow,
  FormCTA: FormCTA,
  FormCTAButton: FormCTAButton,
  FormCardSection: FormCardSection,
  FormCheckbox: FormCheckbox,
  FormDivider: FormDivider,
  FormHint: FormHint,
  FormIcon: FormIcon,
  FormInput: FormInput,
  FormLabel: FormLabel,
  FormRadio: FormRadio,
  FormRow: FormRow,
  FormSection: FormSection,
  FormSelect: FormSelect,
  FormSubLabel: FormSubLabel,
  FormSwitch: FormSwitch,
  FormTernaryCheckBox: FormTernaryCheckBox,
  FormText: FormText,
  FormTextColors: FormTextColors,
  FormTextSizes: FormTextSizes,
});
const Settings = NavigationStack.createStackNavigator(),
  { ThemeColorMap: ThemeColorMap$6 } = ColorMap;
function PluginSettings({
  name: b = "hi",
  children: c = React.createElement(Text, null, "hi"),
} = {}) {
  let a = StyleSheet$1.createThemedStyleSheet({
    container: {
      backgroundColor: ThemeColorMap$6.BACKGROUND_MOBILE_SECONDARY,
      flex: 1,
    },
    cardStyle: {
      backgroundColor: ThemeColorMap$6.BACKGROUND_MOBILE_PRIMARY,
      color: ThemeColorMap$6.TEXT_NORMAL,
    },
    header: {
      backgroundColor: ThemeColorMap$6.BACKGROUND_MOBILE_SECONDARY,
      shadowColor: "transparent",
      elevation: 0,
    },
    headerTitleContainer: { color: ThemeColorMap$6.HEADER_PRIMARY },
    close: { color: ThemeColorMap$6.HEADER_PRIMARY },
  });
  return React.createElement(
    NavigationNative.NavigationContainer,
    null,
    React.createElement(
      Settings.Navigator,
      {
        initialRouteName: b,
        style: a.container,
        screenOptions: {
          cardOverlayEnabled: !1,
          cardShadowEnabled: !1,
          cardStyle: a.cardStyle,
          headerStyle: a.header,
          headerTitleContainerStyle: a.headerTitleContainer,
          headerTitleAlign: "center",
          safeAreaInsets: { top: 0 },
        },
      },
      React.createElement(Settings.Screen, {
        name: b,
        component: c,
        options: {
          headerTitleStyle: { color: "white" },
          headerLeft: () =>
            React.createElement(Button, {
              color: a.close.color,
              title: "Close",
              onPress: () => Navigation.pop(),
            }),
          ...NavigationStack.TransitionPresets.ModalSlideFromBottomIOS,
        },
      })
    )
  );
}
!(function (a) {
  (a[(a.BuiltIn = 0)] = "BuiltIn"),
    (a[(a.Guild = 1)] = "Guild"),
    (a[(a.DM = 2)] = "DM");
})(ApplicationCommandSectionType || (ApplicationCommandSectionType = {})),
  (function (a) {
    (a[(a.Chat = 1)] = "Chat"),
      (a[(a.User = 2)] = "User"),
      (a[(a.Message = 3)] = "Message");
  })(ApplicationCommandType || (ApplicationCommandType = {})),
  (function (a) {
    (a[(a.BuiltIn = 0)] = "BuiltIn"),
      (a[(a.BuiltInText = 1)] = "BuiltInText"),
      (a[(a.BuiltInIntegration = 2)] = "BuiltInIntegration"),
      (a[(a.Bot = 3)] = "Bot"),
      (a[(a.Placeholder = 4)] = "Placeholder");
  })(ApplicationCommandInputType || (ApplicationCommandInputType = {})),
  (function (a) {
    (a[(a.Role = 1)] = "Role"), (a[(a.User = 2)] = "User");
  })(
    ApplicationCommandPermissionType || (ApplicationCommandPermissionType = {})
  ),
  (function (a) {
    (a[(a.SubCommand = 1)] = "SubCommand"),
      (a[(a.SubCommandGroup = 2)] = "SubCommandGroup"),
      (a[(a.String = 3)] = "String"),
      (a[(a.Integer = 4)] = "Integer"),
      (a[(a.Boolean = 5)] = "Boolean"),
      (a[(a.User = 6)] = "User"),
      (a[(a.Channel = 7)] = "Channel"),
      (a[(a.Role = 8)] = "Role"),
      (a[(a.Mentionnable = 9)] = "Mentionnable"),
      (a[(a.Number = 10)] = "Number"),
      (a[(a.Attachment = 11)] = "Attachment");
  })(ApplicationCommandOptionType || (ApplicationCommandOptionType = {})),
  (function (a) {
    (a[(a.ApplicationCommand = 2)] = "ApplicationCommand"),
      (a[(a.MessageComponent = 3)] = "MessageComponent");
  })(InteractionTypes || (InteractionTypes = {}));
const Patcher$3 = create("enmity-commands"),
  [Commands$1, Assets, SearchStore] = bulk(
    filters.byProps("getBuiltInCommands"),
    filters.byProps("getApplicationIconURL"),
    filters.byProps("useSearchManager")
  );
let commands = [];
const section = {
  id: "marekenmity",
  type: 1,
  name: "MarekEnmity",
  icon: "https://files.enmity.app/icon.png",
};
try {
  initialize$4();
} catch (e) {
  console.error("Failed to patch commands: ", e.message);
}
function registerCommands(c, a) {
  if (c && "string" == typeof c) {
    if (!a || !Array.isArray(a))
      throw new TypeError("second argument cmds must be of type array");
  } else throw new TypeError("first argument caller must be of type string");
  for (let d in a) {
    let b = a[d];
    a[d] = {
      displayName: b.name,
      displayDescription: b.description,
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,
      id: `enmity-${b.name.replaceAll(" ", "-")}`,
      applicationId: section.id,
      ...b,
      __enmity: !0,
      caller: c,
    };
  }
  commands.push(...a);
}
function unregisterCommands(a) {
  if (!a || "string" != typeof a)
    throw new TypeError("first argument caller must be of type string");
  commands = commands.filter((b) => b.caller !== a);
}
function initialize$4() {
  (Commands$1.BUILT_IN_SECTIONS.enmity = section),
    Patcher$3.after(
      SearchStore.default,
      "getQueryCommands",
      (d, [, , b], a) => {
        if (!(!b || b.startsWith("/"))) {
          for (let c of ((a ??= []), commands))
            if (
              !(
                !~c.name?.indexOf(b) ||
                a.some((a) => a.__enmity && a.id === c.id)
              )
            )
              try {
                a.unshift(c);
              } catch {
                a = [...a, c];
              }
        }
      }
    ),
    Patcher$3.instead(
      SearchStore.default,
      "getApplicationSections",
      (d, b, c) => {
        try {
          let a = c.apply(self, b) ?? [];
          return a.find((a) => a.id === section.id) || a.push(section), a;
        } catch {
          return [];
        }
      }
    ),
    Patcher$3.after(SearchStore, "useSearchManager", (f, [, d], a) => {
      if (1 !== d) return;
      if (
        (a.sectionDescriptors?.find?.((a) => a.id === section.id) ||
          ((a.sectionDescriptors ??= []), a.sectionDescriptors.push(section)),
        (a.filteredSectionId && a.filteredSectionId !== section.id) ||
          a.activeSections.find((a) => a.id === section.id) ||
          a.activeSections.push(section),
        commands.some((b) => !a.commands?.find?.((a) => a.id === b.id)))
      ) {
        a.commands ??= [];
        let e = [...a.commands, ...commands];
        a.commands = [...new Set(e).values()];
      }
      (a.filteredSectionId && a.filteredSectionId !== section.id) ||
        a.commandsByActiveSection.find((a) => a.section.id === section.id) ||
        a.commandsByActiveSection.push({ section: section, data: commands });
      let b = a.commandsByActiveSection.find(
        (a) => a.section.id === section.id
      );
      (!a.filteredSectionId || a.filteredSectionId === section.id) &&
        b &&
        0 === b.data.length &&
        0 !== commands.length &&
        (b.data = commands);
      let c = a.sectionDescriptors.filter((a) => "-1" === a.id);
      c.length > 1 &&
        ((a.sectionDescriptors = a.sectionDescriptors.filter(
          (a) => "-1" !== a.id
        )),
        a.sectionDescriptors.push(c.find((a) => "-1" === a.id)));
    }),
    Patcher$3.after(Assets, "getApplicationIconURL", (b, [a], c) => {
      if ("marekenmity" === a.id) return section.icon;
    });
}
var Commands$2 = Object.freeze({
  __proto__: null,
  section: section,
  registerCommands: registerCommands,
  unregisterCommands: unregisterCommands,
});
function uuid(c = 10) {
  let a = "";
  do {
    let b = (16 * Math.random()) | 0;
    a += (12 == a.length ? 4 : 16 == a.length ? (3 & b) | 8 : b).toString(16);
  } while (a.length < c);
  return a;
}
const replies = {};
function sendCommand(a, b, d) {
  let c = uuid();
  Linking.openURL(
    `com.hammerandchisel.discord://enmity?id=${c}&command=${a}&params=${b.join(
      ","
    )}`
  ).then(() => {
    d && (replies[c] = d);
  });
}
Linking.addEventListener("url", (c) => {
  let b = c.url;
  b = decodeURIComponent(b.replace("com.hammerandchisel.discord://", ""));
  try {
    let a = JSON.parse(b);
    if (void 0 === a.data) return;
    replies[a.id] && (replies[a.id](a.data), delete replies[a.id]);
  } catch (d) {
    return;
  }
});
const EventEmitter$1 = getByProps("EventEmitter").EventEmitter;
let plugins$1 = [],
  enabled = window.plugins.enabled,
  disabled = window.plugins.disabled;
const Events$1 = new EventEmitter$1();
function registerPlugin(a) {
  a &&
    "object" == typeof a &&
    ((a.onEnable = () => {
      try {
        a.onStart(),
          a.commands && registerCommands(a.name, a.commands),
          console.log(`${a.name} has been enabled`);
      } catch (b) {
        console.log(`${a.name} failed to load`, b.message);
      }
    }),
    (a.onDisable = () => {
      try {
        if (a.patches) for (let b of a.patches) b.unpatchAll();
        a.commands && unregisterCommands(a.name),
          a.onStop(),
          console.log(`${a.name} has been disabled`);
      } catch (c) {
        console.log(`${a.name} failed to disable`, c.message);
      }
    }),
    enabled.includes(a.name) && a.onEnable(),
    disabled.includes(a.name) && a.onDisable(),
    getPlugin(a.name) || plugins$1.push(a));
}
const on$1 = Events$1.on.bind(Events$1),
  once$1 = Events$1.once.bind(Events$1),
  off$1 = Events$1.off.bind(Events$1);
function getPlugin(a) {
  return plugins$1.find((b) => b.name === a);
}
function getPlugins() {
  return plugins$1;
}
function getEnabledPlugins() {
  return enabled;
}
function getDisabledPlugins() {
  return disabled;
}
function disablePlugin$1(a, b = !1, e) {
  if (enabled.includes(a)) {
    let c = enabled.indexOf(a);
    ~c && enabled.splice(c, 1);
  }
  if (b && disabled.includes(a)) {
    let d = disabled.indexOf(a);
    ~d && disabled.splice(d, 1);
  }
  return (
    b || disabled.push(a),
    getPlugin(a).onDisable(),
    new Promise((b) => {
      sendCommand("disable-plugin", [a], (...a) => {
        e && e(...a), b(...a);
      });
    })
  );
}
function enablePlugin(a, c) {
  if (disabled.includes(a)) {
    let b = disabled.indexOf(a);
    ~b && disabled.splice(b, 1);
  }
  return (
    enabled.push(a),
    getPlugin(a).onEnable(),
    new Promise((b) => {
      sendCommand("enable-plugin", [a], (...a) => {
        c && c(...a), b(...a);
      });
    })
  );
}
async function evalPlugin(url, enable = !1, update) {
  try {
    let response = await REST.get(url),
      code = response.text,
      name = url.split("/").pop().split(".")[0],
      id = Number(Object.keys(window.modules).pop()) + 1,
      wrapper = `__d(function(...args) {
        try {
          ${code}
        } catch(err) {
          console.log(err);
        }
      }, ${id}, []);
      __r(${id})`;
    try {
      eval(wrapper),
        enable && !enabled.includes(name) && (await enablePlugin(name));
    } catch (e) {
      console.log("Failed to eval plugin instance", e.message);
    }
    return update && update(), name;
  } catch (e) {
    console.log("Failed to eval plugin instance", e.message);
  }
}
function installPlugin(a, b, c) {
  let d = a.split("/").pop().split(".")[0];
  return new Promise((e) => {
    sendCommand("install-plugin", [a], (g) => {
      function f() {
        evalPlugin(a, !0).then((f) => {
          let d = { name: f, data: g, url: a };
          Events$1.emit("installed"), b && b(d), c(), e(d);
        });
      }
      return "overridden_plugin" === g ? disablePlugin$1(d, !0).then(f) : f();
    });
  });
}
function uninstallPlugin(a, b) {
  return new Promise((c) => {
    disablePlugin$1(a),
      sendCommand("uninstall-plugin", [a], (d) => {
        (enabled = enabled.filter((b) => b !== a)),
          (disabled = disabled.filter((b) => b !== a));
        let e = plugins$1.findIndex((b) => b.name === a);
        e > -1 && plugins$1.splice(e, 1),
          Events$1.emit("uninstalled"),
          b && b(d),
          c(d);
      });
  });
}
var Plugins = Object.freeze({
  __proto__: null,
  registerPlugin: registerPlugin,
  on: on$1,
  once: once$1,
  off: off$1,
  getPlugin: getPlugin,
  getPlugins: getPlugins,
  getEnabledPlugins: getEnabledPlugins,
  getDisabledPlugins: getDisabledPlugins,
  disablePlugin: disablePlugin$1,
  enablePlugin: enablePlugin,
  evalPlugin: evalPlugin,
  installPlugin: installPlugin,
  uninstallPlugin: uninstallPlugin,
});
const { ThemeColorMap: ThemeColorMap$5 } = ColorMap;
function Authors({ authors: a }) {
  if (!a || !Array.isArray(a) || !a.length) return null;
  let b = StyleSheet$1.createThemedStyleSheet({
    linkless: {
      color: ThemeColorMap$5.HEADER_SECONDARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      display: "flex",
      fontSize: 16,
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center",
    },
    link: {
      color: ThemeColorMap$5.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      display: "flex",
      alignItems: "center",
      fontSize: 16,
      alignSelf: "center",
      justifyContent: "center",
    },
  });
  return React.createElement(
    View,
    { style: b.container },
    a
      .map((c, e) => {
        let d = e !== a.length - 1;
        return "string" == typeof c
          ? React.createElement(Text, { style: b.linkless }, c, d && ",")
          : "object" == typeof c && c.name && !c.id
          ? React.createElement(Text, { style: b.linkless }, c.name, d && ",")
          : "object" == typeof c && c.name && c.id
          ? React.createElement(
              TouchableOpacity,
              {
                key: c.id,
                onPress: () => Profiles.showUserProfile({ userId: c.id }),
              },
              React.createElement(Text, { style: b.link }, c.name, d && ",")
            )
          : null;
      })
      .filter(Boolean)
  );
}
const { createThemedStyleSheet: createThemedStyleSheet$1 } = StyleSheet$1,
  { ThemeColorMap: ThemeColorMap$4 } = ColorMap;
function PluginCard({ plugin: a }) {
  let c = getEnabledPlugins(),
    [d, e] = React.useState(c.includes(a.name)),
    b = StyleSheet$1.createThemedStyleSheet({
      container: {
        backgroundColor: ThemeColorMap$4.BACKGROUND_SECONDARY,
        borderRadius: 5,
        borderLeftColor: a.color ?? "#524FBF",
        borderLeftWidth: 5,
        marginBottom: 15,
      },
      name: {
        color: ThemeColorMap$4.HEADER_PRIMARY,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        fontSize: 16,
      },
      version: {
        color: ThemeColorMap$4.HEADER_SECONDARY,
        fontSize: 16,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        marginLeft: 2.5,
        marginRight: 2.5,
      },
      content: {
        height: "auto",
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      },
      actions: {
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
      },
      description: {
        color: ThemeColorMap$4.HEADER_SECONDARY,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      },
      info: {
        marginLeft: -6,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
      },
      delete: { marginRight: 7.5 },
      trashIcon: {
        width: 22,
        height: 22,
        tintColor: ThemeColorMap$4.INTERACTIVE_NORMAL,
      },
      settingsIcon: {
        width: 22,
        height: 22,
        tintColor: ThemeColorMap$4.INTERACTIVE_NORMAL,
      },
    }),
    f = a.getSettingsPanel;
  return React.createElement(
    View,
    { style: b.container },
    React.createElement(
      View,
      null,
      React.createElement(FormRow, {
        label: () =>
          React.createElement(
            View,
            { style: b.info },
            React.createElement(
              Text,
              { adjustsFontSizeToFit: !0, style: b.name },
              a.name
            ),
            a.version &&
              React.createElement(
                Text,
                { adjustsFontSizeToFit: !0, style: b.version },
                a.version,
                " ",
                a.authors && "by"
              ),
            React.createElement(Authors, { authors: a.authors })
          ),
        trailing: () =>
          React.createElement(
            View,
            { style: b.actions },
            f &&
              React.createElement(
                TouchableOpacity,
                {
                  style: b.delete,
                  onPress() {
                    Navigation.push(PluginSettings, {
                      name: a.name,
                      children: connectComponent(f, a.name),
                    });
                  },
                },
                React.createElement(Image, {
                  style: b.settingsIcon,
                  source: Assets$1.getIDByName("settings"),
                })
              ),
            React.createElement(
              TouchableOpacity,
              { style: b.delete, onPress: () => void uninstallPlugin(a.name) },
              React.createElement(Image, {
                style: b.trashIcon,
                source: Assets$1.getIDByName("ic_trash_filled_16px"),
              })
            ),
            React.createElement(FormSwitch, {
              value: d,
              onValueChange(b) {
                e(b),
                  Toasts.open({
                    content: `${a.name} has been ${
                      b ? "enabled" : "disabled"
                    }.`,
                  }),
                  b ? enablePlugin(a.name) : disablePlugin$1(a.name);
              },
            })
          ),
      })
    ),
    React.createElement(
      View,
      { style: b.content },
      React.createElement(
        Text,
        { style: b.description },
        a.description ?? "No description provided."
      )
    )
  );
}
function HeaderRight$2() {
  let a = createThemedStyleSheet$1({
    header: {
      tintColor: ThemeColorMap$4.HEADER_PRIMARY,
      marginRight: 15,
      width: 18,
      height: 18,
    },
    wrapper: { marginRight: 15, width: 32, height: 32 },
  });
  return React.createElement(
    TouchableOpacity,
    {
      styles: a.wrapper,
      onPress() {
        Alert.prompt(
          "Install a plugin",
          "Please enter the URL of the plugin to install.",
          (a) => {
            if (!a.endsWith("js"))
              return Toasts.open({
                content: "Invalid URL for theme",
                source: Assets$1.getIDByName("ic_close_16px"),
              });
            installPlugin(a, ({ data: b }) => {
              let a = { icon: null, text: null };
              switch (b) {
                case "fucky_wucky":
                  (a.text = "Failed plugin installation."),
                    (a.icon = Assets$1.getIDByName("ic_close_16px"));
                  break;
                case "installed_plugin":
                  (a.text = "Plugin has been installed."),
                    (a.icon = Assets$1.getIDByName("Check"));
                  break;
                case "overridden_plugin":
                  (a.text = "Plugin has been overriden."),
                    (a.icon = Assets$1.getIDByName("Check"));
              }
              Toasts.open({ content: a.text, source: a.icon });
            });
          }
        );
      },
    },
    React.createElement(Image, {
      style: a.header,
      source: Assets$1.getIDByName("add_white"),
    })
  );
}
const Search$1 = getModule((a) => "StaticSearchBarContainer" === a.name);
function Page$2() {
  let f = React.useState(null)[1],
    [b, g] = React.useState(
      getPlugins().sort((a, b) => a.name.localeCompare(b.name))
    ),
    [e, h] = React.useState(!1),
    [c, i] = React.useState(null);
  React.useEffect(() => {
    function a() {
      f({});
    }
    return (
      on$1("installed", a),
      on$1("uninstalled", a),
      () => {
        off$1("installed", a), off$1("uninstalled", a);
      }
    );
  }, []);
  let d = c
      ? b.filter(
          (a) =>
            !!(
              a.name.toLowerCase().includes(c.toLowerCase()) ||
              a.description?.toLowerCase().includes(c.toLowerCase()) ||
              a.authors?.find?.((a) =>
                (a.name ?? a).toLowerCase().includes(c.toLowerCase())
              )
            )
        )
      : b,
    a = createThemedStyleSheet$1({
      container: { flex: 1, padding: 5 },
      notFound: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: "50%",
      },
      notFoundText: {
        marginTop: 10,
        color: ThemeColorMap$4.TEXT_MUTED,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        textAlign: "center",
      },
      search: {
        margin: 0,
        marginBottom: 0,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: "none",
        borderBottomWidth: 0,
        background: "none",
      },
    });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Search$1, {
      style: a.search,
      placeholder: "Search plugins...",
      onChangeText: (a) => i(a),
    }),
    React.createElement(
      View,
      { style: a.container },
      React.createElement(
        ScrollView,
        {
          style: a.container,
          refreshControl: React.createElement(RefreshControl, {
            refreshing: e,
            onRefresh() {
              h(!0), g(getPlugins()), h(!1);
            },
          }),
        },
        d.length
          ? d.map((a) => React.createElement(PluginCard, { plugin: a }))
          : c
          ? React.createElement(
              View,
              { style: a.notFound },
              React.createElement(Image, {
                source: Assets$1.getIDByName("img_no_results_dark"),
              }),
              React.createElement(
                Text,
                { style: a.notFoundText },
                "We searched far and wide."
              ),
              React.createElement(
                Text,
                { style: { ...a.notFoundText, marginTop: 0 } },
                "Unfortunately, no results were found."
              )
            )
          : React.createElement(
              View,
              { style: a.notFound },
              React.createElement(Image, {
                source: Assets$1.getIDByName("img_connection_empty_dark"),
              }),
              React.createElement(
                Text,
                { style: a.notFoundText },
                "You don't have any plugins."
              ),
              React.createElement(
                Text,
                { style: { ...a.notFoundText, marginTop: 0 } },
                "Install some by clicking the + icon!"
              )
            )
      )
    )
  );
}
let theme = window.themes?.theme ?? "",
  themes$1 = window.themes?.list ?? [];
const EventEmitter = getByProps("EventEmitter").EventEmitter,
  Events = new EventEmitter(),
  on = Events.on.bind(Events),
  once = Events.once.bind(Events),
  off = Events.off.bind(Events);
function getTheme() {
  return theme;
}
function getThemeByName(a) {
  return themes$1.find((b) => b.name === a);
}
function listThemes() {
  return themes$1;
}
async function installTheme(a, b) {
  return new Promise((c) => {
    sendCommand("install-theme", [a], (d) => {
      REST.get(a).then((h) => {
        let e = JSON.parse(h.text);
        if (!e) throw new Error("Invalid theme structure");
        let f = themes$1.findIndex((a) => a.name === e.name);
        f > -1 && themes$1.splice(f, 1), themes$1.push(e);
        let g = { theme: e, url: a, data: d, restart: getTheme() === e.name };
        b && b(g), Events.emit("installed"), c(g);
      });
    });
  });
}
function applyTheme(a, b) {
  return new Promise((c) => {
    sendCommand("apply-theme", [a, Theme.theme], (d) => {
      (theme = a), b && b(d), Events.emit("applied", a), c(d);
    });
  });
}
function removeTheme(a) {
  return new Promise((b) => {
    sendCommand("remove-theme", [], (c) => {
      (theme = ""), a && a(c), Events.emit("removed"), b(c);
    });
  });
}
async function uninstallTheme(a, b) {
  return (
    getTheme() === a && removeTheme(),
    new Promise((c) => {
      sendCommand("uninstall-theme", [a], (d) => {
        let e = themes$1.findIndex((b) => b.name === a);
        e > -1 && themes$1.splice(e, 1),
          Events.emit("uninstalled"),
          b && b(d),
          c(d);
      });
    })
  );
}
var Themes = Object.freeze({
  __proto__: null,
  on: on,
  once: once,
  off: off,
  getTheme: getTheme,
  getThemeByName: getThemeByName,
  listThemes: listThemes,
  installTheme: installTheme,
  applyTheme: applyTheme,
  removeTheme: removeTheme,
  uninstallTheme: uninstallTheme,
});
const reload = Native.BundleUpdaterManager.reload,
  version = Native.InfoDictionaryManager.Version,
  os = Native.DCDDeviceManager.systemVersion,
  build = Native.InfoDictionaryManager.Build,
  device = Native.DCDDeviceManager.device,
  { createThemedStyleSheet } = StyleSheet$1,
  { ThemeColorMap: ThemeColorMap$3 } = ColorMap;
function ThemeCard({ theme: a }) {
  let c = getTheme(),
    [d, e] = React.useState(c === a.name),
    b = StyleSheet$1.createThemedStyleSheet({
      container: {
        backgroundColor: ThemeColorMap$3.BACKGROUND_SECONDARY,
        borderRadius: 5,
        borderLeftColor: a.color ?? "#524FBF",
        borderLeftWidth: 5,
        marginBottom: 15,
      },
      name: {
        color: ThemeColorMap$3.HEADER_PRIMARY,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        fontSize: 16,
      },
      version: {
        color: ThemeColorMap$3.HEADER_SECONDARY,
        fontSize: 16,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        marginLeft: 2.5,
        marginRight: 2.5,
      },
      content: {
        height: "auto",
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      },
      actions: {
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center",
      },
      description: {
        color: ThemeColorMap$3.HEADER_SECONDARY,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      },
      info: {
        marginLeft: -6,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
      },
      delete: { marginRight: 7.5 },
      trashIcon: {
        width: 22,
        height: 22,
        tintColor: ThemeColorMap$3.INTERACTIVE_NORMAL,
      },
    });
  return React.createElement(
    View,
    { style: b.container },
    React.createElement(
      View,
      null,
      React.createElement(FormRow, {
        label: () =>
          React.createElement(
            View,
            { style: b.info },
            React.createElement(
              Text,
              { adjustsFontSizeToFit: !0, style: b.name },
              a.name
            ),
            a.version &&
              React.createElement(
                Text,
                { adjustsFontSizeToFit: !0, style: b.version },
                a.version,
                " ",
                a.authors && "by"
              ),
            React.createElement(Authors, { authors: a.authors })
          ),
        trailing: () =>
          React.createElement(
            View,
            { style: b.actions },
            React.createElement(
              TouchableOpacity,
              {
                style: b.delete,
                onPress() {
                  uninstallTheme(a.name, () => {
                    d &&
                      Dialog.show({
                        title: "Theme Uninstalled",
                        body: "Uninstalling the theme you previously had applied requires a restart, would you like to restart Discord to remove the theme?",
                        confirmText: "Yes",
                        cancelText: "No",
                        onConfirm: reload,
                      });
                  });
                },
              },
              React.createElement(Image, {
                style: b.trashIcon,
                source: Assets$1.getIDByName("ic_trash_filled_16px"),
              })
            ),
            React.createElement(FormSwitch, {
              value: d,
              onValueChange(b) {
                e(b),
                  Toasts.open({
                    content: `${a.name} has been ${
                      b ? "enabled" : "disabled"
                    }.`,
                  }),
                  b
                    ? (applyTheme(a.name),
                      Dialog.show({
                        title: "Theme Applied",
                        body: "Applying a theme requires a restart, would you like to restart Discord to apply the theme?",
                        confirmText: "Yes",
                        cancelText: "No",
                        onConfirm: reload,
                      }))
                    : (removeTheme(),
                      Dialog.show({
                        title: "Theme Removed",
                        body: "Removing the applied theme requires a restart, would you like to restart Discord to remove the applied theme?",
                        confirmText: "Yes",
                        cancelText: "No",
                        onConfirm: reload,
                      }));
              },
            })
          ),
      })
    ),
    React.createElement(
      View,
      { style: b.content },
      React.createElement(
        Text,
        { style: b.description },
        a.description ?? "No description provided."
      )
    )
  );
}
function HeaderRight$1() {
  let a = createThemedStyleSheet({
    header: {
      tintColor: ThemeColorMap$3.HEADER_PRIMARY,
      marginRight: 15,
      width: 18,
      height: 18,
    },
    wrapper: { marginRight: 15, width: 32, height: 32 },
  });
  return React.createElement(
    TouchableOpacity,
    {
      styles: a.wrapper,
      onPress() {
        Alert.prompt(
          "Install a theme",
          "Please enter the URL of a theme to install.",
          (a) => {
            if (!a.endsWith("json"))
              return Toasts.open({
                content: "Invalid URL for theme",
                source: Assets$1.getIDByName("ic_close_16px"),
              });
            try {
              installTheme(a, ({ data: c, restart: b }) => {
                let a = { icon: null, text: null, restart: !1 };
                switch (c) {
                  case "fucky_wucky":
                    (a.text = "Failed theme installation."),
                      (a.icon = Assets$1.getIDByName("ic_close_16px"));
                    break;
                  case "installed_theme":
                    (a.text = "Theme has been installed."),
                      (a.icon = Assets$1.getIDByName("Check")),
                      (a.restart = b);
                    break;
                  case "overridden_theme":
                    (a.text = "Theme has been overriden."),
                      (a.icon = Assets$1.getIDByName("Check")),
                      (a.restart = b);
                }
                if (
                  (Toasts.open({ content: a.text, source: a.icon }), a.restart)
                )
                  return Dialog.show({
                    title: "Theme Replaced",
                    body: "Replacing the theme you previously had applied requires a restart, would you like to restart Discord to reload the theme values?",
                    confirmText: "Yes",
                    cancelText: "No",
                    onConfirm: reload,
                  });
              });
            } catch (b) {
              Toasts.open({ content: b.message });
            }
          }
        );
      },
    },
    React.createElement(Image, {
      style: a.header,
      source: Assets$1.getIDByName("add_white"),
    })
  );
}
const Search = getModule((a) => "StaticSearchBarContainer" === a.name);
function Page$1() {
  let f = React.useState(null)[1],
    [b, g] = React.useState(
      listThemes().sort((a, b) => a.name.localeCompare(b.name))
    ),
    [e, h] = React.useState(!1),
    [c, i] = React.useState(null);
  React.useEffect(() => {
    function a() {
      f({});
    }
    return (
      on("installed", a),
      on("uninstalled", a),
      () => {
        off("installed", a), off("uninstalled", a);
      }
    );
  }, []);
  let d = c
      ? b.filter(
          (a) =>
            !!(
              a.name.toLowerCase().includes(c.toLowerCase()) ||
              a.description?.toLowerCase().includes(c.toLowerCase()) ||
              a.authors?.find?.((a) =>
                (a.name ?? a).toLowerCase().includes(c.toLowerCase())
              )
            )
        )
      : b,
    a = createThemedStyleSheet({
      container: { flex: 1, padding: 5 },
      notFound: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: "50%",
      },
      notFoundText: {
        marginTop: 10,
        color: ThemeColorMap$3.TEXT_MUTED,
        fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
        textAlign: "center",
      },
      search: {
        margin: 0,
        marginBottom: 0,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: "none",
        borderBottomWidth: 0,
        background: "none",
      },
    });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Search, {
      style: a.search,
      placeholder: "Search themes...",
      onChangeText: (a) => i(a),
    }),
    React.createElement(
      View,
      { style: a.container },
      React.createElement(
        ScrollView,
        {
          style: a.container,
          refreshControl: React.createElement(RefreshControl, {
            refreshing: e,
            onRefresh() {
              h(!0), g(listThemes()), h(!1);
            },
          }),
        },
        d.length
          ? d.map((a) => React.createElement(ThemeCard, { theme: a }))
          : c
          ? React.createElement(
              View,
              { style: a.notFound },
              React.createElement(Image, {
                source: Assets$1.getIDByName("img_no_results_dark"),
              }),
              React.createElement(
                Text,
                { style: a.notFoundText },
                "We searched far and wide."
              ),
              React.createElement(
                Text,
                { style: { ...a.notFoundText, marginTop: 0 } },
                "Unfortunately, no results were found."
              )
            )
          : React.createElement(
              View,
              { style: a.notFound },
              React.createElement(Image, {
                source: Assets$1.getIDByName("img_connection_empty_dark"),
              }),
              React.createElement(
                Text,
                { style: a.notFoundText },
                "You don't have any themes."
              ),
              React.createElement(
                Text,
                { style: { ...a.notFoundText, marginTop: 0 } },
                "Install some by clicking the + icon!"
              )
            )
      )
    )
  );
}
function _extends$1() {
  return (_extends$1 =
    Object.assign ||
    function (d) {
      for (var a = 1; a < arguments.length; a++) {
        var b = arguments[a];
        for (var c in b)
          Object.prototype.hasOwnProperty.call(b, c) && (d[c] = b[c]);
      }
      return d;
    }).apply(this, arguments);
}
const { ThemeColorMap: ThemeColorMap$2 } = ColorMap;
function PluginIcon({ height: a, width: b, ...c }) {
  let d = StyleSheet$1.createThemedStyleSheet({
    icon: {
      color: ThemeColorMap$2.INTERACTIVE_NORMAL,
      opacity: 0.75,
      marginLeft: 0.5,
    },
  });
  return React.createElement(
    SVG.Svg,
    _extends$1(
      {
        viewBox: "0 0 24 24",
        style: { height: a, width: b, ...d.icon },
        fill: "currentColor",
      },
      c
    ),
    React.createElement(SVG.Path, { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement(SVG.Path, {
      d: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
    })
  );
}
function _extends() {
  return (_extends =
    Object.assign ||
    function (d) {
      for (var a = 1; a < arguments.length; a++) {
        var b = arguments[a];
        for (var c in b)
          Object.prototype.hasOwnProperty.call(b, c) && (d[c] = b[c]);
      }
      return d;
    }).apply(this, arguments);
}
const { ThemeColorMap: ThemeColorMap$1 } = ColorMap;
function ThemeIcon({ height: a, width: b, ...c }) {
  let d = StyleSheet$1.createThemedStyleSheet({
    icon: {
      color: ThemeColorMap$1.INTERACTIVE_NORMAL,
      opacity: 0.75,
      marginLeft: 0.5,
    },
  });
  return React.createElement(
    SVG.Svg,
    _extends(
      {
        viewBox: "0 0 24 24",
        style: { height: a, width: b, ...d.icon },
        fill: "currentColor",
      },
      c
    ),
    React.createElement(SVG.Path, { d: "M0 0h24v24H0z", fill: "none" }),
    React.createElement(SVG.Path, {
      d: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    })
  );
}
const ThemeColorMap = ColorMap.ThemeColorMap,
  Invites = getByProps("acceptInviteAndTransitionToInviteChannel");
function HeaderRight() {
  return null;
}
function Page({ settings: b }) {
  let c = StyleSheet$1.createThemedStyleSheet({
      debugText: { color: ThemeColorMap.TEXT_MUTED },
    }),
    a = {
      Twitter: getIDByName("img_account_sync_twitter_white"),
      GitHub: getIDByName("img_account_sync_github_white"),
      Addon: getIDByName("img_nitro_increase_guild_limit"),
      Checkmark: getIDByName("Check"),
      Discord: getIDByName("Discord"),
      Refresh: getIDByName("ic_sync_24px"),
    },
    d = [...window.plugins.enabled, ...window.plugins.disabled],
    e = listThemes().map((a) => a.name);
  return React.createElement(
    ScrollView,
    null,
    React.createElement(
      KeyboardAvoidingView,
      {
        enabled: !0,
        behavior: "position",
        style: c.container,
        keyboardVerticalOffset: 100,
        contentContainerStyle: { backfaceVisibility: "hidden" },
      },
      React.createElement(
        FormSection,
        { title: "Links" },
        React.createElement(FormRow, {
          label: "Discord Server",
          leading: React.createElement(FormRow.Icon, { source: a.Discord }),
          trailing: FormRow.Arrow,
          onPress: () =>
            Invites.acceptInviteAndTransitionToInviteChannel("enmityapp"),
        }),
        React.createElement(FormRow, {
          label: "GitHub",
          leading: React.createElement(FormRow.Icon, { source: a.GitHub }),
          trailing: FormRow.Arrow,
          onPress: () => Linking.openURL("https://github.com/enmity-mod"),
        }),
        React.createElement(FormRow, {
          label: "Twitter",
          leading: React.createElement(FormRow.Icon, { source: a.Twitter }),
          trailing: FormRow.Arrow,
          onPress: () => Linking.openURL("https://twitter.com/EnmityApp"),
        })
      ),
      React.createElement(
        FormSection,
        { title: "Debug" },
        React.createElement(FormRow, {
          label: "Discord Version",
          leading: React.createElement(FormRow.Icon, { source: a.Discord }),
          trailing: () =>
            React.createElement(Text, { style: c.debugText }, version),
          onPress() {
            Toasts.open({
              content: "Copied to clipboard",
              source: a.Checkmark,
            }),
              Clipboard.setString(version);
          },
        }),
        React.createElement(FormRow, {
          label: "Enmity Version",
          leading: React.createElement(FormRow.Icon, {
            source: { uri: "https://files.enmity.app/icon-64.png" },
          }),
          trailing: () =>
            React.createElement(
              Text,
              { style: c.debugText },
              window.enmity.version
            ),
          onPress: () =>
            Linking.openURL(
              `https://github.com/enmity-mod/enmity/commit/${window.enmity.version}`
            ),
        }),
        React.createElement(FormRow, {
          label: "Installed Plugins",
          leading: React.createElement(PluginIcon, { width: 24, height: 24 }),
          trailing: () =>
            React.createElement(Text, { style: c.debugText }, d.length),
          onPress() {
            Toasts.open({
              content: "Copied to clipboard",
              source: a.Checkmark,
            }),
              Clipboard.setString(`**Plugins**: ${d.join(", ")}`);
          },
        }),
        React.createElement(FormRow, {
          label: "Installed Themes",
          leading: React.createElement(ThemeIcon, { width: 24, height: 24 }),
          trailing: () =>
            React.createElement(Text, { style: c.debugText }, e.length),
          onPress() {
            Toasts.open({
              content: "Copied to clipboard",
              source: a.Checkmark,
            }),
              Clipboard.setString(`**Themes**: ${e.join(", ")}`);
          },
        }),
        React.createElement(FormRow, {
          label: "Reload Discord",
          leading: React.createElement(FormRow.Icon, { source: a.Refresh }),
          onPress() {
            Dialog.show({
              title: "Are You Sure?",
              body: "Are you sure you want to reload the discord app? This might crash your app instead of reloading it.",
              confirmText: "Yes",
              cancelText: "No",
              onConfirm: reload,
            });
          },
        }),
        React.createElement(FormRow, {
          label: "Automatically connect to debug websocket",
          trailing: React.createElement(FormSwitch, {
            value: b.getBoolean("autoConnectWS", !1),
            onValueChange() {
              b.toggle("autoConnectWS", !1),
                b.get("autoConnectWS", !1)
                  ? connectWebsocket()
                  : socket.close();
            },
          }),
        }),
        b.getBoolean("autoConnectWS", !1) &&
          React.createElement(FormInput, {
            value: b.get("debugWSAddress", "192.168.0.1:9090"),
            onChange: (a) => b.set("debugWSAddress", a),
            title: "DEBUG IP",
          })
      )
    )
  );
}
const Patcher$2 = create("enmity-settings");
function patchSettings() {
  patchScreens(), patchSettings$1();
}
function patchScreens() {
  Patcher$2.after(Scenes, "default", (b, c, a) => ({
    ...a,
    Enmity: {
      key: "Enmity",
      title: "Enmity",
      render: connectComponent(Page, "enmity"),
      headerRight: HeaderRight,
    },
    EnmityPlugins: {
      key: "EnmityPlugins",
      title: "Plugins",
      render: Page$2,
      headerRight: HeaderRight$2,
    },
    EnmityThemes: {
      key: "EnmityThemes",
      title: "Themes",
      render: Page$1,
      headerRight: HeaderRight$1,
    },
  }));
}
function patchSettings$1() {
  let a = getByTypeName("UserSettingsOverviewWrapper", { default: !1 }),
    b = Patcher$2.after(a, "default", (c, d, a) => {
      Patcher$2.after(
        a.type.prototype,
        "render",
        ({ props: { navigation: d } }, e, c) => {
          let { children: a } = c.props,
            f = [
              Locale.Messages.BILLING_SETTINGS,
              Locale.Messages.PREMIUM_SETTINGS,
            ],
            b = a.findIndex((a) => f.includes(a.props.title));
          a.splice(
            -1 === b ? 4 : b,
            0,
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                FormSection,
                { key: "MarekEnmity", title: "MarekEnmity" },
                React.createElement(FormRow, {
                  label: "General",
                  leading: React.createElement(FormRow.Icon, {
                    source: { uri: "https://files.enmity.app/icon-64.png" },
                  }),
                  trailing: React.createElement(FormArrow, null),
                  onPress: () => void d.push("MarekEnmity", { navigation: d }),
                }),
                React.createElement(FormDivider, null),
                React.createElement(FormRow, {
                  label: "Plugins",
                  leading: React.createElement(PluginIcon, {
                    width: 24,
                    height: 24,
                  }),
                  trailing: React.createElement(FormArrow, null),
                  onPress: () =>
                    void d.push("EnmityPlugins", { navigation: d }),
                }),
                React.createElement(FormDivider, null),
                React.createElement(FormRow, {
                  label: "Themes",
                  leading: React.createElement(ThemeIcon, {
                    width: 24,
                    height: 24,
                  }),
                  trailing: React.createElement(FormArrow, null),
                  onPress: () => void d.push("EnmityThemes", { navigation: d }),
                }),
                React.createElement(FormDivider, null)
              )
            )
          );
        }
      ),
        b();
    });
}
const Patcher$1 = create("no-track");
function patchTracking() {
  let [a, b, c] = getByProps(
    ["trackWithMetadata"],
    ["AnalyticsActionHandlers"],
    ["encodeProperties", "track"],
    { bulk: !0 }
  );
  try {
    patchMetadata(a);
  } catch (d) {
    console.error("Failed to patch metadata", d.message);
  }
  try {
    patchAnalytics(b);
  } catch (e) {
    console.error("Failed to patch analytics", e.message);
  }
  try {
    patchProperties(c);
  } catch (f) {
    console.error("Failed to patch properties", f.message);
  }
  return Patcher$1.unpatchAll;
}
function patchMetadata(a) {
  Patcher$1.instead(a, "trackWithMetadata", () => {}),
    Patcher$1.instead(a, "trackWithGroupMetadata", () => {});
}
function patchAnalytics(a) {
  Patcher$1.instead(a.AnalyticsActionHandlers, "handleTrack", () => {});
}
function patchProperties(a) {
  Patcher$1.instead(a, "track", () => {});
}
const BadgesDomain =
  "https://raw.githubusercontent.com/notmarek/enmitybadges/main/";
function memoize(a) {
  let b;
  return (...c) => (b ??= a.apply(null, c));
}
function debounce(a, b) {
  let c;
  return function (...d) {
    clearTimeout(c), (c = setTimeout(() => a.apply(this, d), b));
  };
}
function createStore(b) {
  let c = { ...(b ?? {}) },
    a = uuid().toUpperCase(),
    d = {
      get: (a, b) => c[a] ?? b,
      set: (b, c) =>
        Dispatcher.dirtyDispatch({
          type: `ENMITY_FLUX_${a}_SET`,
          key: b,
          value: c,
        }),
      delete: (a) => d.set(a, void 0),
    },
    e = new Flux.Store(Dispatcher, {
      [`ENMITY_FLUX_${a}_SET`]({ key: a, value: b }) {
        void 0 === b ? delete c[a] : (c[a] = b);
      },
    });
  return { ...d, store: e, storage: c, id: a };
}
function findInTree(
  h = {},
  l = (a) => a,
  { ignore: d = [], walkable: e = [], maxProperties: f = 100 } = {}
) {
  let b = [h],
    i = function (...a) {
      try {
        return Reflect.apply(l, this, a);
      } catch {
        return !1;
      }
    };
  for (; b.length && f; ) {
    let a = b.shift();
    if (i(a)) return a;
    if (Array.isArray(a)) b.push(...a);
    else if ("object" == typeof a && null !== a) {
      if (e.length)
        for (let c in a) {
          let j = a[c];
          ~e.indexOf(c) && !~d.indexOf(c) && b.push(j);
        }
      else
        for (let g in a) {
          let k = a[g];
          (a && ~d.indexOf(g)) || b.push(k);
        }
    }
    f--;
  }
}
function findInReactTree(a, b = (a) => a, c = {}) {
  return findInTree(a, b, { walkable: ["props", "children"], ...c });
}
!(function (a) {
  a[(a.HOUR = 36e5)] = "HOUR";
})(Times || (Times = {}));
const { PixelRatio } = Components$1.General;
function normalizeSize(a) {
  return PixelRatio.getPixelSizeForLayoutSize(a);
}
const overrides = {
    useMemo: (a) => a(),
    useState: (a) => [a, () => void 0],
    useReducer: (a) => [a, () => void 0],
    useEffect() {},
    useLayoutEffect() {},
    useRef: () => ({ current: null }),
    useCallback: (a) => a,
  },
  keys = Object.keys(overrides);
var wrapInHooks =
  (a) =>
  (...d) => {
    let c =
        React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
          .ReactCurrentDispatcher.current,
      e = keys.map((a) => [a, c[a]]);
    Object.assign(c, overrides);
    let b = { rendered: null, error: null };
    try {
      b.rendered = a(...d);
    } catch (f) {
      b.error = f;
    }
    if ((Object.assign(c, Object.fromEntries(e)), b.error)) throw b.error;
    return b.rendered;
  };
function sleep(a) {
  return new Promise((b) => setTimeout(b, a));
}
var Utilities = Object.freeze({
  __proto__: null,
  memoize: memoize,
  debounce: debounce,
  createStore: createStore,
  findInReactTree: findInReactTree,
  normalizeSize: normalizeSize,
  wrapInHooks: wrapInHooks,
  findInTree: findInTree,
  sleep: sleep,
  uuid: uuid,
});
const Patcher = create("badges"),
  cache = { user: {}, badges: {} };
function patchBadges() {
  let a = getByDisplayName("ProfileBadges", { default: !1 });
  return (
    Patcher.after(a, "default", (f, [{ user: g, isEnmity: d, ...e }], b) => {
      if (d) return;
      let [c, h] = React.useState([]);
      return (
        React.useEffect(() => {
          try {
            fetchUserBadges(g.id).then(h);
          } catch (a) {
            console.error(`Failed to request/parse badges for ${g.id}`);
          }
        }, []),
        c.length &&
          (b ||
            ((b = wrapInHooks(a.default)({
              user: new Proxy(
                {},
                { get: (b, a) => ("flags" === a ? -1 : g[a]) }
              ),
              isEnmity: !0,
              ...e,
            })).props.badges = []),
          b.props.badges.push(
            ...c.map((a) =>
              React.createElement(
                View,
                {
                  key: a,
                  __enmity: !0,
                  style: {
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  },
                },
                React.createElement(Badge, { type: a })
              )
            )
          )),
        b
      );
    }),
    Patcher.unpatchAll
  );
}
async function fetchUserBadges(a) {
  if (cache.user[a]?.date && Date.now() - cache.user[a].date < Times.HOUR)
    return cache.user[a].badges;
  let b = await fetch(BadgesDomain + a + ".json", {
    headers: { "Cache-Control": "no-cache" },
  })
    .then((a) => a.json())
    .catch(() => []);
  return (
    Array.isArray(b) && (cache.user[a] = { badges: b, date: Date.now() }), b
  );
}
function Badge({ type: b }) {
  let [a, c] = React.useState(null);
  return (React.useEffect(() => {
    try {
      fetchBadge(b).then(c);
    } catch (a) {
      console.error(`Failed to get badge data for ${b}.`, a.message);
    }
  }, []),
  a?.url)
    ? React.createElement(
        TouchableOpacity,
        {
          onPress() {
            eval(a.script || "console.log('Badge has no script specified.');");
            Toasts.open({
              content: a.name,
              source: { uri: a.url[Theme.theme] },
            });
          },
        },
        React.createElement(Image, {
          source: { uri: a.url[Theme.theme] },
          style: {
            width: 24,
            height: 24,
            resizeMode: "contain",
            marginHorizontal: 2,
          },
        })
      )
    : null;
}
async function fetchBadge(a) {
  if (cache.badges[a]?.date && Date.now() - cache.badges[a].date < Times.HOUR)
    return cache.badges[a].data;
  let b = await fetch(BadgesDomain + `data/${a}.json`, {
    headers: { "Cache-Control": "no-cache" },
  })
    .then((a) => a.json())
    .catch(() => {});
  return b?.url && (cache.badges[a] = { data: b, date: Date.now() }), b;
}
function initialize$3() {
  try {
    patchSettings();
  } catch (a) {
    console.log("Failed to patch settings: ", a.message);
  }
  try {
    patchTracking();
  } catch (b) {
    console.log("Failed to patch trackers: ", b.message);
  }
  try {
    patchBadges();
  } catch (c) {
    console.log("Failed to patch badges: ", c.message);
  }
}
var CorePatches = { initialize: initialize$3 };
try {
  Avatars.BOT_AVATARS.ENMITY = "https://github.com/enmity-mod.png";
} catch {}
function sendReply(e, b, c, d) {
  let a = Clyde$1.createBotMessage(e, "");
  (a.author.username = c ?? "MarekEnmity"),
    (a.author.avatar = d ? c : "MAREKENMITY"),
    d && (Avatars.BOT_AVATARS[c] = d),
    "string" == typeof b ? (a.content = b) : Object.assign(a, b),
    Messages.receiveMessage(e, a);
}
var Clyde = Object.freeze({ __proto__: null, sendReply: sendReply }),
  plugins = [
    {
      name: "plugins list",
      description: "List installed plugins",
      execute(g, e) {
        let d = e.channel.id,
          f = getPlugins();
        if (0 === f.length) {
          sendReply(d, "No plugins installed.");
          return;
        }
        let b = getEnabledPlugins(),
          c = getDisabledPlugins(),
          a = "";
        b.length > 0 &&
          ((a = `**Enabled plugins (${b.length})**:
`),
          (a += `> ${b.join(", ")}
`)),
          c.length > 0 &&
            ((a += `**Disabled plugins (${c.length})**:
`),
            (a += `> ${c.join(", ")}`)),
          sendReply(d, a);
      },
    },
    {
      name: "plugins install",
      description: "Install a plugin",
      options: [
        {
          name: "plugin",
          displayName: "plugin",
          description: "Plugin url",
          displayDescription: "Plugin url",
          required: !0,
          type: ApplicationCommandOptionType.String,
        },
      ],
      execute(a, b) {
        let c = a[0].value,
          d = b.channel.id;
        installPlugin(c, (a) => {
          sendReply(d, a);
        });
      },
    },
    {
      name: "plugins uninstall",
      description: "Uninstall a plugin",
      options: [
        {
          name: "plugin",
          displayName: "plugin",
          description: "Plugin name",
          displayDescription: "Plugin name",
          type: ApplicationCommandOptionType.String,
          required: !0,
        },
      ],
      execute(a, b) {
        let c = a[0].value,
          d = b.channel.id;
        uninstallPlugin(c, (a) => {
          sendReply(d, a);
        });
      },
    },
    {
      name: "plugins disable",
      description: "Disable a plugin",
      options: [
        {
          name: "plugin",
          displayName: "plugin",
          description: "Plugin name",
          displayDescription: "Plugin name",
          type: ApplicationCommandOptionType.String,
          required: !0,
        },
      ],
      execute(a, b) {
        let c = a[0].value,
          d = b.channel.id;
        disablePlugin(c, (a) => {
          if ("yes" === a) {
            sendReply(d, `**${c}** has been disabled.`);
            return;
          }
          sendReply(d, `Error when disabling **${c}**.`);
        });
      },
    },
    {
      name: "plugins enable",
      description: "Enable a plugin",
      options: [
        {
          name: "plugin",
          displayName: "plugin",
          description: "Plugin name",
          displayDescription: "Plugin name",
          type: ApplicationCommandOptionType.String,
          required: !0,
        },
      ],
      execute(a, b) {
        let c = a[0].value,
          d = b.channel.id;
        enablePlugin(c, (a) => {
          if ("yes" === a) {
            sendReply(d, `**${c}** has been enabled.`);
            return;
          }
          sendReply(d, `Error when enabling **${c}**.`);
        });
      },
    },
  ],
  themes = [
    {
      name: "themes list",
      description: "List available themes",
      execute(c, b) {
        let a = listThemes();
        if (0 === a.length) {
          sendReply(b.channel.id, "No themes installed.");
          return;
        }
        sendReply(
          b.channel.id,
          `**Installed themes (${a.length})**: ${a
            .map((a) => a.name)
            .join(", ")}`
        );
      },
    },
    {
      name: "themes apply",
      description: "Apply a theme",
      options: [
        {
          name: "name",
          displayName: "name",
          description: "Theme's name",
          displayDescription: "Theme's name",
          type: ApplicationCommandOptionType.String,
          required: !0,
          choices: listThemes().map((a) => ({
            name: a.name,
            displayName: a.name,
            value: a.name,
          })),
        },
      ],
      execute(b, c) {
        let a = b[0].value,
          d = getThemeByName(a);
        d || sendReply(c.channel.id, "Theme couldn't be found."),
          applyTheme(a).then((a) => {
            sendReply(c.channel.id, a);
          });
      },
    },
    {
      name: "themes clear",
      description: "Remove applied theme",
      execute(a, b) {
        removeTheme().then((a) => {
          sendReply(b.channel.id, a);
        });
      },
    },
  ],
  utils = [
    {
      name: "debug",
      description: "Print out your device information",
      execute(c, b) {
        let a = [];
        a.push("**Debug Info:**"),
          a.push(`> Enmity: ${window.enmity.version}`),
          a.push(`> Discord: ${version} (${build})`),
          a.push(`> Device: ${device}`),
          a.push(`> System: ${os}`),
          Messages.sendMessage(b.channel.id, {
            validNonShortcutEmojis: [],
            content: a.join("\n"),
          });
      },
    },
    { name: "reload", description: "Reload Discord", execute: reload },
    {
      name: "token",
      description: "Show your Discord's token",
      execute: function (b, a) {
        sendReply(a.channel.id, Token.getToken());
      },
    },
  ],
  websocket = [
    {
      name: "websocket",
      description: "Connect to the websocket server",
      options: [
        {
          name: "host",
          displayName: "host",
          description: "Host of the debugger",
          displayDescription: "Host of the debugger",
          type: ApplicationCommandOptionType.String,
          required: !0,
        },
      ],
      execute(a) {
        let b = a[0].value;
        connectWebsocket(b);
      },
    },
    {
      name: "dump",
      description: "Dump Discord's modules",
      execute(k, f) {
        let g = f.channel.id,
          c = window.modules;
        function h(a) {
          if ("function" == typeof a) return a.toString();
          if (Array.isArray(a)) return a.map(h);
          if ("object" == typeof a) {
            let b = {};
            for (let c in a) b[c] = h(a[c]);
            return b;
          }
          return a;
        }
        for (let a of Object.keys(c))
          try {
            let b = c[a],
              d = { id: a };
            if (!b.publicModule?.exports) continue;
            let i = b.publicModule.exports;
            for (let e of Object.keys(b.publicModule.exports)) d[e] = h(i[e]);
            sendMessage(JSON.stringify(d, null, "	"));
          } catch (j) {
            console.log(`Couldn't dump module ${a}`), console.log(j);
          }
        sendReply(g, "Modules has been dumped.");
      },
    },
  ];
function initialize$2() {
  let a = [...plugins, ...websocket, ...utils, ...themes];
  registerCommands("marekenmity", a);
}
var Commands = { initialize: initialize$2 };
const API = {
  modules: Modules,
  themer: Themes,
  patcher: Patcher$5,
  version: "MarekEnmity",
  plugins: Plugins,
  clyde: Clyde,
  commands: Commands$2,
  utilities: Utilities,
  settings: Settings$2,
  components: Components,
  native: Native,
  assets: Assets$2,
};
function initialize$1() {
  window.enmity = API;
}
var API$1 = { API, initialize: initialize$1 };
function initialize() {
  WebSocket$1.initialize(),
    API$1.initialize(),
    CorePatches.initialize(),
    Commands.initialize();
}
var index = { initialize },
  index$1 = Object.freeze({
    __proto__: null,
    initialize: initialize,
    default: index,
  });

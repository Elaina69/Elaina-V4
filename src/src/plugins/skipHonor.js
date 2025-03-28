var m = class {
    constructor(o) {
        this.Context = o
    }
}

var p
function D(t) {
    if (p != null) throw new Error("UPL is already initialized!")
    p = new m(t)
}

var d = class {
    constructor(o) {
        this._callback = o;
    }
    trigger() {
        this._callback !== void 0 && (this._callback(), (this._callback = void 0));
    }
}

var k
var nt = new d(H)
var N = []
var R = []

function T(t, o) {
    return Element.prototype.matches.call(t, o);
}
function _(t, o) {
    if (o) for (let e of N) T(t, e.selector) && e.callback(t);
    else for (let e of R) T(t, e.selector) && e.callback(t);
    for (let e of t.children) _(e, o);
    if (t.shadowRoot != null) {
        for (let e of t.shadowRoot.children) _(e, o);
        o && k.observe(t.shadowRoot, { attributes: !1, childList: !0, subtree: !0 });
    }
}
function z(t) {
    for (let o of t) {
        for (let e of o.addedNodes) e.nodeType === Node.ELEMENT_NODE && _(e, !0);
        for (let e of o.removedNodes) e.nodeType === Node.ELEMENT_NODE && _(e, !1);
    }
}
function H() {
    (k = new MutationObserver(z)), k.observe(document, { attributes: !1, childList: !0, subtree: !0 });
}
var f = {},
P = new d(A);

function E(t, o) {
    P.trigger();
    var e = f[t];
    e === void 0 ? (f[t] = { pre_callback: o, post_callback: void 0 }) : (f[t].pre_callback = o);
}
function M(t, o) {
    P.trigger();
    var e = f[t];
    e === void 0 ? (f[t] = { pre_callback: void 0, post_callback: o }) : (f[t].post_callback = o);
}
function I(t, o) {
    E(t, (e, i, n) => {
        if (typeof i != "string") return console.error("UPL: Tried to hook text XHR request but body is not a string!"), n(i);
        o(i, (c) => {
            n(c);
        });
    });
}

function U(t, o) {
    M(t, (e, i) => {
        if (e.responseType !== "" && e.responseType !== "text") return console.error("UPL: Tried to hook text XHR request but response is not a string!"), i();
        let n = (r) => {
            e.responseText != r && Object.defineProperty(e, "responseText", { writable: !0, value: r }), i();
        };
        o(this.responseText, n);
    });
}
var $ = XMLHttpRequest.prototype.open;

function X(t, o) {
    var e = f[o.toString()];
    if (e !== void 0) {
        let i = this.send;
        this.send = function (n) {
            if (n instanceof Document) return i.apply(this, [n]);
            if (e.pre_callback !== void 0) {
                let r = (c) => {
                    n = c;
                };
                e.pre_callback(this, n || null, r);
            }
            if (e.post_callback !== void 0) {
                let r = this.onreadystatechange;
                this.onreadystatechange = function (c) {
                    if (this.readyState === 4 && e.post_callback !== void 0) {
                        let l = () => {
                            r.apply(this, [c]);
                        };
                        e.post_callback(this, l);
                        return;
                    }
                    return r.apply(this, arguments);
                };
            }
            i.apply(this, [n]);
        };
    }
    $.apply(this, arguments);
}

function A() {
    XMLHttpRequest.prototype.open = X;
}

var G = Object.freeze(Object.defineProperty({ __proto__: null, hookPost: M, hookPre: E, hookTextPost: U, hookTextPre: I }, Symbol.toStringTag, { value: "Module" })),
C = {},
K = new d(F);

function S(t, o) {
    K.trigger(), (C[t] = o);
}

function q(t, o) {
    S(t, (e, i) => {
        if (typeof e != "string") return console.error("UPL: Tried to hook text websocket endpoint but content is not a string!"), i(e);
        o(e, (r) => {
            i(r);
        });
    });
}

function F() {
    let t = p?.Context;
    if (t == null) throw new Error("UPL is not initialized!");
    t.rcp.postInit("rcp-fe-common-libs", async (o) => {
        let e = o.getDataBinding;
        o.getDataBinding = async function (i) {
            let n = await e.apply(this, arguments),
                r = function (c, l) {
                    let a = n.apply(this, arguments),
                        h = a.cache,
                        b = h._triggerResourceObservers;
                    return (
                        (h._triggerResourceObservers = function (s, u, x) {
                            let O = C[s];
                            return O == null
                                ? b.apply(this, [s, u, x])
                                : O(u, (B) => {
                                    b.apply(this, [s, B, x]);
                                });
                        }),
                        a
                    );
                };
            return (
                (r.bindTo = function (c) {
                    let l = n.bindTo.apply(this, arguments);
                    return (l.dataBinding = r), l;
                }),
                Promise.resolve(r)
            );
        };
    });
}

var J = Object.freeze(Object.defineProperty({ __proto__: null, hook: S, hookText: q }, Symbol.toStringTag, { value: "Module" })),
g = new Map(),
v = [],
y = new d(Z);

function Q(t, o, e) {
    y.trigger();
    var i = { method: o, callback: e },
        n = g.get(t);
    n === void 0 ? g.set(t, { hooks: [i], mixins: [] }) : n.hooks.push(i);
}

function V(t, o, e) {
    y.trigger();
    var i = { method: o, callback: e };
    v.push({ matcher: t, entry: { hooks: [i], mixins: [] } });
}

function W(t, o) {
    y.trigger();
    var e = g.get(t);
    e === void 0 ? g.set(t, { hooks: [], mixins: [o] }) : e.mixins.push(o);
}

function Y(t, o) {
    y.trigger(), v.push({ matcher: t, entry: { hooks: [], mixins: [o] } });
}

function Z() {
    let t = p?.Context;
    if (t == null) throw new Error("UPL is not initialized!");
    t.rcp.postInit("rcp-fe-ember-libs", async (o) => {
        let e = o.getEmber;
        o.getEmber = function (...i) {
            let n = e.apply(this, i);
            return (
                n.then((r) => {
                    let c = r.Component.extend;
                    return (
                        (r.Component.extend = function (...l) {
                            let a = c.apply(this, arguments),
                                h = l.filter((s) => typeof s == "object");
                            for (let s of h) for (let u of v) u.matcher(s) && (a = w(r, u.entry, a));
                            let b = h.filter((s) => s.classNames && Array.isArray(s.classNames)).map((s) => s.classNames.join(" "));
                            for (let s of b) {
                                let u = g.get(s);
                                u !== void 0 && (a = w(r, u, a));
                            }
                            return a;
                        }),
                        r
                    );
                }),
                n
            );
        };
    });
}

function w(t, o, e) {
    let i = e.proto();
    if (i.__UPL_IS_HOOKED) return e;
    i.__UPL_IS_HOOKED = !0;
    for (let n of o.mixins) e = e.extend(n(t));
    for (let n of o.hooks) {
        let r = i[n.method];
        i[n.method] = function (...c) {
            let l = (...a) => {
                if (r != null) return r.apply(this, a);
            };
            return n.callback.call(this, t, l, ...c);
        };
    }
    return e;
}

var tt = Object.freeze(Object.defineProperty({ __proto__: null, extendClassByMatching: Y, extendClassByName: W, hookComponentMethodByMatching: V, hookComponentMethodByName: Q }, Symbol.toStringTag, { value: "Module" })),
j = Object.freeze(Object.defineProperty({ __proto__: null, ember: tt, ws: J, xhr: G }, Symbol.toStringTag, { value: "Module" }));

function L(t) {
    if (t.rcp === void 0 || typeof t.rcp.preInit != "function" || typeof t.rcp.postInit != "function") throw new Error("context is not a valid Pengu Context!");
    D(t);
}

export function skipHonor(context) {
    if (ElainaData.get("Auto-Find-Queue")) {
        L(context),
        j.ember.extendClassByMatching(
            (o) => o.baseClassName === "honor-vote-ceremony-v3",
            () => ({
                beginTransition: function () {
                    this.set("selectionChosen", !0),
                        (this._beginTransitionTimer = null),
                        this.runTask(function () {
                            this.submitBallot();
                        }, 0);
                },
                willRender: function () {
                    this.send("submitSelection");
                },
            })
        );
    }
}

!(function(t, e) {
	'use strict';
	var i = (t.History = t.History || {}),
		n = t.jQuery;
	if ('undefined' != typeof i.Adapter) throw new Error('History.js Adapter has already been loaded...');
	(i.Adapter = {
		bind: function(t, e, i) {
			n(t).bind(e, i);
		},
		trigger: function(t, e, i) {
			n(t).trigger(e, i);
		},
		extractEventData: function(t, i, n) {
			var s = (i && i.originalEvent && i.originalEvent[t]) || (n && n[t]) || e;
			return s;
		},
		onDomLoad: function(t) {
			n(t);
		}
	}),
		'undefined' != typeof i.init && i.init();
})(window),
	(function(t, e) {
		'use strict';
		var i = t.console || e,
			n = t.document,
			s = t.navigator,
			o = !1,
			r = t.setTimeout,
			a = t.clearTimeout,
			l = t.setInterval,
			h = t.clearInterval,
			u = t.JSON,
			d = t.alert,
			c = (t.History = t.History || {}),
			p = t.history;
		try {
			(o = t.sessionStorage), o.setItem('TEST', '1'), o.removeItem('TEST');
		} catch (f) {
			o = !1;
		}
		if (((u.stringify = u.stringify || u.encode), (u.parse = u.parse || u.decode), 'undefined' != typeof c.init))
			throw new Error('History.js Core has already been loaded...');
		(c.init = function(t) {
			return 'undefined' == typeof c.Adapter
				? !1
				: ('undefined' != typeof c.initCore && c.initCore(),
					'undefined' != typeof c.initHtml4 && c.initHtml4(),
					!0);
		}),
			(c.initCore = function(f) {
				if ('undefined' != typeof c.initCore.initialized) return !1;
				if (
					((c.initCore.initialized = !0),
					(c.options = c.options || {}),
					(c.options.hashChangeInterval = c.options.hashChangeInterval || 100),
					(c.options.safariPollInterval = c.options.safariPollInterval || 500),
					(c.options.doubleCheckInterval = c.options.doubleCheckInterval || 500),
					(c.options.disableSuid = c.options.disableSuid || !1),
					(c.options.storeInterval = c.options.storeInterval || 1e3),
					(c.options.busyDelay = c.options.busyDelay || 250),
					(c.options.debug = c.options.debug || !1),
					(c.options.initialTitle = c.options.initialTitle || n.title),
					(c.options.html4Mode = c.options.html4Mode || !1),
					(c.options.delayInit = c.options.delayInit || !1),
					(c.intervalList = []),
					(c.clearAllIntervals = function() {
						var t,
							e = c.intervalList;
						if ('undefined' != typeof e && null !== e) {
							for (t = 0; t < e.length; t++) h(e[t]);
							c.intervalList = null;
						}
					}),
					(c.debug = function() {
						(c.options.debug || !1) && c.log.apply(c, arguments);
					}),
					(c.log = function() {
						var t =
								'undefined' != typeof i &&
								'undefined' != typeof i.log &&
								'undefined' != typeof i.log.apply,
							e = n.getElementById('log'),
							s,
							o,
							r,
							a,
							l;
						for (
							t
								? ((a = Array.prototype.slice.call(arguments)),
									(s = a.shift()),
									'undefined' != typeof i.debug ? i.debug.apply(i, [ s, a ]) : i.log.apply(i, [ s, a ]))
								: (s = '\n' + arguments[0] + '\n'),
								o = 1,
								r = arguments.length;
							r > o;
							++o
						) {
							if (((l = arguments[o]), 'object' == typeof l && 'undefined' != typeof u))
								try {
									l = u.stringify(l);
								} catch (h) {}
							s += '\n' + l + '\n';
						}
						return (
							e
								? ((e.value += s + '\n-----\n'), (e.scrollTop = e.scrollHeight - e.clientHeight))
								: t || d(s),
							!0
						);
					}),
					(c.getInternetExplorerMajorVersion = function() {
						var t = (c.getInternetExplorerMajorVersion.cached =
							'undefined' != typeof c.getInternetExplorerMajorVersion.cached
								? c.getInternetExplorerMajorVersion.cached
								: (function() {
										for (
											var t = 3, e = n.createElement('div'), i = e.getElementsByTagName('i');
											(e.innerHTML = '<!--[if gt IE ' + ++t + ']><i></i><![endif]-->') && i[0];

										);
										return t > 4 ? t : !1;
									})());
						return t;
					}),
					(c.isInternetExplorer = function() {
						var t = (c.isInternetExplorer.cached =
							'undefined' != typeof c.isInternetExplorer.cached
								? c.isInternetExplorer.cached
								: Boolean(c.getInternetExplorerMajorVersion()));
						return t;
					}),
					c.options.html4Mode
						? (c.emulated = { pushState: !0, hashChange: !0 })
						: (c.emulated = {
								pushState: !Boolean(
									t.history &&
										t.history.pushState &&
										t.history.replaceState &&
										!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(s.userAgent) &&
										!/AppleWebKit\/5([0-2]|3[0-2])/i.test(s.userAgent)
								),
								hashChange: Boolean(
									!('onhashchange' in t || 'onhashchange' in n) ||
										(c.isInternetExplorer() && c.getInternetExplorerMajorVersion() < 8)
								)
							}),
					(c.enabled = !c.emulated.pushState),
					(c.bugs = {
						setHash: Boolean(
							!c.emulated.pushState &&
								'Apple Computer, Inc.' === s.vendor &&
								/AppleWebKit\/5([0-2]|3[0-3])/.test(s.userAgent)
						),
						safariPoll: Boolean(
							!c.emulated.pushState &&
								'Apple Computer, Inc.' === s.vendor &&
								/AppleWebKit\/5([0-2]|3[0-3])/.test(s.userAgent)
						),
						ieDoubleCheck: Boolean(c.isInternetExplorer() && c.getInternetExplorerMajorVersion() < 8),
						hashEscape: Boolean(c.isInternetExplorer() && c.getInternetExplorerMajorVersion() < 7)
					}),
					(c.isEmptyObject = function(t) {
						for (var e in t) if (t.hasOwnProperty(e)) return !1;
						return !0;
					}),
					(c.cloneObject = function(t) {
						var e, i;
						return t ? ((e = u.stringify(t)), (i = u.parse(e))) : (i = {}), i;
					}),
					(c.getRootUrl = function() {
						var t = n.location.protocol + '//' + (n.location.hostname || n.location.host);
						return n.location.port && (t += ':' + n.location.port), (t += '/');
					}),
					(c.getBaseHref = function() {
						var t = n.getElementsByTagName('base'),
							e = null,
							i = '';
						return (
							1 === t.length && ((e = t[0]), (i = e.href.replace(/[^\/]+$/, ''))),
							(i = i.replace(/\/+$/, '')),
							i && (i += '/'),
							i
						);
					}),
					(c.getBaseUrl = function() {
						var t = c.getBaseHref() || c.getBasePageUrl() || c.getRootUrl();
						return t;
					}),
					(c.getPageUrl = function() {
						var t = c.getState(!1, !1),
							e = (t || {}).url || c.getLocationHref(),
							i;
						return (i = e.replace(/\/+$/, '').replace(/[^\/]+$/, function(t, e, i) {
							return /\./.test(t) ? t : t + '/';
						}));
					}),
					(c.getBasePageUrl = function() {
						var t =
							c
								.getLocationHref()
								.replace(/[#\?].*/, '')
								.replace(/[^\/]+$/, function(t, e, i) {
									return /[^\/]$/.test(t) ? '' : t;
								})
								.replace(/\/+$/, '') + '/';
						return t;
					}),
					(c.getFullUrl = function(t, e) {
						var i = t,
							n = t.substring(0, 1);
						return (
							(e = 'undefined' == typeof e ? !0 : e),
							/[a-z]+\:\/\//.test(t) ||
								(i =
									'/' === n
										? c.getRootUrl() + t.replace(/^\/+/, '')
										: '#' === n
											? c.getPageUrl().replace(/#.*/, '') + t
											: '?' === n
												? c.getPageUrl().replace(/[\?#].*/, '') + t
												: e
													? c.getBaseUrl() + t.replace(/^(\.\/)+/, '')
													: c.getBasePageUrl() + t.replace(/^(\.\/)+/, '')),
							i.replace(/\#$/, '')
						);
					}),
					(c.getShortUrl = function(t) {
						var e = t,
							i = c.getBaseUrl(),
							n = c.getRootUrl();
						return (
							c.emulated.pushState && (e = e.replace(i, '')),
							(e = e.replace(n, '/')),
							c.isTraditionalAnchor(e) && (e = './' + e),
							(e = e.replace(/^(\.\/)+/g, './').replace(/\#$/, ''))
						);
					}),
					(c.getLocationHref = function(t) {
						return (
							(t = t || n),
							t.URL === t.location.href
								? t.location.href
								: t.location.href === decodeURIComponent(t.URL)
									? t.URL
									: t.location.hash &&
										decodeURIComponent(t.location.href.replace(/^[^#]+/, '')) === t.location.hash
										? t.location.href
										: -1 == t.URL.indexOf('#') && -1 != t.location.href.indexOf('#')
											? t.location.href
											: t.URL || t.location.href
						);
					}),
					(c.store = {}),
					(c.idToState = c.idToState || {}),
					(c.stateToId = c.stateToId || {}),
					(c.urlToId = c.urlToId || {}),
					(c.storedStates = c.storedStates || []),
					(c.savedStates = c.savedStates || []),
					(c.normalizeStore = function() {
						(c.store.idToState = c.store.idToState || {}),
							(c.store.urlToId = c.store.urlToId || {}),
							(c.store.stateToId = c.store.stateToId || {});
					}),
					(c.getState = function(t, e) {
						'undefined' == typeof t && (t = !0), 'undefined' == typeof e && (e = !0);
						var i = c.getLastSavedState();
						return (
							!i && e && (i = c.createStateObject()),
							t && ((i = c.cloneObject(i)), (i.url = i.cleanUrl || i.url)),
							i
						);
					}),
					(c.getIdByState = function(t) {
						var e = c.extractId(t.url),
							i;
						if (!e)
							if (((i = c.getStateString(t)), 'undefined' != typeof c.stateToId[i])) e = c.stateToId[i];
							else if ('undefined' != typeof c.store.stateToId[i]) e = c.store.stateToId[i];
							else {
								for (
									;
									(e = new Date().getTime() + String(Math.random()).replace(/\D/g, '')),
										'undefined' != typeof c.idToState[e] ||
											'undefined' != typeof c.store.idToState[e];

								);
								(c.stateToId[i] = e), (c.idToState[e] = t);
							}
						return e;
					}),
					(c.normalizeState = function(t) {
						var e, i;
						return (
							(t && 'object' == typeof t) || (t = {}),
							'undefined' != typeof t.normalized
								? t
								: ((t.data && 'object' == typeof t.data) || (t.data = {}),
									(e = {}),
									(e.normalized = !0),
									(e.title = t.title || ''),
									(e.url = c.getFullUrl(t.url ? t.url : c.getLocationHref())),
									(e.hash = c.getShortUrl(e.url)),
									(e.data = c.cloneObject(t.data)),
									(e.id = c.getIdByState(e)),
									(e.cleanUrl = e.url.replace(/\??\&_suid.*/, '')),
									(e.url = e.cleanUrl),
									(i = !c.isEmptyObject(e.data)),
									(e.title || i) &&
										c.options.disableSuid !== !0 &&
										((e.hash = c.getShortUrl(e.url).replace(/\??\&_suid.*/, '')),
										/\?/.test(e.hash) || (e.hash += '?'),
										(e.hash += '&_suid=' + e.id)),
									(e.hashedUrl = c.getFullUrl(e.hash)),
									(c.emulated.pushState || c.bugs.safariPoll) &&
										c.hasUrlDuplicate(e) &&
										(e.url = e.hashedUrl),
									e)
						);
					}),
					(c.createStateObject = function(t, e, i) {
						var n = { data: t, title: e, url: i };
						return (n = c.normalizeState(n));
					}),
					(c.getStateById = function(t) {
						t = String(t);
						var i = c.idToState[t] || c.store.idToState[t] || e;
						return i;
					}),
					(c.getStateString = function(t) {
						var e, i, n;
						return (
							(e = c.normalizeState(t)),
							(i = { data: e.data, title: t.title, url: t.url }),
							(n = u.stringify(i))
						);
					}),
					(c.getStateId = function(t) {
						var e, i;
						return (e = c.normalizeState(t)), (i = e.id);
					}),
					(c.getHashByState = function(t) {
						var e, i;
						return (e = c.normalizeState(t)), (i = e.hash);
					}),
					(c.extractId = function(t) {
						var e, i, n, s;
						return (
							(s = -1 != t.indexOf('#') ? t.split('#')[0] : t),
							(i = /(.*)\&_suid=([0-9]+)$/.exec(s)),
							(n = i ? i[1] || t : t),
							(e = i ? String(i[2] || '') : ''),
							e || !1
						);
					}),
					(c.isTraditionalAnchor = function(t) {
						var e = !/[\/\?\.]/.test(t);
						return e;
					}),
					(c.extractState = function(t, e) {
						var i = null,
							n,
							s;
						return (
							(e = e || !1),
							(n = c.extractId(t)),
							n && (i = c.getStateById(n)),
							i ||
								((s = c.getFullUrl(t)),
								(n = c.getIdByUrl(s) || !1),
								n && (i = c.getStateById(n)),
								!i && e && !c.isTraditionalAnchor(t) && (i = c.createStateObject(null, null, s))),
							i
						);
					}),
					(c.getIdByUrl = function(t) {
						var i = c.urlToId[t] || c.store.urlToId[t] || e;
						return i;
					}),
					(c.getLastSavedState = function() {
						return c.savedStates[c.savedStates.length - 1] || e;
					}),
					(c.getLastStoredState = function() {
						return c.storedStates[c.storedStates.length - 1] || e;
					}),
					(c.hasUrlDuplicate = function(t) {
						var e = !1,
							i;
						return (i = c.extractState(t.url)), (e = i && i.id !== t.id);
					}),
					(c.storeState = function(t) {
						return (c.urlToId[t.url] = t.id), c.storedStates.push(c.cloneObject(t)), t;
					}),
					(c.isLastSavedState = function(t) {
						var e = !1,
							i,
							n,
							s;
						return (
							c.savedStates.length &&
								((i = t.id), (n = c.getLastSavedState()), (s = n.id), (e = i === s)),
							e
						);
					}),
					(c.saveState = function(t) {
						return c.isLastSavedState(t) ? !1 : (c.savedStates.push(c.cloneObject(t)), !0);
					}),
					(c.getStateByIndex = function(t) {
						var e = null;
						return (e =
							'undefined' == typeof t
								? c.savedStates[c.savedStates.length - 1]
								: 0 > t ? c.savedStates[c.savedStates.length + t] : c.savedStates[t]);
					}),
					(c.getCurrentIndex = function() {
						var t = null;
						return (t = c.savedStates.length < 1 ? 0 : c.savedStates.length - 1);
					}),
					(c.getHash = function(t) {
						var e = c.getLocationHref(t),
							i;
						return (i = c.getHashByUrl(e));
					}),
					(c.unescapeHash = function(t) {
						var e = c.normalizeHash(t);
						return (e = decodeURIComponent(e));
					}),
					(c.normalizeHash = function(t) {
						var e = t.replace(/[^#]*#/, '').replace(/#.*/, '');
						return e;
					}),
					(c.setHash = function(t, e) {
						var i, s;
						return e !== !1 && c.busy()
							? (c.pushQueue({ scope: c, callback: c.setHash, args: arguments, queue: e }), !1)
							: (c.busy(!0),
								(i = c.extractState(t, !0)),
								i && !c.emulated.pushState
									? c.pushState(i.data, i.title, i.url, !1)
									: c.getHash() !== t &&
										(c.bugs.setHash
											? ((s = c.getPageUrl()), c.pushState(null, null, s + '#' + t, !1))
											: (n.location.hash = t)),
								c);
					}),
					(c.escapeHash = function(e) {
						var i = c.normalizeHash(e);
						return (
							(i = t.encodeURIComponent(i)),
							c.bugs.hashEscape ||
								(i = i
									.replace(/\%21/g, '!')
									.replace(/\%26/g, '&')
									.replace(/\%3D/g, '=')
									.replace(/\%3F/g, '?')),
							i
						);
					}),
					(c.getHashByUrl = function(t) {
						var e = String(t).replace(/([^#]*)#?([^#]*)#?(.*)/, '$2');
						return (e = c.unescapeHash(e));
					}),
					(c.setTitle = function(t) {
						var e = t.title,
							i;
						e ||
							((i = c.getStateByIndex(0)),
							i && i.url === t.url && (e = i.title || c.options.initialTitle));
						try {
							n.getElementsByTagName('title')[0].innerHTML = e
								.replace('<', '&lt;')
								.replace('>', '&gt;')
								.replace(' & ', ' &amp; ');
						} catch (s) {}
						return (n.title = e), c;
					}),
					(c.queues = []),
					(c.busy = function(t) {
						if (
							('undefined' != typeof t
								? (c.busy.flag = t)
								: 'undefined' == typeof c.busy.flag && (c.busy.flag = !1),
							!c.busy.flag)
						) {
							a(c.busy.timeout);
							var e = function() {
								var t, i, n;
								if (!c.busy.flag)
									for (t = c.queues.length - 1; t >= 0; --t)
										(i = c.queues[t]),
											0 !== i.length &&
												((n = i.shift()),
												c.fireQueueItem(n),
												(c.busy.timeout = r(e, c.options.busyDelay)));
							};
							c.busy.timeout = r(e, c.options.busyDelay);
						}
						return c.busy.flag;
					}),
					(c.busy.flag = !1),
					(c.fireQueueItem = function(t) {
						return t.callback.apply(t.scope || c, t.args || []);
					}),
					(c.pushQueue = function(t) {
						return (
							(c.queues[t.queue || 0] = c.queues[t.queue || 0] || []), c.queues[t.queue || 0].push(t), c
						);
					}),
					(c.queue = function(t, e) {
						return (
							'function' == typeof t && (t = { callback: t }),
							'undefined' != typeof e && (t.queue = e),
							c.busy() ? c.pushQueue(t) : c.fireQueueItem(t),
							c
						);
					}),
					(c.clearQueue = function() {
						return (c.busy.flag = !1), (c.queues = []), c;
					}),
					(c.stateChanged = !1),
					(c.doubleChecker = !1),
					(c.doubleCheckComplete = function() {
						return (c.stateChanged = !0), c.doubleCheckClear(), c;
					}),
					(c.doubleCheckClear = function() {
						return c.doubleChecker && (a(c.doubleChecker), (c.doubleChecker = !1)), c;
					}),
					(c.doubleCheck = function(t) {
						return (
							(c.stateChanged = !1),
							c.doubleCheckClear(),
							c.bugs.ieDoubleCheck &&
								(c.doubleChecker = r(function() {
									return c.doubleCheckClear(), c.stateChanged || t(), !0;
								}, c.options.doubleCheckInterval)),
							c
						);
					}),
					(c.safariStatePoll = function() {
						var e = c.extractState(c.getLocationHref()),
							i;
						return c.isLastSavedState(e)
							? void 0
							: ((i = e), i || (i = c.createStateObject()), c.Adapter.trigger(t, 'popstate'), c);
					}),
					(c.back = function(t) {
						return t !== !1 && c.busy()
							? (c.pushQueue({ scope: c, callback: c.back, args: arguments, queue: t }), !1)
							: (c.busy(!0),
								c.doubleCheck(function() {
									c.back(!1);
								}),
								p.go(-1),
								!0);
					}),
					(c.forward = function(t) {
						return t !== !1 && c.busy()
							? (c.pushQueue({ scope: c, callback: c.forward, args: arguments, queue: t }), !1)
							: (c.busy(!0),
								c.doubleCheck(function() {
									c.forward(!1);
								}),
								p.go(1),
								!0);
					}),
					(c.go = function(t, e) {
						var i;
						if (t > 0) for (i = 1; t >= i; ++i) c.forward(e);
						else {
							if (!(0 > t))
								throw new Error(
									'History.go: History.go requires a positive or negative integer passed.'
								);
							for (i = -1; i >= t; --i) c.back(e);
						}
						return c;
					}),
					c.emulated.pushState)
				) {
					var g = function() {};
					(c.pushState = c.pushState || g), (c.replaceState = c.replaceState || g);
				} else
					(c.onPopState = function(e, i) {
						var n = !1,
							s = !1,
							o,
							r;
						return (
							c.doubleCheckComplete(),
							(o = c.getHash()),
							o
								? ((r = c.extractState(o || c.getLocationHref(), !0)),
									r
										? c.replaceState(r.data, r.title, r.url, !1)
										: (c.Adapter.trigger(t, 'anchorchange'), c.busy(!1)),
									(c.expectedStateId = !1),
									!1)
								: ((n = c.Adapter.extractEventData('state', e, i) || !1),
									(s = n
										? c.getStateById(n)
										: c.expectedStateId
											? c.getStateById(c.expectedStateId)
											: c.extractState(c.getLocationHref())),
									s || (s = c.createStateObject(null, null, c.getLocationHref())),
									(c.expectedStateId = !1),
									c.isLastSavedState(s)
										? (c.busy(!1), !1)
										: (c.storeState(s),
											c.saveState(s),
											c.setTitle(s),
											c.Adapter.trigger(t, 'statechange'),
											c.busy(!1),
											!0))
						);
					}),
						c.Adapter.bind(t, 'popstate', c.onPopState),
						(c.pushState = function(e, i, n, s) {
							if (c.getHashByUrl(n) && c.emulated.pushState)
								throw new Error(
									'History.js does not support states with fragement-identifiers (hashes/anchors).'
								);
							if (s !== !1 && c.busy())
								return c.pushQueue({ scope: c, callback: c.pushState, args: arguments, queue: s }), !1;
							c.busy(!0);
							var o = c.createStateObject(e, i, n);
							return (
								c.isLastSavedState(o)
									? c.busy(!1)
									: (c.storeState(o),
										(c.expectedStateId = o.id),
										p.pushState(o.id, o.title, o.url),
										c.Adapter.trigger(t, 'popstate')),
								!0
							);
						}),
						(c.replaceState = function(e, i, n, s) {
							if (c.getHashByUrl(n) && c.emulated.pushState)
								throw new Error(
									'History.js does not support states with fragement-identifiers (hashes/anchors).'
								);
							if (s !== !1 && c.busy())
								return (
									c.pushQueue({ scope: c, callback: c.replaceState, args: arguments, queue: s }), !1
								);
							c.busy(!0);
							var o = c.createStateObject(e, i, n);
							return (
								c.isLastSavedState(o)
									? c.busy(!1)
									: (c.storeState(o),
										(c.expectedStateId = o.id),
										p.replaceState(o.id, o.title, o.url),
										c.Adapter.trigger(t, 'popstate')),
								!0
							);
						});
				if (o) {
					try {
						c.store = u.parse(o.getItem('History.store')) || {};
					} catch (m) {
						c.store = {};
					}
					c.normalizeStore();
				} else (c.store = {}), c.normalizeStore();
				c.Adapter.bind(t, 'unload', c.clearAllIntervals),
					c.saveState(c.storeState(c.extractState(c.getLocationHref(), !0))),
					o &&
						((c.onUnload = function() {
							var t, e, i;
							try {
								t = u.parse(o.getItem('History.store')) || {};
							} catch (n) {
								t = {};
							}
							(t.idToState = t.idToState || {}),
								(t.urlToId = t.urlToId || {}),
								(t.stateToId = t.stateToId || {});
							for (e in c.idToState) c.idToState.hasOwnProperty(e) && (t.idToState[e] = c.idToState[e]);
							for (e in c.urlToId) c.urlToId.hasOwnProperty(e) && (t.urlToId[e] = c.urlToId[e]);
							for (e in c.stateToId) c.stateToId.hasOwnProperty(e) && (t.stateToId[e] = c.stateToId[e]);
							(c.store = t), c.normalizeStore(), (i = u.stringify(t));
							try {
								o.setItem('History.store', i);
							} catch (s) {
								if (s.code !== DOMException.QUOTA_EXCEEDED_ERR) throw s;
								o.length && (o.removeItem('History.store'), o.setItem('History.store', i));
							}
						}),
						c.intervalList.push(l(c.onUnload, c.options.storeInterval)),
						c.Adapter.bind(t, 'beforeunload', c.onUnload),
						c.Adapter.bind(t, 'unload', c.onUnload)),
					c.emulated.pushState ||
						(c.bugs.safariPoll && c.intervalList.push(l(c.safariStatePoll, c.options.safariPollInterval)),
						('Apple Computer, Inc.' === s.vendor || 'Mozilla' === (s.appCodeName || '')) &&
							(c.Adapter.bind(t, 'hashchange', function() {
								c.Adapter.trigger(t, 'popstate');
							}),
							c.getHash() &&
								c.Adapter.onDomLoad(function() {
									c.Adapter.trigger(t, 'hashchange');
								})));
			}),
			(!c.options || !c.options.delayInit) && c.init();
	})(window),
	!(function(t, e) {
		'function' == typeof define && define.amd
			? define('ev-emitter/ev-emitter', e)
			: 'object' == typeof module && module.exports ? (module.exports = e()) : (t.EvEmitter = e());
	})('undefined' != typeof window ? window : this, function() {
		function t() {}
		var e = t.prototype;
		return (
			(e.on = function(t, e) {
				if (t && e) {
					var i = (this._events = this._events || {}),
						n = (i[t] = i[t] || []);
					return -1 == n.indexOf(e) && n.push(e), this;
				}
			}),
			(e.once = function(t, e) {
				if (t && e) {
					this.on(t, e);
					var i = (this._onceEvents = this._onceEvents || {}),
						n = (i[t] = i[t] || {});
					return (n[e] = !0), this;
				}
			}),
			(e.off = function(t, e) {
				var i = this._events && this._events[t];
				if (i && i.length) {
					var n = i.indexOf(e);
					return -1 != n && i.splice(n, 1), this;
				}
			}),
			(e.emitEvent = function(t, e) {
				var i = this._events && this._events[t];
				if (i && i.length) {
					var n = 0,
						s = i[n];
					e = e || [];
					for (var o = this._onceEvents && this._onceEvents[t]; s; ) {
						var r = o && o[s];
						r && (this.off(t, s), delete o[s]), s.apply(this, e), (n += r ? 0 : 1), (s = i[n]);
					}
					return this;
				}
			}),
			(e.allOff = e.removeAllListeners = function() {
				delete this._events, delete this._onceEvents;
			}),
			t
		);
	}),
	(function(t, e) {
		'use strict';
		'function' == typeof define && define.amd
			? define([ 'ev-emitter/ev-emitter' ], function(i) {
					return e(t, i);
				})
			: 'object' == typeof module && module.exports
				? (module.exports = e(t, require('ev-emitter')))
				: (t.imagesLoaded = e(t, t.EvEmitter));
	})('undefined' != typeof window ? window : this, function(t, e) {
		function i(t, e) {
			for (var i in e) t[i] = e[i];
			return t;
		}
		function n(t) {
			var e = [];
			if (Array.isArray(t)) e = t;
			else if ('number' == typeof t.length) for (var i = 0; i < t.length; i++) e.push(t[i]);
			else e.push(t);
			return e;
		}
		function s(t, e, o) {
			return this instanceof s
				? ('string' == typeof t && (t = document.querySelectorAll(t)),
					(this.elements = n(t)),
					(this.options = i({}, this.options)),
					'function' == typeof e ? (o = e) : i(this.options, e),
					o && this.on('always', o),
					this.getImages(),
					a && (this.jqDeferred = new a.Deferred()),
					void setTimeout(
						function() {
							this.check();
						}.bind(this)
					))
				: new s(t, e, o);
		}
		function o(t) {
			this.img = t;
		}
		function r(t, e) {
			(this.url = t), (this.element = e), (this.img = new Image());
		}
		var a = t.jQuery,
			l = t.console;
		(s.prototype = Object.create(e.prototype)),
			(s.prototype.options = {}),
			(s.prototype.getImages = function() {
				(this.images = []), this.elements.forEach(this.addElementImages, this);
			}),
			(s.prototype.addElementImages = function(t) {
				'IMG' == t.nodeName && this.addImage(t),
					this.options.background === !0 && this.addElementBackgroundImages(t);
				var e = t.nodeType;
				if (e && h[e]) {
					for (var i = t.querySelectorAll('img'), n = 0; n < i.length; n++) {
						var s = i[n];
						this.addImage(s);
					}
					if ('string' == typeof this.options.background) {
						var o = t.querySelectorAll(this.options.background);
						for (n = 0; n < o.length; n++) {
							var r = o[n];
							this.addElementBackgroundImages(r);
						}
					}
				}
			});
		var h = { 1: !0, 9: !0, 11: !0 };
		return (
			(s.prototype.addElementBackgroundImages = function(t) {
				var e = getComputedStyle(t);
				if (e)
					for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n; ) {
						var s = n && n[2];
						s && this.addBackground(s, t), (n = i.exec(e.backgroundImage));
					}
			}),
			(s.prototype.addImage = function(t) {
				var e = new o(t);
				this.images.push(e);
			}),
			(s.prototype.addBackground = function(t, e) {
				var i = new r(t, e);
				this.images.push(i);
			}),
			(s.prototype.check = function() {
				function t(t, i, n) {
					setTimeout(function() {
						e.progress(t, i, n);
					});
				}
				var e = this;
				return (
					(this.progressedCount = 0),
					(this.hasAnyBroken = !1),
					this.images.length
						? void this.images.forEach(function(e) {
								e.once('progress', t), e.check();
							})
						: void this.complete()
				);
			}),
			(s.prototype.progress = function(t, e, i) {
				this.progressedCount++,
					(this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
					this.emitEvent('progress', [ this, t, e ]),
					this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t),
					this.progressedCount == this.images.length && this.complete(),
					this.options.debug && l && l.log('progress: ' + i, t, e);
			}),
			(s.prototype.complete = function() {
				var t = this.hasAnyBroken ? 'fail' : 'done';
				if (
					((this.isComplete = !0),
					this.emitEvent(t, [ this ]),
					this.emitEvent('always', [ this ]),
					this.jqDeferred)
				) {
					var e = this.hasAnyBroken ? 'reject' : 'resolve';
					this.jqDeferred[e](this);
				}
			}),
			(o.prototype = Object.create(e.prototype)),
			(o.prototype.check = function() {
				var t = this.getIsImageComplete();
				return t
					? void this.confirm(0 !== this.img.naturalWidth, 'naturalWidth')
					: ((this.proxyImage = new Image()),
						this.proxyImage.addEventListener('load', this),
						this.proxyImage.addEventListener('error', this),
						this.img.addEventListener('load', this),
						this.img.addEventListener('error', this),
						void (this.proxyImage.src = this.img.src));
			}),
			(o.prototype.getIsImageComplete = function() {
				return this.img.complete && void 0 !== this.img.naturalWidth;
			}),
			(o.prototype.confirm = function(t, e) {
				(this.isLoaded = t), this.emitEvent('progress', [ this, this.img, e ]);
			}),
			(o.prototype.handleEvent = function(t) {
				var e = 'on' + t.type;
				this[e] && this[e](t);
			}),
			(o.prototype.onload = function() {
				this.confirm(!0, 'onload'), this.unbindEvents();
			}),
			(o.prototype.onerror = function() {
				this.confirm(!1, 'onerror'), this.unbindEvents();
			}),
			(o.prototype.unbindEvents = function() {
				this.proxyImage.removeEventListener('load', this),
					this.proxyImage.removeEventListener('error', this),
					this.img.removeEventListener('load', this),
					this.img.removeEventListener('error', this);
			}),
			(r.prototype = Object.create(o.prototype)),
			(r.prototype.check = function() {
				this.img.addEventListener('load', this),
					this.img.addEventListener('error', this),
					(this.img.src = this.url);
				var t = this.getIsImageComplete();
				t && (this.confirm(0 !== this.img.naturalWidth, 'naturalWidth'), this.unbindEvents());
			}),
			(r.prototype.unbindEvents = function() {
				this.img.removeEventListener('load', this), this.img.removeEventListener('error', this);
			}),
			(r.prototype.confirm = function(t, e) {
				(this.isLoaded = t), this.emitEvent('progress', [ this, this.element, e ]);
			}),
			(s.makeJQueryPlugin = function(e) {
				(e = e || t.jQuery),
					e &&
						((a = e),
						(a.fn.imagesLoaded = function(t, e) {
							var i = new s(this, t, e);
							return i.jqDeferred.promise(a(this));
						}));
			}),
			s.makeJQueryPlugin(),
			s
		);
	}),
	!(function(t, e) {
		'function' == typeof define && define.amd
			? define('jquery-bridget/jquery-bridget', [ 'jquery' ], function(i) {
					return e(t, i);
				})
			: 'object' == typeof module && module.exports
				? (module.exports = e(t, require('jquery')))
				: (t.jQueryBridget = e(t, t.jQuery));
	})(window, function(t, e) {
		'use strict';
		function i(i, o, a) {
			function l(t, e, n) {
				var s,
					o = '$().' + i + '("' + e + '")';
				return (
					t.each(function(t, l) {
						var h = a.data(l, i);
						if (!h) return void r(i + ' not initialized. Cannot call methods, i.e. ' + o);
						var u = h[e];
						if (!u || '_' == e.charAt(0)) return void r(o + ' is not a valid method');
						var d = u.apply(h, n);
						s = void 0 === s ? d : s;
					}),
					void 0 !== s ? s : t
				);
			}
			function h(t, e) {
				t.each(function(t, n) {
					var s = a.data(n, i);
					s ? (s.option(e), s._init()) : ((s = new o(n, e)), a.data(n, i, s));
				});
			}
			(a = a || e || t.jQuery),
				a &&
					(o.prototype.option ||
						(o.prototype.option = function(t) {
							a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t));
						}),
					(a.fn[i] = function(t) {
						if ('string' == typeof t) {
							var e = s.call(arguments, 1);
							return l(this, t, e);
						}
						return h(this, t), this;
					}),
					n(a));
		}
		function n(t) {
			!t || (t && t.bridget) || (t.bridget = i);
		}
		var s = Array.prototype.slice,
			o = t.console,
			r =
				'undefined' == typeof o
					? function() {}
					: function(t) {
							o.error(t);
						};
		return n(e || t.jQuery), i;
	}),
	(function(t, e) {
		'function' == typeof define && define.amd
			? define('ev-emitter/ev-emitter', e)
			: 'object' == typeof module && module.exports ? (module.exports = e()) : (t.EvEmitter = e());
	})('undefined' != typeof window ? window : this, function() {
		function t() {}
		var e = t.prototype;
		return (
			(e.on = function(t, e) {
				if (t && e) {
					var i = (this._events = this._events || {}),
						n = (i[t] = i[t] || []);
					return -1 == n.indexOf(e) && n.push(e), this;
				}
			}),
			(e.once = function(t, e) {
				if (t && e) {
					this.on(t, e);
					var i = (this._onceEvents = this._onceEvents || {}),
						n = (i[t] = i[t] || {});
					return (n[e] = !0), this;
				}
			}),
			(e.off = function(t, e) {
				var i = this._events && this._events[t];
				if (i && i.length) {
					var n = i.indexOf(e);
					return -1 != n && i.splice(n, 1), this;
				}
			}),
			(e.emitEvent = function(t, e) {
				var i = this._events && this._events[t];
				if (i && i.length) {
					var n = 0,
						s = i[n];
					e = e || [];
					for (var o = this._onceEvents && this._onceEvents[t]; s; ) {
						var r = o && o[s];
						r && (this.off(t, s), delete o[s]), s.apply(this, e), (n += r ? 0 : 1), (s = i[n]);
					}
					return this;
				}
			}),
			t
		);
	}),
	(function(t, e) {
		'use strict';
		'function' == typeof define && define.amd
			? define('get-size/get-size', [], function() {
					return e();
				})
			: 'object' == typeof module && module.exports ? (module.exports = e()) : (t.getSize = e());
	})(window, function() {
		'use strict';
		function t(t) {
			var e = parseFloat(t),
				i = -1 == t.indexOf('%') && !isNaN(e);
			return i && e;
		}
		function e() {}
		function i() {
			for (
				var t = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 }, e = 0;
				h > e;
				e++
			) {
				var i = l[e];
				t[i] = 0;
			}
			return t;
		}
		function n(t) {
			var e = getComputedStyle(t);
			return (
				e ||
					a(
						'Style returned ' +
							e +
							'. Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1'
					),
				e
			);
		}
		function s() {
			if (!u) {
				u = !0;
				var e = document.createElement('div');
				(e.style.width = '200px'),
					(e.style.padding = '1px 2px 3px 4px'),
					(e.style.borderStyle = 'solid'),
					(e.style.borderWidth = '1px 2px 3px 4px'),
					(e.style.boxSizing = 'border-box');
				var i = document.body || document.documentElement;
				i.appendChild(e);
				var s = n(e);
				(o.isBoxSizeOuter = r = 200 == t(s.width)), i.removeChild(e);
			}
		}
		function o(e) {
			if (
				(s(), 'string' == typeof e && (e = document.querySelector(e)), e && 'object' == typeof e && e.nodeType)
			) {
				var o = n(e);
				if ('none' == o.display) return i();
				var a = {};
				(a.width = e.offsetWidth), (a.height = e.offsetHeight);
				for (var u = (a.isBorderBox = 'border-box' == o.boxSizing), d = 0; h > d; d++) {
					var c = l[d],
						p = o[c],
						f = parseFloat(p);
					a[c] = isNaN(f) ? 0 : f;
				}
				var g = a.paddingLeft + a.paddingRight,
					m = a.paddingTop + a.paddingBottom,
					y = a.marginLeft + a.marginRight,
					v = a.marginTop + a.marginBottom,
					_ = a.borderLeftWidth + a.borderRightWidth,
					w = a.borderTopWidth + a.borderBottomWidth,
					b = u && r,
					x = t(o.width);
				x !== !1 && (a.width = x + (b ? 0 : g + _));
				var C = t(o.height);
				return (
					C !== !1 && (a.height = C + (b ? 0 : m + w)),
					(a.innerWidth = a.width - (g + _)),
					(a.innerHeight = a.height - (m + w)),
					(a.outerWidth = a.width + y),
					(a.outerHeight = a.height + v),
					a
				);
			}
		}
		var r,
			a =
				'undefined' == typeof console
					? e
					: function(t) {
							console.error(t);
						},
			l = [
				'paddingLeft',
				'paddingRight',
				'paddingTop',
				'paddingBottom',
				'marginLeft',
				'marginRight',
				'marginTop',
				'marginBottom',
				'borderLeftWidth',
				'borderRightWidth',
				'borderTopWidth',
				'borderBottomWidth'
			],
			h = l.length,
			u = !1;
		return o;
	}),
	(function(t, e) {
		'use strict';
		'function' == typeof define && define.amd
			? define('desandro-matches-selector/matches-selector', e)
			: 'object' == typeof module && module.exports ? (module.exports = e()) : (t.matchesSelector = e());
	})(window, function() {
		'use strict';
		var t = (function() {
			var t = window.Element.prototype;
			if (t.matches) return 'matches';
			if (t.matchesSelector) return 'matchesSelector';
			for (var e = [ 'webkit', 'moz', 'ms', 'o' ], i = 0; i < e.length; i++) {
				var n = e[i],
					s = n + 'MatchesSelector';
				if (t[s]) return s;
			}
		})();
		return function(e, i) {
			return e[t](i);
		};
	}),
	(function(t, e) {
		'function' == typeof define && define.amd
			? define('fizzy-ui-utils/utils', [ 'desandro-matches-selector/matches-selector' ], function(i) {
					return e(t, i);
				})
			: 'object' == typeof module && module.exports
				? (module.exports = e(t, require('desandro-matches-selector')))
				: (t.fizzyUIUtils = e(t, t.matchesSelector));
	})(window, function(t, e) {
		var i = {};
		(i.extend = function(t, e) {
			for (var i in e) t[i] = e[i];
			return t;
		}),
			(i.modulo = function(t, e) {
				return (t % e + e) % e;
			}),
			(i.makeArray = function(t) {
				var e = [];
				if (Array.isArray(t)) e = t;
				else if (t && 'object' == typeof t && 'number' == typeof t.length)
					for (var i = 0; i < t.length; i++) e.push(t[i]);
				else e.push(t);
				return e;
			}),
			(i.removeFrom = function(t, e) {
				var i = t.indexOf(e);
				-1 != i && t.splice(i, 1);
			}),
			(i.getParent = function(t, i) {
				for (; t != document.body; ) if (((t = t.parentNode), e(t, i))) return t;
			}),
			(i.getQueryElement = function(t) {
				return 'string' == typeof t ? document.querySelector(t) : t;
			}),
			(i.handleEvent = function(t) {
				var e = 'on' + t.type;
				this[e] && this[e](t);
			}),
			(i.filterFindElements = function(t, n) {
				t = i.makeArray(t);
				var s = [];
				return (
					t.forEach(function(t) {
						if (t instanceof HTMLElement) {
							if (!n) return void s.push(t);
							e(t, n) && s.push(t);
							for (var i = t.querySelectorAll(n), o = 0; o < i.length; o++) s.push(i[o]);
						}
					}),
					s
				);
			}),
			(i.debounceMethod = function(t, e, i) {
				var n = t.prototype[e],
					s = e + 'Timeout';
				t.prototype[e] = function() {
					var t = this[s];
					t && clearTimeout(t);
					var e = arguments,
						o = this;
					this[s] = setTimeout(function() {
						n.apply(o, e), delete o[s];
					}, i || 100);
				};
			}),
			(i.docReady = function(t) {
				var e = document.readyState;
				'complete' == e || 'interactive' == e
					? setTimeout(t)
					: document.addEventListener('DOMContentLoaded', t);
			}),
			(i.toDashed = function(t) {
				return t
					.replace(/(.)([A-Z])/g, function(t, e, i) {
						return e + '-' + i;
					})
					.toLowerCase();
			});
		var n = t.console;
		return (
			(i.htmlInit = function(e, s) {
				i.docReady(function() {
					var o = i.toDashed(s),
						r = 'data-' + o,
						a = document.querySelectorAll('[' + r + ']'),
						l = document.querySelectorAll('.js-' + o),
						h = i.makeArray(a).concat(i.makeArray(l)),
						u = r + '-options',
						d = t.jQuery;
					h.forEach(function(t) {
						var i,
							o = t.getAttribute(r) || t.getAttribute(u);
						try {
							i = o && JSON.parse(o);
						} catch (a) {
							return void (n && n.error('Error parsing ' + r + ' on ' + t.className + ': ' + a));
						}
						var l = new e(t, i);
						d && d.data(t, s, l);
					});
				});
			}),
			i
		);
	}),
	(function(t, e) {
		'function' == typeof define && define.amd
			? define('outlayer/item', [ 'ev-emitter/ev-emitter', 'get-size/get-size' ], e)
			: 'object' == typeof module && module.exports
				? (module.exports = e(require('ev-emitter'), require('get-size')))
				: ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
	})(window, function(t, e) {
		'use strict';
		function i(t) {
			for (var e in t) return !1;
			return (e = null), !0;
		}
		function n(t, e) {
			t && ((this.element = t), (this.layout = e), (this.position = { x: 0, y: 0 }), this._create());
		}
		function s(t) {
			return t.replace(/([A-Z])/g, function(t) {
				return '-' + t.toLowerCase();
			});
		}
		var o = document.documentElement.style,
			r = 'string' == typeof o.transition ? 'transition' : 'WebkitTransition',
			a = 'string' == typeof o.transform ? 'transform' : 'WebkitTransform',
			l = { WebkitTransition: 'webkitTransitionEnd', transition: 'transitionend' }[r],
			h = {
				transform: a,
				transition: r,
				transitionDuration: r + 'Duration',
				transitionProperty: r + 'Property',
				transitionDelay: r + 'Delay'
			},
			u = (n.prototype = Object.create(t.prototype));
		(u.constructor = n),
			(u._create = function() {
				(this._transn = { ingProperties: {}, clean: {}, onEnd: {} }), this.css({ position: 'absolute' });
			}),
			(u.handleEvent = function(t) {
				var e = 'on' + t.type;
				this[e] && this[e](t);
			}),
			(u.getSize = function() {
				this.size = e(this.element);
			}),
			(u.css = function(t) {
				var e = this.element.style;
				for (var i in t) {
					var n = h[i] || i;
					e[n] = t[i];
				}
			}),
			(u.getPosition = function() {
				var t = getComputedStyle(this.element),
					e = this.layout._getOption('originLeft'),
					i = this.layout._getOption('originTop'),
					n = t[e ? 'left' : 'right'],
					s = t[i ? 'top' : 'bottom'],
					o = this.layout.size,
					r = -1 != n.indexOf('%') ? parseFloat(n) / 100 * o.width : parseInt(n, 10),
					a = -1 != s.indexOf('%') ? parseFloat(s) / 100 * o.height : parseInt(s, 10);
				(r = isNaN(r) ? 0 : r),
					(a = isNaN(a) ? 0 : a),
					(r -= e ? o.paddingLeft : o.paddingRight),
					(a -= i ? o.paddingTop : o.paddingBottom),
					(this.position.x = r),
					(this.position.y = a);
			}),
			(u.layoutPosition = function() {
				var t = this.layout.size,
					e = {},
					i = this.layout._getOption('originLeft'),
					n = this.layout._getOption('originTop'),
					s = i ? 'paddingLeft' : 'paddingRight',
					o = i ? 'left' : 'right',
					r = i ? 'right' : 'left',
					a = this.position.x + t[s];
				(e[o] = this.getXValue(a)), (e[r] = '');
				var l = n ? 'paddingTop' : 'paddingBottom',
					h = n ? 'top' : 'bottom',
					u = n ? 'bottom' : 'top',
					d = this.position.y + t[l];
				(e[h] = this.getYValue(d)), (e[u] = ''), this.css(e), this.emitEvent('layout', [ this ]);
			}),
			(u.getXValue = function(t) {
				var e = this.layout._getOption('horizontal');
				return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + '%' : t + 'px';
			}),
			(u.getYValue = function(t) {
				var e = this.layout._getOption('horizontal');
				return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + '%' : t + 'px';
			}),
			(u._transitionTo = function(t, e) {
				this.getPosition();
				var i = this.position.x,
					n = this.position.y,
					s = parseInt(t, 10),
					o = parseInt(e, 10),
					r = s === this.position.x && o === this.position.y;
				if ((this.setPosition(t, e), r && !this.isTransitioning)) return void this.layoutPosition();
				var a = t - i,
					l = e - n,
					h = {};
				(h.transform = this.getTranslate(a, l)),
					this.transition({ to: h, onTransitionEnd: { transform: this.layoutPosition }, isCleaning: !0 });
			}),
			(u.getTranslate = function(t, e) {
				var i = this.layout._getOption('originLeft'),
					n = this.layout._getOption('originTop');
				return (t = i ? t : -t), (e = n ? e : -e), 'translate3d(' + t + 'px, ' + e + 'px, 0)';
			}),
			(u.goTo = function(t, e) {
				this.setPosition(t, e), this.layoutPosition();
			}),
			(u.moveTo = u._transitionTo),
			(u.setPosition = function(t, e) {
				(this.position.x = parseInt(t, 10)), (this.position.y = parseInt(e, 10));
			}),
			(u._nonTransition = function(t) {
				this.css(t.to), t.isCleaning && this._removeStyles(t.to);
				for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
			}),
			(u.transition = function(t) {
				if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
				var e = this._transn;
				for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
				for (i in t.to) (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
				if (t.from) {
					this.css(t.from);
					var n = this.element.offsetHeight;
					n = null;
				}
				this.enableTransition(t.to), this.css(t.to), (this.isTransitioning = !0);
			});
		var d = 'opacity,' + s(a);
		(u.enableTransition = function() {
			if (!this.isTransitioning) {
				var t = this.layout.options.transitionDuration;
				(t = 'number' == typeof t ? t + 'ms' : t),
					this.css({ transitionProperty: d, transitionDuration: t, transitionDelay: this.staggerDelay || 0 }),
					this.element.addEventListener(l, this, !1);
			}
		}),
			(u.onwebkitTransitionEnd = function(t) {
				this.ontransitionend(t);
			}),
			(u.onotransitionend = function(t) {
				this.ontransitionend(t);
			});
		var c = { '-webkit-transform': 'transform' };
		(u.ontransitionend = function(t) {
			if (t.target === this.element) {
				var e = this._transn,
					n = c[t.propertyName] || t.propertyName;
				if (
					(delete e.ingProperties[n],
					i(e.ingProperties) && this.disableTransition(),
					n in e.clean && ((this.element.style[t.propertyName] = ''), delete e.clean[n]),
					n in e.onEnd)
				) {
					var s = e.onEnd[n];
					s.call(this), delete e.onEnd[n];
				}
				this.emitEvent('transitionEnd', [ this ]);
			}
		}),
			(u.disableTransition = function() {
				this.removeTransitionStyles(),
					this.element.removeEventListener(l, this, !1),
					(this.isTransitioning = !1);
			}),
			(u._removeStyles = function(t) {
				var e = {};
				for (var i in t) e[i] = '';
				this.css(e);
			});
		var p = { transitionProperty: '', transitionDuration: '', transitionDelay: '' };
		return (
			(u.removeTransitionStyles = function() {
				this.css(p);
			}),
			(u.stagger = function(t) {
				(t = isNaN(t) ? 0 : t), (this.staggerDelay = t + 'ms');
			}),
			(u.removeElem = function() {
				this.element.parentNode.removeChild(this.element),
					this.css({ display: '' }),
					this.emitEvent('remove', [ this ]);
			}),
			(u.remove = function() {
				return r && parseFloat(this.layout.options.transitionDuration)
					? (this.once('transitionEnd', function() {
							this.removeElem();
						}),
						void this.hide())
					: void this.removeElem();
			}),
			(u.reveal = function() {
				delete this.isHidden, this.css({ display: '' });
				var t = this.layout.options,
					e = {},
					i = this.getHideRevealTransitionEndProperty('visibleStyle');
				(e[i] = this.onRevealTransitionEnd),
					this.transition({ from: t.hiddenStyle, to: t.visibleStyle, isCleaning: !0, onTransitionEnd: e });
			}),
			(u.onRevealTransitionEnd = function() {
				this.isHidden || this.emitEvent('reveal');
			}),
			(u.getHideRevealTransitionEndProperty = function(t) {
				var e = this.layout.options[t];
				if (e.opacity) return 'opacity';
				for (var i in e) return i;
			}),
			(u.hide = function() {
				(this.isHidden = !0), this.css({ display: '' });
				var t = this.layout.options,
					e = {},
					i = this.getHideRevealTransitionEndProperty('hiddenStyle');
				(e[i] = this.onHideTransitionEnd),
					this.transition({ from: t.visibleStyle, to: t.hiddenStyle, isCleaning: !0, onTransitionEnd: e });
			}),
			(u.onHideTransitionEnd = function() {
				this.isHidden && (this.css({ display: 'none' }), this.emitEvent('hide'));
			}),
			(u.destroy = function() {
				this.css({ position: '', left: '', right: '', top: '', bottom: '', transition: '', transform: '' });
			}),
			n
		);
	}),
	(function(t, e) {
		'use strict';
		'function' == typeof define && define.amd
			? define(
					'outlayer/outlayer',
					[ 'ev-emitter/ev-emitter', 'get-size/get-size', 'fizzy-ui-utils/utils', './item' ],
					function(i, n, s, o) {
						return e(t, i, n, s, o);
					}
				)
			: 'object' == typeof module && module.exports
				? (module.exports = e(
						t,
						require('ev-emitter'),
						require('get-size'),
						require('fizzy-ui-utils'),
						require('./item')
					))
				: (t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item));
	})(window, function(t, e, i, n, s) {
		'use strict';
		function o(t, e) {
			var i = n.getQueryElement(t);
			if (!i) return void (l && l.error('Bad element for ' + this.constructor.namespace + ': ' + (i || t)));
			(this.element = i),
				h && (this.$element = h(this.element)),
				(this.options = n.extend({}, this.constructor.defaults)),
				this.option(e);
			var s = ++d;
			(this.element.outlayerGUID = s), (c[s] = this), this._create();
			var o = this._getOption('initLayout');
			o && this.layout();
		}
		function r(t) {
			function e() {
				t.apply(this, arguments);
			}
			return (e.prototype = Object.create(t.prototype)), (e.prototype.constructor = e), e;
		}
		function a(t) {
			if ('number' == typeof t) return t;
			var e = t.match(/(^\d*\.?\d*)(\w*)/),
				i = e && e[1],
				n = e && e[2];
			if (!i.length) return 0;
			i = parseFloat(i);
			var s = f[n] || 1;
			return i * s;
		}
		var l = t.console,
			h = t.jQuery,
			u = function() {},
			d = 0,
			c = {};
		(o.namespace = 'outlayer'),
			(o.Item = s),
			(o.defaults = {
				containerStyle: { position: 'relative' },
				initLayout: !0,
				originLeft: !0,
				originTop: !0,
				resize: !0,
				resizeContainer: !0,
				transitionDuration: '0.4s',
				hiddenStyle: { opacity: 0, transform: 'scale(0.001)' },
				visibleStyle: { opacity: 1, transform: 'scale(1)' }
			});
		var p = o.prototype;
		n.extend(p, e.prototype),
			(p.option = function(t) {
				n.extend(this.options, t);
			}),
			(p._getOption = function(t) {
				var e = this.constructor.compatOptions[t];
				return e && void 0 !== this.options[e] ? this.options[e] : this.options[t];
			}),
			(o.compatOptions = {
				initLayout: 'isInitLayout',
				horizontal: 'isHorizontal',
				layoutInstant: 'isLayoutInstant',
				originLeft: 'isOriginLeft',
				originTop: 'isOriginTop',
				resize: 'isResizeBound',
				resizeContainer: 'isResizingContainer'
			}),
			(p._create = function() {
				this.reloadItems(),
					(this.stamps = []),
					this.stamp(this.options.stamp),
					n.extend(this.element.style, this.options.containerStyle);
				var t = this._getOption('resize');
				t && this.bindResize();
			}),
			(p.reloadItems = function() {
				this.items = this._itemize(this.element.children);
			}),
			(p._itemize = function(t) {
				for (
					var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], s = 0;
					s < e.length;
					s++
				) {
					var o = e[s],
						r = new i(o, this);
					n.push(r);
				}
				return n;
			}),
			(p._filterFindItemElements = function(t) {
				return n.filterFindElements(t, this.options.itemSelector);
			}),
			(p.getItemElements = function() {
				return this.items.map(function(t) {
					return t.element;
				});
			}),
			(p.layout = function() {
				this._resetLayout(), this._manageStamps();
				var t = this._getOption('layoutInstant'),
					e = void 0 !== t ? t : !this._isLayoutInited;
				this.layoutItems(this.items, e), (this._isLayoutInited = !0);
			}),
			(p._init = p.layout),
			(p._resetLayout = function() {
				this.getSize();
			}),
			(p.getSize = function() {
				this.size = i(this.element);
			}),
			(p._getMeasurement = function(t, e) {
				var n,
					s = this.options[t];
				s
					? ('string' == typeof s ? (n = this.element.querySelector(s)) : s instanceof HTMLElement && (n = s),
						(this[t] = n ? i(n)[e] : s))
					: (this[t] = 0);
			}),
			(p.layoutItems = function(t, e) {
				(t = this._getItemsForLayout(t)), this._layoutItems(t, e), this._postLayout();
			}),
			(p._getItemsForLayout = function(t) {
				return t.filter(function(t) {
					return !t.isIgnored;
				});
			}),
			(p._layoutItems = function(t, e) {
				if ((this._emitCompleteOnItems('layout', t), t && t.length)) {
					var i = [];
					t.forEach(function(t) {
						var n = this._getItemLayoutPosition(t);
						(n.item = t), (n.isInstant = e || t.isLayoutInstant), i.push(n);
					}, this),
						this._processLayoutQueue(i);
				}
			}),
			(p._getItemLayoutPosition = function() {
				return { x: 0, y: 0 };
			}),
			(p._processLayoutQueue = function(t) {
				this.updateStagger(),
					t.forEach(function(t, e) {
						this._positionItem(t.item, t.x, t.y, t.isInstant, e);
					}, this);
			}),
			(p.updateStagger = function() {
				var t = this.options.stagger;
				return null === t || void 0 === t ? void (this.stagger = 0) : ((this.stagger = a(t)), this.stagger);
			}),
			(p._positionItem = function(t, e, i, n, s) {
				n ? t.goTo(e, i) : (t.stagger(s * this.stagger), t.moveTo(e, i));
			}),
			(p._postLayout = function() {
				this.resizeContainer();
			}),
			(p.resizeContainer = function() {
				var t = this._getOption('resizeContainer');
				if (t) {
					var e = this._getContainerSize();
					e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1));
				}
			}),
			(p._getContainerSize = u),
			(p._setContainerMeasure = function(t, e) {
				if (void 0 !== t) {
					var i = this.size;
					i.isBorderBox &&
						(t += e
							? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth
							: i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth),
						(t = Math.max(t, 0)),
						(this.element.style[e ? 'width' : 'height'] = t + 'px');
				}
			}),
			(p._emitCompleteOnItems = function(t, e) {
				function i() {
					s.dispatchEvent(t + 'Complete', null, [ e ]);
				}
				function n() {
					r++, r == o && i();
				}
				var s = this,
					o = e.length;
				if (!e || !o) return void i();
				var r = 0;
				e.forEach(function(e) {
					e.once(t, n);
				});
			}),
			(p.dispatchEvent = function(t, e, i) {
				var n = e ? [ e ].concat(i) : i;
				if ((this.emitEvent(t, n), h))
					if (((this.$element = this.$element || h(this.element)), e)) {
						var s = h.Event(e);
						(s.type = t), this.$element.trigger(s, i);
					} else this.$element.trigger(t, i);
			}),
			(p.ignore = function(t) {
				var e = this.getItem(t);
				e && (e.isIgnored = !0);
			}),
			(p.unignore = function(t) {
				var e = this.getItem(t);
				e && delete e.isIgnored;
			}),
			(p.stamp = function(t) {
				(t = this._find(t)), t && ((this.stamps = this.stamps.concat(t)), t.forEach(this.ignore, this));
			}),
			(p.unstamp = function(t) {
				(t = this._find(t)),
					t &&
						t.forEach(function(t) {
							n.removeFrom(this.stamps, t), this.unignore(t);
						}, this);
			}),
			(p._find = function(t) {
				return t
					? ('string' == typeof t && (t = this.element.querySelectorAll(t)), (t = n.makeArray(t)))
					: void 0;
			}),
			(p._manageStamps = function() {
				this.stamps &&
					this.stamps.length &&
					(this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this));
			}),
			(p._getBoundingRect = function() {
				var t = this.element.getBoundingClientRect(),
					e = this.size;
				this._boundingRect = {
					left: t.left + e.paddingLeft + e.borderLeftWidth,
					top: t.top + e.paddingTop + e.borderTopWidth,
					right: t.right - (e.paddingRight + e.borderRightWidth),
					bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
				};
			}),
			(p._manageStamp = u),
			(p._getElementOffset = function(t) {
				var e = t.getBoundingClientRect(),
					n = this._boundingRect,
					s = i(t),
					o = {
						left: e.left - n.left - s.marginLeft,
						top: e.top - n.top - s.marginTop,
						right: n.right - e.right - s.marginRight,
						bottom: n.bottom - e.bottom - s.marginBottom
					};
				return o;
			}),
			(p.handleEvent = n.handleEvent),
			(p.bindResize = function() {
				t.addEventListener('resize', this), (this.isResizeBound = !0);
			}),
			(p.unbindResize = function() {
				t.removeEventListener('resize', this), (this.isResizeBound = !1);
			}),
			(p.onresize = function() {
				this.resize();
			}),
			n.debounceMethod(o, 'onresize', 100),
			(p.resize = function() {
				this.isResizeBound && this.needsResizeLayout() && this.layout();
			}),
			(p.needsResizeLayout = function() {
				var t = i(this.element),
					e = this.size && t;
				return e && t.innerWidth !== this.size.innerWidth;
			}),
			(p.addItems = function(t) {
				var e = this._itemize(t);
				return e.length && (this.items = this.items.concat(e)), e;
			}),
			(p.appended = function(t) {
				var e = this.addItems(t);
				e.length && (this.layoutItems(e, !0), this.reveal(e));
			}),
			(p.prepended = function(t) {
				var e = this._itemize(t);
				if (e.length) {
					var i = this.items.slice(0);
					(this.items = e.concat(i)),
						this._resetLayout(),
						this._manageStamps(),
						this.layoutItems(e, !0),
						this.reveal(e),
						this.layoutItems(i);
				}
			}),
			(p.reveal = function(t) {
				if ((this._emitCompleteOnItems('reveal', t), t && t.length)) {
					var e = this.updateStagger();
					t.forEach(function(t, i) {
						t.stagger(i * e), t.reveal();
					});
				}
			}),
			(p.hide = function(t) {
				if ((this._emitCompleteOnItems('hide', t), t && t.length)) {
					var e = this.updateStagger();
					t.forEach(function(t, i) {
						t.stagger(i * e), t.hide();
					});
				}
			}),
			(p.revealItemElements = function(t) {
				var e = this.getItems(t);
				this.reveal(e);
			}),
			(p.hideItemElements = function(t) {
				var e = this.getItems(t);
				this.hide(e);
			}),
			(p.getItem = function(t) {
				for (var e = 0; e < this.items.length; e++) {
					var i = this.items[e];
					if (i.element == t) return i;
				}
			}),
			(p.getItems = function(t) {
				t = n.makeArray(t);
				var e = [];
				return (
					t.forEach(function(t) {
						var i = this.getItem(t);
						i && e.push(i);
					}, this),
					e
				);
			}),
			(p.remove = function(t) {
				var e = this.getItems(t);
				this._emitCompleteOnItems('remove', e),
					e &&
						e.length &&
						e.forEach(function(t) {
							t.remove(), n.removeFrom(this.items, t);
						}, this);
			}),
			(p.destroy = function() {
				var t = this.element.style;
				(t.height = ''),
					(t.position = ''),
					(t.width = ''),
					this.items.forEach(function(t) {
						t.destroy();
					}),
					this.unbindResize();
				var e = this.element.outlayerGUID;
				delete c[e],
					delete this.element.outlayerGUID,
					h && h.removeData(this.element, this.constructor.namespace);
			}),
			(o.data = function(t) {
				t = n.getQueryElement(t);
				var e = t && t.outlayerGUID;
				return e && c[e];
			}),
			(o.create = function(t, e) {
				var i = r(o);
				return (
					(i.defaults = n.extend({}, o.defaults)),
					n.extend(i.defaults, e),
					(i.compatOptions = n.extend({}, o.compatOptions)),
					(i.namespace = t),
					(i.data = o.data),
					(i.Item = r(s)),
					n.htmlInit(i, t),
					h && h.bridget && h.bridget(t, i),
					i
				);
			});
		var f = { ms: 1, s: 1e3 };
		return (o.Item = s), o;
	}),
	(function(t, e) {
		'function' == typeof define && define.amd
			? define([ 'outlayer/outlayer', 'get-size/get-size' ], e)
			: 'object' == typeof module && module.exports
				? (module.exports = e(require('outlayer'), require('get-size')))
				: (t.Masonry = e(t.Outlayer, t.getSize));
	})(window, function(t, e) {
		var i = t.create('masonry');
		i.compatOptions.fitWidth = 'isFitWidth';
		var n = i.prototype;
		return (
			(n._resetLayout = function() {
				this.getSize(),
					this._getMeasurement('columnWidth', 'outerWidth'),
					this._getMeasurement('gutter', 'outerWidth'),
					this.measureColumns(),
					(this.colYs = []);
				for (var t = 0; t < this.cols; t++) this.colYs.push(0);
				(this.maxY = 0), (this.horizontalColIndex = 0);
			}),
			(n.measureColumns = function() {
				if ((this.getContainerWidth(), !this.columnWidth)) {
					var t = this.items[0],
						i = t && t.element;
					this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
				}
				var n = (this.columnWidth += this.gutter),
					s = this.containerWidth + this.gutter,
					o = s / n,
					r = n - s % n,
					a = r && 1 > r ? 'round' : 'floor';
				(o = Math[a](o)), (this.cols = Math.max(o, 1));
			}),
			(n.getContainerWidth = function() {
				var t = this._getOption('fitWidth'),
					i = t ? this.element.parentNode : this.element,
					n = e(i);
				this.containerWidth = n && n.innerWidth;
			}),
			(n._getItemLayoutPosition = function(t) {
				t.getSize();
				var e = t.size.outerWidth % this.columnWidth,
					i = e && 1 > e ? 'round' : 'ceil',
					n = Math[i](t.size.outerWidth / this.columnWidth);
				n = Math.min(n, this.cols);
				for (
					var s = this.options.horizontalOrder ? '_getHorizontalColPosition' : '_getTopColPosition',
						o = this[s](n, t),
						r = { x: this.columnWidth * o.col, y: o.y },
						a = o.y + t.size.outerHeight,
						l = n + o.col,
						h = o.col;
					l > h;
					h++
				)
					this.colYs[h] = a;
				return r;
			}),
			(n._getTopColPosition = function(t) {
				var e = this._getTopColGroup(t),
					i = Math.min.apply(Math, e);
				return { col: e.indexOf(i), y: i };
			}),
			(n._getTopColGroup = function(t) {
				if (2 > t) return this.colYs;
				for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) e[n] = this._getColGroupY(n, t);
				return e;
			}),
			(n._getColGroupY = function(t, e) {
				if (2 > e) return this.colYs[t];
				var i = this.colYs.slice(t, t + e);
				return Math.max.apply(Math, i);
			}),
			(n._getHorizontalColPosition = function(t, e) {
				var i = this.horizontalColIndex % this.cols,
					n = t > 1 && i + t > this.cols;
				i = n ? 0 : i;
				var s = e.size.outerWidth && e.size.outerHeight;
				return (
					(this.horizontalColIndex = s ? i + t : this.horizontalColIndex),
					{ col: i, y: this._getColGroupY(i, t) }
				);
			}),
			(n._manageStamp = function(t) {
				var i = e(t),
					n = this._getElementOffset(t),
					s = this._getOption('originLeft'),
					o = s ? n.left : n.right,
					r = o + i.outerWidth,
					a = Math.floor(o / this.columnWidth);
				a = Math.max(0, a);
				var l = Math.floor(r / this.columnWidth);
				(l -= r % this.columnWidth ? 0 : 1), (l = Math.min(this.cols - 1, l));
				for (
					var h = this._getOption('originTop'), u = (h ? n.top : n.bottom) + i.outerHeight, d = a;
					l >= d;
					d++
				)
					this.colYs[d] = Math.max(u, this.colYs[d]);
			}),
			(n._getContainerSize = function() {
				this.maxY = Math.max.apply(Math, this.colYs);
				var t = { height: this.maxY };
				return this._getOption('fitWidth') && (t.width = this._getContainerFitWidth()), t;
			}),
			(n._getContainerFitWidth = function() {
				for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
				return (this.cols - t) * this.columnWidth - this.gutter;
			}),
			(n.needsResizeLayout = function() {
				var t = this.containerWidth;
				return this.getContainerWidth(), t != this.containerWidth;
			}),
			i
		);
	}),
	(function(t, e) {
		var $ = t.jQuery || t.Cowboy || (t.Cowboy = {}),
			i;
		($.throttle = i = function(t, i, n, s) {
			function o() {
				function o() {
					(a = +new Date()), n.apply(h, d);
				}
				function l() {
					r = e;
				}
				var h = this,
					u = +new Date() - a,
					d = arguments;
				s && !r && o(),
					r && clearTimeout(r),
					s === e && u > t ? o() : i !== !0 && (r = setTimeout(s ? l : o, s === e ? t - u : t));
			}
			var r,
				a = 0;
			return (
				'boolean' != typeof i && ((s = n), (n = i), (i = e)),
				$.guid && (o.guid = n.guid = n.guid || $.guid++),
				o
			);
		}),
			($.debounce = function(t, n, s) {
				return s === e ? i(t, n, !1) : i(t, s, n !== !1);
			});
	})(this),
	!(function(t, e, i, n) {
		'use strict';
		function s(e, i) {
			this.element = e;
			var n = {};
			t.each(t(this.element).data(), function(t, e) {
				var i = function(t) {
						return t && t[0].toLowerCase() + t.slice(1);
					},
					s = i(t.replace('fluidbox', ''));
				('' !== s || null !== s) && ('false' == e ? (e = !1) : 'true' == e && (e = !0), (n[s] = e));
			}),
				(this.settings = t.extend({}, a, i, n)),
				(this.settings.viewportFill = Math.max(Math.min(parseFloat(this.settings.viewportFill), 1), 0)),
				this.settings.stackIndex < this.settings.stackIndexDelta &&
					(settings.stackIndexDelta = settings.stackIndex),
				(this._name = r),
				this.init();
		}
		var o = t(e),
			r = (t(i), 'fluidbox'),
			a = {
				immediateOpen: !1,
				loader: !1,
				maxWidth: 0,
				maxHeight: 0,
				resizeThrottle: 500,
				stackIndex: 1e3,
				stackIndexDelta: 10,
				viewportFill: 0.95
			},
			l = {},
			h = 0;
		('undefined' == typeof console || 'undefined' === console.warn) &&
			((console = {}), (console.warn = function() {})),
			t.isFunction(t.throttle) ||
				console.warn(
					'Fluidbox: The jQuery debounce/throttle plugin is not found/loaded. Even though Fluidbox works without it, the window resize event will fire extremely rapidly in browsers, resulting in significant degradation in performance upon viewport resize.'
				);
		var u = function() {
				var t,
					e = i.createElement('fakeelement'),
					s = {
						transition: 'transitionend',
						OTransition: 'oTransitionEnd',
						MozTransition: 'transitionend',
						WebkitTransition: 'webkitTransitionEnd'
					};
				for (t in s) if (e.style[t] !== n) return s[t];
			},
			d = u(),
			c = {
				dom: function() {
					var e = t('<div />', {
						class: 'fluidbox__wrap',
						css: { zIndex: this.settings.stackIndex - this.settings.stackIndexDelta }
					});
					if (
						(t(this.element)
							.addClass('fluidbox--closed')
							.wrapInner(e)
							.find('img')
							.first()
							.css({ opacity: 1 })
							.addClass('fluidbox__thumb')
							.after('<div class="fluidbox__ghost" />'),
						this.settings.loader)
					) {
						var i = t('<div />', { class: 'fluidbox__loader', css: { zIndex: 2 } });
						t(this.element).find('.fluidbox__wrap').append(i);
					}
				},
				prepareFb: function() {
					var e = this,
						i = t(this.element);
					i.trigger('thumbloaddone.fluidbox'),
						c.measure.fbElements.call(this),
						e.bindEvents(),
						i.addClass('fluidbox--ready'),
						e.bindListeners(),
						i.trigger('ready.fluidbox');
				},
				measure: {
					viewport: function() {
						l.viewport = { w: o.width(), h: o.height() };
					},
					fbElements: function() {
						var e = this,
							i = t(this.element),
							n = i.find('img').first(),
							s = i.find('.fluidbox__ghost'),
							o = i.find('.fluidbox__wrap');
						(e.instanceData.thumb = {
							natW: n[0].naturalWidth,
							natH: n[0].naturalHeight,
							w: n.width(),
							h: n.height()
						}),
							s.css({
								width: n.width(),
								height: n.height(),
								top:
									n.offset().top -
									o.offset().top +
									parseInt(n.css('borderTopWidth')) +
									parseInt(n.css('paddingTop')),
								left:
									n.offset().left -
									o.offset().left +
									parseInt(n.css('borderLeftWidth')) +
									parseInt(n.css('paddingLeft'))
							});
					}
				},
				checkURL: function(t) {
					var e = 0;
					return (
						/[\s+]/g.test(t)
							? (console.warn(
									'Fluidbox: Fluidbox opening is halted because it has detected characters in your URL string that need to be properly encoded/escaped. Whitespace(s) have to be escaped manually. See RFC3986 documentation.'
								),
								(e = 1))
							: /[\"\'\(\)]/g.test(t) &&
								(console.warn(
									'Fluidbox: Fluidbox opening will proceed, but it has detected characters in your URL string that need to be properly encoded/escaped. These will be escaped for you. See RFC3986 documentation.'
								),
								(e = 0)),
						e
					);
				},
				formatURL: function(t) {
					return t.replace(/"/g, '%22').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
				}
			};
		t.extend(s.prototype, {
			init: function() {
				var e = this,
					i = t(this.element),
					n = i.find('img').first();
				if (
					(c.measure.viewport(),
					(!e.instanceData || !e.instanceData.initialized) &&
						i.is('a') &&
						1 === i.children().length &&
						(i.children().is('img') || (i.children().is('picture') && 1 === i.find('img').length)) &&
						'none' !== i.css('display') &&
						'none' !== i.children().css('display') &&
						'none' !== i.parents().css('display'))
				) {
					i.removeClass('fluidbox--destroyed'),
						(e.instanceData = {}),
						(e.instanceData.initialized = !0),
						(e.instanceData.originalNode = i.html()),
						(h += 1),
						(e.instanceData.id = h),
						i.addClass('fluidbox__instance-' + h),
						i.addClass('fluidbox--initialized'),
						c.dom.call(e),
						i.trigger('init.fluidbox');
					var s = new Image();
					n.width() > 0 && n.height() > 0
						? c.prepareFb.call(e)
						: ((s.onload = function() {
								c.prepareFb.call(e);
							}),
							(s.onerror = function() {
								i.trigger('thumbloadfail.fluidbox');
							}),
							(s.src = n.attr('src')));
				}
			},
			open: function() {
				var e = this,
					i = t(this.element),
					n = i.find('img').first(),
					s = i.find('.fluidbox__ghost'),
					o = i.find('.fluidbox__wrap');
				(e.instanceData.state = 1), s.off(d), t('.fluidbox--opened').fluidbox('close');
				var r = t('<div />', { class: 'fluidbox__overlay', css: { zIndex: -1 } });
				if (
					(o.append(r),
					i.removeClass('fluidbox--closed').addClass('fluidbox--loading'),
					c.checkURL(n.attr('src')))
				)
					return e.close(), !1;
				s.css({ 'background-image': 'url(' + c.formatURL(n.attr('src')) + ')', opacity: 1 }),
					c.measure.fbElements.call(e);
				var a;
				e.settings.immediateOpen
					? (i
							.addClass('fluidbox--opened fluidbox--loaded')
							.find('.fluidbox__wrap')
							.css({ zIndex: e.settings.stackIndex + e.settings.stackIndexDelta }),
						i.trigger('openstart.fluidbox'),
						e.compute(),
						n.css({ opacity: 0 }),
						t('.fluidbox__overlay').css({ opacity: 1 }),
						s.one(d, function() {
							i.trigger('openend.fluidbox');
						}),
						(a = new Image()),
						(a.onload = function() {
							if ((i.trigger('imageloaddone.fluidbox'), 1 === e.instanceData.state)) {
								if (
									((e.instanceData.thumb.natW = a.naturalWidth),
									(e.instanceData.thumb.natH = a.naturalHeight),
									i.removeClass('fluidbox--loading'),
									c.checkURL(a.src))
								)
									return e.close({ error: !0 }), !1;
								s.css({ 'background-image': 'url(' + c.formatURL(a.src) + ')' }), e.compute();
							}
						}),
						(a.onerror = function() {
							e.close({ error: !0 }),
								i.trigger('imageloadfail.fluidbox'),
								i.trigger('delayedloadfail.fluidbox');
						}),
						(a.src = i.attr('href')))
					: ((a = new Image()),
						(a.onload = function() {
							return (
								i.trigger('imageloaddone.fluidbox'),
								i
									.removeClass('fluidbox--loading')
									.addClass('fluidbox--opened fluidbox--loaded')
									.find('.fluidbox__wrap')
									.css({ zIndex: e.settings.stackIndex + e.settings.stackIndexDelta }),
								i.trigger('openstart.fluidbox'),
								c.checkURL(a.src)
									? (e.close({ error: !0 }), !1)
									: (s.css({ 'background-image': 'url(' + c.formatURL(a.src) + ')' }),
										(e.instanceData.thumb.natW = a.naturalWidth),
										(e.instanceData.thumb.natH = a.naturalHeight),
										e.compute(),
										n.css({ opacity: 0 }),
										t('.fluidbox__overlay').css({ opacity: 1 }),
										void s.one(d, function() {
											i.trigger('openend.fluidbox');
										}))
							);
						}),
						(a.onerror = function() {
							e.close({ error: !0 }), i.trigger('imageloadfail.fluidbox');
						}),
						(a.src = i.attr('href')));
			},
			compute: function() {
				var e = this,
					i = t(this.element),
					n = i.find('img').first(),
					s = i.find('.fluidbox__ghost'),
					r = i.find('.fluidbox__wrap'),
					a = e.instanceData.thumb.natW,
					h = e.instanceData.thumb.natH,
					u = e.instanceData.thumb.w,
					d = e.instanceData.thumb.h,
					c = a / h,
					p = l.viewport.w / l.viewport.h;
				e.settings.maxWidth > 0
					? ((a = e.settings.maxWidth), (h = a / c))
					: e.settings.maxHeight > 0 && ((h = e.settings.maxHeight), (a = h * c));
				var f, g, m, y, v;
				p > c
					? ((f = h < l.viewport.h ? h : l.viewport.h * e.settings.viewportFill),
						(m = f / d),
						(y = a * (d * m / h) / u),
						(v = m))
					: ((g = a < l.viewport.w ? a : l.viewport.w * e.settings.viewportFill),
						(y = g / u),
						(m = h * (u * y / a) / d),
						(v = y)),
					e.settings.maxWidth &&
						e.settings.maxHeight &&
						console.warn(
							'Fluidbox: Both maxHeight and maxWidth are specified. You can only specify one. If both are specified, only the maxWidth property will be respected. This will not generate any error, but may cause unexpected sizing behavior.'
						);
				var _ = o.scrollTop() - n.offset().top + 0.5 * d * (v - 1) + 0.5 * (o.height() - d * v),
					w = 0.5 * u * (v - 1) + 0.5 * (o.width() - u * v) - n.offset().left,
					b = parseInt(100 * y) / 100 + ',' + parseInt(100 * m) / 100;
				s.css({
					transform:
						'translate(' +
						parseInt(100 * w) / 100 +
						'px,' +
						parseInt(100 * _) / 100 +
						'px) scale(' +
						b +
						')',
					top: n.offset().top - r.offset().top,
					left: n.offset().left - r.offset().left
				}),
					i
						.find('.fluidbox__loader')
						.css({
							transform:
								'translate(' +
								parseInt(100 * w) / 100 +
								'px,' +
								parseInt(100 * _) / 100 +
								'px) scale(' +
								b +
								')'
						}),
					i.trigger('computeend.fluidbox');
			},
			recompute: function() {
				this.compute();
			},
			close: function(e) {
				var i = this,
					s = t(this.element),
					o = s.find('img').first(),
					r = s.find('.fluidbox__ghost'),
					a = s.find('.fluidbox__wrap'),
					l = s.find('.fluidbox__overlay'),
					h = t.extend(null, { error: !1 }, e);
				return null === i.instanceData.state ||
				typeof i.instanceData.state == typeof n ||
				0 === i.instanceData.state
					? !1
					: ((i.instanceData.state = 0),
						s.trigger('closestart.fluidbox'),
						s
							.removeClass(function(t, e) {
								return (e.match(/(^|\s)fluidbox--(opened|loaded|loading)+/g) || []).join(' ');
							})
							.addClass('fluidbox--closed'),
						r.css({
							transform: 'translate(0,0) scale(1,1)',
							top:
								o.offset().top -
								a.offset().top +
								parseInt(o.css('borderTopWidth')) +
								parseInt(o.css('paddingTop')),
							left:
								o.offset().left -
								a.offset().left +
								parseInt(o.css('borderLeftWidth')) +
								parseInt(o.css('paddingLeft'))
						}),
						s.find('.fluidbox__loader').css({ transform: 'none' }),
						r.one(d, function() {
							r.css({ opacity: 0 }),
								o.css({ opacity: 1 }),
								l.remove(),
								a.css({ zIndex: i.settings.stackIndex - i.settings.stackIndexDelta }),
								s.trigger('closeend.fluidbox');
						}),
						h.error && r.trigger('transitionend'),
						void l.css({ opacity: 0 }));
			},
			bindEvents: function() {
				var e = this,
					i = t(this.element);
				i.on('click.fluidbox', function(t) {
					t.preventDefault(), e.instanceData.state && 0 !== e.instanceData.state ? e.close() : e.open();
				});
			},
			bindListeners: function() {
				var e = this,
					i = t(this.element),
					n = function() {
						c.measure.viewport(),
							c.measure.fbElements.call(e),
							i.hasClass('fluidbox--opened') && e.compute();
					};
				t.isFunction(t.throttle)
					? o.on('resize.fluidbox' + e.instanceData.id, t.throttle(e.settings.resizeThrottle, n))
					: o.on('resize.fluidbox' + e.instanceData.id, n),
					i.on('reposition.fluidbox', function() {
						e.reposition();
					}),
					i.on('recompute.fluidbox, compute.fluidbox', function() {
						e.compute();
					}),
					i.on('destroy.fluidbox', function() {
						e.destroy();
					}),
					i.on('close.fluidbox', function() {
						e.close();
					});
			},
			unbind: function() {
				t(this.element).off(
					'click.fluidbox reposition.fluidbox recompute.fluidbox compute.fluidbox destroy.fluidbox close.fluidbox'
				),
					o.off('resize.fluidbox' + this.instanceData.id);
			},
			reposition: function() {
				c.measure.fbElements.call(this);
			},
			destroy: function() {
				var e = this.instanceData.originalNode;
				this.unbind(),
					t.data(this.element, 'plugin_' + r, null),
					t(this.element)
						.removeClass(function(t, e) {
							return (e.match(/(^|\s)fluidbox[--|__]\S+/g) || []).join(' ');
						})
						.empty()
						.html(e)
						.addClass('fluidbox--destroyed')
						.trigger('destroyed.fluidbox');
			},
			getMetadata: function() {
				return this.instanceData;
			}
		}),
			(t.fn[r] = function(e) {
				var i = arguments;
				if (e === n || 'object' == typeof e)
					return this.each(function() {
						t.data(this, 'plugin_' + r) || t.data(this, 'plugin_' + r, new s(this, e));
					});
				if ('string' == typeof e && '_' !== e[0] && 'init' !== e) {
					var o;
					return (
						this.each(function() {
							var n = t.data(this, 'plugin_' + r);
							n instanceof s && 'function' == typeof n[e]
								? (o = n[e].apply(n, Array.prototype.slice.call(i, 1)))
								: console.warn(
										'Fluidbox: The method "' +
											e +
											'" used is not defined in Fluidbox. Please make sure you are calling the correct public method.'
									);
						}),
						o !== n ? o : this
					);
				}
				return this;
			});
	})(jQuery, window, document),
	!(function(t, e, i, n) {
		function s(e, i) {
			(this.settings = null),
				(this.options = t.extend({}, s.Defaults, i)),
				(this.$element = t(e)),
				(this._handlers = {}),
				(this._plugins = {}),
				(this._supress = {}),
				(this._current = null),
				(this._speed = null),
				(this._coordinates = []),
				(this._breakpoint = null),
				(this._width = null),
				(this._items = []),
				(this._clones = []),
				(this._mergers = []),
				(this._widths = []),
				(this._invalidated = {}),
				(this._pipe = []),
				(this._drag = {
					time: null,
					target: null,
					pointer: null,
					stage: { start: null, current: null },
					direction: null
				}),
				(this._states = {
					current: {},
					tags: { initializing: [ 'busy' ], animating: [ 'busy' ], dragging: [ 'interacting' ] }
				}),
				t.each(
					[ 'onResize', 'onThrottledResize' ],
					t.proxy(function(e, i) {
						this._handlers[i] = t.proxy(this[i], this);
					}, this)
				),
				t.each(
					s.Plugins,
					t.proxy(function(t, e) {
						this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this);
					}, this)
				),
				t.each(
					s.Workers,
					t.proxy(function(e, i) {
						this._pipe.push({ filter: i.filter, run: t.proxy(i.run, this) });
					}, this)
				),
				this.setup(),
				this.initialize();
		}
		(s.Defaults = {
			items: 3,
			loop: !1,
			center: !1,
			rewind: !1,
			mouseDrag: !0,
			touchDrag: !0,
			pullDrag: !0,
			freeDrag: !1,
			margin: 0,
			stagePadding: 0,
			merge: !1,
			mergeFit: !0,
			autoWidth: !1,
			startPosition: 0,
			rtl: !1,
			smartSpeed: 250,
			fluidSpeed: !1,
			dragEndSpeed: !1,
			responsive: {},
			responsiveRefreshRate: 200,
			responsiveBaseElement: e,
			fallbackEasing: 'swing',
			info: !1,
			nestedItemSelector: !1,
			itemElement: 'div',
			stageElement: 'div',
			refreshClass: 'owl-refresh',
			loadedClass: 'owl-loaded',
			loadingClass: 'owl-loading',
			rtlClass: 'owl-rtl',
			responsiveClass: 'owl-responsive',
			dragClass: 'owl-drag',
			itemClass: 'owl-item',
			stageClass: 'owl-stage',
			stageOuterClass: 'owl-stage-outer',
			grabClass: 'owl-grab'
		}),
			(s.Width = { Default: 'default', Inner: 'inner', Outer: 'outer' }),
			(s.Type = { Event: 'event', State: 'state' }),
			(s.Plugins = {}),
			(s.Workers = [
				{
					filter: [ 'width', 'settings' ],
					run: function() {
						this._width = this.$element.width();
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function(t) {
						t.current = this._items && this._items[this.relative(this._current)];
					}
				},
				{
					filter: [ 'items', 'settings' ],
					run: function() {
						this.$stage.children('.cloned').remove();
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function(t) {
						var e = this.settings.margin || '',
							i = !this.settings.autoWidth,
							n = this.settings.rtl,
							s = { width: 'auto', 'margin-left': n ? e : '', 'margin-right': n ? '' : e };
						!i && this.$stage.children().css(s), (t.css = s);
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function(t) {
						var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
							i = null,
							n = this._items.length,
							s = !this.settings.autoWidth,
							o = [];
						for (t.items = { merge: !1, width: e }; n--; )
							(i = this._mergers[n]),
								(i = (this.settings.mergeFit && Math.min(i, this.settings.items)) || i),
								(t.items.merge = i > 1 || t.items.merge),
								(o[n] = s ? e * i : this._items[n].width());
						this._widths = o;
					}
				},
				{
					filter: [ 'items', 'settings' ],
					run: function() {
						var e = [],
							i = this._items,
							n = this.settings,
							s = Math.max(2 * n.items, 4),
							o = 2 * Math.ceil(i.length / 2),
							r = n.loop && i.length ? (n.rewind ? s : Math.max(s, o)) : 0,
							a = '',
							l = '';
						for (r /= 2; r > 0; )
							e.push(this.normalize(e.length / 2, !0)),
								(a += i[e[e.length - 1]][0].outerHTML),
								e.push(this.normalize(i.length - 1 - (e.length - 1) / 2, !0)),
								(l = i[e[e.length - 1]][0].outerHTML + l),
								(r -= 1);
						(this._clones = e),
							t(a).addClass('cloned').appendTo(this.$stage),
							t(l).addClass('cloned').prependTo(this.$stage);
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function() {
						for (
							var t = this.settings.rtl ? 1 : -1,
								e = this._clones.length + this._items.length,
								i = -1,
								n = 0,
								s = 0,
								o = [];
							++i < e;

						)
							(n = o[i - 1] || 0),
								(s = this._widths[this.relative(i)] + this.settings.margin),
								o.push(n + s * t);
						this._coordinates = o;
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function() {
						var t = this.settings.stagePadding,
							e = this._coordinates,
							i = {
								width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
								'padding-left': t || '',
								'padding-right': t || ''
							};
						this.$stage.css(i);
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function(t) {
						var e = this._coordinates.length,
							i = !this.settings.autoWidth,
							n = this.$stage.children();
						if (i && t.items.merge)
							for (; e--; ) (t.css.width = this._widths[this.relative(e)]), n.eq(e).css(t.css);
						else i && ((t.css.width = t.items.width), n.css(t.css));
					}
				},
				{
					filter: [ 'items' ],
					run: function() {
						this._coordinates.length < 1 && this.$stage.removeAttr('style');
					}
				},
				{
					filter: [ 'width', 'items', 'settings' ],
					run: function(t) {
						(t.current = t.current ? this.$stage.children().index(t.current) : 0),
							(t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current))),
							this.reset(t.current);
					}
				},
				{
					filter: [ 'position' ],
					run: function() {
						this.animate(this.coordinates(this._current));
					}
				},
				{
					filter: [ 'width', 'position', 'items', 'settings' ],
					run: function() {
						var t,
							e,
							i,
							n,
							s = this.settings.rtl ? 1 : -1,
							o = 2 * this.settings.stagePadding,
							r = this.coordinates(this.current()) + o,
							a = r + this.width() * s,
							l = [];
						for (i = 0, n = this._coordinates.length; n > i; i++)
							(t = this._coordinates[i - 1] || 0),
								(e = Math.abs(this._coordinates[i]) + o * s),
								((this.op(t, '<=', r) && this.op(t, '>', a)) ||
									(this.op(e, '<', r) && this.op(e, '>', a))) &&
									l.push(i);
						this.$stage.children('.active').removeClass('active'),
							this.$stage.children(':eq(' + l.join('), :eq(') + ')').addClass('active'),
							this.$stage.children('.center').removeClass('center'),
							this.settings.center && this.$stage.children().eq(this.current()).addClass('center');
					}
				}
			]),
			(s.prototype.initialize = function() {
				if (
					(this.enter('initializing'),
					this.trigger('initialize'),
					this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
					this.settings.autoWidth && !this.is('pre-loading'))
				) {
					var e, i, s;
					(e = this.$element.find('img')),
						(i = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : n),
						(s = this.$element.children(i).width()),
						e.length && 0 >= s && this.preloadAutoWidthImages(e);
				}
				this.$element.addClass(this.options.loadingClass),
					(this.$stage = t(
						'<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>'
					).wrap('<div class="' + this.settings.stageOuterClass + '"/>')),
					this.$element.append(this.$stage.parent()),
					this.replace(this.$element.children().not(this.$stage.parent())),
					this.$element.is(':visible') ? this.refresh() : this.invalidate('width'),
					this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass),
					this.registerEventHandlers(),
					this.leave('initializing'),
					this.trigger('initialized');
			}),
			(s.prototype.setup = function() {
				var e = this.viewport(),
					i = this.options.responsive,
					n = -1,
					s = null;
				i
					? (t.each(i, function(t) {
							e >= t && t > n && (n = Number(t));
						}),
						(s = t.extend({}, this.options, i[n])),
						'function' == typeof s.stagePadding && (s.stagePadding = s.stagePadding()),
						delete s.responsive,
						s.responsiveClass &&
							this.$element.attr(
								'class',
								this.$element
									.attr('class')
									.replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + n)
							))
					: (s = t.extend({}, this.options)),
					this.trigger('change', { property: { name: 'settings', value: s } }),
					(this._breakpoint = n),
					(this.settings = s),
					this.invalidate('settings'),
					this.trigger('changed', { property: { name: 'settings', value: this.settings } });
			}),
			(s.prototype.optionsLogic = function() {
				this.settings.autoWidth && ((this.settings.stagePadding = !1), (this.settings.merge = !1));
			}),
			(s.prototype.prepare = function(e) {
				var i = this.trigger('prepare', { content: e });
				return (
					i.data ||
						(i.data = t('<' + this.settings.itemElement + '/>').addClass(this.options.itemClass).append(e)),
					this.trigger('prepared', { content: i.data }),
					i.data
				);
			}),
			(s.prototype.update = function() {
				for (
					var e = 0,
						i = this._pipe.length,
						n = t.proxy(function(t) {
							return this[t];
						}, this._invalidated),
						s = {};
					i > e;

				)
					(this._invalidated.all || t.grep(this._pipe[e].filter, n).length > 0) && this._pipe[e].run(s), e++;
				(this._invalidated = {}), !this.is('valid') && this.enter('valid');
			}),
			(s.prototype.width = function(t) {
				switch ((t = t || s.Width.Default)) {
					case s.Width.Inner:
					case s.Width.Outer:
						return this._width;
					default:
						return this._width - 2 * this.settings.stagePadding + this.settings.margin;
				}
			}),
			(s.prototype.refresh = function() {
				this.enter('refreshing'),
					this.trigger('refresh'),
					this.setup(),
					this.optionsLogic(),
					this.$element.addClass(this.options.refreshClass),
					this.update(),
					this.$element.removeClass(this.options.refreshClass),
					this.leave('refreshing'),
					this.trigger('refreshed');
			}),
			(s.prototype.onThrottledResize = function() {
				e.clearTimeout(this.resizeTimer),
					(this.resizeTimer = e.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate));
			}),
			(s.prototype.onResize = function() {
				return (
					!!this._items.length &&
					this._width !== this.$element.width() &&
					!!this.$element.is(':visible') &&
					(this.enter('resizing'),
					this.trigger('resize').isDefaultPrevented()
						? (this.leave('resizing'), !1)
						: (this.invalidate('width'),
							this.refresh(),
							this.leave('resizing'),
							void this.trigger('resized')))
				);
			}),
			(s.prototype.registerEventHandlers = function() {
				t.support.transition &&
					this.$stage.on(t.support.transition.end + '.owl.core', t.proxy(this.onTransitionEnd, this)),
					!1 !== this.settings.responsive && this.on(e, 'resize', this._handlers.onThrottledResize),
					this.settings.mouseDrag &&
						(this.$element.addClass(this.options.dragClass),
						this.$stage.on('mousedown.owl.core', t.proxy(this.onDragStart, this)),
						this.$stage.on('dragstart.owl.core selectstart.owl.core', function() {
							return !1;
						})),
					this.settings.touchDrag &&
						(this.$stage.on('touchstart.owl.core', t.proxy(this.onDragStart, this)),
						this.$stage.on('touchcancel.owl.core', t.proxy(this.onDragEnd, this)));
			}),
			(s.prototype.onDragStart = function(e) {
				var n = null;
				3 !== e.which &&
					(t.support.transform
						? ((n = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',')),
							(n = { x: n[16 === n.length ? 12 : 4], y: n[16 === n.length ? 13 : 5] }))
						: ((n = this.$stage.position()),
							(n = {
								x: this.settings.rtl
									? n.left + this.$stage.width() - this.width() + this.settings.margin
									: n.left,
								y: n.top
							})),
					this.is('animating') &&
						(t.support.transform ? this.animate(n.x) : this.$stage.stop(), this.invalidate('position')),
					this.$element.toggleClass(this.options.grabClass, 'mousedown' === e.type),
					this.speed(0),
					(this._drag.time = new Date().getTime()),
					(this._drag.target = t(e.target)),
					(this._drag.stage.start = n),
					(this._drag.stage.current = n),
					(this._drag.pointer = this.pointer(e)),
					t(i).on('mouseup.owl.core touchend.owl.core', t.proxy(this.onDragEnd, this)),
					t(i).one(
						'mousemove.owl.core touchmove.owl.core',
						t.proxy(function(e) {
							var n = this.difference(this._drag.pointer, this.pointer(e));
							t(i).on('mousemove.owl.core touchmove.owl.core', t.proxy(this.onDragMove, this)),
								(Math.abs(n.x) < Math.abs(n.y) && this.is('valid')) ||
									(e.preventDefault(), this.enter('dragging'), this.trigger('drag'));
						}, this)
					));
			}),
			(s.prototype.onDragMove = function(t) {
				var e = null,
					i = null,
					n = null,
					s = this.difference(this._drag.pointer, this.pointer(t)),
					o = this.difference(this._drag.stage.start, s);
				this.is('dragging') &&
					(t.preventDefault(),
					this.settings.loop
						? ((e = this.coordinates(this.minimum())),
							(i = this.coordinates(this.maximum() + 1) - e),
							(o.x = ((o.x - e) % i + i) % i + e))
						: ((e = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum())),
							(i = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum())),
							(n = this.settings.pullDrag ? -1 * s.x / 5 : 0),
							(o.x = Math.max(Math.min(o.x, e + n), i + n))),
					(this._drag.stage.current = o),
					this.animate(o.x));
			}),
			(s.prototype.onDragEnd = function(e) {
				var n = this.difference(this._drag.pointer, this.pointer(e)),
					s = this._drag.stage.current,
					o = (n.x > 0) ^ this.settings.rtl ? 'left' : 'right';
				t(i).off('.owl.core'),
					this.$element.removeClass(this.options.grabClass),
					((0 !== n.x && this.is('dragging')) || !this.is('valid')) &&
						(this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
						this.current(this.closest(s.x, 0 !== n.x ? o : this._drag.direction)),
						this.invalidate('position'),
						this.update(),
						(this._drag.direction = o),
						(Math.abs(n.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
							this._drag.target.one('click.owl.core', function() {
								return !1;
							})),
					this.is('dragging') && (this.leave('dragging'), this.trigger('dragged'));
			}),
			(s.prototype.closest = function(e, i) {
				var n = -1,
					s = 30,
					o = this.width(),
					r = this.coordinates();
				return (
					this.settings.freeDrag ||
						t.each(
							r,
							t.proxy(function(t, a) {
								return (
									'left' === i && e > a - s && a + s > e
										? (n = t)
										: 'right' === i && e > a - o - s && a - o + s > e
											? (n = t + 1)
											: this.op(e, '<', a) &&
												this.op(e, '>', r[t + 1] || a - o) &&
												(n = 'left' === i ? t + 1 : t),
									-1 === n
								);
							}, this)
						),
					this.settings.loop ||
						(this.op(e, '>', r[this.minimum()])
							? (n = e = this.minimum())
							: this.op(e, '<', r[this.maximum()]) && (n = e = this.maximum())),
					n
				);
			}),
			(s.prototype.animate = function(e) {
				var i = this.speed() > 0;
				this.is('animating') && this.onTransitionEnd(),
					i && (this.enter('animating'), this.trigger('translate')),
					t.support.transform3d && t.support.transition
						? this.$stage.css({
								transform: 'translate3d(' + e + 'px,0px,0px)',
								transition: this.speed() / 1e3 + 's'
							})
						: i
							? this.$stage.animate(
									{ left: e + 'px' },
									this.speed(),
									this.settings.fallbackEasing,
									t.proxy(this.onTransitionEnd, this)
								)
							: this.$stage.css({ left: e + 'px' });
			}),
			(s.prototype.is = function(t) {
				return this._states.current[t] && this._states.current[t] > 0;
			}),
			(s.prototype.current = function(t) {
				if (t === n) return this._current;
				if (0 === this._items.length) return n;
				if (((t = this.normalize(t)), this._current !== t)) {
					var e = this.trigger('change', { property: { name: 'position', value: t } });
					e.data !== n && (t = this.normalize(e.data)),
						(this._current = t),
						this.invalidate('position'),
						this.trigger('changed', { property: { name: 'position', value: this._current } });
				}
				return this._current;
			}),
			(s.prototype.invalidate = function(e) {
				return (
					'string' === t.type(e) && ((this._invalidated[e] = !0), this.is('valid') && this.leave('valid')),
					t.map(this._invalidated, function(t, e) {
						return e;
					})
				);
			}),
			(s.prototype.reset = function(t) {
				(t = this.normalize(t)) !== n &&
					((this._speed = 0),
					(this._current = t),
					this.suppress([ 'translate', 'translated' ]),
					this.animate(this.coordinates(t)),
					this.release([ 'translate', 'translated' ]));
			}),
			(s.prototype.normalize = function(t, e) {
				var i = this._items.length,
					s = e ? 0 : this._clones.length;
				return (
					!this.isNumeric(t) || 1 > i
						? (t = n)
						: (0 > t || t >= i + s) && (t = ((t - s / 2) % i + i) % i + s / 2),
					t
				);
			}),
			(s.prototype.relative = function(t) {
				return (t -= this._clones.length / 2), this.normalize(t, !0);
			}),
			(s.prototype.maximum = function(t) {
				var e,
					i,
					n,
					s = this.settings,
					o = this._coordinates.length;
				if (s.loop) o = this._clones.length / 2 + this._items.length - 1;
				else if (s.autoWidth || s.merge) {
					if ((e = this._items.length))
						for (
							i = this._items[--e].width(), n = this.$element.width();
							e-- && !((i += this._items[e].width() + this.settings.margin) > n);

						);
					o = e + 1;
				} else o = s.center ? this._items.length - 1 : this._items.length - s.items;
				return t && (o -= this._clones.length / 2), Math.max(o, 0);
			}),
			(s.prototype.minimum = function(t) {
				return t ? 0 : this._clones.length / 2;
			}),
			(s.prototype.items = function(t) {
				return t === n ? this._items.slice() : ((t = this.normalize(t, !0)), this._items[t]);
			}),
			(s.prototype.mergers = function(t) {
				return t === n ? this._mergers.slice() : ((t = this.normalize(t, !0)), this._mergers[t]);
			}),
			(s.prototype.clones = function(e) {
				var i = this._clones.length / 2,
					s = i + this._items.length,
					o = function(t) {
						return t % 2 == 0 ? s + t / 2 : i - (t + 1) / 2;
					};
				return e === n
					? t.map(this._clones, function(t, e) {
							return o(e);
						})
					: t.map(this._clones, function(t, i) {
							return t === e ? o(i) : null;
						});
			}),
			(s.prototype.speed = function(t) {
				return t !== n && (this._speed = t), this._speed;
			}),
			(s.prototype.coordinates = function(e) {
				var i,
					s = 1,
					o = e - 1;
				return e === n
					? t.map(
							this._coordinates,
							t.proxy(function(t, e) {
								return this.coordinates(e);
							}, this)
						)
					: (this.settings.center
							? (this.settings.rtl && ((s = -1), (o = e + 1)),
								(i = this._coordinates[e]),
								(i += (this.width() - i + (this._coordinates[o] || 0)) / 2 * s))
							: (i = this._coordinates[o] || 0),
						(i = Math.ceil(i)));
			}),
			(s.prototype.duration = function(t, e, i) {
				return 0 === i
					? 0
					: Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed);
			}),
			(s.prototype.to = function(t, e) {
				var i = this.current(),
					n = null,
					s = t - this.relative(i),
					o = (s > 0) - (0 > s),
					r = this._items.length,
					a = this.minimum(),
					l = this.maximum();
				this.settings.loop
					? (!this.settings.rewind && Math.abs(s) > r / 2 && (s += -1 * o * r),
						(t = i + s),
						(n = ((t - a) % r + r) % r + a) !== t &&
							l >= n - s &&
							n - s > 0 &&
							((i = n - s), (t = n), this.reset(i)))
					: this.settings.rewind ? ((l += 1), (t = (t % l + l) % l)) : (t = Math.max(a, Math.min(l, t))),
					this.speed(this.duration(i, t, e)),
					this.current(t),
					this.$element.is(':visible') && this.update();
			}),
			(s.prototype.next = function(t) {
				(t = t || !1), this.to(this.relative(this.current()) + 1, t);
			}),
			(s.prototype.prev = function(t) {
				(t = t || !1), this.to(this.relative(this.current()) - 1, t);
			}),
			(s.prototype.onTransitionEnd = function(t) {
				return t !== n &&
				(t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))
					? !1
					: (this.leave('animating'), void this.trigger('translated'));
			}),
			(s.prototype.viewport = function() {
				var n;
				return (
					this.options.responsiveBaseElement !== e
						? (n = t(this.options.responsiveBaseElement).width())
						: e.innerWidth
							? (n = e.innerWidth)
							: i.documentElement && i.documentElement.clientWidth
								? (n = i.documentElement.clientWidth)
								: console.warn('Can not detect viewport width.'),
					n
				);
			}),
			(s.prototype.replace = function(e) {
				this.$stage.empty(),
					(this._items = []),
					e && (e = e instanceof jQuery ? e : t(e)),
					this.settings.nestedItemSelector && (e = e.find('.' + this.settings.nestedItemSelector)),
					e
						.filter(function() {
							return 1 === this.nodeType;
						})
						.each(
							t.proxy(function(t, e) {
								(e = this.prepare(e)),
									this.$stage.append(e),
									this._items.push(e),
									this._mergers.push(
										1 * e.find('[data-merge]').addBack('[data-merge]').attr('data-merge') || 1
									);
							}, this)
						),
					this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0),
					this.invalidate('items');
			}),
			(s.prototype.add = function(e, i) {
				var s = this.relative(this._current);
				(i = i === n ? this._items.length : this.normalize(i, !0)),
					(e = e instanceof jQuery ? e : t(e)),
					this.trigger('add', { content: e, position: i }),
					(e = this.prepare(e)),
					0 === this._items.length || i === this._items.length
						? (0 === this._items.length && this.$stage.append(e),
							0 !== this._items.length && this._items[i - 1].after(e),
							this._items.push(e),
							this._mergers.push(
								1 * e.find('[data-merge]').addBack('[data-merge]').attr('data-merge') || 1
							))
						: (this._items[i].before(e),
							this._items.splice(i, 0, e),
							this._mergers.splice(
								i,
								0,
								1 * e.find('[data-merge]').addBack('[data-merge]').attr('data-merge') || 1
							)),
					this._items[s] && this.reset(this._items[s].index()),
					this.invalidate('items'),
					this.trigger('added', { content: e, position: i });
			}),
			(s.prototype.remove = function(t) {
				(t = this.normalize(t, !0)) !== n &&
					(this.trigger('remove', { content: this._items[t], position: t }),
					this._items[t].remove(),
					this._items.splice(t, 1),
					this._mergers.splice(t, 1),
					this.invalidate('items'),
					this.trigger('removed', { content: null, position: t }));
			}),
			(s.prototype.preloadAutoWidthImages = function(e) {
				e.each(
					t.proxy(function(e, i) {
						this.enter('pre-loading'),
							(i = t(i)),
							t(new Image())
								.one(
									'load',
									t.proxy(function(t) {
										i.attr('src', t.target.src),
											i.css('opacity', 1),
											this.leave('pre-loading'),
											!this.is('pre-loading') && !this.is('initializing') && this.refresh();
									}, this)
								)
								.attr('src', i.attr('src') || i.attr('data-src') || i.attr('data-src-retina'));
					}, this)
				);
			}),
			(s.prototype.destroy = function() {
				this.$element.off('.owl.core'),
					this.$stage.off('.owl.core'),
					t(i).off('.owl.core'),
					!1 !== this.settings.responsive &&
						(e.clearTimeout(this.resizeTimer), this.off(e, 'resize', this._handlers.onThrottledResize));
				for (var n in this._plugins) this._plugins[n].destroy();
				this.$stage.children('.cloned').remove(),
					this.$stage.unwrap(),
					this.$stage.children().contents().unwrap(),
					this.$stage.children().unwrap(),
					this.$stage.remove(),
					this.$element
						.removeClass(this.options.refreshClass)
						.removeClass(this.options.loadingClass)
						.removeClass(this.options.loadedClass)
						.removeClass(this.options.rtlClass)
						.removeClass(this.options.dragClass)
						.removeClass(this.options.grabClass)
						.attr(
							'class',
							this.$element
								.attr('class')
								.replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), '')
						)
						.removeData('owl.carousel');
			}),
			(s.prototype.op = function(t, e, i) {
				var n = this.settings.rtl;
				switch (e) {
					case '<':
						return n ? t > i : i > t;
					case '>':
						return n ? i > t : t > i;
					case '>=':
						return n ? i >= t : t >= i;
					case '<=':
						return n ? t >= i : i >= t;
				}
			}),
			(s.prototype.on = function(t, e, i, n) {
				t.addEventListener ? t.addEventListener(e, i, n) : t.attachEvent && t.attachEvent('on' + e, i);
			}),
			(s.prototype.off = function(t, e, i, n) {
				t.removeEventListener ? t.removeEventListener(e, i, n) : t.detachEvent && t.detachEvent('on' + e, i);
			}),
			(s.prototype.trigger = function(e, i, n, o, r) {
				var a = { item: { count: this._items.length, index: this.current() } },
					l = t.camelCase(
						t
							.grep([ 'on', e, n ], function(t) {
								return t;
							})
							.join('-')
							.toLowerCase()
					),
					h = t.Event(
						[ e, 'owl', n || 'carousel' ].join('.').toLowerCase(),
						t.extend({ relatedTarget: this }, a, i)
					);
				return (
					this._supress[e] ||
						(t.each(this._plugins, function(t, e) {
							e.onTrigger && e.onTrigger(h);
						}),
						this.register({ type: s.Type.Event, name: e }),
						this.$element.trigger(h),
						this.settings && 'function' == typeof this.settings[l] && this.settings[l].call(this, h)),
					h
				);
			}),
			(s.prototype.enter = function(e) {
				t.each(
					[ e ].concat(this._states.tags[e] || []),
					t.proxy(function(t, e) {
						this._states.current[e] === n && (this._states.current[e] = 0), this._states.current[e]++;
					}, this)
				);
			}),
			(s.prototype.leave = function(e) {
				t.each(
					[ e ].concat(this._states.tags[e] || []),
					t.proxy(function(t, e) {
						this._states.current[e]--;
					}, this)
				);
			}),
			(s.prototype.register = function(e) {
				if (e.type === s.Type.Event) {
					if ((t.event.special[e.name] || (t.event.special[e.name] = {}), !t.event.special[e.name].owl)) {
						var i = t.event.special[e.name]._default;
						(t.event.special[e.name]._default = function(t) {
							return !i || !i.apply || (t.namespace && -1 !== t.namespace.indexOf('owl'))
								? t.namespace && t.namespace.indexOf('owl') > -1
								: i.apply(this, arguments);
						}),
							(t.event.special[e.name].owl = !0);
					}
				} else
					e.type === s.Type.State &&
						(this._states.tags[e.name]
							? (this._states.tags[e.name] = this._states.tags[e.name].concat(e.tags))
							: (this._states.tags[e.name] = e.tags),
						(this._states.tags[e.name] = t.grep(
							this._states.tags[e.name],
							t.proxy(function(i, n) {
								return t.inArray(i, this._states.tags[e.name]) === n;
							}, this)
						)));
			}),
			(s.prototype.suppress = function(e) {
				t.each(
					e,
					t.proxy(function(t, e) {
						this._supress[e] = !0;
					}, this)
				);
			}),
			(s.prototype.release = function(e) {
				t.each(
					e,
					t.proxy(function(t, e) {
						delete this._supress[e];
					}, this)
				);
			}),
			(s.prototype.pointer = function(t) {
				var i = { x: null, y: null };
				return (
					(t = t.originalEvent || t || e.event),
					(t =
						t.touches && t.touches.length
							? t.touches[0]
							: t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t),
					t.pageX ? ((i.x = t.pageX), (i.y = t.pageY)) : ((i.x = t.clientX), (i.y = t.clientY)),
					i
				);
			}),
			(s.prototype.isNumeric = function(t) {
				return !isNaN(parseFloat(t));
			}),
			(s.prototype.difference = function(t, e) {
				return { x: t.x - e.x, y: t.y - e.y };
			}),
			(t.fn.owlCarousel = function(e) {
				var i = Array.prototype.slice.call(arguments, 1);
				return this.each(function() {
					var n = t(this),
						o = n.data('owl.carousel');
					o ||
						((o = new s(this, 'object' == typeof e && e)),
						n.data('owl.carousel', o),
						t.each([ 'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove' ], function(
							e,
							i
						) {
							o.register({ type: s.Type.Event, name: i }),
								o.$element.on(
									i + '.owl.carousel.core',
									t.proxy(function(t) {
										t.namespace &&
											t.relatedTarget !== this &&
											(this.suppress([ i ]),
											o[i].apply(this, [].slice.call(arguments, 1)),
											this.release([ i ]));
									}, o)
								);
						})),
						'string' == typeof e && '_' !== e.charAt(0) && o[e].apply(o, i);
				});
			}),
			(t.fn.owlCarousel.Constructor = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this._core = e),
				(this._interval = null),
				(this._visible = null),
				(this._handlers = {
					'initialized.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.autoRefresh && this.watch();
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this._core.$element.on(this._handlers);
		};
		(s.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
			(s.prototype.watch = function() {
				this._interval ||
					((this._visible = this._core.$element.is(':visible')),
					(this._interval = e.setInterval(
						t.proxy(this.refresh, this),
						this._core.settings.autoRefreshInterval
					)));
			}),
			(s.prototype.refresh = function() {
				this._core.$element.is(':visible') !== this._visible &&
					((this._visible = !this._visible),
					this._core.$element.toggleClass('owl-hidden', !this._visible),
					this._visible && this._core.invalidate('width') && this._core.refresh());
			}),
			(s.prototype.destroy = function() {
				var t, i;
				e.clearInterval(this._interval);
				for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
				for (i in Object.getOwnPropertyNames(this)) 'function' != typeof this[i] && (this[i] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.AutoRefresh = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this._core = e),
				(this._loaded = []),
				(this._handlers = {
					'initialized.owl.carousel change.owl.carousel resized.owl.carousel': t.proxy(function(e) {
						if (
							e.namespace &&
							this._core.settings &&
							this._core.settings.lazyLoad &&
							((e.property && 'position' == e.property.name) || 'initialized' == e.type)
						)
							for (
								var i = this._core.settings,
									s = (i.center && Math.ceil(i.items / 2)) || i.items,
									o = (i.center && -1 * s) || 0,
									r =
										(e.property && e.property.value !== n
											? e.property.value
											: this._core.current()) + o,
									a = this._core.clones().length,
									l = t.proxy(function(t, e) {
										this.load(e);
									}, this);
								o++ < s;

							)
								this.load(a / 2 + this._core.relative(r)),
									a && t.each(this._core.clones(this._core.relative(r)), l),
									r++;
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this._core.$element.on(this._handlers);
		};
		(s.Defaults = { lazyLoad: !1 }),
			(s.prototype.load = function(i) {
				var n = this._core.$stage.children().eq(i),
					s = n && n.find('.owl-lazy');
				!s ||
					t.inArray(n.get(0), this._loaded) > -1 ||
					(s.each(
						t.proxy(function(i, n) {
							var s,
								o = t(n),
								r = (e.devicePixelRatio > 1 && o.attr('data-src-retina')) || o.attr('data-src');
							this._core.trigger('load', { element: o, url: r }, 'lazy'),
								o.is('img')
									? o
											.one(
												'load.owl.lazy',
												t.proxy(function() {
													o.css('opacity', 1),
														this._core.trigger('loaded', { element: o, url: r }, 'lazy');
												}, this)
											)
											.attr('src', r)
									: ((s = new Image()),
										(s.onload = t.proxy(function() {
											o.css({ 'background-image': 'url("' + r + '")', opacity: '1' }),
												this._core.trigger('loaded', { element: o, url: r }, 'lazy');
										}, this)),
										(s.src = r));
						}, this)
					),
					this._loaded.push(n.get(0)));
			}),
			(s.prototype.destroy = function() {
				var t, e;
				for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
				for (e in Object.getOwnPropertyNames(this)) 'function' != typeof this[e] && (this[e] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.Lazy = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this._core = e),
				(this._handlers = {
					'initialized.owl.carousel refreshed.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.autoHeight && this.update();
					}, this),
					'changed.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.autoHeight && 'position' == t.property.name && this.update();
					}, this),
					'loaded.owl.lazy': t.proxy(function(t) {
						t.namespace &&
							this._core.settings.autoHeight &&
							t.element.closest('.' + this._core.settings.itemClass).index() === this._core.current() &&
							this.update();
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this._core.$element.on(this._handlers);
		};
		(s.Defaults = { autoHeight: !1, autoHeightClass: 'owl-height' }),
			(s.prototype.update = function() {
				var e = this._core._current,
					i = e + this._core.settings.items,
					n = this._core.$stage.children().toArray().slice(e, i),
					s = [],
					o = 0;
				t.each(n, function(e, i) {
					s.push(t(i).height());
				}),
					(o = Math.max.apply(null, s)),
					this._core.$stage.parent().height(o).addClass(this._core.settings.autoHeightClass);
			}),
			(s.prototype.destroy = function() {
				var t, e;
				for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
				for (e in Object.getOwnPropertyNames(this)) 'function' != typeof this[e] && (this[e] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.AutoHeight = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this._core = e),
				(this._videos = {}),
				(this._playing = null),
				(this._handlers = {
					'initialized.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.register({ type: 'state', name: 'playing', tags: [ 'interacting' ] });
					}, this),
					'resize.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault();
					}, this),
					'refreshed.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							this._core.is('resizing') &&
							this._core.$stage.find('.cloned .owl-video-frame').remove();
					}, this),
					'changed.owl.carousel': t.proxy(function(t) {
						t.namespace && 'position' === t.property.name && this._playing && this.stop();
					}, this),
					'prepared.owl.carousel': t.proxy(function(e) {
						if (e.namespace) {
							var i = t(e.content).find('.owl-video');
							i.length && (i.css('display', 'none'), this.fetch(i, t(e.content)));
						}
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this._core.$element.on(this._handlers),
				this._core.$element.on(
					'click.owl.video',
					'.owl-video-play-icon',
					t.proxy(function(t) {
						this.play(t);
					}, this)
				);
		};
		(s.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
			(s.prototype.fetch = function(t, e) {
				var i = (function() {
						return t.attr('data-vimeo-id') ? 'vimeo' : t.attr('data-vzaar-id') ? 'vzaar' : 'youtube';
					})(),
					n = t.attr('data-vimeo-id') || t.attr('data-youtube-id') || t.attr('data-vzaar-id'),
					s = t.attr('data-width') || this._core.settings.videoWidth,
					o = t.attr('data-height') || this._core.settings.videoHeight,
					r = t.attr('href');
				if (!r) throw new Error('Missing video URL.');
				if (
					((n = r.match(
						/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
					)),
					n[3].indexOf('youtu') > -1)
				)
					i = 'youtube';
				else if (n[3].indexOf('vimeo') > -1) i = 'vimeo';
				else {
					if (!(n[3].indexOf('vzaar') > -1)) throw new Error('Video URL not supported.');
					i = 'vzaar';
				}
				(n = n[6]),
					(this._videos[r] = { type: i, id: n, width: s, height: o }),
					e.attr('data-video', r),
					this.thumbnail(t, this._videos[r]);
			}),
			(s.prototype.thumbnail = function(e, i) {
				var n,
					s,
					o,
					r = i.width && i.height ? 'style="width:' + i.width + 'px;height:' + i.height + 'px;"' : '',
					a = e.find('img'),
					l = 'src',
					h = '',
					u = this._core.settings,
					d = function(t) {
						(s = '<div class="owl-video-play-icon"></div>'),
							(n = u.lazyLoad
								? '<div class="owl-video-tn ' + h + '" ' + l + '="' + t + '"></div>'
								: '<div class="owl-video-tn" style="opacity:1;background-image:url(' + t + ')"></div>'),
							e.after(n),
							e.after(s);
					};
				return (
					e.wrap('<div class="owl-video-wrapper"' + r + '></div>'),
					this._core.settings.lazyLoad && ((l = 'data-src'), (h = 'owl-lazy')),
					a.length
						? (d(a.attr(l)), a.remove(), !1)
						: void ('youtube' === i.type
								? ((o = '//img.youtube.com/vi/' + i.id + '/hqdefault.jpg'), d(o))
								: 'vimeo' === i.type
									? t.ajax({
											type: 'GET',
											url: '//vimeo.com/api/v2/video/' + i.id + '.json',
											jsonp: 'callback',
											dataType: 'jsonp',
											success: function(t) {
												(o = t[0].thumbnail_large), d(o);
											}
										})
									: 'vzaar' === i.type &&
										t.ajax({
											type: 'GET',
											url: '//vzaar.com/api/videos/' + i.id + '.json',
											jsonp: 'callback',
											dataType: 'jsonp',
											success: function(t) {
												(o = t.framegrab_url), d(o);
											}
										}))
				);
			}),
			(s.prototype.stop = function() {
				this._core.trigger('stop', null, 'video'),
					this._playing.find('.owl-video-frame').remove(),
					this._playing.removeClass('owl-video-playing'),
					(this._playing = null),
					this._core.leave('playing'),
					this._core.trigger('stopped', null, 'video');
			}),
			(s.prototype.play = function(e) {
				var i,
					n = t(e.target),
					s = n.closest('.' + this._core.settings.itemClass),
					o = this._videos[s.attr('data-video')],
					r = o.width || '100%',
					a = o.height || this._core.$stage.height();
				this._playing ||
					(this._core.enter('playing'),
					this._core.trigger('play', null, 'video'),
					(s = this._core.items(this._core.relative(s.index()))),
					this._core.reset(s.index()),
					'youtube' === o.type
						? (i =
								'<iframe width="' +
								r +
								'" height="' +
								a +
								'" src="//www.youtube.com/embed/' +
								o.id +
								'?autoplay=1&rel=0&v=' +
								o.id +
								'" frameborder="0" allowfullscreen></iframe>')
						: 'vimeo' === o.type
							? (i =
									'<iframe src="//player.vimeo.com/video/' +
									o.id +
									'?autoplay=1" width="' +
									r +
									'" height="' +
									a +
									'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
							: 'vzaar' === o.type &&
								(i =
									'<iframe frameborder="0"height="' +
									a +
									'"width="' +
									r +
									'" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' +
									o.id +
									'/player?autoplay=true"></iframe>'),
					t('<div class="owl-video-frame">' + i + '</div>').insertAfter(s.find('.owl-video')),
					(this._playing = s.addClass('owl-video-playing')));
			}),
			(s.prototype.isInFullScreen = function() {
				var e = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
				return e && t(e).parent().hasClass('owl-video-frame');
			}),
			(s.prototype.destroy = function() {
				var t, e;
				this._core.$element.off('click.owl.video');
				for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
				for (e in Object.getOwnPropertyNames(this)) 'function' != typeof this[e] && (this[e] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.Video = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this.core = e),
				(this.core.options = t.extend({}, s.Defaults, this.core.options)),
				(this.swapping = !0),
				(this.previous = n),
				(this.next = n),
				(this.handlers = {
					'change.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							'position' == t.property.name &&
							((this.previous = this.core.current()), (this.next = t.property.value));
					}, this),
					'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': t.proxy(function(t) {
						t.namespace && (this.swapping = 'translated' == t.type);
					}, this),
					'translate.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							this.swapping &&
							(this.core.options.animateOut || this.core.options.animateIn) &&
							this.swap();
					}, this)
				}),
				this.core.$element.on(this.handlers);
		};
		(s.Defaults = { animateOut: !1, animateIn: !1 }),
			(s.prototype.swap = function() {
				if (1 === this.core.settings.items && t.support.animation && t.support.transition) {
					this.core.speed(0);
					var e,
						i = t.proxy(this.clear, this),
						n = this.core.$stage.children().eq(this.previous),
						s = this.core.$stage.children().eq(this.next),
						o = this.core.settings.animateIn,
						r = this.core.settings.animateOut;
					this.core.current() !== this.previous &&
						(r &&
							((e = this.core.coordinates(this.previous) - this.core.coordinates(this.next)),
							n
								.one(t.support.animation.end, i)
								.css({ left: e + 'px' })
								.addClass('animated owl-animated-out')
								.addClass(r)),
						o && s.one(t.support.animation.end, i).addClass('animated owl-animated-in').addClass(o));
				}
			}),
			(s.prototype.clear = function(e) {
				t(e.target)
					.css({ left: '' })
					.removeClass('animated owl-animated-out owl-animated-in')
					.removeClass(this.core.settings.animateIn)
					.removeClass(this.core.settings.animateOut),
					this.core.onTransitionEnd();
			}),
			(s.prototype.destroy = function() {
				var t, e;
				for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
				for (e in Object.getOwnPropertyNames(this)) 'function' != typeof this[e] && (this[e] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.Animate = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		var s = function(e) {
			(this._core = e),
				(this._call = null),
				(this._time = 0),
				(this._timeout = 0),
				(this._paused = !0),
				(this._handlers = {
					'changed.owl.carousel': t.proxy(function(t) {
						t.namespace && 'settings' === t.property.name
							? this._core.settings.autoplay ? this.play() : this.stop()
							: t.namespace && 'position' === t.property.name && this._paused && (this._time = 0);
					}, this),
					'initialized.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.autoplay && this.play();
					}, this),
					'play.owl.autoplay': t.proxy(function(t, e, i) {
						t.namespace && this.play(e, i);
					}, this),
					'stop.owl.autoplay': t.proxy(function(t) {
						t.namespace && this.stop();
					}, this),
					'mouseover.owl.autoplay': t.proxy(function() {
						this._core.settings.autoplayHoverPause && this._core.is('rotating') && this.pause();
					}, this),
					'mouseleave.owl.autoplay': t.proxy(function() {
						this._core.settings.autoplayHoverPause && this._core.is('rotating') && this.play();
					}, this),
					'touchstart.owl.core': t.proxy(function() {
						this._core.settings.autoplayHoverPause && this._core.is('rotating') && this.pause();
					}, this),
					'touchend.owl.core': t.proxy(function() {
						this._core.settings.autoplayHoverPause && this.play();
					}, this)
				}),
				this._core.$element.on(this._handlers),
				(this._core.options = t.extend({}, s.Defaults, this._core.options));
		};
		(s.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }),
			(s.prototype._next = function(n) {
				(this._call = e.setTimeout(
					t.proxy(this._next, this, n),
					this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()
				)),
					this._core.is('busy') ||
						this._core.is('interacting') ||
						i.hidden ||
						this._core.next(n || this._core.settings.autoplaySpeed);
			}),
			(s.prototype.read = function() {
				return new Date().getTime() - this._time;
			}),
			(s.prototype.play = function(i, n) {
				var s;
				this._core.is('rotating') || this._core.enter('rotating'),
					(i = i || this._core.settings.autoplayTimeout),
					(s = Math.min(this._time % (this._timeout || i), i)),
					this._paused ? ((this._time = this.read()), (this._paused = !1)) : e.clearTimeout(this._call),
					(this._time += this.read() % i - s),
					(this._timeout = i),
					(this._call = e.setTimeout(t.proxy(this._next, this, n), i - s));
			}),
			(s.prototype.stop = function() {
				this._core.is('rotating') &&
					((this._time = 0), (this._paused = !0), e.clearTimeout(this._call), this._core.leave('rotating'));
			}),
			(s.prototype.pause = function() {
				this._core.is('rotating') &&
					!this._paused &&
					((this._time = this.read()), (this._paused = !0), e.clearTimeout(this._call));
			}),
			(s.prototype.destroy = function() {
				var t, e;
				this.stop();
				for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
				for (e in Object.getOwnPropertyNames(this)) 'function' != typeof this[e] && (this[e] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.autoplay = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		'use strict';
		var s = function(e) {
			(this._core = e),
				(this._initialized = !1),
				(this._pages = []),
				(this._controls = {}),
				(this._templates = []),
				(this.$element = this._core.$element),
				(this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }),
				(this._handlers = {
					'prepared.owl.carousel': t.proxy(function(e) {
						e.namespace &&
							this._core.settings.dotsData &&
							this._templates.push(
								'<div class="' +
									this._core.settings.dotClass +
									'">' +
									t(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') +
									'</div>'
							);
					}, this),
					'added.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							this._core.settings.dotsData &&
							this._templates.splice(t.position, 0, this._templates.pop());
					}, this),
					'remove.owl.carousel': t.proxy(function(t) {
						t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1);
					}, this),
					'changed.owl.carousel': t.proxy(function(t) {
						t.namespace && 'position' == t.property.name && this.draw();
					}, this),
					'initialized.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							!this._initialized &&
							(this._core.trigger('initialize', null, 'navigation'),
							this.initialize(),
							this.update(),
							this.draw(),
							(this._initialized = !0),
							this._core.trigger('initialized', null, 'navigation'));
					}, this),
					'refreshed.owl.carousel': t.proxy(function(t) {
						t.namespace &&
							this._initialized &&
							(this._core.trigger('refresh', null, 'navigation'),
							this.update(),
							this.draw(),
							this._core.trigger('refreshed', null, 'navigation'));
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this.$element.on(this._handlers);
		};
		(s.Defaults = {
			nav: !1,
			navText: [ '<span aria-label="prev">&#x2039;</span>', '<span aria-label="next">&#x203a;</span>' ],
			navSpeed: !1,
			navElement: 'button role="presentation"',
			navContainer: !1,
			navContainerClass: 'owl-nav',
			navClass: [ 'owl-prev', 'owl-next' ],
			slideBy: 1,
			dotClass: 'owl-dot',
			dotsClass: 'owl-dots',
			dots: !0,
			dotsEach: !1,
			dotsData: !1,
			dotsSpeed: !1,
			dotsContainer: !1
		}),
			(s.prototype.initialize = function() {
				var e,
					i = this._core.settings;
				(this._controls.$relative = (i.navContainer
					? t(i.navContainer)
					: t('<div>').addClass(i.navContainerClass).appendTo(this.$element)).addClass('disabled')),
					(this._controls.$previous = t('<' + i.navElement + '>')
						.addClass(i.navClass[0])
						.html(i.navText[0])
						.prependTo(this._controls.$relative)
						.on(
							'click',
							t.proxy(function(t) {
								this.prev(i.navSpeed);
							}, this)
						)),
					(this._controls.$next = t('<' + i.navElement + '>')
						.addClass(i.navClass[1])
						.html(i.navText[1])
						.appendTo(this._controls.$relative)
						.on(
							'click',
							t.proxy(function(t) {
								this.next(i.navSpeed);
							}, this)
						)),
					i.dotsData ||
						(this._templates = [
							t('<button>').addClass(i.dotClass).append(t('<span>')).prop('outerHTML')
						]),
					(this._controls.$absolute = (i.dotsContainer
						? t(i.dotsContainer)
						: t('<div>').addClass(i.dotsClass).appendTo(this.$element)).addClass('disabled')),
					this._controls.$absolute.on(
						'click',
						'button',
						t.proxy(function(e) {
							var n = t(e.target).parent().is(this._controls.$absolute)
								? t(e.target).index()
								: t(e.target).parent().index();
							e.preventDefault(), this.to(n, i.dotsSpeed);
						}, this)
					);
				for (e in this._overrides) this._core[e] = t.proxy(this[e], this);
			}),
			(s.prototype.destroy = function() {
				var t, e, i, n, s;
				s = this._core.settings;
				for (t in this._handlers) this.$element.off(t, this._handlers[t]);
				for (e in this._controls)
					'$relative' === e && s.navContainer ? this._controls[e].html('') : this._controls[e].remove();
				for (n in this.overides) this._core[n] = this._overrides[n];
				for (i in Object.getOwnPropertyNames(this)) 'function' != typeof this[i] && (this[i] = null);
			}),
			(s.prototype.update = function() {
				var t,
					e,
					i,
					n = this._core.clones().length / 2,
					s = n + this._core.items().length,
					o = this._core.maximum(!0),
					r = this._core.settings,
					a = r.center || r.autoWidth || r.dotsData ? 1 : r.dotsEach || r.items;
				if (('page' !== r.slideBy && (r.slideBy = Math.min(r.slideBy, r.items)), r.dots || 'page' == r.slideBy))
					for (this._pages = [], t = n, e = 0, i = 0; s > t; t++) {
						if (e >= a || 0 === e) {
							if (
								(this._pages.push({ start: Math.min(o, t - n), end: t - n + a - 1 }),
								Math.min(o, t - n) === o)
							)
								break;
							(e = 0), ++i;
						}
						e += this._core.mergers(this._core.relative(t));
					}
			}),
			(s.prototype.draw = function() {
				var e,
					i = this._core.settings,
					n = this._core.items().length <= i.items,
					s = this._core.relative(this._core.current()),
					o = i.loop || i.rewind;
				this._controls.$relative.toggleClass('disabled', !i.nav || n),
					i.nav &&
						(this._controls.$previous.toggleClass('disabled', !o && s <= this._core.minimum(!0)),
						this._controls.$next.toggleClass('disabled', !o && s >= this._core.maximum(!0))),
					this._controls.$absolute.toggleClass('disabled', !i.dots || n),
					i.dots &&
						((e = this._pages.length - this._controls.$absolute.children().length),
						i.dotsData && 0 !== e
							? this._controls.$absolute.html(this._templates.join(''))
							: e > 0
								? this._controls.$absolute.append(new Array(e + 1).join(this._templates[0]))
								: 0 > e && this._controls.$absolute.children().slice(e).remove(),
						this._controls.$absolute.find('.active').removeClass('active'),
						this._controls.$absolute
							.children()
							.eq(t.inArray(this.current(), this._pages))
							.addClass('active'));
			}),
			(s.prototype.onTrigger = function(e) {
				var i = this._core.settings;
				e.page = {
					index: t.inArray(this.current(), this._pages),
					count: this._pages.length,
					size: i && (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items)
				};
			}),
			(s.prototype.current = function() {
				var e = this._core.relative(this._core.current());
				return t
					.grep(
						this._pages,
						t.proxy(function(t, i) {
							return t.start <= e && t.end >= e;
						}, this)
					)
					.pop();
			}),
			(s.prototype.getPosition = function(e) {
				var i,
					n,
					s = this._core.settings;
				return (
					'page' == s.slideBy
						? ((i = t.inArray(this.current(), this._pages)),
							(n = this._pages.length),
							e ? ++i : --i,
							(i = this._pages[(i % n + n) % n].start))
						: ((i = this._core.relative(this._core.current())),
							(n = this._core.items().length),
							e ? (i += s.slideBy) : (i -= s.slideBy)),
					i
				);
			}),
			(s.prototype.next = function(e) {
				t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e);
			}),
			(s.prototype.prev = function(e) {
				t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e);
			}),
			(s.prototype.to = function(e, i, n) {
				var s;
				!n && this._pages.length
					? ((s = this._pages.length),
						t.proxy(this._overrides.to, this._core)(this._pages[(e % s + s) % s].start, i))
					: t.proxy(this._overrides.to, this._core)(e, i);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.Navigation = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		'use strict';
		var s = function(i) {
			(this._core = i),
				(this._hashes = {}),
				(this.$element = this._core.$element),
				(this._handlers = {
					'initialized.owl.carousel': t.proxy(function(i) {
						i.namespace &&
							'URLHash' === this._core.settings.startPosition &&
							t(e).trigger('hashchange.owl.navigation');
					}, this),
					'prepared.owl.carousel': t.proxy(function(e) {
						if (e.namespace) {
							var i = t(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');
							if (!i) return;
							this._hashes[i] = e.content;
						}
					}, this),
					'changed.owl.carousel': t.proxy(function(i) {
						if (i.namespace && 'position' === i.property.name) {
							var n = this._core.items(this._core.relative(this._core.current())),
								s = t
									.map(this._hashes, function(t, e) {
										return t === n ? e : null;
									})
									.join();
							if (!s || e.location.hash.slice(1) === s) return;
							e.location.hash = s;
						}
					}, this)
				}),
				(this._core.options = t.extend({}, s.Defaults, this._core.options)),
				this.$element.on(this._handlers),
				t(e).on(
					'hashchange.owl.navigation',
					t.proxy(function(t) {
						var i = e.location.hash.substring(1),
							s = this._core.$stage.children(),
							o = this._hashes[i] && s.index(this._hashes[i]);
						o !== n && o !== this._core.current() && this._core.to(this._core.relative(o), !1, !0);
					}, this)
				);
		};
		(s.Defaults = { URLhashListener: !1 }),
			(s.prototype.destroy = function() {
				var i, n;
				t(e).off('hashchange.owl.navigation');
				for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
				for (n in Object.getOwnPropertyNames(this)) 'function' != typeof this[n] && (this[n] = null);
			}),
			(t.fn.owlCarousel.Constructor.Plugins.Hash = s);
	})(window.Zepto || window.jQuery, window, document),
	(function(t, e, i, n) {
		function s(e, i) {
			var s = !1,
				o = e.charAt(0).toUpperCase() + e.slice(1);
			return (
				t.each((e + ' ' + a.join(o + ' ') + o).split(' '), function(t, e) {
					return r[e] !== n ? ((s = !i || e), !1) : void 0;
				}),
				s
			);
		}
		function o(t) {
			return s(t, !0);
		}
		var r = t('<support>').get(0).style,
			a = 'Webkit Moz O ms'.split(' '),
			l = {
				transition: {
					end: {
						WebkitTransition: 'webkitTransitionEnd',
						MozTransition: 'transitionend',
						OTransition: 'oTransitionEnd',
						transition: 'transitionend'
					}
				},
				animation: {
					end: {
						WebkitAnimation: 'webkitAnimationEnd',
						MozAnimation: 'animationend',
						OAnimation: 'oAnimationEnd',
						animation: 'animationend'
					}
				}
			},
			h = {
				csstransforms: function() {
					return !!s('transform');
				},
				csstransforms3d: function() {
					return !!s('perspective');
				},
				csstransitions: function() {
					return !!s('transition');
				},
				cssanimations: function() {
					return !!s('animation');
				}
			};
		h.csstransitions() &&
			((t.support.transition = new String(o('transition'))),
			(t.support.transition.end = l.transition.end[t.support.transition])),
			h.cssanimations() &&
				((t.support.animation = new String(o('animation'))),
				(t.support.animation.end = l.animation.end[t.support.animation])),
			h.csstransforms() &&
				((t.support.transform = new String(o('transform'))), (t.support.transform3d = h.csstransforms3d()));
	})(window.Zepto || window.jQuery, window, document),
	!(function() {
		'use strict';
		function t(n) {
			if (!n) throw new Error('No options passed to Waypoint constructor');
			if (!n.element) throw new Error('No element option passed to Waypoint constructor');
			if (!n.handler) throw new Error('No handler option passed to Waypoint constructor');
			(this.key = 'waypoint-' + e),
				(this.options = t.Adapter.extend({}, t.defaults, n)),
				(this.element = this.options.element),
				(this.adapter = new t.Adapter(this.element)),
				(this.callback = n.handler),
				(this.axis = this.options.horizontal ? 'horizontal' : 'vertical'),
				(this.enabled = this.options.enabled),
				(this.triggerPoint = null),
				(this.group = t.Group.findOrCreate({ name: this.options.group, axis: this.axis })),
				(this.context = t.Context.findOrCreateByElement(this.options.context)),
				t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]),
				this.group.add(this),
				this.context.add(this),
				(i[this.key] = this),
				(e += 1);
		}
		var e = 0,
			i = {};
		(t.prototype.queueTrigger = function(t) {
			this.group.queueTrigger(this, t);
		}),
			(t.prototype.trigger = function(t) {
				this.enabled && this.callback && this.callback.apply(this, t);
			}),
			(t.prototype.destroy = function() {
				this.context.remove(this), this.group.remove(this), delete i[this.key];
			}),
			(t.prototype.disable = function() {
				return (this.enabled = !1), this;
			}),
			(t.prototype.enable = function() {
				return this.context.refresh(), (this.enabled = !0), this;
			}),
			(t.prototype.next = function() {
				return this.group.next(this);
			}),
			(t.prototype.previous = function() {
				return this.group.previous(this);
			}),
			(t.invokeAll = function(t) {
				var e = [];
				for (var n in i) e.push(i[n]);
				for (var s = 0, o = e.length; o > s; s++) e[s][t]();
			}),
			(t.destroyAll = function() {
				t.invokeAll('destroy');
			}),
			(t.disableAll = function() {
				t.invokeAll('disable');
			}),
			(t.enableAll = function() {
				t.Context.refreshAll();
				for (var e in i) i[e].enabled = !0;
				return this;
			}),
			(t.refreshAll = function() {
				t.Context.refreshAll();
			}),
			(t.viewportHeight = function() {
				return window.innerHeight || document.documentElement.clientHeight;
			}),
			(t.viewportWidth = function() {
				return document.documentElement.clientWidth;
			}),
			(t.adapters = []),
			(t.defaults = {
				context: window,
				continuous: !0,
				enabled: !0,
				group: 'default',
				horizontal: !1,
				offset: 0
			}),
			(t.offsetAliases = {
				'bottom-in-view': function() {
					return this.context.innerHeight() - this.adapter.outerHeight();
				},
				'right-in-view': function() {
					return this.context.innerWidth() - this.adapter.outerWidth();
				}
			}),
			(window.Waypoint = t);
	})(),
	(function() {
		'use strict';
		function t(t) {
			window.setTimeout(t, 1e3 / 60);
		}
		function e(t) {
			(this.element = t),
				(this.Adapter = s.Adapter),
				(this.adapter = new this.Adapter(t)),
				(this.key = 'waypoint-context-' + i),
				(this.didScroll = !1),
				(this.didResize = !1),
				(this.oldScroll = { x: this.adapter.scrollLeft(), y: this.adapter.scrollTop() }),
				(this.waypoints = { vertical: {}, horizontal: {} }),
				(t.waypointContextKey = this.key),
				(n[t.waypointContextKey] = this),
				(i += 1),
				s.windowContext || ((s.windowContext = !0), (s.windowContext = new e(window))),
				this.createThrottledScrollHandler(),
				this.createThrottledResizeHandler();
		}
		var i = 0,
			n = {},
			s = window.Waypoint,
			o = window.onload;
		(e.prototype.add = function(t) {
			var e = t.options.horizontal ? 'horizontal' : 'vertical';
			(this.waypoints[e][t.key] = t), this.refresh();
		}),
			(e.prototype.checkEmpty = function() {
				var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
					e = this.Adapter.isEmptyObject(this.waypoints.vertical),
					i = this.element == this.element.window;
				t && e && !i && (this.adapter.off('.waypoints'), delete n[this.key]);
			}),
			(e.prototype.createThrottledResizeHandler = function() {
				function t() {
					e.handleResize(), (e.didResize = !1);
				}
				var e = this;
				this.adapter.on('resize.waypoints', function() {
					e.didResize || ((e.didResize = !0), s.requestAnimationFrame(t));
				});
			}),
			(e.prototype.createThrottledScrollHandler = function() {
				function t() {
					e.handleScroll(), (e.didScroll = !1);
				}
				var e = this;
				this.adapter.on('scroll.waypoints', function() {
					(!e.didScroll || s.isTouch) && ((e.didScroll = !0), s.requestAnimationFrame(t));
				});
			}),
			(e.prototype.handleResize = function() {
				s.Context.refreshAll();
			}),
			(e.prototype.handleScroll = function() {
				var t = {},
					e = {
						horizontal: {
							newScroll: this.adapter.scrollLeft(),
							oldScroll: this.oldScroll.x,
							forward: 'right',
							backward: 'left'
						},
						vertical: {
							newScroll: this.adapter.scrollTop(),
							oldScroll: this.oldScroll.y,
							forward: 'down',
							backward: 'up'
						}
					};
				for (var i in e) {
					var n = e[i],
						s = n.newScroll > n.oldScroll,
						o = s ? n.forward : n.backward;
					for (var r in this.waypoints[i]) {
						var a = this.waypoints[i][r];
						if (null !== a.triggerPoint) {
							var l = n.oldScroll < a.triggerPoint,
								h = n.newScroll >= a.triggerPoint,
								u = l && h,
								d = !l && !h;
							(u || d) && (a.queueTrigger(o), (t[a.group.id] = a.group));
						}
					}
				}
				for (var c in t) t[c].flushTriggers();
				this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll };
			}),
			(e.prototype.innerHeight = function() {
				return this.element == this.element.window ? s.viewportHeight() : this.adapter.innerHeight();
			}),
			(e.prototype.remove = function(t) {
				delete this.waypoints[t.axis][t.key], this.checkEmpty();
			}),
			(e.prototype.innerWidth = function() {
				return this.element == this.element.window ? s.viewportWidth() : this.adapter.innerWidth();
			}),
			(e.prototype.destroy = function() {
				var t = [];
				for (var e in this.waypoints) for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]);
				for (var n = 0, s = t.length; s > n; n++) t[n].destroy();
			}),
			(e.prototype.refresh = function() {
				var t,
					e = this.element == this.element.window,
					i = e ? void 0 : this.adapter.offset(),
					n = {};
				this.handleScroll(),
					(t = {
						horizontal: {
							contextOffset: e ? 0 : i.left,
							contextScroll: e ? 0 : this.oldScroll.x,
							contextDimension: this.innerWidth(),
							oldScroll: this.oldScroll.x,
							forward: 'right',
							backward: 'left',
							offsetProp: 'left'
						},
						vertical: {
							contextOffset: e ? 0 : i.top,
							contextScroll: e ? 0 : this.oldScroll.y,
							contextDimension: this.innerHeight(),
							oldScroll: this.oldScroll.y,
							forward: 'down',
							backward: 'up',
							offsetProp: 'top'
						}
					});
				for (var o in t) {
					var r = t[o];
					for (var a in this.waypoints[o]) {
						var l,
							h,
							u,
							d,
							c,
							p = this.waypoints[o][a],
							f = p.options.offset,
							g = p.triggerPoint,
							m = 0,
							y = null == g;
						p.element !== p.element.window && (m = p.adapter.offset()[r.offsetProp]),
							'function' == typeof f
								? (f = f.apply(p))
								: 'string' == typeof f &&
									((f = parseFloat(f)),
									p.options.offset.indexOf('%') > -1 && (f = Math.ceil(r.contextDimension * f / 100))),
							(l = r.contextScroll - r.contextOffset),
							(p.triggerPoint = Math.floor(m + l - f)),
							(h = g < r.oldScroll),
							(u = p.triggerPoint >= r.oldScroll),
							(d = h && u),
							(c = !h && !u),
							!y && d
								? (p.queueTrigger(r.backward), (n[p.group.id] = p.group))
								: !y && c
									? (p.queueTrigger(r.forward), (n[p.group.id] = p.group))
									: y &&
										r.oldScroll >= p.triggerPoint &&
										(p.queueTrigger(r.forward), (n[p.group.id] = p.group));
					}
				}
				return (
					s.requestAnimationFrame(function() {
						for (var t in n) n[t].flushTriggers();
					}),
					this
				);
			}),
			(e.findOrCreateByElement = function(t) {
				return e.findByElement(t) || new e(t);
			}),
			(e.refreshAll = function() {
				for (var t in n) n[t].refresh();
			}),
			(e.findByElement = function(t) {
				return n[t.waypointContextKey];
			}),
			(window.onload = function() {
				o && o(), e.refreshAll();
			}),
			(s.requestAnimationFrame = function(e) {
				var i =
					window.requestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					t;
				i.call(window, e);
			}),
			(s.Context = e);
	})(),
	(function() {
		'use strict';
		function t(t, e) {
			return t.triggerPoint - e.triggerPoint;
		}
		function e(t, e) {
			return e.triggerPoint - t.triggerPoint;
		}
		function i(t) {
			(this.name = t.name),
				(this.axis = t.axis),
				(this.id = this.name + '-' + this.axis),
				(this.waypoints = []),
				this.clearTriggerQueues(),
				(n[this.axis][this.name] = this);
		}
		var n = { vertical: {}, horizontal: {} },
			s = window.Waypoint;
		(i.prototype.add = function(t) {
			this.waypoints.push(t);
		}),
			(i.prototype.clearTriggerQueues = function() {
				this.triggerQueues = { up: [], down: [], left: [], right: [] };
			}),
			(i.prototype.flushTriggers = function() {
				for (var i in this.triggerQueues) {
					var n = this.triggerQueues[i],
						s = 'up' === i || 'left' === i;
					n.sort(s ? e : t);
					for (var o = 0, r = n.length; r > o; o += 1) {
						var a = n[o];
						(a.options.continuous || o === n.length - 1) && a.trigger([ i ]);
					}
				}
				this.clearTriggerQueues();
			}),
			(i.prototype.next = function(e) {
				this.waypoints.sort(t);
				var i = s.Adapter.inArray(e, this.waypoints),
					n = i === this.waypoints.length - 1;
				return n ? null : this.waypoints[i + 1];
			}),
			(i.prototype.previous = function(e) {
				this.waypoints.sort(t);
				var i = s.Adapter.inArray(e, this.waypoints);
				return i ? this.waypoints[i - 1] : null;
			}),
			(i.prototype.queueTrigger = function(t, e) {
				this.triggerQueues[e].push(t);
			}),
			(i.prototype.remove = function(t) {
				var e = s.Adapter.inArray(t, this.waypoints);
				e > -1 && this.waypoints.splice(e, 1);
			}),
			(i.prototype.first = function() {
				return this.waypoints[0];
			}),
			(i.prototype.last = function() {
				return this.waypoints[this.waypoints.length - 1];
			}),
			(i.findOrCreate = function(t) {
				return n[t.axis][t.name] || new i(t);
			}),
			(s.Group = i);
	})(),
	(function() {
		'use strict';
		function t(t) {
			this.$element = e(t);
		}
		var e = window.jQuery,
			i = window.Waypoint;
		e.each(
			[
				'innerHeight',
				'innerWidth',
				'off',
				'offset',
				'on',
				'outerHeight',
				'outerWidth',
				'scrollLeft',
				'scrollTop'
			],
			function(e, i) {
				t.prototype[i] = function() {
					var t = Array.prototype.slice.call(arguments);
					return this.$element[i].apply(this.$element, t);
				};
			}
		),
			e.each([ 'extend', 'inArray', 'isEmptyObject' ], function(i, n) {
				t[n] = e[n];
			}),
			i.adapters.push({ name: 'jquery', Adapter: t }),
			(i.Adapter = t);
	})(),
	(function() {
		'use strict';
		function t(t) {
			return function() {
				var i = [],
					n = arguments[0];
				return (
					t.isFunction(arguments[0]) && ((n = t.extend({}, arguments[1])), (n.handler = arguments[0])),
					this.each(function() {
						var s = t.extend({}, n, { element: this });
						'string' == typeof s.context && (s.context = t(this).closest(s.context)[0]), i.push(new e(s));
					}),
					i
				);
			};
		}
		var e = window.Waypoint;
		window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
			window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
	})(),
	(function($) {
		'use strict';
		function t() {
			$('.page__content').find('img:first').imagesLoaded(function() {
				$('.portfolio-wrap').imagesLoaded(function() {
					$('.portfolio-wrap').masonry({ itemSelector: '.portfolio-item', transitionDuration: 0 });
				}),
					$('.blog-wrap').imagesLoaded(function() {
						$('.blog-wrap').masonry({ itemSelector: '.blog-post', transitionDuration: 0 });
					}),
					$('body').removeClass('loading'),
					$('body').removeClass('menu--open');
			}),
				$('.active-link').removeClass('active-link'),
				$('a[href="' + e + '"]').addClass('active-link'),
				Waypoint.destroyAll();
			var t = 0;
			$('.gallery').each(function() {
				var e = $(this);
				t++;
				var i = 'gallery-' + t;
				e.attr('id', i);
				var n = e.attr('data-columns');
				e.append('<div class="gallery__wrap"></div>'),
					e.children('img').each(function() {
						$(this).appendTo('#' + i + ' .gallery__wrap');
					}),
					e.find('.gallery__wrap img').each(function() {
						var t = $(this).attr('src');
						$(this)
							.wrapAll(
								'<div class="gallery__item"><a href="' +
									t +
									'" class="gallery__item__link"></div></div>'
							)
							.appendTo();
					}),
					e.imagesLoaded(function() {
						if ('1' === n) {
							e.addClass('gallery--carousel'),
								e.children('.gallery__wrap').addClass('owl-carousel'),
								e
									.children('.gallery__wrap')
									.owlCarousel({
										items: 1,
										loop: !0,
										mouseDrag: !1,
										touchDrag: !0,
										pullDrag: !1,
										dots: !0,
										autoplay: !1,
										autoplayTimeout: 6e3,
										autoHeight: !0,
										animateOut: 'fadeOut'
									});
							var t = new Waypoint({
									element: document.getElementById(i),
									handler: function(t) {
										'down' === t && e.children('.gallery__wrap').trigger('stop.owl.autoplay'),
											'up' === t && e.children('.gallery__wrap').trigger('play.owl.autoplay');
									},
									offset: '-100%'
								}),
								s = new Waypoint({
									element: document.getElementById(i),
									handler: function(t) {
										'down' === t && e.children('.gallery__wrap').trigger('play.owl.autoplay'),
											'up' === t && e.children('.gallery__wrap').trigger('stop.owl.autoplay');
									},
									offset: '100%'
								});
						} else e.addClass('gallery--grid'), e.children('.gallery__wrap').masonry({ itemSelector: '.gallery__item', transitionDuration: 0 }), e.find('.gallery__item__link').fluidbox({ loader: !0 });
						e.addClass('gallery--on');
					});
			}),
				$('.single p > img').each(function() {
					var t = $(this).parent('p');
					$(this).insertAfter(t), $(this).wrapAll('<div class="image-wrap"></div>'), t.remove();
				}),
				$('.single iframe').each(function() {
					if ($(this).attr('src').indexOf('youtube') >= 0 || $(this).attr('src').indexOf('vimeo') >= 0) {
						var t = $(this).attr('width'),
							e = $(this).attr('height'),
							i = e / t * 100;
						$(this).wrapAll(
							'<div class="video-wrap"><div class="video" style="padding-bottom:' + i + '%;"></div></div>'
						);
					}
				});
		}
		var e = $('body').attr('data-page-url'),
			i = document.title,
			n = window.History;
		n.Adapter.bind(window, 'statechange', function() {
			var s = n.getState();
			$('body').addClass('loading'),
				$('.page-loader').load(s.hash + ' .page__content', function() {
					$('body, html').animate({ scrollTop: 0 }, 300);
					var n = 1;
					setTimeout(function() {
						$('.page .page__content').remove(),
							$('.page-loader .page__content').appendTo('.page'),
							$('body').attr('data-page-url', window.location.pathname),
							(e = $('body').attr('data-page-url')),
							(i = $('.page__content').attr('data-page-title')),
							(document.title = i),
							t();
					}, n);
				});
		}),
			$('body').hasClass('ajax-loading') &&
				$(document).on('click', 'a', function(t) {
					t.preventDefault();
					var s = $(this).attr('href');
					s.indexOf('http') >= 0
						? window.open(s, '_blank')
						: $(this).hasClass('js-no-ajax')
							? (window.location = s)
							: $(this).hasClass('js-contact')
								? $('.modal--contact').addClass('modal--on')
								: $(this).hasClass('js-signup')
									? $('.modal--signup').addClass('modal--on')
									: $(this).is('.gallery__item__link') || ((e = s), n.pushState(null, i, s));
				}),
			$(document).on('click', '.js-contact', function(t) {
				t.preventDefault(), $('.modal--contact').addClass('modal--on');
			}),
			$(document).on('click', '.js-signup', function(t) {
				t.preventDefault(), $('.modal--signup').addClass('modal--on');
			}),
			t(),
			$(document).on('click', '.js-menu-toggle', function() {
				$('body').hasClass('menu--open')
					? $('body').removeClass('menu--open')
					: $('body').addClass('menu--open');
			}),
			$(document).on('click', '.menu__list__item__link', function() {
				$('.menu').hasClass('menu--open') && $('.menu').removeClass('menu--open');
			}),
			$(document).on('submit', '#contact-form', function(t) {
				$('.contact-form__item--error').removeClass('contact-form__item--error');
				var e = $('.contact-form__input[name="email"]'),
					i = $('.contact-form__input[name="name"]'),
					n = $('.contact-form__textarea[name="message"]'),
					s = $('.contact-form__gotcha');
				'' === e.val() && e.closest('.contact-form__item').addClass('contact-form__item--error'),
					'' === i.val() && i.closest('.contact-form__item').addClass('contact-form__item--error'),
					'' === n.val() && n.closest('.contact-form__item').addClass('contact-form__item--error'),
					('' !== e.val() && '' !== i.val() && '' !== n.val() && 0 === s.val().length) || t.preventDefault();
			});
	})(jQuery);

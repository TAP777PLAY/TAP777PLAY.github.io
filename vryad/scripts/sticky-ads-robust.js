/**
 * Надёжный вызов баннера Eponesh GameScore: C3 иногда вызывает AdsShowSticky
 * до isStickyAvailable — SDK ничего не показывает. Ждём флаг, затем вызываем
 * оригинал; повторные вызовы с одного инстанса сливаются в одну цепочку.
 */
(function () {
	"use strict";
	var patched = false;
	var pollMs = 200;
	var maxWaitMs = 30000;
	function runPatch() {
		if (patched) return true;
		var C3 = self.C3;
		if (!C3 || !C3.Plugins || !C3.Plugins.Eponesh_GameScore || !C3.Plugins.Eponesh_GameScore.Acts) {
			return false;
		}
		var Acts = C3.Plugins.Eponesh_GameScore.Acts;
		var orig = Acts.AdsShowSticky;
		if (typeof orig !== "function" || orig._vryadStickyPatched) {
			return typeof orig === "function";
		}
		Acts.AdsShowSticky = function () {
			var inst = this;
			if (inst._stickyAdGate) {
				return inst._stickyAdGate;
			}
			inst._stickyAdGate = (async function () {
				try {
					var t0 = Date.now();
					while (Date.now() - t0 < maxWaitMs) {
						if (inst.gp && inst.gp.ads && inst.gp.ads.isStickyAvailable) {
							return await Promise.resolve(orig.call(inst));
						}
						await new Promise(function (r) {
							setTimeout(r, pollMs);
						});
					}
					return await Promise.resolve(orig.call(inst));
				} finally {
					inst._stickyAdGate = null;
				}
			})();
			return inst._stickyAdGate;
		};
		Acts.AdsShowSticky._vryadStickyPatched = true;
		patched = true;
		return true;
	}
	if (!runPatch()) {
		var t = setInterval(function () {
			if (runPatch()) clearInterval(t);
		}, 50);
		setTimeout(function () {
			clearInterval(t);
		}, 120000);
	}
})();

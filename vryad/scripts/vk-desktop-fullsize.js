/**
 * Мини-приложение ВК: после Init запрашивает максимальный размер окна (VKWebAppResizeWindow).
 * На ПК в клиенте ВК обычно разворачивает iframe; на средах без метода — тихо пропускает.
 */
(function () {
	"use strict";
	function inVkContext() {
		var q = location.search;
		return /[?&]vk_app_id=/.test(q) || /[?&]vk_platform=/.test(q) || /[?&]vk_user_id=/.test(q);
	}
	function canResize(bridge) {
		if (bridge.supportsAsync) return bridge.supportsAsync("VKWebAppResizeWindow");
		return Promise.resolve(bridge.supports ? bridge.supports("VKWebAppResizeWindow") : false);
	}
	function run() {
		if (!inVkContext()) return;
		var bridge = window.vkBridge && window.vkBridge.default;
		if (!bridge || typeof bridge.send !== "function") return;
		bridge
			.send("VKWebAppInit", {})
			.then(function () {
				return canResize(bridge);
			})
			.then(function (ok) {
				if (!ok) return;
				var w = Math.max(
					window.screen.availWidth,
					window.innerWidth,
					document.documentElement.clientWidth || 0
				);
				var h = Math.max(
					window.screen.availHeight,
					window.innerHeight,
					document.documentElement.clientHeight || 0
				);
				return bridge.send("VKWebAppResizeWindow", { width: w, height: h });
			})
			.catch(function () {});
	}
	if (window.vkBridge && window.vkBridge.default) {
		run();
	}
})();

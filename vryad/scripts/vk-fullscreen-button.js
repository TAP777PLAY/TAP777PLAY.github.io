/**
 * Кнопка «На весь экран» (только в ВК). Bridge грузится по клику.
 * z-index панели в CSS низкий — не перекрывает липкий баннер снизу.
 */
(function () {
	"use strict";
	var BRIDGE = "https://unpkg.com/@vkontakte/vk-bridge@2.15.0/dist/index.umd.js";
	var STORAGE = "vryad_vkfs_hidden";

	function inVkContext() {
		var q = location.search;
		return /[?&]vk_app_id=/.test(q) || /[?&]vk_platform=/.test(q) || /[?&]vk_user_id=/.test(q);
	}

	function getOverlay() {
		return document.getElementById("vkFsOverlay");
	}

	function loadScript(src) {
		return new Promise(function (resolve, reject) {
			if (getBridge()) {
				resolve();
				return;
			}
			var s = document.createElement("script");
			s.src = src;
			s.async = true;
			s.onload = function () {
				resolve();
			};
			s.onerror = function () {
				reject(new Error("load fail"));
			};
			document.head.appendChild(s);
		});
	}

	function getBridge() {
		return window.vkBridge && window.vkBridge.default;
	}

	function canResize(bridge) {
		if (bridge.supportsAsync) return bridge.supportsAsync("VKWebAppResizeWindow");
		return Promise.resolve(bridge.supports ? bridge.supports("VKWebAppResizeWindow") : false);
	}

	function goVkExpand(bridge) {
		return bridge
			.send("VKWebAppInit", {})
			.then(function () {
				return canResize(bridge);
			})
			.then(function (ok) {
				if (!ok) return { expanded: false };
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
				return bridge.send("VKWebAppResizeWindow", { width: w, height: h }).then(function () {
					return { expanded: true };
				});
			});
	}

	function goBrowserFullscreen() {
		var el = document.documentElement;
		if (el.requestFullscreen) return el.requestFullscreen();
		if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
		if (el.msRequestFullscreen) return el.msRequestFullscreen();
		return Promise.reject(new Error("no fullscreen API"));
	}

	function hideOverlay() {
		var o = getOverlay();
		if (o) o.classList.add("vk-fs-hidden");
	}

	function onActivate() {
		var btn = document.getElementById("vkFsBtn");
		if (btn) btn.disabled = true;
		var vkDidExpand = false;

		loadScript(BRIDGE)
			.then(function () {
				var bridge = getBridge();
				if (bridge) {
					return goVkExpand(bridge)
						.then(function (r) {
							if (r && r.expanded) vkDidExpand = true;
							return r;
						})
						.catch(function (e) {
							console.warn("[vk-fs] VKWebApp init/resize:", e);
						});
				}
			})
			.then(function () {
				return goBrowserFullscreen().catch(function (e) {
					console.warn("[vk-fs] requestFullscreen:", e);
				});
			})
			.finally(function () {
				if (btn) btn.disabled = false;
				if (document.fullscreenElement || document.webkitFullscreenElement || vkDidExpand) {
					hideOverlay();
				}
			});
	}

	function init() {
		if (!inVkContext()) return;
		if (sessionStorage.getItem(STORAGE) === "1") return;
		var overlay = getOverlay();
		if (!overlay) return;
		overlay.classList.remove("vk-fs-hidden");
		var btn = document.getElementById("vkFsBtn");
		var d = document.getElementById("vkFsDismiss");
		if (btn) btn.addEventListener("click", onActivate, { once: false });
		if (d) {
			d.addEventListener("click", function () {
				sessionStorage.setItem(STORAGE, "1");
				hideOverlay();
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

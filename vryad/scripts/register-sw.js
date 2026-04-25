"use strict";
/**
 * Регистрация SW отложена: не конкурирует с парсингом/инициализацией C3 на первом кадре.
 * Полный кэш по-прежнему поднимается, чуть позже.
 */
window.C3_RegisterSW = async function () {
	if (!navigator.serviceWorker) return;
	const go = () => {
		navigator.serviceWorker
			.register("sw.js", { scope: "./" })
			.then((r) => console.info("Registered service worker on " + r.scope))
			.catch((e) => console.warn("Failed to register service worker: ", e));
	};
	if (typeof requestIdleCallback === "function") {
		requestIdleCallback(() => go(), { timeout: 4000 });
	} else {
		window.addEventListener("load", () => setTimeout(go, 0), { once: true });
	}
};

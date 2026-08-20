(function (global) {
  const APP_ID = 51901586;
  const params = new URLSearchParams(location.search);

  function inVk() {
    const blob = [location.search, location.hash, document.referrer, location.hostname].join(" ");
    return (
      params.has("vk_user_id") ||
      params.has("api_id") ||
      params.get("vk_app_id") === String(APP_ID) ||
      /vk_user_id=/.test(blob) ||
      /vk_app_id=/.test(blob) ||
      /(?:^|\.)vk\.(com|ru)|vk-apps|vkuser/i.test(blob)
    );
  }

  let lastNativeAt = 0;
  let bannerShown = false;
  let bannerAsked = false;
  let interstitialArmed = false;
  let nativeBusy = false;

  function vkPlatform() {
    const blob = location.search + "&" + location.hash;
    const m = blob.match(/vk_platform=([^&]+)/i);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function isVkDesktop() {
    const p = vkPlatform();
    if (/android|ios|mobile_web/i.test(p)) return false;
    if (p === "desktop_web" || p === "web") return true;
    if (inVk() && /https?:\/\/(?:www\.)?vk\.(com|ru)/i.test(document.referrer) && !/\/\/m\.vk\./i.test(document.referrer)) return true;
    return window.innerWidth >= 980;
  }

  function isDesktop() {
    return window.innerWidth >= 860;
  }

  function fsNode() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function bridge() {
    return global.vkBridge || global.bridge || null;
  }

  function fit(stage) {
    const desktop = isDesktop();
    const full = !!fsNode();
    const bannerH = bannerShown ? (parseInt(document.documentElement.style.getPropertyValue("--vk-banner-h"), 10) || 50) : 0;
    const padY = (full ? 16 : desktop ? 24 : 8) + bannerH;
    const viewH = Math.max(480, window.innerHeight - padY);
    const viewW = window.innerWidth;

    let w;
    let h;
    if (full || desktop) {
      h = Math.floor(Math.min(viewH, full ? 1400 : 1100));
      w = Math.round(Math.min(full ? 760 : 680, Math.max(500, h * 0.62)));
      const sides = full ? 24 : 248;
      if (w + sides > viewW - 16) {
        w = Math.max(420, viewW - sides - 16);
        h = Math.min(h, Math.round(w / 0.58));
      }
    } else {
      w = Math.min(420, viewW);
      h = Math.min(780, viewH);
    }

    stage.style.width = w + "px";
    stage.style.height = h + "px";
    stage.style.transform = "none";
    document.documentElement.style.setProperty("--stage-w", w + "px");
    document.documentElement.style.setProperty("--stage-h", h + "px");

    const slot = document.getElementById("stage-slot");
    if (slot) {
      slot.style.width = w + "px";
      slot.style.height = h + "px";
    }

    document.body.classList.toggle("vk-desktop", inVk() && desktop);
    document.body.classList.toggle("is-vk", inVk());
    document.body.classList.toggle("is-desktop", desktop);
    document.body.classList.toggle("vk-desk", isVkDesktop() && window.innerWidth >= 800);
    document.body.classList.toggle("is-fs", full);
    return 1;
  }

  function pauseAudio() {
    if (global.Sfx && Sfx.pauseMusic) Sfx.pauseMusic();
  }
  function resumeAudio() {
    if (global.Sfx && Sfx.resumeMusic) Sfx.resumeMusic();
  }

  async function send(method, payload) {
    const api = bridge();
    if (!api || !inVk()) return null;
    try {
      return await api.send(method, payload || {});
    } catch (err) {
      return null;
    }
  }

  async function showNative(format) {
    if (nativeBusy) return false;
    if (format === "interstitial" && !interstitialArmed) return false;
    if (format === "interstitial") interstitialArmed = false;
    if (!inVk() || !bridge()) return params.get("adtest") === "1" && format === "reward";
    const gap = format === "interstitial" ? 120000 : 31000;
    if (Date.now() - lastNativeAt < gap) return false;
    nativeBusy = true;
    pauseAudio();
    try {
      const payload = { ad_format: format };
      if (format === "reward") payload.use_waterfall = true;
      const res = await send("VKWebAppShowNativeAds", payload);
      if (res && res.result) {
        lastNativeAt = Date.now();
        return true;
      }
      return false;
    } finally {
      nativeBusy = false;
      resumeAudio();
    }
  }

  function applyBanner(data) {
    bannerShown = true;
    bannerAsked = true;
    const h = (data && data.banner_height) || 50;
    document.documentElement.style.setProperty("--vk-banner-h", h + "px");
    document.body.classList.add("has-vk-banner");
    const stage = document.getElementById("stage");
    if (stage) fit(stage);
  }

  async function showBanner() {
    if (!inVk() || !bridge() || bannerShown || bannerAsked) return;
    bannerAsked = true;
    const check = await send("VKWebAppCheckBannerAd");
    if (check && check.result) {
      applyBanner(check);
      return;
    }
    const res = await send("VKWebAppShowBannerAd", {
      banner_location: "bottom",
      layout_type: "overlay",
      can_close: false,
    });
    if (res && res.result) applyBanner(res);
  }

  function onBridgeEvent(event) {
    const type = event && event.detail && event.detail.type;
    const data = (event && event.detail && event.detail.data) || {};
    if (type === "VKWebAppShowBannerAdResult" || type === "VKWebAppBannerAdUpdated") {
      applyBanner(data);
    }
    if (type === "VKWebAppBannerAdClosedByUser") {
      bannerShown = false;
      document.body.classList.remove("has-vk-banner");
      document.documentElement.style.setProperty("--vk-banner-h", "0px");
      const stage = document.getElementById("stage");
      if (stage) fit(stage);
    }
    if (type === "VKWebAppResizeWindowResult" || type === "VKWebAppUpdateConfig") {
      const stage = document.getElementById("stage");
      if (stage) fit(stage);
    }
  }

  function launchQuery() {
    if (/\bvk_user_id=/.test(location.search)) return location.search;
    const hash = location.hash || "";
    const q = hash.indexOf("?");
    if (q >= 0 && /\bvk_user_id=/.test(hash)) return hash.slice(q);
    return location.search;
  }

  function apiBase() {
    const cfg = global.GAME_CONFIG || {};
    const configured = String(cfg.API_BASE || "").replace(/\/$/, "");
    if (configured) return configured;
    if (/\.vercel\.app$/i.test(location.hostname)) return location.origin;
    return "";
  }

  let vkUser = null;

  async function getUser() {
    if (vkUser) return vkUser;
    const res = await send("VKWebAppGetUserInfo");
    if (!res || !res.id) return null;
    vkUser = {
      id: res.id,
      name: [res.first_name, res.last_name].filter(Boolean).join(" ").trim() || "Боец",
      photo: res.photo_200 || res.photo_100 || res.photo_50 || "",
    };
    return vkUser;
  }

  async function apiFetch(path, opts) {
    const base = apiBase();
    if (!base) return null;
    try {
      const headers = Object.assign({ Accept: "application/json" }, (opts && opts.headers) || {});
      const q = launchQuery().replace(/^\?/, "");
      if (q) headers["X-VK-Launch"] = q;
      const res = await fetch(base + path, Object.assign({}, opts, { headers }));
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  function fetchLeaderboard() {
    return apiFetch("/api/leaderboard?limit=20");
  }

  function submitScore(payload) {
    if (!inVk() || !apiBase()) return Promise.resolve(null);
    return apiFetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        launch: launchQuery(),
        trophies: payload.trophies,
        level: payload.level,
        score: payload.score || 0,
        name: payload.name,
        photo: payload.photo,
      }),
    });
  }

  function showOfficialBoard(userResult) {
    return send("VKWebAppShowLeaderBoardBox", {
      user_result: Math.max(0, Number(userResult) || 0),
    });
  }

  async function toggleFullscreen() {
    const target = document.documentElement;
    const full = !!fsNode();
    try {
      if (full) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        if (inVk() && isVkDesktop()) {
          const h = Math.max(720, Math.min(1000, Math.round((window.screen && window.screen.height) || 900) * 0.85));
          await send("VKWebAppResizeWindow", { width: 1000, height: h });
        }
        if (target.requestFullscreen) await target.requestFullscreen();
        else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
      }
    } catch (err) {}
    const stage = document.getElementById("stage");
    document.body.classList.toggle("is-fs", !!fsNode());
    if (stage) fit(stage);
    return !!fsNode();
  }

  function onFsChange() {
    const stage = document.getElementById("stage");
    document.body.classList.toggle("is-fs", !!fsNode());
    if (stage) fit(stage);
  }

  async function expandVkDesktop() {
    if (!isVkDesktop()) return;
    const cfg = await send("VKWebAppGetConfig");
    const availW = (cfg && (cfg.avail_width || cfg.viewport_width)) || 1000;
    const availH = (cfg && (cfg.avail_height || cfg.viewport_height)) || 860;
    const width = Math.max(900, Math.min(1000, Number(availW) || 1000));
    const height = Math.max(720, Math.min(1000, (Number(availH) || 860) - 24));
    await send("VKWebAppResizeWindow", { width, height });
    const stage = document.getElementById("stage");
    if (stage) fit(stage);
  }

  async function init() {
    document.body.classList.toggle("is-vk", inVk());
    const api = bridge();
    if (api && typeof api.subscribe === "function") api.subscribe(onBridgeEvent);
    if (api) await send("VKWebAppInit");
    await expandVkDesktop();
    document.body.classList.toggle("vk-desktop", inVk() && isDesktop());
    document.body.classList.toggle("vk-desk", isVkDesktop() && window.innerWidth >= 800);
    const stage = document.getElementById("stage");
    if (stage) fit(stage);
    setTimeout(showBanner, 2500);
    document.addEventListener("pointerdown", () => {
      expandVkDesktop();
    }, { once: true });
  }

  global.Platform = {
    APP_ID,
    get isVk() {
      return inVk();
    },
    get isDesktop() {
      return isDesktop();
    },
    get isFullscreen() {
      return !!fsNode();
    },
    fit,
    init,
    getUser,
    fetchLeaderboard,
    submitScore,
    showOfficialBoard,
    apiBase,
    toggleFullscreen,
    armInterstitial: function () {
      interstitialArmed = true;
    },
    showInterstitial: function () {
      return showNative("interstitial");
    },
    showReward: function () {
      return showNative("reward");
    },
    showBanner,
  };
})(window);

(function (global) {
  const APP_ID = 51901586;
  const AD_GAP_MS = 31000;
  const params = new URLSearchParams(location.search);
  const isVk =
    params.has("vk_user_id") ||
    params.has("api_id") ||
    params.get("vk_app_id") === String(APP_ID) ||
    /vk\./i.test(location.hostname);

  let lastNativeAt = 0;
  let bannerShown = false;

  function isDesktop() {
    return window.innerWidth >= 980;
  }

  function bridge() {
    return global.vkBridge || global.bridge || null;
  }

  function fit(stage) {
    const desktop = isDesktop();
    const bannerH = bannerShown ? (parseInt(document.documentElement.style.getPropertyValue("--vk-banner-h"), 10) || 50) : 0;
    const padY = (desktop ? 24 : 8) + bannerH;
    const viewH = Math.max(480, window.innerHeight - padY);
    const viewW = window.innerWidth;

    let w;
    let h;
    if (desktop) {
      h = Math.floor(Math.min(viewH, 1100));
      w = Math.round(Math.min(680, Math.max(500, h * 0.62)));
      const sides = 210 * 2 + 32;
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

    document.body.classList.toggle("vk-desktop", isVk && desktop);
    document.body.classList.toggle("is-vk", isVk);
    document.body.classList.toggle("is-desktop", desktop);
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
    if (!api || !isVk) return null;
    try {
      return await api.send(method, payload || {});
    } catch (err) {
      return null;
    }
  }

  async function check(format) {
    const res = await send("VKWebAppCheckNativeAds", { ad_format: format });
    if (!res) return true;
    return res.result !== false;
  }

  async function showNative(format) {
    if (!isVk || !bridge()) return params.get("adtest") === "1";
    if (Date.now() - lastNativeAt < AD_GAP_MS) return false;
    const ok = await check(format);
    if (!ok) return false;
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
      resumeAudio();
    }
  }

  function applyBanner(data) {
    bannerShown = true;
    const h = (data && data.banner_height) || 50;
    document.documentElement.style.setProperty("--vk-banner-h", h + "px");
    document.body.classList.add("has-vk-banner");
    const stage = document.getElementById("stage");
    if (stage) fit(stage);
  }

  async function showBanner() {
    if (!isVk || bannerShown || !bridge()) return;
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
    return String(cfg.API_BASE || "").replace(/\/$/, "");
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
    if (!isVk || !apiBase()) return Promise.resolve(null);
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

  async function init() {
    document.body.classList.toggle("vk-desktop", isVk && isDesktop());
    document.body.classList.toggle("is-vk", isVk);
    const api = bridge();
    if (!api) return;
    if (typeof api.subscribe === "function") api.subscribe(onBridgeEvent);
    await send("VKWebAppInit");
    send("VKWebAppCheckNativeAds", { ad_format: "interstitial" });
    send("VKWebAppCheckNativeAds", { ad_format: "reward", use_waterfall: true });
    setTimeout(showBanner, 2200);
  }

  global.Platform = {
    APP_ID,
    isVk,
    get isDesktop() {
      return isDesktop();
    },
    fit,
    init,
    getUser,
    fetchLeaderboard,
    submitScore,
    showOfficialBoard,
    apiBase,
    showInterstitial: function () {
      return showNative("interstitial");
    },
    showReward: function () {
      return showNative("reward");
    },
    showBanner,
  };
})(window);

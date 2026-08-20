import crypto from "node:crypto";

export const APP_ID = (() => {
  const n = Number(process.env.VK_APP_ID);
  return Number.isFinite(n) && n > 0 ? n : 51901586;
})();
const MAX_TS_AGE = Number(process.env.LAUNCH_MAX_AGE || 60 * 60 * 24 * 7);
export const MAX_TROPHIES = 100000;
export const MAX_LEVEL = 80;
export const RATE_MS = 2500;
const BOARD_KEY = "gem-brawl-board";
const HASH_KEY = "gem-brawl-players";

export function secrets() {
  return {
    secureKey: String(process.env.VK_SECURE_KEY || "").trim().replace(/^["']|["']$/g, ""),
    serviceToken: String(process.env.VK_SERVICE_TOKEN || "").trim().replace(/^["']|["']$/g, ""),
  };
}

function vkEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (c) =>
    "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

export function verifyLaunch(search) {
  const { secureKey } = secrets();
  const raw = String(search || "").replace(/^\?/, "");
  const queryParams = [];
  let sign = "";
  const decoded = {};
  for (const part of raw.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const key = decodeURIComponent((eq === -1 ? part : part.slice(0, eq)).replace(/\+/g, " "));
    const encVal = eq === -1 ? "" : part.slice(eq + 1);
    const value = decodeURIComponent(encVal.replace(/\+/g, " "));
    if (key === "sign") sign = value;
    else if (key.startsWith("vk_")) {
      queryParams.push({ key, value });
      decoded[key] = value;
    }
  }
  if (!sign || !queryParams.length || !secureKey) return { ok: false, reason: "no_sign" };
  queryParams.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const signNorm = String(sign).trim().replace(/=+$/g, "");
  const hmacOf = (qs) =>
    crypto
      .createHmac("sha256", secureKey)
      .update(qs)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  const qsVk = queryParams.map(({ key, value }) => `${key}=${vkEncode(value)}`).join("&");
  const qsEnc = queryParams.map(({ key, value }) => `${key}=${encodeURIComponent(value)}`).join("&");
  const qsForm = new URLSearchParams(queryParams.map(({ key, value }) => [key, value])).toString();
  const variants = [qsVk, qsEnc, qsForm];
  if (!variants.some((qs) => hmacOf(qs) === signNorm)) return { ok: false, reason: "bad_sign" };
  if (Number(decoded.vk_app_id) !== APP_ID) return { ok: false, reason: "app" };
  const ts = Number(decoded.vk_ts || 0);
  if (ts && Math.abs(Date.now() / 1000 - ts) > MAX_TS_AGE) return { ok: false, reason: "expired" };
  const userId = Number(decoded.vk_user_id);
  if (!Number.isInteger(userId) || userId <= 0) return { ok: false, reason: "user" };
  return { ok: true, userId, params: decoded };
}

export function sanitizeName(name) {
  const s = String(name || "")
    .replace(/[<>&"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
  return s || "Боец";
}

export function sanitizePhoto(url) {
  try {
    const u = new URL(String(url || ""));
    if (u.protocol !== "https:") return "";
    const host = u.hostname.toLowerCase();
    const ok =
      host.endsWith("userapi.com") ||
      host.endsWith("vk.com") ||
      host.endsWith("vk.ru") ||
      host.endsWith("vkuserphoto.ru") ||
      host.endsWith("vk-cdn.net");
    return ok ? u.toString().slice(0, 300) : "";
  } catch {
    return "";
  }
}

export function clampInt(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.floor(v)));
}

export function rankedList(users) {
  return Object.values(users || {})
    .filter((u) => u && Number(u.id) > 0)
    .sort(
      (a, b) =>
        (b.trophies || 0) - (a.trophies || 0) ||
        (b.level || 0) - (a.level || 0) ||
        (a.updatedAt || 0) - (b.updatedAt || 0)
    );
}

export function publicRow(u, place) {
  return {
    place,
    id: u.id,
    name: u.name,
    photo: u.photo || "",
    trophies: u.trophies,
    level: u.level,
  };
}

export function leaderboardPayload(users, meId, limit) {
  const all = rankedList(users);
  const items = all.slice(0, limit).map((u, i) => publicRow(u, i + 1));
  let me = null;
  if (meId) {
    const idx = all.findIndex((u) => Number(u.id) === Number(meId));
    if (idx >= 0) me = publicRow(all[idx], idx + 1);
  }
  return { ok: true, total: all.length, items, me };
}

export function mergeScore(prev, body, userId) {
  const trophies = clampInt(body.trophies, 0, MAX_TROPHIES);
  const level = clampInt(body.level, 1, MAX_LEVEL);
  const score = clampInt(body.score, 0, 10_000_000);
  const base = prev || { id: userId, trophies: 0, level: 1, bestScore: 0, vkLevel: 0, vkScore: 0 };
  return {
    ...base,
    id: userId,
    name: sanitizeName(body.name || base.name),
    photo: sanitizePhoto(body.photo) || base.photo || "",
    trophies: Math.max(base.trophies || 0, trophies),
    level: Math.max(base.level || 1, level),
    bestScore: Math.max(base.bestScore || 0, score),
    updatedAt: Date.now(),
  };
}

export async function pushVkEvents(user) {
  const { serviceToken } = secrets();
  if (!serviceToken) return user;
  async function vkMethod(method, params) {
    const body = new URLSearchParams({
      access_token: serviceToken,
      v: "5.199",
      ...params,
    });
    const res = await fetch("https://api.vk.com/method/" + method, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return res.json();
  }
  if (user.level > (user.vkLevel || 0)) {
    const data = await vkMethod("secure.addAppEvent", {
      user_id: String(user.id),
      activity_id: "1",
      value: String(user.level),
    });
    if (!data.error) user.vkLevel = user.level;
  }
  if (user.trophies > (user.vkScore || 0)) {
    const data = await vkMethod("secure.addAppEvent", {
      user_id: String(user.id),
      activity_id: "2",
      value: String(user.trophies),
    });
    if (!data.error) user.vkScore = user.trophies;
  }
  return user;
}

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export function storageKind() {
  return redisEnv() ? "redis" : "memory";
}

const memory = { users: {} };

async function redisCommand(args) {
  const redis = redisEnv();
  if (!redis) return { result: null };
  try {
    const res = await fetch(redis.url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + redis.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    return await res.json();
  } catch {
    return { result: null, error: "redis" };
  }
}

function parseHash(result) {
  const users = {};
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i += 2) {
      try {
        users[result[i]] = JSON.parse(result[i + 1]);
      } catch {}
    }
    return users;
  }
  if (result && typeof result === "object") {
    Object.keys(result).forEach((k) => {
      try {
        const v = result[k];
        users[k] = typeof v === "string" ? JSON.parse(v) : v;
      } catch {}
    });
  }
  return users;
}

export async function loadUsers() {
  const redis = redisEnv();
  if (!redis) return { ...memory.users };
  const users = {};
  const legacy = await redisCommand(["GET", BOARD_KEY]);
  if (legacy && legacy.result && !legacy.error) {
    try {
      const parsed = JSON.parse(legacy.result);
      Object.assign(users, parsed.users || parsed || {});
    } catch {}
  }
  const hash = await redisCommand(["HGETALL", HASH_KEY]);
  Object.assign(users, parseHash(hash && hash.result));
  return users;
}

export async function redisWriteOk() {
  const redis = redisEnv();
  if (!redis) return false;
  const ping = "gem-brawl-ping";
  const mark = String(Date.now());
  const set = await redisCommand(["SET", ping, mark]);
  if (!set || set.error) return false;
  const get = await redisCommand(["GET", ping]);
  return String(get && get.result) === mark;
}

export async function saveUser(user) {
  if (!user || user.id == null) return;
  const redis = redisEnv();
  if (!redis) {
    memory.users[user.id] = user;
    return;
  }
  const res = await redisCommand(["HSET", HASH_KEY, String(user.id), JSON.stringify(user)]);
  if (res && res.error) throw new Error(String(res.error));
}

export async function saveUsers(users) {
  const list = Object.values(users || {});
  for (const user of list) await saveUser(user);
}

export function corsHeaders(origin) {
  const raw = String(process.env.ALLOWED_ORIGINS || "*")
    .replace(/^ALLOWED_ORIGINS\s*=\s*/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  const allowed = (raw || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const star = allowed.includes("*");
  const allow = star ? "*" : allowed.includes(origin) ? origin : allowed[0] || "*";
  return {
    "Access-Control-Allow-Origin": allow || "*",
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-VK-Launch",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  };
}

export function json(res, code, obj, origin) {
  const headers = corsHeaders(origin);
  if (typeof res.setHeader === "function") {
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    res.status(code).send(JSON.stringify(obj));
    return;
  }
  return new Response(JSON.stringify(obj), { status: code, headers });
}

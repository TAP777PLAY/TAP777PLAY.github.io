import crypto from "node:crypto";

export const APP_ID = Number(process.env.VK_APP_ID || 51901586);
const MAX_TS_AGE = Number(process.env.LAUNCH_MAX_AGE || 60 * 60 * 24 * 7);
export const MAX_TROPHIES = 100000;
export const MAX_LEVEL = 80;
export const RATE_MS = 2500;
const BOARD_KEY = "gem-brawl-board";

export function secrets() {
  return {
    secureKey: process.env.VK_SECURE_KEY || "",
    serviceToken: process.env.VK_SERVICE_TOKEN || "",
  };
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
  queryParams.sort((a, b) => a.key.localeCompare(b.key));
  const queryString = queryParams
    .map(({ key, value }) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const hash = crypto
    .createHmac("sha256", secureKey)
    .update(queryString)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  if (hash !== sign) return { ok: false, reason: "bad_sign" };
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
  return Object.values(users || {}).sort(
    (a, b) => b.trophies - a.trophies || b.level - a.level || a.updatedAt - b.updatedAt
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
    const idx = all.findIndex((u) => u.id === meId);
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
  const res = await fetch(redis.url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + redis.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  return res.json();
}

export async function loadUsers() {
  const redis = redisEnv();
  if (!redis) return memory.users;
  const data = await redisCommand(["GET", BOARD_KEY]);
  if (!data || data.result == null) return {};
  try {
    const parsed = JSON.parse(data.result);
    return parsed.users || parsed || {};
  } catch {
    return {};
  }
}

export async function saveUsers(users) {
  const redis = redisEnv();
  if (!redis) {
    memory.users = users;
    return;
  }
  await redisCommand(["SET", BOARD_KEY, JSON.stringify({ users, savedAt: Date.now() })]);
}

export function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allow = allowed.includes("*") || allowed.includes(origin) ? origin || "*" : allowed[0] || "*";
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

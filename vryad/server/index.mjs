import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(__dirname, ".env"));
loadEnv(path.join(__dirname, "..", ".env"));

const APP_ID = Number(process.env.VK_APP_ID || 51901586);
const SECURE_KEY = process.env.VK_SECURE_KEY || "";
const SERVICE_TOKEN = process.env.VK_SERVICE_TOKEN || "";
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || (process.env.PORT ? "0.0.0.0" : "127.0.0.1");
const ORIGINS = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data", "leaderboard.json");
const MAX_TS_AGE = Number(process.env.LAUNCH_MAX_AGE || 60 * 60 * 24 * 7);
const MAX_TROPHIES = 100000;
const MAX_LEVEL = 80;
const RATE_MS = 2500;

if (!SECURE_KEY || !SERVICE_TOKEN) {
  console.error("Задайте VK_SECURE_KEY и VK_SERVICE_TOKEN в gem-brawl/server/.env");
  process.exit(1);
}

const store = { users: {}, loaded: false };
const rate = new Map();
let writeChain = Promise.resolve();

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null) process.env[key] = val;
  }
}

function loadStore() {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    store.users = raw.users || {};
  } catch {
    store.users = {};
  }
  store.loaded = true;
}

function saveStore() {
  writeChain = writeChain.then(() => {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify({ users: store.users, savedAt: Date.now() }, null, 0));
    fs.renameSync(tmp, DATA_FILE);
  }).catch((err) => {
    console.error("save failed", err.message);
  });
  return writeChain;
}

function verifyLaunch(search) {
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
  if (!sign || !queryParams.length) return { ok: false, reason: "no_sign" };
  queryParams.sort((a, b) => a.key.localeCompare(b.key));
  const queryString = queryParams
    .map(({ key, value }) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const hash = crypto
    .createHmac("sha256", SECURE_KEY)
    .update(queryString)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  if (hash !== sign) return { ok: false, reason: "bad_sign" };
  const appId = Number(decoded.vk_app_id);
  if (appId !== APP_ID) return { ok: false, reason: "app" };
  const ts = Number(decoded.vk_ts || 0);
  if (ts && Math.abs(Date.now() / 1000 - ts) > MAX_TS_AGE) return { ok: false, reason: "expired" };
  const userId = Number(decoded.vk_user_id);
  if (!Number.isInteger(userId) || userId <= 0) return { ok: false, reason: "user" };
  return { ok: true, userId, params: decoded };
}

function sanitizeName(name) {
  const s = String(name || "")
    .replace(/[<>&"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
  return s || "Боец";
}

function sanitizePhoto(url) {
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

function clampInt(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.floor(v)));
}

function rankedList() {
  return Object.values(store.users)
    .sort((a, b) => b.trophies - a.trophies || b.level - a.level || a.updatedAt - b.updatedAt);
}

function publicRow(u, place) {
  return {
    place,
    id: u.id,
    name: u.name,
    photo: u.photo || "",
    trophies: u.trophies,
    level: u.level,
  };
}

function tooFast(userId) {
  const now = Date.now();
  const prev = rate.get(userId) || 0;
  if (now - prev < RATE_MS) return true;
  rate.set(userId, now);
  return false;
}

async function vkMethod(method, params) {
  const body = new URLSearchParams({
    access_token: SERVICE_TOKEN,
    v: "5.199",
    ...params,
  });
  const res = await fetch("https://api.vk.com/method/" + method, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  return data;
}

async function pushVkEvents(user) {
  const jobs = [];
  if (user.level > (user.vkLevel || 0)) {
    jobs.push(
      vkMethod("secure.addAppEvent", {
        user_id: String(user.id),
        activity_id: "1",
        value: String(user.level),
      }).then((data) => {
        if (!data.error) user.vkLevel = user.level;
        else console.warn("addAppEvent level", user.id, data.error && data.error.error_msg);
      })
    );
  }
  if (user.trophies > (user.vkScore || 0)) {
    jobs.push(
      vkMethod("secure.addAppEvent", {
        user_id: String(user.id),
        activity_id: "2",
        value: String(user.trophies),
      }).then((data) => {
        if (!data.error) user.vkScore = user.trophies;
        else console.warn("addAppEvent score", user.id, data.error && data.error.error_msg);
      })
    );
  }
  await Promise.all(jobs);
}

function cors(req, res) {
  const origin = req.headers.origin || "";
  const allow = ORIGINS.includes("*") || ORIGINS.includes(origin) ? origin || "*" : ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allow || "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-VK-Launch");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 8000) {
        reject(new Error("too_big"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function leaderboardPayload(meId, limit) {
  const all = rankedList();
  const items = all.slice(0, limit).map((u, i) => publicRow(u, i + 1));
  let me = null;
  if (meId) {
    const idx = all.findIndex((u) => u.id === meId);
    if (idx >= 0) me = publicRow(all[idx], idx + 1);
  }
  return { ok: true, total: all.length, items, me };
}

async function handleScore(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req) || "{}");
  } catch {
    send(res, 400, { ok: false, error: "json" });
    return;
  }
  const launch = body.launch || req.headers["x-vk-launch"] || "";
  const verified = verifyLaunch(launch);
  if (!verified.ok) {
    send(res, 401, { ok: false, error: "sign" });
    return;
  }
  if (tooFast(verified.userId)) {
    send(res, 429, { ok: false, error: "rate" });
    return;
  }
  const trophies = clampInt(body.trophies, 0, MAX_TROPHIES);
  const level = clampInt(body.level, 1, MAX_LEVEL);
  const score = clampInt(body.score, 0, 10_000_000);
  const prev = store.users[verified.userId] || {
    id: verified.userId,
    trophies: 0,
    level: 1,
    bestScore: 0,
    vkLevel: 0,
    vkScore: 0,
  };
  const next = {
    ...prev,
    id: verified.userId,
    name: sanitizeName(body.name || prev.name),
    photo: sanitizePhoto(body.photo) || prev.photo || "",
    trophies: Math.max(prev.trophies || 0, trophies),
    level: Math.max(prev.level || 1, level),
    bestScore: Math.max(prev.bestScore || 0, score),
    updatedAt: Date.now(),
  };
  store.users[verified.userId] = next;
  await saveStore();
  pushVkEvents(next).catch(() => {});
  send(res, 200, leaderboardPayload(verified.userId, 20));
}

function handleLeaderboard(req, res, url) {
  const launch = req.headers["x-vk-launch"] || url.searchParams.get("launch") || "";
  const verified = launch ? verifyLaunch(launch) : { ok: false };
  const limit = clampInt(url.searchParams.get("limit") || 20, 1, 50);
  send(res, 200, leaderboardPayload(verified.ok ? verified.userId : 0, limit));
}

if (!store.loaded) loadStore();

const server = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const url = new URL(req.url || "/", "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, { ok: true, appId: APP_ID, players: Object.keys(store.users).length });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/leaderboard") {
      handleLeaderboard(req, res, url);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/score") {
      await handleScore(req, res);
      return;
    }
    send(res, 404, { ok: false, error: "not_found" });
  } catch (err) {
    console.error(err);
    send(res, 500, { ok: false, error: "server" });
  }
});

server.listen(PORT, HOST, () => {
  console.log("gem-brawl api http://" + HOST + ":" + PORT + " app " + APP_ID);
});

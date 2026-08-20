import {
  APP_ID,
  clampInt,
  corsHeaders,
  json,
  leaderboardPayload,
  loadUsers,
  mergeScore,
  pushVkEvents,
  redisWriteOk,
  saveUser,
  secrets,
  storageKind,
  verifyLaunch,
} from "../server/lib.mjs";

export function originOf(req) {
  return (req.headers && (req.headers.origin || req.headers.Origin)) || "";
}

function readJsonBody(req) {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString("utf8") || "{}");
    } catch {
      return {};
    }
  }
  return typeof raw === "object" ? raw : {};
}

export function preflight(req, res) {
  Object.entries(corsHeaders(originOf(req))).forEach(([k, v]) => res.setHeader(k, v));
  res.status(204).end();
}

export async function health(req, res) {
  if (req.method === "OPTIONS") return preflight(req, res);
  const url = new URL(req.url || "/", "https://vercel.local");
  let users = {};
  let storage = "memory";
  let writeOk = null;
  try {
    storage = storageKind();
    users = await loadUsers();
    if (storage === "redis" && url.searchParams.get("probe") === "1") writeOk = await redisWriteOk();
  } catch {}
  json(
    res,
    200,
    {
      ok: true,
      appId: APP_ID,
      players: Object.keys(users || {}).length,
      storage,
      signReady: Boolean(secrets().secureKey),
      writeOk,
    },
    originOf(req)
  );
}

export async function leaderboard(req, res) {
  if (req.method === "OPTIONS") return preflight(req, res);
  const url = new URL(req.url || "/", "https://vercel.local");
  const launch = (req.headers && req.headers["x-vk-launch"]) || url.searchParams.get("launch") || "";
  const verified = launch ? verifyLaunch(launch) : { ok: false };
  const limit = clampInt(url.searchParams.get("limit") || 20, 1, 50);
  const users = await loadUsers();
  json(res, 200, leaderboardPayload(users, verified.ok ? verified.userId : 0, limit), originOf(req));
}

export async function score(req, res) {
  if (req.method === "OPTIONS") return preflight(req, res);
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method" }, originOf(req));
    return;
  }
  try {
    const body = readJsonBody(req);
    const launch = body.launch || (req.headers && req.headers["x-vk-launch"]) || "";
    const verified = verifyLaunch(launch);
    if (!verified.ok) {
      json(res, 401, { ok: false, error: "sign", reason: verified.reason || "sign" }, originOf(req));
      return;
    }
    const users = await loadUsers();
    const prev = users[verified.userId] || users[String(verified.userId)];
    let next = mergeScore(prev, body, verified.userId);
    next = await pushVkEvents(next).catch(() => next);
    await saveUser(next);
    users[verified.userId] = next;
    json(res, 200, leaderboardPayload(users, verified.userId, 20), originOf(req));
  } catch (err) {
    json(res, 500, { ok: false, error: "save" }, originOf(req));
  }
}

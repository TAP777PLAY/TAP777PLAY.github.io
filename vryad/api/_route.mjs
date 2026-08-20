import {
  APP_ID,
  clampInt,
  corsHeaders,
  json,
  leaderboardPayload,
  loadUsers,
  mergeScore,
  pushVkEvents,
  saveUser,
  storageKind,
  verifyLaunch,
} from "../server/lib.mjs";

export function originOf(req) {
  return (req.headers && (req.headers.origin || req.headers.Origin)) || "";
}

export function preflight(req, res) {
  Object.entries(corsHeaders(originOf(req))).forEach(([k, v]) => res.setHeader(k, v));
  res.status(204).end();
}

export async function health(req, res) {
  if (req.method === "OPTIONS") return preflight(req, res);
  const users = await loadUsers();
  json(
    res,
    200,
    {
      ok: true,
      appId: APP_ID,
      players: Object.keys(users).length,
      storage: storageKind(),
      signReady: Boolean(secrets().secureKey),
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
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const launch = body.launch || (req.headers && req.headers["x-vk-launch"]) || "";
  const verified = verifyLaunch(launch);
  if (!verified.ok) {
    json(res, 401, { ok: false, error: "sign", reason: verified.reason || "sign" }, originOf(req));
    return;
  }
  const users = await loadUsers();
  const next = mergeScore(users[verified.userId] || users[String(verified.userId)], body, verified.userId);
  users[verified.userId] = next;
  await saveUser(next);
  pushVkEvents(next).catch(() => {});
  json(res, 200, leaderboardPayload(users, verified.userId, 20), originOf(req));
}

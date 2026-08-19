/**
 * Генератор пака уровней GEM BRAWL.
 * Запуск: node tools/generate-pack.js
 */
const fs = require("fs");
const path = require("path");

const WORLDS = [
  { id: 1, name: "Травяная арена", from: 1, to: 10 },
  { id: 2, name: "Золотая шахта", from: 11, to: 20 },
  { id: 3, name: "Ледяной купол", from: 21, to: 30 },
  { id: 4, name: "Каньон самоцветов", from: 31, to: 40 },
  { id: 5, name: "Ночная арена", from: 41, to: 50 },
  { id: 6, name: "Вулкан", from: 51, to: 60 },
  { id: 7, name: "Неоновый ринг", from: 61, to: 70 },
  { id: 8, name: "Финал сезона", from: 71, to: 80 },
];

const SHAPES = [
  "full",
  "diamond",
  "plus",
  "ring",
  "corners",
  "pyramid",
  "hourglass",
  "stairs",
  "bridge",
  "random",
];

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function worldOf(id) {
  return WORLDS.find((w) => id >= w.from && id <= w.to) || WORLDS[0];
}

function makeMask(cols, rows, shape, rnd) {
  const mask = [];
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const maxD = Math.max(cx, cy);
  for (let y = 0; y < rows; y++) {
    mask[y] = [];
    for (let x = 0; x < cols; x++) {
      let play = true;
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      if (shape === "diamond") play = dx + dy <= Math.ceil(maxD);
      else if (shape === "plus") play = dx <= 1 || dy <= 1 || (dx <= 2 && dy <= 2 && cols >= 8);
      else if (shape === "ring") play = !(dx <= Math.max(1, Math.floor(cx / 3)) && dy <= Math.max(1, Math.floor(cy / 3)));
      else if (shape === "corners") play = !((x === 0 || x === cols - 1) && (y === 0 || y === rows - 1));
      else if (shape === "pyramid") play = y >= Math.floor(Math.abs(x - cx));
      else if (shape === "hourglass") play = dx + 0.4 >= dy || dy + 0.4 >= dx;
      else if (shape === "stairs") play = x + y >= Math.floor((cols + rows) / 4) && x + y <= cols + rows - 3;
      else if (shape === "bridge") play = y === Math.floor(cy) || x <= 1 || x >= cols - 2 || y <= 1 || y >= rows - 2;
      else if (shape === "random") play = rnd() > 0.16;
      mask[y][x] = play ? 0 : 1;
    }
  }
  let playable = 0;
  mask.forEach((row) => row.forEach((c) => { if (c === 0) playable++; }));
  if (playable < cols * rows * 0.45) return makeMask(cols, rows, "full", rnd);
  return mask;
}

function buildLevel(id, seed) {
  const rnd = mulberry32(seed + id * 997);
  const world = worldOf(id);
  const t = (id - 1) / 79;
  const cols = id <= 8 ? 7 : id <= 40 ? 8 : id <= 65 ? 8 : 9;
  const rows = id <= 12 ? 7 : id <= 40 ? 8 : id <= 65 ? 9 : 9;
  const colors = id <= 10 ? 4 : id <= 28 ? 5 : 6;
  const moves = Math.max(12, Math.round(26 - t * 12 - (id % 5 === 0 ? 2 : 0)));
  const shape = id <= 4 ? "full" : SHAPES[Math.floor(rnd() * (id < 15 ? 4 : SHAPES.length))];
  const mask = makeMask(cols, rows, shape, rnd);

  const goalCount = id <= 6 ? 1 : id <= 25 ? 2 : 3;
  const used = new Set();
  const goals = [];
  for (let i = 0; i < goalCount; i++) {
    let gem = 1 + Math.floor(rnd() * colors);
    while (used.has(gem)) gem = 1 + Math.floor(rnd() * colors);
    used.add(gem);
    const count = Math.round(8 + t * 16 + i * 3 + rnd() * 4);
    goals.push({ kind: "collect", gem, count });
  }

  const need = goals.reduce((s, g) => s + g.count, 0);
  return {
    id,
    world: world.id,
    worldName: world.name,
    cols,
    rows,
    colors,
    moves,
    shape,
    mask,
    goals,
    starScores: [need * 12, Math.round(need * 18), Math.round(need * 28)],
  };
}

function generatePack(count = 80, seed = 20260819) {
  const levels = [];
  for (let i = 1; i <= count; i++) levels.push(buildLevel(i, seed));
  return {
    version: 1,
    title: "GEM BRAWL",
    seed,
    worlds: WORLDS,
    levels,
  };
}

function writePack() {
  const pack = generatePack();
  const out = path.join(__dirname, "..", "levels", "pack.json");
  fs.writeFileSync(out, JSON.stringify(pack, null, 2), "utf8");
  console.log("Wrote", pack.levels.length, "levels ->", out);
}

if (require.main === module) writePack();

module.exports = { generatePack, buildLevel, makeMask, WORLDS, SHAPES };

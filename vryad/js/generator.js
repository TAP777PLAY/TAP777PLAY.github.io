(function () {
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

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
  const SHAPES = ["full", "diamond", "plus", "ring", "corners", "pyramid", "hourglass", "stairs", "bridge", "random"];

  function worldOf(id) {
    return WORLDS.find((w) => id >= w.from && id <= w.to) || { id: Math.ceil(id / 10), name: "Арена " + Math.ceil(id / 10), from: 1, to: 10 };
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
        else if (shape === "plus") play = dx <= 1 || dy <= 1;
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
    return mask;
  }

  function buildLevel(id, seed, override) {
    const rnd = mulberry32(seed + id * 997);
    const world = worldOf(id);
    const t = Math.min(1, (id - 1) / 79);
    const o = override || {};
    const cols = o.cols || (id <= 8 ? 7 : id <= 40 ? 8 : 9);
    const rows = o.rows || (id <= 12 ? 7 : id <= 40 ? 8 : 9);
    const colors = o.colors || (id <= 10 ? 4 : id <= 28 ? 5 : 6);
    const moves = o.moves || Math.max(12, Math.round(26 - t * 12));
    const shape = o.shape || (id <= 4 ? "full" : SHAPES[Math.floor(rnd() * SHAPES.length)]);
    const mask = makeMask(cols, rows, shape, rnd);
    const goalCount = id <= 6 ? 1 : id <= 25 ? 2 : 3;
    const used = new Set();
    const goals = [];
    for (let i = 0; i < goalCount; i++) {
      let gem = 1 + Math.floor(rnd() * colors);
      while (used.has(gem)) gem = 1 + Math.floor(rnd() * colors);
      used.add(gem);
      goals.push({ kind: "collect", gem, count: Math.round(8 + t * 16 + i * 3) });
    }
    const need = goals.reduce((s, g) => s + g.count, 0);
    return { id, world: world.id, worldName: world.name, cols, rows, colors, moves, shape, mask, goals, starScores: [need * 12, Math.round(need * 18), Math.round(need * 28)] };
  }

  function draw(mask) {
    const grid = document.getElementById("grid");
    grid.style.gridTemplateColumns = "repeat(" + mask[0].length + ", 28px)";
    grid.innerHTML = mask
      .flat()
      .map((c) => '<div class="cell ' + (c ? "off" : "on") + '"></div>')
      .join("");
  }

  function val(id) { return document.getElementById(id).value; }
  function num(id) { return Number(val(id)); }

  function currentOverride() {
    return {
      cols: num("cols"),
      rows: num("rows"),
      colors: num("colors"),
      moves: num("moves"),
      shape: val("shape"),
    };
  }

  function preview() {
    const rnd = mulberry32(num("seed"));
    const mask = makeMask(num("cols"), num("rows"), val("shape"), rnd);
    draw(mask);
    document.getElementById("out").value = JSON.stringify({ shape: val("shape"), mask }, null, 2);
  }

  function one() {
    const lv = buildLevel(num("id"), num("seed"), currentOverride());
    draw(lv.mask);
    document.getElementById("out").value = JSON.stringify(lv, null, 2);
  }

  function pack() {
    const seed = num("seed");
    const count = num("count");
    const levels = [];
    for (let i = 1; i <= count; i++) levels.push(buildLevel(i, seed));
    const data = { version: 1, title: "GEM BRAWL", seed, worlds: WORLDS, levels };
    draw(levels[0].mask);
    document.getElementById("out").value = JSON.stringify(data, null, 2);
    return data;
  }

  document.getElementById("preview").onclick = preview;
  document.getElementById("one").onclick = one;
  document.getElementById("pack").onclick = pack;
  document.getElementById("download").onclick = () => {
    const text = document.getElementById("out").value || JSON.stringify(pack(), null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pack.json";
    a.click();
  };
  preview();
})();

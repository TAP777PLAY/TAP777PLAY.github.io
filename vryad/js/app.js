(function () {
  const $ = (id) => document.getElementById(id);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const GEM = (n) => "assets/gems/gem-" + n + ".png";

  let pack = { levels: [], worlds: [] };
  let save = Save.load();
  let current = null;
  let board = null;
  let gems = new Map();
  let selected = null;
  let busy = false;
  let state = "idle";
  let moves = 0;
  let score = 0;
  let goals = [];
  let rewardUsed = false;
  let rewardBusy = false;
  let pendingInterstitial = false;
  let leaving = false;

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    hideOvs();
  }
  function ov(id, on) { $(id).classList.toggle("show", on); }
  function hideOvs() { ["ov-start", "ov-pause", "ov-win", "ov-lose", "ov-season", "ov-help"].forEach((id) => ov(id, false)); }
  function persist() { Save.save(save); refreshMeta(); }
  function trophies() {
    return Object.values(save.stars || {}).reduce((a, s) => a + s, 0) * 10 + (save.coins || 0);
  }
  function bestLevel() {
    const fromStars = Math.max(0, ...Object.keys(save.stars || {}).map(Number));
    return Math.max(fromStars, Math.max(0, (save.unlocked || 1) - 1));
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }
  function setAva(id, url) {
    const el = $(id);
    if (!el) return;
    if (url) {
      el.src = url;
      el.hidden = false;
    } else {
      el.removeAttribute("src");
      el.hidden = true;
    }
  }
  function refreshMeta() {
    save.trophies = trophies();
    $("home-cups").textContent = save.trophies;
    $("home-coins").textContent = save.coins;
    $("desk-cups").textContent = save.trophies;
    $("desk-name").textContent = save.name;
    $("desk-next").textContent = "Уровень " + save.unlocked;
    setAva("desk-ava", save.photo);
    Sfx.set(save.sfx !== false);
    Sfx.setMusic(save.music !== false);
    syncAudioUi();
  }

  function syncAudioUi() {
    const sfxOn = save.sfx !== false;
    const musOn = save.music !== false;
    const sfxEl = $("set-sfx");
    const musEl = $("set-music");
    if (sfxEl) sfxEl.checked = sfxOn;
    if (musEl) musEl.checked = musOn;
    const homeSfx = $("home-sfx");
    const homeMus = $("home-music");
    if (homeSfx) {
      homeSfx.classList.toggle("on", sfxOn);
      homeSfx.classList.toggle("off", !sfxOn);
      homeSfx.title = sfxOn ? "Звук включён" : "Звук выключен";
      homeSfx.setAttribute("aria-pressed", String(sfxOn));
    }
    if (homeMus) {
      homeMus.classList.toggle("on", musOn);
      homeMus.classList.toggle("off", !musOn);
      homeMus.title = musOn ? "Мелодия включена" : "Мелодия выключена";
      homeMus.setAttribute("aria-pressed", String(musOn));
    }
    document.querySelectorAll(".track-btn").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.track) === (save.musicIndex || 0));
    });
  }

  function toggleSfx() {
    save.sfx = !(save.sfx !== false);
    Sfx.set(save.sfx);
    persist();
    if (save.sfx) Sfx.play("click");
  }

  function toggleMusic() {
    save.music = !(save.music !== false);
    Sfx.unlock();
    Sfx.setMusic(save.music);
    persist();
    if (save.sfx !== false) Sfx.play("click");
  }

  function goalHtml(g) {
    return '<div class="goal' + (g.remaining <= 0 ? " done" : "") + '"><img src="' + GEM(g.gem) + '" alt="" /><div>' + Math.max(0, g.remaining) + "</div></div>";
  }

  function renderLevels() {
    const root = $("levels-scroll");
    root.innerHTML = "";
    (pack.worlds || []).forEach((world) => {
      const wrap = document.createElement("div");
      wrap.className = "panel w" + world.id;
      wrap.innerHTML = '<div class="world-title">' + world.name + "</div>";
      const grid = document.createElement("div");
      grid.className = "level-grid";
      pack.levels
        .filter((l) => l.world === world.id)
        .forEach((lv) => {
          const b = document.createElement("button");
          const locked = lv.id > save.unlocked;
          const stars = save.stars[lv.id] || 0;
          b.className = "lvl" + (locked ? " locked" : "");
          b.type = "button";
          b.innerHTML = lv.id + '<div class="stars">' + (locked ? "" : "★".repeat(stars) + "☆".repeat(3 - stars)) + "</div>";
          if (!locked) b.addEventListener("click", () => startLevel(lv.id));
          grid.appendChild(b);
        });
      wrap.appendChild(grid);
      root.appendChild(wrap);
    });
  }

  function localRatingRows() {
    if (!save.trophies && bestLevel() < 1) return [];
    return [{
      place: 1,
      id: save.vkId || 0,
      name: save.name,
      level: Math.max(1, bestLevel()),
      trophies: save.trophies,
      photo: save.photo || "",
    }];
  }

  function rankHtml(rows, meId) {
    if (!rows.length) return '<p style="font-weight:800">Пока пусто — пройди уровень.</p>';
    return rows
      .map((r) => {
        const mine = (r.id && meId && r.id === meId) || (!r.id && r.name === save.name);
        const ava = r.photo
          ? '<img class="rank-ava" src="' + esc(r.photo) + '" alt="" />'
          : '<span class="rank-ava empty"></span>';
        return (
          '<div class="rank' + (mine ? " me" : "") + '"><b>' + r.place + "</b>" + ava +
          "<span>" + esc(r.name) + " · ур." + (r.level || 1) + "</span><b>" +
          (r.trophies ?? r.score ?? 0) + "</b></div>"
        );
      })
      .join("");
  }

  function paintRatings(rows, meId, statusText) {
    const html = rankHtml(rows, meId);
    $("rating-list").innerHTML = html;
    $("desk-rating").innerHTML = html;
    const status = $("rating-status");
    if (status) {
      status.textContent = statusText || "";
      status.hidden = !statusText;
    }
    const boardBtn = $("btn-vk-board");
    if (boardBtn) boardBtn.hidden = !Platform.isVk || Platform.isDesktop;
  }

  async function renderRatings() {
    const meId = save.vkId || 0;
    paintRatings(localRatingRows(), meId, "");
    const remote = await Platform.fetchLeaderboard();
    if (!remote || !remote.ok || !Array.isArray(remote.items) || !remote.items.length) return;
    let rows = remote.items.slice();
    if (remote.me && !rows.some((r) => r.id === remote.me.id)) rows.push(remote.me);
    paintRatings(rows, remote.me ? remote.me.id : meId, "");
  }

  function pushRating() {
    if (!Platform.isVk) return;
    Platform.submitScore({
      trophies: save.trophies,
      level: Math.max(1, bestLevel()),
      score: score || 0,
      name: save.name,
      photo: save.photo || "",
    }).then((data) => {
      if (data && data.ok) renderRatings();
    });
  }

  async function applyVkProfile() {
    const user = await Platform.getUser();
    if (!user) return;
    save.vkId = user.id;
    save.photo = user.photo || "";
    if (!save.nameCustom && (!save.name || save.name === "Боец")) {
      save.name = user.name.slice(0, 16);
      if ($("set-name")) $("set-name").value = save.name;
    }
    persist();
  }

  function bindDevMode() {
    const DEV_KEY = "gem-brawl-dev";
    let taps = 0;
    let tapTimer = 0;
    const unlocked = () => sessionStorage.getItem(DEV_KEY) === "1";
    function showDev(ok) {
      const box = $("dev-box");
      if (!box) return;
      box.hidden = false;
      $("dev-gate").hidden = ok;
      $("dev-tools").hidden = !ok;
    }
    function onSecretTap() {
      if (unlocked()) {
        showDev(true);
        return;
      }
      clearTimeout(tapTimer);
      taps += 1;
      tapTimer = setTimeout(() => { taps = 0; }, 2500);
      if (taps < 5) return;
      taps = 0;
      Sfx.play("click");
      show("screen-settings");
      showDev(false);
      const input = $("dev-pass");
      if (input) {
        input.value = "";
        input.focus();
      }
    }
    function tryUnlock() {
      const pass = (($("dev-pass") && $("dev-pass").value) || "").trim();
      if (pass === "admin1991") {
        sessionStorage.setItem(DEV_KEY, "1");
        if ($("dev-err")) $("dev-err").hidden = true;
        showDev(true);
        Sfx.play("click");
      } else if ($("dev-err")) {
        $("dev-err").hidden = false;
        Sfx.play("lose");
      }
    }
    if (unlocked()) showDev(true);
    document.querySelectorAll('[data-go="settings"]').forEach((btn) => {
      btn.addEventListener("click", onSecretTap);
    });
    if ($("set-title")) $("set-title").addEventListener("click", onSecretTap);
    if ($("btn-dev-ok")) $("btn-dev-ok").addEventListener("click", tryUnlock);
    if ($("dev-pass")) {
      $("dev-pass").addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryUnlock();
      });
    }
  }

  function tilePx() {
    const wrap = document.querySelector(".board-wrap");
    const pad = 12;
    const w = wrap ? Math.max(160, wrap.clientWidth - pad) : 380;
    const h = wrap ? Math.max(160, wrap.clientHeight - pad) : 520;
    return Math.max(32, Math.floor(Math.min(w / current.cols, h / current.rows)));
  }

  function cellPos(x, y) {
    const t = tilePx();
    return { left: x * t, top: y * t };
  }
  function key(x, y) { return x + "," + y; }

  function drawBoard() {
    const el = $("board");
    el.innerHTML = "";
    gems.clear();
    const t = tilePx();
    el.style.setProperty("--tile", t + "px");
    el.style.setProperty("--cols", current.cols);
    el.style.setProperty("--rows", current.rows);
    const wrap = el.parentElement;
    if (wrap) {
      wrap.style.setProperty("--tile", t + "px");
      wrap.style.setProperty("--cols", current.cols);
      wrap.style.setProperty("--rows", current.rows);
    }
    el.style.width = current.cols * t + "px";
    el.style.height = current.rows * t + "px";
    for (let y = 0; y < current.rows; y++) {
      for (let x = 0; x < current.cols; x++) {
        if (!board.isPlayable(x, y)) continue;
        const tile = document.createElement("div");
        tile.className = "tile" + ((x + y) % 2 ? " odd" : "");
        const p = cellPos(x, y);
        tile.style.left = p.left + "px";
        tile.style.top = p.top + "px";
        el.appendChild(tile);
        if (board.gems[x][y] > 0) makeGem(x, y, board.gems[x][y]);
      }
    }
  }

  function makeGem(x, y, color) {
    const img = document.createElement("img");
    img.className = "gem";
    img.src = GEM(color);
    img.dataset.x = x;
    img.dataset.y = y;
    const p = cellPos(x, y);
    img.style.left = p.left + "px";
    img.style.top = p.top + "px";
    $("board").appendChild(img);
    gems.set(key(x, y), img);
    return img;
  }

  function highlight(cell) {
    gems.forEach((g) => g.classList.remove("selected"));
    if (!cell) return;
    const el = gems.get(key(cell.x, cell.y));
    if (el) el.classList.add("selected");
  }

  function matchCenter(cells) {
    const n = cells.length || 1;
    return {
      x: cells.reduce((s, c) => s + c.x, 0) / n,
      y: cells.reduce((s, c) => s + c.y, 0) / n,
    };
  }

  async function explode(matches, wave) {
    const t = tilePx();
    const mid = matchCenter(matches);
    let maxDelay = 0;
    matches.forEach(({ x, y, color }) => {
      const el = gems.get(key(x, y));
      const delay = Math.round(Math.hypot(x - mid.x, y - mid.y) * 38);
      maxDelay = Math.max(maxDelay, delay);
      if (el) {
        el.classList.remove("selected", "landing");
        el.classList.add("charge");
        setTimeout(() => {
          el.classList.add("shatter");
          GemFX.shatter($("board"), {
            x, y, color, src: GEM(color), tile: t, delay: 0, power: Math.min(3, wave),
          });
        }, delay + 150);
      }
    });
    applyGoals(matches, wave);
    await wait(maxDelay + (GemFX.reduced() ? 200 : 560));
    board.clearCells(matches);
    matches.forEach(({ x, y }) => {
      const el = gems.get(key(x, y));
      if (el) { el.remove(); gems.delete(key(x, y)); }
    });
  }

  function applyGoals(cells, wave) {
    const bonus = 10 + (wave || 1) * 6;
    cells.forEach(({ color }) => {
      const g = goals.find((t) => t.gem === color && t.remaining > 0);
      if (g) {
        g.remaining -= 1;
        if (g.remaining === 0) Sfx.play("target");
      }
      score += bonus;
      save.coins += 1;
    });
    $("goals").innerHTML = goals.map(goalHtml).join("");
  }

  function goalsDone() {
    return goals.every((g) => g.remaining <= 0);
  }

  function goalGemTotal() {
    return (current.goals || []).reduce((s, g) => s + (g.count || 0), 0);
  }

  function starThresholds() {
    const need = Math.max(8, goalGemTotal());
    const two = Math.round(need * 18);
    const three = Math.round(need * 28);
    const json = current.starScores;
    if (json && json[1] > 0 && json[1] <= two * 2.2) {
      return { twoScore: json[1], threeScore: json[2] };
    }
    return { twoScore: two, threeScore: three };
  }

  function starCount() {
    const start = current.moves;
    const left = Math.max(0, moves);
    const twoMoves = Math.max(2, Math.ceil(start * 0.22));
    const threeMoves = Math.max(5, Math.ceil(start * 0.42));
    const { twoScore, threeScore } = starThresholds();
    if (left >= threeMoves || score >= threeScore) return 3;
    if (left >= twoMoves || score >= twoScore) return 2;
    return 1;
  }

  function renderWinStars(n) {
    $("win-stars").innerHTML = [1, 2, 3]
      .map((i) => '<span class="star' + (i <= n ? " on" : "") + '" style="--d:' + (i - 1) * 0.16 + 's">★</span>')
      .join("");
    const left = Math.max(0, moves);
    const hint =
      n === 3
        ? "Идеально! Осталось ходов: " + left
        : n === 2
          ? "Отлично. Осталось ходов: " + left + " — чуть быстрее на ★★★"
          : "Уровень пройден. Осталось ходов: " + left + " — экономь ходы на 2–3 звезды";
    $("win-hint").textContent = hint;
  }

  async function collapse() {
    const movesG = board.applyGravity();
    const next = new Map();
    const used = new Set();
    const falling = [];
    let maxEnd = 0;

    movesG.forEach((m) => {
      const el = gems.get(key(m.fromX, m.fromY));
      if (!el) return;
      const from = cellPos(m.fromX, m.fromY);
      const to = cellPos(m.toX, m.toY);
      const dist = m.toY - m.fromY;
      const ms = GemFX.fallMs(dist);
      const delay = m.fromX * 18;
      GemFX.prepareFall(el);
      el.style.left = from.left + "px";
      el.style.top = from.top + "px";
      el.dataset.x = m.toX;
      el.dataset.y = m.toY;
      el.offsetHeight;
      GemFX.playFall(el, to.top, ms, delay);
      falling.push({ el, landAt: delay + ms });
      maxEnd = Math.max(maxEnd, delay + ms);
      next.set(key(m.toX, m.toY), el);
      used.add(el);
    });

    gems.forEach((el, k) => {
      if (used.has(el)) return;
      const x = +el.dataset.x, y = +el.dataset.y;
      if (board.gems[x] && board.gems[x][y] > 0 && !next.has(k)) {
        next.set(k, el);
        used.add(el);
      } else if (!used.has(el)) el.remove();
    });

    const spawned = board.fillFromTop();
    spawned.forEach(({ x, y, color, fromY }) => {
      const el = document.createElement("img");
      el.className = "gem";
      el.src = GEM(color);
      const from = cellPos(x, fromY);
      const to = cellPos(x, y);
      el.style.left = from.left + "px";
      el.style.top = from.top + "px";
      el.dataset.x = x;
      el.dataset.y = y;
      $("board").appendChild(el);
      const dist = y - fromY;
      const ms = GemFX.fallMs(dist);
      const delay = 28 + x * 18 + Math.abs(fromY + 1) * 32;
      el.offsetHeight;
      GemFX.playFall(el, to.top, ms, delay);
      falling.push({ el, landAt: delay + ms });
      maxEnd = Math.max(maxEnd, delay + ms);
      next.set(key(x, y), el);
    });

    gems = next;
    Sfx.play("drop");

    falling.forEach(({ el, landAt }) => {
      setTimeout(() => GemFX.land(el), landAt);
    });
    await wait(maxEnd + 70);
    falling.forEach(({ el }) => {
      el.style.transition = "";
    });
  }

  async function resolve() {
    let wave = 0;
    while (state === "play" || state === "busy") {
      const matches = board.findMatches();
      if (!matches.length) break;
      wave++;
      Sfx.playMatch(wave);
      await explode(matches, wave);
      await collapse();
      if (goalsDone()) { await win(); return; }
    }
    if (moves <= 0 && !goalsDone()) { lose(); return; }
    if (!board.hasPossibleMove()) {
      board.shuffle();
      drawBoard();
    }
  }

  async function trySwap(a, b) {
    if (!board.isAdjacent(a, b)) {
      selected = b;
      highlight(b);
      return;
    }
    busy = true;
    state = "busy";
    Sfx.play("swap");
    const elA = gems.get(key(a.x, a.y));
    const elB = gems.get(key(b.x, b.y));
    const pa = cellPos(a.x, a.y);
    const pb = cellPos(b.x, b.y);
    [elA, elB].forEach((el) => {
      if (!el) return;
      el.classList.remove("selected", "landing");
      el.style.transition = "left .18s cubic-bezier(.22,.7,.2,1), top .18s cubic-bezier(.22,.7,.2,1)";
    });
    if (elA) { elA.style.left = pb.left + "px"; elA.style.top = pb.top + "px"; }
    if (elB) { elB.style.left = pa.left + "px"; elB.style.top = pa.top + "px"; }
    await wait(190);
    board.swap(a.x, a.y, b.x, b.y);
    if (!board.findMatches().length) {
      board.swap(a.x, a.y, b.x, b.y);
      if (elA) { elA.style.left = pa.left + "px"; elA.style.top = pa.top + "px"; }
      if (elB) { elB.style.left = pb.left + "px"; elB.style.top = pb.top + "px"; }
      await wait(190);
      selected = null;
      highlight(null);
      state = "play";
      busy = false;
      return;
    }
    const next = new Map(gems);
    if (elA) { elA.dataset.x = b.x; elA.dataset.y = b.y; next.set(key(b.x, b.y), elA); }
    if (elB) { elB.dataset.x = a.x; elB.dataset.y = a.y; next.set(key(a.x, a.y), elB); }
    gems = next;
    moves -= 1;
    $("moves").textContent = moves;
    selected = null;
    highlight(null);
    state = "play";
    await resolve();
    busy = false;
  }

  function pick(ev) {
    const rect = $("board").getBoundingClientRect();
    const t = rect.width / current.cols;
    const x = Math.floor((ev.clientX - rect.left) / t);
    const y = Math.floor((ev.clientY - rect.top) / t);
    if (!board.colorAt(x, y)) return null;
    return { x, y };
  }

  let dragFrom = null;
  function onBoardDown(ev) {
    if (busy || state !== "play") return;
    ev.preventDefault();
    const cell = pick(ev);
    if (!cell) return;
    try { $("board").setPointerCapture(ev.pointerId); } catch (e) {}
    if (selected && board.isAdjacent(selected, cell) && (selected.x !== cell.x || selected.y !== cell.y)) {
      dragFrom = null;
      trySwap(selected, cell);
      return;
    }
    selected = cell;
    highlight(cell);
    dragFrom = cell;
  }
  function onBoardMove(ev) {
    if (!dragFrom || busy || state !== "play") return;
    const cell = pick(ev);
    if (!cell || (cell.x === dragFrom.x && cell.y === dragFrom.y)) return;
    if (board.isAdjacent(dragFrom, cell)) {
      const from = dragFrom;
      dragFrom = null;
      trySwap(from, cell);
    }
  }
  function onBoardUp() { dragFrom = null; }

  function startLevel(id) {
    if (id > pack.levels.length) {
      showSeason();
      return;
    }
    current = pack.levels.find((l) => l.id === id);
    if (!current) return;
    Sfx.play("click");
    score = 0;
    moves = current.moves;
    goals = current.goals.map((g) => ({ ...g, remaining: g.count }));
    board = new GemEngine.Board(current);
    board.generateInitial();
    show("screen-game");
    Platform.fit($("stage"));
    rewardUsed = false;
    rewardBusy = false;
    $("moves").textContent = moves;
    $("goals").innerHTML = goals.map(goalHtml).join("");
    syncRewardUi();
    $("start-title").textContent = "Уровень " + current.id;
    $("start-world").textContent = current.worldName;
    $("start-moves").textContent = current.moves;
    $("start-goals").innerHTML = goals.map(goalHtml).join("");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawBoard();
        state = "start";
        ov("ov-start", true);
      });
    });
  }

  async function win() {
    if (state === "win") return;
    state = "win";
    Sfx.play("win");
    const stars = starCount();
    save.stars[current.id] = Math.max(save.stars[current.id] || 0, stars);
    if (current.id >= save.unlocked) save.unlocked = current.id + 1;
    Save.addScore(save, { name: save.name, level: current.id, score, trophies: stars * 10, at: Date.now() });
    save.clears = (save.clears || 0) + 1;
    pendingInterstitial = save.clears % 2 === 0;
    persist();
    pushRating();
    syncRewardUi();
    if (current.id >= pack.levels.length) {
      showSeason();
      return;
    }
    renderWinStars(stars);
    $("win-text").textContent = current.worldName + " · " + score + " очков";
    ov("ov-win", true);
  }

  function showSeason() {
    state = "season";
    $("season-text").textContent = "Кубки: " + save.trophies + " · монеты: " + save.coins;
    show("screen-home");
    ov("ov-season", true);
  }

  function lose() {
    if (state === "lose" || state === "win") return;
    state = "lose";
    Sfx.play("lose");
    persist();
    $("lose-text").textContent = "Ходы закончились на уровне " + current.id;
    ov("ov-lose", true);
    syncRewardUi();
  }

  function syncRewardUi() {
    const hud = $("btn-reward");
    const loseBtn = $("btn-reward-lose");
    const blocked = rewardUsed || rewardBusy || state === "win" || state === "season";
    if (hud) hud.disabled = blocked || (state !== "play" && state !== "paused" && state !== "start");
    if (loseBtn) {
      loseBtn.disabled = rewardUsed || rewardBusy;
      loseBtn.classList.toggle("hidden", rewardUsed);
    }
  }

  function grantMoves(n) {
    moves += n;
    $("moves").textContent = moves;
    if (state === "lose") {
      ov("ov-lose", false);
      state = "play";
    }
  }

  async function watchReward(fromLose) {
    if (rewardUsed || rewardBusy) return;
    if (fromLose) {
      if (state !== "lose") return;
    } else if (state !== "play" && state !== "paused") {
      return;
    }
    rewardBusy = true;
    syncRewardUi();
    Sfx.play("click");
    const ok = await Platform.showReward();
    rewardBusy = false;
    if (!ok) {
      syncRewardUi();
      return;
    }
    rewardUsed = true;
    grantMoves(3);
    syncRewardUi();
  }

  async function leaveAfterLevel(next) {
    if (leaving) return;
    leaving = true;
    Sfx.play("click");
    hideOvs();
    if (pendingInterstitial) {
      pendingInterstitial = false;
      Platform.armInterstitial();
      await Platform.showInterstitial();
    }
    leaving = false;
    next();
  }

  function goHome() {
    hideOvs();
    state = "idle";
    busy = false;
    show("screen-home");
    refreshMeta();
    renderRatings();
  }

  async function boot() {
    Platform.init();
    Platform.fit($("stage"));
    window.addEventListener("resize", () => {
      Platform.fit($("stage"));
      if (current && board && !busy && (state === "play" || state === "start" || state === "paused")) {
        drawBoard();
      }
    });
    refreshMeta();
    $("set-name").value = save.name;
    syncAudioUi();
    Sfx.load();
    Sfx.set(save.sfx !== false);
    Sfx.startMusic(save.musicIndex || 0);
    Sfx.setMusic(save.music !== false);

    const res = await fetch("levels/pack.json");
    pack = await res.json();

    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sfx.play("click");
        const to = btn.dataset.go;
        if (to === "levels") renderLevels();
        if (to === "ratings") renderRatings();
        show("screen-" + to);
      });
    });
    bindDevMode();
    $("btn-play").addEventListener("click", () => startLevel(save.unlocked));
    $("btn-help").addEventListener("click", () => { Sfx.play("click"); ov("ov-help", true); });
    $("btn-help-close").addEventListener("click", () => { Sfx.play("click"); ov("ov-help", false); });
    $("btn-to-levels").addEventListener("click", () => { Sfx.play("click"); renderLevels(); show("screen-levels"); });
    $("btn-to-ratings").addEventListener("click", () => { Sfx.play("click"); renderRatings(); show("screen-ratings"); });
    if ($("btn-vk-board")) {
      $("btn-vk-board").addEventListener("click", () => {
        Sfx.play("click");
        Platform.showOfficialBoard(save.trophies);
      });
    }
    $("btn-start").addEventListener("click", () => { Sfx.play("click"); ov("ov-start", false); state = "play"; syncRewardUi(); });
    $("btn-pause").addEventListener("click", () => { if (state === "play") { Sfx.play("click"); ov("ov-pause", true); state = "paused"; } });
    $("btn-resume").addEventListener("click", () => { Sfx.play("click"); ov("ov-pause", false); state = "play"; });
    $("btn-restart").addEventListener("click", () => startLevel(current.id));
    $("btn-quit").addEventListener("click", goHome);
    $("btn-retry").addEventListener("click", () => startLevel(current.id));
    $("btn-lose-home").addEventListener("click", goHome);
    $("btn-win-home").addEventListener("click", () => leaveAfterLevel(goHome));
    $("btn-next").addEventListener("click", () => {
      leaveAfterLevel(() => {
        const n = current.id + 1;
        if (n > pack.levels.length) showSeason();
        else startLevel(n);
      });
    });
    $("btn-season-home").addEventListener("click", () => leaveAfterLevel(goHome));
    $("btn-season-ratings").addEventListener("click", () => {
      leaveAfterLevel(() => {
        hideOvs();
        renderRatings();
        show("screen-ratings");
      });
    });
    $("btn-reward").addEventListener("click", () => watchReward(false));
    $("btn-reward-lose").addEventListener("click", () => watchReward(true));
    $("board").addEventListener("pointerdown", onBoardDown);
    $("board").addEventListener("pointermove", onBoardMove);
    $("board").addEventListener("pointerup", onBoardUp);
    $("board").addEventListener("pointercancel", onBoardUp);
    $("set-name").addEventListener("change", () => {
      save.name = $("set-name").value.slice(0, 16) || "Боец";
      save.nameCustom = true;
      persist();
    });
    $("set-sfx").addEventListener("change", () => {
      save.sfx = $("set-sfx").checked;
      Sfx.set(save.sfx);
      persist();
      if (save.sfx) Sfx.play("click");
    });
    $("set-music").addEventListener("change", () => {
      save.music = $("set-music").checked;
      Sfx.unlock();
      Sfx.setMusic(save.music);
      persist();
    });
    $("home-sfx").addEventListener("click", toggleSfx);
    $("home-music").addEventListener("click", toggleMusic);
    async function onFsClick() {
      Sfx.play("click");
      await Platform.toggleFullscreen();
    }
    if ($("btn-fs")) $("btn-fs").addEventListener("click", onFsClick);
    if ($("btn-fs-exit")) $("btn-fs-exit").addEventListener("click", onFsClick);
    document.querySelectorAll(".track-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        save.musicIndex = Number(btn.dataset.track);
        Sfx.unlock();
        Sfx.startMusic(save.musicIndex);
        persist();
        syncAudioUi();
        Sfx.play("click");
      });
    });
    renderRatings();
    await applyVkProfile();
    if (save.trophies > 0) pushRating();
    else renderRatings();
    window.__game = { get pack() { return pack; }, get save() { return save; } };
  }

  boot();
})();

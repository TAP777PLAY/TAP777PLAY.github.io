(function (global) {
  const TINT = {
    1: { glow: "#ff5ce8", spark: "#ffd6ff", deep: "#9a1ad0" },
    2: { glow: "#7dff4a", spark: "#eaffc8", deep: "#2f9a14" },
    3: { glow: "#4db8ff", spark: "#d6f2ff", deep: "#1c5fd0" },
    4: { glow: "#ff5a6a", spark: "#ffd0d4", deep: "#c81d32" },
    5: { glow: "#ffe14a", spark: "#fff6c8", deep: "#d89a00" },
    6: { glow: "#4affd4", spark: "#d8fff6", deep: "#0f9a88" },
  };

  const CLIPS = [
    "polygon(50% 8%, 92% 38%, 78% 92%, 22% 92%, 8% 38%)",
    "polygon(12% 18%, 88% 8%, 70% 78%, 18% 88%)",
    "polygon(8% 48%, 52% 6%, 96% 52%, 58% 96%)",
    "polygon(20% 6%, 94% 28%, 72% 94%, 4% 70%)",
    "polygon(48% 0%, 100% 46%, 54% 100%, 0% 52%)",
    "polygon(6% 24%, 74% 4%, 98% 68%, 28% 96%)",
  ];

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tint(color) {
    return TINT[color] || TINT[3];
  }

  function fallMs(tiles) {
    const d = Math.max(1, tiles);
    return Math.round(170 + Math.sqrt(d) * 155);
  }

  function spawn(layer, className) {
    const el = document.createElement("div");
    el.className = className;
    layer.appendChild(el);
    return el;
  }

  function kill(el, ms) {
    setTimeout(() => el.remove(), ms);
  }

  function shatter(layer, { x, y, color, src, tile, delay, power }) {
    const t = tint(color);
    const px = x * tile;
    const py = y * tile;
    const cx = px + tile / 2;
    const cy = py + tile / 2;
    const p = reduced() ? 0.45 : 1;
    const shards = Math.round((6 + (power || 1) * 2) * (reduced() ? 0.5 : 1));
    const dur = 520 * p;

    setTimeout(() => {
      const flash = spawn(layer, "fx-flash");
      flash.style.left = px + "px";
      flash.style.top = py + "px";
      flash.style.width = tile + "px";
      flash.style.height = tile + "px";
      flash.style.background = "radial-gradient(circle, #fff 0%, " + t.glow + " 42%, transparent 70%)";
      kill(flash, 280);

      const ring = spawn(layer, "fx-ring");
      const rs = tile * 0.55;
      ring.style.left = cx - rs / 2 + "px";
      ring.style.top = cy - rs / 2 + "px";
      ring.style.width = rs + "px";
      ring.style.height = rs + "px";
      ring.style.borderColor = t.spark;
      ring.style.boxShadow = "0 0 12px " + t.glow;
      kill(ring, 420);

      const glow = spawn(layer, "fx-glow");
      glow.style.left = px - tile * 0.15 + "px";
      glow.style.top = py - tile * 0.15 + "px";
      glow.style.width = tile * 1.3 + "px";
      glow.style.height = tile * 1.3 + "px";
      glow.style.background = "radial-gradient(circle, " + t.glow + " 0%, transparent 68%)";
      kill(glow, 380);

      for (let i = 0; i < shards; i++) {
        const shard = spawn(layer, "fx-shard");
        const size = tile * (0.26 + Math.random() * 0.34);
        shard.style.width = size + "px";
        shard.style.height = size + "px";
        shard.style.left = cx - size / 2 + "px";
        shard.style.top = cy - size / 2 + "px";
        shard.style.backgroundImage = "url(" + src + ")";
        shard.style.backgroundSize = tile * 1.35 + "px " + tile * 1.35 + "px";
        shard.style.backgroundPosition =
          -Math.random() * tile * 0.45 + "px " + -Math.random() * tile * 0.45 + "px";
        shard.style.clipPath = CLIPS[i % CLIPS.length];
        shard.style.filter = "drop-shadow(0 2px 0 rgba(0,0,0,.28)) brightness(1.12)";
        const ang = ((Math.PI * 2) / shards) * i + (Math.random() - 0.5) * 0.5;
        const dist = tile * (0.55 + Math.random() * 0.85) * (0.7 + (power || 1) * 0.25);
        const dx = Math.cos(ang) * dist;
        const lift = -tile * (0.15 + Math.random() * 0.55);
        const grav = tile * (0.7 + Math.random() * 0.9);
        const rot = (Math.random() < 0.5 ? -1 : 1) * (140 + Math.random() * 280);
        shard.animate(
          [
            { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
            {
              transform: "translate(" + dx * 0.45 + "px," + lift + "px) rotate(" + rot * 0.4 + "deg) scale(1.05)",
              opacity: 1,
              offset: 0.28,
            },
            {
              transform: "translate(" + dx + "px," + (lift * 0.2 + grav * 0.45) + "px) rotate(" + rot * 0.85 + "deg) scale(.78)",
              opacity: 0.92,
              offset: 0.62,
            },
            {
              transform: "translate(" + dx * 1.08 + "px," + grav + "px) rotate(" + rot + "deg) scale(.2)",
              opacity: 0,
            },
          ],
          { duration: dur + Math.random() * 80, easing: "cubic-bezier(.12,.62,.18,1)", fill: "forwards" }
        );
        kill(shard, dur + 90);
      }

      const sparks = reduced() ? 3 : 7;
      for (let i = 0; i < sparks; i++) {
        const sp = spawn(layer, "fx-spark");
        const s = 3 + Math.random() * 5;
        sp.style.width = s + "px";
        sp.style.height = s + "px";
        sp.style.left = cx + "px";
        sp.style.top = cy + "px";
        sp.style.background = i % 2 ? "#fff" : t.spark;
        const ang = Math.random() * Math.PI * 2;
        const dist = tile * (0.4 + Math.random() * 0.9);
        sp.animate(
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            {
              transform: "translate(calc(-50% + " + Math.cos(ang) * dist + "px), calc(-50% + " + Math.sin(ang) * dist + "px)) scale(0)",
              opacity: 0,
            },
          ],
          { duration: 380 + Math.random() * 160, easing: "cubic-bezier(.1,.7,.2,1)", fill: "forwards" }
        );
        kill(sp, 560);
      }
    }, delay || 0);
  }

  function land(el) {
    if (!el || reduced()) return;
    el.classList.remove("landing");
    void el.offsetWidth;
    el.classList.add("landing");
    const done = () => el.classList.remove("landing");
    el.addEventListener("animationend", done, { once: true });
  }

  function prepareFall(el) {
    el.classList.remove("landing", "selected");
    el.style.transition = "none";
  }

  function playFall(el, toTop, ms, delay) {
    const start = () => {
      el.style.transition = "top " + ms + "ms cubic-bezier(.33,0,.18,1.08)";
      el.style.top = toTop + "px";
    };
    if (delay) setTimeout(start, delay);
    else start();
  }

  global.GemFX = { tint, fallMs, shatter, land, prepareFall, playFall, reduced };
})(window);

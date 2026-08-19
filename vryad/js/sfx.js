(function (global) {
  const SFX = "assets/sfx/";
  const MUS = "assets/music/";
  const tracks = [
    { src: MUS + "fon1.webm", name: "Арена 1" },
    { src: MUS + "fon2.webm", name: "Арена 2" },
    { src: MUS + "fon3.webm", name: "Арена 3" },
    { src: MUS + "fon4.webm", name: "Арена 4" },
  ];
  const files = {
    click: SFX + "click.mp3",
    swap: SFX + "swap.mp3",
    drop: SFX + "dropped.mp3",
    dropped: SFX + "dropped.mp3",
    combo: SFX + "combo.mp3",
    lose: SFX + "gameover.mp3",
    gameover: SFX + "gameover.mp3",
    win: SFX + "completed.webm",
    completed: SFX + "completed.webm",
    target: SFX + "target.webm",
    boom: SFX + "boom.m4a",
    match: SFX + "match_01.mp3",
    match2: SFX + "match_02.mp3",
    match3: SFX + "match_03.mp3",
    match4: SFX + "match_04.mp3",
    match5: SFX + "match_05.mp3",
    match_01: SFX + "match_01.mp3",
    match_02: SFX + "match_02.mp3",
    match_03: SFX + "match_03.mp3",
    match_04: SFX + "match_04.mp3",
    match_05: SFX + "match_05.mp3",
  };

  const buffers = {};
  let sfxOn = true;
  let musicOn = true;
  let music = null;
  let trackIndex = 0;
  let unlocked = false;

  function make(src, loop, vol) {
    const a = new Audio(src);
    a.preload = "auto";
    a.loop = !!loop;
    a.volume = vol;
    return a;
  }

  function load() {
    Object.entries(files).forEach(([k, src]) => {
      buffers[k] = make(src, false, 0.85);
    });
    music = make(tracks[trackIndex].src, true, 0.32);
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if (musicOn) playMusic();
  }

  function play(name) {
    if (!sfxOn) return;
    const src = buffers[name];
    if (!src) return;
    const a = src.cloneNode();
    a.volume = name.indexOf("match") === 0 ? 0.72 : name === "click" ? 0.55 : 0.85;
    a.play().catch(() => {});
  }

  function playMatch(wave) {
    const n = Math.min(5, Math.max(1, wave || 1));
    play("match_0" + n);
    if (n >= 2) play("combo");
    play("boom");
  }

  function playMusic() {
    if (!music || !musicOn) return;
    music.play().catch(() => {});
  }

  function setSfx(on) {
    sfxOn = !!on;
  }

  function setMusic(on) {
    musicOn = !!on;
    if (!music) return;
    if (musicOn) playMusic();
    else music.pause();
  }

  function startMusic(index) {
    if (typeof index === "number") {
      trackIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    }
    if (!music) return;
    const keep = musicOn && !music.paused;
    music.pause();
    music.src = tracks[trackIndex].src;
    music.loop = true;
    music.volume = 0.32;
    if (musicOn && (keep || unlocked)) playMusic();
    return trackIndex;
  }

  function nextTrack() {
    return startMusic(trackIndex + 1);
  }

  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (!music) return;
    if (document.hidden) music.pause();
    else if (musicOn && unlocked) playMusic();
  });

  global.Sfx = {
    load,
    play,
    playMatch,
    set: setSfx,
    setSfx,
    setMusic,
    pauseMusic() { if (music) music.pause(); },
    resumeMusic() { if (musicOn && unlocked) playMusic(); },
    startMusic,
    nextTrack,
    unlock,
    tracks,
    get sfxOn() { return sfxOn; },
    get musicOn() { return musicOn; },
    get trackIndex() { return trackIndex; },
  };
})(window);

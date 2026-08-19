(function (global) {
  const KEY = "gem-brawl-save-v1";
  const defaults = {
    name: "Боец",
    unlocked: 1,
    stars: {},
    best: {},
    trophies: 0,
    coins: 0,
    sfx: true,
    music: true,
    musicIndex: 0,
    scores: [],
    clears: 0,
    vkId: 0,
    photo: "",
    nameCustom: false,
  };

  function load() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    } catch (e) {
      return { ...defaults };
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function addScore(data, entry) {
    data.scores = [entry, ...(data.scores || [])].slice(0, 30);
    data.scores.sort((a, b) => b.trophies - a.trophies || b.score - a.score);
  }

  global.Save = { load, save, addScore, defaults };
})(window);

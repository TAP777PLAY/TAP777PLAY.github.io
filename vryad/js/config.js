(function (global) {
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API_PROD = "";
  global.GAME_CONFIG = {
    APP_ID: 51901586,
    API_BASE: local ? "http://127.0.0.1:8787" : API_PROD,
  };
})(window);

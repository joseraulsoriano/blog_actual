// Banner de versión histórica — no modifica el contenido original del blog 2021.
(function () {
  var banner = document.createElement('div');
  banner.setAttribute('role', 'note');
  banner.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
    'background:#111;color:#fff;padding:10px 16px;font-family:Lato,sans-serif;' +
    'font-size:14px;text-align:center;box-shadow:0 -2px 8px rgba(0,0,0,.3);';
  banner.innerHTML =
    '🕰️ Estás viendo la <strong>versión 2021</strong> del blog, conservada como parte del legado digital. ' +
    '<a href="/" style="color:#7cc0ff;font-weight:bold;">Ir a la versión 2026 →</a>';
  document.body.appendChild(banner);
})();

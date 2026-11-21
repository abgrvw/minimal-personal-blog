/* Bootstraps the public pages from content.json. */

(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var isDark = root.dataset.theme === 'dark' ||
        (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.dataset.theme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', root.dataset.theme);
    });
  }

  var path = location.pathname.replace(/\/+$/, '');
  var page = /post\.html$/.test(path) ? 'post' : /photos\.html$/.test(path) ? 'photos' : 'home';
  var slug = new URLSearchParams(location.search).get('slug');

  fetch('content.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('content.json ' + r.status);
      return r.json();
    })
    .then(function (data) { renderAll(data, page, slug); })
    .catch(function (err) {
      var app = document.getElementById('app');
      if (app) app.innerHTML = '<h1>内容加载失败</h1><p class="meta">请在本地通过 编辑网站.command 启动预览，或检查 content.json 是否存在。</p>';
      console.error(err);
    });
})();

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
  var page = /\/post(?:\.html)?$/.test(path) ? 'post'
    : /\/photos(?:\.html)?$/.test(path) ? 'photos' : 'home';
  var slug = new URLSearchParams(location.search).get('slug');

  var allData = null;

  /* --- search ------------------------------------------------------ */
  function stripMarkdown(text) {
    return String(text == null ? '' : text)
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_`~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function highlight(text, query) {
    var out = esc(text);
    if (!query) return out;
    var q = esc(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try { return out.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>'); }
    catch (e) { return out; }
  }

  function snippet(body, query, len) {
    var plain = stripMarkdown(body);
    var lower = plain.toLowerCase();
    var at = query ? lower.indexOf(query.toLowerCase()) : -1;
    if (at < 0) at = 0;
    var start = Math.max(0, at - Math.floor(len / 3));
    var text = plain.slice(start, start + len);
    return (start > 0 ? '…' : '') + highlight(text, query) + (start + len < plain.length ? '…' : '');
  }

  function buildSearch() {
    if (document.querySelector('[data-search-overlay]')) return;
    var wrap = document.createElement('div');
    wrap.className = 'search-overlay';
    wrap.setAttribute('data-search-overlay', '');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = ''
      + '<div class="search-backdrop" data-search-close></div>'
      + '<div class="search-box" role="dialog" aria-modal="true" aria-label="搜索日记">'
      + '<div class="search-field">'
      + '<svg viewBox="0 0 16 16" width="17" height="17" aria-hidden="true">'
      + '<circle cx="7" cy="7" r="4.4" fill="none" stroke="currentColor" stroke-width="1.5"/>'
      + '<line x1="10.3" y1="10.3" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
      + '</svg>'
      + '<input type="search" data-search-input placeholder="搜索日记…" autocomplete="off" spellcheck="false" aria-label="搜索关键词">'
      + '<kbd class="search-esc" data-search-close>esc</kbd>'
      + '</div>'
      + '<div class="search-results" data-search-results></div>'
      + '</div>';
    document.body.appendChild(wrap);

    var input = wrap.querySelector('[data-search-input]');
    var results = wrap.querySelector('[data-search-results]');

    function run(q) {
      if (!allData) return;
      query = q;
      var posts = allData.writings || [];
      var needle = q.trim().toLowerCase();
      var matched = needle
        ? posts.filter(function (w) {
            var hay = (w.title || '') + ' ' + stripMarkdown(w.body);
            return hay.toLowerCase().indexOf(needle) !== -1;
          })
        : posts;

      if (!matched.length) {
        results.innerHTML = '<p class="search-empty">'
          + (needle ? '没有找到匹配的日记' : '暂无日记') + '</p>';
        return;
      }
      results.innerHTML = matched.map(function (w) {
        return '<a class="search-result" href="post.html?slug=' + encodeURIComponent(w.slug || '') + '">'
          + '<span class="search-result-title">' + highlight(w.title || '', q.trim()) + '</span>'
          + (q.trim() ? '<span class="search-result-snippet">' + snippet(w.body, q.trim(), 110) + '</span>' : '')
          + '</a>';
      }).join('');
    }

    var query = '';
    var open = false;
    function show() {
      if (open) return;
      open = true;
      wrap.classList.add('is-open');
      wrap.setAttribute('aria-hidden', 'false');
      input.value = '';
      run('');
      setTimeout(function () { input.focus(); }, 20);
    }
    function hide() {
      if (!open) return;
      open = false;
      wrap.classList.remove('is-open');
      wrap.setAttribute('aria-hidden', 'true');
    }

    var btn = document.querySelector('[data-search-toggle]');
    if (btn) btn.addEventListener('click', function () { open ? hide() : show(); });
    wrap.querySelectorAll('[data-search-close]').forEach(function (el) {
      el.addEventListener('click', hide);
    });
    input.addEventListener('input', function () { run(input.value); });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); show(); return;
      }
      if (e.key === 'Escape' && open) hide();
    });
  }

  fetch('content.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('content.json ' + r.status);
      return r.json();
    })
    .then(function (data) {
      allData = data;
      renderAll(data, page, slug);
      buildSearch();
    })
    .catch(function (err) {
      var app = document.getElementById('app');
      if (app) app.innerHTML = '<h1>内容加载失败</h1><p class="meta">请在本地通过 编辑网站.command 启动预览，或检查 content.json 是否存在。</p>';
      console.error(err);
    });
})();

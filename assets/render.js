/* Shared render functions: used by the live site and by admin.html preview. */

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function blocksOf(body) {
  return String(body || '')
    .split(/\n\s*\n/)
    .map(function (b) { return b.trim(); })
    .filter(Boolean);
}

function renderBlock(block) {
  var lines = block.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  if (lines.length && lines.every(function (l) { return /^\d+\.\s+/.test(l); })) {
    return '<ol>' + lines.map(function (l) {
      return '<li>' + esc(l.replace(/^\d+\.\s+/, '')) + '</li>';
    }).join('') + '</ol>';
  }
  if (lines.length === 1 && /^[—-]/.test(lines[0])) {
    return '<p class="signature">' + esc(lines[0]) + '</p>';
  }
  return '<p>' + lines.map(esc).join('<br>') + '</p>';
}

function profileUrl(kind, value) {
  var v = String(value || '').trim();
  if (!v) return '#';
  if (/^https?:\/\//i.test(v)) return v;
  v = v.replace(/^@/, '');
  if (kind === 'github') return 'https://github.com/' + encodeURIComponent(v);
  if (kind === 'x') return 'https://x.com/' + encodeURIComponent(v);
  return v;
}

function renderHome(data) {
  var writings = (data.writings || []).map(function (w) {
    return '<li><a href="post.html?slug=' + encodeURIComponent(w.slug || '') + '">'
      + '<span class="icon">📄</span>' + esc(w.title) + '</a></li>';
  }).join('');

  var albums = (data.albums || []).map(function (a, i) {
    return '<li><a href="photos.html#album-' + i + '"><span class="icon">'
      + (i + 1) + '️⃣</span>' + esc(a.name) + '</a></li>';
  }).join('');

  var s = data.social || {};
  return ''
    + '<img class="avatar" src="' + esc(data.avatar || 'assets/avatar.svg') + '" alt="Portrait">'
    + '<h1>' + esc(data.siteName) + '</h1>'
    + '<section id="writings"><h2 class="h-writings">Writings</h2><ul class="link-list">' + writings + '</ul></section>'
    + '<section><h2 class="h-photos">Photos</h2><ul class="link-list">' + albums + '</ul></section>'
    + '<section id="about">'
    + '<h2 class="h-about">About</h2>'
    + '<p class="bio">' + esc(data.bio) + '</p>'
    + '<p class="quote">' + esc(data.quote) + '</p>'
    + '<div class="social">'
    + '<p>GitHub: <a href="' + esc(profileUrl('github', s.github)) + '" target="_blank" rel="me">' + esc(s.github) + '</a></p>'
    + '<p>X / Twitter: <a href="' + esc(profileUrl('x', s.x)) + '" target="_blank" rel="me">' + esc(s.x) + '</a></p>'
    + '<p>Email: <a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></p>'
    + '</div></section>';
}

function renderPost(data, slug) {
  var post = (data.writings || []).filter(function (w) { return w.slug === slug; })[0];
  if (!post) {
    return '<a class="back-link" href="index.html">← Back</a><h1>Not found</h1>'
      + '<p class="meta">这篇文章不存在，请从首页重新进入。</p>';
  }
  var blocks = blocksOf(post.body);
  var lede = blocks.shift() || '';
  return ''
    + '<a class="back-link" href="index.html">← Back</a>'
    + '<article><h1>' + esc(post.title) + '</h1>'
    + '<p class="meta">' + esc(post.date) + '</p>'
    + (lede ? '<p class="lede">' + esc(lede) + '</p>' : '')
    + blocks.map(renderBlock).join('\n')
    + '</article>';
}

function renderPhotos(data) {
  var albums = (data.albums || []).map(function (a, i) {
    var photos = (a.photos || []).map(function (p) {
      return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '">'
        + '<figcaption>' + esc(p.caption) + '</figcaption></figure>';
    }).join('');
    return '<section class="album" id="album-' + i + '"><h2 class="h-' 
      + ['writings', 'photos', 'about', 'notes'][i % 4] + '">' + esc(a.name)
      + '</h2><div class="grid">' + photos + '</div></section>';
  }).join('');
  return '<a class="back-link" href="index.html">← Back</a><h1>Photos</h1>'
    + '<p class="meta">A few series, slowly collected.</p>' + albums;
}

function renderAll(data, page, slug) {
  var brand = document.querySelector('[data-brand]');
  if (brand) brand.textContent = data.siteName || 'Your Name';

  var nav = document.querySelector('[data-nav]');
  if (nav) {
    nav.innerHTML = '<a href="index.html">Home</a>'
      + '<a href="index.html#writings">Writings</a>'
      + '<a href="photos.html">Photos</a>'
      + '<a href="index.html#about">About</a>';
  }

  var app = document.getElementById('app');
  if (app) {
    if (page === 'post') app.innerHTML = renderPost(data, slug);
    else if (page === 'photos') app.innerHTML = renderPhotos(data);
    else app.innerHTML = renderHome(data);
  }

  var footer = document.querySelector('[data-footer]');
  if (footer) {
    footer.innerHTML = '© ' + new Date().getFullYear() + ' ' + esc(data.siteName)
      + ' · Built as a static site, hosted on Vercel.';
  }

  var title = data.siteName || 'Your Name';
  if (page === 'post') {
    var post = (data.writings || []).filter(function (w) { return w.slug === slug; })[0];
    if (post) title = post.title + ' — ' + title;
  } else if (page === 'photos') {
    title = 'Photos — ' + title;
  }
  document.title = title;
}

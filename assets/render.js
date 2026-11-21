/* Shared render functions: used by the live site and by admin.html preview. */

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function safeUrl(url) {
  var u = String(url || '').trim();
  return /^(https?:\/\/|assets\/|\/|\.\/)/i.test(u) ? u : '#';
}

/* A small, escaping-first Markdown renderer for issue bodies. */
function inlineMd(text) {
  var s = String(text == null ? '' : text);
  var re = /!\[([^\]]*)\]\(([^)\s]+)\)|\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;
  var out = '', last = 0, m;
  while ((m = re.exec(s)) !== null) {
    out += esc(s.slice(last, m.index));
    if (m[1] !== undefined) {
      out += '<img src="' + esc(safeUrl(m[2])) + '" alt="' + esc(m[1]) + '">';
    } else if (m[3] !== undefined) {
      out += '<a href="' + esc(safeUrl(m[4])) + '" target="_blank" rel="noopener noreferrer">' + esc(m[3]) + '</a>';
    } else if (m[5] !== undefined) {
      out += '<code>' + esc(m[5]) + '</code>';
    } else if (m[6] !== undefined) {
      out += '<strong>' + esc(m[6]) + '</strong>';
    } else if (m[7] !== undefined || m[8] !== undefined) {
      out += '<em>' + esc(m[7] !== undefined ? m[7] : m[8]) + '</em>';
    }
    last = re.lastIndex;
  }
  return out + esc(s.slice(last));
}

function isBlockStart(line) {
  return /^\s*```/.test(line) || /^#{1,6}\s/.test(line) || /^\s*>\s?/.test(line)
    || /^\s*\d+\.\s/.test(line) || /^\s*[-*+]\s/.test(line)
    || /^\s*(---|\*\*\*)\s*$/.test(line) || /^\s*[—–]\s/.test(line);
}

function markdownBlocks(body) {
  var lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  var html = [], i = 0, firstParagraph = true;

  while (i < lines.length) {
    var line = lines[i];
    if (!line.trim()) { i += 1; continue; }

    if (/^\s*```/.test(line)) {
      i += 1;
      var code = [];
      while (i < lines.length && !/^\s*```/.test(lines[i])) { code.push(lines[i]); i += 1; }
      if (i < lines.length) i += 1;
      html.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      continue;
    }

    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { html.push('<hr>'); i += 1; continue; }

    var heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      var level = Math.min(heading[1].length + 1, 6);
      html.push('<h' + level + '>' + inlineMd(heading[2]) + '</h' + level + '>');
      i += 1;
      continue;
    }

    if (/^\s*[—–]\s/.test(line)) {
      html.push('<p class="signature">' + inlineMd(line.trim()) + '</p>');
      i += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      var quoted = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      html.push('<blockquote>' + quoted.map(inlineMd).join('<br>') + '</blockquote>');
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      var numbered = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        numbered.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i += 1;
      }
      html.push('<ol>' + numbered.map(function (x) { return '<li>' + inlineMd(x) + '</li>'; }).join('') + '</ol>');
      continue;
    }

    if (/^\s*[-*+]\s/.test(line)) {
      var bulleted = [];
      while (i < lines.length && /^\s*[-*+]\s/.test(lines[i])) {
        bulleted.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i += 1;
      }
      html.push('<ul>' + bulleted.map(function (x) { return '<li>' + inlineMd(x) + '</li>'; }).join('') + '</ul>');
      continue;
    }

    var para = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      para.push(lines[i].trim());
      i += 1;
    }
    var cls = firstParagraph ? ' class="lede"' : '';
    html.push('<p' + cls + '>' + para.map(inlineMd).join('<br>') + '</p>');
    firstParagraph = false;
  }

  return html;
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
      + esc(w.title) + '</a></li>';
  }).join('');

  return ''
    + '<h1>' + esc(data.siteName) + '</h1>'
    + '<section id="writings"><h2 class="h-writings">日记</h2><ul class="link-list">' + writings + '</ul></section>';
}

function renderPost(data, slug) {
  var post = (data.writings || []).filter(function (w) { return w.slug === slug; })[0];
  if (!post) {
    return '<a class="back-link" href="index.html">← Back</a><h1>Not found</h1>'
      + '<p class="meta">这篇文章不存在，请从首页重新进入。</p>';
  }
  return ''
    + '<a class="back-link" href="index.html">← Back</a>'
    + '<article><h1>' + esc(post.title) + '</h1>'
    + '<p class="meta">' + esc(post.date) + '</p>'
    + markdownBlocks(post.body).join('\n')
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
      + '<a href="index.html#writings">日记</a>'
      + '<button class="search-toggle" type="button" title="Search (⌘K)" aria-label="搜索日记" data-search-toggle>'
      + '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">'
      + '<circle cx="7" cy="7" r="4.4" fill="none" stroke="currentColor" stroke-width="1.4"/>'
      + '<line x1="10.3" y1="10.3" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
      + '</svg></button>';
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

/* IKJON website renderer.
   All words, logos, links and statuses live in content/site.json (edited safely in /admin).
   Every piece of text is escaped, and only safe links and images are allowed, so content
   typed in the admin panel can never inject code into the page. */
(function (root) {
  var STATUS = {
    open:   {cls: "open", en: "Open",           uz: "Ochiq"},
    active: {cls: "open", en: "Active",         uz: "Faol"},
    live:   {cls: "live", en: "Live",           uz: "Ishlamoqda"},
    soon:   {cls: "soon", en: "Coming soon",    uz: "Tez kunda"},
    dev:    {cls: "soon", en: "In development", uz: "Ishlab chiqilmoqda"}
  };
  var NAV = [["areas", "#what", {en: "What we do", uz: "Faoliyat"}], ["logo", "#logo", {en: "Our logo", uz: "Logotip"}], ["apps", "#apps", {en: "Apps", uz: "Ilovalar"}], ["principles", "#how", {en: "How we work", uz: "Qanday ishlaymiz"}], ["contact", "#contact", {en: "Contact", uz: "Aloqa"}]];
  // A section is shown only when it is switched on in the editor (Sections to show).
  function on(d, key) { if (key === "contact") return true; var s = d.sections; return !s || s[key] !== false; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c];
    });
  }
  // Text in the chosen language, falling back to English.
  function t(v, lang) {
    if (v == null) return "";
    if (typeof v === "string") return esc(v);
    return esc(v[lang] || v.en || "");
  }
  // Allow only https links, in-page anchors and links to our own pages.
  function safeLink(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^https:\/\//i.test(u) || /^#[\w-]*$/.test(u)) return esc(u);
    if (/^(\/|\.\/)?[\w\-./]*$/.test(u) && u.indexOf("//") === -1 && u.indexOf("..") === -1) return esc(u.replace(/^\//, ""));
    return "";
  }
  // Allow only images stored on our own site.
  function safeImg(u) {
    u = String(u || "").trim().replace(/^\//, "");
    return /^[\w\-./]+\.(png|jpe?g|webp|svg|gif)$/i.test(u) && u.indexOf("..") === -1 ? esc(u) : "";
  }
  function ext(u) { return /^https:/i.test(u) ? ' target="_blank" rel="noopener"' : ""; }
  function list(a) { return Array.isArray(a) ? a : []; }
  function chip(st, lang) { var s = STATUS[st] || STATUS.soon; return '<span class="chip ' + s.cls + '">' + esc(s[lang] || s.en) + "</span>"; }
  function head(sec, lang) {
    return '<div class="head"><div><p class="label">' + t(sec.label, lang) + "</p><h2>" + t(sec.title, lang) + "</h2></div><p>" + t(sec.text, lang) + "</p></div>";
  }
  function btn(b, cls, lang) {
    var href = safeLink(b && b.link), label = t(b, lang);
    return href && label ? '<a class="btn ' + cls + '" href="' + href + '"' + ext(href) + ">" + label + "</a>" : "";
  }
  function pad2(n) { return n < 9 ? "0" + (n + 1) : String(n + 1); }

  function renderHeader(d, lang) {
    var b = d.brand || {};
    return '<a class="brand" href="#top" aria-label="' + t(b.name, lang) + ' home">' +
      (safeImg(b.logo_header) ? '<img src="' + safeImg(b.logo_header) + '" alt="">' : "") +
      "<span>" + t(b.name, lang) + "</span></a>" +
      '<nav class="nav" aria-label="Main">' + NAV.filter(function (n) { return on(d, n[0]); }).map(function (n) { return '<a href="' + n[1] + '">' + esc(n[2][lang]) + "</a>"; }).join("") + "</nav>" +
      '<div class="lang" role="group" aria-label="Language"><button id="lang-en" aria-pressed="' + (lang === "en") + '">EN</button><button id="lang-uz" aria-pressed="' + (lang === "uz") + '">UZ</button></div>';
  }

  function renderMain(d, lang) {
    var b = d.brand || {}, h = d.hero || {}, out = [];
    out.push('<section class="hero"><div class="wrap"><div><p class="label">' + t(h.label, lang) + "</p><h1>" + t(h.title_start, lang) +
      " <em>" + t(h.title_accent, lang) + '</em></h1><p class="lede">' + t(h.text, lang) + '</p><div class="cta">' +
      btn(h.button_main, "solid", lang) + btn(h.button_second, "ghost", lang) + "</div></div>" +
      (safeImg(b.logo_main) ? '<img class="hero-logo" src="' + safeImg(b.logo_main) + '" alt="' + t(b.name, lang) + ' logo" width="715" height="716">' : "") +
      "</div></section>");
    if (on(d, "facts") && list(d.facts).length) out.push('<div class="facts"><div class="wrap">' + list(d.facts).map(function (f) {
      return '<div class="fact"><b>' + t(f.number, lang) + "</b><span>" + t(f.label, lang) + "</span></div>";
    }).join("") + "</div></div>");
    if (on(d, "areas")) out.push('<section class="block" id="what"><div class="wrap">' + head(d.areas_intro || {}, lang) + '<div class="divs">' +
      list(d.areas).map(function (a, i) {
        var items = list(a.items).map(function (it) {
          var href = safeLink(it.link), name = t(it.name, lang);
          return "<li><span>" + (href ? '<a href="' + href + '"' + ext(href) + ">" + name + "</a>" : name) + "</span>" + chip(it.status, lang) + "</li>";
        }).join("");
        var more = a.button && safeLink(a.button.link) && t(a.button, lang) ? '<a class="more" href="' + safeLink(a.button.link) + '"' + ext(safeLink(a.button.link)) + ">" + t(a.button, lang) + "</a>" : "";
        return '<article class="div"><span class="num">' + pad2(i) + "</span><h3>" + t(a.name, lang) + "</h3><p>" + t(a.text, lang) + "</p>" + (items ? "<ul>" + items + "</ul>" : "") + more + "</article>";
      }).join("") + "</div></div></section>");
    var ls = d.logo_section || {}, pins = [[16, 78], [50, 66], [83, 44], [52, 22]];
    if (on(d, "logo")) out.push('<section class="block" id="logo"><div class="wrap">' + head(ls, lang) + '<div class="explain"><div class="markbox"><div class="inner">' +
      (safeImg(b.logo_mark) ? '<img src="' + safeImg(b.logo_mark) + '" alt="The ' + t(b.name, lang) + ' mark" width="680" height="498">' : "") +
      list(ls.parts).slice(0, 4).map(function (p, i) { return '<span class="pin" style="left:' + pins[i][0] + "%;top:" + pins[i][1] + '%" aria-hidden="true">' + (i + 1) + "</span>"; }).join("") +
      '</div></div><ol class="parts">' + list(ls.parts).map(function (p, i) {
        return '<li><span class="n">' + (i + 1) + "</span><div><b>" + t(p.title, lang) + "</b><span>" + t(p.text, lang) + "</span></div></li>";
      }).join("") + "</ol></div></div></section>");
    var fa = d.featured_app || {};
    if (on(d, "apps")) out.push('<section class="block" id="apps"><div class="wrap">' + head(d.apps_intro || {}, lang) + '<div class="apps">' + (t(fa.name, lang) ? '<article class="feature"><div><p class="label">' + t(fa.label, lang) +
      "</p><h3>" + t(fa.name, lang) + "</h3><p>" + t(fa.text, lang) + "</p><ul>" + list(fa.points).map(function (p) { return "<li>" + t(p, lang) + "</li>"; }).join("") + "</ul>" +
      btn(fa.button, "solid", lang) + "</div>" + (safeImg(fa.image) ? '<img src="' + safeImg(fa.image) + '" alt="' + t(fa.name, lang) + ' on a phone" width="540" height="960" loading="lazy">' : "") +
      '</article>' : '') + '<div class="roadmap"><p class="label">' + t(d.coming_label, lang) + "</p>" + list(d.coming).map(function (c) {
        var href = safeLink(c.link), name = t(c.name, lang);
        return '<div class="rm"><div><b>' + (href ? '<a href="' + href + '"' + ext(href) + ">" + name + "</a>" : name) + '</b><span class="d">' + t(c.text, lang) + "</span></div>" + chip(c.status, lang) + "</div>";
      }).join("") + "</div></div></div></section>");
    if (on(d, "principles")) out.push('<section class="block" id="how"><div class="wrap">' + head(d.principles_intro || {}, lang) + '<div class="principles">' + list(d.principles).map(function (p) {
      return '<div class="pr"><h3>' + t(p.title, lang) + "</h3><p>" + t(p.text, lang) + "</p></div>";
    }).join("") + "</div></div></section>");
    var c = d.contact || {};
    out.push('<section class="block last" id="contact"><div class="wrap"><div class="contact"><div><p class="label">' + t(c.label, lang) + '</p><h2 class="ch">' + t(c.title, lang) +
      '</h2><p class="ct">' + t(c.text, lang) + '</p></div><div class="links">' + list(c.links).map(function (l) {
        var href = safeLink(l.url);
        return href ? '<a href="' + href + '"' + ext(href) + "><div><b>" + t(l.name, lang) + "</b><span>" + t(l.handle, lang) + '</span></div><i aria-hidden="true">→</i></a>' : "";
      }).join("") + "</div></div></div></section>");
    return out.join("\n");
  }

  function renderFooter(d, lang) {
    var b = d.brand || {}, f = d.footer || {};
    return '<div class="fbrand">' + (safeImg(b.logo_footer) ? '<img src="' + safeImg(b.logo_footer) + '" alt="' + t(b.name, lang) + ' logo" width="715" height="716">' : "") +
      "<p>" + t(b.tagline, lang) + '</p></div><div class="flinks">' + list(f.links).map(function (l) {
        var href = safeLink(l.link); return href ? '<a href="' + href + '"' + ext(href) + ">" + t(l, lang) + "</a>" : "";
      }).join("") + '</div><p class="fine">' + t(f.fine, lang) + "</p>";
  }

  var api = {renderHeader: renderHeader, renderMain: renderMain, renderFooter: renderFooter, safeLink: safeLink, safeImg: safeImg, esc: esc};
  if (typeof module !== "undefined") module.exports = api;

  if (typeof document !== "undefined") {
    var data = null, lang = "en";
    try { if (localStorage.getItem("ikjon-lang") === "uz") lang = "uz"; } catch (e) {}
    function paint() {
      if (!data) return;
      document.getElementById("hdr").innerHTML = renderHeader(data, lang);
      document.getElementById("top").innerHTML = renderMain(data, lang);
      document.getElementById("ftr").innerHTML = renderFooter(data, lang);
      document.documentElement.lang = lang;
      document.getElementById("lang-en").onclick = function () { setLang("en"); };
      document.getElementById("lang-uz").onclick = function () { setLang("uz"); };
    }
    function setLang(l) { lang = l; try { localStorage.setItem("ikjon-lang", l); } catch (e) {} paint(); }
    // Show the built-in copy immediately, then load the latest saved content.
    try { data = JSON.parse(document.getElementById("site-data").textContent); } catch (e) {}
    if (lang !== "en") paint(); else { var le = document.getElementById("lang-en"), lu = document.getElementById("lang-uz"); if (le) le.onclick = function () { setLang("en"); }; if (lu) lu.onclick = function () { setLang("uz"); }; }
    fetch("content/site.json", {cache: "no-cache"}).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) { data = j; paint(); } }).catch(function () {});
  }
})(this);

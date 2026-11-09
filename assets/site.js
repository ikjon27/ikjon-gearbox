/* IKJON website renderer (home page and the Fitness & Sport page).
   All words, logos, links and statuses live in content/site.json (edited safely in /admin).
   Every piece of text is escaped, and only safe links and images are allowed, so content
   typed in the admin panel can never inject code into the page. */
(function (root) {
  var STATUS = {
    live: {cls: "live", en: "Available now", uz: "Hozir mavjud"},
    soon: {cls: "soon", en: "Coming soon", uz: "Tez kunda"}
  };
  var NAV = {
    home: [["#services", {en: "Services", uz: "Xizmatlar"}], ["#about", {en: "What we do", uz: "Faoliyat"}], ["#values", {en: "Values", uz: "Qadriyatlar"}], ["#goals", {en: "Goals", uz: "Maqsadlar"}], ["#contact", {en: "Contact", uz: "Aloqa"}]],
    sport: [["/", {en: "Home", uz: "Bosh sahifa"}], ["#apps", {en: "Apps", uz: "Ilovalar"}], ["/#contact", {en: "Contact", uz: "Aloqa"}]]
  };
  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
    if (/^\/?[\w\-./]*(#[\w=\-]*)?$/.test(u) && u.indexOf("//") === -1 && u.indexOf("..") === -1) return esc(u.charAt(0) === "/" ? u : "/" + u);
    return "";
  }
  // Allow only images stored on our own site.
  function safeImg(u) {
    u = String(u || "").trim().replace(/^\//, "");
    return /^[\w\-./]+\.(png|jpe?g|webp|svg|gif)$/i.test(u) && u.indexOf("..") === -1 ? "/" + esc(u) : "";
  }
  function ext(u) { return /^https:/i.test(u) ? ' target="_blank" rel="noopener"' : ""; }
  function list(a) { return Array.isArray(a) ? a : []; }
  function chip(st, lang) { var s = STATUS[st] || STATUS.soon; return '<span class="chip ' + s.cls + '">' + esc(s[lang] || s.en) + "</span>"; }
  function head(sec, lang, id) {
    var p = t(sec.text, lang);
    return '<div class="head"><p class="label">' + t(sec.label, lang) + '</p><h2' + (id ? ' id="' + id + '"' : "") + ">" + t(sec.title, lang) + "</h2>" + (p ? '<p class="intro">' + p + "</p>" : "") + "</div>";
  }
  function points(a, lang) {
    a = list(a); return a.length ? '<ul class="ticks">' + a.map(function (p) { return "<li>" + t(p, lang) + "</li>"; }).join("") + "</ul>" : "";
  }
  function action(b, live, lang, cls) {
    var href = safeLink(b && b.link), label = t(b, lang);
    if (!label) return "";
    if (live && href) return '<a class="' + cls + '" href="' + href + '"' + ext(href) + "><span>" + label + "</span>" + ARROW + "</a>";
    return '<span class="' + cls + ' off" aria-disabled="true">' + label + "</span>";
  }

  function renderHeader(d, lang, page) {
    var b = d.brand || {};
    return '<a class="brand" href="/" aria-label="' + t(b.name, lang) + ' home">' +
      (safeImg(b.logo_header) ? '<img src="' + safeImg(b.logo_header) + '" alt="" width="54" height="40">' : "") +
      "<span>" + t(b.name, lang) + "</span></a>" +
      '<nav class="nav" aria-label="Main">' + (NAV[page] || NAV.home).map(function (n) { return '<a href="' + n[0] + '">' + esc(n[1][lang]) + "</a>"; }).join("") + "</nav>" +
      '<div class="lang" role="group" aria-label="Language"><button id="lang-en" aria-pressed="' + (lang === "en") + '">EN</button><button id="lang-uz" aria-pressed="' + (lang === "uz") + '">UZ</button></div>' +
      '<a class="signin" href="/portal/"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' + (lang === "uz" ? "Kirish" : "Sign in") + "</a>";
  }

  function card(x, lang, live, level) {
    var img = safeImg(x.image), h = level || "h3";
    return '<article class="card' + (live ? "" : " later") + '">' +
      (img ? '<div class="cimg"><img src="' + img + '" alt="" width="400" height="240" loading="lazy"></div>' : "") +
      '<div class="cbody"><div class="ctop"><' + h + ">" + t(x.name, lang) + "</" + h + ">" + (x.status ? chip(x.status, lang) : "") + "</div>" +
      "<p>" + t(x.text, lang) + "</p>" + points(x.points, lang) +
      '<div class="cact">' + action(x.button, live, lang, "cbtn") + "</div></div></article>";
  }

  function renderHome(d, lang) {
    var b = d.brand || {}, h = d.hero || {}, out = [];
    var svc = list(d.services), edu = svc.filter(function (s) { return s.status === "soon"; })[0];
    var second = h.button_second && t(h.button_second, lang) ? '<a class="btn ghost" href="' + (safeLink(h.button_second.link) || "#services") + '">' + t(h.button_second, lang) + (edu ? ' <small>· ' + esc(STATUS.soon[lang] || STATUS.soon.en) + "</small>" : "") + "</a>" : "";
    out.push('<section class="hero"><div class="wrap"><div class="hero-copy"><p class="kicker">' + t(h.label, lang) + "</p><h1>" + t(h.title, lang) + '</h1><p class="lede">' + t(h.text, lang) + '</p><div class="cta">' +
      action(h.button_main, true, lang, "btn solid") + second + "</div></div>" +
      (safeImg(b.logo_footer) ? '<img class="hero-mark" src="' + safeImg(b.logo_footer) + '" alt="' + t(b.name, lang) + ' logo" width="715" height="716">' : "") + "</div></section>");
    out.push('<section class="block" id="services" aria-labelledby="h-services"><div class="wrap">' + head(d.services_intro || {}, lang, "h-services") + '<div class="cards two">' +
      svc.map(function (s) { return card(s, lang, s.status !== "soon"); }).join("") + "</div></div></section>");
    out.push('<section class="block tint" id="about" aria-labelledby="h-about"><div class="wrap">' + head(d.about_intro || {}, lang, "h-about") + '<div class="cols three">' +
      list(d.about).map(function (a, i) { return '<div class="col"><span class="num">0' + (i + 1) + "</span><h3>" + t(a.title, lang) + "</h3><p>" + t(a.text, lang) + "</p></div>"; }).join("") + "</div></div></section>");
    out.push('<section class="block" id="values" aria-labelledby="h-values"><div class="wrap">' + head(d.values_intro || {}, lang, "h-values") + '<div class="cols four">' +
      list(d.values).map(function (a) { return '<div class="col rule"><h3>' + t(a.title, lang) + "</h3><p>" + t(a.text, lang) + "</p></div>"; }).join("") + "</div></div></section>");
    out.push('<section class="block navy" id="goals" aria-labelledby="h-goals"><div class="wrap">' + head(d.goals_intro || {}, lang, "h-goals") + '<ol class="goals">' +
      list(d.goals).map(function (a, i) { return '<li><span class="gn">' + (i + 1) + "</span><div><h3>" + t(a.title, lang) + "</h3><p>" + t(a.text, lang) + "</p></div></li>"; }).join("") + "</ol></div></section>");
    out.push(renderContact(d, lang));
    return out.join("\n");
  }

  function renderContact(d, lang) {
    var c = d.contact || {};
    return '<section class="block last" id="contact" aria-labelledby="h-contact"><div class="wrap"><div class="contact"><div><p class="label">' + t(c.label, lang) + '</p><h2 id="h-contact">' + t(c.title, lang) +
      '</h2><p class="intro">' + t(c.text, lang) + '</p></div><div class="links">' + list(c.links).map(function (l) {
        var href = safeLink(l.url);
        return href ? '<a href="' + href + '"' + ext(href) + "><div><b>" + t(l.name, lang) + "</b><span>" + t(l.handle, lang) + '</span></div><i aria-hidden="true">→</i></a>' : "";
      }).join("") + "</div></div></div></section>";
  }

  function renderSport(d, lang) {
    var s = d.sport || {};
    return '<section class="hero small"><div class="wrap"><div class="hero-copy"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">' + (lang === "uz" ? "Bosh sahifa" : "Home") + "</a> / <span>" + t(s.label, lang) + "</span></nav><h1>" + t(s.title, lang) + '</h1><p class="lede">' + t(s.text, lang) + "</p></div></div></section>" +
      '<section class="block last" id="apps"><div class="wrap"><h2 class="sr">' + (lang === "uz" ? "Ilovalar" : "Apps") + '</h2><div class="cards two">' +
      list(s.apps).map(function (a) { return card(a, lang, true); }).join("") + "</div>" +
      (t(s.note, lang) ? '<p class="note">' + t(s.note, lang) + "</p>" : "") + "</div></section>";
  }

  function renderMain(d, lang, page) { return page === "sport" ? renderSport(d, lang) : renderHome(d, lang); }

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
    var data = null, lang = "en", page = document.body.getAttribute("data-page") || "home";
    try { if (localStorage.getItem("ikjon-lang") === "uz") lang = "uz"; } catch (e) {}
    function bind() {
      var le = document.getElementById("lang-en"), lu = document.getElementById("lang-uz");
      if (le) le.onclick = function () { setLang("en"); };
      if (lu) lu.onclick = function () { setLang("uz"); };
    }
    function paint() {
      if (!data) return;
      document.getElementById("hdr").innerHTML = renderHeader(data, lang, page);
      document.getElementById("top").innerHTML = renderMain(data, lang, page);
      document.getElementById("ftr").innerHTML = renderFooter(data, lang);
      document.documentElement.lang = lang;
      bind();
    }
    function setLang(l) { lang = l; try { localStorage.setItem("ikjon-lang", l); } catch (e) {} paint(); }
    // Show the built-in copy immediately, then load the latest saved content.
    try { data = JSON.parse(document.getElementById("site-data").textContent); } catch (e) {}
    if (lang !== "en") paint(); else bind();
    fetch("/content/site.json", {cache: "no-cache"}).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) { data = j; paint(); } }).catch(function () {});
  }
})(this);

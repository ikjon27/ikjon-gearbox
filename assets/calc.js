/* IKJON health calculators (BMI + waist-to-height, heart-rate zones).
   Everything is worked out in the browser. Nothing is saved, sent or tracked. */
(function () {
  var box = document.querySelector("[data-calc]");
  var src = document.getElementById("calc-i18n");
  if (!box || !src) return;
  var T = JSON.parse(src.textContent);
  var out = box.querySelector(".calc-out");
  box.querySelector(".calc-js").hidden = false;

  function num(id) {
    var el = document.getElementById(id);
    if (!el || el.value.trim() === "") return null;
    var v = parseFloat(el.value.replace(",", "."));
    return isFinite(v) ? v : NaN;
  }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }
  function fix(v, d) { return v.toFixed(d).replace(".", T.dec); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); }
  function show(html) { out.innerHTML = html; out.hidden = false; out.focus(); }
  function err(msg) { show('<p class="calc-err">' + esc(msg) + "</p>"); }

  function bmi() {
    var h = num("c-h"), w = num("c-w"), waist = num("c-waist");
    var g = document.getElementById("c-g").value;
    if (h === null || isNaN(h) || h < 100 || h > 250) return err(T.e_h);
    if (w === null || isNaN(w) || w < 25 || w > 300) return err(T.e_w);
    if (waist !== null && (isNaN(waist) || waist < 40 || waist > 250)) return err(T.e_waist);
    if (!g) return err(T.e_g);
    var b = Math.round(w / Math.pow(h / 100, 2) * 10) / 10;
    var lim = g === "low" ? [18.5, 23, 27.5] : [18.5, 25, 30];
    var cat = b < lim[0] ? "under" : b < lim[1] ? "healthy" : b < lim[2] ? "over" : "obese";
    var html = '<div class="calc-res r-' + cat + '"><span>' + esc(T.your_bmi) + "</span><b>" + fix(b, 1) + "</b><em>" + esc(T.cat[cat]) + "</em></div>" +
      "<p>" + esc(T.mean[cat]) + "</p>";
    if (waist !== null) {
      var r = Math.round(waist / h * 100) / 100;
      var wc = r < 0.4 ? "low" : r < 0.5 ? "healthy" : r < 0.6 ? "inc" : "high";
      html += '<div class="calc-res r-' + (wc === "healthy" ? "healthy" : wc === "low" ? "under" : wc === "inc" ? "over" : "obese") + '"><span>' + esc(T.your_whtr) + "</span><b>" + fix(r, 2) + "</b><em>" + esc(T.wcat[wc]) + "</em></div>" +
        "<p>" + esc(T.wmean[wc]) + "</p>";
      if (b >= 35) html += '<p class="small muted">' + esc(T.w35) + "</p>";
    } else {
      html += '<p class="small muted">' + esc(T.add_waist) + "</p>";
    }
    html += '<p class="small"><b>' + esc(T.screen) + "</b></p>";
    show(html);
  }

  function hr() {
    var a = num("c-age");
    if (a === null || isNaN(a) || a < 18 || a > 90) return err(T.e_age);
    a = Math.round(a);
    var m = 220 - a, r = function (p) { return Math.round(m * p); };
    var mod = [r(0.5), r(0.7)], vig = [r(0.7), r(0.85)];
    var half = function (x) { return Math.round(x / 2); };
    var html = '<div class="calc-res r-healthy"><span>' + esc(T.max) + "</span><b>" + m + "</b><em>" + esc(T.bpm) + "</em></div>" +
      '<div class="calc-zones"><div class="z-mod"><b>' + esc(T.mod) + "</b><strong>" + mod[0] + "–" + mod[1] + "</strong><span>" + esc(T.bpm) + "</span><small>" + esc(fmt(T.in30, {a: half(mod[0]), b: half(mod[1])})) + "</small></div>" +
      '<div class="z-vig"><b>' + esc(T.vig) + "</b><strong>" + vig[0] + "–" + vig[1] + "</strong><span>" + esc(T.bpm) + "</span><small>" + esc(fmt(T.in30, {a: half(vig[0]), b: half(vig[1])})) + "</small></div></div>" +
      "<p>" + esc(fmt(T.begin, {a: mod[0]})) + "</p>" +
      '<p class="small"><b>' + esc(T.hr_note) + "</b></p>";
    show(html);
  }

  var run = box.getAttribute("data-calc") === "bmi" ? bmi : hr;
  box.querySelector(".calc-go").addEventListener("click", run);
  box.querySelectorAll("input").forEach(function (i) {
    i.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); run(); } });
  });
})();

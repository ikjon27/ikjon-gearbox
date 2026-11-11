#!/usr/bin/env python3
"""Builds IKJON Fitness (fitness/index.html, manifest, service worker).

Reuses from the Rehab app: its stylesheet, exercise list (EX), animated-demo engine and exercise photos.
Content: tools/fitness_data.py · interface text: tools/fitness_ui.py · app code: tools/fitness_app.js
Translations of reused exercises: tools/i18n/uz.json and ru.json.
Run: python3 tools/build_fitness.py
"""
import json, os, re, sys, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import fitness_data as FD
from fitness_ui import UI
from musclemap import js_bundle as MUS_JS

REHAB = open(os.path.join(ROOT, "rehab", "index.html"), encoding="utf-8").read()
OUT = os.path.join(ROOT, "fitness")
os.makedirs(OUT, exist_ok=True)

def between(s, a, b, incl_b=False):
    i = s.index(a); j = s.index(b, i)
    return s[i:j + (len(b) if incl_b else 0)]

# ---- pieces of the Rehab app
styles = re.findall(r"<style>(.*?)</style>", REHAB, re.S)
CSS = styles[1]
core = between(REHAB, "const REG=", "const INJ=[")                 # REG, TYPES, EX, ex(), helpers
core = re.sub(r"const fmtT=.*?\n", "", core)                        # fitness has its own fmtT
core = re.sub(r"const (doseText|estMin)=.*?\n", "", core)
engine = between(REHAB, "const G=176", "const INJPH=")               # stick-figure animation + photos
engine = engine.replace('src="img/', 'src="/rehab/img/')
adds = between(REHAB, "REG.neck=", "/* new injuries */")             # extra exercises + animations
adds += between(REHAB, "/* ===== more back injuries ===== */", "INJ.push(", )[len("/* ===== more back injuries ===== */"):]
JS_REUSE = "const esc=s=>String(s).replace(/[&<>\"]/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\"}[c]));\n" + core + engine + adds

# ---- check exercises exist
EXIDS = set(re.findall(r"^\s*([a-z_0-9]+):\[\"", REHAB, re.M))
for e in FD.REUSED:
    assert e in EXIDS, "missing rehab exercise " + e
def ex_ids(lst): return [x[0] for x in lst]
used = set()
for w in FD.WORKOUTS.values(): used |= set(ex_ids(w[2]))
for _, opts in FD.CARE_SLOTS: used |= set(ex_ids(opts))
used |= set(ex_ids(FD.WARMUP)) | set(ex_ids(FD.HAIRDAY))
unknown = [e for e in used if e not in FD.NEWEX and e not in FD.REUSED]
assert not unknown, "add to REUSED or NEWEX: %s" % unknown

# ---- translations: English -> uz / ru
TRM = {"uz": json.load(open(os.path.join(ROOT, "tools/i18n/uz.json"), encoding="utf-8")),
       "ru": json.load(open(os.path.join(ROOT, "tools/i18n/ru.json"), encoding="utf-8"))}
for en, (uz, ru) in FD.EXTRA_TR.items():
    TRM["uz"][en] = uz; TRM["ru"][en] = ru
I18N = {"uz": {}, "ru": {}}
def put(o):
    """Register an L() dict and return its English text."""
    for k in ("uz", "ru"):
        I18N[k][o["en"]] = o[k]
    return o["en"]
def need(en):
    for k in ("uz", "ru"):
        if en and en not in I18N[k]:
            if en in TRM[k]: I18N[k][en] = TRM[k][en]
            else: MISSING.add(en)
    return en
MISSING = set()

AREAS = [[a, put(n), ic] for a, n, ic in FD.AREAS]
AREATIPS = {a: [put(x) for x in v] for a, v in FD.AREA_TIPS.items()}
FX = {i: [put(n), area, put(tg), [put(s) for s in st], put(tip), ty, ic] for i, (n, area, tg, st, tip, ty, ic) in FD.NEWEX.items()}
# reused exercise text from the Rehab app
EXTXT = {}
for m in re.finditer(r"^\s*([a-z_0-9]+):(\[\".*?\]),?\s*$", REHAB, re.M):
    try: EXTXT[m.group(1)] = json.loads(m.group(2))
    except Exception: pass
for e in FD.REUSED:
    a = EXTXT.get(e)
    assert a, "could not read rehab text for " + e
    for s in [a[0], a[2], a[4], a[6]] + a[3]: need(s)
for ty in ("Care", "Breathing", "Strength", "Mobility", "Stretch", "Isometric", "Core", "Cardio", "Balance"): need(ty)
HAB = {k: put(v) for k, v in FD.HABITS.items()}
WEEKLY = {k: [put(x) for x in v] for k, v in FD.WEEKLY.items()}
WK = {k: [put(n), ic, [list(x) for x in lst]] for k, (n, ic, lst) in FD.WORKOUTS.items()}
WK["hairday"] = [put(FD.HAIRDAY_NAME), "hair", [list(x) for x in FD.HAIRDAY]]
CARE = [[a, [list(x) for x in opts]] for a, opts in FD.CARE_SLOTS]
PLANS = [dict(p, name=put(p["name"]), tag=put(p["tag"]), desc=put(p["desc"])) for p in FD.PLANS]
MONTHS = [put(m) for m in FD.MONTHS]
LEVELS = [[k, put(n), f] for k, n, f in FD.LEVELS]
U = {k: list(v) for k, v in UI.items()}
if MISSING:
    print("Untranslated (falls back to English):", len(MISSING)); [print("  ", m) for m in sorted(MISSING)]

ICONK = {a: ic for a, _, ic in FD.AREAS}; ICONK["sleep"] = "moon"
KCOL = {"upper": "var(--p1)", "back": "var(--p1)", "neck": "var(--p1)", "legs": "var(--p0)", "glutes": "var(--p0)",
        "heart": "var(--orange-tint)", "core": "var(--tint)", "hair": "var(--tint)", "sleep": "var(--surface)"}
ICONS = {
 "hair": '<circle cx="24" cy="28" r="12"/><path d="M12 25c0-10 6-16 12-16s12 6 12 16M18 12c2 4 2 8 0 12M24 9v14M30 12c-2 4-2 8 0 12"/>',
 "face": '<circle cx="24" cy="24" r="17"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/><circle cx="30" cy="21" r="1.4" fill="currentColor"/><path d="M17 30c4 4 10 4 14 0"/>',
 "eye": '<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="6"/>',
 "tooth": '<path d="M15 7c-5 0-8 5-7 10 1 6 3 9 4 16 1 7 5 8 7 2l2-8c1-3 5-3 6 0l2 8c2 6 6 5 7-2 1-7 3-10 4-16 1-5-2-10-7-10-4 0-6 2-9 2s-5-2-9-2z"/>',
 "neck": '<circle cx="24" cy="11" r="7"/><path d="M21 18v7M27 18v7M7 41c0-9 8-15 17-15s17 6 17 15"/>',
 "arm": '<path d="M7 40h31c5-4 4-12-2-14-6-2-11 1-14 6"/><path d="M22 32c-3-7-2-16 2-23 2-3 7-2 7 2l-3 8"/>',
 "back": '<path d="M24 4v40"/><path d="M18 9h12M17 16h14M17 23h14M17 30h14M18 37h12"/>',
 "core": '<path d="M14 6c-2 10-2 26 2 36h16c4-10 4-26 2-36"/><path d="M24 12v24M18 18h12M18 26h12"/>',
 "hip": '<path d="M8 10c2 12 8 18 16 18s14-6 16-18"/><path d="M14 26l-4 16M34 26l4 16"/>',
 "leg": '<path d="M18 4v18c0 6 4 9 4 15v6h11"/><path d="M28 4v16c0 4 2 7 2 11"/>',
 "foot": '<path d="M16 9c-4 8-4 18-2 26 2 6 8 8 12 6s4-8 2-14c-1-6 0-12-2-18"/><circle cx="31" cy="8" r="2"/><circle cx="36" cy="12" r="1.8"/><circle cx="39" cy="17" r="1.5"/>',
 "hand": '<path d="M16 44V23l-4-6c-1-2 2-4 4-2l4 5V9c0-3 4-3 4 0v11V6c0-3 4-3 4 0v14V9c0-3 4-3 4 0v13v-8c0-3 4-3 4 0v16c0 8-5 14-12 14z"/>',
 "skin": '<circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/>',
 "heart": '<path d="M24 40S6 29 6 17c0-6 4-10 9-10 4 0 7 2 9 6 2-4 5-6 9-6 5 0 9 4 9 10 0 12-18 23-18 23z"/><path d="M10 23h8l3-5 4 9 3-4h10"/>',
 "lungs": '<path d="M24 6v16M24 22l-6 4M24 22l6 4"/><path d="M17 13c-6 2-11 12-11 22 0 4 4 6 8 4s4-6 4-10V14zM31 13c6 2 11 12 11 22 0 4-4 6-8 4s-4-6-4-10V14z"/>',
 "pelvic": '<path d="M9 12c0 10 7 18 15 18s15-8 15-18"/><path d="M16 30c0 6 4 10 8 10s8-4 8-10"/>',
 "moon": '<path d="M36 31A16 16 0 0 1 18 8a17 17 0 1 0 18 23z"/>',
 "body": '<circle cx="24" cy="7" r="4"/><path d="M24 11v16M13 18h22M24 27l-7 15M24 27l7 15"/>',
}

DATA = "".join(f"const {n}={json.dumps(v, ensure_ascii=False, separators=(',', ':'))};\n" for n, v in [
    ("U", U), ("I18N", I18N), ("AREAS", AREAS), ("AREATIPS", AREATIPS), ("FX", FX), ("AREAOF", FD.REUSED), ("HAB", HAB),
    ("WEEKLY", WEEKLY), ("WK", WK), ("WARM", [list(x) for x in FD.WARMUP]), ("CARE", CARE), ("PLANS", PLANS), ("MONTHS", MONTHS),
    ("LEVELS", LEVELS), ("ICONS", ICONS), ("ICONK", ICONK), ("KCOL", KCOL)])
APP = MUS_JS() + open(os.path.join(ROOT, "tools", "fitness_app.js"), encoding="utf-8").read()

EXTRA_CSS = """
.musbox2{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:12px;align-items:center;background:var(--bg,#F4F7F9);border-radius:14px;padding:10px;margin-top:10px}.musmap{width:100%;height:auto;display:block;max-height:300px}.muslegend p{margin:4px 0;font-size:.92rem}.muslegend i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;vertical-align:-1px}@media (max-width:520px){.musbox2{grid-template-columns:1fr}}
.small{font-size:.88rem}
.hero1{padding:8px 0 4px}.hero1 .lede{color:var(--muted);margin-top:10px;max-width:62ch;font-size:1.05rem}
.itile{display:grid;place-items:center;color:var(--teal);background:var(--tint)}
.ex .itile.mini{width:72px;height:56px;border-radius:8px}
.itile.demo{aspect-ratio:3/2;max-height:220px;border-radius:14px;margin:10px auto 0;width:100%}
.pl .plico{color:var(--teal)}
.pl h3{margin-top:2px}
.daygrid{display:grid;gap:14px;margin-top:16px}
.blk .bh{display:flex;gap:12px;align-items:center;flex-wrap:wrap;color:var(--teal)}
.blk .bh h3,.blk .bh p{color:var(--ink)}.blk .bh .muted{color:var(--muted)}
.blk .bh>div{flex:1 1 180px}
.tick{display:flex;gap:8px;align-items:center;font-weight:700;color:var(--ink);background:var(--tint);border-radius:999px;padding:6px 12px;cursor:pointer;font-size:.9rem}
.tick input{width:18px;height:18px;accent-color:var(--good)}
.tasks label{cursor:pointer}
.ring{--v:0;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--orange) calc(var(--v)*1%),rgba(255,255,255,.18) 0)}
.ring b{width:60px;height:60px;border-radius:50%;background:var(--navy);display:grid;place-items:center;font-size:1rem}
.today .pbar{background:rgba(255,255,255,.2)}.today .pbar i{background:var(--orange)}
.agrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.acard{align-items:center;text-align:center;color:var(--teal);cursor:pointer}.acard b{color:var(--ink);font-size:.95rem}
.acard:hover{border-color:var(--teal)}
.calbox{margin-top:12px}
.cal7{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
.cal7 .wk{font-size:.72rem;color:var(--muted);text-align:center;font-weight:700;text-transform:uppercase}
.bars{display:grid;grid-template-columns:repeat(14,minmax(0,1fr));gap:4px;align-items:end;height:120px;margin-top:10px}
.bcol{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}
.bcol i{display:block;width:100%;background:var(--teal);border-radius:4px 4px 0 0;min-height:2px}
.bcol span{font-size:.7rem;color:var(--muted)}
.player h2{margin-bottom:2px}
.foot .fine{max-width:70ch}
.tabs .tab{white-space:nowrap}
.toast{background:var(--good);color:#fff;border-radius:12px;padding:10px 14px;font-weight:700;margin:14px 0 0}
.badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:10px}
.badge{border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center;opacity:.55;display:flex;flex-direction:column;gap:2px}
.badge.on{opacity:1;border-color:var(--orange);background:var(--orange-tint)}.badge span{font-size:1.6rem}.badge b{font-size:.9rem}.badge small{font-size:.75rem;color:var(--muted)}
.wrapseg{flex-wrap:wrap;border-radius:16px}
.adapt{margin-top:10px;padding:10px 12px;border:1px dashed var(--line);border-radius:12px}
.chipbtn{border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:6px 12px;font-weight:700;font-size:.85rem;cursor:pointer}
.chipbtn[aria-pressed="true"]{background:var(--teal);border-color:var(--teal);color:#fff}
.eqtag{display:block;color:var(--teal);font-weight:600}
.news{margin-top:14px;border-color:var(--orange)}.news ul{margin:6px 0 0;padding-left:20px}
.chmed{display:flex;gap:6px}.chmed span{display:flex;flex-direction:column;align-items:center;font-size:1.1rem;line-height:1.1;opacity:.5}.chmed span.on{opacity:1}.chmed small{font-size:.65rem;color:var(--muted)}
.chact{border-color:var(--orange)}
.sideb{display:inline-block;background:var(--navy);color:#fff;border-radius:999px;padding:4px 12px;font-weight:800;font-size:.95rem}.sideb small{opacity:.75;font-weight:600}
.swap{font-size:2.4rem;font-weight:800;color:var(--teal);margin:6px 0}
.qgrid{display:grid;gap:10px;margin-top:12px}.qopt{text-align:left;font-weight:700;font-size:1.05rem;cursor:pointer;color:var(--ink)}.qopt:hover{border-color:var(--teal)}
"""

SHELL = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>IKJON Fitness — Daily Head-to-Toe Health Plans for Men &amp; Women</title>
<meta name="description" content="Free daily health app: 3-month plans for men and women, hair & scalp care, face and posture, eyes, feet and nails — with day-by-day and monthly calendars. English, Uzbek, Russian. No account, no tracking.">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.lemonsqueezy.com; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#1A4264">
<meta name="color-scheme" content="light dark">
<link rel="manifest" href="manifest.webmanifest">
<link rel="canonical" href="https://www.ikjon-gearbox.com/fitness/">
<link rel="icon" href="/rehab/icons/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/rehab/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="IKJON Fitness">
<meta property="og:type" content="website"><meta property="og:title" content="IKJON Fitness"><meta property="og:url" content="https://www.ikjon-gearbox.com/fitness/">
<meta property="og:description" content="Daily head-to-toe health plans for men and women — hair, face, eyes, posture, body, feet and nails.">
<meta property="og:image" content="https://www.ikjon-gearbox.com/rehab/icons/icon-512.png">
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"SoftwareApplication","name":"IKJON Fitness","applicationCategory":"HealthApplication","operatingSystem":"Android, iOS, Web","inLanguage":["en","uz","ru"],"description":"Daily head-to-toe health plans for men and women: workouts, hair and scalp care, face, eyes, posture, feet and nails, with day-by-day and monthly calendars.","url":"https://www.ikjon-gearbox.com/fitness/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"publisher":{"@type":"Organization","name":"IKJON Consulting & Education Centre","url":"https://www.ikjon-gearbox.com/"}}, ensure_ascii=False)}</script>
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}html{{-webkit-text-size-adjust:100%}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
<style>{CSS}{EXTRA_CSS}</style>
</head>
<body>
<header class="top"><div class="wrap">
  <button class="brand" id="homeBtn" aria-label="IKJON Fitness"><img class="markimg" src="/rehab/brand/mark-white.png" alt=""><span><b class="wm">IKJON</b><small>Fitness · Build • Improve • Grow</small></span></button>
  <nav class="tabs" aria-label="Main">
    <button class="tab" data-v="today" data-t="t_today">Today</button>
    <button class="tab" data-v="month" data-t="t_month">Calendar</button>
    <button class="tab" data-v="body" data-t="t_body">Head to toe</button>
    <button class="tab" data-v="lib" data-t="t_lib">Exercises</button>
    <button class="tab" data-v="prog" data-t="t_prog">Progress</button>
  </nav>
  <button class="hbtn" id="setBtn" aria-label="Settings" title="Settings"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.7h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L4.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1l.4 2.7h4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg></button>
</div></header>
<main class="wrap" id="app"><noscript>IKJON Fitness needs JavaScript.</noscript></main>
<footer class="foot"><div class="wrap footin">
  <div class="footbrand"><img src="/rehab/brand/lockup-white.png" alt="IKJON logo" class="footlogo"><p class="tag">Build • Improve • Grow</p></div>
  <p class="fine" data-t="foot_fine"></p>
</div></footer>
<dialog id="exDlg"><div class="dlg" id="exDlgBody"></div></dialog>
<div class="gate" id="gate" hidden></div>
<script>
{JS_REUSE}
{DATA}
{APP}
</script>
<script>if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost")){{addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{{}}))}}</script>
</body>
</html>
"""
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(SHELL)

MAN = {"name": "IKJON Fitness", "short_name": "IKJON Fit", "description": "Daily head-to-toe health plans for men and women.",
       "id": "./", "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
       "background_color": "#F3F7F8", "theme_color": "#1A4264", "lang": "en", "categories": ["health", "fitness", "lifestyle"],
       "icons": [{"src": "/rehab/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                 {"src": "/rehab/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
                 {"src": "/rehab/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
json.dump(MAN, open(os.path.join(OUT, "manifest.webmanifest"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)

imgs = sorted(f"/rehab/img/{e}-{k}.jpg" for e in used | set(FD.REUSED) for k in (0, 1) if os.path.exists(os.path.join(ROOT, "rehab", "img", f"{e}-{k}.jpg")))
files = ["./", "index.html", "manifest.webmanifest", "/rehab/icons/favicon-48.png", "/rehab/icons/icon-192.png", "/rehab/brand/mark-white.png", "/rehab/brand/lockup-white.png"] + imgs
ver = "ikjon-fit-" + datetime.datetime.now().strftime("%Y%m%d%H%M")
SW = f"""/* IKJON Fitness service worker — offline after first visit. Generated by tools/build_fitness.py */
const VERSION="{ver}";
const FILES={json.dumps(files, indent=0)};
self.addEventListener("install",e=>{{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))}});
self.addEventListener("activate",e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("ikjon-fit-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))}});
self.addEventListener("fetch",e=>{{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;
 if(!u.pathname.startsWith("/fitness/")&&!FILES.includes(u.pathname))return;
 e.respondWith(caches.match(r,{{ignoreSearch:true}}).then(hit=>hit||fetch(r).then(res=>{{if(res.ok&&u.pathname.startsWith("/fitness/")){{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}}return res}}).catch(()=>caches.match("index.html"))))}});
"""
open(os.path.join(OUT, "sw.js"), "w", encoding="utf-8").write(SW)
print("Built fitness/: %d KB, %d exercises, %d photos cached" % (os.path.getsize(os.path.join(OUT, "index.html")) // 1024, len(used), len(imgs)))

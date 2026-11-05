#!/usr/bin/env python3
"""Builds one Google-friendly guide page per injury from the Rehab app's own plans.

Input:  tools/rehab-data.json  (snapshot of the app's INJ, EX, EVID ... objects)
Output: rehab/guides/index.html and rehab/guides/<slug>/index.html, plus sitemap entries.
Run:    python3 tools/build_guides.py
"""
import json, os, html, datetime, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.ikjon-gearbox.com"
D = json.load(open(os.path.join(ROOT, "tools", "rehab-data.json"), encoding="utf-8"))
INJ, EX, EVID, REG = D["INJ"], D["EX"], D["EVID"], D["REG"]
TODAY = datetime.date.today().isoformat()

# Search-friendly address and title for each injury (what people actually type into Google).
SEO = {
 "acl": ("acl-rehab-exercises", "ACL Rehab Exercises & Recovery Plan, Week by Week"),
 "pfps": ("runners-knee-exercises", "Runner's Knee Exercises: Patellofemoral Pain Rehab Plan"),
 "patellar": ("jumpers-knee-exercises", "Jumper's Knee (Patellar Tendinopathy) Exercises & Plan"),
 "meniscus": ("meniscus-tear-exercises", "Meniscus Tear Exercises & Recovery Plan"),
 "mcl": ("mcl-sprain-exercises", "MCL Sprain Rehab Exercises & Recovery Timeline"),
 "itbs": ("it-band-syndrome-exercises", "IT Band Syndrome Exercises & Rehab Plan"),
 "ankle-sprain": ("ankle-sprain-rehab", "Ankle Sprain Rehab Exercises & Recovery Plan"),
 "achilles": ("achilles-tendinopathy-exercises", "Achilles Tendinopathy Exercises & Rehab Plan"),
 "plantar": ("plantar-fasciitis-exercises", "Plantar Fasciitis Exercises: Heel Pain Rehab Plan"),
 "shin": ("shin-splints-exercises", "Shin Splints Exercises & Recovery Plan"),
 "hamstring": ("hamstring-strain-rehab", "Hamstring Strain Rehab Exercises & Return to Sport"),
 "groin": ("groin-strain-rehab", "Groin Strain Rehab Exercises & Recovery Plan"),
 "lbp": ("lower-back-pain-exercises", "Lower Back Pain Exercises & Rehab Plan"),
 "shoulder": ("rotator-cuff-shoulder-exercises", "Rotator Cuff & Shoulder Impingement Exercises"),
 "tennis-elbow": ("tennis-elbow-exercises", "Tennis Elbow Exercises & Rehab Plan"),
 "knee-oa": ("knee-osteoarthritis-exercises", "Knee Osteoarthritis Exercises & Strength Plan"),
 "osgood": ("osgood-schlatter-exercises", "Osgood-Schlatter Exercises: Teen Knee Pain Plan"),
 "calf": ("calf-strain-rehab", "Calf Strain Rehab Exercises & Recovery Plan"),
 "quad": ("quad-strain-rehab", "Quad Strain Rehab Exercises & Recovery Plan"),
 "neck": ("neck-pain-exercises", "Neck Pain Exercises for Desk & Phone Posture"),
 "instab": ("shoulder-dislocation-rehab", "Shoulder Dislocation Rehab Exercises & Plan"),
 "sciatica": ("sciatica-exercises", "Sciatica Exercises & Relief Plan"),
 "spondy": ("spondylolysis-exercises", "Spondylolysis Rehab Exercises (Low Back Stress Fracture)"),
 "upperback": ("upper-back-posture-exercises", "Upper Back & Posture Exercises Plan"),
}
missing = [i["id"] for i in INJ if i["id"] not in SEO]
assert not missing, f"Add SEO entries for: {missing}"

e = lambda s: html.escape(str(s if s is not None else ""), quote=True)

def ex(id_):
    a = EX[id_]
    return {"name": a[0], "region": a[1], "target": a[2], "steps": a[3], "why": a[4], "type": a[6], "id": id_}

def fmt_t(t):
    return f"{t // 60} min" if t >= 60 and t % 60 == 0 else (f"{t / 60:.1f} min" if t >= 60 else f"{t} s")

def dose(x):
    if x.get("t"):
        return (f'{x["s"]} × ' if x.get("s", 1) > 1 else "") + fmt_t(x["t"])
    return f'{x["s"]} × {x["r"]}'

def weeks(days):
    w = round(days / 7)
    return f"about {days // 30} months" if days >= 84 else f"about {w} weeks"

def photo(id_, cls="", alt=""):
    if os.path.exists(os.path.join(ROOT, "rehab", "img", f"{id_}-0.jpg")):
        return f'<img class="{cls}" src="../../img/{id_}-0.jpg" alt="{e(alt)}" width="420" height="280" loading="lazy">'
    return ""

CSS = """:root{--bg:#F3F7F8;--fg:#1A4264;--mut:#56708A;--tint:#E3F2F5;--card:#fff;--line:#d5e2e8;--band:#1A4264;--teal:#0097B2;--orange:#D9711F;--bad:#B3261E;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#0E1A24;--fg:#E4EEF3;--mut:#9AB2C2;--tint:#123544;--card:#132331;--line:#24394a;--band:#10283D;--teal:#2DB7D1;--orange:#EE8A3C;--bad:#F2B8B5;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.6 Calibri,"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
header{background:var(--band);border-bottom:3px solid var(--teal);padding:10px 16px}
header .in{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
header a{color:#fff;text-decoration:none}.logo{display:inline-flex;align-items:center;gap:10px;font-family:Georgia,serif;letter-spacing:.2em;font-size:1.15rem}.logo img{height:34px;width:auto}
.top-cta{background:var(--orange);padding:7px 14px;border-radius:999px;font-weight:700;font-size:.9rem;white-space:nowrap}
main{max-width:860px;margin:0 auto;padding:18px 16px 48px}
nav.crumbs{font-size:.88rem;color:var(--mut);margin-bottom:6px}nav.crumbs a{color:inherit}
h1,h2,h3{font-family:Georgia,serif;line-height:1.25}h1{font-size:clamp(1.6rem,5vw,2.3rem);margin:.2em 0 .3em}h2{font-size:1.35rem;margin:34px 0 10px}h3{font-size:1.1rem;margin:0 0 4px}
.lede{font-size:1.08rem}.muted{color:var(--mut)}.small{font-size:.88rem}
.note{background:var(--tint);border-radius:14px;padding:12px 14px;font-size:.95rem}
.warn{border:2px solid var(--bad);border-radius:14px;padding:12px 16px}.warn h2{margin-top:0;color:var(--bad);font-size:1.15rem}
.cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--card);border:2px solid var(--orange);border-radius:16px;padding:16px;margin:22px 0}
.cta p{margin:0;flex:1 1 260px}.btn{display:inline-block;background:var(--orange);color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:12px}
table{width:100%;border-collapse:collapse;background:var(--card);border-radius:12px;overflow:hidden;font-size:.95rem}th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{background:var(--tint)}
.phase{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin:14px 0}
.phase .when{color:var(--teal);font-weight:700;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em}
ol.exs{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:12px}
ol.exs>li{display:grid;grid-template-columns:120px minmax(0,1fr);gap:12px;border-top:1px solid var(--line);padding-top:12px}
ol.exs>li.nophoto{grid-template-columns:minmax(0,1fr)}ol.exs>li>img{width:120px;height:80px;object-fit:cover;border-radius:10px}
.dose{display:inline-block;background:var(--tint);border-radius:999px;padding:1px 10px;font-weight:700;font-size:.88rem;margin-left:6px}
.steps{margin:6px 0 0;padding-left:20px;font-size:.95rem;display:block}.steps li{display:list-item;border:0;padding:0;margin:2px 0}.exit{margin:12px 0 0;font-size:.95rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.card{display:block;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;color:inherit;text-decoration:none}.card:hover{border-color:var(--teal)}
.card b{display:block;font-family:Georgia,serif;font-size:1.05rem}.card span{color:var(--mut);font-size:.9rem}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:8px 0}summary{font-weight:700;cursor:pointer}
footer{color:var(--mut);font-size:.85rem;text-align:center;padding:0 16px 32px;max-width:860px;margin:0 auto}footer a{color:inherit}
@media (max-width:480px){ol.exs>li{grid-template-columns:88px minmax(0,1fr)}ol.exs>li.nophoto{grid-template-columns:minmax(0,1fr)}ol.exs>li>img{width:88px;height:64px}}"""

CSP = "default-src 'self'; style-src 'unsafe-inline'; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"

def page(title, desc, canon, body, ld, depth):
    up = "../" * depth
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{CSP}"><meta name="referrer" content="strict-origin-when-cross-origin">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canon}"><meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{canon}"><meta property="og:site_name" content="IKJON">
<link rel="icon" href="{up}icons/favicon-48.png"><link rel="apple-touch-icon" href="{up}icons/apple-touch-icon.png">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
<style>{CSS}</style></head>
<body><header><div class="in"><a class="logo" href="{up}../"><img src="{up}brand/mark-white.png" alt="" width="46" height="34">IKJON</a><a class="top-cta" href="{up}">Open the free app</a></div></header>
<main>{body}</main>
<footer><p><a href="{up}guides/">All injury guides</a> · <a href="{up}">IKJON Joint Rehab app</a> · <a href="{up}privacy.html">Privacy</a> · <a href="{up}terms.html">Terms</a></p>
<p>General exercise education only. IKJON Joint Rehab is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. In an emergency call your local emergency number.</p>
<p>Exercise photos: Free Exercise DB (public domain). © 2026 IKJON Consulting &amp; Education Centre. All rights reserved. IKJON™ is a trademark of IKJON Consulting &amp; Education Centre.</p></footer>
</body></html>
"""

def injury_page(i):
    slug, title = SEO[i["id"]]
    canon = f"{SITE}/rehab/guides/{slug}/"
    region = REG.get(i["region"], i["region"].title())
    nex = len({x["e"] for p in i["phases"] for x in p["x"]})
    longest = max(s["days"] for s in i["sev"])
    desc = (f"Free phase-by-phase {i['name'].split(' (')[0].lower()} rehab plan: {len(i['phases'])} stages, "
            f"{nex} exercises with how-to steps and photos, recovery timeline and warning signs. Evidence-based.")
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "…"
    app = f"../../#injury={i['id']}"
    b = [f'<nav class="crumbs" aria-label="Breadcrumb"><a href="../../../">IKJON</a> › <a href="../">Injury rehab guides</a> › {e(region)}</nav>',
         f"<h1>{e(i['name'])}: rehab exercises &amp; recovery plan</h1>",
         f'<p class="lede">{e(i["what"])}</p>',
         f'<p class="muted small">Common in: {e(i["sport"])} · Body area: {e(region)} · Updated {datetime.date.today():%B %Y}</p>' if i.get("sport") else "",
         '<p class="note"><b>Education, not diagnosis.</b> This guide explains how this injury is usually rehabilitated. It cannot tell you what injury you have — see a doctor or physiotherapist to confirm it, especially after a fall, a pop or surgery.</p>',
         f'<div class="cta"><p><b>Follow this plan day by day — free.</b> The IKJON app turns it into a calendar with animated demos, timers and a pain diary. No account, no ads.</p><a class="btn" href="{app}">Start the {e(i["name"].split(" (")[0])} plan</a></div>']
    if i.get("signs"):
        b.append("<h2>Typical signs</h2><ul>" + "".join(f"<li>{e(s)}</li>" for s in i["signs"]) + "</ul>")
    if i.get("flags"):
        b.append('<div class="warn"><h2>See a doctor first if you have any of these</h2><ul>' + "".join(f"<li>{e(f)}</li>" for f in i["flags"]) + "</ul></div>")
    b.append("<h2>How long does recovery take?</h2><p>It depends on how serious the injury is. These are typical plan lengths:</p>"
             "<table><thead><tr><th>Severity</th><th>Usual description</th><th>Typical plan</th></tr></thead><tbody>" +
             "".join(f"<tr><td><b>{e(s['l'])}</b><br><span class='muted small'>{e(s.get('g',''))}</span></td><td>{e(s.get('d',''))}</td><td>{s['days']} days ({weeks(s['days'])})</td></tr>" for s in i["sev"]) +
             "</tbody></table>")
    b.append(f"<h2>The rehab plan, stage by stage</h2><p>Move to the next stage only when you meet its “move on when” checks — not just because the weeks have passed.</p>")
    for k, p in enumerate(i["phases"], 1):
        items = []
        for x in p["x"]:
            a = ex(x["e"])
            ph = photo(a["id"], alt=f"{a['name']} exercise")
            steps = "".join(f"<li>{e(s)}</li>" for s in a["steps"])
            items.append(f'<li class="{"" if ph else "nophoto"}">{ph}<div><h3>{e(a["name"])}<span class="dose">{e(dose(x))}</span></h3>'
                         f'<span class="muted small">{e(a["type"])} · {e(a["target"])}{" · " + e(x["n"]) if x.get("n") else ""}</span>'
                         f'<ol class="steps">{steps}</ol>' + (f'<p class="small muted" style="margin:6px 0 0">Tip: {e(a["why"])}</p>' if a.get("why") else "") + "</div></li>")
        exit_ = ("<p class='exit'><b>Move on when:</b></p><ul class='exit'>" + "".join(f"<li>{e(c)}</li>" for c in p.get("exit", [])) + "</ul>") if p.get("exit") else ""
        b.append(f'<section class="phase" id="stage-{k}"><div class="when">Stage {k} · {e(p.get("w",""))}</div><h3 style="font-size:1.25rem">{e(p["t"])}</h3>'
                 f'<p style="margin:4px 0 0"><b>Goal:</b> {e(p.get("goal",""))}</p><ol class="exs">{"".join(items)}</ol>{exit_}</section>')
    if i.get("note"):
        b.append(f'<p class="note"><b>Important:</b> {e(i["note"])}</p>')
    ev = EVID.get(i["id"])
    if ev:
        b.append(f"<h2>What the research says</h2><p class='muted small'>Strength of evidence: <b>{e(ev.get('lvl',''))}</b></p><ul>" +
                 "".join(f"<li>{e(t)}</li>" for t in ev.get("pts", [])) + "</ul>" +
                 ("<p class='small muted'><b>Sources:</b> " + "; ".join(e(r) for r in ev.get("refs", [])) + "</p>" if ev.get("refs") else ""))
    faq = [(f"How long does {i['name'].split(' (')[0].lower()} take to heal?",
            "It depends on severity. " + " ".join(f"{s['l']}: about {s['days']} days ({weeks(s['days'])})." for s in i["sev"]) +
            " Move on by meeting each stage's checks, not by the calendar alone."),
           ("When should I see a doctor?",
            "See a doctor or physiotherapist to confirm the injury, and get help urgently if you notice: " + "; ".join(i.get("flags", [])) + "." if i.get("flags") else
            "See a doctor or physiotherapist to confirm the injury and if pain gets worse instead of better."),
           ("Should exercises hurt?",
            "Mild discomfort up to about 3–4 out of 10 that settles within 24 hours is usually acceptable. Stop if pain is sharp, goes above 5 out of 10, or swelling increases afterwards.")]
    b.append("<h2>Common questions</h2>" + "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faq))
    b.append(f'<div class="cta"><p><b>Ready to start?</b> Open the plan in the IKJON app and it guides you day by day, with demos for every exercise.</p><a class="btn" href="{app}">Start the plan free</a></div>')
    rel = [j for j in INJ if j["region"] == i["region"] and j["id"] != i["id"]][:6]
    if rel:
        b.append(f"<h2>More {e(region.lower())} guides</h2><div class='grid'>" +
                 "".join(f'<a class="card" href="../{SEO[j["id"]][0]}/"><b>{e(j["name"])}</b><span>Exercises &amp; recovery plan</span></a>' for j in rel) + "</div>")
    ld = [{"@context": "https://schema.org", "@type": "MedicalWebPage", "name": title, "headline": f"{i['name']}: rehab exercises & recovery plan",
           "description": desc, "url": canon, "inLanguage": "en", "dateModified": TODAY, "lastReviewed": TODAY,
           "about": {"@type": "MedicalCondition", "name": i["name"]}, "audience": {"@type": "Patient"},
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/", "logo": SITE + "/brand/lockup-navy.png"}},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "IKJON", "item": SITE + "/"},
              {"@type": "ListItem", "position": 2, "name": "Injury rehab guides", "item": SITE + "/rehab/guides/"},
              {"@type": "ListItem", "position": 3, "name": i["name"], "item": canon}]},
          {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
              {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}]
    return slug, page(f"{title} | IKJON", desc, canon, "".join(b), ld, 2)

def hub():
    canon = f"{SITE}/rehab/guides/"
    title = "Sports Injury Rehab Exercises: Free Recovery Plans | IKJON"
    desc = (f"Free, evidence-based rehab plans for {len(INJ)} common sports and joint injuries — knee, ankle, back, shoulder and more. "
            "Stage-by-stage exercises with photos.")[:160]
    groups = {}
    for i in INJ:
        groups.setdefault(i["region"], []).append(i)
    order = [r for r in REG if r in groups]
    b = ['<nav class="crumbs" aria-label="Breadcrumb"><a href="../../">IKJON</a> › Injury rehab guides</nav>',
         "<h1>Injury rehab exercises &amp; recovery plans</h1>",
         f'<p class="lede">Free, stage-by-stage plans for {len(INJ)} common sports and everyday injuries, built from published research and sports-medicine guidelines. Each guide shows the exercises, how to do them, how long recovery usually takes and the warning signs that mean you should see a doctor.</p>',
         '<div class="cta"><p><b>Not sure which plan fits?</b> The app\'s “Find your plan” asks a few questions and suggests plans to look at.</p><a class="btn" href="../#find">Find your plan</a></div>']
    for r in order:
        b.append(f"<h2>{e(REG[r])}</h2><div class='grid'>" +
                 "".join(f'<a class="card" href="{SEO[i["id"]][0]}/"><b>{e(i["name"])}</b><span>{e(SEO[i["id"]][1])}</span></a>' for i in groups[r]) + "</div>")
    b.append('<p class="note" style="margin-top:28px"><b>Education, not diagnosis.</b> These guides cannot tell you what injury you have. See a doctor or physiotherapist to confirm it.</p>')
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": title, "description": desc, "url": canon, "inLanguage": "en",
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/"},
           "hasPart": [{"@type": "MedicalWebPage", "name": SEO[i["id"]][1], "url": f"{canon}{SEO[i['id']][0]}/"} for i in INJ]}]
    return page(title, desc, canon, "".join(b), ld, 1)

def main():
    out = os.path.join(ROOT, "rehab", "guides")
    os.makedirs(out, exist_ok=True)
    urls = [f"{SITE}/rehab/guides/"]
    open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(hub())
    for i in INJ:
        slug, h = injury_page(i)
        os.makedirs(os.path.join(out, slug), exist_ok=True)
        open(os.path.join(out, slug, "index.html"), "w", encoding="utf-8").write(h)
        urls.append(f"{SITE}/rehab/guides/{slug}/")
    # sitemap: keep existing non-guide entries, refresh guide entries
    sm = os.path.join(ROOT, "sitemap.xml")
    s = open(sm, encoding="utf-8").read()
    s = re.sub(r"\s*<url><loc>https://www\.ikjon-gearbox\.com/rehab/guides/[^<]*</loc>.*?</url>", "", s, flags=re.S)
    add = "".join(f"\n  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><changefreq>monthly</changefreq><priority>{'0.9' if u.endswith('/guides/') else '0.8'}</priority></url>" for u in urls)
    s = s.replace("</urlset>", add + "\n</urlset>")
    open(sm, "w", encoding="utf-8").write(s)
    print(f"Built {len(urls)} pages")

if __name__ == "__main__":
    main()

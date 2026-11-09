// Renders the shareable cards (1080×1350 JPEG) listed in tools/cards-manifest.json.
// Needs a local server on :8765 serving the repo.   Run: node tools/build_cards.js [--force]
const {chromium} = require("playwright"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), force = process.argv.includes("--force");
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, "cards-manifest.json"), "utf8"));
const KIND = {
  en: {guide: "Injury guide", exercise: "How to do it", plan: "Free workout plan", free: "Free · No account · EN / UZ / RU"},
  uz: {guide: "Jarohat qo‘llanmasi", exercise: "Qanday bajariladi", plan: "Bepul mashq rejasi", free: "Bepul · Ro‘yxatdan o‘tishsiz · EN / UZ / RU"},
  ru: {guide: "Руководство по травме", exercise: "Как выполнять", plan: "Бесплатный план", free: "Бесплатно · Без регистрации · EN / UZ / RU"}
};
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const CSS = `*{box-sizing:border-box;margin:0}body{width:1080px;height:1350px;font-family:"Segoe UI",system-ui,Roboto,Arial,sans-serif;background:#0F2C45;color:#14283A}
.c{position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(170deg,#1A4264,#0F2C45)}
.top{display:flex;align-items:center;gap:18px;padding:52px 64px 30px;color:#fff}.top img{height:58px}.top b{font-size:40px;letter-spacing:.28em}.top span{margin-left:auto;font-size:26px;font-weight:700;color:#8FD6E6;text-transform:uppercase;letter-spacing:.12em}
.p{flex:1;margin:0 40px;background:#fff;border-radius:36px;padding:52px 56px;display:flex;flex-direction:column;gap:22px;overflow:hidden}
h1{font-size:60px;line-height:1.08;font-weight:800;letter-spacing:-.01em;color:#1A4264}.sub{font-size:30px;color:#506477}
.art{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;background:#F2F7F9;border-radius:24px;padding:20px}.art svg{width:100%;height:100%;max-height:520px}
ul{list-style:none;padding:0;display:grid;gap:14px;font-size:31px;line-height:1.3}li{padding-left:44px;position:relative}li:before{content:"";position:absolute;left:4px;top:.45em;width:22px;height:13px;border-left:5px solid #0097B2;border-bottom:5px solid #0097B2;transform:rotate(-45deg)}
.plan li{padding-left:0}.plan li:before{display:none}.plan li b{color:#D9711F}
.f{padding:26px 64px 40px;color:#fff;display:flex;flex-direction:column;gap:6px;font-size:25px}.f span{white-space:nowrap}.f b{color:#FFB067}
.rig .near{stroke:#0097B2}.rig .far{stroke:#9CCAD6}.rig .tor{stroke:#1A4264}.rig .head{fill:#1A4264}.rig .hl{stroke:#D9711F!important}.rig .hlc{fill:#D9711F}.rig .prop{fill:#C9D8E0;stroke:none}.rig .propl{stroke:#C9D8E0;fill:none}.rig .band{stroke:#D9711F;fill:none;stroke-dasharray:4 3}.rig .gnd{stroke:#d5e2e8}
.anat text{font:600 11px "Segoe UI",system-ui,sans-serif;fill:#1A4264}`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1350}});
  await p.goto("http://localhost:8765/robots.txt");
  let made = 0;
  for (const c of cards) {
    const out = path.join(ROOT, c.out.replace(/^\//, ""));
    if (!force && fs.existsSync(out)) continue;
    fs.mkdirSync(path.dirname(out), {recursive: true});
    const k = KIND[c.lang], plan = c.kind === "plan";
    const lines = (c.lines || []).slice(0, plan ? 7 : 3).map(l => plan ? `<li><b>${esc(l.split(":")[0])}:</b>${esc(l.slice(l.indexOf(":") + 1))}</li>` : `<li>${esc(l)}</li>`).join("");
    const art = c.svg ? `<div class="art ${c.kind === "guide" ? "anat" : ""}">${c.svg}</div>` : "";
    const title = c.title.length > 60 ? c.title.slice(0, 58).replace(/\s+\S*$/, "") + "…" : c.title;
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="http://localhost:8765/"><style>${CSS}</style></head><body><div class="c">
<div class="top"><img src="/brand/mark-white.png" alt=""><b>IKJON</b><span>${esc(k[c.kind])}</span></div>
<div class="p"><h1>${esc(title)}</h1>${c.sub ? `<p class="sub">${esc(c.sub.replace(/&amp;/g, "&"))}</p>` : ""}${art}<ul class="${plan ? "plan" : ""}">${lines}</ul></div>
<div class="f"><span>${esc(c.url)}</span><b>${esc(k.free)}</b></div></div></body></html>`, {waitUntil: "load"});
    await p.screenshot({path: out, type: "jpeg", quality: 70});
    made++;
  }
  console.log("cards made:", made, "of", cards.length);
  await b.close();
})();

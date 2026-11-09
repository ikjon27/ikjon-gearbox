// Builds index.html and sport/index.html from tools/index.template.html + content/site.json,
// so search engines see the latest text.
// Run: node tools/build.js   (GitHub runs it automatically after every edit in /admin)
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const r = require(path.join(root, "assets", "site.js"));
const data = JSON.parse(fs.readFileSync(path.join(root, "content", "site.json"), "utf8"));
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const tpl = fs.readFileSync(path.join(__dirname, "index.template.html"), "utf8");
const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const pages = [
  {page: "home", out: "index.html", url: "https://www.ikjon-gearbox.com/",
   title: "IKJON Consulting & Education Centre",
   desc: "IKJON Consulting & Education Centre in Uzbekistan: English and Ona tili courses, IELTS and CEFR preparation, and free apps for fitness, football training and injury recovery."},
  {page: "sport", out: "sport/index.html", url: "https://www.ikjon-gearbox.com/sport/",
   title: "Fitness & Sport — IKJON",
   desc: "Free IKJON apps and guides for injury recovery, daily fitness and football training, in English, Uzbek and Russian. No account needed."}
];
for (const p of pages) {
  const html = tpl
    .replace(/<!--TITLE-->/g, () => attr(p.title))
    .replace(/<!--DESC-->/g, () => attr(p.desc))
    .replace(/<!--CANON-->/g, () => p.url)
    .replace("<!--PAGE-->", p.page)
    .replace("<!--HEADER-->", () => r.renderHeader(data, "en", p.page))
    .replace("<!--MAIN-->", () => r.renderMain(data, "en", p.page))
    .replace("<!--FOOTER-->", () => r.renderFooter(data, "en"))
    .replace("<!--DATA-->", () => json);
  const file = path.join(root, p.out);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, html);
  console.log(p.out, "built:", html.length, "bytes");
}

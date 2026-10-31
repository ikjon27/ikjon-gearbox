// Builds index.html from tools/index.template.html + content/site.json, so search engines see the latest text.
// Run: node tools/build.js   (GitHub runs it automatically after every edit in /admin)
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const r = require(path.join(root, "assets", "site.js"));
const data = JSON.parse(fs.readFileSync(path.join(root, "content", "site.json"), "utf8"));
const json = JSON.stringify(data).replace(/</g, "\\u003c");
let html = fs.readFileSync(path.join(__dirname, "index.template.html"), "utf8")
  .replace("<!--HEADER-->", () => r.renderHeader(data, "en"))
  .replace("<!--MAIN-->", () => r.renderMain(data, "en"))
  .replace("<!--FOOTER-->", () => r.renderFooter(data, "en"))
  .replace("<!--DATA-->", () => json);
fs.writeFileSync(path.join(root, "index.html"), html);
console.log("index.html built:", html.length, "bytes");

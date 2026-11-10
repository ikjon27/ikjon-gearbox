// Exports exercise figures and IKJON Fitness plan data for the public library pages.
// Run with a local server on :8765 serving the repo:  node tools/export_library_data.js
const {chromium} = require("playwright"), fs = require("fs"), path = require("path");
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto("http://localhost:8765/fitness/"); await p.waitForTimeout(800);
  const d = await p.evaluate(() => {
    const figs = {};
    for (const id of Object.keys(EX)) {
      const tp = TPL[EX[id][7]]; if (!tp) continue;
      try {
        const a = tp.fr ? tp.fr[0][0] : P(tp.b, tp.fn(0)), z = tp.fr ? tp.fr[Math.min(1, tp.fr.length - 1)][0] : P(tp.b, tp.fn(.5));
        figs[id] = [figSVG(a, tp.pr), figSVG(z, tp.pr)];
      } catch (e) { figs[id] = null; }
    }
    for (const id of Object.keys(FX)) {
      const tp = TPL[FX[id][7]]; if (!tp || figs[id]) continue;
      try { const a = tp.fr ? tp.fr[0][0] : P(tp.b, tp.fn(0)), z = tp.fr ? tp.fr[Math.min(1, tp.fr.length - 1)][0] : P(tp.b, tp.fn(.5)); figs[id] = [figSVG(a, tp.pr), figSVG(z, tp.pr)]; } catch (e) {}
    }
    const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("").match(/\.rig[^{]*\{[^}]*\}/g) || [];
    return {EX, FX, PLANS, WK, CARE, HAB, CHAL, AREAS, AREATIPS, I18N, figs, css};
  });
  fs.writeFileSync(path.join(__dirname, "library-data.json"), JSON.stringify(d));
  console.log("figures:", Object.values(d.figs).filter(Boolean).length, "plans:", d.PLANS.length, "workouts:", Object.keys(d.WK).length);
  await b.close();
})();

#!/usr/bin/env python3
"""Injects tools/rehab_anatomy.js (+ styles and new groin injuries) into rehab/index.html. Safe to re-run."""
import os,re
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p=os.path.join(ROOT,"rehab","index.html");s=open(p,encoding="utf-8").read()
js=open(os.path.join(ROOT,"tools","rehab_anatomy.js"),encoding="utf-8").read()
# 1 anatomy code
s=re.sub(r"/\* ===== anatomy START.*?/\* ===== anatomy END ===== \*/\n?","",s,flags=re.S)
s=s.replace("function injView(){",js+"function injView(){",1)
# 2 call inside the injury page
call='${anatBox(i)}'
if call not in s:
    a='<p class="muted" style="margin-top:6px;max-width:65ch">${esc(i.what)}</p>'
    assert s.count(a)==1; s=s.replace(a,a+"\n "+call,1)
# 3 styles
css='''<style id="anat-css">
.anat .anatgrid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:14px;align-items:start;margin-top:12px}
.anatfig{margin:0;padding:12px;background:#FAFCFD}.anatsvg{width:100%;height:auto;display:block}
.anatsvg .anatlab text{font:600 11px var(--body,system-ui);fill:#1A4264}.anatsvg .anatlab text.side{font-size:10px;fill:#6B8296;font-weight:700;letter-spacing:.04em}
.anatfig figcaption{font-size:.78rem;color:#56708A;margin-top:6px}
.anattxt{display:grid;gap:14px}.anattxt p{margin:4px 0 0}
.gradegrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px;margin-top:14px}
.grade h3{margin:8px 0 4px;font-size:1rem}.grade p{margin:0;font-size:.93rem}
.gbar{display:block;height:7px;border-radius:999px;background:var(--line)}.gbar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#F2B33D,#D9711F,#D7261E)}
.g0 .gbar i{background:#F2B33D}.g1 .gbar i{background:linear-gradient(90deg,#F2B33D,#D9711F)}
.musbox{margin-top:14px}.musgrid{display:grid;grid-template-columns:minmax(150px,230px) minmax(0,1fr);gap:16px;align-items:center;margin-top:8px}
.bodymap{width:100%;height:auto}.bodymap text{font:700 10px var(--body,system-ui);fill:var(--muted)}
.muslist{list-style:none;padding:0;margin:0;display:grid;gap:8px}.muslist li{display:grid;gap:2px;padding:10px 12px;border-radius:12px;background:var(--bg);border-left:4px solid #D9711F}
.muslist li span{font-size:.92rem;color:var(--muted)}
.gtypes{margin-top:10px;background:linear-gradient(135deg,rgba(0,151,178,.08),rgba(217,113,31,.08))}.gtrow{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.chipbtn{border:1.5px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:6px 12px;font:700 .85rem var(--body,system-ui);cursor:pointer}
.chipbtn.on{background:#1A4264;color:#fff;border-color:#1A4264}
@media (max-width:760px){.anat .anatgrid{grid-template-columns:1fr}.musgrid{grid-template-columns:1fr}.bodymap{max-width:260px;margin:0 auto;display:block}}
</style>
'''
s=re.sub(r'<style id="anat-css">.*?</style>\n?','',s,flags=re.S)
s=s.replace("</head>",css+"</head>",1)
# 4 new groin injuries
NEW=open(os.path.join(ROOT,"tools","rehab_groin_inj.js"),encoding="utf-8").read().strip()
s=re.sub(r"/\* new groin injuries START \*/.*?/\* new groin injuries END \*/\n",'',s,flags=re.S)
a='{id:"lbp",name:"Lower back pain"'
assert s.count(a)==1
s=s.replace(a,"/* new groin injuries START */\n"+NEW+"\n/* new groin injuries END */\n"+a,1)
open(p,"w",encoding="utf-8").write(s);print("anatomy injected")

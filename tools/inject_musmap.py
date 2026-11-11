#!/usr/bin/env python3
"""Adds the front/back target-muscle map to the exercise dialog in rehab/index.html. Safe to re-run."""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from musclemap import js_bundle
CSS = ".musbox2{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:12px;align-items:center;background:var(--bg,#F4F7F9);border-radius:14px;padding:10px}.musmap{width:100%;height:auto;display:block;max-height:300px}.muslegend p{margin:4px 0;font-size:.92rem}.muslegend i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;vertical-align:-1px}@media (max-width:520px){.musbox2{grid-template-columns:1fr}}"
p = os.path.join(ROOT, "rehab", "index.html"); s = open(p, encoding="utf-8").read()
s = re.sub(r"/\* ===== musmap START.*?/\* ===== musmap END ===== \*/\n?", "", s, flags=re.S)
s = s.replace("function injView(){", "/* ===== musmap START ===== */\n" + js_bundle() + "/* ===== musmap END ===== */\nfunction injView(){", 1)
call = '${musMap(id,"en")}'
if call not in s:
    a = """  <p class="cue" style="margin:0"><b>Coach's tip:</b>"""
    assert s.count(a) == 1
    s = s.replace(a, "  " + call + "\n" + a, 1)
s = re.sub(r'<style id="mus-css">.*?</style>', "", s, flags=re.S)
s = s.replace("</head>", f'<style id="mus-css">{CSS}</style>\n</head>', 1)
open(p, "w", encoding="utf-8").write(s)
print("musmap injected")

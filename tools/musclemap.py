"""Front/back muscle map (primary muscles red, secondary blue) used on the exercise pages and in the apps.
Shapes are drawn for the figure's right half (x > 100) and mirrored; 'C' shapes are centred and not mirrored."""
import json, os

# base body (light grey), right halves
BASE_F = ["M100 56Q124 56 134 64L132 100Q127 150 127 172Q116 184 100 186Z",
          "M132 64Q153 68 155 100L155 140Q151 150 140 150L135 104Z",
          "M140 146Q157 152 159 178L155 212H141Q138 182 140 146Z",
          "M100 180Q129 172 139 190Q141 240 135 274H103Q99 230 100 180Z",
          "M104 272H135Q137 320 131 360H114Q110 320 104 272Z",
          "M112 356H134Q141 370 137 380H110Z"]
BASE_B = BASE_F
HEAD = '<ellipse cx="100" cy="28" rx="16" ry="20"/><path d="M92 44h16l2 16h-20z"/><ellipse cx="148" cy="224" rx="7" ry="12"/><ellipse cx="52" cy="224" rx="7" ry="12"/>'

FRONT = {
 "neck": ["M94 48L100 62L97 64L91 50Z"],
 "traps": ["M106 57Q120 58 132 65L128 70Q116 64 105 62Z"],
 "delts": ["M132 66Q147 66 151 83Q151 97 144 104Q138 90 128 78Z"],
 "chest": ["M102 66Q120 64 129 72Q136 86 128 98Q114 104 102 98Z"],
 "biceps": ["M144 106Q152 114 152 130Q150 142 145 146Q138 132 138 116Z"],
 "forearms": ["M144 149Q154 156 156 176Q155 196 151 208H143Q140 186 140 166Z"],
 "abs": ["M102 102H115Q118 140 114 168L102 172Z"],
 "obliques": ["M118 104Q130 108 131 130Q130 150 121 166L117 164Q121 140 118 104Z"],
 "diaphragm": ["M101 99Q116 99 127 106L125 111Q114 105 101 105Z"],
 "hipflex": ["M106 172Q118 170 126 176L119 192Q110 186 104 180Z"],
 "adductors": ["M102 188Q110 190 114 200L108 242Q102 238 101 220Z"],
 "quads": ["M118 182Q134 184 136 206Q138 236 132 262Q124 270 116 262Q112 236 114 204Z"],
 "tibialis": ["M119 282Q127 280 129 300Q129 330 125 352H120Q117 320 117 300Z"],
 "calves": ["M128 284Q135 292 135 312L130 332Z"],
 "feet": ["M115 362H132Q137 371 134 377H114Z"],
}
FRONT_C = {"head": ['<ellipse cx="100" cy="28" rx="16" ry="20"/>'], "pelvic": ['<ellipse cx="100" cy="182" rx="8" ry="5"/>']}
BACK = {
 "neck": ["M96 44L104 44L106 56L100 58Z"],
 "upperback": ["M103 76L116 78L114 102L103 108Z"],
 "cuff": ["M118 78Q130 76 133 84L127 99Q120 97 116 90Z"],
 "traps": ["M100 48L106 50Q118 58 132 64L118 70Q108 74 106 86L102 116H100Z"],
 "delts": ["M132 66Q148 68 152 86Q149 98 143 103Q138 88 128 78Z"],
 "lats": ["M110 102Q124 98 132 104Q132 130 121 156L109 150Q106 124 110 102Z"],
 "triceps": ["M143 104Q153 110 155 127Q153 141 146 147Q138 132 138 116Z"],
 "forearms": ["M144 149Q154 156 156 176Q155 196 151 208H143Q140 186 140 166Z"],
 "lowback": ["M101 118L107 114Q112 140 112 168L101 172Z"],
 "gmed": ["M114 166Q128 166 132 178L125 186Q116 181 112 174Z"],
 "glutes": ["M101 176Q115 172 128 182Q134 200 124 212Q110 216 101 210Z"],
 "adductors": ["M101 214L107 216L106 240L101 238Z"],
 "hamstrings": ["M108 218Q122 216 133 222Q135 246 129 268H113Q106 244 108 218Z"],
 "calves": ["M110 280Q126 276 132 290Q134 312 126 332H116Q108 312 110 280Z"],
 "feet": ["M115 364H130V378H115Z"],
}
BACK_C = {"head": ['<ellipse cx="100" cy="28" rx="16" ry="20"/>']}

NAMES = {
 "en": {"neck": "Neck", "traps": "Trapezius", "delts": "Shoulders (deltoids)", "chest": "Chest", "biceps": "Biceps", "triceps": "Triceps",
        "forearms": "Forearms & grip", "abs": "Abdominals", "obliques": "Obliques (side of waist)", "diaphragm": "Diaphragm (breathing muscle)",
        "hipflex": "Hip flexors", "adductors": "Adductors (inner thigh)", "quads": "Quadriceps", "tibialis": "Shin (tibialis)", "calves": "Calves",
        "feet": "Foot muscles", "upperback": "Upper back (rhomboids)", "cuff": "Rotator cuff", "lats": "Lats", "lowback": "Lower back",
        "gmed": "Side hip (gluteus medius)", "glutes": "Glutes", "hamstrings": "Hamstrings", "head": "Scalp, face & eyes", "pelvic": "Pelvic floor",
        "primary": "Main muscles", "secondary": "Also working", "front": "Front", "back": "Back", "title": "Target muscles"},
 "uz": {"neck": "Bo‘yin", "traps": "Trapetsiyasimon mushak", "delts": "Yelkalar (deltasimon)", "chest": "Ko‘krak", "biceps": "Biseps", "triceps": "Triseps",
        "forearms": "Bilak va ushlash", "abs": "Qorin mushaklari", "obliques": "Qiya mushaklar (bel yoni)", "diaphragm": "Diafragma (nafas mushagi)",
        "hipflex": "Son bukuvchilari", "adductors": "Yaqinlashtiruvchilar (son ichi)", "quads": "To‘rt boshli mushak", "tibialis": "Boldir old mushagi", "calves": "Boldir",
        "feet": "Oyoq panjasi mushaklari", "upperback": "Yuqori orqa (romboid)", "cuff": "Rotator manjet", "lats": "Keng orqa mushaklari", "lowback": "Bel",
        "gmed": "Son yoni (o‘rta dumba)", "glutes": "Dumba", "hamstrings": "Son orqa mushaklari", "head": "Bosh terisi, yuz va ko‘z", "pelvic": "Chanoq tubi",
        "primary": "Asosiy mushaklar", "secondary": "Yordamchi mushaklar", "front": "Old", "back": "Orqa", "title": "Ishlaydigan mushaklar"},
 "ru": {"neck": "Шея", "traps": "Трапециевидная", "delts": "Плечи (дельты)", "chest": "Грудь", "biceps": "Бицепс", "triceps": "Трицепс",
        "forearms": "Предплечья и хват", "abs": "Пресс", "obliques": "Косые мышцы живота", "diaphragm": "Диафрагма (дыхательная мышца)",
        "hipflex": "Сгибатели бедра", "adductors": "Приводящие (внутренняя поверхность бедра)", "quads": "Квадрицепс", "tibialis": "Передняя мышца голени", "calves": "Икры",
        "feet": "Мышцы стопы", "upperback": "Верх спины (ромбовидные)", "cuff": "Вращательная манжета", "lats": "Широчайшие", "lowback": "Поясница",
        "gmed": "Боковая часть бедра (средняя ягодичная)", "glutes": "Ягодицы", "hamstrings": "Задняя поверхность бедра", "head": "Кожа головы, лицо и глаза", "pelvic": "Мышцы тазового дна",
        "primary": "Основные мышцы", "secondary": "Также работают", "front": "Спереди", "back": "Сзади", "title": "Целевые мышцы"},
}
MUS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "muscles.json"), encoding="utf-8"))
COL = {"p": "#D94A3D", "s": "#4F8EC9", "o": "#CDD7DF"}

def _fig(shapes, centred, prim, sec, dx):
    out = [f'<g transform="translate({dx} 0)">', '<g class="mb">']
    for d in BASE_F:
        out.append(f'<path d="{d}"/><path d="{d}" transform="matrix(-1 0 0 1 200 0)"/>')
    out.append(HEAD + "</g>")
    for k, ds in shapes.items():
        c = COL["p"] if k in prim else COL["s"] if k in sec else COL["o"]
        for d in ds:
            out.append(f'<path d="{d}" fill="{c}"/><path d="{d}" fill="{c}" transform="matrix(-1 0 0 1 200 0)"/>')
    for k, els in centred.items():
        if k in prim or k in sec:
            c = COL["p"] if k in prim else COL["s"]
            out += [el.replace("/>", f' fill="{c}"/>') for el in els]
    out.append("</g>")
    return "".join(out)

def muscle_svg(ex_id, L="en", cls="musmap"):
    if ex_id not in MUS:
        return ""
    prim, sec = MUS[ex_id]
    n = NAMES[L]
    lab = f'{n["title"]}: ' + ", ".join(n[k] for k in prim + sec)
    return (f'<svg class="{cls}" viewBox="0 0 420 400" role="img" aria-label="{lab}"><style>.mb path,.mb ellipse{{fill:#E9EEF2;stroke:#C3CFD8;stroke-width:1.2}}'
            f'.musmap text{{font:600 13px system-ui,sans-serif;fill:#6B7F8E}}</style>'
            + _fig(FRONT, FRONT_C, prim, sec, 0) + _fig(BACK, BACK_C, prim, sec, 220)
            + f'<text x="100" y="396" text-anchor="middle">{n["front"]}</text><text x="320" y="396" text-anchor="middle">{n["back"]}</text></svg>')

def muscle_list(ex_id, L="en"):
    if ex_id not in MUS:
        return ""
    prim, sec = MUS[ex_id]
    n = NAMES[L]
    h = f'<div class="muslegend"><p><i style="background:{COL["p"]}"></i><b>{n["primary"]}:</b> {", ".join(n[k] for k in prim)}</p>'
    if sec:
        h += f'<p><i style="background:{COL["s"]}"></i><b>{n["secondary"]}:</b> {", ".join(n[k] for k in sec)}</p>'
    return h + "</div>"

def js_bundle():
    """Compact data + renderer for the apps (same drawing as muscle_svg)."""
    data = {"BF": BASE_F, "F": FRONT, "FC": FRONT_C, "B": BACK, "BC": BACK_C, "H": HEAD, "N": NAMES, "M": {k: v for k, v in MUS.items() if not k.startswith("_")}, "C": COL}
    return ("const MUSMAP=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n" + r"""
function musFig(sh,cs,p,s,dx){const M=MUSMAP,mir=d=>`<path d="${d}" transform="matrix(-1 0 0 1 200 0)"`;let o=`<g transform="translate(${dx} 0)"><g class="mb">`;
 M.BF.forEach(d=>o+=`<path d="${d}"/>${mir(d)}/>`);o+=M.H+"</g>";
 for(const k in sh){const c=p.includes(k)?M.C.p:s.includes(k)?M.C.s:M.C.o;sh[k].forEach(d=>o+=`<path d="${d}" fill="${c}"/>${mir(d)} fill="${c}"/>`)}
 for(const k in cs)if(p.includes(k)||s.includes(k)){const c=p.includes(k)?M.C.p:M.C.s;cs[k].forEach(e=>o+=e.replace("/>",` fill="${c}"/>`))}
 return o+"</g>"}
function musMap(id,L){const M=MUSMAP,x=M.M[id];if(!x)return"";const n=M.N[L]||M.N.en,[p,s]=x;
 return `<div class="musbox2"><svg class="musmap" viewBox="0 0 420 400" role="img" aria-label="${n.title}"><style>.mb path,.mb ellipse{fill:#E9EEF2;stroke:#C3CFD8;stroke-width:1.2}.musmap text{font:600 13px system-ui,sans-serif;fill:#6B7F8E}</style>${musFig(M.F,M.FC,p,s,0)}${musFig(M.B,M.BC,p,s,220)}<text x="100" y="396" text-anchor="middle">${n.front}</text><text x="320" y="396" text-anchor="middle">${n.back}</text></svg>
 <div class="muslegend"><p><i style="background:${M.C.p}"></i><b>${n.primary}:</b> ${p.map(k=>n[k]).join(", ")}</p>${s.length?`<p><i style="background:${M.C.s}"></i><b>${n.secondary}:</b> ${s.map(k=>n[k]).join(", ")}</p>`:""}</div></div>`}
""")

if __name__ == "__main__":
    import sys
    open(sys.argv[1] if len(sys.argv) > 1 else "/dev/stdout", "w").write("<html><body style='background:#fff'>" + "".join(
        f"<div style='display:inline-block;width:420px'><b>{k}</b>{muscle_svg(k)}{muscle_list(k)}</div>" for k in ["squat", "pushup", "nordic", "band_row", "copenhagen", "scalp_massage", "side_plank", "kegel"]) + "</body></html>")

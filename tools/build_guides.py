#!/usr/bin/env python3
"""Builds the injury guide pages in English, Uzbek and Russian from the Rehab app's own plans.

Input:  tools/rehab-data.json          snapshot of the app's INJ, EX, EVID ... objects
        tools/i18n/uz.json, ru.json     English text -> translation (built from tools/i18n/c*.json)
Output: rehab/guides/                   English hub + one page per injury
        rehab/guides/uz/, rehab/guides/ru/   the same in Uzbek and Russian
        sitemap.xml                     guide URLs refreshed
Run:    python3 tools/build_guides.py
"""
import json, os, html, datetime, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.ikjon-gearbox.com"
D = json.load(open(os.path.join(ROOT, "tools", "rehab-data.json"), encoding="utf-8"))
INJ, EX, EVID, REG = D["INJ"], D["EX"], D["EVID"], D["REG"]
TR = {"en": {}}
for _L in ("uz", "ru"):
    TR[_L] = json.load(open(os.path.join(ROOT, "tools", "i18n", f"{_L}.json"), encoding="utf-8"))
TODAY = datetime.date.today()
LANGS = ["en", "uz", "ru"]

# Search-friendly address (shared by all languages) and English title per injury.
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

MONTHS = {
 "en": "January February March April May June July August September October November December".split(),
 "uz": "yanvar fevral mart aprel may iyun iyul avgust sentabr oktabr noyabr dekabr".split(),
 "ru": "январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь".split(),
}

# Interface text. {x} placeholders are filled in code.
UI = {
 "en": dict(
   app="Open the free app", crumbs="Injury rehab guides",
   h1="{name}: rehab exercises &amp; recovery plan", title="{seo} | IKJON",
   desc="Free phase-by-phase {short} rehab plan: {stages} stages, {nex} exercises with how-to steps and photos, recovery timeline and warning signs. Evidence-based.",
   meta="Common in: {sport} · Body area: {region} · Updated {month}",
   edu="<b>Education, not diagnosis.</b> This guide explains how this injury is usually rehabilitated. It cannot tell you what injury you have — see a doctor or physiotherapist to confirm it, especially after a fall, a pop or surgery.",
   cta1="<b>Follow this plan day by day — free.</b> The IKJON app turns it into a calendar with animated demos, timers and a pain diary. No account, no ads.",
   cta1btn="Start the {short} plan", app_lang="",
   signs="Typical signs", flags="See a doctor first if you have any of these",
   howlong="How long does recovery take?", howlong_p="It depends on how serious the injury is. These are typical plan lengths:",
   th=("Severity", "Usual description", "Typical plan"), days="{d} days ({w})",
   wk="about {n} weeks", mo="about {n} months",
   plan="The rehab plan, stage by stage", plan_p="Move to the next stage only when you meet its “move on when” checks — not just because the weeks have passed.",
   stage="Stage {k}", goal="Goal:", moveon="Move on when:", tip="Tip:", important="Important:",
   research="What the research says", evid="Strength of evidence:", sources="Sources:",
   faq="Common questions",
   q1="How long does {short} take to heal?", a1="It depends on severity. {list} Move on by meeting each stage's checks, not by the calendar alone.", a1item="{l}: about {d} days ({w}).",
   q2="When should I see a doctor?", a2f="See a doctor or physiotherapist to confirm the injury, and get help urgently if you notice: {flags}.", a2="See a doctor or physiotherapist to confirm the injury and if pain gets worse instead of better.",
   q3="Should exercises hurt?", a3="Mild discomfort up to about 3–4 out of 10 that settles within 24 hours is usually acceptable. Stop if pain is sharp, goes above 5 out of 10, or swelling increases afterwards.",
   cta2="<b>Ready to start?</b> Open the plan in the IKJON app and it guides you day by day, with demos for every exercise.", cta2btn="Start the plan free",
   more="More {region} guides", card="Exercises &amp; recovery plan", alt="{name} exercise",
   f_all="All injury guides", f_app="IKJON Joint Rehab app", f_priv="Privacy", f_terms="Terms",
   f_edu="General exercise education only. IKJON Joint Rehab is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. In an emergency call your local emergency number (103 in Uzbekistan).",
   f_copy="Exercise photos: Free Exercise DB (public domain). © 2026 IKJON Consulting &amp; Education Centre. All rights reserved. IKJON™ is a trademark of IKJON Consulting &amp; Education Centre.",
   hub_title="Sports Injury Rehab Exercises: Free Recovery Plans | IKJON",
   hub_desc="Free, evidence-based rehab plans for {n} common sports and joint injuries — knee, ankle, back, shoulder and more. Stage-by-stage exercises with photos.",
   hub_h1="Injury rehab exercises &amp; recovery plans",
   hub_lede="Free, stage-by-stage plans for {n} common sports and everyday injuries, built from published research and sports-medicine guidelines. Each guide shows the exercises, how to do them, how long recovery usually takes and the warning signs that mean you should see a doctor.",
   hub_cta="<b>Not sure which plan fits?</b> The app’s “Find your plan” asks a few questions and suggests plans to look at.", hub_ctabtn="Find your plan",
   hub_edu="<b>Education, not diagnosis.</b> These guides cannot tell you what injury you have. See a doctor or physiotherapist to confirm it.",
   unit_min="min", unit_s="s", translated=""),
 "uz": dict(
   app="Bepul ilovani ochish", crumbs="Jarohatdan tiklanish qo‘llanmalari",
   h1="{name}: reabilitatsiya mashqlari va tiklanish rejasi", title="{name}: mashqlar va tiklanish rejasi | IKJON",
   desc="{short} uchun bepul bosqichma-bosqich reabilitatsiya rejasi: {stages} bosqich, {nex} ta mashq, bajarish tartibi, rasmlar, tiklanish muddati va xavfli belgilar.",
   meta="Ko‘p uchraydi: {sport} · Tana qismi: {region} · Yangilangan: {month}",
   edu="<b>Bu ta’lim, tashxis emas.</b> Bu qo‘llanma ushbu jarohat odatda qanday tiklanishini tushuntiradi. U sizda qanday jarohat borligini ayta olmaydi — ayniqsa yiqilish, «chirs» etgan ovoz yoki operatsiyadan keyin buni shifokor yoki fizioterapevt tasdiqlashi kerak.",
   cta1="<b>Bu rejaga kunma-kun amal qiling — bepul.</b> IKJON ilovasi uni animatsion namunalar, taymerlar va og‘riq kundaligi bilan kalendarga aylantiradi. Ro‘yxatdan o‘tish va reklama yo‘q.",
   cta1btn="Rejani boshlash", app_lang="Ilova hozircha ingliz tilida.",
   signs="Odatiy belgilar", flags="Quyidagilardan biri bo‘lsa, avval shifokorga boring",
   howlong="Tiklanish qancha davom etadi?", howlong_p="Bu jarohat qanchalik jiddiyligiga bog‘liq. Odatiy reja muddatlari:",
   th=("Og‘irligi", "Odatiy tavsif", "Odatiy reja"), days="{d} kun ({w})",
   wk="taxminan {n} hafta", mo="taxminan {n} oy",
   plan="Reabilitatsiya rejasi bosqichma-bosqich", plan_p="Keyingi bosqichga haftalar o‘tgani uchun emas, «o‘tish shartlari» bajarilgandagina o‘ting.",
   stage="{k}-bosqich", goal="Maqsad:", moveon="Keyingi bosqichga o‘tish sharti:", tip="Maslahat:", important="Muhim:",
   research="Tadqiqotlar nima deydi", evid="Dalillar kuchi:", sources="Manbalar:",
   faq="Ko‘p beriladigan savollar",
   q1="{short} qancha vaqtda tuzaladi?", a1="Bu og‘irligiga bog‘liq. {list} Keyingi bosqichga faqat kalendarga qarab emas, har bir bosqich shartlarini bajarib o‘ting.", a1item="{l}: taxminan {d} kun ({w}).",
   q2="Qachon shifokorga borish kerak?", a2f="Jarohatni tasdiqlash uchun shifokor yoki fizioterapevtga boring, quyidagilarni sezsangiz esa zudlik bilan yordam oling: {flags}.", a2="Jarohatni tasdiqlash uchun, shuningdek og‘riq kamayish o‘rniga kuchaysa, shifokor yoki fizioterapevtga boring.",
   q3="Mashqlar og‘riq berishi kerakmi?", a3="24 soat ichida o‘tib ketadigan 10 balldan taxminan 3–4 gacha yengil noqulaylik odatda maqbul. Og‘riq o‘tkir bo‘lsa, 10 dan 5 dan oshsa yoki keyin shish kuchaysa, to‘xtating.",
   cta2="<b>Boshlashga tayyormisiz?</b> Rejani IKJON ilovasida oching — u har bir mashq namunasi bilan sizni kunma-kun boshqaradi.", cta2btn="Rejani bepul boshlash",
   more="{region}: boshqa qo‘llanmalar", card="Mashqlar va tiklanish rejasi", alt="{name} mashqi",
   f_all="Barcha qo‘llanmalar", f_app="IKJON Joint Rehab ilovasi", f_priv="Maxfiylik", f_terms="Shartlar",
   f_edu="Faqat umumiy jismoniy mashqlar haqida ma’lumot. IKJON Joint Rehab tibbiy vosita emas va hech qanday kasallikni tashxislamaydi, davolamaydi yoki oldini olmaydi. Favqulodda holatda 103 ga qo‘ng‘iroq qiling.",
   f_copy="Mashq rasmlari: Free Exercise DB (ommaviy mulk). © 2026 IKJON Consulting &amp; Education Centre. Barcha huquqlar himoyalangan. IKJON™ — IKJON Consulting &amp; Education Centre savdo belgisi.",
   hub_title="Sport jarohatlaridan tiklanish mashqlari: bepul rejalar | IKJON",
   hub_desc="{n} ta keng tarqalgan sport va bo‘g‘im jarohatlari uchun bepul, ilmiy asoslangan reabilitatsiya rejalari — tizza, to‘piq, bel, yelka va boshqalar.",
   hub_h1="Jarohatdan tiklanish mashqlari va rejalari",
   hub_lede="{n} ta keng tarqalgan sport va maishiy jarohatlar uchun bepul, bosqichma-bosqich rejalar; ular ilmiy tadqiqotlar va sport tibbiyoti tavsiyalariga asoslangan. Har bir qo‘llanmada mashqlar, ularni bajarish tartibi, tiklanish muddati va shifokorga borish kerakligini bildiruvchi xavfli belgilar bor.",
   hub_cta="<b>Qaysi reja mos kelishini bilmayapsizmi?</b> Ilovadagi «Find your plan» bir necha savol berib, mos rejalarni taklif qiladi.", hub_ctabtn="Rejamni topish",
   hub_edu="<b>Bu ta’lim, tashxis emas.</b> Bu qo‘llanmalar sizda qanday jarohat borligini ayta olmaydi. Buni shifokor yoki fizioterapevt tasdiqlashi kerak.",
   unit_min="daqiqa", unit_s="s", translated="Matn ingliz tilidan tarjima qilingan."),
 "ru": dict(
   app="Открыть бесплатное приложение", crumbs="Реабилитация после травм",
   h1="{name}: упражнения и план реабилитации", title="{name}: упражнения и план восстановления | IKJON",
   desc="Бесплатный поэтапный план реабилитации ({short}): этапов — {stages}, упражнений — {nex}, с техникой, фото, сроками восстановления и тревожными признаками.",
   meta="Чаще всего: {sport} · Область: {region} · Обновлено: {month}",
   edu="<b>Это обучение, а не диагноз.</b> Это руководство объясняет, как обычно проходит реабилитация при этой травме. Оно не может сказать, какая у вас травма, — подтвердите её у врача или физиотерапевта, особенно после падения, хруста или операции.",
   cta1="<b>Следуйте этому плану день за днём — бесплатно.</b> Приложение IKJON превращает его в календарь с анимированными демонстрациями, таймерами и дневником боли. Без регистрации и рекламы.",
   cta1btn="Начать план", app_lang="Приложение пока на английском языке.",
   signs="Типичные признаки", flags="Сначала обратитесь к врачу, если есть что-то из этого",
   howlong="Сколько длится восстановление?", howlong_p="Это зависит от тяжести травмы. Типичная длительность плана:",
   th=("Тяжесть", "Обычное описание", "Типичный план"), days="{d} дн. ({w})",
   wk="около {n} нед.", mo="около {n} мес.",
   plan="План реабилитации по этапам", plan_p="Переходите к следующему этапу, только когда выполнены его условия, а не просто потому, что прошли недели.",
   stage="Этап {k}", goal="Цель:", moveon="Можно переходить дальше, когда:", tip="Совет:", important="Важно:",
   research="Что говорят исследования", evid="Сила доказательств:", sources="Источники:",
   faq="Частые вопросы",
   q1="Сколько длится заживление ({short})?", a1="Зависит от тяжести. {list} Переходите дальше, выполняя условия каждого этапа, а не только по календарю.", a1item="{l}: около {d} дн. ({w}).",
   q2="Когда нужно к врачу?", a2f="Обратитесь к врачу или физиотерапевту, чтобы подтвердить травму, и срочно за помощью, если заметите: {flags}.", a2="Обратитесь к врачу или физиотерапевту, чтобы подтвердить травму, а также если боль усиливается, а не уменьшается.",
   q3="Должны ли упражнения вызывать боль?", a3="Лёгкий дискомфорт примерно до 3–4 из 10, который проходит за 24 часа, обычно допустим. Остановитесь, если боль острая, выше 5 из 10 или после занятий нарастает отёк.",
   cta2="<b>Готовы начать?</b> Откройте план в приложении IKJON — оно ведёт вас день за днём, с демонстрацией каждого упражнения.", cta2btn="Начать план бесплатно",
   more="Ещё руководства: {region}", card="Упражнения и план восстановления", alt="Упражнение «{name}»",
   f_all="Все руководства", f_app="Приложение IKJON Joint Rehab", f_priv="Конфиденциальность", f_terms="Условия",
   f_edu="Только общая информация об упражнениях. IKJON Joint Rehab не является медицинским изделием и не диагностирует, не лечит и не предотвращает заболевания. В экстренной ситуации звоните 103.",
   f_copy="Фото упражнений: Free Exercise DB (общественное достояние). © 2026 IKJON Consulting &amp; Education Centre. Все права защищены. IKJON™ — товарный знак IKJON Consulting &amp; Education Centre.",
   hub_title="Упражнения после спортивных травм: бесплатные планы восстановления | IKJON",
   hub_desc="Бесплатные научно обоснованные планы реабилитации при {n} частых спортивных травмах и болях в суставах — колено, голеностоп, спина, плечо и другое.",
   hub_h1="Упражнения и планы восстановления после травм",
   hub_lede="Бесплатные поэтапные планы при {n} частых спортивных и бытовых травмах, основанные на опубликованных исследованиях и рекомендациях спортивной медицины. В каждом руководстве — упражнения, техника выполнения, сроки восстановления и тревожные признаки, при которых нужно к врачу.",
   hub_cta="<b>Не знаете, какой план подходит?</b> Раздел «Find your plan» в приложении задаст несколько вопросов и предложит подходящие планы.", hub_ctabtn="Подобрать план",
   hub_edu="<b>Это обучение, а не диагноз.</b> Эти руководства не могут сказать, какая у вас травма. Подтвердите её у врача или физиотерапевта.",
   unit_min="мин", unit_s="с", translated="Текст переведён с английского."),
}

e = lambda s: html.escape(str(s if s is not None else ""), quote=True)

def t(s, L):
    """Translate a piece of app text into language L (falls back to English)."""
    if L == "en" or s is None:
        return s
    return TR[L].get(s, s)

def base(L):
    return "/rehab/guides/" if L == "en" else f"/rehab/guides/{L}/"

def url(L, slug=None):
    return SITE + base(L) + (f"{slug}/" if slug else "")

def ex(id_):
    a = EX[id_]
    return {"name": a[0], "region": a[1], "target": a[2], "steps": a[3], "tip": a[4], "type": a[6], "id": id_}

def fmt_t(sec, L):
    u = UI[L]
    if sec >= 60:
        m = sec / 60
        return f"{int(m) if m == int(m) else round(m, 1)} {u['unit_min']}"
    return f"{sec} {u['unit_s']}"

def dose(x, L):
    if x.get("t"):
        return (f'{x["s"]} × ' if x.get("s", 1) > 1 else "") + fmt_t(x["t"], L)
    return f'{x["s"]} × {x["r"]}'

def span(days, L):
    u = UI[L]
    return u["mo"].format(n=days // 30) if days >= 84 else u["wk"].format(n=round(days / 7))

def short(i, L):
    return t(i["name"], L).split(" (")[0].split(" / ")[0]

def photo(id_, alt):
    if os.path.exists(os.path.join(ROOT, "rehab", "img", f"{id_}-0.jpg")):
        return f'<img src="/rehab/img/{id_}-0.jpg" alt="{e(alt)}" width="420" height="280" loading="lazy">'
    return ""

CSS = """:root{--bg:#F3F7F8;--fg:#1A4264;--mut:#56708A;--tint:#E3F2F5;--card:#fff;--line:#d5e2e8;--band:#1A4264;--teal:#0097B2;--orange:#D9711F;--bad:#B3261E;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#0E1A24;--fg:#E4EEF3;--mut:#9AB2C2;--tint:#123544;--card:#132331;--line:#24394a;--band:#10283D;--teal:#2DB7D1;--orange:#EE8A3C;--bad:#F2B8B5;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.6 Calibri,"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
header{background:var(--band);border-bottom:3px solid var(--teal);padding:10px 16px}
header .in{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
header a{color:#fff;text-decoration:none}.logo{display:inline-flex;align-items:center;gap:10px;font-family:Georgia,serif;letter-spacing:.2em;font-size:1.15rem}.logo img{height:34px;width:auto}
.hr{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.langs{display:flex;gap:2px;background:rgba(255,255,255,.12);border-radius:999px;padding:2px}.langs a{padding:4px 9px;border-radius:999px;font-size:.82rem;font-weight:700}.langs a[aria-current]{background:#fff;color:#1A4264}
.top-cta{background:var(--orange);padding:7px 14px;border-radius:999px;font-weight:700;font-size:.9rem;white-space:nowrap}
main{max-width:860px;margin:0 auto;padding:18px 16px 48px}
nav.crumbs{font-size:.88rem;color:var(--mut);margin-bottom:6px}nav.crumbs a{color:inherit}
h1,h2,h3{font-family:Georgia,serif;line-height:1.25}h1{font-size:clamp(1.6rem,5vw,2.3rem);margin:.2em 0 .3em;text-wrap:balance}h2{font-size:1.35rem;margin:34px 0 10px}h3{font-size:1.1rem;margin:0 0 4px}
.lede{font-size:1.08rem}.muted{color:var(--mut)}.small{font-size:.88rem}
.note{background:var(--tint);border-radius:14px;padding:12px 14px;font-size:.95rem}
.warn{border:2px solid var(--bad);border-radius:14px;padding:12px 16px}.warn h2{margin-top:0;color:var(--bad);font-size:1.15rem}
.cta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--card);border:2px solid var(--orange);border-radius:16px;padding:16px;margin:22px 0}
.cta p{margin:0;flex:1 1 260px}.btn{display:inline-block;background:var(--orange);color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:12px}
.tbl{overflow-x:auto}table{width:100%;border-collapse:collapse;background:var(--card);border-radius:12px;overflow:hidden;font-size:.95rem}th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{background:var(--tint)}
.phase{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin:14px 0}
.phase .when{color:var(--teal);font-weight:700;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em}
ol.exs{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:12px}
ol.exs>li{display:grid;grid-template-columns:120px minmax(0,1fr);gap:12px;border-top:1px solid var(--line);padding-top:12px}
ol.exs>li.nophoto{grid-template-columns:minmax(0,1fr)}ol.exs>li>img{width:120px;height:80px;object-fit:cover;border-radius:10px}
.dose{display:inline-block;background:var(--tint);border-radius:999px;padding:1px 10px;font-weight:700;font-size:.88rem;margin-left:6px;white-space:nowrap}
.steps{margin:6px 0 0;padding-left:20px;font-size:.95rem;display:block}.steps li{display:list-item;border:0;padding:0;margin:2px 0}.exit{margin:12px 0 0;font-size:.95rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.card{display:block;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;color:inherit;text-decoration:none}.card:hover{border-color:var(--teal)}
.card b{display:block;font-family:Georgia,serif;font-size:1.05rem}.card span{color:var(--mut);font-size:.9rem}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:8px 0}summary{font-weight:700;cursor:pointer}
footer{color:var(--mut);font-size:.85rem;text-align:center;padding:0 16px 32px;max-width:860px;margin:0 auto}footer a{color:inherit}
@media (max-width:480px){ol.exs>li{grid-template-columns:88px minmax(0,1fr)}ol.exs>li.nophoto{grid-template-columns:minmax(0,1fr)}ol.exs>li>img{width:88px;height:64px}.top-cta{font-size:.8rem;padding:6px 11px}}"""

CSP = "default-src 'self'; style-src 'unsafe-inline'; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"
OG_LOCALE = {"en": "en_GB", "uz": "uz_UZ", "ru": "ru_RU"}

def page(L, title, desc, slug, body, ld):
    u = UI[L]
    canon = url(L, slug)
    alts = "".join(f'<link rel="alternate" hreflang="{x}" href="{url(x, slug)}">' for x in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{url("en", slug)}">'
    tail = f"{slug}/" if slug else ""
    switch = "".join(f'<a href="{base(x)}{tail}" hreflang="{x}" lang="{x}"' + (' aria-current="true"' if x == L else "") + f'>{x.upper()}</a>' for x in LANGS)
    trans = f"<p>{u['translated']}</p>" if u["translated"] else ""
    return f"""<!doctype html>
<html lang="{L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{CSP}"><meta name="referrer" content="strict-origin-when-cross-origin">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canon}">{alts}<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{canon}"><meta property="og:site_name" content="IKJON"><meta property="og:locale" content="{OG_LOCALE[L]}">
<link rel="icon" href="/rehab/icons/favicon-48.png"><link rel="apple-touch-icon" href="/rehab/icons/apple-touch-icon.png">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
<style>{CSS}</style></head>
<body><header><div class="in"><a class="logo" href="/"><img src="/rehab/brand/mark-white.png" alt="" width="46" height="34">IKJON</a><div class="hr"><nav class="langs" aria-label="Language">{switch}</nav><a class="top-cta" href="/rehab/">{u['app']}</a></div></div></header>
<main>{body}</main>
<footer><p><a href="{base(L)}">{u['f_all']}</a> · <a href="/rehab/">{u['f_app']}</a> · <a href="/rehab/privacy.html">{u['f_priv']}</a> · <a href="/rehab/terms.html">{u['f_terms']}</a></p>
<p>{u['f_edu']}</p>{trans}
<p>{u['f_copy']}</p></footer>
</body></html>
"""

def injury_page(i, L):
    u = UI[L]
    slug, seo_en = SEO[i["id"]]
    name = t(i["name"], L)
    sh = short(i, L)
    sh_en = i["name"].split(" (")[0].split(" / ")[0]
    region = t(REG.get(i["region"], i["region"].title()), L)
    nex = len({x["e"] for p in i["phases"] for x in p["x"]})
    title = u["title"].format(seo=seo_en, name=name)
    desc = u["desc"].format(short=sh if L != "en" else sh_en.lower(), stages=len(i["phases"]), nex=nex)
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "…"
    month = f"{MONTHS[L][TODAY.month - 1]} {TODAY.year}"
    app = f"/rehab/#injury={i['id']}"
    applang = f' <span class="muted small">{u["app_lang"]}</span>' if u["app_lang"] else ""
    b = [f'<nav class="crumbs" aria-label="Breadcrumb"><a href="/">IKJON</a> › <a href="{base(L)}">{u["crumbs"]}</a> › {e(region)}</nav>',
         f"<h1>{u['h1'].format(name=e(name))}</h1>",
         f'<p class="lede">{e(t(i["what"], L))}</p>',
         f'<p class="muted small">{u["meta"].format(sport=e(t(i["sport"], L)), region=e(region), month=month)}</p>' if i.get("sport") else "",
         f'<p class="note">{u["edu"]}</p>',
         f'<div class="cta"><p>{u["cta1"]}{applang}</p><a class="btn" href="{app}">{u["cta1btn"].format(short=e(sh))}</a></div>']
    if i.get("signs"):
        b.append(f"<h2>{u['signs']}</h2><ul>" + "".join(f"<li>{e(t(s, L))}</li>" for s in i["signs"]) + "</ul>")
    if i.get("flags"):
        b.append(f'<div class="warn"><h2>{u["flags"]}</h2><ul>' + "".join(f"<li>{e(t(f, L))}</li>" for f in i["flags"]) + "</ul></div>")
    th = u["th"]
    b.append(f"<h2>{u['howlong']}</h2><p>{u['howlong_p']}</p>"
             f"<div class='tbl'><table><thead><tr><th>{th[0]}</th><th>{th[1]}</th><th>{th[2]}</th></tr></thead><tbody>" +
             "".join(f"<tr><td><b>{e(t(s['l'], L))}</b><br><span class='muted small'>{e(t(s.get('g', ''), L))}</span></td><td>{e(t(s.get('d', ''), L))}</td><td>{u['days'].format(d=s['days'], w=span(s['days'], L))}</td></tr>" for s in i["sev"]) +
             "</tbody></table></div>")
    b.append(f"<h2>{u['plan']}</h2><p>{u['plan_p']}</p>")
    for k, p in enumerate(i["phases"], 1):
        items = []
        for x in p["x"]:
            a = ex(x["e"])
            nm = t(a["name"], L)
            ph = photo(a["id"], u["alt"].format(name=nm))
            steps = "".join(f"<li>{e(t(s, L))}</li>" for s in a["steps"])
            tip = f'<p class="small muted" style="margin:6px 0 0">{u["tip"]} {e(t(a["tip"], L))}</p>' if a.get("tip") else ""
            note = " · " + e(t(x["n"], L)) if x.get("n") else ""
            items.append(f'<li class="{"" if ph else "nophoto"}">{ph}<div><h3>{e(nm)}<span class="dose">{e(dose(x, L))}</span></h3>'
                         f'<span class="muted small">{e(t(a["type"], L))} · {e(t(a["target"], L))}{note}</span>'
                         f'<ol class="steps">{steps}</ol>{tip}</div></li>')
        exit_ = (f"<p class='exit'><b>{u['moveon']}</b></p><ul class='exit'>" + "".join(f"<li>{e(t(c, L))}</li>" for c in p.get("exit", [])) + "</ul>") if p.get("exit") else ""
        b.append(f'<section class="phase" id="stage-{k}"><div class="when">{u["stage"].format(k=k)} · {e(t(p.get("w", ""), L))}</div><h3 style="font-size:1.25rem">{e(t(p["t"], L))}</h3>'
                 f'<p style="margin:4px 0 0"><b>{u["goal"]}</b> {e(t(p.get("goal", ""), L))}</p><ol class="exs">{"".join(items)}</ol>{exit_}</section>')
    if i.get("note"):
        b.append(f'<p class="note"><b>{u["important"]}</b> {e(t(i["note"], L))}</p>')
    ev = EVID.get(i["id"])
    if ev:
        b.append(f"<h2>{u['research']}</h2><p class='muted small'>{u['evid']} <b>{e(t(ev.get('lvl', ''), L))}</b></p><ul>" +
                 "".join(f"<li>{e(t(x, L))}</li>" for x in ev.get("pts", [])) + "</ul>" +
                 (f"<p class='small muted'><b>{u['sources']}</b> " + "; ".join(e(r) for r in ev.get("refs", [])) + "</p>" if ev.get("refs") else ""))
    sev_list = " ".join(u["a1item"].format(l=t(s["l"], L), d=s["days"], w=span(s["days"], L)) for s in i["sev"])
    q1_name = sh if L != "en" else sh_en.lower()
    faq = [(u["q1"].format(short=q1_name), u["a1"].format(list=sev_list)),
           (u["q2"], u["a2f"].format(flags="; ".join(t(f, L) for f in i["flags"])) if i.get("flags") else u["a2"]),
           (u["q3"], u["a3"])]
    b.append(f"<h2>{u['faq']}</h2>" + "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faq))
    b.append(f'<div class="cta"><p>{u["cta2"]}{applang}</p><a class="btn" href="{app}">{u["cta2btn"]}</a></div>')
    rel = [j for j in INJ if j["region"] == i["region"] and j["id"] != i["id"]][:6]
    if rel:
        b.append(f"<h2>{u['more'].format(region=e(region if L != 'en' else region.lower()))}</h2><div class='grid'>" +
                 "".join(f'<a class="card" href="{base(L)}{SEO[j["id"]][0]}/"><b>{e(t(j["name"], L))}</b><span>{u["card"]}</span></a>' for j in rel) + "</div>")
    canon = url(L, slug)
    ld = [{"@context": "https://schema.org", "@type": "MedicalWebPage", "name": title, "headline": html.unescape(u["h1"].format(name=name)),
           "description": desc, "url": canon, "inLanguage": L, "dateModified": TODAY.isoformat(), "lastReviewed": TODAY.isoformat(),
           "about": {"@type": "MedicalCondition", "name": name}, "audience": {"@type": "Patient"},
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/", "logo": SITE + "/brand/lockup-navy.png"}},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "IKJON", "item": SITE + "/"},
              {"@type": "ListItem", "position": 2, "name": html.unescape(u["crumbs"]), "item": url(L)},
              {"@type": "ListItem", "position": 3, "name": name, "item": canon}]},
          {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": L, "mainEntity": [
              {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}]
    return slug, page(L, title, desc, slug, "".join(b), ld)

def hub(L):
    u = UI[L]
    n = len(INJ)
    title = u["hub_title"]
    desc = u["hub_desc"].format(n=n)[:160]
    groups = {}
    for i in INJ:
        groups.setdefault(i["region"], []).append(i)
    order = [r for r in REG if r in groups]
    applang = f' <span class="muted small">{u["app_lang"]}</span>' if u["app_lang"] else ""
    b = [f'<nav class="crumbs" aria-label="Breadcrumb"><a href="/">IKJON</a> › {u["crumbs"]}</nav>',
         f"<h1>{u['hub_h1']}</h1>",
         f'<p class="lede">{u["hub_lede"].format(n=n)}</p>',
         f'<div class="cta"><p>{u["hub_cta"]}{applang}</p><a class="btn" href="/rehab/#find">{u["hub_ctabtn"]}</a></div>']
    for r in order:
        b.append(f"<h2>{e(t(REG[r], L))}</h2><div class='grid'>" +
                 "".join(f'<a class="card" href="{SEO[i["id"]][0]}/"><b>{e(t(i["name"], L))}</b><span>{e(SEO[i["id"]][1]) if L == "en" else u["card"]}</span></a>' for i in groups[r]) + "</div>")
    b.append(f'<p class="note" style="margin-top:28px">{u["hub_edu"]}</p>')
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": title, "description": desc, "url": url(L), "inLanguage": L,
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/"},
           "hasPart": [{"@type": "MedicalWebPage", "name": t(i["name"], L), "url": url(L, SEO[i["id"]][0])} for i in INJ]}]
    return page(L, title, desc, None, "".join(b), ld)

def main():
    urls = []
    for L in LANGS:
        out = os.path.join(ROOT, "rehab", "guides", *([] if L == "en" else [L]))
        os.makedirs(out, exist_ok=True)
        open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(hub(L))
        urls.append(url(L))
        for i in INJ:
            slug, h = injury_page(i, L)
            os.makedirs(os.path.join(out, slug), exist_ok=True)
            open(os.path.join(out, slug, "index.html"), "w", encoding="utf-8").write(h)
            urls.append(url(L, slug))
    sm = os.path.join(ROOT, "sitemap.xml")
    s = open(sm, encoding="utf-8").read()
    s = re.sub(r"\s*<url><loc>https://www\.ikjon-gearbox\.com/rehab/guides/[^<]*</loc>.*?</url>", "", s, flags=re.S)
    add = "".join(f"\n  <url><loc>{x}</loc><lastmod>{TODAY.isoformat()}</lastmod><changefreq>monthly</changefreq><priority>{'0.9' if re.search(r'/guides/((uz|ru)/)?$', x) else '0.8'}</priority></url>" for x in urls)
    s = s.replace("</urlset>", add + "\n</urlset>")
    open(sm, "w", encoding="utf-8").write(s)
    print(f"Built {len(urls)} pages")

if __name__ == "__main__":
    main()

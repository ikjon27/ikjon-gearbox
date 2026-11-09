#!/usr/bin/env python3
"""Builds IKJON's public exercise library, the free workout-plan pages (Uzbek-first) and the
'How we write health pages' page, in English, Uzbek and Russian.

Input:  tools/rehab-data.json, tools/library-data.json (node tools/export_library_data.js),
        tools/i18n/*.json (translations)
Output: exercises/, plans/, about/health-content/, tools/cards-manifest.json, sitemap.xml
Run:    python3 tools/build_guides.py && python3 tools/build_library.py && node tools/build_cards.js
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_guides as G
from sitekit import trust_box, share_bar, EXTRA_CSS, ex_slug, ex_base, CARDS, e, nice_date, ABOUT

ROOT, SITE, LANGS = G.ROOT, G.SITE, G.LANGS
CHECKED = G.LAST_CHECKED
D, LD = G.D, json.load(open(os.path.join(ROOT, "tools", "library-data.json"), encoding="utf-8"))
FI = LD["I18N"]
XT = {L: json.load(open(os.path.join(ROOT, "tools", "i18n", f"lib_{L}.json"), encoding="utf-8")) for L in ("uz", "ru")}
MISSING = set()

def tx(s, L):
    if L == "en" or not s:
        return s
    for d in (XT[L], G.TR[L], FI[L]):
        if s in d:
            return d[s]
    MISSING.add(s)
    return s

# ---------- exercises ----------
SKIP = {"progress_photo", "brush_teeth"}
EXS = {}
for k, a in D["EX"].items():
    EXS[k] = dict(id=k, name=a[0], region=a[1], target=a[2], steps=a[3], tip=a[4], equip=a[5], type=a[6], anim=a[7])
for k, a in LD["FX"].items():
    if k in SKIP or k in EXS:
        continue
    EXS[k] = dict(id=k, name=a[0], region=a[1], target=a[2], steps=a[3], tip=a[4], equip="", type=a[5], anim=a[7] if len(a) > 7 else k)
for x in EXS.values():
    x["slug"] = ex_slug(x["name"])
assert len({x["slug"] for x in EXS.values()}) == len(EXS), "duplicate exercise slugs"

REGL = dict(D["REG"])
REGL.update({"hair": "Hair & scalp", "face": "Face & jaw", "eyes": "Eyes", "upper": "Shoulders, arms & chest", "glutes": "Hips & glutes",
             "heart": "Heart & lungs", "pelvic": "Pelvic floor", "hands": "Hands & nails", "feet": "Feet & toes", "core": "Core & waist"})
REG_ORDER = ["general", "neck", "shoulder", "upper", "elbow", "hands", "back", "core", "hip", "glutes", "thigh", "knee", "shin", "ankle", "foot", "feet",
             "heart", "pelvic", "face", "eyes", "hair"]
TYPEDESC = D["TYPEDESC"]; GUIDE = D["GUIDE"]

# where each exercise is used
USED_INJ, USED_PLAN = {}, {}
for i in D["INJ"]:
    for p in i["phases"]:
        for x in p["x"]:
            USED_INJ.setdefault(x["e"], [])
            if i["id"] not in USED_INJ[x["e"]]:
                USED_INJ[x["e"]].append(i["id"])
for pl in LD["PLANS"]:
    for w in set(pl["week"]):
        for x in LD["WK"][w][2]:
            USED_PLAN.setdefault(x[0], [])
            if pl["id"] not in USED_PLAN[x[0]]:
                USED_PLAN[x[0]].append(pl["id"])

FIGCSS = """.figs{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}.figs figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px}
.figs figcaption{font-size:.8rem;color:var(--mut);text-align:center;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.figs svg{width:100%;height:auto;display:block}
.rig{--far:#9CCAD6;--prop:#C9D8E0}.rig .near{stroke:#0097B2}.rig .far{stroke:var(--far)}.rig .tor{stroke:#1A4264}.rig .head{fill:#1A4264}.rig .hl{stroke:#D9711F!important}.rig .hlc{fill:#D9711F}
.rig .prop{fill:var(--prop);stroke:none}.rig .propl{stroke:var(--prop);fill:none}.rig .band{stroke:#D9711F;fill:none;stroke-dasharray:4 3}.rig .gnd{stroke:#d5e2e8}
@media (prefers-color-scheme:dark){.rig .tor{stroke:#CFE3EC}.rig .head{fill:#CFE3EC}.rig{--far:#3E6B7C;--prop:#3A5566}.rig .gnd{stroke:#24394a}}
.photo1{margin:14px 0}.photo1 img{width:100%;max-width:420px;height:auto;border-radius:14px;border:1px solid var(--line)}
.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px}.kv div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px}.kv b{display:block;font-size:.8rem;color:var(--mut);text-transform:uppercase;letter-spacing:.05em}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;text-decoration:none;color:inherit;font-weight:700;font-size:.9rem}.chips a:hover{border-color:var(--teal)}
.week{display:grid;gap:8px}.week a{display:grid;grid-template-columns:70px minmax(0,1fr);gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;color:inherit;text-decoration:none}.week a:hover{border-color:var(--teal)}.week b{color:var(--teal)}
ul.dl{list-style:none;padding:0;margin:8px 0 0;display:grid;gap:6px}ul.dl li{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;border-top:1px solid var(--line);padding-top:6px}ul.dl .dose{flex:none}"""

U = {
 "en": dict(lib="Exercise library", h1="{name}: how to do it", title="{name}: How to Do It, Muscles & Tips | IKJON",
            desc="How to do the {name} step by step: muscles worked ({target}), coaching tips, equipment and free plans that use it.",
            lede="<b>Works:</b> {target}. <b>Type:</b> {type} — {tdesc}.", start="Start", finish="Finish", howto="How to do it",
            tips="Coaching tips", speed="Speed", effort="Effort", breath="Breathing", feel="What you should feel", equip="Equipment",
            none="None — your body weight", used="Used in these free plans", inj="Injury recovery guides", fit="Fitness plans",
            similar="More exercises: {region}", safety="<b>Safety:</b> stop if you feel sharp pain, dizziness, numbness or chest pain. If you are recovering from an injury or surgery, follow your doctor's or physiotherapist's advice first.",
            cta="<b>Do it with a timer and an animated demo</b> in the free IKJON app. No account, no ads.", ctafit="Open IKJON Fitness", ctareh="Open Joint Rehab",
            hub_title="Exercise Library: {n} Free Exercises with Step-by-Step Instructions | IKJON", hub_h1="Exercise library",
            hub_desc="{n} free exercises for strength, mobility, posture and injury recovery, each with step-by-step instructions, tips and an illustration.",
            hub_lede="{n} exercises from IKJON's free fitness and injury-recovery plans. Each page shows how to do the exercise step by step, which muscles it works and the plans that use it.",
            home="IKJON", n_ex="{n} exercises",
            plans="Free workout plans", p_h1="{h1}", p_week="Weekly schedule", p_day="Day {n}", p_work="The workouts", p_care="Daily care routine",
            p_care_full="Each day the plan picks one exercise from each area below — it changes from day to day.", p_care_face="Each day: two face exercises, one for the eyes, one for the neck and a scalp massage.",
            p_hab="Daily habits", p_prog="How to progress", p_prog_t="Start at a level that feels easy to medium. When every set feels easy, add 1–2 reps or one more set. If you miss a day, simply continue — the plan does not reset.",
            p_len="Length", p_time="Time a day", p_for="For", p_months="{n} months", p_month="{n} month", p_rest="Rest day",
            p_cta="<b>Follow this plan day by day</b> in IKJON Fitness — free, with timers, voice guidance and progress tracking. No account needed.", p_btn="Start this plan",
            p_safe="<b>Before you start:</b> if you have a heart condition, high blood pressure, are pregnant, or have a recent injury or surgery, check with a doctor first. Stop if you feel pain, dizziness or chest pain.",
            p_hub_title="Free Home Workout Plans for Men and Women | IKJON", p_hub_h1="Free home workout plans",
            p_hub_desc="Free home workout plans for men and women, a 20-minute daily routine, hair care and posture plans — with every exercise explained.",
            p_hub_lede="Plans you can do at home with little or no equipment. Every exercise links to step-by-step instructions.",
            ab_title="How We Write Our Health Pages | IKJON", ab_h1="How we write our health pages"),
 "uz": dict(lib="Mashqlar kutubxonasi", h1="{name}: qanday bajariladi", title="{name} — qanday bajariladi, qaysi mushaklar ishlaydi | IKJON",
            desc="{name} mashqini bosqichma-bosqich bajarish: ishlaydigan mushaklar ({target}), maslahatlar, jihozlar va bu mashq bor bepul rejalar.",
            lede="<b>Ishlaydi:</b> {target}. <b>Turi:</b> {type} — {tdesc}.", start="Boshlanish", finish="Yakun", howto="Qanday bajariladi",
            tips="Murabbiy maslahatlari", speed="Tezlik", effort="Kuch", breath="Nafas", feel="Nimani his qilishingiz kerak", equip="Jihoz",
            none="Kerak emas — o‘z vazningiz", used="Bu mashq bor bepul rejalar", inj="Jarohatdan tiklanish qo‘llanmalari", fit="Fitnes rejalari",
            similar="Boshqa mashqlar: {region}", safety="<b>Xavfsizlik:</b> o‘tkir og‘riq, bosh aylanishi, uvishish yoki ko‘krakda og‘riq sezsangiz, to‘xtating. Jarohat yoki operatsiyadan keyin tiklanayotgan bo‘lsangiz, avval shifokor yoki fizioterapevt maslahatiga amal qiling.",
            cta="<b>Taymer va animatsion namuna bilan bajaring</b> — bepul IKJON ilovasida. Ro‘yxatdan o‘tish va reklama yo‘q.", ctafit="IKJON Fitness’ni ochish", ctareh="Joint Rehab’ni ochish",
            hub_title="Mashqlar kutubxonasi: {n} ta bepul mashq, bosqichma-bosqich | IKJON", hub_h1="Mashqlar kutubxonasi",
            hub_desc="Kuch, harakatchanlik, qomat va jarohatdan tiklanish uchun {n} ta bepul mashq — har biri bosqichma-bosqich yo‘riqnoma, maslahat va rasm bilan.",
            hub_lede="IKJON’ning bepul fitnes va tiklanish rejalaridagi {n} ta mashq. Har bir sahifada mashqni bosqichma-bosqich bajarish, qaysi mushaklar ishlashi va u qaysi rejalarda borligi ko‘rsatilgan.",
            home="IKJON", n_ex="{n} ta mashq",
            plans="Bepul mashq rejalari", p_h1="{h1}", p_week="Haftalik jadval", p_day="{n}-kun", p_work="Mashg‘ulotlar", p_care="Kundalik parvarish",
            p_care_full="Har kuni reja quyidagi har bir sohadan bittadan mashq tanlaydi — u kundan-kunga almashadi.", p_care_face="Har kuni: yuz uchun ikkita, ko‘z uchun bitta, bo‘yin uchun bitta mashq va bosh terisi massaji.",
            p_hab="Kundalik odatlar", p_prog="Qanday rivojlanish kerak", p_prog_t="Yengil-o‘rtacha tuyuladigan darajadan boshlang. Barcha setlar oson bo‘lib qolganda 1–2 takror yoki yana bitta set qo‘shing. Bir kunni o‘tkazib yuborsangiz, shunchaki davom eting — reja boshidan boshlanmaydi.",
            p_len="Davomiyligi", p_time="Kuniga vaqt", p_for="Kim uchun", p_months="{n} oy", p_month="{n} oy", p_rest="Dam olish kuni",
            p_cta="<b>Bu rejaga kunma-kun amal qiling</b> — IKJON Fitness’da bepul, taymer, ovozli yo‘riqnoma va natijalarni kuzatish bilan. Ro‘yxatdan o‘tish shart emas.", p_btn="Rejani boshlash",
            p_safe="<b>Boshlashdan oldin:</b> yurak kasalligi, yuqori qon bosimi, homiladorlik yoki yaqinda jarohat yoki operatsiya bo‘lsa, avval shifokor bilan maslahatlashing. Og‘riq, bosh aylanishi yoki ko‘krakda og‘riq sezsangiz, to‘xtating.",
            p_hub_title="Uyda mashq qilish: erkaklar va ayollar uchun bepul rejalar | IKJON", p_hub_h1="Uyda mashq qilish uchun bepul rejalar",
            p_hub_desc="Erkaklar va ayollar uchun uyda bepul mashq rejalari, har kuni 20 daqiqalik mashq, soch parvarishi va qomat rejalari — har bir mashq tushuntirilgan.",
            p_hub_lede="Uyda deyarli jihozsiz bajariladigan rejalar. Har bir mashq bosqichma-bosqich yo‘riqnomaga ulangan.",
            ab_title="Sog‘liq sahifalarini qanday yozamiz | IKJON", ab_h1="Sog‘liq sahifalarini qanday yozamiz"),
 "ru": dict(lib="Библиотека упражнений", h1="{name}: техника выполнения", title="{name}: техника выполнения, мышцы и советы | IKJON",
            desc="Как выполнять упражнение «{name}» шаг за шагом: какие мышцы работают ({target}), советы, инвентарь и бесплатные планы с ним.",
            lede="<b>Работают:</b> {target}. <b>Тип:</b> {type} — {tdesc}.", start="Начало", finish="Конец", howto="Как выполнять",
            tips="Советы тренера", speed="Темп", effort="Усилие", breath="Дыхание", feel="Что вы должны чувствовать", equip="Инвентарь",
            none="Не нужен — собственный вес", used="Бесплатные планы с этим упражнением", inj="Восстановление после травм", fit="Фитнес-планы",
            similar="Ещё упражнения: {region}", safety="<b>Безопасность:</b> остановитесь, если чувствуете острую боль, головокружение, онемение или боль в груди. Если вы восстанавливаетесь после травмы или операции, сначала следуйте советам врача или физиотерапевта.",
            cta="<b>Выполняйте с таймером и анимированной демонстрацией</b> в бесплатном приложении IKJON. Без регистрации и рекламы.", ctafit="Открыть IKJON Fitness", ctareh="Открыть Joint Rehab",
            hub_title="Библиотека упражнений: {n} бесплатных упражнений с техникой | IKJON", hub_h1="Библиотека упражнений",
            hub_desc="{n} бесплатных упражнений для силы, подвижности, осанки и восстановления после травм — с пошаговой техникой, советами и иллюстрацией.",
            hub_lede="Упражнения из бесплатных фитнес-планов и планов восстановления IKJON — всего {n}. На каждой странице: пошаговая техника, какие мышцы работают и в каких планах оно используется.",
            home="IKJON", n_ex="упражнений: {n}",
            plans="Бесплатные планы тренировок", p_h1="{h1}", p_week="Расписание на неделю", p_day="День {n}", p_work="Тренировки", p_care="Ежедневный уход",
            p_care_full="Каждый день план выбирает по одному упражнению из каждой зоны ниже — они меняются изо дня в день.", p_care_face="Каждый день: два упражнения для лица, одно для глаз, одно для шеи и массаж головы.",
            p_hab="Ежедневные привычки", p_prog="Как прогрессировать", p_prog_t="Начните с уровня, который кажется лёгким или средним. Когда все подходы даются легко, добавьте 1–2 повторения или ещё один подход. Пропустили день — просто продолжайте, план не начинается заново.",
            p_len="Длительность", p_time="Время в день", p_for="Для кого", p_months="{n} мес.", p_month="{n} мес.", p_rest="День отдыха",
            p_cta="<b>Следуйте этому плану день за днём</b> в IKJON Fitness — бесплатно, с таймерами, голосовыми подсказками и отслеживанием прогресса. Без регистрации.", p_btn="Начать план",
            p_safe="<b>Перед началом:</b> если у вас болезнь сердца, высокое давление, беременность, недавняя травма или операция, сначала посоветуйтесь с врачом. Остановитесь при боли, головокружении или боли в груди.",
            p_hub_title="Бесплатные программы тренировок дома для мужчин и женщин | IKJON", p_hub_h1="Бесплатные планы тренировок дома",
            p_hub_desc="Бесплатные программы тренировок дома для мужчин и женщин, ежедневная тренировка 20 минут, уход за волосами и осанкой — с объяснением каждого упражнения.",
            p_hub_lede="Планы, которые можно выполнять дома почти без инвентаря. Каждое упражнение ведёт на пошаговую технику.",
            ab_title="Как мы пишем о здоровье | IKJON", ab_h1="Как мы пишем страницы о здоровье"),
}

PLAN_SEO = {
 "daily": {"en": ("daily-20-minute-workout-routine", "Free 20-Minute Daily Workout: Head-to-Toe Routine"),
           "uz": ("har-kuni-20-daqiqalik-mashq", "Har kuni 20 daqiqalik mashq: boshdan-oyoqqacha sog‘lomlik rejasi"),
           "ru": ("ezhednevnaya-trenirovka-20-minut", "Ежедневная тренировка 20 минут: план от головы до ног")},
 "men": {"en": ("home-workout-plan-for-men", "Home Workout Plan for Men: 3 Months, No Gym Needed"),
         "uz": ("erkaklar-uchun-uyda-mashq-rejasi", "Erkaklar uchun uyda mashq rejasi: 3 oy, zalsiz"),
         "ru": ("programma-trenirovok-doma-dlya-muzhchin", "Программа тренировок дома для мужчин: 3 месяца без зала")},
 "women": {"en": ("home-workout-plan-for-women", "Home Workout Plan for Women: 3 Months, Glutes, Waist & Posture"),
           "uz": ("ayollar-uchun-uyda-mashq-rejasi", "Ayollar uchun uyda mashq rejasi: 3 oy — dumba, bel va qomat"),
           "ru": ("programma-trenirovok-doma-dlya-zhenshchin", "Программа тренировок дома для женщин: 3 месяца — ягодицы, талия, осанка")},
 "hair": {"en": ("scalp-massage-hair-care-routine", "Scalp Massage & Hair Care Routine: 30-Day Plan"),
          "uz": ("soch-uchun-bosh-terisi-massaji", "Soch uchun bosh terisi massaji va parvarish rejasi: 30 kun"),
          "ru": ("massazh-golovy-i-ukhod-za-volosami", "Массаж головы и уход за волосами: план на 30 дней")},
 "face": {"en": ("face-neck-posture-exercises", "Face, Neck & Posture Exercises: 30-Day Plan"),
          "uz": ("yuz-boyin-va-qomat-mashqlari", "Yuz, bo‘yin va qomat mashqlari: 30 kunlik reja"),
          "ru": ("uprazhneniya-dlya-litsa-shei-i-osanki", "Упражнения для лица, шеи и осанки: план на 30 дней")},
}

ABOUT_BODY = {
 "en": """<p class="lede">Our health pages explain common injuries, exercises and simple daily routines in plain language. This page tells you who writes them, how, and what they can and cannot do.</p>
<h2>Who we are</h2><p>The pages are written by the team of IKJON Consulting &amp; Education Centre in Uzbekistan. We are an education centre, not a clinic.</p>
<h2>How we make each page</h2><ul><li>We start from published research and sports-medicine guidelines. The main sources are listed on each injury guide.</li><li>We use AI tools to help draft pages and to translate them into Uzbek and Russian. The facts on each page should match the listed sources.</li><li>We write for people, not for search engines: short sentences, the answer first, no exaggerated promises.</li></ul>
<h2>What we have not done yet</h2><p>Our pages have <b>not yet been reviewed by a doctor or physiotherapist</b>. When a qualified reviewer checks them, we will name them here and on each page.</p>
<h2>Dates</h2><p>“Last checked” shows when the content was last checked against its sources. We change it only when we actually re-check a page.</p>
<h2>Our rules</h2><ul><li>Education, not diagnosis. Only a doctor or physiotherapist can tell you what injury you have.</li><li>No ads, no paid placements and no tracking.</li><li>If something looks wrong, we fix it.</li></ul>
<h2>Found a mistake?</h2><p>Email <b>ikjongearbox@gmail.com</b> with the page address and what is wrong. In an emergency call your local emergency number (103 in Uzbekistan).</p>""",
 "uz": """<p class="lede">Sog‘liq sahifalarimiz keng tarqalgan jarohatlar, mashqlar va oddiy kundalik tartiblarni sodda tilda tushuntiradi. Bu sahifa ularni kim va qanday yozishini, ular nimaga qodir va nimaga qodir emasligini aytadi.</p>
<h2>Biz kimmiz</h2><p>Sahifalarni O‘zbekistondagi IKJON Consulting &amp; Education Centre jamoasi yozadi. Biz klinika emas, ta’lim markazimiz.</p>
<h2>Har bir sahifani qanday tayyorlaymiz</h2><ul><li>E’lon qilingan tadqiqotlar va sport tibbiyoti tavsiyalaridan boshlaymiz. Asosiy manbalar har bir jarohat qo‘llanmasida ko‘rsatilgan.</li><li>Sahifalarni yozish va o‘zbek hamda rus tillariga tarjima qilishda sun’iy intellekt vositalaridan foydalanamiz. Har bir sahifadagi ma’lumotlar ko‘rsatilgan manbalarga mos bo‘lishi kerak.</li><li>Qidiruv tizimlari uchun emas, odamlar uchun yozamiz: qisqa gaplar, avval javob, bo‘rttirilgan va’dalar yo‘q.</li></ul>
<h2>Hali nima qilmaganmiz</h2><p>Sahifalarimizni <b>hali shifokor yoki fizioterapevt tekshirmagan</b>. Malakali mutaxassis ularni tekshirsa, uning ismini shu yerda va har bir sahifada ko‘rsatamiz.</p>
<h2>Sanalar</h2><p>«Oxirgi tekshiruv» mazmun manbalar bilan oxirgi marta qachon solishtirilganini ko‘rsatadi. Uni faqat sahifani haqiqatan qayta tekshirganimizda o‘zgartiramiz.</p>
<h2>Qoidalarimiz</h2><ul><li>Bu ta’lim, tashxis emas. Sizda qanday jarohat borligini faqat shifokor yoki fizioterapevt ayta oladi.</li><li>Reklama, pullik joylashtirish va kuzatuv yo‘q.</li><li>Xato bo‘lsa, tuzatamiz.</li></ul>
<h2>Xato topdingizmi?</h2><p>Sahifa manzili va xato haqida <b>ikjongearbox@gmail.com</b> manziliga yozing. Favqulodda holatda 103 ga qo‘ng‘iroq qiling.</p>""",
 "ru": """<p class="lede">Наши страницы о здоровье простым языком объясняют частые травмы, упражнения и простые ежедневные привычки. Здесь рассказано, кто и как их пишет и чего они могут и не могут.</p>
<h2>Кто мы</h2><p>Страницы пишет команда IKJON Consulting &amp; Education Centre в Узбекистане. Мы образовательный центр, а не клиника.</p>
<h2>Как мы готовим каждую страницу</h2><ul><li>Мы опираемся на опубликованные исследования и рекомендации спортивной медицины. Основные источники указаны в каждом руководстве по травмам.</li><li>Для черновиков и перевода на узбекский и русский мы используем инструменты искусственного интеллекта. Факты на каждой странице должны соответствовать указанным источникам.</li><li>Мы пишем для людей, а не для поисковых систем: короткие фразы, сначала ответ, без преувеличенных обещаний.</li></ul>
<h2>Чего мы пока не сделали</h2><p>Наши страницы <b>пока не проверены врачом или физиотерапевтом</b>. Когда их проверит квалифицированный специалист, мы укажем его здесь и на каждой странице.</p>
<h2>Даты</h2><p>«Последняя проверка» показывает, когда содержание в последний раз сверялось с источниками. Мы меняем её, только когда действительно перепроверяем страницу.</p>
<h2>Наши правила</h2><ul><li>Это обучение, а не диагноз. Какая у вас травма, может сказать только врач или физиотерапевт.</li><li>Без рекламы, платных размещений и отслеживания.</li><li>Если что-то неверно, мы исправим.</li></ul>
<h2>Нашли ошибку?</h2><p>Напишите на <b>ikjongearbox@gmail.com</b>, указав адрес страницы и ошибку. В экстренной ситуации звоните 103.</p>""",
}

def lbase(kind, L):
    return {"ex": ex_base(L), "plans": "/plans/" if L == "en" else f"/plans/{L}/", "about": ABOUT[L]}[kind]

def layout(L, title, desc, canon, alts, body, ld, img=None):
    u = U[L]
    alt = "".join(f'<link rel="alternate" hreflang="{x}" href="{SITE}{alts[x]}">' for x in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{SITE}{alts["en"]}">'
    sw = "".join(f'<a href="{alts[x]}" hreflang="{x}" lang="{x}"' + (' aria-current="true"' if x == L else "") + f'>{x.upper()}</a>' for x in LANGS)
    og = f'<meta property="og:image" content="{SITE}{img}"><meta name="twitter:card" content="summary_large_image">' if img else ""
    return f"""<!doctype html>
<html lang="{L}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{G.CSP}; script-src 'self'"><meta name="referrer" content="strict-origin-when-cross-origin">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<link rel="canonical" href="{SITE}{canon}">{alt}<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{SITE}{canon}"><meta property="og:site_name" content="IKJON"><meta property="og:locale" content="{G.OG_LOCALE[L]}">{og}
<link rel="icon" href="/rehab/icons/favicon-48.png"><link rel="apple-touch-icon" href="/rehab/icons/apple-touch-icon.png">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
<style>{G.CSS}{FIGCSS}</style></head>
<body><header><div class="in"><a class="logo" href="/"><img src="/rehab/brand/mark-white.png" alt="" width="46" height="34">IKJON</a><div class="hr"><nav class="langs" aria-label="Language">{sw}</nav><a class="top-cta" href="/sport/">Fitness &amp; Sport</a></div></div></header>
<main>{body}</main>
<footer><p><a href="{lbase('ex', L)}">{u['lib']}</a> · <a href="{lbase('plans', L)}">{u['plans']}</a> · <a href="{G.base(L)}">{G.UI[L]['f_all']}</a> · <a href="{ABOUT[L]}">{e(u['ab_h1'])}</a></p>
<p>{G.UI[L]['f_edu']}</p><p>{G.UI[L]['f_copy']}</p></footer>
<script src="/assets/share.js" defer></script>
</body></html>
"""

def crumbs(L, items):
    out = [f'<a href="/">IKJON</a>']
    for name, href in items:
        out.append(f'<a href="{href}">{e(name)}</a>' if href else e(name))
    return '<nav class="crumbs" aria-label="Breadcrumb">' + " › ".join(out) + "</nav>"

def bc_ld(L, items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": n + 1, "name": nm, "item": SITE + h} for n, (nm, h) in enumerate([("IKJON", "/")] + items)]}

def dose(x, L):
    s, r, t_ = x[1], x[2], x[3]
    u = G.UI[L]
    if t_:
        return (f"{s} × " if s > 1 else "") + G.fmt_t(t_, L)
    return f"{s} × {r}"

def figs(x, L):
    f = LD["figs"].get(x["id"])
    if not f:
        return ""
    u = U[L]
    nm = e(tx(x["name"], L))
    sv = lambda inner: f'<svg viewBox="0 0 240 190" class="rig" role="img" aria-label="{nm}">{inner}</svg>'
    return f'<div class="figs"><figure>{sv(f[0])}<figcaption>{u["start"]}</figcaption></figure><figure>{sv(f[1])}<figcaption>{u["finish"]}</figcaption></figure></div>'

def ex_page(x, L):
    u = U[L]
    name = tx(x["name"], L)
    reg = tx(REGL.get(x["region"], x["region"].title()), L)
    typ = tx(x["type"], L)
    td = tx(TYPEDESC.get(x["type"], ""), L)
    target = tx(x["target"], L)
    canon = f"{ex_base(L)}{x['slug']}/"
    alts = {k: f"{ex_base(k)}{x['slug']}/" for k in LANGS}
    title = u["title"].format(name=name)
    desc = u["desc"].format(name=name if L != "en" else name.lower(), target=target.lower() if L == "en" else target)
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "…"
    card = f"/cards/exercises/{L}/{x['slug']}.jpg"
    b = [crumbs(L, [(u["lib"], ex_base(L)), (reg, f"{ex_base(L)}#{x['region']}")]),
         f"<h1>{e(u['h1'].format(name=name))}</h1>",
         f'<p class="lede">{u["lede"].format(target=e(target), type=e(typ), tdesc=e(td[:1].lower() + td[1:] if L != "en" else td.lower()))}</p>' if td else f'<p class="lede"><b>{e(target)}</b></p>',
         trust_box(L, CHECKED, show_src=False)]
    ph = G.photo(x["id"], name)
    b.append(figs(x, L))
    if ph:
        b.append(f'<div class="photo1">{ph}</div>')
    b.append(f"<h2>{u['howto']}</h2><ol>" + "".join(f"<li>{e(tx(s, L))}</li>" for s in x["steps"]) + "</ol>")
    gd = GUIDE.get(x["type"])
    tips = []
    if x.get("tip"):
        tips.append(f"<p>{e(tx(x['tip'], L))}</p>")
    if gd:
        tips.append('<div class="kv">' + "".join(f"<div><b>{u[k]}</b>{e(tx(gd[k], L))}</div>" for k in ("speed", "effort", "breath", "feel") if gd.get(k)) + "</div>")
    if tips:
        b.append(f"<h2>{u['tips']}</h2>" + "".join(tips))
    b.append(f"<h2>{u['equip']}</h2><p>{e(tx(x['equip'], L)) if x.get('equip') else u['none']}</p>")
    b.append(f'<p class="note">{u["safety"]}</p>')
    used = []
    if USED_INJ.get(x["id"]):
        used.append(f"<h3>{u['inj']}</h3><div class='chips'>" + "".join(
            f'<a href="{G.base(L)}{G.SEO[i][0]}/">{e(tx(next(j["name"] for j in D["INJ"] if j["id"] == i), L))}</a>' for i in USED_INJ[x["id"]]) + "</div>")
    if USED_PLAN.get(x["id"]):
        used.append(f"<h3 style='margin-top:14px'>{u['fit']}</h3><div class='chips'>" + "".join(
            f'<a href="{lbase("plans", L)}{PLAN_SEO[p][L][0]}/">{e(tx(next(q["name"] for q in LD["PLANS"] if q["id"] == p), L))}</a>' for p in USED_PLAN[x["id"]]) + "</div>")
    if used:
        b.append(f"<h2>{u['used']}</h2>" + "".join(used))
    app, btn = ("/fitness/", u["ctafit"]) if USED_PLAN.get(x["id"]) and not USED_INJ.get(x["id"]) else ("/rehab/", u["ctareh"])
    b.append(f'<div class="cta"><p>{u["cta"]}</p><a class="btn" href="{app}">{btn}</a></div>')
    b.append(share_bar(L, SITE + canon, u["h1"].format(name=name), card))
    rel = [y for y in EXS.values() if y["region"] == x["region"] and y["id"] != x["id"]][:8]
    if rel:
        b.append(f"<h2>{e(u['similar'].format(region=reg))}</h2><div class='chips'>" + "".join(f'<a href="{ex_base(L)}{y["slug"]}/">{e(tx(y["name"], L))}</a>' for y in rel) + "</div>")
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "name": title, "description": desc, "url": SITE + canon, "inLanguage": L,
           "dateModified": CHECKED.isoformat(), "image": SITE + card,
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/"}},
          bc_ld(L, [(u["lib"], ex_base(L)), (name, canon)])]
    f = LD["figs"].get(x["id"])
    CARDS.append({"out": card, "kind": "exercise", "lang": L, "title": name, "sub": target,
                  "svg": f'<svg viewBox="0 0 240 190" class="rig">{f[1]}</svg>' if f else "", "lines": [tx(s, L) for s in x["steps"][:3]],
                  "url": (SITE + canon).replace("https://www.", "")})
    return canon, layout(L, title, desc, canon, alts, "".join(b), ld, card)

def ex_hub(L):
    u = U[L]
    n = len(EXS)
    groups = {}
    for x in EXS.values():
        groups.setdefault(x["region"], []).append(x)
    order = [r for r in REG_ORDER if r in groups] + [r for r in groups if r not in REG_ORDER]
    b = [crumbs(L, [(u["lib"], None)]), f"<h1>{u['hub_h1']}</h1>", f'<p class="lede">{e(u["hub_lede"].format(n=n))}</p>',
         f'<p class="chips">' + "".join(f'<a href="#{r}">{e(tx(REGL.get(r, r), L))}</a>' for r in order) + "</p>"]
    for r in order:
        b.append(f"<h2 id='{r}'>{e(tx(REGL.get(r, r), L))}</h2><div class='grid'>" + "".join(
            f'<a class="card" href="{x["slug"]}/"><b>{e(tx(x["name"], L))}</b><span>{e(tx(x["target"], L))}</span></a>' for x in sorted(groups[r], key=lambda y: tx(y["name"], L))) + "</div>")
    canon = ex_base(L)
    alts = {k: ex_base(k) for k in LANGS}
    title, desc = u["hub_title"].format(n=n), u["hub_desc"].format(n=n)[:160]
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": title, "description": desc, "url": SITE + canon, "inLanguage": L},
          bc_ld(L, [(u["lib"], canon)])]
    return canon, layout(L, title, desc, canon, alts, "".join(b), ld)

AREA_NAME = {a[0]: a[1] for a in LD["AREAS"]}

def plan_page(pl, L):
    u = U[L]
    slug, h1 = PLAN_SEO[pl["id"]][L]
    canon = f"{lbase('plans', L)}{slug}/"
    alts = {k: f"{lbase('plans', k)}{PLAN_SEO[pl['id']][k][0]}/" for k in LANGS}
    card = f"/cards/plans/{L}/{slug}.jpg"
    name = tx(pl["name"], L)
    b = [crumbs(L, [(u["plans"], lbase("plans", L)), (name, None)]), f"<h1>{e(h1)}</h1>", f'<p class="lede">{e(tx(pl["desc"], L))}</p>',
         f'<div class="kv"><div><b>{u["p_len"]}</b>{(u["p_months"] if pl["months"] > 1 else u["p_month"]).format(n=pl["months"])}</div><div><b>{u["p_time"]}</b>{e(tx(pl["tag"], L).split("·")[-1].strip())}</div><div><b>{u["p_for"]}</b>{e(tx(pl["tag"], L).split("·")[0].strip())}</div></div>',
         trust_box(L, CHECKED, show_src=False),
         f'<div class="cta"><p>{u["p_cta"]}</p><a class="btn" href="/fitness/#plan={pl["id"]}">{u["p_btn"]}</a></div>',
         f"<h2>{u['p_week']}</h2><div class='week'>"]
    seen = []
    for n_, w in enumerate(pl["week"], 1):
        wk = LD["WK"][w]
        b.append(f'<a href="#w-{w}"><b>{e(u["p_day"].format(n=n_))}</b><span>{e(tx(wk[0], L))}</span></a>')
        if w not in seen:
            seen.append(w)
    b.append("</div>")
    b.append(f"<h2>{u['p_work']}</h2>")
    for w in seen:
        wk = LD["WK"][w]
        items = "".join(f'<li><a class="exl" href="{ex_base(L)}{EXS[x[0]]["slug"]}/">{e(tx(EXS[x[0]]["name"], L))}</a><span class="dose">{e(dose(x, L))}</span></li>' if x[0] in EXS
                        else f'<li>{e(tx(x[0], L))}<span class="dose">{e(dose(x, L))}</span></li>' for x in wk[2])
        b.append(f'<section class="phase" id="w-{w}"><h3 style="font-size:1.2rem">{e(tx(wk[0], L))}</h3><ul class="dl">{items}</ul></section>')
    if pl["care"] in ("full", "face"):
        b.append(f"<h2>{u['p_care']}</h2><p>{u['p_care_full'] if pl['care'] == 'full' else u['p_care_face']}</p>")
        areas = LD["CARE"] if pl["care"] == "full" else [c for c in LD["CARE"] if c[0] in ("face", "eyes", "neck", "hair")]
        for a, opts in areas:
            links = ", ".join(f'<a class="exl" href="{ex_base(L)}{EXS[o[0]]["slug"]}/">{e(tx(EXS[o[0]]["name"], L))}</a>' for o in opts if o[0] in EXS)
            b.append(f"<p><b>{e(tx(AREA_NAME.get(a, a), L))}:</b> {links}</p>")
    b.append(f"<h2>{u['p_hab']}</h2><ul>" + "".join(f"<li>{e(tx(LD['HAB'][h], L))}</li>" for h in pl["habits"]) + "</ul>")
    b.append(f"<h2>{u['p_prog']}</h2><p>{u['p_prog_t']}</p>")
    b.append(f'<p class="note">{u["p_safe"]}</p>')
    b.append(share_bar(L, SITE + canon, h1, card))
    others = [q for q in LD["PLANS"] if q["id"] != pl["id"]]
    b.append(f"<h2>{u['plans']}</h2><div class='grid'>" + "".join(f'<a class="card" href="{lbase("plans", L)}{PLAN_SEO[q["id"]][L][0]}/"><b>{e(PLAN_SEO[q["id"]][L][1])}</b><span>{e(tx(q["tag"], L))}</span></a>' for q in others) + "</div>")
    desc = tx(pl["desc"], L)
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "…"
    title = f"{h1} | IKJON"
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "name": h1, "description": desc, "url": SITE + canon, "inLanguage": L, "dateModified": CHECKED.isoformat(), "image": SITE + card,
           "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/"}}, bc_ld(L, [(u["plans"], lbase("plans", L)), (h1, canon)])]
    CARDS.append({"out": card, "kind": "plan", "lang": L, "title": h1, "sub": tx(pl["tag"], L),
                  "lines": [f'{u["p_day"].format(n=n_)}: {tx(LD["WK"][w][0], L)}' for n_, w in enumerate(pl["week"], 1)], "svg": "",
                  "url": (SITE + canon).replace("https://www.", "")})
    return canon, layout(L, title, desc, canon, alts, "".join(b), ld, card)

def plan_hub(L):
    u = U[L]
    canon = lbase("plans", L)
    alts = {k: lbase("plans", k) for k in LANGS}
    b = [crumbs(L, [(u["plans"], None)]), f"<h1>{u['p_hub_h1']}</h1>", f'<p class="lede">{u["p_hub_lede"]}</p>', "<div class='grid'>"]
    b += [f'<a class="card" href="{PLAN_SEO[q["id"]][L][0]}/"><b>{e(PLAN_SEO[q["id"]][L][1])}</b><span>{e(tx(q["tag"], L))}</span></a>' for q in LD["PLANS"]]
    b.append(f"</div><p class='note' style='margin-top:24px'>{u['p_safe']}</p><p><a class='exl' href='{ex_base(L)}'>{u['lib']} →</a></p>")
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": u["p_hub_title"], "description": u["p_hub_desc"], "url": SITE + canon, "inLanguage": L}, bc_ld(L, [(u["plans"], canon)])]
    return canon, layout(L, u["p_hub_title"], u["p_hub_desc"][:160], canon, alts, "".join(b), ld)

def about(L):
    u = U[L]
    canon = ABOUT[L]
    b = crumbs(L, [(u["ab_h1"], None)]) + f"<h1>{u['ab_h1']}</h1>" + ABOUT_BODY[L]
    ld = [{"@context": "https://schema.org", "@type": "AboutPage", "name": u["ab_title"], "url": SITE + canon, "inLanguage": L}]
    return canon, layout(L, u["ab_title"], re.sub("<[^>]+>", "", ABOUT_BODY[L]).split(".")[0][:155] + ".", canon, dict(ABOUT), b, ld)

def write(path, html_):
    f = os.path.join(ROOT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(f), exist_ok=True)
    open(f, "w", encoding="utf-8").write(html_)

def main():
    G.main()                       # guides first (they add their cards)
    urls = []
    for L in LANGS:
        for fn in (lambda: ex_hub(L), lambda: plan_hub(L), lambda: about(L)):
            c, h = fn(); write(c, h); urls.append(c)
        for x in EXS.values():
            c, h = ex_page(x, L); write(c, h); urls.append(c)
        for pl in LD["PLANS"]:
            c, h = plan_page(pl, L); write(c, h); urls.append(c)
    sm = os.path.join(ROOT, "sitemap.xml")
    s = open(sm, encoding="utf-8").read()
    s = re.sub(r"\s*<url><loc>https://www\.ikjon-gearbox\.com/(exercises|plans|about)/[^<]*</loc>.*?</url>", "", s, flags=re.S)
    s = s.replace("</urlset>", "".join(f"\n  <url><loc>{SITE}{c}</loc><lastmod>{CHECKED.isoformat()}</lastmod></url>" for c in urls) + "\n</urlset>")
    open(sm, "w", encoding="utf-8").write(s)
    json.dump(CARDS, open(os.path.join(ROOT, "tools", "cards-manifest.json"), "w", encoding="utf-8"), ensure_ascii=False)
    json.dump(sorted(MISSING), open(os.path.join(ROOT, "tools", "i18n", "lib_missing.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"Library: {len(urls)} pages, {len(CARDS)} cards; untranslated: {len(MISSING)}")

if __name__ == "__main__":
    main()

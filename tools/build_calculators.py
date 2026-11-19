#!/usr/bin/env python3
"""Builds IKJON's free health calculators in English, Uzbek and Russian:
  - BMI and waist-to-height ratio (NHS, NICE NG246)
  - Heart-rate zones by age (American Heart Association)
The numbers are worked out in the browser by /assets/calc.js. Nothing is saved or sent.

Output: calculators/ (+ uz/, ru/), and the matching URLs in sitemap.xml
Run:    python3 tools/build_calculators.py
"""
import datetime, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_library as B
from sitekit import trust_box, share_bar, e

ROOT, SITE, LANGS = B.ROOT, B.SITE, B.LANGS
CHECKED = datetime.date(2026, 11, 19)   # change only when the content is actually re-checked

def hub(L):
    return "/calculators/" if L == "en" else f"/calculators/{L}/"

SLUG = {
 "bmi": {"en": "bmi-waist-to-height", "uz": "tvi-va-bel-olchami", "ru": "kalkulyator-imt-i-talii"},
 "hr":  {"en": "heart-rate-zones", "uz": "yurak-urishi-zonalari", "ru": "pulsovye-zony"},
}

def url(k, L):
    return f"{hub(L)}{SLUG[k][L]}/"

def plan(pid, L):
    return f"{B.lbase('plans', L)}{B.PLAN_SEO[pid][L][0]}/", B.PLAN_SEO[pid][L][1]

def exu(slug, L):
    return f"{B.ex_base(L)}{slug}/"

SRC = {
 "nhs": ("NHS — Calculate your body mass index (BMI) for adults", "https://www.nhs.uk/health-assessment-tools/calculate-your-body-mass-index/calculate-bmi-for-adults"),
 "nice": ("NICE guideline NG246 — Identifying and assessing overweight, obesity and central adiposity", "https://www.nice.org.uk/guidance/NG246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity"),
 "aha": ("American Heart Association — Target heart rates chart", "https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates"),
 "who": ("World Health Organization (Europe) — Physical activity fact sheet", "https://www.who.int/europe/news-room/fact-sheets/item/physical-activity"),
}

# ---------------------------------------------------------------- text
T = {
"en": dict(
  hub="Health calculators", hub_title="Free Health Calculators: BMI, Waist and Heart Rate Zones | IKJON",
  hub_desc="Free, private health calculators from IKJON: BMI and waist-to-height ratio, and heart-rate zones by age. Nothing you type is saved or sent.",
  hub_lede="Simple calculators based on the NHS, NICE and the American Heart Association. They work in your browser — nothing you type is saved or sent.",
  calc="Calculate", nojs="This calculator needs JavaScript. You can still use the tables on this page.",
  means="What the result means", next="Your next step", src="Sources", other="Other calculators", private="Private: nothing you type is saved or sent.",
  who_act="WHO recommends that adults do <b>150–300 minutes of moderate activity a week</b> (or 75–150 minutes of vigorous activity), plus <b>strength exercises on 2 or more days</b>. These free plans help you get there:",
  bmi_h1="BMI and waist-to-height calculator for adults", bmi_title="BMI and Waist-to-Height Calculator for Adults (Free) | IKJON",
  bmi_desc="Work out your BMI and waist-to-height ratio. Includes the lower NICE limits for people of Asian, Middle Eastern and Black backgrounds. Free and private.",
  bmi_card="BMI, waist-to-height ratio and what they mean",
  bmi_lede="<b>BMI = weight (kg) ÷ height (m)².</b> For most adults a healthy BMI is <b>18.5–24.9</b>. For people with a South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean background, NICE uses lower limits: overweight from <b>23</b> and obesity from <b>27.5</b>. Your waist should be <b>less than half your height</b>.",
  bmi_who="<b>Who this is for:</b> adults aged 18 and over. Do not use it if you are pregnant, if you have or think you may have an eating disorder, or if you have a condition that affects your height (NHS advice). BMI cannot tell muscle from fat, so it can read high in very muscular people. NICE also says to read BMI with care from age 65.",
  f_h="Height (cm)", f_w="Weight (kg)", f_waist="Waist (cm) — optional", f_g="Family background", f_g0="Choose…",
  f_glow="South Asian, Chinese, other Asian, Middle Eastern, Black African or African-Caribbean", f_gstd="White or another background",
  f_ghelp="People from the first group have higher health risks at a lower BMI, so NICE uses lower limits for them.",
  t_bmi="BMI ranges for adults (NICE)", t_cat="Range", t_std="Most adults", t_low="Asian, Middle Eastern, Black African or African-Caribbean background",
  t_whtr="Waist-to-height ratio (NICE, adults with BMI under 35)", t_ratio="Ratio", t_risk="Meaning",
  waist_h="How to measure your waist", waist_t="Find the bottom of your ribs and the top of your hips. Wrap a tape measure around your waist halfway between them — this is usually just above the belly button. Breathe out normally, then measure (NICE).",
  example="<b>Example:</b> 70 kg and 1.70 m → 70 ÷ (1.70 × 1.70) = <b>24.2</b>. A 85 cm waist at 170 cm height → 85 ÷ 170 = <b>0.50</b>.",
  hr_h1="Heart rate zones by age: calculator and chart", hr_title="Heart Rate Zones by Age: Calculator and Chart (Free) | IKJON",
  hr_desc="Find your maximum heart rate and your moderate and vigorous exercise zones by age, with a chart for ages 20–70 and how to check your pulse.",
  hr_card="Maximum heart rate and exercise zones by age",
  hr_lede="<b>Your maximum heart rate is about 220 minus your age.</b> Moderate exercise is about <b>50–70%</b> of that, and vigorous exercise about <b>70–85%</b> (American Heart Association). Example: at age 30 the maximum is about 190 beats a minute, so moderate is <b>95–133</b> and vigorous is <b>133–162</b>.",
  hr_who="<b>These are estimates.</b> Some medicines lower your heart rate, so your zones may be lower. If you have a heart condition or take medicine, ask your doctor what your heart rate should be. Stop exercising if you feel chest pain, dizziness or very short of breath. In an emergency call 103.",
  f_age="Your age (years)",
  t_hr="Heart rate zones by age (beats per minute)", t_age="Age", t_max="Maximum", t_mod="Moderate (50–70%)", t_vig="Vigorous (70–85%)",
  t_hr_note="Maximum = 220 − age. Zones are rounded to whole beats.",
  pulse_h="How to check your pulse", pulse_t="Put the tips of your first two fingers (not your thumb) on the inside of your wrist, on the thumb side. Press lightly, count the beats for 30 seconds and multiply by 2. A resting heart rate of 60–100 beats a minute is normal for most adults (American Heart Association).",
  hr_begin="New to exercise? Start at the low end of the moderate zone and build up slowly.",
  js=dict(dec=".", e_h="Enter your height in centimetres (100–250).", e_w="Enter your weight in kilograms (25–300).", e_waist="Enter your waist in centimetres (40–250), or leave it empty.",
          e_g="Choose your family background.", e_age="Enter an age between 18 and 90.",
          your_bmi="Your BMI", your_whtr="Your waist-to-height ratio",
          cat=dict(under="Underweight", healthy="Healthy weight", over="Overweight", obese="Obesity"),
          mean=dict(under="Your BMI is below 18.5. Being underweight can also affect your health — talk to a doctor or nurse about it.",
                    healthy="Your BMI is in the healthy range. Staying active helps you stay healthy.",
                    over="Your BMI is in the overweight range, where health risks start to rise. Being more active is a good first step. A doctor or nurse can help if you want to change your weight.",
                    obese="Your BMI is in the obesity range, where health risks are higher. Talk to a doctor or nurse — they can check your health and help you plan safe changes."),
          wcat=dict(low="Below 0.4", healthy="Healthy", inc="Increased", high="High"),
          wmean=dict(low="NICE does not give a risk band below 0.4. Check your BMI result above.",
                     healthy="0.4–0.49: no increased health risk from your waist size.",
                     inc="0.5–0.59: increased health risks. Your waist is half your height or more.",
                     high="0.6 or more: further increased health risks. Talk to a doctor or nurse."),
          w35="NICE uses the waist-to-height ratio for adults with a BMI under 35.",
          add_waist="Add your waist size to see your waist-to-height ratio — it shows fat around the middle, which BMI can miss.",
          screen="This is a screening number, not a diagnosis.",
          max="Your estimated maximum heart rate", bpm="beats a minute", mod="Moderate", vig="Vigorous",
          in30="{a}–{b} beats in 30 seconds", hr_note="These are estimates for healthy adults, not medical advice.",
          begin="New to exercise? Start near {a} beats a minute and build up slowly. If you take heart or blood-pressure medicine, ask your doctor for your zones."),
),
"uz": dict(
  hub="Sog‘liq kalkulyatorlari", hub_title="Bepul sog‘liq kalkulyatorlari: TVI, bel o‘lchami va puls zonalari | IKJON",
  hub_desc="IKJON’ning bepul va maxfiy kalkulyatorlari: tana vazni indeksi (TVI), bel va bo‘y nisbati, yoshga qarab yurak urishi zonalari. Kiritgan ma’lumotlaringiz saqlanmaydi.",
  hub_lede="NHS, NICE va Amerika yurak assotsiatsiyasi ma’lumotlariga asoslangan oddiy kalkulyatorlar. Ular brauzeringizda ishlaydi — kiritgan ma’lumotlaringiz saqlanmaydi va hech qayerga yuborilmaydi.",
  calc="Hisoblash", nojs="Bu kalkulyator uchun JavaScript kerak. Sahifadagi jadvallardan foydalanishingiz mumkin.",
  means="Natija nimani bildiradi", next="Keyingi qadam", src="Manbalar", other="Boshqa kalkulyatorlar", private="Maxfiy: kiritgan ma’lumotlaringiz saqlanmaydi va yuborilmaydi.",
  who_act="JSST kattalarga <b>haftasiga 150–300 daqiqa o‘rtacha jadallikdagi faollik</b> (yoki 75–150 daqiqa yuqori jadallikdagi faollik) va <b>haftasiga kamida 2 kun kuch mashqlari</b>ni tavsiya qiladi. Bu bepul rejalar bunga yordam beradi:",
  bmi_h1="TVI kalkulyatori: vazn, bo‘y va bel o‘lchami (kattalar uchun)", bmi_title="TVI kalkulyatori: tana vazni indeksi va bel o‘lchami (bepul) | IKJON",
  bmi_desc="Tana vazni indeksingiz (TVI) va bel-bo‘y nisbatingizni hisoblang. Osiyolik va boshqa guruhlar uchun NICE’ning past chegaralari ham bor. Bepul va maxfiy.",
  bmi_card="TVI, bel-bo‘y nisbati va ularning ma’nosi",
  bmi_lede="<b>TVI = vazn (kg) ÷ bo‘y (m)².</b> Ko‘pchilik kattalar uchun sog‘lom TVI — <b>18,5–24,9</b>. Janubiy osiyolik, xitoylik, boshqa osiyolik, Yaqin Sharq, qora tanli afrikalik yoki afro-karib kelib chiqishli odamlar uchun NICE pastroq chegaralardan foydalanadi: ortiqcha vazn <b>23</b> dan, semizlik <b>27,5</b> dan. Bel aylanangiz <b>bo‘yingizning yarmidan kam</b> bo‘lishi kerak.",
  bmi_who="<b>Kim uchun:</b> 18 yosh va undan kattalar uchun. Homilador bo‘lsangiz, ovqatlanish buzilishi bo‘lsa yoki bor deb o‘ylasangiz, yoki bo‘yingizga ta’sir qiluvchi kasallik bo‘lsa, foydalanmang (NHS tavsiyasi). TVI mushak va yog‘ni ajrata olmaydi, shuning uchun juda mushakli odamlarda yuqori chiqishi mumkin. NICE 65 yoshdan keyin ham TVIga ehtiyotkorlik bilan qarashni aytadi.",
  f_h="Bo‘y (sm)", f_w="Vazn (kg)", f_waist="Bel aylanasi (sm) — ixtiyoriy", f_g="Kelib chiqishi", f_g0="Tanlang…",
  f_glow="Janubiy osiyolik, xitoylik, boshqa osiyolik, Yaqin Sharq, qora tanli afrikalik yoki afro-karib", f_gstd="Oq tanli yoki boshqa",
  f_ghelp="Birinchi guruhdagi odamlarda sog‘liq xavfi pastroq TVIda boshlanadi, shuning uchun NICE ular uchun pastroq chegaralarni qo‘llaydi.",
  t_bmi="Kattalar uchun TVI oraliqlari (NICE)", t_cat="Oraliq", t_std="Ko‘pchilik kattalar", t_low="Osiyolik, Yaqin Sharq, qora tanli afrikalik yoki afro-karib kelib chiqishli",
  t_whtr="Bel-bo‘y nisbati (NICE, TVI 35 dan past kattalar)", t_ratio="Nisbat", t_risk="Ma’nosi",
  waist_h="Bel aylanasini qanday o‘lchash kerak", waist_t="Qovurg‘alaringizning pastki chetini va son suyagining yuqori chetini toping. Santimetr lentani ularning o‘rtasidan — odatda kindikdan biroz yuqoridan — belingiz atrofiga o‘rang. Odatdagidek nafas chiqaring va o‘lchang (NICE).",
  example="<b>Misol:</b> 70 kg va 1,70 m → 70 ÷ (1,70 × 1,70) = <b>24,2</b>. Bo‘y 170 sm, bel 85 sm → 85 ÷ 170 = <b>0,50</b>.",
  hr_h1="Yoshga qarab yurak urishi zonalari: kalkulyator va jadval", hr_title="Yoshga qarab puls zonalari: kalkulyator va jadval (bepul) | IKJON",
  hr_desc="Yoshingizga qarab maksimal pulsingizni hamda o‘rtacha va yuqori jadallikdagi mashq zonalarini toping. 20–70 yosh uchun jadval va pulsni o‘lchash usuli.",
  hr_card="Yoshga qarab maksimal puls va mashq zonalari",
  hr_lede="<b>Maksimal yurak urish tezligingiz taxminan 220 minus yoshingizga teng.</b> O‘rtacha jadallikdagi mashq uning taxminan <b>50–70%</b>i, yuqori jadallikdagi mashq taxminan <b>70–85%</b>i (Amerika yurak assotsiatsiyasi). Misol: 30 yoshda maksimum daqiqasiga taxminan 190 marta, demak o‘rtacha zona <b>95–133</b>, yuqori zona <b>133–162</b>.",
  hr_who="<b>Bu taxminiy raqamlar.</b> Ba’zi dorilar pulsni pasaytiradi, shuning uchun zonalaringiz pastroq bo‘lishi mumkin. Yurak kasalligingiz bo‘lsa yoki dori ichsangiz, pulsingiz qanday bo‘lishi kerakligini shifokoringizdan so‘rang. Ko‘krakda og‘riq, bosh aylanishi yoki kuchli hansirash bo‘lsa, mashqni to‘xtating. Favqulodda holatda 103 ga qo‘ng‘iroq qiling.",
  f_age="Yoshingiz (yil)",
  t_hr="Yoshga qarab puls zonalari (daqiqasiga urish)", t_age="Yosh", t_max="Maksimum", t_mod="O‘rtacha (50–70%)", t_vig="Yuqori (70–85%)",
  t_hr_note="Maksimum = 220 − yosh. Zonalar butun songacha yaxlitlangan.",
  pulse_h="Pulsni qanday o‘lchash kerak", pulse_t="Ko‘rsatkich va o‘rta barmoqlaringiz uchini (bosh barmoqni emas) bilagingizning ichki tomoniga, bosh barmoq tarafiga qo‘ying. Yengil bosing, 30 soniya davomida urishlarni sanang va 2 ga ko‘paytiring. Ko‘pchilik kattalarda tinch holatdagi puls daqiqasiga 60–100 marta — bu normal (Amerika yurak assotsiatsiyasi).",
  hr_begin="Mashqni endi boshlayapsizmi? O‘rtacha zonaning pastki chegarasidan boshlang va asta-sekin oshiring.",
  js=dict(dec=",", e_h="Bo‘yingizni santimetrda kiriting (100–250).", e_w="Vazningizni kilogrammda kiriting (25–300).", e_waist="Bel aylanasini santimetrda kiriting (40–250) yoki bo‘sh qoldiring.",
          e_g="Kelib chiqishingizni tanlang.", e_age="18 dan 90 gacha yoshni kiriting.",
          your_bmi="Sizning TVIngiz", your_whtr="Bel-bo‘y nisbatingiz",
          cat=dict(under="Vazn yetishmasligi", healthy="Sog‘lom vazn", over="Ortiqcha vazn", obese="Semizlik"),
          mean=dict(under="TVIngiz 18,5 dan past. Vazn yetishmasligi ham sog‘liqqa ta’sir qilishi mumkin — bu haqda shifokor yoki hamshira bilan gaplashing.",
                    healthy="TVIngiz sog‘lom oraliqda. Faol bo‘lish sog‘lom qolishga yordam beradi.",
                    over="TVIngiz ortiqcha vazn oraliqida — bu yerda sog‘liq xavfi o‘sa boshlaydi. Ko‘proq harakat qilish — yaxshi birinchi qadam. Vazningizni o‘zgartirmoqchi bo‘lsangiz, shifokor yoki hamshira yordam beradi.",
                    obese="TVIngiz semizlik oraliqida — bu yerda sog‘liq xavfi yuqoriroq. Shifokor yoki hamshira bilan gaplashing: ular sog‘lig‘ingizni tekshirib, xavfsiz o‘zgarishlarni rejalashtirishga yordam beradi."),
          wcat=dict(low="0,4 dan past", healthy="Sog‘lom", inc="Oshgan", high="Yuqori"),
          wmean=dict(low="NICE 0,4 dan past nisbat uchun xavf darajasini bermaydi. Yuqoridagi TVI natijasiga qarang.",
                     healthy="0,4–0,49: bel o‘lchami bo‘yicha sog‘liq xavfi oshmagan.",
                     inc="0,5–0,59: sog‘liq xavfi oshgan. Belingiz bo‘yingizning yarmiga teng yoki undan katta.",
                     high="0,6 va undan yuqori: sog‘liq xavfi yanada oshgan. Shifokor yoki hamshira bilan gaplashing."),
          w35="NICE bel-bo‘y nisbatini TVI 35 dan past bo‘lgan kattalar uchun qo‘llaydi.",
          add_waist="Bel-bo‘y nisbatini ko‘rish uchun bel aylanasini kiriting — u qorindagi yog‘ni ko‘rsatadi, TVI esa buni sezmasligi mumkin.",
          screen="Bu tashxis emas, balki dastlabki tekshiruv raqami.",
          max="Taxminiy maksimal pulsingiz", bpm="zarba/daqiqa", mod="O‘rtacha", vig="Yuqori",
          in30="30 soniyada {a}–{b} marta", hr_note="Bu sog‘lom kattalar uchun taxminiy raqamlar, tibbiy maslahat emas.",
          begin="Mashqni endi boshlayapsizmi? Daqiqasiga taxminan {a} martadan boshlang va asta-sekin oshiring. Yurak yoki qon bosimi dorisini ichsangiz, zonalaringizni shifokordan so‘rang."),
),
"ru": dict(
  hub="Калькуляторы здоровья", hub_title="Бесплатные калькуляторы здоровья: ИМТ, талия и пульсовые зоны | IKJON",
  hub_desc="Бесплатные калькуляторы IKJON: индекс массы тела (ИМТ), отношение талии к росту и пульсовые зоны по возрасту. Введённые данные не сохраняются и не отправляются.",
  hub_lede="Простые калькуляторы на основе рекомендаций NHS, NICE и Американской кардиологической ассоциации. Они работают в вашем браузере — введённые данные не сохраняются и никуда не отправляются.",
  calc="Рассчитать", nojs="Для калькулятора нужен JavaScript. Вы можете воспользоваться таблицами на этой странице.",
  means="Что означает результат", next="Следующий шаг", src="Источники", other="Другие калькуляторы", private="Конфиденциально: введённые данные не сохраняются и не отправляются.",
  who_act="ВОЗ рекомендует взрослым <b>150–300 минут умеренной активности в неделю</b> (или 75–150 минут интенсивной), а также <b>силовые упражнения 2 и более дней в неделю</b>. Эти бесплатные планы помогут:",
  bmi_h1="Калькулятор ИМТ и отношения талии к росту для взрослых", bmi_title="Калькулятор ИМТ и талии для взрослых (бесплатно) | IKJON",
  bmi_desc="Рассчитайте индекс массы тела (ИМТ) и отношение талии к росту. С пониженными порогами NICE для людей азиатского и другого происхождения. Бесплатно и конфиденциально.",
  bmi_card="ИМТ, отношение талии к росту и что они значат",
  bmi_lede="<b>ИМТ = вес (кг) ÷ рост (м)².</b> Для большинства взрослых нормальный ИМТ — <b>18,5–24,9</b>. Для людей южноазиатского, китайского, другого азиатского, ближневосточного, черноафриканского или афрокарибского происхождения NICE использует более низкие пороги: избыточный вес — от <b>23</b>, ожирение — от <b>27,5</b>. Окружность талии должна быть <b>меньше половины роста</b>.",
  bmi_who="<b>Для кого:</b> для взрослых от 18 лет. Не используйте калькулятор, если вы беременны, если у вас есть расстройство пищевого поведения (или вы это подозреваете) или заболевание, влияющее на рост (рекомендация NHS). ИМТ не отличает мышцы от жира, поэтому у очень мускулистых людей он может быть завышен. NICE также советует осторожно оценивать ИМТ после 65 лет.",
  f_h="Рост (см)", f_w="Вес (кг)", f_waist="Талия (см) — необязательно", f_g="Происхождение", f_g0="Выберите…",
  f_glow="Южноазиатское, китайское, другое азиатское, ближневосточное, черноафриканское или афрокарибское", f_gstd="Европейское или другое",
  f_ghelp="У людей из первой группы риски для здоровья растут при более низком ИМТ, поэтому NICE использует для них более низкие пороги.",
  t_bmi="Диапазоны ИМТ для взрослых (NICE)", t_cat="Диапазон", t_std="Большинство взрослых", t_low="Азиатское, ближневосточное, черноафриканское или афрокарибское происхождение",
  t_whtr="Отношение талии к росту (NICE, взрослые с ИМТ ниже 35)", t_ratio="Отношение", t_risk="Что значит",
  waist_h="Как измерить талию", waist_t="Найдите нижний край рёбер и верхний край тазовой кости. Оберните сантиметровую ленту вокруг талии посередине между ними — обычно чуть выше пупка. Спокойно выдохните и измерьте (NICE).",
  example="<b>Пример:</b> 70 кг и 1,70 м → 70 ÷ (1,70 × 1,70) = <b>24,2</b>. Талия 85 см при росте 170 см → 85 ÷ 170 = <b>0,50</b>.",
  hr_h1="Пульсовые зоны по возрасту: калькулятор и таблица", hr_title="Пульсовые зоны по возрасту: калькулятор и таблица (бесплатно) | IKJON",
  hr_desc="Узнайте свой максимальный пульс и зоны умеренной и интенсивной нагрузки по возрасту. Таблица для 20–70 лет и как измерить пульс.",
  hr_card="Максимальный пульс и зоны нагрузки по возрасту",
  hr_lede="<b>Максимальный пульс — примерно 220 минус ваш возраст.</b> Умеренная нагрузка — около <b>50–70%</b> от него, интенсивная — около <b>70–85%</b> (Американская кардиологическая ассоциация). Пример: в 30 лет максимум около 190 ударов в минуту, значит умеренная зона <b>95–133</b>, интенсивная <b>133–162</b>.",
  hr_who="<b>Это приблизительные значения.</b> Некоторые лекарства снижают пульс, и ваши зоны могут быть ниже. Если у вас болезнь сердца или вы принимаете лекарства, спросите врача, каким должен быть ваш пульс. Прекратите тренировку при боли в груди, головокружении или сильной одышке. В экстренной ситуации звоните 103.",
  f_age="Ваш возраст (лет)",
  t_hr="Пульсовые зоны по возрасту (ударов в минуту)", t_age="Возраст", t_max="Максимум", t_mod="Умеренная (50–70%)", t_vig="Интенсивная (70–85%)",
  t_hr_note="Максимум = 220 − возраст. Зоны округлены до целых ударов.",
  pulse_h="Как измерить пульс", pulse_t="Положите кончики двух пальцев (указательного и среднего, не большого) на внутреннюю сторону запястья со стороны большого пальца. Слегка надавите, считайте удары 30 секунд и умножьте на 2. Пульс в покое 60–100 ударов в минуту — норма для большинства взрослых (Американская кардиологическая ассоциация).",
  hr_begin="Только начинаете тренироваться? Начните с нижней границы умеренной зоны и повышайте постепенно.",
  js=dict(dec=",", e_h="Введите рост в сантиметрах (100–250).", e_w="Введите вес в килограммах (25–300).", e_waist="Введите талию в сантиметрах (40–250) или оставьте поле пустым.",
          e_g="Выберите происхождение.", e_age="Введите возраст от 18 до 90 лет.",
          your_bmi="Ваш ИМТ", your_whtr="Ваше отношение талии к росту",
          cat=dict(under="Дефицит массы тела", healthy="Нормальный вес", over="Избыточный вес", obese="Ожирение"),
          mean=dict(under="Ваш ИМТ ниже 18,5. Недостаточный вес тоже может влиять на здоровье — поговорите об этом с врачом или медсестрой.",
                    healthy="Ваш ИМТ в пределах нормы. Физическая активность помогает оставаться здоровым.",
                    over="Ваш ИМТ в диапазоне избыточного веса, где риски для здоровья начинают расти. Больше двигаться — хороший первый шаг. Если вы хотите изменить вес, вам поможет врач или медсестра.",
                    obese="Ваш ИМТ в диапазоне ожирения, где риски для здоровья выше. Поговорите с врачом или медсестрой — они проверят здоровье и помогут спланировать безопасные изменения."),
          wcat=dict(low="Ниже 0,4", healthy="Норма", inc="Повышенный риск", high="Высокий риск"),
          wmean=dict(low="NICE не даёт категории риска ниже 0,4. Ориентируйтесь на результат ИМТ выше.",
                     healthy="0,4–0,49: размер талии не повышает риски для здоровья.",
                     inc="0,5–0,59: риски для здоровья повышены. Талия равна половине роста или больше.",
                     high="0,6 и выше: риски для здоровья ещё выше. Поговорите с врачом или медсестрой."),
          w35="NICE использует отношение талии к росту для взрослых с ИМТ ниже 35.",
          add_waist="Добавьте окружность талии, чтобы увидеть отношение талии к росту — оно показывает жир на животе, который ИМТ может не учесть.",
          screen="Это скрининговый показатель, а не диагноз.",
          max="Ваш примерный максимальный пульс", bpm="ударов в минуту", mod="Умеренная", vig="Интенсивная",
          in30="{a}–{b} ударов за 30 секунд", hr_note="Это примерные значения для здоровых взрослых, а не медицинская рекомендация.",
          begin="Только начинаете? Начните примерно с {a} ударов в минуту и повышайте постепенно. Если вы принимаете лекарства для сердца или давления, узнайте свои зоны у врача."),
),
}

CSS = """<style>
.calc{background:var(--card);border:2px solid var(--teal);border-radius:16px;padding:16px;margin:18px 0}
.calc .fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:12px}
.calc label{display:grid;gap:4px;font-weight:700;font-size:.92rem}
.calc input,.calc select{font:inherit;font-size:1.05rem;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;background:var(--bg);color:var(--fg);width:100%;min-width:0}
.calc input:focus,.calc select:focus{outline:2px solid var(--teal);outline-offset:1px}
.calc .wide{grid-column:1/-1}.calc .help{font-weight:400;color:var(--mut);font-size:.85rem}
.calc-go{margin-top:14px;border:0;cursor:pointer;font:inherit;font-size:1.05rem}
.calc-priv{margin:10px 0 0;font-size:.85rem;color:var(--mut)}
.calc-out{margin-top:14px;outline:none}.calc-out p{margin:8px 0}
.calc-res{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 12px;border-left:6px solid var(--teal);background:var(--tint);border-radius:12px;padding:10px 14px;margin:12px 0 6px}
.calc-res span{font-size:.9rem;color:var(--mut);grid-column:1}.calc-res b{grid-column:2;grid-row:1/3;font:700 2rem Georgia,serif}.calc-res em{font-style:normal;font-weight:700;font-size:1.1rem;grid-column:1}
.r-under{border-color:#F2B33D}.r-healthy{border-color:#2E9E6A}.r-over{border-color:var(--orange)}.r-obese{border-color:var(--bad)}
.calc-zones{display:grid;grid-template-columns:1fr 1fr;gap:10px}.calc-zones div{border-radius:12px;padding:10px 12px;background:var(--tint);display:grid}
.calc-zones .z-mod{border-top:5px solid #2E9E6A}.calc-zones .z-vig{border-top:5px solid var(--orange)}
.calc-zones strong{font:700 1.5rem Georgia,serif}.calc-zones span,.calc-zones small{color:var(--mut);font-size:.85rem}
.calc-err{color:var(--bad);font-weight:700}
@media (max-width:420px){.calc-zones{grid-template-columns:1fr}}
</style>"""

# ---------------------------------------------------------------- helpers
def num(x, L, d=1):
    s = f"{x:.{d}f}"
    return s if L == "en" else s.replace(".", ",")

def sources(keys, L):
    return f"<h2 id='sources'>{T[L]['src']}</h2><ol class='small'>" + "".join(
        f'<li><a href="{SRC[k][1]}" rel="noopener" target="_blank">{e(SRC[k][0])}</a></li>' for k in keys) + "</ol>"

def next_links(L, extra):
    t = T[L]
    links = [plan("daily", L), plan("men", L), plan("women", L)] + extra
    return (f"<h2>{t['next']}</h2><p>{t['who_act']}</p><div class='grid'>" +
            "".join(f'<a class="card" href="{h}"><b>{e(n)}</b></a>' for h, n in links) + "</div>")

def js_json(d):
    return json.dumps(d, ensure_ascii=False).replace("</", "<\\/")

def calc_box(kind, L, fields):
    t = T[L]
    return (f'<section class="calc" data-calc="{kind}"><noscript><p class="note">{t["nojs"]}</p></noscript>'
            f'<div class="calc-js" hidden><div class="fields">{fields}</div>'
            f'<button class="btn calc-go" type="button">{t["calc"]}</button>'
            f'<p class="calc-priv">{t["private"]}</p>'
            f'<div class="calc-out" role="status" aria-live="polite" tabindex="-1" hidden></div></div></section>'
            f'<script type="application/json" id="calc-i18n">{js_json(t["js"])}</script>')

def field(id_, label, lo, hi, step="1", extra=""):
    return (f'<label for="{id_}">{label}<input id="{id_}" type="number" inputmode="decimal" min="{lo}" max="{hi}" step="{step}" autocomplete="off"{extra}></label>')

def page_ld(L, kind, title, desc, canon):
    t = T[L]
    name = t[f"{kind}_h1"]
    return [{"@context": "https://schema.org", "@type": "WebPage", "name": name, "description": desc, "url": SITE + canon, "inLanguage": L,
             "dateModified": CHECKED.isoformat(), "publisher": {"@type": "Organization", "name": "IKJON Consulting & Education Centre", "url": SITE + "/"}},
            B.bc_ld(L, [(t["hub"], hub(L)), (name, canon)])]

def other_calc(kind, L):
    t = T[L]
    o = "hr" if kind == "bmi" else "bmi"
    return f"<h2>{t['other']}</h2><div class='grid'><a class='card' href='{url(o, L)}'><b>{e(t[o + '_h1'])}</b><span>{e(t[o + '_card'])}</span></a></div>"

# ---------------------------------------------------------------- pages
def bmi_page(L):
    t = T[L]
    canon = url("bmi", L)
    alts = {k: url("bmi", k) for k in LANGS}
    fields = (field("c-h", t["f_h"], 100, 250) + field("c-w", t["f_w"], 25, 300, "0.1") + field("c-waist", t["f_waist"], 40, 250) +
              f'<label class="wide" for="c-g">{t["f_g"]}<select id="c-g"><option value="">{t["f_g0"]}</option>'
              f'<option value="low">{e(t["f_glow"])}</option><option value="std">{e(t["f_gstd"])}</option></select>'
              f'<span class="help">{t["f_ghelp"]}</span></label>')
    cats = t["js"]["cat"]
    wm = t["js"]["wmean"]
    tbl = (f"<h2>{t['means']}</h2><h3>{t['t_bmi']}</h3><div class='tbl'><table><thead><tr><th>{t['t_cat']}</th><th>{t['t_std']}</th><th>{t['t_low']}</th></tr></thead><tbody>"
           f"<tr><td>{cats['under']}</td><td>&lt; {num(18.5, L)}</td><td>&lt; {num(18.5, L)}</td></tr>"
           f"<tr><td>{cats['healthy']}</td><td>{num(18.5, L)}–{num(24.9, L)}</td><td>{num(18.5, L)}–{num(22.9, L)}</td></tr>"
           f"<tr><td>{cats['over']}</td><td>25–{num(29.9, L)}</td><td>23–{num(27.4, L)}</td></tr>"
           f"<tr><td>{cats['obese']}</td><td>30+</td><td>{num(27.5, L)}+</td></tr></tbody></table></div>"
           f"<h3 style='margin-top:18px'>{t['t_whtr']}</h3><div class='tbl'><table><thead><tr><th>{t['t_ratio']}</th><th>{t['t_risk']}</th></tr></thead><tbody>"
           f"<tr><td>{num(0.4, L)}–{num(0.49, L, 2)}</td><td>{e(wm['healthy'].split(': ', 1)[1])}</td></tr>"
           f"<tr><td>{num(0.5, L)}–{num(0.59, L, 2)}</td><td>{e(wm['inc'].split(': ', 1)[1])}</td></tr>"
           f"<tr><td>{num(0.6, L)}+</td><td>{e(wm['high'].split(': ', 1)[1])}</td></tr></tbody></table></div>"
           f"<p>{t['example']}</p>")
    b = [CSS, B.crumbs(L, [(t["hub"], hub(L)), (t["bmi_h1"], None)]), f"<h1>{e(t['bmi_h1'])}</h1>", f'<p class="lede">{t["bmi_lede"]}</p>',
         trust_box(L, CHECKED, nsrc=3, src_anchor="#sources"), f'<p class="note">{t["bmi_who"]}</p>', calc_box("bmi", L, fields), tbl,
         f"<h2>{t['waist_h']}</h2><p>{t['waist_t']}</p>",
         next_links(L, [(exu("brisk-walk", L), B.tx("Brisk walk", L)), (url("hr", L), t["hr_h1"])]),
         sources(["nhs", "nice", "who"], L), share_bar(L, SITE + canon, t["bmi_h1"]), other_calc("bmi", L)]
    return canon, B.layout(L, t["bmi_title"], t["bmi_desc"][:160], canon, alts, "".join(b), page_ld(L, "bmi", t["bmi_title"], t["bmi_desc"], canon))

def hr_page(L):
    t = T[L]
    canon = url("hr", L)
    alts = {k: url("hr", k) for k in LANGS}
    fields = field("c-age", t["f_age"], 18, 90)
    rows = ""
    for a in range(20, 75, 5):
        m = 220 - a
        r = lambda p: int(m * p + 0.5)   # round half up, as the AHA chart does
        rows += f"<tr><td>{a}</td><td>{m}</td><td>{r(.5)}–{r(.7)}</td><td>{r(.7)}–{r(.85)}</td></tr>"
    tbl = (f"<h2>{t['means']}</h2><h3>{t['t_hr']}</h3><div class='tbl'><table><thead><tr><th>{t['t_age']}</th><th>{t['t_max']}</th><th>{t['t_mod']}</th><th>{t['t_vig']}</th></tr></thead>"
           f"<tbody>{rows}</tbody></table></div><p class='small muted'>{t['t_hr_note']}</p><p>{t['hr_begin']}</p>")
    b = [CSS, B.crumbs(L, [(t["hub"], hub(L)), (t["hr_h1"], None)]), f"<h1>{e(t['hr_h1'])}</h1>", f'<p class="lede">{t["hr_lede"]}</p>',
         trust_box(L, CHECKED, nsrc=2, src_anchor="#sources"), f'<p class="note">{t["hr_who"]}</p>', calc_box("hr", L, fields), tbl,
         f"<h2>{t['pulse_h']}</h2><p>{t['pulse_t']}</p>",
         next_links(L, [(exu("brisk-walk", L), B.tx("Brisk walk", L)), (url("bmi", L), t["bmi_h1"])]),
         sources(["aha", "who"], L), share_bar(L, SITE + canon, t["hr_h1"]), other_calc("hr", L)]
    return canon, B.layout(L, t["hr_title"], t["hr_desc"][:160], canon, alts, "".join(b), page_ld(L, "hr", t["hr_title"], t["hr_desc"], canon))

def hub_page(L):
    t = T[L]
    canon = hub(L)
    alts = {k: hub(k) for k in LANGS}
    b = [B.crumbs(L, [(t["hub"], None)]), f"<h1>{e(t['hub'])}</h1>", f'<p class="lede">{t["hub_lede"]}</p>', "<div class='grid'>",
         *[f'<a class="card" href="{SLUG[k][L]}/"><b>{e(t[k + "_h1"])}</b><span>{e(t[k + "_card"])}</span></a>' for k in ("bmi", "hr")],
         "</div>", f"<p class='note' style='margin-top:24px'>{B.U[L]['p_safe']}</p>",
         f"<p><a class='exl' href='{B.lbase('plans', L)}'>{B.U[L]['plans']} →</a></p>"]
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": t["hub_title"], "description": t["hub_desc"], "url": SITE + canon, "inLanguage": L},
          B.bc_ld(L, [(t["hub"], canon)])]
    return canon, B.layout(L, t["hub_title"], t["hub_desc"][:160], canon, alts, "".join(b), ld)

def main():
    urls = []
    for L in LANGS:
        for fn in (hub_page, bmi_page, hr_page):
            c, h = fn(L)
            h = h.replace('<script src="/assets/share.js" defer></script>', '<script src="/assets/share.js" defer></script>\n<script src="/assets/calc.js" defer></script>') if fn is not hub_page else h
            B.write(c, h)
            urls.append(c)
    sm = os.path.join(ROOT, "sitemap.xml")
    s = open(sm, encoding="utf-8").read()
    s = re.sub(r"\s*<url><loc>https://www\.ikjon-gearbox\.com/calculators/[^<]*</loc>.*?</url>", "", s, flags=re.S)
    s = s.replace("</urlset>", "".join(f"\n  <url><loc>{SITE}{c}</loc><lastmod>{CHECKED.isoformat()}</lastmod></url>" for c in urls) + "\n</urlset>")
    open(sm, "w", encoding="utf-8").write(s)
    print(f"Calculators: {len(urls)} pages")

if __name__ == "__main__":
    main()

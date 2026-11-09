"""Shared pieces for IKJON's public health pages: trust box, share bar and extra styles."""
import html, urllib.parse

def e(s):
    return html.escape(str(s if s is not None else ""), quote=True)

MONTHS = {
 "en": "January February March April May June July August September October November December".split(),
 "uz": "yanvar fevral mart aprel may iyun iyul avgust sentabr oktabr noyabr dekabr".split(),
 "ru": "января февраля марта апреля мая июня июля августа сентября октября ноября декабря".split(),
}

def nice_date(d, L):
    return f"{d.day} {MONTHS[L][d.month - 1]} {d.year}"

ABOUT = {"en": "/about/health-content/", "uz": "/about/health-content/uz/", "ru": "/about/health-content/ru/"}

K = {
 "en": dict(by="Written by", team="IKJON team", src="Sources", srcn="{n} studies and guidelines", srcs="see the plan", checked="Last checked",
            how="How we write health pages", share="Share", tg="Telegram", wa="WhatsApp", copy="Copy link", copied="Link copied",
            more="More…", card="Save card"),
 "uz": dict(by="Muallif", team="IKJON jamoasi", src="Manbalar", srcn="{n} ta tadqiqot va tavsiya", srcs="rejaga qarang", checked="Oxirgi tekshiruv",
            how="Sog‘liq sahifalarini qanday yozamiz", share="Ulashish", tg="Telegram", wa="WhatsApp", copy="Havolani nusxalash", copied="Havola nusxalandi",
            more="Boshqa…", card="Kartani saqlash"),
 "ru": dict(by="Автор", team="команда IKJON", src="Источники", srcn="исследований и рекомендаций: {n}", srcs="см. план", checked="Последняя проверка",
            how="Как мы пишем о здоровье", share="Поделиться", tg="Telegram", wa="WhatsApp", copy="Скопировать ссылку", copied="Ссылка скопирована",
            more="Ещё…", card="Сохранить карточку"),
}

def trust_box(L, checked, nsrc=None, src_anchor="#research", show_src=True):
    k = K[L]
    src = (f'<a href="{src_anchor}">{e(k["srcn"].format(n=nsrc))}</a>' if nsrc else e(k["srcs"]))
    srcs = f'<span><b>{k["src"]}:</b> {src}</span>' if show_src else ""
    return (f'<div class="trust"><span><b>{k["by"]}:</b> {k["team"]}</span>{srcs}'
            f'<span><b>{k["checked"]}:</b> <time datetime="{checked.isoformat()}">{nice_date(checked, L)}</time></span>'
            f'<a href="{ABOUT[L]}">{k["how"]} →</a></div>')

def share_bar(L, url, title, card=None):
    k = K[L]
    q = urllib.parse.quote
    tg = f"https://t.me/share/url?url={q(url, safe='')}&text={q(title, safe='')}"
    wa = f"https://wa.me/?text={q(title + ' ' + url, safe='')}"
    c = f'<a class="sb" href="{e(card)}" download>{k["card"]}</a>' if card else ""
    return (f'<div class="sharebar" data-url="{e(url)}" data-title="{e(title)}" data-copied="{e(k["copied"])}"><b>{k["share"]}:</b>'
            f'<a class="sb tg" href="{e(tg)}" target="_blank" rel="noopener">{k["tg"]}</a>'
            f'<a class="sb wa" href="{e(wa)}" target="_blank" rel="noopener">{k["wa"]}</a>'
            f'<button class="sb js" type="button" data-act="copy" hidden>{k["copy"]}</button>'
            f'<button class="sb js" type="button" data-act="share" hidden>{k["more"]}</button>{c}</div>')

EXTRA_CSS = """
.trust{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;font-size:.86rem;color:var(--mut);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--card)}
.trust b{color:var(--fg);font-weight:700}.trust a{color:var(--teal);font-weight:700}
.sharebar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:18px 0;font-size:.9rem}
.sb{display:inline-flex;align-items:center;border:1.5px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;padding:6px 13px;font:700 .86rem inherit;text-decoration:none;cursor:pointer}
.sb:hover{border-color:var(--teal)}.sb.tg{border-color:#2AABEE;color:#1C8AD1}.sb.wa{border-color:#25D366;color:#128C4A}
.qa{margin:6px 0 14px}.qa h3{font-size:1.05rem;margin:16px 0 4px}.qa p{margin:0}
a.exl{color:inherit;text-decoration-color:var(--teal);text-underline-offset:3px}
"""

import re as _re
def ex_slug(name):
    return _re.sub(r"[^a-z0-9]+", "-", name.lower().replace("'", "").replace("’", "")).strip("-")

def ex_base(L):
    return "/exercises/" if L == "en" else f"/exercises/{L}/"

CARDS = []   # filled by the builders; tools/build_cards.js renders them

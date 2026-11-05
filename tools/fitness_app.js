/* ===== IKJON Fitness app (built by tools/build_fitness.py — edit this file, not fitness/index.html) ===== */
const KEY="ikjon-fitness-v1";
let S={lang:null,plan:null,hist:{}};
try{const o=JSON.parse(localStorage.getItem(KEY)||"null");if(o)S=Object.assign(S,o)}catch(e){}
if(!S.hist)S.hist={};
if(!S.lang){const n=(navigator.language||"en").slice(0,2).toLowerCase();S.lang=n==="uz"?"uz":n==="ru"?"ru":"en"}
try{const q=new URLSearchParams(location.search).get("lang");if(["en","uz","ru"].includes(q))S.lang=q}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const LI=()=>({en:0,uz:1,ru:2})[S.lang]||0;
const tr=s=>S.lang==="en"||!s?s:((I18N[S.lang]||{})[s]||s);
function t(k,v){let s=(U[k]||[k])[LI()]||U[k][0];if(v)for(const x in v)s=s.split("{"+x+"}").join(v[x]);return s}
const app=document.getElementById("app");
let view="today",cur=null,selDay=null,monthPage=null,areaF="all",q="",lic={busy:false,msg:"",bad:false,confirmOff:false},confirmWipe=false,ses=null,tick=null;

/* ---------- exercises ---------- */
function fx(id){const f=FX[id];if(f)return{id,name:f[0],area:f[1],target:f[2],steps:f[3],tip:f[4],type:f[5],icon:f[6],own:true};
 const e=EX[id];return{id,name:e[0],area:AREAOF[id]||"core",target:e[2],steps:e[3],tip:e[4],type:e[6],own:false}}
const iconSVG=(n,sz)=>`<svg viewBox="0 0 48 48" width="${sz||28}" height="${sz||28}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||ICONS.core}</svg>`;
const iconTile=(n,cls)=>`<div class="${cls||"mini"} itile" aria-hidden="true">${iconSVG(n,cls==="demo"?96:30)}</div>`;
const visMini=id=>FX[id]?iconTile(FX[id][6],"mini"):thumb(id,"mini");
const visBig=id=>FX[id]?iconTile(FX[id][6],"demo"):demoBlock(id);
const fmtT=s=>s>=60?(s%60?`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")} ${t("min")}`:`${s/60} ${t("min")}`):`${s} ${t("sec")}`;
const ONE_SIDED=new Set(["reverse_lunge","sl_rdl","bulgarian","split_squat","step_up","side_lunge","sl_bridge","clamshell","hip_abd","fire_hydrant","glute_kickback","side_plank","bird_dog","hip_circles","hip_flexor_stretch","ham_stretch","quad_stretch","calf_stretch","knee_to_chest","open_book","sl_balance","carry"]);
const doseTxt=x=>!x.t&&!x.r?"":(x.s>1?x.s+" × ":"")+(x.t?fmtT(x.t):x.r)+(ONE_SIDED.has(x.e)?" "+t("each"):"");
const estMin=list=>Math.max(1,Math.round(list.reduce((a,x)=>a+x.s*((x.t||x.r*3.5)*(ONE_SIDED.has(x.e)?2:1))+(x.s-1)*30+15,0)/60));

/* ---------- plans & days ---------- */
const planById=id=>PLANS.find(p=>p.id===id);
const dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const dateOf=(p,n)=>{const [y,m,d]=p.start.split("-").map(Number);return new Date(y,m-1,d+n-1)};
function dayNum(p){const [y,m,d]=p.start.split("-").map(Number),n=new Date();return Math.round((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(y,m-1,d))/864e5)+1}
const totalDays=p=>planById(p.id).months*30;
const lvlMul=p=>(LEVELS.find(l=>l[0]===p.lvl)||LEVELS[1])[2];
function scaleList(list,p,n,care){const m=Math.floor((n-1)/30)+(p.cycle||0),w=Math.floor(((n-1)%30)/7.5);
 return list.map(([e,s,r,tm])=>{if(care||e==="walk")return{e,s,r,t:tm};
  const f=lvlMul(p)*(1+.15*Math.min(m,3)+.05*w),ty=fx(e).type;
  const sets=s+((m>=2&&s>=3&&(ty==="Strength"||ty==="Core"))?1:0);
  return{e,s:sets,r:r?Math.max(4,Math.round(r*f)):0,t:tm?Math.round(tm*(ty==="Stretch"||ty==="Breathing"?1:f)/5)*5:0}})}
function careFor(p,n){const pl=planById(p.id),i=n-1;
 if(pl.care==="full")return CARE.map(([a,opts])=>opts[i%opts.length]);
 if(pl.care==="face"){const g=a=>CARE.find(c=>c[0]===a)[1];const f=g("face");return[f[i%f.length],f[(i+1)%f.length],g("eyes")[i%3],g("neck")[i%4],g("hair")[0]]}
 return[]}
function workFor(p,n){const pl=planById(p.id),wid=pl.week[(n-1)%7];const w=WK[wid];return{id:wid,name:w[0],icon:w[1],list:scaleList(w[2],p,n),warm:wid!=="rest"&&wid!=="hairday"&&wid!=="active"}}
function habitsFor(p,n){const pl=planById(p.id),wd=(dateOf(p,n).getDay()+6)%7;
 return pl.habits.map(k=>["h:"+k,HAB[k]]).concat((WEEKLY[wd]||[]).map((s,j)=>["w:"+j,s]))}
const dayRec=(p,n)=>{const k=dayKey(dateOf(p,n));return S.hist[k]||(S.hist[k]={})};
const peekRec=(p,n)=>S.hist[dayKey(dateOf(p,n))]||{};
function dayDone(p,n){const r=peekRec(p,n);return !!r.work&&(careFor(p,n).length===0||!!r.care)}

/* ---------- premium (shared IKJON licence) ---------- */
const PREMIUM_LIVE=false,FREE_DAYS=7;
try{const m=new URLSearchParams(location.search).get("premium");if(m==="preview")localStorage.setItem("ikjon-premium-preview","1");if(m==="off")localStorage.removeItem("ikjon-premium-preview")}catch(e){}
const premiumOn=()=>{if(PREMIUM_LIVE)return true;try{return localStorage.getItem("ikjon-premium-preview")==="1"}catch(e){return false}};
function rehabPro(){try{const o=JSON.parse(localStorage.getItem("ikjon-rehab-v2")||"null");return o&&o.pro&&o.pro.key?o.pro:null}catch(e){return null}}
const isPro=()=>!!(S.pro&&S.pro.key)||!!rehabPro();
const LICCFG={api:"https://api.lemonsqueezy.com/v1/licenses/",storeId:512569,productIds:[1492844],checkout:"https://ikjon-gearbox.lemonsqueezy.com/checkout/buy/e5932ea5-cacc-4f5e-bd52-f493273b9cfb"};
const TEST_KEY="IKJON-TEST-0000-PREVIEW",RECHECK_DAYS=3;
function lsPost(action,params){const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),15000);
 return fetch(LICCFG.api+action,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(params).toString(),signal:ctl.signal,credentials:"omit",referrerPolicy:"no-referrer"})
  .then(r=>r.json().catch(()=>({error:"HTTP "+r.status}))).finally(()=>clearTimeout(tm))}
const ourProduct=m=>!!m&&String(m.store_id)===String(LICCFG.storeId)&&(!LICCFG.productIds.length||LICCFG.productIds.map(String).includes(String(m.product_id)));
function activateKey(raw){const key=String(raw||"").trim();
 if(!/^[A-Za-z0-9-]{8,64}$/.test(key)){lic={bad:true,msg:t("m_bad")};render();return}
 if(key===TEST_KEY){if(PREMIUM_LIVE||!premiumOn()){lic={bad:true,msg:t("m_invalid")};render();return}
  S.pro={key,inst:"test",status:"active",chk:Date.now(),test:true};save();lic={bad:false,msg:t("m_test")};render();return}
 if(!navigator.onLine){lic={bad:true,msg:t("m_offline")};render();return}
 lic={busy:true,msg:t("m_check")};render();
 lsPost("activate",{license_key:key,instance_name:"IKJON Fitness · "+Math.random().toString(36).slice(2,8)})
 .then(j=>{if(j&&j.activated&&ourProduct(j.meta)){S.pro={key,inst:j.instance&&j.instance.id,status:j.license_key&&j.license_key.status||"active",exp:j.license_key&&j.license_key.expires_at||null,chk:Date.now(),plan:j.meta.variant_name||""};save();lic={msg:t("m_ok")}}
   else if(j&&j.activated){lsPost("deactivate",{license_key:key,instance_id:j.instance&&j.instance.id}).catch(()=>{});lic={bad:true,msg:t("m_other")}}
   else lic={bad:true,msg:/limit/i.test(j&&j.error||"")?t("m_limit"):t("m_invalid")};render()})
 .catch(()=>{lic={bad:true,msg:t("m_net")};render()})}
function removeKey(){const k=S.pro;if(!k)return;const done=()=>{delete S.pro;save();lic={msg:t("m_removed")};render()};
 if(k.test||!k.inst){done();return}lic={busy:true,msg:t("removing")};render();lsPost("deactivate",{license_key:k.key,instance_id:k.inst}).then(done,done)}
function recheckKey(){const k=S.pro;if(!k||k.test||!k.inst||!navigator.onLine||Date.now()-(k.chk||0)<RECHECK_DAYS*864e5)return;
 lsPost("validate",{license_key:k.key,instance_id:k.inst}).then(j=>{if(!S.pro)return;
  if(j&&j.valid&&ourProduct(j.meta)){S.pro.status=j.license_key&&j.license_key.status||"active";S.pro.exp=j.license_key&&j.license_key.expires_at||null;S.pro.chk=Date.now();save();return}
  const st=j&&j.license_key&&j.license_key.status;
  if(j&&j.valid===false&&(st==="expired"||st==="disabled"||/not found|invalid/i.test(j.error||""))){delete S.pro;save();lic={bad:true,msg:t("m_ended")};render()}}).catch(()=>{})}
const dayLocked=(p,n)=>premiumOn()&&!isPro()&&!!p&&!planById(p.id).free&&n>FREE_DAYS;
function premCard(n){return `<div class="prem"><span class="chip">${t("prem")}</span><h3 style="margin:0">${esc(t("prem_lock",{n}))}</h3>
 <p>${esc(t("prem_free",{n:FREE_DAYS}))}</p><p>${esc(t("prem_list"))}</p><div class="row"><button class="btn warm" data-go="premium">${t("see_prem")}</button></div></div>`}
function licBox(){const m=lic.msg?`<p role="status" style="margin:8px 0 0;font-weight:700;color:${lic.bad?"var(--bad)":"var(--good)"}">${esc(lic.msg)}</p>`:"";
 if(!(S.pro&&S.pro.key)&&rehabPro())return `<h3>${t("pro_on")}</h3><p class="muted">${t("pro_rehab")}</p>`;
 if(S.pro&&S.pro.key){const k=S.pro;return `<h3>${t("pro_on")}</h3><p class="muted">${esc(t("key_end",{k:k.key.slice(-4)}))}${k.plan?" · "+esc(k.plan):""}${k.exp?" · "+esc(new Date(k.exp).toLocaleDateString()):""}</p>${m}
  <div class="row" style="margin-top:12px">${lic.confirmOff?`<span>${t("remove_q")}</span><button class="btn sm" style="background:var(--bad)" id="licOffYes">${t("yes_rm")}</button><button class="btn alt sm" id="licOffNo">${t("keep")}</button>`:`<button class="btn alt sm" id="licOffAsk">${t("remove")}</button>`}</div>`}
 return `<h3>${t("have_key")}</h3><div class="row" style="margin-top:8px"><input id="licIn" class="search" style="flex:1 1 220px" placeholder="${esc(t("key_ph"))}" autocomplete="off" spellcheck="false"><button class="btn" id="licGo" ${lic.busy?"disabled":""}>${t("activate")}</button></div>${m}`}
function premiumView(){return `<button class="back" data-go="today">${t("back")}</button><span class="chip o">${t("prem")}</span><h1 style="margin:6px 0 10px">IKJON Premium</h1>
 <div class="box"><p>${esc(t("prem_list"))}</p><p class="muted" style="margin-top:8px">${esc(t("prem_free",{n:FREE_DAYS}))}</p><p style="margin-top:8px"><b>${esc(t("prem_shared"))}</b></p>
 ${premiumOn()?`<div class="row" style="gap:8px;margin:12px 0"><div class="box" style="flex:1 1 140px;padding:12px"><b>${t("monthly")}</b><br><span class="muted">${t("p_month")}</span></div><div class="box" style="flex:1 1 140px;padding:12px"><b>${t("yearly")}</b><br><span class="muted">${t("p_year")}</span></div></div>
 <a class="btn warm" href="${LICCFG.checkout}" target="_blank" rel="noopener">${t("buy")}</a><p class="muted small" style="margin-top:8px">${t("cancel_any")}</p>`:`<p class="notice" style="margin-top:12px">${t("soon")}</p>`}</div>
 <div class="box" style="margin-top:12px">${licBox()}</div>`}

/* ---------- rendering helpers ---------- */
function exRow(x){const e=fx(x.e);return `<li class="ex" data-ex="${x.e}" data-dose="${esc(doseTxt(x))}" tabindex="0" role="button">${visMini(x.e)}<div><b>${esc(tr(e.name))}</b><br><span class="dose">${esc(doseTxt(x))}</span><span class="note">${esc(tr(e.target))}</span></div></li>`}
function planCard(pl,active){const tag=pl.free?t("free"):premiumOn()?t("first_free",{n:FREE_DAYS}):"";
 return `<div class="card pl"><div class="plico">${iconSVG(pl.id==="men"?"arm":pl.id==="women"?"hip":pl.id==="hair"?"hair":pl.id==="face"?"face":"body",34)}</div>
 <span class="chip${pl.free?"":" o"}">${esc(tr(pl.tag))}</span><h3>${esc(tr(pl.name))}</h3><p class="muted">${esc(tr(pl.desc))}</p>
 ${tag&&!pl.free?`<span class="meta">${esc(tag)}</span>`:""}
 ${active?`<p class="meta"><b>${t("current")}</b></p>`:`<button class="btn sm" data-pick="${pl.id}">${t("start")}</button>`}</div>`}
function dayPanel(p,n){if(n<1)return `<div class="box">${esc(t("not_started",{d:dateOf(p,1).toLocaleDateString()}))}</div>`;
 if(dayLocked(p,n))return premCard(n);
 const r=peekRec(p,n),care=scaleList(careFor(p,n).map(x=>[x[0],x[1],x[2],x[3]]),p,n,true),w=workFor(p,n),hab=habitsFor(p,n);
 const careH=care.length?`<section class="box blk"><div class="bh">${iconSVG("hair",24)}<div><h3>${t("care_h")}</h3><p class="muted small">${esc(t("mins",{m:estMin(care)}))}</p></div>
  <label class="tick"><input type="checkbox" data-k="care" ${r.care?"checked":""}> ${t("done_care")}</label></div>
  <ul class="exlist">${care.map(exRow).join("")}</ul><div class="row" style="margin-top:12px"><button class="btn" data-sess="care">${t("go_care")}</button></div></section>`:"";
 const workH=`<section class="box blk"><div class="bh">${iconSVG(ICONK[w.icon]||"core",24)}<div><h3>${t("work_h")}: ${esc(tr(w.name))}</h3><p class="muted small">${esc(t("mins",{m:estMin(w.list)+(w.warm?3:0)}))}</p></div>
  <label class="tick"><input type="checkbox" data-k="work" ${r.work?"checked":""}> ${t("done_work")}</label></div>
  ${w.warm?`<p class="muted small" style="margin-top:8px">${t("warm")}</p>`:""}<ul class="exlist">${w.list.map(exRow).join("")}</ul>
  <div class="row" style="margin-top:12px"><button class="btn warm" data-sess="work">${t("go_work")}</button></div></section>`;
 const habH=`<section class="box blk"><div class="bh">${iconSVG("heart",24)}<h3>${t("habits_h")}</h3></div><ul class="tasks">${hab.map(([k,s])=>`<li><input type="checkbox" id="hb-${k}" data-k="${k}" ${r[k]?"checked":""}><label for="hb-${k}">${esc(tr(s))}</label></li>`).join("")}</ul></section>`;
 return careH+workH+habH}

/* ---------- views ---------- */
function todayView(){const p=S.plan;
 if(!p)return `<section class="hero1"><p class="eyebrow">${t("hero_eye")}</p><h1>${t("hero_h")}</h1><p class="lede">${t("hero_p")}</p><p class="muted small" style="margin-top:8px">${t("private")}</p></section>
  <section class="section"><h2>${t("choose")}</h2><div class="grid" style="margin-top:12px">${PLANS.map(pl=>planCard(pl,false)).join("")}</div></section>`;
 const pl=planById(p.id),tot=totalDays(p),n=Math.min(dayNum(p),tot+1),mi=Math.max(0,Math.min(pl.months-1,Math.floor((Math.max(n,1)-1)/30)));
 const done=Array.from({length:Math.min(Math.max(n,0),tot)},(_,i)=>dayDone(p,i+1)).filter(Boolean).length;
 const head=`<section class="today"><div class="top2"><div><p class="eyebrow">${esc(tr(pl.name))}</p><h1>${n>tot?t("finished"):n<1?esc(t("not_started",{d:dateOf(p,1).toLocaleDateString()})):esc(t("day_of",{n,t:tot}))}</h1>
  <p>${pl.months>1?esc(tr(MONTHS[mi]))+" · ":""}${esc(tr((LEVELS.find(l=>l[0]===p.lvl)||LEVELS[1])[1]))}</p></div>
  <div class="ring" style="--v:${Math.round(done/tot*100)}"><b>${Math.round(done/tot*100)}%</b></div></div>
  <div class="pbar"><i style="width:${Math.round(done/tot*100)}%"></i></div>
  <div class="row"><span>${esc(t("of_month",{a:done,b:tot}))} · ${t("streak")}: <b>${streak()}</b></span><button class="btn alt sm" data-go="month">${t("seeplan")}</button></div></section>`;
 if(n>tot)return head+`<div class="row" style="margin-top:16px"><button class="btn warm" id="again">${t("again")}</button><button class="btn alt" data-go="plans">${t("t_plans")}</button></div>`;
 return head+`<div class="daygrid">${dayPanel(p,n)}</div>`}
function plansView(){const p=S.plan;return `<h1>${t("choose")}</h1><p class="muted" style="margin:6px 0 14px">${t("private")}</p>
 <div class="box"><b>${t("level")}</b><div class="seg" role="group" style="margin-top:8px">${LEVELS.map(l=>`<button data-lvl="${l[0]}" aria-pressed="${(S.lvlPick||"regular")===l[0]}">${esc(tr(l[1]))}</button>`).join("")}</div><p class="muted small" style="margin-top:6px">${t("lvl_help")}</p>${p?`<p class="muted small" style="margin-top:6px">${t("switch_warn")}</p>`:""}</div>
 <div class="grid" style="margin-top:14px">${PLANS.map(pl=>planCard(pl,p&&p.id===pl.id)).join("")}</div>`}
function monthView(){const p=S.plan;if(!p)return `<h1>${t("month_plan")}</h1><p class="muted" style="margin:8px 0 14px">${t("no_plan")}</p><button class="btn" data-go="plans">${t("t_plans")}</button>`;
 const pl=planById(p.id),tot=totalDays(p),now=dayNum(p);if(monthPage==null)monthPage=Math.max(0,Math.min(pl.months-1,Math.floor((Math.max(now,1)-1)/30)));
 const a=monthPage*30+1,b=a+29,wd=(dateOf(p,a).getDay()+6)%7,wk=t("wk").split(" ");
 let cells=wk.map(x=>`<div class="wk">${x}</div>`).join("")+Array.from({length:wd},()=>"<div></div>").join("");
 for(let n=a;n<=b;n++){const w=pl.week[(n-1)%7],cls=["dc"];if(dayDone(p,n))cls.push("done");if(n===now)cls.push("today");if(n===selDay)cls.push("sel");if(n>now)cls.push("future");if(dayLocked(p,n))cls.push("lock");if(w==="rest")cls.push("rest");
  cells+=`<button class="${cls.join(" ")}" data-day="${n}" style="background:${KCOL[WK[w][1]]||"var(--tint)"}" aria-label="${esc(t("day",{n}))}: ${esc(tr(WK[w][0]))}">${dateOf(p,n).getDate()}</button>`}
 const sd=selDay&&selDay>=a&&selDay<=b?selDay:Math.min(Math.max(now,a),b);selDay=sd;
 return `<h1>${t("month_plan")}</h1><p class="muted" style="margin:6px 0 12px">${esc(tr(pl.name))} · ${t("month_p")}</p>
 ${pl.months>1?`<div class="seg" role="group">${Array.from({length:pl.months},(_,i)=>`<button data-mp="${i}" aria-pressed="${i===monthPage}">${esc(tr(MONTHS[i]))}</button>`).join("")}</div>`:""}
 <div class="calbox box"><div class="cal7">${cells}</div><p class="muted small" style="margin-top:8px">✓ ${t("legend_done")} · <span style="box-shadow:0 0 0 2px var(--orange) inset;border-radius:4px;padding:0 4px">${t("legend_today")}</span>${premiumOn()&&!isPro()&&!pl.free?" · 🔒 "+t("legend_lock"):""}</p></div>
 <h2 style="margin:18px 0 8px">${esc(t("day",{n:sd}))} · ${esc(dateOf(p,sd).toLocaleDateString())}</h2><div class="daygrid">${dayPanel(p,sd)}</div>`}
function bodyView(){if(cur)return areaView(cur);
 return `<h1>${t("body_h")}</h1><p class="muted" style="margin:6px 0 14px">${t("body_p")}</p>
 <div class="agrid">${AREAS.map(([id,nm,ic])=>`<button class="card acard" data-area="${id}">${iconSVG(ic,34)}<b>${esc(tr(nm))}</b></button>`).join("")}</div>`}
function areaView(id){const a=AREAS.find(x=>x[0]===id),ids=allEx().filter(e=>fx(e).area===id);
 return `<button class="back" data-go="body">${t("back")}</button><div class="row" style="gap:12px">${iconSVG(a[2],42)}<h1>${esc(tr(a[1]))}</h1></div>
 <div class="box" style="margin-top:14px"><h3>${t("what_helps")}</h3><ul>${(AREATIPS[id]||[]).map(s=>`<li>${esc(tr(s))}</li>`).join("")}</ul></div>
 ${ids.length?`<h2 style="margin:18px 0 6px">${t("area_ex")}</h2><ul class="exlist">${ids.map(e=>exRow({e,s:1,r:0,t:0})).join("").replace(/<span class="dose">[^<]*<\/span>/g,"")}</ul>`:""}`}
const allEx=()=>Object.keys(FX).concat(Object.keys(AREAOF));
function libView(){const ql=q.trim().toLowerCase();const ids=allEx().filter(e=>{const x=fx(e);return(areaF==="all"||x.area===areaF)&&(!ql||(tr(x.name)+" "+x.name+" "+tr(x.target)).toLowerCase().includes(ql))});
 return `<h1>${t("lib_h")}</h1><input class="search" id="q" style="margin:12px 0;width:100%" placeholder="${esc(t("search"))}" value="${esc(q)}">
 <div class="chips">${[["all",t("all")]].concat(AREAS.map(a=>[a[0],tr(a[1])])).filter(([id])=>id==="all"||allEx().some(e=>fx(e).area===id)).map(([id,nm])=>`<button class="fbtn" data-af="${id}" aria-pressed="${areaF===id}">${esc(nm)}</button>`).join("")}</div>
 <ul class="exlist">${ids.map(e=>exRow({e,s:1,r:0,t:0})).join("").replace(/<span class="dose">[^<]*<\/span>/g,"")}</ul>`}
function streak(){const p=S.plan;if(!p)return 0;let n=Math.min(dayNum(p),totalDays(p)),s=0;if(n>0&&!dayDone(p,n))n--;while(n>0&&dayDone(p,n)){s++;n--}return s}
function progView(){const p=S.plan;if(!p)return `<h1>${t("t_prog")}</h1><p class="muted" style="margin:8px 0 14px">${t("no_plan")}</p><button class="btn" data-go="plans">${t("t_plans")}</button>`;
 const tot=totalDays(p),now=Math.min(dayNum(p),tot),done=Array.from({length:Math.max(0,now)},(_,i)=>dayDone(p,i+1)).filter(Boolean).length;
 let hs=0,ht=0;for(let n=Math.max(1,now-6);n<=now;n++){const r=peekRec(p,n);habitsFor(p,n).forEach(([k])=>{ht++;if(r[k])hs++})}
 const bars=Array.from({length:14},(_,i)=>{const n=now-13+i;if(n<1)return `<div class="bcol"><i style="height:0"></i><span></span></div>`;const r=peekRec(p,n),hab=habitsFor(p,n),sc=((r.care||!careFor(p,n).length)?1:0)+(r.work?1:0)+hab.filter(([k])=>r[k]).length/hab.length;
  return `<div class="bcol" title="${esc(dateOf(p,n).toLocaleDateString())}"><i style="height:${Math.round(sc/3*100)}%"></i><span>${dateOf(p,n).getDate()}</span></div>`}).join("");
 return `<h1>${t("t_prog")}</h1><p class="muted" style="margin:6px 0 14px">${esc(tr(planById(p.id).name))}</p>
 <div class="stats"><div class="stat box"><b>${done}/${tot}</b><span>${t("days_done")}</span></div><div class="stat box"><b>${streak()}</b><span>${t("streak")}</span></div><div class="stat box"><b>${ht?Math.round(hs/ht*100):0}%</b><span>${t("habit_rate")}</span></div></div>
 <div class="box" style="margin-top:14px"><h3>${t("last14")}</h3><div class="bars">${bars}</div></div>`}
function settingsView(){return `<button class="back" data-go="today">${t("back")}</button><h1>${t("settings")}</h1>
 <div class="box" style="margin-top:14px"><h3>${t("lang")}</h3><div class="seg" role="group" style="margin-top:8px">${[["en","English"],["uz","O‘zbekcha"],["ru","Русский"]].map(([k,n])=>`<button data-lang="${k}" aria-pressed="${S.lang===k}" lang="${k}">${n}</button>`).join("")}</div></div>
 <div class="box" style="margin-top:12px"><span class="chip o">${t("prem")}</span><div style="margin-top:8px">${licBox()}</div><div class="row" style="margin-top:10px"><button class="btn alt sm" data-go="premium">${t("see_prem")}</button></div></div>
 <div class="box" style="margin-top:12px"><h3>${t("data_h")}</h3><p class="muted">${t("data_p")}</p><div class="row" style="margin-top:10px"><button class="btn alt sm" id="exp">${t("export")}</button>
 ${confirmWipe?`<span>${t("wipe_q")}</span><button class="btn sm" style="background:var(--bad)" id="wipeYes">${t("yes_del")}</button><button class="btn alt sm" id="wipeNo">${t("cancel")}</button>`:`<button class="btn alt sm" id="wipe">${t("wipe")}</button>`}</div></div>
 <div class="box" style="margin-top:12px"><h3>${t("disc_h")}</h3><p>${esc(t("disc"))}</p></div>
 <div class="box" style="margin-top:12px"><h3>${t("legal_h")}</h3><p class="muted">${t("legal_note")}</p><div class="row" style="margin-top:8px"><a class="btn alt sm" href="/rehab/privacy.html" target="_blank" rel="noopener">${t("privacy")}</a><a class="btn alt sm" href="/rehab/terms.html" target="_blank" rel="noopener">${t("terms")}</a></div><p class="muted small" style="margin-top:10px">${esc(t("contact"))}</p></div>
 <div class="box" style="margin-top:12px"><h3>${t("other_apps")}</h3><a href="/rehab/">${t("rehab_link")}</a></div>`}

/* ---------- guided session ---------- */
function startSession(kind){const p=S.plan,n=view==="month"&&selDay?selDay:dayNum(p);
 const list=kind==="care"?scaleList(careFor(p,n).map(x=>[x[0],x[1],x[2],x[3]]),p,n,true):(()=>{const w=workFor(p,n);return(w.warm?scaleList(WARM,p,n,true):[]).concat(w.list)})();
 ses={kind,n,list,i:0,set:1,mode:"work",left:0,running:false,done:false};prep();view="session";render();scrollTo(0,0)}
function prep(){const x=ses.list[ses.i];ses.mode="work";ses.left=x.t||0;ses.running=!!x.t}
function nextStep(){const x=ses.list[ses.i];if(ses.mode==="work"&&ses.set<x.s){ses.mode="rest";ses.left=30;ses.running=true;render();return}
 if(ses.mode==="rest"){ses.set++;ses.mode="work";ses.left=x.t||0;ses.running=!!x.t;render();return}
 ses.i++;ses.set=1;if(ses.i>=ses.list.length){finishSession();return}prep();render()}
function finishSession(){ses.done=true;stopTick();const r=dayRec(S.plan,ses.n);r[ses.kind]=true;save();render()}
function stopTick(){if(tick){clearInterval(tick);tick=null}}
function sessionView(){if(ses.done)return `<div class="box" style="text-align:center;padding:28px"><div style="font-size:3rem">🎉</div><h1>${t("well_done")}</h1><p class="muted" style="margin:8px 0 16px">${t("saved")}</p><button class="btn" id="sesHome">${t("home")}</button></div>`;
 const x=ses.list[ses.i],e=fx(x.e),nx=ses.list[ses.i+1];
 return `<div class="row" style="justify-content:space-between"><span class="muted">${esc(t("ex_of",{a:ses.i+1,b:ses.list.length}))}${x.s>1?" · "+esc(t("set_of",{a:ses.set,b:x.s})):""}</span><button class="btn alt sm" id="sesQuit">${t("quit")}</button></div>
 <div class="pbar" style="margin:10px 0 14px"><i style="width:${Math.round(ses.i/ses.list.length*100)}%"></i></div>
 ${ses.mode==="rest"?`<div class="box player" style="text-align:center"><p class="eyebrow">${t("rest")}</p><div class="big">${ses.left}</div><p class="muted">${esc(t("next_up",{x:tr(e.name)}))}</p><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="sesNext">${t("skip")}</button></div></div>`:
 `<div class="box player"><h2>${esc(tr(e.name))}</h2><p class="dose" style="font-size:1.1rem;margin:4px 0">${esc(x.t?fmtT(x.t):x.r+(ONE_SIDED.has(x.e)?" "+t("each"):""))}</p>${visBig(x.e)}
  <ol class="steps">${e.steps.map(s=>`<li>${esc(tr(s))}</li>`).join("")}</ol>${e.tip?`<p class="muted small"><b>${t("tip")}:</b> ${esc(tr(e.tip))}</p>`:""}
  ${x.t?`<div class="big" style="text-align:center">${ses.left}</div>`:""}
  <div class="row" style="justify-content:center;margin-top:12px">${x.t?`<button class="btn alt" id="sesPause">${ses.running?t("pause"):t("resume")}</button>`:""}<button class="btn warm" id="sesNext">${t("done_set")}</button><button class="btn alt" id="sesSkip">${t("skip")}</button></div>
  ${nx?`<p class="muted small" style="text-align:center;margin-top:10px">${esc(t("next_up",{x:tr(fx(nx.e).name)}))}</p>`:""}</div>`}`}
function runTick(){stopTick();if(!ses||ses.done)return;tick=setInterval(()=>{if(view!=="session"||!ses||!ses.running)return;ses.left--;const el=document.querySelector(".player .big");if(el)el.textContent=Math.max(0,ses.left);
 if(ses.left<=0){try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}nextStep()}},1000)}

/* ---------- exercise dialog ---------- */
function openEx(id,dose){const e=fx(id),d=document.getElementById("exDlg");
 document.getElementById("exDlgBody").innerHTML=`<span class="chip">${esc(tr(AREAS.find(a=>a[0]===e.area)[1]))} · ${esc(tr(e.type))}</span><h2 style="margin:6px 0">${esc(tr(e.name))}</h2>${dose?`<p class="dose">${esc(dose)}</p>`:""}
 ${visBig(id)}<p style="margin-top:10px"><b>${t("works")}:</b> ${esc(tr(e.target))}</p><h3 style="margin-top:12px">${t("how")}</h3><ol class="steps">${e.steps.map(s=>`<li>${esc(tr(s))}</li>`).join("")}</ol>
 ${e.tip?`<p class="muted"><b>${t("tip")}:</b> ${esc(tr(e.tip))}</p>`:""}<div class="row end"><button class="btn" id="dlgClose">${t("close")}</button></div>`;
 if(d.showModal&&!d.open)d.showModal();mountAnims();document.getElementById("dlgClose").onclick=()=>d.close()}

/* ---------- consent gate ---------- */
function gate(){const g=document.getElementById("gate");if(S.consent){g.hidden=true;return}
 g.hidden=false;g.innerHTML=`<div class="gatecard"><div class="seg" role="group" style="margin-bottom:10px">${[["en","EN"],["uz","UZ"],["ru","RU"]].map(([k,n])=>`<button data-glang="${k}" aria-pressed="${S.lang===k}">${n}</button>`).join("")}</div>
 <h2>${t("gate_h")}</h2><p style="margin:10px 0">${esc(t("disc"))}</p>
 <label class="gcheck"><input type="checkbox" id="g1"> ${t("gate_age")}</label><label class="gcheck"><input type="checkbox" id="g2"> ${t("gate_ok")}</label>
 <p class="small"><a href="/rehab/terms.html" target="_blank" rel="noopener">${t("terms")}</a> · <a href="/rehab/privacy.html" target="_blank" rel="noopener">${t("privacy")}</a></p>
 <button class="btn warm" id="gGo" disabled style="margin-top:10px">${t("gate_go")}</button></div>`;
 const ok=()=>{document.getElementById("gGo").disabled=!(document.getElementById("g1").checked&&document.getElementById("g2").checked)};
 document.getElementById("g1").onchange=ok;document.getElementById("g2").onchange=ok;
 document.getElementById("gGo").onclick=()=>{S.consent={at:dayKey(new Date()),v:1};save();gate()};
 g.querySelectorAll("[data-glang]").forEach(b=>b.onclick=()=>{S.lang=b.dataset.glang;save();render();gate()})}

/* ---------- render & events ---------- */
function go(v,arg){view=v;cur=arg??null;confirmWipe=false;lic.confirmOff=false;if(v!=="session"){stopTick()}render();scrollTo(0,0)}
function render(){document.documentElement.lang=S.lang;
 document.querySelectorAll("[data-t]").forEach(el=>el.textContent=t(el.dataset.t));
 const tabV=view==="session"||view==="premium"||view==="settings"?null:view;
 document.querySelectorAll(".tab").forEach(b=>{if(b.dataset.v===tabV)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 app.innerHTML=({today:todayView,plans:plansView,month:monthView,body:bodyView,lib:libView,prog:progView,settings:settingsView,premium:premiumView,session:sessionView}[view]||todayView)();
 mountAnims();bind();if(view==="session")runTick()}
function bind(){
 app.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 app.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{S.plan={id:b.dataset.pick,lvl:S.lvlPick||"regular",start:dayKey(new Date()),cycle:0};save();selDay=null;monthPage=null;go("today")});
 app.querySelectorAll("[data-lvl]").forEach(b=>b.onclick=()=>{S.lvlPick=b.dataset.lvl;save();render()});
 app.querySelectorAll("[data-k]").forEach(c=>c.onchange=()=>{const p=S.plan,n=view==="month"&&selDay?selDay:dayNum(p);const r=dayRec(p,n);if(c.checked)r[c.dataset.k]=true;else delete r[c.dataset.k];save();if(view!=="today"||c.dataset.k==="care"||c.dataset.k==="work")render()});
 app.querySelectorAll("[data-sess]").forEach(b=>b.onclick=()=>startSession(b.dataset.sess));
 app.querySelectorAll(".ex[data-ex]").forEach(li=>{const f=()=>openEx(li.dataset.ex,li.dataset.dose);li.onclick=f;li.onkeydown=ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();f()}}});
 app.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{selDay=+b.dataset.day;render()});
 app.querySelectorAll("[data-mp]").forEach(b=>b.onclick=()=>{monthPage=+b.dataset.mp;selDay=monthPage*30+1;render()});
 app.querySelectorAll("[data-area]").forEach(b=>b.onclick=()=>go("body",b.dataset.area));
 app.querySelectorAll("[data-af]").forEach(b=>b.onclick=()=>{areaF=b.dataset.af;render()});
 app.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>{S.lang=b.dataset.lang;save();render()});
 app.querySelectorAll("[data-dm]").forEach(b=>b.onclick=()=>{demoMode=b.dataset.dm;render()});
 const qi=document.getElementById("q");if(qi)qi.oninput=()=>{q=qi.value;const pos=qi.selectionStart;render();const n=document.getElementById("q");n.focus();n.setSelectionRange(pos,pos)};
 const $=id=>document.getElementById(id);
 if($("again"))$("again").onclick=()=>{S.plan.start=dayKey(new Date());S.plan.cycle=(S.plan.cycle||0)+planById(S.plan.id).months;save();render()};
 if($("licGo"))$("licGo").onclick=()=>activateKey($("licIn").value);
 if($("licOffAsk"))$("licOffAsk").onclick=()=>{lic.confirmOff=true;render()};
 if($("licOffNo"))$("licOffNo").onclick=()=>{lic.confirmOff=false;render()};
 if($("licOffYes"))$("licOffYes").onclick=()=>{lic.confirmOff=false;removeKey()};
 if($("exp"))$("exp").onclick=()=>{const b=new Blob([JSON.stringify(Object.assign({},S,{pro:S.pro?{plan:S.pro.plan}:undefined}),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="ikjon-fitness-"+dayKey(new Date())+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
 if($("wipe"))$("wipe").onclick=()=>{confirmWipe=true;render()};
 if($("wipeNo"))$("wipeNo").onclick=()=>{confirmWipe=false;render()};
 if($("wipeYes"))$("wipeYes").onclick=()=>{const lang=S.lang;if(S.pro&&S.pro.inst&&!S.pro.test)lsPost("deactivate",{license_key:S.pro.key,instance_id:S.pro.inst}).catch(()=>{});try{localStorage.removeItem(KEY)}catch(e){}S={lang,plan:null,hist:{}};save();confirmWipe=false;go("today");gate()};
 if($("sesNext"))$("sesNext").onclick=nextStep;
 if($("sesSkip"))$("sesSkip").onclick=()=>{ses.set=ses.list[ses.i].s;ses.mode="work";nextStep()};
 if($("sesPause"))$("sesPause").onclick=()=>{ses.running=!ses.running;render()};
 if($("sesQuit"))$("sesQuit").onclick=()=>{ses=null;go("today")};
 if($("sesHome"))$("sesHome").onclick=()=>{ses=null;go(selDay&&S.plan&&selDay!==dayNum(S.plan)?"month":"today")};
}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{if(b.dataset.v==="body")cur=null;if(b.dataset.v==="month")selDay=null;go(b.dataset.v,b.dataset.v==="body"?null:undefined)});
document.getElementById("homeBtn").onclick=()=>go("today");
document.getElementById("setBtn").onclick=()=>go("settings");
document.getElementById("exDlg").addEventListener("click",e=>{if(e.target.id==="exDlg")e.target.close()});
(function(){try{const u=new URL(location.href);let k=u.searchParams.get("key");const h=new URLSearchParams(location.hash.slice(1));if(!k)k=h.get("key");
 if(k){u.searchParams.delete("key");history.replaceState(null,"",u.pathname+(u.search||""));view="settings";render();activateKey(k)}}catch(e){}})();
const hv=location.hash.slice(1);if(["plans","month","body","lib","prog","premium","settings"].includes(hv))view=hv;
render();gate();recheckKey();

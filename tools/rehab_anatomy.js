/* ===== anatomy START (source: tools/rehab_anatomy.js — injected by tools/inject_anatomy.py) ===== */
/* Original IKJON teaching illustrations: anatomy drawing + zoom circle on the injured spot,
   a "muscles to strengthen" body map, and plain-language explanations. Education, not diagnosis. */
const AC={bone:"#F3D8BC",boneE:"#C8946A",boneS:"#E2B993",cart:"#D8ECF7",cartE:"#7FA9C6",lig:"#EEF2F8",ligE:"#8EA0B8",mus:"#E79A8B",musE:"#B85C4C",inj:"#D7261E",ink:"#1A4264"};
const FIGS={
 knee:{w:300,h:330,draw(){const B=AC;return `
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round">
  <path d="M118 0H182L186 104 252 150 70 150 114 104Z"/><ellipse cx="106" cy="166" rx="46" ry="34"/><ellipse cx="194" cy="166" rx="46" ry="34"/>
  <rect x="62" y="206" width="176" height="34" rx="14"/><path d="M70 236H230L196 300 190 330H120L114 300Z"/>
  <ellipse cx="72" cy="258" rx="14" ry="16"/><rect x="66" y="262" width="13" height="68" rx="5"/></g>
 <g fill="${B.bone}">
  <path d="M118 0H182L186 104 252 150 70 150 114 104Z"/><ellipse cx="106" cy="166" rx="46" ry="34"/><ellipse cx="194" cy="166" rx="46" ry="34"/>
  <rect x="62" y="206" width="176" height="34" rx="14"/><path d="M70 236H230L196 300 190 330H120L114 300Z"/>
  <ellipse cx="72" cy="258" rx="14" ry="16"/><rect x="66" y="262" width="13" height="68" rx="5"/></g>
 <path d="M150 154C140 160 136 190 140 200H160C164 190 160 160 150 154Z" fill="${B.boneS}"/>
 <path d="M130 40Q150 34 170 40M126 70Q150 64 174 70M120 270Q150 264 180 270" stroke="${B.boneS}" stroke-width="3" fill="none"/>
 <g id="pcl"><path d="M158 168 164 172 150 210 142 208Z" fill="#DCE3EC" stroke="${B.ligE}" stroke-width="1.5" opacity=".85"/></g>
 <g id="acl"><path d="M138 166 146 162 162 204 154 208Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/><path d="M143 170 156 202M147 168 159 200" stroke="${B.ligE}" stroke-width="1" opacity=".6"/></g>
 <g id="menL"><path d="M64 200Q100 188 138 198L138 208Q100 199 64 211Z" fill="${B.cart}" stroke="${B.cartE}" stroke-width="2"/></g>
 <g id="menM"><path d="M162 198Q200 188 236 200L236 211Q200 199 162 208Z" fill="${B.cart}" stroke="${B.cartE}" stroke-width="2"/></g>
 <g id="mcl"><path d="M244 128 258 132 242 302 228 298Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/><path d="M250 140 236 290" stroke="${B.ligE}" stroke-width="1" opacity=".6"/></g>
 <g id="lcl"><path d="M48 150 58 148 72 244 62 246Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/></g>`},
 labels:[["Thigh bone (femur)",150,30,"m"],["ACL",120,150,"l"],["Meniscus",30,186,"l"],["MCL",262,250,"r"],["LCL",34,232,"l"],["Shin bone (tibia)",150,318,"m"],["Fibula",40,300,"l"]],
 sides:["Outer side","Inner side"]},
 pelvis:{w:300,h:320,draw(){const B=AC;return `
 <path d="M16 150C10 200 22 270 40 330H130L146 212 104 196 60 150Z" fill="#FBE6D8"/><path d="M284 150C290 200 278 270 260 330H170L154 212 196 196 240 150Z" fill="#FBE6D8"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round">
  <path d="M150 40C120 40 108 60 100 74C70 54 30 60 24 96C20 122 40 140 60 150L70 170 104 196 140 214H160L196 196 230 170 240 150C260 140 280 122 276 96C270 60 230 54 200 74C192 60 180 40 150 40Z"/>
  <circle cx="84" cy="172" r="24"/><circle cx="216" cy="172" r="24"/>
  <path d="M70 168 46 190 40 214 64 220 80 196Z"/><path d="M230 168 254 190 260 214 236 220 220 196Z"/>
  <path d="M44 210 64 214 96 320H70Z"/><path d="M256 210 236 214 204 320H230Z"/></g>
 <g fill="${B.bone}">
  <path d="M150 40C120 40 108 60 100 74C70 54 30 60 24 96C20 122 40 140 60 150L70 170 104 196 140 214H160L196 196 230 170 240 150C260 140 280 122 276 96C270 60 230 54 200 74C192 60 180 40 150 40Z"/>
  <circle cx="84" cy="172" r="24"/><circle cx="216" cy="172" r="24"/>
  <path d="M70 168 46 190 40 214 64 220 80 196Z"/><path d="M230 168 254 190 260 214 236 220 220 196Z"/>
  <path d="M44 210 64 214 96 320H70Z"/><path d="M256 210 236 214 204 320H230Z"/></g>
 <path d="M150 52C136 54 130 70 132 92 134 112 142 124 150 128 158 124 166 112 168 92 170 70 164 54 150 52Z" fill="${B.boneS}"/>
 <ellipse cx="116" cy="190" rx="13" ry="10" fill="#fff" stroke="${B.boneE}" stroke-width="2" opacity=".9"/><ellipse cx="184" cy="190" rx="13" ry="10" fill="#fff" stroke="${B.boneE}" stroke-width="2" opacity=".9"/>
 <g id="labL"><circle cx="84" cy="172" r="25" fill="none" stroke="${B.cartE}" stroke-width="4"/></g><circle cx="216" cy="172" r="25" fill="none" stroke="${B.cartE}" stroke-width="4"/>
 <g id="sym"><rect x="145" y="196" width="10" height="22" rx="4" fill="${B.cart}" stroke="${B.cartE}" stroke-width="2"/></g>
 <g id="addL" opacity=".95"><path d="M141 207 120 222 74 320 118 322Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/><path d="M134 216 92 318M138 214 106 320M128 220 82 318" stroke="${B.musE}" stroke-width="1" opacity=".5"/></g>
 <path d="M159 207 180 222 226 320 182 322Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".95"/>
 <g id="psoL" opacity=".92"><path d="M126 62 140 66 112 168 98 206 86 200 100 160Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/></g>
 <path d="M174 62 160 66 188 168 202 206 214 200 200 160Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".92"/>
 <g id="ingL"><path d="M34 112 C70 150 104 178 138 196" fill="none" stroke="${B.ligE}" stroke-width="4" stroke-linecap="round"/></g>
 <path d="M266 112 C230 150 196 178 162 196" fill="none" stroke="${B.ligE}" stroke-width="4" stroke-linecap="round"/>`},
 labels:[["Pelvis",150,26,"m"],["Hip flexor (iliopsoas)",32,60,"l"],["Inguinal ligament",8,132,"l"],["Hip joint & labrum",20,252,"l"],["Pubic joint",250,232,"r"],["Adductors (inner thigh)",150,336,"m"]],
 sides:["",""]}
};
/* injury marks drawn on top of a figure; z = zoom centre & factor */
const MARKS={
 tearline:(d)=>`<path d="${d}" fill="none" stroke="${AC.inj}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
 glow:(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${AC.inj}" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${r*.55}" fill="${AC.inj}" opacity=".22"/>`
};
const ANATFIG={
 meniscus:{fig:"knee",z:[202,203,2.7],extra:`<path d="M162 198Q200 188 236 200L236 211Q200 199 162 208Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/>`+MARKS.tearline("M186 196l5 6 5-7 5 7 5-6 5 6")},
 acl:{fig:"knee",z:[150,186,2.5],hide:["acl"],extra:`<path d="M138 166 146 162 152 178 147 182 143 177 141 181Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/><path d="M162 204 154 208 148 192 153 189 156 194 158 190Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/>`+MARKS.glow(150,186,14)},
 mcl:{fig:"knee",z:[240,214,2.4],extra:`<path d="M244 128 258 132 248 206 241 214 236 206 234 210Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/><path d="M233 222 239 216 244 224 238 300 228 298Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/>`+MARKS.glow(240,216,12)},
 groin:{fig:"pelvis",z:[124,232,2.4],extra:`<path d="M141 207 120 222 104 254 132 256Z" fill="${AC.inj}" opacity=".55"/>`+MARKS.tearline("M108 238l6 4 3-7 6 5 3-7 6 4")+MARKS.glow(122,234,16)},
 hipflexor:{fig:"pelvis",z:[104,168,2.4],extra:`<path d="M112 140 100 160 98 182 108 180 116 150Z" fill="${AC.inj}" opacity=".5"/>`+MARKS.tearline("M96 160l6 4 3-6 6 5 3-6")+MARKS.glow(106,164,15)},
 inguinal:{fig:"pelvis",z:[110,176,2.4],extra:`<path d="M60 130 C86 150 108 168 136 186 L132 150 Z" fill="${AC.inj}" opacity=".16"/><path d="M84 160 C100 170 116 180 134 190" fill="none" stroke="${AC.inj}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`+MARKS.glow(112,178,16)},
 pubic:{fig:"pelvis",z:[150,206,2.7],extra:MARKS.glow(150,207,20)+`<rect x="145" y="196" width="10" height="22" rx="4" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/><path d="M134 200l-8-4M134 212l-9 2M166 200l8-4M166 212l9 2" stroke="${AC.inj}" stroke-width="2.5" stroke-linecap="round"/>`},
 hiprelated:{fig:"pelvis",z:[84,160,2.6],extra:`<path d="M62 160 A25 25 0 0 1 106 160" fill="none" stroke="${AC.inj}" stroke-width="5"/>`+MARKS.tearline("M74 146l4 6 4-7 4 7 4-6")+MARKS.glow(84,152,13)}
};
let anatUid=0;
function anatSVG(id){const a=ANATFIG[id];if(!a)return"";const F=FIGS[a.fig],u="an"+(++anatUid),[px,py,z]=a.z,R=78,cx=F.w+110,cy=F.h/2;
 let base=F.draw();(a.hide||[]).forEach(h=>{base=base.replace(new RegExp(`<g id="${h}">[\\s\\S]*?</g>`),"")});
 const lab=F.labels.map(([t,x,y,al])=>`<text x="${x}" y="${y}" text-anchor="${al==="l"?"start":al==="r"?"end":"middle"}">${esc(t)}</text>`).join("");
 return `<svg class="anatsvg" viewBox="0 -14 ${F.w+200} ${F.h+40}" role="img" aria-label="Illustration: ${esc(injById(id).name)}">
 <defs><g id="${u}b">${base}${a.extra}</g><clipPath id="${u}c"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
 <marker id="${u}m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10z" fill="${AC.inj}"/></marker></defs>
 <use href="#${u}b"/>
 <circle cx="${px}" cy="${py}" r="${R/z}" fill="none" stroke="${AC.ink}" stroke-width="2.5"/>
 <path d="M${px+R/z*.8} ${py-R/z*.6} Q ${(px+cx)/2} ${Math.min(py,cy)-60} ${cx-R*.95} ${cy-R*.35}" fill="none" stroke="${AC.inj}" stroke-width="3" marker-end="url(#${u}m)"/>
 <circle cx="${cx}" cy="${cy}" r="${R+3}" fill="#fff"/>
 <g clip-path="url(#${u}c)"><rect x="${cx-R}" y="${cy-R}" width="${R*2}" height="${R*2}" fill="#fff"/><g transform="translate(${cx} ${cy}) scale(${z}) translate(${-px} ${-py})"><use href="#${u}b"/></g></g>
 <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${AC.ink}" stroke-width="3"/>
 <g class="anatlab">${lab}${F.sides[0]?`<text x="6" y="${F.h+20}" class="side">← ${esc(F.sides[0])}</text><text x="${F.w-6}" y="${F.h+20}" text-anchor="end" class="side">${esc(F.sides[1])} →</text>`:""}</g>
 </svg>`}

/* body map: muscles to strengthen (front & back) */
const MUSPOS={
 neck:[["f",60,40,7,6]],chest:[["f",49,68,11,8],["f",71,68,11,8]],delts:[["f",36,60,8,8],["f",84,60,8,8],["b",36,60,8,8],["b",84,60,8,8]],
 forearms:[["f",24,112,5,14],["f",96,112,5,14]],core:[["f",60,98,9,20],["f",47,104,4,12],["f",73,104,4,12]],
 hipflex:[["f",52,132,5,7],["f",68,132,5,7]],adductors:[["f",55,160,4,17],["f",65,160,4,17]],quads:[["f",47,166,8,24],["f",73,166,8,24]],
 tibialis:[["f",47,218,4,16],["f",73,218,4,16]],feet:[["f",46,250,6,4],["f",74,250,6,4],["b",46,250,6,4],["b",74,250,6,4]],
 upperback:[["b",60,58,18,8]],cuff:[["b",49,72,8,7],["b",71,72,8,7]],lats:[["b",47,92,7,13],["b",73,92,7,13]],lowback:[["b",60,116,9,10]],
 gmed:[["b",44,128,6,6],["b",76,128,6,6]],glutes:[["b",51,142,10,11],["b",69,142,10,11]],hamstrings:[["b",49,176,7,22],["b",71,176,7,22]],
 calves:[["b",48,214,6,15],["b",72,214,6,15]],triceps:[["b",30,86,5,12],["b",90,86,5,12]]};
const MUSNAME={neck:"Deep neck muscles",chest:"Chest",delts:"Shoulders (deltoids)",forearms:"Forearms",core:"Core (abs & obliques)",hipflex:"Hip flexors",adductors:"Adductors (inner thigh)",quads:"Quadriceps",tibialis:"Shin muscles",feet:"Foot muscles",upperback:"Upper back",cuff:"Rotator cuff",lats:"Lats",lowback:"Lower-back muscles",gmed:"Gluteus medius (side hip)",glutes:"Glutes",hamstrings:"Hamstrings",calves:"Calves",triceps:"Triceps"};
function bodySil(x){return `<g transform="translate(${x} 0)" fill="#E3EBF1" stroke="#B9C9D6" stroke-width="1.5">
 <circle cx="60" cy="22" r="13"/><rect x="54" y="33" width="12" height="10" rx="3"/>
 <path d="M34 48Q60 40 86 48L92 70 90 128 82 146H38L30 128 28 70Z"/>
 <path d="M30 52 20 74 16 120 22 140 30 138 30 120 34 78Z"/><path d="M90 52 100 74 104 120 98 140 90 138 90 120 86 78Z"/>
 <path d="M38 140H59L58 196 56 246 40 246 40 196Z"/><path d="M82 140H61L62 196 64 246 80 246 80 196Z"/></g>`}
function bodyMap(keys){const on=new Set(keys);let f="",b="";
 for(const k in MUSPOS)MUSPOS[k].forEach(([s,x,y,rx,ry])=>{const e=`<ellipse cx="${s==="f"?x:x+130}" cy="${y}" rx="${rx}" ry="${ry}" fill="${on.has(k)?"#D9711F":"#C9D6E0"}" opacity="${on.has(k)?.95:.55}"/>`;s==="f"?f+=e:b+=e});
 return `<svg class="bodymap" viewBox="0 0 250 270" role="img" aria-label="Body map: muscles to strengthen are shown in orange">${bodySil(0)}${bodySil(130)}${f}${b}
 <text x="60" y="266" text-anchor="middle">Front</text><text x="190" y="266" text-anchor="middle">Back</text></svg>`}

/* plain-language explanations: what is damaged, how it happens, grades, how it heals, muscles to strengthen */
const ANAT={
 meniscus:{part:"The meniscus is a C-shaped cushion of cartilage between the thigh bone and the shin bone. Each knee has two — inner (medial) and outer (lateral). They absorb shock and help keep the knee steady.",
  how:"Usually a twist on a bent knee with the foot planted — turning to pass, or rotating while squatting. After about 35, tears can also appear slowly with everyday wear.",
  grades:[["Small, stable tear","A small split near the edge. The knee still bends and straightens fully. Most settle with exercise in 4–8 weeks."],["Larger tear","Swelling after activity, catching or clicking, deep squats hurt. Exercise is still usually the first treatment; some people need a scan."],["Locked knee (flap tear)","A torn flap blocks the knee so it can't straighten. See a doctor soon — this often needs keyhole surgery."]],
  heal:"The outer third of the meniscus has a blood supply and can heal. The inner part heals poorly, but the knee copes very well when the muscles around it are strong. For wear-type tears, 12 weeks of exercise worked as well as surgery.",
  muscles:[["quads","Your main shock absorber — strong quads take load off the meniscus."],["glutes","Control the hip so the knee doesn't twist or cave inward."],["gmed","Keeps the knee in line when you land or squat on one leg."],["hamstrings","Protect the back of the knee and control rotation."],["calves","Absorb force when you run and land."]],
  stronger:["Increase squat depth slowly — pain should stay at 3/10 or less and settle by the next day.","Practise soft landings with the knee over the middle toes.","Keep 2 leg-strength sessions a week even after you're back to sport."]},
 acl:{part:"The ACL (anterior cruciate ligament) is a strong band in the centre of the knee. It stops the shin bone sliding forward and twisting under the thigh bone.",
  how:"Most ACL tears happen without contact: landing from a jump, stopping suddenly or cutting with the knee caving inward. Many people feel or hear a 'pop' and the knee swells within a few hours.",
  grades:[["Grade 1 — stretched","Fibres stretched but the knee is stable."],["Grade 2 — partial tear","Some fibres torn; the knee may feel unsteady."],["Grade 3 — complete tear","The most common type. The ligament is torn through and the knee can give way when turning."]],
  heal:"A completely torn ACL does not grow back together by itself. Some people return to sport with rehab alone; many athletes choose reconstruction surgery. Either way, rehab takes 9 months or more — returning to cutting sports earlier greatly raises the risk of another tear.",
  muscles:[["hamstrings","Act like a 'second ACL' — they pull the shin bone back and stop it sliding forward."],["quads","Need to be rebuilt to equal the other leg; weak quads are the biggest re-injury risk."],["glutes","Stop the knee from caving inward when landing and cutting."],["gmed","Side-hip strength keeps the knee lined up over the foot."],["calves","Help absorb landings and protect the knee."],["core","Keeps your body balanced over the knee when you change direction."]],
  stronger:["Test before you return: both legs should hop and lift almost equally (90%+).","Train landing and cutting technique — knees over toes, soft bend.","Keep a warm-up like FIFA 11+ forever; it roughly halves ACL injuries."]},
 mcl:{part:"The MCL (medial collateral ligament) is a strap on the inner side of the knee. It stops the knee bending inward.",
  how:"A hit to the outside of the knee (a tackle) or the knee collapsing inward when landing or skiing.",
  grades:[["Grade 1","Stretched — tender on the inner knee but stable. Usually 1–3 weeks."],["Grade 2","Partly torn — some looseness and pain bending. Usually 3–6 weeks, sometimes with a brace."],["Grade 3","Fully torn — the knee opens on the inner side. Often happens with an ACL tear; see a doctor."]],
  heal:"The MCL has a good blood supply, so it usually heals without surgery. Gentle movement and progressive strength help the new fibres line up strongly.",
  muscles:[["quads","Support the knee and restore full straightening."],["adductors","The inner-thigh muscles sit right next to the MCL and help protect the inner knee."],["gmed","Stops the knee collapsing inward — the movement that injures the MCL."],["hamstrings","Add stability on the inner and back of the knee."]],
  stronger:["Return to side-to-side movement gradually: walk, jog, then cut.","Strengthen the inner thigh (adductors) and side hip twice a week.","Use a hinged brace for contact sport only if your doctor or physio advises it."]},
 groin:{part:"The adductors are the inner-thigh muscles that pull your legs together. The adductor longus is the one most often strained, usually close to where it attaches to the pubic bone.",
  how:"Kicking hard, changing direction quickly, or slipping into a split. Also builds up slowly when training load jumps.",
  grades:[["Grade 1","A few fibres strained — tight and sore when kicking. 1–3 weeks."],["Grade 2","Partial tear — pain walking fast, weak squeeze. 3–8 weeks."],["Grade 3 / long-standing","Big tear, or groin pain for months. Needs a structured programme; see a sports doctor if not improving."]],
  heal:"Muscle tissue heals in a few weeks, but the tendon near the bone is slower. Strengthening (not just rest and stretching) is what works — active training beat passive treatment for long-standing groin pain.",
  muscles:[["adductors","The injured muscles — make them strong with squeezes and the Copenhagen plank."],["core","Abs and obliques share the load across the pelvis with the adductors."],["glutes","Balance the hip so the inner thigh isn't overworked."],["hipflex","Often tight and weak together with the adductors in kicking sports."]],
  stronger:["Keep the Copenhagen plank in your weekly routine — it cut groin problems by 41% in footballers.","Build kicking and sprint volume gradually after time off.","Test your squeeze: both sides should feel equally strong."]},
 hipflexor:{part:"The iliopsoas is the deep hip flexor. It runs from the lower spine and inside of the pelvis, over the front of the hip, to the top of the thigh bone. It lifts your knee.",
  how:"Sprinting, kicking, or suddenly lifting the knee against resistance — common in football, running and martial arts.",
  grades:[["Grade 1","Sore at the front of the hip when lifting the knee. 1–3 weeks."],["Grade 2","Painful to sprint or kick, weak knee lift. 3–6 weeks."],["Severe / long-standing","Big tear or months of pain. See a sports doctor."]],
  heal:"The muscle heals in a few weeks when loaded gradually. Pain stretching the hip flexor or lifting the knee against your hand points to this type of groin pain.",
  muscles:[["hipflex","Rebuild knee-lift strength slowly, then speed."],["core","Stabilises the lower spine where the iliopsoas attaches."],["glutes","Strong glutes balance the front of the hip."],["adductors","Work closely with the hip flexors in kicking."]],
  stronger:["Add speed last: slow strength first, then skips, then sprints.","Warm up the hip flexors before kicking or sprinting.","Avoid long sitting without breaks; move every 45 minutes."]},
 inguinal:{part:"The inguinal canal is a natural passage through the lower belly wall, just above the crease of the groin. In 'inguinal-related groin pain' (sometimes called a sports hernia) the muscles and tissues around it are overloaded — usually there is no lump.",
  how:"Repeated kicking, sprinting and twisting, often with a weak or tired core. Pain often comes on slowly.",
  grades:[["Mild","Pain only after hard training."],["Moderate","Pain during sprinting, kicking or sit-ups; coughing or sneezing may hurt."],["Long-standing","Pain for months. Most improve with 6–12 weeks of exercise; a few need a surgeon's opinion."]],
  heal:"Most athletes recover with a programme that strengthens the core and hips and improves movement control — in one large study players returned to sport after about 10 weeks of rehab.",
  muscles:[["core","The key area — deep abs and obliques protect the lower belly wall."],["adductors","Often weak at the same time; balance them with the core."],["glutes","Control the pelvis when you kick and change direction."],["hipflex","Train them without overloading the groin."]],
  stronger:["A visible or hard lump in the groin is a hernia — see a doctor.","Train the core with control exercises (dead bug, Pallof press) before crunches.","Increase kicking distance and sprint speed step by step."]},
 pubic:{part:"The pubic joint (pubic symphysis) is where the two halves of the pelvis meet at the front. In pubic-related groin pain the bone and joint are overloaded and irritated (sometimes called osteitis pubis).",
  how:"Too much kicking, sprinting and change of direction without enough recovery, often when the adductors and core are weak.",
  grades:[["Mild","Tender over the pubic bone after training."],["Moderate","Pain on both sides of the groin, walking fast or getting out of a car hurts."],["Long-standing","Pain for months; can take 3–6 months to settle with careful loading."]],
  heal:"Bone and joint stress settles slowly. Reduce the movements that hurt (long kicks, sprints, sit-ups), keep training what you can, and rebuild adductor and core strength step by step.",
  muscles:[["adductors","Pull on the pubic bone from below — strong adductors spread the load."],["core","Pull from above — balance between abs and adductors protects the joint."],["glutes","Stabilise the pelvis when you run."]],
  stronger:["Patience: progress loading every 1–2 weeks, not every day.","Keep pain during training at 3/10 or less and settled by the next morning.","See a doctor if pain is severe at night or you have fever."]},
 hiprelated:{part:"The hip is a ball-and-socket joint. The labrum is a ring of cartilage around the socket. Hip impingement (FAI) is when the ball and socket pinch at the end of movement, which can irritate or tear the labrum.",
  how:"Deep squatting, twisting and kicking, often in people whose hip shape is naturally a bit different. Pain is deep in the groin and may click or catch.",
  grades:[["Irritated hip","Deep groin ache after sport or long sitting."],["Labral tear","Clicking, catching, pain in deep squats or crossing the legs."],["After hip arthroscopy","Follow your surgeon's limits — a slower plan."]],
  heal:"A 3-month physio-led programme improves pain and function for many people; some need keyhole surgery. Strength and control around the hip reduce pinching.",
  muscles:[["gmed","Controls the hip so the ball doesn't drift into the pinching position."],["glutes","Strong glutes take load away from the front of the hip."],["core","Pelvic control changes the hip angle in sport."],["adductors","Balance the inner thigh with the side hip."]],
  stronger:["Avoid very deep squats and long sitting with knees above hips while it is sore.","Choose a slightly wider stance and turned-out toes for squats.","A specialist should check hips that keep locking or catching."]}
};
const GROINTYPES=[["groin","Adductor-related"],["hipflexor","Iliopsoas-related"],["inguinal","Inguinal-related"],["pubic","Pubic-related"],["hiprelated","Hip-related"]];
function anatBox(i){const a=ANAT[i.id];if(!a)return"";
 const groinIntro=GROINTYPES.some(g=>g[0]===i.id)?`<div class="box gtypes"><b>Groin pain has 5 main types.</b> Doctors group it by where it comes from (Doha agreement). Pick the one that matches where it hurts:<div class="gtrow">${GROINTYPES.map(([id,n])=>`<button class="chipbtn${id===i.id?" on":""}" data-inj="${id}">${esc(n)}</button>`).join("")}</div></div>`:"";
 return `<section class="section anat"><h2>Understand your injury</h2>${groinIntro}
 <div class="anatgrid"><figure class="box anatfig">${anatSVG(i.id)}<figcaption>Original IKJON illustration — the red area shows what is injured. Education only; a doctor or physio confirms the diagnosis.</figcaption></figure>
 <div class="anattxt"><div class="box"><h3>What's injured</h3><p>${esc(a.part)}</p><h3 style="margin-top:12px">How it happens</h3><p>${esc(a.how)}</p></div>
 <div class="box"><h3>How it heals</h3><p>${esc(a.heal)}</p></div></div></div>
 <div class="gradegrid">${a.grades.map((g,k)=>`<div class="box grade g${k}"><span class="gbar"><i style="width:${[34,67,100][k]}%"></i></span><h3>${esc(g[0])}</h3><p>${esc(g[1])}</p></div>`).join("")}</div>
 <div class="box musbox"><h3>Muscles to strengthen — recover and come back stronger</h3><div class="musgrid">${bodyMap(a.muscles.map(m=>m[0]))}
 <ul class="muslist">${a.muscles.map(([k,why])=>`<li><b>${esc(MUSNAME[k]||k)}</b><span>${esc(why)}</span></li>`).join("")}</ul></div>
 <h3 style="margin-top:14px">Come back stronger</h3><ul>${a.stronger.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div></section>`}
/* data for the new groin injuries: evidence, plan finder, photos */
Object.assign(EVID,{
 hipflexor:{lvl:"Moderate",pts:["Iliopsoas-related groin pain is one of the five agreed types of groin pain in athletes; pain lifting the knee against resistance or stretching the hip flexor points to it.","Treatment is based on progressive loading; there are few randomised trials for this specific injury."],refs:["Weir et al. 2015, British Journal of Sports Medicine (Doha agreement on groin pain)"]},
 inguinal:{lvl:"Moderate",pts:["In 205 athletes with groin pain, a rehab programme targeting strength and movement control let most return to play after about 10 weeks.","Surgery is considered when a good exercise programme has not worked."],refs:["King et al. 2018, British Journal of Sports Medicine (cohort, 205 athletes)","Weir et al. 2015, BJSM (Doha agreement)"]},
 pubic:{lvl:"Low–moderate",pts:["Pubic-related groin pain is managed with load reduction and progressive adductor and core strengthening; recovery often takes several months.","Most evidence comes from case series and expert consensus."],refs:["Weir et al. 2015, BJSM (Doha agreement)","Expert consensus and case series"]},
 hiprelated:{lvl:"Moderate",pts:["In a large trial of hip impingement, both keyhole surgery and a physio-led exercise programme improved pain and function; surgery gave a slightly bigger improvement at 12 months.","Strengthening the hip and core is the first step for most people."],refs:["Griffin et al. 2018, The Lancet (UK FASHIoN trial, 348 patients)"]},
 groin:Object.assign(EVID.groin||{},{pts:(EVID.groin&&EVID.groin.pts||[]).concat(["For long-standing adductor-related groin pain, an active strengthening programme beat passive physiotherapy: far more athletes returned to sport."]),refs:(EVID.groin&&EVID.groin.refs||[]).concat(["Hölmich et al. 1999, The Lancet (RCT)"])})
});
SYMS.hip.push(["fronthip","Pain at the front of the hip when lifting the knee (stairs, sprinting)"],["lowerab","Pain in the lower belly or groin crease, worse with sit-ups or coughing"],["pubicbone","Pain right over the pubic bone in the middle"],["deephip","Deep hip pain with clicking or catching, worse in deep squats or long sitting"]);
REDF.hip=(REDF.hip||[]).concat(["A lump in the groin that gets bigger when you cough","Teenager with a limp and hip or knee pain"]);
Object.assign(CK,{hipflexor:{a:"hip",o:{sudden:2,gradual:1},s:{fronthip:3,kick:2,innerthigh:1},g:{adult:1,teen:1}},
 inguinal:{a:"hip",o:{gradual:3},s:{lowerab:3,kick:1,turn:1},g:{adult:1}},
 pubic:{a:"hip",o:{gradual:3},s:{pubicbone:3,squeeze:1,kick:1},g:{adult:1}},
 hiprelated:{a:"hip",o:{gradual:2,sudden:1},s:{deephip:3,turn:1},g:{adult:1,older:1}}});
Object.assign(INJPH,{hipflexor:"mountain_climber",inguinal:"side_plank",pubic:"reverse_lunge",hiprelated:"monster_walk"});
/* ===== anatomy END ===== */

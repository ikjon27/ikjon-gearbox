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
FIGS.kneeSide={w:300,h:330,draw(){const B=AC;return `
 <path d="M96 0H228C236 60 238 120 232 170 242 210 236 240 218 262L210 330H112L106 262C92 236 90 200 100 170 92 110 90 50 96 0Z" fill="#FBE6D8"/>
 <path d="M104 0H134L130 214 116 214C108 150 104 80 104 0Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".9"/>
 <path d="M176 0H222C226 50 224 100 214 140L204 152 190 150C186 100 180 50 176 0Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".9"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round"><path d="M136 0H178L184 164H132Z"/><ellipse cx="160" cy="188" rx="42" ry="32"/>
  <path d="M118 212H208L214 236 200 252 194 330H140L134 252 118 236Z"/><ellipse cx="122" cy="240" rx="12" ry="14"/><rect x="114" y="244" width="13" height="86" rx="5"/></g>
 <g fill="${B.bone}"><path d="M136 0H178L184 164H132Z"/><ellipse cx="160" cy="188" rx="42" ry="32"/>
  <path d="M118 212H208L214 236 200 252 194 330H140L134 252 118 236Z"/><ellipse cx="122" cy="240" rx="12" ry="14"/><rect x="114" y="244" width="13" height="86" rx="5"/></g>
 <path d="M200 152Q210 178 204 206" fill="none" stroke="${B.cartE}" stroke-width="4" id="pfcart"/>
 <ellipse cx="212" cy="178" rx="12" ry="24" fill="${B.bone}" stroke="${B.boneE}" stroke-width="3"/>
 <path d="M196 140 206 156 218 156 214 140Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/>
 <path d="M206 200 218 200 214 250 202 250Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/><path d="M210 204 208 246" stroke="${B.ligE}" stroke-width="1" opacity=".6"/>
 <ellipse cx="206" cy="252" rx="8" ry="6" fill="${B.boneS}"/>
 <path d="M152 0H162L192 226 186 230 172 186Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="1.5" opacity=".6"/>`},
 labels:[["Quadriceps",232,40,"r"],["Hamstrings",8,90,"l"],["IT band",132,120,"r"],["Kneecap",230,166,"l"],["Patellar tendon",224,236,"l"],["Shin bone (tibia)",166,318,"m"],["Thigh bone",157,112,"m"]],
 sides:["Back of knee","Front of knee"]};
FIGS.leg={w:320,h:330,draw(){const B=AC;return `
 <path d="M70 0H206C210 60 204 150 196 220L200 252C232 262 280 280 312 300 318 312 312 322 296 324H112C88 324 76 306 80 284L88 238C70 200 58 120 70 0Z" fill="#FBE6D8"/>
 <path d="M74 0H128L126 120 120 196 102 204C84 176 70 120 74 0Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".92" id="calfm"/>
 <path d="M84 30Q96 70 110 60" fill="none" stroke="${B.musE}" stroke-width="1.5" opacity=".5"/><path d="M80 90Q100 130 116 116" fill="none" stroke="${B.musE}" stroke-width="1.5" opacity=".5"/>
 <path d="M184 10H200L196 200 186 214Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="1.5" opacity=".85"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round"><path d="M150 0H182L184 226 190 248H146L150 226Z"/><path d="M130 0H142L144 244H128Z"/><circle cx="136" cy="254" r="13"/>
  <ellipse cx="164" cy="268" rx="24" ry="15"/><path d="M84 280C88 266 108 262 132 270L150 282 146 302 118 310 92 306C82 300 80 290 84 280Z"/><path d="M178 262 210 270 296 302 300 314 186 300 168 282Z"/></g>
 <g fill="${B.bone}"><path d="M150 0H182L184 226 190 248H146L150 226Z"/><path d="M130 0H142L144 244H128Z"/><circle cx="136" cy="254" r="13"/>
  <ellipse cx="164" cy="268" rx="24" ry="15"/><path d="M84 280C88 266 108 262 132 270L150 282 146 302 118 310 92 306C82 300 80 290 84 280Z"/><path d="M178 262 210 270 296 302 300 314 186 300 168 282Z"/></g>
 <path d="M206 276 216 302M232 284 240 306M258 292 264 310" stroke="${B.boneS}" stroke-width="3"/>
 <g id="atfl"><path d="M146 256 172 262 170 270 144 264Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/></g>
 <path d="M130 264 136 266 126 286 120 284Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/>
 <g id="achil"><path d="M98 190 122 196 104 284 86 282Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/></g>
 <g id="pf"><path d="M100 310Q190 318 290 316L288 322Q190 326 98 318Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="1.5"/></g>`},
 labels:[["Calf muscles",8,70,"l"],["Shin muscle",214,60,"l"],["Shin bone (tibia)",166,130,"m"],["Fibula",124,180,"r"],["Achilles tendon",8,236,"l"],["Ankle ligaments",210,250,"l"],["Heel bone",30,300,"l"],["Plantar fascia",200,338,"l"]],
 sides:["Back of leg","Toes"]};
FIGS.thigh={w:300,h:330,draw(){const B=AC;return `
 <path d="M18 0H136C140 90 132 200 124 292 110 312 46 312 32 292 22 200 14 90 18 0Z" fill="#FBE6D8"/>
 <path d="M164 0H282C286 90 278 200 270 292 256 312 192 312 178 292 168 200 160 90 164 0Z" fill="#FBE6D8"/>
 <path d="M30 20C26 100 30 200 44 270L60 270C54 190 54 100 58 20Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/>
 <path d="M124 20C128 100 124 190 112 260L92 284C100 240 100 120 98 20Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/>
 <g id="rf"><path d="M62 10H96C100 100 96 190 86 262H70C60 190 58 100 62 10Z" fill="#EBA697" stroke="${B.musE}" stroke-width="2"/><path d="M79 20 78 250" stroke="${B.musE}" stroke-width="1" opacity=".5"/></g>
 <ellipse cx="78" cy="290" rx="20" ry="16" fill="${B.bone}" stroke="${B.boneE}" stroke-width="3"/>
 <path d="M166 0H280C280 30 260 52 222 54 184 52 166 30 166 0Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".85"/>
 <g id="bf"><path d="M230 56H272C272 130 266 210 252 284H232C236 200 234 130 230 56Z" fill="#EBA697" stroke="${B.musE}" stroke-width="2"/></g>
 <path d="M176 56H226C228 130 226 210 214 284H192C182 200 176 130 176 56Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/><path d="M200 60 204 280" stroke="${B.musE}" stroke-width="1.5" opacity=".6"/>
 <path d="M188 300Q222 290 258 300" fill="none" stroke="${B.boneE}" stroke-width="3"/>`},
 labels:[["Front: quadriceps",78,-2,"m"],["Back: hamstrings",222,-2,"m"],["Rectus femoris",78,150,"m"],["Kneecap",78,326,"m"],["Glutes",222,30,"m"],["Biceps femoris",298,170,"r"],["Inner hamstrings",168,200,"l"]],
 sides:["",""]};
FIGS.spine={w:300,h:330,draw(){const B=AC;let v="",dsc="",arch="";
 for(let k=0;k<5;k++){const y=14+k*50;
  arch+=`<path d="M124 ${y+6}C112 ${y+6} 104 ${y+8} 96 ${y+12}L58 ${y+18} 54 ${y+30} 94 ${y+30}C104 ${y+32} 114 ${y+32} 124 ${y+30}Z"/>`;
  v+=`<rect x="120" y="${y}" width="66" height="36" rx="7"/>`;
  if(k<4)dsc+=`<rect x="123" y="${y+37}" width="60" height="12" rx="5" fill="${B.cart}" stroke="${B.cartE}" stroke-width="2"/>`}
 const body=`${arch}${v}<path d="M122 266H186C186 290 168 316 132 330H96C104 300 112 280 122 266Z"/>`;
 return `<path d="M0 0H44C40 110 40 220 50 330H0Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".75"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round">${body}</g><g fill="${B.bone}">${body}</g>${dsc}
 <rect x="123" y="251" width="60" height="12" rx="5" fill="${B.cart}" stroke="${B.cartE}" stroke-width="2"/>
 <path d="M114 216C100 240 86 280 70 330" fill="none" stroke="#E8B931" stroke-width="5" stroke-linecap="round"/><path d="M114 266C104 286 96 306 88 330" fill="none" stroke="#E8B931" stroke-width="4" stroke-linecap="round"/>`},
 labels:[["Back muscles",8,-2,"l"],["Vertebra",192,40,"l"],["Disc",192,96,"l"],["Nerve root",30,300,"l"],["L5",153,236,"m"],["Sacrum",190,300,"l"]],
 sides:["Back","Belly"]};
FIGS.shoulder={w:300,h:330,draw(){const B=AC;return `
 <path d="M40 40C110 10 220 20 290 70L300 330H120C100 260 80 180 60 140 40 110 30 70 40 40Z" fill="#FBE6D8"/>
 <path d="M150 70C200 66 250 90 262 140 270 190 252 230 226 250L196 196Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".35"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round"><path d="M30 60C80 48 140 50 190 62L192 76C140 70 80 70 32 76Z"/><path d="M150 60C176 50 214 54 236 70L230 86C208 76 176 74 152 80Z"/>
  <path d="M80 80 150 92 160 120 150 170 130 260 96 300 70 240Z"/><circle cx="186" cy="134" r="40"/><path d="M168 160H206L212 330H176Z"/></g>
 <g fill="${B.bone}"><path d="M30 60C80 48 140 50 190 62L192 76C140 70 80 70 32 76Z"/><path d="M150 60C176 50 214 54 236 70L230 86C208 76 176 74 152 80Z"/>
  <path d="M80 80 150 92 160 120 150 170 130 260 96 300 70 240Z"/><circle cx="186" cy="134" r="40"/><path d="M168 160H206L212 330H176Z"/></g>
 <path d="M146 104C156 112 158 152 146 164" fill="none" stroke="${B.cartE}" stroke-width="5" id="lab"/>
 <g id="cuff"><path d="M120 90C150 80 196 84 222 112L214 122C194 100 156 96 126 104Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/></g>`},
 labels:[["Collarbone",30,46,"l"],["Acromion (shoulder roof)",298,52,"r"],["Rotator cuff tendon",298,104,"r"],["Shoulder blade",30,200,"l"],["Socket rim (labrum)",30,150,"l"],["Upper-arm bone",246,250,"l"],["Deltoid",290,200,"r"]],
 sides:["",""]};
FIGS.elbow={w:300,h:330,draw(){const B=AC;return `
 <path d="M90 0H210L214 130C222 170 236 220 250 330H110C100 240 96 170 92 130Z" fill="#FBE6D8"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round"><path d="M128 0H172L176 110 200 140 190 160 120 160 108 140 124 110Z"/><path d="M128 162H160L186 330H160Z"/><path d="M164 162H190L224 330H198Z"/></g>
 <g fill="${B.bone}"><path d="M128 0H172L176 110 200 140 190 160 120 160 108 140 124 110Z"/><path d="M128 162H160L186 330H160Z"/><path d="M164 162H190L224 330H198Z"/></g>
 <ellipse cx="198" cy="142" rx="10" ry="12" fill="${B.boneS}"/>
 <g id="ext"><path d="M192 146C212 160 228 220 244 320L214 322C206 250 196 200 186 160Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".85"/><path d="M190 148 200 158 196 168 186 160Z" fill="${B.lig}" stroke="${B.ligE}" stroke-width="2"/></g>`},
 labels:[["Upper-arm bone",150,-2,"m"],["Outer elbow bone (lateral epicondyle)",298,118,"r"],["Wrist extensor tendon",232,178,"l"],["Forearm extensor muscles",298,290,"r"],["Forearm bones",100,250,"l"]],
 sides:["Little-finger side","Thumb side (outer elbow)"]};
FIGS.neck={w:300,h:330,draw(){const B=AC;let v="";for(let k=0;k<7;k++){const y=96+k*30;v+=`<rect x="${144+k*2}" y="${y}" width="44" height="22" rx="5"/><path d="M${146+k*2} ${y+6}L${108+k*3} ${y+10} ${104+k*3} ${y+20} ${146+k*2} ${y+18}Z"/>`}
 return `<path d="M120 0C190 -6 250 40 250 96 250 126 232 140 224 156L230 330H70C80 280 88 230 96 196 70 160 60 110 72 60 84 24 100 4 120 0Z" fill="#FBE6D8"/>
 <path d="M84 70C96 120 100 200 92 330H56C64 220 64 120 62 70Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".85" id="nm"/>
 <g stroke="${B.boneE}" stroke-width="5" stroke-linejoin="round"><path d="M80 40C110 4 196 6 226 50 236 70 230 90 214 96H128L94 92C80 80 76 60 80 40Z"/>${v}<rect x="160" y="306" width="48" height="26" rx="5"/></g>
 <g fill="${B.bone}"><path d="M80 40C110 4 196 6 226 50 236 70 230 90 214 96H128L94 92C80 80 76 60 80 40Z"/>${v}<rect x="160" y="306" width="48" height="26" rx="5"/></g>
 ${[0,1,2,3,4,5].map(k=>`<rect x="${146+k*2}" y="${119+k*30}" width="42" height="7" rx="3" fill="${B.cart}" stroke="${B.cartE}" stroke-width="1.5"/>`).join("")}`},
 labels:[["Skull",154,40,"m"],["Neck vertebrae",196,180,"l"],["Discs",196,240,"l"],["Neck muscles",4,150,"l"],["Upper back",206,326,"l"]],
 sides:["Back","Face"]};
FIGS.upperback={w:300,h:330,draw(){const B=AC;let sp="";for(let k=0;k<9;k++)sp+=`<rect x="141" y="${40+k*30}" width="18" height="22" rx="5"/>`;
 return `<path d="M60 0H240C270 30 290 80 292 330H8C10 80 30 30 60 0Z" fill="#FBE6D8"/>
 <path d="M150 10 30 70 70 200 150 280 230 200 270 70Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2" opacity=".55" id="trap"/>
 <g stroke="${B.boneE}" stroke-width="4" stroke-linejoin="round">${sp}<path d="M64 70 124 82 116 112 92 200 70 172Z"/><path d="M236 70 176 82 184 112 208 200 230 172Z"/></g>
 <g fill="${B.bone}">${sp}<path d="M64 70 124 82 116 112 92 200 70 172Z"/><path d="M236 70 176 82 184 112 208 200 230 172Z"/></g>
 <g id="rhom"><path d="M120 100 140 104 140 190 108 180Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/><path d="M180 100 160 104 160 190 192 180Z" fill="${B.mus}" stroke="${B.musE}" stroke-width="2"/></g>`},
 labels:[["Upper trapezius",150,-2,"m"],["Shoulder blade",40,226,"l"],["Muscles between shoulder blades",150,322,"m"],["Spine",166,60,"l"]],
 sides:["",""]};
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
Object.assign(ANATFIG,{
 pfps:{fig:"kneeSide",z:[202,178,2.6],extra:`<path d="M200 152Q210 178 204 206" fill="none" stroke="${AC.inj}" stroke-width="5"/>`+MARKS.glow(204,178,15)+`<ellipse cx="212" cy="178" rx="12" ry="24" fill="${AC.bone}" stroke="${AC.boneE}" stroke-width="3" opacity=".9"/>`},
 patellar:{fig:"kneeSide",z:[210,210,2.6],extra:`<path d="M206 200 218 200 217 222 204 222Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/>`+MARKS.glow(211,208,12)},
 osgood:{fig:"kneeSide",z:[206,250,2.5],extra:MARKS.glow(206,251,15)+`<ellipse cx="208" cy="252" rx="10" ry="8" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/><path d="M202 232 214 232 214 246 202 246Z" fill="#F6C9C4" opacity=".7"/>`},
 itbs:{fig:"kneeSide",z:[178,190,2.4],extra:`<path d="M168 168 176 166 186 210 178 214Z" fill="${AC.inj}" opacity=".45"/>`+MARKS.glow(178,190,16)},
 "knee-oa":{fig:"knee",z:[196,200,2.5],extra:`<path d="M160 197Q200 192 236 200L236 205Q200 198 160 202Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="1.5"/><path d="M240 196l8 4-8 4ZM236 212l8 3-8 4ZM158 188l-5 5 6 2Z" fill="${AC.boneE}"/>`+MARKS.tearline("M170 202l4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3")+MARKS.glow(200,200,14)}
});
Object.assign(ANATFIG,{
 "ankle-sprain":{fig:"leg",z:[158,262,2.6],hide:["atfl"],extra:`<path d="M146 256 158 259 156 266 144 264Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/><path d="M162 260 172 262 170 270 160 268Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/>`+MARKS.glow(158,263,13)},
 achilles:{fig:"leg",z:[104,246,2.6],extra:`<path d="M110 230 98 232 92 264 104 264C112 256 114 242 110 230Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/>`+MARKS.glow(104,248,13)},
 plantar:{fig:"leg",z:[118,314,2.7],extra:`<path d="M100 310Q120 312 140 313L140 320Q120 320 98 318Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2"/>`+MARKS.glow(116,314,12)},
 shin:{fig:"leg",z:[180,180,2.2],extra:`<path d="M182 120 184 226" stroke="${AC.inj}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`+MARKS.glow(181,176,20)},
 calf:{fig:"leg",z:[98,120,2.4],extra:`<path d="M80 104 118 108 116 136 84 132Z" fill="${AC.inj}" opacity=".35"/>`+MARKS.tearline("M82 118l6 6 5-7 6 7 5-7 6 7 5-6")+MARKS.glow(98,120,16)}
});
Object.assign(ANATFIG,{
 hamstring:{fig:"thigh",z:[250,110,2.4],extra:`<path d="M232 92 270 92 268 132 234 132Z" fill="${AC.inj}" opacity=".35"/>`+MARKS.tearline("M234 110l6 6 5-7 6 7 5-7 6 7 4-6")+MARKS.glow(251,112,16)},
 quad:{fig:"thigh",z:[79,140,2.4],extra:`<path d="M62 124 96 124 95 156 63 156Z" fill="${AC.inj}" opacity=".35"/>`+MARKS.tearline("M63 140l5 6 5-7 6 7 5-7 6 7 4-6")+MARKS.glow(79,140,16)},
 lbp:{fig:"spine",z:[70,215,2.0],extra:`<circle cx="66" cy="214" r="34" fill="#F2A33D" opacity=".18"/><circle cx="66" cy="214" r="20" fill="#F2A33D" opacity=".25"/><path d="M20 190 44 196M18 214 44 214M20 238 44 232" stroke="#E07A2E" stroke-width="3" stroke-linecap="round"/>`},
 sciatica:{fig:"spine",z:[118,212,2.6],extra:`<path d="M123 201 C108 202 106 214 123 213Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/><path d="M114 216C100 240 86 280 70 330" fill="none" stroke="${AC.inj}" stroke-width="5" stroke-linecap="round"/>`+MARKS.glow(114,212,13)},
 spondy:{fig:"spine",z:[106,234,2.7],extra:MARKS.tearline("M104 222l-4 5 5 4-4 5 5 4")+MARKS.glow(105,232,12)}
});
Object.assign(ANATFIG,{
 shoulder:{fig:"shoulder",z:[176,100,2.5],hide:["cuff"],extra:`<path d="M120 90C150 80 196 84 222 112L214 122C194 100 156 96 126 104Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/>`+MARKS.glow(176,100,15)},
 instab:{fig:"shoulder",z:[150,150,2.3],extra:`<circle cx="164" cy="168" r="40" fill="none" stroke="${AC.inj}" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M178 150 168 164" stroke="${AC.inj}" stroke-width="3" stroke-linecap="round"/><path d="M146 140C154 150 154 160 146 166" fill="none" stroke="${AC.inj}" stroke-width="6"/>`+MARKS.tearline("M150 142l-5 4 5 4-5 4 5 4")+MARKS.glow(148,152,13)},
 "tennis-elbow":{fig:"elbow",z:[194,154,2.6],extra:`<path d="M190 148 200 158 196 168 186 160Z" fill="#F6C9C4" stroke="${AC.inj}" stroke-width="2.5"/>`+MARKS.glow(194,153,13)},
 neck:{fig:"neck",z:[96,170,2.1],extra:`<circle cx="98" cy="170" r="34" fill="#F2A33D" opacity=".18"/><circle cx="98" cy="170" r="18" fill="#F2A33D" opacity=".25"/><path d="M58 150 74 156M56 172 74 172M58 194 74 188" stroke="#E07A2E" stroke-width="3" stroke-linecap="round"/>`},
 upperback:{fig:"upperback",z:[124,140,2.2],extra:`<circle cx="126" cy="140" r="30" fill="#F2A33D" opacity=".2"/><circle cx="126" cy="140" r="16" fill="#F2A33D" opacity=".28"/><circle cx="174" cy="140" r="30" fill="#F2A33D" opacity=".2"/>`}
});
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
Object.assign(ANAT,{
 pfps:{part:"The kneecap glides in a groove at the front of the thigh bone. Smooth cartilage lines the back of the kneecap. In runner's knee the joint behind the kneecap is overloaded and irritated — nothing is torn.",
  how:"Load rising faster than the knee can handle: more running or jumping, hills, stairs, or deep squats. Weak hips and thigh muscles let the knee drift inward, adding stress behind the kneecap.",
  grades:[["Mild","Ache only after running or jumping; daily life normal."],["Moderate","Stairs, squatting and long sitting hurt."],["Long-standing","Pain for over 3 months. Still very treatable with exercise; it just takes longer."]],
  heal:"Because nothing is damaged, the pain settles when load and strength are balanced again. Combined hip and knee strengthening is the best-proven treatment, with results in 6–12 weeks.",
  muscles:[["quads","Hold the kneecap in its groove and absorb force."],["gmed","Stops the knee drifting inward — a key cause of kneecap pain."],["glutes","Take load away from the knee on stairs and landings."],["calves","Absorb impact when running so the knee doesn't have to."]],
  stronger:["Cut back (don't stop) running while you strengthen — about 50–70% of normal.","Shorten your stride slightly or increase cadence by 5–10%.","Keep hip exercises twice a week to stop it returning."]},
 patellar:{part:"The patellar tendon joins the kneecap to the shin bone. Every jump and landing pulls on it. In jumper's knee the tendon fibres just below the kneecap are overloaded and become thicker and sore.",
  how:"Lots of jumping, landing and sprinting, especially after a sudden increase in training or a new hard surface.",
  grades:[["Mild","Pain after sport only."],["Moderate","Pain during jumping limits performance."],["Severe / long-standing","Pain on stairs and in daily life; can take 3–6 months."]],
  heal:"Tendons get stronger with heavy, slow loading — not rest. Total rest makes them weaker and the pain returns when you jump again. Expect 12 weeks of steady progress.",
  muscles:[["quads","The muscle that pulls on the tendon — slow heavy squats rebuild the whole unit."],["glutes","Share landing forces so the tendon takes less."],["calves","Absorb landings with springy ankles."],["hamstrings","Balance the knee and help control landings."]],
  stronger:["Pain up to 3/10 during loading is OK if it settles by the next morning.","Add jumping back in steps: 2–3 days a week, not daily.","Keep one heavy leg session a week in the season."]},
 itbs:{part:"The IT band is a thick strip of tissue running down the outside of the thigh from the hip to just below the knee. In IT band syndrome the tissue where it crosses the outer knee becomes irritated.",
  how:"Repeated knee bending in running or cycling — usually after a jump in distance, lots of downhill running, or weak hip muscles letting the knee drop inward.",
  grades:[["Mild","Pain only after 5+ km."],["Moderate","Pain within the first 1–2 km or on stairs."],["Persistent","Pain stops running completely. Seek a physio assessment."]],
  heal:"It settles when running load is reduced and the hips get stronger. Foam rolling and stretching may feel good but do not fix it on their own.",
  muscles:[["gmed","Keeps the pelvis level and the knee from dropping inward when you run."],["glutes","Control hip rotation and share the load."],["quads","Support the knee on downhill running."],["core","Keeps your pelvis stable on every stride."]],
  stronger:["Reduce distance and avoid downhill running until pain-free.","Run on alternating sides of a sloped road, or on flat ground.","Increase weekly distance by about 10% at a time."]},
 "knee-oa":{part:"In knee osteoarthritis the smooth cartilage that covers the ends of the bones slowly thins, the joint space narrows and small bone spurs can form at the edges. The knee keeps adapting and repairing — it is not simply 'worn out'.",
  how:"Age, an old knee injury (for example ACL or meniscus), extra body weight and genetics all play a part. It develops over years.",
  grades:[["Mild","Daily life is fine; long walks or sport hurt."],["Moderate","Pain most days on stairs or standing up."],["Severe","Pain at rest or at night. Still keep exercising; also talk to your doctor about other options."]],
  heal:"Exercise is the main, most-recommended treatment: strength and activity reduce pain about as much as common painkillers. Cartilage loves movement — joints are nourished when they are loaded.",
  muscles:[["quads","The most important — stronger quads mean less knee pain and better walking."],["glutes","Make standing up and stairs easier."],["gmed","Reduces the inward knee load that hurts the inner joint."],["calves","Help with walking and balance."]],
  stronger:["Mild pain (3–4/10) during exercise is fine if it settles within 24 hours.","Walk most days; use a cycle or pool on flare-up days.","If overweight, losing 5–10% of body weight clearly reduces knee pain."]},
 osgood:{part:"In growing children, the patellar tendon attaches to a growth area at the top of the shin bone (the tibial tuberosity). In Osgood-Schlatter this growth area is pulled and irritated, making a tender bump below the kneecap.",
  how:"Growth spurts plus lots of running, jumping and kicking. The bones grow fast and the muscles become tight and pull harder on the growth area.",
  grades:[["Mild","Can play; sore afterwards."],["Moderate","Pain limits running and jumping."],["Severe","Stairs and kneeling hurt in daily life."]],
  heal:"It is not dangerous and settles when growth finishes (usually by 14–16). The bump may stay but stops hurting. Managing load — not total rest — keeps young players active.",
  muscles:[["quads","Gentle strength (and later stretching) reduces the pull on the growth area."],["glutes","Help with landing so the knee takes less."],["hamstrings","Balance the front and back of the thigh."],["calves","Absorb running and jumping forces."]],
  stronger:["Use the pain ladder: keep sport pain at 2/10 or less.","Use knee pads for kneeling and goalkeeping.","Talk to the coach about fewer jumping and sprint drills during growth spurts."]}
});
Object.assign(ANAT,{
 "ankle-sprain":{part:"The outer ankle has three small ligaments that hold the ankle bones together. The one at the front (ATFL) is injured in almost every sprain; bad sprains also tear the one below (CFL).",
  how:"The foot rolls inward — landing on someone's foot, stepping on uneven ground or turning quickly. Swelling and bruising appear on the outer ankle.",
  grades:[["Grade 1 — stretched","Little swelling; you can walk with mild pain. 1–3 weeks."],["Grade 2 — partial tear","Clear swelling and bruising, limping. 3–6 weeks."],["Grade 3 — complete tear","Large swelling, the ankle feels unstable and walking is very hard. 6–12 weeks; get it checked."]],
  heal:"Ligaments heal by laying down new fibres over 6–12 weeks. Early movement, walking as able and balance training make them stronger. Without proper rehab, up to 1 in 3 people sprain the same ankle again.",
  muscles:[["calves","Strong calves control the ankle when you land and push off."],["tibialis","Shin muscles pull the foot up and steady it on landing."],["feet","Small foot muscles improve balance on uneven ground."],["gmed","Hip control reduces how hard you land on the ankle."]],
  stronger:["Balance on one leg every day — eyes closed when it gets easy.","Keep balance and hop drills for 3 months after you are back.","Consider a brace or tape for sport in the first year after a bad sprain."]},
 achilles:{part:"The Achilles tendon joins the calf muscles to the heel bone. It is the strongest tendon in the body. In tendinopathy the tendon is overloaded and thickens — most often 2–6 cm above the heel.",
  how:"A rise in running, jumping or hill training, new shoes, or a hard surface — often in people over 30 when the tendon recovers more slowly.",
  grades:[["Mild","Stiff in the morning, fine once warm."],["Moderate","Pain limits running."],["Severe","Pain walking, thickened tendon. Can take 3–6 months."]],
  heal:"Tendons rebuild with steady, heavy calf loading over about 12 weeks. Rest alone makes them weaker. Pain up to 3–4/10 during loading is acceptable if it settles by the next morning.",
  muscles:[["calves","The core treatment — heavy calf raises with straight and bent knees."],["hamstrings","Help push off so the calf and tendon aren't overloaded."],["glutes","Power for running that spares the lower leg."],["feet","Stable feet reduce twisting load on the tendon."]],
  stronger:["Keep 2 calf-strength sessions a week forever.","Increase running by about 10% a week; add hills last.","Morning stiffness is your guide: if it is worse the next day, ease off."]},
 plantar:{part:"The plantar fascia is a thick band under the foot. It runs from the heel bone to the base of the toes and supports the arch. In plantar fasciitis (heel pain) the band is overloaded where it attaches to the heel.",
  how:"Long standing or walking, a jump in running, weight gain, tight calves or worn-out shoes.",
  grades:[["Recent (under 6 weeks)","Morning pain only."],["6 weeks – 6 months","Pain most days, after standing."],["Over 6 months","Long-standing heel pain — still improves with loading."]],
  heal:"Most people get better within 6–12 months, faster with the right exercise. High-load heel raises with the toes lifted strengthen the band itself; a supportive shoe and calf stretches also help.",
  muscles:[["calves","Tight, weak calves pull on the heel and fascia."],["feet","Small foot muscles support the arch with the fascia."],["tibialis","Shin muscles help hold the arch."],["glutes","Better leg control spreads the load when you walk and run."]],
  stronger:["Do the high-load heel raise (towel under toes) every other day.","Wear supportive shoes; avoid long barefoot walking on hard floors while sore.","Stretch the calf and arch before the first steps in the morning."]},
 shin:{part:"Shin splints (medial tibial stress syndrome) is overload of the inner edge of the shin bone and the muscles attached to it, usually along the lower half.",
  how:"A sudden jump in running, new hard surfaces, or worn shoes — common in new runners, football pre-season and military training.",
  grades:[["Mild","Pain after running; eases during the run."],["Moderate","Pain throughout the run."],["Severe","Pain walking or at rest — rule out a stress fracture first."]],
  heal:"Bone adapts to load over weeks. Reduce running enough to keep pain low, then build up slowly. One small, very painful spot on the bone can be a stress fracture — see a doctor.",
  muscles:[["calves","Soleus and calf strength absorb running shock before the bone."],["tibialis","Shin muscles control the foot landing."],["feet","Arch strength reduces strain on the inner shin."],["glutes","Help with running form and load."]],
  stronger:["Increase running by no more than 10% a week.","Mix running surfaces and replace worn shoes.","Run with slightly shorter, quicker steps."]},
 calf:{part:"The calf has two main muscles: the gastrocnemius (the bulky upper calf) and the soleus (deeper and lower). A calf strain is a tear in one of them — most often the inner gastrocnemius.",
  how:"A sudden push-off or acceleration ('like being hit in the calf'), often in tennis and football, and more common over 35. Soleus strains can come on gradually while running.",
  grades:[["Grade 1","Tight; you can walk normally. 1–3 weeks."],["Grade 2","Limping; can't rise onto tiptoe on that leg. 3–6 weeks."],["Grade 3","Large tear — get checked by a doctor first."]],
  heal:"Muscle heals in weeks. Gentle early walking and calf raises help the new fibres line up strongly. Rushing back to sprinting is the main cause of re-tears.",
  muscles:[["calves","Rebuild both the bent-knee (soleus) and straight-knee (gastrocnemius) parts."],["hamstrings","Share push-off work in sprinting."],["glutes","Power for running so the calf takes less."],["feet","Better foot control reduces strain on the calf."]],
  stronger:["Warm up with skips and calf raises before sprinting.","Return to sprinting step by step: 60%, 80%, then 100%.","Keep 2 calf sessions a week, especially if you are over 35."]}
});
Object.assign(ANAT,{
 hamstring:{part:"The hamstrings are three muscles at the back of the thigh. The outer one (biceps femoris) is torn most often, usually in its upper part where muscle joins tendon.",
  how:"Sprinting at top speed — the muscle is stretched and working hard at the same moment as the leg swings forward. Also from high kicks or slipping into a split. Fatigue and a previous tear raise the risk.",
  grades:[["Grade 1","Tight, can walk and jog. 1–3 weeks."],["Grade 2","Clear pain, limping, maybe bruising. 3–8 weeks."],["Grade 3","Large tear or tendon pulled off the bone (often with a pop near the buttock) — see a doctor first."]],
  heal:"Muscle repairs in weeks, but strength and sprint speed take longer to return. Most re-injuries happen when players go back before full strength. The Nordic hamstring curl halves hamstring injuries.",
  muscles:[["hamstrings","Rebuild strength at long muscle length — Nordics and single-leg deadlifts."],["glutes","Strong glutes do more of the sprint work, sparing the hamstrings."],["core","Pelvic control stops the hamstrings being over-stretched."],["calves","Share the work of push-off."]],
  stronger:["Return to sprinting step by step: 60%, 80%, 90%, then full speed.","Keep Nordic curls once or twice a week all season.","Don't sprint at full speed when very tired at first."]},
 quad:{part:"The quadriceps are four muscles at the front of the thigh. The rectus femoris — the long one down the middle — is the one usually torn, because it crosses both the hip and the knee.",
  how:"Kicking hard (especially long balls) or sprinting, often in a cold or tired muscle.",
  grades:[["Grade 1","Tight, can jog. 1–3 weeks."],["Grade 2","Painful walking fast, weak kick. 3–6 weeks."],["Grade 3","Large tear or dent in the muscle — medical assessment first."]],
  heal:"The muscle heals in weeks when loaded gradually. Kicking returns last: short passes first, then long kicks.",
  muscles:[["quads","Rebuild strength through knee extension and lunges, then speed."],["hipflex","Train the hip-flexing part of rectus femoris for kicking."],["glutes","Balance the front of the hip."],["core","Stabilises the pelvis when kicking."]],
  stronger:["Warm up with gradual kicking before shooting or long passes.","Rebuild kicking: 10 m, 20 m, 30 m, then shooting.","Don't stretch hard into pain in the first week."]},
 lbp:{part:"The lower back has five vertebrae, discs between them, small joints at the back, and layers of muscle. With most back pain no serious damage is found — muscles and joints are sensitive and protective, and the back is still strong.",
  how:"Lifting, bending, a long day sitting, poor sleep or stress can all trigger it. Often there is no single cause.",
  grades:[["Acute (under 6 weeks)","A recent flare-up — usually improves within weeks."],["Persistent (6–12 weeks)","Not settling on its own; active treatment helps."],["Chronic (over 3 months)","Long-term pain. Exercise, activity and good sleep are the best tools."]],
  heal:"Most episodes improve within 2–6 weeks. Staying active beats bed rest; scans rarely change what helps. Exercise of almost any type you enjoy reduces pain and stops it coming back.",
  muscles:[["core","Deep trunk muscles support the spine in everyday movements."],["glutes","Strong hips mean the back does less of the lifting."],["lowback","Back muscles need strength, not just rest."],["hamstrings","Better hip bending takes strain off the back."]],
  stronger:["Keep moving: short walks every day during a flare-up.","Lift with your hips and legs, close to the body — but bending your back is normal and safe.","Get help urgently for numbness around the groin or bladder/bowel changes."]},
 sciatica:{part:"Sciatica is pain from an irritated nerve root as it leaves the lower spine. Usually a bulging disc presses on or inflames the nerve, and pain travels down the buttock and leg along the nerve.",
  how:"Often after lifting or bending, sometimes for no clear reason. Leg pain is usually worse than back pain, and may come with tingling or numbness.",
  grades:[["Mild","Leg pain comes and goes; you can work and walk."],["Moderate","Constant leg pain; sitting and sleeping are hard."],["Severe","Numbness or weakness — get a medical review first."]],
  heal:"Most people improve within 6–12 weeks; the disc bulge often shrinks by itself. Gentle movement and nerve-glide exercises help. Surgery is only for severe weakness or pain that does not improve.",
  muscles:[["core","Supports the spine so the nerve is less irritated."],["glutes","Reduce strain on the back during walking and lifting."],["lowback","Gentle back extension often eases disc-type leg pain."],["hamstrings","Gentle mobility helps the nerve glide."]],
  stronger:["Find positions that ease leg pain and use them often.","Walk regularly — short and frequent beats long and rare.","Go to hospital now for numbness around the groin or new bladder/bowel problems."]},
 spondy:{part:"A stress fracture in a small bridge of bone at the back of a lower vertebra (the pars), most often L5. It is the most common cause of ongoing back pain in young athletes.",
  how:"Repeated bending backwards and twisting — fast bowling, gymnastics, football kicking, wrestling — during growth.",
  grades:[["Stress reaction","Caught early, before a full crack."],["Confirmed fracture","Crack seen on a scan — typical 3–4 month programme."],["Long-standing","Pain for over 6 months — slower return."]],
  heal:"With a break from bending backwards and twisting, most heal or settle within 3–6 months. A gradual, supervised return keeps it from coming back.",
  muscles:[["core","Holds the spine steady so the pars is protected."],["glutes","Power for kicking and bowling without arching the back."],["hamstrings","Tight hamstrings increase strain on the low back."],["hipflex","Tight hip flexors tilt the pelvis and arch the back."]],
  stronger:["Avoid back-arching moves until your doctor clears you.","Build core endurance (planks, dead bugs) before sport.","Limit bowling or high-load repetitions during growth spurts."]}
});
Object.assign(ANAT,{
 shoulder:{part:"The rotator cuff is four small muscles whose tendons wrap around the ball of the shoulder and keep it centred in the socket. The top tendon (supraspinatus) runs under the bony roof of the shoulder (acromion) and is the one usually irritated.",
  how:"Repeated lifting, throwing or overhead work, or a sudden rise in gym training. Weak shoulder-blade muscles and stiff upper back let the tendon get squeezed and overloaded.",
  grades:[["Mild","Pain only when throwing or working overhead."],["Moderate","Dressing and reaching up hurt; painful arc lifting the arm sideways."],["Severe","Pain at night and a weak arm. A sudden loss of strength after a fall needs a doctor (possible tear)."]],
  heal:"Tendon pain improves with progressive strengthening over 6–12 weeks. Exercise gives results similar to surgery for most people with impingement-type pain.",
  muscles:[["cuff","The rotator cuff itself — band external and internal rotation."],["upperback","Shoulder-blade muscles give the cuff a stable base."],["delts","Strong shoulders share the lifting load."],["core","A stable trunk improves throwing and lifting technique."]],
  stronger:["Work in a pain-free range first, then raise the arm higher week by week.","Balance pushing exercises with pulling (rows, Y-raises).","Warm up the cuff with a band before throwing or overhead lifting."]},
 instab:{part:"The shoulder is a shallow ball-and-socket joint. A ring of cartilage (the labrum) deepens the socket. In a dislocation the ball comes out of the socket — usually forwards — and can tear the labrum and stretch the capsule.",
  how:"A fall on an outstretched arm, or the arm forced up and back (tackling, blocking a shot, wrestling). Young athletes have the highest chance of it happening again.",
  grades:[["Partial slip (subluxation)","Slipped and went back by itself."],["First dislocation","Fully out and put back by a doctor."],["Keeps happening","Several episodes — also see a shoulder specialist."]],
  heal:"The torn labrum and stretched capsule need muscle control to protect them. Many people regain a stable shoulder with rehab; young contact athletes with repeated dislocations are often offered surgery.",
  muscles:[["cuff","Keeps the ball centred in the socket — the key protector."],["upperback","Positions the socket under the ball."],["delts","Strength in the 'at-risk' arm positions."],["chest","Controls the arm in front of the body (push-ups, tackling)."]],
  stronger:["Avoid the arm up-and-back position until strength returns.","Build strength in the at-risk position slowly before contact sport.","Any new dislocation means a medical check."]},
 "tennis-elbow":{part:"Tennis elbow is overload of the tendon where the wrist-extensor muscles attach to the bony bump on the outer elbow (lateral epicondyle). These muscles lift the wrist and help you grip.",
  how:"Repeated gripping and wrist work — racket sports, tools, carrying bags, typing or a mouse. Only a few cases come from tennis.",
  grades:[["Mild","Pain only with heavy gripping."],["Moderate","Lifting a cup or kettle hurts."],["Long-standing","Pain for over 3 months — still improves with loading."]],
  heal:"Most cases settle within a year, faster with tendon loading exercises. Steroid injections help short-term but results are worse later — exercise is the better long-term choice.",
  muscles:[["forearms","Slow, heavy wrist-extension loading is the main treatment."],["cuff","A strong shoulder takes strain off the forearm."],["upperback","Better arm position for gripping and lifting."]],
  stronger:["Lift and carry with the palm facing up when you can.","Use a thicker grip on tools and rackets.","Keep wrist exercises 2–3 times a week after it settles."]},
 neck:{part:"The neck has seven small vertebrae with discs between them, joints at the back, and layers of muscles that hold up the head. With most neck pain no damage is found — the muscles and joints are sensitive and stiff.",
  how:"Long phone or desk time with the head forward, poor sleep, stress, or a sudden awkward movement.",
  grades:[["Acute (under 6 weeks)","A recent stiff neck — usually improves within weeks."],["Persistent (6–12 weeks)","Not settling; exercise helps."],["Chronic (over 3 months)","Long-term pain — strength, movement and breaks are key."]],
  heal:"Most neck pain improves within weeks. Gentle movement and strengthening the deep neck and upper-back muscles help more than rest or a collar.",
  muscles:[["neck","Deep neck muscles hold the head without strain."],["upperback","Shoulder-blade muscles support the neck from below."],["cuff","Arm strength reduces load on the neck when lifting."]],
  stronger:["Hold the phone at eye level; screen at eye height.","Move your neck gently every 30–45 minutes.","See a doctor for dizziness, arm weakness or numbness."]},
 upperback:{part:"Between the shoulder blades sit the rhomboids and the middle and lower trapezius. With long sitting they become tired and sore, and the upper back stiffens. Nothing is damaged.",
  how:"Hours of sitting, phone use or driving with rounded shoulders, plus little upper-body strength training.",
  grades:[["Mild","Ache after long sitting."],["Persistent","Pain most days for weeks."],["Long-standing","Months of ache — strength and movement breaks help most."]],
  heal:"Moving the stiff upper back and strengthening the muscles between the shoulder blades usually helps within weeks.",
  muscles:[["upperback","Rhomboids and trapezius — rows and Y-raises."],["cuff","Shoulder control for good arm position."],["core","Supports an upright posture without effort."],["chest","Stretch and balance tight chest muscles."]],
  stronger:["Change position every 30–45 minutes; no single posture is perfect.","Do rows or band pull-aparts 3 times a week.","Set your screen at eye height."]}
});
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

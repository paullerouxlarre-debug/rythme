
/* ================= Muscle ================= */
V.sport=function(){
  const seg=`<div class="seg">${[['over','Aperçu'],['add','Séance']].map(([k,l])=>`<button class="${ui.sp===k?'on':''}" data-act="sp" data-id="${k}">${l}</button>`).join('')}</div>`;
  if(ui.sp!=='over'&&ui.sp!=='add')ui.sp='over';
  if(ui.tl==='max')return SP.max();
  if(ui.tl==='calc')return `<button class="back" data-act="tl" data-id="">‹ Muscle</button><h1 class="page" style="margin-top:0">Calcul de course</h1>${SP.calc()}`;
  const calcBtn=`<button class="toolrow" style="margin:0 0 12px" data-act="tl" data-id="calc"><span class="tico" style="background:linear-gradient(135deg,#FF9500,#FF2D55)"><svg viewBox="0 0 24 24"><circle cx="14.5" cy="4.5" r="2"/><path d="M6 21l3-6 3 2 2-5-3-2-3 1M12 17l1 4M16 11l3 2"/></svg></span><span style="flex:1;min-width:0;text-align:left"><b>Calculateur de course</b><small>Allure, temps, distance, passages</small></span><span class="chev">›</span></button>`;
  return `<h1 class="page">Muscle</h1>${seg}${calcBtn}${SP[ui.sp]()}`;
};
function periodDays(){return ui.per==='all'?null:lastDays(+ui.per);}
function groupStats(days){
  const ws=days?inDays(days):S.workouts;
  const g={};GROUPS.forEach(x=>g[x]={sets:0,vol:0,last:'',ex:{}});
  const bump=(grp,n,d)=>{if(n>0){g[grp].sets+=n;if(d>g[grp].last)g[grp].last=d;}};
  ws.forEach(w=>{
    if(w.type==='muscu'){exsOf(w).forEach(e=>{const k=g[e.group]||(g[e.group]={sets:0,vol:0,last:'',ex:{}});
      k.sets+=e.sets.length;k.vol+=sum(e.sets.map(t=>(t.kg||0)*(t.reps||0)));if(w.date>k.last)k.last=w.date;k.ex[e.name]=(k.ex[e.name]||0)+e.sets.length;});}
    else if(w.type==='course'){bump('Jambes',Math.round(w.min/8),w.date);bump('Abdos',Math.round(w.min/40),w.date);}
    else if(w.type==='padel'){bump('Jambes',Math.round(w.min/15),w.date);bump('Bras',Math.round(w.min/30),w.date);bump('Épaules',Math.round(w.min/30),w.date);}
    else if(w.type==='bodyboard'){bump('Bras',Math.round(w.min/20),w.date);bump('Épaules',Math.round(w.min/20),w.date);bump('Jambes',Math.round(w.min/30),w.date);bump('Dos',Math.round(w.min/40),w.date);}
  });
  return g;
}
/* silhouette (moitié droite, miroir pour la gauche) */
const BODY_HALF='M110 66L124 66Q142 68 158 76Q182 80 186 104Q188 128 186 150Q187 176 191 204Q193 216 189 226Q183 231 178 222Q176 192 170 162Q167 136 164 114Q160 134 152 164Q150 176 154 190Q160 204 158 232Q156 280 150 318Q146 336 150 356Q152 378 146 396Q146 406 148 412Q150 418 134 418L124 418Q126 396 124 372Q122 344 120 322Q114 280 114 234L110 234Z';
const BZ_DELT='d="M150 74Q178 76 186 100Q187 114 176 116Q160 104 150 82Z"';
const BZ_ARM='d="M168 104Q182 108 184 134Q183 148 172 150Q166 130 168 104Z"';
const BZ_FORE='d="M172 164Q186 168 189 198Q185 208 180 206Q173 190 172 164Z"';
const BZ_LEG='d="M118 232Q150 222 156 238Q156 280 148 308Q132 314 122 306Q116 270 118 232Z"';
const BZ_CALF='d="M124 336Q142 330 148 344Q150 372 144 390Q132 392 127 380Q123 356 124 336Z"';
const ZF=[['Épaules','path',BZ_DELT],['Pectoraux','path','d="M112 82Q134 76 156 86Q160 100 152 112Q132 118 112 110Z"'],
  ['Abdos','rect','x="113" y="118" width="12" height="14" rx="5"'],['Abdos','rect','x="113" y="135" width="12" height="14" rx="5"'],['Abdos','rect','x="113" y="152" width="12" height="14" rx="5"'],
  ['Abdos','path','d="M130 120Q145 130 149 164Q143 172 135 166Q137 144 130 120Z"'],
  ['Bras','path',BZ_ARM],['Bras','path',BZ_FORE],['Jambes','path',BZ_LEG],['Jambes','path',BZ_CALF]];
const ZB=[['Dos','path','d="M110 58L124 66Q142 68 156 78Q140 98 110 104Z"'],['Épaules','path',BZ_DELT],
  ['Dos','path','d="M114 112Q142 104 160 96Q164 124 152 160Q132 154 114 146Z"'],['Dos','path','d="M112 150Q132 156 146 166Q144 182 130 186Q116 186 112 180Z"'],
  ['Bras','path',BZ_ARM],['Bras','path',BZ_FORE],['Jambes','path','d="M112 190Q140 182 156 198Q160 222 140 232Q120 234 112 222Z"'],
  ['Jambes','path',BZ_LEG],['Jambes','path',BZ_CALF]];
const PILLS_F=[['Épaules','L',60,[48,96]],['Pectoraux','R',70,[138,98]],['Bras','L',140,[44,130]],['Abdos','R',150,[119,142]],['Jambes','L',258,[84,272]]];
const PILLS_B=[['Épaules','L',60,[48,96]],['Dos','R',100,[140,130]],['Bras','L',140,[44,130]],['Jambes','R',238,[132,206]]];
function bodySVG(gs,back){
  const mx=Math.max(...GROUPS.map(x=>gs[x].sets),0),zs=back?ZB:ZF,sel=ui.grp;
  const op=g=>{const i=mx>0?gs[g].sets/mx:0;const o=i>0?.28+.72*i:.07;return sel&&sel!==g?o*.3:o;};
  const col=g=>gs[g].sets>0?GCOL[g]:'#fff';
  const both=(tag,a,style)=>`<${tag} ${a} ${style}/><${tag} ${a} ${style} transform="translate(220 0) scale(-1 1)"/>`;
  const glow=zs.filter(z=>gs[z[0]].sets>0&&(!sel||sel===z[0])).map(z=>both(z[1],z[2],`style="fill:${GCOL[z[0]]};fill-opacity:${(op(z[0])*.9).toFixed(2)}"`)).join('');
  const crisp=zs.map(z=>{const g=z[0],on=sel===g,hot=gs[g].sets>0&&(mx>0&&gs[g].sets/mx>.6);
    return both(z[1],z[2],`class="mz${hot?' hot':''}" data-act="grp" data-id="${g}" style="fill:${col(g)};fill-opacity:${op(g).toFixed(2)};stroke:${on?'#fff':'rgba(255,255,255,.28)'};stroke-width:${on?1.8:.7}"`);}).join('');
  const sil=`<path d="${BODY_HALF}"/><path d="${BODY_HALF}" transform="translate(220 0) scale(-1 1)"/><circle cx="110" cy="34" r="19"/><path d="M101 50H119L121 68H99Z"/>`;
  const face=back?'':`<path d="M101 38q9 6 18 0" stroke="rgba(255,255,255,.22)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const pl=(back?PILLS_B:PILLS_F).map(([g,side,y,[ax,ay]])=>{
    const o=gs[g],x=side==='L'?0:332,on=sel===g,c=GCOL[g],w=128,h=50,i=mx>0?o.sets/mx:0;
    const ex=side==='L'?w:x,tx=ax+120;
    return `<g class="bp ${on?'on':''}" data-act="grp" data-id="${g}"><line x1="${ex}" y1="${y}" x2="${tx}" y2="${ay}" stroke="${c}" stroke-opacity="${on?1:.5}" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${tx}" cy="${ay}" r="4" fill="${c}" stroke="#fff" stroke-width="1.5"/>
      <rect x="${x}" y="${y-25}" width="${w}" height="${h}" rx="15" fill="${on?'rgba(255,255,255,.24)':'rgba(255,255,255,.1)'}" stroke="${on?'#fff':c}" stroke-opacity="${on?1:.55}" stroke-width="1.4"/>
      <circle cx="${x+16}" cy="${y-9}" r="5.5" fill="${c}"/><text x="${x+28}" y="${y-4}" font-size="17" font-weight="700" fill="#fff">${g}</text>
      <text x="${x+16}" y="${y+14}" font-size="13.5" fill="#fff" fill-opacity=".72">${o.sets} série${o.sets>1?'s':''}</text>
      <rect x="${x+w-50}" y="${y+9}" width="34" height="5" rx="2.5" fill="#fff" fill-opacity=".18"/><rect x="${x+w-50}" y="${y+9}" width="${Math.round(34*i)}" height="5" rx="2.5" fill="${c}"/></g>`;}).join('');
  return `<svg viewBox="0 0 460 432" width="100%" role="img" aria-label="${back?'Dos':'Face'} : muscles travaillés"><defs><filter id="bgl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter><radialGradient id="bfl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <g transform="translate(120 0)"><ellipse cx="110" cy="420" rx="90" ry="9" fill="url(#bfl)"/>
  <g fill="#34324a" stroke="#6f6d92" stroke-width="3" stroke-linejoin="round">${sil}</g><g fill="#2a2840">${sil}</g>
  <g filter="url(#bgl)">${glow}</g>${crisp}${face}</g>${pl}</svg>`;
}
function bodyCard(gs){
  const back=ui.bv==='b',td=todayK();
  const ranked=GROUPS.slice().sort((a,b)=>gs[b].sets-gs[a].sets);
  const anyMu=S.workouts.some(w=>w.type==='muscu');
  const dueOf=x=>anyMu&&(!gs[x].last||(new Date(td+'T12:00')-new Date(gs[x].last+'T12:00'))/864e5>9);
  const due=GROUPS.filter(dueOf);
  const g=ui.grp&&gs[ui.grp];
  const det=g?`<div class="bdet"><b style="color:${GCOL[ui.grp]}">${ui.grp}</b> · ${g.sets} série${g.sets>1?'s':''}${g.vol?' · '+fmtN(g.vol/1000,1)+' t soulevées':''}${Object.keys(g.ex).length?'<br><span>'+Object.entries(g.ex).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n,c])=>esc(n)+' ×'+c).join(' · ')+'</span>':''}</div>`:'';
  return `<div class="bcard"><div class="bhead"><span>Muscles sollicités</span><div class="bseg"><button class="${back?'':'on'}" data-act="bv" data-id="f">Face</button><button class="${back?'on':''}" data-act="bv" data-id="b">Dos</button></div></div>
    <div class="bfig">${bodySVG(gs,back)}</div>
    ${det}${due.length&&!g?`<div class="bdue"><u>À relancer</u>${due.map(x=>`<button data-act="grp" data-id="${x}">${x}</button>`).join('')}</div>`:''}</div>`;
}
SP.over=function(){
  const td=todayK(),days=periodDays(),ws=days?inDays(days):S.workouts,gs=groupStats(days);
  const wsd=wk(td),wdays=[0,1,2,3,4,5,6].map(i=>addD(wsd,i)),wsess=inDays(wdays),goal=S.goals.weekSessions;
  const wmin=sum(wsess.map(w=>w.min)),wkm=sum(wsess.filter(w=>w.type==='course').map(w=>w.dist||0));
  const per=`<div class="seg">${[['7','7 jours'],['30','30 jours'],['all','Tout']].map(([k,l])=>`<button class="${ui.per===k?'on':''}" data-act="per" data-id="${k}">${l}</button>`).join('')}</div>`;
  const mins=sum(ws.map(w=>w.min)),km=sum(ws.filter(w=>w.type==='course').map(w=>w.dist||0)),vol=sum(ws.map(volOf));
  const wsl=weeks(8);
  const stack=wsl.map(k=>({l:dShort(k).split(' ')[0],parts:Object.keys(SPORTS).map(t=>({v:sum(S.workouts.filter(w=>wk(w.date)===k&&w.type===t).map(w=>w.min)),c:SPORTS[t].col}))}));
  const start=addD(wk(td),-77),cells=[];
  for(let i=0;i<84;i++){const k=addD(start,i),m=sum(wOn(k).map(w=>w.min)),fut=k>td;
    const a=m<=0?0:m<30?.35:m<60?.6:m<90?.8:1;
    cells.push(`<i ${a?`style="background:color-mix(in srgb,var(--tc) ${Math.round(a*100)}%,var(--surface-3))"`:''} ${fut?'style="opacity:.3"':''} title="${dShort(k)}"></i>`);}
  const rec=[];
  const best={};S.workouts.filter(w=>w.type==='muscu').forEach(w=>exsOf(w).forEach(e=>e.sets.forEach(t=>{const v=e1rm(t.kg||0,t.reps||0);if(v>(best[e.name]?best[e.name].v:0))best[e.name]={v,kg:t.kg,reps:t.reps};})));
  Object.entries(best).sort((a,b)=>b[1].v-a[1].v).slice(0,4).forEach(([n,b])=>rec.push([n,`${b.kg} kg × ${b.reps}`,`1RM ≈ ${fmtN(b.v)} kg`,'#0A84FF']));
  const runs=S.workouts.filter(w=>w.type==='course'&&w.dist>0);
  if(runs.length){const lg=runs.reduce((a,b)=>b.dist>a.dist?b:a);rec.push(['Plus longue sortie',fmtN(lg.dist,1)+' km',dShort(lg.date),'#FF9500']);
    const f=runs.filter(w=>w.dist>=3);if(f.length){const bp=f.reduce((a,b)=>b.min/b.dist<a.min/a.dist?b:a);rec.push(['Meilleure allure',mmss(bp.min/bp.dist)+'/km',dShort(bp.date),'#FF2D55']);}}
  const all=S.workouts.slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0),jr=ui.open.jall?all:all.slice(0,5);
  const lab=ui.per==='all'?'depuis le début':ui.per+' derniers jours';
  return `<div class="hero2"><div style="display:flex;align-items:center;gap:16px"><div class="rw" style="width:96px;height:96px;flex:none">${ring(goal?wsess.length/goal:0,'#fff',96,11,'rgba(255,255,255,.28)')}<div class="rc" style="flex-direction:column;font-size:26px;font-weight:800">${wsess.length}<small style="font-size:11px;font-weight:600;opacity:.85">/ ${goal}</small></div></div>
    <div style="flex:1;min-width:0"><div class="sm">Cette semaine</div><div style="font-size:22px;font-weight:800;line-height:1.15;margin:2px 0">${wsess.length>=goal?'Objectif atteint':'Encore '+(goal-wsess.length)+' séance'+(goal-wsess.length>1?'s':'')}</div><div class="sm">${streak()} jour${streak()>1?'s':''} d'affilée</div></div></div>
    <div class="mini3"><div><small>Effort</small><b>${cu(wmin,'h')}</b></div><div><small>Course</small><b>${cu(wkm,'km')}</b></div><div><small>Volume</small><b>${cu(sum(wsess.map(volOf))/1000,'t')}</b></div></div></div>
  ${mxCard()}
  <div style="height:14px"></div>${per}
  ${bodyCard(gs)}
  <div class="kpis"><div><small>Séances</small><b>${ws.length}</b></div><div><small>Effort</small><b>${fmtH(mins)}</b></div><div><small>Volume</small><b>${fmtN(vol/1000,1)} t</b></div><div><small>Course</small><b>${fmtN(km,0)} km</b></div></div>
  <div class="section-head"><h2 class="section-title">Semaine après semaine</h2><span class="section-sub">minutes</span></div>
  <div class="card">${stackBars(stack)}<div class="chips" style="margin-top:6px">${Object.entries(SPORTS).map(([k,v])=>`<span class="lg"><span class="dot" style="background:${v.col}"></span>${v.name}</span>`).join('')}</div></div>
  <div class="section-head"><h2 class="section-title">Régularité</h2><span class="section-sub">12 semaines</span></div>
  <div class="card"><div class="heatw">${cells.join('')}</div></div>

  <div class="section-head"><h2 class="section-title">Journal</h2><button class="iconbtn" data-act="gosport" aria-label="Ajouter une séance">+</button></div>
  <div class="row-list">${jr.map(w=>`<div class="row"><div style="display:flex;gap:10px;align-items:stretch;min-width:0"><div class="evbar" style="background:${SPORTS[w.type].col}"></div><div style="min-width:0"><div class="row-title">${SPORTS[w.type].name}${w.src==='strava'?'<span class="src">Strava</span>':''}</div><div class="row-sub">${dShort(w.date)} · ${w.min} min${w.dist?' · '+fmtN(w.dist,1)+' km · '+pace(w):''}${w.type==='muscu'?' · '+setsOf(w)+' séries':''}</div></div></div><button class="row-del" data-act="delw" data-id="${w.id}" aria-label="Supprimer la séance">×</button></div>`).join('')||'<div class="empty">Aucune séance. Va dans Séance pour enregistrer la première.</div>'}</div>
  ${all.length>5?`<button class="btn btn-ghost" style="width:100%;margin-top:10px" data-act="toggle" data-id="jall">${ui.open.jall?'Réduire':'Tout voir ('+all.length+')'}</button>`:''}`;
};

/* ---- Saisie unique ---- */
function tplList(t){
  const out=[];
  if(t==='muscu')TPL_M.forEach((x,i)=>out.push({ref:'m:'+i,n:x.n,d:x.d}));
  else TPL_O.forEach((x,i)=>{if(x.t===t)out.push({ref:'o:'+i,n:x.n,d:x.d});});
  S.templates.filter(x=>x.type===t).forEach(x=>out.push({ref:'c:'+x.id,n:x.name,d:x.type==='muscu'?x.exs.length+' exercices':(x.min?x.min+' min':'')+(x.dist?' · '+x.dist+' km':''),custom:x.id}));
  return out;
}
function applyTpl(ref){
  const d=ui.draft,[k,id]=[ref.slice(0,1),ref.slice(2)];
  if(k==='m'){d.exs=TPL_M[+id].x.map(([n,s,r])=>exFromTpl(n,s,r));}
  else if(k==='o'){const t=TPL_O[+id];d.min=t.min;if(t.fmt)d.fmt=t.fmt;}
  else{const t=S.templates.find(x=>x.id===id);if(!t)return;
    if(t.type==='muscu')d.exs=t.exs.map(([n,s,r])=>exFromTpl(n,s,r));
    else{if(t.min)d.min=t.min;if(t.dist)d.dist=t.dist;if(t.fmt)d.fmt=t.fmt;}}
}
SP.add=function(){
  if(!ui.draft)ui.draft=newDraft();
  const d=ui.draft,t=d.type,tl=tplList(t),lib=exLib();
  const dist=num(d.dist),mn=num(d.min);
  const names=Object.keys(lib).sort();
  const fld=(l,k,attr,cls='')=>`<div class="field ${cls}"><label>${l}</label><input data-d="${k}" value="${esc(d[k])}" ${attr}></div>`;
  const exs=d.exs.map((ex,i)=>`<div class="exblock"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div class="row-title">${esc(ex.name)} <span class="tag" style="background:var(--surface);color:${GCOL[ex.group]||GCOL.Autre}">${esc(ex.group)}</span></div><button class="row-del" data-act="delex" data-id="${i}" aria-label="Retirer l'exercice">×</button></div>
    ${ex.prev?`<div class="row-sub">Dernière fois : ${ex.prev.map(s=>s.kg+'×'+s.reps).join(', ')}</div>`:''}
    <div class="setrow head"><span></span><span>kg</span><span>reps</span><span>1RM est.</span><span></span></div>
    ${ex.sets.map((s,j)=>`<div class="setrow"><span class="setn">${j+1}</span><input data-s="${i}:${j}:kg" inputmode="decimal" value="${esc(s.kg)}" placeholder="kg" aria-label="Poids série ${j+1}"><input data-s="${i}:${j}:reps" inputmode="numeric" value="${esc(s.reps)}" placeholder="reps" aria-label="Répétitions série ${j+1}"><span class="muted" style="font-size:12.5px;text-align:center">${num(s.kg)>0&&num(s.reps)>0?fmtN(e1rm(num(s.kg),num(s.reps))):'–'}</span><button class="row-del" data-act="delset" data-id="${i}:${j}" aria-label="Retirer la série">×</button></div>`).join('')}
    <button class="btn btn-ghost" style="margin-top:10px;padding:8px 12px;font-size:13.5px" data-act="addset" data-id="${i}">Ajouter une série</button></div>`).join('');
  const specific=t==='muscu'?`<div class="chips" style="margin:0 0 10px"><span class="muted" style="font-size:12.5px;font-weight:600">Repos</span>${[60,90,120,180].map(s=>`<button class="chip" data-act="rest" data-id="${s}">${s>=120?s/60+' min':s+' s'}</button>`).join('')}</div>${exs}<div class="exadd"><input id="ex-n" list="exl" placeholder="Ajouter un exercice" autocomplete="off"><datalist id="exl">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist><select id="ex-g" aria-label="Groupe musculaire si nouvel exercice">${GROUPS.map(g=>`<option>${g}</option>`).join('')}</select><button class="btn btn-ghost" data-act="addex">Ajouter</button></div><p class="note" style="margin-top:6px">Un nouvel exercice est enregistré avec le groupe choisi.</p>`
    :t==='course'?`<div class="form-grid">${fld('Distance (km)','dist','inputmode="decimal"')}<div class="field"><label>Allure</label><input value="${dist>0&&mn>0?mmss(mn/dist)+' /km':'–'}" disabled></div></div>`
    :t==='padel'?`<div class="field"><label>Format</label><select data-d="fmt">${['Match','Entraînement'].map(x=>`<option ${d.fmt===x?'selected':''}>${x}</option>`).join('')}</select></div>`
    :`<div class="form-grid">${fld('Spot','spot','placeholder="Plage, spot…"')}<div class="field"><label>Houle</label><select data-d="swell">${['Petite','Moyenne','Grosse'].map(x=>`<option ${d.swell===x?'selected':''}>${x}</option>`).join('')}</select></div></div>`;
  return `
  <div class="chips" style="margin-bottom:14px">${Object.entries(SPORTS).map(([k,v])=>`<button class="chip ${t===k?'on':''}" data-act="dtype" data-id="${k}">${v.name}</button>`).join('')}</div>
  <div class="sublabel" style="margin-top:0">Mes entraînements</div>
  <div class="tiles">${tl.map(x=>`<button class="tile" data-act="tpl" data-id="${x.ref}"><b>${esc(x.n)}</b><span>${esc(x.d)}</span>${x.custom?`<span class="x" data-act="deltpl" data-id="${x.custom}" role="button" aria-label="Supprimer le modèle">×</span>`:''}</button>`).join('')||'<div class="empty">Aucun modèle pour ce sport.</div>'}</div>
  <div class="form-panel" style="margin-top:14px"><div class="form-grid">
    ${fld('Date','date','type="date"')}${fld('Durée (min)','min','type="number" inputmode="numeric" placeholder="'+(t==='muscu'?'auto':'45')+'"')}    <div style="margin-top:14px">${specific}</div>
    <div class="form-actions"><button class="btn btn-primary" data-act="addw">Enregistrer la séance</button><button class="btn btn-ghost" data-act="toggle" data-id="tn">Créer un modèle</button></div>
    ${ui.open.tn?`<div style="display:flex;gap:8px;margin-top:12px"><input id="tpl-n" class="inl" placeholder="Nom de l'entraînement"><button class="btn btn-primary" style="flex:none" data-act="savetpl">Sauver</button></div><p class="note" style="margin-top:6px">Le modèle garde les exercices et séries saisis ci-dessus${t==='muscu'?'':', la durée et la distance'}. Il apparaîtra dans « Mes entraînements ».</p>`:''}
    ${ui.msg&&ui.tab==='sport'?`<p class="note">${esc(ui.msg)}</p>`:''}</div>`;
};

/* ---- Calcul de course ---- */
function rcFinal(){
  const r=ui.rc;const d=num(r.d),t=parseDur(r.t),p=parseDur(r.p);
  return (d>0&&t>0&&p>0)?{d,t,p}:null;
}
function rcResult(){
  const f=rcFinal();if(!f)return '';
  const {d,t,p}=f,neg=!!ui.rc.neg;
  const p1=neg?p*1.02:p,p2=neg?p*0.98:p,half=d/2;
  const at=k=>neg?(k<=half?k*p1:half*p1+(k-half)*p2):k*p;
  const step=d<=12?1:d<=25?2:5;
  const pts=[];for(let k=step;k<d-0.001;k+=step)pts.push(k);pts.push(d);
  const rows=[[5,'5 km'],[10,'10 km'],[21.0975,'Semi'],[42.195,'Marathon']];
  const riegel=k=>t*Math.pow(k/d,1.06);
  const p10=riegel(10)/10,p5=riegel(5)/5,pm=riegel(42.195)/42.195;
  const zones=[['Récupération',p10*1.28,p10*1.45,'#34C759'],['Endurance',p10*1.14,p10*1.28,'#32ADE6'],['Marathon',pm*0.99,pm*1.02,'#0A84FF'],['Seuil',p10*1.0,p10*1.06,'#FF9500'],['Intervalles',p5*0.93,p5*0.99,'#FF2D55']];
  return `<div class="hero2"><div class="sm">Ton allure</div><div class="big">${fmtPace(p)} <span style="font-size:18px;font-weight:700">/km</span></div><div class="sm">${fmtN(60/p,2)} km/h · ${fmtDur(t)} pour ${fmtN(d,2)} km</div>
    <div class="mini3"><div><small>Au mile</small><b>${fmtPace(p*1.609344)}</b></div><div><small>400 m</small><b>${fmtDur(p*0.4)}</b></div><div><small>Calories</small><b>${fmtN(10*weight()*(t/60)*0.98)}</b></div></div></div>
  <div class="sublabel">Temps de passage <button class="chip ${neg?'on':''}" style="margin-left:8px;padding:5px 10px;font-size:12px" data-act="rcneg">Départ prudent</button></div>
  <div class="row-list">${pts.map((k,i)=>{const pk=i?pts[i-1]:0,sp=(at(k)-at(pk))/(k-pk);return `<div class="row"><span class="row-title">${k===d?fmtN(d,2).replace(',00','')+' km (arrivée)':fmtN(k,0)+' km'}</span><span class="row-sub" style="margin:0">${fmtPace(sp)}/km</span><span class="row-value">${fmtDur(at(k))}</span></div>`;}).join('')}</div>
  ${neg?'<p class="note">Départ à +2 % plus lent, seconde moitié 2 % plus vite : même temps final.</p>':''}
  <div class="section-head"><h2 class="section-title">Au même rythme</h2></div>
  <div class="row-list">${rows.map(([k,l])=>`<div class="row"><span class="row-title">${l}</span><span class="row-value">${fmtDur(p*k)}</span></div>`).join('')}</div>
  <div class="sublabel">Prédiction depuis cette performance (Riegel)</div><div class="row-list">${rows.map(([k,l])=>`<div class="row"><span class="row-title">${l}</span><span class="row-value">${fmtDur(riegel(k))}</span></div>`).join('')}</div>
  <div class="section-head"><h2 class="section-title">Allures d'entraînement</h2></div>
  <div class="row-list">${zones.map(([n,a,b,c])=>`<div class="row"><span class="row-title"><span class="dot" style="background:${c};margin-right:8px"></span>${n}</span><span class="row-value">${fmtPace(Math.min(a,b))} à ${fmtPace(Math.max(a,b))}</span></div>`).join('')}</div>
  <p class="note">Estimations à partir de ton allure équivalente sur 10 km, à ajuster avec tes sensations et ta fréquence cardiaque. Pas un avis médical.</p>
  <button class="btn btn-primary" style="width:100%;margin-top:12px" data-act="rcsave">Enregistrer cette course</button>`;
}
SP.calc=function(){
  const r=ui.rc;
  return `<div class="card"><div class="form-grid">
    <div class="field"><label>Distance (km)</label><input id="rc-d" data-rc="d" inputmode="decimal" placeholder="10" value="${esc(r.d)}"></div>
    <div class="field"><label>Temps</label><input id="rc-t" data-rc="t" inputmode="numeric" pattern="[0-9]*" placeholder="5000 → 50:00" autocomplete="off" value="${esc(r.t)}"></div>
    <div class="field"><label>Allure (min/km)</label><input id="rc-p" data-rc="p" inputmode="numeric" pattern="[0-9]*" placeholder="500 → 5:00" autocomplete="off" value="${esc(r.p)}"></div>
    <div class="field"><label>Vitesse (km/h)</label><input id="rc-v" data-rc="v" inputmode="decimal" placeholder="12" value="${esc(r.v||'')}"></div></div>
    <div class="chips" style="margin-top:12px">${[[1,'1 km'],[5,'5 km'],[10,'10 km'],[21.0975,'Semi'],[42.195,'Marathon']].map(([v,l])=>`<button class="chip" data-act="rcd" data-id="${v}">${l}</button>`).join('')}<button class="chip" data-act="rcclear">Effacer</button></div>
    <p class="note" style="margin-top:10px">Renseigne deux informations parmi la distance, le temps, l'allure ou la vitesse, le reste se calcule tout seul. Pas besoin de « : » : tape 500 pour 5:00 ou 14530 pour 1:45:30.</p></div>
  <div id="rcout" style="margin-top:12px">${rcResult()}</div>`;
};

/* ================= Nutrition ================= */
V.food=function(){
  const td=todayK(),p=S.profile,n=nutriDay(td);
  const editing=!p||ui.open.pf;
  const prof=editing?`<div class="form-panel"><div class="form-grid">
    <div class="field"><label>Sexe</label><select id="p-s"><option value="h" ${p&&p.sex==='h'?'selected':''}>Homme</option><option value="f" ${p&&p.sex==='f'?'selected':''}>Femme</option></select></div>
    <div class="field"><label>Âge</label><input id="p-a" type="number" inputmode="numeric" value="${p?p.age:''}"></div>
    <div class="field"><label>Taille (cm)</label><input id="p-h" type="number" inputmode="numeric" value="${p?p.height:''}"></div>
    <div class="field"><label>Poids (kg)</label><input id="p-w" type="number" inputmode="decimal" step="any" value="${p?p.weight:''}"></div>
    <div class="field"><label>Type de boulot</label><select id="p-b">${Object.entries(JOB).map(([v,x])=>`<option value="${v}" ${p&&p.base==v?'selected':''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Objectif</label><select id="p-g">${[['maintien','Maintien'],['perte','Perte de poids'],['prise','Prise de masse']].map(([v,x])=>`<option value="${v}" ${p&&p.goal===v?'selected':''}>${x}</option>`).join('')}</select></div></div>
    <div class="form-actions"><button class="btn btn-primary" data-act="saveprofile">Enregistrer</button>${p?`<button class="btn btn-ghost" data-act="toggle" data-id="pf">Annuler</button>`:''}</div></div>`
    :`<div class="card" style="display:flex;align-items:center;gap:12px"><div style="flex:1;min-width:0"><div class="row-title">${p.sex==='h'?'Homme':'Femme'}, ${p.age} ans · ${p.height} cm · ${fmtN(p.weight,1)} kg</div><div class="row-sub">${JOB[p.base]||'Boulot assis'} · ${({maintien:'Maintien',perte:'Perte de poids',prise:'Prise de masse'})[p.goal]} · base ${fmtN(n.bmr)} kcal</div></div><button class="btn btn-ghost" data-act="toggle" data-id="pf">Modifier</button></div>`;
  if(!n)return `<h1 class="page">Nutrition</h1><p class="note" style="margin:0 4px 12px">Renseigne ton profil : tes repères s'ajusteront ensuite chaque jour à ton planning de sport, de boulot et de détente.</p>${prof}`;
  const c=n.c,tot=n.carbs*4+n.prot*4+n.fat*9;
  const tags=[c.min>0?`Sport ${c.min} min`:'Repos',c.work?'Boulot':null,c.trip?'Voyage':null,c.relax?'Détente':null].filter(Boolean);
  const wkDays=Array.from({length:7},(_,i)=>addD(td,i)).map(k=>({k,n:nutriDay(k)}));
  const kcBars=wkDays.map(({k,n:x})=>({l:new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'narrow'}),v:Math.round(x.kc),c:k===td?'var(--tc)':x.c.col}));
  const wl=(S.wlog||[]).slice(-12).map(x=>({l:dShort(x.d),v:x.kg}));
  const fu=ui.fuel,h=fu.min/60,rate=fu.min<45?null:fu.min<=150?[30,60]:[60,90];
  const macro=(l,g,kc,col)=>`<div style="flex:${Math.max(kc,1)};background:${col}"></div>`;
  return `<h1 class="page">Nutrition</h1>
  ${prof}
  <div class="card" style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="section-title" style="color:${c.col}">${c.name}</div><span class="muted" style="font-size:12.5px">aujourd'hui</span></div>
    <div class="chips" style="margin:8px 0 14px">${tags.map(x=>`<span class="chip static on">${x}</span>`).join('')}</div>
    <div class="bignum">${fmtN(n.kc)} <span class="muted" style="font-size:16px;font-weight:600">kcal</span></div>
    <div class="alloc-bar" style="margin:14px 0 8px;height:12px">${macro('c',n.carbs,n.carbs*4,'#FF9500')}${macro('p',n.prot,n.prot*4,'#0A84FF')}${macro('l',n.fat,n.fat*9,'#FFCC00')}</div>
    <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted)"><span>Glucides ${fmtN(n.carbs*4/tot*100)} %</span><span>Protéines ${fmtN(n.prot*4/tot*100)} %</span><span>Lipides ${fmtN(n.fat*9/tot*100)} %</span></div>
    <div class="grid2" style="margin-top:14px">
      <div class="stat"><div class="k">Glucides</div><div class="v">${n.carbs} g</div><div class="s">fourchette ${n.carbLo} à ${n.carbHi} g</div></div>
      <div class="stat"><div class="k">Protéines</div><div class="v">${n.prot} g</div><div class="s">fourchette ${n.protLo} à ${n.protHi} g</div></div>
      <div class="stat"><div class="k">Lipides</div><div class="v">${n.fat} g</div><div class="s">le reste de l'énergie</div></div>
      <div class="stat"><div class="k">Eau</div><div class="v">${fmtN(n.water,1)} L</div><div class="s">repère de la journée</div></div></div></div>

  <div class="section-head"><h2 class="section-title">Autour de l'effort</h2></div>
  <div class="row-list">${[['Avant',n.pre],['Pendant',n.during],['Après',n.after]].map(([a,b])=>`<div class="row" style="align-items:flex-start"><span class="row-title" style="width:70px;flex:none">${a}</span><span style="flex:1;font-size:14px;line-height:1.45">${esc(b)}</span></div>`).join('')}</div>

  <div class="section-head"><h2 class="section-title">Ma semaine</h2><span class="section-sub">selon ton planning</span></div>
  <div class="card">${barChart(kcBars,{h:130,fy:v=>fmtN(v/1000,1)+'k'})}
    <div class="chips" style="margin-top:6px">${[0,1,2,3].map(i=>`<span class="lg"><span class="dot" style="background:${['#8E8E93','#34C759','#FF9500','#FF3B30'][i]}"></span>${['Repos','Léger','Modéré','Gros effort'][i]}</span>`).join('')}</div></div>
  <div class="row-list" style="margin-top:12px">${wkDays.map(({k,n:x})=>`<div class="row"><div style="min-width:0"><div class="row-title cap1">${k===td?'Aujourd\'hui':dLong(k)}</div><div class="row-sub"><span style="color:${x.c.col};font-weight:700">${x.c.name}</span>${x.c.work?' · Boulot':''}${x.c.trip?' · Voyage':''}${x.c.relax?' · Détente':''}${x.c.min?' · '+x.c.min+' min':''}</div></div><div style="text-align:right"><div class="row-value">${fmtN(x.kc)} kcal</div><div class="row-sub">${x.carbs} g gluc. · ${x.prot} g prot.</div></div></div>`).join('')}</div>

  ${wl.length>1?`<div class="section-head"><h2 class="section-title">Poids</h2></div><div class="card">${lineChart(wl,v=>fmtN(v,1)+' kg')}</div>`:''}

  <div class="section-head"><h2 class="section-title">Repères</h2></div>
  <div class="row-list">${INFO.map(i=>`<details class="acc"><summary><span>${esc(i.t)}</span></summary><p>${esc(i.b)}</p></details>`).join('')}<details class="acc"><summary><span>Compléments (facultatif)</span></summary><p>${esc(SUPPL)}</p></details></div>

  <div class="section-head"><h2 class="section-title">Ravitaillement</h2></div>
  <div class="card"><div class="form-grid"><div class="field wide"><label>Durée de l'effort (min)</label><input type="number" inputmode="numeric" value="${fu.min}" data-fuel="min"></div></div>
    <div class="grid2" style="margin-top:12px"><div class="stat"><div class="k">Glucides pendant</div><div class="v">${rate?rate[0]+' à '+rate[1]+' g/h':'Eau seule'}</div><div class="s">${rate?'soit '+Math.round(rate[0]*h)+' à '+Math.round(rate[1]*h)+' g':'sous 45 min'}</div></div>
    <div class="stat"><div class="k">Boisson</div><div class="v">${Math.round(400*h/10)*10} à ${Math.round(800*h/10)*10} ml</div><div class="s">selon chaleur et sueur</div></div></div></div>
  <p class="note">Repères généraux issus des recommandations de nutrition du sport, à adapter à toi. Ce n'est pas un avis médical. En cas de pathologie, de grossesse ou de régime particulier, demande à un professionnel de santé.</p>`;
};


/* ================= vues ================= */
const V={},M={},SP={};
const evPlanned=k=>evOn(k).filter(e=>e.kind==='Sport'&&!e.end);
function evRow(e,k,full){
  const dn=e.done&&e.done[k];
  return `<div class="row" style="align-items:stretch;gap:12px"><div class="evbar" style="background:${EK[e.kind]||EK.Perso}"></div><div style="flex:1;min-width:0"><div class="row-title">${esc(e.title)}${dn?' <span class="tag pos">fait</span>':''}</div><div class="row-sub">${hm(e)} · ${esc(e.kind)}${e.rep==='w'?' · chaque semaine':e.rep==='y'?' · chaque année':''}</div></div>
  <div style="display:flex;gap:6px;align-items:center;flex:none">${e.kind==='Sport'&&!e.end&&!dn&&k<=todayK()?`<button class="btn btn-ghost" style="padding:6px 10px;font-size:12.5px" data-act="evdone" data-id="${e.id}" data-k="${k}">Valider</button>`:''}${full?`<button class="row-del" data-act="dele" data-id="${e.id}" aria-label="Supprimer l'événement">×</button>`:''}</div></div>`;
}
function weekDots(){
  const td=todayK();
  return `<div class="wkstrip">${Array.from({length:7},(_,i)=>addD(td,i)).map(k=>{
    const kinds=[...new Set(evOn(k).map(e=>e.kind))].slice(0,3);
    return `<button class="daycell ${k===td?'tod':''}" data-act="gopl" data-id="${k}"><span>${new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','')}</span><b>${+k.slice(8)}</b><i>${kinds.map(x=>`<u style="background:${k===td?'#fff':EK[x]}"></u>`).join('')}</i></button>`;}).join('')}</div>`;
}


/* ---- Ma journée ---- */
V.today=function(){
  if(ui.tl==='calc')return `<button class="back" data-act="tl" data-id="">‹ Aujourd'hui</button><h1 class="page" style="margin-top:0">Calcul de course</h1>${SP.calc()}`;
  const td=todayK(),tm=addD(td,1),ev0=evOn(td),ev1=evOn(tm),w=wOn(td),min=moveMin(td),smin=stepMin(td),g=S.goals.dayMin;
  const dtxt=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  const ws=wk(td),days=[0,1,2,3,4,5,6].map(i=>addD(ws,i)),wsess=inDays(days);
  const ctx=dayCtx(td);
  const bars=lastDays(7).map(k=>({l:new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'narrow'}),v:moveMin(k),c:k===td?'var(--c-sport)':'var(--surface-3)'}));
  const wmn=workDay(td),wtg=Math.max(dayTarget(),60),pl=evPlanned(td),pld=pl.filter(e=>e.done&&e.done[td]).length;
  /* trois anneaux : clairs pour rester lisibles sur la carte colorée */
  const r3=ctx.work?{p:wmn/wtg,c1:'#FFFFFF',k:'Boulot',v:fmtH(wmn)+' / '+fmtH(wtg)}:{p:pl.length?pld/pl.length:1,c1:'#FFFFFF',k:'Planning',v:pld+' / '+pl.length};
  const RG=[{p:g?min/g:0,c1:'#FFC078',k:'Bouger',v:min+' / '+g+' min'},{p:S.goals.weekSessions?wsess.length/S.goals.weekSessions:0,c1:'#8CE99A',k:'Séances',v:wsess.length+' / '+S.goals.weekSessions+' cette sem.'},r3];
  RG.forEach(r=>r.c2=r.c1);
  return `<h1 class="page">Aujourd'hui</h1><p class="pdate cap1">${dtxt}</p>
  ${dueBanner()}
  <div class="hero2 tday"><div class="tday-top"><div class="tsum">${RG.map(r=>`<div><small><i style="background:${r.c1}"></i>${r.k}</small><b>${esc(r.v)}</b></div>`).join('')}</div>${actRings(RG,112)}</div>
    <div class="chips" style="margin-top:14px"><span class="chip static">${ctx.name}${ctx.min?' · '+ctx.min+' min prévues':''}</span>${streak()?`<span class="chip static">Série de ${streak()} j</span>`:''}</div></div>

  ${workCard()}

  <div class="section-head"><h2 class="section-title">Planning</h2><a class="section-sub" href="#" data-act="gopl" data-id="${td}">Voir le mois</a></div>
  <div class="row-list">${ev0.map(e=>evRow(e,td)).join('')||'<div class="empty">Rien de prévu aujourd\'hui.</div>'}</div>
  ${ev1.length?`<div class="sublabel">Demain</div><div class="row-list">${ev1.map(e=>evRow(e,tm)).join('')}</div>`:''}
  <div style="margin-top:12px">${weekDots()}</div>

  <div class="section-head"><h2 class="section-title">Sport</h2><span class="section-sub">${min} sur ${g} min</span></div>
  <div class="card"><div style="display:flex;align-items:center;gap:16px">
    <div class="rw" style="width:96px;height:96px;flex:none">${ring(g?min/g:0,'var(--c-sport)',96,10)}<div class="rc" style="flex-direction:column;font-size:22px;font-weight:700">${min}<small class="muted" style="font-size:12px;font-weight:600">min</small></div></div>
    <div style="flex:1;min-width:0"><div style="font-weight:650;font-size:16px">${min>=g?'Objectif atteint':min>0?'Encore '+(g-min)+' min':'Pas encore de séance'}</div>
    <div class="muted" style="font-size:14px;margin:3px 0 10px">${[w.length?w.map(x=>x.prog?progName(x.prog):SPORTS[x.type].name).join(', '):'',smin?'dont '+smin+' min de pas':''].filter(Boolean).join(' · ')||'Note une séance en deux gestes'}</div>
    <button class="btn btn-primary" style="width:100%" data-act="gosport">Ajouter une séance</button></div></div>
    <div style="margin-top:12px">${barChart(bars,{h:90,goal:g,goalLabel:g+' min'})}</div></div>

  ${stepsCard()}
`;
};

/* ---- Planning ---- */
V.plan=function(){return `<h1 class="page">Planning</h1>${planMonth()}`;};

function planMonth(){
  if(!ui.sel)ui.sel=todayK();
  const td=todayK(),b=new Date();b.setDate(1);b.setMonth(b.getMonth()+ui.pm);
  const y=b.getFullYear(),m=b.getMonth(),lead=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),rows=lead+dim>35?42:35;
  const cells=[];
  for(let i=0;i<rows;i++){
    const dt=new Date(y,m,1-lead+i),k=dkey(dt),out=dt.getMonth()!==m,ev=evOn(k),hasW=wOn(k).length>0;
    const kinds=[...new Set(ev.map(e=>e.kind).concat(hasW?['Sport']:[]))].slice(0,4);
    const trip=ev.find(e=>e.end&&e.date<=k&&k<=e.end);
    cells.push(`<button class="mday ${out?'out':''} ${ui.sel===k?'sel':''} ${k===td?'tod':''}" ${ui.sel!==k&&(ev.length||hasW)?`style="background:color-mix(in srgb,${EK[(trip||ev[0]||{kind:'Sport'}).kind]} ${trip?26:14}%,var(--surface))"`:''} data-act="plsel" data-id="${k}"><b>${dt.getDate()}</b><i>${kinds.map(x=>`<u style="background:${ui.sel===k?'#fff':EK[x]}"></u>`).join('')}</i></button>`);
  }
  const mp=`${y}-${pad(m+1)}`,occ={};
  for(let d=1;d<=dim;d++){const k=`${mp}-${pad(d)}`;evOn(k).forEach(e=>{(occ[e.id]||(occ[e.id]={e,days:[]})).days.push(k);});}
  const list=Object.values(occ).sort((a,b)=>a.days[0]<b.days[0]?-1:1);
  const nw=S.workouts.filter(w=>w.date.startsWith(mp)).length;
  const trips=sum(list.filter(x=>x.e.kind==='Voyage').map(x=>x.days.length));
  const bds=list.filter(x=>x.e.kind==='Anniversaire').length;
  const sel=ui.sel,evs=evOn(sel),ws=wOn(sel);
  const d=ui.edraft,f=(l,k,attr,cls='')=>`<div class="field ${cls}"><label>${l}</label><input data-e="${k}" value="${esc(d[k])}" ${attr}></div>`;
  const form=ui.open.fe&&d?`<div class="form-panel" style="margin-top:12px"><div class="form-grid">
    ${f('Titre','title','placeholder="Week-end à Lisbonne, anniversaire de Léa…"','wide')}
    <div class="field"><label>Type</label><select data-e="kind">${Object.keys(EK).map(x=>`<option ${d.kind===x?'selected':''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Répétition</label><select data-e="rep"><option value="" ${!d.rep?'selected':''}>Aucune</option><option value="w" ${d.rep==='w'?'selected':''}>Chaque semaine</option><option value="y" ${d.rep==='y'?'selected':''}>Chaque année</option></select></div>
    ${f('Date','date','type="date"')}${f('Jusqu\'au (voyage, vacances)','end','type="date"')}
    ${f('Heure','time','type="time"')}${f('Durée (min)','dur','type="number" inputmode="numeric"')}
    ${d.kind==='Sport'?`<div class="field wide"><label>Sport</label><select data-e="sport">${Object.entries(SPORTS).map(([k,v])=>`<option value="${k}" ${d.sport===k?'selected':''}>${v.name}</option>`).join('')}</select></div>`:''}</div>
    <div class="form-actions"><button class="btn btn-primary" data-act="adde">Ajouter au planning</button><button class="btn btn-ghost" data-act="toggle" data-id="fe">Annuler</button></div></div>`
    :`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-act="newev">Ajouter un événement</button>`;
  const up=[];for(let i=0;i<90&&up.length<5;i++){const k=addD(td,i);evOn(k).forEach(e=>{if(!up.find(x=>x.e.id===e.id)&&up.length<5)up.push({k,e});});}
  const nxt=up[0];
  return `
  <div class="hero2"><div class="sm">Prochain événement</div><div class="big" style="font-size:26px">${nxt?esc(nxt.e.title):'Rien de prévu'}</div>
    <div class="sm">${nxt?(nxt.k===td?'Aujourd\'hui':dLong(nxt.k))+' · '+hm(nxt.e):'Ajoute un événement plus bas'}</div>
    <div class="mini3"><div><small>Événements</small><b>${list.length}</b></div><div><small>Séances</small><b>${nw}</b></div><div><small>Voyage</small><b>${trips} j</b></div></div></div>
  <div class="wkhead"><button class="navbtn" data-act="plm" data-id="-1" aria-label="Mois précédent">‹</button><b class="cap1">${new Date(y,m,1).toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</b><button class="navbtn" data-act="plm" data-id="1" aria-label="Mois suivant">›</button></div>
  <div class="mhead">${['L','M','M','J','V','S','D'].map(x=>`<span>${x}</span>`).join('')}</div>
  <div class="mgrid">${cells.join('')}</div>
  <div class="chips" style="margin-top:12px">${Object.entries(EK).map(([k,c])=>`<span class="lg"><span class="dot" style="background:${c}"></span>${k}</span>`).join('')}</div>
  ${ui.pm!==0?`<button class="btn btn-ghost" style="width:100%;margin-top:10px;padding:8px" data-act="plm" data-id="0">Revenir à ce mois-ci</button>`:''}

  <div class="section-head"><h2 class="section-title cap1">${dLong(sel)}</h2></div>
  <div class="row-list">${evs.map(e=>evRow(e,sel,true)).join('')}${ws.map(x=>`<div class="row" style="align-items:stretch;gap:12px"><div class="evbar" style="background:${SPORTS[x.type].col}"></div><div style="flex:1"><div class="row-title">${SPORTS[x.type].name}${x.src==='strava'?'<span class="src">Strava</span>':''}</div><div class="row-sub">Séance enregistrée · ${x.min} min${x.dist?' · '+fmtN(x.dist,1)+' km':''}</div></div></div>`).join('')}${!evs.length&&!ws.length?'<div class="empty">Rien ce jour-là.</div>':''}</div>
  ${form}

  <div class="section-head"><h2 class="section-title">Ce mois-ci</h2><span class="section-sub">${list.length} événement${list.length>1?'s':''}${bds?' · '+bds+' anniversaire'+(bds>1?'s':''):''}</span></div>
  <div class="row-list">${list.map(x=>`<div class="row" style="align-items:stretch;gap:12px;cursor:pointer" data-act="plsel" data-id="${x.days[0]}" data-jump="1"><div class="evbar" style="background:${EK[x.e.kind]}"></div><div style="flex:1;min-width:0"><div class="row-title">${esc(x.e.title)}</div><div class="row-sub">${x.days.length>1?dShort(x.days[0])+' au '+dShort(x.days[x.days.length-1]):dShort(x.days[0])} · ${esc(x.e.kind)}</div></div></div>`).join('')||'<div class="empty">Aucun événement ce mois-ci.</div>'}</div>
  ${up.length?`<div class="section-head"><h2 class="section-title">À venir</h2></div><div class="row-list">${up.map(({k,e})=>`<div class="row" style="align-items:stretch;gap:12px"><div class="evbar" style="background:${EK[e.kind]}"></div><div style="flex:1;min-width:0"><div class="row-title">${esc(e.title)}</div><div class="row-sub">${dShort(k)} · ${hm(e)}</div></div></div>`).join('')}</div>`:''}`;
}


/* ---- Boulot (dans Ma journée) : pointage modifiable ---- */
function dueBanner(){
  const p=punchDue();if(!p)return '';
  const t=p.st==='late'?'Tu n\'as pas pointé '+p.label:p.st==='soon'?'Bientôt : pointer '+p.label:'C\'est l\'heure de pointer '+p.label;
  const s=p.st==='late'?'Prévu entre '+hm2(p.w[0])+' et '+hm2(p.w[1])+' · l\'heure reste modifiable':'Créneau habituel '+hm2(p.w[0])+'–'+hm2(p.w[1]);
  return `<div class="pdue ${p.st}"><div class="pdi">${IC('clock',20)}</div><div class="pdt"><b>${t}</b><small>${s}</small></div><button class="pdb" data-act="punch">Pointer <span id="pdnow">${hhmm()}</span></button></div>`;
}
function workCard(){
  const td=todayK(),rec=S.work.days[td]||{},ns=nextStep(rec),tgt=S.work.target||39;
  const ws=wk(td),wkMin=workWeek(ws),pct=Math.min(wkMin/(tgt*60),1);
  if(!dayCtx(td).work&&!rec.in)return '';
  const open=!!ui.open.wk||!!punchDue();
  const head=`<div class="section-head"><h2 class="section-title">Boulot</h2><span class="section-sub">${fmtH(wkMin)} sur ${tgt} h cette semaine</span></div>`;
  if(!open)return head+`<button class="card wkmini" data-act="toggle" data-id="wk"><div style="flex:1;min-width:0"><b id="wlive">${fmtH(workMin(rec,true))}</b><small>${rec.in?'Arrivée '+rec.in+(rec.out?' · départ '+rec.out:ns?' · prochaine étape : '+ns[1].toLowerCase():''):'Pas encore pointé'}</small></div><span class="mxgo" style="margin:0">Détails ›</span></button>`;
  return head+`<div class="card punch">
    <div class="bignum" id="wlive">${fmtH(workMin(rec,true))}</div>
    <div class="muted" style="font-size:13px;margin-top:-8px">travaillées aujourd'hui</div>
    <button class="pbtn ${ns?'':'done'} ${punchDue()?'due':''}" data-act="punch" ${ns?'':'disabled'} aria-label="Pointer"><span>${ns?ns[1]:'Journée finie'}</span><small>${ns?'Appuie pour pointer':'À demain'}</small></button>
    <div class="steps">${PSTEPS.map(([k,l])=>`<label class="${rec[k]?'on':''}">${l}<input type="time" value="${rec[k]||''}" data-wt="${k}" data-wd="${td}" aria-label="Modifier ${l}"></label>`).join('')}</div>
    ${leaveAt(rec)?`<div class="leave">${IC('clock',15)}<span>Départ pour ${fmtH(dayTarget())} : <b>${leaveAt(rec)}</b></span></div>`:''}
    <div class="muted" style="font-size:12px">Touche une heure pour la modifier.</div>
    ${ns&&ns[0]==='lo'?'<button class="chip" data-act="nolunch">Pas de pause aujourd\'hui</button>':''}
    <div class="progress" style="width:100%;height:10px"><div style="width:${Math.round(pct*100)}%;background:linear-gradient(90deg,var(--tc),var(--tc2))"></div></div>
  </div>
  <details class="card wdet" ${ui.open.wst?'open':''}><summary data-act="togglesum" data-id="wst"><span>Stats et historique</span><span class="muted" style="font-size:13px">${ui.open.wst?'Masquer':'Afficher'}</span></summary>${ui.open.wst?workStats():''}</details>`;
}
function workStats(){
  const td=todayK(),tgt=S.work.target||39,ws=wk(td),dt=dayTarget();
  const dayItems=[0,1,2,3,4,5,6].map(i=>{const k=addD(ws,i);return {l:['L','M','M','J','V','S','D'][i],v:workDay(k),c:k===td?'var(--tc)':'var(--surface-3)'};});
  const wsList=weeks(8);
  const wkItems=wsList.map(k=>({l:dShort(k).split(' ')[0],v:workWeek(k),c:k===ws?'var(--tc)':'var(--surface-3)'}));
  const done=Object.keys(S.work.days).filter(workDone).sort();
  const past=done.filter(k=>k>=addD(td,-28));
  const avgDay=avg(past.map(workDay));
  const avgIn=avg(past.map(k=>tmin(S.work.days[k].in))),avgOut=avg(past.map(k=>tmin(S.work.days[k].out)));
  const lun=past.map(k=>S.work.days[k]).filter(r=>r.lo&&r.li&&r.li>r.lo).map(r=>tmin(r.li)-tmin(r.lo));
  /* solde : chaque journée complète comparée à l'objectif du jour (week-end : tout compte en plus) */
  const diff=k=>workDay(k)-(isWkday(k)?dt:0);
  const bal=sum(done.map(diff));
  const sg=v=>(v>=0?'+':'−')+fmtH(Math.abs(v));
  const mk=td.slice(0,7),mDays=done.filter(k=>k.startsWith(mk));
  const mTot=sum(mDays.map(workDay)),mBal=sum(mDays.map(diff));
  const wkLeft=tgt*60-workWeek(ws);
  const long=past.length?past.reduce((a,k)=>workDay(k)>workDay(a)?k:a):null;
  const dows=[1,2,3,4,5].map(d=>{const ks=done.filter(k=>k>=wsList[0]&&new Date(k+'T12:00').getDay()===d);return {l:['L','M','M','J','V'][d-1],v:ks.length?avg(ks.map(workDay)):0,c:'var(--tc)'};});
  const months=[5,4,3,2,1,0].map(i=>{const d=new Date(td+'T12:00');d.setDate(1);d.setMonth(d.getMonth()-i);const m=dkey(d).slice(0,7);
    return {l:d.toLocaleDateString('fr-FR',{month:'short'}).replace('.',''),v:sum(done.filter(k=>k.startsWith(m)).map(workDay)),c:m===mk?'var(--tc)':'var(--surface-3)'};});
  const sd=ui.wd||td,sr=S.work.days[sd]||{};
  /* saisie d'un jour : brouillon jusqu'à « Valider » */
  const dr=ui.wdraft&&ui.wdraft.k===sd?ui.wdraft:null,fv=dr||sr,dmin=dr?workMin(dr,false):0;
  const hist=Object.keys(S.work.days).filter(k=>S.work.days[k].in).sort().reverse().slice(0,8);
  const box=(k,v,s)=>`<div class="stat box"><div class="k">${k}</div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:''}</div>`;
  return `<div style="margin-top:14px">
  <div class="sublabel" style="margin-top:0">Cette semaine</div>${barChart(dayItems,{h:120,fy:v=>fmtN(v/60,1)+' h'})}
  <div class="grid2" style="margin-top:12px">
    ${box(wkLeft>0?'Reste cette semaine':'Semaine faite',wkLeft>0?fmtH(wkLeft):sg(-wkLeft),'sur '+tgt+' h')}
    ${box('Solde d\'heures',done.length?sg(bal):'—',done.length?'depuis le '+dShort(done[0])+' · '+fmtH(dt)+' par jour':'aucune journée complète')}
  </div>
  <div class="sublabel">Ce mois-ci</div>
  <div class="grid2">
    ${box('Heures travaillées',mDays.length?fmtH(mTot):'—',mDays.length+' jour'+(mDays.length>1?'s':'')+' complet'+(mDays.length>1?'s':''))}
    ${box('Solde du mois',mDays.length?sg(mBal):'—','vs '+fmtH(dt)+' par jour')}
  </div>
  <div class="sublabel">4 dernières semaines</div>
  <div class="grid2">
    ${box('Moyenne par jour',past.length?fmtH(avgDay):'—')}
    ${box('Pause déjeuner',lun.length?fmtH(avg(lun)):'—','en moyenne')}
    ${box('Arrivée moyenne',past.length?mhm(avgIn):'—')}
    ${box('Départ moyen',past.length?mhm(avgOut):'—')}
    ${long?box('Plus longue journée',fmtH(workDay(long)),dLong(long)):''}
    ${past.length?box('Jours complets',past.length,'sur 4 semaines'):''}
  </div>
  <div class="sublabel">Heures par semaine</div>${barChart(wkItems,{h:130,goal:tgt*60,goalLabel:tgt+' h',fy:v=>fmtN(v/60,0)})}
  ${dows.some(d=>d.v>0)?`<div class="sublabel">Moyenne par jour de la semaine</div><div class="note" style="margin:-4px 4px 6px">Pointillés : ${fmtH(dt)}</div>${barChart(dows,{h:120,goal:dt,fy:v=>fmtN(v/60,1)})}`:''}
  <div class="sublabel">Heures par mois</div>${barChart(months,{h:120,fy:v=>fmtN(v/60,0)})}
  <div class="sublabel">Modifier une journée</div>
  <div class="form-panel" style="margin:0"><div class="form-grid">
    <div class="field wide"><label>Date</label><input type="date" value="${sd}" data-wdate="1"></div>
    ${PSTEPS.map(([k,l])=>`<div class="field"><label>${l}</label><input type="time" value="${fv[k]||''}" data-wdr="${k}" data-wd="${sd}"></div>`).join('')}</div>
    <button class="btn btn-ghost" style="width:100%;margin-top:12px" data-act="wfull" data-id="${sd}">Journée complète · ${fmtH(dt)}</button>
    <p class="note" style="margin:8px 2px 0">${dr?'Total : <b>'+fmtH(dmin)+'</b> · pas encore enregistré.':'Saisis tes heures, ou remplis une journée complète (congé compté 39 h / 5), puis valide.'}</p>
    <div class="form-actions"><button class="btn btn-primary" data-act="wdsave" ${dr?'':'disabled'}>Valider</button>${dr?'<button class="btn" data-act="wdcancel">Annuler</button>':''}<button class="btn btn-ghost danger" data-act="wclear">Effacer</button></div></div>
  <div class="form-panel" style="margin:12px 0 0"><div class="field"><label>Objectif hebdomadaire (heures)</label><input type="number" inputmode="decimal" value="${tgt}" data-wtarget="1"></div></div>
  <div class="row-list" style="margin-top:12px">${hist.map(k=>{const r=S.work.days[k];return `<div class="row" style="cursor:pointer" data-act="wsel" data-id="${k}"><div><div class="row-title cap1">${dLong(k)}</div><div class="row-sub">${r.in||'--'} à ${r.out||'--'}${r.lo&&r.li?' · pause '+r.lo+' à '+r.li:''}</div></div><span class="row-value">${fmtH(workDay(k))}</span></div>`;}).join('')||'<div class="empty">Aucun pointage pour le moment.</div>'}</div></div>`;
}

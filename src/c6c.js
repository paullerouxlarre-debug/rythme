
/* ================= Mes max et niveau (comparaison à des populations) ================= */
/* Modèle : distribution log-normale du ratio max/poids de corps (ou du temps en course).
   Repères : standards Strength Level (pratiquants), standards « non entraînés » et part des hommes
   qui développent leur poids de corps (population générale), records amateurs de force athlétique,
   temps des finishers de courses 5/10 km. Ce sont des estimations. */
const MXL=[
  {k:'bench',n:'Développé couché',lib:'Développé couché',u:'kg',g:{m:.6,s:.33},l:{m:1.22,s:.285},c:{m:1.45,s:.2}},
  {k:'squat',n:'Squat',lib:'Squat',u:'kg',g:{m:.85,s:.33},l:{m:1.66,s:.278},c:{m:2.05,s:.19}},
  {k:'dead',n:'Soulevé de terre',lib:'Soulevé de terre',u:'kg',g:{m:1.0,s:.33},l:{m:1.94,s:.279},c:{m:2.45,s:.18}},
  {k:'ohp',n:'Développé militaire',lib:'Développé militaire',u:'kg',g:{m:.4,s:.34},l:{m:.775,s:.318}},
  {k:'row',n:'Rowing barre',lib:'Rowing barre',u:'kg',g:{m:.55,s:.34},l:{m:1.1,s:.308}},
  {k:'pull',n:'Tractions',lib:'Tractions',u:'reps',g:{m:5,s:.75},l:{m:11,s:.5}},
  {k:'push',n:'Pompes',lib:'Pompes',u:'reps',g:{m:16,s:.7},l:{m:36,s:.45}},
  {k:'run400',n:'400 m',u:'time',g:{m:1.75,s:.2},l:{m:1.35,s:.15},c:{m:1.0,s:.08}},
  {k:'run5',n:'5 km',u:'time',g:{m:33,s:.22},l:{m:26.5,s:.18},c:{m:20,s:.12}},
  {k:'run10',n:'10 km',u:'time',g:{m:68,s:.22},l:{m:53.1,s:.17},c:{m:42,s:.12}},
  {k:'run21',n:'Semi-marathon',u:'time',l:{m:118,s:.16},c:{m:92,s:.1}},
  {k:'run42',n:'Marathon',u:'time',l:{m:250,s:.15},c:{m:200,s:.1}}
];
const MXSEX={push:.45,run400:1.12,bench:.55,squat:.68,dead:.68,ohp:.6,row:.62,pull:.45,run5:1.12,run10:1.12,run21:1.12,run42:1.12};
const allMx=()=>MXL.concat((S.maxCustom||[]).map(c=>({k:c.k,n:c.n,lib:c.n,u:'kg',custom:1})));
function mxRecord(k){const e=allMx().find(x=>x.k===k);if(!e)return;const v=mxVal(e);S.maxHist=S.maxHist||{};const h=S.maxHist[k]||(S.maxHist[k]=[]);if(v==null)return;const td=todayK(),l=h[h.length-1],v2=Math.round(v*100)/100;if(l&&l.d===td)l.v=v2;else if(!l||l.v!==v2)h.push({d:td,v:v2});}
function mxEvo(e){const h=(S.maxHist||{})[e.k]||[];if(h.length<2)return '';const a=h[0],b=h[h.length-1],run=e.u==='time',d=b.v-a.v,better=run?d<0:d>0;
  const txt=e.u==='kg'?(d>0?'+':'')+fmtN(d,1)+' kg':e.u==='reps'?(d>0?'+':'')+fmtN(d)+' rép.':(d<0?'−':'+')+fmtDur(Math.abs(d));
  const vs=h.slice(-12).map(x=>x.v),mn=Math.min(...vs),mx=Math.max(...vs),W=90,H=24,pts=vs.map((v,i)=>((vs.length===1?W/2:i*W/(vs.length-1)).toFixed(1))+','+(mx===mn?H/2:(run?(v-mn)/(mx-mn)*H:H-(v-mn)/(mx-mn)*H)).toFixed(1)).join(' ');
  return `<div class="mxevo"><svg viewBox="-2 -2 ${W+4} ${H+4}" width="${W}" height="${H}"><polyline points="${pts}" fill="none" stroke="var(--tc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="${better?'up':'dn'}">${txt}</span><small>depuis le ${esc(dShort(a.d))}</small></div>`;}
function ageBand(a){return a<30?[18,29]:a<40?[30,39]:a<50?[40,49]:a<60?[50,59]:[60,99];}
function ageF(a,run){const f=run?[1,1.005,1.05,1.12,1.25]:[1,.98,.92,.84,.72];const i=a<30?0:a<40?1:a<50?2:a<60?3:4;return f[i];}
function mxPanels(){
  const p=S.profile||{},a=+p.age||30,b=ageBand(a),fem=p.sex==='f',W=fem?'femmes':'hommes';
  return [{k:'age',n:(fem?'Femmes ':'Hommes ')+b[0]+(b[1]<99?'–'+b[1]:'+')+' ans',d:'Ton âge, sportifs ou non',src:'g',age:a},
    {k:'all',n:'Tous les '+W,d:'Adultes, sportifs et non sportifs',src:'g',all:1},
    {k:'gym',n:'Pratiquants',d:'Muscu en salle ou courses officielles',src:'l'},
    {k:'comp',n:'Compétiteurs',d:'Force athlétique fédérée, coureurs de club',src:'c'}];
}
const ncdf=z=>{const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p;};
function mxVal(e){const m=(S.maxes||{})[e.k];if(!m)return null;
  if(e.u==='kg'){const kg=num(m.kg),r=num(m.reps)>0?num(m.reps):1;if(!(kg>0))return null;return r<=1?kg:kg*(1+Math.min(r,12)/30);}
  if(e.u==='reps'){return (m.reps===''||m.reps==null||isNaN(+m.reps))?null:+m.reps;}
  const t=parseDur(m.t);return t>0?t:null;}
function mxPct(e,pan){
  const v=mxVal(e);if(v==null)return null;
  const ref=e[pan.src];if(!ref)return null;
  const p=S.profile||{},fem=p.sex==='f',bw=curWeight()||weight()||75,run=e.u==='time';
  let m=ref.m,s=ref.s;
  if(fem)m=run?m*MXSEX[e.k]:m*MXSEX[e.k];
  if(pan.src==='g'){if(pan.all){m=run?m*1.06:m*.88;s=s+.03;}else m=run?m*ageF(pan.age,1):m*ageF(pan.age,0);}
  let z;
  if(run)z=(Math.log(m)-Math.log(v))/s;
  else if(e.u==='reps')z=(Math.log(v+1)-Math.log(m))/s;
  else z=(Math.log(v/bw)-Math.log(m))/s;
  return Math.min(Math.max(ncdf(z),.001),.999);
}
const MXT=[[.2,'Débutant'],[.5,'Novice'],[.8,'Intermédiaire'],[.95,'Avancé'],[1.01,'Élite']];
const mxTier=p=>MXT.find(t=>p<t[0])[1];
const topTxt=p=>p>=.99?'Top 1 %':p>=.5?'Top '+Math.max(1,Math.round((1-p)*100))+' %':'Mieux que '+Math.round(p*100)+' %';
function mxGlobal(){
  const pans=mxPanels(),done=MXL.filter(e=>mxVal(e)!=null);if(!done.length)return null;
  const avgP=k=>{const ps=done.map(e=>mxPct(e,pans.find(x=>x.k===k))).filter(x=>x!=null);return ps.length?ps.reduce((a,b)=>a+b,0)/ps.length:null;};
  return {n:done.length,age:avgP('age'),all:avgP('all'),gym:avgP('gym'),comp:avgP('comp'),pans};
}
function journalBest(e){
  if(!e.lib)return null;let best=null;
  S.workouts.forEach(w=>(w.exs||[]).forEach(x=>{if(x.name!==e.lib)return;x.sets.forEach(s=>{
    if(e.u==='reps'){if(!best||s.reps>best.reps)best={reps:s.reps,kg:s.kg,date:w.date};return;}
    if(s.kg>0){const v=s.reps<=1?s.kg:s.kg*(1+Math.min(s.reps,12)/30);if(!best||v>best.v)best={v,kg:s.kg,reps:s.reps,date:w.date};}});}));
  return best;
}
function mxBar(p){const x=Math.round(p*1000)/10;return `<div class="mxbar"><i style="--x:${x}%"></i><b style="left:${x}%"></b></div>`;}
function mxCard(){
  const g=mxGlobal();
  const body=g?`<div class="mxsum"><div class="mxring">${ring(g.age,'var(--tc)',74,8)}<span>${Math.round(g.age*100)}</span></div>
      <div style="flex:1;min-width:0"><b>${mxTier(g.gym!=null?g.gym:g.age)}</b><small>${topTxt(g.age)} · ${esc(g.pans[0].n.toLowerCase())}</small><small>${topTxt(g.gym)} des pratiquants</small></div></div>`
    :`<p class="note" style="margin:0">Renseigne tes max (développé couché, squat, tractions, 5 km…) pour savoir où tu te situes face à ta tranche d'âge, à tous les hommes et aux pratiquants.</p>`;
  return `<div class="section-head"><h2 class="section-title">Mes max et niveau</h2><span class="section-sub">${g?g.n+' / '+MXL.length+' renseignés':''}</span></div>
  <button class="card mxc" data-act="tl" data-id="max">${body}<span class="mxgo">${g?'Voir le détail':'Renseigner mes max'} ›</span></button>`;
}
SP.max=function(){
  S.maxes=S.maxes||{};
  const pans=mxPanels(),pk=ui.mxp||'age',pan=pans.find(x=>x.k===pk)||pans[0],g=mxGlobal(),bw=curWeight()||(S.profile&&S.profile.weight)||0;
  const hero=`<div class="hero2"><div class="sm">Niveau parmi les pratiquants</div><div class="big" style="font-size:38px">${g?esc(mxTier(g.gym!=null?g.gym:g.age)):'À découvrir'}</div>
    <div class="sm" style="text-transform:none;letter-spacing:0;opacity:.75;font-size:13px">${g?topTxt(g.age)+' des '+esc(pans[0].n.toLowerCase()):'Renseigne au moins un max ci-dessous'}</div>
    <div class="mini3"><div><small>${esc(pans[1].n)}</small><b>${g&&g.all!=null?topTxt(g.all).replace('Mieux que ','> '):'—'}</b></div><div><small>Pratiquants</small><b>${g&&g.gym!=null?topTxt(g.gym).replace('Mieux que ','> '):'—'}</b></div><div><small>Poids</small><b>${bw?fmtN(bw,1)+' kg':'—'}</b></div></div></div>`;
  const panSel=`<div class="mxpans">${pans.map(x=>`<button class="mxpan ${x.k===pk?'on':''}" data-act="mxpan" data-id="${x.k}"><b>${esc(x.n)}</b><small>${esc(x.d)}</small></button>`).join('')}</div>`;
  const rows=allMx().map(e=>{
    const m=S.maxes[e.k]||{},v=mxVal(e),p=v!=null?mxPct(e,pan):null,jb=journalBest(e);
    const inp=e.u==='kg'?`<div class="mxin"><button class="mxs" data-act="mxstep" data-id="${e.k}:-2.5" aria-label="Moins">−</button><input data-mx="${e.k}:kg" inputmode="decimal" placeholder="kg" value="${esc(m.kg||'')}"><button class="mxs" data-act="mxstep" data-id="${e.k}:2.5" aria-label="Plus">+</button><span class="mxx">×</span><input class="mxr" data-mx="${e.k}:reps" inputmode="numeric" placeholder="1" value="${esc(m.reps||'')}"><span class="mxu">rép.</span></div>`
      :e.u==='reps'?`<div class="mxin"><button class="mxs" data-act="mxstep" data-id="${e.k}:-1" aria-label="Moins">−</button><input data-mx="${e.k}:reps" inputmode="numeric" placeholder="0" value="${esc(m.reps==null?'':m.reps)}"><button class="mxs" data-act="mxstep" data-id="${e.k}:1" aria-label="Plus">+</button><span class="mxu">rép. d'affilée</span></div>`
      :`<div class="mxin"><input class="mxt" data-mx="${e.k}:t" inputmode="numeric" placeholder="${({run400:'130 → 1:30',run5:'2500 → 25:00',run10:'5000 → 50:00',run21:'15000 → 1:50:00',run42:'40000 → 4:00:00'})[e.k]||''}" value="${esc(m.t||'')}"><span class="mxu">temps</span></div>`;
    const sug=jb&&e.u==='kg'&&(!v||jb.v>v+.5)?`<button class="mxsug" data-act="mxuse" data-id="${e.k}">Journal : ${fmtN(jb.kg,1)} kg × ${jb.reps} · utiliser</button>`:jb&&e.u==='reps'&&(v==null||jb.reps>v)?`<button class="mxsug" data-act="mxuse" data-id="${e.k}">Journal : ${jb.reps} rép. · utiliser</button>`:'';
    const ref=e.u==='kg'&&v?`<span class="mxe">${(+m.reps||1)>1?'1RM estimé '+fmtN(v,1)+' kg · ':''}${bw?fmtN(v/bw,2)+' × ton poids':''}</span>`:'';
    const out=p==null?(v!=null&&!e[pan.src]?`<div class="mxna">Pas de repère fiable pour ce panel</div>`:''):`${mxBar(p)}<div class="mxres"><b>${topTxt(p)}</b>${(()=>{const gp=mxPct(e,pans.find(x=>x.k==='gym'));return gp==null?'':`<span class="mxtier" title="Niveau parmi les pratiquants">${mxTier(gp)} · ${e.u==='time'?'coureurs':'pratiquants'}</span>`;})()}</div>
      <div class="mxall">${pans.map(x=>{const q=mxPct(e,x);return q==null?'':`<span class="${x.k===pk?'on':''}">${esc(x.k==='age'?'Âge':x.k==='all'?'Tous':x.k==='gym'?'Pratiquants':'Compét.')} ${q<.01?'<1':q>.99?'>99':Math.round(q*100)}</span>`;}).join('')}</div>`;
    return `<div class="card mxrow"><div class="mxh"><b>${esc(e.n)}</b>${ref}${e.custom?`<button class="row-del" data-act="mxdel" data-id="${e.k}" aria-label="Retirer">×</button>`:''}</div>${inp}${sug}<div class="mxo" id="mxo-${e.k}">${out}</div>${mxEvo(e)}</div>`;
  }).join('');
  return `${hero}${mxAnalysis()}${padelCard()}
  <div class="section-head" style="margin-top:20px"><h2 class="section-title">Comparer avec</h2></div>${panSel}
  ${!bw?`<div class="card" style="margin-top:12px"><p class="note" style="margin:0">Ajoute ton poids dans Nutrition : la force se compare en fonction du poids de corps.</p></div>`:''}
  <div class="section-head"><h2 class="section-title">Mes exercices</h2><span class="section-sub">les chiffres = % battus</span></div>
  <div class="mxlist">${rows}</div>
  <div class="card" style="margin-top:10px"><div class="sublabel" style="margin:0 0 8px">Ajouter un exercice</div><div style="display:flex;gap:8px"><select id="mx-new" class="inl" style="flex:1;min-width:0">${Object.keys(exLib()).filter(n=>!allMx().some(e=>e.lib===n)).sort().map(n=>`<option>${esc(n)}</option>`).join('')}</select><button class="btn btn-ghost" style="flex:none" data-act="mxadd">Ajouter</button></div><p class="note" style="margin:6px 0 0">Pour suivre ton max sur n'importe quel exercice. Pas de comparaison de population pour ceux-là.</p></div>
  <p class="note">Estimations à partir de repères publics : standards de force par poids de corps (Strength Level, StrengthLog), niveau attendu d'un adulte non entraîné, records amateurs de force athlétique, temps des finishers de 5 et 10 km par âge. Les max avec répétitions sont convertis en 1RM (formule d'Epley). À prendre comme un ordre de grandeur, pas comme un classement officiel.</p>`;
};
function mxRefresh(k){
  const e=allMx().find(x=>x.k===k);if(!e)return;mxRecord(k);save();
  /* re-rendu léger : on recalcule toute la page sans perdre le focus du champ en cours */
  const a=document.activeElement,sel=a&&a.dataset&&a.dataset.mx,pos=a&&a.selectionStart;
  render();
  if(sel){const n=document.querySelector('[data-mx="'+sel+'"]');if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(er){}}}
}

/* ================= Analyses : profil, âge physiologique, athlète hybride, padel ================= */
const PADEL_N=151126; /* hommes licenciés compétiteurs, classement FFT de septembre 2026 */
function padelCard(){
  const p=S.padel||{},r=+p.rank||0,n=PADEL_N;
  let out='';
  if(r>0){const q=1-r/n,tier=r<=100?'Élite nationale':r<=1000?'Très haut niveau':q>=.95?'Excellent':q>=.8?'Confirmé':q>=.5?'Intermédiaire':'Loisir';
    out=`${mxBar(Math.min(Math.max(q,.001),.999))}<div class="mxres"><b>${topTxt(q)}</b><span class="mxtier">${tier}</span></div><p class="note" style="margin:6px 0 0">Mieux classé que ${fmtN(Math.max(n-r,0))} des ${fmtN(n)} compétiteurs hommes.</p>`;}
  return `<div class="section-head"><h2 class="section-title">Classement padel</h2><span class="section-sub">FFT</span></div>
  <div class="card mxrow"><div class="mxin" style="margin-top:0"><input class="mxt" style="width:120px" data-padel="rank" inputmode="numeric" placeholder="Rang" value="${esc(p.rank||'')}"><span class="mxu">e</span><input style="width:100px" data-padel="pts" inputmode="numeric" placeholder="Points" value="${esc(p.pts||'')}"><span class="mxu">pts</span></div>${out}</div>`;
}
function vo2From(){
  const C=[['run5',5000],['run10',10000],['run21',21097],['run42',42195]],cands=[];
  C.forEach(([k,d])=>{const m=(S.maxes||{})[k],t=m&&parseDur(m.t);if(t>0){const v=d/t,vo2=-4.6+.182258*v+.000104*v*v,pm=.8+.1894393*Math.exp(-.012778*t)+.2989558*Math.exp(-.1932605*t);cands.push(vo2/pm);}});
  return cands.length?Math.max(...cands):null;
}
function cardioAge(vo2){
  const A=[[25,43.5],[35,42.2],[45,40.4],[55,37.4],[65,33.9],[75,30.8]];
  if(vo2>=A[0][1])return Math.max(18,25-(vo2-A[0][1])/.35);
  for(let i=0;i<A.length-1;i++){const[a1,v1]=A[i],[a2,v2]=A[i+1];if(vo2<=v1&&vo2>=v2)return a1+(v1-vo2)/(v1-v2)*(a2-a1);}
  return Math.min(85,75+(A[5][1]-vo2)/.3);
}
function mxProfile(){
  const pans=mxPanels(),gym=pans.find(x=>x.k==='gym'),ageP=pans[0],done=MXL.filter(e=>mxVal(e)!=null);
  const pg=k=>{const e=MXL.find(x=>x.k===k);return e&&mxVal(e)!=null?mxPct(e,gym):null;};
  const str=['bench','squat','dead','ohp','row','pull','push'].map(pg).filter(x=>x!=null),end=['run400','run5','run10','run21','run42'].map(pg).filter(x=>x!=null);
  const sAge=['bench','squat','dead','ohp','row','pull','push'].map(k=>{const e=MXL.find(x=>x.k===k);return e&&mxVal(e)!=null?mxPct(e,ageP):null;}).filter(x=>x!=null);
  return {done,str:str.length?avg(str):null,end:end.length?avg(end):null,sAge:sAge.length?avg(sAge):null,pg};
}
function mxAnalysis(){
  const P=mxProfile(),p=S.profile||{},age=+p.age||30,bw=curWeight()||+p.weight||0,h=+p.height||0,ins=[];
  if(!P.done.length)return '';
  const ranked=P.done.map(e=>({e,q:mxPct(e,mxPanels().find(x=>x.k==='gym'))})).filter(x=>x.q!=null).sort((a,b)=>b.q-a.q);
  if(ranked.length>=2){{const qa=mxPct(ranked[0].e,mxPanels()[0]);ins.push(['star','Point fort : <b>'+esc(ranked[0].e.n)+'</b> ('+topTxt(ranked[0].q).toLowerCase()+' des pratiquants'+(qa!=null?', '+topTxt(qa).toLowerCase()+' des hommes de ton âge':'')+').']);}const w=ranked[ranked.length-1];if(w.q<ranked[0].q-.15){const qa=mxPct(w.e,mxPanels()[0]);ins.push(['target','Ton max le moins avancé, en comparaison : <b>'+esc(w.e.n)+'</b> ('+Math.round(w.q*100)+' % des pratiquants battus'+(qa!=null?', mais '+Math.round(qa*100)+' % des hommes de ton âge':'')+'). C\'est là que tu progresseras le plus vite.']);}}
  const v=k=>{const e=MXL.find(x=>x.k===k);return e?mxVal(e):null;};
  const sq=v('squat'),be=v('bench'),de=v('dead'),oh=v('ohp'),pu=v('pull');
  if(sq&&be){const r=sq/be;ins.push(['scale',r<1.15?'Le bas du corps est en retard sur le haut : squat = '+fmtN(r,2)+' × couché (repère 1,25 à 1,5).':r>1.6?'Jambes dominantes : squat = '+fmtN(r,2)+' × couché, le haut du corps peut progresser.':'Bon équilibre haut / bas du corps (squat = '+fmtN(r,2)+' × couché).']);}
  if(de&&sq){const r=de/sq;if(r<1.05)ins.push(['scale','Soulevé de terre un peu faible face au squat ('+fmtN(r,2)+' ×, repère 1,1 à 1,3) : chaîne postérieure à renforcer.']);}
  if(oh&&be){const r=oh/be;if(r<.55)ins.push(['scale','Épaules en retrait : militaire = '+fmtN(r,2)+' × couché (repère 0,6 à 0,7).']);}
  if(be&&bw&&pu!=null){if(be/bw>=1&&pu<8)ins.push(['dumb','Tu pousses fort mais tires peu : '+pu+' tractions pour un couché à '+fmtN(be/bw,2)+' × ton poids. Ajoute du travail de dos.']);}
  if(P.str!=null&&P.end!=null){const d=P.str-P.end;ins.push(['bolt',Math.abs(d)<.12?'Profil <b>hybride équilibré</b> : force et endurance au même niveau.':d>0?'Profil <b>plutôt force</b> : l\'endurance est ton levier de progression.':'Profil <b>plutôt endurance</b> : la force est ton levier de progression.']);}
  /* âge physiologique : rang moyen face aux hommes de ton âge, sur les seuls max renseignés */
  const vo2=vo2From(),ageP=mxPanels()[0];
  const filled=MXL.map(e=>({e,q:mxVal(e)!=null?mxPct(e,ageP):null})).filter(x=>x.q!=null);
  const grp=(ks)=>{const L=filled.filter(x=>ks.includes(x.e.k));return L.length?avg(L.map(x=>x.q)):null;};
  const qC=grp(['run400','run5','run10','run21','run42']),qF=grp(['bench','squat','dead','ohp','row','pull','push']);
  const toAge=q=>Math.min(80,Math.max(18,age-(q-.5)*20));
  const parts=[];
  if(qC!=null)parts.push({n:'Cardio',a:toAge(qC),s:topTxt(qC)+' de ton âge'+(vo2?' · VO2 ≈ '+fmtN(vo2,0):'')});
  if(qF!=null)parts.push({n:'Force',a:toAge(qF),s:topTxt(qF)+' de ton âge'});
  const used=filled.map(x=>x.e.n);
  const pa=filled.length?Math.round(toAge(avg(filled.map(x=>x.q)))):null;
  /* athlète hybride */
  const LV=[['Intermédiaire',{squat:1.25,bench:1,dead:1.5,pull:8,run5:25,run10:52}],['Avancé',{squat:1.5,bench:1.25,dead:2,pull:12,run5:22,run10:46}],['Élite',{squat:2,bench:1.5,dead:2.5,pull:20,run5:19,run10:40}]];
  const ok=(k,t)=>{const x=v(k);if(x==null)return null;if(k==='run5'||k==='run10')return x<=t;if(k==='pull')return x>=t;return bw?x/bw>=t:null;};
  let lvl='Débutant',next=null;for(const [n,T] of LV){const res=Object.entries(T).map(([k,t])=>ok(k,t));if(res.every(r=>r===true))lvl=n;else{next=[n,T];break;}}
  const hs=P.str!=null&&P.end!=null?Math.round(Math.sqrt(P.str*P.end)*100):null;
  const lab={squat:'Squat',bench:'Couché',dead:'Terre',pull:'Tractions',run5:'5 km',run10:'10 km'};
  const tgt=next?Object.entries(next[1]).map(([k,t])=>{const r=ok(k,t);return `<span class="hy ${r===true?'ok':r===false?'no':'na'}">${lab[k]} ${k==='pull'?t:k.startsWith('run')?t+':00':fmtN(t,2)+'×'}</span>`;}).join(''):'';
  return `<div class="section-head"><h2 class="section-title">Mon analyse</h2></div>
  <div class="grid2 anag">
    <div class="card anak"><small>Âge physiologique</small><b>${pa!=null?pa+' <span>ans</span>':'—'}</b><em>${pa!=null?(pa<age?(age-pa)+' ans de moins que ton âge':pa>age?(pa-age)+' ans de plus que ton âge':'égal à ton âge'):'Renseigne au moins un max'}</em></div>
    <div class="card anak"><small>Athlète hybride</small><b>${hs!=null?hs+' <span>/100</span>':'—'}</b><em>${hs!=null?'Niveau '+esc(lvl):'Renseigne un max de force et un temps de course'}</em></div></div>
  ${parts.length?`<div class="card" style="margin-top:10px"><div class="anaparts" style="grid-template-columns:repeat(${parts.length},1fr)">${parts.map(x=>`<div><small>${x.n}</small><b>${Math.round(x.a)} ans</b><em>${esc(x.s)}</em></div>`).join('')}</div><p class="note" style="margin:10px 0 0">Calculé uniquement sur : ${esc(used.join(', '))}.</p></div>`:''}
  ${next?`<div class="card" style="margin-top:10px"><div class="sublabel" style="margin:0 0 8px">Pour passer ${esc(next[0])} (athlète hybride)</div><div class="hys">${tgt}</div><p class="note" style="margin:8px 0 0">Force rapportée à ton poids, tractions d'affilée, temps de course. Vert : atteint.</p></div>`:''}
  <div class="card anal" style="margin-top:10px">${ins.map(([i,t])=>`<div class="ani"><span class="qico">${IC(i,16)}</span><p>${t}</p></div>`).join('')}</div>
  <p class="note">Âge physiologique : ton rang moyen face aux hommes de ton âge (sportifs ou non), sur les seuls max renseignés ; un rang médian donne ton âge réel, chaque tranche de 10 % au-dessus retire 2 ans. Aucun calcul sur tes pas, ton poids ou ta régularité. Indicatif, pas un avis médical.</p>`;
}

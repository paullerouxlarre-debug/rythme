
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
  {k:'run5',n:'5 km',u:'time',g:{m:33,s:.22},l:{m:26.5,s:.18},c:{m:20,s:.12}},
  {k:'run10',n:'10 km',u:'time',g:{m:68,s:.22},l:{m:53.1,s:.17},c:{m:42,s:.12}}
];
const MXSEX={bench:.55,squat:.68,dead:.68,ohp:.6,row:.62,pull:.45,run5:1.12,run10:1.12};
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
  if(e.u==='kg'){const kg=+m.kg,r=+m.reps||1;if(!(kg>0))return null;return r<=1?kg:kg*(1+Math.min(r,12)/30);}
  if(e.u==='reps'){return +m.reps>=0&&m.reps!==''?+m.reps:null;}
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
  const rows=MXL.map(e=>{
    const m=S.maxes[e.k]||{},v=mxVal(e),p=v!=null?mxPct(e,pan):null,jb=journalBest(e);
    const inp=e.u==='kg'?`<div class="mxin"><button class="mxs" data-act="mxstep" data-id="${e.k}:-2.5" aria-label="Moins">−</button><input data-mx="${e.k}:kg" inputmode="decimal" placeholder="kg" value="${esc(m.kg||'')}"><button class="mxs" data-act="mxstep" data-id="${e.k}:2.5" aria-label="Plus">+</button><span class="mxx">×</span><input class="mxr" data-mx="${e.k}:reps" inputmode="numeric" placeholder="1" value="${esc(m.reps||'')}"><span class="mxu">rép.</span></div>`
      :e.u==='reps'?`<div class="mxin"><button class="mxs" data-act="mxstep" data-id="${e.k}:-1" aria-label="Moins">−</button><input data-mx="${e.k}:reps" inputmode="numeric" placeholder="0" value="${esc(m.reps==null?'':m.reps)}"><button class="mxs" data-act="mxstep" data-id="${e.k}:1" aria-label="Plus">+</button><span class="mxu">rép. d'affilée</span></div>`
      :`<div class="mxin"><input class="mxt" data-mx="${e.k}:t" inputmode="numeric" placeholder="${e.k==='run5'?'2500 → 25:00':'5000 → 50:00'}" value="${esc(m.t||'')}"><span class="mxu">temps</span></div>`;
    const sug=jb&&e.u==='kg'&&(!v||jb.v>v+.5)?`<button class="mxsug" data-act="mxuse" data-id="${e.k}">Journal : ${fmtN(jb.kg,1)} kg × ${jb.reps} · utiliser</button>`:jb&&e.u==='reps'&&(v==null||jb.reps>v)?`<button class="mxsug" data-act="mxuse" data-id="${e.k}">Journal : ${jb.reps} rép. · utiliser</button>`:'';
    const ref=e.u==='kg'&&v?`<span class="mxe">${(+m.reps||1)>1?'1RM estimé '+fmtN(v,1)+' kg · ':''}${bw?fmtN(v/bw,2)+' × ton poids':''}</span>`:'';
    const out=p==null?(v!=null&&!e[pan.src]?`<div class="mxna">Pas de repère fiable pour ce panel</div>`:''):`${mxBar(p)}<div class="mxres"><b>${topTxt(p)}</b>${(()=>{const gp=mxPct(e,pans.find(x=>x.k==='gym'));return gp==null?'':`<span class="mxtier" title="Niveau parmi les pratiquants">${mxTier(gp)} · ${e.u==='time'?'coureurs':'pratiquants'}</span>`;})()}</div>
      <div class="mxall">${pans.map(x=>{const q=mxPct(e,x);return q==null?'':`<span class="${x.k===pk?'on':''}">${esc(x.k==='age'?'Âge':x.k==='all'?'Tous':x.k==='gym'?'Pratiquants':'Compét.')} ${q<.01?'<1':q>.99?'>99':Math.round(q*100)}</span>`;}).join('')}</div>`;
    return `<div class="card mxrow"><div class="mxh"><b>${esc(e.n)}</b>${ref}</div>${inp}${sug}<div class="mxo" id="mxo-${e.k}">${out}</div></div>`;
  }).join('');
  return `<button class="back" data-act="tl" data-id="">‹ Muscle</button><h1 class="page" style="margin-top:0">Mes max</h1>${hero}
  <div class="section-head" style="margin-top:20px"><h2 class="section-title">Comparer avec</h2></div>${panSel}
  ${!bw?`<div class="card" style="margin-top:12px"><p class="note" style="margin:0">Ajoute ton poids dans Nutrition : la force se compare en fonction du poids de corps.</p></div>`:''}
  <div class="section-head"><h2 class="section-title">Mes exercices</h2><span class="section-sub">les chiffres = % battus</span></div>
  <div class="mxlist">${rows}</div>
  <p class="note">Estimations à partir de repères publics : standards de force par poids de corps (Strength Level, StrengthLog), niveau attendu d'un adulte non entraîné, records amateurs de force athlétique, temps des finishers de 5 et 10 km par âge. Les max avec répétitions sont convertis en 1RM (formule d'Epley). À prendre comme un ordre de grandeur, pas comme un classement officiel.</p>`;
};
function mxRefresh(k){
  const e=MXL.find(x=>x.k===k);if(!e)return;
  /* re-rendu léger : on recalcule toute la page sans perdre le focus du champ en cours */
  const a=document.activeElement,sel=a&&a.dataset&&a.dataset.mx,pos=a&&a.selectionStart;
  render();
  if(sel){const n=document.querySelector('[data-mx="'+sel+'"]');if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(er){}}}
}

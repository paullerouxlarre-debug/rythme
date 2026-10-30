
/* ================= Tendance ================= */

const CUF={h:v=>fmtH(v),km:v=>fmtN(v,1)+' km',t:v=>fmtN(v,1)+' t',j:v=>fmtN(v)+' j',eur:v=>fmt(v),k:v=>fmtK(v),n:v=>fmtN(v),pct:v=>fmtN(v)+' %'};
const cu=(v,f)=>`<span class="cu" data-v="${Math.round(v*100)/100}" data-f="${f}">${CUF[f](v)}</span>`;
/* ================= Tendance : hub ================= */
const MT={alloc:'Placements',inc:'Revenus',evol:'Évolution',ci:'Intérêts composés',goal:'Objectif d\'épargne',immo:'Achat immobilier'};
V.money=function(){
  const k=MT[ui.money]?ui.money:'hub';
  if(k==='hub')return `<h1 class="page">Tendance</h1>${M.hub()}`;
  return `<button class="back" data-act="money" data-id="hub">‹ Tendance</button><h1 class="page" style="margin-top:0">${MT[k]}</h1>${M[k]()}`;
};
function miniDonut(segs,sz){
  const tot=sum(segs.map(s=>s.v)),r=21,C=2*Math.PI*r;let off=0;
  const arcs=tot>0?segs.filter(s=>s.v>0).map(s=>{const l=s.v/tot*C,a=`<circle cx="28" cy="28" r="${r}" fill="none" stroke="${s.c}" stroke-width="9" stroke-dasharray="${Math.max(l-1.5,0)} ${C}" stroke-dashoffset="${-off}"/>`;off+=l;return a;}).join(''):'';
  return `<svg viewBox="0 0 56 56" width="${sz}" height="${sz}" style="transform:rotate(-90deg)"><circle cx="28" cy="28" r="${r}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="9"/>${arcs}</svg>`;
}
function miniBars(vals){
  const mx=Math.max(...vals,1),w=100/vals.length;
  return `<svg viewBox="0 0 120 54" width="100%" height="54" preserveAspectRatio="none">${vals.map((v,i)=>{const h=Math.max(v/mx*50,v>0?4:2);return `<rect x="${i*20+3}" y="${54-h}" width="14" height="${h}" rx="4" fill="#fff" fill-opacity="${v>0?(.5+.5*v/mx).toFixed(2):.25}"/>`;}).join('')}</svg>`;
}
const TI={
  evol:'<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>',
  ci:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></svg>',
  goal:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></svg>',
  immo:'<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-6h4v6"/></svg>'
};
M.hub=function(){
  const dca=S.dca||0,tm=monthTotals(),mean=avg(tm.slice(-6).map(i=>i.amount)),rate=mean>0?dca/mean:null;
  const y=Math.min(Math.max(Math.round(S.proj.years)||20,1),40),ev=evCalc(y),m=mix();
  const ms=Array.from({length:6},(_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-(5-i));return mkey(d);});
  const vals=ms.map(k=>sum(S.incomes.filter(i=>i.m===k).map(i=>i.amount)));
  const rc=ciRun(S.ci),gc=goalCalc(),mo=mortgage(S.sim);
  const nt=[10000,25000,50000,100000,250000,500000,1000000].find(t=>ev.mid[0]<t&&ev.mid[y]>=t);
  let nty=null;if(nt){for(let i=1;i<=y;i++){if(ev.mid[i]>=nt){nty=i;break;}}}
  const tool=(k,c1,c2,t,s)=>`<button class="toolrow" data-act="money" data-id="${k}"><span class="tico" style="background:linear-gradient(135deg,${c1},${c2})">${TI[k]}</span><span style="flex:1;min-width:0;text-align:left"><b>${t}</b><small>${s}</small></span><span class="chev">›</span></button>`;
  const rp=rate==null?0:Math.min(rate/.2,1),good=rate!=null&&rate>=.2;
  return `<div class="hero2"><div class="sm">Je mets de côté</div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div class="big" style="min-width:0">${cu(dca,'eur')}<span style="font-size:18px;font-weight:700;opacity:.85"> / mois</span></div><div class="stp"><button data-act="dcastep" data-id="-50" aria-label="Moins 50 euros">−</button><button data-act="dcastep" data-id="50" aria-label="Plus 50 euros">+</button></div></div>
    <div class="mini3"><div><small>Revenu moyen</small><b>${mean>0?fmtK(mean):'—'}</b></div><div><small>Épargne</small><b>${rate!=null?fmtN(rate*100)+' %':'—'}</b></div><div><small>Dans ${y} ans</small><b>${fmtK(ev.mid[y])}</b></div></div></div>
  <div class="card insight"><div style="display:flex;align-items:center;gap:16px"><div class="rw" style="width:84px;height:84px;flex:none">${ring(rp,good?'#34C759':'#F5B400',84,10)}<div class="rc" style="font-size:17px">${rate!=null?fmtN(rate*100)+'<small style="font-size:10px">%</small>':'—'}</div></div>
    <div style="flex:1;min-width:0">${rate!=null?`<div class="row-title">${good?'Épargne solide':'Taux d\'épargne'}</div><div class="row-sub">Repère : 20 % de tes revenus</div>`:`<div class="row-title">Taux d'épargne</div><div class="row-sub">Ajoute tes revenus pour le voir</div>`}
    ${nt&&nty?`<div class="chip static on" style="margin-top:8px;display:inline-block">${fmtK(nt)} dans ${nty} an${nty>1?'s':''}</div>`:''}</div></div></div>
  <div class="section-head"><h2 class="section-title">Mes finances</h2></div>
  <div class="mtiles">
    <button class="mtile" style="--c1:#0FA97A;--c2:#0A84FF" data-act="money" data-id="alloc"><div class="viz">${miniDonut(CLASSES.map(c=>({v:m.sh[c],c:c==='ETF'?'#fff':c==='Actions'?'#FFE27A':'#FF9EC4'})),54)}</div><div><small>Placements</small><b>${S.lines.length} ligne${S.lines.length>1?'s':''}</b></div></button>
    <button class="mtile" style="--c1:#F5B400;--c2:#FF6A1A" data-act="money" data-id="inc"><div class="viz">${miniBars(vals)}</div><div><small>Revenus</small><b>${mean>0?fmt(mean)+' / mois':'—'}</b></div></button>
  </div>
  <div class="section-head"><h2 class="section-title">Outils</h2><span class="section-sub">calculer et prévoir</span></div>
  ${tool('evol','#0FA97A','#0A84FF','Évolution de mon portefeuille','Dans '+y+' ans : '+fmtK(ev.mid[y]))}
  ${tool('ci','#F5B400','#FF7A1A','Intérêts composés',fmtK(rc.fin)+' en '+rc.y+' ans')}
  ${tool('goal','#AF52DE','#FF2D55','Objectif d\'épargne',fmtK(gc.T)+' : '+fmt(gc.need)+' / mois')}
  ${tool('immo','#0A84FF','#32ADE6','Achat immobilier','Mensualité '+fmt(mo.mens))}`;
};

/* ---- Objectif d'épargne ---- */
const goalRate=()=>{const t=S.goalT;return(t.rate!=null&&t.rate!=='')?+t.rate:Math.round(blended().r*10)/10;};
const goalInit=()=>{const t=S.goalT;return(t.init!=null&&t.init!=='')?+t.init:(S.proj.init||0);};
function goalCalc(){
  const t=S.goalT,y=Math.min(Math.max(Math.round(t.years)||1,1),50),n=y*12,rate=goalRate(),r=Math.pow(1+rate/100,1/12)-1,init=goalInit(),T=+t.target||0,dca=S.dca||0;
  const g=Math.pow(1+r,n);
  const need=r>0?Math.max((T-init*g)*r/(g-1),0):Math.max((T-init)/n,0);
  const path=pm=>{let v=init;const o=[v];for(let m=1;m<=n;m++){v=v*(1+r)+pm;if(m%12===0)o.push(v);}return o;};
  let months=init>=T?0:null;if(months==null){let v=init;for(let m=1;m<=1200;m++){v=v*(1+r)+dca;if(v>=T){months=m;break;}}}
  const needFor=yy=>{const nn=yy*12,gg=Math.pow(1+r,nn);return r>0?Math.max((T-init*gg)*r/(gg-1),0):Math.max((T-init)/nn,0);};
  return {y,n,rate,r,init,T,dca,need,pn:path(need),pd:path(dca),months,needFor};
}
function goalOutAll(){
  const c=goalCalc(),ok=c.dca>=c.need-0.5,p=c.need>0?Math.min(c.dca/c.need,1):1;
  const dur=c.months==null?'pas atteint en 100 ans':c.months===0?'déjà atteint':(Math.floor(c.months/12)?Math.floor(c.months/12)+' an'+(Math.floor(c.months/12)>1?'s':''):'')+(c.months%12?(Math.floor(c.months/12)?' ':'')+c.months%12+' mois':'');
  const xl=c.pn.map((_,i)=>i+'a');
  const chart=multiLine([{v:c.pn.map(()=>c.T),c:'#8E8E93',w:1.4,dash:1,n:'Objectif'},{v:c.pn,c:'#AF52DE',w:2.8,n:'Nécessaire'},{v:c.pd,c:'#FF9500',w:2.2,dash:1,n:'Mon versement'}],xl.map((l,i)=>i+' an'+(i>1?'s':'')));
  return `<div class="hero2"><div class="sm">Pour atteindre ${fmtK(c.T)} en ${c.y} an${c.y>1?'s':''}</div><div class="big">${cu(c.need,'eur')}<span style="font-size:18px;font-weight:700;opacity:.85"> / mois</span></div>
    <div class="mini3"><div><small>Je verse</small><b>${fmt(c.dca)}</b></div><div><small>${ok?'Marge':'Il manque'}</small><b>${fmt(Math.abs(c.dca-c.need))}</b></div><div><small>Rendement</small><b>${fmtN(c.rate,1)} %</b></div></div></div>
  <div class="card"><div style="display:flex;align-items:center;gap:16px"><div class="rw" style="width:92px;height:92px;flex:none">${ring(p,ok?'#34C759':'#AF52DE',92,11)}<div class="rc" style="font-size:19px">${Math.round(p*100)} %</div></div>
    <div style="flex:1;min-width:0"><div class="row-title">${ok?'Ton versement suffit':'Avec ton versement actuel'}</div><div class="row-sub" style="margin-top:3px">${c.months==null?'Objectif hors de portée':'Objectif atteint en '+dur}</div></div></div></div>
  <div class="card" style="margin-top:12px">${chart}<div class="chips" style="margin-top:6px"><span class="lg"><span class="dot" style="background:#AF52DE"></span>Versement nécessaire</span><span class="lg"><span class="dot" style="background:#FF9500"></span>Mon versement</span><span class="lg"><span class="dot" style="background:#8E8E93"></span>Objectif</span></div></div>
  <div class="section-head"><h2 class="section-title">Selon l'échéance</h2></div>
  <div class="row-list">${[3,5,10,15,20,30].map(yy=>`<div class="row"><div class="row-title">${yy} ans</div><span class="row-value">${fmt(c.needFor(yy))} / mois</span></div>`).join('')}</div>`;
}
function goalParts(){const h=goalOutAll(),k=h.indexOf('<div class="card"><div style="display:flex;align-items:center;gap:16px"><div class="rw"');return [h.slice(0,k),h.slice(k)];}
function goalUpdate(){const p=goalParts(),a=$('#gohero'),b=$('#gout');if(a)a.innerHTML=p[0];if(b)b.innerHTML=p[1];}
M.goal=function(){
  const t=S.goalT,auto=t.rate==null||t.rate==='';
  const f=(l,k,v,min,max,step)=>`<div class="field"><label>${l}</label><div style="display:flex;gap:10px;align-items:center"><input class="mini" style="width:112px" type="number" inputmode="decimal" step="any" value="${v}" data-gl="${k}" aria-label="${l}"><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-gl="${k}" aria-label="${l}, curseur"></div></div>`;
  return `<div id="gohero">${goalParts()[0]}</div><div class="card"><div class="form-grid" style="grid-template-columns:1fr">
    <div class="field"><label>Objectifs rapides</label><div class="chips">${[50000,100000,250000,500000,1000000].map(v=>`<button class="chip ${+t.target===v?'on':''}" data-act="gtarget" data-id="${v}">${fmtK(v)}</button>`).join('')}</div></div>
    ${f('Objectif (€)','target',t.target,0,1000000,5000)}${f('Échéance (années)','years',t.years,1,40,1)}${f('Capital actuel (€)','init',goalInit(),0,300000,500)}${f('Rendement annuel (%)','rate',goalRate(),0,15,0.1)}</div>
    <div class="form-actions"><button class="btn btn-ghost" data-act="grate">${auto?'Rendement de mon portefeuille ✓':'Reprendre le rendement de mon portefeuille'}</button></div></div>
  <div id="gout">${goalParts()[1]}</div>`;
};

const SCOL=['#0A84FF','#34C759','#FF9500','#AF52DE','#FF2D55','#32ADE6'];
const useAmt=()=>S.lines.some(l=>l.amt>0);
const lw=l=>useAmt()?(+l.amt||0):(+l.pct||0);
const pctTot=()=>sum(S.lines.map(lw));
const amtTot=()=>sum(S.lines.map(l=>+l.amt||0));
const lineRate=l=>(l.r!=null&&l.r!==''&&isFinite(l.r))?+l.r:(S.ret[l.cls]||0);
function mix(){
  const tot=pctTot(),ct={};CLASSES.forEach(c=>ct[c]=0);
  S.lines.forEach(l=>{ct[l.cls]+=lw(l);});
  if(tot<=0)return {tot:0,ct,sh:{ETF:0,Actions:0,Crypto:0},empty:true};
  const sh={};CLASSES.forEach(c=>sh[c]=ct[c]/tot);
  return {tot,ct,sh,empty:false};
}
function blended(){
  const m=mix();
  if(m.empty)return {r:S.ret.ETF,sp:S.spread.ETF,m};
  return {r:sum(S.lines.map(l=>lw(l)*lineRate(l)))/m.tot,sp:sum(S.lines.map(l=>lw(l)*(S.spread[l.cls]||0)))/m.tot,m};
}
function project(init,monthly,years,r){
  const rm=Math.pow(1+r/100,1/12)-1;let v=init;const out=[v];
  for(let y=1;y<=years;y++){for(let i=0;i<12;i++)v=v*(1+rm)+monthly;out.push(v);}
  return out;
}
const scMonthly=sc=>(sc.monthly==null||sc.monthly==='')?(S.dca||0):+sc.monthly;
function scRate(sc){const bl=blended();return sc.mode==='manual'?(+sc.rate||0):Math.max(bl.r+(sc.tilt||0)*bl.sp,-5);}
const scRun=(sc,y)=>project(+sc.init||0,scMonthly(sc),y,scRate(sc));

M.alloc=function(){
  const m=mix(),bl=blended(),dca=S.dca||0;
  const segs=CLASSES.map(c=>({n:c,v:m.sh[c],c:CCOL[c]}));
  const risk=m.empty?'—':m.sh.Crypto>=.2?'Très volatil':m.sh.Crypto+m.sh.Actions>=.7?'Dynamique':m.sh.Crypto+m.sh.Actions>=.4?'Équilibré':'Prudent';
  const sorted=S.lines.slice().sort((a,b)=>(b.pct||0)-(a.pct||0));
  const A=useAmt(),T=amtTot();
  const rows=sorted.map(l=>{const sh=m.tot>0?lw(l)/m.tot:0;return `<div class="row" style="flex-wrap:wrap;gap:8px 10px"><div style="flex:1;min-width:0"><div class="row-title"><span class="dot" style="background:${CCOL[l.cls]}"></span> ${esc(l.name)}</div><div class="row-sub">${l.cls}${m.tot>0?' · <b style="color:var(--text)">'+fmtN(sh*100,1)+' %</b>':''}${m.tot>0&&dca?' · '+fmt(dca*sh)+' / mois':''}${A&&!(l.amt>0)?' · <span style="color:var(--negative)">montant à renseigner</span>':''}</div></div>
    <div style="display:flex;align-items:center;gap:6px"><input class="mini" style="width:96px" type="number" inputmode="decimal" step="any" value="${l.amt>0?l.amt:''}" placeholder="${!A&&l.pct?fmtN(l.pct,0)+' %':'0'}" data-la="${l.id}" aria-label="Montant de ${esc(l.name)}"><span class="muted" style="font-size:13px">€</span><button class="row-del" data-act="dell" data-id="${l.id}" aria-label="Supprimer">×</button></div>
    <div class="progress" style="width:100%"><div style="width:${sh*100}%;background:${CCOL[l.cls]}"></div></div></div>`;}).join('');
  const bar=m.empty?'':`<div class="alloc-bar" style="margin-top:14px">${sorted.map(l=>`<div style="width:${lw(l)/m.tot*100}%;background:${CCOL[l.cls]};opacity:${.55+.45*((sorted.indexOf(l)%2)?.6:1)}"></div>`).join('')}</div>`;
  return `
  <div class="hero2"><div class="field"><label style="color:rgba(255,255,255,.85)">Versement mensuel régulier (DCA)</label><div style="display:flex;align-items:center;gap:8px"><input class="inl" type="number" inputmode="decimal" step="any" value="${dca||''}" placeholder="300" data-dca="1" style="font-size:22px;font-weight:700"><span class="muted" style="font-weight:600">€ / mois</span><div class="stp"><button data-act="dcastep" data-id="-50" aria-label="Moins 50 euros">−</button><button data-act="dcastep" data-id="50" aria-label="Plus 50 euros">+</button></div></div></div>
    <div class="grid2" style="margin-top:12px"><div class="stat"><div class="k">Valeur du portefeuille</div><div class="v">${A?fmt(T):'—'}</div></div><div class="stat"><div class="k">Versé par an</div><div class="v">${fmt(dca*12)}</div></div></div></div>

  <div class="section-head"><h2 class="section-title">Mon portefeuille</h2><span class="section-sub">${risk}</span></div>
  <div class="card"><div style="display:flex;align-items:center;gap:16px">
    ${donut(segs,A?fmtK(T):fmtN(m.tot,0)+' %')}
    <div class="legend" style="flex:1;min-width:0">${segs.map(s=>`<div class="li"><span class="dot" style="background:${s.c}"></span><span class="n">${s.n}</span><span class="p">${fmtN(s.v*100,1)} %${A?' · '+fmt(T*s.v):''}</span></div>`).join('')}</div></div>${bar}
    ${m.empty?'<p class="note">Ajoute tes placements avec le montant investi : les pourcentages se calculent tout seuls.</p>':!A?'<div class="callout" style="margin-top:14px">Renseigne le montant de chaque placement : les parts du portefeuille seront calculées automatiquement.</div>':''}</div>

  <div class="section-head"><h2 class="section-title">Mes placements</h2><button class="iconbtn" data-act="toggle" data-id="fl" aria-label="Ajouter un placement">+</button></div>
  ${ui.open.fl?`<div class="form-panel"><div class="form-grid">
    <div class="field wide"><label>Nom</label><input id="l-n" placeholder="MSCI World, Nvidia, Bitcoin…"></div>
    <div class="field"><label>Type</label><select id="l-c">${CLASSES.map(c=>`<option>${c}</option>`).join('')}</select></div>
    <div class="field"><label>Montant investi (€)</label><input id="l-w" type="number" inputmode="decimal" step="any" placeholder="2500"></div>
    <div class="field wide"><label>Rendement annuel supposé (%), facultatif</label><input id="l-r" type="number" inputmode="decimal" step="any" placeholder="par défaut selon le type"></div></div>
    <div class="form-actions"><button class="btn btn-primary" data-act="addline">Ajouter</button><button class="btn btn-ghost" data-act="toggle" data-id="fl">Annuler</button></div></div>`:''}
  <div class="row-list">${rows||'<div class="empty">Pas encore de placement. Ajoute un ETF, une action ou une crypto avec le montant investi.</div>'}</div>
  ${m.tot>0&&dca>0?`<div class="section-head"><h2 class="section-title">Où part mon DCA</h2><span class="section-sub">${fmt(dca)} / mois</span></div>
  <div class="card">${barChart(sorted.map(l=>({l:l.name.slice(0,7),v:dca*lw(l)/m.tot,c:CCOL[l.cls]})).slice(0,10),{h:140,fy:v=>fmtN(v)})}</div>`:''}
  <p class="note">Les parts du portefeuille sont calculées à partir des montants, et la valeur totale sert de capital de départ dans Évolution. Chaque placement peut avoir son propre rendement supposé. Sinon on utilise la valeur par défaut de son type, modifiable dans Évolution.</p>`;
};

const LCOL=['#0FA97A','#0A84FF','#FF9500','#AF52DE','#FF2D55','#32ADE6','#F5B400','#8E8E93'];
function evCalc(y){
  const tot=pctTot(),lines=tot>0?S.lines:[{id:'x',name:'ETF monde',cls:'ETF',pct:100}],T=tot>0?tot:100;
  const init=S.proj.init||0,dca=S.dca||0;
  const layers=lines.map((l,i)=>{const sh=lw(l)/T,r=lineRate(l),sp=S.spread[l.cls]||0;
    return {name:l.name,c:LCOL[i%LCOL.length],cls:l.cls,sh,v:project(init*sh,dca*sh,y,r),lo:project(init*sh,dca*sh,y,Math.max(r-sp,-5)),hi:project(init*sh,dca*sh,y,r+sp)};});
  const sumAt=(k,i)=>sum(layers.map(L=>L[k][i]));
  const mid=layers[0].v.map((_,i)=>sumAt('v',i)),lo=mid.map((_,i)=>sumAt('lo',i)),hi=mid.map((_,i)=>sumAt('hi',i));
  const versed=mid.map((_,i)=>init+dca*12*i);
  return {layers,mid,lo,hi,versed,empty:tot<=0};
}
function stackArea(ev,y,reveal){
  const W=340,H=210,pl=8,pr=8,pt=14,pb=24,n=y+1;
  const mx=Math.max(...ev.hi,1),X=i=>pl+(W-pl-pr)*i/Math.max(y,1),Y=v=>pt+(H-pt-pb)*(1-v/mx);
  const cum=ev.layers.map((_,li)=>ev.mid.map((_,i)=>sum(ev.layers.slice(0,li+1).map(L=>L.v[i]))));
  const paths=ev.layers.map((L,li)=>{
    const top=cum[li],bot=li?cum[li-1]:ev.mid.map(()=>0);
    const up=top.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
    const dn=bot.map((v,i)=>'L'+X(n-1-i).toFixed(1)+' '+Y(bot[n-1-i]).toFixed(1)).join(' ');
    return `<path d="${up} ${dn} Z" fill="${L.c}" fill-opacity=".88"/>`;}).join('');
  const line=(arr,c,dash,w)=>`<path d="${arr.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ')}" fill="none" stroke="${c}" stroke-width="${w||1.6}" ${dash?'stroke-dasharray="5 4"':''} stroke-linecap="round" stroke-linejoin="round"/>`;
  const step=Math.ceil(n/6);
  const labs=Array.from({length:n},(_,i)=>(i%step===0||i===n-1)?`<text x="${X(i)}" y="${H-6}" font-size="10" text-anchor="middle" style="fill:var(--muted)">${i===0?'0':i+' a'}</text>`:'').join('');
  const grid=[.25,.5,.75,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(mx*f)}" y2="${Y(mx*f)}" style="stroke:var(--border)"/>`).join('');
  return `<svg class="${reveal?'reveal':''}" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Évolution possible du portefeuille"${scrubData(W,pt,H-pb,Array.from({length:n},(_,i)=>X(i)),Array.from({length:n},(_,i)=>`<b>${i?'Dans '+i+' an'+(i>1?'s':''):'Aujourd\'hui'}</b><span>Probable ${esc(fmtK(ev.mid[i]))}</span><span>Versé ${esc(fmtK(ev.versed[i]))}</span><span>Fourchette ${esc(fmtK(ev.lo[i]))} – ${esc(fmtK(ev.hi[i]))}</span>`))}>${grid}${paths}${line(ev.versed,'#fff',1,1.8)}${line(ev.hi,'var(--text)',1,1.2)}${line(ev.lo,'var(--text)',1,1.2)}<line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>${labs}</svg>`;
}
const fmtK=v=>v>=1e6?fmtN(v/1e6,2)+' M€':v>=1e4?fmtN(v/1e3)+' k€':fmt(v);
function evOutAll(reveal){
  const y=Math.min(Math.max(Math.round(S.proj.years)||20,1),40),ev=evCalc(y);
  const fin=ev.mid[y],ver=ev.versed[y];
  const ms=[10000,50000,100000,250000,500000,1000000].map(t=>{let yr=null;for(let i=1;i<=y;i++){if(ev.mid[i]>=t){yr=i;break;}}return {t,yr};});
  const hz=[5,10,20,30].filter(h=>h<=y);
  const sb=hz.map(h=>({l:h+' a',parts:[{v:ev.versed[h],c:'#8E8E93'},{v:Math.max(ev.mid[h]-ev.versed[h],0),c:'var(--tc)'}]}));
  return `<div class="hero2"><div class="sm">Dans ${y} an${y>1?'s':''}, ton portefeuille pourrait valoir</div><div class="big">${cu(fin,'k')}</div>
    <div class="sm">Entre ${fmtK(ev.lo[y])} et ${fmtK(ev.hi[y])}</div>
    <div class="mini3"><div><small>Versé</small><b>${fmtK(ver)}</b></div><div><small>Intérêts</small><b>${fmtK(fin-ver)}</b></div><div><small>Multiplié par</small><b>${ver>0?fmtN(fin/ver,1):'–'}</b></div></div></div>
  <div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:6px">Chaque couleur est un placement. Les traits fins marquent le cas prudent et le cas optimiste, le trait blanc ce que tu verses.</div>${stackArea(ev,y,reveal)}
    <div class="legend" style="margin-top:12px">${ev.layers.map(L=>`<div class="li"><span class="dot" style="background:${L.c}"></span><span class="n">${esc(L.name)}</span><span class="p">${fmtN(L.sh*100)} % · ${fmtK(L.v[y])}</span></div>`).join('')}</div></div>
  <div class="section-head"><h2 class="section-title">Les paliers</h2></div>
  <div class="chips">${ms.map(m=>`<span class="chip static ${m.yr?'on':'off'}">${fmtK(m.t)} ${m.yr?'en '+m.yr+' an'+(m.yr>1?'s':''):'pas atteint'}</span>`).join('')}</div>
  ${sb.length?`<div class="section-head"><h2 class="section-title">Versé et intérêts</h2></div><div class="card">${stackBars(sb,{h:160})}<div class="chips" style="margin-top:6px"><span class="lg"><span class="dot" style="background:#8E8E93"></span>Ce que tu verses</span><span class="lg"><span class="dot" style="background:var(--tc)"></span>Ce que les intérêts ajoutent</span></div></div>`:''}`;
}
function evParts(reveal){const h=evOutAll(reveal),k=h.indexOf('<div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:6px">Chaque couleur');return [h.slice(0,k),h.slice(k)];}
function evUpdate(reveal){const p=evParts(reveal),a=$('#evhero'),b=$('#evout');if(a)a.innerHTML=p[0];if(b)b.innerHTML=p[1];}
M.evol=function(){
  const y=Math.min(Math.max(Math.round(S.proj.years)||20,1),40),m=mix();
  const cls=CLASSES.map(c=>`<div class="row" style="gap:8px"><div style="flex:1;min-width:0" class="row-title"><span class="dot" style="background:${CCOL[c]}"></span> ${c}</div>
    <div style="display:flex;gap:6px;align-items:center"><input class="mini" type="number" inputmode="decimal" step="any" value="${S.ret[c]}" data-ret="${c}" aria-label="Rendement ${c}"><span class="muted" style="font-size:12px">% ±</span><input class="mini" type="number" inputmode="decimal" step="any" value="${S.spread[c]}" data-spr="${c}" aria-label="Écart ${c}"></div></div>`).join('');
  return `${m.empty?'<div class="callout">Ton portefeuille est vide : on montre un ETF monde par défaut. Ajoute tes placements dans Placements pour voir la vraie évolution.</div>':''}
  <div id="evhero" style="margin-top:${m.empty?12:0}px">${evParts(true)[0]}</div>
  <div class="card"><div class="field"><label>Horizon : <b id="evy-l">${y} an${y>1?'s':''}</b></label><input type="range" min="1" max="40" step="1" value="${y}" data-evy="1" aria-label="Horizon en années"></div>
    <div class="form-grid" style="margin-top:12px"><div class="field"><label>Capital de départ (€)</label><input type="number" inputmode="decimal" value="${S.proj.init}" data-evi="1"></div>
    <div class="field"><label>Versement mensuel (€)</label><input type="number" inputmode="decimal" value="${S.dca||''}" placeholder="0" data-dca="1"></div></div></div>
  <div id="evout">${evParts(true)[1]}</div>
  <details class="card wdet" ${ui.open.evh?'open':''} style="margin-top:12px"><summary data-act="togglesum" data-id="evh"><span>Comment c'est calculé</span><span class="muted" style="font-size:13px">${ui.open.evh?'Masquer':'Afficher'}</span></summary>${ui.open.evh?`<p class="note" style="margin-top:10px">Chaque placement reçoit sa part de ton capital et de ton versement mensuel, puis croît à son rythme. Le cas central utilise les rendements annuels moyens ci-dessous, le prudent et l'optimiste ajoutent ou retirent l'écart. Ce sont des ordres de grandeur long terme, pas des promesses.</p><div class="row-list">${cls}</div>`:''}</details>
  <p class="note">Les marchés, et surtout les cryptos, peuvent s'écarter fortement de ces courbes. Frais, fiscalité et pertes temporaires ne sont pas modélisés.</p>`;
};

/* ---- Intérêts composés : outil ---- */
function ciRun(c){
  const y=Math.min(Math.max(Math.round(c.years)||1,1),60),f=c.freq||12;
  const rm=Math.pow(1+(c.rate||0)/100/f,f/12)-1;
  let v=c.init||0,ver=c.init||0;const rows=[{y:0,ver,v,int:0}];
  for(let a=1;a<=y;a++){for(let i=0;i<12;i++){v=v*(1+rm)+(c.monthly||0);ver+=(c.monthly||0);}rows.push({y:a,ver,v,int:v-ver});}
  const rr=(c.rate||0)/100,mo=c.monthly||0,simple=(c.init||0)*(1+rr*y)+mo*12*y+mo*rr*y*(12*y-1)/2;
  return {rows,y,fin:v,ver,int:v-ver,simple};
}
function ciChart(rows){
  const W=340,H=200,pl=6,pr=6,pt=12,pb=22,n=rows.length-1;
  const mx=Math.max(...rows.map(r=>r.v),1),bw=(W-pl-pr)/n,w=Math.max(Math.min(bw*.7,26),2);
  const Y=v=>pt+(H-pt-pb)*(1-v/mx);
  const step=Math.ceil(n/8);
  const bars=rows.slice(1).map((r,i)=>{const x=pl+bw*i+(bw-w)/2,hv=(H-pb)-Y(r.ver),hi=Y(r.ver)-Y(r.v);
    return `<rect x="${x.toFixed(1)}" y="${Y(r.ver).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(hv,0).toFixed(1)}" fill="#8E8E93" fill-opacity=".55"/><rect x="${x.toFixed(1)}" y="${Y(r.v).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(hi,0).toFixed(1)}" fill="url(#cig)"/>${(r.y%step===0||r.y===n)?`<text x="${(x+w/2).toFixed(1)}" y="${H-6}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${r.y}</text>`:''}`;}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Capital année par année"${scrubData(W,pt,H-pb,rows.slice(1).map((r,i)=>pl+bw*i+bw/2),rows.slice(1).map(r=>`<b>Année ${r.y}</b><span>Capital ${esc(fmtK(r.v))}</span><span>Versé ${esc(fmtK(r.ver))}</span><span>Intérêts ${esc(fmtK(r.v-r.ver))}</span>`))}><defs><linearGradient id="cig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5B400"/><stop offset="1" stop-color="#0FA97A"/></linearGradient></defs><line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>${bars}</svg>`;
}
function ciOutAll(){
  const c=S.ci,r=ciRun(c);
  const share=r.fin>0?r.int/r.fin:0,dbl=c.rate>0?72/c.rate:null;
  const last=r.rows[r.rows.length-1],prev=r.rows[r.rows.length-2]||last;
  const jal=[5,10,15,20,25,30,40,50].filter(a=>a<=r.y);
  return `<div class="hero2"><div class="sm">Capital final après ${r.y} an${r.y>1?'s':''}</div><div class="big">${cu(r.fin,'k')}</div>
    <div class="mini3"><div><small>Versé</small><b>${fmtK(r.ver)}</b></div><div><small>Intérêts</small><b>${fmtK(r.int)}</b></div><div><small>Part des intérêts</small><b>${fmtN(share*100)} %</b></div></div></div>
  <div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:6px">Chaque colonne est une année : gris, ce que tu as versé, couleur, ce que les intérêts ont ajouté.</div>${ciChart(r.rows)}</div>
  <div class="card" style="margin-top:12px"><div style="display:flex;align-items:center;gap:16px">${donut([{v:r.ver,c:'#8E8E93'},{v:Math.max(r.int,0),c:'#0FA97A'}],fmtN(share*100)+' %<br>intérêts')}<div class="legend" style="flex:1;min-width:0"><div class="li"><span class="dot" style="background:#8E8E93"></span><span class="n">Versé</span><span class="p">${fmtK(r.ver)}</span></div><div class="li"><span class="dot" style="background:#0FA97A"></span><span class="n">Intérêts</span><span class="p">${fmtK(r.int)}</span></div></div></div></div>
  <div class="grid2" style="margin-top:12px"><div class="stat box"><div class="k">Pour doubler</div><div class="v">${dbl?fmtN(dbl,1)+' ans':'–'}</div><div class="s">règle des 72</div></div>
    <div class="stat box"><div class="k">Gagné la dernière année</div><div class="v">${fmt(last.v-prev.v-(c.monthly||0)*12)}</div><div class="s">${fmt((last.v-prev.v-(c.monthly||0)*12)/12)} par mois</div></div>
    <div class="stat box"><div class="k">Sans composer</div><div class="v">${fmtK(r.simple)}</div><div class="s">intérêts non réinvestis</div></div>
    <div class="stat box"><div class="k">Effet des intérêts composés</div><div class="v">+${fmtK(Math.max(r.fin-r.simple,0))}</div><div class="s">en plus</div></div></div>
  <div class="section-head"><h2 class="section-title">Année par année</h2></div>
  <div class="row-list">${jal.map(a=>{const x=r.rows[a];return `<div class="row"><div><div class="row-title">${a} ans</div><div class="row-sub">versé ${fmtK(x.ver)} · intérêts ${fmtK(x.int)}</div></div><span class="row-value">${fmtK(x.v)}</span></div>`;}).join('')}</div>`;
}
function ciParts(){const h=ciOutAll(),k=h.indexOf('<div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:6px">Chaque colonne');return [h.slice(0,k),h.slice(k)];}
function ciUpdate(){const p=ciParts(),a=$('#cihero'),b=$('#ciout');if(a)a.innerHTML=p[0];if(b)b.innerHTML=p[1];}
M.ci=function(){
  const c=S.ci;
  const f=(l,k,min,max,step,unit)=>`<div class="field"><label>${l}</label><div style="display:flex;gap:10px;align-items:center"><input class="mini" style="width:92px" type="number" inputmode="decimal" step="any" value="${c[k]}" data-ci="${k}" aria-label="${l}"><input type="range" min="${min}" max="${max}" step="${step}" value="${c[k]}" data-ci="${k}" aria-label="${l}, curseur"></div></div>`;
  return `<div id="cihero">${ciParts()[0]}</div><div class="card"><div class="form-grid" style="grid-template-columns:1fr">
    ${f('Capital de départ (€)','init',0,200000,500)}${f('Versement mensuel (€)','monthly',0,3000,10)}${f('Rendement annuel (%)','rate',0,20,0.1)}${f('Durée (années)','years',1,50,1)}
    <div class="field"><label>Les intérêts sont ajoutés</label><select data-ci="freq"><option value="12" ${c.freq===12?'selected':''}>Chaque mois</option><option value="4" ${c.freq===4?'selected':''}>Chaque trimestre</option><option value="1" ${c.freq===1?'selected':''}>Chaque année</option></select></div></div>
    <div class="form-actions"><button class="btn btn-ghost" data-act="ciport">Reprendre mon portefeuille</button></div></div>
  <div id="ciout">${ciParts()[1]}</div>`;
};

M.inc=function(){
  const tot=monthTotals(),vals=tot.map(i=>i.amount),mean=avg(vals.slice(-12));
  const yr=String(new Date().getFullYear());
  const ytd=sum(S.incomes.filter(i=>i.m.startsWith(yr)).map(i=>i.amount));
  const best=tot.length?tot.reduce((a,b)=>b.amount>a.amount?b:a):null;
  const ms=Array.from({length:12},(_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-(11-i));return mkey(d);});
  const col=s=>SRC_COL[Math.max(S.sources.indexOf(s),0)%SRC_COL.length];
  const stack=ms.map(k=>({l:mShort(k).split(' ')[0],parts:S.sources.map(s=>({v:sum(S.incomes.filter(i=>i.m===k&&i.source===s).map(i=>i.amount)),c:col(s)}))}));
  const bySrc=S.sources.map(s=>({n:s,v:sum(S.incomes.filter(i=>i.m.startsWith(yr)&&i.source===s).map(i=>i.amount)),c:col(s)}));
  const m=mkey(new Date());
  setTimeout(scanPays,300);
  return `${payStats()}
  <div class="section-head"><h2 class="section-title">Revenus</h2></div>
  <div class="card"><div class="muted" style="font-size:12.5px">12 derniers mois, par origine</div>
    ${tot.length?stackBars(stack):'<div class="empty">Ajoute tes revenus pour voir la courbe et les statistiques.</div>'}
    <div class="chips" style="margin-top:6px">${S.sources.map(s=>`<span class="lg"><span class="dot" style="background:${col(s)}"></span>${esc(s)}</span>`).join('')}</div></div>
  <div class="grid2" style="margin-top:12px">
    <div class="stat box"><div class="k">Moyenne mensuelle</div><div class="v">${tot.length?fmt(mean):'—'}</div></div>
    <div class="stat box"><div class="k">Cumul ${yr}</div><div class="v">${fmt(ytd)}</div></div>
    <div class="stat box"><div class="k">Meilleur mois</div><div class="v">${best?fmt(best.amount):'—'}</div><div class="s">${best?mShort(best.m):' '}</div></div>
    <div class="stat box"><div class="k">Origines actives</div><div class="v">${bySrc.filter(x=>x.v>0).length}</div></div></div>
  ${sum(bySrc.map(x=>x.v))>0?`<div class="card" style="margin-top:12px"><div style="display:flex;align-items:center;gap:16px">${donut(bySrc,yr)}<div class="legend" style="flex:1;min-width:0">${bySrc.filter(x=>x.v>0).map(s=>`<div class="li"><span class="dot" style="background:${s.c}"></span><span class="n">${esc(s.n)}</span><span class="p">${fmtN(s.v/sum(bySrc.map(x=>x.v))*100)} %</span></div>`).join('')}</div></div></div>`:''}

  <div class="section-head"><h2 class="section-title">Ajouter un revenu</h2><button class="iconbtn" data-act="toggle" data-id="fi" aria-label="Ajouter un revenu">${ui.open.fi?'×':'+'}</button></div>
  ${ui.open.fi?`<div class="form-panel"><div class="form-grid">
    <div class="field"><label>Mois</label><input id="i-m" type="month" value="${m}"></div>
    <div class="field"><label>Origine</label><select id="i-s">${S.sources.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
    <div class="field wide"><label>Montant net (€)</label><input id="i-a" type="number" inputmode="decimal" step="any"></div></div>
    <div class="form-actions"><button class="btn btn-primary" data-act="addinc">Enregistrer</button></div>
    <div style="display:flex;gap:8px;margin-top:12px"><input id="src-n" placeholder="Nouvelle origine" class="inl"><button class="btn btn-ghost" data-act="addsrc">Créer</button></div></div>`:''}

  <div class="section-head"><h2 class="section-title">Fiches de paie</h2><button class="iconbtn" data-act="toggle" data-id="fp" aria-label="Ajouter une fiche">${ui.open.fp?'×':'+'}</button></div>
  ${ui.open.fp?`<div class="form-panel"><div class="form-grid">
    <div class="field wide"><label>Fichiers PDF (plusieurs possibles)</label><input id="p-f" type="file" accept="application/pdf,.pdf" multiple></div>
    <div class="field"><label>Origine</label><select id="p-s">${S.sources.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
    <div class="field"><label>Mois si non trouvé</label><input id="p-m" type="month" value="${m}"></div></div>
    <div class="form-actions"><button class="btn btn-primary" data-act="addpay">Ajouter et lire les fiches</button></div>
    ${ui.msg?`<p class="note" style="margin-top:8px">${esc(ui.msg)}</p>`:''}
    <p class="note">Le mois, le brut, le net, l'impôt, les cotisations et les congés sont lus automatiquement. Le net versé est ajouté à tes revenus du mois. Les PDF restent sur cet appareil et ne sont envoyés nulle part.</p></div>`:''}
  <div class="row-list">${S.pays.slice().sort((a,b)=>a.m<b.m?1:-1).map(p=>`<div class="row"><div style="min-width:0"><div class="row-title"><span class="dot" style="background:${col(p.source)}"></span> ${esc(p.source)} · ${mShort(p.m)}</div><div class="row-sub">${p.d&&p.d.brut?'Brut '+fmt(p.d.brut)+' · ':''}${esc(p.d?'':p.name+' · ')}${p.d?'':fmtN(p.size/1024)+' Ko'}${p.net?' · Net '+fmt(p.net):''}</div></div><div style="display:flex;gap:6px;align-items:center"><button class="btn btn-primary" style="padding:6px 12px;font-size:12.5px;flex:none" data-act="openpay" data-id="${p.id}">Ouvrir</button><button class="btn btn-ghost" style="padding:6px 10px;font-size:12.5px" data-act="getpay" data-id="${p.id}">Enregistrer</button><button class="row-del" data-act="delpay" data-id="${p.id}" aria-label="Supprimer">×</button></div></div>`).join('')||'<div class="empty">Aucune fiche de paie ajoutée.</div>'}</div>

  <div class="section-head"><h2 class="section-title">Historique</h2></div>
  <div class="row-list">${S.incomes.slice().sort((a,b)=>a.m<b.m?1:-1).map(i=>`<div class="row"><div class="row-title"><span class="dot" style="background:${col(i.source)}"></span> ${mShort(i.m)} · ${esc(i.source)}</div><div style="display:flex;gap:10px;align-items:center"><span class="row-value">${fmt(i.amount)}</span><button class="row-del" data-act="delinc" data-id="${i.id}" aria-label="Supprimer">×</button></div></div>`).join('')}</div>`;
};

M.immo=function(){
  const p=S.sim,tm=monthTotals().slice(-3),ai=avg(tm.map(i=>i.amount));
  return `
  <div class="card"><div class="form-grid">
    ${[['prix','Prix du bien (€)',1],['apport','Apport (€)',1],['taux','Taux (%/an)',0.01],['duree','Durée (années)',1],['assu','Assurance (%/an)',0.01],['notaire','Frais de notaire (€)',1]].map(([k,l,s])=>`<div class="field"><label>${l}</label><input type="number" inputmode="decimal" step="${s}" value="${p[k]}" data-sim="${k}"></div>`).join('')}
  </div></div>
  <div class="card" id="simOut"></div>
  <div class="section-head"><h2 class="section-title">Capacité d'emprunt</h2></div>
  <div class="card">
    <div class="form-grid"><div class="field wide"><label>Charges de crédit déjà en cours (€/mois)</label><input type="number" inputmode="decimal" value="${p.charges}" data-sim="charges"></div></div>
    <div id="capOut" style="margin-top:12px"></div>
    <p class="note" style="margin-top:8px">${ai>0?'Calculé avec la moyenne de tes '+tm.length+' derniers mois de revenus ('+fmt(ai)+'), au taux et à la durée ci-dessus. Seuil d\'endettement usuel : 35 %.':'Saisis tes revenus dans Revenus pour estimer ta capacité.'}</p></div>
  <div class="section-head"><h3 class="section-title" style="font-size:18px">Scénarios enregistrés</h3><button class="iconbtn" data-act="savesim" aria-label="Enregistrer">+</button></div>
  <div class="row-list">${S.sims.map(s=>`<div class="row"><div><div class="row-title">${esc(s.name)}</div><div class="row-sub">Mensualité</div></div><div style="display:flex;gap:10px;align-items:center"><span class="row-value">${fmt(s.mens)}</span><button class="row-del" data-act="delsim" data-id="${s.id}" aria-label="Supprimer">×</button></div></div>`).join('')||'<div class="empty">Enregistre plusieurs scénarios pour les comparer.</div>'}</div>`;
};
function simUpdate(){
  const p=S.sim,m=mortgage(p),o=$('#simOut');if(!o)return;
  const tot=Math.max(m.emprunt+m.interets+m.assuTot,1);
  o.innerHTML=`<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px"><span class="muted" style="font-size:13px">Mensualité totale</span><span class="bignum" style="font-size:32px">${fmt(m.mens)}</span></div>
  <div class="grid2"><div class="stat"><div class="k">Emprunté</div><div class="v">${fmt(m.emprunt)}</div></div>
    <div class="stat"><div class="k">Dont assurance / mois</div><div class="v">${fmt(m.assu)}</div></div>
    <div class="stat"><div class="k">Coût des intérêts</div><div class="v">${fmt(m.interets)}</div></div>
    <div class="stat"><div class="k">Coût total du crédit</div><div class="v">${fmt(m.interets+m.assuTot)}</div></div></div>
  <div class="alloc-bar" style="margin-top:14px"><div style="width:${m.emprunt/tot*100}%;background:var(--gold)"></div><div style="width:${(m.interets+m.assuTot)/tot*100}%;background:var(--negative)"></div></div>
  <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);margin-top:7px"><span>Capital</span><span>Intérêts + assurance</span></div>`;
  const c=$('#capOut');if(!c)return;
  const tm=monthTotals().slice(-3),ai=avg(tm.map(i=>i.amount));
  if(!(ai>0)){c.innerHTML='';return;}
  const maxM=Math.max(ai*0.35-(p.charges||0),0),f=m.f+p.assu/100/12;
  const cap=f>0?maxM/f:0,bien=Math.max(cap+p.apport-p.notaire,0);
  c.innerHTML=`<div class="grid2"><div class="stat"><div class="k">Mensualité maximale</div><div class="v">${fmt(maxM)}</div></div>
  <div class="stat"><div class="k">Capital empruntable</div><div class="v">${fmt(cap)}</div></div>
  <div class="stat" style="grid-column:1/-1"><div class="k">Prix de bien estimé avec ton apport</div><div class="v pos">${fmt(bien)}</div></div></div>`;
}

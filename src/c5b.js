
/* ================= Fiches de paie : lecture automatique ================= */
async function pdfLines(blob){
  const L=await loadPdfJs(),doc=await L.getDocument({data:await blob.arrayBuffer()}).promise,out=[];
  for(let i=1;i<=Math.min(doc.numPages,3);i++){
    const tc=await (await doc.getPage(i)).getTextContent(),rows=[];
    tc.items.forEach(it=>{if(!it.str||!it.str.trim())return;const y=it.transform[5],x=it.transform[4];
      let r=rows.find(r=>Math.abs(r.y-y)<2.5);if(!r){r={y,it:[]};rows.push(r);}r.it.push({x,s:it.str});});
    rows.sort((a,b)=>b.y-a.y).forEach(r=>out.push(r.it.sort((a,b)=>a.x-b.x).map(o=>o.s).join(' ').replace(/\s+/g,' ').trim()));
  }
  return out;
}
const AMT='(\\d{1,3}(?:[ \\u00a0\\u202f]\\d{3})*(?:[.,]\\d{1,2})?)';
const pAmt=s=>{if(s==null)return null;s=String(s).replace(/[   ]/g,'').replace(',','.');const n=parseFloat(s);return isFinite(n)?n:null;};
function parsePay(lines){
  const T=lines.join(' \n ').replace(/[  ]/g,' '),F=T.replace(/\s*\n\s*/g,' ');
  const g=(re)=>{const m=F.match(re);return m?pAmt(m[1]):null;};
  const d={};
  let m=F.match(/Du\s+(\d{2})\/(\d{2})\/(\d{4})\s+au\s+(\d{2})\/(\d{2})\/(\d{4})/i);
  if(m)d.m=m[3]+'-'+m[2];
  else{const MO={janvier:1,'février':2,fevrier:2,mars:3,avril:4,mai:5,juin:6,juillet:7,'août':8,aout:8,septembre:9,octobre:10,novembre:11,'décembre':12,decembre:12};
    const mm=F.toLowerCase().match(/(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre)\s+(20\d{2})/);
    if(mm)d.m=mm[2]+'-'+pad(MO[mm[1]]||MO[mm[1].normalize('NFD').replace(/[̀-ͯ]/g,'')]);}
  d.brut=g(new RegExp('(?:Salaire\\s+)?brut(?:\\s+total)?\\s*:?\\s*'+AMT+'\\s*€','i'))??g(new RegExp('R[ÉE]MUN[ÉE]RATION BRUTE\\s+'+AMT,'i'));
  d.charges=g(new RegExp('Charges salariales\\s*:?\\s*'+AMT,'i'))??g(new RegExp('TOTAL DES COTISATIONS ET CONTRIBUTIONS\\s+'+AMT,'i'));
  d.netAvant=g(new RegExp('Net à payer avant imp[ôo]t(?: sur le revenu)?\\s*:?\\s*'+AMT,'i'));
  d.impot=g(new RegExp('Imp[ôo]t (?:sur le revenu )?prélevé(?: à la source)?\\s*:?\\s*-?\\s*'+AMT,'i'));
  d.netSocial=g(new RegExp('Montant net social\\s*:?\\s*'+AMT,'i'));
  d.net=g(new RegExp('Net à payer après imp[ôo]t\\s*:?\\s*'+AMT,'i'))??g(new RegExp('Net payé\\s*:?\\s*'+AMT,'i'))??g(new RegExp('Salaire net à payer\\s+'+AMT+'\\s*€','i'));
  m=F.match(new RegExp('Assiette de l.imp[ôo]t.*?Cumul imp[ôo]t prélevé.*?'+AMT+'\\s*€\\s+(\\d{1,2}(?:[.,]\\d{1,2})?)\\s*%\\s+'+AMT+'\\s*€?\\s+'+AMT,'i'));
  if(m){d.imposable=pAmt(m[1]);d.taux=pAmt(m[2]);d.cumImposable=pAmt(m[3]);d.cumImpot=pAmt(m[4]);}
  else{d.taux=g(/Taux (?:neutre|personnalis[ée]|PAS)?\s*:?\s*(\d{1,2}(?:[.,]\d{1,2})?)\s*%/i);d.imposable=g(new RegExp('Net imposable\\s*:?\\s*'+AMT,'i'));}
  m=F.match(new RegExp('TOTAL DES COTISATIONS ET CONTRIBUTIONS\\s+'+AMT+'\\s+'+AMT,'i'));if(m)d.patronal=pAmt(m[2]);
  d.cout=g(new RegExp('Co[ûu]t (?:global|total employeur)\\s*:?\\s*'+AMT,'i'));
  m=F.match(/Cong[ée]s pay[ée]s[^]{0,140}?(\d+[.,]\d+)\s*jours/i);if(m)d.cp=pAmt(m[1]);
  m=F.match(/\bRTT\b[^]{0,200}?(\d+[.,]\d+)\s*jours/i);if(m)d.rtt=pAmt(m[1]);
  if(d.net==null&&d.netAvant!=null&&d.impot!=null)d.net=Math.round((d.netAvant-d.impot)*100)/100;
  if(d.cout==null&&d.brut!=null&&d.patronal!=null)d.cout=Math.round((d.brut+d.patronal)*100)/100;
  Object.keys(d).forEach(k=>{if(d[k]==null)delete d[k];});
  return d;
}
async function readPay(blob){try{return parsePay(await pdfLines(blob));}catch(e){return null;}}
let _payScan=false;
function scanPays(){
  if(_payScan)return;const todo=S.pays.filter(p=>!p.d&&!p.tried);if(!todo.length)return;_payScan=true;
  (async()=>{let n=0;for(const p of todo){p.tried=1;try{const b=await idb.get(p.id);if(!b)continue;const d=await readPay(b);if(d&&(d.net||d.brut)){applyPay(p,d);n++;}}catch(e){}}
    _payScan=false;save();if(n){toast(n+' fiche'+(n>1?'s':'')+' lue'+(n>1?'s':''));if(ui.tab==='money'&&ui.money==='inc')render();}})();
}
function applyPay(p,d){
  p.d=d;if(d.m&&!p.mFixed)p.m=d.m;if(d.net)p.net=d.net;
  if(p.net){const ex=S.incomes.find(i=>i.m===p.m&&i.source===p.source);if(ex)ex.amount=p.net;else S.incomes.push({id:uid(),m:p.m,amount:p.net,source:p.source});}
}
const payWithD=()=>S.pays.filter(p=>p.d&&(p.d.net||p.d.brut)).sort((a,b)=>a.m<b.m?-1:1);
const f2=n=>(isFinite(n)?n:0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
function payStats(){
  const L=payWithD();if(!L.length)return '';
  const last=L[L.length-1],d=last.d,yr=last.m.slice(0,4),Y=L.filter(p=>p.m.startsWith(yr));
  const cum=k=>sum(Y.map(p=>p.d[k]||0));
  const pc=(a,b)=>a&&b?fmtN(a/b*100,1)+' %':'—';
  const wk=k=>{const days=Object.keys(S.work.days).filter(x=>x.startsWith(k));return sum(days.map(x=>workMin(S.work.days[x],false)));};
  const hrs0=wk(last.m)/60,hrs=hrs0>=60?hrs0:0;
  const series=[{v:L.map(p=>p.d.brut||0),c:'#9A9488',w:1.8,n:'Brut'},{v:L.map(p=>p.d.net||0),c:'var(--tc)',w:2.6,n:'Net versé'},{v:L.map(p=>p.d.impot||0),c:'#C9A15E',w:1.6,dash:1,n:'Impôt'}];
  const chart=L.length>1?`<div class="card" style="margin-top:12px"><div class="muted" style="font-size:12.5px;margin-bottom:6px">Brut, net versé et impôt, mois par mois</div>${multiLine(series,L.map(p=>mShort(p.m)),v=>fmt(v))}</div>`:'';
  const cout=d.cout||((d.brut||0)+(d.patronal||0))||0;
  return `<div class="section-head"><h2 class="section-title">Mes fiches de paie</h2><span class="section-sub">${L.length} lue${L.length>1?'s':''}</span></div>
  <div class="card payc"><div class="payh"><div><small>${esc(mShort(last.m))} · net versé</small><b>${f2(d.net||0)}</b></div>${d.taux!=null?`<span class="paytx">Impôt ${fmtN(d.taux,1)} %</span>`:''}</div>
    <div class="payflow">
      ${d.brut?`<div><span>Brut</span><b>${f2(d.brut)}</b></div>`:''}
      ${d.charges?`<div><span>Cotisations salariales <em>${pc(d.charges,d.brut)}</em></span><b>− ${f2(d.charges)}</b></div>`:''}
      ${d.impot?`<div><span>Impôt prélevé</span><b>− ${f2(d.impot)}</b></div>`:''}
      ${d.net?`<div class="tot"><span>Net versé</span><b>${f2(d.net)}</b></div>`:''}
    </div>
    ${cout&&d.net?`<div class="paybar"><i style="width:${Math.round(d.net/cout*100)}%"></i></div><p class="note" style="margin:6px 0 0">Ton employeur dépense ${fmt(cout)} pour ce mois : tu en touches ${Math.round(d.net/cout*100)} %.</p>`:''}
  </div>
  ${chart}
  <div class="grid2" style="margin-top:12px">
    <div class="stat box"><div class="k">Net versé ${yr}</div><div class="v">${fmt(cum('net'))}</div><div class="s">${Y.length} mois</div></div>
    <div class="stat box"><div class="k">Brut ${yr}</div><div class="v">${fmt(cum('brut'))}</div></div>
    <div class="stat box"><div class="k">Impôt prélevé ${yr}</div><div class="v">${fmt(d.cumImpot||cum('impot'))}</div></div>
    <div class="stat box"><div class="k">${hrs>0?'Net par heure pointée':'Net imposable ce mois'}</div><div class="v">${hrs>0?fmtN((d.net||0)/hrs,2)+' €':d.imposable?fmt(d.imposable):'—'}</div><div class="s">${hrs>0?fmtH(hrs*60)+' en '+esc(mShort(last.m)):''}</div></div>
    ${d.cp!=null?`<div class="stat box"><div class="k">Congés payés</div><div class="v">${fmtN(d.cp,2)} j</div></div>`:''}
    ${d.rtt!=null?`<div class="stat box"><div class="k">RTT</div><div class="v">${fmtN(d.rtt,2)} j</div></div>`:''}
  </div>`;
}

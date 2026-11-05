
/* ================= Pas (app Santé) : import local ================= */
const STEPGOAL=()=>S.stepGoal||10000;
function parseStepsText(t){
  const MO={janv:1,jan:1,'févr':2,fev:2,'fév':2,feb:2,mars:3,mar:3,avr:4,apr:4,mai:5,may:5,juin:6,jun:6,juil:7,jul:7,'août':8,aout:8,aug:8,sept:9,sep:9,oct:10,nov:11,'déc':12,dec:12};
  const out={};
  String(t||'').split(/\r?\n|;(?=\s*\d{4}-)/).forEach(line=>{
    const l=line.trim();if(!l)return;let k=null,rest=l;
    let m=l.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if(m){k=m[1]+'-'+pad(+m[2])+'-'+pad(+m[3]);rest=l.replace(m[0],' ');}
    else if((m=l.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/))){let y=+m[3];if(y<100)y+=2000;k=y+'-'+pad(+m[2])+'-'+pad(+m[1]);rest=l.replace(m[0],' ');}
    else if((m=l.toLowerCase().match(/(\d{1,2})\s+([a-zéû]+)\.?\s+(\d{4})/))){const mo=MO[m[2].slice(0,4)]||MO[m[2].slice(0,3)];if(mo){k=m[3]+'-'+pad(mo)+'-'+pad(+m[1]);rest=l.toLowerCase().replace(m[0],' ');}}
    if(!k)return;
    rest=rest.replace(/à\s*\d{1,2}[:h]\d{2}/gi,' ').replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g,' ');
    const nums=(rest.match(/\d[\d\s  ]*(?:[.,]\d+)?/g)||[]).map(x=>Math.round(parseFloat(x.replace(/[\s  ]/g,'').replace(',','.')))).filter(n=>n>=0&&n<200000);
    if(!nums.length)return;const v=Math.max(...nums);
    out[k]=Math.max(out[k]||0,v);
  });
  return out;
}
async function parseHealthXml(file,onProg){
  /* lecture par morceaux : supporte les gros export.xml de l'app Santé sans saturer la mémoire */
  const per={},CH=4*1024*1024,dec=new TextDecoder();let pos=0,carry='';
  const re=/<Record type="HKQuantityTypeIdentifierStepCount"[^>]*?sourceName="([^"]*)"[^>]*?startDate="(\d{4}-\d{2}-\d{2})[^"]*"[^>]*?value="([\d.]+)"/g;
  while(pos<file.size){
    const buf=await file.slice(pos,pos+CH).arrayBuffer();pos+=CH;
    let txt=carry+dec.decode(buf,{stream:pos<file.size});
    const cut=txt.lastIndexOf('<Record');carry=cut>0&&pos<file.size?txt.slice(cut):'';if(carry)txt=txt.slice(0,cut);
    let m;re.lastIndex=0;while((m=re.exec(txt))){const k=m[2],src=m[1],v=+m[3];(per[k]=per[k]||{})[src]=(per[k][src]||0)+v;}
    if(onProg)onProg(Math.min(pos/file.size,1));
  }
  const out={};Object.keys(per).forEach(k=>{out[k]=Math.round(Math.max(...Object.values(per[k])));});
  return out;
}
function mergeSteps(o){S.steps=S.steps||{};if(Object.keys(o).length)S.stepsAt=Date.now();let n=0;Object.entries(o).forEach(([k,v])=>{if(v>0&&S.steps[k]!==v){S.steps[k]=v;n++;}});return n;}
/* pas des courses : l'iPhone ne les compte pas quand il reste à la maison. Estimation : 1 km ≈ 1 250 pas (foulée ~0,8 m), sinon 165 pas/min */
const RUN_SPK=1250,RUN_CAD=165;
const runAdd=()=>S.runSteps!==false;
function runSteps(k){if(!runAdd())return 0;return Math.round(sum(wOn(k).filter(w=>w.type==='course').map(w=>num(w.dist)>0?num(w.dist)*RUN_SPK:(num(w.min)>0?num(w.min)*RUN_CAD:0))));}
/* total du jour : null si aucune donnée (une valeur vide n'est jamais un 0) */
function daySteps(k){const h=(S.steps||{})[k],r=runSteps(k);if(!(h>0)&&!(r>0))return null;return (h>0?h:0)+r;}
function stepStats(){
  const td=todayK(),g=STEPGOAL(),d30=lastDays(30),vals=d30.map(k=>[k,daySteps(k)]).filter(x=>x[1]!=null);
  const v7=lastDays(7).map(daySteps).filter(x=>x!=null),p7=lastDays(14).slice(0,7).map(daySteps).filter(x=>x!=null);
  const a7=v7.length?avg(v7):null,ap7=p7.length?avg(p7):null,a30=vals.length?avg(vals.map(x=>x[1])):null;
  const best=vals.length?vals.reduce((m,x)=>x[1]>m[1]?x:m):null,hit=vals.filter(x=>x[1]>=g).length;
  let streak=0;for(let i=0;i<365;i++){const k=addD(td,-i),v=daySteps(k);if(v!=null&&v>=g)streak++;else if(i===0)continue;else break;}
  const run30=sum(d30.map(runSteps)),km30=sum(vals.map(x=>x[1]))*0.75/1000;
  const dw=[1,2,3,4,5,6,0].map(j=>{const xs=vals.filter(x=>new Date(x[0]+'T12:00').getDay()===j).map(x=>x[1]);return {l:'LMMJVSD'[(j+6)%7],v:xs.length?Math.round(avg(xs)):0};});
  return {a7,ap7,a30,best,hit,n:vals.length,streak,run30,km30,dw,d30};
}
function stepsCard(){
  const st=S.steps||{},keys=Object.keys(st).sort();
  if(!keys.length&&!lastDays(7).some(k=>runSteps(k)>0))return `<div class="section-head"><h2 class="section-title">Pas</h2></div>
    <div class="card"><p class="note" style="margin:0 0 10px">Relie tes pas de l'app Santé : un raccourci iPhone les copie, Rythme les colle.</p><button class="btn btn-ghost" style="width:100%" data-act="stepsguide">Configurer</button></div>`;
  const td=todayK(),g=STEPGOAL(),hasT=daySteps(td)!=null,last=hasT?td:(keys[keys.length-1]||td),v=daySteps(last)||0,h=st[last]>0?st[last]:0,r=runSteps(last);
  const days=lastDays(7),bars=days.map(k=>({l:new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'narrow'}),v:daySteps(k)||0,c:k===last?'var(--accent)':'var(--surface-3)'}));
  const S7=stepStats(),gist=!!gistApi(S.stepsSync);
  const age=Date.now()-(S.stepsSyncAt||S.stepsAt||0),stale=!gist&&!(st[td]!=null&&age<3*3600e3);
  const ago=(S.stepsSyncAt||S.stepsAt)?(age<3600e3?'il y a '+Math.max(1,Math.round(age/60000))+' min':age<864e5?'il y a '+Math.round(age/3600e3)+' h':'le '+dShort(dkey(new Date(S.stepsSyncAt||S.stepsAt)))):'';
  const big=fmtN(v),fs=big.length>6?15:big.length>5?16.5:19;
  const trend=S7.a7!=null&&S7.ap7?Math.round((S7.a7-S7.ap7)/S7.ap7*100):null;
  const open=!!ui.stx;
  const stats=open?`<div class="stx">
      <div class="stxg">
        <div><small>Moyenne 7 j</small><b>${S7.a7!=null?fmtN(Math.round(S7.a7)):'–'}</b>${trend!=null?`<em class="${trend>=0?'up':'dn'}">${trend>=0?'+':''}${trend} % vs sem. préc.</em>`:''}</div>
        <div><small>Moyenne 30 j</small><b>${S7.a30!=null?fmtN(Math.round(S7.a30)):'–'}</b><em>${S7.n} jours renseignés</em></div>
        <div><small>Meilleur jour</small><b>${S7.best?fmtN(S7.best[1]):'–'}</b><em>${S7.best?esc(dShort(S7.best[0])):''}</em></div>
        <div><small>Objectif atteint</small><b>${S7.hit} j</b><em>sur ${S7.n} · série ${S7.streak} j</em></div>
        <div><small>Distance 30 j</small><b>${fmtN(S7.km30,0)} km</b><em>à 0,75 m le pas</em></div>
        <div><small>Pas de course 30 j</small><b>${runAdd()?fmtN(S7.run30):'–'}</b><em>${runAdd()?'estimés':'désactivés'}</em></div>
      </div>
      <div class="sublabel" style="margin:14px 0 4px">30 derniers jours</div>
      ${stackBars(S7.d30.map((k,i)=>({l:i%5===4||i===29?String(+k.slice(8)):'',parts:[{v:(st[k]>0?st[k]:0),c:'var(--accent)'},{v:runSteps(k),c:'color-mix(in srgb,var(--accent) 38%,transparent)'}]})),{h:110})}
      <div class="stxl"><span><i style="background:var(--accent)"></i>App Santé</span><span><i style="background:color-mix(in srgb,var(--accent) 38%,transparent)"></i>Courses (estimé)</span></div>
      <div class="sublabel" style="margin:14px 0 4px">Moyenne par jour de la semaine</div>
      ${barChart(S7.dw,{h:100,goal:g,goalLabel:fmtN(g/1000,0)+' k',fy:x=>fmtN(x/1000,1)+'k'})}
    </div>`:'';
  return `<div class="section-head"><h2 class="section-title">Pas</h2><span class="section-sub">${last===td?'aujourd\'hui':esc(dShort(last))}</span></div>
  <div class="card"><div style="display:flex;align-items:center;gap:16px">
    <div class="rw" style="width:96px;height:96px;flex:none">${ring(g?v/g:0,'var(--accent)',96,10)}<div class="rc" style="flex-direction:column;font-size:${fs}px;font-weight:700;letter-spacing:-.02em">${big}<small class="muted" style="font-size:11px;font-weight:600;letter-spacing:0">pas</small></div></div>
    <div style="flex:1;min-width:0"><div style="font-weight:650;font-size:15.5px">${v>=g?'Objectif atteint':'Encore '+fmtN(g-v)+' pas'}</div>
      <div class="muted" style="font-size:13px;margin:3px 0 8px">${r>0?fmtN(h)+' Santé + '+fmtN(r)+' course':'Moyenne 7 j : '+(S7.a7!=null?fmtN(Math.round(S7.a7)):'–')+' · objectif '+fmtN(g)}</div>
      ${gist?`<button class="stsync" data-act="stepsync">${IC('clock',14)}<span>Synchro auto${ago?' · '+ago:''}</span></button>`:`${stale&&ago?`<div class="stale">${IC('clock',14)}Mis à jour ${ago}</div>`:''}<button class="btn ${stale?'btn-primary':'btn-ghost'}" style="width:100%" data-act="stepspaste">Actualiser mes pas</button>`}</div></div>
    <div style="margin-top:12px">${barChart(bars,{h:100,goal:g,fy:x=>x>=1000?fmtN(x/1000,1)+'k':fmtN(x)})}</div>
    ${stats}
    <button class="stmore" data-act="stx" aria-expanded="${open}">${open?'Masquer les stats':'Voir mes stats de pas'}<span class="chev" style="transform:rotate(${open?-90:90}deg)">›</span></button></div>`;
}
function stepsGuide(){
  return `<div class="cfbox stepg" role="dialog" aria-modal="true"><h3>Relier l'app Santé</h3>
  <p>Une page web ne peut pas lire Santé directement. Un raccourci iPhone copie tes pas, puis Rythme les colle. À créer une seule fois :</p>
  <ol>
    <li>Ouvre l'app <b>Raccourcis</b>, touche <b>+</b>, puis nomme le raccourci « Pas Rythme ».</li>
    <li>Ajoute <b>Rechercher des échantillons de santé</b> : type <b>Nombre de pas</b>, date de début <b>dans les 30 derniers jours</b>, <b>regrouper par jour</b>.</li>
    <li>Ajoute <b>Répéter avec chacun</b>. Dedans : <b>Formater la date</b> (date de début de l'élément, format personnalisé <code>yyyy-MM-dd</code>), puis <b>Texte</b> : la date formatée, un point-virgule, la <b>valeur</b> de l'élément.</li>
    <li>Après la boucle : <b>Combiner le texte</b> (retour à la ligne), puis <b>Copier dans le presse-papiers</b>.</li>
  </ol>
  <p><b>Pour l'automatiser :</b> Raccourcis > Automatisation > <b>+</b> > Heure de la journée (par ex. 8:00, 12:30 et 20:00), choisis <b>Exécuter immédiatement</b>, puis le raccourci « Pas Rythme ». Tes pas sont alors copiés tout seuls ; à l'ouverture, Rythme te propose de les coller d'un geste.</p><p> Tu peux aussi importer tout l'historique : dans Santé, ta photo > Exporter toutes les données, ouvre le zip dans Fichiers, puis choisis <b>export.xml</b> dans Réglages.</p>
  <p><b>Sans aucun geste :</b> le raccourci peut aussi envoyer tes pas dans un Gist GitHub privé que Rythme lit à chaque ouverture (lien à coller dans Réglages > Pas).</p>
  <button class="btn btn-primary" style="width:100%" data-act="stepspaste">Coller mes pas maintenant</button>
  <button class="btn" style="width:100%;margin-top:8px" data-act="cfno">Fermer</button></div>`;
}
function stepsPasteBox(msg){
  return `<div class="cfbox stepg" role="dialog" aria-modal="true"><h3>Coller mes pas</h3><p>${msg||'Colle ici le texte copié par le raccourci (une ligne par jour).'}</p>
  <textarea id="stp-t" class="code" rows="6" style="width:100%;font-size:14px" placeholder="2026-10-29;8123"></textarea>
  <div class="cfrow"><button class="btn" data-act="cfno">Annuler</button><button class="btn cfdel" style="background:var(--clay)" data-act="stepsok">Importer</button></div></div>`;
}
function showModal(html){let m=$('#cfm');if(!m){m=document.createElement('div');m.id='cfm';m.className='cfm';document.body.appendChild(m);}m.innerHTML=html;ui.cf='steps';syncBar();}
function importStepsText(t){const o=parseStepsText(t),n=mergeSteps(o),k=Object.keys(o).length;save();closeConfirm();render();toast(k?k+' jour'+(k>1?'s':'')+' de pas importé'+(k>1?'s':''):'Aucun pas trouvé dans le texte');}

function stepsBanner(){
  const st=S.steps||{};if(!Object.keys(st).length)return '';
  const age=Date.now()-(S.stepsAt||0);if(st[todayK()]!=null&&age<3*3600e3)return '';if(gistApi(S.stepsSync))return '';
  return `<button class="stpb" data-act="stepspaste"><span class="stpi">${IC('step',18)}</span><span><b>Actualiser mes pas</b><small>Un geste pour coller les pas copiés par ton raccourci</small></span><span class="chev">›</span></button>`;
}

/* ---- synchronisation automatique via un Gist GitHub (le raccourci y écrit, l'app le lit) ---- */
function gistApi(u){u=String(u||'').trim();const m=u.match(/([0-9a-f]{20,40})/i);return m?'https://api.github.com/gists/'+m[1]:'';}
let _syncT=0;
async function syncSteps(force){
  const api=gistApi(S.stepsSync);if(!api)return null;
  if(!force&&Date.now()-_syncT<10*60e3)return null;_syncT=Date.now();
  if(window.claude&&window.claude.use)return null;
  try{
    const r=await fetch(api,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw new Error('http '+r.status);
    const j=await r.json(),fs=Object.values(j.files||{});if(!fs.length)throw new Error('vide');
    let f=fs.find(x=>/pas|step/i.test(x.filename))||fs[0],txt=f.content;
    if(f.truncated&&f.raw_url)txt=await (await fetch(f.raw_url,{cache:'no-store'})).text();
    const o=parseStepsText(txt),k=Object.keys(o).length,before=JSON.stringify(S.steps||{});
    if(k){mergeSteps(o);S.stepsSyncAt=Date.now();save();if(JSON.stringify(S.steps)!==before&&ui.tab==='today')render();}
    return k;
  }catch(e){return -1;}
}

/* les pas comptent pour une part de l'objectif sport du jour */
const stepPct=()=>S.stepPct==null?30:+S.stepPct;
function stepMin(k){/* les courses comptent déjà en minutes de sport : seuls les pas Santé remplissent la part pas */const v=(S.steps||{})[k];if(!(v>0))return 0;return Math.round(Math.min(v/STEPGOAL(),1)*stepPct()/100*(S.goals.dayMin||45));}
const moveMin=k=>sum(wOn(k).map(w=>w.min))+stepMin(k);

/* fenêtre de pointage qui s'ouvre d'elle-même pendant les créneaux (une fois par étape et par jour) */
function duePopup(){
  const p=punchDue();if(!p||p.st==='soon'||ui.tab!=='today'||$('#cfm'))return;
  const td=todayK(),k=td+':'+p.k+':'+(p.st==='late'?'l':'n');S.popSeen=S.popSeen&&S.popSeen.d===td?S.popSeen:{d:td,k:[]};
  if(S.popSeen.k.includes(k))return;S.popSeen.k.push(k);saveSoon();
  showModal(`<div class="cfbox"><div class="cfi" style="background:color-mix(in srgb,var(--tc) 14%,transparent);color:var(--tc)">${IC('clock',26)}</div>
    <h3>${p.st==='late'?'Tu as oublié de pointer '+p.label+' ?':'C\'est l\'heure de pointer '+p.label}</h3><p>Créneau habituel ${hm2(p.w[0])}–${hm2(p.w[1])}. L'heure reste modifiable ensuite.</p>
    <button class="btn btn-primary" style="width:100%" data-act="punchpop">Pointer maintenant · ${hhmm()}</button>
    <button class="btn" style="width:100%;margin-top:8px" data-act="cfno">Plus tard</button></div>`);
}

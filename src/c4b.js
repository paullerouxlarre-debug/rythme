
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
function stepsCard(){
  const st=S.steps||{},keys=Object.keys(st).sort();
  if(!keys.length)return `<div class="section-head"><h2 class="section-title">Pas</h2></div>
    <div class="card"><p class="note" style="margin:0 0 10px">Relie tes pas de l'app Santé : un raccourci iPhone les copie, Rythme les colle.</p><button class="btn btn-ghost" style="width:100%" data-act="stepsguide">Configurer</button></div>`;
  const td=todayK(),last=st[td]!=null?td:keys[keys.length-1],v=st[last]||0,g=STEPGOAL();
  const days=lastDays(7),bars=days.map(k=>({l:new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'narrow'}),v:st[k]||0,c:k===last?'var(--tc)':'var(--surface-3)'}));
  const avg7=Math.round(avg(days.map(k=>st[k]||0).filter(x=>x>0)))||0;
  return `<div class="section-head"><h2 class="section-title">Pas</h2><span class="section-sub">${last===td?'aujourd\'hui':esc(dShort(last))}</span></div>
  <div class="card"><div style="display:flex;align-items:center;gap:16px">
    <div class="rw" style="width:96px;height:96px;flex:none">${ring(g?v/g:0,'var(--tc)',96,10)}<div class="rc" style="flex-direction:column;font-size:19px;font-weight:700">${fmtN(v)}<small class="muted" style="font-size:11px;font-weight:600">pas</small></div></div>
    <div style="flex:1;min-width:0"><div style="font-weight:650;font-size:15.5px">${v>=g?'Objectif atteint':'Encore '+fmtN(g-v)+' pas'}</div>
      <div class="muted" style="font-size:13px;margin:3px 0 10px">Moyenne 7 jours : ${fmtN(avg7)} · objectif ${fmtN(g)}</div>
      <button class="btn btn-ghost" style="width:100%" data-act="stepspaste">Mettre à jour mes pas</button></div></div>
    <div style="margin-top:12px">${barChart(bars,{h:80,goal:g})}</div></div>`;
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
function showModal(html){let m=$('#cfm');if(!m){m=document.createElement('div');m.id='cfm';m.className='cfm';document.body.appendChild(m);}m.innerHTML=html;ui.cf='steps';}
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
function stepMin(k){const v=(S.steps||{})[k];if(!(v>0))return 0;return Math.round(Math.min(v/STEPGOAL(),1)*stepPct()/100*(S.goals.dayMin||45));}
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

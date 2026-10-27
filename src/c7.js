
/* ================= réglages ================= */
function sheetInner(){
  const act=R.profiles.find(p=>p.id===R.active),pf=R.prefs;
  return `<div class="sheet-in">
  <div class="sheet-top"><h1 class="page" style="margin:0">Réglages</h1><button class="btn btn-primary" style="flex:none" data-act="closeset">OK</button></div>

  <div class="sublabel">Profils</div>
  <div class="row-list">${R.profiles.map(p=>`<div class="row" style="cursor:pointer" data-act="switchprof" data-id="${p.id}"><div class="row-title">${esc(p.name)}</div>${p.id===R.active?'<span class="tag pos">actif</span>':'<span class="muted" style="font-size:12.5px">Passer sur ce profil</span>'}</div>`).join('')}</div>
  <div class="card" style="margin-top:10px">
    <div class="field"><label>Renommer le profil actif</label><div style="display:flex;gap:8px"><input id="pr-name" value="${esc(act.name)}" class="inl"><button class="btn btn-ghost" data-act="renprof">Renommer</button></div></div>
    <div class="field" style="margin-top:12px"><label>Nouveau profil (données séparées)</label><div style="display:flex;gap:8px"><input id="pr-new" placeholder="Prénom" class="inl"><button class="btn btn-primary" style="flex:none" data-act="addprof">Créer</button></div></div>
    ${R.profiles.length>1?`<button class="btn btn-ghost danger" style="width:100%;margin-top:12px" data-act="delprof">${ui.open.delp?'Confirmer la suppression de « '+esc(act.name)+' »':'Supprimer le profil actif'}</button>`:''}</div>

  <div class="sublabel">Apparence</div>
  <div class="card"><div class="field"><label>Couleur de l'app</label><div class="swatches">${ACCENTS.map(([n,c])=>`<button class="sw ${pf.accent===c?'on':''}" style="background:${c}" data-act="accent" data-id="${c}" aria-label="${n}"></button>`).join('')}</div></div>
    <div class="field" style="margin-top:14px"><label>Mode</label><div class="seg" style="margin:0">${[['auto','Auto'],['light','Clair'],['dark','Sombre']].map(([k,l])=>`<button class="${pf.theme===k?'on':''}" data-act="theme" data-id="${k}">${l}</button>`).join('')}</div></div></div>

  <div class="sublabel">Objectifs</div>
  <div class="card"><div class="form-grid">
    <div class="field"><label>Sport par jour (min)</label><input type="number" inputmode="numeric" value="${S.goals.dayMin}" data-goal="dayMin"></div>
    <div class="field"><label>Séances par semaine</label><input type="number" inputmode="numeric" value="${S.goals.weekSessions}" data-goal="weekSessions"></div>
    <div class="field wide"><label>Heures de boulot par semaine</label><input type="number" inputmode="decimal" value="${S.work.target}" data-wtarget="1"></div></div></div>

  <div class="sublabel">Strava</div>
  <div class="card"><p class="note" style="margin:0 0 10px">La connexion directe n'est pas possible depuis une page comme celle-ci. Sur strava.com, ouvre Paramètres, Mon compte, puis « Télécharger ou supprimer votre compte » pour demander l'export. Dépose ici le fichier <b>activities.csv</b> du dossier reçu. Les courses, la musculation, le padel et le surf sont importés, sans doublon.</p>
    <input id="sv-f" type="file" accept=".csv,text/csv"><div class="form-actions"><button class="btn btn-primary" data-act="svimport">Importer</button></div>
    ${S.imported?`<p class="note">${S.imported} sortie${S.imported>1?'s':''} déjà importée${S.imported>1?'s':''}.</p>`:''}</div>

  <div class="sublabel">Heures travaillées</div>
  <div class="card"><p class="note" style="margin:0 0 10px">Importe un fichier Excel (.xlsx, .xls) ou .csv avec une ligne par jour : <b>Date</b>, <b>Début</b>, <b>Fin</b>, et si tu veux <b>Pause</b> (ou début et fin de pause). Une colonne <b>Heures</b> seule marche aussi. Les jours déjà pointés ne sont pas écrasés.</p>
    <input id="hr-f" type="file" accept=".xlsx,.xls,.csv,.ods"><div class="form-actions"><button class="btn btn-primary" data-act="hrimport">Importer les heures</button></div>${ui.hmsg?`<p class="note" style="color:var(--text);font-weight:600">${esc(ui.hmsg)}</p>`:''}</div>

  <div class="sublabel">Sur ton iPhone</div>
  <div class="card"><p class="note" style="margin:0">${(navigator.standalone||matchMedia('(display-mode: standalone)').matches)?'✅ Rythme est installée comme une app sur cet appareil. Tes données restent sur le téléphone.':'Pour une vraie app (icône, plein écran, hors ligne), installe la version autonome de Rythme depuis Safari : Partager, puis <b>Sur l\'écran d\'accueil</b>. Pour passer tes données, utilise « Enregistrer une copie » ici puis « Restaurer » dans l\'app.'}</p></div>

  <div class="sublabel">Sauvegarde</div>
  <div class="card"><p class="note" style="margin:0 0 10px">Tes données vivent dans ce navigateur. Enregistre une copie pour les garder ou les passer sur un autre appareil.</p>
    <div class="form-actions" style="margin-top:0"><button class="btn btn-ghost" data-act="backup">Enregistrer une copie</button></div>
    <div style="display:flex;gap:8px;margin-top:12px;align-items:center"><input id="rs-f" type="file" accept=".json,application/json" style="flex:1;min-width:0"><button class="btn btn-ghost" data-act="restore">Restaurer</button></div></div>
  <div class="sublabel">Effacer les données</div>
  <div class="card"><p class="note" style="margin:0 0 10px">Pense à enregistrer une copie avant. Ce qui est effacé ne peut pas être récupéré.</p>
    <button class="btn btn-ghost danger" style="width:100%" data-act="wipeprof">Remettre ce profil à zéro</button>
    <button class="btn danger" style="width:100%;margin-top:10px;background:var(--negative);color:#fff" data-act="wipeall">Tout effacer (tous les profils)</button></div>
  ${ui.msg&&ui.sheet?`<p class="note" style="color:var(--text)">${esc(ui.msg)}</p>`:''}
  </div>`;
}
function renderSheet(){
  const el=$('#sheet');
  if(!ui.sheet){el.innerHTML='';document.body.style.overflow=$('#pdfv')?'hidden':'';return;}
  const old=$('#sh'),st=old?old.scrollTop:0;
  el.innerHTML=`<div class="sheet ${old?'static':''}" id="sh">${sheetInner()}</div>`;
  $('#sh').scrollTop=st;document.body.style.overflow='hidden';
}

/* ================= fichiers ================= */
function askConfirm(k){ui.cf=k;ui.cfstep=1;renderConfirm();}
function closeConfirm(){const m=$('#cfm');if(m){m.classList.add('out');setTimeout(()=>m.remove(),250);}ui.cf=null;}
function renderConfirm(){
  const k=ui.cf,act=R.profiles.find(p=>p.id===R.active),all=k==='wipeall',s2=ui.cfstep===2;
  const n=all?R.profiles.length:1,nw=all?sum(R.profiles.map(p=>((p.data||{}).workouts||[]).length)):S.workouts.length;
  const t=all?(s2?'Vraiment tout effacer ?':'Tout effacer ?'):'Remettre « '+esc(act.name)+' » à zéro ?';
  const d=all?(s2?'Dernière confirmation. Il n\'y aura aucun moyen de revenir en arrière.':n+' profil'+(n>1?'s':'')+', '+nw+' séance'+(nw>1?'s':'')+', tes placements, revenus, heures, fiches de paie et ta progression dans le jeu seront supprimés.'):nw+' séance'+(nw>1?'s':'')+', placements, revenus, heures et progression du jeu de ce profil seront supprimés. Les autres profils ne bougent pas.';
  let m=$('#cfm');if(!m){m=document.createElement('div');m.id='cfm';m.className='cfm';document.body.appendChild(m);}
  m.innerHTML=`<div class="cfbox" role="alertdialog" aria-modal="true" aria-labelledby="cft"><div class="cfi">${s2?'⚠️':'🗑️'}</div><h3 id="cft">${t}</h3><p>${d}</p>
    <button class="btn btn-ghost" style="width:100%" data-act="backup">Enregistrer une copie d'abord</button>
    <div class="cfrow"><button class="btn" data-act="cfno">Annuler</button><button class="btn cfdel" data-act="cfyes">${all?(s2?'Oui, tout effacer':'Effacer'):'Remettre à zéro'}</button></div></div>`;
  const box=m.querySelector('.cfbox');box.classList.remove('shake');void box.offsetWidth;if(s2)box.classList.add('shake');
}
function doWipe(k){
  if(k==='wipeprof'){const pr=R.profiles.find(p=>p.id===R.active);pr.data=blank();useProfile();resetUi();save();ui.msg='Profil remis à zéro.';renderSheet();render();toast('Profil remis à zéro');return;}
  try{localStorage.removeItem(KEY);localStorage.removeItem('rythme_v3');}catch(er){}
  try{indexedDB.deleteDatabase('rythme_files');}catch(er){}
  R={active:null,profiles:[{id:uid(),name:'Moi',data:blank()}],prefs:{accent:ACCENTS[0][1],theme:'auto'}};R.active=R.profiles[0].id;
  applyPrefs();useProfile();resetUi();save();ui.msg='Toutes les données ont été effacées.';renderSheet();render();toast('Données effacées');
}
function saveFile(name,data){
  try{
    if(window.claude&&window.claude.use){return window.claude.use('downloads').then(d=>{if(!d)return saveLocal(name,data);return d.save({filename:name,data});});}
  }catch(e){}
  return saveLocal(name,data);
}
function saveLocal(name,data){
  const type=/\.png$/.test(name)?'image/png':'application/json';
  const blob=data instanceof Blob?data:new Blob([data],{type});
  try{const f=new File([blob],name,{type});if(navigator.canShare&&navigator.canShare({files:[f]}))return navigator.share({files:[f],title:name}).catch(e=>{if(e&&e.name==='AbortError'){const er=new Error('declined');er.code='declined';throw er;}throw e;});}catch(e){}
  try{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return Promise.resolve();}catch(e){return Promise.reject(e);}
}
const XLSXURL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
let _xl=null;
function loadXLSX(){if(window.XLSX)return Promise.resolve(window.XLSX);if(_xl)return _xl;
  _xl=new Promise((res,rej)=>{const s=document.createElement('script');s.src=XLSXURL;s.onload=()=>window.XLSX?res(window.XLSX):rej(new Error('x'));s.onerror=()=>{_xl=null;rej(new Error('x'));};document.head.appendChild(s);});return _xl;}
function readText(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=()=>rej(r.error);r.readAsText(f);});}
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
function loadPdfJs(){
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  return new Promise((res,rej)=>{const s=document.createElement('script');s.src=PDFJS+'pdf.min.js';
    s.onload=()=>{const L=window.pdfjsLib;if(!L)return rej(new Error('x'));L.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';res(L);};
    s.onerror=()=>rej(new Error('x'));document.head.appendChild(s);});
}
async function showPdf(blob,p){
  const old=$('#pdfv');if(old)old.remove();
  const ov=document.createElement('div');ov.className='pdfv';ov.id='pdfv';
  ov.innerHTML='<button class="btn btn-primary x" data-act="closepdf">Fermer</button><div class="msg">Chargement…</div>';
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  try{
    const L=await loadPdfJs(),buf=await blob.arrayBuffer(),doc=await L.getDocument({data:buf}).promise;
    const m=ov.querySelector('.msg');if(m)m.remove();
    const n=Math.min(doc.numPages,15);
    for(let i=1;i<=n;i++){const pg=await doc.getPage(i),vp=pg.getViewport({scale:2}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;ov.appendChild(cv);await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;}
  }catch(er){
    const m=ov.querySelector('.msg');
    if(m)m.innerHTML='Impossible d\'afficher ce PDF ici.<br><br><button class="btn btn-primary" data-act="getpay" data-id="'+esc(p.id)+'">Enregistrer le fichier</button>';
  }
}

/* ================= rendu ================= */
let lastKey='',_en=null;
function animateCounts(){
  const els=document.querySelectorAll('#main .cu');if(!els.length)return;
  const t0=performance.now(),D=900;
  const step=now=>{const k=Math.min((now-t0)/D,1),e=1-Math.pow(1-k,3);
    els.forEach(el=>{const v=+el.dataset.v,f=CUF[el.dataset.f];if(f)el.textContent=f(v*e);});
    if(k<1)requestAnimationFrame(step);else els.forEach(el=>{const f=CUF[el.dataset.f];if(f)el.textContent=f(+el.dataset.v);});};
  requestAnimationFrame(step);
}
function revealBelow(main){
  if(!('IntersectionObserver' in window))return;
  const vh=innerHeight,els=[...main.children].filter(el=>el.getBoundingClientRect().top>vh*0.92);
  if(!els.length)return;
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('rvin');io.unobserve(en.target);}}),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  els.forEach(el=>{el.classList.add('rv');io.observe(el);});
  setTimeout(()=>{els.forEach(el=>el.classList.add('rvin'));io.disconnect();},4000);
}
function render(){
  greet();
  const sub=ui.tab==='money'?ui.money:ui.tab==='sport'?ui.sp+'|'+ui.tl:ui.tab==='plan'?ui.plan:ui.tab==='today'?ui.tl:'';
  const key=ui.tab+'|'+sub+'|'+R.active;
  const main=$('#main');
  main.innerHTML=V[ui.tab]();
  document.body.setAttribute('data-tab',ui.tab);
  const chg=key!==lastKey;
  main.className=chg?('enter'+(ui._dir>0?' fwd':ui._dir<0?' bck':'')):'';ui._dir=0;
  if(key!==lastKey){clearTimeout(_en);_en=setTimeout(()=>{main.className='';},1400);}
  if(chg){animateCounts();revealBelow(main);}
  lastKey=key;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.id===ui.tab));
  if(ui.tab==='money'&&ui.money==='immo')simUpdate();
  gLive();decorate();placePill();
}
const val=id=>{const e=$('#'+id);return e?e.value:'';};
function scrollTop(){window.scrollTo({top:0});}
function resetUi(){ui.open={};ui.draft=null;ui.sel=null;ui.pm=0;ui.edraft=null;ui.msg='';ui.hmsg='';ui.grp=null;ui.wd=null;}
const newEv=()=>({title:'',kind:'Perso',date:ui.sel||todayK(),end:'',time:'',dur:'',rep:'',sport:'course'});
const monthOff=k=>{const t=new Date(),d=new Date(k+'T12:00');return (d.getFullYear()-t.getFullYear())*12+d.getMonth()-t.getMonth();};
function afterProfile(){useProfile();resetUi();save();renderSheet();render();}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');
  if(!el)return;
  const a=el.dataset.act,id=el.dataset.id,k=el.dataset.k,td=todayK();
  if(a==='tap'){tap(e,el);return;}
  if(a==='tab'){e.preventDefault();const same=id===ui.tab;ui.scr=ui.scr||{};ui.scr[ui.tab]=scrollY;if(id==='money'&&same)ui.money='hub';ui.tl='';ui.tab=id;render();if(same)window.scrollTo({top:0,behavior:'smooth'});else window.scrollTo(0,ui.scr[id]||0);onScroll();return;}
  if(a==='money'){ui._dir=id==='hub'?-1:1;ui.money=id;ui.open.fi=false;ui.open.fp=false;render();scrollTop();return;}
  if(a==='bv'){ui.bv=id;render();return;}
  if(a==='gt'){ui.gt=id;refreshGame(true);return;}
  if(a==='qs'){ui.qs=id;refreshGame(false);return;}
  if(a==='fm'){ui.fm=id;refreshGame(false);return;}
  if(a==='gtarget'){S.goalT.target=+id;save();render();return;}
  if(a==='grate'){S.goalT.rate=null;save();render();return;}
  if(a==='sp'){ui.sp=id;if(id==='add'&&!ui.draft)ui.draft=newDraft();render();return;}
  if(a==='togglesum'){e.preventDefault();ui.open[id]=!ui.open[id];render();return;}
  if(a==='per'){ui.per=id;render();return;}
  if(a==='grp'){ui.grp=ui.grp===id?null:id;if(ui.grp==='Dos')ui.bv='b';else if(ui.grp==='Pectoraux'||ui.grp==='Abdos')ui.bv='f';render();return;}
  if(a==='gosport'){ui.tab='sport';ui.sp='add';ui.draft=newDraft();ui.open.tn=false;ui.msg='';render();scrollTop();return;}
  if(a==='gopl'){e.preventDefault();if(id){ui.sel=id;ui.pm=monthOff(id);}ui.tab='plan';ui.plan='month';render();scrollTop();return;}
  if(a==='toggle'){ui.open[id]=!ui.open[id];ui.msg='';if(id==='fe')ui.edraft=null;if(id==='goal'||id==='tn'||id==='fl'||id==='pf'){render();return;}render();return;}

  /* réglages */
  if(a==='settings'){ui.sheet=true;ui.msg='';renderSheet();return;}
  if(a==='closeset'){ui.sheet=false;ui.open.delp=false;ui.msg='';renderSheet();return;}
  if(a==='accent'){R.prefs.accent=id;applyPrefs();save();renderSheet();render();return;}
  if(a==='theme'){R.prefs.theme=id;applyPrefs();save();renderSheet();return;}
  if(a==='switchprof'){R.active=id;afterProfile();return;}
  if(a==='renprof'){const n=val('pr-name').trim();if(!n)return;R.profiles.find(p=>p.id===R.active).name=n;save();renderSheet();render();return;}
  if(a==='addprof'){const n=val('pr-new').trim();if(!n)return;const p={id:uid(),name:n,data:blank()};R.profiles.push(p);R.active=p.id;ui.tab='game';afterProfile();return;}
  if(a==='wipeprof'||a==='wipeall'){askConfirm(a);return;}
  if(a==='cfno'){closeConfirm();return;}
  if(a==='cfyes'){const k=ui.cf;if(!k)return;if(k==='wipeall'&&ui.cfstep!==2){ui.cfstep=2;renderConfirm();return;}closeConfirm();doWipe(k);return;}
  if(a==='delprof'){if(!ui.open.delp){ui.open.delp=true;renderSheet();return;}R.profiles=R.profiles.filter(p=>p.id!==R.active);R.active=R.profiles[0].id;afterProfile();return;}
  if(a==='backup'){saveFile('rythme-sauvegarde.json',JSON.stringify(R)).then(()=>{ui.msg='Copie enregistrée.';renderSheet();}).catch(er=>{ui.msg=er&&er.code==='declined'?'Enregistrement annulé.':'L\'enregistrement de fichiers n\'est pas disponible ici.';renderSheet();});return;}
  if(a==='restore'){const f=$('#rs-f')&&$('#rs-f').files[0];if(!f){ui.msg='Choisis d\'abord un fichier de sauvegarde.';renderSheet();return;}
    readText(f).then(t=>{const o=JSON.parse(t);if(!o.profiles||!o.profiles.length)throw new Error('x');R=o;R.prefs=Object.assign({accent:ACCENTS[0][1],theme:'auto'},R.prefs||{});if(!R.profiles.find(p=>p.id===R.active))R.active=R.profiles[0].id;applyPrefs();useProfile();resetUi();ui.msg='Données restaurées.';save();renderSheet();render();}).catch(()=>{ui.msg='Ce fichier n\'est pas une sauvegarde valide.';renderSheet();});return;}
  if(a==='hrimport'){
    const f=$('#hr-f')&&$('#hr-f').files[0];if(!f){ui.hmsg='Choisis d\'abord un fichier Excel.';renderSheet();return;}
    ui.hmsg='Lecture du fichier…';renderSheet();
    loadXLSX().then(X=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsArrayBuffer(f);}).then(buf=>{
      const wb=X.read(buf,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=X.utils.sheet_to_json(ws,{header:1,raw:true,defval:''});
      const r=importHours(rows);
      ui.hmsg=r.added?(r.added+' jour'+(r.added>1?'s':'')+' importé'+(r.added>1?'s':'')+' · '+fmtH(r.tot)+' au total'+(r.dup?', '+r.dup+' déjà pointé'+(r.dup>1?'s':''):'')+(r.bad?', '+r.bad+' ligne'+(r.bad>1?'s':'')+' illisible'+(r.bad>1?'s':''):'')+'.'+(r.cols?' Fichier '+r.cols+'.':'')):('Aucun jour importé'+(r.dup?' ('+r.dup+' déjà pointés)':'')+'. Vérifie les colonnes Date, Début et Fin.');
      if(r.added){save();}renderSheet();render();})).catch(()=>{ui.hmsg='Lecture impossible. Vérifie ta connexion et le format du fichier.';renderSheet();});return;}
  if(a==='svimport'){
    const f=$('#sv-f')&&$('#sv-f').files[0];if(!f){ui.msg='Choisis le fichier activities.csv.';renderSheet();return;}
    readText(f).then(t=>{const r=importStrava(t);
      if(r.err)ui.msg=r.err;
      else{ui.msg=r.added+' sortie'+(r.added>1?'s':'')+' importée'+(r.added>1?'s':'')+(r.dup?', '+r.dup+' déjà présente'+(r.dup>1?'s':''):'')+(r.skip?', '+r.skip+' ignorée'+(r.skip>1?'s':'')+' (autre sport ou trop courte)':'')+(r.bad?', '+r.bad+' avec une date illisible':'')+'.';save();}
      renderSheet();render();}).catch(()=>{ui.msg='Lecture du fichier impossible.';renderSheet();});return;}

  if(a==='totop'){window.scrollTo({top:0,behavior:'smooth'});return;}
  if(a==='rest'){restStart(+id);return;}
  if(a==='restx'){ui.rest=null;restTick();return;}
  if(a==='sharecard'){shareCard();return;}
  /* jeu */
  if(a==='skin'){const i=+id,g=G(),s=SKINS[i];
    if(!g.skins.includes(i)){if(g.pts<s.cost){toast('Il te faut '+s.cost+' étoiles');return;}g.pts-=s.cost;g.skins.push(i);}
    g.skin=i;saveSoon();refreshGame();return;}
  if(a==='claim'){const before=glevel().stage,n=claim(id);if(n){const after=glevel().stage;burst(e.clientX,e.clientY,26);toast('+'+n+' étoile'+(n>1?'s':''));
      if(after>before){setTimeout(()=>{burst(innerWidth/2,innerHeight/3,60);toast('Rythmo évolue : '+STAGES[after-1].n);},500);}
      refreshGame();}return;}
  if(a==='claimall'){const before=glevel().stage;let n=0;objectives().concat(goalMiles()).filter(o=>o.done&&!o.claimed).forEach(o=>{n+=claim(o.id);});
    if(n){const after=glevel().stage;burst(e.clientX,e.clientY,40);toast('+'+n+' étoiles');if(after>before)setTimeout(()=>{burst(innerWidth/2,innerHeight/3,60);toast('Rythmo évolue : '+STAGES[after-1].n);},600);refreshGame();}return;}
  if(a==='logw'){const w=num(val('gw-now'));if(!(w>20&&w<400))return;S.wlog=S.wlog||[];const l=S.wlog[S.wlog.length-1];if(l&&l.d===td)l.kg=w;else S.wlog.push({d:td,kg:w});if(S.profile)S.profile.weight=w;save();toast('Poids enregistré');refreshGame();return;}
  if(a==='chest'){const r=openChest();if(!r)return;
    const ci=$('.chimg');if(ci){ci.classList.add('pop');}
    burst(e.clientX,e.clientY,r.jack?70:34);toast((r.jack?'Jackpot ! ':'')+'+'+r.r+' étoiles · '+r.st+' jour'+(r.st>1?'s':''));setTimeout(()=>refreshGame(),600);return;}
  if(a==='claimboss'){const n=claimBoss();if(n){burst(e.clientX,e.clientY,60);toast('Boss vaincu · +'+n+' étoiles');refreshGame();}return;}
  if(a==='sprint'){startSprint();return;}
  if(a==='sprintagain'){startSprint();return;}
  if(a==='sprintx'){const o=$('#sprint');if(o){clearInterval(o._t);o.remove();}document.body.style.overflow=ui.sheet?'hidden':'';refreshGame();return;}
  if(a==='shop'){const it=SHOP.find(x=>x.id===id),g=G();if(!it)return;
    if(!g.own.includes(id)){if(g.pts<it.cost){toast('Il te faut '+it.cost+' étoiles');return;}g.pts-=it.cost;g.own.push(id);g.eq[it.slot]=id;burst(e.clientX,e.clientY,26);toast(it.n+' équipé');}
    else g.eq[it.slot]=g.eq[it.slot]===id?'':id;
    save();refreshGame();return;}
  if(a==='ngtype'){ui.ng=ui.ng||{type:'km',name:'',target:'',from:'',dl:''};ui.ng.type=id;refreshGame(false);return;}
  if(a==='addgoal'){const d=ui.ng;if(!d)return;const T=num(d.target);if(!(T>0)){toast('Indique un objectif');return;}
    const o={id:uid(),type:d.type,target:T,start:td};if(d.name.trim())o.name=d.name.trim();if(d.dl)o.dl=d.dl;
    if(d.type==='weight'){const f=num(d.from)||curWeight();if(!(f>0)){toast('Indique ton poids de départ');return;}o.from=f;}
    G().myg.push(o);ui.ng=null;ui.open.ng=false;save();toast('Objectif créé');refreshGame(false);return;}
  if(a==='delgoal'){G().myg=G().myg.filter(x=>x.id!==id);save();refreshGame(false);return;}
  if(a==='quickg'){const[t,v]=id.split(':'),T=+v,o={id:uid(),type:t,target:Math.abs(T),start:td};
    if(t==='weight'){const c=curWeight();if(!(c>0)){toast('Enregistre d\'abord ton poids dans Nutrition');return;}o.from=c;o.target=Math.round((c+T)*10)/10;}
    G().myg.push(o);save();toast('Objectif ajouté');refreshGame(false);return;}
  if(a==='dcastep'){S.dca=Math.max((S.dca||0)+(+id),0);save();render();return;}
  if(a==='tl'){ui.tl=id||'';ui._dir=id?1:-1;render();scrollTop();return;}

  /* pointage */
  if(a==='punch'){const rec=S.work.days[td]||(S.work.days[td]={}),ns=nextStep(rec);if(!ns)return;rec[ns[0]]=hhmm();save();toast(ns[1]+' à '+rec[ns[0]]);burst(e.clientX,e.clientY,ns[0]==='out'?30:14);render();return;}
  if(a==='nolunch'){const rec=S.work.days[td];if(!rec)return;const t=hhmm();rec.lo=t;rec.li=t;save();render();return;}
  if(a==='wsel'){ui.wd=id;render();return;}
  if(a==='wclear'){delete S.work.days[ui.wd||td];save();render();return;}

  if(a==='ciport'){const bl=blended();S.ci.init=S.proj.init||0;S.ci.monthly=S.dca||0;S.ci.rate=Math.round(bl.r*10)/10;S.ci.years=S.proj.years||20;save();render();return;}
  if(a==='rcneg'){ui.rc.neg=!ui.rc.neg;const o=$('#rcout');if(o)o.innerHTML=rcResult();return;}
  /* argent */
  if(a==='addline'){const n=val('l-n').trim(),w=num(val('l-w')),r=num(val('l-r'));if(!n||!(w>0))return;S.lines.push({id:uid(),name:n,cls:val('l-c'),pct:w,r:isNaN(r)?null:r});ui.open.fl=false;save();render();return;}
  if(a==='dell'){S.lines=S.lines.filter(x=>x.id!==id);save();render();return;}
  if(a==='norm'){const t=pctTot();if(t>0){S.lines.forEach(l=>{l.pct=Math.round((l.pct||0)/t*1000)/10;});save();render();}return;}
  if(a==='addsc'){const l=S.scen[S.scen.length-1];S.scen.push(Object.assign({},l,{id:uid(),name:'Scénario '+(S.scen.length+1)}));save();render();return;}
  if(a==='delsc'){if(S.scen.length>1){S.scen=S.scen.filter(x=>x.id!==id);save();render();}return;}
  if(a==='scmode'){const[sid,mode]=id.split(':');const s=S.scen.find(x=>x.id===sid);if(s){s.mode=mode;save();render();}return;}
  if(a==='addinc'){const m=val('i-m'),v=num(val('i-a')),s=val('i-s');if(!m||isNaN(v))return;
    const ex=S.incomes.find(i=>i.m===m&&i.source===s);if(ex)ex.amount=v;else S.incomes.push({id:uid(),m,amount:v,source:s});save();render();return;}
  if(a==='delinc'){S.incomes=S.incomes.filter(i=>i.id!==id);save();render();return;}
  if(a==='addsrc'){const n=val('src-n').trim();if(!n||S.sources.includes(n))return;S.sources.push(n);save();render();return;}
  if(a==='addpay'){
    const f=$('#p-f')&&$('#p-f').files[0],m=val('p-m'),s=val('p-s'),net=num(val('p-a'));
    if(!f){ui.msg='Choisis un fichier PDF.';render();return;}
    if(!m){ui.msg='Indique le mois.';render();return;}
    const pid=uid();
    idb.put(pid,f).then(()=>{
      S.pays.push({id:pid,m,source:s,net:isNaN(net)?0:net,name:f.name,size:f.size});
      if(!isNaN(net)){const ex=S.incomes.find(i=>i.m===m&&i.source===s);if(ex)ex.amount=net;else S.incomes.push({id:uid(),m,amount:net,source:s});}
      ui.msg='Fiche ajoutée.';save();render();
    }).catch(()=>{ui.msg='Le stockage de fichiers n\'est pas disponible dans ce navigateur.';render();});return;}
  if(a==='openpay'){const p=S.pays.find(x=>x.id===id);if(!p)return;
    idb.get(id).then(b=>{if(!b)throw new Error('x');return showPdf(b,p);}).catch(()=>{ui.msg='Impossible d\'ouvrir ce fichier ici.';render();});return;}
  if(a==='closepdf'){const o=$('#pdfv');if(o)o.remove();document.body.style.overflow=ui.sheet?'hidden':'';return;}
  if(a==='getpay'){const p=S.pays.find(x=>x.id===id);if(!p)return;
    idb.get(id).then(b=>{if(!b)throw new Error('x');return saveFile(p.name.toLowerCase().endsWith('.pdf')?p.name:p.name+'.pdf',b);}).then(()=>{ui.msg='Fiche enregistrée.';render();}).catch(er=>{ui.msg=er&&er.code==='declined'?'Enregistrement annulé.':'Impossible d\'enregistrer ce fichier ici.';render();});return;}
  if(a==='delpay'){idb.del(id).catch(()=>{});S.pays=S.pays.filter(x=>x.id!==id);save();render();return;}
  if(a==='savesim'){const p=S.sim,m=mortgage(p);S.sims.push({id:uid(),name:`${fmt(p.prix)} · ${p.taux} % · ${p.duree} ans`,mens:m.mens});save();render();return;}
  if(a==='delsim'){S.sims=S.sims.filter(x=>x.id!==id);save();render();return;}

  /* planning */
  if(a==='plsel'){e.preventDefault();ui.sel=id;ui.open.fe=false;ui.edraft=null;if(el.dataset.jump)ui.pm=monthOff(id);render();return;}
  if(a==='plm'){ui.pm=id==='0'?0:ui.pm+Number(id);render();return;}
  if(a==='newev'){ui.open.fe=true;ui.edraft=newEv();render();return;}
  if(a==='adde'){
    const d=ui.edraft;if(!d||!d.title.trim()||!d.date)return;
    const ev={id:uid(),title:d.title.trim(),kind:d.kind,date:d.date,time:d.time||'',dur:num(d.dur)||0,rep:d.rep||''};
    if(d.end&&d.end>d.date)ev.end=d.end;if(d.kind==='Sport')ev.sport=d.sport;
    S.events.push(ev);ui.sel=d.date;ui.pm=monthOff(d.date);ui.open.fe=false;ui.edraft=null;save();render();return;}
  if(a==='dele'){S.events=S.events.filter(x=>x.id!==id);save();render();return;}
  if(a==='evdone'){const ev=S.events.find(x=>x.id===id);if(!ev)return;
    ui.tab='sport';ui.sp='add';ui.draft=newDraft();ui.draft.type=ev.sport||'course';ui.draft.date=k||td;if(ev.dur)ui.draft.min=ev.dur;render();scrollTop();return;}

  /* nutrition */
  if(a==='saveprofile'){
    const age=num(val('p-a')),h=num(val('p-h')),w=num(val('p-w'));
    if(isNaN(age)||isNaN(h)||isNaN(w)||age<14||h<100||w<30)return;
    S.profile={sex:val('p-s'),age,height:h,weight:w,base:num(val('p-b')),goal:val('p-g')};
    S.wlog=S.wlog||[];const last=S.wlog[S.wlog.length-1];
    if(last&&last.d===td)last.kg=w;else if(!last||last.kg!==w)S.wlog.push({d:td,kg:w});
    ui.open.pf=false;save();render();return;}

  /* saisie */
  if(a==='dtype'){ui.draft.type=id;render();return;}
  if(a==='tpl'){applyTpl(id);render();return;}
  if(a==='deltpl'){S.templates=S.templates.filter(x=>x.id!==id);save();render();return;}
  if(a==='addex'){
    const name=val('ex-n').trim();if(!name)return;
    const lib=exLib();let group=lib[name];
    if(!group){group=val('ex-g');S.customEx.push({name,group});save();}
    const prev=lastSets(name);
    ui.draft.exs.push({name,group,prev,sets:prev?prev.map(t=>({kg:t.kg,reps:t.reps})):[{kg:'',reps:''}]});render();return;}
  if(a==='delex'){ui.draft.exs.splice(+id,1);render();return;}
  if(a==='addset'){const ex=ui.draft.exs[+id],l=ex.sets[ex.sets.length-1]||{kg:'',reps:''};ex.sets.push({kg:l.kg,reps:l.reps});render();return;}
  if(a==='delset'){const[i,j]=id.split(':').map(Number);const ex=ui.draft.exs[i];ex.sets.splice(j,1);if(!ex.sets.length)ui.draft.exs.splice(i,1);render();return;}
  if(a==='savetpl'){
    const n=val('tpl-n').trim(),d=ui.draft;if(!n){ui.msg='Donne un nom au modèle.';render();return;}
    const t={id:uid(),name:n,type:d.type};
    if(d.type==='muscu'){t.exs=d.exs.filter(x=>x.name).map(x=>[x.name,x.sets.length||3,num(x.sets[0]&&x.sets[0].reps)||10]);if(!t.exs.length){ui.msg='Ajoute au moins un exercice.';render();return;}}
    else{const m=num(d.min),di=num(d.dist);if(m>0)t.min=m;if(di>0)t.dist=di;if(d.type==='padel')t.fmt=d.fmt;if(!t.min&&!t.dist){ui.msg='Renseigne la durée ou la distance.';render();return;}}
    S.templates.push(t);ui.open.tn=false;ui.msg='';save();toast('Modèle ajouté');render();return;}
  if(a==='addw'){
    const d=ui.draft,t=d.type;let min=num(d.min);
    const w={id:uid(),date:d.date||td,type:t,rpe:num(d.rpe)||6};
    if(t==='muscu'){
      const exs=d.exs.map(x=>({name:x.name,group:x.group,sets:x.sets.map(y=>({kg:num(y.kg)||0,reps:num(y.reps)||0})).filter(y=>y.reps>0)})).filter(x=>x.sets.length);
      if(!exs.length){ui.msg='Ajoute au moins un exercice avec des répétitions.';render();return;}w.exs=exs;
      if(!(min>0))min=Math.round(sum(exs.map(x=>x.sets.length))*2.5+5);
    }else{
      if(!(min>0)){ui.msg='Indique la durée.';render();return;}
      if(t==='course'){const kk=num(d.dist);if(kk>0)w.dist=kk;}
      if(t==='padel')w.fmt=d.fmt;
      if(t==='bodyboard'){w.spot=d.spot;w.swell=d.swell;}
    }
    w.min=min;const prs=t==='muscu'?prCheck(w.exs):[];S.workouts.push(w);
    if(prs.length){const n=Math.min(prs.length,3)*3;G().pts+=n;G().life+=n;setTimeout(()=>{toast('🏆 Record · '+prs[0].name+' '+prs[0].kg+' kg × '+prs[0].reps+(prs.length>1?' (+'+(prs.length-1)+')':'')+' · +'+n+' ★');burst(innerWidth/2,innerHeight/3,34);},900);}
    evPlanned(w.date).filter(ev=>!ev.sport||ev.sport===t).forEach(ev=>{ev.done=ev.done||{};ev.done[w.date]=true;});
    ui.draft=null;ui.msg='';ui.sp='over';ui.open.tn=false;save();burst(e.clientX,e.clientY,26);toast('Séance enregistrée');render();scrollTop();return;}
  if(a==='delw'){S.workouts=S.workouts.filter(w=>w.id!==id);save();render();return;}
  if(a==='rcd'){ui.rc.d=String(id).replace('.',',');rcUpdate('d');return;}
  if(a==='rcclear'){ui.rc={d:'',t:'',p:'',v:'',order:[],neg:false};render();return;}
  if(a==='rcsave'){const f=rcFinal();if(!f)return;ui.tab='sport';ui.sp='add';ui.draft=newDraft();ui.draft.type='course';ui.draft.dist=Math.round(f.d*100)/100;ui.draft.min=Math.round(f.t*10)/10;render();scrollTop();return;}
});
const rcStr=(k,v)=>k==='d'?String(Math.round(v*100)/100).replace('.',','):k==='t'?fmtDur(v):fmtPace(v);
function rcUpdate(f){
  const r=ui.rc,key=f==='v'?'p':f;
  if(f==='v'){const v=num(r.v);r.p=v>0?fmtPace(60/v):'';}
  r.order=[key].concat(r.order.filter(x=>x!==key)).slice(0,2);
  const c=rcCompute();
  if(c.miss&&c.o[c.miss]!=null)r[c.miss]=rcStr(c.miss,c.o[c.miss]);
  const pm=parseDur(r.p);
  if(f!=='v')r.v=pm>0?String(Math.round(60/pm*100)/100).replace('.',','):'';
  ['d','t','p','v'].forEach(x=>{if(x!==f){const i=$('#rc-'+x);if(i&&i.value!==r[x])i.value=r[x];}});
  const o=$('#rcout');if(o)o.innerHTML=rcResult();
}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.rc){const f=t.dataset.rc;ui.rc[f]=t.value;rcUpdate(f);return;}
  if(t.dataset.evy){S.proj.years=+t.value;const l=$('#evy-l');if(l)l.textContent=S.proj.years+' an'+(S.proj.years>1?'s':'');evUpdate(false);saveSoon();return;}
  if(t.dataset.evi){S.proj.init=Math.max(num(t.value)||0,0);evUpdate(false);saveSoon();return;}
  if(t.dataset.dca&&ui.tab==='money'&&ui.money==='evol'){S.dca=Math.max(num(t.value)||0,0);evUpdate(false);saveSoon();return;}
  if(t.dataset.ci){const f=t.dataset.ci;if(f==='freq')return;const v=num(t.value);if(isNaN(v))return;S.ci[f]=v;
    document.querySelectorAll('[data-ci="'+f+'"]').forEach(x=>{if(x!==t)x.value=v;});ciUpdate();saveSoon();return;}
  if(t.dataset.gl){const f=t.dataset.gl,v=num(t.value);if(isNaN(v))return;S.goalT[f]=v;
    document.querySelectorAll('[data-gl="'+f+'"]').forEach(x=>{if(x!==t)x.value=v;});goalUpdate();saveSoon();return;}
  if(t.dataset.ng&&ui.ng){ui.ng[t.dataset.ng]=t.value;return;}
  if(t.dataset.sim){S.sim[t.dataset.sim]=num(t.value)||0;save();simUpdate();return;}
  if(t.dataset.e&&ui.edraft){ui.edraft[t.dataset.e]=t.value;return;}
  if(t.dataset.d&&ui.draft){ui.draft[t.dataset.d]=t.value;if(t.dataset.d==='rpe')render();return;}
  if(t.dataset.s&&ui.draft){const[i,j,k]=t.dataset.s.split(':');ui.draft.exs[+i].sets[+j][k]=t.value;}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.e&&ui.edraft){ui.edraft[t.dataset.e]=t.value;if(t.dataset.e==='kind')render();return;}
  if(t.dataset.d&&ui.draft){ui.draft[t.dataset.d]=t.value;if(t.dataset.d==='min'||t.dataset.d==='dist')render();return;}
  if(t.dataset.s&&ui.draft){render();return;}
  if(t.dataset.goal){S.goals[t.dataset.goal]=Math.max(num(t.value)||1,1);save();renderSheet();render();return;}
  if(t.dataset.wdate){ui.wd=t.value||null;render();return;}
  if(t.dataset.wt){const k=t.dataset.wd||ui.wd||todayK();const r=S.work.days[k]||(S.work.days[k]={});if(t.value)r[t.dataset.wt]=t.value;else delete r[t.dataset.wt];save();render();return;}
  if(t.dataset.wtarget){S.work.target=Math.max(num(t.value)||35,1);save();if(ui.sheet)renderSheet();render();return;}
  if(t.dataset.ci==='freq'){S.ci.freq=+t.value;ciUpdate();save();return;}
  if(t.dataset.dca){S.dca=Math.max(num(t.value)||0,0);save();render();return;}
  if(t.dataset.lp){const l=S.lines.find(x=>x.id===t.dataset.lp);if(l){l.pct=Math.max(num(t.value)||0,0);save();render();}return;}
  if(t.dataset.sc){const[sid,f]=t.dataset.sc.split(':'),s=S.scen.find(x=>x.id===sid);
    if(s){if(f==='name')s.name=t.value.trim()||s.name;else if(f==='tilt')s.tilt=+t.value;else if(f==='monthly')s.monthly=t.value===''?null:Math.max(num(t.value)||0,0);else s[f]=f==='years'?Math.min(Math.max(Math.round(num(t.value))||1,1),50):(num(t.value)||0);save();render();}return;}
  if(t.dataset.ret){S.ret[t.dataset.ret]=num(t.value)||0;save();render();return;}
  if(t.dataset.spr){S.spread[t.dataset.spr]=Math.max(num(t.value)||0,0);save();render();return;}
  if(t.dataset.pj){S.proj[t.dataset.pj]=num(t.value)||0;save();render();return;}
  if(t.dataset.fuel){ui.fuel[t.dataset.fuel]=Math.max(num(t.value)||0,0);render();return;}
});

/* ================= démarrage ================= */
render();
visInit();
(function boot(){
  setInterval(gLive,1000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
  window.addEventListener('pagehide',save);
})();

/* ondulation au toucher */
document.addEventListener('pointerdown',e=>{
  const t=e.target.closest&&e.target.closest('.btn,.chip,.toolrow,.tile,.mtile,.row[data-act],.claim,.buy,.iconbtn,.sitem');
  if(!t||t.disabled)return;
  const r=t.getBoundingClientRect(),d=Math.max(r.width,r.height)*2;
  if(getComputedStyle(t).position==='static')t.style.position='relative';
  t.classList.add('ripple-host');
  const s=document.createElement('span');s.className='rpl';
  s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
  t.appendChild(s);setTimeout(()=>s.remove(),700);
},{passive:true});
})();


/* ================= sport library ================= */
const LIB={'Développé couché':'Pectoraux','Développé incliné haltères':'Pectoraux','Écartés poulie':'Pectoraux','Pompes':'Pectoraux','Dips':'Pectoraux','Tractions':'Dos','Rowing barre':'Dos','Tirage vertical':'Dos','Tirage horizontal':'Dos','Soulevé de terre':'Dos','Squat':'Jambes','Presse à cuisses':'Jambes','Fentes':'Jambes','Leg curl':'Jambes','Leg extension':'Jambes','Soulevé de terre roumain':'Jambes','Hip thrust':'Jambes','Mollets debout':'Jambes','Développé militaire':'Épaules','Élévations latérales':'Épaules','Oiseau':'Épaules','Curl barre':'Bras','Curl haltères':'Bras','Extension triceps poulie':'Bras','Barre au front':'Bras','Gainage':'Abdos','Crunch':'Abdos','Relevé de jambes':'Abdos'};
const GROUPS=['Pectoraux','Dos','Jambes','Épaules','Bras','Abdos'];
const GCOL={Pectoraux:'#FF3B30',Dos:'#0A84FF',Jambes:'#FF9500',Épaules:'#FFCC00',Bras:'#AF52DE',Abdos:'#34C759',Autre:'#8E8E93'};
const TPL_M=[
  {n:'Push',d:'Pecs, épaules, triceps',x:[['Développé couché',4,8],['Développé incliné haltères',3,10],['Développé militaire',3,10],['Élévations latérales',3,15],['Extension triceps poulie',3,12]]},
  {n:'Pull',d:'Dos et biceps',x:[['Tractions',4,8],['Rowing barre',4,8],['Tirage horizontal',3,10],['Oiseau',3,15],['Curl barre',3,10]]},
  {n:'Legs',d:'Jambes complètes',x:[['Squat',4,6],['Presse à cuisses',3,10],['Soulevé de terre roumain',3,10],['Leg curl',3,12],['Mollets debout',4,15]]},
  {n:'Full body',d:'Tout le corps',x:[['Squat',3,8],['Développé couché',3,8],['Rowing barre',3,8],['Développé militaire',3,10],['Crunch',3,15]]}
];
const TPL_O=[
  {n:'Footing',t:'course',min:45,d:'45 min facile'},{n:'Sortie longue',t:'course',min:90,d:'90 min'},
  {n:'Fractionné',t:'course',min:40,d:'40 min'},{n:'Récup',t:'course',min:30,d:'30 min'},
  {n:'Match de padel',t:'padel',min:90,d:'90 min',fmt:'Match'},{n:'Entraînement padel',t:'padel',min:60,d:'60 min',fmt:'Entraînement'},
  {n:'Session bodyboard',t:'bodyboard',min:120,d:'2 h'}
];
const e1rm=(kg,r)=>r<=1?kg:kg*(1+Math.min(r,12)/30);
const exLib=()=>{const m=Object.assign({},LIB);(S.customEx||[]).forEach(x=>m[x.name]=x.group);return m;};
function exsOf(w){
  if(w.exs)return w.exs;
  if(w.exo)return [{name:w.exo,group:exLib()[w.exo]||'Autre',sets:Array.from({length:w.sets||1},()=>({kg:w.kg||0,reps:w.reps||0}))}];
  return [];
}
const setsOf=w=>sum(exsOf(w).map(e=>e.sets.length));
const volOf=w=>sum(exsOf(w).map(e=>sum(e.sets.map(t=>(t.kg||0)*(t.reps||0)))));
function lastSets(name){
  const ws=S.workouts.filter(w=>w.type==='muscu').sort((a,b)=>a.date<b.date?1:-1);
  for(const w of ws){const e=exsOf(w).find(x=>x.name.toLowerCase()===name.toLowerCase());if(e&&e.sets.length)return e.sets.map(t=>({kg:t.kg,reps:t.reps}));}
  return null;
}
const newDraft=()=>({date:todayK(),type:'muscu',min:'',rpe:6,dist:'',fmt:'Match',spot:'',swell:'Petite',exs:[],evid:null});
function exFromTpl(name,sets,reps){
  const lib=exLib(),prev=lastSets(name);
  return {name,group:lib[name]||'Autre',prev,sets:prev?prev.map(t=>({kg:t.kg,reps:t.reps})):Array.from({length:sets},()=>({kg:'',reps}))};
}


/* ================= Strava (import fichier) ================= */
function parseCSV(t){
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<t.length;i++){const c=t[i];
    if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}
    else if(c==='"')q=true;
    else if(c===','){row.push(f);f='';}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(f);f='';if(row.length>1||row[0]!=='')rows.push(row);row=[];}
    else f+=c;}
  if(f!==''||row.length){row.push(f);rows.push(row);}
  return rows;
}
const SV={run:'course','trail run':'course','virtual run':'course','weight training':'muscu',workout:'muscu',crossfit:'muscu',padel:'padel',surfing:'bodyboard'};
function importStrava(text){
  const rows=parseCSV(text);if(rows.length<2)return {err:'Fichier vide ou illisible.'};
  const h=rows[0].map(x=>x.trim().toLowerCase());
  const col=n=>h.indexOf(n);
  const iId=col('activity id'),iD=col('activity date'),iT=col('activity type'),iDist=col('distance'),iMv=col('moving time'),iEl=col('elapsed time');
  if(iD<0||iT<0)return {err:'Colonnes « Activity Date » et « Activity Type » introuvables. L\'export doit être en anglais.'};
  const have=new Set(S.workouts.map(w=>w.sid).filter(Boolean));
  let added=0,dup=0,skip=0,bad=0;
  rows.slice(1).forEach(r=>{
    const type=SV[(r[iT]||'').trim().toLowerCase()];if(!type){skip++;return;}
    const sid=iId>=0?String(r[iId]).trim():'';if(sid&&have.has(sid)){dup++;return;}
    const dt=new Date(r[iD]);if(isNaN(dt)){bad++;return;}
    const sec=num(iMv>=0&&r[iMv]?r[iMv]:r[iEl]);if(!(sec>=180)){skip++;return;}
    const w={id:uid(),date:dkey(dt),type,rpe:6,min:Math.round(sec/60),src:'strava',sid:sid||undefined};
    if(type==='course'){let k=num(iDist>=0?r[iDist]:'');if(k>200)k=k/1000;if(k>0)w.dist=Math.round(k*100)/100;}
    S.workouts.push(w);if(sid)have.add(sid);added++;
  });
  S.imported=(S.imported||0)+added;
  return {added,dup,skip,bad};
}

/* ================= import Excel : heures travaillées ================= */
function importHours(rows,opt){
  opt=opt||{};
  const sv=v=>v==null?'':String(v).trim();
  let hi=-1;
  for(let i=0;i<Math.min(20,rows.length);i++){if((rows[i]||[]).some(c=>/^date\b/i.test(sv(c)))){hi=i;break;}}
  if(hi<0)for(let i=0;i<Math.min(20,rows.length);i++){if((rows[i]||[]).some(c=>/^(jour|day)s?$/i.test(sv(c)))){hi=i;break;}}
  const h=hi>=0?rows[hi].map(x=>sv(x).toLowerCase()):[];
  const find=(re,not)=>h.findIndex((x,i)=>re.test(x)&&!(not||[]).includes(i));
  const iD=hi>=0?(h.findIndex(x=>/^date\b/.test(x))>=0?h.findIndex(x=>/^date\b/.test(x)):find(/date|jour/)):0;
  const iLo=hi>=0?find(/(d[ée]but|d[ée]part|sortie).*(pause|d[ée]j|midi)|(pause|d[ée]j|midi).*(d[ée]but|d[ée]part|sortie)/):-1;
  const iLi=hi>=0?find(/(fin|retour|reprise).*(pause|d[ée]j|midi)|(pause|d[ée]j|midi).*(fin|retour|reprise)/):-1;
  const pz=[iLo,iLi];
  const iPz=hi>=0?find(/pause|d[ée]j|midi/,pz):-1;
  const used=[iD,iLo,iLi,iPz];
  const iIn=hi>=0?find(/d[ée]but|arriv|entr[ée]e|start|^in$|embauche|prise|matin/,used):1;
  const iOut=hi>=0?find(/^fin|\bfin\b|d[ée]part|sortie|end|^out$|d[ée]bauche|soir/,used.concat([iIn])):2;
  const iDur=hi>=0?find(/heure|dur[ée]e|total|hours|travaill|temps/,used.concat([iIn,iOut])):-1;
  const pDate=v=>{
    if(v instanceof Date&&!isNaN(v))return dkey(v);
    if(typeof v==='number'&&v>20000&&v<80000){if(opt.d1904)v+=1462;const d=new Date(Math.round((v-25569)*86400000));return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());}
    const s=sv(v);let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(m)return m[1]+'-'+pad(+m[2])+'-'+pad(+m[3]);
    m=s.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
    if(m){let y=+m[3];if(y<100)y+=2000;const d=+m[1],mo=+m[2];if(mo<1||mo>12||d<1||d>31)return null;return y+'-'+pad(mo)+'-'+pad(d);}
    m=s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);if(m)return m[1]+'-'+pad(+m[2])+'-'+pad(+m[3]);
    return null;};
  const pTime=v=>{
    if(typeof v==='number'){if(v>=0&&v<1)return Math.round(v*1440);return NaN;}
    if(v instanceof Date&&!isNaN(v))return v.getUTCHours()*60+v.getUTCMinutes();
    const s=sv(v).toLowerCase();let m=s.match(/^(\d{1,2})\s*[:h]\s*(\d{2})?/);
    if(m){const a=+m[1]*60+(m[2]?+m[2]:0);return a<1440?a:NaN;}
    return NaN;};
  const pDur=(v,pause)=>{
    if(typeof v==='number'){if(v<=0)return 0;if(v<1)return Math.round(v*1440);return pause?Math.round(v):Math.round(v<=24?v*60:v);}
    const t=pTime(v);if(!isNaN(t))return t;
    const n=num(sv(v));if(isNaN(n)||n<=0)return 0;return pause?Math.round(n):Math.round(n<=24?n*60:n);};
  const hm=m=>pad(Math.floor(m/60))+':'+pad(m%60);
  let added=0,dup=0,bad=0,tot=0,off=0;const batch={};
  rows.slice(hi+1).forEach(r=>{
    if(!r||!r.length)return;
    const k=pDate(r[iD]);if(!k){if(r.some(c=>(typeof c==='number'&&c>0&&c<1)||/^\d{1,2}\s*[:h]\s*\d{2}$/.test(sv(c))))bad++;return;}
    let rec=null;
    if(iIn>=0&&/^x$/i.test(sv(r[iIn]))){off++;return;}
    const a=iIn>=0?pTime(r[iIn]):NaN,b=iOut>=0?pTime(r[iOut]):NaN;
    if(!isNaN(a)&&isNaN(b)&&k===todayK()){const lo=iLo>=0?pTime(r[iLo]):NaN,li=iLi>=0?pTime(r[iLi]):NaN;rec={in:hm(a)};if(!isNaN(lo))rec.lo=hm(lo);if(!isNaN(li))rec.li=hm(li);batch[k]=rec;return;}
    if(isNaN(a)&&isNaN(b)&&(iDur<0||!(pDur(r[iDur],false)>0)))return;
    if(!isNaN(a)&&!isNaN(b)&&b>a){
      rec={in:hm(a),out:hm(b)};
      const lo=iLo>=0?pTime(r[iLo]):NaN,li=iLi>=0?pTime(r[iLi]):NaN;
      if(!isNaN(lo)&&!isNaN(li)&&li>lo&&lo>a&&li<b){rec.lo=hm(lo);rec.li=hm(li);}
      else{const p=iPz>=0?pDur(r[iPz],true):0;
        if(p>0&&p<b-a){const s0=Math.round((a+b)/2-p/2);rec.lo=hm(s0);rec.li=hm(s0+p);}}
    }else if(iDur>=0){
      const d=pDur(r[iDur],false);
      if(d>0&&d<900){const p=iPz>=0?pDur(r[iPz],true):0;const net=Math.max(d-p,1);
        if(batch[k]&&batch[k].syn){const t=tmin(batch[k].out)+net;if(t<1440){batch[k].out=hm(t);}return;}
        rec={in:'09:00',out:hm(540+net),syn:1};}
    }
    if(!rec){bad++;return;}
    batch[k]=rec;
  });
  Object.keys(batch).forEach(k=>{
    const ex=S.work.days[k];
    if(ex&&ex.in&&ex.out){dup++;return;}
    const rec=batch[k];delete rec.syn;
    S.work.days[k]=rec;added++;tot+=workMin(rec,false);
  });
  return {added,dup,bad,tot,off,cols:hi>=0?'':'sans en-têtes (colonnes : date, début, fin, pause)'};
}

/* ================= fichiers locaux (fiches de paie) ================= */
const idb={
  open(){return new Promise((res,rej)=>{try{const r=indexedDB.open('rythme_files',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});},
  async put(k,b){const d=await this.open();return new Promise((res,rej)=>{const t=d.transaction('f','readwrite');t.objectStore('f').put(b,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);});},
  async get(k){const d=await this.open();return new Promise((res,rej)=>{const t=d.transaction('f').objectStore('f').get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);});},
  async del(k){const d=await this.open();return new Promise((res,rej)=>{const t=d.transaction('f','readwrite');t.objectStore('f').delete(k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);});}
};

/* ================= nutrition adaptative ================= */
const JOB={1.2:'Assis, bureau',1.375:'Debout, mobile',1.55:'Physique'};
const MET={course:10,muscu:5,padel:6.5,bodyboard:5};
function dayCtx(k){
  const ev=evOn(k),sp=ev.filter(e=>e.kind==='Sport'&&!e.end);
  const planMin=sum(sp.map(e=>e.dur||0)),doneMin=sum(wOn(k).map(w=>w.min));
  const min=Math.max(planMin,doneMin);
  const wr=S.work.days[k];
  const work=ev.some(e=>e.kind==='Boulot')||!!(wr&&wr.in);
  const trip=ev.some(e=>e.kind==='Voyage');
  const relax=ev.some(e=>e.kind==='Détente');
  const kc=sum(sp.map(e=>(MET[e.sport||'course']||6)*weight()*((e.dur||0)/60)));
  const kcDone=sum(wOn(k).map(kcal));
  const id=min<=0?0:min<45?1:min<=90?2:3;
  const names=['Repos','Effort léger','Effort modéré','Gros effort'];
  const cols=['#8E8E93','#34C759','#FF9500','#FF3B30'];
  return {k,min,id,name:names[id],col:cols[id],work,trip,relax,kc:Math.max(kc,kcDone),sports:sp};
}
const CARB=[[3,5],[3,5],[5,7],[6,10]];
function nutriDay(k){
  const p=S.profile;if(!p)return null;
  const c=dayCtx(k),w=p.weight,h=c.min/60;
  const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='h'?5:-161);
  let base=bmr*p.base;
  if(c.trip)base*=1.04;
  const adj={perte:0.85,maintien:1,prise:1.10}[p.goal]||1;
  const kc=(base+c.kc)*adj;
  const [cl,ch]=CARB[c.id];
  const carbs=Math.round(w*(cl+ch)/2*(p.goal==='perte'?0.9:1));
  const prot=Math.round(w*(p.goal==='perte'?1.9:p.goal==='prise'?1.8:1.6));
  const fat=Math.max(Math.round((kc-carbs*4-prot*4)/9),Math.round(w*0.8));
  const water=0.033*w+0.6*h+(c.trip?0.3:0);
  return {c,bmr,kc,carbs,carbLo:Math.round(w*cl),carbHi:Math.round(w*ch),prot,protLo:Math.round(w*1.4),protHi:Math.round(w*2),fat,water,
    pre:c.id>=2?'Repas riche en glucides et léger en fibres 2 à 4 h avant.':c.id===1?'Une collation légère si tu as faim, sinon rien de spécial.':'Rien de spécial, répartis les protéines sur 3 à 4 repas.',
    during:c.min<45?'Eau seule.':c.min<=150?'30 à 60 g de glucides par heure et de l\'eau.':'60 à 90 g de glucides par heure, à tester avant une compétition.',
    after:c.id>=2?'Glucides et protéines dans les 2 heures, 1 g/kg de glucides si une autre séance suit vite.':c.id===1?'Un repas normal avec des protéines.':'Garde des repas équilibrés, la récupération se fait aussi au repos.'};
}
const INFO=[
  {t:'Protéines',b:'Les sportifs visent en général 1,4 à 2,0 g par kilo et par jour, répartis sur 3 à 5 repas.'},
  {t:'Glucides selon l\'effort',b:'3 à 5 g/kg les jours calmes, 5 à 7 g/kg autour d\'une heure d\'effort, 6 à 10 g/kg pour 1 à 3 heures.'},
  {t:'Hydratation',b:'Environ 30 à 35 ml par kilo et par jour, plus 400 à 800 ml par heure d\'effort selon la chaleur. Des urines jaune pâle sont un bon repère.'},
  {t:'Sommeil',b:'7 à 9 heures par nuit pour récupérer. Après un gros effort, c\'est souvent le levier le plus rentable.'}
];
const SUPPL='Créatine monohydrate : 3 à 5 g par jour en continu, le complément le plus étudié pour la force. Caféine : 3 à 6 mg/kg environ une heure avant l\'effort, selon ta tolérance. Vitamine D, magnésium, oméga-3 : fais un dosage et demande l\'avis d\'un médecin avant de supplémenter.';

/* ================= course : calcul ================= */
function parseDur(s){
  s=String(s||'').trim().replace(',','.');if(!s)return NaN;
  const p=s.split(':').map(Number);if(p.some(x=>!isFinite(x)||x<0))return NaN;
  if(p.length===1)return p[0];
  if(p.length===2)return p[0]+p[1]/60;
  return p[0]*60+p[1]+p[2]/60;
}
function fmtDur(m){
  if(!isFinite(m)||m<=0)return '';
  let s=Math.round(m*60);const h=Math.floor(s/3600);s-=h*3600;const mi=Math.floor(s/60);s-=mi*60;
  return h>0?`${h}:${pad(mi)}:${pad(s)}`:`${mi}:${pad(s)}`;
}
function fmtPace(m){if(!isFinite(m)||m<=0)return '';let a=Math.floor(m),b=Math.round((m-a)*60);if(b===60){a++;b=0;}return a+':'+pad(b);}
function rcCompute(){
  const r=ui.rc,known=r.order.slice(0,2);
  if(known.length<2)return {};
  const d=num(r.d),t=parseDur(r.t),p=parseDur(r.p),o={};
  const miss=['d','t','p'].find(x=>!known.includes(x));
  if(miss==='d'&&t>0&&p>0)o.d=t/p;
  if(miss==='t'&&d>0&&p>0)o.t=d*p;
  if(miss==='p'&&d>0&&t>0)o.p=t/d;
  return {miss,o};
}

/* ================= pointage ================= */
const PSTEPS=[['in','Arrivée'],['lo','Pause déj.'],['li','Retour'],['out','Départ']];
function workMin(rec,live){
  if(!rec||!rec.in)return 0;
  const a=tmin(rec.in);let end=null,lunch=0;
  if(rec.out)end=tmin(rec.out);
  else if(live){const n=new Date();end=n.getHours()*60+n.getMinutes();}
  if(rec.lo&&rec.li)lunch=Math.max(tmin(rec.li)-tmin(rec.lo),0);
  else if(rec.lo&&!rec.li&&!rec.out){end=tmin(rec.lo);}
  if(end==null)return 0;
  return Math.max(end-a-lunch,0);
}
const workDay=k=>workMin(S.work.days[k],k===todayK());
const workWeek=ws=>sum([0,1,2,3,4,5,6].map(i=>workDay(addD(ws,i))));
function nextStep(rec){rec=rec||{};return PSTEPS.find(s=>!rec[s[0]]);}

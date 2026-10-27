
/* ================= effets ================= */
const STAR='<svg class="st" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>';
const COIN='<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="#FFD60A"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#C99700" stroke-width="1.6"/></svg>';
const CONF=['#E9D8A6','#C9A227','#D9D9DE','#8E8E93','#FFFFFF'];
function burst(x,y,n=22){n=Math.ceil(n*.45);
  const fx=$('#fx');if(!fx)return;
  if(x==null){x=innerWidth/2;y=innerHeight/2;}
  for(let i=0;i<n;i++){
    const p=document.createElement('i');p.className='pc';
    const a=Math.random()*Math.PI*2,d=60+Math.random()*130;
    p.style.cssText=`left:${x}px;top:${y}px;background:${CONF[i%CONF.length]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-40}px;--rot:${Math.random()*540-270}deg`;
    fx.appendChild(p);setTimeout(()=>p.remove(),1000);
  }
}
function toast(msg){
  const fx=$('#fx');if(!fx)return;
  const t=document.createElement('div');t.className='toast';t.textContent=msg;fx.appendChild(t);setTimeout(()=>t.remove(),2700);
}
let _st=null;
const saveSoon=()=>{if(_st)return;_st=setTimeout(()=>{_st=null;save();},1500);};


/* ================= jeu : évolution longue ================= */
const G=()=>S.game;
const TH=[0,50,200,500,900,1400,2000,2700];
const STAGES=[
  {n:'Initié',d:'Le début du rythme',sky:['#121318','#16181F','#1B1D26','#20222C']},
  {n:'Apprenti',d:'Les bases sont posées',sky:['#10161C','#142029','#182A35','#1C3340']},
  {n:'Régulier',d:'La constance s\'installe',sky:['#0F1713','#13221B','#173024','#1B3B2C']},
  {n:'Confirmé',d:'Le corps suit',sky:['#1A1210','#261915','#33211B','#402820']},
  {n:'Athlète',d:'Discipline acquise',sky:['#14111C','#1D1729','#271E38','#302446']},
  {n:'Expert',d:'Au-dessus du lot',sky:['#0E1420','#122033','#162B46','#1A3558']},
  {n:'Élite',d:'Une constance rare',sky:['#1A160E','#271F12','#352A16','#43341A']},
  {n:'Légende',d:'Le sommet',sky:['#0B0B10','#15132A','#211B45','#2C2260']}
];
const SKINS=[
  {n:'Jade',c:'#8FDCBC',c2:'#1F8A63',cost:0},{n:'Glacier',c:'#B5DCF5',c2:'#2F6FB0',cost:40},
  {n:'Ambre',c:'#F3CF8E',c2:'#B7741F',cost:90},{n:'Améthyste',c:'#D2C0F7',c2:'#6E4BC8',cost:160},
  {n:'Or',c:'#F1DE9E',c2:'#A8801E',cost:300},{n:'Aurore',c:'#A8EEE2',c2:'#7A5CE0',cost:500}
];
/* boutique : accessoires et décors */

/* ---- icônes au trait (remplacent les emojis) ---- */
const ICP={cal:'M4 6.5h16v13H4zM4 10h16M8.5 4v4M15.5 4v4',gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8',
 run:'M14.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 20l3-5 3 2 2-5-3-2-3 1M12 16l1 4M15 11l3 2',medal:'M8 3l4 6 4-6M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
 dumb:'M3 12h2M19 12h2M6 8v8M18 8v8M8 10v4M16 10v4M8 12h8',target:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12.01V12',
 flame:'M12 21c-3.9 0-6.5-2.6-6.5-6 0-3.5 3-5.5 3.5-9 2 1.5 3 3 3 5 1-1 1.5-2 1.5-3 2.5 2 4.5 4.3 4.5 7 0 3.4-2.6 6-6 6z',
 star:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',up:'M12 19V5M6 11l6-6 6 6',shield:'M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z',
 bolt:'M13 2L4 14h7l-1 8 9-12h-7z',gift:'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z',
 bag:'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',trophy:'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M10 17h4',
 clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',scale:'M5 20h14M12 4v16M6 8h12M6 8l-3 6h6zM18 8l-3 6h6z',euro:'M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10h9M4 14h9',
 step:'M4 17c0-3 1-8 3-9l2.5 3c2 1.2 4.5 1.3 7 2.2 2 .7 3.5 1.8 3.5 3.8zM4 20h16',sofa:'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11h18v6H3zM5 17v2M19 17v2',
 moon:'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',fork:'M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 0-3 3-3 6s1 4 3 4v8',alarm:'M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 9v4l2 2M5 4L3 6M19 4l2 2',
 check:'M5 12l5 5 9-10',warn:'M12 3l10 18H2zM12 10v5M12 18v.01',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',x:'M6 6l12 12M18 6L6 18'};
const IC=(k,s=18)=>`<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path d="${ICP[k]||ICP.star}"/></svg>`;
const SHOP=[
  {id:'cap',slot:'head',n:'Anneau',cost:60},{id:'beanie',slot:'head',n:'Double anneau',cost:80},{id:'party',slot:'head',n:'Orbite',cost:110},
  {id:'horns',slot:'head',n:'Boussole',cost:140},{id:'halo',slot:'head',n:'Halo',cost:220},
  {id:'glasses',slot:'face',n:'Grille',cost:70},{id:'shades',slot:'face',n:'Rayons',cost:100},{id:'stache',slot:'face',n:'Facettes',cost:120},
  {id:'mountain',slot:'bg',n:'Ardoise',cost:150,sky:['#16191F','#1E232B','#272D37','#303844']},
  {id:'beach',slot:'bg',n:'Lagon',cost:200,sky:['#0B1A1E','#0F2A30','#133A42','#174A54']},
  {id:'space',slot:'bg',n:'Minuit',cost:300,sky:['#05060C','#0B0D1C','#12142C','#191B3C']},
  {id:'city',slot:'bg',n:'Bordeaux',cost:400,sky:['#140B0E','#211015','#2F151D','#3D1A25']}
];
const SLOTS=[['head','Contours'],['face','Motifs'],['bg','Fonds']];
const SAYS=['Constance','Discipline','Un jour après l\'autre','Respire','Avance','Concentration'];
function glevel(){
  const life=G().life,n=TH.length;let s=1;while(s<n&&life>=TH[s])s++;
  let a,b,l;
  if(s<n){const a0=TH[s-1],b0=TH[s],step=(b0-a0)/5,k=Math.min(4,Math.floor((life-a0)/step));a=a0+k*step;b=a+step;l=(s-1)*5+k+1;}
  else{const step=350,k=Math.floor((life-TH[n-1])/step);a=TH[n-1]+k*step;b=a+step;l=(n-1)*5+k+1;}
  a=Math.round(a);b=Math.round(b);
  return {l,a,b,p:Math.min(Math.max((life-a)/(b-a),0),1),stage:s,toNext:s<n?TH[s]-life:0};
}
const curWeight=()=>{const w=(S.wlog||[]).slice(-1)[0];return w?w.kg:(S.profile?S.profile.weight:0);};
function moodNow(){
  const ds=S.workouts.map(w=>w.date).sort(),last=ds[ds.length-1];
  if(!last)return 'happy';
  const n=Math.round((new Date(todayK()+'T12:00')-new Date(last+'T12:00'))/864e5);
  return n>=3?'sleepy':'happy';
}

/* ---- quêtes ---- */
function objectives(){
  const td=todayK(),ws=wk(td),mk=td.slice(0,7),g=G(),out=[];
  const add=(scope,key,t,s,pts,p)=>{const id=scope+':'+(scope==='d'?td:scope==='w'?ws:mk)+':'+key;out.push({id,scope,t,s,pts,p:Math.min(Math.max(p,0),1),done:p>=1,claimed:!!g.claimed[id]});};
  const m=sum(wOn(td).map(w=>w.min)),gm=S.goals.dayMin;
  add('d','move','Bouger 20 min',m+' min',3,m/20);
  add('d','goal','Objectif du jour',m+' / '+gm+' min',5,m/gm);
  const pl=evPlanned(td);
  if(pl.length){const d=pl.filter(e=>e.done&&e.done[td]).length;add('d','plan','Tenir le planning',d+' / '+pl.length,4,d/pl.length);}
  const wr=S.work.days[td];
  if(dayCtx(td).work)add('d','work','Pointer ta journée',wr&&wr.out?'Complète':wr&&wr.in?'Il reste le départ':'Pas pointé',2,wr&&wr.out?1:wr&&wr.in?.5:0);
  const q=(sc,key,t,v,tg,pts,u)=>add(sc,key,t,fmtN(v,u?1:0)+' / '+tg+(u||''),pts,v/tg);
  const days=[0,1,2,3,4,5,6].map(i=>addD(ws,i)),w=inDays(days);
  const act=new Set(w.map(x=>x.date)).size,km=sum(w.filter(x=>x.type==='course').map(x=>x.dist||0));
  const mu=w.filter(x=>x.type==='muscu').length,kinds=new Set(w.map(x=>x.type)).size;
  q('w','s',S.goals.weekSessions+' séances',w.length,S.goals.weekSessions,15);
  q('w','k','Courir 20 km',km,20,12,' km');
  q('w','m','3 séances de muscu',mu,3,10);
  q('w','v','3 sports différents',kinds,3,8);
  q('w','a','5 jours actifs',act,5,12);
  const mw=S.workouts.filter(x=>x.date.slice(0,7)===mk),ma=new Set(mw.map(x=>x.date)).size,mkm=sum(mw.filter(x=>x.type==='course').map(x=>x.dist||0));
  q('m','s','12 séances',mw.length,12,60);
  q('m','k','Courir 60 km',mkm,60,60,' km');
  q('m','a','18 jours actifs',ma,18,70);
  return out;
}

/* ---- mes objectifs ---- */
const MILE=[[.25,10],[.5,20],[.75,30],[1,60]];
const GTYPES={
  weight:{l:'Poids',u:'kg',ph:'72',e:'scale'},km:{l:'Distance',u:'km',ph:'100',e:'run'},sess:{l:'Séances',u:'séances',ph:'20',e:'dumb'},
  hours:{l:'Heures',u:'h',ph:'30',e:'clock'},streak:{l:'Série',u:'jours',ph:'14',e:'flame'},save:{l:'Épargne',u:'€ / mois',ph:'300',e:'euro'}
};
function goalProg(o){
  const st=o.start||'0000',T=+o.target||0;let cur=0,p=0,lab='';
  if(o.type==='weight'){cur=curWeight();const a=+o.from;p=(a&&T&&cur&&a!==T)?(a-cur)/(a-T):0;lab=`${fmtN(cur,1)} kg · cible ${fmtN(T,1)}`;}
  else if(o.type==='km'){cur=sum(S.workouts.filter(w=>w.type==='course'&&w.date>=st).map(w=>w.dist||0));p=T>0?cur/T:0;lab=`${fmtN(cur,1)} / ${fmtN(T,0)} km`;}
  else if(o.type==='sess'){cur=S.workouts.filter(w=>w.date>=st).length;p=T>0?cur/T:0;lab=`${cur} / ${fmtN(T)} séances`;}
  else if(o.type==='hours'){cur=sum(S.workouts.filter(w=>w.date>=st).map(w=>w.min))/60;p=T>0?cur/T:0;lab=`${fmtN(cur,1)} / ${fmtN(T)} h`;}
  else if(o.type==='streak'){o.max=Math.max(o.max||0,streak());cur=o.max;p=T>0?cur/T:0;lab=`${cur} / ${fmtN(T)} jours`;}
  else if(o.type==='save'){cur=S.dca||0;p=T>0?cur/T:0;lab=`${fmt(cur)} / ${fmt(T)} par mois`;}
  p=Math.min(Math.max(p,0),1);
  let left='';
  if(o.dl){const n=Math.round((new Date(o.dl+'T12:00')-new Date(todayK()+'T12:00'))/864e5);left=p>=1?'':n<0?'Échéance dépassée':n===0?'Dernier jour':n+' j restants';}
  return {p,lab,left,cur};
}
function goalMiles(){
  const out=[];
  (G().myg||[]).forEach(o=>{const p=goalProg(o).p;
    MILE.forEach(([f,pts])=>{const id='og:'+o.id+':'+Math.round(f*100);out.push({id,gid:o.id,f,pts,done:p>=f-1e-9,claimed:!!G().claimed[id]});});});
  return out;
}
function claim(id){
  const g=G(),it=objectives().concat(goalMiles()).find(o=>o.id===id);
  if(!it||!it.done||it.claimed)return 0;
  g.claimed[id]=1;g.pts+=it.pts;g.life+=it.pts;saveSoon();return it.pts;
}
const gName=o=>o.name||({weight:'Poids visé',km:'Courir '+fmtN(o.target,0)+' km',sess:fmtN(o.target)+' séances',hours:fmtN(o.target)+' h de sport',streak:'Série de '+fmtN(o.target)+' jours',save:'Épargner '+fmt(o.target)+' / mois'})[o.type];

/* ---- coffre du jour ---- */
function chestInfo(){
  const c=G().chest,td=todayK(),can=c.last!==td;
  const st=c.last===td?c.streak:(c.last===addD(td,-1)?c.streak:0);
  return {can,st,dots:st>0&&st%7===0?7:st%7};
}
function openChest(){
  const g=G(),c=g.chest,td=todayK();if(c.last===td)return null;
  const st=c.last===addD(td,-1)?c.streak+1:1;c.last=td;c.streak=st;c.best=Math.max(c.best||0,st);
  let r=3+Math.min(st,7)+Math.floor(Math.random()*4);const jack=st%7===0;if(jack)r+=20;
  g.pts+=r;g.life+=r;saveSoon();return {r,st,jack};
}

/* ---- boss de la semaine ---- */
const BOSSES=[{n:'Inertie',e:'sofa',c:'#C9A27A',c2:'#7A5A3A'},{n:'Fatigue',e:'moon',c:'#9AA6FF',c2:'#4250B8'},{n:'Excès',e:'fork',c:'#F0A35A',c2:'#A0521A'},{n:'Procrastination',e:'alarm',c:'#F07A6A',c2:'#9A2A1F'}];
function bossInfo(){
  const td=todayK(),ws=wk(td),days=[0,1,2,3,4,5,6].map(i=>addD(ws,i));
  const idx=Math.floor(new Date(ws+'T12:00')/6048e5)%4,b=BOSSES[idx];
  const H=Math.max(60,S.goals.weekSessions*S.goals.dayMin),dmg=Math.min(sum(inDays(days).map(w=>w.min)),H);
  const id='b:'+ws,dead=dmg>=H,left=Math.max(7-((new Date(td+'T12:00').getDay()+6)%7),1);
  return {b,idx,H,dmg,hp:1-dmg/H,dead,id,claimed:!!G().claimed[id],left};
}
function claimBoss(){const g=G(),bi=bossInfo();if(!bi.dead||bi.claimed)return 0;g.claimed[bi.id]=1;g.pts+=40;g.life+=40;saveSoon();return 40;}

/* ---- succès ---- */
function gstats(){
  const w=S.workouts,L=glevel(),g=G();
  return {ses:w.length,km:sum(w.filter(x=>x.type==='course').map(x=>x.dist||0)),mu:w.filter(x=>x.type==='muscu').length,kinds:new Set(w.map(x=>x.type)).size,ms:maxStreak(),lvl:L.l,stage:L.stage,
    boss:Object.keys(g.claimed).some(k=>k.indexOf('b:')===0),chest:g.chest.best||0,own:g.own.length,wd:Object.keys(S.work.days).length,goal:Object.keys(g.claimed).some(k=>k.indexOf('og:')===0&&/:100$/.test(k))};
}
const BADGES=[
  {id:'first',e:'step',n:'Premier pas',r:5,ok:s=>s.ses>=1},{id:'s10',e:'cal',n:'Régulier',r:10,ok:s=>s.ses>=10},{id:'s50',e:'gear',n:'Machine',r:40,ok:s=>s.ses>=50},
  {id:'km50',e:'run',n:'Coureur',r:15,ok:s=>s.km>=50},{id:'km200',e:'medal',n:'Marathonien',r:40,ok:s=>s.km>=200},{id:'mu10',e:'dumb',n:'Force',r:15,ok:s=>s.mu>=10},
  {id:'k3',e:'target',n:'Touche-à-tout',r:10,ok:s=>s.kinds>=3},{id:'str3',e:'flame',n:'Sur la lancée',r:8,ok:s=>s.ms>=3},{id:'str7',e:'star',n:'Semaine parfaite',r:20,ok:s=>s.ms>=7},
  {id:'str14',e:'shield',n:'Increvable',r:40,ok:s=>s.ms>=14},{id:'lvl10',e:'up',n:'Niveau 10',r:15,ok:s=>s.lvl>=10},{id:'st5',e:'bolt',n:'Athlète',r:25,ok:s=>s.stage>=5},
  {id:'boss',e:'shield',n:'Défi relevé',r:20,ok:s=>s.boss},{id:'chest7',e:'gift',n:'Fidèle',r:20,ok:s=>s.chest>=7},{id:'shop',e:'bag',n:'Collectionneur',r:15,ok:s=>s.own>=3},
  {id:'goal',e:'trophy',n:'Objectif atteint',r:25,ok:s=>s.goal},{id:'work',e:'clock',n:'Assidu',r:10,ok:s=>s.wd>=20}
];
function checkBadges(){
  const g=G(),s=gstats(),fresh=[];
  BADGES.forEach(b=>{if(!g.badges[b.id]&&b.ok(s)){g.badges[b.id]=todayK();g.pts+=b.r;g.life+=b.r;fresh.push(b);}});
  if(fresh.length)saveSoon();
  return fresh;
}
/* ---- emblème qui évolue (remplace la mascotte) ---- */
function mascot(stage,skinIdx,uidp,eqIn,mood){
  const eq=eqIn===undefined?(G().eq||{}):eqIn;
  const sk=SKINS[skinIdx==null?G().skin:skinIdx]||SKINS[0],s=stage||glevel().stage,id='em'+(uidp||'')+(++gid);
  const C=80,poly=(n,r,rot=-90)=>Array.from({length:n},(_,k)=>{const a=(rot+k*360/n)*Math.PI/180;return (C+r*Math.cos(a)).toFixed(1)+','+(C+r*Math.sin(a)).toFixed(1);}).join(' ');
  const star=(n,r1,r2)=>Array.from({length:n*2},(_,k)=>{const r=k%2?r2:r1,a=(-90+k*180/n)*Math.PI/180;return (C+r*Math.cos(a)).toFixed(1)+','+(C+r*Math.sin(a)).toFixed(1);}).join(' ');
  const ticks=(n,r1,r2,w)=>Array.from({length:n},(_,k)=>{const a=(k*360/n)*Math.PI/180;return `<line x1="${(C+r1*Math.cos(a)).toFixed(1)}" y1="${(C+r1*Math.sin(a)).toFixed(1)}" x2="${(C+r2*Math.cos(a)).toFixed(1)}" y2="${(C+r2*Math.sin(a)).toFixed(1)}" stroke-width="${w}"/>`;}).join('');
  let L='';
  L+=`<circle cx="80" cy="80" r="74" fill="url(#${id}g)"/>`;
  if(s>=2)L+=`<circle cx="80" cy="80" r="34" fill="none" stroke="${sk.c}" stroke-opacity=".85" stroke-width="1.6"/>`;
  if(s>=3)L+=`<polygon points="${poly(6,47)}" fill="none" stroke="${sk.c}" stroke-opacity=".55" stroke-width="1.3"/>`;
  if(s>=4)L+=`<g class="rot"><circle cx="80" cy="80" r="56" fill="none" stroke="${sk.c}" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="1.5 6"/></g>`;
  if(s>=5)L+=`<polygon points="${star(6,44,24)}" fill="${sk.c}" fill-opacity=".1" stroke="${sk.c}" stroke-opacity=".7" stroke-width="1"/>`;
  if(s>=6)L+=`<g class="rot r2">${[0,120,240].map(a=>{const r=a*Math.PI/180;return `<circle cx="${(80+56*Math.cos(r)).toFixed(1)}" cy="${(80+56*Math.sin(r)).toFixed(1)}" r="3" fill="${sk.c}"/>`;}).join('')}</g>`;
  if(s>=7)L+=`<g stroke="${sk.c}" stroke-opacity=".7">${ticks(12,62,67,1.4)}</g>`;
  if(s>=8)L+=`<g stroke="${sk.c}" stroke-opacity=".35">${ticks(36,69,74,.8)}</g><circle cx="80" cy="80" r="76" fill="none" stroke="${sk.c}" stroke-opacity=".5" stroke-width=".8"/>`;
  const HEAD={cap:`<circle cx="80" cy="80" r="64" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>`,
    beanie:`<circle cx="80" cy="80" r="61" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/><circle cx="80" cy="80" r="66" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>`,
    party:`<g class="rot r3"><ellipse cx="80" cy="80" rx="70" ry="24" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1" transform="rotate(-24 80 80)"/><circle cx="${(80+70*Math.cos(-0.42)).toFixed(1)}" cy="${(80+70*Math.sin(-0.42)*0.34).toFixed(1)}" r="2.6" fill="#fff"/></g>`,
    horns:`<g fill="#fff" fill-opacity=".75">${[0,90,180,270].map(a=>`<polygon points="80,8 76,18 84,18" transform="rotate(${a} 80 80)"/>`).join('')}</g>`,
    halo:`<circle cx="80" cy="80" r="70" fill="none" stroke="#F1DE9E" stroke-width="2.2" filter="url(#${id}b)"/><circle cx="80" cy="80" r="70" fill="none" stroke="#FFF6D8" stroke-width=".8"/>`};
  const FACE={glasses:`<g clip-path="url(#${id}c)" stroke="#fff" stroke-opacity=".35" stroke-width=".8">${[-16,-8,0,8,16].map(d=>`<line x1="${80+d}" y1="56" x2="${80+d}" y2="104"/><line x1="56" y1="${80+d}" x2="104" y2="${80+d}"/>`).join('')}</g>`,
    shades:`<g stroke="#fff" stroke-opacity=".55">${ticks(8,7,20,1)}</g>`,
    stache:`<polygon points="${poly(6,15,0)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/><polygon points="${poly(3,15,-90)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`};
  return `<svg class="emb ${mood==='sleepy'?'sleepy':''}" viewBox="0 0 160 160" aria-hidden="true"><defs>
    <radialGradient id="${id}g"><stop offset="0" stop-color="${sk.c2}" stop-opacity=".55"/><stop offset=".55" stop-color="${sk.c2}" stop-opacity=".12"/><stop offset="1" stop-color="${sk.c2}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}k" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${sk.c}"/><stop offset="1" stop-color="${sk.c2}"/></radialGradient>
    <clipPath id="${id}c"><circle cx="80" cy="80" r="23"/></clipPath><filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
    ${L}${HEAD[eq.head]||''}<g class="core"><circle cx="80" cy="80" r="23" fill="url(#${id}k)"/><circle cx="80" cy="80" r="23" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>${FACE[eq.face]||''}<path d="M68 70a14 14 0 0 1 14-6" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round" fill="none"/></g></svg>`;
}
const skyCss=(st,bg)=>{const sb=bg&&SHOP.find(x=>x.id===bg);const k=sb?sb.sky:STAGES[st-1].sky;return `linear-gradient(180deg,${k[0]} 0%,${k[1]} 40%,${k[2]} 72%,${k[3]} 100%)`;};
function hills(){
  return `<svg class="hills" viewBox="0 0 340 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70q60-34 120-8t110-10q60-16 110 6v72H0z" fill="#000" opacity=".28"/><path d="M0 92q80-30 170-4t170-10v52H0z" fill="#000" opacity=".42"/></svg>`;
}

const DECO={
  mountain:`<path d="M0 250L70 140L110 200L170 100L240 210L290 150L340 240V340H0Z" fill="#fff" opacity=".22"/><path d="M0 280L60 200L120 260L190 170L260 250L340 190V340H0Z" fill="#0b1d4a" opacity=".35"/>`,
  beach:`<circle cx="260" cy="150" r="30" fill="#FFF3B0" opacity=".9"/><rect x="0" y="230" width="340" height="110" fill="#0a7fc4" opacity=".55"/><path d="M0 238q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>`,
  space:`<circle cx="70" cy="150" r="30" fill="#FF9F5A"/><ellipse cx="70" cy="150" rx="48" ry="10" fill="none" stroke="#FFE0B0" stroke-width="4" transform="rotate(-18 70 150)"/><circle cx="270" cy="120" r="14" fill="#7FD6FF" opacity=".9"/>${Array.from({length:26},(_,i)=>`<circle cx="${(i*47+13)%330}" cy="${(i*71+9)%260}" r="${i%4?1:2}" fill="#fff" opacity=".8"/>`).join('')}`,
  city:Array.from({length:9},(_,i)=>{const w=34,x=i*38-4,h=90+((i*53)%90);return `<rect x="${x}" y="${300-h}" width="${w}" height="${h+40}" fill="#0a0820" opacity=".8"/>`+Array.from({length:7},(_,j)=>`<rect x="${x+6+(j%3)*9}" y="${306-h+Math.floor(j/3)*18}" width="5" height="8" fill="#FFD27A" opacity="${(i+j)%3?.85:.2}"/>`).join('');}).join('')
};
const decoSvg=bg=>'';
function bossSVG(b,hp,dead,uid){
  const r=34,Lc=2*Math.PI*r,p=dead?0:Math.max(hp,0);
  return `<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="5"/><circle cx="40" cy="40" r="${r}" fill="none" stroke="${b.c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${Lc.toFixed(1)}" stroke-dashoffset="${(Lc*(1-p)).toFixed(1)}" transform="rotate(-90 40 40)" style="transition:stroke-dashoffset 1s"/><g transform="translate(26 26) scale(1.17)" class="bico" style="color:${dead?'rgba(255,255,255,.4)':'#fff'}">${IC(dead?'check':b.e,24).replace('<svg class="ic" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">','<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">').replace('</svg>','</g>')}</g></svg>`;
}

function scene(){
  const L=glevel(),st=STAGES[L.stage-1],eq=G().eq||{},mood=moodNow();
  return `<div class="scene" id="scene" style="background:${skyCss(L.stage,eq.bg)}"><div class="sgrid"></div>
  <div class="res"><div class="pill"><small>Niveau</small><b id="glv">${L.l}</b></div><div class="pill"><small>Rang</small><b style="font-size:15px;line-height:21px" id="gst">${esc(st.n)}</b></div><div class="pill"><small>Étoiles</small><b>${STAR}<span id="gpts">${fmtN(G().pts)}</span></b></div></div>
  <div class="mascot-wrap" id="mascot" data-act="tap" role="button" aria-label="Toucher l'emblème">${mascot(L.stage,undefined,'',undefined,mood)}</div>
  <div class="hint" id="ghint">${mood==='sleepy'?'En veille · une séance pour le réactiver':esc(st.d)}</div></div>`;
}
function objRow(o){
  return `<div class="row quest ${o.done?'done':''}"><div class="qchk">${o.done?IC('check',14):''}</div><div style="flex:1;min-width:0"><div class="row-title">${esc(o.t)}</div><div class="row-sub">${esc(o.s)}</div><div class="progress" style="margin-top:7px"><div style="width:${Math.round(o.p*100)}%;background:linear-gradient(90deg,var(--tc),var(--tc2))"></div></div></div>${o.claimed?'<span class="claimed">Pris</span>':o.done?`<button class="claim" data-act="claim" data-id="${o.id}">+${o.pts} ${STAR}</button>`:`<span class="claimed">+${o.pts} ${STAR}</span>`}</div>`;
}

/* ---- Aventure ---- */
function chestSVG(open){return `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${open?ICP.check:ICP.gift}"/></svg>`;}
function chestCard(){
  const c=chestInfo();
  return `<div class="adv chestc ${c.can?'can':''}"><div class="chimg ${c.can?'':'done'}">${chestSVG(!c.can)}</div>
    <div style="flex:1;min-width:0"><div class="atitle">Coffre du jour</div><div class="dots7">${Array.from({length:7},(_,i)=>`<i class="${i<c.dots?'on':''}"></i>`).join('')}</div><div class="asub">${c.st>0?c.st+' jour'+(c.st>1?'s':'')+' de suite':'Viens chaque jour'}</div></div>
    ${c.can?'<button class="abtn" data-act="chest">Ouvrir</button>':'<span class="asub" style="flex:none">À demain</span>'}</div>`;
}
function bossCard(){
  const b=bossInfo();
  return `<div class="adv bossc"><div class="bimg ${b.dead?'dead':''}" id="bossimg">${bossSVG(b.b,b.hp,b.dead,'x')}</div>
    <div style="flex:1;min-width:0"><div class="asub" style="margin:0">Défi de la semaine</div><div class="atitle">${esc(b.b.n)}</div>
    <div class="hpbar"><div style="width:${Math.max(Math.round(b.hp*100),b.dead?0:2)}%"></div></div>
    <div class="asub">${b.dead?(b.claimed?'Relevé':'Relevé · récompense prête'):`${fmtN(b.H-b.dmg)} min à faire · ${b.left} j`}</div>
    ${b.dead&&!b.claimed?`<button class="abtn" style="margin-top:8px" data-act="claimboss">+40 ${STAR}</button>`:b.dead?'':`<button class="abtn ghost" style="margin-top:8px" data-act="gosport">Ajouter une séance</button>`}</div></div>`;
}
function sprintCard(){
  const sp=G().sprint,td=todayK(),pl=sp.day===td?sp.plays:0,left=Math.max(2-pl,0);
  return `<div class="adv sprintc"><div class="chimg" style="width:62px;height:62px">${IC('bolt',28)}</div>
    <div style="flex:1;min-width:0"><div class="atitle">Sprint 10 s</div><div class="asub">Record : ${fmtN(sp.best)} · ${left?left+' récompense'+(left>1?'s':'')+' aujourd\'hui':'Entraînement libre'}</div></div>
    <button class="abtn" data-act="sprint">Jouer</button></div>`;
}
function adventureTab(){return `<div class="advlist">${chestCard()}${bossCard()}${sprintCard()}${shareBtnCard()}</div>`;}

/* ---- Quêtes + objectifs ---- */
function evoCard(){
  const L=glevel(),g=G(),st=STAGES[L.stage-1],nx=STAGES[L.stage];
  return `<div class="card evoc"><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px"><div><div class="muted" style="font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase">Niveau</div><div class="lvbig">${L.l}</div></div>
    <div style="text-align:right;min-width:0"><div class="row-title" style="font-size:17px">${esc(st.n)}</div><div class="row-sub">${nx?'Forme suivante dans '+fmtN(L.toNext)+' '+STAR:'Forme finale'}</div></div></div>
    <div class="progress xl"><div style="width:${Math.round(L.p*100)}%"></div></div>
    <div class="row-sub" style="display:flex;justify-content:space-between"><span>${fmtN(g.life-L.a)} / ${fmtN(L.b-L.a)} ${STAR}</span><span>niveau ${L.l+1}</span></div></div>`;
}
const QS=[['d','Jour'],['w','Semaine'],['m','Mois']];
const QUICK=[['km:100','100 km'],['sess:20','20 séances'],['hours:30','30 h'],['streak:14','14 jours'],['weight:-3','−3 kg'],['save:300','300 € / mois']];
function goalForm(){
  const d=ui.ng||(ui.ng={type:'km',name:'',target:'',from:'',dl:''}),T=GTYPES[d.type];
  return `<div class="form-panel gform"><div class="chips" style="margin-bottom:14px">${Object.entries(GTYPES).map(([k,v])=>`<button class="chip ${d.type===k?'on':''}" data-act="ngtype" data-id="${k}">${IC(v.e,15)} ${v.l}</button>`).join('')}</div>
    <div class="form-grid">
      ${d.type==='weight'?`<div class="field"><label>Poids de départ (kg)</label><input type="number" inputmode="decimal" step="any" data-ng="from" value="${d.from}" placeholder="${fmtN(curWeight(),1)}"></div>`:''}
      <div class="field ${d.type==='weight'?'':'wide'}"><label>Objectif (${T.u})</label><input type="number" inputmode="decimal" step="any" data-ng="target" value="${d.target}" placeholder="${T.ph}"></div>
      <div class="field"><label>Date limite (facultatif)</label><input type="date" data-ng="dl" value="${d.dl}"></div>
      <div class="field"><label>Nom (facultatif)</label><input data-ng="name" value="${esc(d.name)}" placeholder="Mon défi"></div></div>
    <div class="form-actions"><button class="btn btn-primary" data-act="addgoal">Créer l'objectif</button><button class="btn btn-ghost" data-act="toggle" data-id="ng">Annuler</button></div></div>`;
}
function goalCard(o){
  const pr=goalProg(o),T=GTYPES[o.type],ms=goalMiles().filter(m=>m.gid===o.id),done=pr.p>=1;
  return `<div class="card gcard ${done?'done':''}"><div style="display:flex;gap:14px;align-items:center"><div class="rw gring" style="width:70px;height:70px;flex:none">${ring(pr.p,done?'#34C759':'#8A4BFF',70,9)}<div class="rc" style="font-size:16px">${Math.round(pr.p*100)}<small style="font-size:10px;font-weight:600">%</small></div></div>
    <div style="flex:1;min-width:0"><div class="row-title gname">${IC(T.e,16)} ${esc(gName(o))}</div><div class="row-sub">${esc(pr.lab)}${pr.left?' · '+pr.left:''}</div></div><button class="row-del" data-act="delgoal" data-id="${o.id}" aria-label="Supprimer l'objectif">×</button></div>
    ${o.type==='weight'&&!done?`<div style="display:flex;gap:8px;margin-top:12px"><input id="gw-now" class="inl" type="number" inputmode="decimal" step="any" placeholder="Mon poids du jour (kg)"><button class="btn btn-ghost" data-act="logw">Peser</button></div>`:''}
    <div class="chips" style="margin-top:12px">${ms.map(m=>m.claimed?`<span class="chip static on">${Math.round(m.f*100)} %</span>`:m.done?`<button class="claim" data-act="claim" data-id="${m.id}">${Math.round(m.f*100)} % · +${m.pts} ${STAR}</button>`:`<span class="chip static off">${Math.round(m.f*100)} % · +${m.pts} ${STAR}</span>`).join('')}</div></div>`;
}
function goalsSection(){
  const list=G().myg||[],open=!!ui.open.ng;
  return `<div class="section-head"><h2 class="section-title">Mes objectifs</h2><button class="iconbtn" data-act="toggle" data-id="ng" aria-label="Nouvel objectif">${open?'×':'+'}</button></div>
  ${open?goalForm():`<div class="chips quick">${QUICK.map(([k,l])=>`<button class="chip" data-act="quickg" data-id="${k}">${l}</button>`).join('')}</div>`}
  <div style="display:grid;gap:12px;margin-top:12px">${list.map(goalCard).join('')||(open?'':'<div class="card empty" style="padding:18px 16px">Choisis une idée ou crée ton objectif.</div>')}</div>`;
}
function questsTab(){
  const obs=objectives(),qs=ui.qs||'d',cl=sc=>obs.filter(o=>o.scope===sc&&o.done&&!o.claimed).length;
  const cur=obs.filter(o=>o.scope===qs),all=obs.concat(goalMiles()).filter(o=>o.done&&!o.claimed);
  return `${evoCard()}
  <div class="seg qseg" style="margin-top:14px">${QS.map(([k,l])=>`<button class="${qs===k?'on':''}" data-act="qs" data-id="${k}">${l}${cl(k)?`<i class="bdg">${cl(k)}</i>`:''}</button>`).join('')}</div>
  <div class="row-list">${cur.map(objRow).join('')}</div>
  ${all.length>1?`<button class="btn btn-primary" style="width:100%;margin-top:12px" data-act="claimall">Tout récupérer · +${sum(all.map(o=>o.pts))} ${STAR}</button>`:''}
  ${goalsSection()}`;
}

/* ---- Boutique ---- */
function shopCard(it){
  const g=G(),own=g.own.includes(it.id),on=(g.eq||{})[it.slot]===it.id,eq={head:'',face:'',bg:''};eq[it.slot]=it.id;
  const prev=it.slot==='bg'?`<div class="bgp" style="background:${skyCss(1,it.id)}">${decoSvg(it.id)}<div class="m">${mascot(glevel().stage,g.skin,'sh'+it.id,{})}</div></div>`:`<div class="pm">${mascot(glevel().stage,g.skin,'sh'+it.id,eq)}</div>`;
  return `<button class="sitem ${on?'on':''} ${own?'own':''}" data-act="shop" data-id="${it.id}">${prev}<b>${it.n}</b><span>${on?'Équipé':own?'Équiper':fmtN(it.cost)+' '+STAR}</span></button>`;
}
function shopTab(){
  const g=G();
  const skins=SKINS.map((s,i)=>{const own=g.skins.includes(i);
    return `<button class="skin ${g.skin===i?'on':''} ${own?'':'lock'}" style="background:linear-gradient(135deg,${s.c},${s.c2})" data-act="skin" data-id="${i}" aria-label="${s.n}${own?'':', '+s.cost+' étoiles'}">${own?'':`<span>${s.cost}</span>`}</button>`;}).join('');
  return `<div class="card walletc"><div class="muted" style="font-size:12.5px;font-weight:600">À dépenser</div><div style="font-size:30px;font-weight:800;color:#FF9F0A;letter-spacing:-.02em">${STAR.replace('width="15" height="15"','width="24" height="24"')} ${fmtN(g.pts)}</div></div>
  <div class="section-head"><h2 class="section-title">Couleurs</h2></div><div class="card"><div class="swatches" style="gap:14px">${skins}</div></div>
  ${SLOTS.map(([k,l])=>`<div class="section-head"><h2 class="section-title">${l}</h2></div><div class="shopgrid">${SHOP.filter(x=>x.slot===k).map(shopCard).join('')}</div>`).join('')}`;
}

/* ---- Succès ---- */
function succTab(){
  const g=G(),L=glevel(),n=Object.keys(g.badges).length;
  const strip=STAGES.map((s,i)=>`<div class="st1 ${i+1>L.stage?'lock':''} ${i+1===L.stage?'cur':''}">${mascot(i+1,g.skin,'s'+i,{})}${i+1>L.stage?fmtN(TH[i])+' ★':esc(s.n)}</div>`).join('');
  return `<div class="section-head" style="margin-top:0"><h2 class="section-title">Formes</h2><span class="section-sub">${L.stage} / ${STAGES.length}</span></div>
  <div class="card"><div class="evo">${strip}</div></div>
  <div class="section-head"><h2 class="section-title">Succès</h2><span class="section-sub">${n} / ${BADGES.length}</span></div>
  <div class="bdgrid">${BADGES.map(b=>{const ok=!!g.badges[b.id];return `<div class="bdc ${ok?'ok':''}"><div class="bde">${IC(b.e,22)}</div><b>${b.n}</b><span>${ok?'+'+b.r+' '+STAR:'+'+b.r+' '+STAR}</span></div>`;}).join('')}</div>`;
}

const GT=[['adv','Aventure'],['quest','Quêtes'],['shop','Boutique'],['succ','Succès']];
function gameBody(){
  const t=ui.gt||'adv',pend=objectives().concat(goalMiles()).filter(o=>o.done&&!o.claimed).length;
  return `<div class="seg gseg" style="margin:14px 0">${GT.map(([k,l])=>`<button class="${t===k?'on':''}" data-act="gt" data-id="${k}">${l}${k==='quest'&&pend?`<i class="bdg">${pend}</i>`:''}</button>`).join('')}</div>
  ${t==='adv'?adventureTab():t==='quest'?questsTab():t==='shop'?shopTab():succTab()}`;
}
let _pdk='';
function gLive(){
  const pd=punchDue(),pk=pd?pd.key:'';if(pk!==_pdk){const first=_pdk==='';_pdk=pk;if(!first&&ui.tab==='today'&&!document.querySelector('input:focus'))render();else decorate();}
  const pn=$('#pdnow');if(pn)pn.textContent=hhmm();
  const g=G(),p=$('#gpts');
  if(p)p.textContent=fmtN(g.pts);
  const wl=$('#wlive');if(wl){const r=S.work.days[todayK()];wl.textContent=fmtH(workMin(r,true));}
}
function announceBadges(){
  const f=checkBadges();
  if(f.length)f.forEach((b,i)=>setTimeout(()=>{toast(b.n+' · +'+b.r+' ★');burst(innerWidth/2,innerHeight/3,18);},500+i*1300));
  return f;
}
function refreshGame(anim){
  const L=glevel(),st=STAGES[L.stage-1],eq=G().eq||{},mood=moodNow();
  announceBadges();
  const b=$('#gbody');
  if(b){b.innerHTML=gameBody();if(anim){b.className='enter';clearTimeout(refreshGame._t);refreshGame._t=setTimeout(()=>{b.className='';},1000);}}
  const sc=$('#scene');
  if(sc){sc.style.background=skyCss(L.stage,eq.bg);
    const m=$('#mascot');if(m)m.innerHTML=mascot(L.stage,undefined,'',undefined,mood);
    const a=$('#glv');if(a)a.textContent=L.l;const n=$('#gst');if(n)n.textContent=st.n;const h=$('#ghint');if(h)h.textContent=mood==='sleepy'?'En veille · une séance pour le réactiver':st.d;}
  gLive();
}
function tap(ev,el){
  const sc=$('#scene');
  if(sc){const r=sc.getBoundingClientRect();
    const x=(ev&&ev.clientX?ev.clientX-r.left:r.width/2)-40,y=(ev&&ev.clientY?ev.clientY-r.top:r.height/2)-30;
    const f=document.createElement('div');f.className='fl';f.textContent=SAYS[Math.floor(Math.random()*SAYS.length)];f.style.left=Math.max(x,6)+'px';f.style.top=y+'px';sc.appendChild(f);setTimeout(()=>f.remove(),950);}
  el.classList.add('tap');setTimeout(()=>el.classList.remove('tap'),110);
  G().taps=(G().taps||0)+1;if(G().taps%15===0)burst(ev&&ev.clientX,ev&&ev.clientY,10);
}

/* ---- sprint : mini-jeu de 10 secondes ---- */
function startSprint(){
  const old=$('#sprint');if(old){clearInterval(old._t);old.remove();}
  const g=G(),td=todayK(),sp=g.sprint;if(sp.day!==td){sp.day=td;sp.plays=0;}
  const reward=sp.plays<2,ov=document.createElement('div');ov.className='sprint';ov.id='sprint';
  ov.innerHTML=`<button class="sx" data-act="sprintx" aria-label="Fermer">×</button>
  <div class="sinfo" id="sinfo">${reward?'Touche l\'emblème le plus vite possible':'Entraînement libre'}</div><div class="stime" id="stime">10,0</div>
  <div class="smas" id="smas">${mascot(glevel().stage)}</div><div class="scount" id="scount">0</div><div class="sgo" id="sgo">Touche pour démarrer</div>`;
  document.body.appendChild(ov);document.body.style.overflow='hidden';
  let taps=0,t0=0,over=false;
  const mas=ov.querySelector('#smas');
  const finish=()=>{
    over=true;clearInterval(ov._t);
    const best=taps>sp.best;if(best)sp.best=taps;
    let r=0;if(reward){r=Math.min(4,Math.floor(taps/12));sp.plays++;g.pts+=r;g.life+=r;}
    saveSoon();
    ov.querySelector('#stime').textContent='0,0';
    ov.querySelector('#sgo').innerHTML=`<div class="sres"><b>${taps}</b> touches${best&&taps>0?' · nouveau record !':''}<div class="srew">${reward?(r?'+'+r+' '+STAR:'Encore un effort pour gagner des étoiles'):'Pas de récompense'}</div><button class="abtn" data-act="sprintagain">Rejouer</button></div>`;
    if(best&&taps>0)burst(innerWidth/2,innerHeight/2,40);else if(r)burst(innerWidth/2,innerHeight/2,20);
  };
  mas.addEventListener('pointerdown',e=>{
    e.preventDefault();if(over)return;
    if(!t0){t0=performance.now();ov.querySelector('#sgo').textContent='Vas-y !';
      ov._t=setInterval(()=>{const left=10-(performance.now()-t0)/1000;if(left<=0){finish();return;}ov.querySelector('#stime').textContent=fmtN(left,1);},50);}
    taps++;ov.querySelector('#scount').textContent=taps;
    mas.classList.remove('hit');void mas.offsetWidth;mas.classList.add('hit');
  });
}

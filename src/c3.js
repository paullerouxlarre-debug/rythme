
/* ================= effets ================= */
const STAR='<svg class="st" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>';
const COIN='<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="#FFD60A"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#C99700" stroke-width="1.6"/></svg>';
const CONF=['#FF3B30','#FF9500','#FFCC00','#34C759','#0A84FF','#AF52DE','#FF2D55'];
function burst(x,y,n=22){
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
  {n:'Petit blob',d:'Tout commence ici',sky:['#1B1464','#4B2FA8','#B24FC2','#FF8A5B']},
  {n:'Sportif en herbe',d:'Le bandeau est là',sky:['#10305E','#1F6BD1','#58B4F2','#BDEBFF']},
  {n:'Coureur',d:'Des baskets, enfin',sky:['#0B3D2E','#12805B','#5FCF8E','#F4F0A8']},
  {n:'Costaud',d:'Les bras gonflent',sky:['#4A1020','#C2304A','#FF7A59','#FFD27A']},
  {n:'Super héros',d:'Une cape, rien que ça',sky:['#14083A','#5B2AC8','#B24FFF','#FF8AD8']},
  {n:'Champion',d:'La médaille au cou',sky:['#07294A','#0A7AFF','#38D0FF','#C9F7FF']},
  {n:'Roi du stade',d:'Une couronne méritée',sky:['#3A1A00','#C86B00','#FFB020','#FFF1A8']},
  {n:'Légende',d:'Ailes et aura',sky:['#050816','#2A1B7A','#C23BFF','#00E0FF']}
];
const SKINS=[
  {n:'Menthe',c:'#5EE08A',c2:'#1F9D55',cost:0},{n:'Ciel',c:'#7FD6FF',c2:'#0A7AFF',cost:40},
  {n:'Pêche',c:'#FFC08A',c2:'#FF7A3D',cost:90},{n:'Violette',c:'#D3A6FF',c2:'#8A4BFF',cost:160},
  {n:'Or',c:'#FFE27A',c2:'#E8890C',cost:300},{n:'Aurore',c:'#8CF5E1',c2:'#7B4BFF',cost:500}
];
/* boutique : accessoires et décors */
const SHOP=[
  {id:'cap',slot:'head',n:'Casquette',cost:60},{id:'beanie',slot:'head',n:'Bonnet',cost:80},{id:'party',slot:'head',n:'Chapeau',cost:110},
  {id:'horns',slot:'head',n:'Cornes',cost:140},{id:'halo',slot:'head',n:'Auréole',cost:220},
  {id:'glasses',slot:'face',n:'Lunettes',cost:70},{id:'shades',slot:'face',n:'Soleil',cost:100},{id:'stache',slot:'face',n:'Moustache',cost:120},
  {id:'mountain',slot:'bg',n:'Montagne',cost:150,sky:['#1c2b5a','#4a6fbf','#f4a77a','#ffe3b0']},
  {id:'beach',slot:'bg',n:'Plage',cost:200,sky:['#0a4a8a','#2aa6e0','#8fe0f5','#ffe9a8']},
  {id:'space',slot:'bg',n:'Espace',cost:300,sky:['#02030f','#10124a','#3a1a7a','#7a2aa0']},
  {id:'city',slot:'bg',n:'Ville',cost:400,sky:['#0b0a2a','#2a1760','#a0359a','#ff7a8a']}
];
const SLOTS=[['head','Têtes'],['face','Visages'],['bg','Décors']];
const SAYS=['Allez, on bouge !','Un pas de plus','Bien joué','Je grandis avec toi','Encore une séance ?','On y va'];
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
  weight:{l:'Poids',u:'kg',ph:'72',e:'⚖️'},km:{l:'Distance',u:'km',ph:'100',e:'🏃'},sess:{l:'Séances',u:'séances',ph:'20',e:'💪'},
  hours:{l:'Heures',u:'h',ph:'30',e:'⏱️'},streak:{l:'Série',u:'jours',ph:'14',e:'🔥'},save:{l:'Épargne',u:'€ / mois',ph:'300',e:'💰'}
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
const BOSSES=[{n:'Le Canapé',e:'🛋️',c:'#9A7048',c2:'#5A3F26'},{n:'La Flemme',e:'😴',c:'#7C8BFF',c2:'#3340B5'},{n:'Le Fast-food',e:'🍔',c:'#FFA43A',c2:'#B8470A'},{n:'Le Réveil',e:'⏰',c:'#FF5A4F',c2:'#8E1A12'}];
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
  {id:'first',e:'👟',n:'Premier pas',r:5,ok:s=>s.ses>=1},{id:'s10',e:'📅',n:'Régulier',r:10,ok:s=>s.ses>=10},{id:'s50',e:'⚙️',n:'Machine',r:40,ok:s=>s.ses>=50},
  {id:'km50',e:'🏃',n:'Coureur',r:15,ok:s=>s.km>=50},{id:'km200',e:'🏅',n:'Marathonien',r:40,ok:s=>s.km>=200},{id:'mu10',e:'💪',n:'Costaud',r:15,ok:s=>s.mu>=10},
  {id:'k3',e:'🎯',n:'Touche-à-tout',r:10,ok:s=>s.kinds>=3},{id:'str3',e:'🔥',n:'Sur la lancée',r:8,ok:s=>s.ms>=3},{id:'str7',e:'🌟',n:'Semaine parfaite',r:20,ok:s=>s.ms>=7},
  {id:'str14',e:'🦾',n:'Increvable',r:40,ok:s=>s.ms>=14},{id:'lvl10',e:'⬆️',n:'Niveau 10',r:15,ok:s=>s.lvl>=10},{id:'st5',e:'🦸',n:'Super héros',r:25,ok:s=>s.stage>=5},
  {id:'boss',e:'⚔️',n:'Tueur de boss',r:20,ok:s=>s.boss},{id:'chest7',e:'🎁',n:'Fidèle',r:20,ok:s=>s.chest>=7},{id:'shop',e:'🛍️',n:'Collectionneur',r:15,ok:s=>s.own>=3},
  {id:'goal',e:'🏆',n:'Objectif atteint',r:25,ok:s=>s.goal},{id:'work',e:'🕘',n:'Assidu',r:10,ok:s=>s.wd>=20}
];
function checkBadges(){
  const g=G(),s=gstats(),fresh=[];
  BADGES.forEach(b=>{if(!g.badges[b.id]&&b.ok(s)){g.badges[b.id]=todayK();g.pts+=b.r;g.life+=b.r;fresh.push(b);}});
  if(fresh.length)saveSoon();
  return fresh;
}
/* ---- mascotte qui évolue ---- */
function mascot(stage,skinIdx,uidp,eqIn,mood){
  const eq=eqIn===undefined?(G().eq||{}):eqIn;
  const sk=SKINS[skinIdx==null?G().skin:skinIdx]||SKINS[0],s=stage||glevel().stage,id='mg'+(uidp||'');
  const sc=(0.8+0.03*s).toFixed(3);
  const aura=s>=8?`<circle cx="80" cy="84" r="76" fill="url(#${id}a)"/><path d="M30 70c-34-14-30 30-10 52 8 8 18 8 28 2z" fill="#fff" opacity=".92"/><path d="M130 70c34-14 30 30 10 52-8 8-18 8-28 2z" fill="#fff" opacity=".92"/>`:'';
  const cape=s>=5?`<path d="M44 52Q12 112 24 150L66 132Z" fill="#FF3B30"/><path d="M116 52Q148 112 136 150L94 132Z" fill="#E02A20"/>`:'';
  const shoes=s>=3?`<ellipse cx="58" cy="147" rx="18" ry="9" fill="#FF3B30"/><ellipse cx="102" cy="147" rx="18" ry="9" fill="#FF3B30"/><path d="M44 148h28M88 148h28" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`
    :`<ellipse cx="58" cy="147" rx="16" ry="8" fill="#fff"/><ellipse cx="102" cy="147" rx="16" ry="8" fill="#fff"/><path d="M45 147h26M89 147h26" stroke="${sk.c2}" stroke-width="3" stroke-linecap="round"/>`;
  const armW=s>=4?14:10;
  const arms=`<g class="arm"><path d="M130 86c14 2 20-8 18-18" stroke="${sk.c2}" stroke-width="${armW}" stroke-linecap="round" fill="none"/>${s>=4?`<circle cx="142" cy="82" r="10" fill="${sk.c2}"/>`:''}</g><path d="M30 92c-12 2-18 10-16 20" stroke="${sk.c2}" stroke-width="${armW}" stroke-linecap="round" fill="none"/>${s>=4?`<circle cx="20" cy="100" r="10" fill="${sk.c2}"/>`:''}`;
  const band=s>=2?`<path d="M29 60c32-12 70-12 102 0" stroke="#FF3B30" stroke-width="8" stroke-linecap="round" fill="none"/>`:'';
  const medal=s>=6?`<path d="M62 108L80 130 98 108" stroke="#0A7AFF" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="80" cy="132" r="9" fill="#FFD60A" stroke="#C99700" stroke-width="2"/>`:'';
  const crown=(s>=7&&!eq.head)?`<path d="M54 26L60 6 71 19 80 3 89 19 100 6 106 26Z" fill="#FFD60A" stroke="#C99700" stroke-width="2.5" stroke-linejoin="round"/><circle cx="80" cy="12" r="3" fill="#FF3B30"/>`:'';
  const brows=s>=4?`<path d="M52 72l20 5M108 72l-20 5" stroke="#1c1c1e" stroke-width="4" stroke-linecap="round"/>`:'';
  const mouth=s>=3?`<path d="M64 104q16 18 32 0" stroke="#1c1c1e" stroke-width="4.5" stroke-linecap="round" fill="#fff"/>`:`<path d="M68 106q12 12 24 0" stroke="#1c1c1e" stroke-width="4" stroke-linecap="round" fill="none"/>`;

  const HEAD={
    cap:`<path d="M44 40Q80 4 116 40Z" fill="#0A84FF"/><path d="M96 38h38q5 0 5 4t-7 4H96z" fill="#0A66C8"/><circle cx="80" cy="12" r="4" fill="#fff"/>`,
    beanie:`<path d="M42 46Q42 6 80 6Q118 6 118 46Z" fill="#FF3B30"/><rect x="40" y="38" width="80" height="13" rx="6.5" fill="#C42B22"/><circle cx="80" cy="4" r="9" fill="#fff"/>`,
    party:`<path d="M80 -14L54 38H106Z" fill="#AF52DE"/><path d="M66 16h28M60 28h40" stroke="#FFD60A" stroke-width="4"/><circle cx="80" cy="-14" r="6" fill="#FFD60A"/>`,
    horns:`<path d="M46 38Q30 10 52 4Q50 24 62 32Z" fill="#FF3B30"/><path d="M114 38Q130 10 108 4Q110 24 98 32Z" fill="#FF3B30"/>`,
    halo:`<ellipse cx="80" cy="6" rx="30" ry="8" fill="none" stroke="#FFD60A" stroke-width="6"/><ellipse cx="80" cy="6" rx="30" ry="8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`
  };
  const FACE={
    glasses:`<circle cx="62" cy="88" r="15" fill="rgba(255,255,255,.25)" stroke="#1c1c1e" stroke-width="4"/><circle cx="98" cy="88" r="15" fill="rgba(255,255,255,.25)" stroke="#1c1c1e" stroke-width="4"/><path d="M77 88h6" stroke="#1c1c1e" stroke-width="4"/>`,
    shades:`<rect x="44" y="76" width="32" height="22" rx="10" fill="#111"/><rect x="84" y="76" width="32" height="22" rx="10" fill="#111"/><path d="M76 84h8" stroke="#111" stroke-width="4"/><path d="M50 82l10-3" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`,
    stache:`<path d="M60 102Q80 92 100 102Q92 114 80 107Q68 114 60 102Z" fill="#3a2a1a"/>`
  };
  const eyes=mood==='sleepy'?`<path d="M52 90q10 9 20 0M88 90q10 9 20 0" stroke="#1c1c1e" stroke-width="4.5" fill="none" stroke-linecap="round"/><text x="122" y="44" font-size="22" font-weight="800" fill="#fff" opacity=".9">z</text><text x="136" y="28" font-size="15" font-weight="800" fill="#fff" opacity=".7">z</text>`
   :`<g class="blink"><ellipse cx="62" cy="88" rx="8" ry="10" fill="#1c1c1e"/><ellipse cx="98" cy="88" rx="8" ry="10" fill="#1c1c1e"/></g><circle cx="65" cy="84" r="3" fill="#fff"/><circle cx="101" cy="84" r="3" fill="#fff"/>`;
  return `<svg viewBox="0 0 160 160" aria-hidden="true"><defs><radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${sk.c}"/><stop offset="1" stop-color="${sk.c2}"/></radialGradient><radialGradient id="${id}a"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  ${aura}<g transform="translate(80 150) scale(${sc}) translate(-80 -150)">${cape}${shoes}
  <path d="M80 16c34 0 52 26 52 62 0 38-20 66-52 66S28 116 28 78c0-36 18-62 52-62z" fill="url(#${id})"/>
  <path d="M48 44c8-10 20-14 32-14" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" fill="none"/>
  ${arms}${band}${medal}${brows}
  ${eyes}
  <ellipse cx="46" cy="104" rx="9" ry="6" fill="#FF6B8A" opacity=".45"/><ellipse cx="114" cy="104" rx="9" ry="6" fill="#FF6B8A" opacity=".45"/>
  ${mouth}${FACE[eq.face]||''}${HEAD[eq.head]||''}${crown}</g></svg>`;
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
const decoSvg=bg=>bg&&DECO[bg]?`<svg class="deco" viewBox="0 0 340 340" preserveAspectRatio="none" aria-hidden="true">${DECO[bg]}</svg>`:'';
function bossSVG(b,hp,dead,uid){
  const cr1=hp<.66?`<path d="M96 30l-10 22 12 8-8 20" stroke="rgba(0,0,0,.55)" stroke-width="3.5" fill="none" stroke-linecap="round"/>`:'';
  const cr2=hp<.33?`<path d="M44 70l18 10-10 14 14 8" stroke="rgba(0,0,0,.55)" stroke-width="3.5" fill="none" stroke-linecap="round"/>`:'';
  const eyes=dead?`<path d="M52 66l20 20M72 66L52 86M88 66l20 20M108 66L88 86" stroke="#1c1c1e" stroke-width="5" stroke-linecap="round"/>`
    :`<ellipse cx="62" cy="76" rx="10" ry="12" fill="#fff"/><ellipse cx="98" cy="76" rx="10" ry="12" fill="#fff"/><circle cx="64" cy="79" r="5" fill="#1c1c1e"/><circle cx="96" cy="79" r="5" fill="#1c1c1e"/><path d="M48 58l26 10M112 58L86 68" stroke="#1c1c1e" stroke-width="5" stroke-linecap="round"/>`;
  const mouth=dead?`<path d="M64 108q16-8 32 0" stroke="#1c1c1e" stroke-width="4.5" fill="none" stroke-linecap="round"/>`:`<path d="M58 104l8 10 8-10 8 10 8-10 8 10 8-10" stroke="#1c1c1e" stroke-width="4" fill="#fff" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 160 160" aria-hidden="true"><defs><radialGradient id="bs${uid}" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${b.c}"/><stop offset="1" stop-color="${b.c2}"/></radialGradient></defs>
  <ellipse cx="80" cy="150" rx="54" ry="8" fill="rgba(0,0,0,.28)"/>
  <g ${dead?'style="filter:grayscale(1) brightness(.75)"':''}><path d="M44 36L28 6 64 28Z" fill="#2a2a32"/><path d="M116 36L132 6 96 28Z" fill="#2a2a32"/>
  <path d="M26 122C14 70 38 22 80 22s66 48 54 100c-8 22-100 22-108 0z" fill="url(#bs${uid})"/>
  <path d="M46 40c8-8 18-12 28-12" stroke="#fff" stroke-opacity=".35" stroke-width="6" stroke-linecap="round" fill="none"/>
  ${eyes}${mouth}${cr1}${cr2}<text x="80" y="140" text-anchor="middle" font-size="22">${b.e}</text></g></svg>`;
}

function scene(){
  const L=glevel(),st=STAGES[L.stage-1],eq=G().eq||{},mood=moodNow();
  const stars=Array.from({length:22},(_,i)=>`<i style="left:${(i*37+11)%97}%;top:${(i*53+7)%48+6}%;animation-delay:${(i%7)*.45}s"></i>`).join('');
  return `<div class="scene" id="scene" style="background:${skyCss(L.stage,eq.bg)}"><div class="sk">${stars}</div>${eq.bg?'':'<div class="moon"></div>'}${decoSvg(eq.bg)}
  <div class="cl" style="width:70px;top:96px;animation-duration:46s"></div><div class="cl" style="width:50px;top:132px;animation-duration:64s;animation-delay:-20s"></div>
  ${hills()}
  <div class="res"><div class="pill"><small>Niveau</small><b id="glv">${L.l}</b></div><div class="pill"><small>Forme</small><b style="font-size:15px;line-height:21px" id="gst">${esc(st.n)}</b></div><div class="pill"><small>À dépenser</small><b style="color:#FFE27A">${STAR}<span id="gpts">${fmtN(G().pts)}</span></b></div></div>
  <div class="shadow"></div><div class="mascot-wrap" id="mascot" data-act="tap" role="button" aria-label="Toucher Rythmo">${mascot(L.stage,undefined,'',undefined,mood)}</div>
  <div class="hint" id="ghint">${mood==='sleepy'?'Il s\'ennuie… une séance ?':esc(st.d)}</div></div>`;
}
function objRow(o){
  return `<div class="row quest ${o.done?'done':''}"><div class="qchk">${o.done?'✓':''}</div><div style="flex:1;min-width:0"><div class="row-title">${esc(o.t)}</div><div class="row-sub">${esc(o.s)}</div><div class="progress" style="margin-top:7px"><div style="width:${Math.round(o.p*100)}%;background:linear-gradient(90deg,var(--tc),var(--tc2))"></div></div></div>${o.claimed?'<span class="claimed">Pris</span>':o.done?`<button class="claim" data-act="claim" data-id="${o.id}">+${o.pts} ${STAR}</button>`:`<span class="claimed">+${o.pts} ${STAR}</span>`}</div>`;
}

/* ---- Aventure ---- */
function chestSVG(open){
  const lid=`<path d="M8 34Q8 10 40 10Q72 10 72 34Z" fill="#E09A3C"/><path d="M8 30h64v6H8z" fill="#8A531C"/>`;
  return `<svg viewBox="0 0 80 76" aria-hidden="true">${open?`<circle cx="40" cy="34" r="30" fill="#FFF3B0" opacity=".55"/><g transform="rotate(-34 8 36)">${lid}</g>`:lid}<rect x="8" y="34" width="64" height="34" rx="6" fill="#B8742A"/><rect x="8" y="34" width="64" height="7" fill="#8A531C"/><rect x="34" y="32" width="12" height="17" rx="3" fill="#FFD60A" stroke="#B8860B" stroke-width="2"/></svg>`;
}
function chestCard(){
  const c=chestInfo();
  return `<div class="adv chestc ${c.can?'can':''}"><div class="chimg ${c.can?'':'done'}">${chestSVG(!c.can)}</div>
    <div style="flex:1;min-width:0"><div class="atitle">Coffre du jour</div><div class="dots7">${Array.from({length:7},(_,i)=>`<i class="${i<c.dots?'on':''}"></i>`).join('')}</div><div class="asub">${c.st>0?c.st+' jour'+(c.st>1?'s':'')+' de suite':'Viens chaque jour'}</div></div>
    ${c.can?'<button class="abtn" data-act="chest">Ouvrir</button>':'<span class="asub" style="flex:none">À demain</span>'}</div>`;
}
function bossCard(){
  const b=bossInfo();
  return `<div class="adv bossc"><div class="bimg ${b.dead?'dead':''}" id="bossimg">${bossSVG(b.b,b.hp,b.dead,'x')}</div>
    <div style="flex:1;min-width:0"><div class="asub" style="margin:0">Boss de la semaine</div><div class="atitle">${esc(b.b.n)}</div>
    <div class="hpbar"><div style="width:${Math.max(Math.round(b.hp*100),b.dead?0:2)}%"></div></div>
    <div class="asub">${b.dead?(b.claimed?'Vaincu ✓':'Vaincu ! Récompense prête'):`${fmtN(b.H-b.dmg)} min à faire · ${b.left} j`}</div>
    ${b.dead&&!b.claimed?`<button class="abtn" style="margin-top:8px" data-act="claimboss">+40 ${STAR}</button>`:b.dead?'':`<button class="abtn ghost" style="margin-top:8px" data-act="gosport">Frapper : ajouter une séance</button>`}</div></div>`;
}
function sprintCard(){
  const sp=G().sprint,td=todayK(),pl=sp.day===td?sp.plays:0,left=Math.max(2-pl,0);
  return `<div class="adv sprintc"><div class="chimg" style="width:62px;height:62px"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="#FFE27A" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg></div>
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
const QUICK=[['km:100','🏃 100 km'],['sess:20','💪 20 séances'],['hours:30','⏱️ 30 h'],['streak:14','🔥 14 jours'],['weight:-3','⚖️ −3 kg'],['save:300','💰 300 € / mois']];
function goalForm(){
  const d=ui.ng||(ui.ng={type:'km',name:'',target:'',from:'',dl:''}),T=GTYPES[d.type];
  return `<div class="form-panel gform"><div class="chips" style="margin-bottom:14px">${Object.entries(GTYPES).map(([k,v])=>`<button class="chip ${d.type===k?'on':''}" data-act="ngtype" data-id="${k}">${v.e} ${v.l}</button>`).join('')}</div>
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
    <div style="flex:1;min-width:0"><div class="row-title">${T.e} ${esc(gName(o))}</div><div class="row-sub">${esc(pr.lab)}${pr.left?' · '+pr.left:''}</div></div><button class="row-del" data-act="delgoal" data-id="${o.id}" aria-label="Supprimer l'objectif">×</button></div>
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
  <div class="bdgrid">${BADGES.map(b=>{const ok=!!g.badges[b.id];return `<div class="bdc ${ok?'ok':''}"><div class="bde">${b.e}</div><b>${b.n}</b><span>${ok?'+'+b.r+' '+STAR:'+'+b.r+' '+STAR}</span></div>`;}).join('')}</div>`;
}

const GT=[['adv','Aventure'],['quest','Quêtes'],['shop','Boutique'],['succ','Succès']];
function gameBody(){
  const t=ui.gt||'adv',pend=objectives().concat(goalMiles()).filter(o=>o.done&&!o.claimed).length;
  return `<div class="seg gseg" style="margin:14px 0">${GT.map(([k,l])=>`<button class="${t===k?'on':''}" data-act="gt" data-id="${k}">${l}${k==='quest'&&pend?`<i class="bdg">${pend}</i>`:''}</button>`).join('')}</div>
  ${t==='adv'?adventureTab():t==='quest'?questsTab():t==='shop'?shopTab():succTab()}`;
}
function gLive(){
  const g=G(),p=$('#gpts');
  if(p)p.textContent=fmtN(g.pts);
  const wl=$('#wlive');if(wl){const r=S.work.days[todayK()];wl.textContent=fmtH(workMin(r,true));}
}
function announceBadges(){
  const f=checkBadges();
  if(f.length)f.forEach((b,i)=>setTimeout(()=>{toast(b.e+' '+b.n+' · +'+b.r+' ★');burst(innerWidth/2,innerHeight/3,18);},500+i*1300));
  return f;
}
function refreshGame(anim){
  const L=glevel(),st=STAGES[L.stage-1],eq=G().eq||{},mood=moodNow();
  announceBadges();
  const b=$('#gbody');
  if(b){b.innerHTML=gameBody();if(anim){b.className='enter';clearTimeout(refreshGame._t);refreshGame._t=setTimeout(()=>{b.className='';},1000);}}
  const sc=$('#scene');
  if(sc){const old=sc.querySelector('.deco'),moon=sc.querySelector('.moon');
    sc.style.background=skyCss(L.stage,eq.bg);
    if(old)old.remove();
    if(eq.bg){if(moon)moon.remove();sc.querySelector('.sk').insertAdjacentHTML('afterend',decoSvg(eq.bg));}
    else if(!moon)sc.querySelector('.sk').insertAdjacentHTML('afterend','<div class="moon"></div>');
    const m=$('#mascot');if(m)m.innerHTML=mascot(L.stage,undefined,'',undefined,mood);
    const a=$('#glv');if(a)a.textContent=L.l;const n=$('#gst');if(n)n.textContent=st.n;const h=$('#ghint');if(h)h.textContent=mood==='sleepy'?'Il s\'ennuie… une séance ?':st.d;}
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
  <div class="sinfo" id="sinfo">${reward?'Touche Rythmo le plus vite possible':'Entraînement libre'}</div><div class="stime" id="stime">10,0</div>
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

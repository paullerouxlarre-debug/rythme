(function(){
"use strict";

/* ================= utils ================= */
const $=s=>document.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:NaN;};
const fmt=n=>(isFinite(n)?n:0).toLocaleString('fr-FR',{maximumFractionDigits:0})+' €';
const fmtS=n=>(n>=0?'+':'−')+Math.abs(isFinite(n)?n:0).toLocaleString('fr-FR',{maximumFractionDigits:0})+' €';
const fmtN=(n,d=0)=>(isFinite(n)?n:0).toLocaleString('fr-FR',{maximumFractionDigits:d,minimumFractionDigits:d});
const pct=(n,d=1)=>(n>=0?'+':'−')+Math.abs(isFinite(n)?n:0).toFixed(d).replace('.',',')+' %';
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayK=()=>dkey(new Date());
const addD=(k,n)=>{const d=new Date(k+'T12:00');d.setDate(d.getDate()+n);return dkey(d);};
const mkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}`;
const dShort=k=>new Date(k+'T12:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
const dLong=k=>new Date(k+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const mShort=k=>{const[y,m]=k.split('-');return new Date(+y,+m-1,1).toLocaleDateString('fr-FR',{month:'short'}).replace('.','')+' '+y.slice(2);};
const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
const sum=a=>a.reduce((s,x)=>s+x,0);

const fmtC=n=>{n=Math.floor(n);if(n<1e4)return n.toLocaleString('fr-FR');const u=['k','M','Md','T'];let i=-1,v=n;while(v>=1000&&i<u.length-1){v/=1000;i++;}return v.toLocaleString('fr-FR',{maximumFractionDigits:v<100?2:1})+' '+u[i];};
const fmtH=m=>{m=Math.max(Math.round(m),0);return Math.floor(m/60)+' h '+pad(m%60);};
const hhmm=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes());};
const tmin=s=>{if(!s)return NaN;const[h,m]=s.split(':').map(Number);return h*60+m;};

/* ================= constants ================= */
const CLASSES=['ETF','Actions','Crypto'];
const CCOL={ETF:'#5E9C80',Actions:'#D97757',Crypto:'#9A7BC0'};
const SPORTS={course:{name:'Course à pied',col:'#FF9500'},muscu:{name:'Musculation',col:'#0A84FF'},padel:{name:'Padel',col:'#FFCC00'},bodyboard:{name:'Bodyboard',col:'#32ADE6'}};
const EK={Voyage:'#6A9BCC',Sport:'#D97757',Anniversaire:'#C2483A',Boulot:'#5E5CA8',Congé:'#C9A15E',Perso:'#9A7BC0',Santé:'#4FA39A',Détente:'#7E9459'};
const SRC_COL=['#34C759','#0A84FF','#FF9500','#AF52DE','#FF2D55','#32ADE6','#FFCC00','#8E8E93'];
const ACCENTS=[['Vert','#1F9D55'],['Bleu','#0A7AFF'],['Violet','#AF52DE'],['Orange','#F57C00'],['Rose','#E91E63'],['Turquoise','#16A5B8']];
const KEY='rythme_v4';
const BUILD='__BUILD__';

const blankGame=()=>({pts:0,life:0,taps:0,skin:0,skins:[0],claimed:{},myg:[],mig:0,chest:{last:'',streak:0,best:0},own:[],eq:{head:'',face:'',bg:''},badges:{},circle:0,wb:'',sprint:{day:'',plays:0,best:0},goal:{wT:'',wS:'',dT:'',dFrom:''}});
const blank=()=>({lines:[],ret:{ETF:6.5,Actions:8,Crypto:12},spread:{ETF:2.5,Actions:3.5,Crypto:8},dca:0,scen:null,
  proj:{init:5000,monthly:300,years:20,infl:2,goal:200000},ci:{init:1000,monthly:200,rate:7,years:20,freq:12},
  incomes:[],sources:['Salaire','Freelance','Dividendes','Autre'],pays:[],
  sim:{prix:300000,apport:30000,taux:3.6,duree:25,assu:0.34,notaire:21000,charges:0},sims:[],
  workouts:[],goals:{dayMin:45,weekSessions:4},profile:null,wlog:[],customEx:[],templates:[],events:[],
  work:{days:{},target:35},game:blankGame(),imported:0});

function migrate(d){
  const o=Object.assign(blank(),d||{});
  o.lines=(o.lines||[]).map(l=>{const n=Object.assign({},l);if(n.pct==null)n.pct=n.w||0;delete n.w;return n;});
  o.incomes=(o.incomes||[]).map(i=>Object.assign({source:'Salaire'},i));
  o.events=(o.events||[]).map(e=>Object.assign({},e,{kind:e.kind==='Travail'?'Boulot':(EK[e.kind]?e.kind:'Perso')}));
  o.game=Object.assign(blankGame(),o.game||{});
  o.game.goal=Object.assign({wT:'',wS:'',dT:'',dFrom:''},o.game.goal||{});
  ['coins','gens','boost','t','pid','friends'].forEach(k=>delete o.game[k]);
  const dg=blankGame();['myg','chest','own','eq','badges','sprint'].forEach(k=>{if(o.game[k]==null||typeof o.game[k]!==typeof dg[k])o.game[k]=dg[k];});
  o.game.chest=Object.assign(dg.chest,o.game.chest);o.game.sprint=Object.assign(dg.sprint,o.game.sprint);o.game.eq=Object.assign(dg.eq,o.game.eq);
  if(!o.game.mig){o.game.mig=1;const gg=o.game.goal,cl=o.game.claimed;
    if(gg.wT>0&&gg.wS>0){o.game.myg.push({id:'w0',type:'weight',from:gg.wS,target:gg.wT,start:dkey(new Date())});[25,50,75,100].forEach(f=>{if(cl['g:w:'+f])cl['og:w0:'+f]=1;});}
    if(gg.dT>0){o.game.myg.push({id:'d0',type:'km',target:gg.dT,start:gg.dFrom||dkey(new Date())});[25,50,75,100].forEach(f=>{if(cl['g:d:'+f])cl['og:d0:'+f]=1;});}}
  o.goalT=Object.assign({target:200000,years:15,init:null,rate:null},o.goalT||{});
  o.work=Object.assign({days:{},target:35},o.work||{});
  o.maxes=o.maxes||{};
  o.steps=o.steps||{};
  o.ci=Object.assign({init:1000,monthly:200,rate:7,years:20,freq:12},o.ci||{});
  if(!o.proj.monthly&&o.dca)o.proj.monthly=o.dca;
  if(!o.dca&&o.proj&&o.proj.monthly)o.dca=o.proj.monthly;
  if(!Array.isArray(o.scen)||!o.scen.length)o.scen=[
    {id:'s1',name:'Prudent',mode:'mix',tilt:-1,rate:5,years:o.proj.years||20,init:o.proj.init,monthly:null,infl:o.proj.infl},
    {id:'s2',name:'Central',mode:'mix',tilt:0,rate:7,years:o.proj.years||20,init:o.proj.init,monthly:null,infl:o.proj.infl},
    {id:'s3',name:'Optimiste',mode:'mix',tilt:1,rate:9,years:o.proj.years||20,init:o.proj.init,monthly:null,infl:o.proj.infl}];
  delete o.holdings;delete o.targets;delete o.log;delete o.wx;
  return o;
}

/* ================= state ================= */
let R={active:null,profiles:[],prefs:{accent:ACCENTS[0][1],theme:'auto'}},S;
try{
  const raw=localStorage.getItem(KEY),v3=localStorage.getItem('rythme_v3');
  if(raw)R=JSON.parse(raw);
  else if(v3){const o=JSON.parse(v3);R.profiles=o.profiles||[];R.active=o.active;}
}catch(e){}
R.prefs=Object.assign({accent:ACCENTS[0][1],theme:'auto'},R.prefs||{});
if(!R.profiles||!R.profiles.length)R.profiles=[{id:uid(),name:'Moi',data:blank()}];
if(!R.profiles.find(p=>p.id===R.active))R.active=R.profiles[0].id;
function useProfile(){const p=R.profiles.find(p=>p.id===R.active);p.data=migrate(p.data);S=p.data;}
useProfile();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(R));}catch(e){}};
const ui={tab:'today',gt:'quest',qs:'d',bv:'f',tl:'',_dir:0,money:'hub',sp:'over',plan:'month',open:{},draft:null,sel:null,pm:0,edraft:null,msg:'',sheet:false,per:'7',grp:null,wd:null,rc:{d:'',t:'',p:'',v:'',order:[],neg:false},fuel:{min:90}};

function applyPrefs(){
  const r=document.documentElement,p=R.prefs;
  r.style.setProperty('--accent',p.accent);
  if(p.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',p.theme);
}
applyPrefs();
function greet(){
  const n=new Date(),h=n.getHours(),sl=h<6?'Bonne nuit':h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';
  const a=R.profiles.find(p=>p.id===R.active);
  $('#greeting').innerHTML='<svg class="lg-pulse" viewBox="0 0 28 12" width="28" height="12" aria-hidden="true"><path d="M1 6h6l2-4 3 8 3-6 2 2h10"/></svg>'+esc(sl+', '+a.name);$('#profBtn').textContent=a.name.slice(0,1).toUpperCase();
}

/* ================= charts (inline SVG) ================= */
let gid=0;
function lineChart(pts,fy){
  if(!pts.length)return '';
  const W=340,H=160,pl=10,pr=10,pt=16,pb=24;
  const vals=pts.map(p=>p.v);let mn=Math.min(...vals),mx=Math.max(...vals);
  if(mn===mx){mn=mn*.9;mx=mx*1.1+1;}
  const X=i=>pts.length===1?W/2:pl+(W-pl-pr)*i/(pts.length-1);
  const Y=v=>pt+(H-pt-pb)*(1-(v-mn)/(mx-mn));
  const d=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.v).toFixed(1)).join(' ');
  const id='g'+(++gid);
  const area=pts.length>1?`<path d="${d} L${X(pts.length-1)} ${H-pb} L${X(0)} ${H-pb} Z" fill="url(#${id})"/>`:'';
  const step=Math.ceil(pts.length/5);
  const labs=pts.map((p,i)=>(i%step===0||i===pts.length-1)?`<text x="${X(i)}" y="${H-6}" font-size="10" text-anchor="middle" style="fill:var(--muted)">${p.l}</text>`:'').join('');
  const dots=pts.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.v)}" r="${i===pts.length-1?4:2.5}" style="fill:var(--tc)"/>`).join('');
  const hi=vals.indexOf(Math.max(...vals));
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Courbe"${scrubData(W,pt,H-pb,pts.map((_,i)=>X(i)),pts.map(p=>`<b>${esc(p.l)}</b>${esc((fy||fmt)(p.v))}`))}>
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--tc);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--tc);stop-opacity:0"/></linearGradient></defs>
    <line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>
    ${area}${pts.length>1?`<path d="${d}" fill="none" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--tc)"/>`:''}
    ${dots}${labs}
    <text x="${X(hi)}" y="${Y(vals[hi])-9}" font-size="10.5" text-anchor="${X(hi)<50?'start':X(hi)>W-50?'end':'middle'}" style="fill:var(--text)">${(fy||fmt)(vals[hi])}</text>
  </svg>`;
}
function barChart(items,o={}){
  if(!items.length)return '';
  const W=340,H=o.h||150,pl=6,pr=6,pt=18,pb=22,n=items.length;
  const mx=Math.max(o.max||0,...items.map(i=>i.v),1e-9),bw=(W-pl-pr)/n,w=Math.min(bw*.62,34);
  const Y=v=>pt+(H-pt-pb)*(1-v/mx);
  const bars=items.map((it,i)=>{const x=pl+bw*i+(bw-w)/2,y=Y(it.v),h=Math.max(H-pb-y,it.v>0?2:0);
    return `<rect x="${x.toFixed(1)}" y="${(H-pb-h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5" fill="${it.c||'var(--tc)'}"/>
    ${it.v>0&&n<=12?`<text x="${(x+w/2).toFixed(1)}" y="${(H-pb-h-5).toFixed(1)}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${(o.fy||fmtN)(it.v)}</text>`:''}
    <text x="${(x+w/2).toFixed(1)}" y="${H-6}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${it.l}</text>`;}).join('');
  const goal=o.goal?`<line x1="${pl}" x2="${W-pr}" y1="${Y(o.goal)}" y2="${Y(o.goal)}" stroke-dasharray="4 4" style="stroke:var(--muted)" opacity=".7"/><text x="${W-pr}" y="${Y(o.goal)-4}" font-size="9.5" text-anchor="end" style="fill:var(--muted)">${o.goalLabel||''}</text>`:'';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Histogramme"><line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>${goal}${bars}</svg>`;
}
function stackBars(items,o={}){
  if(!items.length)return '';
  const W=340,H=o.h||150,pl=6,pr=6,pt=14,pb=22,n=items.length;
  const tot=items.map(i=>sum(i.parts.map(p=>p.v)));
  const mx=Math.max(...tot,1e-9),bw=(W-pl-pr)/n,w=Math.min(bw*.62,34);
  const bars=items.map((it,i)=>{const x=pl+bw*i+(bw-w)/2;let y=H-pb;
    const segs=it.parts.filter(p=>p.v>0).map(p=>{const h=(H-pt-pb)*p.v/mx;y-=h;return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(h-1,1).toFixed(1)}" rx="3" fill="${p.c}"/>`;}).join('');
    return segs+`<text x="${(x+w/2).toFixed(1)}" y="${H-6}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${it.l}</text>`;}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Histogramme empilé"><line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>${bars}</svg>`;
}
function multiLine(series,xl,fy){
  const W=340,H=190,pl=10,pr=10,pt=14,pb=24,n=xl.length;
  const all=series.flatMap(s=>s.v);let mx=Math.max(...all,1);
  const X=i=>n===1?W/2:pl+(W-pl-pr)*i/(n-1),Y=v=>pt+(H-pt-pb)*(1-v/mx);
  const step=Math.ceil(n/6);
  const labs=xl.map((l,i)=>(i%step===0||i===n-1)?`<text x="${X(i)}" y="${H-6}" font-size="10" text-anchor="middle" style="fill:var(--muted)">${l}</text>`:'').join('');
  const grid=[.25,.5,.75,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(mx*f)}" y2="${Y(mx*f)}" style="stroke:var(--border)"/>`).join('');
  const lines=series.map(s=>{const d=s.v.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
    const last=s.v[s.v.length-1];
    return `<path d="${d}" fill="none" stroke="${s.c}" stroke-width="${s.w||2.2}" ${s.dash?'stroke-dasharray="5 4"':''} stroke-linejoin="round" stroke-linecap="round"/><circle cx="${X(n-1)}" cy="${Y(last)}" r="3.5" fill="${s.c}"/>`;}).join('');
  const F=fy||fmtK;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Projection"${scrubData(W,pt,H-pb,xl.map((_,i)=>X(i)),xl.map((l,i)=>`<b>${esc(l)}</b>`+series.filter(s=>s.n).map(s=>`<span><i style="background:${s.c}"></i>${esc(s.n)} ${esc(F(s.v[i]))}</span>`).join('')))}>${grid}<line x1="${pl}" x2="${W-pr}" y1="${H-pb}" y2="${H-pb}" style="stroke:var(--border)"/>${lines}${labs}</svg>`;
}
function donut(segs,center){
  const tot=sum(segs.map(x=>x.v));const r=44,C=2*Math.PI*r;let off=0;
  const arcs=tot>0?segs.filter(s=>s.v>0).map(s=>{const l=s.v/tot*C;const a=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="${s.c}" stroke-width="14" stroke-dasharray="${Math.max(l-1.5,0)} ${C}" stroke-dashoffset="${-off}"/>`;off+=l;return a;}).join(''):'';
  return `<div style="position:relative;width:128px;height:128px;flex:none"><svg viewBox="0 0 120 120" width="128" height="128" style="transform:rotate(-90deg)"><circle cx="60" cy="60" r="${r}" fill="none" style="stroke:var(--surface-3)" stroke-width="14"/>${arcs}</svg>${center?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;color:var(--muted)">${center}</div>`:''}</div>`;
}
function ring(p,col,size=104,sw=10,track){
  const r=40,C=2*Math.PI*r,v=Math.max(Math.min(p,1),0);
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><circle cx="50" cy="50" r="${r}" fill="none" style="stroke:${track||'var(--surface-3)'}" stroke-width="${sw}"/><circle cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${v*C} ${C}" transform="rotate(-90 50 50)"/></svg>`;
}
function radar(labels,vals,col){
  const W=300,H=240,cx=W/2,cy=H/2+4,R0=82,n=labels.length;
  const P=(i,f)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*R0*f,cy+Math.sin(a)*R0*f];};
  const rings=[.33,.66,1].map(f=>`<polygon points="${labels.map((_,i)=>P(i,f).join(',')).join(' ')}" fill="none" style="stroke:var(--border)"/>`).join('');
  const axes=labels.map((_,i)=>{const p=P(i,1);return `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" style="stroke:var(--border)"/>`;}).join('');
  const poly=labels.map((_,i)=>P(i,Math.max(vals[i],.04)).join(',')).join(' ');
  const labs=labels.map((l,i)=>{const p=P(i,1.2);return `<text x="${p[0]}" y="${p[1]+3}" font-size="10.5" text-anchor="middle" style="fill:var(--muted)">${l}</text>`;}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Radar">${rings}${axes}<polygon points="${poly}" fill="${col}" fill-opacity=".25" stroke="${col}" stroke-width="2"/>${labs}</svg>`;
}

/* ================= data helpers ================= */
const wOn=d=>S.workouts.filter(w=>w.date===d);
const weight=()=>S.profile?S.profile.weight:75;
function kcal(w){
  const h=w.min/60;let met=5;
  if(w.type==='course'){const sp=w.dist>0?w.dist/h:9;met=Math.max(6,Math.min(14,sp*1.03));}
  else if(w.type==='muscu')met=5;else if(w.type==='padel')met=6.5;else met=5;
  return met*weight()*h;
}
function pace(w){if(!(w.dist>0))return '';return mmss(w.min/w.dist)+'/km';}
function mmss(m){let a=Math.floor(m),b=Math.round((m-a)*60);if(b===60){a++;b=0;}return a+':'+pad(b);}
function lastDays(n){const a=[];for(let i=n-1;i>=0;i--)a.push(addD(todayK(),-i));return a;}
function streak(){let s=0,k=todayK();if(!wOn(k).length)k=addD(k,-1);while(wOn(k).length){s++;k=addD(k,-1);}return s;}
function maxStreak(){const ds=[...new Set(S.workouts.map(w=>w.date))].sort();let b=0,c=0,p=null;ds.forEach(d=>{c=(p&&addD(p,1)===d)?c+1:1;if(c>b)b=c;p=d;});return b;}
const wk=d=>{const x=new Date(d+'T12:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return dkey(x);};
function weeks(n){const a=[],x=wk(todayK());for(let i=n-1;i>=0;i--)a.push(addD(x,-7*i));return a;}
const weekSeries=(f,n=8)=>weeks(n).map(k=>({l:dShort(k),v:sum(S.workouts.filter(w=>wk(w.date)===k).map(f))}));
const inDays=days=>S.workouts.filter(w=>days.includes(w.date));
const incSorted=()=>S.incomes.slice().sort((a,b)=>a.m<b.m?-1:1);
const monthTotals=()=>{const m={};S.incomes.forEach(i=>{m[i.m]=(m[i.m]||0)+i.amount;});return Object.keys(m).sort().map(k=>({m:k,amount:m[k]}));};
function mortgage(p){
  const emprunt=Math.max(p.prix+p.notaire-p.apport,0),r=p.taux/100/12,n=p.duree*12;
  const f=n>0?(r>0?r/(1-Math.pow(1+r,-n)):1/n):0;
  const cap=emprunt*f,assu=emprunt*p.assu/100/12;
  return{emprunt,cap,assu,mens:cap+assu,interets:Math.max(cap*n-emprunt,0),assuTot:assu*n,n,f};
}
const dow=k=>new Date(k+'T12:00').getDay();
function evOn(k){
  return (S.events||[]).filter(e=>{
    if(e.date===k)return true;
    if(e.end&&e.date<k&&k<=e.end)return true;
    if(e.rep==='w'&&e.date<k&&dow(e.date)===dow(k))return true;
    if(e.rep==='y'&&e.date<k&&e.date.slice(5)===k.slice(5))return true;
    return false;
  }).sort((a,b)=>(a.time||'')<(b.time||'')?-1:(a.time||'')>(b.time||'')?1:0);
}
const hm=e=>{if(e.end)return dShort(e.date)+' au '+dShort(e.end);if(!e.time)return 'Toute la journée';if(!(e.dur>0))return e.time;const [h,m]=e.time.split(':').map(Number),t=h*60+m+e.dur;return e.time+' – '+pad(Math.floor(t/60)%24)+':'+pad(t%60);};


/* ================= v13 : visuel pétillant, cercle d'amis, carte à partager, repos, records ================= */
/* --- décor --- */
function visInit(){
  try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('portrait').catch(()=>{});}catch(e){}
  document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
  addEventListener('resize',placePill);
  setInterval(restTick,500);
  addEventListener('scroll',onScroll,{passive:true});swipeInit();scrubInit();
  setTimeout(placePill,300);
  setTimeout(()=>syncSteps(true),1500);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncSteps(false);});
}
function placePill(){
  const t=document.querySelector('.tab.on'),p=$('#tabpill');if(!t||!p)return;
  const i=t.parentElement.getBoundingClientRect(),r=t.getBoundingClientRect();
  p.style.width=(r.width-6)+'px';p.style.transform='translateX('+(r.left-i.left+3)+'px)';p.style.opacity=1;
}
function decorate(){
  const tt=document.querySelector('.tab[data-id=today]');if(tt)tt.classList.toggle('due',!!punchDue());
  onScroll();
}
/* --- titre compact façon iOS --- */
const TABT={today:'Aujourd\'hui',plan:'Planning',sport:'Sport',food:'Nutrition',money:'Argent'};
function onScroll(){
  const c=$('#ctitle');if(!c)return;
  const h=document.querySelector('#main h1.page'),lim=h?h.getBoundingClientRect().bottom<44:scrollY>150;
  const txt=h?h.textContent:TABT[ui.tab];
  if(c.firstChild.textContent!==txt)c.firstChild.textContent=txt;
  c.classList.toggle('on',lim);
}
/* --- glisser depuis le bord gauche pour revenir --- */
function swipeInit(){
  let x0=null,y0=0,dx=0;const main=()=>$('#main');
  addEventListener('touchstart',e=>{const t=e.touches[0];if(t.clientX<26&&$('#main .back')){x0=t.clientX;y0=t.clientY;dx=0;}else x0=null;},{passive:true});
  addEventListener('touchmove',e=>{if(x0==null)return;const t=e.touches[0];dx=t.clientX-x0;if(Math.abs(t.clientY-y0)>70){x0=null;main().style.transform='';return;}if(dx>0){main().style.transition='none';main().style.transform='translateX('+Math.min(dx*.6,160)+'px)';}},{passive:true});
  addEventListener('touchend',()=>{if(x0==null)return;const m=main();m.style.transition='transform .3s cubic-bezier(.2,.8,.2,1)';m.style.transform='';x0=null;if(dx>80){const b=$('#main .back');if(b)b.click();}setTimeout(()=>{m.style.transition='';},320);},{passive:true});
}
/* --- graphiques : glisser le doigt pour lire les valeurs --- */
function scrubData(W,top,bot,xs,rows){return ` data-scrub="${esc(JSON.stringify({w:W,t:top,b:bot,x:xs.map(v=>Math.round(v*10)/10),r:rows}))}"`;}
function scrubInit(){
  let tmo=null;
  const show=e=>{
    const svg=e.target.closest&&e.target.closest('svg[data-scrub]');if(!svg)return;
    let d=svg._sd;if(!d){try{d=svg._sd=JSON.parse(svg.getAttribute('data-scrub'));}catch(er){return;}}
    const r=svg.getBoundingClientRect(),vx=(e.clientX-r.left)/r.width*d.w;
    let i=0,best=1e9;d.x.forEach((x,k)=>{const dd=Math.abs(x-vx);if(dd<best){best=dd;i=k;}});
    let g=svg.querySelector('.scg');
    if(!g){svg.insertAdjacentHTML('beforeend',`<g class="scg"><line y1="${d.t}" y2="${d.b}"/></g>`);g=svg.querySelector('.scg');}
    const ln=g.querySelector('line');ln.setAttribute('x1',d.x[i]);ln.setAttribute('x2',d.x[i]);g.classList.add('on');
    const host=svg.parentElement;if(getComputedStyle(host).position==='static')host.style.position='relative';
    let tip=host.querySelector(':scope>.sctip');if(!tip){tip=document.createElement('div');tip.className='sctip';host.appendChild(tip);}
    if(tip._i!==i){tip.innerHTML=d.r[i];tip._i=i;}
    const hr=host.getBoundingClientRect(),px=r.left-hr.left+d.x[i]/d.w*r.width;
    tip.style.left=Math.max(4,Math.min(px-tip.offsetWidth/2,hr.width-tip.offsetWidth-4))+'px';tip.style.top=(r.top-hr.top-6)+'px';tip.classList.add('on');
    clearTimeout(tmo);
  };
  const hide=()=>{clearTimeout(tmo);tmo=setTimeout(()=>{document.querySelectorAll('.scg.on,.sctip.on').forEach(x=>x.classList.remove('on'));},1400);};
  document.addEventListener('pointerdown',show,{passive:true});
  document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons||e.pressure>0)show(e);},{passive:true});
  document.addEventListener('pointerup',hide,{passive:true});document.addEventListener('pointercancel',hide,{passive:true});
}
/* --- anneaux d'activité (Ma journée) --- */
function actRings(list,size){
  const c=size/2;let h='',defs='';
  list.forEach((r,i)=>{const rad=c-9-i*15,L=2*Math.PI*rad,p=Math.max(0,Math.min(r.p,1)),id='ar'+i+(++gid);
    defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${r.c1}"/><stop offset="1" stop-color="${r.c2}"/></linearGradient>`;
    h+=`<circle cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="${r.c1}" stroke-opacity=".22" stroke-width="12"/>`+
      `<circle class="arc" cx="${c}" cy="${c}" r="${rad}" fill="none" stroke="url(#${id})" stroke-width="12" stroke-linecap="round" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L*(1-p)).toFixed(1)}" style="--L:${L.toFixed(1)};animation-delay:${.15+i*.15}s"/>`+
      (r.p>1?`<circle cx="${c}" cy="${c-rad}" r="6" fill="${r.c2}"/>`:'');});
  return `<svg class="arings" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true"><defs>${defs}</defs><g transform="rotate(-90 ${c} ${c})">${h}</g></svg>`;
}
/* --- minuteur de repos --- */
function restStart(sec){ui.rest={end:Date.now()+sec*1000,tot:sec};const el=$('#rest');if(el)el.remove();restTick();}
function restTick(){
  let el=$('#rest');
  if(!ui.rest){if(el)el.remove();return;}
  const left=Math.ceil((ui.rest.end-Date.now())/1000);
  if(left<=0){const t=ui.rest.tot;ui.rest=null;if(el)el.remove();toast('Repos terminé');burst(innerWidth/2,innerHeight*0.6,22);try{navigator.vibrate&&navigator.vibrate([180,90,180]);}catch(e){}return;}
  if(!el){el=document.createElement('div');el.id='rest';el.className='restp';el.innerHTML='<i class="rbar"></i><span>Repos</span><b></b><button data-act="restx" aria-label="Arrêter le repos">×</button>';document.body.appendChild(el);}
  el.querySelector('b').textContent=Math.floor(left/60)+':'+pad(left%60);
  el.querySelector('.rbar').style.width=Math.max(0,Math.min(100,(1-left/ui.rest.tot)*100))+'%';
}
/* --- records personnels (muscu) --- */
function prCheck(exs){
  const best={};
  S.workouts.forEach(w=>(w.exs||[]).forEach(x=>x.sets.forEach(s=>{if(s.kg>0){const v=e1rm(s.kg,s.reps);if(!(best[x.name]>=v))best[x.name]=v;}})));
  const out=[];
  exs.forEach(x=>{let b=null;x.sets.forEach(s=>{if(s.kg>0){const v=e1rm(s.kg,s.reps);if(!b||v>b.v)b={v,kg:s.kg,reps:s.reps};}});
    if(b&&best[x.name]>0&&b.v>best[x.name]+0.01)out.push({name:x.name,kg:b.kg,reps:b.reps});});
  return out;
}


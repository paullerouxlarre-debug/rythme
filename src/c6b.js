
/* ================= v13 : visuel pétillant, cercle d'amis, carte à partager, repos, records ================= */
/* --- décor --- */
function visInit(){
  document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
  const sp=$('#splash');if(sp){setTimeout(()=>sp.classList.add('out'),1000);setTimeout(()=>sp.remove(),1900);}
  addEventListener('resize',placePill);
  setInterval(restTick,500);
  addEventListener('scroll',onScroll,{passive:true});swipeInit();scrubInit();
  if(moodNow()==='sleepy'&&G().wb!==todayK()){G().wb=todayK();saveSoon();setTimeout(()=>toast('Content de te revoir · 10 min suffisent pour relancer'),2600);}
  setTimeout(placePill,300);
}
function placePill(){
  const t=document.querySelector('.tab.on'),p=$('#tabpill');if(!t||!p)return;
  const i=t.parentElement.getBoundingClientRect(),r=t.getBoundingClientRect();
  p.style.width=(r.width-6)+'px';p.style.transform='translateX('+(r.left-i.left+3)+'px)';p.style.opacity=1;
}
function decorate(){
  document.querySelectorAll('#main .hero2:not(.hb-done)').forEach(h=>{h.classList.add('hb-done');h.insertAdjacentHTML('afterbegin','<span class="hsh"></span>');});
  const n=objectives().filter(o=>o.done&&!o.claimed).length+(chestInfo().can?1:0),t=document.querySelector('.tab[data-id=game]');
  if(t){let b=t.querySelector('.tbdg');if(n>0){if(!b){b=document.createElement('i');b.className='tbdg';t.appendChild(b);}if(b.textContent!==String(n)){b.textContent=n;b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');}}else if(b)b.remove();}
  const tt=document.querySelector('.tab[data-id=today]');if(tt)tt.classList.toggle('due',!!punchDue());
  onScroll();
}
/* --- titre compact façon iOS --- */
const TABT={game:'Progrès',today:'Ma journée',plan:'Planning',sport:'Muscle',food:'Nutrition',money:'Tendance'};
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
/* --- carte de stats à partager --- */
function shareBtnCard(){
  return `<button class="toolrow" style="margin:0" data-act="sharecard"><span class="tico" style="background:linear-gradient(135deg,#8A4BFF,#FF4FA3)"><svg viewBox="0 0 24 24"><path d="M12 15V3M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/></svg></span><span style="flex:1;min-width:0;text-align:left"><b>Ma carte de stats</b><small>Une image souvenir de ta progression</small></span><span class="chev">›</span></button>`;
}
function makeCard(){
  return new Promise((res,rej)=>{
    const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    const L=glevel(),st=STAGES[L.stage-1],b=myBoard();
    const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,st.sky[0]);g.addColorStop(.45,st.sky[1]);g.addColorStop(.8,st.sky[2]);g.addColorStop(1,st.sky[3]);
    x.fillStyle=g;x.fillRect(0,0,W,H);
    for(let i=0;i<46;i++){const r=6+Math.random()*30;x.beginPath();x.arc(Math.random()*W,Math.random()*H,r,0,7);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=2;x.stroke();x.fillStyle='rgba(255,255,255,.07)';x.fill();}
    x.fillStyle='#fff';x.font='800 64px -apple-system,Inter,sans-serif';x.fillText('Rythme',70,125);
    x.font='600 34px -apple-system,Inter,sans-serif';x.fillStyle='rgba(255,255,255,.8)';x.fillText(new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),70,175);
    const svg=mascot(L.stage,G().skin,'card').replace('<svg','<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"');
    const img=new Image();
    img.onload=()=>{
      x.drawImage(img,220,220,640,640);
      x.textAlign='center';x.fillStyle='#fff';x.font='800 92px -apple-system,Inter,sans-serif';x.fillText(b.n,W/2,960);
      x.font='600 44px -apple-system,Inter,sans-serif';x.fillStyle='rgba(255,255,255,.85)';x.fillText('Niveau '+L.l+' · '+st.n,W/2,1025);
      const T=[['Étoiles',fmtN(G().life)],['Série',b.st+' j'],['Séances',String(b.ws)],['Km',fmtN(b.km,1)]];
      T.forEach((t,i)=>{const bx=70+i*250,by=1090,bw=230,bh=190;x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,36):x.rect(bx,by,bw,bh);x.fill();
        x.fillStyle='#fff';x.font='800 58px -apple-system,Inter,sans-serif';x.fillText(t[1],bx+bw/2,by+92);x.font='600 30px -apple-system,Inter,sans-serif';x.fillStyle='rgba(255,255,255,.8)';x.fillText(t[0],bx+bw/2,by+142);});
      x.textAlign='left';
      c.toBlob(bl=>bl?res(bl):rej(new Error('blob')),'image/png');
    };
    img.onerror=()=>rej(new Error('img'));
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  });
}
async function shareCard(){
  try{const bl=await makeCard();await saveFile('rythme-carte.png',bl);toast('Carte prête');}
  catch(e){if(!e||e.code!=='declined')toast('Impossible de créer la carte');}
}
window._dbg={makeCard};

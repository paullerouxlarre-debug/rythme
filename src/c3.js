
/* ================= retours visuels ================= */
function burst(){}  /* plus de confettis : la confirmation passe par le toast */
function toast(msg){
  const fx=$('#fx');if(!fx)return;
  fx.querySelectorAll('.toast').forEach(t=>t.remove());
  const t=document.createElement('div');t.className='toast';t.textContent=msg;fx.appendChild(t);setTimeout(()=>t.remove(),2600);
}
let _st=null;
const saveSoon=()=>{if(_st)return;_st=setTimeout(()=>{_st=null;save();},1500);};

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
const curWeight=()=>{const w=(S.wlog||[]).slice(-1)[0];return w?w.kg:(S.profile?S.profile.weight:0);};

/* actualisation des valeurs qui bougent avec l'heure (pointage) */
let _pdk='';
function gLive(){
  const pd=punchDue(),pk=pd?pd.key:'';if(pk!==_pdk){const first=_pdk==='';_pdk=pk;if(!first&&ui.tab==='today'&&!document.querySelector('input:focus'))render();else decorate();setTimeout(duePopup,first?1600:300);}
  const pn=$('#pdnow');if(pn)pn.textContent=hhmm();
  const wl=$('#wlive');if(wl){const r=S.work.days[todayK()];wl.textContent=fmtH(workMin(r,true));}
}

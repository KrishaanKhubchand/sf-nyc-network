const CONVEX='https://groovy-labrador-571.convex.cloud';
const SHORT={itzsuds:'Suds',aashay:'Aashay',zack:'Zack',sdand:'Surya',gokulr:'Gokul',ziperski:'Ziperski'};
const ROLES=['founders','operators','investors'];
const MEGA=250000;
const TIERS=[['all','All',0,1e12],['50k','50K+',50000,1e12],['20k','20–50K',20000,50000],['10k','10–20K',10000,20000],['5k','5–10K',5000,10000],['1k','1–5K',1000,5000],['100','100–1K',100,1000],['0','<100',0,100]];
async function cx(kind,path,args={}){const r=await fetch(`${CONVEX}/api/${kind}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,args,format:'json'})});const d=await r.json();if(d.status!=='success')throw new Error(d.errorMessage);return d.value}
async function loadData(){return (await fetch('data.json')).json()}
async function loadHearts(){try{return new Set((await cx('query','hearts:list')).map(h=>h.handle))}catch(e){console.error(e);return new Set()}}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>n.toLocaleString('en-US');
const k=n=>n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(n>=1e4?0:1)+'K':String(n);
const YOUSRC={kfollowing:'You follow',kfollowers:'Your followers',kmutual:'Mutuals'};
const yy=p=>p.y||[];
const rel=p=>yy(p).length===2?'mutual':yy(p).includes('kfollowing')?'following':yy(p).includes('kfollowers')?'follower':'none';
const BADGE={mutual:'<span class="yo-b yo-m">Mutual</span>',following:'<span class="yo-b yo-f">You follow</span>',follower:'<span class="yo-b yo-fb">Follows you</span>',none:''};
function srcLabel(lists,key){if(YOUSRC[key])return YOUSRC[key];if(key==='all')return 'All 6 lists';if(key==='multi')return 'In 2+ lists';if(key==='shortlist')return 'Shortlist';const l=lists.find(x=>x.key===key);return SHORT[key]+(l.rel==='following'?' follows':' · followers')}
function inSrc(p,key){if(key==='shortlist')return true;if(key==='kmutual')return yy(p).length===2;if(key==='kfollowing'||key==='kfollowers')return yy(p).includes(key);if(key==='all')return p.s.length>0;return key==='multi'?p.s.length>1:p.s.includes(key)}
// ── List status tracker (listStatus table; key = "src|city|role"; missing = todo) ──
const STL={todo:'To do',processing:'Processing',done:'Done',skipped:'Skipped'};
const STO=['todo','processing','done','skipped'];
const cap1=s=>s[0].toUpperCase()+s.slice(1);
function groupsOf(D){return [['kfollowing','You follow','@krishkhubchand · pulled Sep 22'],['kfollowers','Your followers','pulled Jul 18'],['kmutual','Mutuals','you follow each other'],...D.lists.map(l=>[l.key,SHORT[l.key],(l.rel==='following'?'follows':'followers of')+' · '+l.label]),['all','All 6 lists','deduped'],['multi','In 2+ lists','people several of them know']]}
function listKeys(D,city){const o=[];for(const [key] of groupsOf(D))for(const r of ROLES)o.push(`${key}|${city}|${r}`);return o}
function listName(D,k){const [src,c,r]=k.split('|');const g=groupsOf(D).find(x=>x[0]===src);return `${g?g[1]:src} · ${c} · ${cap1(r)}`}
function listHref(k){const [src,c,r]=k.split('|');return `list.html?src=${src}&city=${c}&role=${r}`}
async function loadStatus(){try{return Object.fromEntries((await cx('query','listStatus:list')).map(r=>[r.key,r.status]))}catch(e){console.error(e);return {}}}
const stOf=(M,k)=>M[k]||'todo';
async function saveStatus(M,k,s){const was=stOf(M,k);if(s==='todo')delete M[k];else M[k]=s;try{await cx('mutation','listStatus:set',{key:k,status:s});return true}catch(e){if(was==='todo')delete M[k];else M[k]=was;alert('Couldn’t save status — try again');return false}}
// Handles of everyone in a list marked Done (optionally ignoring one list)
function doneSet(D,M,except){const keys=Object.keys(M).filter(k=>M[k]==='done'&&k!==except).map(k=>k.split('|'));const s=new Set();if(!keys.length)return s;for(const p of D.people)for(const [src,c,r] of keys)if(p.c===c&&p.r===r&&inSrc(p,src)){s.add(p.u);break}return s}
function nextTodo(D,M,cur,city){const ks=listKeys(D,city).filter(k=>k!==cur);const i=listKeys(D,city).indexOf(cur);const ord=i<0?ks:[...ks.slice(i),...ks.slice(0,i)];return ord.find(k=>stOf(M,k)==='todo')||null}
const lsPill=(k,s)=>`<button class="ls-p ls-${s}" data-k="${k}" onclick="event.stopPropagation();lsMenu(this)">${s==='done'?'✓ ':''}${STL[s]}<i>▾</i></button>`;
// One floating menu on <body> so the table's overflow can't clip it
function lsMenu(btn){
  lsClose();const k=btn.dataset.k,cur=stOf(window.LSM,k),r=btn.getBoundingClientRect();
  const m=document.createElement('div');m.className='ls-menu';m.id='lsmenu';
  m.innerHTML=STO.map(x=>`<div class="ls-mi${x===cur?' on':''}" data-s="${x}"><span class="ls-p ls-${x}">${x==='done'?'✓ ':''}${STL[x]}</span>${x===cur?'<b>✓</b>':''}</div>`).join('');
  document.body.appendChild(m);
  const top=r.bottom+window.scrollY+4, mh=m.offsetHeight;
  m.style.top=(r.bottom+mh+8>window.innerHeight?r.top+window.scrollY-mh-4:top)+'px';
  m.style.left=Math.max(8,Math.min(r.right+window.scrollX-m.offsetWidth,window.innerWidth-m.offsetWidth-8))+'px';
  m.onclick=async e=>{e.stopPropagation();const it=e.target.closest('.ls-mi');if(!it)return;lsClose();const s=it.dataset.s;if(s===cur)return;
    const p=saveStatus(window.LSM,k,s);window.lsRender&&window.lsRender();if(!(await p))window.lsRender&&window.lsRender()};
}
function lsClose(){const m=document.getElementById('lsmenu');if(m)m.remove()}
document.addEventListener('click',lsClose);window.addEventListener('resize',lsClose);
document.addEventListener('keydown',e=>{if(e.key==='Escape')lsClose()});

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

window.MOCK_ST={'kfollowing|SF|investors':'done','kfollowing|SF|founders':'processing','itzsuds|SF|investors':'done','aashay|SF|investors':'processing','kfollowers|SF|operators':'skipped'};
window.STL={todo:'To do',processing:'Processing',done:'Done',skipped:'Skipped'};
window.stOf=k=>MOCK_ST[k]||'todo';
window.doneSet=()=>{const s=new Set();for(const [k,v] of Object.entries(MOCK_ST)){if(v!=='done')continue;const [src,c,r]=k.split('|');for(const p of D.people)if(p.c===c&&p.r===r&&inSrc(p,src))s.add(p.u)}return s};
window.pill=(k,menu)=>{const s=stOf(k);return `<span class="ls-wrap"><button class="ls-p ls-${s}" onclick="event.stopPropagation()">${s==='done'?'✓ ':''}${STL[s]} <i>▾</i></button>${menu?`<div class="ls-menu">${Object.keys(STL).map(x=>`<div class="ls-mi${x===s?' on':''}"><span class="ls-p ls-${x}">${x==='done'?'✓ ':''}${STL[x]}</span>${x===s?'<b>✓</b>':''}</div>`).join('')}</div>`:''}</span>`};
const css=`@media (max-width:600px){.ls-ph{display:none}.ls-p{font-size:11px;padding:2px 7px}.ls-p i{display:none}.rw-t td.ls-c{padding-right:10px}}
.ls-p{font:inherit;font-size:12px;font-weight:550;padding:3px 9px;border-radius:20px;border:1px solid transparent;cursor:pointer;white-space:nowrap;background:none}
.ls-p i{font-style:normal;font-size:9px;opacity:.55;margin-left:2px}
.ls-todo{border-color:#dcdcd6;color:#6b6b6b;background:#fff}.ls-processing{background:#fff3d6;color:#8a5a00}.ls-done{background:#e3f6ea;color:#16703a}.ls-skipped{background:#f1f1ed;color:#9a9a95;text-decoration:line-through}
.ls-wrap{position:relative;display:inline-block}
.ls-menu{position:absolute;right:0;top:30px;background:#fff;border:1px solid #e0e0db;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:6px;z-index:20;min-width:160px;text-align:left}
.ls-mi{display:flex;justify-content:space-between;align-items:center;padding:7px 8px;border-radius:7px}.ls-mi.on{background:#f6f6f4}.ls-mi b{font-size:12px;color:#1c1c1c}
.ls-sum{background:#fff;border:1px solid #e6e6e2;border-radius:10px;padding:12px 14px;margin:0 0 10px}
.ls-sum .ls-l{font-size:13px;color:#4a4a46;margin-top:8px}.ls-sum .ls-l b{color:#1c1c1c;font-weight:650}
.ls-bar{height:6px;border-radius:6px;background:#efefea;overflow:hidden;display:flex}.ls-bar span{display:block;height:100%}
tr.rw-r.ls-dim td{color:#9a9a95}tr.rw-r.ls-dim td a{color:#8aa0d6}
.rw-t td.ls-c{text-align:right;width:1%}
.ls-new{color:#2b59c3;font-weight:550}
.ls-ht{color:#e0245e}
.ls-nextbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;background:#fff;border:1px solid #e6e6e2;border-radius:10px;padding:12px 14px;margin-top:10px;font-size:13px;color:#4a4a46}
.ls-seg a.ls-on-processing{background:#fff3d6;color:#8a5a00}.ls-seg a.ls-on-done{background:#16703a;color:#fff}
`;
const st_=document.createElement('style');st_.textContent=css;document.head.appendChild(st_);

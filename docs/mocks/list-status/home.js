window.render=function(){
  document.querySelector('.wrap').style.maxWidth='1040px';
  const MENU=window.MENU_KEY||'';
  const cities=st.city==='all'?['SF','NYC']:[st.city], roles=st.role==='all'?ROLES:[st.role];
  document.getElementById('flt').innerHTML=`<div class="seg">${['all','SF','NYC'].map(c=>`<a class="${c===st.city?'on':''}">${c==='all'?'All':c}</a>`).join('')}</div><div class="seg">${['all',...ROLES].map(r=>`<a class="${r===st.role?'on':''}">${r==='all'?'All roles':cap(r)}</a>`).join('')}</div>`;
  const groups=[['kfollowing','You follow','@krishkhubchand · pulled Sep 22'],['kfollowers','Your followers','pulled Jul 18'],['kmutual','Mutuals','you follow each other'],...D.lists.map(l=>[l.key,SHORT[l.key],(l.rel==='following'?'follows':'followers of')+' · '+l.label]),['all','All 6 lists','deduped'],['multi','In 2+ lists','people several of them know']];
  const DS=doneSet(); const cnt={todo:0,processing:0,done:0,skipped:0}; const SF=window.STATUS_FILTER||'all';
  let h='<tr><th>List</th><th class="rw-hide">City</th><th class="rw-hide">Role</th><th class="rw-n ls-ph">People</th><th class="rw-n rw-hide" title="In 2+ of the 6 network lists">2+ lists</th><th class="rw-n rw-hide">1K–20K</th><th class="rw-n" title="Not in any list you marked Done">New</th><th class="rw-n rw-hide">♥</th><th class="rw-n">Status</th></tr>', n=0, body='';
  for(const [key,name,sub] of groups){
    let gh='';
    for(const c of cities) for(const r of roles){
      const k2=`${key}|${c}|${r}`, s=stOf(k2); cnt[s]++; n++;
      if(SF!=='all'&&s!==SF) continue;
      const sl=P.filter(p=>p.c===c&&p.r===r&&inSrc(p,key));
      const nw=s==='done'?'<span class="rw-m">—</span>':`<span class="ls-new">${fmt(sl.filter(p=>!DS.has(p.u)).length)}</span>`;
      const ht=sl.filter(p=>H.has(p.u.toLowerCase())).length;
      gh+=`<tr class="rw-r${s==='done'||s==='skipped'?' ls-dim':''}"><td><a>${name} · ${c} · ${cap(r)}</a></td><td class="rw-hide"><span class="rw-pill ${c==='SF'?'rw-sf':'rw-ny'}">${c}</span></td><td class="rw-hide">${cap(r)}</td><td class="rw-n ls-ph">${fmt(sl.length)}</td><td class="rw-n rw-m rw-hide">${fmt(sl.filter(p=>p.s.length>1).length)}</td><td class="rw-n rw-m rw-hide">${fmt(sl.filter(p=>p.f>=1000&&p.f<20000).length)}</td><td class="rw-n">${nw}</td><td class="rw-n rw-hide">${ht?`<span class="ls-ht">♥ ${ht}</span>`:'<span class="rw-m">·</span>'}</td><td class="ls-c">${pill(k2,k2===MENU)}</td></tr>`;
    }
    if(gh) body+=`<tr class="rw-g${YOUSRC[key]?' rw-you':''}"><td colspan="9">${name}<span>${sub}</span></td></tr>`+gh;
  }
  document.getElementById('tb').innerHTML=h+body;
  document.getElementById('sub').textContent=`${n} lists · one row per list, click to open it · 250K+ accounts left out of counts`;
  const pc=x=>(100*cnt[x]/n).toFixed(1)+'%';
  const sum=document.createElement('div');sum.className='ls-sum';
  sum.innerHTML=`<div class="ls-bar"><span style="width:${pc('done')};background:#2f9e5b"></span><span style="width:${pc('processing')};background:#e9b44c"></span><span style="width:${pc('skipped')};background:#cfcfca"></span></div><div class="ls-l"><b>${cnt.done} of ${n} ${st.city==='all'?'':st.city+' '}lists done</b> · ${cnt.processing} processing · ${cnt.skipped} skipped · ${cnt.todo} to do</div>`;
  const flt=document.getElementById('flt'); flt.parentNode.insertBefore(sum,flt.nextSibling);
  const sb=document.createElement('div');sb.className='bar';
  sb.innerHTML=`<span class="lab">Status</span><div class="seg">${[['all','All',n],['todo','To do',cnt.todo],['processing','Processing',cnt.processing],['done','Done',cnt.done],['skipped','Skipped',cnt.skipped]].map(([a,l,c])=>`<a class="${a===SF?'on':''}">${l}<span class="c">${c}</span></a>`).join('')}</div>`;
  sum.parentNode.insertBefore(sb,sum.nextSibling);
  window.CNT=cnt;
};
render();

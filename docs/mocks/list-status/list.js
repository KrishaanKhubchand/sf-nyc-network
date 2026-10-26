(function(){
  const k2=`${st.src}|${st.city}|${st.role}`, s=stOf(k2), DS=doneSet();
  const b=D.people.filter(p=>inSrc(p,st.src)&&p.f<MEGA&&p.c===st.city&&p.r===st.role);
  const seen=b.filter(p=>DS.has(p.u)).length;
  $('sub').textContent+=' ';
  const bar=document.createElement('div');bar.className='bar';
  bar.innerHTML=`<span class="lab">Status</span><div class="seg ls-seg">${Object.keys(STL).map(x=>`<a class="${x===s?'on ls-on-'+x:''}">${x==='done'?'✓ ':''}${STL[x]}</a>`).join('')}</div><span class="lab" style="margin-left:4px">Changes save for everyone with the link</span>`;
  const sub=$('sub'); sub.parentNode.insertBefore(bar,sub.nextSibling);
  sub.innerHTML=sub.innerHTML.replace(' · everyone’s on the page, just scroll',` · <b style="color:#2b59c3;font-weight:600">${fmt(b.length-seen)} new to you</b> (${fmt(seen)} were in lists you’ve marked done)`);
  const tg=document.createElement('label');tg.className='tog';tg.innerHTML=`<input type="checkbox" checked> Hide ${fmt(seen)} already seen`;
  $('mega').parentNode.parentNode.appendChild(tg);
  // apply hide: remove rows whose handle in DS
  document.querySelectorAll('#rows .row').forEach(r=>{const u=r.querySelector('.ht').dataset.u;if(DS.has(u))r.remove()});
  const left=document.querySelectorAll('#rows .row').length;
  document.querySelector('#foot span').textContent=`${fmt(left)} people shown · ${fmt(seen)} hidden as already seen`;
  const nx=document.createElement('div');nx.className='ls-nextbar';
  nx.innerHTML=`<span>Finished this list? <span class="rw-m">Next to do: <b style="color:#1c1c1c">Surya follows · SF · Founders</b></span></span><span style="display:flex;gap:8px"><a class="btn2">Skip list</a><button class="btn">✓ Mark done &amp; open next</button></span>`;
  document.querySelector('.card').parentNode.appendChild(nx);
})();

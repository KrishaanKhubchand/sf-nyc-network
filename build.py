import json, subprocess
subprocess.run(['python3','/root/mocks/sf-nyc-network/build_data.py'],check=True,capture_output=True)
src=open('/root/mocks/sf-nyc-network/build_data.py').read(); ns={}; exec(src.split('people = {}')[0],ns)
D=json.load(open('/root/mocks/sf-nyc-network/people.json'))
P={}
for p in D['people']:
    P[p['u'].lower()]={'u':p['u'],'n':p['n'] or '','b':(p['b'] or '').replace('\n',' '),'l':(p['loc'] or '')[:40],'f':p['fc'],
        'i':p['p'] or '','c':p['city'],'r':p['role'],'s':p['src'],'y':[]}
YOU=[('kfollowing','krishkhubchand_followings_full.json'),('kfollowers','krishkhubchand_followers.json')]
for key,f in YOU:
    for u in json.load(open('/root/twitterapi-io/'+f)):
        h=(u.get('userName') or '').lower(); c=ns['city'](u.get('location') or '')
        if not h or not c: continue
        if h not in P:
            P[h]={'u':u['userName'],'n':u.get('name') or '','b':(u.get('description') or '').replace('\n',' '),'l':(u.get('location') or '')[:40],
                  'f':u.get('followers_count') or 0,'i':u.get('profile_image_url_https') or '','c':c,'r':ns['role'](u.get('description')),'s':[],'y':[]}
        if key not in P[h]['y']: P[h]['y'].append(key)
out=list(P.values())
for p in out:
    if not p['y']: del p['y']
json.dump({'lists':D['lists'],'people':out},open('data.json','w'),separators=(',',':'))
print(len(out), 'krish-only', sum(1 for p in out if not p['s']), 'mutual', sum(1 for p in out if len(p.get('y',[]))==2))

import json, subprocess
subprocess.run(['python3','/root/mocks/sf-nyc-network/build_data.py'],check=True,capture_output=True)
D=json.load(open('/root/mocks/sf-nyc-network/people.json'))
out=[]
for p in D['people']:
    out.append({'u':p['u'],'n':p['n'] or '','b':(p['b'] or '').replace('\n',' '),'l':(p['loc'] or '')[:40],'f':p['fc'],'t':p['tc'],
                'i':p['p'] or '','c':p['city'],'r':p['role'],'s':p['src']})
json.dump({'lists':D['lists'],'people':out},open('data.json','w'),separators=(',',':'))
print(len(out))

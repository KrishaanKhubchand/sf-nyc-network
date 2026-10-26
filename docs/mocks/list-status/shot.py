import glob,sys
from playwright.sync_api import sync_playwright
exe=sorted(glob.glob('/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome'))[-1]
C=open('common.js').read();HOME=open('home.js').read();LIST=open('list.js').read()
B='https://sf-nyc-network.vercel.app/'
def home(pg,extra=''):
    pg.goto(B+'?city=SF'); pg.wait_for_function('typeof P!=="undefined" && P && P.length>0',timeout=20000)
    pg.evaluate(C); pg.evaluate(extra+HOME); pg.wait_for_timeout(400)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe)
    pg=b.new_page(viewport={'width':1280,'height':1000},device_scale_factor=2)
    home(pg); print(pg.evaluate('CNT'))
    h=pg.evaluate('document.querySelector(".wrap").scrollHeight'); pg.set_viewport_size({'width':1280,'height':1060})
    pg.screenshot(path='A_home.png')
    # B: menu open
    pg.set_viewport_size({'width':1280,'height':640})
    home(pg,"window.MENU_KEY='aashay|SF|investors';")
    pg.evaluate("document.querySelector('.ls-menu').closest('tr').scrollIntoView({block:'center'})"); pg.wait_for_timeout(200)
    pg.screenshot(path='B_menu.png')
    # C: list page
    pg.set_viewport_size({'width':1280,'height':1000})
    pg.goto(B+'list.html?src=zack&city=SF&role=investors'); pg.wait_for_function('typeof D!=="undefined" && D && document.querySelectorAll("#rows .row").length>0',timeout=20000)
    pg.evaluate(C); pg.evaluate(LIST); pg.wait_for_timeout(1500)
    h=pg.evaluate('document.documentElement.scrollHeight'); pg.set_viewport_size({'width':1280,'height':h}); pg.wait_for_timeout(1500)
    pg.screenshot(path='C_list.png')
    # D phone
    m=b.new_page(viewport={'width':414,'height':896},device_scale_factor=2,is_mobile=True,has_touch=True)
    home(m,"window.STATUS_FILTER='all';")
    m.screenshot(path='D_phone.png')
    print('scrollW',m.evaluate('document.documentElement.scrollWidth'), m.evaluate('document.querySelector(".scroll-x").scrollWidth'), m.evaluate('document.querySelector(".scroll-x").clientWidth'))
    b.close()

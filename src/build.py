#!/usr/bin/env python3
"""Construit Rythme à partir des sources.
- dist/rythme.html : page autonome (à publier comme Artifact Claude)
- index.html       : version installable (PWA) servie par GitHub Pages
Usage : python3 src/build.py   (depuis la racine du dépôt)
"""
import os, re, time, subprocess, tempfile
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(R, 'src')
parts = ['b0.html','c1.js','c2.js','c3.js','c4.js','c5.js','c6.js','c6b.js','c6c.js','c7.js']
html = ''.join(open(os.path.join(S,p), encoding='utf-8').read() for p in parts) + '\n</script>\n</body>\n</html>\n'
# vérification de syntaxe du script (si node est installé)
js = html[html.rindex('<script>')+8:html.rindex('</script>')]
try:
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f: f.write(js)
    subprocess.run(['node','--check',f.name], check=True)
except FileNotFoundError: pass
os.makedirs(os.path.join(R,'dist'), exist_ok=True)
open(os.path.join(R,'dist','rythme.html'),'w',encoding='utf-8').write(html)
head = '''<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Rythme">
<meta name="theme-color" content="#F5F4EE">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" href="icon-192.png">
'''
pwa = html.replace('<title>Rythme</title>', '<title>Rythme</title>\n'+head, 1)
reg = "<script>if('serviceWorker' in navigator&&location.protocol==='https:'){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}</script>\n</body>"
i = pwa.rindex('</body>'); pwa = pwa[:i]+reg+pwa[i+7:]
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(pwa)
sw = os.path.join(R,'sw.js'); t = open(sw,encoding='utf-8').read()
open(sw,'w',encoding='utf-8').write(re.sub(r"const C='rythme-[^']*'", "const C='rythme-%d'" % int(time.time()), t))
print('OK : index.html et dist/rythme.html construits')

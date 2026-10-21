#!/usr/bin/env python3
"""Adresse, code postal et position de chaque centre d'examen pratique, lus sur le service public GOV.UK
« Find a driving test centre » (https://www.gov.uk/find-driving-test-centre, contenu sous Open Government
Licence v3.0). Le service rend les 10 centres les plus proches d'un code postal : on l'interroge depuis un
code postal réel par zone postale, puis, pour chaque centre encore manquant, depuis le district le plus
proche de sa localité (postcodes.io /places, OS Open Names). Une requête par seconde au plus.

Usage : python3 scripts/data/fetch-centre-addresses.py <noms.json>   (liste des centres de DRT122F)
Écrit data/raw/centre-addresses.json (cache : un centre déjà trouvé n'est pas redemandé).
"""
import html, json, math, os, re, sys, time, urllib.parse, urllib.request, http.cookiejar

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(root, 'data', 'raw', 'centre-addresses.json')
names = json.load(open(sys.argv[1]))
found = json.load(open(OUT)) if os.path.exists(OUT) else {}
dist = json.load(open(os.path.join(root, 'src', 'data', 'districts.json')))
sample = json.load(open(os.path.join(root, 'data', 'raw', 'district-sample-postcodes.json')))
cj = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
op.addheaders = [('User-Agent', 'Mozilla/5.0 (data build; contact via site)')]
URL = 'https://www.gov.uk/find-driving-test-centre'
token = None


def get_token():
    global token
    t = op.open(URL, timeout=30).read().decode()
    token = re.search(r'name="authenticity_token" value="([^"]+)"', t).group(1)


def query(pc):
    if token is None:
        get_token()
    data = urllib.parse.urlencode({'postcode': pc, 'authenticity_token': token}).encode()
    t = op.open(URL, data=data, timeout=30).read().decode()
    time.sleep(1.0)
    res = []
    for blk in t.split('<h3 class="fn')[1:]:
        name = html.unescape(re.search(r'>([^<]+)</h3>', blk).group(1)).strip()
        g = lambda cls: (html.unescape(m.group(1)).strip() if (m := re.search(r'class="%s">([^<]*)<' % cls, blk)) else '')
        ll = re.search(r'mlat=([-\d.]+)&amp;mlon=([-\d.]+)', blk)
        types = re.search(r'provides these types of tests: ([^<]+)\.', blk)
        notes = [html.unescape(re.sub('<[^>]+>', '', p)).strip() for p in re.findall(r'<p>(.*?)</p>', blk.split('view-maps')[-1])]
        res.append({'name': name, 'street': g('street-address'), 'locality': g('locality'), 'postcode': g('postal-code'),
                    'lat': float(ll.group(1)) if ll else None, 'lon': float(ll.group(2)) if ll else None,
                    'types': types.group(1).strip() if types else '', 'notes': [n for n in notes if n and 'types of tests' not in n]})
    return res


def add(results):
    n = 0
    for r in results:
        if r['name'] not in found:
            found[r['name']] = r; n += 1
    json.dump(found, open(OUT, 'w'), indent=1, ensure_ascii=False)
    return n


# 1. un code postal par zone (le district le plus proche du centre de la zone)
areas = {}
for d, (e, n) in dist.items():
    a = re.match(r'[A-Z]+', d).group(0)
    areas.setdefault(a, []).append((d, e, n))
if not os.environ.get('SKIP_AREAS'):
    for a, ds in sorted(areas.items()):
        ce = sum(x[1] for x in ds) / len(ds); cn = sum(x[2] for x in ds) / len(ds)
        d = min(ds, key=lambda x: (x[1] - ce) ** 2 + (x[2] - cn) ** 2)[0]
        try:
            k = add(query(sample[d]))
        except Exception as ex:
            print('erreur', a, ex); token = None; continue
        print(a, sample[d], '+', k, 'total', len(found), flush=True)

# 2. centres manquants : depuis le district le plus proche de leur localité (OS Open Names via postcodes.io)
def place(q):
    u = 'https://api.postcodes.io/places?limit=5&q=' + urllib.parse.quote(q)
    try:
        r = json.load(urllib.request.urlopen(u, timeout=30))['result'] or []
    except Exception:
        return None
    r = [x for x in r if x['country'] in ('England', 'Scotland', 'Wales')]
    return r[0] if r else None

missing = [n for n in names if n not in found]
for nm in missing:
    if nm in found:
        continue
    base = re.sub(r'\s*\(.*?\)', '', nm).replace(' LGV', '').replace(' Island', '').strip()
    paren = re.findall(r'\((.*?)\)', nm)
    p = place(base) or (place(paren[0]) if paren else None)
    if not p:
        print('introuvable', nm); continue
    d = min(dist, key=lambda k: (dist[k][0] * 1000 - p['eastings']) ** 2 + (dist[k][1] * 1000 - p['northings']) ** 2)
    try:
        k = add(query(sample[d]))
    except Exception as ex:
        print('erreur', nm, ex); token = None; continue
    print(nm, '->', sample[d], '+', k, 'ok' if nm in found else 'TOUJOURS ABSENT', flush=True)
print('manquants :', [n for n in names if n not in found])

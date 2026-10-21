#!/usr/bin/env python3
"""Relit les statistiques officielles de la DVSA et régénère les données du site.

Sources (Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) :
- page « Driving test and theory test data: cars » de GOV.UK, lue par l'API de contenu
  (https://www.gov.uk/api/content/government/statistical-data-sets/driving-test-and-theory-test-data-cars),
  qui donne l'adresse de chaque tableur ODS : DRT122A à DRT122F (centres d'examen pratique), DRT112A (centres
  d’examen théorique), DRT121A, DRT121C, DRT121D, DRT121F et DRT121G (Grande-Bretagne) ;
- page « Check which driving test centres you can move your test to » (les 3 centres les plus proches, règle du
  9 juin 2026), lue par la même API ;
- data/raw/centre-geo.json : adresse et position de chaque centre (scripts/data/build-centre-geo.py, à relancer
  seulement quand un centre ouvre ou ferme).

Cadence : DRT122F (délais d'attente) et DRT121G changent chaque mois (vers le milieu du mois) ; DRT122A à E chaque
année en juin ; DRT112A et DRT121A chaque trimestre. Le workflow .github/workflows/update-data.yml lance ce script
le 16 de chaque mois, reconstruit le site et le publie si les données ont changé.

Usage : python3 scripts/update-data.py [--offline]   (--offline : relit data/raw/dvsa/ sans rien télécharger)
Écrit : src/data/centres.json, src/data/centres-lite.json, src/data/theory.json, src/data/national.json, src/data/meta.json
Aucune dépendance : bibliothèque standard de Python 3.10+.
"""
import html as H
import json
import os
import re
import sys
import time
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'data', 'raw', 'dvsa')
DATA = os.path.join(ROOT, 'src', 'data')
STATS = 'government/statistical-data-sets/driving-test-and-theory-test-data-cars'
NEAREST = 'government/publications/check-which-driving-test-centres-you-can-move-your-test-to/check-which-driving-test-centres-you-can-move-your-test-to'
UA = {'User-Agent': 'uk-driving-test-centres data build (python urllib)'}
WANTED = ['drt122a', 'drt122b', 'drt122c', 'drt122d', 'drt122e', 'drt122f', 'drt112a', 'drt121a', 'drt121c', 'drt121d', 'drt121f', 'drt121g']
YEARS = 5           # années de taux de réussite gardées par centre
WAIT_MONTHS = 24    # mois de délais d'attente gardés par centre


def api(path):
    with urllib.request.urlopen(urllib.request.Request('https://www.gov.uk/api/content/' + path, headers=UA), timeout=60) as r:
        return json.load(r)


# ---------------------------------------------------------------- lecteur ODS minimal
T = '{urn:oasis:names:tc:opendocument:xmlns:table:1.0}'
O = '{urn:oasis:names:tc:opendocument:xmlns:office:1.0}'
X = '{urn:oasis:names:tc:opendocument:xmlns:text:1.0}'


def _cell(c):
    vt = c.get(O + 'value-type')
    if vt in ('float', 'percentage', 'currency'):
        f = float(c.get(O + 'value'))
        return int(f) if f.is_integer() else f
    if vt == 'date':
        return c.get(O + 'date-value')
    parts = [''.join(p.itertext()) for p in c.iter(X + 'p')]
    return '\n'.join(parts).strip() if parts else None


def read_ods(path, keep=lambda name: True):
    out, cur, rows = {}, None, None
    with zipfile.ZipFile(path) as z, z.open('content.xml') as f:
        for ev, el in ET.iterparse(f, events=('start', 'end')):
            if ev == 'start' and el.tag == T + 'table':
                cur, rows = el.get(T + 'name'), []
            elif ev == 'end' and el.tag == T + 'table-row':
                if cur is not None and keep(cur):
                    row = []
                    for c in el:
                        if c.tag not in (T + 'table-cell', T + 'covered-table-cell'):
                            continue
                        rep = int(c.get(T + 'number-columns-repeated', '1'))
                        v = _cell(c)
                        row.extend([v] * (1 if (rep > 200 and v is None) else rep))
                    while row and row[-1] in (None, ''):
                        row.pop()
                    if row:
                        rows.extend([row] * min(int(el.get(T + 'number-rows-repeated', '1')), 50))
                el.clear()
            elif ev == 'end' and el.tag == T + 'table':
                if keep(cur):
                    out[cur] = rows
                cur = None
                el.clear()
    return out


# ---------------------------------------------------------------- utilitaires
def slug(name):
    s = name.lower().replace('&', ' and ')
    s = re.sub(r"[’']", '', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def r1(v):
    return round(v, 1) if isinstance(v, (int, float)) else None


def rate(cp):
    return round(cp[1] / cp[0] * 100, 1) if cp and cp[0] and cp[1] is not None else None


def key(name):
    """Clé de rapprochement entre tableurs et pages GOV.UK (casse, espaces, tirets, « on »/« -on- »)."""
    return re.sub(r'[^a-z0-9]', '', name.lower())


def num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def fy_of_sheet(name):
    m = re.fullmatch(r'(\d{4})-(\d{2})', name.strip())
    return f'{m.group(1)}-{m.group(2)}' if m else None


def is_closed(name):
    return name.lower().startswith('[z]') or name.lower().endswith('[z]')


def clean(name):
    return re.sub(r'\s+', ' ', name.replace('\xa0', ' ')).strip()


def download(offline):
    os.makedirs(RAW, exist_ok=True)
    files, published = {}, {}
    if offline:
        for f in os.listdir(RAW):
            for k in WANTED:
                if f.startswith(k):
                    files[k] = os.path.join(RAW, f)
        meta = json.load(open(os.path.join(RAW, 'attachments.json')))
        return files, meta
    page = api(STATS)
    meta = {'page_updated': page.get('public_updated_at'), 'attachments': {}}
    for a in page['details'].get('attachments', []):
        url = a.get('url', '')
        base = url.rsplit('/', 1)[-1]
        k = base[:7]
        if k in WANTED:
            dest = os.path.join(RAW, base)
            if not os.path.exists(dest):
                for old in os.listdir(RAW):
                    if old.startswith(k):
                        os.remove(os.path.join(RAW, old))
                with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r, open(dest, 'wb') as w:
                    w.write(r.read())
                time.sleep(0.5)
            files[k] = dest
            meta['attachments'][k] = {'title': a.get('title'), 'url': url}
    json.dump(meta, open(os.path.join(RAW, 'attachments.json'), 'w'), indent=1)
    return files, meta


def last_updated(sheets):
    """Date « Last updated » lue dans la feuille de notes ou de couverture."""
    for name, rows in sheets.items():
        for r in rows[:20]:
            for i, v in enumerate(r):
                if isinstance(v, str) and v.lower().startswith('last updated'):
                    tail = v.split(':', 1)[1].strip() if ':' in v else ''
                    if not tail and i + 1 < len(r):
                        tail = r[i + 1]
                    return str(tail)[:10] if re.match(r'\d{4}-\d\d-\d\d', str(tail)) else str(tail)
    return None


# ---------------------------------------------------------------- tableaux par centre (blocs « nom » puis lignes)
def blocks_with_total(rows, start):
    """DRT122A / DRT122B / DRT112A : en-tête de centre, lignes mensuelles, ligne de total portant le nom."""
    out, cur = {}, None
    for r in rows[start:]:
        first = r[0] if r else None
        if not isinstance(first, str) or not first.strip():
            continue
        f = clean(first)
        nums = [v for v in r[1:] if num(v) is not None or v == '..']
        if not nums:
            cur = f
        elif cur and (f == cur or f == cur + ' Total' or f.lower() == (cur + ' total').lower()):
            out[cur] = r
    return out


def pass_by_centre(path):
    sh = read_ods(path, keep=lambda n: fy_of_sheet(n) is not None)
    res = defaultdict(dict)
    for name, rows in sh.items():
        fy = fy_of_sheet(name)
        for c, r in blocks_with_total(rows, 4).items():
            m = [num(r[1]), num(r[2])]; f = [num(r[5]), num(r[6])]; t = [num(r[9]), num(r[10])]
            if t[0]:
                res[c][fy] = {'t': t, 'm': m, 'f': f}
    return res, last_updated(read_ods(path, keep=lambda n: n.lower() == 'notes'))


def table_rows(path, start, ncols):
    """DRT122C / DRT122E : une ligne par centre."""
    sh = read_ods(path, keep=lambda n: fy_of_sheet(n) is not None)
    res = defaultdict(dict)
    for name, rows in sh.items():
        fy = fy_of_sheet(name)
        for r in rows:
            if isinstance(r[0], str) and len(r) >= ncols and num(r[ncols - 1]) is not None and not r[0].startswith(('DRT', 'Time', 'Total', 'National')):
                res[clean(r[0])][fy] = r
    return res


def ages_by_centre(path):
    sh = read_ods(path, keep=lambda n: fy_of_sheet(n) is not None)
    res = defaultdict(dict)
    for name, rows in sh.items():
        fy = fy_of_sheet(name)
        cur = None
        for r in rows[5:]:
            if r and isinstance(r[0], str) and r[0].strip() and (len(r) == 1 or all(v in (None, '') for v in r[1:])):
                cur = clean(r[0]); res[cur][fy] = {}
            elif cur and len(r) > 10 and r[0] in (None, ''):
                age = str(r[1]).strip()
                res[cur][fy][age] = {'t': [num(r[8]), num(r[9])], 'm': [num(r[2]), num(r[3])], 'f': [num(r[5]), num(r[6])]}
    return res


def cancellations(path):
    sh = read_ods(path, keep=lambda n: fy_of_sheet(n) is not None)
    res = defaultdict(dict)
    for name, rows in sh.items():
        fy = fy_of_sheet(name)
        for c, r in blocks_with_total(rows, 4).items():
            v = [num(x) or 0 for x in r[1:]]
            res[c][fy] = {'leave': v[0], 'disputes': v[1], 'weather': v[2], 'medical': v[3], 'total': v[-1]}
    return res


def waits(path):
    rows = read_ods(path, keep=lambda n: n.upper().startswith('DRT122F'))
    rows = next(iter(rows.values()))
    hdr = next(i for i, r in enumerate(rows) if r and r[0] == 'Country')
    res = defaultdict(dict)
    meta = {}
    for r in rows[hdr + 1:]:
        if len(r) < 15 or not r[2]:
            continue
        name = clean(r[2]); month = str(r[3])[:7]
        meta[name] = (r[0], r[1])
        res[name][month] = {'w10': num(r[5]), 'median': num(r[6]), 'in7': num(r[7]), 'slots': num(r[11]), 'booked': num(r[12]), 'free': num(r[14]), 'overtime': num(r[4])}
    lu = last_updated(read_ods(path, keep=lambda n: n.lower().startswith('cover')))
    return res, meta, lu


def nearest():
    body = api(NEAREST)['details']['body']
    out = {}
    for m in re.finditer(r'<h3 id="([^"]+)">([^<]*)</h3>\s*<p>You can move your test to:</p>\s*<ul>(.*?)</ul>', body, re.S):
        name = clean(H.unescape(m.group(2)))
        lst = []
        for li in re.findall(r'<li>(.*?)</li>', m.group(3), re.S):
            t = clean(H.unescape(re.sub('<[^>]+>', '', li)))
            mm = re.match(r'(.*?)\s+-\s+about\s+([\d.]+)\s+miles?', t)
            if mm:
                lst.append([clean(mm.group(1)), float(mm.group(2))])
        out[name] = lst
    return out


# ---------------------------------------------------------------- Grande-Bretagne
def national(files):
    nat = {}
    s = read_ods(files['drt122a'], keep=lambda n: n.lower() == 'summary')['Summary']
    nat['practical'] = {str(r[0]).replace('/', '-20')[:4] + '-' + str(r[0])[-2:]: {'m': [r[1], r[2]], 'f': [r[5], r[6]], 't': [r[9], r[10]]} for r in s if isinstance(r[0], str) and re.match(r'\d{4}/\d\d$', r[0])}
    s = read_ods(files['drt122c'], keep=lambda n: n.lower() == 'summary')['Summary']
    nat['first'] = {r[0][:4] + '-' + r[0][-2:]: [r[1], r[2], r[4]] for r in s if isinstance(r[0], str) and re.match(r'\d{4}/\d\d$', r[0])}
    s = read_ods(files['drt122e'], keep=lambda n: n.lower() == 'summary')['Summary']
    nat['auto'] = {r[0][:4] + '-' + r[0][-2:]: [r[1], r[2]] for r in s if isinstance(r[0], str) and re.match(r'\d{4}/\d\d$', r[0])}
    s = read_ods(files['drt112a'], keep=lambda n: n.lower() == 'summary')['Summary']
    nat['theory'] = {r[0][:4] + '-' + r[0][-2:]: {'m': [r[1], r[2]], 'f': [r[5], r[6]], 't': [r[9], r[10]]} for r in s if isinstance(r[0], str) and re.match(r'\d{4}/\d\d$', r[0])}
    s = read_ods(files['drt122b'], keep=lambda n: n.lower() == 'summary')['Summary']
    nat['cancel'] = {r[0][:4] + '-' + r[0][-2:]: {'leave': r[1], 'disputes': r[2], 'weather': r[3], 'medical': r[4], 'total': r[6]} for r in s if isinstance(r[0], str) and re.match(r'\d{4}/\d\d$', r[0])}
    # âge et sexe, toutes classes d'âge (DRT121C), dernière année
    s = next(iter(read_ods(files['drt121c'], keep=lambda n: n.upper().startswith('DRT121C')).values()))
    years = sorted({r[0] for r in s if isinstance(r[0], str) and re.match(r'\d{4} to \d{4}$', r[0])})
    last = years[-1]
    ages = defaultdict(dict)
    for r in s:
        if r and r[0] == last and r[1] in ('Male', 'Female', 'Total') and num(r[3]) is not None:
            ages[str(r[2])][r[1][0].lower()] = [num(r[3]), num(r[4])]
    nat['ageSex'] = {'year': last[:4] + '-' + last[-2:], 'rows': ages}
    # rang de la tentative (DRT121D), dernière année, tous âges, par sexe et ensemble
    s = next(iter(read_ods(files['drt121d'], keep=lambda n: n.upper().startswith('DRT121D')).values()))
    yrs = sorted({r[0] for r in s if isinstance(r[0], str) and re.match(r'\d{4} to \d{4}$', r[0])})
    att = defaultdict(lambda: defaultdict(lambda: [0, 0]))
    for r in s:
        # une ligne « Total » par sexe et par rang : les lignes par âge la répètent en détail
        if r and r[0] == yrs[-1] and len(r) >= 6 and str(r[2]) == 'Total' and num(r[4]) is not None:
            g = {'Male': 'm', 'Female': 'f'}.get(r[1], 't' if r[1] in ('Total', 'All') else None)
            if g is None:
                continue
            a = str(r[3])
            att[g][a][0] += num(r[4]); att[g][a][1] += num(r[5]) or 0
    nat['attempts'] = {'year': yrs[-1][:4] + '-' + yrs[-1][-2:], 'rows': {g: dict(v) for g, v in att.items()}}
    # trimestres (DRT121A)
    s = next(iter(read_ods(files['drt121a'], keep=lambda n: n.upper().startswith('DRT121A')).values()))
    nat['quarters'] = [[r[1], r[2], r[3]] for r in s if r and r[0] == 'Financial Quarter' and num(r[2])][-8:]
    # fautes les plus fréquentes (DRT121F)
    s = next(iter(read_ods(files['drt121f']).values()))
    per = s[1][0]
    nat['faults'] = {'period': per, 'list': [r[2] for r in s if r and r[0] == per]}
    # Grande-Bretagne, pays et régions, par mois (DRT121G) : examens, réussites, délais
    s = next(iter(read_ods(files['drt121g'], keep=lambda n: n.upper().startswith('DRT121G')).values()))
    hdr = next(i for i, r in enumerate(s) if r and r[0] == 'Geographic level')
    areas = defaultdict(dict)
    for r in s[hdr + 1:]:
        if len(r) >= 17 and r[1]:
            areas[clean(r[1])][str(r[2])[:7]] = [num(r[3]), num(r[4]), r1(num(r[7])), r1(num(r[8])), r1(num(r[9]))]
    allm = sorted({m for v in areas.values() for m in v})[-WAIT_MONTHS:]
    nat['areas'] = {k: {m: v[m] for m in allm if m in v} for k, v in areas.items()}
    nat['areaColumns'] = ['conducted', 'passed', 'weeksTo10pc', 'medianWaitWeeks', 'pctWithin7Weeks']
    return nat


def main():
    offline = '--offline' in sys.argv
    files, meta = download(offline)
    miss = [k for k in WANTED if k not in files]
    if miss:
        sys.exit(f'Tableurs manquants : {miss}')
    pa, pa_lu = pass_by_centre(files['drt122a'])
    first = table_rows(files['drt122c'], 4, 15)
    auto = table_rows(files['drt122e'], 6, 12)
    ages = ages_by_centre(files['drt122d'])
    canc = cancellations(files['drt122b'])
    wt, wmeta, w_lu = waits(files['drt122f'])
    near = nearest()
    nearkey = {key(k): v for k, v in near.items()}
    geo_path = os.path.join(ROOT, 'data', 'raw', 'centre-geo.json')
    geo = json.load(open(geo_path)) if os.path.exists(geo_path) else {}

    all_fy = sorted({fy for c in pa.values() for fy in c})
    fys = all_fy[-YEARS:]
    latest = fys[-1]
    months = sorted({m for c in wt.values() for m in c})
    wmonths = months[-WAIT_MONTHS:]
    last_month = months[-1]

    centres = []
    skipped = []
    for name, (country, region) in sorted(wmeta.items()):
        if is_closed(name):
            continue
        series = wt[name]
        recent = [m for m in series if m >= wmonths[0]]
        p = pa.get(name, {})
        if latest not in p:
            skipped.append(name); continue
        if not recent or max(recent) < wmonths[-6]:
            skipped.append(name); continue
        g = geo.get(name)
        fr = first.get(name, {}).get(latest)
        au = auto.get(name, {}).get(latest)
        ag = ages.get(name, {}).get(latest, {})
        ca = canc.get(name, {}).get(latest)
        rec = {
            'id': slug(name), 'name': name, 'country': country, 'region': region,
            'lgv': name.endswith(' LGV'),
            'pass': {fy: p[fy]['t'] for fy in fys if fy in p},
            'sex': {'m': p[latest]['m'], 'f': p[latest]['f']},
            'first': [num(fr[11]), num(fr[12]), num(fr[14])] if fr else None,
            'auto': [num(au[9]), num(au[10])] if au else None,
            'age': {a: v['t'] for a, v in ag.items() if a.isdigit() and v['t'][0] is not None},
            'cancel': ca,
            'wait': {m: [r1(series[m]['median']), r1(series[m]['w10']), r1(series[m]['in7']), r1(series[m]['free'])] for m in wmonths if m in series},
            'near': nearkey.get(key(name)) or [],
        }
        if g:
            rec.update({'addr': [g.get('street', ''), g.get('locality', ''), g.get('postcode', '')], 'en': [g['e'], g['n']], 'types': g.get('types', ''), 'notes': [H.unescape(H.unescape(x)) for x in g.get('notes', [])]})
        centres.append(rec)

    # les centres voisins de la liste GOV.UK reçoivent l'identifiant de notre fiche quand elle existe
    ids = {key(c['name']): c['id'] for c in centres}
    for c in centres:
        c['near'] = [[n, mi, ids.get(key(n))] for n, mi in c['near']]

    # théorie (DRT112A)
    th, th_lu = pass_by_centre(files['drt112a'])
    tfys = sorted({fy for c in th.values() for fy in c})[-3:]
    theory = [{'id': slug(n), 'name': n, 'pass': {fy: v[fy]['t'] for fy in tfys if fy in v}, 'sex': {'m': v[tfys[-1]]['m'], 'f': v[tfys[-1]]['f']}}
              for n, v in sorted(th.items()) if tfys[-1] in v and not is_closed(n) and not n.lower().startswith('total')]

    nat = national(files)
    nat['latestYear'] = latest
    nat['years'] = fys
    nat['waitMonths'] = wmonths

    json.dump(centres, open(os.path.join(DATA, 'centres.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    # version légère pour l'outil du navigateur (tous les centres, quelques champs)
    lite = []
    for c in centres:
        lw = c['wait'].get(last_month) or [None] * 4
        lite.append({'id': c['id'], 'n': c['name'], 'r': c['region'], 'c': c['country'][0], 'en': c.get('en'),
                     'p': [rate(c['pass'].get(fy)) for fy in fys[-3:]], 't': c['pass'][latest][0],
                     'f': rate(c['first'][:2]) if c['first'] else None, 'a': rate(c['auto']) if c['auto'] else None,
                     'mn': rate([c['pass'][latest][0] - c['auto'][0], c['pass'][latest][1] - c['auto'][1]]) if c['auto'] and c['auto'][0] is not None and c['auto'][1] is not None else None,
                     'z': c['first'][2] if c['first'] else None,
                     'w': lw[0], 'w10': lw[1], 'nb': [x[2] for x in c['near'] if x[2]], 'lgv': c['lgv']})
    json.dump({'years': fys[-3:], 'month': last_month, 'centres': lite}, open(os.path.join(DATA, 'centres-lite.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    json.dump(theory, open(os.path.join(DATA, 'theory.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    json.dump(nat, open(os.path.join(DATA, 'national.json'), 'w'), indent=0, ensure_ascii=False)
    m = {
        'retrieved': time.strftime('%Y-%m-%d'),
        'statsPageUpdated': (meta.get('page_updated') or '')[:10],
        'passRatesUpdated': pa_lu, 'waitsUpdated': w_lu, 'theoryUpdated': th_lu,
        'latestYear': latest, 'lastWaitMonth': last_month, 'theoryYear': tfys[-1],
        'centres': len(centres), 'theoryCentres': len(theory), 'skipped': skipped,
        'withoutGeo': [c['name'] for c in centres if 'en' not in c],
        'withoutNearest': [c['name'] for c in centres if not c['near']],
    }
    old_meta = {}
    try:
        old_meta = json.load(open(os.path.join(DATA, 'meta.json')))
    except (OSError, ValueError):
        pass
    json.dump(m, open(os.path.join(DATA, 'meta.json'), 'w'), indent=1, ensure_ascii=False)
    # Nouvelles données publiées par la DVSA : la date affichée sur les pages (LAST_UPDATED) passe à aujourd'hui.
    if any(old_meta.get(k) != m[k] for k in ('statsPageUpdated', 'latestYear', 'lastWaitMonth', 'theoryYear')):
        cfg = os.path.join(DATA, 'site-config.ts')
        txt = open(cfg, encoding='utf-8').read()
        txt = re.sub(r"export const LAST_UPDATED = '[0-9-]+';", f"export const LAST_UPDATED = '{m['retrieved']}';", txt)
        open(cfg, 'w', encoding='utf-8').write(txt)
        print('LAST_UPDATED ->', m['retrieved'])
    print(json.dumps(m, indent=1, ensure_ascii=False))


if __name__ == '__main__':
    main()

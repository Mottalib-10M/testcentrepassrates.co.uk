#!/usr/bin/env python3
"""Adresse et position (British National Grid, km) de chaque centre d'examen pratique.

Entrées : data/raw/centre-addresses.json (scripts/data/fetch-centre-addresses.py, service GOV.UK « Find a driving
test centre », OGL v3.0) et OS Code-Point Open (OGL v3.0) pour situer le code postal de chaque centre.
Les noms des tableurs DVSA et ceux du service GOV.UK diffèrent parfois : ALIAS fait le lien, vérifié à la main
le 2026-10-21 (adresse lue sur le service). Sortie : data/raw/centre-geo.json, lu par scripts/update-data.py.
Usage : python3 scripts/data/build-centre-geo.py <dossier codepo_gb dézippé>
"""
import csv, json, os, re, sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = sys.argv[1]
ALIAS = {  # nom DRT122F -> nom du service GOV.UK
    'Birmingham (Cocks Moors)': 'Birmingham (Cocks Moors Woods Leisure Centre)',
    'Carlisle LGV (Cars)': 'Carlisle LGV',
    'Chelmsford': 'Chelmsford (Hanbury Road)',
    'Clacton-on-Sea': 'Clacton-on- Sea',
    'Dunfermline (Vine)': 'Dunfermline',
    'Greenford (Horsenden Lane)': 'Greenford (London)',
    'Leeds (Fearnville)': 'Leeds (The Old Fire Station)',
    'Lowestoft(Mobbs Way)': 'Lowestoft (Mobbs Way)',
    'Medway Ambley Road': 'Medway Ambely Road (Formally Gillingham LGV)',
    'Newport (Isle of Wight)': 'Newport (Isle Of Wight)',
    'Nottingham (Colwick)': 'Nottingham (Colwick )',
    'Stoke-On-Trent (Cobridge)': 'Stoke on Trent (Cobridge)',
    'Stoke-on-Trent (Newcastle-Under-Lyme)': 'Stoke on Trent (Newcastle under Lyme)',
    'Widnes': 'Widnes (Liverpool)',
}
# Adresse publiée par le service GOV.UK lui-même dans la fiche du centre (déménagement annoncé).
OVERRIDE = {
    'Chelmsford': {'street': 'Unit 12, Cromar Way', 'locality': 'Chelmsford', 'postcode': 'CM1 2GL',
                   'notes': ['GOV.UK: the centre moved to Unit 12, Cromar Way, Chelmsford, after its last tests at the temporary County Hotel site on 2 October 2026.']},
}
addr = json.load(open(os.path.join(root, 'data', 'raw', 'centre-addresses.json')))
names = sys.argv[2:] or None
need = {}
out = {}
for k, v in addr.items():
    out[k] = dict(v)
for drt, gov in ALIAS.items():
    if gov in addr:
        out[drt] = dict(addr[gov]); out[drt]['govName'] = gov
for k, ov in OVERRIDE.items():
    if k in out:
        out[k].update(ov)
for k, v in out.items():
    t = v.get('types', '')
    if '. ' in t:  # « car, ADI part 3. Chelmsford DTC is moving… » : la suite est une note
        a, b = t.split('. ', 1)
        v['types'] = a
        if k not in OVERRIDE:
            v.setdefault('notes', []).append(b.strip())
    v['postcode'] = re.sub(r'[^A-Za-z0-9 ]', '', v['postcode']).strip().upper()
    need[v['postcode'].replace(' ', '')] = None
sectors = {}  # repli : centre du secteur postal (« RG22 4 ») quand le code exact n'est pas dans Code-Point
for f in os.listdir(os.path.join(src, 'Data', 'CSV')):
    for row in csv.reader(open(os.path.join(src, 'Data', 'CSV', f), encoding='latin-1')):
        p = row[0].replace(' ', '').upper()
        if int(row[1]) >= 90:
            continue
        if p in need:
            need[p] = (round(int(row[2]) / 1000, 2), round(int(row[3]) / 1000, 2))
        sec = sectors.setdefault(p[:-2], [0, 0, 0]); sec[0] += int(row[2]); sec[1] += int(row[3]); sec[2] += 1
miss = []
for k, v in out.items():
    pc = v['postcode'].replace(' ', '')
    en = need.get(pc)
    if not en and pc[:-2] in sectors:
        se = sectors[pc[:-2]]; en = (round(se[0] / se[2] / 1000, 2), round(se[1] / se[2] / 1000, 2)); v['approx'] = 'sector'
    if en:
        v['e'], v['n'] = en
    else:
        miss.append((k, v['postcode']))
out = {k: v for k, v in out.items() if 'e' in v}
json.dump(out, open(os.path.join(root, 'data', 'raw', 'centre-geo.json'), 'w'), indent=1, ensure_ascii=False)
print(len(out), 'centres situés ; codes postaux absents de Code-Point :', miss)

#!/usr/bin/env python3
"""Centroïdes des districts postaux (partie extérieure du code postal, ex. « NW4 ») depuis OS Code-Point Open.

Source : Ordnance Survey, Code-Point Open (Open Government Licence v3.0 ; contient des données Royal Mail et
National Statistics). Téléchargement : https://api.os.uk/downloads/v1/products/CodePointOpen/downloads?area=GB&format=CSV&redirect
Usage : python3 scripts/data/build-districts.py <dossier codepo_gb dézippé>
Écrit src/data/districts.json : { "NW4": [easting_km, northing_km], ... } en kilomètres (British National Grid),
arrondis à 0,1 km, plus data/raw/district-sample-postcodes.json (un vrai code postal proche du centre de chaque district).
"""
import csv, glob, json, os, sys
from collections import defaultdict

src = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sums = defaultdict(lambda: [0, 0, 0])
pcs = defaultdict(list)
for f in sorted(glob.glob(os.path.join(src, 'Data', 'CSV', '*.csv'))):
    for row in csv.reader(open(f, encoding='latin-1')):
        pc, q, e, n = row[0], int(row[1]), int(row[2]), int(row[3])
        if q >= 90 or e == 0:
            continue
        out = pc[:-3].strip()
        s = sums[out]; s[0] += e; s[1] += n; s[2] += 1
        pcs[out].append((pc, e, n))
dist = {}
sample = {}
for out, (se, sn, c) in sorted(sums.items()):
    ce, cn = se / c, sn / c
    dist[out] = [round(ce / 1000, 1), round(cn / 1000, 1)]
    best = min(pcs[out], key=lambda p: (p[1] - ce) ** 2 + (p[2] - cn) ** 2)
    sample[out] = best[0]
json.dump(dist, open(os.path.join(root, 'src', 'data', 'districts.json'), 'w'), separators=(',', ':'))
os.makedirs(os.path.join(root, 'data', 'raw'), exist_ok=True)
json.dump(sample, open(os.path.join(root, 'data', 'raw', 'district-sample-postcodes.json'), 'w'), indent=0)
print(len(dist), 'districts')

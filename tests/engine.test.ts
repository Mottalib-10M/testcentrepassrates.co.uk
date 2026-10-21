/**
 * Engine checks on every build (RECETTE §4): the generated data against the published DVSA figures,
 * distances on known pairs, estimates kept in bounds, fees and rules from the parameter file.
 */
import { describe, it, expect } from 'vitest';
import * as E from '../src/lib/engine/centres';
import * as F from '../src/lib/engine/full';
import { P } from '../src/lib/engine/params';
import { getSpec, SPEC_KINDS } from '../src/lib/mini-specs';

describe('DVSA data', () => {
  it('Hendon 2025/26 matches DRT122A (11,086 tests, 5,695 passes)', () => {
    const h = F.full('hendon-london');
    expect(h.pass['2025-26']).toEqual([11086, 5695]);
    expect(E.rate(E.centre('hendon-london'))).toBeCloseTo(51.4, 1);
  });
  it('the centre tables add up to the national total within 2 %', () => {
    const y = E.LAST_YEAR;
    const t = F.FULL_CENTRES.reduce((s, c) => s + (c.pass[y]?.[0] ?? 0), 0);
    const nat = (E.NATIONAL.practical as Record<string, Record<string, [number, number]>>)[y].t[0];
    expect(Math.abs(t / nat - 1)).toBeLessThan(0.02);
  });
  it('national 2025/26 figures match DRT121A, C and D', () => {
    expect(E.NATIONAL.practical['2025-26'].t).toEqual([1998621, 1000043]);
    expect(E.gbFirst('2025-26')).toBeCloseTo(497361 / 984415, 6);
    expect(E.attemptRate(1)).toBeCloseTo(497361 / 984415, 6);
    expect(E.gbTheory('2025-26')).toBeCloseTo(1311338 / 2924426, 6);
  });
  it('the Great Britain median wait of August 2026 is the 11.1 weeks published by DVSA', () => {
    expect(F.areaWait('Great Britain', '2026-08')?.[3]).toBe(11.1);
  });
  it('every centre has a position, a region and a latest rate or a reason not to', () => {
    expect(E.CENTRES.length).toBeGreaterThan(300);
    for (const c of E.CENTRES) {
      expect(c.en, c.id).toBeTruthy();
      expect(E.REGIONS as readonly string[], c.id).toContain(c.r);
    }
  });
  it('the three nearest centres are known centres', () => {
    for (const c of E.CENTRES) for (const n of c.nb) expect(E.hasCentre(n), `${c.id} → ${n}`).toBe(true);
  });
});

describe('places and distances', () => {
  it('reads full postcodes, districts and centre names', () => {
    expect(E.findPlace('NW9 5TZ')?.label).toBe('NW9');
    expect(E.findPlace('nw95tz')?.label).toBe('NW9');
    expect(E.findPlace('LS9')?.kind).toBe('district');
    expect(E.findPlace('Hendon')?.kind).toBe('centre');
    expect(E.findPlace('zzz')).toBeNull();
  });
  it('Hendon to Mill Hill is about 2 miles, as DVSA lists it', () => {
    const d = E.miles(E.centre('hendon-london').en, E.centre('mill-hill-london').en);
    expect(d).toBeGreaterThan(1); expect(d).toBeLessThan(3);
  });
  it('near() sorts by distance and respects the radius', () => {
    const l = E.near({ e: 521.99, n: 190.04 }, 10);
    expect(l[0].id).toBe('hendon-london');
    for (let i = 1; i < l.length; i++) expect(l[i].d).toBeGreaterThanOrEqual(l[i - 1].d);
    expect(l.every((c) => c.d <= 10)).toBe(true);
  });
});

describe('estimates', () => {
  it('odds stay between 1 % and 99 % and follow the national age profile', () => {
    for (const a of [16, 17, 25, 40, 70]) for (const s of ['m', 'f'] as const) {
      const o = E.odds(0.5, a, s); expect(o.p).toBeGreaterThanOrEqual(0.01); expect(o.p).toBeLessThanOrEqual(0.99);
    }
    expect(E.odds(0.5, 17, 'f').p).toBeGreaterThan(E.odds(0.5, 40, 'f').p);
  });
  it('the chance of passing grows with the number of attempts', () => {
    expect(E.withinAttempts(0.5, 1)).toBeLessThan(E.withinAttempts(0.5, 3));
    expect(E.withinAttempts(0.5, 10)).toBeLessThan(1);
  });
  it('licence cost = lessons + fees x attempts + licence', () => {
    const x = E.licenceCost({ hours: 30, price: 38, passRate: 0.5, theoryRate: 0.5, evening: false, licence: 'online' });
    expect(x.total).toBeCloseTo(30 * 38 + 2 * P.fees.theory + 2 * P.fees.practicalWeekday + P.fees.provisionalOnline, 6);
  });
  it('fees and rules are those of GOV.UK', () => {
    expect([P.fees.theory, P.fees.practicalWeekday, P.fees.practicalEvening, P.fees.provisionalOnline]).toEqual([23, 62, 75, 34]);
    expect(P.rules.changesAllowed).toBe(2);
    expect(P.rules.refundWorkingDays).toBe(10);
  });
  it('every mini-calculator runs on its defaults', () => {
    for (const k of SPEC_KINDS) {
      const s = getSpec(k);
      const out = s.run(Object.fromEntries(s.inputs.map((i) => [i.id, i.def])));
      expect(out.head[1], k).not.toMatch(/NaN|undefined/);
      for (const [, v] of out.rows) expect(v, k).not.toMatch(/NaN|undefined/);
    }
  });
});

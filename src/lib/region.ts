/**
 * Figures and tables of one region (an English region, Wales or Scotland), read from the DVSA tables.
 * Each region page writes its own prose around them; the tables are shared.
 */
import type { Helpers } from './helpers';
import type { Lite } from './engine/centres';

export function regionFacts(h: Helpers, r: string) {
  const E = h.E, F = h.F;
  const list = E.inRegion(r);
  const big = list.filter((c) => c.t >= 1000 && E.rate(c) != null);
  const full = F.FULL_CENTRES.filter((c) => c.region === r);
  const years = E.YEARS;
  const byYear = Object.fromEntries(years.map((y) => {
    const l = full.filter((c) => c.pass[y]);
    const t = l.reduce((s, c) => s + c.pass[y][0], 0), p = l.reduce((s, c) => s + c.pass[y][1], 0);
    return [y, { t, p, rate: t ? p / t : null }];
  })) as Record<string, { t: number; p: number; rate: number | null }>;
  const tests = byYear[h.lastYear].t;
  const gbTests = (E.NATIONAL.practical as Record<string, Record<'t', [number, number]>>)[h.lastYear].t[0];
  const byRate = E.sorted(big, 'rate');
  const waits = E.sorted(big.filter((c) => c.w != null), 'wait');
  const trend = big.filter((c) => E.trend(c) != null);
  const wait = F.areaWait(r, h.lastMonth);
  const [yy, mm] = h.lastMonth.split('-');
  const waitYearAgo = F.areaWait(r, `${Number(yy) - 1}-${mm}`);
  const auto = full.reduce((s, c) => s + (c.auto?.[0] ?? 0), 0);
  const first = full.reduce((a, c) => { const f = c.first; return f ? [a[0] + f[0], a[1] + f[1]] : a; }, [0, 0]);
  const price = (h.P.adiSurvey.regions as Record<string, number[]>)[r] ?? null;
  const spread = byRate.length ? (E.rate(byRate[0]) as number) - (E.rate(byRate[byRate.length - 1]) as number) : 0;
  const sx = (k: 'm' | 'f') => { const t = full.reduce((a, c) => [a[0] + (c.sex?.[k]?.[0] ?? 0), a[1] + (c.sex?.[k]?.[1] ?? 0)], [0, 0]); return t[0] ? t[1] / t[0] : null; };
  const risers = [...trend].sort((a, b) => (E.trend(b) as number) - (E.trend(a) as number));
  const small = list.filter((c) => c.t < 1000);
  const pages = list.filter((c) => h.hasPage(c.id));
  return {
    list, big, byYear, tests, share: tests / gbTests, rate: byYear[h.lastYear].rate, first: first[0] ? first[1] / first[0] : null,
    autoShare: tests ? auto / tests : null, top: byRate.slice(0, 3), low: byRate.slice(-3).reverse(), spread,
    longest: waits[0] as Lite | undefined, shortest: waits[waits.length - 1] as Lite | undefined, wait, waitYearAgo,
    up: trend.filter((c) => (E.trend(c) as number) > 0).length, trendN: trend.length, price, pages,
    largest: E.sorted(list, 'tests').slice(0, 3), men: sx('m'), women: sx('f'),
    riser: risers[0] as Lite | undefined, faller: risers[risers.length - 1] as Lite | undefined, small,
  };
}
export type RegionFacts = ReturnType<typeof regionFacts>;

export function regionTables(h: Helpers, r: string, f: RegionFacts) {
  const E = h.E;
  const years = E.YEARS;
  const yrows = years.map((y) => [h.yearLabel(y), f.byYear[y].t, f.byYear[y].p, h.pc(f.byYear[y].rate), h.pc(E.gbRate(y))]);
  const ms = Object.keys(E.NATIONAL.areas['Great Britain']).sort().slice(-12).reverse();
  const wrows = ms.map((k) => { const w = h.F.areaWait(r, k); const g = h.F.areaWait('Great Britain', k); return [h.month(k), w ? h.wk(w[3]) : 'n/a', w ? h.pp(w[4]) : 'n/a', g ? h.wk(g[3]) : 'n/a']; });
  return `
<h2>Every centre in ${r}</h2>
${h.centreTable(E.sorted(f.list, 'rate'), `${r}: car test centres by pass rate, ${h.yearLabel(h.lastYear)} (DVSA table DRT122A); median wait ${h.month(h.lastMonth)} (DRT122F).`)}
<h2>${r}, year by year</h2>
${h.table(['Year (April to March)', 'Tests', 'Passes', `Pass rate, ${r}`, 'Great Britain'], yrows, `Sum of the ${r} centres in the DVSA centre table.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Waiting time in ${r}, month by month</h2>
${h.table(['Month', `Median wait, ${r}`, 'Booked within 7 weeks', 'Great Britain'], wrows, 'Car practical tests taken in the month. DVSA table DRT121G.', ['l', 'r', 'r', 'r'])}
`;
}

/** "above", "below" or "level with". */
export const side = (x: number | null | undefined, y: number | null | undefined) => (x == null || y == null ? 'level with' : x > y ? 'above' : x < y ? 'below' : 'level with');

/** Position (1 = highest) of a region among the 11 for one figure, and the number of regions compared. */
export function rankOf(h: Helpers, r: string, pick: (f: RegionFacts) => number | null | undefined) {
  const v = h.E.REGIONS.map((x) => ({ x, v: pick(regionFacts(h, x)) })).filter((o) => o.v != null).sort((a, b) => (b.v as number) - (a.v as number));
  return { rank: v.findIndex((o) => o.x === r) + 1, of: v.length, first: v[0]?.x, last: v[v.length - 1]?.x };
}

/** Share of all car tests in Britain taken in an automatic, latest year. */
export function gbAutoShare(h: Helpers) {
  const t = h.F.FULL_CENTRES.reduce((s, c) => s + (c.pass[h.lastYear]?.[0] ?? 0), 0);
  const a = h.F.FULL_CENTRES.reduce((s, c) => s + (c.auto?.[0] ?? 0), 0);
  return t ? a / t : null;
}

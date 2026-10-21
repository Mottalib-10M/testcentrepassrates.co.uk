/** Writing helpers handed to every page: links, figures read from the DVSA data, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as E from './engine/centres';
import * as F from './engine/full';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "2026-09" → "September 2026". */
export const monthLabel = (k: string) => { const [y, m] = k.split('-'); return `${MONTHS[Number(m) - 1]} ${y}`; };
/** "2025-26" → "2025/26". */
export const yearLabel = (k: string) => k.replace('-', '/');
/** Centre page id convention: `centre-<centre id>` → `<slug>-driving-test-centre`. */
export const centrePageId = (id: string) => `centre-${id}`;

export function helpers(strict = false) {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const m2 = (n: number) => formatMoney(n, 2);
  /** A fraction as a percentage: 0.514 → "51.4 %". */
  const pc = (x: number | null | undefined, d = 1) => (x == null ? 'n/a' : formatPercent(x, d));
  /** A percentage already in points: 51.4 → "51.4 %". */
  const pp = (x: number | null | undefined, d = 1) => (x == null ? 'n/a' : formatPercent(x / 100, d));
  const wk = (x: number | null | undefined) => (x == null ? 'n/a' : `${formatNumber(x, Number.isInteger(x) ? 0 : 1)} weeks`);
  const num = (n: number, d = 0) => formatNumber(n, d);
  /** A change in percentage points: 3.5 → "+3.5 points". */
  const pts = (x: number | null | undefined) => (x == null ? 'n/a' : `${x > 0 ? '+' : x < 0 ? '−' : ''}${formatNumber(Math.abs(x), 1)} point${Math.abs(x) === 1 ? '' : 's'}`);
  /** 1 → "1st", 22 → "22nd". */
  const ord = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; };
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, 'en')}">${text}</a>`;
  };
  const hasPage = (id: string) => ROUTES.some((r) => r.id === centrePageId(id));
  /** Link to a centre's own page when it has one, else its name. */
  const cl = (id: string, text?: string) => { const c = E.centre(id); return hasPage(id) ? a(centrePageId(id), text ?? c.n) : (text ?? c.n); };
  const lastMonth = E.WAIT_MONTH;
  const gb = { rate: E.gbRate(), first: E.gbFirst(), auto: E.gbAuto(), theory: E.gbTheory(), m: E.gbSex('m'), f: E.gbSex('f'), wait: F.areaWait('Great Britain', lastMonth) };
  /** Pass rate of a whole region (passes / tests of its centres), latest year. */
  const regionRate = (r: string) => { const l = F.FULL_CENTRES.filter((c) => c.region === r && c.pass[E.LAST_YEAR]); const t = l.reduce((s, c) => s + c.pass[E.LAST_YEAR][0], 0); const p = l.reduce((s, c) => s + c.pass[E.LAST_YEAR][1], 0); return t ? p / t : null; };
  /** Every figure of one centre, ready for a sentence. */
  const C = (id: string) => {
    const f = F.full(id), l = E.centre(id);
    const ys = F.years(f);
    const rateOf = (y: string) => F.pr(f.pass[y]);
    const w = F.lastWait(f);
    const ranked = E.sorted(E.CENTRES.filter((c) => c.t >= 1000), 'rate');
    const inRegion = E.sorted(E.inRegion(f.region).filter((c) => c.t >= 300), 'rate');
    const ageRates = Object.fromEntries(Object.entries(f.age).map(([k, v]) => [k, F.pr(v)]));
    return {
      f, l, id, name: f.name, region: f.region, country: f.country, addr: f.addr, notes: f.notes, types: f.types,
      tests: f.pass[E.LAST_YEAR]?.[0] ?? 0, passes: f.pass[E.LAST_YEAR]?.[1] ?? 0,
      rate: rateOf(E.LAST_YEAR), rateOf, years: ys,
      trend3: E.trend(l), m: F.pr(f.sex.m), fem: F.pr(f.sex.f),
      first: f.first ? f.first[1] / f.first[0] : null, firstTests: f.first?.[0] ?? 0, zero: f.first ? f.first[2] : 0,
      auto: F.pr(f.auto), autoTests: f.auto?.[0] ?? 0, autoShare: f.auto?.[0] && f.pass[E.LAST_YEAR] ? f.auto[0] / f.pass[E.LAST_YEAR][0] : null,
      age: ageRates, cancel: f.cancel,
      wait: w, waitYearAgo: F.waitYearAgo(f),
      near: f.near.map(([n, mi, nid]) => ({ name: n, miles: mi, id: nid, rate: nid && E.hasCentre(nid) ? E.rate(E.centre(nid)) : null, wait: nid && E.hasCentre(nid) ? E.centre(nid).w : null })),
      rankGB: ranked.findIndex((c) => c.id === id) + 1, ofGB: ranked.length,
      rankRegion: inRegion.findIndex((c) => c.id === id) + 1, ofRegion: inRegion.length,
      regionRate: regionRate(f.region), regionWait: F.areaWait(f.region === 'Wales' || f.region === 'Scotland' ? f.region : f.region, lastMonth),
    };
  };
  return {
    P, E, F, gb, regionRate, C, cl, a, hasPage, m, m2, pc, pp, wk, num, pts, ord,
    month: monthLabel, yearLabel, lastMonth, lastYear: E.LAST_YEAR,
    /** "1 April 2026" from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Five financial years of one centre: tests, passes, rate, and GB rate. */
    yearTable: (id: string, caption?: string) => {
      const c = F.full(id);
      const rows = F.years(c).map((y) => [yearLabel(y), c.pass[y][0], c.pass[y][1], pc(F.pr(c.pass[y])), pc(E.gbRate(y))]);
      return table(['Year (April to March)', 'Tests', 'Passes', 'Pass rate', 'Great Britain'], rows, caption ?? `${c.name}: car practical tests by financial year. DVSA table DRT122A.`, ['l', 'r', 'r', 'r', 'r']);
    },
    /** Monthly waiting time of one centre over the last n months. */
    waitTable: (id: string, n = 12, caption?: string) => {
      const c = F.full(id); const ms = F.months(c).slice(-n).reverse();
      const rows = ms.map((k) => { const v = c.wait[k]; const g = F.areaWait('Great Britain', k); return [monthLabel(k), wk(v[0]), v[2] == null ? 'n/a' : pp(v[2]), wk(g?.[3]), wk(v[1])]; });
      return table(['Month', 'Median wait', 'Booked within 7 weeks', 'GB median', 'Weeks to 10 % booked'], rows, caption ?? `${c.name}: weeks between booking and test, by month of test. DVSA table DRT122F.`, ['l', 'r', 'r', 'r', 'r']);
    },
    /** Pass rate by age (17 to 25) at one centre, with the national rate of each age. */
    ageTable: (id: string, caption?: string) => {
      const c = F.full(id);
      const rows = Object.entries(c.age).filter(([, v]) => v[0] > 0).map(([k, v]) => [k === '17' ? '17' : k, v[0], pc(F.pr(v)), pc(E.ageRate(Number(k)))]);
      return table(['Age', 'Tests', 'Pass rate here', 'Great Britain'], rows, caption ?? `${c.name}, ${yearLabel(E.LAST_YEAR)}: pass rate by age of the candidate. DVSA table DRT122D.`, ['l', 'r', 'r', 'r']);
    },
    /** The three centres a test can be moved to, with their rate and wait. */
    nearTable: (id: string, caption?: string) => {
      const c = C(id);
      const rows = [[`<strong>${c.name}</strong>`, '0', pc(c.rate), wk(c.wait?.median)], ...c.near.map((n) => [n.id && E.hasCentre(n.id) ? cl(n.id, n.name) : n.name, formatNumber(n.miles, 0), pp(n.rate), wk(n.wait)])];
      return table(['Centre', 'Miles', `Pass rate ${yearLabel(E.LAST_YEAR)}`, `Median wait ${monthLabel(lastMonth)}`], rows, caption ?? `${c.name} and the 3 centres a test booked there can be moved to (DVSA list).`, ['l', 'r', 'r', 'r']);
    },
    /** A list of centres with rate, trend, tests and wait. */
    centreTable: (list: E.Lite[], caption?: string) => {
      const rows = list.map((c) => [cl(c.id), E.COUNTRY[c.c] === 'England' ? c.r : E.COUNTRY[c.c], c.t, pp(E.rate(c)), E.trend(c) == null ? 'n/a' : `${(E.trend(c) as number) > 0 ? '+' : ''}${formatNumber(E.trend(c) as number, 1)}`, wk(c.w)]);
      return table(['Centre', 'Region', 'Tests', 'Pass rate', '3-year change (pts)', 'Median wait'], rows, caption, ['l', 'l', 'r', 'r', 'r', 'r']);
    },
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;

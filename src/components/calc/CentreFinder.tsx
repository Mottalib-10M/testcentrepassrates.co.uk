/**
 * Test centre finder (main tool): a postcode, an outward code or a centre name, a radius in miles and a
 * sort order → the car practical test centres around, with the latest DVSA pass rate, the three-year
 * change, the first-attempt rate and the median wait of the latest month. Region mode lists one region.
 * Everything runs in the browser on the light list; nothing typed is sent anywhere.
 * Hydration (RECETTE §17.5): first render = props defaults; link parameters applied in an effect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CENTRES, centre as byId, findPlace, near, rate, trend, sorted, inRegion, hasCentre, LAST_YEAR, WAIT_MONTH, YEARS, type Near, type Lite } from '../../lib/engine/centres';
import { formatNumber, formatPercent } from '../../lib/format';
import { readParams, str, num, updateURL } from '../../lib/url-state';

interface Props { q?: string; centre?: string; region?: string; sort?: 'near' | 'rate' | 'wait'; radius?: number; pages?: Record<string, string>; methodHref?: string; idPrefix?: string }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthLabel = (k: string) => { const [y, m] = k.split('-'); return `${MONTHS[Number(m) - 1]} ${y}`; };
const pp = (x: number | null) => (x == null ? 'n/a' : formatPercent(x / 100, 1));
const wk = (x: number | null) => (x == null ? 'n/a' : `${formatNumber(x, 1)} wk`);
const SORTS = [{ value: 'near', label: 'Nearest first' }, { value: 'rate', label: 'Highest pass rate first' }, { value: 'wait', label: 'Shortest wait first' }];
const YL = LAST_YEAR.replace('-', '/');

export default function CentreFinder({ q: q0 = '', centre: c0, region, sort: s0 = 'near', radius: r0 = 15, pages = {}, methodHref, idPrefix = 'f' }: Props) {
  const startQ = c0 && hasCentre(c0) ? byId(c0).n : q0;
  const [q, setQ] = useState(startQ);
  const [radius, setRadius] = useState(r0);
  const [sort, setSort] = useState<'near' | 'rate' | 'wait'>(s0);
  const [minTests, setMinTests] = useState(300);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setQ(str(u, 'q', startQ)); setRadius(num(u, 'mi', r0)); const s = str(u, 's', s0); if (s === 'near' || s === 'rate' || s === 'wait') setSort(s);
  }, []);
  useEffect(() => { updateURL({ q: q || undefined, mi: radius === r0 ? undefined : radius, s: sort === s0 ? undefined : sort }); }, [q, radius, sort]);

  const place = useMemo(() => findPlace(q), [q]);
  const regionMode = !!region && !q.trim();
  const list: Array<Lite & { d?: number }> = useMemo(() => {
    let l: Array<Lite & { d?: number }> = regionMode ? inRegion(region!) : place ? near(place, Math.max(1, radius), 60) : [];
    if (sort === 'rate') l = sorted(l, 'rate') as typeof l;
    if (sort === 'wait') l = sorted(l, 'wait', true) as typeof l;
    if (sort === 'near' && regionMode) l = sorted(l, 'name') as typeof l;
    return l;
  }, [place, radius, sort, regionMode, region]);
  const eligible = list.filter((c) => rate(c) != null && c.t >= minTests);
  const best = eligible.length ? eligible.reduce((a, b) => ((rate(b) as number) > (rate(a) as number) ? b : a)) : null;
  const fastest = list.filter((c) => c.w != null && c.t >= minTests).reduce<(typeof list)[number] | null>((a, b) => (!a || (b.w as number) < (a.w as number) ? b : a), null);
  const self = place?.kind === 'centre' ? CENTRES.find((c) => c.n === place.label) : undefined;
  const id = (x: string) => `${idPrefix}-${x}`;
  const where = regionMode ? region : place ? `${formatNumber(radius, 0)} miles of ${place.label}` : '';
  const name = (c: Lite) => (pages[c.id] ? <a href={pages[c.id]} className="text-accent-700 underline underline-offset-2">{c.n}</a> : c.n);

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-y-0">
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={id('q')} className="mb-1 block text-sm font-medium text-navy-700">Postcode, district or test centre</label>
            <input id={id('q')} type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder={region ? `Every centre in ${region}` : 'e.g. NW9 5TZ, LS9 or Hendon'} autoComplete="postal-code" aria-describedby={id('q-help')}
              className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <p id={id('q-help')} className="mt-1 text-xs text-navy-500">{q.trim() && !place ? 'Not found: try the first half of the postcode (NW9) or a centre name' : 'England, Scotland and Wales; nothing is sent'}</p>
          </div>
          <NumberField id={id('mi')} label="Within (miles)" value={radius} onChange={setRadius} unit="mi" max={200} />
          <SelectField id={id('sort')} label="Order" value={sort} onChange={(v) => setSort(v as typeof sort)} options={SORTS} />
        </div>
      </form>
      <div data-resultat aria-live="polite" className="mt-4 border-l-4 border-accent-500 bg-accent-50 p-4">
        {self && !regionMode ? (
          <>
            <p className="text-sm font-medium text-navy-700">{self.n}, pass rate {YL}</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{pp(rate(self))}<span className="ml-2 text-base font-medium text-navy-700">of {formatNumber(self.t, 0)} tests</span></p>
            <p className="mt-1 text-sm text-navy-800">Median wait {wk(self.w)} in {monthLabel(WAIT_MONTH)}. {best && best.id !== self.id ? <>Highest rate within {formatNumber(radius, 0)} miles: <strong>{best.n}</strong>, {pp(rate(best))}.</> : best ? <>No centre within {formatNumber(radius, 0)} miles has a higher rate.</> : null}</p>
          </>
        ) : best ? (
          <>
            <p className="text-sm font-medium text-navy-700">Highest pass rate within {where}, {YL}</p>
            <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{best.n}: {pp(rate(best))}</p>
            <p className="mt-1 text-sm text-navy-800">{list.length} centres listed. {fastest ? <>Shortest median wait: <strong>{fastest.n}</strong>, {wk(fastest.w)} in {monthLabel(WAIT_MONTH)}.</> : null}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-navy-700">No car test centre found</p>
            <p className="mt-1 text-xl font-bold text-navy-900">{q.trim() ? 'Widen the radius or check the postcode' : 'Type a postcode or a centre name'}</p>
          </>
        )}
      </div>
      {list.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="journal w-full text-sm">
            <thead><tr>
              <th scope="col" className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-navy-700">Centre</th>
              {!regionMode && <th scope="col" className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-navy-700">Miles</th>}
              <th scope="col" className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-navy-700">Pass {YL}</th>
              <th scope="col" className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-navy-700">3 yrs</th>
              <th scope="col" className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-navy-700">1st try</th>
              <th scope="col" className="px-2 py-2 text-right text-xs font-semibold uppercase tracking-wide text-navy-700">Wait</th>
            </tr></thead>
            <tbody>
              {list.slice(0, 15).map((c) => { const t = trend(c); return (
                <tr key={c.id} className={self?.id === c.id ? 'bg-accent-50 font-semibold' : ''}>
                  <td className="border-b border-navy-100 px-2 py-2 text-navy-900">{name(c)}{c.t < minTests ? <span className="ml-1 text-xs text-navy-500">({c.t} tests)</span> : null}</td>
                  {!regionMode && <td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{c.d == null ? '' : formatNumber(c.d, 0)}</td>}
                  <td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{pp(rate(c))}</td>
                  <td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{t == null ? 'n/a' : `${t > 0 ? '+' : ''}${formatNumber(t, 1)}`}</td>
                  <td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{pp(c.f)}</td>
                  <td className="tabular-nums border-b border-navy-100 px-2 py-2 text-right">{wk(c.w)}</td>
                </tr>); })}
            </tbody>
          </table>
          {list.length > 15 && <p className="mt-2 text-xs text-navy-600">15 of {list.length} centres shown; narrow the radius or change the order to see others.</p>}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-navy-600">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={minTests > 0} onChange={(e) => setMinTests(e.target.checked ? 300 : 0)} /> Ignore centres with fewer than 300 tests a year for the headline</label>
        <span>Pass rate: DVSA DRT122A, April to March. 3 yrs: change in points since {YEARS[0].replace('-', '/')}. Wait: median weeks from booking to test, DRT122F, {monthLabel(WAIT_MONTH)}. Distances are straight lines.</span>
        {methodHref && <a href={methodHref} className="text-accent-700 underline underline-offset-2">How these figures are built</a>}
      </div>
    </div>
  );
}

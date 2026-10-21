import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Pair = [number, number];
export default definePage({
  id: 'driving-test-pass-rates-by-year',
  group: 'rates',
  order: 120,
  tool: { kind: 'mini:gbyear' },
  related: ['easiest-driving-test-centres', 'first-time-pass-rates', 'theory-test-pass-rates', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_data', 'ogl'],
  slug: 'driving-test-pass-rates-by-year',
  nav: 'Pass rate by year',
  card: 'The national car test pass rate every year since 2007, by sex and by quarter.',
  title: `Driving Test Pass Rate by Year: 2007/08 to ${YL}, GB`,
  description: `Driving test pass rate in Great Britain each year from 2007/08 to ${YL}, with tests taken, the rates of women and men and the latest quarters, from DVSA.`,
  h1: 'Driving test pass rates year by year since 2007',
  intro: 'Choose a financial year to see the national car practical test pass rate, the number of tests and the rate by sex.',
  resume: (h) => {
    const P = h.E.NATIONAL.practical as Record<string, Record<'m' | 'f' | 't', Pair>>;
    const ys = Object.keys(P);
    const r = (y: string) => P[y].t[1] / P[y].t[0];
    const lo = ys.reduce((a, y) => (r(y) < r(a) ? y : a));
    const hi = ys.filter((y) => y !== '2020-21').reduce((a, y) => (r(y) > r(a) ? y : a));
    const prev = ys[ys.length - 2];
    return `The car practical driving test pass rate in Great Britain was ${h.pc(r(h.lastYear))} in ${h.yearLabel(h.lastYear)}, ${r(h.lastYear) > r(prev) ? 'up' : 'down'} from ${h.pc(r(prev))} the year before, on ${h.num(P[h.lastYear].t[0])} tests. Since the DVSA series began in ${h.yearLabel(ys[0])}, the yearly rate has stayed within a narrow band: its lowest was ${h.pc(r(lo))} in ${h.yearLabel(lo)} and, leaving aside the pandemic year 2020/21, its highest ${h.pc(r(hi))} in ${h.yearLabel(hi)}. The number of tests moved far more than the rate, from ${h.num(P['2020-21'].t[0])} in 2020/21, when testing stopped for months, to ${h.num(Math.max(...ys.map((y) => P[y].t[0])))} at the peak. Men passed more often than women in ${ys.filter((y) => P[y].m[1] / P[y].m[0] > P[y].f[1] / P[y].f[0]).length} of the ${ys.length} years of the series. Pick any year in the calculator above to see its tests, its rate for women and for men, and the latest year beside it.`;
  },
  faqs: (h) => {
    const P = h.E.NATIONAL.practical as Record<string, Record<'m' | 'f' | 't', Pair>>;
    const q = h.E.NATIONAL.quarters as Array<[string, number, number]>;
    const lq = q[q.length - 1];
    return [
      { q: 'What is the current UK driving test pass rate?', a: `For the latest full financial year, ${h.yearLabel(h.lastYear)}, ${h.pc(h.gb.rate)} of car practical tests in Great Britain ended in a pass. DVSA also publishes quarters: in ${lq[0].replace(/^\d{4} to \d{4} /, '').replace(/^Q\d /, '')} ${lq[0].slice(0, 4)}, ${h.num(lq[2])} of ${h.num(lq[1])} tests passed, ${h.pc(lq[2] / lq[1])}. Northern Ireland, run by the DVA, publishes its own figures.` },
      { q: 'Why was the pass rate higher in 2020/21?', a: `Testing was suspended for long periods during the pandemic, and only ${h.num(P['2020-21'].t[0])} tests took place, ${h.pc(P['2020-21'].t[0] / P['2019-20'].t[0], 0)} of the year before. Many of those who did test had waited months and had extra practice. The rate of ${h.pc(P['2020-21'].t[1] / P['2020-21'].t[0])} is therefore not comparable with other years.` },
      { q: 'Do men pass the driving test more than women?', a: `${h.gb.m > h.gb.f ? 'Yes' : 'Not lately'}, by a few points. In ${h.yearLabel(h.lastYear)} men passed ${h.pc(h.gb.m)} of their tests and women ${h.pc(h.gb.f)}. The gap narrows at some ages and widens at others; the age and sex page shows it year by year of age, from the DVSA table DRT121C.` },
    ];
  },
  body: (h) => {
    const P = h.E.NATIONAL.practical as Record<string, Record<'m' | 'f' | 't', Pair>>;
    const ys = Object.keys(P);
    const rows = [...ys].reverse().map((y) => [h.yearLabel(y), P[y].t[0], P[y].t[1], h.pc(P[y].t[1] / P[y].t[0]), h.pc(P[y].f[1] / P[y].f[0]), h.pc(P[y].m[1] / P[y].m[0])]);
    const q = h.E.NATIONAL.quarters as Array<[string, number, number]>;
    const qrows = q.map(([l, t, p]) => [l.replace(/ to \d{4}/, '/').replace(/^(\d{4})\//, (_m, a) => `${a}/${String(Number(a.slice(2)) + 1).padStart(2, '0')}`), t, p, h.pc(p / t)]);
    const gap = h.gb.m - h.gb.f;
    const busiest = q.reduce((a, x) => (x[1] > a[1] ? x : a));
    const best = q.reduce((a, x) => (x[2] / x[1] > a[2] / a[1] ? x : a));
    const gap0 = P[ys[0]].m[1] / P[ys[0]].m[0] - P[ys[0]].f[1] / P[ys[0]].f[0];
    const th = h.E.NATIONAL.theory as Record<string, Record<'t', Pair>>;
    return `
<h2>Every year since 2007/08</h2>
<p>DVSA counts tests by financial year, April to March. The table gives the tests conducted, the passes and the rate for women and for men. Each line is the sum of every car practical test in England, Scotland and Wales that year, including the centres too small to appear on their own in the centre tables.</p>
${h.table(['Year', 'Tests', 'Passes', 'Pass rate', 'Women', 'Men'], rows, 'Car practical tests, Great Britain. DVSA table DRT121A.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>A stable rate, a moving queue</h2>
<p>The striking feature of the series is how little the rate moves. Year after year, close to half of tests end in a pass, whatever happens to the number of candidates. What changes is demand: after the pandemic, the backlog pushed the number of tests in ${h.yearLabel(h.lastYear)} to ${h.num(P[h.lastYear].t[0])}, and waiting times followed. The ${h.a('driving-test-waiting-times', 'waiting times page')} shows the median wait month by month since ${h.month(Object.keys(h.E.NATIONAL.areas['Great Britain'])[0])}.</p>
<p>The gap between men and women tells a different story. In ${h.yearLabel(ys[0])} men passed ${h.pts(Math.round(gap0 * 1000) / 10).replace('+', '')} more often than women; in ${h.yearLabel(h.lastYear)} the gap was ${h.pts(Math.round(gap * 1000) / 10).replace('+', '')}. Women's rate rose from ${h.pc(P[ys[0]].f[1] / P[ys[0]].f[0])} to ${h.pc(h.gb.f)} over the period, while men's moved from ${h.pc(P[ys[0]].m[1] / P[ys[0]].m[0])} to ${h.pc(h.gb.m)}. DVSA gives no reason; the tables show the change, not its cause. The theory test followed its own path: its pass rate stood at ${h.pc(th['2007-08'].t[1] / th['2007-08'].t[0])} in 2007/08 and ${h.pc(h.gb.theory)} in ${h.yearLabel(h.lastYear)}, and the ${h.a('theory-test-pass-rates', 'theory page')} has the detail by centre.</p>
<h2>The latest quarters</h2>
<p>Quarterly figures arrive before the yearly centre tables, so they give the first sign of the next year's rate. Over the eight quarters shown, the busiest was ${busiest[0].replace(/^\d{4} to \d{4} /, '')} of ${busiest[0].slice(0, 4)}/${busiest[0].slice(10, 12)}, with ${h.num(busiest[1])} tests, and the highest rate ${h.pc(best[2] / best[1])}, in ${best[0].replace(/^\d{4} to \d{4} /, '')} of ${best[0].slice(0, 4)}/${best[0].slice(10, 12)}. A quarter is too short to read much into a single movement, but a run of quarters in the same direction usually shows up in the yearly figure.</p>
${h.table(['Quarter', 'Tests', 'Passes', 'Pass rate'], qrows, 'Car practical tests by quarter, Great Britain. DVSA table DRT121A.', ['l', 'r', 'r', 'r'])}
<h2>From the national rate to your centre</h2>
<p>The national figure averages ${h.E.CENTRES.length} centres whose own rates in ${h.yearLabel(h.lastYear)} ranged from ${h.pp(Math.min(...h.E.CENTRES.filter((c) => h.E.rate(c) != null).map((c) => h.E.rate(c) as number)))} to ${h.pp(Math.max(...h.E.CENTRES.filter((c) => h.E.rate(c) != null).map((c) => h.E.rate(c) as number)))}. The ${h.a('easiest-driving-test-centres', 'highest pass rates')} and ${h.a('hardest-driving-test-centres', 'lowest pass rates')} pages rank them, and the ${h.a('first-time-pass-rates', 'first-time page')} strips out repeat candidates, which is the fairest way to compare one year or one centre with another. All figures come from the ${h.src('dvsa_data', 'DVSA driving test data for cars')}, reused under the ${h.src('ogl', 'Open Government Licence')}.</p>
`;
  },
});

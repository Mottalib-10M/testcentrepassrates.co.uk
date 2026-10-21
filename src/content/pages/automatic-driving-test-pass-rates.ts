import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Pair = [number, number];
export default definePage({
  id: 'automatic-driving-test-pass-rates',
  group: 'rates',
  order: 140,
  tool: { kind: 'mini:auto', props: { centre: 'west-didsbury-manchester' } },
  related: ['first-time-pass-rates', 'easiest-driving-test-centres', 'cost-of-learning-to-drive', 'driving-lesson-prices', 'driving-test-pass-rates-by-year'],
  sources: ['dvsa_pass_centre', 'dvsa_data', 'gov_test_car'],
  slug: 'automatic-driving-test-pass-rates',
  nav: 'Automatic pass rates',
  card: 'Pass rates in automatic cars by centre, against manual cars, and the national trend.',
  title: `Automatic Driving Test Pass Rates ${YL} by Test Centre`,
  description: `Automatic driving test pass rates for ${YL} at every car test centre in Britain, against manual cars, with the national share of automatic tests since 2007/08`,
  h1: 'Automatic driving test pass rates by centre',
  intro: 'Choose a centre to compare the pass rate of candidates in automatic cars with those in manual cars.',
  resume: (h) => {
    const A = h.E.NATIONAL.auto as Record<string, Pair>;
    const T = h.E.NATIONAL.practical as Record<string, Record<'t', Pair>>;
    const a = A[h.lastYear], t = T[h.lastYear].t;
    const manual = (t[1] - a[1]) / (t[0] - a[0]);
    const ys = Object.keys(A);
    return `Candidates who took the car practical test in an automatic passed ${h.pc(a[1] / a[0])} of the time in Great Britain in ${h.yearLabel(h.lastYear)}, against ${h.pc(manual)} for those in a manual car, according to DVSA. Automatics now account for ${h.pc(a[0] / t[0], 0)} of all tests, ${h.num(a[0])} in the year, up from ${h.pc(A[ys[0]][0] / T[ys[0]].t[0], 0)} in ${h.yearLabel(ys[0])}. The gap between the two gearboxes is ${manual > a[1] / a[0] ? 'in favour of manual cars' : 'in favour of automatics'} nationally, but it varies from centre to centre, and at some centres automatic candidates do better. Choose a centre above to see both rates side by side. Remember that a pass in an automatic only allows you to drive automatic cars, so the choice of gearbox is first a choice of licence, and only then a question of odds at the centre where you book.`;
  },
  faqs: (h) => {
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && c.a != null).sort((a, b) => (b.a as number) - (a.a as number));
    const A = h.E.NATIONAL.auto as Record<string, Pair>;
    return [
      { q: 'Is the automatic driving test easier to pass?', a: `${h.gb.auto < h.gb.rate ? 'Not on the national figures' : 'On the national figures, slightly'}: in ${h.yearLabel(h.lastYear)} automatic candidates passed ${h.pc(h.gb.auto)}, against ${h.pc(h.gb.rate)} for all candidates. The test itself is the same, minus the clutch control. DVSA does not split automatic results by age or attempt, so the reason cannot be read from its tables; who chooses an automatic probably matters more than the gearbox.` },
      { q: 'Which test centre has the highest automatic pass rate?', a: `Among centres with at least 1,000 tests in ${h.yearLabel(h.lastYear)}, ${big[0].n} had the highest automatic rate, ${h.pp(big[0].a)}, followed by ${big[1].n} at ${h.pp(big[1].a)}. The lowest was ${big[big.length - 1].n}, at ${h.pp(big[big.length - 1].a)}. DVSA publishes these figures in table DRT122E, once a year, for every centre where more than one examiner tests automatic cars.` },
      { q: 'Can I drive a manual car after passing in an automatic?', a: 'No. GOV.UK states that if you pass in an automatic or semi-automatic car you can only drive automatic and semi-automatic cars. To drive manuals you take another practical test in a manual car; you do not need to pass the theory test again for that upgrade.' },
      { q: 'How many people take the driving test in an automatic?', a: `${h.num(A[h.lastYear][0])} tests in ${h.yearLabel(h.lastYear)}, ${h.pc(A[h.lastYear][0] / h.E.NATIONAL.practical[h.lastYear].t[0], 0)} of all car practical tests in Great Britain. In ${h.yearLabel(Object.keys(A)[0])}, the first year DVSA published, there were ${h.num(A[Object.keys(A)[0]][0])}. Electric cars, which have no manual gearbox, can only be used for an automatic test, so the share is likely to keep rising.` },
    ];
  },
  body: (h) => {
    const A = h.E.NATIONAL.auto as Record<string, Pair>;
    const T = h.E.NATIONAL.practical as Record<string, Record<'t', Pair>>;
    const ys = Object.keys(A);
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && c.a != null && c.mn != null);
    const better = big.filter((c) => (c.a as number) > (c.mn as number));
    const gap = (c: (typeof big)[number]) => (c.a as number) - (c.mn as number);
    const row = (c: (typeof big)[number]) => [h.cl(c.id), c.r, h.pp(c.a), h.pp(c.mn), `${gap(c) > 0 ? '+' : ''}${h.num(Math.round(gap(c) * 10) / 10)}`];
    const topA = [...big].sort((a, b) => (b.a as number) - (a.a as number)).slice(0, 10);
    const lowA = [...big].sort((a, b) => (a.a as number) - (b.a as number)).slice(0, 10);
    const yrows = [...ys].reverse().slice(0, 10).map((y) => [h.yearLabel(y), A[y][0], h.pc(A[y][0] / T[y].t[0], 0), h.pc(A[y][1] / A[y][0]), h.pc((T[y].t[1] - A[y][1]) / (T[y].t[0] - A[y][0]))]);
    return `
<h2>Where automatic candidates do best and worst</h2>
<p>At ${better.length} of the ${big.length} busy centres, automatic candidates passed more often than manual ones in ${h.yearLabel(h.lastYear)}. ${better.length < big.length / 2 ? 'That is the minority: at most centres the gearbox that removes stalling and clutch control still comes with a lower pass rate.' : 'That is the majority, a reversal of the national pattern of earlier years.'} The difference in points sits in the last column of each table.</p>
${h.table(['Centre', 'Region', 'Automatic', 'Manual', 'Gap (pts)'], topA.map(row), `Highest automatic pass rates among centres with 1,000 tests or more, ${h.yearLabel(h.lastYear)}. DVSA table DRT122E.`, ['l', 'l', 'r', 'r', 'r'])}
${h.table(['Centre', 'Region', 'Automatic', 'Manual', 'Gap (pts)'], lowA.map(row), `Lowest automatic pass rates, same centres and year.`, ['l', 'l', 'r', 'r', 'r'])}
<h2>A fast-growing share of tests</h2>
<p>Ten years of national figures show the move to automatics. The manual rate in the last column is worked out from DVSA's totals: all passes minus automatic passes, divided by all tests minus automatic tests.</p>
${h.table(['Year', 'Automatic tests', 'Share of tests', 'Automatic rate', 'Manual rate'], yrows, 'Car practical tests, Great Britain. DVSA tables DRT121A and DRT122E.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Why automatic candidates pass less often</h2>
<p>The test is the same in both cars (${h.src('gov_test_car', 'GOV.UK')}), so the gap comes from the candidates rather than the gearbox. DVSA does not split its automatic figures by age or attempt, which leaves only reasonable guesses: automatics attract older learners, whose national pass rates are lower, and candidates who switch after struggling with a manual. The national gap has stayed between ${h.num(Math.round(Math.min(...ys.slice(-5).map((y) => (T[y].t[1] - A[y][1]) / (T[y].t[0] - A[y][0]) - A[y][1] / A[y][0])) * 1000) / 10)} and ${h.num(Math.round(Math.max(...ys.slice(-5).map((y) => (T[y].t[1] - A[y][1]) / (T[y].t[0] - A[y][0]) - A[y][1] / A[y][0])) * 1000) / 10)} points over the last five years.</p>
<h2>Reading a centre's two rates</h2>
<p>At a busy centre a gap of one or two points between automatic and manual candidates can come and go from one year to the next. A gap of five points or more, kept over several years, says something about the candidates who choose each car at that centre. The calculator above uses the latest year only; the page of each large centre shows its automatic share and rate beside its overall figures, and the share alone is telling: where automatics are a large part of the work, the centre's overall rate leans on them.</p>
<p>Automatic tests also follow the same booking rules as manual ones. Since 9 June 2026 a test can only be moved to the three centres nearest the one booked, so a candidate who wants a centre with a strong automatic rate has to choose it at the first booking.</p>
<h2>Choosing the gearbox</h2>
<p>The licence matters more than the odds. A pass in an automatic or semi-automatic car limits you to those cars; switching later means another practical test in a manual car, though not another theory test. If automatic lessons cost more where you live, enter that price in the ${h.a('cost-of-learning-to-drive', 'licence cost calculator')}, and the ${h.a('driving-lesson-prices', 'lesson prices page')} shows what instructors charge by region. If you will drive an electric car, the choice is already made: they have no manual gearbox. Every centre's automatic rate comes from table DRT122E of the ${h.src('dvsa_pass_centre', 'DVSA centre statistics')}.</p>
`;
  },
});

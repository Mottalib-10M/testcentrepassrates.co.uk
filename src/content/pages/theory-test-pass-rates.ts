import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Pair = [number, number];
export default definePage({
  id: 'theory-test-pass-rates',
  group: 'rates',
  order: 170,
  tool: { kind: 'mini:theory', props: { tc: 'birmingham' } },
  related: ['cost-of-learning-to-drive', 'driving-test-pass-rates-by-year', 'first-time-pass-rates', 'easiest-driving-test-centres', 'pass-rate-by-attempt'],
  sources: ['dvsa_theory_centre', 'dvsa_data', 'gov_theory_result', 'gov_cost'],
  slug: 'theory-test-pass-rates',
  nav: 'Theory test pass rates',
  card: 'The car theory test pass rate of every theory centre, and the national trend.',
  title: `Theory Test Pass Rates ${YL} by Centre: Car, Great Britain`,
  description: `Theory test pass rates for cars in ${YL} at every theory centre of Great Britain, for women and men, with the national rate since 2007 and the pass marks.`,
  h1: 'Car theory test pass rates by centre',
  intro: 'Choose a theory test centre to see its car pass rate, by sex, and what the expected number of attempts costs in fees.',
  resume: (h) => {
    const T = h.E.NATIONAL.theory as Record<string, Record<'m' | 'f' | 't', Pair>>;
    const t = T[h.lastYear].t;
    const big = h.E.THEORY_CENTRES.filter((c) => c.pass[h.lastYear] && c.pass[h.lastYear][0] >= 5000).sort((a, b) => (h.E.theoryRate(b) ?? 0) - (h.E.theoryRate(a) ?? 0));
    return `The car theory test pass rate in Great Britain was ${h.pc(t[1] / t[0])} in ${h.yearLabel(h.lastYear)}: ${h.num(t[1])} passes out of ${h.num(t[0])} tests, according to DVSA, ${t[1] / t[0] < h.gb.rate ? 'below' : 'above'} the ${h.pc(h.gb.rate)} of the practical test. Women passed ${h.pc(T[h.lastYear].f[1] / T[h.lastYear].f[0])} and men ${h.pc(T[h.lastYear].m[1] / T[h.lastYear].m[0])}. Among the ${big.length} theory centres with at least 5,000 car tests in the year, the rate ranged from ${h.pc(h.E.theoryRate(big[big.length - 1]))} at ${big[big.length - 1].name} to ${h.pc(h.E.theoryRate(big[0]))} at ${big[0].name}. To pass, a candidate needs ${h.P.rules.theoryMcqPass} out of ${h.P.rules.theoryMcqOf} in the multiple-choice part and ${h.P.rules.hazardPass} out of ${h.P.rules.hazardOf} in hazard perception, at the same sitting. Choose a centre above to see its rate, its rate for women and for men, how it compares with three years earlier and the theory fees a candidate can expect to pay there on average, since every failed sitting is paid again in full.`;
  },
  faqs: (h) => {
    const T = h.E.NATIONAL.theory as Record<string, Record<'t', Pair>>;
    const t = T[h.lastYear].t;
    return [
      { q: 'What percentage of people pass the theory test?', a: `${h.pc(t[1] / t[0])} of car theory tests taken in Great Britain in ${h.yearLabel(h.lastYear)} ended in a pass, ${h.num(t[1])} of ${h.num(t[0])}. Many candidates take it more than once, so the share of learners who eventually pass is far higher than the rate per test. DVSA publishes the rate for each theory centre in table DRT112A.` },
      { q: 'What is the pass mark for the car theory test?', a: `${h.P.rules.theoryMcqPass} out of ${h.P.rules.theoryMcqOf} for the multiple-choice questions and ${h.P.rules.hazardPass} out of ${h.P.rules.hazardOf} for the hazard perception clips, according to GOV.UK. Both parts must be passed at the same sitting; failing one means taking the whole test again, at least ${h.P.rules.theoryRetakeWorkingDays} working days later.` },
      { q: 'How long is a theory test pass valid?', a: `${h.P.rules.theoryValidYears} years from the day you pass. You need the certificate number to book the practical test, and if you have not passed the practical test within those ${h.P.rules.theoryValidYears} years you must take the theory test again and pay its £${h.P.fees.theory} fee once more.` },
      { q: 'Why is the theory pass rate lower than the practical?', a: 'DVSA does not publish a reason; both figures are simply passes divided by tests. One likely difference is timing: anyone with a provisional licence can book the theory test, whatever their preparation, while the practical test is usually booked once an instructor judges the learner ready. Each failed sitting also costs the full fee again.' },
    ];
  },
  body: (h) => {
    const T = h.E.NATIONAL.theory as Record<string, Record<'m' | 'f' | 't', Pair>>;
    const ys = Object.keys(T);
    const big = h.E.THEORY_CENTRES.filter((c) => c.pass[h.lastYear] && c.pass[h.lastYear][0] >= 5000).sort((a, b) => (h.E.theoryRate(b) ?? 0) - (h.E.theoryRate(a) ?? 0));
    const row = (c: (typeof big)[number]) => [c.name, c.pass[h.lastYear][0], h.pc(h.E.theoryRate(c)), h.pc(c.sex.f[1] / c.sex.f[0]), h.pc(c.sex.m[1] / c.sex.m[0])];
    const busiest = [...h.E.THEORY_CENTRES].filter((c) => c.pass[h.lastYear]).sort((a, b) => b.pass[h.lastYear][0] - a.pass[h.lastYear][0])[0];
    const hi = ys.reduce((a, y) => (T[y].t[1] / T[y].t[0] > T[a].t[1] / T[a].t[0] ? y : a));
    return `
<h2>Highest and lowest theory pass rates</h2>
<p>Theory centres are fewer and larger than practical centres: ${h.E.THEORY_CENTRES.length} of them appear in table DRT112A, the busiest being ${busiest.name} with ${h.num(busiest.pass[h.lastYear][0])} car tests in ${h.yearLabel(h.lastYear)}. The two tables below keep centres with at least 5,000 tests, where one bad week cannot move the rate much.</p>
${h.table(['Theory centre', 'Tests', 'Pass rate', 'Women', 'Men'], big.slice(0, 10).map(row), `Highest car theory pass rates, ${h.yearLabel(h.lastYear)}. DVSA table DRT112A.`, ['l', 'r', 'r', 'r', 'r'])}
${h.table(['Theory centre', 'Tests', 'Pass rate', 'Women', 'Men'], big.slice(-10).reverse().map(row), `Lowest car theory pass rates, same centres and year.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The national rate since 2007</h2>
<p>The theory rate has ${T[h.lastYear].t[1] / T[h.lastYear].t[0] < T[ys[0]].t[1] / T[ys[0]].t[0] ? 'fallen' : 'risen'} since the series began: it was ${h.pc(T[ys[0]].t[1] / T[ys[0]].t[0])} in ${h.yearLabel(ys[0])} and ${h.pc(h.gb.theory)} in ${h.yearLabel(h.lastYear)}. Its highest point in the series was ${h.yearLabel(hi)}, at ${h.pc(T[hi].t[1] / T[hi].t[0])}. Unlike the practical test, women ${T[h.lastYear].f[1] / T[h.lastYear].f[0] > T[h.lastYear].m[1] / T[h.lastYear].m[0] ? 'pass the theory test more often than men' : 'pass the theory test less often than men'}.</p>
${h.table(['Year', 'Tests', 'Pass rate', 'Women', 'Men'], [...ys].reverse().slice(0, 10).map((y) => [h.yearLabel(y), T[y].t[0], h.pc(T[y].t[1] / T[y].t[0]), h.pc(T[y].f[1] / T[y].f[0]), h.pc(T[y].m[1] / T[y].m[0])]), 'Car theory tests, Great Britain. DVSA table DRT121A.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Two parts, one sitting</h2>
<p>The test has a multiple-choice part and a hazard perception part, and GOV.UK requires a pass in both on the same day (${h.src('gov_theory_result', 'pass mark and result')}). A candidate who fails one part retakes the whole test, after at least ${h.P.rules.theoryRetakeWorkingDays} working days, and pays the £${h.P.fees.theory} fee again (${h.src('gov_cost', 'GOV.UK fees')}). At the national rate, the average candidate needs about ${h.num(Math.round(10 / h.gb.theory) / 10)} attempts, about £${Math.round(h.P.fees.theory / h.gb.theory)} in fees.</p>
<h2>Theory centres are not practical test centres</h2>
<p>The two tests are run in different buildings. Practical tests start from the ${h.E.CENTRES.length} DVSA driving test centres listed on this site; theory tests are taken at ${h.E.THEORY_CENTRES.length} theory test centres, often in town centres, on a computer. A learner can choose either kind of centre freely, and the 2026 rule limiting moves to the three nearest centres applies only to the practical test. The theory rates of a town and the practical rates of its test centre do not always agree: ${h.cl('birmingham-garretts-green', 'Birmingham Garretts Green')}, for instance, has its own practical rate on its page, while the Birmingham theory centre above has a rate of its own, built on a different group of candidates at a different stage of learning.</p>
<p>Unlike practical rates, theory rates by centre say little about the test itself, which is identical everywhere: the same question bank and the same clips. They mostly describe how well prepared local candidates are when they book, and that can be changed by revision rather than by choosing a centre.</p>
<h2>Where the theory fits in the timeline</h2>
<p>The pass certificate lasts ${h.P.rules.theoryValidYears} years and is needed to book the practical test. With a median wait of ${h.wk(h.gb.wait?.[3])} for a practical test in ${h.month(h.lastMonth)}, and longer at many centres, a learner who passes the theory late in their lessons should book the practical soon after. One who passes it early has time, but not unlimited time: a long run of practical retakes can outlast the certificate. The ${h.a('cost-of-learning-to-drive', 'licence cost calculator')} adds the expected theory fees to lessons and practical tests. Centre figures come from table DRT112A of the ${h.src('dvsa_theory_centre', 'DVSA statistics')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Pair = [number, number];
export default definePage({
  id: 'pass-rate-by-attempt',
  group: 'rates',
  order: 160,
  tool: { kind: 'mini:within', props: { centre: 'goodmayes-london', n: 3 } },
  related: ['first-time-pass-rates', 'pass-rate-by-age-and-sex', 'cost-of-learning-to-drive', 'driving-test-faults', 'driving-test-booking-rules-2026'],
  sources: ['dvsa_data', 'dvsa_pass_centre', 'gov_cost', 'gov_theory_result'],
  slug: 'driving-test-pass-rate-by-attempt',
  nav: 'By attempt',
  card: 'Pass rates at the first, second and later attempts, and your chance within a few tries.',
  title: `Driving Test Pass Rate by Attempt: 1st to 6th, ${YL}`,
  description: `Driving test pass rate by attempt in Great Britain for ${YL}: first, second and later tries, for women and men, and your chance of passing within a few tries.`,
  h1: 'Driving test pass rate by attempt',
  intro: 'Choose a centre and a number of attempts: the estimate scales the centre\'s rate by the national rate of each attempt.',
  resume: (h) => {
    const T = h.E.NATIONAL.attempts.rows.t as Record<string, Pair>;
    const all = Object.values(T).reduce((a, x) => [a[0] + x[0], a[1] + x[1]], [0, 0]);
    return `In ${h.yearLabel(h.lastYear)}, ${h.pc(h.E.attemptRate(1))} of first attempts at the car practical test in Great Britain ended in a pass, ${h.pc(h.E.attemptRate(2))} of second attempts and ${h.pc(h.E.attemptRate(3))} of third attempts, according to DVSA table DRT121D. The rate changes little over the first few tries and is lowest for a sixth attempt or later, ${h.pc(h.E.attemptRate(6))}. Retakes are a large share of the work: ${h.pc(1 - T['1'][0] / all[0], 0)} of the ${h.num(all[0])} tests counted by attempt were not first attempts. The calculator above turns these rates into a cumulative chance: at a centre of your choice, how likely you are to have passed after one, two or more attempts. It is an estimate, which assumes each attempt is independent of the last and that the centre lifts or lowers every attempt alike.`;
  },
  faqs: (h) => {
    const M = h.E.NATIONAL.attempts.rows.m as Record<string, Pair>;
    const F = h.E.NATIONAL.attempts.rows.f as Record<string, Pair>;
    return [
      { q: 'What is the pass rate for a second driving test?', a: `${h.pc(h.E.attemptRate(2))} in Great Britain in ${h.yearLabel(h.lastYear)}, ${h.E.attemptRate(2) > h.E.attemptRate(1) ? 'slightly above' : 'slightly below'} the ${h.pc(h.E.attemptRate(1))} of first attempts. A second attempt benefits from the debrief of the first, but the candidates who fail once include those who were least ready. Women passed ${h.pc(F['2'][1] / F['2'][0])} of second attempts, men ${h.pc(M['2'][1] / M['2'][0])}.` },
      { q: 'How many attempts does it take to pass the driving test on average?', a: `If every attempt had the national first-attempt chance of ${h.pc(h.E.attemptRate(1))}, the average would be about ${h.num(Math.round(10 / h.E.attemptRate(1)) / 10)} attempts. Since later attempts pass a little less often, the true average is slightly higher. DVSA does not publish an average number of attempts per learner, only the pass rate of each attempt number.` },
      { q: 'Is there a limit to how many times you can take the driving test?', a: `No. You can book again as soon as you are ready after a fail, paying the fee each time, £${h.P.fees.practicalWeekday} on a weekday and £${h.P.fees.practicalEvening} in the evening or at a weekend. Your theory test pass stays valid for ${h.P.rules.theoryValidYears} years. The change limit of 2026 applies to moving one booking, not to the number of tests.` },
    ];
  },
  body: (h) => {
    const R = h.E.NATIONAL.attempts.rows as Record<'m' | 'f' | 't', Record<string, Pair>>;
    const keys = Object.keys(R.t);
    const rows = keys.map((k) => [k === '6 or more' ? '6th or later' : h.ord(Number(k)), R.t[k][0], h.pc(R.t[k][1] / R.t[k][0]), h.pc(R.f[k][1] / R.f[k][0]), h.pc(R.m[k][1] / R.m[k][0])]);
    const g = h.C('goodmayes-london');
    const p = g.rate ?? h.gb.rate;
    const low = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate', true)[0];
    const cum = [1, 2, 3, 4, 5, 6].map((n) => [String(n), h.pc(h.E.withinAttempts(p, n), 0), h.pc(h.E.withinAttempts(h.gb.rate, n), 0)]);
    return `
<h2>Pass rate at each attempt, ${h.yearLabel(h.lastYear)}</h2>
<p>DVSA counts how many practical tests each candidate had taken before, for the car tests of the year. The rate barely moves over the first three attempts, from ${h.pc(h.E.attemptRate(1))} to ${h.pc(h.E.attemptRate(3))}, and drops most after the fifth. Women and men follow the same curve a few points apart.</p>
${h.table(['Attempt', 'Tests', 'All', 'Women', 'Men'], rows, `Car practical tests, Great Britain, ${h.yearLabel(h.lastYear)}, by attempt number. DVSA table DRT121D.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Your chance of having passed after a few tries</h2>
<p>A single pass rate hides how quickly most candidates get there. At ${h.cl('goodmayes-london', 'Goodmayes')}, the ${h.ord(h.E.sorted(h.E.CENTRES, 'tests').findIndex((c) => c.id === 'goodmayes-london') + 1)} busiest centre in Britain by tests, ${h.pc(p)} of tests passed in ${h.yearLabel(h.lastYear)}. Using that rate and the national profile by attempt, the table gives the estimated chance of having passed by the end of each attempt, beside the same estimate at the national rate.</p>
${h.table(['Attempts', `Goodmayes`, 'Great Britain'], cum, 'Estimated chance of having passed within n attempts (attempts treated as independent).', ['l', 'r', 'r'])}
<p>The estimate treats each attempt as a fresh draw, which is generous to the candidate who keeps failing for the same reason and harsh on the one who fixes the fault the examiner noted. Read it as an order of magnitude: even at ${low.n}, the busy centre with the lowest rate, the estimate of having passed within four attempts is ${h.pc(h.E.withinAttempts((h.E.rate(low) as number) / 100, 4), 0)}.</p>
<h2>The cost of each retake</h2>
<p>Each new attempt costs the fee again (${h.src('gov_cost', 'GOV.UK fees')}), usually some extra lessons, and weeks of waiting: the national median wait was ${h.wk(h.gb.wait?.[3])} in ${h.month(h.lastMonth)}. Two failed attempts at weekday rates add £${h.P.fees.practicalWeekday * 2} in fees alone. A long run of retakes has a further cost: the theory certificate lasts ${h.P.rules.theoryValidYears} years (${h.src('gov_theory_result', 'GOV.UK')}), and a candidate who has not passed the practical test by then must sit the theory test again. The ${h.a('cost-of-learning-to-drive', 'licence cost calculator')} multiplies the fee by the expected number of attempts at your centre.</p>
<h2>Making the next attempt count</h2>
<p>The examiner's debrief and the marking sheet list every fault. The national top ten, on the ${h.a('driving-test-faults', 'faults page')}, are dominated by observation at junctions and mirrors, which practice can fix. Since 31 March 2026 a booking can only be changed twice, so book the retake when the fault is fixed rather than at the first free slot. The ${h.a('driving-test-booking-rules-2026', '2026 booking rules page')} explains the changes and the ten working days needed for a refund. All attempt figures come from the ${h.src('dvsa_data', 'DVSA driving test data')}; centre rates from its ${h.src('dvsa_pass_centre', 'centre tables')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Pair = [number, number];
export default definePage({
  id: 'pass-rate-by-age-and-sex',
  group: 'rates',
  order: 150,
  tool: { kind: 'mini:odds', props: { centre: 'mitcham-london', age: 17, sex: 0 } },
  related: ['first-time-pass-rates', 'pass-rate-by-attempt', 'easiest-driving-test-centres', 'driving-test-pass-rates-by-year', 'cost-of-learning-to-drive'],
  sources: ['dvsa_data', 'dvsa_pass_centre'],
  slug: 'driving-test-pass-rate-by-age-and-sex',
  nav: 'By age and sex',
  card: 'National pass rates for each age, women and men, and an estimate for any centre.',
  title: `Driving Test Pass Rate by Age and Sex, ${YL}, GB`,
  description: `Driving test pass rate by age and sex in Great Britain for ${YL}, from 16 to 60 and over, with an estimate of your own chance at any car test centre.`,
  h1: 'Driving test pass rate by age and sex',
  intro: 'Choose a centre, your age and your sex: the calculator adjusts the centre\'s rate by the national profile of your age group.',
  resume: (h) => {
    const R = h.E.NATIONAL.ageSex.rows as Record<string, Partial<Record<'m' | 'f' | 't', Pair>>>;
    const r = (k: string, s: 'm' | 'f' | 't') => { const x = R[k]?.[s]; return x ? x[1] / x[0] : null; };
    const peakAge = ['17', '18', '19', '20', '21', '22', '23', '24', '25'].reduce((a, k) => ((r(k, 't') ?? 0) > (r(a, 't') ?? 0) ? k : a));
    return `Age is the strongest pattern in the DVSA tables. In ${h.yearLabel(h.lastYear)}, candidates aged ${peakAge} passed ${h.pc(r(peakAge, 't'))} of their car practical tests in Great Britain, against ${h.pc(r('25', 't'))} at 25, ${h.pc(r('30', 't'))} at 30 and ${h.pc(r('40', 't'))} at 40. Women aged 17 passed ${h.pc(r('17', 'f'))}, men of the same age ${h.pc(r('17', 'm'))}; across all ages men passed ${h.pc(h.gb.m)} and women ${h.pc(h.gb.f)}. DVSA does not publish age and sex together for each centre, so the calculator above makes an estimate: it takes the centre's own rate and moves it up or down by the distance between your age and sex group and the national average. The result is labelled as an estimate, and lessons, practice and readiness weigh more than any of these figures, at any centre and at any age.`;
  },
  faqs: (h) => {
    const R = h.E.NATIONAL.ageSex.rows as Record<string, Partial<Record<'m' | 'f' | 't', Pair>>>;
    const r = (k: string, s: 'm' | 'f' | 't') => { const x = R[k]?.[s]; return x ? x[1] / x[0] : null; };
    return [
      { q: 'What age is best to pass the driving test?', a: `On the ${h.yearLabel(h.lastYear)} figures, 17: candidates of that age passed ${h.pc(r('17', 't'))} of their tests, the highest rate of any age. The rate falls with almost every year of age after that, through the twenties and thirties. Part of that is who takes the test at each age; older candidates are more often on a retake, and the tables do not separate the two effects.` },
      { q: 'Do older learners fail the driving test more?', a: `They pass less often. At 40 the national rate was ${h.pc(r('40', 't'))} in ${h.yearLabel(h.lastYear)} and at 50 ${h.pc(r('50', 't'))}, against ${h.pc(h.gb.rate)} for all ages. Still, ${h.pc(r('40', 't'), 0)} of candidates aged 40 passed. DVSA does not publish the reasons, and its tables do not separate age from the number of earlier attempts.` },
      { q: 'How is my chance at a particular centre estimated?', a: 'The calculator multiplies the centre\'s latest pass rate by the ratio between the national rate of your age and sex and the national rate of all candidates. If 17-year-old women pass a quarter more often than the average nationally, the estimate at your centre is a quarter above its rate. It assumes the centre affects every group alike.' },
    ];
  },
  body: (h) => {
    const R = h.E.NATIONAL.ageSex.rows as Record<string, Partial<Record<'m' | 'f' | 't', Pair>>>;
    const r = (k: string, s: 'm' | 'f' | 't') => { const x = R[k]?.[s]; return x ? x[1] / x[0] : null; };
    const ages = ['17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '28', '30', '35', '40', '45', '50', '55', '60 and over'];
    const rows = ages.filter((k) => R[k]?.t).map((k) => [k, R[k].t![0], h.pc(r(k, 't')), h.pc(r(k, 'f')), h.pc(r(k, 'm'))]);
    const gapOf = (k: string) => Math.abs((r(k, 'm') ?? 0) - (r(k, 'f') ?? 0));
    const minGap = ages.filter((k) => R[k]?.t).reduce((a, k) => (gapOf(k) < gapOf(a) ? k : a));
    const maxGap = ages.filter((k) => R[k]?.t).reduce((a, k) => (gapOf(k) > gapOf(a) ? k : a));
    const menAhead = ages.filter((k) => (r(k, 'm') ?? 0) > (r(k, 'f') ?? 0)).length;
    const ex = h.C('mitcham-london');
    const est = h.E.odds(ex.rate ?? h.gb.rate, 17, 'f');
    const est40 = h.E.odds(ex.rate ?? h.gb.rate, 40, 'm');
    return `
<h2>Pass rate at each age, women and men</h2>
<p>The table gives a selection of ages from DVSA table DRT121C, the national tests and passes of ${h.yearLabel(h.lastYear)} by age on the day of the test and by sex as recorded on the driving licence. Men passed more often than women at ${menAhead} of the ${rows.length} ages shown. Among the ages shown, the gap is smallest at ${minGap} (${h.pts(Math.round(((r(minGap, 'm') ?? 0) - (r(minGap, 'f') ?? 0)) * 1000) / 10)}) and largest at ${maxGap} (${h.pts(Math.round(((r(maxGap, 'm') ?? 0) - (r(maxGap, 'f') ?? 0)) * 1000) / 10)}), in favour of men when positive.</p>
${h.table(['Age', 'Tests', 'All', 'Women', 'Men'], rows, `Car practical tests, Great Britain, ${h.yearLabel(h.lastYear)}. DVSA table DRT121C.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>How the estimate works, on one example</h2>
<p>Take ${h.cl('mitcham-london', 'Mitcham')}, where ${h.pc(ex.rate)} of tests passed in ${h.yearLabel(h.lastYear)}. Nationally, women aged 17 passed ${h.pc(r('17', 'f'))}, against ${h.pc(h.gb.rate)} for all candidates, a ratio of ${h.num(Math.round(est.factor * 100))} %. The estimate for a 17-year-old woman at Mitcham is therefore ${h.pc(ex.rate)} × ${h.num(Math.round(est.factor * 100))} % = ${h.pc(est.p)}. For a man of 40 the ratio is ${h.num(Math.round(est40.factor * 100))} % and the estimate ${h.pc(est40.p)}.</p>
<p>The method assumes that a centre's roads and examiners lift or lower every group by the same proportion. That is a simplification: a centre with many older candidates may already have a low rate because of its candidates, and the estimate then counts the age effect twice. Each centre's page shows its own rates by age from 17 to 25, from DVSA table DRT122D, which are real figures rather than estimates; use them when your age is in that range.</p>
<h2>Why age matters so much</h2>
<p>DVSA's tables show the pattern but not its causes, and this site does not guess them for you. Two things in the tables point the same way. First, the decline is steady: from ${h.pc(r('17', 't'))} at 17, the national rate in ${h.yearLabel(h.lastYear)} falls below the all-ages average in the mid-twenties and keeps falling until the mid-forties, where it was ${h.pc(r('45', 't'))}. Second, retakes pass less often than first attempts, and the share of retakes can only grow with age, since a candidate who fails at 19 tests again at 20. The national ${h.a('pass-rate-by-attempt', 'rate by attempt')} shows how much a retake weighs: ${h.pc(h.E.attemptRate(1))} at a first attempt, ${h.pc(h.E.attemptRate(6))} at a sixth or later.</p>
<h2>What to do with your estimate</h2>
<p>Use it to set expectations, not to choose a centre. A difference of a few points between two centres matters far less than arriving ready: the ${h.a('first-time-pass-rates', 'first-time pass rates')} and the ${h.a('cost-of-learning-to-drive', 'licence cost calculator')} show what each retake costs in fees and weeks of waiting. The national tables are those of the ${h.src('dvsa_data', 'DVSA driving test data for cars')}; centre rates come from its ${h.src('dvsa_pass_centre', 'centre table DRT122A')}.</p>
`;
  },
});

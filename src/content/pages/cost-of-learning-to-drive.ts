import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cost-of-learning-to-drive',
  group: 'costs',
  order: 400,
  tool: { kind: 'mini:cost', props: { centre: 'birmingham-kings-heath', hours: 30, price: 38 } },
  related: ['driving-lesson-prices', 'theory-test-pass-rates', 'easiest-driving-test-centres', 'pass-rate-by-attempt', 'driving-test-booking-rules-2026'],
  sources: ['gov_test_car', 'gov_cost', 'gov_provisional', 'gov_adi_survey', 'dvsa_pass_centre', 'dvsa_theory_centre'],
  slug: 'cost-of-learning-to-drive',
  nav: 'Cost of a licence',
  card: 'Fees, lessons and the retests a pass rate implies, added up for your centre.',
  title: 'Cost of Learning to Drive in the UK: Fees, Lessons, Retests',
  description: 'Cost of learning to drive in Britain: the GOV.UK fees, lesson prices from the DVSA instructor survey and the retests your test centre\'s pass rate implies.',
  h1: 'What learning to drive costs, centre by centre',
  intro: 'Set your centre, the hours of lessons you expect and the price of an hour: the calculator adds the fees and the retests the pass rates imply.',
  resume: (h) => {
    const P = h.P.fees;
    const c = h.C('birmingham-kings-heath');
    const x = h.E.licenceCost({ hours: 30, price: 38, passRate: c.rate ?? h.gb.rate, theoryRate: h.gb.theory, evening: false, licence: 'online' });
    return `The fixed costs of a car licence in Britain are set by the government: £${P.provisionalOnline} for a provisional licence online, £${P.theory} for each theory test and £${P.practicalWeekday} for each practical test on a weekday, £${P.practicalEvening} in the evening or at a weekend. The rest depends on lessons and on how many attempts it takes. In DVSA's survey of instructors, half charged £36 to £40 for an hour's lesson. With ${h.pc(h.gb.theory)} of theory tests and ${h.pc(c.rate)} of practical tests passed at ${c.name} in ${h.yearLabel(h.lastYear)}, a learner there taking 30 hours at £38 can expect about ${h.m(x.total)}: ${h.m(x.lessons)} of lessons and ${h.m(x.theory + x.practical + x.licence)} of fees. This is an estimate: the number of hours is yours to set, and the attempts are averages. Change any input above.`;
  },
  faqs: (h) => {
    const F = h.P.fees;
    return [
      { q: 'How much does a driving test cost in 2026?', a: `£${F.practicalWeekday} for a car practical test on a weekday and £${F.practicalEvening} in the evening, at a weekend or on a bank holiday, according to GOV.UK. The theory test costs £${F.theory}. An extended test, for drivers disqualified by a court, costs £${F.extendedWeekday} or £${F.extendedEvening}. Fees are paid again for each retest, and NI fees are set separately by the DVA.` },
      { q: 'How many driving lessons do I need?', a: 'DVSA does not publish an official average number of hours, and this site does not invent one. The number depends on age, practice with family, how often lessons happen and the roads around the centre. The calculator lets you set your own figure; your instructor can give an estimate after a first lesson or two.' },
      { q: 'How much does a provisional driving licence cost?', a: `£${F.provisionalOnline} when you apply online and £${F.provisionalPost} by post, according to GOV.UK. You can apply from the age of 15 years and 9 months if you can read a number plate from 20 metres and have permission to live in Britain for 185 days. An online application usually arrives within a week.` },
    ];
  },
  body: (h) => {
    const F = h.P.fees;
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && h.E.rate(c) != null);
    const hi = h.E.sorted(big, 'rate')[0], lo = h.E.sorted(big, 'rate', true)[0];
    const cost = (rate: number, hours: number, price: number) => h.E.licenceCost({ hours, price, passRate: rate, theoryRate: h.gb.theory, evening: false, licence: 'online' });
    const xh = cost((h.E.rate(hi) as number) / 100, 30, 38), xl = cost((h.E.rate(lo) as number) / 100, 30, 38);
    const grid = [20, 30, 40, 50].map((hours) => [`${hours} hours`, ...[33, 38, 43].map((p) => h.m(cost(h.gb.rate, hours, p).total))]);
    return `
<h2>The official fees</h2>
${h.table(['Item', 'Fee'], [
      ['Provisional licence, online', h.m(F.provisionalOnline)],
      ['Provisional licence, by post', h.m(F.provisionalPost)],
      ['Theory test', h.m(F.theory)],
      ['Practical test, weekday', h.m(F.practicalWeekday)],
      ['Practical test, evening, weekend or bank holiday', h.m(F.practicalEvening)],
    ], 'Car licence fees in England, Scotland and Wales, GOV.UK.', ['l', 'r'])}
<p>Fees come from GOV.UK (${h.src('gov_cost', 'driving test cost')}, ${h.src('gov_provisional', 'provisional licence')}). Northern Ireland's fees are set by the DVA and are not covered here.</p>
<h2>How the calculator counts attempts</h2>
<p>On average, a test passed with probability <em>p</em> takes 1 / <em>p</em> attempts. With ${h.pc(h.gb.theory)} of theory tests passed in Great Britain in ${h.yearLabel(h.lastYear)}, that is ${h.num(h.E.expectedAttempts(h.gb.theory), 1)} theory tests on average, or ${h.m(F.theory * h.E.expectedAttempts(h.gb.theory))}. At the national practical rate of ${h.pc(h.gb.rate)}, it is ${h.num(h.E.expectedAttempts(h.gb.rate), 1)} practical tests, or ${h.m(F.practicalWeekday * h.E.expectedAttempts(h.gb.rate))} on weekdays. This is a method, not a forecast for any one learner: some pass first time, others need four attempts, and the extra lessons booked before a retest are not counted.</p>
<h2>Same hours, different centres</h2>
<p>With 30 hours at £38, the pass rate of the centre changes the expected bill. Among centres with at least 1,000 tests, ${h.cl(hi.id)} had the highest rate, ${h.pp(h.E.rate(hi))}, for an expected total of ${h.m(xh.total)}; ${h.cl(lo.id)} had the lowest, ${h.pp(h.E.rate(lo))}, for ${h.m(xl.total)}. The difference, ${h.m(xl.total - xh.total)}, is the cost of the extra practical tests alone; in practice each retest also brings more lessons.</p>
<h2>Hours and price matter more than the fees</h2>
<p>The grid uses the national pass rates and three lesson prices around the most common band of DVSA's instructor survey. Lessons are by far the largest part of the cost: ten more hours at £38 add ${h.m(10 * 38)}, more than six weekday tests.</p>
${h.table(['Hours of lessons', '£33 an hour', '£38 an hour', '£43 an hour'], grid, `Estimate: lessons + provisional licence online + expected theory and weekday practical fees at Great Britain pass rates, ${h.yearLabel(h.lastYear)}.`, ['l', 'r', 'r', 'r'])}
<h2>What the estimate leaves out</h2>
<p>Four costs are real but too personal to average. Lessons booked between a fail and the retest, which the examiner's feedback usually calls for. A test moved or cancelled with less than ${h.P.rules.refundWorkingDays} full working days' notice, which means paying the fee again, and a weekday slot swapped for an evening or weekend one, which costs the £${F.practicalEvening - F.practicalWeekday} difference. Private practice with a family member, which needs a suitable car and cover for the learner. And the car on the day: most learners use their instructor's car, but you can bring your own if it meets DVSA's rules, such as L plates front and rear, an extra rear-view mirror for the examiner, tax, insurance for the test and an MOT if it is over 3 years old (${h.src('gov_test_car', 'using your own car')}). None of these appear in the total above, which is why it is a floor rather than a quote.</p>
<p>Lesson prices by region are on the ${h.a('driving-lesson-prices', 'lesson prices page')}; theory pass rates by centre on the ${h.a('theory-test-pass-rates', 'theory test page')}. Practical rates come from the ${h.src('dvsa_pass_centre', 'DVSA pass rate by centre')} table and theory rates from ${h.src('dvsa_theory_centre', 'DVSA table DRT112A')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

export default definePage({
  id: 'driving-test-faults',
  group: 'rates',
  order: 180,
  tool: { kind: 'mini:within', props: { centre: 'wood-green-london', n: 2 } },
  related: ['pass-rate-by-attempt', 'first-time-pass-rates', 'hardest-driving-test-centres', 'driving-test-booking-rules-2026', 'cost-of-learning-to-drive'],
  sources: ['dvsa_data', 'gov_faults', 'gov_test_what'],
  slug: 'driving-test-faults',
  nav: 'Most common faults',
  card: 'The ten serious faults that fail most car tests, and how a test is marked.',
  title: `Driving Test Faults: The 10 Most Common Fails, ${YL}`,
  description: `Driving test faults that failed the most car tests in Great Britain in ${YL}, from DVSA, with the pass mark, the three kinds of fault and your odds next time.`,
  h1: 'The most common driving test faults',
  intro: 'After a fail, the next question is how likely the next attempt is to work: choose a centre and a number of attempts.',
  resume: (h) => {
    const f = h.E.NATIONAL.faults as { period: string; list: string[] };
    const nice = (s: string) => s.replace(' - ', ': ').replace('progess', 'progress');
    return `The most common reason for failing the car driving test in Great Britain, in DVSA's table for ${f.period}, was "${nice(f.list[0])}": not looking properly before emerging at a junction. It was followed by "${nice(f.list[1])}", "${nice(f.list[2])}" and "${nice(f.list[3])}". The list counts serious and dangerous faults, the ones that fail a test on their own: a candidate passes with no more than ${h.P.rules.maxDrivingFaults} minor driving faults and no serious or dangerous fault. In ${h.yearLabel(h.lastYear)}, ${h.pc(1 - h.gb.rate)} of tests ended in a fail. After a fail, the retest must be at least ${h.P.rules.retestWorkingDays} working days away. The calculator above estimates your chance of having passed after one more attempt or several, at the centre of your choice.`;
  },
  faqs: (h) => {
    const f = h.E.NATIONAL.faults as { period: string; list: string[] };
    return [
      { q: 'What is the most common reason for failing the driving test?', a: `Observation at junctions: emerging without looking effectively in both directions. It ${f.list[0] === 'Junctions - observation' ? 'headed' : 'was high in'} DVSA's list of serious faults for ${f.period}. Mirrors when changing direction and turning right at junctions come next. All three are about seeing other road users in time, not about handling the car.` },
      { q: 'How many minors can you get on a driving test?', a: `Up to ${h.P.rules.maxDrivingFaults} driving faults, often called minors, as long as there is no serious or dangerous fault, according to GOV.UK. Repeating the same minor fault can turn it into a serious fault at the examiner's judgement, so ${h.P.rules.maxDrivingFaults} small mistakes of one kind are riskier than ${h.P.rules.maxDrivingFaults} different ones.` },
      { q: 'How soon can I retake the driving test after failing?', a: `GOV.UK requires the new test to be at least ${h.P.rules.retestWorkingDays} working days away, and you pay the fee again, £${h.P.fees.practicalWeekday} on a weekday or £${h.P.fees.practicalEvening} in the evening or at a weekend. In practice the wait is usually longer: the national median was ${h.wk(h.gb.wait?.[3])} in ${h.month(h.lastMonth)}.` },
    ];
  },
  body: (h) => {
    const f = h.E.NATIONAL.faults as { period: string; list: string[] };
    const nice = (s: string) => s.replace(' - ', ': ').replace('progess', 'progress');
    const what: Record<string, string> = {
      'Junctions - observation': 'looking effectively before emerging, in both directions, at every kind of junction and roundabout',
      'Mirrors - change direction': 'checking the mirrors before turning, changing lanes or pulling out',
      'Junctions - turning right': 'position and timing when turning right across traffic',
      'Response to signs - traffic lights': 'stopping at red and moving off at green only when it is safe',
      'Control - steering': 'steering a steady course, without cutting corners or mounting the kerb',
      'Move off - safely': 'checking all round, blind spot included, before pulling away',
      'Response to signs - road markings': 'following lane arrows, stop lines and hatched areas',
      'Response to signs - traffic signs': 'obeying speed limits, no-entry signs and other regulatory signs',
      'Positioning - normal driving': 'keeping to the correct position in the lane and away from parked cars',
      'Maintain progess - speed': 'driving at a speed that suits the road and the limit, not too slowly',
    };
    const obs = f.list.filter((x) => /^(Junctions|Mirrors|Response to signs|Move off)/.test(x)).length;
    const ctrl = f.list.filter((x) => /^Control/.test(x)).length;
    const rows = f.list.map((x, i) => [String(i + 1), nice(x), what[x] ?? '']);
    return `
<h2>The ten serious faults that fail most tests</h2>
<p>DVSA ranks the faults recorded as serious or dangerous on failed car tests. The table keeps its wording; the right-hand column says in plain words what each heading covers on the marking sheet. DVSA publishes the ranking without the counts behind it for this period.</p>
${h.table(['Rank', 'Fault (DVSA heading)', 'What it covers'], rows, `Most common serious faults on car practical tests, Great Britain, ${f.period}. DVSA table DRT121F.`, ['r', 'l', 'l'])}
<h2>Three kinds of fault, one rule</h2>
<p>GOV.UK sets out three kinds of fault (${h.src('gov_faults', 'faults and your result')}). A driving fault is not potentially dangerous, but repeated it can become a serious fault. A serious fault is potentially dangerous. A dangerous fault involves actual danger to you, the examiner, the public or property. The pass mark is no more than ${h.P.rules.maxDrivingFaults} driving faults and none of the other two kinds. The examiner only stops a test early if your driving is a danger to other road users; otherwise you carry on to the end even after a serious fault, which is why a candidate can feel the test went well and still fail.</p>
<h2>What the test asks for</h2>
<p>The test lasts around ${h.P.rules.testMinutes} minutes of driving (${h.src('gov_test_what', 'what happens during the test')}). It starts with an eyesight check, reading a number plate from ${h.P.rules.eyesightMetres} metres, and a "tell me" vehicle safety question; a "show me" question comes while driving. Then come general driving in various road and traffic conditions, but not on motorways, ${h.P.rules.independentMinutes} minutes of independent driving following a sat nav or traffic signs, and one reversing exercise. Taking a wrong turning is not a fault. DVSA does not publish test routes, so no site can give the real routes of a centre.</p>
<h2>Why the top faults are about looking</h2>
<p>${obs} of the ten headings concern junctions, mirrors, moving off or the response to signs and markings; ${ctrl} concern${ctrl === 1 ? 's' : ''} control of the car. That pattern may explain part of the gap between centres: a centre whose routes pass through many busy junctions, multi-lane roundabouts and complex signals gives more occasions for the first four faults on the list. It does not make the test harder in principle, but it makes local practice on those junctions worth more than general hours behind the wheel.</p>
<h2>After a fail</h2>
<p>The examiner goes through every fault at the end. The next test must be at least ${h.P.rules.retestWorkingDays} working days later, and since 31 March 2026 a booking can be changed only twice, so choosing a realistic date matters. The ${h.a('pass-rate-by-attempt', 'rate by attempt')} shows that second attempts passed ${h.pc(h.E.attemptRate(2))} of the time nationally in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.E.attemptRate(1))} for first attempts; the ${h.a('driving-test-booking-rules-2026', '2026 booking rules')} explain the refund and change limits. The ranking comes from the ${h.src('dvsa_data', 'DVSA driving test data for cars')}.</p>
`;
  },
});

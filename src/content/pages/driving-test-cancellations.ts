import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

type Cancel = { leave: number; disputes: number; weather: number; medical: number; total: number };
export default definePage({
  id: 'driving-test-cancellations',
  group: 'waits',
  order: 210,
  tool: { kind: 'mini:wait', props: { centre: 'chingford-london' } },
  related: ['driving-test-waiting-times', 'driving-test-booking-rules-2026', 'move-driving-test-centre', 'compare-driving-test-centres', 'cost-of-learning-to-drive'],
  sources: ['dvsa_data', 'gov_release', 'gov_rules_2026', 'gov_test_weather', 'gov_swap'],
  slug: 'driving-test-cancellations',
  nav: 'Cancellations',
  card: 'Earlier test dates the official way, and the tests DVSA itself cancels, centre by centre.',
  title: `Driving Test Cancellations: Earlier Dates and ${YL} Data`,
  description: `Driving test cancellations: how earlier dates appear on GOV.UK under the 2026 rules, why finder apps are banned, and the tests DVSA cancelled in ${YL}.`,
  h1: 'Driving test cancellations: earlier dates and DVSA cancellations',
  intro: 'Pick a centre to see its median wait and the waits of the three centres a test booked there can move to.',
  resume: (h) => {
    const C = h.E.NATIONAL.cancel as Record<string, Cancel>;
    const c = C[h.lastYear];
    return `A driving test cancellation is a slot given back to the booking service when another learner cancels, moves or swaps, or when DVSA rebooks a test it had to call off. There is no waiting list at most centres: since ${h.date(h.P.rules.noFinderAppsFrom)}, the only way to find one is for the learner to check the official GOV.UK service to change a test, because cancellation-finder apps and websites that scan it are no longer allowed. Each move to an earlier date uses one of the ${h.P.rules.changesAllowed} changes a booking has. DVSA itself cancelled ${h.num(c.total)} car tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.medical)} of them because the examiner was ill and ${h.num(c.weather)} for bad weather. The calculator above shows a centre's median wait beside the waits of the three centres a test booked there can be moved to.`;
  },
  faqs: (h) => [
    { q: 'How do I find a driving test cancellation?', a: `Sign in to the GOV.UK service to change your driving test and look for earlier dates at your centre or at the three centres you are allowed to move to. Slots given back by other learners appear at any time, not at ${h.P.rules.releaseTime} on ${h.P.rules.releaseDay}. Since ${h.date(h.P.rules.noFinderAppsFrom)}, paid finder services that scan the booking service are against the rules.` },
    { q: 'Are driving test cancellation apps legal?', a: `Using them is no longer allowed. DVSA's 2026 rules forbid unofficial services that scan the booking service, including cancellation-finder websites and apps, from ${h.date(h.P.rules.noFinderAppsFrom)}. DVSA monitors the service and can suspend a learner's online access, leaving phone booking only, or cancel the booking. This site does not offer or link to any such service.` },
    { q: 'What happens if DVSA cancels my driving test?', a: 'For bad weather, DVSA books the next available date automatically and sends it within 3 working days, up to 7 in a long spell of bad weather; you can change it if it does not suit, and expenses cannot be claimed. For other reasons, such as an ill examiner, you get a new date and can apply for out-of-pocket expenses if the notice was short.' },
    { q: 'Do I get my money back if I cancel my driving test?', a: `In full, if you cancel at least ${h.P.rules.refundWorkingDays} full working days before the test, according to the 2026 rules. With less notice the fee is lost. If you have already used your ${h.P.rules.changesAllowed} changes, cancelling and booking again is the only way to change the date, and the new booking starts with ${h.P.rules.changesAllowed} changes.` },
  ],
  body: (h) => {
    const C = h.E.NATIONAL.cancel as Record<string, Cancel>;
    const ys = Object.keys(C).sort();
    const P = h.E.NATIONAL.practical as Record<string, Record<'t', [number, number]>>;
    const rows = [...ys].reverse().slice(0, 8).map((y) => [h.yearLabel(y), C[y].total, C[y].medical, C[y].weather, C[y].leave, P[y] ? h.pc(C[y].total / (P[y].t[0] + C[y].total)) : 'n/a']);
    const share = h.F.FULL_CENTRES.filter((c) => c.cancel && c.pass[h.lastYear] && c.pass[h.lastYear][0] >= 1000).map((c) => ({ c, s: c.cancel!.total / (c.pass[h.lastYear][0] + c.cancel!.total) })).sort((a, b) => b.s - a.s);
    const top = share.slice(0, 10).map(({ c, s }) => [h.cl(c.id, c.name), c.region, c.cancel!.total, h.pc(s), h.pc(c.cancel!.weather / Math.max(1, c.cancel!.total), 0)]);
    const c = C[h.lastYear];
    const dispY = ys.reduce((a, y) => (C[y].disputes > C[a].disputes ? y : a));
    return `
<h2>Tests cancelled by DVSA</h2>
<p>Table DRT122B counts the car tests DVSA cancelled itself, by reason: examiner illness ("medical"), bad weather, examiner leave and industrial disputes. The share in the last column sets those cancellations against the tests that went ahead. In ${h.yearLabel(h.lastYear)} illness accounted for ${h.pc(c.medical / c.total, 0)} of DVSA's cancellations and weather for ${h.pc(c.weather / c.total, 0)}.</p>
${h.table(['Year', 'Cancelled by DVSA', 'Examiner illness', 'Weather', 'Examiner leave', 'Share of tests'], rows, 'Car practical tests cancelled by DVSA, Great Britain. DVSA table DRT122B.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Industrial action is counted in the total too: in ${h.yearLabel(dispY)}, ${h.num(C[dispY].disputes)} tests were lost to disputes. Each cancelled test is rebooked, so the slot it takes later is one fewer for other learners.</p>
<h2>Centres with the most DVSA cancellations</h2>
<p>Among centres with at least 1,000 tests, these had the highest share of tests cancelled by DVSA in ${h.yearLabel(h.lastYear)}. The last column shows how much of it was weather; the rest is mostly examiner illness and leave.</p>
${h.table(['Centre', 'Region', 'Cancelled', 'Share of tests', 'Of which weather'], top, `DVSA cancellations, ${h.yearLabel(h.lastYear)}. DVSA table DRT122B.`, ['l', 'l', 'r', 'r', 'r'])}
<h2>If DVSA cancels your test</h2>
<p>GOV.UK sets out what happens (${h.src('gov_test_weather', 'test cancelled')}). For bad weather, such as ice, flooding, thick fog or high winds, DVSA books the next available date for you and sends it within 3 working days; you may change it, and you cannot claim expenses. If the test is cancelled for another reason, such as an ill examiner, you receive a new date and can apply for out-of-pocket expenses when DVSA cancels at short notice. A change made by DVSA does not use one of your changes; the 2026 rules reset your count to ${h.P.rules.changesAllowed} (${h.src('gov_rules_2026', '2026 booking rules')}).</p>
<h2>Finding an earlier slot</h2>
<p>DVSA releases a new week of dates at ${h.P.rules.releaseTime} every ${h.P.rules.releaseDay}, ${h.P.rules.releaseWeeksAhead} weeks ahead; earlier slots come back at random times through the week (${h.src('gov_release', 'release dates')}). DVSA asks learners not to search the service repeatedly over a short period or from several devices at once, and may block searches for a while if they do. Swapping with another learner who has a test booked is possible by phone, at least 10 full working days before the earlier of the two tests, and counts as one change for each of you (${h.src('gov_swap', 'swapping a test')}). Moving to one of the three nearest centres can bring a date forward when its queue is shorter: the ${h.a('move-driving-test-centre', 'moving a test page')} lists them, and the ${h.a('driving-test-waiting-times', 'waiting times page')} ranks the centres near any postcode.</p>
`;
  },
});

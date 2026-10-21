import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'driving-test-booking-rules-2026',
  group: 'booking',
  order: 310,
  tool: { kind: 'mini:refund' },
  related: ['move-driving-test-centre', 'driving-test-cancellations', 'driving-test-waiting-times', 'cost-of-learning-to-drive', 'compare-driving-test-centres'],
  sources: ['gov_rules_2026', 'gov_change', 'gov_swap', 'gov_book', 'gov_release', 'gov_cost'],
  slug: 'driving-test-booking-rules-2026',
  nav: '2026 booking rules',
  card: 'Two changes, learner-only bookings, the three-centre rule and the 10-day refund.',
  title: 'Driving Test Booking Rules 2026: Changes, Swaps, Refunds',
  description: 'Driving test booking rules 2026 for car tests in Britain: 2 changes per booking, learner-only booking, no finder apps, the 3 nearest centres and full refunds.',
  h1: 'The 2026 driving test booking rules',
  intro: 'Enter how many full working days are left before your test and how many changes you have made: the calculator tells you where you stand.',
  resume: (h) => `In 2026 DVSA changed how car driving tests in England, Scotland and Wales are booked, in three stages. From ${h.date(h.P.rules.changesFrom)}, a booking can be changed ${h.P.rules.changesAllowed} times instead of ${h.P.rules.changesOld}. From ${h.date(h.P.rules.onlyLearnerFrom)}, only the learner may book, change, swap or cancel the test, not a driving instructor, and services that scan the booking system, including cancellation-finder apps, are not allowed. From ${h.date(h.P.rules.nearestThreeFrom)}, a test can only move to the three centres nearest the one booked, or back to the first centre of that booking. What did not change: a change or a cancellation made at least ${h.P.rules.refundWorkingDays} full working days before the test costs nothing, and new dates are still released at ${h.P.rules.releaseTime} every ${h.P.rules.releaseDay}, ${h.P.rules.releaseWeeksAhead} weeks ahead. The rules apply to car tests only.`,
  faqs: (h) => [
    { q: 'What counts as a change to a driving test booking?', a: 'Changing the date or time, changing the test centre, or swapping with another learner. Doing two of these at once, such as a new date at a new centre, is one change. Updating your address, adding or removing your instructor\'s reference number and any change DVSA makes, for example for bad weather, do not count.' },
    { q: 'Can my driving instructor book my test in 2026?', a: `No. Since ${h.date(h.P.rules.onlyLearnerFrom)} it is against the law to book a car test for someone else, and instructors cannot change, swap or cancel a pupil's test either. You can still enter your instructor's reference number when booking, so the service checks they are free. A friend or relative may help, provided you are with them.` },
    { q: 'What happens when I have used my 2 changes?', a: `You cannot change that booking again. The only route is to cancel it and book a new test, which starts with ${h.P.rules.changesAllowed} changes of its own. Cancel at least ${h.P.rules.refundWorkingDays} full working days before the test and the fee comes back in full; with less notice it is lost, unless DVSA grants a short-notice refund for an unavoidable reason.` },
    { q: 'Can I still swap my driving test with someone else?', a: `Yes, by phone only. You both need at least one change left, the request must be made ${h.P.rules.refundWorkingDays} full working days before the earlier test, both tests must be the same type and price, and each centre must be within the other learner's allowed centres. The swap uses one change for each of you.` },
  ],
  body: (h) => {
    const rows = [
      ['Changes per booking', `Up to ${h.P.rules.changesOld}`, `${h.P.rules.changesAllowed}`, h.date(h.P.rules.changesFrom)],
      ['Who can book', 'You or your instructor', 'Only you', h.date(h.P.rules.onlyLearnerFrom)],
      ['Who can change, swap or cancel', 'You or your instructor', 'Only you', h.date(h.P.rules.onlyLearnerFrom)],
      ['Unofficial finder services', 'Allowed', 'Not allowed', h.date(h.P.rules.noFinderAppsFrom)],
      ['Where a test can move', 'Any test centre', 'The 3 nearest centres, or the first one booked', h.date(h.P.rules.nearestThreeFrom)],
    ];
    const fees = [
      ['Practical test, weekday', h.m(h.P.fees.practicalWeekday)],
      ['Practical test, evening, weekend or bank holiday', h.m(h.P.fees.practicalEvening)],
      ['Extended test for disqualified drivers, weekday', h.m(h.P.fees.extendedWeekday)],
      ['Extended test, evening, weekend or bank holiday', h.m(h.P.fees.extendedEvening)],
      ['Theory test', h.m(h.P.fees.theory)],
    ];
    const g = h.gb.wait!;
    return `
<h2>The five rule changes</h2>
${h.table(['Rule', 'Before', 'Now', 'Since'], rows, 'Car driving tests in England, Scotland and Wales. GOV.UK, changes to driving test booking rules in 2026.', ['l', 'l', 'l', 'l'])}
<p>Anyone who had used all six changes under the old rules received ${h.P.rules.changesAllowed} more on ${h.date(h.P.rules.changesFrom)}. For a test already booked on ${h.date(h.P.rules.nearestThreeFrom)}, the three-centre rule starts from the centre the test was at on that date, not from the first centre: GOV.UK's example is a learner who booked St Helens, moved to Watford in May, and can now only move to Borehamwood, Pinner or Mill Hill (${h.src('gov_rules_2026', 'booking rules')}).</p>
<h2>Free changes and refunds: the ${h.P.rules.refundWorkingDays}-day line</h2>
<p>A change of date, time or centre is free if made at least ${h.P.rules.refundWorkingDays} full working days before the test, and a cancellation with the same notice is refunded in full (${h.src('gov_change', 'change your test')}). Working days are Monday to Saturday; Sundays and public holidays do not count, so ${h.P.rules.refundWorkingDays} working days is roughly two calendar weeks. With less notice you pay for a new test. Moving to an evening or weekend slot means paying the difference; moving to a weekday slot refunds it. DVSA can grant a short-notice refund when the change was forced by something unavoidable, such as an exam or an injury. The latest date to change for free is on the booking confirmation email.</p>
${h.table(['Fee', 'Amount'], fees, 'Car test fees, GOV.UK.', ['l', 'r'])}
<h2>Choosing the first booking with care</h2>
<p>Because the first centre and the first date shape every later option, GOV.UK advises booking only at a centre you intend to use and on a date you expect to be ready by. The national median wait was ${h.wk(g[3])} in ${h.month(h.lastMonth)}, so a learner who books as soon as the theory test is passed often books months ahead; with only ${h.P.rules.changesAllowed} changes, a date set too early is costly to move twice. The practical test can only be booked once the theory test has been passed, and the candidate must have lived in Britain for at least 185 days of the last 12 months (${h.src('gov_book', 'book your test')}).</p>
<h2>Swaps, by phone only</h2>
<p>Swapping is an exchange of two existing bookings, not a search for a new date, and counts as one change for each learner (${h.src('gov_swap', 'swapping guidance')}). Both learners need a change left, both tests must be of the same type, for example two weekday tests at ${h.m(h.P.fees.practicalWeekday)}, and each must be at the same centre, one of the three nearest, or the first centre booked. The request goes to DVSA by phone at least ${h.P.rules.refundWorkingDays} full working days before the earlier test. DVSA warns learners not to share their licence number, address or card details with the other driver.</p>
<h2>What DVSA does when it breaks the rules for you</h2>
<p>If DVSA moves a test, for bad weather or an ill examiner, the change does not count and the booking returns to ${h.P.rules.changesAllowed} changes available. If a learner breaks the terms, for example by using a finder app, DVSA can suspend online access, leaving phone booking only, or cancel the booking. The booking service is open from 6am to 11:40pm; new weeks go live at ${h.P.rules.releaseTime} on ${h.P.rules.releaseDay}s (${h.src('gov_release', 'release dates')}). For what the three-centre rule means at your own centre, see ${h.a('move-driving-test-centre', 'moving a test')}; for earlier dates, ${h.a('driving-test-cancellations', 'cancellations')}.</p>
`;
  },
});

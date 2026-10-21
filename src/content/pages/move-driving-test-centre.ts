import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'move-driving-test-centre',
  group: 'booking',
  order: 300,
  tool: { kind: 'mini:move', props: { centre: 'pinner-london' } },
  related: ['driving-test-booking-rules-2026', 'driving-test-waiting-times', 'compare-driving-test-centres', 'driving-test-cancellations', 'easiest-driving-test-centres'],
  sources: ['gov_nearest', 'gov_rules_2026', 'gov_change', 'dvsa_pass_centre', 'dvsa_waits'],
  slug: 'move-driving-test-centre',
  nav: 'Moving a test',
  card: 'The three centres each test can move to since June 2026, with their rates and waits.',
  title: 'Move Driving Test Centre: The 3 Nearest Centres Rule 2026',
  description: 'Move a driving test centre under the 2026 rules: the 3 nearest centres DVSA allows for each centre, their pass rates, waits and how each move uses a change.',
  h1: 'Moving your driving test to another centre',
  intro: 'Choose the centre where your test is booked: the calculator lists the three centres you may move it to, with their pass rate and wait.',
  resume: (h) => {
    const better = h.E.CENTRES.filter((c) => c.w != null && c.nb.some((n) => h.E.hasCentre(n) && h.E.centre(n).w != null && (h.E.centre(n).w as number) < (c.w as number))).length;
    const withW = h.E.CENTRES.filter((c) => c.w != null).length;
    return `Since ${h.date(h.P.rules.nearestThreeFrom)}, a car driving test booked at one centre can only be moved to one of the three centres DVSA lists as nearest to it, or back to the centre first booked on that booking. Before that date a test could move anywhere in Britain. Each move counts as one of the ${h.P.rules.changesAllowed} changes allowed per booking since ${h.date(h.P.rules.changesFrom)}, and only the learner can make it, on GOV.UK. The list matters for waiting times: at ${better} of the ${withW} centres with a published wait in ${h.month(h.lastMonth)}, at least one of the three allowed centres had a shorter median wait. Choose your centre above to see its three options with their latest pass rate and wait, and read on for how a second move works.`;
  },
  faqs: (h) => [
    { q: 'Can I move my driving test to any test centre?', a: `Not since ${h.date(h.P.rules.nearestThreeFrom)}. A booked car test can move only to one of the three centres DVSA names as nearest the one booked, or back to the first centre of that booking. To test somewhere else, you cancel and book again; with at least ${h.P.rules.refundWorkingDays} full working days' notice the fee is refunded.` },
    { q: 'How many times can I change my driving test centre?', a: `A booking can be changed ${h.P.rules.changesAllowed} times in all, whether you change the date, the time, the centre or swap with another learner; changing date and centre together counts once. After a first move, the second can go to the three centres nearest the new centre, or back to where you first booked.` },
    { q: 'Who decides which centres are nearest?', a: 'DVSA publishes the list of the three nearest centres for every car test centre on GOV.UK, with their distance in miles. This site reads that list and adds each centre\'s latest pass rate and median wait. If a centre closes or opens, DVSA updates the list; the site re-reads it every month.' },
  ],
  body: (h) => {
    const p = h.C('pinner-london');
    const pairs = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 3000 && c.w != null), 'wait').slice(0, 12).map((c) => {
      const nb = c.nb.filter(h.E.hasCentre).map(h.E.centre).filter((x) => x.w != null).sort((a, b) => (a.w as number) - (b.w as number))[0];
      return [h.cl(c.id), h.wk(c.w), nb ? h.cl(nb.id) : 'n/a', nb ? h.wk(nb.w) : 'n/a', nb ? h.pp(h.E.rate(nb)) : 'n/a'];
    });
    return `
<h2>How the three-centre rule works, step by step</h2>
<p>DVSA's guidance gives the example of a test booked at Chesterfield (${h.src('gov_rules_2026', '2026 booking rules')}). Its three nearest centres are Sheffield (Handsworth), Ashfield and Sheffield (Middlewood Road). The first change can move the test to any of those. If the learner moves to Sheffield (Handsworth), the second change can go to the three centres nearest Handsworth, which are Rotherham, Sheffield (Middlewood Road) and Worksop, or back to Chesterfield. After two changes, no further change is possible on that booking.</p>
<ol>
<li>Book only at a centre you intend to use: it decides your options later.</li>
<li>First change: one of the three nearest centres, or a new date at the same centre.</li>
<li>Second change: one of the three centres nearest wherever the test now is, or back to the first centre.</li>
<li>No change left: cancel and book again, refunded with ${h.P.rules.refundWorkingDays} full working days' notice.</li>
</ol>
<h2>An example: ${p.name}</h2>
<p>${h.cl('pinner-london', 'Pinner')} had a median wait of ${h.wk(p.wait?.median)} in ${h.month(h.lastMonth)} and a pass rate of ${h.pc(p.rate)}. A test booked there may move to ${p.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} (${h.num(n.miles)} miles, ${h.wk(n.wait)})`).join(', ')}. The table on each centre's page sets out the same comparison.</p>
${h.nearTable('pinner-london')}
<h2>Where the rule helps most</h2>
<p>For the busy centres with the longest median waits, the table shows the allowed centre with the shortest wait and its pass rate. Where the gap is wide, a move can bring a test forward by weeks; where it is narrow, a new date at the same centre is often the better use of a change.</p>
${h.table(['Booked centre', 'Wait', 'Fastest of its 3 nearest', 'Wait', 'Pass rate'], pairs, `Centres with 3,000 tests or more and the longest median waits, ${h.month(h.lastMonth)}. Pass rate ${h.yearLabel(h.lastYear)}.`, ['l', 'r', 'l', 'r', 'r'])}
<h2>Before you move</h2>
<p>A median wait describes tests already taken; the only way to know whether an earlier slot exists today is to look on the official ${h.src('gov_change', 'change your driving test')} service. Since ${h.date(h.P.rules.onlyLearnerFrom)} only the learner may do this, not an instructor, and finder apps are not allowed. Check that your instructor can reach the new centre on the day, and practise on its roads. The ${h.a('compare-driving-test-centres', 'comparison tool')} sets two centres side by side, and the ${h.a('driving-test-booking-rules-2026', '2026 rules page')} covers refunds and swaps. The list of nearest centres is DVSA's own (${h.src('gov_nearest', 'GOV.UK')}); rates and waits come from the ${h.src('dvsa_pass_centre', 'centre pass rate table')} and the ${h.src('dvsa_waits', 'monthly waiting table')}.</p>
`;
  },
});

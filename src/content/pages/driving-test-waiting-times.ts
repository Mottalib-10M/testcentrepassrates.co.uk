import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'driving-test-waiting-times',
  group: 'waits',
  order: 200,
  tool: { kind: 'finder', props: { q: 'M1', radius: 20, sort: 'wait' } },
  related: ['driving-test-cancellations', 'move-driving-test-centre', 'driving-test-booking-rules-2026', 'easiest-driving-test-centres', 'compare-driving-test-centres'],
  sources: ['dvsa_waits', 'dvsa_data', 'gov_release', 'gov_rules_2026'],
  slug: 'driving-test-waiting-times',
  nav: 'Waiting times',
  card: 'The median wait between booking and test at every centre, month by month.',
  title: 'Driving Test Waiting Times by Centre: Latest DVSA Month',
  description: 'Driving test waiting times at each car test centre in Britain: the median weeks from booking to test in the latest DVSA month, with 2 years of national trend.',
  h1: 'Driving test waiting times by centre',
  intro: 'Type a postcode: the finder lists the centres around it, shortest median wait first, with their pass rates.',
  resume: (h) => {
    const g = h.gb.wait!;
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000 && c.w != null), 'wait', true);
    const months = Object.keys(h.E.NATIONAL.areas['Great Britain']);
    const yearAgo = months.find((m) => m === `${Number(h.lastMonth.slice(0, 4)) - 1}${h.lastMonth.slice(4)}`);
    const ya = yearAgo ? h.F.areaWait('Great Britain', yearAgo) : null;
    return `In ${h.month(h.lastMonth)}, half of the car driving tests taken in Great Britain had been booked more than ${h.wk(g[3])} earlier, according to DVSA's monthly waiting table${ya ? `, against ${h.wk(ya[3])} a year before` : ''}. ${h.pp(g[4])} of that month's tests had been booked within seven weeks. Waits differ far more between centres than pass rates do: among centres with at least 1,000 tests a year, the median ranged from ${h.wk(big[0].w)} at ${big[0].n} to ${h.wk(big[big.length - 1].w)} at ${big[big.length - 1].n}. The figure is measured on tests already taken, from the day of booking to the day of the test, so it describes the recent past rather than the date a booking made today would get. The finder above sorts the centres near any postcode by that median wait.`;
  },
  faqs: (h) => {
    const g = h.gb.wait!;
    const lon = h.F.areaWait('London', h.lastMonth)!;
    const lw = h.E.sorted(h.E.inRegion('London').filter((c) => c.w != null && c.t >= 1000), 'wait', true);
    const lonShort = lw[0], lonLong = lw[lw.length - 1];
    return [
      { q: 'How long is the wait for a driving test in the UK?', a: `In Great Britain, the median gap between booking and test was ${h.wk(g[3])} for tests taken in ${h.month(h.lastMonth)}, from DVSA table DRT121G. Northern Ireland, run by the DVA, publishes separately. At some centres the median is under five weeks, at others over twenty; the finder ranks the centres near you.` },
      { q: 'Why are driving test waiting times so long in London?', a: `London's median wait was ${h.wk(lon[3])} in ${h.month(h.lastMonth)}, against ${h.wk(g[3])} for Great Britain, with ${h.pp(lon[4])} of tests booked within seven weeks. DVSA does not give reasons by area. Within London, the shortest median that month was ${h.wk(lonShort.w)} at ${lonShort.n} and the longest ${h.wk(lonLong.w)} at ${lonLong.n}.` },
      { q: 'What does "median wait" mean for a test centre?', a: 'DVSA takes every test taken at the centre in a month and measures the weeks between the day it was booked and the day it took place. Half of those tests waited longer than the median, half less. Tests booked very early, months ahead, can push the figure up even in a month when free slots existed.' },
      { q: 'When are new driving test dates released?', a: `DVSA releases a new week of appointments at ${h.P.rules.releaseTime} every ${h.P.rules.releaseDay}, ${h.P.rules.releaseWeeksAhead} weeks ahead. Earlier dates appear at any time during the week when other candidates cancel or move a test, which is why the wait in the table can be shorter than ${h.P.rules.releaseWeeksAhead} weeks for those who check the official service often.` },
    ];
  },
  body: (h) => {
    const G = h.E.NATIONAL.areas['Great Britain'] as Record<string, number[]>;
    const ms = Object.keys(G);
    const grows = [...ms].reverse().map((m) => [h.month(m), G[m][0], h.wk(G[m][3]), h.pp(G[m][4]), h.wk(G[m][2])]);
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && c.w != null);
    const longest = h.E.sorted(big, 'wait').slice(0, 12);
    const shortest = h.E.sorted(big, 'wait', true).slice(0, 12);
    const areas = ['England', 'Scotland', 'Wales', ...h.E.REGIONS.filter((r) => r !== 'Wales' && r !== 'Scotland')];
    const arows = areas.map((a) => { const w = h.F.areaWait(a, h.lastMonth)!; return [a, h.wk(w[3]), h.pp(w[4]), h.wk(w[2])]; }).sort((x, y) => parseFloat(String(y[1])) - parseFloat(String(x[1])));
    const low = ms.reduce((a, m) => (G[m][3] < G[a][3] ? m : a)), high = ms.reduce((a, m) => (G[m][3] > G[a][3] ? m : a));
    return `
<h2>Longest and shortest waits</h2>
<p>Centres with at least 1,000 tests a year, by median wait in ${h.month(h.lastMonth)}. The pass rate is shown beside the wait, because a short queue at a centre where few pass may not save time in the end.</p>
${h.centreTable(longest, `Longest median waits, ${h.month(h.lastMonth)}. DVSA table DRT122F; pass rate ${h.yearLabel(h.lastYear)}.`)}
${h.centreTable(shortest, `Shortest median waits, same month.`)}
<h2>By nation and region</h2>
<p>The regional figures come from DVSA's own table of waiting times by area, which counts every test of the month in that area. The last column gives the weeks it took for the first tenth of the month's tests to be booked: when it reaches ${h.P.rules.releaseWeeksAhead} weeks, the earliest slots went as soon as they were released.</p>
${h.table(['Area', 'Median wait', 'Booked within 7 weeks', 'Weeks to 10 % booked'], arows, `Car practical tests taken in ${h.month(h.lastMonth)}. DVSA table DRT121G.`, ['l', 'r', 'r', 'r'])}
<h2>Two years of national waits</h2>
<p>Over the ${ms.length} months in the table, the national median was lowest in ${h.month(low)}, at ${h.wk(G[low][3])}, and highest in ${h.month(high)}, at ${h.wk(G[high][3])}. The monthly figure depends on how many slots DVSA offers and how many candidates book, neither of which the waiting table shows on its own.</p>
${h.table(['Month', 'Tests taken', 'Median wait', 'Booked within 7 weeks', 'Weeks to 10 % booked'], grows, 'Car practical tests, Great Britain. DVSA table DRT121G.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Reading a centre's wait</h2>
<p>A median of twenty weeks does not mean every learner waits twenty weeks. It means half of the tests taken that month had been booked more than twenty weeks before, often by learners who booked as soon as a week was released and kept the date. Others found earlier slots given back by candidates who moved or cancelled. A centre can therefore show a long median and still offer short-notice dates now and then. The share booked within seven weeks is the better guide to those chances: the higher it is, the more often short-notice slots turned into tests that month.</p>
<p>Pass rate and wait pull in different directions at many centres, which is why the finder shows both. A shorter queue at a neighbouring centre is only useful if that centre is one of the three you may move to, and if its roads are ones you can practise on.</p>
<h2>Getting an earlier date, the official way</h2>
<p>There is no waiting list at most centres. New weeks are released at ${h.P.rules.releaseTime} on ${h.P.rules.releaseDay}s, ${h.P.rules.releaseWeeksAhead} weeks ahead, and DVSA advises that joining the queue at that time brings no benefit to anyone looking for an earlier test (${h.src('gov_release', 'DVSA release dates')}). Earlier slots come back at any time when someone cancels, moves or swaps. Since 12 May 2026 only the learner may search and change their own booking, and cancellation-finder apps and websites are not allowed (${h.src('gov_rules_2026', '2026 booking rules')}). Each change of date or centre uses one of the ${h.P.rules.changesAllowed} changes allowed. The ${h.a('move-driving-test-centre', 'moving a test page')} lists the three centres each test can move to, with their waits, and the ${h.a('driving-test-cancellations', 'cancellations page')} explains what happens when DVSA cancels.</p>
<p>Centre figures come from table DRT122F of the ${h.src('dvsa_waits', 'DVSA statistics')}, updated every month; the area figures from the ${h.src('dvsa_data', 'national tables')}.</p>
`;
  },
});

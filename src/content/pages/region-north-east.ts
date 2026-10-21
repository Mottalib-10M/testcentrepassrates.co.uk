import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'North East';
export default definePage({
  id: 'region-north-east',
  group: 'regions',
  order: 507,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-north-west', 'region-yorkshire-and-the-humber', 'region-scotland', 'driving-test-waiting-times', 'driving-lesson-prices'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-north-east',
  nav: 'North East',
  card: 'Tyneside, Wearside, Teesside, Durham and Northumberland: the smallest region.',
  title: 'Driving Test Centres in the North East: Pass Rates, Waits',
  description: 'Driving test centres in the North East ranked by DVSA pass rate, from Tyneside and Teesside to Durham and Northumberland, with each median wait and the trend.',
  h1: 'Driving test centres in the North East',
  intro: 'The North East centres by pass rate, each with its median wait. Type a postcode to see the centres near it.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const t = rankOf(h, R, (x) => x.tests);
    return `${t.rank === t.of ? 'The North East is the smallest region for car tests in Britain' : `The North East ranks ${h.ord(t.rank)} of ${t.of} regions for car tests`}: its ${f.list.length} centres conducted ${h.num(f.tests)} practical tests in ${h.yearLabel(h.lastYear)}, ${h.pc(f.share, 1)} of the national total. They passed ${h.pc(f.rate)} of them, ${side(f.rate, h.gb.rate)} the British rate of ${h.pc(h.gb.rate)}. The highest rates among the larger centres were at ${f.top[0].n} (${h.pp(h.E.rate(f.top[0]))}) and ${f.top[1].n} (${h.pp(h.E.rate(f.top[1]))}), and the lowest at ${f.low[0].n}, ${h.pp(h.E.rate(f.low[0]))}. Across the region, the median wait was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}${f.waitYearAgo ? `, compared with ${h.wk(f.waitYearAgo[3])} a year before` : ''}. With so few centres, the three a test may move to can be well spread out, and the first booking deserves careful thought. The finder above shows each centre's rate and wait, highest rate first, or the centres near a postcode.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const ty = f.list.filter((c) => /^(Gateshead|Gosforth|Sunderland|South Shields|Newcastle)/.test(c.n));
    return [
      { q: 'Which Newcastle area test centre has the highest pass rate?', a: `Of the Tyneside and Wearside centres in the DVSA tables, ${h.E.sorted(ty, 'rate').map((c) => `${c.n} passed ${h.pp(h.E.rate(c))}`).join(', ')} of car tests in ${h.yearLabel(h.lastYear)}. The region's highest rates were elsewhere, at ${f.top[0].n} and ${f.top[1].n}. The table on this page gives each centre's wait beside its rate.` },
      { q: 'Is it hard to get a driving test in the North East?', a: `The median wait across the North East was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}, against ${h.wk(h.gb.wait?.[3])} for Britain. Among the larger centres, it ranged from ${h.wk(f.shortest?.w)} at ${f.shortest?.n} to ${h.wk(f.longest?.w)} at ${f.longest?.n}. A median describes tests already taken, not the date a new booking will get.` },
      { q: 'How much do driving lessons cost in the North East?', a: `In DVSA's survey of instructors in ${h.P.adiSurvey.fieldwork}, ${h.num(f.price?.[1] ?? 0, 1)} % of North East instructors charged £36 to £40 for an hour and only ${h.num(f.price?.[2] ?? 0, 1)} % charged £41 or more, the smallest share of any region. ${h.num(f.price?.[0] ?? 0, 1)} % charged £35 or less. The survey asks instructors what they charge for a standard one-hour lesson.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const ys = h.E.YEARS;
    const full = h.F.FULL_CENTRES.filter((c) => c.region === R);
    const far = full.flatMap((c) => c.near.map(([n, mi]) => ({ c: c.name, mi, to: n }))).reduce((a, b) => (b.mi > a.mi ? b : a), { c: '', mi: 0, to: '' });
    return `
<p>The region's centres follow its towns: Tyneside and Wearside, Teesside, County Durham, and the long, thinly populated county of Northumberland up to Berwick. The busiest in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. Over the three years in the table, the regional rate went from ${h.pc(f.byYear[ys[0]].rate)} in ${h.yearLabel(ys[0])} to ${h.pc(f.byYear[ys[1]].rate)} and then ${h.pc(f.rate)}, ${(f.rate ?? 0) - (f.byYear[ys[0]].rate ?? 0) < (h.gb.rate - h.E.gbRate(ys[0])) ? 'a smaller rise than Britain as a whole' : 'keeping pace with Britain as a whole'}.</p>
${regionTables(h, R, f)}
<h2>A small region, a wide spread</h2>
<p>With only ${f.big.length} centres above 1,000 tests a year, the ${h.num(f.spread, 1)}-point gap between ${f.top[0].n} and ${f.low[0].n} is set by a handful of places. ${f.low[0].n}'s rate stands apart from the rest of the region: the next lowest, ${f.low[1].n}, passed ${h.pp(h.E.rate(f.low[1]))}. DVSA's tables do not explain a single centre's figure, and they mix the effect of the routes with that of the learners who book there. First attempts passed ${h.pc(f.first)} of the time across the region, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}; men passed ${h.pc(f.men)} of tests and women ${h.pc(f.women)}. Of the ${f.trendN} larger centres with three years of results, ${f.up} rose.</p>
<h2>Moving a test in a region of long distances</h2>
<p>Since ${h.date(h.P.rules.nearestThreeFrom)}, a booked test can only move to the three centres DVSA lists as nearest to it. In the North East those can be far apart: the longest distance in the region's lists is ${h.num(far.mi)} miles, from ${far.c} to ${far.to}. That makes the first booking more important here than in a city, where three centres are often close. Waits differ too: in ${h.month(h.lastMonth)} the longest median among the larger centres was ${h.wk(f.longest?.w)} at ${f.longest?.n}. The ${h.a('move-driving-test-centre', 'moving a test page')} shows each centre's options, and the ${h.a('driving-test-booking-rules-2026', '2026 rules page')} explains changes and refunds.</p>
<p>For a learner choosing between Tyneside centres, the gaps in the table are large for places so close together, and the waits differ as much as the rates. Comparing two of them side by side, with their distance, takes a moment in the ${h.a('compare-driving-test-centres', 'comparison tool')}. Lessons are among the cheapest in Britain by DVSA's survey (${h.a('driving-lesson-prices', 'lesson prices by region')}), and the ${h.a('cost-of-learning-to-drive', 'cost calculator')} adds fees and the retests a centre's rate implies, for any centre in the region.</p>
`;
  },
});

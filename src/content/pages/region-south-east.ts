import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'South East';
export default definePage({
  id: 'region-south-east',
  group: 'regions',
  order: 501,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-london', 'region-south-west', 'region-east-of-england', 'centre-slough-london', 'easiest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-south-east',
  nav: 'South East',
  card: 'The South East centres from Kent to Oxfordshire, by pass rate and median wait.',
  title: 'Driving Test Centres in the South East: Pass Rates, Waits',
  description: 'Driving test centres in the South East of England ranked by DVSA pass rate, from Kent to Oxfordshire, with the median wait and the three-year change at each.',
  h1: 'Driving test centres in the South East',
  intro: 'Every South East centre, highest pass rate first, with its wait. Type a postcode to search around a town instead.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const r = rankOf(h, R, (x) => x.rate);
    return `The South East of England had ${f.list.length} car test centres in ${h.yearLabel(h.lastYear)}, which together conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the British rate of ${h.pc(h.gb.rate)} and the ${h.ord(r.rank)} highest of the ${r.of} regions. ${f.top[0].n} led the larger centres at ${h.pp(h.E.rate(f.top[0]))}, ahead of ${f.top[1].n} and ${f.top[2].n}; ${f.low[0].n} had the lowest rate, ${h.pp(h.E.rate(f.low[0]))}. That is a gap of ${h.num(f.spread, 1)} points within one region, far more than separates the regions themselves, so the choice of centre matters more than the choice of county. The median wait across the South East was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}${f.waitYearAgo ? `, ${(f.wait?.[3] ?? 0) < f.waitYearAgo[3] ? 'down' : 'up'} from ${h.wk(f.waitYearAgo[3])} a year earlier` : ''}. Choose a centre in the finder above, or type a postcode, to compare those within reach.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const lon = f.list.filter((c) => /\(London\)/.test(c.n));
    return [
      { q: 'Which South East test centre has the best pass rate?', a: `${f.top[0].n}, where ${h.pp(h.E.rate(f.top[0]))} of car tests were passed in ${h.yearLabel(h.lastYear)}, among South East centres with at least 1,000 tests. ${f.top[1].n} followed with ${h.pp(h.E.rate(f.top[1]))}. A high rate is worth little if the centre is far from where you practise, so look at the centres near your own postcode first.` },
      { q: 'Why do some South East centres have "London" in their name?', a: `DVSA names ${lon.length} centres in the region with "(London)", such as ${lon.slice(0, 2).map((c) => c.n).join(' and ')}, but places them in the South East in its statistics, and this site follows DVSA's regions. They serve the edge of Greater London, and many London learners book them; they appear on this page rather than the London one.` },
      { q: 'Are driving lessons more expensive in the South East?', a: `More than in most regions. In DVSA's survey of ${h.P.adiSurvey.fieldwork}, ${h.num(f.price?.[2] ?? 0, 1)} % of South East instructors charged £41 or more for an hour and ${h.num(f.price?.[0] ?? 0, 1)} % £35 or less. Only the South West had a larger share at £41 or more. The survey gives bands, not an average price.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const lon = f.list.filter((c) => /\(London\)/.test(c.n));
    const p = rankOf(h, R, (x) => x.price?.[2]);
    const rr = h.E.REGIONS.map((x) => regionFacts(h, x).rate as number);
    const regGap = (Math.max(...rr) - Math.min(...rr)) * 100;
    const toLon = f.list.filter((c) => c.nb.some((n) => h.E.hasCentre(n) && h.E.centre(n).r === 'London'));
    return `
<p>The region runs in an arc around London, from the Kent coast to the Thames Valley and the Solent. Its largest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. ${lon.length} of its centres carry "(London)" in DVSA's name, ${lon.map((c) => c.n).join(', ')}, although DVSA counts them in the South East; they appear here, with the region's other centres. Of the ${f.trendN} larger centres with three years of results, ${f.up} passed a higher share of tests in ${h.yearLabel(h.lastYear)} than in ${h.yearLabel(h.E.YEARS[0])}.</p>
${regionTables(h, R, f)}
<h2>A wide spread between neighbours</h2>
<p>The ${h.num(f.spread, 1)}-point gap between ${f.top[0].n} and ${f.low[0].n} is ${f.spread > regGap ? 'wider' : 'narrower'} than the ${h.num(regGap, 1)} points between the highest and lowest regions of Britain. DVSA publishes no reason for a centre's rate, and the figures mix the effect of roads with that of who books there: the share of automatic tests, ${h.pc(f.autoShare, 0)} across the region, the age of candidates and how many are on a retest. First attempts passed ${h.pc(f.first)} of the time here, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}.</p>
<p>The biggest three-year rise among the larger centres was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)} (${h.pts(h.E.trend(f.riser))})` : 'none'}, the weakest change at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)} (${h.pts(h.E.trend(f.faller))})` : 'none'}. Men passed ${h.pc(f.men)} of tests across the region and women ${h.pc(f.women)}.</p>
<h2>The queue around the capital</h2>
<p>Waits in ${h.month(h.lastMonth)} ran from ${h.wk(f.shortest?.w)} at ${f.shortest?.n} to ${h.wk(f.longest?.w)} at ${f.longest?.n}, among the larger centres. The centres on the edge of London draw learners from both sides of the boundary, and since ${h.date(h.P.rules.nearestThreeFrom)} a test booked at one of them can only move to its three nearest centres. For ${toLon.length} South East centres, ${toLon.slice(0, 3).map((c) => c.n).join(', ')}${toLon.length > 3 ? ' among them' : ''}, that list includes a London centre. The ${h.a('move-driving-test-centre', 'moving a test page')} shows those options for any centre.</p>
<p>Lessons cost more here than in most of Britain: the South East ranked ${h.ord(p.rank)} of ${p.of} regions for the share of instructors charging £41 or more an hour (${h.a('driving-lesson-prices', 'lesson prices')}). With a pass rate above the national one, the expected number of practical tests is lower, which offsets a little of that; the ${h.a('cost-of-learning-to-drive', 'cost calculator')} adds both for any centre.</p>
`;
  },
});

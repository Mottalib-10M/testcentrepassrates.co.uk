import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side } from '../../lib/region';

const R = 'East of England';
export default definePage({
  id: 'region-east-of-england',
  group: 'regions',
  order: 503,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-london', 'region-east-midlands', 'region-south-east', 'driving-test-waiting-times', 'hardest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-east-of-england',
  nav: 'East of England',
  card: 'Norfolk, Suffolk, Essex, Cambridgeshire, Hertfordshire and Bedfordshire centres.',
  title: 'Driving Test Centres in the East of England: Rates, Waits',
  description: 'Driving test centres in the East of England ranked by DVSA pass rate, from Norwich and Ipswich to Luton and Watford, with each centre\'s median wait and trend.',
  h1: 'Driving test centres in the East of England',
  intro: 'All East of England centres with pass rate and wait, highest rate first. Type a postcode to look around one town.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const y0 = h.E.YEARS[0];
    return `In ${h.yearLabel(h.lastYear)}, the ${f.list.length} car test centres of the East of England conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the British ${h.pc(h.gb.rate)}. Two years earlier, in ${h.yearLabel(y0)}, the region's rate had been ${h.pc(f.byYear[y0].rate)}. The highest rates among the larger centres were at ${f.top[0].n} (${h.pp(h.E.rate(f.top[0]))}) and ${f.top[1].n} (${h.pp(h.E.rate(f.top[1]))}); the lowest at ${f.low[0].n}, ${h.pp(h.E.rate(f.low[0]))}. The region's waits are uneven: the median was ${h.wk(f.wait?.[3])} across the East in ${h.month(h.lastMonth)}, but ${h.wk(f.longest?.w)} at ${f.longest?.n} and ${h.wk(f.shortest?.w)} at ${f.shortest?.n}. A centre with a short queue is worth a look only if it is one of the three a booked test may move to. Use the finder above to set the centres near you side by side, with their rates and waits.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    return [
      { q: 'Which test centre in the East of England has the highest pass rate?', a: `Among centres with at least 1,000 tests, ${f.top[0].n} passed the most in ${h.yearLabel(h.lastYear)}, ${h.pp(h.E.rate(f.top[0]))}, ahead of ${f.top[1].n} and ${f.top[2].n}. These are DVSA figures for all car tests at the centre, first attempts and retests together; the first-attempt rate of each centre is on the first-time pass rates page.` },
      { q: 'Where is the shortest driving test wait in the East of England?', a: `In ${h.month(h.lastMonth)}, at ${f.shortest?.n}, with a median of ${h.wk(f.shortest?.w)} between booking and test, among the larger centres. A median describes tests already taken. Whether you can move a booked test there depends on the 2026 rule: only the three centres nearest your booked centre are allowed.` },
      { q: 'Why do Borehamwood, Brentwood and Loughton say "London"?', a: 'DVSA names several centres just outside Greater London with "(London)" because they serve London learners too, but counts them in the East of England in its statistics. This site keeps DVSA\'s regions, so they appear here. A London learner can often reach them, and some are among the three nearest centres of a London centre.' },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const lon = f.list.filter((c) => /\(London\)/.test(c.n));
    const fromLon = h.E.inRegion('London').filter((c) => c.nb.some((n) => h.E.hasCentre(n) && h.E.centre(n).r === R));
    return `
<p>The region stretches from the Norfolk coast to the northern edge of London, and its centres reflect that: busy commuter towns in Hertfordshire and Essex, university cities, and market towns in Suffolk and Norfolk. The busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. ${lon.length} centres in the region carry "(London)" in their DVSA name, ${lon.map((c) => c.n).join(', ')}, and ${fromLon.length} London centres list at least one East of England centre among their three nearest.</p>
${regionTables(h, R, f)}
<h2>Rates rose, unevenly</h2>
<p>Of the ${f.trendN} larger centres with three years of results, ${f.up} passed a higher share of tests in ${h.yearLabel(h.lastYear)} than in ${h.yearLabel(h.E.YEARS[0])}. The biggest rise was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)}, ${h.pts(h.E.trend(f.riser))}` : 'none'}, the weakest change at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)}, ${h.pts(h.E.trend(f.faller))}` : 'none'}. Rates of first attempts across the region were ${h.pc(f.first)}, ${side(f.first, h.gb.first)} Britain's ${h.pc(h.gb.first)}; men passed ${h.pc(f.men)} of their tests and women ${h.pc(f.women)}. Automatic cars accounted for ${h.pc(f.autoShare, 0)} of the region's tests.</p>
<p>The ${h.num(f.spread, 1)} points between ${f.top[0].n} and ${f.low[0].n} is the kind of gap that makes learners consider a centre further away. Before doing so, weigh the wait at that centre, the roads you can practise on, and whether a booked test may move there at all. The ${h.a('compare-driving-test-centres', 'comparison tool')} sets any two centres side by side.</p>
<h2>Where the queues are</h2>
<p>The region's median of ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)} hides a wide range between centres. Among the larger ones, the longest medians were at ${f.longest?.n}, ${h.wk(f.longest?.w)}, and the shortest at ${f.shortest?.n}, ${h.wk(f.shortest?.w)}. A short median can reflect slots released at short notice that were taken quickly, so it does not promise the same wait to a booking made today. In DVSA's survey, ${h.num(f.price?.[1] ?? 0, 1)} % of the region's instructors charged £36 to £40 for an hour; ${h.a('driving-lesson-prices', 'lesson prices by region')} sets that against the rest of Britain.</p>
<p>The region's busiest centres, ${f.largest.slice(0, 2).map((c) => `${c.n} with ${h.num(c.t)} tests`).join(' and ')}, publish rates resting on thousands of results, which move slowly from year to year. At its smallest centre, ${h.E.sorted(f.list, 'tests', true)[0].n}, ${h.num(h.E.sorted(f.list, 'tests', true)[0].t)} tests decided the figure, and a few dozen results either way shift it by points. For the national picture of how centres compare, see the ${h.a('easiest-driving-test-centres', 'highest')} and ${h.a('hardest-driving-test-centres', 'lowest')} pass rates in Britain.</p>
`;
  },
});

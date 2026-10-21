import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'South West';
export default definePage({
  id: 'region-south-west',
  group: 'regions',
  order: 502,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-wales', 'region-south-east', 'centre-bristol-kingswood', 'centre-bristol-avonmouth', 'driving-lesson-prices'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-south-west',
  nav: 'South West',
  card: 'From Cornwall to Gloucestershire: each centre\'s pass rate and wait, side by side.',
  title: 'Driving Test Centres in the South West: Pass Rates, Waits',
  description: 'Driving test centres in the South West, from Cornwall to Gloucestershire, ranked by DVSA pass rate, with each centre\'s median wait and how its rate has moved.',
  h1: 'Driving test centres in the South West',
  intro: 'Every South West centre with its pass rate and its wait. Type a postcode to see the centres around a town or village.',
  resume: (h) => {
    const f = regionFacts(h, R);
    return `${f.list.length} car test centres serve the South West of England, from Camborne in Cornwall to Gloucester and Swindon. In ${h.yearLabel(h.lastYear)} they conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)} of them, ${side(f.rate, h.gb.rate)} the ${h.pc(h.gb.rate)} recorded for Great Britain. The region holds some of the most contrasting centres in the country: ${f.top[0].n} passed ${h.pp(h.E.rate(f.top[0]))} of its tests, ${f.low[0].n} ${h.pp(h.E.rate(f.low[0]))}, a gap of ${h.num(f.spread, 1)} points between centres of the same region. The South West median wait was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}${f.waitYearAgo ? ` against ${h.wk(f.waitYearAgo[3])} twelve months before` : ''}. Distances matter more here than in a city, since the three centres a test may move to can be far apart. The finder above ranks every centre in the region, or those near any postcode you type.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    return [
      { q: 'Which South West driving test centre is the easiest?', a: `By pass rate, ${f.top[0].n}: ${h.pp(h.E.rate(f.top[0]))} of car tests passed in ${h.yearLabel(h.lastYear)}, then ${f.top[1].n} with ${h.pp(h.E.rate(f.top[1]))}. "Easiest" is a shorthand: the rate reflects the learners who test there as well as the roads, and the test is the same everywhere. Choose among centres you can practise around.` },
      { q: 'How long is the wait for a driving test in the South West?', a: `The median across the region was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}, from DVSA's monthly table, and ${h.pp(f.wait?.[4])} of those tests had been booked within seven weeks. Among the larger centres, the median ranged from ${h.wk(f.shortest?.w)} at ${f.shortest?.n} to ${h.wk(f.longest?.w)} at ${f.longest?.n}.` },
      { q: 'How much are driving lessons in the South West?', a: `The South West has the highest prices in DVSA's survey of ${h.P.adiSurvey.fieldwork}: ${h.num(f.price?.[2] ?? 0, 1)} % of its instructors charged £41 or more for a one-hour lesson, and only ${h.num(f.price?.[0] ?? 0, 1)} % £35 or less. Across Britain, the most common price was £36 to £40. The survey gives price bands only.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const p = rankOf(h, R, (x) => x.price?.[2]);
    const s = rankOf(h, R, (x) => x.spread);
    return `
<p>The South West is a long region, and its centres are far apart once you leave Bristol. The busiest in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}; ${f.small.length} centres held fewer than 1,000 tests and appear in the table without being ranked against the others. Of the ${f.trendN} larger centres with three years of results, ${f.up} raised their pass rate. The two Bristol centres have their own pages, with ten years of results and the age and sex of their candidates.</p>
${regionTables(h, R, f)}
<h2>A wide gap between centres</h2>
<p>The ${h.num(f.spread, 1)} points between the highest and lowest larger centres put the South West ${s.rank === 1 ? 'first' : h.ord(s.rank)} of the ${s.of} regions for spread. At the top, ${f.top.map((c) => `${h.cl(c.id, c.n)} (${h.pp(h.E.rate(c))})`).join(', ')}; at the bottom, ${f.low.map((c) => `${h.cl(c.id, c.n)} (${h.pp(h.E.rate(c))})`).join(', ')}. Rates of that kind are not a verdict on a centre's examiners: DVSA's tables do not separate the routes from the candidates, and a centre that serves a city or a university town tests a different mix of learners from a market town. Check the three-year change column before reading much into a single year: a centre's rate can move by several points when its candidates change.</p>
<p>Across the region, ${h.pc(f.autoShare, 0)} of tests were taken in automatic cars and ${h.pc(f.first)} of first attempts passed, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}. Men passed ${h.pc(f.men)} of tests and women ${h.pc(f.women)}. The largest three-year rise was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)}, ${h.pts(h.E.trend(f.riser))}` : 'none'}.</p>
<h2>Distance, waits and prices</h2>
<p>In ${h.month(h.lastMonth)} the shortest median wait among the larger centres was ${h.wk(f.shortest?.w)} at ${f.shortest?.n} and the longest ${h.wk(f.longest?.w)} at ${f.longest?.n}. In a rural region, the three nearest centres a test may move to can be a long drive apart, so a shorter queue elsewhere is only useful if you can practise there; each centre's page gives DVSA's distances in miles. Lessons cost more here than anywhere else in the survey: the region ranked ${h.ord(p.rank)} of ${p.of} for the share of instructors at £41 an hour or more. The ${h.a('cost-of-learning-to-drive', 'cost calculator')} shows what that does to the total for a South West centre, with your own hours and the price you have been quoted.</p>
`;
  },
});

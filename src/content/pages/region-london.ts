import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf, gbAutoShare } from '../../lib/region';

const R = 'London';
export default definePage({
  id: 'region-london',
  group: 'regions',
  order: 500,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-south-east', 'region-east-of-england', 'centre-hendon-london', 'move-driving-test-centre', 'automatic-driving-test-pass-rates'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-london',
  nav: 'London',
  card: 'All London car test centres, by pass rate and wait, with the automatic share.',
  title: 'Driving Test Centres in London: Pass Rates and Waits',
  description: 'Driving test centres in London ranked by DVSA pass rate, with the median wait, the three-year change and the share of automatic tests at each London centre.',
  h1: 'Driving test centres in London',
  intro: 'All London centres, highest pass rate first. Type a postcode instead to see the centres around it, inside or outside London.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const a = rankOf(h, R, (x) => x.autoShare);
    return `London's ${f.list.length} car test centres conducted ${h.num(f.tests)} practical tests in ${h.yearLabel(h.lastYear)}, ${h.pc(f.share, 0)} of all tests in Great Britain, and passed ${h.pc(f.rate)} of them, ${side(f.rate, h.gb.rate)} the national ${h.pc(h.gb.rate)}. The best rate among the larger centres was ${h.pp(h.E.rate(f.top[0]))} at ${f.top[0].n}, the lowest ${h.pp(h.E.rate(f.low[0]))} at ${f.low[0].n}. What sets the capital apart is the car: ${h.pc(f.autoShare, 0)} of its tests were taken in an automatic, ${a.rank === 1 ? 'the highest share of any region' : `the ${h.ord(a.rank)} highest share of the ${a.of} regions`}, against ${h.pc(gbAutoShare(h), 0)} nationally. The median wait across London was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}. Waits matter as much as rates here, because a centre a few miles away can have a much longer queue. The finder above lists every London centre with both figures; type a postcode to include those just outside the boundary.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const out = f.list.filter((c) => c.nb.some((n) => h.E.hasCentre(n) && h.E.centre(n).r !== R));
    return [
      { q: 'Which London driving test centre has the highest pass rate?', a: `${f.top[0].n}, with ${h.pp(h.E.rate(f.top[0]))} of tests passed in ${h.yearLabel(h.lastYear)}, followed by ${f.top[1].n} at ${h.pp(h.E.rate(f.top[1]))} and ${f.top[2].n} at ${h.pp(h.E.rate(f.top[2]))}, among London centres with at least 1,000 tests. Rates move by a few points a year, so check the three-year column before choosing.` },
      { q: 'Why is the London pass rate lower than average?', a: `It ${f.rate != null && f.rate < h.gb.rate ? 'is' : 'is not always'}: London passed ${h.pc(f.rate)} in ${h.yearLabel(h.lastYear)} against ${h.pc(h.gb.rate)} for Britain. DVSA gives no reason. The figures show London tests more automatics, which pass less often nationally, and its first-attempt rate was ${h.pc(f.first)}, against ${h.pc(h.gb.first)} for Britain${(f.first ?? 0) < h.gb.first ? ', so the gap is not only a matter of retests' : ''}.` },
      { q: 'Can I take my test outside London to get it sooner?', a: `Only within the 2026 rules. A test booked at a London centre can move to the three centres DVSA lists as nearest to it. For ${out.length} of the ${f.list.length} London centres, that list includes a centre outside London${out[0] ? `, for example ${out[0].n}, which can move to ${h.E.centre(out[0].nb.find((n) => h.E.hasCentre(n) && h.E.centre(n).r !== R) as string).n}` : ''}. To test further away, book a new test there and cancel the first.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const w = f.wait, y = f.waitYearAgo;
    const t = rankOf(h, R, (x) => x.tests);
    const se = regionFacts(h, 'South East').price, sw = regionFacts(h, 'South West').price;
    return `
<p>${t.rank === 1 ? 'No region holds more car tests than London' : `London ranks ${h.ord(t.rank)} of the ${t.of} regions for car tests`}: ${h.pc(f.share, 0)} of Britain's practical tests in ${h.yearLabel(h.lastYear)} were taken at its ${f.list.length} centres, the largest being ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. Of the ${f.trendN} larger centres with three years of results, ${f.up} raised their pass rate over the period. ${f.pages.length} London centres have their own page on this site, with ten years of results, waits, age and sex.</p>
${regionTables(h, R, f)}
<h2>London's queue</h2>
<p>The London-wide median wait was ${h.wk(w?.[3])} in ${h.month(h.lastMonth)}${y ? `, against ${h.wk(y[3])} a year earlier` : ''}, and ${h.pp(w?.[4])} of the month's London tests had been booked within seven weeks. Within London the spread is wide: among the larger centres it ran from ${h.wk(f.shortest?.w)} at ${f.shortest?.n} to ${h.wk(f.longest?.w)} at ${f.longest?.n}. Because a booked test can only move to the three centres nearest it, two learners a few miles apart can face very different queues; the ${h.a('move-driving-test-centre', 'moving a test page')} lists each centre's options.</p>
<h2>Who passes, and where rates moved</h2>
<p>Across London's centres, men passed ${h.pc(f.men)} of their tests in ${h.yearLabel(h.lastYear)} and women ${h.pc(f.women)}. Over three years the largest rise among the bigger centres was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)}, ${h.pts(h.E.trend(f.riser))}` : 'none'}, and the weakest change at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)}, ${h.pts(h.E.trend(f.faller))}` : 'none'}. Moves of that size can come from a change of examiners, of routes or of the learners who book there, and DVSA does not say which. A centre that rose last year can fall back the next, which is why the table keeps the three-year change beside the latest rate.</p>
<p>The figures also show how unevenly London's tests are spread. The three largest centres alone took ${h.pc(f.largest.reduce((s, c) => s + c.t, 0) / f.tests, 0)} of the capital's tests. A large centre's rate rests on many thousands of results and changes slowly; a small one can swing by several points on a few hundred tests.</p>
<h2>Lessons in the capital</h2>
<p>In DVSA's instructor survey of ${h.P.adiSurvey.fieldwork}, ${h.num(f.price?.[0] ?? 0, 1)} % of London instructors charged £35 or less for an hour and ${h.num(f.price?.[2] ?? 0, 1)} % £41 or more, against ${h.num(se?.[2] ?? 0, 1)} % in the South East and ${h.num(sw?.[2] ?? 0, 1)} % in the South West (${h.a('driving-lesson-prices', 'lesson prices by region')}). With London's automatic share well above the national figure, it is worth asking early whether you will learn manual or automatic: a pass in an automatic car only licenses automatics, and the ${h.a('automatic-driving-test-pass-rates', 'automatic pass rates page')} compares the two at every centre.</p>
`;
  },
});

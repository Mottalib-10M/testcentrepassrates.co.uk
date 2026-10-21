import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'Yorkshire and The Humber';
export default definePage({
  id: 'region-yorkshire-and-the-humber',
  group: 'regions',
  order: 508,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-north-east', 'region-east-midlands', 'centre-horsforth', 'centre-leeds-colton-mill', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey', 'gov_rules_2026'],
  slug: 'driving-test-centres-yorkshire',
  nav: 'Yorkshire and the Humber',
  card: 'Leeds, Sheffield, Bradford, Hull and the Dales: rates, waits and moves.',
  title: 'Driving Test Centres in Yorkshire: Pass Rates and Waits',
  description: 'Driving test centres in Yorkshire and the Humber ranked by DVSA pass rate, from Leeds, Sheffield and Hull to the Dales and the coast, with the latest wait.',
  h1: 'Driving test centres in Yorkshire and the Humber',
  intro: 'Every centre in Yorkshire and the Humber, highest pass rate first, with its wait. Type a postcode to search near you.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const s = rankOf(h, R, (x) => x.spread);
    return `Yorkshire and the Humber had ${f.list.length} car test centres in ${h.yearLabel(h.lastYear)}. Together they conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the ${h.pc(h.gb.rate)} recorded for Great Britain. Compared with other regions, its centres sit close together in the ranking: the gap between the highest and lowest larger centres, ${f.top[0].n} at ${h.pp(h.E.rate(f.top[0]))} and ${f.low[0].n} at ${h.pp(h.E.rate(f.low[0]))}, was ${h.num(f.spread, 1)} points, ${s.rank === s.of ? 'the narrowest of any region' : `${h.ord(s.of - s.rank + 1)} narrowest of ${s.of}`}. Waits vary more than rates. The median across the region was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}${f.waitYearAgo ? `, from ${h.wk(f.waitYearAgo[3])} a year earlier` : ''}, but ${h.wk(f.longest?.w)} at ${f.longest?.n}. Since a booked test can only move to the three centres nearest it, the first choice of centre deserves as much thought as the date. The finder above lists every centre in the region, with its rate and wait.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const leeds = f.list.filter((c) => /^(Leeds|Horsforth)/.test(c.n));
    const shef = f.list.filter((c) => /^Sheffield/.test(c.n));
    return [
      { q: 'Which Leeds driving test centre has the higher pass rate?', a: `In ${h.yearLabel(h.lastYear)}, ${leeds.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))} of car tests, with a median wait of ${h.wk(c.w)}`).join('; ')}. All ${leeds.length} serve Leeds learners, and ${leeds.filter((c) => h.hasPage(c.id)).length} have their own page on this site with ten years of results. The better choice is the one whose roads you practise on.` },
      { q: 'Which Sheffield test centre is better, Handsworth or Middlewood Road?', a: `${shef.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))} of tests in ${h.yearLabel(h.lastYear)}, with a median wait of ${h.wk(c.w)} in ${h.month(h.lastMonth)}`).join('; ')}. ${shef.every((c) => shef.every((o) => o.id === c.id || c.nb.includes(o.id))) ? 'They are among each other\'s three nearest centres, so a test booked at one can be moved to the other under the 2026 rules.' : 'Check the list of nearest centres before planning a move between them.'}` },
      { q: 'Where is the shortest wait for a driving test in Yorkshire?', a: `Among the larger centres, ${f.shortest?.n} had the shortest median wait in ${h.month(h.lastMonth)}, ${h.wk(f.shortest?.w)}, and ${f.longest?.n} the longest, ${h.wk(f.longest?.w)}. The median is measured on tests already taken. New dates are released every Monday at 6am, 24 weeks ahead, and earlier ones appear when others cancel.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const lgv = f.list.filter((c) => c.lgv);
    return `
<p>The region's testing is spread between the West Yorkshire cities, Sheffield and Rotherham in the south, Hull and the Humber bank, and towns from Scarborough on the coast to Northallerton and Skipton. The busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. ${lgv.length ? `${lgv.map((c) => c.n).join(' and ')} is a lorry test site that also tests cars, and appears in DVSA's car table on its own row. ` : ''}${f.pages.length} centres of the region have their own page here.</p>
${regionTables(h, R, f)}
<h2>A region of near neighbours</h2>
<p>DVSA's own example of the 2026 rule for moving a test runs through South Yorkshire: a test booked at Chesterfield, just over the border in Derbyshire, can first move to Sheffield (Handsworth), Ashfield or Sheffield (Middlewood Road), and from Handsworth on to Rotherham, Middlewood Road or Worksop (${h.src('gov_rules_2026', 'GOV.UK')}). The example shows how a learner can reach a centre two steps away with the two changes a booking allows. The ${h.a('move-driving-test-centre', 'moving a test page')} gives the three options for every centre in the region.</p>
<p>With pass rates this close, the choice of centre in Yorkshire turns more on waits and distance than on the rate. Of the ${f.trendN} larger centres with three years of results, ${f.up} rose; the biggest change was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)} (${h.pts(h.E.trend(f.riser))})` : 'none'}. First attempts passed ${h.pc(f.first)} of the time, ${side(f.first, h.gb.first)} Britain's ${h.pc(h.gb.first)}. Men passed ${h.pc(f.men)} of tests across the region and women ${h.pc(f.women)}, and ${h.pc(f.autoShare, 0)} of tests were in automatic cars.</p>
<p>The coast and the Dales behave differently from the cities. ${h.cl('scarborough', 'Scarborough')}'s three nearest centres, by DVSA's list, are ${h.E.centre('scarborough').nb.map((n) => h.E.centre(n).n).join(', ')}, ${h.E.centre('scarborough').nb.filter((n) => h.E.centre(n).t < 1000).length} of them with fewer than 1,000 tests a year; ${h.cl('skipton', 'Skipton')}'s include Nelson, across the Lancashire border. For a learner in a rural part of the region, the centres open to a move can be a long way from home, which is one more reason to book where you intend to test.</p>
<h2>Lessons and costs</h2>
<p>In DVSA's instructor survey of ${h.P.adiSurvey.fieldwork}, ${h.num(f.price?.[0] ?? 0, 1)} % of Yorkshire and Humber instructors charged £35 or less for an hour, ${h.num(f.price?.[1] ?? 0, 1)} % £36 to £40 and ${h.num(f.price?.[2] ?? 0, 1)} % £41 or more. The ${h.a('cost-of-learning-to-drive', 'cost calculator')} turns a quote into an expected total for any centre, with the fees and the retests that its pass rate implies.</p>
`;
  },
});

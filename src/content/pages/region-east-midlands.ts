import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'East Midlands';
export default definePage({
  id: 'region-east-midlands',
  group: 'regions',
  order: 504,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-west-midlands', 'region-yorkshire-and-the-humber', 'centre-leicester-wigston', 'centre-nottingham-colwick', 'compare-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-east-midlands',
  nav: 'East Midlands',
  card: 'Leicester, Nottingham, Derby and the county towns: rates, waits and trends.',
  title: 'Driving Test Centres in the East Midlands: Rates and Waits',
  description: 'Driving test centres in the East Midlands ranked by DVSA pass rate, with Leicester, Nottingham and Derby beside the county towns, plus each wait and trend.',
  h1: 'Driving test centres in the East Midlands',
  intro: 'All East Midlands centres, highest pass rate first, with the median wait. Type a postcode to search around it.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const y0 = h.E.YEARS[0];
    const ch = ((f.rate ?? 0) - (f.byYear[y0].rate ?? 0)) * 100;
    const k = rankOf(h, R, (x) => ((x.rate ?? 0) - (x.byYear[y0].rate ?? 0)) * 100);
    return `The East Midlands has ${f.list.length} car test centres. They conducted ${h.num(f.tests)} practical tests in ${h.yearLabel(h.lastYear)} and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the ${h.pc(h.gb.rate)} for Great Britain. The regional rate moved by ${h.pts(ch)} since ${h.yearLabel(y0)}, ${k.rank === 1 ? 'the largest rise of any region' : `the ${h.ord(k.rank)} largest change of the ${k.of} regions`}. Within the region the contrast between centres is sharp, even among those a short drive apart: ${f.top[0].n} passed ${h.pp(h.E.rate(f.top[0]))} of tests and ${f.low[0].n} ${h.pp(h.E.rate(f.low[0]))}. The median wait across the East Midlands was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}${f.waitYearAgo ? `, against ${h.wk(f.waitYearAgo[3])} a year before` : ''}. Since a booked test can only move to its three nearest centres, the first choice matters. The finder above lists every centre in the region with its rate and its wait, or those near any postcode.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const lei = f.list.filter((c) => /^Leicester/.test(c.n));
    return [
      { q: 'Which East Midlands test centre has the best pass rate?', a: `${f.top[0].n}, with ${h.pp(h.E.rate(f.top[0]))} of car tests passed in ${h.yearLabel(h.lastYear)}, among centres with at least 1,000 tests. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(f.top[0].w)}. ${f.top[1].n} came second at ${h.pp(h.E.rate(f.top[1]))}. The rate covers all car tests, first attempts and retests together.` },
      { q: 'Which Leicester driving test centre is better?', a: `Leicester has ${lei.length} centres in the DVSA tables. In ${h.yearLabel(h.lastYear)}, ${lei.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))} with a median wait of ${h.wk(c.w)}`).join(', and ')}. The figures cannot tell you which suits you: practise on the roads around the centre you book, since a test can only move to its three nearest centres.` },
      { q: 'What does a driving lesson cost in the East Midlands?', a: `In DVSA's instructor survey of ${h.P.adiSurvey.fieldwork}, ${h.num(f.price?.[1] ?? 0, 1)} % of East Midlands instructors charged £36 to £40 for an hour, ${h.num(f.price?.[0] ?? 0, 1)} % £35 or less and ${h.num(f.price?.[2] ?? 0, 1)} % £41 or more. The survey reports bands of prices, not an average, and asks what instructors charge for a standard hour, not block bookings.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const full = h.F.FULL_CENTRES.filter((c) => c.region === R && c.pass[h.lastYear]);
    const isCity = (n: string) => /^(Leicester|Nottingham|Derby)/.test(n);
    const city = full.filter((c) => isCity(c.name)), other = full.filter((c) => !isCity(c.name));
    const sum = (l: typeof full, k: 0 | 1) => l.reduce((s, c) => s + c.pass[h.lastYear][k], 0);
    const au = (l: typeof full) => l.reduce((s, c) => s + (c.auto?.[0] ?? 0), 0);
    const ct = sum(city, 0), cr = sum(city, 1) / ct, or = sum(other, 1) / sum(other, 0);
    const ca = au(city) / ct, oa = au(other) / sum(other, 0);
    return `
<p>Three cities, Leicester, Nottingham and Derby, account for much of the region's testing, and its busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. Around them sit centres in county towns and on the coast, from Skegness and Boston in Lincolnshire to Buxton in the Peak District and Kettering in Northamptonshire. ${f.pages.length} centres of the region have their own page on this site, with ten years of results, waits month by month and the pass rate by age.</p>
${regionTables(h, R, f)}
<h2>A high rate is not a short queue</h2>
<p>The centre with the region's highest rate, ${h.cl(f.top[0].id, f.top[0].n)}, had a median wait of ${h.wk(f.top[0].w)} in ${h.month(h.lastMonth)}, against ${h.wk(f.wait?.[3])} for the East Midlands as a whole. The longest median among the larger centres was at ${f.longest?.n}, ${h.wk(f.longest?.w)}, and the shortest at ${f.shortest?.n}, ${h.wk(f.shortest?.w)}. A learner choosing on pass rate alone may wait longer for the privilege, and since ${h.date(h.P.rules.nearestThreeFrom)} a test can only move to one of its three nearest centres, so the choice made at the first booking counts.</p>
<p>Rates moved up across most of the region: ${f.up} of the ${f.trendN} larger centres with three years of results rose. The biggest change was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)}, ${h.pts(h.E.trend(f.riser))}` : 'none'}, the weakest at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)}, ${h.pts(h.E.trend(f.faller))}` : 'none'}. DVSA does not explain the movement of any one centre.</p>
<h2>Cities against towns</h2>
<p>The ${h.num(f.spread, 1)}-point spread between the region's highest and lowest larger centres ${cr < or ? 'runs partly along a line between cities and towns' : 'does not follow a simple line between cities and towns'}. The ${city.length} centres in Leicester, Nottingham and Derby passed ${h.pc(cr)} of their ${h.num(ct)} tests in ${h.yearLabel(h.lastYear)}; the region's other centres together passed ${h.pc(or)}. The DVSA tables do not say why, and they do not separate the roads from the candidates: the city centres also took ${h.pc(ca, 0)} of their tests in automatics, against ${h.pc(oa, 0)} elsewhere in the region. Across the East Midlands, ${h.pc(f.first)} of first attempts passed, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}, and men passed ${h.pc(f.men)} of their tests against ${h.pc(f.women)} for women. For any two centres side by side, the ${h.a('compare-driving-test-centres', 'comparison tool')} sets out rate, wait and distance.</p>
`;
  },
});

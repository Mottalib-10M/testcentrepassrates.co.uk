import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'North West';
const CITY = /(Liverpool|Manchester)/;
export default definePage({
  id: 'region-north-west',
  group: 'regions',
  order: 506,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-north-east', 'region-yorkshire-and-the-humber', 'centre-west-didsbury-manchester', 'centre-norris-green-liverpool', 'easiest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-north-west',
  nav: 'North West',
  card: 'Manchester, Liverpool, Lancashire and Cumbria: the widest spread of rates.',
  title: 'Driving Test Centres in the North West: Pass Rates, Waits',
  description: 'Driving test centres in the North West ranked by DVSA pass rate, from Manchester and Liverpool to Lancashire and Cumbria, with each wait and three-year trend.',
  h1: 'Driving test centres in the North West',
  intro: 'Every North West centre with pass rate and wait, highest rate first. Type a postcode to look around a town.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const s = rankOf(h, R, (x) => x.spread);
    return `The North West's ${f.list.length} car test centres conducted ${h.num(f.tests)} practical tests in ${h.yearLabel(h.lastYear)}, ${h.pc(f.share, 0)} of the British total, and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the national ${h.pc(h.gb.rate)}. No single figure describes the region well, because its cities and its rural north test very differently. Its larger centres ranged from ${h.pp(h.E.rate(f.top[0]))} at ${f.top[0].n} to ${h.pp(h.E.rate(f.low[0]))} at ${f.low[0].n}, a spread of ${h.num(f.spread, 1)} points, ${s.rank === 1 ? 'the widest of any region in Britain' : `the ${h.ord(s.rank)} widest of the ${s.of} regions`}. The median wait across the North West was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}. The region's busiest centre, ${f.largest[0].n}, was the ${h.ord(h.E.sorted(h.E.CENTRES, 'tests').findIndex((c) => c.id === f.largest[0].id) + 1)} busiest in Britain. The finder above ranks all the centres of the region by rate and shows each wait; type a postcode to see only those around you.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const liv = h.E.sorted(f.list.filter((c) => /Liverpool/.test(c.n)), 'rate');
    const man = h.E.sorted(f.list.filter((c) => /Manchester/.test(c.n)), 'rate');
    const mf = [...man].filter((c) => c.f != null).sort((a, b) => (b.f as number) - (a.f as number));
    return [
      { q: 'Which Liverpool driving test centre has the highest pass rate?', a: `Of the ${liv.length} centres DVSA names after Liverpool, ${liv[0]?.n} passed the most car tests in ${h.yearLabel(h.lastYear)}, ${h.pp(h.E.rate(liv[0]))}, and ${liv[liv.length - 1]?.n} the fewest, ${h.pp(h.E.rate(liv[liv.length - 1]))}. ${liv.filter((c) => (h.E.rate(c) ?? 0) < h.gb.rate * 100).length} of the ${liv.length} were below the British rate of ${h.pc(h.gb.rate)}. Their waits are in the table on this page.` },
      { q: 'Which Manchester test centre is best for a first test?', a: `By first-attempt pass rate in ${h.yearLabel(h.lastYear)}, ${mf[0]?.n} led the ${man.length} centres DVSA names after Manchester, at ${h.pp(mf[0]?.f)}, and ${mf[mf.length - 1]?.n} came last, at ${h.pp(mf[mf.length - 1]?.f)}. The best choice is still a centre near where you practise, because since June 2026 a booked test can move only to its three nearest centres.` },
      { q: 'Where are the highest pass rates in the North West?', a: `In ${h.yearLabel(h.lastYear)}, among centres with at least 1,000 tests, at ${f.top.map((c) => `${c.n} (${h.pp(h.E.rate(c))})`).join(', ')}. ${f.top.filter((c) => !CITY.test(c.n)).length} of the three are outside the Liverpool and Manchester centres. DVSA does not explain a centre's rate, and its figures mix the roads with the candidates.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const full = h.F.FULL_CENTRES.filter((c) => c.region === R && c.pass[h.lastYear]);
    const tot = (l: typeof full) => l.reduce((s, c) => [s[0] + c.pass[h.lastYear][0], s[1] + c.pass[h.lastYear][1]], [0, 0]);
    const ci = tot(full.filter((c) => CITY.test(c.name))), ot = tot(full.filter((c) => !CITY.test(c.name)));
    const far = full.flatMap((c) => c.near.map(([n, mi]) => ({ c: c.name, mi, to: n }))).reduce((a, b) => (b.mi > a.mi ? b : a), { c: '', mi: 0, to: '' });
    const nCity = full.filter((c) => CITY.test(c.name)).length;
    return `
<p>The region joins two large cities, Manchester and Liverpool, to the towns of Lancashire and Cheshire and the long stretch of Cumbria up to the Scottish border. Its busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. ${f.pages.length} centres in the two cities have their own page here, with ten years of results, monthly waits and pass rates by age and sex.</p>
${regionTables(h, R, f)}
<h2>Two cities and the far north</h2>
<p>The ${nCity} centres that DVSA names after Liverpool or Manchester passed ${h.pc(ci[1] / ci[0])} of ${h.num(ci[0])} tests in ${h.yearLabel(h.lastYear)}; the region's other centres passed ${h.pc(ot[1] / ot[0])}. At the top of the regional ranking sit centres away from the two cities, such as ${f.top.filter((c) => !CITY.test(c.n)).slice(0, 2).map((c) => h.cl(c.id, c.n)).join(' and ')}. The DVSA tables cannot say how much of that comes from the roads and how much from the candidates, but they show the gap is not a matter of retests alone: first attempts passed ${h.pc(f.first)} across the region, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}.</p>
<p>Of the ${f.trendN} larger centres with three years of results, ${f.up} raised their pass rate. The largest rise was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)}, ${h.pts(h.E.trend(f.riser))}` : 'none'}, and the weakest change at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)}, ${h.pts(h.E.trend(f.faller))}` : 'none'}. Men passed ${h.pc(f.men)} of their tests and women ${h.pc(f.women)}; automatics made up ${h.pc(f.autoShare, 0)} of the region's tests.</p>
<h2>Waits across the region</h2>
<p>In ${h.month(h.lastMonth)}, the longest median wait among the larger centres was ${h.wk(f.longest?.w)} at ${f.longest?.n}, and the shortest ${h.wk(f.shortest?.w)} at ${f.shortest?.n}. Around the two cities, a centre's three nearest neighbours are usually close, which makes a move under the 2026 rules practical; in Cumbria the nearest centres can be an hour or more apart by road. DVSA's own list of each centre's nearest centres, with distances, is on every centre page and on the ${h.a('move-driving-test-centre', 'moving a test page')}. A learner in the region who is weighing a quieter centre should check both its wait and its rate in the table, and the ${h.a('compare-driving-test-centres', 'comparison tool')} for distance. A rate earned on a few thousand tests a year at a small Cumbrian centre and one earned on fifteen thousand in Manchester are both real, but the larger one moves less from year to year.</p>
`;
  },
});

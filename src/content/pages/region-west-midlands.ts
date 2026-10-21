import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'West Midlands';
const URBAN = /^(Birmingham|Wolverhampton|Wednesbury|Featherstone|Coventry|Dudley|Stoke)/;
export default definePage({
  id: 'region-west-midlands',
  group: 'regions',
  order: 505,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-east-midlands', 'region-north-west', 'centre-birmingham-garretts-green', 'centre-birmingham-kingstanding', 'hardest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-west-midlands',
  nav: 'West Midlands',
  card: 'Birmingham, the Black Country, Coventry, Stoke and the Marches, centre by centre.',
  title: 'Driving Test Centres in the West Midlands: Rates and Waits',
  description: 'Driving test centres in the West Midlands ranked by DVSA pass rate, from Birmingham and the Black Country to Hereford and Shropshire, with each centre\'s wait.',
  h1: 'Driving test centres in the West Midlands',
  intro: 'The West Midlands centres by pass rate, with their median wait. Type a postcode to see what is within reach.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const r = rankOf(h, R, (x) => x.rate);
    return `The West Midlands' ${f.list.length} car test centres conducted ${h.num(f.tests)} practical tests in ${h.yearLabel(h.lastYear)} and passed ${h.pc(f.rate)} of them, ${side(f.rate, h.gb.rate)} the British ${h.pc(h.gb.rate)}${r.rank === r.of ? ' and the lowest rate of any region' : `, ${h.ord(r.rank)} of the ${r.of} regions`}. That regional figure hides two different pictures, one for the conurbation and one for the rest. ${URBAN.test(f.top[0].n) ? 'The best rates' : 'The best rates, outside the conurbation,'} were ${f.top[0].n} at ${h.pp(h.E.rate(f.top[0]))} and ${f.top[1].n} at ${h.pp(h.E.rate(f.top[1]))}, while ${f.low[0].n} passed ${h.pp(h.E.rate(f.low[0]))} and ${f.low[1].n} ${h.pp(h.E.rate(f.low[1]))}. The median wait across the region was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}. Choosing between them is a matter of where you can practise, since a test can only move to its three nearest centres. The finder above lists every centre, highest rate first, with its wait; type a postcode to narrow it down.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const bham = f.list.filter((c) => /^Birmingham/.test(c.n));
    const best = h.E.sorted(bham, 'rate')[0];
    const low5 = h.E.sorted(f.big, 'rate', true).slice(0, 5).filter((c) => URBAN.test(c.n)).length;
    return [
      { q: 'Which Birmingham driving test centre has the best pass rate?', a: `Of Birmingham's ${bham.length} centres in the DVSA tables, ${best.n} passed the most in ${h.yearLabel(h.lastYear)}, ${h.pp(h.E.rate(best))} of car tests, with a median wait of ${h.wk(best.w)} in ${h.month(h.lastMonth)}. The others ranged down to ${h.pp(h.E.rate(h.E.sorted(bham, 'rate', true)[0]))}. Each has its own row in the table on this page.` },
      { q: 'Why is the West Midlands pass rate so low?', a: `DVSA does not say. The region passed ${h.pc(f.rate)} of tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.rate)} for Britain, and the gap was there on first attempts too: ${h.pc(f.first)} here, ${h.pc(h.gb.first)} nationally. Of the five lowest rates in the region, ${low5} were at centres in Birmingham, the Black Country, Coventry or Stoke.` },
      { q: 'Are driving lessons cheaper in the West Midlands?', a: `By DVSA's survey of ${h.P.adiSurvey.fieldwork}, yes: ${h.num(f.price?.[0] ?? 0, 1)} % of West Midlands instructors charged £35 or less for an hour, the highest share of any region, and only ${h.num(f.price?.[2] ?? 0, 1)} % charged £41 or more. Lower prices per hour do not settle the total cost, which depends mostly on hours.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const gb = rankOf(h, R, (x) => x.largest[0]?.t);
    const urban = f.list.filter((c) => URBAN.test(c.n));
    const full = h.F.FULL_CENTRES.filter((c) => c.region === R && c.pass[h.lastYear]);
    const isU = (n: string) => urban.some((u) => u.n === n);
    const ut = full.filter((c) => isU(c.name)).reduce((s, c) => [s[0] + c.pass[h.lastYear][0], s[1] + c.pass[h.lastYear][1]], [0, 0]);
    const ot = full.filter((c) => !isU(c.name)).reduce((s, c) => [s[0] + c.pass[h.lastYear][0], s[1] + c.pass[h.lastYear][1]], [0, 0]);
    return `
<p>The region's busiest centre in ${h.yearLabel(h.lastYear)} was ${h.cl(f.largest[0].id, f.largest[0].n)}, with ${h.num(f.largest[0].t)} tests${gb.rank === 1 ? ', more than the busiest centre of any other region' : ''}, followed by ${f.largest.slice(1).map((c) => h.cl(c.id, c.n)).join(' and ')}. The conurbation of Birmingham, the Black Country and Coventry holds most of the region's testing; beyond it are Stoke-on-Trent, Worcestershire, Shropshire and Herefordshire, with centres in towns such as Hereford, Ludlow and Telford. ${f.pages.length} Birmingham centres have their own page here.</p>
${regionTables(h, R, f)}
<h2>Conurbation and countryside</h2>
<p>Grouping the ${urban.length} centres of the conurbation and the Potteries (${urban.map((c) => c.n).join(', ')}) shows the split plainly: together they passed ${h.pc(ut[1] / ut[0])} of ${h.num(ut[0])} tests in ${h.yearLabel(h.lastYear)}, while the region's other centres passed ${h.pc(ot[1] / ot[0])}. DVSA's tables cannot say whether the roads, the candidates or both explain it; they record ${h.pc(f.autoShare, 0)} of tests across the region in automatic cars, and men passing ${h.pc(f.men)} against ${h.pc(f.women)} for women. Some urban centres improved: of the ${f.trendN} larger centres with three years of results, ${f.up} rose, the most at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)} (${h.pts(h.E.trend(f.riser))})` : 'none'}.</p>
<h2>Waits and moving a test</h2>
<p>In ${h.month(h.lastMonth)}, the longest median wait among the larger centres was ${h.wk(f.longest?.w)} at ${f.longest?.n} and the shortest ${h.wk(f.shortest?.w)} at ${f.shortest?.n}. Within the conurbation, centres are close together, so the three nearest centres a test may move to are usually a short drive away; in Shropshire and Herefordshire they can be much further. A learner tempted by a rural centre's higher rate should remember that the test there is on roads they may not know, and that only the three nearest centres are open to a move (${h.a('move-driving-test-centre', 'moving a test')}).</p>
<p>Among the region's ${f.small.length ? `${f.small.length} smaller centres, those under 1,000 tests a year, rates can swing widely and are not ranked against the others; ` : ''}larger centres such as ${h.cl(f.largest[0].id, f.largest[0].n)} change more slowly, because each year's figure rests on many thousands of results. That is worth keeping in mind before reading a single year's rise or fall as a trend. Lessons are cheaper here than in the South: see ${h.a('driving-lesson-prices', 'lesson prices by region')}, and the ${h.a('cost-of-learning-to-drive', 'cost calculator')} to add fees and retests for any centre.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf } from '../../lib/region';

const R = 'Scotland';
const ISLANDS = ['isle-of-mull', 'benbecula-island', 'brodick-isle-of-arran', 'isle-of-skye-portree', 'orkney', 'lerwick', 'stornoway', 'rothesay'];
export default definePage({
  id: 'region-scotland',
  group: 'regions',
  order: 510,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-north-east', 'region-north-west', 'driving-test-waiting-times', 'easiest-driving-test-centres', 'theory-test-pass-rates'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey'],
  slug: 'driving-test-centres-scotland',
  nav: 'Scotland',
  card: 'Glasgow, Edinburgh, Aberdeen and 70 more, down to the island centres.',
  title: 'Driving Test Centres in Scotland: Pass Rates and Waits',
  description: 'Driving test centres in Scotland ranked by DVSA pass rate, from Glasgow and Edinburgh to the Highlands and islands, with the median wait at each centre.',
  h1: 'Driving test centres in Scotland',
  intro: 'All Scottish centres, highest pass rate first, with their wait. Type a postcode or a town to see the centres nearest it.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const n = rankOf(h, R, (x) => x.list.length);
    const w = rankOf(h, R, (x) => x.wait?.[3]);
    return `Scotland has ${f.list.length} car test centres, ${n.rank === 1 ? 'more than any English region or Wales' : `${h.ord(n.rank)} most of the ${n.of} regions`}, but most of them are small: ${f.small.length} conducted fewer than 1,000 tests in ${h.yearLabel(h.lastYear)}. In all, Scottish centres conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the British ${h.pc(h.gb.rate)}. Among the ${f.big.length} larger centres, ${f.top[0].n} had the highest rate, ${h.pp(h.E.rate(f.top[0]))}, and ${f.low[0].n} the lowest, ${h.pp(h.E.rate(f.low[0]))}. The Scottish median wait was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}, ${w.rank === 1 ? 'the longest of any region' : `the ${h.ord(w.rank)} longest of ${w.of} regions`}, against ${h.wk(h.gb.wait?.[3])} for Britain. Because the small centres' rates rest on so few tests, this page ranks only the larger ones and lists the rest for reference. The finder above lists every centre, from Glasgow to Lerwick, with its rate and wait.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const gla = h.E.sorted(f.list.filter((c) => /^Glasgow/.test(c.n)), 'rate');
    const edi = h.E.sorted(f.list.filter((c) => /^Edinburgh/.test(c.n)), 'rate');
    return [
      { q: 'Which Glasgow driving test centre has the highest pass rate?', a: `Of the ${gla.length} centres DVSA names after Glasgow, ${gla.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))}`).join(', ')} of car tests in ${h.yearLabel(h.lastYear)}. Nearby Paisley, Bishopbriggs and Hamilton also serve Glasgow learners and appear in the table on this page, each with its median wait for ${h.month(h.lastMonth)}.` },
      { q: 'Which Edinburgh test centre is better, Musselburgh or Currie?', a: `${edi.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))} of tests in ${h.yearLabel(h.lastYear)}, with a median wait of ${h.wk(c.w)}`).join('; ')}. A rate alone does not make a centre better for you; the roads you practise on and the three centres you may move to under the 2026 rules matter as much.` },
      { q: 'Why do small Highland centres have such high pass rates?', a: `Many small Scottish centres show rates far above the national figure, but on very few tests: a centre with 100 tests a year moves by a point with a single result. DVSA does not explain any centre's rate. The table keeps these centres apart from the ranking of the ${f.big.length} centres with at least 1,000 tests.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const full = h.F.FULL_CENTRES.filter((c) => c.region === R && c.pass[h.lastYear]);
    const tot = (l: typeof full) => l.reduce((s, c) => [s[0] + c.pass[h.lastYear][0], s[1] + c.pass[h.lastYear][1]], [0, 0]);
    const sm = tot(full.filter((c) => c.pass[h.lastYear][0] < 1000)), bg = tot(full.filter((c) => c.pass[h.lastYear][0] >= 1000));
    const isl = ISLANDS.filter(h.E.hasCentre).map(h.E.centre);
    const it = isl.reduce((s, c) => s + c.t, 0);
    const longS = h.E.sorted(f.list.filter((c) => c.w != null), 'wait').slice(0, 3);
    return `
<p>Scottish testing is centred on the Central Belt: the busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. Beyond it, DVSA keeps centres in towns and villages across the Highlands, the Borders and the islands, some of which conduct only a few dozen tests a year. The ${isl.length} island centres in the table, from ${isl.slice(0, 3).map((c) => c.n).join(', ')} to ${isl[isl.length - 1]?.n}, conducted ${h.num(it)} tests between them.</p>
${regionTables(h, R, f)}
<h2>Two Scotlands in the figures</h2>
<p>The ${f.small.length} centres with fewer than 1,000 tests passed ${h.pc(sm[1] / sm[0])} of their ${h.num(sm[0])} tests in ${h.yearLabel(h.lastYear)}, while the ${f.big.length} larger centres passed ${h.pc(bg[1] / bg[0])} of ${h.num(bg[0])}. The gap is large, and its causes are not in the tables: DVSA publishes no explanation, and on so few tests a small centre's rate can swing a long way from one year to the next. The ranking on this page therefore compares the larger centres with each other, and lists the small ones in the same table for reference.</p>
<p>Among the larger centres, the ${h.num(f.spread, 1)}-point gap runs from ${f.top.map((c) => h.cl(c.id, c.n)).join(', ')} at the top to ${f.low.map((c) => h.cl(c.id, c.n)).join(', ')} at the bottom. ${f.up} of the ${f.trendN} with three years of results rose. First attempts passed ${h.pc(f.first)} of the time across Scotland, ${side(f.first, h.gb.first)} Britain's ${h.pc(h.gb.first)}; men passed ${h.pc(f.men)} of their tests and women ${h.pc(f.women)}; ${h.pc(f.autoShare, 0)} of tests were in automatics.</p>
<h2>Long queues, long distances</h2>
<p>Only ${h.pp(f.wait?.[4])} of Scottish tests in ${h.month(h.lastMonth)} had been booked within seven weeks. The longest medians that month were at ${longS.map((c) => `${c.n} (${h.wk(c.w)})`).join(', ')}, though at small centres a median rests on few tests. In the Highlands and islands, the three nearest centres a test may move to under the 2026 rules can be a ferry or a long drive away, so the first booking matters a great deal. The ${h.a('move-driving-test-centre', 'moving a test page')} lists each centre's options with DVSA's distances, and the ${h.a('driving-test-waiting-times', 'waiting times page')} compares the queues across Britain.</p>
<p>In DVSA's survey, ${h.num(f.price?.[2] ?? 0, 1)} % of Scottish instructors charged £41 or more for an hour and ${h.num(f.price?.[0] ?? 0, 1)} % £35 or less (${h.a('driving-lesson-prices', 'lesson prices by region')}). For the whole bill, fees and retests included, use the ${h.a('cost-of-learning-to-drive', 'cost calculator')} with the Scottish centre you plan to book.</p>
`;
  },
});

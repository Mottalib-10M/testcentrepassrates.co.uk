import { definePage } from '../../lib/guide-types';
import { regionFacts, regionTables, side, rankOf, gbAutoShare } from '../../lib/region';

const R = 'Wales';
export default definePage({
  id: 'region-wales',
  group: 'regions',
  order: 509,
  tool: { kind: 'finder', props: { region: R, sort: 'rate' } },
  related: ['region-south-west', 'region-west-midlands', 'region-north-west', 'centre-cardiff-llanishen', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_data', 'gov_adi_survey', 'gov_test_car'],
  slug: 'driving-test-centres-wales',
  nav: 'Wales',
  card: 'From Cardiff and Swansea to Bangor and Brecon: rates, waits and the D plates.',
  title: 'Driving Test Centres in Wales: Pass Rates and Waiting Times',
  description: 'Driving test centres in Wales ranked by DVSA pass rate, from Cardiff, Swansea and Newport to Bangor, Brecon and Aberystwyth, with each median wait and trend.',
  h1: 'Driving test centres in Wales',
  intro: 'All the car test centres in Wales, highest pass rate first, with their median wait. Type a postcode to search near it.',
  resume: (h) => {
    const f = regionFacts(h, R);
    const w = rankOf(h, R, (x) => (x.wait ? -x.wait[3] : null));
    const ys = h.E.YEARS;
    return `Wales had ${f.list.length} car test centres in ${h.yearLabel(h.lastYear)}, which conducted ${h.num(f.tests)} practical tests and passed ${h.pc(f.rate)}, ${side(f.rate, h.gb.rate)} the British rate of ${h.pc(h.gb.rate)}. The Welsh rate was ${h.pc(f.byYear[ys[1]].rate)} the year before, so it ${(f.rate ?? 0) < (f.byYear[ys[1]].rate ?? 0) ? 'fell' : 'rose'} in the latest year. Waits are where Wales stands out: the median across Wales was ${h.wk(f.wait?.[3])} for tests taken in ${h.month(h.lastMonth)}, ${w.rank === 1 ? 'the shortest of any region' : `the ${h.ord(w.rank)} shortest of ${w.of} regions`}, against ${h.wk(h.gb.wait?.[3])} for Britain. The highest rates among the larger centres were at ${f.top[0].n} (${h.pp(h.E.rate(f.top[0]))}) and ${f.top[1].n}; the lowest at ${f.low[0].n}, ${h.pp(h.E.rate(f.low[0]))}. ${w.rank <= 3 ? 'Shorter queues make Wales one of the easier places in Britain to get a test date, though not at every centre. ' : 'Queues differ a great deal from one Welsh centre to the next, so the regional figure is only a starting point. '}The finder above lists every Welsh centre with its pass rate and its median wait, or the centres near a postcode you type.`;
  },
  faqs: (h) => {
    const f = regionFacts(h, R);
    const cdf = h.E.sorted(f.list.filter((c) => /^(Cardiff|Llantrisant|Newport|Barry)/.test(c.n)), 'rate');
    return [
      { q: 'Which Cardiff area driving test centre has the best pass rate?', a: `Around Cardiff, ${cdf.map((c) => `${c.n} passed ${h.pp(h.E.rate(c))}`).join(', ')} of car tests in ${h.yearLabel(h.lastYear)}, by DVSA's figures. The waits in ${h.month(h.lastMonth)} are in the table on this page. Pick the centre whose roads you can practise on; a test can later move only to its three nearest centres.` },
      { q: 'Do you need D plates or L plates for a driving test in Wales?', a: 'Either. GOV.UK says a car used for the test must carry L-plates, or "L" or "D" plates in Wales, on the front and the rear. D stands for dysgwr, Welsh for learner. The other rules for using your own car, such as an extra mirror for the examiner and insurance for the test, are the same as in England and Scotland.' },
      { q: 'Is it quicker to get a driving test in Wales?', a: `Usually. The Welsh median wait was ${h.wk(f.wait?.[3])} in ${h.month(h.lastMonth)}, against ${h.wk(h.gb.wait?.[3])} for Britain, and ${h.pp(f.wait?.[4])} of Welsh tests that month had been booked within seven weeks. Some rural centres had longer queues: the longest median among the larger centres was ${h.wk(f.longest?.w)} at ${f.longest?.n}.` },
    ];
  },
  body: (h) => {
    const f = regionFacts(h, R);
    const a = rankOf(h, R, (x) => x.autoShare);
    const s = h.E.sorted(f.list, 'tests', true).slice(0, 3);
    const far = h.F.FULL_CENTRES.filter((c) => c.region === R).flatMap((c) => c.near.map(([n, mi]) => ({ c: c.name, mi, to: n }))).reduce((x, y) => (y.mi > x.mi ? y : x), { c: '', mi: 0, to: '' });
    return `
<p>Testing in Wales is concentrated in the south: the busiest centres in ${h.yearLabel(h.lastYear)} were ${f.largest.map((c) => h.cl(c.id, c.n)).join(', ')}. The rest of the country is served by smaller centres in market and coastal towns, from Bangor and Pwllheli in the north-west to Brecon, Abergavenny and Monmouth in the east and Cardigan and Pembroke Dock in the west. The three smallest, ${s.map((c) => `${c.n} (${h.num(c.t)} tests)`).join(', ')}, have rates that can move a long way on a handful of results.</p>
${regionTables(h, R, f)}
<h2>What sets Wales apart</h2>
<p>Three figures stand out against the rest of Britain. First, the queue: Wales had ${h.wk(f.wait?.[3])} of median wait against ${h.wk(h.gb.wait?.[3])} nationally in ${h.month(h.lastMonth)}. Second, the car: only ${h.pc(f.autoShare, 0)} of Welsh tests were in automatics, against ${h.pc(gbAutoShare(h), 0)} for Britain, ${a.rank === a.of ? 'the lowest share of any region' : `${h.ord(a.of - a.rank + 1)} lowest of ${a.of}`}. Third, first attempts: ${h.pc(f.first)} passed, ${side(f.first, h.gb.first)} the British ${h.pc(h.gb.first)}. Men passed ${h.pc(f.men)} of their tests and women ${h.pc(f.women)}.</p>
<p>The ${h.num(f.spread, 1)}-point gap between ${f.top[0].n} and ${f.low[0].n} is wide for a small country. The capital's main centre, ${h.cl('cardiff-llanishen', 'Cardiff (Llanishen)')}, passed ${h.pp(h.E.rate(h.E.centre('cardiff-llanishen')))} of its tests, ${side(h.E.rate(h.E.centre('cardiff-llanishen')), (f.rate ?? 0) * 100)} the Welsh rate of ${h.pc(f.rate)}. Of the ${f.trendN} larger centres with three years of results, ${f.up} rose; the largest change was at ${f.riser ? `${h.cl(f.riser.id, f.riser.n)} (${h.pts(h.E.trend(f.riser))})` : 'none'} and the weakest at ${f.faller ? `${h.cl(f.faller.id, f.faller.n)} (${h.pts(h.E.trend(f.faller))})` : 'none'}.</p>
<h2>Practical points for Welsh learners</h2>
<p>A car used for the test in Wales may carry "L" or "D" plates front and rear (${h.src('gov_test_car', 'GOV.UK')}). Distances between centres are long in mid and north Wales, so the three nearest centres a test may move to under the 2026 rules can be far apart: DVSA lists ${far.to}, ${h.num(far.mi)} miles away, among the nearest centres of ${far.c}; the ${h.a('move-driving-test-centre', 'moving a test page')} lists them with DVSA's distances. Lessons in Wales sit mostly in the £36 to £40 band, ${h.num(f.price?.[1] ?? 0, 1)} % of instructors in DVSA's survey (${h.a('driving-lesson-prices', 'lesson prices by region')}).</p>
<p>With waits this short at many Welsh centres, the 2026 limit of ${h.P.rules.changesAllowed} changes per booking can bite less than where queues are long: a learner who fails may rebook within weeks rather than months, subject to the ${h.P.rules.retestWorkingDays} working days that must pass before a retest. The ${h.a('driving-test-booking-rules-2026', '2026 booking rules')} page covers refunds and swaps, and the ${h.a('cost-of-learning-to-drive', 'cost calculator')} adds up fees and lessons for a Welsh centre.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

export default definePage({
  id: 'hardest-driving-test-centres',
  group: 'rates',
  order: 110,
  tool: { kind: 'mini:compare', props: { a: 'wolverhampton', b: 'dudley' } },
  related: ['easiest-driving-test-centres', 'compare-driving-test-centres', 'region-west-midlands', 'driving-test-faults', 'pass-rate-by-attempt'],
  sources: ['dvsa_pass_centre', 'dvsa_data', 'gov_nearest'],
  slug: 'hardest-driving-test-centres',
  nav: 'Hardest test centres',
  card: 'The lowest pass rates of Britain, and how they compare with their neighbours.',
  title: `Hardest Driving Test Centres ${YL}: Lowest Pass Rates`,
  description: `Hardest driving test centres in Britain for ${YL}: the lowest DVSA pass rates among busy centres, compared with the centre next door, and why they sit so low.`,
  h1: 'Hardest driving test centres: the lowest pass rates',
  intro: 'Pick two centres to set them side by side: pass rate, first attempts, wait, size and the distance between them.',
  resume: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate', true);
    const lowR = [...h.E.REGIONS].sort((a, b) => (h.regionRate(a) ?? 1) - (h.regionRate(b) ?? 1))[0];
    const wm = h.E.inRegion(lowR).filter((c) => c.t >= 1000);
    const wmLow = big.slice(0, 10).filter((c) => c.r === lowR).length;
    return `The hardest driving test centre in Great Britain in ${h.yearLabel(h.lastYear)}, among centres with at least 1,000 car tests, was ${big[0].n}: only ${h.pp(h.E.rate(big[0]))} of its ${h.num(big[0].t)} tests ended in a pass, against ${h.pc(h.gb.rate)} nationally. ${big[1].n} (${h.pp(h.E.rate(big[1]))}) and ${big[2].n} (${h.pp(h.E.rate(big[2]))}) followed. ${wmLow} of the ten lowest rates were in ${lowR === 'London' || lowR === 'Wales' || lowR === 'Scotland' ? lowR : `the ${lowR}`}, the region with the lowest average, ${h.pc(h.regionRate(lowR))}; it has ${wm.length} centres with 1,000 tests or more. A low rate is not proof of strict examiners: these centres also test more repeat candidates and more people who learned later in life. The comparison above sets any two centres side by side, with their first-attempt rates, waits and the distance between them, so you can see what booking a few miles away would change for you.`;
  },
  faqs: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate', true);
    const lowFirst = h.E.CENTRES.filter((c) => c.t >= 1000 && c.f != null).sort((a, b) => (a.f as number) - (b.f as number))[0];
    return [
      { q: 'What is the hardest driving test centre in the UK?', a: `On the ${h.yearLabel(h.lastYear)} DVSA figures, ${big[0].n}, with a pass rate of ${h.pp(h.E.rate(big[0]))} over ${h.num(big[0].t)} tests. Only centres with at least 1,000 tests are ranked here, since a small centre's rate can fall by ten points on a few bad days. Northern Ireland, run by the DVA, is not in the DVSA tables.` },
      { q: 'Which test centre has the lowest first-time pass rate?', a: `${lowFirst.n}, where ${h.pp(lowFirst.f)} of first attempts passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.first)} nationally. First-attempt rates remove the effect of repeat candidates, so they are a fairer test of a centre than the overall rate; the first-time page ranks every busy centre on that measure.` },
      { q: 'Are examiners stricter at centres with low pass rates?', a: 'Nothing in the DVSA tables shows that. What the tables do show is that low rates go with busy urban roads, more candidates on a third or later attempt and more candidates in their late twenties and thirties. Those differences in who takes the test explain part of the gap between two centres, and the roads the rest.' },
      { q: 'Can I avoid a hard centre by moving my test?', a: 'Only to one of the three centres DVSA lists as nearest the one you booked, under the rules in force since 9 June 2026, and each move counts as one of your two changes. If your nearest centres all have low rates, the useful lever is preparation on their roads rather than distance.' },
    ];
  },
  body: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate', true);
    const low = big.slice(0, 20);
    const pairs = low.slice(0, 8).map((c) => {
      const nb = c.nb.filter(h.E.hasCentre).map(h.E.centre).filter((x) => h.E.rate(x) != null).sort((a, b) => (h.E.rate(b) as number) - (h.E.rate(a) as number))[0];
      return [h.cl(c.id), h.pp(h.E.rate(c)), nb ? h.cl(nb.id) : 'n/a', nb ? h.pp(h.E.rate(nb)) : 'n/a', nb ? h.num(h.E.miles(c.en, nb.en)) : 'n/a'];
    });
    const fallers = [...h.E.CENTRES.filter((c) => c.t >= 1000 && h.E.trend(c) != null)].sort((a, b) => (h.E.trend(a) as number) - (h.E.trend(b) as number)).slice(0, 5);
    const urban = low.filter((c) => ['London', 'West Midlands', 'North West'].includes(c.r)).length;
    return `
<h2>The twenty lowest pass rates among busy centres</h2>
<p>Every centre in this table ran at least 1,000 car tests in ${h.yearLabel(h.lastYear)}. ${urban} of the twenty are in London, the West Midlands or the North West. Waits are shown too, because a hard centre with a short queue lets a candidate who fails retake sooner.</p>
${h.centreTable(low, `Centres with 1,000 tests or more, ${h.yearLabel(h.lastYear)}, lowest pass rate first. Wait: median weeks, ${h.month(h.lastMonth)}.`)}
<h2>The way out: the best of the three nearest centres</h2>
<p>Under the 2026 booking rules a test can move only to the three centres DVSA lists as nearest (${h.src('gov_nearest', 'DVSA list')}). For the eight hardest centres, this table shows the best of those three, and how far it is. Where the gap is small, the neighbour serves the same kind of candidates on similar roads, and moving buys little; where it is wide, it may be worth taking lessons on both sets of roads before choosing where to book.</p>
${h.table(['Hard centre', 'Rate', 'Best of its 3 nearest', 'Rate', 'Miles'], pairs, `Pass rates ${h.yearLabel(h.lastYear)}. Straight-line distance between the two centres.`, ['l', 'r', 'l', 'r', 'r'])}
<h2>Why a rate falls so low</h2>
<p>DVSA publishes no explanation by centre, but its tables point to the candidates. Nationally, first attempts passed ${h.pc(h.E.attemptRate(1))} of the time in ${h.yearLabel(h.lastYear)} and sixth or later attempts ${h.pc(h.E.attemptRate(6))}; a centre where many people are on a third or fourth try starts several points down. Age adds to it: candidates of 17 passed ${h.pc(h.E.ageRate(17))}, those of 30 ${h.pc(h.E.ageRate(30))}. Then come the roads, where busy junctions and lane changes give an examiner more moments to record a serious fault. The national list of the most common faults, led by observation at junctions, is on the ${h.a('driving-test-faults', 'faults page')}.</p>
<h2>Centres where the rate fell</h2>
<p>A falling rate is a better warning than a low one. The steepest drops between ${h.yearLabel(h.E.YEARS[0])} and ${h.yearLabel(h.lastYear)} among busy centres were at ${fallers.map((c) => `${h.cl(c.id)} (${h.pts(h.E.trend(c))})`).join(', ')}, while the national rate moved by ${h.pts(Math.round((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 1000) / 10)}.</p>
<h2>Reading a low rate</h2>
<p>Even at ${big[0].n}, ${h.pp(h.E.rate(big[0]))} of candidates passed on the day. What changes the odds most is not on any table: lessons on the centre's own roads, a mock test with an instructor and booking when you are ready rather than when a slot appears. The ${h.a('pass-rate-by-attempt', 'attempts calculator')} shows how quickly the chance of having passed builds up even at a hard centre, and the ${h.a('easiest-driving-test-centres', 'highest pass rates page')} the other end of the list. Every rate here comes from table DRT122A of the ${h.src('dvsa_pass_centre', 'DVSA statistics')}.</p>
`;
  },
});

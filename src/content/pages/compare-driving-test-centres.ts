import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'compare-driving-test-centres',
  group: 'booking',
  order: 320,
  tool: { kind: 'mini:compare', props: { a: 'wood-green-london', b: 'tottenham' } },
  related: ['move-driving-test-centre', 'easiest-driving-test-centres', 'driving-test-waiting-times', 'first-time-pass-rates', 'driving-test-pass-rates-by-year'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_nearest', 'os_codepoint'],
  slug: 'compare-driving-test-centres',
  nav: 'Compare two centres',
  card: 'Two centres side by side: pass rate, first attempts, wait, volume and distance.',
  title: 'Compare Driving Test Centres: Pass Rates and Waits by Pair',
  description: 'Compare driving test centres side by side: pass rate, first-attempt rate, median wait, tests a year and distance, from DVSA data, with how big a gap really is.',
  h1: 'Compare two driving test centres',
  intro: 'Choose two centres: the calculator sets their pass rates, first attempts, waits, volume and distance side by side.',
  resume: (h) => {
    const pairs = h.E.CENTRES.filter((c) => c.t >= 1000 && h.E.rate(c) != null).flatMap((c) => c.nb.filter((n) => h.E.hasCentre(n) && h.E.centre(n).t >= 1000 && h.E.rate(h.E.centre(n)) != null).map((n) => Math.abs((h.E.rate(c) as number) - (h.E.rate(h.E.centre(n)) as number))));
    const big = pairs.filter((x) => x >= 10).length;
    return `Comparing two driving test centres means setting the same DVSA figures side by side: the pass rate of all car tests in ${h.yearLabel(h.lastYear)}, the first-attempt rate, the median weeks between booking and test in ${h.month(h.lastMonth)}, and the number of tests, which says how much weight the rate can carry. Neighbouring centres often differ more than learners expect: of the ${h.num(pairs.length)} pairings of a centre with one of its three nearest centres, both with at least 1,000 tests, ${h.num(big)} showed a gap of 10 points or more. But rates also move from year to year: half of the larger centres moved by more than ${h.num(h.E.SWING, 1)} points between the last two years, so a smaller gap says little. The calculator above compares any two centres in Britain.`;
  },
  faqs: (h) => [
    { q: 'Is it worth choosing a test centre with a higher pass rate?', a: `Only if the gap is large and lasting, and the centre is one you can reach and practise around. A centre's rate reflects who tests there as much as its roads. Half of the larger centres moved by more than ${h.num(h.E.SWING, 1)} points in a year, so check the three-year trend before deciding, and remember a booked test can only move to the three nearest centres.` },
    { q: 'Why do two nearby centres have different pass rates?', a: `DVSA does not say. The figures do not separate the effect of routes from that of candidates: age, experience, the share of automatic tests and how many people book before they are ready all differ between centres. Nationally, candidates aged 17 passed ${h.pc(h.E.ageRate(17))} of tests in ${h.yearLabel(h.lastYear)} and those aged 30 ${h.pc(h.E.ageRate(30))}, so a centre's mix of ages alone can move its rate.` },
    { q: 'How far apart are the centres in the comparison?', a: 'The distance is a straight line between the postcodes of the two centres, computed from Ordnance Survey grid references. It is not a driving distance and will be shorter than the route by road. DVSA\'s list of nearest centres uses its own measure, which is why this site keeps DVSA\'s miles on each centre\'s page.' },
  ],
  body: (h) => {
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && h.E.rate(c) != null);
    const pairs: { a: typeof big[number]; b: typeof big[number]; d: number }[] = [];
    const seen = new Set<string>();
    for (const c of big) for (const n of c.nb) {
      if (!h.E.hasCentre(n)) continue;
      const o = h.E.centre(n);
      const key = [c.id, o.id].sort().join('|');
      if (o.t < 1000 || h.E.rate(o) == null || seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a: c, b: o, d: (h.E.rate(c) as number) - (h.E.rate(o) as number) });
    }
    const top = [...pairs].sort((x, y) => Math.abs(y.d) - Math.abs(x.d)).slice(0, 12).map(({ a, b, d }) => {
      const [hi, lo] = d >= 0 ? [a, b] : [b, a];
      return [h.cl(hi.id), h.pp(h.E.rate(hi)), h.cl(lo.id), h.pp(h.E.rate(lo)), h.pts(Math.abs(d)), h.num(h.E.miles(hi.en, lo.en), 0)];
    });
    const small = big.filter((c) => c.t < 2000).length;
    const s = h.C('wood-green-london'), t = h.C('tottenham');
    return `
<h2>What to look at, in order</h2>
<ol>
<li><strong>Whether you may test there.</strong> Since ${h.date(h.P.rules.nearestThreeFrom)}, a booked test can only move to the three centres nearest the one booked. Comparing a centre you cannot reach with your booking is of little use (${h.a('move-driving-test-centre', 'moving a test')}).</li>
<li><strong>The size of the gap.</strong> A gap smaller than the usual yearly swing, ${h.num(h.E.SWING, 1)} points, may not last into next year.</li>
<li><strong>The number of tests.</strong> ${h.num(small)} of the centres with 1,000 tests or more held fewer than 2,000; at that size a few dozen results move the rate by a point.</li>
<li><strong>The first-attempt rate.</strong> It sets aside repeat candidates: nationally, sixth and later attempts passed ${h.pc(h.E.attemptRate(6))} of the time in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.E.attemptRate(1))} for first attempts.</li>
<li><strong>The wait.</strong> A higher rate several months further away may cost more lessons than it saves.</li>
</ol>
<h2>The widest gaps between neighbouring centres</h2>
<p>Each pair below is a centre and one of the three centres DVSA lists as nearest to it, both with at least 1,000 tests in ${h.yearLabel(h.lastYear)}. Distances are straight lines between the centres' postcodes.</p>
${h.table(['Higher rate', 'Rate', 'Lower rate', 'Rate', 'Gap', 'Miles'], top, `Car practical tests, ${h.yearLabel(h.lastYear)}. DVSA table DRT122A and list of nearest centres.`, ['l', 'r', 'l', 'r', 'r', 'r'])}
<h2>An example: ${s.name} and ${t.name}</h2>
<p>${h.cl('wood-green-london', s.name)} passed ${h.pc(s.rate)} of its tests in ${h.yearLabel(h.lastYear)} and ${h.cl('tottenham', t.name)} ${h.pc(t.rate)}, a gap of ${h.pts(Math.abs(((s.rate ?? 0) - (t.rate ?? 0)) * 100))}. Their median waits in ${h.month(h.lastMonth)} were ${h.wk(s.wait?.median)} and ${h.wk(t.wait?.median)}. The calculator above starts on this pair; change either centre to compare any two.</p>
<h2>What a comparison cannot tell you</h2>
<p>DVSA publishes results by centre, not by route, examiner or time of day, and it does not publish routes at all. Nothing in the tables separates a centre's roads from its candidates. A centre near a university or a large town draws different learners from a rural one, and automatic tests passed ${h.pc(h.gb.auto)} of the time nationally against ${h.pc(h.gb.rate)} for all tests, so the share of automatics shifts a centre's rate for reasons that have nothing to do with its junctions. The fairest use of the comparison is to choose between centres you can genuinely practise around, then book the one whose wait suits the date you will be ready.</p>
<p>Pass rates come from the ${h.src('dvsa_pass_centre', 'DVSA pass rate by centre')} table, waits from the ${h.src('dvsa_waits', 'monthly waiting table')}, nearest centres from ${h.src('gov_nearest', 'GOV.UK')}, and positions from ${h.src('os_codepoint', 'OS Code-Point Open')}.</p>
`;
  },
});

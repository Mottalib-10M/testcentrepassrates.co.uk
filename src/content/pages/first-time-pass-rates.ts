import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

export default definePage({
  id: 'first-time-pass-rates',
  group: 'rates',
  order: 130,
  tool: { kind: 'mini:first', props: { centre: 'birmingham-garretts-green' } },
  related: ['pass-rate-by-attempt', 'easiest-driving-test-centres', 'driving-test-faults', 'pass-rate-by-age-and-sex', 'cost-of-learning-to-drive'],
  sources: ['dvsa_pass_centre', 'dvsa_data', 'gov_faults'],
  slug: 'first-time-driving-test-pass-rates',
  nav: 'First-time pass rates',
  card: 'How often candidates pass at the first attempt, by centre, and with no fault at all.',
  title: `First-Time Driving Test Pass Rates ${YL} by Test Centre`,
  description: `First-time driving test pass rates for ${YL} at every car test centre in Britain, the national rate since 2007 and the first attempts passed with zero faults.`,
  h1: 'First-time driving test pass rates by centre',
  intro: 'Choose a centre to see how often first attempts passed there, against all attempts and the national figure.',
  resume: (h) => {
    const F = h.E.NATIONAL.first as Record<string, [number, number, number]>;
    const f = F[h.lastYear];
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && c.f != null).sort((a, b) => (b.f as number) - (a.f as number));
    return `In ${h.yearLabel(h.lastYear)}, ${h.pc(f[1] / f[0])} of first attempts at the car practical test in Great Britain ended in a pass: ${h.num(f[1])} out of ${h.num(f[0])} candidates taking the test for the first time, according to DVSA. That is ${f[1] / f[0] > h.gb.rate ? 'slightly above' : 'slightly below'} the rate of all tests, ${h.pc(h.gb.rate)}, because repeat candidates pass less often. Only ${h.num(f[2])} first-time candidates, ${h.pc(f[2] / f[0], 1)}, passed with no driving fault at all. Between centres the first-time rate varies from ${h.pp(big[big.length - 1].f)} at ${big[big.length - 1].n} to ${h.pp(big[0].f)} at ${big[0].n}, among centres with at least 1,000 tests. Choose a centre above to see its own first-attempt rate, its rate over all attempts and the number of its first-time candidates who drove without a single fault. A first-time rate is the fairest single figure for comparing two centres, because it leaves out the candidates who are retaking.`;
  },
  faqs: (h) => {
    const F = h.E.NATIONAL.first as Record<string, [number, number, number]>;
    const f = F[h.lastYear];
    return [
      { q: 'What percentage of people pass their driving test first time?', a: `${h.pc(f[1] / f[0])} in Great Britain in ${h.yearLabel(h.lastYear)}, on ${h.num(f[0])} first attempts, from DVSA table DRT122C. Put the other way, about ${h.pc(1 - f[1] / f[0], 0)} of first-time candidates had to book again. The rate differs a lot by centre and by age; seventeen-year-olds do far better than candidates in their thirties.` },
      { q: 'How many people pass with zero faults?', a: `${h.num(f[2])} first-time candidates passed without a single recorded driving fault in ${h.yearLabel(h.lastYear)}, ${h.pc(f[2] / f[0], 1)} of first attempts. A pass allows up to ${h.P.rules.maxDrivingFaults} driving faults and no serious or dangerous fault, so a clean sheet is rare. DVSA publishes the count for each centre, shown in the calculator above.` },
      { q: 'Is the first-time rate a better way to compare centres?', a: 'Usually, yes. The overall rate mixes first attempts with retakes, and centres where many candidates are on their third or fourth try look harder than they are. The first-time rate compares like with like, though it still reflects the age of candidates and how ready they were when they booked.' },
    ];
  },
  body: (h) => {
    const F = h.E.NATIONAL.first as Record<string, [number, number, number]>;
    const ys = Object.keys(F);
    const big = h.E.CENTRES.filter((c) => c.t >= 1000 && c.f != null).sort((a, b) => (b.f as number) - (a.f as number));
    const row = (c: (typeof big)[number]) => [h.cl(c.id), c.r, h.pp(c.f), h.pp(h.E.rate(c)), c.z == null ? 'n/a' : h.num(c.z)];
    const gapCentres = big.filter((c) => h.E.rate(c) != null && (c.f as number) > (h.E.rate(c) as number)).length;
    return `
<h2>Highest and lowest first-time rates</h2>
<p>These lists keep centres with 1,000 tests or more in the year. The column of all attempts shows how much repeat candidates pull a centre's overall rate down or up: at ${gapCentres} of the ${big.length} busy centres, first attempts did better than the average of all attempts.</p>
${h.table(['Centre', 'Region', 'First attempt', 'All attempts', 'Zero-fault passes'], big.slice(0, 12).map(row), `Highest first-time pass rates, ${h.yearLabel(h.lastYear)}. DVSA table DRT122C.`, ['l', 'l', 'r', 'r', 'r'])}
${h.table(['Centre', 'Region', 'First attempt', 'All attempts', 'Zero-fault passes'], big.slice(-12).reverse().map(row), `Lowest first-time pass rates, ${h.yearLabel(h.lastYear)}.`, ['l', 'l', 'r', 'r', 'r'])}
<h2>The national first-time rate since 2007</h2>
<p>DVSA has counted first attempts since ${h.yearLabel(ys[0])}. The number passing with no fault has grown far faster than the number of candidates, from ${h.num(F[ys[0]][2])} in ${h.yearLabel(ys[0])} to ${h.num(F[h.lastYear][2])} in ${h.yearLabel(h.lastYear)}, which suggests better-prepared candidates or more consistent recording; the tables do not say which.</p>
${h.table(['Year', 'First attempts', 'Passed', 'Rate', 'With zero faults'], [...ys].reverse().slice(0, 10).map((y) => [h.yearLabel(y), F[y][0], F[y][1], h.pc(F[y][1] / F[y][0]), F[y][2]]), 'First attempts at the car practical test, Great Britain. DVSA table DRT122C summary.', ['l', 'r', 'r', 'r', 'r'])}
<h2>What decides a first attempt</h2>
<p>The single biggest factor in the tables is age. Nationally, candidates aged 17 passed ${h.pc(h.E.ageRate(17))} of all their tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.E.ageRate(25))} at 25. The tables do not split age by attempt, but one likely reason is that older candidates are more often retaking. The ${h.a('pass-rate-by-age-and-sex', 'age and sex estimate')} applies that profile to a centre of your choice.</p>
<p>The second factor is readiness. A first attempt booked months ahead to secure a slot, and kept even when lessons fell behind, has lower odds; under the 2026 rules only two changes are allowed per booking, so the date chosen at the start matters more than before. The ${h.a('pass-rate-by-attempt', 'attempts calculator')} shows how the chance of having passed builds over two, three or four tries at a given centre.</p>
<h2>Fifteen faults, and none serious</h2>
<p>The marking is the same at every centre. GOV.UK sets the pass mark at no more than ${h.P.rules.maxDrivingFaults} driving faults and no serious or dangerous fault (${h.src('gov_faults', 'GOV.UK, faults and your result')}). A single serious fault ends the chance of a pass, however clean the rest of the drive, one reason a centre's rate can depend on the situations its roads create: each busy junction is a moment where one lapse of observation becomes the deciding fault. The most frequent of them nationally are listed on the ${h.a('driving-test-faults', 'faults page')}, led by observation at junctions and the use of mirrors when changing direction.</p>
<p>A zero-fault pass is not a separate grade: the certificate is the same as for a pass with fourteen faults. The count is still a useful sign of a centre's candidates. Where many first-timers drive a clean test, the candidates tend to arrive well prepared, and the first-time rate is usually high too.</p>
<p>All figures come from table DRT122C of the ${h.src('dvsa_pass_centre', 'DVSA statistics by centre')}, published once a year for the year ending in March.</p>
`;
  },
});

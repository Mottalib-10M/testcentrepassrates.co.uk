import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'wood-green-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 602,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-tottenham', 'centre-barnet-london', 'region-london', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'wood-green-driving-test-centre',
  nav: 'Wood Green',
  card: 'Wood Green car tests in N22: rate, age profile, wait and the Tottenham option.',
  title: `Wood Green Driving Test Centre: ${YL} Pass Rate, Wait`,
  description: `Wood Green driving test centre in N22: car pass rate for ${YL}, results by age, the latest monthly wait and how Tottenham, Barnet and Enfield compare.`,
  h1: 'Wood Green driving test centre: pass rate, ages and wait',
  intro: 'A car-only centre on Lordship Lane, N22, two miles from Tottenham, with its results read year by year and age by age.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `Wood Green driving test centre recorded a pass rate of ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}, from ${h.num(c.tests)} car tests and ${h.num(c.passes)} passes. Set against Great Britain (${h.pc(h.gb.rate)}) the centre is ${c.rate! >= h.gb.rate ? 'level or ahead' : 'behind'}, and against all London centres together (${h.pc(c.regionRate)}) it is ${c.rate! >= (c.regionRate ?? 0) ? 'ahead' : 'behind'} as well${c.rate! >= h.gb.rate !== c.rate! >= (c.regionRate ?? 0) ? ', so the two comparisons point in different directions' : ''}. Its rank is ${h.ord(c.rankRegion)} among ${c.ofRegion} London centres with 300 tests or more. The three-year movement is ${h.pts(t)}, ${t > 0 ? 'an improvement' : t < 0 ? 'a decline' : 'no change'} from ${h.pp(c.l.p[0])}. ${c.wait ? `Turning to the wait, tests taken in ${h.month(c.wait.month)} had a median of ${h.wk(c.wait.median)} between booking and test day; the British median that month was ${h.wk(h.gb.wait?.[3])} and London's ${h.wk(c.regionWait?.[3])}${c.waitYearAgo != null ? `, and Wood Green itself stood at ${h.wk(c.waitYearAgo)} twelve months before` : ''}.` : 'No recent DVSA waiting figure is available for Wood Green.'} First attempts passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally. Rates and waits are reloaded each month from DVSA, and the finder above places the centre among its neighbours.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const tot = c.near.find((n) => n.id === 'tottenham');
    return [
      { q: 'Is Tottenham easier than Wood Green for a driving test?', a: `${tot ? `Tottenham, ${h.num(tot.miles)} miles away and on the DVSA list of nearest centres, passed ${h.pp(tot.rate)} of car tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(c.rate)} at Wood Green, ${(tot.rate ?? 0) > (c.rate ?? 0) * 100 ? 'so a higher share of candidates passed there' : 'so it did not do better'}. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(tot.wait)} against ${h.wk(c.wait?.median)} at Wood Green.` : 'Tottenham is no longer on the DVSA list of centres nearest to Wood Green, so a test cannot be moved there under the 2026 rules.'} The numbers describe past candidates, not a promise.` },
      { q: 'What tests are held at Wood Green test centre?', a: `GOV.UK lists Wood Green for ${c.types} tests. Its address is ${c.addr.join(', ')}. Lorry, bus and motorcycle candidates from north London are tested at other sites. DVSA does not publish the routes used on test, so practice should cover the general mix of roads around the centre rather than a fixed circuit.` },
      { q: 'Do younger learners pass more often at Wood Green?', a: `In ${h.yearLabel(h.lastYear)}, 17-year-olds at Wood Green passed ${h.pc(c.age['17'])} of their tests and ${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const o = ks[ks.length - 1]; return `${o}-year-olds ${h.pc(c.age[o])}`; })()}. Across Great Britain, 17-year-olds passed ${h.pc(h.E.ageRate(17))}. DVSA publishes these results by age for each centre in table DRT122D, and the full age table sits on this page.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const peak = ys.reduce((a, y) => (f.pass[y][0] > f.pass[a][0] ? y : a));
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const oldest = ages[ages.length - 1];
    const drop = ((c.age['17'] ?? 0) - (c.age[oldest] ?? 0)) * 100;
    const gbDrop = ((h.E.ageRate(17) ?? 0) - (h.E.ageRate(Number(oldest)) ?? 0)) * 100;
    const ms = h.F.months(f);
    const last12 = ms.slice(-12);
    const over10 = last12.filter((k) => (f.wait[k][0] ?? 0) > 10).length;
    const near = c.near;
    const quickest = near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const top = near.filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    return `
<h2>${(c.trend3 ?? 0) >= 0 ? 'Climbing' : 'Slipping'} since ${h.yearLabel(ys[ys.length - 3])}</h2>
<p>The rate at Wood Green stood at ${h.pp(c.l.p[0])} three years ago and at ${h.pc(c.rate)} in the latest year, a net change of ${h.pts(c.trend3)}. Over the same years the share of passes across Britain moved from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. Volume has not been steady either: the busiest year in the DVSA series was ${h.yearLabel(peak)}, with ${h.num(f.pass[peak][0])} tests, while ${h.yearLabel(h.lastYear)} counted ${h.num(c.tests)}. The table gives each year with its own national benchmark, which is the fairer way to read a single centre's movement.</p>
${h.yearTable(ID)}
<h2>${drop > 0 ? 'Results fall away with age' : 'Older candidates hold up'}</h2>
<p>Wood Green's age profile is ${drop > gbDrop ? 'steeper' : 'flatter'} than the national one. Seventeen-year-olds passed ${h.pc(c.age['17'])}, ${oldest}-year-olds ${h.pc(c.age[oldest])}: a spread of ${h.pts(Math.abs(drop)).replace('+', '')} from the youngest to the oldest group shown, where Britain as a whole shows ${h.pts(Math.abs(gbDrop)).replace('+', '')} between the same two ages. Each age band here holds only a few hundred tests, so a point or two between neighbouring ages means little.</p>
${h.ageTable(ID)}
<p>The split by sex runs ${(c.m ?? 0) >= (c.fem ?? 0) ? 'in favour of men' : 'in favour of women'}: ${h.pc(c.m)} for male candidates, ${h.pc(c.fem)} for female ones. First attempts succeeded ${h.pc(c.first)} of the time, and automatic-car candidates passed ${h.pc(c.auto)}, with automatics making up ${h.pc(c.autoShare, 0)} of all tests. For the national picture behind these splits, see ${h.a('pass-rate-by-age-and-sex', 'pass rates by age and sex')}.</p>
<h2>The booking queue in N22</h2>
<p>${over10 ? `In ${h.num(over10)} of the last ${h.num(last12.length)} months the median wait at Wood Green exceeded ten weeks.` : `In none of the last ${h.num(last12.length)} months did the median wait at Wood Green exceed ten weeks.`} ${c.wait ? `The latest month, ${h.month(c.wait.month)}, came in at ${h.wk(c.wait.median)}, with ${h.pp(c.wait.in7)} of tests booked inside seven weeks.` : ''} ${c.cancel ? `Over the year DVSA itself cancelled ${h.num(c.cancel.total)} tests at the centre, ${h.num(c.cancel.medical)} through examiner illness and ${h.num(c.cancel.leave)} through leave or training; those slots are offered again to other learners.` : ''} The national ${h.a('driving-test-waiting-times', 'waiting-time tracker')} sets these figures against every other centre.</p>
<h2>${near.map((n) => short(n.name)).join(', ')}: the permitted moves</h2>
<p>The 2026 booking rules let a learner move a Wood Green test only to ${near.map((n) => `${n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name)} (${h.num(n.miles)} miles)`).join(', ')}. ${top ? `Of the three, ${short(top.name)} had the highest rate in ${h.yearLabel(h.lastYear)}, ${h.pp(top.rate)}${(top.rate ?? 0) > (c.rate ?? 0) * 100 ? `, ${h.pts((top.rate ?? 0) - (c.rate ?? 0) * 100)} above Wood Green` : ', still not above Wood Green'}.` : ''} ${quickest ? `${short(quickest.name)} had the shortest median wait in ${h.month(h.lastMonth)}, ${h.wk(quickest.wait)}.` : ''} A move counts as one of the changes allowed on the booking, so it is worth checking both columns before using it.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA car pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times by centre')}, and ${h.src('gov_nearest', 'the GOV.UK list of nearest centres')} for the three alternatives.</p>
`;
  },
});

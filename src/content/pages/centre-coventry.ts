import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'coventry';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 651,
  tool: { kind: 'finder', props: { centre: ID, radius: 18 } },
  related: ['region-west-midlands', 'first-time-pass-rates', 'hardest-driving-test-centres', 'theory-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'coventry-driving-test-centre',
  nav: 'Coventry',
  card: 'Coventry pass rate, first attempts, yearly volumes and its 3 nearest centres.',
  title: `Coventry Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Coventry driving test centre: car pass rate for ${YL}, first-time results, yearly volumes, results by age, the monthly wait and the 3 nearest centres.`,
  h1: 'Coventry driving test centre: pass rate and waiting time',
  intro: 'Bayton Road Industrial Estate, CV7: the Coventry car centre, with its first-time results, its yearly volumes and the three centres DVSA lists nearby.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const prev = c.years[c.years.length - 2];
    const growth = c.tests / Math.max(1, c.f.pass[prev][0]) - 1;
    const gbMed = h.gb.wait?.[3];
    return `Coventry passed ${h.pc(c.rate)} of car tests in ${Y}, against ${h.pc(h.gb.rate)} for Great Britain and ${h.pc(c.regionRate)} for the West Midlands, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the region with at least 300 tests. The number of tests ${growth >= 0 ? 'rose' : 'fell'} from ${h.num(c.f.pass[prev][0])} in ${h.yearLabel(prev)} to ${h.num(c.tests)}, ${h.pc(Math.abs(growth), 0)} ${growth >= 0 ? 'more' : 'fewer'}, while the rate moved from ${h.pc(c.rateOf(prev))} to ${h.pc(c.rate)}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally.${c.auto != null ? ` Automatic candidates passed ${h.pc(c.auto)}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)} the median Coventry test had been booked ${h.wk(c.wait.median)} ahead, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'no longer than'} the British ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'No wait was published for Coventry in the latest month.'} Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. The tables below give the five-year series, the results at each age from 17 to 25, and the three centres DVSA lets a Coventry booking move to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const nu = c.near.find((n) => n.id === 'nuneaton');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Coventry');
    return [
      { q: 'Is Nuneaton easier than Coventry for a driving test?', a: nu ? `On the ${Y} figures Nuneaton passed ${h.pp(nu.rate)} of car tests and Coventry ${h.pc(c.rate)}, so ${(nu.rate ?? 0) > c.rate! * 100 ? 'Nuneaton' : 'Coventry'} had the higher rate. Nuneaton is ${h.num(nu.miles)} miles away and on Coventry's DVSA list, so a booking can be moved there; its median wait in ${h.month(h.lastMonth)} was ${h.wk(nu.wait)}.` : `Nuneaton is not on the current DVSA list of nearest centres for Coventry, so a booking cannot be moved there. The three listed centres are in the table on this page.` },
      { q: 'What share of Coventry candidates pass at the first attempt?', a: `${h.pc(c.first)} of first attempts at Coventry succeeded in ${Y}, from ${h.num(c.firstTests)} first tests, against ${h.pc(h.gb.first)} across Great Britain. ${h.num(c.zero)} of those first-time passes came with no driving fault at all. The national figures by attempt show that the chance of passing tends to change with each further try.` },
      { q: 'What is the Coventry theory test pass rate?', a: th ? `The Coventry theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, according to DVSA's theory tables, against ${h.pc(h.gb.theory)} nationally. The theory test costs £${h.num(h.P.fees.theory)} and the practical test £${h.num(h.P.fees.practicalWeekday)} on a weekday or £${h.num(h.P.fees.practicalEvening)} in the evening or at weekends.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test costs £${h.num(h.P.fees.theory)}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const busiest = ys.reduce((a, y) => (c.f.pass[y][0] > c.f.pass[a][0] ? y : a), ys[0]);
    const firstGap = ((c.first ?? 0) - h.gb.first) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const below = ages.filter((k) => (c.age[k] ?? 0) < (h.E.ageRate(Number(k)) ?? 0)).length;
    const higher = c.near.filter((n) => n.rate != null && (n.rate as number) > c.rate! * 100);
    const months = h.F.months(c.f).slice(-12);
    const vals = months.map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = vals.reduce((a, x) => (x.v < a.v ? x : a), vals[0]);
    const prevM = months[months.length - 2];
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Coventry');
    return `
<h2>Volumes and the rate since ${h.yearLabel(ys[0])}</h2>
<p>${busiest === h.lastYear ? `${Y} was Coventry's busiest year in the series, with ${h.num(c.tests)} car tests.` : `Coventry's busiest year was ${h.yearLabel(busiest)}, with ${h.num(c.f.pass[busiest][0])} tests.`} The first year of the table, ${h.yearLabel(ys[0])}, had ${h.num(c.f.pass[ys[0]][0])} tests at ${h.pc(c.rateOf(ys[0]))}. ${c.tests > c.f.pass[ys[ys.length - 2]][0] * 1.3 ? `The latest year brought ${h.pc(c.tests / c.f.pass[ys[ys.length - 2]][0] - 1, 0)} more tests than the one before. A rise of that size can change who is being tested, though the tables cannot say whether it played a part in the latest rate.` : 'Volumes in the latest two years were of a similar order.'} The last column gives the British figure for each year.</p>
${h.yearTable(ID)}
<h2>First attempts at Coventry</h2>
<p>The first-time pass rate here was ${h.num(Math.abs(Math.round(firstGap * 10) / 10))} points ${firstGap < 0 ? 'below' : 'above'} the national one: ${h.pc(c.first)} against ${h.pc(h.gb.first)}. ${h.num(c.firstTests)} candidates sat their first test at Coventry in ${Y}, ${h.pc(c.firstTests / Math.max(1, c.tests), 0)} of all tests. ${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)} and manual ones ${h.pp(c.l.mn)}.` : ''} The ${h.a('first-time-pass-rates', 'first-time pass rate ranking')} places every centre on this measure.</p>
<h2>Age and sex</h2>
<p>In ${below === ages.length ? `all ${ages.length}` : `${below} of the ${ages.length}`} ages DVSA publishes for Coventry, the rate was below the national rate for that age. Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} nationally${c.age['25'] != null ? `, and twenty-five-year-olds ${h.pc(c.age['25'])} against ${h.pc(h.E.ageRate(25))}` : ''}. Each age rests on far fewer tests than the centre total, so the table is best read as a whole. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}.</p>
${h.ageTable(ID)}
<h2>Coventry in the West Midlands</h2>
<p>Among the ${c.ofRegion} West Midlands centres with at least 300 tests, Coventry ranked ${h.ord(c.rankRegion)} on pass rate in ${Y}, and among the ${c.ofGB} British centres with at least 1,000 tests it ranked ${h.ord(c.rankGB)}. The ${h.a('hardest-driving-test-centres', 'hardest centres list')} shows the lowest rates nationally. ${c.cancel ? `Examiners cancelled ${h.num(c.cancel.total)} Coventry tests over the year: ${h.num(c.cancel.medical)} for illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather.` : ''} GOV.UK gives the address as ${c.addr.join(', ')} and lists these tests: ${c.types}.</p>
<h2>Waits and the three nearest centres</h2>
<p>${c.wait ? `The median wait was as short as ${h.wk(lo.v)} in ${h.month(lo.k)}; in ${h.month(c.wait.month)} it stood at ${h.wk(c.wait.median)}, against ${h.wk(c.f.wait[prevM][0] as number)} the month before${c.waitYearAgo != null ? ` and ${h.wk(c.waitYearAgo)} a year earlier` : ''}, while ${h.pp(c.wait.in7)} of that month's candidates had booked within seven weeks.` : 'DVSA has not published recent waits for Coventry.'} DVSA's nearest centres are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${higher.length === c.near.length ? `All three had a higher ${Y} pass rate than Coventry.` : higher.length === 0 ? `None had a higher ${Y} pass rate than Coventry.` : `${higher.map((n) => n.name).join(' and ')} had a higher ${Y} pass rate than Coventry.`} ${th ? `The Coventry theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests, per the ${h.src('dvsa_theory_centre', 'DVSA theory tables')}.` : ''}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

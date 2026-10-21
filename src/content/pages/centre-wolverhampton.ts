import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'wolverhampton';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 652,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-west-midlands', 'hardest-driving-test-centres', 'automatic-driving-test-pass-rates', 'pass-rate-by-age-and-sex', 'cost-of-learning-to-drive'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'wolverhampton-driving-test-centre',
  nav: 'Wolverhampton',
  card: 'Wolverhampton pass rate, the automatic and sex gaps, the wait and 3 nearby centres.',
  title: `Wolverhampton Driving Test Centre: Pass Rate ${YL}`,
  description: `Wolverhampton driving test centre: ${YL} car pass rate, manual and automatic results, women and men, each age, the monthly wait and the 3 nearest centres.`,
  h1: 'Wolverhampton driving test centre: pass rate and waiting time',
  intro: 'Spring Road Industrial Estate, WV4: the Wolverhampton centre for cars and motorcycles, read through its gearbox gap, its sex gap and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    const bottom = c.rankGB > c.ofGB * 0.9;
    return `${c.rankGB === c.ofGB ? 'No British test centre with 1,000 tests or more had a lower pass rate than Wolverhampton' : bottom ? `Wolverhampton is among the lowest-scoring test centres in Great Britain` : `Wolverhampton sits ${h.ord(c.rankGB)} of ${c.ofGB} British centres on pass rate`}: ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests were passed in ${Y}, against ${h.pc(h.gb.rate)} nationally and ${h.pc(c.regionRate)} across the West Midlands. ${bottom && c.rankGB !== c.ofGB ? `Of the ${c.ofGB} centres with at least 1,000 tests it ranks ${h.ord(c.rankGB)}, counting from the highest.` : c.rankGB === c.ofGB ? `That places it last of the ${c.ofGB} centres DVSA reports with at least 1,000 tests.` : ''} Within its region it is ${c.rankRegion === c.ofRegion ? `last of ${c.ofRegion}` : `${h.ord(c.rankRegion)} of ${c.ofRegion}`}. Over three years the rate moved by ${h.pts(c.trend3)}. Two gaps are worth a look in the detail: ${c.auto != null ? `automatic candidates passed ${h.pc(c.auto)} against ${h.pp(c.l.mn)} in manual cars` : 'no automatic figure was published'}, and men passed ${h.pc(c.m)} against ${h.pc(c.fem)} for women. ${c.wait ? `For tests in ${h.month(c.wait.month)} the median booking had been made ${h.wk(c.wait.median)} ahead, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'no longer than'} the British ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : 'No wait was published for the latest month.'} The tables give each year, each age and the three alternatives.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const du = c.near.find((n) => n.id === 'dudley');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Wolverhampton');
    return [
      { q: 'What lies behind the Wolverhampton pass rate?', a: `DVSA does not give reasons for a centre's rate. Its tables show that Wolverhampton's ${h.pc(c.rate)} in ${Y} came with a first-time rate of ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and an automatic rate of ${h.pc(c.auto)}, against ${h.pc(h.gb.auto)}. A centre's rate reflects its candidates and their preparation as well as the test.` },
      { q: 'Should I move my Wolverhampton test to Dudley?', a: du ? `Dudley is on Wolverhampton's DVSA list, ${h.num(du.miles)} miles away. It passed ${h.pp(du.rate)} of car tests in ${Y}, against ${h.pc(c.rate)} here, and its median wait in ${h.month(h.lastMonth)} was ${h.wk(du.wait)} against ${h.wk(c.wait?.median)}. A move uses one of the ${h.P.rules.changesAllowed} changes on a booking and can only be made by the learner, on GOV.UK.` : `Dudley is not on the current DVSA list of nearest centres for Wolverhampton, so a test cannot be moved there. The three listed centres are in the table on this page.` },
      { q: 'What is the theory test pass rate in Wolverhampton?', a: th ? `The Wolverhampton theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, according to DVSA's theory tables, against ${h.pc(h.gb.theory)} across Great Britain. Both tests together cost at least £${h.num(h.P.fees.theory + h.P.fees.practicalWeekday)} at the first attempt, before any lessons, and each retake of either test is paid again in full.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test costs £${h.num(h.P.fees.theory)}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const nat = h.E.NATIONAL;
    const gbManual = (nat.practical[h.lastYear].t[1] - nat.auto[h.lastYear][1]) / (nat.practical[h.lastYear].t[0] - nat.auto[h.lastYear][0]);
    const gap = (c.l.mn ?? 0) - (c.l.a ?? 0);
    const gbGap = (gbManual - h.gb.auto) * 100;
    const sex = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const gbSex = (h.gb.m - h.gb.f) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const shortfall = ages.map((k) => ((h.E.ageRate(Number(k)) ?? 0) - (c.age[k] ?? 0)) * 100);
    const avgShort = shortfall.reduce((a, x) => a + x, 0) / Math.max(1, shortfall.length);
    const low = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Wolverhampton');
    return `
<h2>The gearbox gap</h2>
<p>${c.auto != null ? `Automatic candidates at Wolverhampton passed ${h.pc(c.auto)} in ${Y}, manual candidates ${h.pp(c.l.mn)}: ${h.num(Math.round(gap * 10) / 10)} points apart, against about ${h.num(Math.round(gbGap * 10) / 10)} points between the two groups nationally. Automatics made up ${h.pc(c.autoShare, 0)} of tests here. The ${h.a('automatic-driving-test-pass-rates', 'automatic pass rates page')} compares every centre on this measure. The tables do not record how many lessons each group took, so the gap describes results, not the cars.` : `DVSA published no automatic figure for Wolverhampton in ${Y}.`}</p>
<h2>Men and women</h2>
<p>Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, a gap of ${h.num(Math.abs(Math.round(sex * 10) / 10))} points ${sex > 0 ? 'in favour of men' : 'in favour of women'}. Across Great Britain the gap was ${h.num(Math.abs(Math.round(gbSex * 10) / 10))} points${Math.abs(sex) > Math.abs(gbSex) * 2 ? ', so it is more than twice as wide here' : ''}. Nationally women passed ${h.pc(h.gb.f)} and men ${h.pc(h.gb.m)}. First-time candidates at Wolverhampton passed ${h.pc(c.first)}, and ${h.num(c.zero)} of them passed without any recorded fault.</p>
<h2>Each age against the national rate</h2>
<p>On average across the ${ages.length} ages published, Wolverhampton's rate was ${h.num(Math.abs(Math.round(avgShort * 10) / 10))} points ${avgShort > 0 ? 'below' : 'above'} the national rate for the same age. Seventeen-year-olds passed ${h.pc(c.age['17'])} against ${h.pc(h.E.ageRate(17))} nationally, and they took ${h.num(c.f.age['17']?.[0] ?? 0)} of the centre's tests. ${ys.length > 1 ? `The weakest year of the five-year series was ${h.yearLabel(low)}, at ${h.pc(c.rateOf(low))}; the first, ${h.yearLabel(ys[0])}, recorded ${h.pc(c.rateOf(ys[0]))} on ${h.num(c.f.pass[ys[0]][0])} tests.` : ''}</p>
${h.ageTable(ID)}
${h.yearTable(ID)}
<h2>What a low rate costs</h2>
<p>As a rough guide, if every attempt had Wolverhampton's ${Y} pass rate, a learner would need about ${h.num(Math.round((1 / Math.max(0.01, c.rate!)) * 10) / 10)} practical tests on average to pass, against about ${h.num(Math.round((1 / h.gb.rate) * 10) / 10)} at the British rate. At £${h.num(h.P.fees.practicalWeekday)} per weekday test, that is roughly £${h.num(Math.round(h.P.fees.practicalWeekday / Math.max(0.01, c.rate!)))} in test fees here against £${h.num(Math.round(h.P.fees.practicalWeekday / h.gb.rate))} at the national rate. This is a simple estimate, not a DVSA figure; the ${h.a('cost-of-learning-to-drive', 'cost of learning to drive')} page adds lessons and the theory test. ${c.wait ? `Each retake also means a new wait: the median in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}.` : ''}</p>
<h2>${c.near.map((n) => n.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>DVSA lists ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')} as the nearest centres. Their ${Y} rates run from ${h.pp(ranked[ranked.length - 1]?.rate)} at ${ranked[ranked.length - 1]?.name} to ${h.pp(ranked[0]?.rate)} at ${ranked[0]?.name}. ${ranked.filter((n) => (n.rate as number) > c.rate! * 100).length === c.near.length ? 'All three passed a larger share of candidates than Wolverhampton.' : ''} ${c.cancel ? `At Wolverhampton itself, examiners cancelled ${h.num(c.cancel.total)} tests in the year, ${h.num(c.cancel.weather)} of them for weather.` : ''} ${th ? `The Wolverhampton theory centre's ${Y} rate, from the ${h.src('dvsa_theory_centre', 'DVSA theory tables')}, was ${h.pc(h.E.theoryRate(th))}.` : ''}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

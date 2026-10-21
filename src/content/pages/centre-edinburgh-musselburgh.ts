import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'edinburgh-musselburgh';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 647,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-scotland', 'centre-edinburgh-currie', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times', 'compare-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'edinburgh-musselburgh-driving-test-centre',
  nav: 'Edinburgh (Musselburgh)',
  card: 'Musselburgh pass rate by age, the wait, Currie and the 3 nearest centres.',
  title: `Edinburgh Musselburgh Test Centre: Pass Rate ${YL}`,
  description: `Edinburgh Musselburgh driving test centre: ${YL} car pass rate by age and sex, the monthly wait, Edinburgh's centres compared and the 3 centres nearby.`,
  h1: 'Edinburgh (Musselburgh) driving test centre: pass rate and wait',
  intro: 'Newhailes Industrial Estate, EH21: one of the two Edinburgh centres in the DVSA tables, with cars, motorcycles and instructor tests.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const cu = h.C('edinburgh-currie');
    const gbMed = h.gb.wait?.[3];
    return `Musselburgh is the ${c.rate! > cu.rate! ? 'higher-scoring' : 'lower-scoring'} of the ${h.E.CENTRES.filter((x) => x.n.startsWith('Edinburgh (')).length === 2 ? 'two' : h.E.CENTRES.filter((x) => x.n.startsWith('Edinburgh (')).length} Edinburgh test centres in the DVSA tables: ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests were passed in ${Y}, against ${h.pc(cu.rate)} at Currie. Scotland as a whole passed ${h.pc(c.regionRate)} and Great Britain ${h.pc(h.gb.rate)}; Musselburgh came ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the first and ${c.rate! > h.gb.rate ? 'above' : 'below'} the second, ${h.ord(c.rankRegion)} of ${c.ofRegion} Scottish centres with 300 tests or more. The three-year change was ${h.pts(c.trend3)}, against ${h.pts((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 100)} for Great Britain. ${c.wait ? `${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'Booking far ahead is the price' : 'The wait is moderate'}: the median test in ${h.month(c.wait.month)} had been booked ${h.wk(c.wait.median)} in advance, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'no longer than'} the British ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'DVSA published no wait for Musselburgh in the latest month.'} The page then breaks the results down by age, from seventeen-year-olds to twenty-five-year-olds, and lists the three centres a test can move to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const cu = h.C('edinburgh-currie');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Edinburgh');
    return [
      { q: 'Musselburgh or Currie: which Edinburgh test centre passes more?', a: `In ${Y} Musselburgh passed ${h.pc(c.rate)} and Currie ${h.pc(cu.rate)}, so ${c.rate! > cu.rate! ? 'Musselburgh' : 'Currie'} was ahead. The median waits in ${h.month(h.lastMonth)} were ${h.wk(c.wait?.median)} and ${h.wk(cu.wait?.median)}. ${c.near.some((n) => n.id === 'edinburgh-currie') ? `Currie is on Musselburgh's DVSA list, ${h.num(c.near.find((n) => n.id === 'edinburgh-currie')?.miles ?? 0)} miles away, so a booking can move between them.` : ''}` },
      { q: 'Do older learners pass less at Musselburgh?', a: c.age['25'] == null ? `DVSA published no figure for twenty-five-year-olds at Musselburgh in ${Y}; seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} nationally. Each age at a single centre rests on a few hundred tests or fewer, so one age can move several points from one year to the next.` : `At ${h.pc(c.age['25'])}, twenty-five-year-olds had ${(c.age['25'] ?? 0) < (c.age['17'] ?? 0) ? 'a lower' : 'a higher'} rate than seventeen-year-olds, who passed ${h.pc(c.age['17'])} in ${Y}. The national rates for those ages were ${h.pc(h.E.ageRate(25))} and ${h.pc(h.E.ageRate(17))}. Each age at Musselburgh rests on a few hundred tests or fewer, so a single age can move several points from one year to the next.` },
      { q: 'What is the theory test pass rate in Edinburgh?', a: th ? `The Edinburgh theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, according to DVSA's theory tables, against ${h.pc(h.gb.theory)} across Great Britain. The theory test costs £${h.num(h.P.fees.theory)} on GOV.UK and must be passed before a practical test at Musselburgh can be booked.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test must be passed before a practical test at Musselburgh can be booked.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const top = ages.reduce((a, k) => ((c.age[k] ?? 0) > (c.age[a] ?? 0) ? k : a), ages[0]);
    const bot = ages.reduce((a, k) => ((c.age[k] ?? 1) < (c.age[a] ?? 1) ? k : a), ages[0]);
    const spread = ((c.age[top] ?? 0) - (c.age[bot] ?? 0)) * 100;
    const gbSpread = ((h.E.ageRate(Number(top)) ?? 0) - (h.E.ageRate(Number(bot)) ?? 0)) * 100;
    const ys = c.years;
    const peakT = ys.reduce((a, y) => (c.f.pass[y][0] > c.f.pass[a][0] ? y : a), ys[0]);
    const near = c.near.filter((n) => n.rate != null && n.wait != null);
    const both = near.filter((n) => (n.rate as number) > c.rate! * 100 && (n.wait as number) < (c.wait?.median ?? 0));
    const wv = h.F.months(c.f).slice(-12).map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = wv.reduce((a, x) => (x.v < a.v ? x : a), wv[0]);
    const hi = wv.reduce((a, x) => (x.v > a.v ? x : a), wv[0]);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Edinburgh');
    return `
<h2>Youngest and oldest candidates</h2>
<p>The best age at Musselburgh in ${Y} was ${top}, at ${h.pc(c.age[top])}, and the weakest ${bot}, at ${h.pc(c.age[bot])}: a spread of ${h.num(Math.round(spread * 10) / 10)} points. Nationally the same two ages are ${h.num(Math.round(Math.abs(gbSpread) * 10) / 10)} points apart, so the spread here is ${spread > gbSpread + 3 ? 'wider than the national one' : spread < gbSpread - 3 ? 'narrower than the national one' : 'similar to the national one'}. Women passed ${h.pc(c.fem)} and men ${h.pc(c.m)}. The figures by age are small, so read the shape of the column rather than any single line, and see the ${h.a('pass-rate-by-age-and-sex', 'national analysis by age')} for the larger picture.</p>
${h.ageTable(ID)}
<h2>${peakT === h.lastYear ? 'The busiest year yet' : 'Fewer tests than at the peak'}</h2>
<p>${peakT === h.lastYear ? `${Y} was Musselburgh's busiest year in the series, with ${h.num(c.tests)} tests.` : `Musselburgh's busiest year in the series was ${h.yearLabel(peakT)}, with ${h.num(c.f.pass[peakT][0])} car tests; ${Y} brought ${h.num(c.tests)}.`} The rate went from ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} to ${h.pc(c.rate)}. First attempts passed ${h.pc(c.first)}, and ${h.num(c.zero)} first-time candidates finished with no recorded fault. ${c.auto != null ? `Automatic tests, ${h.pc(c.autoShare, 0)} of the total, passed ${h.pc(c.auto)}.` : ''} ${th ? `For the earlier theory step, the ${h.src('dvsa_theory_centre', 'DVSA theory tables')} give the Edinburgh theory centre ${h.pc(h.E.theoryRate(th))}.` : ''}</p>
<h2>Six months of waiting times</h2>
<p>${c.wait ? `The latest median wait was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. Scotland's median in ${h.month(h.lastMonth)} was ${h.wk(c.regionWait?.[3])}. Over the last twelve months the Musselburgh figure ranged from ${h.wk(lo.v)} in ${h.month(lo.k)} to ${h.wk(hi.v)} in ${h.month(hi.k)}, ${hi.v - lo.v < 6 && lo.v > (h.gb.wait?.[3] ?? 99) ? 'a narrow band, so the queue has stayed above the latest British median throughout rather than in one bad month' : hi.v - lo.v < 6 ? 'a narrow band' : 'a wide band'}. When the first-tenth column reads ${h.P.rules.releaseWeeksAhead} weeks, the earliest slots of that month went as soon as DVSA released them.` : 'DVSA has not published recent waits for Musselburgh.'} ${c.cancel ? `Examiners cancelled ${h.num(c.cancel.total)} tests in ${Y}: ${h.num(c.cancel.medical)} for illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather.` : ''} GOV.UK lists these tests at the centre: ${c.types}.</p>
${h.waitTable(ID, 6)}
<h2>${c.near.map((n) => n.name.replace('Edinburgh (', '').replace(')', '')).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>These are the three centres on DVSA's list for Musselburgh: ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${near.map((n) => `${n.name.replace('Edinburgh (', '').replace(')', '')} combined a ${h.pp(n.rate)} pass rate with a median wait of ${h.wk(n.wait)}`).join('; ')}. ${both.length ? `${both.map((n) => n.name).join(' and ')} beat Musselburgh on both counts, at ${both.map((n) => `${h.num(n.miles)} miles`).join(' and ')} from it.` : 'None of them beat Musselburgh on both rate and wait.'} The ${h.a('compare-driving-test-centres', 'comparison tool')} lines them up with any other centre.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

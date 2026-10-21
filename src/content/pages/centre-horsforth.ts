import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'horsforth';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 636,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-yorkshire-and-the-humber', 'centre-leeds-colton-mill', 'theory-test-pass-rates', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'horsforth-driving-test-centre',
  nav: 'Leeds (Horsforth)',
  card: 'Horsforth pass rate by age and sex, the wait, and the Leeds theory centre.',
  title: `Leeds Horsforth Driving Test Centre: Pass Rate ${YL}`,
  description: `Leeds Horsforth driving test centre: ${YL} car pass rate, women, men and 17-year-olds, the monthly wait, the Leeds theory centre and 3 nearby centres.`,
  h1: 'Horsforth (Leeds) driving test centre: pass rate and wait',
  intro: 'Woodside House, Low Lane, LS18: the north-west Leeds centre, read through its results by sex, by age and by month of booking.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    const womenAhead = (c.fem ?? 0) > (c.m ?? 0);
    return `${womenAhead ? `Women outperformed men at Horsforth in ${Y}, ${h.pc(c.fem)} against ${h.pc(c.m)}, ${h.gb.m > h.gb.f ? 'the reverse of the national pattern' : 'in line with the national pattern'}` : `Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)} at Horsforth in ${Y}`}, and the centre as a whole passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests. The British rate was ${h.pc(h.gb.rate)} and the Yorkshire and the Humber rate ${h.pc(c.regionRate)}, so Horsforth was ${c.rate! > h.gb.rate ? 'above' : 'below'} the first and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the second, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the region with 300 tests or more. Compared with ${h.yearLabel(h.E.YEARS[0])}, the rate moved by ${h.pts(c.trend3)}. ${c.wait ? `The median wait for a test in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'no longer than'} the British ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of tests had been booked inside seven weeks.` : 'DVSA published no wait for Horsforth in the latest month.'} Though named Horsforth in the DVSA tables, the centre has a Leeds address on GOV.UK, which is why it is listed with the Leeds centres.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Leeds');
    const tr = th ? h.E.theoryRate(th) : null;
    const cm = h.C('leeds-colton-mill');
    return [
      { q: 'Where do I take the theory test if I learn in Horsforth?', a: th ? `The DVSA theory tables list a Leeds theory centre, where ${h.pc(tr)} of car theory tests were passed in ${Y}, against ${h.pc(h.gb.theory)} across Great Britain. The theory test is booked on GOV.UK, costs £${h.num(h.P.fees.theory)} and must be passed before you can book the practical test at Horsforth.` : `The theory test is booked on GOV.UK at any theory centre, costs £${h.num(h.P.fees.theory)}, and must be passed before you can book a practical test at Horsforth. National theory pass rate: ${h.pc(h.gb.theory)}.` },
      { q: 'Is Horsforth or Colton Mill better for a Leeds driving test?', a: `In ${Y}, Horsforth passed ${h.pc(c.rate)} of car tests and Colton Mill ${h.pc(cm.rate)}. Their median waits in ${h.month(h.lastMonth)} were ${h.wk(c.wait?.median)} and ${h.wk(cm.wait?.median)}. ${c.near.some((n) => n.id === 'leeds-colton-mill') ? 'Colton Mill is on the DVSA list of nearest centres for Horsforth, so a booking can be moved there.' : 'Colton Mill is not one of the three centres DVSA lists as nearest to Horsforth, so a booking cannot be moved between them; choose before booking.'}` },
      { q: 'Can motorcycle tests be taken at Horsforth?', a: `GOV.UK lists these tests at Horsforth: ${c.types}. ${/motorcycle module 1/.test(c.types) ? 'Both motorcycle modules are offered.' : /motorcycle module 2/.test(c.types) ? 'Only the on-road module 2 is listed, so module 1, the off-road manoeuvres, is taken at another centre.' : 'No motorcycle test is listed.'} The pass rates on this page concern car tests alone.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ageN = Object.entries(c.f.age).filter(([, v]) => v[0] > 0);
    const biggest = ageN.reduce((a, x) => (x[1][0] > a[1][0] ? x : a), ageN[0]);
    const share17 = (c.f.age['17']?.[0] ?? 0) / Math.max(1, c.tests);
    const n17 = h.E.ageRate(17) ?? 0;
    const sex = ((c.fem ?? 0) - (c.m ?? 0)) * 100;
    const months = h.F.months(c.f).slice(-12);
    const below = months.filter((k) => (c.f.wait[k][1] ?? 99) < h.P.rules.releaseWeeksAhead).length;
    const lo = months.reduce((a, k) => ((c.f.wait[k][0] ?? 99) < (c.f.wait[a][0] ?? 99) ? k : a), months[0]);
    const best = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const quick = [...c.near].filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const peakY = c.years.reduce((x, y) => ((c.rateOf(y) ?? 0) > (c.rateOf(x) ?? 0) ? y : x), c.years[0]);
    const busyY = c.years.reduce((x, y) => (c.f.pass[y][0] > c.f.pass[x][0] ? y : x), c.years[0]);
    const fv = c.near.find((n) => n.id === 'leeds-fearnville');
    return `
<h2>Women and men at Horsforth</h2>
<p>Across Great Britain, ${h.gb.m > h.gb.f ? 'men passed more often than women' : 'women passed at least as often as men'} in ${Y}: ${h.pc(h.gb.m)} against ${h.pc(h.gb.f)}. ${sex > 0 ? `At Horsforth women came out ${h.num(Math.round(sex * 10) / 10)} points ahead.` : `At Horsforth men were ${h.num(Math.abs(Math.round(sex * 10) / 10))} points ahead.`} The DVSA tables do not explain why, and a difference of this size can come from the mix of candidates in a single year, so read it as a description of ${Y} rather than a lasting trait of the centre. First attempts passed ${h.pc(c.first)}, and ${h.num(c.zero)} first-time candidates drove without a recorded fault.</p>
<h2>Ages of Horsforth candidates</h2>
<p>The largest age group at Horsforth was ${biggest[0] === '17' ? 'the seventeen-year-olds' : `age ${biggest[0]}`}, with ${h.num(biggest[1][0])} tests. Seventeen-year-olds alone made up ${h.pc(share17, 0)} of all car tests here and passed ${h.pc(c.age['17'])}, ${(c.age['17'] ?? 0) > n17 ? 'more than' : 'less than'} the ${h.pc(n17)} of their age group nationally. The table gives each age with its national rate; ${[18, 19, 20, 21, 22, 23, 24, 25].every((a) => (h.E.ageRate(a) ?? 0) < n17) ? 'nationally too, seventeen-year-olds pass more often than any older age up to 25, a pattern' : 'the national pattern by age is less regular, as'} the ${h.a('pass-rate-by-age-and-sex', 'age and sex analysis')} sets out in full.</p>
${h.ageTable(ID)}
<h2>How early the first slots were taken</h2>
<p>${c.wait ? `In ${below} of the last twelve months, the first tenth of Horsforth tests had been booked less than ${h.P.rules.releaseWeeksAhead} weeks ahead, the furthest the booking service reaches. ${below >= 6 ? 'That suggests new slots here were not all snapped up the moment they appeared.' : 'In the other months the earliest slots went as soon as they were released.'} The shortest median of the period was ${h.wk(c.f.wait[lo][0] as number)} in ${h.month(lo)}; the latest is ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, compared with ${h.wk(c.waitYearAgo)} a year before` : ''}.` : 'DVSA has not published recent waits for Horsforth.'} The ${h.a('driving-test-waiting-times', 'waiting times page')} compares every centre.</p>
${h.waitTable(ID)}
<h2>Five years in brief</h2>
<p>Horsforth's DVSA record starts at ${h.pc(c.rateOf(c.years[0]))} from ${h.num(c.f.pass[c.years[0]][0])} tests in ${h.yearLabel(c.years[0])}. The peak of the series was ${h.pc(c.rateOf(peakY))} in ${h.yearLabel(peakY)}, and the busiest year ${h.yearLabel(busyY)}, with ${h.num(c.f.pass[busyY][0])} tests. ${peakY === h.lastYear ? 'The latest year is therefore the best one on record.' : `The latest year, at ${h.pc(c.rate)}, sits ${h.pts(Math.abs((c.rate! - (c.rateOf(peakY) ?? 0)) * 100)).replace('+', '')} below that peak.`}</p>
<h2>Nearest centres for a move</h2>
<p>DVSA's nearest centres for Horsforth are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${best ? `The highest ${Y} rate among them belongs to ${best.name}, ${h.pp(best.rate)}` : ''}${quick ? `, and the shortest ${h.month(h.lastMonth)} wait to ${quick.name}, ${h.wk(quick.wait)}` : ''}. ${fv && fv.wait == null ? `No wait was published for ${fv.name} that month.` : ''} A move to any of them counts as one of the ${h.P.rules.changesAllowed} changes allowed on a booking, and since ${h.date(h.P.rules.onlyLearnerFrom)} only the learner can make it, on GOV.UK. ${c.notes.length ? `GOV.UK's note on Horsforth: "${c.notes[0]}"` : ''}</p>
${h.nearTable(ID)}
<p>Pass rates from ${h.src('dvsa_pass_centre', 'DVSA table DRT122A')}, ages from DRT122D, waits from ${h.src('dvsa_waits', 'DVSA table DRT122F')}, theory rates from ${h.src('dvsa_theory_centre', 'DVSA theory tables')}, address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

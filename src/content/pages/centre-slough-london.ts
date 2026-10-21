import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'slough-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');
/** GOV.UK repeats the centre's name (with a typo) before the street: keep the street only. */
const street = (s: string) => s.split(', ').filter((p) => !/test centre/i.test(p) && !/drivng/i.test(p)).join(', ');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 618,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['centre-southall-london', 'region-south-east', 'region-london', 'driving-test-waiting-times', 'theory-test-pass-rates'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'slough-driving-test-centre',
  nav: 'Slough',
  card: 'Slough SL3: pass rate against the South East, the latest wait and the theory centre.',
  title: `Slough Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Slough driving test centre, SL3: DVSA car pass rate for ${YL}, its South East ranking, the latest wait, the Slough theory centre and 3 alternatives.`,
  h1: 'Slough driving test centre: pass rate and waiting time',
  intro: 'Waterside Drive, SL3: listed by DVSA as Slough (London) but counted in the South East, and compared here with Uxbridge, Yeading and Southall.',
  resume: (h) => {
    const c = h.C(ID);
    return `DVSA calls it Slough (London), but its figures are counted in the ${c.region} region, and that is the comparison used here. In ${h.yearLabel(h.lastYear)} the centre passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests, ${h.num(c.passes)} passes in all. The ${c.region} rate was ${h.pc(c.regionRate)} and the British rate ${h.pc(h.gb.rate)}, so Slough sat ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} its region and ${c.rate! > h.gb.rate ? 'above' : 'below'} the country, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} ${c.region} centres with 300 tests or more. Its three-year movement is ${h.pts(c.trend3)}. ${c.wait ? `In ${h.month(c.wait.month)} the median time from booking to test was ${h.wk(c.wait.median)}, against ${h.wk(c.regionWait?.[3])} for the ${c.region} and ${h.wk(h.gb.wait?.[3])} for Britain${c.waitYearAgo != null ? `; a year earlier, Slough's median had been ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has not published a recent waiting figure for Slough.'} Rates and waits are updated here monthly from DVSA, and the finder above compares Slough with every centre within reach of SL3, on either side of the London boundary.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'slough');
    return [
      { q: 'Is Slough driving test centre in London?', a: `DVSA's name for it is Slough (London), but the centre is at ${street(c.addr[0])}, ${c.addr[1]}, ${c.addr[2]}, and DVSA's regional tables count it in the ${c.region}. That is why this page compares it with the ${c.region} rate of ${h.pc(c.regionRate)} rather than London's. ${(() => { const ln = c.near.filter((n) => n.id && h.E.hasCentre(n.id) && h.E.centre(n.id).r === 'London'); return ln.length ? `${ln.length === c.near.length ? 'All three' : `${h.num(ln.length)} of the three`} centres on its DVSA list are London centres.` : 'None of the three centres on its DVSA list is a London centre.'; })()}` },
      { q: 'What is the theory test pass rate in Slough?', a: `${th ? `DVSA's theory table lists a Slough theory test centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain.` : 'DVSA does not list a Slough theory centre in its latest table.'} The theory test costs £${h.num(h.P.fees.theory)}. It is booked separately from the practical test at Waterside Drive, which can only be booked once the theory has been passed.` },
      { q: 'Can wheelchair users take a test at Slough?', a: `${c.notes.length ? `GOV.UK says: "${c.notes.join(' ')}"` : 'GOV.UK lists no access note for Slough at present.'} Any adjustment for the test is asked for when booking on GOV.UK. The centre is listed for ${c.types} tests, so instructor candidates are examined there too.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ms = h.F.months(f).slice(-12);
    const pts = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = pts.reduce((a, b) => (b.v < a.v ? b : a), pts[0] ?? { k: h.lastMonth, v: 0 });
    const prevM = ms.length > 1 ? ms[ms.length - 2] : null;
    const jump = c.wait?.median != null && prevM && f.wait[prevM][0] != null ? c.wait.median - (f.wait[prevM][0] as number) : null;
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const peak = ys.reduce((a, y) => (f.pass[y][0] > f.pass[a][0] ? y : a));
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    return `
<h2>${jump != null && jump >= 8 ? 'A sudden lengthening of the queue' : 'The queue over twelve months'}</h2>
<p>${c.wait ? `Slough's latest median, ${h.wk(c.wait.median)}, compares with a twelve-month low of ${h.wk(lo.v)} in ${h.month(lo.k)}.${jump != null && prevM ? ` The month before the latest, ${h.month(prevM)}, stood at ${h.wk(f.wait[prevM][0])}, a change of ${h.wk(Math.round(Math.abs(jump) * 10) / 10)} ${jump >= 0 ? 'upward' : 'downward'} in a single month.` : ''} Only ${h.pp(c.wait.in7)} of those tested in ${h.month(c.wait.month)} had booked within seven weeks.` : 'DVSA has not published recent waits for Slough.'} A single month can reflect a short run of cancellations or released slots, so the next readings will show whether a change lasts. Dates are released ${h.P.rules.releaseWeeksAhead} weeks ahead, and only the learner can book since 12 May 2026.</p>
${h.waitTable(ID, 12)}
<h2>Within the ${c.region}</h2>
<p>Slough ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the ${c.region} and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} in Britain. Its busiest year in the DVSA series was ${h.yearLabel(peak)}, with ${h.num(f.pass[peak][0])} tests, against ${h.num(c.tests)} in the latest year. The rate went from ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} to ${h.pc(c.rate)}. The ${h.a('region-south-east', 'South East page')} ranks every centre in the region, and the yearly table below sets each Slough year beside the British rate.</p>
${h.yearTable(ID)}
<h2>Sex and age</h2>
<p>Men passed ${h.pc(c.m)} at Slough and women ${h.pc(c.fem)}: a gap of ${h.pts(Math.abs(gap)).replace('+', '')}, ${Math.abs(gap) > Math.abs((h.gb.m - h.gb.f) * 100) ? 'wider' : 'narrower'} than the British one. Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} nationally, and first-time candidates ${h.pc(c.first)}. Automatic cars took ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars.</p>
${h.ageTable(ID)}
<h2>${c.near.some((n) => n.id && h.E.hasCentre(n.id) && h.E.centre(n.id).r !== c.region) ? 'Across the boundary: the three alternatives' : 'The three alternatives'}</h2>
<p>DVSA lists ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')} as Slough's nearest centres, and a Slough test can move only to one of them. ${c.near.filter((n) => n.rate != null).map((n) => `${short(n.name)} passed ${h.pp(n.rate)}`).join(', ')} in ${h.yearLabel(h.lastYear)}. ${quick ? `${short(quick.name)} had the shortest median wait in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}, against ${h.wk(c.wait?.median)} at Slough.` : ''} Each move uses one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows.</p>
${h.nearTable(ID)}
<h2>Theory first, then Waterside Drive</h2>
<p>${(() => { const th = h.E.THEORY_CENTRES.find((x) => x.id === 'slough'); return th ? `Learners from the town can sit the theory test at the Slough theory centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, ${(h.E.theoryRate(th) ?? 0) > h.gb.theory ? 'above' : 'below'} the British theory rate of ${h.pc(h.gb.theory)}.` : `DVSA's latest theory table has no Slough entry; the British theory pass rate was ${h.pc(h.gb.theory)} in ${h.yearLabel(h.lastYear)}.`; })()} The theory certificate must be in hand before the practical test can be booked, at £${h.num(h.P.fees.practicalWeekday)} on a weekday or £${h.num(h.P.fees.practicalEvening)} in the evening or at a weekend. The ${h.a('theory-test-pass-rates', 'theory pass rates page')} compares theory centres across Britain.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results by centre')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

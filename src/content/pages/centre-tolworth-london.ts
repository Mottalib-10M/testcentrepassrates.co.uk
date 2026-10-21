import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'tolworth-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 611,
  tool: { kind: 'finder', props: { centre: ID, radius: 9 } },
  related: ['centre-morden-london', 'centre-isleworth-fleming-way', 'centre-mitcham-london', 'region-london', 'automatic-driving-test-pass-rates', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'tolworth-driving-test-centre',
  nav: 'Tolworth',
  card: 'Tolworth KT6: pass rate, manual against automatic, the monthly wait and 3 options.',
  title: `Tolworth Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Tolworth driving test centre on Douglas Road, KT6: DVSA car pass rate for ${YL}, manual and automatic results, the latest wait and Morden, Isleworth, Mitcham.`,
  h1: 'Tolworth driving test centre: pass rate, gearbox and wait',
  intro: 'Douglas House, KT6: a south-west London centre for cars and on-road motorcycle tests, compared with Morden, Isleworth and Mitcham.',
  resume: (h) => {
    const c = h.C(ID);
    const ahead = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100).length;
    return `Tolworth's ${h.num(c.tests)} car tests in ${h.yearLabel(h.lastYear)} produced ${h.num(c.passes)} passes, a rate of ${h.pc(c.rate)}. Great Britain's rate was ${h.pc(h.gb.rate)} and London's ${h.pc(c.regionRate)}, and Tolworth ranked ${h.ord(c.rankRegion)} of the ${c.ofRegion} London centres with 300 tests or more. ${ahead === 0 ? 'None of the three centres DVSA lists as its nearest recorded a higher rate.' : `${h.num(ahead)} of the three centres DVSA lists as its nearest recorded a higher rate.`} The rate moved ${h.pts(c.trend3)} over three years. ${c.wait ? `On the wait, the DVSA table for ${h.month(c.wait.month)} gives a median of ${h.wk(c.wait.median)} between booking and test, beside ${h.wk(h.gb.wait?.[3])} for Britain and ${h.wk(c.regionWait?.[3])} for London${c.waitYearAgo != null ? `; in the same month of the previous year Tolworth's median was ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has no recent waiting figure for Tolworth.'} ${(() => { const v = h.F.months(c.f).slice(-12).map((k) => c.f.wait[k][0]).filter((x): x is number => x != null); return v.length && Math.max(...v) - Math.min(...v) >= 8 ? 'Tolworth waits have moved sharply within a year, so the monthly table below matters more than any single reading.' : 'The monthly table below shows how stable that reading has been over the past year.'; })()} Both rate and wait are updated here as DVSA publishes, and the finder above lists every centre within reach of KT6.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    return [
      { q: 'Is Tolworth a good test centre for automatic cars?', a: `Automatic candidates passed ${h.pc(c.auto)} at Tolworth in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.auto)} for automatics across Britain, so ${(c.auto ?? 0) > h.gb.auto ? 'above' : 'below'} the national automatic rate. Manual candidates at Tolworth passed ${h.pp(c.l.mn)}. ${h.num(c.autoTests)} of the centre's tests were in automatic cars. A pass in an automatic gives a licence for automatic cars only.` },
      { q: 'Can I take a motorcycle test at Tolworth?', a: `GOV.UK lists Tolworth for ${c.types}. ${/module 2/.test(c.types) && !/module 1/.test(c.types) ? 'Module 2, the on-road ride, is held here, but module 1, the off-road manoeuvres, is taken at another centre.' : /motorcycle/.test(c.types) ? 'Motorcycle tests are listed for the centre.' : 'No motorcycle test is listed for the centre at present.'} This page covers the car practical test only.` },
      { q: 'Does Tolworth driving test centre have wheelchair access?', a: `${c.notes.length ? `GOV.UK states: "${c.notes.join(' ')}"` : 'GOV.UK lists no access note for Tolworth at present.'} Any adjustment for the test is requested when booking on GOV.UK. The centre is at ${c.addr.join(', ')}. DVSA does not publish test routes for Tolworth or for any other centre.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ms = h.F.months(f).slice(-12);
    const pts = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = pts.reduce((a, b) => (b.v < a.v ? b : a), pts[0] ?? { k: h.lastMonth, v: 0 });
    const hi = pts.reduce((a, b) => (b.v > a.v ? b : a), pts[0] ?? { k: h.lastMonth, v: 0 });
    const nat = h.E.NATIONAL;
    const natAuto = nat.auto[h.lastYear], natAll = nat.practical[h.lastYear].t;
    const natManual = (natAll[1] - natAuto[1]) / (natAll[0] - natAuto[0]);
    const gapHere = (c.l.mn ?? 0) - (c.auto ?? 0) * 100;
    const gapGb = (natManual - h.gb.auto) * 100;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    return `
<h2>${hi.v - lo.v >= 8 ? 'A wait that changes fast' : 'How the wait has moved'}</h2>
<p>Within the last twelve months of DVSA data, Tolworth's median wait went as low as ${h.wk(lo.v)} (${h.month(lo.k)}) and as high as ${h.wk(hi.v)} (${h.month(hi.k)}). ${c.wait ? `The latest reading is ${h.wk(c.wait.median)}, with ${h.pp(c.wait.in7)} of candidates booked inside seven weeks and the earliest tenth of slots taken ${h.wk(c.wait.w10)} ahead.` : ''} ${hi.v - lo.v >= 8 ? 'A swing of that size means the queue a learner meets depends heavily on when the booking is made.' : 'The range is narrow enough that the latest month is a fair guide.'} Slots are released ${h.P.rules.releaseWeeksAhead} weeks ahead, and since 12 May 2026 only the learner can book or rearrange the test, so third-party cancellation services are no longer an option. The ${h.a('driving-test-waiting-times', 'waiting times page')} has the same series for every centre.</p>
${h.waitTable(ID, 12)}
<h2>Manual and automatic results</h2>
<p>${h.pc(c.autoShare, 0)} of Tolworth's tests were in automatic cars. Manual candidates passed ${h.pp(c.l.mn)} and automatic candidates ${h.pc(c.auto)}, a gap of ${h.pts(Math.abs(gapHere)).replace('+', '')} in favour of ${gapHere >= 0 ? 'manuals' : 'automatics'}. Across Britain the manual rate was ${h.pc(natManual)} and the automatic rate ${h.pc(h.gb.auto)}, a gap of ${h.pts(gapGb).replace('+', '')}, so Tolworth's gap is ${Math.abs(gapHere) < Math.abs(gapGb) ? 'narrower' : 'wider'} than the national one. ${h.a('automatic-driving-test-pass-rates', 'Automatic pass rates by centre')} gives the full ranking.</p>
<h2>Who passes here</h2>
<p>The strongest age group at Tolworth in ${h.yearLabel(h.lastYear)} was ${best}-year-olds, at ${h.pc(c.age[best])}. ${best === '17' ? '' : `Seventeen-year-olds passed ${h.pc(c.age['17'])}. `}Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, against ${h.pc(h.gb.m)} and ${h.pc(h.gb.f)} across Britain. On a first attempt the rate was ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} first-time candidates drove without a fault. Over the five DVSA years, the caseload has run between ${h.num(Math.min(...c.years.map((y) => f.pass[y][0])))} and ${h.num(Math.max(...c.years.map((y) => f.pass[y][0])))} tests.</p>
${h.ageTable(ID)}
<h2>The three centres DVSA links to Tolworth</h2>
<p>A Tolworth test can move to ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles, ${h.pp(n.rate)})`).join(', ')}, and nowhere else, under the rule in force since 9 June 2026. ${c.near.every((n) => (n.rate ?? 0) < (c.rate ?? 0) * 100) ? 'Each of them passed a smaller share of candidates than Tolworth in the latest year, so the only reason to move would be an earlier date.' : 'At least one of them passed a larger share of candidates than Tolworth in the latest year.'} Check the wait column before using one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows: in ${h.month(h.lastMonth)} Tolworth's own median was ${h.wk(c.wait?.median)}.</p>
${h.nearTable(ID)}
<p>${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} Tolworth tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.medical)} because of examiner illness. ` : ''}${c.notes.length ? `GOV.UK access note: "${c.notes.join(' ')}"` : ''}</p>
<p>Data from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'hornchurch-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 616,
  tool: { kind: 'finder', props: { centre: ID, radius: 9 } },
  related: ['centre-goodmayes-london', 'centre-wanstead-london', 'region-london', 'driving-test-waiting-times', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'hornchurch-driving-test-centre',
  nav: 'Hornchurch',
  card: 'Hornchurch RM12: the wait over two years, the pass rate trend and Brentwood nearby.',
  title: `Hornchurch Driving Test Centre: Wait and Pass Rate ${YL}`,
  description: `Hornchurch driving test centre in RM12: the wait over 24 months, the DVSA car pass rate for ${YL} and its trend, and Goodmayes, Brentwood or Wanstead.`,
  h1: 'Hornchurch driving test centre: waiting time and pass rate',
  intro: 'Station Lane, RM12: an outer east London car centre whose queue is followed month by month and compared with Goodmayes, Brentwood and Wanstead.',
  resume: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = vals.reduce((a, b) => (b.v < a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    return `${c.wait ? `Booking a test at Hornchurch meant a median wait of ${h.wk(c.wait.median)} for candidates tested in ${h.month(c.wait.month)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} in the same month a year earlier` : ''}. The shortest month in the DVSA series was ${h.month(lo.k)}, at ${h.wk(lo.v)}. Across Britain the latest median was ${h.wk(h.gb.wait?.[3])}, and across London ${h.wk(c.regionWait?.[3])}. ` : 'DVSA has published no recent waiting figure for Hornchurch. '}The pass rate tells a separate story. In ${h.yearLabel(h.lastYear)} the centre passed ${h.pc(c.rate)} of ${h.num(c.tests)} car tests (${h.num(c.passes)} passes), against ${h.pc(h.gb.rate)} nationally and ${h.pc(c.regionRate)} in London, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres. Three years earlier it stood at ${h.pp(c.l.p[0])}, a change of ${h.pts(c.trend3)}. First-time candidates passed ${h.pc(c.first)}. Both the rate and the queue are refreshed here from DVSA's tables each month, and the finder above lists every centre within reach of RM12 with its own figures.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const br = c.near.find((n) => n.id === 'brentwood-london');
    return [
      { q: 'Can I move my Hornchurch test to Brentwood?', a: `${br ? `Yes: Brentwood is on the DVSA list of three centres nearest to Hornchurch, ${h.num(br.miles)} miles away. In ${h.month(h.lastMonth)} its median wait was ${h.wk(br.wait)}, against ${h.wk(c.wait?.median)} at Hornchurch, and its ${h.yearLabel(h.lastYear)} pass rate was ${h.pp(br.rate)}, against ${h.pc(c.rate)}.` : 'Not at present: Brentwood is not on the DVSA list of centres nearest to Hornchurch.'} The move is made by the learner on GOV.UK and uses one of the changes a booking allows.` },
      { q: 'Is the Hornchurch pass rate falling?', a: `Over three DVSA years it went ${c.l.p.map((p) => h.pp(p)).join(', then ')}, a change of ${h.pts(c.trend3)}. ${(c.trend3 ?? 0) < 0 ? 'So yes, it has fallen over that period' : 'So it has not fallen over that period'}, while the British rate ended at ${h.pc(h.gb.rate)}. The yearly table on this page shows the number of tests behind each figure.` },
      { q: 'How does weather affect Hornchurch tests?', a: `${c.cancel ? `DVSA cancelled ${h.num(c.cancel.weather)} Hornchurch tests for weather in ${h.yearLabel(h.lastYear)}, out of ${h.num(c.cancel.total)} cancellations in all; examiner illness accounted for ${h.num(c.cancel.medical)}. ` : 'DVSA has not published cancellation counts for Hornchurch for the latest year. '}Tests are called off when ice, snow, flooding or fog make driving unsafe, and the candidate is offered a new date at no extra cost.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ms = h.F.months(f);
    const half = Math.floor(ms.length / 2);
    const avg = (ks: string[]) => { const v = ks.map((k) => f.wait[k][0]).filter((x): x is number => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
    const a1 = avg(ms.slice(0, half)), a2 = avg(ms.slice(half));
    const prev = f.pass[ys[ys.length - 2]][0];
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const top = c.near.filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const p = c.l.p;
    const falling = p[0] != null && p[1] != null && p[2] != null && p[0] > p[1] && p[1] > p[2];
    return `
<h2>Two years of waits, split in half</h2>
<p>${a1 != null && a2 != null ? `In the first ${h.num(half)} months of DVSA data for Hornchurch the median wait averaged ${h.wk(Math.round(a1 * 10) / 10)}; in the most recent ${h.num(ms.length - half)} months it averaged ${h.wk(Math.round(a2 * 10) / 10)}. The queue has therefore ${a2 > a1 ? 'lengthened' : 'shortened'} between the two halves of the series.` : ''} ${c.wait ? `In ${h.month(c.wait.month)}, only ${h.pp(c.wait.in7)} of candidates had booked within seven weeks, and the earliest tenth of slots had been taken ${h.wk(c.wait.w10)} ahead.` : ''} DVSA releases new dates ${h.P.rules.releaseWeeksAhead} weeks in advance, and since 12 May 2026 bookings can be made or changed only by the learner, on GOV.UK. The ${h.a('driving-test-waiting-times', 'waiting times tracker')} compares every centre month by month.</p>
${h.waitTable(ID, 12)}
<h2>${c.tests >= prev ? 'More candidates in the latest year' : 'Fewer candidates in the latest year'}</h2>
<p>Hornchurch carried out ${h.num(c.tests)} car tests in ${h.yearLabel(h.lastYear)}, against ${h.num(prev)} the year before, ${c.tests >= prev ? `a rise of about ${h.num(Math.round((c.tests / prev - 1) * 100))} %` : `a fall of about ${h.num(Math.round((1 - c.tests / prev) * 100))} %`}. The caseload does not by itself explain the queue, but the two figures are worth reading together. ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests over the year, ${h.num(c.cancel.medical)} through examiner illness and ${h.num(c.cancel.weather)} because of weather.` : ''}</p>
${h.yearTable(ID)}
<h2>${falling ? 'A rate lower each year' : 'The rate over three years'}</h2>
<p>The last three DVSA years give Hornchurch ${p.map((x) => h.pp(x)).join(', ')}. ${falling ? 'Each year was lower than the one before, ' : ''}against a British rate that moved from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. First attempts passed ${h.pc(c.first)} here and ${h.num(c.zero)} of them were fault-free. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. Seventeen-year-olds did ${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? 'better' : 'less well'} than their national peers, ${h.pc(c.age['17'])} against ${h.pc(h.E.ageRate(17))}, and the ${h.num(ages.length)} age groups in the DVSA table ranged from ${h.pc(Math.min(...ages.map((k) => c.age[k] as number)))} to ${h.pc(Math.max(...ages.map((k) => c.age[k] as number)))}.</p>
<h2>Manual or automatic</h2>
<p>Automatic cars accounted for ${h.pc(c.autoShare, 0)} of Hornchurch tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.autoTests)} in all, and their candidates passed ${h.pc(c.auto)}. Manual candidates passed ${h.pp(c.l.mn)}. Across Britain the automatic rate was ${h.pc(h.gb.auto)}. Whichever gearbox you choose, the licence follows it: a pass in an automatic does not entitle you to drive a manual car, so the choice belongs to the car you plan to drive afterwards.</p>
<h2>${c.near.map((n) => short(n.name)).join(', ').replace(/, ([^,]*)$/, ' or $1')}</h2>
<p>A Hornchurch test can move to ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')}, the three centres DVSA names as nearest, and to no other. ${quick && top && quick.id === top.id ? `${short(top.name)} led on both counts, with the shortest median wait in ${h.month(h.lastMonth)} (${h.wk(quick.wait)}) and the best ${h.yearLabel(h.lastYear)} rate (${h.pp(top.rate)}).` : `${quick ? `${short(quick.name)} had the shortest median wait in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}` : ''}${top ? `${quick ? ', and ' : ''}${short(top.name)} the best ${h.yearLabel(h.lastYear)} rate, ${h.pp(top.rate)}` : ''}; no single alternative led on both counts.`} The ${h.a('move-driving-test-centre', 'moving guide')} sets out the steps.</p>
${h.nearTable(ID)}
<p>The centre is at ${c.addr.join(', ')} and is listed for ${c.types} tests. Data: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_nearest', 'GOV.UK nearest centres')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'bristol-avonmouth';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 638,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-south-west', 'centre-bristol-kingswood', 'driving-test-waiting-times', 'driving-test-cancellations', 'easiest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'bristol-avonmouth-driving-test-centre',
  nav: 'Bristol (Avonmouth)',
  card: 'Avonmouth pass rate, a wait that swings hard, and the other Bristol centre.',
  title: `Bristol Avonmouth Driving Test Centre: Pass Rate ${YL}`,
  description: `Bristol Avonmouth driving test centre: ${YL} car pass rate, 13 months of waits, cancellations and a comparison with Kingswood and Weston-super-Mare.`,
  h1: 'Bristol (Avonmouth) driving test centre: pass rate and wait',
  intro: 'Cabot Park, BS11: the Bristol car centre at Avonmouth, with thirteen months of waits, its yearly record and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const kw = h.C('bristol-kingswood');
    const gbMed = h.gb.wait?.[3];
    return `${h.pc(c.rate)}: that was the share of car tests passed at Avonmouth in ${Y}, ${h.num(c.passes)} out of ${h.num(c.tests)}. The national rate stood at ${h.pc(h.gb.rate)} and the South West's at ${h.pc(c.regionRate)}, so Avonmouth finished ${c.rate! > h.gb.rate ? 'ahead of' : 'behind'} Great Britain and ${c.rate! > (c.regionRate ?? 0) ? 'ahead of' : 'behind'} its region, ${h.ord(c.rankRegion)} of ${c.ofRegion} South West centres with at least 300 tests. Bristol's other centre, Kingswood, passed ${h.pc(kw.rate)}. Over three years Avonmouth's rate shifted by ${h.pts(c.trend3)}. ${c.wait ? `On waiting times, the median for tests in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} in the same month a year earlier` : ''}, while Great Britain's was ${h.wk(gbMed)}. ${h.pp(c.wait.in7)} of candidates had booked less than seven weeks ahead.` : 'DVSA did not publish a recent wait for Avonmouth.'} The full monthly series, the yearly record, the cancellation figures and the three alternatives DVSA allows are set out below.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ws = c.near.find((n) => n.id === 'weston-super-mare');
    return [
      { q: 'How long is the wait at Bristol Avonmouth driving test centre?', a: c.wait ? `For tests in ${h.month(c.wait.month)} the median Avonmouth candidate had booked ${h.wk(c.wait.median)} beforehand, and ${h.pp(c.wait.in7)} had booked within seven weeks. ${(() => { const v = h.F.months(c.f).slice(-12).map((k) => c.f.wait[k][0]).filter((x): x is number => x != null); return Math.max(...v) - Math.min(...v) > 6 ? 'The figure has moved a lot over the past year, so look at the monthly table rather than one month.' : 'The figure has been fairly steady over the past year.'; })()} Slots open up to ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK.` : `DVSA has not published a recent waiting time for Avonmouth. Tests are released up to ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK, the only place a test can be booked.` },
      { q: 'Can I move my Avonmouth test to Weston-super-Mare?', a: ws ? `Yes. Weston-super-Mare is one of the three centres DVSA lists as nearest to Avonmouth, ${h.num(ws.miles)} miles away. Its ${Y} pass rate was ${h.pp(ws.rate)} and its median wait in ${h.month(h.lastMonth)} ${h.wk(ws.wait)}. The move counts as one of the ${h.P.rules.changesAllowed} changes allowed on a booking, and only the learner can make it.` : `Not at present: Weston-super-Mare is not on the DVSA list of nearest centres for Avonmouth, and since ${h.date(h.P.rules.nearestThreeFrom)} a test can only move to one of the three listed. Check the table on this page for the current list.` },
      { q: 'Why were Avonmouth tests cancelled by DVSA?', a: c.cancel ? `DVSA recorded ${h.num(c.cancel.total)} examiner-side cancellations at Avonmouth in ${Y}. The main reason was ${[['leave or training', c.cancel.leave], ['illness', c.cancel.medical], ['weather', c.cancel.weather]].sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]}, with ${h.num(c.cancel.leave)} for leave or training, ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.weather)} for weather. That is ${h.pc(c.cancel.total / Math.max(1, c.tests))} of the tests conducted; each cancelled candidate is given a new date by DVSA.` : `DVSA has not published cancellation reasons for Avonmouth for ${Y}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const months = h.F.months(c.f).slice(-13);
    const vals = months.map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const hi = vals.reduce((a, x) => (x.v > a.v ? x : a), vals[0]);
    const lo = vals.reduce((a, x) => (x.v < a.v ? x : a), vals[0]);
    const w10low = months.filter((k) => (c.f.wait[k][1] ?? 99) < h.P.rules.releaseWeeksAhead);
    const ys = c.years;
    const peak = ys.reduce((a, y) => ((c.rateOf(y) ?? 0) > (c.rateOf(a) ?? 0) ? y : a), ys[0]);
    const n17 = h.E.ageRate(17) ?? 0;
    const best = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const quick = [...c.near].filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const kw = h.C('bristol-kingswood');
    const loc = c.addr[1].replace(/,\s*$/, '');
    return `
<h2>${h.wk(lo.v)} at best, ${h.wk(hi.v)} at worst</h2>
<p>Over the thirteen months in the table, the median Avonmouth wait ranged from ${h.wk(lo.v)} in ${h.month(lo.k)} to ${h.wk(hi.v)} in ${h.month(hi.k)}. ${hi.v - lo.v > 8 ? 'With a swing of this size, a wait quoted a few months ago may no longer hold, so check the latest row before deciding anything.' : 'The range is narrow, so the latest month is a fair guide.'} ${w10low.length ? `In ${w10low.length} of these months the first tenth of tests had been booked less than ${h.P.rules.releaseWeeksAhead} weeks ahead, which suggests not every slot was taken on the day it was released.` : 'In every month the first tenth of tests had been booked a full release window ahead.'}</p>
${h.waitTable(ID, 13)}
<h2>The yearly record</h2>
<p>Avonmouth's best year in the series was ${h.yearLabel(peak)}, at ${h.pc(c.rateOf(peak))}; the latest, ${Y}, came in at ${h.pc(c.rate)} from ${h.num(c.tests)} tests. The busiest year was ${h.yearLabel(ys.reduce((a, y) => (c.f.pass[y][0] > c.f.pass[a][0] ? y : a), ys[0]))}. Seventeen-year-olds passed ${h.pc(c.age['17'])}, ${(c.age['17'] ?? 0) > n17 ? 'above' : 'below'} the ${h.pc(n17)} of the same age nationally, and first-time candidates ${h.pc(c.first)}, against ${h.pc(h.gb.first)} for first attempts across Great Britain; ${h.num(c.zero)} of those first-timers passed without a single fault on the sheet. Men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}. ${c.auto != null ? `The ${h.num(c.autoTests)} automatic tests passed at ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars.` : ''} For the centres with the best rates in the country, see the ${h.a('easiest-driving-test-centres', 'easiest test centres')}.</p>
${h.yearTable(ID)}
<h2>Cancellations at Avonmouth</h2>
<p>${c.cancel ? `Examiners called off ${h.num(c.cancel.total)} tests in ${Y}: ${h.num(c.cancel.leave)} for leave or training, ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.weather)} for bad weather. ${c.cancel.medical < c.cancel.leave ? 'Leave and training, not illness, accounted for the largest number.' : 'Illness accounted for the largest number.'} The ${h.a('driving-test-cancellations', 'cancellations page')} compares centres on this count.` : `DVSA did not publish cancellation figures for Avonmouth in ${Y}.`} GOV.UK gives the address as ${c.addr[0]}, ${loc}, ${c.addr[2]}, and lists these tests: ${c.types}.</p>
<h2>Avonmouth or Kingswood</h2>
<p>Bristol has ${h.E.CENTRES.filter((x) => x.n.startsWith('Bristol (')).length === 2 ? 'two' : h.E.CENTRES.filter((x) => x.n.startsWith('Bristol (')).length} car test centres in the DVSA tables. ${kw.rate! < c.rate! ? `Avonmouth passed more of its candidates in ${Y}, ${h.pc(c.rate)} against ${h.pc(kw.rate)} at Kingswood` : `Kingswood passed more of its candidates in ${Y}, ${h.pc(kw.rate)} against ${h.pc(c.rate)} here`}, while Kingswood ran ${kw.tests > c.tests ? 'more' : 'fewer'} tests, ${h.num(kw.tests)} in all. The two centres are ${h.num(c.near.find((n) => n.id === 'bristol-kingswood')?.miles ?? 0)} miles apart on DVSA's list. In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} here and ${h.wk(kw.wait?.median)} at Kingswood, so ${(kw.wait?.median ?? 99) < (c.wait?.median ?? 99) ? 'Kingswood offered the quicker route to a test that month' : 'Avonmouth offered the quicker route to a test that month'}.</p>
<h2>All three alternatives</h2>
<p>The DVSA list of nearest centres for Avonmouth reads ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles`).join('; ')}. ${best ? `The best ${Y} rate of the three was ${best.name}'s, ${h.pp(best.rate)}` : ''}${quick ? `; the shortest median wait in ${h.month(h.lastMonth)} was ${quick.name}'s, ${h.wk(quick.wait)}` : ''}. ${best && quick && best.id === quick.id ? `${best.name} leads on both counts, at ${h.num(best.miles)} miles.` : 'No single alternative leads on both counts.'}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

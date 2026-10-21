import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'cambridge-brookmount-court';
const short = (n: string) => n.replace(/ \(.*\)$/, '');
/** GOV.UK repeats the centre's name before the units and street: keep the units and street. */
const street = (s: string) => s.split(', ').filter((p) => !/^Driving Test Centre/i.test(p)).join(', ');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 622,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-east-of-england', 'driving-test-waiting-times', 'theory-test-pass-rates', 'move-driving-test-centre', 'driving-test-booking-rules-2026'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest', 'gov_release'],
  slug: 'cambridge-driving-test-centre',
  nav: 'Cambridge',
  card: 'Cambridge CB4: the wait, the pass rate and how far the three alternatives are.',
  title: `Cambridge Driving Test Centre: Wait and Pass Rate ${YL}`,
  description: `Cambridge driving test centre at Brookmount Court, CB4: the latest wait, the DVSA car pass rate for ${YL}, the theory centre and how far the alternatives are.`,
  h1: 'Cambridge driving test centre (Brookmount Court): wait and pass rate',
  intro: 'Brookmount Court, Kirkwood Road, CB4: the Cambridge car test centre, where the queue and the distance to the next centre both matter.',
  resume: (h) => {
    const c = h.C(ID);
    const w = c.wait;
    const nearest = c.near.length ? Math.min(...c.near.map((n) => n.miles)) : null;
    return `${w ? `The median candidate tested at Cambridge in ${h.month(w.month)} had booked ${h.wk(w.median)} earlier${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} in the same month a year before` : ''}. The ${c.region} median that month was ${h.wk(c.regionWait?.[3])} and the British one ${h.wk(h.gb.wait?.[3])}, so the Cambridge queue was ${w.median != null && w.median > (c.regionWait?.[3] ?? 0) ? 'longer than' : 'no longer than'} the regional one. ` : 'DVSA has not published a recent wait for Cambridge. '}On results, Brookmount Court passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests in ${h.yearLabel(h.lastYear)} (${h.num(c.passes)} passes), against ${h.pc(c.regionRate)} in the ${c.region} and ${h.pc(h.gb.rate)} in Britain, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} in its region. The rate moved ${h.pts(c.trend3)} over three years. ${nearest != null ? `The nearest alternative on the DVSA list is ${h.num(nearest)} miles away${nearest >= 20 ? ', a long way to move a booking' : ''}.` : ''} The sections below follow the queue, the results and those alternatives, and every figure is refreshed when DVSA publishes a new month.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'cambridge');
    return [
      { q: 'How long is the wait at Cambridge driving test centre?', a: `DVSA publishes the waits, not the reasons behind them. ${c.wait ? `In ${h.month(c.wait.month)} the Cambridge median was ${h.wk(c.wait.median)}, and only ${h.pp(c.wait.in7)} of candidates tested had booked within seven weeks.` : ''} Dates are released ${h.P.rules.releaseWeeksAhead} weeks ahead, so a median near that figure means many candidates booked soon after their date appeared. DVSA's table does not say how many of those tests had been moved along the way.` },
      { q: 'Is there a theory test centre in Cambridge?', a: `${th ? `Yes. DVSA lists a Cambridge theory test centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain.` : 'DVSA does not list a Cambridge theory centre in its latest table.'} The theory test costs £${h.num(h.P.fees.theory)}, and the practical test at Brookmount Court is booked on GOV.UK once it has been passed.` },
      { q: 'Which centres can a Cambridge test be moved to?', a: `Only to the three DVSA lists as nearest: ${c.near.map((n) => `${short(n.name)} (${h.num(n.miles)} miles, median wait ${h.wk(n.wait)})`).join(', ')}. That rule has applied since 9 June 2026. A move uses one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows, and the distance means a longer trip on the day.` },
      { q: 'Does Cambridge test centre make arrangements for disabled candidates?', a: `${c.notes.length ? `GOV.UK says: "${c.notes.join(' ')}"` : 'GOV.UK lists no access note for the centre at present.'} Any need is stated when booking on GOV.UK. The centre is at ${street(c.addr[0])}, ${c.addr[1]}, ${c.addr[2]}, and is listed for ${c.types} tests.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const over15 = vals.filter((x) => x.v >= 15).length;
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const nat = h.E.NATIONAL;
    const natShare = nat.auto[h.lastYear][0] / nat.practical[h.lastYear].t[0];
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const avgMiles = c.near.length ? c.near.reduce((s, n) => s + n.miles, 0) / c.near.length : 0;
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    return `
<h2>${over15 > vals.length / 2 ? 'A queue measured in months' : 'The queue month by month'}</h2>
<p>In ${h.num(over15)} of the ${h.num(vals.length)} months DVSA has published for Cambridge, the median wait was 15 weeks or more; the longest was ${h.wk(hi.v)}, in ${h.month(hi.k)}. ${c.wait ? `The first tenth of the latest month's tests had been booked ${h.wk(c.wait.w10)} ahead, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : ''} GOV.UK releases new dates ${h.P.rules.releaseWeeksAhead} weeks ahead, and since 12 May 2026 only the learner can book or change a test; apps that hunted for cancellations on a learner's behalf are no longer allowed. The ${h.a('driving-test-booking-rules-2026', 'booking rules page')} covers the changes, and ${h.a('driving-test-waiting-times', 'waiting times by centre')} shows how Cambridge compares.</p>
${h.waitTable(ID, 12)}
<h2>Results at Brookmount Court</h2>
<p>Cambridge ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the ${c.region} and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} in Britain in ${h.yearLabel(h.lastYear)}. Its caseload went from ${h.num(f.pass[ys[0]][0])} tests in ${h.yearLabel(ys[0])} to ${h.num(c.tests)}, and its rate from ${h.pc(c.rateOf(ys[0]))} to ${h.pc(c.rate)}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and seventeen-year-olds ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))}. Men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}. ${ages.length < 9 ? 'The DVSA age table lacks a row for at least one age between 17 and 25 at this centre.' : ''}</p>
${h.yearTable(ID)}
<p>Automatic cars made up ${h.pc(c.autoShare, 0)} of tests at Cambridge, ${(c.autoShare ?? 0) < natShare ? 'below' : 'above'} the ${h.pc(natShare, 0)} share across Britain, and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars.</p>
<h2>Alternatives ${avgMiles >= 20 ? 'a long drive away' : 'within reach'}</h2>
<p>The DVSA list for Cambridge is ${c.near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles`).join(', ')}, an average of ${h.num(Math.round(avgMiles))} miles. ${quick ? `${short(quick.name)} had the shortest median wait in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}, and a ${h.yearLabel(h.lastYear)} pass rate of ${h.pp(quick.rate)}.` : ''} ${avgMiles >= 20 ? 'Moving a test that far means practising on unfamiliar roads and travelling on the day, which some learners will weigh against an earlier date.' : ''} Their pass rates in ${h.yearLabel(h.lastYear)} were ${c.near.map((n) => `${h.pp(n.rate)} at ${short(n.name)}`).join(', ')}, against ${h.pc(c.rate)} at Cambridge. Each move counts as one of the ${h.num(h.P.rules.changesAllowed)} changes allowed; see the ${h.a('move-driving-test-centre', 'moving guide')}.</p>
${h.nearTable(ID)}
<h2>Theory centre and cancellations</h2>
<p>${(() => { const th = h.E.THEORY_CENTRES.find((x) => x.id === 'cambridge'); return th ? `The Cambridge theory test centre passed ${h.pc(h.E.theoryRate(th))} of its candidates in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} nationally; the ${h.a('theory-test-pass-rates', 'theory pass rates page')} ranks every theory centre.` : ''; })()} ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} practical tests at Brookmount Court over the year, ${h.num(c.cancel.weather)} of them for weather.` : ''}</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')}, ${h.src('gov_release', 'GOV.UK release schedule')} and ${h.src('gov_find_centre', 'GOV.UK centre finder')}.</p>
`;
  },
});

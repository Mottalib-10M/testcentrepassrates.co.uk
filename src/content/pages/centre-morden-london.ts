import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'morden-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 604,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-tolworth-london', 'centre-mitcham-london', 'centre-west-wickham-london', 'region-london', 'driving-test-cancellations', 'theory-test-pass-rates'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'morden-driving-test-centre',
  nav: 'Morden',
  card: 'Morden SM4: a rising pass rate, many examiner cancellations and three alternatives.',
  title: `Morden Driving Test Centre: Pass Rate ${YL} and Waits`,
  description: `Morden driving test centre on Tudor Drive, SM4: DVSA car pass rate for ${YL}, its trend, cancellations by DVSA, the latest wait and the Morden theory centre.`,
  h1: 'Morden driving test centre: pass rate, cancellations and wait',
  intro: 'Tudor Drive, SM4: a south-west London car centre whose results have moved over three years, set beside Tolworth, Mitcham and West Wickham.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `Morden passed ${h.pc(c.rate)} of its car practical tests in ${h.yearLabel(h.lastYear)}, according to DVSA: ${h.num(c.passes)} passes from ${h.num(c.tests)} tests. Three years earlier the rate was ${h.pp(c.l.p[0])}, so the centre has ${t > 0 ? 'gained' : t < 0 ? 'lost' : 'kept'} ${t === 0 ? 'its level' : h.pts(Math.abs(t)).replace('+', '')} over that time. The latest figure is ${c.rate! > h.gb.rate ? 'higher' : 'lower'} than the British rate of ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'higher' : 'lower'} than London's ${h.pc(c.regionRate)}, which puts Morden ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres. ${c.wait ? `As for waiting, tests taken in ${h.month(c.wait.month)} had been booked a median ${h.wk(c.wait.median)} beforehand, where Britain's median was ${h.wk(h.gb.wait?.[3])} and London's ${h.wk(c.regionWait?.[3])}${c.waitYearAgo != null ? `; in the same month a year earlier Morden's stood at ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has published no recent wait for Morden.'} Morden is a car centre first: GOV.UK lists it for ${c.types} tests. The figures below are updated as DVSA releases each month's tables, and the finder above compares Morden with every centre around SM4, rate and wait side by side.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'morden');
    return [
      { q: 'Is the Morden pass rate better than Mitcham?', a: `${(() => { const m = c.near.find((n) => n.id === 'mitcham-london'); return m ? `In ${h.yearLabel(h.lastYear)} Morden passed ${h.pc(c.rate)} and Mitcham, ${h.num(m.miles)} miles away, ${h.pp(m.rate)}, so Morden was ${(c.rate ?? 0) * 100 > (m.rate ?? 0) ? 'ahead' : 'behind'}. In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} at Morden and ${h.wk(m.wait)} at Mitcham.` : 'Mitcham is no longer on the DVSA list of nearest centres for Morden.'; })()} ${h.C('mitcham-london').near.some((n) => n.id === ID) && c.near.some((n) => n.id === 'mitcham-london') ? 'Each centre is on the other\'s DVSA list, so a test can be moved either way' : 'Check the DVSA list of nearest centres before planning a move'}, using one of the changes a booking allows.` },
      { q: 'Is there a theory test centre in Morden?', a: `${th ? `Yes. DVSA publishes results for a Morden theory test centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain. The theory test costs £${h.num(h.P.fees.theory)} and the practical test at the Tudor Drive centre is booked afterwards on GOV.UK.` : `DVSA's latest theory table does not list a Morden theory centre. The theory test costs £${h.num(h.P.fees.theory)} and must be passed before the practical test at the Tudor Drive centre can be booked on GOV.UK.`}` },
      { q: 'How often does DVSA cancel tests at Morden?', a: `${c.cancel ? `In ${h.yearLabel(h.lastYear)} DVSA cancelled ${h.num(c.cancel.total)} Morden tests, about ${(Math.round((c.cancel.total / c.tests) * 1000) / 10).toFixed(1)} for every 100 conducted. Examiner illness accounted for ${h.num(c.cancel.medical)}, leave or training for ${h.num(c.cancel.leave)} and weather for ${h.num(c.cancel.weather)}. A cancelled candidate is offered a new date at no extra cost and can claim some out-of-pocket expenses from DVSA.` : 'DVSA has not published cancellation counts for Morden for the latest year. When DVSA cancels a test, the candidate is offered a new date and does not pay again, and may claim some out-of-pocket costs.'}` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number; medical: number }>)[h.lastYear];
    const natPer = nat ? (nat.total / h.E.NATIONAL.practical[h.lastYear].t[0]) * 100 : null;
    const per = c.cancel ? (c.cancel.total / c.tests) * 100 : null;
    const ms = h.F.months(f).slice(-12);
    const low = ms.filter((k) => f.wait[k][0] != null).reduce((a, k) => ((f.wait[k][0] as number) < (f.wait[a][0] as number) ? k : a), ms[ms.length - 1]);
    const near = c.near;
    const fmt = (n: (typeof near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const higher = near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100);
    const quicker = near.filter((n) => n.wait != null && c.wait?.median != null && n.wait < c.wait.median);
    return `
<h2>Three years of ${(c.trend3 ?? 0) >= 0 ? 'gains' : 'losses'}</h2>
<p>From ${h.pp(c.l.p[0])} to ${h.pp(c.l.p[1])} and then ${h.pp(c.l.p[2])}: those are Morden's last three yearly rates, ${c.l.p[0] != null && c.l.p[1] != null && c.l.p[2] != null && c.l.p[0] < c.l.p[1] && c.l.p[1] < c.l.p[2] ? 'a rise in each year' : c.l.p[0] != null && c.l.p[1] != null && c.l.p[2] != null && c.l.p[0] > c.l.p[1] && c.l.p[1] > c.l.p[2] ? 'a fall in each year' : 'a path that has not moved in one direction only'}. The number of tests reached ${h.num(Math.max(...c.years.map((y) => f.pass[y][0])))} at its highest in the five-year series and stood at ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. Nationally the rate ended the period at ${h.pc(h.gb.rate)}.</p>
${h.yearTable(ID)}
<h2>Cancellations by DVSA</h2>
<p>${c.cancel && per != null ? `Morden lost ${h.num(c.cancel.total)} tests to DVSA cancellations in ${h.yearLabel(h.lastYear)}, roughly ${(Math.round(per * 10) / 10).toFixed(1)} per 100 tests conducted${natPer != null ? `, ${per > natPer ? 'more than' : 'no more than'} the British average of about ${(Math.round(natPer * 10) / 10).toFixed(1)}` : ''}. The largest cause was examiner illness (${h.num(c.cancel.medical)}), followed by leave or training (${h.num(c.cancel.leave)}); weather accounted for ${h.num(c.cancel.weather)}. Each cancellation means a candidate rebooked and a slot pushed back into the queue, which may be one reason the published waits shift abruptly.` : 'DVSA has not published cancellation counts for Morden for the latest year.'} The ${h.a('driving-test-cancellations', 'cancellations page')} gives the national series and what a candidate can claim.</p>
<h2>The wait in SM4</h2>
<p>${c.wait ? `Morden's latest median, ${h.wk(c.wait.median)} in ${h.month(c.wait.month)}, compares with a twelve-month low of ${h.wk(f.wait[low][0])} in ${h.month(low)}. ${h.pp(c.wait.in7)} of the tests that month had been booked within seven weeks, while the first tenth of its slots had gone ${h.wk(c.wait.w10)} ahead.` : 'No recent wait is published for Morden.'} DVSA releases dates up to ${h.P.rules.releaseWeeksAhead} weeks ahead, and only the learner may book since 12 May 2026.</p>
${h.waitTable(ID, 12)}
<h2>${near.map((n) => short(n.name)).join(', ').replace(/, ([^,]*)$/, ' or $1')}</h2>
<p>These are the three centres DVSA names as nearest to Morden, and so the only places a Morden test can be moved to: ${near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles`).join(', ')}. ${higher.length ? `${higher.map((n) => short(n.name)).join(' and ')} passed a higher share of candidates in ${h.yearLabel(h.lastYear)}.` : 'None of them passed a higher share of candidates in the latest year.'} ${quicker.length ? `${quicker.map((n) => short(n.name)).join(' and ')} had a shorter median wait in ${h.month(h.lastMonth)}.` : `None had a shorter median wait in ${h.month(h.lastMonth)}.`} A centre that scores on both counts is the one worth a look; otherwise the choice is between a better rate and an earlier date.</p>
${h.nearTable(ID)}
<h2>Who passes at Morden</h2>
<p>Seventeen-year-olds at Morden passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} for that age across Britain. First-time candidates managed ${h.pc(c.first)} and ${h.num(c.zero)} of them drove without a single fault. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. In automatic cars, which made up ${h.pc(c.autoShare, 0)} of tests, the rate was ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} in manual cars. These splits come from the same DVSA centre tables and carry the same caveat: they describe who took the test here, not why they passed. DVSA does not publish test routes for Morden or any other centre.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

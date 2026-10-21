import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'isleworth-fleming-way';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 607,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-southall-london', 'centre-tolworth-london', 'region-london', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'isleworth-driving-test-centre',
  nav: 'Isleworth',
  card: 'Isleworth, Fleming Way TW7: pass rate by age, access note, wait and alternatives.',
  title: `Isleworth Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Isleworth driving test centre, Fleming Way TW7: DVSA car pass rate for ${YL}, results for young drivers, the access note, the latest wait and 3 alternatives.`,
  h1: 'Isleworth driving test centre (Fleming Way): pass rate and wait',
  intro: 'Fleming Way, TW7: a west London car centre, with its results for young candidates, its access note and the three centres DVSA links it to.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `Isleworth driving test centre, on Fleming Way, conducted ${h.num(c.tests)} car practical tests in ${h.yearLabel(h.lastYear)} and ${h.num(c.passes)} of them were passes, so ${h.pc(c.rate)} of candidates came away with a licence. The British rate that year was ${h.pc(h.gb.rate)} and the London rate ${h.pc(c.regionRate)}; ${(c.rate! > h.gb.rate) === (c.rate! > (c.regionRate ?? 0)) ? `Isleworth was ${c.rate! > h.gb.rate ? 'ahead of' : 'behind'} both` : `Isleworth was ${c.rate! > h.gb.rate ? 'ahead of' : 'behind'} the first and ${c.rate! > (c.regionRate ?? 0) ? 'ahead of' : 'behind'} the second`}, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres. Its three-year movement is ${h.pts(t)}. ${c.wait ? `The DVSA waiting table for ${h.month(c.wait.month)} gives a median of ${h.wk(c.wait.median)} from booking to test here${c.waitYearAgo != null ? ` (${h.wk(c.waitYearAgo)} a year earlier)` : ''}, while Britain's median stood at ${h.wk(h.gb.wait?.[3])} and London's at ${h.wk(c.regionWait?.[3])}.` : 'No recent wait has been published for Isleworth.'} ${c.notes.length ? `One practical point before booking: GOV.UK states that ${c.notes[0].replace(/^You /, 'you ').replace(/\.$/, '')}.` : 'GOV.UK currently lists no access restriction for the centre.'} The rest of this page breaks the rate down by age, follows the wait month by month and compares the three permitted alternatives.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const steps = c.notes.join(' ');
    return [
      { q: 'Is Isleworth driving test centre wheelchair accessible?', a: `${steps ? `GOV.UK says: "${steps}"` : 'GOV.UK currently lists no access note for the centre.'} Candidates who need an adjustment should say so when booking on GOV.UK. For the alternatives DVSA lists for Isleworth (${c.near.map((n) => short(n.name)).join(', ')}), check each centre's GOV.UK page for its access details before using a change to move there.` },
      { q: 'Do 17-year-olds pass more often at Isleworth?', a: `In ${h.yearLabel(h.lastYear)} 17-year-olds at Isleworth passed ${h.pc(c.age['17'])} of their tests, against ${h.pc(h.E.ageRate(17))} for 17-year-olds across Great Britain and ${h.pc(c.rate)} for all ages at the centre. The figure rests on a few hundred tests, so it can move by several points from one year to the next.` },
      { q: 'Is Southall quicker than Isleworth for a driving test?', a: `${(() => { const s = c.near.find((n) => n.id === 'southall-london'); return s ? `In ${h.month(h.lastMonth)} Southall's median wait was ${h.wk(s.wait)}, against ${h.wk(c.wait?.median)} at Isleworth, so it was ${(s.wait ?? 99) < (c.wait?.median ?? 0) ? 'quicker' : 'not quicker'}. Its pass rate in ${h.yearLabel(h.lastYear)} was ${h.pp(s.rate)}, against ${h.pc(c.rate)}.` : 'Southall is no longer on the DVSA list of centres a test booked at Isleworth can be moved to.'; })()} Waits change from month to month, and each move uses one of the changes a booking allows, so check again before moving.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0));
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const long = vals.filter((x) => x.v >= 20).length;
    const lo = vals.reduce((a, b) => (b.v < a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const both = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100 && n.wait != null && c.wait?.median != null && n.wait < c.wait.median);
    const addr = c.addr.map((x) => x.replace(/,\s*,/g, ',')).join(', ');
    return `
<h2>Young candidates and the age table</h2>
<p>${above.length > ages.length / 2 ? 'Age is where Isleworth\'s figures look strongest.' : 'Age does not lift Isleworth\'s figures much.'} ${above.length === ages.length ? `Every age from 17 to 25 passed more often here than the same age across Britain.` : `${h.num(above.length)} of the ${h.num(ages.length)} age groups shown passed more often here than the same age across Britain.`} Seventeen-year-olds reached ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} nationally. DVSA's centre table stops at 25, so older candidates appear only in the overall rate. Men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}. The national pattern is set out in ${h.a('pass-rate-by-age-and-sex', 'pass rates by age and sex')}.</p>
${h.ageTable(ID)}
<h2>${long > vals.length / 3 ? 'Long stretches near the booking horizon' : 'How the queue has moved'}</h2>
<p>${h.num(long)} of the ${h.num(vals.length)} months of DVSA data for Isleworth show a median wait of 20 weeks or more. The shortest month was ${h.month(lo.k)}, at ${h.wk(lo.v)}. ${c.wait ? `In ${h.month(c.wait.month)} the median was ${h.wk(c.wait.median)} and ${h.pp(c.wait.in7)} of tests had been booked inside seven weeks.` : ''} New test dates are released ${h.P.rules.releaseWeeksAhead} weeks ahead, so a median of 20 weeks or more suggests that most candidates booked soon after release. ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests during ${h.yearLabel(h.lastYear)} (${h.num(c.cancel.medical)} for examiner illness, ${h.num(c.cancel.leave)} for leave or training), and those freed slots go back on sale.` : ''}</p>
${h.waitTable(ID, 12)}
<h2>Three permitted moves</h2>
<p>For a test booked at Isleworth, the 2026 rules allow a move to ${c.near.map((n) => `${fmt(n)}, ${h.num(n.miles)} miles away (${h.pp(n.rate)}, median wait ${h.wk(n.wait)})`).join('; ')}. ${both.length ? `${both.map((n) => short(n.name)).join(' and ')} combined a higher pass rate with a shorter wait in the latest data.` : 'None of the three combined a higher pass rate with a shorter wait in the latest data, so a move means choosing one advantage over the other.'} Every change counts against the ${h.num(h.P.rules.changesAllowed)} allowed per booking.</p>
${h.nearTable(ID)}
<h2>The centre itself</h2>
<p>GOV.UK gives the address as ${addr} and lists the centre for ${c.types} tests. ${c.notes.length ? `Its access note reads: "${c.notes.join(' ')}"` : ''} The rate has moved by ${h.pts(c.trend3)} over three years, from ${h.pp(c.l.p[0])}, and first-time candidates passed ${h.pc(c.first)}. Automatic cars made up ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars. Over the five DVSA years the caseload ranged from ${h.num(Math.min(...c.years.map((y) => f.pass[y][0])))} to ${h.num(Math.max(...c.years.map((y) => f.pass[y][0])))} tests. DVSA does not publish the routes examiners use. The ${h.a('driving-test-waiting-times', 'waiting times page')} compares the queue here with every other centre.</p>
<p>Data from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waits')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

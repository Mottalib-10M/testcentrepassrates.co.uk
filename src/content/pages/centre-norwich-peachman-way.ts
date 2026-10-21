import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'norwich-peachman-way';
const short = (n: string) => n.replace(/ \(.*\)$/, '').replace(/\(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 623,
  tool: { kind: 'finder', props: { centre: ID, radius: 25 } },
  related: ['region-east-of-england', 'easiest-driving-test-centres', 'driving-test-faults', 'driving-test-cancellations', 'centre-ipswich'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'norwich-driving-test-centre',
  nav: 'Norwich',
  card: 'Norwich NR7: pass rate and rank, fault-free drives, weather cancellations and the wait.',
  title: `Norwich Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Norwich driving test centre, Peachman Way NR7: DVSA car pass rate for ${YL}, its national rank, fault-free passes, weather cancellations and the latest wait.`,
  h1: 'Norwich driving test centre (Peachman Way): pass rate and wait',
  intro: 'Peachman Way, Broadlands Business Park, NR7: the Norwich centre for cars and motorcycles, read against its nearest DVSA alternatives.',
  resume: (h) => {
    const c = h.C(ID);
    return `Norwich (Peachman Way) passed ${h.pc(c.rate)} of car practical tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.passes)} out of ${h.num(c.tests)}, which placed it ${h.ord(c.rankGB)} of the ${h.num(c.ofGB)} British centres with at least a thousand tests and ${h.ord(c.rankRegion)} of ${c.ofRegion} in the ${c.region}. The regional rate was ${h.pc(c.regionRate)} and the British one ${h.pc(h.gb.rate)}. Its three-year change is ${h.pts(c.trend3)}. ${c.wait ? `Candidates tested in ${h.month(c.wait.month)} had booked a median ${h.wk(c.wait.median)} ahead${c.waitYearAgo != null ? `, ${c.wait.median != null && c.wait.median < c.waitYearAgo ? 'down' : 'up'} from ${h.wk(c.waitYearAgo)} a year earlier` : ''}, against ${h.wk(c.regionWait?.[3])} across the region and ${h.wk(h.gb.wait?.[3])} across Britain.` : 'DVSA has not published a recent wait for Norwich.'} ${c.rate! > h.gb.rate ? 'A high' : 'A'} rate here describes the candidates who tested at Norwich; DVSA marks every centre to the same standard, so it is not evidence of an easier or harder test. The figures on this page are reloaded from DVSA each month, and the finder above shows every centre within reach of NR7${Math.min(...c.near.map((n) => n.miles)) >= 20 ? ', though the nearest are some distance away' : ''}.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'norwich');
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    return [
      { q: 'Is Norwich one of the easiest driving test centres?', a: `By pass rate it ranked ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} British centres in ${h.yearLabel(h.lastYear)}, at ${h.pc(c.rate)}. "Easiest" is shorthand for a high rate among past candidates; the marking standard is the same everywhere. First-time candidates at Norwich passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally.` },
      { q: 'How many Norwich candidates pass with no faults?', a: `${h.num(c.zero)} of ${h.num(c.firstTests)} first-time candidates at Norwich passed in ${h.yearLabel(h.lastYear)} with no driving fault at all, or ${h.pc(c.zero / (c.firstTests || 1))}. Across Britain the share was ${h.pc(nf[2] / nf[0])}. A pass allows up to fifteen minor faults, so a clean sheet is a demanding standard.` },
      { q: 'What is the theory test pass rate in Norwich?', a: `${th ? `DVSA's Norwich theory test centre passed ${h.pc(h.E.theoryRate(th))} of theory tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain.` : 'DVSA does not list a Norwich theory centre in its latest table.'} Theory and practical rates measure different tests and different groups of candidates, so they cannot be compared directly. The theory test costs £${h.num(h.P.fees.theory)} and must be passed first.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const zr = c.zero / (c.firstTests || 1);
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number; weather: number }>)[h.lastYear];
    const ws = c.cancel && c.cancel.total ? c.cancel.weather / c.cancel.total : null;
    const natShare = h.E.NATIONAL.auto[h.lastYear][0] / h.E.NATIONAL.practical[h.lastYear].t[0];
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const minMiles = c.near.length ? Math.min(...c.near.map((n) => n.miles)) : 0;
    const lower = c.near.filter((n) => n.rate != null && n.rate < (c.rate ?? 0) * 100);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0));
    return `
<h2>Clean drives at Norwich</h2>
<p>The share of first-time candidates who pass without a single fault is ${zr > (nf[2] / nf[0]) * 2 ? 'unusually high' : zr > nf[2] / nf[0] ? 'above average' : 'not above average'} at Norwich: ${h.num(c.zero)} of ${h.num(c.firstTests)}, or ${h.pc(zr)}, against ${h.pc(nf[2] / nf[0])} of first attempts across Britain. The overall first-time rate was ${h.pc(c.first)}. DVSA does not record why, and the figure counts only drives with no fault of any kind. The ${h.a('driving-test-faults', 'driving test faults page')} lists the faults most often recorded nationally.</p>
<h2>Weather in the cancellation figures</h2>
<p>${c.cancel && ws != null ? `DVSA cancelled ${h.num(c.cancel.total)} Norwich tests in ${h.yearLabel(h.lastYear)}, and weather accounted for ${h.num(c.cancel.weather)} of them, ${h.pc(ws, 0)} of the total${nat ? `, against ${h.pc(nat.weather / nat.total, 0)} of cancellations nationally` : ''}. Examiner illness caused ${h.num(c.cancel.medical)} and leave or training ${h.num(c.cancel.leave)}. A test called off for weather is rebooked at no cost to the candidate.` : 'DVSA has not published Norwich cancellation counts for the latest year.'} The ${h.a('driving-test-cancellations', 'cancellations page')} sets out what candidates can claim.</p>
<h2>Five years and the age table</h2>
<p>Norwich conducted ${h.num(f.pass[ys[0]][0])} car tests in ${h.yearLabel(ys[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}; its rate moved from ${h.pc(c.rateOf(ys[0]))} to ${h.pc(c.rate)}, while Britain's went from ${h.pc(h.E.gbRate(ys[0]))} to ${h.pc(h.gb.rate)}. ${above.length === ages.length ? 'Every age group from 17 to 25' : `${h.num(above.length)} of the ${h.num(ages.length)} age groups`} passed more often here than the same age nationally, with seventeen-year-olds at ${h.pc(c.age['17'])}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}.</p>
${h.yearTable(ID)}
${h.ageTable(ID)}
<p>Automatic cars were ${(c.autoShare ?? 0) < natShare ? 'less common' : 'more common'} here than nationally, ${h.pc(c.autoShare, 0)} of tests against ${h.pc(natShare, 0)}, and passed ${h.pc(c.auto)} against ${h.pp(c.l.mn)} for manuals. GOV.UK lists the centre for ${c.types}.</p>
<h2>The queue and the distance to the next centre</h2>
<p>${c.wait ? `The latest Norwich median is ${h.wk(c.wait.median)}, with ${h.pp(c.wait.in7)} of candidates booked inside seven weeks and the first tenth of slots taken ${h.wk(c.wait.w10)} ahead.` : 'No recent wait is published for Norwich.'} The three centres DVSA lists as nearest are ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles, ${h.pp(n.rate)})`).join(', ')}; the closest is ${h.num(minMiles)} miles away. ${lower.length === c.near.length ? 'All three had a lower pass rate than Norwich in the latest year, so a move would be about the date alone.' : 'At least one of them had a pass rate at or above Norwich in the latest year.'}</p>
${h.nearTable(ID)}
<p>${(() => { const th = h.E.THEORY_CENTRES.find((x) => x.id === 'norwich'); return th ? `Norwich also has a DVSA theory test centre, with a ${h.yearLabel(h.lastYear)} theory pass rate of ${h.pc(h.E.theoryRate(th))}. ` : ''; })()}The practical centre is at ${c.addr.join(', ')}. Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')} and ${h.src('gov_find_centre', 'the GOV.UK finder')}.</p>
`;
  },
});

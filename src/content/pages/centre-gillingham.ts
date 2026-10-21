import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'gillingham';
const short = (n: string) => n.replace(/ \(.*\)$/, '');
const words = ['no', 'one', 'two', 'three', 'four', 'five'];

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 620,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-south-east', 'easiest-driving-test-centres', 'pass-rate-by-age-and-sex', 'driving-test-cancellations', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'gillingham-driving-test-centre',
  nav: 'Gillingham',
  card: 'Gillingham ME8: car pass rate, young drivers, motorcycle tests and where to move.',
  title: `Gillingham Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Gillingham driving test centre, ME8: DVSA car pass rate for ${YL}, its South East rank, results for 17-year-olds, the latest wait and Maidstone nearby.`,
  h1: 'Gillingham driving test centre: pass rate and waiting time',
  intro: 'Astra Park, Courteney Road, ME8: a Medway centre for cars and motorcycles, with its results by age and its DVSA list of alternatives.',
  resume: (h) => {
    const c = h.C(ID);
    return `Gillingham, in Kent, passed ${h.pc(c.rate)} of the ${h.num(c.tests)} car practical tests it conducted in ${h.yearLabel(h.lastYear)}, ${h.num(c.passes)} passes in total. The ${c.region} rate was ${h.pc(c.regionRate)} and Great Britain's ${h.pc(h.gb.rate)}, so the centre stood ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} its region and ${c.rate! > h.gb.rate ? 'above' : 'below'} the national figure, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} ${c.region} centres and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} in Britain. Its rate moved ${h.pts(c.trend3)} over three years. ${c.wait ? `On waiting, the ${h.month(c.wait.month)} median between booking and test was ${h.wk(c.wait.median)}, compared with ${h.wk(c.regionWait?.[3])} across the ${c.region} and ${h.wk(h.gb.wait?.[3])} across Britain${c.waitYearAgo != null ? `; in the same month a year earlier Gillingham's median was ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has not published a recent wait for Gillingham.'} The centre also hosts motorcycle tests, which are not counted in these car figures. Everything on this page is refreshed monthly from DVSA, and the finder above compares Gillingham with every centre within reach of ME8.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const n = c.near.length;
    return [
      { q: 'How many alternative centres does Gillingham have?', a: `GOV.UK lists ${words[n] ?? h.num(n)} nearest centre${n === 1 ? '' : 's'} for Gillingham: ${c.near.map((x) => `${short(x.name)} (${h.num(x.miles)} miles)`).join(' and ')}. ${n < 3 ? 'Most centres in Britain have three on their list, but the Gillingham list is shorter.' : ''} Since 9 June 2026 a car test can only be moved to a centre on that list, so the choice here is limited to ${n === 1 ? 'that centre' : 'those centres'}.` },
      { q: 'Do 17-year-olds pass more at Gillingham?', a: `In ${h.yearLabel(h.lastYear)} 17-year-olds passed ${h.pc(c.age['17'])} of their Gillingham tests, against ${h.pc(h.E.ageRate(17))} for that age across Britain and ${h.pc(c.rate)} for all candidates at the centre. Rates by age come from DVSA table DRT122D, and each age group holds a few hundred tests here.` },
      { q: 'Can I take a motorcycle test at Gillingham?', a: `${/motorcycle/.test(c.types) ? 'Yes.' : 'Not at present.'} GOV.UK lists Gillingham for ${c.types}. Motorcycle results are published by DVSA in separate tables and are not part of the car pass rate on this page. Bookings for any test type are made on GOV.UK by the candidate.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0));
    const missing = ['17', '18', '19', '20', '21', '22', '23', '24', '25'].filter((k) => !ages.includes(k));
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number; weather: number }>)[h.lastYear];
    const ws = c.cancel && c.cancel.total ? c.cancel.weather / c.cancel.total : null;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const ratio = c.tests / f.pass[ys[0]][0];
    const ms = h.F.months(f).slice(-12);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    return `
<h2>${['17', '18', '19'].includes(ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a))) ? 'Teenagers lead the age table' : 'Results by age'}</h2>
<p>${above.length === ages.length ? 'Every age group DVSA publishes for Gillingham' : `${h.num(above.length)} of the ${h.num(ages.length)} age groups DVSA publishes for Gillingham`} passed more often than the same age across Britain in ${h.yearLabel(h.lastYear)}. Seventeen-year-olds reached ${h.pc(c.age['17'])} and eighteen-year-olds ${h.pc(c.age['18'])}. ${missing.length ? `There is no row for ${missing.map((k) => `${k}-year-olds`).join(' or ')}, which DVSA did not publish for this centre.` : ''} First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} of them drove without a recorded fault. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. The ${h.a('pass-rate-by-age-and-sex', 'national age and sex tables')} give the comparison column.</p>
${h.ageTable(ID)}
<h2>${ratio >= 1.5 ? 'A much larger caseload than in' : 'The caseload since'} ${h.yearLabel(ys[0])}</h2>
<p>Gillingham carried out ${h.num(f.pass[ys[0]][0])} car tests in ${h.yearLabel(ys[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. Its rate moved from ${h.pc(c.rateOf(ys[0]))} to ${h.pc(c.rate)} over that span, while Britain's went from ${h.pc(h.E.gbRate(ys[0]))} to ${h.pc(h.gb.rate)}. Automatic cars made up ${h.pc(c.autoShare, 0)} of tests in the latest year and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} in manual cars.</p>
${h.yearTable(ID)}
<h2>Weather, illness and the wait</h2>
<p>${c.cancel && ws != null ? `DVSA cancelled ${h.num(c.cancel.total)} Gillingham tests in ${h.yearLabel(h.lastYear)}. Weather caused ${h.num(c.cancel.weather)} of them, ${h.pc(ws, 0)} of the total${nat ? `, against ${h.pc(nat.weather / nat.total, 0)} of cancellations nationally` : ''}; examiner illness caused ${h.num(c.cancel.medical)} and leave or training ${h.num(c.cancel.leave)}.` : 'DVSA has not published Gillingham cancellation counts for the latest year.'} ${vals.length ? `Over the last twelve months the median wait ranged from ${h.wk(Math.min(...vals))} to ${h.wk(Math.max(...vals))}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)}, ${h.pp(c.wait.in7)} of candidates had booked within seven weeks, and the first tenth of slots went ${h.wk(c.wait.w10)} ahead.` : ''} The ${h.a('driving-test-cancellations', 'cancellations page')} explains rebooking and expenses.</p>
${h.waitTable(ID, 12)}
<h2>Where a Gillingham test can go</h2>
<p>The GOV.UK list of nearest centres for Gillingham holds ${words[c.near.length] ?? h.num(c.near.length)} name${c.near.length === 1 ? '' : 's'}: ${c.near.map((n) => `${fmt(n)}, ${h.num(n.miles)} miles away, with a ${h.yearLabel(h.lastYear)} rate of ${h.pp(n.rate)} and a median wait of ${h.wk(n.wait)}`).join('; ')}. A test can be moved only to a centre on that list, using one of the ${h.num(h.P.rules.changesAllowed)} changes allowed per booking. ${(() => { const up = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100); const q = c.near.filter((n) => n.wait != null && c.wait?.median != null && n.wait < c.wait.median); return `${up.length ? `${up.map((n) => short(n.name)).join(' and ')} recorded a higher pass rate than Gillingham` : 'No centre on the list recorded a higher pass rate than Gillingham'}, and ${q.length ? `${q.map((n) => short(n.name)).join(' and ')} a shorter median wait` : 'none a shorter median wait'} in the latest figures.`; })()} The ${h.a('move-driving-test-centre', 'moving guide')} sets out the process.</p>
<h2>Motorcycles and instructors</h2>
<p>GOV.UK lists Gillingham for ${c.types}. ${/module 1/.test(c.types) && /module 2/.test(c.types) ? 'Riders can therefore take both parts of the motorcycle test here, the off-road manoeuvres and the on-road ride.' : 'Not every part of the motorcycle test is listed for the centre.'} Instructor candidates are examined here as well. None of those results are mixed into the car figures on this page, which come from DVSA's car practical tables alone.</p>
${h.nearTable(ID)}
<p>The centre is at ${c.addr.join(', ')}. Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')} and ${h.src('gov_nearest', 'the GOV.UK nearest-centre list')}.</p>
`;
  },
});

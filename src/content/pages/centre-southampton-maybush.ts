import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'southampton-maybush';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 621,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-south-east', 'automatic-driving-test-pass-rates', 'theory-test-pass-rates', 'driving-test-pass-rates-by-year', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'southampton-maybush-driving-test-centre',
  nav: 'Southampton (Maybush)',
  card: 'Southampton Maybush SO16: pass rate trend, manual and automatic, wait and options.',
  title: `Southampton (Maybush) Driving Test Centre: ${YL} Pass Rate`,
  description: `Southampton (Maybush) driving test centre, SO16: DVSA car pass rate for ${YL}, its three-year trend, manual and automatic results, the wait and Winchester.`,
  h1: 'Southampton (Maybush) driving test centre: pass rate and wait',
  intro: 'Green Lane, Maybush, SO16: the Southampton car test centre, followed over five years and compared with Winchester, Lee-on-the-Solent and Portsmouth.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    const w = c.wait;
    return `Over the last three DVSA years the car pass rate at Southampton's Maybush centre ${t > 0 ? 'rose' : t < 0 ? 'fell' : 'held steady'} from ${h.pp(c.l.p[0])} to ${h.pc(c.rate)}, ${t === 0 ? 'no net change' : `a change of ${h.pts(t)}`}. The latest year, ${h.yearLabel(h.lastYear)}, counted ${h.num(c.tests)} tests and ${h.num(c.passes)} passes. Set against the ${c.region} rate of ${h.pc(c.regionRate)} and Britain's ${h.pc(h.gb.rate)}, Maybush is ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} its region and ${c.rate! > h.gb.rate ? 'above' : 'below'} the country, ranking ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the ${c.region}. ${w ? `Candidates tested in ${h.month(w.month)} had booked a median ${h.wk(w.median)} ahead${c.waitYearAgo != null ? `, ${w.median === c.waitYearAgo ? 'the same as' : w.median != null && w.median < c.waitYearAgo ? 'shorter than' : 'longer than'} the ${h.wk(c.waitYearAgo)} of the same month a year before` : ''}. The regional median that month was ${h.wk(c.regionWait?.[3])} and the British one ${h.wk(h.gb.wait?.[3])}.` : 'DVSA has published no recent wait for Maybush.'} The page goes on to manual and automatic results, the five-year series and the three alternatives DVSA allows. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally. Figures are refreshed monthly from the DVSA tables.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'southampton');
    return [
      { q: 'Is the Southampton Maybush pass rate improving?', a: `Over three years it moved ${h.pts(c.trend3)}, from ${h.pp(c.l.p[0])} to ${h.pc(c.rate)}; the yearly figures were ${c.l.p.map((p) => h.pp(p)).join(', ')}. ${(c.trend3 ?? 0) > 0 ? 'So yes, it has improved over that period' : 'So it has not improved over that period'}, while the British rate ended at ${h.pc(h.gb.rate)}. One year can still differ from the next by a point or two.` },
      { q: 'What is the theory test pass rate in Southampton?', a: `${th ? `DVSA lists a Southampton theory test centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain.` : 'DVSA does not list a Southampton theory centre in its latest table.'} The practical test at Maybush can be booked only once the theory test has been passed, at £${h.num(h.P.fees.practicalWeekday)} on a weekday.` },
      { q: 'Is Lee-on-the-Solent easier than Southampton Maybush?', a: `${(() => { const l = c.near.find((n) => n.id === 'lee-on-the-solent'); return l ? `In ${h.yearLabel(h.lastYear)} Lee-on-the-Solent passed ${h.pp(l.rate)} and Maybush ${h.pc(c.rate)}; it is ${h.num(l.miles)} miles away and its median wait in ${h.month(h.lastMonth)} was ${h.wk(l.wait)}, against ${h.wk(c.wait?.median)} at Maybush.` : 'Lee-on-the-Solent is not on the current DVSA list of centres nearest to Maybush.'; })()} A higher past rate does not mean easier marking: every DVSA examiner works to one standard.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nat = h.E.NATIONAL;
    const natShare = nat.auto[h.lastYear][0] / nat.practical[h.lastYear].t[0];
    const gapHere = (c.l.mn ?? 0) - (c.auto ?? 0) * 100;
    const low = ys.reduce((a, y) => (f.pass[y][0] < f.pass[a][0] ? y : a));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const higher = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100);
    const ms = h.F.months(f).slice(-12);
    const pts = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = pts.reduce((a, b) => (b.v < a.v ? b : a), pts[0] ?? { k: h.lastMonth, v: 0 });
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    return `
<h2>Five years at Maybush</h2>
<p>The quietest year in the DVSA series was ${h.yearLabel(low)}, with ${h.num(f.pass[low][0])} car tests; the latest counted ${h.num(c.tests)}. Over the whole span the rate moved from ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} to ${h.pc(c.rate)}, while Britain's moved from ${h.pc(h.E.gbRate(ys[0]))} to ${h.pc(h.gb.rate)}, so the gap between Maybush and the national figure has ${Math.abs((c.rate ?? 0) - h.gb.rate) < Math.abs((c.rateOf(ys[0]) ?? 0) - (h.E.gbRate(ys[0]) ?? 0)) ? 'narrowed' : 'widened or held'}. The ${h.a('driving-test-pass-rates-by-year', 'national series by year')} shows the same years for Britain as a whole.</p>
${h.yearTable(ID)}
<h2>${(c.autoShare ?? 0) < natShare ? 'Fewer automatics than the national mix' : 'Automatics at Maybush'}</h2>
<p>Automatic cars accounted for ${h.pc(c.autoShare, 0)} of tests at Maybush, against ${h.pc(natShare, 0)} nationally. Manual candidates passed ${h.pp(c.l.mn)} and automatic candidates ${h.pc(c.auto)}, a gap of ${h.pts(Math.abs(gapHere)).replace('+', '')} in favour of ${gapHere >= 0 ? 'manuals' : 'automatics'}. Across Britain automatics passed ${h.pc(h.gb.auto)}. Passing in an automatic restricts the licence to automatic cars, so the gearbox choice is about the car you will drive, not the odds. ${h.a('automatic-driving-test-pass-rates', 'Automatic pass rates by centre')} ranks every centre on this measure.</p>
<h2>Who passes, by age and sex</h2>
<p>The best rate among the ages DVSA publishes for Maybush belonged to ${best}-year-olds, at ${h.pc(c.age[best])}${best === '17' ? `, against ${h.pc(h.E.ageRate(17))} for 17-year-olds nationally` : `; seventeen-year-olds passed ${h.pc(c.age['17'])} against ${h.pc(h.E.ageRate(17))} nationally`}. ${ages.length < 9 ? 'At least one age between 17 and 25 has no row in the DVSA table for this centre.' : ''} Men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}, first-time candidates ${h.pc(c.first)}, and ${h.num(c.zero)} first attempts were completed with no fault. Each age group rests on a few hundred tests, so the table below is best read alongside its national column.</p>
${h.ageTable(ID)}
<h2>The wait and the alternatives</h2>
<p>${c.wait ? `The latest median at Maybush is ${h.wk(c.wait.median)}, against a twelve-month low of ${h.wk(lo.v)} in ${h.month(lo.k)}; ${h.pp(c.wait.in7)} of candidates in ${h.month(c.wait.month)} had booked within seven weeks, and the first tenth of slots went ${h.wk(c.wait.w10)} ahead.` : 'DVSA has published no recent wait for Maybush.'} ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.medical)} for examiner illness.` : ''}</p>
${h.waitTable(ID, 12)}
<p>Under the rule in force since 9 June 2026, a Maybush test can move to ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')} and nowhere else. ${higher.length === c.near.length ? 'All three passed a higher share of candidates in the latest year' : higher.length ? `${higher.map((n) => short(n.name)).join(' and ')} passed a higher share of candidates in the latest year` : 'None passed a higher share of candidates in the latest year'}; the table adds their waits, which decide whether a move would bring the test forward. Each move uses one of the ${h.num(h.P.rules.changesAllowed)} changes allowed on a booking.</p>
${h.nearTable(ID)}
<p>${c.notes.length ? `GOV.UK access note: "${c.notes.join(' ')}" ` : ''}The centre is at ${c.addr.join(', ')} and runs ${c.types} tests. Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')}, ${h.src('gov_find_centre', 'GOV.UK centre finder')}.</p>
`;
  },
});

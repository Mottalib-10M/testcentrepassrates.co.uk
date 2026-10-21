import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'mitcham-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 601,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-morden-london', 'centre-west-wickham-london', 'centre-bromley-london', 'region-london', 'driving-test-waiting-times', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'mitcham-driving-test-centre',
  nav: 'Mitcham',
  card: 'Mitcham test centre in CR0: pass rate trend, latest wait and three alternatives.',
  title: `Mitcham Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Mitcham driving test centre pass rate for ${YL} from DVSA data, its three-year trend, the latest median wait and how West Wickham, Morden and Bromley compare.`,
  h1: 'Mitcham driving test centre: results and waiting time',
  intro: 'Redhouse Road, CR0: a large south London site for car and motorcycle tests, measured against its three DVSA alternatives.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `Candidates at Mitcham passed ${h.num(c.passes)} of the ${h.num(c.tests)} car practical tests they took in ${h.yearLabel(h.lastYear)}, a pass rate of ${h.pc(c.rate)}. That sits ${c.rate! > h.gb.rate ? 'above' : 'below'} the ${h.pc(h.gb.rate)} recorded across Great Britain and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the London figure of ${h.pc(c.regionRate)}, and it places Mitcham ${h.ord(c.rankRegion)} of the ${c.ofRegion} London centres with at least 300 tests. Over three years the rate has ${t > 0 ? 'gained' : t < 0 ? 'lost' : 'held at'} ${t === 0 ? 'the same level' : h.pts(Math.abs(t)).replace('+', '')}. ${c.wait ? `For waiting, DVSA's ${h.month(c.wait.month)} figures put the median gap between booking and test at ${h.wk(c.wait.median)}, against ${h.wk(h.gb.wait?.[3])} nationally and ${h.wk(c.regionWait?.[3])} for London as a whole${c.waitYearAgo != null ? `; a year earlier the same measure stood at ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has not published a recent waiting figure for this centre.'} That suggests a booking made now at Mitcham is likely to land ${c.wait?.median != null && c.wait.median > (h.gb.wait?.[3] ?? 0) ? 'further out than' : 'no further out than'} a typical one elsewhere in Britain. Both figures come from official DVSA tables and are refreshed here every month, so the comparison with nearby centres further down stays current.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const better = c.near.filter((n) => n.rate != null && n.rate > (c.rate ?? 0) * 100);
    return [
      { q: 'Is the Mitcham pass rate going up or down?', a: `${(c.trend3 ?? 0) < 0 ? 'Down' : 'Up'} over the last three years: ${h.pp(c.l.p[0])} in ${h.yearLabel(h.E.YEARS[h.E.YEARS.length - 3])}, then ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}, a change of ${h.pts(c.trend3)}. Great Britain stood at ${h.pc(h.gb.rate)} in the latest year. The yearly table on this page shows all five DVSA years with the number of tests behind each rate.` },
      { q: 'Which centres can a Mitcham test be moved to?', a: `Under the rule in force since 9 June 2026, only the three centres DVSA lists as nearest: ${c.near.map((n) => `${short(n.name)} (${h.num(n.miles)} miles)`).join(', ')}. ${better.length ? `${better.length === c.near.length ? 'All three' : better.map((n) => short(n.name)).join(' and ')} passed a higher share of candidates than Mitcham in ${h.yearLabel(h.lastYear)}.` : 'None of them passed a higher share than Mitcham in the latest year.'} Each move uses up one of the changes a booking allows (${h.num(h.P.rules.changesAllowed)} since 31 March 2026).` },
      { q: 'Does Mitcham test centre run motorcycle tests?', a: `${/motorcycle/.test(c.types) ? 'Yes.' : 'Not at present.'} The GOV.UK finder lists it for ${c.types}. The pass rates on this page cover car practical tests only, ${h.num(c.tests)} of them in ${h.yearLabel(h.lastYear)}. Motorcycle module results are published separately by DVSA and are not compared on this page.` },
      { q: 'How many Mitcham tests did examiners cancel?', a: `${c.cancel ? `DVSA records ${h.num(c.cancel.total)} car tests cancelled by the centre in ${h.yearLabel(h.lastYear)}: ${h.num(c.cancel.medical)} for examiner illness, ${h.num(c.cancel.leave)} for leave or training, ${h.num(c.cancel.weather)} for weather. When DVSA cancels, the candidate is offered a new date without paying again, and the slot goes back into the pool other learners book from.` : 'DVSA has not published cancellation figures for this centre for the latest year, so no count can be given here. When DVSA cancels a test, the candidate is offered a new date without paying again.'}` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const first = ys[0];
    const growth = c.tests / f.pass[first][0];
    const ms = h.F.months(f);
    const yr = ms.slice(-12).map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const lo = Math.min(...yr), hi = Math.max(...yr);
    const near = c.near.filter((n) => n.rate != null);
    const byRate = [...near].sort((a, b) => (b.rate as number) - (a.rate as number));
    const byWait = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number));
    const gap = (c.m ?? 0) - (c.fem ?? 0);
    return `
<h2>Five DVSA years at Mitcham</h2>
<p>Mitcham handled ${h.num(f.pass[first][0])} car tests in ${h.yearLabel(first)} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}, ${growth >= 1 ? `about ${h.num(Math.round((growth - 1) * 100))} % more` : `about ${h.num(Math.round((1 - growth) * 100))} % fewer`} over the period. Measured from its ${h.yearLabel(ys[ys.length - 3])} level, the pass rate ${(c.trend3 ?? 0) < 0 ? 'dropped' : 'rose'} by ${h.pts(Math.abs(c.trend3 ?? 0)).replace('+', '')} in three years, ${Math.sign(c.trend3 ?? 0) === Math.sign(h.gb.rate - h.E.gbRate(ys[ys.length - 3])!) ? 'in the same direction as' : 'against the direction of'} the national figure, which went from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. DVSA gives no reason for a centre's rate, and none is offered here.</p>
${h.yearTable(ID)}
<h2>How long the Mitcham queue runs</h2>
<p>Over the twelve months to ${h.month(h.lastMonth)} the median wait at Mitcham ranged from ${h.wk(lo)} to ${h.wk(hi)}. ${c.wait && c.waitYearAgo != null ? `The latest reading, ${h.wk(c.wait.median)}, is ${c.wait.median != null && c.wait.median > c.waitYearAgo ? 'longer' : 'shorter'} than the ${h.wk(c.waitYearAgo)} of the same month a year before.` : ''} ${c.wait ? `Only ${h.pp(c.wait.in7)} of tests taken that month had been booked within seven weeks, and the right-hand column shows how far ahead the first tenth of slots went: ${h.wk(c.wait.w10)}, ${(c.wait.w10 ?? 0) >= h.P.rules.releaseWeeksAhead - 1 ? 'at the edge of' : 'inside'} the ${h.P.rules.releaseWeeksAhead}-week window in which DVSA releases dates.` : ''}</p>
${h.waitTable(ID)}
<h2>${near.map((n) => short(n.name)).join(', ')}: what a move would change</h2>
<p>A test booked at Mitcham can only be moved to the three centres on the DVSA list. In ${h.yearLabel(h.lastYear)} the strongest of them was ${h.cl(byRate[0]?.id ?? '', short(byRate[0]?.name ?? ''))} at ${h.pp(byRate[0]?.rate)}, and the weakest ${h.cl(byRate[byRate.length - 1]?.id ?? '', short(byRate[byRate.length - 1]?.name ?? ''))} at ${h.pp(byRate[byRate.length - 1]?.rate)}, against ${h.pc(c.rate)} at Mitcham. On waiting, ${byWait[0] ? `${short(byWait[0].name)} had the shortest median in ${h.month(h.lastMonth)}, ${h.wk(byWait[0].wait)}` : 'no recent figure is available'}. A pass rate describes past candidates rather than the next one, so the date on offer may weigh as much as the rate. The ${h.a('move-driving-test-centre', 'guide to moving a test')} sets out how the two allowed changes work.</p>
${h.nearTable(ID)}
<h2>Men, women and first attempts</h2>
<p>Male candidates passed ${h.pc(c.m)} of their Mitcham tests and female candidates ${h.pc(c.fem)}, a gap of ${h.pts(Math.abs(gap) * 100).replace('+', '')} in favour of ${gap >= 0 ? 'men' : 'women'}; nationally the split was ${h.pc(h.gb.m)} for men and ${h.pc(h.gb.f)} for women. Learners on their first attempt passed ${h.pc(c.first)}, ${(c.first ?? 0) > h.gb.first ? 'above' : 'below'} the ${h.pc(h.gb.first)} of all first attempts in Britain, and ${h.num(c.zero)} of them finished with no driving fault at all. Seventeen-year-olds had a rate of ${h.pc(c.age['17'])}. For how age shapes the odds across the country, see ${h.a('pass-rate-by-age-and-sex', 'pass rates by age and sex')}.</p>
<h2>Other tests on the same site</h2>
<p>GOV.UK lists Mitcham for ${c.types}. ${/motorcycle/.test(c.types) ? 'Riders therefore share the centre with car candidates, though their results sit in separate DVSA tables.' : 'Its work is centred on car candidates.'} Automatic cars accounted for ${h.pc(c.autoShare, 0)} of car tests here, with a pass rate of ${h.pc(c.auto)} against ${h.pp(c.l.mn)} in manual cars. DVSA does not publish its test routes for this or any centre.</p>
<p>Figures on this page are drawn from the ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and the ${h.src('dvsa_waits', 'DVSA monthly waiting times')}, with the address and nearest-centre list taken from ${h.src('gov_find_centre', 'the GOV.UK test centre finder')}.</p>
`;
  },
});

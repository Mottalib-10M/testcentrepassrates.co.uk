import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'bromley-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');
const title = (s: string) => (s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s);

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 609,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-sidcup-london', 'centre-west-wickham-london', 'centre-mitcham-london', 'region-london', 'easiest-driving-test-centres', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'bromley-driving-test-centre',
  nav: 'Bromley',
  card: 'Bromley BR1: pass rate, London ranking, a changing wait and the Sidcup option.',
  title: `Bromley Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Bromley driving test centre in BR1: DVSA car pass rate for ${YL}, its London ranking, the latest wait against last year and Sidcup or West Wickham nearby.`,
  h1: 'Bromley driving test centre: pass rate and current wait',
  intro: 'Burnt Ash Lane, BR1: a south-east London car centre ranked against the rest of the capital, with West Wickham, Sidcup and Mitcham as its DVSA alternatives.',
  resume: (h) => {
    const c = h.C(ID);
    const w = c.wait;
    return `${w ? `The median Bromley candidate tested in ${h.month(w.month)} had booked ${h.wk(w.median)} earlier${c.waitYearAgo != null ? `, ${w.median != null && w.median < c.waitYearAgo ? 'down' : 'up'} from ${h.wk(c.waitYearAgo)} in the same month a year before` : ''}. Britain's median that month was ${h.wk(h.gb.wait?.[3])} and London's ${h.wk(c.regionWait?.[3])}, so Bromley's queue was ${w.median != null && w.median < (h.gb.wait?.[3] ?? 0) ? 'shorter than the national one' : 'no shorter than the national one'}. ` : 'DVSA has published no recent waiting figure for Bromley. '}The pass rate is the other half of the picture: ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}, from ${h.num(c.passes)} passes in ${h.num(c.tests)} car tests, against ${h.pc(h.gb.rate)} in Great Britain and ${h.pc(c.regionRate)} in London. Among ${c.ofRegion} London centres with at least 300 tests, Bromley came ${h.ord(c.rankRegion)}, and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} across Britain. Over three years the rate moved ${h.pts(c.trend3)}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally. Rates are yearly and waits monthly; both are refreshed on this page whenever DVSA publishes, and the finder above shows how nearby centres compare.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const sid = c.near.find((n) => n.id === 'sidcup-london');
    return [
      { q: 'Is Bromley one of the easiest test centres in London?', a: `It ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres in ${h.yearLabel(h.lastYear)}, with ${h.pc(c.rate)} of car tests passed against a London figure of ${h.pc(c.regionRate)}. "Easiest" only describes past results: DVSA marks every test to the same standard, and the candidates who book a centre differ from place to place.` },
      { q: 'Should I move my Bromley test to Sidcup?', a: `${sid ? `Sidcup passed ${h.pp(sid.rate)} in ${h.yearLabel(h.lastYear)}, against ${h.pc(c.rate)} at Bromley, and is ${h.num(sid.miles)} miles away. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(sid.wait)}, against ${h.wk(c.wait?.median)} at Bromley, so a move ${(sid.wait ?? 0) > (c.wait?.median ?? 0) ? 'would probably mean a later date' : 'need not mean a later date'}.` : 'Sidcup is no longer on the DVSA list of centres nearest to Bromley, so the move is not available.'} Each move uses one of the changes a booking allows.` },
      { q: 'Which ages pass best at Bromley?', a: `${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const b = ks.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a)); const w = ks.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a)); return `In ${h.yearLabel(h.lastYear)} the best rate at Bromley was for ${b}-year-olds (${h.pc(c.age[b])}) and the lowest for ${w}-year-olds (${h.pc(c.age[w])})`; })()}. ${Object.keys(c.age).length < 9 ? 'DVSA published no figure for at least one age between 17 and 25 here.' : ''} Each age group holds a few hundred tests, so small gaps should not be over-read.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ms = h.F.months(f).slice(-12);
    const peak = ms.filter((k) => f.wait[k][0] != null).reduce((a, k) => ((f.wait[k][0] as number) > (f.wait[a][0] as number) ? k : a), ms[ms.length - 1]);
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const higher = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100);
    const ratio = c.tests / f.pass[ys[0]][0];
    return `
<h2>The Bromley queue, month by month</h2>
<p>${c.wait ? `Over the twelve months to ${h.month(h.lastMonth)} the longest median wait at Bromley was ${h.wk(f.wait[peak][0])}, in ${h.month(peak)}; the latest is ${h.wk(c.wait.median)}. In that latest month ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'No recent waiting data is published for Bromley.'} Waits can move a long way in a few months, as the table shows, so a short queue now is no promise of one later. New dates appear ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK, and only the learner can book or change a test since 12 May 2026. ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} Bromley tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.medical)} of them for examiner illness.` : ''}</p>
${h.waitTable(ID, 12)}
<h2>${c.rankRegion <= 5 ? 'Near the top of the London table' : 'Where Bromley sits in London'}</h2>
<p>Bromley's ${h.pc(c.rate)} placed it ${h.ord(c.rankRegion)} in London in ${h.yearLabel(h.lastYear)}. Its caseload has ${ratio >= 1.5 ? 'grown strongly' : ratio >= 1 ? 'grown' : 'shrunk'} over the series, from ${h.num(f.pass[ys[0]][0])} tests in ${h.yearLabel(ys[0])} to ${h.num(c.tests)}, while the rate went from ${h.pc(c.rateOf(ys[0]))} to its latest level. First-time candidates passed ${h.pc(c.first)}, ${(c.first ?? 0) > h.gb.first ? 'above' : 'below'} the national first-time rate of ${h.pc(h.gb.first)}, and ${h.num(c.zero)} of them drove without a recorded fault. The ${h.a('easiest-driving-test-centres', 'easiest centres list')} shows the centres above it, with their own waits, so the two measures can be read together.</p>
${h.yearTable(ID)}
<h2>Age and sex at Bromley</h2>
<p>Seventeen-year-olds passed ${h.pc(c.age['17'])}, ${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? 'above' : 'below'} the ${h.pc(h.E.ageRate(17))} recorded for that age across Britain. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, a difference of ${h.pts(Math.abs(gap)).replace('+', '')} in favour of ${gap >= 0 ? 'men' : 'women'}, against ${h.pts(Math.abs((h.gb.m - h.gb.f) * 100)).replace('+', '')} nationally. Automatic cars took ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} in manuals. ${h.a('pass-rate-by-age-and-sex', 'The age and sex page')} gives the national tables.</p>
<h2>Moving a Bromley test</h2>
<p>DVSA lists ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')} as Bromley's nearest centres, and since 9 June 2026 a test can only move to one of them. ${higher.length ? `${higher.map((n) => `${short(n.name)} (${h.pp(n.rate)})`).join(' and ')} beat Bromley's rate in ${h.yearLabel(h.lastYear)}.` : `None beat Bromley's rate in ${h.yearLabel(h.lastYear)}.`} The wait column matters as much: the table below sets the latest median of each beside Bromley's own. ${(() => { const q = c.near.filter((n) => n.wait != null && c.wait?.median != null && n.wait < c.wait.median); return q.length ? `In ${h.month(h.lastMonth)}, ${q.map((n) => short(n.name)).join(' and ')} had a shorter median than Bromley, so a move there could bring the test forward as well as change the centre.` : `In ${h.month(h.lastMonth)} none of the three had a shorter median than Bromley, so moving would not have brought the test forward.`; })()} The ${h.a('move-driving-test-centre', 'guide to moving a test')} covers the steps and what each change costs in terms of the allowance.</p>
${h.nearTable(ID)}
<p>GOV.UK lists the centre at ${[c.addr[0], title(c.addr[1]), c.addr[2]].join(', ')} for ${c.types} tests. Data from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waiting times')} and ${h.src('gov_nearest', 'the GOV.UK nearest-centre list')}.</p>
`;
  },
});

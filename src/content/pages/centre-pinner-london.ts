import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'pinner-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 605,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['region-london', 'driving-test-waiting-times', 'move-driving-test-centre', 'driving-test-booking-rules-2026', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest', 'gov_release'],
  slug: 'pinner-driving-test-centre',
  nav: 'Pinner',
  card: 'Pinner HA5: one of the longest waits in London, its pass rate and three alternatives.',
  title: `Pinner Driving Test Centre: Wait and Pass Rate ${YL}`,
  description: `Pinner driving test centre on Tolcarne Drive, HA5: the wait month by month, the DVSA car pass rate for ${YL} and how Yeading and Uxbridge compare with it.`,
  h1: 'Pinner driving test centre: waiting time and pass rate',
  intro: 'Tolcarne Drive, HA5: a north-west London centre where the queue matters as much as the pass rate, compared with Greenford, Yeading and Uxbridge.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `${c.wait ? `Learners tested at Pinner in ${h.month(c.wait.month)} had booked a median ${h.wk(c.wait.median)} in advance, ${c.wait.median != null && c.wait.median > (h.gb.wait?.[3] ?? 0) ? 'longer than' : 'no longer than'} the ${h.wk(h.gb.wait?.[3])} recorded for Great Britain and ${c.wait.median != null && c.wait.median > (c.regionWait?.[3] ?? 0) ? 'longer than' : 'no longer than'} London's ${h.wk(c.regionWait?.[3])}. ` : 'DVSA has not published a recent waiting time for Pinner. '}On results, the centre passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests in ${h.yearLabel(h.lastYear)} (${h.num(c.passes)} passes), ${c.rate! > h.gb.rate ? 'above' : 'below'} the British rate of ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the ${h.pc(c.regionRate)} achieved across London. That ranks Pinner ${h.ord(c.rankRegion)} of the ${c.ofRegion} London centres large enough to compare. Over three years its rate has ${t > 0 ? 'risen' : t < 0 ? 'eased' : 'stayed flat'}${t !== 0 ? ` by ${h.pts(Math.abs(t)).replace('+', '')}` : ''}, from ${h.pp(c.l.p[0])}. The page below follows the queue month by month, then the results by age and sex, then the three centres to which DVSA allows a Pinner test to be moved. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} for first attempts nationally. Every figure is refreshed when DVSA publishes a new month.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const ms = h.F.months(c.f);
    const long = ms.filter((k) => (c.f.wait[k][0] ?? 0) >= 20).length;
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    return [
      { q: 'How long is the wait at Pinner test centre?', a: `${c.wait ? `The median for ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}. ` : ''}Over the longer run, the Pinner median reached 20 weeks or more in ${h.num(long)} of the ${h.num(ms.length)} months published, and in the latest month the first tenth of slots had been booked ${h.wk(c.wait?.w10)} ahead. New dates are released ${h.P.rules.releaseWeeksAhead} weeks in advance, so a long median means most places go soon after release.` },
      { q: 'Which Pinner alternative has the shortest wait?', a: `${quick ? `In ${h.month(h.lastMonth)} it was ${short(quick.name)}, ${h.num(quick.miles)} miles from Pinner, with a median of ${h.wk(quick.wait)} and a ${h.yearLabel(h.lastYear)} pass rate of ${h.pp(quick.rate)}.` : 'No recent waiting figure is published for the three alternatives.'} Under the June 2026 rule, a Pinner test can only move to ${c.near.map((n) => short(n.name)).join(', ')}. Moves use up the changes allowed on a booking, and waits can change sharply from one month to the next.` },
      { q: 'Does Pinner test centre make arrangements for disabled candidates?', a: `${c.notes.length ? `GOV.UK says: "${c.notes.join(' ')}"` : 'GOV.UK lists no access note for Pinner at present.'} Any adjustment is requested when booking the test on GOV.UK. The centre is at ${c.addr.join(', ')} and runs ${c.types} tests, so approved driving instructor candidates are examined there as well as learners.` },
      { q: 'Do men pass more than women at Pinner?', a: `${(c.m ?? 0) > (c.fem ?? 0) ? 'Yes' : 'No'}, on ${h.yearLabel(h.lastYear)} figures: ${h.pc(c.m)} of tests by men and ${h.pc(c.fem)} by women ended in a pass. Across Great Britain the two figures were ${h.pc(h.gb.m)} and ${h.pc(h.gb.f)}. The difference says nothing about any one driver; preparation and the number of earlier attempts matter far more.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ms = h.F.months(f);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const long = vals.filter((v) => v >= 20).length;
    const avg = vals.reduce((s, v) => s + v, 0) / (vals.length || 1);
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    const worst = ages.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const top = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const low = [...c.near].filter((n) => n.rate != null).sort((a, b) => (a.rate as number) - (b.rate as number))[0];
    return `
<h2>${long > vals.length / 2 ? 'A queue that rarely shortens' : 'A queue that comes and goes'}</h2>
<p>DVSA publishes ${h.num(vals.length)} months of waiting data for Pinner. The median averaged ${h.wk(Math.round(avg * 10) / 10)} over that span and reached at least 20 weeks in ${h.num(long)} of those months. ${c.wait ? `The latest month, ${h.month(c.wait.month)}, gave ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}; just ${h.pp(c.wait.in7)} of the candidates tested had booked within seven weeks.` : ''} The last column of the table shows how far ahead the earliest tenth of slots was taken. With dates released ${h.P.rules.releaseWeeksAhead} weeks ahead, a figure at or near that limit means the first places went almost as soon as they appeared.</p>
${h.waitTable(ID, 12)}
<p>Since 12 May 2026 only the learner can book, change or cancel a test, and cancellation-finder services are no longer allowed to do it for them. The ${h.a('driving-test-booking-rules-2026', '2026 booking rules')} cover what changed, including the limit of ${h.num(h.P.rules.changesAllowed)} changes per booking.</p>
<h2>Results by sex and by age</h2>
<p>Pinner shows a ${Math.abs(gap) >= 5 ? 'marked' : 'small'} difference between men and women: ${h.pc(c.m)} against ${h.pc(c.fem)}, or ${h.pts(Math.abs(gap)).replace('+', '')} in favour of ${gap >= 0 ? 'men' : 'women'}. By age, the best result belonged to ${best}-year-olds (${h.pc(c.age[best])}) and the weakest to ${worst}-year-olds (${h.pc(c.age[worst])}). First attempts passed ${h.pc(c.first)}, ${(c.first ?? 0) > h.gb.first ? 'ahead of' : 'behind'} the national ${h.pc(h.gb.first)}, and ${h.num(c.zero)} first-time candidates finished with no fault recorded. Automatic cars accounted for ${h.pc(c.autoShare, 0)} of all tests here and passed ${h.pc(c.auto)}.</p>
${h.ageTable(ID)}
<h2>Five years in the DVSA tables</h2>
<p>Pinner's caseload has ${Math.max(...c.years.map((y) => f.pass[y][0])) / Math.min(...c.years.map((y) => f.pass[y][0])) < 1.2 ? 'stayed within a narrow band' : 'varied widely'}, between ${h.num(Math.min(...c.years.map((y) => f.pass[y][0])))} and ${h.num(Math.max(...c.years.map((y) => f.pass[y][0])))} car tests a year since ${h.yearLabel(c.years[0])}. Its rate over the same period went from ${h.pc(c.rateOf(c.years[0]))} to ${h.pc(c.rate)}, while Britain's went from ${h.pc(h.E.gbRate(c.years[0]))} to ${h.pc(h.gb.rate)}. Among ${h.num(c.ofGB)} centres in Britain with at least a thousand tests, Pinner now sits ${h.ord(c.rankGB)}. Each year in the table runs from April to March, the DVSA reporting year.</p>
${h.yearTable(ID)}
<h2>Where else a Pinner test can go</h2>
<p>The three centres on the DVSA list are ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')}. ${top && low ? `Their rates range from ${h.pp(low.rate)} at ${short(low.name)} to ${h.pp(top.rate)} at ${short(top.name)}, around Pinner's ${h.pc(c.rate)}.` : ''} Waits differ between them as much as rates do, so both columns of the table deserve a look before a change is used up. The ${h.a('move-driving-test-centre', 'step-by-step moving guide')} explains the process on GOV.UK, including what happens to the fee when a date is changed.</p>
${h.nearTable(ID)}
<p>Rates and waits on this page come from the ${h.src('dvsa_pass_centre', 'DVSA centre pass rate tables')} and the ${h.src('dvsa_waits', 'DVSA waiting time tables')}; release rules from ${h.src('gov_release', 'GOV.UK')}.</p>
`;
  },
});

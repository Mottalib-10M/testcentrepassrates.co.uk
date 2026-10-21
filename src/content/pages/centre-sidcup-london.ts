import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'sidcup-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 610,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-bromley-london', 'region-london', 'easiest-driving-test-centres', 'first-time-pass-rates', 'theory-test-pass-rates', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'sidcup-driving-test-centre',
  nav: 'Sidcup',
  card: 'Sidcup DA14: pass rate, rank in London and Britain, and the wait to get in.',
  title: `Sidcup Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Sidcup driving test centre, DA14: DVSA car pass rate for ${YL}, its rank in London and Britain, first-time passes, the latest wait and the theory centre.`,
  h1: 'Sidcup driving test centre: pass rate, rank and waiting time',
  intro: 'Five Arches Business Estate, DA14: a south-east London car centre, its results read in detail and set against Belvedere, Bromley and Erith.',
  resume: (h) => {
    const c = h.C(ID);
    const top = c.rankRegion === 1;
    return `${top ? 'No London centre with 300 tests or more had a higher car pass rate than Sidcup' : `Sidcup ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres by car pass rate`} in ${h.yearLabel(h.lastYear)}: ${h.pc(c.rate)}, from ${h.num(c.passes)} passes in ${h.num(c.tests)} tests. London as a whole managed ${h.pc(c.regionRate)} and Great Britain ${h.pc(h.gb.rate)}. Nationally the centre placed ${h.ord(c.rankGB)} of the ${h.num(c.ofGB)} centres with at least a thousand tests. Its rate has moved ${h.pts(c.trend3)} over three years. ${c.wait ? `${c.wait.median != null && c.wait.median > (h.gb.wait?.[3] ?? 0) ? 'The queue is the other side of the picture' : 'The queue is not the obstacle here'}: tests taken in ${h.month(c.wait.month)} had been booked a median ${h.wk(c.wait.median)} ahead, against ${h.wk(h.gb.wait?.[3])} for Great Britain and ${h.wk(c.regionWait?.[3])} for London${c.waitYearAgo != null ? `; twelve months earlier Sidcup's median was ${h.wk(c.waitYearAgo)}` : ''}.` : 'No recent waiting figure has been published for Sidcup.'} A high rate tells you how past candidates fared, not how any one driver will, and it does not mean the test is marked more leniently: DVSA applies one standard everywhere. The figures on this page are refreshed monthly from the DVSA tables.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'sidcup');
    return [
      { q: 'What explains the Sidcup driving test centre pass rate?', a: `DVSA publishes outcomes, not reasons, so no cause can be proven from the data. What it does show is how Sidcup candidates fared by group in ${h.yearLabel(h.lastYear)}: ${h.pc(c.first)} on a first attempt, ${h.pc(c.age['17'])} among 17-year-olds, ${h.pc(c.m)} for men and ${h.pc(c.fem)} for women. Every examiner works to the same national marking standard.` },
      { q: 'Is there a theory test centre in Sidcup?', a: `${th ? `Yes. DVSA lists a Sidcup theory test centre, where ${h.pc(h.E.theoryRate(th))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain. ` : 'DVSA does not list a Sidcup theory centre in its latest table. '}The theory test costs £${h.num(h.P.fees.theory)}; the practical test at Five Arches is booked on GOV.UK after it, at £${h.num(h.P.fees.practicalWeekday)} on a weekday.` },
      { q: 'Can I move a Sidcup test to a centre with a shorter wait?', a: `Yes, to one of the three centres DVSA lists as nearest: ${c.near.map((n) => `${short(n.name)} (${h.num(n.miles)} miles, median ${h.wk(n.wait)} in ${h.month(h.lastMonth)})`).join(', ')}. Sidcup's own median was ${h.wk(c.wait?.median)}. Each move uses one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const zr = c.zero / (c.firstTests || 1);
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const lower = c.near.filter((n) => (n.rate ?? 0) < (c.rate ?? 0) * 100);
    const quicker = c.near.filter((n) => n.wait != null && c.wait?.median != null && n.wait < c.wait.median);
    const ms = h.F.months(f);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    return `
<h2>${above.length >= ages.length - 1 ? 'Strong across ages and attempts' : 'Ages and first attempts'}</h2>
<p>${above.length >= ages.length - 1 ? 'Sidcup\'s rate is not carried by one group. ' : ''}${above.length === ages.length ? 'Every age group from 17 to 25' : `${h.num(above.length)} of the ${h.num(ages.length)} age groups from 17 to 25`} passed more often here than the same age nationally; seventeen-year-olds reached ${h.pc(c.age['17'])}. First attempts succeeded ${h.pc(c.first)} of the time, against ${h.pc(h.gb.first)} across Britain, and ${h.num(c.zero)} first-time candidates, ${h.pc(zr)} of them, drove with no fault recorded at all, against ${h.pc(nf[2] / nf[0])} nationally. The ${h.a('first-time-pass-rates', 'first-time pass rates ranking')} lists the centres that do better on that measure.</p>
${h.ageTable(ID)}
<p>${Math.abs(gap) < 1 ? `Men and women passed at almost exactly the same rate here, ${h.pc(c.m)} and ${h.pc(c.fem)}, where nationally men are ahead by ${h.pts((h.gb.m - h.gb.f) * 100).replace('+', '')}.` : `Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, a gap of ${h.pts(Math.abs(gap)).replace('+', '')} in favour of ${gap > 0 ? 'men' : 'women'}.`} Automatic cars took ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}.</p>
<h2>The queue at Five Arches</h2>
<p>${vals.length ? `Across the ${h.num(vals.length)} months published, the Sidcup median ranged from ${h.wk(Math.min(...vals))} to ${h.wk(Math.max(...vals))}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)} it was ${h.wk(c.wait.median)}, with only ${h.pp(c.wait.in7)} of candidates tested inside seven weeks of booking, and the first tenth of slots gone ${h.wk(c.wait.w10)} ahead.` : ''} DVSA releases dates ${h.P.rules.releaseWeeksAhead} weeks ahead; when the median sits near that horizon, most candidates booked as soon as slots appeared. ${c.cancel ? `DVSA itself cancelled ${h.num(c.cancel.total)} tests in the year, ${h.num(c.cancel.medical)} through examiner illness.` : ''}</p>
${h.waitTable(ID, 12)}
<h2>${c.near.map((n) => short(n.name)).join(', ')}: rate against date</h2>
<p>The DVSA list for Sidcup is ${c.near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles`).join(', ')}. ${lower.length === c.near.length ? 'All three had a lower pass rate than Sidcup' : lower.length ? `${lower.map((n) => short(n.name)).join(' and ')} had a lower pass rate than Sidcup` : 'None had a lower pass rate than Sidcup'} in ${h.yearLabel(h.lastYear)}, and ${quicker.length === c.near.length ? 'all three' : quicker.length ? quicker.map((n) => short(n.name)).join(' and ') : 'none'} had a shorter median wait in ${h.month(h.lastMonth)}. ${lower.length && quicker.length ? 'For a learner booked at Sidcup, a move would usually trade a stronger record for an earlier date. ' : ''}Since 9 June 2026 these are the only centres to which a Sidcup test can be moved.</p>
${h.nearTable(ID)}
<h2>Five years of Sidcup results</h2>
<p>Sidcup tested ${h.num(f.pass[c.years[0]][0])} candidates in ${h.yearLabel(c.years[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. Its rate in those two years was ${h.pc(c.rateOf(c.years[0]))} and ${h.pc(c.rate)}, while Britain's moved from ${h.pc(h.E.gbRate(c.years[0]))} to ${h.pc(h.gb.rate)}, so the gap to the national figure ${Math.abs((c.rate ?? 0) - h.gb.rate) > Math.abs((c.rateOf(c.years[0]) ?? 0) - (h.E.gbRate(c.years[0]) ?? 0)) ? 'has widened' : 'has narrowed or held'} over the period.</p>
${h.yearTable(ID)}
<p>The centre is at ${c.addr.join(', ')} and takes ${c.types} tests. ${h.a('easiest-driving-test-centres', 'The easiest centres page')} places it among every centre in Britain.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory test results by centre')} and ${h.src('gov_find_centre', 'the GOV.UK finder')}.</p>
`;
  },
});

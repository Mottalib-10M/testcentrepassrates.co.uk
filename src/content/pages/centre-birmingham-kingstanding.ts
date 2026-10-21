import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'birmingham-kingstanding';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 631,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['region-west-midlands', 'centre-birmingham-garretts-green', 'centre-birmingham-south-yardley', 'pass-rate-by-age-and-sex', 'driving-test-pass-rates-by-year'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'birmingham-kingstanding-driving-test-centre',
  nav: 'Birmingham (Kingstanding)',
  card: 'Five years of Kingstanding results, the wait and the other Birmingham centres.',
  title: `Birmingham Kingstanding Test Centre: Pass Rate ${YL}`,
  description: `Birmingham Kingstanding driving test centre: car pass rate for ${YL}, five-year trend, results by age, the wait and the 3 centres a test there can move to.`,
  h1: 'Birmingham (Kingstanding) driving test centre: pass rate and wait',
  intro: 'Birdbrook Road, B44: a car-only centre in north Birmingham, with five years of DVSA results and the monthly wait.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const y0 = c.years[0];
    const diff = (c.rate! - (c.rateOf(y0) ?? 0)) * 100;
    const gbMed = h.gb.wait?.[3];
    return `Kingstanding's car pass rate stood at ${h.pc(c.rate)} in ${Y}, from ${h.num(c.tests)} tests, ${diff >= 0 ? 'up' : 'down'} ${h.num(Math.abs(Math.round(diff)))} points on the ${h.pc(c.rateOf(y0))} of ${h.yearLabel(y0)}. Across Great Britain the rate was ${h.pc(h.gb.rate)} and in the West Midlands ${h.pc(c.regionRate)}, so the centre came out ${c.rate! > h.gb.rate ? 'above' : 'below'} the national line and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} its region, ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} West Midlands centres with 300 tests or more. ${c.wait ? `${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'Getting a date is the harder part' : 'Getting a date is not the obstacle'}: for tests sat in ${h.month(c.wait.month)} the median booking had been made ${h.wk(c.wait.median)} before, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'not longer than'} the British median of ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'No waiting time was published for the latest month.'} Seventeen-year-olds passed ${h.pc(c.age['17'])} here, against ${h.pc(h.E.ageRate(17))} for that age nationally. Below are the yearly series, the results by age and the three centres a Kingstanding booking may be moved to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gg = h.C('birmingham-garretts-green');
    const months = h.F.months(c.f).slice(-12);
    const long = months.filter((k) => (c.f.wait[k][0] ?? 0) >= 20).length;
    return [
      { q: 'Has the Kingstanding driving test pass rate gone up?', a: `${(c.trend3 ?? 0) >= 0 ? 'Yes' : 'No'}, over the last three years it moved by ${h.pts(c.trend3)}, to ${h.pc(c.rate)} in ${Y}. On the longer five-year view the first figure was ${h.pc(c.rateOf(c.years[0]))}. A rate is an average over thousands of candidates, so it says more about the mix of learners and their preparation than about any single test.` },
      { q: 'How long do learners wait for a test at Kingstanding?', a: `DVSA publishes the gap between booking and test for every month: in ${long} of the last twelve months the median Kingstanding candidate had booked 20 weeks or more ahead. ${c.wait ? `The latest month, ${h.month(c.wait.month)}, came in at ${h.wk(c.wait.median)}.` : ''} New slots are released up to ${h.P.rules.releaseWeeksAhead} weeks ahead, and only the learner can book or move a test since ${h.date(h.P.rules.onlyLearnerFrom)}.` },
      { q: 'Is Kingstanding easier than Garretts Green?', a: `On the ${Y} figures Kingstanding passed ${h.pc(c.rate)} of car tests and Garretts Green ${h.pc(gg.rate)}, so Kingstanding was ${c.rate! > gg.rate! ? 'the higher' : 'the lower'} of the two. Garretts Green is on Kingstanding's list of nearest centres, ${h.num(c.near.find((n) => n.id === 'birmingham-garretts-green')?.miles ?? 0)} miles away, and its median wait in ${h.month(h.lastMonth)} was ${h.wk(gg.wait?.median)}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    let rises = 0;
    for (let i = ys.length - 1; i > 0 && (c.rateOf(ys[i]) ?? 0) > (c.rateOf(ys[i - 1]) ?? 0); i--) rises++;
    const lowY = ys.reduce((a, y) => (c.f.pass[y][0] < c.f.pass[a][0] ? y : a), ys[0]);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const bestAge = ages.reduce((a, k) => ((c.age[k] ?? 0) > (c.age[a] ?? 0) ? k : a), ages[0]);
    const n17 = h.E.ageRate(17) ?? 0;
    const city = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Birmingham (') && x.t >= 1000), 'rate');
    const pos = city.findIndex((x) => x.id === ID) + 1;
    const nb = c.near.filter((n) => n.wait != null);
    const quicker = nb.filter((n) => (n.wait as number) < (c.wait?.median ?? 0));
    const disab = c.notes.find((n) => /disabilit/i.test(n));
    return `
<h2>A five-year climb, year by year</h2>
<p>${rises >= 2 ? `The rate has risen in each of the last ${rises} years of the series` : rises === 1 ? 'The rate rose in the latest year after a less regular path before it' : 'The rate did not rise in the latest year'}, going from ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} to ${h.pc(c.rate)} in ${Y}. Volumes were far from steady: the quietest year was ${h.yearLabel(lowY)}, with ${h.num(c.f.pass[lowY][0])} tests, against ${h.num(c.tests)} in the latest one. A year with few tests gives a less reliable rate, which is worth keeping in mind before reading too much into one figure. The national rate is in the last column for comparison.</p>
${h.yearTable(ID)}
<h2>How Kingstanding compares across Birmingham</h2>
<p>Of the ${city.length} Birmingham centres that ran at least 1,000 car tests in ${Y}, Kingstanding ranks ${h.ord(pos)} on pass rate. The leader was ${h.cl(city[0].id, city[0].n)} at ${h.pp(h.E.rate(city[0]))}; ${h.cl('birmingham-garretts-green', 'Garretts Green')}, with ${h.num(h.C('birmingham-garretts-green').tests)} tests, recorded ${h.pc(h.C('birmingham-garretts-green').rate)}, and ${h.cl('birmingham-south-yardley', 'South Yardley')} ${h.pc(h.C('birmingham-south-yardley').rate)}. Women passed ${h.pc(c.fem)} of their tests at Kingstanding and men ${h.pc(c.m)}, a gap of ${h.num(Math.round(Math.abs((c.m ?? 0) - (c.fem ?? 0)) * 100))} points ${(c.m ?? 0) > (c.fem ?? 0) ? 'in favour of men' : 'in favour of women'}.</p>
<h2>Seventeen-year-olds and the rest</h2>
<p>${bestAge === '17' ? 'No age group did better here than the youngest one.' : `The best-performing age at this centre was ${bestAge}, with ${h.pc(c.age[bestAge])}.`} Seventeen-year-olds, who took ${h.num(c.f.age['17']?.[0] ?? 0)} tests, passed ${h.pc(c.age['17'])}, ${(c.age['17'] ?? 0) > n17 ? 'ahead of' : 'behind'} the ${h.pc(n17)} of seventeen-year-olds nationally. First attempts succeeded ${h.pc(c.first)} of the time, and ${h.num(c.zero)} first-timers passed with no fault recorded at all. ${c.auto != null ? `In automatic cars, which made up ${h.pc(c.autoShare, 0)} of tests, the rate was ${h.pc(c.auto)}.` : ''}</p>
${h.ageTable(ID)}
<h2>Booking a date in B44</h2>
<p>${c.wait ? `The median wait for tests in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, compared with ${h.wk(c.waitYearAgo)} twelve months before` : ''}. In that month the first tenth of tests had been booked ${h.wk(c.wait.w10)} ahead, ${(c.wait.w10 ?? 0) >= h.P.rules.releaseWeeksAhead ? 'the full release window, which suggests most new slots were taken soon after they appeared' : 'inside the release window'}.` : 'DVSA did not publish a recent wait for this centre.'} ${disab ? `GOV.UK adds a note for disabled candidates: "${disab}"` : ''} Only GOV.UK books tests, and the ${h.a('driving-test-booking-rules-2026', 'booking rules of 2026')} set out who may book and change them.</p>
<h2>The three possible moves</h2>
<p>DVSA's list of nearest centres for Kingstanding is ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${quicker.length ? `${quicker.length === 1 ? 'One of them' : quicker.length === c.near.length ? 'All three' : 'Two of them'} had a shorter median wait in ${h.month(h.lastMonth)}: ${quicker.map((n) => `${n.name}, ${h.wk(n.wait)} with a ${h.pp(n.rate)} pass rate`).join('; ')}. Whether a shorter queue is worth a lower or higher rate is the trade-off the table lets you weigh.` : 'None of them had a shorter median wait in the latest month.'} A move uses one of the ${h.P.rules.changesAllowed} changes a booking allows.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA car pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waiting times')}, ${h.src('gov_find_centre', 'the GOV.UK test centre finder')} and ${h.src('gov_nearest', 'the DVSA list of nearest centres')}.</p>
`;
  },
});

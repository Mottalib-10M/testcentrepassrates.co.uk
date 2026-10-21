import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'birmingham-garretts-green';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 630,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['region-west-midlands', 'centre-birmingham-south-yardley', 'centre-birmingham-kingstanding', 'driving-test-cancellations', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'birmingham-garretts-green-driving-test-centre',
  nav: 'Birmingham (Garretts Green)',
  card: 'Rate and wait at Garretts Green, beside every other Birmingham test centre.',
  title: `Birmingham Garretts Green Test Centre: Pass Rate ${YL}`,
  description: `Birmingham Garretts Green driving test centre: ${YL} pass rate, tests, monthly wait and how it compares with the other Birmingham centres, from DVSA data.`,
  h1: 'Birmingham (Garretts Green) driving test centre: pass rate and wait',
  intro: 'Granby Avenue, B33: the Birmingham centre with the largest volume of car tests, set against the five other centres of the city.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const city = h.E.CENTRES.filter((x) => x.n.startsWith('Birmingham ('));
    const busiest = h.E.sorted(city, 'tests')[0]?.id === ID;
    const gbMed = h.gb.wait?.[3];
    return `${busiest ? `No other Birmingham centre handled as many car tests as Garretts Green` : `Garretts Green is one of ${city.length} Birmingham centres in the DVSA tables`}: ${h.num(c.tests)} in ${Y}, of which ${h.num(c.passes)} ended in a pass, a rate of ${h.pc(c.rate)}. That sits ${c.rate! > h.gb.rate ? 'above' : 'below'} the ${h.pc(h.gb.rate)} of Great Britain and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the West Midlands figure of ${h.pc(c.regionRate)}, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the region that ran at least 300 tests. Compared with ${h.yearLabel(h.E.YEARS[0])} the rate has ${(c.trend3 ?? 0) >= 0 ? 'gained' : 'lost'} ${h.pts(Math.abs(c.trend3 ?? 0)).replace('+', '')}. ${c.wait ? `For tests taken in ${h.month(c.wait.month)}, the median gap between booking and test day was ${h.wk(c.wait.median)}, ${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'shorter' : 'longer'} than the ${h.wk(gbMed)} of Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : 'DVSA published no waiting time for this centre in the latest month.'} Garretts Green also hosts motorcycle and lorry tests, but every figure here concerns car tests alone, and the table of Birmingham centres below shows where the city's other test sites stand on both counts.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const city = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Birmingham (') && x.t >= 1000), 'rate');
    const top = city[0];
    const Y = h.yearLabel(h.lastYear);
    return [
      { q: 'Which Birmingham driving test centre has the best pass rate, and where does Garretts Green stand?', a: `Among Birmingham centres with at least 1,000 tests in ${Y}, ${top.n} led at ${h.pp(h.E.rate(top))}. Garretts Green came ${h.ord(city.findIndex((x) => x.id === ID) + 1)} of ${city.length} on that list with ${h.pc(c.rate)}. A gap of a few points between centres is small next to the effect of practice and age, so the date you can get often matters more than the centre.` },
      { q: 'Does Garretts Green test motorcycles and lorries as well as cars?', a: `Yes. The GOV.UK centre finder lists these tests at ${c.addr[0].split(',')[0]}: ${c.types}. The pass rates on this page cover car practical tests only, the figures DVSA publishes per centre in its table DRT122A. Motorcycle and lorry candidates book through the same GOV.UK service but in their own categories, with their own slots and waits.` },
      { q: 'How many Garretts Green tests did examiners cancel?', a: c.cancel ? `DVSA recorded ${h.num(c.cancel.total)} tests cancelled by the examiner side at Garretts Green in ${Y}: ${h.num(c.cancel.medical)} for illness, ${h.num(c.cancel.weather)} for bad weather and ${h.num(c.cancel.leave)} for leave or training. Each of those candidates then needed a new date, on top of the ${h.num(c.tests)} tests that went ahead.` : `DVSA did not publish cancellation figures for Garretts Green in ${Y}. The pass rate and the wait on this page are not affected by that gap, since they come from separate DVSA tables.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const city = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Birmingham (')), 'rate');
    const top = city[0], low = city[city.length - 1];
    const shortest = h.E.sorted(city.filter((x) => x.w != null), 'wait', true)[0];
    const small = city.filter((x) => x.t < 1000);
    const months = h.F.months(c.f).slice(-12);
    const minM = months.filter((k) => c.f.wait[k][0] != null).reduce((a, k) => ((c.f.wait[k][0] as number) < (c.f.wait[a][0] as number) ? k : a), months[0]);
    const ys = c.years;
    const firstY = ys[0];
    const multi = /lorry|motorcycle/.test(c.types);
    const best = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const med = c.cancel && c.cancel.total ? c.cancel.medical / c.cancel.total : null;
    return `
<h2>Every Birmingham centre in one table</h2>
<p>DVSA lists ${city.length} centres with Birmingham in their name. On the ${Y} figures the highest pass rate belonged to ${h.cl(top.id, top.n)} at ${h.pp(h.E.rate(top))} and the lowest to ${h.cl(low.id, low.n)} at ${h.pp(h.E.rate(low))}; Garretts Green, at ${h.pc(c.rate)}, sat ${c.rate! * 100 > (h.E.rate(top) ?? 0) - 0.05 ? 'at the top' : c.rate! * 100 < (h.E.rate(low) ?? 0) + 0.05 ? 'at the bottom' : 'between the two'}. ${small.length ? `Read ${small.map((x) => x.n).join(' and ')} with care: ${small.length > 1 ? 'they ran' : 'it ran'} fewer than 1,000 tests, so a handful of results moves the rate.` : ''} For speed, the shortest median wait in ${h.month(h.lastMonth)} was at ${shortest ? `${shortest.n}, ${h.wk(shortest.w)}` : 'no centre with a published figure'}.</p>
${h.centreTable(city, `Birmingham driving test centres, ${Y}: car tests, pass rate, change since ${h.yearLabel(h.E.YEARS[0])} and median wait in ${h.month(h.lastMonth)}. DVSA tables DRT122A and DRT122F.`)}
<h2>Volume and the five-year line</h2>
<p>In ${h.yearLabel(firstY)} Garretts Green ran ${h.num(c.f.pass[firstY][0])} car tests at ${h.pc(c.rateOf(firstY))}; by ${Y} the count had reached ${h.num(c.tests)}, ${c.tests > c.f.pass[firstY][0] * 1.5 ? 'a far larger workload' : 'a similar order of size'}, with the rate at ${h.pc(c.rate)}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. First-time candidates managed ${h.pc(c.first)}, ${c.first! > h.gb.first ? 'better than' : 'short of'} the ${h.pc(h.gb.first)} recorded nationally, and ${h.num(c.zero)} of them came back without a single driving fault on the sheet. ${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)}, ${c.auto > (c.l.mn ?? 0) / 100 ? 'ahead of' : 'behind'} the ${h.pp(c.l.mn)} of manual candidates.` : ''}</p>
<h2>What Garretts Green tests besides cars</h2>
<p>${multi ? `This site is not limited to cars. The GOV.UK finder lists: ${c.types}. Bikes, lorries and buses are booked as separate categories, each with its own pass rate in other DVSA tables; nothing on this page mixes them with the car results.` : `The GOV.UK finder lists these tests here: ${c.types}.`} DVSA does not publish the routes used from ${c.addr[0].split(',')[0]}, and no list circulating online is an official one.</p>
${c.cancel ? `<h2>Tests called off by DVSA</h2>
<p>Examiners cancelled ${h.num(c.cancel.total)} Garretts Green tests across ${Y}. Illness accounted for ${h.num(c.cancel.medical)} of them${med != null ? `, ${h.pc(med, 0)} of the total` : ''}, weather for ${h.num(c.cancel.weather)} and leave or training for ${h.num(c.cancel.leave)}. Each cancelled test goes back into the queue as a rebooking, ${c.cancel.total > c.tests * 0.08 ? 'and at this scale that is a noticeable share of the year\'s slots' : 'a modest share of the year\'s slots'}. The ${h.a('driving-test-cancellations', 'cancellations guide')} covers the rules when DVSA calls a test off.</p>` : ''}
<h2>How the wait moved over twelve months</h2>
<p>${c.wait ? `The quietest month in the last twelve was ${h.month(minM)}, with a median of ${h.wk(c.f.wait[minM][0] as number)}; the latest figure, for ${h.month(c.wait.month)}, is ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. Slots open up to ${h.P.rules.releaseWeeksAhead} weeks ahead, and the last column shows how far in advance the first tenth of each month's tests had been booked.` : 'No recent waiting time has been published for this centre.'}</p>
${h.waitTable(ID, 6)}
<h2>Where else a Garretts Green booking can go</h2>
<p>Since ${h.date(h.P.rules.nearestThreeFrom)} a car test can only be moved to one of the three centres DVSA names as nearest. For Garretts Green these are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles away`).join('; ')}. Of the three, the highest rate belongs to ${best?.name} at ${h.pp(best?.rate)}, with a median wait of ${h.wk(best?.wait)} in ${h.month(h.lastMonth)}, ${(best?.wait ?? 0) > (c.wait?.median ?? 0) ? 'longer than' : 'no longer than'} the wait at Garretts Green. The ${h.a('move-driving-test-centre', 'guide to moving a test')} explains the limit of two changes.</p>
${h.nearTable(ID)}
<p>Figures from the ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and the ${h.src('dvsa_waits', 'DVSA waiting times')}, address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'the DVSA nearest-centre list')}.</p>
`;
  },
});

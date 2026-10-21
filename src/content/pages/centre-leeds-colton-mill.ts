import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'leeds-colton-mill';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 635,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-yorkshire-and-the-humber', 'centre-horsforth', 'pass-rate-by-age-and-sex', 'compare-driving-test-centres', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'leeds-colton-mill-driving-test-centre',
  nav: 'Leeds (Colton Mill)',
  card: 'Colton Mill rate, results by age and every Leeds test centre side by side.',
  title: `Leeds Colton Mill Driving Test Centre: Pass Rate ${YL}`,
  description: `Leeds Colton Mill driving test centre: ${YL} car pass rate, results by age and sex, the monthly wait and a comparison with Fearnville and Horsforth in Leeds.`,
  h1: 'Leeds (Colton Mill) driving test centre: pass rate and wait',
  intro: 'Colton Mill Office Park, LS15: an east Leeds car centre with a short DVSA record, compared with the other Leeds sites.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    return `Colton Mill recorded ${h.num(c.tests)} car tests in ${Y}, and ${h.pc(c.rate)} of them, ${h.num(c.passes)} in all, ended in a pass. Great Britain as a whole passed ${h.pc(h.gb.rate)} and Yorkshire and the Humber ${h.pc(c.regionRate)}; the centre therefore sat ${c.rate! > h.gb.rate ? 'above' : 'below'} the national figure and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the regional one, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the region with 300 tests or more. ${c.years.length < 3 ? `DVSA's pass tables carry Colton Mill under this name for ${c.years.length === 1 ? 'one financial year only' : `${c.years.length} financial years`}, so there is no long trend to read yet.` : `Over three years the rate moved by ${h.pts(c.trend3)}.`} ${c.wait ? `In ${h.month(c.wait.month)} the median test had been booked ${h.wk(c.wait.median)} in advance, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'more than' : 'less than'} the ${h.wk(gbMed)} recorded for Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'DVSA published no wait for this centre in the latest month.'} The page sets Colton Mill against the other Leeds centres and looks at its results by age.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const fv = h.C('leeds-fearnville');
    return [
      { q: 'Why is the Colton Mill pass rate history so short?', a: `DVSA's centre table DRT122A lists Colton Mill under this name only from ${h.yearLabel(c.years[0])}, ${c.years.length === 1 ? 'one financial year' : `${c.years.length} financial years`} so far, and its waiting times start in ${h.month(h.F.months(c.f)[0])}. Figures for earlier years, if the centre's tests were recorded under another name, are not linked to it in the tables. Each new financial year will be added here when DVSA publishes it.` },
      { q: 'Is Colton Mill easier than Fearnville in Leeds?', a: `In ${Y} Colton Mill passed ${h.pc(c.rate)} of car tests and Fearnville ${h.pc(fv.rate)}, ${Math.abs((c.rate ?? 0) - (fv.rate ?? 0)) < 0.01 ? 'practically the same figure' : (c.rate ?? 0) > (fv.rate ?? 0) ? 'so Colton Mill was ahead' : 'so Fearnville was ahead'}. ${fv.wait?.median == null ? 'DVSA has published no recent median wait for Fearnville.' : fv.wait.month === h.lastMonth ? `Fearnville's median wait in ${h.month(h.lastMonth)} was ${h.wk(fv.wait.median)}, against ${h.wk(c.wait?.median)} here.` : `DVSA left Fearnville's wait blank for ${h.month(h.lastMonth)}; its latest published median, for ${h.month(fv.wait.month)}, was ${h.wk(fv.wait.median)}.`} Fearnville is ${h.num(c.near.find((n) => n.id === 'leeds-fearnville')?.miles ?? 0)} miles away and ${c.near[0]?.id === 'leeds-fearnville' ? 'heads' : 'appears on'} DVSA's list of nearest centres for Colton Mill.` },
      { q: 'Does Colton Mill test motorcycles or instructors?', a: `The GOV.UK centre finder lists the following tests at Colton Mill: ${c.types}. Candidates for other categories, such as motorcycle modules or the instructor tests, have to look at the other Leeds centres on GOV.UK. Every figure on this page refers to car practical tests, the only category that DVSA breaks down by centre in table DRT122A.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const leeds = h.E.sorted(h.F.FULL_CENTRES.filter((x) => x.name.startsWith('Leeds (') || x.addr[1].replace(/,/g, '').trim() === 'Leeds').map((x) => h.E.centre(x.id)), 'rate');
    const noWait = leeds.filter((x) => x.w == null);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] ?? 0) > (h.E.ageRate(Number(k)) ?? 1));
    const n17 = c.f.age['17']?.[0] ?? 0;
    const months = h.F.months(c.f).slice(-12);
    const firstM = months[0];
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    return `
<h2>Leeds has ${leeds.length} car test centres</h2>
<p>Counting the centres whose GOV.UK address is in Leeds, the city has ${leeds.length}: ${leeds.map((x) => h.cl(x.id, x.n)).join(', ')}. Ordered by ${Y} pass rate, the highest figure is ${h.pp(h.E.rate(leeds[0]))}, held by ${leeds.filter((x) => h.E.rate(x) === h.E.rate(leeds[0])).map((x) => x.n).join(' and ')}, and the lowest ${h.pp(h.E.rate(leeds[leeds.length - 1]))}. Volumes differ too: from ${h.num(Math.min(...leeds.map((x) => x.t)))} to ${h.num(Math.max(...leeds.map((x) => x.t)))} tests in the year. ${noWait.length ? `${noWait.map((x) => x.n).join(' and ')} had no median wait published for ${h.month(h.lastMonth)}${noWait.length === 1 ? ', so the table shows n/a for it' : ', so the table shows n/a for them'}; the months before it are in the DVSA table.` : ''} Searching for a Leeds driving test centre, the table below is the quickest way to see the rate and queue of each.</p>
${h.centreTable(leeds, `Driving test centres with a Leeds address, ${Y}: car tests, pass rate, three-year change and median wait in ${h.month(h.lastMonth)}. DVSA tables DRT122A and DRT122F; addresses from GOV.UK.`)}
<h2>Results by age</h2>
<p>Seventeen-year-olds took ${h.num(n17)} of Colton Mill's tests and passed ${h.pc(c.age['17'])}. In ${above.length} of the ${ages.length} age groups shown, the centre's rate was above the national rate for the same age${above.length === ages.length ? ', so the advantage held right across the range' : above.length === 0 ? ', none at all' : ''}. Each age here rests on a few hundred tests at most, so a gap of two or three points between neighbouring ages is within the noise. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, against ${h.pc(h.gb.m)} and ${h.pc(h.gb.f)} nationally.</p>
${h.ageTable(ID)}
<h2>First attempts and gearboxes</h2>
<p>First-time candidates passed ${h.pc(c.first)}, ${c.first! > h.gb.first ? 'above' : 'below'} the British first-attempt rate of ${h.pc(h.gb.first)}, and ${h.num(c.zero)} of them drove a whole test without a recorded fault. ${c.auto != null ? `Automatic cars accounted for ${h.num(c.autoTests)} tests with a pass rate of ${h.pc(c.auto)}; manual candidates passed ${h.pp(c.l.mn)}.` : ''} The ${h.a('first-time-pass-rates', 'first-time pass rate page')} ranks every centre on this measure.</p>
<h2>How the queue has moved</h2>
<p>${c.wait ? `${c.waitYearAgo != null ? `A year before the latest figure the median Colton Mill wait was ${h.wk(c.waitYearAgo)}` : `In ${h.month(firstM)} the median Colton Mill wait was ${h.wk(c.f.wait[firstM][0] as number)}`}; the latest, for ${h.month(c.wait.month)}, is ${h.wk(c.wait.median)}. The first tenth of tests in that month had been booked ${h.wk(c.wait.w10)} ahead, ${(c.wait.w10 ?? 0) < h.P.rules.releaseWeeksAhead ? `short of the ${h.P.rules.releaseWeeksAhead}-week release window, a sign that not every new slot was taken the moment it appeared` : 'the full release window'}.` : 'No recent wait has been published.'} Examiners cancelled ${h.num(c.cancel?.total ?? 0)} tests in ${Y}${c.cancel ? `, ${h.num(c.cancel.medical)} of them for illness and ${h.num(c.cancel.leave)} for leave or training` : ''}, each of which had to be rebooked.</p>
<h2>Moving a Colton Mill test</h2>
<p>DVSA lists ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')} as the nearest centres. Ranked by pass rate: ${ranked.map((n) => `${n.name} ${h.pp(n.rate)}`).join(', ')}. Since ${h.date(h.P.rules.nearestThreeFrom)} these three are the only places a car test booked here can be moved to.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK test centre finder')}, ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

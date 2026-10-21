import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'speke-liverpool';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 640,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-north-west', 'centre-norris-green-liverpool', 'driving-test-pass-rates-by-year', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'speke-driving-test-centre',
  nav: 'Liverpool (Speke)',
  card: 'Speke pass rate since 2021, results by age, the wait and three nearby centres.',
  title: `Liverpool Speke Driving Test Centre: Pass Rate ${YL}`,
  description: `Liverpool Speke driving test centre: ${YL} car pass rate, its five-year record, results by age, the monthly wait and the 3 centres a test can move to.`,
  h1: 'Speke (Liverpool) driving test centre: pass rate and wait',
  intro: 'Dakota Business Park, L19: a south Liverpool car centre, with five years of DVSA results and the centres around it.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const low = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const gbMed = h.gb.wait?.[3];
    return `Speke passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests in ${Y}, ${h.num(c.passes)} passes in all. ${low === h.lastYear ? 'That is the lowest figure in the five-year series.' : `The weakest year in the five-year series was ${h.yearLabel(low)}, at ${h.pc(c.rateOf(low))}, so the centre has gained ${h.pts((c.rate! - (c.rateOf(low) ?? 0)) * 100).replace('+', '')} since then.`} The rate remains ${c.rate! < h.gb.rate ? 'below' : 'above'} the ${h.pc(h.gb.rate)} of Great Britain and ${c.rate! < (c.regionRate ?? 0) ? 'below' : 'above'} the North West's ${h.pc(c.regionRate)}; within the region it ranks ${h.ord(c.rankRegion)} of ${c.ofRegion} centres with at least 300 tests. ${c.wait ? `Where Speke ${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'does better' : 'does not do better'} is the wait: in ${h.month(c.wait.month)} the median test had been booked ${h.wk(c.wait.median)} ahead, against ${h.wk(gbMed)} for Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : 'DVSA published no wait for Speke in the latest month.'} Women passed ${h.pc(c.fem)} and men ${h.pc(c.m)}, ${(c.fem ?? 0) > (c.m ?? 0) ? 'so women came out ahead' : 'so men came out ahead'}. The tables show the yearly series, each age and the three centres DVSA lets a Speke test move to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ng = h.C('norris-green-liverpool');
    return [
      { q: 'Has the pass rate at Speke improved?', a: `Over three years it changed by ${h.pts(c.trend3)}, reaching ${h.pc(c.rate)} in ${Y}, against ${h.pc(c.rateOf(c.years[0]))} at the start of the five-year series in ${h.yearLabel(c.years[0])}. The national rate in ${Y} was ${h.pc(h.gb.rate)}. These are averages over thousands of tests and say little about the chances of any single candidate, whose own preparation is not in the data.` },
      { q: 'Speke or Norris Green: which Liverpool centre should I book?', a: `In ${Y} Speke passed ${h.pc(c.rate)} and Norris Green ${h.pc(ng.rate)}. In ${h.month(h.lastMonth)} the median waits were ${h.wk(c.wait?.median)} at Speke and ${h.wk(ng.wait?.median)} at Norris Green, so Speke was ${(c.wait?.median ?? 99) < (ng.wait?.median ?? 99) ? 'the quicker' : 'not the quicker'} of the two. Norris Green is ${h.num(c.near.find((n) => n.id === 'norris-green-liverpool')?.miles ?? 0)} miles away on DVSA's list of nearest centres.` },
      { q: 'How many Speke tests were cancelled by examiners?', a: c.cancel ? `DVSA counted ${h.num(c.cancel.total)} examiner-side cancellations at Speke in ${Y}: ${h.num(c.cancel.leave)} for leave or training, ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.weather)} for weather. Set against ${h.num(c.tests)} tests conducted, that is ${h.pc(c.cancel.total / Math.max(1, c.tests))} of the year's tests, and every affected candidate was given another date by DVSA.` : `DVSA did not publish examiner cancellation figures for Speke in ${Y}; the tables on this page cover tests conducted and passed.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    let rises = 0;
    for (let i = ys.length - 1; i > 0 && (c.rateOf(ys[i]) ?? 0) > (c.rateOf(ys[i - 1]) ?? 0); i--) rises++;
    const gbGain = (h.gb.rate - h.E.gbRate(ys[0])) * 100;
    const gain = (c.rate! - (c.rateOf(ys[0]) ?? 0)) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const behind = ages.filter((k) => (c.age[k] ?? 0) < (h.E.ageRate(Number(k)) ?? 0));
    const odd = ages.filter((k) => k !== '17').reduce((a, k) => ((c.age[k] ?? 0) > (c.age[a] ?? 0) ? k : a), ages.find((k) => k !== '17') ?? '18');
    const months = h.F.months(c.f).slice(-12);
    const under = months.filter((k) => (c.f.wait[k][0] ?? 99) < (h.F.areaWait('Great Britain', k)?.[3] ?? 0)).length;
    const liv = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Liverpool)')), 'rate');
    const quick = h.E.sorted(liv.filter((x) => x.w != null), 'wait', true)[0];
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    return `
<h2>${rises >= 2 ? `${rises} years of gains in a row` : 'The five-year path'}</h2>
<p>${rises >= 2 ? `Speke's rate has risen in each of the last ${rises} years of the series.` : rises === 1 ? 'The rate rose in the latest year.' : 'The rate did not rise in the latest year.'} From ${h.yearLabel(ys[0])} to ${Y} it moved by ${h.pts(gain)}, while the British rate moved by ${h.pts(gbGain)}, so Speke ${gain > gbGain ? 'closed part of the gap with' : 'did not close the gap with'} the national figure. Volumes varied: ${h.num(Math.min(...ys.map((y) => c.f.pass[y][0])))} tests in the quietest year, ${h.num(Math.max(...ys.map((y) => c.f.pass[y][0])))} in the busiest. The ${h.a('driving-test-pass-rates-by-year', 'pass rates by year')} page shows the national series behind the last column.</p>
${h.yearTable(ID)}
<h2>Age by age at Speke</h2>
<p>In ${behind.length === ages.length ? `every one of the ${ages.length}` : `${behind.length} of the ${ages.length}`} ages DVSA publishes for Speke, the centre's rate was below the national rate for that age${behind.length === ages.length ? ', so the shortfall runs across every age group rather than one' : ''}. Seventeen-year-olds passed ${h.pc(c.age['17'])}. Among older candidates the best figure belonged to age ${odd}, at ${h.pc(c.age[odd])}, but with a few hundred tests per age such single-age peaks are fragile. First-time candidates passed ${h.pc(c.first)}, and ${h.num(c.zero)} of them without a recorded fault.</p>
${h.ageTable(ID)}
<h2>Speke's queue month by month</h2>
<p>${c.wait ? `In ${under} of the last twelve months the median Speke wait was shorter than the British median for the same month. For ${h.month(c.wait.month)} it was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. The first tenth of that month's tests had been booked ${h.wk(c.wait.w10)} ahead${(c.wait.w10 ?? 0) < h.P.rules.releaseWeeksAhead ? `, short of the ${h.P.rules.releaseWeeksAhead}-week release window, a sign that slots were still free some time after release` : ''}.` : 'DVSA has not published recent waits for Speke.'} ${c.auto != null ? `Automatic candidates, ${h.pc(c.autoShare, 0)} of the total, passed ${h.pc(c.auto)}.` : ''}</p>
<h2>Speke and the other Liverpool-named centres</h2>
<p>DVSA gives the Liverpool name to ${liv.length} centres. On ${Y} pass rates Speke stands ${h.ord(liv.findIndex((x) => x.id === ID) + 1)} of them, with ${h.cl(liv[0].id, liv[0].n)} at the top on ${h.pp(h.E.rate(liv[0]))}. ${quick?.id === ID ? `Speke itself had the quickest ${h.month(h.lastMonth)} wait of the group, ${h.wk(quick.w)}.` : `On the ${h.month(h.lastMonth)} wait the quickest was ${quick ? `${quick.n} at ${h.wk(quick.w)}` : 'not published'}.`} Of those centres, only the ones on Speke's own DVSA list can take a test moved from here.</p>
<h2>The three centres a Speke test can move to</h2>
<p>DVSA lists ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. Ordered by ${Y} pass rate they run ${ranked.map((n) => `${n.name} , ${h.pp(n.rate)}`).join(', ')}. ${ranked[0] && (ranked[0].rate as number) > c.rate! * 100 ? `${ranked[0].name} passed more candidates than Speke; its wait in ${h.month(h.lastMonth)} was ${h.wk(ranked[0].wait)}, against ${h.wk(c.wait?.median)} here.` : 'None of them passed more candidates than Speke.'} ${c.notes.length ? `GOV.UK adds: "${c.notes[0]}"` : ''}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

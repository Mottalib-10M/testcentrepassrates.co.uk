import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'norris-green-liverpool';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 639,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-north-west', 'centre-speke-liverpool', 'hardest-driving-test-centres', 'pass-rate-by-attempt', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'norris-green-driving-test-centre',
  nav: 'Liverpool (Norris Green)',
  card: 'Norris Green pass rate, five years of results, the wait and the Liverpool centres.',
  title: `Liverpool Norris Green Test Centre: Pass Rate ${YL}`,
  description: `Liverpool Norris Green driving test centre: ${YL} car pass rate, five-year trend, women and men, the monthly wait and the other Liverpool centres compared.`,
  h1: 'Norris Green (Liverpool) driving test centre: pass rate and wait',
  intro: 'Parthenon Drive, L11: a north Liverpool car centre, read against Speke, Southport and St Helens and its own five-year record.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const liv = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Liverpool)')), 'rate');
    const pos = liv.findIndex((x) => x.id === ID) + 1;
    const gbMed = h.gb.wait?.[3];
    const gap = (h.gb.rate - c.rate!) * 100;
    return `Fewer than ${c.rate! < 0.4 ? 'four' : c.rate! < 0.5 ? 'five' : 'six'} in ten car tests at Norris Green ended in a pass in ${Y}: ${h.num(c.passes)} of ${h.num(c.tests)}, or ${h.pc(c.rate)}. That is ${h.num(Math.abs(Math.round(gap * 10) / 10))} points ${gap > 0 ? 'below' : 'above'} the British rate of ${h.pc(h.gb.rate)} and ${c.rate! < (c.regionRate ?? 0) ? 'below' : 'above'} the North West's ${h.pc(c.regionRate)}, ${c.rankRegion === c.ofRegion ? `the lowest of all ${c.ofRegion}` : `${h.ord(c.rankRegion)} of ${c.ofRegion}`} centres in the region with 300 tests or more. Among the ${liv.length} centres DVSA names after Liverpool it is ${pos === liv.length ? 'last' : h.ord(pos)} on pass rate. The rate changed by ${h.pts(c.trend3)} in three years, against ${h.pts((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 100)} for Great Britain. ${c.wait ? `Getting a test took a median ${h.wk(c.wait.median)} of notice in ${h.month(c.wait.month)}, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'more than' : 'less than'} the ${h.wk(gbMed)} for Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'No wait was published for the latest month.'} Below: the five-year series, the monthly queue and the three centres a test can be moved to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const liv = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Liverpool)')), 'rate');
    const wal = c.near.find((n) => n.id === 'wallasey');
    return [
      { q: 'Which Liverpool driving test centre has the best pass rate?', a: `Of the ${liv.length} centres DVSA names after Liverpool, ${liv[0].n} had the highest ${Y} rate, ${h.pp(h.E.rate(liv[0]))}, and ${liv[liv.length - 1].n} the lowest, ${h.pp(h.E.rate(liv[liv.length - 1]))}. ${liv[liv.length - 1].id === ID ? 'Norris Green is that lowest one.' : `Norris Green passed ${h.pc(c.rate)}.`} Only the three centres on a centre's DVSA list can receive a moved test, so the full ranking matters most before you first book.` },
      { q: 'Is Norris Green one of the hardest test centres?', a: `Its ${Y} rate of ${h.pc(c.rate)} placed it ${h.ord(c.rankGB)} of ${c.ofGB} British centres with at least 1,000 tests, counting from the highest rate, ${c.rankGB > c.ofGB * 0.8 ? 'in the bottom fifth' : c.rankGB > c.ofGB / 2 ? 'in the lower half' : 'in the upper half'}. The hardest centres page lists the lowest rates nationally. A low centre rate reflects all its candidates, not the difficulty of any one test.` },
      { q: 'Can I move a Norris Green test to Wallasey?', a: wal ? `Yes, Wallasey is on the DVSA list of nearest centres for Norris Green, ${h.num(wal.miles)} miles away. It passed ${h.pp(wal.rate)} of car tests in ${Y}, and its median wait in ${h.month(h.lastMonth)} was ${h.wk(wal.wait)}. A move uses one of the ${h.P.rules.changesAllowed} changes allowed on each booking.` : `Wallasey is not currently on the DVSA list of nearest centres for Norris Green, so a test cannot be moved there directly. Since ${h.date(h.P.rules.nearestThreeFrom)} only the three listed centres can receive a moved test.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const top = ys.reduce((a, y) => ((c.rateOf(y) ?? 0) > (c.rateOf(a) ?? 0) ? y : a), ys[0]);
    const fp = c.firstTests * (c.first ?? 0);
    const gbZ = h.E.NATIONAL.first[h.lastYear][2] / h.E.NATIONAL.first[h.lastYear][1];
    const months = h.F.months(c.f).slice(-12);
    const first6 = months.slice(0, 6).map((k) => c.f.wait[k][0]).filter((v): v is number => v != null);
    const last6 = months.slice(6).map((k) => c.f.wait[k][0]).filter((v): v is number => v != null);
    const avg = (v: number[]) => v.reduce((s, x) => s + x, 0) / Math.max(1, v.length);
    const best = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const liv = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Liverpool)')), 'rate');
    const busiest = h.E.sorted(liv, 'tests')[0];
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Liverpool');
    return `
<h2>${top === h.lastYear ? 'The best year on record' : `Down from ${h.pc(c.rateOf(top))}`}</h2>
<p>The best year in the five-year series was ${h.yearLabel(top)}, when ${h.pc(c.rateOf(top))} of Norris Green's tests were passed. ${top === h.lastYear ? 'The latest year is that best year.' : `The latest year, ${Y}, is ${h.pts(Math.abs((c.rate! - (c.rateOf(top) ?? 0)) * 100)).replace('+', '')} lower.`} Over the same span the British rate moved from ${h.pc(h.E.gbRate(ys[0]))} to ${h.pc(h.gb.rate)}${(h.gb.rate > h.E.gbRate(ys[0])) !== (c.rate! > (c.rateOf(ys[0]) ?? 0)) ? ', in the opposite direction to Norris Green' : ', in the same direction'}. ${c.tests > c.f.pass[ys[0]][0] ? 'The number of tests grew' : 'The number of tests fell'}, from ${h.num(c.f.pass[ys[0]][0])} to ${h.num(c.tests)}. The ${h.a('hardest-driving-test-centres', 'hardest centres ranking')} shows where Norris Green falls nationally.</p>
${h.yearTable(ID)}
<h2>Women, men and clean sheets</h2>
<p>${(c.fem ?? 0) > (c.m ?? 0) ? `Women passed ${h.pc(c.fem)} and men ${h.pc(c.m)}, ${h.gb.m > h.gb.f ? 'the opposite of the national order' : 'the same order as nationally'}.` : `Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}.`} First-time candidates succeeded ${h.pc(c.first)} of the time, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} of roughly ${h.num(Math.round(fp))} first-time passes came without a single driving fault, ${h.pc(fp ? c.zero / fp : 0)} against ${h.pc(gbZ)} across Great Britain. ${h.num(c.firstTests)} candidates sat their first test here, ${h.pc(c.firstTests / Math.max(1, c.tests), 0)} of all tests. For learners who do not pass first time, the ${h.a('pass-rate-by-attempt', 'pass rate by attempt')} page shows how the national odds change from one try to the next.</p>
<h2>Norris Green among the Liverpool centres</h2>
<p>DVSA names ${liv.length} centres after Liverpool. In ${Y} the busiest was ${busiest.n}, with ${h.num(busiest.t)} car tests${busiest.id === ID ? '' : `, against ${h.num(c.tests)} at Norris Green`}. Their pass rates ran from ${h.pp(h.E.rate(liv[0]))} at ${h.cl(liv[0].id, liv[0].n)} to ${h.pp(h.E.rate(liv[liv.length - 1]))} at ${liv[liv.length - 1].n}, a spread of ${h.num(Math.round(((h.E.rate(liv[0]) ?? 0) - (h.E.rate(liv[liv.length - 1]) ?? 0)) * 10) / 10)} points among centres that share the Liverpool name. ${c.auto != null ? `At Norris Green itself, automatic candidates passed ${h.pc(c.auto)} and manual candidates ${h.pp(c.l.mn)}, with automatics making up ${h.pc(c.autoShare, 0)} of tests.` : ''} Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} for that age nationally.</p>
<h2>Twelve months of waits</h2>
<p>${c.wait ? `Averaged over the older half of the last twelve months, the median wait was ${h.wk(Math.round(avg(first6) * 10) / 10)}; over the recent half, ${h.wk(Math.round(avg(last6) * 10) / 10)}. ${avg(last6) > avg(first6) + 0.5 ? 'The wait has lengthened over the year' : avg(last6) < avg(first6) - 0.5 ? 'The wait has shortened over the year' : 'The wait has held level over the year'}, and ${h.month(c.wait.month)} closed at ${h.wk(c.wait.median)}, with ${h.pp(c.wait.in7)} of that month's tests booked inside seven weeks against ${h.pp(h.gb.wait?.[4])} across Great Britain. Examiners cancelled ${h.num(c.cancel?.total ?? 0)} tests in ${Y}${c.cancel ? `, ${h.num(c.cancel.weather)} of them because of the weather` : ''}.` : 'No recent wait has been published for Norris Green.'}</p>
${h.waitTable(ID)}
<h2>${c.near.map((n) => n.name.replace(' (Liverpool)', '')).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The three centres DVSA lists for Norris Green are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles`).join('; ')}. ${best ? `${best.name} had the strongest ${Y} rate of them, ${h.pp(best.rate)}, ${best.rate! > c.rate! * 100 + 5 ? 'well above' : best.rate! > c.rate! * 100 ? 'above' : 'not above'} Norris Green's.` : ''} ${th ? `For the theory test, the Liverpool theory centre passed ${h.pc(h.E.theoryRate(th))} of car candidates in ${Y}.` : ''} ${c.notes.length ? `GOV.UK note: "${c.notes[0]}"` : ''}</p>
${h.nearTable(ID)}
<p>Data: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK centre finder')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'cardiff-llanishen';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 643,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-wales', 'centre-swansea', 'driving-test-pass-rates-by-year', 'automatic-driving-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'cardiff-llanishen-driving-test-centre',
  nav: 'Cardiff (Llanishen)',
  card: 'Llanishen pass rate over five years, access, the wait and its 3 nearest centres.',
  title: `Cardiff Llanishen Driving Test Centre: Pass Rate ${YL}`,
  description: `Cardiff Llanishen driving test centre: ${YL} car pass rate, the five-year record, automatic results, wheelchair access, the wait and the 3 centres nearby.`,
  h1: 'Cardiff (Llanishen) driving test centre: pass rate and wait',
  intro: 'Cardiff Business Park, CF14: the only car test centre with Cardiff in its DVSA name, read against its five-year record and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const peak = ys.reduce((a, y) => ((c.rateOf(y) ?? 0) > (c.rateOf(a) ?? 0) ? y : a), ys[0]);
    const gbMed = h.gb.wait?.[3];
    return `Llanishen, the Cardiff test centre in the DVSA tables, ${h.E.sorted(h.E.inRegion('Wales'), 'tests')[0]?.id === ID ? 'ran more car tests than any other Welsh centre in' : 'was one of the Welsh centres reporting in'} ${Y}: ${h.num(c.tests)} of them, of which ${h.pc(c.rate)} ended in a pass. ${peak === h.lastYear ? 'That is its best year in the five-year series.' : `Its best year in the five-year series was ${h.yearLabel(peak)}, at ${h.pc(c.rateOf(peak))}, so the latest figure is ${h.pts(Math.abs((c.rate! - (c.rateOf(peak) ?? 0)) * 100)).replace('+', '')} lower.`} Wales as a whole passed ${h.pc(c.regionRate)} and Great Britain ${h.pc(h.gb.rate)}, which puts Llanishen ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the Welsh rate and ${c.rate! > h.gb.rate ? 'above' : 'below'} the British one, ${h.ord(c.rankRegion)} of ${c.ofRegion} Welsh centres with at least 300 tests. ${c.wait ? `The wait was ${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'shorter' : 'longer'} than the British median in ${h.month(c.wait.month)}: ${h.wk(c.wait.median)} against ${h.wk(gbMed)}, with ${h.pp(c.wait.in7)} of tests booked inside seven weeks.` : 'No waiting time was published for the latest month.'} Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. One practical point from GOV.UK matters before booking: the centre's note on wheelchair access, quoted further down with the three nearest centres.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const acc = c.notes.find((n) => /wheelchair/i.test(n));
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Cardiff');
    return [
      { q: 'Is Cardiff Llanishen driving test centre wheelchair accessible?', a: acc ? `GOV.UK's note for the centre reads: "${acc}" Candidates who need step-free access can choose another centre when booking, or raise their needs with DVSA during the booking on GOV.UK. The three nearest centres on DVSA's list are ${c.near.map((n) => n.name).join(', ')}.` : `GOV.UK currently shows no wheelchair note for Llanishen. Candidates with access needs can state them when booking on GOV.UK. The three nearest centres on DVSA's list are ${c.near.map((n) => n.name).join(', ')}.` },
      { q: 'How has the Cardiff Llanishen pass rate changed over five years?', a: `The DVSA figures show the rate at ${h.pc(c.rateOf(c.years[0]))} in ${h.yearLabel(c.years[0])} and ${h.pc(c.rate)} in ${Y}, a change of ${h.pts((c.rate! - (c.rateOf(c.years[0]) ?? 0)) * 100)}, while test numbers went from ${h.num(c.f.pass[c.years[0]][0])} to ${h.num(c.tests)}. DVSA gives no reasons for such changes, and a different mix of candidates can move a centre's rate without any change in the test itself.` },
      { q: 'What is the theory test pass rate in Cardiff?', a: th ? `The Cardiff theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, according to DVSA's theory tables, against ${h.pc(h.gb.theory)} across Great Britain. A theory pass is valid for two years and is needed before booking the practical test at Llanishen.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. A theory pass is needed before booking the practical test at Llanishen.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    let falls = 0;
    for (let i = ys.length - 1; i > 0 && (c.rateOf(ys[i]) ?? 0) < (c.rateOf(ys[i - 1]) ?? 0); i--) falls++;
    const drops = ys.slice(1).filter((y, i) => (c.rateOf(y) ?? 0) < (c.rateOf(ys[i]) ?? 0)).length;
    const gap = (c.l.mn ?? 0) - (c.l.a ?? 0);
    const share17 = (c.f.age['17']?.[0] ?? 0) / Math.max(1, c.tests);
    const higher = c.near.filter((n) => n.rate != null && (n.rate as number) > c.rate! * 100);
    const quicker = c.near.filter((n) => n.wait != null && (n.wait as number) < (c.wait?.median ?? 0));
    const acc = c.notes.find((n) => /wheelchair/i.test(n));
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Cardiff');
    const wv = h.F.months(c.f).slice(-12).map((k) => c.f.wait[k][0]).filter((x): x is number => x != null);
    const lo = { v: Math.min(...wv) }, hi = { v: Math.max(...wv) };
    return `
<h2>Five years at Llanishen</h2>
<p>In ${drops} of the ${ys.length - 1} year-on-year steps of the series, Llanishen's rate went down${falls >= 1 ? `, including the latest one` : ', but not in the latest one'}. It started at ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])}, when the British rate was ${h.pc(h.E.gbRate(ys[0]))}, and ended at ${h.pc(c.rate)} against ${h.pc(h.gb.rate)}. ${c.rateOf(ys[0])! > h.E.gbRate(ys[0]) && c.rate! < h.gb.rate ? 'So the centre went from above the national line to below it.' : c.rate! > h.gb.rate ? 'It is still above the national line.' : 'It stayed below the national line.'} The ${h.a('driving-test-pass-rates-by-year', 'yearly national series')} gives the context for every centre.</p>
${h.yearTable(ID)}
<h2>Automatic and manual candidates</h2>
<p>${c.auto != null ? `${h.num(c.autoTests)} tests at Llanishen were in automatic cars, ${h.pc(c.autoShare, 0)} of the total. Automatic candidates passed ${h.pc(c.auto)}, manual candidates ${h.pp(c.l.mn)}, a gap of ${h.num(Math.round(gap * 10) / 10)} points. The national automatic rate was ${h.pc(h.gb.auto)}, so Llanishen's automatic candidates did ${c.auto > h.gb.auto ? 'better' : 'worse'} than automatic candidates across Great Britain. A pass in an automatic car gives a licence for automatics only, so the gearbox is a choice about the licence as much as about the test.` : 'DVSA did not publish an automatic figure for Llanishen this year.'}</p>
<h2>Who takes the test here</h2>
<p>Seventeen-year-olds accounted for ${h.num(c.f.age['17']?.[0] ?? 0)} tests, ${h.pc(share17, 0)} of the year, and passed ${h.pc(c.age['17'])}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, ${(c.m ?? 0) > (c.fem ?? 0) ? 'men ahead' : 'women ahead'} by ${h.num(Math.round(Math.abs((c.m ?? 0) - (c.fem ?? 0)) * 1000) / 10)} points. First-time candidates managed ${h.pc(c.first)}, with ${h.num(c.zero)} passing without any recorded fault. ${c.cancel ? `Examiners cancelled ${h.num(c.cancel.total)} tests in ${Y}, ${h.num(c.cancel.medical)} for illness.` : ''}</p>
${h.ageTable(ID)}
<h2>Waiting for a Cardiff test</h2>
<p>${c.wait ? `Over the last twelve months the median Llanishen wait ran between ${h.wk(lo.v)} and ${h.wk(hi.v)}, and ${h.month(c.wait.month)} closed at ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. In that month the first tenth of tests had been booked ${h.wk(c.wait.w10)} ahead; ${(c.wait.w10 ?? 0) < h.P.rules.releaseWeeksAhead ? `that is inside the ${h.P.rules.releaseWeeksAhead}-week release window, which suggests some new slots stayed free for a while after release` : 'that is the full release window, so the earliest slots went on release'}. Wales as a whole had a median of ${h.wk(c.regionWait?.[3])} that month.` : 'DVSA has not published recent waits for Llanishen.'} ${th ? `For the theory test, DVSA lists a Cardiff theory centre that passed ${h.pc(h.E.theoryRate(th))} of car candidates in ${Y}.` : ''}</p>
<h2>Access and the three nearest centres</h2>
<p>${acc ? `GOV.UK states for Llanishen: "${acc}"` : 'GOV.UK lists no access note for Llanishen.'} The address is ${[c.addr[0].replace(`${c.name}, `, ''), c.addr[1], c.addr[2]].join(', ')}, and the tests offered are: ${c.types}. DVSA's nearest centres are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${higher.length === c.near.length ? `All three had a higher ${Y} pass rate` : higher.length === 0 ? `None had a higher ${Y} pass rate` : `${higher.length === 1 ? 'One' : 'Two'} had a higher ${Y} pass rate`}, and ${quicker.length === c.near.length ? 'all three' : quicker.length === 0 ? 'none' : quicker.length === 1 ? 'one' : 'two'} a shorter median wait in ${h.month(h.lastMonth)}. The ${h.a('move-driving-test-centre', 'moving guide')} explains the rules for a move.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory tables')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

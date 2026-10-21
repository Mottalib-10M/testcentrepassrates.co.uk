import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'edinburgh-currie';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 648,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-scotland', 'centre-edinburgh-musselburgh', 'driving-test-pass-rates-by-year', 'move-driving-test-centre', 'hardest-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'edinburgh-currie-driving-test-centre',
  nav: 'Edinburgh (Currie)',
  card: 'Currie pass rate year by year, the wait and the Livingston alternative.',
  title: `Edinburgh Currie Driving Test Centre: Pass Rate ${YL}`,
  description: `Edinburgh Currie driving test centre: ${YL} car pass rate, the five-year record, the monthly wait and how Livingston and Musselburgh compare nearby.`,
  h1: 'Edinburgh (Currie) driving test centre: pass rate and wait',
  intro: 'Bryce Road, Currie, EH14: the second Edinburgh centre in the DVSA tables, read year by year and against the centres a test can move to.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    let falls = 0;
    for (let i = ys.length - 1; i > 0 && (c.rateOf(ys[i]) ?? 0) < (c.rateOf(ys[i - 1]) ?? 0); i--) falls++;
    const gbMed = h.gb.wait?.[3];
    return `${falls >= 2 ? `For ${falls} years running, the Currie pass rate has gone down` : falls === 1 ? 'The Currie pass rate fell in the latest year' : 'The Currie pass rate did not fall in the latest year'}: it stood at ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} and at ${h.pc(c.rate)} in ${Y}, on ${h.num(c.tests)} car tests, of which ${h.num(c.passes)} were passes. Great Britain passed ${h.pc(h.gb.rate)} and Scotland ${h.pc(c.regionRate)} in the latest year, which leaves Currie ${c.rate! < h.gb.rate ? 'below' : 'above'} the British line, ${c.rate! < (c.regionRate ?? 0) ? 'below' : 'above'} the Scottish one and ${h.ord(c.rankRegion)} of ${c.ofRegion} Scottish centres with 300 tests or more. ${c.wait ? `On top of that, the queue is ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than average' : 'no longer than average'}: the median test in ${h.month(c.wait.month)} had been booked ${h.wk(c.wait.median)} ahead, against ${h.wk(gbMed)} nationally, and ${h.pp(c.wait.in7)} of candidates booked within seven weeks.` : 'No wait was published for Currie in the latest month.'} Below are the yearly figures, the monthly waits and the three centres DVSA lets a Currie booking move to, with their own rates and waits set side by side.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const lv = c.near.find((n) => n.id === 'livingston');
    const ms = h.C('edinburgh-musselburgh');
    return [
      { q: 'Should I move my Currie test to Livingston?', a: lv ? `Livingston is on Currie's DVSA list, ${h.num(lv.miles)} miles away. In ${Y} it passed ${h.pp(lv.rate)} of car tests against ${h.pc(c.rate)} at Currie, and its median wait in ${h.month(h.lastMonth)} was ${h.wk(lv.wait)} against ${h.wk(c.wait?.median)}. Whether that is worth the trip is a personal choice; the move uses one of the ${h.P.rules.changesAllowed} changes allowed on a booking.` : `Livingston is not on the current DVSA list of nearest centres for Currie, so a test cannot be moved there. Since ${h.date(h.P.rules.nearestThreeFrom)} only the three listed centres can receive a moved test.` },
      { q: 'Is Currie harder than Musselburgh in Edinburgh?', a: `On the ${Y} figures Currie passed ${h.pc(c.rate)} of car tests and Musselburgh ${h.pc(ms.rate)}, so ${c.rate! < ms.rate! ? 'Currie had the lower rate' : 'Currie had the higher rate'}. A centre's rate reflects everyone who tested there over the year, including how prepared they were, so it is a guide to past results rather than to the difficulty of any one test.` },
      { q: 'Is Currie driving test centre wheelchair accessible?', a: `${c.notes.length ? `GOV.UK's note for Currie reads: "${c.notes[0]}"` : 'GOV.UK shows no access note for Currie at present.'} The address it gives is ${c.addr.join(', ')}. The tests offered there are: ${c.types}. Any particular needs can be stated when booking on GOV.UK, the only place a test can be booked.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const total = (c.rate! - (c.rateOf(ys[0]) ?? 0)) * 100;
    const gbTotal = (h.gb.rate - h.E.gbRate(ys[0])) * 100;
    const peakT = ys.reduce((a, y) => (c.f.pass[y][0] > c.f.pass[a][0] ? y : a), ys[0]);
    const months = h.F.months(c.f).slice(-12);
    const over20 = months.filter((k) => (c.f.wait[k][0] ?? 0) >= 20).length;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const below = ages.filter((k) => (c.age[k] ?? 0) < (h.E.ageRate(Number(k)) ?? 0)).length;
    const ms = h.C('edinburgh-musselburgh');
    const ed = h.E.CENTRES.filter((x) => x.n.startsWith('Edinburgh ('));
    const both = c.near.filter((n) => n.rate != null && n.wait != null && (n.rate as number) > c.rate! * 100 && (n.wait as number) < (c.wait?.median ?? 0));
    return `
<h2>The year-by-year record</h2>
<p>Across the five years, Currie's rate changed by ${h.pts(total)}, while the British rate changed by ${h.pts(gbTotal)}. ${total < 0 && gbTotal > 0 ? 'The centre and the country therefore moved in opposite directions.' : total < gbTotal ? 'The centre did worse than the country over the period.' : 'The centre kept pace with or beat the country over the period.'} The busiest year was ${h.yearLabel(peakT)}, with ${h.num(c.f.pass[peakT][0])} tests, against ${h.num(c.tests)} in ${Y}. DVSA publishes no explanation for a centre's trend, and the tables cannot separate a change in candidates from any other cause. The ${h.a('driving-test-pass-rates-by-year', 'national yearly series')} gives the background.</p>
${h.yearTable(ID)}
<h2>${below > ages.length / 2 ? 'Below the national rate at most ages' : 'Age by age against the national rate'}</h2>
<p>In ${below === ages.length ? `every one of the ${ages.length}` : `${below} of the ${ages.length}`} ages published for Currie, the pass rate was under the national rate for the same age. Seventeen-year-olds, ${Object.values(c.f.age).every((v) => v[0] <= (c.f.age['17']?.[0] ?? 0)) ? 'the largest group' : 'one of the age groups'} with ${h.num(c.f.age['17']?.[0] ?? 0)} tests, passed ${h.pc(c.age['17'])} against ${h.pc(h.E.ageRate(17))} nationally. Women passed ${h.pc(c.fem)} and men ${h.pc(c.m)}. First-time candidates managed ${h.pc(c.first)}, and ${h.num(c.zero)} passed with no fault recorded. ${c.auto != null ? `In automatic cars the rate was ${h.pc(c.auto)}, in manual cars ${h.pp(c.l.mn)}.` : ''}</p>
<h2>The two Edinburgh centres</h2>
<p>Searching for an Edinburgh driving test centre brings up ${ed.length === 2 ? 'two' : ed.length} in the DVSA tables, Currie and ${h.cl('edinburgh-musselburgh', 'Musselburgh')}. In ${Y} Musselburgh ran ${h.num(ms.tests)} car tests at ${h.pc(ms.rate)}, Currie ${h.num(c.tests)} at ${h.pc(c.rate)}, a gap of ${h.num(Math.round(Math.abs((ms.rate ?? 0) - (c.rate ?? 0)) * 1000) / 10)} points ${(ms.rate ?? 0) > (c.rate ?? 0) ? 'in Musselburgh\'s favour' : 'in Currie\'s favour'}. Their median waits in ${h.month(h.lastMonth)} were ${h.wk(ms.wait?.median)} and ${h.wk(c.wait?.median)}. ${h.yearLabel(ys[0])}, the first year of the series, ${((c.rateOf(ys[0]) ?? 0) > (ms.rateOf(ys[0]) ?? 0)) !== ((c.rate ?? 0) > (ms.rate ?? 0)) ? 'showed the opposite order' : 'showed the same order'}, with Currie at ${h.pc(c.rateOf(ys[0]))} and Musselburgh at ${h.pc(ms.rateOf(ys[0]))}. Since a test can move between centres only within the DVSA list, it helps that ${c.near.some((n) => n.id === 'edinburgh-musselburgh') ? 'Musselburgh is on the list for Currie' : 'the list for Currie is checked first'}.</p>
<h2>${over20 >= 6 ? 'A year of long waits' : 'Twelve months of waits'}</h2>
<p>${c.wait ? `In ${over20} of the last twelve months the median Currie wait was 20 weeks or longer. The latest figure, for ${h.month(c.wait.month)}, is ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year before` : ''}, while the Scottish median that month was ${h.wk(c.regionWait?.[3])}. ${c.cancel ? `Examiners also cancelled ${h.num(c.cancel.total)} tests in ${Y}, ${h.num(c.cancel.leave)} of them for leave or training.` : ''}` : 'DVSA has not published recent waits for Currie.'}</p>
${h.waitTable(ID)}
<h2>${c.near.map((n) => n.name.replace('Edinburgh (', '').replace(')', '')).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>DVSA's three nearest centres for Currie are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${both.length ? `${both.map((n) => `${n.name} beat Currie on both rate (${h.pp(n.rate)}) and wait (${h.wk(n.wait)})`).join('; ')} in the latest figures.` : 'None of them beat Currie on both rate and wait in the latest figures.'} The ${h.a('move-driving-test-centre', 'guide to moving a test')} explains the limit of ${h.P.rules.changesAllowed} changes and the nearest-three rule in force since ${h.date(h.P.rules.nearestThreeFrom)}.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

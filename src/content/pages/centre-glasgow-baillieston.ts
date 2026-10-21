import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'glasgow-baillieston';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 645,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-scotland', 'centre-glasgow-shieldhall', 'driving-test-waiting-times', 'move-driving-test-centre', 'driving-test-booking-rules-2026'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'glasgow-baillieston-driving-test-centre',
  nav: 'Glasgow (Baillieston)',
  card: 'Baillieston rate and wait, the Glasgow centres side by side, and Airdrie nearby.',
  title: `Glasgow Baillieston Driving Test Centre: Pass Rate ${YL}`,
  description: `Glasgow Baillieston driving test centre: ${YL} car pass rate, a year of waiting times, the Glasgow centres compared and the nearby centres a test can move to.`,
  h1: 'Glasgow (Baillieston) driving test centre: pass rate and wait',
  intro: 'Springhill Parkway, G69: a Glasgow centre for car and instructor tests, read through its queue and the centres around it.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    const sc = c.regionWait?.[3];
    return `${c.wait ? `Half of the tests taken at Baillieston in ${h.month(c.wait.month)} had been booked more than ${h.wk(c.wait.median)} beforehand, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'no longer than'} the ${h.wk(gbMed)} of Great Britain and ${(c.wait.median ?? 0) > (sc ?? 0) ? 'longer than' : 'no longer than'} the ${h.wk(sc)} of Scotland; ${h.pp(c.wait.in7)} of candidates had found a date within seven weeks.` : 'DVSA published no wait for Baillieston in the latest month.'} The pass rate in ${Y} was ${h.pc(c.rate)}, from ${h.num(c.tests)} car tests, against ${h.pc(h.gb.rate)} for Great Britain and ${h.pc(c.regionRate)} for Scotland, which puts the centre ${h.ord(c.rankRegion)} of ${c.ofRegion} Scottish centres with at least 300 tests. Its three-year change is ${h.pts(c.trend3)}, against ${h.pts((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 100)} nationally. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. For a learner searching for a Glasgow driving test centre, the table below compares Baillieston with the other Glasgow sites, and the last section shows where a booking can be moved.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gl = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Glasgow (')), 'rate');
    const air = c.near.find((n) => n.id === 'airdrie');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Glasgow');
    return [
      { q: 'Which Glasgow driving test centre is the easiest?', a: `On ${Y} pass rates, ${gl[0].n} led the ${gl.length} Glasgow centres at ${h.pp(h.E.rate(gl[0]))}, and ${gl[gl.length - 1].n} was lowest at ${h.pp(h.E.rate(gl[gl.length - 1]))}. ${gl[0].id === ID ? 'So Baillieston was the highest of the three.' : `Baillieston passed ${h.pc(c.rate)}.`} A pass rate describes all of a centre's candidates over a year; it is not a measure of how hard an individual test will be.` },
      { q: 'Can I move a Baillieston test to Airdrie?', a: air ? `Yes, Airdrie is on the DVSA list of nearest centres for Baillieston, ${h.num(air.miles)} miles away. Its ${Y} pass rate was ${h.pp(air.rate)} and its median wait in ${h.month(h.lastMonth)} ${h.wk(air.wait)}, against ${h.wk(c.wait?.median)} at Baillieston. The move uses one of the ${h.P.rules.changesAllowed} changes allowed on a booking.` : `Airdrie is not on the current DVSA list of nearest centres for Baillieston, so a test cannot be moved there. Since ${h.date(h.P.rules.nearestThreeFrom)} only the three listed centres can receive a moved test.` },
      { q: 'What is the Glasgow theory test pass rate?', a: th ? `DVSA's theory tables give the Glasgow theory centre a ${Y} car pass rate of ${h.pc(h.E.theoryRate(th))}, against ${h.pc(h.gb.theory)} across Great Britain. The theory test is booked on GOV.UK, costs £${h.num(h.P.fees.theory)}, and has to be passed before a practical test at Baillieston can be booked.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test must be passed before a practical test at Baillieston can be booked.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gl = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Glasgow (')), 'rate');
    const busiest = h.E.sorted(gl, 'tests')[0];
    const months = h.F.months(c.f).slice(-12);
    const over = months.filter((k) => (c.f.wait[k][0] ?? 0) > (h.F.areaWait('Great Britain', k)?.[3] ?? 99)).length;
    const full = months.filter((k) => (c.f.wait[k][1] ?? 0) >= h.P.rules.releaseWeeksAhead).length;
    const near = [...c.near].filter((n) => n.wait != null && n.rate != null);
    const sameRateQuicker = near.filter((n) => (n.wait as number) < (c.wait?.median ?? 0) - 5 && (n.rate as number) >= c.rate! * 100 - 1);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Glasgow');
    return `
<h2>The Glasgow centres side by side</h2>
<p>DVSA lists ${gl.length} centres with Glasgow in their name. ${busiest.id === ID ? 'Baillieston ran the most car tests of them' : `${busiest.n} ran the most car tests`} in ${Y}, ${h.num(busiest.t)}. ${gl[0].id === ID ? `Baillieston also had the best rate, ${h.pp(h.E.rate(gl[0]))}.` : `The best rate belonged to ${h.cl(gl[0].id, gl[0].n)}, ${h.pp(h.E.rate(gl[0]))}.`} The shortest ${h.month(h.lastMonth)} wait was at ${h.E.sorted(gl.filter((x) => x.w != null), 'wait', true)[0]?.n ?? 'none with a published figure'}. ${th ? `The Glasgow theory centre, listed separately in the ${h.src('dvsa_theory_centre', 'DVSA theory tables')}, passed ${h.pc(h.E.theoryRate(th))} of car theory tests in the same year.` : ''}</p>
${h.centreTable(gl, `Glasgow driving test centres, ${Y}: car tests, pass rate, three-year change and median wait in ${h.month(h.lastMonth)}. DVSA tables DRT122A and DRT122F.`)}
<h2>How long the Baillieston queue has been</h2>
<p>${c.wait ? `In ${over === months.length ? 'every one' : over} of the last twelve months the median Baillieston wait was longer than the British median for the same month, and in ${full === months.length ? 'all of them' : `${full} of them`} the first tenth of tests had been booked a full ${h.P.rules.releaseWeeksAhead} weeks ahead. ${full >= 6 ? 'Together these suggest that new slots were taken as soon as DVSA released them and that later bookers relied on dates handed back by others.' : 'In the other months some early slots were still free after release.'} The latest median is ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}.` : 'DVSA has not published recent waits for Baillieston.'} The ${h.a('driving-test-booking-rules-2026', 'booking rules of 2026')} explain how released and returned slots are handled.</p>
${h.waitTable(ID)}
<h2>Baillieston within Scotland</h2>
<p>Scotland's centres passed ${h.pc(c.regionRate)} of car tests in ${Y}, and Baillieston, at ${h.pc(c.rate)}, stood ${h.ord(c.rankRegion)} of the ${c.ofRegion} Scottish centres with at least 300 tests. On the wait, the Scottish median in ${h.month(h.lastMonth)} was ${h.wk(c.regionWait?.[3])}, against ${h.wk(c.wait?.median)} here, so a Baillieston candidate ${(c.wait?.median ?? 0) > (c.regionWait?.[3] ?? 0) ? 'waited longer than' : 'did not wait longer than'} the typical Scottish learner. Across Great Britain as a whole the centre ranks ${h.ord(c.rankGB)} of ${c.ofGB} on pass rate among centres with 1,000 tests or more.</p>
<h2>What the pass figures show</h2>
<p>First-time candidates passed ${h.pc(c.first)}, ${c.first! > h.gb.first ? 'above' : 'below'} the British first-time rate of ${h.pc(h.gb.first)}, and ${h.num(c.zero)} of them without any recorded fault. Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} for that age across Great Britain. ${c.auto != null ? `Automatic candidates, ${h.pc(c.autoShare, 0)} of the total, passed ${h.pc(c.auto)} against ${h.pp(c.l.mn)} in manual cars.` : ''} The yearly series runs from ${h.pc(c.rateOf(c.years[0]))} in ${h.yearLabel(c.years[0])} to ${h.pc(c.rate)} in ${Y}.</p>
<h2>Moving to a quicker centre</h2>
<p>DVSA's nearest centres for Baillieston are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${sameRateQuicker.length ? `${sameRateQuicker.map((n) => `${n.name} had a similar or better ${Y} rate, ${h.pp(n.rate)}, with a median wait of only ${h.wk(n.wait)}`).join('; ')}, which makes ${sameRateQuicker.length === 1 ? 'it' : 'them'} the alternative most worth weighing.` : 'None of them combined a similar rate with a much shorter wait in the latest month.'} The ${h.a('move-driving-test-centre', 'guide to moving a test')} sets out how a move uses one of the ${h.P.rules.changesAllowed} changes allowed.</p>
${h.nearTable(ID)}
<p>Data from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and ${h.src('dvsa_waits', 'DVSA waiting times')}; address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

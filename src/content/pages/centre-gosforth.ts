import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'gosforth';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 650,
  tool: { kind: 'finder', props: { centre: ID, radius: 18 } },
  related: ['region-north-east', 'driving-test-cancellations', 'driving-test-waiting-times', 'theory-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'gosforth-driving-test-centre',
  nav: 'Newcastle (Gosforth)',
  card: 'Gosforth pass rate, weather cancellations, the wait and its 3 nearest centres.',
  title: `Newcastle Gosforth Driving Test Centre: Pass Rate ${YL}`,
  description: `Newcastle Gosforth driving test centre: ${YL} car pass rate, tests lost to weather and illness, the monthly wait, the theory centre and 3 centres nearby.`,
  h1: 'Gosforth (Newcastle) driving test centre: pass rate and wait',
  intro: 'Sandy Lane, NE3: the Newcastle upon Tyne centre for cars, lorries and buses, with its cancellations, its queue and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    return `Gosforth, the Newcastle upon Tyne test centre, passed ${h.pc(c.rate)} of its ${h.num(c.tests)} car tests in ${Y}. The rate for the North East was ${h.pc(c.regionRate)} and for Great Britain ${h.pc(h.gb.rate)}, so the centre stood ${Math.abs(c.rate! - (c.regionRate ?? 0)) < 0.0005 ? 'level with' : c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} its region and ${c.rate! > h.gb.rate ? 'above' : 'below'} the country, ${h.ord(c.rankRegion)} of ${c.ofRegion} North East centres with at least 300 tests. In ${h.yearLabel(h.E.YEARS[0])} the rate was ${h.pc(c.rateOf(h.E.YEARS[0]))}, so the change since then is ${h.pts(c.trend3)}. ${c.wait ? `The median candidate in ${h.month(c.wait.month)} had booked ${h.wk(c.wait.median)} before the test, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'within'} the British median of ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} had booked inside seven weeks.` : 'No wait was published for Gosforth in the latest month.'} ${c.cancel ? `Examiners called off ${h.num(c.cancel.total)} tests over the year, ${h.num(c.cancel.weather)} of them because of the weather.` : ''} Below come the three nearest centres, the cancellations, the yearly series and the recent waits.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Newcastle');
    const gh = c.near.find((n) => n.id === 'gateshead');
    return [
      { q: 'Are Gosforth driving tests often cancelled because of the weather?', a: c.cancel ? `In ${Y} DVSA recorded ${h.num(c.cancel.weather)} Gosforth tests cancelled for weather, ${h.pc(c.cancel.weather / Math.max(1, c.cancel.total), 0)} of all ${h.num(c.cancel.total)} examiner-side cancellations, against ${h.num(c.cancel.medical)} for illness. Weather cancellations are the examiner's call on the day; the candidate is offered a new date at no extra cost.` : `DVSA did not publish cancellation figures for Gosforth in ${Y}. When a test is cancelled for weather, the candidate is offered a new date at no extra cost.` },
      { q: 'Is Gateshead easier than Gosforth?', a: gh ? `${(gh.rate ?? 0) > c.rate! * 100 ? 'Yes' : 'No'}, on the ${Y} figures: Gateshead, ${h.num(gh.miles)} miles away on Gosforth's DVSA list, passed ${h.pp(gh.rate)} against ${h.pc(c.rate)} at Gosforth. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(gh.wait)}, against ${h.wk(c.wait?.median)} at Gosforth, so the choice between them is a trade between the rate and the date.` : `Gateshead is not on the current DVSA list of nearest centres for Gosforth. The three listed centres and their rates are in the table on this page.` },
      { q: 'What is the theory test pass rate in Newcastle?', a: th ? `DVSA's theory tables list a Newcastle theory centre with a ${Y} car pass rate of ${h.pc(h.E.theoryRate(th))}, against ${h.pc(h.gb.theory)} across Great Britain. The theory test is booked on GOV.UK for £${h.num(h.P.fees.theory)} and must be passed before the practical test at Gosforth can be booked.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test must be passed before the practical test at Gosforth can be booked.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    const quicker = c.near.filter((n) => n.wait != null && (n.wait as number) < (c.wait?.median ?? 0));
    const ys = c.years;
    const low = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const months = h.F.months(c.f).slice(-12);
    const over = months.filter((k) => (c.f.wait[k][0] ?? 0) > (h.F.areaWait('Great Britain', k)?.[3] ?? 99)).length;
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Newcastle');
    const wShare = c.cancel && c.cancel.total ? c.cancel.weather / c.cancel.total : 0;
    return `
<h2>${c.near.map((n) => n.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>A Gosforth booking can be moved to ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}, the three centres DVSA lists as nearest. Ranked by ${Y} pass rate: ${ranked.map((n) => `${n.name} ${h.pp(n.rate)}`).join(', ')}, against ${h.pc(c.rate)} here. ${quicker.length === c.near.length ? `All three had a shorter median wait than Gosforth in ${h.month(h.lastMonth)}.` : quicker.length === 0 ? `None had a shorter median wait than Gosforth in ${h.month(h.lastMonth)}.` : `${quicker.map((n) => n.name).join(' and ')} had a shorter median wait than Gosforth in ${h.month(h.lastMonth)}.`} The table puts both figures side by side; the ${h.a('move-driving-test-centre', 'moving guide')} explains the limit of ${h.P.rules.changesAllowed} changes.</p>
${h.nearTable(ID)}
<h2>Weather, illness and leave</h2>
<p>${c.cancel ? `Of the ${h.num(c.cancel.total)} Gosforth tests cancelled by DVSA in ${Y}, ${h.num(c.cancel.weather)} were called off for weather, ${h.num(c.cancel.medical)} for examiner illness and ${h.num(c.cancel.leave)} for leave or training. Weather therefore accounted for ${h.pc(wShare, 0)} of cancellations, ${wShare > 0.2 ? 'a large share for a single cause' : 'a modest share'}${c.cancel.weather > c.cancel.medical ? ', larger even than illness' : ''}. The ${h.a('driving-test-cancellations', 'cancellations page')} sets out what happens when a test is called off.` : `DVSA did not publish cancellation figures for Gosforth in ${Y}.`}</p>
<h2>Five years of results</h2>
<p>The lowest rate in the series came in ${h.yearLabel(low)}, at ${h.pc(c.rateOf(low))}, and the latest is ${h.pc(c.rate)}. Test numbers went from ${h.num(c.f.pass[ys[0]][0])} in ${h.yearLabel(ys[0])} to ${h.num(c.tests)}. First-time candidates passed ${h.pc(c.first)}, ${c.first! > h.gb.first ? 'above' : 'below'} the British ${h.pc(h.gb.first)}, and ${h.num(c.zero)} of them passed with no fault at all. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. ${c.auto != null ? `Automatic candidates managed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual candidates and ${h.pc(h.gb.auto)} for automatics nationally.` : ''}</p>
${h.yearTable(ID)}
<h2>Cars, lorries and buses</h2>
<p>GOV.UK lists these tests at ${c.addr[0].split(',')[0]}: ${c.types}. ${/lorry/.test(c.types) ? 'Lorry and bus candidates therefore use the same site as car learners, although they book in their own categories and their results are not part of the car figures on this page.' : ''} Seventeen-year-olds passed ${h.pc(c.age['17'])} of their car tests here${c.age['25'] != null ? `, and twenty-five-year-olds ${h.pc(c.age['25'])}, against ${h.pc(h.E.ageRate(25))} for that age nationally` : ''}. ${c.notes.length ? `The GOV.UK note for the centre reads: "${c.notes[0]}"` : ''}</p>
<h2>The queue in recent months</h2>
<p>${c.wait ? `In ${over === months.length ? 'every one' : over} of the last twelve months the Gosforth median was longer than the British median for the same month. The latest reading, ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier,` : ','} compares with ${h.wk(c.regionWait?.[3])} for the North East as a whole. ${th ? `For learners still to sit the theory test, the Newcastle theory centre passed ${h.pc(h.E.theoryRate(th))} of car candidates in ${Y}, as listed in the ${h.src('dvsa_theory_centre', 'DVSA theory tables')}.` : ''}` : 'DVSA has not published recent waits for Gosforth.'}</p>
${h.waitTable(ID, 6)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

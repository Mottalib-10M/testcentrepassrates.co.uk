import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'west-didsbury-manchester';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 633,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['region-north-west', 'centre-cheetham-hill-manchester', 'driving-test-waiting-times', 'compare-driving-test-centres', 'driving-test-booking-rules-2026'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'west-didsbury-driving-test-centre',
  nav: 'Manchester (West Didsbury)',
  card: 'West Didsbury rate and wait, set against every Manchester test centre.',
  title: `Manchester West Didsbury Test Centre: Pass Rate ${YL}`,
  description: `Manchester West Didsbury driving test centre: ${YL} car pass rate, the monthly wait, the GOV.UK notice for candidates and all the Manchester centres compared.`,
  h1: 'West Didsbury (Manchester) driving test centre: pass rate and wait',
  intro: 'Christie Park, M21: a south Manchester car centre, with its rate, its queue, a GOV.UK notice and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const prev = h.E.YEARS[h.E.YEARS.length - 2];
    const d = (c.rate! - (c.rateOf(prev) ?? 0)) * 100;
    const gbMed = h.gb.wait?.[3];
    return `West Didsbury examiners conducted ${h.num(c.tests)} car tests in ${Y} and ${h.num(c.passes)} candidates passed, which gives ${h.pc(c.rate)}. The year before, the rate had been ${h.pc(c.rateOf(prev))}, so it ${d >= 0 ? 'rose' : 'fell'} by ${h.pts(Math.abs(d)).replace('+', '')}. The figure is ${c.rate! > h.gb.rate ? 'higher' : 'lower'} than the British average of ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'higher' : 'lower'} than the North West's ${h.pc(c.regionRate)}, ${h.ord(c.rankRegion)} out of ${c.ofRegion} centres in the region with at least 300 tests. ${c.wait ? `As for time to a test: in ${h.month(c.wait.month)}, half of all West Didsbury tests had been booked more than ${h.wk(c.wait.median)} in advance, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? `longer than the ${h.wk(gbMed)}` : `no longer than the ${h.wk(gbMed)}`} recorded across Great Britain.` : 'DVSA published no wait for this centre in the latest month.'} Men passed ${h.pc(c.m)} of their tests and women ${h.pc(c.fem)}. Further down you will find all the Manchester centres side by side, a full year of waits, and the three alternatives that DVSA allows.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const park = c.notes.find((n) => /park/i.test(n));
    const man = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Manchester)')), 'rate');
    return [
      { q: 'What does the GOV.UK notice for West Didsbury test centre say?', a: park ? `GOV.UK currently shows this note: "${park.replace(/&amp;/g, '&')}". Read it again shortly before the test, since such notes change or go when the work ends.` : `GOV.UK shows ${c.notes.length ? `this note: "${c.notes[0]}"` : 'no special note for the centre at present'}. Notes on parking, access or a temporary address are added when needed, so it is worth checking the centre page on GOV.UK shortly before a test.` },
      { q: 'Which Manchester driving test centre has the highest pass rate?', a: `In ${Y}, of the ${man.length} centres with Manchester in their DVSA name, ${man[0].n} had the highest rate at ${h.pp(h.E.rate(man[0]))} and ${man[man.length - 1].n} the lowest at ${h.pp(h.E.rate(man[man.length - 1]))}. West Didsbury came ${h.ord(man.findIndex((x) => x.id === ID) + 1)} with ${h.pc(c.rate)}. The table on this page adds the median wait of each.` },
      { q: 'How many West Didsbury tests did examiners cancel?', a: c.cancel ? `${h.num(c.cancel.total)} in ${Y}, according to DVSA: ${h.num(c.cancel.medical)} because of examiner illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather. That is roughly ${h.num(Math.round((c.cancel.total / Math.max(1, c.tests)) * 100))} cancellations for every hundred tests that went ahead, and each one had to be rebooked on top of the normal flow of new bookings, which can add to the queue described above.` : `DVSA did not publish cancellation figures for West Didsbury in ${Y}. When DVSA cancels a test, the candidate is given a new date and the slot goes back into the queue.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const man = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Manchester)')), 'rate');
    const busiest = h.E.sorted(man, 'tests')[0];
    const quick = h.E.sorted(man.filter((x) => x.w != null), 'wait', true)[0];
    const months = h.F.months(c.f).slice(-12);
    const over = months.filter((k) => (c.f.wait[k][0] ?? 0) > (h.F.areaWait('Great Britain', k)?.[3] ?? 99)).length;
    const peakAge = Object.keys(c.age).reduce((a, k) => ((c.age[k] ?? 0) > (c.age[a] ?? 0) ? k : a), '17');
    const best = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    const park = c.notes.find((n) => /park/i.test(n));
    return `
<h2>The Manchester centres side by side</h2>
<p>DVSA names ${man.length} centres after Manchester. ${busiest.id === ID ? 'West Didsbury ran more car tests than any of them' : `${busiest.n} ran the most car tests, ${h.num(busiest.t)}`} in ${Y}. On pass rate the order runs from ${h.cl(man[0].id, man[0].n)} at ${h.pp(h.E.rate(man[0]))} down to ${h.cl(man[man.length - 1].id, man[man.length - 1].n)} at ${h.pp(h.E.rate(man[man.length - 1]))}, with West Didsbury ${h.ord(man.findIndex((x) => x.id === ID) + 1)}. On waiting time the quickest in ${h.month(h.lastMonth)} was ${quick ? `${quick.n}, at ${h.wk(quick.w)}` : 'not published'}. Since a test can only move to the three nearest centres, the whole list matters mostly when choosing where to book in the first place.</p>
${h.centreTable(man, `Centres with Manchester in their DVSA name, ${Y}: car tests, pass rate, change since ${h.yearLabel(h.E.YEARS[0])} and median wait in ${h.month(h.lastMonth)}.`)}
<h2>Twelve months of queueing</h2>
<p>${c.wait ? `In ${over} of the last twelve months the median West Didsbury wait was longer than the British median for the same month. The latest reading is ${h.wk(c.wait.median)} for ${h.month(c.wait.month)}${c.waitYearAgo != null ? `, compared with ${h.wk(c.waitYearAgo)} a year earlier` : ''}, and ${h.pp(c.wait.in7)} of that month's candidates had booked within seven weeks. The column on the right gives the lead time of the first tenth of bookings; when it reads ${h.P.rules.releaseWeeksAhead} weeks, the earliest places were taken as soon as DVSA opened them.` : 'No recent waiting time has been published for West Didsbury.'}</p>
${h.waitTable(ID)}
${park ? `<h2>Parking notice on GOV.UK</h2>
<p>The GOV.UK page for West Didsbury carries a notice about parking on the day; its full text is quoted in the questions at the end of this page. This is practical information published by DVSA, not a change to the test or to the way it is marked, and notices of this kind are removed once they no longer apply.</p>` : `<h2>Notes from GOV.UK</h2>
<p>${c.notes.length ? `GOV.UK lists this note for the centre: "${c.notes[0]}"` : 'GOV.UK lists no special note for the centre at present.'} The tests offered here are: ${c.types}.</p>`}
<h2>Who passes at West Didsbury</h2>
<p>The age that did best here in ${Y} was ${peakAge}, with ${h.pc(c.age[peakAge])}, and the table of ages on the ${h.a('pass-rate-by-age-and-sex', 'age and sex page')} gives the national pattern to compare it with. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. ${h.num(c.zero)} first-time candidates passed with a clean sheet, out of ${h.num(c.firstTests)} first attempts that succeeded ${h.pc(c.first)} of the time. ${c.auto != null ? `Automatic tests passed at ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} in manual cars.` : ''} The ${h.a('compare-driving-test-centres', 'comparison tool')} sets these figures against any other centre.</p>
<h2>If you would rather test elsewhere</h2>
<p>The DVSA nearest-centre list for West Didsbury reads ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. The best rate of the three in ${Y} was ${best ? `${best.name}'s ${h.pp(best.rate)}` : 'not available'}, ${best && best.rate! > c.rate! * 100 ? 'above' : 'not above'} West Didsbury's own. Weigh that against the waits in the table before using one of the ${h.P.rules.changesAllowed} changes allowed on a booking.</p>
${h.nearTable(ID)}
<p>Pass rates from ${h.src('dvsa_pass_centre', 'DVSA table DRT122A')}, waits from ${h.src('dvsa_waits', 'DVSA table DRT122F')}, the address, notes and nearby centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

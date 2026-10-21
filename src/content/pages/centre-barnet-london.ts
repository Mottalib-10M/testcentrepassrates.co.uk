import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'barnet-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 608,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-mill-hill-london', 'centre-wood-green-london', 'centre-hendon-london', 'region-london', 'driving-test-cancellations', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'barnet-driving-test-centre',
  nav: 'Barnet',
  card: 'Barnet EN5: a fast-growing caseload, its pass rate, the wait and cancellations.',
  title: `Barnet Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Barnet driving test centre on Western Parade, EN5: DVSA car pass rate for ${YL}, how its caseload grew, the latest wait, cancellations and 3 nearby centres.`,
  h1: 'Barnet driving test centre: pass rate, caseload and wait',
  intro: 'Western Parade, EN5: a north London car centre whose caseload has grown fast, compared with Borehamwood, Mill Hill and Wood Green.',
  resume: (h) => {
    const c = h.C(ID);
    const first = c.years[0];
    const ratio = c.tests / c.f.pass[first][0];
    return `Barnet's pass rate for car tests was ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}, with ${h.num(c.passes)} candidates passing out of ${h.num(c.tests)}. That compares with ${h.pc(h.gb.rate)} for Great Britain and ${h.pc(c.regionRate)} for London; Barnet is ${c.rate! > h.gb.rate ? 'above' : 'below'} the national figure and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the London one, and ranks ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres. Its three-year change is ${h.pts(c.trend3)}. Volume is the other part of the story: it conducted ${h.num(c.f.pass[first][0])} tests in ${h.yearLabel(first)}, so the latest year is ${ratio >= 2 ? 'more than double' : ratio >= 1 ? `about ${h.num(Math.round((ratio - 1) * 100))} % higher than` : `about ${h.num(Math.round((1 - ratio) * 100))} % lower than`} that. ${c.wait ? `In ${h.month(c.wait.month)} the median wait from booking to test was ${h.wk(c.wait.median)}, against ${h.wk(h.gb.wait?.[3])} across Britain and ${h.wk(c.regionWait?.[3])} across London${c.waitYearAgo != null ? `, and against ${h.wk(c.waitYearAgo)} at Barnet in the same month of the year before` : ''}.` : 'DVSA has not published a recent wait for Barnet.'} The sections below take the caseload, the queue, cancellations and the three alternatives in turn, each updated monthly from DVSA.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const mh = c.near.find((n) => n.id === 'mill-hill-london');
    return [
      { q: 'Is Barnet or Mill Hill the better driving test centre?', a: `${mh ? `On ${h.yearLabel(h.lastYear)} results Mill Hill passed ${h.pp(mh.rate)} and Barnet ${h.pc(c.rate)}, so ${(mh.rate ?? 0) > (c.rate ?? 0) * 100 ? 'Mill Hill was ahead' : 'Barnet was level or ahead'}. In ${h.month(h.lastMonth)} the median wait was ${h.wk(mh.wait)} at Mill Hill and ${h.wk(c.wait?.median)} at Barnet. Mill Hill is ${h.num(mh.miles)} miles away and on Barnet's DVSA list, so a test can be moved there.` : 'Mill Hill is no longer on the DVSA list of centres nearest to Barnet, so a Barnet test cannot be moved there under the 2026 rules.'} Neither figure guarantees an individual result.` },
      { q: 'Can wheelchair users take their test at Barnet?', a: `${c.notes.length ? `GOV.UK states: "${c.notes.join(' ')}"` : 'GOV.UK lists no access restriction for Barnet at present.'} Candidates who need a different site can book one of the other centres directly on GOV.UK, or move a Barnet booking to ${c.near.map((n) => short(n.name)).join(', ')}, the three centres DVSA lists as nearest. Each centre page on GOV.UK gives its own access details.` },
      { q: 'How many driving tests are cancelled at Barnet?', a: `${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} Barnet tests in ${h.yearLabel(h.lastYear)}: ${h.num(c.cancel.medical)} because the examiner was ill, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for bad weather. That is about ${(Math.round((c.cancel.total / c.tests) * 1000) / 10).toFixed(1)} for every 100 tests carried out. A new date is offered free, and some out-of-pocket costs can be claimed back.` : 'DVSA has not published cancellation figures for Barnet for the latest year. When DVSA cancels a test, it offers a new date free of charge and expenses can be claimed.'}` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const ms = h.F.months(f);
    const firstM = ms[0];
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number }>)[h.lastYear];
    const natPer = nat ? (nat.total / h.E.NATIONAL.practical[h.lastYear].t[0]) * 100 : null;
    const per = c.cancel ? (c.cancel.total / c.tests) * 100 : null;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const sorted = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number));
    const rising = ys.every((y, i) => i === 0 || f.pass[y][0] >= f.pass[ys[i - 1]][0]);
    return `
<h2>${rising ? 'A caseload that grew every year' : 'A caseload that has grown in steps'}</h2>
<p>Barnet has ${c.tests / f.pass[ys[0]][0] >= 1.5 || c.tests / f.pass[ys[0]][0] <= 0.67 ? 'changed size markedly' : 'kept a broadly similar size'} over the DVSA series. It carried out ${h.num(f.pass[ys[0]][0])} car tests in ${h.yearLabel(ys[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}${rising ? ', with no year falling below the one before' : ', though not in a straight line'}. The rate, meanwhile, went from ${h.pc(c.rateOf(ys[0]))} to ${h.pc(c.rate)}. More tests do not by themselves change the odds of passing; they do mean the latest rate rests on a larger sample than the early years.</p>
${h.yearTable(ID)}
<h2>${c.wait?.median != null && vals.length && c.wait.median > (f.wait[firstM][0] ?? 0) ? 'From shorter waits to longer ones' : 'The queue over two years'}</h2>
<p>${vals.length ? `The first month of DVSA waiting data for Barnet, ${h.month(firstM)}, showed a median of ${h.wk(f.wait[firstM][0])}. The highest since then was ${h.wk(Math.max(...vals))}, the lowest ${h.wk(Math.min(...vals))}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)} the figure was ${h.wk(c.wait.median)}, and ${h.pp(c.wait.in7)} of candidates tested had booked within seven weeks; the first tenth of the month's slots had been taken ${h.wk(c.wait.w10)} ahead.` : ''} DVSA releases slots ${h.P.rules.releaseWeeksAhead} weeks in advance, and since 12 May 2026 bookings and changes can only be made by the learner on GOV.UK. The ${h.a('driving-test-waiting-times', 'waiting times page')} shows where Barnet sits among all centres.</p>
${h.waitTable(ID, 12)}
<h2>Illness and leave behind the cancellations</h2>
<p>${c.cancel && per != null ? `DVSA cancelled ${h.num(c.cancel.total)} tests at Barnet in ${h.yearLabel(h.lastYear)}, around ${(Math.round(per * 10) / 10).toFixed(1)} per 100 conducted${natPer != null ? `, where the British average was about ${(Math.round(natPer * 10) / 10).toFixed(1)}` : ''}. Examiner illness explained ${h.num(c.cancel.medical)} of them and leave or training ${h.num(c.cancel.leave)}. Every DVSA cancellation sends a candidate back into the queue with a new date, which feeds into the waits above.` : 'DVSA has not published cancellation figures for Barnet for the latest year.'} The ${h.a('driving-test-cancellations', 'cancellations guide')} explains what you are owed when DVSA cancels.</p>
<h2>${c.near.map((n) => short(n.name)).join(', ')}</h2>
<p>These three are the centres DVSA lists as nearest to Barnet: ${c.near.map((n) => `${fmt(n)}, ${h.num(n.miles)} miles`).join('; ')}. In ${h.yearLabel(h.lastYear)} their pass rates were ${c.near.map((n) => h.pp(n.rate)).join(', ')} respectively, against ${h.pc(c.rate)} at Barnet. ${sorted[0] ? `The shortest median wait among them in ${h.month(h.lastMonth)} was at ${short(sorted[0].name)}, ${h.wk(sorted[0].wait)}.` : ''} A test booked at Barnet can move only to one of these, and each move counts as one of the ${h.num(h.P.rules.changesAllowed)} changes per booking.</p>
${h.nearTable(ID)}
<p>Men passed ${h.pc(c.m)} at Barnet and women ${h.pc(c.fem)}; first attempts ${h.pc(c.first)}; seventeen-year-olds ${h.pc(c.age['17'])}. The centre, at ${c.addr.join(', ')}, is listed for ${c.types} tests.${c.notes.length ? ` GOV.UK adds this access note: "${c.notes.join(' ')}"` : ''}</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times by month')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

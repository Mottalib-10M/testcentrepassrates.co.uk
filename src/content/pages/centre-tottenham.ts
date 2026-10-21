import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'tottenham';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 614,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-wood-green-london', 'centre-chingford-london', 'region-london', 'driving-test-faults', 'driving-test-cancellations'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'tottenham-driving-test-centre',
  nav: 'Tottenham',
  card: 'Tottenham N17: car pass rate, fault-free passes, the wait and Wood Green.',
  title: `Tottenham Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Tottenham driving test centre, Selby Centre N17: DVSA car pass rate for ${YL}, fault-free passes, cancellations, the latest wait and Wood Green, Enfield.`,
  h1: 'Tottenham driving test centre: pass rate and waiting time',
  intro: 'Selby Centre, N17: a north London car-only centre, compared with Wood Green, Enfield and Chingford on rate and on wait.',
  resume: (h) => {
    const c = h.C(ID);
    const w = c.wait;
    return `${w && c.waitYearAgo != null ? `The queue at Tottenham ${w.median != null && w.median < c.waitYearAgo ? 'shortened' : 'lengthened'} over the past year: tests taken in ${h.month(w.month)} had been booked a median ${h.wk(w.median)} ahead, against ${h.wk(c.waitYearAgo)} in the same month of the year before. ` : w ? `Tests taken at Tottenham in ${h.month(w.month)} had been booked a median ${h.wk(w.median)} ahead. ` : 'DVSA has published no recent wait for Tottenham. '}${w ? `Britain's median that month was ${h.wk(h.gb.wait?.[3])} and London's ${h.wk(c.regionWait?.[3])}. ` : ''}On results, the centre passed ${h.pc(c.rate)} of ${h.num(c.tests)} car tests in ${h.yearLabel(h.lastYear)}, or ${h.num(c.passes)} candidates. That is ${c.rate! > h.gb.rate ? 'above' : 'below'} the British rate of ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the London rate of ${h.pc(c.regionRate)}, ${h.ord(c.rankRegion)} of ${c.ofRegion} among London centres with 300 tests or more. Over three years the rate moved ${h.pts(c.trend3)}. ${c.types === 'car' ? 'Tottenham handles car tests only' : `Tottenham is listed for ${c.types} tests`}, at ${c.addr[0].replace(/^Driving Test Centre /, '')}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. The figures are refreshed from DVSA each month, and the sections below look at faults, cancellations and the three alternatives.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const wg = c.near.find((n) => n.id === 'wood-green-london');
    return [
      { q: 'Should I choose Tottenham or Wood Green for my test?', a: `${wg ? `In ${h.yearLabel(h.lastYear)} Tottenham passed ${h.pc(c.rate)} and Wood Green, ${h.num(wg.miles)} miles away, ${h.pp(wg.rate)}. In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} at Tottenham and ${h.wk(wg.wait)} at Wood Green.` : 'Wood Green is not on the current DVSA list of centres nearest to Tottenham.'} Pick the date and centre you can prepare for: the rate of past candidates is only one input, and each move uses up one of the changes a booking allows.` },
      { q: 'How many Tottenham candidates pass with no faults?', a: `${h.num(c.zero)} first-time candidates at Tottenham passed with no driving fault recorded in ${h.yearLabel(h.lastYear)}, out of ${h.num(c.firstTests)} first attempts, or ${h.pc(c.zero / (c.firstTests || 1))}. Across Britain the share was ${(() => { const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear]; return h.pc(nf[2] / nf[0]); })()}. Minor faults do not fail a test on their own; fifteen or fewer are allowed alongside no serious or dangerous fault.` },
      { q: 'Why were Tottenham tests cancelled by DVSA?', a: `${c.cancel ? `DVSA's count for ${h.yearLabel(h.lastYear)} is ${h.num(c.cancel.total)} cancellations at Tottenham: ${h.num(c.cancel.leave)} for examiner leave or training, ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.weather)} for weather. Candidates affected were offered a new date without paying again, and could apply to DVSA for some out-of-pocket expenses.` : 'DVSA has not published Tottenham cancellation counts for the latest year. When DVSA cancels, the candidate is offered a new date without paying again and can claim some expenses.'}` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const peak = ys.reduce((a, y) => (f.pass[y][0] > f.pass[a][0] ? y : a));
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const zr = c.zero / (c.firstTests || 1);
    const gz = nf[2] / nf[0];
    const leaveMain = c.cancel ? c.cancel.leave > c.cancel.medical : false;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    return `
<h2>Clean drives are ${zr < gz ? 'rarer' : 'no rarer'} here</h2>
<p>DVSA counts the first-time candidates who pass with no fault at all, and the figure is ${zr < gz / 2 ? 'strikingly low' : zr < gz ? 'low' : 'not low'} at Tottenham: ${h.num(c.zero)} of ${h.num(c.firstTests)} first attempts, or ${h.pc(zr)}, against ${h.pc(gz)} nationally. The overall first-time rate was ${h.pc(c.first)}, against ${h.pc(h.gb.first)} across Britain, so ${(c.first ?? 0) < h.gb.first ? 'fewer' : 'no fewer'} first-timers passed and ${zr < gz ? 'fewer' : 'no fewer'} of those who passed did so cleanly. A pass allows up to fifteen minor faults. The ${h.a('driving-test-faults', 'driving test faults page')} lists the faults most often recorded across Britain.</p>
<h2>Volume up and down</h2>
<p>Tottenham's busiest year in the five-year series was ${h.yearLabel(peak)}, with ${h.num(f.pass[peak][0])} car tests; ${h.yearLabel(h.lastYear)} counted ${h.num(c.tests)}. Its rate in the first year shown, ${h.yearLabel(ys[0])}, was ${h.pc(c.rateOf(ys[0]))}. Men passed ${h.pc(c.m)} in the latest year and women ${h.pc(c.fem)}; automatic cars made up ${h.pc(c.autoShare, 0)} of tests, with a rate of ${h.pc(c.auto)}.</p>
${h.yearTable(ID)}
<h2>Ages 17 to 25</h2>
<p>${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const b = ks.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a)); const w = ks.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a)); const up = ks.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0)); return `In the DVSA age table for Tottenham, ${b}-year-olds had the best rate, ${h.pc(c.age[b])}, and ${w}-year-olds the weakest, ${h.pc(c.age[w])}. ${up.length ? `${h.num(up.length)} of the ${h.num(ks.length)} ages shown beat the national rate for the same age.` : 'No age shown beat the national rate for the same age.'}`; })()} For comparison, 17-year-olds across Britain passed ${h.pc(h.E.ageRate(17))}, against ${h.pc(c.age['17'])} here. Small groups make these figures move from year to year, so they describe the latest candidates rather than a fixed trait of the centre.</p>
${h.ageTable(ID)}
<h2>Cancellations and the queue</h2>
<p>${c.cancel ? `Of the ${h.num(c.cancel.total)} Tottenham tests DVSA cancelled in ${h.yearLabel(h.lastYear)}, ${leaveMain ? `more were called off for examiner leave or training (${h.num(c.cancel.leave)}) than for illness (${h.num(c.cancel.medical)}), ${(() => { const n = (h.E.NATIONAL.cancel as Record<string, { leave: number; medical: number }>)[h.lastYear]; return n && n.medical > n.leave ? 'unlike the national pattern, where illness leads' : 'in line with the national pattern'; })()}` : `${h.num(c.cancel.medical)} were for examiner illness and ${h.num(c.cancel.leave)} for leave or training`}. ` : ''}${vals.length ? `The longest median wait in the published series was ${h.wk(hi.v)}, in ${h.month(hi.k)}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)} the median was ${h.wk(c.wait.median)}, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : ''} The ${h.a('driving-test-cancellations', 'cancellations page')} sets out what a candidate can claim.</p>
${h.waitTable(ID, 12)}
<h2>${c.near.map((n) => short(n.name)).join(', ')}</h2>
<p>A Tottenham booking can move to ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')} and to no other centre, under the rule that took effect on 9 June 2026. ${(() => { const b = c.near.filter((n) => n.rate != null).sort((a, x) => (x.rate as number) - (a.rate as number))[0]; const q = c.near.filter((n) => n.wait != null).sort((a, x) => (a.wait as number) - (x.wait as number))[0]; return `${b ? `The highest rate among them was ${short(b.name)}'s ${h.pp(b.rate)}${(b.rate ?? 0) > (c.rate ?? 0) * 100 ? ', above Tottenham' : ', still below Tottenham'}.` : ''} ${q ? `The shortest wait was at ${short(q.name)}, ${h.wk(q.wait)}.` : ''}`; })()} Since 12 May 2026 only the learner can make the change, on GOV.UK, and each change counts against the ${h.num(h.P.rules.changesAllowed)} a booking allows.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

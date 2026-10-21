import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'west-wickham-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 612,
  tool: { kind: 'finder', props: { centre: ID, radius: 9 } },
  related: ['centre-bromley-london', 'centre-mitcham-london', 'centre-sidcup-london', 'region-london', 'driving-test-cancellations', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'west-wickham-driving-test-centre',
  nav: 'West Wickham',
  card: 'West Wickham BR4: pass rate, results by sex and age, cancellations and the wait.',
  title: `West Wickham Driving Test Centre: Pass Rate ${YL}`,
  description: `West Wickham driving test centre on Glebe Way, BR4: DVSA car pass rate for ${YL}, results by sex and age, cancellations, the latest wait and 3 nearby centres.`,
  h1: 'West Wickham driving test centre: pass rate and wait',
  intro: 'Glebe Way, BR4: a car centre on the southern edge of London, read by sex, by age and against Bromley, Mitcham and Sidcup.',
  resume: (h) => {
    const c = h.C(ID);
    const w = c.wait;
    return `At West Wickham, ${h.pc(c.rate)} of car practical tests ended in a pass in ${h.yearLabel(h.lastYear)}, ${h.num(c.passes)} out of ${h.num(c.tests)}. Britain's rate was ${h.pc(h.gb.rate)} and London's ${h.pc(c.regionRate)}; West Wickham finished ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres with 300 or more tests and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} nationally. The three-year movement in its rate is ${h.pts(c.trend3)}. ${w ? `Booking is ${w.median != null && w.median < (h.gb.wait?.[3] ?? 0) ? 'less of a struggle here than in much of Britain' : 'no easier here than elsewhere'}: in ${h.month(w.month)} the median gap between booking and test was ${h.wk(w.median)}, set against ${h.wk(h.gb.wait?.[3])} nationally and ${h.wk(c.regionWait?.[3])} in London${c.waitYearAgo != null ? `, and ${h.wk(c.waitYearAgo)} at West Wickham a year earlier` : ''}. ${h.pp(w.in7)} of that month's candidates had booked within seven weeks.` : 'DVSA has published no recent wait for West Wickham.'} The centre runs ${c.types} tests at ${c.addr[0]}. Its figures are refreshed monthly from DVSA, and the finder above compares it with every centre around BR4.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const fBetter = (c.fem ?? 0) > (c.m ?? 0);
    return [
      { q: 'Do women pass more often than men at West Wickham?', a: `${fBetter ? 'Yes' : 'No'}, in ${h.yearLabel(h.lastYear)}: women passed ${h.pc(c.fem)} of West Wickham tests and men ${h.pc(c.m)}. Across Great Britain the pattern ${h.gb.f > h.gb.m ? 'was the same' : 'ran the other way'}, with men at ${h.pc(h.gb.m)} and women at ${h.pc(h.gb.f)}. The difference here rests on a few thousand tests for each sex and can change from year to year.` },
      { q: 'Is West Wickham quicker to book than Bromley?', a: `${(() => { const b = c.near.find((n) => n.id === 'bromley-london'); return b ? `In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} at West Wickham and ${h.wk(b.wait)} at Bromley, ${h.num(b.miles)} miles away, so West Wickham was ${(c.wait?.median ?? 99) < (b.wait ?? 0) ? 'quicker' : 'not quicker'}. Bromley's pass rate was ${h.pp(b.rate)}, against ${h.pc(c.rate)}.` : 'Bromley is no longer on the DVSA list of centres nearest to West Wickham.'; })()} A test can be moved between the two centres using one of the changes a booking allows.` },
      { q: 'How often does DVSA cancel West Wickham tests?', a: `${c.cancel ? `In ${h.yearLabel(h.lastYear)} DVSA cancelled ${h.num(c.cancel.total)} West Wickham tests, about ${(Math.round((c.cancel.total / c.tests) * 1000) / 10).toFixed(1)} per 100 conducted: ${h.num(c.cancel.medical)} for examiner illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather.` : 'DVSA has not published West Wickham cancellation counts for the latest year.'} A cancelled candidate is given a new date free and may claim some costs from DVSA.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number }>)[h.lastYear];
    const natPer = nat ? (nat.total / h.E.NATIONAL.practical[h.lastYear].t[0]) * 100 : null;
    const per = c.cancel ? (c.cancel.total / c.tests) * 100 : null;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const missing = ['17', '18', '19', '20', '21', '22', '23', '24', '25'].filter((k) => !ages.includes(k));
    const gap = ((c.fem ?? 0) - (c.m ?? 0)) * 100;
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const ms = h.F.months(f).slice(-12);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const under = vals.filter((v) => v < (h.gb.wait?.[3] ?? 0)).length;
    const top = c.near.filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number))[0];
    return `
<h2>${gap > 0 ? 'Women ahead of men' : 'Men and women'}</h2>
<p>Nationally, ${h.gb.m > h.gb.f ? 'men pass slightly more often than women' : 'women pass at least as often as men'}: ${h.pc(h.gb.m)} for men against ${h.pc(h.gb.f)} for women in ${h.yearLabel(h.lastYear)}. At West Wickham ${gap > 0 ? `${h.gb.m > h.gb.f ? 'the order was reversed' : 'women led as well'}, with women at ${h.pc(c.fem)} and men at ${h.pc(c.m)}, ${h.pts(gap).replace('+', '')} apart` : `${h.gb.m > h.gb.f ? 'men were ahead too' : 'men were ahead'}, ${h.pc(c.m)} against ${h.pc(c.fem)}`}. DVSA's tables do not say why, and a gap of this size can move within a year or two, so it is best read as a feature of recent candidates rather than of the centre.</p>
<h2>Teenagers and the age table</h2>
<p>Seventeen-year-olds passed ${h.pc(c.age['17'])} here, ${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? 'above' : 'below'} the ${h.pc(h.E.ageRate(17))} recorded for that age across Britain; eighteen-year-olds managed ${h.pc(c.age['18'])}. ${missing.length ? `DVSA published no row for ${missing.map((k) => `${k}-year-olds`).join(' or ')} at this centre, so the table stops short of the full range.` : ''} First-time candidates passed ${h.pc(c.first)} and ${h.num(c.zero)} of them completed the test with no fault. ${h.a('pass-rate-by-age-and-sex', 'Pass rates by age and sex')} gives the national breakdown behind the comparison column.</p>
${h.ageTable(ID)}
<h2>A queue ${under > vals.length / 2 ? 'mostly below' : 'often above'} the national median</h2>
<p>In ${h.num(under)} of the last ${h.num(vals.length)} months, the median wait at West Wickham was shorter than the latest British median of ${h.wk(h.gb.wait?.[3])}. ${c.wait ? `The latest month came in at ${h.wk(c.wait.median)}, and the first tenth of slots had gone ${h.wk(c.wait.w10)} before the test date.` : ''} ${c.cancel && per != null ? `Cancellations by DVSA were ${natPer != null && per < natPer ? 'relatively rare' : 'not unusually rare'}: ${h.num(c.cancel.total)} in ${h.yearLabel(h.lastYear)}, about ${(Math.round(per * 10) / 10).toFixed(1)} per 100 tests${natPer != null ? ` against roughly ${(Math.round(natPer * 10) / 10).toFixed(1)} nationally` : ''}.` : ''} The ${h.a('driving-test-cancellations', 'cancellations page')} explains what a candidate is owed when DVSA calls off a test.</p>
${h.waitTable(ID, 12)}
<h2>The caseload over five years</h2>
<p>West Wickham carried out ${h.num(f.pass[ys[0]][0])} car tests in ${h.yearLabel(ys[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. Over three years its rate went from ${h.pp(c.l.p[0])} to ${h.pc(c.rate)}, while the British rate went from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. Automatic cars made up ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars.</p>
${h.yearTable(ID)}
<h2>${c.near.map((n) => short(n.name)).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>These are the only centres to which a West Wickham test can be moved: ${c.near.map((n) => `${fmt(n)}, ${h.num(n.miles)} miles away`).join('; ')}. ${top ? `${short(top.name)} had the highest pass rate of the three in ${h.yearLabel(h.lastYear)}, ${h.pp(top.rate)}${top.wait != null && c.wait?.median != null ? `, with a median wait of ${h.wk(top.wait)} against ${h.wk(c.wait.median)} here` : ''}.` : ''} A move counts as one of the ${h.num(h.P.rules.changesAllowed)} changes allowed on a booking since 31 March 2026.</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waiting times')} and ${h.src('gov_nearest', 'the GOV.UK list of nearest centres')}.</p>
`;
  },
});

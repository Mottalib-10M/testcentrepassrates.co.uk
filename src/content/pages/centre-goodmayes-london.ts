import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'goodmayes-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 603,
  tool: { kind: 'finder', props: { centre: ID, radius: 8 } },
  related: ['centre-hornchurch-london', 'centre-wanstead-london', 'region-london', 'automatic-driving-test-pass-rates', 'hardest-driving-test-centres', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest', 'dvsa_theory_centre'],
  slug: 'goodmayes-driving-test-centre',
  nav: 'Goodmayes',
  card: 'Goodmayes, Ilford: one of the busiest car centres, by sex, gearbox and wait.',
  title: `Goodmayes Driving Test Centre: Pass Rate ${YL}, Wait`,
  description: `Goodmayes driving test centre in Ilford: DVSA car pass rate for ${YL}, the gap between men and women, automatic results, the latest wait and 3 nearby centres.`,
  h1: 'Goodmayes driving test centre: pass rate, automatics and wait',
  intro: 'Goodmayes Road, IG3: an east London centre with a very large car caseload, read by gearbox, by sex and against Hornchurch, Wanstead and Loughton.',
  resume: (h) => {
    const c = h.C(ID);
    const london = h.E.sorted(h.E.inRegion('London'), 'tests');
    const vol = london.findIndex((x) => x.id === ID) + 1;
    return `${h.num(c.tests)} car practical tests were conducted at Goodmayes in ${h.yearLabel(h.lastYear)}, the ${vol === 1 ? 'largest number' : `${h.ord(vol)} largest number`} of any London centre in the DVSA tables. ${h.num(c.passes)} ended in a pass, which gives a rate of ${h.pc(c.rate)}. The comparison points are ${h.pc(h.gb.rate)} for Great Britain and ${h.pc(c.regionRate)} for London, ${c.rate! < (c.regionRate ?? 0) ? 'both of them higher' : 'and Goodmayes is not behind the capital'}; among ${c.ofRegion} London centres with 300 or more tests it ranks ${h.ord(c.rankRegion)}. ${c.wait ? `On waiting times, DVSA's latest month (${h.month(c.wait.month)}) shows a median of ${h.wk(c.wait.median)} between booking and test${c.waitYearAgo != null ? `, compared with ${h.wk(c.waitYearAgo)} in the same month of the previous year` : ''}. The British median was ${h.wk(h.gb.wait?.[3])} that month and the London one ${h.wk(c.regionWait?.[3])}.` : 'DVSA has not published a recent median wait for the centre.'} ${vol <= 5 ? 'With a caseload this large, each figure rests on many thousands of tests and is less exposed to chance swings than at a small centre.' : 'Each figure rests on thousands of tests, enough to make the comparison meaningful.'}`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const gbGap = (h.gb.m - h.gb.f) * 100;
    return [
      { q: 'Is there a gap between men and women at Goodmayes?', a: `DVSA does not give reasons, only counts. In ${h.yearLabel(h.lastYear)} men passed ${h.pc(c.m)} of Goodmayes tests and women ${h.pc(c.fem)}, a ${gap >= 0 ? 'gap of' : 'reversed gap of'} ${h.pts(Math.abs(gap)).replace('+', '')}, ${Math.abs(gap) > Math.abs(gbGap) ? 'wider' : 'narrower'} than the ${h.pts(Math.abs(gbGap)).replace('+', '')} seen across Britain. Differences in age, lessons taken and earlier attempts may lie behind it, but the data cannot separate them.` },
      { q: 'Are automatic tests harder at Goodmayes?', a: `Automatic candidates passed ${h.pc(c.auto)} at Goodmayes in ${h.yearLabel(h.lastYear)}, ${(c.auto ?? 0) * 100 < (c.l.mn ?? 0) ? 'below' : 'not below'} the ${h.pp(c.l.mn)} of manual candidates. Nationally automatics passed ${h.pc(h.gb.auto)}. ${h.num(c.autoTests)} tests here were in automatic cars. Remember that an automatic pass only licenses you to drive automatic cars, so the gearbox should follow the car you expect to drive afterwards, not the odds on the day.` },
      { q: 'Where is the theory test centre near Goodmayes?', a: `${(() => { const t = h.E.THEORY_CENTRES.find((x) => x.id === 'ilford'); return t ? `DVSA lists a theory test centre called Ilford, where ${h.pc(h.E.theoryRate(t))} of theory tests were passed in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} nationally.` : 'DVSA no longer lists an Ilford theory test centre in its latest table.'; })()} The practical test at Goodmayes is booked separately on GOV.UK once the theory test has been passed. The two rates describe different groups of candidates, so they cannot be combined into one figure.` },
      { q: 'Can a Goodmayes driving test be moved to Hornchurch?', a: `${c.near.some((n) => n.id === 'hornchurch-london') ? 'Yes, Hornchurch is one of the three centres DVSA lists as nearest to Goodmayes' : 'Not at present: Hornchurch is not on the DVSA list of three centres nearest to Goodmayes'}. The full list is ${c.near.map((n) => `${short(n.name)} (${h.num(n.miles)} miles)`).join(', ')}. Since 9 June 2026 a test can only move to one of these centres, and each move uses one of the changes a booking allows.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = vals.reduce((a, b) => (b.v < a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const autoNat = h.E.NATIONAL.auto[h.lastYear][0] / h.E.NATIONAL.practical[h.lastYear].t[0];
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const better = c.near.filter((n) => n.rate != null && n.rate > (c.rate ?? 0) * 100);
    return `
<h2>${(c.autoShare ?? 0) > 0.5 ? 'More automatic tests than manual' : 'Manual and automatic side by side'}</h2>
<p>${(c.autoShare ?? 0) > autoNat ? 'Goodmayes stands out for its gearbox mix' : 'The gearbox mix at Goodmayes is close to or below the national pattern'}: ${h.pc(c.autoShare, 0)} of its car tests in ${h.yearLabel(h.lastYear)} were taken in an automatic, against ${h.pc(autoNat, 0)} across Great Britain. Automatic candidates passed ${h.pc(c.auto)}, manual candidates ${h.pp(c.l.mn)}. The national rate for automatics, ${h.pc(h.gb.auto)}, ${h.gb.auto < h.gb.rate ? 'is also below the overall rate' : 'is not below the overall rate'}, so a lower automatic figure is not peculiar to this centre. The ${h.a('automatic-driving-test-pass-rates', 'automatic pass rates page')} ranks every centre on this measure.</p>
<h2>A ${Math.abs(gap) >= 5 ? 'wide' : 'modest'} gap between men and women</h2>
<p>At ${h.pts(Math.abs(gap)).replace('+', '')}, the difference between male (${h.pc(c.m)}) and female (${h.pc(c.fem)}) pass rates at Goodmayes ${Math.abs(gap) > Math.abs((h.gb.m - h.gb.f) * 100) ? 'is larger than' : 'is no larger than'} the national one. First attempts passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} first-time candidates drove a clean test with no fault recorded. By age, the strongest group was ${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const b = ks.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a)); return `${b}-year-olds at ${h.pc(c.age[b])}`; })()}.</p>
${h.ageTable(ID)}
<h2>Waits that swing month to month</h2>
<p>Across the ${h.num(vals.length)} months DVSA publishes, the Goodmayes median ran from a low of ${h.wk(lo.v)} in ${h.month(lo.k)} to a high of ${h.wk(hi.v)} in ${h.month(hi.k)}. ${c.wait ? `In ${h.month(c.wait.month)} it was ${h.wk(c.wait.median)}, and ${h.pp(c.wait.in7)} of candidates tested that month had booked less than seven weeks before.` : ''} ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests here during ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.medical)} of them because an examiner was ill.` : ''} Dates are released ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK, and since 12 May 2026 only the learner can book or change the test.</p>
${h.waitTable(ID, 12)}
<h2>Rank and alternatives</h2>
<p>Over five DVSA years the centre has tested between ${h.num(Math.min(...c.years.map((y) => f.pass[y][0])))} and ${h.num(Math.max(...c.years.map((y) => f.pass[y][0])))} candidates a year, with a rate that went from ${h.pc(c.rateOf(c.years[0]))} in ${h.yearLabel(c.years[0])} to ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}; the change over the last three years alone is ${h.pts(c.trend3)}. Among ${h.num(c.ofGB)} British centres with at least 1,000 tests, Goodmayes is ${h.ord(c.rankGB)} by pass rate; ${h.a('hardest-driving-test-centres', 'the list of hardest centres')} shows the bottom of that table. ${better.length ? `${better.length === c.near.length ? 'Every centre' : `${better.length} of the ${c.near.length} centres`} on its DVSA list had a higher rate: ${better.map((n) => `${n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name)} at ${h.pp(n.rate)}`).join(', ')}.` : 'None of the centres on its DVSA list had a higher rate.'} Any gain in rate has to be weighed against the waits, shown in the last column.</p>
${h.nearTable(ID)}
<p>${c.notes.length ? `GOV.UK note for this centre: ${c.notes.join(' ')} ` : ''}The address is ${c.addr.join(', ')}, and it handles ${c.types} tests.</p>
<p>Data: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waits')}, ${h.src('dvsa_theory_centre', 'DVSA theory results by centre')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

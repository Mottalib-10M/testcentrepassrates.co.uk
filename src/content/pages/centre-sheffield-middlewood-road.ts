import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'sheffield-middlewood-road';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 649,
  tool: { kind: 'finder', props: { centre: ID, radius: 18 } },
  related: ['region-yorkshire-and-the-humber', 'move-driving-test-centre', 'driving-test-waiting-times', 'theory-test-pass-rates', 'compare-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'sheffield-middlewood-road-driving-test-centre',
  nav: 'Sheffield (Middlewood Road)',
  card: 'Middlewood Road pass rate and wait, set against its three nearest centres.',
  title: `Sheffield Middlewood Road Test Centre: Pass Rate ${YL}`,
  description: `Sheffield Middlewood Road driving test centre: ${YL} car pass rate, the wait against the 3 nearest centres, the yearly record and the theory centre.`,
  h1: 'Sheffield (Middlewood Road) driving test centre: pass rate and wait',
  intro: '508 Middlewood Road, S6: one of the two Sheffield centres in the DVSA tables, read against the three centres listed nearby.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const nb = c.near.filter((n) => n.wait != null);
    const allShorter = nb.length > 0 && nb.every((n) => (n.wait as number) < (c.wait?.median ?? 0));
    const gbMed = h.gb.wait?.[3];
    return `${c.wait ? `Learners booking at Middlewood Road in ${h.month(c.wait.month)} faced a median wait of ${h.wk(c.wait.median)}, against ${h.wk(gbMed)} across Great Britain${allShorter ? ', and every one of the three centres DVSA lists nearby was quicker' : ''}.` : 'DVSA published no wait for Middlewood Road in the latest month.'} The pass rate in ${Y} was ${h.pc(c.rate)} from ${h.num(c.tests)} car tests, ${c.rate! > h.gb.rate ? 'above' : 'below'} the British ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} Yorkshire and the Humber's ${h.pc(c.regionRate)}, placing the centre ${h.ord(c.rankRegion)} of ${c.ofRegion} in its region among centres with at least 300 tests. Over three years the rate moved by ${h.pts(c.trend3)}, against ${h.pts((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 100)} for Great Britain. ${c.wait ? `${h.pp(c.wait.in7)} of candidates in the latest month had booked within seven weeks.` : ''} Sheffield's other centre, Handsworth, passed ${h.pc(h.C('sheffield-handsworth').rate)}, with a median wait of ${h.wk(h.C('sheffield-handsworth').wait?.median)} in the same month. The page compares the three alternatives first, then the waits and the yearly figures.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const hw = h.C('sheffield-handsworth');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Sheffield');
    return [
      { q: 'Middlewood Road or Handsworth: which Sheffield centre is quicker?', a: `In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} at Middlewood Road and ${h.wk(hw.wait?.median)} at Handsworth, so ${(hw.wait?.median ?? 99) < (c.wait?.median ?? 99) ? 'Handsworth' : 'Middlewood Road'} was quicker. On ${Y} pass rates Middlewood Road had ${h.pc(c.rate)} and Handsworth ${h.pc(hw.rate)}. ${c.near.some((n) => n.id === 'sheffield-handsworth') ? 'Handsworth is on the DVSA list for Middlewood Road, so a booking can move there.' : ''}` },
      { q: 'What is the theory test pass rate in Sheffield?', a: th ? `The Sheffield theory centre passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, against ${h.pc(h.gb.theory)} across Great Britain, according to DVSA's theory tables. The theory test costs £${h.num(h.P.fees.theory)} on GOV.UK, and the certificate is needed to book a practical test at Middlewood Road.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}; a theory pass is needed to book a practical test at Middlewood Road.` },
      { q: 'How many Middlewood Road tests were cancelled by DVSA?', a: c.cancel ? `${h.num(c.cancel.total)} in ${Y}: ${h.num(c.cancel.medical)} because of examiner illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather. That is about ${h.num(Math.round((c.cancel.total / Math.max(1, c.tests)) * 1000) / 10)} cancellations per hundred tests conducted, and each cancelled candidate needed a new date, which DVSA arranges without a further fee.` : `DVSA did not publish cancellation figures for Middlewood Road in ${Y}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const nb = c.near.filter((n) => n.wait != null && n.rate != null);
    const shorter = nb.filter((n) => (n.wait as number) < (c.wait?.median ?? 0));
    const better = nb.filter((n) => (n.rate as number) > c.rate! * 100);
    const both = nb.filter((n) => shorter.includes(n) && better.includes(n));
    const months = h.F.months(c.f).slice(-12);
    const vals = months.map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = vals.reduce((a, x) => (x.v < a.v ? x : a), vals[0]);
    const ys = c.years;
    const low = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Sheffield');
    const hw = h.C('sheffield-handsworth');
    const shef = h.E.CENTRES.filter((x) => x.n.startsWith('Sheffield ('));
    return `
<h2>The three alternatives first</h2>
<p>DVSA's nearest centres for Middlewood Road are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles away`).join('; ')}. In ${h.month(h.lastMonth)}, ${shorter.length === nb.length && nb.length ? 'all of them' : shorter.length === 0 ? 'none of them' : `${shorter.length} of them`} had a shorter median wait than Middlewood Road, and ${better.length === nb.length && nb.length ? 'all' : ['none', 'one', 'two'][better.length] ?? better.length} a higher ${Y} pass rate. ${both.length ? `${both.map((n) => `${n.name} (${h.pp(n.rate)}, ${h.wk(n.wait)})`).join(' and ')} came out ahead on both counts.` : ''} ${shorter.length ? 'That makes a move worth looking at for anyone whose date is far off' : 'A move would therefore not bring an earlier date'}, within the limit of ${h.P.rules.changesAllowed} changes per booking explained in the ${h.a('move-driving-test-centre', 'guide to moving a test')}.</p>
${h.nearTable(ID)}
<h2>Twelve months at Middlewood Road</h2>
<p>${c.wait ? `The shortest median of the last twelve months was ${h.wk(lo.v)}, in ${h.month(lo.k)}. The latest is ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. Yorkshire and the Humber as a whole had a median of ${h.wk(c.regionWait?.[3])} in ${h.month(h.lastMonth)}. In ${months.filter((k) => (c.f.wait[k][1] ?? 0) >= h.P.rules.releaseWeeksAhead).length === months.length ? 'every one' : months.filter((k) => (c.f.wait[k][1] ?? 0) >= h.P.rules.releaseWeeksAhead).length} of the twelve months the first tenth of tests had been booked ${h.P.rules.releaseWeeksAhead} weeks ahead, the furthest the booking service goes.` : 'DVSA has not published recent waits for Middlewood Road.'}</p>
${h.waitTable(ID)}
<h2>Sheffield's two centres</h2>
<p>DVSA lists ${shef.length === 2 ? 'two' : shef.length} centres with Sheffield in their name: Middlewood Road and ${h.cl('sheffield-handsworth', 'Handsworth')}. In ${Y} Middlewood Road ran ${h.num(c.tests)} car tests and Handsworth ${h.num(hw.tests)}; the pass rates were ${h.pc(c.rate)} and ${h.pc(hw.rate)}, so ${c.rate! > hw.rate! ? 'Middlewood Road' : 'Handsworth'} led on results while ${(hw.wait?.median ?? 99) < (c.wait?.median ?? 99) ? 'Handsworth' : 'Middlewood Road'} had the shorter median wait in ${h.month(h.lastMonth)}. For a learner in the city, that is the basic trade-off between the two.</p>
<h2>The yearly record</h2>
<p>The weakest year in the series was ${h.yearLabel(low)}, at ${h.pc(c.rateOf(low))}; ${Y} closed at ${h.pc(c.rate)}. Over the same years the British rate went from ${h.pc(h.E.gbRate(c.years[0]))} to ${h.pc(h.gb.rate)}. Men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}, and first-time candidates ${h.pc(c.first)}, with ${h.num(c.zero)} first-time passes free of any fault. Seventeen-year-olds passed ${h.pc(c.age['17'])}, ${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? 'ahead of' : 'behind'} the ${h.pc(h.E.ageRate(17))} recorded for that age across Great Britain. ${c.auto != null ? `Automatic tests passed at ${h.pc(c.auto)}, manual ones at ${h.pp(c.l.mn)}.` : ''}</p>
${h.yearTable(ID)}
<h2>Before the practical: the Sheffield theory centre</h2>
<p>${th ? `The ${h.src('dvsa_theory_centre', 'DVSA theory tables')} list a Sheffield theory centre that passed ${h.pc(h.E.theoryRate(th))} of car candidates in ${Y}, ${(h.E.theoryRate(th) ?? 0) > h.gb.theory ? 'above' : 'below'} the ${h.pc(h.gb.theory)} of Great Britain.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}.`} The ${h.a('theory-test-pass-rates', 'theory pass rates page')} ranks every theory centre. GOV.UK lists these tests at Middlewood Road: ${c.types}${c.notes.length ? `. Its note reads: "${c.notes[0]}"` : '.'}</p>
<p>Figures from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and ${h.src('dvsa_waits', 'DVSA waiting times')}; address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

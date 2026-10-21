import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'bristol-kingswood';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 637,
  tool: { kind: 'finder', props: { centre: ID, radius: 20 } },
  related: ['region-south-west', 'centre-bristol-avonmouth', 'automatic-driving-test-pass-rates', 'pass-rate-by-age-and-sex', 'driving-test-pass-rates-by-year'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'bristol-kingswood-driving-test-centre',
  nav: 'Bristol (Kingswood)',
  card: 'Kingswood rate, the gearbox gap and how it compares with Avonmouth in Bristol.',
  title: `Bristol Kingswood Driving Test Centre: Pass Rate ${YL}`,
  description: `Bristol Kingswood driving test centre: ${YL} car pass rate, five-year record, manual and automatic results, the wait and a comparison with Bristol Avonmouth.`,
  h1: 'Bristol (Kingswood) driving test centre: pass rate and wait',
  intro: 'The Siston Centre, BS15: east Bristol\'s test site for cars, motorcycles, lorries and buses, set against Avonmouth on the other side of the city.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const av = h.C('bristol-avonmouth');
    const bristol = h.E.CENTRES.filter((x) => x.n.startsWith('Bristol ('));
    const gbMed = h.gb.wait?.[3];
    return `Of the ${h.E.CENTRES.filter((x) => x.n.startsWith('Bristol (')).length === 2 ? 'two' : h.E.CENTRES.filter((x) => x.n.startsWith('Bristol (')).length} Bristol centres in the DVSA tables, Kingswood is the ${c.tests > av.tests ? 'busier' : 'smaller'}: ${h.num(c.tests)} car tests in ${Y} against ${h.num(av.tests)} at Avonmouth. Its pass rate was ${h.pc(c.rate)}, ${c.rate! > av.rate! ? 'higher' : 'lower'} than Avonmouth's ${h.pc(av.rate)}, ${c.rate! > h.gb.rate ? 'above' : 'below'} the British ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the South West's ${h.pc(c.regionRate)}. That makes it ${h.ord(c.rankRegion)} of ${c.ofRegion} South West centres with 300 tests or more. In three years the rate has moved by ${h.pts(c.trend3)}, while the British rate moved by ${h.pts((h.gb.rate - h.E.gbRate(h.E.YEARS[0])) * 100)}. ${c.wait ? `The queue is ${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'shorter' : 'longer'} than the national one: for tests in ${h.month(c.wait.month)} the median booking had been made ${h.wk(c.wait.median)} ahead, against ${h.wk(gbMed)} for Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : 'No wait was published for the latest month.'} The sections below cover the five-year record, the gearbox gap, the ages of candidates and the three centres a test can move to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const av = h.C('bristol-avonmouth');
    const bristol = h.E.CENTRES.filter((x) => x.n.startsWith('Bristol ('));
    return [
      { q: 'Which is easier, Bristol Kingswood or Bristol Avonmouth?', a: `On the ${Y} figures Avonmouth passed ${h.pc(av.rate)} and Kingswood ${h.pc(c.rate)}, so ${av.rate! > c.rate! ? 'Avonmouth' : 'Kingswood'} had the higher rate. The waits in ${h.month(h.lastMonth)} were ${h.wk(av.wait?.median)} at Avonmouth and ${h.wk(c.wait?.median)} at Kingswood. ${c.near.some((n) => n.id === 'bristol-avonmouth') ? 'Avonmouth is on Kingswood\'s list of nearest centres, so a test can be moved there.' : ''}` },
      { q: 'What tests are taken at Kingswood driving test centre in Bristol?', a: `GOV.UK lists ${c.types} at ${c.addr[0].split(',')[0]}, ${c.addr[2]}. ${/lorry/.test(c.types) ? 'Lorry and bus candidates and motorcyclists therefore share the site with car learners, though each category is booked separately.' : ''} Only the car results are broken down by centre in the DVSA pass-rate table used on this page.` },
      { q: 'Did bad weather cancel tests at Kingswood?', a: c.cancel ? `${c.cancel.weather === 0 ? `No test was recorded as cancelled for weather at Kingswood in ${Y}.` : `${h.num(c.cancel.weather)} tests were cancelled for weather in ${Y}.`} DVSA counted ${h.num(c.cancel.total)} examiner-side cancellations in all: ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.leave)} for leave or training. Against ${h.num(c.tests)} tests conducted, that is ${h.pc(c.cancel.total / Math.max(1, c.tests))} of the year's tests, ${c.cancel.total / Math.max(1, c.tests) < 0.05 ? 'a small share' : 'a noticeable share'}, each one rebooked for the candidate concerned.` : `DVSA did not publish cancellation figures for Kingswood in ${Y}, so the reasons tests were called off are not known.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    let falls = 0;
    for (let i = ys.length - 1; i > 0 && (c.rateOf(ys[i]) ?? 0) < (c.rateOf(ys[i - 1]) ?? 0); i--) falls++;
    const av = h.C('bristol-avonmouth');
    const bristol = h.E.CENTRES.filter((x) => x.n.startsWith('Bristol ('));
    const kwYA = c.waitYearAgo;
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Bristol');
    const maxDrop = Math.max(0, ...ys.slice(1).map((y, i) => ((c.rateOf(ys[i]) ?? 0) - (c.rateOf(y) ?? 0)) * 100));
    const gap = (c.l.mn ?? 0) - (c.l.a ?? 0);
    const nat = h.E.NATIONAL;
    const gbManual = (nat.practical[h.lastYear].t[1] - nat.auto[h.lastYear][1]) / (nat.practical[h.lastYear].t[0] - nat.auto[h.lastYear][0]);
    const gbGap = (gbManual - h.gb.auto) * 100;
    const share17 = (c.f.age['17']?.[0] ?? 0) / Math.max(1, c.tests);
    const gbShare17 = (h.E.NATIONAL.ageSex.rows['17']?.t?.[0] ?? 0) / Math.max(1, h.E.NATIONAL.ageSex.rows.Total?.t?.[0] ?? 1);
    const higher = c.near.filter((n) => n.rate != null && (n.rate as number) > c.rate! * 100);
    const shorter = c.near.filter((n) => n.wait != null && (n.wait as number) < (c.wait?.median ?? 0));
    return `
<h2>Five years, ${falls >= 2 ? `${falls} falls in a row` : 'a mixed path'}</h2>
<p>Kingswood began the series at ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} and ended it at ${h.pc(c.rate)}. ${falls >= 2 ? `The rate has slipped in each of the last ${falls} years, ${maxDrop < 2 ? 'by small steps rather than a sudden drop' : `the largest single fall being ${h.pts(maxDrop).replace('+', '')}`}.` : falls === 1 ? 'The latest year brought a small fall.' : 'The latest year did not bring a fall.'} Over the same period the British rate ended at ${h.pc(h.gb.rate)}. Test numbers grew from ${h.num(c.f.pass[ys[0]][0])} to ${h.num(c.tests)}, ${c.tests > c.f.pass[ys[0]][0] ? 'more candidates for the examiners to see' : 'fewer than at the start'}.</p>
${h.yearTable(ID)}
<h2>The gearbox gap</h2>
<p>${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)} at Kingswood, manual candidates ${h.pp(c.l.mn)}: a ${h.num(Math.round(Math.abs(gap) * 10) / 10)}-point gap, ${Math.abs(gap) > Math.abs(gbGap) + 1 ? 'larger than' : 'not larger than'} the ${h.num(Math.round(gbGap * 10) / 10)} points between manual and automatic results across Great Britain. Automatics accounted for ${h.pc(c.autoShare, 0)} of tests. The ${h.a('automatic-driving-test-pass-rates', 'automatic pass rates page')} ranks every centre on this measure.` : 'DVSA did not publish an automatic figure for Kingswood this year.'} Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, ${Math.abs((c.m ?? 0) - (c.fem ?? 0)) < 0.015 ? `within a point or so of each other, so the sex of the candidate made little visible difference here in ${Y}` : `a gap of ${h.num(Math.round(Math.abs((c.m ?? 0) - (c.fem ?? 0)) * 100))} points in favour of ${(c.m ?? 0) > (c.fem ?? 0) ? 'men' : 'women'} in ${Y}`}.</p>
<h2>Seventeen-year-olds at Kingswood</h2>
<p>${h.num(c.f.age['17']?.[0] ?? 0)} of Kingswood's tests were taken by seventeen-year-olds, ${h.pc(share17, 0)} of the total, against ${h.pc(gbShare17, 0)} for the same age across Great Britain. They passed ${h.pc(c.age['17'])}, the national rate for their age being ${h.pc(h.E.ageRate(17))}, so ${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? 'they did better than' : 'they did not do better than'} the average seventeen-year-old in Britain. First attempts at all ages succeeded ${h.pc(c.first)} of the time, and ${h.num(c.zero)} first-time candidates passed without a single fault.</p>
${h.ageTable(ID)}
<h2>The Bristol centres compared</h2>
<p>Anyone searching for a Bristol driving test centre will find ${bristol.length === 2 ? 'two' : bristol.length} in the DVSA tables: ${bristol.map((x) => h.cl(x.id, x.n)).join(' and ')}, with the postcodes ${h.F.full('bristol-avonmouth').addr[2]} for Avonmouth and ${c.addr[2]} for Kingswood. ${av.rate! > c.rate! ? `Avonmouth had the better ${Y} pass rate, ${h.pc(av.rate)} against ${h.pc(c.rate)}` : `Kingswood had the better ${Y} pass rate, ${h.pc(c.rate)} against ${h.pc(av.rate)}`}. On waiting times the picture ${(c.wait?.median ?? 99) < (av.wait?.median ?? 99) === (c.rate! > av.rate!) ? 'points the same way' : 'is reversed'}: Kingswood's median in ${h.month(h.lastMonth)} was ${h.wk(c.wait?.median)}, Avonmouth's ${h.wk(av.wait?.median)}. ${kwYA != null ? `A year earlier Kingswood's median stood at ${h.wk(kwYA)}, so its queue has ${(c.wait?.median ?? 0) < kwYA ? 'shortened' : 'lengthened'} over twelve months.` : ''} ${th ? `For the theory test, the DVSA tables list a Bristol theory centre with a ${Y} car pass rate of ${h.pc(h.E.theoryRate(th))}, against ${h.pc(h.gb.theory)} nationally.` : ''}</p>
<h2>Moving to ${c.near.map((n) => n.name.replace('Bristol (', '').replace(')', '')).join(', ').replace(/, ([^,]*)$/, ' or $1')}</h2>
<p>The three centres on DVSA's list for Kingswood are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles away`).join('; ')}. ${higher.length === c.near.length ? 'All three' : higher.length === 0 ? 'None of them' : higher.length === 1 ? 'One of them' : 'Two of them'} had a higher ${Y} pass rate than Kingswood, and ${shorter.length === 0 ? 'none' : shorter.length === c.near.length ? 'all' : shorter.length === 1 ? 'one' : 'two'} a shorter median wait in ${h.month(h.lastMonth)}. ${c.wait && higher.length > 0 && shorter.length === 0 ? `With Kingswood's own wait at ${h.wk(c.wait.median)}, a move would mainly trade distance for a better rate, not for an earlier date.` : c.wait && shorter.length > 0 ? `Kingswood's own median wait was ${h.wk(c.wait.median)}, so the table shows where an earlier date was more likely.` : ''}</p>
${h.nearTable(ID)}
<p>Figures: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK centre details')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

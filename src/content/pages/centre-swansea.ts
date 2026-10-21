import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'swansea';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 644,
  tool: { kind: 'finder', props: { centre: ID, radius: 25 } },
  related: ['region-wales', 'centre-cardiff-llanishen', 'driving-test-waiting-times', 'pass-rate-by-age-and-sex', 'driving-test-booking-rules-2026'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'swansea-driving-test-centre',
  nav: 'Swansea',
  card: 'Swansea pass rate, a year of waits and its seventeen-year-old candidates.',
  title: `Swansea Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Swansea driving test centre: car pass rate for ${YL}, a year of monthly waits, results by age, automatics, theory and the 3 nearest centres in Wales.`,
  h1: 'Swansea driving test centre: pass rate and waiting time',
  intro: 'Kings Dock, SA1: the Swansea centre for cars and motorcycles, with a year of DVSA waiting figures and its three neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gbMed = h.gb.wait?.[3];
    const prev = c.years[c.years.length - 2];
    return `${c.wait ? `${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'The wait is the first thing that sets Swansea apart' : 'Start with the wait'}: tests taken in ${h.month(c.wait.month)} had been booked a median ${h.wk(c.wait.median)} ahead, against ${h.wk(gbMed)} across Great Britain, and ${h.pp(c.wait.in7)} of candidates had booked inside seven weeks.` : 'DVSA published no wait for Swansea in the latest month.'} On results, the centre passed ${h.pc(c.rate)} of ${h.num(c.tests)} car tests in ${Y}, ${(c.rate! - (c.rateOf(prev) ?? 0)) >= 0 ? 'up' : 'down'} from ${h.pc(c.rateOf(prev))} the year before. That is ${c.rate! > h.gb.rate ? 'above' : 'below'} the British rate of ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the Welsh rate of ${h.pc(c.regionRate)}, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in Wales with at least 300 tests. Over three years the rate moved by ${h.pts(c.trend3)}. Seventeen-year-olds took ${h.pc((c.f.age['17']?.[0] ?? 0) / Math.max(1, c.tests), 0)} of the tests and passed ${h.pc(c.age['17'])}. ${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)}.` : ''} The monthly table, the results by age and the three centres a Swansea test can move to are set out below, with the yearly record.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const months = h.F.months(c.f).slice(-12);
    const shorter = months.filter((k) => (c.f.wait[k][0] ?? 99) < (h.F.areaWait('Great Britain', k)?.[3] ?? 0)).length;
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Swansea');
    return [
      { q: 'How quickly can I get a driving test in Swansea?', a: c.wait ? `In ${h.month(c.wait.month)} half of Swansea's tests had been booked less than ${h.wk(c.wait.median)} before the test day. In ${shorter === months.length ? 'every one' : shorter} of the last twelve months the Swansea median was shorter than the British median for the same month. Tests are booked only on GOV.UK, and since ${h.date(h.P.rules.onlyLearnerFrom)} only the learner may book or change one.` : `DVSA has not published a recent wait for Swansea. Tests are booked only on GOV.UK, up to ${h.P.rules.releaseWeeksAhead} weeks ahead.` },
      { q: 'Is the Swansea pass rate higher than Cardiff?', a: `In ${Y} Swansea passed ${h.pc(c.rate)} of car tests and Cardiff Llanishen ${h.pc(h.C('cardiff-llanishen').rate)}, so ${c.rate! > h.C('cardiff-llanishen').rate! ? 'Swansea' : 'Cardiff'} was higher. ${c.near.some((n) => n.id === 'cardiff-llanishen') ? 'Cardiff Llanishen is on the Swansea list of nearest centres, so a booking can be moved there.' : 'Cardiff Llanishen is not on the Swansea list of three nearest centres, so a booking cannot be moved there; choosing between them happens at the first booking.'}` },
      { q: 'What is the theory test pass rate in Swansea?', a: th ? `DVSA's theory tables list a Swansea theory centre with a ${Y} car pass rate of ${h.pc(h.E.theoryRate(th))}, against ${h.pc(h.gb.theory)} across Great Britain. The theory test costs £${h.num(h.P.fees.theory)}, and it must be passed before a practical test can be booked at the Swansea centre.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test must be passed before booking a practical test in Swansea.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const months = h.F.months(c.f).slice(-12);
    const shortW10 = months.filter((k) => (c.f.wait[k][1] ?? 99) < 12).length;
    const minW10 = months.reduce((a, k) => ((c.f.wait[k][1] ?? 99) < (c.f.wait[a][1] ?? 99) ? k : a), months[0]);
    const n17 = c.f.age['17']?.[0] ?? 0;
    const share17 = n17 / Math.max(1, c.tests);
    const gbShare17 = (h.E.NATIONAL.ageSex.rows['17']?.t?.[0] ?? 0) / Math.max(1, h.E.NATIONAL.ageSex.rows.Total?.t?.[0] ?? 1);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null && k !== '17');
    const avgOlder = ages.reduce((s2, k) => s2 + (c.age[k] ?? 0), 0) / Math.max(1, ages.length);
    const higher = c.near.filter((n) => n.rate != null && (n.rate as number) > c.rate! * 100);
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Swansea');
    const cardiffNear = c.near.some((n) => n.id === 'cardiff-llanishen');
    return `
<h2>${(c.wait?.median ?? 99) < (h.gb.wait?.[3] ?? 0) ? 'A queue shorter than the British median' : 'The Swansea queue month by month'}</h2>
<p>${c.wait ? `Swansea's median wait in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} a year earlier` : ''}. Look also at the last column: in ${shortW10} of the last twelve months the first tenth of tests had been booked less than 12 weeks ahead, and in ${h.month(minW10)} only ${h.wk(c.f.wait[minW10][1] as number)}. Where slots are booked as soon as DVSA releases them, that column reads ${h.P.rules.releaseWeeksAhead} weeks, so a low reading suggests that tests here were still free well after release.` : 'DVSA has not published recent waits for Swansea.'} The ${h.a('driving-test-waiting-times', 'waiting times page')} ranks every centre on the median wait.</p>
${h.waitTable(ID)}
<h2>Seventeen-year-olds in Swansea</h2>
<p>${h.num(n17)} tests were taken by seventeen-year-olds, ${h.pc(share17, 0)} of the centre's total, against ${h.pc(gbShare17, 0)} for that age across Great Britain${share17 > gbShare17 ? ', so the candidate list here is younger than average' : ''}. They passed ${h.pc(c.age['17'])}, while the older ages shown in the table averaged about ${h.pc(avgOlder)}. ${(h.E.ageRate(17) ?? 0) > (h.E.ageRate(25) ?? 0) ? 'Since seventeen-year-olds also pass more often than older candidates nationally, part of a centre\'s overall rate comes from the age of the people it tests.' : ''} Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}; first attempts succeeded ${h.pc(c.first)} of the time, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} first-time candidates finished with no fault recorded. The ${h.a('pass-rate-by-age-and-sex', 'age and sex page')} gives the national rate of every age.</p>
${h.ageTable(ID)}
<h2>Manual, automatic and the yearly record</h2>
<p>${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)} at Swansea, ${(c.l.mn ?? 0) - c.auto * 100 > 5 ? 'well short of' : (c.l.mn ?? 0) > c.auto * 100 ? 'short of' : 'ahead of'} the ${h.pp(c.l.mn)} of manual candidates${c.auto > h.gb.auto ? '' : ` and below the national automatic rate of ${h.pc(h.gb.auto)}`}. They made up ${h.pc(c.autoShare, 0)} of tests.` : 'No automatic figure was published for Swansea this year.'} Over five years the centre went from ${h.pc(c.rateOf(c.years[0]))} in ${h.yearLabel(c.years[0])} to ${h.pc(c.rate)} in ${Y}, with test numbers rising from ${h.num(c.f.pass[c.years[0]][0])} to ${h.num(c.tests)}. ${c.cancel ? `Examiners cancelled ${h.num(c.cancel.total)} tests during the year, ${c.cancel.weather === 0 ? 'none of them for weather' : `${h.num(c.cancel.weather)} for weather`}, ${h.num(c.cancel.medical)} for illness and ${h.num(c.cancel.leave)} for leave or training.` : ''}</p>
<h2>${c.near.map((n) => n.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The DVSA list of nearest centres for Swansea is ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles`).join('; ')}. ${higher.length === c.near.length ? `Each of them had a higher ${Y} pass rate than Swansea` : higher.length === 0 ? `None had a higher ${Y} pass rate than Swansea` : `${higher.length === 1 ? 'One' : 'Two'} of them had a higher ${Y} pass rate than Swansea`}, which the table sets against their waits. ${cardiffNear ? '' : 'Cardiff is not on the list, so a Swansea booking cannot be moved there.'} GOV.UK lists these tests at ${c.addr[0].split(',')[0]}: ${c.types}. ${th ? `For the theory test, the ${h.src('dvsa_theory_centre', 'DVSA theory tables')} give the Swansea theory centre a ${Y} pass rate of ${h.pc(h.E.theoryRate(th))}.` : ''}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

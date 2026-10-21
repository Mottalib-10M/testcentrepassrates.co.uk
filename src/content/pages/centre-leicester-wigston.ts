import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'leicester-wigston';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 641,
  tool: { kind: 'finder', props: { centre: ID, radius: 18 } },
  related: ['region-east-midlands', 'driving-test-pass-rates-by-year', 'easiest-driving-test-centres', 'theory-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'leicester-wigston-driving-test-centre',
  nav: 'Leicester (Wigston)',
  card: 'Wigston pass rate, the yearly series, the wait and Cannock Street nearby.',
  title: `Leicester Wigston Driving Test Centre: Pass Rate ${YL}`,
  description: `Leicester Wigston driving test centre: ${YL} car pass rate, the yearly series, the wait, the Leicester theory centre and how it compares with Cannock Street.`,
  h1: 'Leicester (Wigston) driving test centre: pass rate and wait',
  intro: 'Tigers Road, South Wigston, LE18: the Leicester centre for cars and motorcycles, with its yearly record and its neighbours.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const prev = c.years[c.years.length - 2];
    const jump = (c.rate! - (c.rateOf(prev) ?? 0)) * 100;
    const cs = h.C('leicester-cannock-street');
    const gbMed = h.gb.wait?.[3];
    return `Between ${h.yearLabel(prev)} and ${Y} the Wigston pass rate went from ${h.pc(c.rateOf(prev))} to ${h.pc(c.rate)}, a ${jump >= 0 ? 'rise' : 'fall'} of ${h.pts(Math.abs(jump)).replace('+', '')} on ${h.num(c.tests)} car tests. The latest figure is ${c.rate! > h.gb.rate ? 'above' : 'below'} the British ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the East Midlands' ${h.pc(c.regionRate)}, ${h.ord(c.rankRegion)} of ${c.ofRegion} centres in the region that ran 300 tests or more. Leicester's other centre, Cannock Street, passed ${h.pc(cs.rate)}, and across Great Britain Wigston ranks ${h.ord(c.rankGB)} of ${c.ofGB} centres with 1,000 tests or more. ${c.wait ? `The median wait for a Wigston test in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'shorter than'} the British median of ${h.wk(gbMed)}, with ${h.pp(c.wait.in7)} of candidates booked inside seven weeks.` : 'No wait was published for Wigston in the latest month.'} ${Math.abs(jump) >= 3 ? `Whether a change of that size holds will only show in the next yearly table; the series,` : 'The series,'} the recent waits and the three possible moves are set out below.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const cs = h.C('leicester-cannock-street');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Leicester');
    return [
      { q: 'Is Wigston or Cannock Street the better Leicester test centre?', a: `On pass rate, ${c.rate! > cs.rate! ? 'Wigston' : 'Cannock Street'} led in ${Y}: ${h.pc(c.rate)} at Wigston against ${h.pc(cs.rate)} at Cannock Street. On the ${h.month(h.lastMonth)} wait, ${(cs.wait?.median ?? 99) < (c.wait?.median ?? 99) ? 'Cannock Street was quicker' : 'Wigston was quicker'}, ${h.wk(cs.wait?.median)} against ${h.wk(c.wait?.median)}. ${c.near.some((n) => n.id === 'leicester-cannock-street') ? 'Cannock Street is on Wigston\'s list of nearest centres, so a Wigston booking can be moved there.' : 'Cannock Street is not on Wigston\'s current list of nearest centres.'}` },
      { q: 'How many pass the theory test in Leicester before a Wigston driving test?', a: th ? `The DVSA theory tables list a Leicester theory centre, which passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, against ${h.pc(h.gb.theory)} across Great Britain. The theory test is booked on GOV.UK and costs £${h.num(h.P.fees.theory)}; a pass is needed before booking a practical test at Wigston.` : `The theory test is booked on GOV.UK and costs £${h.num(h.P.fees.theory)}. Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}.` },
      { q: 'Can motorcyclists take their test at Wigston?', a: `GOV.UK lists these tests at Wigston: ${c.types}. ${/module 1/.test(c.types) && /module 2/.test(c.types) ? 'Both motorcycle modules can therefore be taken on the same site.' : 'Not every motorcycle module is offered here.'} The pass rates on this page are for car tests only; DVSA publishes motorcycle results in separate tables.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Leicester');
    const steps = ys.slice(1).map((y, i) => ({ y, d: ((c.rateOf(y) ?? 0) - (c.rateOf(ys[i]) ?? 0)) * 100 }));
    const big = steps.reduce((a, x) => (Math.abs(x.d) > Math.abs(a.d) ? x : a), steps[0]);
    const gbStep = (h.gb.rate - h.E.gbRate(h.E.YEARS[h.E.YEARS.length - 2])) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] ?? 0) > (h.E.ageRate(Number(k)) ?? 1));
    const lowerNear = c.near.filter((n) => n.rate != null && (n.rate as number) < c.rate! * 100);
    const quick = [...c.near].filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const months = h.F.months(c.f).slice(-6);
    const mn = months.reduce((a, k) => ((c.f.wait[k][0] ?? 99) < (c.f.wait[a][0] ?? 99) ? k : a), months[0]);
    return `
<h2>The biggest move in the series</h2>
<p>Of the year-on-year changes in Wigston's five-year record, the largest was ${h.pts(big.d)} in ${h.yearLabel(big.y)}. ${big.y === h.lastYear ? `Nationally the rate moved by ${h.pts(gbStep)} that year${Math.abs(big.d) > Math.abs(gbStep) + 2 ? ', which suggests a change at this centre rather than a general shift' : ''}.` : `The latest year moved by ${h.pts(steps[steps.length - 1].d)}.`} Test numbers also changed, from ${h.num(c.f.pass[ys[ys.length - 2]][0])} to ${h.num(c.tests)}. DVSA gives no reason for a change of this kind, and one strong year is not yet a trend, which is why the full series below is worth reading as a whole.</p>
${h.yearTable(ID)}
<h2>Results by age and sex</h2>
<p>In ${above.length === ages.length ? `every one of the ${ages.length}` : `${above.length} of the ${ages.length}`} ages published for Wigston, the rate was above the national rate for the same age. ${['17', '21', '24'].filter((k) => c.age[k] != null).map((k, i) => `${i ? 'candidates aged' : 'Candidates aged'} ${k} passed ${h.pc(c.age[k])} here against ${h.pc(h.E.ageRate(Number(k)))} nationally`).join('; ')}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}. First attempts succeeded ${h.pc(c.first)} of the time, ${c.first! > h.gb.first ? 'above' : 'below'} the British first-time rate of ${h.pc(h.gb.first)}, and ${h.num(c.zero)} first-time candidates passed with no fault recorded. ${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)}, manual ones ${h.pp(c.l.mn)}.` : ''}</p>
<h2>The theory step in Leicester</h2>
<p>${th ? `Before any practical test, the theory test has to be passed. DVSA's theory tables list a Leicester theory centre with a ${Y} car pass rate of ${h.pc(h.E.theoryRate(th))}, ${(h.E.theoryRate(th) ?? 0) > h.gb.theory ? 'above' : 'below'} the ${h.pc(h.gb.theory)} recorded across Great Britain.` : `Before any practical test, the theory test has to be passed; nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}.`} It costs £${h.num(h.P.fees.theory)}, against £${h.num(h.P.fees.practicalWeekday)} for a weekday practical test, and the ${h.a('theory-test-pass-rates', 'theory pass rates page')} compares every theory centre.</p>
<h2>Recent waits at Wigston</h2>
<p>${c.wait ? `Over the last six months the median wait was lowest in ${h.month(mn)}, at ${h.wk(c.f.wait[mn][0] as number)}, and stood at ${h.wk(c.wait.median)} in ${h.month(c.wait.month)}${c.waitYearAgo != null ? `; a year earlier it had been ${h.wk(c.waitYearAgo)}` : ''}. In that latest month ${h.pp(c.wait.in7)} of candidates had booked within seven weeks, against ${h.pp(h.gb.wait?.[4])} nationally. ${c.cancel ? `Examiner cancellations were ${h.num(c.cancel.total)} in ${Y}, ${h.pc(c.cancel.total / Math.max(1, c.tests))} of tests conducted, ${h.num(c.cancel.medical)} of them for illness.` : ''}` : 'DVSA has not published recent waits for Wigston.'} The address on GOV.UK is ${c.addr.join(', ')}${c.notes.length ? `, with this note: "${c.notes[0]}"` : '.'}</p>
${h.waitTable(ID, 6)}
<h2>${c.near.map((n) => n.name.replace('Leicester (', '').replace(')', '')).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The three centres DVSA lists as nearest to Wigston are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${lowerNear.length === c.near.length ? `All three had a lower ${Y} pass rate than Wigston, so a move would be about the date, not the odds.` : lowerNear.length === 0 ? `All three had a higher ${Y} pass rate than Wigston.` : `${lowerNear.length === 1 ? 'One' : 'Two'} of the three had a lower ${Y} pass rate than Wigston.`} ${quick ? `The shortest ${h.month(h.lastMonth)} wait among them was at ${quick.name}, ${h.wk(quick.wait)}.` : ''} The ${h.a('move-driving-test-centre', 'moving guide')} covers the limit of ${h.P.rules.changesAllowed} changes per booking.</p>
${h.nearTable(ID)}
<p>Pass rates: ${h.src('dvsa_pass_centre', 'DVSA table DRT122A')}. Waits: ${h.src('dvsa_waits', 'DVSA table DRT122F')}. Theory: ${h.src('dvsa_theory_centre', 'DVSA theory tables')}. Address and nearest centres: ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

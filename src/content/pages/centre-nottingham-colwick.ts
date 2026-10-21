import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'nottingham-colwick';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 642,
  tool: { kind: 'finder', props: { centre: ID, radius: 18 } },
  related: ['region-east-midlands', 'compare-driving-test-centres', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'nottingham-colwick-driving-test-centre',
  nav: 'Nottingham (Colwick)',
  card: 'Colwick pass rate, five years of volumes, the wait and Chilwell compared.',
  title: `Nottingham Colwick Driving Test Centre: Pass Rate ${YL}`,
  description: `Nottingham Colwick driving test centre: ${YL} car pass rate, five years of volumes, women, men, results by age, the wait and how Chilwell and Ashfield fare.`,
  h1: 'Nottingham (Colwick) driving test centre: pass rate and wait',
  intro: 'Colwick Industrial Estate, NG4: the Nottingham centre for cars and motorcycles, compared with the three centres DVSA lists nearby.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const y0 = c.years[0];
    const ch = h.C('nottingham-chilwell');
    const gbMed = h.gb.wait?.[3];
    return `Colwick handled ${h.num(c.tests)} car tests in ${Y}, ${c.tests > c.f.pass[y0][0] ? `up from ${h.num(c.f.pass[y0][0])}` : `down from ${h.num(c.f.pass[y0][0])}`} in ${h.yearLabel(y0)}, and passed ${h.pc(c.rate)} of them. The British rate was ${h.pc(h.gb.rate)} and the East Midlands rate ${h.pc(c.regionRate)}: Colwick is ${c.rate! > h.gb.rate ? 'above' : 'below'} the first, ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the second, and ${h.ord(c.rankRegion)} of ${c.ofRegion} East Midlands centres with 300 tests or more. Nottingham's other centre, ${h.cl('nottingham-chilwell', 'Chilwell')}, passed ${h.pc(ch.rate)} on ${h.num(ch.tests)} tests. ${c.wait ? `A Colwick test in ${h.month(c.wait.month)} had typically been booked ${h.wk(c.wait.median)} ahead, ${(c.wait.median ?? 0) > (gbMed ?? 0) ? 'longer than' : 'shorter than'} the British median of ${h.wk(gbMed)}, against ${h.wk(ch.wait?.median)} at Chilwell; ${h.pp(c.wait.in7)} of Colwick candidates had booked within seven weeks.` : 'No wait was published for Colwick in the latest month.'} The page goes on with the yearly series, the results by sex and by age, the waits of the past year and the three centres a Colwick test can be moved to.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ch = h.C('nottingham-chilwell');
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Nottingham');
    return [
      { q: 'Should I book Colwick or Chilwell in Nottingham?', a: `In ${Y} Chilwell passed ${h.pc(ch.rate)} and Colwick ${h.pc(c.rate)}, so ${ch.rate! > c.rate! ? 'Chilwell' : 'Colwick'} had the higher rate. In ${h.month(h.lastMonth)} the median waits were ${h.wk(ch.wait?.median)} at Chilwell and ${h.wk(c.wait?.median)} at Colwick. ${c.near.some((n) => n.id === 'nottingham-chilwell') ? 'Chilwell is on the DVSA list of nearest centres for Colwick, so a booking can be moved there.' : ''}` },
      { q: 'Do women pass more than men at Colwick?', a: `They did in ${Y}${(c.fem ?? 0) > (c.m ?? 0) ? '' : ' not'}: women passed ${h.pc(c.fem)} of their Colwick tests and men ${h.pc(c.m)}. Nationally the figures were ${h.pc(h.gb.f)} for women and ${h.pc(h.gb.m)} for men. The DVSA tables do not say why, and they do not record lessons or experience, so the figures should not be read as anyone's odds.` },
      { q: 'What is the theory test pass rate in Nottingham?', a: th ? `DVSA's theory tables list a Nottingham theory centre that passed ${h.pc(h.E.theoryRate(th))} of car theory tests in ${Y}, against ${h.pc(h.gb.theory)} nationally. The theory test costs £${h.num(h.P.fees.theory)} and must be passed before booking the practical test at Colwick, which costs £${h.num(h.P.fees.practicalWeekday)} on a weekday.` : `Nationally ${h.pc(h.gb.theory)} of car theory tests were passed in ${Y}. The theory test costs £${h.num(h.P.fees.theory)} and must be passed before booking the Colwick practical test.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const growth = c.tests / Math.max(1, c.f.pass[ys[0]][0]);
    const d5 = (c.rate! - (c.rateOf(ys[0]) ?? 0)) * 100;
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const n17 = c.f.age['17']?.[0] ?? 0;
    const gbSexGap = (h.gb.m - h.gb.f) * 100;
    const th = h.E.THEORY_CENTRES.find((t) => t.name === 'Nottingham');
    const wv = h.F.months(c.f).slice(-12).map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const lo = wv.reduce((a, x) => (x.v < a.v ? x : a), wv[0]);
    const hi = wv.reduce((a, x) => (x.v > a.v ? x : a), wv[0]);
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    const quick = [...c.near].filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const both = c.near.filter((n) => n.rate != null && n.wait != null && (n.rate as number) > c.rate! * 100 && (n.wait as number) < (c.wait?.median ?? 0));
    return `
<h2>Volume and rate since ${h.yearLabel(ys[0])}</h2>
<p>Between ${h.yearLabel(ys[0])} and ${Y}, Colwick's yearly test count went from ${h.num(c.f.pass[ys[0]][0])} to ${h.num(c.tests)}, ${growth >= 1.8 ? 'close to double' : growth >= 1.2 ? 'a large increase' : growth >= 0.95 ? 'a similar level' : 'a fall'}. Over the same years the pass rate moved by ${h.pts(d5)}. ${d5 < 0 && growth > 1.2 ? 'The two moved in opposite directions, though the tables cannot tell whether more candidates and a lower rate are linked.' : ''} The table shows each year next to the British figure.</p>
${h.yearTable(ID)}
<h2>Women, men and age at Colwick</h2>
<p>Women passed ${h.pc(c.fem)} and men ${h.pc(c.m)}. Across Great Britain ${gbSexGap > 0 ? 'men' : 'women'} were ${h.num(Math.abs(Math.round(gbSexGap * 10) / 10))} points ahead, so Colwick ${((c.fem ?? 0) > (c.m ?? 0)) === (gbSexGap > 0) ? 'reverses the national order' : 'follows the national order'}. Seventeen-year-olds took ${h.num(n17)} tests and passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} nationally. Of the ${ages.length} ages DVSA reports for Colwick, the lowest rate was at age ${ages.reduce((a, k) => ((c.age[k] ?? 1) < (c.age[a] ?? 1) ? k : a), ages[0])}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} of them with no driving fault at all.</p>
${h.ageTable(ID)}
<h2>The past year of Colwick waits</h2>
<p>${c.wait ? `Within the last twelve months the median Colwick wait ranged from ${h.wk(lo.v)} in ${h.month(lo.k)} to ${h.wk(hi.v)} in ${h.month(hi.k)}. ${c.waitYearAgo != null ? `The latest figure, ${h.wk(c.wait.median)}, compares with ${h.wk(c.waitYearAgo)} in the same month a year earlier, so the queue is ${(c.wait.median ?? 0) < c.waitYearAgo ? 'shorter' : 'longer'} than it was.` : ''} In ${h.month(c.wait.month)} the first tenth of tests had been booked ${h.wk(c.wait.w10)} ahead. ${th ? `Learners who still have the theory test to pass can compare the Nottingham theory centre, at ${h.pc(h.E.theoryRate(th))} in ${Y}, on the ${h.src('dvsa_theory_centre', 'DVSA theory tables')}.` : ''}` : 'DVSA has not published recent waits for Colwick.'}</p>
<h2>Automatic cars and cancellations</h2>
<p>${c.auto != null ? `Automatic tests made up ${h.pc(c.autoShare, 0)} of the total, ${h.num(c.autoTests)} in all, and passed ${h.pc(c.auto)}; manual tests passed ${h.pp(c.l.mn)}. Nationally the automatic rate was ${h.pc(h.gb.auto)}.` : 'DVSA published no automatic figure for Colwick this year.'} ${c.cancel ? `DVSA recorded ${h.num(c.cancel.total)} examiner cancellations in ${Y}, ${h.num(c.cancel.medical)} of them for illness and ${h.num(c.cancel.weather)} for weather.` : ''} GOV.UK lists these tests at ${c.addr[0]}: ${c.types}.</p>
<h2>${c.near.map((n) => n.name.replace('Nottingham (', '').replace(')', '')).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The DVSA list of nearest centres for Colwick is ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. By ${Y} pass rate, the order is ${ranked.map((n) => `${n.name} ${h.pp(n.rate)}`).join(', ')}. ${quick ? `The quickest in ${h.month(h.lastMonth)} was ${quick.name}, at ${h.wk(quick.wait)}.` : ''} ${both.length ? `${both.map((n) => n.name).join(' and ')} beat Colwick on both rate and wait that month.` : 'None beat Colwick on both rate and wait that month.'} Use the ${h.a('compare-driving-test-centres', 'comparison tool')} to set any two side by side.</p>
${h.nearTable(ID)}
<p>Figures from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and ${h.src('dvsa_waits', 'DVSA waiting times')}; address, tests offered and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

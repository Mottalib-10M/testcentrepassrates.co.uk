import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'cheetham-hill-manchester';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 634,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['region-north-west', 'centre-west-didsbury-manchester', 'first-time-pass-rates', 'driving-test-faults', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'cheetham-hill-driving-test-centre',
  nav: 'Manchester (Cheetham Hill)',
  card: 'Cheetham Hill pass rate, clean-sheet passes, wait and the nearby Manchester centres.',
  title: `Manchester Cheetham Hill Test Centre: Pass Rate ${YL}`,
  description: `Manchester Cheetham Hill driving test centre: ${YL} car pass rate, first-time and fault-free passes, men and women, monthly wait and the 3 nearest centres.`,
  h1: 'Cheetham Hill (Manchester) driving test centre: pass rate and wait',
  intro: 'Alderglen Road, M8: north Manchester car centre with instructor tests, read through its first attempts, its clean sheets and its queue.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const man = h.E.sorted(h.E.CENTRES.filter((x) => x.n.includes('(Manchester)')), 'rate');
    const pos = man.findIndex((x) => x.id === ID) + 1;
    const gbMed = h.gb.wait?.[3];
    return `A Cheetham Hill candidate in ${Y} had a ${h.pc(c.rate)} chance of passing on the centre's average: ${h.num(c.passes)} passes from ${h.num(c.tests)} car tests. That compares with ${h.pc(h.gb.rate)} for Great Britain and ${h.pc(c.regionRate)} for the North West, which puts the centre ${c.rate! > h.gb.rate ? 'above' : 'below'} the national rate and ${h.ord(c.rankRegion)} of ${c.ofRegion} North West centres with at least 300 tests. Among the ${man.length} centres that DVSA names after Manchester it ranks ${h.ord(pos)}. The three-year change is ${h.pts(c.trend3)}. ${c.wait ? `On the waiting side, the median Cheetham Hill test in ${h.month(c.wait.month)} had been booked ${h.wk(c.wait.median)} ahead, ${(c.wait.median ?? 0) < (gbMed ?? 0) ? 'quicker than' : 'slower than'} the British median of ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of candidates got their date within seven weeks.` : 'DVSA did not publish a recent wait for this centre.'} Men and women ${Math.abs((c.m ?? 0) - (c.fem ?? 0)) > 0.03 ? 'did not fare alike here' : 'fared much alike here'}, and fault-free passes were ${(c.zero / Math.max(1, c.firstTests * (c.first ?? 0))) < h.E.NATIONAL.first[h.lastYear][2] / h.E.NATIONAL.first[h.lastYear][1] ? 'rarer' : 'more common'} than nationally, as the sections below show.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const fp = Math.round(c.firstTests * (c.first ?? 0));
    const wd = h.C('west-didsbury-manchester');
    return [
      { q: 'How many people pass first time at Cheetham Hill?', a: `${h.pc(c.first)} of first attempts at Cheetham Hill succeeded in ${Y}, about ${h.num(fp)} passes from ${h.num(c.firstTests)} first tests, against ${h.pc(h.gb.first)} nationally. Only ${h.num(c.zero)} of those first-time passes came with no driving fault recorded at all. A pass allows up to 15 driving faults and no serious or dangerous fault.` },
      { q: 'Is Cheetham Hill or West Didsbury the better choice in Manchester?', a: `On the ${Y} DVSA figures Cheetham Hill passed ${h.pc(c.rate)} and West Didsbury ${h.pc(wd.rate)}. In ${h.month(h.lastMonth)} the median waits were ${h.wk(c.wait?.median)} and ${h.wk(wd.wait?.median)}. ${c.near.some((n) => n.id === 'west-didsbury-manchester') ? 'West Didsbury is on the DVSA list of nearest centres for Cheetham Hill, so a test can be moved there' : 'West Didsbury is not on the current DVSA list of nearest centres for Cheetham Hill; a move goes to one of the three listed'}, using one of the ${h.P.rules.changesAllowed} changes a booking allows.` },
      { q: 'Do women pass less than men at Cheetham Hill?', a: `In ${Y} women passed ${h.pc(c.fem)} of their tests at Cheetham Hill and men ${h.pc(c.m)}. Across Great Britain the figures were ${h.pc(h.gb.f)} and ${h.pc(h.gb.m)}. DVSA's tables give no reason for a gap of this kind, and they do not record how many lessons each candidate took, so the figures describe past results rather than anyone's chances.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ys = c.years;
    const lowY = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const fp = c.firstTests * (c.first ?? 0);
    const zShare = fp ? c.zero / fp : 0;
    const gbZ = h.E.NATIONAL.first[h.lastYear][2] / h.E.NATIONAL.first[h.lastYear][1];
    const sex = ((c.m ?? 0) - (c.fem ?? 0)) * 100, gbSex = (h.gb.m - h.gb.f) * 100;
    const months = h.F.months(c.f).slice(-12);
    const vals = months.map((k) => ({ k, v: c.f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const hi = vals.reduce((a, x) => (x.v > a.v ? x : a), vals[0]);
    const lo = vals.reduce((a, x) => (x.v < a.v ? x : a), vals[0]);
    const ranked = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    const better = ranked.filter((n) => (n.rate as number) > c.rate! * 100);
    return `
<h2>Passes without a single fault</h2>
<p>Of roughly ${h.num(Math.round(fp))} first-time passes at Cheetham Hill in ${Y}, ${h.num(c.zero)} were achieved with no driving fault at all, ${h.pc(zShare)} of them. Across Great Britain the share was ${h.pc(gbZ)}. ${zShare < gbZ ? 'So a fault-free drive was less common here than in the country as a whole' : 'So a fault-free drive was at least as common here as nationally'}. A few minor faults do not cost the test, which needs more than 15 driving faults, or a single serious or dangerous one, to fail; the ${h.a('driving-test-faults', 'guide to driving test faults')} lists the ones that come up most. First attempts overall passed ${h.pc(c.first)} of the time.</p>
<h2>Men, women and gearboxes</h2>
<p>Men passed ${h.pc(c.m)} of their Cheetham Hill tests and women ${h.pc(c.fem)}, a difference of ${h.num(Math.abs(Math.round(sex * 10) / 10))} points, ${Math.abs(sex) > Math.abs(gbSex) ? 'wider than' : 'not wider than'} the ${h.num(Math.round(gbSex * 10) / 10)}-point gap across Great Britain. ${c.auto != null ? `Automatic candidates, ${h.num(c.autoTests)} of them, passed ${h.pc(c.auto)}, and manual candidates ${h.pp(c.l.mn)}.` : ''} Seventeen-year-olds ${Object.keys(c.age).every((k) => (c.age[k] ?? 0) <= (c.age['17'] ?? 0)) ? 'did best of all ages' : 'passed'} with ${h.pc(c.age['17'])}${(c.age['17'] ?? 0) > (h.E.ageRate(17) ?? 0) ? ', above' : ', below'} the national rate for that age.</p>
<h2>The yearly series since ${h.yearLabel(ys[0])}</h2>
<p>The yearly series starts at ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])}. The weakest year was ${h.yearLabel(lowY)}, at ${h.pc(c.rateOf(lowY))}, and the latest stands at ${h.pc(c.rate)}, ${c.rate! >= (c.rateOf(ys[0]) ?? 0) ? 'back at or above' : 'still short of'} where it began. Test numbers went from ${h.num(c.f.pass[ys[0]][0])} to ${h.num(c.tests)} over the same years.</p>
${h.yearTable(ID)}
<h2>From ${h.wk(lo.v)} to ${h.wk(hi.v)} in one year</h2>
<p>Within the last twelve months, the median wait at Cheetham Hill ranged from ${h.wk(lo.v)} in ${h.month(lo.k)} to ${h.wk(hi.v)} in ${h.month(hi.k)}. ${hi.v - lo.v > 6 ? 'With a swing of this size, the month in which you book can matter as much as the centre.' : ''} ${c.wait ? `The most recent figure is ${h.wk(c.wait.median)} for ${h.month(c.wait.month)}.` : ''} The address given by GOV.UK is ${c.addr.join(', ')}.${c.notes.length ? ` Its note for candidates: "${c.notes[0]}"` : ''}</p>
${h.waitTable(ID, 9)}
<h2>${c.near.map((n) => n.name.replace(' (Manchester)', '')).join(', ')}</h2>
<p>These are the three centres DVSA lists as nearest to Cheetham Hill: ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles`).join('; ')}. ${better.length ? `${better.length === c.near.length ? 'All three' : better.length === 1 ? 'One of them' : 'Two of them'} had a higher ${Y} pass rate than Cheetham Hill, ${better.map((n) => `${n.name} at ${h.pp(n.rate)}`).join(', ')}.` : `None of them had a higher ${Y} pass rate.`} Their waits in ${h.month(h.lastMonth)} are in the table, and they may well differ from the wait you are offered on the day you book.</p>
${h.nearTable(ID)}
<p>Every figure comes from ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')} and ${h.src('dvsa_waits', 'DVSA waiting times')}; address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')} and ${h.src('gov_nearest', 'DVSA')}.</p>
`;
  },
});

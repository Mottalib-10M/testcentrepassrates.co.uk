import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'birmingham-south-yardley';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 632,
  tool: { kind: 'finder', props: { centre: ID, radius: 12 } },
  related: ['region-west-midlands', 'centre-birmingham-garretts-green', 'centre-birmingham-kingstanding', 'automatic-driving-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'birmingham-south-yardley-driving-test-centre',
  nav: 'Birmingham (South Yardley)',
  card: 'South Yardley pass rate, gearbox gap and the Birmingham centres a test can move to.',
  title: `Birmingham South Yardley Test Centre: Pass Rate ${YL}`,
  description: `Birmingham South Yardley driving test centre: ${YL} car pass rate, manual and automatic results, the monthly wait and the nearby Birmingham centres compared.`,
  h1: 'Birmingham (South Yardley) driving test centre: pass rate and wait',
  intro: 'Clay Lane, B26: an east Birmingham centre that also hosts instructor tests, compared with Garretts Green, Shirley and Cocks Moors.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const city = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Birmingham (') && x.t >= 1000), 'rate');
    const pos = city.findIndex((x) => x.id === ID) + 1;
    const gbMed = h.gb.wait?.[3];
    return `In ${Y}, ${h.num(c.passes)} of the ${h.num(c.tests)} car tests taken at South Yardley ended in a pass: ${h.pc(c.rate)}, ${c.rate! > h.gb.rate ? 'more than' : 'less than'} the ${h.pc(h.gb.rate)} of Great Britain as a whole and ${c.rate! > (c.regionRate ?? 0) ? 'more than' : 'less than'} the ${h.pc(c.regionRate)} of the West Midlands. ${pos === city.length ? `Of the ${city.length} Birmingham centres with 1,000 tests or more, none had a lower rate.` : pos === 1 ? `No Birmingham centre with 1,000 tests or more had a higher rate.` : `It placed ${h.ord(pos)} of the ${city.length} Birmingham centres with 1,000 tests or more.`} Over three years the figure moved by ${h.pts(c.trend3)}. ${c.wait ? `The latest DVSA waiting table, for ${h.month(c.wait.month)}, puts the median gap between booking and test at ${h.wk(c.wait.median)}, against ${h.wk(gbMed)} nationally, with ${h.pp(c.wait.in7)} of tests booked less than seven weeks ahead.` : 'No waiting time was published for the latest month.'} The sections below look at the gap between manual and automatic candidates, at the wait over the past months and at the three centres DVSA lists as nearest, with their own rates and queues.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    return [
      { q: 'Is South Yardley wheelchair accessible?', a: `${c.notes.length ? `The GOV.UK centre finder carries this note for South Yardley: "${c.notes[0]}"` : 'The GOV.UK centre finder carries no access note for South Yardley.'} The address it gives is ${c.addr.join(', ')}. Candidates with a disability or a health condition can say so when booking on GOV.UK, so that the test is planned for them.` },
      { q: 'Do automatic drivers pass less often at South Yardley?', a: c.auto != null ? `In ${Y} they did ${c.auto < (c.l.mn ?? 0) / 100 ? 'pass less often' : 'not pass less often'}: ${h.pc(c.auto)} in automatic cars against ${h.pp(c.l.mn)} in manual ones, from ${h.num(c.autoTests)} automatic tests. Nationally automatics passed ${h.pc(h.gb.auto)}. The two groups are not the same people, so the gap describes candidates more than gearboxes. A pass in an automatic gives an automatic-only licence.` : `DVSA did not publish an automatic figure for South Yardley in ${Y}. Nationally automatic candidates passed ${h.pc(h.gb.auto)}, against ${h.pc(h.gb.rate)} for all car tests, a gap that varies a lot from one centre to another.` },
      { q: 'Can I move a South Yardley test to Cocks Moors or Shirley?', a: `${['Cocks Moors', 'Shirley'].every((k) => c.near.some((n) => n.name.includes(k))) ? 'Yes, both are on' : 'Not necessarily: check the names on'} the DVSA list of three nearest centres for South Yardley, which reads ${c.near.map((n) => `${n.name} at ${h.num(n.miles)} miles`).join(', ')}. Since ${h.date(h.P.rules.nearestThreeFrom)} a car test can only move between a centre and those three, and each move uses one of the ${h.P.rules.changesAllowed} changes a booking allows.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gap = ((c.l.mn ?? 0) - (c.l.a ?? 0));
    const gbGap = ((h.E.NATIONAL.practical[h.lastYear].t[1] - h.E.NATIONAL.auto[h.lastYear][1]) / (h.E.NATIONAL.practical[h.lastYear].t[0] - h.E.NATIONAL.auto[h.lastYear][0]) - h.gb.auto) * 100;
    const sex = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const gbSex = (h.gb.m - h.gb.f) * 100;
    const cm = c.near.find((n) => n.id === 'birmingham-cocks-moors');
    const cmLite = cm?.id && h.E.hasCentre(cm.id) ? h.E.centre(cm.id) : null;
    const sorted = [...c.near].filter((n) => n.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
    const months = h.F.months(c.f).slice(-12);
    const half = (ks: string[]) => ks.map((k) => c.f.wait[k][0]).filter((v): v is number => v != null);
    const avg = (v: number[]) => v.reduce((s, x) => s + x, 0) / Math.max(1, v.length);
    const early = avg(half(months.slice(0, 6))), late = avg(half(months.slice(6)));
    return `
<h2>Manual against automatic</h2>
<p>${c.auto != null ? `South Yardley ran ${h.num(c.autoTests)} automatic tests in ${Y}, ${h.pc(c.autoShare, 0)} of the total. Their pass rate, ${h.pc(c.auto)}, was ${h.num(Math.abs(Math.round(gap * 10) / 10))} points ${gap > 0 ? 'below' : 'above'} the manual figure of ${h.pp(c.l.mn)}. Across Great Britain the difference between manual and automatic candidates was about ${h.num(Math.round(gbGap))} points, so the gap here is ${Math.abs(gap) > Math.abs(gbGap) + 1 ? 'wider than' : Math.abs(gap) < Math.abs(gbGap) - 1 ? 'narrower than' : 'close to'} the national one. The tables count tests, not learners, and say nothing about how many lessons each group took, so this is a description of results rather than a verdict on the gearbox.` : `DVSA did not publish an automatic pass rate for South Yardley in ${Y}.`}</p>
<p>The sex gap ${Math.sign(sex) === Math.sign(gbSex) ? 'points the same way as' : 'runs the opposite way to'} the national one: men passed ${h.pc(c.m)}, women ${h.pc(c.fem)}, ${h.num(Math.abs(Math.round(sex)))} points apart against ${h.num(Math.round(gbSex))} nationally. First attempts ended in a pass ${h.pc(c.first)} of the time, ${c.first! > h.gb.first ? 'above' : 'below'} the British first-time rate of ${h.pc(h.gb.first)}.</p>
<h2>Instructor tests on the same site</h2>
<p>The GOV.UK finder lists the following tests at ${c.addr[0]}: ${c.types}. ${/ADI/.test(c.types) ? 'The ADI parts are the tests taken by would-be driving instructors, and they are not counted in the car results on this page.' : ''} ${c.notes.length ? `Its access note reads: "${c.notes[0]}"` : ''}</p>
<h2>Five years of results at South Yardley</h2>
<p>The centre tested ${h.num(c.f.pass[c.years[0]][0])} candidates in ${h.yearLabel(c.years[0])} and ${h.num(c.tests)} in ${Y}, ${c.tests > c.f.pass[c.years[0]][0] * 1.2 ? 'a clear increase in throughput' : c.tests >= c.f.pass[c.years[0]][0] ? 'a similar level' : 'fewer than at the start'}. The pass rate went from ${h.pc(c.rateOf(c.years[0]))} to ${h.pc(c.rate)} over the same span, while the national rate ended at ${h.pc(h.gb.rate)}.</p>
${h.yearTable(ID)}
<h2>The past year of waiting times</h2>
<p>${c.wait ? `Averaged over the six oldest months in the table, the median wait was ${h.wk(Math.round(early * 10) / 10)}; over the six most recent, ${h.wk(Math.round(late * 10) / 10)}, so the queue has ${late > early + 0.5 ? 'lengthened' : late < early - 0.5 ? 'shortened' : 'held roughly level'} during the year. ${h.month(c.wait.month)} closed at ${h.wk(c.wait.median)}. The ${h.a('driving-test-waiting-times', 'waiting-time guide')} explains how DVSA measures these weeks.` : 'DVSA has not published recent waits for this centre.'}</p>
${h.waitTable(ID, 8)}
<h2>The three centres DVSA lists nearby</h2>
<p>DVSA's three nearest centres for South Yardley are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name}, ${h.num(n.miles)} miles away`).join('; ')}. Ranked by ${Y} pass rate, ${sorted.map((n) => `${n.name} ${h.pp(n.rate)}`).join(', then ')}. ${cmLite ? `Cocks Moors deserves a caution: it ran only ${h.num(cmLite.t)} car tests in the year, ${cmLite.t < 1000 ? `so its rate rests on a small base${cmLite.w != null && cmLite.w < (c.wait?.median ?? 0) ? ', and its shorter wait may reflect a small diary' : ''}` : 'a base large enough to compare'}.` : ''} A test moved there uses one of the two changes, as the ${h.a('move-driving-test-centre', 'moving guide')} explains.</p>
${h.nearTable(ID)}
<p>Data: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')}, ${h.src('dvsa_waits', 'DVSA waiting times by centre')}, ${h.src('gov_find_centre', 'GOV.UK centre details')} and ${h.src('gov_nearest', 'the nearest-centre list')}.</p>
`;
  },
});

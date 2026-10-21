import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

export default definePage({
  id: 'centre-hendon-london',
  group: 'centres',
  order: 600,
  tool: { kind: 'finder', props: { centre: 'hendon-london', radius: 8 } },
  related: ['centre-mill-hill-london', 'centre-barnet-london', 'region-london', 'move-driving-test-centre', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'hendon-driving-test-centre',
  nav: 'Hendon',
  card: 'Pass rate, wait and the three centres a Hendon test can move to.',
  title: `Hendon Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Hendon driving test centre pass rate for ${YL} from DVSA, by sex, age and gearbox, with the latest monthly wait and the 3 centres you can move a test to.`,
  h1: 'Hendon driving test centre: pass rate and waiting time',
  intro: 'Beaufort Park, NW9: one of the busiest car test centres of north London, compared with Mill Hill, Borehamwood and Barnet.',
  resume: (h) => {
    const c = h.C('hendon-london');
    return `The pass rate at Hendon driving test centre was ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}: ${h.num(c.passes)} passes out of ${h.num(c.tests)} car practical tests, against ${h.pc(h.gb.rate)} across Great Britain and ${h.pc(c.regionRate)} for London. That is up from ${h.pc(c.rateOf('2021-22'))} four years earlier, and the ${h.ord(c.rankRegion)} highest of ${c.ofRegion} London centres. Men passed ${h.pc(c.m)} of their tests here and women ${h.pc(c.fem)}. The weak point is the wait: in ${h.month(h.lastMonth)} half of the tests taken at Hendon had been booked more than ${h.wk(c.wait?.median)} earlier, against ${h.wk(h.gb.wait?.[3])} across Great Britain in the same month. The finder above lists every centre around NW9 with its own rate and wait, and the tables below give the five-year series, the results by age and the monthly waits that sit behind these averages.`;
  },
  faqs: (h) => {
    const c = h.C('hendon-london');
    const mh = h.C('mill-hill-london');
    return [
      { q: 'Is Hendon an easy driving test centre?', a: `Not easy, but better than average. ${h.pc(c.rate)} of tests passed in ${h.yearLabel(h.lastYear)}, above the ${h.pc(h.gb.rate)} of Great Britain, and it has risen in each of the last three years. Among London centres with at least 300 tests it ranked ${h.ord(c.rankRegion)} of ${c.ofRegion}. Mill Hill, two miles away, passed ${h.pc(mh.rate)}.` },
      { q: 'Where is Hendon driving test centre?', a: `At ${c.addr[0]}, ${c.addr[1]}, ${c.addr[2]}, according to the GOV.UK centre finder. It runs car tests only: lorry, bus and motorcycle candidates are tested at other centres. DVSA does not publish its test routes, and since 12 May 2026 only the learner may book or change a test there, on GOV.UK.` },
      { q: 'Can I move my Hendon test to Mill Hill or Barnet?', a: `Yes. Since 9 June 2026 a car test booked at Hendon can only be moved to one of the three centres DVSA lists as nearest: Mill Hill, Borehamwood and Barnet, or back to Hendon if you first booked there. Each move counts as one of the two changes allowed on a booking, so check the rate and wait of each before using one.` },
      { q: 'Do men or women pass more at Hendon?', a: `Men did in ${h.yearLabel(h.lastYear)}: ${h.pc(c.m)} against ${h.pc(c.fem)} for women, a gap of about ${h.num(Math.round(((c.m ?? 0) - (c.fem ?? 0)) * 100))} points, against ${h.num(Math.round((h.gb.m - h.gb.f) * 100))} across Great Britain. The figures come from DVSA table DRT122A and describe past candidates. Age, practice and the number of earlier attempts weigh more than sex on any one result.` },
    ];
  },
  body: (h) => {
    const c = h.C('hendon-london');
    const f = c.f;
    const autoShare = c.autoShare ?? 0;
    const mh = h.C('mill-hill-london'), bn = h.C('barnet-london');
    const lowM = h.F.months(f).filter((k) => f.wait[k][0] != null).reduce((a, k) => ((f.wait[k][0] as number) < (f.wait[a][0] as number) ? k : a));
    return `
<h2>Five years of results</h2>
<p>Hendon tested ${h.num(c.f.pass['2022-23'][0])} candidates in ${h.yearLabel('2022-23')}, its busiest year in the series, and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. Over three years the rate moved by ${h.pts(c.trend3)}, while the national rate went from ${h.pc(h.E.gbRate(h.E.YEARS[0]))} to ${h.pc(h.gb.rate)}.</p>
${h.yearTable('hendon-london')}
<h2>Automatic cars are half the work here</h2>
<p>${h.pc(autoShare, 0)} of Hendon's tests in ${h.yearLabel(h.lastYear)} were taken in an automatic car, ${h.num(c.autoTests)} in all, against ${h.pc(h.E.NATIONAL.auto[h.lastYear][0] / h.E.NATIONAL.practical[h.lastYear].t[0], 0)} nationally. Automatic candidates passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual candidates; across Britain automatics passed ${h.pc(h.gb.auto)}. A pass in an automatic only allows you to drive automatics, so the choice is about the licence you want rather than the odds.</p>
<h2>First attempts and age</h2>
<p>First-time candidates passed ${h.pc(c.first)}, and ${h.num(c.zero)} of them drove without a single recorded fault. Seventeen-year-olds passed ${h.pc(c.age['17'])} here, twenty-five-year-olds ${h.pc(c.age['25'])}; the table sets each age beside its national rate.</p>
${h.ageTable('hendon-london')}
<p>Read the age column with care: each figure rests on a few hundred tests, so one or two points either way between two ages is noise rather than a pattern. The national column, built on hundreds of thousands of tests, is the steadier guide to how age affects the odds.</p>
<h2>Waiting for a slot</h2>
<p>Waits at Hendon swing hard from month to month: the median fell to ${h.wk(f.wait[lowM][0] as number)} in ${h.month(lowM)}, then climbed to ${h.wk(c.wait?.median)} in ${h.month(h.lastMonth)}. Only ${h.pp(c.wait?.in7)} of the tests taken that month had been booked within seven weeks. Examiners cancelled ${h.num(c.cancel?.total ?? 0)} Hendon tests over the year, ${h.num(c.cancel?.medical ?? 0)} of them for illness, which feeds back into the queue. The column on the right shows that in most months the first tenth of Hendon's slots had been booked 24 weeks ahead, the furthest the booking service allows, so the earliest places went the week they were released and later bookers relied on dates given back by others.</p>
${h.waitTable('hendon-london')}
<h2>Mill Hill, Borehamwood, Barnet: the three alternatives</h2>
<p>The rules of 2026 limit a move to the three centres DVSA names as nearest. For Hendon they are ${h.cl('mill-hill-london', 'Mill Hill')} at ${h.pc(mh.rate)}, Borehamwood just over the Hertfordshire border, and ${h.cl('barnet-london', 'Barnet')} at ${h.pc(bn.rate)}. None of them offers a clearly better pass rate, so the reason to move is the date, not the odds. The ${h.a('move-driving-test-centre', 'moving a test guide')} explains how each move uses one of the two changes allowed. Before using one, compare the waits in the table: in ${h.month(h.lastMonth)} the shortest of the four was at ${[c.wait?.median != null ? { n: 'Hendon', w: c.wait.median } : null, ...c.near.map((n) => ({ n: n.name.replace(' (London)', ''), w: n.wait }))].filter((x): x is { n: string; w: number } => !!x && x.w != null).sort((a, b) => a.w - b.w)[0]?.n}.</p>
${h.nearTable('hendon-london')}
<p>The rates and waits on this page are re-read from the ${h.src('dvsa_pass_centre', 'DVSA centre tables')} and the ${h.src('dvsa_waits', 'monthly waiting table')} each month; the address and the list of nearby centres come from ${h.src('gov_find_centre', 'GOV.UK')}.</p>
`;
  },
});

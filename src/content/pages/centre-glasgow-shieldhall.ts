import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'glasgow-shieldhall';

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 646,
  tool: { kind: 'finder', props: { centre: ID, radius: 15 } },
  related: ['region-scotland', 'centre-glasgow-baillieston', 'hardest-driving-test-centres', 'pass-rate-by-age-and-sex', 'driving-test-cancellations'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'glasgow-shieldhall-driving-test-centre',
  nav: 'Glasgow (Shieldhall)',
  card: 'Shieldhall pass rate by age and sex, the queue and its three neighbours.',
  title: `Glasgow Shieldhall Driving Test Centre: Pass Rate ${YL}`,
  description: `Glasgow Shieldhall driving test centre: ${YL} car pass rate, results by age and sex, five years of tests, the wait and the three nearest centres compared.`,
  h1: 'Glasgow (Shieldhall) driving test centre: pass rate and wait',
  intro: 'Bogmoor Road, G51: a Glasgow centre for cars and motorcycles, with its results by age, its yearly record and the three centres DVSA lists nearby.',
  resume: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const gl = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Glasgow (')), 'rate');
    const pos = gl.findIndex((x) => x.id === ID) + 1;
    const gbMed = h.gb.wait?.[3];
    return `Shieldhall's ${Y} figures: ${h.num(c.tests)} car tests, ${h.num(c.passes)} passes, a rate of ${h.pc(c.rate)}. Scotland passed ${h.pc(c.regionRate)} and Great Britain ${h.pc(h.gb.rate)}, so the centre is ${c.rate! < (c.regionRate ?? 0) ? 'below' : 'above'} the Scottish rate and ${c.rate! < h.gb.rate ? 'below' : 'above'} the British one; among Scottish centres with at least 300 tests it ranks ${h.ord(c.rankRegion)} of ${c.ofRegion}, and among the ${gl.length} Glasgow centres ${pos === gl.length ? 'last' : h.ord(pos)}. ${(c.fem ?? 0) > (c.m ?? 0) ? `Women did better than men, ${h.pc(c.fem)} against ${h.pc(c.m)}.` : `Men did better than women, ${h.pc(c.m)} against ${h.pc(c.fem)}.`} ${c.wait ? `The median gap between booking and test in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}${c.waitYearAgo != null ? `, against ${h.wk(c.waitYearAgo)} in the same month of the previous year` : ''}; the British median was ${h.wk(gbMed)}, and ${h.pp(c.wait.in7)} of Shieldhall candidates had booked inside seven weeks.` : 'DVSA published no recent wait for Shieldhall.'} The sections below look at results by age, at the five-year record, at the queue and at the three alternatives DVSA allows.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const pa = c.near.find((n) => n.id === 'paisley');
    return [
      { q: 'Is Shieldhall a hard driving test centre?', a: `Its ${Y} pass rate of ${h.pc(c.rate)} put it ${h.ord(c.rankGB)} of ${c.ofGB} British centres with at least 1,000 tests, counting from the highest, ${c.rankGB > c.ofGB * 0.8 ? 'among the lowest fifth' : c.rankGB > c.ofGB / 2 ? 'in the lower half' : 'in the upper half'}. A low centre rate describes the results of all its candidates over a year; it does not mean the test itself is set differently.` },
      { q: 'Is Paisley a better choice than Shieldhall?', a: pa ? `Paisley, ${h.num(pa.miles)} miles away and on Shieldhall's DVSA list, passed ${h.pp(pa.rate)} in ${Y} against ${h.pc(c.rate)} here. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(pa.wait)}, against ${h.wk(c.wait?.median)} at Shieldhall. A test can be moved there using one of the ${h.P.rules.changesAllowed} changes allowed.` : `Paisley is not on the current DVSA list of nearest centres for Shieldhall, so a booking cannot be moved there. The three listed centres are in the table on this page.` },
      { q: 'How many Shieldhall tests were cancelled for bad weather?', a: c.cancel ? `${h.num(c.cancel.weather)} in ${Y}, out of ${h.num(c.cancel.total)} examiner-side cancellations; ${h.num(c.cancel.medical)} were for illness and ${h.num(c.cancel.leave)} for leave or training. Weather therefore accounted for ${h.pc(c.cancel.weather / Math.max(1, c.cancel.total), 0)} of the cancellations. DVSA rebooks each cancelled candidate, so every one of these cancellations also adds a test to the queue described on this page.` : `DVSA did not publish cancellation figures for Shieldhall in ${Y}.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const Y = h.yearLabel(h.lastYear);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const worst = ages.reduce((a, k) => ((c.age[k] ?? 1) < (c.age[a] ?? 1) ? k : a), ages[0]);
    const gaps = ages.map((k) => ({ k, d: ((c.age[k] ?? 0) - (h.E.ageRate(Number(k)) ?? 0)) * 100 }));
    const widest = gaps.reduce((a, x) => (x.d < a.d ? x : a), gaps[0]);
    const ys = c.years;
    const busiest = ys.reduce((a, y) => (c.f.pass[y][0] > c.f.pass[a][0] ? y : a), ys[0]);
    const low = ys.reduce((a, y) => ((c.rateOf(y) ?? 1) < (c.rateOf(a) ?? 1) ? y : a), ys[0]);
    const gl = h.E.sorted(h.E.CENTRES.filter((x) => x.n.startsWith('Glasgow (')), 'rate');
    const higher = c.near.filter((n) => n.rate != null && (n.rate as number) > c.rate! * 100);
    const months = h.F.months(c.f).slice(-12);
    const first = c.f.wait[months[0]][0];
    return `
<h2>Age by age</h2>
<p>The weakest age at Shieldhall in ${Y} was ${worst}, at ${h.pc(c.age[worst])}. Compared with the national rate for each age, the ${widest.d < 0 ? 'widest shortfall' : 'smallest lead'} was at age ${widest.k}, ${h.num(Math.abs(Math.round(widest.d * 10) / 10))} points ${widest.d < 0 ? 'below' : 'above'}. Seventeen-year-olds passed ${h.pc(c.age['17'])} against ${h.pc(h.E.ageRate(17))} nationally. Each age rests on a few hundred tests, so any single gap carries noise; taken together, ${gaps.filter((x) => x.d < 0).length === gaps.length ? `all ${gaps.length}` : `${gaps.filter((x) => x.d < 0).length} of the ${gaps.length}`} ages sit below the national figure for that age. The ${h.a('pass-rate-by-age-and-sex', 'age and sex page')} has the national detail.</p>
${h.ageTable(ID)}
<h2>Five years of Shieldhall results</h2>
<p>The busiest year was ${h.yearLabel(busiest)}, with ${h.num(c.f.pass[busiest][0])} tests, and the weakest ${h.yearLabel(low)}, at ${h.pc(c.rateOf(low))}. Across the series the rate stayed ${ys.every((y) => (c.rateOf(y) ?? 1) < h.E.gbRate(y)) ? 'below the British rate in every year' : 'close to or above the British rate in at least one year'}. First-time candidates passed ${h.pc(c.first)} in ${Y}, against ${h.pc(h.gb.first)} nationally, and ${h.num(c.zero)} of them did so without a single fault. ${c.auto != null ? `Automatic candidates passed ${h.pc(c.auto)}, manual ones ${h.pp(c.l.mn)}.` : ''}</p>
${h.yearTable(ID)}
<h2>Shieldhall and the other Glasgow centres</h2>
<p>DVSA has ${gl.length} centres with Glasgow in their name. In ${Y} ${h.cl(gl[0].id, gl[0].n)} had the highest rate of them at ${h.pp(h.E.rate(gl[0]))}, while Shieldhall recorded ${h.pc(c.rate)}. ${gl.map((x) => `${x.n.replace('Glasgow (', '').replace(')', '')} ran ${h.num(x.t)} tests`).join(', ')}. ${c.near.some((n) => n.id === 'glasgow-baillieston') ? 'Baillieston is on Shieldhall\'s list of nearest centres.' : 'Baillieston is not on Shieldhall\'s list of nearest centres, so a test booked here cannot be moved there.'}</p>
<h2>The queue over twelve months</h2>
<p>${c.wait && first != null ? `At the start of the twelve months in the DVSA table, in ${h.month(months[0])}, the median wait was ${h.wk(first)}; in ${h.month(c.wait.month)} it was ${h.wk(c.wait.median)}, ${(c.wait.median ?? 0) > first ? 'longer' : 'shorter'} than at the start of the period. The first tenth of tests in the latest month had been booked ${h.wk(c.wait.w10)} ahead, and ${h.pp(c.wait.in7)} of candidates had booked within seven weeks, against ${h.pp(h.gb.wait?.[4])} across Great Britain. ${c.cancel ? `Examiners cancelled ${h.num(c.cancel.total)} Shieldhall tests in ${Y}, ${h.num(c.cancel.weather)} for weather; the ${h.a('driving-test-cancellations', 'cancellations page')} compares centres.` : ''}` : 'DVSA has not published recent waits for Shieldhall.'}</p>
<h2>${c.near.map((n) => n.name.replace('Glasgow (', '').replace(')', '')).join(', ')}</h2>
<p>DVSA's nearest centres for Shieldhall are ${c.near.map((n) => `${n.id ? h.cl(n.id, n.name) : n.name} at ${h.num(n.miles)} miles`).join(', ')}. ${higher.length === c.near.length ? `All three passed more of their candidates than Shieldhall in ${Y}` : higher.length === 0 ? `None of them passed more of their candidates than Shieldhall in ${Y}` : `${higher.length === 1 ? 'One' : 'Two'} of them passed more of their candidates than Shieldhall in ${Y}`}. Their waits in ${h.month(h.lastMonth)} are in the table; compare both columns before moving a test. GOV.UK lists these tests at Shieldhall: ${c.types}${c.notes.length ? `, with this note: "${c.notes[0]}"` : '.'}</p>
${h.nearTable(ID)}
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK centre finder')} and ${h.src('gov_nearest', 'DVSA nearest centres')}.</p>
`;
  },
});

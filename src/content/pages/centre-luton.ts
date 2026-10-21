import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'luton';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 619,
  tool: { kind: 'finder', props: { centre: ID, radius: 16 } },
  related: ['region-east-of-england', 'hardest-driving-test-centres', 'first-time-pass-rates', 'theory-test-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'luton-driving-test-centre',
  nav: 'Luton',
  card: 'Luton LU1: pass rate and regional rank, first-time results, theory and nearby centres.',
  title: `Luton Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Luton driving test centre, LU1: DVSA car pass rate for ${YL}, its East of England rank, first-time results, the latest wait and St Albans or Stevenage.`,
  h1: 'Luton driving test centre: pass rate, rank and waiting time',
  intro: 'Adelaide Street, LU1: a Bedfordshire car centre ranked within the East of England and set against St Albans, Stevenage and Leighton Buzzard.',
  resume: (h) => {
    const c = h.C(ID);
    const last = c.rankRegion === c.ofRegion;
    return `${h.pc(c.rate)} of car practical tests at Luton ended in a pass in ${h.yearLabel(h.lastYear)}: ${h.num(c.passes)} from ${h.num(c.tests)}. Among the ${c.ofRegion} ${c.region} centres with at least 300 tests, ${last ? 'no centre had a lower rate' : `Luton ranked ${h.ord(c.rankRegion)}`}, and across Britain it placed ${h.ord(c.rankGB)} of ${h.num(c.ofGB)}. The regional rate was ${h.pc(c.regionRate)} and the British one ${h.pc(h.gb.rate)}. Over three years the centre's rate moved ${h.pts(c.trend3)}, from ${h.pp(c.l.p[0])}. ${c.wait ? `The wait is ${c.wait.median != null && c.wait.median < (c.regionWait?.[3] ?? 0) ? 'shorter than the regional one' : 'no shorter than the regional one'}: candidates tested in ${h.month(c.wait.month)} had booked a median ${h.wk(c.wait.median)} ahead, beside ${h.wk(c.regionWait?.[3])} for the ${c.region} and ${h.wk(h.gb.wait?.[3])} for Britain${c.waitYearAgo != null ? `, and ${h.wk(c.waitYearAgo)} at Luton a year earlier` : ''}.` : 'DVSA has not published a recent wait for Luton.'} A low rate is a description of past candidates as a group, not of the marking: DVSA applies one standard at every centre. The figures are reloaded monthly from DVSA, and the finder above compares Luton with every centre around LU1.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'luton');
    const better = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100);
    return [
      { q: 'Is Luton the hardest driving test centre in the East of England?', a: `On ${h.yearLabel(h.lastYear)} figures Luton ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} ${c.region} centres with at least 300 tests${c.rankRegion === c.ofRegion ? ', the lowest rate in the region' : ''}, at ${h.pc(c.rate)} against a regional ${h.pc(c.regionRate)}. A rate reflects the candidates who tested there; it does not mean examiners mark differently.` },
      { q: 'What is the theory test pass rate at Luton?', a: `${th ? `DVSA lists a Luton theory test centre with a ${h.yearLabel(h.lastYear)} pass rate of ${h.pc(h.E.theoryRate(th))}, against ${h.pc(h.gb.theory)} across Britain, so it was ${(h.E.theoryRate(th) ?? 0) < h.gb.theory ? 'below' : 'at or above'} the national theory rate.` : 'DVSA does not list a Luton theory centre in its latest table.'} The theory test costs £${h.num(h.P.fees.theory)} and must be passed before the practical test can be booked on GOV.UK.` },
      { q: 'Where can I move a Luton driving test?', a: `Only to the three centres DVSA lists as nearest: ${c.near.map((n) => `${short(n.name)} (${h.num(n.miles)} miles, ${h.pp(n.rate)})`).join(', ')}. ${better.length ? `${better.length === c.near.length ? 'All three' : better.map((n) => short(n.name)).join(' and ')} had a higher ${h.yearLabel(h.lastYear)} rate than Luton.` : 'None had a higher rate than Luton.'} Each move uses one of the ${h.num(h.P.rules.changesAllowed)} changes per booking.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const zr = c.zero / (c.firstTests || 1);
    const peak = ys.reduce((a, y) => (f.pass[y][0] > f.pass[a][0] ? y : a));
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    const worst = ages.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const within2 = h.E.withinAttempts(c.rate ?? 0, 2);
    const within2gb = h.E.withinAttempts(h.gb.rate, 2);
    return `
<h2>First attempts at Luton</h2>
<p>First-time candidates passed ${h.pc(c.first)} at Luton, against ${h.pc(h.gb.first)} across Britain; ${h.num(c.zero)} of the ${h.num(c.firstTests)} first attempts, ${h.pc(zr)}, were completed without a single fault, against ${h.pc(nf[2] / nf[0])} nationally. Using the national pattern of results by attempt, Luton's overall rate implies that roughly ${h.pc(within2, 0)} of candidates would pass within two attempts, against ${h.pc(within2gb, 0)} at a centre on the British average. That is an estimate built from DVSA's national tables, not a published DVSA figure. The ${h.a('first-time-pass-rates', 'first-time ranking')} covers every centre, and shows where Luton sits among the centres of its region.</p>
<h2>A caseload ${c.tests < f.pass[peak][0] * 0.8 ? 'well below its peak' : 'near its peak'}</h2>
<p>Luton's busiest year in the series was ${h.yearLabel(peak)}, with ${h.num(f.pass[peak][0])} car tests; the latest year counted ${h.num(c.tests)}. Its rate in those years was ${h.pc(c.rateOf(peak))} and ${h.pc(c.rate)}. DVSA does not say why a centre's caseload changes, and none is suggested here. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, against ${h.pc(h.gb.m)} and ${h.pc(h.gb.f)} nationally.</p>
${h.yearTable(ID)}
<h2>Which ages do best</h2>
<p>In the DVSA age table for Luton, ${best}-year-olds had the highest rate (${h.pc(c.age[best])}) and ${worst}-year-olds the lowest (${h.pc(c.age[worst])}). ${best !== '17' ? `Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} for that age nationally.` : ''} Every age group rests on a few hundred tests at most, so a gap of a few points between two neighbouring ages is within normal variation. Automatic cars took ${h.pc(c.autoShare, 0)} of tests and passed ${h.pc(c.auto)}, against ${h.pp(c.l.mn)} for manual cars.</p>
${h.ageTable(ID)}
<h2>${c.near.map((n) => short(n.name)).join(', ')}</h2>
<p>The three centres on Luton's DVSA list are ${c.near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles`).join(', ')}. Their ${h.yearLabel(h.lastYear)} rates were ${c.near.map((n) => `${h.pp(n.rate)} (${short(n.name)})`).join(', ')}, against ${h.pc(c.rate)} at Luton. ${quick ? `${short(quick.name)} had the shortest median wait of the three in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}.` : ''} Under the June 2026 rule, a Luton test can move only to one of these. ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} Luton tests in the latest year, ${h.num(c.cancel.medical)} through examiner illness.` : ''}</p>
${h.nearTable(ID)}
<p>${c.notes.length ? `GOV.UK note: "${c.notes.join(' ')}" ` : ''}The centre is at ${c.addr.join(', ')} and runs ${c.types} tests. The ${h.a('move-driving-test-centre', 'moving guide')} covers the booking rules.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')} and ${h.src('gov_find_centre', 'the GOV.UK finder')}.</p>
`;
  },
});

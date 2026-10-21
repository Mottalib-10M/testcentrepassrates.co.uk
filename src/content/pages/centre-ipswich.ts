import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'ipswich';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 624,
  tool: { kind: 'finder', props: { centre: ID, radius: 25 } },
  related: ['region-east-of-england', 'easiest-driving-test-centres', 'centre-norwich-peachman-way', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'dvsa_theory_centre', 'gov_find_centre', 'gov_nearest'],
  slug: 'ipswich-driving-test-centre',
  nav: 'Ipswich',
  card: 'Ipswich IP3: pass rate and rank, the wait, lorry and bus tests and three alternatives.',
  title: `Ipswich Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Ipswich driving test centre, Ransomes Europark IP3: DVSA car pass rate for ${YL}, its regional and national rank, the latest wait and Colchester or Clacton.`,
  h1: 'Ipswich driving test centre: pass rate, rank and wait',
  intro: 'Wentworth Road, Ransomes Europark, IP3: a Suffolk centre for cars, motorcycles, lorries and buses, compared with Colchester, Clacton-on-Sea and Bury St Edmunds.',
  resume: (h) => {
    const c = h.C(ID);
    const top = c.rankRegion === 1;
    return `${top ? `No centre in the ${c.region} with 300 tests or more recorded a higher car pass rate than Ipswich in ${h.yearLabel(h.lastYear)}` : `Ipswich ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} ${c.region} centres by car pass rate in ${h.yearLabel(h.lastYear)}`}: ${h.pc(c.rate)}, from ${h.num(c.passes)} passes in ${h.num(c.tests)} tests. Across Britain it placed ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} centres with at least a thousand tests. The regional rate was ${h.pc(c.regionRate)} and the national one ${h.pc(h.gb.rate)}. Over three years the Ipswich rate has moved ${h.pts(c.trend3)}. ${c.wait ? `The wait is ${c.wait.median != null && c.wait.median < (h.gb.wait?.[3] ?? 0) ? 'shorter than the British median as well' : 'not shorter than the British median'}: candidates tested in ${h.month(c.wait.month)} had booked a median ${h.wk(c.wait.median)} ahead, against ${h.wk(h.gb.wait?.[3])} for Britain and ${h.wk(c.regionWait?.[3])} for the ${c.region}${c.waitYearAgo != null ? `, and ${h.wk(c.waitYearAgo)} at Ipswich a year earlier` : ''}.` : 'DVSA has published no recent wait for Ipswich.'} A pass rate describes earlier candidates, not the marking, which follows one DVSA standard everywhere. The figures are refreshed each month, and the finder above sets Ipswich beside every centre around IP3.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const th = h.E.THEORY_CENTRES.find((x) => x.id === 'ipswich');
    return [
      { q: 'Can I take a lorry or bus test at Ipswich?', a: `${/lorry/.test(c.types) ? 'Yes.' : 'Not at present.'} GOV.UK lists Ipswich for ${c.types}. The pass rates on this page cover car practical tests only; DVSA publishes lorry, bus and motorcycle results in separate tables. Each test type is booked separately on GOV.UK.` },
      { q: 'Do women pass more than men at Ipswich?', a: `In ${h.yearLabel(h.lastYear)} women passed ${h.pc(c.fem)} of Ipswich car tests and men ${h.pc(c.m)}, so ${(c.fem ?? 0) > (c.m ?? 0) ? 'women were ahead' : 'men were level or ahead'}. Nationally men passed ${h.pc(h.gb.m)} and women ${h.pc(h.gb.f)}. A gap of ${h.pts(Math.abs(((c.fem ?? 0) - (c.m ?? 0)) * 100)).replace('+', '')} rests on a few thousand tests for each sex, and small gaps like this can reverse from one year to the next.` },
      { q: 'What is the theory test pass rate in Ipswich?', a: `${th ? `DVSA's Ipswich theory test centre passed ${h.pc(h.E.theoryRate(th))} of theory tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(h.gb.theory)} across Britain.` : 'DVSA does not list an Ipswich theory centre in its latest table.'} The theory test costs £${h.num(h.P.fees.theory)}, and the practical test at Ransomes Europark can be booked once it has been passed. The two rates describe different tests and cannot be combined.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const zr = c.zero / (c.firstTests || 1);
    const ms = h.F.months(f);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const under = vals.filter((v) => v < 12).length;
    const natShare = h.E.NATIONAL.auto[h.lastYear][0] / h.E.NATIONAL.practical[h.lastYear].t[0];
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    const worst = ages.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const lower = c.near.filter((n) => n.rate != null && n.rate < (c.rate ?? 0) * 100);
    const rising = ys.every((y, i) => i === 0 || f.pass[y][0] >= f.pass[ys[i - 1]][0]);
    return `
<h2>${under === vals.length ? 'A short queue throughout' : 'How the queue has moved'}</h2>
<p>In ${h.num(under)} of the ${h.num(vals.length)} months DVSA has published for Ipswich, the median wait was under 12 weeks; the range ran from ${h.wk(Math.min(...vals))} to ${h.wk(Math.max(...vals))}. ${c.wait ? `In ${h.month(c.wait.month)}, ${h.pp(c.wait.in7)} of candidates had booked within seven weeks, and the earliest tenth of slots had gone ${h.wk(c.wait.w10)} ahead, ${(c.wait.w10 ?? 0) < h.P.rules.releaseWeeksAhead - 1 ? `inside the ${h.P.rules.releaseWeeksAhead}-week release window, which suggests slots were not all taken on release` : `at the edge of the ${h.P.rules.releaseWeeksAhead}-week release window`}.` : ''} ${h.a('driving-test-waiting-times', 'Waiting times by centre')} compares Ipswich with the rest of Britain.</p>
${h.waitTable(ID, 12)}
<h2>First attempts and fault-free passes</h2>
<p>First-time candidates passed ${h.pc(c.first)} at Ipswich, against ${h.pc(h.gb.first)} across Britain. ${h.num(c.zero)} of them, ${h.pc(zr)} of all first attempts, drove a test with no fault recorded, against ${h.pc(nf[2] / nf[0])} nationally. By age, ${best}-year-olds did best (${h.pc(c.age[best])}) and ${worst}-year-olds least well (${h.pc(c.age[worst])}). The ${h.a('pass-rate-by-age-and-sex', 'national age and sex tables')} give the comparison.</p>
${h.ageTable(ID)}
<h2>${c.tests > f.pass[ys[0]][0] ? 'Five years of growth' : 'Five years of change'}</h2>
<p>Ipswich carried out ${h.num(f.pass[ys[0]][0])} car tests in ${h.yearLabel(ys[0])} and ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}${rising ? ', more in each year than the one before' : ''}. Its rate went from ${h.pc(c.rateOf(ys[0]))} to ${h.pc(c.rate)}; Britain's from ${h.pc(h.E.gbRate(ys[0]))} to ${h.pc(h.gb.rate)}. Automatic cars made up ${h.pc(c.autoShare, 0)} of tests, ${(c.autoShare ?? 0) < natShare ? 'below' : 'above'} the national ${h.pc(natShare, 0)}, and passed ${h.pc(c.auto)} against ${h.pp(c.l.mn)} for manual cars.</p>
${h.yearTable(ID)}
<h2>${c.near.map((n) => short(n.name)).join(', ')}</h2>
<p>These are the three centres DVSA lists as nearest to Ipswich: ${c.near.map((n) => `${fmt(n)}, ${h.num(n.miles)} miles away (${h.pp(n.rate)}, median wait ${h.wk(n.wait)})`).join('; ')}. ${lower.length === c.near.length ? 'Each recorded a lower pass rate than Ipswich in the latest year' : 'Not all of them recorded a lower pass rate than Ipswich in the latest year'}. Since 9 June 2026 a test booked here can move only to one of them, using one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows. ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} Ipswich tests in ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.weather)} of them for weather.` : ''}</p>
${h.nearTable(ID)}
<h2>More than cars</h2>
<p>GOV.UK lists Ipswich for ${c.types}. ${/lorry and bus/.test(c.types) ? 'That makes it one of the centres where lorry and bus drivers take their practical tests, alongside car candidates and riders.' : ''} None of those other results enter the car figures on this page, which come from DVSA's car practical tables alone. Men passed ${h.pc(c.m)} of car tests here and women ${h.pc(c.fem)}. ${(() => { const th = h.E.THEORY_CENTRES.find((x) => x.id === 'ipswich'); return th ? `The town's theory test centre passed ${h.pc(h.E.theoryRate(th))} of theory candidates in ${h.yearLabel(h.lastYear)}.` : ''; })()}</p>
<p>The centre is at ${c.addr.join(', ')}. Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('dvsa_theory_centre', 'DVSA theory results')} and ${h.src('gov_find_centre', 'the GOV.UK finder')}.</p>
`;
  },
});

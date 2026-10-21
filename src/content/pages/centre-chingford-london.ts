import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'chingford-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 606,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-wanstead-london', 'region-london', 'hardest-driving-test-centres', 'pass-rate-by-attempt', 'first-time-pass-rates', 'move-driving-test-centre'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'chingford-driving-test-centre',
  nav: 'Chingford',
  card: 'Chingford E4: a low pass rate in London, its recent trend and the nearby options.',
  title: `Chingford Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Chingford driving test centre, E4: DVSA car pass rate for ${YL}, its rank in London, first-time and no-fault results, the latest wait and Loughton or Enfield.`,
  h1: 'Chingford driving test centre: pass rate and waiting time',
  intro: 'Station Road, E4: a north-east London car centre with one of the lower pass rates in the capital, read against Loughton, Enfield and Wanstead.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    const last = c.rankRegion === c.ofRegion;
    return `Of the ${h.num(c.tests)} car tests taken at Chingford in ${h.yearLabel(h.lastYear)}, ${h.num(c.passes)} were passed: a rate of ${h.pc(c.rate)}, ${last ? 'the lowest' : `${h.ord(c.rankRegion)} of ${c.ofRegion}`} among London centres with at least 300 tests. Great Britain as a whole passed ${h.pc(h.gb.rate)} and London ${h.pc(c.regionRate)}, so Chingford trails ${c.rate! < h.gb.rate && c.rate! < (c.regionRate ?? 0) ? 'both' : 'at most one of them'}. On the national table of ${h.num(c.ofGB)} centres with a thousand tests or more it stands ${h.ord(c.rankGB)}. The three-year direction is ${t > 0 ? 'upward' : t < 0 ? 'downward' : 'flat'}: ${h.pts(t)} since ${h.pp(c.l.p[0])}. ${c.wait ? `As for the queue, candidates tested in ${h.month(c.wait.month)} had waited a median ${h.wk(c.wait.median)} since booking, against ${h.wk(h.gb.wait?.[3])} across Britain and ${h.wk(c.regionWait?.[3])} in London${c.waitYearAgo != null ? `, and ${h.wk(c.waitYearAgo)} at Chingford a year before` : ''}.` : 'No recent waiting figure has been published for Chingford.'} A lower rate here is a statement about past candidates as a group; it does not fix the odds of any single learner, and the sections below break it down by attempt, age and month.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const better = c.near.filter((n) => n.rate != null && n.rate > (c.rate ?? 0) * 100);
    return [
      { q: 'Is Chingford the hardest driving test centre in London?', a: `On ${h.yearLabel(h.lastYear)} figures it ranked ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres with at least 300 tests${c.rankRegion === c.ofRegion ? ', the lowest of them' : ''}, at ${h.pc(c.rate)}. Across Britain it ranked ${h.ord(c.rankGB)} of ${h.num(c.ofGB)}. "Hardest" is shorthand: a rate summarises the candidates who tested there, and DVSA applies one marking standard at every centre.` },
      { q: 'Can I move a Chingford test somewhere with a better pass rate?', a: `Only to a centre on the DVSA list: ${c.near.map((n) => `${short(n.name)} (${h.pp(n.rate)}, ${h.num(n.miles)} miles)`).join(', ')}. ${better.length ? `${better.length === c.near.length ? 'All of them' : better.map((n) => short(n.name)).join(' and ')} beat Chingford's ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}.` : `None of them beat Chingford's ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}.`} Each move takes one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows, so compare the waits as well before using one.` },
      { q: 'How many people pass first time at Chingford?', a: `${h.pc(c.first)} of first attempts at Chingford ended in a pass in ${h.yearLabel(h.lastYear)}, from ${h.num(c.firstTests)} first-time candidates; the national first-time rate was ${h.pc(h.gb.first)}. Only ${h.num(c.zero)} of those candidates drove a test with no fault at all, ${h.pc(c.zero / (c.firstTests || 1))} of first attempts. A fault-free drive is rare at any centre, so this is a demanding yardstick.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const zr = c.zero / (c.firstTests || 1);
    const nf = (h.E.NATIONAL.first as Record<string, number[]>)[h.lastYear];
    const gbZero = nf[2] / nf[0];
    const within3 = h.E.withinAttempts(c.rate ?? 0, 3);
    const within3gb = h.E.withinAttempts(h.gb.rate, 3);
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const above = ages.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0));
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    const t = c.trend3 ?? 0;
    return `
<h2>First attempts and clean sheets</h2>
<p>First attempts deserve a closer look at Chingford. ${h.pc(c.first)} of first-time candidates passed, ${(c.first ?? 0) < h.gb.first ? 'below' : 'not below'} the British first-time rate of ${h.pc(h.gb.first)}. The share who drove a test with no fault recorded was ${h.pc(zr)}, against ${h.pc(gbZero)} of all first attempts nationally. The ${h.a('first-time-pass-rates', 'first-time pass rates page')} ranks every centre on this measure.</p>
<p>A rough way to read a rate is to ask how many attempts it implies. Applying the national attempt profile to Chingford's rate gives about ${h.pc(within3, 0)} of candidates passed within three attempts, against ${h.pc(within3gb, 0)} at a centre with the British average rate. This is an estimate built on DVSA's national figures, not a DVSA statistic; the ${h.a('pass-rate-by-attempt', 'attempts page')} explains the method.</p>
<h2>Age makes ${above.length ? 'some' : 'little'} difference</h2>
<p>${above.length ? `${above.length === 1 ? 'one age group' : `${h.num(above.length)} age groups`} (${above.join(', ')}) passed more often at Chingford than the same age across Britain.` : 'No age group from 17 to 25 passed more often at Chingford than the same age across Britain.'} The strongest group was ${(() => { const b = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a)); return `${b}-year-olds, at ${h.pc(c.age[b])}`; })()}. ${ages.length < 9 ? 'The DVSA table has no row for at least one age between 17 and 25 at this centre, so that age is missing below.' : ''} Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, against ${h.pc(h.gb.m)} and ${h.pc(h.gb.f)} nationally.</p>
${h.ageTable(ID)}
<h2>${t > 0 ? 'Some recovery since' : 'No recovery since'} ${h.yearLabel(c.years[c.years.length - 3])}</h2>
<p>Chingford's rate went from ${h.pp(c.l.p[0])} to ${h.pp(c.l.p[2])} over the last three DVSA years, a change of ${h.pts(t)}, while ${h.num(c.tests)} tests were conducted in the latest one. ${c.wait ? `The median wait in ${h.month(c.wait.month)} was ${h.wk(c.wait.median)}, with ${h.pp(c.wait.in7)} of tests booked within seven weeks.` : ''} ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests over the year, mostly for examiner illness (${h.num(c.cancel.medical)}).` : ''}</p>
${h.waitTable(ID, 12)}
<h2>${c.near.map((n) => short(n.name)).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The DVSA list for Chingford names ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles, ${h.pp(n.rate)})`).join(', ')}. ${quick ? `${short(quick.name)} had the shortest median wait of the three in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}.` : ''} Since 9 June 2026 a test can move only to these centres, and a move is worth weighing on both counts: the rate a centre has recorded and the date it can offer. ${h.a('hardest-driving-test-centres', 'The hardest centres list')} places Chingford among its peers across Britain, and the table below gives each alternative's latest wait beside its rate.</p>
${h.nearTable(ID)}
<p>The centre, at ${c.addr.join(', ')}, runs ${c.types} tests. Figures: ${h.src('dvsa_pass_centre', 'DVSA pass rates by test centre')} and ${h.src('dvsa_waits', 'DVSA waiting times')}; address and nearest centres from ${h.src('gov_find_centre', 'GOV.UK')}.</p>
`;
  },
});

import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'southall-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 617,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-isleworth-fleming-way', 'region-london', 'first-time-pass-rates', 'driving-test-waiting-times', 'pass-rate-by-age-and-sex'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'southall-driving-test-centre',
  nav: 'Southall',
  card: 'Southall UB1: car pass rate, how fast tests can be booked and Yeading nearby.',
  title: `Southall Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Southall driving test centre on Allenby Road, UB1: DVSA car pass rate for ${YL}, the latest wait, first-time results and Yeading, Greenford or Isleworth.`,
  h1: 'Southall driving test centre: pass rate and waiting time',
  intro: 'Allenby Road, UB1: a west London car-only centre, set beside Yeading, Greenford and Isleworth on rate and on wait.',
  resume: (h) => {
    const c = h.C(ID);
    const w = c.wait;
    const fast = w?.median != null && w.median < (h.gb.wait?.[3] ?? 0);
    return `Southall is ${fast ? 'one of the London centres where a test can currently be had without a long wait' : 'a centre where the current wait is worth checking before booking'}. ${w ? `Candidates tested there in ${h.month(w.month)} had booked a median ${h.wk(w.median)} beforehand, against ${h.wk(h.gb.wait?.[3])} across Great Britain and ${h.wk(c.regionWait?.[3])} across London${c.waitYearAgo != null ? `; twelve months earlier Southall's own median was ${h.wk(c.waitYearAgo)}` : ''}. ` : 'DVSA has not published a recent wait for it. '}Its pass rate for car tests in ${h.yearLabel(h.lastYear)} was ${h.pc(c.rate)}, from ${h.num(c.passes)} passes in ${h.num(c.tests)} tests. That is ${c.rate! < h.gb.rate ? 'below' : 'at or above'} the British figure of ${h.pc(h.gb.rate)} and ${c.rate! < (c.regionRate ?? 0) ? 'below' : 'at or above'} London's ${h.pc(c.regionRate)}, ranking ${h.ord(c.rankRegion)} of the ${c.ofRegion} London centres with at least 300 tests. Over three years the rate has moved ${h.pts(c.trend3)}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} across Britain. Both figures are reloaded every month from DVSA, and the finder above puts Southall beside every centre within reach of UB1.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const y = c.near.find((n) => n.id === 'yeading-london');
    return [
      { q: 'Is Yeading better than Southall for a driving test?', a: `${y ? `Yeading, ${h.num(y.miles)} miles from Southall, passed ${h.pp(y.rate)} of car tests in ${h.yearLabel(h.lastYear)}, against ${h.pc(c.rate)} at Southall. Its median wait in ${h.month(h.lastMonth)} was ${h.wk(y.wait)}, against ${h.wk(c.wait?.median)}. ${(y.rate ?? 0) > (c.rate ?? 0) * 100 && (y.wait ?? 99) <= (c.wait?.median ?? 0) ? 'On those figures Yeading led on both counts.' : 'Neither centre led clearly on both counts.'}` : 'Yeading is not on the current DVSA list of centres nearest to Southall.'} Past rates describe earlier candidates, not your own chances.` },
      { q: 'How many people pass first time at Southall?', a: `${h.pc(c.first)} of first-time candidates passed at Southall in ${h.yearLabel(h.lastYear)}, from ${h.num(c.firstTests)} first attempts; across Britain the first-time rate was ${h.pc(h.gb.first)}. ${h.num(c.zero)} first-timers passed with no fault at all. The national rate by attempt shows how the odds change for those who try again.` },
      { q: 'What tests does Southall driving test centre run?', a: `GOV.UK lists Southall for ${c.types} tests only, at ${c.addr.join(', ')}. Motorcycle, lorry and bus candidates in west London are tested elsewhere. DVSA does not publish the routes its examiners use at Southall or anywhere else, and since 12 May 2026 only the learner can book.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const low = ys.reduce((a, y) => (f.pass[y][0] < f.pass[a][0] ? y : a));
    const ages = Object.keys(c.age).filter((k) => c.age[k] != null);
    const best = ages.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a));
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    const nat = h.E.NATIONAL;
    const natShare = nat.auto[h.lastYear][0] / nat.practical[h.lastYear].t[0];
    const ms = h.F.months(f).slice(-12);
    const vals = ms.map((k) => f.wait[k][0]).filter((x): x is number => x != null);
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const t = c.trend3 ?? 0;
    return `
<h2>Booking at Southall</h2>
<p>${vals.length ? `Over the last ${h.num(vals.length)} months the Southall median ranged from ${h.wk(Math.min(...vals))} to ${h.wk(Math.max(...vals))}.` : ''} ${c.wait ? `In ${h.month(c.wait.month)}, ${h.pp(c.wait.in7)} of candidates had booked less than seven weeks ahead, while the earliest tenth of that month's slots had gone ${h.wk(c.wait.w10)} in advance. Those two figures together suggest that some candidates booked late, on dates given back by others, while the first slots went soon after release.` : ''} New dates go on sale ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK. Since 12 May 2026 cancellation-finder apps can no longer book on a learner's behalf, so returned slots have to be found by the learner. The ${h.a('driving-test-waiting-times', 'waiting times page')} has the same figures for every centre.</p>
${h.waitTable(ID, 12)}
<h2>${t > 0 ? 'A rate on the way up' : 'The rate over three years'}</h2>
<p>Southall's rate was ${h.pp(c.l.p[0])} three years ago and ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}, a change of ${h.pts(t)}, while the British rate moved from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. The caseload has shifted too: the quietest year in the series was ${h.yearLabel(low)}, with ${h.num(f.pass[low][0])} tests, and the latest counted ${h.num(c.tests)}. ${c.cancel ? `Over the latest year DVSA cancelled ${h.num(c.cancel.total)} tests, ${h.num(c.cancel.medical)} of them through examiner illness.` : ''}</p>
${h.yearTable(ID)}
<h2>First attempts, ages and gearbox</h2>
<p>First-time candidates passed ${h.pc(c.first)}, ${(c.first ?? 0) < h.gb.first ? 'below' : 'at or above'} the national ${h.pc(h.gb.first)}; the ${h.a('first-time-pass-rates', 'first-time pass rates page')} ranks every centre on that figure. By age, ${best}-year-olds did best at ${h.pc(c.age[best])}${best !== '17' ? `, ahead even of seventeen-year-olds at ${h.pc(c.age['17'])}` : ''}. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, a gap of ${h.pts(Math.abs(gap)).replace('+', '')} in favour of ${gap >= 0 ? 'men' : 'women'}. Automatic cars made up ${h.pc(c.autoShare, 0)} of tests here, against ${h.pc(natShare, 0)} nationally, and passed ${h.pc(c.auto)}.</p>
${h.ageTable(ID)}
<h2>${c.near.map((n) => short(n.name)).join(', ').replace(/, ([^,]*)$/, ' and $1')}</h2>
<p>The DVSA list of centres nearest to Southall is ${c.near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles (${h.pp(n.rate)}, median ${h.wk(n.wait)})`).join('; ')}. Since 9 June 2026 a Southall test can move only to one of them. ${(() => { const both = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100 && n.wait != null && c.wait?.median != null && n.wait <= c.wait.median); return both.length ? `${both.map((n) => short(n.name)).join(' and ')} combined a higher rate with a wait no longer than Southall's in the latest figures.` : 'None combined a higher rate with a wait no longer than Southall\'s in the latest figures.'; })()} Each move uses one of the ${h.num(h.P.rules.changesAllowed)} changes allowed on a booking.</p>
${h.nearTable(ID)}
<p>The centre sits at ${c.addr.join(', ')} and GOV.UK lists it for ${c.types} tests${c.types === 'car' ? ' only' : ''}. For a learner who does not pass first time, the national figures by attempt are a useful guide: across Britain, second attempts passed ${h.pc(h.E.attemptRate(2))} and third attempts ${h.pc(h.E.attemptRate(3))}, against ${h.pc(h.E.attemptRate(1))} for first attempts. The ${h.a('pass-rate-by-attempt', 'attempts page')} explains how those odds build up.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA monthly waiting times')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

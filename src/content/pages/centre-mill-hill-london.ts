import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'mill-hill-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 613,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-hendon-london', 'centre-barnet-london', 'region-london', 'automatic-driving-test-pass-rates', 'driving-test-pass-rates-by-year'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'mill-hill-driving-test-centre',
  nav: 'Mill Hill',
  card: 'Mill Hill NW7: three-year pass rate change, automatics, the wait and Hendon nearby.',
  title: `Mill Hill Driving Test Centre: Pass Rate ${YL}, Wait`,
  description: `Mill Hill driving test centre, Bunns Lane NW7: DVSA car pass rate for ${YL}, its three-year change, automatic results, the latest wait and Hendon or Barnet.`,
  h1: 'Mill Hill driving test centre: pass rate trend and wait',
  intro: 'Grannard Business Centre, NW7: a north London car centre close to Hendon, with its results followed year by year.',
  resume: (h) => {
    const c = h.C(ID);
    const t = c.trend3 ?? 0;
    return `Mill Hill's car pass rate ${t > 0 ? 'climbed' : t < 0 ? 'fell' : 'held'} from ${h.pp(c.l.p[0])} to ${h.pc(c.rate)} over the last three DVSA years, ${t === 0 ? 'no change at all' : `a movement of ${h.pts(t)}`}, ending ${h.yearLabel(h.lastYear)} with ${h.num(c.passes)} passes from ${h.num(c.tests)} tests. The latest rate is ${c.rate! > h.gb.rate ? 'above' : 'below'} Great Britain's ${h.pc(h.gb.rate)} and ${c.rate! > (c.regionRate ?? 0) ? 'above' : 'below'} the London rate of ${h.pc(c.regionRate)}, and the centre ranks ${h.ord(c.rankRegion)} of ${c.ofRegion} in London and ${h.ord(c.rankGB)} of ${h.num(c.ofGB)} in Britain. ${c.wait ? `For the wait, DVSA's ${h.month(c.wait.month)} figure is a median of ${h.wk(c.wait.median)} between booking and test, beside ${h.wk(h.gb.wait?.[3])} nationally and ${h.wk(c.regionWait?.[3])} in London${c.waitYearAgo != null ? `; a year before, Mill Hill's median was ${h.wk(c.waitYearAgo)}` : ''}.` : 'DVSA has published no recent wait for Mill Hill.'} ${(() => { const hd = c.near.find((n) => n.id === 'hendon-london'); return hd ? `Hendon, ${h.num(hd.miles)} miles away, is the obvious comparison, and it appears in the table of permitted moves further down.` : 'The table of permitted moves further down sets Mill Hill beside its three DVSA alternatives.'; })()} Automatic cars made up ${h.pc(c.autoShare, 0)} of its tests, and first-time candidates passed ${h.pc(c.first)}. All figures are reloaded from DVSA every month.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const hd = h.C('hendon-london');
    return [
      { q: 'Is Mill Hill easier than Hendon for a driving test?', a: `In ${h.yearLabel(h.lastYear)} Mill Hill passed ${h.pc(c.rate)} and Hendon ${h.pc(hd.rate)}, so ${(c.rate ?? 0) > (hd.rate ?? 0) ? 'Mill Hill was ahead' : (c.rate ?? 0) < (hd.rate ?? 0) ? 'Hendon was ahead' : 'the two were level'}, ${h.pts(Math.abs(((c.rate ?? 0) - (hd.rate ?? 0)) * 100)).replace('+', '')} apart. In ${h.month(h.lastMonth)} the median wait was ${h.wk(c.wait?.median)} at Mill Hill and ${h.wk(hd.wait?.median)} at Hendon. ${c.near.some((n) => n.id === 'hendon-london') && hd.near.some((n) => n.id === ID) ? 'Each is on the other\'s DVSA list of nearest centres, so a test can be moved either way.' : 'Check the DVSA list of nearest centres before planning a move between them.'}` },
      { q: 'How did the Mill Hill pass rate change in recent years?', a: `DVSA's yearly tables give Mill Hill ${c.years.map((y) => `${h.pc(c.rateOf(y))} in ${h.yearLabel(y)}`).join(', ')}. Britain's rate in the latest year was ${h.pc(h.gb.rate)}. The table on this page adds the number of tests behind each year.` },
      { q: 'Do automatic cars pass as often as manuals at Mill Hill?', a: `In ${h.yearLabel(h.lastYear)} automatic candidates at Mill Hill passed ${h.pc(c.auto)} and manual candidates ${h.pp(c.l.mn)}, a gap of ${h.pts(Math.abs((c.l.mn ?? 0) - (c.auto ?? 0) * 100)).replace('+', '')}. Nationally automatics passed ${h.pc(h.gb.auto)}. ${h.pc(c.autoShare, 0)} of Mill Hill's tests were in automatic cars, and an automatic pass covers automatic cars only, whatever the odds on the day.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const gbChange = (h.gb.rate - (h.E.gbRate(ys[ys.length - 3]) ?? 0)) * 100;
    const t = c.trend3 ?? 0;
    const nat = h.E.NATIONAL;
    const natShare = nat.auto[h.lastYear][0] / nat.practical[h.lastYear].t[0];
    const ms = h.F.months(f).slice(-12);
    const lo = ms.filter((k) => f.wait[k][0] != null).reduce((a, k) => ((f.wait[k][0] as number) < (f.wait[a][0] as number) ? k : a), ms[ms.length - 1]);
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const quick = c.near.filter((n) => n.wait != null).sort((a, b) => (a.wait as number) - (b.wait as number))[0];
    return `
<h2>${t > gbChange ? 'Faster progress than the national rate' : 'Progress against the national rate'}</h2>
<p>Over three years Mill Hill's rate moved ${h.pts(t)}; Britain's moved ${h.pts(Math.round(gbChange * 10) / 10)} over the same period, from ${h.pc(h.E.gbRate(ys[ys.length - 3]))} to ${h.pc(h.gb.rate)}. ${t > gbChange ? 'The centre therefore gained ground on the national figure.' : 'The centre therefore did not gain ground on the national figure.'} The number of candidates changed too: ${h.num(f.pass[ys[ys.length - 2]][0])} tests in ${h.yearLabel(ys[ys.length - 2])}, ${h.num(c.tests)} in ${h.yearLabel(h.lastYear)}. A centre's rate can move for reasons the data does not record, such as a different mix of candidates; ${h.a('driving-test-pass-rates-by-year', 'the national series by year')} gives the wider context.</p>
${h.yearTable(ID)}
<h2>${(c.autoShare ?? 0) > 0.5 ? 'More automatics than manuals' : 'The automatic share'}</h2>
<p>${h.pc(c.autoShare, 0)} of tests at Mill Hill were taken in automatic cars, against ${h.pc(natShare, 0)} nationally. Automatic candidates passed ${h.pc(c.auto)} and manual candidates ${h.pp(c.l.mn)}. ${Math.abs((c.l.mn ?? 0) - (c.auto ?? 0) * 100) < 3 ? `That is a narrow gap: across Britain manuals passed ${h.pc((nat.practical[h.lastYear].t[1] - nat.auto[h.lastYear][1]) / (nat.practical[h.lastYear].t[0] - nat.auto[h.lastYear][0]))} and automatics ${h.pc(h.gb.auto)}.` : 'Manuals and automatics differ here by more than a couple of points.'} ${h.a('automatic-driving-test-pass-rates', 'The automatic pass rates ranking')} puts every centre side by side.</p>
<h2>Results by age at Mill Hill</h2>
<p>${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const b = ks.reduce((a, k) => ((c.age[k] as number) > (c.age[a] as number) ? k : a)); const w = ks.reduce((a, k) => ((c.age[k] as number) < (c.age[a] as number) ? k : a)); const up = ks.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0)); return `Among candidates aged 17 to 25 at Mill Hill, ${b}-year-olds had the best rate, ${h.pc(c.age[b])}, and ${w}-year-olds the weakest, ${h.pc(c.age[w])}. ${up.length ? `${h.num(up.length)} of the ${h.num(ks.length)} ages shown beat the national rate for the same age.` : 'No age shown beat the national rate for the same age.'}`; })()} Each age band holds a few hundred tests, so neighbouring ages a point or two apart are effectively level. The national comparison column rests on far larger numbers and is the steadier guide.</p>
${h.ageTable(ID)}
<h2>When slots go</h2>
<p>${c.wait ? `The latest DVSA month gives a median of ${h.wk(c.wait.median)}, against a twelve-month low of ${h.wk(f.wait[lo][0])} in ${h.month(lo)}. The first tenth of the month's tests had been booked ${h.wk(c.wait.w10)} in advance, ${(c.wait.w10 ?? 0) < h.P.rules.releaseWeeksAhead - 1 ? `short of the ${h.P.rules.releaseWeeksAhead}-week release window, which suggests the earliest places were not all taken the moment they appeared` : `at the edge of the ${h.P.rules.releaseWeeksAhead}-week release window, so the earliest places went as soon as they appeared`}. ${h.pp(c.wait.in7)} of candidates had booked within seven weeks.` : 'No recent waiting data is published for Mill Hill.'} ${c.cancel ? `DVSA cancelled ${h.num(c.cancel.total)} tests in ${h.yearLabel(h.lastYear)}: ${h.num(c.cancel.medical)} for examiner illness and ${h.num(c.cancel.leave)} for leave or training.` : ''}</p>
${h.waitTable(ID, 12)}
<h2>${c.near.some((n) => n.id === 'hendon-london') ? 'Hendon and the other two' : 'The three DVSA alternatives'}</h2>
<p>DVSA lists ${c.near.map((n) => `${fmt(n)} (${h.num(n.miles)} miles)`).join(', ')} as Mill Hill's nearest centres, and a test booked here can move only to one of them. ${quick ? `${short(quick.name)} had the shortest median wait of the three in ${h.month(h.lastMonth)}, ${h.wk(quick.wait)}.` : ''} Their pass rates in ${h.yearLabel(h.lastYear)} were ${c.near.map((n) => `${h.pp(n.rate)} at ${short(n.name)}`).join(', ')}.</p>
${h.nearTable(ID)}
<p>The centre is at ${c.addr.join(', ')} and runs ${c.types} tests. Men passed ${h.pc(c.m)} and women ${h.pc(c.fem)}; first attempts ${h.pc(c.first)}. Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')}, ${h.src('gov_find_centre', 'GOV.UK centre finder')}.</p>
`;
  },
});

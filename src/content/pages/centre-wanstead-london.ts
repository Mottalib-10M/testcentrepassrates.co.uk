import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

const ID = 'wanstead-london';
const short = (n: string) => n.replace(/ \(.*\)$/, '');

export default definePage({
  id: `centre-${ID}`,
  group: 'centres',
  order: 615,
  tool: { kind: 'finder', props: { centre: ID, radius: 7 } },
  related: ['centre-chingford-london', 'centre-goodmayes-london', 'region-london', 'driving-test-cancellations', 'compare-driving-test-centres'],
  sources: ['dvsa_pass_centre', 'dvsa_waits', 'gov_find_centre', 'gov_nearest'],
  slug: 'wanstead-driving-test-centre',
  nav: 'Wanstead',
  card: 'Wanstead E11: the latest-year pass rate, cancellation causes and the queue.',
  title: `Wanstead Driving Test Centre: Pass Rate ${YL} and Wait`,
  description: `Wanstead driving test centre, E11: DVSA car pass rate for ${YL}, the change on last year, why DVSA cancelled tests, the wait and Chingford or Loughton.`,
  h1: 'Wanstead driving test centre: pass rate and waiting time',
  intro: 'Hermon Hill, E11: an east London car centre, with Chingford, Loughton and Goodmayes as its DVSA alternatives.',
  resume: (h) => {
    const c = h.C(ID);
    const ys = c.years;
    const prev = c.rateOf(ys[ys.length - 2]) ?? 0;
    const d = ((c.rate ?? 0) - prev) * 100;
    return `In ${h.yearLabel(h.lastYear)}, ${h.num(c.passes)} of the ${h.num(c.tests)} car tests at Wanstead were passed, ${h.pc(c.rate)} in all, ${d >= 0 ? 'up' : 'down'} ${h.pts(Math.abs(d)).replace('+', '')} on the ${h.pc(prev)} of ${h.yearLabel(ys[ys.length - 2])}. The British rate was ${h.pc(h.gb.rate)} and the London rate ${h.pc(c.regionRate)}, so Wanstead remains ${c.rate! < h.gb.rate ? 'below' : 'at or above'} the national figure and ranks ${h.ord(c.rankRegion)} of ${c.ofRegion} London centres with 300 tests or more. Measured over three years, the change is ${h.pts(c.trend3)}. ${c.wait ? `The DVSA waiting table for ${h.month(c.wait.month)} shows a median of ${h.wk(c.wait.median)} from booking to test${c.waitYearAgo != null ? `, ${c.wait.median != null && c.wait.median < c.waitYearAgo ? 'shorter' : 'longer'} than the ${h.wk(c.waitYearAgo)} of a year earlier` : ''}, beside ${h.wk(h.gb.wait?.[3])} across Britain and ${h.wk(c.regionWait?.[3])} across London.` : 'DVSA has not published a recent wait for Wanstead.'} With ${h.num(c.tests)} tests a year, Wanstead is ${c.tests < 10000 ? 'smaller than many London centres' : 'one of the larger London centres'}, so its yearly rate is a little more exposed to chance than the rate of the very largest centres. Every figure is reloaded from DVSA monthly.`;
  },
  faqs: (h) => {
    const c = h.C(ID);
    const ch = c.near.find((n) => n.id === 'chingford-london');
    const lo = c.near.find((n) => n.id === 'loughton-london');
    return [
      { q: 'Is Wanstead easier than Chingford?', a: `${ch ? `On ${h.yearLabel(h.lastYear)} figures, Wanstead passed ${h.pc(c.rate)} and Chingford, ${h.num(ch.miles)} miles away, ${h.pp(ch.rate)}, so ${(c.rate ?? 0) * 100 > (ch.rate ?? 0) ? 'Wanstead was ahead' : 'Chingford was ahead'}. Their median waits in ${h.month(h.lastMonth)} were ${h.wk(c.wait?.median)} and ${h.wk(ch.wait)}.` : 'Chingford is not on the current DVSA list of centres nearest to Wanstead.'} A higher past rate does not change the standard: every test is marked to the same DVSA rules.` },
      { q: 'Would moving my Wanstead test to Loughton help?', a: `${lo ? `Loughton passed ${h.pp(lo.rate)} in ${h.yearLabel(h.lastYear)}, against ${h.pc(c.rate)} at Wanstead, but its median wait in ${h.month(h.lastMonth)} was ${h.wk(lo.wait)} against ${h.wk(c.wait?.median)}. ${(lo.rate ?? 0) > (c.rate ?? 0) * 100 && (lo.wait ?? 0) > (c.wait?.median ?? 0) ? 'A better record, then, but a later date.' : 'Compare both figures before deciding.'}` : 'Loughton is no longer on the DVSA list for Wanstead, so the move is not available.'} A move uses one of the ${h.num(h.P.rules.changesAllowed)} changes a booking allows.` },
      { q: 'What causes DVSA cancellations at Wanstead?', a: `${c.cancel ? `Of ${h.num(c.cancel.total)} Wanstead tests cancelled by DVSA in ${h.yearLabel(h.lastYear)}, ${h.num(c.cancel.medical)} were for examiner illness, ${h.num(c.cancel.leave)} for leave or training and ${h.num(c.cancel.weather)} for weather. The candidate is offered a new date and does not pay again.` : 'DVSA has not published Wanstead cancellation figures for the latest year.'} These counts exclude tests cancelled by candidates themselves.` },
    ];
  },
  body: (h) => {
    const c = h.C(ID);
    const f = c.f;
    const ys = c.years;
    const nat = (h.E.NATIONAL.cancel as Record<string, { total: number; medical: number }>)[h.lastYear];
    const medShare = c.cancel && c.cancel.total ? c.cancel.medical / c.cancel.total : null;
    const natMed = nat ? nat.medical / nat.total : null;
    const ms = h.F.months(f);
    const vals = ms.map((k) => ({ k, v: f.wait[k][0] })).filter((x): x is { k: string; v: number } => x.v != null);
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const lo = vals.reduce((a, b) => (b.v < a.v ? b : a), vals[0] ?? { k: h.lastMonth, v: 0 });
    const fmt = (n: (typeof c.near)[number]) => (n.id && h.E.hasCentre(n.id) ? h.cl(n.id, short(n.name)) : short(n.name));
    const higher = c.near.filter((n) => (n.rate ?? 0) > (c.rate ?? 0) * 100);
    const lower = c.near.filter((n) => n.rate != null && n.rate <= (c.rate ?? 0) * 100);
    const gap = ((c.m ?? 0) - (c.fem ?? 0)) * 100;
    return `
<h2>The latest year against the four before</h2>
<p>Wanstead's five DVSA years run from ${h.pc(c.rateOf(ys[0]))} in ${h.yearLabel(ys[0])} to ${h.pc(c.rate)} in ${h.yearLabel(h.lastYear)}. The best year in the series was ${(() => { const b = ys.reduce((a, y) => ((c.rateOf(y) ?? 0) > (c.rateOf(a) ?? 0) ? y : a)); return `${h.yearLabel(b)}, at ${h.pc(c.rateOf(b))}`; })()}. Test numbers stayed between ${h.num(Math.min(...ys.map((y) => f.pass[y][0])))} and ${h.num(Math.max(...ys.map((y) => f.pass[y][0])))} a year. Read the series with the national column beside it, which shows how much of any movement was shared across Britain.</p>
${h.yearTable(ID)}
<h2>Why DVSA cancelled tests</h2>
<p>${c.cancel && medShare != null ? `DVSA called off ${h.num(c.cancel.total)} Wanstead tests in ${h.yearLabel(h.lastYear)}. Examiner illness accounted for ${h.num(c.cancel.medical)} of them, or ${h.pc(medShare, 0)}${natMed != null ? ` (the national share was ${h.pc(natMed, 0)})` : ''}. Leave or training explained ${h.num(c.cancel.leave)} and weather ${h.num(c.cancel.weather)}. Per hundred tests conducted that is about ${(Math.round((c.cancel.total / c.tests) * 1000) / 10).toFixed(1)}${nat ? `, against about ${(Math.round((nat.total / h.E.NATIONAL.practical[h.lastYear].t[0]) * 1000) / 10).toFixed(1)} across Britain` : ''}.` : 'DVSA has not published Wanstead cancellation figures for the latest year.'} The ${h.a('driving-test-cancellations', 'cancellations guide')} explains rebooking and expenses.</p>
<h2>Peaks in the queue</h2>
<p>${vals.length ? `Wanstead's median wait peaked at ${h.wk(hi.v)} in ${h.month(hi.k)} and bottomed at ${h.wk(lo.v)} in ${h.month(lo.k)} over the ${h.num(vals.length)} months published.` : ''} ${c.wait ? `The latest month stands at ${h.wk(c.wait.median)}; ${h.pp(c.wait.in7)} of candidates tested had booked inside seven weeks.` : ''} Dates are released ${h.P.rules.releaseWeeksAhead} weeks ahead on GOV.UK, and only the learner may book or change a test since 12 May 2026.</p>
${h.waitTable(ID, 12)}
<h2>${c.near.map((n) => short(n.name)).join(', ')}</h2>
<p>The DVSA list for Wanstead names ${c.near.map((n) => `${fmt(n)} at ${h.num(n.miles)} miles`).join(', ')}. ${higher.length ? `${higher.map((n) => `${short(n.name)} (${h.pp(n.rate)})`).join(' and ')} beat Wanstead's rate in ${h.yearLabel(h.lastYear)}` : `None beat Wanstead's rate in ${h.yearLabel(h.lastYear)}`}${lower.length ? `, while ${lower.map((n) => `${short(n.name)} (${h.pp(n.rate)})`).join(' and ')} did not` : ''}. Since 9 June 2026 a move can only go to one of these three, and each one uses up a change on the booking, so the wait column deserves as much attention as the rate. Their latest median waits were ${c.near.map((n) => `${h.wk(n.wait)} at ${short(n.name)}`).join(', ')}. To weigh centres side by side, the ${h.a('compare-driving-test-centres', 'comparison tool')} lines up any two.</p>
${h.nearTable(ID)}
<h2>Candidates by sex, age and attempt</h2>
<p>Men at Wanstead passed ${h.pc(c.m)} and women ${h.pc(c.fem)}, ${h.pts(Math.abs(gap)).replace('+', '')} apart, where the national gap was ${h.pts(Math.abs((h.gb.m - h.gb.f) * 100)).replace('+', '')}. First-time candidates passed ${h.pc(c.first)}, against ${h.pc(h.gb.first)} across Britain, and ${h.num(c.zero)} of them drove a test without a single fault. Seventeen-year-olds passed ${h.pc(c.age['17'])}, against ${h.pc(h.E.ageRate(17))} for that age nationally; ${(() => { const ks = Object.keys(c.age).filter((k) => c.age[k] != null); const up = ks.filter((k) => (c.age[k] as number) > (h.E.ageRate(Number(k)) ?? 0)); return up.length ? `${h.num(up.length)} of the ${h.num(ks.length)} ages in the table did better here than nationally` : 'no age in the table did better here than nationally'; })()}. In automatic cars, ${h.pc(c.autoShare, 0)} of tests, the rate was ${h.pc(c.auto)}.</p>
${h.ageTable(ID)}
<p> The centre, at ${c.addr.join(', ')}, runs ${c.types} tests.</p>
<p>Sources: ${h.src('dvsa_pass_centre', 'DVSA pass rates by centre')}, ${h.src('dvsa_waits', 'DVSA waiting times')} and ${h.src('gov_find_centre', 'the GOV.UK centre finder')}.</p>
`;
  },
});

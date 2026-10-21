import { definePage } from '../../lib/guide-types';
import { YL } from '../../lib/labels';

export default definePage({
  id: 'easiest-driving-test-centres',
  group: 'rates',
  order: 100,
  tool: { kind: 'finder', props: { q: 'SW1A', radius: 25, sort: 'rate' } },
  related: ['hardest-driving-test-centres', 'first-time-pass-rates', 'move-driving-test-centre', 'pass-rate-by-age-and-sex', 'driving-test-waiting-times'],
  sources: ['dvsa_pass_centre', 'dvsa_data', 'gov_nearest', 'gov_rules_2026'],
  slug: 'easiest-driving-test-centres',
  nav: 'Easiest test centres',
  card: 'The centres with the highest pass rates, overall and near any postcode.',
  title: `Easiest Driving Test Centres ${YL}: Highest Pass Rates`,
  description: `Easiest driving test centres in Britain for ${YL}: the highest DVSA pass rates among busy centres, the best centre near your postcode and what a rate hides.`,
  h1: 'Easiest driving test centres: the highest pass rates',
  intro: 'Type a postcode and a distance: the finder ranks every car test centre within reach by its latest pass rate.',
  resume: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate');
    const all = h.E.sorted(h.E.CENTRES.filter((c) => h.E.rate(c) != null), 'rate');
    return `The easiest driving test centre in Great Britain in ${h.yearLabel(h.lastYear)}, among centres with at least 1,000 car tests, was ${big[0].n}, where ${h.pp(h.E.rate(big[0]))} of ${h.num(big[0].t)} tests ended in a pass, against ${h.pc(h.gb.rate)} nationally. ${big[1].n} (${h.pp(h.E.rate(big[1]))}) and ${big[2].n} (${h.pp(h.E.rate(big[2]))}) came next. Counting every centre, the top of the list belongs to small island and Highland centres such as ${all[0].n}, where a handful of tests can give a rate of ${h.pp(h.E.rate(all[0]))}. Those figures move a lot from year to year and only serve candidates who live there. The finder above starts from central London and ranks the centres within 25 miles; change the postcode and the distance to find the highest rate within your own reach, with each centre's wait.`;
  },
  faqs: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate');
    const lon = h.E.sorted(h.E.inRegion('London').filter((c) => c.t >= 1000), 'rate');
    return [
      { q: 'What is the easiest driving test centre in the UK?', a: `On the DVSA figures for ${h.yearLabel(h.lastYear)}, ${big[0].n} had the highest pass rate of the busy centres, ${h.pp(h.E.rate(big[0]))}. Northern Ireland is run separately by the DVA and is not in these tables. "Easiest" only means the highest share of passes: the candidates, not just the roads, make that figure.` },
      { q: 'What is the easiest driving test centre in London?', a: `${lon[0].n}, with ${h.pp(h.E.rate(lon[0]))} of tests passed in ${h.yearLabel(h.lastYear)}, followed by ${lon[1].n} at ${h.pp(h.E.rate(lon[1]))}. The London average was ${h.pc(h.regionRate('London'))}. The London page lists all ${h.E.inRegion('London').length} centres of the capital with their waits, which differ far more than their pass rates.` },
      { q: 'Should I book my test at the centre with the highest pass rate?', a: 'Only if you can learn on its roads and get there easily on the day. A rate reflects the candidates who test there as much as the routes. Since 9 June 2026 a booked test can only move to the three centres nearest the one you chose, so a distant centre picked for its rate also limits where you can move later.' },
      { q: 'Why do island centres have such high pass rates?', a: 'They test very few people, often local candidates who have driven the same roads for months, on routes with little traffic. With fewer than a hundred tests a year, two or three results change the rate by several points. The finder hides centres under 300 tests from its headline unless you untick the box.' },
    ];
  },
  body: (h) => {
    const big = h.E.sorted(h.E.CENTRES.filter((c) => c.t >= 1000), 'rate');
    const top = big.slice(0, 20);
    const risers = [...big].filter((c) => h.E.trend(c) != null).sort((a, b) => (h.E.trend(b) as number) - (h.E.trend(a) as number)).slice(0, 5);
    const byRegion = h.E.REGIONS.map((r) => { const l = h.E.sorted(h.E.inRegion(r).filter((c) => c.t >= 1000), 'rate'); return l[0]; }).filter(Boolean);
    const regRates = h.E.REGIONS.map((r) => h.regionRate(r) ?? 0);
    const maxSpread = Math.max(...h.E.REGIONS.map((r) => { const v = h.E.inRegion(r).filter((c) => c.t >= 1000 && h.E.rate(c) != null).map((c) => h.E.rate(c) as number); return v.length ? Math.max(...v) - Math.min(...v) : 0; }));
    const fastTop = top.filter((c) => c.w != null && h.gb.wait && c.w < h.gb.wait[3]).length;
    return `
<h2>The twenty highest pass rates among busy centres</h2>
<p>A centre needs at least 1,000 tests in the year to appear here, about four a working day. Below that, a few results swing the rate too much to rank it fairly. Of these twenty, ${fastTop} also had a median wait shorter than the national ${h.wk(h.gb.wait?.[3])} in ${h.month(h.lastMonth)}: a high rate does not come with a short queue as a rule.</p>
${h.centreTable(top, `Centres with 1,000 tests or more, ${h.yearLabel(h.lastYear)}, by pass rate. Wait: median weeks, ${h.month(h.lastMonth)}.`)}
<h2>The best centre of each region</h2>
<p>Most learners compare centres within an hour of home, so a national ranking matters less than the best centre of their own area. The regional averages range from ${h.pc(Math.min(...regRates))} to ${h.pc(Math.max(...regRates))}, while inside a single region the busy centres can lie ${h.num(maxSpread)} points apart.</p>
${h.table(['Region', 'Centre', 'Pass rate', 'Region average'], byRegion.map((c) => [c.r, h.cl(c.id), h.pp(h.E.rate(c)), h.pc(h.regionRate(c.r))]), `Highest pass rate among centres with 1,000 tests or more, ${h.yearLabel(h.lastYear)}.`, ['l', 'l', 'r', 'r'])}
<h2>Centres that became easier</h2>
<p>A rate that climbs over three years says more than one good year. These five rose most between ${h.yearLabel(h.E.YEARS[0])} and ${h.yearLabel(h.lastYear)}: ${risers.map((c) => `${h.cl(c.id)} (${h.pts(h.E.trend(c))})`).join(', ')}. Over the same span the national rate moved from ${h.pc(h.E.gbRate(h.E.YEARS[0]))} to ${h.pc(h.gb.rate)}. DVSA does not say why a centre changes; new examiners, a move to new premises and a shift in who books there are all possible, and none is recorded in the tables.</p>
<h2>What makes a centre look easy</h2>
<p>Three things lift a pass rate, and only the last depends on the test centre. Age comes first: in ${h.yearLabel(h.lastYear)} candidates aged 17 passed ${h.pc(h.E.ageRate(17))} of their tests nationally, those aged 40 only ${h.pc(h.E.ageRate(40))}. Then the share of first attempts, which pass at ${h.pc(h.E.attemptRate(1))} against ${h.pc(h.E.attemptRate(6))} for sixth or later attempts. Then the roads: quieter routes with fewer multi-lane junctions leave fewer chances for a serious fault. Rural centres usually score on all three. The ${h.a('pass-rate-by-age-and-sex', 'age and sex estimate')} applies the first factor to any centre.</p>
<h2>Is it worth travelling to an easier centre?</h2>
<p>The 2026 rules make this a choice made once. A test can only be moved to one of the three centres DVSA lists as nearest the one booked (${h.src('gov_nearest', 'DVSA list')}), with ${h.P.rules.changesAllowed} changes per booking (${h.src('gov_rules_2026', '2026 booking rules')}). Booking far from home for a few points of pass rate means learning unfamiliar roads, paying an instructor to travel and giving up the centres around your home as fall-backs. For most learners the better trade is the nearest centre with a reasonable rate and a shorter wait: the ${h.a('move-driving-test-centre', 'moving a test page')} lists the three options of each centre, and the ${h.a('hardest-driving-test-centres', 'lowest pass rates page')} shows the other end of the table.</p>
<p>All rates are passes divided by tests conducted, from table DRT122A of the ${h.src('dvsa_pass_centre', 'DVSA centre statistics')}, re-read every month.</p>
`;
  },
});

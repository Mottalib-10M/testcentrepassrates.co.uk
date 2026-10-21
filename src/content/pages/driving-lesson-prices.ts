import { definePage } from '../../lib/guide-types';

const SLUG: Record<string, string> = {
  'South West': 'region-south-west', 'South East': 'region-south-east', Scotland: 'region-scotland', London: 'region-london',
  'East of England': 'region-east-of-england', 'North West': 'region-north-west', 'East Midlands': 'region-east-midlands', Wales: 'region-wales',
  'Yorkshire and The Humber': 'region-yorkshire-and-the-humber', 'West Midlands': 'region-west-midlands', 'North East': 'region-north-east',
};

export default definePage({
  id: 'driving-lesson-prices',
  group: 'costs',
  order: 410,
  tool: { kind: 'mini:cost', props: { centre: 'bristol-kingswood', hours: 30, price: 42 } },
  related: ['cost-of-learning-to-drive', 'compare-driving-test-centres', 'region-south-west', 'region-north-east', 'first-time-pass-rates'],
  sources: ['gov_adi_survey', 'gov_cost', 'dvsa_pass_centre', 'gov_rules_2026'],
  slug: 'driving-lesson-prices',
  nav: 'Lesson prices',
  card: 'What instructors charge for an hour, by region and since 2022, from DVSA\'s survey.',
  title: 'Driving Lesson Prices UK: What Instructors Charge by Region',
  description: 'Driving lesson prices in Britain from DVSA\'s 2025 survey of 3,342 instructors: the price bands for one hour, region by region, and how they rose since 2022.',
  h1: 'Driving lesson prices by region',
  intro: 'Put in the lesson price you have been quoted and the hours you expect: the calculator adds the fees and retests for your centre.',
  resume: (h) => {
    const S = h.P.adiSurvey;
    const R = Object.entries(S.regions).sort((a, b) => b[1][2] - a[1][2]);
    const H = S.history as Record<string, number[]>;
    const first = Object.keys(H)[0], last = Object.keys(H)[Object.keys(H).length - 1];
    return `The most common price of a one-hour driving lesson in Britain is £36 to £40, charged by ${h.num(S.bands[3].pc, 1)} % of the ${h.num(S.responses)} instructors who answered DVSA's survey in ${S.fieldwork}. A further ${h.num(S.bands[4].pc + S.bands[5].pc + S.bands[6].pc, 1)} % charged more than £40, and ${h.num(S.bands[0].pc + S.bands[1].pc + S.bands[2].pc, 1)} % £35 or less. Prices rose fast: in ${first}, ${h.num(H[first][0], 1)} % of instructors charged £35 or less; by ${last}, ${h.num(H[last][0], 1)} %. They differ by region too. In the ${R[0][0]}, ${h.num(R[0][1][2], 1)} % charged £41 or more; in the ${R[R.length - 1][0]}, ${h.num(R[R.length - 1][1][2], 1)} %. DVSA publishes bands, not an average price, so this site does not quote one. The bands describe what instructors say they charge for a standard hour; a pupil booking a block of lessons or an intensive course may pay a different rate. Set your own quote in the calculator above.`;
  },
  faqs: (h) => {
    const S = h.P.adiSurvey;
    const lon = S.regions.London;
    return [
      { q: 'How much is a driving lesson in the UK?', a: `Most instructors charge £36 to £40 for an hour, according to DVSA's survey of ${h.num(S.responses)} driving instructors in ${S.fieldwork}, published in February 2026. About a fifth charge £35 or less and over a quarter more than £40. The survey covers Great Britain and gives price bands, not a single average.` },
      { q: 'Are driving lessons more expensive in London?', a: `Not by the survey's measure. In London, ${h.num(lon[0], 1)} % of instructors charged £35 or less and ${h.num(lon[2], 1)} % £41 or more, a cheaper mix than the South West, the South East or Scotland. The survey does not give reasons for the regional differences, and regional answers carry a wider margin of error.` },
      { q: 'How reliable are the survey figures?', a: `DVSA says that with ${h.num(S.responses)} answers, the national results are within plus or minus ${h.num(S.marginPts, 1)} percentage points of the figures for all instructors, 99 times out of 100. Regional figures rest on fewer answers and carry a wider margin. The survey asks what instructors charge, not what pupils pay after block discounts.` },
    ];
  },
  body: (h) => {
    const S = h.P.adiSurvey;
    const H = S.history as Record<string, number[]>;
    const R = Object.entries(S.regions).sort((a, b) => b[1][2] - a[1][2]);
    const bands = S.bands.map((b) => [b.label, `${h.num(b.pc, 1)} %`]);
    const hist = Object.entries(H).map(([k, v]) => [k, ...v.map((x) => `${h.num(x, 1)} %`)]);
    const reg = R.map(([r, v]) => {
      const rr = h.regionRate(r);
      return [SLUG[r] ? h.a(SLUG[r], r) : r, ...v.map((x) => `${h.num(x, 1)} %`), rr == null ? 'n/a' : h.pc(rr)];
    });
    const cost = (p: number) => h.E.licenceCost({ hours: 30, price: p, passRate: h.gb.rate, theoryRate: h.gb.theory, evening: false, licence: 'online' }).total;
    return `
<h2>What one hour costs</h2>
${h.table(['Price of a one-hour lesson', 'Share of instructors'], bands, `DVSA, Working as a driving instructor survey, ${S.fieldwork}, ${h.num(S.responses)} answers.`, ['l', 'r'])}
<h2>How prices moved since 2022</h2>
<p>DVSA has asked the same question four times. Each line below groups the answers into three bands. The share charging £41 or more grew from ${h.num(H['October 2022'][2], 1)} % to ${h.num(H['October 2025'][2], 1)} % in three years, while the share at £35 or less fell from about three quarters to about a fifth.</p>
${h.table(['Survey', '£35 or less', '£36 to £40', '£41 or more'], hist, 'Share of instructors by price of a one-hour lesson, Great Britain. DVSA instructor surveys.', ['l', 'r', 'r', 'r'])}
<h2>Region by region</h2>
<p>The regions are ordered by the share of instructors charging £41 or more. The last column sets the region's car test pass rate in ${h.yearLabel(h.lastYear)} beside the prices, from the DVSA centre tables. The two do not move together in any simple way, and the survey does not explain the regional differences.</p>
${h.table(['Region', '£35 or less', '£36 to £40', '£41 or more', 'Pass rate'], reg, `Lesson prices: DVSA survey, ${S.fieldwork}. Pass rate: car practical tests, ${h.yearLabel(h.lastYear)}, sum of the region's centres.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>What a few pounds an hour add up to</h2>
<p>Over 30 hours of lessons, at the national pass rates, the expected total moves from ${h.m(cost(35))} at £35 an hour to ${h.m(cost(40))} at £40 and ${h.m(cost(45))} at £45. Each pound on the hourly price adds ${h.m(30)} over 30 hours, roughly half a weekday test fee. The hours count for more than the price: a cheaper instructor who needs ten more hours costs more in the end. These totals are estimates built on the method set out on the ${h.a('cost-of-learning-to-drive', 'cost of a licence page')}.</p>
<h2>Finding an instructor with space</h2>
<p>The same survey found that ${h.num(S.availability.pc, 1)} % of instructors had room for new pupils in ${S.fieldwork}, ${h.num(S.availability.changePts, 1)} points more than in ${S.availability.previous}, and that ${h.num(S.workAtLeast25h, 1)} % worked at least 25 hours a week as instructors. A full diary is one reason a cheap quote can come with a wait before the first lesson. Since the 2026 booking rules, the learner books the test, but can enter the instructor's reference number so that the booking service checks the instructor is free at that time (${h.src('gov_rules_2026', 'booking rules')}). Agreeing that number early saves a change later, and a booking only has ${h.P.rules.changesAllowed}.</p>
<h2>Reading a quote</h2>
<p>The survey asks for the average price of a standard one-hour lesson, so it does not show block-booking discounts, the price of two-hour lessons, intensive courses or the fee some instructors charge for the use of their car on test day. Ask for the price per hour once those are included. Instructors must be approved by DVSA to charge for lessons; an approved instructor shows a green badge in the windscreen, a trainee a pink one. The survey report is on ${h.src('gov_adi_survey', 'GOV.UK')}; fees come from ${h.src('gov_cost', 'GOV.UK')}.</p>
`;
  },
});

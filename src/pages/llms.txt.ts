/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
import { CENTRES, LAST_YEAR, WAIT_MONTH } from '../lib/engine/centres';
export const GET: APIRoute = () => {
  const lines = [
    '# Test Centre Pass Rates',
    '',
    `> Pass rates and waiting times for each of the ${CENTRES.length} car driving test centres in England, Scotland and Wales: ${LAST_YEAR.replace('-', '/')} pass rate by centre, sex, age, first attempt and gearbox, three-year trend, median weeks from booking to test to ${WAIT_MONTH}, and the three centres a test can be moved to under the 2026 booking rules. Figures from the DVSA tables DRT122A to DRT122F, DRT112A and DRT121A to DRT121G (Open Government Licence v3.0), fees and rules from GOV.UK (last read ${LAST_UPDATED}). Published by Radif Partners, an independent publisher; not DVSA, books no tests, sells no cancellation alerts. Northern Ireland (DVA) is not covered.`,
    '',
    '## Tools and guides',
    `- [Driving test centre finder](${SITE_URL}${route('home', 'en')}): every car test centre near a postcode with its pass rate and wait.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the figures are built](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

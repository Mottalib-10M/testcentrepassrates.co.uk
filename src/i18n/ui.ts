import type { Locale } from './routes';
import META from '../data/meta.json';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [wy, wm] = META.lastWaitMonth.split('-');
const y0 = META.latestYear.slice(0, 4);
const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const en = {
  updatedOn: 'DVSA tables read on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Figures checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions learners ask', relatedCalculators: 'Next pages to check', sourcesTitle: 'Official tables and rules behind this page', writtenBy: 'Compiled by',
  asOf: `Pass rates for April ${y0} to March ${Number(y0) + 1} (DVSA, ${fmt(META.passRatesUpdated)}) and waiting times to ${MONTHS[Number(wm) - 1]} ${wy} (DVSA, ${META.waitsUpdated})`, lastUpdated: 'tables last read on', footerValidated: 'Figures from the DVSA car test tables, Open Government Licence v3.0', footerBrowser: 'Every search runs in your browser · nothing you type is sent · free, no email, no account, no booking',
  footerDisclaimer: 'Test Centre Pass Rates is an independent site published by Radif Partners. It is not DVSA, DVLA or any government body, books no tests and sells no cancellation alerts. Northern Ireland, where tests are run by the DVA, is not covered. Figures are indicative and do not replace an instructor\'s judgement.', footerPopular: '',
  notFound: 'There is no page at this address. The test centre finder and the page of each large centre are one click away.',
  readMore: 'Read more', disclaimer: 'Indicative figures from the DVSA tables: a pass rate describes past candidates, not your own chances, and does not replace your instructor\'s judgement. This is not a DVSA or government site.',
};
export function t(_lang: Locale) { return en; }

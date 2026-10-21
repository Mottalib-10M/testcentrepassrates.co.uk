/**
 * Labels of the latest data, for page titles and descriptions (safe to import from a page file: it does
 * not touch the routes). YL = latest financial year of the pass-rate tables, e.g. "2025/26".
 */
import { LAST_YEAR } from './engine/centres';
export const YL = LAST_YEAR.replace('-', '/');

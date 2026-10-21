/**
 * Full centre records (build time only: pages, tables, FAQ). Never import this file from a React tool:
 * it would ship 470 KB to the browser. Same source as the light list: scripts/update-data.py.
 */
import FULL from '../../data/centres.json';
import META from '../../data/meta.json';
import { NATIONAL as NAT } from './centres';

type Pair = [number, number];
export interface Full {
  id: string; name: string; country: string; region: string; lgv: boolean;
  /** Financial year → [tests conducted, passes]. */
  pass: Record<string, Pair>;
  sex: { m: Pair; f: Pair };
  /** First attempts: [conducted, passed, passed with zero faults]. */
  first: [number, number, number] | null;
  auto: Pair | null;
  age: Record<string, Pair>;
  cancel: { leave: number; disputes: number; weather: number; medical: number; total: number } | null;
  /** Month → [median weeks, weeks to 10 % booked, % of tests within 7 weeks, % of slots free]. */
  wait: Record<string, Array<number | null>>;
  /** DVSA list of the 3 nearest centres: [name, miles, id or null]. */
  near: Array<[string, number, string | null]>;
  addr: [string, string, string];
  en: [number, number];
  types: string;
  notes: string[];
}
export const META_DATA = META;
export const FULL_CENTRES = FULL as unknown as Full[];
const BY = new Map(FULL_CENTRES.map((c) => [c.id, c]));
export const full = (id: string): Full => { const c = BY.get(id); if (!c) throw new Error(`Unknown centre ${id}`); return c; };
export const pr = (x?: Pair | null) => (x && x[0] > 0 ? x[1] / x[0] : null);
export const years = (c: Full) => Object.keys(c.pass).sort();
export const months = (c: Full) => Object.keys(c.wait).sort();
export const lastWait = (c: Full) => { const m = months(c); const k = m[m.length - 1]; return k ? { month: k, median: c.wait[k][0], w10: c.wait[k][1], in7: c.wait[k][2], free: c.wait[k][3] } : null; };
/** Median wait in the same month one year earlier, when published. */
export const waitYearAgo = (c: Full) => { const l = lastWait(c); if (!l) return null; const [y, m] = l.month.split('-'); const k = `${Number(y) - 1}-${m}`; return c.wait[k] ? c.wait[k][0] : null; };
/** Region of the national waiting table (DRT121G spells "the Humber" in lower case). */
export const areaKey = (r: string) => (r === 'Yorkshire and The Humber' ? 'Yorkshire and the Humber' : r);
export const areaWait = (area: string, month: string) => { const a = (NAT.areas as Record<string, Record<string, number[]>>)[areaKey(area)]; return a?.[month] ?? null; };

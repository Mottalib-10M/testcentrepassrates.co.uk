/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engine of
 * `lib/engine/centres.ts` on the light DVSA list; none holds a figure of its own. A page sets its defaults
 * through the `props` of its ToolDef (same ids as the inputs; a centre is given by its id).
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as E from './engine/centres';
import { formatMoney, formatNumber, formatPercent } from './format';

const m = (n: number) => formatMoney(Math.round(n), 0);
const pc = (x: number | null, d = 1) => (x == null ? 'n/a' : formatPercent(x, d));
const pp = (x: number | null) => (x == null ? 'n/a' : formatPercent(x / 100, 1));
const wk = (x: number | null) => (x == null ? 'n/a' : `${formatNumber(x, Number.isInteger(x) ? 0 : 1)} weeks`);
const YL = E.LAST_YEAR.replace('-', '/');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ML = (() => { const [y, mo] = E.WAIT_MONTH.split('-'); return `${MONTHS[Number(mo) - 1]} ${y}`; })();

/** Centres in alphabetical order; the select value is the index in this list. */
export const CENTRE_LIST = [...E.CENTRES].sort((a, b) => a.n.localeCompare(b.n, 'en-GB'));
export const centreIndex = (id: string) => { const i = CENTRE_LIST.findIndex((c) => c.id === id); if (i < 0) throw new Error(`Unknown centre ${id}`); return i; };
const OPTS = CENTRE_LIST.map((c, i) => ({ value: String(i), label: c.n }));
const C = (v: number) => CENTRE_LIST[Math.max(0, Math.min(CENTRE_LIST.length - 1, Math.round(v)))];
const centre = (def: string, id = 'centre', label = 'Test centre') => ({ id, label, def: centreIndex(def), options: OPTS });
export const THEORY_LIST = [...E.THEORY_CENTRES].sort((a, b) => a.name.localeCompare(b.name, 'en-GB'));
export const theoryIndex = (id: string) => { const i = THEORY_LIST.findIndex((c) => c.id === id); if (i < 0) throw new Error(`Unknown theory centre ${id}`); return i; };
const r = (c: E.Lite) => (E.rate(c) ?? E.gbRate() * 100) / 100;
const SEX = [{ value: '0', label: 'Female' }, { value: '1', label: 'Male' }];
const SLOT = [{ value: '0', label: `Weekday (£${P.fees.practicalWeekday})` }, { value: '1', label: `Evening or weekend (£${P.fees.practicalEvening})` }];

const SPECS: Record<string, MiniSpec> = {
  odds: {
    title: 'Your estimated chance at one centre, by age and sex', cta: 'Find the centres around you', ctaPage: 'home',
    inputs: [centre('hendon-london'), { id: 'age', label: 'Age on the day of the test', def: 17, unit: 'yrs', max: 80, help: 'DVSA publishes rates for each age from 16 to 59, then 60 and over' }, { id: 'sex', label: 'Sex', def: 0, options: SEX }],
    run: (v) => {
      const c = C(v.centre); const s = v.sex === 1 ? 'm' : 'f';
      const o = E.odds(r(c), Math.max(16, v.age), s);
      return {
        head: [`Estimated chance at ${c.n}`, pc(o.p, 0)],
        rows: [[`${c.n}, all candidates ${YL}`, pp(E.rate(c))], [`Great Britain, ${s === 'm' ? 'men' : 'women'} aged ${Math.round(Math.max(16, v.age))}${v.age >= 60 ? '+' : ''}`, pc(o.national)], ['Great Britain, all candidates', pc(E.gbRate())], ['Expected attempts at that chance', formatNumber(E.expectedAttempts(o.p), 1)]],
        note: 'Estimate, not a DVSA figure: the centre rate multiplied by how far your age and sex sit from the national rate (DRT121C). Lessons and practice matter far more.',
      };
    },
  },
  cost: {
    title: 'What your licence is likely to cost', cta: 'Compare the centres near you', ctaPage: 'home',
    inputs: [centre('hendon-london'), { id: 'hours', label: 'Hours of lessons you expect', def: 30, unit: 'h', max: 200, help: 'Your own estimate: DVSA publishes no official average' }, { id: 'price', label: 'Price of a one-hour lesson', def: 38, unit: '£', max: 150, help: 'Half of instructors charge £36 to £40 (DVSA survey, October 2025)' }, { id: 'slot', label: 'Practical test slot', def: 0, options: SLOT }],
    run: (v) => {
      const c = C(v.centre);
      const x = E.licenceCost({ hours: v.hours, price: v.price, passRate: r(c), theoryRate: E.gbTheory(), evening: v.slot === 1, licence: 'online' });
      return {
        head: [`Expected total with a test at ${c.n}`, m(x.total)],
        rows: [['Lessons', m(x.lessons)], [`Theory tests (${formatNumber(x.theoryTries, 1)} on average at £${P.fees.theory})`, m(x.theory)], [`Practical tests (${formatNumber(x.practicalTries, 1)} at ${pp(E.rate(c))})`, m(x.practical)], ['Provisional licence online', m(x.licence)]],
        note: `Attempts = 1 / pass rate (theory ${pc(E.gbTheory())} in Great Britain, ${YL}). Fees from GOV.UK. Extra lessons before a retest are not counted.`,
      };
    },
  },
  within: {
    title: 'Chance of having passed after a number of attempts', cta: 'See first-time pass rates by centre', ctaPage: 'first-time-pass-rates',
    inputs: [centre('hendon-london'), { id: 'n', label: 'Attempts', def: 2, max: 10, help: 'Each attempt uses the national pass rate for that attempt number (DRT121D)' }],
    run: (v) => {
      const c = C(v.centre); const n = Math.max(1, Math.round(v.n));
      return {
        head: [`Passed within ${n} attempt${n > 1 ? 's' : ''} at ${c.n}`, pc(E.withinAttempts(r(c), n), 0)],
        rows: [['Pass rate here, all attempts', pp(E.rate(c))], ['First-attempt pass rate here', pp(c.f)], ['Great Britain, 1st attempt', pc(E.attemptRate(1))], ['Great Britain, 6th attempt or later', pc(E.attemptRate(6))]],
        note: 'Estimate: the centre rate scaled by the national rate of each attempt number, attempts treated as independent.',
      };
    },
  },
  wait: {
    title: `Waiting time at one centre, ${ML}`, cta: 'Compare waiting times across Britain', ctaPage: 'driving-test-waiting-times',
    inputs: [centre('hendon-london')],
    run: (v) => {
      const c = C(v.centre);
      const nb = c.nb.filter(E.hasCentre).map(E.centre);
      const best = nb.filter((x) => x.w != null).sort((a, b) => (a.w as number) - (b.w as number))[0];
      return {
        head: [`Median wait at ${c.n}`, wk(c.w)],
        rows: [['Weeks before 10 % of tests were booked', wk(c.w10)], ...nb.map((x) => [`${x.n} (you may move there)`, wk(x.w)] as [string, string])],
        note: best && c.w != null && (best.w as number) < c.w ? `Shortest of the three centres you may move to: ${best.n}. Weeks between booking and test, DVSA DRT122F.` : 'Weeks between booking and test, DVSA DRT122F.',
      };
    },
  },
  move: {
    title: 'Where a test booked here can be moved', cta: 'Read the 2026 booking rules', ctaPage: 'driving-test-booking-rules-2026',
    inputs: [centre('hendon-london', 'centre', 'Centre you booked')],
    run: (v) => {
      const c = C(v.centre);
      const nb = c.nb.filter(E.hasCentre).map(E.centre);
      const best = [...nb].sort((a, b) => (E.rate(b) ?? 0) - (E.rate(a) ?? 0))[0];
      return {
        head: [best ? 'Highest pass rate among them' : 'No other centre listed', best ? `${best.n}, ${pp(E.rate(best))}` : 'n/a'],
        rows: [[`${c.n} (booked)`, `${pp(E.rate(c))} · ${wk(c.w)}`], ...nb.map((x) => [x.n, `${pp(E.rate(x))} · ${wk(x.w)}`] as [string, string])],
        note: `Pass rate ${YL} · median wait ${ML}. Since 9 June 2026 a test can only move to these 3 centres or back to the first one booked, within ${P.rules.changesAllowed} changes.`,
      };
    },
  },
  compare: {
    title: 'Two centres side by side', cta: 'Find every centre near a postcode', ctaPage: 'home',
    inputs: [centre('hendon-london', 'a', 'First centre'), centre('mill-hill-london', 'b', 'Second centre')],
    run: (v) => {
      const a = C(v.a), b = C(v.b);
      const d = E.rate(a) != null && E.rate(b) != null ? (E.rate(a) as number) - (E.rate(b) as number) : null;
      return {
        head: [`${a.n} minus ${b.n}, pass rate`, d == null ? 'n/a' : `${d > 0 ? '+' : ''}${formatNumber(d, 1)} pts`],
        rows: [['Pass rate', `${pp(E.rate(a))} · ${pp(E.rate(b))}`], ['First attempt', `${pp(a.f)} · ${pp(b.f)}`], ['Median wait', `${wk(a.w)} · ${wk(b.w)}`], ['Tests in the year', `${formatNumber(a.t, 0)} · ${formatNumber(b.t, 0)}`], ['Distance between them', `${formatNumber(E.miles(a.en, b.en), 0)} miles`]],
        note: `${YL} pass rates, ${ML} waits. Half of the larger centres moved by more than ${formatNumber(E.SWING, 1)} points from one year to the next.`,
      };
    },
  },
  auto: {
    title: 'Automatic or manual at one centre', cta: 'See automatic pass rates everywhere', ctaPage: 'automatic-driving-test-pass-rates',
    inputs: [centre('hendon-london')],
    run: (v) => {
      const c = C(v.centre);
      const d = c.a != null && c.mn != null ? c.a - c.mn : null;
      return {
        head: [`Automatic pass rate at ${c.n}`, pp(c.a)],
        rows: [['Manual cars', pp(c.mn)], ['Gap, automatic minus manual', d == null ? 'n/a' : `${d > 0 ? '+' : ''}${formatNumber(d, 1)} pts`], ['Great Britain, automatic', pc(E.gbAuto())]],
        note: `${YL}, DVSA DRT122E. A pass in an automatic only lets you drive automatics.`,
      };
    },
  },
  first: {
    title: 'First attempt at one centre', cta: 'Check the chance of passing within a few attempts', ctaPage: 'pass-rate-by-attempt',
    inputs: [centre('hendon-london')],
    run: (v) => {
      const c = C(v.centre);
      return {
        head: [`First-attempt pass rate at ${c.n}`, pp(c.f)],
        rows: [['All attempts', pp(E.rate(c))], ['First-time passes with no driving fault', c.z == null ? 'n/a' : formatNumber(c.z, 0)], ['Great Britain, first attempt', pc(E.gbFirst())]],
        note: `${YL}, DVSA DRT122C.`,
      };
    },
  },
  theory: {
    title: 'Car theory test pass rate at one centre', cta: 'Work out the cost of the whole licence', ctaPage: 'cost-of-learning-to-drive',
    inputs: [{ id: 'tc', label: 'Theory test centre', def: theoryIndex('birmingham'), options: THEORY_LIST.map((t, i) => ({ value: String(i), label: t.name })) }],
    run: (v) => {
      const t = THEORY_LIST[Math.max(0, Math.min(THEORY_LIST.length - 1, Math.round(v.tc)))];
      const p = E.theoryRate(t); const ys = Object.keys(t.pass).sort();
      const p0 = E.theoryRate(t, ys[0]);
      return {
        head: [`Theory pass rate at ${t.name}, ${YL}`, pc(p)],
        rows: [['Women', pc(t.sex.f[1] / t.sex.f[0])], ['Men', pc(t.sex.m[1] / t.sex.m[0])], [`${ys[0].replace('-', '/')}`, pc(p0)], ['Expected theory fees', p ? m(P.fees.theory * E.expectedAttempts(p)) : 'n/a']],
        note: `Great Britain: ${pc(E.gbTheory())}. DVSA DRT112A. Fee £${P.fees.theory} per attempt, attempts = 1 / pass rate.`,
      };
    },
  },
  refund: {
    title: 'Can you still change or cancel without losing the fee?', cta: 'Read the 2026 booking rules', ctaPage: 'driving-test-booking-rules-2026',
    inputs: [{ id: 'days', label: 'Full working days before the test', def: 12, max: 200, help: 'DVSA counts Monday to Saturday; Sundays and public holidays do not count' }, { id: 'used', label: 'Changes already made on this booking', def: 0, max: 10 }],
    run: (v) => {
      const left = Math.max(0, P.rules.changesAllowed - Math.round(v.used));
      const refund = Math.round(v.days) >= P.rules.refundWorkingDays;
      return {
        head: ['Changes left on this booking', String(left)],
        rows: [['Cancel now and get the fee back', refund ? 'Yes, in full' : 'No'], ['What to do with no change left', 'Cancel and book again'], ['Fee to rebook (weekday)', m(P.fees.practicalWeekday)]],
        note: `Rules for car tests since 31 March 2026: ${P.rules.changesAllowed} changes per booking, full refund at least ${P.rules.refundWorkingDays} full working days before. A change made by DVSA resets the count.`,
      };
    },
  },
  gbyear: {
    title: 'The national pass rate in any year since 2007', cta: 'Find the centres around you', ctaPage: 'home',
    inputs: [{ id: 'y', label: 'Financial year', def: Object.keys(E.NATIONAL.practical).length - 1, options: Object.keys(E.NATIONAL.practical).map((y, i) => ({ value: String(i), label: y.replace('-', '/') })) }],
    run: (v) => {
      const ys = Object.keys(E.NATIONAL.practical); const y = ys[Math.max(0, Math.min(ys.length - 1, Math.round(v.y)))];
      const row = (E.NATIONAL.practical as Record<string, Record<string, [number, number]>>)[y];
      return {
        head: [`Great Britain, car practical test, ${y.replace('-', '/')}`, pc(row.t[1] / row.t[0])],
        rows: [['Tests', formatNumber(row.t[0], 0)], ['Women', pc(row.f[1] / row.f[0])], ['Men', pc(row.m[1] / row.m[0])], [`${YL} for comparison`, pc(E.gbRate())]],
        note: 'DVSA DRT121A, April to March. 2020/21 was cut short by the pandemic.',
      };
    },
  },
};
export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini-calculator ${kind}`);
  return s;
}
export const SPEC_KINDS = Object.keys(SPECS);
